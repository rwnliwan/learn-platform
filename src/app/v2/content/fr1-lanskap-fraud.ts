import type { V2Lesson } from "../lib/types";

export const fr1: V2Lesson = {
  slug: "fr1-lanskap-fraud",
  track: "Fraud & AML Analytics",
  module: "Lanskap Fraud",
  title: "FR1 — 9 Wajah Fraud",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Chargeback Rp2,3 miliar dalam 30 hari",
      prose: [
        "Marketplace \"TokoMaju\" sedang naik daun. September 2026: GMV pecah rekor. Lalu Oktober tiba — email dari bank: chargeback Rp2,3 miliar dalam 30 hari. Kartu-kartu curian dipakai borong iPhone dan emas batangan, barang dikirim ke alamat kos-kosan, lalu pemilik kartu asli komplain.",
        "Tim IT sigap: mereka pasang verifikasi OTP untuk semua pembayaran kartu. Chargeback turun, lalu naik lagi — kali ini lewat akun-akun yang lolos KYC dengan KTP asli. KTP-nya asli, orangnya ada, tapi \"orang\" itu dibayar Rp200 ribu untuk meminjamkan identitasnya.",
        "Musuh yang mereka lawan bukan satu jenis. Ada pencuri kartu (card fraud), ada pembajak akun (ATO), ada pemilik identitas yang menjual dirinya sendiri (mule). Satu senjata — OTP — tidak bisa membunuh tiga musuh yang berbeda. Lesson ini: kenali dulu wajah-wajahnya, baru bangun senjatanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Fraud = hacker membobol sistem.\" Mayoritas fraud modern tidak membobol apa pun: first-party fraud memakai akun asli, APP scam memakai transfer sukarela korban, synthetic identity lolos KYC resmi. Yang dibobol bukan server — melainkan kepercayaan pada identitas.",
      },
      reference: "9 tipe fraud = 9 mekanisme serangan, masing-masing meninggalkan jejak data yang berbeda.",
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 2 · Taksonomi",
      title: "9 tipe fraud dan jejak datanya",
      prose: [
        "Fraud di pembayaran digital mengelompok ke 9 pola. Card fraud: kartu curian belanja online (CNP) — jejaknya device baru, alamat kirim asing, barang bernilai tinggi. ATO: akun legit dibajak — jejaknya perubahan mendadak (device, lokasi, pola). Application fraud: pengajuan dengan dokumen palsu. Synthetic identity: \"manusia\" gabungan data asli dan palsu yang tidak pernah ada — tidak ada korban yang komplain.",
        "First-party fraud: pelakunya justru pelangganmu (klaim palsu, friendly fraud) — jejaknya motif, bukan teknis. Merchant fraud: toko fiktif menggesek kartu curian di tokonya sendiri. Mule account: rekening transit dana hasil kejahatan — pemiliknya dibayar Rp200–500 ribu lewat lowongan kerja palsu. Insider: orang dalam menyalahgunakan akses. APP scam: korban transfer sukarela karena ditipu — secara teknis transaksinya \"sah\".",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hafalkan taksonomi bukan untuk ujian — tapi agar saat investigator berkata \"ada pola refund aneh\", otakmu langsung menjawab: first-party atau insider? Jejak datanya apa? Siapa yang diuntungkan? Taksonomi adalah kecepatan berpikir, bukan koleksi label.",
      },
      reference: "Tiap tipe butuh senjata berbeda: otomatisasi, kontrol manual, edukasi, atau graph.",
    },
    {
      id: "ekonomi",
      eyebrow: "Langkah 3 · Ekonomi fraud",
      title: "Fraud rate dan expected loss",
      prose: [
        "Tim fraud yang dewasa tidak bertanya \"berapa banyak kasus?\" melainkan \"berapa rupiah hilang, dan berapa biaya menghentikannya?\" Dua metrik dasar: fraud rate = fraud terkonfirmasi / total transaksi, dan expected loss = jumlah transaksi x fraud rate x rata-rata severity.",
        "Contoh TokoMaju, 1 bulan: 200.000 transaksi, 340 fraud terkonfirmasi, rata-rata nominal fraud Rp1,1 juta. Fraud rate = 340/200.000 = 0,17% (17 bps). Expected loss = 0,0017 x 1.100.000 x 200.000 = Rp374 juta/bulan. Tim fraud 4 orang (biaya ~Rp60 juta/bulan) + tool Rp40 juta = Rp100 juta — jauh di bawah Rp374 juta, jadi investasi pertahanan masuk akal.",
        "Intuisi kunci: fraud rate rendah bisa tetap mematikan jika severity tinggi. 10 kasus x Rp100 juta (Rp1 M) jauh lebih sakit dari 1.000 kasus x Rp50 ribu (Rp50 jt). Jangan prioritaskan berdasarkan jumlah kasus — prioritaskan berdasarkan expected loss.",
      ],
      formula: String.raw`\text{Expected Loss} = N \times p \times S`,
      formulaNote: "N = jumlah transaksi, p = fraud rate, S = rata-rata severity (Rp per fraud).",
      tasks: [
        { id: "t1", text: "Hitung `fraud_rate` dari `fraud_trx` dan `total_trx`" },
        { id: "t2", text: "Hitung `loss` (kerugian total) dan `loss_per_omzet`" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "fraud_rate=1.20% loss=Rp0.10M loss_per_omzet=3.28%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Hanya melihat fraud rate. Coba ubah avg_fraud dari 875.000 ke 350.000 di kepalamu: fraud rate tetap 1,20%, tapi kerugian anjlok. Rate tanpa severity = setengah cerita.",
      },
      hints: [
        "fraud_rate = fraud dibagi total transaksi.",
        "Omzet = total_trx dikali avg_normal; loss_per_omzet = loss dibagi omzet.",
        "fraud_rate = fraud_trx / total_trx",
      ],
      code: {
        starter: `total_trx  = 10000      # transaksi sebulan\nfraud_trx  = 120        # fraud terkonfirmasi\navg_fraud  = 875_000    # rata-rata nilai fraud (Rp)\navg_normal  = 320_000    # rata-rata nilai normal (Rp)\n\n# TULIS KODEMU: fraud rate, kerugian total, loss per omzet\nfraud_rate =\nloss =\nomzet = total_trx * avg_normal\nloss_per_omzet =\n\nprint(f"fraud_rate={fraud_rate*100:.2f}%")\nprint(f"loss=Rp{loss/1e9:.2f}M")\nprint(f"loss_per_omzet={loss_per_omzet*100:.2f}%")`,
        lockLines: 4,
        solution: `total_trx  = 10000      # transaksi sebulan\nfraud_trx  = 120        # fraud terkonfirmasi\navg_fraud  = 875_000    # rata-rata nilai fraud (Rp)\navg_normal  = 320_000    # rata-rata nilai normal (Rp)\n\n# TULIS KODEMU: fraud rate, kerugian total, loss per omzet\nfraud_rate = fraud_trx / total_trx\nloss = fraud_trx * avg_fraud\nomzet = total_trx * avg_normal\nloss_per_omzet = loss / omzet\n\nprint(f"fraud_rate={fraud_rate*100:.2f}%")\nprint(f"loss=Rp{loss/1e9:.2f}M")\nprint(f"loss_per_omzet={loss_per_omzet*100:.2f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "fraud_rate", value: 0.012, tol: 1e-9, label: "`fraud_rate` seharusnya 0.012", msg: "120 / 10.000 = 0,012. Cek pembaginya." },
          { kind: "equal", task: "t2", name: "loss", value: 105000000, tol: 1, label: "`loss` seharusnya 105.000.000", msg: "120 x 875.000 = 105.000.000." },
          { kind: "equal", task: "t2", name: "loss_per_omzet", value: 0.0328125, tol: 1e-6, label: "`loss_per_omzet` seharusnya 0,0328", msg: "105 jt / 3,2 M = 0,0328. Cek omzet = total_trx x avg_normal." },
          { kind: "stdout_matches", task: "t3", pattern: "fraud_rate=1\\.20%", label: "`print` menampilkan fraud rate", msg: "Format: fraud_rate=...% seperti contoh." },
        ],
      },
      reference: "fraud rate = fraud/total. Expected loss = N x p x severity.",
    },
    {
      id: "kanal",
      eyebrow: "Langkah 4 · Lab kanal",
      title: "Di kanal mana fraud paling pekat?",
      prose: [
        "Data TokoMaju 1 bulan: kartu kredit 2.500 transaksi dengan 95 fraud (rate 3,80%), e-wallet 4.000 dengan 18 fraud (0,45%), transfer bank 2.500 dengan 6 fraud (0,24%), COD 1.000 dengan 1 fraud (0,10%). Kartu kredit \"lebih pekat\" 8,4x lipat dari e-wallet — pola klasik, karena jarak antara pemilik kartu dan transaksi paling jauh.",
        "Tapi rate saja belum cukup. Severity: kartu kredit rata-rata Rp1,4 juta vs e-wallet Rp380 ribu. Expected loss: kartu 95 x Rp1,4 jt = Rp133 juta; e-wallet 18 x Rp380 rb = Rp6,84 juta. Dari 113 kasus dua kanal ini, kartu kredit menyumbang 95% kerugiannya.",
        "Keputusan: tim 3 orang dialokasikan 80% ke kartu kredit (3-D Secure, velocity rule, device check), 20% ke e-wallet (monitoring dasar). Prioritas = rate x severity x volume — bukan rate saja, bukan volume saja.",
      ],
      tasks: [
        { id: "t1", text: "Temukan kanal dengan fraud rate tertinggi → `terpekat` (nama string)" },
        { id: "t2", text: "Hitung `rate_terpekat` (persen) dan `kontribusi` (% dari total fraud)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "terpekat=kartu rate=3.80% kontribusi=79.2%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "APP scam kecil di grafik kanal bukan berarti tidak penting — ia tumbuh paling cepat dan paling sulit dideteksi mesin karena transaksinya \"sah\" secara teknis. Prioritas tidak sama dengan batang tertinggi.",
      },
      hints: [
        "Rate tiap kanal = fraud / transaksi * 100. Cari yang terbesar.",
        "Kontribusi = fraud kanal itu / total semua fraud * 100.",
        "terpekat = max(kanal, key=lambda k: kanal[k][1]/kanal[k][0])",
      ],
      code: {
        starter: `# (transaksi, fraud) per kanal\nkanal = {\n    "kartu":    (2500, 95),\n    "ewallet":  (4000, 18),\n    "transfer": (2500, 6),\n    "cod":      (1000, 1),\n}\n\n# TULIS KODEMU: kanal terpekat, rate-nya, kontribusinya thd total fraud\nterpekat =\nrate_terpekat =\nkontribusi =\n\nprint(f"terpekat={terpekat} rate={rate_terpekat:.2f}% kontribusi={kontribusi:.1f}%")`,
        lockLines: 8,
        solution: `# (transaksi, fraud) per kanal\nkanal = {\n    "kartu":    (2500, 95),\n    "ewallet":  (4000, 18),\n    "transfer": (2500, 6),\n    "cod":      (1000, 1),\n}\n\n# TULIS KODEMU: kanal terpekat, rate-nya, kontribusinya thd total fraud\nrate = {k: f/t*100 for k, (t, f) in kanal.items()}\nterpekat = max(rate, key=rate.get)\nrate_terpekat = rate[terpekat]\ntotal_fraud = sum(f for _, f in kanal.values())\nkontribusi = kanal[terpekat][1] / total_fraud * 100\n\nprint(f"terpekat={terpekat} rate={rate_terpekat:.2f}% kontribusi={kontribusi:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "terpekat", value: "kartu", label: "`terpekat` seharusnya \"kartu\"", msg: "Rate kartu = 95/2500 = 3,80% — tertinggi dari keempat kanal." },
          { kind: "equal", task: "t2", name: "rate_terpekat", value: 3.8, tol: 1e-9, label: "`rate_terpekat` seharusnya 3.80", msg: "95 / 2500 x 100 = 3,80." },
          { kind: "equal", task: "t2", name: "kontribusi", value: 79.1667, tol: 0.01, label: "`kontribusi` sekitar 79.2", msg: "95 / 120 x 100 = 79,17." },
          { kind: "stdout_matches", task: "t3", pattern: "terpekat=kartu", label: "`print` menampilkan kanal terpekat", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "rate = fraud/transaksi. Prioritas pertahanan = rate x severity x volume.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Fraud apa yang diperangi duluan",
      prose: [
        "Empat aturan prioritas. Satu: expected loss terbesar + jejak teknis jelas → bangun deteksi otomatis duluan (card fraud, ATO). Dua: severity ekstrem tapi frekuensi rendah → kontrol manual + dual approval (insider, merchant fraud). Tiga: tidak ada anomali teknis → serang via edukasi + graph (APP scam, mule). Empat: pelakunya pelanggan sendiri → fitur perilaku + dispute history (first-party).",
        "Aturan praktis 10 detik: hitung expected loss per tipe (rate x severity x volume) — bukan jumlah kasus. Jejak teknis jelas → otomasi (rule/ML). Jejak motif → proses + manusia. Kasus langka + rugi besar → kontrol manual, jangan paksakan ML. Setiap tipe fraud butuh senjata berbeda — satu model untuk semua = tidak ada yang optimal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Fraud yang terlihat hanyalah puncak gunung es. Setiap 1 kasus terkonfirmasi, ada 3–5 yang tidak ketahuan. Artinya angka \"Rp374 juta/bulan\" adalah batas bawah. Sajikan dua angka: terkonfirmasi (fakta) dan terestimasi (fakta + model) — direksi yang hanya melihat angka terkonfirmasi akan selalu under-invest di pertahanan.",
      },
      reference: "Prioritas: expected loss terbesar dulu; senjata menyesuaikan jejak (teknis/manusia/jaringan).",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Prioritas 90 hari tim fraud TokoMaju",
      prose: [
        "Kamu mewarisi data 3 tipe fraud di TokoMaju. Card fraud: 340 kasus/bulan, rata-rata Rp1,1 jt → loss Rp374 jt/bulan. First-party (klaim palsu): 1.200 kasus/bulan, rata-rata Rp180 rb → loss Rp216 jt/bulan. Mule network: 1 ring terdeteksi, loss Rp900 jt — sekali, 3 bulan lalu, belum tentu berulang.",
        "Tugasmu: susun prioritas 90 hari. Pertanyaan panduan: (a) tipe mana yang diperangi duluan dan mengapa — hitung expected loss per tipe; (b) untuk tiap tipe, senjata apa yang dipakai (otomasi rule/ML, kontrol manual, edukasi, graph)? (c) tipe mana yang justru jangan dikejar dengan ML, dan kenapa?",
        "Jawaban yang defensibel: card fraud duluan — expected loss terbesar (Rp374 jt/bulan) dan jejak teknisnya jelas (device baru, alamat asing) sehingga cocok untuk otomasi. First-party kedua — loss besar tapi jejak motif, butuh fitur perilaku + dispute history, bukan sekadar rule. Mule network — loss sekali Rp900 jt terasa besar, tapi frekuensinya tidak pasti; tangani dengan graph + kontrol manual, jangan bangun ML khusus untuk 1 kejadian.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "First-party meninggalkan jejak motif (bukan teknis) — butuh memori dispute, bukan sekadar fitur device. Mule dan insider adalah masalah jaringan — satu transaksi tidak berarti apa-apa, polanya baru terlihat di graph.",
      },
      reference: "Prioritas = expected loss; senjata = ikuti jejak (teknis, motif, jaringan).",
    },
    {
      id: "peta-kerugian",
      eyebrow: "Langkah 7 · Peta kerugian",
      title: "Ke mana perginya uang: peta Rp per kanal",
      prose: [
        "Gambaran bank menengah Indonesia, 8 juta transaksi/bulan — angka komposit dari pola industri, bukan satu bank. Empat kanal, empat karakter kerugian. Kartu (CNP, card-not-present): ±Rp8,5 miliar/bulan. Modusnya klasik dan terindustrialisasi — kartu curian dari breach, diuji dengan transaksi kecil, lalu dibelanjakan barang likuid (emas, elektronik). Rata-rata Rp1,1 juta per kasus, volume besar, jejak teknis jelas (device baru, alamat asing).",
        "Transfer antarbank (BI-FAST/SKNBI, termasuk APP scam): ±Rp14 miliar/bulan — kanal TERBESAR. Dua penghuni di sini: ATO cash-out (akun dibajak, dikuras via transfer cepat — ingat Rp800 juta NusaBank dalam 20 menit) dan APP scam (korban transfer sukarela karena ditipu, rata-rata Rp3–7 juta per korban). Kecepatan BI-FAST yang menjadi kebanggaan nasabah adalah senjata yang sama di tangan penipu: dana tak bisa ditarik kembali setelah 20 menit.",
        "E-wallet/QRIS: ±Rp6 miliar/bulan. Karakteristiknya: nominal kecil-menengah (Rp200–800 ribu), volume sangat tinggi, dan vektor social engineering yang kuat — \"kamu dapat hadiah, scan QRIS ini untuk klaim\". QRIS statis warung yang ditempel ulang dengan QRIS penipu adalah modus yang tidak butuh malware sama sekali. Ditambah farming: ribuan akun e-wallet baru dari device yang sama untuk menyedot promo dan bansos.",
        "Social engineering sebagai vektor lintas kanal: tidak berdiri sendiri di pembukuan, tetapi menjadi \"cara masuk\" untuk ±40% kerugian tiga kanal di atas. APK undangan nikah, fake customer service, lowongan kerja palsu yang meminta instalasi aplikasi — semuanya mengeksploitasi satu celah yang tidak bisa di-patch: kepercayaan. Total peta: ±Rp28,5 miliar/bulan, dengan transfer sebagai yang terbesar dan social engineering sebagai pintu masuk paling murah bagi penipu.",
        "Tiga pelajaran dari peta ini. Satu: kanal terbesar (transfer) adalah juga kanal yang transaksinya \"sah secara teknis\" — model transaksional murni buta terhadap APP scam, sehingga porsi terbesar kerugian justru butuh senjata non-model (friction, edukasi). Dua: kartu punya jejak teknis terbaik — setiap rupiah yang diinvestasikan ke deteksi kartu punya return paling terukur. Tiga: e-wallet adalah medan perang volume — pertarungan di sana dimenangkan dengan biaya per keputusan yang murah (otomasi), bukan dengan investigator mahal.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: ikuti uangnya — siapa yang rugi menentukan siapa yang membayar pertahananmu",
        type: "risk",
        body: "Investigator junior memprioritaskan berdasarkan apa yang paling ramai dikeluhkan; investigator senior memprioritaskan berdasarkan siapa yang menanggung kerugiannya — karena di situlah anggaran pertahanan berasal. Logikanya sederhana tetapi jarang dijalankan sampai tuntas: tim fraud dibayar oleh institusi, dan institusi hanya menginvestasikan pertahanan pada kerugian yang keluar dari kantongnya sendiri. Maka langkah pertama setiap analis baru bukanlah membuka dashboard alert, melainkan memetakan liability: untuk tiap kanal, siapa yang secara kontrak dan regulasi menanggung loss-nya? Setelah peta itu jelas, prioritas menjadi aritmetika — expected loss dikali porsi tanggung jawab institusi — bukan perasaan, bukan volume keluhan, bukan liputan media. Kedua, waspadai distorsi visibilitas: APP scam korbannya paling vokal (mereka kehilangan uang sendiri dan menuntut bank bertanggung jawab), tetapi bank tidak menanggungnya secara langsung — analis yang mengalokasikan 80% waktunya ke sana karena \"ramai\" sedang bekerja untuk metrik yang salah. Ketiga, liability bisa BERUBAH oleh regulasi — dan ketika OJK menggeser tanggung jawab APP scam ke bank, seluruh peta prioritas harus digambar ulang dalam seminggu. Analis yang memegang peta liability selalu selangkah di depan analis yang hanya memegang peta serangan.",
      },
      reference: "Transfer ±Rp14 M/bln (terbesar), kartu Rp8,5 M, e-wallet Rp6 M. Social engineering = pintu masuk ±40% kerugian.",
    },
    {
      id: "siapa-menanggung",
      eyebrow: "Langkah 8 · Liability",
      title: "Siapa menanggung — dan apa artinya untuk prioritasmu",
      prose: [
        "Kartu CNP: yang menanggung adalah ISSUER (bank penerbit kartu) — via mekanisme chargeback, dana kembali ke pemegang kartu dan bank menelan kerugiannya. Artinya setiap rupiah deteksi kartu yang berhasil adalah rupiah yang langsung kembali ke P&L bank. Tidak heran investasi model fraud paling matang ada di kanal ini: return-nya terukur, pemilik masalahnya jelas, dan metriknya (chargeback rate) diawasi jaringan kartu global. Prioritas analis: otomasi agresif, threshold dihitung dari biaya — medan perang yang paling \"bersih\" secara ekonomi.",
        "Transfer APP scam: yang menanggung adalah NASABAH — transfernya sah, otorisasi sah (OTP diberikan sendiri), bank secara kontrak tidak wajib mengganti. Ini fakta yang pahit dan menentukan segalanya: bank tidak punya insentif P&L langsung untuk membangun model mahal di sini, sehingga pertahanannya adalah friction (jeda + peringatan) dan edukasi — senjata murah yang melindungi TANPA menjanjikan penggantian. Prioritas analis: bukan precision model, melainkan efektivitas intervensi — berapa persen korban yang membatalkan transfer setelah melihat peringatan 30 detik?",
        "E-wallet: tanggung jawabnya TERBAGI — tergantung skema: saldo e-wallet yang dibajak (bank/e-money issuer menanggung sebagian), QRIS merchant palsu (nasabah menanggung), promo abuse/farming (perusahaan menanggung sebagai biaya akuisisi yang bocor). Prioritas analis: pilah dulu siapa yang rugi per sub-modus, baru alokasikan — farming promo adalah masalah unit bisnis (mereka yang membayar), bukan masalah tim fraud semata.",
        "Implikasi operasionalnya diringkas dalam satu aturan alokasi: anggaran pertahanan per kanal proporsional terhadap (expected loss kanal × porsi tanggung jawab institusi). Kartu: loss besar × tanggung jawab 100% = investasi terbesar. Transfer APP scam: loss terbesar × tanggung jawab ~0% = investasi pada friction murah + edukasi, bukan model mahal. E-wallet: pilah per sub-modus. Analis yang mengusulkan \"model canggih untuk APP scam\" tanpa menjawab \"siapa yang membayarnya dan dari kantong siapa return-nya\" akan ditolak komite — bukan karena idenya buruk, tetapi karena ekonominya tidak masuk akal.",
        "Satu peringatan ke depan: peta liability bukan hukum alam. Jika OJK suatu hari menggeser tanggung jawab APP scam ke bank (seperti yang terjadi di Inggris dengan regulasi APP reimbursement), kanal Rp14 miliar/bulan itu berubah status dalam semalam — dari \"bukan masalah P&L\" menjadi \"masalah terbesar\". Analis yang baik menyimpan draf rencana deteksi APP scam di laci, diperbarui tiap semester, agar ketika regulasi berubah ia tidak mulai dari nol.",
      ],
      tasks: [],
      reference: "Alokasi = expected loss × porsi tanggung jawab institusi. Kartu: otomasi. APP scam: friction. E-wallet: pilah per sub-modus.",
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
        "9 tipe fraud — card, ATO, application, synthetic identity, first-party, merchant, mule, insider, APP scam — masing-masing punya mekanisme dan jejak data berbeda.",
        "Prioritas = expected loss (rate x severity x volume) — bukan jumlah kasus.",
        "First-party meninggalkan jejak motif; mule & insider adalah masalah jaringan.",
        "Satu senjata tidak membunuh semua musuh — tiap tipe butuh pendekatan deteksi berbeda.",
        "Fraud yang terlihat = puncak gunung es; sajikan angka terkonfirmasi dan terestimasi.",
      ],
      next: { label: "FR2 — Fraud vs AML", href: "/v2/learn/fr2-fraud-vs-aml" },
      quiz: [
        {
          q: "Transaksi Rp15 juta memakai kartu curian untuk beli emas batangan, dikirim ke alamat kos. Ini tipe fraud apa?",
          options: [
            { text: "First-party fraud", why: "First-party pelakunya pelanggan asli — di sini kartunya curian, pemilik asli komplain." },
            { text: "Card fraud (CNP)", why: "Kartu curian dipakai tanpa kehadiran fisik kartu, target barang bernilai tinggi dan mudah dijual kembali (emas, elektronik).", correct: true },
            { text: "APP scam", why: "APP scam korbannya transfer sukarela — di sini pemilik kartu tidak menyetujui apa pun." },
            { text: "Insider fraud", why: "Tidak ada indikasi orang dalam terlibat; ini pencurian kartu klasik." },
          ],
        },
        {
          q: "Akun 8 bulan tidak aktif, tiba-tiba login dari device baru di kota berbeda lalu transfer Rp5 juta. Pola ini paling cocok dengan…",
          options: [
            { text: "Synthetic identity", why: "Synthetic identity tidak punya 'akun lama yang berubah' — ia identitas baru yang dibina." },
            { text: "Merchant fraud", why: "Merchant fraud soal toko fiktif menggesek kartu — bukan perubahan perilaku akun." },
            { text: "Account takeover (ATO)", why: "Kuncinya PERUBAHAN mendadak pada akun legit: device baru + lokasi baru + transaksi menyimpang.", correct: true },
            { text: "Mule account", why: "Mule adalah rekening transit dana kejahatan — di sini yang terjadi pembajakan akun korban." },
          ],
        },
        {
          q: "Dua skenario: (A) 1.000 kasus x Rp50 ribu, (B) 10 kasus x Rp100 juta. Mana yang diprioritaskan?",
          options: [
            { text: "A — kasusnya 100x lebih banyak", why: "Jumlah kasus menipu; yang menentukan kerugian adalah expected loss." },
            { text: "B — expected loss Rp1 M vs Rp50 jt", why: "Expected loss A = Rp50 juta, B = Rp1 miliar (20x lipat). Rate x severity x volume.", correct: true },
            { text: "Sama saja", why: "Selisihnya 20x lipat — tidak sama sama sekali." },
            { text: "Tergantung mood tim", why: "Prioritas dihitung dari angka, bukan perasaan." },
          ],
        },
        {
          q: "Mengapa APP scam (korban transfer sukarela karena ditipu) sulit dideteksi model ML transaksional?",
          options: [
            { text: "Datanya terlalu sedikit", why: "Bukan soal volume data — soal tidak adanya jejak yang bisa dipelajari." },
            { text: "Secara teknis transaksinya sah — tidak ada anomali device, IP, atau perilaku", why: "Korban memakai device sendiri, OTP sendiri, ke rekening yang 'valid'. Senjatanya friction di UI + edukasi, bukan sekadar model.", correct: true },
            { text: "Model ML tidak bisa membaca nominal", why: "Model justru sangat bisa membaca nominal — masalahnya bukan di situ." },
            { text: "Karena pakai QRIS", why: "Kanal tidak menentukan; APP scam bisa lewat kanal apa pun." },
          ],
        },
        {
          q: "\"KTP asli + nama palsu + nomor baru, dibina 6 bulan lalu bust-out Rp50 juta.\" Ini…",
          options: [
            { text: "Application fraud biasa", why: "Application fraud memakai dokumen palsu sekali pakai — ini dibina berbulan-bulan." },
            { text: "Synthetic identity", why: "Identitas 'Frankenstein' gabungan data asli dan palsu, dibina lalu bust-out. Tidak ada korban komplain karena 'orangnya' tidak ada.", correct: true },
            { text: "First-party fraud", why: "First-party pelakunya orang nyata yang menyangkal — di sini orangnya memang tidak ada." },
            { text: "Card fraud", why: "Tidak ada kartu yang dicuri atau disalahgunakan di sini." },
          ],
        },
      ],
    },
  ],
};
