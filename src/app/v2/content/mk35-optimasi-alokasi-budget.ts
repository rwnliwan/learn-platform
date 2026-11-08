import type { V2Lesson } from "../lib/types";

export const mk35: V2Lesson = {
  slug: "mk35-optimasi-alokasi-budget",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK35 — Optimasi Alokasi Budget: Rupiah Terakhir ke Channel Terbaik",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Budget Rp500 juta yang dibagi rata — dan dibakar separuhnya",
      prose: [
        "KirimCepat membagi budget Rp500 juta rata ke lima channel — Rp100 juta tiap channel. Hasilnya: Google menghasilkan revenue Rp140 juta dari Rp100 juta, Meta hanya Rp80 juta dari Rp100 juta yang sama. Rp20 juta di Meta adalah uang yang dibakar — sementara Google masih lapar: tiap Rp50 juta tambahan di Google menghasilkan Rp56 juta revenue.",
        "Kesalahan itu bukan kurangnya data, melainkan memakai ROAS rata-rata untuk keputusan alokasi. ROAS rata-rata menjawab 'seberapa bagus channel ini selama ini'; alokasi butuh ROAS marginal — 'berapa revenue dari Rp50 juta BERIKUTNYA'. Channel dengan ROAS rata-rata tertinggi belum tentu punya ROAS marginal tertinggi.",
        "Lesson ini mengajarkan optimasi alokasi budget: diminishing returns, ROAS marginal, dan greedy allocation. Setelah lesson ini kamu bisa: (1) menghitung ROAS marginal; (2) menjelaskan diminishing returns; (3) mengalokasikan budget secara greedy; (4) membedakan alokasi rata-rata, proporsional, dan marginal; (5) menulis rencana alokasi dengan eksperimen validasi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MK13 mengajarkan alokasi memakai ROI marginal sebagai satu skenario, MK19 memakai alokasi budget di capstone, dan MK23 menghitung alokasi dari SQL — tetapi tidak ada lesson optimasi alokasi sebagai topik: kurva diminishing returns, ROAS marginal yang dihitung, dan algoritma greedy. Lesson ini membangun topik itu.",
      },
      reference: "Google: tambah 50 juta, revenue tambah 56 juta — marginal 1,12. Meta: tambah 50 juta, revenue tambah 15 juta — marginal 0,30.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjawab pertanyaan alokasi yang sebenarnya: ke mana rupiah berikutnya pergi — bukan ke mana rupiah kemarin pergi.",
        "(1) Menghitung ROAS marginal dari dua titik spend;",
        "(2) Menjelaskan diminishing returns: kenapa marginal turun saat spend naik;",
        "(3) Menjalankan alokasi greedy: rupiah berikutnya ke marginal tertinggi;",
        "(4) Membedakan alokasi bagi-rata, proporsional ROAS, dan marginal;",
        "(5) Merancang validasi bertahap: naikkan, pantau marginal, hentikan bila turun.",
      ],
      tasks: [],
    },
    {
      id: "marginal-diminishing",
      eyebrow: "Langkah 3 · Teori",
      title: "ROAS marginal dan diminishing returns",
      prose: [
        "ROAS marginal sama dengan tambahan revenue dibagi tambahan spend. Google: spend 100 ke 150 (tambah 50), revenue 140 ke 196 (tambah 56) — marginal 56 dibagi 50 sama dengan 1,12. Meta: spend 100 ke 150 (tambah 50), revenue 80 ke 95 (tambah 15) — marginal 15 dibagi 50 sama dengan 0,30. Rupiah berikutnya di Google menghasilkan Rp1,12; di Meta hanya Rp0,30. Alokasi yang benar memindahkan rupiah dari Meta ke Google sampai marginal keduanya setara.",
        "Diminishing returns menjelaskan kenapa marginal turun: audiens terbaik sudah dijangkau, lelang makin mahal, frekuensi naik dan kejenuhan datang. Channel yang marginalnya 1,12 di spend 150 juta belum tentu 1,12 di spend 500 juta — itulah kenapa alokasi tidak boleh 'semua ke Google' sekaligus. Naikkan bertahap, ukur marginal tiap langkah, hentikan saat marginal mendekati 1,0 (atau di bawah hurdle yang disepakati).",
        "Tiga cara alokasi yang salah: bagi rata (mengabaikan efisiensi — Meta yang ROAS 0,8 tetap dapat jatah), proporsional ROAS rata-rata (mengabaikan diminishing returns — channel yang sudah jenuh tetap dipompa), dan semua ke satu channel (mengabaikan kejenuhan dan risiko). Cara yang benar: greedy marginal bertahap dengan validasi.",
      ],
      tasks: [],
      note: {
        title: "Marginal 1,0 adalah titik berhenti, bukan target",
        body: "Bila marginal di bawah 1,0, rupiah tambahan menghasilkan revenue lebih kecil dari biayanya — bakar uang. Tetapi berhenti tepat di 1,0 juga belum tentu optimal: bila ada channel lain dengan marginal 1,5, rupiah itu lebih baik pindah. Aturan berhenti: marginal setara antar channel, dan semuanya di atas hurdle yang disepakati.",
      },
      reference: "Marginal Google 1,12; Meta 0,30. Pindahkan rupiah sampai marginal setara. Hentikan bila marginal di bawah hurdle.",
    },
    {
      id: "greedy-validasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Alokasi greedy dan validasi bertahap",
      prose: [
        "Algoritma greedy: bagi budget menjadi potongan (misalnya Rp50 juta), tiap potongan diberikan ke channel dengan ROAS marginal tertinggi saat itu, hitung ulang marginal setelah tiap potongan, ulangi sampai budget habis. Greedy bekerja karena marginal turun perlahan — potongan kecil membuat kesalahan kecil. Bila marginal diukur dengan benar, greedy mendekati optimal tanpa perlu menyelesaikan optimasi matematis penuh.",
        "Validasi bertahap adalah pengaman greedy: naikkan spend 20 persen per 2 minggu, pantau ROAS marginal (bukan rata-rata), hentikan penambahan bila marginal turun di bawah 1,2. Eksperimen ini yang membedakan alokasi dari tebakan: tiap kenaikan adalah uji, bukan komitmen.",
        "Satu peringatan: marginal yang diukur dari data observasional bisa bias — channel yang naik spend-nya bersamaan dengan musim ramai akan terlihat marginal tinggi padahal musimlah penyebabnya. Kalibrasi berkala dengan geo-experiment (naikkan spend di beberapa kota, tahan di kota lain) adalah satu-satunya cara memastikan marginal itu kausal — pelajaran yang sama seperti MK12 tentang validasi atribusi.",
      ],
      tasks: [],
      reference: "Greedy: potongan 50 juta ke marginal tertinggi, hitung ulang, ulangi. Validasi: naik 20 persen per 2 minggu, hentikan bila marginal di bawah 1,2.",
    },
    {
      id: "lab-marginal",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung ROAS marginal dua channel",
      prose: [
        "Lab ini menghitung ROAS marginal Google dan Meta dari dua titik spend dan revenue.",
        "Hitung dulu di kepala. Google: revenue tambah 196 dikurangi 140 sama dengan 56; spend tambah 150 dikurangi 100 sama dengan 50; marginal 56 dibagi 50 sama dengan 1,12. Meta: revenue tambah 95 dikurangi 80 sama dengan 15; spend tambah 50; marginal 15 dibagi 50 sama dengan 0,30.",
        "Tugas lab: tulis fungsi yang menerima spend dan revenue awal dan akhir tiap channel — lalu mencetak dua angka: marginal_google dan marginal_meta.",
        "Setelah lolos, coba eksperimen: ubah revenue akhir Meta menjadi 130 dan lihat marginalnya naik menjadi 1,0 — tepat di titik impas. Itulah sensitivitas keputusan alokasi terhadap satu angka.",
      ],
      tasks: [
        { id: "t1", text: "Hitung marginal_google" },
        { id: "t2", text: "Hitung marginal_meta" },
      ],
      expected: "marginal_google=1.12\nmarginal_meta=0.3",
      hints: [
        "Marginal = tambahan revenue dibagi tambahan spend.",
        "Tambahan = akhir dikurangi awal.",
      ],
      code: {
        starter: `# Dua titik spend dan revenue (juta rupiah).\ngoogle_spend = [100, 150]\ngoogle_rev = [140, 196]\nmeta_spend = [100, 150]\nmeta_rev = [80, 95]\n\n# TULIS KODEMU: hitung marginal_google dan marginal_meta.\n# Cetak, per baris: marginal_google, marginal_meta.\n\n\nmesin_marginal(google_spend, google_rev, meta_spend, meta_rev)`,
        lockLines: 5,
        solution: `# Dua titik spend dan revenue (juta rupiah).\ngoogle_spend = [100, 150]\ngoogle_rev = [140, 196]\nmeta_spend = [100, 150]\nmeta_rev = [80, 95]\n\n\ndef mesin_marginal(google_spend, google_rev, meta_spend, meta_rev):\n    marginal_google = (google_rev[1] - google_rev[0]) / (google_spend[1] - google_spend[0])\n    marginal_meta = (meta_rev[1] - meta_rev[0]) / (meta_spend[1] - meta_spend[0])\n    print(f"marginal_google={marginal_google}")\n    print(f"marginal_meta={marginal_meta}")\n\n\nmesin_marginal(google_spend, google_rev, meta_spend, meta_rev)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "marginal_google=1.12", label: "Marginal Google 1,12", msg: "(196 - 140) / (150 - 100) = 56 / 50 = 1,12." },
          { kind: "stdout_matches", task: "t2", pattern: "marginal_meta=0.3", label: "Marginal Meta 0,30", msg: "(95 - 80) / (150 - 100) = 15 / 50 = 0,30. Rupiah berikutnya lebih baik di Google." },
        ],
      },
      reference: "Marginal Google 1,12; Meta 0,30.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: Rp500 juta yang berhenti dibagi rata",
      prose: [
        "Kembali ke KirimCepat. Alokasi baru memakai greedy marginal: Google Rp250 juta, TikTok Rp175 juta, Meta Rp75 juta (hanya retargeting yang ROAS-nya lebih baik) — total tetap Rp500 juta. Kenaikan dilakukan bertahap per 2 minggu dengan pantauan marginal: bila ROAS Google turun di bawah 1,2, penambahan dihentikan.",
        "Hasil kuartal: revenue naik 18 persen dengan spend yang sama. Meta yang dikurangi tidak protes — datanya sendiri menunjukkan marginal 0,30. Dan geo-experiment kuartal berikutnya mengonfirmasi marginal Google memang kausal, bukan musim.",
        "Keputusan rapat: alokasi budget memakai ROAS marginal, bukan rata-rata — dan setiap alokasi besar wajib disertai rencana validasi bertahap.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat alokasi baru berhasil. Pertama, keputusan memakai marginal — rupiah berikutnya, bukan rupiah kemarin. Kedua, kenaikan bertahap dengan ambang henti — bukan komitmen sekaligus. Ketiga, validasi kausal dengan geo-experiment — marginal observasional dikalibrasi.",
      },
      reference: "Google 250, TikTok 175, Meta 75 (juta). Revenue naik 18 persen dengan spend sama.",
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
        "Lab: marginal Google 1,12; Meta 0,30.",
        "Alokasi memakai ROAS marginal — rupiah berikutnya — bukan ROAS rata-rata.",
        "Diminishing returns: marginal turun saat spend naik — audiens terbaik sudah dijangkau.",
        "Greedy: potongan ke marginal tertinggi, hitung ulang, ulangi.",
        "Validasi bertahap dan kalibrasi geo-experiment memastikan marginal itu kausal.",
      ],
      next: { label: "MK36 — Regresi untuk Marketing: Dari Korelasi ke Koefisien", href: "/v2/learn/mk36-regresi-marketing" },
      quiz: [
        {
          q: "Google: spend 100 ke 150, revenue 140 ke 196. Meta: spend 100 ke 150, revenue 80 ke 95. Berapa marginal masing-masing?",
          options: [
            { text: "Google 1,40; Meta 0,80 — itu ROAS rata-rata", why: "Salah: 140 / 100 = 1,40 adalah rata-rata, bukan marginal." },
            { text: "Google 1,12; Meta 0,30", why: "Tepat: 56 / 50 = 1,12; 15 / 50 = 0,30.", correct: true },
            { text: "Google 0,30; Meta 1,12 — terbalik", why: "Salah: Google yang marginal tinggi, Meta yang rendah." },
            { text: "Google 1,12; Meta 1,12 — keduanya sama", why: "Salah: Meta hanya 0,30 — menyamakan keduanya mengabaikan data." },
          ],
        },
        {
          q: "Kenapa ROAS rata-rata salah dipakai untuk alokasi?",
          options: [
            { text: "Karena rata-rata sulit dihitung", why: "Salah: rata-rata mudah dihitung — masalahnya ia menjawab pertanyaan yang salah." },
            { text: "Karena rata-rata selalu lebih kecil dari marginal", why: "Salah: tidak ada hubungan tetap antara rata-rata dan marginal." },
            { text: "Rata-rata menjawab seberapa bagus channel selama ini; alokasi butuh marginal — rupiah berikutnya", why: "Tepat: channel dengan rata-rata tertinggi belum tentu punya marginal tertinggi.", correct: true },
            { text: "Karena rata-rata tidak memakai data spend", why: "Salah: rata-rata memakai spend — hanya saja spend yang sudah terjadi." },
          ],
        },
        {
          q: "Marginal channel turun dari 1,12 ke 0,95 saat spend naik. Apa yang terjadi?",
          options: [
            { text: "Channel itu rusak dan harus dimatikan", why: "Salah: marginal 0,95 hanya berarti rupiah tambahan merugi sedikit — bukan channel rusak." },
            { text: "Data salah — marginal tidak pernah turun", why: "Salah: marginal turun adalah pola normal, bukan kesalahan data." },
            { text: "Naikkan spend lebih banyak lagi untuk mengembalikan marginal", why: "Salah: menambah spend justru mempercepat diminishing returns." },
            { text: "Diminishing returns — audiens terbaik sudah dijangkau, lelang makin mahal", why: "Tepat: itulah kenapa marginal turun mengikuti spend.", correct: true },
          ],
        },
        {
          q: "Bagaimana cara greedy allocation bekerja?",
          options: [
            { text: "Beri tiap potongan budget ke channel dengan marginal tertinggi saat itu, hitung ulang, ulangi", why: "Tepat: potongan kecil dan hitung ulang membuat greedy mendekati optimal.", correct: true },
            { text: "Bagi budget rata ke semua channel", why: "Salah: itu alokasi bagi-rata — mengabaikan efisiensi." },
            { text: "Beri semua budget ke channel dengan ROAS rata-rata tertinggi", why: "Salah: itu mengabaikan diminishing returns dan kejenuhan." },
            { text: "Beri budget ke channel yang paling banyak meminta", why: "Salah: permintaan tim bukan ukuran efisiensi." },
          ],
        },
        {
          q: "Marginal observasional Google tinggi bersamaan dengan musim ramai. Apa yang harus dilakukan?",
          options: [
            { text: "Percaya begitu saja — data tidak berbohong", why: "Salah: data observasional bisa bias musim; marginal tinggi bisa jadi efek musim, bukan channel." },
            { text: "Kalibrasi dengan geo-experiment: naikkan spend di beberapa kota, tahan di kota lain", why: "Tepat: hanya eksperimen yang memastikan marginal itu kausal.", correct: true },
            { text: "Naikkan spend Google dua kali lipat segera", why: "Salah: komitmen besar berdasarkan marginal yang belum tervalidasi adalah taruhan, bukan alokasi." },
            { text: "Abaikan musim — musim tidak memengaruhi marginal", why: "Salah: musim memengaruhi revenue dan bisa menggelembungkan marginal observasional." },
          ],
        },
      ],
    },
  ],
};
