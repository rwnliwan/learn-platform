import type { V2Lesson } from "../lib/types";

// NMS: 4 box -> 2 survive (IoU 0.62 ditekan, IoU 0.0 lolos).
const FIG_NMS = `<svg viewBox="0 0 480 250" role="img" aria-label="NMS menekan box yang tumpang tindih.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="30" y1="210" x2="460" y2="210"/><line x1="30" y1="30" x2="460" y2="30"/></g>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<text x="130" y="20" fill="var(--chart-text)">sebelum NMS (4 box)</text>
<rect x="70" y="50" width="80" height="80" fill="none" stroke="var(--c4)" stroke-width="3"/><text x="110" y="145" fill="var(--chart-text)">0,90</text>
<rect x="85" y="65" width="80" height="80" fill="none" stroke="var(--c4)" stroke-width="2" opacity="0.6"/><text x="125" y="160" fill="var(--chart-text)">0,75</text>
<rect x="75" y="55" width="76" height="76" fill="none" stroke="var(--c4)" stroke-width="2" opacity="0.4"/><text x="113" y="175" fill="var(--chart-text)">0,60</text>
<rect x="170" y="90" width="60" height="60" fill="none" stroke="var(--c3)" stroke-width="3"/><text x="200" y="165" fill="var(--chart-text)">0,80</text>
<text x="360" y="20" fill="var(--chart-text)">sesudah NMS (2 box)</text>
<rect x="300" y="50" width="80" height="80" fill="none" stroke="var(--c1)" stroke-width="3"/><text x="340" y="145" fill="var(--text)">0,90 ✓</text>
<rect x="400" y="90" width="60" height="60" fill="none" stroke="var(--c1)" stroke-width="3"/><text x="430" y="165" fill="var(--text)">0,80 ✓</text>
<text x="340" y="190" fill="var(--text-muted)" font-size="10">IoU 0,62 &amp; 0,55 → ditekan</text>
<text x="430" y="190" fill="var(--text-muted)" font-size="10">IoU 0,0 → lolos</text>
</g>
<text x="240" y="238" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">NMS: yang terkuat menang, yang tumpang tindih gugur</text>
</svg>`;

export const dle13: V2Lesson = {
  slug: "dle13-deteksi-objek",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE13 — Deteksi Objek (YOLO): Dari 'Ada Kucing' ke 'Kucing di Sana'",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-parkir",
      eyebrow: "Langkah 1 · Cerita",
      title: "Klasifikasi 99% yang tidak tahu di mana",
      prose: [
        "Bank memakai CNN klasifikasi untuk verifikasi KTP: 'foto ini KTP atau bukan?' — 99% akurat. Lalu mereka ingin yang lebih berguna: 'di mana NIK-nya? di mana fotonya? di mana tanda tangannya?' Klasifikasi hanya menjawab 'ADA KTP' — tidak tahu LETAKNYA. Untuk ekstraksi otomatis, letak = segalanya.",
        "Tim mencoba sliding window: potong citra jadi 1.000 keping, klasifikasikan satu per satu — 1.000 forward pass per foto = 40 detik. Tidak bisa produksi. Lalu YOLO: SATU forward pass, semua objek + kotaknya keluar sekaligus — 40 detik menjadi 0,03 detik. 1.300x lebih cepat.",
        "Twist-nya: deteksi objek bukan 'klasifikasi yang lebih sulit' — ia masalah yang BERBEDA: apa + di mana, sekaligus, dalam 1 pass. Separuh pekerjaan DL vision (kata lowongan SwiftMind) ada di sini. Lesson ini = arsitektur deteksi, IoU, NMS, mAP — dari 'ada kucing' ke 'kucing di koordinat itu'.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan perbedaan klasifikasi vs deteksi vs segmentasi; (2) menghitung IoU dua kotak; (3) mengimplementasikan NMS; (4) menjelaskan ide inti YOLO (grid + anchor); (5) membaca mAP dan memilih threshold.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Anatomi deteksi — Langkah 3 · Lab: IoU & NMS — Langkah 4 · YOLO & mAP — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Langkah 7 · Pendalaman — Checkpoint.",
      ],
      tasks: [],
      reference: "Klasifikasi = 'apa'. Deteksi = 'apa + di mana'. Beda masalah, beda arsitektur.",
    },
    {
      id: "konsep-anatomi",
      eyebrow: "Langkah 2 · Anatomi deteksi",
      title: "Kotak, skor, dan IoU: bahasa deteksi objek",
      prose: [
        "Output detektor = daftar kotak: [x1, y1, x2, y2] + label + confidence. Satu citra bisa punya 0–100 kotak. Evaluasi butuh ukuran 'kotak prediksi vs kotak asli': IoU (Intersection over Union) = luas irisan / luas gabungan. IoU 1,0 = sempurna; 0,0 = tidak bersentuhan; >0,5 = 'benar' (ambang umum).",
        "Contoh angka: kotak A [10,10,50,50] (40×40=1.600), kotak B [15,15,55,55] (1.600). Irisan: [15,15,50,50] = 35×35 = 1.225. Gabungan: 1.600+1.600−1.225 = 1.975. IoU = 1.225/1.975 = 0,62 → 'benar' (>0,5) tetapi tidak sempurna. Lab menghitung ini persis.",
        "Masalah yang dipecahkan NMS: detektor mengeluarkan 3 kotak untuk 1 wajah (skor 0,90/0,75/0,60, saling tumpang tindih). NMS: urutkan by skor → ambil terkuat → tekan semua yang IoU > 0,5 dengannya → ulang. Hasil: 1 kotak per objek. Tanpa NMS: 1 wajah = 3 deteksi = metrik hancur.",
        "Kepribadian NMS: seperti juri lomba — yang nilainya tertinggi menang, yang 'terlalu mirip' dengannya didiskualifikasi sebagai duplikat. Sederhana, serakah (greedy), dan bekerja 30 tahun.",
        "Format kotak — dua dialek. [x1,y1,x2,y2] (sudut) vs [cx,cy,w,h] (tengah + ukuran). YOLO memakai yang kedua (mudah untuk offset anchor!). Konversi: cx=(x1+x2)/2. Salah format = kotak ngaco 100% — cek SELALU saat gabung dataset (COCO vs YOLO format beda!).",
        "Confidence vs class score — dua angka. Confidence = 'ada objek?' (objectness); class score = 'kelas apa?'. Skor final = keduanya dikali. Kotak 'yakin ada kucing 90%' = 0,95 (ada) × 0,95 (kucing). Pisahkan saat debug: objectness rendah = tidak lihat; class rendah = lihat tetapi bingung.",
        "Hard negative mining — fokus ke yang sulit. 99% background mudah; latih di 99% = buang waktu. OHEM: tiap batch ambil 70% contoh TERSULIT (loss tertinggi). +2-3 poin mAP untuk objek sulit (kecil, gelap). Seperti belajar: fokus ke soal yang salah, bukan yang sudah bisa.",
        "Class imbalance deteksi — background vs objek. 1 citra: 10.000 anchor background vs 5 objek (2.000:1!). Focal loss — fungsi loss yang mengalikan cross-entropy dengan (1−p)^γ sehingga contoh mudah (background yang sudah yakin benar) hampir tidak berkontribusi pada gradien dan model dipaksa fokus ke contoh sulit — juga berlaku di sini: RetinaNet membuktikannya (+9 poin mAP). Imbalance = musuh universal vision; focal = senjata universal.",
      ],
      formula: String.raw`\text{IoU} = \frac{|A \cap B|}{|A \cup B|} \qquad \text{benar jika IoU} > 0{,}5`,
      formulaNote: "IoU = irisan dibagi gabungan dua kotak; A = prediksi, B = ground truth. Contoh lab: A=[10,10,50,50], B=[15,15,55,55] → irisan 1.225, gabungan 1.975 → IoU=0,62. Ambang 0,5 = standar COCO untuk 'true positive'.",
      figure: {
        svg: FIG_NMS,
        alt: "NMS menekan 4 box menjadi 2.",
        caption: "NMS: 4 box → 2 box.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Detektor yang bagus = confidence tinggi.' Salah — confidence tinggi + IoU rendah = 'yakin tetapi salah tempat'. Metrik yang benar = mAP (menggabungkan presisi di berbagai ambang IoU). Jangan optimasi confidence; optimasi mAP.",
      },
      reference: "IoU = bahasa kebenaran spasial. NMS = satu objek satu kotak.",
    },
    {
      id: "lab-nms",
      eyebrow: "Langkah 3 · Lab NMS",
      title: "Lab: IoU 0,62 dan NMS yang menekan",
      prose: [
        "Empat kotak: tiga tumpang tindih di kiri atas (skor 0,90/0,75/0,60), satu jauh di kanan bawah (0,80). Implementasikan iou() dan nms(): urutkan skor menurun, ambil terkuat, tekan yang IoU ≥ 0,5.",
        "Hasil: IoU(b0,b1) = 0,6203 (>0,5 → ditekan), IoU(b0,b2) = 0,0 (jauh → lolos). NMS keep = [0, 2]: kotak terkuat kiri + kotak kanan. Coba ubah: threshold 0,9 — lihat kotak 0,75 LOLOS (IoU 0,62 < 0,9) → duplikat! Threshold = kenop agresivitas.",
        "Cara membaca: keep=[0,2] = 'dua objek terdeteksi'. Interpretasi: NMS mengubah 4 dugaan menjadi 2 keputusan — inilah yang dilihat pengguna.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `iou(a, b)` untuk box [x1,y1,x2,y2]" },
        { id: "t2", text: "Implementasikan `nms` (greedy, threshold 0.5), `print` hasilnya" },
      ],
      expected: "iou(b0,b1)=0.6203 iou(b0,b2)=0.0 nms_keep=[0, 2]",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "NMS itu SERAKAH (greedy) — tidak optimal secara global, tetapi 99% cukup dan super cepat. Pelajaran umum DL: heuristik sederhana yang cepat > optimasi sempurna yang lambat. YOLO menang karena filosofi ini di semua level.",
      },
      hints: [
        "irisan: ix1=max(a0,b0), ix2=min(a2,b2); inter = max(0,ix2-ix1)*max(0,iy2-iy1)",
        "iou = inter / (area_a + area_b - inter)",
        "nms: order = argsort(scores)[::-1]; ambil [0], tekan yang iou >= 0.5, ulang",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np
boxes = np.array([[10,10,50,50],[15,15,55,55],[100,100,140,140],[12,12,48,48]])
scores = np.array([0.9, 0.75, 0.8, 0.6])

# TULIS KODEMU
def iou(a, b):
    # TODO t1: irisan / gabungan, box format [x1,y1,x2,y2]
    return 0.0

def nms(boxes, scores, thresh=0.5):
    # TODO t2: greedy — skor tertinggi menang, tekan IoU >= thresh
    return []

# UJI (jangan ubah)
print("iou(b0,b1) =", iou(boxes[0], boxes[1]))
print("iou(b0,b2) =", iou(boxes[0], boxes[2]))
print("nms_keep =", nms(boxes, scores))`,
        lockLines: 4,
        solution: `# SEED — jangan ubah
import numpy as np
boxes = np.array([[10,10,50,50],[15,15,55,55],[100,100,140,140],[12,12,48,48]])
scores = np.array([0.9, 0.75, 0.8, 0.6])

# TULIS KODEMU
def iou(a, b):
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)
    aa = (a[2]-a[0]) * (a[3]-a[1]); bb = (b[2]-b[0]) * (b[3]-b[1])
    return round(inter / (aa + bb - inter), 4)

def nms(boxes, scores, thresh=0.5):
    order = np.argsort(scores)[::-1]
    keep = []
    while len(order):
        i = order[0]; keep.append(int(i))
        rest = [j for j in order[1:] if iou(boxes[i], boxes[j]) < thresh]
        order = np.array(rest)
    return keep

# UJI (jangan ubah)
print("iou(b0,b1) =", iou(boxes[0], boxes[1]))
print("iou(b0,b2) =", iou(boxes[0], boxes[2]))
print("nms_keep =", nms(boxes, scores))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "iou\\(b0,b1\\)\\s*=\\s*0\\.6203", label: "IoU(b0,b1) = 0.6203", msg: "Irisan 1225 / gabungan 1975." },
          { kind: "stdout_matches", task: "t1", pattern: "iou\\(b0,b2\\)\\s*=\\s*0\\.0", label: "IoU(b0,b2) = 0.0", msg: "Tidak bersentuhan." },
          { kind: "stdout_matches", task: "t2", pattern: "nms_keep\\s*=\\s*\\[0, 2\\]", label: "NMS keep = [0, 2]", msg: "Terkuat kiri + kotak kanan." },
        ],
      },
      reference: "IoU = kebenaran spasial; NMS = satu objek satu kotak.",
    },
    {
      id: "konsep-yolo",
      eyebrow: "Langkah 4 · YOLO & mAP",
      title: "YOLO: lihat sekali, deteksi semua",
      prose: [
        "Ide YOLO (2016): bagi citra jadi grid S×S (misal 7×7). Tiap sel grid bertanggung jawab atas objek yang TITIK PUSATNYA jatuh di sel itu — prediksi B kotak + confidence + probabilitas kelas. Satu forward pass CNN → tensor S×S×(B×5+C). 7×7×(2×5+20) = 1.470 angka = semua deteksi sekaligus!",
        "Anchor boxes (YOLOv2+): tiap sel punya 'kotak referensi' berbagai bentuk (kotak jangkung untuk orang, gepeng untuk mobil). Model memprediksi OFFSET dari anchor, bukan kotak mentah — lebih mudah belajar ('geser sedikit' vs 'tebak dari nol'). 3-9 anchor per sel = menangani objek berbagai ukuran.",
        "Evolusi: YOLOv1 (grid) → v2 (anchor) → v3 (multi-skala: deteksi objek kecil/besar terpisah) → v5/v8 (engineering matang, Ultralytics) → v10/v11 (NMS-free, transformer hybrid). Untuk produksi 2026: YOLOv8/v11 = standar (cepat, dokumentasi, ekspor ONNX mudah).",
        "mAP (mean Average Precision): metrik resmi. Untuk tiap kelas: urutkan prediksi by confidence → hitung presisi-recall di tiap ambang → area di bawah kurva = AP. Rata-rata semua kelas = mAP. mAP@0,5 (ambang IoU 0,5) vs mAP@0,5:0,95 (rata-rata 10 ambang — LEBIH KETAT). YOLOv8n: mAP@0,5:0,95 ≈ 0,37 (COCO); model besar ≈ 0,55.",
        "Kepribadian YOLO: seperti pramugari menghitung penumpang sekilas — tidak memeriksa satu per satu (sliding window), melainkan memindai kabin sekali dan tahu siapa di mana. Kecepatan = fitur, bukan bonus.",
        "Loss YOLO — tiga komponen. (1) Lokalisasi: MSE koordinat (kotak tepat?). (2) Confidence: BCE ada/tidak. (3) Klasifikasi: CE kelas. Bobot: lokalisasi × 5 (kotak = inti!). Tanpa pembobotan: model 'malas' — prediksi semua background (mayoritas!).",
        "Augmentasi deteksi — hati-hati. Flip horizontal: kotak ikut flip (mudah). Rotate/crop: kotak harus dihitung ulang (salah = label rusak!). Mosaic (4 citra digabung): +2 poin mAP, standar YOLO. Augmentasi salah = melatih dengan label salah — lebih buruk dari tanpa augmentasi.",
        "TensorRT/ONNX — deploy cepat. YOLO PyTorch → ONNX → TensorRT: 3x FPS di GPU NVIDIA (30→90!). 1 hari konversi untuk 3x throughput = ROI tertinggi di deploy vision. Jangan serve PyTorch mentah di produksi.",
        "Kalibrasi confidence — jangan percaya mentah. Model 'yakin 90%' tetapi benar 70% = miscalibrated. Temperature scaling (1 jam) → ECE <0,05. Untuk threshold operasional (alarm!), kalibrasi WAJIB — confidence mentah = kebohongan sistematis.",
      ],
      formula: String.raw`\text{mAP} = \frac{1}{C}\sum_{c=1}^{C} \text{AP}_c \qquad \text{AP} = \int_0^1 P(R)\,dR`,
      formulaNote: "mAP = rata-rata Average Precision semua kelas C; AP = luas area kurva presisi-recall. Contoh: 80 kelas COCO, AP kucing 0,72, AP anjing 0,68, ... → mAP = rata-rata. mAP@0,5:0,95 = rata-rata di 10 ambang IoU (0,5–0,95).",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Pilih YOLO dari KEBUTUHAN KECEPATAN: butuh 30 FPS (CCTV)? YOLOv8n (nano, cepat, mAP 0,37). Butuh akurasi maksimal (analisis medis)? YOLOv8x atau dua tahap (Faster R-CNN, lambat, mAP 0,55). Kecepatan vs akurasi = kenop pertama; ukuran model = kenop kedua.",
      },
      reference: "Grid + anchor + 1 pass = YOLO. mAP = metrik resmi; pilih varian dari FPS.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: arsitektur vision apa?",
      prose: [
        "Skenario 1 — hanya perlu 'ada/tidak' → klasifikasi CNN. Jangan bayar deteksi untuk pertanyaan klasifikasi.",
        "Skenario 2 — butuh lokasi, real-time (CCTV, parkir) → YOLOv8n/s. 30+ FPS, mAP cukup.",
        "Skenario 3 — butuh lokasi, akurasi maksimal (medis) → YOLOv8x atau Faster R-CNN. Lambat tidak apa.",
        "Skenario 4 — butuh bentuk presisi (tumor, cacat) → segmentasi semantik (klasifikasi tiap piksel menjadi mask yang mengikuti lekuk objek), bukan kotak.",
        "Skenario 5 — objek kecil (drone, citra satelit) → YOLO multi-skala + resolusi tinggi. Objek kecil = musuh utama detektor.",
        "Aturan praktis 10 detik: (1) lokasi? tidak → klasifikasi. (2) real-time? ya → YOLO kecil. (3) bentuk presisi? → segmentasi. (4) ukur mAP, bukan confidence.",
        "Skenario 6 — dataset kecil + objek jelas → fine-tune YOLO pretrained (COCO) — 100 citra cukup! Jangan dari nol.",
      ],
      tasks: [],
    },
    {
      id: "minicase-ktp",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: ekstraksi KTP 50.000/hari",
      prose: [
        "Bank: 50.000 foto KTP/hari, butuh ekstraksi NIK + nama + foto. Opsi A: sliding window + klasifikasi = 40 detik/foto → 50.000 × 40 = 23 hari compute/hari — mustahil. Opsi B: YOLOv8s (0,03 detik/foto) → 25 menit/hari di 1 GPU. Biaya: Rp8 ribu/jam × 0,42 jam = Rp3.360/hari. Akurasi: mAP@0,5 = 0,94 untuk 3 kelas (nik, nama, foto).",
        "Pipeline: YOLO deteksi 3 region → crop → OCR per region (bukan seluruh foto!) → validasi format NIK (16 digit). OCR di crop kecil: akurasi 98% vs 91% di foto penuh (noise berkurang). End-to-end: 94% × 98% ≈ 92% otomatisasi penuh; 8% → review manusia. Penghematan: 46.000 × Rp2.000 (manual) = Rp92 juta/hari.",
        "Pembahasan: kunci = DEKOMPOSISI (deteksi → crop → OCR), bukan 'satu model ajaib'. Tiap tahap terukur (mAP, akurasi OCR). Jika gagal: tahu di tahap mana (atribusi!).",
        "Cara membaca: 0,03 detik bukan 'cepat' — ia yang MEMUNGKINKAN. Di bawah 1 detik/foto = real-time; di atasnya = batch semalam. Ambang kualitatif, bukan kuantitatif.",
        "Interpretasi: deteksi objek = 'mata' yang memberi tahu 'tangan' (OCR) di mana bekerja. Visi yang baik = dekomposisi yang baik.",
        "Anotasi aktif — hemat 70%. Label 100 → latih → prediksi 1.000 → manusia koreksi yang ragu (active learning) → latih lagi. 3 iterasi = 500 anotasi untuk kualitas 2.000. Anotasi cerdas > anotasi banyak.",
        "Monitoring drift — kuartalan. Sampel 200 prediksi/bulan → label manual → mAP masih >0,9? Format KTP berubah (e-KTP baru!) = drift = retrain. Model vision membusuk diam-diam; ukur atau menyesal.",
      ],
      tasks: [],
    },
    {
      id: "pendalaman-dua-tahap",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Two-stage vs one-stage: anatomi trade-off kecepatan–akurasi",
      prose: [
        "Anatomi two-stage (Faster R-CNN): tahap 1, Region Proposal Network (RPN) memindai feature map dan mengusulkan ~2.000 kandidat region yang 'kemungkinan ada objek'; tahap 2, tiap region di-crop via ROI pooling ke ukuran tetap lalu diklasifikasi dan kotak-nya diregresi satu per satu. Kenapa akurat: model 'melihat dua kali' — proposal kasar lalu verifikasi detail pada resolusi ROI yang tinggi. Angka tipikal di COCO: mAP@0,5:0,95 sekitar 0,42–0,55 tergantung backbone, dengan kecepatan 5–7 FPS di GPU kelas menengah. Kapan memilihnya: inspeksi presisi (cacat las, citra medis), analisis offline/batch di mana tiap milidetik tidak penting, dan kasus objek kecil-menumpuk di mana one-stage kewalahan.",
        "Anatomi one-stage (YOLO, RetinaNet, FCOS): tanpa proposal — tiap lokasi grid langsung memprediksi kotak + kelas dalam satu pass (dense prediction). Kenapa cepat: tidak ada tahap kedua, tidak ada 2.000 klasifikasi ulang. Varian anchor-based (YOLO, RetinaNet) memakai kotak referensi (anchor) per lokasi; varian anchor-free (FCOS, CenterNet) memprediksi titik pusat + lebar-tinggi langsung — menghilangkan hyperparameter anchor sama sekali, dengan trade-off sedikit lebih sulit konvergen pada dataset kecil. Angka tipikal: YOLOv8n ~80 FPS dengan mAP 0,37; YOLOv8x ~20 FPS dengan mAP 0,53. Polanya jelas: akurasi dibeli dengan latensi.",
        "Anchor design — pekerjaan praktisi yang paling sering di-skip. Anchor adalah 'tebakan awal bentuk kotak' di tiap sel grid (misal 3 skala × 3 rasio aspek = 9 anchor). Cara senior: jalankan k-means clustering pada ground-truth boxes DATASET-MU SENDIRI, bukan memakai default COCO — karena distribusi ukuran objek drone (kecil, kotak) vs dataset traffic (orang jangkung, mobil gepeng) sangat berbeda. Aturan keputusan: plot histogram lebar-tinggi objek; pastikan anchor menutupi persentil 5–95 distribusi itu. Anchor default pada dataset objek kecil bisa menurunkan recall 10–15 poin tanpa satu pun baris kode yang 'salah' — failure yang sunyi dan mahal.",
        "NMS lanjutan — greedy NMS (yang kamu implementasikan di lab) punya titik buta: kerumunan. Dua orang bertumpuk dengan IoU 0,7 → yang satu ditekan padahal keduanya nyata. Soft-NMS: alih-alih menghapus, ia MENURUNKAN skor kotak bertumpuk secara proporsional terhadap IoU — kotak yang benar-benar ganda tetap hilang, tetapi objek bertumpuk selamat dengan skor lebih rendah; +1–2 poin AP pada dataset padat seperti CrowdHuman. DIoU-NMS: menimbang jarak antar pusat kotak, bukan cuma luas overlap — lebih adil untuk objek berdekatan. Tuning praktis: scene padat → threshold 0,6–0,7 + Soft-NMS; butuh presisi (satu objek satu kotak) → 0,4–0,5 greedy.",
        "Membaca mAP seperti senior: metrik primer COCO adalah mAP@0,5:0,95 — rata-rata AP pada 10 ambang IoU dari 0,5 sampai 0,95. Ia sengaja KETAT: kotak 'asal kena' (IoU 0,55) lolos di AP50 tetapi gagal di AP75. Diagnostiknya: gap AP50 vs AP75 besar → lokalisasi lemah (perbaiki regresi kotak / loss lokalisasi, bukan tambah data). Lalu baca APs/APm/APl (small/medium/large): APs rendah + APm/AP1 normal = buta objek kecil — diagnosis presisi, bukan vonis generik 'model jelek'. Aturan: JANGAN tuning sebelum membaca AP per ukuran; tuning buta = mengobati gejala yang salah.",
        "Failure mode objek kecil — kenapa terjadi: backbone men-downsample 32x, sehingga objek 16×16 piksel menjadi setengah piksel di feature map — informasinya HILANG sebelum detektor sempat melihat. Tiga lapis solusi: (a) naikkan resolusi input 640→1280 — APs naik signifikan dengan biaya ~4x compute; (b) Feature Pyramid Network (FPN) — deteksi dilakukan di multi-skala feature map, objek kecil dibaca dari level resolusi tinggi; (c) tiling untuk citra raksasa (satelit/drone 4000px dipotong jadi tile 512px, deteksi per tile, gabungkan + NMS global) — bisa +15 poin APs di citra udara. Pilih dari kendala: latency ketat → FPN; citra raksasa → tiling.",
        "Failure mode class imbalance & domain shift. Imbalance: ukur per-class AP — kelas langka dengan AP 0,05 akan 'hilang' di balik mAP rata-rata 0,45! Senjata: focal loss, class-aware sampling (batch dipaksa memuat kelas langka), dan oversampling citra yang mengandung kelas minoritas. Domain shift: model yang dilatih citra siang cerah bisa anjlok 20–30 poin mAP pada malam hujan — bukan karena model 'rusak', melainkan distribusinya bergeser. Solusi berlapis: augmentasi domain (brightness, weather, noise) sebagai pertahanan pertama; VALIDASI WAJIB di distribusi deployment (jangan validasi di domain sumber lalu kaget di produksi); domain adaptation bila gap tetap besar. Aturan senior: metrik validasi yang tidak mencerminkan deployment = angka hiburan.",
        "Aturan keputusan senior untuk trade-off akurasi–latensi: (1) FPS adalah constraint KERAS — CCTV butuh 30 FPS berarti model 40ms tidak lolos seleksi betapa pun mAP-nya tinggi; (2) di dalam constraint itu, maksimalkan mAP; (3) mulai dari varian TERKECIL yang memenuhi mAP minimum, naikkan ukuran sampai FPS mepet batas — jangan mulai dari yang terbesar; (4) optimasi deployment (TensorRT/ONNX, kuantisasi INT8: +2–3x FPS dengan biaya −1–2 poin mAP — UKUR, jangan asumsikan) sering memberi lebih banyak daripada ganti arsitektur. Urutan kerja: constraint → baseline kecil → ukur → naikkan → optimasi deploy. Arsitektur dipilih terakhir, bukan pertama.",
      ],
      formula: String.raw`\text{mAP}_{0,5:0,95} = \frac{1}{10}\sum_{t \in \{0,5; 0,55; \dots; 0,95\}} \text{AP}_t`,
      formulaNote: "Metrik primer COCO: rata-rata Average Precision pada 10 ambang IoU (0,5 s.d. 0,95). Contoh: AP50=0,78 tetapi AP75=0,41 → mAP@0,5:0,95 ≈ 0,55 — gap ini mendiagnosis lokalisasi lemah. Baca juga APs/APm/APl (berdasar luas objek: kecil <32², sedang, besar >96² piksel) untuk diagnosis buta-objek-kecil.",
      tasks: [],
      reference: "Two-stage = akurat & lambat (verifikasi 2 tahap). One-stage = cepat (1 pass). Anchor dari data sendiri; NMS disesuaikan kerumunan; baca AP per ukuran; FPS = constraint keras.",
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
        "Deteksi = 'apa + di mana' sekaligus; output = kotak + label + confidence.",
        "IoU = irisan/gabungan; >0,5 = benar; NMS = satu objek satu kotak (greedy).",
        "YOLO: grid S×S + anchor boxes, 1 forward pass = semua deteksi.",
        "mAP = rata-rata AP semua kelas; mAP@0,5:0,95 lebih ketat dari @0,5.",
        "Pilih varian dari FPS: nano untuk real-time, x untuk akurasi maksimal.",
      ],
      next: { label: "DLE14 — Segmentasi (U-Net)", href: "/v2/learn/dle14-segmentasi-unet" },
      quiz: [
        {
          q: "IoU prediksi vs ground truth = 0,62. Kesimpulan?",
          options: [
            { text: "Benar (>0,5) tetapi tidak sempurna", why: "Tepat: 0,62 melewati ambang COCO; 1,0 = sempurna.", correct: true },
            { text: "Salah total", why: "0,62 jauh dari 0 — tumpang tindih substansial.", correct: false },
            { text: "Sempurna", why: "Sempurna = IoU 1,0 — kotak prediksi tepat menutupi ground truth.", correct: false },
            { text: "Tidak bisa dinilai", why: "IoU justru alat penilainya — tanpa IoU tidak ada 'benar' yang terukur.", correct: false },
          ],
        },
        {
          q: "3 kotak tumpang tindih untuk 1 wajah (0,90/0,75/0,60). NMS menghasilkan?",
          options: [
            { text: "1 kotak (0,90) — sisanya ditekan", why: "Tepat: terkuat menang, IoU>0,5 ditekan.", correct: true },
            { text: "3 kotak dipertahankan", why: "Itu tanpa NMS — duplikat.", correct: false },
            { text: "0 kotak", why: "Tidak ada yang dihapus semua — yang terkuat selamat.", correct: false },
            { text: "Rata-rata ketiganya", why: "NMS tidak merata-rata — ia memilih.", correct: false },
          ],
        },
        {
          q: "Mengapa YOLO 1.300x lebih cepat dari sliding window?",
          options: [
            { text: "1 forward pass untuk semua objek vs 1.000 pass", why: "Tepat: arsitektur, bukan hardware.", correct: true },
            { text: "GPU lebih besar", why: "Hardware sama — beda algoritma.", correct: false },
            { text: "Citra lebih kecil", why: "Citra sama — cara memproses beda.", correct: false },
            { text: "Model lebih kecil", why: "Bukan ukuran — sliding window 1.000x forward.", correct: false },
          ],
        },
        {
          q: "Anchor boxes membantu karena?",
          options: [
            { text: "Model memprediksi offset dari referensi — lebih mudah dari tebak mentah", why: "Tepat: 'geser sedikit' vs 'tebak dari nol'.", correct: true },
            { text: "Menambah kecepatan", why: "Kecepatan dari 1 pass, bukan anchor.", correct: false },
            { text: "Mengurangi jumlah parameter", why: "Justru menambah prediksi per sel.", correct: false },
            { text: "Tidak ada gunanya", why: "YOLOv2+ membuktikan +10 poin mAP.", correct: false },
          ],
        },
        {
          q: "CCTV real-time 30 FPS, akurasi cukup. Pilih?",
          options: [
            { text: "YOLOv8n (nano) — cepat, mAP 0,37 cukup", why: "Tepat: FPS adalah syarat keras.", correct: true },
            { text: "Faster R-CNN", why: "Akurat tetapi 5 FPS — tidak real-time.", correct: false },
            { text: "YOLOv8x", why: "Akurat tetapi berat — untuk analisis, bukan CCTV.", correct: false },
            { text: "Sliding window", why: "40 detik/foto — bukan opsi.", correct: false },
          ],
        },
        {
          q: "AP50 = 0,78 tetapi mAP@0,5:0,95 = 0,41. Diagnosis dan perbaikan yang tepat?",
          options: [
            { text: "Lokalisasi lemah — perbaiki regresi kotak / bobot loss lokalisasi", why: "Tepat: lolos di ambang longgar (0,5) tetapi gagal di ambang ketat artinya kotak-kotaknya kasar — masalah lokalisasi, bukan klasifikasi.", correct: true },
            { text: "Tambah data training sebanyak-banyaknya", why: "Salah: data tidak memperbaiki kotak yang kasar — diagnosisnya spesifik lokalisasi, obatnya spesifik regresi.", correct: false },
            { text: "Naikkan threshold NMS", why: "Salah: NMS mengatur duplikat, bukan ketepatan kotak terhadap ground truth.", correct: false },
            { text: "Ganti backbone yang lebih besar", why: "Salah: backbone besar membantu fitur, tetapi gap AP50–AP75 yang besar menunjuk langsung ke kepala regresi kotak.", correct: false },
          ],
        },
        {
          q: "Dataset drone: objek rata-rata 20×20 px, APs = 0,12 sementara APm/AP1 normal. Intervensi pertama yang paling tepat?",
          options: [
            { text: "Naikkan resolusi input dan/atau pakai tiling + FPN", why: "Tepat: APs rendah terisolasi = objek kecil hilang di downsampling 32x — solusinya resolusi dan deteksi multi-skala.", correct: true },
            { text: "Tambah anchor berukuran besar", why: "Salah: masalahnya objek KECIL tidak tertangkap — anchor besar justru memperparah.", correct: false },
            { text: "Turunkan threshold NMS ke 0,3", why: "Salah: NMS tidak mengembalikan objek kecil yang tidak pernah terdeteksi.", correct: false },
            { text: "Augmentasi brightness dan weather", why: "Salah: itu obat domain shift, bukan buta objek kecil.", correct: false },
          ],
        },
        {
          q: "Syarat CCTV: real-time 30 FPS. Kandidat: YOLOv8x (mAP 0,53, 18 FPS) vs YOLOv8s (mAP 0,44, 60 FPS). Keputusan senior?",
          options: [
            { text: "YOLOv8s — 18 FPS gagal memenuhi constraint keras 30 FPS", why: "Tepat: FPS adalah syarat keras; mAP 0,53 tidak berguna bila frame terlewat.", correct: true },
            { text: "YOLOv8x — mAP lebih tinggi selalu menang", why: "Salah: 'selalu' mengabaikan constraint deployment — akurasi tanpa memenuhi FPS = gagal produksi.", correct: false },
            { text: "Ensemble keduanya", why: "Salah: ensemble menambah latensi — menjauhi 30 FPS, bukan mendekat.", correct: false },
            { text: "Jalankan v8x di resolusi setengah", why: "Salah: menurunkan resolusi merusak mAP yang menjadi alasan memilih v8x — lebih jujur pilih v8s.", correct: false },
          ],
        },
      ],
    },
  ],
};
