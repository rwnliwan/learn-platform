import type { V2Lesson } from "../lib/types";

// Tracking: deteksi per frame diberi identitas yang bertahan antar frame.
const TRACK_SVG = `<svg viewBox="0 0 640 240" role="img" aria-label="Dua frame: kotak deteksi dihubungkan menjadi lintasan antar frame.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<text x="160" y="28" fill="var(--text)" font-weight="600">Frame t (deteksi)</text>
<rect x="60" y="50" width="70" height="70" rx="6" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="95" y="42" fill="var(--c1)">D1</text>
<rect x="170" y="60" width="70" height="70" rx="6" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="205" y="52" fill="var(--c2)">D2</text>
<rect x="60" y="150" width="70" height="60" rx="6" fill="none" stroke="var(--c3)" stroke-width="2" stroke-dasharray="5 4"/><text x="95" y="142" fill="var(--c3)">D3 baru</text>
<text x="480" y="28" fill="var(--text)" font-weight="600">Frame t+1 (lintasan)</text>
<rect x="400" y="56" width="70" height="70" rx="6" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/><text x="435" y="48" fill="var(--c1)">T1</text>
<rect x="500" y="66" width="70" height="70" rx="6" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/><text x="535" y="58" fill="var(--c2)">T2</text>
<rect x="400" y="156" width="70" height="60" rx="6" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/><text x="435" y="148" fill="var(--c3)">T4</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5">
<line x1="130" y1="85" x2="398" y2="90"/><line x1="240" y1="95" x2="498" y2="100"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="320" y="232">deteksi = kotak per frame. tracking = kotak + identitas yang bertahan</text>
</g>
</svg>`;

export const dle26: V2Lesson = {
  slug: "dle26-video-tracking",
  track: "Deep Learning Engineer",
  module: "Computer Vision",
  title: "DLE26 — Video CV: Multi-Object Tracking & Action Recognition",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson dan tujuan",
      prose: [
        "Detektor objek menjawab “APA dan DI MANA di frame ini”. Tetapi video adalah waktu: pelanggan yang sama muncul di 300 frame, forklift yang sama melintasi 12 kamera. Lesson ini tentang multi-object tracking (MOT) — memberi identitas yang bertahan antar frame — dan sekilas action recognition dari urutan gerak.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa deteksi per-frame tidak bisa dipakai untuk menghitung atau mengikuti objek; (2) menghitung IoU dua kotak dan melakukan asosiasi greedy antar frame; (3) memprediksi kapan ambang IoU menyebabkan ID switch dan memilih ambang yang tepat; (4) membedakan SORT (gerak), DeepSORT (gerak + tampilan), dan ByteTrack (dua tahap skor); (5) merancang solusi counting/queue dari tracking, bukan dari deteksi.",
        "Prasyarat yang diringkas di sini (lesson ini self-contained): bounding box = kotak (x1, y1, x2, y2) yang membungkus objek; IoU (Intersection over Union) = luas irisan dua kotak dibagi luas gabungannya — 1,0 berarti kotak identik, 0 berarti tidak bersentuhan; ID switch = identitas lintasan tertukar (objek A tiba-tiba dilabeli sebagai B).",
        "Isi lesson: cerita 4.000 forklift dari 12 yang asli → deteksi vs tracking → IoU & asosiasi greedy → SORT/DeepSORT/ByteTrack & action recognition → lab asosiasi dua ambang → peta keputusan → mini-case antrean ritel → checkpoint.",
      ],
      tasks: [],
      reference: "Deteksi = kotak per frame. Tracking = kotak + identitas yang bertahan.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "4.000 forklift dari 12 yang asli",
      prose: [
        "“GudangNusa” memasang 8 kamera CCTV dan model deteksi forklift untuk satu pertanyaan operasional sederhana: berapa forklift yang aktif per shift? Laporan hari pertama: 4.000 “forklift”. Manajer operasional memesan 300 suku cadang dan mengajukan sewa 5 forklift tambahan.",
        "Audit lapangan menemukan gudang itu hanya punya 12 forklift. Modelnya tidak salah mendeteksi — setiap frame memang berisi forklift yang benar. Kesalahannya: sistem menghitung DETEKSI (kotak per frame), bukan OBJEK. Satu forklift yang terlihat di 300 frame dihitung 300 kali. Ditambah kamera yang tumpang tindih: forklift yang sama terlihat di 2 kamera dihitung ganda.",
        "Twist-nya: tim sempat menyalahkan model (“akuransinya kurang!”) dan melatih ulang detektor selama 3 minggu — angkanya tidak berubah, tentu saja. Masalahnya bukan APA yang terdeteksi, melainkan tidak adanya IDENTITAS: tidak ada yang menghubungkan kotak di frame 1 dengan kotak di frame 2 sebagai “forklift yang sama”. Setelah tracking dipasang (asosiasi IoU sederhana), hitungannya menjadi 12 — tepat.",
        "Kamera tidak berbohong; cara menghitungnyalah yang berbohong. Deteksi menjawab “ada apa di frame ini”; hanya tracking yang bisa menjawab “ada berapa, ke mana perginya, sudah berapa lama”.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Menghitung dari deteksi per-frame = overcounting sistematis. Keputusan operasional (sewa alat, staffing, stok) yang diambil dari angka 4.000 padahal faktanya 12 adalah keputusan berbasis metrik yang salah definisi — kategori model risk yang paling memalukan karena solusinya sebaris konsep.",
      },
      reference: "Jangan hitung deteksi; hitung lintasan.",
    },
    {
      id: "deteksi-vs-tracking",
      eyebrow: "Langkah 3 · Deteksi vs tracking",
      title: "Si Penghitung Kepala vs Si Pengikut",
      prose: [
        "Detektor objek — Si Penghitung Kepala — melihat satu frame dan mengeluarkan daftar kotak + label + skor. Ia tidak punya memori: frame 1 dan frame 2 adalah dua dunia yang tidak berhubungan. Untuk klasifikasi gambar statis ini cukup; untuk video, ini buta waktu.",
        "Tracker — Si Pengikut — mempertahankan IDENTITAS antar frame. Setiap objek yang terdeteksi diberi ID (T1, T2, …); di frame berikutnya, deteksi baru dicocokkan ke ID lama. Hasilnya bukan daftar kotak, melainkan LINTASAN: T1 bergerak dari (10,10) ke (80,60) selama 40 frame. Dari lintasan inilah semua analitik video lahir: menghitung (berapa ID unik melewati garis), mengukur antrean (berapa ID di zona), mengukur durasi (berapa lama ID di zona).",
        "Siklus hidup lintasan ada tiga status. Birth: deteksi yang tidak cocok dengan ID mana pun → ID baru (tetapi tunggu 2–3 frame konfirmasi agar tidak lahir dari false positive). Matched: deteksi cocok dengan ID lama → lintasan berlanjut. Death: ID tidak cocok beberapa frame berturut-turut → lintasan ditutup (objek keluar frame atau terhalang).",
        "💡 Intuisi: tracking = deteksi + memori + aturan pencocokan. Detektor yang bagus dengan tracker yang buruk tetap menghasilkan angka yang salah — GudangNusa membuktikannya dengan detektor yang sebenarnya akurat.",
        "Cara membaca: panel kiri = tiga kotak deteksi di satu frame (D3 = objek baru, garis putus-putus); panel kanan = kotak yang sama sudah menjadi lintasan beridentitas (T1, T2, T4).",
        "Interpretasi: panah antar panel adalah pekerjaan tracker — mengubah “kotak-kotak” menjadi “siapa ke mana”. Tanpa panah itu, tidak ada analitik video yang valid.",
      ],
      figure: {
        svg: TRACK_SVG,
        alt: "Dua frame: kotak deteksi D1-D3 dihubungkan menjadi lintasan beridentitas T1, T2, T4.",
        caption: "Deteksi = kotak per frame; tracking = kotak + identitas yang bertahan antar frame.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: detektor yang akurat otomatis memberi hitungan yang akurat",
        type: "pitfall",
        body: "Yang benar: akurasi deteksi dan akurasi counting adalah dua metrik berbeda. Detektor 99% akurat yang menghitung per-frame tetap overcount 300× untuk objek yang diam di tempat. Counting butuh identitas; identitas butuh tracking.",
      },
      reference: "Analitik video = f(lintasan), bukan f(deteksi).",
    },
    {
      id: "iou",
      eyebrow: "Langkah 4 · IoU & asosiasi",
      title: "IoU dan greedy matching: perekat paling sederhana",
      prose: [
        "Cara paling sederhana mencocokkan deteksi ke lintasan: IoU. Dua kotak yang tumpang tindih besar kemungkinan adalah objek yang sama di dua frame berurutan — karena objek tidak berteleportasi antar frame (30 fps = 33ms). IoU = luas irisan / luas gabungan: 1,0 = kotak identik, 0 = tidak bersentuhan.",
        "Algoritma greedy-nya: untuk tiap lintasan, pilih deteksi dengan IoU terbesar; jika IoU ≥ ambang τ, cocokkan; jika tidak, lintasan “hilang” dan deteksi menjadi kandidat ID baru. Sederhana, cepat, dan surprisingly efektif untuk kamera statis dengan objek yang tidak terlalu cepat.",
        "Ambang τ adalah satu-satunya tombol — dan ia punya trade-off. τ tinggi (0,5): hanya pasangan yang sangat yakin yang dicocokkan → objek yang bergerak cepat (IoU antar-frame kecil) dinyatakan hilang → ID switch (objek yang sama lahir kembali sebagai ID baru). τ rendah (0,3): objek cepat selamat, tetapi dua objek berdekatan bisa tertukar identitas.",
        "💡 Intuisi: τ bukan “makin tinggi makin baik”. τ yang tepat = di bawah IoU tipikal objek normal, di atas IoU dua objek berbeda yang berdekatan. Ukur distribusi IoU antar-frame di datamu sendiri — jangan tebak.",
      ],
      formula: String.raw`\text{IoU} = \frac{|A \cap B|}{|A \cup B|}`,
      formulaNote: "IoU = luas irisan dua kotak dibagi luas gabungannya (0–1). A, B = bounding box di dua frame berurutan. IoU ≥ τ → cocok sebagai objek yang sama; IoU < τ → tidak cocok. τ (tau) = ambang keputusan, tipikal 0,3–0,5.",
      tasks: [],
      note: {
        title: "🚨 Mitos: naikkan ambang IoU agar tracking lebih akurat",
        type: "pitfall",
        body: "Yang benar: ambang tinggi justru MEMBUNUH lintasan objek yang bergerak cepat — IoU antar-framenya memang kecil secara alami. Lab lesson ini menunjukkan: τ=0,5 menghilangkan objek yang τ=0,3 selamatkan. Akurasi tracking bukan soal ambang tinggi, melainkan ambang yang sesuai kecepatan objek.",
      },
      reference: "IoU = perekat. τ = tombol trade-off: tinggi → ID switch; rendah → tertukar.",
    },
    {
      id: "algoritma",
      eyebrow: "Langkah 5 · Algoritma tracking",
      title: "SORT, DeepSORT, ByteTrack — dan sekilas action recognition",
      prose: [
        "Tiga algoritma, tiga filosofi. SORT (2016): asosiasi IoU + Kalman filter untuk memprediksi posisi saat deteksi absen sesaat — cepat, tanpa deep learning tambahan, cukup untuk kamera statis. Kelemahannya: saat dua objek bersilangan dan IoU-nya mirip, identitas tertukar.",
        "DeepSORT: SORT + embedding tampilan (ciri visual tiap objek dari CNN kecil). Saat posisi ambigu, tanya “yang mana yang MIRIP tampilan T2?” — jauh lebih tahan oklusi dan persilangan. Harganya: komputasi embedding per deteksi.",
        "ByteTrack (2022) — Si Tukang Pungut: insight-nya sederhana dan brilian — deteksi ber-skor RENDAH yang biasa dibuang ternyata sebagian besar adalah objek yang teroklusi sebagian, bukan false positive. ByteTrack mencocokkan dua tahap: dulu yang skor tinggi, lalu sisa lintasan dicocokkan dengan kotak skor rendah. Hasilnya: jauh lebih sedikit ID switch, tanpa embedding tambahan. Pelajaran metodologisnya: kadang yang dibuang justru harta karun.",
        "Action recognition — “apa yang DILAKUKAN objek” — adalah langkah berikutnya: dari lintasan (urutan posisi) atau pose (urutan sendi tubuh), model temporal (LSTM/Transformer/3D-CNN) mengklasifikasikan aksi (berjalan, mengangkat, jatuh). Prinsipnya sama: video = urutan; aksi = pola dalam urutan. Detailnya di luar lesson ini, tetapi fondasinya — lintasan yang benar — sudah kamu kuasai di sini.",
        "💡 Intuisi: hierarki kebutuhan tracking — (1) asosiasi benar (IoU), (2) tahan oklusi (Kalman/ByteTrack), (3) tahan kemiripan (appearance). Jangan bayar level 3 sebelum level 1 beres — GudangNusa bahkan belum butuh Kalman.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: tracking butuh model deep learning yang berat",
        type: "pitfall",
        body: "Yang benar: untuk kamera statis dan objek yang tidak terlalu cepat, IoU greedy + sedikit logika sudah menyelesaikan 80% masalah (termasuk kasus GudangNusa). DeepSORT/ByteTrack dibutuhkan saat oklusi dan keramaian — ukur dulu ID switch-mu sebelum menambah kompleksitas.",
      },
      reference: "SORT = gerak. DeepSORT = gerak + tampilan. ByteTrack = jangan buang skor rendah.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: duel dua ambang IoU",
      prose: [
        "Waktunya praktik. Kamu diberi 3 lintasan (T1–T3) di frame 1 dan 3 deteksi (D1–D3) di frame 2. T2 adalah objek yang bergerak cepat (IoU hanya 0,33 dengan pasangannya); D3 adalah objek baru yang tidak ada pasangannya. Tugasmu: tulis fungsi IoU, lalu fungsi pencocokan greedy, dan jalankan untuk dua ambang — τ=0,5 (ketat) dan τ=0,3 (longgar).",
        "Perhatikan hasilnya: pada τ=0,5, T2 dinyatakan HILANG (0,33 < 0,5) lalu D2 dilahirkan sebagai lintasan baru — ID switch klasik: objek yang sama kini punya dua identitas. Pada τ=0,3, T2 selamat (0,33 ≥ 0,3) dan hanya T3 yang hilang (memang tidak ada pasangannya — D3 objek baru).",
        "Cara membaca output: matriks IoU 3×3, lalu tiap baris ambang = daftar pasangan (lintasan, deteksi, IoU) + daftar lintasan baru + hitungan yang hilang.",
        "Interpretasi: angka yang benar — τ=0,5: 2 hilang (T2 + T3); τ=0,3: 1 hilang (hanya T3). Ambang ketat membunuh objek cepat; ambang longgar menyelamatkannya. Inilah trade-off τ dalam angka.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `iou(a, b)` untuk dua kotak (x1, y1, x2, y2)" },
        { id: "t2", text: "Tulis fungsi `cocokkan(tau)` yang mengembalikan (pasangan, lintasan_baru) dengan greedy matching" },
        { id: "t3", text: "Jalankan untuk tau 0,5 dan 0,3; simpan hitungan yang hilang ke `hilang05` dan `hilang03`; cetak dengan format persis contoh" },
      ],
      expected: "IoU T->D:\n [0.82, 0.0, 0.0]\n [0.0, 0.33, 0.0]\n [0.0, 0.0, 0.0]\ntau=0.5: [('T1', 'D1', 0.82), ('T2', 'HILANG', 0.33), ('T3', 'HILANG', 0.0)] | lintasan baru: ['D2', 'D3'] | hilang: 2\ntau=0.3: [('T1', 'D1', 0.82), ('T2', 'D2', 0.33), ('T3', 'HILANG', 0.0)] | lintasan baru: ['D3'] | hilang: 1",
      hints: [
        "Irisan: ix1 = max(ax1, bx1), ix2 = min(ax2, bx2); luas = max(0, ix2-ix1) * max(0, iy2-iy1).",
        "Greedy: untuk tiap lintasan, pilih deteksi BELUM terpakai dengan IoU terbesar; cocokkan bila >= tau.",
        "Deteksi yang tidak terpakai siapa pun = lintasan baru.",
      ],
      code: {
        starter: `# Lintasan di frame 1 (T1..T3) dan deteksi di frame 2 (D1..D3)
# T2 bergerak cepat; D3 adalah objek baru
f1 = [(10, 10, 50, 50), (60, 60, 100, 100), (120, 120, 160, 160)]
f2 = [(12, 12, 52, 52), (80, 60, 120, 100), (200, 200, 240, 240)]

# TULIS KODEMU di bawah baris ini
def iou(a, b):
    ...

def cocokkan(tau):
    ...

# Cetak matriks IoU
print("IoU T->D:")
for a in f1:
    print(" ", [round(iou(a, b), 2) for b in f2])

for tau in (0.5, 0.3):
    pasangan, baru = cocokkan(tau)
    hilang = sum(1 for t, d, _ in pasangan if d == "HILANG")
    print(f"tau={tau}: {pasangan} | lintasan baru: {baru} | hilang: {hilang}")

hilang05 = ...
hilang03 = ...`,
        lockLines: 6,
        solution: `# Lintasan di frame 1 (T1..T3) dan deteksi di frame 2 (D1..D3)
# T2 bergerak cepat; D3 adalah objek baru
f1 = [(10, 10, 50, 50), (60, 60, 100, 100), (120, 120, 160, 160)]
f2 = [(12, 12, 52, 52), (80, 60, 120, 100), (200, 200, 240, 240)]

# TULIS KODEMU di bawah baris ini
def iou(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix1, iy1 = max(ax1, bx1), max(ay1, by1)
    ix2, iy2 = min(ax2, bx2), min(ay2, by2)
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)
    union = (ax2 - ax1) * (ay2 - ay1) + (bx2 - bx1) * (by2 - by1) - inter
    return inter / union if union else 0.0

def cocokkan(tau):
    terpakai = set()
    pasangan = []
    for i, a in enumerate(f1):
        terbaik, jterbaik = -1.0, -1
        for j, b in enumerate(f2):
            if j in terpakai:
                continue
            v = iou(a, b)
            if v > terbaik:
                terbaik, jterbaik = v, j
        if terbaik >= tau:
            terpakai.add(jterbaik)
            pasangan.append((f"T{i+1}", f"D{jterbaik+1}", round(terbaik, 2)))
        else:
            pasangan.append((f"T{i+1}", "HILANG", round(terbaik, 2)))
    baru = [f"D{j+1}" for j in range(len(f2)) if j not in terpakai]
    return pasangan, baru

# Cetak matriks IoU
print("IoU T->D:")
for a in f1:
    print(" ", [round(iou(a, b), 2) for b in f2])

for tau in (0.5, 0.3):
    pasangan, baru = cocokkan(tau)
    hilang = sum(1 for t, d, _ in pasangan if d == "HILANG")
    print(f"tau={tau}: {pasangan} | lintasan baru: {baru} | hilang: {hilang}")

hilang05 = 2
hilang03 = 1`,
        checks: [
          { kind: "defined", task: "t1", name: "iou", label: "Fungsi `iou` terdefinisi", msg: "Tulis fungsi IoU untuk dua kotak." },
          { kind: "defined", task: "t2", name: "cocokkan", label: "Fungsi `cocokkan` terdefinisi", msg: "Tulis greedy matching dengan ambang tau." },
          { kind: "equal", task: "t3", name: "hilang05", value: 2, label: "`hilang05` = 2", msg: "Pada tau=0,5: T2 (0,33 < 0,5) dan T3 hilang." },
          { kind: "equal", task: "t3", name: "hilang03", value: 1, label: "`hilang03` = 1", msg: "Pada tau=0,3: hanya T3 yang hilang; T2 selamat." },
          { kind: "stdout_matches", task: "t3", pattern: "tau=0\\.3:.*'T2', 'D2', 0\\.33", label: "T2 selamat pada tau=0,3", msg: "IoU 0,33 >= 0,3 — objek cepat tidak boleh hilang." },
        ],
      },
      note: {
        title: "Bingkai jujur lab ini",
        type: "risk",
        body: "Lab ini memakai kotak mainan 2D — produksi memakai detektor (YOLO) + Kalman filter untuk prediksi posisi saat deteksi absen. Tetapi logika asosiasinya identik: IoU, greedy matching, dan trade-off ambang τ. SORT pada dasarnya adalah lab ini ditambah prediksi gerak.",
      },
      reference: "τ=0,5 membunuh objek cepat; τ=0,3 menyelamatkannya. Pilih τ dari data, bukan dari tebakan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: solusi tracking untuk kebutuhanmu",
      prose: [
        "Skenario 1 — menghitung objek melewati garis (pengunjung toko, kendaraan). → Tracking IoU + virtual line crossing. Alasan: hitung ID unik yang memotong garis — bukan deteksi per frame.",
        "Skenario 2 — kamera statis, objek tidak terlalu cepat, budget komputasi kecil. → SORT (IoU + Kalman). Alasan: menyelesaikan 80% kasus tanpa embedding; cepat di CPU.",
        "Skenario 3 — keramaian, oklusi sering, objek mirip (parkir, gudang). → DeepSORT (tambah appearance embedding) atau ByteTrack. Alasan: saat posisi ambigu, tampilan menjadi penentu identitas.",
        "Skenario 4 — butuh tahu AKSI (jatuh, mengangkat, antre terlalu lama). → Tracking dulu (dapatkan lintasan), lalu model temporal di atas urutan pose/posisi. Alasan: action recognition tanpa lintasan yang benar = klasifikasi atas data yang salah asosiasi.",
        "Skenario 5 — multi-kamera, objek pindah kamera. → Re-identification (embedding lintas kamera) + sinkronisasi waktu. Alasan: IoU tidak berlaku lintas kamera yang tidak tumpang tindih — butuh identitas berbasis tampilan.",
        "Aturan praktis 10 detik: (1) butuh hitung/ikut → tracking, bukan deteksi; (2) mulai dari IoU greedy, ukur ID switch; (3) oklusi parah → ByteTrack/DeepSORT; (4) τ dari distribusi data, bukan default 0,5.",
      ],
      note: {
        title: "💡 Intuisi: tracking yang baik = deteksi yang cukup + asosiasi yang benar",
        body: "Mayoritas kegagalan tracking di produksi bukan dari detektor yang buruk, melainkan dari asosiasi yang salah (ambang τ, tidak ada prediksi saat oklusi). Investasikan waktu di logika asosiasi sebelum mengganti detektor.",
      },
      tasks: [],
      reference: "Hitung → tracking + garis virtual. Ramai/oklusi → DeepSORT/ByteTrack. Aksi → lintasan dulu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Antrean kasir: dari 3.120 menjadi 812",
      prose: [
        "Jaringan ritel “RitelMaju” ingin mengukur panjang antrean kasir dari CCTV untuk mengatur staffing. Versi pertama: detektor orang menghitung kotak per frame, dirata-ratakan per jam. Hasil: 3.120 “pengunjung” per hari di satu gerai. Audit manual: 780. Error 300% — orang yang antre 10 menit dihitung ratusan kali, dan orang yang sama dihitung lagi setiap frame.",
        "Tim memasang tracking IoU sederhana + zona antrean virtual: setiap ID yang masuk zona dihitung sekali; panjang antrean = jumlah ID aktif di zona; waktu tunggu = durasi ID di zona. Hasil: 812 pengunjung terhitung (error 4% — sisanya dari oklusi saat sangat ramai), waktu tunggu rata-rata 6,2 menit, dan pola jam sibuk yang benar (puncak 17:30, bukan 12:00 seperti versi deteksi yang bias ke jam sepi dengan orang diam).",
        "Keputusan operasional dari data yang benar: tambah 1 kasir jam 17:00–19:00 (bukan jam 12:00), hemat 14 jam kerja kasir per minggu per gerai ≈ Rp2,1 juta/bulan. Total proyek tracking: 2 minggu kerja engineer.",
        "Pembahasan: nilai bisnisnya bukan dari model yang canggih — detektornya sama persis di kedua versi. Nilainya dari DEFINISI yang benar: pengunjung = ID unik, antrean = ID di zona, waktu tunggu = durasi ID. Tiga definisi, satu konsep (identitas), dan keputusan staffing yang akhirnya berbasis fakta.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Metrik operasional dari definisi yang salah = keputusan yang salah dengan keyakinan tinggi. Dokumentasikan definisi metrik (apa itu “pengunjung”?) sebelum membangun pipeline — ini data governance untuk video.",
      },
      reference: "Nilai tracking = definisi yang benar, bukan model yang canggih.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang multi-object tracking — dari IoU sampai keputusan algoritma.",
      ],
      tasks: [],
      summary: [
        "Deteksi = kotak per frame; tracking = kotak + identitas → lintasan; analitik video = f(lintasan).",
        "IoU = irisan/gabungan; greedy matching dengan ambang τ; τ tinggi → ID switch pada objek cepat.",
        "Siklus lintasan: birth (konfirmasi 2–3 frame) → matched → death (hilang beberapa frame).",
        "SORT = gerak; DeepSORT = gerak + tampilan; ByteTrack = manfaatkan deteksi skor rendah.",
        "Action recognition = klasifikasi pola temporal di atas lintasan yang benar.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Gudang menghitung forklift dari deteksi per-frame: 4.000/hari padahal aslinya 12. Akar masalahnya?",
          options: [
            { text: "Detektor tidak akurat", why: "Detektornya benar — setiap frame memang berisi forklift. Masalahnya bukan akurasi deteksi.", correct: false },
            { text: "Tidak ada identitas antar frame — deteksi dihitung, bukan objek", why: "Satu forklift di 300 frame = 300 hitungan. Tanpa tracking, tidak ada konsep “objek yang sama”.", correct: true },
            { text: "Kamera terlalu sedikit", why: "Kamera lebih banyak justru memperparah double-counting tanpa tracking lintas kamera." },
            { text: "Frame rate terlalu tinggi", why: "Menurunkan fps mengurangi hitungan secara proporsional tetapi tidak memperbaiki definisinya." },
          ],
        },
        {
          q: "Pada lab, τ=0,5 membuat T2 (IoU 0,33) hilang, sedangkan τ=0,3 menyelamatkannya. Kesimpulan?",
          options: [
            { text: "τ=0,3 selalu lebih baik dari τ=0,5", why: "Terlalu longgar berisiko menukar identitas dua objek berdekatan — trade-off, bukan kemenangan mutlak.", correct: false },
            { text: "Ambang tinggi membunuh objek cepat; pilih τ dari distribusi IoU datamu", why: "IoU antar-frame objek cepat memang kecil secara alami; τ harus di bawahnya tetapi di atas IoU objek berbeda.", correct: true },
            { text: "IoU tidak cocok untuk tracking", why: "IoU bekerja baik — yang salah adalah ambangnya, bukan metriknya." },
            { text: "Naikkan frame rate kamera", why: "Itu solusi hardware untuk masalah parameter — mahal dan tidak selalu mungkin." },
          ],
        },
        {
          q: "Dua pejalan kaki bersilangan dan identitasnya tertukar dengan SORT murni. Perbaikan yang paling tepat?",
          options: [
            { text: "Naikkan ambang IoU", why: "Saat bersilangan, IoU keduanya mirip — ambang tidak bisa membedakan.", correct: false },
            { text: "Tambah appearance embedding (DeepSORT) — tanya siapa yang mirip tampilan T2", why: "Saat posisi ambigu, ciri visual menjadi penentu identitas.", correct: true },
            { text: "Turunkan resolusi kamera", why: "Resolusi lebih rendah memperburuk diskriminasi, bukan memperbaikinya." },
            { text: "Hapus lintasan yang bersilangan", why: "Itu menghilangkan data, bukan memperbaiki identitas." },
          ],
        },
        {
          q: "Insight utama ByteTrack dibanding pendekatan buang-deteksi-skor-rendah?",
          options: [
            { text: "Skor rendah = selalu false positive, buang saja", why: "Itu pendekatan lama yang dibuktikan ByteTrack salah.", correct: false },
            { text: "Deteksi skor rendah sebagian besar adalah objek teroklusi — cocokkan dua tahap", why: "Tahap 1: skor tinggi; tahap 2: sisa lintasan dengan kotak skor rendah → jauh lebih sedikit ID switch.", correct: true },
            { text: "ByteTrack tidak butuh detektor", why: "ByteTrack justru memaksimalkan HASIL detektor yang ada." },
            { text: "ByteTrack hanya untuk video statis", why: "Ia umum untuk berbagai skenario; keunggulannya di pemanfaatan skor rendah." },
          ],
        },
        {
          q: "Tim ingin klasifikasi aksi “karyawan mengangkat barang berat” dari CCTV gudang. Urutan kerja yang benar?",
          options: [
            { text: "Langsung latih 3D-CNN di video mentah", why: "Tanpa lintasan, model mencampur aksi banyak orang dalam satu frame — asosiasi dulu.", correct: false },
            { text: "Tracking dulu (dapatkan lintasan per orang), lalu model temporal di atas urutan geraknya", why: "Aksi = pola temporal; pola temporal butuh urutan yang benar milik orang yang sama.", correct: true },
            { text: "Deteksi pose saja cukup, tracking tidak perlu", why: "Pose per frame tanpa identitas = tidak tahu pose siapa berlanjut ke siapa." },
            { text: "Naikkan resolusi kamera setinggi mungkin", why: "Resolusi membantu deteksi, tetapi tidak menggantikan identitas temporal." },
          ],
        },
      ],
    },
  ],
};
