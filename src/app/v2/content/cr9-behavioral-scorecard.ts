import type { V2Lesson } from "../lib/types";

export const cr9: V2Lesson = {
  slug: "cr9-behavioral-scorecard",
  track: "Credit Risk",
  module: "Scorecard & Pemodelan PD",
  title: "CR9 — Behavioral Scorecard & Early Warning",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Empat sirene yang tidak didengar",
      prose: [
        "Nasabah KTA Bank Nusantara: utilisasi kartu melonjak 35% → 70% dalam 3 bulan. Mutasi rekening turun >40% — gelombang PHK sektor tekstil. SLIK menunjukkan Kolek 2 di bank lain. Empat sirene menyala — tidak satu pun didengar, karena semua orang hanya memantau DPD.",
        "DPD = 0 sampai detik terakhir. Lalu ia macet. Application scorecard (CR7) menilai nasabah saat lahir — tetapi manusia berubah. Behavioral scorecard menilai nasabah yang hidup: dari perilakunya bulan per bulan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Application = foto saat lahir; behavioral = CCTV semasa hidup. Nasabah berubah — model harus ikut berubah. Perilaku adalah pengakuan yang jujur: aplikasi kredit bisa berbohong, tetapi mutasi rekening tidak.",
      },
      reference: "Tiga scorecard: application (layak diberi?) · behavioral (masih sehat?) · collection (bagaimana menagih?).",
    },
    {
      id: "behavioral",
      eyebrow: "Langkah 2 · Behavioral",
      title: "Raport semester berjalan",
      prose: [
        "Behavioral scorecard = model yang memprediksi peluang default 12 bulan ke depan untuk nasabah existing, memakai data perilaku (bukan data pengajuan). Lima sinyal: utilisasi limit — % limit yang dipakai, melonjak = kepepet; tren mutasi — naik/turunnya arus kas rekening, turun tajam = penghasilan terganggu; pola pembayaran — bayar penuh vs minimum vs telat, bayar minimum terus = gali lubang; DPD historis — pernah telat = prediktor kuat (perilaku berulang); SLIK lintas bank — memburuk di bank lain = menular ke sini.",
        "Application scorecard seperti nilai raport saat masuk sekolah — sekali ukur. Behavioral scorecard seperti raport tiap semester — diperbarui terus. Murid yang dulu pintar bisa menurun; nasabah yang dulu prima bisa kepepet. Perbedaan kunci: behavioral memakai time series perilaku (tren 3–6 bulan), bukan snapshot.",
        "Variabel behavioral terbaik adalah turunan pertama (perubahan), bukan level. Utilisasi 80% yang stabil 2 tahun ≠ utilisasi 80% yang melonjak dari 30% dalam 2 bulan. Yang pertama gaya hidup, yang kedua sirene. Model yang hanya pakai level akan menyamakan keduanya — dan salah besar.",
      ],
      tasks: [],
      reference: "Aturan praktis: utilisasi >90% + tren naik 3 bulan = kirim ke daftar pantau.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 3 · Lab Skor",
      title: "Perilaku bicara lebih keras dari form",
      prose: [
        "Skor perilaku dari 3 sinyal: utilisasi (%), tren mutasi (% perubahan 3 bulan), DPD historis (hari). Rumus terkunci: mulai 700; −1,2 per % utilisasi di atas 30%; +0,8 per % tren mutasi (dibatasi ±60); −2 per hari DPD. Tugasmu: hitung skor tiga profil.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor_a` (util 30%, mutasi +10%, DPD 0) dan `skor_b` (util 85%, mutasi −45%, DPD 0)" },
        { id: "t2", text: "Hitung `skor_c` (util 40%, mutasi −10%, DPD 25)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "a=708 b=598 c=630",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menilai nasabah hanya dari DPD = 0 lalu menyimpulkan aman. Profil B (skor 598) belum menunggak sama sekali — tetapi perilakunya sudah berteriak. Itulah early warning: perilaku memburuk SEBELUM DPD.",
      },
      hints: [
        "Fungsi behavioral_score sudah disediakan — panggil dengan tiga angka.",
        "Urutan argumen: utilisasi, tren_mutasi, dpd_max.",
        "skor_a = behavioral_score(30, 10, 0)",
      ],
      code: {
        starter: `def behavioral_score(utilisasi, tren_mutasi, dpd_max):\n    skor = 700\n    skor -= max(0, utilisasi - 30) * 1.2\n    skor += max(-60, min(60, tren_mutasi)) * 0.8\n    skor -= dpd_max * 2.0\n    return max(300, min(850, int(skor)))\n\n# TULIS KODEMU\nskor_a = \nskor_b = \nskor_c = \n\nprint(f"a={skor_a} b={skor_b} c={skor_c}")`,
        lockLines: 6,
        solution: `def behavioral_score(utilisasi, tren_mutasi, dpd_max):\n    skor = 700\n    skor -= max(0, utilisasi - 30) * 1.2\n    skor += max(-60, min(60, tren_mutasi)) * 0.8\n    skor -= dpd_max * 2.0\n    return max(300, min(850, int(skor)))\n\n# TULIS KODEMU\nskor_a = behavioral_score(30, 10, 0)\nskor_b = behavioral_score(85, -45, 0)\nskor_c = behavioral_score(40, -10, 25)\n\nprint(f"a={skor_a} b={skor_b} c={skor_c}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor_a", value: 708, tol: 1e-9, label: "`skor_a` seharusnya 708", msg: "700 + 10×0.8 = 708." },
          { kind: "equal", task: "t1", name: "skor_b", value: 598, tol: 1e-9, label: "`skor_b` seharusnya 598", msg: "700 − 66 − 36 = 598. DPD 0 tetapi skor jatuh." },
          { kind: "equal", task: "t2", name: "skor_c", value: 630, tol: 1e-9, label: "`skor_c` seharusnya 630", msg: "700 − 12 − 8 − 50 = 630." },
          { kind: "stdout_matches", task: "t3", pattern: "a=708\\s+b=598\\s+c=630", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: profil 'util 95%, mutasi -60%, DPD 15' — skornya jatuh padahal belum ada tunggakan >30 hari.",
    },
    {
      id: "ews",
      eyebrow: "Langkah 4 · EWS",
      title: "Detektor asap kredit",
      prose: [
        "EWS (Early Warning System) = aturan/model yang mengubah sinyal perilaku menjadi alert + aksi sebelum tunggakan terjadi. Bukan sekadar skor — melainkan sistem saraf yang terhubung ke tindakan: telepon, kunjungan, penurunan limit, restrukturisasi dini.",
        "Lima sinyal terkuat (pengalaman industri Indonesia): SLIK memburuk di bank lain (kekuatan 0,71) = sinyal terkuat — nasabah biasanya macet di bank lain dulu sebelum di sini (efek \"pilih kasih bayar\"); mutasi turun >40% (0,65) = PHK/usaha terganggu. Kombinasi 2–3 sinyal = alert merah. Satu sinyal = alert kuning (pantau).",
        "EWS yang bekerja: sinyal → alert → playbook (siapa menelepon, dalam berapa hari, tawaran apa). Bank dengan EWS terbaik bukan yang sinyalnya paling canggih, melainkan yang waktu reaksi tercepat dari sinyal ke tindakan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"EWS = dashboard merah yang dilihat sebulan sekali.\" EWS tanpa aksi otomatis = hiasan. EWS yang berbunyi tiap hari tetapi tidak ada yang menindaklanjuti = sensor tanpa otot. Yang menentukan adalah waktu reaksi sinyal→aksi, bukan kecanggihan model.",
      },
      reference: "Alert fatigue: 500 alert sekaligus → kalibrasi musiman + prioritaskan 2+ sinyal + tiered action.",
    },
    {
      id: "collection",
      eyebrow: "Langkah 5 · Collection",
      title: "Menagih dengan otak",
      prose: [
        "Collection scorecard memprediksi — untuk nasabah yang sudah menunggak — dua hal: peluang bayar jika dihubungi (propensity to pay): siapa yang akan bayar kalau ditelepon/dikunjungi? Dan responsivitas terhadap aksi (uplift): siapa yang butuh dihubungi (tidak akan bayar sendiri) vs yang akan bayar sendiri tanpa diganggu?",
        "Seperti dokter triase di IGD — bukan \"siapa paling sakit\", melainkan \"siapa yang paling terbantu oleh tindakan kita sekarang\". Empat kuadran: mau bayar + butuh diingatkan → telepon/SMS (murah, efektif); mau bayar + akan bayar sendiri → jangan ganggu (hemat biaya, jaga hubungan); tidak mau/tidak mampu + responsif terhadap negosiasi → kunjungan + restrukturisasi; tidak mampu total → alihkan ke remedial/legal (jangan buang biaya telepon).",
        "Data: skor 750+ → 92% bayar setelah dihubungi (telepon murah = efektif). Skor <600 → cuma 12% (telepon = buang pulsa; butuh kunjungan/restrukturisasi). Dengan tim terbatas, hubungi dari skor tertinggi ke bawah — tiap rupiah collection menghasilkan recovery maksimum.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Collection = kejar yang tunggakannya paling besar.\" Tunggakan Rp 100 jt × peluang bayar 10% = ekspektasi Rp 10 jt. Tunggakan Rp 40 jt × peluang 90% = ekspektasi Rp 36 jt. Collection optimal memaksimalkan peluang × outstanding − biaya, bukan outstanding saja.",
      },
      reference: "'Kejar yang besar' adalah insting yang salah — triase memakai ekspektasi, bukan nominal.",
    },
    {
      id: "lab-collection",
      eyebrow: "Langkah 6 · Lab Collection",
      title: "Alokasi budget yang optimal",
      prose: [
        "Budget collection Rp 100 jt/bulan, biaya Rp 0,5 jt per kontak → 200 kontak. 1000 nasabah menunggak dengan skor perilaku dan peluang bayar. Kode populasi terkunci. Tugasmu: hitung total ekspektasi recovery (juta Rp) untuk strategi 'skor' (prioritaskan skor tertinggi) vs 'acak'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rec_skor` = recovery strategi 'skor'" },
        { id: "t2", text: "Hitung `rec_acak` = recovery strategi 'acak', dan `selisih` = rec_skor − rec_acak" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "skor=5980.2 acak=5248.9 selisih=731.3",
      hints: [
        "Fungsi alokasi(strategi) mengembalikan (recovery, contacted).",
        "Panggil dua kali: alokasi('skor') dan alokasi('acak').",
        "Ambil elemen pertama dari hasil (recovery).",
      ],
      code: {
        starter: `import random\nrandom.seed(21)\n\nnasabah = []\nfor _ in range(1000):\n    skor = int(random.gauss(650, 70))\n    p_dihubungi = min(0.95, max(0.05, (skor - 500) / 400))\n    p_dibiarkan = p_dihubungi * 0.4\n    outstanding = random.uniform(5, 50)\n    nasabah.append((skor, p_dihubungi, p_dibiarkan, outstanding))\n\ndef alokasi(strategi):\n    urutan = sorted(nasabah, key=lambda x: random.random() if strategi=='acak' else -x[0])\n    budget, contacted = 100, 0\n    recovery = 0\n    for skor, p_hub, p_biar, out in urutan:\n        if budget < 0.5: break\n        budget -= 0.5; contacted += 1\n        recovery += out * p_hub\n    for skor, p_hub, p_biar, out in urutan[contacted:]:\n        recovery += out * p_biar\n    return recovery, contacted\n\n# TULIS KODEMU: recovery (juta Rp) tiap strategi\nrec_skor = \nrec_acak = \nselisih = \n\nprint(f"skor={rec_skor:.1f} acak={rec_acak:.1f} selisih={selisih:.1f}")`,
        lockLines: 21,
        solution: `import random\nrandom.seed(21)\n\nnasabah = []\nfor _ in range(1000):\n    skor = int(random.gauss(650, 70))\n    p_dihubungi = min(0.95, max(0.05, (skor - 500) / 400))\n    p_dibiarkan = p_dihubungi * 0.4\n    outstanding = random.uniform(5, 50)\n    nasabah.append((skor, p_dihubungi, p_dibiarkan, outstanding))\n\ndef alokasi(strategi):\n    urutan = sorted(nasabah, key=lambda x: random.random() if strategi=='acak' else -x[0])\n    budget, contacted = 100, 0\n    recovery = 0\n    for skor, p_hub, p_biar, out in urutan:\n        if budget < 0.5: break\n        budget -= 0.5; contacted += 1\n        recovery += out * p_hub\n    for skor, p_hub, p_biar, out in urutan[contacted:]:\n        recovery += out * p_biar\n    return recovery, contacted\n\n# TULIS KODEMU: recovery (juta Rp) tiap strategi\nrec_skor = alokasi('skor')[0]\nrec_acak = alokasi('acak')[0]\nselisih = rec_skor - rec_acak\n\nprint(f"skor={rec_skor:.1f} acak={rec_acak:.1f} selisih={selisih:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rec_skor", value: 5980.2, tol: 5.0, label: "`rec_skor` sekitar 5980.2", msg: "Prioritas skor tertinggi = recovery maksimum." },
          { kind: "equal", task: "t2", name: "rec_acak", value: 5248.9, tol: 5.0, label: "`rec_acak` sekitar 5248.9", msg: "Acak = kontak terbuang ke yang tidak responsif." },
          { kind: "equal", task: "t2", name: "selisih", value: 731.3, tol: 5.0, label: "`selisih` sekitar 731.3", msg: "Rp 731 jt/bulan = harga 'menagih dengan otak'." },
          { kind: "stdout_matches", task: "t3", pattern: "skor=5980\\.2\\s+acak=5248\\.9\\s+selisih=731\\.3", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Dengan budget sama, urutan kontak menentukan ratusan juta recovery.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: dari sinyal ke aksi",
      prose: [
        "Skenario 1 — Satu sinyal lemah muncul (mutasi rekening turun >40% tiga bulan). → Alert kuning: RM menelepon dalam 7 hari. Satu sinyal = pantau, bukan panik.",
        "Skenario 2 — Kombinasi 2–3 sinyal (utilisasi >80% + tren naik + SLIK Kolek 2 di bank lain). → Alert merah: bekukan penarikan + kunjungan. Contoh nyata: nasabah KTA dengan 4 sirene menyala tetapi DPD masih 0 — enam bulan kemudian ia macet. DPD adalah sirene yang paling lambat.",
        "Skenario 3 — Nasabah sudah menunggak. → Pakai collection scorecard: petakan propensity to pay × uplift. Mau bayar + butuh diingatkan → telepon murah; mau bayar + bayar sendiri → jangan ganggu; tidak mampu → remedial/legal, jangan buang pulsa.",
        "Skenario 4 — Skor perilaku <600. → Jangan telepon (cuma 12% bayar) — kunjungan + restrukturisasi atau alihkan ke remedial. Telepon ke segmen ini = buang pulsa.",
        "Skenario 5 — Semua sinyal tersedia di warehouse tetapi tak ada yang memantau. → Bangun EWS minimal dulu: 3 sinyal + playbook (siapa menelepon, kapan, tawaran apa). Bank dengan EWS terbaik bukan yang sinyalnya paling canggih — melainkan yang waktu reaksinya tercepat.",
        "Aturan praktis 10 detik: sinyal → alert → playbook; kecepatan reaksi mengalahkan kecanggihan sinyal; application scorecard menilai saat lahir, behavioral menilai yang hidup.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Hanya memantau DPD — seperti menunggu asap sebelum memeriksa detektor. Empat sirene (mutasi turun, utilisasi melonjak, SLIK memburuk di bank lain, pola bayar merangkak) bisa menyala 6 bulan sebelum DPD bergerak. NPL yang 'tiba-tiba' melonjak 3% → 5,5% sebenarnya sudah diumumkan setengah tahun sebelumnya.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Gelombang yang terlewat",
      prose: [
        "Q1 2026, NPL KTA Bank Nusantara melonjak 3% → 5,5%. Investigasi forensik menemukan: 6 bulan sebelumnya, mutasi rekening 40% debitur KTA turun >30% (gelombang PHK sektor tekstil); utilisasi kartu kredit segmen yang sama naik 35% → 70%; SLIK menunjukkan Kolek 2 di bank lain naik 2× lipat untuk segmen ini. Semua sinyal tersedia di data warehouse — tetapi tidak ada yang memantau; dashboard hanya menampilkan DPD.",
        "Pembahasan — EWS minimal: (1) mutasi turun >40% (3 bulan) → alert kuning → RM menelepon dalam 7 hari; (2) utilisasi >80% + tren naik → alert oranye → tawarkan restrukturisasi dini / turunkan limit; (3) SLIK bank lain → Kolek 2 → alert merah → bekukan penarikan + kunjungan.",
        "Harga keterlambatan: NPL naik 2,5 poin dari portofolio KTA Rp 4 T = Rp 100 M tambahan bermasalah. Dengan intervensi dini (restrukturisasi saat masih DPD 0), studi industri menunjukkan 40–60% bisa diselamatkan = Rp 40–60 M potensi selamat. EWS yang \"mahal\" (tim + sistem Rp 2 M/tahun) vs Rp 50 M kerugian — ROI-nya tidak perlu dihitung dua kali.",
      ],
      tasks: [],
      reference: "Restrukturisasi saat DPD 0 jauh lebih murah dan kooperatif daripada menunggu tunggakan.",
    },
    {
      id: "pendalaman-eksekusi",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Skor hanyalah awal: kalibrasi & eksekusi",
      prose: [
        "Contoh terapan kedua, dari dunia yang berbeda: multifinance pembiayaan motor di Jawa Timur. Portofolio 80.000 kontrak, angsuran Rp 850 ribu/bulan, tenor 35 bulan. Masalah klasiknya bukan \"siapa yang layak diberi\" — application scorecard sudah menyaring di awal — melainkan \"siapa yang mulai goyah di bulan ke-14\". Tiga sinyal behavioral yang terbukti di segmen ini: (1) pola bayar angsuran bergeser dari tanggal 5 ke tanggal 25 (mendekati batas toleransi) — bukan telat, tetapi \"merangkak\"; (2) top-up/pinjaman baru di pinjol muncul di SLIK dalam 6 bulan terakhir; (3) jarak antar pembayaran melebar: 30 → 33 → 38 hari. Masing-masing lemah sendirian; ketiganya bersamaan = probabilitas default 12 bulan ke depan naik dari 4% ke 19% (angka dari vintage 2022–2024 satu multifinance besar). Behavioral scorecard menangkap pola merangkak ini; application scorecard buta total terhadapnya.",
        "Kontras cara salah vs benar yang paling mahal di industri: memakai behavioral score SEBAGAI application score. Cara salah: \"Skor perilakunya 720 — naikkan limit kartu kreditnya dari Rp 20 juta ke Rp 50 juta.\" Masalahnya: behavioral score mengukur kesehatan SAAT INI, bukan kapasitas menanggung beban BARU. Nasabah dengan skor 720 dan utilisasi 30% dari limit 20 juta (Rp 6 juta) yang dinaikkan ke 50 juta lalu memakai Rp 35 juta (utilisasi 70%) telah berubah perilakunya — skor lamanya tidak berlaku untuk beban barunya. Cara benar: setiap perubahan limit = re-underwriting mini — hitung ulang debt burden ratio (total cicilan/penghasilan) dengan limit baru; tolak kenaikan jika DBR > 40% atau jika tren mutasi 3 bulan negatif. Aturan: skor perilaku adalah foto kesehatan, bukan surat izin menambah beban.",
        "Mode kegagalan nyata yang menghancurkan banyak EWS: regime change. Model behavioral yang dilatih pada data 2021–2023 (ekonomi pulih, PHK rendah) tiba-tiba menghadapi 2024: PHK massal sektor tekstil dan startup. Sinyal \"mutasi turun >40%\" yang dulu berarti \"nasabah bermasalah individual\" kini berarti \"sektornya kolaps\" — separuh portofolio menyala merah bersamaan, tim collection kewalahan, alert menjadi noise. Modelnya tidak salah membaca individu; ia salah membaca zaman. Dua pertahanan: (1) kalibrasi ulang tiap 6 bulan — bukan tiap 2 tahun — dengan data vintage terbaru; (2) pisahkan sinyal idiosinkratik vs sistemik: jika >15% portofolio menyala dalam 1 bulan, itu bukan masalah nasabah — itu masalah makro, dan responsnya adalah kebijakan portofolio (ketatkan origination, tambah CKPN), bukan menelepon 12.000 nasabah satu per satu.",
        "Pendalaman sub-topik yang selama ini hanya disebut sekilas: champion-challenger. Bank tidak mengganti model behavioral sekaligus — ia menjalankan dua model paralel: champion (model produksi saat ini) dan challenger (model baru yang diuji). Keduanya memberi skor ke nasabah yang sama selama 3–6 bulan; yang dibandingkan bukan akurasi statistiknya, melainkan keputusan bisnisnya: berapa banyak alert yang dihasilkan, berapa yang true positive (benar-benar default 12 bulan kemudian), dan berapa biaya intervensinya. Contoh: challenger menangkap 30% lebih banyak calon default tetapi menghasilkan 2× alert — tim collection hanya sanggup menangani 500 intervensi/bulan. Challenger yang \"lebih akurat\" tetapi membanjiri kapasitas = kalah secara bisnis. Keputusan promosi challenger → champion diambil komite dengan tiga angka: lift, alert volume, dan kapasitas eksekusi. Model terbaik adalah yang bisa dieksekusi, bukan yang paling pintar di atas kertas.",
        "Aturan keputusan operasional untuk tim risiko ritel. Satu: skor behavioral turun >80 poin dalam 3 bulan = intervensi wajib (telepon + review limit), apapun DPD-nya. Dua: dua sinyal merah bersamaan (misal utilisasi >80% + mutasi turun >40%) = bekukan kenaikan limit otomatis sampai review manual. Tiga: alert EWS yang tidak ditindaklanjuti dalam 14 hari = eskalasi ke atasan RM — alert tanpa SLA tindak lanjut adalah hiasan. Empat: setiap kenaikan limit >50% = re-underwriting mini (hitung ulang DBR), tidak boleh mengandalkan skor perilaku lama. Lima: kalibrasi ulang model tiap 6 bulan; jika >15% portofolio menyala serentak, nyalakan mode makro (kebijakan portofolio, bukan intervensi individual). Lima aturan ini mengubah behavioral scorecard dari \"angka di dashboard\" menjadi \"sistem saraf yang bekerja\".",
        "Contoh angka konkret untuk collection uplift — konsep yang sering disebut tetapi jarang dihitung. Seribu nasabah DPD 30, dua strategi: telepon semua (biaya Rp 75 ribu/kontak = Rp 75 juta) vs telepon hanya yang diprediksi responsif. Data historis: dari 1000 nasabah, 400 akan bayar sendiri tanpa dihubungi (waste jika ditelepon), 300 tidak akan bayar apapun yang dilakukan (waste juga), 300 hanya bayar JIKA dihubungi (persuadable). Model uplift mengidentifikasi 350 kandidat persuadable dengan presisi 70% → 245 benar-benar persuadable. Hitung: telepon 350 × Rp 75 ribu = Rp 26,25 juta untuk recovery 245 × Rp 8 juta (rata-rata tunggakan) = Rp 1,96 miliar. Bandingkan telepon semua: Rp 75 juta untuk recovery (300 persuadable × Rp 8 juta) = Rp 2,4 miliar — recovery lebih besar tetapi biaya 3× dan mengganggu 400 nasabah yang sebenarnya tidak perlu diganggu (risiko komplain & reputasi). Keputusan bisnis: jika kapasitas tim 350 kontak/bulan, uplift model menghasilkan net tertinggi. Inilah bedanya collection scorecard (siapa berisiko?) vs uplift (siapa yang berubah karena tindakanku?) — pertanyaan kedua yang menentukan alokasi.",
        "Satu kalibrasi perilaku yang khas Indonesia: efek THR dan Lebaran. Setiap Mei–Juni, mutasi rekening melonjak (THR masuk) lalu anjlok Juli (belanja Lebaran) — pola musiman yang normal. Model behavioral naif membaca \"mutasi turun 45% di Juli\" sebagai sirene dan membanjiri tim dengan false alert. Solusinya: normalisasi musiman — bandingkan mutasi Juli tahun ini vs Juli tahun lalu per nasabah (year-on-year), bukan vs Juni (month-on-month). Aturan yang sama untuk Desember (bonus akhir tahun) dan awal tahun ajaran (Juli–Agustus, belanja sekolah). Model yang tidak mengenal kalender Indonesia akan meneriaki setiap Lebaran sebagai krisis — dan tim yang sudah tiga kali kena false alarm Lebaran akan mengabaikan alert keempat yang ternyata krisis sungguhan. Kenali kalendermu sebelum menuduh nasabahmu. Behavioral scorecard yang baik adalah antropolog yang memahami konteks lokal, bukan sekadar statistikawan buta musim.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: perilaku membayar = data, janji membayar = noise",
        body: "Nasabah yang menunggak selalu punya cerita: \"usaha sedang sepi\", \"pelanggan belum bayar\", \"bulan depan pasti lunas\". Analis junior mendengarkan cerita; analis senior membaca mutasi. Heuristiknya: abaikan SEMUA penjelasan verbal sampai kamu melihat tiga angka — tren mutasi 3 bulan, perubahan utilisasi, dan riwayat janji-bayar vs realisasi (promise-to-pay hit rate). Nasabah yang janjinya ditepati 9 dari 10 kali = cerita boleh didengar; yang janjinya ditepati 2 dari 10 = ceritanya adalah noise. Prinsip yang lebih dalam: perilaku membayar adalah data revealed preference — apa yang benar-benar ia lakukan dengan uangnya saat tidak ada yang mengawasi. Janji membayar adalah stated preference — apa yang ia katakan saat diawasi. Dalam ekonomi perilaku, revealed preference selalu menang. Maka aturan operasionalnya: setiap janji bayar dicatat dan dihitung hit rate-nya per nasabah; nasabah dengan hit rate <50% tidak lagi diberi opsi \"janji bayar\" — langsung ke restrukturisasi formal atau kunjungan. Kamu tidak menilai kejujurannya; kamu menilai statistiknya.",
      },
      reference: "Behavioral scorecard yang baik adalah antropolog: kenal regime, kenal kalender, kenal kapasitas tim.",
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
        "Behavioral = raport semester berjalan: menilai nasabah hidup dari perilaku terkini.",
        "Variabel terbaik = turunan pertama (perubahan), bukan level.",
        "EWS = sinyal → alert → playbook + aksi. Tanpa aksi = hiasan.",
        "Collection = triase: maksimalkan peluang × outstanding − biaya.",
        "Tiga pertanyaan: application (layak diberi?) · behavioral (masih sehat?) · collection (bagaimana menagih?).",
      ],
      next: { label: "CR10 — PD Modeling", href: "/v2/learn/cr10-pd-modeling" },
      quiz: [
        {
          q: "Apa keunggulan utama behavioral scorecard dibanding application scorecard?",
          options: [
            { text: "Lebih murah dibuat", why: "Butuh infrastruktur data perilaku — tidak lebih murah." },
            { text: "Menilai nasabah yang HIDUP dari perilaku terkini (tren utilisasi, mutasi) — menangkap perubahan SEBELUM tunggakan", why: "Application = foto saat lahir; behavioral = CCTV semasa hidup.", correct: true },
            { text: "Tidak butuh data", why: "Justru butuh data perilaku time series." },
            { text: "Selalu lebih akurat", why: "Tidak selalu — tergantung kualitas data perilaku." },
          ],
        },
        {
          q: "Nasabah DPD 0, tapi utilisasi melonjak 30%→85% dan mutasi turun 45%. Tindakan terbaik?",
          options: [
            { text: "Abaikan — DPD 0 berarti aman", why: "DPD = 0 sampai detik terakhir — perilaku sudah berteriak." },
            { text: "Intervensi proaktif: hubungi, pahami sebab, tawarkan restrukturisasi dini — perilaku memburuk sebelum DPD", why: "Pola 'kepepet' klasik. Restrukturisasi saat DPD 0 jauh lebih murah dan kooperatif.", correct: true },
            { text: "Langsung bekukan rekening", why: "Terlalu agresif tanpa dialog — bekukan hanya untuk alert merah." },
            { text: "Naikkan limitnya", why: "Menaikkan limit nasabah kepepet = memperbesar EAD." },
          ],
        },
        {
          q: "Mengapa 'perubahan utilisasi' lebih baik dari 'level utilisasi' sebagai variabel?",
          options: [
            { text: "Level tidak bisa dihitung", why: "Level mudah dihitung." },
            { text: "Perubahan (turunan pertama) menangkap dinamika: 80% stabil ≠ 80% yang melonjak dari 30% — yang kedua adalah sirene", why: "Level = foto, perubahan = film. Model butuh trayektorinya.", correct: true },
            { text: "Regulator melarang level", why: "Tidak ada larangan seperti itu." },
            { text: "Tidak ada bedanya", why: "Bedanya besar: A stabil 2 tahun vs B melonjak 3 bulan." },
          ],
        },
        {
          q: "Budget collection terbatas. Nasabah A: tunggakan Rp 100 jt, peluang bayar 10%. Nasabah B: tunggakan Rp 40 jt, peluang bayar 90%. Prioritaskan?",
          options: [
            { text: "A — tunggakannya lebih besar", why: "'Kejar yang besar' adalah insting yang salah." },
            { text: "B — ekspektasi recovery 36 jt vs 10 jt; collection memaksimalkan peluang × outstanding − biaya", why: "0,9×40=36 > 0,1×100=10. Triase memakai ekspektasi, bukan nominal.", correct: true },
            { text: "Bagi rata", why: "Bagi rata mengabaikan perbedaan ekspektasi." },
            { text: "Acak saja", why: "Acak = membuang budget." },
          ],
        },
        {
          q: "EWS bank berbunyi tiap hari tapi tidak ada yang menindaklanjuti. Masalahnya?",
          options: [
            { text: "Sinyalnya kurang canggih", why: "Bukan soal kecanggihan sinyal." },
            { text: "EWS tanpa playbook & akuntabilitas = hiasan; yang menentukan adalah waktu reaksi sinyal→aksi, bukan kecanggihan model", why: "EWS = sistem saraf, bukan sekadar sensor. Tanpa otot, sensor secanggih apapun tidak menyelamatkan.", correct: true },
            { text: "Butuh lebih banyak sinyal", why: "Menambah sinyal tanpa aksi = menambah hiasan." },
            { text: "Matikan saja EWS-nya", why: "Mematikan radar bukan solusi — bangun playbook-nya." },
          ],
        },
      ],
    },
  ],
};
