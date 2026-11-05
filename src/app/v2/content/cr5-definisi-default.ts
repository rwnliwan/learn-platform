import type { V2Lesson } from "../lib/types";

export const cr5: V2Lesson = {
  slug: "cr5-definisi-default",
  track: "Credit Risk",
  module: "Kinerja & Analisis Portofolio",
  title: "CR5 — Definisi Default: Fondasi Model PD",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Telat 95 hari tapi punya uang",
      prose: [
        "Pak Darmawan, pengusaha furniture Jepara, telat bayar cicilan 95 hari. Menurut buku: default (DPD >90). Tim remedial bersiap melelang agunannya. Tapi analis Rina menemukan fakta aneh: rekening Pak Darmawan penuh — Rp 800 juta menganggur. Ia tidak bangkrut. Ia hanya kekeuh tidak mau bayar karena bersengketa dengan bank soal biaya provisi. Uangnya ada, kemauannya tidak.",
        "Di sisi lain, Bu Ratna — pemilik katering — baru telat 12 hari, tapi dapur cateringnya kebakaran habis dan tidak berasuransi. Uang tidak ada, usaha tidak ada.",
        "Menurut definisi default Basel, keduanya default — Pak Darmawan lewat pintu \"DPD >90\", Bu Ratna lewat pintu \"unlikely to pay\". Definisi default ternyata punya dua pintu, dan pintu kedua tidak peduli berapa hari telatnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Definisi default adalah \"target\" yang dipelajari semua model PD (CR7, CR10). Ganti definisinya → ganti targetnya → ganti seluruh modelnya. Itulah mengapa bank mendokumentasikan definisi default-nya dan tidak boleh diam-diam mengubahnya.",
      },
      reference: "Dua pintu default: DPD >90 (kuantitatif) dan unlikely to pay (kualitatif).",
    },
    {
      id: "definisi",
      eyebrow: "Langkah 2 · Definisi",
      title: "Dua pintu menuju \"gagal\"",
      prose: [
        "Basel (diadopsi OJK) menyatakan debitur default jika SALAH SATU terpenuhi. Pintu 1 — kuantitatif: DPD > 90 hari untuk kewajiban material. (Untuk retail tertentu, regulator membolehkan 180 hari — misal KPR di beberapa yurisdiksi.) Pintu 2 — kualitatif (unlikely to pay): bank menilai debitur tidak mungkin membayar penuh tanpa eksekusi agunan — misal: bangkrut, usaha tutup, restrukturisasi distressed (potong pokok karena kesulitan).",
        "Definisi default seperti definisi \"sakit\" di RS — ada yang diukur angka (demam >38°C), ada yang dinilai dokter (pucat, lemas). Keduanya sah. Bank yang hanya mengandalkan pintu DPD akan terlambat mengenali Bu Ratna yang dapurnya kebakaran.",
        "Data praktik: 62% default terdeteksi via DPD 90+ — pintu kuantitatif memang dominan. Tetapi 38% datang dari pintu kualitatif (unlikely-to-pay, bangkrut, restrukturisasi distressed). Bank yang definisi default-nya \"cuma DPD 90\" akan melewatkan sepertiga kasus — PD-nya underestimate, modalnya kurang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Default = tamat. Debitur tidak bisa kembali.\" Default adalah status regulasi, bukan vonis mati. Debitur bisa sembuh (curing) — bayar lunas tunggakannya dan kembali performing dengan masa percobaan. Model yang baik memperhitungkan peluang curing (mempengaruhi LGD — CR12).",
      },
      reference: "Ambang materialitas: tunggakan Rp 80 ribu yang disengketakan bukan default — default mengukur ketidakmampuan/ketidakmauan bayar yang material.",
    },
    {
      id: "lab-default",
      eyebrow: "Langkah 3 · Lab Default",
      title: "Mesin definisi default Basel",
      prose: [
        "Ubah kondisinya, lihat apakah \"default\" menurut Basel. Debitur A: DPD 95 hari, tidak ada kondisi kualitatif. Debitur B: DPD 10 hari tetapi usahanya bangkrut (unlikely to pay). Tugasmu: tentukan status default keduanya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `is_default_a` untuk debitur A (dpd_a, unlikely_a)" },
        { id: "t2", text: "Hitung `is_default_b` untuk debitur B (dpd_b, unlikely_b)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "A=True B=True",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menunggu 90 hari dulu untuk kasus Bu Ratna (pabrik kebakaran, DPD 12 hari). Pintu kualitatif tidak menunggu DPD 90 — bank yang disiplin langsung mencadangkan via unlikely-to-pay.",
      },
      hints: [
        "Default jika DPD > 90 ATAU ada kondisi kualitatif.",
        "Gunakan or untuk menggabungkan kondisi.",
        "is_default_a = (dpd_a > 90) or unlikely_a",
      ],
      code: {
        starter: `dpd_a, unlikely_a = 95, False   # debitur A: telat 95 hari\ndpd_b, unlikely_b = 10, True    # debitur B: telat 10 hari, usaha bangkrut\n\n# TULIS KODEMU\nis_default_a = \nis_default_b = \n\nprint(f"A={is_default_a} B={is_default_b}")`,
        lockLines: 2,
        solution: `dpd_a, unlikely_a = 95, False   # debitur A: telat 95 hari\ndpd_b, unlikely_b = 10, True    # debitur B: telat 10 hari, usaha bangkrut\n\n# TULIS KODEMU\nis_default_a = (dpd_a > 90) or unlikely_a\nis_default_b = (dpd_b > 90) or unlikely_b\n\nprint(f"A={is_default_a} B={is_default_b}")`,
        checks: [
          { kind: "equal", task: "t1", name: "is_default_a", value: true, label: "`is_default_a` seharusnya True", msg: "DPD 95 > 90 → default via pintu kuantitatif." },
          { kind: "equal", task: "t2", name: "is_default_b", value: true, label: "`is_default_b` seharusnya True", msg: "DPD 10 tidak cukup, tetapi unlikely_to_pay True → default via pintu kualitatif." },
          { kind: "stdout_matches", task: "t3", pattern: "A=True\\s+B=True", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: dpd=120 tetapi debitur bayar penuh besok → tetap default. Status regulasi, bukan vonis akhir.",
    },
    {
      id: "window",
      eyebrow: "Langkah 4 · Window",
      title: "Observation vs performance window",
      prose: [
        "Untuk membangun model PD, kita butuh dua jendela waktu. Observation window — periode di mana kita mengamati karakteristik debitur (umur, penghasilan, skor, mutasi): \"foto\" kondisi debitur. Performance window — periode setelahnya di mana kita melihat apakah ia default (biasanya 12 bulan): \"film\" kelanjutannya.",
        "Aturan emas: karakteristik diambil dari sebelum performance window — tidak boleh mengintip masa depan (look-ahead bias). Contoh: bank membangun model PD Januari 2026. Observation: karakteristik per Januari 2024 (skor, DPD saat itu, umur kredit). Performance: apakah default selama Jan 2024 – Jan 2025 (12 bulan). Label: 1 = default dalam window, 0 = tidak. Latih model: karakteristik (Jan 2024) → label (setahun kemudian).",
        "Model yang \"mengintip\" data setelah default = curang — performanya di atas kertas bagus, di dunia nyata hancur. Model harus belajar dari pola \"dulu → kemudian\", seperti saat dipakai memprediksi masa depan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Makin panjang performance window, makin bagus modelnya.\" 12 bulan adalah standar Basel karena selaras dengan PD 1-tahun yang dipakai modal. Window 3 tahun mencampuradukkan siklus ekonomi (krisis + boom dalam satu label) — modelnya jadi \"rata-rata yang tidak mewakili apapun\".",
      },
      reference: "Untuk lifetime PD (PSAK 71): rantai PD 1-tahun per tahun (CR10/CR14), bukan window 5 tahun sekaligus.",
    },
    {
      id: "censoring",
      eyebrow: "Langkah 5 · Censoring",
      title: "Right-censoring: data yang belum bercerita",
      prose: [
        "Right-censoring = observasi yang belum lengkap di sisi kanan (waktu): kredit yang lunas lebih awal, atau yang umurnya belum mencapai 12 bulan saat data ditarik. Kredit yang censored belum berkesempatan penuh untuk default 12 bulan. Kalau ikut dihitung di penyebut default rate → default rate kelihatan lebih kecil dari seharusnya → PD underestimate → modal kurang. Ini jebakan klasik analis junior.",
        "Aturannya: penyebut HANYA kredit yang benar-benar diamati penuh 12 bulan. Yang censored dikeluarkan (atau ditangani dengan survival analysis). Contoh: kredit A diamati penuh dan default → dihitung. Kredit B lunas di bulan 10 → censored, dikeluarkan. Kredit C masih berjalan (belum 12 bulan) → censored. Kredit D default di bulan 14 → TIDAK dihitung (di luar window 12 bulan!). Disiplin window ini yang membedakan analis senior dari junior.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Right-censoring seperti menilai film dari 30 menit pertama — yang keluar bioskop di menit 30 (lunas awal) tidak bisa dibilang \"tidak nangis di ending\". Ketidakjujuran soal censoring = PD palsu = modal kurang.",
      },
      reference: "1000 kredit, 200 censored, 24 default → default rate benar = 24/800 = 3,0% (bukan 24/1000 = 2,4%).",
    },
    {
      id: "lab-censoring",
      eyebrow: "Langkah 6 · Lab Censoring",
      title: "Default rate yang benar vs naif",
      prose: [
        "1000 kredit diamati 12 bulan: 24 default dalam window, 200 censored (umur <12 bulan). Tugasmu: hitung default rate yang benar (censored dikeluarkan dari penyebut) dan yang naif (semua ikut penyebut) — lalu lihat selisihnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rate_benar` (%) — penyebut = n − censored" },
        { id: "t2", text: "Hitung `rate_naif` (%) — penyebut = n" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "benar=3.00 naif=2.40",
      hints: [
        "Kurangi dulu yang censored dari penyebut.",
        "Kalikan 100 untuk persen.",
        "rate_benar = default_dalam_window / (n - censored) * 100",
      ],
      code: {
        starter: `n = 1000\ndefault_dalam_window = 24\ncensored = 200   # lunas lebih awal / belum cukup umur\n\n# TULIS KODEMU\nrate_benar = \nrate_naif = \n\nprint(f"benar={rate_benar:.2f} naif={rate_naif:.2f}")`,
        lockLines: 3,
        solution: `n = 1000\ndefault_dalam_window = 24\ncensored = 200   # lunas lebih awal / belum cukup umur\n\n# TULIS KODEMU\nrate_benar = default_dalam_window / (n - censored) * 100\nrate_naif = default_dalam_window / n * 100\n\nprint(f"benar={rate_benar:.2f} naif={rate_naif:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rate_benar", value: 3.0, tol: 1e-9, label: "`rate_benar` seharusnya 3.00", msg: "24 / 800 × 100 = 3.0. Yang censored keluar dari penyebut." },
          { kind: "equal", task: "t2", name: "rate_naif", value: 2.4, tol: 1e-9, label: "`rate_naif` seharusnya 2.40", msg: "24 / 1000 × 100 = 2.4 — underestimate 25%!" },
          { kind: "stdout_matches", task: "t3", pattern: "benar=3\\.00\\s+naif=2\\.40", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Selisih 25% (2,4% vs 3,0%) = selisih modal yang harus disediakan bank.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan nyatakan default",
      prose: [
        "Skenario 1 — Telat 95 hari, kewajiban material. → Default lewat pintu kuantitatif (DPD > 90). Contoh nyata: Pak Darmawan telat 95 hari meski rekeningnya penuh Rp 800 juta — uangnya ada, kemauannya tidak. Pintu DPD tidak peduli alasannya.",
        "Skenario 2 — Baru telat 12 hari tetapi usaha tutup total. → Default lewat pintu kualitatif (unlikely to pay). Contoh nyata: Bu Ratna, dapur kateringnya kebakaran tanpa asuransi — menunggu DPD 90 berarti menunggu mayat.",
        "Skenario 3 — Membangun model PD. → Pakai definisi Basel penuh: DPD > 90 hari DAN unlikely-to-pay. Contoh nyata: 38% default terdeteksi via pintu kualitatif — bank yang definisinya 'cuma DPD 90' buta terhadap lebih dari sepertiga kegagalan.",
        "Skenario 4 — Membandingkan default rate dua bank. → Samakan definisi dulu. Contoh nyata: Bank A (DPD 90 + unlikely-to-pay) 3,2% vs Bank B (DPD 180 saja) 1,1% — 'keunggulan' Bank B 100% kosmetik definisi, kualitas portofolio riilnya identik.",
        "Skenario 5 — Menghitung default rate. → Keluarkan yang censored dari penyebut: hanya kredit yang diamati penuh 12 bulan. Contoh nyata: 1.000 kredit, 24 default, 200 censored — penyebut yang benar 800, bukan 1.000.",
        "Aturan praktis 10 detik: default = DPD > 90 ATAU unlikely-to-pay; yang censored keluar dari penyebut; bandingkan apel dengan apel — bukan apel dengan definisi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai DPD > 180 hari untuk KUR 'karena program pemerintah' — kredit yang default di hari ke-91 sampai 180 'hilang' dari hitungan, direksi mendapat laporan sehat, dan ekspansi agresif dibangun di atas angka yang menipu.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Default rate yang menyesatkan",
      prose: [
        "Tim modeling Bank Nusantara melaporkan: \"Default rate KUR 2025 hanya 1,2% — portofolio sangat sehat!\" Direksi ingin ekspansi agresif. Kamu diminta verifikasi. Temuanmu: perhitungan memakai semua 50.000 rekening KUR yang dicairkan Jan–Des 2025 (data ditarik Jan 2026); 40% di antaranya dicairkan Jul–Des 2025 — umurnya belum 12 bulan (censored!); definisi default yang dipakai: DPD >180 hari (bukan 90) — \"karena KUR itu program pemerintah\"; kasus unlikely-to-pay tidak dicatat sebagai default.",
        "Pembahasan: tiga masalah, semuanya menekan default rate ke bawah. (1) Censoring diabaikan — 40% rekening belum berumur 12 bulan ikut jadi penyebut. Koreksi kasar: penyebut benar ≈ 30.000, bukan 50.000 → default rate naik sekitar 1,67× lipat. (2) Definisi DPD 180 — menyimpang dari Basel 90 tanpa justifikasi kuat. Kredit yang default di hari 91–180 \"hilang\" dari hitungan. (3) Pintu kualitatif diabaikan — sepertiga kasus default tidak tercatat.",
        "Rekomendasi: hitung ulang dengan window 12 bulan penuh + definisi Basel 90 hari + catat unlikely-to-pay; sajikan rentang (1,2% naif vs sekitar 2,5–3% terkoreksi) ke direksi. Ekspansi agresif berdasarkan angka 1,2% = membangun di atas pasir.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank mengubah definisi default internal dari DPD 90 menjadi DPD 180 \"agar NPL turun\" = menyimpang dari Basel tanpa justifikasi: PD underestimate, modal kurang, dan akan ditindak OJK/auditor. Definisi default adalah \"kontrak\" model dan modal — bukan alat kosmetik NPL.",
      },
      reference: "Perubahan definisi harus didokumentasikan, dijustifikasi, dan disetujui.",
    },
    {
      id: "pendalaman-saklar",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Saklar utama sistem risiko",
      prose: [
        "Contoh terapan kedua — perdebatan definisi default KUR di Indonesia, dengan angka. Bank A memakai DPD >90 hari + unlikely-to-pay (Basel penuh): default rate KUR-nya 3,2%. Bank B (pesaing) memakai DPD >180 hari saja: default rate 1,1% — terlihat 3× lebih sehat! Direksi Bank A tergoda \"menyesuaikan\". Bedah angkanya: dari 2,1 poin selisih, ~1,2 poin berasal dari ambang 90→180 hari (kredit yang default di hari 91–180 \"hilang\"), ~0,6 poin dari pintu kualitatif yang diabaikan (usaha tutup tetapi DPD <180), ~0,3 poin dari censoring (rekening muda ikut penyebut). Artinya: \"keunggulan\" Bank B 100% kosmetik definisi — kualitas portofolio riilnya IDENTIK (bahkan sedikit lebih buruk karena intervensi lebih lambat). Pelajarannya: default rate antar bank TIDAK bisa dibandingkan tanpa menyamakan definisi dulu. Analis yang membandingkan NPL Bank A vs Bank B tanpa cek definisi default-nya sedang membandingkan apel dengan lukisan apel.",
        "Kontras cara salah vs benar menetapkan ambang materialitas. Cara salah: tidak ada ambang — semua DPD >90 otomatis default. Akibatnya: 12.000 nasabah kartu kredit \"default\" karena tunggakan Rp 50–200 ribu (sengketa biaya admin, lupa, salah transfer) — tim remedial kebanjiran file sampah, CKPN membengkak untuk risiko yang tidak ada, dan data training model PD terkontaminasi label palsu. Cara benar: ambang ganda — DPD >90 hari DAN tunggakan > max(Rp 1 juta, 1% limit). Contoh: tunggakan Rp 80 ribu dengan limit Rp 20 juta = di bawah ambang → bukan default (masuk antrean collection biasa). Tunggakan Rp 1,5 juta = default. Angka ambang ditetapkan dari distribusi historis: cari titik di mana tunggakan di bawahnya 95% sembuh sendiri dalam 30 hari (noise administratif), di atasnya 60% berlanjut (sinyal risiko). Materialitas bukan angka sakral — ia angka empiris yang dihitung, bukan ditebak.",
        "Mode kegagalan nyata: definition shopping — mengganti definisi untuk mempercantik NPL. Polanya selalu sama: (1) NPL naik → tekanan direksi; (2) \"kajian\" internal menyimpulkan definisi \"terlalu konservatif\"; (3) ambang DPD 90 → 180 \"agar selaras praktik\"; (4) NPL turun 2 poin — direksi puas, bonus cair. Tetapi: model PD yang dilatih dengan definisi baru menjadi BUTA terhadap default hari 91–180 (labelnya \"sehat\"!), CKPN berbasis EL turun semu, dan saat OJK/auditor menemukan penyimpangan — denda + perintah hitung ulang + reputasi rusak. Ini bukan hipotesis: regulator di berbagai negara menindak bank yang definisi defaultnya menyimpang tanpa justifikasi. Pertahanan sistemik: setiap perubahan definisi default wajib (1) didokumentasikan dengan justifikasi kuantitatif, (2) disetujui komite risiko + dilaporkan ke OJK, (3) model PD di-recalibrate penuh (bukan tambal sulam). Definisi default adalah kontrak antara bank, model, dan regulator — kontrak tidak diubah sepihak.",
        "Pendalaman sub-topik yang selama ini hanya disebut sekilas: curing dan probation. Debitur default yang kemudian membayar lunas tunggakannya tidak otomatis kembali \"sehat\" — ia masuk masa percobaan (probation): biasanya 3–12 bulan performing berturut-turut sebelum status default dicabut. Kenapa? Data: 40% debitur yang \"sembuh\" tanpa probation kambuh dalam 6 bulan (bayar lunas dari dana talangan, bukan dari perbaikan fundamental). Contoh: Pak Darmawan akhirnya bayar setelah sengketa selesai — tetapi 4 bulan kemudian telat lagi karena usahanya memang menurun. Dengan probation 6 bulan, statusnya tetap \"default dalam pemulihan\" — CKPN tidak dilepas prematur, model PD tidak belajar bahwa \"default 95 hari = tidak apa-apa\". Aturan: curing tanpa probation = menghapus memori risiko; probation memastikan kesembuhan itu struktural, bukan kosmetik. Model yang baik memperlakukan \"baru sembuh\" sebagai segmen risiko tersendiri (PD 2–3× normal) selama probation.",
        "Aturan keputusan untuk pemilik definisi default (biasanya divisi risiko). Satu: definisi mengikuti Basel (DPD >90 material ATAU unlikely-to-pay) — penyimpangan butuh justifikasi tertulis + persetujuan komite. Dua: ambang materialitas dihitung dari data (titik noise vs sinyal), direview tahunan. Tiga: unlikely-to-pay WAJIB punya kriteria operasional tertulis (bangkrut, usaha tutup, restrukturisasi distressed) — bukan \"feeling RM\". Empat: curing selalu diikuti probation 3–12 bulan; CKPN dilepas bertahap, bukan sekaligus. Lima: setiap perubahan definisi = recalibrate ulang seluruh model PD + lapor regulator. Lima aturan ini menjaga definisi default sebagai fondasi yang kokoh — karena semua model PD, semua CKPN, dan semua modal berdiri di atasnya. Fondasi yang digeser diam-diam = gedung yang retak diam-diam.",
        "Pendalaman kriteria unlikely-to-pay yang operasional — karena \"bank menilai tidak mungkin membayar\" terlalu kabur tanpa daftar pemicu. Standar industri memakai daftar indikator yang masing-masing cukup untuk mencap default: (1) debitur mengajukan PKPU/kepailitan (atau kreditur lain mengajukannya); (2) usaha inti berhenti beroperasi >90 hari (pabrik tutup, toko tidak buka); (3) restrukturisasi distressed — bank memotong pokok/bunga KARENA debitur kesulitan (bukan restrukturisasi komersial biasa); (4) agunan dieksekusi untuk menutup kewajiban; (5) debitur menjual aset inti di bawah harga wajar untuk membayar utang (fire sale). Contoh konkret: Bu Ratna (dapur kebakaran, tidak berasuransi) memenuhi #2 — default hari itu juga, tanpa menunggu DPD 90. Pak Darmawan (punya uang, tidak mau bayar karena sengketa) TIDAK memenuhi satupun — ia default lewat pintu DPD 95 hari. Daftar pemicu ini harus TERTULIS di kebijakan kredit dan dipahami RM lapangan — karena pintu kualitatif yang hanya ada di kepala analis senior = pintu yang tidak ada.",
        "Satu hubungan yang jarang dijelaskan: definisi default adalah \"pintu masuk\" ke seluruh arsitektur risiko. Saat debitur dinyatakan default: (1) rating internal langsung jatuh ke grade default (biasanya grade terendah) — tidak peduli skornya kemarin; (2) CKPN dihitung dengan LGD penuh (stage 3 PSAK 71) — bukan lagi 12-bulan EL; (3) ia masuk workout/collection dengan strategi berbeda; (4) datanya menjadi LABEL untuk melatih ulang model PD. Artinya: keputusan \"default atau tidak\" menggerakkan ratusan miliar CKPN dan melatih model generasi berikutnya. Analis junior menganggap default sebagai \"status administratif\"; analis senior menganggapnya sebagai \"saklar utama\" sistem risiko. Karena itu ambang default tidak boleh ditentukan oleh tim yang dinilai dari NPL-nya (conflict of interest!) — ia ditentukan oleh divisi risiko independen dan dikunci oleh komite. Siapa yang memegang saklar tidak boleh dinilai dari lampu yang menyala.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: default adalah keputusan, bukan kejadian",
        body: "Tidak ada momen magis di hari ke-90 ketika debitur berubah dari \"sehat\" menjadi \"gagal\" — yang berubah adalah KEPUTUSAN bank untuk mengakuinya. Heuristiknya: default = titik di mana bank berhenti berharap dan mulai mencadangkan. Maka kualitas definisi default diukur bukan dari \"ketepatannya\" (tidak ada yang tepat secara alami), melainkan dari KONSISTENSINYA: apakah pintu yang sama dipakai untuk semua debitur, semua periode, semua model? Bank yang definisinya konsisten — walau tidak sempurna — punya model yang bisa dipercaya dan modal yang bisa dipertahankan. Bank yang definisinya lentur mengikuti kebutuhan laporan punya model yang buta dan modal yang fiksi. Prinsip terakhirnya personal: sebagai analis, kamu akan ditekan untuk \"menyesuaikan\" definisi saat angka memburuk. Ingat — definisi yang bisa ditekuk bukan definisi; ia opini yang menyamar. Dan opini tidak bisa menjadi fondasi modal bank. Maka mintalah satu hal yang sederhana: definisi default bankmu tertulis dalam SATU halaman, ditandatangani komite, dan tidak bisa diubah tanpa rapat. Jika tidak ada halaman itu, fondasinya belum ada — apapun yang berdiri di atasnya sedang melayang.",
      },
      reference: "Definisi yang bisa ditekuk bukan definisi — ia opini yang menyamar.",
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
        "Default Basel: DPD >90 hari (material) ATAU unlikely to pay — dua pintu, keduanya sah.",
        "Default = status regulasi, bukan vonis mati — debitur bisa curing kembali performing.",
        "Observation window (karakteristik) harus SEBELUM performance window (12 bulan) — anti look-ahead bias.",
        "Right-censoring: keluarkan yang belum teramati penuh dari penyebut default rate.",
        "Definisi default = target model PD = kontrak modal — jangan diubah diam-diam.",
      ],
      next: { label: "CR6 — Analisis Portofolio", href: "/learn/cr6-analisis-portofolio" },
      quiz: [
        {
          q: "Debitur telat 12 hari tapi pabriknya kebakaran total tanpa asuransi. Status default (Basel)?",
          options: [
            { text: "Belum default — DPD belum 90 hari", why: "Pintu kualitatif tidak menunggu DPD 90." },
            { text: "Default — pintu kualitatif (unlikely to pay), DPD tidak relevan", why: "Pintu kualitatif tidak menunggu DPD 90 — bank yang disiplin langsung mencadangkan.", correct: true },
            { text: "Tunggu 90 hari dulu baru putuskan", why: "Menunggu = terlambat mengenali kerugian yang sudah pasti." },
            { text: "Hanya default jika ia mengaku bangkrut", why: "Unlikely to pay dinilai bank, tidak butuh pengakuan debitur." },
          ],
        },
        {
          q: "Mengapa observation window harus SEBELUM performance window?",
          options: [
            { text: "Supaya datanya lebih banyak", why: "Bukan soal jumlah — soal urutan waktu." },
            { text: "Mencegah look-ahead bias — model harus belajar dari 'dulu → kemudian', seperti saat dipakai memprediksi masa depan", why: "Model yang 'mengintip' data setelah default = curang: bagus di kertas, hancur di dunia nyata.", correct: true },
            { text: "Aturan OJK semata", why: "Ini prinsip metodologi, bukan sekadar aturan." },
            { text: "Supaya komputasi lebih cepat", why: "Tidak ada hubungannya dengan kecepatan." },
          ],
        },
        {
          q: "1000 kredit, 200 censored (umur <12 bln), 24 default dalam window. Default rate yang benar?",
          options: [
            { text: "24/1000 = 2,4%", why: "Itu versi naif — censored ikut penyebut = underestimate." },
            { text: "24/800 = 3,0% — censored dikeluarkan dari penyebut", why: "Yang censored belum berkesempatan penuh 12 bulan. Selisih 25%!", correct: true },
            { text: "24/200 = 12%", why: "Penyebutnya bukan yang censored." },
            { text: "(24+200)/1000 = 22,4%", why: "Censored bukan default — jangan dicampur." },
          ],
        },
        {
          q: "Bank mengubah definisi default internal dari DPD 90 menjadi DPD 180 'agar NPL turun'. Masalahnya?",
          options: [
            { text: "Tidak masalah — definisi internal bebas", why: "Definisi terkait modal dan diawasi regulator." },
            { text: "Menyimpang dari Basel tanpa justifikasi = PD underestimate, modal kurang, dan akan ditindak OJK/auditor; NPL turun semu", why: "Definisi default adalah 'kontrak' model dan modal — bukan alat kosmetik NPL.", correct: true },
            { text: "Malah bagus untuk laba", why: "Laba semu hari ini = bom modal esok hari." },
            { text: "Hanya masalah pelaporan", why: "Ini masalah substansi risiko, bukan sekadar laporan." },
          ],
        },
        {
          q: "Nasabah telat 100 hari untuk tunggakan Rp 80 ribu (sengketa biaya admin), limit kartu Rp 20 jt, riwayat selalu lancar. Default?",
          options: [
            { text: "Ya — DPD > 90 hari otomatis default tanpa kecuali", why: "Ada ambang materialitas — default mengukur ketidakmampuan bayar yang material." },
            { text: "Bukan default — di bawah ambang materialitas dan bersifat sengketa administratif, bukan ketidakmampuan bayar", why: "Tanpa ambang ini, jutaan nasabah ritel 'default' karena administrasi.", correct: true },
            { text: "Ya — semua tunggakan di atas 90 hari adalah default", why: "Sengketa administratif materialitas kecil disaring." },
            { text: "Tergantung mood analis", why: "Ada kriteria materialitas yang ditetapkan bank." },
          ],
        },
      ],
    },
  ],
};
