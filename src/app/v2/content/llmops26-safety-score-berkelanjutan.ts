import type { V2Lesson } from "../lib/types";

export const llmops26: V2Lesson = {
  slug: "llmops26-safety-score-berkelanjutan",
  track: "LLMOps",
  module: "Safety & Skala",
  title: "LLMOps26 — Safety Score Berkelanjutan: Keamanan yang Diukur Tiap Rilis",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang aman di Januari, bocor di April — dan tidak ada yang mengukur",
      prose: [
        "NusaBank menguji keamanan chatbot sekali: Januari, red team, lolos. April, model di-update vendor — jailbreak baru lolos, PII bocor lewat parafrasa, dan tidak ada yang tahu selama 3 minggu karena tidak ada yang mengukur. Pelajarannya: keamanan LLM meluruh — penyerang belajar, teknik baru dipublikasikan tiap minggu, update model membuka celah baru. Uji sekali adalah foto; yang dibutuhkan adalah CCTV: safety score yang diukur terus-menerus, tiap rilis, dengan tren yang dibaca.",
        "Safety score berkelanjutan adalah satu angka komposit — gabungan berbobot dari pass rate per kategori (jailbreak, PII, toksisitas, halusinasi) — yang dihitung otomatis tiap rilis dan dipantau trennya tiap kuartal. Bila skor turun, rilis ditahan. Bila satu kategori jatuh, ia diperbaiki — bukan dirata-rata sampai hilang.",
        "Setelah lesson ini kamu bisa: (1) menghitung safety score komposit berbobot; (2) membaca tren skor antar kuartal; (3) merancang ambang rilis dan ambang darurat; (4) menjelaskan mengapa rata-rata bisa menyembunyikan kategori yang runtuh; (5) merancang loop red team berkelanjutan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "LLMOps9 mengajarkan red team berkala dan skor risiko L x I per temuan (point-in-time, per insiden). Tidak ada lesson safety score BERKELANJUTAN — satu angka komposit yang dihitung tiap rilis, dipantau trennya, dan dipakai sebagai gerbang rilis. Lesson ini membangunnya, dengan lab yang menghitung skor komposit dan tren dari angka mentah.",
      },
      reference: "Skor 95,2 (jailbreak 97, PII 99, toksisitas 94, halusinasi 88); kuartal lalu 93,8 (+1,4); ambang rilis 95.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, keamanan bukan lagi acara tahunan — ia metrik yang dibaca tiap rilis.",
        "(1) Menghitung safety score komposit dari pass rate per kategori;",
        "(2) Menghitung tren skor antar kuartal;",
        "(3) Merancang ambang rilis (95) dan ambang darurat per kategori;",
        "(4) Menjelaskan mengapa skor agregat harus disertai skor minimum kategori;",
        "(5) Merancang loop red team: uji, skor, perbaiki, uji ulang.",
      ],
      tasks: [],
    },
    {
      id: "skor-komposit",
      eyebrow: "Langkah 3 · Teori",
      title: "Skor komposit: satu angka, empat kategori, bobot yang jujur",
      prose: [
        "Safety score = jumlah (bobot x pass rate) per kategori. Bobot mencerminkan dampak: jailbreak 30 persen, PII 30 persen, toksisitas 20 persen, halusinasi 20 persen. Pass rate kuartal ini: jailbreak 97, PII 99, toksisitas 94, halusinasi 88. Skor = 0,3 x 97 + 0,3 x 99 + 0,2 x 94 + 0,2 x 88 = 29,1 + 29,7 + 18,8 + 17,6 = 95,2. Kuartal lalu 93,8 — tren +1,4 poin. Ambang rilis 95: 95,2 lolos — tipis.",
        "Satu angka tidak cukup: ia harus disertai skor minimum per kategori. Halusinasi 88 adalah yang terendah — bila ambang per kategori adalah 85, ia lolos; bila ambang 90, ia gagal walau skor komposit 95,2. Inilah jebakan rata-rata: kategori yang runtuh bisa disembunyikan oleh kategori yang kuat. Aturan: rilis butuh komposit MENCAPAI 95 (≥95) DAN tiap kategori MENCAPAI ambangnya (≥85). Dua gerbang, bukan satu.",
        "Satu peringatan tentang ketelitian: pass rate tiap kategori diukur dari 100–200 prompt, jadi 1–2 poin perubahan bisa jadi noise sampling, bukan sinyal. Untuk n=200, simpangan baku pass rate sekitar 1,5–2,5 poin per kategori (tergantung p) — skor kompositnya lebih stabil karena merata-rata empat kategori. Jangan bereaksi pada perubahan 1 poin dalam satu kuartal; baca tren 2 kuartal. Bila skor turun 1 poin tetapi masih dalam noise, catat dan pantau; bila turun 3 poin atau lebih dua kuartal berturut-turut, itu sinyal — selidiki. Kebijakan untuk skor DEKAT AMBANG (rentang ketidakpastian): skor 95,2 dengan ambang 95 berada di dalam noise — vonisnya 'lolos bersyarat': rilis dengan uji ulang (tambah sampel prompt kuartal itu atau jalankan suite kedua) dan catat skor + intervalnya, bukan 'lolos' tanpa catatan. Dan satu pengecualian atas aturan 'jangan bereaksi': insiden kritis (misal: satu jailbreak yang lolos ke produksi dan dieksploitasi) SELALU eskalasi segera — berapapun skor kompositnya. Aturan 'jangan bereaksi pada 1 poin' berlaku untuk fluktuasi skor, bukan untuk insiden.",
        "Bobot bukan tebakan: ia diputuskan bersama security (likelihood) dan product (impact) — sama seperti skor risiko LLMOps9. PII berbobot 30 persen karena dendanya miliaran (UU PDP); halusinasi 20 persen karena dampaknya reputasi, bukan denda. Bobot di-review tiap tahun — bila regulasi berubah, bobot berubah, dan skor historis dihitung ulang agar tren tetap bisa dibandingkan.",
      ],
      tasks: [],
      formula: "\\mathrm{Score} = \\sum_c w_c \\cdot \\mathrm{pass}_c, \\qquad \\sum_c w_c = 1",
      formulaNote: "w = bobot kategori; pass = pass rate kategori (0-100). Rilis butuh Score ≥ ambang DAN tiap pass_c ≥ ambang kategorinya.",
      note: {
        title: "Pass rate diukur dari apa",
        body: "Tiap kategori punya suite serangan standar yang TETAP antar kuartal (dataset emas keamanan): 200 prompt jailbreak, 150 upaya ekstraksi PII, 100 prompt toksik, 100 pertanyaan halusinasi. Suite yang berubah tiap kuartal membuat tren tidak bisa dibandingkan — sama seperti benchmark yang berubah (AAI8). Tambah serangan baru BOLEH, tetapi suite inti harus tetap.",
      },
      reference: "Skor 95,2; tren +1,4; halusinasi 88 terendah.",
    },
    {
      id: "loop",
      eyebrow: "Langkah 4 · Teori",
      title: "Loop berkelanjutan: uji, skor, perbaiki, uji ulang",
      prose: [
        "Loop-nya empat langkah. (1) Uji: tiap rilis menjalankan suite keamanan otomatis (10 menit); tiap kuartal red team manusia + otomatis dengan teknik terbaru. (2) Skor: hitung komposit + per kategori; bandingkan dengan kuartal lalu. (3) Vonis: mencapai 95 (≥95) dan semua kategori mencapai ambang (≥85) = rilis; komposit di bawah 95 ATAU satu kategori di bawah ambang = tahan, perbaiki. (4) Perbaiki: guardrail baru, data training tambahan, atau eskalasi — lalu uji ulang HANYA kategori yang gagal (cepat) + uji penuh sebelum rilis (lengkap).",
        "Kecepatan loop menentukan keamanan: bila suite otomatis 10 menit, tiap rilis bisa diuji. Bila suite butuh 3 hari manual, tim akan 'melewatkan sekali ini' — dan sekali itu menjadi kebiasaan. Investasi terbesar safety berkelanjutan bukan red team-nya, melainkan OTOMASI suite-nya: red team manusia menemukan serangan baru; otomatisasi memastikan serangan lama tidak pernah kembali lolos (regression).",
        "Darurat: bila satu kategori jatuh di bawah 70 (misalnya PII 65 setelah update model), rilis DITAHAN dan model lama dipertahankan. Kompositnya pun ikut jatuh — dengan PII 65, komposit paling tinggi 89,5 (0,3 x 65 + 0,7 x 100), sudah di bawah ambang 95 — tetapi yang memicu penahanan DARURAT adalah gerbang kategori itu sendiri, bukan kompositnya: eskalasi dan perbaikan dimulai segera, tanpa menunggu tren kuartal. Tulis ambang ini sebelum insiden; menegosiasikannya saat insiden berarti sudah kalah.",
      ],
      tasks: [],
      note: {
        title: "Keamanan meluruh — skor harus naik, bukan stagnan",
        body: "Penyerang belajar tiap minggu; suite yang BEKU tidak bisa menangkap teknik baru — skornya akan tetap DATAR (95,2 hari ini, 95,2 tahun depan) sementara keamanan SEBENARNYA meluruh, karena serangan baru tidak ada di suite lama. Itulah mengapa suite inti tetap (agar tren sebanding) TETAPI serangan baru DITAMBAHKAN tiap kuartal (agar suite tidak buta): tren yang datar pada suite yang diperbarui adalah penurunan yang tertunda. Target yang sehat: skor naik 1-2 poin per kuartal pada suite yang diperbarui, didorong perbaikan berkelanjutan — bukan stagnan di 95,2 sambil merasa aman.",
      },
      reference: "Loop: uji tiap rilis (10 menit) + red team kuartalan; darurat bila kategori di bawah 70.",
    },
    {
      id: "lab-safety-score",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: skor komposit, tren, dan vonis rilis",
      prose: [
        "Lab ini menghitung safety score berkelanjutan dari angka mentah: skor komposit berbobot, tren kuartal, dan vonis rilis.",
        "Hitung dulu di kepala. Skor: 0,3 x 97 = 29,1; 0,3 x 99 = 29,7; 0,2 x 94 = 18,8; 0,2 x 88 = 17,6; total 95,2. Tren: 95,2 - 93,8 = +1,4. Vonis: skor 95,2 mencapai ambang 95 (≥95) DAN kategori terendah 88 mencapai ambang kategori 85 (≥85) — lolos (1).",
        "Tugas lab: hitung empat angka dan cetak masing-masing di baris sendiri: skor, tren, kategori_min, lolos (1 bila skor ≥95 DAN kategori_min ≥85; 0 bila tidak). Empat angka ini adalah vonis rilis — dengan ini 'aman' menjadi klaim yang terukur, bukan perasaan.",
        "Setelah lolos, coba eksperimen: turunkan halusinasi menjadi 84 dan lihat vonis berubah menjadi 0 walau skor komposit masih 94,4 — lalu tanyakan: apakah timmu berani menahan rilis karena satu kategori?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor` komposit dari empat kategori berbobot" },
        { id: "t2", text: "Hitung `tren` vs kuartal lalu (93,8) dan `kategori_min`" },
        { id: "t3", text: "Tentukan `lolos` (skor ≥95 DAN kategori_min ≥85)" },
      ],
      expected: "skor=95.2\ntren=1.4\nkategori_min=88\nlolos=1",
      hints: [
        "Skor = 0,3x97 + 0,3x99 + 0,2x94 + 0,2x88.",
        "Tren = skor - 93,8; bulatkan 1 desimal.",
        "Kategori_min = pass rate terendah dari keempat kategori.",
      ],
      code: {
        starter: `# Safety score berkelanjutan: komposit + tren + vonis.\njailbreak, pii, toksisitas, halusinasi = 97, 99, 94, 88\nbobot = [0.3, 0.3, 0.2, 0.2]\nskor_lalu = 93.8\nambang_skor, ambang_kategori = 95, 85\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nskor = \ntren = \nkategori_min = \nlolos = \n\nprint(f"skor={round(skor, 1)}")\nprint(f"tren={round(tren, 1)}")\nprint(f"kategori_min={kategori_min}")\nprint(f"lolos={lolos}")`,
        lockLines: 3,
        solution: `# Safety score berkelanjutan: komposit + tren + vonis.\njailbreak, pii, toksisitas, halusinasi = 97, 99, 94, 88\nbobot = [0.3, 0.3, 0.2, 0.2]\nskor_lalu = 93.8\nambang_skor, ambang_kategori = 95, 85\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nskor = bobot[0] * jailbreak + bobot[1] * pii + bobot[2] * toksisitas + bobot[3] * halusinasi\ntren = skor - skor_lalu\nkategori_min = min(jailbreak, pii, toksisitas, halusinasi)\nlolos = 1 if (skor >= ambang_skor and kategori_min >= ambang_kategori) else 0\n\nprint(f"skor={round(skor, 1)}")\nprint(f"tren={round(tren, 1)}")\nprint(f"kategori_min={kategori_min}")\nprint(f"lolos={lolos}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: 95.2, tol: 0.1, label: "`skor` seharusnya 95.2", msg: "29,1+29,7+18,8+17,6 = 95,2." },
          { kind: "equal", task: "t2", name: "tren", value: 1.4, tol: 0.1, label: "`tren` seharusnya 1.4", msg: "95,2-93,8 = +1,4." },
          { kind: "equal", task: "t2", name: "kategori_min", value: 88, tol: 1e-9, label: "`kategori_min` seharusnya 88", msg: "Halusinasi 88 adalah yang terendah." },
          { kind: "equal", task: "t3", name: "lolos", value: 1, tol: 1e-9, label: "`lolos` seharusnya 1", msg: "95,2 ≥ 95 DAN 88 ≥ 85 — lolos tipis." },
        ],
      },
      reference: "Skor 95,2; tren +1,4; min 88; LOLOS.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: kapan rilis, kapan tahan",
      prose: [
        "Skenario 1 — Skor 95,2, semua kategori di atas ambang. → Rilis. Alasan: dua gerbang lolos; catat halusinasi 88 sebagai perbaikan kuartal depan.",
        "Skenario 2 — Skor 95,2 tetapi PII 84 (di bawah ambang 85). → TAHAN. Alasan: rata-rata menyembunyikan kategori yang runtuh; PII adalah denda miliaran.",
        "Skenario 3 — Satu kategori di bawah 70 (darurat). → TAHAN + pertahankan model lama + eskalasi. Alasan: rem darurat tidak bisa dinegosiasi.",
        "Skenario 4 — Skor turun 2 kuartal berturut-turut walau masih ≥95. → Investigasi: penyerang belajar lebih cepat dari perbaikanmu. Alasan: tren turun adalah peringatan dini; menunggu di bawah ambang berarti terlambat.",
        "Skenario 5 — Suite otomatis 10 menit, red team kuartalan menemukan teknik baru. → Masukkan teknik baru ke suite otomatis (regression). Alasan: serangan yang ditemukan manusia harus tidak pernah lolos lagi secara otomatis.",
        "Aturan praktis: skor dibaca tiap rilis, tren dibaca tiap kuartal, bobot di-review tiap tahun. Keamanan yang tidak dibaca adalah keamanan yang tidak ada.",
      ],
      tasks: [],
      note: {
        title: "Siapa yang memiliki skor",
        body: "Safety score butuh pemilik (security) dan peninjau (product) — seperti skor risiko LLMOps9. Tanpa pemilik, skor yang turun akan dibaca tidak ada yang membaca. Tanpa peninjau product, ambang akan ditetapkan terlalu tinggi (tidak pernah rilis) atau terlalu rendah (selalu lolos). Dua peran, satu angka.",
      },
      reference: "Rilis butuh dua gerbang; tren turun 2 kuartal = investigasi; darurat di bawah 70 = tahan.",
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
        "Skor komposit 95,2 (bobot 30/30/20/20); tren +1,4.",
        "Kategori terendah 88 (halusinasi) — di atas ambang 85, lolos tipis.",
        "Rilis butuh komposit ≥95 DAN tiap kategori ≥ ambangnya.",
        "Suite inti tetap antar kuartal agar tren bisa dibandingkan.",
        "Darurat: kategori di bawah 70 = tahan + pertahankan model lama.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Skor komposit 95,2, ambang 95, kategori terendah 88 (ambang 85). Apa vonisnya?",
          options: [
            { text: "Lolos — dua gerbang terpenuhi", why: "Tepat: 95,2 ≥ 95 DAN 88 ≥ 85.", correct: true },
            { text: "Tahan — 95,2 terlalu tipis", why: "Salah: tipis bukan gagal; ambang adalah ambang. Catat sebagai perbaikan, tetapi rilis." },
            { text: "Lolos — skor komposit saja yang dinilai", why: "Salah: vonis butuh DUA gerbang; kategori bisa runtuh di balik rata-rata." },
            { text: "Tahan — halusinasi 88 terlalu rendah", why: "Salah: 88 mencapai ambang kategori 85 (≥85); yang gagal adalah di bawah 85." },
          ],
        },
        {
          q: "Skor komposit 95,2 tetapi PII 84 (ambang 85). Apa vonisnya?",
          options: [
            { text: "Lolos — komposit mencapai 95", why: "Salah: rata-rata menyembunyikan kategori yang runtuh; PII adalah denda miliaran." },
            { text: "TAHAN — satu kategori di bawah ambang membatalkan komposit", why: "Tepat: dua gerbang, bukan satu.", correct: true },
            { text: "Lolos dengan catatan", why: "Salah: 'catatan' tidak melindungi dari denda UU PDP; tahan dan perbaiki." },
            { text: "Turunkan ambang PII menjadi 80 agar lolos", why: "Salah: mengubah ambang untuk meloloskan angka adalah manipulasi." },
          ],
        },
        {
          q: "Mengapa suite keamanan inti harus TETAP antar kuartal?",
          options: [
            { text: "Agar red team tidak bosan", why: "Salah: bukan soal kebosanan — soal keterbandingan tren." },
            { text: "Agar tren bisa dibandingkan — suite yang berubah membuat skor tidak sebanding", why: "Tepat: benchmark yang berubah = klaim perbaikan yang tak terbukti.", correct: true },
            { text: "Agar komputasi lebih cepat", why: "Salah: kecepatan bukan alasannya." },
            { text: "Tidak harus — suite boleh berubah total tiap kuartal", why: "Salah: itu menghancurkan arti tren; teknik baru DITAMBAHKAN, inti TETAP." },
          ],
        },
        {
          q: "Skor turun 2 kuartal berturut-turut tetapi masih di atas 95. Apa yang benar?",
          options: [
            { text: "Tidak ada tindakan — masih di atas ambang", why: "Salah: tren turun adalah peringatan dini; menunggu di bawah ambang berarti terlambat." },
            { text: "Investigasi — penyerang mungkin belajar lebih cepat dari perbaikanmu", why: "Tepat: tren adalah sinyal; ambang adalah batas akhir.", correct: true },
            { text: "Naikkan ambang agar tim lebih waspada", why: "Salah: menaikkan ambang tidak memperbaiki keamanan; ia hanya mengubah label." },
            { text: "Ganti model — skor turun berarti model rusak", why: "Salah: skor turun bisa berarti serangan baru, bukan model rusak; selidiki dulu." },
          ],
        },
        {
          q: "Kategori PII jatuh ke 65 setelah update model. Apa yang benar?",
          options: [
            { text: "Rilis saja — komposit masih di atas 95", why: "Salah: dengan PII 65, komposit paling tinggi 89,5 — sudah di bawah 95; dan di bawah 70 adalah darurat yang tidak bisa ditutupi komposit apa pun." },
            { text: "TAHAN + pertahankan model lama + eskalasi", why: "Tepat: rem darurat tidak bisa dinegosiasi.", correct: true },
            { text: "Tunggu kuartal depan — mungkin membaik sendiri", why: "Salah: keamanan tidak membaik sendiri; penyerang justru memanfaatkan celah yang diketahui." },
            { text: "Hapus kategori PII dari skor agar komposit naik", why: "Salah: menghapus metrik yang buruk adalah manipulasi, bukan perbaikan." },
          ],
        },
      ],
    },
  ],
};
