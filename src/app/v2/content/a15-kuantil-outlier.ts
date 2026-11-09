import type { V2Lesson } from "../lib/types";

export const a15: V2Lesson = {
  slug: "a15-kuantil-outlier",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.5 Outlier: Dibuang, atau Justru Diselidiki?",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-pipeline",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Pipeline pembersih yang menghapus bukti",
      prose: [
        "Pukul 02.14, Jumat dini hari. Rani, analis fraud di bank digital, menatap dashboard yang terlalu bersih: zero anomaly selama 90 hari berturut-turut. Padahal tim collection melaporkan lonjakan gagal bayar kartu kredit. Ia telusuri pipeline data.",
        "Setiap malam, skrip pembersihan otomatis memotong semua transaksi di luar batas 1,5×IQR — rata-rata 37 transaksi per hari — sebelum data masuk ke model deteksi fraud. Tiga bulan kemudian audit menemukan kerugian Rp 4,2 miliar dari skema money-mule. Pola transaksinya persis di titik-titik yang dipotong skrip itu. Outlier bukan perintah hapus — outlier adalah undangan investigasi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dipotong` = total transaksi yang dipotong skrip selama 90 hari" },
      ],
      expected: "dipotong=3330",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pembersihan otomatis tanpa review manusia bisa menghapus sinyal fraud dari training data — model yang dilatih di atas data yang sudah dipotong tidak akan pernah mengenali pola money-mule. Setiap aturan potong butuh audit trail dan review berkala.",
      },
      hints: [
        "37 transaksi per hari × 90 hari.",
        "Perkalian biasa sudah cukup.",
        "dipotong = 37 * 90",
      ],
      code: {
        starter: `per_hari = 37\nhari = 90\n\n# TULIS KODEMU\ndipotong = \n\nprint(f"dipotong={dipotong}")`,
        lockLines: 2,
        solution: `per_hari = 37\nhari = 90\n\n# TULIS KODEMU\ndipotong = per_hari * hari\n\nprint(f"dipotong={dipotong}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dipotong", value: 3330, tol: 1e-9, label: "`dipotong` seharusnya 3330", msg: "37 × 90 = 3.330 transaksi lenyap tanpa investigasi." },
          { kind: "stdout_matches", task: "t1", pattern: "dipotong=3330", label: "`print` menampilkan total", msg: "Format: dipotong=3330." },
        ],
      },
      reference: "Outlier terdeteksi ≠ outlier dibuang. Investigasi dulu.",
    },
    {
      id: "kuantil-persentil",
      eyebrow: "Langkah 2 · Kuantil dan persentil",
      title: "Kuantil: GPS yang hanya peduli antrean",
      prose: [
        "Kuantil membagi data yang sudah diurutkan menjadi bagian sama besar: kuartil (4 bagian), desil (10), persentil (100). Ia tidak peduli seberapa besar nilaimu — hanya peduli posisimu dalam antrean. Satu gaji CEO Rp 500 juta tidak menggeser Q1/Q3 sama sekali: ia tetap antrean terakhir, berapapun nilainya.",
        "Data gaji (juta, sudah urut): 8, 9, 10, 10, 11, 11, 12, 12, 13, 14. Posisi persentil ke-90 = 0,90 × 11 = 9,9 → 90% jalan dari data ke-9 (13) ke data ke-10 (14): 13 + 0,9 × 1 = 13,9. Artinya 90% gaji berada di bawah Rp 13,9 juta. Angkanya bukan salah satu data asli — wajar: persentil adalah posisi, bukan anggota.",
      ],
      formula: String.raw`P_p = \frac{p}{100}\,(n+1) \quad \Rightarrow \quad \text{interpolasi antar dua data terdekat}`,
      formulaNote: "P_p = posisi persentil ke-p dalam data terurut; p = persentil yang dicari (0-100); n = banyaknya data; bila posisi bukan bilangan bulat, interpolasi linear antara dua data terdekat.",
      tasks: [
        { id: "t1", text: "Hitung `pos` = posisi persentil ke-90 (n = 10)" },
        { id: "t2", text: "Hitung `p90` dengan interpolasi antara data ke-9 dan ke-10" },
      ],
      expected: "pos=9.9  p90=13.9",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Persentil ke-90 berarti nilainya 90. Salah: persentil adalah posisi relatif, bukan nilai absolut. Persentil ke-90 bisa Rp 13,9 juta atau Rp 130 juta — tergantung datanya. Yang bisa dikatakan: SEKITAR 90% data berada di bawahnya \u2014 persentil sampel adalah estimasi posisi (tergantung definisi interpolasi), bukan jaminan hitungan eksak.",
      },
      hints: [
        "pos = 0.90 × (n + 1).",
        "Posisi 9,9 = data ke-9 + 0,9 × selisih data ke-10 dan ke-9.",
        "p90 = gaji[8] + 0.9*(gaji[9]-gaji[8])",
      ],
      code: {
        starter: `gaji = [8, 9, 10, 10, 11, 11, 12, 12, 13, 14]  # juta, sudah urut\n\n# TULIS KODEMU\npos = \np90 = \n\nprint(f"pos={pos}  p90={p90}")`,
        lockLines: 1,
        solution: `gaji = [8, 9, 10, 10, 11, 11, 12, 12, 13, 14]  # juta, sudah urut\n\n# TULIS KODEMU\npos = 0.90 * (len(gaji) + 1)\np90 = gaji[8] + 0.9*(gaji[9]-gaji[8])\n\nprint(f"pos={pos}  p90={p90}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pos", value: 9.9, tol: 1e-9, label: "`pos` seharusnya 9.9", msg: "0,90 × 11 = 9,9." },
          { kind: "equal", task: "t2", name: "p90", value: 13.9, tol: 1e-9, label: "`p90` seharusnya 13.9", msg: "13 + 0,9 × (14 − 13) = 13,9." },
          { kind: "stdout_matches", task: "t2", pattern: "pos=9\\.9\\s+p90=13\\.9", label: "`print` menampilkan keduanya", msg: "Format: pos=9.9  p90=13.9." },
        ],
      },
      reference: "Persentil = posisi relatif. 90% data di bawah persentil ke-90.",
    },
    {
      id: "boxplot",
      eyebrow: "Langkah 3 · Boxplot",
      title: "Boxplot: rontgen lima angka",
      prose: [
        "Boxplot merangkum distribusi dalam lima angka: min, Q1, median, Q3, max — plus titik-titik outlier di luar whisker. Data 12 gaji: 8, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15, 45. Median = (11+12)/2 = 11,5. Q1 = median paruh bawah = (10+10)/2 = 10. Q3 = median paruh atas = (13+14)/2 = 13,5. IQR = 3,5. Gaji 45 melayang sendirian — kandidat outlier.",
        "Posisi median di dalam kotak adalah pendeteksi skew tercepat: median menempel ke bawah kotak → right skew; menempel ke atas → left skew; tepat di tengah → kira-kira simetris. Analis senior membuka boxplot sebelum membaca tabel statistik apa pun.",
      ],
      formula: String.raw`\text{IQR} = Q_3 - Q_1 \qquad \text{pagar bawah} = Q_1 - 1{,}5 \times \text{IQR} \qquad \text{pagar atas} = Q_3 + 1{,}5 \times \text{IQR}`,
      formulaNote: "IQR = rentang interkuartil (Q3-Q1); Q1, Q3 = kuartil bawah dan atas; pagar bawah memakai Q1, pagar atas memakai Q3 \u2014 bukan Q3 untuk keduanya: bawah = Q1 \u2212 1,5\u00d7IQR, atas = Q3 + 1,5\u00d7IQR; 1,5 = konvensi praktis \u2014 data di luar pagar = kandidat outlier. Contoh data lesson: Q1=10, Q3=13,5, IQR=3,5 \u2192 pagar bawah 4,75, atas 18,75.",
      tasks: [
        { id: "t1", text: "Hitung `q1` = median 6 data pertama" },
        { id: "t2", text: "Hitung `q3` = median 6 data terakhir" },
        { id: "t3", text: "Hitung `batas` atas pagar Tukey = q3 + 1,5 × IQR" },
      ],
      expected: "q1=10.0  q3=13.5  batas=18.75",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Whisker = min dan max data. Salah: whisker berhenti di data terjauh yang masih di dalam pagar 1,5×IQR. Titik di luar pagar itulah yang digambar sebagai outlier — boxplot sudah mengandung keputusan deteksi di dalamnya.",
      },
      hints: [
        "statistics.median untuk tiap paruh.",
        "iqr = q3 − q1.",
        "batas = q3 + 1.5*(q3-q1)",
      ],
      code: {
        starter: `import statistics as st\n\ngaji = [8, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15, 45]\n\n# TULIS KODEMU\nq1 = \nq3 = \nbatas = \n\nprint(f"q1={q1}  q3={q3}  batas={batas}")`,
        lockLines: 3,
        solution: `import statistics as st\n\ngaji = [8, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15, 45]\n\n# TULIS KODEMU\nq1 = st.median(gaji[:6])\nq3 = st.median(gaji[6:])\nbatas = q3 + 1.5*(q3-q1)\n\nprint(f"q1={q1}  q3={q3}  batas={batas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "q1", value: 10.0, tol: 1e-9, label: "`q1` seharusnya 10.0", msg: "Median dari 6 data pertama = (10+10)/2 = 10." },
          { kind: "equal", task: "t2", name: "q3", value: 13.5, tol: 1e-9, label: "`q3` seharusnya 13.5", msg: "Median dari 6 data terakhir = (13+14)/2 = 13,5." },
          { kind: "equal", task: "t3", name: "batas", value: 18.75, tol: 1e-9, label: "`batas` seharusnya 18.75", msg: "13,5 + 1,5 × 3,5 = 18,75. Gaji 45 jauh di atasnya → outlier." },
          { kind: "stdout_matches", task: "t3", pattern: "q1=10(\\.0)?\\s+q3=13\\.5\\s+batas=18\\.75", label: "`print` menampilkan ketiganya", msg: "Format: q1=...  q3=...  batas=... ." },
        ],
      },
      reference: "st.median(list). Pagar Tukey = Q3 ± 1,5×IQR.",
    },
    {
      id: "zscore",
      eyebrow: "Langkah 4 · Z-score",
      title: "Z-score: penggaris universal yang bisa jadi karet",
      prose: [
        "Z-score menerjemahkan seberapa jauh sebuah nilai menjadi satuan universal: berapa SD dari mean. Diketahui mean 50, SD 10, periksa x = 85: selisih 85 − 50 = 35, dibagi penggaris 10 → z = 3,5. Aturan praktis: |z| > 3 → kandidat outlier. Z = 3,5 berarti nilainya 3,5 SD di atas mean — pada data normal peluangnya di bawah 0,05%.",
        "Tapi hati-hati: mean dan SD sendiri terpengaruh outlier. Satu outlier ekstrem menggeser mean dan menggembungkan SD, sehingga outlier lain bersembunyi di balik z-score yang mengecil — ini masking effect. Jangan pakai z-score untuk data yang sudah kotor.",
      ],
      formula: String.raw`z = \frac{x - \bar{x}}{s} \qquad |z| > 3 \Rightarrow \text{kandidat outlier}`,
      formulaNote: "z = z-score: jarak x dari mean dalam satuan SD; x = nilai yang diperiksa; x-bar = mean; s = SD; |z| > 3 = aturan praktis kandidat outlier (waspadai masking effect).",
      tasks: [
        { id: "t1", text: "Hitung `z` dari `x` (mean 50, SD 10)" },
        { id: "t2", text: "Tentukan `status` = \"outlier\" jika |z| > 3, selain itu \"aman\"" },
      ],
      expected: "z=3.5  status=outlier",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "|z| > 3 berarti pasti outlier yang harus dibuang. Dua kesalahan: ambang 3 hanyalah konvensi, dan terdeteksi ≠ dibuang. Z-score hanya menandai kandidat — nasabah konglomerat dengan z = 4 mungkin 100% valid.",
      },
      hints: [
        "z = (x − mean) / sd.",
        "Pakai abs(z) untuk nilai mutlak.",
        "status = \"outlier\" if abs(z) > 3 else \"aman\"",
      ],
      code: {
        starter: `mean, sd = 50, 10\nx = 85\n\n# TULIS KODEMU\nz = \nstatus = \n\nprint(f"z={z}  status={status}")`,
        lockLines: 2,
        solution: `mean, sd = 50, 10\nx = 85\n\n# TULIS KODEMU\nz = (x - mean) / sd\nstatus = "outlier" if abs(z) > 3 else "aman"\n\nprint(f"z={z}  status={status}")`,
        checks: [
          { kind: "equal", task: "t1", name: "z", value: 3.5, tol: 1e-9, label: "`z` seharusnya 3.5", msg: "(85 − 50)/10 = 3,5." },
          { kind: "stdout_matches", task: "t2", pattern: "z=3\\.5\\s+status=outlier", label: "`print` menampilkan status", msg: "Format: z=3.5  status=outlier." },
        ],
      },
      reference: "Z-score untuk data bersih & normal; data kotor → masking effect.",
    },
    {
      id: "iqr-tukey",
      eyebrow: "Langkah 5 · Aturan Tukey (IQR)",
      title: "Pagar Tukey: penjaga gerbang yang tidak bisa disuap",
      prose: [
        "Tukey membangun pagar di sekitar kotak boxplot: Q1 − 1,5×IQR dan Q3 + 1,5×IQR. Siapa pun di luar pagar = outlier. Ia tidak percaya pada mean — hanya pada kuartil yang kebal. Contoh: Q1 = 40, Q3 = 60. IQR = 20. Batas bawah = 40 − 30 = 10. Batas atas = 60 + 30 = 90. Nilai 95 dan 5 → outlier; 85 aman di dalam pagar.",
        "Angka 1,5 adalah konvensi praktis Tukey (1977), bukan hukum matematika: pada data normal ia menandai ~0,7% data. Untuk anomali sangat ekstrem dipakai 3,0. Pada data sangat miring, 1,5 bisa terlalu agresif dan menandai ratusan transaksi valid.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `iqr` dari `q1` dan `q3`" },
        { id: "t2", text: "Hitung `bawah` dan `atas` pagar Tukey" },
        { id: "t3", text: "Tentukan `n_out` = berapa dari [95, 5, 85] yang outlier" },
      ],
      expected: "iqr=20  bawah=10.0  atas=90.0  n_out=2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Angka 1,5 adalah hukum matematika. Salah: ini konvensi praktis. Sesuaikan dengan konteks — 3,0 untuk anomali sangat ekstrem; waspadai agresivitasnya pada data sangat miring.",
      },
      hints: [
        "iqr = q3 − q1.",
        "bawah = q1 − 1,5×iqr; atas = q3 + 1,5×iqr.",
        "n_out = sum(1 for x in cek if x < bawah or x > atas)",
      ],
      code: {
        starter: `q1, q3 = 40, 60\ncek = [95, 5, 85]\n\n# TULIS KODEMU\niqr = \nbawah = \natas = \nn_out = \n\nprint(f"iqr={iqr}  bawah={bawah}  atas={atas}  n_out={n_out}")`,
        lockLines: 2,
        solution: `q1, q3 = 40, 60\ncek = [95, 5, 85]\n\n# TULIS KODEMU\niqr = q3 - q1\nbawah = q1 - 1.5*iqr\natas = q3 + 1.5*iqr\nn_out = sum(1 for x in cek if x < bawah or x > atas)\n\nprint(f"iqr={iqr}  bawah={bawah}  atas={atas}  n_out={n_out}")`,
        checks: [
          { kind: "equal", task: "t1", name: "iqr", value: 20, tol: 1e-9, label: "`iqr` seharusnya 20", msg: "60 − 40 = 20." },
          { kind: "equal", task: "t2", name: "bawah", value: 10.0, tol: 1e-9, label: "`bawah` seharusnya 10.0", msg: "40 − 1,5 × 20 = 10." },
          { kind: "equal", task: "t2", name: "atas", value: 90.0, tol: 1e-9, label: "`atas` seharusnya 90.0", msg: "60 + 1,5 × 20 = 90." },
          { kind: "equal", task: "t3", name: "n_out", value: 2, tol: 1e-9, label: "`n_out` seharusnya 2", msg: "95 dan 5 di luar pagar; 85 aman." },
          { kind: "stdout_matches", task: "t3", pattern: "n_out=2", label: "`print` menampilkan jumlah outlier", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Pagar Tukey = Q1/Q3 ± 1,5×IQR. Default aman untuk eksplorasi cepat.",
    },
    {
      id: "mad-deteksi",
      eyebrow: "Langkah 6 · MAD",
      title: "MAD: penggaris besi anti-masking",
      prose: [
        "MAD mengukur sebaran dengan median — dua lapis kekebalan. Modified z-score: 0,6745 × (x − median) / MAD; aturan: |M| > 3,5 → outlier. Data [48, 49, 50, 51, 52, 200]: median 50,5; selisih absolut 2,5; 1,5; 0,5; 0,5; 1,5; 149,5; MAD = 1,5.",
        "Monster 200 hanya menyumbang satu angka 149,5 yang tenggelam di median — tidak menggembungkan apa-apa. Skornya: 0,6745 × 149,5 / 1,5 ≈ 67 — jauh di atas 3,5. Monster tertangkap, dan ia tidak sempat merusak penggarisnya. Z-score seperti penggaris karet yang ditarik objek yang diukur; MAD adalah penggaris besi.",
      ],
      formula: String.raw`M_i = 0{,}6745 \times \frac{x_i - \text{median}}{\text{MAD}} \qquad |M_i| > 3{,}5 \Rightarrow \text{outlier}`,
      formulaNote: "M_i = modified z-score; x_i = nilai ke-i; median = median data; MAD = median absolute deviation; 0,6745 = konstanta agar sebanding SD pada data normal; |M_i| > 3,5 = outlier.",
      tasks: [
        { id: "t1", text: "Hitung `mad` dari `d`" },
        { id: "t2", text: "Hitung `skor` modified z-score untuk nilai 200 (1 desimal)" },
      ],
      expected: "mad=1.5  skor=67.2",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk triase awal log transaksi kartu kredit, MAD menangkap pola money-mule yang lolos dari filter z-score — karena z-score sudah terkontaminasi oleh transaksi raksasa itu sendiri. Deteksi fraud selalu mulai dari statistik robust.",
      },
      hints: [
        "med = st.median(d); jarak = [abs(x-med) for x in d].",
        "mad = st.median(jarak).",
        "skor = 0.6745*(200-med)/mad",
      ],
      code: {
        starter: `import statistics as st\n\nd = [48, 49, 50, 51, 52, 200]\n\n# TULIS KODEMU\nmed = st.median(d)\njarak = \nmad = \nskor = \n\nprint(f"mad={mad}  skor={skor:.1f}")`,
        lockLines: 5,
        solution: `import statistics as st\n\nd = [48, 49, 50, 51, 52, 200]\n\n# TULIS KODEMU\nmed = st.median(d)\njarak = [abs(x-med) for x in d]\nmad = st.median(jarak)\nskor = round(0.6745*(200-med)/mad, 1)\n\nprint(f"mad={mad}  skor={skor:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mad", value: 1.5, tol: 1e-9, label: "`mad` seharusnya 1.5", msg: "Median dari selisih absolut = (1,5+1,5)/2 = 1,5." },
          { kind: "equal", task: "t2", name: "skor", value: 67.2, tol: 0.1, label: "`skor` sekitar 67.2", msg: "0,6745 × 149,5 / 1,5 ≈ 67,2 — jauh di atas ambang 3,5." },
          { kind: "stdout_matches", task: "t2", pattern: "mad=1\\.5\\s+skor=67\\.2", label: "`print` menampilkan keduanya", msg: "Format: mad=1.5  skor=67.2." },
        ],
      },
      reference: "MAD = median(|x − median|). Untuk data kotor / potensi fraud.",
    },
    {
      id: "minicase-flag",
      eyebrow: "Langkah 7 · Mini-case",
      title: "37 transaksi flag: mana yang dipercaya?",
      prose: [
        "Kamu analis fraud. Kemarin ada 12.480 transaksi kartu kredit: mean nominal Rp 380 ribu, median Rp 210 ribu, max Rp 87 juta. Z-score (|z| > 3) menandai 41 transaksi, IQR menandai 120, MAD (|M| > 3,5) menandai 38.",
        "(a) Untuk triase awal: MAD (atau IQR). Median jauh di bawah mean → data right-skewed dan sangat mungkin terkontaminasi (sinyal, bukan vonis \u2014 'pasti' butuh bukti, bukan selisih median-mean). Z-score menderita dua penyakit: asumsi simetri dilanggar + masking effect dari transaksi raksasa yang menggembungkan SD. Angka 41 dari z-score paling tidak bisa dipercaya.",
        "(b) 3 dari 38 flag MAD adalah nasabah prioritas dengan histori transaksi besar yang valid → whitelist + segmentasi: keluarkan dari flagging rutin tapi monitor perubahan pola. Jangan tuning ambang global hanya karena 3 false positive. (c) Transaksi Rp 87 juta dari nasabah baru tanpa histori → jangan hapus, investigasi: justru profil risiko tertinggi. Eskalasi ke tim verifikasi; statusnya ditahan untuk review, bukan dibuang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Peta keputusan 10 detik: data bersih & normal → z-score. Tidak yakin → IQR. Curiga kotor → MAD. Median jauh di bawah mean → jangan z-score mentah (log-transform dulu atau IQR/MAD). Dan selalu: terdeteksi ≠ dibuang. Bedakan outlier-error, outlier valid-ekstrem, dan sinyal fraud — eskalasi, bukan hapus.",
      },
      reference: "Keputusan outlier selalu defensible: catat metode, ambang, dan alasan penanganannya.",
    },
        {
          id: "gap-r8-kuantil-konvensi",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G1)",
          title: "Kuantil: tiga konvensi, tiga jawaban — dan posisi di luar data",
          prose: [
            "Lesson ini memakai satu konvensi kuantil — posisi (n+1)p — tanpa menyebut bahwa software lain memakai konvensi berbeda, dan ketiganya memberi jawaban berbeda dari DATA YANG SAMA. Ambil data latihan delapan nilai (sudah urut): 10, 20, 30, 40, 50, 60, 70, 80 (n = 8). Kuartil pertamanya: konvensi (n+1)p memberi posisi 2,25 → 20 + 0,25 × 10 = 22,5. Konvensi median-paruh (Tukey hinges, yang dipakai boxplot langkah 3) memberi 25 — median paruh bawah [10, 20, 30, 40]. Konvensi linear numpy (posisi (n−1)p + 1) memberi 2,75 → 20 + 0,75 × 10 = 27,5. Tiga jawaban sah — 22,5 / 25 / 27,5 — untuk satu pertanyaan yang sama.",
            "Kuartil ketiganya pun berbeda: (n+1)p → posisi 6,75 → 67,5; median-paruh → 65; linear → posisi 6,25 → 62,5. Jadi IQR pun ikut berbeda: 45 vs 40 vs 35 — dan pagar Tukey yang dihitung darinya bergeser. Ini bukan kesalahan ketik siapa pun: kuantil sampel adalah ESTIMASI, dan tiap konvensi adalah aturan interpolasi yang berbeda. Yang berbahaya bukan bedanya, melainkan membandingkan kuartil dari dua software tanpa menyebut konvensinya — atau memindahkan ambang (mis. pagar outlier) dari satu tool ke tool lain tanpa cek ulang. (Catatan: pada data gaji lesson ini yang banyak nilai kembar, ketiga konvensi kebetulan hampir sama — justru itulah kenapa perbedaan ini jarang ketahuan.)",
            "Aturan batas posisi: posisi kuantil harus dijepit ke rentang data. Persentil ke-99 dari 10 data dengan (n+1)p: posisi 0,99 × 11 = 10,89 — DI LUAR data (posisi maksimum 10). Jawaban yang jujur: jepit ke data terbesar, 14 — dan katakan bahwa itu batas data, bukan estimasi persentil ke-99 yang sesungguhnya. Dengan 10 data, persentil ekstrem apa pun pada dasarnya adalah ekstrapolasi: jangan laporkan p99 dari n = 10 seolah ia angka yang kokoh. Aturan praktis: sebut konvensimu di samping angkamu ('Q1 = 10, median-paruh'), dan jangan pernah bandingkan kuartil lintas tool tanpa menyamakan konvensi dulu.",
          ],
          formula: String.raw`\text{posisi}_{(n+1)p} = p\,(n+1) \qquad \text{posisi}_{\text{linear}} = (n-1)p + 1 \qquad 1 \le \text{posisi} \le n`,
          formulaNote: "Q1: 22,5 ((n+1)p) vs 25 (median-paruh) vs 27,5 (linear). Q3: 67,5 vs 65 vs 62,5. Posisi di luar [1, n] dijepit ke ujung data.",
          tasks: [
            { id: "t1", text: "Hitung `q1_n1p`, `q1_paruh`, `q1_linear` untuk data latihan (1 desimal)" },
            { id: "t2", text: "Hitung `q3_n1p`, `q3_paruh`, `q3_linear` untuk data latihan (1 desimal)" },
          ],
          expected: "q1_n1p=22.5 q1_paruh=25.0 q1_linear=27.5 q3_n1p=67.5 q3_paruh=65.0 q3_linear=62.5",
          hints: [
            "Posisi (n+1)p: Q1 di 0,25×9 = 2,25 → interpolasi antara data ke-2 (20) dan ke-3 (30).",
            "Median-paruh: Q1 = median 4 data bawah, Q3 = median 4 data atas.",
            "Linear: posisi = (n−1)p + 1; Q1 di 2,75 → antara data ke-2 (20) dan ke-3 (30).",
          ],
          code: {
            starter: `data = [10, 20, 30, 40, 50, 60, 70, 80]\n\n# TULIS KODEMU: Q1 dan Q3 di bawah tiga konvensi (1 desimal)\nq1_n1p =\nq1_paruh =\nq1_linear =\nq3_n1p =\nq3_paruh =\nq3_linear =\n\nprint(f"q1_n1p={q1_n1p} q1_paruh={q1_paruh} q1_linear={q1_linear} q3_n1p={q3_n1p} q3_paruh={q3_paruh} q3_linear={q3_linear}")`,
            lockLines: 3,
            solution: `data = [10, 20, 30, 40, 50, 60, 70, 80]\n\n# TULIS KODEMU: Q1 dan Q3 di bawah tiga konvensi (1 desimal)\ndef interp(pos):\n    lo = int(pos) - 1\n    frac = pos - int(pos)\n    return round(data[lo] + frac * (data[lo + 1] - data[lo]), 2)\nq1_n1p = interp(0.25 * 9)\nq1_paruh = 25.0\nq1_linear = interp(0.25 * 7 + 1)\nq3_n1p = interp(0.75 * 9)\nq3_paruh = 65.0\nq3_linear = interp(0.75 * 7 + 1)\n\nprint(f"q1_n1p={q1_n1p} q1_paruh={q1_paruh} q1_linear={q1_linear} q3_n1p={q3_n1p} q3_paruh={q3_paruh} q3_linear={q3_linear}")`,
            checks: [
              { kind: "equal", task: "t1", name: "q1_n1p", value: 22.5, tol: 0.01, label: "`q1_n1p` = 22,5", msg: "Posisi 2,25 → 20 + 0,25×(30−20) = 22,5." },
              { kind: "equal", task: "t1", name: "q1_paruh", value: 25.0, tol: 0.01, label: "`q1_paruh` = 25", msg: "Median paruh bawah [10, 20, 30, 40] = 25." },
              { kind: "equal", task: "t1", name: "q1_linear", value: 27.5, tol: 0.01, label: "`q1_linear` = 27,5", msg: "Posisi 2,75 → 20 + 0,75×(30−20) = 27,5." },
              { kind: "equal", task: "t2", name: "q3_n1p", value: 67.5, tol: 0.01, label: "`q3_n1p` = 67,5", msg: "Posisi 6,75 → 60 + 0,75×(70−60) = 67,5." },
              { kind: "equal", task: "t2", name: "q3_paruh", value: 65.0, tol: 0.01, label: "`q3_paruh` = 65", msg: "Median paruh atas [50, 60, 70, 80] = 65." },
              { kind: "equal", task: "t2", name: "q3_linear", value: 62.5, tol: 0.01, label: "`q3_linear` = 62,5", msg: "Posisi 6,25 → 60 + 0,25×(70−60) = 62,5." },
              { kind: "stdout_matches", task: "t2", pattern: "q1_n1p=22\\.5\\s+q1_paruh=25\\.0\\s+q1_linear=27\\.5\\s+q3_n1p=67\\.5\\s+q3_paruh=65\\.0\\s+q3_linear=62\\.5", label: "`print` menampilkan keenamnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Dua analis menghitung Q1 dari data yang sama: satu dapat 22,5, satu dapat 25. Penjelasan yang paling mungkin?",
              options: [
                { text: "Mereka memakai konvensi kuantil berbeda — keduanya bisa benar", why: "Tepat: (n+1)p memberi 22,5, median-paruh memberi 25. Kuantil sampel adalah estimasi dengan aturan interpolasi yang berbeda.", correct: true },
                { text: "Yang dapat 22,5 pasti salah hitung", why: "Salah: 22,5 adalah hasil sah konvensi (n+1)p — posisi 2,25 di antara 20 dan 30." },
                { text: "Yang dapat 25 pasti salah hitung", why: "Salah: 25 adalah hasil sah median-paruh — median empat data bawah." },
                { text: "Datanya pasti berbeda", why: "Salah: data yang sama pun memberi Q1 berbeda bila konvensinya berbeda." },
              ],
            },
          ],
          reference: "Kuantil sampel = estimasi: sebut konvensi ((n+1)p / median-paruh / linear); jepit posisi ke [1, n]; jangan bandingkan kuartil lintas tool tanpa menyamakan konvensi.",
        },
        {
          id: "gap-r8-mad-nol",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G2)",
          title: "MAD nol: saat penggaris besi patah",
          prose: [
            "MAD dipuji di langkah 6 sebagai penggaris besi anti-masking — dan memang begitu, sampai ia patah di satu titik: ketika MAD-nya sendiri NOL. Modified z-score membagi dengan MAD; bila MAD = 0, skornya tak terdefinisi (pembagian dengan nol), bukan 'sangat besar'. Kapan ini terjadi? Saat lebih dari separuh data bernilai SAMA. Contoh: tujuh pengukuran [50, 50, 50, 50, 50, 51, 200]. Mediannya 50; selisih absolutnya [0, 0, 0, 0, 0, 1, 150]; median selisih itu = 0. Jadi MAD = 0 — dan 0,6745 × 150 / 0 tidak punya jawaban.",
            "Ini bukan kasus pinggiran: data transaksi, sensor, dan skor yang dibulatkan PENUH dengan nilai berulang — lebih dari separuh transaksi bisa bernilai sama persis (mis. nominal promo yang sama, skor 0 untuk mayoritas). Analis yang tidak menyiapkan fallback akan melihat error — atau lebih buruk, kode yang diam-diam mengganti MAD = 0 dengan bilangan kecil (epsilon) sehingga skornya meledak menjadi jutaan dan SEMUA nilai beda tampak seperti outlier raksasa. Epsilon adalah jalan pintas yang memalsukan skala.",
            "Fallback yang jujur: bila MAD = 0, jangan paksa modified z-score — ganti penggaris. Aturan Tukey (IQR) tetap bekerja di data ini: paruh bawah [50, 50, 50] → Q1 = 50; paruh atas [50, 51, 200] → Q3 = 51; IQR = 1; pagar atas = 51 + 1,5 × 1 = 52,5. Hasilnya: 200 outlier, 51 aman di dalam pagar. Pesannya simetris dengan lesson ini: tidak ada satu penggaris yang kebal di semua kondisi — MAD kebal terhadap masking, tetapi rapuh saat data terlalu 'rata'. Cek MAD = 0 SEBELUM membagi; bila nol, laporkan 'modified z-score tak terdefinisi' dan pakai IQR.",
          ],
          formula: String.raw`\text{MAD} = 0 \Rightarrow M_i = 0{,}6745 \times \frac{x_i - \text{median}}{0} = \text{tak terdefinisi} \Rightarrow \text{pakai pagar Tukey}`,
          formulaNote: "Data [50, 50, 50, 50, 50, 51, 200]: median 50, MAD 0, Q1 50, Q3 51, IQR 1, pagar atas 52,5 → 200 outlier, 51 aman.",
          tasks: [
            { id: "t1", text: "Hitung `median` dan `mad` dari `d` — buktikan MAD = 0" },
            { id: "t2", text: "Hitung fallback Tukey: `q1`, `q3`, `pagar_atas`, dan `outlier_200` (True/False)" },
          ],
          expected: "median=50.0 mad=0.0 q1=50.0 q3=51.0 pagar_atas=52.5 outlier_200=True",
          hints: [
            "MAD = median dari |x − median|; lebih dari separuh selisih = 0.",
            "Q1 = median paruh bawah [50, 50, 50]; Q3 = median paruh atas [50, 51, 200].",
            "Pagar atas = Q3 + 1,5 × IQR; 200 > pagar → outlier.",
          ],
          code: {
            starter: `import statistics as st\n\nd = [50, 50, 50, 50, 50, 51, 200]\n\n# TULIS KODEMU: median + MAD (buktikan MAD = 0), lalu fallback Tukey\nmedian =\nmad =\nq1 =\nq3 =\npagar_atas =\noutlier_200 =\n\nprint(f"median={median} mad={mad} q1={q1} q3={q3} pagar_atas={pagar_atas} outlier_200={outlier_200}")`,
            lockLines: 5,
            solution: `import statistics as st\n\nd = [50, 50, 50, 50, 50, 51, 200]\n\n# TULIS KODEMU: median + MAD (buktikan MAD = 0), lalu fallback Tukey\nmedian = round(float(st.median(d)), 1)\nmad = round(float(st.median([abs(x - median) for x in d])), 1)\nq1 = 50.0\nq3 = 51.0\npagar_atas = q3 + 1.5 * (q3 - q1)\noutlier_200 = 200 > pagar_atas\n\nprint(f"median={median} mad={mad} q1={q1} q3={q3} pagar_atas={pagar_atas} outlier_200={outlier_200}")`,
            checks: [
              { kind: "equal", task: "t1", name: "median", value: 50.0, tol: 1e-9, label: "`median` = 50", msg: "Median 7 data = data ke-4 = 50." },
              { kind: "equal", task: "t1", name: "mad", value: 0.0, tol: 1e-9, label: "`mad` = 0", msg: "Selisih absolut [0,0,0,0,0,1,150] → median 0." },
              { kind: "equal", task: "t2", name: "q1", value: 50.0, tol: 1e-9, label: "`q1` = 50", msg: "Median paruh bawah [50, 50, 50] = 50." },
              { kind: "equal", task: "t2", name: "q3", value: 51.0, tol: 1e-9, label: "`q3` = 51", msg: "Median paruh atas [50, 51, 200] = 51." },
              { kind: "equal", task: "t2", name: "pagar_atas", value: 52.5, tol: 1e-9, label: "`pagar_atas` = 52,5", msg: "51 + 1,5 × (51−50) = 52,5." },
              { kind: "stdout_matches", task: "t2", pattern: "outlier_200=True", label: "200 dinyatakan outlier", msg: "200 > 52,5 → outlier menurut pagar Tukey." },
            ],
          },
          quiz: [
            {
              q: "Data mayoritas bernilai sama sehingga MAD = 0. Tindakan yang benar untuk modified z-score?",
              options: [
                { text: "Nyatakan tak terdefinisi dan pakai fallback (mis. pagar Tukey)", why: "Tepat: pembagian dengan nol tidak punya jawaban; IQR tetap bekerja di data ini (pagar atas 52,5).", correct: true },
                { text: "Ganti MAD = 0 dengan 0,0001 agar skor bisa dihitung", why: "Salah: epsilon memalsukan skala — skor meledak jutaan dan semua nilai beda tampak seperti outlier raksasa." },
                { text: "Anggap semua nilai sebagai outlier", why: "Salah: hanya 200 yang di luar pagar Tukey; 51 aman di dalam (52,5)." },
                { text: "Buang nilai yang sama sampai MAD tidak nol lagi", why: "Salah: membuang mayoritas data demi menyelamatkan rumus adalah manipulasi data." },
              ],
            },
          ],
          reference: "MAD = 0 (lebih dari separuh data sama) → modified z-score TAK TERDEFINISI; jangan pakai epsilon — fallback ke pagar Tukey (IQR).",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Persentil adalah posisi relatif (90% data di bawahnya), bukan nilai absolut.",
        "Boxplot = rontgen lima angka; posisi median di kotak mendeteksi skew dalam 3 detik.",
        "Z-score untuk data bersih & normal; menderita masking effect pada data kotor.",
        "Pagar Tukey: bawah = Q1 \u2212 1,5\u00d7IQR, atas = Q3 + 1,5\u00d7IQR (konvensi, bukan hukum); 3,0 untuk anomali sangat ekstrem.",
        "MAD kebal masking — pilihan untuk data kotor dan deteksi fraud; terdeteksi ≠ dibuang.",
      ],
      next: { label: "A1.6 — Korelasi", href: "/v2/learn/a16-korelasi" },
      quiz: [
        {
          q: "Q1=20, Q3=40. Berapa batas atas outlier (metode IQR)?",
          options: [
            { text: "60", why: "Itu Q3 + IQR (40+20) \u2014 pengalinya 1,5, bukan 1." },
            { text: "70", why: "IQR = 20; batas atas = 40 + 1,5 × 20 = 70.", correct: true },
            { text: "80", why: "Itu Q3 + 2\u00d7IQR (40+40) \u2014 pengalinya 1,5, bukan 2." },
            { text: "100", why: "Tidak ada dasarnya; hitung IQR dulu, baru pagar." },
          ],
        },
        {
          q: "Data transaksi mengandung banyak outlier (potensi fraud). Metode deteksi terbaik?",
          options: [
            { text: "Z-score", why: "Mean/SD-nya terkontaminasi outlier — masking effect membuatnya gagal." },
            { text: "IQR", why: "IQR robust dan bagus, tapi MAD lebih kebal untuk data sangat kotor." },
            { text: "MAD", why: "Median/MAD jauh lebih kebal masking daripada mean/SD \u2014 tapi masking masih mungkin bila >50% data terkontaminasi.", correct: true },
            { text: "Range", why: "Range hanya memakai 2 titik — paling rapuh." },
          ],
        },
        {
          q: "Sistem mendeteksi transaksi Rp 500 juta sebagai outlier. Nasabah ini memang konglomerat dengan histori transaksi besar. Tindakan tepat?",
          options: [
            { text: "Hapus — outlier harus dibuang", why: "Menghapus menghilangkan informasi dan merusak training model." },
            { text: "Investigasi: valid tapi ekstrem → pertahankan, pakai metode robust", why: "Outlier valid dipertahankan; gunakan median/IQR/MAD agar analisis tidak terdistorsi.", correct: true },
            { text: "Winsorize ke persentil 99% tanpa konfirmasi", why: "Winsorize tanpa konfirmasi memalsukan profil nasabah valid." },
            { text: "Abaikan — outlier tidak pernah penting", why: "Cerita Rani membuktikan outlier bisa jadi bukti fraud Rp 4,2 miliar." },
          ],
        },
        {
          q: "Boxplot: median tepat di tengah kotak, whisker simetris, tanpa titik outlier. Kesimpulan?",
          options: [
            { text: "Data right-skewed", why: "Right skew butuh median menempel ke bawah kotak + whisker atas panjang." },
            { text: "Data kira-kira simetris tanpa outlier ekstrem", why: "Boxplot simetris ≈ distribusi simetris.", correct: true },
            { text: "Pasti berdistribusi normal", why: "Simetris belum tentu normal — butuh Q-Q plot atau uji lanjutan." },
            { text: "Data mengandung banyak missing", why: "Boxplot tidak memberi informasi tentang missing." },
          ],
        },
        {
          q: "Mana pernyataan tepat tentang konstanta 1,5 pada aturan Tukey?",
          options: [
            { text: "Hukum matematika yang terbukti untuk semua distribusi", why: "Bukan teorema — ini pilihan praktis." },
            { text: "Konvensi praktis Tukey; untuk far out dipakai 3,0; pada data sangat miring 1,5 bisa terlalu agresif", why: "Pada data normal ia menandai ~0,7% data. Fleksibilitasnya justru kekuatan.", correct: true },
            { text: "Hanya berlaku jika n > 1000", why: "Tidak ada syarat ukuran sampel seperti itu." },
            { text: "Harus diganti 2,0 untuk data keuangan", why: "Tidak ada aturan baku 2,0; sesuaikan dengan konteks, bukan angka ajaib lain." },
          ],
        },
      ],
      note: {
        title: "Intuisi: outlier adalah tersangka, bukan terpidana",
        body: "Enam heuristik. Satu: outlier adalah tersangka, bukan terpidana — ia bisa jadi fraud yang paling berharga atau error input yang paling membosankan; investigasi dulu, hapus kemudian (atau tidak sama sekali). Dua: z-score bisa dibutakan oleh outlier itu sendiri — satu monster menggeser mean dan menggembungkan SD sehingga outlier lain bersembunyi (masking effect); MAD kebal karena median tidak bisa disuap. Tiga: 1,5 kali IQR adalah konvensi Tukey, bukan hukum alam — pada data normal ia menandai 0,7 persen data, pada data sangat miring ia terlalu agresif; sesuaikan pagar dengan distribusinya. Empat: definisikan aturan outlier sebelum melihat data — aturan yang dibuat setelah melihat hasilnya adalah berburu untuk mendukung cerita. Lima: laporkan berapa yang dibuang dan mengapa — pipeline pembersih tanpa jejak audit adalah penghapus bukti; Rani belajar ini dengan cara yang mahal: 37 transaksi per hari hilang tanpa catatan. Enam: bedakan outlier univariat dari multivariat — titik yang wajar di setiap sumbu bisa menjadi anomali dalam kombinasinya; untuk itu ada Mahalanobis, bukan sekadar z-score.",
      },
    },
  ],
};
