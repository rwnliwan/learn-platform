import type { V2Lesson } from "../lib/types";

export const mk33: V2Lesson = {
  slug: "mk33-social-network-analysis",
  track: "Marketing Analytics",
  module: "Segmentasi Pelanggan",
  title: "MK33 — Social Network Analysis: Siapa Mempengaruhi Siapa",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Influencer dengan 1 juta follower yang tidak menjual apa-apa",
      prose: [
        "KirimCepat membayar influencer dengan 1 juta follower untuk kampanye — hasilnya 12 order. Di saat yang sama, seorang pelanggan biasa dengan 800 follower merekomendasikan produk di grup chat — hasilnya 340 order. Follower bukan pengaruh; posisi di jaringan adalah SALAH SATU penjelas pengaruh — bukan satu-satunya: konten, kredibilitas, dan waktu juga menentukan apakah orang mendengar. Lesson ini mengukur posisi; jangan membaca 'posisi tinggi = pasti berpengaruh'.",
        "Social network analysis (SNA) mengukur posisi itu: siapa terhubung ke siapa, siapa jembatan antar kelompok, dan siapa yang bila berbicara didengar banyak kelompok sekaligus. Influencer sejuta follower itu berada di pinggir jaringan — banyak follower, sedikit koneksi yang saling mengenal. Pelanggan biasa itu berada di tengah — jembatan tiga komunitas.",
        "Lesson ini mengajarkan SNA untuk marketing: graf, sentralitas, komunitas, dan difusi. Setelah lesson ini kamu bisa: (1) membangun graf dari interaksi pelanggan; (2) menghitung degree centrality dan densitas; (3) menemukan jembatan antar komunitas; (4) menjelaskan difusi dan threshold adopsi; (5) memilih seed untuk kampanye referral.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Grep seluruh track MK untuk social network, network analysis, dan centrality menghasilkan 0 hit — tidak ada lesson yang membahas analisis jaringan sosial. MK4 membahas segmentasi dan MK22 membahas CDP, tetapi keduanya tidak mengukur posisi pelanggan di jaringan. Lesson ini membangun topik itu.",
      },
      reference: "Graf 6 node, 8 edge: densitas 0,53. Node A derajat 4 dari 5: sentralitas 0,8.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memilih siapa yang diajak bicara dulu — bukan berdasarkan follower, melainkan berdasarkan posisi di jaringan.",
        "(1) Membangun graf pelanggan dari interaksi (mention, share, grup);",
        "(2) Menghitung degree centrality dan densitas jaringan;",
        "(3) Menemukan jembatan (broker) antar komunitas;",
        "(4) Menjelaskan difusi: threshold adopsi dan efek kaskade;",
        "(5) Memilih seed referral dari sentralitas, bukan dari ukuran audiens.",
      ],
      tasks: [],
    },
    {
      id: "graf-sentralitas",
      eyebrow: "Langkah 3 · Teori",
      title: "Graf, sentralitas, dan densitas",
      prose: [
        "Graf terdiri dari node (pelanggan) dan edge (interaksi: mention, share, satu grup). Degree centrality node adalah derajatnya dibagi jumlah node lain yang mungkin: node A terhubung ke 4 dari 5 node lain — sentralitas 4 dibagi 5 sama dengan 0,8. Node dengan sentralitas tinggi terhubung ke banyak orang; node dengan betweenness tinggi adalah jembatan — tanpa dia, dua komunitas terputus.",
        "Densitas mengukur seberapa terhubung jaringan: 2 dikali edge dibagi node dikali node dikurangi 1. Graf 6 node dengan 8 edge: 2 dikali 8 dibagi 6 dikali 5 sama dengan 16 dibagi 30 sama dengan 0,53. Densitas 0,53 berarti separuh lebih pasangan yang mungkin saling terhubung — jaringan yang cukup rapat untuk difusi, tetapi masih punya lubang struktural tempat jembatan bekerja.",
        "Tiga sentralitas, tiga pertanyaan. Degree: siapa paling banyak terhubung — untuk jangkauan cepat. Betweenness: siapa jembatan antar kelompok — untuk menyebrang komunitas. Closeness: siapa paling dekat dengan semua — untuk penyebaran tercepat. Influencer sejuta follower punya degree tinggi di graf follower — tetapi di graf interaksi (yang saling mengenal), ia di pinggir.",
      ],
      tasks: [],
      note: {
        title: "Graf follower bukan graf pengaruh",
        body: "Follower adalah graf satu arah yang murah: sekali klik, tanpa interaksi. Graf pengaruh dibangun dari interaksi dua arah: balasan, share, dan grup yang sama. Keputusan seed harus memakai graf interaksi — follower hanya mengukur potensi jangkauan, bukan pengaruh.",
      },
      reference: "Sentralitas A 0,8 (4 dari 5). Densitas 0,53 (16 dari 30 pasangan). Degree, betweenness, closeness menjawab tiga pertanyaan berbeda.",
    },
    {
      id: "komunitas-difusi",
      eyebrow: "Langkah 4 · Teori",
      title: "Komunitas dan difusi: bagaimana ide menyebar",
      prose: [
        "Komunitas adalah kelompok node yang saling terhubung rapat di dalam dan jarang ke luar. Menemukannya berarti kampanye bisa disesuaikan per komunitas — pesan yang bekerja di komunitas ibu muda belum tentu bekerja di komunitas gamer. Dan jembatan antar komunitas adalah orang yang paling berharga: satu jembatan bisa membawa pesan ke komunitas yang tidak terjangkau iklan.",
        "Difusi mengikuti threshold: seseorang mengadopsi bila cukup banyak tetangganya sudah mengadopsi. Threshold rendah (1 tetangga cukup) berarti kaskade cepat — satu seed bisa menyalakan seluruh jaringan. Threshold tinggi berarti butuh banyak seed di banyak komunitas sekaligus. Kampanye referral yang gagal biasanya salah membaca threshold: satu seed di jaringan ber-threshold 2 tidak menyalakan SIAPA PUN — tiap tetangga baru punya 1 tetangga yang mengadopsi, di bawah ambang 2 — dan pada threshold yang lebih tinggi lagi, satu seed bahkan tidak pernah memulai apa-apa.",
        "Aturan seed: pilih sedikit seed dengan betweenness tinggi di banyak komunitas — bukan banyak seed di satu komunitas. Dan ukur difusi per komunitas, bukan total: total 340 order yang 320-nya dari satu komunitas berarti dua komunitas lain belum tersentuh.",
      ],
      tasks: [],
      reference: "Seed: sedikit, betweenness tinggi, tersebar antar komunitas. Ukur difusi per komunitas, bukan total.",
    },
    {
      id: "lab-sna",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung sentralitas dan densitas jaringan",
      prose: [
        "Lab ini menghitung sentralitas degree dan densitas dari graf pelanggan kecil.",
        "Hitung dulu di kepala. Sentralitas A: derajat 4 dibagi 5 node lain sama dengan 0,8. Densitas: 2 dikali 8 edge sama dengan 16; 6 dikali 5 sama dengan 30; 16 dibagi 30 sama dengan 0,53 (dibulatkan 2 desimal).",
        "Tugas lab: tulis fungsi yang menerima derajat node, jumlah node, dan jumlah edge — lalu mencetak dua angka: sentralitas_a dan densitas.",
        "Setelah lolos, coba eksperimen: tambah edge menjadi 15 (graf lengkap) dan lihat densitas menjadi 1,0 — semua orang terhubung ke semua orang, dan jembatan tidak lagi berharga.",
      ],
      tasks: [
        { id: "t1", text: "Hitung sentralitas_a dari derajat dan node" },
        { id: "t2", text: "Hitung densitas dari edge dan node" },
      ],
      expected: "sentralitas_a=0.8\ndensitas=0.53",
      hints: [
        "Sentralitas = derajat dibagi (node dikurangi 1).",
        "Densitas = 2 dikali edge dibagi (node dikali (node dikurangi 1)).",
        "Bulatkan densitas ke 2 desimal.",
      ],
      code: {
        starter: `# Graf pelanggan KirimCepat: 6 node, 8 edge.\nnode = 6\nedge = 8\nderajat_a = 4\n\n# TULIS KODEMU: hitung sentralitas_a dan densitas.\n# Cetak, per baris: sentralitas_a, densitas.\n\n\nmesin_sna(node, edge, derajat_a)`,
        lockLines: 4,
        solution: `# Graf pelanggan KirimCepat: 6 node, 8 edge.\nnode = 6\nedge = 8\nderajat_a = 4\n\n\ndef mesin_sna(node, edge, derajat_a):\n    sentralitas_a = derajat_a / (node - 1)\n    densitas = round(2 * edge / (node * (node - 1)), 2)\n    print(f"sentralitas_a={sentralitas_a}")\n    print(f"densitas={densitas}")\n\n\nmesin_sna(node, edge, derajat_a)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "sentralitas_a=0.8", label: "Sentralitas A 0,8", msg: "4 / 5 = 0,8. Node A terhubung ke 4 dari 5 node lain." },
          { kind: "stdout_matches", task: "t2", pattern: "densitas=0.53", label: "Densitas 0,53", msg: "16 / 30 = 0,53. Separuh lebih pasangan yang mungkin saling terhubung." },
        ],
      },
      note: {
        title: "Membangun graf dari edge list (demo)",
        body: "Interaksi pelanggan ditulis sebagai daftar pasangan — [('A','B'), ('A','C'), ('B','C'), ('A','D'), ('D','E'), ('E','F')] — lalu diubah menjadi adjacency dict: tiap node memetakan ke himpunan tetangganya. Derajat node = panjang himpunan tetangganya; jumlah edge = panjang daftar pasangan. Intinya: graf dimulai dari daftar interaksi mentah, bukan dari angka jadi — dan pilihan 'apa yang dihitung sebagai edge' (balasan? share? grup yang sama?) menentukan seluruh hasil analisis.",
      },
      reference: "Sentralitas A 0,8; densitas 0,53.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 800 follower yang menjual 340 order",
      prose: [
        "Kembali ke KirimCepat. Analisis jaringan menemukan pelanggan biasa itu: sentralitas 0,8, betweenness tertinggi, jembatan tiga komunitas (ibu muda, reseller, dan komunitas hobi). Kampanye referral berikutnya memakai 20 seed seperti dia — bukan 1 influencer sejuta follower. Hasilnya: 2.400 order dari 20 seed, dengan biaya sepersepuluh influencer.",
        "Pengukuran difusi per komunitas menunjukkan satu komunitas belum tersentuh — threshold-nya tinggi karena anggotanya tidak saling mengenal. Solusinya: 5 seed tambahan khusus di komunitas itu, bukan menambah seed di komunitas yang sudah menyala.",
        "Keputusan rapat: pemilihan seed wajib memakai graf interaksi — follower hanya dipakai sebagai data pendukung. Dan kampanye referral diukur per komunitas, bukan total.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat kampanye ini berhasil. Pertama, seed dipilih dari posisi di jaringan, bukan ukuran audiens. Kedua, seed tersebar antar komunitas — bukan menumpuk di satu. Ketiga, difusi diukur per komunitas — komunitas yang belum tersentuh ketahuan dan ditangani.",
      },
      reference: "20 seed jembatan: 2.400 order, biaya sepersepuluh influencer. Difusi diukur per komunitas.",
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
        "Lab: sentralitas A 0,8; densitas 0,53.",
        "Follower bukan pengaruh — graf interaksi dua arah yang mengukur pengaruh.",
        "Degree untuk jangkauan, betweenness untuk jembatan, closeness untuk penyebaran tercepat.",
        "Difusi mengikuti threshold — satu seed di jaringan ber-threshold tinggi cepat padam.",
        "Seed sedikit, betweenness tinggi, tersebar antar komunitas; ukur per komunitas.",
      ],
      next: { label: "MK34 — Fairness dan Trust di Sistem Rekomendasi: Rekomendasi yang Adil", href: "/v2/learn/mk34-fairness-trust-recommender" },
      quiz: [
        {
          q: "Graf 6 node, 8 edge; node A derajat 4. Berapa sentralitas A dan densitas jaringan?",
          options: [
            { text: "Sentralitas 0,67; densitas 0,53 — derajat dibagi node", why: "Salah: sentralitas membagi dengan node dikurangi 1 (4 / 5), bukan node (4 / 6)." },
            { text: "Sentralitas 0,8; densitas 0,27 — edge tidak dikali 2", why: "Salah: densitas memakai 2 dikali edge: 16 / 30 = 0,53." },
            { text: "Sentralitas 4,0; densitas 8,0 — angka mentah", why: "Salah: sentralitas dan densitas adalah rasio 0 sampai 1, bukan angka mentah." },
            { text: "Sentralitas 0,8; densitas 0,53", why: "Tepat: 4 / 5 = 0,8; 16 / 30 = 0,53.", correct: true },
          ],
        },
        {
          q: "Influencer sejuta follower hanya menjual 12 order, pelanggan 800 follower menjual 340. Apa penjelasannya?",
          options: [
            { text: "Pengaruh adalah posisi di graf interaksi — pelanggan itu jembatan tiga komunitas", why: "Tepat: follower mengukur jangkauan potensial; posisi di graf interaksi adalah ukuran pengaruh yang dipakai lesson ini — bukan satu-satunya penentu pengaruh di dunia nyata.", correct: true },
            { text: "Follower influencer pasti bot", why: "Salah: tidak ada bukti bot — posisinya di jaringan yang menjelaskan." },
            { text: "Produknya tidak cocok untuk follower influencer", why: "Salah: tidak ada bukti ketidakcocokan produk — jaringanlah pembedanya." },
            { text: "Kampanye influencer selalu gagal", why: "Salah: generalisasi tanpa dasar — influencer bisa berhasil bila posisinya di tengah jaringan." },
          ],
        },
        {
          q: "Kamu ingin pesan menyebrang dari satu komunitas ke komunitas lain. Node seperti apa yang dicari?",
          options: [
            { text: "Node dengan degree tertinggi di satu komunitas", why: "Salah: degree tinggi di satu komunitas tidak menjamin koneksi ke komunitas lain." },
            { text: "Node dengan betweenness tertinggi — jembatan antar komunitas", why: "Tepat: betweenness mengukur seberapa sering node menjadi jalan antara dua kelompok.", correct: true },
            { text: "Node dengan follower terbanyak", why: "Salah: follower bukan ukuran posisi di graf interaksi." },
            { text: "Node yang paling baru bergabung", why: "Salah: kebaruan tidak ada hubungannya dengan posisi jaringan." },
          ],
        },
        {
          q: "Jaringan dengan threshold 2 (tiap orang butuh 2 tetangga yang sudah mengadopsi) diberi satu seed. Apa yang terjadi?",
          options: [
            { text: "Kaskade menyalakan seluruh jaringan", why: "Salah: itu yang terjadi pada threshold rendah — satu tetangga cukup." },
            { text: "Tidak ada tetangga yang teraktivasi — tiap tetangga hanya punya 1 tetangga yang mengadopsi", why: "Tepat: pada threshold 2, tetangga seed hanya punya 1 tetangga yang mengadopsi (seed itu sendiri) — di bawah ambang 2 — jadi kaskade tidak pernah mulai.", correct: true },
            { text: "Seed menyalakan tetangganya lalu padam", why: "Salah: pada threshold 2, tetangga seed tidak menyala sama sekali — mereka butuh 2 tetangga yang mengadopsi dan baru punya 1. 'Menyala lalu padam' terjadi pada threshold yang lebih rendah dengan jangkauan terbatas.", correct: false },
            { text: "Seed berpindah komunitas sendiri", why: "Salah: seed tidak berpindah — difusi yang menyebar atau padam." },
          ],
        },
        {
          q: "Total referral 340 order, 320 dari satu komunitas. Apa yang harus dilakukan?",
          options: [
            { text: "Rayakan — totalnya bagus", why: "Salah: total menyembunyikan bahwa dua komunitas belum tersentuh." },
            { text: "Tambah seed di komunitas yang sudah menyala", why: "Salah: komunitas yang sudah menyala tidak butuh seed tambahan." },
            { text: "Hentikan kampanye — 340 sudah cukup", why: "Salah: berhenti berarti menyerahkan dua komunitas yang belum tersentuh." },
            { text: "Ukur difusi per komunitas dan tambah seed di komunitas yang belum tersentuh", why: "Tepat: pengukuran per komunitas menunjukkan di mana pesan belum sampai.", correct: true },
          ],
        },
      ],
    },
  ],
};
