import type { V2Lesson } from "../lib/types";

export const aie24: V2Lesson = {
  slug: "aie24-generasi-citra-diffusion",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE24 — Generasi Citra & Diffusion: Stable Diffusion dan ComfyUI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "5.000 gambar produk dari 50 foto — tanpa fotografer",
      prose: [
        "KirimCepat butuh gambar produk dalam 10 latar berbeda untuk 500 produk — 5.000 gambar. Fotografer dan studio: 3 bulan dan Rp400 juta. Solusinya: Stable Diffusion dengan ControlNet — foto produk asli sebagai kontrol (pose dan bentuk dipertahankan), prompt teks sebagai pengarah latar ('latar dapur minimalis, cahaya pagi'). Hasil: 5.000 gambar dalam 2 hari, dengan review manusia atas 200 sampel. Bukan tanpa masalah: review menemukan 6 gambar cacat dari 200 sampel (3 persen) — tangan ekstra pada model, logo miring — ditangkap review, bukan oleh model.",
        "Generasi citra diffusion adalah alat produksi AI Engineering: bukan sekadar 'gambar keren', melainkan pipeline dengan kontrol (ControlNet), konsistensi (seed + LoRA gaya), dan evaluasi (review manusia atas sampel). DLE11 mengajarkan difusi sebagai teori; lesson ini mengajarkan MEMAKAINYA sebagai engineer produk.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan forward dan reverse diffusion dengan angka; (2) menghitung alpha-bar dari jadwal beta; (3) menjelaskan latent space dan penghematannya; (4) merancang pipeline ControlNet + LoRA; (5) merancang evaluasi dan review manusia untuk gambar hasil.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DLE11 membahas difusi sebagai keluarga generatif (teori forward/reverse) dan AIE tidak punya lesson generasi citra sama sekali (0 hit 'diffusion/Stable Diffusion/ComfyUI' di track). Lesson ini membangun sisi AI Engineering-nya: Stable Diffusion hands-on, latent diffusion, ControlNet, LoRA gaya, ComfyUI sebagai orkestrasi visual, dan evaluasi produksi — dengan lab yang menghitung jadwal noise dan rasio kompresi latent.",
      },
      reference: "Alpha-bar t=10: 0,9981; t=100: 0,897; t=1000: 0,00004. Latent 32.768 byte vs gambar 786.432 byte (24x).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan generasi citra sebagai pipeline produksi — bukan sebagai demo.",
        "(1) Menghitung alpha-bar dari jadwal beta linear;",
        "(2) Menghitung penghematan latent space vs piksel;",
        "(3) Menjelaskan peran ControlNet dan LoRA dalam konsistensi;",
        "(4) Merancang workflow ComfyUI (node, seed, batch);",
        "(5) Merancang evaluasi: review sampel + deteksi cacat.",
      ],
      tasks: [],
    },
    {
      id: "difusi-angka",
      eyebrow: "Langkah 3 · Teori",
      title: "Diffusion dalam angka: dari noise ke gambar, selangkah demi selangkah",
      prose: [
        "Forward diffusion menambahkan noise sedikit demi sedikit: tiap langkah t, x_t = akar(alpha-bar_t) x x_0 + akar(1 - alpha-bar_t) x noise, dengan alpha-bar_t = produk (1 - beta_i) dari i=1 sampai t. Jadwal beta linear dari 0,0001 ke 0,02 selama T=1.000 langkah. Hitung: alpha-bar_10 = 0,9981 (gambar masih 99,8 persen utuh); alpha-bar_100 = 0,897; alpha-bar_1000 = 0,00004 — praktis noise murni. Reverse diffusion membalik prosesnya: model memprediksi noise yang ditambahkan, menguranginya sedikit, dan mengulang 1.000 langkah (atau 20-50 langkah dengan sampler cepat seperti DPM++).",
        "Latent diffusion (Stable Diffusion) tidak bekerja di piksel — ia bekerja di latent space VAE: gambar 512x512x3 = 786.432 byte dikompresi menjadi latent 64x64x4 float16 = 32.768 byte — 24x lebih kecil dalam UKURAN data. Diffusion berjalan di latent yang kecil ini, lalu VAE decoder mengubahnya kembali menjadi gambar. Itulah mengapa Stable Diffusion bisa jalan di GPU konsumen: ruang kerjanya jauh lebih kecil. Tetapi 24x adalah rasio byte, bukan rasio FLOP/waktu/biaya yang terukur — komputasi riil juga bergantung pada arsitektur UNet, jumlah langkah sampler, dan overhead encode/decode VAE. 'Komputasi 24x lebih ringan' sebagai klaim butuh pengukuran FLOP, bukan hanya rasio byte.",
        "Sampler dan langkah: 50 langkah DPM++ memberi kualitas yang hampir sama dengan 1.000 langkah DDPM — dengan 20x lebih sedikit komputasi. CFG scale (classifier-free guidance) mengatur seberapa kuat prompt diikuti: 7-8 untuk keseimbangan; di atas 12, gambar menjadi jenuh dan artefak; di bawah 5, prompt diabaikan. Tiga angka ini — langkah, CFG, seed — adalah 'resep' tiap gambar; catat ketiganya di metadata, karena gambar tanpa resep tidak bisa direproduksi.",
      ],
      tasks: [],
      formula: "x_t = \\sqrt{\\bar{\\alpha}_t}\\, x_0 + \\sqrt{1 - \\bar{\\alpha}_t}\\, \\epsilon, \\qquad \\bar{\\alpha}_t = \\prod_{i=1}^{t} (1 - \\beta_i)",
      formulaNote: "beta = jadwal noise (0,0001 ke 0,02); alpha-bar = sinyal yang tersisa di langkah t; epsilon = noise Gaussian.",
      note: {
        title: "Seed adalah reproduksibilitas",
        body: "Seed yang sama + prompt yang sama + resep yang sama = gambar yang sama. Seed yang berbeda = variasi. Untuk katalog produk, KUNCI seed per produk (konsistensi antar latar); untuk eksplorasi, acak seed (variasi). Gambar yang tidak bisa direproduksi adalah gambar yang tidak bisa diperbaiki saat cacat.",
      },
      reference: "Alpha-bar 0,9981 (t=10); 0,897 (t=100); 0,00004 (t=1000). Latent 24x lebih kecil.",
    },
    {
      id: "kontrol",
      eyebrow: "Langkah 4 · Teori",
      title: "Kontrol: ControlNet, LoRA, dan ComfyUI",
      prose: [
        "Prompt teks saja tidak cukup untuk produk: 'tas kulit cokelat' bisa menghasilkan 100 tas yang berbeda bentuk. ControlNet menambahkan kontrol spasial: beri gambar referensi (tepi/Canny, pose, depth) dan model CENDERUNG KUAT mengikuti strukturnya — bentuk tas umumnya dipertahankan, latar yang berubah. Tetapi itu kondisi, bukan jaminan identitas produk: bentuk bisa tetap bergeser, detail kecil (logo, jahitan, tekstur) bisa berubah — verifikasi dengan review manusia, bukan asumsi. LoRA menambahkan konsistensi GAYA: latih adapter kecil (puluhan MB) pada 20-30 gambar referensi gaya brand, lalu pakai di semua generasi — semua gambar berbicara dalam 'bahasa visual' yang sama.",
        "Untuk produk yang piksel aslinya HARUS utuh (logo, label, tekstur kulit), ControlNet saja tidak cukup: pakai inpainting dengan masking — kunci piksel produk dengan mask, generate HANYA latar di luar mask, lalu komposit. Dengan begitu piksel produk adalah foto asli, bukan hasil generate — dan cacat seperti 'logo miring' tidak mungkin terjadi pada area yang di-mask. Masking adalah mekanisme yang menjamin, ControlNet adalah mekanisme yang mengarahkan; untuk aset hero, pakai yang menjamin.",
        "ComfyUI adalah orkestrasi visual: workflow sebagai graph node (load model → ControlNet → sampler → VAE decode → save). Keuntungannya: workflow tersimpan sebagai JSON yang bisa di-versioning, dibagikan, dan dijalankan batch (500 produk x 10 latar = 5.000 job dari satu workflow). Kekurangannya: kurva belajar — node dan koneksi membingungkan di minggu pertama. Alternatif: AUTOMATIC1111 (UI sederhana) untuk eksplorasi, ComfyUI untuk produksi.",
        "Evaluasi produksi: review manusia atas sampel — 200 dari 5.000 (4 persen) diperiksa untuk cacat (anatomi, logo, teks gibberish). Review menemukan 6 cacat dari 200 sampel — tingkat cacat 3 persen sebagai ESTIMASI populasi: sekitar 150 dari 5.000 gambar diperkirakan cacat dan harus di-generate ulang. Karena sampelnya hanya 200, estimasi ini punya rentang kasar (simpangan baku ~1,2 poin → 3 persen ± 2,4 poin, alias 30–270 gambar) — anggarkan regenerate dengan rentang itu, bukan angka pasti 150. Deteksi otomatis membantu: CLIP score untuk kesesuaian prompt, detektor NSFW untuk keamanan, dan perbandingan embedding untuk konsistensi gaya. Tetapi tidak ada metrik otomatis yang menangkap 'logo miring 5 derajat' — mata manusia masih diperlukan.",
      ],
      tasks: [],
      note: {
        title: "Hak cipta dan persetujuan",
        body: "Jangan latih LoRA pada karya seniman hidup tanpa izin untuk produk komersial, dan jangan generate gambar yang meniru merek terdaftar. Catat sumber data training LoRA dan lisensinya. Gambar AI untuk produk komersial butuh jejak provenance yang sama seperti foto stok — bedanya, jejaknya kamu yang harus menulisnya.",
      },
      reference: "ControlNet = struktur; LoRA = gaya; ComfyUI = workflow berversi; review 4 persen sampel.",
    },
    {
      id: "lab-diffusion",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: jadwal noise dan kompresi latent",
      prose: [
        "Lab ini menghitung mesin diffusion dari angka mentah: alpha-bar pada tiga langkah dan rasio kompresi latent space.",
        "Hitung dulu di kepala. Jadwal beta linear 0,0001 ke 0,02, T=1.000: alpha-bar_10 = 0,9981; alpha-bar_100 = 0,897; alpha-bar_1000 = 0,00004. Gambar 512x512x3 = 786.432 byte; latent 64x64x4 float16 = 32.768 byte; rasio = 786.432 / 32.768 = 24,0x.",
        "Tugas lab: hitung empat angka dan cetak masing-masing di baris sendiri: abar10, abar100, latent_byte, rasio. Empat angka ini adalah pemeriksaan bahwa kamu memahami mengapa diffusion di latent jauh lebih murah daripada di piksel.",
        "Setelah lolos, coba eksperimen: ubah beta akhir menjadi 0,01 dan lihat alpha-bar_1000 naik — lalu tanyakan: apa yang terjadi bila noise akhir tidak cukup menghancurkan sinyal?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `abar10` dan `abar100` dari jadwal beta linear" },
        { id: "t2", text: "Hitung `latent_byte` dan `rasio` kompresi latent vs piksel" },
      ],
      expected: "abar10=0.9981\nabar100=0.897\nlatent_byte=32768\nrasio=24.0",
      hints: [
        "Beta_i = 0,0001 + (0,02-0,0001) x i/999; alpha-bar = produk (1-beta).",
        "Bulatkan alpha-bar ke 4 desimal (abar100 ke 3 desimal tampil 0,897).",
        "Latent byte = 64 x 64 x 4 x 2 (float16).",
        "Rasio = byte gambar / byte latent.",
      ],
      code: {
        starter: `# Mesin diffusion: jadwal noise + kompresi latent.\nbeta_awal, beta_akhir, T = 0.0001, 0.02, 1000\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nabar10 = \nabar100 = \nlatent_byte = \nrasio = \n\nprint(f"abar10={round(abar10, 4)}")\nprint(f"abar100={round(abar100, 4)}")\nprint(f"latent_byte={latent_byte}")\nprint(f"rasio={rasio}")`,
        lockLines: 1,
        solution: `# Mesin diffusion: jadwal noise + kompresi latent.\nbeta_awal, beta_akhir, T = 0.0001, 0.02, 1000\n\n\ndef alpha_bar(t):\n    hasil = 1.0\n    for i in range(t):\n        beta = beta_awal + (beta_akhir - beta_awal) * i / (T - 1)\n        hasil *= (1 - beta)\n    return hasil\n\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nabar10 = alpha_bar(10)\nabar100 = alpha_bar(100)\nlatent_byte = 64 * 64 * 4 * 2\nrasio = 512 * 512 * 3 / latent_byte\n\nprint(f"abar10={round(abar10, 4)}")\nprint(f"abar100={round(abar100, 4)}")\nprint(f"latent_byte={latent_byte}")\nprint(f"rasio={rasio}")`,
        checks: [
          { kind: "equal", task: "t1", name: "abar10", value: 0.9981, tol: 0.0001, label: "`abar10` seharusnya 0.9981", msg: "Produk (1-beta) 10 langkah pertama = 0,9981." },
          { kind: "equal", task: "t1", name: "abar100", value: 0.897, tol: 0.001, label: "`abar100` seharusnya 0.897", msg: "Produk 100 langkah pertama = 0,897." },
          { kind: "equal", task: "t2", name: "latent_byte", value: 32768, tol: 1e-9, label: "`latent_byte` seharusnya 32768", msg: "64x64x4x2 = 32.768 byte." },
          { kind: "equal", task: "t2", name: "rasio", value: 24.0, tol: 1e-9, label: "`rasio` seharusnya 24.0", msg: "786.432/32.768 = 24,0x." },
        ],
      },
      reference: "Alpha-bar 0,9981 dan 0,897; latent 32.768 byte; rasio 24,0x.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: kapan diffusion, kapan foto asli",
      prose: [
        "Skenario 1 — Butuh banyak variasi latar untuk produk yang sama. → Diffusion + ControlNet. Alasan: foto asli memberi struktur; diffusion memberi latar.",
        "Skenario 2 — Produk hero, gambar utama toko. → Foto asli profesional. Alasan: gambar hero adalah wajah brand; cacat 3 persen tidak bisa diterima di sana.",
        "Skenario 3 — Gaya brand konsisten di ribuan gambar. → LoRA gaya + ComfyUI batch. Alasan: konsistensi yang tidak bisa dicapai fotografer berbeda-beda.",
        "Skenario 4 — Gambar mengandung teks (label, harga, promo). → Jangan diffusion — teks hasil diffusion sering gibberish. Alasan: tambahkan teks dengan desain grafis setelah generasi, bukan di dalam generasi.",
        "Skenario 5 — Butuh gambar orang (model produk). → Hati-hati: anatomi cacat 3 persen + isu persetujuan wajah. Alasan: review manusia wajib; pertimbangkan foto asli untuk orang.",
        "Aturan praktis: diffusion untuk variasi dan volume; foto asli untuk hero dan manusia; teks selalu ditambahkan setelahnya, bukan digenerate.",
      ],
      tasks: [],
      note: {
        title: "Biaya yang sering dilupakan",
        body: "Biaya diffusion bukan hanya GPU: review manusia 200 sampel, regenerate ~150 cacat (estimasi, rentang kasar 30–270), storage 5.000 gambar, dan waktu engineer membangun workflow. Hitung semuanya sebelum membandingkan dengan Rp400 juta fotografer — diffusion tetap menang di kasus ini, tetapi marginnya lebih kecil dari yang terlihat di demo.",
      },
      reference: "Diffusion untuk variasi/volume; foto asli untuk hero/manusia; teks setelah generasi.",
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
        "Alpha-bar: 0,9981 (t=10); 0,897 (t=100); 0,00004 (t=1000).",
        "Latent 32.768 byte vs gambar 786.432 byte — 24x lebih kecil.",
        "ControlNet = struktur; LoRA = gaya; ComfyUI = workflow berversi.",
        "CFG 7-8 seimbang; di atas 12 artefak; di bawah 5 prompt diabaikan.",
        "Review 4 persen sampel (200); 6 cacat teramati (3 persen) — estimasi ~150 dari 5.000 di-generate ulang.",
      ],
      next: { label: "AIE25 — Katalog Pola Prompt: 16 Pola Vanderbilt", href: "/v2/learn/aie25-katalog-pola-prompt" },
      quiz: [
        {
          q: "Alpha-bar_10 = 0,9981 dan alpha-bar_1000 = 0,00004. Apa artinya?",
          options: [
            { text: "Di langkah 10 gambar masih 99,8 persen utuh; di langkah 1000 praktis noise murni", why: "Tepat: alpha-bar adalah sinyal yang tersisa.", correct: true },
            { text: "Di langkah 10 gambar sudah hancur", why: "Salah: 0,9981 berarti hampir utuh; kehancuran terjadi di ratusan langkah." },
            { text: "Alpha-bar naik seiring langkah", why: "Salah: alpha-bar TURUN — noise bertambah, sinyal berkurang." },
            { text: "Alpha-bar tidak memengaruhi reverse diffusion", why: "Salah: reverse membalik proses yang didefinisikan alpha-bar." },
          ],
        },
        {
          q: "Mengapa Stable Diffusion bekerja di latent, bukan piksel?",
          options: [
            { text: "Karena latent 24x lebih kecil dalam byte — diffusion berjalan di ruang yang jauh lebih kecil", why: "Tepat: 786.432 byte menjadi 32.768 byte. Itu rasio ukuran data — penghematan komputasi riil juga besar tetapi tidak sama persis dengan 24x; ia bergantung arsitektur dan langkah sampler.", correct: true },
            { text: "Karena piksel tidak bisa di-diffusion", why: "Salah: diffusion piksel bisa (DLE11) — hanya mahal." },
            { text: "Karena latent memberi kualitas lebih tinggi", why: "Salah: latent memberi efisiensi; kualitas datang dari model dan data." },
            { text: "Karena VAE menghapus noise", why: "Salah: VAE mengompresi; noise dihapus oleh reverse diffusion." },
          ],
        },
        {
          q: "Produk harus sama bentuknya di 10 latar berbeda. Alat apa?",
          options: [
            { text: "Prompt teks saja", why: "Salah: prompt tidak mengunci bentuk; 10 latar memberi 10 bentuk berbeda." },
            { text: "ControlNet (struktur) + seed terkunci", why: "Tepat: ControlNet memaksa struktur; seed menjaga konsistensi.", correct: true },
            { text: "LoRA gaya saja", why: "Salah: LoRA mengunci GAYA, bukan bentuk." },
            { text: "CFG scale 15", why: "Salah: CFG tinggi justru menimbulkan artefak; ia tidak mengunci bentuk." },
          ],
        },
        {
          q: "Gambar mengandung teks harga promo. Apa yang benar?",
          options: [
            { text: "Generate teks bersama gambar — diffusion sudah bagus untuk teks", why: "Salah: teks hasil diffusion sering gibberish; tambahkan dengan desain grafis setelahnya." },
            { text: "Tambahkan teks setelah generasi dengan desain grafis", why: "Tepat: teks adalah pekerjaan desain, bukan generasi.", correct: true },
            { text: "Naikkan CFG agar teks lebih akurat", why: "Salah: CFG tinggi tidak memperbaiki ejaan; ia memperparah artefak." },
            { text: "Pakai lebih banyak langkah sampler", why: "Salah: langkah tambahan tidak mengajari model mengeja." },
          ],
        },
        {
          q: "5.000 gambar, review 200 sampel menemukan 6 cacat (3 persen). Berapa yang harus di-generate ulang?",
          options: [
            { text: "Sekitar 150 gambar (estimasi — 6 cacat teramati dari 200 sampel)", why: "Tepat: 3 persen adalah estimasi tingkat cacat dari sampel; diterapkan ke 5.000 memberi ~150 — dengan rentang ketidakpastian karena sampel hanya 200.", correct: true },
            { text: "200 gambar — semua yang di-review", why: "Salah: yang di-review bukan yang cacat; cacatnya 3 persen dari total." },
            { text: "6 gambar — 3 persen dari 200", why: "Salah: 6 adalah jumlah cacat yang TERAMATI di sampel — estimasi untuk populasi adalah ~150, bukan 6." },
            { text: "0 — 3 persen bisa diterima", why: "Salah: ~150 gambar cacat di katalog adalah ~150 pelanggan yang melihat produk rusak." },
          ],
        },
      ],
    },
  ],
};
