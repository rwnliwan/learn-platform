import type { V2Lesson } from "../lib/types";

export const hd34: V2Lesson = {
  slug: "hd34-deep-learning-kesehatan",
  track: "Health Data Science",
  module: "Data Science Klinis",
  title: "HD34 — Deep Learning untuk Kesehatan: CNN, LSTM, Autoencoder dan Grad-CAM",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model 95 persen yang membaca merek mesin rontgen",
      prose: [
        "HD15 sudah menceritakan kisah horornya: model pendeteksi COVID dari rontgen yang akurasinya 95 persen — tetapi ternyata hanya membaca merek mesin rontgen di sudut gambar. Crop sudut gambar, AUC anjlok dari 0,95 ke 0,62. Grad-CAM menyala di sudut kiri atas, bukan di paru. Model itu tidak belajar penyakit; ia belajar logo. Lesson ini membedah mesin di balik kisah itu: arsitektur deep learning untuk kesehatan sebagai satu blok — CNN modern (ResNet, DenseNet) untuk citra, LSTM untuk deret waktu klinis, autoencoder untuk deteksi anomali, dan Grad-CAM sebagai alat interpretasi. HD15 mengajarkan cara MENGEVALUASI model citra; HD12 mengajarkan kalibrasi dan TRIPOD; lesson ini mengajarkan cara KERJA arsitekturnya — sehingga kamu bisa membaca arsitektur di paper dan tahu apa yang bisa dan tidak bisa ia lakukan. Setelah lesson ini kamu bisa: (1) menjelaskan skip connection ResNet dan dense block DenseNet, termasuk menghitung parameternya; (2) menjelaskan LSTM untuk deret waktu klinis dan menghitung parameternya; (3) menjelaskan deteksi anomali dengan autoencoder dan ambang reconstruction error; (4) menghitung Grad-CAM dan menjelaskan batasnya sebagai bukti.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada di track ini",
        body: "HD15: CNN, transfer learning, Grad-CAM, dan shortcut learning — dalam satu lesson tentang DICOM dan klasifikasi citra. HD12: kalibrasi, Brier score, TRIPOD. Lesson ini membangun DI ATAS keduanya: arsitektur bernama (ResNet/DenseNet), deret waktu klinis (LSTM), dan deteksi anomali (autoencoder) — tiga hal yang tidak punya lesson sendiri.",
      },
      reference: "ResNet = lompatan residual. DenseNet = semua lapis terhubung. LSTM = memori untuk deret waktu. Autoencoder = kenali normal, flag yang aneh. Grad-CAM = korelasi, bukan bukti.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca bagian 'metode' paper deep learning kesehatan dan menilai apakah arsitekturnya cocok dengan datanya — atau hanya ikut tren.",
        "(1) Menjelaskan skip connection ResNet (mengapa jaringan dalam bisa dilatih) dan dense connectivity DenseNet (growth rate, reuse fitur);",
        "(2) Menghitung jumlah parameter blok konvolusi dan lapis LSTM dari dimensinya;",
        "(3) Menjelaskan deteksi anomali dengan autoencoder: latih pada normal, flag reconstruction error di atas ambang;",
        "(4) Menghitung Grad-CAM dari peta fitur dan bobot, dan menjelaskan kenapa heatmap bukan bukti kausal.",
      ],
      tasks: [],
    },
    {
      id: "cnn-modern",
      eyebrow: "Langkah 3 · Teori",
      title: "ResNet dan DenseNet: dua jawaban atas jaringan yang terlalu dalam",
      prose: [
        "Jaringan konvolusi yang semakin dalam seharusnya semakin pintar — tetapi setelah titik tertentu, menambah lapis justru memperburuk akurasi, bahkan pada data latih. Penyebabnya adalah gradien yang menghilang: sinyal belajar yang merambat mundur melalui puluhan lapis menjadi terlalu kecil untuk mengubah lapis awal. ResNet (2015) menjawabnya dengan skip connection: keluaran satu lapis ditambahkan ke keluaran dua lapis kemudian, sehingga gradien punya 'jalan pintas' untuk mengalir mundur. Lapis yang tidak berguna bisa dipelajari menjadi identitas (menambahkan nol) — jaringan dalam tidak lagi lebih buruk dari jaringan dangkal.",
        "DenseNet (2017) menjawab dengan cara berlawanan: bukan melompati, melainkan menghubungkan SEMUA. Setiap lapis menerima sebagai masukan gabungan SEMUA peta fitur lapis sebelumnya. Lapis ke-4 dalam satu dense block dengan growth rate 32 dan 64 kanal awal menerima 64 tambah 32 dikali 3, sama dengan 160 kanal. Keuntungannya: reuse fitur maksimal — lapis tidak perlu mempelajari ulang apa yang sudah dipelajari lapis sebelumnya — sehingga DenseNet memakai parameter lebih hemat daripada ResNet pada akurasi yang sama. Harganya: memori. Menggabungkan semua peta fitur berarti menyimpan semuanya — dan untuk citra medis 3D (CT, MRI), memori itu cepat habis.",
        "Contoh hitung dari lab: satu dense block 4 lapis, kanal awal 64, growth rate 32, konvolusi 3x3. Lapis 1: 3 dikali 3 dikali 64 dikali 32 sama dengan 18.432 parameter. Lapis 2 (masukan 96 kanal): 27.648. Lapis 3 (128 kanal): 36.864. Lapis 4 (160 kanal): 46.080. Total blok: 129.024 parameter. Bandingkan dengan ResNet-50 yang totalnya sekitar 25 juta parameter dan ResNet-18 sekitar 11,7 juta — angka-angka ini bukan hafalan, melainkan cara membaca: bila paper mengklaim arsitektur 'ringan' tetapi parameternya 25 juta dan datanya 800 citra, klaim itu patut dicurigai (HD12: model besar plus data kecil sama dengan overfitting yang menunggu giliran).",
      ],
      tasks: [],
      formula: String.raw`\text{params konv} = k^2 \times C_{in} \times C_{out}`,
      formulaNote: "Parameter satu lapis konvolusi (tanpa bias): ukuran kernel kuadrat dikali kanal masuk dikali kanal keluar. Dense block lab: 18.432 + 27.648 + 36.864 + 46.080 = 129.024 parameter.",
      note: {
        title: "Sering salah",
        body: "Mengira jaringan yang lebih dalam selalu lebih baik untuk citra medis. Data medis berlabel itu mahal dan sedikit — jaringan dalam tanpa transfer learning (HD15) atau augmentasi akan menghafal data latih. Arsitektur harus sebanding dengan data, bukan dengan tren paper.",
      },
      reference: "ResNet: gradien punya jalan pintas. DenseNet: semua lapis terhubung, growth rate 32. Parameter harus sebanding dengan data.",
    },
    {
      id: "lstm-klinis",
      eyebrow: "Langkah 4 · Teori",
      title: "LSTM untuk deret waktu klinis: memori yang tahu kapan lupa",
      prose: [
        "Data klinis yang paling kaya bukan satu potret, melainkan deret waktu: tanda vital per jam, lab per hari, obat per shift. RNN biasa gagal di sini karena gradien menghilang sepanjang waktu — sinyal dari 48 jam lalu tidak sampai ke prediksi hari ini. LSTM menjawabnya dengan sel memori dan tiga gerbang: gerbang lupa (forget) memutuskan apa yang dibuang dari memori, gerbang masuk (input) memutuskan apa yang disimpan, gerbang keluar (output) memutuskan apa yang dibaca. Memori itu sendiri mengalir nyaris tanpa perubahan — seperti ban berjalan — sehingga informasi dari 48 jam lalu masih bisa memengaruhi prediksi sekarang.",
        "Contoh klinis: prediksi deteriorasi pasien ICU dari tanda vital per jam (detak jantung, tekanan darah, saturasi oksigen, laju napas). Pola yang penting bukan nilai sesaat, melainkan TREN: saturasi yang turun perlahan 6 jam berturut-turut lebih berbahaya daripada satu nilai rendah yang langsung pulih. LSTM membaca tren itu; model potret (satu baris fitur) tidak. Tetapi LSTM juga punya batas: ia butuh deret waktu yang panjang dan teratur — data ICU yang bolong-bolong (HD8: missing data) harus ditangani dulu, dan jendela waktu harus dipilih dengan alasan klinis (24 jam? 48 jam?), bukan karena default library.",
        "Contoh hitung dari lab: satu lapis LSTM dengan masukan 16 fitur dan hidden 32 unit. Rumus parameternya: 4 dikali ((masukan tambah hidden) dikali hidden tambah hidden) — angka 4 karena ada empat gerbang (lupa, masuk, kandidat, keluar), masing-masing dengan matriks bobotnya. Hitungannya: 4 dikali ((16 tambah 32) dikali 32 tambah 32) sama dengan 4 dikali 1.568 sama dengan 6.272 parameter. Kecil — tetapi ingat: parameter LSTM berulang di tiap langkah waktu, sehingga 6.272 parameter yang dipakai 48 kali (48 jam) tetap bisa overfitting pada 200 pasien. Jumlah parameter bukan satu-satunya ukuran kapasitas; jumlah langkah waktu juga.",
      ],
      tasks: [],
      formula: String.raw`\text{params LSTM} = 4 \times ((C_{in} + H) \times H + H)`,
      formulaNote: "Empat gerbang (lupa, masuk, kandidat, keluar), masing-masing dengan matriks bobot. Contoh lab: masukan 16, hidden 32 menjadi 4 dikali 1.568 = 6.272 parameter.",
      note: {
        title: "Kaitan ke HD12",
        body: "Model deret waktu yang bagus di validasi internal belum tentu bagus di rumah sakit lain — kalibrasi dan validasi eksternal (HD12) tetap wajib. LSTM yang memprediksi deteriorasi dengan AUC 0,90 di satu ICU bisa jatuh ke 0,70 di ICU lain karena protokol pencatatan yang berbeda.",
      },
      reference: "LSTM = sel memori + tiga gerbang. Tren lebih penting dari nilai sesaat. Parameter kecil tetap bisa overfitting bila langkah waktu banyak.",
    },
    {
      id: "autoencoder-gradcam",
      eyebrow: "Langkah 5 · Teori",
      title: "Autoencoder dan Grad-CAM: kenali normal, tunjuk yang aneh",
      prose: [
        "Autoencoder belajar dengan cara yang berbeda dari klasifikasi: ia memampatkan masukan ke representasi kecil (bottleneck), lalu merekonstruksinya kembali — dan dilatih agar hasil rekonstruksinya semirip mungkin dengan aslinya. Bila dilatih HANYA pada data normal, ia menjadi ahli merekonstruksi normal — dan gagal merekonstruksi yang aneh. Kegagalan itu adalah sinyal: reconstruction error yang besar berarti 'ini tidak seperti yang biasa saya lihat'. Itulah deteksi anomali tanpa label: tidak perlu contoh penyakit, cukup banyak contoh normal.",
        "Contoh dari lab: enam pasien dengan reconstruction error 0,01, 0,02, 0,03, 0,02, 0,01, dan 0,21. Rata-rata 0,05, simpangan baku 0,07, ambang rata-rata tambah 2 simpangan baku sama dengan 0,19. Hanya satu pasien yang melewati ambang: yang error-nya 0,21. Ambang 'rata-rata tambah 2 simpangan baku' adalah aturan praktis, bukan hukum alam — ia mengasumsikan error berdistribusi mendekati normal, dan pada data kesehatan asumsi itu sering dilanggar. Selalu laporkan berapa yang ter-flag pada beberapa ambang (1,5, 2, dan 3 simpangan baku) agar pembaca melihat sensitivitas keputusanmu terhadap ambang.",
        "Grad-CAM menutup lingkaran interpretasi — dengan batas yang harus diingat. Ia mengambil peta fitur lapis konvolusi terakhir, menimbangnya dengan gradien kelas yang diprediksi, dan menghasilkan heatmap: daerah mana yang paling memengaruhi keputusan. Contoh lab: dua peta fitur 2x2 dengan bobot 0,6 dan 0,4 menghasilkan heatmap [[0,6, 1,6], [1,2, 1,0]] — titik terpanas (0,6 baris 1 kolom 2) bernilai 1,6. Tetapi heatmap yang menyala di paru hanya menunjukkan KORELASI antara daerah itu dan keputusan — bukan bukti bahwa daerah itu menyebabkan penyakit, dan bukan bukti bahwa model tidak memakai artefak di tempat lain. HD15 sudah membuktikannya: Grad-CAM menyala di sudut gambar (merek mesin) justru membongkar shortcut learning. Grad-CAM adalah alat investigasi, bukan sertifikat.",
      ],
      tasks: [],
      formula: String.raw`\text{ambang} = \mu + 2\sigma, \quad \text{Grad-CAM} = \text{ReLU}\left(\sum_k w_k A^k\right)`,
      formulaNote: "Ambang anomali lab: rata-rata 0,05 tambah 2 dikali simpangan baku 0,07 = 0,19 — 1 dari 6 pasien ter-flag. Grad-CAM: jumlah berbobot peta fitur A pangkat k dengan bobot w, lalu ReLU (buang negatif).",
      note: {
        title: "Sering salah",
        body: "Menyebut heatmap Grad-CAM sebagai 'bukti model melihat penyakit di sini'. Grad-CAM menunjukkan korelasi daerah-keputusan, bukan kausalitas — dan tidak membuktikan model TIDAK memakai artefak di luar heatmap. Selalu pasangkan dengan crop test dan validasi eksternal (HD15).",
      },
      reference: "Autoencoder: latih pada normal, flag error besar. Grad-CAM: korelasi daerah-keputusan, bukan bukti kausal.",
    },
    {
      id: "lab-dl",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: parameter DenseNet dan LSTM, heatmap Grad-CAM, ambang autoencoder",
      prose: [
        "Sekarang hitung sendiri angka-angka arsitektur di teori — tanpa library deep learning, hanya aritmetika. Pertama, dense block 4 lapis (kanal awal 64, growth rate 32, kernel 3x3): lapis 1 (64 kanal masuk) 18.432, lapis 2 (96) 27.648, lapis 3 (128) 36.864, lapis 4 (160) 46.080 — total 129.024 parameter. Kedua, LSTM (masukan 16, hidden 32): 4 dikali ((16 tambah 32) dikali 32 tambah 32) sama dengan 6.272 parameter.",
        "Ketiga, Grad-CAM mainan: dua peta fitur 2x2 — A1 [[1, 2], [0, 1]] dan A2 [[0, 1], [3, 1]] — dengan bobot w1 0,6 dan w2 0,4. Heatmap = 0,6 dikali A1 tambah 0,4 dikali A2 = [[0,6, 1,6], [1,2, 1,0]]; titik terpanas 1,6 di baris 1 kolom 2. Keempat, autoencoder: error [0,01, 0,02, 0,03, 0,02, 0,01, 0,21] — rata-rata 0,05, ambang rata-rata tambah 2 simpangan baku sama dengan 0,19, dan 1 pasien ter-flag.",
        "Setelah lolos, coba eksperimen: ubah growth rate menjadi 16 dan hitung ulang total dense block (kanal masuk 64, 80, 96, 112 — total 50.688 — 39,3 persen dari 129.024, bukan separuh (9 × 16 × (64 + 80 + 96 + 112) = 50.688)). Lalu ubah ambang autoencoder menjadi rata-rata tambah 3 simpangan baku (0,27) dan lihat tidak ada lagi yang ter-flag — ambang yang terlalu longgar membutakan detektor.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dense` = total parameter dense block 4 lapis (kanal awal 64, growth rate 32, kernel 3x3)" },
        { id: "t2", text: "Hitung `lstm` = parameter LSTM (masukan 16, hidden 32) dengan rumus 4 gerbang" },
        { id: "t3", text: "Hitung heatmap Grad-CAM 2x2 dan `gradcam_maks` = nilai terbesarnya" },
        { id: "t4", text: "Hitung `ambang` = rata-rata + 2 simpangan baku error, lalu `anomali` = jumlah error di atas ambang" },
      ],
      expected: "dense=129024\nlstm=6272\ngradcam_maks=1.6\nambang=0.19\nanomali=1",
      hints: [
        "Dense: kanal masuk lapis ke-i = 64 + 32 x (i-1); parameter = 9 x kanal_masuk x 32.",
        "LSTM: 4 x ((16 + 32) x 32 + 32) = 4 x 1568.",
        "Grad-CAM: 0,6 x A1 + 0,4 x A2, elemen per elemen; maks dari [[0,6, 1,6], [1,2, 1,0]] adalah 1,6.",
        "Simpangan baku di sini populasi (bagi n, bukan n-1): rata-rata 0,05, simpangan baku 0,07, ambang 0,19.",
      ],
      code: {
        starter: `import math\n\n# t1: dense block 4 lapis, kanal awal 64, growth rate 32, kernel 3x3\ndense = 0  # TULIS KODEMU: jumlahkan 9 x kanal_masuk x 32 untuk 4 lapis\n\n# t2: LSTM, masukan 16, hidden 32\nlstm = 0  # TULIS KODEMU: 4 x ((16 + 32) x 32 + 32)\n\n# t3: Grad-CAM mainan\nA1 = [[1, 2], [0, 1]]\nA2 = [[0, 1], [3, 1]]\nw1, w2 = 0.6, 0.4\ngradcam_maks = 0.0  # TULIS KODEMU: maks dari 0,6*A1 + 0,4*A2\n\n# t4: autoencoder — reconstruction error 6 pasien\nerrs = [0.01, 0.02, 0.03, 0.02, 0.01, 0.21]\nambang = 0.0  # TULIS KODEMU: rata-rata + 2 x simpangan baku (populasi)\nanomali = 0  # TULIS KODEMU: jumlah error di atas ambang\n\nprint(f"dense={dense}")\nprint(f"lstm={lstm}")\nprint(f"gradcam_maks={gradcam_maks:.1f}")\nprint(f"ambang={ambang:.2f}")\nprint(f"anomali={anomali}")`,
        lockLines: 0,
        solution: `import math\n\n# t1: dense block 4 lapis, kanal awal 64, growth rate 32, kernel 3x3\ndense = 0\nkanal = 64\nfor lapis in range(4):\n    dense += 9 * kanal * 32\n    kanal += 32\n\n# t2: LSTM, masukan 16, hidden 32\nlstm = 4 * ((16 + 32) * 32 + 32)\n\n# t3: Grad-CAM mainan\nA1 = [[1, 2], [0, 1]]\nA2 = [[0, 1], [3, 1]]\nw1, w2 = 0.6, 0.4\nheatmap = [[w1 * A1[i][j] + w2 * A2[i][j] for j in range(2)] for i in range(2)]\ngradcam_maks = max(max(baris) for baris in heatmap)\n\n# t4: autoencoder — reconstruction error 6 pasien\nerrs = [0.01, 0.02, 0.03, 0.02, 0.01, 0.21]\nmu = sum(errs) / len(errs)\nsd = math.sqrt(sum((e - mu) ** 2 for e in errs) / len(errs))\nambang = mu + 2 * sd\nanomali = sum(1 for e in errs if e > ambang)\n\nprint(f"dense={dense}")\nprint(f"lstm={lstm}")\nprint(f"gradcam_maks={gradcam_maks:.1f}")\nprint(f"ambang={ambang:.2f}")\nprint(f"anomali={anomali}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dense", value: 129024, label: "Dense block 4 lapis = 129.024 parameter", msg: "18.432 + 27.648 + 36.864 + 46.080. Kanal masuk lapis ke-i = 64 + 32 x (i-1)." },
          { kind: "equal", task: "t2", name: "lstm", value: 6272, label: "LSTM (16 masuk, 32 hidden) = 6.272 parameter", msg: "4 x ((16 + 32) x 32 + 32) = 4 x 1.568 = 6.272. Angka 4 karena ada empat gerbang." },
          { kind: "stdout_matches", task: "t3", pattern: "gradcam_maks=1.6", label: "Grad-CAM maks = 1,6", msg: "Heatmap [[0,6, 1,6], [1,2, 1,0]] — titik terpanas 1,6 di baris 1 kolom 2." },
          { kind: "equal", task: "t4", name: "anomali", value: 1, label: "Anomali di atas ambang 0,19 = 1 pasien", msg: "Rata-rata 0,05, simpangan baku 0,07, ambang 0,19 — hanya error 0,21 yang melewatinya." },
        ],
      },
      reference: "Dense block 129.024. LSTM 6.272. Grad-CAM maks 1,6. Ambang autoencoder 0,19, 1 anomali.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: arsitektur apa untuk data apa",
      prose: [
        "Skenario 1 — 'Klasifikasi citra medis 2D (rontgen, foto fundus) dengan data berlabel 1.000 sampai 10.000 citra.' → CNN transfer learning (ResNet/DenseNet pra-latih, fine-tune) — HD15. Alasan: data terlalu sedikit untuk latih dari nol; fitur pra-latih sudah memahami tepi dan tekstur. Contoh nyata: skrining retinopati diabetik.",
        "Skenario 2 — 'Prediksi deteriorasi dari tanda vital per jam di ICU.' → LSTM (atau transformer deret waktu bila data cukup). Alasan: yang penting tren sepanjang waktu, bukan satu potret. Contoh nyata: skor sepsis yang memakai 48 jam terakhir, bukan satu jam terakhir.",
        "Skenario 3 — 'Deteksi kasus langka tanpa contoh berlabel yang cukup (misal artefak alat, penyakit ultra-langka).' → Autoencoder yang dilatih pada normal. Alasan: tidak butuh label penyakit — cukup banyak contoh normal, dan yang aneh akan ter-flag. Contoh nyata: deteksi artefak pada sinyal ECG.",
        "Skenario 4 — 'Vendor mengklaim modelnya 'bisa dijelaskan' karena punya heatmap.' → Minta Grad-CAM + crop test + validasi eksternal (HD15). Alasan: heatmap saja bukan penjelasan — ia korelasi daerah-keputusan yang harus diuji, bukan sertifikat. Contoh nyata: tender AI radiologi Rp3,2 miliar di HD15.",
        "Aturan praktis 10 detik: data citra → CNN; data deret waktu → LSTM; tidak ada label penyakit → autoencoder; klaim 'bisa dijelaskan' → minta bukti, bukan heatmap.",
      ],
      tasks: [],
      reference: "Citra → CNN transfer learning. Deret waktu → LSTM. Tanpa label → autoencoder. Klaim interpretabilitas → Grad-CAM + crop test + eksternal.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: vendor AI radiologi dengan ResNet-50 dan AUC 0,97",
      prose: [
        "Vendor menawarkan AI radiologi berbasis ResNet-50: AUC 0,97 di data validasi internal, 25 juta parameter, dilatih pada 50.000 rontgen dari satu rumah sakit. Tawaran menggiurkan — tetapi tiga pertanyaan dari lesson ini mengubah penilaiannya. Pertama, data: 50.000 rontgen dari SATU rumah sakit berarti satu protokol, satu mesin, satu populasi — validasi eksternal (HD12) belum ada, dan domain shift antar-RS (HD15) hampir pasti menurunkan AUC. Kedua, arsitektur: ResNet-50 dengan 25 juta parameter untuk tugas yang mungkin cukup dengan ResNet-18 (11,7 juta) — apakah kapasitas ekstra itu dibutuhkan, atau hanya overfitting yang dibungkus nama besar? Ketiga, interpretasi: vendor menunjukkan Grad-CAM yang menyala di paru — tetapi tanpa crop test, tidak ada yang tahu apakah model juga memakai merek mesin di sudut gambar.",
        "Keputusan yang benar bukan menolak, melainkan meminta tiga bukti sebelum tanda tangan: (1) validasi eksternal di dua rumah sakit berbeda dengan protokol berbeda; (2) Grad-CAM plus crop test pada 100 kasus acak — bila AUC anjlok setelah crop sudut, model memakai artefak; (3) kalibrasi (HD12): apakah probabilitas 0,90 berarti 90 dari 100 kasus benar-benar positif, atau model overconfident? Tanpa ketiganya, AUC 0,97 adalah angka di atas kertas — dan kertas itu ditulis di rumah sakit vendor sendiri.",
        "Pembahasan: perhatikan bahwa semua keberatan di atas lahir dari memahami ARSITEKTUR dan DATANYA, bukan dari mencurigai vendor. ResNet-50 bukan arsitektur yang salah — ia hanya arsitektur yang kapasitasnya harus sebanding dengan data dan diuji di luar rumah asalnya. Analis yang paham lesson ini tidak berkata 'ResNet itu buruk'; ia berkata 'tunjukkan validasi eksternalnya'.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Minta tiga bukti: validasi eksternal di RS berbeda, Grad-CAM + crop test (bila AUC anjlok setelah crop, model memakai artefak), dan kalibrasi. AUC 0,97 tanpa ketiganya adalah angka di atas kertas rumah sakit vendor sendiri.",
      },
      reference: "Arsitektur besar butuh data besar dan validasi eksternal. Heatmap tanpa crop test bukan bukti.",
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
        "ResNet: skip connection memberi gradien jalan pintas. DenseNet: semua lapis terhubung, growth rate 32 — blok lab 129.024 parameter.",
        "LSTM: sel memori + tiga gerbang membaca tren deret waktu; lab: 6.272 parameter untuk masukan 16, hidden 32.",
        "Autoencoder: latih pada normal, flag error di atas ambang — lab: ambang 0,19, 1 dari 6 ter-flag.",
        "Grad-CAM: jumlah berbobot peta fitur — lab: maks 1,6; heatmap = korelasi, bukan bukti kausal.",
        "Arsitektur harus sebanding dengan data; klaim interpretabilitas butuh Grad-CAM + crop test + validasi eksternal.",
      ],
      next: { label: "HD35 — Sistem Surveilans End-to-End: Desain, Evaluasi dan Diseminasi", href: "/v2/learn/hd35-surveilans-end-to-end" },
      quiz: [
        {
          q: "Kenapa ResNet bisa dilatih jauh lebih dalam daripada CNN biasa tanpa akurasi memburuk?",
          options: [
            { text: "Karena ResNet memakai data latih yang lebih banyak", why: "Salah: data bukan penjelasnya. CNN biasa dengan data yang sama tetap memburuk saat diperdalam — masalahnya ada di gradien, bukan di data." },
            { text: "Karena skip connection memberi gradien jalan pintas untuk mengalir mundur, dan lapis yang tidak berguna bisa menjadi identitas", why: "Tepat: tanpa jalan pintas, gradien menghilang melalui puluhan lapis. Dengan jalan pintas, jaringan dalam tidak lebih buruk dari yang dangkal.", correct: true },
            { text: "Karena ResNet tidak memakai konvolusi sama sekali", why: "Salah: ResNet tetap memakai konvolusi — skip connection adalah tambahan di atas konvolusi, bukan penggantinya." },
            { text: "Karena ResNet selalu dilatih dengan transfer learning", why: "Salah: transfer learning (HD15) adalah teknik latih yang terpisah. Skip connection bekerja bahkan saat latih dari nol." },
          ],
        },
        {
          q: "Dense block lab: kanal awal 64, growth rate 32, 4 lapis. Berapa kanal masuk lapis ke-4, dan kenapa?",
          options: [
            { text: "64 — setiap lapis menerima kanal yang sama", why: "Salah: itu cara kerja CNN biasa. DenseNet menggabungkan SEMUA peta fitur sebelumnya — kanal masuk tumbuh tiap lapis." },
            { text: "160 — 64 tambah 32 dikali 3, karena lapis ke-4 menerima gabungan semua lapis sebelumnya", why: "Tepat: 64 + 32 + 32 + 32 = 160. Inilah dense connectivity — reuse fitur maksimal dengan harga memori.", correct: true },
            { text: "256 — kanal berlipat ganda tiap lapis", why: "Salah: growth rate menambah 32 tetap, bukan melipatgandakan. 256 tidak muncul di arsitektur ini." },
            { text: "32 — hanya growth rate yang diteruskan", why: "Salah: yang diteruskan adalah gabungan semua peta fitur, bukan hanya tambahan terakhir. Lapis ke-4 menerima 160 kanal, bukan 32." },
          ],
        },
        {
          q: "LSTM dipakai untuk prediksi deteriorasi ICU dari tanda vital per jam. Kenapa bukan model potret (satu baris fitur)?",
          options: [
            { text: "Karena LSTM lebih modern dan selalu lebih akurat", why: "Salah: 'lebih modern' bukan alasan. LSTM lebih tepat karena yang penting adalah TREN sepanjang waktu — saturasi yang turun 6 jam berturut-turut lebih berbahaya dari satu nilai rendah." },
            { text: "Karena yang penting adalah tren sepanjang waktu, dan LSTM punya sel memori yang membawa informasi 48 jam lalu ke prediksi sekarang", why: "Tepat: model potret tidak melihat tren. LSTM membaca urutan — dan gerbangnya memutuskan apa yang diingat dan apa yang dilupakan.", correct: true },
            { text: "Karena data ICU tidak punya nilai hilang", why: "Salah: data ICU justru penuh nilai hilang (HD8). Itu alasan untuk menangani missing data dulu, bukan alasan memilih LSTM." },
            { text: "Karena LSTM tidak butuh data latih yang banyak", why: "Salah: LSTM butuh deret waktu yang panjang dan teratur — dan tetap bisa overfitting pada 200 pasien. Kebutuhan datanya tidak kecil." },
          ],
        },
        {
          q: "Autoencoder dilatih pada ECG normal. Satu ECG baru punya reconstruction error 0,21, di atas ambang 0,19. Apa kesimpulannya?",
          options: [
            { text: "ECG itu pasti menunjukkan penyakit jantung tertentu", why: "Salah: autoencoder hanya berkata 'ini tidak seperti normal yang saya kenal' — bukan penyakit apa. Diagnosis tetap butuh dokter dan pemeriksaan lanjutan." },
            { text: "ECG itu anomali yang layak diperiksa lebih lanjut — detektor berkata 'tidak seperti normal', bukan 'ini penyakit X'", why: "Tepat: flag anomali adalah undangan untuk memeriksa, bukan vonis. Dan ambang 0,19 adalah aturan praktis — laporkan juga hasil pada ambang lain.", correct: true },
            { text: "Ambangnya salah — 0,21 terlalu dekat dengan 0,19 untuk dipercaya", why: "Salah: kedekatan dengan ambang memang berarti keyakinan lebih rendah, tetapi bukan berarti ambang salah. Itulah kenapa dilaporkan sensitivitas terhadap ambang (1,5, 2, dan 3 simpangan baku)." },
            { text: "Modelnya rusak — error 0,21 terlalu besar untuk ECG", why: "Salah: tidak ada 'terlalu besar' yang absolut. Error dibandingkan dengan distribusi error data normal — dan 0,21 memang di luar itu. Itulah gunanya ambang." },
          ],
        },
        {
          q: "Grad-CAM model rontgen menyala terang di paru. Apa yang BOLEH disimpulkan?",
          options: [
            { text: "Model melihat penyakit di paru itu — terbukti oleh heatmap", why: "Salah: heatmap menunjukkan korelasi daerah-keputusan, bukan kausalitas. Model bisa menyala di paru DAN memakai artefak di tempat lain secara bersamaan." },
            { text: "Daerah paru itu berkorelasi dengan keputusan model — tetapi itu bukan bukti kausal dan bukan bukti model tidak memakai artefak", why: "Tepat: Grad-CAM adalah alat investigasi. Buktinya butuh crop test (bila AUC anjlok setelah crop sudut, model memakai artefak) dan validasi eksternal.", correct: true },
            { text: "Model pasti tidak memakai artefak — bila memakai artefak, heatmap akan menyala di artefak", why: "Salah: heatmap hanya menunjukkan daerah PALING berpengaruh, bukan SATU-SATUNYA yang berpengaruh. Artefak dengan pengaruh lebih kecil tetap bisa dipakai tanpa menyala terang." },
            { text: "Tidak ada yang bisa disimpulkan dari Grad-CAM sama sekali", why: "Salah: Grad-CAM berguna — ia membongkar shortcut learning saat menyala di tempat yang salah (HD15). Yang tidak boleh adalah menjadikannya sertifikat." },
          ],
        },
      ],
    },
  ],
};
