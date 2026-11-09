import type { V2Lesson } from "../lib/types";

export const cr22: V2Lesson = {
  slug: "cr22-collection-recovery",
  track: "Credit Risk",
  module: "Pricing & Collection",
  title: "CR22 — Collection & Recovery",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "SMS di hari ke-5",
      prose: [
        "Pak Budi telat bayar 5 hari. Bank meneleponnya hari itu juga: \"Pak, cicilannya jatuh tempo.\" Pak Budi kaget — ia lupa. Bayar lusa. Cure rate: 85%.",
        "Tetapi di bank lain, akun DPD 5 hari tidak disentuh — \"nanti saja kalau sudah 30 hari.\" Di hari ke-45, Pak Budi sudah gali lubang tutup lubang ke pinjol. Cure rate: 41%.",
        "Bank kedua menghabiskan 10× biaya collection (telepon, kunjungan, hukum) untuk hasil setengahnya. Bukan karena penagihnya malas — melainkan karena strateginya buta waktu. Lesson ini tentang menagih seperti dokter IGD: cepat, bertahap, dan tahu kapan berhenti.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Cure rate seperti es yang mencair — di menit pertama masih bisa dibekukan lagi; setelah jadi air, tidak. Kebanyakan bank menginvestasikan terbalik: sedikit di awal (murah), banyak di akhir (mahal + sia-sia). Analis yang baik membalik piramida ini: Rp 1 di awal menyelamatkan 10× lipat dibanding di akhir.",
      },
      reference: "Kecepatan kontak (jam, bukan minggu) menentukan hasil.",
    },
    {
      id: "cure",
      eyebrow: "Langkah 2 · Cure Rate",
      title: "Waktu adalah segalanya",
      prose: [
        "Cure rate = % akun menunggak yang kembali lancar (tanpa restrukturisasi) dalam periode tertentu, per bucket DPD. Penurunan eksponensial: DPD 1–30 cure 85% → DPD 180+ cure 8%. Setiap bulan penundaan membunuh peluang sembuh. DPD 1–30 vs 180+: 10× lipat bedanya.",
        "Implikasi operasional: Rp 1 juta untuk reminder DPD 5 hari menyelamatkan 85 akun; Rp 1 juta untuk hukum DPD 180+ menyelamatkan 8. Alokasi collection harus miring ke awal.",
        "Debitur kooperatif tetapi kesulitan bayar (DPD 45): restrukturisasi (penjadwalan ulang/keringanan) — menyelamatkan lebih murah dari melelang, dan debitur kooperatif = aset. Melelang yang kooperatif menghancurkan nilai (biaya lelang + harga distressed).",
      ],
      tasks: [],
      reference: "Cure rate DPD 1-30 = 85%, DPD 180+ = 8%: miringkan sumber daya ke DPD awal.",
    },
    {
      id: "lab-nilai",
      eyebrow: "Langkah 3 · Lab Nilai",
      title: "Kapan berhenti menagih?",
      prose: [
        "Saldo Rp 10 juta. Lima strategi terkunci (biaya, cure): reminder (40rb, 85%), telepon (75rb, 62%), kunjungan (120rb, 55%), restrukturisasi (60rb, 48%), hukum/lelang (2jt, 30%). Nilai ekspektasi = cure × saldo − biaya. Tugasmu: hitung nilai tiap strategi dan tentukan yang terbaik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `nilai_reminder` dan `nilai_hukum`" },
        { id: "t2", text: "Hitung `nilai_kunjungan` dan `terbaik` (nama strategi)" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "reminder=8.46jt hukum=1.00jt kunjungan=5.38jt terbaik=Reminder",
      hints: [
        "nilai = cure * saldo - biaya.",
        "nilai_reminder = 0.85 * 10_000_000 - 40_000.",
        "Bandingkan kelimanya untuk `terbaik`.",
      ],
      code: {
        starter: `saldo = 10_000_000\nstrategi = [\n    ("Reminder (SMS/WA)",   40_000, 0.85),\n    ("Intensif (telepon)",  75_000, 0.62),\n    ("Kunjungan",          120_000, 0.55),\n    ("Restrukturisasi",     60_000, 0.48),\n    ("Hukum/lelang",     2_000_000, 0.30),\n]\n\n# TULIS KODEMU\nnilai_reminder = \nnilai_hukum = \nnilai_kunjungan = \nterbaik = \n\nprint(f"reminder={nilai_reminder:.0f} hukum={nilai_hukum:.0f} kunjungan={nilai_kunjungan:.0f} terbaik={terbaik}")`,
        lockLines: 8,
        solution: `saldo = 10_000_000\nstrategi = [\n    ("Reminder (SMS/WA)",   40_000, 0.85),\n    ("Intensif (telepon)",  75_000, 0.62),\n    ("Kunjungan",          120_000, 0.55),\n    ("Restrukturisasi",     60_000, 0.48),\n    ("Hukum/lelang",     2_000_000, 0.30),\n]\n\n# TULIS KODEMU\nnilai_reminder = 0.85 * saldo - 40_000\nnilai_hukum = 0.30 * saldo - 2_000_000\nnilai_kunjungan = 0.55 * saldo - 120_000\nterbaik = max(strategi, key=lambda s: s[2]*saldo - s[1])[0]\n\nprint(f"reminder={nilai_reminder:.0f} hukum={nilai_hukum:.0f} kunjungan={nilai_kunjungan:.0f} terbaik={terbaik}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nilai_reminder", value: 8460000, tol: 1, label: "`nilai_reminder` seharusnya 8.460.000", msg: "0.85 × 10jt − 40rb = 8.460.000." },
          { kind: "equal", task: "t1", name: "nilai_hukum", value: 1000000, tol: 1, label: "`nilai_hukum` seharusnya 1.000.000", msg: "0.30 × 10jt − 2jt = 1.000.000." },
          { kind: "equal", task: "t2", name: "nilai_kunjungan", value: 5380000, tol: 1, label: "`nilai_kunjungan` seharusnya 5.380.000", msg: "0.55 × 10jt − 120rb = 5.380.000." },
          { kind: "equal", task: "t2", name: "terbaik", value: "Reminder (SMS/WA)", label: "`terbaik` = Reminder", msg: "8.46jt tertinggi — strategi termurah justru terbaik." },
          { kind: "stdout_matches", task: "t3", pattern: "reminder=8460000\\s+hukum=1000000\\s+kunjungan=5380000", label: "`print` menampilkan nilai-nilainya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Untuk saldo Rp 2 jt: kunjungan masih +Rp980.000 (0,55×Rp2 jt − Rp120 rb) — hanya hukum/lelang yang RUGI (−Rp1,4 jt: 0,30×Rp2 jt − Rp2 jt). Break-even kunjungan: saldo Rp218 rb pada cure 55%, atau cure 8% pada saldo Rp1,5 jt. Jadi untuk saldo kecil, pilih reminder/telepon — kunjungan hanya bila saldonya di atas Rp218 rb. Inilah segmentasi collection.",
    },
    {
      id: "strategi",
      eyebrow: "Langkah 4 · Strategi",
      title: "Dari SMS ke lelang",
      prose: [
        "Eskalasi collection = tangga tindakan dari murah-lunak ke mahal-keras, dipilih berdasar DPD + saldo + segmentasi risiko: reminder (SMS/WA/email) — DPD 1–7, biaya ~Rp 40 rb, untuk \"lupa bayar\"; intensif (telepon) — DPD 8–30, biaya ~Rp 75 rb, negosiasi janji bayar; kunjungan (field visit) — DPD 31–90, saldo besar, biaya ~Rp 120 rb, verifikasi kondisi; restrukturisasi — debitur kooperatif tetapi kesulitan (CR2), win-win; hukum/lelang — DPD 180+, agunan jelas, biaya Rp 2 jt+, senjata terakhir.",
        "Trade-off brutal: strategi termurah (reminder) justru cure rate tertinggi — karena dipakai di DPD awal. Hukum: biaya 50× lipat reminder, cure rate sepertiga. Eskalasi bukan \"makin keras makin berhasil\" — melainkan \"makin mahal karena yang murah sudah tidak mempan\". Urutan tidak boleh dibalik.",
        "Saldo Rp 5 jt DPD 200: kunjungan (cure 8%) vs telepon (cure 3%). Aritmetika, bukan otot: kunjungan = 8%×5jt−120rb = +Rp 280 rb; telepon = 3%×5jt−75rb = +Rp 75 rb. Lakukan yang ekspektasinya lebih besar dulu (kunjungan), telepon sebagai cadangan. Jika gagal 2× dan ekspektasi negatif → berhenti (write-off).",
      ],
      formula: String.raw`\text{Nilai} = \text{cure rate} \times \text{saldo} - \text{biaya}`,
      formulaNote: "Jika negatif → jangan lakukan (write-off lebih murah). Aksi yang ekspektasinya negatif adalah amal yang dibayar bank.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Penagih yang galak = collection bagus.\" Collection modern = operasi data, bukan operasi otot. Yang menentukan hasil: kecepatan kontak (jam, bukan minggu), segmentasi tepat (saldo kecil ≠ kunjungan), dan tawaran yang realistis (restrukturisasi untuk yang kooperatif). Intimidasi justru menaikkan risiko reputasi & hukum (OJK melarang penagihan tidak beretika).",
      },
      reference: "Saldo Rp 2 jt, DPD 60: telepon (1,165jt) > kunjungan (980rb) — pilih yang NILAI TERTINGGI, bukan sekadar positif.",
    },
    {
      id: "curve",
      eyebrow: "Langkah 5 · Kurva",
      title: "Kapan berhenti?",
      prose: [
        "Recovery curve = recovery kumulatif (%) terhadap waktu sejak default. Bentuknya cekung: cepat di awal (agunan likuid, debitur kooperatif), melambat, lalu datar.",
        "Titik berhenti: workout dihentikan saat biaya marjinal > recovery marjinal — titik net maksimum. Melanjutkan setelah itu = membakar uang untuk menaikkan angka recovery kotor.",
        "Recovery seperti memeras handuk basah — perasan pertama keluar banyak air; perasan ke-20 hanya tetesan, tetapi tenagamu sama. Bank yang bijak tahu kapan meletakkan handuknya (jual ke pihak ketiga) dan kapan terus memeras.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kaitan ke LGD (CR12): kurva recovery adalah input empiris model LGD — recovery yang dipakai = recovery pada titik berhenti ekonomis, didiskon ke present value. Collection yang buruk = data LGD yang buruk = model yang buruk.",
      },
      reference: "Recovery naik cepat hingga bulan 12 (60%), lalu melambat drastis — 24 bulan tambahan hanya menambah 14 poin.",
    },
    {
      id: "lab-curve",
      eyebrow: "Langkah 6 · Lab Kurva",
      title: "Titik net maksimum",
      prose: [
        "Data terkunci (satuan Rp 100): bulan [0, 3, 6, 12, 18, 24, 36]; recovery [0, 25, 45, 60, 68, 72, 74]; cost [5, 28, 47, 61, 68, 72, 74]. Tugasmu: hitung net per bulan dan tentukan bulan berhenti (net maksimum pertama).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `net_12` dan `net_18`" },
        { id: "t2", text: "Tentukan `bulan_berhenti` (net maksimum pertama)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "net12=-1 net18=0 berhenti=18",
      hints: [
        "net = recovery − cost.",
        "net_12 = rec[3] - cost[3].",
        "Cari indeks net maksimum pertama dengan max + .index.",
      ],
      code: {
        starter: `bulan = [0, 3, 6, 12, 18, 24, 36]\nrec   = [0, 25, 45, 60, 68, 72, 74]\ncost  = [5, 28, 47, 61, 68, 72, 74]\n\n# TULIS KODEMU\nnet_12 = \nnet_18 = \nbulan_berhenti = \n\nprint(f"net12={net_12} net18={net_18} berhenti={bulan_berhenti}")`,
        lockLines: 3,
        solution: `bulan = [0, 3, 6, 12, 18, 24, 36]\nrec   = [0, 25, 45, 60, 68, 72, 74]\ncost  = [5, 28, 47, 61, 68, 72, 74]\n\n# TULIS KODEMU\nnet_12 = rec[3] - cost[3]\nnet_18 = rec[4] - cost[4]\nnets = [r - c for r, c in zip(rec, cost)]\nbulan_berhenti = bulan[nets.index(max(nets))]\n\nprint(f"net12={net_12} net18={net_18} berhenti={bulan_berhenti}")`,
        checks: [
          { kind: "equal", task: "t1", name: "net_12", value: -1, label: "`net_12` seharusnya −1", msg: "60 − 61 = −1." },
          { kind: "equal", task: "t1", name: "net_18", value: 0, label: "`net_18` seharusnya 0", msg: "68 − 68 = 0." },
          { kind: "equal", task: "t2", name: "bulan_berhenti", value: 18, label: "`bulan_berhenti` seharusnya 18", msg: "Net maksimum (0) pertama kali di bulan 18 — workout intensif 12 bulan, lalu jual/cessie sisanya." },
          { kind: "stdout_matches", task: "t3", pattern: "net12=-1\\s+net18=0\\s+berhenti=18", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Keputusan: workout intensif 12 bulan, lalu jual/cessie sisanya ke distressed buyer.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: menagih dengan aritmetika",
      prose: [
        "Skenario 1 — Akun DPD 1–30. → Reminder/telepon SEGERA (hari ke-3–5): cure rate 85%. Contoh nyata: Pak Budi ditelepon hari ke-5 — bayar lusa. Di bank lain yang menunggu 30 hari, cure rate tinggal 41% dengan biaya 10× lipat. Rp 1 juta di DPD 5 menyelamatkan 85 akun; di DPD 180+ menyelamatkan 8.",
        "Skenario 2 — Memilih strategi penagihan. → Hitung nilai ekspektasi = cure rate × saldo − biaya, bukan otot. Contoh nyata: saldo Rp 5 jt DPD 200 — kunjungan (8% × 5 jt − 120 rb) vs telepon (3% × 5 jt − 75 rb). Aritmetika, bukan drama.",
        "Skenario 3 — Debitur kooperatif tetapi kesulitan (DPD 45). → Restrukturisasi, bukan lelang. Contoh nyata: repo motor — lelang net Rp 7,3 jt vs restrukturisasi ekspektasi Rp 9,6 jt. Repo menghancurkan sumber pembayaran debitur (motor ojeknya); restrukturisasi mempertahankannya.",
        "Skenario 4 — Saldo kecil (<Rp 5 jt). → Larang kunjungan: nilainya negatif. Telepon/SMS saja. Mengirim field visit untuk Rp 1 juta = membakar uang demi terlihat 'tegas'.",
        "Skenario 5 — Recovery curve mendatar (biaya marjinal > recovery marjinal). → Berhenti — titik net maksimum tercapai. Jual ke pihak ketiga. Melanjutkan = memeras handuk yang sudah kering dengan tenaga yang sama.",
        "Aturan praktis 10 detik: cepat (miring ke DPD awal), bertahap (tangga eskalasi tidak boleh dibalik), tahu kapan berhenti (net maksimum); KPI = net recovery + cure rate DPD awal — bukan 'file lama selesai'.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Tim collection lembur tiap bulan, biaya naik 40%, recovery turun — audit menemukan 60% waktu habis untuk DPD 180+ (cure 8%) karena 'target penyelesaian file lama', sementara DPD 1–30 tak disentuh 2 minggu menunggu 'batch' bulanan. Piramida terbalik: kerja keras di tempat yang paling tidak produktif, dihargai oleh KPI yang salah.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tim collection yang kelelahan",
      prose: [
        "Bank Nusantara: tim collection lembur tiap bulan, biaya naik 40%, tetapi recovery turun. Audit menemukan: 60% waktu habis untuk DPD 180+ (cure 8%) — karena \"target penyelesaian file lama\"; DPD 1–30 tidak disentuh 2 minggu — menunggu \"batch\" bulanan; semua akun diperlakukan sama: kunjungan untuk saldo Rp 1 juta (!); tidak ada restrukturisasi — \"ribet, mending lelang\".",
        "Diagnosis: piramida terbalik — sumber daya habis di tempat yang paling tidak produktif. Redesign: (1) balik alokasi: 70% kapasitas ke DPD 1–30 (reminder otomatis + telepon hari ke-3); target: cegah 85% masalah sebelum membesar. (2) Segmentasi saldo: <Rp 5 jt → hanya telepon/SMS (kunjungan dilarang — nilainya negatif); >Rp 50 jt → kunjungan + restrukturisasi. (3) Ubah KPI: dari \"file lama selesai\" menjadi \"net recovery\" (recovery − biaya) + cure rate DPD awal. KPI lama menghargai kerja keras di tempat yang salah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Collector vendor ketahuan mengancam debitur (tetapi tagihannya 'berhasil'): nol toleransi — hentikan hari itu juga, audit semua kasusnya, lapor proaktif ke OJK, perketat pengawasan vendor. Tidak ada target yang layak dibayar dengan pelanggaran. Bank bertanggung jawab atas pihak ketiganya.",
      },
      reference: "Pencegahan selalu lebih murah dari pemadaman.",
    },
    {
      id: "pendalaman-ekonomi",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Ekonomi keputusan collection",
      prose: [
        "Contoh terapan kedua — ekonomi repo motor di multifinance, dihitung tuntas. Kontrak: sisa utang Rp 18 juta, DPD 120, motor Beat 2022 (harga pasar Rp 14 juta). Opsi A — tarik & lelang: biaya penarikan Rp 1,5 juta (tim + towing), biaya lelang Rp 1 juta, harga lelang 70% pasar = Rp 9,8 juta. Net = 9,8 − 2,5 = Rp 7,3 juta. Opsi B — restrukturisasi: potong denda Rp 1,2 juta, perpanjang tenor 6 bulan, cicilan turun Rp 850 ribu → Rp 620 ribu; probabilitas debitur patuh 55% (skor perilaku menengah). Ekspektasi = 55% × Rp 18 juta − biaya admin Rp 300 ribu = Rp 9,6 juta. Opsi B menang Rp 2,3 juta — DAN motor tetap dipakai debitur untuk ojek (sumber penghasilannya untuk membayar!). Pelajarannya: repo menghancurkan sumber pembayaran debitur; restrukturisasi mempertahankannya. Kecuali debitur tidak kooperatif (skor <450, janji bayar hit rate <30%), restrukturisasi hampir selalu mengalahkan lelang untuk tiket kecil-menengah. Lelang adalah pengakuan bahwa hubungan sudah mati — pastikan ia benar-benar mati sebelum mengeksekusinya.",
        "Kontras cara salah vs benar menangani promise-to-pay (janji bayar). Cara salah: collector mencatat \"janji bayar tanggal 10\" lalu menutup file — bulan depan janji yang sama terulang, file \"aktif\" terus, KPI collector hijau (banyak janji tercatat!), recovery nol. Cara benar: setiap janji bayar diberi ID, tanggal, nominal — dan dihitung hit rate per collector DAN per debitur. Data industri: janji bayar tanpa follow-up otomatis (SMS H-1) ditepati 35%; dengan SMS reminder H-1 + telepon H+1 jika gagal = 62%. Aturan keputusan: debitur dengan 2 janji gagal berturut-turut = naik eskalasi (telepon → kunjungan), tidak boleh janji ketiga tanpa kunjungan. Collector dengan hit rate janji <40% = coaching/beban kerja dikurangi — ia sedang \"mengoleksi janji\", bukan \"mengoleksi uang\". Janji bayar adalah leading indicator kualitas collector; recovery adalah lagging-nya. Kelola yang leading.",
        "Mode kegagalan nyata yang menghancurkan bank: collection yang viral. Kasus pola nyata di Indonesia: debt collector pinjol menyebar data pribadi debitur ke kontak HP-nya (doxxing) — video viral, 2 juta views. Hasilnya: sanksi OJK (denda + pembekuan penyaluran produk 3 bulan = hilang pendapatan Rp 40 miliar), gugatan class action, dan — ironisnya — recovery SEGMEN itu turun 30% karena debitur takut dihubungi (bukan patuh, melainkan menghilang: ganti nomor, pindah). Satu tindakan \"efektif\" jangka pendek menghancurkan 3 tahun pembangunan collection yang sehat. Aturan keras: (1) SEMUA skrip penagihan tertulis & disetujui legal — tidak ada improvisasi ancaman; (2) rekam 100% panggilan collection (sampling audit 5% per minggu); (3) vendor dengan 1 pelanggaran etik terverifikasi = kontrak diputus + seluruh kasusnya diaudit ulang. Biaya kepatuhan (Rp 500 juta/tahun untuk QA call) vs biaya skandal (Rp 40 miliar + reputasi) — bukan perbandingan yang sulit.",
        "Pendalaman sub-topik yang selama ini hanya disebut sekilas: segmentasi willingness vs ability. Dua dimensi, empat kuadran — tetapi eksekusinya butuh angka. Willingness diukur dari: riwayat janji-bayar hit rate, respons terhadap kontak (angkat telepon/tidak), histori DPD (pola \"bayar setelah diingatkan\" = willing tapi pelupa). Ability diukur dari: mutasi rekening 3 bulan, status pekerjaan (masih kerja/PHK), debt burden ratio. Kuadran \"mau tapi tidak mampu\" (PHK, hit rate janji 80%): restrukturisasi — ia akan bayar jika cicilannya masuk akal. Kuadran \"mampu tapi tidak mau\" (mutasi sehat, hit rate janji 10%): kunjungan tegas + opsi hukum — ia butuh alasan untuk memprioritaskanmu. Kuadran \"tidak mau & tidak mampu\": hentikan biaya collection setelah 2 upaya gagal — write-off/cessie. Kesalahan termahal: memperlakukan \"mampu tapi tidak mau\" dengan restrukturisasi lunak (ia tertawa dan tetap tidak bayar) atau \"mau tapi tidak mampu\" dengan ancaman hukum (ia menangis dan tetap tidak bisa bayar). Diagnosis dulu, obat kemudian — seperti dokter.",
        "Aturan keputusan kepala collection. Satu: 70% kapasitas ke DPD 1–30 — cegah, jangan padamkan. Dua: tidak ada kunjungan untuk saldo <Rp 5 juta (nilainya negatif — hitung dulu). Tiga: 2 janji bayar gagal = naik eskalasi otomatis. Empat: restrukturisasi adalah default untuk \"mau tapi tidak mampu\"; hukum adalah default untuk \"mampu tapi tidak mau\" yang tidak responsif. Lima: KPI = net recovery (recovery − biaya) + cure rate DPD awal — BUKAN jumlah file selesai atau janji tercatat. Enam: nol toleransi pelanggaran etik — 1 kasus terverifikasi = vendor diputus hari itu juga. Enam aturan ini mengubah collection dari \"preman bertelepon\" menjadi \"operasi data yang menghasilkan uang\".",
        "Pendalaman strategi keluar: cessie (jual piutang macet). Portofolio DPD 180+ senilai Rp 10 miliar (nilai buku setelah CKPN 60% = Rp 4 miliar). Distressed buyer menawar 12% dari nilai nominal = Rp 1,2 miliar. Terlihat rugi — tetapi hitung alternatifnya: workout sendiri 24 bulan dengan biaya Rp 800 juta menghasilkan recovery Rp 1,5 miliar (net Rp 700 juta, didiskonto 2 tahun ≈ Rp 580 juta) + tim collection tersita 2 tahun + risiko reputasi. Cessie Rp 1,2 miliar tunai HARI INI vs Rp 580 juta nilai kini + 2 tahun sakit kepala. Keputusan: jual — KECUALI ada agunan properti likuid (maka workout sendiri lebih untung). Aturan: cessie adalah harga pasar atas kegagalan collection-mu; jika harga cessie < 10% nominal, masalahnya bukan di buyer — melainkan kualitas origination 2 tahun lalu. Pakai harga cessie sebagai cermin, bukan sekadar transaksi.",
        "Satu investasi collection dengan ROI tertinggi yang hampir selalu diremehkan: otomasi DPD awal. Blast WhatsApp/SMS otomatis H+1 jatuh tempo: biaya Rp 150/kontak × 50.000 akun = Rp 7,5 juta/bulan. Efek terukur: cure rate DPD 1–7 naik 68% → 79% — selisih 11% × 50.000 × rata-rata tunggakan Rp 2 juta × (probabilitas menjadi NPL yang dicegah ~30%) ≈ Rp3,3 miliar/bulan kerugian dicegah. ROI 440×. Bandingkan: menambah 10 collector (Rp 80 juta/bulan gaji + tunjangan) untuk mengejar DPD 90+ dengan cure 15%. Bank yang \"hemat\" tidak mau keluar Rp 7,5 juta/bulan untuk otomasi, tetapi rela keluar Rp 80 juta/bulan untuk hasil yang lebih kecil — karena otomasi tidak terlihat \"kerja\", sedangkan collector terlihat sibuk. Pelajarannya: dalam collection, yang terlihat sibuk belum tentu menghasilkan; yang tidak terlihat (sistem otomatis) sering menghasilkan paling banyak. Investasikan di mesin, bukan hanya di otot.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: menagih itu aritmetika, bukan drama",
        body: "Setiap keputusan collection adalah pertaruhan ekspektasi: (peluang berhasil × nominal) − biaya. Tidak ada yang personal, tidak ada yang emosional. Heuristik yang menyelamatkan karir banyak kepala collection: sebelum menyetujui tindakan apapun, tulis TIGA angka di kertas — peluang, nominal, biaya. Jika tidak bisa mengisi ketiganya dengan jujur, jangan lakukan tindakannya. \"Kunjungan karena debiturnya menyebalkan\" bukan strategi; \"kunjungan karena 8% × Rp 50 juta − Rp 120 ribu = +Rp 3,88 juta\" adalah strategi. Dan kebalikannya sama pentingnya: \"jangan telepon lagi karena ekspektasinya negatif\" adalah keputusan profesional, bukan menyerah — write-off tepat waktu adalah kemenangan atas biaya yang sia-sia. Drama (marah-marah, ancaman, kejar-kejaran) adalah pajak yang dibayar oleh mereka yang tidak mau berhitung. Aritmetika tidak pernah emosi — dan justru karena itu ia menang. Satu koreksi terakhir untuk para manajer: \"tegas\" bukan sinonim \"keras\". Kolektor terbaik yang pernah ada bukan yang paling menakutkan — melainkan yang paling cepat menghubungi, paling tepat memilih target, dan paling disiplin berhenti saat ekspektasinya negatif.",
      },
      reference: "Tulis tiga angka sebelum bertindak: peluang, nominal, biaya.",
    },
    {
          id: "gap-r9-tahapan-hukum",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P3-G3)",
          title: "Jalur hukum: somasi → gugatan → eksekusi → PKPU",
          prose: [
            "Langkah eskalasi menyebut hukum/lelang sebagai “senjata terakhir” — tetapi lesson ini belum menguraikan APA tahapan hukum itu, berapa lama, dan berapa yang bisa dipulihkan di tiap tahap. Jalur hukum penagihan di Indonesia berurutan: (1) somasi — surat teguran resmi dari pengacara (cepat, murah, sering cukup untuk debitur yang masih punya reputasi); (2) gugatan perdata — gugat ke pengadilan negeri bila somasi diabaikan; (3) eksekusi — putusan berkekuatan hukum tetap dieksekusi terhadap agunan/aset (lelang); (4) PKPU — bila debitur punya banyak kreditor dan terancam pailit, Penundaan Kewajiban Pembayaran Utang memberi ruang restrukturisasi di bawah pengawasan pengadilan.",
            "Kuncinya: tiap tahap memulihkan sebagian dari SISA — bukan dari total awal. Somasi memulihkan 40% dari Rp100 jt (Rp40 jt); gugatan memulihkan 25% dari sisa Rp60 jt (Rp15 jt); eksekusi 15% dari sisa Rp45 jt (Rp6,75 jt); PKPU 10% dari sisa Rp38,25 jt (Rp3,83 jt). Total pulih Rp65,58 jt dari Rp100 jt — dan itu butuh 14 + 90 + 180 + 365 = 649 hari. Bandingkan dengan reminder DPD 5 hari yang memulihkan 85% dengan biaya Rp40 rb: hukum bukan hanya mahal, melainkan LAMBAT — nilai kini (present value) dari Rp65,58 jt yang datang 649 hari kemudian jauh lebih kecil.",
            "Aturan keputusan: jangan masuk jalur hukum bila (a) tidak ada agunan/aset yang bisa dieksekusi, (b) biaya pengacara melebihi ekspektasi pulih, atau (c) debitur “tidak mau & tidak mampu” tanpa aset — di situ cessie (jual piutang) atau write-off lebih jujur. Jalur hukum adalah untuk debitur “mampu tapi tidak mau” yang punya aset: di situ ancaman eksekusi adalah tuas, bukan sekadar biaya.",
          ],
          formula: String.raw`\text{pulih} = \sum_{\text{tahap}} (\text{rate tahap} \times \text{sisa}) \qquad \text{total} = 14 + 90 + 180 + 365 = 649 \text{ hari}`,
          formulaNote: "Jalur hukum berurutan: somasi (14 hari, 40% dari sisa), gugatan (90 hari, 25%), eksekusi (180 hari, 15%), PKPU (365 hari, 10%). Contoh angka: dari Rp100 jt → pulih Rp65,58 jt dalam 649 hari — lambat dan mahal dibanding reminder DPD awal.",
          tasks: [
            { id: "t1", text: "Hitung `total_hari` keempat tahap hukum" },
            { id: "t2", text: "Hitung `pulih` dari Rp100 jt (tiap tahap % dari SISA) dan cetak keduanya" },
          ],
          expected: "total_hari=649 pulih=65.58",
          hints: [
            "total_hari = 14 + 90 + 180 + 365.",
            "Sisa berkurang tiap tahap: pulih += rate * sisa; sisa -= pulih_tahap.",
          ],
          code: {
            starter: `tahap = [("somasi", 14, 0.40), ("gugatan", 90, 0.25), ("eksekusi", 180, 0.15), ("pkpu", 365, 0.10)]\nsisa = 100.0  # Rp jt\n\n# TULIS KODEMU: total hari + pulih berurutan dari sisa\ntotal_hari = \npulih = \nfor nama, hari, rate in tahap:\n    dapat = \n    pulih += dapat\n    sisa -= dapat\n\nprint(f"total_hari={total_hari} pulih={pulih:.2f}")`,
            lockLines: 4,
            solution: `tahap = [("somasi", 14, 0.40), ("gugatan", 90, 0.25), ("eksekusi", 180, 0.15), ("pkpu", 365, 0.10)]\nsisa = 100.0  # Rp jt\n\n# TULIS KODEMU: total hari + pulih berurutan dari sisa\ntotal_hari = sum(h for _, h, _ in tahap)\npulih = 0.0\nfor nama, hari, rate in tahap:\n    dapat = rate * sisa\n    pulih += dapat\n    sisa -= dapat\n\nprint(f"total_hari={total_hari} pulih={pulih:.2f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "total_hari", value: 649, label: "`total_hari` seharusnya 649", msg: "14+90+180+365 = 649 hari." },
              { kind: "equal", task: "t2", name: "pulih", value: 65.58, tol: 0.01, label: "`pulih` seharusnya 65,58 jt", msg: "40 + 15 + 6,75 + 3,83 = 65,58 (tiap tahap % dari sisa)." },
              { kind: "stdout_matches", task: "t2", pattern: "total_hari=649\\s+pulih=65.58", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Debitur “tidak mau & tidak mampu” tanpa aset, DPD 200+. Jalur mana yang paling jujur?",
              options: [
                { text: "Cessie / write-off — jalur hukum tidak punya aset untuk dieksekusi", why: "Benar: hukum hanya berguna bila ada aset atau tuas reputasi; tanpa keduanya, ia hanya biaya.", correct: true },
                { text: "Gugatan perdata sampai PKPU — selalu ada yang bisa dipulihkan", why: "Salah: tanpa aset, putusan menang pun tidak bisa dieksekusi." },
                { text: "Somasi berulang — murah dan pasti berhasil", why: "Salah: somasi bekerja pada debitur yang peduli reputasi; debitur tanpa aset dan tanpa reputasi mengabaikannya." },
              ],
            },
          ],
          reference: "Somasi → gugatan → eksekusi → PKPU: pulih % dari SISA; total contoh Rp65,58 jt / 649 hari.",
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
        "Cure rate jatuh eksponensial: 85% (DPD 1–30) → 8% (DPD 180+). Miringkan sumber daya ke awal.",
        "Nilai = cure × saldo − biaya. Pilih strategi dengan NILAI TERTINGGI, bukan sekadar positif.",
        "Berhenti saat biaya marjinal > recovery marjinal (titik net maksimum).",
        "Recovery curve = input empiris LGD (CR12).",
        "Collection = operasi data, bukan operasi otot. Nol toleransi pelanggaran etika.",
      ],
      next: { label: "CR23 — Regulasi Indonesia", href: "/v2/learn/cr23-regulasi-indonesia" },
      quiz: [
        {
          q: "Cure rate DPD 1-30 = 85%, DPD 180+ = 8%. Implikasi operasional?",
          options: [
            { text: "Fokus ke DPD 180+ karena paling sulit", why: "Tempat paling sulit = hasil paling kecil." },
            { text: "Miringkan sumber daya ke DPD awal: Rp 1 di awal menyelamatkan 10× lipat dibanding di akhir", why: "Kecepatan = segalanya. Piramida alokasi harus miring ke awal.", correct: true },
            { text: "Tidak ada bedanya", why: "Bedanya 10× lipat." },
            { text: "Tutup divisi collection", why: "Bukan solusinya." },
          ],
        },
        {
          q: "Kapan workout harus dihentikan?",
          options: [
            { text: "Saat recovery mencapai 100%", why: "100% tidak realistis; yang dioptimalkan = net." },
            { text: "Saat biaya marjinal > recovery marjinal (titik net maksimum) — melanjutkan = membakar uang", why: "Recovery kotor 100% tidak realistis; yang dioptimalkan = net.", correct: true },
            { text: "Tidak pernah — kejar terus", why: "Itu membakar uang." },
            { text: "Saat debitur marah", why: "Bukan kriterianya." },
          ],
        },
        {
          q: "Debitur kooperatif tetapi kesulitan bayar (DPD 45). Strategi terbaik?",
          options: [
            { text: "Langsung lelang agunan", why: "Menghancurkan nilai." },
            { text: "Restrukturisasi (penjadwalan ulang/keringanan) — menyelamatkan lebih murah dari melelang, dan debitur kooperatif = aset", why: "Restrukturisasi = win-win.", correct: true },
            { text: "Biarkan saja", why: "Itu membiarkan memburuk." },
            { text: "Naikkan bunga", why: "Memperburuk kemampuannya bayar." },
          ],
        },
        {
          q: "Hubungan collection ke model LGD (CR12)?",
          options: [
            { text: "Tidak ada hubungan", why: "Ada — erat." },
            { text: "Recovery curve dari workout = input empiris LGD; titik berhenti ekonomis menentukan recovery yang dipakai model", why: "LGD bukan angka teori — ia diestimasi dari kurva recovery aktual.", correct: true },
            { text: "LGD menentukan strategi collection", why: "Arahnya terbalik." },
            { text: "Collection menghapus LGD", why: "Collection membentuk data LGD." },
          ],
        },
        {
          q: "Collector vendor ketahuan mengancam debitur (tetapi tagihannya 'berhasil'). Tindakan bank?",
          options: [
            { text: "Biarkan — yang penting tertagih", why: "Pelanggaran = gagal total." },
            { text: "Beri peringatan lisan", why: "Terlalu ringan." },
            { text: "Nol toleransi: hentikan hari itu juga, audit semua kasusnya, lapor proaktif ke OJK, perketat pengawasan vendor — tidak ada target yang layak dibayar dengan pelanggaran", why: "Bank bertanggung jawab atas pihak ketiganya.", correct: true },
            { text: "Ganti vendor diam-diam", why: "Tanpa audit & pelaporan = masalah berulang." },
          ],
        },
      ],
    },
  ],
};
