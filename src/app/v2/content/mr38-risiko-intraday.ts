import type { V2Lesson } from "../lib/types";

export const mr38: V2Lesson = {
  slug: "mr38-risiko-intraday",
  track: "Market Risk",
  module: "Pengukuran Risiko",
  title: "MR38 — Risiko Intraday: Volatilitas Realisasi, VaR Per Jam, dan Flash Crash",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pukul 14.32: Dow jatuh hampir 1.000 poin dalam hitungan menit — lalu pulih sebelum penutupan",
      prose: [
        "6 Mei 2010, pukul 14.32 waktu New York. Dow Jones jatuh hampir 1.000 poin — sekitar 9 persen dari level ~10.800 — dalam hitungan menit, dengan sekitar 600 poin hilang dalam 5 menit terburuknya (600/10.800 ≈ 5,6 persen — bukan 9 persen; 9 persen adalah penurunan intraday penuh, ~998 poin) — lalu pulih hampir seluruhnya dalam 20 menit. Trader yang memakai VaR harian melihat angka yang 'baik-baik saja' keesokan paginya: return harian hanya minus 3 persen. Tetapi trader yang memegang posisi LEVERAGE pada pukul 14.32 sudah terkena margin call dan terlikuidasi — di harga terburuk hari itu — sebelum pemulihan datang. VaR harian tidak pernah melihat 5 menit itu. Risiko intraday-lah yang membunuh mereka.",
        "Inilah blind spot VaR harian (MR3): ia mengukur kerugian dari penutupan ke penutupan — dan buta terhadap apa yang terjadi DI ANTARA penutupan. Posisi yang dibuka dan ditutup dalam sehari, margin call intraday, dan flash crash semuanya hidup di dalam hari — di luar jangkauan VaR harian. Bank yang hanya memantau risiko harian sedang memantau cuaca dengan melihat langit sekali sehari.",
        "Lesson ini membangun sudut yang hanya tersebar sebagai singgungan: MR13 menyebut spread melebar di pembukaan, MR2 menyebut limit intraday dan estimator EWMA cepat, MR30 menyebut P&L trading intraday — tetapi tidak ada lesson tentang pengukuran risiko intraday: volatilitas realisasi, VaR per jam, dan flash crash. E31 membahas mikrostruktur dari sudut eksekusi; lesson ini membahasnya dari sudut pengukuran risiko. Setelah lesson ini kamu bisa: (1) menghitung volatilitas realisasi dari return 5 menit; (2) menghitung VaR per jam dengan scaling akar waktu; (3) menjelaskan flash crash dan circuit breaker; (4) merancang limit intraday; (5) menjelaskan kapan scaling akar waktu gagal.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MR13 menyebut spread intraday dalam satu paragraf (melebar di pembukaan, menyempit siang hari), MR2 menyebut limit intraday dan EWMA cepat, MR30 memakai P&L intraday untuk atribusi. Tidak ada lesson yang mengukur risiko intraday: tidak ada volatilitas realisasi, tidak ada VaR per jam, tidak ada flash crash sebagai kasus risiko. E31 membahas mikrostruktur dari sudut eksekusi (order book, Kyle, shortfall); lesson ini membahasnya dari sudut pengukuran risiko. Keduanya saling melengkapi, bukan menduplikasi.",
      },
      reference: "Vol harian 2 persen → vol per jam 0,71 persen; VaR 95 persen per jam 1,16 persen; posisi Rp200 juta → VaR per jam Rp2,33 juta. Flash crash 2010: Dow jatuh hampir 9 persen (~998 poin) dalam hitungan menit.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengukur risiko yang hidup di dalam hari — bukan hanya risiko antar hari.",
        "(1) Menghitung volatilitas realisasi dari return intraday;",
        "(2) Menghitung VaR per jam dengan scaling akar waktu;",
        "(3) Menjelaskan flash crash 2010 dan circuit breaker;",
        "(4) Merancang limit intraday (posisi, kerugian, dan kill switch);",
        "(5) Menjelaskan kapan scaling akar waktu gagal (jump dan korelasi intraday).",
      ],
      tasks: [],
    },
    {
      id: "realized-vol",
      eyebrow: "Langkah 3 · Teori",
      title: "Volatilitas realisasi: mengukur dari dalam hari",
      prose: [
        "Volatilitas realisasi (realized volatility, RV) mengukur volatilitas dari return intraday — bukan dari return harian. Rumusnya: RV = akar dari jumlah kuadrat return 5 menit dalam sehari. Bila return 5 menit hari itu adalah 0,3; minus 0,2; 0,5; minus 0,1; dan seterusnya (96 interval 5 menit dalam 8 jam perdagangan), RV = akar dari jumlah kuadrat semuanya. RV memakai 96 observasi, bukan 1 — sehingga kesalahan samplingnya lebih kecil untuk mengukur volatilitas hari itu. Tetapi '96 kali lebih banyak data' TIDAK otomatis berarti 'jauh lebih akurat': return frekuensi tinggi mengandung microstructure noise — bid-ask bounce dan diskritisasi harga — yang membuat RV bias ke atas bila intervalnya terlalu pendek. Itulah alasan standar memakai 5 menit, bukan 1 detik: 5 menit adalah kompromi antara banyak data dan sedikit noise. RV lebih baik untuk mengukur volatilitas HARI ITU — bukan lebih akurat dalam segala hal.",
        "RV juga mengungkap pola intraday yang disembunyikan return harian: volatilitas berbentuk U — tinggi di pembukaan (ketidakpastian overnight), rendah di tengah hari (makan siang), tinggi lagi di penutupan (penyesuaian posisi). Trader yang memakai satu angka volatilitas harian untuk limit intraday sedang memakai rata-rata untuk mengatur jam-jam yang sangat berbeda. Limit yang benar mengikuti bentuk U: lebih ketat di pembukaan dan penutupan, lebih longgar di tengah hari.",
        "Scaling akar waktu menghubungkan horizon: volatilitas per jam = volatilitas harian dibagi akar jumlah jam perdagangan. Contoh: vol harian 2 persen, 8 jam perdagangan → vol per jam = 2 dibagi akar 8 = 2 dibagi 2,8284 = 0,71 persen. VaR 95 persen per jam = 1,645 × 0,71 persen = 1,16 persen. Untuk posisi Rp200 juta, VaR per jam = 1,16 persen × 200 juta = Rp2,33 juta. Artinya: dalam 5 persen jam-jam terburuk, kerugian melebihi Rp2,33 juta DALAM SATU JAM. Trader dengan leverage 10x dan modal Rp20 juta akan kehilangan 12 persen modalnya dalam satu jam buruk — dan margin call datang sebelum hari berakhir.",
        "Tetapi scaling akar waktu punya syarat: return harus independen antar interval (tidak berkorelasi) dan tidak ada lompatan (jump). Kenyataannya, return intraday BERKORELASI (momentum dalam hitungan menit) dan MELOMPAT (pengumuman, flash crash). Saat ada jump, volatilitas per jam yang sebenarnya LEBIH BESAR dari hasil scaling — karena jump tidak 'dibagi rata' ke tiap jam. Aturan praktis: scaling akar waktu adalah perkiraan pertama, bukan kebenaran — selalu bandingkan dengan RV yang diukur langsung dari data intraday.",
      ],
      tasks: [],
      formula: String.raw`RV = \sqrt{\sum r_{5m}^2} \qquad \sigma_{1j} = \frac{\sigma_{1h}}{\sqrt{8}} \qquad \text{VaR}_{1j} = 1{,}645 \times \sigma_{1j} \times P`,
      formulaNote: "RV = volatilitas realisasi dari return 5 menit; sigma 1j = vol per jam = 2 persen / akar 8 = 0,71 persen; VaR per jam 95 persen = 1,645 × 0,71 persen = 1,16 persen; posisi 200 juta → VaR Rp2,33 juta.",
      reference: "Vol per jam 0,71 persen; VaR 95 persen per jam 1,16 persen; VaR Rp2,33 juta untuk posisi Rp200 juta.",
    },
    {
      id: "flash-crash",
      eyebrow: "Langkah 4 · Teori",
      title: "Flash crash dan circuit breaker: saat likuiditas menguap",
      prose: [
        "Flash crash 6 Mei 2010 adalah kasus risiko intraday yang paling terkenal. Pemicunya: order jual futures E-mini S&P senilai 4,1 miliar dolar yang dieksekusi algoritma dengan agresif — algoritma itu menjual tanpa batas harga dan tanpa memperhatikan volume. HFT yang biasanya menyediakan likuiditas menarik diri serentak (E31: likuiditas cuaca cerah). Dalam hitungan menit, Dow jatuh hampir 9 persen — sekitar 998 poin dari level ~10.800; beberapa saham diperdagangkan di harga 1 sen — lalu pulih. Kerugian total yang 'nyata' kecil (karena pulih), tetapi trader yang terkena margin call di titik terendah kehilangan uang sungguhan — likuidasi tidak bisa dibatalkan karena harga 'pulih kemudian'.",
        "Tiga pelajaran flash crash. Pertama, likuiditas algoritmik menguap saat dibutuhkan — depth yang terlihat di order book bukan depth yang bertahan saat stres (E31). Kedua, eksekusi algoritmik tanpa batas (tanpa limit harga, tanpa jeda volume) bisa menjadi pemicu sistemik — satu algoritma yang buruk bisa menjatuhkan pasar. Ketiga, VaR harian buta terhadapnya — return harian minus 3 persen terlihat 'normal', tetapi kerugian intraday mencapai 9 persen. Bank yang hanya memantau harian tidak akan pernah tahu bahwa tradernya hampir bangkrut pukul 14.37.",
        "Respons regulator: circuit breaker dan limit up/limit down — tetapi perhatikan TANGGALNYA. Aturan yang berlaku KINI — penghentian perdagangan otomatis saat S&P 500 jatuh 7, 13, dan 20 persen (level 1, 2, 3) — BUKAN aturan yang berlaku pada 2010: saat flash crash terjadi, circuit breaker berbasis poin Dow dengan ambang 10, 20, dan 30 persen — dan ambang itu tidak terpicu hari itu. Aturan 7/13/20 persen baru ditetapkan pada 2012–2013 sebagai respons atas flash crash, bersama limit up/limit down per saham (perdagangan dihentikan 5 menit bila harga bergerak 5 persen dalam 5 menit untuk saham Tier 1; 10 persen untuk Tier 2). Jangan mengutip 7/13/20 sebagai 'aturan 2010' — ia adalah aturan pasca-2010. Tujuannya bukan mencegah kejatuhan — melainkan memberi WAKTU: waktu bagi manusia untuk memeriksa, bagi algoritma untuk berhenti, dan bagi likuiditas untuk kembali. Circuit breaker adalah pengakuan resmi bahwa pasar butuh jeda saat mesinnya berlari terlalu cepat.",
        "Limit intraday yang benar punya tiga lapis. Limit posisi: maksimum eksposur per trader per jam — bukan hanya per hari. Limit kerugian intraday (intraday stop-loss): bila kerugian mencapai Rp10 juta sebelum pukul 12.00, posisi dipotong otomatis — tanpa menunggu penutupan. Kill switch: tombol yang mematikan SEMUA algoritma trading saat volatilitas intraday melewati ambang — dipakai manusia, bukan mesin. Bank tanpa kill switch sedang membiarkan mesinnya berlari tanpa rem.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira return harian yang kecil berarti hari itu aman. Hari dengan return harian minus 3 persen bisa mengandung kejatuhan intraday 9 persen — dan margin call tidak menunggu penutupan. Risiko intraday diukur dari dalam hari, bukan dari penutupan ke penutupan.",
      },
      reference: "Flash crash 2010: Dow jatuh hampir 9 persen (~998 poin) dalam hitungan menit, pulih dalam 20 menit. Circuit breaker KINI: 7, 13, 20 persen (aturan 2012–2013, bukan 2010); LULD 5 persen/5 menit (Tier 1).",
    },
    {
      id: "lab-intraday",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin VaR per jam",
      prose: [
        "Lab ini membangun mesin VaR intraday: dari volatilitas harian, jam perdagangan, dan nilai posisi — hitung volatilitas per jam, VaR 95 persen per jam (persen dan rupiah).",
        "Hitung dulu di kepala. Akar 8 = 2,828427. Vol per jam = 2 dibagi 2,828427 = 0,7071 persen. VaR 95 persen per jam = 1,645 × 0,7071 = 1,1632 persen. VaR rupiah = 1,1632 persen × 200 = Rp2,3264 juta — dibulatkan Rp2,33 juta.",
        "Tugas lab: tulis fungsi yang menerima volatilitas harian, jam perdagangan, dan nilai posisi — lalu mencetak vol per jam (4 desimal), VaR persen per jam (4 desimal), dan VaR rupiah (2 desimal). Tiga angka ini adalah limit intraday dalam bentuk terkecilnya.",
        "Setelah lolos, coba eksperimen: naikkan leverage menjadi 10x (posisi Rp2.000 juta dengan modal Rp200 juta) dan lihat VaR per jam menjadi Rp23,26 juta — 11,6 persen dari modal dalam satu jam buruk. Lalu tanyakan: berapa jam buruk berturut-turut yang menghabiskan modalmu?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `vol_jam` (vol harian dibagi akar jam perdagangan)" },
        { id: "t2", text: "Hitung `var_persen` (1,645 dikali vol per jam)" },
        { id: "t3", text: "Hitung `var_rp` (VaR persen dikali nilai posisi dibagi 100)" },
      ],
      expected: "vol_jam=0.7071\nvar_persen=1.1632\nvar_rp=2.33",
      hints: [
        "Vol per jam = vol harian / akar(jam); gunakan math.sqrt.",
        "VaR 95% per jam = 1,645 x vol per jam.",
        "VaR rupiah = var_persen / 100 x posisi.",
      ],
      code: {
        starter: `# Posisi Rp200 jt, vol harian 2%, 8 jam perdagangan, z 95% = 1,645.\nimport math\nvol_harian = 2.0  # persen\njam = 8\nposisi = 200.0  # juta rupiah\nz = 1.645\n\n# TULIS KODEMU: hitung vol_jam, var_persen, var_rp.\n# Cetak, per baris: vol_jam, var_persen, var_rp.\n\n`,
        lockLines: 6,
        solution: `# Posisi Rp200 jt, vol harian 2%, 8 jam perdagangan, z 95% = 1,645.\nimport math\nvol_harian = 2.0  # persen\njam = 8\nposisi = 200.0  # juta rupiah\nz = 1.645\n\n\nvol_jam = vol_harian / math.sqrt(jam)\nvar_persen = z * vol_jam\nvar_rp = var_persen / 100 * posisi\nprint(f"vol_jam={vol_jam:.4f}")\nprint(f"var_persen={var_persen:.4f}")\nprint(f"var_rp={var_rp:.2f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "vol_jam", value: 0.7071, tol: 0.0001, label: "Vol per jam 0,7071 persen", msg: "2 / akar 8 = 2 / 2,8284 = 0,7071." },
          { kind: "equal", task: "t2", name: "var_persen", value: 1.1632, tol: 0.0001, label: "VaR per jam 1,1632 persen", msg: "1,645 x 0,7071 = 1,1632." },
          { kind: "equal", task: "t3", name: "var_rp", value: 2.33, tol: 0.01, label: "VaR per jam Rp2,33 juta", msg: "1,1632 persen x 200 = 2,33. Dalam satu jam buruk, kerugian melebihi ini." },
        ],
      },
      reference: "Vol per jam 0,7071 persen; VaR per jam 1,1632 persen; VaR Rp2,33 juta.",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 6 · Teori",
      title: "Praktik: memantau risiko yang hidup di dalam hari",
      prose: [
        "Pemantauan intraday yang benar punya empat elemen. Pertama, dashboard real-time: P&L, VaR per jam, dan utilisasi limit — diperbarui tiap menit, bukan tiap pagi. Kedua, peringatan dini berbasis RV: bila RV 1 jam terakhir dua kali RV rata-rata, kirim peringatan ke risk manager — sebelum limit terlampaui. Ketiga, stress test intraday: simulasikan flash crash 9 persen dalam 5 menit dan lihat siapa yang terkena margin call — bukan hanya siapa yang rugi di penutupan. Keempat, rencana komunikasi: siapa yang menekan kill switch, siapa yang menelepon prime broker, siapa yang memberitahu direksi — ditulis sebelum krisis, bukan dicari saat krisis.",
        "Satu peringatan tentang data intraday: data 5 menit dari vendor bisa mengandung bad tick (MR32) — satu harga yang salah 50 persen karena kesalahan input — yang membuat RV melonjak palsu. Selalu validasi: filter return di atas ambang (misalnya 10 persen dalam 5 menit) dan periksa ke sumber kedua sebelum bertindak. Peringatan dini yang dipicu bad tick sama buruknya dengan tidak ada peringatan: tim risiko berhenti mempercayai dashboardnya.",
        "Aturan penutup: risiko intraday bukan risiko yang berbeda — ia risiko yang sama, dilihat dengan resolusi waktu yang lebih tinggi. Bank yang memantau harian saja sedang menonton film dengan satu frame per hari; bank yang memantau intraday menonton filmnya utuh. Keduanya menonton film yang sama — tetapi hanya yang kedua yang melihat adegan kecelakaannya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai scaling akar waktu tanpa memeriksa jump. Bila return intraday mengandung lompatan (pengumuman, flash crash), volatilitas per jam yang sebenarnya lebih besar dari hasil scaling. Selalu bandingkan dengan RV yang diukur langsung.",
      },
      reference: "Empat elemen: dashboard real-time, peringatan RV, stress test flash crash, rencana komunikasi + kill switch.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: trader yang selamat dari pukul 14.32",
      prose: [
        "6 Mei 2010, pukul 14.30, trader di Bank Nusantara memegang posisi Rp200 juta dengan leverage 5x. VaR per jam-nya Rp2,33 juta — dan limit kerugian intraday-nya Rp10 juta. Pukul 14.32, pasar jatuh: dalam 5 menit, posisinya rugi Rp8 juta — mendekati limit, tetapi belum melewatinya. Sistem peringatan RV berbunyi: RV 1 jam terakhir tiga kali rata-rata. Risk manager menelepon: 'Potong separuh posisi sekarang.' Trader memotong separuh — rugi Rp8 juta terkunci. Pukul 14.37, pasar jatuh lebih dalam — posisi penuh akan rugi Rp15 juta dan terkena margin call. Pukul 14.50, pasar pulih — posisi yang dipotong 'kehilangan' pemulihan Rp5 juta. Trader itu marah semalam — dan berterima kasih seminggu kemudian.",
        "Keputusan memotong separuh bukan keputusan yang 'benar' secara hasil — secara hasil, menahan penuh akan lebih menguntungkan karena pasar pulih. Tetapi keputusan itu benar secara PROSES: ia mengikuti limit yang ditulis sebelum krisis, ia memakai informasi real-time (RV tiga kali rata-rata), dan ia melindungi bank dari skenario terburuk (margin call di titik terendah). Manajemen risiko dinilai dari proses, bukan dari hasil satu hari — karena hasil satu hari mengandung keberuntungan, dan proses yang baik adalah satu-satunya hal yang bisa diulang.",
        "Pelajaran untuk semua risk manager: tulis limit intraday SEBELUM krisis, dan patuhi saat krisis. Limit yang dilanggar karena 'kali ini berbeda' bukan limit — ia saran. Dan pasar selalu memberi alasan kenapa 'kali ini berbeda' — tepat saat limit itu paling dibutuhkan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, limit ditulis sebelum krisis — bukan ditemukan saat krisis. Kedua, tindakan dipicu sinyal real-time (RV), bukan perasaan. Ketiga, keputusan dinilai dari proses — bukan dari hasil yang mengandung keberuntungan pemulihan.",
      },
      reference: "Rugi Rp8 juta terkunci; posisi penuh akan rugi Rp15 juta + margin call. Pasar pulih — tetapi proses yang benar tetap benar.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Vol per jam 0,7071 persen; VaR per jam 1,1632 persen; VaR Rp2,33 juta.",
        "Volatilitas realisasi memakai return 5 menit — 96 kali lebih banyak informasi dari return harian.",
        "Flash crash 2010: Dow jatuh hampir 9 persen (~998 poin) dalam hitungan menit, pulih dalam 20 menit.",
        "Circuit breaker KINI: 7, 13, 20 persen — aturan 2012–2013 pasca-flash crash, bukan aturan 2010 — memberi waktu, bukan mencegah kejatuhan.",
        "Scaling akar waktu gagal bila ada jump dan korelasi intraday — bandingkan dengan RV.",
      ],
      next: { label: "MR39 — Climate Risk di Trading Book: Transisi, Fisik, dan Stress Test", href: "/v2/learn/mr39-climate-risk-trading-book" },
      quiz: [
        {
          q: "Vol harian 2 persen, 8 jam perdagangan, posisi Rp200 juta. Berapa vol per jam, VaR 95 persen per jam, dan VaR rupiah?",
          options: [
            { text: "Vol 0,7071 persen; VaR 1,1632 persen; Rp2,33 juta", why: "Tepat: 2/akar 8 = 0,7071; 1,645 × 0,7071 = 1,1632; 1,1632 persen × 200 = 2,33.", correct: true },
            { text: "Vol 0,25 persen; VaR 0,41 persen; Rp0,82 juta", why: "Salah: 2/8 = 0,25 memakai pembagian biasa — bukan akar. Volatilitas scaling dengan AKAR waktu, bukan waktu." },
            { text: "Vol 2 persen; VaR 3,29 persen; Rp6,58 juta", why: "Salah: itu vol HARIAN, bukan vol per jam. VaR per jam memakai vol per jam (0,7071 persen)." },
            { text: "Vol 0,7071 persen; VaR 1,1632 persen; Rp11,63 juta", why: "Salah: Rp11,63 juta berasal dari 1,1632 persen × 1.000 — posisi yang salah. Posisi kita Rp200 juta, bukan Rp1.000 juta." },
          ],
        },
        {
          q: "Kenapa VaR harian buta terhadap flash crash 2010?",
          options: [
            { text: "Karena flash crash tidak tercatat di data harian", why: "Salah: flash crash tercatat — return harian minus 3 persen. Masalahnya: return harian menyembunyikan kejatuhan intraday 9 persen." },
            { text: "Karena VaR harian mengukur penutupan ke penutupan — kejatuhan 9 persen dalam hitungan menit dan pemulihannya tidak terlihat", why: "Tepat: margin call intraday membunuh sebelum penutupan. Risiko yang hidup di dalam hari butuh pengukuran intraday.", correct: true },
            { text: "Karena VaR harian hanya untuk saham, bukan untuk indeks", why: "Salah: VaR harian berlaku untuk semua aset. Masalahnya adalah resolusi waktu, bukan jenis aset." },
            { text: "Karena flash crash terjadi di luar jam perdagangan", why: "Salah: flash crash terjadi pukul 14.32 — di tengah jam perdagangan. Itulah intinya: ia terjadi DI DALAM hari." },
          ],
        },
        {
          q: "Apa fungsi circuit breaker (7, 13, 20 persen)?",
          options: [
            { text: "Mencegah pasar jatuh sama sekali", why: "Salah: circuit breaker tidak mencegah kejatuhan — ia memberi JEDA. Pasar bisa lanjut jatuh setelah perdagangan dibuka lagi." },
            { text: "Memberi waktu — bagi manusia memeriksa, algoritma berhenti, dan likuiditas kembali", why: "Tepat: jeda memutus kepanikan mesin. Tujuannya waktu, bukan pencegahan.", correct: true },
            { text: "Menjamin harga tidak pernah jatuh lebih dari 7 persen sehari", why: "Salah: level 1 (7 persen) hanya menghentikan 15 menit. Pasar bisa jatuh 20 persen dalam sehari — level 3 menghentikan sampai penutupan." },
            { text: "Menghukum trader yang menjual", why: "Salah: circuit breaker netral — ia menghentikan SEMUA perdagangan, beli dan jual. Bukan hukuman." },
          ],
        },
        {
          q: "Kapan scaling akar waktu untuk VaR per jam menjadi tidak valid?",
          options: [
            { text: "Bila return intraday independen dan tidak ada lompatan — scaling selalu valid", why: "Salah: terbalik. Scaling valid PERSIS bila return independen dan tanpa lompatan. Bila ada jump dan korelasi, scaling meremehkan risiko." },
            { text: "Bila ada jump (lompatan harga) dan korelasi intraday — volatilitas per jam sebenarnya lebih besar dari hasil scaling", why: "Tepat: jump tidak 'dibagi rata' ke tiap jam. Bandingkan selalu dengan RV yang diukur langsung.", correct: true },
            { text: "Bila jam perdagangan lebih dari 8 jam", why: "Salah: jumlah jam hanya mengubah pembagi (akar jam). Scaling tetap valid bila syarat independensi terpenuhi." },
            { text: "Bila posisi lebih besar dari Rp200 juta", why: "Salah: ukuran posisi tidak memengaruhi validitas scaling — ia hanya mengalikan VaR rupiah." },
          ],
        },
        {
          q: "Trader memotong separuh posisi saat RV tiga kali rata-rata, lalu pasar pulih — ia 'kehilangan' pemulihan Rp5 juta. Apakah keputusannya salah?",
          options: [
            { text: "Ya — secara hasil, menahan penuh lebih menguntungkan", why: "Salah: manajemen risiko dinilai dari PROSES, bukan hasil satu hari. Hasil mengandung keberuntungan; proses yang baik bisa diulang." },
            { text: "Tidak — keputusan mengikuti limit yang ditulis sebelum krisis dan sinyal real-time; ia melindungi dari skenario terburuk", why: "Tepat: limit dipatuhi saat paling dibutuhkan. Menahan penuh bisa berarti margin call di titik terendah.", correct: true },
            { text: "Ya — RV tiga kali rata-rata bukan sinyal yang valid", why: "Salah: RV tiga kali rata-rata adalah sinyal stres yang nyata. Mengabaikannya berarti mengabaikan peringatan dini." },
            { text: "Tidak — tetapi hanya karena ia beruntung pasar tidak jatuh lebih dalam", why: "Salah: keputusan benar karena PROSESNYA (limit + sinyal), bukan karena hasilnya. Bahkan bila pasar jatuh lebih dalam, keputusan itu tetap benar." },
          ],
        },
      ],
    },
  ],
};
