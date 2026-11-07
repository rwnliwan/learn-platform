import type { V2Lesson } from "../lib/types";

// DLE27 — Fondasi yang tersebar: rangkaian fondasi (tensor, autodiff, backprop,
// optimizer, inisialisasi, normalisasi, regularisasi) + representation learning (DLE7/DLE16)
// learning (SimCLR / NT-Xent). Lab: hitung loss NT-Xent satu pasangan positif.
const CHAIN_SVG = `<svg viewBox="0 0 640 120" role="img" aria-label="Rantai fondasi: tensor, autodiff, backprop, optimizer, inisialisasi, normalisasi, regularisasi.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="8" y="40" width="80" height="40" rx="6" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="48" y="64" fill="var(--text)">Tensor</text>
<rect x="98" y="40" width="80" height="40" rx="6" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="138" y="64" fill="var(--text)">Autodiff</text>
<rect x="188" y="40" width="80" height="40" rx="6" fill="none" stroke="var(--c3)" stroke-width="2"/><text x="228" y="64" fill="var(--text)">Backprop</text>
<rect x="278" y="40" width="80" height="40" rx="6" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="318" y="64" fill="var(--text)">Optimizer</text>
<rect x="368" y="40" width="80" height="40" rx="6" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="408" y="64" fill="var(--text)">Inisialisasi</text>
<rect x="458" y="40" width="80" height="40" rx="6" fill="none" stroke="var(--c3)" stroke-width="2"/><text x="498" y="64" fill="var(--text)">Normalisasi</text>
<rect x="548" y="40" width="84" height="40" rx="6" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="590" y="64" fill="var(--text)">Regularisasi</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5">
<line x1="88" y1="60" x2="98" y2="60"/><line x1="178" y1="60" x2="188" y2="60"/><line x1="268" y1="60" x2="278" y2="60"/><line x1="358" y1="60" x2="368" y2="60"/><line x1="448" y1="60" x2="458" y2="60"/><line x1="538" y1="60" x2="548" y2="60"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="320" y="108">setiap kotak menjawab kegagalan kotak sebelumnya — bukan daftar belanja</text>
</g>
</svg>`;

export const dle27: V2Lesson = {
  slug: "dle27-fondasi-representasi",
  track: "Deep Learning Engineer",
  module: "Fondasi",
  title: "DLE27 — Fondasi yang Tersebar: dari Tensor ke Representation Learning",
  estMinutes: 55,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Mengapa fondasi tersebar — dan mengapa lesson ini ada",
      prose: [
        "Fondasi deep learning tidak diajarkan dalam satu tempat: tensor di DLE1, backprop di DLE2, optimizer di DLE6, inisialisasi dan normalisasi tersebar di DLE6–DLE7, regularisasi di DLE9, representation learning hanya muncul sebagai SimCLR di DLE7 dan DLE16. Akibatnya, banyak pembelajar bisa menulis training loop tetapi tidak bisa menjawab: mengapa ketujuh potongan ini ada, dan apa yang rusak bila satu di antaranya hilang?",
        "Lesson ini adalah jahitannya. DLE1 adalah petanya; DLE27 adalah benang yang menghubungkan peta itu menjadi satu rangkaian sebab-akibat — lalu melompat ke representation learning (DLE7/DLE16), ide yang menjelaskan mengapa pretraining bekerja dan kapan ia mengalahkan supervised learning murni.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan rantai fondasi sebagai jawaban berantai atas kegagalan, bukan daftar istilah; (2) menjelaskan representation learning dan loss NT-Xent SimCLR; (3) menghitung loss kontras satu pasangan positif dengan tangan; (4) memutuskan kapan melatih dari nol, kapan pretrain + fine-tune, dan kapan memakai fitur beku.",
      ],
      tasks: [],
      note: {
        title: "Cara membaca lesson ini",
        body: "Bila satu istilah terasa asing (mis. BatchNorm, weight decay), kembali ke lesson asalnya — DLE27 tidak mengulang detailnya, melainkan menunjukkan tempat istilah itu dalam rantai. Fondasi yang tersebar hanya bisa dipahami setelah tiap potongannya pernah disentuh.",
      },
      reference: "DLE1 = peta; DLE27 = jahitan. Rangkaian fondasi + representation learning (DLE7/DLE16) dalam satu tempat.",
    },
    {
      id: "rangkaian-dl1",
      eyebrow: "Langkah 2 · Rangkaian fondasi",
      title: "Tujuh kotak yang saling menjawab: tensor sampai regularisasi",
      prose: [
        "Rantai fondasi dibaca sebagai sebab-akibat, bukan daftar belanja. (1) Tensor: data dan parameter harus hidup dalam satu struktur yang bisa didiferensiasi — tanpa tensor, tidak ada gradien. (2) Autodiff: menghitung gradien dengan tangan untuk jutaan parameter adalah mustahil; autodiff mencatat graf komputasi dan menurunkan gradien secara mekanis. (3) Backprop: aturan rantai yang diterapkan pada graf — gradien mengalir mundur dari loss ke setiap parameter. (4) Optimizer: gradien saja tidak melatih model — SGD/Adam memutuskan seberapa besar langkah yang diambil dari gradien itu. (5) Inisialisasi: gradien yang mengalir mundur akan meledak atau menghilang bila bobot awal salah skala — inisialisasi yang benar menjaga sinyal tetap hidup di kedalaman. (6) Normalisasi: bahkan dengan inisialisasi benar, distribusi aktivasi bergeser selama training — normalisasi menstabilkannya agar optimizer tidak mengejar target yang bergerak. (7) Regularisasi: model yang sudah bisa belajar dengan stabil masih bisa menghafal — regularisasi (weight decay, dropout, early stopping) memaksanya menggeneralisasi.",
        "Uji pemahaman rantai ini dengan satu pertanyaan per kotak: bila kotaknya dihapus, apa yang rusak? Hapus autodiff → gradien ditulis tangan (tidak mungkin). Hapus inisialisasi → gradien hilang di layer dalam (DLE2). Hapus normalisasi → training lambat dan rapuh terhadap learning rate (DLE6). Hapus regularisasi → akurasi latih 1,00, akurasi uji jatuh (DLE9). Bila kamu tidak bisa menjawab 'apa yang rusak', kotaknya belum dipahami — hanya dihafal.",
        "💡 Intuisi: deep learning bukan tujuh teknik yang kebetulan berdampingan — melainkan tujuh jawaban atas tujuh kegagalan yang berurutan. Setiap kali training gagal, tanyakan: kotak mana yang rusak? Bukan: teknik apa lagi yang bisa ditambahkan?",
        "Cara membaca: tujuh kotak = rantai sebab-akibat; panah = 'memungkinkan' atau 'memperbaiki'. Tidak ada kotak yang berdiri sendiri — dan tidak ada kotak yang boleh dilewati dengan alasan 'nanti saja'.",
        "Interpretasi: rantai ini adalah checklist diagnosis. Training tidak konvergen? Periksa dari kiri: tensor benar? gradien mengalir? optimizer melangkah? inisialisasi hidup? distribusi stabil? Bila semua kotak hijau dan model masih menghafal — barulah kotak terakhir (regularisasi) yang dituduh.",
      ],
      figure: {
        svg: CHAIN_SVG,
        alt: "Rantai fondasi: tensor, autodiff, backprop, optimizer, inisialisasi, normalisasi, regularisasi.",
        caption: "Rantai fondasi: setiap kotak menjawab kegagalan kotak sebelumnya — bukan daftar belanja.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: diagnosis berjalan dari kiri ke kanan",
        body: "Kebanyakan bug training hidup di tiga kotak pertama (tensor, autodiff, backprop) atau di kotak kelima-keenam (inisialisasi, normalisasi). Regularisasi hampir tidak pernah menjadi penyebab training yang tidak konvergen — ia hanya menutupi overfitting setelah training berhasil.",
      },
      reference: "Rantai fondasi: tensor → autodiff → backprop → optimizer → inisialisasi → normalisasi → regularisasi.",
    },
    {
      id: "representation-learning",
      eyebrow: "Langkah 3 · Representation learning",
      title: "Representation learning (DLE7/DLE16): mengapa representasi yang bagus mengalahkan label yang banyak",
      prose: [
        "Supervised learning meminta label untuk setiap contoh — mahal, lambat, dan rapuh terhadap kelas yang tidak pernah dilihat. Representation learning membalik urutan: pelajari dulu representasi yang bagus dari data TANPA label, lalu pakai sedikit label untuk tugas akhirnya. SimCLR adalah contoh paling bersih: ambil satu gambar, buat dua augmentasi berbeda (crop, warna, blur), lalu latih model agar kedua augmentasi itu berdekatan di ruang embedding — dan jauh dari gambar lain dalam batch.",
        "Loss-nya NT-Xent: untuk satu pasangan positif dengan kemiripan kosinus s_pos dan negatif s_1…s_K pada suhu τ, loss = −ln(exp(s_pos/τ) / Σ exp(s/τ)). Suhu τ mengontrol ketajaman: τ kecil → distribusi lebih tajam, negatif yang sulit (mirip positif) dihukum lebih keras. Tanpa τ eksplisit, softmax tetap membedakan 'sedikit mirip' dari 'sangat mirip' — itu setara dengan τ = 1. Suhu mengubah ketajaman distribusi dan pembobotan gradien, bukan menciptakan kemampuan membedakan dari nol.",
        "Mengapa ini bekerja? Augmentasi mendefinisikan 'apa yang TIDAK penting' (crop, warna, blur tidak mengubah identitas gambar) — dan kontras mendefinisikan 'apa yang penting' (dua augmentasi dari gambar yang sama harus tetap berdekatan). Model yang lolos dari tugas ini telah belajar fitur yang invarian terhadap augmentasi — dan fitur invarian itulah yang mentransfer ke tugas baru dengan sedikit label. DLE7 (transfer) dan DLE16 (CLIP) adalah dua wajah dari ide yang sama: representasi dulu, label kemudian.",
        "💡 Intuisi: label memberi tahu model 'ini kucing'; kontras memberi tahu model 'dua foto ini adalah foto yang sama, dan yang lain bukan'. Yang kedua lebih murah (tanpa label) dan lebih umum (berlaku untuk gambar apa pun) — karena itu pretraining kontras mengalahkan supervised murni saat label langka.",
      ],
      tasks: [],
      formula: String.raw`L = -\log\frac{\exp(s_{pos}/\tau)}{\sum_{j}\exp(s_j/\tau)}`,
      formulaNote: "L = loss NT-Xent satu pasangan positif; s_pos = kemiripan kosinus pasangan positif; s_j = kemiripan dengan semua contoh (positif + negatif) dalam batch; τ = suhu (temperature).",
      note: {
        title: "🚨 Mitos: representation learning = unsupervised learning lama dengan nama baru",
        type: "pitfall",
        body: "Yang benar: representation learning modern (SimCLR, CLIP) memakai sinyal pengawasan dari STRUKTUR data itu sendiri — augmentasi dan pasangan — bukan dari label manusia. Sinyalnya lebih murah dan lebih melimpah, tetapi tetap sinyal pengawasan; menyebutnya 'tanpa pengawasan' menyembunyikan dari mana model belajar.",
      },
      reference: "SimCLR: dua augmentasi dari satu gambar harus berdekatan; yang lain harus jauh. Loss NT-Xent.",
    },
    {
      id: "lab-contrastive",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: hitung loss NT-Xent dengan tangan",
      prose: [
        "Satu pasangan positif dengan kemiripan kosinus 0,9; dua negatif dengan kemiripan 0,2 dan 0,4; suhu τ = 0,5. Hitung: pembilang = exp(0,9/0,5) = exp(1,8) = 6,0496. Penyebut = 6,0496 + exp(0,2/0,5) + exp(0,4/0,5) = 6,0496 + 1,4918 + 2,2255 = 9,7670. Rasio = 0,6194. Loss = −ln(0,6194) = 0,479. Perhatikan: SEMUA kemiripan dibagi suhu — bukan hanya positifnya. Membagi hanya positif (kesalahan umum) memberi 0,371 — angka yang salah karena rumusnya tidak konsisten.",
        "Apa arti 0,479? Model memberi peluang 0,619 kepada pasangan yang benar — lebih baik dari tebakan acak (1/3 ≈ 0,333 untuk 1 positif + 2 negatif), tetapi jauh dari sempurna (loss 0 = peluang 1). Naikkan kemiripan positif ke 0,95 dan loss turun; turunkan suhu ke 0,2 dan loss TURUN menjadi 0,106 — karena positif 0,9 sudah jauh memimpin, suhu rendah justru 'menegaskan' keunggulan itu (pembilang exp(4,5) = 90,02 mendominasi penyebut 100,12; peluang pasangan benar naik menjadi 0,899). Suhu rendah tidak selalu menaikkan loss: ia menajamkan selisih yang sudah ada — bila positif memimpin, loss turun; bila justru negatif yang memimpin (mis. s_pos 0,4 lawan negatif 0,9: loss 1,313 pada τ = 0,5 menjadi 2,579 pada τ = 0,2), loss naik. Coba sendiri: ubah angka-angka di lab dan amati arah perubahannya sebelum membaca penjelasannya.",
        "💡 Intuisi: loss kontras adalah soal pilihan ganda dengan suhu. τ = seberapa 'tegas' model harus membedakan; s_pos = seberapa yakin model pada jawaban benar. Loss 0,479 = model cukup yakin, belum yakin penuh.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pembilang` = exp(s_pos / tau) dan `penyebut` = jumlah exp(s / tau) semua contoh" },
        { id: "t2", text: "Hitung `loss` = -ln(pembilang / penyebut)" },
      ],
      formula: String.raw`L = -\log\frac{\exp(s_{pos}/\tau)}{\sum_{j}\exp(s_j/\tau)}`,
      formulaNote: "s_pos = 0,9; negatif = 0,2 dan 0,4; τ = 0,5. Pembilang = exp(1,8) = 6,0496; penyebut = 6,0496 + 1,4918 + 2,2255 = 9,7670.",
      expected: "loss=0.479",
      note: {
        title: "🚨 Mitos: suhu hanya men-skala loss, tidak mengubah apa yang dipelajari",
        type: "pitfall",
        body: "Yang benar: τ mengubah GRADIEN — τ kecil memberi gradien lebih besar pada negatif yang sulit (hard negative), sehingga model belajar membedakan yang mirip, bukan yang mudah. Suhu yang salah = model yang belajar hal yang salah, bukan loss yang lebih besar.",
      },
      hints: [
        "pembilang = math.exp(s_pos / tau) — 0,9/0,5 = 1,8.",
        "penyebut = pembilang + sum(math.exp(s / tau) for s in s_neg) — SEMUA dibagi tau.",
        "loss = -math.log(pembilang / penyebut).",
      ],
      code: {
        starter: `import math

# Satu pasangan positif (kemiripan kosinus 0.9) dan dua negatif (0.2, 0.4); suhu 0.5
s_pos = 0.9
s_neg = [0.2, 0.4]
tau = 0.5

# TULIS KODEMU: hitung loss NT-Xent satu pasangan positif
pembilang = ...
penyebut = ...
loss = ...
print(f"loss={loss:.3f}")`,
        lockLines: 8,
        solution: `import math

# Satu pasangan positif (kemiripan kosinus 0.9) dan dua negatif (0.2, 0.4); suhu 0.5
s_pos = 0.9
s_neg = [0.2, 0.4]
tau = 0.5

# TULIS KODEMU: hitung loss NT-Xent satu pasangan positif
pembilang = math.exp(s_pos / tau)
penyebut = pembilang + sum(math.exp(s / tau) for s in s_neg)
loss = -math.log(pembilang / penyebut)
print(f"loss={loss:.3f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "loss", value: 0.479, tol: 0.001, label: "`loss` = 0.479", msg: "exp(1,8)=6,0496; penyebut 9,7670; rasio 0,6194; −ln = 0,479." },
          { kind: "stdout_matches", task: "t2", pattern: "loss=0\\.479", label: "output sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "NT-Xent: semua kemiripan dibagi suhu τ. Loss 0,479 = peluang 0,619 pada pasangan benar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan latih dari nol, kapan pretrain + fine-tune, kapan fitur beku",
      prose: [
        "Tiga jalur, satu pertanyaan: berapa label yang kamu punya, dan seberapa mirip domainmu dengan domain pretraining? (1) Fitur beku (probe linear di atas embedding pretrained): label sedikit (ratusan), domain mirip — murah, cepat, dan sulit overfit. Inilah jalur DLE12 (probe 0,917 dengan 12 teks). (2) Pretrain + fine-tune (adapter LoRA atau full fine-tune): label sedang (ribuan), domain agak bergeser — adapter kecil menutup gap tanpa merusak representasi. Inilah jalur DLE12 (LoRA 1,000) dan DLE20. (3) Latih dari nol: label melimpah (jutaan) atau domain sama sekali baru (sensor yang tidak ada di pretraining) — mahal, lambat, dan hanya dibenarkan bila dua jalur lain gagal.",
        "Kesalahan paling umum: memilih jalur 3 karena 'lebih murni' — lalu kehabisan label di tengah jalan dan kembali ke jalur 2 dengan waktu terbuang. Aturan praktis: mulai dari jalur 1 (termurah), naik ke jalur 2 bila gap terukur, dan ke jalur 3 hanya bila ada bukti jalur 2 tidak cukup. Urutan ini sama dengan pola capstone DLE12: probe dulu, LoRA kemudian, full fine-tune terakhir — dan hanya bila angkanya menuntut.",
        "💡 Intuisi: representation learning mengubah pertanyaan 'berapa label yang saya punya' menjadi 'berapa label yang saya BUTUHKAN'. Jawabannya hampir selalu: lebih sedikit dari yang kamu kira — bila representasinya sudah bagus.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Memilih jalur training tanpa menghitung label dan domain = membeli risiko jadwal. Jalur 3 yang gagal di tengah jalan lebih mahal dari jalur 1 yang selesai — karena yang pertama tidak punya artefak yang bisa di-deploy.",
      },
      reference: "Mulai dari fitur beku → adapter → dari nol. Naik jalur hanya bila gap terukur.",
    },
    {
      id: "minicase-representasi",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: supervised 0,72 vs pretrain + fine-tune 0,86",
      prose: [
        "Skenario (angka ilustratif): tim klasifikasi citra medis punya 800 citra berlabel. Jalur supervised murni (latih dari nol) mencapai akurasi 0,72. Jalur pretrain + fine-tune (encoder pretrained kontras pada 100.000 citra tanpa label, lalu fine-tune dengan 800 label yang sama) mencapai 0,86. Selisih 0,14 — dari representasi, bukan dari label tambahan, karena labelnya sama.",
        "Keputusan: pakai jalur pretrain + fine-tune — tetapi dengan dua catatan. Pertama, selisih 0,14 adalah bukti transfer HANYA bila evaluasi memakai data yang sama dan belum pernah dilihat (DLE9); bila split-nya berbeda, selisih itu bisa jadi artefak. Kedua, 0,86 bukan angka final: zona abu-abu (skor 0,4–0,6) tetap ke review manusia, dan drift (perangkat pencitraan baru) memicu retraining. Representasi yang bagus tidak menghapus kebutuhan evaluasi — ia hanya membuat evaluasi itu layak dilakukan.",
        "💡 Intuisi: 0,14 adalah harga representasi. Bila labelmu langka dan datamu tak berlabel melimpah, pretraining adalah cara termurah membeli akurasi — lebih murah dari melabeli 10.000 citra baru.",
      ],
      tasks: [],
      note: {
        title: "Angka ilustratif — verifikasi sebelum memakai",
        body: "0,72 dan 0,86 adalah angka ilustratif untuk melatih penalaran, bukan hasil eksperimen. Pola yang dibawa pulang: bandingkan jalur pada data dan split yang SAMA, dan perlakukan selisih sebagai klaim yang harus dibuktikan — bukan janji.",
      },
      reference: "Mini-case ini memakai angka ilustratif — hitung ulang sendiri sebelum memakai pola yang sama.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang rantai fondasi dan representation learning — dari diagnosis training sampai keputusan pretraining.",
      ],
      tasks: [],
      summary: [
        "Rantai fondasi: tensor → autodiff → backprop → optimizer → inisialisasi → normalisasi → regularisasi — setiap kotak menjawab kegagalan kotak sebelumnya.",
        "Diagnosis training berjalan dari kiri ke kanan; regularisasi hampir tidak pernah menjadi penyebab training yang tidak konvergen.",
        "Representation learning: pelajari representasi dari data tanpa label (augmentasi + kontras), lalu pakai sedikit label — SimCLR/NT-Xent.",
        "NT-Xent: loss = −ln(exp(s_pos/τ) / Σ exp(s/τ)); semua kemiripan dibagi suhu; loss lab = 0,479 (peluang 0,619).",
        "Keputusan jalur: fitur beku (label sedikit, domain mirip) → adapter (label sedang) → dari nol (label melimpah / domain baru).",
      ],
      next: { label: "DLE28 — Sequence Forecasting: RNN, 1D ConvNet, WaveNet & Transformer", href: "/v2/learn/dle28-sequence-forecasting" },
      quiz: [
        {
          q: "Mengapa rantai fondasi diajarkan sebagai sebab-akibat, bukan daftar istilah?",
          options: [
            { text: "Karena setiap kotak menjawab kegagalan kotak sebelumnya", correct: true, why: "Hapus inisialisasi → gradien hilang; hapus normalisasi → training rapuh; hapus regularisasi → menghafal. Rantai = checklist diagnosis, bukan daftar belanja." },
            { text: "Karena urutannya alfabetis dan mudah dihafal", correct: false, why: "Urutan rantai adalah urutan sebab-akibat (tensor memungkinkan gradien, gradien memungkinkan optimizer), bukan alfabet." },
            { text: "Karena semua kotak sama pentingnya di semua proyek", correct: false, why: "Kotak yang rusak berbeda-beda per proyek — diagnosis berjalan dari kiri dan berhenti di kotak yang rusak, bukan memeriksa semuanya dengan bobot sama." },
            { text: "Karena tanpa rantai, model tidak bisa dilatih sama sekali", correct: false, why: "Model bisa dilatih tanpa memahami rantai — tetapi tidak bisa DIDIAGNOSIS saat gagal. Rantai adalah alat diagnosis, bukan prasyarat training." },
          ],
        },
        {
          q: "Loss NT-Xent lab = 0,479 (s_pos 0,9; negatif 0,2 dan 0,4; τ = 0,5). Apa peran suhu τ?",
          options: [
            { text: "τ kecil → distribusi lebih tajam, negatif sulit dihukum lebih keras", correct: true, why: "τ mengontrol ketajaman softmax atas kemiripan — τ kecil memberi gradien lebih besar pada hard negative. Suhu yang salah = model belajar hal yang salah." },
            { text: "τ hanya men-skala loss tanpa mengubah gradien", correct: false, why: "τ mengubah gradien: ia menentukan seberapa besar hukuman untuk negatif yang mirip positif. Bukan sekadar skala." },
            { text: "τ harus selalu 0,5 agar loss bisa dibandingkan", correct: false, why: "0,5 adalah nilai lab ini, bukan konstanta universal — τ adalah hyperparameter yang dipilih per tugas." },
            { text: "τ membagi hanya kemiripan positif", correct: false, why: "Semua kemiripan dibagi τ — membagi hanya positif memberi 0,371, angka yang salah karena rumusnya tidak konsisten." },
          ],
        },
        {
          q: "Kapan representation learning (SimCLR) mengalahkan supervised murni?",
          options: [
            { text: "Saat label langka tetapi data tak berlabel melimpah", correct: true, why: "Kontras belajar dari struktur data (augmentasi + pasangan) tanpa label manusia — representasi yang bagus lalu mentransfer dengan sedikit label." },
            { text: "Saat label melimpah dan murah", correct: false, why: "Label melimpah = supervised murni sudah cukup; pretraining kontras memberi sedikit tambahan dengan biaya komputasi yang besar." },
            { text: "Saat tidak ada data sama sekali", correct: false, why: "Representation learning tetap butuh data — hanya saja tanpa label. Tanpa data, tidak ada yang bisa dipelajari." },
            { text: "Saat tugasnya klasifikasi biner sederhana", correct: false, why: "Tugas sederhana tidak butuh representasi yang dalam — supervised murni dengan sedikit label sudah cukup." },
          ],
        },
        {
          q: "Kamu punya 800 citra berlabel dan 100.000 citra tak berlabel dari domain yang sama. Jalur yang benar?",
          options: [
            { text: "Pretrain kontras pada 100.000 citra, lalu fine-tune dengan 800 label", correct: true, why: "Label sedikit + data tak berlabel melimpah + domain sama = jalur pretrain + fine-tune. Mini-case: 0,72 → 0,86 (angka ilustratif)." },
            { text: "Latih dari nol dengan 800 label — paling murni", correct: false, why: "800 label untuk latih dari nol = underfit atau overfit; representasi pretrained adalah cara termurah membeli akurasi di sini." },
            { text: "Beli 100.000 label lagi sebelum mulai", correct: false, why: "Melabeli 100.000 citra jauh lebih mahal dari pretraining kontras — dan tidak perlu bila representasi sudah bagus." },
            { text: "Pakai fitur beku tanpa fine-tune apa pun", correct: false, why: "Fitur beku adalah jalur termurah, tetapi dengan 800 label, adapter/fine-tune ringan hampir selalu menutup gap tambahan — ukur dulu, baru putuskan." },
          ],
        },
        {
          q: "Mini-case: supervised 0,72 vs pretrain + fine-tune 0,86 (angka ilustratif). Kesimpulan yang benar?",
          options: [
            { text: "Selisih 0,14 adalah bukti transfer — bila evaluasi memakai data dan split yang sama", correct: true, why: "Labelnya sama (800), datanya sama, split-nya sama — selisih hanya bisa berasal dari representasi. Bila split berbeda, selisih itu bisa jadi artefak." },
            { text: "0,86 membuktikan pretraining selalu menang 0,14", correct: false, why: "0,14 adalah angka satu mini-case ilustratif, bukan konstanta universal — besar transfer tergantung domain, data, dan tugas." },
            { text: "0,72 membuktikan supervised murni tidak berguna", correct: false, why: "0,72 adalah baseline yang jujur — tanpa baseline, 0,86 tidak punya pembanding. Baseline yang kalah tetap berharga." },
            { text: "Zona abu-abu tidak perlu review manusia karena akurasi sudah 0,86", correct: false, why: "0,86 masih menyisakan 14% salah — zona abu-abu tetap ke review manusia. Akurasi tinggi tidak menghapus human-in-the-loop." },
          ],
        },
      ],
    },
  ],
};
