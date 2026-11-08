import type { V2Lesson } from "../lib/types";

export const aai22: V2Lesson = {
  slug: "aai22-pola-desain-agen",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI22 — Katalog Pola Desain Agen: ReAct, Reflection, Routing & Evaluator-Optimizer",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu agen, satu pola, untuk semua tugas — dan tagihan yang membengkak",
      prose: [
        "Tim agen di startup Notula punya satu arsitektur untuk semua tugas: loop ReAct 40 langkah untuk segalanya. Untuk tugas sederhana — cek tiga invoice — 40 langkah berarti 40 panggilan LLM, padahal tiga panggilan cukup. Untuk laporan direksi — tugas yang butuh kualitas tinggi — 40 langkah tanpa kritik-diri berarti draf pertama langsung dikirim, lengkap dengan angka yang salah di halaman dua. Tagihan membengkak, kualitas jeblok, dan tim menyalahkan modelnya.",
        "Akar masalahnya bukan modelnya, melainkan tidak ada katalog pola: tiap tugas dipaksa masuk ke satu pola yang sama. AAI2 sudah mengajarkan anatomi — loop sense-plan-act-observe, ReAct, plan-and-execute, dan Reflexion dalam satu paragraf keputusan — dan AAI6 mengajarkan evaluator-optimizer sebagai satu langkah orkestrasi multi-agent. Lesson ini adalah katalog lengkapnya: enam pola bernama, masing-masing dengan biaya, latensi, dan syarat kapan ia menang dan kapan ia kalah.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan enam pola desain agen dan membedakannya dari anatomi loop; (2) menghitung biaya dan latensi tiap pola untuk satu tugas yang sama; (3) memilih pola dari ketidakpastian tugas, independensi subtugas, dan kebutuhan kualitas; (4) menggabungkan pola — routing di depan, paralel di tengah, evaluator-optimizer di akhir — tanpa menumpuk biaya yang tidak perlu.",
      ],
      tasks: [],
      note: {
        title: "Hubungan dengan AAI2, AAI6, dan AAI11",
        body: "AAI2 mengajarkan loop ReAct dan membandingkannya dengan plan-and-execute serta Reflexion dalam satu matriks biaya tiga arsitektur. AAI6 mengajarkan evaluator-optimizer sebagai langkah orkestrasi dengan lab-nya sendiri. AAI11 mengajarkan routing model dengan lab biaya 38,15 persen. Lesson ini TIDAK mengulang ketiganya: di sini keenam pola duduk berdampingan sebagai katalog pilihan — dengan tabel biaya dan latensi yang sama untuk satu tugas, dan matriks keputusan yang memilih di antara semuanya.",
      },
      reference: "Satu pola untuk semua tugas = tagihan membengkak dan kualitas jeblok. Katalog = pilih pola dari sifat tugas.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memilih pola desain agen dari sifat tugas dan mempertahankan pilihanmu dengan tabel biaya dan latensi.",
        "(1) Menjelaskan enam pola — ReAct, Reflection, plan-and-execute, routing, parallelization, evaluator-optimizer — dan syarat masing-masing;",
        "(2) Menghitung panggilan LLM, token, biaya rupiah, dan latensi tiap pola untuk satu tugas yang sama;",
        "(3) Membandingkan pola pada tiga sumbu: ketidakpastian, independensi subtugas, dan kebutuhan kualitas;",
        "(4) Merancang agen gabungan — routing di depan, paralel di tengah, evaluator-optimizer di akhir — dengan anggaran yang tetap terkendali.",
      ],
      tasks: [],
    },
    {
      id: "react-reflection",
      eyebrow: "Langkah 3 · Teori",
      title: "ReAct dan Reflection: beradaptasi sambil jalan, lalu mengkritik diri",
      prose: [
        "ReAct adalah loop pikir, aksi, observasi: model menalar satu langkah, memanggil tool, membaca hasilnya, lalu menalar lagi. Kekuatannya adalah adaptasi — hasil langkah 2 menentukan langkah 3, sehingga dunia yang tak pasti bisa dihadapi. Harganya adalah panggilan per langkah: tugas 9 langkah dengan 2.000 token per panggilan pada Rp150 per 1.000 token menghabiskan Rp2.700 — dan 40 langkah menghabiskan Rp12.000, seperti dihitung AAI2. ReAct menang bila diagram alir tugas baru ketahuan sambil jalan; ia kalah bila tugasnya sudah diketahui dari awal — di sana ia membakar panggilan untuk adaptasi yang tidak dibutuhkan.",
        "Reflection, atau Reflexion dalam literatur, menambah satu langkah setelah aksi: agen menilai hasilnya sendiri, menulis kritik, lalu merevisi. Satu putaran kritik-diri mengubah draf yang salah angka menjadi draf yang diperiksa — dengan harga satu panggilan evaluasi tambahan per putaran. Aturannya: Reflection sepadan bila kualitas lebih penting dari kecepatan dan kesalahan bisa dideteksi sendiri — angka yang bisa dicek ulang, logika yang bisa diuji. Ia tidak sepadan bila evaluator-nya buta terhadap kesalahan yang sama — agen yang tidak tahu ia salah tidak akan menemukan kesalahannya dengan berpikir lebih lama.",
        "Jebakan klasik Reflection adalah loop yang memperbaiki tanpa henti: tiap putaran mengubah kalimat, bukan isi, sementara tagihan bertambah. Pasang batas putaran — dua putaran cukup untuk kebanyakan tugas — dan kriteria berhenti yang bisa diukur, misalnya tidak ada temuan baru pada putaran kedua. Tanpa kriteria berhenti, Reflection adalah ReAct dengan tagihan yang lebih sopan.",
      ],
      tasks: [],
      note: {
        title: "ReAct vs Reflection: bukan saingan, melainkan lapisan",
        body: "Reflection duduk DI ATAS ReAct: loop yang sama, ditambah langkah kritik setelah observasi. Kebanyakan agen produksi adalah ReAct dengan satu putaran Reflection pada langkah akhir yang penting — bukan dua arsitektur yang harus dipilih salah satu.",
      },
      reference: "ReAct = adaptif, bayar per langkah. Reflection = kritik-diri, sepadan bila kualitas lebih penting dari kecepatan.",
    },
    {
      id: "rencana-routing",
      eyebrow: "Langkah 4 · Teori",
      title: "Plan-and-execute dan routing: rencanakan dulu, kirim ke yang tepat",
      prose: [
        "Plan-and-execute membalik urutan ReAct: susun seluruh rencana dulu dalam satu panggilan, minta persetujuan bila perlu, lalu eksekusi langkah demi langkah. Tugas yang sama dengan 9 langkah ReAct selesai dalam 5 panggilan — 1 rencana, 3 eksekusi, 1 re-planning cadangan — seharga Rp1.500, hampir setengah dari Rp2.700. Syaratnya: dependensi antar langkah diketahui di muka. Bila dunia berubah di langkah 20, rencana itu gagal total dan butuh re-planning penuh — inilah yang dihitung AAI2 sebagai risiko plan-and-execute.",
        "Routing adalah penjaga gerbang: klasifikasikan tugas, lalu kirim ke jalur yang tepat. Tiga jalur standar: tugas mudah ke model kecil, tugas sedang ke model menengah, tugas sulit ke model besar. Hitungan lab: 100 tugas, masing-masing 2.000 token — semua ke model besar seharga Rp150 per 1.000 token menghabiskan Rp30.000. Dengan routing — 70 tugas mudah ke model kecil Rp50 per 1.000 token, 30 tugas sulit tetap ke besar — biayanya Rp16.000, hemat 46,67 persen. Angka ini berbeda dari lab AAI11 yang hemat 38,15 persen, karena skenarionya berbeda — 70 persen tugas mudah dan selisih harga tiga kali lipat — tetapi pelajarannya sama: routing menghemat hanya bila sebagian besar tugas memang mudah.",
        "Routing punya dua mode kegagalan. Pertama, router yang salah klasifikasi: tugas sulit dikirim ke model kecil, gagal, lalu eskalasi ke besar — biaya ganda plus latensi ganda. Kedua, router yang terlalu mahal: klasifikasi yang memakai model besar untuk menghemat model besar adalah lelucon yang mahal. Aturan praktis: router harus jauh lebih murah dari yang di-routing — klasifikasi aturan atau model kecil — dan eskalasi harus dihitung sebagai biaya, bukan dianggap gratis.",
      ],
      tasks: [],
      note: {
        title: "Kapan plan-and-execute mengalahkan ReAct",
        body: "Bila kamu bisa menulis diagram alirnya sebelum menjalankan — kumpulkan 5 dokumen, ekstrak, ringkas, tulis — pakai plan-and-execute. Bila diagramnya baru ketahuan sambil jalan, pakai ReAct. Kebanyakan agen produksi adalah campuran: rencana kasar di awal, ReAct di dalam tiap fase.",
      },
      reference: "Plan-and-execute = 5 panggilan vs 9 ReAct. Routing = hemat bila sebagian besar tugas memang mudah.",
    },
    {
      id: "paralel-evaluator",
      eyebrow: "Langkah 5 · Teori",
      title: "Parallelization dan evaluator-optimizer: kerja bersama, lalu saling menilai",
      prose: [
        "Parallelization memecah tugas menjadi subtugas independen dan menjalankannya bersamaan. Tiga subtugas berdurasi 8, 5, dan 6 menit selesai dalam 8 menit paralel — bukan 19 menit berurutan — hemat 11 menit. Syarat mutlaknya adalah independensi: subtugas tidak boleh saling menunggu. Bila subtugas kedua butuh output subtugas pertama, paralelisasi adalah ilusi — yang terjadi adalah antrean dengan nama yang lebih modern. Dan ingat AAI6: tambah agen tidak selalu tambah cepat — pajak koordinasi bisa memakan seluruh hemat paralel.",
        "Evaluator-optimizer adalah dua peran dalam satu loop: satu agen menghasilkan, satu agen menilai, lalu generator memperbaiki berdasarkan penilaian. Dua putaran — tiap putaran 2.000 token generasi ditambah 1.000 token evaluasi — menghabiskan 6.000 token alias Rp900 di atas biaya generasi dasar. AAI6 mengajarkan pola ini sebagai orkestrasi multi-agent dengan lab-nya sendiri; di katalog ini ia duduk sebagai satu pilihan di antara enam, dengan harga yang jelas: Rp900 untuk dua putaran perbaikan.",
        "Evaluator-optimizer gagal dalam dua cara. Pertama, evaluator yang terlalu lunak: ia memuji segalanya, generator tidak berubah, Rp900 terbuang. Kedua, evaluator yang terlalu keras tanpa kriteria: ia meminta revisi tanpa akhir. Obat keduanya sama: rubrik tertulis — seperti di AAI6 — sehingga penilaian bisa diaudit, bukan sekadar perasaan model. Evaluator tanpa rubrik adalah kritikus tanpa standar.",
        "Matriks keputusan enam pola: ketidakpastian tinggi memilih ReAct; dependensi diketahui memilih plan-and-execute; kualitas kritis memilih Reflection atau evaluator-optimizer; subtugas independen memilih parallelization; tugas bercampur memilih routing di depan. Dan pola boleh digabung: routing memilah, paralel mengerjakan, evaluator-optimizer memeriksa — selama tiap lapisan membayar dirinya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: makin banyak pola makin bagus",
        body: "Tiap pola menambah panggilan, latensi, atau kompleksitas. Agen dengan routing, paralel, Reflection, DAN evaluator-optimizer untuk tugas cek tiga invoice adalah ReAct 40 langkah dengan baju yang lebih mahal. Mulai dari pola paling sederhana yang memenuhi syarat, tambah satu pola bila ada bukti ia membayar dirinya.",
      },
      reference: "Paralel = latensi max, bukan jumlah. Evaluator-optimizer = Rp900 untuk dua putaran. Rubrik = standar evaluator.",
    },
    {
      id: "lab-pola",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: tabel biaya dan latensi enam pola untuk satu tugas",
      prose: [
        "Sekarang hitung satu tugas yang sama dengan enam kacamata. Tugasnya: jawab pertanyaan analis atas tiga invoice — 9 langkah bila dikerjakan ReAct, 2.000 token per panggilan, Rp150 per 1.000 token. ReAct: 9 panggilan dikali 2.000 token dikali Rp150 per 1.000 token sama dengan Rp2.700. Plan-and-execute: 1 rencana, 3 eksekusi, 1 re-planning cadangan — 5 panggilan — sama dengan Rp1.500. Selisihnya Rp1.200 untuk tugas yang rencananya sudah diketahui dari awal.",
        "Parallelization: tiga subtugas berdurasi 8, 5, dan 6 menit. Berurutan 19 menit; paralel 8 menit — hemat 11 menit, tanpa biaya token tambahan. Evaluator-optimizer: dua putaran, tiap putaran 2.000 token generasi ditambah 1.000 token evaluasi — 6.000 token sama dengan Rp900 di atas biaya generasi dasar.",
        "Routing: 100 tugas campuran, masing-masing 2.000 token. Semua ke model besar Rp150 per 1.000 token sama dengan Rp30.000. Dengan routing — 70 tugas mudah ke model kecil Rp50 per 1.000 token, 30 tugas sulit tetap ke besar — biayanya 70 dikali 100 ditambah 30 dikali 300, sama dengan Rp16.000. Hemat 46,67 persen. Perhatikan: bila hanya 30 persen tugas yang mudah, hematnya tinggal 20,00 persen — routing membayar dirinya hanya bila sebagian besar tugas memang mudah.",
        "Setelah lolos, coba eksperimen: naikkan harga model kecil menjadi Rp100 per 1.000 token (Rp200 per panggilan 2.000 token) dan lihat hemat routing menyusut menjadi 23,33 persen: 70 × Rp200 + 30 × Rp300 = Rp23.000; hemat (30.000 − 23.000) / 30.000 = 23,33 persen. Selisih harga antar tingkat adalah bahan bakar routing — tanpa selisih, tidak ada yang dihemat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung biaya ReAct 9 panggilan dan plan-and-execute 5 panggilan pada 2.000 token per panggilan" },
        { id: "t2", text: "Hitung latensi paralel tiga subtugas 8, 5, 6 menit dan biaya evaluator-optimizer dua putaran" },
        { id: "t3", text: "Hitung biaya routing 100 tugas dan persen hematnya terhadap semua-besar" },
      ],
      expected: "hemat_routing=46.67%",
      hints: [
        "Biaya satu panggilan = 2.000 token x Rp150 / 1.000 = Rp300.",
        "Latensi paralel = max dari durasi subtugas, bukan jumlahnya.",
        "Routing: 70 tugas mudah x Rp100 + 30 tugas sulit x Rp300 = Rp16.000; hemat = (30.000 - 16.000) / 30.000 x 100.",
      ],
      code: {
        starter: `# Tugas: 9 langkah ReAct; 2000 token per panggilan; besar Rp150/1000, kecil Rp50/1000.\n# Paralel: subtugas 8, 5, 6 menit. Evaluator-optimizer: 2 putaran (2000 + 1000 token).\n# Routing: 100 tugas, 70 mudah ke kecil, 30 sulit ke besar.\n\n# TULIS KODEMU: biaya ReAct, biaya plan-and-execute, latensi paralel,\n# biaya evaluator-optimizer, biaya routing, dan persen hemat routing.\n\nbiaya_react = 0\nbiaya_rencana = 0\nparalel_menit = 0\nbiaya_evalopt = 0\nbiaya_routing = 0\nhemat_routing = 0.0\n\nprint(f"react=Rp{biaya_react}")\nprint(f"rencana=Rp{biaya_rencana}")\nprint(f"paralel_menit={paralel_menit}")\nprint(f"eval_opt=Rp{biaya_evalopt}")\nprint(f"routing=Rp{biaya_routing}")\nprint(f"hemat_routing={hemat_routing:.2f}%")`,
        lockLines: 4,
        solution: `# Tugas: 9 langkah ReAct; 2000 token per panggilan; besar Rp150/1000, kecil Rp50/1000.\n# Paralel: subtugas 8, 5, 6 menit. Evaluator-optimizer: 2 putaran (2000 + 1000 token).\n# Routing: 100 tugas, 70 mudah ke kecil, 30 sulit ke besar.\n\nbiaya_panggilan = 2000 * 150 // 1000\nbiaya_react = 9 * biaya_panggilan\nbiaya_rencana = 5 * biaya_panggilan\nparalel_menit = max(8, 5, 6)\nbiaya_evalopt = 2 * (2000 + 1000) * 150 // 1000\nbiaya_besar_semua = 100 * biaya_panggilan\nbiaya_routing = 70 * (2000 * 50 // 1000) + 30 * biaya_panggilan\nhemat_routing = round((biaya_besar_semua - biaya_routing) / biaya_besar_semua * 100, 2)\n\nprint(f"react=Rp{biaya_react}")\nprint(f"rencana=Rp{biaya_rencana}")\nprint(f"paralel_menit={paralel_menit}")\nprint(f"eval_opt=Rp{biaya_evalopt}")\nprint(f"routing=Rp{biaya_routing}")\nprint(f"hemat_routing={hemat_routing:.2f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "react=Rp2700\\nrencana=Rp1500\\nparalel_menit=8\\neval_opt=Rp900\\nrouting=Rp16000\\nhemat_routing=46\\.67%", label: "Tabel biaya dan latensi enam pola sesuai hitungan", msg: "ReAct Rp2.700; rencana Rp1.500; paralel 8 menit; eval-opt Rp900; routing Rp16.000; hemat 46,67 persen." },
          { kind: "equal", task: "t1", name: "biaya_react", value: 2700, tol: 0.01, label: "`biaya_react` = 2700", msg: "9 panggilan x Rp300 = Rp2.700." },
          { kind: "equal", task: "t3", name: "hemat_routing", value: 46.67, tol: 0.01, label: "`hemat_routing` = 46.67", msg: "(30.000 - 16.000) / 30.000 x 100 = 46,67 persen." },
          { kind: "uses", task: "t2", token: "max", label: "Latensi paralel memakai max", msg: "Latensi paralel adalah max durasi subtugas, bukan jumlahnya." },
        ],
      },
      reference: "ReAct Rp2.700; rencana Rp1.500; paralel 8 menit; eval-opt Rp900; routing Rp16.000; hemat 46,67 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: laporan kredit bulanan dengan tiga pola sekaligus",
      prose: [
        "Bank meminta agen laporan kredit bulanan: kumpulkan data 50 debitur, analisis tiap debitur, tulis laporan 20 halaman. Tugas ini punya tiga sifat sekaligus: subtugas analisis per debitur independen, kualitas laporan kritis karena dibaca direksi, dan 80 persen debitur adalah kasus rutin yang mudah.",
        "Rancangan gabungan: routing di depan memilah 40 debitur rutin ke model kecil dan 10 debitur kompleks ke model besar — hemat routing mengikuti cara hitung lab, tetapi dengan porsi 80/20 di sini (bukan 70/30 seperti di lab), jadi hematnya 53,33 persen, bukan 46,67 persen (dihitung di bawah). Parallelization di tengah menjalankan analisis 50 debitur bersamaan — latensi ditentukan debitur tersulit, bukan jumlahnya. Evaluator-optimizer di akhir memeriksa laporan dengan rubrik tertulis — dua putaran, Rp900 — sebelum laporan dikirim.",
        "Yang TIDAK dipakai: ReAct murni untuk seluruh tugas — 50 debitur kali puluhan langkah akan membakar puluhan ribu rupiah untuk adaptasi yang tidak dibutuhkan, karena alur laporan sudah diketahui. Dan Reflection tanpa rubrik tidak dipakai — evaluator tanpa standar hanya memuji atau mengomel tanpa arah.",
        "Biaya total per laporan: routing menghemat 53,33 persen dari biaya model (baseline semua-besar 50 × Rp300 = Rp15.000; routing 40 × Rp100 + 10 × Rp300 = Rp7.000; hemat Rp8.000 / Rp15.000), paralel memangkas latensi dari 19 menit per batch menjadi 8 menit, dan evaluator-optimizer menambah Rp900 untuk kualitas yang bisa diaudit. Tiap lapisan membayar dirinya sendiri — dan itu satu-satunya alasan ketiganya dipakai bersamaan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Routing memilah 40 rutin ke kecil dan 10 kompleks ke besar; paralel menjalankan 50 analisis bersamaan; evaluator-optimizer dua putaran seharga Rp900 memeriksa dengan rubrik. ReAct murni ditolak karena alurnya sudah diketahui; Reflection tanpa rubrik ditolak karena penilaiannya tidak bisa diaudit.",
      },
      reference: "Gabung pola hanya bila tiap lapisan membayar dirinya sendiri.",
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
        "ReAct = adaptif, bayar per langkah: 9 panggilan = Rp2.700. Reflection = kritik-diri, butuh kriteria berhenti.",
        "Plan-and-execute = 5 panggilan = Rp1.500 bila dependensi diketahui di muka.",
        "Routing = hemat 46,67 persen bila 70 persen tugas mudah; eskalasi adalah biaya, bukan gratis.",
        "Parallelization = latensi max 8 menit, bukan jumlah 19 menit; syaratnya independensi.",
        "Evaluator-optimizer = Rp900 untuk dua putaran; evaluator tanpa rubrik tidak bisa diaudit.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Tugas 9 langkah dengan alur yang sudah diketahui dari awal. Mana yang lebih murah dan kenapa?",
          options: [
            { text: "ReAct — karena ia adaptif dan selalu lebih murah", why: "Salah: ReAct memakai 9 panggilan seharga Rp2.700. Adaptasi yang tidak dibutuhkan adalah panggilan yang terbuang." },
            { text: "Plan-and-execute — 5 panggilan seharga Rp1.500, karena rencananya sudah bisa ditulis di muka", why: "Tepat: 1 rencana + 3 eksekusi + 1 re-planning cadangan. Hemat Rp1.200 untuk tugas yang sama.", correct: true },
            { text: "Evaluator-optimizer — karena ia memeriksa hasilnya sendiri", why: "Salah: evaluator-optimizer menambah Rp900 di atas biaya dasar. Ia membeli kualitas, bukan menghemat biaya." },
            { text: "Keduanya sama — jumlah panggilan tidak memengaruhi biaya", why: "Salah: tiap panggilan adalah 2.000 token seharga Rp300. Sembilan panggilan jelas lebih mahal dari lima." },
          ],
        },
        {
          q: "Routing menghemat 46,67 persen bila 70 persen tugas mudah. Bila hanya 30 persen tugas yang mudah, apa yang terjadi?",
          options: [
            { text: "Hemat tetap 46,67 persen — persen hemat tidak tergantung komposisi tugas", why: "Salah: hemat dihitung dari komposisi. 30 persen mudah berarti 70 persen tetap ke besar — hematnya tinggal 20,00 persen." },
            { text: "Hemat menyusut menjadi 20,00 persen — routing membayar dirinya hanya bila sebagian besar tugas memang mudah", why: "Tepat: 30 x Rp100 + 70 x Rp300 = Rp24.000; hemat (30.000 - 24.000) / 30.000 = 20,00 persen.", correct: true },
            { text: "Routing menjadi lebih mahal dari semua-besar", why: "Salah: routing tidak pernah lebih mahal dari semua-besar bila routernya murah — yang menyusut hanya hematnya, bukan menjadi negatif." },
            { text: "Tidak ada yang berubah — router mengklasifikasi ulang sampai 70 persen mudah", why: "Salah: router mengklasifikasi, bukan mengubah sifat tugas. Tugas sulit tetap sulit." },
          ],
        },
        {
          q: "Tiga subtugas berdurasi 8, 5, dan 6 menit dijalankan paralel. Latensinya 8 menit. Kenapa bukan 19 menit?",
          options: [
            { text: "Karena subtugas yang pendek dihapus dari antrean", why: "Salah: tidak ada yang dihapus. Ketiganya berjalan, hanya bersamaan." },
            { text: "Karena latensi paralel adalah max durasi subtugas — ketiganya berjalan bersamaan", why: "Tepat: 8 menit adalah subtugas terpanjang; dua lainnya selesai lebih dulu di dalam jendela yang sama.", correct: true },
            { text: "Karena 5 dan 6 menit dibulatkan ke bawah menjadi nol", why: "Salah: tidak ada pembulatan. Keduanya berjalan penuh, hanya tumpang tindih dengan yang 8 menit." },
            { text: "Karena paralel selalu memangkas latensi menjadi sepertiga", why: "Salah: tidak ada hukum sepertiga. Latensi paralel adalah max — bila subtugasnya 8, 8, dan 8 menit, latensinya tetap 8 menit, bukan 19 dibagi 3." },
          ],
        },
        {
          q: "Evaluator-optimizer dengan evaluator tanpa rubrik tertulis. Apa masalahnya?",
          options: [
            { text: "Tidak ada — model penilai selalu tahu standar yang benar", why: "Salah: tanpa rubrik, penilaian tidak bisa diaudit — memuji segalanya atau meminta revisi tanpa akhir, keduanya mungkin." },
            { text: "Penilaian tidak bisa diaudit dan revisi tidak punya arah — Rp900 per dua putaran terbuang", why: "Tepat: rubrik adalah standar evaluator. Tanpa itu, loop hanya mengulang opini.", correct: true },
            { text: "Evaluator tanpa rubrik selalu lebih murah", why: "Salah: biayanya sama — 6.000 token untuk dua putaran. Yang hilang adalah nilai, bukan biaya." },
            { text: "Generator tidak bisa memperbaiki tanpa rubrik", why: "Salah: generator bisa memperbaiki dari kritik apa pun. Masalahnya adalah kritiknya tidak terukur dan tidak konsisten." },
          ],
        },
        {
          q: "Reflection tanpa kriteria berhenti dan tanpa batas putaran. Apa risikonya?",
          options: [
            { text: "Tidak ada — makin banyak putaran makin bagus hasilnya", why: "Salah: putaran tambahan mengubah kalimat, bukan isi, sementara tagihan bertambah. Perbaikan tanpa ukuran adalah pengeluaran tanpa ujung." },
            { text: "Loop memperbaiki tanpa henti — tiap putaran mengubah kalimat, bukan isi, sementara tagihan bertambah", why: "Tepat: pasang batas dua putaran dan kriteria berhenti yang terukur — tidak ada temuan baru pada putaran kedua.", correct: true },
            { text: "Model akan lupa tugas awalnya", why: "Salah: itu risiko konteks yang terlalu panjang, bukan Reflection. Risiko Reflection adalah biaya tanpa perbaikan." },
            { text: "Reflection akan berubah menjadi plan-and-execute", why: "Salah: keduanya pola yang berbeda. Reflection adalah kritik-diri di atas loop; plan-and-execute adalah rencana di muka." },
          ],
        },
      ],
    },
  ],
};
