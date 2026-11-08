import type { V2Lesson } from "../lib/types";

export const cr17b: V2Lesson = {
  slug: "cr17b-corporate-credit-2",
  track: "Credit Risk",
  module: "Kredit Korporasi",
  title: "CR17B — Kredit Korporasi 2: Air Terjun Kas & Covenant",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "EBITDA 162 M, tetapi tidak punya uang",
      prose: [
        "DSCR Maju Jaya versi EBITDA: 1,62× — lolos. Tetapi analis senior sudah belajar dari Part 1: EBITDA bukan kas. Ia susun air terjunnya: pajak Rp 30 M... modal kerja menyedot Rp 70 M (piutang tak tertagih)... capex Rp 80 M (pabrik setengah jadi)...",
        "Sisa untuk membayar utang Rp 100 M: minus Rp 18 miliar. Perusahaan dengan EBITDA 162 M tidak punya uang untuk membayar utangnya.",
        "DSCR berbasis EBITDA menipu — yang membayar utang adalah kas bebas, bukan EBITDA. Part 2 ini turun ke level yang lebih dalam: air terjun kas, lalu ke \"senjata\" analis korporasi: covenant, rating internal, dan memo kredit.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Definisi DSCR menentukan vonis. DSCR EBITDA = 1,62 (lolos); DSCR FCF = negatif (mati). Analis senior memakai keduanya dan menjelaskan bedanya — bukan memilih yang enak.",
      },
      reference: "Tanyakan selalu: 'EBITDA ini jadi kas berapa?'",
    },
    {
      id: "waterfall",
      eyebrow: "Langkah 2 · Air Terjun",
      title: "Dari EBITDA ke sisa",
      prose: [
        "Air terjun kas (cash waterfall) = urutan alokasi kas: tiap tingkat \"mengambil\" bagiannya, sisa mengalir ke bawah. Urutan baku: EBITDA (titik awal, proksi kas kotor) − pajak → − Δ modal kerja (piutang/persediaan naik = kas keluar!) → = kas operasi → − capex → = Free Cash Flow (FCF) — kas yang benar-benar bebas → − bunga − cicilan pokok → = sisa (untuk dividen/ekspansi/cadangan).",
        "Tiga pencuri terbesar: (1) modal kerja (tumbuh = kas tersedot), (2) capex pemeliharaan (pabrik tua = capex wajib), (3) pajak. Perusahaan \"menguntungkan\" yang kasnya habis untuk ketiganya = tidak bisa bayar utang hari ini, apapun labanya.",
        "Contoh Maju Jaya: EBITDA 162 → pajak 30 → modal kerja 70 → kas operasi 62 → capex 80 → FCF −18 → bunga+cicilan 100 → sisa −118. DSCR yang jujur memakai FCF (bukan EBITDA) untuk debitur dengan modal kerja/capex besar.",
      ],
      formula: String.raw`\text{DSCR}_{\text{FCF}} = \frac{\text{EBITDA} - \text{Pajak} - \Delta \text{MK} - \text{Capex}}{\text{Bunga} + \text{Cicilan}}`,
      formulaNote: "Untuk perusahaan padat modal kerja, DSCR EBITDA adalah dongeng — selalu pakai FCF.",
      tasks: [],
      reference: "Analis senior menyajikan DSCR versi EBITDA DAN FCF — dan menjelaskan bedanya.",
    },
    {
      id: "lab-waterfall",
      eyebrow: "Langkah 3 · Lab Waterfall",
      title: "Ikuti aliran kasnya",
      prose: [
        "PT Maju Jaya (Rp M), nilai terkunci: ebitda 162, pajak 30, modal_kerja 70, capex 80, bunga 60, cicilan 40. Tugasmu: susun air terjun kas sampai DSCR yang jujur.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kas_operasi` = ebitda − pajak − modal_kerja" },
        { id: "t2", text: "Hitung `kas_bebas` dan `sisa_setelah_utang`" },
        { id: "t3", text: "Hitung `dscr_fcf`, lalu `print` semuanya" },
      ],
      expected: "operasi=62 FCF=-18 sisa=-118 DSCR=-0.18",
      hints: [
        "kas_bebas = kas_operasi − capex.",
        "sisa = kas_bebas − bunga − cicilan.",
        "dscr_fcf = kas_bebas / (bunga + cicilan).",
      ],
      code: {
        starter: `ebitda, pajak = 162, 30\nmodal_kerja, capex = 70, 80\nbunga, cicilan = 60, 40\n\n# TULIS KODEMU\nkas_operasi = \nkas_bebas = \nsisa_setelah_utang = \ndscr_fcf = \n\nprint(f"operasi={kas_operasi} FCF={kas_bebas} sisa={sisa_setelah_utang} DSCR={dscr_fcf:.2f}")`,
        lockLines: 3,
        solution: `ebitda, pajak = 162, 30\nmodal_kerja, capex = 70, 80\nbunga, cicilan = 60, 40\n\n# TULIS KODEMU\nkas_operasi = ebitda - pajak - modal_kerja\nkas_bebas = kas_operasi - capex\nsisa_setelah_utang = kas_bebas - bunga - cicilan\ndscr_fcf = kas_bebas / (bunga + cicilan)\n\nprint(f"operasi={kas_operasi} FCF={kas_bebas} sisa={sisa_setelah_utang} DSCR={dscr_fcf:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kas_operasi", value: 62, tol: 1e-9, label: "`kas_operasi` seharusnya 62", msg: "162 − 30 − 70 = 62." },
          { kind: "equal", task: "t2", name: "kas_bebas", value: -18, tol: 1e-9, label: "`kas_bebas` seharusnya −18", msg: "62 − 80 = −18 — FCF negatif!" },
          { kind: "equal", task: "t2", name: "sisa_setelah_utang", value: -118, tol: 1e-9, label: "`sisa_setelah_utang` seharusnya −118", msg: "−18 − 60 − 40 = −118." },
          { kind: "equal", task: "t3", name: "dscr_fcf", value: -0.18, tol: 0.01, label: "`dscr_fcf` seharusnya −0.18", msg: "−18 / 100 = −0.18. Bandingkan dengan DSCR EBITDA 1.62 — definisi mengubah vonis." },
          { kind: "stdout_matches", task: "t3", pattern: "operasi=62\\s+FCF=-18\\s+sisa=-118\\s+DSCR=-0\\.18", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "EBITDA 100, pajak 15, modal kerja 30, capex 20 → FCF 35; bunga+cicilan 30 → DSCR jujur 1,17× (bukan 3,33×).",
    },
    {
      id: "covenant",
      eyebrow: "Langkah 4 · Covenant",
      title: "Sabuk pengaman kontrak",
      prose: [
        "Covenant = janji debitur dalam perjanjian kredit. Tiga jenis: affirmative (harus dilakukan) — laporan keuangan kuartalan, asuransi aset, bayar pajak; negative (dilarang) — tidak boleh tambah utang melebihi X, tidak boleh jual aset inti, tidak boleh bagi dividen jika DSCR < Y; financial (angka) — DSCR min 1,3×, D/E maks 2,5×, current ratio min 1,2× — diuji tiap kuartal.",
        "Covenant seperti sensor sabuk pengaman mobil — tidak mencegah kecelakaan, tetapi berbunyi SEBELUM tabrakan (pelanggaran = hak bank untuk renegosiasi). Kredit tanpa covenant = mobil tanpa sensor: tahu ada masalah saat sudah menabrak.",
        "Saat dilanggar: bukan otomatis default — melainkan hak bank: menaikkan bunga, meminta pelunasan dipercepat, atau renegosiasi syarat. Ini daya tawar — momen bank paling kuat. Waiver harus bersyarat + berbayar (bunga naik, batas 12 bulan, roadmap penurunan D/E, larangan dividen/akuisisi) — waiver gratis = covenant tidak ada wibawanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Covenant ketat = bank tidak percaya debitur.\" Covenant adalah sistem peringatan dini kontraktual — justru memungkinkan bank memberi kredit ke perusahaan berisiko (dengan pengaman). Tanpa covenant, bank hanya berani ke yang super aman. Debitur yang menolak semua covenant biasanya menyembunyikan sesuatu.",
      },
      reference: "Fungsi utama covenant financial: alarm dini kontraktual — hak renegosiasi SEBELUM default, saat masih kuat.",
    },
    {
      id: "lab-covenant",
      eyebrow: "Langkah 5 · Lab Covenant",
      title: "Kapan pelanggaran terjadi?",
      prose: [
        "Covenant: DSCR min 1,3×, diuji tiap kuartal. Fungsi `cek_covenant` terkunci (bunga 60, cicilan 40). Skenario: baseline (EBITDA 162), penjualan −10% (140), penjualan −20% (118), bunga naik 3% (EBITDA 162, bunga 60→78). Tugasmu: hitung DSCR dan status tiap skenario.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dscr_base` dan `dscr_minus20`" },
        { id: "t2", text: "Hitung `lolos_minus20` (bool) dan `dscr_bunga`" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "base=1.62 -20%=1.18 LANGGAR bunga=1.37 lolos",
      hints: [
        "cek_covenant(ebitda, bunga, cicilan) mengembalikan (dscr, lolos).",
        "Untuk skenario bunga: bunga 60 → 78.",
        "dscr_base, lolos_base = cek_covenant(162, 60, 40)",
      ],
      code: {
        starter: `def cek_covenant(ebitda, bunga, cicilan, batas=1.3):\n    dscr = ebitda / (bunga + cicilan)\n    return dscr, dscr >= batas\n\n# TULIS KODEMU\ndscr_base, lolos_base = \ndscr_minus20, lolos_minus20 = \ndscr_bunga, lolos_bunga = \n\nprint(f"base={dscr_base:.2f} -20%={dscr_minus20:.2f} langgar={not lolos_minus20}")\nprint(f"bunga={dscr_bunga:.2f} lolos={lolos_bunga}")`,
        lockLines: 3,
        solution: `def cek_covenant(ebitda, bunga, cicilan, batas=1.3):\n    dscr = ebitda / (bunga + cicilan)\n    return dscr, dscr >= batas\n\n# TULIS KODEMU\ndscr_base, lolos_base = cek_covenant(162, 60, 40)\ndscr_minus20, lolos_minus20 = cek_covenant(118, 60, 40)\ndscr_bunga, lolos_bunga = cek_covenant(162, 78, 40)\n\nprint(f"base={dscr_base:.2f} -20%={dscr_minus20:.2f} langgar={not lolos_minus20}")\nprint(f"bunga={dscr_bunga:.2f} lolos={lolos_bunga}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dscr_base", value: 1.62, tol: 1e-9, label: "`dscr_base` seharusnya 1.62", msg: "162 / 100 = 1.62 — lolos." },
          { kind: "equal", task: "t1", name: "dscr_minus20", value: 1.18, tol: 1e-9, label: "`dscr_minus20` seharusnya 1.18", msg: "118 / 100 = 1.18 — di bawah 1.3, LANGGAR!" },
          { kind: "equal", task: "t2", name: "lolos_minus20", value: false, label: "`lolos_minus20` seharusnya False", msg: "1.18 < 1.3 → pelanggaran covenant." },
          { kind: "equal", task: "t2", name: "dscr_bunga", value: 1.3729, tol: 0.01, label: "`dscr_bunga` seharusnya 1.37", msg: "162 / 118 = 1.37 — lolos tipis." },
          { kind: "stdout_matches", task: "t3", pattern: "base=1\\.62\\s+-20%=1\\.18\\s+langgar=True", label: "`print` menampilkan hasil skenario", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Pelanggaran = hak bank (renegosiasi, naikkan bunga, percepat pelunasan) — momen daya tawar terkuat.",
    },
    {
      id: "rating",
      eyebrow: "Langkah 6 · Rating",
      title: "Menilai yang tak terukur",
      prose: [
        "Rating internal = penilaian kredit bank atas debitur korporasi, mengombinasikan: kuantitatif (40%) — rasio keuangan (CR17a): DSCR, leverage, likuiditas; kualitatif (35%) — manajemen (track record, suksesi), posisi pasar, diversifikasi pelanggan, tata kelola; industri (15%) — siklus, kompetisi, regulasi sektor (jembatan ke CR18); negara (10%) — risiko negara (untuk lintas batas).",
        "Mengapa kualitatif 35%? Karena angka tidak menangkap: direktur yang korup, pelanggan tunggal 80%, atau industri yang sekarat. Krisis terbesar selalu dimulai dari yang kualitatif — angka hanya mengkonfirmasi belakangan.",
        "Pelajaran karir: analis yang hanya jago Excel (kuantitatif) = setengah analis. Kemampuan menilai manajemen & industri (kualitatif) yang membedakan senior dari junior — dan ini didapat dari kunjungan lapangan, bukan spreadsheet.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Aturan emas memo kredit: rekomendasi di depan, jujur soal risiko, angka + narasi. Kredibilitas analis = mata uang karirnya. Menyembunyikan risiko = bunuh kredibilitas; sekali rekomendasi macet, karir ikut macet.",
      },
      reference: "Angka = akibat, kualitatif = sebab.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Menulis rekomendasi",
      prose: [
        "PT Sinar Abadi (tekstil, Bandung) mengajukan KMK Rp 50 M (tenor 1 tahun, revolving). Data: DSCR (EBITDA) 1,8×; DSCR (FCF) 1,35× — cukup, tidak lega; D/E 1,8×, tren stabil 3 tahun; arus kas operasi = 90% laba bersih (sehat!); kualitatif: direktur 20 tahun pengalaman, pelanggan tersebar (terbesar 15%), industri tekstil lesu (impor murah); agunan: persediaan + piutang (fidusia) + tanah pabrik (HT).",
        "Executive summary: \"Direkomendasikan ACC KMK Rp 50 M, 1 tahun revolving, dengan syarat covenant di bawah. DSCR FCF 1,35× mencukupi dengan buffer tipis; kualitas laba baik (kas operasi 90% laba); manajemen berpengalaman dengan diversifikasi pelanggan sehat. Risiko utama: industri tekstil lesu (impor) — dimitigasi dengan tenor pendek (1 tahun, review tahunan) dan covenant ketat. Pricing: bunga +0,5% di atas standar segmen sebagai kompensasi risiko industri.\"",
        "3 covenant: (1) financial: DSCR (FCF) min 1,2×, diuji kuartalan. (2) Negative: larangan capex >Rp 10 M/tahun tanpa persetujuan + larangan dividen jika DSCR <1,3×. (3) Affirmative: laporan keuangan kuartalan + laporan umur piutang bulanan (monitoring modal kerja — titik lemahnya).",
      ],
      tasks: [],
      reference: "Rekomendasi di depan, jujur soal risiko, angka + narasi.",
    },
    {
      id: "pendalaman-headroom",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Headroom, waiver, dan jarak ke kematian",
      prose: [
        "Contoh terapan kedua — dari proyek infrastruktur Indonesia, di mana DSCR bukan angka melainkan JADWAL. PT Jalan Tol Nusantara mengajukan kredit proyek Rp 2 triliun, tenor 15 tahun. Kas proyek: tahun 1–3 konstruksi (kas negatif — belum ada tol), tahun 4–6 ramp-up (trafik 40% proyeksi), tahun 7+ stabil. DSCR rata-rata 1,5× terlihat aman — tetapi DSCR tahun ke-4 hanya 1,02× (ramp-up meleset 20% dari proyeksi). Satu tahun kemacetan konstruksi atau trafik di bawah proyeksi = default di tahun ke-4, walau \"rata-rata\" aman. Solusi industri: DSCR diuji PER TAHUN (bukan rata-rata), plus DSRA (Debt Service Reserve Account) — rekening cadangan 6–12 bulan cicilan yang wajib diisi sebelum dividen boleh keluar. Contoh: cicilan tahunan Rp 180 M → DSRA Rp 90–180 M menganggur sebagai bantal. Pelajarannya: untuk proyek, yang penting bukan DSCR rata-rata melainkan DSCR TERENDAH (minimum DSCR) — rantai putus di mata rantai terlemah, bukan di rata-ratanya.",
        "Kontras cara salah vs benar membaca covenant. Cara salah: \"Covenant DSCR min 1,3× — debitur lolos 1,35×, aman, lanjut.\" Cara benar: tanyakan HEADROOM-nya — berapa guncangan yang bisa diserap sebelum melanggar? DSCR 1,35× dengan volatilitas EBITDA 25% (komoditas) vs DSCR 1,35× dengan volatilitas 8% (utilitas teregulasi) adalah dua dunia berbeda. Hitung: jika EBITDA turun 1 standar deviasi (25%), DSCR jatuh ke 1,01× — melanggar. Probabilitas pelanggaran dalam 1 tahun ≈ 30%. Bandingkan utilitas: turun 8% → DSCR 1,24× — masih lolos tipis. Aturan keputusan: covenant bukan garis lolos/gagal — ia garis yang jaraknya dari posisi saat ini harus diukur dengan volatilitas. Analis senior melaporkan \"DSCR 1,35× dengan headroom 0,5 standar deviasi — rapuh\" bukan \"lolos\". Angka yang sama, kesimpulan berlawanan — bedanya adalah volatilitas.",
        "Mode kegagalan nyata: dividend recapitalization — debitur sehat yang \"dirampok\" pemiliknya sendiri. PT Sinar Abadi (dari mini-case) tiba-tiba mengajukan: tambah utang Rp 30 M untuk membayar dividen khusus ke pemegang saham. D/E naik 1,8 → 2,6; DSCR turun 1,35 → 1,05. Perusahaan tidak berubah — tetapi risikonya berubah total karena kas dikeluarkan untuk pemilik, bukan untuk buffer. Tanpa negative covenant (\"dilarang bagi dividen jika DSCR <1,3×\"), bank tidak bisa mencegahnya. Ini bukan teori: pola dividend recap marak di perusahaan private-equity-owned. Pertahanan: (1) negative covenant dividen yang terikat DSCR — otomatis, tidak butuh persetujuan bank tiap kali; (2) change-of-control clause — jika kepemilikan berubah >50%, bank berhak meminta pelunasan dipercepat (pemilik baru = risiko baru). Covenant yang baik mengantisipasi perilaku pemilik, bukan hanya kinerja perusahaan.",
        "Pendalaman sub-topik yang selama ini hanya disebut sekilas: sensitivitas FCF break-even. Analis senior tidak bertanya \"apakah DSCR cukup?\" — ia bertanya \"penjualan boleh turun berapa persen SEBELUM DSCR jebol?\" Contoh Sinar Abadi: EBITDA Rp 90 M, biaya variabel 60% dari penjualan Rp 300 M (Rp 180 M), biaya tetap Rp 30 M. DSCR-FCF 1,35× dengan debt service Rp 40 M → FCF Rp 54 M. Break-even: penjualan turun X% → EBITDA turun, FCF turun. Hitung kasar: tiap 10% penurunan penjualan (Rp 30 M) mengurangi EBITDA Rp 12 M (setelah biaya variabel) → FCF turun Rp 12 M. FCF Rp 54 M → butuh turun Rp 14 M untuk jebol 1,0× → penjualan boleh turun ~12%. Interpretasi: \"perusahaan ini mati jika penjualan turun 12%\" — kalimat yang jauh lebih berguna untuk komite daripada \"DSCR 1,35×\". Komite tidak merasakan 1,35; ia merasakan \"12%\". Selalu terjemahkan rasio menjadi jarak-ke-kematian.",
        "Aturan keputusan analis kredit korporasi senior. Satu: selalu hitung DSCR dua versi (EBITDA dan FCF) — jika bedanya >0,5×, ada masalah modal kerja/capex yang disembunyikan EBITDA. Dua: uji DSCR per tahun untuk proyek (minimum DSCR), bukan rata-rata. Tiga: ukur headroom covenant dalam standar deviasi, bukan dalam angka absolut. Empat: terjemahkan setiap rasio kunci menjadi \"jarak ke kematian\" (break-even %) untuk komite. Lima: negative covenant dividen + change-of-control clause adalah standar — debitur yang menolak keduanya sedang merencanakan sesuatu. Lima aturan ini membedakan analis yang \"menghitung rasio\" dari analis yang \"memahami risiko\".",
        "Contoh keputusan nyata: kapan meminta waiver — lebih awal selalu lebih murah. Sinar Abadi memproyeksikan DSCR kuartal depan 1,22× (di bawah covenant 1,3×). Pilihan A: diam, berharap membaik, lalu melanggar — bank menemukan dari laporan kuartalan, posisi tawar bank maksimal, syarat waiver berat (bunga +1%, larangan dividen 2 tahun). Pilihan B: datang 1 bulan SEBELUM pelanggaran dengan proyeksi + rencana aksi (potong capex Rp 8 M, tunda ekspansi) — bank melihat manajemen proaktif, syarat waiver ringan (bunga +0,25%, review 6 bulan). Aritmetikanya: waiver dini Rp 50 M × 0,25% = Rp 125 juta/tahun; waiver terlambat Rp 50 M × 1% = Rp 500 juta/tahun + reputasi rusak. Aturan untuk debitur (dan nasihat analis ke nasabah baik): pelanggaran covenant yang diumumkan sendiri + rencana perbaikan = masalah teknis; pelanggaran yang ditemukan bank = masalah kepercayaan. Kepercayaan yang rusak harganya 4× lipat.",
        "Mode kegagalan tata kelola: covenant holiday yang diperpanjang tanpa akhir. Pola yang berulang: debitur melanggar → bank memberi \"holiday\" 12 bulan → 12 bulan kemudian belum pulih → holiday diperpanjang 12 bulan lagi → begitu seterusnya 3 tahun. Covenant yang tidak pernah ditegakkan = tidak ada covenant — dan yang lebih buruk, bank kehilangan HAK-nya tepat saat membutuhkannya (saat restrukturisasi, posisi tawar bank sudah habis karena \"selama ini dibiarkan\"). Aturan keputusan untuk komite: setiap waiver/holiday wajib punya (1) batas waktu MAKSIMAL 12 bulan tanpa perpanjangan otomatis, (2) milestone terukur (D/E turun ke berapa, DSCR naik ke berapa), (3) konsekuensi gagal yang ditulis di awal (bunga naik otomatis / pelunasan dipercepat). Jika milestone tidak tercapai 2× berturut-turut = restrukturisasi formal, bukan holiday ketiga. Disiplin ini terasa kejam; alternatifnya — evergreening — jauh lebih kejam karena menunda pengakuan kerugian sampai tidak bisa diselamatkan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: FCF adalah kebenaran, EBITDA adalah pendapat",
        body: "EBITDA adalah laba sebelum banyak hal yang nyata: pajak (nyata), bunga (nyata), modal kerja (sangat nyata), capex (nyata dan berulang). Setiap huruf yang \"ditambahkan kembali\" ke EBITDA adalah tagihan yang tetap harus dibayar — EBITDA hanya berpura-pura mereka tidak ada. Heuristiknya brutal tetapi benar: jika seseorang menawarkanmu \"perusahaan dengan EBITDA Rp 162 M\", tanyakan satu kalimat — \"jadi kas bebasnya berapa?\" Jika jawabannya berbelit-belit, minus, atau \"nanti dihitung\", anggap EBITDA itu nol sampai terbukti ada kasnya. Analis junior jatuh cinta pada EBITDA karena ia besar dan indah dipandang; analis senior mencurigainya karena alasan yang sama persis. Dalam kredit, kamu tidak dibayar dengan EBITDA — kamu dibayar dengan kas yang masuk rekening tepat waktu setiap bulan. Semua analisis korporasi adalah upaya menjawab satu pertanyaan anak kecil: \"uangnya beneran ada nggak?\" Dan satu uji terakhir sebelum ACC: minta debitur menunjukkan 12 bulan mutasi rekening koran — jika EBITDA-nya Rp 162 M tetapi mutasinya tidak pernah menunjukkan kas mengendap, percayai mutasinya.",
      },
      reference: "Terjemahkan setiap rasio kunci menjadi jarak-ke-kematian untuk komite.",
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
        "Yang membayar utang = free cash flow, bukan EBITDA. DSCR jujur memakai FCF.",
        "Covenant = alarm dini kontraktual: affirmative, negative, financial. Pelanggaran = hak, bukan vonis.",
        "Rating internal: kuantitatif 40%, kualitatif 35% — krisis bermula dari yang kualitatif.",
        "Aturan emas memo: rekomendasi di depan, jujur soal risiko, angka + narasi.",
        "Waiver bersyarat + berbayar — waiver gratis = covenant tanpa wibawa.",
      ],
      next: { label: "CR18 — Risiko Industri & Negara", href: "/v2/learn/cr18-industry-country-risk" },
      quiz: [
        {
          q: "EBITDA Rp 162 M, tetapi setelah pajak + modal kerja + capex + utang, sisa negatif. Pelajaran?",
          options: [
            { text: "EBITDA salah hitung", why: "EBITDA benar — tetapi bukan kas." },
            { text: "Yang membayar utang = free cash flow, bukan EBITDA — DSCR jujur memakai FCF untuk debitur padat modal kerja/capex", why: "EBITDA → kas bebas ada 'pajak air' (modal kerja, capex).", correct: true },
            { text: "Jangan pakai DSCR", why: "Pakai DSCR — tetapi definisi yang jujur." },
            { text: "Tambah utang lagi", why: "Itu mempercepat default." },
          ],
        },
        {
          q: "Fungsi utama covenant financial (misal DSCR min 1,3×)?",
          options: [
            { text: "Menghukum debitur", why: "Bukan hukuman." },
            { text: "Alarm dini kontraktual — memberi bank hak renegosiasi SEBELUM default, saat masih kuat", why: "Covenant = kursi di meja perundingan saat perusahaan mulai goyah.", correct: true },
            { text: "Menaikkan bunga otomatis", why: "Bukan otomatis — itu hak bank." },
            { text: "Formalitas", why: "Formalitas tanpa gigi = covenant mati." },
          ],
        },
        {
          q: "Dalam rating internal, komponen kualitatif berbobot 35%. Mengapa sebesar itu?",
          options: [
            { text: "Agar analis ada kerjaan", why: "Bukan." },
            { text: "Krisis terbesar bermula dari yang kualitatif (manajemen, pelanggan tunggal, industri sekarat) — angka hanya mengkonfirmasi belakangan", why: "Angka = akibat, kualitatif = sebab.", correct: true },
            { text: "Regulasi mewajibkan 35% pas", why: "Ini kebijakan bank, bukan regulasi." },
            { text: "Kuantitatif tidak penting", why: "Kuantitatif tetap 40%." },
          ],
        },
        {
          q: "Aturan emas memo kredit?",
          options: [
            { text: "Buat komite selalu ACC", why: "Itu merusak kredibilitas." },
            { text: "Rekomendasi di depan, jujur soal risiko, angka + narasi — kredibilitas analis = mata uang karirnya", why: "Menyembunyikan risiko = bunuh kredibilitas.", correct: true },
            { text: "Semakin tebal semakin baik", why: "Ringkas dan jelas lebih baik." },
            { text: "Jangan cantumkan risiko", why: "Justru risiko wajib dicantumkan." },
          ],
        },
        {
          q: "Debitur melanggar covenant DSCR (1,05 vs min 1,3). Apa yang terjadi?",
          options: [
            { text: "Otomatis default & disita", why: "Bukan otomatis — itu hak bank." },
            { text: "Bank mendapat HAK (bukan kewajiban): renegosiasi, naikkan bunga, percepat pelunasan — momen daya tawar terkuat", why: "Pelanggaran covenant = hak, bukan vonis otomatis.", correct: true },
            { text: "Tidak ada apa-apa", why: "Bank kehilangan gigi covenantnya." },
            { text: "Debitur dipenjara", why: "Bukan pidana." },
          ],
        },
      ],
    },
  ],
};
