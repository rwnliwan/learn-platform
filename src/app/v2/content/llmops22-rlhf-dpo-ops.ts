import type { V2Lesson } from "../lib/types";

export const llmops22: V2Lesson = {
  slug: "llmops22-rlhf-dpo-ops",
  track: "LLMOps",
  module: "Alignment Ops",
  title: "LLMOps22 — Operasionalisasi RLHF & DPO: dari Preferensi ke Produksi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang makin sopan, makin tidak bisa menjawab",
      prose: [
        "Tim support di bank digital DanaKu menjalankan DPO pada model layanan pelanggan mereka: 10 ribu pasangan preferensi, satu malam training, skor preferensi naik. Seminggu kemudian, keluhan masuk: model menolak menjawab pertanyaan saldo dengan alasan kebijakan, dan jawaban yang dulu dua kalimat kini menjadi lima paragraf yang sopan tetapi kosong. Preferensi naik, kegunaan turun.",
        "Investigasi menemukan tiga dosa operasional sekaligus. Pertama, data preferensi dikumpulkan dari anotator yang selalu memilih jawaban lebih panjang — model belajar bahwa panjang sama dengan bagus. Kedua, tidak ada gerbang regresi: tidak ada yang mengukur apakah kemampuan menjawab pertanyaan saldo masih utuh setelah alignment. Ketiga, tidak ada monitoring: tidak ada yang tahu kapan preferensi pelanggan bergeser sehingga model hasil DPO bulan lalu sudah basi.",
        "MLE26 dan DLE20 sudah mengajarkan teori DPO dan RLHF — rumus loss, beta, dan kapan memilih DPO dibanding PPO. Lesson ini adalah lapis operasionalnya: pipeline data preferensi, evaluasi reward model, gerbang rollout, dan monitoring pasca-deploy. Alignment yang tidak dioperasionalkan adalah eksperimen yang kebetulan lolos ke produksi.",
        "Setelah lesson ini kamu bisa: (1) mengaudit data preferensi untuk bias panjang dan kesepakatan anotator; (2) mengevaluasi reward model dengan akurasi berpasangan; (3) menghitung loss DPO satu pasangan dari log-probabilitas; (4) menulis gerbang rollout alignment dan sinyal monitoring pasca-deploy.",
      ],
      tasks: [],
      note: {
        title: "Hubungan dengan MLE26, DLE20, dan LLMOps8",
        body: "MLE26 dan DLE20 mengajarkan DPO sebagai teori: rumus loss, beta sebagai rem, dan kapan DPO mengalahkan RLHF. LLMOps8 mengajarkan operasional fine-tuning SFT — registry adapter dan gerbang evaluasi. Lesson ini TIDAK mengulang ketiganya: di sini DPO diperlakukan sebagai tahap operasional dengan data preferensi yang harus diaudit, reward model yang harus diukur, dan gerbang rollout yang harus dilewati.",
      },
      reference: "Teori DPO = MLE26 dan DLE20. Operasional alignment = lesson ini.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengoperasionalkan satu putaran alignment dari pengumpulan preferensi sampai monitoring produksi, dan mempertahankan keputusannya dengan angka.",
        "(1) Menghitung kesepakatan anotator dan mendeteksi bias panjang dalam data preferensi;",
        "(2) Mengukur reward model dengan akurasi berpasangan dan menjelaskan kenapa akurasi itu bukan jaminan;",
        "(3) Menghitung loss DPO satu pasangan preferensi dari log-probabilitas model dan referensi;",
        "(4) Menulis gerbang rollout alignment — win rate, retensi kemampuan, keamanan — dan sinyal monitoring pasca-deploy.",
      ],
      tasks: [],
    },
    {
      id: "data-preferensi",
      eyebrow: "Langkah 3 · Teori",
      title: "Data preferensi: audit dulu, latih kemudian",
      prose: [
        "Data preferensi adalah pasangan jawaban menang dan kalah untuk satu prompt yang sama. Kualitasnya menentukan segalanya: DPO memperkuat apa pun yang ada di datanya, termasuk kebiasaan buruk anotator. Dua audit wajib sebelum training. Pertama, kesepakatan anotator: dua anotator independen menilai pasangan yang sama — bila mereka sepakat pada 1.020 dari 1.200 pasangan, kesepakatannya 85,00 persen. Di bawah 70 persen, pasanganmu ambigu — model belajar selera acak.",
        "Kedua, bias panjang: hitung berapa persen pasangan yang dimenangkan jawaban yang lebih panjang. Bila 720 dari 1.200 pasangan dimenangkan jawaban panjang, angkanya 60,00 persen — 10 poin di atas 50 persen yang diharapkan bila panjang tidak berpengaruh. Model yang dilatih pada data ini akan belajar bertele-tele, persis seperti model DanaKu di cerita pembuka. Perbaikannya: seimbangkan pasangan — setengah dimenangkan jawaban panjang, setengah dimenangkan jawaban pendek — atau normalisasi panjang sebelum membandingkan.",
        "Dua audit lain yang sering dilupakan: cakupan — apakah pasangan mencakup seluruh jenis prompt produksi, atau hanya keluhan yang mudah? — dan kebocoran — apakah ada contoh evaluasi golden set yang terselip di data training? Kebocoran berarti skor evaluasimu palsu, seperti diingatkan DLE20. Aturan praktis: tidak ada training alignment sebelum laporan audit data preferensi ditandatangani — satu halaman, empat angka: kesepakatan, bias panjang, cakupan, dan kebocoran.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: makin banyak pasangan makin bagus",
        body: "10 ribu pasangan bias lebih buruk dari 2 ribu pasangan bersih. DPO mengalikan bias data — tiap pasangan yang salah arah adalah satu langkah kecil menuju model yang sopan tetapi tidak berguna. Kurasi mengalahkan volume, selalu.",
      },
      reference: "Audit preferensi: kesepakatan, bias panjang, cakupan, kebocoran. DPO memperkuat apa pun di datanya.",
    },
    {
      id: "reward-dpo",
      eyebrow: "Langkah 4 · Teori",
      title: "Reward model, DPO, dan satu angka loss",
      prose: [
        "RLHF klasik punya tiga tahap: SFT, latih reward model dari pasangan preferensi, lalu optimasi policy dengan PPO agar reward naik. Reward model diukur dengan akurasi berpasangan: dari 200 pasangan validasi, berapa kali ia memberi skor lebih tinggi pada jawaban yang dimenangkan manusia. Akurasi 170 dari 200, yaitu 85,00 persen, terdengar bagus — tetapi ingat: reward model yang akurat pada data validasi bisa tetap diretas oleh policy — reward hacking — karena policy mencari celah skor yang tidak ada di validasi.",
        "DPO memotong rantai itu: tanpa reward model eksplisit, tanpa PPO. Loss-nya memakai rasio log-probabilitas policy terhadap model referensi. Contoh satu pasangan dengan beta 0,1: jawaban menang punya log-probabilitas minus 1,2 terhadap referensi minus 1,5 — selisih 0,3. Jawaban kalah punya minus 2,0 terhadap referensi minus 1,8 — selisih minus 0,2. Delta sama dengan 0,1 dikali (0,3 dikurangi minus 0,2), yaitu 0,05. Loss sama dengan minus log sigmoid 0,05, yaitu 0,6685. Satu angka, satu pasangan, tanpa loop RL.",
        "Beta adalah remnya: beta besar menahan model dekat dengan referensi — aman, tetapi perubahan perilaku kecil. Beta kecil memberi kebebasan besar — perubahan cepat, tetapi risiko lupa kemampuan SFT meningkat. Pilihan beta 0,1 sampai 0,5 adalah titik awal standar; beta di bawah 0,05 hampir selalu berarti kamu melatih terlalu agresif untuk datamu.",
        "Kapan tetap memakai RLHF dengan PPO: bila reward tidak bisa dinyatakan sebagai pasangan preferensi — misalnya reward dari eksekusi kode yang lolos test, atau permainan multi-langkah. Di sana DPO tidak punya pasangan untuk dipelajari, dan PPO — dengan segala kerewelannya — adalah alat yang benar.",
      ],
      tasks: [],
      formula: String.raw`\mathcal{L}_{\text{DPO}} = -\mathbb{E}\left[\log \sigma\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]`,
      formulaNote: "Loss DPO. y_w = jawaban menang, y_l = jawaban kalah, pi_theta = model yang dilatih, pi_ref = model referensi beku, beta = kekuatan rem, sigma = sigmoid. Contoh lab: beta 0,1, delta 0,05, loss 0,6685.",
      reference: "Reward model diukur akurasi berpasangan. DPO = satu loss, tanpa reward model dan PPO.",
    },
    {
      id: "gerbang-monitoring",
      eyebrow: "Langkah 5 · Teori",
      title: "Gerbang rollout dan monitoring pasca-deploy",
      prose: [
        "Model hasil alignment tidak boleh langsung menggantikan model lama untuk 100 persen trafik. Gerbang rollout punya tiga kunci. Pertama, win rate: pada 200 prompt golden set, jawaban model baru dipilih atas model SFT lama sebanyak 116 kali — 58,00 persen — melewati ambang 55 persen. Kedua, retensi kemampuan: skor MMLU turun dari 61,2 ke 60,1 — turun 1,1 poin, masih di bawah batas 2 poin. Ketiga, keamanan: nol pelanggaran baru pada suite uji keamanan. Satu kunci gagal, rollout berhenti — tanpa diskusi.",
        "Rollout-nya bertahap: 5 persen trafik selama tiga hari, lalu 25 persen, lalu 100 persen — dengan tombol rollback satu klik yang mengembalikan adapter lama. Tiap tahap membandingkan metrik yang sama: win rate, retensi, dan keluhan pelanggan. Model yang lolos gerbang offline bisa tetap gagal di tahap 5 persen karena distribusi prompt produksi berbeda dari golden set — itulah gunanya canary.",
        "Monitoring pasca-deploy mengawasi empat sinyal. Panjang jawaban rata-rata: bila naik 30 persen dalam seminggu, bias panjang kembali — dari data, bukan dari training. Tingkat penolakan: bila model makin sering menolak, alignment-nya terlalu ketat. Win rate berjalan terhadap model lama: bila turun di bawah 50 persen, preferensi pelanggan bergeser dan putaran alignment baru dibutuhkan. Dan distribusi prompt: topik baru yang tidak ada di data preferensi adalah undangan untuk mengumpulkan pasangan baru — sebelum keluhan datang.",
      ],
      tasks: [],
      note: {
        title: "Reward hacking: skor naik, manfaat turun",
        body: "Tanda klasiknya: skor preferensi naik sementara metrik tugas — penyelesaian pertanyaan saldo, misalnya — turun. Policy menemukan cara memuaskan reward model tanpa memuaskan pelanggan: jawaban panjang yang sopan dan kosong. Obatnya bukan beta lebih besar, melainkan evaluasi tugas yang independen dari reward.",
      },
      reference: "Tiga kunci gerbang: win rate, retensi kemampuan, keamanan. Rollout 5, 25, 100 persen.",
    },
    {
      id: "lab-alignment",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: audit preferensi, loss DPO, dan vonis gerbang",
      prose: [
        "Sekarang hitung putaran alignment DanaKu dari angka mentahnya. Data preferensi 1.200 pasangan: anotator sepakat pada 1.020 — kesepakatan 85,00 persen, di atas ambang 70 persen. Jawaban yang lebih panjang menang pada 720 pasangan — 60,00 persen, 10 poin di atas 50 persen netral — bias panjang terdeteksi — dan data harus diseimbangkan sebelum training BERIKUTNYA. Gerbang putaran ini (win rate, retensi, keamanan) tidak memakai bias panjang sebagai kunci, jadi temuan ini menjadi catatan perbaikan putaran berikutnya, bukan penahan lolos — lihat vonis gerbang di bawah.",
        "Reward model: 170 dari 200 pasangan validasi dinilai benar — akurasi 85,00 persen. Loss DPO satu pasangan dengan beta 0,1: selisih jawaban menang 0,3, selisih jawaban kalah minus 0,2, delta 0,05, loss 0,6685. Tulis rumusnya, bukan angkanya — lab memeriksa loss yang kamu hitung dari log-probabilitas yang diberikan.",
        "Gerbang rollout: win rate 116 dari 200, yaitu 58,00 persen — lolos ambang 55 persen. Retensi MMLU turun 1,1 poin dari 61,2 ke 60,1 — lolos batas 2 poin. Keamanan nol pelanggaran baru. Tiga kunci lolos, vonis gerbang LOLOS — tetapi dengan catatan: bias panjang 60,00 persen wajib diperbaiki pada putaran berikutnya, karena model yang lolos hari ini bisa bertele-tele bulan depan.",
        "Setelah lolos, coba eksperimen: ubah beta menjadi 0,5 dan lihat loss-nya — delta menjadi 0,25 dan loss turun menjadi 0,5759. Beta besar membuat loss lebih kecil untuk pasangan yang sama, karena model didorong lebih lemah — loss yang kecil bukan berarti model yang lebih baik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung kesepakatan anotator dan bias panjang dari data preferensi" },
        { id: "t2", text: "Hitung akurasi berpasangan reward model dan loss DPO satu pasangan" },
        { id: "t3", text: "Terapkan tiga kunci gerbang dan cetak vonisnya" },
      ],
      expected: "gerbang=LOLOS",
      hints: [
        "Kesepakatan = 1.020 / 1.200 x 100. Bias panjang = 720 / 1.200 x 100; bandingkan dengan 50 persen netral.",
        "Delta DPO = beta x ((logp menang - logp ref menang) - (logp kalah - logp ref kalah)). Loss = -log sigmoid(delta).",
        "Win rate = 116 / 200 x 100 = 58,00 persen; retensi = 61,2 - 60,1 = 1,1 poin.",
      ],
      code: {
        starter: `import math\n\n# Data audit: 1200 pasangan preferensi.\nsepakat = 1020\npanjang_menang = 720\n# Reward model: 170 benar dari 200 pasangan validasi.\nrm_benar = 170\nrm_total = 200\n# DPO satu pasangan: beta 0,1.\nbeta = 0.1\nlogp_w, logp_ref_w = -1.2, -1.5\nlogp_l, logp_ref_l = -2.0, -1.8\n# Gerbang: win rate 116 dari 200; MMLU 61,2 ke 60,1; pelanggaran keamanan 0.\nmenang = 116\nmmlu_awal, mmlu_akhir = 61.2, 60.1\npelanggaran = 0\n\n# TULIS KODEMU: kesepakatan, bias panjang, akurasi RM, loss DPO, vonis gerbang.\n\nkesepakatan = 0.0\nbias_panjang = 0.0\nakurasi_rm = 0.0\ndpo_loss = 0.0\ngerbang = "GAGAL"\n\nprint(f"kesepakatan={kesepakatan:.2f}%")\nprint(f"bias_panjang={bias_panjang:.2f}%")\nprint(f"akurasi_rm={akurasi_rm:.2f}%")\nprint(f"dpo_loss={dpo_loss:.4f}")\nprint(f"gerbang={gerbang}")`,
        lockLines: 13,
        solution: `import math\n\n# Data audit: 1200 pasangan preferensi.\nsepakat = 1020\npanjang_menang = 720\n# Reward model: 170 benar dari 200 pasangan validasi.\nrm_benar = 170\nrm_total = 200\n# DPO satu pasangan: beta 0,1.\nbeta = 0.1\nlogp_w, logp_ref_w = -1.2, -1.5\nlogp_l, logp_ref_l = -2.0, -1.8\n# Gerbang: win rate 116 dari 200; MMLU 61,2 ke 60,1; pelanggaran keamanan 0.\nmenang = 116\nmmlu_awal, mmlu_akhir = 61.2, 60.1\npelanggaran = 0\n\nkesepakatan = sepakat / 1200 * 100\nbias_panjang = panjang_menang / 1200 * 100\nakurasi_rm = rm_benar / rm_total * 100\n\ndelta = beta * ((logp_w - logp_ref_w) - (logp_l - logp_ref_l))\nsigmoid = 1 / (1 + math.exp(-delta))\ndpo_loss = round(-math.log(sigmoid), 4)\n\nwin_rate = menang / 200 * 100\nturun_mmlu = round(mmlu_awal - mmlu_akhir, 1)\nif win_rate >= 55 and turun_mmlu <= 2 and pelanggaran == 0:\n    gerbang = "LOLOS"\nelse:\n    gerbang = "GAGAL"\n\nprint(f"kesepakatan={kesepakatan:.2f}%")\nprint(f"bias_panjang={bias_panjang:.2f}%")\nprint(f"akurasi_rm={akurasi_rm:.2f}%")\nprint(f"dpo_loss={dpo_loss:.4f}")\nprint(f"gerbang={gerbang}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "kesepakatan=85\\.00%\\nbias_panjang=60\\.00%\\nakurasi_rm=85\\.00%\\ndpo_loss=0\\.6685\\ngerbang=LOLOS", label: "Audit, loss DPO, dan vonis gerbang sesuai hitungan", msg: "Kesepakatan 85,00 persen; bias panjang 60,00 persen; akurasi RM 85,00 persen; loss DPO 0,6685; gerbang LOLOS." },
          { kind: "equal", task: "t2", name: "dpo_loss", value: 0.6685, tol: 0.0001, label: "`dpo_loss` = 0.6685", msg: "Delta 0,05; sigmoid 0,5125; -log = 0,6685." },
          { kind: "equal", task: "t1", name: "bias_panjang", value: 60.0, tol: 0.01, label: "`bias_panjang` = 60.00", msg: "720 dari 1.200 pasangan dimenangkan jawaban panjang — 10 poin di atas netral 50 persen." },
          { kind: "uses", task: "t2", token: "exp", label: "Sigmoid DPO dihitung", msg: "Loss DPO memakai sigmoid dari delta — hitung dengan math.exp dan math.log." },
        ],
      },
      reference: "Kesepakatan 85,00 persen; bias panjang 60,00 persen; akurasi RM 85,00 persen; loss 0,6685; gerbang LOLOS.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: model sopan yang menolak menjawab saldo",
      prose: [
        "Kembali ke cerita pembuka. Model DanaKu lolos gerbang preferensi tetapi menolak pertanyaan saldo. Apa yang salah di operasionalnya — bukan di teorinya? Pertama, data preferensi tidak diaudit: anotator memilih jawaban panjang, dan tidak ada pasangan yang mengajarkan bahwa menolak pertanyaan saldo adalah jawaban kalah. Kedua, tidak ada gerbang retensi tugas: MMLU umum diukur, tetapi penyelesaian pertanyaan saldo — tugas produksi yang sebenarnya — tidak pernah diuji setelah alignment.",
        "Perbaikan putaran kedua: tambah 500 pasangan preferensi khusus penolakan — jawaban yang menolak pertanyaan sah harus kalah dari jawaban yang menjawab dengan benar. Tambah gerbang keempat: tingkat penyelesaian tugas saldo harus di atas 95 persen, diukur pada 100 prompt saldo golden set. Dan tambah monitoring: tingkat penolakan harian — bila naik di atas 5 persen, rollback otomatis.",
        "Angka putaran kedua: kesepakatan anotator 88 persen, bias panjang turun ke 52 persen setelah penyeimbangan, win rate 61 persen, retensi MMLU turun 0,9 poin, penyelesaian saldo 97 persen. Lima kunci lolos. Model naik ke 5 persen trafik canary — dan di sanalah ia diuji tiga hari sebelum naik ke 25 persen.",
        "Pelajaran yang dibawa pulang: alignment bukan satu malam training, melainkan satu putaran operasional — audit, latih, gerbang, canary, monitor, ulangi. Teori DPO muat dalam satu rumus; operasionalnya muat dalam satu checklist yang tidak boleh dilewati.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Akar: data preferensi tidak diaudit dan tidak ada gerbang retensi tugas saldo. Perbaikan: 500 pasangan anti-penolakan, gerbang keempat penyelesaian saldo di atas 95 persen, monitoring penolakan harian di atas 5 persen memicu rollback. Putaran kedua: win rate 61 persen, penyelesaian saldo 97 persen — lolos ke canary 5 persen.",
      },
      reference: "Alignment = putaran operasional: audit, latih, gerbang, canary, monitor, ulangi.",
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
        "Audit preferensi: kesepakatan 85,00 persen, bias panjang 60,00 persen — DPO memperkuat apa pun di datanya.",
        "Reward model diukur akurasi berpasangan 85,00 persen; akurasi bukan jaminan terhadap reward hacking.",
        "Loss DPO satu pasangan: delta 0,05, loss 0,6685; beta adalah rem terhadap referensi.",
        "Gerbang rollout: win rate 58,00 persen, retensi MMLU turun 1,1 poin, keamanan nol pelanggaran — LOLOS.",
        "Monitoring: panjang jawaban, tingkat penolakan, win rate berjalan, distribusi prompt.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Data preferensi menunjukkan jawaban panjang menang 60 persen dari pasangan. Apa artinya dan apa perbaikannya?",
          options: [
            { text: "Artinya jawaban panjang memang lebih bagus — tidak perlu diperbaiki", why: "Salah: 60 persen melawan 50 persen netral adalah sinyal bias anotator, bukan kualitas. Model akan belajar bertele-tele." },
            { text: "Bias panjang terdeteksi — seimbangkan pasangan sebelum training", why: "Tepat: 10 poin di atas netral berarti anotator memilih panjang, bukan isi. Seimbangkan atau normalisasi panjang.", correct: true },
            { text: "Artinya kesepakatan anotator terlalu rendah — tambah anotator", why: "Salah: kesepakatan adalah angka lain (85 persen di lab). Bias panjang adalah soal lain: arah pilihan, bukan kesepakatan." },
            { text: "Artinya beta DPO harus diperbesar", why: "Salah: beta mengatur jarak dari referensi, bukan bias data. Bias data diperbaiki di data, bukan di hyperparameter." },
          ],
        },
        {
          q: "Reward model punya akurasi berpasangan 85 persen. Kenapa itu bukan jaminan model hasil RLHF akan bagus?",
          options: [
            { text: "Karena 85 persen masih di bawah 90 persen", why: "Salah: ambang 90 persen bukan aturannya. Masalahnya adalah reward hacking, bukan angka 85 itu sendiri." },
            { text: "Karena policy bisa meretas reward model — skor naik sementara manfaat tugas turun", why: "Tepat: policy mencari celah skor yang tidak ada di validasi. Obatnya evaluasi tugas yang independen dari reward.", correct: true },
            { text: "Karena akurasi berpasangan tidak mengukur apa pun", why: "Salah: akurasi berpasangan mengukur kemampuan reward model membedakan menang dan kalah — berguna, hanya bukan jaminan." },
            { text: "Karena reward model harus diganti DPO", why: "Salah: DPO menghilangkan reward model eksplisit, tetapi reward hacking punya padanannya — DPO juga bisa memperkuat bias data." },
          ],
        },
        {
          q: "Beta DPO diperkecil drastis. Efeknya pada training?",
          options: [
            { text: "Model makin dekat dengan referensi dan makin aman", why: "Salah: itu efek beta BESAR. Beta kecil memberi kebebasan besar untuk menyimpang." },
            { text: "Model bebas menyimpang jauh dari referensi — perubahan cepat, risiko lupa kemampuan SFT naik", why: "Tepat: beta adalah rem. Beta kecil berarti rem longgar.", correct: true },
            { text: "Tidak ada efek — beta hanya dipakai saat evaluasi", why: "Salah: beta ada di dalam loss DPO — ia mengontrol trade-off inti antara mengikuti preferensi dan tetap dekat referensi." },
            { text: "Loss DPO menjadi nol", why: "Salah: loss tidak menjadi nol. Di lab, beta 0,1 memberi loss 0,6685; beta 0,5 memberi 0,5759 — loss berubah, tidak hilang." },
          ],
        },
        {
          q: "Model lolos win rate 58 persen dan retensi MMLU, tetapi tingkat penyelesaian pertanyaan saldo tidak pernah diukur. Apa risikonya?",
          options: [
            { text: "Tidak ada — MMLU sudah mewakili semua kemampuan", why: "Salah: MMLU umum tidak mewakili tugas produksi spesifik. Model cerita pembuka lolos MMLU tetapi menolak pertanyaan saldo." },
            { text: "Alignment bisa merusak tugas produksi tanpa terdeteksi — gerbang harus mengukur tugas yang sebenarnya", why: "Tepat: gerbang keempat — penyelesaian saldo di atas 95 persen — adalah yang hilang di cerita pembuka.", correct: true },
            { text: "Risikonya hanya pada keamanan, bukan pada kegunaan", why: "Salah: yang rusak adalah kegunaan — model menolak menjawab. Keamanan adalah kunci gerbang yang lain." },
            { text: "Risikonya hilang bila rollout dilakukan 100 persen sekaligus", why: "Salah: rollout 100 persen sekaligus justru memperbesar kerusakan. Canary 5 persen ada untuk menangkap yang lolos gerbang offline." },
          ],
        },
        {
          q: "Setelah deploy, panjang jawaban rata-rata naik 30 persen dalam seminggu. Sinyal apa ini dan apa responsnya?",
          options: [
            { text: "Sinyal sukses — pelanggan suka jawaban panjang", why: "Salah: kenaikan panjang tanpa kenaikan win rate adalah tanda bias panjang kembali — dari data, bukan dari training." },
            { text: "Bias panjang kembali — selidiki data preferensi baru dan siapkan putaran alignment berikutnya", why: "Tepat: itulah salah satu dari empat sinyal monitoring pasca-deploy.", correct: true },
            { text: "Sinyal beta terlalu besar — kecilkan beta dan deploy ulang malam ini", why: "Salah: beta adalah hyperparameter training, bukan tuas monitoring. Responsnya adalah investigasi data dan putaran baru, bukan ubah beta tengah malam." },
            { text: "Bukan sinyal apa pun — panjang jawaban tidak dimonitor", why: "Salah: panjang jawaban adalah sinyal monitoring pertama yang diajarkan lesson ini." },
          ],
        },
      ],
    },
  ],
};
