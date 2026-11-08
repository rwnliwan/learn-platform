import type { V2Lesson } from "../lib/types";

export const mk34: V2Lesson = {
  slug: "mk34-fairness-trust-recommender",
  track: "Marketing Analytics",
  module: "Sistem Rekomendasi",
  title: "MK34 — Fairness dan Trust di Sistem Rekomendasi: Rekomendasi yang Adil",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rekomendasi yang hanya menampilkan 10 produk terlaris",
      prose: [
        "Toko online KirimCepat memasang widget rekomendasi. Tiga bulan kemudian, 65 persen rekomendasi yang ditampilkan adalah 10 produk terlaris — produk baru dari penjual kecil tidak pernah muncul, berapa pun bagusnya. Penjual kecil protes; tim produk menjawab 'algoritma yang memutuskan'. Algoritma itu memang memutuskan — dari data yang bias popularitas.",
        "Di sisi lain, audit fairness menemukan selection rate: grup A dipilih 12 persen, grup B hanya 7,2 persen — rasio disparitas 0,6, di bawah ambang 0,8. Rekomendasi itu tidak hanya membosankan; ia tidak adil — dan ketidakadilan yang tidak diukur adalah ketidakadilan yang tidak pernah diperbaiki.",
        "Lesson ini mengajarkan fairness dan trust di sistem rekomendasi: bias popularitas, disparitas, dan sinyal kepercayaan. Setelah lesson ini kamu bisa: (1) menghitung disparate impact ratio; (2) mengukur bias popularitas; (3) menjelaskan exposure fairness; (4) merancang mitigasi: re-ranking dan eksplorasi; (5) menulis sinyal trust yang jujur di widget.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MK8 mengajarkan mekanisme rekomendasi (cosine similarity, asosiasi) dan MK18 mengajarkan audit fairness umum (DI di atas atau sama dengan 0,8, k-anonimitas) — tetapi tidak ada lesson tentang fairness dan trust KHUSUS recommender: bias popularitas, exposure fairness, dan re-ranking. Lesson ini membangun sudut itu.",
      },
      reference: "Selection rate A 12 persen, B 7,2 persen: DI 0,6 — di bawah ambang 0,8, gagal. Top 10 produk: 65 persen rekomendasi.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengaudit sistem rekomendasi seperti mengaudit keputusan: dengan angka disparitas, bukan dengan perasaan.",
        "(1) Menghitung disparate impact ratio dari selection rate dua grup;",
        "(2) Mengukur bias popularitas: pangsa rekomendasi produk teratas;",
        "(3) Menjelaskan exposure fairness: siapa mendapat kesempatan tampil;",
        "(4) Merancang mitigasi: re-ranking, eksplorasi, dan kuota eksposur;",
        "(5) Menulis sinyal trust: kenapa produk ini direkomendasikan.",
      ],
      tasks: [],
    },
    {
      id: "disparitas-popularitas",
      eyebrow: "Langkah 3 · Teori",
      title: "Disparate impact dan bias popularitas",
      prose: [
        "Disparate impact (DI) ratio sama dengan selection rate grup yang lebih rendah dibagi grup yang lebih tinggi: 7,2 dibagi 12 sama dengan 0,6. Ambang yang dipakai (aturan 80 persen): DI di bawah 0,8 berarti disparitas yang harus diselidiki — bukan vonis diskriminasi, melainkan alarm. Alarm itu memicu pertanyaan: apakah perbedaan itu berasal dari data (grup B memang lebih jarang membeli kategori itu) atau dari model (model memperkuat pola historis)?",
        "Bias popularitas adalah umpan balik yang memperkuat dirinya sendiri: produk populer direkomendasikan, lalu dibeli, lalu makin populer, lalu makin direkomendasikan. Top 10 produk menguasai 65 persen rekomendasi — bukan karena 10 produk itu terbaik untuk semua orang, melainkan karena sistem tidak pernah memberi kesempatan pada produk lain untuk membuktikan diri. Akibatnya: katalog terasa sempit, penjual kecil mati, dan pengguna bosan.",
        "Exposure fairness bertanya siapa mendapat kesempatan tampil — bukan siapa yang akhirnya diklik. Dua produk dengan kualitas sama harus mendapat eksposur sebanding; bila satu mendapat 65 persen eksposur dan satunya 0 persen, perbandingan klik keduanya tidak ada artinya. Fairness diukur di eksposur, bukan hanya di hasil.",
      ],
      tasks: [],
      note: {
        title: "DI di bawah 0,8 adalah alarm, bukan vonis",
        body: "DI 0,6 tidak membuktikan diskriminasi — ia membuktikan ada yang harus diselidiki. Mungkin grup B memang lebih jarang membeli kategori itu (perbedaan nyata), mungkin model memperkuat bias historis (perbedaan buatan). Penyelidikan membedakan keduanya; angka saja tidak.",
      },
      reference: "DI 0,6 (7,2 dibagi 12) — di bawah ambang 0,8, selidiki. Top 10: 65 persen rekomendasi — bias popularitas.",
    },
    {
      id: "mitigasi-trust",
      eyebrow: "Langkah 4 · Teori",
      title: "Mitigasi dan trust: re-ranking, eksplorasi, penjelasan",
      prose: [
        "Mitigasi pertama: re-ranking — sesudah model memberi skor, susun ulang daftar dengan batas eksposur: maksimal 40 persen slot untuk top 10, sisanya untuk produk baru dan penjual kecil. Mitigasi kedua: eksplorasi — sisihkan 10 persen slot untuk produk yang belum punya data, supaya sistem belajar tentang mereka. Tanpa eksplorasi, produk baru tidak pernah mendapat data — dan tanpa data, tidak pernah direkomendasikan. Lingkaran itu hanya diputus dengan sengaja.",
        "Mitigasi ketiga: audit berkala — DI dihitung tiap bulan per grup yang relevan, dan penurunan DI di bawah 0,8 memicu review model. Audit yang tidak terjadwal adalah audit yang tidak pernah terjadi.",
        "Trust dibangun dari penjelasan: widget yang menulis 'direkomendasikan karena kamu membeli X' lebih dipercaya dari widget yang diam-diam menampilkan produk. Penjelasan yang jujur juga melindungi perusahaan: bila rekomendasi dipertanyakan, ada jejak alasannya — bukan sekadar 'algoritma yang memutuskan'.",
      ],
      tasks: [],
      reference: "Re-ranking: top 10 maksimal 40 persen slot. Eksplorasi: 10 persen slot untuk produk baru. Audit DI bulanan; ambang 0,8 memicu review.",
    },
    {
      id: "lab-fairness",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung disparate impact dan pangsa top 10",
      prose: [
        "Lab ini menghitung DI ratio dan pangsa rekomendasi produk terlaris dari angka mentah audit.",
        "Hitung dulu di kepala. DI: 7,2 dibagi 12 sama dengan 0,6. Pangsa top 10: 65 persen — dibaca langsung dari laporan eksposur (650 dari 1.000 slot rekomendasi).",
        "Tugas lab: tulis fungsi yang menerima selection rate dua grup dan slot top 10 dari total slot — lalu mencetak dua angka: di dan pangsa_top10.",
        "Setelah lolos, coba eksperimen: naikkan selection rate B menjadi 10 persen dan lihat DI naik menjadi 0,83 — lolos ambang 0,8. Perbaikan kecil di grup yang tertinggal mengubah vonis audit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung di dari selection rate A dan B" },
        { id: "t2", text: "Hitung pangsa_top10 dari slot" },
      ],
      expected: "di=0.6\npangsa_top10=65",
      hints: [
        "DI = rate yang lebih rendah dibagi rate yang lebih tinggi.",
        "Pangsa = slot top 10 dibagi total slot, dikali 100.",
      ],
      code: {
        starter: `# Audit fairness widget rekomendasi KirimCepat.\nrate_a = 12.0\nrate_b = 7.2\nslot_top10 = 650\ntotal_slot = 1000\n\n# TULIS KODEMU: hitung di dan pangsa_top10.\n# Cetak, per baris: di, pangsa_top10.\n\n\nmesin_fairness(rate_a, rate_b, slot_top10, total_slot)`,
        lockLines: 5,
        solution: `# Audit fairness widget rekomendasi KirimCepat.\nrate_a = 12.0\nrate_b = 7.2\nslot_top10 = 650\ntotal_slot = 1000\n\n\ndef mesin_fairness(rate_a, rate_b, slot_top10, total_slot):\n    di = min(rate_a, rate_b) / max(rate_a, rate_b)\n    pangsa_top10 = slot_top10 / total_slot * 100\n    print(f"di={di}")\n    print(f"pangsa_top10={pangsa_top10:.0f}")\n\n\nmesin_fairness(rate_a, rate_b, slot_top10, total_slot)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "di=0.6", label: "DI 0,6", msg: "7,2 / 12 = 0,6. Di bawah ambang 0,8 — selidiki." },
          { kind: "stdout_matches", task: "t2", pattern: "pangsa_top10=65", label: "Top 10: 65 persen", msg: "650 / 1.000 x 100 = 65 persen rekomendasi dikuasai 10 produk." },
        ],
      },
      reference: "DI 0,6; top 10 menguasai 65 persen rekomendasi.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: widget yang akhirnya memberi kesempatan",
      prose: [
        "Kembali ke KirimCepat. Re-ranking diterapkan: top 10 maksimal 40 persen slot, 10 persen slot untuk eksplorasi produk baru. Tiga bulan kemudian: pangsa top 10 turun menjadi 38 persen, DI naik menjadi 0,85 — lolos ambang. Penjual kecil yang tadinya tidak pernah muncul kini mendapat 12 persen eksposur — dan 3 di antaranya masuk 20 besar penjualan.",
        "Click-through rate total turun 2 persen di bulan pertama — harga eksplorasi. Bulan ketiga ia kembali naik melampaui sebelumnya: katalog yang lebih beragam membuat pengguna menemukan produk yang benar-benar mereka mau, bukan hanya yang populer.",
        "Keputusan rapat: DI dihitung tiap bulan dan dipajang di dashboard tim rekomendasi — di samping CTR, bukan di laporan tahunan yang tidak dibaca.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini bertahan. Pertama, mitigasi diukur — DI dan pangsa top 10 dipantau bulanan. Kedua, harga eksplorasi diakui — CTR turun 2 persen di bulan pertama, bukan disembunyikan. Ketiga, fairness dipajang di samping metrik bisnis — bukan di laporan terpisah.",
      },
      reference: "Top 10: 65 persen ke 38 persen. DI: 0,6 ke 0,85. CTR turun 2 persen lalu naik melampaui sebelumnya.",
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
        "Lab: DI 0,6 (di bawah ambang 0,8); top 10 menguasai 65 persen rekomendasi.",
        "DI di bawah 0,8 adalah alarm untuk diselidiki, bukan vonis diskriminasi.",
        "Bias popularitas memperkuat dirinya sendiri — produk populer makin populer.",
        "Exposure fairness: siapa mendapat kesempatan tampil, bukan hanya siapa diklik.",
        "Mitigasi: re-ranking, eksplorasi 10 persen, audit DI bulanan, penjelasan yang jujur.",
      ],
      next: { label: "MK35 — Optimasi Alokasi Budget: Rupiah Terakhir ke Channel Terbaik", href: "/v2/learn/mk35-optimasi-alokasi-budget" },
      quiz: [
        {
          q: "Selection rate A 12 persen, B 7,2 persen; top 10 menguasai 650 dari 1.000 slot. Berapa DI dan pangsa top 10?",
          options: [
            { text: "DI 0,6; pangsa 65 persen", why: "Tepat: 7,2 / 12 = 0,6; 650 / 1.000 = 65 persen.", correct: true },
            { text: "DI 1,67; pangsa 65 persen — rasio terbalik", why: "Salah: DI adalah rate rendah dibagi rate tinggi (7,2 / 12), bukan sebaliknya." },
            { text: "DI 0,6; pangsa 35 persen — slot disalahhitung", why: "Salah: 650 / 1.000 = 65 persen, bukan 35 persen." },
            { text: "DI 0,8; pangsa 65 persen — ambang disalahartikan", why: "Salah: 0,8 adalah ambang, bukan hasil hitung; hasilnya 0,6." },
          ],
        },
        {
          q: "DI 0,6. Apa arti yang benar?",
          options: [
            { text: "Terbukti diskriminasi — model harus dimatikan", why: "Salah: DI di bawah 0,8 adalah alarm untuk diselidiki, bukan vonis." },
            { text: "Alarm: selidiki apakah perbedaan berasal dari data nyata atau bias model", why: "Tepat: penyelidikan membedakan perbedaan nyata dari perbedaan buatan.", correct: true },
            { text: "Tidak ada masalah — 0,6 masih cukup dekat dengan 1", why: "Salah: 0,6 jauh di bawah ambang 0,8; mengabaikannya berarti ketidakadilan tidak pernah diperbaiki." },
            { text: "Grup B harus diberi rekomendasi yang sama persis dengan grup A", why: "Salah: fairness bukan kesamaan hasil mentah — melainkan kesempatan dan penyelidikan atas disparitas." },
          ],
        },
        {
          q: "Kenapa produk baru tidak pernah direkomendasikan tanpa eksplorasi sengaja?",
          options: [
            { text: "Karena produk baru selalu lebih buruk", why: "Salah: tidak ada bukti produk baru lebih buruk — ia hanya belum punya data." },
            { text: "Karena penjual kecil tidak membayar iklan", why: "Salah: rekomendasi organik tidak ditentukan pembayaran iklan." },
            { text: "Tanpa data, model tidak pernah merekomendasikannya; tanpa rekomendasi, ia tidak pernah mendapat data", why: "Tepat: lingkaran itu hanya diputus dengan slot eksplorasi yang disengaja.", correct: true },
            { text: "Karena pengguna tidak suka produk baru", why: "Salah: pengguna tidak bisa menyukai apa yang tidak pernah mereka lihat." },
          ],
        },
        {
          q: "Apa itu exposure fairness?",
          options: [
            { text: "Semua produk mendapat klik yang sama", why: "Salah: klik adalah hasil; exposure adalah kesempatan tampil." },
            { text: "Semua grup pengguna melihat rekomendasi yang sama persis", why: "Salah: personalisasi tetap boleh — yang adil adalah kesempatan tampil per produk." },
            { text: "Widget menampilkan semua produk sekaligus", why: "Salah: slot terbatas; fairness adalah alokasi slot, bukan menampilkan semuanya." },
            { text: "Produk dengan kualitas sama mendapat kesempatan tampil yang sebanding", why: "Tepat: fairness diukur di eksposur — perbandingan klik tidak ada artinya bila eksposurnya timpang.", correct: true },
          ],
        },
        {
          q: "Kenapa widget harus menjelaskan kenapa produk direkomendasikan?",
          options: [
            { text: "Penjelasan membangun trust dan memberi jejak bila rekomendasi dipertanyakan", why: "Tepat: 'algoritma yang memutuskan' bukan alasan yang bisa dipertanggungjawabkan.", correct: true },
            { text: "Supaya widget terlihat pintar", why: "Salah: tujuannya kepercayaan dan jejak alasan, bukan kesan pintar." },
            { text: "Supaya pengguna mengklik lebih banyak", why: "Salah: penjelasan bisa menaikkan klik, tetapi tujuannya adalah trust — bukan manipulasi klik." },
            { text: "Karena regulator mewajibkan penjelasan di semua widget", why: "Salah: ini praktik trust yang baik, bukan kewajiban regulator universal." },
          ],
        },
      ],
    },
  ],
};
