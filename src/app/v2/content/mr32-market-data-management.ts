import type { V2Lesson } from "../lib/types";

const FIG_KURVA = `<svg viewBox=\"0 0 560 360\" role=\"img\" aria-label=\"Kurva imbal hasil dengan titik hilang.\">
<g font-family=\"var(--font-ui)\">
<text x=\"14\" y=\"24\" font-size=\"13\" fill=\"var(--chart-text)\" font-weight=\"bold\">Kurva imbal hasil: titik 3 bulan hilang, diinterpolasi</text>
<line x1=\"60\" y1=\"290\" x2=\"520\" y2=\"290\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<text x=\"290\" y=\"326\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Tenor →</text>
<text x=\"22\" y=\"160\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" transform=\"rotate(-90 22 160)\">Yield % →</text>
<line x1=\"100\" y1=\"250\" x2=\"240\" y2=\"230\" stroke=\"var(--c1)\" stroke-width=\"2.5\"/>
<line x1=\"240\" y1=\"230\" x2=\"380\" y2=\"200\" stroke=\"var(--c1)\" stroke-width=\"2.5\" stroke-dasharray=\"7,5\"/>
<line x1=\"380\" y1=\"200\" x2=\"480\" y2=\"170\" stroke=\"var(--c1)\" stroke-width=\"2.5\"/>
<circle cx=\"100\" cy=\"250\" r=\"6\" fill=\"var(--c2)\"/>
<text x=\"100\" y=\"272\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">1M 6,50%</text>
<circle cx=\"240\" cy=\"230\" r=\"6\" fill=\"none\" stroke=\"var(--c4)\" stroke-width=\"2.5\"/>
<text x=\"240\" y=\"272\" font-size=\"10\" fill=\"var(--c4)\" text-anchor=\"middle\">3M 6,70% ?</text>
<circle cx=\"380\" cy=\"200\" r=\"6\" fill=\"var(--c2)\"/>
<text x=\"380\" y=\"222\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">6M 7,00%</text>
<circle cx=\"480\" cy=\"170\" r=\"6\" fill=\"var(--c2)\"/>
<text x=\"480\" y=\"192\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">12M 7,40%</text>
<text x=\"14\" y=\"350\" font-size=\"10\" fill=\"var(--chart-text)\">Lingkaran kosong + garis putus-putus = hasil interpolasi, bukan data pasar.</text>
</g>
</svg>`;

export const mr32: V2Lesson = {
  slug: "mr32-market-data-management",
  track: "Market Risk",
  module: "Data & Infrastruktur",
  title: "MR32 — Market Data Management: Kurva, Vol Surface & Data Busuk",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "VaR yang salah Rp40 miliar karena satu harga basi",
      prose: [
        "Kamis pagi, laporan VaR bank 'Samudra' melonjak 35% dalam sehari — dari Rp115 miliar menjadi Rp155 miliar. Komite risiko panik: 'Eksposur apa yang berubah?' Jawabannya: tidak ada. Yang berubah adalah satu harga: obligasi acuan 10 tahun tidak diperdagangkan selama 4 hari (libur pasar + sepi), sehingga feed data mengulang harga lama Rp102,6 berkali-kali — lalu pada hari kelima ada satu transaksi di Rp180 (lot kecil, kondisi khusus). Sistem validasi tidak menangkap keduanya: harga basi dianggap 'stabil', harga Rp180 dianggap 'data'.",
        "VaR yang memakai data itu menghitung volatilitas dari lompatan 102,6 → 180 → 103,1 seolah itu pergerakan pasar normal. Hasilnya: angka risiko yang menakutkan dari kejadian yang tidak pernah terjadi. Bank hampir memotong Rp40 miliar eksposur — berdasarkan hantu statistik.",
        "Twist-nya: model risiko tidak pernah lebih jujur dari datanya. Market data management — validasi, pembersihan, dan konstruksi kurva — adalah fondasi yang tidak terlihat dari setiap angka VaR, XVA, dan limit. Lesson ini mengajarkan tiga validasi wajib (stale, outlier, missing), interpolasi kurva, dan cara mengukur 'berapa banyak VaR-ku tercemar data busuk'.",
      ],
      tasks: [],
    },
    {
      id: "validasi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga validasi wajib: basi, lonjakan, hilang",
      prose: [
        "Stale price — Si Peniru: harga yang diulang karena tidak ada transaksi, bukan karena pasar diam. Deteksi: hitung panjang run nilai identik berurutan; run ≥ 4 hari untuk obligasi likuid = stale, tandai dan jangan pakai untuk volatilitas. Bahayanya ganda: ia membuat volatilitas tampak TERLALU RENDAH (risiko diremehkan) — lalu saat harga 'kembali hidup', lompatannya tampak TERLALU TINGGI (risiko dilebihkan). Satu data basi merusak dua arah.",
        "Outlier — Si Pengacau: harga yang menyimpang jauh dari kewajaran, biasanya dari lot kecil/kondisi khusus (seperti Rp180 di cerita). Deteksi: bandingkan dengan median 5 hari sebelumnya; deviasi > 5% untuk obligasi pemerintah = flag untuk review manusia. Jangan auto-hapus — outlier kadang adalah krisis yang sesungguhnya (2008, 2020). Aturannya: flag otomatis, keputusan manusia.",
        "Missing — Si Lubang: titik kurva yang tidak ada (lelang dibatalkan, feed putus). Berbeda dari stale: di sini TIDAK ADA angka sama sekali, sehingga sistem yang malas mengisi nol atau mengulang kemarin — keduanya salah. Penanganannya: interpolasi eksplisit yang DITANDAI sebagai estimasi (lihat langkah 3), bukan tambalan diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membersihkan data terlalu agresif: menghapus semua outlier sehingga krisis 2008 'tidak pernah terjadi' di backtest. Data cleaning untuk risiko punya arah yang benar: tandai & telusuri, bukan hapus & lupakan. Backtest yang tidak pernah melihat krisis adalah dongeng, bukan validasi.",
      },
      reference: "Basi = run identik ≥ 4; lonjakan = >5% dari median 5 hari; hilang = interpolasi bertanda.",
    },
    {
      id: "kurva",
      eyebrow: "Langkah 3 · Konsep",
      title: "Kurva hasil & interpolasi: mengisi lubang dengan jujur",
      prose: [
        "Kurva imbal hasil — Si Peta Waktu Uang: yield untuk tiap tenor, dibangun dari harga obligasi acuan. Masalah praktis: tidak semua tenor punya data setiap hari. Interpolasi linear — Si Penggaris: tarik garis lurus antara dua titik tetangga. Untuk tenor 3 bulan yang hilang di antara 1 bulan (6,50%) dan 6 bulan (7,00%): r = 6,50 + (7,00−6,50) × (3−1)/(6−1) = 6,70%. Sederhana, transparan, dan cukup untuk tenor pendek di kurva yang landai.",
        "Intuisi: interpolasi adalah 'menebak dengan izin' — boleh, asal (1) metodenya terdokumentasi, (2) hasilnya DITANDAI sebagai estimasi (lingkaran kosong di chart, bukan titik penuh), dan (3) tidak dipakai untuk tenor di luar rentang data (ekstrapolasi = ramalan, bukan interpolasi). Kurva yang 30% titiknya hasil interpolasi tanpa tanda adalah kurva fiksi.",
        "Dampak ke VaR: setiap input VaR (volatilitas, korelasi, kurva) yang tercemar data busuk menular ke output. Praktik yang baik: laporkan 'data quality score' bersama VaR — misalnya 'VaR Rp115 miliar (98% input valid, 2% diinterpolasi)'. Angka risiko tanpa skor kualitas data = klaim tanpa bukti.",
      ],
      formula: String.raw`r(t) = r_1 + (r_2 - r_1)\,\frac{t - t_1}{t_2 - t_1}`,
      formulaNote: "r(t) = yield interpolasi pada tenor t; r_1, r_2 = yield di dua titik tetangga yang ada datanya; t_1, t_2 = tenor kedua titik itu. Berlaku hanya untuk t_1 < t < t_2 (interpolasi); di luar rentang = ekstrapolasi, dilarang tanpa model khusus.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menginterpolasi dengan spline orde tinggi agar kurva 'mulus dan cantik'. Spline bisa berosilasi liar di antara titik (overshoot) dan menghasilkan yield negatif di tenor yang tidak masuk akal. Untuk kurva acuan, linear yang jujur mengalahkan spline yang cantik tapi berhalusinasi.",
      },
      reference: "Interpolasi = menebak dengan izin: dokumentasi + tanda + tanpa ekstrapolasi.",
    },
    {
      id: "figure-kurva",
      eyebrow: "Langkah 4 · Visual",
      title: "Kurva dengan lubang yang jujur",
      prose: [
        "Cara membaca: sumbu X = tenor, sumbu Y = yield %; titik penuh = data pasar asli; lingkaran kosong + garis putus-putus = hasil interpolasi (6,70%). Interpretasi: kurva tetap bisa dipakai untuk valuasi tenor 3 bulan — TAPI siapa pun yang membacanya tahu titik itu adalah estimasi, bukan observasi. Inilah bedanya 'mengisi lubang' dan 'menutupi lubang'.",
        "Perhatikan kemiringan: interpolasi linear mengasumsikan perubahan yield merata di antara dua titik. Bila kurva sebenarnya melengkung tajam di rentang itu (misalnya ada ekspektasi kenaikan suku bunga), linear akan bias — dan bias itu harus diakui di dokumentasi metodologi, bukan disembunyikan.",
      ],
      figure: {
        svg: FIG_KURVA,
        alt: "Kurva imbal hasil: 1M 6,50%, 3M 6,70% hasil interpolasi (lingkaran kosong), 6M 7,00%, 12M 7,40%.",
        caption: "Cara membaca: X = tenor, Y = yield; lingkaran kosong = interpolasi. Interpretasi: titik 3M (6,70%) boleh dipakai valuasi tetapi harus ditandai sebagai estimasi.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menampilkan kurva interpolasi tanpa tanda visual, lalu analis lain menggunakannya sebagai 'data' untuk kalibrasi model. Satu titik tak bertanda bisa menular ke puluhan model downstream. Aturan: setiap angka hasil estimasi membawa 'cap' asalnya — selamanya.",
      },
      reference: "Estimasi tanpa tanda = fiksi yang menular.",
    },
    {
      id: "lab-data",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: deteksi data busuk & interpolasi kurva",
      prose: [
        "Seri harga obligasi 8 hari: [102.5, 102.6, 102.6, 102.6, 102.6, 180.0, 103.1, 103.2]. Tugas: (t1) temukan outlier — harga yang menyimpang > 5% dari median 5 hari sebelumnya (periksa dari indeks 5); (t2) hitung `n_stale` — jumlah harga stale, yaitu run nilai identik berurutan ≥ 4 (hitung kelebihan selain kemunculan pertama); (t3) interpolasi yield 3 bulan dari titik 1M 6,50% dan 6M 7,00%, lalu cetak ringkasan diawali `KURVA:`.",
        "Hasil yang benar: outlier di indeks 5 (180,0 menyimpang 75% dari median 102,6); n_stale = 3 (tiga pengulangan 102,6); rate_3m = 6,70. Eksplorasi: ubah ambang outlier menjadi 50% — apakah 180 tertangkap? Ubah seri agar run identik hanya 3 — apakah masih stale menurut aturan ≥ 4?",
      ],
      tasks: [
        { id: "t1", text: "Temukan `outlier_idx`: indeks harga dengan deviasi > 5% dari median 5 hari sebelumnya" },
        { id: "t2", text: "Hitung `n_stale`: kelebihan pengulangan pada run identik berurutan dengan panjang ≥ 4" },
        { id: "t3", text: "Hitung `rate_3m` via interpolasi linear; cetak ringkasan diawali `KURVA:`" },
      ],
      expected: "outlier_idx=[5]\nn_stale=3\nrate_3m=6.7\nKURVA: 1 outlier (idx 5), 3 harga stale, yield 3M hasil interpolasi = 6.7%",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Perhatikan median dipakai sebagai pembanding, bukan rata-rata: rata-rata 5 hari sebelumnya ikut 'tercemar' bila outlier masuk jendela, sedangkan median kebal. Memilih statistik pembanding yang robust adalah separuh dari seni validasi data.",
      },
      hints: [
        "Gunakan statistics.median untuk median 5 hari sebelum indeks i.",
        "Untuk stale: telusuri run nilai identik; bila panjang run ≥ 4, stale = panjang − 1.",
        "rate_3m = 6.50 + (7.00-6.50)*(3-1)/(6-1).",
      ],
      code: {
        starter: "import statistics\n\n# Seri harga obligasi 8 hari — JANGAN UBAH.\nharga = [102.5, 102.6, 102.6, 102.6, 102.6, 180.0, 103.1, 103.2]\n\n# TULIS KODEMU: deteksi outlier, hitung stale, interpolasi kurva\noutlier_idx = \nn_stale = \nrate_3m = \nprint(f\"outlier_idx={outlier_idx}\")\nprint(f\"n_stale={n_stale}\")\nprint(f\"rate_3m={rate_3m}\")\nprint(f\"KURVA: 1 outlier (idx 5), 3 harga stale, yield 3M hasil interpolasi = {rate_3m}%\")\n",
        lockLines: 4,
        solution: "import statistics\n\n# Seri harga obligasi 8 hari — JANGAN UBAH.\nharga = [102.5, 102.6, 102.6, 102.6, 102.6, 180.0, 103.1, 103.2]\n\n# TULIS KODEMU: deteksi outlier, hitung stale, interpolasi kurva\noutlier_idx = [i for i in range(5, len(harga)) if abs(harga[i] / statistics.median(harga[i-5:i]) - 1) > 0.05]\nn_stale = 0\nfor i in range(1, len(harga)):\n    run, j = 1, i\n    while j < len(harga) and harga[j] == harga[j-1]:\n        run += 1\n        j += 1\n    if run >= 4:\n        n_stale = run - 1\n        break\nrate_3m = 6.50 + (7.00 - 6.50) * (3 - 1) / (6 - 1)\nprint(f\"outlier_idx={outlier_idx}\")\nprint(f\"n_stale={n_stale}\")\nprint(f\"rate_3m={rate_3m}\")\nprint(f\"KURVA: 1 outlier (idx 5), 3 harga stale, yield 3M hasil interpolasi = {rate_3m}%\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "outlier_idx", value: [5], label: "outlier_idx = [5]", msg: "180/102,6 − 1 = 75% > 5%; harga lain di dalam ambang." },
          { kind: "equal", task: "t2", name: "n_stale", value: 3, label: "n_stale = 3", msg: "Run 102,6 sepanjang 4 (indeks 1–4); stale = 4 − 1 = 3." },
          { kind: "equal", task: "t3", name: "rate_3m", value: 6.7, tol: 0.001, label: "rate_3m = 6,70", msg: "6,50 + 0,50 × 2/5 = 6,70." },
          { kind: "stdout_matches", task: "t3", label: "Ringkasan KURVA tercetak", msg: "Baris ringkasan harus diawali persis 'KURVA:'.", pattern: "KURVA:" },
          { kind: "uses", task: "t1", label: "Memakai median", msg: "Pembanding robust = median, bukan rata-rata.", token: "median" },
        ],
      },
      reference: "Validasi = tandai & telusuri; interpolasi = isi lubang dengan izin.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Empat kondisi data, empat perlakuan",
      prose: [
        "Skenario satu — harga stale terdeteksi (run ≥ 4 hari): TANDAI & KECUALIKAN dari perhitungan volatilitas, pakai harga terakhir valid untuk valuasi dengan flag. Jangan hapus — jejak stale adalah bukti untuk audit.",
        "Skenario dua — outlier ter-flag (> 5% dari median): REVIEW MANUSIA. Bila lot kecil/kondisi khusus → winsorize atau kecualikan dengan dokumentasi. Bila krisis sungguhan → PERTAHANKAN; menghapusnya = menghapus sejarah.",
        "Skenario tiga — titik kurva hilang: INTERPOLASI BERTANDA. Linear untuk tenor pendek & kurva landai; dokumentasikan metode; tandai visual; laporkan proporsi titik interpolasi bersama angka risiko.",
        "Skenario empat — > 10% input kunci tidak valid dalam sehari: JANGAN TERBITKAN ANGKA RISIKO APA ADANYA. Terbitkan dengan disclaimer kualitas data + estimasi dampak, atau pakai angka kemarin yang valid dengan penjelasan. Angka risiko dari data busuk lebih berbahaya daripada tidak ada angka — karena ia memberi rasa aman yang palsu.",
        "Aturan praktis 10 detik: (1) basi? → kecualikan dari vol; (2) lonjakan? → flag, putuskan manusia; (3) hilang? → interpolasi bertanda; (4) busuk > 10%? → jangan terbitkan tanpa disclaimer.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membuat aturan validasi lalu tidak pernah meninjau flag-nya ('sudah otomatis, aman'). Validasi otomatis tanpa review manusia = alarm kebakaran yang tidak terhubung ke siapa pun. Setiap flag butuh pemilik dan SLA tindak lanjut.",
      },
      reference: "Otomatis menandai, manusia memutuskan, semua terdokumentasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "VaR Rp155 miliar: data atau risiko?",
      prose: [
        "Kembali ke cerita pembuka: VaR melonjak dari 115 ke 155 (+35%) dalam sehari. Tim menemukan: 4 hari harga basi 102,6 + 1 outlier 180. Pertanyaan: (a) mekanisme apa yang membuat VaR melonjak? (b) berapa perkiraan VaR yang 'bersih'? (c) apa yang harus diubah besok pagi?",
        "Pembahasan: (a) Volatilitas historis dihitung dari return harian; lompatan 102,6→180 (+75%) lalu 180→103,1 (−43%) memasukkan dua return ekstrem fiktif ke jendela volatilitas — VaR (yang proporsional terhadap volatilitas) ikut meledak. (b) Dengan mengeluarkan 2 return fiktif itu (atau memakai harga valid terakhir 102,6 → 103,1 yang sebenarnya tenang), volatilitas kembali normal — perkiraan VaR bersih ≈ Rp115–120 miliar, bukan 155. (c) Besok pagi: aktifkan validasi stale & outlier di pipeline (flag otomatis + review), dan tambahkan 'data quality score' di sampul laporan VaR. Tanpa itu, kejadian yang sama akan terulang setiap kali ada libur panjang + lot kecil.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pelajaran terbesar: bank hampir memotong Rp40 miliar eksposur berdasarkan angka yang salah. Keputusan risiko yang diambil dari data busuk bisa LEBIH MERUGI daripada tidak ada keputusan. Validasi data bukan 'tugas IT' — ia adalah garis pertahanan pertama risk management.",
      },
      reference: "Data busuk → keputusan mahal. Validasi = pertahanan pertama.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "Tiga validasi wajib: stale (run identik ≥ 4 hari), outlier (> 5% dari median 5 hari → review manusia), missing (interpolasi bertanda, bukan tambalan diam-diam).",
        "Interpolasi linear r(t) = r1 + (r2−r1)(t−t1)/(t2−t1) — hanya di dalam rentang data, selalu ditandai sebagai estimasi.",
        "Data busuk menular: volatilitas fiktif → VaR fiktif → keputusan mahal. Laporkan data quality score bersama angka risiko.",
        "Bersihkan dengan arah benar: tandai & telusuri, bukan hapus & lupakan — krisis sungguhan harus bertahan di data.",
        "Bila > 10% input tidak valid: jangan terbitkan angka apa adanya; pakai disclaimer atau angka kemarin yang valid.",
      ],
      quiz: [
        {
          q: "Harga obligasi 102,6 muncul 6 hari berturut-turut padahal pasar sepi libur. Perlakuan yang benar?",
          options: [
            { text: "Tandai stale; kecualikan dari perhitungan volatilitas", why: "Benar: harga basi merusak dua arah — meremehkan vol saat diam, melebihkan saat 'kembali hidup'.", correct: true },
            { text: "Pakai apa adanya — pasar memang stabil", why: "Bukan stabilitas pasar, melainkan ketiadaan transaksi." },
            { text: "Hapus 6 hari itu dari database", why: "Menghapus menghilangkan jejak audit; yang benar menandai." },
            { text: "Ganti dengan harga rata-rata sebulan", why: "Menambal dengan angka buatan tanpa dasar — lebih buruk dari menandai." },
          ],
        },
        {
          q: "Sebuah harga menyimpang 40% dari median 5 hari. Menurut aturan lesson ini?",
          options: [
            { text: "Flag otomatis, lalu review manusia memutuskan: pertahankan bila krisis, winsorize bila lot kecil", why: "Benar: flag otomatis + keputusan manusia; outlier bisa jadi krisis sungguhan.", correct: true },
            { text: "Hapus otomatis — pasti data salah", why: "Berbahaya: menghapus krisis 2008 dari backtest membuat validasi menjadi dongeng." },
            { text: "Abaikan — satu titik tidak memengaruhi apa-apa", why: "Satu titik ekstrem bisa mendominasi volatilitas historis." },
            { text: "Gandakan bobotnya agar model waspada", why: "Tidak ada dasar metodologis; perlakukan via prosedur, bukan insting." },
          ],
        },
        {
          q: "Yield 3M hilang; diketahui 1M 6,50% dan 6M 7,00%. Interpolasi linear menghasilkan?",
          options: [
            { text: "6,70% — dan harus ditandai sebagai estimasi", why: "Benar: 6,50 + 0,50×(2/5) = 6,70; lingkaran kosong, bukan titik penuh.", correct: true },
            { text: "6,75% — rata-rata sederhana", why: "Rata-rata mengabaikan posisi tenor 3M yang lebih dekat ke 1M." },
            { text: "6,50% — pakai titik terdekat saja", why: "Mengabaikan informasi dari sisi 6M; interpolasi memakai keduanya." },
            { text: "Tidak bisa diisi — biarkan kosong", why: "Kurva butuh kontinu untuk valuasi; kosong = sistem mengisi diam-diam (lebih buruk)." },
          ],
        },
        {
          q: "Kenapa median (bukan rata-rata) dipakai sebagai pembanding deteksi outlier?",
          options: [
            { text: "Median kebal (robust): tidak ikut tercemar bila outlier masuk jendela", why: "Benar: rata-rata terseret outlier; median tetap mewakili kewajaran.", correct: true },
            { text: "Median selalu lebih kecil dari rata-rata", why: "Tidak selalu; tergantung distribusi." },
            { text: "Rata-rata tidak bisa dihitung untuk harga", why: "Bisa dihitung — masalahnya bukan komputasi melainkan ketahanan." },
            { text: "Regulator mewajibkan median", why: "Tidak ada ketentuan seperti itu; ini pilihan metodologis." },
          ],
        },
        {
          q: "Lab lesson ini: bila ambang outlier dinaikkan dari 5% menjadi 80%, apa yang terjadi?",
          options: [
            { text: "180 (deviasi 75%) tidak lagi tertangkap — ambang terlalu longgar", why: "Benar: 75% < 80%, outlier lolos; ambang harus di bawah deviasi yang ingin ditangkap.", correct: true },
            { text: "Semua harga menjadi outlier", why: "Terbalik: ambang lebih tinggi = lebih sedikit yang tertangkap." },
            { text: "Tidak ada perubahan — 180 selalu outlier", why: "Status outlier tergantung ambang, bukan sifat mutlak harga." },
            { text: "n_stale ikut berubah", why: "Stale detection punya aturan sendiri (run ≥ 4), independen dari ambang outlier." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap market data management sebagai 'pekerjaan data engineer, bukan risk'. Risk manager yang tidak memahami kualitas datanya sedang menandatangani angka yang tidak ia pahami — dan tanda tangan itu yang diminta regulator saat terjadi kesalahan.",
      },
      hints: [
        "Tiga serangkai: basi → kecualikan dari vol; lonjakan → flag + manusia; hilang → interpolasi bertanda.",
        "Ingat angka lab: outlier idx 5 (75% deviasi), 3 harga stale, 3M = 6,70%.",
      ],
      reference: "Model tidak pernah lebih jujur dari datanya.",
      next: { label: "MR33 — Economic Capital dan RAROC: Modal Trading Book yang Jujur", href: "/v2/learn/mr33-economic-capital-raroc" },
    },
  ],
};
