import type { V2Lesson } from "../lib/types";

const FIG_RANK = `<svg viewBox="0 0 480 260" role="img" aria-label="Rank mengubah nilai mentah menjadi skor 0 sampai 1.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">rank: dari nilai mentah ke skor 0–1</text>
<text x="16" y="52" font-size="11" fill="var(--chart-text)">Nilai mentah:  -8%   -1%   +3%   +12%</text>
<text x="16" y="80" font-size="11" fill="var(--chart-text)">Peringkat:      1      2      3      4</text>
<text x="16" y="108" font-size="11" fill="var(--chart-text)">rank:        0,00   0,33   0,67   1,00</text>
<rect x="16" y="126" width="440" height="24" fill="var(--c1)" opacity="0.25"/>
<rect x="16" y="126" width="110" height="24" fill="var(--c1)" opacity="0.9"/>
<rect x="126" y="126" width="110" height="24" fill="var(--c1)" opacity="0.65"/>
<rect x="236" y="126" width="110" height="24" fill="var(--c1)" opacity="0.4"/>
<rect x="346" y="126" width="110" height="24" fill="var(--c1)" opacity="0.15"/>
<text x="16" y="172" font-size="11" fill="var(--chart-text)">Cara membaca: makin gelap = rank makin tinggi (diurutkan lintas saham).</text>
<text x="16" y="192" font-size="11" fill="var(--chart-text)">Interpretasi: outlier +12% tidak 'meledak' — ia hanya 'peringkat 1'. Rank kebal outlier.</text>
</g>
</svg>`;

export const wqb10: V2Lesson = {
  slug: "wqb10-fastexpr",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB10 — FASTEXPR & Operator Inti: Menulis Alpha Pertamamu",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu baris yang mengalahkan 40 halaman",
      prose: [
        "Seorang analis menulis laporan 40 halaman: 'saham-saham yang harganya di bawah rata-rata 5 hariannya cenderung memantul.' Manajernya membaca ringkasannya, lalu menulis SATU baris di platform: rank(ts_mean(close, 5) − close). Tiga menit kemudian hasil simulasinya keluar: Sharpe 1,4. 'Itu seluruh laporanmu,' katanya, 'dalam satu baris.'",
        "Analis itu tidak tersinggung — ia tercerahkan. Empat puluh halamannya menjelaskan SATU ide; satu baris itu MENGUJI ide tersebut pada 3000 saham × 10 tahun data dalam tiga menit. FASTEXPR bukan bahasa pemrograman baru; ia adalah cara menulis ide alpha sepadat mungkin agar bisa diuji secepat mungkin.",
        "Twist-nya: satu baris itu BUKAN sihir — ia hanya gabungan operator-operator sederhana yang masing-masing bisa dipahami anak SMA: rata-rata, peringkat, selisih. Kekuatannya bukan pada kerumitan, melainkan pada komposisinya: operator sederhana × kombinasi cerdas = ribuan ide teruji. Lesson ini membedah operatornya satu per satu, lalu merakitnya kembali.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan rank, ts_mean, ts_std_dev, ts_corr, ts_decay_linear, ts_backfill, ts_delay, group_neutralize; (2) membaca ekspresi FASTEXPR dari dalam ke luar; (3) menerjemahkan ide bahasa manusia menjadi ekspresi; (4) mengimplementasikan rank & ts_mean di Python; (5) menghindari jebakan komposisi operator.",
      ],
      tasks: [],
      note: {
        title: "Lego alpha",
        body: "Operator FASTEXPR = balok lego. Masing-masing sederhana; kombinasinya tak terbatas. Keahlian bukan menghafal 100 operator — melainkan merakit 8 operator inti menjadi ide yang tajam.",
      },
      reference: "Satu baris teruji > 40 halaman tak teruji.",
    },
    {
      id: "operator-dasar",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat sekawan: rank, ts_mean, ts_std_dev, ts_delay",
      prose: [
        "rank(x): untuk setiap hari, urutkan x lintas SEMUA saham dan ubah menjadi skor 0–1 (terendah = 0, tertinggi = 1). Intuisi: 'seberapa ekstrem saham ini dibanding yang lain hari ini?' Keajaibannya: kebal outlier — return +50% tidak meledak, ia hanya 'peringkat 1'. Contoh: return [−8%, −1%, +3%, +12%] → rank [0,00, 0,33, 0,67, 1,00].",
        "ts_mean(x, n): rata-rata x selama n hari terakhir (time series). ts_std_dev(x, n): simpangan baku n hari — ukuran 'kegelisahan'. ts_delay(x, 1): nilai x kemarin — operator delay yang jujur. (Recap: delay adalah jeda wajib antara data yang dipakai sinyal dan eksekusi — delay 1 berarti sinyal dihitung dari data kemarin, posisi dibuka hari ini. Tanpanya, backtest memakai masa depan.)",
        "Contoh gabungan: ts_mean(close, 5) − close. Untuk saham X: rata-rata 5 hari = 105, close hari ini = 100 → selisih +5 (harga di bawah rata-rata → 'murah relatif'). Untuk saham Y: rata-rata 98, close 100 → −2 ('mahal relatif'). Bungkus rank(...): rank memberi skor 0–1 lintas saham — X dapat skor tinggi (kandidat dibeli), Y rendah.",
        "Cara membaca figur: empat nilai mentah → peringkat → skor 0–1; kotak makin gelap = rank makin tinggi. Interpretasi: rank menormalkan skala — saham Rp100 dan Rp100.000 bisa dibandingkan adil karena yang dibandingkan POSISInya, bukan angkanya.",
        "Satu catatan penting tentang arah: rank SELALU menaik (tertinggi = 1). Bila hipotesismu 'yang terendah yang bagus' (mis. saham paling tidak volatil), tulis rank(-x) — tanda minus membalik urutan. Lupa tanda minus = strategi yang membeli persis kebalikan dari yang dimaksud. Ini bug paling umum di minggu pertama setiap peneliti: ekspresi 'benar' yang trading-nya terbalik.",
      ],
      formula: String.raw`\text{rank}(x_i) = \frac{\text{peringkat}(x_i) - 1}{N - 1}`,
      formulaNote: "x_i = nilai saham i, N = jumlah saham hari itu. Peringkat 1 (terendah) → 0; peringkat N (tertinggi) → 1. Skala selalu 0–1 apa pun satuan x.",
      figure: {
        svg: FIG_RANK,
        alt: "Nilai mentah diubah menjadi peringkat lalu skor rank 0 sampai 1.",
        caption: "rank = posisi relatif. Kebal outlier, skala selalu 0–1.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“rank(0,8) berarti return 80%.” Bukan — rank tidak punya satuan return. 0,8 berarti 'lebih tinggi dari 80% saham hari ini'. Lupa ini = salah membaca seluruh ekspresi.",
      },
      hints: [
        "Baca ekspresi dari DALAM ke luar: ts_mean dulu, lalu selisih, lalu rank.",
        "rank selalu lintas saham (cross-sectional), ts_* selalu lintas waktu (time series).",
      ],
      reference: "rank = posisi 0–1. ts_* = melintasi waktu.",
    },
    {
      id: "operator-lanjut",
      eyebrow: "Langkah 3 · Konsep",
      title: "Empat sekawan kedua: ts_corr, ts_decay_linear, ts_backfill, group_neutralize",
      prose: [
        "ts_corr(a, b, n): korelasi deret a dan b selama n hari. Contoh pemenang: ts_corr(high, low, 60) — 'seberapa sinkron high dan low 60 hari terakhir' (ukuran stabilitas intraday). ts_corr(est_epsr, est_fcf, 30) — 'seberapa kompak analis soal laba vs kas'.",
        "ts_decay_linear(x, d): rata-rata tertimbang linear dengan bobot turun hingga nol di umur d (persis lesson decay). ts_backfill(x, n): isi lubang dengan nilai terakhir dalam n hari. group_neutralize(x, subindustry): kurangkan rata-rata grup subindustry (persis lesson neutralization) — versi operatornya.",
        "Merakit contoh nyata (disederhanakan dari pemenang): 0.5 × rank(ts_mean(close,10) − close) × rank(ts_corr(high,low,60)) + 0.5 × rank(−ts_corr(est_epsr, est_fcf,30)). Baca: 'setengah bobot pada saham murah-relatif yang stabil intraday-nya, setengah pada kebalikan dari kekompakan analis' — dua ide independen dalam satu baris.",
        "Jebakan komposisi: operator tidak komutatif secara makna — rank(ts_mean(x,5)) ('rata-rata dulu, lalu peringkat') BERBEDA dari ts_mean(rank(x),5) ('peringkat dulu, lalu rata-rata'). Urutan = makna. Selalu baca dari dalam.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Urutan operator tidak penting, yang penting bahannya sama.” Salah total: rank(ts_mean(close,5)) vs ts_mean(rank(close),5) adalah dua alpha berbeda dengan perilaku berbeda. Dalam FASTEXPR, urutan ADALAH strateginya.",
      },
      hints: [
        "ts_corr butuh DUA deret + window: ts_corr(a, b, n).",
        "group_neutralize(x, subindustry) = demean per grup. (Recap: untuk tiap grup subindustry, kurangkan rata-rata grup dari tiap nilai — jumlah per grup menjadi 0, dan yang tersisa hanya keunggulan relatif terhadap tetangga se-industri.)",
      ],
      reference: "Urutan operator = makna. Baca dari dalam ke luar.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab",
      title: "Rakit rank(ts_mean(close,5) − close)",
      prose: [
        "Data mainan: 3 saham × 7 hari harga close. Tugasmu: (1) tulis ts_mean(close, 5) — rata-rata 5 hari terakhir per saham; (2) tulis rank lintas 3 saham untuk hari terakhir: skor = (peringkat−1)/(N−1); (3) gabungkan: skor = rank(ts_mean_5 − close_terakhir); (4) cetak peringkat saham (tertinggi = beli).",
        "Eksperimen setelah selesai: ganti window 5 → 3. Saham mana yang naik peringkat? Jelaskan kenapa window pendek lebih 'gelisah'.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `ts_mean(data, 5)` → rata-rata 5 hari terakhir" },
        { id: "t2", text: "Tulis `rank(vals)` → skor 0–1 lintas saham" },
        { id: "t3", text: "Gabungkan & cetak peringkat akhir" },
      ],
      expected: "Skor: {'B': 0.0, 'C': 0.5, 'A': 1.0}\nBeli: A",
      note: {
        title: "Intuisi",
        body: "Lab ini adalah 'kompiler mental' FASTEXPR: kamu baru saja mengeksekusi rank(ts_mean(close,5) − close) dengan tangan. Setiap ekspresi satu baris di platform = lab seperti ini × 3000 saham × 2500 hari.",
      },
      hints: [
        "ts_mean = sum(data[-5:]) / 5.",
        "rank: urutkan nilai, skor = posisi/(N-1).",
      ],
      code: {
        starter: "# Harga close 3 saham x 7 hari. JANGAN UBAH.\nharga = {\n    \"A\": [100, 102, 101, 99, 98, 97, 96],\n    \"B\": [50, 51, 52, 53, 54, 55, 56],\n    \"C\": [200, 198, 202, 200, 199, 201, 200],\n}\n\n# TULIS KODEMU\ndef ts_mean(data, n):\n    return  # rata-rata n hari terakhir\n\ndef rank(vals):\n    return  # dict nama -> skor 0-1\n\nm5 = {s: ts_mean(h, 5) for s, h in harga.items()}\nterakhir = {s: h[-1] for s, h in harga.items()}\nselisih = {s: m5[s] - terakhir[s] for s in harga}\nskor = rank(selisih)\nprint(f\"Skor: {skor}\")\nprint(f\"Beli: {max(skor, key=lambda s: skor[s])}\")\n",
        lockLines: 7,
        solution: "# Harga close 3 saham x 7 hari. JANGAN UBAH.\nharga = {\n    \"A\": [100, 102, 101, 99, 98, 97, 96],\n    \"B\": [50, 51, 52, 53, 54, 55, 56],\n    \"C\": [200, 198, 202, 200, 199, 201, 200],\n}\n\n# TULIS KODEMU\ndef ts_mean(data, n):\n    return sum(data[-n:]) / n\n\ndef rank(vals):\n    urut = sorted(vals, key=lambda s: vals[s])\n    n = len(vals)\n    return {s: round(i / (n - 1), 2) if n > 1 else 0.0 for i, s in enumerate(urut)}\n\nm5 = {s: ts_mean(h, 5) for s, h in harga.items()}\nterakhir = {s: h[-1] for s, h in harga.items()}\nselisih = {s: m5[s] - terakhir[s] for s in harga}\nskor = rank(selisih)\nprint(f\"Skor: {skor}\")\nprint(f\"Beli: {max(skor, key=lambda s: skor[s])}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t3", label: "Skor benar", msg: "A: mean 98,2−96=2,2 (tertinggi); B: 54−56=−2 (terendah); C: 200,4−200=0,4.", pattern: "Skor: \\{'B': 0\\.0, 'C': 0\\.5, 'A': 1\\.0\\}" },
          { kind: "stdout_matches", task: "t3", label: "Beli A", msg: "Skor tertinggi = A.", pattern: "Beli: A" }
        ],
      },
      reference: "Kompiler mental: dalam → luar, satu operator sekali waktu.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Operator untuk tiap ide",
      prose: [
        "Satu: ide 'murah/mahal relatif' → rank(ts_mean(close,n) − close). Dua: ide 'kegelisahan' → rank(ts_std_dev(returns,n)). Tiga: ide 'hubungan dua hal' → ts_corr(a,b,n). Empat: ide 'percaya data lama secukupnya' → ts_decay_linear(x,d). Lima: ide 'bandingkan dengan tetangga se-industri' → group_neutralize(x, subindustry). Enam: ide 'data kemarin' → ts_delay(x,1).",
        "Aturan praktis 10 detik: tulis idemu dalam satu kalimat bahasa manusia dulu ('saham yang X cenderung Y') — bila tidak bisa, operator apa pun tidak akan menyelamatkanmu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "FASTEXPR menghukum ide kabur: bila kamu tidak bisa menjelaskan idemu dalam satu kalimat, ekspresinya akan menjadi rantai operator tanpa makna — dan hasilnya biasanya noise yang terlihat seperti sinyal.",
      },
      reference: "Satu kalimat dulu, satu baris kemudian.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Terjemahkan: 'turun 3 hari → rebound'",
      prose: [
        "Data: ide dalam bahasa manusia — 'saham yang turun 3 hari berturut-turut cenderung rebound besok.' Tugas: tulis ekspresinya.",
        "Pertanyaan + pembahasan: (1) 'turun 3 hari' = close < ts_delay(close,1) tiga hari beruntun — versi sederhana: rank(close − ts_mean(close,3)) rendah = turun di bawah rata-rata 3 hari. (2) Ekspresi: rank(ts_mean(close,3) − close) — skor tinggi untuk yang paling 'tenggelam'. (3) Cek silang: delay sudah diwakili ts_delay implisit? Tidak — tambahkan pertimbangan delay 1 di settings simulasi, bukan di ekspresi. (4) Pelajaran: menerjemahkan = memilih operator untuk tiap frasa; frasa tanpa operator = bagian ide yang belum tajam.",
        "Contoh kedua — 'saham yang volatilitasnya meledak minggu ini': (1) 'volatilitas meledak' = ts_std_dev(returns,5) jauh di atas normalnya → rank(ts_std_dev(returns,5)) tinggi. (2) 'minggu ini' menentukan window: 5 hari. (3) Ekspresi: rank(ts_std_dev(returns,5)) — tetapi hati-hati: ini memilih yang PALING bergejolak, yang sering berarti 'paling berbahaya', bukan 'paling prospektif'. Arah skor (long vs short) ditentukan oleh HYPOTHESIS-mu: bila hipotesisnya 'volatilitas tinggi = panic selling = rebound', maka skor tinggi = beli; bila 'volatilitas tinggi = ketidakpastian = hindari', maka balik: rank(-ts_std_dev(returns,5)). Operator sama, tanda beda, strategi berlawanan — inilah kenapa satu kalimat hipotesis wajib ditulis SEBELUM ekspresi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kemampuan menerjemahkan bahasa manusia → spesifikasi formal adalah inti risk modeling juga: 'debitur berisiko' harus menjadi 'PD > 5% dalam 12 bulan'. Yang tidak bisa diformalkan tidak bisa diuji — di alpha maupun di risiko kredit.",
      },
      reference: "Tiap frasa → satu operator. Frasa tanpa operator = ide belum tajam.",
    },
    {
      id: "lab-urutan",
      eyebrow: "Langkah 7 · Lab",
      title: "Kompiler mental: urutan evaluasi",
      prose: [
        "Aturan emas: baca ekspresi dari DALAM ke luar — operator paling dalam dievaluasi dulu. Tugasmu: tulis fungsi `urutan(e)` yang menemukan tiap operator (nama diikuti '('), menghitung kedalaman kurungnya, dan mencetak urutan evaluasi (terdalam dulu). Uji pada dua ekspresi.",
        "Eksperimen setelah selesai: uji pada 'ts_mean(rank(close),5)' — apa urutannya? Bandingkan dengan 'rank(ts_mean(close,5))' dan jelaskan kenapa keduanya alpha berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `urutan(e)` → list operator terurut terdalam-dulu" },
        { id: "t2", text: "Cetak urutan untuk 2 ekspresi" },
      ],
      expected: "rank(ts_mean(close,5)-close):\n  1. ts_mean\n  2. rank\ngroup_neutralize(rank(ts_corr(high,low,20)),subindustry):\n  1. ts_corr\n  2. rank\n  3. group_neutralize",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Baca dari kiri ke kanan seperti kalimat.” Ekspresi bukan kalimat — ia pohon. 'rank' di paling kiri justru dievaluasi TERAKHIR. Membaca kiri-ke-kanan = memahami terbalik.",
      },
      hints: [
        "Kedalaman operator = jumlah '(' sebelum posisinya dikurangi ')' sebelum posisinya.",
        "Urutkan menurun berdasarkan kedalaman.",
      ],
      code: {
        starter: "# Dua ekspresi. JANGAN UBAH.\nekspresi = [\"rank(ts_mean(close,5)-close)\",\n            \"group_neutralize(rank(ts_corr(high,low,20)),subindustry)\"]\nOPS = [\"rank\", \"ts_mean\", \"ts_corr\", \"ts_decay_linear\", \"group_neutralize\"]\n\n# TULIS KODEMU\ndef urutan(e):\n    return  # list operator, terdalam dulu\n\nfor e in ekspresi:\n    print(f\"{e}:\")\n    for i, o in enumerate(urutan(e), 1):\n        print(f\"  {i}. {o}\")\n",
        lockLines: 4,
        solution: "# Dua ekspresi. JANGAN UBAH.\nekspresi = [\"rank(ts_mean(close,5)-close)\",\n            \"group_neutralize(rank(ts_corr(high,low,20)),subindustry)\"]\nOPS = [\"rank\", \"ts_mean\", \"ts_corr\", \"ts_decay_linear\", \"group_neutralize\"]\n\n# TULIS KODEMU\ndef urutan(e):\n    temu = []\n    for o in OPS:\n        i = e.find(o + \"(\")\n        if i >= 0:\n            depth = e[:i].count(\"(\") - e[:i].count(\")\")\n            temu.append((depth, o))\n    return [o for _, o in sorted(temu, reverse=True)]\n\nfor e in ekspresi:\n    print(f\"{e}:\")\n    for i, o in enumerate(urutan(e), 1):\n        print(f\"  {i}. {o}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `urutan` ada", msg: "Definisikan def urutan(e).", name: "urutan" },
          { kind: "stdout_matches", task: "t2", label: "ts_mean dievaluasi dulu", msg: "Terdalam = pertama.", pattern: "  1\\. ts_mean" },
          { kind: "stdout_matches", task: "t2", label: "group_neutralize terakhir", msg: "Terluar = terakhir.", pattern: "  3\\. group_neutralize" }
        ],
      },
      reference: "Ekspresi = pohon, bukan kalimat. Dari dalam ke luar.",
    },
    {
      id: "fastexpr-lanjut",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Semantik vektor & jebakan cross-sectional vs time-series",
      prose: [
        "Setiap ekspresi FASTEXPR dievaluasi pada grid dua dimensi: sumbu saham (ribuan) × sumbu hari (ribuan). Tiga jenis operator memotong grid ini secara berbeda. Operator cross-sectional (rank, group_neutralize): bekerja MENURUN sumbu saham — satu hari, semua saham, satu perhitungan per hari. Operator time-series (ts_mean, ts_corr, ts_decay_linear): bekerja MENYUSUR sumbu waktu — satu saham, jendela n hari, satu perhitungan per saham per hari. Operator elementwise (+, −, ×, /): menggabungkan sel per sel. Memahami 'arah potong' tiap operator = memahami seluruh bahasa ini.",
        "Jebakan pertama — rank di dalam vs di luar ts_mean, dengan angka. Tiga saham, harga 3 hari: A [100, 102, 104], B [50, 51, 52], C [200, 190, 180]. rank(ts_mean(close, 2)) di hari ke-3: rata-rata 2 hari → A 103, B 51.5, C 185 → rank → C 1.0, A 0.5, B 0.0 ('rata-rata harga tertinggi'). ts_mean(rank(close), 2): rank harian dulu — hari ke-2: C 1.0, A 0.5, B 0.0; hari ke-3: C 1.0, A 0.5, B 0.0 → rata-rata peringkat → C 1.0, A 0.5, B 0.0. Di contoh ini hasilnya kebetulan sama — dan justru itu jebakannya: pada data nyata keduanya DIVERGEN. Yang pertama memeringkat LEVEL harga (bias ke saham mahal); yang kedua memeringkat KONSISTENSI posisi harian. Aturan: tanyakan 'apa yang saya peringkatkan — level atau perilaku?'",
        "Jebakan kedua — NaN merambat diam-diam. ts_corr(high, low, 60) pada 30 hari pertama sejarah saham = NaN (data kurang dari window). NaN × angka = NaN; rank(NaN) = NaN; satu NaN di tengah rantai meracuni seluruh ekspresi untuk saham itu — tanpa error, tanpa peringatan. Pertahanan berlapis: ts_backfill SEBELUM operator berjendela (isi lubang dulu), dan waspadai saham muda (IPO) yang NaN-nya sistematis. Aturan: bila alphamu 'bekerja di saham tua, mati di saham muda', tersangka pertamanya NaN window, bukan sinyal.",
        "Jebakan ketiga — look-ahead tersamar dalam ekspresi. ts_mean(close, 5) memakai close HARI INI — dengan delay 1 di settings, platform menggesernya dengan benar (recap: delay = jeda wajib antara data sinyal dan eksekusi; delay 1 berarti sinyal dari data kemarin dieksekusi hari ini). Tetapi pola berbahaya: memakai field yang SECARA DEFINISI mengandung masa depan — misalnya fundamental bertanggal periode fiskal, bukan tanggal pengumuman (tanggal pengetahuan vs tanggal periode). Operator tidak bisa menyelamatkanmu dari bahan yang bohong tanggal. Jebakan keempat — pembagian oleh nol: x / ts_std_dev(returns, 20) meledak saat saham flat 20 hari (std = 0). Idiom aman: jangan pernah membagi dengan besaran yang bisa nol tanpa pengaman (winsorize pembagi atau tambah epsilon kecil).",
        "Contoh lengkap dengan angka dan interpretasi. Ekspresi: group_neutralize(rank(ts_corr(returns, volume, 20)) × rank(-ts_decay_linear(close − ts_mean(close, 20), 10)), subindustry). Dibaca dari dalam: (1) close − ts_mean(close, 20) = deviasi dari rata-rata 20 hari; (2) ts_decay_linear(..., 10) = deviasi yang bobotnya meluruh 10 hari — percaya deviasi segar (recap: decay = bobot sinyal meluruh seiring umur data; d=10 berarti data berumur ≥10 hari bobotnya nol); (3) tanda minus + rank = pilih yang paling 'tenggelam' di bawah rata-ratanya; (4) ts_corr(returns, volume, 20) = sinkronisasi return-volume 20 hari (akumulasi diam-diam); rank = pilih yang paling sinkron; (5) kali = INTERSEKSI — saham harus lolos KEDUA saringan; (6) group_neutralize per subindustry = bandingkan hanya dengan tetangga se-industri.",
        "Angka mainan — tiga saham satu subindustry. ts_corr: A 0.6, B 0.1, C −0.3 → rank: A 1.0, B 0.5, C 0.0. Deviasi ter-decay: A −5, B +2, C −1 → rank dari negatifnya (5, −2, 1): A 1.0, C 0.5, B 0.0. Kali: A 1.0×1.0 = 1.0, B 0.5×0.0 = 0.0, C 0.0×0.5 = 0.0. Rata-rata grup = 0.333 → netral: A +0.667, B −0.333, C −0.333. Posisi: long A, short B dan C. Interpretasi bahasa manusia: 'beli saham yang paling dalam tenggelamnya DAN paling sinkron akumulasinya, relatif terhadap tetangga se-subindustry-nya.' Satu baris, dua ide independen, satu perbandingan apel-vs-apel — inilah komposisi cerdas.",
        "Daftar periksa sebelum submit ekspresi. Satu: baca dari dalam ke luar, tulis terjemahan satu kalimat per operator — bila satu operator tidak bisa diterjemahkan, ia tidak boleh ada. Dua: tandai arah potong tiap operator (cross-sectional vs time-series) — campur aduk tanpa sadar = bug. Tiga: lacak NaN — window berapa? saham muda aman? Empat: verifikasi tanda — rank vs rank(-x) menentukan long/short; uji dengan contoh 3-saham seperti di atas. Lima: pastikan d/window di operator jodoh dengan kecepatan sinyal — operator dan parameter adalah satu keputusan.",
        "Latihan bedah ekspresi nyata. Ambil: 0.5 × rank(ts_mean(close,10) − close) × rank(ts_corr(high,low,60)) + 0.5 × rank(−ts_corr(est_epsr, est_fcf,30)). Labeli arah potongnya: ts_mean (time) → minus (elementwise) → rank (cross); ts_corr (time) → rank (cross); × (elementwise) = irisan 'murah-relatif DAN stabil-intraday'; suku kedua: ts_corr (time) → minus → rank (cross) = 'kebalikan kekompakan analis'; + (elementwise) = gabungan dua ide independen berbobot sama. Terjemahan satu kalimat: 'setengah pada saham murah yang stabil, setengah pada saham yang analisnya tidak kompak — dua taruhan independen.' Bila kamu bisa melabeli setiap operator seperti ini dalam 60 detik, kamu membaca FASTEXPR — bukan sekadar menulisnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Ekspresi FASTEXPR adalah kalimat dengan tata bahasa arah: cross-sectional bicara 'dibanding siapa', time-series bicara 'dibanding kapan'. Kalimat yang mencampur keduanya tanpa sadar = kalimat yang tidak tahu ia bicara tentang apa.",
      },
      hints: [
        "Tandai arah potong tiap operator sebelum membaca maknanya.",
        "NaN merambat diam-diam — backfill sebelum operator berjendela.",
        "Uji tanda dengan 3 saham mainan: rank vs rank(-x) = long vs short.",
      ],
      reference: "Dalam → luar, arah potong jelas, NaN terlacak, tanda teruji.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan tentang lego alpha.",
      ],
      tasks: [],
      summary: [
        "rank = skor posisi 0–1 lintas saham; kebal outlier.",
        "ts_mean/ts_std_dev/ts_corr = melintasi waktu; butuh window n.",
        "ts_delay(x,1) = kemarin; ts_decay_linear = bobot meluruh; ts_backfill = tambal lubang.",
        "group_neutralize = demean per grup (netralisasi versi operator).",
        "Urutan operator = makna; baca dari dalam ke luar.",
        "Tiga arah potong: cross-sectional (rank, group_neutralize), time-series (ts_*), elementwise — campur aduk tanpa sadar = bug.",
        "NaN merambat diam-diam dari window yang kurang; uji tanda rank vs rank(-x) dengan 3 saham mainan.",
      ],
      quiz: [
        {
          q: "Return [−8%, −1%, +3%, +12%]. rank(+12%)?",
          options: [
            { text: "1,00 — peringkat tertinggi", why: "Benar: (4−1)/(4−1) = 1.", correct: true },
            { text: "0,12 — 12% dinormalkan", why: "rank tidak memakai nilai persen — hanya posisi." },
            { text: "4 — peringkatnya", why: "rank diskalakan ke 0–1, bukan 1–N." }
          ],
        },
        {
          q: "Beda rank(ts_mean(close,5)) dan ts_mean(rank(close),5)?",
          options: [
            { text: "Dua alpha berbeda — urutan operator = makna berbeda", why: "Tepat.", correct: true },
            { text: "Sama saja — bahannya identik", why: "Jebakan komposisi: urutan mengubah makna." },
            { text: "Yang kedua tidak valid", why: "Keduanya valid, hanya berbeda arti." }
          ],
        },
        {
          q: "ts_corr(high, low, 60) mengukur?",
          options: [
            { text: "Kesinkronan high dan low selama 60 hari", why: "Benar.", correct: true },
            { text: "Rata-rata high dan low", why: "Itu ts_mean, bukan ts_corr." },
            { text: "Korelasi 60 saham", why: "60 = window hari, bukan jumlah saham." }
          ],
        },
        {
          q: "Untuk sinyal 'murah relatif', ekspresi yang tepat?",
          options: [
            { text: "rank(ts_mean(close,5) − close)", why: "Benar — skor tinggi untuk yang tenggelam di bawah rata-ratanya.", correct: true },
            { text: "rank(close − ts_mean(close,5))", why: "Terbalik — ini skor tinggi untuk yang mahal relatif." },
            { text: "ts_mean(rank(close),5)", why: "Rata-rata peringkat — makna berbeda." }
          ],
        },
        {
          q: "Kenapa rank kebal outlier?",
          options: [
            { text: "Karena hanya memakai posisi urutan, bukan besar nilai", why: "Tepat — +50% hanya 'peringkat 1'.", correct: true },
            { text: "Karena outlier dihapus otomatis", why: "Tidak dihapus — hanya dijinakkan skalanya." },
            { text: "Karena rank memakai logaritma", why: "Tidak ada logaritma dalam rank." }
          ],
        },
        {
          q: "rank(ts_mean(close,2)) vs ts_mean(rank(close),2) — perbedaan maknanya?",
          options: [
            { text: "Yang pertama memeringkat LEVEL harga; yang kedua memeringkat KONSISTENSI posisi harian", why: "Tepat — urutan operator = makna berbeda.", correct: true },
            { text: "Tidak ada — bahannya sama", why: "Jebakan komposisi: arah potong berbeda = alpha berbeda." },
            { text: "Yang kedua tidak valid", why: "Keduanya valid dan terkomputasi — hanya artinya beda." }
          ],
        },
        {
          q: "ts_corr(high, low, 60) pada saham IPO 30 hari. Yang terjadi?",
          options: [
            { text: "NaN — data kurang dari window; NaN merambat ke seluruh rantai tanpa peringatan", why: "Benar — dan saham muda mati sistematis karenanya.", correct: true },
            { text: "Otomatis memakai 30 hari yang ada", why: "Tidak — window kurang = NaN, bukan penyesuaian otomatis." },
            { text: "Error dan simulasi berhenti", why: "Tidak ada error — inilah bahayanya: diam-diam." }
          ],
        }
      ],
      reference: "Lego sederhana, kombinasi cerdas. Urutan = makna.",
    },
  ],
};
