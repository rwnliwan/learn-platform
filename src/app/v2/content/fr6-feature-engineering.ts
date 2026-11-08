import type { V2Lesson } from "../lib/types";

export const fr6: V2Lesson = {
  slug: "fr6-feature-engineering",
  track: "Fraud & AML Analytics",
  module: "Deteksi Klasik",
  title: "FR6 — Feature Engineering",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Fitur yang menemukan Rp1,2 miliar",
      prose: [
        "Tim fraud \"KreditGo\" sudah punya model ML dengan 40 fitur. Performanya stagnan 8 bulan. Seorang analis junior — baru 3 bulan kerja — bertanya polos: \"Kenapa fitur kita cuma lihat transaksi ini? Kenapa nggak lihat umur device-nya?\"",
        "Mereka menambahkan satu fitur: device_age_days. AUC naik dari 0,81 ke 0,89 dalam seminggu. Fitur tunggal itu menemukan ring farming Rp1,2 miliar yang lolos 8 bulan — 200 akun \"berumur\" 3–5 hari dengan pola identik, yang selama ini terlihat sebagai 200 orang berbeda.",
        "Bukan modelnya yang bodoh — datanya yang buta. 40 fitur semuanya menjawab \"bagaimana transaksi ini?\"; tidak satu pun menjawab \"seberapa baru pelaku di baliknya?\". Dalam fraud ML, feature engineering mengalahkan tuning model 10 banding 1. Model hanyalah mesin; fitur adalah bahan bakarnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Feature engineering sudah mati — deep learning bisa belajar fitur sendiri.\" Untuk data tabular fraud, gradient boosting + fitur pakar masih raja. Deep learning butuh data masif dan tetap butuh window agregat yang dihitung manual. Klaim \"end-to-end\" valid untuk gambar/teks — untuk tabel transaksi, fitur pakar menang telak dan jauh lebih explainable.",
      },
      reference: "Fitur = teori tentang penjahat: \"jejak apa yang terpaksa ditinggalkan musuh?\"",
    },
    {
      id: "window",
      eyebrow: "Langkah 2 · Window agregat",
      title: "Melihat pola, bukan titik",
      prose: [
        "Window agregat = ringkasan perilaku dalam jendela waktu ke belakang: count_1h, sum_24h, distinct_merchant_7d, max_single_30d. Satu transaksi tidak bercerita; 20 transaksi terakhir bercerita. Tiga jenis: count (berapa kali? → menangkap carding & warming), sum/avg/max (seberapa besar? → menangkap pengurasan), distinct (ke berapa pihak? → menangkap fan-out mule).",
        "Window 10 menit terlalu pendek (noise — double-tap ikut kehitung), 30 hari terlalu panjang (sinyal serangan terkubur riwayat normal). Sweet spot: 1 jam–7 hari. Pilih window dengan bertanya \"berapa lama serangan ini berlangsung?\" Carding: menit. Warming: jam–hari. Bust-out synthetic: minggu. Window yang salah = memotret dengan shutter speed yang salah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Log kartu B: 20.01 Rp120rb, 20.09 Rp95rb, 20.14 Rp110rb, 20.19 Rp4,2jt, 20.21 Rp3,8jt. count_15m pada 20.21 = 4, amt_15m = Rp8,195 juta. Bandingkan dengan baseline nasabah (1,2 trx/hari, Rp210rb): rasio count 200x, amount 39x lipat. Pola klasik \"test kecil lalu gas\" — pencuri mengetes kartu masih aktif, lalu menguras.",
      },
      reference: "Window selaras dengan tempo serangan — bukan default 30 hari untuk semua.",
    },
    {
      id: "baseline",
      eyebrow: "Langkah 3 · Baseline per user",
      title: "Anomali itu relatif",
      prose: [
        "Baseline per user = profil \"normal\"-nya orang ini: rata-rata & sebaran nominal, jam aktif biasa, merchant langganan. Anomali diukur sebagai deviasi dari baseline-nya sendiri. Bu Ani: 20 transaksi terakhir rata-rata Rp400 rb, SD Rp150 rb. Hari ini transfer Rp4,5 juta → z = 27,3 → anomali ekstrem untuk Bu Ani. Untuk Pak Budi (pengusaha, rata-rata Rp40 juta), transaksi Rp4,5 juta punya z negatif → normal.",
        "Transaksi yang sama persis, vonis berlawanan — karena baselinenya beda. Inilah kenapa ambang absolut kalah dari baseline personal.",
      ],
      formula: String.raw`z = \frac{x - \mu_{\text{user}}}{\sigma_{\text{user}}}`,
      formulaNote: "x = nilai transaksi saat ini; mu dan sigma = rata-rata & SD historis user itu. |z| > 3 = anomali personal.",
      tasks: [
        { id: "t1", text: "Hitung `mu` dan `sd` baseline dari `riwayat`" },
        { id: "t2", text: "Hitung z-score tiap transaksi `baru`, tandai ANOMALI jika |z| > 3" },
        { id: "t3", text: "Cetak dengan `print`" },
      ],
      expected: "trx-1 normal (z=+0.2); trx-2 ANOMALI (z=+22.6); trx-3 ANOMALI (z=+31.0)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Fitur nominal mentah cukup — model akan belajar sendiri.\" Nominal mentah tanpa baseline = angka tanpa konteks. Rp4,5 juta tidak berarti apa-apa sampai kamu tahu milik siapa. Tanpa fitur baseline, model buta — persis seperti analis yang menilai tanpa kenal nasabahnya.",
      },
      hints: [
        "mu = st.mean(riwayat); sd = st.stdev(riwayat). Modul statistics sudah diimpor.",
        "z = (nominal - mu) / sd. Tandai ANOMALI jika abs(z) > 3.",
        "z = (nominal - mu) / sd if sd > 0 else 0",
      ],
      code: {
        starter: `# Riwayat 1 user: 20 transaksi normal, lalu 3 transaksi 'serangan'\nimport statistics as st\n\nriwayat = [0.3, 0.5, 0.2, 0.8, 0.4, 0.6, 0.3, 0.5, 0.7, 0.4,\n           0.2, 0.6, 0.5, 0.3, 0.8, 0.4, 0.5, 0.6, 0.3, 0.4]  # juta Rp\nbaru = [0.5, 4.5, 6.0]  # 3 transaksi terakhir\n\n# TULIS KODEMU: baseline user + z-score personal\nmu =\nsd =\n\nfor i, nominal in enumerate(baru):\n    z =\n    flag = "ANOMALI" if abs(z) > 3 else "normal"\n    print(f"trx baru {i+1}: Rp{nominal:.1f} jt  z={z:+.1f}  {flag}")`,
        lockLines: 6,
        solution: `# Riwayat 1 user: 20 transaksi normal, lalu 3 transaksi 'serangan'\nimport statistics as st\n\nriwayat = [0.3, 0.5, 0.2, 0.8, 0.4, 0.6, 0.3, 0.5, 0.7, 0.4,\n           0.2, 0.6, 0.5, 0.3, 0.8, 0.4, 0.5, 0.6, 0.3, 0.4]  # juta Rp\nbaru = [0.5, 4.5, 6.0]  # 3 transaksi terakhir\n\n# TULIS KODEMU: baseline user + z-score personal\nmu = st.mean(riwayat)\nsd = st.stdev(riwayat)\n\nfor i, nominal in enumerate(baru):\n    z = (nominal - mu) / sd if sd > 0 else 0\n    flag = "ANOMALI" if abs(z) > 3 else "normal"\n    print(f"trx baru {i+1}: Rp{nominal:.1f} jt  z={z:+.1f}  {flag}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mu", value: 0.465, tol: 0.01, label: "`mu` sekitar 0.47", msg: "Rata-rata 20 angka riwayat ≈ 0,47." },
          { kind: "equal", task: "t1", name: "sd", value: 0.176, tol: 0.01, label: "`sd` sekitar 0.18", msg: "SD riwayat ≈ 0,18. Pakai st.stdev (bukan pstdev)." },
          { kind: "stdout_matches", task: "t2", pattern: "trx baru 2: Rp4\\.5 jt\\s+z=\\+22\\.6\\s+ANOMALI", label: "trx-2 ANOMALI (z=+22.6)", msg: "(4,5 - 0,47)/0,18 ≈ 22,6 → ANOMALI." },
        ],
      },
      reference: "Selalu sertakan baseline per user untuk fitur nominal. Anomali itu relatif, bukan absolut.",
    },
    {
      id: "travel",
      eyebrow: "Langkah 4 · Impossible travel",
      title: "Fitur fisika yang tak bisa dibohongi",
      prose: [
        "Impossible travel = dua transaksi dari lokasi yang tidak mungkin ditempuh manusia dalam selisih waktunya. Kecepatan implisit = jarak haversine / selisih waktu. Batas wajar ≈ 900 km/jam (pesawat komersial). Di atas itu = mustahil = dua orang/device berbeda memakai satu akun.",
        "Kenapa istimewa: ini fitur fisika, bukan statistik. Penipu bisa meniru pola statistik (kecilkan nominal, tiru jam), tapi tidak bisa memalsukan hukum fisika — kecuali memakai VPN, yang justru meninggalkan jejak lain (ASN datacenter, IP tidak konsisten dengan GPS). Fitur terbaik adalah yang tidak bisa di-tune oleh penipu: tanyakan \"bisakah penipu mengubah ini tanpa biaya?\" Nominal: ya (gratis). Lokasi mustahil: tidak.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `haversine_km()` (jari-jari bumi 6371 km)" },
        { id: "t2", text: "Hitung kecepatan implisit Makassar→Surabaya dan Makassar→Jakarta" },
        { id: "t3", text: "Tandai IMPOSSIBLE jika > 900 km/jam, cetak dengan `print`" },
      ],
      expected: "Makassar→Surabaya 1550 km/jam IMPOSSIBLE; Makassar→Jakarta 349 km/jam wajar",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jebakan: (a) VPN/proxy — IP tidak selalu = lokasi fisik, beri bobot lebih rendah untuk IP datacenter; (b) transaksi online — lokasi merchant ≠ lokasi pemegang kartu, fitur ini hanya valid untuk transaksi fisik (EDC/ATM); (c) pastikan timestamp UTC dan koordinat cukup presisi. Fitur brilian dari data kotor = alarm palsu yang brilian.",
      },
      hints: [
        "Ubah derajat ke radian dulu: math.radians.",
        "a = sin²(dp/2) + cos(p1)*cos(p2)*sin²(dl/2); jarak = 2*R*asin(sqrt(a)).",
        "kec = jarak / (jam_b - jam_a); status = 'IMPOSSIBLE' jika kec > 900.",
      ],
      code: {
        starter: `# Bisakah orang ini berpindah secepat itu? Batas wajar ~900 km/jam.\nimport math\n\n# TULIS KODEMU: jarak lingkaran besar (haversine)\ndef haversine_km(lat1, lon1, lat2, lon2):\n    R = 6371.0\n    return \n\n# (kota, lat, lon, jam)\nmakassar = ("Makassar", -5.1477, 119.4327, 10.0)\nsurabaya = ("Surabaya", -7.2575, 112.7521, 10.5)  # 30 mnt kemudian!\njakarta  = ("Jakarta",  -6.2088, 106.8456, 14.0)  # 4 jam kemudian\n\nfor a, b in [(makassar, surabaya), (makassar, jakarta)]:\n    jarak = haversine_km(a[1], a[2], b[1], b[2])\n    kec = jarak / (b[3] - a[3])\n    status = "IMPOSSIBLE" if kec > 900 else "wajar"\n    print(f"{a[0]} -> {b[0]}: {kec:.0f} km/jam  {status}")`,
        lockLines: 5,
        solution: `# Bisakah orang ini berpindah secepat itu? Batas wajar ~900 km/jam.\nimport math\n\n# TULIS KODEMU: jarak lingkaran besar (haversine)\ndef haversine_km(lat1, lon1, lat2, lon2):\n    R = 6371.0\n    p1, p2 = math.radians(lat1), math.radians(lat2)\n    dp = math.radians(lat2 - lat1); dl = math.radians(lon2 - lon1)\n    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2\n    return 2 * R * math.asin(math.sqrt(a))\n\n# (kota, lat, lon, jam)\nmakassar = ("Makassar", -5.1477, 119.4327, 10.0)\nsurabaya = ("Surabaya", -7.2575, 112.7521, 10.5)  # 30 mnt kemudian!\njakarta  = ("Jakarta",  -6.2088, 106.8456, 14.0)  # 4 jam kemudian\n\nfor a, b in [(makassar, surabaya), (makassar, jakarta)]:\n    jarak = haversine_km(a[1], a[2], b[1], b[2])\n    kec = jarak / (b[3] - a[3])\n    status = "IMPOSSIBLE" if kec > 900 else "wajar"\n    print(f"{a[0]} -> {b[0]}: {kec:.0f} km/jam  {status}")`,
        checks: [
          { kind: "defined", task: "t1", name: "haversine_km", label: "`haversine_km` terdefinisi", msg: "Buat fungsi haversine_km(lat1, lon1, lat2, lon2)." },
          { kind: "stdout_matches", task: "t3", pattern: "Makassar -> Surabaya: 1550 km/jam\\s+IMPOSSIBLE", label: "Makassar→Surabaya IMPOSSIBLE", msg: "775 km / 0,5 jam = 1550 km/jam > 900." },
          { kind: "stdout_matches", task: "t3", pattern: "Makassar -> Jakarta: 349 km/jam\\s+wajar", label: "Makassar→Jakarta wajar", msg: "1398 km / 4 jam = 349 km/jam < 900 → wajar." },
        ],
      },
      reference: "implied_speed = jarak haversine / Δt. >900 km/jam = mustahil. Fisika > statistik.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Fitur apa untuk serangan apa",
      prose: [
        "Satu: carding / warming (serangan cepat, massal) → window pendek + velocity: count_10m, count_1h, distinct_merchant_1h. Dua: ATO (akun legit dibajak) → deviasi baseline + recency kredensial: z_user, days_since_credential_change, new_device_flag. Tiga: farming / mule ring (banyak akun) → recency + graph agregat: account_age_days, device_age_days, accounts_per_device_7d. Empat: bust-out synthetic (lambat, besar) → window panjang + tren: sum_30d, trend_90d.",
        "Recency + velocity = pasangan wajib untuk serangan akun baru. Umur menjawab \"siapa\", velocity menjawab \"bagaimana\". Dan ingat trade-off desain: window pendek sensitif tapi berisik; fitur mahal (join lintas sistem 80ms) tidak muat di budget real-time 50ms — precompute ke feature store atau buang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Makin banyak fitur, makin bagus model.\" Tiap fitur adalah liabilitas operasional: harus dihitung selamanya, bisa rusak saat skema berubah, bisa bocor (leakage). 15–30 fitur yang terawat mengalahkan 300 fitur yang setengah mati. Disiplin membuang fitur sama pentingnya dengan kepintaran membuatnya.",
      },
      reference: "Fitur terbaik = yang stabil maknanya saat dunia berubah (rasio terhadap baseline, bukan angka mentah).",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Rancang 8 fitur untuk serangan warming",
      prose: [
        "Marketplace \"TokoMaju\" diserang warming: 200 akun baru, transaksi kecil 2–3 hari, lalu serentak belanja besar. Data yang tersedia: tabel transaksi (id, user_id, nominal, timestamp, merchant), tabel device (user_id, fingerprint, first_seen), tabel user (created_at). Rancang tepat 8 fitur (nama + definisi + window) yang menangkap serangan ini. Tidak boleh \"nominal transaksi\" mentah.",
        "Pembahasan — 8 fitur yang defensibel: account_age_days (umur akun saat transaksi — menangkap \"baru\"), device_age_days (umur device — menangkap device farming), count_72h (jumlah transaksi 72 jam terakhir — warming = ramai mendadak), sum_72h / sum_30d (rasio aktivitas baru vs lama — warming = rasio tinggi), avg_ticket_72h / avg_ticket_hist (lompatan nilai rata-rata — fase \"serangan besar\"), accounts_per_device_7d (berapa akun berbagi device — farming terkoordinasi), distinct_merchant_24h (warming sering uji banyak merchant), days_since_first_txn (\"baru aktif + langsung agresif\" = pola inti warming).",
        "Yang dinilai: tiap fitur menjawab aspek serangan yang berbeda (umur, tempo, skala, koordinasi) — bukan 8 varian nominal. Dan semuanya bisa dihitung dari 3 tabel yang ada.",
      ],
      tasks: [],
      reference: "Kasus nyata: 1 KTP x 40 pengajuan pinjol x Rp3 jt = Rp120 jt eksposur — ditangkap ktp_reuse_count_30d.",
    },
    {
      id: "memilih-jendela",
      eyebrow: "Langkah 7 · Tempo serangan",
      title: "1 jam vs 24 jam vs 7 hari: jendela yang salah = buta",
      prose: [
        "Kasus NusaBank dari FR2: 14 transfer total Rp800 juta dalam 20 menit. Hitung tiga jendela pada menit ke-20. count_1h = 14 — berteriak. count_24h = 14 — berteriak juga, tetapi jika nasabah ini memang aktif (rata-rata 10 transaksi/hari), 14 dalam 24 jam hanya \"agak ramai\". count_7d = 21 vs rata-rata 70/minggu — terlihat TENANG. Jendela 7 hari mengubur serangan 20 menit di dalam riwayat normal seminggu. Jendela yang salah tidak memberi sinyal lemah — ia memberi sinyal yang menenangkan dan salah.",
        "Sekarang balikkan: serangan warming TokoMaju dari mini-case FR6 — 200 akun baru, transaksi kecil Rp50–100 ribu selama 3 hari, lalu serentak belanja besar. Pada hari kedua fase warming, count_1h = 3 (normal!), count_24h = 67 vs rata-rata 2/hari (berteriak), count_7d = 140 (berteriak, tetapi terlambat 3 hari — fase serangan besar sudah dimulai). Jendela 1 jam buta total terhadap pola yang temponya harian; jendela 7 hari melihatnya tetapi setelah uang hilang.",
        "Pola umumnya: jendela pendek (menit–jam) = sensitif terhadap serangan cepat seperti carding dan ATO cash-out, tetapi berisik — gajian, flash sale, dan panic buying terlihat seperti serangan. Jendela panjang (hari–minggu) = stabil dan tenang, tetapi telat — ia mengonfirmasi serangan yang sudah selesai. Tidak ada jendela tunggal yang benar; yang benar adalah TANGGA jendela: 1 jam untuk peringatan dini, 24 jam untuk konfirmasi, 7 hari untuk konteks. Model yang hanya punya satu anak tangga hanya bisa melihat satu jenis tempo.",
        "Aturan keputusannya konkret. Satu: petakan tempo serangan yang kamu lawan — carding/ATO: menit–jam; warming/farming: hari; bust-out synthetic: minggu–bulan — lalu pilih jendela yang selaras, bukan default 24 jam untuk semuanya. Dua: setiap fitur velocity wajib punya pasangan lintas skala (count_1h DAN count_24h) agar model bisa membedakan \"ramai sejam\" dari \"ramai seharian\". Tiga: uji jendela dengan replay serangan historis — geser window 1h/24h/7d di atas 10 kasus nyata dan hitung pada menit ke berapa tiap jendela mulai berteriak; jendela yang berteriak setelah uang cair adalah dekorasi.",
        "Biaya jendela yang salah bisa dihitung. Jendela terlalu pendek untuk warming: 200 akun × Rp2 juta fase serangan = Rp400 juta lolos karena \"terlihat normal per jam\". Jendela terlalu panjang untuk carding: deteksi telat 6 jam × Rp1,1 juta rata-rata loss × puluhan kasus per malam. Dan biaya jendela ganda (tangga) adalah komputasi: tiap jendela tambahan = agregat tambahan yang harus dihitung real-time — di sinilah keputusan jendela bertemu budget 50ms di langkah berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: fitur yang terlalu bagus biasanya mencuri dari masa depan",
        type: "risk",
        body: "Setiap kali sebuah fitur menaikkan AUC lebih dari 0,03 sendirian, investigator yang berpengalaman tidak merayakan — ia mencurigai. Refleks pertamanya bukan \"fitur hebat!\" melainkan \"dari mana ia tahu?\". Inilah uji time-travel yang harus menjadi kebiasaan: bisakah fitur ini dihitung satu detik SEBELUM keputusan diambil, hanya dari informasi yang benar-benar tersedia saat itu? Jika jawabannya \"hampir bisa\" atau \"tergantung\", perlakukan sebagai bocor sampai terbukti sah. Kebiasaan kedua: curigai fitur yang \"tahu\" hasil proses bisnis — status chargeback, keputusan investigator, flag manual — karena ketiganya lahir SETELAH transaksi dan tidak akan ada saat scoring. Kebiasaan ketiga: uji dengan ablation yang jujur — buang fitur itu, latih ulang, dan lihat apakah model runtuh; model yang runtuh karena satu fitur adalah model yang berdiri di atas satu kebohongan. Dan ingat asimetri biayanya: leakage yang lolos ke produksi tidak terdeteksi oleh monitoring biasa (distribusinya stabil!), ia hanya terdeteksi saat uang hilang dan seseorang bertanya kenapa model \"sebagus itu\" tidak menangkap apa-apa. Validasi offline yang memukau + produksi yang bisu = tanda tangan leakage.",
      },
      reference: "Jendela selaras tempo serangan; tangga 1h/24h/7d; replay 10 kasus nyata untuk uji kapan tiap jendela berteriak.",
    },
    {
      id: "leakage-vs-sah",
      eyebrow: "Langkah 8 · Leakage & biaya",
      title: "Fitur bocor vs fitur sah — dan harga real-time-nya",
      prose: [
        "Kontras yang wajib dihafal. Fitur BOCOR: \"apakah transaksi ini di-chargeback\" — ia adalah label yang menyamar; \"berapa hari hingga chargeback\" — mengandung jawaban; \"skor investigator\" — lahir setelah keputusan manusia. Fitur SAH: \"chargeback_rate_merchant_30d\" — agregat historis yang sudah diketahui sebelum transaksi ini; \"days_since_last_chargeback_user\" — masa lalu, bukan masa depan; \"device_age_days\" — fakta saat ini. Pembeda satu kalimatnya: fitur sah menjawab \"apa yang KITA KETAHUI saat memutuskan\", fitur bocor menjawab \"apa yang TERJADI setelahnya\".",
        "Leakage paling licin bukan yang terang-terangan, melainkan agregat yang tercemar masa depan. Contoh: sum_30d yang dihitung mencakup transaksi hari ini DAN 29 hari ke depan karena job batch memakai jendela kalender, bukan jendela trailing. Atau \"rata-rata nominal user\" yang dihitung dari seluruh histori termasuk transaksi yang sedang di-skor. Uji time-travel-nya brutal dan sederhana: bekukan database pada T−1 detik sebelum transaksi, hitung fitur dari situ — jika nilainya berubah dari yang dipakai training, ada kebocoran. Lakukan ini untuk 5 fitur terpenting setiap kali pipeline berubah.",
        "Sekarang harganya. Budget real-time tipikal: 50ms dari transaksi masuk hingga keputusan. Lookup feature store (Redis) p99 8ms untuk 40 fitur — muat. Tetapi satu join lintas sistem (cek daftar mule di core banking) butuh 80ms — sendirian sudah menjebol budget. Pilihanmu tiga: precompute ke feature store (agregat dihitung batch/streaming, scoring hanya lookup), buang fitur itu (terima AUC lebih rendah), atau naikkan budget (terima latensi checkout lebih lama — konversi turun). Tidak ada pilihan gratis.",
        "Hitung kasarnya untuk bank menengah, 8 juta transaksi/bulan. Feature store (Redis cluster + Flink streaming): ±Rp85 juta/bulan infra + 1 engineer. Satu fitur \"mahal\" yang dipaksakan real-time via join sinkron: p99 latensi naik 80ms → checkout 0,5% lebih lambat → pada konversi e-commerce, 0,5% dari GMV bisa berarti miliaran per bulan. Tiba-tiba \"fitur yang menaikkan AUC 0,005\" berharga Rp2 miliar per bulan. Inilah kenapa langkah 5 FR6 berkata fitur mahal yang tidak muat di budget harus di-precompute atau dibuang — sekarang kamu tahu cara menghitung \"mahal\"-nya.",
        "Aturan keputusan akhirnya: setiap fitur baru wajib lolos tiga gerbang sebelum produksi — gerbang leakage (lolos uji time-travel), gerbang latensi (p99 terukur < alokasi budget-nya), dan gerbang biaya (kontribusi AUC × nilai rupiah > biaya infra bulanannya). Fitur yang gagal satu gerbang kembali ke papan gambar, sebagus apa pun angka validasinya. Disiplin ini yang membedakan 15–30 fitur yang terawat dari 300 fitur yang setengah mati.",
      ],
      tasks: [],
      reference: "Uji time-travel: bekukan DB di T−1 detik. Tiga gerbang fitur baru: leakage, latensi p99, biaya vs kontribusi AUC.",
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
        "Window agregat (count/sum/distinct) — pilih window selaras tempo serangan, bukan default.",
        "Baseline per user: z = (x - mu)/sigma — anomali itu relatif, bukan absolut.",
        "Impossible travel = fitur fisika (haversine/Δt > 900 km/jam) — tak bisa di-tune penipu.",
        "Recency (umur akun/device/kredensial) + velocity = pasangan wajib lawan warming/farming.",
        "Satu fitur tepat > 40 fitur basi. Untuk tabel fraud: fitur pakar + GBM masih raja.",
      ],
      next: { label: "FR7 — Supervised ML", href: "/v2/learn/fr7-supervised-ml" },
      quiz: [
        {
          q: "Bu Ani (rata-rata Rp400 rb, SD Rp150 rb) transfer Rp4,5 juta. Berapa z-score personalnya?",
          options: [
            { text: "z = 3,0", why: "Terlalu kecil — hitung: (4.500.000 − 400.000)/150.000." },
            { text: "z ≈ 27,3 — anomali ekstrem untuk Bu Ani", why: "(4.500.000 − 400.000)/150.000 = 27,3. Jauh di atas ambang 3 — untuk BU ANI ini anomali ekstrem, walau untuk pengusaha Rp4,5 juta adalah normal.", correct: true },
            { text: "z = 0,5 — normal", why: "0,5 berarti nyaris di rata-rata — tidak cocok dengan angkanya." },
            { text: "Tidak bisa dihitung", why: "Bisa: semua komponennya (x, mu, sigma) diketahui." },
          ],
        },
        {
          q: "Transaksi di Makassar jam 10:00, lalu di Surabaya jam 10:30 (±800 km). Kesimpulan?",
          options: [
            { text: "Normal — bisa naik pesawat", why: "Pesawat pun butuh ±1 jam untuk 800 km + boarding — 30 menit mustahil." },
            { text: "Impossible travel — 1.600 km/jam > 900 km/jam, mustahil untuk satu orang", why: "800 km / 0,5 jam = 1.600 km/jam > batas pesawat 900 km/jam. Ini dua device/orang berbeda memakai satu akun — sinyal ATO kuat.", correct: true },
            { text: "Butuh data lagi", why: "Kecepatan implisitnya sudah cukup konklusif sebagai sinyal." },
            { text: "Wajar jika pakai VPN", why: "VPN justru menjelaskan KENAPA lokasinya mustahil — ia jejak lain yang memperkuat kecurigaan, bukan pembenaran." },
          ],
        },
        {
          q: "Untuk serangan warming (akun baru, ramai 2-3 hari, lalu serangan besar), window fitur yang TEPAT…",
          options: [
            { text: "30 hari — makin panjang makin bagus", why: "30 hari mengubur sinyal fase warming di riwayat normal." },
            { text: "10 menit — sependek mungkin", why: "10 menit terlalu berisik untuk pola yang berlangsung berhari-hari." },
            { text: "1–72 jam — selaras dengan tempo serangan (fase ramai = jam–hari)", why: "Window harus selaras tempo serangan. 1–72 jam menangkap 'ramai mendadak'.", correct: true },
            { text: "Tidak butuh window", why: "Tanpa window agregat, pola 'ramai mendadak' tidak terlihat." },
          ],
        },
        {
          q: "Mengapa 'device_age_days' menaikkan AUC 0,81 → 0,89 di cerita KreditGo?",
          options: [
            { text: "Karena device age berkorelasi dengan nominal", why: "Bukan korelasi nominal — ini soal dimensi informasi yang baru." },
            { text: "Karena ia menjawab pertanyaan yang tak ditanyakan 40 fitur lain: 'seberapa baru pelaku di baliknya?' — menangkap farming", why: "Fitur itu membawa INFORMASI BARU (dimensi umur/identitas pelaku), bukan varian dari info lama. Kenaikan besar selalu datang dari sudut pandang baru.", correct: true },
            { text: "Karena deep learning", why: "Tidak ada deep learning di cerita ini — cuma satu fitur + GBM." },
            { text: "Kebetulan", why: "Bukan kebetulan — ia menemukan ring farming Rp1,2 miliar yang lolos 8 bulan." },
          ],
        },
        {
          q: "Fitur mana yang PALING sulit di-tune oleh penipu?",
          options: [
            { text: "Nominal transaksi (bisa dikecilkan)", why: "Mengecilkan nominal = gratis bagi penipu." },
            { text: "Jam transaksi (bisa diubah)", why: "Mengubah jam = gratis bagi penipu." },
            { text: "Impossible travel (fisika — tidak bisa teleportasi; mengakalinya butuh VPN yang meninggalkan jejak lain)", why: "Fisika > statistik. Penipu bisa mengubah semua fitur statistik tanpa biaya, tapi tidak bisa melanggar kecepatan pesawat.", correct: true },
            { text: "Kategori merchant (bisa diganti)", why: "Ganti merchant = gratis bagi penipu." },
          ],
        },
      ],
    },
  ],
};
