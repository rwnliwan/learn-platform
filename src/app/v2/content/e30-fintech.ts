import type { V2Lesson } from "../lib/types";

export const e30: V2Lesson = {
  slug: "e30-fintech",
  track: "Financial Markets",
  module: "Teknologi Keuangan",
  title: "E30 — Fintech dan Inovasi Teknologi Keuangan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Warung kopi yang membayar 5,34 persen untuk menerima uangnya sendiri",
      prose: [
        "Warung Kopi Senja menerima pembayaran tiga cara: QRIS, transfer bank, dan kartu. Omzet sebulan Rp150 juta. Di akhir bulan pemiliknya menghitung biaya menerima uang itu: QRIS Rp210 ribu, transfer Rp5,2 juta, kartu Rp2,6 juta. Total Rp8,01 juta — 5,34 persen dari omzet — hanya untuk menerima pembayaran. Yang paling mengejutkan: transfer, kanal yang terasa paling gratis, justru yang termahal.",
        "Akar masalahnya adalah struktur biaya yang berbeda bentuk: QRIS memakai tarif persen dari nilai transaksi, transfer memakai tarif flat per transaksi, kartu memakai persen ditambah flat. Tarif flat Rp6.500 per transfer terasa kecil — sampai dikalikan 800 transaksi kecil senilai Rp50 ribu. Di situ 13 persen dari nilai transfer menguap sebagai biaya.",
        "Lesson ini memetakan lanskap fintech — pembayaran, lending, wealthtech, insurtech, blockchain — lalu menghitung ekonominya dengan angka, bukan slogan. Setelah lesson ini kamu bisa: (1) menjelaskan lima keluarga fintech dan model bisnisnya; (2) menghitung biaya efektif tiap kanal pembayaran dan memilih kanal termurah per profil transaksi; (3) menilai robo-advisor dan P2P lending dari sisi biaya dan risiko; (4) menjelaskan peran regulator dan risiko teknologi yang menyertainya.",
      ],
      tasks: [],
      note: {
        title: "Fintech bukan sekadar aplikasi",
        body: "Fintech adalah perubahan struktur biaya. Bank lama punya cabang, teller, dan proses manual — biayanya tetap dan besar. Fintech mengganti sebagian besar proses itu dengan perangkat lunak — biaya marjinal per transaksi mendekati nol, sehingga tarif bisa jauh lebih rendah untuk transaksi kecil. Siapa pun yang menilai fintech dari tampilannya saja akan melewatkan intinya: siapa yang membayar berapa, dan kenapa.",
      },
      reference: "Biaya menerima uang adalah biaya yang paling sering tidak dihitung — padahal ia memotong margin setiap hari.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca sebuah layanan keuangan digital dan menjawab empat pertanyaan: siapa yang membayar, berapa tarif efektifnya, risiko apa yang dipindahkan, dan siapa yang mengawasinya.",
        "(1) Memetakan lima keluarga fintech — pembayaran, lending, wealthtech, insurtech, dan infrastruktur blockchain — beserta contoh dan model pendapatannya;",
        "(2) Menghitung biaya efektif kanal pembayaran dari tarif persen, tarif flat, dan kombinasinya, lalu memilih kanal termurah untuk profil transaksi tertentu;",
        "(3) Menilai robo-advisor dan P2P lending: keunggulan biaya, asumsi yang dipakai, dan risiko yang tidak terlihat di brosur;",
        "(4) Menjelaskan kerangka regulasi Indonesia — BI untuk sistem pembayaran, OJK untuk lending dan investasi — serta risiko teknologi seperti kebocoran data dan ketergantungan satu kanal.",
      ],
      tasks: [],
    },
    {
      id: "peta-fintech",
      eyebrow: "Langkah 3 · Teori",
      title: "Lima keluarga fintech",
      prose: [
        "Keluarga pertama, pembayaran: QRIS, e-wallet, dan BI-FAST. Model pendapatannya adalah Merchant Discount Rate (MDR) — persen kecil dari tiap transaksi — ditambah biaya layanan. QRIS di Indonesia memakai MDR 0,7 persen untuk merchant reguler: penjual menerima 99,3 persen dari harga, sisanya dibagi ke penerbit, acquirer, dan operator. BI-FAST memangkas biaya transfer antarbank menjadi jauh di bawah biaya kliring lama.",
        "Keluarga kedua, lending: P2P lending dan paylater. Platform mempertemukan pemberi dana dengan peminjam dan mengambil komisi, tanpa memakai neraca sendiri seperti bank. Risikonya: kredit macet ditanggung pemberi dana, sementara platform hanya menanggung risiko reputasi — kecuali ia memberi garansi. Di Indonesia, P2P lending berizin diawasi OJK, dengan batas dan kewajiban transparansi tingkat wanprestasi.",
        "Keluarga ketiga, wealthtech: robo-advisor dan agregator reksa dana. Robo-advisor membangun portofolio dari ETF atau reksa dana indeks dengan fee sekitar 0,2 sampai 0,5 persen per tahun — jauh di bawah fee manajer aktif 1,5 sampai 2 persen — dan melakukan rebalancing otomatis. Kelemahannya: ia hanya sebagus asumsi profil risikonya; kuesioner 5 menit yang salah mengisi bisa menempatkan investor konservatif di portofolio agresif.",
        "Keluarga keempat, insurtech: asuransi mikro dan berbasis pemakaian — premi dihitung dari perilaku nyata, bukan dari tabel statis. Keluarga kelima, infrastruktur: blockchain dan aset digital, open banking lewat API, serta mata uang digital bank sentral. CBDC adalah uang bank sentral dalam bentuk digital — berbeda dari kripto, yang tidak dijamin siapa pun.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira fintech selalu lebih murah. Fintech lebih murah untuk transaksi yang cocok dengan struktur biayanya. Transfer flat Rp6.500 murah untuk transaksi Rp10 juta (0,065 persen) tetapi mahal untuk transaksi Rp50 ribu (13 persen). Tidak ada kanal yang termurah untuk semua ukuran — ada kanal yang termurah untuk tiap ukuran.",
      },
      reference: "Lima keluarga: bayar, pinjam, invest, lindungi, dan infrastruktur yang menopang keempatnya.",
    },
    {
      id: "ekonomi-kanal",
      eyebrow: "Langkah 4 · Teori",
      title: "Ekonomi kanal: persen, flat, dan kombinasi",
      prose: [
        "Tiga bentuk tarif menentukan segalanya. Tarif persen: biaya sama dengan tarif dikali nilai transaksi — cocok untuk transaksi besar, mahal untuk yang kecil bila tarifnya tinggi. Tarif flat: biaya sama per transaksi apa pun nilainya — murah untuk transaksi besar, mematikan untuk transaksi kecil. Kombinasi persen ditambah flat: biaya sama dengan persen dikali nilai ditambah flat per transaksi.",
        "Biaya efektif sama dengan total biaya dibagi total volume kanal itu. Di cerita pembuka: QRIS 0,70 persen, transfer 13,00 persen, kartu 3,25 persen. Transfer menjadi termahal bukan karena tarifnya besar, melainkan karena bentuknya flat dan tiketnya kecil. Rumus cepatnya: tarif flat dibagi rata-rata nilai transaksi sama dengan beban persennya. Rp6.500 dibagi Rp50 ribu sama dengan 13 persen; Rp6.500 dibagi Rp10 juta sama dengan 0,065 persen.",
        "Keputusan praktisnya: arahkan transaksi kecil ke kanal persen (QRIS), transaksi besar ke kanal flat (transfer), dan transaksi menengah ke kanal kombinasi hanya bila nilai tambahnya — misal cicilan kartu atau poin — melebihi selisih biayanya. Dan selalu hitung biaya efektif per kanal tiap bulan: tarif berubah, perilaku pelanggan berubah, dan kanal termurah tahun lalu belum tentu termurah tahun ini.",
      ],
      tasks: [],
      formula: String.raw`\text{Biaya efektif} = \frac{\text{Total biaya kanal}}{\text{Total volume kanal}}, \quad \text{Beban flat} = \frac{\text{Tarif flat}}{\text{Rata-rata nilai transaksi}}`,
      formulaNote: "Biaya efektif = total biaya dibagi total volume kanal itu. Beban flat = tarif flat dibagi rata-rata nilai transaksi — makin kecil tiketnya, makin besar bebannya.",
      reference: "Flat dibagi tiket sama dengan beban persen. Itulah satu rumus yang menjelaskan kenapa transfer kecil begitu mahal.",
    },
    {
      id: "lab-biaya-kanal",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung biaya tiga kanal pembayaran",
      prose: [
        "Hitung biaya Warung Kopi Senja dari data sebulan: QRIS 1.200 transaksi kali Rp25.000 dengan MDR 0,7 persen; transfer 800 transaksi kali Rp50.000 dengan tarif flat Rp6.500; kartu 400 transaksi kali Rp200.000 dengan tarif 2 persen ditambah Rp2.500 per transaksi.",
        "Hitung di kepala dulu: QRIS 30 juta kali 0,7 persen sama dengan Rp210 ribu. Transfer 800 kali Rp6.500 sama dengan Rp5,2 juta. Kartu: 2 persen dari Rp80 juta sama dengan Rp1,6 juta, ditambah 400 kali Rp2.500 sama dengan Rp1 juta — total Rp2,6 juta. Total volume Rp150 juta, total biaya Rp8,01 juta, biaya efektif 5,34 persen.",
        "Setelah lolos, coba ubah satu angka: naikkan rata-rata tiket transfer menjadi Rp500 ribu (volume transfer tetap 800 transaksi menjadi Rp400 juta) dan lihat beban persen transfer jatuh dari 13 persen menjadi 1,3 persen. Bentuk tarif tidak berubah — yang berubah adalah kecocokannya dengan ukuran transaksi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fee_qris`, `fee_transfer`, `fee_kartu` dari data di kode" },
        { id: "t2", text: "Hitung `total_volume`, `total_fee`, dan `efektif_persen`, lalu cetak ketiganya" },
      ],
      expected: "total_volume=150000000  total_fee=8010000  efektif=5.34 persen",
      hints: [
        "QRIS: volume_qris = 1200 * 25000; fee = volume * 0.007.",
        "Transfer: fee = 800 * 6500 — flat, tidak tergantung nilai transaksi.",
        "Kartu: fee = volume_kartu * 0.02 + 400 * 2500.",
        "Efektif = total_fee / total_volume * 100; format dengan 2 desimal.",
      ],
      code: {
        starter: `# Biaya tiga kanal pembayaran Warung Kopi Senja (sebulan)\nqris_n, qris_tiket = 1200, 25000\ntrf_n, trf_tiket = 800, 50000\nkartu_n, kartu_tiket = 400, 200000\n\n# TULIS KODEMU\nfee_qris = \nfee_transfer = \nfee_kartu = \ntotal_volume = \ntotal_fee = \nefektif_persen = \n\nprint(f"total_volume={total_volume:.0f}  total_fee={total_fee:.0f}  efektif={efektif_persen:.2f} persen")`,
        lockLines: 4,
        solution: `# Biaya tiga kanal pembayaran Warung Kopi Senja (sebulan)\nqris_n, qris_tiket = 1200, 25000\ntrf_n, trf_tiket = 800, 50000\nkartu_n, kartu_tiket = 400, 200000\n\n# TULIS KODEMU\nfee_qris = qris_n * qris_tiket * 0.007\nfee_transfer = trf_n * 6500\nfee_kartu = kartu_n * kartu_tiket * 0.02 + kartu_n * 2500\ntotal_volume = qris_n * qris_tiket + trf_n * trf_tiket + kartu_n * kartu_tiket\ntotal_fee = fee_qris + fee_transfer + fee_kartu\nefektif_persen = total_fee / total_volume * 100\n\nprint(f"total_volume={total_volume:.0f}  total_fee={total_fee:.0f}  efektif={efektif_persen:.2f} persen")`,
        checks: [
          { kind: "equal", task: "t1", name: "fee_qris", value: 210000, tol: 1, label: "`fee_qris` = 210.000", msg: "1.200 × 25.000 × 0,7 persen = 210.000." },
          { kind: "equal", task: "t1", name: "fee_transfer", value: 5200000, tol: 1, label: "`fee_transfer` = 5.200.000", msg: "800 × 6.500 = 5.200.000 — flat, tidak tergantung nilai transaksi." },
          { kind: "equal", task: "t1", name: "fee_kartu", value: 2600000, tol: 1, label: "`fee_kartu` = 2.600.000", msg: "2 persen dari 80 juta = 1,6 juta, ditambah 400 × 2.500 = 1 juta." },
          { kind: "equal", task: "t2", name: "total_fee", value: 8010000, tol: 1, label: "`total_fee` = 8.010.000", msg: "210.000 + 5.200.000 + 2.600.000 = 8.010.000." },
          { kind: "equal", task: "t2", name: "efektif_persen", value: 5.34, tol: 0.01, label: "`efektif_persen` = 5,34", msg: "8.010.000 / 150.000.000 = 5,34 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "total_fee=8010000", label: "`print` menampilkan total_fee 8010000", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Total Rp8,01 juta dari Rp150 juta = 5,34 persen. Transfer menyumbang 65 persen dari seluruh biaya.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: memindahkan transfer ke QRIS",
      prose: [
        "Pemilik warung mempertimbangkan memindahkan 800 transaksi transfer ke QRIS: pelanggan yang sama, nilai yang sama (Rp40 juta), hanya kanalnya berubah. Biaya transfer Rp5,2 juta menjadi biaya QRIS 0,7 persen dari Rp40 juta sama dengan Rp280 ribu. Hemat Rp4,92 juta per bulan — Rp59 juta per tahun.",
        "Total biaya baru: Rp210 ribu (QRIS lama) ditambah Rp280 ribu (QRIS pindahan) ditambah Rp2,6 juta (kartu) sama dengan Rp3,09 juta. Biaya efektif turun dari 5,34 persen menjadi 2,06 persen. Keputusan ini tampak mudah — tetapi ada tiga risiko yang harus diperiksa dulu.",
        "Pertama, ketergantungan satu kanal: bila QRIS gangguan seharian, warung kehilangan kanal pembayaran terbesarnya — simpan transfer sebagai cadangan. Kedua, perilaku pelanggan: sebagian pelanggan transfer karena tidak memakai e-wallet; memaksa pindah bisa kehilangan mereka. Ketiga, biaya tersembunyi: QRIS masuk ke rekening keesokan hari untuk sebagian bank — arus kas harian berubah. Hemat Rp4,92 juta itu nyata, tetapi keputusan yang baik menimbang ketiganya sebelum mengeksekusi.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Hemat Rp4,92 juta per bulan sama dengan 5.200.000 dikurangi 280.000. Biaya efektif baru 2,06 persen sama dengan 3.090.000 dibagi 150.000.000. Rekomendasi: pindahkan secara bertahap — mulai dari pelanggan yang sudah memakai QRIS — dan pertahankan transfer sebagai kanal cadangan, bukan dihapus total.",
      },
      reference: "Hemat 4,92 juta per bulan. Tetapi kanal cadangan tetap perlu — satu kanal berarti satu titik gagal.",
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
        "Fintech adalah perubahan struktur biaya: lima keluarga — pembayaran, lending, wealthtech, insurtech, dan infrastruktur.",
        "Biaya efektif = total biaya dibagi total volume kanal. Tarif flat dibagi rata-rata tiket = beban persennya.",
        "Lab: total biaya Rp8,01 juta dari volume Rp150 juta = 5,34 persen; transfer termahal (13 persen) karena flat dikali tiket kecil.",
        "Pindah transfer ke QRIS menghemat Rp4,92 juta per bulan; biaya efektif turun menjadi 2,06 persen — dengan risiko ketergantungan satu kanal.",
        "Regulator Indonesia: BI untuk sistem pembayaran, OJK untuk lending dan investasi — dan tarif berubah, jadi hitung ulang tiap bulan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Transfer 800 kali Rp50.000 dengan tarif flat Rp6.500. Berapa beban persennya, dan kenapa begitu besar?",
          options: [
            { text: "0,065 persen — tarif flat selalu murah", why: "Salah: 0,065 persen adalah beban bila tiketnya Rp10 juta. Di sini tiketnya Rp50 ribu." },
            { text: "13 persen — Rp6.500 dibagi Rp50.000; tarif flat membebani tiket kecil paling berat", why: "Tepat: 6.500 / 50.000 = 13 persen. Flat tidak peduli nilai transaksi — makin kecil tiketnya, makin besar bebannya.", correct: true },
            { text: "0,7 persen — sama dengan MDR QRIS", why: "Salah: 0,7 persen adalah tarif QRIS, bukan transfer. Transfer memakai flat, bukan persen." },
            { text: "3,25 persen — sama dengan kartu", why: "Salah: 3,25 persen adalah biaya efektif kartu. Transfer dihitung dari flat, bukan dari persen." },
          ],
        },
        {
          q: "Manakah pernyataan yang paling tepat tentang model bisnis P2P lending?",
          options: [
            { text: "Platform menanggung seluruh risiko kredit macet seperti bank", why: "Salah: platform umumnya tidak memakai neraca sendiri — risiko kredit ditanggung pemberi dana." },
            { text: "Platform mempertemukan pemberi dana dan peminjam dengan komisi; risiko kredit macet ditanggung pemberi dana", why: "Tepat: itulah beda utamanya dengan bank. Karena itu transparansi tingkat wanprestasi menjadi kewajiban regulator.", correct: true },
            { text: "P2P lending tidak diawasi regulator di Indonesia", why: "Salah: P2P lending berizin diawasi OJK, dengan kewajiban transparansi dan batasan." },
            { text: "P2P lending selalu lebih murah dari bank untuk peminjam", why: "Salah: tanpa agunan dan tanpa sejarah kredit yang kuat, bunga P2P bisa jauh lebih tinggi dari kredit bank." },
          ],
        },
        {
          q: "Robo-advisor mengenakan fee 0,3 persen per tahun, manajer aktif 1,8 persen. Apa kelemahan robo-advisor yang paling penting dipahami?",
          options: [
            { text: "Ia tidak bisa melakukan rebalancing otomatis", why: "Salah: rebalancing otomatis justru keunggulan robo-advisor." },
            { text: "Ia hanya sebagus asumsi profil risikonya — kuesioner yang salah mengisi menempatkan investor di portofolio yang salah", why: "Tepat: fee murah tidak menolong bila alokasinya salah sejak awal. Profil risiko adalah fondasi seluruh portofolio.", correct: true },
            { text: "Ia tidak memakai ETF atau reksa dana indeks", why: "Salah: robo-advisor justru umumnya membangun portofolio dari ETF atau reksa dana indeks berbiaya rendah." },
            { text: "Ia selalu mengalahkan manajer aktif dalam return", why: "Salah: tidak ada jaminan seperti itu — keunggulannya adalah biaya rendah dan disiplin, bukan return yang pasti lebih tinggi." },
          ],
        },
        {
          q: "Warung memindahkan 800 transaksi transfer (Rp40 juta) ke QRIS. Berapa penghematan per bulan?",
          options: [
            { text: "Rp280 ribu", why: "Salah: Rp280 ribu adalah biaya QRIS yang baru, bukan penghematannya." },
            { text: "Rp5,2 juta", why: "Salah: Rp5,2 juta adalah biaya transfer yang lama — penghematan adalah selisihnya dengan biaya QRIS." },
            { text: "Rp4,92 juta — 5,2 juta dikurangi 280 ribu", why: "Tepat: biaya lama 5.200.000 dikurangi biaya baru 280.000 sama dengan 4.920.000 per bulan.", correct: true },
            { text: "Rp8,01 juta", why: "Salah: Rp8,01 juta adalah total biaya semua kanal sebelum perubahan, bukan penghematannya." },
          ],
        },
        {
          q: "Apa perbedaan mendasar CBDC dengan aset kripto seperti Bitcoin?",
          options: [
            { text: "Tidak ada — keduanya adalah uang digital yang sama", why: "Salah: keduanya berbeda dalam penjamin dan penerbit." },
            { text: "CBDC adalah uang bank sentral dalam bentuk digital dan dijamin bank sentral; kripto tidak dijamin siapa pun", why: "Tepat: CBDC adalah kewajiban bank sentral, seperti uang tunai. Kripto nilainya murni dari pasar.", correct: true },
            { text: "CBDC tidak bisa dipakai untuk pembayaran", why: "Salah: CBDC dirancang justru sebagai alat pembayaran digital resmi." },
            { text: "Kripto diawasi BI, CBDC diawasi OJK", why: "Salah: kebalikannya — sistem pembayaran termasuk CBDC adalah wilayah BI; kripto sebagai aset diperdagangkan di bawah pengaturan perdagangan aset kripto." },
          ],
        },
      ],
    },
  ],
};
