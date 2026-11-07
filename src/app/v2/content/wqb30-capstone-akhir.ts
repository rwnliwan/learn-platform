import type { V2Lesson } from "../lib/types";

export const wqb30: V2Lesson = {
  slug: "wqb30-capstone-akhir",
  track: "WorldQuant Brain",
  module: "Capstone",
  title: "WQB30 — Capstone Akhir: Dari Submit ke Portofolio Produksi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Delapan kandidat, satu portofolio, nol alasan setengah-setengah",
      prose: [
        "Capstone tengah (WQB21) mengajarimu memutuskan satu paket wave: submit, tahan, buang. Sejak itu kamu belajar delapan hal baru: margin dan kapasitas (WQB22), vector data fields (WQB23), lima tes submit — termasuk weight test (diet bobot) — dan tab OS (WQB24), tipe submit ATOM, pyramid, dan power pool (WQB25), prototyping Python (WQB26), validasi ML (WQB27), konstruksi portofolio (WQB28), dan SuperAlpha (WQB29).",
        "Malam ini meja review-nya berbeda. Delapan kandidat di depanmu bukan sekadar angka Sharpe dan fitness — masing-masing membawa bobot maksimum, margin, rasio decay OS, dan tipe submit. Keputusanmu bukan lagi 'lolos atau buang', melainkan 'lolos sebagai APA, dan bersama SIAPA di portofolio'. Kandidat yang sama bisa menjadi submit reguler yang bagus, ATOM yang brilian, atau komponen SuperAlpha yang merusak — tergantung konteksnya.",
        "Capstone akhir ini mengintegrasikan semuanya: gerbang WQB11, diet bobot WQB24, kasir margin WQB22, penjaga OS WQB24, arsitektur submit WQB25, dan seleksi blend WQB28–29. Setelah lesson ini kamu bisa: (1) menjalankan vonis akhir yang menggabungkan semua gerbang; (2) memilih tipe submit per kandidat; (3) merakit blend SuperAlpha dari yang lolos; (4) menulis satu kalimat alasan per keputusan yang menyebut gerbang yang memutuskannya.",
      ],
      tasks: [],
      note: {
        title: "Capstone tengah vs capstone akhir",
        body: "WQB21 (capstone tengah, review wave) memakai 4 saringan atas materi WQB11–19. Capstone ini memakai SEMUA gerbang WQB11–29 — termasuk margin, OS/decay, dan tipe submit yang belum ada saat WQB21 ditulis. Bila vonismu di sini berbeda dari vonis WQB21 untuk kandidat yang sama, itu bukan inkonsistensi — itu informasi baru yang bekerja.",
      },
      reference: "Vonis akhir = gerbang + bobot + margin + OS + tipe submit + blend. Satu kalimat alasan per keputusan.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menutup satu siklus riset penuh — dari kandidat mentah sampai portofolio produksi.",
        "(1) Menerapkan urutan vonis: gerbang dasar, bobot, self-correlation, margin, decay OS, baru tipe submit;",
        "(2) Membedakan SUBMIT-ATOM, SUBMIT-PYRAMID, SUBMIT-POWERPOOL, dan SUBMIT-REGULER;",
        "(3) Menahan kandidat yang lolos gerbang tetapi mati di kasir (margin) atau di OS (decay);",
        "(4) Merakit blend SuperAlpha dari kandidat yang lolos dengan seleksi greedy berkorelasi rendah.",
      ],
      tasks: [],
    },
    {
      id: "paket",
      eyebrow: "Langkah 3 · Data",
      title: "Paket 8 kandidat akhir",
      prose: [
        "Delapan kandidat, masing-masing dengan Sharpe (S), fitness (F), turnover (TO), bobot maksimum (w), self-correlation (sc), Sharpe alpha berkorelasi tertinggi (sc_sharpe), margin dalam basis poin (m), rasio decay OS/IS (os), dan tipe submit yang diusulkan:",
        "C1: S 2,4 · F 1,8 · TO 0,25 · w 0,06 · sc 0,40 · m 8 · os 0,94 · REGULER. C2: S 2,9 · F 2,2 · TO 0,20 · w 0,30 · sc 0,30 · m 9 · os 0,90 · REGULER. C3: S 1,1 · F 0,9 · TO 0,30 · w 0,05 · sc 0,20 · m 6 · os 0,80 · REGULER. C4: S 2,1 · F 1,7 · TO 0,30 · w 0,07 · sc 0,85 (sc_sharpe 2,0) · m 7 · os 0,85 · REGULER.",
        "C5: S 2,6 · F 2,0 · TO 0,22 · w 0,05 · sc 0,50 · m 1 · os 0,88 · REGULER. C6: S 2,2 · F 1,9 · TO 0,28 · w 0,06 · sc 0,50 · m 7 · os 0,22 · REGULER. C7: S 3,0 · F 2,5 · TO 0,15 · w 0,04 · sc 0,30 · m 10 · os 0,90 · ATOM. C8: S 2,0 · F 1,6 · TO 0,35 · w 0,08 · sc 0,45 · m 6 · os 0,80 · POWERPOOL.",
        "Baca paket ini seperti meja review: jangan mulai dari Sharpe tertinggi. Mulai dari gerbang yang menggugurkan — satu merah berarti buang, apa pun angka lainnya.",
      ],
      tasks: [],
      note: {
        title: "Membaca margin dan os",
        body: "Margin (m) dalam basis poin: di bawah 2 bp berarti biaya hampir memakan seluruh edge — kandidat ditahan untuk diet biaya (WQB22), bukan dibuang. Rasio os di bawah 0,5 berarti performa live kurang dari separuh janji in-sample — kandidat ditahan untuk diagnosis decay (WQB24), bukan dipoles dan disubmit ulang.",
      },
      reference: "Urutan baca: gerbang → bobot → self-corr → margin → OS → tipe submit.",
    },
    {
      id: "lab-vonis",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: mesin vonis akhir",
      prose: [
        "Tulis fungsi vonis_akhir(k) yang mengembalikan satu label, mengikuti urutan ini: (1) S di bawah 1,25 atau F di bawah 1,0 → BUANG. (2) Bobot maksimum di atas 0,10 → BUANG. (3) Self-correlation 0,7 atau lebih DAN Sharpe di bawah 1,1 kali sc_sharpe → BUANG (bila Sharpe-nya 10 persen lebih tinggi dari yang berkorelasi, ia lolos dari gerbang ini). (4) Margin di bawah 2 bp → TAHAN-MARGIN. (5) Rasio OS di bawah 0,5 → TAHAN-OS. (6) Selain itu, kembalikan tipe submitnya: SUBMIT-ATOM, SUBMIT-PYRAMID, SUBMIT-POWERPOOL, atau SUBMIT-REGULER.",
        "Jalankan pada 8 kandidat dan cocokkan dengan hasil yang diharapkan. Perhatikan C4: self-correlation 0,85 tetapi vonisnya ditentukan oleh perbandingan Sharpe — 1,1 kali 2,0 adalah 2,2, dan 2,1 di bawah itu, jadi BUANG. Perhatikan C5: semua gerbang lolos, tetapi margin 1 bp — ditahan, bukan dibuang; diet biaya bisa menyelamatkannya. Perhatikan C6: semua gerbang lolos, tetapi os 0,22 — ditahan untuk diagnosis decay.",
        "Eksperimen setelah selesai: naikkan margin C5 menjadi 5 bp — vonis apa yang kini keluar? Lalu naikkan os C6 menjadi 0,7 — dan perhatikan bahwa dua kandidat 'tahan' itu butuh dua perbaikan yang sama sekali berbeda (biaya vs sinyal).",
      ],
      tasks: [
        { id: "t1", text: "Tulis `vonis_akhir` dengan urutan gerbang → bobot → self-corr → margin → OS → tipe" },
        { id: "t2", text: "Jalankan pada 8 kandidat dan cetak vonisnya" },
      ],
      expected: "C1: SUBMIT-REGULER\nC2: BUANG\nC3: BUANG\nC4: BUANG\nC5: TAHAN-MARGIN\nC6: TAHAN-OS\nC7: SUBMIT-ATOM\nC8: SUBMIT-POWERPOOL",
      note: {
        title: "Intuisi",
        body: "Urutan itu penting: C2 (Sharpe 2,9) dibuang oleh bobot sebelum sempat dinilai margin-nya; C4 dibuang oleh self-corr sebelum sempat dinilai OS-nya. Vonis yang benar menyebut gerbang PERTAMA yang gagal — itulah yang diperbaiki dulu.",
      },
      hints: [
        "Self-corr lolos bila sharpe >= 1.1 * sc_sharpe — C4: 2,1 < 2,2, jadi gagal.",
        "Margin dan OS menghasilkan TAHAN, bukan BUANG — bedakan keduanya di label.",
        "Tipe submit hanya dibaca bila semua gerbang sebelumnya lolos.",
      ],
      code: {
        starter: `# Paket 8 kandidat. JANGAN UBAH.\nkandidat = [\n    {"id": "C1", "s": 2.4, "f": 1.8, "w": 0.06, "sc": 0.40, "sc_s": 0.0, "m": 8, "os": 0.94, "tipe": "REGULER"},\n    {"id": "C2", "s": 2.9, "f": 2.2, "w": 0.30, "sc": 0.30, "sc_s": 0.0, "m": 9, "os": 0.90, "tipe": "REGULER"},\n    {"id": "C3", "s": 1.1, "f": 0.9, "w": 0.05, "sc": 0.20, "sc_s": 0.0, "m": 6, "os": 0.80, "tipe": "REGULER"},\n    {"id": "C4", "s": 2.1, "f": 1.7, "w": 0.07, "sc": 0.85, "sc_s": 2.0, "m": 7, "os": 0.85, "tipe": "REGULER"},\n    {"id": "C5", "s": 2.6, "f": 2.0, "w": 0.05, "sc": 0.50, "sc_s": 0.0, "m": 1, "os": 0.88, "tipe": "REGULER"},\n    {"id": "C6", "s": 2.2, "f": 1.9, "w": 0.06, "sc": 0.50, "sc_s": 0.0, "m": 7, "os": 0.22, "tipe": "REGULER"},\n    {"id": "C7", "s": 3.0, "f": 2.5, "w": 0.04, "sc": 0.30, "sc_s": 0.0, "m": 10, "os": 0.90, "tipe": "ATOM"},\n    {"id": "C8", "s": 2.0, "f": 1.6, "w": 0.08, "sc": 0.45, "sc_s": 0.0, "m": 6, "os": 0.80, "tipe": "POWERPOOL"},\n]\n\n# TULIS KODEMU\ndef vonis_akhir(k):\n    return "?"\n\nfor k in kandidat:\n    print(f"{k['id']}: {vonis_akhir(k)}")`,
        lockLines: 10,
        solution: `# Paket 8 kandidat. JANGAN UBAH.\nkandidat = [\n    {"id": "C1", "s": 2.4, "f": 1.8, "w": 0.06, "sc": 0.40, "sc_s": 0.0, "m": 8, "os": 0.94, "tipe": "REGULER"},\n    {"id": "C2", "s": 2.9, "f": 2.2, "w": 0.30, "sc": 0.30, "sc_s": 0.0, "m": 9, "os": 0.90, "tipe": "REGULER"},\n    {"id": "C3", "s": 1.1, "f": 0.9, "w": 0.05, "sc": 0.20, "sc_s": 0.0, "m": 6, "os": 0.80, "tipe": "REGULER"},\n    {"id": "C4", "s": 2.1, "f": 1.7, "w": 0.07, "sc": 0.85, "sc_s": 2.0, "m": 7, "os": 0.85, "tipe": "REGULER"},\n    {"id": "C5", "s": 2.6, "f": 2.0, "w": 0.05, "sc": 0.50, "sc_s": 0.0, "m": 1, "os": 0.88, "tipe": "REGULER"},\n    {"id": "C6", "s": 2.2, "f": 1.9, "w": 0.06, "sc": 0.50, "sc_s": 0.0, "m": 7, "os": 0.22, "tipe": "REGULER"},\n    {"id": "C7", "s": 3.0, "f": 2.5, "w": 0.04, "sc": 0.30, "sc_s": 0.0, "m": 10, "os": 0.90, "tipe": "ATOM"},\n    {"id": "C8", "s": 2.0, "f": 1.6, "w": 0.08, "sc": 0.45, "sc_s": 0.0, "m": 6, "os": 0.80, "tipe": "POWERPOOL"},\n]\n\ndef vonis_akhir(k):\n    if k["s"] < 1.25 or k["f"] < 1.0:\n        return "BUANG"\n    if k["w"] > 0.10:\n        return "BUANG"\n    if k["sc"] >= 0.7 and k["s"] < 1.1 * k["sc_s"]:\n        return "BUANG"\n    if k["m"] < 2:\n        return "TAHAN-MARGIN"\n    if k["os"] < 0.5:\n        return "TAHAN-OS"\n    return "SUBMIT-" + k["tipe"]\n\nfor k in kandidat:\n    print(f"{k['id']}: {vonis_akhir(k)}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "C1: SUBMIT-REGULER", label: "C1 submit reguler", msg: "Semua gerbang lolos, tipe REGULER." },
          { kind: "stdout_matches", task: "t2", pattern: "C2: BUANG", label: "C2 buang (bobot)", msg: "Bobot 0,30 melebihi 0,10 — Sharpe 2,9 tidak menyelamatkannya." },
          { kind: "stdout_matches", task: "t2", pattern: "C3: BUANG", label: "C3 buang (gerbang)", msg: "Sharpe 1,1 dan fitness 0,9 di bawah gerbang dasar." },
          { kind: "stdout_matches", task: "t2", pattern: "C4: BUANG", label: "C4 buang (self-corr)", msg: "2,1 di bawah 1,1 x 2,0 = 2,2 — tidak cukup melampaui yang berkorelasi." },
          { kind: "stdout_matches", task: "t2", pattern: "C5: TAHAN-MARGIN", label: "C5 tahan (margin)", msg: "Margin 1 bp di bawah 2 bp — diet biaya, bukan buang." },
          { kind: "stdout_matches", task: "t2", pattern: "C6: TAHAN-OS", label: "C6 tahan (OS)", msg: "Rasio OS 0,22 di bawah 0,5 — diagnosis decay dulu." },
          { kind: "stdout_matches", task: "t2", pattern: "C7: SUBMIT-ATOM", label: "C7 submit ATOM", msg: "Semua gerbang lolos, tipe ATOM." },
          { kind: "stdout_matches", task: "t2", pattern: "C8: SUBMIT-POWERPOOL", label: "C8 submit Power Pool", msg: "Semua gerbang lolos, tipe POWERPOOL." },
        ],
      },
      reference: "Vonis menyebut gerbang pertama yang gagal — itulah yang diperbaiki dulu.",
    },
    {
      id: "blend",
      eyebrow: "Langkah 5 · Konsep",
      title: "Dari yang lolos ke SuperAlpha: blend yang tidak merusak",
      prose: [
        "Tiga kandidat lolos: C1 (REGULER), C7 (ATOM), C8 (POWERPOOL). Mengirim ketiganya sebagai submit individual adalah jawaban yang benar — tetapi belum lengkap. Pertanyaan SuperAlpha (WQB29): apakah ketiganya layak digabung menjadi satu sinyal?",
        "Korelasi antar ketiganya: C1-C7 0,20; C1-C8 0,30; C7-C8 0,85. Seleksi greedy dari Sharpe tertinggi: terima C7 (3,0); terima C1 (2,4 — korelasi 0,20 ke C7, di bawah 0,7); tolak C8 (2,0 — korelasi 0,85 ke C7, di atas 0,7). Blend akhir: C7 + C1. C8 tetap submit individual yang sah — yang dibuang hanya redundansinya di dalam blend, bukan alpha-nya.",
        "Pelajaran penutup: keputusan submit menjawab 'mana yang layak hidup sendiri'; keputusan blend menjawab 'mana yang layak hidup bersama'. Keduanya memakai ambang yang sama (0,7) untuk pertanyaan yang berbeda — yang pertama soal keunikan terhadap bank, yang kedua soal keunikan terhadap sesama komponen.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "C8 yang ditolak dari blend bukan C8 yang gagal — ia lolos semua gerbang dan disubmit sebagai Power Pool. Mencampur 'tidak masuk blend' dengan 'tidak layak submit' adalah kesalahan yang membuat tim membuang alpha bagus.",
      },
      reference: "Blend: C7 + C1. C8 tetap submit individual — yang dibuang hanya redundansinya.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: kandidat yang lolos semua tes tetapi mati di kasir",
      prose: [
        "Kandidat C5 di paketmu: Sharpe 2,6, fitness 2,0, bobot 0,05, self-correlation 0,50, OS 0,88 — lolos semua gerbang submit. Tetapi marginnya 1 bp. Seorang analis berkata: 'submit saja, margin kan cuma angka kecil'.",
        "Pertanyaan: kenapa vonis yang benar adalah TAHAN-MARGIN, dan apa dua perbaikan yang bisa menyelamatkannya?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Margin 1 bp berarti edge tersisa setelah biaya hampir nol — di live, biaya eksekusi dan slippage akan memakannya habis sebelum alpha sempat berkontribusi (WQB22: kasir). Dua perbaikan: (1) diet turnover — naikkan decay atau tambah filter agar posisi lebih jarang berganti; (2) naikkan truncation agar bobot kecil yang mahal ditransaksikan dibuang. Bila setelah diet margin naik ke atas 2 bp dan gerbang lain tetap lolos, C5 berubah dari TAHAN menjadi SUBMIT — tanpa mengubah sinyalnya sama sekali.",
      },
      reference: "TAHAN bukan BUANG: margin bisa diperbaiki tanpa mengganti sinyal.",
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
        "Vonis akhir berurutan: gerbang dasar → bobot → self-corr → margin → OS → tipe submit.",
        "Paket akhir: C1 SUBMIT-REGULER, C2/C3/C4 BUANG, C5 TAHAN-MARGIN, C6 TAHAN-OS, C7 SUBMIT-ATOM, C8 SUBMIT-POWERPOOL.",
        "TAHAN bukan BUANG: margin dan decay bisa diperbaiki tanpa mengganti sinyal.",
        "Blend SuperAlpha dari yang lolos: C7 + C1; C8 ditolak dari blend (korelasi 0,85 ke C7) tetapi tetap submit individual.",
        "Capstone tengah (WQB21) memakai materi WQB11–19; capstone akhir ini memakai WQB11–29.",
      ],
      next: { label: "WQB31 — Operator Lanjutan FASTEXPR: Winsorize, Rank & Keluarga Vec", href: "/learn/wqb31-operator-lanjutan" },
      quiz: [
        {
          q: "C2 punya Sharpe 2,9 dan fitness 2,2 — tertinggi kedua di paket. Kenapa vonisnya BUANG?",
          options: [
            { text: "Karena turnover-nya 0,20 terlalu rendah", why: "Salah: turnover 0,20 berada di dalam rentang 1–70 persen. Bukan itu penyebabnya." },
            { text: "Karena satu saham memegang bobot 0,30 — gagal weight test (maks 0,10)", why: "Tepat: bobot 30 persen gagal di tes pertama setelah gerbang dasar. Sharpe tidak menyelamatkan konstruksi.", correct: true },
            { text: "Karena self-correlation-nya 0,30", why: "Salah: 0,30 jauh di bawah ambang 0,7 — itu nilai yang bagus." },
            { text: "Karena marginnya 9 bp terlalu tinggi", why: "Salah: margin tinggi berarti edge besar setelah biaya — itu kabar baik, bukan masalah." },
          ],
        },
        {
          q: "C4: self-correlation 0,85, Sharpe 2,1, alpha berkorelasi tertinggi Sharpe 2,0. Vonis?",
          options: [
            { text: "Lolos, karena Sharpe 2,1 lebih tinggi dari 2,0", why: "Salah: aturannya bukan 'lebih tinggi', melainkan '10 persen lebih tinggi'. 2,1 hanya 5 persen di atas 2,0." },
            { text: "BUANG — 2,1 di bawah 1,1 kali 2,0 = 2,2", why: "Tepat: 1,1 x 2,0 = 2,2; Sharpe 2,1 tidak memenuhi syarat pelampauan 10 persen.", correct: true },
            { text: "TAHAN-MARGIN", why: "Salah: margin C4 7 bp — tidak ada masalah biaya. Vonis ditentukan self-corr." },
            { text: "SUBMIT-REGULER", why: "Salah: self-corr 0,85 di atas ambang 0,7 dan tidak memenuhi syarat pelampauan." },
          ],
        },
        {
          q: "C5 ditahan karena margin 1 bp. Apa arti TAHAN di sini?",
          options: [
            { text: "C5 dibuang — sinyalnya tidak layak", why: "Salah: sinyalnya lolos semua gerbang kualitas. Yang bermasalah hanya biaya." },
            { text: "C5 menunggu diet biaya (turnover/truncation) — bila margin membaik, ia bisa disubmit tanpa mengubah sinyal", why: "Tepat: TAHAN = bisa diperbaiki; BUANG = tidak bisa. Margin adalah soal konstruksi, bukan soal sinyal.", correct: true },
            { text: "C5 disubmit tetapi tidak akan dibayar", why: "Salah: TAHAN berarti belum disubmit — tidak ada pembayaran untuk alpha yang tidak disubmit." },
            { text: "C5 dipindah ke delay 0", why: "Salah: pindah delay tidak memperbaiki margin — itu jawaban untuk tes delay, bukan untuk kasir." },
          ],
        },
        {
          q: "Blend SuperAlpha dari C1, C7, C8 (korelasi C7-C8 0,85). Mana yang benar?",
          options: [
            { text: "Blend ketiganya — semuanya lolos submit", why: "Salah: lolos submit mengukur individu; blend mengukur gabungan. C7-C8 0,85 berarti redundansi." },
            { text: "Blend C7 + C1; C8 tetap submit individual", why: "Tepat: greedy menolak C8 dari blend karena korelasi 0,85 ke C7 — tetapi C8 tetap alpha yang sah.", correct: true },
            { text: "Blend C8 saja — sisanya dibuang", why: "Salah: tidak ada yang dibuang. C1 dan C7 masuk blend; C8 submit sendiri." },
            { text: "Tidak ada blend — ketiganya berkorelasi tinggi", why: "Salah: C1-C7 hanya 0,20 dan C1-C8 0,30. Hanya pasangan C7-C8 yang bermasalah." },
          ],
        },
        {
          q: "Apa beda capstone tengah (WQB21) dan capstone akhir ini?",
          options: [
            { text: "Tidak ada — keduanya memakai paket dan saringan yang sama", why: "Salah: WQB21 memakai 4 saringan atas materi WQB11–19; capstone ini menambah margin, OS, dan tipe submit." },
            { text: "WQB21 memakai materi WQB11–19; capstone akhir memakai WQB11–29 termasuk margin, OS/decay, dan tipe submit", why: "Tepat: capstone akhir mengintegrasikan sepertiga akhir track yang belum ada saat WQB21 ditulis.", correct: true },
            { text: "WQB21 adalah kuis, capstone akhir adalah lab", why: "Salah: keduanya punya lab, paket kandidat, dan kuis. Bedanya cakupan materi." },
            { text: "Capstone akhir menggantikan WQB21 — WQB21 tidak lagi berlaku", why: "Salah: WQB21 tetap berlaku sebagai review wave tengah; capstone akhir melengkapinya, bukan menggantikannya." },
          ],
        },
      ],
    },
  ],
};
