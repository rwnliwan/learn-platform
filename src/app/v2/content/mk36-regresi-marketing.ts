import type { V2Lesson } from "../lib/types";

export const mk36: V2Lesson = {
  slug: "mk36-regresi-marketing",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK36 — Regresi untuk Marketing: Dari Korelasi ke Koefisien",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Spend naik, penjualan naik — tetapi berapa tepatnya?",
      prose: [
        "Tim marketing KirimCepat tahu spend dan penjualan berkorelasi — tetapi direksi bertanya lebih tajam: bila spend naik Rp1 juta, penjualan naik berapa? Dan seberapa yakin kita pada angka itu? Korelasi menjawab 'ada hubungan'; regresi menjawab 'seberapa besar, dengan ketidakpastian berapa'.",
        "Analis menjalankan regresi linier sederhana: penjualan atas spend, 5 minggu data. Slope 0,6, intercept 2,2, R-kuadrat 0,6. Terjemahannya: tiap tambahan 1 unit spend dikaitkan dengan 0,6 unit penjualan tambahan; model menjelaskan 60 persen variasi penjualan; 40 persen sisanya dijelaskan faktor lain — musim, kompetitor, dan hal yang tidak diukur.",
        "Lesson ini mengajarkan regresi untuk marketing: OLS, interpretasi koefisien, dan R-kuadrat. Setelah lesson ini kamu bisa: (1) menghitung slope dan intercept OLS dari data kecil; (2) menginterpretasikan koefisien dalam bahasa bisnis; (3) menghitung dan menjelaskan R-kuadrat; (4) membedakan prediksi dari kausalitas; (5) mengenali kapan regresi menyesatkan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Grep seluruh track MK untuk regresi menghasilkan 1 hit: MK9 menyebut koefisien regresi dalam rumus CUPED — tanpa lesson regresi. Tidak ada lesson yang mengajarkan OLS, interpretasi koefisien, atau R-kuadrat di track MK. Lesson ini membangun fondasi itu.",
      },
      reference: "x 1 sampai 5, y 2, 4, 5, 4, 5: slope 0,6; intercept 2,2; R-kuadrat 0,6.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca output regresi seperti membaca laporan — koefisien, kecocokan, dan batasnya.",
        "(1) Menghitung slope dan intercept OLS dari data kecil;",
        "(2) Menginterpretasikan slope dalam bahasa bisnis;",
        "(3) Menghitung R-kuadrat dan menjelaskan artinya;",
        "(4) Membedakan prediksi (apa yang terjadi bersama) dari kausalitas (apa yang menyebabkan);",
        "(5) Mengenali jebakan: outlier, variabel hilang, dan ekstrapolasi.",
      ],
      tasks: [],
    },
    {
      id: "ols",
      eyebrow: "Langkah 3 · Teori",
      title: "OLS: garis yang meminimalkan kuadrat kesalahan",
      prose: [
        "OLS (Ordinary Least Squares) mencari garis yang meminimalkan jumlah kuadrat selisih antara aktual dan prediksi. Slope sama dengan kovariansi x dan y dibagi variansi x; intercept sama dengan rata-rata y dikurangi slope dikali rata-rata x. Data lesson ini: x 1, 2, 3, 4, 5; y 2, 4, 5, 4, 5. Rata-rata x 3, rata-rata y 4. Pembilang slope: (1 dikurangi 3) dikali (2 dikurangi 4) sama dengan 4; (2 dikurangi 3) dikali (4 dikurangi 4) sama dengan 0; (3 dikurangi 3) dikali (5 dikurangi 4) sama dengan 0; (4 dikurangi 3) dikali (4 dikurangi 4) sama dengan 0; (5 dikurangi 3) dikali (5 dikurangi 4) sama dengan 2 — jumlah 6. Penyebut: 4 tambah 1 tambah 0 tambah 1 tambah 4 sama dengan 10. Slope 6 dibagi 10 sama dengan 0,6. Intercept: 4 dikurangi 0,6 dikali 3 sama dengan 2,2.",
        "Interpretasi bisnis: tiap tambahan 1 unit spend dikaitkan dengan 0,6 unit penjualan tambahan — dengan catatan 'dikaitkan', bukan 'menyebabkan'. Intercept 2,2 adalah penjualan saat spend nol — sering kali tidak bermakna (spend nol bukan kondisi nyata), dan tidak boleh dipakai untuk meramal di luar rentang data.",
        "R-kuadrat mengukur seberapa besar variasi y yang dijelaskan garis: 1 dikurangi SSE dibagi SST. SST (total): (2 dikurangi 4) kuadrat tambah (4 dikurangi 4) kuadrat tambah (5 dikurangi 4) kuadrat tambah (4 dikurangi 4) kuadrat tambah (5 dikurangi 4) kuadrat sama dengan 4 tambah 0 tambah 1 tambah 0 tambah 1 sama dengan 6. SSE (residual): prediksi 2,8, 3,4, 4,0, 4,6, 5,2 melawan aktual 2, 4, 5, 4, 5 — selisih kuadrat 0,64, 0,36, 1, 0,36, 0,04 — jumlah 2,4. R-kuadrat: 1 dikurangi 2,4 dibagi 6 sama dengan 0,6. Model menjelaskan 60 persen variasi penjualan.",
      ],
      tasks: [],
      note: {
        title: "Regresi bukan kausalitas",
        body: "Slope 0,6 tidak membuktikan spend menyebabkan penjualan — bisa jadi musim ramai menaikkan keduanya. Kausalitas butuh eksperimen (MK9, MK10) atau desain yang mengisolasi. Regresi memberi prediksi dan asosiasi; klaim sebab-akibat butuh bukti yang lebih kuat.",
      },
      reference: "Slope 0,6; intercept 2,2; SST 6; SSE 2,4; R-kuadrat 0,6.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 4 · Teori",
      title: "Tiga jebakan: outlier, variabel hilang, ekstrapolasi",
      prose: [
        "Outlier: satu minggu promo besar bisa menarik garis regresi ke arahnya — slope yang dihasilkan mencerminkan promo itu, bukan hubungan normal. Periksa residual terbesar dan tanyakan apakah minggu itu istimewa; bila ya, laporkan regresi dengan dan tanpa minggu itu.",
        "Variabel hilang (omitted variable): bila musim memengaruhi spend dan penjualan sekaligus, slope spend menyerap efek musim — tetapi ARAH biasnya tergantung korelasi: bila musim ramai menaikkan spend DAN penjualan, slope terlihat LEBIH besar dari yang sebenarnya; bila musim menekan spend tetapi menaikkan penjualan (atau sebaliknya), slope bisa terlihat lebih KECIL — bahkan berbalik tanda. Tanpa tahu arah korelasinya, jangan menebak arah biasnya. Solusinya: masukkan variabel musim ke model (regresi berganda), atau akui bahwa slope itu bias. Regresi satu variabel yang mengabaikan musim adalah regresi yang berbohong dengan sopan.",
        "Ekstrapolasi: model dilatih pada spend 1 sampai 5 — meramal spend 50 dengan garis yang sama mengasumsikan hubungan linier berlanjut tanpa batas, padahal diminishing returns (MK35) memastikan ia melambat. Aturan: jangan meramal jauh di luar rentang data latih.",
      ],
      tasks: [],
      reference: "Outlier menarik garis; variabel hilang membiaskan slope; ekstrapolasi mengasumsikan linier tanpa batas.",
    },
    {
      id: "lab-regresi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung OLS dan R-kuadrat",
      prose: [
        "Lab ini menghitung slope, intercept, dan R-kuadrat OLS dari 5 titik data.",
        "Hitung dulu di kepala. Slope 0,6 dan intercept 2,2 seperti di langkah teori. R-kuadrat: SST 6, SSE 2,4 — 1 dikurangi 2,4 dibagi 6 sama dengan 0,6.",
        "Tugas lab: tulis fungsi yang menerima daftar x dan y, lalu mencetak tiga angka: slope, intercept, r2.",
        "Setelah lolos, coba eksperimen: ubah y terakhir menjadi 9 dan lihat slope melonjak — satu outlier mengubah seluruh garis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung slope OLS" },
        { id: "t2", text: "Hitung intercept OLS" },
        { id: "t3", text: "Hitung r2 dari SST dan SSE" },
      ],
      expected: "slope=0.6\nintercept=2.2\nr2=0.6",
      hints: [
        "Slope = jumlah (x dikurangi rata-rata x) dikali (y dikurangi rata-rata y), dibagi jumlah (x dikurangi rata-rata x) kuadrat.",
        "Intercept = rata-rata y dikurangi slope dikali rata-rata x.",
        "R2 = 1 dikurangi SSE dibagi SST.",
      ],
      code: {
        starter: `# 5 minggu: spend (x) dan penjualan (y).\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\n\n# TULIS KODEMU: hitung slope, intercept, r2.\n# Cetak, per baris: slope, intercept, r2.\n\n\nmesin_regresi(x, y)`,
        lockLines: 3,
        solution: `# 5 minggu: spend (x) dan penjualan (y).\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\n\n\ndef mesin_regresi(x, y):\n    n = len(x)\n    rata_x = sum(x) / n\n    rata_y = sum(y) / n\n    pembilang = 0\n    penyebut = 0\n    for xi, yi in zip(x, y):\n        pembilang = pembilang + (xi - rata_x) * (yi - rata_y)\n        penyebut = penyebut + (xi - rata_x) * (xi - rata_x)\n    slope = pembilang / penyebut\n    intercept = rata_y - slope * rata_x\n    sst = 0\n    sse = 0\n    for xi, yi in zip(x, y):\n        sst = sst + (yi - rata_y) * (yi - rata_y)\n        prediksi = intercept + slope * xi\n        sse = sse + (yi - prediksi) * (yi - prediksi)\n    r2 = 1 - sse / sst\n    print(f"slope={round(slope, 1)}")\n    print(f"intercept={round(intercept, 1)}")\n    print(f"r2={round(r2, 1)}")\n\n\nmesin_regresi(x, y)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "slope=0.6", label: "Slope 0,6", msg: "Pembilang 6 / penyebut 10 = 0,6." },
          { kind: "stdout_matches", task: "t2", pattern: "intercept=2.2", label: "Intercept 2,2", msg: "4 - 0,6 x 3 = 2,2." },
          { kind: "stdout_matches", task: "t3", pattern: "r2=0.6", label: "R-kuadrat 0,6", msg: "1 - 2,4 / 6 = 0,6. Model menjelaskan 60 persen variasi." },
        ],
      },
      note: {
        title: "Ketidakpastian koefisien (kenapa n=5 berbahaya)",
        body: "Standard error slope = akar(SSE/(n-2) dibagi Sxx) = akar(2,4/3 dibagi 10) = akar(0,08) ≈ 0,2828. Interval kepercayaan 95 persen memakai t kritis df=3, yaitu 3,182: 0,6 ± 3,182 x 0,2828 = 0,6 ± 0,90 — interval (-0,30; 1,50). Interval itu mencakup NOL: pada 5 data, slope 0,6 tidak signifikan secara statistik — ia bisa nol, bisa 1,5. Jangan memakai slope dari 5 titik untuk budget Rp500 juta.",
      },
      reference: "Slope 0,6; intercept 2,2; R-kuadrat 0,6.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: slope 0,6 yang hampir dipakai untuk budget Rp500 juta",
      prose: [
        "Kembali ke KirimCepat. Analis hampir memakai slope 0,6 untuk meramal penjualan pada spend 50 — ekstrapolasi 10x lipat dari rentang data. Reviewer menghentikannya: diminishing returns memastikan hubungan melambat; ramalan linier di spend 50 akan melebih-lebihkan penjualan dan membenarkan budget yang terlalu besar.",
        "Regresi dipakai dengan benar: untuk memahami hubungan di rentang data, dan untuk menguji apakah musim menjelaskan 40 persen sisanya. Variabel musim dimasukkan — R-kuadrat naik menjadi 0,85, dan slope spend turun menjadi 0,4: sebagian dari 0,6 ternyata efek musim. Tetapi 'dibersihkan musim' bukan berarti dibersihkan dari SEMUA pengganggu: kompetitor, promo, dan hal tak terukur lain masih bisa membiaskan slope 0,4. Dan geo-experiment tidak 'memastikan' kausalitas — ia memperkuat bukti kausal bila dirancang dan dijalankan dengan benar, dengan kota perlakuan dan kontrol yang sebanding. Keputusan budget memakai slope 0,4 dengan catatan itu — bukan sebagai angka final.",
        "Keputusan rapat: output regresi wajib melampirkan rentang data, R-kuadrat, dan daftar variabel yang tidak dimasukkan — supaya pembaca tahu apa yang tidak dijelaskan model.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat regresi ini berguna. Pertama, tidak ada ekstrapolasi — ramalan hanya di rentang data. Kedua, variabel hilang dicari dan dimasukkan — slope dibersihkan dari efek musim, tetapi belum tentu dari semua pengganggu. Ketiga, kausalitas tidak diklaim — eksperimen yang memastikan.",
      },
      reference: "Slope 0,6 turun menjadi 0,4 setelah musim dimasukkan; R-kuadrat 0,85. Ekstrapolasi ke spend 50 dicegah.",
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
        "Lab: slope 0,6; intercept 2,2; R-kuadrat 0,6.",
        "Slope dibaca 'dikaitkan', bukan 'menyebabkan' — kausalitas butuh eksperimen.",
        "R-kuadrat 0,6: model menjelaskan 60 persen variasi; 40 persen faktor lain.",
        "Outlier menarik garis; variabel hilang membiaskan slope; ekstrapolasi menyesatkan.",
        "Jangan meramal jauh di luar rentang data latih.",
      ],
      next: { label: "MK37 — Python untuk Marketing: Analisis Tanpa Spreadsheet", href: "/v2/learn/mk37-python-untuk-marketing" },
      quiz: [
        {
          q: "x 1 sampai 5, y 2, 4, 5, 4, 5. Berapa slope, intercept, dan R-kuadrat OLS?",
          options: [
            { text: "Slope 0,6; intercept 2,2; R-kuadrat 0,4 — SSE disalahartikan", why: "Salah: R-kuadrat = 1 - 2,4/6 = 0,6, bukan 0,4." },
            { text: "Slope 1,0; intercept 1,0; R-kuadrat 0,6", why: "Salah: slope bukan 1,0 — hitung pembilang dan penyebutnya." },
            { text: "Slope 0,6; intercept 2,2; R-kuadrat 0,6", why: "Tepat: pembilang 6 / penyebut 10 = 0,6; intercept 4 - 1,8 = 2,2; 1 - 2,4/6 = 0,6.", correct: true },
            { text: "Slope 0,6; intercept 4,0; R-kuadrat 0,6", why: "Salah: intercept = rata-rata y dikurangi slope dikali rata-rata x = 4 - 1,8 = 2,2." },
          ],
        },
        {
          q: "Apa interpretasi slope 0,6 yang benar?",
          options: [
            { text: "Tiap tambahan 1 unit spend MENYEBABKAN 0,6 unit penjualan tambahan", why: "Salah: regresi memberi asosiasi, bukan kausalitas — kata 'menyebabkan' butuh eksperimen." },
            { text: "Spend menjelaskan 60 persen penjualan", why: "Salah: itu interpretasi R-kuadrat, bukan slope." },
            { text: "Penjualan selalu 0,6 dikali spend", why: "Salah: ada intercept 2,2 — penjualan bukan 0,6 dikali spend saja." },
            { text: "Tiap tambahan 1 unit spend DIKAITKAN dengan 0,6 unit penjualan tambahan", why: "Tepat: 'dikaitkan' adalah klaim yang didukung regresi observasional.", correct: true },
          ],
        },
        {
          q: "R-kuadrat 0,6. Apa artinya?",
          options: [
            { text: "Model menjelaskan 60 persen variasi penjualan; 40 persen faktor lain", why: "Tepat: itulah definisi R-kuadrat.", correct: true },
            { text: "Model benar 60 persen", why: "Salah: R-kuadrat bukan persen kebenaran — melainkan persen variasi yang dijelaskan." },
            { text: "Slope-nya 60 persen akurat", why: "Salah: R-kuadrat tidak mengukur akurasi slope." },
            { text: "60 persen data cocok sempurna dengan garis", why: "Salah: tidak ada titik yang cocok sempurna — R-kuadrat adalah agregat, bukan hitungan titik." },
          ],
        },
        {
          q: "Musim memengaruhi spend dan penjualan, tetapi tidak dimasukkan ke model. Apa akibatnya?",
          options: [
            { text: "Tidak ada — musim bukan variabel marketing", why: "Salah: variabel yang memengaruhi x dan y sekaligus membiaskan slope bila diabaikan." },
            { text: "Slope spend menyerap efek musim — terlihat lebih besar dari sebenarnya", why: "Tepat: itulah omitted variable bias — slope 0,6 turun menjadi 0,4 setelah musim dimasukkan.", correct: true },
            { text: "R-kuadrat menjadi 1,0", why: "Salah: mengabaikan variabel justru menurunkan R-kuadrat." },
            { text: "Intercept menjadi nol", why: "Salah: intercept tidak ada hubungannya dengan variabel hilang." },
          ],
        },
        {
          q: "Model dilatih pada spend 1 sampai 5. Meramal spend 50 dengan garis yang sama adalah apa?",
          options: [
            { text: "Praktik yang baik — garis berlaku di mana saja", why: "Salah: ekstrapolasi 10x lipat mengasumsikan linier tanpa batas, padahal diminishing returns melambatkannya." },
            { text: "Wajib — itulah gunanya model", why: "Salah: gunanya model adalah memahami hubungan di rentang data, bukan meramal tanpa batas." },
            { text: "Ekstrapolasi berbahaya — jangan meramal jauh di luar rentang data", why: "Tepat: hubungan bisa melambat atau berubah bentuk di luar rentang.", correct: true },
            { text: "Aman bila R-kuadrat di atas 0,5", why: "Salah: R-kuadrat tinggi di rentang data tidak menjamin bentuk hubungan di luar rentang." },
          ],
        },
      ],
    },
  ],
};
