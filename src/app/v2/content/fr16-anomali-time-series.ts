import type { V2Lesson } from "../lib/types";

export const fr16: V2Lesson = {
  slug: "fr16-anomali-time-series",
  track: "Fraud & AML Analytics",
  module: "Teknik Lanjutan",
  title: "FR16 — Anomali Time Series",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp180 ribu yang benar, Rp45 ribu yang salah",
      prose: [
        "PayKu, jam 3 pagi. Transaksi Rp180 ribu — sistem diam. Transaksi Rp45 ribu — sistem berteriak \"carding!\", tahan dana, bangunkan investigator. Pagi harinya investigator bingung: \"Kenapa yang Rp180 ribu lolos?\" Jawabannya: yang Rp180 ribu adalah promo GoFood jam makan siang (normal — baseline promo Rp200 ribu). Yang Rp45 ribu jam 3 pagi adalah 10x lipat dari baseline jam 3 pagi (Rp4 ribu) — carding testing.",
        "\"Besar\" tidak sama dengan \"aneh\". Rp180 ribu < Rp45 ribu dalam rupiah, tapi Rp45 ribu >> Rp180 ribu dalam keanehan. Anomali time series tidak bertanya \"berapa besar?\" — ia bertanya \"berapa besar DIBANDINGKAN dengan yang seharusnya jam segini?\"",
        "Tanpa konteks waktu, Rp45 ribu terlihat tidak bersalah. Dengan konteks waktu, ia berteriak.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Anomali = nilai ekstrem.\" Nilai ekstrem tanpa konteks = setengah cerita. Gaji bulanan Rp50 juta 'ekstrem' dibanding transaksi harian — tapi normal dibanding tanggal 25. Selalu tanyakan: 'ekstrem dibandingkan dengan apa?' — baseline yang salah = alarm yang salah.",
      },
      reference: "Anomali = 'berapa besar dibandingkan yang seharusnya SAAT INI?' — bukan 'berapa besar?'",
    },
    {
      id: "dekomposisi",
      eyebrow: "Langkah 2 · Dekomposisi",
      title: "Y = T + S + R",
      prose: [
        "Dekomposisi klasik: Y = Trend + Seasonal + Residual. Trend (T): arah jangka panjang (pertumbuhan volume). Seasonal (S): pola berulang (harian, mingguan — payday spike tiap tanggal 25, sepi tiap Minggu). Residual (R): sisanya — dan di sinilah anomali tinggal.",
        "Contoh: settlement merchant 7 hari [12, 13, 11, 14, 45, 13, 12] juta. Baseline (median hari non-Jumat) = 12,5. Hari Jumat: residual = 45 − 12,5 = +32,5 = +260%. Tanpa dekomposisi, \"45\" hanya angka besar. Dengan dekomposisi, Jumat berteriak: 260% di atas yang seharusnya.",
      ],
      formula: String.raw`Y_t = T_t + S_t + R_t \quad \Rightarrow \quad \text{anomali jika } |R_t| \text{ ekstrem}`,
      formulaNote: "Cari anomali di residual — setelah trend & musiman dibuang.",
      tasks: [
        { id: "t1", text: "Hitung baseline = median hari non-Jumat" },
        { id: "t2", text: "Hitung residual tiap hari + % terhadap baseline" },
        { id: "t3", text: "Cetak; identifikasi hari anomali" },
      ],
      expected: "Jumat: residual +32.5 (+260%) — anomali jelas",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Musiman palsu = alarm palsu. Ramadan, Harbolnas, gajian — semuanya 'anomali' jika baseline-mu tidak mengenal kalender. Dekomposisi yang baik butuh kalender bisnis, bukan cuma matematika. Tanyakan ke tim bisnis: 'event apa yang menggerakkan angka ini?'",
      },
      hints: [
        "baseline = st.median(data[:4] + data[5:]).",
        "resid = x - baseline; pct = resid / baseline.",
        "print(f'hari {i+1}: {x} jt, residual={r:+.1f} ({r/baseline:+.0%})').",
      ],
      code: {
        starter: `# Dekomposisi sederhana: buang musiman, cari anomali di residual.\nimport statistics as st\ndata = [12, 13, 11, 14, 45, 13, 12]  # settlement harian (Rp jt), hari ke-5 = Jumat\n\n# TULIS KODEMU\nbaseline =\nprint(f"baseline (median non-Jumat): {baseline} jt")\nfor i, x in enumerate(data):\n    r =\n    print(f"  hari {i+1}: {x} jt, residual={r:+.1f} ({r/baseline:+.0%})")`,
        lockLines: 3,
        solution: `# Dekomposisi sederhana: buang musiman, cari anomali di residual.\nimport statistics as st\ndata = [12, 13, 11, 14, 45, 13, 12]  # settlement harian (Rp jt), hari ke-5 = Jumat\n\n# TULIS KODEMU\nbaseline = st.median(data[:4] + data[5:])\nprint(f"baseline (median non-Jumat): {baseline} jt")\nfor i, x in enumerate(data):\n    r = x - baseline\n    print(f"  hari {i+1}: {x} jt, residual={r:+.1f} ({r/baseline:+.0%})")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "baseline \\(median non-Jumat\\): 12\\.5 jt", label: "Baseline = 12.5 jt", msg: "Median 6 hari non-Jumat = 12,5 jt." },
          { kind: "stdout_matches", task: "t3", pattern: "hari 5: 45 jt, residual=\\+32\\.5 \\(\\+260%\\)", label: "Jumat residual +260%", msg: "Jumat: +32,5 jt = +260% di atas baseline — anomali." },
        ],
      },
      reference: "Y = T + S + R. Anomali tinggal di R — setelah trend & musiman dibuang.",
    },
    {
      id: "cusum",
      eyebrow: "Langkah 3 · CUSUM",
      title: "Menangkap pergeseran yang merayap",
      prose: [
        "Tidak semua anomali = lonjakan. Ada yang merayap: refund rate naik dari 2,2% ke 3,0% — tiap hari \"masih wajar\", tapi 10 hari berturut-turut di atas target = ada yang salah. Mata manusia tidak menangkap drift 0,1% per hari. CUSUM menangkapnya: ia mengakumulasi deviasi kecil di atas target, dan berteriak saat akumulasi melewati ambang h.",
        "Simulasi: refund rate harian, target 2,2%, bergeser ke ~3,0% di hari 11. CUSUM (h=3): S_h merayap naik dari hari 11, alarm berbunyi hari ke-18. Tanpa CUSUM, pergeseran ini baru disadari berminggu-minggu kemudian — setelah jutaan rupiah bocor.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan CUSUM satu sisi: S_h = max(0, S_h + (r - target) - k)" },
        { id: "t2", text: "Jalankan 20 hari, catat hari alarm pertama (S_h > h)" },
        { id: "t3", text: "Cetak S_h harian + hari alarm" },
      ],
      expected: "Alarm hari ke-18 (S_h menembus 3.0)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"CUSUM terlalu sensitif — tiap noise kecil menumpuk.\" Parameter k (slack) = 'deviasi berapa yang dianggap noise dan diabaikan'. k terlalu kecil = alarm palsu; k terlalu besar = telat. Kalibrasi k dari noise historis — bukan tebakan.",
      },
      hints: [
        "sh = 0.0; tiap hari: sh = max(0, sh + (r - target) - 0.5).",
        "if sh > h dan alarm belum diset: alarm = hari.",
        "print tiap hari: rate dan S_h.",
      ],
      code: {
        starter: `# CUSUM: akumulasi deviasi kecil, berteriak saat menembus ambang.\nimport random\nrandom.seed(81)\nrates = [round(random.gauss(2.2, 0.4), 2) for _ in range(10)] + \\\n        [round(random.gauss(3.0, 0.4), 2) for _ in range(10)]\ntarget, h, k = 2.2, 3.0, 0.5\n\n# TULIS KODEMU\nsh = 0.0\nalarm = None\nfor i, r in enumerate(rates, 1):\n    sh =\n    if sh > h and alarm is None:\n        alarm = i\n    print(f"  hari {i:2d}: {r:.2f}%  S_h={sh:.2f}")\nprint("alarm hari ke:", alarm)`,
        lockLines: 5,
        solution: `# CUSUM: akumulasi deviasi kecil, berteriak saat menembus ambang.\nimport random\nrandom.seed(81)\nrates = [round(random.gauss(2.2, 0.4), 2) for _ in range(10)] + \\\n        [round(random.gauss(3.0, 0.4), 2) for _ in range(10)]\ntarget, h, k = 2.2, 3.0, 0.5\n\n# TULIS KODEMU\nsh = 0.0\nalarm = None\nfor i, r in enumerate(rates, 1):\n    sh = max(0, sh + (r - target) - k)\n    if sh > h and alarm is None:\n        alarm = i\n    print(f"  hari {i:2d}: {r:.2f}%  S_h={sh:.2f}")\nprint("alarm hari ke:", alarm)`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "alarm hari ke: 18", label: "Alarm hari ke-18", msg: "CUSUM menangkap pergeseran merayap di hari ke-18." },
          { kind: "stdout_matches", task: "t2", pattern: "hari\\s+11: 2\\.91%\\s+S_h=0\\.21", label: "S_h mulai menumpuk hari 11", msg: "Deviasi mulai terakumulasi sejak pergeseran dimulai." },
        ],
      },
      reference: "CUSUM = 'akumulasi bukti'. k = slack noise; h = ambang teriakan.",
    },
    {
      id: "pola",
      eyebrow: "Langkah 4 · Pola serangan",
      title: "Apa yang dicari di garis waktu",
      prose: [
        "Empat pola serangan time series. Satu: spike — lonjakan tiba-tiba (merchant Rp180 juta dalam 3 jam, 01.00–04.00 = 51x baseline). Dua: level shift — baseline pindah permanen (refund rate 2,2% → 3,0% — CUSUM). Tiga: burst berulang — pola periodik yang tidak wajar (penarikan tiap 15 menit tepat). Empat: testing — transaksi kecil beruntun sebelum serangan besar (carding: Rp45 ribu jam 3 pagi sebelum menguras).",
        "Aturan: testing hampir selalu mendahului serangan besar. Menangkap pola testing = mencegah serangan — bukan sekadar mencatatnya.",
      ],
      tasks: [],
      reference: "Spike, level shift, burst berulang, testing. Testing = cegah sebelum serangan besar.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "3 ATM, 45 penarikan, 45 kartu, 1 cabang",
      prose: [
        "Sabtu jam 2 pagi: 3 ATM di kota yang sama mencatat 45 penarikan @Rp2,5 juta — total Rp112,5 juta dalam 90 menit. 45 kartu berbeda — semuanya diterbitkan 1 cabang yang sama 2 minggu lalu. Sistem fraud diam: tiap penarikan \"normal\" (di bawah limit, kartu valid, PIN benar).",
        "Pembahasan: yang aneh bukan tiap penarikan — tapi agregatnya di garis waktu: 45 penarikan/90 menit di 3 ATM = 30x baseline jam 2 pagi; 45 kartu dari 1 cabang yang sama = clustering penerbit; pola burst berulang tiap ~2 menit = skimming + penarikan terkoordinasi. Respons: blokir 45 kartu, tutup 3 ATM sementara, investigasi cabang penerbit. Pelajaran: time series + grouping (by cabang, by ATM) menangkap yang tak terlihat per-transaksi.",
      ],
      tasks: [],
      reference: "Agregat di garis waktu + grouping = menangkap serangan terkoordinasi.",
    },
    {
      id: "musiman-anomali",
      eyebrow: "Langkah 6 · Musiman vs anomali",
      title: "Lebaran bukan fraud — tapi tempat fraud bersembunyi",
      prose: [
        "Lebaran H−7: volume transaksi e-wallet Rp7,8 miliar dalam sehari — 3,7 kali lipat baseline harian Rp2,1 miliar. Model naive tanpa komponen musiman menghitung z-score = (7,8 − 2,1) / 0,3 = 19 sigma — dan memuntahkan 40 alert dalam sehari. Investigator lembur, membuka satu per satu, dan menemukan: semuanya THR. Bukan fraud — kalender. Biaya 14 hari musim: 40 alert × Rp25 ribu × 14 = Rp14 juta terbakar untuk membaca kalender, PLUS kerusakan yang tak terlihat — investigator yang 14 hari membaca alert sampah mulai mengabaikan SEMUA alert, termasuk yang asli di hari ke-15. Alert musiman bukan sekadar sia-sia; ia melatih timmu untuk tidak percaya pada sistemmu sendiri.",
        "Dekomposisi menyelamatkan (Y = T + S + R, dari langkah 2). Untuk hari itu: tren Rp2,1 miliar + musiman lebaran Rp5,2 miliar + residu +Rp0,5 miliar (1,6 sigma). Residu di bawah 3 sigma → bukan anomali → alert di-suppress otomatis dengan label 'musiman', tetap tercatat untuk audit. Bandingkan kasus kontras: Selasa biasa, bukan musim — volume Rp4,6 miliar vs ekspektasi Rp2,1 miliar → residu +Rp2,5 miliar (8,3 sigma) → alert VALID. Investigasi: 1 merchant QRIS baru, 900 transaksi Rp5 jutaan dalam 6 jam — layering yang bersembunyi di hari sepi. Musiman menjelaskan yang besar-tapi-wajar; residu menangkap yang kecil-tapi-jahat. Alert dari residu, bukan dari angka mentah — itu seluruh isi langkah ini.",
        "Kalender fraud Indonesia — hafalkan, karena penipu juga menghafalnya. THR/lebaran (H−14 s/d H+7): volume ritel naik 3–4x, nominal naik, jam transaksi bergeser malam. Natal–tahun baru: mirip, lebih pendek. Tahun ajaran baru (Juli): SPP + seragam — spike pendidikan. Gajian (tanggal 25–1): payday loan + belanja. Harbolnas 11.11/12.12: e-commerce meledak 5–10x semalam. Imlek: angpao digital. Aturan implementasi: model time-series WAJIB punya fitur kalender untuk semuanya — bukan sebagai 'nice to have'. Model tanpa kalender di Indonesia seperti prakiraan cuaca tanpa musim: benar 8 bulan, bencana 4 bulan.",
        "Kapan alert musiman BOLEH diabaikan — tiga syarat kumulatif. Satu: 100% deviasi dijelaskan komponen musiman (residu < 3 sigma setelah dekomposisi). Dua: polanya cocok dengan template musim tahun lalu (bentuk kurva mirip — naik H−14, puncak H−2, turun H+3). Tiga: segmennya memang segmen musiman (ritel naik saat lebaran = wajar; B2B korporat naik saat lebaran = TIDAK wajar — lihat bawah). Bila ketiganya terpenuhi: suppress dengan label, catat, lanjut. Bila satu saja gagal: investigasi. Suppress bukan delete — jejak auditnya tetap ada; yang dihemat hanya waktu investigator, bukan akuntabilitas.",
        "Kapan alert musiman JANGAN diabaikan — karena penipu membaca kalender juga. Satu: residu tetap > 3 sigma SETELAH dekomposisi — musiman menjelaskan Rp5,2 miliar, tapi ada +Rp2,5 miliar yang tidak dijelaskan. Dua: pola 'terlalu sempurna' — fraudster sengaja menyerang saat lebaran karena tahu pengawasan longgar dan alert musiman di-suppress; ini camouflage — bersembunyi di keramaian. Tiga: segmen yang seharusnya TIDAK musiman ikut naik — transaksi B2B antar-korporat naik 4x saat lebaran? Korporat libur saat lebaran — itu aneh. Empat: musim yang 'terlalu lama' — spike lebaran normal 21 hari; yang 45 hari = ada yang menunggangi. Musiman adalah penjelasan, bukan pembenaran — bedakan keduanya dengan residu.",
        "Lebaran BERGESER — dan ini jebakan teknis yang nyata. Kalender Hijriah 11 hari lebih pendek dari Masehi; lebaran 2026 ≠ lebaran 2025 ≠ lebaran 2027. Model yang mengkode 'musim = Mei' akan gagal total tahun depan. Implementasi yang benar: fitur kalender berbasis TANGGAL RELATIF (H−14 s/d H+7 dari 1 Syawal), bukan bulan Masehi; update tanggal 1 Syawal tiap tahun (dari pemerintah); backtest dengan tanggal historis yang benar. Tiga baris kode yang salah di sini = 40 alert sampah × 14 hari × setiap tahun. Detail kalender adalah detail uang.",
        "Dekomposisi PER SEGMEN — karena setiap segmen punya musimnya sendiri. Ritel: lebaran + natal + harbolnas. Korporat B2B: akhir kuartal + akhir tahun fiskal (tutup buku). Merchant QRIS: gajian + weekend. Pinjaman online: awal tahun ajaran + lebaran (THR habis → pinjam). Model tunggal 'musim nasional' akan salah di semua segmen: ia menganggap B2B sepi saat lebaran sebagai anomali (padahal normal) dan menganggap ritel ramai sebagai normal (padahal perlu dicek residunya). Aturan: 1 model per segmen besar, atau 1 model dengan interaksi segmen×kalender. Biaya komputasi naik 4x; biaya alert sampah turun 10x. Pilih yang kedua.",
        "Angka operasional setahun. Tanpa dekomposisi musiman: 5 musim besar × 14 hari × 40 alert = 2.800 alert sampah/tahun × Rp25 ribu = Rp70 juta biaya review sia-sia + 1 investigator resign karena burnout (biaya rekrut + training pengganti ≈ Rp50 juta). Dengan dekomposisi + suppress: alert musim turun 90% → hemat Rp63 juta + retensi tim. Biaya implementasi: 2 minggu kerja analis (Rp30 juta). Payback: < 6 bulan. Ini contoh langka di fraud analytics: investasi yang ROI-nya bisa dihitung di atas kertas SEBELUM dikerjakan — dan tetap jarang dikerjakan karena 'nanti saja'. 'Nanti' = lebaran berikutnya = Rp14 juta lagi.",
        "Backtest musiman — cara membuktikan sebelum dipercaya. Ambil data lebaran tahun lalu: jalankan dekomposisi, hitung berapa alert yang akan di-suppress vs berapa yang ternyata fraud betulan (dari label investigasi). Target: suppress rate > 85% dengan miss rate (fraud yang ikut ter-suppress) < 1%. Bila miss rate > 1%: threshold residu terlalu longgar ATAU ada camouflage (penipu memang menyerang saat lebaran tahun lalu — cek!). Backtest ini juga menjawab pertanyaan manajemen: 'bagaimana bila fraud bersembunyi di musim?' — jawabannya angka, bukan keyakinan. Dan ulangi tiap tahun: pola camouflage berevolusi.",
        "Interaksi dengan CUSUM (langkah 3): CUSUM mendeteksi pergeseran level — tapi level yang bergeser KARENA musim bukan anomali. Maka CUSUM harus dijalankan pada RESIDU, bukan pada data mentah. Urutan pipeline yang benar: data mentah → dekomposisi (kurangi T+S) → CUSUM pada residu → alert. Tim yang menjalankan CUSUM pada data mentah akan mendapat 'pergeseran' setiap lebaran — dan mengira modelnya rusak. Modelnya tidak rusak; inputnya yang belum dibersihkan. Ini juga alasan langkah 2 (dekomposisi) ada SEBELUM langkah 3 (CUSUM) di lesson ini — urutan lesson = urutan pipeline.",

        "Contoh dekomposisi dengan angka — 7 hari sekitar lebaran (Rp miliar). H−3: T=2,1 S=3,9 R=+0,2 → Y=6,2 normal. H−2: T=2,1 S=5,2 R=+0,5 → Y=7,8 normal (puncak THR). H−1: T=2,1 S=4,8 R=−0,3 → Y=6,6 normal. H+0: T=2,1 S=1,2 R=+0,1 → Y=3,4 normal (lebaran, orang salat bukan transaksi). H+1: T=2,1 S=2,0 R=+2,5 → Y=6,6 ALERT — residu +2,5 (8,3σ) tidak dijelaskan musim; investigasi menemukan merchant fiktif menunggangi arus balik. H+2: T=2,1 S=1,5 R=+0,2 → Y=3,8 normal. Pelajarannya: Y=6,6 muncul dua kali (H−1 dan H+1) — yang satu normal, yang satu fraud. Angka mentah tidak bisa membedakan; residu bisa. Inilah kenapa 'volume tinggi' bukan bukti apa-apa.",
        "Bentuk kurva musim adalah sidik jarinya. Template lebaran ritel: naik landai H−14→H−7, curam H−7→H−2, puncak H−2, jatuh tajam H−1→H+0, ekor H+1→H+7. Anomali BENTUK sama pentingnya dengan anomali LEVEL: puncak di H−10 (terlalu dini — ada yang 'mendahului' THR?), tidak ada penurunan di H+0 (orang tetap transaksi saat lebaran — tidak wajar), atau dua puncak (satu asli, satu buatan). Implementasi: bandingkan kurva tahun ini vs template dengan korelasi; korelasi < 0,85 → flag 'bentuk aneh' meski levelnya normal. Penipu yang cerdas tidak menaikkan level — ia mengubah bentuk.",
        "Kalender BISNIS sama pentingnya dengan kalender nasional. Promo 11.11 e-commerce: volume naik 8x dalam 24 jam — buatan, tapi terjadwal. Peluncuran fitur baru dengan cashback: spike 3 hari. Kampanye akuisisi merchant: 500 merchant baru/bulan (masing-masing 'anomali' bila dilihat individual). Aturan: tim fraud WAJIB mendapat kalender promo/marketing 30 hari sebelumnya — dan memasukkannya sebagai fitur. Insiden klasik: tim marketing meluncurkan 'cashback 100%' tanpa memberi tahu tim fraud; 2.000 alert dalam sehari; tim fraud memblokir 300 nasabah sah; Senin pagi rapat darurat. Biaya koordinasi yang gagal: Rp75 juta + 1 permintaan maaf publik. Kalender promo adalah fitur model — perlakukan seperti itu.",
        "Residu bukan sampah — ia punya struktur yang bisa dibaca. Setelah dekomposisi, plot distribusi residu: harus mendekati normal dengan varians stabil. Bila varians residu MEMBESAR saat musim (heteroskedastisitas) — wajar: volume besar = noise besar; maka threshold 3σ harus diskalakan dengan level (pakai z-score relatif, bukan absolut). Bila residu punya AUTOKORELASI (hari ini tinggi → besok tinggi) — ada komponen yang belum dimodelkan; cari: mungkin ada musim mingguan yang terlewat (payday effect). Residu yang 'bersih' = modelmu jujur. Residu yang berpola = modelmu berbohong dengan sopan. Cek diagnostik ini tiap kuartal — 15 menit yang menghemat 2.800 alert sampah.",
        "Checklist 2 minggu sebelum musim besar — tempel di wiki tim. Satu: verifikasi tanggal (1 Syawal tahun ini? tanggal harbolnas? jadwal promo marketing?). Dua: backtest dekomposisi dengan data musim tahun lalu — suppress rate > 85%, miss rate < 1%. Tiga: briefing investigator — 'minggu depan volume naik 3x, ini normal, fokus ke residu > 3σ'. Empat: siapkan kapasitas — tunda cuti, siapkan shift. Lima: mode camouflage ON — ingatkan tim bahwa penipu tahu kita longgar; residu tetap dipantau ketat. Enam: setelah musim — review 1 jam: berapa alert, berapa valid, apa yang dipelajari untuk tahun depan. Musim bukan kejutan; ia adalah jadwal yang diketahui. Tim yang terkejut oleh jadwal bukanlah tim — ia adalah korban kalender.",
        "Ringkasnya, musiman vs anomali. Satu: alert dari residu (Y−T−S), bukan dari angka mentah — 19 sigma mentah bisa jadi 1,6 sigma residu. Dua: suppress boleh bila 3 syarat terpenuhi (residu < 3σ + template cocok + segmen wajar) — dengan jejak audit. Tiga: jangan suppress bila residu > 3σ, pola terlalu sempurna, segmen tak wajar ikut naik, atau musim terlalu lama — itu camouflage. Empat: kalender relatif Hijriah, per segmen, update tahunan. Lima: CUSUM pada residu, bukan data mentah. Tanya kalender dulu sebelum tanya model — tapi jangan pernah berhenti di kalender.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tanya kalender dulu sebelum tanya data",
        type: "risk",
        body: "Sebelum membuka output model, buka kalender. Spike di H−7 lebaran bersalah sampai terbukti musiman; spike di Selasa acak bersifat musiman sampai terbukti bersalah — beban pembuktiannya DIBALIK oleh kalender. Investigator yang langsung percaya angka mentah akan menghabiskan 14 hari membaca THR. Kedua, penjahat membaca kalender juga: keramaian adalah kamuflase termurah. Maka jangan pernah auto-dismiss musim — suppress alert-nya tapi simpan struknya: residu tetap dihitung, jejak tetap dicatat, backtest tahunan tetap jalan. Kepercayaan pada musim harus bisa diaudit, bukan dirasakan. Ketiga, musiman adalah kontrak dengan bisnis dan timmu: 'kami tidak akan membangunkanmu untuk lebaran' — tapi kontrak perlu perpanjangan tahunan, karena lebaran bergeser, segmen berubah, dan penipu belajar. Kalender bukan latar; kalender adalah fitur. Keempat, bedakan 'musiman' dari 'siklus serangan': penipu juga punya kalender — gajian adalah musim mereka menyerang pinjaman, lebaran adalah musim mereka menunggangi volume. Bila residu spike terjadi di SETIAP musim yang sama selama 3 tahun, itu bukan anomali — itu musim kedua yang belum kamu modelkan; tambahkan sebagai fitur, jangan suppress selamanya. Kelima, libatkan tim bisnis: kalender promo mereka adalah fitur modelmu; satu email 'ada cashback 100% minggu depan' menghemat 2.000 alert sampah. Investigator yang tidak berteman dengan tim marketing akan selalu berperang dengan kalender.",
      },
      reference: "Alert dari residu, bukan angka mentah. Tanya kalender dulu — tapi jangan berhenti di kalender.",
    },
    {
      id: "change-point",
      eyebrow: "Langkah 7 · Change-point detection",
      title: "Di mana tepatnya patah? Cari titik perubahan level",
      prose: [
        "CUSUM di langkah 3 adalah alarm online — ia berteriak saat pergeseran terakumulasi melewati ambang. Change-point detection menjawab pertanyaan lanjutannya secara offline: di titik mana tepatnya level itu patah? Bedanya: CUSUM berkata \"ada yang berubah sekitar hari ke-18\", change-point berkata \"patahnya di hari ke-10, level sebelum 100,1 dan sesudah 140,0\".",
        "Metode paling sederhana: uji semua titik patah yang mungkin. Untuk tiap kandidat k, bagi deret menjadi kiri (hari 1 sampai k) dan kanan (hari k+1 sampai akhir), hitung SSE total = SSE(kiri) + SSE(kanan) — jumlah kuadrat deviasi dari mean masing-masing sisi. Titik patah terbaik adalah k dengan SSE total terkecil: pembagian yang membuat tiap sisi paling homogen. Contoh (ilustratif): volume transaksi harian 20 hari, 10 hari pertama sekitar 100, 10 hari berikutnya sekitar 140. SSE total minimal di k = 10, dengan SSE 62,9 — jauh lebih kecil dari pembagian lain. Mean sebelum 100,1, mean sesudah 140,0: pergeseran +39,9, sekitar +40 persen.",
        "Dua catatan: pertama, satu titik patah tidak cukup bila ada banyak pergeseran — lanjutannya binary segmentation: cari satu titik patah, lalu ulangi pencarian di tiap sisi secara rekursif. Kedua, change-point butuh data lengkap sesudah kejadian — ia alat investigasi dan backtest, bukan alarm real-time. Pipeline yang benar: CUSUM untuk alarm cepat, change-point untuk menentukan kapan tepatnya serangan dimulai (berguna untuk menentukan jendela investigasi dan menghitung kerugian sejak titik patah).",
      ],
      formula: String.raw`k^* = \arg\min_k \big[ SSE(1..k) + SSE(k+1..n) \big]`,
      formulaNote: "k* = titik patah terbaik; SSE = sum of squared errors dari mean tiap sisi; k* meminimalkan SSE total — pembagian yang membuat tiap sisi paling homogen.",
      tasks: [
        { id: "t1", text: "Cari `titik_patah` = k dengan SSE total terkecil" },
        { id: "t2", text: "Hitung `sse_min` = SSE total di titik itu (1 desimal), cetak keduanya" },
      ],
      expected: "titik_patah=10  sse_min=62.9",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Titik patah menentukan jendela kerugian: semua transaksi sesudah k = 10 adalah populasi yang harus di-review. Salah menentukan titik patah 5 hari berarti 5 hari transaksi fraud lolos dari investigasi — atau 5 hari transaksi sah ikut dibekukan.",
      },
      hints: [
        "Coba semua k dari 2 sampai len(data)-2, hitung sse(data[:k]) + sse(data[k:]).",
        "titik_patah = min(range(2, len(data)-1), key=lambda k: sse(data[:k]) + sse(data[k:])).",
        "sse_min = round(sse(data[:titik_patah]) + sse(data[titik_patah:]), 1)",
      ],
      code: {
        starter: `# Volume transaksi harian (Rp jt, ilustratif): ada pergeseran level di tengah\n# data = [98, 102, 99, 101, 100, 103, 97, 100, 102, 99,\n#         138, 142, 139, 141, 140, 137, 143, 139, 141, 140]\ndata = [98, 102, 99, 101, 100, 103, 97, 100, 102, 99,\n        138, 142, 139, 141, 140, 137, 143, 139, 141, 140]\n\ndef sse(xs):\n    m = sum(xs) / len(xs)\n    return sum((x - m) ** 2 for x in xs)\n\n# TULIS KODEMU: cari titik patah yang meminimalkan SSE total\ntitik_patah = \nsse_min = \n\nprint(f"titik_patah={titik_patah}  sse_min={sse_min}")`,
        lockLines: 9,
        solution: `# Volume transaksi harian (Rp jt, ilustratif): ada pergeseran level di tengah\n# data = [98, 102, 99, 101, 100, 103, 97, 100, 102, 99,\n#         138, 142, 139, 141, 140, 137, 143, 139, 141, 140]\ndata = [98, 102, 99, 101, 100, 103, 97, 100, 102, 99,\n        138, 142, 139, 141, 140, 137, 143, 139, 141, 140]\n\ndef sse(xs):\n    m = sum(xs) / len(xs)\n    return sum((x - m) ** 2 for x in xs)\n\n# TULIS KODEMU: cari titik patah yang meminimalkan SSE total\ntitik_patah = min(range(2, len(data)-1), key=lambda k: sse(data[:k]) + sse(data[k:]))\nsse_min = round(sse(data[:titik_patah]) + sse(data[titik_patah:]), 1)\n\nprint(f"titik_patah={titik_patah}  sse_min={sse_min}")`,
        checks: [
          { kind: "equal", task: "t1", name: "titik_patah", value: 10, tol: 0, label: "`titik_patah` seharusnya 10", msg: "Pergeseran terjadi setelah hari ke-10: 10 hari pertama ~100, 10 hari berikutnya ~140." },
          { kind: "equal", task: "t2", name: "sse_min", value: 62.9, tol: 0.1, label: "`sse_min` seharusnya 62.9", msg: "SSE total minimal di k=10." },
          { kind: "stdout_matches", task: "t2", pattern: "titik_patah=10\\s+sse_min=62\\.9", label: "`print` menampilkan keduanya", msg: "Format: titik_patah=...  sse_min=... ." },
        ],
      },
      reference: "CUSUM = alarm online; change-point = lokasi patah offline. Binary segmentation untuk banyak patahan.",
    },
    {
      id: "case-atm-lanjutan",
      eyebrow: "Langkah 8 · Case ATM lanjutan",
      title: "Gelombang kedua: penipu yang belajar dari gelombang pertama",
      prose: [
        "Seminggu setelah mini-case langkah 5, gelombang kedua datang — dan penipunya sudah belajar. Sabtu jam 2 pagi lagi, 2 ATM: 30 penarikan @Rp2,4 juta — total Rp72 juta dalam 2 jam. Kali ini tiap penarikan Rp2,4 juta, tepat di bawah ambang Rp2,5 juta yang dipakai tim fraud setelah insiden pertama. Kartunya dari 3 cabang berbeda, bukan 1 — dan jedanya ~4 menit, bukan ~2 menit. Kalau aturanmu hanya \"blokir pola minggu lalu\", gelombang ini lolos.",
        "Yang menangkapnya: change-point pada volume per ATM — baseline 2 ATM jam 2 pagi total Rp10 juta (ilustratif), malam itu Rp72 juta = 7,2x lipat, dan titik patahnya tepat saat ATM dibuka jam 2 pagi. Lalu grouping: 30 kartu dari 3 cabang ternyata satu batch penerbitan baru yang sama (tanggal terbit berdekatan) — clustering yang tidak terlihat kalau hanya melihat kolom cabang. Dan tanda structuring: 30 penarikan menumpuk tepat di bawah ambang Rp2,5 juta — distribusi nominal yang menumpuk di bawah threshold adalah sidik jari penghindaran ambang.",
        "Respons dan pelajaran: blokir batch penerbitan (bukan per cabang), tutup 2 ATM sementara, dan perbaiki aturan — ambang tetap tidak boleh jadi satu-satunya pertahanan. Ganti dengan agregat per ATM per jam + velocity per batch kartu + deteksi penumpukan nominal di bawah ambang. Penipu beradaptasi dengan aturanmu; pertahanan yang tidak beradaptasi adalah jadwal serangan berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Structuring — memecah transaksi tepat di bawah ambang — adalah pola yang sama di AML: penipu tidak melawan aturanmu, ia menari di bawahnya. Deteksi harus naik ke agregat dan distribusi, bukan bertahan di ambang per transaksi.",
      },
      quiz: [
        {
          q: "30 penarikan @Rp2,4 jt, tepat di bawah ambang Rp2,5 jt. Sinyal utamanya?",
          options: [
            { text: "Nominalnya kecil — abaikan", why: "Salah: penumpukan tepat di bawah ambang adalah sidik jari structuring." },
            { text: "Structuring: distribusi nominal menumpuk di bawah threshold + agregat 7,2x baseline", why: "Benar: per transaksi lolos, agregat dan distribusinya berteriak.", correct: true },
            { text: "ATM-nya rusak", why: "Salah: ATM berfungsi — kartunya yang terkoordinasi." },
            { text: "Kebetulan — 30 orang butuh uang tunai bersamaan jam 2 pagi", why: "Salah: jam 2 pagi + batch penerbitan sama = bukan kebetulan." },
          ],
        },
        {
          q: "Gelombang kedua lolos dari aturan yang dibuat setelah gelombang pertama. Pelajaran desain deteksinya?",
          options: [
            { text: "Turunkan ambang jadi Rp1 juta — pasti tertangkap", why: "Salah: penipu akan pindah ke Rp0,9 juta; ambang tetap selalu bisa ditarik." },
            { text: "Naik ke agregat (per ATM per jam), velocity per batch kartu, dan deteksi penumpukan di bawah ambang", why: "Benar: pertahanan harus beradaptasi — agregat + distribusi, bukan satu ambang.", correct: true },
            { text: "Blokir semua penarikan jam 2 pagi", why: "Salah: memblokir nasabah sah adalah biaya yang tidak perlu — dan penipu pindah jam." },
            { text: "Tidak ada yang bisa dilakukan — penipu selalu menang", why: "Salah: change-point + grouping menangkap gelombang ini; adaptasi adalah pekerjaannya." },
          ],
        },
      ],
      reference: "Penipu belajar dari aturanmu. Deteksi: agregat + grouping + distribusi nominal, bukan satu ambang.",
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
        "Anomali = 'besar dibandingkan yang seharusnya saat ini' — bukan 'besar'.",
        "Y = T + S + R: cari anomali di residual setelah buang trend & musiman.",
        "CUSUM menangkap pergeseran merayap yang tak terlihat harian.",
        "Empat pola: spike, level shift, burst berulang, testing.",
        "Testing mendahului serangan besar — tangkap testing = cegah serangan.",
      ],
      next: { label: "FR17 — Explainability", href: "/learn/fr17-explainability" },
      quiz: [
        {
          q: "Rp180 ribu (promo siang) lolos, Rp45 ribu (jam 3 pagi) ditahan. Mengapa benar?",
          options: [
            { text: "Sistem rusak", why: "Sistem benar — lihat konteks waktu." },
            { text: "Anomali = relatif terhadap baseline saat itu: Rp45rb = 10x baseline jam 3 pagi; Rp180rb = normal saat promo", why: "'Besar' tidak sama dengan 'aneh'.", correct: true },
            { text: "Nominal kecil selalu fraud", why: "Tidak — konteksnya yang menentukan." },
            { text: "Kebetulan", why: "Bukan kebetulan — baseline per jam." },
          ],
        },
        {
          q: "Settlement [12,13,11,14,45,13,12]. Setelah dekomposisi, apa temuan?",
          options: [
            { text: "Semua normal", why: "45 jauh di atas baseline 12,5." },
            { text: "Jumat residual +32,5 (+260%) — anomali setelah musiman dibuang", why: "Y=T+S+R: anomali tinggal di residual.", correct: true },
            { text: "Rata-rata naik", why: "Rata-rata naik justru menyembunyikan anomali." },
            { text: "Tidak bisa disimpulkan", why: "Bisa: +260% = jelas anomali." },
          ],
        },
        {
          q: "Refund rate naik 2,2% → 3,0% merayap 10 hari. Tiap hari 'masih wajar'. Metode?",
          options: [
            { text: "Threshold harian", why: "Tiap hari di bawah threshold — lolos terus." },
            { text: "CUSUM — mengakumulasi deviasi kecil hingga menembus ambang", why: "Mata manusia tak menangkap drift 0,1%/hari; CUSUM ya.", correct: true },
            { text: "Rata-rata bulanan", why: "Terlalu lambat — jutaan bocor dulu." },
            { text: "Abaikan", why: "Pergeseran permanen = masalah permanen." },
          ],
        },
        {
          q: "45 penarikan @Rp2,5 jt, 90 menit, 3 ATM, 45 kartu dari 1 cabang. Tiap penarikan 'normal'. Kesimpulan?",
          options: [
            { text: "Normal semua", why: "Agregatnya tidak normal: 30x baseline + clustering cabang." },
            { text: "Skimming terkoordinasi — time series + grouping menangkap yang tak terlihat per-transaksi", why: "Burst berulang + clustering penerbit = pola klasik.", correct: true },
            { text: "ATM rusak", why: "ATM berfungsi — kartunya yang dikloning." },
            { text: "Kebetulan", why: "45 kartu/1 cabang bukan kebetulan." },
          ],
        },
        {
          q: "Mengapa pola 'testing' (transaksi kecil beruntun) penting?",
          options: [
            { text: "Tidak penting — nominal kecil", why: "Justru penting — lihat opsi benar." },
            { text: "Testing mendahului serangan besar — menangkapnya = mencegah, bukan mencatat", why: "Carding: Rp45rb jam 3 pagi sebelum menguras.", correct: true },
            { text: "Untuk statistik", why: "Untuk pencegahan." },
            { text: "Hanya untuk laporan", why: "Untuk tindakan pencegahan." },
          ],
        },
      ],
    },
  ],
};
