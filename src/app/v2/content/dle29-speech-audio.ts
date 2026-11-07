import type { V2Lesson } from "../lib/types";

export const dle29: V2Lesson = {
  slug: "dle29-speech-audio",
  track: "Deep Learning Engineer",
  module: "Audio",
  title: "DLE29 — Speech & Audio: dari Gelombang ke Kata",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Asisten suara yang tuli pada aksen pelanggan",
      prose: [
        "Warung Kopi Senja memasang asisten suara untuk mencatat pesanan: pelanggan bicara, mesin menulis. Di demo dengan suara pemiliknya — pria Jakarta, artikulasi jelas — akurasinya 97 persen. Di hari pertama live, pelanggan dari Makassar memesan lima kilo beras dan mesin menulis lima kilo deras. Pesanan salah, pelanggan tertawa, pemilik warung menelepon tim data.",
        "Akar masalahnya bukan modelnya bodoh, melainkan data latihnya sempit: satu aksen, satu ruangan sepi, satu mikrofon bagus. Audio adalah data yang paling tidak memaafkan soal distribusi: aksen, noise warung, dan mikrofon murah mengubah sinyal lebih drastis daripada yang diubah font pada citra. Deep learning menang di citra, teks, dan audio — kata DLE1 — tetapi hanya bila kamu memahami apa yang berubah antara demo dan dunia nyata.",
        "Lesson ini membawa deep learning ke telinga: dari gelombang ke spektrogram, dari spektrogram ke kata, dan dari kata kembali ke suara. Setelah lesson ini kamu bisa: (1) menghitung frame, Nyquist, dan resolusi frekuensi dari parameter sampling; (2) menjelaskan pipeline speech recognition dan menghitung WER; (3) membedakan sintesis autoregresif dan diffusion untuk suara dan musik; (4) merancang evaluasi audio yang menguji aksen dan noise, bukan hanya rekaman studio.",
      ],
      tasks: [],
      note: {
        title: "Satu-satunya lesson audio di track ini",
        body: "DLE1 hanya menyebut audio sebagai salah satu jenis data tak terstruktur tempat deep learning menang. Tidak ada lesson lain di track DLE yang membahas speech recognition, pemrosesan audio, atau sintesis musik. Lesson ini mengisi kekosongan itu dari nol: sampling, spektrum, kata, dan suara.",
      },
      reference: "Audio = data tak terstruktur yang paling sensitif terhadap distribusi: aksen, noise, mikrofon.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca sinyal audio sebagai data, mengukur kualitas sistem speech, dan memilih arsitektur sintesis dari kebutuhan latensi dan kualitas.",
        "(1) Menghitung jumlah sampel, jumlah frame, dan frekuensi Nyquist dari durasi, sample rate, dan ukuran frame;",
        "(2) Menjelaskan rantai gelombang, STFT, mel filterbank, dan MFCC — serta apa yang hilang di tiap tahap;",
        "(3) Menghitung Word Error Rate dari pasangan referensi dan hipotesis dengan jarak edit kata;",
        "(4) Membandingkan sintesis autoregresif WaveNet dan diffusion untuk TTS dan musik, termasuk trade-off latensi.",
      ],
      tasks: [],
    },
    {
      id: "gelombang-spektrum",
      eyebrow: "Langkah 3 · Teori",
      title: "Gelombang, sampling, dan spektrogram",
      prose: [
        "Audio mentah adalah gelombang: satu angka per sampel, sebanyak sample rate per detik. Telepon memakai 8.000 sampel per detik, asisten suara memakai 16.000, musik studio memakai 44.100. Teorema Nyquist menetapkan batasnya: frekuensi tertinggi yang bisa ditangkap adalah setengah sample rate — 8.000 Hz untuk asisten suara, 4.000 Hz untuk telepon. Suara manusia sebagian besar hidup di 300 sampai 3.400 Hz, sehingga telepon masih cukup — tetapi bunyi s dan f di atas 4.000 Hz hilang, dan itulah kenapa suara telepon terdengar mendengung.",
        "Gelombang sepanjang waktu sulit dibaca model, maka ia dipotong menjadi frame: 25 milidetik per frame, geser 10 milidetik — frame saling tumpang tindih supaya tidak ada informasi yang jatuh di sela. Klip 2,5 detik pada 16.000 Hz berisi 40.000 sampel; tiap frame 400 sampel; jumlah frame-nya 1 ditambah (40.000 minus 400) dibagi 160, yaitu 248 frame. Tiap frame diubah menjadi spektrum lewat STFT — transformasi Fourier singkat — sehingga satu klip menjadi gambar dua dimensi: waktu di sumbu horizontal, frekuensi di sumbu vertikal, intensitas sebagai warna. Inilah spektrogram, dan inilah alasan CNN dan transformer bisa dipakai untuk audio: gambar bisa dibaca seperti citra.",
        "Dari spektrogram, ada dua penyederhanaan standar. Mel filterbank mengelompokkan frekuensi ke 40 pita skala mel — skala yang meniru telinga manusia, yang lebih peka pada frekuensi rendah. MFCC mengambil 13 koefisien pertama dari log mel spektrum — representasi ringkas yang membuang detail pitch dan menyimpan bentuk saluran vokal. Harganya: MFCC membuang informasi nada, sehingga ia bagus untuk mengenali kata, tetapi buruk untuk mengenali siapa yang bicara atau lagu apa yang dimainkan.",
      ],
      tasks: [],
      formula: String.raw`f_{\text{Nyquist}} = \frac{f_s}{2} \qquad N_{\text{frame}} = 1 + \frac{N - L}{H}`,
      formulaNote: "f_Nyquist = frekuensi tertinggi yang bisa ditangkap, setengah dari sample rate f_s. N_frame = jumlah frame; N = jumlah sampel; L = panjang frame; H = hop atau geseran. Contoh lab: 2,5 detik pada 16.000 Hz, frame 400, hop 160, maka 248 frame.",
      reference: "Nyquist = setengah sample rate. Frame 25 ms, hop 10 ms. Spektrogram = audio yang diubah menjadi gambar.",
    },
    {
      id: "asr-wer",
      eyebrow: "Langkah 4 · Teori",
      title: "Speech recognition: dari spektrogram ke kata, dan cara mengukurnya",
      prose: [
        "Pipeline klasik speech recognition punya tiga lapis: model akustik memetakan frame spektrogram ke fonem — unit bunyi terkecil; model bahasa menilai urutan kata mana yang masuk akal; decoder mencari urutan kata dengan skor gabungan tertinggi. Model modern seperti Whisper mengganti ketiganya dengan satu transformer encoder-decoder yang dilatih pada 680 ribu jam audio berlabel — tetapi logikanya sama: bunyi, lalu kata, lalu kalimat yang masuk akal.",
        "CTC, Connectionist Temporal Classification, memecahkan satu masalah mendasar: frame dan kata tidak sejajar — satu kata bisa menutupi 30 frame, dan kita tidak tahu batasnya. CTC membiarkan model mengeluarkan label per frame, termasuk label kosong, lalu meruntuhkan pengulangan dan menghapus label kosong menjadi kata. Tanpa CTC, tiap frame harus diberi label kata secara manual — pekerjaan yang mustahil pada skala besar.",
        "Metriknya adalah WER, Word Error Rate: jumlah substitusi, delesi, dan insersi dibagi jumlah kata referensi, dikali 100 persen. Kalimat referensi 10 kata dengan 1 substitusi dan 1 delesi punya WER 20,00 persen — seperti di lab. WER 20 persen berarti satu dari lima kata salah; untuk pencatat pesanan warung, itu berarti satu dari lima pesanan berisiko salah. Target produksi yang wajar untuk domain sempit adalah di bawah 10 persen — dan WER harus dilaporkan per aksen, bukan satu angka global yang menyembunyikan aksen terburuk.",
      ],
      tasks: [],
      formula: String.raw`\text{WER} = 100 \times \frac{S + D + I}{N}`,
      formulaNote: "WER = Word Error Rate dalam persen. S = substitusi, kata diganti; D = delesi, kata hilang; I = insersi, kata tambahan; N = jumlah kata referensi. Contoh lab: S=1, D=1, I=0, N=10, maka WER = 20,00 persen.",
      reference: "Model akustik = bunyi. Model bahasa = kata yang masuk akal. WER = (S + D + I) / N.",
    },
    {
      id: "sintesis",
      eyebrow: "Langkah 5 · Teori",
      title: "Sintesis: WaveNet autoregresif, diffusion, dan musik",
      prose: [
        "Sintesis suara adalah forecasting yang dibalik: bukan meramal angka berikutnya dari deret, melainkan membangkitkan deret dari teks. WaveNet membangkitkan audio sampel per sampel — tiap sampel diprediksi dari 16.000 sampel sebelumnya lewat konvolusi dilated kausal dari DLE28. Kualitasnya luar biasa untuk zamannya, tetapi 16.000 langkah per detik audio berarti sintesis satu menit butuh 960 ribu langkah berurutan — lambat untuk layanan real-time.",
        "Diffusion membalik cara berpikirnya: mulai dari noise murni, lalu hilangkan noise sedikit demi sedikit selama puluhan langkah sampai menjadi audio yang bersih. Tiap langkah memproses seluruh klip sekaligus — paralel, bukan sekuensial — sehingga satu menit audio selesai dalam puluhan langkah, bukan ratusan ribu. Harganya adalah kontrol: diffusion hebat untuk musik dan efek suara, tetapi menjaga konsistensi suara satu pembicara selama satu jam narasi masih lebih sulit daripada WaveNet.",
        "Untuk musik, kedua pendekatan dipakai dengan cara yang sama seperti teks: model belajar pola — ketukan, tangga nada, struktur verse dan chorus — dari ribuan lagu. Evaluasinya bukan akurasi, melainkan uji dengar manusia: apakah pendengar bisa membedakan hasil sintesis dari rekaman asli, dan apakah melodinya punya struktur atau hanya noodling acak yang terdengar meyakinkan selama 10 detik pertama. Aturan yang sama dengan evaluasi LLM: metrik otomatis menipu, uji manusia yang menentukan.",
      ],
      tasks: [],
      note: {
        title: "Latensi menentukan arsitektur",
        body: "Asisten suara real-time butuh respons di bawah 300 milidetik — WaveNet autoregresif murni tidak lolos, diffusion paralel atau model distilled yang lolos. Musik offline satu menit tidak punya batas latensi — kualitas yang menang. Selalu tanyakan batas latensi sebelum memilih arsitektur sintesis.",
      },
      reference: "WaveNet = sampel per sampel, kualitas tinggi, lambat. Diffusion = noise ke audio, paralel, puluhan langkah.",
    },
    {
      id: "lab-audio",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: frame, frekuensi dominan, dan WER",
      prose: [
        "Sekarang hitung tiga angka audio dari nol. Pertama, klip 2,5 detik pada 16.000 Hz berisi 40.000 sampel; frame 25 milidetik sama dengan 400 sampel; hop 10 milidetik sama dengan 160 sampel; jumlah frame 248. Kedua, sinyal sinus 1.000 Hz yang disampel pada 8.000 Hz dengan 8 titik — DFT-nya menaruh seluruh energi di bin 1 dan bin 7, masing-masing bermagnitudo 4,0 — frekuensi dominan 1.000 Hz, tepat seperti yang dibangkitkan. Ketiga, WER kalimat pesanan.",
        "Kalimat referensi sepuluh kata: saya pergi ke pasar membeli beras lima kilo untuk ibu. Hipotesis mesin sembilan kata: saya pergi ke pasar membeli beras kilo buat ibu. Satu kata hilang — lima — dan satu kata diganti — untuk menjadi buat. Substitusi 1, delesi 1, insersi 0, dibagi 10 kata, WER 20,00 persen. Satu dari lima kata salah: untuk pesanan warung, itu satu dari lima pesanan yang berisiko.",
        "Perhatikan bin 7 pada DFT: ia adalah cermin bin 1 — sinyal nyata selalu punya spektrum simetris. Pemula yang melaporkan dua frekuensi dominan — 1.000 dan 7.000 Hz — sedang membaca cermin sebagai sinyal kedua. Selalu baca hanya paruh pertama spektrum untuk sinyal nyata.",
        "Setelah lolos, coba eksperimen: ganti hipotesis menjadi kalimat yang benar semua kecuali satu kata tambahan — insersi 1 dari 10 kata — dan lihat WER tetap 10,00 persen. Substitusi, delesi, dan insersi dihukum sama rata oleh WER.",
      ],
      tasks: [
        { id: "t1", text: "Hitung jumlah frame klip 2,5 detik pada 16.000 Hz dengan frame 400 dan hop 160" },
        { id: "t2", text: "Hitung DFT 8 titik dari sinus 1.000 Hz dan temukan frekuensi dominannya" },
        { id: "t3", text: "Hitung WER hipotesis terhadap referensi dengan jarak edit kata" },
      ],
      expected: "wer=20.00%",
      hints: [
        "Jumlah frame = 1 + (40.000 - 400) / 160 = 248 — pembagian bulat, karena 39.600 habis dibagi 160.",
        "DFT naive: jumlahkan x[n] kali exp(-2j pi b n / 8) untuk tiap bin b; magnitudo terbesar ada di bin 1.",
        "WER: isi tabel jarak edit dengan min dari tiga tetangga — substitusi, delesi, insersi — lalu bagi dengan 10 kata.",
      ],
      code: {
        starter: `import cmath\nimport math\n\n# TULIS KODEMU: (1) jumlah frame klip 2,5 detik, 16.000 Hz, frame 400, hop 160.\n# (2) DFT 8 titik dari sinus 1000 Hz pada 8000 Hz; frekuensi dominan.\n# (3) WER referensi 10 kata vs hipotesis 9 kata.\n\nref = ["saya", "pergi", "ke", "pasar", "membeli", "beras", "lima", "kilo", "untuk", "ibu"]\nhyp = ["saya", "pergi", "ke", "pasar", "membeli", "beras", "kilo", "buat", "ibu"]\n\nframes = 0\ndominant = 0\nwer = 0.0\n\nprint(f"frames={frames}")\nprint(f"dominant={dominant} Hz")\nprint(f"wer={wer:.2f}%")`,
        lockLines: 7,
        solution: `import cmath\nimport math\n\nref = ["saya", "pergi", "ke", "pasar", "membeli", "beras", "lima", "kilo", "untuk", "ibu"]\nhyp = ["saya", "pergi", "ke", "pasar", "membeli", "beras", "kilo", "buat", "ibu"]\n\nframes = 1 + (40000 - 400) // 160\n\nsinyal = [math.sin(math.pi * n / 4) for n in range(8)]\nmags = []\nfor b in range(8):\n    total = sum(sinyal[n] * cmath.exp(-2j * math.pi * b * n / 8) for n in range(8))\n    mags.append(round(abs(total), 2))\ndominant = max(range(8), key=lambda b: mags[b]) * 8000 // 8\n\nbaris = [[0] * 10 for _ in range(11)]\nfor i in range(11):\n    baris[i][0] = i\nfor j in range(10):\n    baris[0][j] = j\nfor i in range(1, 11):\n    for j in range(1, 10):\n        biaya = 0 if ref[i - 1] == hyp[j - 1] else 1\n        baris[i][j] = min(baris[i - 1][j] + 1, baris[i][j - 1] + 1, baris[i - 1][j - 1] + biaya)\njarak = baris[10][9]\nwer = round(jarak / 10 * 100, 2)\n\nprint(f"frames={frames}")\nprint(f"dominant={dominant} Hz")\nprint(f"wer={wer:.2f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "frames=248\\ndominant=1000 Hz\\nwer=20\\.00%", label: "Frame, frekuensi dominan, dan WER sesuai hitungan", msg: "Frames 248; dominan 1.000 Hz (bin 1, magnitudo 4,0); WER 20,00 persen (1 substitusi + 1 delesi dari 10 kata)." },
          { kind: "equal", task: "t1", name: "frames", value: 248, tol: 0.01, label: "`frames` = 248", msg: "1 + (40.000 - 400) / 160 = 248 frame." },
          { kind: "equal", task: "t3", name: "wer", value: 20.0, tol: 0.01, label: "`wer` = 20.00", msg: "Jarak edit 2 (1 substitusi + 1 delesi) dibagi 10 kata = 20,00 persen." },
          { kind: "uses", task: "t2", token: "exp", label: "DFT naive dihitung", msg: "Hitung DFT dengan penjumlahan langsung memakai cmath.exp." },
        ],
      },
      reference: "Frames 248. Dominan 1.000 Hz, bin 1, magnitudo 4,0. WER 20,00 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: asisten suara warung lolos gerbang atau tidak?",
      prose: [
        "Tim warung menetapkan tiga gerbang sebelum asisten suara boleh live: sample rate 16.000 Hz supaya Nyquist 8.000 Hz menutup seluruh rentang suara manusia; WER di bawah 10 persen pada data uji; dan WER dilaporkan per aksen, bukan satu angka global.",
        "Hasil uji: WER global 20,00 persen — sama seperti lab — dengan perincian aksen Jakarta 8 persen, aksen Makassar 32 persen, dan aksen Medan 24 persen. Angka globalnya menutupi masalah: aksen Jakarta sudah lolos gerbang 10 persen, tetapi dua aksen lain gagal jauh. Keputusan: TIDAK lolos live. Bukan karena modelnya buruk secara umum, melainkan karena data latihnya tidak mewakili pelanggan yang sebenarnya datang.",
        "Perbaikan yang diperintahkan: tambah 200 jam rekaman aksen Makassar dan Medan dengan noise warung asli, lalu uji ulang dengan gerbang per aksen. Bila WER Makassar turun dari 32 menjadi 12 persen, masih gagal — gerbangnya 10 persen, bukan hampir 10 persen. Dan satu larangan: jangan menurunkan gerbang supaya lolos — gerbang yang digeser setelah melihat hasil bukan gerbang, melainkan hiasan.",
        "Pelajaran untuk sintesis: suara balasan asisten memakai diffusion paralel supaya latensi di bawah 300 milidetik — WaveNet autoregresif murni tidak lolos batas itu untuk klip sepanjang respons pesanan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "WER global 20,00 persen menutupi Jakarta 8 persen, Makassar 32 persen, Medan 24 persen. Vonis: TIDAK lolos — gerbang 10 persen berlaku per aksen. Perbaikan: 200 jam rekaman aksen yang gagal, dengan noise warung asli.",
      },
      reference: "WER wajib per aksen. Angka global menyembunyikan aksen terburuk.",
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
        "Nyquist = setengah sample rate; klip 2,5 detik pada 16.000 Hz dengan frame 400 dan hop 160 menghasilkan 248 frame.",
        "Spektrogram mengubah audio menjadi gambar; mel filterbank 40 pita dan MFCC 13 koefisien adalah penyederhanaan standar.",
        "WER = (S + D + I) / N; lab: 1 substitusi + 1 delesi dari 10 kata = 20,00 persen.",
        "WaveNet autoregresif: kualitas tinggi, lambat. Diffusion: paralel, puluhan langkah.",
        "WER wajib dilaporkan per aksen — angka global menyembunyikan aksen terburuk.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Telepon memakai 8.000 sampel per detik. Frekuensi tertinggi yang bisa ditangkap dan konsekuensinya?",
          options: [
            { text: "8.000 Hz — seluruh suara manusia tertangkap sempurna", why: "Salah: batas Nyquist adalah setengah sample rate, bukan sample rate itu sendiri." },
            { text: "4.000 Hz — bunyi di atas itu hilang, sehingga suara telepon terdengar mendengung", why: "Tepat: Nyquist = 8.000 / 2 = 4.000 Hz. Suara manusia 300-3.400 Hz masih lolos, bunyi s dan f di atas 4.000 Hz tidak.", correct: true },
            { text: "16.000 Hz — telepon memakai oversampling dua kali", why: "Salah: tidak ada oversampling di sini. Batasnya justru setengah dari 8.000." },
            { text: "300 Hz — hanya frekuensi terendah yang tertangkap", why: "Salah: 300 Hz adalah batas bawah rentang suara manusia, bukan batas Nyquist telepon." },
          ],
        },
        {
          q: "Kenapa MFCC bagus untuk mengenali kata tetapi buruk untuk mengenali siapa yang bicara?",
          options: [
            { text: "Karena MFCC hanya memakai 13 koefisien — terlalu sedikit untuk kata sekalipun", why: "Salah: 13 koefisien cukup untuk kata karena kata ditentukan bentuk saluran vokal, bukan detail pitch." },
            { text: "Karena MFCC membuang informasi nada dan menyimpan bentuk saluran vokal", why: "Tepat: kata ditentukan bentuk saluran vokal; identitas pembicara banyak ditentukan nada yang dibuang MFCC.", correct: true },
            { text: "Karena MFCC tidak memakai spektrogram sama sekali", why: "Salah: MFCC justru diturunkan dari log mel spektrum — ia memakai spektrogram, lalu menyederhanakannya." },
            { text: "Karena MFCC hanya bekerja pada musik, bukan suara", why: "Salah: MFCC adalah representasi standar speech recognition, bukan musik." },
          ],
        },
        {
          q: "Hipotesis mesin menambahkan satu kata yang tidak ada di referensi 10 kata. Berapa kontribusi insersi itu pada WER?",
          options: [
            { text: "0 persen — insersi tidak dihitung WER", why: "Salah: insersi adalah salah satu dari tiga komponen WER: S + D + I." },
            { text: "10,00 persen — 1 insersi dibagi 10 kata referensi", why: "Tepat: tiap jenis kesalahan dihukum sama rata — 1 dari 10 kata berarti 10,00 persen.", correct: true },
            { text: "9,09 persen — 1 dibagi 11 kata hipotesis", why: "Salah: penyebut WER adalah jumlah kata referensi (10), bukan hipotesis (11)." },
            { text: "20,00 persen — insersi dihitung ganda karena menambah kata", why: "Salah: tidak ada penggandaan. Satu insersi = 10,00 persen pada referensi 10 kata." },
          ],
        },
        {
          q: "DFT sinyal nyata menaruh magnitudo 4,0 di bin 1 dan bin 7 dari 8 bin. Apa arti bin 7?",
          options: [
            { text: "Frekuensi kedua sebesar 7.000 Hz yang juga ada di sinyal", why: "Salah: bin 7 adalah cermin bin 1. Sinyal nyata punya spektrum simetris — membaca cermin sebagai sinyal kedua adalah kesalahan klasik." },
            { text: "Cermin bin 1 — sinyal nyata selalu punya spektrum simetris, baca hanya paruh pertama", why: "Tepat: frekuensi dominan tetap 1.000 Hz dari bin 1.", correct: true },
            { text: "Noise pengukuran pada frekuensi tinggi", why: "Salah: magnitudo 4,0 sama besar dengan bin 1 — bukan noise kecil, melainkan pasangan simetris yang matematis." },
            { text: "Harmonik kedua dari 1.000 Hz", why: "Salah: harmonik kedua 1.000 Hz adalah 2.000 Hz di bin 2, bukan bin 7." },
          ],
        },
        {
          q: "WER global 20 persen, tetapi aksen Jakarta 8 persen dan Makassar 32 persen. Keputusan gerbang 10 persen yang benar?",
          options: [
            { text: "Lolos — angka global 20 persen masih bisa diterima untuk demo", why: "Salah: gerbangnya 10 persen dan berlaku per aksen. 20 persen sudah gagal, dan Makassar 32 persen lebih gagal lagi." },
            { text: "Tidak lolos — gerbang berlaku per aksen, dan dua aksen gagal jauh", why: "Tepat: angka global menyembunyikan aksen terburuk. Perbaikan: tambah data aksen yang gagal.", correct: true },
            { text: "Lolos untuk Jakarta saja, tanpa perlu memperbaiki aksen lain", why: "Salah: pelanggan warung bukan hanya dari Jakarta. Live parsial per aksen bukan keputusan yang diajukan — gerbangnya untuk seluruh pelanggan." },
            { text: "Turunkan gerbang menjadi 35 persen supaya lolos", why: "Salah: gerbang yang digeser setelah melihat hasil bukan gerbang, melainkan hiasan." },
          ],
        },
      ],
    },
  ],
};
