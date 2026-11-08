import type { V2Lesson } from "../lib/types";

export const mlops26: V2Lesson = {
  slug: "mlops26-progressive-delivery-rollback",
  track: "MLOps",
  module: "Serving & Skala",
  title: "MLOps26 — Progressive Delivery & Rollback: Rilis Tanpa Drama",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Deploy 100 persen yang merusak skor 20.000 nasabah dalam 9 menit",
      prose: [
        "Model fraud v2.3 dideploy 100 persen ke semua trafik Jumat sore. Sembilan menit kemudian, error rate naik dari 0,9 persen menjadi 1,8 persen — 2x lipat — dan p95 latensi naik dari 140 ms menjadi 210 ms (+50 persen). Tim butuh 47 menit untuk rollback manual: mencari YAML lama, apply, verifikasi. Dalam 47 menit itu, 20.000 nasabah mendapat skor dari model yang rusak. Postmortem-nya satu kalimat: 'tidak ada yang salah dengan modelnya — yang salah adalah cara kami merilisnya.'",
        "Progressive delivery adalah jawaban: rilis bertahap (shadow, canary, blue-green) dengan gerbang metrik otomatis dan rollback satu perintah. Model yang sama, dirilis dengan cara yang berbeda, mengubah insiden 47 menit menjadi non-insiden 3 menit.",
        "Lesson ini mengajarkan progressive delivery sebagai sistem: empat strategi, gerbang metrik, dan rollback otomatis. Setelah lesson ini kamu bisa: (1) membedakan shadow, canary, blue-green, dan feature flag; (2) menghitung rasio error canary vs baseline; (3) merancang gerbang metrik dengan ambang yang disepakati; (4) menghitung waktu rollback otomatis vs manual; (5) memutuskan strategi per jenis perubahan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Canary dan rollback disinggung tersebar: MLOps11 (helm rollback satu perintah), MLOps12 capstone (shadow 2 minggu, canary 5 persen, rollback 1-klik), dan LLMOps10 (canary untuk LLM). Tidak ada lesson yang membangun progressive delivery sebagai SISTEM — empat strategi dibandingkan, gerbang metrik dihitung, rollback otomatis dirancang. Lesson ini mengisinya, dengan lab yang menghitung rasio error dan kenaikan latensi dari angka mentah.",
      },
      reference: "Error canary 1,8 persen vs baseline 0,9 persen (rasio 2,0); p95 210 vs 140 ms (+50 persen); rollback manual 47 menit.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, tidak ada lagi deploy 100 persen tanpa jaring pengaman.",
        "(1) Menjelaskan shadow, canary, blue-green, dan feature flag;",
        "(2) Menghitung rasio error dan kenaikan latensi canary;",
        "(3) Merancang gerbang metrik: ambang error, latensi, dan bisnis;",
        "(4) Menghitung penghematan waktu rollback otomatis;",
        "(5) Memilih strategi per jenis perubahan model.",
      ],
      tasks: [],
    },
    {
      id: "strategi",
      eyebrow: "Langkah 3 · Teori",
      title: "Empat strategi: shadow, canary, blue-green, flag",
      prose: [
        "Shadow: model baru menerima salinan trafik nyata tetapi jawabannya DIBUANG — tidak memengaruhi pengguna. Gunanya: membandingkan output baru vs lama pada data produksi nyata tanpa risiko LANGSUNG ke pengguna. Tetapi 'tanpa risiko' dan 'aman total' adalah klaim yang berlebihan: shadow tetap membebani infrastruktur dengan komputasi ganda (dan bisa memperlambat sistem bila kapasitas mepet), dan bila model shadow menulis ke sistem downstream — log, cache, antrean, atau penyimpanan — ia bisa menimbulkan efek samping yang nyata. Shadow yang aman adalah shadow yang READ-ONLY terhadap semua sistem produksi dan diisolasi sumber dayanya. Durasi tipikal: 1-2 minggu. Shadow menangkap apa yang tidak ditangkap staging: data produksi yang aneh.",
        "Canary: model baru melayani sebagian kecil trafik nyata — misalnya 5 persen dari 20.000 request = 1.000 request — dan jawabannya DIPAKAI. Gunanya: mengukur dampak nyata dengan blast radius kecil. Kriteria naik: error dan latensi dalam ambang selama periode observasi. Canary adalah strategi default untuk model yang sudah lolos shadow.",
        "Blue-green: dua environment identik; trafik dialihkan sekaligus dari biru (lama) ke hijau (baru), dengan kemampuan kembali seketika. Gunanya: rollback tercepat (ganti router, bukan deploy ulang). Kelemahannya: butuh kapasitas ganda dan tidak memberi sinyal bertahap — bila hijau rusak, 100 persen trafik sudah di sana sebelum kamu tahu.",
        "Feature flag: model baru dihidupkan per segmen (pengguna, wilayah, persen trafik) lewat konfigurasi — tanpa deploy ulang. Gunanya: rollback = matikan flag (detik, bukan menit). Ini yang membuat rollback otomatis mungkin: sistem memantau metrik dan mematikan flag sendiri bila ambang terlampaui.",
      ],
      tasks: [],
      note: {
        title: "Urutan default — bukan hukum",
        body: "Untuk perubahan BESAR, urutan defaultnya: staging → shadow (1-2 minggu) → canary 5 persen → canary 25 persen → 100 persen. Tetapi ini bukan urutan absolut yang berlaku untuk semua perubahan: retrain rutin dengan arsitektur sama boleh memakai shadow singkat (Skenario 2), dan perbaikan bug kritis boleh langsung blue-green (Skenario 3). Melewatkan shadow berarti canary-mu menjadi shadow — dengan pengguna sebagai kelinci percobaan — dan itu harga yang hanya boleh dibayar bila risikonya memang rendah atau kecepatannya memang mendesak, dengan keputusan yang ditulis, bukan diam-diam.",
      },
      reference: "Canary 5 persen dari 20.000 = 1.000 request.",
    },
    {
      id: "gerbang",
      eyebrow: "Langkah 4 · Teori",
      title: "Gerbang metrik: angka yang memutuskan, bukan perasaan",
      prose: [
        "Gerbang canary memakai tiga lapis metrik. Lapis teknis: error rate dan latensi p95. Contoh hitungan: baseline 90 error dari 10.000 request = 0,9 persen; canary 18 error dari 1.000 request = 1,8 persen; rasio = 1,8 / 0,9 = 2,0 — dua kali lipat. Ambang yang dipakai di lesson ini: rollback bila rasio error di atas 1,5x. Rasio 2,0 melewatinya — ROLLBACK. Latensi: p95 canary 210 ms vs baseline 140 ms — naik (210-140)/140 = 50,0 persen. Ambang latensi: naik di atas 30 persen = rollback. Dua lapis sudah memberi vonis sebelum lapis bisnis sempat bicara.",
        "Lapis bisnis: metrik yang benar-benar penting — approval rate, konversi, nilai transaksi. Model fraud yang error-nya naik sedikit tetapi approval rate-nya jatuh 5 poin tetap harus di-rollback: ia merugikan bisnis walau teknisnya 'hampir lolos'. Lapis ketiga: guardrail keamanan — bila model baru memberi skor ekstrem yang tidak pernah muncul di baseline, rollback dulu, selidiki belakangan.",
        "Rollback otomatis vs manual: manual butuh 47 menit (manusia sadar, cari YAML, apply, verifikasi). Otomatis butuh 3 menit (sistem mendeteksi ambang terlampaui, matikan flag, verifikasi versi kembali). Selisih 44 menit — pada 20.000 request, itu ribuan nasabah yang diselamatkan. Syarat rollback otomatis: ambang ditulis SEBELUM deploy, jalur rollback diuji tiap kuartal, dan manusia diberi tahu — bukan dimintai izin — saat rollback terjadi.",
      ],
      tasks: [],
      note: {
        title: "Rollback bukan kegagalan",
        body: "Tim yang takut rollback akan menunda deploy sampai 'sempurna' — lalu deploy besar-besaran yang mustahil di-rollback. Tim yang merayakan rollback sebagai bukti sistem bekerja akan deploy kecil-kecil dan sering. Budaya yang benar: rollback adalah fitur, bukan aib. Rayakan insiden yang berakhir dalam 3 menit.",
      },
      reference: "Rasio error 2,0 di atas ambang 1,5 — ROLLBACK. Latensi +50 persen di atas ambang 30 persen.",
    },
    {
      id: "lab-canary",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: rasio error canary dan vonis rollback",
      prose: [
        "Lab ini menghitung gerbang canary dari angka mentah: error rate baseline dan canary, rasionya, kenaikan latensi, dan vonis rollback.",
        "Hitung dulu di kepala. Baseline: 90 / 10.000 = 0,9 persen. Canary: 18 / 1.000 = 1,8 persen. Rasio: 1,8 / 0,9 = 2,0. Latensi naik: (210 - 140) / 140 x 100 = 50,0 persen. Vonis: rasio 2,0 di atas ambang 1,5 DAN latensi naik 50 persen di atas ambang 30 persen — dua pemicu independen, salah satu saja sudah cukup: rollback (1).",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: err_base, err_canary, rasio, latensi_naik_persen, rollback. Lima angka ini adalah vonis gerbang — dengan ini keputusan rollback tidak lagi bergantung pada siapa yang paling keras suaranya di ruang insiden.",
        "Setelah lolos, coba eksperimen: ubah error canary menjadi 12 dari 1.000 (1,2 persen, rasio 1,33) DAN p95 canary menjadi 160 ms (naik 14,3 persen) dan lihat vonis berubah menjadi lanjut (0) — kedua pemicu kini di bawah ambangnya. Perhatikan: bila hanya error yang diperbaiki sementara latensi tetap +50 persen, vonis TETAP rollback — gerbang memakai ATAU, bukan DAN. Lalu tanyakan: apakah rasio 1,33 yang 'lolos' tetap perlu diselidiki?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `err_base` dan `err_canary` dalam persen" },
        { id: "t2", text: "Hitung `rasio` error dan `latensi_naik_persen`" },
        { id: "t3", text: "Tentukan `rollback` (1 bila rasio di atas 1,5 ATAU latensi naik di atas 30 persen)" },
      ],
      expected: "err_base=0.9\nerr_canary=1.8\nrasio=2.0\nlatensi_naik_persen=50.0\nrollback=1",
      hints: [
        "Error persen = error / request x 100.",
        "Rasio = err_canary / err_base.",
        "Kenaikan latensi = (canary - baseline) / baseline x 100.",
        "Rollback = 1 bila rasio lebih dari 1,5 ATAU latensi naik lebih dari 30 persen — salah satu pemicu sudah cukup.",
      ],
      code: {
        starter: `# Gerbang canary: rasio error + vonis rollback.\nerr_base_n, req_base = 90, 10000\nerr_can_n, req_can = 18, 1000\np95_base, p95_can = 140, 210\nambang_rasio = 1.5\nambang_latensi = 30.0  # persen\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nerr_base = \nerr_canary = \nrasio = \nlatensi_naik_persen = \nrollback = \n\nprint(f"err_base={err_base}")\nprint(f"err_canary={err_canary}")\nprint(f"rasio={rasio}")\nprint(f"latensi_naik_persen={latensi_naik_persen}")\nprint(f"rollback={rollback}")`,
        lockLines: 6,
        solution: `# Gerbang canary: rasio error + vonis rollback.\nerr_base_n, req_base = 90, 10000\nerr_can_n, req_can = 18, 1000\np95_base, p95_can = 140, 210\nambang_rasio = 1.5\nambang_latensi = 30.0  # persen\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nerr_base = err_base_n / req_base * 100\nerr_canary = err_can_n / req_can * 100\nrasio = err_canary / err_base\nlatensi_naik_persen = (p95_can - p95_base) / p95_base * 100\nrollback = 1 if (rasio > ambang_rasio or latensi_naik_persen > ambang_latensi) else 0\n\nprint(f"err_base={err_base}")\nprint(f"err_canary={err_canary}")\nprint(f"rasio={rasio}")\nprint(f"latensi_naik_persen={latensi_naik_persen}")\nprint(f"rollback={rollback}")`,
        checks: [
          { kind: "equal", task: "t1", name: "err_base", value: 0.9, tol: 1e-9, label: "`err_base` seharusnya 0.9", msg: "90/10.000 = 0,9 persen." },
          { kind: "equal", task: "t1", name: "err_canary", value: 1.8, tol: 1e-9, label: "`err_canary` seharusnya 1.8", msg: "18/1.000 = 1,8 persen." },
          { kind: "equal", task: "t2", name: "rasio", value: 2.0, tol: 1e-9, label: "`rasio` seharusnya 2.0", msg: "1,8/0,9 = 2,0 — dua kali lipat." },
          { kind: "equal", task: "t2", name: "latensi_naik_persen", value: 50.0, tol: 1e-9, label: "`latensi_naik_persen` seharusnya 50.0", msg: "(210-140)/140 = 50,0 persen." },
          { kind: "equal", task: "t3", name: "rollback", value: 1, tol: 1e-9, label: "`rollback` seharusnya 1", msg: "Rasio 2,0 di atas ambang 1,5 DAN latensi +50 persen di atas ambang 30 persen — salah satu saja sudah cukup. ROLLBACK." },
        ],
      },
      reference: "Error 0,9 vs 1,8 persen; rasio 2,0; latensi +50 persen; ROLLBACK (dua pemicu, ATAU).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: strategi per jenis perubahan",
      prose: [
        "Skenario 1 — Model baru, perubahan besar (arsitektur baru). → Shadow 2 minggu, lalu canary 5 persen. Alasan: risiko tertinggi, butuh bukti terpanjang.",
        "Skenario 2 — Retrain rutin, data baru, arsitektur sama. → Canary 5 persen langsung (shadow singkat 1 hari). Alasan: risiko rendah; shadow panjang membuang waktu.",
        "Skenario 3 — Perbaikan bug kritis (model lama salah). → Blue-green dengan rollback siap. Alasan: kecepatan penting; canary bertahap menunda perbaikan.",
        "Skenario 4 — Perubahan kecil (ambang keputusan diubah). → Feature flag per segmen. Alasan: rollback dalam detik; segmentasi memberi kontrol halus.",
        "Skenario 5 — Model untuk keputusan finansial berdampak besar. → Shadow + canary + gerbang bisnis (approval rate). Alasan: lapis teknis saja tidak cukup; bisnis harus ikut memberi vonis.",
        "Aturan praktis: tulis ambang SEBELUM deploy, uji jalur rollback tiap kuartal, dan jangan pernah deploy Jumat sore tanpa rollback otomatis — insiden tidak mengenal akhir pekan.",
      ],
      tasks: [],
      note: {
        title: "Durasi canary butuh statistik, bukan perasaan",
        body: "Canary 5 persen selama 10 menit dengan 1.000 request tidak cukup untuk mendeteksi kenaikan error dari 0,9 ke 1,2 persen — noise-nya lebih besar dari sinyalnya. Hitung ukuran sampel yang dibutuhkan (seperti AAI8/LLMOps10): untuk mendeteksi perbedaan kecil, butuh ribuan request dan jam observasi. Canary yang terlalu singkat adalah ritual keberuntungan.",
      },
      reference: "Shadow untuk perubahan besar; canary untuk retrain; blue-green untuk bug kritis; flag untuk perubahan kecil.",
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
        "Shadow: jawaban dibuang; canary: 5 persen dipakai; blue-green: alih sekaligus; flag: matikan dalam detik.",
        "Error canary 1,8 vs baseline 0,9 persen — rasio 2,0 di atas ambang 1,5.",
        "Latensi p95 naik 50 persen di atas ambang 30 persen.",
        "Rollback otomatis 3 menit vs manual 47 menit.",
        "Ambang ditulis SEBELUM deploy; jalur rollback diuji tiap kuartal.",
      ],
      next: { label: "MLOps27 — Load & Stress Testing: Apakah Serving-mu Kuat 500 RPS?", href: "/v2/learn/mlops27-load-testing-serving" },
      quiz: [
        {
          q: "Baseline 0,9 persen error, canary 1,8 persen, ambang rasio 1,5. Apa vonisnya?",
          options: [
            { text: "ROLLBACK — rasio 2,0 di atas ambang", why: "Tepat: 1,8/0,9 = 2,0; ambang 1,5 terlampaui.", correct: true },
            { text: "Lanjut — selisih hanya 0,9 poin", why: "Salah: yang dinilai rasio, bukan selisih poin. 2x lipat adalah sinyal kuat." },
            { text: "Lanjut — canary hanya 1.000 request, terlalu kecil", why: "Salah: 1.000 request cukup untuk mendeteksi 2x lipat; dan vonis tetap rollback sambil menyelidiki." },
            { text: "Tunggu 1 jam lagi — mungkin fluke", why: "Salah: menunggu berarti 1.000 request berikutnya juga kena model rusak; gerbang ada untuk memutuskan sekarang." },
          ],
        },
        {
          q: "Apa perbedaan shadow dan canary?",
          options: [
            { text: "Tidak ada — keduanya sama", why: "Salah: shadow membuang jawaban; canary memakai jawaban untuk sebagian trafik." },
            { text: "Shadow: jawaban dibuang, tanpa risiko langsung ke pengguna — tetapi tetap butuh isolasi tulis dan biaya komputasi ganda", why: "Tepat: shadow aman bagi pengguna (jawabannya dibuang) — tetapi bukan 'aman total': komputasi ganda membebani infra dan tulis ke downstream bisa menimbulkan efek samping.", correct: true },
            { text: "Shadow lebih lambat dari canary", why: "Salah: kecepatan bukan pembedanya; pembedanya apakah jawaban dipakai." },
            { text: "Canary tidak butuh metrik", why: "Salah: canary justru hidup dari gerbang metrik." },
          ],
        },
        {
          q: "Rollback manual 47 menit vs otomatis 3 menit. Apa syarat rollback otomatis?",
          options: [
            { text: "Tidak ada syarat — otomatis selalu bekerja", why: "Salah: butuh ambang tertulis sebelum deploy + jalur rollback yang diuji tiap kuartal." },
            { text: "Ambang ditulis sebelum deploy, jalur rollback diuji tiap kuartal, manusia diberi tahu", why: "Tepat: otomatisasi tanpa ambang dan pengujian adalah bom waktu.", correct: true },
            { text: "Manusia harus menyetujui tiap rollback", why: "Salah: meminta izin mengembalikan kita ke 47 menit; manusia diberi tahu, bukan dimintai izin." },
            { text: "Hanya bisa untuk blue-green, bukan canary", why: "Salah: rollback otomatis bekerja untuk semua strategi lewat feature flag." },
          ],
        },
        {
          q: "Model lama salah dan butuh perbaikan bug kritis segera. Strategi apa?",
          options: [
            { text: "Shadow 2 minggu dulu", why: "Salah: shadow menunda perbaikan yang mendesak; bug kritis butuh kecepatan." },
            { text: "Blue-green dengan rollback siap", why: "Tepat: alih cepat + kembali seketika bila hijau bermasalah.", correct: true },
            { text: "Canary 5 persen selama sebulan", why: "Salah: terlalu lambat untuk bug kritis." },
            { text: "Deploy 100 persen tanpa pengaman — darurat", why: "Salah: darurat bukan alasan menghapus pengaman; blue-green memberi kecepatan DAN pengaman." },
          ],
        },
        {
          q: "Mengapa canary yang terlalu singkat berbahaya?",
          options: [
            { text: "Karena model belum panas", why: "Salah: warmup adalah masalah terpisah; masalah canary singkat adalah statistik." },
            { text: "Karena sampel kecil tidak bisa mendeteksi perbedaan error yang kecil — noise lebih besar dari sinyal", why: "Tepat: butuh ribuan request dan jam observasi untuk perbedaan kecil.", correct: true },
            { text: "Karena canary singkat lebih mahal", why: "Salah: canary singkat justru lebih murah — masalahnya bukan biaya." },
            { text: "Karena pengguna canary akan komplain", why: "Salah: pengguna tidak tahu mereka di canary; masalahnya deteksi yang tidak memadai." },
          ],
        },
      ],
    },
  ],
};
