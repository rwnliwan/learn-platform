import type { V2Lesson } from "../lib/types";

export const aie25: V2Lesson = {
  slug: "aie25-katalog-pola-prompt",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE25 — Katalog Pola Prompt: 21 Pola Vanderbilt",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu tim, 40 gaya prompt — dan tidak ada yang tahu mana yang bekerja",
      prose: [
        "Tim AI NusaBank punya 40 prompt yang ditulis 6 orang berbeda: ada yang memberi contoh, ada yang memberi peran, ada yang memberi format output, ada yang mengulang instruksi tiga kali 'agar model paham'. Tidak ada yang tahu pola mana yang bekerja untuk tugas apa — tiap prompt baru ditulis dari nol, tiap kegagalan diperbaiki dengan menebak. Lalu tim mengadopsi katalog pola prompt Vanderbilt (21 pola): tiap pola punya nama, tujuan, dan contoh. Prompt baru disusun dari pola yang sudah terbukti — bukan dari intuisi tiap penulis.",
        "Hasilnya terukur: tugas ekstraksi dari 72 persen (zero-shot) menjadi 91 persen (few-shot dengan pola yang tepat) — naik 19 poin. Harganya: prompt few-shot 680 token vs zero-shot 80 token; untuk 1.000 query, $1,36 vs $0,16 pada tarif $0,002 per 1.000 token. Pola yang tepat membeli akurasi dengan token — dan katalog membuat keputusan itu eksplisit.",
        "Lesson ini mengajarkan 21 pola Vanderbilt sebagai sistem: lima keluarga pola, kapan tiap pola dipakai, dan berapa biayanya. Setelah lesson ini kamu bisa: (1) menyebutkan lima keluarga pola; (2) memilih pola per tugas; (3) menghitung biaya token pola; (4) menjelaskan kapan few-shot sepadan; (5) menulis prompt dari katalog, bukan dari nol.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "AIE2 mengajarkan prompt engineering dasar (zero-shot, few-shot, struktur) — tetapi tidak ada katalog pola sistematis (0 hit 'Vanderbilt/pola prompt' di track). Lesson ini membangun katalognya: 21 pola Vanderbilt dalam lima keluarga, dengan panduan pemilihan dan hitungan biaya per pola.",
      },
      reference: "Zero-shot 72 persen @ 80 token ($0,16/1.000 query); few-shot 91 persen @ 680 token ($1,36/1.000 query); naik 19 poin.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu menulis prompt dari katalog — seperti engineer memakai design pattern.",
        "(1) Menyebutkan lima keluarga pola Vanderbilt;",
        "(2) Memilih pola yang tepat untuk 5 jenis tugas;",
        "(3) Menghitung biaya token zero-shot vs few-shot;",
        "(4) Menjelaskan kapan contoh tambahan sepadan dengan biayanya;",
        "(5) Menyusun prompt dari 2-3 pola yang digabung.",
      ],
      tasks: [],
    },
    {
      id: "keluarga",
      eyebrow: "Langkah 3 · Teori",
      title: "Lima keluarga: dari persona sampai output",
      prose: [
        "Keluarga 1 — Persona: beri model peran ('Bertindaklah sebagai auditor senior...'). Gunanya: nada, kedalaman, dan sudut pandang yang konsisten. Risiko: persona yang terlalu spesifik membuat model menolak tugas di luar peran. Keluarga 2 — Resep (Recipe): minta langkah berurutan ('Berikan langkah 1-5...'). Gunanya: tugas prosedural yang harus lengkap dan berurutan.",
        "Keluarga 3 — Template: kunci format output ('Jawab dalam tabel dengan kolom X, Y, Z'). Gunanya: output yang bisa di-parse mesin — pola terpenting untuk produksi (AIE6 structured output). Keluarga 4 — Contoh (Few-shot): beri 2-5 contoh input-output sebelum pertanyaan. Gunanya: format dan nuansa yang sulit dijelaskan dengan kata-kata — contoh adalah spesifikasi yang bisa dieksekusi (AIE2).",
        "Keluarga 5 — Meta dan refleksi: minta model memeriksa dirinya ('Periksa jawabanmu sebelum mengirim; sebutkan asumsi yang kamu pakai'). Gunanya: menangkap kesalahan dan asumsi tersembunyi. Ditambah keluarga pendukung: konteks (beri latar yang cukup), permainan (reframing kreatif), dan output kustom. Total 21 pola — tetapi lima keluarga ini menutupi 90 persen kebutuhan produksi.",
      ],
      tasks: [],
      note: {
        title: "Pola bukan mantra",
        body: "Pola bekerja karena ia memberi model informasi yang bisa dipakai — bukan karena kata-katanya ajaib. 'Bertindaklah sebagai ahli' tanpa konteks dan contoh tidak akan menyelamatkan prompt yang tugasnya tidak jelas. Bila pola tidak membantu, masalahnya biasanya definisi tugas — bukan pilihan pola.",
      },
      reference: "21 pola dalam 5 keluarga utama + pendukung.",
    },
    {
      id: "biaya",
      eyebrow: "Langkah 4 · Teori",
      title: "Ekonomi pola: akurasi dibeli dengan token",
      prose: [
        "Hitung biaya nyata. Zero-shot: instruksi 80 token; few-shot: instruksi 80 + 5 contoh x 120 token = 680 token. Pada tarif $0,002 per 1.000 token, 1.000 query: zero-shot = 80.000 token = $0,16; few-shot = 680.000 token = $1,36. Selisih $1,20 per 1.000 query untuk kenaikan akurasi 72 menjadi 91 persen (+19 poin).",
        "Apakah sepadan? Tergantung biaya kesalahan. Bila satu kesalahan ekstraksi merugikan Rp50.000 dan volume 1.000 query/hari: zero-shot salah 280x (Rp14 juta), few-shot salah 90x (Rp4,5 juta) — penghematan Rp9,5 juta/hari untuk biaya token $1,20. Jelas sepadan. Bila tugasnya klasifikasi sentimen internal yang salahnya tidak berbiaya: zero-shot cukup. Keputusan pola adalah keputusan ekonomi — hitung biaya kesalahan, bukan hanya biaya token.",
        "Aturan pemilihan cepat: format output harus di-parse mesin → Template. Tugas baru yang contohnya sedikit → Few-shot 2-3 contoh. Nada/kedalaman penting → Persona + Template. Prosedur multi-langkah → Recipe. Jawaban berisiko tinggi → Meta/refleksi + verifikasi. Dan gabungkan: Persona + Template + Few-shot adalah kombinasi produksi yang paling umum — tiga pola, satu prompt.",
      ],
      tasks: [],
      note: {
        title: "Contoh yang buruk lebih merusak dari tanpa contoh",
        body: "Few-shot dengan contoh yang salah format atau salah label mengajarkan pola yang salah — model meniru contoh dengan setia, termasuk kesalahannya. Audit contoh few-shot seperti mengaudit data training: tiap contoh harus benar, representatif, dan mencakup kasus tepi. Satu contoh salah bisa lebih merusak dari lima contoh benar yang membantu.",
      },
      reference: "Few-shot $1,36 vs zero-shot $0,16 per 1.000 query; akurasi +19 poin.",
    },
    {
      id: "lab-pola",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: biaya token dan kenaikan akurasi pola",
      prose: [
        "Lab ini menghitung ekonomi katalog pola dari angka mentah: token per pola, biaya per 1.000 query, dan kenaikan akurasi.",
        "Hitung dulu di kepala. Zero-shot: 80 token. Few-shot: 80 + 5 x 120 = 680 token. Biaya 1.000 query @ $0,002/1.000 token: zero-shot 80.000/1.000 x 0,002 = $0,16; few-shot 680.000/1.000 x 0,002 = $1,36. Kenaikan akurasi: 91 - 72 = 19 poin.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: token_zero, token_few, biaya_zero, biaya_few, kenaikan. Lima angka ini adalah neraca pola — dengan ini 'pola ini sepadan' menjadi klaim yang bisa dihitung.",
        "Setelah lolos, coba eksperimen: naikkan contoh menjadi 10 dan lihat token menjadi 1.280 ($2,56) — lalu tanyakan: apakah 5 contoh tambahan memberi akurasi yang sepadan, atau sudah diminishing return?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `token_zero` dan `token_few` (5 contoh @ 120 token)" },
        { id: "t2", text: "Hitung `biaya_zero` dan `biaya_few` per 1.000 query @ $0,002/1.000 token" },
        { id: "t3", text: "Hitung `kenaikan` akurasi (91 - 72)" },
      ],
      expected: "token_zero=80\ntoken_few=680\nbiaya_zero=0.16\nbiaya_few=1.36\nkenaikan=19",
      hints: [
        "Few-shot = instruksi + contoh x token per contoh.",
        "Biaya = total token / 1.000 x tarif.",
        "Kenaikan = akurasi few-shot - akurasi zero-shot.",
      ],
      code: {
        starter: `# Ekonomi pola prompt: token + biaya + akurasi.\ninstruksi = 80\ncontoh_n, token_per_contoh = 5, 120\ntarif = 0.002  # dolar per 1.000 token\nquery = 1000\nakurasi_zero, akurasi_few = 72, 91\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ntoken_zero = \ntoken_few = \nbiaya_zero = \nbiaya_few = \nkenaikan = \n\nprint(f"token_zero={token_zero}")\nprint(f"token_few={token_few}")\nprint(f"biaya_zero={biaya_zero}")\nprint(f"biaya_few={biaya_few}")\nprint(f"kenaikan={kenaikan}")`,
        lockLines: 5,
        solution: `# Ekonomi pola prompt: token + biaya + akurasi.\ninstruksi = 80\ncontoh_n, token_per_contoh = 5, 120\ntarif = 0.002  # dolar per 1.000 token\nquery = 1000\nakurasi_zero, akurasi_few = 72, 91\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ntoken_zero = instruksi\ntoken_few = instruksi + contoh_n * token_per_contoh\nbiaya_zero = token_zero * query / 1000 * tarif\nbiaya_few = token_few * query / 1000 * tarif\nkenaikan = akurasi_few - akurasi_zero\n\nprint(f"token_zero={token_zero}")\nprint(f"token_few={token_few}")\nprint(f"biaya_zero={biaya_zero}")\nprint(f"biaya_few={biaya_few}")\nprint(f"kenaikan={kenaikan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "token_zero", value: 80, tol: 1e-9, label: "`token_zero` seharusnya 80", msg: "Hanya instruksi." },
          { kind: "equal", task: "t1", name: "token_few", value: 680, tol: 1e-9, label: "`token_few` seharusnya 680", msg: "80 + 5x120 = 680." },
          { kind: "equal", task: "t2", name: "biaya_zero", value: 0.16, tol: 1e-9, label: "`biaya_zero` seharusnya 0.16", msg: "80.000/1.000 x 0,002 = $0,16." },
          { kind: "equal", task: "t2", name: "biaya_few", value: 1.36, tol: 1e-9, label: "`biaya_few` seharusnya 1.36", msg: "680.000/1.000 x 0,002 = $1,36." },
          { kind: "equal", task: "t3", name: "kenaikan", value: 19, tol: 1e-9, label: "`kenaikan` seharusnya 19", msg: "91 - 72 = 19 poin." },
        ],
      },
      reference: "80 vs 680 token; $0,16 vs $1,36; +19 poin.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: pola apa untuk tugas apa",
      prose: [
        "Skenario 1 — Output harus di-parse mesin (JSON, tabel). → Template. Alasan: format yang dikunci lebih penting dari isi yang kreatif.",
        "Skenario 2 — Tugas baru, format sulit dijelaskan. → Few-shot 2-3 contoh. Alasan: contoh adalah spesifikasi yang bisa dieksekusi.",
        "Skenario 3 — Nada dan kedalaman penting (laporan eksekutif). → Persona + Template. Alasan: peran mengatur nada; template mengatur bentuk.",
        "Skenario 4 — Prosedur multi-langkah yang harus lengkap. → Recipe. Alasan: langkah berurutan mencegah lompatan.",
        "Skenario 5 — Jawaban berisiko tinggi (finansial, medis). → Meta/refleksi + verifikasi independen. Alasan: model harus memeriksa dirinya — dan kamu harus memeriksa model.",
        "Aturan praktis: mulai dari Template + Few-shot (kombinasi yang paling sering menang), tambah Persona bila nada penting, tambah Recipe bila prosedural, tambah Meta bila berisiko. Dokumentasikan pola yang dipakai per prompt — prompt tanpa katalog adalah prompt yang tidak bisa diperbaiki sistematis.",
      ],
      tasks: [],
      note: {
        title: "Katalog adalah aset tim",
        body: "Simpan katalog pola tim di satu tempat: nama pola, kapan dipakai, contoh prompt, dan hasil ukurnya (akurasi + biaya). Tiap prompt baru merujuk ke pola — bukan ditulis dari nol. Katalog yang hidup (diperbarui tiap ada pola baru yang terbukti) menghemat lebih banyak waktu daripada library prompt mana pun.",
      },
      reference: "Template untuk mesin; few-shot untuk tugas baru; persona untuk nada; recipe untuk prosedur; meta untuk risiko.",
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
        "21 pola Vanderbilt dalam 5 keluarga utama + pendukung.",
        "Zero-shot 80 token ($0,16); few-shot 680 token ($1,36) per 1.000 query.",
        "Kenaikan akurasi 72 menjadi 91 persen (+19 poin).",
        "Template untuk output mesin; few-shot untuk tugas baru.",
        "Keputusan pola adalah ekonomi: biaya token vs biaya kesalahan.",
      ],
      next: { label: "AIE26 — Kurasi Dataset untuk LLM: dari 2 Juta ke 1,45 Juta yang Layak", href: "/v2/learn/aie26-kurasi-dataset-llm" },
      quiz: [
        {
          q: "Few-shot: instruksi 80 token + 5 contoh @ 120 token. Berapa total token?",
          options: [
            { text: "680", why: "Tepat: 80 + 600 = 680.", correct: true },
            { text: "600 — instruksi tidak dihitung", why: "Salah: instruksi tetap dikirim dan dibayar." },
            { text: "200 — 80 + 120", why: "Salah: 5 contoh, bukan 1 — 5 x 120 = 600." },
            { text: "120 — hanya satu contoh yang dihitung", why: "Salah: semua contoh dikirim tiap query." },
          ],
        },
        {
          q: "Few-shot $1,36 vs zero-shot $0,16 per 1.000 query, akurasi +19 poin. Kapan few-shot TIDAK sepadan?",
          options: [
            { text: "Bila biaya kesalahan hampir nol dan volume besar", why: "Tepat: bila salah tidak berbiaya, $1,20 ekstra per 1.000 query adalah pemborosan.", correct: true },
            { text: "Bila akurasi naik 19 poin", why: "Salah: kenaikan 19 poin justru alasan MEMAKAI few-shot bila kesalahan berbiaya." },
            { text: "Bila volume kecil", why: "Salah: volume kecil berarti biaya absolut kecil; few-shot justru murah di sana." },
            { text: "Tidak pernah — few-shot selalu menang", why: "Salah: few-shot menang akurasi, tetapi kalah biaya; keputusannya ekonomi." },
          ],
        },
        {
          q: "Output harus di-parse mesin menjadi JSON. Pola apa?",
          options: [
            { text: "Persona", why: "Salah: persona mengatur nada, bukan format yang bisa di-parse." },
            { text: "Template — kunci format output", why: "Tepat: template adalah pola terpenting untuk produksi terstruktur.", correct: true },
            { text: "Recipe", why: "Salah: recipe untuk prosedur berurutan, bukan format output." },
            { text: "Meta/refleksi", why: "Salah: refleksi untuk memeriksa jawaban, bukan mengunci format." },
          ],
        },
        {
          q: "Mengapa contoh few-shot yang salah lebih merusak dari tanpa contoh?",
          options: [
            { text: "Karena model meniru contoh dengan setia, termasuk kesalahannya", why: "Tepat: contoh adalah spesifikasi yang bisa dieksekusi — termasuk spesifikasinya yang salah.", correct: true },
            { text: "Karena contoh menambah token sehingga model bingung", why: "Salah: token tambahan bukan masalah; ISI contoh yang salah yang merusak." },
            { text: "Karena few-shot menonaktifkan pengetahuan model", why: "Salah: few-shot tidak menonaktifkan apa pun; ia memberi pola." },
            { text: "Tidak merusak — contoh salah diabaikan model", why: "Salah: model tidak tahu contoh itu salah; ia menirunya." },
          ],
        },
        {
          q: "Apa kombinasi prompt produksi yang paling umum?",
          options: [
            { text: "Persona + Template + Few-shot", why: "Tepat: nada + format + contoh — tiga pola yang saling melengkapi.", correct: true },
            { text: "21 pola sekaligus", why: "Salah: memakai semua pola berarti prompt yang kacau dan mahal." },
            { text: "Zero-shot saja — pola hanya teori", why: "Salah: zero-shot 72 persen vs few-shot 91 persen di kasus ini." },
            { text: "Recipe saja untuk semua tugas", why: "Salah: recipe untuk prosedur; tugas lain butuh pola lain." },
          ],
        },
      ],
    },
  ],
};
