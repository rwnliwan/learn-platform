import type { V2Lesson } from "../lib/types";

export const wqb37: V2Lesson = {
  slug: "wqb37-reinforcement-learning-trading",
  track: "WorldQuant Brain",
  module: "Machine Learning",
  title: "WQB37 — Reinforcement Learning untuk Trading: Agen yang Belajar dari Rugi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Agen yang belajar membeli di harga tertinggi",
      prose: [
        "Seorang peneliti melatih agen reinforcement learning untuk trading: agen itu melihat harga, memilih beli, jual, atau tahan, dan mendapat reward dari profit. Setelah ribuan episode simulasi, agen itu menghasilkan return rata-rata 3,33 persen per episode (4 persen, minus 1 persen, 7 persen). Kedengarannya bagus — sampai peneliti itu memeriksa APA yang dipelajari agen: ia membeli setiap kali harga naik tiga hari berturut-turut, tanpa memeriksa valuasi, volume, atau biaya transaksi. Agen itu tidak belajar trading; ia belajar mengejar momentum di data simulasi yang tidak punya biaya.",
        "Lesson ini mengajarkan reinforcement learning untuk trading dari sudut peneliti kuantitatif: apa itu state, action, dan reward; cara kerja Q-learning dalam satu update; dan tiga jebakan yang membuat agen RL terlihat pintar di simulasi dan bodoh di live — reward yang salah, simulasi yang tidak punya biaya, dan eksplorasi yang tidak pernah berhenti.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Reinforcement learning tidak pernah disebut di track WQB (pencarian menghasilkan nol). WQB18 dan WQB27 membahas ML predictor dan ML alpha dari sudut supervised learning — prediksi return, bukan agen yang mengambil keputusan berurutan. Lesson ini membangun sudut RL-nya: agen, reward, dan kebijakan.",
      },
      reference: "Tiga episode: +4 persen, -1 persen, +7 persen — rata-rata 3,33 persen. Update Q: 0,5 → 0,722.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan, menghitung, dan menilai agen RL untuk trading.",
        "(1) Menjelaskan state, action, reward, dan policy dalam trading;",
        "(2) Menghitung satu update Q-learning dari angka;",
        "(3) Menjelaskan exploration vs exploitation dan epsilon-greedy;",
        "(4) Menyebutkan tiga jebakan RL di trading: reward yang salah, simulasi tanpa biaya, dan non-stationarity;",
        "(5) Membedakan RL dari supervised learning (WQB27) dan kapan tiap pendekatan dipakai.",
      ],
      tasks: [],
    },
    {
      id: "dasar",
      eyebrow: "Langkah 3 · Teori",
      title: "State, action, reward: trading sebagai permainan",
      prose: [
        "Reinforcement learning memandang trading sebagai permainan berurutan. State adalah apa yang dilihat agen: harga terakhir, posisi saat ini, volatilitas, dan sinyal alpha (misalnya skor FASTEXPR). Action adalah apa yang bisa dilakukan: beli, jual, atau tahan — atau, dalam versi yang lebih halus, berapa besar posisi yang diambil. Reward adalah apa yang didapat: perubahan nilai portofolio setelah action — dikurangi biaya transaksi.",
        "Policy adalah strategi agen: aturan yang memetakan state ke action. Tujuan agen bukan memprediksi harga besok — itu tugas supervised learning — melainkan memaksimalkan reward kumulatif yang didiskon: profit hari ini lebih berharga dari profit bulan depan, karena modal yang kembali lebih cepat bisa dipakai lagi. Faktor diskon (gamma) mengukur seberapa jauh agen memandang ke depan: gamma 0,9 berarti reward tahun depan masih bernilai, gamma 0 berarti agen hanya peduli hari ini.",
        "Perbedaan dengan supervised learning (WQB27) adalah umpan baliknya. Supervised belajar dari label yang sudah ada — 'harga naik' atau 'harga turun'. RL belajar dari konsekuensi tindakannya sendiri — agen yang membeli di harga tertinggi mendapat reward negatif dan belajar untuk tidak mengulanginya. Inilah kelebihan RL: ia belajar KEPUTUSAN, bukan prediksi. Dan inilah kelemahannya: ia butuh ribuan percobaan — dan di pasar nyata, tiap percobaan berharga uang.",
      ],
      tasks: [],
      note: {
        title: "Reward adalah segalanya — dan jebakan terbesar",
        body: "Agen memaksimalkan apa pun yang kamu definisikan sebagai reward. Bila reward hanya profit kotor tanpa biaya, agen akan trading ribuan kali sehari. Bila reward hanya return tanpa risiko, agen akan mengambil leverage maksimal. Merancang reward adalah merancang perilaku — dan reward yang salah menghasilkan agen yang 'sukses' dengan cara yang menghancurkanmu.",
      },
      reference: "State: harga, posisi, volatilitas, sinyal. Action: beli, jual, tahan. Reward: perubahan nilai dikurangi biaya.",
    },
    {
      id: "qlearning",
      eyebrow: "Langkah 4 · Teori",
      title: "Q-learning: satu update, satu pelajaran",
      prose: [
        "Q-learning adalah algoritma RL yang paling sederhana: ia menyimpan tabel Q(state, action) — perkiraan nilai tiap action di tiap state — dan memperbaruinya dari pengalaman. Rumus update-nya: Q baru sama dengan Q lama ditambah alpha dikali (reward ditambah gamma dikali max Q state berikut dikurangi Q lama). Alpha adalah learning rate — seberapa cepat agen mengubah pikirannya; gamma adalah faktor diskon.",
        "Hitung satu update dari data cerita pembuka. Q lama 0,5; alpha 0,1; reward 2; gamma 0,9; max Q state berikut 0,8. Target sama dengan 2 ditambah 0,9 dikali 0,8 sama dengan 2,72. Selisih target dengan Q lama sama dengan 2,72 dikurangi 0,5 sama dengan 2,22. Q baru sama dengan 0,5 ditambah 0,1 dikali 2,22 sama dengan 0,5 ditambah 0,222 sama dengan 0,722. Satu pengalaman menggeser keyakinan agen dari 0,5 ke 0,722 — dan ribuan pengalaman seperti ini membentuk policy-nya.",
        "Exploration vs exploitation adalah dilema yang tidak pernah hilang. Exploitation: pakai yang sudah diketahui terbaik — beli saat Q tertinggi. Exploration: coba action yang belum dicoba — mungkin lebih baik. Epsilon-greedy menyelesaikannya dengan sederhana: dengan probabilitas epsilon (misalnya 10 persen), agen mencoba action acak; 90 persen sisanya ia memakai yang terbaik. Epsilon yang terlalu besar berarti agen tidak pernah memanfaatkan yang ia pelajari; epsilon yang terlalu kecil berarti agen terjebak di optimum lokal yang pertama ia temukan.",
      ],
      tasks: [],
      note: {
        title: "Non-stationarity: pasar bukan permainan yang tetap",
        body: "Di catur, aturannya tidak berubah. Di pasar, aturannya berubah: rezim berganti, crowding datang dan pergi, dan strategi yang bekerja tahun lalu mati tahun ini. Agen RL yang dilatih di satu rezim akan gagal di rezim lain — dan tidak ada 'latihan' yang bisa mengantisipasi rezim yang belum pernah ada. Inilah kenapa RL di trading butuh retraining berkala dan batasan risiko yang keras di luar agen.",
      },
      reference: "Q baru 0,722 dari Q lama 0,5 (alpha 0,1; reward 2; gamma 0,9; max Q berikut 0,8). Epsilon-greedy: 10 persen acak.",
    },
    {
      id: "lab-rl",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: update Q-learning dan return rata-rata episode",
      prose: [
        "Lab ini menghitung dua angka: satu update Q-learning dan return rata-rata tiga episode. Hitung dulu di kepala. Q baru: target sama dengan 2 ditambah 0,9 dikali 0,8 sama dengan 2,72; Q baru sama dengan 0,5 ditambah 0,1 dikali (2,72 dikurangi 0,5) sama dengan 0,5 ditambah 0,222 sama dengan 0,722. Return rata-rata: (4 dikurangi 1 ditambah 7) dibagi 3 sama dengan 10 dibagi 3 sama dengan 3,33 persen.",
        "Tugas lab: isi dua variabel — q_baru dan ret_rata — lalu cetak keduanya. Dua angka ini adalah kartu skor agen: seberapa cepat ia belajar dari satu pengalaman, dan seberapa baik ia secara rata-rata.",
        "Setelah lolos, coba eksperimen: naikkan alpha menjadi 0,5 dan lihat Q baru menjadi 1,61 — melompat jauh dari satu pengalaman. Lalu tanyakan: apakah belajar yang lebih cepat selalu lebih baik? Jawabannya: tidak — alpha yang terlalu besar membuat Q berosilasi dan tidak pernah konvergen. Belajar yang stabil mengalahkan belajar yang cepat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung Q baru setelah satu update" },
        { id: "t2", text: "Hitung return rata-rata tiga episode (persen)" },
      ],
      expected: "q_baru=0.722\nret_rata=3.33",
      hints: [
        "Target = reward + gamma x max Q state berikut.",
        "Q baru = Q lama + alpha x (target - Q lama).",
        "Return rata-rata = jumlah return episode dibagi jumlah episode.",
      ],
      code: {
        starter: "# Agen RL trading. JANGAN UBAH.\nq_lama, alpha, reward, gamma, q_berikut = 0.5, 0.1, 2, 0.9, 0.8\nepisode = [4, -1, 7]  # return persen per episode\n\n# TULIS KODEMU: Q baru dan return rata-rata\nq_baru = \nret_rata = \nprint(f\"q_baru={round(q_baru, 3)}\")\nprint(f\"ret_rata={round(ret_rata, 2)}\")",
        lockLines: 4,
        solution: "# Agen RL trading. JANGAN UBAH.\nq_lama, alpha, reward, gamma, q_berikut = 0.5, 0.1, 2, 0.9, 0.8\nepisode = [4, -1, 7]  # return persen per episode\n\n# TULIS KODEMU: Q baru dan return rata-rata\ntarget = reward + gamma * q_berikut\nq_baru = q_lama + alpha * (target - q_lama)\nret_rata = sum(episode) / len(episode)\nprint(f\"q_baru={round(q_baru, 3)}\")\nprint(f\"ret_rata={round(ret_rata, 2)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "q_baru=0.722", label: "Q baru 0,722", msg: "Target 2,72; Q baru = 0,5 + 0,1 x 2,22 = 0,722." },
          { kind: "stdout_matches", task: "t2", pattern: "ret_rata=3.33", label: "Return rata-rata 3,33 persen", msg: "(4 - 1 + 7) / 3 = 3,33. Rata-rata menyembunyikan episode minus 1 persen — baca juga variasinya." },
        ],
      },
      reference: "Q baru 0,722; return rata-rata 3,33 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: agen yang mengejar momentum tanpa biaya",
      prose: [
        "Agen di cerita pembuka menghasilkan return 3,33 persen per episode di simulasi — tetapi saat biaya transaksi dimasukkan (0,1 persen per trade, dan agen itu trading 40 kali per episode), return-nya jatuh menjadi minus 0,67 persen. Empat puluh trade dikali 0,1 persen sama dengan 4,0 persen biaya — lebih besar dari return kotornya. Agen itu tidak belajar trading; ia belajar cara membayar biaya dengan sangat efisien.",
        "Perbaikannya: reward diubah menjadi return bersih setelah biaya, dan action space dibatasi — agen hanya boleh mengubah posisi bila sinyalnya kuat, bukan tiap tick. Setelah retraining, agen itu trading 6 kali per episode dengan return bersih 1,8 persen. Lebih kecil dari 3,33 persen yang palsu — tetapi positif dan nyata.",
        "Pelajaran yang dicatat: simulasi tanpa biaya adalah simulasi yang berbohong, dan reward tanpa biaya adalah undangan untuk overtrading. Setiap paper RL trading yang tidak menyebut biaya transaksi harus dibaca dengan curiga — dan setiap agen yang diuji tanpa biaya harus diuji ulang dengan biaya sebelum satu rupiah pun dipertaruhkan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, biaya dimasukkan ke reward — bukan ke catatan kaki. Kedua, action space dibatasi agar agen tidak bisa overtrade. Ketiga, return yang lebih kecil tetapi bersih dipilih atas return besar yang palsu.",
      },
      reference: "Return 3,33 persen kotor → minus 0,67 persen bersih (40 trade x 0,1 persen). Setelah perbaikan: 1,8 persen bersih.",
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
        "RL: state, action, reward, policy — belajar dari konsekuensi, bukan dari label.",
        "Lab: Q baru 0,722; return rata-rata 3,33 persen.",
        "Q-learning: Q baru = Q lama + alpha x (reward + gamma x max Q berikut - Q lama).",
        "Reward yang salah menghasilkan agen yang 'sukses' dengan cara yang menghancurkanmu.",
        "Simulasi tanpa biaya adalah simulasi yang berbohong.",
      ],
      next: { label: "WQB38 — Deep Learning & Transformer untuk Deret Waktu Finansial", href: "/v2/learn/wqb38-dl-transformer-deret-waktu" },
      quiz: [
        {
          q: "Q lama 0,5; alpha 0,1; reward 2; gamma 0,9; max Q berikut 0,8. Berapa Q baru?",
          options: [
            { text: "0,722", why: "Tepat: target 2,72; Q baru = 0,5 + 0,1 x 2,22 = 0,722.", correct: true },
            { text: "2,72 — itu targetnya, bukan Q barunya", why: "Salah: 2,72 adalah target; Q baru bergerak 10 persen ke arah target dari 0,5." },
            { text: "0,5 — Q tidak berubah", why: "Salah: Q berubah sebesar alpha dikali selisih target dan Q lama." },
            { text: "1,61 — memakai alpha 0,5", why: "Salah: alpha di soal adalah 0,1, bukan 0,5." },
          ],
        },
        {
          q: "Tiga episode: +4 persen, -1 persen, +7 persen. Berapa return rata-ratanya?",
          options: [
            { text: "3,33 persen", why: "Tepat: (4 - 1 + 7)/3 = 3,33.", correct: true },
            { text: "10,0 persen — jumlahnya", why: "Salah: 10,0 adalah jumlah, bukan rata-rata." },
            { text: "5,0 persen — median", why: "Salah: median adalah 4,0 (nilai tengah setelah diurutkan -1, 4, 7). Yang ditanya adalah rata-rata." },
            { text: "2,0 persen — setelah dikurangi biaya", why: "Salah: tidak ada data biaya di soal ini." },
          ],
        },
        {
          q: "Agen RL trading 40 kali per episode dengan biaya 0,1 persen per trade. Return kotor 3,33 persen. Berapa return bersihnya?",
          options: [
            { text: "Minus 0,67 persen", why: "Tepat: 40 x 0,1 persen = 4,0 persen biaya; 3,33 - 4,0 = -0,67.", correct: true },
            { text: "3,23 persen — biaya hanya sekali", why: "Salah: biaya dibayar per trade — 40 kali, bukan sekali." },
            { text: "3,33 persen — biaya tidak memengaruhi RL", why: "Salah: biaya memengaruhi semua strategi, termasuk RL." },
            { text: "7,33 persen — biaya menambah return", why: "Salah: biaya mengurangi return, bukan menambah." },
          ],
        },
        {
          q: "Apa perbedaan utama RL dan supervised learning di trading?",
          options: [
            { text: "Tidak ada — keduanya memprediksi harga", why: "Salah: supervised memprediksi; RL belajar keputusan dari konsekuensi tindakannya." },
            { text: "Supervised belajar dari label; RL belajar dari konsekuensi tindakannya sendiri", why: "Tepat: RL memaksimalkan reward kumulatif, bukan akurasi prediksi.", correct: true },
            { text: "RL tidak butuh data", why: "Salah: RL butuh ribuan episode pengalaman — justru lebih banyak data." },
            { text: "Supervised lebih lambat dari RL", why: "Salah: kecepatan bukan pembedanya — jenis umpan balik adalah pembedanya." },
          ],
        },
        {
          q: "Epsilon-greedy dengan epsilon 10 persen berarti apa?",
          options: [
            { text: "Agen selalu memilih action terbaik", why: "Salah: itu epsilon 0 persen — tanpa eksplorasi." },
            { text: "10 persen action acak (eksplorasi), 90 persen action terbaik (eksploitasi)", why: "Tepat: itulah definisi epsilon-greedy.", correct: true },
            { text: "Agen belajar 10 persen lebih cepat", why: "Salah: epsilon bukan learning rate — alpha yang mengatur kecepatan belajar." },
            { text: "Agen mengabaikan 10 persen state", why: "Salah: epsilon mengatur action, bukan state." },
          ],
        },
      ],
    },
  ],
};
