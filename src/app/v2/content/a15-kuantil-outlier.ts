import type { V2Lesson } from "../lib/types";

export const a15: V2Lesson = {
  slug: "a15-kuantil-outlier",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.5 Outlier: Dibuang, atau Justru Diselidiki?",
  estMinutes: 45,
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
        body: "Persentil ke-90 berarti nilainya 90. Salah: persentil adalah posisi relatif, bukan nilai absolut. Persentil ke-90 bisa Rp 13,9 juta atau Rp 130 juta — tergantung datanya. Yang dijamin hanya: 90% data berada di bawahnya.",
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
      formula: String.raw`\text{IQR} = Q_3 - Q_1 \qquad \text{pagar} = Q_3 \pm 1{,}5 \times \text{IQR}`,
      formulaNote: "IQR = rentang interkuartil (Q3-Q1); Q1, Q3 = kuartil bawah dan atas; pagar = batas outlier Tukey; 1,5 = konvensi praktis — data di luar pagar = kandidat outlier.",
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
        "(a) Untuk triase awal: MAD (atau IQR). Median jauh di bawah mean → data right-skewed dan pasti terkontaminasi. Z-score menderita dua penyakit: asumsi simetri dilanggar + masking effect dari transaksi raksasa yang menggembungkan SD. Angka 41 dari z-score paling tidak bisa dipercaya.",
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
        "Pagar Tukey = Q1/Q3 ± 1,5×IQR (konvensi, bukan hukum); 3,0 untuk anomali sangat ekstrem.",
        "MAD kebal masking — pilihan untuk data kotor dan deteksi fraud; terdeteksi ≠ dibuang.",
      ],
      next: { label: "A1.6 — Korelasi", href: "/learn/a16-korelasi" },
      quiz: [
        {
          q: "Q1=20, Q3=40. Berapa batas atas outlier (metode IQR)?",
          options: [
            { text: "60", why: "Itu Q3 — pagarnya di atas Q3." },
            { text: "70", why: "IQR = 20; batas atas = 40 + 1,5 × 20 = 70.", correct: true },
            { text: "80", why: "Itu Q3 + IQR — pengalinya 1,5, bukan 1." },
            { text: "100", why: "Tidak ada dasarnya; hitung IQR dulu, baru pagar." },
          ],
        },
        {
          q: "Data transaksi mengandung banyak outlier (potensi fraud). Metode deteksi terbaik?",
          options: [
            { text: "Z-score", why: "Mean/SD-nya terkontaminasi outlier — masking effect membuatnya gagal." },
            { text: "IQR", why: "IQR robust dan bagus, tapi MAD lebih kebal untuk data sangat kotor." },
            { text: "MAD", why: "Median tidak terpengaruh outlier lain: tidak ada masking effect.", correct: true },
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
        body: "Lima heuristik. Satu: outlier adalah tersangka, bukan terpidana — ia bisa jadi fraud yang paling berharga atau error input yang paling membosankan; investigasi dulu, hapus kemudian (atau tidak sama sekali). Dua: z-score bisa dibutakan oleh outlier itu sendiri — satu monster menggeser mean dan menggembungkan SD sehingga outlier lain bersembunyi (masking effect); MAD kebal karena median tidak bisa disuap. Tiga: 1,5 kali IQR adalah konvensi Tukey, bukan hukum alam — pada data normal ia menandai 0,7 persen data, pada data sangat miring ia terlalu agresif; sesuaikan pagar dengan distribusinya. Empat: definisikan aturan outlier sebelum melihat data — aturan yang dibuat setelah melihat hasilnya adalah berburu untuk mendukung cerita. Lima: laporkan berapa yang dibuang dan mengapa — pipeline pembersih tanpa jejak audit adalah penghapus bukti; Rani belajar ini dengan cara yang mahal: 37 transaksi per hari hilang tanpa catatan. Enam: bedakan outlier univariat dari multivariat — titik yang wajar di setiap sumbu bisa menjadi anomali dalam kombinasinya; untuk itu ada Mahalanobis, bukan sekadar z-score.",
      },
    },
  ],
};
