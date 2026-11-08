import type { V2Lesson } from "../lib/types";

export const mle30: V2Lesson = {
  slug: "mle30-deep-rl-terapan",
  track: "Machine Learning Engineer",
  module: "ML Lanjutan",
  title: "MLE30 — Deep RL Terapan: DQN & PPO dari Simulasi ke Produksi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Robot gudang yang belajar menabrak 40.000 kali sebelum boleh jalan",
      prose: [
        "Gudang KirimCepat ingin robot mengambil barang tanpa menabrak rak. Tim pertama melatih robot langsung di gudang nyata: dalam seminggu robot menabrak 312 kali, merusak 47 kardus, dan gudang berhenti dua kali. Tim kedua membangun simulasi gudang, membiarkan agen belajar 40.000 episode di sana, baru memindahkan otaknya ke robot nyata — dengan satu aturan: di dunia nyata, robot tidak boleh mengambil aksi yang belum pernah dicoba di simulasi.",
        "Itulah deep reinforcement learning (RL) terapan: agen belajar dari hadiah (reward) dan hukuman, bukan dari label. Bedanya dengan supervised learning: tidak ada jawaban benar yang diberikan — agen menemukan sendiri kebijakan (policy) yang memaksimalkan hadiah kumulatif. Dan bedanya dengan RL mainan: di produksi, eksplorasi yang salah berbiaya nyata, simulasi tidak pernah sama persis dengan dunia nyata, dan kebijakan harus bisa dijelaskan saat insiden.",
        "Lesson ini mengajarkan deep RL sebagai disiplin produksi: DQN untuk aksi diskret, PPO untuk kebijakan yang stabil, reward shaping yang jujur, dan jembatan sim-to-real. Setelah lesson ini kamu bisa: (1) menghitung target Bellman dan update Q; (2) menjelaskan mengapa PPO memakai klip; (3) merancang reward yang tidak bisa dicurangi agen; (4) menghitung jadwal eksplorasi epsilon; (5) memutuskan kapan deep RL layak dipakai — dan kapan tidak.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DLE21 mengajarkan fondasi RL (MDP, Q-learning tabular, bandit) dari sudut deep learning. MLE26 menyinggung PPO hanya sebagai tahap RLHF untuk LLM. Lesson ini TIDAK mengulang keduanya: ia membangun deep RL terapan untuk sistem fisik dan operasional — DQN dengan target network, PPO dengan clipped objective, reward shaping, dan sim-to-real — dengan lab yang menghitung target Bellman dan objective PPO dari angka mentah.",
      },
      reference: "Target Bellman 17,65 dan 2,6; epsilon episode ke-100 = 0,63; PPO objective 2,4 dan -1,2.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membawa deep RL dari notebook ke sistem yang berbiaya nyata.",
        "(1) Menghitung target Bellman Q(s,a) = r + gamma x maks Q(s',a');",
        "(2) Menjelaskan target network dan replay buffer pada DQN;",
        "(3) Menghitung clipped objective PPO dan menjelaskan fungsi klip 0,2;",
        "(4) Merancang reward shaping tanpa menciptakan celah curang;",
        "(5) Menghitung jadwal epsilon-greedy dan menilai kesiapan sim-to-real.",
      ],
      tasks: [],
    },
    {
      id: "dqn",
      eyebrow: "Langkah 3 · Teori",
      title: "DQN: belajar nilai tiap aksi, lalu pilih yang terbaik",
      prose: [
        "Q-learning menjawab satu pertanyaan: seberapa bagus aksi a di keadaan s? Nilainya Q(s,a) — total hadiah masa depan yang diharapkan bila mengambil a lalu mengikuti kebijakan terbaik setelahnya. Persamaan Bellman mendefinisikannya secara rekursif: Q(s,a) = r + gamma x maks Q(s',a'), dengan gamma faktor diskon (0,9 berarti hadiah besok bernilai 90 persen dari hadiah hari ini). Contoh hitungan: hadiah r = 10, nilai terbaik keadaan berikut maks Q(s') = 8,5, gamma = 0,9 — targetnya 10 + 0,9 x 8,5 = 17,65. Bila r = -1 dan maks Q(s') = 4,0, targetnya -1 + 0,9 x 4,0 = 2,6. Bila keadaan berikut terminal (episode selesai), tidak ada masa depan: targetnya sama dengan r, yaitu 5,0.",
        "DQN (Deep Q-Network) mengganti tabel Q dengan neural network: input keadaan, output nilai Q untuk tiap aksi. Dua trik yang membuatnya stabil. Pertama, replay buffer: pengalaman (s, a, r, s') disimpan dan diambil acak saat training — tanpa ini, network belajar dari pengalaman berurutan yang saling berkorelasi dan lupa. Kedua, target network: salinan network yang diperbarui lambat (misalnya tiap 1.000 langkah) dipakai menghitung target — tanpa ini, target bergerak mengikuti network yang sedang dilatih, seperti anjing mengejar ekornya sendiri.",
        "Eksplorasi diatur epsilon-greedy: dengan peluang epsilon ambil aksi acak, selebihnya aksi terbaik. Epsilon meluruh dari 1,0 ke minimum 0,05 dengan faktor 0,995 per episode: epsilon episode ke-100 = 0,05 + 0,95 x 0,995^100 = 0,05 + 0,95 x 0,6058 = 0,6255, dibulatkan 0,63. Artinya setelah 100 episode agen masih menjelajah 63 persen waktu — wajar di awal, tetapi jadwal ini harus mencapai 0,05 sebelum deploy, karena di produksi eksplorasi acak berarti robot menabrak rak.",
      ],
      tasks: [],
      formula: "Q(s,a) = r + \\gamma \\max_{a'} Q(s', a')",
      formulaNote: "r = hadiah langsung; gamma = faktor diskon (0,9); maks Q(s',a') = nilai terbaik keadaan berikut; bila s' terminal, target = r.",
      note: {
        title: "DQN untuk aksi diskret saja",
        body: "DQN memilih dari daftar aksi yang berhingga (belok kiri, belok kanan, maju, diam). Bila aksimu kontinu — misalnya sudut kemudi 0 sampai 360 derajat atau gaya dorong 0 sampai 10 newton — DQN tidak bisa dipakai langsung; itulah wilayah PPO dan aktor-kritik di langkah berikut.",
      },
      reference: "Target 17,65; 2,6; 5,0 (terminal). Epsilon ke-100 = 0,63.",
    },
    {
      id: "ppo",
      eyebrow: "Langkah 4 · Teori",
      title: "PPO: perbarui kebijakan sedikit-sedikit, jangan melompat",
      prose: [
        "PPO (Proximal Policy Optimization) adalah standar industri untuk kebijakan — termasuk RLHF di MLE26. Masalah yang dipecahkannya: update kebijakan yang terlalu besar bisa menghancurkan kebijakan yang sudah bagus dalam satu langkah. PPO mencegahnya dengan klip: rasio kebijakan baru terhadap lama, r = pi_baru / pi_lama, dibatasi ke [0,8; 1,2]. Objective-nya = min(r x A, clip(r, 0,8, 1,2) x A), dengan A = advantage (seberapa lebih baik aksi ini dari rata-rata).",
        "Hitung dua kasus dengan klip 0,2. Kasus 1: r = 1,3 (kebijakan baru 30 persen lebih suka aksi ini), A = 2,0 (aksi ini bagus). r x A = 2,6; clip membatasi r ke 1,2 sehingga 1,2 x 2,0 = 2,4; objective = min(2,6; 2,4) = 2,4. Klip menahan dorongan naik. Kasus 2: r = 0,7, A = -1,5 (aksi ini buruk). r x A = -1,05; clip membatasi r ke 0,8 sehingga 0,8 x -1,5 = -1,2; objective = min(-1,05; -1,2) = -1,2. Di sini klip justru MEMPERBESAR penalti — karena bila aksi buruk dan kebijakan sudah menjauhinya, PPO tidak menghalangi menjauh lebih jauh. Asimetri ini disengaja: klip menahan perubahan yang menguntungkan secara berlebihan, tetapi membiarkan perbaikan menjauhi aksi buruk.",
        "Reward shaping adalah tempat proyek deep RL paling sering gagal diam-diam. Agen tidak peduli niatmu — ia memaksimalkan angka yang kamu tulis. Robot gudang yang diberi +1 tiap langkah mendekati target belajar berputar-putar mendekati target tanpa pernah sampai (reward hacking). Aturan: reward harus nol bila tugas belum selesai, positif hanya saat tujuan tercapai, dan negatif sebanding dengan biaya nyata (tabrakan, energi, waktu). Uji shaping dengan pertanyaan: bila agen memaksimalkan reward ini selamanya tanpa pernah menyelesaikan tugas, apakah itu mungkin? Bila ya, reward-mu bocor.",
      ],
      tasks: [],
      note: {
        title: "Kapan JANGAN pakai deep RL",
        body: "Bila kamu punya data berlabel (klasifikasi, regresi) — pakai supervised. Bila kebijakan optimal bisa dihitung (aturan bisnis jelas) — pakai aturan. Bila satu kesalahan berbiaya fatal dan tidak ada simulasi yang setia — jangan pakai RL sama sekali. Deep RL layak bila: umpan balik tertunda (hadiah datang jauh setelah aksi), lingkungan bisa disimulasikan, dan kesalahan saat belajar murah. Tiga syarat itu jarang terpenuhi bersamaan — itulah mengapa deep RL hebat di gim dan gudang, tetapi langka di kredit dan kesehatan.",
      },
      reference: "PPO: min(r x A, clip x A). Kasus 1 = 2,4; kasus 2 = -1,2.",
    },
    {
      id: "lab-rl",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: target Bellman, epsilon, dan objective PPO",
      prose: [
        "Lab ini menghitung tiga mesin deep RL dari angka mentah: target Bellman DQN, jadwal epsilon, dan clipped objective PPO.",
        "Hitung dulu di kepala. Target 1: r = 10, gamma = 0,9, maks Q(s') = 8,5 — 10 + 0,9 x 8,5 = 17,65. Target 2: r = -1, maks Q(s') = 4,0 — -1 + 3,6 = 2,6. Epsilon episode ke-100: 0,05 + 0,95 x 0,995^100 = 0,05 + 0,5755 = 0,6255, dibulatkan 0,63. PPO kasus 1: min(1,3 x 2,0; 1,2 x 2,0) = min(2,6; 2,4) = 2,4. PPO kasus 2: min(0,7 x -1,5; 0,8 x -1,5) = min(-1,05; -1,2) = -1,2.",
        "Tugas lab: hitung lima angka dari data di atas dan cetak masing-masing di baris sendiri: target1, target2, epsilon100, ppo1, ppo2. Lima angka ini adalah pemeriksaan kewarasan sebelum satu baris training dijalankan — bila target Bellman-mu salah, tidak ada arsitektur yang menyelamatkanmu.",
        "Setelah lolos, coba eksperimen: ubah gamma menjadi 0,99 dan lihat target 1 naik menjadi 18,42 — agen yang lebih sabar menghargai masa depan lebih tinggi. Lalu tanyakan: gamma berapa yang tepat untuk gudang yang hadiahnya datang 50 langkah kemudian? Jawabannya menentukan apakah agenmu belajar atau hanya bereaksi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `target1` dan `target2` dari persamaan Bellman" },
        { id: "t2", text: "Hitung `epsilon100` dari jadwal peluruhan epsilon" },
        { id: "t3", text: "Hitung `ppo1` dan `ppo2` dari clipped objective PPO" },
      ],
      expected: "target1=17.65\ntarget2=2.6\nepsilon100=0.63\nppo1=2.4\nppo2=-1.2",
      hints: [
        "Target = r + gamma x maks Q keadaan berikut.",
        "Epsilon = 0,05 + 0,95 x 0,995^100; bulatkan 2 desimal.",
        "PPO = min(r x A, clip(r, 0,8, 1,2) x A).",
      ],
      code: {
        starter: `# Mesin deep RL: target Bellman, epsilon, PPO.\ngamma = 0.9\nr1, maxq1 = 10, 8.5\nr2, maxq2 = -1, 4.0\neps0, eps_min, decay, t = 1.0, 0.05, 0.995, 100\nratio1, adv1 = 1.3, 2.0\nratio2, adv2 = 0.7, -1.5\nclip = 0.2\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ntarget1 = \ntarget2 = \nepsilon100 = \nppo1 = \nppo2 = \n\nprint(f"target1={target1}")\nprint(f"target2={target2}")\nprint(f"epsilon100={round(epsilon100, 2)}")\nprint(f"ppo1={ppo1}")\nprint(f"ppo2={ppo2}")`,
        lockLines: 9,
        solution: `# Mesin deep RL: target Bellman, epsilon, PPO.\ngamma = 0.9\nr1, maxq1 = 10, 8.5\nr2, maxq2 = -1, 4.0\neps0, eps_min, decay, t = 1.0, 0.05, 0.995, 100\nratio1, adv1 = 1.3, 2.0\nratio2, adv2 = 0.7, -1.5\nclip = 0.2\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ntarget1 = r1 + gamma * maxq1\ntarget2 = r2 + gamma * maxq2\nepsilon100 = eps_min + (eps0 - eps_min) * decay ** t\nppo1 = min(ratio1 * adv1, min(max(ratio1, 1 - clip), 1 + clip) * adv1)\nppo2 = min(ratio2 * adv2, min(max(ratio2, 1 - clip), 1 + clip) * adv2)\n\nprint(f"target1={target1}")\nprint(f"target2={target2}")\nprint(f"epsilon100={round(epsilon100, 2)}")\nprint(f"ppo1={ppo1}")\nprint(f"ppo2={ppo2}")`,
        checks: [
          { kind: "equal", task: "t1", name: "target1", value: 17.65, tol: 1e-9, label: "`target1` seharusnya 17.65", msg: "10 + 0,9 x 8,5 = 17,65." },
          { kind: "equal", task: "t1", name: "target2", value: 2.6, tol: 1e-9, label: "`target2` seharusnya 2.6", msg: "-1 + 0,9 x 4,0 = 2,6." },
          { kind: "equal", task: "t2", name: "epsilon100", value: 0.63, tol: 0.01, label: "`epsilon100` seharusnya 0.63", msg: "0,05 + 0,95 x 0,995^100 = 0,6255, dibulatkan 0,63." },
          { kind: "equal", task: "t3", name: "ppo1", value: 2.4, tol: 1e-9, label: "`ppo1` seharusnya 2.4", msg: "min(2,6; 2,4) = 2,4 — klip menahan dorongan naik." },
          { kind: "equal", task: "t3", name: "ppo2", value: -1.2, tol: 1e-9, label: "`ppo2` seharusnya -1.2", msg: "min(-1,05; -1,2) = -1,2 — klip membiarkan menjauhi aksi buruk." },
        ],
      },
      reference: "Target 17,65 dan 2,6; epsilon 0,63; PPO 2,4 dan -1,2.",
    },
    {
      id: "sim-to-real",
      eyebrow: "Langkah 6 · Teori",
      title: "Sim-to-real: jembatan yang menentukan hidup-mati proyek",
      prose: [
        "Agen yang sempurna di simulasi bisa gagal total di dunia nyata — kesenjangan sim-to-real. Penyebabnya tiga: fisika simulasi yang disederhanakan (gesekan, delay sensor), distribusi keadaan yang tidak pernah muncul di simulasi (rak yang dipindah), dan sensor nyata yang berisik. Tiga penawarnya: domain randomization (acak parameter simulasi — gesekan, pencahayaan, massa — supaya agen kuat terhadap variasi), validasi di simulasi yang TIDAK dipakai training (simulasi kedua sebagai wasit), dan peluncuran bertahap (shadow mode: agen menyarankan, manusia mengeksekusi; lalu otonomi terbatas; baru penuh).",
        "Aturan angka peluncuran: agen boleh otonom bila di simulasi kedua ia menyelesaikan 98 persen episode tanpa pelanggaran keamanan, dan di shadow mode 2 minggu sarannya disetujui manusia 95 persen. Bila salah satu gagal, kembali ke simulasi — bukan ke gudang. Robot yang menabrak di minggu pertama peluncuran adalah kegagalan proses, bukan kegagalan agen.",
        "Peta keputusan: aksi diskret + keadaan berdimensi sedang + simulasi tersedia = DQN. Aksi kontinu atau kebijakan stokastik = PPO. Hadiah jarang (sparse) = tambah reward shaping hati-hati + curriculum learning (mulai dari tugas mudah). Tidak ada simulasi = jangan deep RL; kumpulkan data, pakai supervised atau imitation learning dari demonstrasi manusia.",
      ],
      tasks: [],
      note: {
        title: "Curriculum learning",
        body: "Jangan latih agen langsung di gudang penuh. Mulai dari gudang kosong (satu rak), lalu tambah rak, lalu tambah robot lain, lalu tambah manusia yang berjalan. Tiap tahap hanya naik bila agen lolos 95 persen episode. Agen yang belajar bertahap mencapai target 3x lebih cepat daripada agen yang langsung dilempar ke tugas penuh — dan jauh lebih jarang menemukan jalan pintas curang.",
      },
      reference: "Syarat otonom: 98 persen episode aman di simulasi kedua + 95 persen saran disetujui di shadow mode.",
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
        "Target Bellman: r + gamma x maks Q(s'); terminal = r.",
        "DQN: replay buffer + target network; aksi diskret.",
        "PPO: objective = min(r x A, clip(r) x A); klip 0,2.",
        "Epsilon ke-100 = 0,63 (meluruh dari 1,0 ke 0,05).",
        "Sim-to-real: domain randomization + simulasi kedua + shadow mode.",
      ],
      next: { label: "MLE31 — AutoML: Biarkan Mesin Mencari Model Terbaik", href: "/v2/learn/mle31-automl" },
      quiz: [
        {
          q: "r = 10, gamma = 0,9, maks Q(s') = 8,5. Berapa target Bellman?",
          options: [
            { text: "17,65", why: "Tepat: 10 + 0,9 x 8,5 = 17,65.", correct: true },
            { text: "18,5 — gamma tidak dipakai", why: "Salah: tanpa gamma, hadiah masa depan dihargai penuh — agen jadi tidak sabar terhadap waktu." },
            { text: "10 — hanya hadiah langsung yang dihitung", why: "Salah: itu bukan Bellman; Q mengukur hadiah masa depan juga." },
            { text: "8,5 — hadiah langsung diabaikan", why: "Salah: r adalah bagian dari target; mengabaikannya berarti agen buta terhadap hadiah saat ini." },
          ],
        },
        {
          q: "Mengapa DQN memakai target network yang diperbarui lambat?",
          options: [
            { text: "Agar training lebih lambat dan hemat GPU", why: "Salah: tujuannya stabilitas, bukan kecepatan." },
            { text: "Agar target tidak bergerak mengikuti network yang sedang dilatih", why: "Tepat: target yang bergerak = anjing mengejar ekornya sendiri; target network membekukan sasaran sementara.", correct: true },
            { text: "Agar replay buffer tidak penuh", why: "Salah: replay buffer dan target network menyelesaikan masalah yang berbeda." },
            { text: "Agar epsilon meluruh lebih cepat", why: "Salah: epsilon diatur jadwal terpisah; tidak ada hubungannya dengan target network." },
          ],
        },
        {
          q: "PPO: r = 1,3, A = 2,0, klip 0,2. Berapa objective-nya?",
          options: [
            { text: "2,6 — klip tidak berpengaruh untuk aksi bagus", why: "Salah: klip justru menahan dorongan naik: min(2,6; 2,4) = 2,4." },
            { text: "2,4", why: "Tepat: clip membatasi r ke 1,2; 1,2 x 2,0 = 2,4; min(2,6; 2,4) = 2,4.", correct: true },
            { text: "1,2 — hanya rasio klip yang dipakai", why: "Salah: objective memakai min dari dua suku, bukan hanya suku klip." },
            { text: "0 — aksi bagus tidak dihitung", why: "Salah: aksi bagus justru didorong naik, hanya dibatasi lajunya." },
          ],
        },
        {
          q: "Robot diberi +1 tiap langkah mendekati target. Apa yang paling mungkin terjadi?",
          options: [
            { text: "Robot langsung menuju target secepat mungkin", why: "Salah: hadiah diberikan per langkah mendekati — robot bisa berputar-putar mendekati tanpa pernah sampai dan tetap dibayar." },
            { text: "Reward hacking: robot berputar mendekati target tanpa menyelesaikan tugas", why: "Tepat: agen memaksimalkan angka, bukan niatmu. Hadiah hanya saat tugas selesai.", correct: true },
            { text: "Robot berhenti bergerak karena takut hukuman", why: "Salah: tidak ada hukuman di sini; yang ada insentif yang bisa dieksploitasi." },
            { text: "Tidak ada efek — reward shaping tidak memengaruhi agen", why: "Salah: reward adalah SATU-SATUNYA sinyal belajar agen; shaping yang salah = perilaku yang salah." },
          ],
        },
        {
          q: "Agen sempurna di simulasi tetapi menabrak di gudang nyata. Langkah pertama yang benar?",
          options: [
            { text: "Latih lebih lama di simulasi yang sama", why: "Salah: simulasi yang sama tidak mengandung keadaan yang gagal di dunia nyata." },
            { text: "Domain randomization + validasi di simulasi kedua + shadow mode", why: "Tepat: tiga lapis pertahanan sim-to-real sebelum otonomi penuh.", correct: true },
            { text: "Naikkan epsilon agar agen lebih berani", why: "Salah: di produksi, eksplorasi acak = tabrakan. Epsilon harus sudah rendah sebelum deploy." },
            { text: "Ganti DQN ke PPO — algoritma yang salah", why: "Salah: ini bukan masalah algoritma; ini kesenjangan simulasi vs realita." },
          ],
        },
      ],
    },
  ],
};
