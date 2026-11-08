import type { V2Lesson } from "../lib/types";

export const cr6: V2Lesson = {
  slug: "cr6-analisis-portofolio",
  track: "Credit Risk",
  module: "Kinerja & Analisis Portofolio",
  title: "CR6 — Analisis Portofolio: Vintage & Roll Rate",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Panen yang gagal — salah musim tanamnya",
      prose: [
        "Pak Tanto petani padi. Panen 2024-nya gagal total — bulirnya hampa. Tetangganya menyalahkan hama tahun 2024. Tapi penyuluh pertanian menunjuk data: \"Bukan hamanya, Pak. Benih yang Bapak tanam Maret 2024 memang varietas rentan. Petani yang tanam benih varietas tahan — panennya normal.\" Masalahnya bukan di musim panen — melainkan di musim tanam.",
        "Kredit persis begitu. NPL yang meledak tahun 2026 biasanya bukan \"salah tahun 2026\" — melainkan salah kohort pencairan 2024 (standar underwriting dilonggarkan, marketing kejar target). Analis portofolio tidak bertanya \"NPL bulan ini berapa?\" — melainkan \"vintage mana yang berdarah?\"",
        "Ada cara untuk melihat \"musim tanam\" setiap kredit — namanya vintage analysis. Dan ia bisa membuktikan bahwa NPL 2026 sebenarnya sudah \"diprogram\" sejak 2024.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hafalkan rantai waktu: flow rate (bulan ini) → roll rate (2–3 bulan) → NPL (3–4 bulan) → CKPN & laba (kuartal ini). Analis hebat membaca dari kiri (sebab), direksi biasanya baru sadar di kanan (akibat). Selisihnya = nilaimu sebagai analis.",
      },
      reference: "Tiga lensa: vintage (asal) · roll rate (penyebaran) · flow rate (gelombang baru).",
    },
    {
      id: "vintage",
      eyebrow: "Langkah 2 · Vintage",
      title: "Sidik jari kualitas origination",
      prose: [
        "Vintage = kelompok (kohort) kredit berdasarkan waktu pencairan (misal: semua KPR yang cair Q1 2024). MOB (Month on Book) = umur kredit dalam bulan sejak cair. Vintage curve = grafik % macet per MOB untuk tiap vintage. Seperti rapor angkatan sekolah — angkatan 2023 vs 2024 vs 2025, siapa yang paling banyak \"tinggal kelas\". Kalau angkatan 2024 buruk di semua MOB, masalahnya bukan muridnya (ekonomi), melainkan seleksi masuknya (underwriting 2024).",
        "Contoh: vintage Q1-2024, 1.000 KPR cair. MOB 6: 26 macet / 1000 = 2,6%. MOB 12: 45 macet / 1000 = 4,5%. Bandingkan dengan vintage Q1-2023 di MOB yang SAMA: 2,4% → vintage 2024 hampir 2× lipat. Kesimpulan: underwriting 2024 lebih longgar. Selidiki: cut-off score diturunkan? Target marketing dinaikkan?",
        "Kredit punya siklus hidup risiko. Pola klasik ritel: risiko rendah di bulan-bulan awal, memuncak di MOB 9–24 (masa kritis — yang lemah gugur di sini), lalu menurun. Vintage curve yang tidak mengikuti pola ini = sinyal ada yang berubah: entah underwriting-nya, entah ekonominya, entah fraud-nya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Bandingkan ujung kurva vintage terbaru dengan vintage lama.\" Vintage 2025 baru MOB 12 tidak boleh dibandingkan dengan vintage 2024 di MOB 24 — itu right-censoring (CR5)! Bandingkan selalu di MOB yang sama (MOB 12 vs MOB 12).",
      },
      reference: "Seasoning: kurva mendatar setelah MOB 18 = yang mau macet sudah macet semua.",
    },
    {
      id: "lab-vintage",
      eyebrow: "Langkah 3 · Lab Vintage",
      title: "Detektif origination",
      prose: [
        "Tiga kohort pencairan (default kumulatif % per MOB): v2023, v2024 stabil 24 bulan; v2025 baru 12 bulan. Tugasmu: bandingkan v2024 vs v2023 di MOB 12 (indeks 11) — hitung selisih dan rasionya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih_mob12` = v2024[11] − v2023[11]" },
        { id: "t2", text: "Hitung `rasio_mob12` = v2024[11] / v2023[11]" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "selisih=2.4 rasio=1.9",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan v2025 (MOB 12) dengan ujung v2024 (MOB 24) lalu menyimpulkan \"2025 bagus\". Itu right-censoring — yang jeleknya belum sempat muncul. Selalu bandingkan MOB yang sama.",
      },
      hints: [
        "MOB 12 = indeks 11 (list mulai dari 0).",
        "Selisih = pengurangan; rasio = pembagian.",
        "selisih_mob12 = v2024[11] - v2023[11]",
      ],
      code: {
        starter: `v2023 = [0.3,0.5,0.8,1.1,1.5,1.8,2.1,2.2,2.4,2.5,2.5,2.6,2.6,2.6,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7]\nv2024 = [0.5,0.9,1.4,2.0,2.6,3.2,3.8,4.1,4.5,4.7,4.8,5.0,5.0,5.1,5.1,5.2,5.2,5.2,5.2,5.2,5.2,5.2,5.2,5.2]\n\n# TULIS KODEMU: bandingkan di MOB 12 (indeks 11)\nselisih_mob12 = \nrasio_mob12 = \n\nprint(f"selisih={selisih_mob12:.1f} rasio={rasio_mob12:.1f}")`,
        lockLines: 2,
        solution: `v2023 = [0.3,0.5,0.8,1.1,1.5,1.8,2.1,2.2,2.4,2.5,2.5,2.6,2.6,2.6,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7]\nv2024 = [0.5,0.9,1.4,2.0,2.6,3.2,3.8,4.1,4.5,4.7,4.8,5.0,5.0,5.1,5.1,5.2,5.2,5.2,5.2,5.2,5.2,5.2,5.2,5.2]\n\n# TULIS KODEMU: bandingkan di MOB 12 (indeks 11)\nselisih_mob12 = v2024[11] - v2023[11]\nrasio_mob12 = v2024[11] / v2023[11]\n\nprint(f"selisih={selisih_mob12:.1f} rasio={rasio_mob12:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih_mob12", value: 2.4, tol: 0.05, label: "`selisih_mob12` seharusnya 2.4", msg: "5.0 − 2.6 = 2.4." },
          { kind: "equal", task: "t2", name: "rasio_mob12", value: 1.92, tol: 0.05, label: "`rasio_mob12` seharusnya 1.92", msg: "5.0 / 2.6 ≈ 1,92 — vintage 2024 hampir dua kali lipat 2023." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih=2\\.4\\s+rasio=1\\.9", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: bandingkan 2025 MOB 6 (1,9%) vs 2024 MOB 6 (3,2%) — membaik, tetapi selidiki sebabnya.",
    },
    {
      id: "rollrate",
      eyebrow: "Langkah 4 · Roll Rate",
      title: "Seberapa licin tangganya?",
      prose: [
        "Roll rate = % saldo di bucket DPD tertentu yang memburuk ke bucket berikutnya bulan depan. Pembilang = \"yang jatuh\" dari bucket A; penyebut = \"yang berdiri\" di bucket A. Bucket: Current → 1–30 → 31–60 → 61–90 → 90+ (default).",
        "Contoh: snapshot Juli — bucket 30 hari = Rp 50 M. Snapshot Agustus: dari Rp 50 M itu, Rp 17,5 M kini di bucket 60 hari. Roll rate = 17,5/50 = 35%. Proyeksi: bucket 60 hari Agustus Rp 40 M × roll 60→90 (55%) = Rp 22 M akan masuk 90+ (default) di September. Inilah cara analis meramal NPL 2–3 bulan ke depan — bukan dengan firasat, melainkan dengan tangga roll rate.",
        "Pola menanjak ke kanan adalah hukum alam collection: Current→30 cuma 8% (kebanyakan sembuh), tetapi 120→150 sudah 80% (hampir pasti meluncur ke default). Rp 1 yang diinvestasikan di collection bucket awal jauh lebih efektif daripada di bucket akhir — mencegah lebih murah daripada mengobati (CR22). Roll-rate projection: Rp 100 M di Current × 8% × 35% × 55% × 70% ≈ Rp 1,08 M akan jadi default 4 bulan lagi.",
      ],
      formula: String.raw`\text{Roll rate}_{A \to B} = \frac{\text{Saldo pindah dari bucket A ke B}}{\text{Saldo bucket A di awal}}`,
      formulaNote: "Pembilang = saldo yang \"jatuh\" dari bucket A ke bucket B (mis. Rp 17,5 M dari bucket 30 hari). Penyebut = saldo bucket A di awal periode (Rp 50 M). Contoh: 17,5/50 = 35% — tiap Rp 100 di bucket 30 hari, Rp 35 memburuk bulan depan. Roll rate menanjak ke kanan: 8% (Current→30) vs 80% (120→150) — cegah di kiri, jangan obati di kanan.",
      tasks: [],
      reference: "Di bank, roll rate dihitung via SQL: self-JOIN snapshot bulan ini dengan bulan lalu pada nasabah yang sama.",
    },
    {
      id: "lab-rollrate",
      eyebrow: "Langkah 5 · Lab Roll Rate",
      title: "Hitung roll rate dari snapshot",
      prose: [
        "Snapshot DPD 5 nasabah: Juli → Agustus. A: 0→15, B: 0→0, C: 15→45, D: 0→35, E: 45→90. Tugasmu: hitung roll rate dari Current (DPD 0 di Juli) ke DPD>0 (Agustus), dalam persen.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_current` = nasabah ber-DPD 0 di Juli" },
        { id: "t2", text: "Hitung `n_masuk` = dari mereka yang DPD>0 di Agustus, lalu `roll_rate` (%)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "n_current=3 n_masuk=2 roll_rate=66.7",
      hints: [
        "Saring nasabah dengan dpd Juli = 0.",
        "Dari yang tersaring, hitung yang dpd Agustus > 0.",
        "n_current = sum(1 for n in jul if jul[n] == 0)",
      ],
      code: {
        starter: `# snapshot DPD per nasabah: Juli -> Agustus\njul = {"A": 0, "B": 0, "C": 15, "D": 0, "E": 45}\nagu = {"A": 15, "B": 0, "C": 45, "D": 35, "E": 90}\n\n# TULIS KODEMU: roll rate Current(Jul) -> DPD>0 (Agu), dalam %\nn_current = \nn_masuk = \nroll_rate = \n\nprint(f"n_current={n_current} n_masuk={n_masuk} roll_rate={roll_rate:.1f}")`,
        lockLines: 2,
        solution: `# snapshot DPD per nasabah: Juli -> Agustus\njul = {"A": 0, "B": 0, "C": 15, "D": 0, "E": 45}\nagu = {"A": 15, "B": 0, "C": 45, "D": 35, "E": 90}\n\n# TULIS KODEMU: roll rate Current(Jul) -> DPD>0 (Agu), dalam %\nn_current = sum(1 for n in jul if jul[n] == 0)\nn_masuk = sum(1 for n in jul if jul[n] == 0 and agu[n] > 0)\nroll_rate = n_masuk / n_current * 100\n\nprint(f"n_current={n_current} n_masuk={n_masuk} roll_rate={roll_rate:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_current", value: 3, tol: 1e-9, label: "`n_current` seharusnya 3", msg: "A, B, D ber-DPD 0 di Juli." },
          { kind: "equal", task: "t2", name: "n_masuk", value: 2, tol: 1e-9, label: "`n_masuk` seharusnya 2", msg: "A (15) dan D (35) masuk DPD di Agustus; B tetap 0." },
          { kind: "equal", task: "t2", name: "roll_rate", value: 66.7, tol: 0.1, label: "`roll_rate` sekitar 66.7", msg: "2/3 × 100 ≈ 66.7." },
          { kind: "stdout_matches", task: "t3", pattern: "n_current=3\\s+n_masuk=2\\s+roll_rate=66\\.7", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Pola SQL-nya: self-JOIN snapshot a (Jul) dengan b (Agu) ON nasabah, lalu % yang pindah bucket.",
    },
    {
      id: "flowrate",
      eyebrow: "Langkah 6 · Flow Rate",
      title: "Denyut nadi bulanan & static pool",
      prose: [
        "Flow rate = % portofolio yang masuk ke bucket bermasalah bulan ini (arus masuk). Static pool = vintage yang dikunci — tidak ada kredit baru masuk, hanya dilacak sampai lunas/macet (\"akuarium tertutup\"). Kapan pakai apa: vintage curve → \"angkatan mana yang bermasalah?\" (kualitas origination); roll rate → \"seberapa cepat masalah menyebar?\" (efektivitas collection + proyeksi); flow rate → \"bulan ini ada gelombang baru?\" (deteksi dini); static pool → \"berapa % akhirnya macet total?\" (LGD & validasi model — pool tertutup = tidak ada gangguan kredit baru).",
        "Flow rate adalah alarm kebakaran portofolio — ia berbunyi 2–3 bulan SEBELUM NPL naik. Contoh: Jan–Mar stabil ~1,2%, lalu April melonjak 2,8% dan bertahan. Ini gelombang — bukan noise. Analis langsung bertanya: apa yang terjadi di April? Aturan praktis: flow rate melonjak 1 bulan → waspada (bisa musiman); melonjak 3 bulan → bertindak (tambah kapasitas collection bucket awal).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"NPL stabil = portofolio sehat.\" NPL bisa stabil sementara flow rate melonjak dan roll rate memburuk — ada jeda 2–4 bulan sebelum masalah mencapai bucket 90+. Analis yang hanya memantau NPL seperti sopir yang hanya melihat spion: tahu ada masalah setelah menabrak.",
      },
      reference: "Untuk model LGD internal yang kredibel: pakai static pool — kohort default yang dikunci dan diikuti recovery-nya hingga tuntas.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: lensa portofolio apa yang dipakai",
      prose: [
        "Skenario 1 — NPL naik dan semua menyalahkan ekonomi. → Buka vintage curve dulu: angkatan mana yang berdarah? Contoh nyata: vintage KUR 2024 di MOB 12 macet 5,1% vs vintage 2022–2023 di MOB yang sama 2,3–2,5% — masalahnya 'musim tanam' 2024, bukan 'hama' 2026.",
        "Skenario 2 — Vintage buruk sejak MOB awal. → Diagnosis: origination — selidiki pelonggaran standar (cut-off turun 40 poin?). Obatnya: kembalikan standar + perketat monitoring vintage itu, BUKAN menambah 50 kolektor.",
        "Skenario 3 — Flow rate melonjak 3 bulan berturut-turut. → Bertindak: ada gelombang baru — alarm ini berbunyi 2–3 bulan SEBELUM NPL naik. Satu bulan melonjak = waspada; tiga bulan = intervensi.",
        "Skenario 4 — Flow naik tetapi komposisi vintage normal, namun roll 30→60 memburuk 35% → 55%. → Diagnosis: efektivitas collection turun — perbaiki penagihan (CR22), bukan underwriting.",
        "Skenario 5 — Butuh angka LGD yang bisa dipertahankan di depan auditor. → Bangun static pool tertutup: kunci 5.000 rekening, lacak 24 bulan sampai tuntas. Contoh nyata: pool KTA Rp 150 M → macet kumulatif 6,9% → LGD 55% yang kredibel.",
        "Aturan praktis 10 detik: baca berurutan — flow = deteksi (apakah ada gelombang?), vintage = asal (angkatan mana?), roll = kecepatan (seberapa cepat menyebar?). Gelombang tanpa asal = panik buta; asal tanpa kecepatan = salah dosis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menyalahkan 'daya beli turun' saat NPL KUR melonjak — padahal KPR dan KMK vintage 2024 normal-normal saja, dan vintage KUR 2024 sudah menunjukkan pola 'lahir bermasalah' sejak MOB awal. Dalih makro menutupi dosa underwriting.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Vintage 2024 yang \"aneh\"",
      prose: [
        "Bank Nusantara, segmen KUR. NPL naik 2,1% → 3,8% dalam setahun. Tim bisnis berdalih: \"Daya beli turun, bukan salah kami.\" Datamu: vintage 2024 (cair saat program KUR diperluas) di MOB 12: 5,1% macet; vintage 2022 & 2023 di MOB 12: 2,3% dan 2,5%; cut-off score KUR diturunkan 40 poin pada Jan 2024 (untuk kejar target penyaluran); segmen non-KUR (KPR, KMK) dengan vintage 2024: normal (tidak melonjak); flow rate KUR melonjak sejak 6 bulan setelah pelonggaran — konsisten dengan seasoning.",
        "Pembahasan: dalih tidak valid. Tiga argumen. (1) Kontrol segmen: kalau daya beli penyebabnya, KPR & KMK vintage 2024 ikut melonjak — faktanya tidak. Masalahnya spesifik KUR. (2) Sidik jari underwriting: vintage 2024 melonjak sejak MOB awal (bukan tiba-tiba di MOB 12) + bertepatan dengan penurunan cut-off 40 poin. Ini pola \"lahir bermasalah\", bukan \"terpukul ekonomi\". (3) Timing konsisten: flow rate melonjak 6 bulan pasca pelonggaran — sesuai masa seasoning KUR, bukan pola guncangan makro (yang biasanya serentak).",
        "Kesimpulan untuk direksi: NPL 2026 adalah buah dari keputusan Jan 2024. Solusinya bukan menyalahkan ekonomi, melainkan mengembalikan cut-off + memperketat monitoring vintage 2024 yang masih berjalan.",
      ],
      tasks: [],
      reference: "Masalah lahir di origination (CR1) — vintage curve adalah bukti forensiknya.",
    },
    {
      id: "baca-kiri",
      eyebrow: "Langkah 9 · Urutan baca",
      title: "Vintage, flow, roll: siapa bicara duluan",
      prose: [
        "Tiga lensa portofolio menjawab tiga pertanyaan berbeda, dan urutan membacanya menentukan diagnosis. Flow rate bertanya \"apakah ada gelombang baru bulan ini?\" (deteksi). Vintage bertanya \"angkatan mana yang membawanya?\" (asal). Roll rate bertanya \"seberapa cepat ia menyebar?\" (kecepatan). Analis yang membaca dengan urutan ini tidak pernah salah obat: gelombang tanpa asal = panik buta; asal tanpa kecepatan = tahu penyakitnya tetapi salah dosis.",
        "Contoh dengan angka: flow rate KUR melonjak 1,2% → 2,8% di April. Dekomposisi vintage: 70% kenaikan berasal dari vintage 2024 (angkatan cut-off diturunkan), 30% sisanya tersebar. Diagnosis: masalah origination — obatnya mengembalikan cut-off dan memperketat monitoring vintage 2024, BUKAN menambah 50 kolektor. Skenario sebaliknya: flow naik tetapi komposisi vintage normal, namun roll 30→60 memburuk 35% → 55% — diagnosis: efektivitas collection turun (mungkin kapasitas atau strategi kontak), obatnya perbaiki collection. Obat yang tertukar = biaya tanpa hasil.",
        "Cara salah yang paling mahal: menambah headcount collection saat masalahnya origination. Rp 2 M per tahun untuk 50 kolektor baru tidak menyembuhkan vintage 2024 yang \"lahir\" buruk — ia hanya mengejar kerugian yang sudah diprogram. Cara salah kedua: mengencangkan cut-off saat masalahnya collection — pertumbuhan dibunuh, tetapi kebocoran collection tetap. Keduanya terlihat \"tegas\"; keduanya salah sasaran.",
        "Matriks keputusan untuk ditempel di dinding. Flow naik + vintage BARU buruk → perketat origination (cut-off, verifikasi). Flow naik + vintage LAMA buruk → tambah kapasitas collection bucket awal. Roll rate memburuk di semua vintage → efektivitas collection bermasalah (strategi, insentif, atau kapasitas). Flow stabil + NPL naik → curigai permainan denominator (restrukturisasi/evergreening) atau write-off yang ditunda — bedah pembilang vs penyebut. Empat sel, empat obat berbeda; diagnosis dulu, resep kemudian.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: rawat insiden, bukan prevalensi",
        body: "Pinjam kacamata epidemiologi: flow rate adalah insiden (kasus baru), NPL adalah prevalensi (kasus menumpuk). Dokter yang baik mengelola insiden — mencegah penularan — bukan menunggu prevalensi membludak lalu membangun rumah sakit darurat. Analis portofolio yang hanya memantau NPL adalah dokter yang menghitung mayat. Heuristik yang tidak nyaman: tindakan terbaik sering terlihat salah selama tiga bulan. Ketika flow naik tetapi NPL masih cantik, analis yang berteriak akan ditertawakan (\"NPL kita baik-baik saja!\") — sampai tiga bulan kemudian ia terbukti benar. Manajemen yang menghukum peringatan dini akan mendapatkan bencana yang terlambat. Maka ukur nilaimu sebagai analis bukan dari \"apakah NPL bulan ini akurat dilaporkan\", melainkan dari jarak waktu antara kamu melihat sebab (kiri) dan direksi melihat akibat (kanan). Semakin panjang jarak itu, semakin berharga kamu — dan semakin berani manajemenmu harusnya. Bangun keberanian itu dengan jejak tertulis: setiap peringatan dini yang kamu keluarkan dicatat dengan tanggal dan datanya. Tiga bulan kemudian, saat terbukti benar, tunjukkan catatannya — bukan untuk menyombongkan diri, melainkan untuk membeli kredibilitas peringatan berikutnya. Analis tanpa jejak hanya punya opini; analis dengan jejak punya otoritas.",
      },
      reference: "Diagnosis: flow → vintage → roll. Obat mengikuti diagnosis, bukan sebaliknya.",
    },
    {
      id: "static-pool",
      eyebrow: "Langkah 10 · Static pool",
      title: "Akuarium tertutup: static pool yang benar",
      prose: [
        "Static pool = kohort kredit yang dikunci pada tanggal tertentu, lalu dilacak nasibnya sampai lunas atau macet — tanpa ada kredit baru yang masuk. Seperti akuarium tertutup: kamu melihat siklus hidup murni tanpa gangguan pertumbuhan. Vintage biasa tercemar pertumbuhan — vintage 2024 yang terus diisi kredit baru tiap bulan tidak pernah memberi gambaran maturasi yang bersih, karena komposisinya berubah terus.",
        "Contoh dengan angka: kunci 5.000 KTA yang cair Januari 2024 (total Rp 150 M). Lacak 24 bulan: bulan 6 macet kumulatif 2,1%; bulan 12: 4,8%; bulan 18: 6,2%; bulan 24: 6,9% (mendatar — seasoning selesai). Dari pool yang sama, hitung LGD: dari Rp 10,35 M yang macet, recovery Rp 4,66 M → LGD 55%. Inilah LGD yang kredibel untuk model — dari kohort tertutup yang diikuti sampai tuntas, bukan dari campuran vintage yang masih berjalan. Regulator dan auditor mempercayai angka dari akuarium tertutup jauh lebih daripada dari \"vintage biasa\".",
        "Cara salah yang umum: memakai vintage berjalan untuk estimasi LGD (\"kan sama-sama kohort\"). Vintage berjalan punya right-censoring — kredit yang cair belakangan belum sempat macet, sehingga LGD terlihat lebih kecil dari sebenarnya. Cara salah kedua: pool yang \"bocor\" — restrukturisasi yang mengubah tanggal pencairan diam-diam me-reset umur kredit, mengotori pool. Static pool butuh disiplin definisi: tanggal kunci tidak berubah, restrukturisasi dicatat sebagai event (bukan kelahiran baru).",
        "Kapan memakai apa — aturan keputusan final. Vintage berjalan → monitoring origination bulanan (\"angkatan mana bermasalah?\"). Flow rate → alarm dini (\"ada gelombang?\"). Roll rate → proyeksi NPL 2–4 bulan dan efektivitas collection. Static pool → estimasi LGD, validasi model, dan menjawab \"berapa persen AKHIRNYA macet?\" Empat alat, empat pertanyaan; analis lengkap memakai semuanya, analis malas hanya memakai NPL.",
      ],
      tasks: [],
      reference: "Static pool = kohort dikunci + dilacak tuntas. Untuk LGD dan validasi, tidak ada penggantinya.",
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
        "Vintage = kohort pencairan; MOB = umur kredit. Bandingkan selalu di MOB yang sama.",
        "Vintage yang melesat sejak MOB awal = sidik jari underwriting longgar, bukan ekonomi.",
        "Roll rate = yang jatuh / yang berdiri — mesin peramal NPL 2–4 bulan ke depan.",
        "Flow rate = alarm dini (berbunyi sebelum NPL); static pool = akuarium tertutup untuk LGD/validasi.",
        "NPL stabil tidak berarti sehat — baca sebab (flow, roll, vintage), bukan cuma akibat.",
      ],
      next: { label: "CR7A — Application Scorecard 1", href: "/v2/learn/cr7a-application-scorecard-1" },
      quiz: [
        {
          q: "Vintage 2024 di MOB 12 = 5,1% macet; vintage 2023 di MOB 12 = 2,5%. Kesimpulan terbaik?",
          options: [
            { text: "2024 lebih buruk — indikasi underwriting 2024 lebih longgar (bandingkan di MOB sama)", why: "Perbandingan di MOB yang SAMA menunjukkan kualitas origination. 2× lipat = sidik jari underwriting, bukan ekonomi.", correct: true },
            { text: "2024 lebih baik", why: "Angkanya justru hampir dua kali lipat lebih buruk." },
            { text: "Tidak bisa dibandingkan beda tahun", why: "Justru bisa — itulah gunanya membandingkan di MOB yang sama." },
            { text: "Ekonomi 2024 lebih buruk", why: "Kalau ekonomi penyebabnya, vintage 2023 ikut naik di MOB 18–24 — faktanya tidak." },
          ],
        },
        {
          q: "Bucket 30 hari = Rp 50 M (Jul); Rp 17,5 M di antaranya jadi bucket 60 hari (Agu). Roll rate?",
          options: [
            { text: "17,5%", why: "Itu angkanya dalam Rp M, bukan rasionya." },
            { text: "35%", why: "17,5/50 = 35%. Roll rate = yang jatuh / yang berdiri di awal.", correct: true },
            { text: "50%", why: "Tidak ada dasar 50%." },
            { text: "65%", why: "Itu 1 − 35% — kebalikannya (yang sembuh)." },
          ],
        },
        {
          q: "NPL stabil 3 bulan, tapi flow rate ke bucket 30 naik 3 bulan berturut-turut. Artinya?",
          options: [
            { text: "Aman — NPL stabil", why: "NPL = akibat yang datang belakangan (jeda 2–4 bulan)." },
            { text: "Waspada — gelombang masalah sedang berjalan menuju NPL (jeda 2–4 bulan); selidiki sekarang", why: "Flow rate adalah alarm dini. Analis membaca sebab (kiri), bukan menunggu akibat (kanan).", correct: true },
            { text: "Flow rate tidak penting", why: "Flow rate justru indikator paling awal." },
            { text: "Segera write-off", why: "Terlalu dini — masalahnya baru di bucket 30." },
          ],
        },
        {
          q: "Kapan memakai static pool (bukan vintage biasa)?",
          options: [
            { text: "Untuk laporan harian", why: "Static pool untuk analisis maturasi, bukan laporan harian." },
            { text: "Saat butuh kurva maturasi bersih (estimasi LGD/validasi) — pool dikunci tanpa kredit baru agar tidak terkontaminasi pertumbuhan", why: "Vintage biasa tercampur kredit baru tiap bulan; static pool memberi gambaran maturasi murni.", correct: true },
            { text: "Tidak pernah — vintage selalu lebih baik", why: "Keduanya punya fungsi berbeda." },
            { text: "Hanya untuk KPR", why: "Berlaku untuk semua segmen, terutama untuk LGD." },
          ],
        },
        {
          q: "NPL agregat stabil 2,5%, tetapi vintage 2024 menunjukkan default kumulatif 7% di MOB 12 (vs 4% vintage 2022). Kesimpulan?",
          options: [
            { text: "Tidak ada masalah — NPL agregat stabil", why: "Agregat menyembunyikan masalah angkatan." },
            { text: "Waspada: vintage 2024 bermasalah; NPL agregat tertahan oleh vintage lama yang bagus — gelombang akan datang 6–12 bulan lagi", why: "Analis yang membaca vintage sudah menyiapkan CKPN dari sekarang.", correct: true },
            { text: "Vintage 2024 pasti fraud", why: "Buruk belum tentu fraud — bisa underwriting longgar." },
            { text: "Hentikan semua penyaluran kredit", why: "Terlalu ekstrem — perketat standar dan pantau vintage 2024." },
          ],
        },
      ],
    },
  ],
};
