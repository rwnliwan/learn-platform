import type { V2Lesson } from "../lib/types";

export const pma4b: V2Lesson = {
  slug: "pm-a4b-inventory",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A4B Inventori: LIFO Reserve, Liquidation & Write-Down",
  estMinutes: 60,
  steps: [
    {
      id: "gudang-laba-berubah",
      eyebrow: "Langkah 1 · Cerita",
      title: "Gudang yang sama, laba yang berubah",
      prose: [
        "PT GudangRaya menjual barang yang sama, ke pelanggan yang sama, dengan harga jual yang sama seperti tahun lalu. Volume penjualan tidak berubah. Namun laba bersihnya naik 25 persen. Tidak ada pelanggan baru, tidak ada produk baru, tidak ada efisiensi baru. Yang berubah hanya satu hal: cara perusahaan menghitung harga pokok barang yang keluar dari gudang.",
        "Inilah pelajaran pertama tentang inventori: laba bukan hanya hasil operasi, melainkan juga hasil pilihan metode akuntansi. Dua perusahaan dengan gudang, pembelian, dan penjualan yang identik bisa melaporkan laba yang sangat berbeda — dan keduanya sah menurut standar yang mereka pakai. Tugas analis bukan menuduh, melainkan menormalisasi: samakan metodenya dulu, baru bandingkan labanya.",
        "Lesson ini melangkah lebih jauh dari pengantar FIFO versus LIFO di PM-A4. Di sana kamu melihat laba kotor berubah. Di sini kamu mengikuti uangnya sampai ke kas dan pajak, membongkar LIFO reserve, mengenali laba semu dari LIFO liquidation, dan menilai write-down inventori.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira laba yang lebih tinggi berarti operasi yang lebih baik. Saat harga naik, laba FIFO yang lebih tinggi adalah efek metode, bukan efek kinerja — dan ia datang dengan tagihan pajak yang lebih besar.",
      },
      reference: "Metode inventori mengubah laba, pajak, dan kas — tanpa mengubah satu pun barang di gudang.",
    },
    {
      id: "fifo-lifo-kas-pajak",
      eyebrow: "Langkah 2 · FIFO vs LIFO: Ikuti Uangnya",
      title: "Laba tinggi, kas tipis: harga pajak FIFO",
      prose: [
        "Contoh ilustratif: PT GudangRaya menjual 100 unit seharga Rp20 per unit, total penjualan Rp2.000. Pembelian lama 100 unit seharga Rp10, pembelian baru 100 unit seharga Rp14. FIFO memakai COGS Rp1.000 dan laba kotor Rp1.000. LIFO memakai COGS Rp1.400 dan laba kotor Rp600. Selisih laba Rp400 — dari transaksi yang identik.",
        "Sekarang ikuti uangnya. Dengan tarif pajak 25 persen (ilustratif), pajak FIFO adalah 25 persen dari Rp1.000 = Rp250, sedangkan pajak LIFO adalah 25 persen dari Rp600 = Rp150. Perusahaan FIFO membayar pajak Rp100 lebih banyak. Laba setelah pajak FIFO adalah Rp750, LIFO Rp450 — selisihnya menyusut dari Rp400 menjadi Rp300, tetapi kas perusahaan FIFO lebih tipis Rp100 karena pajak yang sudah dibayar. Inilah inti yang sering terlewat: memilih laba yang terlihat besar berarti memilih tagihan pajak yang besar pula.",
        "Arus kas operasi mengikuti logika yang sama. LIFO menunda pajak, sehingga kas operasi LIFO lebih tinggi sebesar penghematan pajaknya — selama harga terus naik dan lapisan LIFO tidak dicairkan. Perusahaan yang memakai LIFO bukan sedang menghemat pajak selamanya; ia sedang menunda pajak. Tagihan itu menunggu di lapisan lama, dan akan jatuh tempo saat LIFO liquidation terjadi.",
      ],
      formula: String.raw`\text{Pajak} = \text{Laba kena pajak} \times \text{tarif pajak} \quad;\quad \text{Kas} = \text{Laba} - \text{Pajak dibayar}`,
      formulaNote: "Laba kena pajak di sini disederhanakan menjadi laba kotor (ilustratif, sebelum beban lain); tarif pajak 25 persen (ilustratif). Interpretasi: setiap rupiah tambahan laba dari metode FIFO berubah menjadi 25 sen pajak dan 75 sen laba setelah pajak — laba yang lebih tinggi tidak pernah utuh menjadi kas. Contoh angka: FIFO laba kotor Rp1.000, pajak Rp250, laba setelah pajak Rp750; LIFO laba kotor Rp600, pajak Rp150, laba setelah pajak Rp450.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Emiten yang membanggakan laba tertinggi di sektornya tetapi arus kas operasinya tertinggal bisa jadi hanya memakai FIFO saat harga input naik — dan membayar pajak lebih banyak untuk pameran itu.",
      },
      quiz: [
        {
          q: "Harga input naik. Perusahaan FIFO melaporkan laba lebih tinggi dari perusahaan LIFO yang identik. Apa konsekuensi kasnya?",
          options: [
            { text: "Kas FIFO lebih tinggi karena labanya lebih tinggi", why: "Salah: laba yang lebih tinggi dikenai pajak yang lebih tinggi, sehingga kas justru lebih tipis." },
            { text: "Kas FIFO lebih rendah karena pajak yang dibayar lebih besar", why: "Benar: pajak FIFO Rp250 versus LIFO Rp150 (ilustratif) — selisih Rp100 keluar sebagai kas. Laba tinggi bukan kas tinggi.", correct: true },
            { text: "Kas keduanya sama karena penjualannya sama", why: "Salah: penjualan sama, tetapi pajak yang dibayar berbeda — dan pajak adalah kas keluar." },
            { text: "Kas LIFO lebih rendah karena COGS-nya lebih tinggi", why: "Salah: COGS yang lebih tinggi menurunkan laba kena pajak, sehingga pajak yang dibayar lebih kecil dan kas lebih tebal." },
          ],
        },
      ],
      reference: "Harga naik: FIFO = laba tinggi + pajak tinggi + kas lebih tipis. LIFO = laba rendah + pajak ditunda + kas lebih tebal.",
    },
    {
      id: "lifo-reserve",
      eyebrow: "Langkah 3 · Lab: LIFO Reserve",
      title: "LIFO reserve: kunci untuk membandingkan apel dengan apel",
      prose: [
        "Perusahaan Amerika yang memakai LIFO wajib mengungkapkan LIFO reserve di catatan kaki: selisih antara nilai inventori bila dihitung FIFO dan nilai inventori LIFO yang dilaporkan. LIFO reserve adalah jembatan antara dua dunia — dengan angka ini, analis bisa mengubah laporan LIFO menjadi seolah-olah FIFO, lalu membandingkannya dengan pesaing yang memakai FIFO.",
        "Rumusnya sederhana. LIFO reserve = inventori FIFO dikurangi inventori LIFO. Dan untuk laba: COGS FIFO = COGS LIFO dikurangi perubahan LIFO reserve. Logikanya: bila reserve membesar, berarti selisih harga lama dan baru makin lebar, sehingga COGS FIFO makin jauh di bawah COGS LIFO.",
        "Contoh ilustratif: PT SamudraLog (fiktif, ilustratif) melaporkan inventori LIFO Rp620 dan inventori FIFO Rp850 — jadi LIFO reserve akhir Rp230. Reserve awal Rp190, sehingga perubahannya Rp40. COGS LIFO Rp1.400. Maka COGS FIFO = Rp1.400 dikurangi Rp40 = Rp1.360. Hitung sendiri di lab: dua angka ini adalah kunci normalisasi yang dipakai analis CFA untuk setiap emiten LIFO.",
      ],
      formula: String.raw`\text{LIFO reserve} = \text{Inventori FIFO} - \text{Inventori LIFO} \quad;\quad COGS_{\text{FIFO}} = COGS_{\text{LIFO}} - \Delta \text{LIFO reserve}`,
      formulaNote: "Inventori FIFO Rp850 dan inventori LIFO Rp620 (ilustratif) menghasilkan LIFO reserve akhir Rp230. Perubahan reserve adalah Rp230 dikurangi Rp190 = Rp40. Interpretasi: reserve yang membesar Rp40 berarti COGS FIFO Rp40 lebih rendah dari COGS LIFO — laba FIFO lebih tinggi Rp40 sebelum pajak. Contoh angka: COGS LIFO Rp1.400 dikurangi Rp40 = COGS FIFO Rp1.360.",
      tasks: [
        { id: "t1", text: "Hitung `reserve` akhir (inventori FIFO dikurangi inventori LIFO)" },
        { id: "t2", text: "Hitung `fifo_cogs` dari COGS LIFO dikurangi perubahan reserve, cetak keduanya" },
      ],
      expected: "reserve=230  fifo_cogs=1360",
      hints: [
        "LIFO reserve = inventori FIFO dikurangi inventori LIFO.",
        "Perubahan reserve = reserve akhir dikurangi reserve awal (190).",
        "reserve = fifo_inv - lifo_inv\nfifo_cogs = lifo_cogs - (reserve - 190)",
      ],
      code: {
        starter: `fifo_inv, lifo_inv = 850, 620  # Rp juta, ilustratif\nlifo_cogs = 1400\nreserve_awal = 190\n\n# TULIS KODEMU\nreserve = \nfifo_cogs = \n\nprint(f"reserve={reserve}  fifo_cogs={fifo_cogs}")`,
        lockLines: 3,
        solution: `fifo_inv, lifo_inv = 850, 620  # Rp juta, ilustratif\nlifo_cogs = 1400\nreserve_awal = 190\n\n# TULIS KODEMU\nreserve = fifo_inv - lifo_inv\nfifo_cogs = lifo_cogs - (reserve - reserve_awal)\n\nprint(f"reserve={reserve}  fifo_cogs={fifo_cogs}")`,
        checks: [
          { kind: "equal", task: "t1", name: "reserve", value: 230, tol: 1e-9, label: "`reserve` seharusnya 230", msg: "850 dikurangi 620 = 230. Reserve adalah selisih FIFO dan LIFO." },
          { kind: "equal", task: "t2", name: "fifo_cogs", value: 1360, tol: 1e-9, label: "`fifo_cogs` seharusnya 1360", msg: "1400 dikurangi perubahan reserve 40 = 1360." },
          { kind: "stdout_matches", task: "t2", pattern: "reserve=230\\s+fifo_cogs=1360", label: "`print` menampilkan keduanya", msg: "Format: reserve=...  fifo_cogs=... ." },
        ],
      },
      reference: "LIFO reserve = FIFO dikurangi LIFO. COGS FIFO = COGS LIFO dikurangi perubahan reserve.",
    },
    {
      id: "lifo-liquidation",
      eyebrow: "Langkah 4 · LIFO Liquidation",
      title: "Laba sekali saja dari lapisan lama",
      prose: [
        "LIFO liquidation terjadi ketika perusahaan menjual lebih banyak unit daripada yang dibelinya — sehingga ia terpaksa menggali lapisan inventori lama yang dibeli bertahun-tahun lalu dengan harga jauh lebih murah. COGS tiba-tiba memakai harga kuno, laba melonjak, dan manajemen bisa terlihat brilian — padahal tidak ada yang berubah dari operasi.",
        "Contoh ilustratif: PT SamudraLog menjual 100 unit dari lapisan tahun 2019 yang berharga Rp10 per unit, padahal harga pengganti hari ini Rp14. Laba tambahan yang muncul hanya dari selisih harga adalah 100 dikali Rp4 = Rp400. Dengan tarif pajak 25 persen (ilustratif), pajaknya Rp100 dan laba setelah pajak naik Rp300 — semuanya sekali saja, tidak berulang.",
        "Bagi analis, liquidation adalah red flag ganda. Pertama, laba tahun itu tidak bisa dipakai untuk memproyeksikan laba tahun depan — lapisan lama tidak bisa dijual dua kali. Kedua, liquidation sering menandakan perusahaan kehabisan stok karena penjualan melemah atau rantai pasok terganggu, bukan karena permintaan meledak. Perusahaan wajib mengungkapkan efek liquidation di catatan kaki; analis yang melewatkannya akan memproyeksikan laba semu ke masa depan.",
      ],
      formula: String.raw`\text{Laba liquidation} = \text{unit lama terjual} \times (\text{harga pengganti} - \text{harga lama})`,
      formulaNote: "Unit lama terjual 100 unit (ilustratif); harga lama Rp10 dan harga pengganti Rp14 per unit. Interpretasi: laba Rp400 ini bukan dari operasi yang membaik, melainkan dari selisih harga historis — dan ia hilang tahun depan saat lapisan lama habis. Contoh angka: 100 dikali Rp4 = Rp400 sebelum pajak; setelah pajak 25 persen, Rp300.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai laba tahun liquidation untuk valuasi dengan kelipatan laba. Laba itu mengandung Rp300 sekali saja — keluarkan dulu sebelum menghitung P/E atau memproyeksikan.",
      },
      quiz: [
        {
          q: "Perusahaan LIFO mengalami liquidation dan labanya melonjak. Bagaimana analis seharusnya memperlakukan lonjakan itu?",
          options: [
            { text: "Menganggapnya perbaikan operasi yang berkelanjutan", why: "Salah: lapisan lama hanya bisa dijual sekali — lonjakan tidak berulang." },
            { text: "Mengeluarkannya dari laba normalisasi karena bersifat sekali saja", why: "Benar: laba liquidation berasal dari selisih harga historis, bukan operasi. Proyeksi harus memakai laba tanpa efek ini.", correct: true },
            { text: "Menambahkannya ke proyeksi tahun depan", why: "Salah: tahun depan tidak ada lagi lapisan murah yang sama untuk dijual." },
            { text: "Mengabaikannya karena sudah dikenai pajak", why: "Salah: pajak tidak mengubah sifatnya yang tidak berulang." },
          ],
        },
      ],
      reference: "Liquidation = jual lapisan lama murah. Laba naik sekali saja; keluarkan dari laba normalisasi.",
    },
    {
      id: "write-down",
      eyebrow: "Langkah 5 · Write-Down",
      title: "Saat gudang bernilai kurang dari harganya",
      prose: [
        "Inventori dicatat sebesar nilai yang lebih rendah antara biaya perolehan dan nilai yang bisa direalisasi. Di bawah IFRS, pembandingnya adalah net realizable value (NRV): estimasi harga jual dikurangi biaya penyelesaian dan penjualan. Di bawah US GAAP, pembandingnya adalah market — yang didefinisikan sebagai replacement cost yang dibatasi koridor antara NRV dan NRV dikurangi margin laba normal.",
        "Contoh ilustratif: PT SamudraLog memegang inventori dengan biaya Rp500. Harga jual yang diharapkan Rp480, biaya penjualan Rp20 — NRV adalah Rp460. Di bawah IFRS, write-down adalah Rp500 dikurangi Rp460 = Rp40, diakui sebagai beban dan menurunkan laba periode itu. Di bawah US GAAP, replacement cost Rp470 berada dalam koridor, sehingga market adalah Rp470 dan write-down-nya Rp30. Metode yang sama, angka yang berbeda — lagi-lagi normalisasi diperlukan.",
        "Perbedaan yang paling tajam adalah reversal. IFRS mengizinkan pembalikan write-down bila NRV pulih — misalnya harga jual kembali naik — dan pembalikan itu menambah laba periode pemulihan. US GAAP melarang reversal untuk inventori: sekali diturunkan, nilai itu menjadi basis biaya yang baru. Analis yang membandingkan emiten IFRS dan US GAAP wajib mengingat asimetri ini, karena pemulihan harga menciptakan laba di satu standar tetapi tidak di standar lain.",
      ],
      formula: String.raw`\text{NRV} = \text{harga jual estimasi} - \text{biaya penyelesaian} - \text{biaya penjualan}`,
      formulaNote: "Harga jual estimasi Rp480, biaya penjualan Rp20 (ilustratif), biaya penyelesaian nol. Interpretasi: NRV Rp460 adalah kas bersih yang benar-benar bisa diharapkan dari inventori — bila biaya Rp500 melebihinya, selisih Rp40 adalah kerugian yang sudah terjadi secara ekonomi. Contoh angka: write-down IFRS Rp40; US GAAP Rp30 dengan market Rp470.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Write-down yang ditunda adalah cara klasik menunda pengakuan kerugian: manajemen yang optimistis soal harga jual menahan NRV tetap tinggi. Cek tren write-down terhadap tren harga komoditas — bila harga jatuh 30 persen tetapi write-down nol, curigai estimasi NRV-nya.",
      },
      quiz: [
        {
          q: "Di bawah IFRS, harga jual inventori pulih setelah write-down tahun lalu. Apa yang boleh dilakukan?",
          options: [
            { text: "Tidak boleh apa-apa — nilai turun permanen", why: "Salah: itu aturan US GAAP, bukan IFRS." },
            { text: "Reversal write-down diakui dan menambah laba periode pemulihan", why: "Benar: IFRS mengizinkan reversal sampai sebesar write-down awal. US GAAP melarangnya.", correct: true },
            { text: "Reversal langsung menambah ekuitas tanpa lewat laba", why: "Salah: reversal IFRS lewat laba rugi, bukan langsung ke ekuitas." },
            { text: "Reversal hanya boleh bila inventori sudah terjual", why: "Salah: reversal diakui saat NRV pulih, tidak menunggu penjualan." },
          ],
        },
      ],
      reference: "IFRS: lower of cost or NRV, reversal boleh. US GAAP: lower of cost or market, reversal tidak boleh.",
    },
    {
      id: "turnover-days",
      eyebrow: "Langkah 6 · Lab: Turnover & Days",
      title: "Seberapa cepat gudang berputar — dan cara memalsukannya",
      prose: [
        "Inventory turnover mengukur berapa kali inventori terjual dan diganti dalam setahun: COGS dibagi rata-rata inventori. Days inventory on hand (DOH) adalah 365 dibagi turnover — berapa hari rata-rata barang mengendap di gudang. Turnover tinggi umumnya berarti manajemen inventori efisien; DOH yang membengkak berarti barang menumpuk, usang, atau tidak laku.",
        "Contoh ilustratif: PT SamudraLog mencatat COGS Rp1.825 dan rata-rata inventori Rp365. Turnover adalah 1.825 dibagi 365 = 5,0 kali, dan DOH adalah 365 dibagi 5 = 73 hari. Bandingkan dengan tahun lalu yang DOH-nya 45 hari: barang kini mengendap 28 hari lebih lama. Analis tidak berhenti di angka — ia bertanya mengapa: permintaan melemah, pembelian berlebihan, atau barang usang yang belum di-write-down?",
        "Manipulasi klasiknya adalah channel stuffing: mendorong barang ke distributor di akhir periode agar penjualan dan COGS naik, sehingga turnover terlihat bagus dan inventori akhir terlihat kecil. Deteksinya ada di laporan lain: piutang melonjak bersamaan dengan penjualan, dan arus kas operasi tidak mengikuti laba. Turnover yang membaik bersamaan dengan DSO yang memburuk bukan efisiensi — itu barang yang dipindahkan dari gudang sendiri ke gudang distributor.",
      ],
      formula: String.raw`\text{Turnover} = \frac{COGS}{\text{rata-rata inventori}} \quad;\quad DOH = \frac{365}{\text{Turnover}}`,
      formulaNote: "COGS Rp1.825 dan rata-rata inventori Rp365 (ilustratif, Rp juta). Interpretasi: turnover 5,0 kali berarti seluruh isi gudang terjual dan diganti lima kali setahun; DOH 73 hari berarti setiap rupiah inventori rata-rata mengendap 73 hari sebelum terjual. Contoh angka: 1.825 dibagi 365 = 5,0; 365 dibagi 5,0 = 73 hari.",
      tasks: [
        { id: "t1", text: "Hitung `turnover` (COGS dibagi rata-rata inventori)" },
        { id: "t2", text: "Hitung `days` (365 dibagi turnover), cetak keduanya" },
      ],
      expected: "turnover=5.0  days=73.0",
      hints: [
        "Turnover = COGS dibagi rata-rata inventori.",
        "Days = 365 dibagi turnover.",
        "turnover = cogs / avg_inv\ndays = 365 / turnover",
      ],
      code: {
        starter: `cogs, avg_inv = 1825, 365  # Rp juta, ilustratif\n\n# TULIS KODEMU\nturnover = \ndays = \n\nprint(f"turnover={turnover}  days={days}")`,
        lockLines: 1,
        solution: `cogs, avg_inv = 1825, 365  # Rp juta, ilustratif\n\n# TULIS KODEMU\nturnover = cogs / avg_inv\ndays = 365 / turnover\n\nprint(f"turnover={turnover}  days={days}")`,
        checks: [
          { kind: "equal", task: "t1", name: "turnover", value: 5.0, tol: 1e-9, label: "`turnover` seharusnya 5.0", msg: "1825 dibagi 365 = 5,0 kali per tahun." },
          { kind: "equal", task: "t2", name: "days", value: 73.0, tol: 1e-9, label: "`days` seharusnya 73.0", msg: "365 dibagi 5,0 = 73 hari barang mengendap." },
          { kind: "stdout_matches", task: "t2", pattern: "turnover=5\\.0\\s+days=73\\.0", label: "`print` menampilkan keduanya", msg: "Format: turnover=...  days=... ." },
        ],
      },
      reference: "Turnover = COGS dibagi rata-rata inventori. DOH = 365 dibagi turnover. Waspadai channel stuffing.",
    },
    {
      id: "minicase-dua-perusahaan",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Dua perusahaan identik, dua cerita kas",
      prose: [
        "PT Alpha dan PT Beta (fiktif, ilustratif) adalah perusahaan kembar: penjualan Rp2.000, pembelian yang sama, harga input naik sepanjang tahun. Satu-satunya perbedaan: Alpha memakai FIFO, Beta memakai LIFO. Dari langkah 2 kamu tahu hasilnya: laba kotor Alpha Rp1.000, Beta Rp600; pajak Alpha Rp250, Beta Rp150; laba setelah pajak Alpha Rp750, Beta Rp450.",
        "Bila analis hanya membaca laba, Alpha tampak jauh lebih hebat: labanya 67 persen lebih tinggi. Bila analis membaca kas, ceritanya berbalik: Beta menyimpan kas Rp100 lebih banyak karena pajak yang ditunda, dan kas itulah yang membayar utang, dividen, dan ekspansi. Alpha membayar Rp100 untuk hak memamerkan laba yang lebih tinggi.",
        "Keputusan analis: normalisasi Beta ke FIFO dengan LIFO reserve sebelum membandingkan laba, dan normalisasi Alpha ke LIFO sebelum membandingkan kas. Setelah normalisasi, kedua perusahaan identik — seperti seharusnya, karena operasi mereka memang identik. Pelajaran mini-case ini: jangan pernah memberi premi valuasi untuk laba yang berasal dari metode akuntansi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perusahaan yang berganti metode inventori — misalnya dari LIFO ke FIFO — akan melaporkan lonjakan laba satu kali tanpa perubahan operasi. Cek catatan kaki atas perubahan kebijakan akuntansi sebelum memuji pertumbuhan laba.",
      },
      reference: "Samakan metode dulu, baru bandingkan. Laba dari metode bukan premi valuasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: arus kas dan pajak, LIFO reserve, liquidation, write-down, dan turnover.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Harga naik. Perusahaan FIFO membayar pajak lebih besar dari perusahaan LIFO yang identik. Dampaknya ke arus kas operasi?",
          options: [
            { text: "CFO FIFO lebih tinggi karena labanya lebih tinggi", why: "Salah: pajak yang lebih besar adalah kas keluar — CFO FIFO justru lebih rendah." },
            { text: "CFO FIFO lebih rendah sebesar selisih pajaknya", why: "Benar: pajak FIFO Rp250 versus LIFO Rp150 (ilustratif) — selisih Rp100 mengurangi kas FIFO.", correct: true },
            { text: "CFO keduanya sama", why: "Salah: pajak dibayar berbeda, dan pajak memengaruhi kas." },
            { text: "CFO LIFO lebih rendah karena COGS-nya lebih tinggi", why: "Salah: COGS tinggi menurunkan pajak, sehingga kas LIFO lebih tebal." },
          ],
        },
        {
          q: "Inventori FIFO Rp850, inventori LIFO Rp620, reserve awal Rp190, COGS LIFO Rp1.400. COGS FIFO?",
          options: [
            { text: "Rp1.360", why: "Benar: reserve akhir 230, perubahan 40; 1.400 dikurangi 40 = 1.360.", correct: true },
            { text: "Rp1.440", why: "Salah: perubahan reserve dikurangi, bukan ditambah." },
            { text: "Rp1.630", why: "Salah: itu COGS LIFO ditambah reserve akhir — bukan rumusnya." },
            { text: "Rp1.170", why: "Salah: itu COGS LIFO dikurangi reserve akhir penuh — yang dipakai adalah perubahannya." },
          ],
        },
        {
          q: "LIFO liquidation membuat laba melonjak. Sifat lonjakan itu?",
          options: [
            { text: "Berulang setiap tahun", why: "Salah: lapisan lama hanya bisa dijual sekali." },
            { text: "Sekali saja, dari selisih harga historis — keluarkan dari laba normalisasi", why: "Benar: laba liquidation bukan dari operasi dan tidak berulang.", correct: true },
            { text: "Tanda permintaan sedang meledak", why: "Salah: liquidation justru sering menandakan stok menipis atau pembelian terganggu." },
            { text: "Tidak perlu diungkapkan", why: "Salah: efek liquidation wajib diungkapkan di catatan kaki." },
          ],
        },
        {
          q: "IFRS versus US GAAP untuk write-down inventori: perbedaan kuncinya?",
          options: [
            { text: "IFRS memakai market, US GAAP memakai NRV", why: "Salah: terbalik — IFRS memakai NRV, US GAAP memakai market." },
            { text: "IFRS boleh reversal saat NRV pulih; US GAAP melarang reversal", why: "Benar: asimetri ini membuat pemulihan harga menciptakan laba di IFRS tetapi tidak di US GAAP.", correct: true },
            { text: "Keduanya melarang reversal", why: "Salah: IFRS mengizinkan reversal." },
            { text: "Keduanya memakai lower of cost or NRV", why: "Salah: US GAAP memakai lower of cost or market." },
          ],
        },
        {
          q: "COGS Rp1.825, rata-rata inventori Rp365. Turnover dan DOH?",
          options: [
            { text: "5,0 kali dan 73 hari", why: "Benar: 1.825 dibagi 365 = 5,0; 365 dibagi 5,0 = 73 hari.", correct: true },
            { text: "5,0 kali dan 45 hari", why: "Salah: 365 dibagi 5,0 adalah 73, bukan 45." },
            { text: "3,65 kali dan 100 hari", why: "Salah: hitung ulang 1.825 dibagi 365." },
            { text: "0,2 kali dan 73 hari", why: "Salah: turnover adalah COGS dibagi inventori, bukan sebaliknya." },
          ],
        },
      ],
      summary: [
        "Harga naik: FIFO = laba tinggi, pajak tinggi, kas lebih tipis; LIFO menunda pajak.",
        "LIFO reserve = inventori FIFO dikurangi LIFO; COGS FIFO = COGS LIFO dikurangi perubahan reserve.",
        "LIFO liquidation: laba sekali saja dari lapisan lama — keluarkan dari laba normalisasi.",
        "Write-down: IFRS lower of cost or NRV dan reversal boleh; US GAAP lower of cost or market dan reversal dilarang.",
        "Turnover = COGS dibagi rata-rata inventori; DOH = 365 dibagi turnover; waspadai channel stuffing.",
      ],
      next: { label: "PM-A4C — Aset Tetap, Utang & Sewa", href: "/learn/pm-a4c-fixed-assets-debt" },
    },
  ],
};
