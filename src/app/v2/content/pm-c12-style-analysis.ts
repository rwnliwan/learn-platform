import type { V2Lesson } from "../lib/types";

export const pmc12: V2Lesson = {
  slug: "pm-c12-style-analysis",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C12 — Style Analysis: Returns-Based dan Holdings-Based",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Manajer value yang ternyata growth — dan tidak ada yang sadar selama dua tahun",
      prose: [
        "Dana Pensiun Nusantara mempekerjakan manajer dengan mandat large-value: membeli saham besar yang murah. Dua tahun kemudian kinerjanya bagus — tetapi komite curiga. Saham teknologi growth sedang reli, dan dana ini ikut naik terlalu rapi. Apakah manajernya memang jago memilih saham value, atau ia diam-diam membeli growth dan menumpang reli?",
        "Jawabannya tidak ada di laporan manajer — di sana tertulis value di setiap halaman. Jawabannya ada di angka: regresi return dana ke indeks gaya menunjukkan bobot 55 persen large-growth dan hanya 30 persen large-value. Mandatnya value; perilakunya growth. Inilah style drift — dan lesson ini tentang cara menangkapnya.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan dua lensa style analysis — returns-based dan holdings-based — beserta kelebihan dan kelemahannya; (2) menjalankan returns-based style analysis ala Sharpe 1992 dan membaca bobot gaya serta selection return; (3) mendeteksi style drift dan memutuskan tindakannya; (4) memakai completeness fund untuk menetralkan drift di level portofolio.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting",
        body: "Alokasi 50 persen value dan 50 persen growth yang dirancang untuk diversifikasi bisa diam-diam menjadi 80 persen growth bila satu manajer drift — tanpa satu pun transaksi di level portofolio. Style analysis adalah satu-satunya alat yang melihat pelanggaran mandat dari perilaku, bukan dari janji.",
      },
      reference: "Kata-kata manajer = klaim. Bobot gaya dari regresi = perilaku. Perilaku menang.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengaudit konsistensi gaya seorang manajer seperti auditor forensik: dari data, bukan dari brosur.",
        "(1) Membedakan returns-based style analysis (RBSA) dan holdings-based style analysis, dan tahu kapan memakai yang mana;",
        "(2) Menjalankan RBSA Sharpe 1992: regresi return dana ke indeks gaya dengan bobot non-negatif yang dijumlahkan 1, lalu membaca R² dan selection return;",
        "(3) Mendeteksi style drift dari bobot gaya yang bergeser dan dari perubahan loading faktor, serta membedakannya dengan style timing yang disengaja;",
        "(4) Menentukan tindakan atas drift: peringatan tertulis, completeness fund, renegosiasi fee, atau penggantian manajer.",
      ],
      tasks: [],
    },
    {
      id: "dua-lensa",
      eyebrow: "Langkah 3 · Teori",
      title: "Dua lensa: returns-based dan holdings-based",
      prose: [
        "Lensa pertama, returns-based style analysis (RBSA, Sharpe 1992): regresikan return dana ke return indeks gaya — large-value, large-growth, small-value, small-growth — dengan dua batasan: setiap bobot di atas atau sama dengan nol, dan seluruh bobot dijumlahkan 1. Hasilnya adalah peta gaya: dana ini berperilaku seperti 50 persen large-value, 10 persen large-growth, 30 persen small-value, 10 persen small-growth. Sisa yang tidak dijelaskan indeks gaya adalah selection return — bagian yang benar-benar berasal dari pilihan saham manajer.",
        "Kekuatan RBSA: ia hanya butuh return bulanan, sehingga bisa dipakai untuk dana yang holding-nya tidak transparan — termasuk hedge fund. Kelemahannya: ia butuh 36 bulan data agar stabil, dan ia buta terhadap apa yang sebenarnya dipegang. Dua manajer dengan bobot gaya sama bisa memegang saham yang sangat berbeda.",
        "Lensa kedua, holdings-based: petakan setiap saham yang dipegang ke style box 3x3 — kapitalisasi (large, mid, small) dikali gaya (value, blend, growth) — memakai rasio seperti price-to-book dan price-to-earnings serta pertumbuhan laba. Kekuatannya: ia melihat isi portofolio hari ini, bukan perilaku tiga tahun terakhir. Kelemahannya: ia butuh data holding yang lengkap dan terkini, dan ia tidak menangkap derivatif atau timing.",
        "Aturan praktis: bila kedua lensa sepakat, vonisnya kuat. Bila keduanya berkontradiksi — misal RBSA berkata growth tetapi holding berkata value — jangan percaya satu pun: investigasi. Penyebab klasik kontradiksi adalah derivatif, timing pasar, atau holding yang dilaporkan sudah basi.",
      ],
      tasks: [],
      formula: String.raw`R_p = \sum_{i} w_i R_i + \varepsilon, \quad w_i \geq 0, \quad \sum_i w_i = 1`,
      formulaNote: "R_p = return dana; R_i = return indeks gaya ke-i; w_i = bobot gaya; epsilon = selection return (sisa = skill pemilihan saham). Bobot non-negatif dan dijumlahkan 1 — dana berperilaku seperti campuran indeks gaya.",
      reference: "RBSA = perilaku dari return. Holdings-based = isi dari holding. Sepakat = vonis kuat; kontradiksi = investigasi.",
    },
    {
      id: "drift-monitoring",
      eyebrow: "Langkah 4 · Teori",
      title: "Style drift: deteksi, ambang, dan tindakan",
      prose: [
        "Style drift adalah pergeseran bobot gaya menjauhi mandat tanpa persetujuan. Contoh nyata di lesson ini: mandat large-value, tetapi RBSA terbaru menunjukkan 45 persen large-growth — 25 poin di atas bobot growth yang dijanjikan. Atau loading HML (value) turun dari 0,8 menjadi 0,2 dalam setahun — manajer itu tidak lagi value, apa pun kata brosurnya.",
        "Monitoring yang benar memakai rolling regression: jalankan RBSA tiap kuartal di jendela 36 bulan bergulir dan plot bobotnya. Ambang praktis: pergeseran bobot gaya lebih dari 10 poin dari mandat memicu panggilan klarifikasi; lebih dari 20 poin memicu peringatan tertulis; drift yang bertahan dua kuartal berturut-turut memicu proses penggantian. Style timing yang disengaja — misal manajer memang diberi kebebasan taktis 10 persen — harus tertulis di mandat sebelumnya, bukan ditemukan sesudahnya.",
        "Tindakan atas drift ada empat tingkat. Satu, klarifikasi: tanyakan alasannya — kadang ada alasan sah, seperti perubahan definisi indeks. Dua, completeness fund: tambah dana pelengkap yang mengisi gaya yang hilang, sehingga total portofolio kembali ke alokasi yang dirancang. Tiga, renegosiasi fee: manajer yang drift ke gaya pasif tidak layak dibayar fee aktif. Empat, ganti manajer — bila drift bertahan dan penjelasannya tidak meyakinkan.",
        "Bedakan drift dengan evolusi gaya yang sah: pasar berubah, definisi value berubah, dan manajer yang baik menyesuaikan. Yang membedakan keduanya adalah persetujuan dan dokumentasi: perubahan yang disetujui komite sebelumnya adalah strategi; perubahan yang baru ketahuan dari regresi adalah pelanggaran.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghukum manajer karena return-nya jelek di kuartal ketika gayanya sedang tidak disukai pasar. Itu bukan drift — itu siklus gaya. Drift adalah soal konsistensi terhadap mandat, bukan soal return kuartal ini. Manajer value yang underperform saat growth reli sedang menjalankan mandatnya dengan benar.",
      },
      reference: "Drift di atas 10 poin = panggil. Di atas 20 poin = peringatan tertulis. Bertahan dua kuartal = proses ganti.",
    },
    {
      id: "lab-rbsa",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: RBSA dengan grid search",
      prose: [
        "Jalankan returns-based style analysis pada 12 bulan return sebuah dana dan empat indeks gaya: LV (large-value), LG (large-growth), SV (small-value), SG (small-growth). Caranya: coba semua kombinasi bobot kelipatan 0,1 yang dijumlahkan 1, hitung return tiruan sebagai rata-rata tertimbang indeks gaya, dan pilih kombinasi dengan jumlah kuadrat galat (SSE) terkecil.",
        "Data lab ini dibuat dengan bobot sejati 50 persen LV, 10 persen LG, 30 persen SV, 10 persen SG, ditambah noise kecil. Grid search yang benar harus menemukan kembali bobot itu — dengan R² 0,949, artinya 94,9 persen variasi return dana dijelaskan oleh gaya. Sisa rata-rata residu 0,44 persen per tahun adalah selection return: nilai tambah dari pilihan saham manajer di luar gaya.",
        "Perhatikan apa yang dilakukan grid search: ia adalah optimasi kuadrat terkecil dengan batasan — versi sederhana dari quadratic programming Sharpe 1992. Di dunia nyata, bobot dicari dengan solver optimasi, bukan grid — tetapi logikanya identik: cari campuran indeks gaya yang paling mirip dengan return dana.",
      ],
      tasks: [
        { id: "t1", text: "Tulis grid search bobot kelipatan 0,1 (jumlah = 1) dan pilih SSE terkecil" },
        { id: "t2", text: "Hitung `r2` dan `selection_tahunan` (residu rata-rata bulanan kali 12), lalu cetak ketiganya" },
      ],
      expected: "LV=0.50 LG=0.10 SV=0.30 SG=0.10 | R2=0.95 | selection=0.44 persen per tahun",
      hints: [
        "Tiga loop bersarang untuk w1, w2, w3; w4 = 10 - w1 - w2 - w3 (dalam satuan 0,1).",
        "SSE = jumlah (fund - tiruan) kuadrat; simpan kombinasi dengan SSE terkecil.",
        "R2 = 1 - SSE / SST; SST = jumlah (fund - rata-rata fund) kuadrat.",
        "Selection tahunan = rata-rata residu bulanan × 12 × 100 (dalam persen).",
      ],
      code: {
        starter: `# RBSA: 12 bulan return dana vs 4 indeks gaya (desimal)\nfund = [0.0176, 0.0186, 0.0085, 0.0273, 0.0178, 0.0225, 0.0009, 0.0188, 0.0125, 0.0130, 0.0059, 0.0290]\nstyles = {\n    "LV": [0.02, 0.01, -0.01, 0.03, 0.00, 0.02, -0.02, 0.01, 0.02, 0.00, -0.01, 0.02],\n    "LG": [0.04, 0.03, 0.02, 0.05, 0.03, 0.04, 0.01, 0.03, 0.05, 0.02, 0.03, 0.04],\n    "SV": [-0.01, 0.02, 0.03, 0.01, 0.04, 0.00, 0.02, 0.03, -0.01, 0.02, 0.01, 0.03],\n    "SG": [0.05, 0.02, 0.04, 0.06, 0.02, 0.05, 0.03, 0.04, 0.02, 0.05, 0.03, 0.06],\n}\nkeys = ["LV", "LG", "SV", "SG"]\n\n# TULIS KODEMU: grid search bobot kelipatan 0,1 -> best_w, best_sse\nbest_sse = None\nbest_w = None\n\n# TULIS KODEMU: r2 dan selection_tahunan dari best_w\nr2 = \nselection_tahunan = \n\nprint(f"LV={best_w[0]:.2f} LG={best_w[1]:.2f} SV={best_w[2]:.2f} SG={best_w[3]:.2f} | R2={r2:.2f} | selection={selection_tahunan:.2f} persen per tahun")`,
        lockLines: 7,
        solution: `# RBSA: 12 bulan return dana vs 4 indeks gaya (desimal)\nfund = [0.0176, 0.0186, 0.0085, 0.0273, 0.0178, 0.0225, 0.0009, 0.0188, 0.0125, 0.0130, 0.0059, 0.0290]\nstyles = {\n    "LV": [0.02, 0.01, -0.01, 0.03, 0.00, 0.02, -0.02, 0.01, 0.02, 0.00, -0.01, 0.02],\n    "LG": [0.04, 0.03, 0.02, 0.05, 0.03, 0.04, 0.01, 0.03, 0.05, 0.02, 0.03, 0.04],\n    "SV": [-0.01, 0.02, 0.03, 0.01, 0.04, 0.00, 0.02, 0.03, -0.01, 0.02, 0.01, 0.03],\n    "SG": [0.05, 0.02, 0.04, 0.06, 0.02, 0.05, 0.03, 0.04, 0.02, 0.05, 0.03, 0.06],\n}\nkeys = ["LV", "LG", "SV", "SG"]\n\n# TULIS KODEMU: grid search bobot kelipatan 0,1 -> best_w, best_sse\nbest_sse = None\nbest_w = None\nfor w1 in range(11):\n    for w2 in range(11 - w1):\n        for w3 in range(11 - w1 - w2):\n            w4 = 10 - w1 - w2 - w3\n            w = [w1 / 10, w2 / 10, w3 / 10, w4 / 10]\n            sse = sum((fund[i] - sum(w[j] * styles[keys[j]][i] for j in range(4))) ** 2 for i in range(12))\n            if best_sse is None or sse < best_sse:\n                best_sse, best_w = sse, w\n\n# TULIS KODEMU: r2 dan selection_tahunan dari best_w\nmean_f = sum(fund) / 12\nsst = sum((x - mean_f) ** 2 for x in fund)\nr2 = 1 - best_sse / sst\nresid = [fund[i] - sum(best_w[j] * styles[keys[j]][i] for j in range(4)) for i in range(12)]\nselection_tahunan = sum(resid) / 12 * 12 * 100\n\nprint(f"LV={best_w[0]:.2f} LG={best_w[1]:.2f} SV={best_w[2]:.2f} SG={best_w[3]:.2f} | R2={r2:.2f} | selection={selection_tahunan:.2f} persen per tahun")`,
        checks: [
          { kind: "equal", task: "t1", name: "best_w", value: [0.5, 0.1, 0.3, 0.1], tol: 0.001, label: "Bobot gaya = 0,50 / 0,10 / 0,30 / 0,10", msg: "Grid search harus menemukan kembali bobot sejati data lab." },
          { kind: "equal", task: "t2", name: "r2", value: 0.949, tol: 0.01, label: "`r2` ≈ 0,95", msg: "94,9 persen variasi return dana dijelaskan oleh gaya." },
          { kind: "equal", task: "t2", name: "selection_tahunan", value: 0.44, tol: 0.05, label: "`selection_tahunan` ≈ 0,44 persen", msg: "Rata-rata residu bulanan × 12 = selection return tahunan." },
          { kind: "stdout_matches", task: "t2", pattern: "LV=0\\.50 LG=0\\.10 SV=0\\.30 SG=0\\.10", label: "`print` menampilkan bobot gaya yang benar", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Bobot 50/10/30/10, R² 0,949, selection 0,44 persen per tahun — gaya menjelaskan hampir semuanya, skill menyisakan sedikit.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: mandat value, perilaku growth",
      prose: [
        "Manajer kedua Dana Pensiun Nusantara bermandat large-value. RBSA kuartal terbaru: LV 25 persen, LG 45 persen, SV 10 persen, SG 20 persen. Bobot growth-nya 45 persen — 25 poin di atas yang dijanjikan mandat value. Holdings-based mengonfirmasi: P/E portofolio 28 kali, sementara benchmark value 14 kali. Kedua lensa sepakat: ini drift, bukan noise.",
        "Pertanyaan: apa tindakan komite? Jawabannya bertingkat. Pertama, panggil manajer dan minta penjelasan tertulis: apakah ini style timing yang disetujui, atau drift diam-diam? Bila alasannya adalah definisi indeks yang berubah, perbarui mandat. Bila tidak ada alasan sah, kirim peringatan tertulis dan tetapkan tenggat satu kuartal untuk kembali.",
        "Kedua, netralkan di level portofolio sementara proses berjalan: tambah completeness fund value senilai selisih drift, sehingga total portofolio kembali ke alokasi 50 persen value dan 50 persen growth yang dirancang. Ketiga, buka renegosiasi fee: manajer yang berperilaku seperti dana growth pasif tidak layak dibayar fee aktif penuh. Bila setelah dua kuartal drift bertahan, ganti manajer — dengan catatan audit RBSA sebagai bukti.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Drift 25 poin melewati ambang peringatan tertulis (20 poin) dan bertahan harus memicu proses penggantian. Kuncinya: kedua lensa sepakat (RBSA dan holdings-based), sehingga vonisnya kuat. Completeness fund adalah obat sementara — bukan pengganti keputusan tentang manajernya.",
      },
      reference: "Drift 25 poin + dua lensa sepakat = peringatan tertulis, completeness fund, dan tenggat satu kuartal.",
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
        "RBSA (Sharpe 1992): regresi return dana ke indeks gaya, bobot non-negatif dijumlahkan 1; sisa = selection return.",
        "Holdings-based: petakan holding ke style box 3x3 lewat rasio dan kapitalisasi — melihat isi hari ini, bukan perilaku tiga tahun.",
        "Lab: bobot 50/10/30/10, R² 0,949, selection 0,44 persen per tahun.",
        "Drift: geser lebih dari 10 poin = panggil; lebih dari 20 poin = peringatan tertulis; bertahan dua kuartal = proses ganti.",
        "Dua lensa sepakat = vonis kuat; kontradiksi = investigasi, jangan percaya satu lensa.",
      ],
      next: { label: "C13 — Manager Selection dan Due Diligence Manajer Investasi", href: "/v2/learn/pm-c13-manager-selection" },
      quiz: [
        {
          q: "RBSA menghasilkan bobot LV 0,50, LG 0,10, SV 0,30, SG 0,10 dengan R² 0,949. Apa arti selection return 0,44 persen per tahun?",
          options: [
            { text: "Return total dana adalah 0,44 persen per tahun", why: "Salah: selection return adalah sisa setelah gaya dikontrol — bukan return total dana." },
            { text: "Nilai tambah dari pilihan saham manajer di luar gaya, setelah gaya menjelaskan 94,9 persen variasi return", why: "Tepat: residu rata-rata adalah bagian return yang tidak dijelaskan indeks gaya — itulah skill pemilihan saham.", correct: true },
            { text: "Fee yang harus dibayar manajer adalah 0,44 persen", why: "Salah: selection return tidak ada hubungannya dengan fee. Fee dibahas terpisah." },
            { text: "Dana itu 0,44 persen lebih berisiko dari benchmark", why: "Salah: selection return adalah ukuran return, bukan ukuran risiko." },
          ],
        },
        {
          q: "RBSA berkata growth, holdings-based berkata value. Apa langkah yang benar?",
          options: [
            { text: "Percaya RBSA — return tidak pernah berbohong", why: "Salah: RBSA bisa tertipu oleh derivatif dan timing. Kontradiksi berarti ada yang belum dipahami." },
            { text: "Percaya holdings-based — isi portofolio adalah kebenaran", why: "Salah: holding bisa basi, dan derivatif tidak terlihat di daftar holding." },
            { text: "Investigasi — periksa derivatif, timing, dan kebaruan data holding sebelum memvonis", why: "Tepat: dua lensa yang kontradiksi adalah sinyal untuk menggali, bukan untuk memilih satu dan membuang yang lain.", correct: true },
            { text: "Abaikan keduanya dan lihat return kuartal terakhir", why: "Salah: return kuartal terakhir tidak menjawab pertanyaan gaya sama sekali." },
          ],
        },
        {
          q: "Manajer bermandat large-value menunjukkan bobot LG 45 persen (mandat menjanjikan growth rendah). Apa vonisnya?",
          options: [
            { text: "Bukan masalah — return-nya bagus", why: "Salah: return bagus tidak membatalkan pelanggaran mandat. Dana itu dibayar untuk value, bukan untuk menumpang reli growth." },
            { text: "Style drift — 25 poin di atas mandat, dikonfirmasi holdings-based (P/E 28 vs benchmark 14)", why: "Tepat: dua lensa sepakat dan pergeserannya melewati ambang peringatan tertulis.", correct: true },
            { text: "Style timing yang sah — manajer boleh mengubah gaya kapan saja", why: "Salah: style timing hanya sah bila tertulis di mandat sebelumnya dan disetujui komite." },
            { text: "Kesalahan data — RBSA tidak bisa dipercaya", why: "Salah: holdings-based mengonfirmasi temuan yang sama. Ini bukan artefak satu metode." },
          ],
        },
        {
          q: "Apa fungsi completeness fund saat terjadi drift?",
          options: [
            { text: "Menggantikan manajer yang drift", why: "Salah: completeness fund tidak menggantikan manajer — ia menetralkan dampak drift di level portofolio." },
            { text: "Menambah dana pelengkap yang mengisi gaya yang hilang, sehingga total portofolio kembali ke alokasi yang dirancang", why: "Tepat: bila manajer value drift ke growth, tambah dana value murni sebagai penyeimbang sementara proses terhadap manajer berjalan.", correct: true },
            { text: "Menambah fee manajer agar ia kembali ke mandat", why: "Salah: menambah fee untuk manajer yang melanggar mandat adalah insentif yang terbalik." },
            { text: "Menutup dana dan mengembalikan uang investor", why: "Salah: itu likuidasi, bukan completeness fund." },
          ],
        },
        {
          q: "Manajer value underperform 5 persen di kuartal ketika saham growth reli 20 persen. Apakah ini style drift?",
          options: [
            { text: "Ya — underperform adalah bukti drift", why: "Salah: underperform saat gayanya sedang tidak disukai pasar adalah siklus gaya, bukan drift." },
            { text: "Tidak — drift adalah soal konsistensi terhadap mandat, bukan soal return satu kuartal", why: "Tepat: manajer value yang underperform saat growth reli sedang menjalankan mandatnya dengan benar. Drift diukur dari bobot gaya, bukan dari return.", correct: true },
            { text: "Ya — bila return jelek, mandat pasti dilanggar", why: "Salah: return jelek bisa datang dari siklus gaya, dari seleksi saham yang buruk, atau dari keduanya — ketiganya hal yang berbeda." },
            { text: "Tidak bisa dinilai tanpa melihat fee-nya", why: "Salah: fee tidak menentukan apakah terjadi drift. Drift ditentukan oleh bobot gaya dan holding." },
          ],
        },
      ],
    },
  ],
};
