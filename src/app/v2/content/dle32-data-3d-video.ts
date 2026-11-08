import type { V2Lesson } from "../lib/types";

export const dle32: V2Lesson = {
  slug: "dle32-data-3d-video",
  track: "Deep Learning Engineer",
  module: "Sequence",
  title: "DLE32 — Data 3D & Video: dari Point Cloud ke Aksi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Gudang yang dilihat robot sebagai 1.000 titik melayang",
      prose: [
        "Robot gudang KirimCepat tidak melihat foto — ia melihat point cloud: 1.000 titik (x, y, z) dari sensor LiDAR, melayang tanpa urutan, tanpa grid. Tugasnya: kenali rak, kenali kotak, dan kenali apakah pekerja sedang berjalan, mengangkat, atau jatuh. Gambar 2D tidak cukup — kedalaman adalah informasi. Dan video bukan sekadar 300 gambar: aksi hidup di ANTARA frame.",
        "Lesson ini mengajarkan dua representasi yang tidak ada di lesson 2D: data 3D (point cloud, voxel, mesh) dan video sebagai urutan (aksi, bukan objek). DLE26 mengajarkan pelacakan objek di video — lintasan yang benar — dan secara eksplisit mendelegasikan action recognition ke luar lesson. Lesson ini mengambil alih dari titik itu: dari lintasan ke aksi, dari piksel ke titik 3D.",
        "Setelah lesson ini kamu bisa: (1) menghitung okupansi voxel dari point cloud; (2) menghitung ukuran output konvolusi 3D; (3) menghitung kebutuhan sampling frame video; (4) menjelaskan PointNet vs voxel; (5) merancang pipeline pengenalan aksi dari video.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DLE26 (video tracking) membahas lintasan objek dan menyebut action recognition sebagai 'langkah berikutnya' yang 'detailnya di luar lesson ini'; DLE14 menyinggung 3D U-Net satu paragraf untuk CT/MRI. Lesson ini membangun keduanya sebagai sistem: representasi 3D (point cloud, voxel, mesh, PointNet) dan pemahaman video (sampling, 3D-CNN, transformer video, pengenalan aksi) — dengan lab yang menghitung okupansi, dimensi output, dan sampling frame.",
      },
      reference: "Okupansi voxel 51,2 persen; output konv 3D 16^3; 300 frame menjadi 38 sampel; point cloud 12.000 byte.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa bekerja dengan data yang punya dimensi ruang dan waktu — bukan hanya gambar diam.",
        "(1) Menghitung okupansi voxel dan ukuran point cloud;",
        "(2) Menghitung dimensi output konvolusi 3D;",
        "(3) Menghitung jumlah frame sampel dari video;",
        "(4) Membandingkan PointNet, voxel, dan proyeksi 2D;",
        "(5) Merancang pipeline pengenalan aksi (sampling, backbone, agregasi temporal).",
      ],
      tasks: [],
    },
    {
      id: "representasi-3d",
      eyebrow: "Langkah 3 · Teori",
      title: "Point cloud, voxel, mesh: tiga cara menulis ruang",
      prose: [
        "Point cloud adalah daftar titik (x, y, z) — mentah, tanpa urutan, tanpa tetangga yang jelas. Ukurannya kecil: 1.000 titik x 3 koordinat x 4 byte (float32) = 12.000 byte. Masalahnya: network biasa butuh grid teratur; titik tidak punya urutan kanonik (mengacak urutan titik tidak mengubah objeknya). PointNet menyelesaikannya dengan elegan: proses tiap titik secara independen dengan MLP yang sama, lalu agregasi max-pooling global — urutan titik menjadi tidak relevan karena max tidak peduli urutan.",
        "Voxel adalah kebalikannya: bagi ruang menjadi kubus kecil (misalnya grid 10x10x10 = 1.000 voxel), tandai voxel yang berisi titik. Contoh: 1.000 titik mengisi 512 dari 1.000 voxel — okupansi 512/1.000 = 51,2 persen. Voxel memungkinkan konvolusi 3D standar — tetapi boros: sebagian besar voxel kosong (di dunia nyata okupansi sering di bawah 5 persen), dan resolusi voxel menentukan detail: voxel 10 cm tidak bisa membedakan jari.",
        "Mesh adalah permukaan: simpul + sisi segitiga. Paling hemat untuk permukaan halus (satu bola bisa ditulis puluhan segitiga), paling sulit untuk network (graph, bukan grid). Aturan: klasifikasi objek 3D cepat = PointNet; deteksi 3D + segmentasi volumetrik = voxel/3D-CNN; grafika dan rekonstruksi permukaan = mesh. Pilih representasi dari tugasnya, bukan dari trennya.",
      ],
      tasks: [],
      note: {
        title: "Sparsity adalah musuh voxel",
        body: "Voxel grid 100x100x100 = 1 juta voxel; bila hanya 2 persen terisi, 98 persen voxel-nya kosong. Proporsi kosong itu BUKAN sama dengan penghematan sparse convolution: sparse tetap punya overhead (indeks voxel, pengumpulan tetangga, kernel yang menyentuh voxel kosong di perbatasan) — hemat komputasi riil mendekati 98 persen pada grid sangat jarang, dan lebih kecil pada grid yang lebih padat. Solusinya sparse convolution (hanya hitung voxel terisi) — dipakai semua sistem LiDAR produksi. Jangan menjalankan konvolusi 3D dense pada grid besar tanpa memeriksa okupansinya dulu.",
      },
      reference: "Point cloud 12.000 byte; okupansi 51,2 persen dari 1.000 voxel.",
    },
    {
      id: "video-aksi",
      eyebrow: "Langkah 4 · Teori",
      title: "Video: aksi hidup di antara frame",
      prose: [
        "Video 10 detik pada 30 fps = 300 frame. Memproses semuanya dengan CNN 2D berarti 300x biaya satu gambar — boros, dan model tetap tidak 'melihat' gerakan karena tiap frame diproses sendiri. Solusi pertama: sampling — ambil tiap frame ke-8: ceil(300/8) = 38 frame. Masih banyak, tetapi 8x lebih murah, dan untuk aksi LAMBAT (berjalan, mengangkat) 38 frame cukup menangkap polanya — tetapi aksi CEPAT (jatuh, melempar) bisa hilang di antara sampel: bila fase khas suatu aksi hanya 0,2 detik (6 frame), sampling tiap 8 frame bisa melewatkannya seluruhnya. Aturan: interval sampling harus lebih pendek dari fase terpendek yang membedakan aksi — atau pakai sampling adaptif yang lebih rapat di segmen yang bergerak.",
        "Solusi kedua: konvolusi 3D — kernel bergerak di ruang DAN waktu (misalnya 3x3x3: 3 piksel x 3 piksel x 3 frame). Ukuran output dihitung seperti konvolusi biasa per dimensi: input 32^3, kernel 3, stride 2, padding 1 — output = floor((32 + 2 - 3)/2) + 1 = 16 per dimensi, jadi 16^3 = 4.096 voxel fitur. Konvolusi 3D menangkap gerakan lokal (tangan naik dalam 3 frame) tetapi mahal: parameter dan komputasi naik pangkat tiga terhadap ukuran kernel.",
        "Solusi ketiga (standar modern): backbone 2D per frame + agregasi temporal (LSTM/Transformer). Tiap frame menjadi vektor fitur, lalu transformer video membaca urutan 38 vektor itu dan mengklasifikasikan aksinya. Keuntungannya: backbone 2D bisa memakai bobot pra-latih ImageNet; transformer hanya belajar pola temporal. Pipeline pengenalan aksi yang sehat: sampling (38 frame) → backbone 2D → agregasi temporal → klasifikasi — dengan DLE26 sebagai fondasi (lintasan objek yang benar sebelum aksi diklasifikasikan).",
      ],
      tasks: [],
      note: {
        title: "Aksi butuh konteks, bukan hanya gerakan",
        body: "'Mengangkat' dan 'menjatuhkan' bisa punya gerakan tangan yang mirip — bedanya objek dan hasil akhirnya. Model aksi yang hanya melihat gerakan akan bingung; yang melihat gerakan + objek + konteks ruangan jauh lebih akurat. Itulah mengapa pipeline terbaik menggabungkan deteksi objek (apa), pelacakan (di mana), dan klasifikasi temporal (apa yang dilakukan) — tiga lesson yang saling melengkapi.",
      },
      reference: "300 frame menjadi 38 sampel; konv 3D 32^3 menjadi 16^3.",
    },
    {
      id: "lab-3d-video",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: okupansi voxel, konvolusi 3D, sampling frame",
      prose: [
        "Lab ini menghitung anggaran data 3D dan video dari angka mentah: okupansi voxel, ukuran point cloud, output konvolusi 3D, dan sampling frame.",
        "Hitung dulu di kepala. Okupansi: 512 / 1.000 = 0,512 (51,2 persen). Ukuran point cloud: 1.000 titik x 3 koordinat x 4 byte = 12.000 byte. Output konv 3D: floor((32 + 2 - 3)/2) + 1 = 16 per dimensi. Frame sampel: ceil(300/8) = 38.",
        "Tugas lab: hitung empat angka dan cetak masing-masing di baris sendiri: okupansi, byte_cloud, conv_out, frame_sampel. Empat angka ini adalah pemeriksaan anggaran sebelum training — dengan ini kamu tahu apakah voxel grid-mu boros, apakah konv 3D-mu muat di memori, dan apakah sampling-mu cukup.",
        "Setelah lolos, coba eksperimen: naikkan grid voxel menjadi 100^3 (1 juta voxel) dengan okupansi 2 persen dan hitung voxel terisi: 20.000 — lalu tanyakan: masihkah konvolusi dense masuk akal, atau sudah waktunya sparse convolution?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `okupansi` voxel (512 terisi dari 1.000) dan `byte_cloud`" },
        { id: "t2", text: "Hitung `conv_out` konvolusi 3D (input 32, kernel 3, stride 2, pad 1)" },
        { id: "t3", text: "Hitung `frame_sampel` dari 300 frame tiap 8 frame" },
      ],
      expected: "okupansi=0.512\nbyte_cloud=12000\nconv_out=16\nframe_sampel=38",
      hints: [
        "Okupansi = terisi / total voxel.",
        "Byte = titik x koordinat x 4 byte.",
        "Output = floor((input + 2xpad - kernel) / stride) + 1.",
        "Frame sampel = ceil(300 / 8); pakai math.ceil.",
      ],
      code: {
        starter: `# Anggaran 3D & video: okupansi, ukuran, konv 3D, sampling.\nimport math\n\nvoxel_terisi, voxel_total = 512, 1000\nn_titik = 1000\ninput_3d, kernel, stride, pad = 32, 3, 2, 1\ntotal_frame, tiap = 300, 8\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nokupansi = \nbyte_cloud = \nconv_out = \nframe_sampel = \n\nprint(f"okupansi={okupansi}")\nprint(f"byte_cloud={byte_cloud}")\nprint(f"conv_out={conv_out}")\nprint(f"frame_sampel={frame_sampel}")`,
        lockLines: 5,
        solution: `# Anggaran 3D & video: okupansi, ukuran, konv 3D, sampling.\nimport math\n\nvoxel_terisi, voxel_total = 512, 1000\nn_titik = 1000\ninput_3d, kernel, stride, pad = 32, 3, 2, 1\ntotal_frame, tiap = 300, 8\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nokupansi = voxel_terisi / voxel_total\nbyte_cloud = n_titik * 3 * 4\nconv_out = (input_3d + 2 * pad - kernel) // stride + 1\nframe_sampel = math.ceil(total_frame / tiap)\n\nprint(f"okupansi={okupansi}")\nprint(f"byte_cloud={byte_cloud}")\nprint(f"conv_out={conv_out}")\nprint(f"frame_sampel={frame_sampel}")`,
        checks: [
          { kind: "equal", task: "t1", name: "okupansi", value: 0.512, tol: 1e-9, label: "`okupansi` seharusnya 0.512", msg: "512/1.000 = 0,512." },
          { kind: "equal", task: "t1", name: "byte_cloud", value: 12000, tol: 1e-9, label: "`byte_cloud` seharusnya 12000", msg: "1.000 x 3 x 4 = 12.000 byte." },
          { kind: "equal", task: "t2", name: "conv_out", value: 16, tol: 1e-9, label: "`conv_out` seharusnya 16", msg: "floor(31/2)+1 = 16 per dimensi." },
          { kind: "equal", task: "t3", name: "frame_sampel", value: 38, tol: 1e-9, label: "`frame_sampel` seharusnya 38", msg: "ceil(300/8) = 38." },
        ],
      },
      reference: "Okupansi 0,512; 12.000 byte; conv out 16; 38 frame.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: representasi dan arsitektur apa",
      prose: [
        "Skenario 1 — Klasifikasi objek 3D dari LiDAR, data titik mentah. → PointNet. Alasan: tidak butuh voxelisasi; invarian urutan titik bawaan.",
        "Skenario 2 — Deteksi 3D / segmentasi volumetrik (CT/MRI, LiDAR kota). → Voxel + 3D-CNN atau sparse convolution. Alasan: butuh konteks spasial tetangga; sparse bila okupansi rendah.",
        "Skenario 3 — Aksi lambat, video pendek, budget kecil. → Sampling + CNN 2D + agregasi rata-rata. Alasan: 38 frame cukup untuk aksi lambat; agregasi sederhana sering menang atas LSTM untuk aksi sederhana.",
        "Skenario 4 — Aksi kompleks dengan urutan panjang (olahraga, perakitan). → Backbone 2D + transformer temporal. Alasan: attention menangkap dependensi jauh antar frame yang LSTM lupakan.",
        "Skenario 5 — Rekonstruksi permukaan / grafika. → Mesh + graph network. Alasan: permukaan kontinu tidak efisien ditulis sebagai voxel.",
        "Aturan praktis: ukur okupansi sebelum memilih voxel; ukur durasi aksi sebelum memilih sampling; dan jangan pernah melatih model aksi di atas lintasan yang salah — DLE26 dulu, aksi kemudian.",
      ],
      tasks: [],
      note: {
        title: "Data 3D/video mahal — augmentasi adalah keharusan",
        body: "Dataset 3D dan video berlabel jauh lebih kecil dan mahal daripada dataset gambar. Augmentasi yang bekerja: rotasi/translasi point cloud (objek yang sama dari sudut berbeda), flip temporal video (aksi terbalik? hati-hati — 'menjatuhkan' terbalik menjadi 'mengangkat'!), dan cropping spasial. Augmentasi yang salah mengubah label — selalu tanyakan: apakah transformasi ini mempertahankan arti aksinya?",
      },
      reference: "PointNet untuk titik mentah; voxel untuk volumetrik; transformer temporal untuk aksi kompleks.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Point cloud 1.000 titik = 12.000 byte; okupansi voxel 51,2 persen.",
        "Konv 3D 32^3 (k=3, s=2, p=1) menjadi 16^3.",
        "300 frame tiap 8 = 38 sampel.",
        "PointNet: MLP per titik + max-pooling global (invarian urutan).",
        "Pipeline aksi: sampling, backbone 2D, agregasi temporal, klasifikasi.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "1.000 titik point cloud float32 (x, y, z). Berapa ukurannya?",
          options: [
            { text: "12.000 byte", why: "Tepat: 1.000 x 3 x 4 = 12.000 byte.", correct: true },
            { text: "3.000 byte — satu byte per koordinat", why: "Salah: float32 = 4 byte, bukan 1." },
            { text: "1.000 byte — satu byte per titik", why: "Salah: tiap titik punya 3 koordinat x 4 byte = 12 byte." },
            { text: "36.000 byte — 3x lipat karena tiga dimensi", why: "Salah: 1.000 x 3 x 4 = 12.000, bukan 36.000." },
          ],
        },
        {
          q: "Mengapa PointNet memakai max-pooling global?",
          options: [
            { text: "Agar komputasi lebih cepat saja", why: "Salah: kecepatan adalah bonus; alasan utamanya invariansi urutan." },
            { text: "Agar urutan titik tidak memengaruhi hasil — max tidak peduli urutan", why: "Tepat: mengacak titik tidak mengubah objeknya; max-pooling menghormati itu.", correct: true },
            { text: "Agar model bisa menangani gambar 2D", why: "Salah: PointNet untuk point cloud 3D, bukan gambar 2D." },
            { text: "Agar voxel tidak diperlukan", why: "Salah: itu konsekuensi, bukan alasan — alasannya invariansi permutasi." },
          ],
        },
        {
          q: "Konvolusi 3D: input 32, kernel 3, stride 2, padding 1. Berapa output per dimensi?",
          options: [
            { text: "16", why: "Tepat: floor((32+2-3)/2)+1 = floor(31/2)+1 = 15+1 = 16.", correct: true },
            { text: "15 — lupa +1", why: "Salah: rumus output selalu +1 di akhir." },
            { text: "30 — stride tidak dihitung", why: "Salah: stride 2 membagi ukuran hampir separuh." },
            { text: "32 — ukuran dipertahankan", why: "Salah: stride 2 dan kernel 3 mengecilkan; padding 1 tidak cukup mempertahankan." },
          ],
        },
        {
          q: "Video 300 frame, sampling tiap 8 frame. Berapa frame sampel?",
          options: [
            { text: "38", why: "Tepat: ceil(300/8) = ceil(37,5) = 38.", correct: true },
            { text: "37 — pembulatan ke bawah", why: "Salah: 300/8 = 37,5; frame ke-297 masih diambil — ceil, bukan floor." },
            { text: "300 — semua frame dipakai", why: "Salah: itu tanpa sampling; tujuannya justru memangkas 8x." },
            { text: "2400 — 300 x 8", why: "Salah: terbalik — sampling MEMBAGI, bukan mengalikan." },
          ],
        },
        {
          q: "Voxel grid 100^3 dengan okupansi 2 persen. Apa keputusan yang benar?",
          options: [
            { text: "Konvolusi 3D dense — 1 juta voxel masih kecil", why: "Salah: 98 persen komputasi terbuang pada ruang kosong; sparse convolution yang benar." },
            { text: "Sparse convolution — hanya hitung voxel terisi", why: "Tepat: 20.000 voxel terisi dari 1 juta; dense menghitung sejuta voxel padahal 98 persen kosong — penghematan sparse riil sedikit di bawah 98 persen karena overhead indeks, tetapi tetap jauh lebih hemat.", correct: true },
            { text: "Turunkan resolusi ke 10^3 agar dense muat", why: "Salah: menurunkan resolusi membuang detail yang mungkin justru dibutuhkan deteksi." },
            { text: "Pakai PointNet — voxel tidak pernah cocok", why: "Salah: voxel cocok untuk deteksi volumetrik; yang salah adalah DENSE pada okupansi rendah." },
          ],
        },
      ],
    },
  ],
};
