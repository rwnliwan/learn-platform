import type { V2Lesson } from "../lib/types";

export const fr14: V2Lesson = {
  slug: "fr14-case-management",
  track: "Fraud & AML Analytics",
  module: "Operasi Model",
  title: "FR14 — Case Management",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Antrian yang memakan timnya",
      prose: [
        "BankMega punya 120 kasus per hari dan 2 investigator. Antriannya FIFO — siapa cepat dia dilayani. Investigator menghabiskan pagi meneliti 40 kasus Rp200 ribu (yang sebagian besar false positive), dan baru menyentuh kasus Rp200 juta saat jam 5 sore — dalam keadaan lelah, dengan 20 menit tersisa.",
        "Dari 120 kasus, hanya 85 yang mendapat label berkualitas — 35 sisanya \"tutup asal\" karena kehabisan waktu. Label asal-asalan itu masuk ke training data bulan depan. Model bulan depan belajar dari label asal-asalan. Kualitas model turun. Alert sampah naik. Investigator makin kelelahan. Lingkaran setan yang sempurna.",
        "Case management = sistem operasi tim investigasi: bagaimana kasus masuk, diurutkan, ditangani, diberi label, dan dipelajari. Model terbaik pun mati jika sistem operasinya rusak.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap label buruk yang masuk training data = model bulan depan yang lebih buruk = lebih banyak alert sampah = lebih banyak label buruk. Kualitas label adalah aset paling mahal dalam fraud ML — dan ia diproduksi oleh manusia yang lelah dalam sistem yang buruk. Investasi di case management = investasi di data masa depan.",
      },
      reference: "Label buruk → model buruk → alert sampah → label buruk. Case management memutus lingkaran ini.",
    },
    {
      id: "funnel",
      eyebrow: "Langkah 2 · Funnel",
      title: "Dari 1.000 alert ke 85 label",
      prose: [
        "Funnel tipikal: 1.000 alert → 700 dibuka (300 kedaluwarsa/tidak sempat) → 400 diinvestigasi penuh → 120 dikonfirmasi butuh keputusan → 85 label berkualitas. Setiap tahap bocor — dan setiap kebocoran punya sebab yang bisa diperbaiki.",
        "Angka ekonomi: investigator menangani 60–80 kasus per hari = Rp25–50 ribu per keputusan. Satu keputusan investigator = Rp25–50 ribu. Tiba-tiba jelas kenapa \"review semua alert\" bukan strategi: 1.000 alert x Rp35 ribu = Rp35 juta per hari biaya review. Funnel yang bocor di tahap awal (alert sampah) membakar uang paling banyak.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Investigator kurang — tambah orang.\" Seringkali masalahnya bukan jumlah orang tapi kualitas input: 1.000 alert dengan precision 8% = 920 kasus sia-sia. Menambah investigator tanpa memperbaiki precision = menambah biaya tanpa menambah hasil. Perbaiki corongnya dulu, hitung orangnya kemudian.",
      },
      reference: "Satu keputusan investigator = Rp25–50 ribu. Funnel bocor di awal = bakar uang paling banyak.",
    },
    {
      id: "prioritas",
      eyebrow: "Langkah 3 · Prioritas antrian",
      title: "20% kasus, 48% nilai",
      prose: [
        "Kapasitas 20 kasus dari 100. Prioritas = skor x log(nominal): menangkap expected value, bukan sekadar skor tertinggi (kasus skor 0,98 nominal Rp500rb kalah dari skor 0,74 nominal Rp50jt — benar, karena yang dipertaruhkan 100x lipat). Hasil: 20 kasus teratas mencakup 48,1% dari total expected value.",
        "SLA per tier: skor 0,5+ = 1 jam (uang bergerak cepat), 0,2–0,5 = 4 jam, di bawahnya = 24 jam. Tanpa SLA, kasus mahal menunggu di belakang kasus murah — FIFO adalah keputusan ekonomi yang buruk.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `prio(c)` = skor x log10(nominal)" },
        { id: "t2", text: "Ambil 20 teratas, hitung % expected value yang tercakup" },
        { id: "t3", text: "Cetak 5 teratas + cakupannya" },
      ],
      expected: "Top-20 mencakup 48.1% expected value; 5 teratas didominasi nominal Rp50 jt",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Urutkan by skor saja — yang paling fraud dulu.\" Skor 0,98 x Rp500rb = expected Rp490rb; skor 0,74 x Rp50jt = expected Rp37jt. Mengejar skor tertinggi = mengabaikan 75x nilai. Prioritas = expected value, bukan keyakinan model.",
      },
      hints: [
        "def prio(c): _, s, amt = c; return s * math.log10(amt).",
        "top20 = sorted(cases, key=prio, reverse=True)[:20].",
        "coverage = sum(s*amt top20) / sum(s*amt semua).",
      ],
      code: {
        starter: `# Prioritas antrian: expected value, bukan skor mentah.\nimport random, math\nrandom.seed(60)\ncases = []\nfor i in range(100):\n    s = random.random()\n    amt = random.choice([200_000, 500_000, 1_000_000, 5_000_000, 50_000_000])\n    cases.append((i, s, amt))\n\n# TULIS KODEMU\ndef prio(c):\n    return \n\ntop20 = sorted(cases, key=prio, reverse=True)[:20]\ntot_cov = sum(s*amt for _, s, amt in top20)\ntot_all = sum(s*amt for _, s, amt in cases)\nprint(f"Top-20 mencakup {tot_cov/tot_all:.1%} dari total expected value")\nprint("5 teratas:")\nfor i, s, amt in top20[:5]:\n    print(f"  kasus {i}: skor={s:.2f} nominal=Rp{amt/1e6:.1f} jt")`,
        lockLines: 7,
        solution: `# Prioritas antrian: expected value, bukan skor mentah.\nimport random, math\nrandom.seed(60)\ncases = []\nfor i in range(100):\n    s = random.random()\n    amt = random.choice([200_000, 500_000, 1_000_000, 5_000_000, 50_000_000])\n    cases.append((i, s, amt))\n\n# TULIS KODEMU\ndef prio(c):\n    _, s, amt = c\n    return s * math.log10(amt)\n\ntop20 = sorted(cases, key=prio, reverse=True)[:20]\ntot_cov = sum(s*amt for _, s, amt in top20)\ntot_all = sum(s*amt for _, s, amt in cases)\nprint(f"Top-20 mencakup {tot_cov/tot_all:.1%} dari total expected value")\nprint("5 teratas:")\nfor i, s, amt in top20[:5]:\n    print(f"  kasus {i}: skor={s:.2f} nominal=Rp{amt/1e6:.1f} jt")`,
        checks: [
          { kind: "defined", task: "t1", name: "prio", label: "`prio` terdefinisi", msg: "Buat fungsi prio(c) = skor x log10(nominal)." },
          { kind: "stdout_matches", task: "t3", pattern: "Top-20 mencakup 48\\.1%", label: "Cakupan 48.1%", msg: "20% kasus mencakup 48,1% expected value." },
        ],
      },
      reference: "Prioritas = expected value (skor x nominal). FIFO = keputusan ekonomi yang buruk.",
    },
    {
      id: "label",
      eyebrow: "Langkah 4 · Kualitas label",
      title: "Disagreement 10–20% itu normal",
      prose: [
        "Dua investigator meninjau 200 kasus yang sama: sepakat di 175 (88%), tidak sepakat di 25 (12,5%). Ini NORMAL — bukan tanda tim buruk. Fraud itu ambigu: \"apakah ini mule atau korban?\" sering tidak punya jawaban pasti bahkan bagi ahli.",
        "Yang tidak normal: tidak mengukur disagreement sama sekali. Praktik yang benar: ukur agreement berkala (sample ganda buta), buat guideline tertulis untuk pola umum, adakan kalibrasi rutin (bedah kasus sulit bersama), dan terima bahwa 10–20% disagreement = batas alami — bukan target nol.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan 200 kasus dengan agreement 85%, hitung disagreement" },
        { id: "t2", text: "Cetak agreement/disagreement rate" },
      ],
      expected: "Agreement 175/200 = 88% (disagreement 12% — dalam rentang normal)",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Label adalah 'kebenaran' yang dipelajari model. Jika 12% label kontroversial dan kamu tidak tahu yang mana, modelmu belajar dari 12% kebisingan — dan kamu tidak bisa membedakannya dari sinyal. Mengukur disagreement = mengukur kualitas bahan bakar modelmu.",
      },
      hints: [
        "agree = sum(1 for _ in range(200) if random.random() < 0.85).",
        "print agreement dan disagreement rate.",
        "Bandingkan dengan rentang normal 10-20%.",
      ],
      code: {
        starter: `# Kualitas label: ukur disagreement, jangan asumsikan nol.\nimport random\nrandom.seed(61)\n\n# TULIS KODEMU: 200 kasus, tiap kasus sepakat dengan peluang 85%\nagree =\nprint(f"Agreement: {agree}/200 = {agree/200:.0%}")\nprint(f"Disagreement: {200-agree}/200 = {(200-agree)/200:.0%} (normal: 10-20%)")`,
        lockLines: 3,
        solution: `# Kualitas label: ukur disagreement, jangan asumsikan nol.\nimport random\nrandom.seed(61)\n\n# TULIS KODEMU: 200 kasus, tiap kasus sepakat dengan peluang 85%\nagree = sum(1 for _ in range(200) if random.random() < 0.85)\nprint(f"Agreement: {agree}/200 = {agree/200:.0%}")\nprint(f"Disagreement: {200-agree}/200 = {(200-agree)/200:.0%} (normal: 10-20%)")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "Agreement: 175/200 = 88%", label: "Agreement 88%", msg: "175 dari 200 kasus disepakati kedua investigator." },
          { kind: "stdout_matches", task: "t2", pattern: "Disagreement: 25/200 = 12%", label: "Disagreement 12%", msg: "12% dalam rentang normal 10-20%." },
        ],
      },
      reference: "Disagreement 10–20% = batas alami, bukan target nol. Ukur, kalibrasi, terima.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Sistem operasi investigasi",
      prose: [
        "Satu: intake — alert masuk dengan konteks lengkap (skor, alasan, riwayat) — investigator tidak boleh \"berburu data\" 20 menit per kasus. Dua: triage otomatis — prioritas by expected value + SLA per tier. Tiga: investigasi — guideline tertulis + tools (graf, timeline) + batas waktu per kasus. Empat: keputusan & label — label terstruktur (fraud BUKAN biner: jenis fraud apa?), bukan \"ya/tidak\" malas. Lima: feedback loop — label kembali ke training; pola baru → rule baru.",
        "Label terstruktur penting: \"fraud\" saja tidak cukup — jenisnya (ATO? mule? merchant fiktif?) menentukan rule dan model berikutnya. Label malas = pembelajaran malas.",
      ],
      tasks: [],
      reference: "Lima tahap: intake → triage → investigasi → label terstruktur → feedback loop.",
    },
    {
      id: "delapan-jam",
      eyebrow: "Langkah 6 · Heuristik investigator 8 jam",
      title: "480 menit, 860 menit kebutuhan: matematika alokasi",
      prose: [
        "Seorang investigator punya 8 jam = 480 menit. Bukan 481. Setiap menit yang ia habiskan untuk satu kasus adalah menit yang tidak ia habiskan untuk kasus lain — dan kebanyakan tim tidak pernah menghitung harga menit itu. Mari hitung. Tiga tier kasus di mejanya pagi ini. Tier-1 (skor ≥ 0,7): 12 kasus, probabilitas fraud 50%, rata-rata nominal Rp8 juta → expected value Rp4 juta per kasus, butuh deep review 30 menit. Tier-2 (skor 0,3–0,7): 20 kasus, p=25%, Rp3 juta → EV Rp750 ribu, review 15 menit. Tier-3 (skor < 0,3): 40 kasus, p=8%, Rp1 juta → EV Rp80 ribu, review 5 menit triage cepat.",
        "Total kebutuhan: 12×30 + 20×15 + 40×5 = 360 + 300 + 200 = 860 menit. Kapasitas: 480. Tidak muat — dan 'tidak muat' adalah kondisi permanen, bukan anomali. Maka pertanyaannya bukan 'bagaimana menyelesaikan semua', melainkan '480 menit menghasilkan rupiah terbanyak bila dipakai untuk apa'. Jawabannya ada di EV per jam, bukan EV per kasus. Tier-1: Rp4 juta / 0,5 jam = Rp8 juta per jam. Tier-2: Rp750 ribu / 0,25 jam = Rp3 juta per jam. Tier-3: Rp80 ribu / 5 menit = Rp960 ribu per jam. Urutan alokasi mengikuti angka ini, bukan mengikuti siapa yang datang duluan.",
        "Heuristik 'investigator 8 jam' yang dipakai tim matang: 5 jam untuk tier-1 (10 kasus × Rp4 juta = Rp40 juta EV), 2 jam untuk tier-2 (8 kasus × Rp750 ribu = Rp6 juta), 1 jam untuk tier-3 (12 kasus × Rp80 ribu = Rp960 ribu). Total EV tertangkap ≈ Rp47 juta per hari. Sisa 2 tier-1 + 12 tier-2 + 28 tier-3 menjadi backlog — dengan satu syarat keras: SLA tier-1 maksimal 24 jam, karena nilai kasus fraud meluruh seiring dana bergerak (lihat langkah 7 di FR15: tiap jam keterlambatan menurunkan recovery). Backlog bukan kegagalan; backlog yang tidak di-SLA-kan adalah kegagalan.",
        "Kenapa bukan 'habiskan semua 8 jam untuk tier-1'? Karena 12 kasus tier-1 butuh 360 menit — muat! 12×30 = 360 ≤ 480. Sisa 120 menit untuk tier-2 (8 kasus). Hasil: 12×4jt + 8×750rb = Rp48 juta + Rp6 juta = Rp54 juta — LEBIH BESAR dari heuristik di atas (Rp47 juta). Tunggu — kontradiksi? Tidak. Heuristik 5-2-1 di atas berasumsi investigator tidak bisa deep-review 12 kasus berturut-turut tanpa penurunan kualitas (fatigue nyata setelah kasus ke-8; error rate naik 2x). Aturan praktisnya: alokasikan by EV/jam, TAPI batasi deep review maksimal 10 kasus/hari per orang — selebihnya kualitasnya fiksi. Kapasitas manusia bukan linier; rumus yang mengabaikan fatigue adalah rumus yang berbohong.",
        "Tier-3 pantas mendapat perhatian khusus: Rp960 ribu EV per jam vs biaya investigator Rp150 ribu per jam (gaji + overhead). Masih 'untung' — tapi tipis, dan rapuh: bila probabilitas fraud tier-3 ternyata 5% (bukan 8%), EV/jam jatuh ke Rp600 ribu; bila review-nya molor jadi 8 menit, jatuh ke Rp600 ribu juga. Tier-3 hidup di margin yang bisa negatif karena satu asumsi meleset. Kebijakan yang benar: tier-3 TIDAK direview penuh — ia ditangani dengan triage 5 menit + auto-tutup untuk pola yang sudah dikenal + sampling 10% untuk quality control. Investigator penuh untuk tier-3 adalah kemewahan yang dibayar dengan tier-1 yang terbengkalai.",
        "Sisakan 30 menit buffer — bukan untuk istirahat (itu di luar 8 jam kerja efektif), tapi untuk kasus darurat: fraud yang SEDANG berjalan. Account takeover yang terdeteksi jam 10 pagi dengan dana masih di rekening punya EV tak terhingga dalam jendela menit — ia melompati semua antrean, selalu. Buffer ini juga menampung 'kasus regulator': permintaan mendadak dari OJK/PPATK yang tidak bisa menunggu SLA. Tim yang mengalokasikan 480/480 menit untuk antrean rutin akan selalu mengorbankan tier-1 saat darurat datang; tim yang menyisakan 30 menit membeli opsi untuk tetap rasional saat panik.",
        "Aging: nilai kasus bukan konstanta. Kasus tier-1 yang tidak tersentuh 24 jam kehilangan ~30% nilainya (dana sudah bergerak — ingat kurva recovery FR15: 95% → 60% → 10%). Maka EV yang dipakai untuk alokasi harus EV yang DISESUAIKAN umur: EV_tertimbang = p × nominal × faktor_umur. Kasus tier-1 berumur 20 jam (faktor 0,7): Rp4 juta × 0,7 = Rp2,8 juta — masih di atas tier-2 segar (Rp750 ribu), jadi tetap prioritas. Tapi tier-2 segar vs tier-1 berumur 72 jam (faktor 0,3 → Rp1,2 juta)? Masih tier-1. Titik baliknya: tier-1 baru kalah prioritas dari tier-2 bila faktor umur < 0,19 — sekitar 5 hari. Di situlah SLA 24 jam untuk tier-1 berasal: bukan angka cantik, melainkan titik di mana penundaan mulai membalikkan prioritas.",
        "Terakhir, ukur alokasinya — bukan hanya hasilnya. Tiga metrik mingguan untuk manajer: (1) % jam investigator per tier (target: 60/25/15); (2) EV tertangkap per jam per tier (mendeteksi fatigue dan miskalibrasi skor); (3) umur rata-rata kasus tier-1 saat ditangani (target < 12 jam). Bila % jam tier-3 merayap ke 40%, bukan investigatornya yang malas — sistem triage-nya yang bocor (tier-3 seharusnya mostly auto). Manajemen antrean adalah manajemen waktu; waktu yang tidak diukur akan dihabiskan untuk yang paling berisik, bukan yang paling berharga.",
        "Contoh nyata pergeseran alokasi. Bank 'X' mengukur dan menemukan: investigatornya menghabiskan 45% waktu untuk tier-3 karena 'kasihan antreannya panjang'. Setelah menerapkan heuristik 8 jam + auto-triage tier-3, alokasi menjadi 62/23/15. Hasil 3 bulan: fraud loss turun 18% (Rp1,1 miliar/bulan), complaint 'kasus saya lama' NAIK 5% (tier-3 memang lebih lama) — lalu turun lagi setelah nasabah diedukasi soal SLA. Pelajarannya: alokasi yang benar kadang terlihat 'tidak adil' di permukaan; keadilan yang sesungguhnya adalah menyelamatkan uang paling banyak dengan jam yang paling sedikit.",

        "Contoh jadwal harian konkret — tempel di meja. 08.00–08.15: buka dashboard, cek kasus darurat (fraud aktif?) dan umur tier-1 — bila ada tier-1 berumur > 20 jam, ia dikerjakan pertama (aging). 08.15–13.15: 10 deep review tier-1 (30 menit/kasus, jeda 5 menit tiap 2 kasus untuk menjaga kualitas). 13.15–14.00: istirahat — bukan bagian 480 menit. 14.00–16.00: 8 review tier-2 (15 menit/kasus). 16.00–17.00: 12 triage tier-3 (5 menit/kasus) + 30 menit buffer darurat. Total: 300 + 120 + 60 + 30 = 510? Kelebihan 30 — potong 1 tier-2 dan 2 tier-3. Disiplinnya: jadwal ditulis sebelum hari dimulai, bukan disusun sambil berjalan. Investigator yang 'mengalir mengikuti alert' akan selalu berakhir di tier-3 yang berisik.",
        "Dua investigator, satu antrean — bagi tier by senioritas, bukan by giliran. Senior (2+ tahun): 100% tier-1 + kasus darurat — instingnya mahal, jangan dibayar untuk triage 5 menit. Junior: tier-2 + tier-3 + shadow 1 tier-1 per hari (belajar tanpa mempertaruhkan EV besar). Rotasi: tiap kuartal, junior naik 1 tier selama 2 minggu magang — pipeline kaderisasi. Yang tidak boleh: 'bagi rata 15 kasus per orang' — itu FIFO versi SDM, dengan kerugian yang sama persis: Rp13,77 juta/hari versi manusia. Alokasi orang mengikuti alokasi jam: ke EV/jam tertinggi.",
        "Kapan heuristik ini gagal — dan apa cadangannya. Hari spike: gajian (tanggal 25–1), lebaran, harbolnas — volume alert naik 2–3x, tier-1 bisa 30 kasus (butuh 900 menit). Cadangan: (1) mode darurat — deep review dipadatkan 30→20 menit (checklist, bukan esai), tier-3 100% auto-tutup + sampling; (2) pinjam 2 investigator dari tim lain (sudah dilatih silang sebelumnya); (3) naikkan threshold skor tier-1 sementara (0,7→0,8) agar definisi 'tier-1' mengikuti kapasitas — ini FR11: threshold dihitung mundur dari tim. Heuristik yang tidak punya mode darurat akan dilanggar diam-diam saat spike — dan pelanggaran diam-diam lebih buruk dari tidak punya heuristik.",
        "Ringkasnya, heuristik investigator 8 jam. Satu: hitung EV per JAM per tier (bukan per kasus). Dua: alokasikan jam ke EV/jam tertinggi dengan batas 10 deep-review per orang per hari. Tiga: tier dengan EV/jam di bawah 4x biaya investigator → otomasi + sampling, bukan review penuh. Empat: sesuaikan EV dengan umur kasus (faktor peluruhan). Lima: sisakan 30 menit buffer untuk fraud aktif. Enam: ukur % jam per tier tiap minggu. Delapan jam adalah anggaran tetap; yang membedakan tim hebat dan tim sibuk hanyalah cara mereka membelanjakannya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: antrean adalah portofolio, bukan daftar tunggu",
        type: "risk",
        body: "Setiap kasus di antrean adalah taruhan: 15–30 menit waktu investigator dipertaruhkan untuk expected value tertentu. FIFO memperlakukan semua taruhan sama — seperti manajer investasi yang membagi uang rata ke semua saham tanpa melihat prospeknya. EV-ordering memperlakukan antrean sebagai portofolio: modal (jam) dialokasikan ke return (rupiah terselamatkan) tertinggi. Kedua, waktu adalah modal yang paling langka — 8 jam tidak bisa di-leverage, tidak bisa dipinjam dari besok. Menghabiskan 30 menit untuk kasus EV Rp80 ribu sementara kasus EV Rp4 juta menunggu bukanlah ketekunan; itu misalokasi modal. Ketiga, 'adil' yang merata = merata rugi: keadilan proses (FIFO) terdengar mulia sampai kamu menghitung bahwa ia mengorbankan Rp3,63 miliar per bulan uang korban. Keadilan hasil — selamatkan yang paling banyak dulu — adalah satu-satunya keadilan yang bisa dipertahankan dengan kalkulator. Dan terakhir: guardrail SLA adalah cara berdamai dengan nurani — setiap kasus tetap dijamin ditangani sebelum kedaluwarsa; yang dioptimalkan hanyalah urutannya. Kamu tidak mengabaikan siapa pun; kamu hanya menolak membayar pajak ketidaktertiban.",
      },
      reference: "Alokasikan jam by EV/jam, bukan kasus by waktu datang. Ukur % jam per tier tiap minggu.",
    },
    {
      id: "fifo-vs-ev",
      eyebrow: "Langkah 7 · FIFO vs expected-value",
      title: "Rp13,77 juta per hari: harga sebuah kebiasaan",
      prose: [
        "Setup yang sama: 30 kasus (10 tier-1, 10 tier-2, 10 tier-3 seperti langkah 6), kapasitas 20 review per hari. FIFO memproses 20 kasus yang datang duluan. Asumsikan urutan kedatangan acak — proporsional: ~7 tier-1, 7 tier-2, 6 tier-3. Nilai tertangkap = 7 × Rp4 juta + 7 × Rp750 ribu + 6 × Rp80 ribu = Rp28 juta + Rp5,25 juta + Rp480 ribu = Rp33,73 juta. EV-ordering memproses 10 tier-1 + 10 tier-2 = Rp40 juta + Rp7,5 juta = Rp47,5 juta. Selisih: Rp13,77 juta per hari per investigator. Dengan 12 investigator × 22 hari kerja = Rp3,63 miliar per bulan. Itulah harga sebuah kebiasaan: 'siapa duluan, dia dilayani'.",
        "Rp3,63 miliar per bulan bukan angka retoris — ia setara gaji 200 investigator. Artinya: bank yang memakai FIFO secara efektif membayar 200 gaji untuk mendapatkan hasil 12 orang. Atau dibalik: beralih ke EV-ordering setara menambah 16 'investigator virtual' tanpa merekrut siapa pun. Ketika direksi bertanya 'kenapa butuh tools prioritas?', jawabannya bukan 'agar modern' — melainkan 'agar Rp3,63 miliar per bulan berhenti terbakar'. Bahasa direksi adalah bahasa rupiah per bulan; FIFO vs EV adalah salah satu terjemahan termudah dari teknik ke rupiah.",
        "Kenapa FIFO masih dipakai di begitu banyak tempat? Tiga alasan, semuanya manusiawi. Satu: 'adil' — semua kasus diperlakukan sama. Keadilan proses memang penting untuk kasus hukum; tapi antrean investigasi bukan pengadilan — ia adalah alokasi sumber daya. Keadilan yang sesungguhnya: uang korban yang paling besar diselamatkan duluan. Dua: takut SLA tier-3 jebol — ketakutan yang diselesaikan dengan SLA guardrail, bukan dengan FIFO (lihat bawah). Tiga: sistem bawaan vendor default-nya FIFO, dan tidak ada yang pernah mengubah default. Alasan ketiga adalah yang paling mahal dan paling memalukan.",
        "Solusinya bukan 'EV murni tanpa ampun' — melainkan EV + guardrail. Aturannya: urutkan by EV/jam, TAPI kasus yang umurnya mendekati SLA naik prioritas otomatis (aging penalty: prioritas = EV − denda keterlambatan yang membesar). Tier-3 berumur 70 jam dengan SLA 72 jam melompati tier-2 segar — bukan karena nilainya besar, tapi karena membiarkannya basi lebih mahal (denda SLA + risiko regulasi). Guardrail ini membuat sistem 'adil' dalam arti yang benar: setiap kasus dijamin ditangani sebelum kedaluwarsa, sementara urutan di dalamnya memaksimalkan nilai. FIFO memberi janji palsu 'semua sama'; EV+guardrail memberi janji yang bisa ditepati.",
        "Pengecualian yang melompati segalanya — tanpa perlu dihitung. Satu: fraud yang SEDANG berjalan (account takeover aktif, layering aktif seperti FR15) — EV-nya tak terhingga dalam jendela menit; ia interupsi, bukan antrean. Dua: permintaan regulator (OJK/PPATK) dengan tenggat hukum. Tiga: kasus dengan eksposur media (nasabah viral) — harganya reputasi, bukan rupiah. Selain tiga ini: jangan pernah FIFO. Tempel daftar pengecualian ini di dinding; segala hal lain mengikuti EV. Investigator yang 'mendahulukan yang kasian' sedang beramal dengan uang korban lain.",
        "Transisi dari FIFO ke EV butuh taktik — jangan umumkan 'mulai besok kita tidak adil lagi'. Langkah 1: ukur dulu (2 minggu) — catat % jam per tier dan EV tertangkap; angka baseline ini senjatamu. Langkah 2: jalankan paralel 1 bulan — setengah tim FIFO, setengah EV — bandingkan EV tertangkap per jam. Langkah 3: tunjukkan selisihnya ke tim (mereka yang paling skeptis biasanya yang paling terkejut). Langkah 4: terapkan penuh + guardrail SLA + review mingguan. Yang menolak biasanya bukan karena angkanya salah — tapi karena 'sudah 5 tahun begini'. Data 1 bulan mengalahkan kebiasaan 5 tahun.",
        "Jebakan implementasi: skor yang tidak terkalibrasi. EV-ordering hanya sebagus skor yang mengurutkannya — bila skor tier-1 sistematis overestimate (model terlalu optimis), kamu memprioritaskan sampah dengan percaya diri. Maka sebelum beralih: kalibrasi skor per tier (bandingkan p_prediksi vs p_aktual per tier tiap bulan). Bila tier-1 aktualnya cuma 30% (bukan 50%), EV/jam-nya turun ke Rp4,8 juta — masih di atas tier-2, urutan tidak berubah, tapi angkanya jujur. Prioritas yang salah karena skor yang salah lebih berbahaya dari FIFO — karena ia salah dengan keyakinan.",

        "FIFO tidak hanya hidup di antrean investigator — ia bersembunyi di banyak tempat. Triase alert otomatis yang memproses 'yang masuk duluan'? FIFO. Review model yang mengevaluasi 'kasus terbaru'? Recency bias, sepupu FIFO. Bahkan rapat prioritas yang membahas 'kasus yang paling vokal' adalah FIFO versi politik. Matematikanya sama di semua tempat: sumber daya tetap + urutan acak = nilai hilang. Audit organisasimu: di mana saja keputusan 'siapa duluan' menggantikan 'siapa paling berharga'? Setiap temuan adalah Rp13,77 juta/hari versi divisi itu. Prioritas adalah disiplin yang harus ditegakkan di semua pintu, bukan satu.",
        "Tiga pertanyaan untuk manajermu minggu ini. Satu: berapa % jam tim kita per tier bulan lalu? (Bila tidak bisa menjawab: itu temuan pertama.) Dua: berapa EV tertangkap per jam per tier? (Bila tier-3 di atas tier-1: skormu terbalik.) Tiga: berapa umur rata-rata tier-1 saat ditangani? (Bila > 24 jam: SLA-mu fiksi.) Tiga pertanyaan ini tidak butuh tools baru — hanya query ke sistem kasus yang sudah ada. Manajer yang bisa menjawab ketiganya sedang mengelola; yang tidak, sedang berharap. Dan harapan bukan strategi alokasi.",
        "Ringkasnya: FIFO adalah pajak ketidaktertiban sebesar Rp13,77 juta per hari per investigator. Gantinya: urutkan by EV/jam, pasang guardrail SLA untuk keadilan yang nyata, kecualikan hanya 3 hal (fraud aktif, regulator, viral), dan kalibrasi skornya tiap bulan. Antrean bukan daftar tunggu — ia adalah portofolio taruhan 8 jam yang harus dimenangkan setiap hari.",
      ],
      tasks: [],
      reference: "FIFO = pajak Rp3,63 M/bulan. Gantinya: EV/jam + guardrail SLA + 3 pengecualian.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Funnel: 1.000 alert → 85 label. Tiap kebocoran bisa diperbaiki.",
        "Satu keputusan investigator = Rp25–50 ribu. Prioritas = expected value.",
        "Disagreement 10–20% normal — ukur dan kalibrasi, jangan asumsikan nol.",
        "Label terstruktur (jenis fraud) → feedback loop → model masa depan.",
      ],
      next: { label: "FR15 — AML", href: "/v2/learn/fr15-aml" },
      quiz: [
        {
          q: "Antrian FIFO: 40 kasus Rp200rb diteliti pagi, kasus Rp200jt baru disentuh jam 5 sore. Masalahnya?",
          options: [
            { text: "Tidak ada — adil", why: "Adil ≠ optimal. FIFO membakar kapasitas pada nilai kecil." },
            { text: "FIFO mengabaikan expected value — kasus mahal menunggu di belakang kasus murah; prioritas harus by skor x nominal + SLA per tier", why: "Urutan antrian = keputusan ekonomi.", correct: true },
            { text: "Investigator malas", why: "Sistemnya yang salah, bukan orangnya." },
            { text: "Kasus terlalu banyak", why: "Volume sama — urutannya yang salah." },
          ],
        },
        {
          q: "Dua investigator sepakat di 88% kasus (disagreement 12%). Kesimpulan?",
          options: [
            { text: "Tim buruk — harus 100%", why: "100% tidak realistis — fraud itu ambigu." },
            { text: "Normal (rentang 10–20%) — yang penting diukur berkala, ada guideline, dan kalibrasi rutin", why: "Disagreement = batas alami, bukan kegagalan.", correct: true },
            { text: "Pecat yang tidak sepakat", why: "Disagreement alami — memecat tidak menyelesaikan ambiguitas." },
            { text: "Abaikan", why: "Tanpa pengukuran, kualitas label = misteri." },
          ],
        },
        {
          q: "Mengapa label harus terstruktur (jenis fraud), bukan sekadar 'ya/tidak'?",
          options: [
            { text: "Agar terlihat rapi", why: "Bukan soal kerapian." },
            { text: "Jenis fraud menentukan rule dan model berikutnya — 'fraud' saja tidak memberi tahu pola apa yang harus dipelajari", why: "Label malas = pembelajaran malas.", correct: true },
            { text: "Regulator meminta", why: "Manfaat utamanya untuk pembelajaran model." },
            { text: "Tidak perlu", why: "Perlu — lihat opsi benar." },
          ],
        },
        {
          q: "Lingkaran setan: label buruk → model buruk → alert sampah → label buruk. Di mana memutusnya?",
          options: [
            { text: "Beli model baru", why: "Model baru belajar dari label buruk yang sama." },
            { text: "Tambah investigator", why: "Tanpa perbaiki sistem, label tetap buruk." },
            { text: "Case management: perbaiki triage (kurangi beban sia-sia) + ukur kualitas label + feedback loop terstruktur", why: "Kualitas label = bahan bakar model. Perbaiki sistem operasinya.", correct: true },
            { text: "Terima saja", why: "Menerima = lingkaran setan berlanjut." },
          ],
        },
      ],
    },
  ],
};
