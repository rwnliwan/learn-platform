import type { V2Lesson } from "../lib/types";

export const fr3: V2Lesson = {
  slug: "fr3-data-fraud",
  track: "Fraud & AML Analytics",
  module: "Lanskap Fraud",
  title: "FR3 — Sinyal & Data Fraud",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Transaksi Rp50 ribu yang \"bersih\" tapi kotor",
      prose: [
        "Tim fraud \"DanaKita\" punya rule sederhana: tahan transaksi di atas Rp1 juta dari device baru. Suatu pagi, 40 transaksi Rp50 ribu lolos mulus — di bawah ambang, nominal kecil, tidak ada yang ditahan. Tiga hari kemudian: 40 akun itu masing-masing menarik Rp5 juta. Total Rp200 juta hilang.",
        "Yang terjadi: penyerang melakukan \"warming\" — transaksi kecil yang terlihat normal untuk membangun riwayat, lalu menyerang besar. Rule yang hanya melihat nominal transaksi ini buta total. Yang bisa menangkapnya? Sinyal di luar nominal: 40 akun dibuat di hari yang sama, dari 3 device yang sama, login jam 2–4 pagi, lalu semuanya \"aktif\" bersamaan.",
        "Data untuk menangkap pola ini sudah ada semua di log mereka — device ID, timestamp, IP. Mereka hanya tidak pernah menggabungkannya. Lesson ini: fraud detection bukan soal data yang kurang, tapi soal sinyal yang belum dirakit.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Makin banyak data = makin bagus deteksinya.\" Data yang tidak digabungkan = beban, bukan aset. DanaKita punya semua data warming attack tapi tetap kebobolan Rp200 juta. Yang membedakan bukan volume data, melainkan apakah sinyal-sinyal itu dirakit menjadi fitur yang bisa dibaca model.",
      },
      reference: "6 sumber sinyal: transaksi, device, sesi, perilaku, geolokasi, graph.",
    },
    {
      id: "sinyal",
      eyebrow: "Langkah 2 · 6 sumber sinyal",
      title: "Anatomi satu transaksi",
      prose: [
        "Satu kali tap \"bayar\" menghasilkan 6 lapisan data. Transaksi: nominal, merchant, jam. Device: fingerprint, OS, IP. Sesi: login baru, durasi, urutan layar. Perilaku: kecepatan ketik, pola navigasi, keraguan. Geolokasi: kota, jarak dari biasa, impossible travel. Graph: relasi antar akun, device, rekening.",
        "Data transaksi ada di mana-mana (100% perusahaan punya), tapi sinyal paling diskriminatif — perilaku (45%) dan graph (30%) — justru paling jarang siap. Analis yang bisa membangun pipeline sinyal perilaku/graph adalah yang paling langka dan paling dicari.",
        "Sinyal terkuat selalu tentang perubahan dan kecepatan, bukan nilai statis. \"Device baru + 9 transaksi/jam + jam 3 pagi\" jauh lebih mencurigakan daripada \"transaksi Rp10 juta\" sendirian. Fraud adalah perilaku menyimpang, bukan angka besar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kualitas > kuantitas, dan konteks > keduanya. 10 kolom yang akurat (timestamp presisi detik, fingerprint stabil, nominal benar) mengalahkan 100 kolom yang setengah rusak. Sebagian besar \"model buruk\" sebenarnya adalah data buruk yang dimodelkan dengan baik.",
      },
      reference: "Satu sinyal = gosip; tiga sinyal independen = bukti. Jangan tahan transaksi dari 1 sinyal.",
    },
    {
      id: "fingerprint",
      eyebrow: "Langkah 3 · Device fingerprint",
      title: "KTP-nya sebuah HP",
      prose: [
        "Device fingerprint adalah identitas probabilistik sebuah perangkat, dirakit dari puluhan atribut: OS + versi, browser + versi, resolusi layar, bahasa, timezone, hingga canvas rendering. Akun bisa ganti, nomor HP bisa ganti, tapi device fisik sulit diganti massal — satu device yang dipakai 40 akun baru = sinyal farming yang sangat kuat.",
        "Jebakannya: fingerprint yang exact match akan menandai \"Chrome update dari v120 ke v121\" sebagai device baru → banjir false positive. Sistem produksi memakai fuzzy matching: \"4 dari 5 atribut inti cocok = device yang sama\". Terlalu kaku = berisik, terlalu longgar = penipu lolos dengan spoofing ringan.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `fingerprint()` dari 5 atribut" },
        { id: "t2", text: "Cek 3 device percobaan: mana yang \"BARU\" vs \"dikenal\"" },
        { id: "t3", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "device lama dikenal, update browser BARU (exact match!), device asing BARU",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Exact match menandai \"update browser rutin\" sebagai device baru. Di produksi ini berarti banjir false positive setiap kali Chrome rilis update. Fuzzy matching (mis. 4 dari 5 atribut cocok) adalah standar — dengan trade-off spoofing ringan.",
      },
      hints: [
        "Gabungkan 5 atribut jadi satu string dengan pemisah, lalu hash.",
        "hashlib.md5(mentah.encode()).hexdigest()[:10] cukup untuk simulasi.",
        "Cek apakah fp ada di set dikenal — set membuat pencarian cepat.",
      ],
      code: {
        starter: `import hashlib\n\ndef fingerprint(os, browser, resolusi, bahasa, timezone):\n    # TULIS KODEMU: gabungkan atribut lalu hash (10 karakter)\n    mentah =\n    return \n\ndikenal = {\n    fingerprint("Android 14", "Chrome 120", "1080x2400", "id-ID", "WITA"),\n    fingerprint("Android 14", "Chrome 121", "1080x2400", "id-ID", "WITA"),\n}\n\npercobaan = [\n    ("Android 14", "Chrome 120", "1080x2400", "id-ID", "WITA"),  # device lama\n    ("Android 14", "Chrome 122", "1080x2400", "id-ID", "WITA"),  # update browser\n    ("iOS 17", "Safari 17", "1170x2532", "en-US", "WIB"),         # device asing\n]\n\nfor p in percobaan:\n    fp = fingerprint(*p)\n    status = "dikenal" if fp in dikenal else "BARU"\n    print(f"{fp}  {status}   {p[0]}, {p[1]}")`,
        lockLines: 6,
        solution: `import hashlib\n\ndef fingerprint(os, browser, resolusi, bahasa, timezone):\n    # TULIS KODEMU: gabungkan atribut lalu hash (10 karakter)\n    mentah = f"{os}|{browser}|{resolusi}|{bahasa}|{timezone}"\n    return hashlib.md5(mentah.encode()).hexdigest()[:10]\n\ndikenal = {\n    fingerprint("Android 14", "Chrome 120", "1080x2400", "id-ID", "WITA"),\n    fingerprint("Android 14", "Chrome 121", "1080x2400", "id-ID", "WITA"),\n}\n\npercobaan = [\n    ("Android 14", "Chrome 120", "1080x2400", "id-ID", "WITA"),  # device lama\n    ("Android 14", "Chrome 122", "1080x2400", "id-ID", "WITA"),  # update browser\n    ("iOS 17", "Safari 17", "1170x2532", "en-US", "WIB"),         # device asing\n]\n\nfor p in percobaan:\n    fp = fingerprint(*p)\n    status = "dikenal" if fp in dikenal else "BARU"\n    print(f"{fp}  {status}   {p[0]}, {p[1]}")`,
        checks: [
          { kind: "defined", task: "t1", name: "fingerprint", label: "`fingerprint` terdefinisi", msg: "Buat fungsi fingerprint(os, browser, resolusi, bahasa, timezone)." },
          { kind: "stdout_matches", task: "t2", pattern: "dikenal\\s+Android 14, Chrome 120", label: "Device lama dikenali", msg: "Baris pertama harus berstatus 'dikenal'." },
          { kind: "stdout_matches", task: "t2", pattern: "BARU\\s+iOS 17, Safari 17", label: "Device asing ditandai BARU", msg: "Baris ketiga harus berstatus 'BARU'." },
        ],
      },
      reference: "Fingerprint = identitas probabilistik device; produksi pakai fuzzy matching, bukan exact match.",
    },
    {
      id: "skor",
      eyebrow: "Langkah 4 · Skor risiko",
      title: "Menggabungkan sinyal jadi satu angka",
      prose: [
        "Skor risiko paling sederhana = jumlah tertimbang sinyal. Contoh: nominal 25 + device baru 20 + jam aneh 15 + lokasi baru 20 + velocity 20 = 100. Transaksi dengan skor ≥ 60 ditahan, 35–60 direview manual.",
        "Yang harus dipahami: skor ini bukan \"kebenaran\" — ia adalah hipotesis analis yang bisa diuji. Kalau bobot \"jam aneh\" terlalu besar, nasabah shift malam akan protes (false positive). Dan skor 85 hanyalah \"85 dari 100 poin kecurigaan menurut bobot yang kita tentukan\" — bukan probabilitas, kecuali sudah dikalibrasi.",
      ],
      formula: String.raw`S = \sum_{i=1}^{n} w_i \cdot s_i`,
      formulaNote: "s_i = skor sinyal ke-i (dinormalisasi 0–1); w_i = bobot — opini analis yang dikuantifikasi.",
      tasks: [
        { id: "t1", text: "Implementasikan `skor()` dari 5 sinyal" },
        { id: "t2", text: "Skor 8 transaksi dan tentukan status: TAHAN (≥60), review (≥35), lolos" },
        { id: "t3", text: "Cetak tiap transaksi dengan `print`" },
      ],
      expected: "trx dengan skor≥60 = TAHAN; 35–60 = review; sisanya lolos",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Skor 85 berarti 85% kemungkinan fraud.\" Salah. Skor tanpa kalibrasi = peringkat, bukan peluang. Kalibrasi = memastikan skor 85 benar-benar fraud 85% dari waktu — dan itu pekerjaan terpisah.",
      },
      hints: [
        "Tiap sinyal: normalisasi dulu (min(nilai/maks, 1.0)), lalu kali bobot.",
        "Bobot: nominal 25, device baru 20, jam aneh 15, lokasi baru 20, velocity 20.",
        "status = 'TAHAN' jika s>=60, 'review' jika s>=35, else 'lolos'.",
      ],
      code: {
        starter: `# (nominal_jt, device_baru, jam, lokasi_baru, velocity_1h)\ntrx = [\n    (0.2, 0, 14, 0, 2),\n    (1.5, 1,  3, 1, 9),\n    (0.5, 0, 20, 0, 3),\n    (3.0, 1,  2, 1, 12),\n    (0.1, 0, 10, 0, 1),\n    (0.8, 0, 15, 0, 4),\n    (2.0, 0,  4, 1, 7),\n    (0.3, 1, 11, 0, 2),\n]\n\n# TULIS KODEMU: jumlah tertimbang 5 sinyal (maks 100)\ndef skor(nominal, device_baru, jam, lokasi_baru, vel):\n    s = 0\n    s += \n    return s\n\nfor i, t in enumerate(trx):\n    s = skor(*t)\n    flag = "TAHAN" if s >= 60 else ("review" if s >= 35 else "lolos")\n    print(f"trx-{i+1}: skor={s:5.1f}  {flag}")`,
        lockLines: 12,
        solution: `# (nominal_jt, device_baru, jam, lokasi_baru, velocity_1h)\ntrx = [\n    (0.2, 0, 14, 0, 2),\n    (1.5, 1,  3, 1, 9),\n    (0.5, 0, 20, 0, 3),\n    (3.0, 1,  2, 1, 12),\n    (0.1, 0, 10, 0, 1),\n    (0.8, 0, 15, 0, 4),\n    (2.0, 0,  4, 1, 7),\n    (0.3, 1, 11, 0, 2),\n]\n\n# TULIS KODEMU: jumlah tertimbang 5 sinyal (maks 100)\ndef skor(nominal, device_baru, jam, lokasi_baru, vel):\n    s = 0\n    s += min(nominal / 2.0, 1.0) * 25\n    s += device_baru * 20\n    s += (1 if (jam < 5 or jam > 23) else 0) * 15\n    s += lokasi_baru * 20\n    s += min(vel / 10.0, 1.0) * 20\n    return s\n\nfor i, t in enumerate(trx):\n    s = skor(*t)\n    flag = "TAHAN" if s >= 60 else ("review" if s >= 35 else "lolos")\n    print(f"trx-{i+1}: skor={s:5.1f}  {flag}")`,
        checks: [
          { kind: "defined", task: "t1", name: "skor", label: "`skor` terdefinisi", msg: "Buat fungsi skor(nominal, device_baru, jam, lokasi_baru, vel)." },
          { kind: "stdout_matches", task: "t2", pattern: "trx-4: skor=\\s*100\\.0\\s+TAHAN", label: "trx-4 (paling mencurigakan) TAHAN", msg: "trx-4: 25+20+15+20+20 = 100 → TAHAN." },
          { kind: "stdout_matches", task: "t2", pattern: "trx-1: skor=\\s*6\\.5\\s+lolos", label: "trx-1 (bersih) lolos", msg: "trx-1: 0,2/2x25 = 2,5 + 0 + 0 + 0 + 2/10x20 = 4 → 6,5 → lolos." },
        ],
      },
      reference: "Skor = opini terkuantifikasi. Kalibrasi dan uji sebelum percaya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Sinyal mana untuk kasus apa",
      prose: [
        "Card fraud (kartu curian belanja online) → transaksi + geolokasi + device. Contoh: kartu terbit di Jakarta, dipakai beli iPhone Rp18 jt dengan pengiriman ke kota lain dari device baru → tahan.",
        "ATO (akun dibajak) → sesi + perilaku + device. Jejaknya: device baru + login sukses pertama kali, ganti alamat kirim < 30 menit setelah login device baru, velocity checkout 3–5 transaksi nominal besar dalam 15 menit padahal histori 2 transaksi/bulan. Mule / farming (jaringan) → graph + device + sesi: N akun berbagi 1 device, dibuat berdekatan, aktif bersamaan — tidak ada sinyal tunggal yang cukup, harus agregat lintas akun.",
        "APP scam (korban transfer sukarela) → perilaku + edukasi, bukan sinyal teknis. Device benar, OTP benar, lokasi benar — semua sinyal teknis \"bersih\". Senjata utama: friction (jeda + peringatan), bukan blokir. Contoh: pop-up \"Rekening ini baru pertama kali menerima darimu. Yakin? Tunggu 30 detik.\"",
      ],
      tasks: [],
      reference: "Kasus jaringan tidak terlihat dari satu transaksi — butuh agregat lintas akun (graph).",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "4 transaksi, 1 penipu — temukan dia",
      prose: [
        "Empat transaksi e-wallet pagi ini, semuanya nominal wajar (tidak ada yang >Rp1 juta). T1: Rp400 rb, device dikenal, jam 09:12, lokasi biasa, 2 trx/jam. T2: Rp750 rb, device baru, jam 03:40, lokasi baru (beda pulau), 11 trx/jam, akun dibuat 2 hari lalu. T3: Rp900 rb, device dikenal, jam 13:05, lokasi biasa, 1 trx/jam. T4: Rp600 rb, device baru, jam 10:20, lokasi biasa, 3 trx/jam, akun 3 tahun.",
        "Pertanyaan: (a) Urutkan T1–T4 dari paling mencurigakan, (b) sinyal apa yang paling menentukan urutanmu, (c) T4 — tahan atau tidak?",
        "Pembahasan: (a) T2 > T4 > T3 > T1. T2 mengumpulkan LIMA sinyal merah sekaligus (device baru + jam aneh + lokasi aneh + velocity tinggi + akun baru) — pola warming/farming klasik. T1 bersih total. (b) Bukan nominal (semuanya <Rp1 juta!) — melainkan kombinasi perubahan + kecepatan + umur akun. Satu sinyal merah = waspada; lima = tahan. (c) Jangan tahan otomatis — review ringan. T4 hanya punya 1 sinyal merah (device baru) pada akun tua 3 tahun — pola khas \"ganti HP\". Menahannya = false positive yang bikin nasabah marah. Respons tepat: step-up authentication (minta OTP/biometrik), bukan blokir.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Aksi adalah spektrum gesekan, bukan biner tahan/lolos. Step-up untuk skor menengah sering lebih optimal daripada block: menangkap fraud tanpa mengusir nasabah legit.",
      },
      reference: "Satu sinyal = waspada; lima sinyal independen = tahan. 1 sinyal pada akun tua = step-up, bukan blokir.",
    },
    {
      id: "late-events",
      eyebrow: "Langkah 7 · Late-arriving events",
      title: "15% transaksimu datang 6 jam terlambat",
      prose: [
        "Audit pipeline PayKu menemukan angka yang tidak pernah muncul di dashboard: 15% transaksi tiba di data warehouse 6 jam (atau lebih) setelah terjadi. Penyebabnya wajar-wajar saja — settlement batch dari acquiring yang dikirim per 6 jam, QRIS offline di daerah yang sinkronisasinya menunggu sinyal, dan file rekonsiliasi mitra yang di-upload tengah malam. Datanya tidak hilang; ia hanya datang terlambat. Dan keterlambatan 6 jam di fraud sama berbahayanya dengan kehilangan.",
        "Dampak pertamanya ke fitur velocity. Serangan carding jam 14.00: 40 transaksi Rp300 ribu dalam 30 menit. Sistem real-time yang menghitung count_1h pada jam 14.30 hanya melihat 34 transaksi — 6 di antaranya masih \"dalam perjalanan\" dari batch acquiring. Skornya 72, di bawah threshold tahan 80. Jam 20.00 datanya lengkap, skornya 91 — tetapi uangnya sudah cair 5 jam lalu. Fitur yang dihitung di atas data yang belum lengkap bukan fitur yang salah rumus; ia fitur yang berbohong dengan percaya diri.",
        "Dampak keduanya ke label. Transaksi yang tampak \"normal\" di hari-H ternyata fraud yang chargeback-nya datang 45 hari kemudian — ini dibahas di FR4. Tetapi late events menambah lapisan kedua: transaksi yang bahkan tidak TERCATAT saat label diekstrak. Training set yang diekstrak \"kemarin\" kehilangan 15% populasinya secara sistematis — dan 15% itu bukan acak: ia terkonsentrasi di kanal-kanal tertentu (QRIS offline, acquiring batch). Model belajar dari dunia yang 15%-nya disensor.",
        "Keputusan desainnya ada tiga, dan ketiganya butuh angka. Satu: definisikan event-time vs processing-time secara eksplisit di setiap tabel — kolom occurred_at (kapan terjadi) tidak boleh sama dengan ingested_at (kapan tercatat). Dua: tetapkan watermark — fitur batch dihitung dengan cutoff T−6 jam, dan monitoring melacak % late per sumber per jam; jika satu sumber melewati 20%, alarm berbunyi sebelum modelnya yang berbunyi salah. Tiga: two-tier scoring — skor real-time memakai data best-effort (cepat, bisa direvisi), lalu skor rekonsiliasi batch 6 jam kemudian memakai data lengkap untuk keputusan hold lanjutan dan untuk label training.",
        "Aturan keputusan pembersihan yang ditempel di runbook: tidak ada training set yang diekstrak dengan ingested_at < occurred_at + 24 jam untuk kanal batch; setiap anomali velocity yang melibatkan kanal batch wajib dicek ulang setelah watermark lewat sebelum dinyatakan false positive; dan laporan metrik model selalu mencantumkan \"% data late pada periode evaluasi\" sebagai footnote — karena precision 23% yang dihitung di atas data 85% lengkap bukan angka yang sama dengan precision 23% di atas data 100% lengkap.",
        "Biaya pilihannya konkret. Membangun two-tier scoring: ±Rp120 juta (streaming watermark + job rekonsiliasi). Tidak membangun: setiap serangan via kanal batch mendapat \"diskon deteksi\" 6 jam — pada rata-rata loss Rp1,1 juta per kasus fraud dan 2.000 kasus/bulan, kebocoran 15% kanal berarti ratusan juta per bulan yang lolos karena datanya belum datang. Keterlambatan adalah fitur musuh yang tidak perlu mereka bayar.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: data fraud selalu datang terlambat dan ganda — rancang seolah itu normal",
        type: "risk",
        body: "Investigator yang matang tidak pernah bertanya \"apakah datanya bersih?\" — ia bertanya \"ketidakbersihan mana yang merusak keputusan mana?\". Ini pergeseran berpikir yang fundamental: data pipeline fraud tidak akan pernah bersih, sehingga pertanyaannya bukan bagaimana membersihkannya sempurna, melainkan bagaimana merancang keputusan yang tahan terhadap kotoran yang sudah diketahui polanya. Late events merusak velocity dan label; duplikat merusak count dan agregat; keduanya tidak merusak semuanya secara merata. Maka latih dirimu untuk selalu memasangkan setiap angka metrik dengan pertanyaan \"di atas data selengkap apa angka ini dihitung?\" — precision tanpa konteks kelengkapan data adalah angka yatim. Dan waspadai bias seleksi yang tersembunyi: data yang telat bukan sampel acak, ia terkonsentrasi di kanal dan geografi tertentu, sehingga model yang dilatih di atasnya buta secara sistematis terhadap segmen itu. Ketika suatu kanal tiba-tiba \"terlihat aman\" di dashboard, investigator yang baik mengecek dulu apakah kanalnya aman atau datanya yang belum datang. Itulah intuisi intinya: rancang setiap keputusan seolah data kotor adalah keadaan normal, bukan pengecualian — karena memang demikian adanya.",
      },
      reference: "Pisahkan occurred_at vs ingested_at; watermark T−6 jam; training set kanal batch = ingested_at > occurred_at + 24 jam.",
    },
    {
      id: "duplikat-bifast",
      eyebrow: "Langkah 8 · Duplikat retry",
      title: "BI-FAST retry: satu transfer, dua catatan",
      prose: [
        "BI-FAST dirancang untuk tidak pernah kehilangan uang — jika respons timeout, bank pengirim me-retry dengan end-to-end ID yang sama. Di level jaringan ini benar dan aman. Di level data warehouse, retry yang kedua sering tercatat sebagai baris kedua: satu transfer Rp5 juta menjadi dua catatan Rp5 juta dengan timestamp selisih 40 detik. Bukan fraud, bukan bug bisnis — hanya plumbing yang bocor ke lantai analis.",
        "Dampaknya langsung ke fitur count. Nasabah transfer Rp5 juta sekali; retry membuatnya tercatat 2 kali dalam 1 menit. Fitur count_10m naik dari 1 ke 2, velocity_1h ikut terdistorsi, dan pada nasabah yang memang aktif, akumulasi duplikat bisa mendorong skor melewati threshold. Hasilnya: false positive storm setiap kali ada gangguan jaringan di sisi BI-FAST — tepat di saat tim operasional paling sibuk menangani gangguan itu sendiri. Sistem deteksi ikut panik bersama infrastrukturnya.",
        "Kesalahan pembersihan yang paling umum: dedup berdasarkan (nominal, timestamp, rekening). Terlihat masuk akal — sampai kamu menyadari bahwa pembayaran rutin yang legit (gaji, arisan, langganan) memang memiliki nominal dan pola waktu yang identik. Dedup agresif menggabungkan dua transfer BERBEDA yang kebetulan sama nominalnya; dedup longgar membiarkan retry lolos sebagai dua transaksi. Keduanya merusak: yang pertama menghapus sinyal fraud (velocity asli terpotong), yang kedua menciptakan sinyal palsu.",
        "Aturan keputusan pembersihan, berlapis. Lapisan satu: idempotency key = end-to-end transaction ID + kode bank pengirim — ini kunci yang dirancang protokolnya sendiri untuk retry, pakai itu, jangan temukan sendiri. Lapisan dua: dedup window 24 jam — retry BI-FAST yang sah selalu dalam hitungan menit; dua transaksi \"sama\" yang terpisah 3 hari adalah dua transaksi. Lapisan tiga: simpan DUA tabel — raw (apa adanya, untuk forensik) dan deduped (untuk fitur dan training). Investigator yang memeriksa kasus butuh melihat retry-nya; model yang belajar tidak boleh menghitungnya dua kali.",
        "Satu jebakan terakhir: jangan pernah memakai hasil dedup untuk mengubah label. Transaksi yang terduplikat karena retry tetap SATU peristiwa ekonomi — jika ia fraud, labelnya satu; jika ia legit, labelnya satu. Tim yang menghitung \"fraud rate\" di atas tabel raw akan melaporkan angka 2x lipat setiap ada gangguan jaringan, lalu panik, lalu menyalahkan model. Metrik dihitung di atas tabel deduped; forensik bekerja di atas tabel raw. Dua tabel, dua kegunaan, tidak tertukar.",
        "Monitoring dedup-nya sendiri wajib ada: rasio dedup harian per kanal (normalnya 2–4% untuk BI-FAST) adalah termometer kesehatan plumbing. Rasio melonjak ke 12% = ada gangguan retry di hulu — dan itu juga sinyal bahwa skor velocity 6 jam ke depan tidak bisa dipercaya penuh. Investigator yang melihat lonjakan alert tanpa mengecek rasio dedup akan mengejar hantu yang diciptakan kabel, bukan penipu.",
      ],
      tasks: [],
      reference: "Dedup key = end-to-end ID + bank; window 24 jam; raw untuk forensik, deduped untuk model. Jangan dedup pakai (nominal, waktu).",
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
        "6 sumber sinyal: transaksi, device, sesi, perilaku, geolokasi, graph — analis senior membaca semuanya, bukan cuma nominal.",
        "Device fingerprint = KTP-nya HP; pakai fuzzy matching, bukan exact match.",
        "Sinyal terkuat = perubahan + kecepatan (velocity, device baru, lokasi aneh), bukan nominal.",
        "Skor risiko = opini analis yang dikuantifikasi — kalibrasi sebelum dianggap probabilitas.",
        "Satu sinyal = gosip; tiga sinyal independen = bukti. Kasus jaringan butuh agregat lintas akun.",
      ],
      next: { label: "FR4 — Label Fraud", href: "/learn/fr4-label-fraud" },
      quiz: [
        {
          q: "40 akun baru dari 3 device yang sama, aktif jam 2–4 pagi. Sinyal apa yang PALING menentukan ini serangan terkoordinasi?",
          options: [
            { text: "Nominal transaksi", why: "Nominalnya kecil dan wajar — justru itu yang membuat serangan ini lolos dari rule nominal." },
            { text: "Graph relasi (banyak akun ↔ sedikit device) + sesi (jam)", why: "Tiap akun sendirian terlihat normal. Polanya baru muncul saat agregat lintas akun: 40 akun berbagi 3 device.", correct: true },
            { text: "Kategori merchant", why: "Kategori merchant tidak membedakan akun-akun ini dari pengguna normal." },
            { text: "Warna aplikasi", why: "Bukan sinyal — tidak ada hubungannya dengan perilaku fraud." },
          ],
        },
        {
          q: "Mengapa fingerprint exact-match berbahaya di produksi?",
          options: [
            { text: "Terlalu lambat", why: "Kecepatan bukan masalahnya — masalahnya presisi keputusan." },
            { text: "Update browser/OS rutin akan terdeteksi sebagai 'device baru' → banjir false positive", why: "Atribut device berubah rutin (update Chrome, ganti bahasa). Exact match menandai semuanya sebagai baru. Solusi: fuzzy matching.", correct: true },
            { text: "Tidak bisa dihitung", why: "Bisa dihitung — masalahnya hasilnya salah menandai." },
            { text: "Melanggar privasi", why: "Exact vs fuzzy tidak mengubah status privasinya." },
          ],
        },
        {
          q: "Skor risiko 85 dari rule tertimbang berarti…",
          options: [
            { text: "85% kemungkinan fraud", why: "Skor = poin kecurigaan menurut bobot analis, bukan probabilitas — kecuali sudah dikalibrasi." },
            { text: "85 poin kecurigaan menurut bobot analis — BUKAN probabilitas, kecuali sudah dikalibrasi", why: "Tanpa kalibrasi ia hanya peringkat. Menganggapnya probabilitas adalah kesalahan klasik.", correct: true },
            { text: "Pasti fraud", why: "Tidak ada skor yang berarti 'pasti' — selalu ada false positive." },
            { text: "Tidak ada artinya", why: "Ia berarti sebagai peringkat relatif — hanya bukan probabilitas." },
          ],
        },
        {
          q: "Sinyal dengan information value tertinggi untuk fraud umumnya…",
          options: [
            { text: "Nominal transaksi", why: "Nominal saja kalah kuat — penipu sengaja mengecilkan nominal (kasus DanaKita)." },
            { text: "Velocity dan device baru — perubahan + kecepatan", why: "Fraud adalah perilaku menyimpang yang cepat dan asing — bukan sekadar angka besar.", correct: true },
            { text: "Hari dalam seminggu", why: "Terlalu lemah dan mudah berubah maknanya." },
            { text: "Jenis kelamin", why: "Bukan sinyal perilaku serangan — dan berisiko bias." },
          ],
        },
        {
          q: "Transaksi APP scam (korban transfer sukarela karena ditipu). Sinyal teknis semuanya bersih. Respons terbaik?",
          options: [
            { text: "Blokir semua transfer ke rekening baru", why: "Blokir total = membunuh bisnis transfer yang sah." },
            { text: "Friction: jeda + peringatan + sinyal keraguan perilaku", why: "Tidak ada sinyal teknis yang bisa membedakan 'transfer sukarela normal' dari 'transfer sukarela karena ditipu'.", correct: true },
            { text: "Naikkan limit transfer", why: "Menaikkan limit justru memperbesar kerugian saat scam terjadi." },
            { text: "Abaikan", why: "Mengabaikan = membiarkan kerugian berulang tanpa perlawanan." },
          ],
        },
      ],
    },
  ],
};
