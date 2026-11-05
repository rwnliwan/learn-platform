import type { V2Lesson } from "../lib/types";

export const mr17: V2Lesson = {
  slug: "mr17-limit-laporan",
  track: "Market Risk",
  module: "Tata Kelola & Validasi",
  title: "MR17 — Limit, Risk Appetite & Laporan Risiko Harian",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-limit",
      eyebrow: "Langkah 1 · Limit yang tak tersentuh",
      title: "Cerita: limit yang tidak pernah tersentuh",
      prose: [
        "Sebuah bank punya limit VaR Rp100 miliar untuk desk kredit. Selama 3 tahun, utilisasi tidak pernah melewati 60%. Komite risiko bangga: disiplin kami bagus. Lalu 2008: dalam 2 minggu, kerugian desk mencapai Rp400 miliar — 4× limit — tanpa satu pun pelanggaran limit tercatat sebelumnya. Bagaimana mungkin?",
        "Investigasi menemukan dua hal: limit VaR dihitung dari data masa tenang (ingat pelajaran volatilitas: VaR dari data tenang buta menjelang krisis!) — VaR-nya sendiri yang salah, bukan disiplinnya. Dan yang lebih buruk: tidak ada limit sensitivitas (DV01, CS01) — desk menumpuk eksposur ke satu faktor (spread perumahan AS) yang tidak terlihat di angka VaR agregat.",
        "Twist-nya: limit yang tidak pernah tersentuh sama berbahayanya dengan tidak ada limit — ia memberi ilusi kontrol. Limit yang sehat sesekali tersentuh (itu tandanya ia mengikat!), punya lapisan ganda (VaR + sensitivitas + konsentrasi), dan yang terpenting: ditegakkan saat tersentuh. Lesson ini tentang merancang sistem limit yang hidup — dari selera dewan hingga laporan harian.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan dua penyebab kegagalan dalam cerita." },
        { id: "t2", text: "Kenapa limit yang tak pernah tersentuh berbahaya?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Limit = pagar. Pagar yang tak pernah disentuh mungkin terlalu jauh (tidak melindungi apa-apa) atau lahannya yang salah ukur (model salah). Kalibrasi sehat: limit sesekali tersentuh (amber), jarang dilanggar (red), dan selalu ditindaklanjuti saat tersentuh.",
        type: "risk",
      },
      reference: "Limit sehat: mengikat (sesekali tersentuh), berlapis, ditegakkan saat breach.",
    },
    {
      id: "appetite",
      eyebrow: "Langkah 2 · Risk appetite",
      title: "Selera risiko dewan — dan paradoks alokasi",
      prose: [
        "Risk appetite = jumlah & jenis risiko yang dewan direksi bersedia ambil untuk mencapai tujuan strategis, dinyatakan dalam Risk Appetite Statement (RAS) — dokumen yang mengikat, bukan slogan. Hirarki (cascade): Board — Total VaR ≤ Rp500 M; kerugian stres ≤ Rp2 T; tidak ada kerugian > Rp1 T dalam setahun. Divisi — alokasi ke Markets, Treasury, dst. Desk — limit operasional per desk/trader.",
        "Paradoks alokasi: jumlah limit desk (150+100+130+90+60 = 530) boleh melebihi appetite board (500) — karena diversifikasi antar desk membuat VaR agregat < jumlahnya. Tetapi ini pedang bermata dua: saat krisis, korelasi → 1, diversifikasi menguap, dan agregat menembus appetite.",
        "Buktikan: dengan korelasi antar desk 0,8, VaR agregat = 486,76 — aman di bawah 500. Naikkan korelasi ke 0,95 (krisis): agregat = 519,53 — appetite jebol, tanpa satu pun desk melanggar limitnya! Inilah mengapa butuh buffer dan limit agregat yang dipantau terpisah — bukan cuma limit per desk. Appetite yang baik menyebut angka + kondisi: VaR ≤ 500 dalam kondisi normal; kerugian stres ≤ 2T dalam skenario X. Appetite tanpa skenario = angka tanpa makna.",
        "Merancang Risk Appetite Statement yang hidup. RAS yang baik punya 4 elemen: (1) angka — VaR ≤ 500, kerugian stres ≤ 2T, kerugian maksimum 1T/tahun; (2) kondisi — 'VaR ≤ 500 DALAM kondisi normal; dalam skenario X, toleransi Y' — appetite tanpa skenario = angka tanpa makna; (3) cakupan — jenis risiko yang diterima DAN yang ditolak eksplisit (misal: tidak ada eksposur ke instrumen yang tidak dipahami desk); (4) proses pelampauan — siapa boleh menyetujui breach sementara, berapa lama, dengan mitigasi apa. Tanpa (4), appetite akan dilanggar diam-diam saat pertama kali tidak nyaman — dan pelanggaran diam-diam lebih berbahaya dari pelanggaran yang dilaporkan.",
        "Tata kelola limit — siapa melakukan apa. Pemilik limit (CRO/komite risiko): menetapkan & menyetujui perubahan. Pemantau (risk management independen): mengukur utilisasi harian, menerbitkan breach report. Penindak (desk head): menurunkan eksposur saat breach. Yang sering gagal: limit tanpa pemilik yang jelas (tidak ada yang merasa bertanggung jawab), atau pemantau yang tidak independen (desk mengukur dirinya sendiri — itulah Kerviel & Leeson). Aturan: setiap limit wajib punya nama pemilik, frekuensi pantau, dan konsekuensi tertulis — limit tanpa ketiganya = dekorasi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `agg_08` dan `agg_095` (VaR agregat, ρ=0,8 dan 0,95)" },
        { id: "t2", text: "Bandingkan dengan appetite 500; simpulkan pelajaran diversifikasinya" },
      ],
      expected: "agg_08=486.76  agg_095=519.53",
      note: {
        title: "Sering salah",
        body: "Mengira over-alokasi limit = kesalahan yang harus disamakan. Over-alokasi disengaja dan normal — DENGAN syarat ada buffer + limit agregat terpisah. Kesalahan sebenarnya: mengandalkan diversifikasi tanpa menguji apa yang terjadi saat ia menguap (stress test wajib, bukan opsional).",
        type: "pitfall",
      },
      hints: [
        "agg = sqrt(ρ*S² + (1-ρ)*ΣL²), S = total limit, ΣL² = jumlah kuadrat.",
        "Perlu import math.",
        "Bandingkan tiap hasil dengan 500 untuk verdict breach.",
      ],
      code: {
        starter: `import math\n\nlimits = [150, 100, 130, 90, 60]  # Rp miliar per desk\nappetite = 500\nS = sum(limits)\nS2 = sum(x * x for x in limits)\n\n# TULIS KODEMU: VaR agregat utk rho 0,8 dan 0,95\ndef agg_var(rho):\n    return \nagg_08 = agg_var(0.8)\nagg_095 = agg_var(0.95)\n\nprint(f"agg_08={agg_08:.2f}  agg_095={agg_095:.2f}")`,
        lockLines: 6,
        solution: `import math\n\nlimits = [150, 100, 130, 90, 60]  # Rp miliar per desk\nappetite = 500\nS = sum(limits)\nS2 = sum(x * x for x in limits)\n\n# TULIS KODEMU: VaR agregat utk rho 0,8 dan 0,95\ndef agg_var(rho):\n    return math.sqrt(rho * S * S + (1 - rho) * S2)\nagg_08 = agg_var(0.8)\nagg_095 = agg_var(0.95)\n\nprint(f"agg_08={agg_08:.2f}  agg_095={agg_095:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "agg_08", value: 486.76, tol: 0.01, label: "`agg_08` seharusnya 486.76", msg: "√(0,8×530² + 0,2×ΣL²). Cek rumusnya." },
          { kind: "equal", task: "t1", name: "agg_095", value: 519.53, tol: 0.01, label: "`agg_095` seharusnya 519.53", msg: "Korelasi naik → diversifikasi menguap → appetite jebol." },
          { kind: "stdout_matches", task: "t2", pattern: "agg_08=486\\.76\\s+agg_095=519\\.53", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "530 > 500 disengaja (diversifikasi) — tapi butuh buffer; krisis (ρ→1) menembus appetite.",
    },
    {
      id: "jenis-limit",
      eyebrow: "Langkah 3 · Jenis limit",
      title: "Enam lapis jaring pengaman",
      prose: [
        "Limit yang sehat berlapis — tiap jenis menangkap risiko yang lolos dari jenis lain. VaR/ES limit: batas kerugian agregat (probabilistik); kelemahan: buta ekor (VaR), buta konsentrasi faktor. Sensitivitas limit: DV01, CS01, delta, vega per faktor — menangkap konsentrasi ke satu faktor yang disembunyikan agregat VaR (pelajaran cerita pembuka!).",
        "Notional limit: batas nilai nominal posisi — kasar tetapi tidak bisa dimanipulasi model. Stop-loss limit: batas kerugian aktual kumulatif (misal bulanan) — menangkap model salah: jika rugi aktual menembus, hentikan dulu, selidiki kemudian. Konsentrasi limit: batas eksposur ke satu obligor/sektor/negara — menangkap telur dalam satu keranjang. Liquidity limit: batas % ADV, tenor maksimal — menangkap risiko terjebak (aset tak bisa dijual tanpa rugi besar saat dibutuhkan).",
        "Aturan: tidak ada satu limit yang cukup. VaR tanpa sensitivitas = buta konsentrasi. Sensitivitas tanpa stop-loss = buta model-salah. Minimal tiga lapis untuk setiap desk material.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan enam jenis limit dan apa yang ditangkap tiap jenis." },
        { id: "t2", text: "Desk apa yang paling butuh stop-loss limit? Kenapa?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira semakin banyak limit semakin aman. Limit yang terlalu banyak/ketat = diabaikan atau diakali (trader mengoptimasi di sekitar limit — limit gaming). Kualitas > kuantitas: sedikit limit yang dipahami, dipantau, dan ditegakkan mengalahkan 50 limit yang hanya ada di dokumen. Setiap limit harus punya pemilik, pemantau, dan konsekuensi.",
        type: "pitfall",
      },
      reference: "6 jenis: VaR/ES, sensitivitas, notional, stop-loss, konsentrasi, liquidity. Minimal 3 lapis.",
    },
    {
      id: "eskalasi",
      eyebrow: "Langkah 4 · Eskalasi",
      title: "Limit tanpa gigi = saran",
      prose: [
        "Eskalasi = apa yang terjadi otomatis saat limit tersentuh. Tanpa ini, limit = saran. Struktur tipikal: 80% (amber) — peringatan otomatis → risk manager menghubungi desk → rencana pengurangan sukarela. 100% (red/breach) — trading dihentikan untuk menambah risiko → desk wajib menurunkan eksposur dalam X hari → lapor ke komite. Breach berulang — review limit + strategi + insentif (apakah limit terlalu ketat? atau desk terlalu agresif?).",
        "Simulasi 10 hari utilisasi limit VaR 100 (%): [55, 62, 70, 78, 85, 92, 105, 110, 98, 88]. Hitung: breach (>100%) terjadi 2 kali (hari ke-7 dan ke-8 — trading tambah-risiko harus berhenti hari ini, bukan besok dikurangi). Amber (>80%) terjadi 6 hari — risk manager menelepon jauh sebelum merah. Pola sehat: utilisasi 60–90% (limit mengikat tetapi tidak mencekik).",
        "Utilisasi < 30% terus-menerus = limit terlalu longgar (atau bisnis menyusut — selidiki!). Utilisasi yang tidak pernah menyentuh amber = dekorasi, bukan pengaman.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `breach` (>100%) dan `amber` (>80%) dari `util`" },
        { id: "t2", text: "Cetak keduanya dan tulis tindakan untuk hari breach" },
      ],
      expected: "breach=2  amber=6",
      note: {
        title: "Sering salah",
        body: "Menaikkan limit agar tidak breach. Itu kecurangan paling klasik: limit mengikuti risiko, bukan sebaliknya. Breach = rem darurat, bukan saran — tindakannya otomatis, bukan diskusi.",
        type: "pitfall",
      },
      hints: [
        "breach = jumlah u > 100; amber = jumlah u > 80.",
        "Gunakan sum(1 for u in util if ...).",
        "Tindakan breach: hentikan penambahan risiko HARI INI + turunkan eksposur + lapor komite.",
      ],
      code: {
        starter: `# Utilisasi limit VaR 100 (%), 10 hari\nutil = [55, 62, 70, 78, 85, 92, 105, 110, 98, 88]\n\n# TULIS KODEMU: hitung breach (>100) dan amber (>80)\nbreach = \namber = \n\nprint(f"breach={breach}  amber={amber}")`,
        lockLines: 2,
        solution: `# Utilisasi limit VaR 100 (%), 10 hari\nutil = [55, 62, 70, 78, 85, 92, 105, 110, 98, 88]\n\n# TULIS KODEMU: hitung breach (>100) dan amber (>80)\nbreach = sum(1 for u in util if u > 100)\namber = sum(1 for u in util if u > 80)\n\nprint(f"breach={breach}  amber={amber}")`,
        checks: [
          { kind: "equal", task: "t1", name: "breach", value: 2, label: "`breach` seharusnya 2", msg: "Hari ke-7 (105) dan ke-8 (110)." },
          { kind: "equal", task: "t1", name: "amber", value: 6, label: "`amber` seharusnya 6", msg: "85, 92, 105, 110, 98, 88." },
          { kind: "stdout_matches", task: "t2", pattern: "breach=2\\s+amber=6", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Amber 80%: peringatan + rencana sukarela. Red 100%: stop tambah risiko + lapor komite.",
    },
    {
      id: "laporan-ipv",
      eyebrow: "Langkah 5 · Laporan & IPV",
      title: "Laporan yang dibaca dan harga yang diverifikasi",
      prose: [
        "Laporan risiko harian = paket informasi yang diterima pengambil keputusan setiap pagi sebelum pasar buka. Tujuannya satu: memungkinkan keputusan hari ini. Anatomi laporan yang dibaca (bukan yang diarsip): ringkasan eksekutif 1 halaman (VaR/ES vs limit, P&L kemarin vs ekspektasi, breach & amber, satu paragraf apa yang berubah & apa aksinya); P&L explain (dekomposisi per faktor + unexplained — unexplained besar = headline, bukan footnote); utilisasi limit per desk dengan tren; sensitivitas kunci (DV01, CS01, delta, vega — top exposures); stress & skenario vs appetite; konsentrasi top-10; kualitas data (IPV exception, data stale — jujur tentang apa yang tidak diketahui).",
        "Aturan emas: jika laporan butuh > 15 menit untuk dipahami intinya, ia gagal. Halaman 1 harus menjawab: apakah kita aman? jika tidak, apa yang harus dilakukan hari ini? Laporan 200 halaman yang tidak dibaca = nol nilai. Kelengkapan tanpa hirarki = kuburan informasi. Prinsip: 1 halaman untuk keputusan, lampiran untuk investigasi. Setiap tabel harus punya jadi apa — jika tidak ada aksi yang bisa diambil, buang dari laporan harian.",
        "IPV (Independent Price Verification) = fungsi independen (bukan trader, bukan front office) yang memverifikasi harga (mark) untuk valuasi dengan sumber independen. Kenapa fungsi risiko: trader punya insentif mark yang menguntungkan (bonus berbasis P&L!). Kasus klasik: mark obligasi illiquid yang optimis 2% — untuk portofolio Rp5 T = Rp100 M P&L fiktif. Selisih > threshold → adjustment + investigasi. VaR/ES/limit semuanya dibangun di atas harga — harga salah → semua angka salah. IPV menjawab pertanyaan yang tidak pernah ditanyakan laporan lain: apakah angka-angka ini benar?",
      ],
      tasks: [
        { id: "t1", text: "Susun anatomi laporan harian dalam 7 komponen." },
        { id: "t2", text: "Hitung potensi P&L fiktif: mark 2% optimis × Rp5 T. Kenapa ini fondasi?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Dalam hierarki kebutuhan analis risiko: data benar > model canggih. Selalu. IPV adalah fondasi yang memastikan bangunan di atasnya (VaR, ES, Greeks, limit) tidak berdiri di atas pasir. Tren variance per desk = indikator integritas yang dilaporkan ke komite.",
        type: "risk",
      },
      reference: "Laporan: 1 halaman keputusan + lampiran. IPV: 2% × Rp5T = Rp100M fiktif — fondasi semua metrik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Dari appetite hingga tindakan",
      prose: [
        "Empat keputusan. Pertama, menetapkan risk appetite → angka + skenario + proses persetujuan pelampauan. Kondisi: RAS tahunan dewan. Alasan: appetite tanpa skenario = angka tanpa makna; tanpa proses pelampauan = akan dilanggar diam-diam. Kedua, mendesain limit → minimal tiga lapis (VaR/ES + sensitivitas + stop-loss/konsentrasi) per desk material; tiap limit punya pemilik, pemantau, dan konsekuensi.",
        "Ketiga, eskalasi breach → otomatis, bukan diskusi: amber 80% (peringatan + rencana sukarela), red 100% (stop tambah risiko hari ini + turunkan eksposur + lapor komite), breach berulang (review limit, strategi, insentif). Keempat, laporan harian → 1 halaman keputusan sebelum pasar buka; sinyal kritis (breach, unexplained besar, IPV exception) di halaman 1, bukan terkubur di halaman 180.",
        "Aturan 10 detik: angka (appetite) → pagar (limit berlapis) → gigi (eskalasi otomatis) → mata (laporan yang dibaca). Rantai yang putus di satu titik = seluruh sistem dekorasi. Dan ingat Kerviel & Leeson: limit yang hanya ada di kertas tidak pernah menghentikan siapa pun.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan rantai appetite → limit → eskalasi → laporan." },
        { id: "t2", text: "Di titik mana rantai paling sering putus? Kenapa?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira pekerjaan selesai setelah limit ditetapkan. Penetapan = 20% pekerjaan; 80%-nya adalah pemantauan, eskalasi, dan penegakan yang konsisten. Sistem limit hidup dari tindakannya, bukan dari dokumennya.",
        type: "pitfall",
      },
      reference: "Rantai: angka → pagar → gigi → mata. Putus satu = dekorasi.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Rantai yang hidup: angka → pagar → gigi → mata",
      prose: [
        "Satu kalimat yang merangkum seluruh lesson: sistem limit yang hidup = angka (appetite) → pagar (limit berlapis) → gigi (eskalasi otomatis) → mata (laporan yang dibaca) — dan rantai yang putus di satu titik menjadikan seluruh sistem dekorasi. Kebanyakan kegagalan bukan di angkanya, melainkan di giginya: limit ada, tetapi tidak ada yang terjadi saat dilanggar.",
        "Tiga pertanyaan yang diajukan direktur risiko senior saat menilai kerangka limit bank: (1) kapan terakhir limit tersentuh — dan apa yang terjadi? (jika jawabannya 'tidak pernah', waspadalah); (2) siapa pemilik tiap limit, siapa pemantau independennya, apa konsekuensinya? (3) apakah laporan harian bisa dipahami intinya dalam 15 menit — dan apakah sinyal kritis ada di halaman 1?",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan rantai angka → pagar → gigi → mata dengan contoh breach 108%." },
        { id: "t2", text: "Terapkan tiga pertanyaan ke bank dengan limit yang tak pernah tersentuh 3 tahun." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk limit & tata kelola. Pertama, kalibrasi sehat limit: utilisasi 60–90% = mengikat tetapi tidak mencekik; sesekali amber (80%) = normal dan sehat; breach (100%) jarang tetapi selalu ditindaklanjuti. Utilisasi < 30% terus-menerus = limit terlalu longgar atau bisnis menyusut — selidiki, jangan banggakan. Limit yang tak pernah tersentuh = pagar yang mungkin terlalu jauh atau lahannya salah ukur (model salah). Kedua, eskalasi harus otomatis, bukan diskusi: amber = peringatan + rencana sukarela; red = stop tambah risiko HARI INI + turunkan eksposur dalam tenggat + lapor komite; breach berulang = review limit, strategi, DAN insentif (apakah bonus mendorong pelanggaran?). Menaikkan limit agar tidak breach adalah kecurangan paling klasik — limit mengikuti risiko, bukan sebaliknya. Ketiga, over-alokasi limit (530 > 500) disengaja dan normal — DENGAN syarat ada buffer + limit agregat terpisah, karena diversifikasi menguap saat krisis (korelasi → 1). Tanpa buffer, krisis menembus appetite tanpa satu pun desk breach. Keempat, RAS butuh 4 elemen: angka + kondisi/skenario + cakupan (termasuk yang ditolak eksplisit) + proses pelampauan — tanpa proses pelampauan, appetite dilanggar diam-diam. Kelima, setiap limit wajib punya pemilik, pemantau independen, dan konsekuensi tertulis — Kerviel & Leeson adalah pelajaran tentang limit tanpa gigi dan pemantau yang tidak independen. Dan terakhir: laporan harian dinilai dari satu hal — apakah pengambil keputusan bisa menjawab 'apakah kita aman, dan apa yang harus dilakukan hari ini?' dalam 15 menit. Jika tidak, laporan 200 halaman = nol nilai. Kelengkapan tanpa hirarki = kuburan informasi.",
      },
      reference: "Angka → pagar → gigi → mata. Eskalasi otomatis. Setiap limit: pemilik + pemantau independen + konsekuensi.",
    },
    {
      id: "minicase-dua-breach",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dua breach, dua nasib",
      prose: [
        "Desk obligasi Bank Samudra, limit VaR Rp100 miliar. Senin: utilisasi 92% (amber) — risk manager menelepon desk head; disepakati rencana pengurangan sukarela: kurangi posisi SBN 10Y Rp50 miliar dalam 3 hari. Rabu: pasar bergejolak, utilisasi 108% (breach) — trading tambah-risiko dihentikan HARI ITU JUGA; desk wajib turunkan eksposur di bawah 100% dalam 2 hari; laporan ke komite risiko. Jumat: utilisasi 87% — breach ditutup dan direview di komite: apakah limit terlalu ketat atau pasar memang bergejolak? Keputusan: limit tetap, tetapi tambah limit sensitivitas DV01 karena breach berasal dari konsentrasi tenor.",
        "Bandingkan Bank Lawan: utilisasi 105% — desk meminta 'naikkan limitnya sedikit, pasar lagi aneh'. Disetujui via chat, tanpa komite. Sebulan kemudian utilisasi 130% — saat pasar jatuh, kerugian Rp30 miliar, 3× lipat dari appetite desk. Investigasi: tidak ada yang salah dengan modelnya — yang salah adalah giginya: limit dinaikkan agar tidak breach, eskalasi tidak pernah terjadi.",
        "Tiga pelajaran: eskalasi harus otomatis, bukan diskusi — amber = peringatan + rencana sukarela; red = stop tambah risiko hari ini + lapor komite. Menaikkan limit agar tidak breach = kecurangan klasik: limit mengikuti risiko, bukan sebaliknya. Dan breach yang ditindaklanjuti dengan review = sistem yang belajar (Samudra malah dapat limit DV01 baru); breach yang disembunyikan = bom waktu (Lawan rugi Rp30 miliar).",
      ],
      tasks: [
        { id: "t1", text: "Bandingkan respons Bank Samudra vs Bank Lawan terhadap breach. Apa pembedanya?" },
        { id: "t2", text: "Kenapa keputusan komite Samudra menambah limit DV01 (bukan menaikkan limit VaR)?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira breach yang sudah ditutup = masalah selesai. Breach adalah gejala — review pasca-breach wajib menjawab: apakah limitnya yang salah, strateginya yang salah, atau pasarnya yang berubah? Samudra menemukan konsentrasi tenor (butuh limit DV01); Lawan tidak menemukan apa-apa karena tidak pernah mereview.",
        type: "pitfall",
      },
      reference: "Breach → eskalasi otomatis → review akar masalah. Samudra: +limit DV01. Lawan: −Rp30 M.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR18.",
      ],
      tasks: [],
      summary: [
        "Limit sehat: sesekali tersentuh (mengikat), berlapis (VaR + sensitivitas + konsentrasi), ditegakkan.",
        "Appetite: angka + skenario + proses pelampauan. 530 > 500 disengaja (diversifikasi) — butuh buffer.",
        "6 jenis limit: VaR/ES, sensitivitas, notional, stop-loss, konsentrasi, liquidity.",
        "Eskalasi: amber 80% (peringatan), red 100% (stop + lapor), breach berulang (review).",
        "Laporan: 1 halaman keputusan; >15 menit untuk paham inti = gagal.",
        "IPV: 2% × Rp5T = Rp100M fiktif — data benar > model canggih.",
      ],
      next: { label: "MR18 — Validasi Model", href: "/learn/mr18-validasi-model" },
      quiz: [
        {
          q: "Total limit desk (530) > appetite board (500). Ini?",
          options: [
            { text: "Kesalahan — harus sama", why: "over-alokasi disengaja dan normal." },
            { text: "Disengaja: mengandalkan diversifikasi antar desk — TAPI butuh buffer karena diversifikasi menguap saat krisis", why: "dengan syarat ada buffer + limit agregat terpisah. Tanpa itu, krisis menembus appetite tanpa satu pun desk breach.", correct: true },
            { text: "Tidak masalah sama sekali", why: "ada syaratnya — buffer dan pengujian stres." },
            { text: "Harus dikurangi segera", why: "bukan kesalahan, melainkan praktik dengan syarat." },
          ],
        },
        {
          q: "Desk tidak pernah menyentuh limitnya selama 3 tahun. Kesimpulan?",
          options: [
            { text: "Disiplin yang bagus", why: "bisa jadi ilusi kontrol (ingat cerita pembuka)." },
            { text: "Waspada: limit yang tak pernah tersentuh mungkin tidak mengikat (terlalu longgar) atau modelnya salah", why: "limit sehat sesekali tersentuh. Pagar yang tak disentuh mungkin terlalu jauh atau lahannya salah ukur.", correct: true },
            { text: "Naikkan limitnya", why: "justru selidiki kenapa tidak tersentuh." },
            { text: "Tidak perlu dipantau", why: "tetap harus dipantau." },
          ],
        },
        {
          q: "Utilisasi limit 110% (breach). Tindakan TEPAT?",
          options: [
            { text: "Tunggu besok, mungkin turun sendiri", why: "breach = rem darurat, bukan saran." },
            { text: "Hentikan penambahan risiko HARI INI + wajib turunkan eksposur dalam tenggat + lapor komite", why: "eskalasi otomatis, bukan diskusi. Menaikkan limit agar tidak breach adalah kecurangan klasik.", correct: true },
            { text: "Naikkan limitnya agar tidak breach", why: "limit mengikuti risiko, bukan sebaliknya." },
            { text: "Sembunyikan dari laporan", why: "jelas melanggar tata kelola." },
          ],
        },
        {
          q: "Mengapa perlu limit sensitivitas (DV01/CS01) SELAIN limit VaR?",
          options: [
            { text: "Agar terlihat canggih", why: "alasannya fungsional." },
            { text: "VaR agregat bisa menyembunyikan konsentrasi ke satu faktor — limit sensitivitas menangkap 'telur dalam satu keranjang'", why: "pelajaran cerita pembuka — VaR aman sementara eksposur ke satu faktor menumpuk tak terlihat.", correct: true },
            { text: "VaR tidak bisa dihitung", why: "VaR bisa dihitung." },
            { text: "Regulator melarang VaR saja", why: "bukan itu alasannya." },
          ],
        },
        {
          q: "IPV menemukan mark trader 2% lebih optimis dari sumber independen untuk portofolio Rp5 T. Artinya?",
          options: [
            { text: "Tidak material", why: "2% × Rp5T = Rp100M — sangat material." },
            { text: "Potensi P&L fiktif Rp100 M — butuh adjustment + investigasi; semua metrik risiko di atas harga ini ikut salah", why: "VaR/limit dihitung dari harga ini — fondasi seluruh kerangka retak. IPV = fondasi.", correct: true },
            { text: "Trader pasti curang", why: "belum tentu curang — bisa salah model; yang pasti butuh investigasi." },
            { text: "Abaikan — 2% kecil", why: "dalam nominal besar, 2% sangat material." },
          ],
        },
        {
          q: "Siapa yang seharusnya memantau utilisasi limit harian — dan kenapa?",
          options: [
            { text: "Desk itu sendiri — mereka paling tahu posisinya", why: "desk mengukur dirinya sendiri = konflik kepentingan (pelajaran Kerviel & Leeson)." },
            { text: "Risk management yang independen — pemisahan fungsi agar breach dilaporkan jujur dan eskalasi berjalan", why: "pemantau independen + pemilik limit yang jelas + konsekuensi tertulis = limit bergigi.", correct: true },
            { text: "Tidak perlu dipantau rutin", why: "limit tanpa pantau = dekorasi." },
            { text: "Auditor eksternal tahunan", why: "terlalu jarang — breach butuh respons harian." },
          ],
        },
        {
          q: "Dewan menetapkan 'VaR ≤ Rp500 M'. Apa yang KURANG dari appetite statement ini?",
          options: [
            { text: "Sudah lengkap", why: "belum — appetite butuh 4 elemen." },
            { text: "Kondisi/skenario (kapan angka ini berlaku), cakupan risiko yang diterima & ditolak, dan proses pelampauan yang sah", why: "appetite tanpa skenario = angka tanpa makna; tanpa proses pelampauan = dilanggar diam-diam.", correct: true },
            { text: "Tanda tangan notaris", why: "bukan itu yang kurang." },
            { text: "Angka yang lebih kecil", why: "bukan soal besar-kecil, melainkan kelengkapan kerangka." },
          ],
        },
      ],
    },
  ],
};
