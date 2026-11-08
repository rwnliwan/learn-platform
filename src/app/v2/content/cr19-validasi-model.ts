import type { V2Lesson } from "../lib/types";

export const cr19: V2Lesson = {
  slug: "cr19-validasi-model",
  track: "Credit Risk",
  module: "Validasi & Monitoring",
  title: "CR19 — Validasi Model",
  estMinutes: 45,
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
        body: "Validasi bukan \"cap stempel\" — melainkan ujian kejujuran berlapis. Validasi dilakukan oleh pihak independen (bukan tim pembuat model) — standar global SR 11-7 (model risk management). Di Indonesia: OJK mengawasi via ICAAP & audit. Wasit tidak boleh dari tim yang bertanding.",
      },
      reference: "Validasi sendiri = penjual menilai dagangannya sendiri.",
    },
    {
      id: "pilar",
      eyebrow: "Langkah 2 · Empat Pilar",
      title: "Ujian kejujuran berlapis",
      prose: [
        "Validasi model = pengujian independen untuk memastikan model layak pakai. Empat pilar: diskriminasi — bisa membedakan bagus vs jelek? (Gini, KS, AUC); kalibrasi — angkanya benar? (Hosmer-Lemeshow, plot kalibrasi); stabilitas — masih relevan untuk populasi kini? (PSI, CSI); benchmark — lebih baik dari alternatif sederhana? (vs model naif/champion).",
        "Prinsip emas: validasi dilakukan oleh pihak independen (bukan tim pembuat model) — standar global SR 11-7. Di Indonesia: OJK mengawasi via ICAAP & audit.",
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
        solution: `import math\ntraining = [5, 15, 35, 30, 15]\nkini     = [12, 25, 30, 15, 11] if False else [12, 25, 30, 22, 11]\n\n# TULIS KODEMU\npsi = sum((k/100 - t/100) * math.log((k/100)/(t/100)) for t, k in zip(training, kini))\nstatus = "OK - stabil" if psi < 0.10 else ("WASPADA - investigasi" if psi <= 0.25 else "GESER - rekalibrasi")\n\nprint(f"PSI={psi:.4f} status={status}")`,
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
        "Cerita pembuka lesson ini tentang validasi SAAT PEMBELIAN — vendor, Gini 0,72, ambruk setahun kemudian. Tetapi ada kegagalan yang lebih umum dan lebih sunyi: model yang lolos validasi awal dengan jujur, lalu dibiarkan berjalan tanpa pernah divalidasi lagi. Ibarat SIM: lolos ujian sekali, berlaku seumur hidup — padahal pengemudi menua, jalan berubah, mobil berganti. Contoh: Bank Nusantara memakai scorecard kartu kredit yang divalidasi 2022 dengan hasil bersih — Gini out-of-time 0,58, HL lolos, PSI 0,06. Tiga tahun berlalu tanpa validasi ulang (\"kan sudah lolos\"). 2025: tim iseng mengecek — Gini out-of-time 0,44 (turun 14 poin!), PSI 0,28 (populasi bergeser signifikan), kalibrasi meleset: PD prediksi 3%, aktual 5,1%. Apa yang terjadi? 2023–2024 bank agresif ekspansi ke segmen gig worker via aplikasi — populasi baru dengan pola risiko berbeda (penghasilan fluktuatif, riwayat tipis) membanjiri portofolio; model yang dilatih untuk karyawan tetap menjadi turis di negerinya sendiri. Kerugiannya tidak spektakuler seperti kasus vendor — ia menetes: pricing meleset 2 poin PD selama 2 tahun × Rp 4 triliun portofolio × LGD 70% ≈ Rp 112 miliar expected loss yang tidak ter-capture pricing. Kematian model yang lambat tidak membuat berita — hanya membuat laba bocor.",
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
