import type { V2Lesson } from "../lib/types";

export const cr1: V2Lesson = {
  slug: "cr1-produk-kredit",
  track: "Credit Risk",
  module: "Pondasi Kredit",
  title: "CR1 — Produk Kredit, 5C, dan Siklusnya",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua nasabah, dua nasib",
      prose: [
        "Senin pagi di Bank Nusantara, cabang Surabaya. Dua pengajuan kredit masuk ke meja analis Rina — keduanya Rp 500 juta. Nasabah pertama: Budi, karyawan BUMN, gaji Rp 25 juta/bulan, mengajukan KPR tenor 15 tahun untuk rumah di Sidoarjo. Nasabah kedua: Pak Haji Slamet, pedagang grosir, omzet Rp 200 juta/bulan, mengajukan KMK (Kredit Modal Kerja) tenor 1 tahun untuk stok dagangan menjelang Lebaran.",
        "Angka pinjamannya sama persis. Tapi Rina memperlakukan keduanya seperti dua spesies berbeda: dokumen yang diminta beda, cara menilai kemampuan bayar beda, agunannya beda, bahkan definisi \"macet\"-nya beda. Setahun kemudian: KPR Budi lancar jaya. KMK Pak Haji macet di bulan ke-8 — dagangannya sepi, stok menumpuk.",
        "Rina tidak kaget. Risiko KMK memang begitu, katanya — makanya bunganya lebih tinggi dari KPR. Lesson ini adalah peta wilayahnya: \"kredit Rp 500 juta\" bukan satu hal yang sama. Produk menentukan cara menilai, cara memonitor, cara menagih, bahkan cara menghitung kerugiannya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Analis senior bertanya dulu: ini produk apa? Model PD yang dilatih dari data KPR lalu dipakai menilai KMK bukan sekadar kurang akurat — melainkan salah spesies. KPR dinilai dari stabilitas penghasilan; KMK dari siklus dagang; kartu kredit dari perilaku.",
      },
      reference: "Produk = kemasan pinjaman: kepada siapa, untuk apa, berapa lama, dengan jaminan apa.",
    },
    {
      id: "produk",
      eyebrow: "Langkah 2 · Produk",
      title: "Empat keluarga besar kredit",
      prose: [
        "Pertama, retail/konsumsi: KPR, KKB, multiguna, KTA. Ticket kecil–menengah, tenor panjang (KPR sampai 20–30 tahun), agunan jelas, jumlah debitur sangat banyak. Seperti kawanan semut — satu ekor mati tidak terasa, tapi kalau satu koloni sakit (PHK massal, pandemi), efeknya sistemik. Risiko dinilai secara statistik, bukan satu per satu. Porsi terbesar portofolio bank umum Indonesia: sekitar 38%.",
        "Kedua, UKM: KUR, KMK, KI. Ticket menengah, laporan keuangan sering tidak rapi, arus kas musiman. Analis UKM harus jago membaca usaha dari kunjungan lapangan, bukan cuma dari kertas. Di Indonesia segmen ini didorong pemerintah lewat KUR bersubsidi — volumenya besar, risikonya juga. Porsi sekitar 27%, NPL sekitar 4,8%.",
        "Ketiga, korporasi: kredit sindikasi, bilateral, trade finance. Ticket raksasa (puluhan–ratusan miliar), dianalisis per debitur oleh tim khusus. Seperti gajah di ruang tamu — satu saja jatuh, seisi rumah goyang. Porsi sekitar 25%, NPL sekitar 3,2%.",
        "Keempat, kartu kredit: tanpa agunan, revolving, bunga tertinggi. Ticket kecil, jumlah kartu jutaan. Seperti cabai rawit — kecil tapi pedas: NPL historis sekitar 9,5%, jauh di atas KPR (sekitar 2,1%). Porsi hanya sekitar 10%, tetapi kontribusinya ke NPL tidak proporsional.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Kredit dengan agunan besar pasti aman.\" Agunan hanya mengurangi kerugian saat sudah macet (LGD — materi CR12), bukan mengurangi peluang macetnya (PD — materi CR3/CR10). Rumah Rp 1 M sebagai agunan tidak mencegah debitur kehilangan pekerjaan.",
      },
      reference: "Porsi vs NPL segmen: KPR 38%/2,1% · UKM 27%/4,8% · Korporasi 25%/3,2% · Kartu 10%/9,5%.",
    },
    {
      id: "lima-c",
      eyebrow: "Langkah 3 · 5C",
      title: "Capacity adalah raja",
      prose: [
        "Lima lensa menilai calon debitur, masih dipakai sampai scorecard modern (CR7). Character: kemauan bayar — riwayat kredit (cek SLIK OJK), reputasi, kejujuran data. Debitur yang bisa bayar tapi tidak mau = mimpi buruk collection. Capacity: kemampuan bayar dari arus kas — raja dari semua C, diukur dengan DSCR.",
        "Capital: modal sendiri yang dipertaruhkan debitur (\"skin in the game\"). DP 30% untuk KPR bukan sekadar aturan — debitur yang sudah setor Rp 300 jt dari kantongnya sendiri akan berjuang lebih keras. Collateral: agunan sebagai sabuk pengaman kedua. Aturan emas: kredit diberikan karena capacity, bukan karena collateral. Conditions: kondisi ekonomi di sekitar debitur — musim, harga komoditas, daya beli. Orang yang sama di cuaca berbeda = risiko berbeda.",
        "Contoh pengerjaan: Warung Bu Ani — arus kas operasi Rp 120 jt/thn, cicilan bank Rp 80 jt/thn, cicilan motor Rp 20 jt/thn. Total kewajiban = Rp 100 jt/thn. DSCR = 120/100 = 1,2x. Interpretasi: lolos tipis. Buffer cuma 20% — kalau omzet turun 20%, DSCR jatuh ke sekitar 0,96x = tidak sanggup bayar. Analis yang baik menulis sensitivitas ini di memo: \"sensitif terhadap gangguan omzet\".",
      ],
      formula: String.raw`\text{DSCR} = \frac{\text{Arus Kas Operasi}}{\text{Kewajiban Utang (cicilan pokok + bunga)}}`,
      formulaNote: "Pembilang = kas yang dihasilkan per periode (bukan laba akuntansi). Penyebut = total cicilan pokok + bunga yang jatuh tempo. DSCR 1,25x = tiap Rp 1 cicilan didukung Rp 1,25 arus kas.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"5C itu checklist formalitas — yang penting skor kreditnya lolos.\" 5C adalah kerangka berpikir, bukan formulir. Scorecard modern pada dasarnya adalah 5C yang dikuantifikasi: character → riwayat SLIK, capacity → rasio DSR/DBR, capital → LTV, collateral → coverage agunan, conditions → variabel makro.",
      },
      reference: "Urutan prioritas: Character × Capacity = mesin pembayaran; Capital + Collateral = rem darurat; Conditions = cuaca.",
    },
    {
      id: "siklus",
      eyebrow: "Langkah 4 · Siklus",
      title: "Macet lahir di origination, ketahuan di collection",
      prose: [
        "Siklus kredit punya enam tahap. Origination: pengajuan dan akuisisi — risikonya adverse selection, yang paling semangat mengajukan sering yang paling butuh (baca: paling berisiko). Underwriting: analisis dan keputusan (5C, scorecard, komite kredit) — gerbang terpenting; 80% nasib kredit ditentukan di sini. Disbursement: pencairan — risikonya dana tidak dipakai sesuai tujuan. Monitoring: pemantauan berkala — di sinilah early warning bekerja (CR9). Collection: penagihan saat menunggak — tujuannya menyelamatkan, bukan menghukum. Recovery: penyelamatan terakhir — restrukturisasi, lelang agunan, write-off.",
        "Kredit macet lahir di origination, baru ketahuan di collection. Seperti penyakit — gejalanya muncul belakangan, tapi infeksinya sejak awal. Analis menghabiskan energi di hulu (underwriting yang tajam), bukan memadamkan api di hilir. Dari 100 aplikan, hanya sekitar 45 yang cair — underwriting menolak 55. Ini normal dan sehat: bank yang meloloskan 95 dari 100 aplikan bukan murah hati, melainkan 2 tahun lagi NPL-nya berisiko meledak. Penolakan adalah produk samping yang diinginkan dari underwriting yang baik.",
      ],
      tasks: [],
      reference: "Enam tahap: origination → underwriting → disbursement → monitoring → collection → recovery.",
    },
    {
      id: "lab-dscr",
      eyebrow: "Langkah 5 · Lab DSCR",
      title: "Napas keuangan debitur",
      prose: [
        "DSCR adalah denyut nadi capacity. Aturan putus: di bawah 1,0x = arus kas tidak menutup cicilan, berhenti — apapun agunannya. Di atas 1,25x = ada buffer 25%, layak. Di antaranya = marginal, lolos tapi waspadai guncangan.",
        "Tugasmu: hitung DSCR debitur dengan arus kas operasi Rp 120 jt/thn dan kewajiban Rp 100 jt/thn, lalu tentukan statusnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dscr` dari `arus_kas_operasi` dan `kewajiban_utang`" },
        { id: "t2", text: "Tentukan `status`: \"LAYAK\" jika ≥1.25, \"MARGINAL\" jika ≥1.0, selain itu \"TOLAK\"" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "dscr=1.20 status=MARGINAL",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Pembilang DSCR adalah arus kas operasi, bukan laba akuntansi. Laba bisa tinggi sementara kas macet di piutang — debitur membayar cicilan dengan kas, bukan dengan laba di kertas.",
      },
      hints: [
        "DSCR = arus kas dibagi kewajiban utang.",
        "Status memakai if/elif/else bertingkat dari ambang tertinggi.",
        "dscr = arus_kas_operasi / kewajiban_utang",
      ],
      code: {
        starter: `arus_kas_operasi = 120  # juta Rp per tahun\nkewajiban_utang = 100   # cicilan pokok + bunga per tahun\n\n# TULIS KODEMU: hitung DSCR dan tentukan status\ndscr = \nstatus = \n\nprint(f"dscr={dscr:.2f} status={status}")`,
        lockLines: 2,
        solution: `arus_kas_operasi = 120  # juta Rp per tahun\nkewajiban_utang = 100   # cicilan pokok + bunga per tahun\n\n# TULIS KODEMU: hitung DSCR dan tentukan status\ndscr = arus_kas_operasi / kewajiban_utang\nstatus = "LAYAK" if dscr >= 1.25 else ("MARGINAL" if dscr >= 1.0 else "TOLAK")\n\nprint(f"dscr={dscr:.2f} status={status}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dscr", value: 1.2, tol: 1e-9, label: "`dscr` seharusnya 1.2", msg: "120 / 100 = 1.2. Cek pembagianmu." },
          { kind: "equal", task: "t2", name: "status", value: "MARGINAL", label: "`status` seharusnya MARGINAL", msg: "1.2 di bawah 1.25 tapi di atas 1.0 → MARGINAL." },
          { kind: "stdout_matches", task: "t3", pattern: "dscr=1\\.20\\s+status=MARGINAL", label: "`print` menampilkan dscr dan status", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Ambang: ≥1.25x LAYAK · ≥1.0x MARGINAL · <1.0x TOLAK.",
    },
    {
      id: "lab-npl",
      eyebrow: "Langkah 6 · Lab NPL tertimbang",
      title: "Segmen kecil yang pedas",
      prose: [
        "NPL bank bukan rata-rata biasa — melainkan rata-rata tertimbang porsi kredit. Portofolio Rp 1.000 M: KPR 38% dengan NPL 2,1%, UKM 27% dengan 4,8%, Korporasi 25% dengan 3,2%, Kartu 10% dengan 9,5%.",
        "Tugasmu: hitung NPL portofolio, lalu hitung kontribusi segmen Kartu terhadap total NPL (dalam persen). Lihat betapa tidak proporsionalnya segmen 10% itu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `npl_portofolio` = jumlah (porsi × npl) semua segmen" },
        { id: "t2", text: "Hitung `kontribusi_kartu` = (porsi × npl Kartu) / npl_portofolio × 100" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "npl=3.84 kontribusi_kartu=24.7",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kartu kredit hanya 10% porsi tetapi menyumbang sekitar seperempat total NPL. Inilah mengapa bank mematok limit eksposur per segmen — agregat 3,84% menyembunyikan konsentrasi risiko.",
      },
      hints: [
        "Kalikan tiap porsi dengan npl-nya, lalu jumlahkan.",
        "Kontribusi = bagian Kartu dibagi total, kali 100.",
        "npl_portofolio = sum(porsi[s]*npl[s] for s in porsi)",
      ],
      code: {
        starter: `porsi = {"KPR": 0.38, "UKM": 0.27, "Korporasi": 0.25, "Kartu": 0.10}\nnpl   = {"KPR": 2.1, "UKM": 4.8, "Korporasi": 3.2, "Kartu": 9.5}\n\n# TULIS KODEMU\nnpl_portofolio = \nkontribusi_kartu = \n\nprint(f"npl={npl_portofolio:.2f} kontribusi_kartu={kontribusi_kartu:.1f}")`,
        lockLines: 2,
        solution: `porsi = {"KPR": 0.38, "UKM": 0.27, "Korporasi": 0.25, "Kartu": 0.10}\nnpl   = {"KPR": 2.1, "UKM": 4.8, "Korporasi": 3.2, "Kartu": 9.5}\n\n# TULIS KODEMU\nnpl_portofolio = sum(porsi[s]*npl[s] for s in porsi)\nkontribusi_kartu = porsi["Kartu"]*npl["Kartu"]/npl_portofolio*100\n\nprint(f"npl={npl_portofolio:.2f} kontribusi_kartu={kontribusi_kartu:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "npl_portofolio", value: 3.844, tol: 0.01, label: "`npl_portofolio` sekitar 3.84", msg: "0.38×2.1 + 0.27×4.8 + 0.25×3.2 + 0.10×9.5 = 3.844." },
          { kind: "equal", task: "t2", name: "kontribusi_kartu", value: 24.7, tol: 0.2, label: "`kontribusi_kartu` sekitar 24.7", msg: "0.95 / 3.844 × 100 ≈ 24.7." },
          { kind: "stdout_matches", task: "t3", pattern: "npl=3\\.84\\s+kontribusi_kartu=24\\.7", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "NPL portofolio = Σ(porsi × npl segmen).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: produk apa untuk nasabah apa",
      prose: [
        "Skenario 1 — Karyawan tetap berpenghasilan stabil yang ingin beli rumah. → KPR tenor 10–20 tahun. Alasan: arus kasnya predictable seperti gaji bulanan; agunan jelas; tenor panjang menekan cicilan. Contoh nyata: Budi, karyawan BUMN, KPR 15 tahun — lancar jaya.",
        "Skenario 2 — Pedagang dengan omzet musiman yang butuh stok menjelang Lebaran. → KMK revolving tenor 1 tahun. Alasan: ikuti irama kas — stok habis 3 bulan, kredit lunas 12 bulan. Memberinya KPR 15 tahun untuk modal kerja = meminjamkan payung saat kemarau. Contoh nyata: Pak Haji Slamet, KMK Rp 500 juta — risikonya memang lebih tinggi, makanya bunganya lebih mahal.",
        "Skenario 3 — Butuh dana cepat tanpa agunan. → KTA, hanya bila capacity teruji (DSCR di atas 1,25x). Alasan: tanpa jaring pengaman agunan, satu-satunya pegangan adalah karakter + arus kas. Taruhan paling murni pada manusianya.",
        "Skenario 4 — Korporasi butuh Rp 200 miliar. → Kredit bilateral/sindikasi dengan analisis per debitur. Alasan: satu gajah jatuh menggoyang neraca — tidak bisa dinilai statistik seperti kawanan semut ritel. Tim khusus, bukan scorecard massal.",
        "Skenario 5 — Usaha kecil yang laporan keuangannya tidak rapi. → KUR/KMK dengan kunjungan lapangan. Alasan: kertasnya tidak bercerita — analis harus membaca usaha dari gudang dan kasirnya, bukan dari Excel. Contoh nyata: segmen UKM 27% portofolio bank umum, NPL 4,8%.",
        "Aturan praktis 10 detik: cocokkan produk dengan irama arus kas — penghasilan tetap = tenor panjang; musiman = revolving pendek; tanpa agunan = uji capacity keras; ticket raksasa = analisis per nama.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memberi KMK tenor 3 tahun untuk stok dagangan Lebaran: stoknya habis dalam 3 bulan, cicilannya jalan 3 tahun — debitur membayar bunga untuk uang yang sudah tidak bekerja. Atau sebaliknya: membiayai pembelian mesin 10 tahun dengan KMK 1 tahun yang harus di-roll tiap tahun — sekali bank menolak perpanjangan, usahanya berhenti.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "KPR vs KMK di Bank Nusantara",
      prose: [
        "Data setahun terakhir Bank Nusantara (cabang Surabaya). KPR: 2.000 debitur, outstanding Rp 800 M, NPL 2,1%, rata-rata LTV 75%, tenor rata-rata 14 tahun. KMK: 500 debitur, outstanding Rp 200 M, NPL 6,5%, 60% tanpa agunan tambahan selain persediaan, tenor rata-rata 11 bulan.",
        "Tugasmu: (a) hitung NPL portofolio gabungan dan porsi kontribusi KMK terhadap total NPL. (b) Direksi ingin ekspansi KMK 2× lipat karena margin bunganya lebih tinggi. Sebagai analis, dua kekhawatiran utamamu: konsentrasi risiko — NPL gabungan akan naik ke (800×2,1% + 400×6,5%)/1200 = 3,57%, mendekati ambang perhatian OJK; dan capacity musiman — KMK sensitif terhadap siklus dagang, ekspansi 2× tanpa memperkuat monitoring = menabung NPL. Data yang kamu minta sebelum setuju: vintage curve KMK per kohort pencairan (CR6), distribusi DSCR debitur KMK, dan hasil stress test bila omzet turun 20% (CR16).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `npl_gabungan` (%, tertimbang outstanding)" },
        { id: "t2", text: "Hitung `porsi_kmk` (%, kontribusi KMK thd total NPL Rp)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "npl_gabungan=2.98 porsi_kmk=43.6",
      hints: [
        "NPL gabungan = (800×2,1 + 200×6,5) / 1000.",
        "NPL Rp tiap segmen = outstanding × npl / 100.",
        "porsi_kmk = npl_rp_kmk / npl_rp_total × 100",
      ],
      code: {
        starter: `kpr_out, kpr_npl = 800, 2.1   # Rp M\nkmk_out, kmk_npl = 200, 6.5   # Rp M\n\n# TULIS KODEMU\nnpl_gabungan = \nporsi_kmk = \n\nprint(f"npl_gabungan={npl_gabungan:.2f} porsi_kmk={porsi_kmk:.1f}")`,
        lockLines: 2,
        solution: `kpr_out, kpr_npl = 800, 2.1   # Rp M\nkmk_out, kmk_npl = 200, 6.5   # Rp M\n\n# TULIS KODEMU\nnpl_gabungan = (kpr_out*kpr_npl + kmk_out*kmk_npl) / (kpr_out + kmk_out)\ntotal_rp = kpr_out*kpr_npl/100 + kmk_out*kmk_npl/100\nporsi_kmk = kmk_out*kmk_npl/100 / total_rp * 100\n\nprint(f"npl_gabungan={npl_gabungan:.2f} porsi_kmk={porsi_kmk:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "npl_gabungan", value: 2.98, tol: 0.01, label: "`npl_gabungan` seharusnya 2.98", msg: "(800×2.1 + 200×6.5)/1000 = 2.98." },
          { kind: "equal", task: "t2", name: "porsi_kmk", value: 43.6, tol: 0.2, label: "`porsi_kmk` sekitar 43.6", msg: "13 / 29.8 × 100 ≈ 43.6." },
          { kind: "stdout_matches", task: "t3", pattern: "npl_gabungan=2\\.98\\s+porsi_kmk=43\\.6", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "KMK hanya 20% porsi tetapi menyumbang ~44% total NPL.",
    },
    {
      id: "intuisi-produk",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Produk adalah bentuk taruhan",
      prose: [
        "Setiap produk kredit pada dasarnya adalah taruhan atas arus kas masa depan — dan struktur produk (tenor, pola angsuran, agunan) adalah BENTUK taruhan itu. KPR 20 tahun bertaruh pada stabilitas penghasilan jangka panjang; KMK revolving bertaruh pada perputaran modal kerja; KTA bertaruh pada karakter tanpa jaring pengaman agunan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: pinjamkan mengikuti irama kas, bukan kalender bank",
        body: "Kesalahan paling mahal dalam memilih produk bukan salah nominal — melainkan salah BENTUK. Pedagang dengan kas berombak (panen raya vs paceklik) yang diberi kredit angsuran bulanan tetap akan tersedak di bulan sepi, bukan karena usahanya rugi, melainkan karena irama bayarnya melawan irama kasnya. Ia butuh KMK revolving yang mengikuti musim, bukan angsuran yang mengikuti kalender bank. Heuristiknya: sebelum memilih produk, gambar dulu kurva arus kas debitur selama setahun — lalu pilih produk yang lembahnya tidak lebih dalam dari lembah kasnya. Dan sadari satu hal yang jarang diajarkan: fitur produk adalah kontrol risiko yang menyamar. Angsuran berkala = sistem peringatan dini (telat 1× ketahuan bulan itu juga, bukan 3 tahun kemudian). Agunan = peredam LGD. Covenant = kawat pemicu. Memilih produk berarti memilih paket kontrol risiko — jadi jangan pernah memilih produk hanya dari \"bunga paling murah\" atau \"proses paling cepat\". Tanyakan selalu: bentuk taruhan apa yang kumasuki, dan apakah aku dibayar cukup untuk bentuk itu?",
      },
      reference: "Bentuk taruhan mengikuti irama kas debitur — bukan kalender bank.",
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
        "Empat keluarga produk: retail/KPR (banyak, dinilai statistik), UKM (lincah tapi rapuh), korporasi (gajah, dianalisis satu per satu), kartu kredit (kecil tapi pedas).",
        "5C: Character × Capacity = mesin pembayaran; Capital + Collateral = rem darurat; Conditions = cuaca. Capacity raja — ukur dengan DSCR.",
        "Agunan menurunkan LGD, bukan PD. Kredit diberikan karena capacity, bukan karena collateral.",
        "Siklus 6 tahap; macet lahir di origination/underwriting, baru ketahuan di collection. Underwriting menolak sebagian aplikan = sehat.",
        "NPL portofolio = rata-rata tertimbang porsi — segmen kecil ber-NPL tinggi bisa mendominasi total.",
      ],
      next: { label: "CR2 — Kolektibilitas", href: "/v2/learn/cr2-kolektibilitas" },
      quiz: [
        {
          q: "Dari 5C, mana yang disebut 'raja' dan mengapa?",
          options: [
            { text: "Collateral — karena agunan menjamin bank tidak rugi", why: "Agunan baru berguna setelah macet, dan nilainya bisa jatuh saat krisis. Ia menurunkan LGD, bukan mencegah default." },
            { text: "Capacity — karena cicilan dibayar dari arus kas, bukan dari agunan", why: "Cicilan dibayar dari arus kas setiap bulan. Bank yang membalik urutan ini menabung masalah.", correct: true },
            { text: "Capital — karena modal besar pasti aman", why: "Modal besar tanpa arus kas tetap tidak bisa membayar cicilan bulanan." },
            { text: "Conditions — karena ekonomi menentukan segalanya", why: "Kondisi penting tetapi di luar kendali debitur; yang membayar cicilan tetap capacity-nya." },
          ],
        },
        {
          q: "Warung Bu Ani: arus kas Rp 120 jt/thn, total cicilan Rp 100 jt/thn. DSCR dan interpretasinya?",
          options: [
            { text: "0,83x — tidak layak", why: "Terbalik: 100/120 bukan DSCR. Pembilangnya arus kas." },
            { text: "1,2x — layak tapi buffer tipis, sensitif terhadap penurunan omzet", why: "120/100 = 1,2x. Lolos, tetapi buffer hanya 20% — penurunan omzet 20% saja membuat DSCR < 1.", correct: true },
            { text: "2,0x — sangat aman", why: "Angkanya tidak cocok: 120/100 bukan 2,0." },
            { text: "1,0x — pas, tidak ada masalah", why: "1,0x berarti tanpa buffer sama sekali — itu masalah, bukan aman." },
          ],
        },
        {
          q: "Mengapa kartu kredit bunganya paling tinggi di antara produk kredit?",
          options: [
            { text: "Bank serakah", why: "Bukan soal keserakahan — ada aritmetikanya." },
            { text: "Tanpa agunan + NPL historis tertinggi → bunga harus mengkompensasi expected loss", why: "Tanpa agunan berarti LGD tinggi, NPL segmen ini tertinggi. Bunga = harga risiko.", correct: true },
            { text: "Biaya operasional kartu paling mahal", why: "Biaya operasional bukan pendorong utama selisih bunga antar produk." },
            { text: "Regulasi OJK mewajibkan bunga tinggi", why: "OJK justru membatasi bunga kartu kredit, bukan mewajibkan tinggi." },
          ],
        },
        {
          q: "Bank meloloskan 95 dari 100 aplikan kredit. Sebagai analis risiko, reaksimu?",
          options: [
            { text: "Bagus — inklusif dan mendukung pertumbuhan", why: "Inklusif tanpa filter = adverse selection: yang paling butuh justru paling semangat mengajukan." },
            { text: "Waspada — seleksi terlalu longgar; NPL 2 tahun lagi berisiko meledak", why: "Approval rate 95% nyaris tanpa filter. Penolakan adalah output yang diinginkan dari underwriting yang baik.", correct: true },
            { text: "Netral — tidak ada hubungannya dengan risiko", why: "Approval rate adalah cermin ketajaman underwriting — sangat berhubungan dengan risiko." },
            { text: "Bagus — pangsa pasar naik", why: "Pangsa pasar yang dibeli dengan kredit buruk = NPL masa depan." },
          ],
        },
        {
          q: "Pemerintah mensubsidi bunga KUR hingga 6%. Debitur KUR kemudian macet. Siapa yang menanggung kerugian pokoknya?",
          options: [
            { text: "Pemerintah — kan program pemerintah, pasti dijamin penuh", why: "Subsidi menutup selisih bunga, bukan risiko gagal bayar. 'Program pemerintah' bukan jimat anti-rugi." },
            { text: "Bank penyalur (dan penjamin sesuai porsi & syarat klaim)", why: "Risiko kredit tetap di bank penyalur, atau penjamin sesuai kontrak dengan syarat ketat. Underwriting KUR harus tetap tajam.", correct: true },
            { text: "Debitur lain yang lancar", why: "Tidak ada mekanisme seperti itu — kerugian tercatat di bank penyalur." },
            { text: "Tidak ada yang rugi — kredit program tidak dicatat sebagai NPL", why: "Kredit program yang macet tetap masuk NPL bank penyalur." },
          ],
        },
      ],
    },
  ],
};
