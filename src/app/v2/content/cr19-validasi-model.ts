import type { V2Lesson } from "../lib/types";

export const cr19: V2Lesson = {
  slug: "cr19-validasi-model",
  track: "Credit Risk",
  module: "Validasi & Monitoring",
  title: "CR19 — Validasi Model",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Gini 0,72 yang bohong",
      prose: [
        "Vendor memamerkan model dengan Gini 0,72. Tim bank membeli — tanpa validasi independen. Setahun kemudian model ambruk: prediksi meleset jauh dari proyeksi.",
        "Investigasi validator independen menemukan tiga dosa: Gini dihitung dari data training — bukan out-of-time (di data baru: 0,48); kalibrasi tidak pernah diuji — PD prediksi 4%, aktual 7%; populasi bergeser — PSI 0,31 (segmen baru masuk), tidak ada yang memantau.",
        "Gini 0,72 itu benar dihitung, salah dimaknai — seperti nilai ujian yang bocor soalnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Validasi bukan \"cap stempel\" — melainkan ujian kejujuran berlapis. Validasi dilakukan oleh pihak independen (bukan tim pembuat model) — guidance SR 11-7 dari Fed/OCC AS (bukan standar global \u2014 tidak ada standar validasi model yang berlaku universal; model risk management). Di Indonesia: OJK mengawasi via ICAAP & audit. Wasit tidak boleh dari tim yang bertanding.",
      },
      reference: "Validasi sendiri = penjual menilai dagangannya sendiri.",
    },
    {
      id: "pilar",
      eyebrow: "Langkah 2 · Empat Pilar",
      title: "Ujian kejujuran berlapis",
      prose: [
        "Validasi model = pengujian independen untuk memastikan model layak pakai. Empat pilar: diskriminasi — bisa membedakan bagus vs jelek? (Gini, KS, AUC); kalibrasi — angkanya benar? (Hosmer-Lemeshow, plot kalibrasi); stabilitas — masih relevan untuk populasi kini? (PSI, CSI); benchmark — lebih baik dari alternatif sederhana? (vs model naif/champion).",
        "Prinsip emas: validasi dilakukan oleh pihak independen (bukan tim pembuat model) — guidance SR 11-7 dari Fed/OCC AS. Di Indonesia: OJK mengawasi via ICAAP & audit.",
        "Validasi memakai aturan terlemah — satu pilar gagal = model tidak layak penuh. Seperti rantai: sekuat mata terlemah. Diskriminasi lolos tetapi stabilitas GAGAL → vonis keseluruhan: TOLAK bersyarat (atau batasi pakai).",
      ],
      tasks: [],
      reference: "Model ML kompleks (Gini 0,61) vs regresi logistik (0,60)? Pilih logistik — selisih 1 poin tidak membayar kompleksitas + explainability.",
    },
    {
      id: "lab-psi",
      eyebrow: "Langkah 3 · Lab PSI",
      title: "Apakah populasi bergeser?",
      prose: [
        "Distribusi band skor saat model dibangun (training %) vs saat ini (kini %) terkunci. Tugasmu: hitung PSI = Σ (kini% − train%) × ln(kini%/train%) dan tentukan status (<0,10 OK; 0,10–0,25 WASPADA; >0,25 GESER).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `psi`" },
        { id: "t2", text: "Tentukan `status`" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "PSI=0.1573 status=WASPADA",
      hints: [
        "Ubah % jadi proporsi: t/100, k/100.",
        "kontrib = (k - t) * math.log(k / t).",
        "0.1573 di antara 0.10–0.25 → WASPADA.",
      ],
      code: {
        starter: `import math\ntraining = [5, 15, 35, 30, 15]\nkini     = [12, 25, 30, 22, 11]\n\n# TULIS KODEMU\npsi = \nstatus = \n\nprint(f"PSI={psi:.4f} status={status}")`,
        lockLines: 3,
        solution: `import math\ntraining = [5, 15, 35, 30, 15]\nkini     = [12, 25, 30, 22, 11]\n\n# TULIS KODEMU\npsi = sum((k/100 - t/100) * math.log((k/100)/(t/100)) for t, k in zip(training, kini))\nstatus = "OK - stabil" if psi < 0.10 else ("WASPADA - investigasi" if psi <= 0.25 else "GESER - rekalibrasi")\n\nprint(f"PSI={psi:.4f} status={status}")`,
        checks: [
          { kind: "equal", task: "t1", name: "psi", value: 0.1573, tol: 0.002, label: "`psi` seharusnya 0.1573", msg: "Jumlahkan 5 kontribusi band." },
          { kind: "equal", task: "t2", name: "status", value: "WASPADA - investigasi", label: "`status` = WASPADA", msg: "0.1573 di 0.10–0.25 → waspada." },
          { kind: "stdout_matches", task: "t3", pattern: "PSI=0\\.1573\\s+status=WASPADA", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "PSI 0,31 > 0,25 = bergeser signifikan: model dilatih untuk 'dunia lama'. Investigasi via CSI, siapkan rekalibrasi.",
    },
    {
      id: "diskriminasi",
      eyebrow: "Langkah 4 · Diskriminasi",
      title: "Bisa membedakan?",
      prose: [
        "Gini = 2×AUC − 1. Patokan retail: 0,4–0,6 baik. Wajib out-of-time (bukan training!). KS = jarak kumulatif maks Good vs Bad. Patokan: 20–60%.",
        "Tiga dosa diskriminasi: (1) lapor Gini training (optimis palsu); (2) tidak bandingkan dengan baseline (model lama / skor biro kredit); (3) sample bias — Gini dihitung dari yang di-ACC saja (CR8!).",
        "Validator selalu bertanya: \"Gini berapa di data yang BELUM PERNAH dilihat model?\" (out-of-time: periode berbeda). Selisih Gini training vs OOT >10 poin = overfitting — model menghafal, bukan belajar.",
      ],
      tasks: [],
      reference: "Vendor melaporkan Gini 0,68 dari data training → minta Gini out-of-time.",
    },
    {
      id: "kalibrasi",
      eyebrow: "Langkah 5 · Kalibrasi",
      title: "Angkanya benar?",
      prose: [
        "Uji Hosmer-Lemeshow (HL) = uji statistik apakah PD prediksi cocok dengan default aktual per desil risiko. Cara: bagi populasi ke 10 desil (berdasarkan PD prediksi), hitung selisih prediksi vs aktual per desil. HL besar = miskalibrasi (tolak kecocokan jika >15,5 pada df=8, α=5%).",
        "HL seperti inspeksi timbangan pasar — tidak peduli timbangan bisa membedakan berat vs ringan (diskriminasi), tetapi memastikan 1 kg benar-benar 1 kg (kalibrasi). Timbangan yang \"ranking benar tetapi angka salah\" menipu setiap transaksi.",
        "Dengan n=2 juta, HL bisa jebol (p<0,05) padahal deviasi maks plot kalibrasi hanya 0,3 poin PD. HL sensitif ukuran sampel — validator senior membaca plot kalibrasi dalam satuan bisnis (basis poin), bukan sekadar p-value. Statistik tanpa konteks bisnis = angka tanpa makna.",
      ],
      formula: String.raw`HL = \sum_{g=1}^{10} \frac{(O_g - E_g)^2}{E_g(1-\bar{p}_g)}`,
      formulaNote: "O_g = default aktual desil g; E_g = default prediksi; p̄_g = rata-rata PD desil. df=8; kritis 5% = 15,5.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"HL lolos = model sempurna.\" HL hanya menguji kalibrasi rata-rata per desil — ia buta terhadap ranking dalam desil (diskriminasi) dan sensitif terhadap ukuran sampel. Pakai HL bersama plot kalibrasi visual + Gini — tidak sendirian.",
      },
      reference: "Diskriminasi (Gini) = bisa membedakan; kalibrasi (HL) = angkanya benar. Keduanya wajib.",
    },
    {
      id: "lab-hl",
      eyebrow: "Langkah 6 · Lab HL",
      title: "Uji kalibrasi per desil",
      prose: [
        "Prediksi vs aktual per desil (%, n=1000 per desil) terkunci. Tugasmu: hitung statistik HL dan putuskan (HL > 15,5 → TOLAK kecocokan).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hl`" },
        { id: "t2", text: "Tentukan `keputusan` ('TOLAK' atau 'TERIMA')" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "HL=24.97 keputusan=TOLAK",
      hints: [
        "kontrib = (o_bad - e_bad)**2 / (e_bad * (1-p)).",
        "e_bad = n*p; o_bad = n*a (p, a dalam proporsi).",
        "24.97 > 15.5 → TOLAK.",
      ],
      code: {
        starter: `pred = [1.0, 1.5, 2.0, 2.8, 3.5, 4.5, 6.0, 8.0, 11.0, 15.0]\naktu = [0.8, 1.2, 1.8, 2.5, 5.5, 4.2, 5.8, 7.5, 14.0, 13.5]\nn = 1000\n\n# TULIS KODEMU\nhl = \nkeputusan = \n\nprint(f"HL={hl:.2f} keputusan={keputusan}")`,
        lockLines: 3,
        solution: `pred = [1.0, 1.5, 2.0, 2.8, 3.5, 4.5, 6.0, 8.0, 11.0, 15.0]\naktu = [0.8, 1.2, 1.8, 2.5, 5.5, 4.2, 5.8, 7.5, 14.0, 13.5]\nn = 1000\n\n# TULIS KODEMU\nhl = sum(((n*a/100 - n*p/100)**2) / (n*p/100 * (1-p/100)) for p, a in zip(pred, aktu))\nkeputusan = "TOLAK" if hl > 15.5 else "TERIMA"\n\nprint(f"HL={hl:.2f} keputusan={keputusan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hl", value: 24.97, tol: 0.05, label: "`hl` seharusnya 24.97", msg: "D5 menyumbang 11.84, D9 menyumbang 9.19." },
          { kind: "equal", task: "t2", name: "keputusan", value: "TOLAK", label: "`keputusan` = TOLAK", msg: "24.97 > 15.5 → tolak kecocokan (miskalibrasi)." },
          { kind: "stdout_matches", task: "t3", pattern: "HL=24\\.97\\s+keputusan=TOLAK", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Lihat D5: aktual 5,5% vs prediksi 3,5% (+57%!) — desil inilah yang membuat HL jebol.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: memvonis model",
      prose: [
        "Skenario 1 — Vendor menawarkan model 'Gini 0,72, sudah lolos validasi'. → Tolak klaimnya; minta validasi ulang independen dengan 4 syarat: Gini out-of-time (bukan training!), uji HL + plot kalibrasi, PSI populasi, dan validator independen (bukan tim vendor — SR 11-7). Contoh nyata: Gini training 0,72 → OOT 0,48; kalibrasi tak pernah diuji; PSI 0,31. Model Rp 5 M yang ambruk setahun kemudian.",
        "Skenario 2 — Gini training vs out-of-time selisih >10 poin. → Vonis: overfitting — model menghafal, bukan belajar. Minta perbaikan atau tolak.",
        "Skenario 3 — PSI di atas 0,25. → Populasi bergeser: bongkar CSI per variabel untuk menemukan tersangkanya. Contoh nyata: PSI 0,28 → CSI penghasilan 0,35 — ekspansi ke gig worker membanjiri portofolio dengan segmen berpenghasilan rendah yang tak dikenal model.",
        "Skenario 4 — Miskalibrasi sistematis tetapi Gini stabil. → Rekalibrasi (faktor koreksi ke master scale) — murah dan cepat. Rebuild hanya bila ranking rusak atau populasi berubah total.",
        "Skenario 5 — Challenger (gradient boosting, Gini +1,5 poin) menantang champion (regresi logistik). → Champion BERTAHAN kecuali selisihnya membayar hilangnya explainability. Contoh nyata: 200+ variabel vs 12 variabel yang bisa dijelaskan ke OJK dalam 10 menit — 1,5 poin Gini tidak membayar kompleksitasnya.",
        "Aturan praktis 10 detik: validasi = 4 pilar (diskriminasi, kalibrasi, stabilitas, benchmark) — satu pilar gagal = vonis bersyarat; dan model itu seperti SIM: kedaluwarsa, bukan abadi — validasi ulang berkala.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Gini 0,72 dihitung dari data training dibaca sebagai 'model bagus' — seperti nilai ujian yang bocor soalnya: benar dihitung, salah dimaknai. Validator selalu bertanya: 'Gini berapa di data yang BELUM PERNAH dilihat model?'",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Validasi yang 'lolos' — benarkah?",
      prose: [
        "Vendor model mengklaim: \"Model kami lolos validasi!\" dengan bukti: Gini 0,68 — dihitung dari data training; \"kalibrasi baik\" — tanpa uji HL / plot kalibrasi; PSI tidak dihitung (\"populasi pasti stabil\"); validasi dilakukan oleh tim vendor sendiri. Harga: Rp 5 miliar + maintenance tahunan.",
        "Keputusan: TOLAK klaim \"lolos\" — minta validasi ulang independen. Empat keberatan: (1) Gini training 0,68 = tidak valid. Minta Gini out-of-time + bandingkan dengan model internal saat ini (benchmark). (2) Kalibrasi tanpa bukti = tidak ada. Minta uji HL + plot kalibrasi per desil — untuk ECL, angka yang menentukan rupiah. (3) PSI wajib dihitung — \"pasti stabil\" bukan argumen, melainkan asumsi yang harus diuji. (4) Validasi vendor sendiri = konflik kepentingan; validator harus independen (SR 11-7).",
      ],
      tasks: [],
      reference: "Model ML baru Gini 0,55 vs logistik lama 0,54 → tolak penggantian: selisih 0,01 tidak membayar kompleksitas.",
    },
    {
      id: "jadwal",
      eyebrow: "Langkah 9 · Validasi berkala",
      title: "SIM yang tidak diperpanjang",
      prose: [
        "Cerita pembuka lesson ini tentang validasi SAAT PEMBELIAN — vendor, Gini 0,72, ambruk setahun kemudian. Tetapi ada kegagalan yang lebih umum dan lebih sunyi: model yang lolos validasi awal dengan jujur, lalu dibiarkan berjalan tanpa pernah divalidasi lagi. Ibarat SIM: lolos ujian sekali, berlaku seumur hidup — padahal pengemudi menua, jalan berubah, mobil berganti. Contoh: Bank Nusantara memakai scorecard kartu kredit yang divalidasi 2022 dengan hasil bersih — Gini out-of-time 0,58, HL lolos, PSI 0,06. Tiga tahun berlalu tanpa validasi ulang (\"kan sudah lolos\"). 2025: tim iseng mengecek — Gini out-of-time 0,44 (turun 14 poin!), PSI 0,28 (populasi bergeser signifikan), kalibrasi meleset: PD prediksi 3%, aktual 5,1%. Apa yang terjadi? 2023–2024 bank agresif ekspansi ke segmen gig worker via aplikasi — populasi baru dengan pola risiko berbeda (penghasilan fluktuatif, riwayat tipis) membanjiri portofolio; model yang dilatih untuk karyawan tetap menjadi turis di negerinya sendiri. Kerugiannya tidak spektakuler seperti kasus vendor — ia menetes: pricing meleset 2 poin PD \u2014 Rp56 miliar per tahun (0,02 \u00d7 Rp4 triliun \u00d7 70%) \u2014 selama 2 tahun \u2248 Rp112 miliar expected loss yang tidak ter-capture pricing. Kematian model yang lambat tidak membuat berita — hanya membuat laba bocor.",
        "Bandingkan dua rezim. Cara salah: \"validasi sekali saat implementasi, lalu percaya selamanya\" — model dianggap aset tetap yang tidak menyusut. Cara benar: validasi berkala + pemicu (trigger-based). Jadwal baku industri: validasi penuh tahunan untuk model material (yang memengaruhi CKPN, modal, atau keputusan kredit massal), review ringan kuartalan (dashboard: Gini OOT rolling, PSI, plot kalibrasi). Dan yang lebih penting — pemicu otomatis yang memaksa validasi di luar jadwal: (1) PSI > 0,25 → investigasi dalam 30 hari; (2) Gini out-of-time turun > 5 poin dari baseline validasi → review mendalam; (3) perubahan besar pada populasi atau kebijakan (ekspansi segmen baru, perubahan cut-off, merger) → revalidasi sebelum 2 kuartal berjalan; (4) temuan audit atau backtest exception. Tanpa pemicu tertulis, \"nanti kalau sempat\" berarti \"tidak pernah\" — jadwal validasi selalu kalah prioritas dari proyek bisnis. Dengan pemicu, validasi menjadi seperti service mobil berdasarkan kilometer, bukan berdasarkan \"kapan ingat\".",
        "Mode kegagalan yang harus diwaspadai dalam validasi berkala: \"validasi seremonial\" — laporan tahunan 100 halaman yang menyimpulkan \"model masih layak pakai dengan catatan\" setiap tahun, tanpa pernah ada model yang benar-benar diturunkan statusnya. Jika dalam 5 tahun tidak ada satu pun model yang mendapat vonis \"batasi pakai\" atau \"rekalibrasi wajib\", maka fungsi validasinya mati — validatornya menjadi notaris, bukan wasit. Aturan keputusan untuk kepala validasi: tetapkan \"kuota ketidaknyamanan\" — ekspektasi sehat adalah 10–20% model tervalidasi per tahun mendapat temuan material (bukan berarti modelnya jelek — berarti validatornya bekerja). Dan vonis harus punya gigi: \"batasi pakai\" berarti konkret — misalnya cut-off dinaikkan 20 poin sementara, atau eksposur segmen baru dibekukan sampai rekalibrasi selesai. Validasi tanpa konsekuensi = opini tanpa akuntabilitas. Ingat prinsip empat pilar (langkah 2): aturan terlemah — satu pilar gagal = vonis keseluruhan terpengaruh. Prinsip yang sama berlaku untuk JADWAL: satu tahun terlewat tanpa alasan = model dianggap belum tervalidasi untuk tahun itu — perlakukan angkanya dengan cadangan skeptis yang lebih besar.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: Model itu seperti SIM — kedaluwarsa, bukan abadi",
        body: "Kesalahan mental yang paling umum: menganggap model sebagai \"barang\" yang selesai dibangun — seperti jembatan yang setelah jadi tinggal dipakai. Model lebih mirip SIM: dokumen yang menyatakan \"pada TANGGAL INI, dengan POPULASI INI, kamu layak mengemudi\". SIM kedaluwarsa bukan karena kamu tiba-tiba tidak bisa menyetir — melainkan karena waktu dan keadaan berubah dan perlu pemeriksaan ulang. Heuristiknya: setiap kali melihat angka model (PD, skor, Gini), tanyakan dua hal — \"kapan terakhir divalidasi?\" dan \"apakah populasi hari ini masih seperti populasi validasi?\" Jika jawaban pertama \"lebih dari setahun lalu\" dan jawaban kedua \"tidak tahu\", perlakukan angka itu sebagai perkiraan, bukan fakta — tambahkan margin kehati-hatian dalam keputusanmu. Tanda paling cepat bahwa sebuah bank tidak paham ini: mereka bisa menyebutkan Gini modelnya, tetapi tidak bisa menyebutkan tanggal validasi terakhirnya. Angka tanpa tanggal = angka tanpa konteks waktu = angka yang berpotensi basi. Dan waspadai argumen \"modelnya kan tidak berubah\" — benar, modelnya tidak berubah; DUNIAnyalah yang berubah di sekitar model yang diam. Itulah definisi kedaluwarsa.",
      },
      reference: "Validasi tahunan + pemicu otomatis. Model tanpa tanggal validasi = angka basi.",
    },
    {
      id: "benchmark",
      eyebrow: "Langkah 10 · Champion-challenger",
      title: "Raja yang ditantang",
      prose: [
        "Pilar keempat validasi — benchmark — disebut sekilas di langkah 2: \"lebih baik dari alternatif sederhana?\" Ini layak pendalaman karena ia adalah pertahanan terakhir terhadap kompleksitas yang tidak membayar. Praktiknya bernama champion-challenger: model produksi saat ini (champion) secara berkala ditantang oleh model alternatif (challenger) — bisa model yang lebih sederhana, bisa yang lebih canggih. Contoh: Bank Nusantara memakai regresi logistik (champion) untuk scorecard KTA — Gini out-of-time 0,60, HL lolos, 12 variabel, bisa dijelaskan ke OJK dalam 10 menit. Tim data science membangun challenger gradient boosting — Gini out-of-time 0,615, 200+ variabel hasil feature engineering otomatis. Selisih: 1,5 poin Gini. Keputusan: CHAMPION BERTAHAN. Mengapa menolak model yang \"lebih bagus\"? Karena 1,5 poin Gini harus membayar: (a) explainability — boosting tidak bisa menjelaskan \"kenapa aplikan ini ditolak\" sebaik koefisien logistik (risiko regulasi & fairness); (b) stabilitas — 200 variabel = 200 titik kegagalan saat distribusi bergeser; (c) biaya — pipeline feature engineering yang kompleks, monitoring lebih berat, validasi lebih lama. Aturannya: challenger menang hanya jika selisihnya MATERIAL (praktik umum: >3 poin Gini out-of-time, konsisten 2 periode) DAN lolos semua pilar lain (kalibrasi, stabilitas). Di bawah itu, kompleksitas adalah pajak tanpa manfaat.",
        "Sisi sebaliknya juga penting: benchmark melindungi dari stagnasi. Champion yang tidak pernah ditantang akan menua tanpa disadari — \"kan Gini-nya masih 0,60\" (padahal populasi sudah bergeser dan challenger sederhana pun bisa 0,63). Jadwal yang sehat: challenger dibangun/diperbarui tiap validasi tahunan — tidak harus diimplementasikan, tetapi harus DILAPORKAN. Laporan \"challenger X: Gini 0,615 (+1,5 poin), belum material, champion bertahan\" adalah bukti bahwa bank tidak tidur. Cara salah yang umum: benchmark hanya melawan \"model naif\" (skor acak atau rata-rata) — tentu saja menang, itu bukan tantangan. Benchmark yang jujur melawan alternatif yang REALISTIS: model internal lama, skor biro kredit eksternal, atau versi sederhana dari model sendiri. Dan satu jebakan terakhir: \"challenger shopping\" — mencoba 20 challenger sampai satu menang secara kebetulan (multiple testing!), lalu mengklaim kemenangan. Aturan: challenger didefinisikan SEBELUM evaluasi (maksimal 2–3 kandidat), kriteria kemenangan ditulis sebelum angka keluar. Benchmark tanpa disiplin pra-registrasi = ajang kecantikan, bukan validasi.",
        "Aritmetika keputusannya bisa dibuat eksplisit agar tidak menjadi debat selera. Nilai 1,5 poin Gini: pada portofolio Rp 4 triliun dengan LGD 70%, kenaikan Gini 0,015 ≈ penurunan expected loss ~0,3% × 4 triliun × 70% ≈ Rp 8,4 miliar per tahun (angka ilustratif — hitung dengan kurva CAP portofoliomu sendiri). Biaya kompleksitas: tim validasi +2 bulan kerja per siklus, monitoring 200 variabel, risiko temuan OJK atas explainability, dan — yang tak terhitung — setiap analis baru butuh 3 bulan untuk memahami pipeline sebelum berani mengubahnya (versus 2 minggu untuk logistik). Jika manfaat < biaya + risiko, champion bertahan — dan itu keputusan RASIONAL, bukan konservatisme. Tetapi ada satu kondisi di mana challenger menang walau selisihnya kecil: ketika championnya sendiri sudah kedaluwarsa (Gini OOT turun ke 0,50, PSI 0,30). Maka pertanyaannya bukan \"apakah challenger cukup lebih baik?\" melainkan \"apakah kita tetap memakai model yang sudah mati?\" — dan jawabannya selalu tidak. Benchmark melindungi dari dua kegagalan sekaligus: kompleksitas yang tidak membayar, dan stagnasi yang tidak disadari. Itulah mengapa pilar ini disebut terakhir tetapi tidak boleh dikerjakan terakhir.",
      ],
      tasks: [],
      reference: "Challenger menang jika >3 poin Gini OOT, konsisten 2 periode, lolos semua pilar.",
    },
    {
      id: "csi",
      eyebrow: "Langkah 11 · CSI",
      title: "Detektif populasi",
      prose: [
        "Lab PSI di langkah 3 memberi tahu BAHWA populasi bergeser (PSI 0,1573 → waspada). Tetapi ia tidak memberi tahu APA yang bergeser — seperti alarm kebakaran yang bunyi tanpa menunjukkan ruangan mana yang terbakar. Di sinilah CSI (Characteristic Stability Index) bekerja: rumus yang sama persis dengan PSI, tetapi dihitung PER VARIABEL, bukan per skor akhir. Lanjutan contoh Bank Nusantara dari langkah 8: PSI skor = 0,28 (geser signifikan). Hitung CSI tiap variabel kunci: penghasilan 0,35; umur 0,04; tenor 0,08; riwayat DPD 0,02; wilayah 0,11. Tersangkanya jelas: penghasilan (0,35 > 0,25). Bongkar distribusinya: segmen penghasilan <3 juta naik dari 15% (saat training) menjadi 28% (kini); segmen >10 juta turun dari 30% menjadi 19%. Akarnya terkonfirmasi: ekspansi ke gig worker 2023–2024 membanjiri portofolio dengan segmen berpenghasilan rendah-fluktuatif — persis populasi yang tidak dikenal model lama. Tanpa CSI, tim akan menghabiskan berminggu-minggu menebak; dengan CSI, diagnosis selesai dalam satu sore.",
        "Cara salah yang umum: \"PSI tinggi → rebuild total modelnya\" — 3 bulan kerja, biaya besar, risiko model baru. Cara benar: CSI dulu, lalu pilih respons yang proporsional. Pohon keputusannya: (1) jika CSI tinggi pada 1–2 variabel DENGAN penjelasan bisnis yang sah (ekspansi segmen baru — strategi yang disengaja) → rekalibrasi parsial: latih ulang dengan data baru yang mencakup segmen tersebut, atau bangun scorecard segmen terpisah (2 minggu–1 bulan); (2) jika CSI tinggi TANPA penjelasan bisnis (distribusi berubah padahal strategi tidak berubah) → curigai bug data: perubahan definisi di pipeline, sumber baru, atau kebocoran proses — perbaiki hulu dulu sebelum menyentuh model; (3) jika CSI tinggi pada BANYAK variabel sekaligus (>50% variabel kunci) → populasi benar-benar berganti dunia → rebuild penuh memang diperlukan. Dalam contoh Bank Nusantara: kasus (1) — ekspansi disengaja → solusinya scorecard terpisah untuk segmen gig worker (variabelnya beda: penghasilan fluktuatif butuh fitur volatilitas, bukan level), bukan memaksa satu model untuk dua dunia.",
        "Aturan operasionalnya. Pertama, CSI dihitung untuk SEMUA variabel model (bukan hanya yang \"penting\") tiap kuartal — variabel yang tidak penting hari ini bisa menjadi penting setelah bergeser, dan variabel dengan CSI 0,15–0,25 (zona kuning) dipantau trennya: naik tiga kuartal berturut-turut = investigasi dini sebelum menyentuh 0,25. Kedua, bedakan CSI \"baik\" dari CSI \"buruk\": pergeseran karena strategi bisnis yang disengaja (ekspansi segmen) adalah CSI baik — direspons dengan adaptasi model; pergeseran karena bug data atau perubahan definisi diam-diam adalah CSI buruk — direspons dengan perbaikan pipeline DAN teguran ke pemilik data. Ketiga, dokumentasikan setiap temuan CSI material dalam \"buku harian populasi\" model — satu halaman per kuartal: variabel apa yang bergeser, berapa CSI-nya, apa akarnya, apa tindakannya. Tiga tahun kemudian, buku harian ini adalah harta karun: ia menunjukkan pola musiman, dampak setiap perubahan kebijakan, dan menjadi bukti ke OJK bahwa bank benar-benar memantau — bukan sekadar mengklaim. PSI adalah termometer (memberi tahu demam); CSI adalah diagnosis (memberi tahu infeksinya di mana); buku harian adalah rekam medis (memberi tahu polanya). Validator yang baik meminta ketiganya.",
      ],
      tasks: [],
      reference: "PSI = termometer; CSI = diagnosis per variabel; buku harian = rekam medis populasi.",
    },
        {
          id: "gap-r8-psi-ketidakpastian",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G10)",
          title: "PSI 0,13 dari data yang TIDAK bergeser: noise sampel dan binning",
          prose: [
            "Lab PSI lesson ini menghitung PSI = 0,1573 → WASPADA dari distribusi band skor training [5, 15, 35, 30, 15] vs kini [12, 25, 30, 22, 11]. Tetapi PSI adalah STATISTIK SAMPEL — ia punya noise — dan ambang 0,10/0,25 tidak bertanya berapa besar sampelmu. Lab ini membuktikannya: ambil DUA sampel dari distribusi yang SAMA PERSIS (10 band), hitung PSI antar-keduanya. Dengan n = 200 per sampel, PSI-nya 0,13 — melewati ambang WASPADA — padahal populasinya TIDAK bergeser sama sekali. Dengan n = 20.000, PSI yang sama = 0,0007. Alarm palsu yang sama, hanya karena sampelnya kecil.",
            "Tiga sumber ketidakpastian PSI/CSI yang wajib dicek sebelum memvonis 'geser': (1) UKURAN SAMPEL — band dengan pangsa kecil (2–5%) hanya berisi segelintir observasi pada n kecil; satu-dua observasi pindah band sudah menggerakkan PSI puluhan poin. Aturan: laporkan n per band di samping PSI; band dengan n < 30 jangan dibaca sendirian. (2) BINNING — jumlah dan batas band mengubah PSI dari data yang sama: distribusi yang sama dihitung 10 band memberi PSI 0,1672, dihitung 5 band memberi 0,1573. Ambang yang sama, binning berbeda, vonis bisa berbeda — tetapkan binning di awal dan JANGAN ubah-ubah untuk mencari hasil. (3) MISSING & MUSIM — missing yang terkonsentrasi di satu band (mis. penghasilan hilang untuk segmen mikro) menggeser distribusi TERAMATI tanpa menggeser populasi; begitu pula musim (belanja Lebaran vs bulan biasa). PSI yang dihitung tanpa memeriksa missingness dan musim adalah alarm yang tidak tahu apa yang dibunyikannya.",
            "Praktik yang jujur: PSI/CSI selalu dilaporkan bertiga — nilai, n, dan binning — plus pemeriksaan missing per band dan perbandingan periode yang sama tahun lalu (year-on-year, bukan bulan-ke-bulan yang musiman). Bila PSI 0,13 datang dari n = 200, responsnya bukan 'rekalibrasi' melainkan 'kumpulkan data dulu'.",
          ],
          formula: String.raw`\text{PSI} = \sum (\text{kini} - \text{train}) \times \ln\frac{\text{kini}}{\text{train}} \qquad \text{PSI butuh } n \text{ dan binning di sampingnya}`,
          formulaNote: "Dua sampel dari distribusi sama: n = 200 → PSI 0,13 (WASPADA palsu); n = 20.000 → PSI 0,0007. Binning sama: 10 band 0,1672 vs 5 band 0,1573.",
          tasks: [
            { id: "t1", text: "Hitung `psi_kecil` (n=200) dan `psi_besar` (n=20.000) antar dua sampel dari distribusi yang SAMA" },
            { id: "t2", text: "Hitung `psi_10bin` dan `psi_5bin` dari pergeseran yang sama (4 desimal)" },
          ],
          expected: "psi_kecil=0.13 psi_besar=0.0007 psi_10bin=0.1672 psi_5bin=0.1573",
          hints: [
            "Gunakan random.Random(11) untuk sampel n=200 dan Random(1011) untuk pasangannya; n=20.000 pakai seed yang sama.",
            "PSI = Σ (kini−train) × ln(kini/train); band 0% dilewati.",
            "Gabungkan tiap 2 band bersebelahan untuk versi 5-band.",
          ],
          code: {
            starter: `import math, random\n\ndist10 = [0.02, 0.03, 0.07, 0.08, 0.15, 0.20, 0.15, 0.15, 0.10, 0.05]\nkini10 = [0.05, 0.07, 0.11, 0.14, 0.13, 0.17, 0.13, 0.09, 0.07, 0.04]\n\ndef ambil(n, seed):\n    r = random.Random(seed); hit = [0] * len(dist10)\n    for _ in range(n):\n        x = r.random(); c = 0.0\n        for i, p in enumerate(dist10):\n            c += p\n            if x < c:\n                hit[i] += 1; break\n    return [h / n for h in hit]\n\ndef psi(a, b):\n    return sum((k - t) * math.log(k / t) for t, k in zip(a, b) if t > 0 and k > 0)\n\n# TULIS KODEMU\npsi_kecil =\npsi_besar =\npsi_10bin =\npsi_5bin =\n\nprint(f"psi_kecil={psi_kecil} psi_besar={psi_besar} psi_10bin={psi_10bin} psi_5bin={psi_5bin}")`,
            lockLines: 19,
            solution: `import math, random\n\ndist10 = [0.02, 0.03, 0.07, 0.08, 0.15, 0.20, 0.15, 0.15, 0.10, 0.05]\nkini10 = [0.05, 0.07, 0.11, 0.14, 0.13, 0.17, 0.13, 0.09, 0.07, 0.04]\n\ndef ambil(n, seed):\n    r = random.Random(seed); hit = [0] * len(dist10)\n    for _ in range(n):\n        x = r.random(); c = 0.0\n        for i, p in enumerate(dist10):\n            c += p\n            if x < c:\n                hit[i] += 1; break\n    return [h / n for h in hit]\n\ndef psi(a, b):\n    return sum((k - t) * math.log(k / t) for t, k in zip(a, b) if t > 0 and k > 0)\n\n# TULIS KODEMU\npsi_kecil = round(psi(ambil(200, 11), ambil(200, 1011)), 4)\npsi_besar = round(psi(ambil(20000, 11), ambil(20000, 1011)), 4)\npsi_10bin = round(psi(dist10, kini10), 4)\nt5 = [sum(dist10[i:i + 2]) for i in range(0, 10, 2)]\nk5 = [sum(kini10[i:i + 2]) for i in range(0, 10, 2)]\npsi_5bin = round(psi(t5, k5), 4)\n\nprint(f"psi_kecil={psi_kecil} psi_besar={psi_besar} psi_10bin={psi_10bin} psi_5bin={psi_5bin}")`,
            checks: [
              { kind: "equal", task: "t1", name: "psi_kecil", value: 0.13, tol: 0.005, label: "`psi_kecil` = 0,13", msg: "Dua sampel dari distribusi SAMA dengan n=200 memberi PSI 0,13 — melewati ambang WASPADA padahal tidak ada pergeseran." },
              { kind: "equal", task: "t1", name: "psi_besar", value: 0.0007, tol: 0.001, label: "`psi_besar` = 0,0007", msg: "Dengan n=20.000, noise yang sama menyusut ke 0,0007 — PSI butuh n besar." },
              { kind: "equal", task: "t2", name: "psi_10bin", value: 0.1672, tol: 0.005, label: "`psi_10bin` = 0,1672", msg: "Pergeseran yang sama dihitung 10 band." },
              { kind: "equal", task: "t2", name: "psi_5bin", value: 0.1573, tol: 0.005, label: "`psi_5bin` = 0,1573", msg: "Pergeseran yang sama dihitung 5 band — beda binning, beda PSI." },
              { kind: "stdout_matches", task: "t2", pattern: "psi_kecil=0\\.13\\s+psi_besar=0\\.0007\\s+psi_10bin=0\\.1672\\s+psi_5bin=0\\.1573", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "PSI = 0,13 (WASPADA) dihitung dari n = 200 per sampel. Respons pertama yang benar?",
              options: [
                { text: "Periksa n per band dan kumpulkan data dulu — PSI 0,13 bisa murni noise sampel kecil", why: "Tepat: dua sampel dari distribusi yang sama dengan n=200 memberi PSI 0,13. Vonis 'geser' dari n kecil adalah alarm palsu.", correct: true },
                { text: "Langsung rekalibrasi model", why: "Salah: rekalibrasi atas noise sampel kecil merusak model yang sebenarnya stabil." },
                { text: "Ganti binning sampai PSI turun di bawah 0,10", why: "Salah: mengubah binning untuk mencari hasil yang diinginkan adalah manipulasi metrik." },
                { text: "Abaikan — PSI di bawah 0,25 tidak pernah penting", why: "Salah: PSI 0,13 dari n BESAR adalah sinyal nyata; yang menentukan adalah n-nya, bukan hanya angkanya." },
              ],
            },
          ],
          reference: "PSI/CSI = nilai + n + binning + cek missing/musim. n kecil → noise bisa melewati ambang WASPADA dari distribusi yang sama.",
        },
        {
          id: "gap-r8-validasi-leakage-fairness",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G11)",
          title: "Validasi pilar kelima: leakage, representasi, dan fairness",
          prose: [
            "Empat pilar lesson ini — diskriminasi, kalibrasi, stabilitas, benchmark — kuat, tetapi ada tiga pemeriksaan modern yang tidak masuk keempatnya dan masing-masing bisa membatalkan vonis 'lolos'. Satu, LEAKAGE: fitur yang 'bocor' memakai informasi dari MASA DEPAN relatif terhadap keputusan. Contoh klasik di kredit: fitur 'DPD setelah approval' atau 'rata-rata default cabang yang dihitung dari seluruh data termasuk test' — model terlihat hebat di training (Gini 0,72) lalu ambruk di out-of-time (0,48) karena di produksi informasi itu BELUM ADA saat keputusan dibuat. Uji: untuk tiap fitur, tanyakan 'apakah nilai ini tersedia SAAT prediksi dibuat?' — bila tidak, buang, betapa pun prediktifnya.",
            "Dua, REPRESENTATIVENESS: apakah populasi validasi mewakili populasi yang akan dilayani? Cerita lesson ini memberi contohnya: segmen penghasilan < Rp3 juta naik dari 15% (training) menjadi 28% (kini) — selisih 13 poin. Model yang divalidasi di populasi lama tidak otomatis valid di populasi baru; PSI/CSI memberi tahu ADA pergeseran, tetapi representativeness bertanya APAKAH SAMPEL VALIDASINYA mencakup segmen baru itu dalam jumlah cukup untuk diuji. Tiga, FAIRNESS: dampak yang berbeda antar-grup. Hitung disparate impact ratio: tingkat approval gig worker 32% vs karyawan tetap 48% → DI = 0,32/0,48 = 0,67 — di bawah ambang four-fifths 0,80 → FLAG: disparitas yang wajib diselidiki (bukan vonis diskriminasi — tetapi juga bukan untuk diabaikan).",
            "Aturan: tambahkan tiga cek ini sebagai 'pilar kelima' sebelum menandatangani validasi — (a) audit leakage per fitur (ketersediaan saat keputusan), (b) tabel representasi training vs populasi kini per segmen kunci, (c) metrik per grup (approval/TPR/FPR) dengan ambang DI 0,80. Model yang lolos empat pilar tetapi gagal di ketiganya adalah model yang lolos ujian yang salah.",
          ],
          formula: String.raw`\text{DI} = \frac{\text{tingkat approval grup yang dilindungi}}{\text{tingkat approval grup referensi}} \qquad \text{DI} < 0{,}80 \Rightarrow \text{flag disparitas}`,
          formulaNote: "Gig worker 32% vs karyawan tetap 48% → DI = 0,67 < 0,80 → flag. Segmen <Rp3 jt: 15% (training) → 28% (kini), selisih 13 poin.",
          tasks: [
            { id: "t1", text: "Hitung `di` = approval gig worker / approval karyawan tetap (2 desimal) dan `flag` (True bila DI < 0,80)" },
            { id: "t2", text: "Hitung `rep_gap` = pangsa segmen <Rp3 jt kini − training (poin persen)" },
          ],
          expected: "di=0.67 flag=True rep_gap=13.0",
          hints: [
            "DI = 0,32 / 0,48.",
            "rep_gap = 28 − 15.",
          ],
          code: {
            starter: `app_gig = 0.32; app_tetap = 0.48  # tingkat approval\npangsa_training = 15.0; pangsa_kini = 28.0  # segmen <Rp3 jt, %\n\n# TULIS KODEMU: disparate impact ratio + flag + kesenjangan representasi\ndi =\nflag =\nrep_gap =\n\nprint(f"di={di} flag={flag} rep_gap={rep_gap}")`,
            lockLines: 4,
            solution: `app_gig = 0.32; app_tetap = 0.48  # tingkat approval\npangsa_training = 15.0; pangsa_kini = 28.0  # segmen <Rp3 jt, %\n\n# TULIS KODEMU: disparate impact ratio + flag + kesenjangan representasi\ndi = round(app_gig / app_tetap, 2)\nflag = di < 0.80\nrep_gap = pangsa_kini - pangsa_training\n\nprint(f"di={di} flag={flag} rep_gap={rep_gap}")`,
            checks: [
              { kind: "equal", task: "t1", name: "di", value: 0.67, tol: 0.01, label: "`di` = 0,67", msg: "0,32/0,48 ≈ 0,67 — di bawah ambang four-fifths 0,80." },
              { kind: "equal", task: "t2", name: "rep_gap", value: 13.0, tol: 0.5, label: "`rep_gap` = 13 poin", msg: "28% − 15% = 13 poin — segmen baru membanjiri portofolio." },
              { kind: "stdout_matches", task: "t1", pattern: "di=0\\.67\\s+flag=True\\s+rep_gap=13\\.0", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Model lolos 4 pilar (Gini OOT bagus, HL lolos, PSI rendah, benchmark menang) tetapi satu fiturnya 'DPD setelah approval'. Vonis?",
              options: [
                { text: "Tolak bersyarat — leakage membatalkan validasi; fitur itu belum ada saat keputusan dibuat", why: "Tepat: leakage membuat skor training fiktif. Empat pilar tidak menguji ketersediaan fitur saat keputusan.", correct: true },
                { text: "Lolos — 4 pilar sudah mencakup semuanya", why: "Salah: tidak satu pun dari empat pilar menanyakan 'apakah fitur ini tersedia saat prediksi dibuat?'" },
                { text: "Lolos bila Gini OOT tetap bagus", why: "Salah: Gini OOT yang dihitung dengan fitur bocor ikut bocor — ia mengukur kebocoran, bukan kemampuan." },
                { text: "Perbaiki dengan menambah data training", why: "Salah: menambah data tidak menghilangkan kebocoran — fitur masa depan tetap masa depan." },
              ],
            },
          ],
          reference: "Pilar kelima validasi: (a) audit leakage — fitur tersedia saat keputusan? (b) representasi training vs kini (c) metrik per grup, DI < 0,80 = flag.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Empat pilar: diskriminasi, kalibrasi, stabilitas, benchmark — aturan terlemah.",
        "Gini wajib out-of-time; selisih training vs OOT >10 poin = overfitting.",
        "HL menguji kalibrasi per desil; sensitif ukuran sampel — baca plot dalam satuan bisnis.",
        "PSI: <0,10 OK; 0,10–0,25 waspada; >0,25 bergeser signifikan.",
        "Validator independen (SR 11-7) — wasit tidak boleh dari tim yang bertanding.",
      ],
      next: { label: "CR20 — Monitoring & KRI", href: "/v2/learn/cr20-monitoring-kri" },
      quiz: [
        {
          q: "Vendor melaporkan Gini 0,68 dari data training. Reaksimu?",
          options: [
            { text: "Bagus — beli!", why: "Tanpa validasi independen, itu angka marketing." },
            { text: "Minta Gini out-of-time — Gini training optimis palsu (overfitting); selisih >10 poin = model menghafal", why: "Model yang 'sempurna' di training tetapi ambruk di data baru = menghafal, bukan belajar.", correct: true },
            { text: "Gini tidak penting", why: "Gini penting — tetapi yang out-of-time." },
            { text: "Minta didiskon", why: "Bukan soal harga — soal bukti." },
          ],
        },
        {
          q: "Uji Hosmer-Lemeshow menguji apa?",
          options: [
            { text: "Daya beda model (ranking)", why: "Itu diskriminasi (Gini/KS)." },
            { text: "Kecocokan kalibrasi: apakah PD prediksi cocok dengan aktual per desil risiko — 'timbangan' model", why: "Diskriminasi (Gini) = bisa membedakan; kalibrasi (HL) = angkanya benar.", correct: true },
            { text: "Stabilitas populasi", why: "Itu PSI/CSI." },
            { text: "Kecepatan komputasi", why: "Bukan." },
          ],
        },
        {
          q: "PSI = 0,31. Artinya dan aksinya?",
          options: [
            { text: "Stabil — lanjutkan", why: "0,31 jauh di atas 0,25." },
            { text: "Populasi bergeser signifikan (>0,25) — investigasi via CSI, siapkan rekalibrasi/rebuild; model dilatih untuk 'dunia lama'", why: "Cari tahu apa yang bergeser sebelum percaya.", correct: true },
            { text: "PSI tidak penting", why: "PSI = pilar stabilitas." },
            { text: "Naikkan cut-off saja", why: "Itu menutupi gejala." },
          ],
        },
        {
          q: "Mengapa validator harus independen dari pembuat model?",
          options: [
            { text: "Supaya ada kerjaan", why: "Bukan." },
            { text: "SR 11-7: konflik kepentingan — pembuat model buta terhadap kelemahannya sendiri; wasit tidak boleh dari tim yang bertanding", why: "Independensi = syarat mutlak model risk management.", correct: true },
            { text: "Agar lebih mahal", why: "Bukan soal biaya." },
            { text: "Tidak perlu — buang waktu", why: "Validasi sendiri = penjual menilai dagangannya." },
          ],
        },
        {
          q: "HL jebol (p<0,05) pada n=2 juta, tetapi deviasi maks plot kalibrasi hanya 0,3 poin PD. Interpretasi?",
          options: [
            { text: "Model gagal total — buang", why: "Terlalu keras — deviasi tidak material." },
            { text: "Dengan sampel raksasa, deviasi kecil pun signifikan statistik; yang penting materialitas bisnis — 0,3 poin tidak material → kalibrasi OK dengan catatan", why: "Validator senior membaca plot dalam satuan bisnis, bukan sekadar p-value.", correct: true },
            { text: "HL tidak pernah penting", why: "HL penting — dengan konteks." },
            { text: "Naikkan PD 10% untuk aman", why: "Penyesuaian tanpa dasar = manipulasi." },
          ],
        },
      ],
    },
  ],
};
