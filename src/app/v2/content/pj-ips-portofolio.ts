import type { V2Lesson, V2Step } from "../lib/types";

// ── PROYEK TERPANDU #5: Konstruksi Portofolio Berbasis IPS (gaya CFA) ─────
// Capstone jalur Market — level advanced (pre-L2/L3 CFA). Kasus klien
// Indonesia yang konsisten angkanya dari awal sampai akhir:
// dr. Ardi Wibowo, 45 thn, pemilik klinik di Makassar.
// Dataset: 100% SINTETIS deterministik (seed 42) — 180 bulan return RIIL
// (2011-01 s.d. 2025-12), 5 kelas aset; CME = statistik sampel eksak.
// Snapshot: public/proyek/pj-ips-portofolio/ (return_bulanan.csv,
// atribusi.csv, klien.json, METODE.md).
// Ground truth (dari harness scripts/harness_ips.py, SEMUA PASS):
// r* = 4,2358% riil; SAA terpilih = B (exp 4,52% / vol 6,61% / after-tax
// 4,32%); A gagal return (4,045% < r*); C gagal kendala ekuitas (55% > 40%);
// Brinson Q1 2026: excess +0,265% = alloc +0,285% + selec +0,040% + inter -0,060%.
// Impostor: "konsultan" 85% single-name / janji 12% / 5 pelanggaran terukur.

const BASE = "/proyek/pj-ips-portofolio";

export const pjIpsPortofolioMeta = {
  role: "Konsultan perencana keuangan — bekerja dengan penasihat investasi berizin OJK",
  client: "dr. Ardi Wibowo, 45 — pemilik klinik di Makassar: dana pensiun, pendidikan anak, ekspansi klinik",
  tagline:
    "Susun IPS dari angka kasus yang nyata-proyek — return objective yang dihitung, bukan ditempel — lalu adili proposal 'konsultan' yang melanggar IPS baris per baris.",
};

export const pjIpsPortofolio: V2Lesson = {
  slug: "pj-ips-portofolio",
  track: "Portfolio Management",
  module: "Proyek Terpandu",
  title: "Proyek: Konstruksi Portofolio Berbasis IPS — Dari Angka Klien Sampai Audit Konsultan",
  estMinutes: 300,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing proyek",
      title: "Klien dengan tiga tujuan dan satu tenggat likuiditas",
      prose: [],
      tasks: [],
      briefing: {
        role: "Konsultan perencana keuangan independen — kamu menyusun Investment Policy Statement (IPS) dan rekomendasi alokasi; implementasi dieksekusi oleh penasihat investasi berizin OJK.",
        client:
          "dr. Ardi Wibowo, 45 tahun, pemilik klinik pratama di Makassar. Penghasilan bersih Rp 85 juta/bulan (±Rp 1.020 juta/tahun); pengeluaran 620 juta, asuransi & lain-lain 150 juta → tabungan investable Rp 250 juta/tahun. Aset investable Rp 8.000 juta (deposito 1.200, SBN 2.000, reksa dana saham 3.500, emas 500, saham LQ45 800). Tiga tujuan: dana pensiun Rp 16.000 juta saat usia 60 (15 tahun), pendidikan anak (8 tahun → kuliah) Rp 2.000 juta dalam 10 tahun, dana waris Rp 2.000 juta. Tenggat likuiditas: ekspansi klinik Rp 800 juta dalam 18 bulan + dana darurat Rp 300 juta. Di tengah proyek, seorang 'konsultan' eksternal akan menyodorkan proposal alokasi yang tampak meyakinkan — tugasmu mengadilinya dengan angka, bukan firasat.",
        story: [
          "Rabu, 10:00. dr. Ardi meletakkan tiga amplop di meja: 'Pensiun saya, kuliah anak saya, dan warisan untuk keluarga. Klinik mau saya lebarkan tahun depan — Rp 800 juta harus cair 18 bulan lagi.' Lalu ia menunjukkan proposal dari seorang konsultan: satu halaman, rapi, proyeksi return 12% per tahun. 'Katanya ini yang paling cepat mencapai target saya. Benarkah?'",
          "Kamu tidak menjawab dari firasat. Jawaban profesional dimulai dari pertanyaan yang bisa dihitung: berapa return yang SEHARUSNYA dibutuhkan untuk tiga tujuan itu? Berapa risiko yang SANGGUP dan MAU ditanggung klien? Batasan apa yang tidak bisa dinegosiasi — pajak, likuiditas, regulasi? Semua itu dituangkan dalam satu dokumen: Investment Policy Statement.",
          "Proyek ini multi-sesi (±300 menit): kamu menghitung return objective dari angka kasus, menyusun IPS lengkap dengan lima constraints, membangun capital market expectations dari dataset, memilih Strategic Asset Allocation yang lolos semua kendala, merancang rebalancing, menghitung dampak pajak — lalu menghadapi proposal konsultan: 85% di satu saham, janji 12%, bahasa yang sangat meyakinkan. Lima pelanggarannya terukur. Temukan semuanya.",
        ],
        objectives: [
          "Menghitung return objective IPS dari angka kasus (PV, tabungan, horizon, target) — bukan menempel template.",
          "Membedakan ability vs willingness to take risk dan menulis lima constraints IPS yang mengikat.",
          "Membangun capital market expectations dari dataset dan memilih SAA yang lolos SEMUA kendala (tanpa short, batas ekuitas, lantai likuiditas, return ≥ objective).",
          "Menghitung atribusi Brinson (allocation/selection/interaction) dari data dan mengaudit proposal konsultan: 5 pelanggaran terukur.",
        ],
        prereqSummary:
          "IPS (Investment Policy Statement) = dokumen yang mengikat tujuan, return objective, toleransi risiko, dan batasan (constraints) klien — semua keputusan investasi harus tunduk padanya. Return objective = return minimum yang dibutuhkan agar tujuan tercapai, DIHITUNG dari angka (bukan 'target 10%'). SAA (Strategic Asset Allocation) = bobot jangka panjang tiap kelas aset. Rebalancing = mengembalikan bobot ke target saat meleset. Atribusi Brinson = memecah excess return vs benchmark menjadi tiga: allocation (pilihan bobot), selection (pilihan sekuritas), interaction (keduanya). PPh final Indonesia: bunga obligasi/SBN 10%, deposito 20%, dividen orang pribadi 10%. Kamu tidak perlu hafal — proyek ini menuntunmu menghitungnya.",
        datasetNote:
          "Sumber: 100% SINTETIS untuk proyek ini (generator deterministik, seed 42) — 180 bulan return RIIL lima kelas aset Indonesia (SBN, deposito, pasar uang, LQ45, emas), 2011-01 s.d. 2025-12.\nIsi: `return_bulanan.csv` (return riil bulanan, desimal) + `atribusi.csv` (data atribusi Brinson Q1 2026: bobot & return portofolio vs benchmark per kelas) + `klien.json` (angka kasus).\nKejujuran: (1) parameter return diset menyerupai orde-besaran aset Indonesia — BUKAN klaim historis; (2) deret direskalakan agar mean/vol sampel persis = parameter (CME ground truth eksak); (3) optimasi SAA = evaluasi kandidat diskrit + cek kendala (disengaja agar bisa dihitung tangan); (4) klien, perusahaan, dan angka kasus fiktif. Detail + ground truth: METODE.md.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "180 bulan, 5 kelas aset, 1 kasus klien",
      prose: [
        "Tiga file menunggumu. `return_bulanan.csv`: 180 baris — setiap baris satu bulan (2011-01 s.d. 2025-12) dengan return RIIL lima kelas aset dalam desimal (0,01 = 1%). `atribusi.csv`: bobot dan return kuartalan portofolio vs benchmark untuk tiga kelas (Saham LQ45, Obligasi/SBN, Likuid) — bahan Lab 4. `klien.json`: angka kasus dr. Ardi — PV Rp 8.000 juta, tabungan Rp 250 juta/tahun, horizon 15 tahun, target total Rp 20.000 juta (16.000 pensiun + 2.000 pendidikan + 2.000 waris), kebutuhan likuiditas Rp 1.100 juta (darurat 300 + ekspansi klinik 800 dalam 18 bulan), tarif PPh final, dan batas-batas IPS (ekuitas ≤ 40%, likuid ≥ 15%, single-name ≤ 10%).",
        "Aturan main: (1) semua angka kunci proyek HARUS bisa dihitung ulang dari file-file ini — tidak ada angka yang 'datang dari langit'; (2) return objective dihitung, bukan ditempel; (3) setiap klaim — termasuk klaim konsultan nanti — diverifikasi terhadap dataset dan IPS.",
      ],
      tasks: [
        { id: "t1", text: "Buka `return_bulanan.csv`: catat jumlah baris dan 6 nama kolom" },
        { id: "t2", text: "Buka `klien.json`: catat PV, tabungan tahunan, horizon, dan tiga komponen target" },
        { id: "t3", text: "Buka `atribusi.csv`: catat 3 kelas dan 4 kolom angkanya" },
      ],
      note: {
        title: "Miskonsepsi #1: return objective = angka yang 'masuk akal'",
        type: "pitfall",
        body: "Praktik malas: menulis 'target return 10% per tahun' di IPS karena terdengar ambisius-normal. Return objective yang benar adalah JAWABAN dari persamaan: dengan aset sekarang + tabungan + horizon ini, berapa return minimum agar target TERCAPAI? Kalau jawabannya 4,24%, maka 10% bukan 'ambisius' — melainkan risiko yang tidak perlu diambil. Lab 2 menghitungnya sampai 4 desimal.",
      },
      reference:
        "return_bulanan.csv (180 baris, 6 kolom, return riil desimal) + atribusi.csv (3 kelas × 5 kolom) + klien.json (angka kasus). Ground truth lengkap: METODE.md.",
    },
    {
      id: "lab-cme",
      eyebrow: "Langkah 3 · Lab 1 — Capital market expectations",
      title: "Harapan pasar yang bisa diaudit",
      prose: [
        "Sebelum satu bobot pun dipilih, kamu butuh peta medannya: berapa expected return dan volatilitas tahunan tiap kelas aset — DIHITUNG dari dataset, bukan ditebak. Capital market expectations (CME) yang jujur = statistik sampel yang bisa diverifikasi siapa pun dari file yang sama.",
        "Karena datanya return RIIL bulanan dalam desimal: expected return tahunan = rata-rata bulanan × 12, volatilitas tahunan = std bulanan × √12.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_bulan` dan verifikasi 5 kolom aset" },
        { id: "t2", text: "Hitung `exp_lq45`, `vol_lq45`, `exp_sbn`, `vol_sbn` (tahunan, desimal)" },
        { id: "t3", text: "Hitung `exp_emas` dan jawab: kelas apa dengan expected return tertinggi? Terendah?" },
      ],
      expected:
        "n_bulan=180, exp_lq45=0,0750, vol_lq45=0,1800, exp_sbn=0,0350, vol_sbn=0,0200, exp_emas=0,0300. Tertinggi: LQ45 (7,50%). Terendah: deposito (1,50%).",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — URL sudah disiapkan di starter.",
        "Tahunan: `df['lq45'].mean() * 12` dan `df['lq45'].std() * (12 ** 0.5)`.",
        "Jawaban t3 ada di angka yang sudah kamu hitung — urutkan saja.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL_RT = \"/proyek/pj-ips-portofolio/return_bulanan.csv\"",
          "df = pd.read_csv(open_url(URL_RT))",
          "ASET = [\"sbn\", \"deposito\", \"pasar_uang\", \"lq45\", \"emas\"]",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "n_bulan = ...",
          "exp_lq45 = ...      # df['lq45'].mean() * 12",
          "vol_lq45 = ...      # df['lq45'].std() * (12 ** 0.5)",
          "exp_sbn = ...",
          "vol_sbn = ...",
          "exp_emas = ...",
          "",
          "print(\"bulan:\", n_bulan)",
          "for a in ASET:",
          "    print(a, \"exp:\", round(float(df[a].mean() * 12), 4), \"vol:\", round(float(df[a].std() * (12 ** 0.5)), 4))",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL_RT = \"/proyek/pj-ips-portofolio/return_bulanan.csv\"",
          "df = pd.read_csv(open_url(URL_RT))",
          "ASET = [\"sbn\", \"deposito\", \"pasar_uang\", \"lq45\", \"emas\"]",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "n_bulan = len(df)",
          "exp_lq45 = float(df[\"lq45\"].mean() * 12)",
          "vol_lq45 = float(df[\"lq45\"].std() * (12 ** 0.5))",
          "exp_sbn = float(df[\"sbn\"].mean() * 12)",
          "vol_sbn = float(df[\"sbn\"].std() * (12 ** 0.5))",
          "exp_emas = float(df[\"emas\"].mean() * 12)",
          "",
          "print(\"bulan:\", n_bulan)",
          "for a in ASET:",
          "    print(a, \"exp:\", round(float(df[a].mean() * 12), 4), \"vol:\", round(float(df[a].std() * (12 ** 0.5)), 4))",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t1", label: "`n_bulan` = 180", name: "n_bulan", value: 180, msg: "15 tahun × 12 bulan." },
          { kind: "equal", task: "t2", label: "`exp_lq45` = 7,50%", name: "exp_lq45", value: 0.075, tol: 0.0005, msg: "Expected return riil LQ45 = 7,50% per tahun." },
          { kind: "equal", task: "t2", label: "`vol_lq45` = 18,00%", name: "vol_lq45", value: 0.18, tol: 0.002, msg: "Volatilitas LQ45 = 18% — harga dari return tertingginya." },
          { kind: "equal", task: "t2", label: "`exp_sbn` = 3,50%", name: "exp_sbn", value: 0.035, tol: 0.0005, msg: "SBN = 3,50% riil." },
          { kind: "equal", task: "t2", label: "`vol_sbn` = 2,00%", name: "vol_sbn", value: 0.02, tol: 0.001, msg: "SBN = 2% vol — jangkar stabilitas." },
          { kind: "equal", task: "t3", label: "`exp_emas` = 3,00%", name: "exp_emas", value: 0.03, tol: 0.0005, msg: "Emas = 3,00% riil dengan vol 15% — diversifier, bukan mesin return." },
        ],
      },
      quiz: [
        {
          q: "CME proyek ini 'ground truth eksak' karena…",
          options: [
            { text: "Datanya return riil sehingga tidak perlu penyesuaian inflasi", why: "Itu menyederhanakan, tapi bukan alasan 'eksak'.", correct: false },
            { text: "Deret dibangkitkan lalu direskalakan agar mean/vol sampel persis = parameter — jadi siapa pun yang menghitung dari file mendapat angka yang sama", why: "Benar. CME yang bisa diaudit = statistik yang bisa direproduksi dari dataset yang sama. Inilah standar yang nanti kamu pakai untuk mengadili klaim konsultan.", correct: true },
            { text: "Periode 15 tahun cukup panjang sehingga estimasi pasti benar", why: "Salah — panjang sampel mengurangi noise, tapi 'eksak' di sini datang dari konstruksi deterministiknya, bukan panjangnya.", correct: false },
          ],
        },
      ],
    },
    {
      id: "lab-return",
      eyebrow: "Langkah 4 · Lab 2 — Return objective",
      title: "Satu angka yang mengikat segalanya",
      prose: [
        "Sekarang pertanyaan intinya: dengan Rp 8.000 juta hari ini + Rp 250 juta/tahun selama 15 tahun, berapa return riil tahunan MINIMUM agar Rp 20.000 juta tercapai? Persamaannya: PV·(1+r)^15 + PMT·[((1+r)^15 − 1)/r] = 20.000. Tidak ada solusi aljabar rapi — selesaikan dengan binary search, seperti yang dilakukan perencana profesional di spreadsheet mereka.",
        "Angka ini akan menjadi GERBANG di IPS: setiap kandidat alokasi yang expected return-nya di bawah r* gugur — tidak peduli seberapa 'menarik' kelihatannya.",
      ],
      tasks: [
        { id: "t1", text: "Definisikan PV=8000, PMT=250, n=15, FV=20000 (juta Rp) dan fungsi fv(r)" },
        { id: "t2", text: "Binary search r di [0, 0.20] hingga presisi 6 desimal → `r_bintang`" },
        { id: "t3", text: "Verifikasi: hitung fv(r_bintang), harus ≈ 20000" },
      ],
      expected:
        "r_bintang=0,042358 (4,2358% riil — dibulatkan 4,24%), fv_check=20000,00",
      hints: [
        "fv(r) = PV*(1+r)**n + PMT*(((1+r)**n - 1)/r). Hati-hati: r=0 membuat pembagian nol — mulai search dari 0,0001.",
        "Binary search: 200 iterasi, jika fv(mid) < FV maka batas bawah naik.",
        "Angka 4,24% ini akan dipakai di SEMUA langkah berikutnya — catat baik-baik.",
      ],
      requires: [],
      code: {
        starter: [
          "PV, PMT, n, FV = 8000.0, 250.0, 15, 20000.0   # juta rupiah",
          "",
          "def fv(r):",
          "    return ...",
          "",
          "# TUGASMU: binary search r di [0.0001, 0.20]",
          "lo, hi = 0.0001, 0.20",
          "for _ in range(200):",
          "    ...",
          "r_bintang = ...",
          "fv_check = ...",
          "",
          "print(\"r* =\", round(r_bintang, 6), f\"({r_bintang*100:.2f}% riil)\")",
          "print(\"fv_check =\", round(fv_check, 2))",
        ].join("\n"),
        lockLines: 3,
        solution: [
          "PV, PMT, n, FV = 8000.0, 250.0, 15, 20000.0   # juta rupiah",
          "",
          "def fv(r):",
          "    return PV * (1 + r) ** n + PMT * (((1 + r) ** n - 1) / r)",
          "",
          "# TUGASMU: binary search r di [0.0001, 0.20]",
          "lo, hi = 0.0001, 0.20",
          "for _ in range(200):",
          "    mid = (lo + hi) / 2",
          "    if fv(mid) < FV:",
          "        lo = mid",
          "    else:",
          "        hi = mid",
          "r_bintang = (lo + hi) / 2",
          "fv_check = fv(r_bintang)",
          "",
          "print(\"r* =\", round(r_bintang, 6), f\"({r_bintang*100:.2f}% riil)\")",
          "print(\"fv_check =\", round(fv_check, 2))",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t2", label: "`r_bintang` = 4,2358%", name: "r_bintang", value: 0.042358, tol: 0.0005, msg: "Return objective = 4,2358% riil per tahun — DIBULATKAN 4,24% untuk IPS." },
          { kind: "equal", task: "t3", label: "`fv_check` = 20000", name: "fv_check", value: 20000.0, tol: 1.0, msg: "Verifikasi: r* memang mencapai target Rp 20.000 juta." },
        ],
      },
      quiz: [
        {
          q: "Anak dr. Ardi mendapat beasiswa penuh (target pendidikan Rp 2.000 juta hilang → FV target turun ke Rp 18.000 juta). Apa yang terjadi pada r*?",
          options: [
            { text: "r* naik — karena target lebih kecil, return harus lebih agresif", why: "Terbalik. Target lebih kecil = beban lebih ringan.", correct: false },
            { text: "r* turun — target Rp 18.000 juta butuh return lebih rendah dari aset & tabungan yang sama", why: "Benar. Return objective adalah FUNGSI dari angka kasus — berubahnya satu angka mengubah gerbangnya. Inilah kenapa IPS harus direvisi saat hidup berubah (Langkah 14).", correct: true },
            { text: "r* tetap — return objective adalah preferensi, bukan hasil hitungan", why: "Salah total — dan justru miskonsepsi yang dilawan proyek ini. r* dihitung, bukan dipilih.", correct: false },
          ],
        },
      ],
    },
  ],
};

// ── Lanjutan A: risiko, IPS, keputusan target, SAA, rebalancing, biaya ──
const LANJUTAN_IPS_A: V2Step[] = [
  {
    id: "risiko",
    eyebrow: "Langkah 5 · Analisis risiko",
    title: "Sanggup vs mau — dua hal berbeda",
    prose: [
      "Return objective 4,24% sudah di tangan. Pertanyaan berikutnya: berapa risiko yang boleh diambil untuk mencapainya? CFA memisahkan dua hal yang sering dicampuradukkan: ABILITY to take risk (kapasitas objektif — horizon, stabilitas penghasilan, kebutuhan likuiditas, leverage) dan WILLINGNESS to take risk (preferensi psikologis — seberapa nyaman klien melihat portofolionya turun).",
      "dr. Ardi: ability di atas rata-rata — horizon 15 tahun, penghasilan praktik stabil, tanpa utang konsumtif. Willingness: moderat — kuesioner risiko menunjukkan ia 'tidak nyaman jika portofolio turun lebih dari 15% dalam setahun'. Aturan profesional: toleransi keseluruhan = yang LEBIH RENDAH dari keduanya. Jadi: MODERAT. Angka 4,24% harus dicapai TANPA melampaui profil moderat — dan di sinilah kendala IPS mulai mengikat.",
    ],
    tasks: [
      { id: "t1", text: "Tuliskan 3 faktor ability dr. Ardi beserta penilaiannya (di atas/di bawah rata-rata)" },
      { id: "t2", text: "Tuliskan willingness-nya dan aturan 'ambil yang lebih rendah'" },
      { id: "t3", text: "Jawab: mengapa ability tinggi + willingness moderat = moderat, bukan 'rata-ratanya'?" },
    ],
    note: {
      title: "Miskonsepsi #2: klien kaya = boleh agresif",
      type: "pitfall",
      body: "Kekayaan menaikkan ABILITY, bukan WILLINGNESS. Klien dengan Rp 8 miliar yang panik saat turun 10% dan menjual di bawah adalah klien yang RISK TOLERANCE-nya rendah — memaksanya agresif melanggar kewajiban fidusia dan hampir pasti berakhir pada penjualan di titik terburuk. Toleransi = min(ability, willingness). Titik.",
    },
    quiz: [
      {
        q: "Seorang klien lain: ability RENDAH (pensiun 2 tahun lagi, butuh dana pasti) tapi willingness TINGGI ('saya berani ambil risiko!'). Toleransi yang benar…",
        options: [
          { text: "Tinggi — ikuti willingness klien, itu uangnya", why: "Salah dan berbahaya. Ability rendah berarti kerugiannya TIDAK BISA dipulihkan (tidak ada waktu/horizon). Mengikuti willingness di sini = malpraktik.", correct: false },
          { text: "Rendah — ability mengikat; willingness tinggi tidak menciptakan waktu yang hilang", why: "Benar. Aturan min(): toleransi = yang lebih rendah. Tugasmu justru MENGEDUKASI klien kenapa keinginannya tidak bisa dipenuhi dengan aman.", correct: true },
          { text: "Moderat — kompromi di tengah keduanya", why: "Salah — toleransi bukan rata-rata. 'Kompromi' di sini tetap melanggar batas ability.", correct: false },
        ],
      },
    ],
  },
  {
    id: "ips",
    eyebrow: "Langkah 6 · Menyusun IPS",
    title: "Lima constraints yang mengikat",
    prose: [
      "IPS dr. Ardi kini ditulis — return objective 4,24% riil, toleransi risiko MODERAT, dan lima constraints yang MENGIKAT setiap keputusan setelah ini:",
      "(1) TIME HORIZON: 15 tahun multi-stage (akumulasi 15 thn → distribusi pensiun; sub-horizon 10 thn pendidikan, 18 bulan ekspansi klinik). (2) TAX: PPh final — bunga obligasi/SBN 10%, deposito & pasar uang 20%, dividen orang pribadi 10%; LQ45 & emas dianggap bersih dalam proyek ini. Pajak dihitung SETELAH — return yang dibandingkan dengan r* adalah return after-tax. (3) LIQUIDITY: lantai aset likuid (deposito + pasar uang) — Rp 1.100 juta hingga ekspansi klinik terdanai (18 bulan), lalu Rp 400 juta dana darurat. (4) LEGAL/REGULATORY: implementasi hanya via penasihat investasi berizin OJK; produk terlarang untuk profil moderat ritel (derivatif spekulatif, leverage). (5) UNIQUE CIRCUMSTANCES: profesi dokter → risiko gugatan malpraktik → proteksi asuransi jiwa & tanggung gugat wajib sebelum alokasi agresif; tidak ada aset yang mengunci dana > 5 tahun sebelum pensiun.",
      "Perhatikan: constraints ini bukan 'catatan'. Di Langkah 8, kandidat alokasi yang melanggar SATU SAJA constraint gugur — dan di Langkah 11, inilah senjata untuk mengadili konsultan.",
    ],
    tasks: [
      { id: "t1", text: "Tuliskan lima constraints IPS dr. Ardi dengan angkanya masing-masing" },
      { id: "t2", text: "Hitung: SBN pre-tax 3,50% → after-tax = ? (PPh final 10%)" },
      { id: "t3", text: "Jawab: mengapa return yang dibandingkan dengan r* harus after-tax?" },
    ],
    note: {
      title: "Intuisi: IPS adalah konstitusi, bukan brosur",
      body: "Brosur bisa diubah tiap kuartal; konstitusi hanya diamendemen dengan prosedur. IPS yang baik membuat keputusan MASA DEPAN lebih mudah: saat pasar panik, kamu tidak bertanya 'jual atau tahan?' — kamu bertanya 'apa kata IPS?'. Konsultan di Langkah 11 akan mencoba membuatmu melanggar konstitusi ini. Jangan.",
    },
    quiz: [
      {
        q: "Deposito pre-tax 1,50% riil dengan PPh final 20%. After-tax return-nya…",
        options: [
          { text: "1,20%", why: "Benar: 1,50% × (1 − 0,20) = 1,20%. Pajak final memotong langsung dari kupon — tidak ada kompensasi.", correct: true },
          { text: "1,30%", why: "Salah hitung — 20% dari 1,50 adalah 0,30, bukan 0,20.", correct: false },
          { text: "1,50% — return riil sudah bersih dari pajak", why: "Salah. 'Riil' = sudah disesuaikan INFLASI, bukan pajak. Dua penyesuaian yang berbeda.", correct: false },
        ],
      },
    ],
  },
  {
    id: "keputusan-target",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Target minimal atau target aspirasional?",
    prose: [
      "r* = 4,24% adalah return MINIMUM agar tiga tujuan tercapai. Tetapi asumsi bisa meleset — inflasi biaya pendidikan, return terealisasi di bawah ekspektasi. Sebagian perencana menambahkan margin of safety: targetkan r* + 1pp = 5,24%.",
      "Keputusan ini tidak gratis. Target 5,24% menuntut bobot ekuitas yang lebih besar — dan kamu akan melihat di Lab 3 apa artinya itu terhadap kendala IPS. Pilih dengan sadar: angka target yang kamu tetapkan di sini menjadi gerbang untuk SEMUA kandidat alokasi.",
    ],
    tasks: [],
    decision: {
      prompt: "Target return IPS yang dipakai sebagai gerbang seleksi alokasi?",
      options: [
        {
          id: "opt-minimal",
          label: "Minimal: r* = 4,24% — sesuai hitungan, tanpa margin",
          rationale:
            "Disiplin pada angka. Risiko: jika satu asumsi meleset (tabungan turun, inflasi naik), tujuan tidak tercapai — tidak ada bantalan.",
          nextStepId: "lab-saa",
          consequenceNote:
            "Gerbang 4,24%: kandidat B (4,52%) lolos dengan margin 0,28pp. Kamu mencatat risiko asumsi di IPS dan menjadwalkan review tahunan r* — disiplin, bukan kelalaian.",
        },
        {
          id: "opt-aspirasional",
          label: "Aspirational: 5,24% — r* + 1pp margin of safety",
          rationale:
            "Bantalan terhadap asumsi yang meleset. Biaya: butuh expected return lebih tinggi → dorongan ke ekuitas lebih besar → kendala IPS makin menekan.",
          nextStepId: "lab-saa",
          consequenceNote:
            "Gerbang 5,24%: kandidat B (4,52%) GUGUR. Satu-satunya kandidat yang lolos return adalah C (5,46%) — tetapi C melanggar batas ekuitas 40% dan lantai likuiditas. Kamu baru saja membuktikan dengan angka: margin of safety yang mengabaikan kendala bukanlah kehati-hatian, melainkan angan-angan. IPS direvisi kembali ke 4,24% dengan review tahunan.",
        },
      ],
    },
  },
  {
    id: "lab-saa",
    eyebrow: "Langkah 8 · Lab 3 — Strategic Asset Allocation",
    title: "Tiga kandidat, satu yang lolos semua kendala",
    prose: [
      "Tiga kandidat SAA di atas meja (bobot SBN/deposito/pasar_uang/LQ45/emas): A Konservatif (45/15/10/25/5), B Seimbang (35/10/10/35/10), C Agresif (20/5/5/55/15). Tugasmu: hitung expected return & volatilitas masing-masing dari dataset (expected = Σ w·μ, vol = √(w′Σw)), lalu terapkan EMPAT saringan IPS: (i) tanpa short-selling, (ii) ekuitas (LQ45) ≤ 40%, (iii) likuid (deposito + pasar uang) ≥ 15%, (iv) expected return ≥ r*.",
      "Perhatikan baik-baik: kandidat yang 'return-nya paling tinggi' belum tentu pemenangnya.",
    ],
    tasks: [
      { id: "t1", text: "Hitung `exp_A`, `vol_A`, `exp_B`, `vol_B`, `exp_C`, `vol_C` dari dataset" },
      { id: "t2", text: "Terapkan 4 saringan ke tiap kandidat → `lolos_A`, `lolos_B`, `lolos_C` (boolean)" },
      { id: "t3", text: "Tentukan `pemenang` dan jelaskan MENGAPA dua lainnya gugur (spesifik: angka vs batas)" },
    ],
    expected:
      "exp_A=0,0405 vol_A=0,0471 | exp_B=0,0452 vol_B=0,0661 | exp_C=0,0546 vol_C=0,1028. lolos_A=False (4,045% < 4,2358%) | lolos_B=True | lolos_C=False (ekuitas 55% > 40%, likuid 10% < 15%). Pemenang: B.",
    hints: [
      "Expected: `(w * mu).sum()` dengan mu = mean tahunan tiap aset dari Lab 1.",
      "Vol: butuh matriks kovarians tahunan — `cov = df[ASET].cov() * 12`, lalu `vol = (w @ cov @ w) ** 0.5`.",
      "Saringan (iv) memakai r_bintang dari Lab 2 — copy nilainya (0,042358).",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "import numpy as np",
        "",
        "URL_RT = \"/proyek/pj-ips-portofolio/return_bulanan.csv\"",
        "df = pd.read_csv(open_url(URL_RT))",
        "ASET = [\"sbn\", \"deposito\", \"pasar_uang\", \"lq45\", \"emas\"]",
        "R_STAR = 0.042358",
        "",
        "mu = df[ASET].mean() * 12          # expected return tahunan",
        "cov = df[ASET].cov() * 12          # kovarians tahunan",
        "",
        "KANDIDAT = {",
        "    \"A\": [0.45, 0.15, 0.10, 0.25, 0.05],",
        "    \"B\": [0.35, 0.10, 0.10, 0.35, 0.10],",
        "    \"C\": [0.20, 0.05, 0.05, 0.55, 0.15],",
        "}",
        "",
        "# TUGASMU: lengkapi evaluasi di bawah",
        "hasil = {}",
        "for k, w in KANDIDAT.items():",
        "    wv = np.array(w)",
        "    exp = ...",
        "    vol = ...",
        "    lolos = ...   # 4 saringan: no-short (semua>=0), lq45<=0.40, (dep+pu)>=0.15, exp>=R_STAR",
        "    hasil[k] = (round(float(exp), 4), round(float(vol), 4), bool(lolos))",
        "",
        "exp_B = ...",
        "vol_B = ...",
        "lolos_A = ...",
        "lolos_C = ...",
        "pemenang = ...",
        "",
        "print(hasil)",
        "print(\"pemenang:\", pemenang)",
      ].join("\n"),
      lockLines: 14,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "import numpy as np",
        "",
        "URL_RT = \"/proyek/pj-ips-portofolio/return_bulanan.csv\"",
        "df = pd.read_csv(open_url(URL_RT))",
        "ASET = [\"sbn\", \"deposito\", \"pasar_uang\", \"lq45\", \"emas\"]",
        "R_STAR = 0.042358",
        "",
        "mu = df[ASET].mean() * 12          # expected return tahunan",
        "cov = df[ASET].cov() * 12          # kovarians tahunan",
        "",
        "KANDIDAT = {",
        "    \"A\": [0.45, 0.15, 0.10, 0.25, 0.05],",
        "    \"B\": [0.35, 0.10, 0.10, 0.35, 0.10],",
        "    \"C\": [0.20, 0.05, 0.05, 0.55, 0.15],",
        "}",
        "",
        "# TUGASMU: lengkapi evaluasi di bawah",
        "hasil = {}",
        "for k, w in KANDIDAT.items():",
        "    wv = np.array(w)",
        "    exp = float(wv @ mu.values)",
        "    vol = float(np.sqrt(wv @ cov.values @ wv))",
        "    lolos = bool((wv >= 0).all() and wv[3] <= 0.40 and (wv[1] + wv[2]) >= 0.15 and exp >= R_STAR)",
        "    hasil[k] = (round(float(exp), 4), round(float(vol), 4), bool(lolos))",
        "",
        "exp_B = float(np.array(KANDIDAT[\"B\"]) @ mu.values)",
        "vol_B = float(np.sqrt(np.array(KANDIDAT[\"B\"]) @ cov.values @ np.array(KANDIDAT[\"B\"])))",
        "lolos_A = hasil[\"A\"][2]",
        "lolos_C = hasil[\"C\"][2]",
        "pemenang = \"B\"",
        "",
        "print(hasil)",
        "print(\"pemenang:\", pemenang)",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t1", label: "`exp_B` = 4,52%", name: "exp_B", value: 0.0452, tol: 0.0005, msg: "Expected return B = 4,52% ≥ r* 4,24%." },
        { kind: "equal", task: "t1", label: "`vol_B` = 6,61%", name: "vol_B", value: 0.0661, tol: 0.002, msg: "Volatilitas B = 6,61% — harga return yang cukup." },
        { kind: "equal", task: "t2", label: "`lolos_A` = False", name: "lolos_A", value: false, msg: "A gugur di saringan return: 4,045% < 4,2358%. Konservatif yang tidak mencapai tujuan = gagal, bukan aman." },
        { kind: "equal", task: "t2", label: "`lolos_C` = False", name: "lolos_C", value: false, msg: "C gugur di saringan kendala: ekuitas 55% > 40% dan likuid 10% < 15%. Return tertinggi tidak menyelamatkannya." },
        { kind: "equal", task: "t3", label: "`pemenang` = B", name: "pemenang", value: "B", msg: "B Seimbang: satu-satunya yang lolos SEMUA saringan IPS." },
      ],
    },
    note: {
      title: "Pelajaran inti Lab 3: kendala adalah saringan, bukan saran",
      body: "A gagal bukan karena 'kurang bagus' — ia gagal karena angkanya tidak mencapai tujuan klien. C gagal bukan karena 'terlalu berisiko' secara abstrak — ia gagal pada dua batas IPS yang tertulis. SAA yang benar bukan yang return-nya tertinggi, melainkan yang LOLOS SEMUA KENDALA dengan volatilitas terendah. Inilah disiplin yang akan kamu pakai untuk mengadili konsultan.",
    },
  },
  {
    id: "rebalancing",
    eyebrow: "Langkah 9 · Rebalancing",
    title: "Disiplin saat pasar menggeser bobot",
    prose: [
      "SAA B ditetapkan: 35/10/10/35/10. Setahun kemudian LQ45 rally — bobotnya merangkak ke 42%. Tanpa rebalancing, portofoliomu diam-diam berubah menjadi 'C-lite': ekuitas di atas batas IPS 40%, profil risiko bukan lagi moderat.",
      "Skema IPS dr. Ardi: threshold ±5pp absolut per kelas aset (cek triwulanan) + kalender tahunan (rebalance penuh tiap Desember, apa pun yang terjadi). Threshold menangkap drift besar di tengah tahun; kalender menangkap drift kecil yang terakumulasi. Biaya rebalancing di IDX: komisi broker ±0,15–0,25% per sisi + slippage — kecil dibanding biaya MELANGGAR IPS.",
    ],
    tasks: [
      { id: "t1", text: "Bobot LQ45 drift ke 42% (target 35%): apakah threshold ±5pp terpicu? Tindakan apa?" },
      { id: "t2", text: "Tuliskan dua komponen skema rebalancing IPS dr. Ardi" },
      { id: "t3", text: "Jawab: mengapa 'biarkan pemenang berlari' melanggar IPS?" },
    ],
    quiz: [
      {
        q: "Akhir kuartal: bobot aktual SBN 30% (target 35%), LQ45 39% (target 35%), sisanya pas target. Menurut skema threshold ±5pp…",
        options: [
          { text: "Rebalance — LQ45 menyimpang 4pp, mendekati batas", why: "Salah — 4pp BELUM mencapai threshold 5pp. Disiplin threshold berarti tidak bertindak sebelum aturan terpicu; 'mendekati' bukan kriteria.", correct: false },
          { text: "Tidak rebalance — tidak ada kelas yang menyimpang ≥5pp; tunggu cek berikutnya atau kalender Desember", why: "Benar. Threshold adalah ATURAN, bukan firasat. 4pp < 5pp = tidak terpicu. Inilah gunanya aturan tertulis: mencegah over-trading emosional.", correct: true },
          { text: "Rebalance sebagian — kurangi LQ45 2pp saja agar 'lebih aman'", why: "Salah — 'rebalance sebagian' di luar skema IPS adalah diskresi yang tidak tercatat. Kalau aturannya threshold 5pp, patuhi; kalau ingin aturan berbeda, amendemen IPS dulu.", correct: false },
        ],
      },
    ],
  },
  {
    id: "implementasi",
    eyebrow: "Langkah 10 · Implementasi, biaya & pajak",
    title: "Return yang tersisa setelah semua potongan",
    prose: [
      "Expected return B = 4,52% adalah angka PRE-TAX dan PRE-FEE. Realitanya memotong tiga kali: (1) PAJAK — PPh final: SBN 10%, deposito & pasar uang 20%. Hitung: 0,35×3,50%×0,90 + 0,10×1,50%×0,80 + 0,10×2,20%×0,80 + 0,35×7,50% + 0,10×3,00% = 1,1025% + 0,12% + 0,176% + 2,625% + 0,30% = 4,3235% ≈ 4,32%. Masih ≥ r* 4,24% — TETAPI margin menyusut dari 0,28pp menjadi 0,08pp. Pajak bukan detail administratif; ia menggerogoti margin keamananmu. (2) FEE — reksa dana saham aktif ±2%/tahun vs ETF LQ45 ±0,2%: selisih 1,8pp per tahun, jauh lebih besar dari margin 0,08pp. Pemilihan kendaraan investasi adalah keputusan return. (3) SLIPPAGE & komisi IDX — kecil per transaksi, tetapi rebalancing yang terlalu sering menggerogotinya.",
      "Keputusan implementasi IPS dr. Ardi: porsi LQ45 via ETF berbiaya rendah (bukan reksa dana aktif 2%), SBN dibeli langsung (bukan via produk berlapis fee), rebalancing sesuai skema Langkah 9 — tidak lebih sering.",
    ],
    tasks: [
      { id: "t1", text: "Hitung after-tax expected return B dengan tangan (angka di atas) — verifikasi 4,32%" },
      { id: "t2", text: "Hitung margin keamanan pre-tax vs after-tax terhadap r*" },
      { id: "t3", text: "Jawab: mengapa selisih fee 1,8pp 'jauh lebih besar' dari margin 0,08pp itu penting?" },
    ],
    note: {
      title: "Miskonsepsi #3: fee kecil tidak masalah",
      type: "risk",
      body: "Fee 2% terdengar 'kecil' — tetapi ia dipotong dari RETURN, bukan dari aset. Dengan expected 4,52%, fee 2% memakan 44% dari return harapanmu. Margin keamanan after-tax B hanya 0,08pp: satu pilihan kendaraan yang salah (reksa dana aktif vs ETF) menghapus seluruh margin — dan membuat portofolio GAGAL mencapai tujuan. Biaya adalah return yang negatif dan pasti.",
    },
    quiz: [
      {
        q: "After-tax B = 4,32% vs r* = 4,24%. Pernyataan yang benar…",
        options: [
          { text: "Aman — 4,32% > 4,24%, margin cukup untuk semua skenario", why: "Salah — margin 0,08pp sangat tipis. Satu tahun return di bawah ekspektasi menghapusnya. Margin ini harus DIMONITOR, bukan dirayakan.", correct: false },
          { text: "Lolos tetapi rapuh — margin 0,08pp wajib dipantau; IPS harus punya pemicu review bila terealisasi di bawah ekspektasi 2 tahun beruntun", why: "Benar. Inilah fungsi monitoring (Langkah 13): angka yang 'lolos tipis' = angka yang diawasi ketat.", correct: true },
          { text: "Gagal — harus di atas r* minimal 1pp", why: "Salah — tidak ada aturan 1pp di IPS ini. Yang ada: lolos (≥ r*) + monitoring ketat karena margin tipis.", correct: false },
        ],
      },
    ],
  },
];

// ── Lanjutan B: audit konsultan, atribusi, revisi, deliverable ──────────
const LANJUTAN_IPS_B: V2Step[] = [
  {
    id: "dossier-konsultan",
    eyebrow: "Langkah 11 · Misi audit",
    title: "Membedah proposal 'konsultan'",
    prose: [
      "Map terbuka. Seorang 'konsultan independen' — sebut saja Bramantyo, PT Wira Nusa Kapital — menyodorkan satu halaman proposal ke dr. Ardi: alokasi 85% di SATU saham unggulan (BBCA), 10% dua saham lain, 5% deposito. Proyeksi return: 12% per tahun. Bahasa profesional, grafik meyakinkan, testimoni klien. dr. Ardi tergoda: '12% jauh di atas 4,24% yang kamu hitung. Kenapa tidak ini saja?'",
      "Kamu punya keunggulan yang tidak dimiliki dr. Ardi: IPS yang mengikat dengan angka, CME dari dataset, dan pemahaman bahwa return tinggi tanpa kendala bukanlah strategi — melainkan undian. Lima hal di proposal ini melanggar IPS secara TERUKUR. Temukan semuanya sebelum menjawab klien.",
    ],
    tasks: [
      { id: "t1", text: "Periksa konsentrasi: berapa % di satu nama vs batas IPS 10%?" },
      { id: "t2", text: "Periksa janji 12%: bandingkan dengan CME LQ45 dari dataset (Lab 1)" },
      { id: "t3", text: "Periksa likuiditas: berapa rupiah likuid yang tersisa vs kebutuhan Rp 1.100 jt?" },
      { id: "t4", text: "Periksa klaim pajak & kerangka risiko: apa yang hilang dari proposal?" },
    ],
    auditDossier: {
      version: "wnk-proposal-1.0",
      snapshotDate: "2026-10-16",
      intro: "Dossier proposal 'konsultan independen' (PT Wira Nusa Kapital): alokasi 85% satu saham unggulan, proyeksi return 12%/tahun. Audit terhadap IPS dr. Ardi baris per baris sebelum klien memutuskan.",
      columns: ["#", "Klaim konsultan", "Nilai", "Catatan kaki"],
      rows: [
        { rowId: 1, cells: { "#": "1", "Klaim konsultan": "Alokasi saham unggulan", "Nilai": "85% BBCA", "Catatan kaki": "Saham LQ45 paling likuid & fundamental terbaik" }, claims: [] },
        { rowId: 2, cells: { "#": "2", "Klaim konsultan": "Saham pelengkap", "Nilai": "10% (2 saham)", "Catatan kaki": "Diversifikasi antar emiten" }, claims: [] },
        { rowId: 3, cells: { "#": "3", "Klaim konsultan": "Proyeksi return", "Nilai": "12% per tahun", "Catatan kaki": "Berdasarkan kinerja 3 tahun terakhir saham unggulan" }, claims: [] },
        { rowId: 4, cells: { "#": "4", "Klaim konsultan": "Likuiditas portofolio", "Nilai": "Tetap likuid", "Catatan kaki": "Saham LQ45 sangat likuid di bursa" }, claims: [] },
        { rowId: 5, cells: { "#": "5", "Klaim konsultan": "Perlakuan pajak", "Nilai": "Sudah termasuk", "Catatan kaki": "Proyeksi dihitung sebelum pajak final" }, claims: [] },
        { rowId: 6, cells: { "#": "6", "Klaim konsultan": "Manajemen risiko", "Nilai": "Stop-loss 10%", "Catatan kaki": "Stop-loss menggantikan kebutuhan diversifikasi" }, claims: [] }
      ],
      injections: [
        { key: "I1", rowIds: [1, 2], title: "Konsentrasi 85% di satu nama", clue: "Baris 1–2 — 85% BBCA vs batas IPS single-name 10%: 8,5× lipat. Total ekuitas 95% vs batas kelas 40%. 'Diversifikasi antar emiten' dengan 10% di dua saham adalah kosmetik.", danger: "Pelanggaran concentration constraint yang terukur: satu nama = satu titik kegagalan. Tidak ada return yang membenarkan pelanggaran batas tertulis — batas ada justru untuk menahan godaan seperti ini." },
        { key: "I2", rowIds: [3], title: "Janji 12% di atas CME", clue: "Baris 3 — 12% vs CME LQ45 dari dataset: 7,50% riil. Proyeksi diambil dari '3 tahun terakhir' — jendela yang dipilih karena hasilnya bagus (cherry-picking periode).", danger: "Proyeksi tanpa basis CME = angka pemasaran. Aturan: setiap proyeksi return HARUS bisa ditelusur ke capital market expectations yang diaudit (Lab 1). 12% − 7,50% = 4,5pp 'keajaiban' yang tidak dijelaskan dari mana datangnya." },
        { key: "I3", rowIds: [4], title: "'Likuid' yang tidak bisa membayar tagihan", clue: "Baris 4 — likuid (deposito) hanya 5% × Rp 8.000 jt = Rp 400 jt, vs kebutuhan Rp 1.100 jt (darurat 300 + ekspansi klinik 800 dalam 18 bulan). 'Saham likuid di bursa' ≠ kas yang tersedia: menjual 85% posisi terkonsentrasi di bawah tekanan = crystallizing loss + melanggar batas single-name saat menjual sebagian.", danger: "Pelanggaran liquidity constraint yang terukur: defisit Rp 700 jt. Likuiditas diukur dari KEBUTUHAN KLIEN (kapan & berapa), bukan dari volume perdagangan bursa." },
        { key: "I4", rowIds: [5], title: "Pajak: 'sudah termasuk' yang dihitung sebelum pajak", clue: "Baris 5 — catatan kaki mengaku 'dihitung sebelum pajak final' sementara klaimnya 'sudah termasuk'. Kontradiksi internal: proyeksi 12% adalah pre-tax.", danger: "Ketidakjujuran presentasi: klaim dan catatan kakinya bertentangan. Pelajaran abadi: baca catatan kaki DULU — di situlah kebenaran disembunyikan. (Catatan: bahkan after-tax ±11,3% pun tetap melanggar I1–I3 — pajak bukan masalah utamanya.)" },
        { key: "I5", rowIds: [6], title: "Stop-loss sebagai pengganti diversifikasi", clue: "Baris 6 — stop-loss 10% pada posisi terkonsentrasi 85% = whipsaw yang dijamin: volatilitas LQ45 18% membuat stop-loss 10% tersentuh oleh noise normal, mengunci kerugian berulang. Tidak ada skema rebalancing, tidak ada kriteria evaluasi.", danger: "Manajemen risiko palsu: stop-loss mengelola SATU posisi, bukan PORTOFOLIO. Risiko portofolio dikelola via diversifikasi + batas IPS + rebalancing (Langkah 9) — bukan via order jual otomatis." }
      ],
    },
  },
  {
    id: "keputusan-konsultan",
    eyebrow: "Langkah 12 · Checkpoint keputusan",
    title: "Tolak, atau minta revisi bersyarat?",
    prose: [
      "Lima pelanggaran terukur ada di mejamu. dr. Ardi masih menatap angka 12% itu. Keputusanmu sekarang bukan soal angka — soal SIKAP PROFESIONAL: bagaimana menolak (atau mengondisikan) proposal yang melanggar IPS, di depan klien yang tergoda?",
      "Dua respons sama-sama profesional — tetapi membawa konsekuensi yang berbeda.",
    ],
    tasks: [],
    decision: {
      prompt: "Bagaimana kamu merespons proposal konsultan di depan dr. Ardi?",
      options: [
        {
          id: "opt-tolak",
          label: "Tolak & dokumentasikan — lima pelanggaran vs IPS, tertulis",
          rationale:
            "Penolakan formal dengan memo: tiap pelanggaran dirujuk ke pasal IPS + angka. Klien mendapat penjelasan kenapa 12% tidak relevan bila kendalanya dilanggar.",
          nextStepId: "lab-atribusi",
          consequenceNote:
            "dr. Ardi awalnya kecewa — 'tapi 12%…'. Kamu tunjukkan perhitungannya: 85% vs batas 10%, defisit likuiditas Rp 700 jt, 12% vs CME 7,50%. Ia mengerti — dan untuk pertama kalinya MEMAHAMI kenapa IPS ada. Kepercayaan naik justru karena kamu menolak uang yang 'mudah'. Memo penolakanmu menjadi lampiran IPS.",
        },
        {
          id: "opt-revisi",
          label: "Minta revisi dengan syarat IPS — 'boleh, jika lolos semua kendala'",
          rationale:
            "Beri kesempatan: proposal boleh diajukan ulang ASALKAN single-name ≤ 10%, ekuitas ≤ 40%, likuid ≥ Rp 1.100 jt, proyeksi berbasis CME. Syarat tertulis, tidak bisa ditawar.",
          nextStepId: "lab-atribusi",
          consequenceNote:
            "Konsultan tidak pernah kembali dengan revisi — karena proposalnya memang tidak bisa memenuhi syarat itu tanpa menjadi 'kandidat B yang membosankan'. Ketidakhadirannya adalah konfirmasi: proposal awal memang tidak dirancang untuk lolos IPS. dr. Ardi melihatnya sendiri. Syarat tertulismu menjadi filter yang bekerja bahkan saat kamu tidak ada.",
        },
      ],
    },
  },
  {
    id: "lab-atribusi",
    eyebrow: "Langkah 13 · Lab 4 — Atribusi & monitoring",
    title: "Siapa yang pantas dapat kredit — dan siapa yang disalahkan",
    prose: [
      "Setahun berjalan. Q1 2026: portofolio +2,500%, benchmark (SAA B) +2,235%. Excess +0,265%. Pertanyaan klien: 'bagus — tapi KENAPA bagus? Keputusan mana yang berhasil?' Atribusi Brinson memecahnya menjadi tiga — dari `atribusi.csv` (bobot & return per kelas, kuartalan, desimal):",
      "Allocation = Σ(w_p − w_b)·(r_b_kelas − r_b_total) — efek pilihan BOBOT. Selection = Σ w_b·(r_p_kelas − r_b_kelas) — efek pilihan SEKURITAS. Interaction = Σ(w_p − w_b)·(r_p_kelas − r_b_kelas) — gabungan keduanya. Total ketiganya HARUS = excess return.",
      "Monitoring IPS dr. Ardi: atribusi tiap kuartal; pemicu review = excess negatif 2 kuartal beruntun ATAU satu kelas menyimpang dari ekspektasi > 1pp — bukan panik tiap minggu.",
    ],
    tasks: [
      { id: "t1", text: "Hitung `r_bench`, `r_port`, `excess` (desimal)" },
      { id: "t2", text: "Hitung `alloc`, `selec`, `inter` (desimal) dengan rumus Brinson" },
      { id: "t3", text: "Verifikasi `alloc + selec + inter == excess`; nyatakan dalam persen" },
    ],
    expected:
      "bench=2,235% port=2,500% excess=+0,265% = alloc +0,285% + selec +0,040% + inter −0,060%",
    hints: [
      "r_bench = Σ w_benchmark × r_benchmark; r_port = Σ w_portfolio × r_portfolio.",
      "allocation per kelas = (w_p − w_b) × (r_b_kelas − r_bench). Jumlahkan.",
      "selection per kelas = w_b × (r_p_kelas − r_b_kelas). interaction = (w_p − w_b) × (r_p_kelas − r_b_kelas).",
      "Cetak dalam persen (×100) agar mudah dibaca.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL_AT = \"/proyek/pj-ips-portofolio/atribusi.csv\"",
        "a = pd.read_csv(open_url(URL_AT))",
        "",
        "# TUGASMU: lengkapi perhitungan Brinson di bawah (desimal)",
        "r_bench = ...",
        "r_port = ...",
        "excess = ...",
        "",
        "alloc = ...    # Σ (w_p - w_b) * (r_b_kelas - r_bench)",
        "selec = ...    # Σ w_b * (r_p_kelas - r_b_kelas)",
        "inter = ...    # Σ (w_p - w_b) * (r_p_kelas - r_b_kelas)",
        "",
        "print(f\"bench {r_bench*100:.3f}% | port {r_port*100:.3f}% | excess {excess*100:.3f}%\")",
        "print(f\"alloc {alloc*100:.4f}% | selec {selec*100:.4f}% | inter {inter*100:.4f}%\")",
        "print(\"jumlah =\", round((alloc+selec+inter)*100, 4), \"% — cocok dengan excess:\", abs((alloc+selec+inter)-excess) < 1e-12)",
      ].join("\n"),
      lockLines: 4,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL_AT = \"/proyek/pj-ips-portofolio/atribusi.csv\"",
        "a = pd.read_csv(open_url(URL_AT))",
        "",
        "# TUGASMU: lengkapi perhitungan Brinson di bawah (desimal)",
        "wp, wb = a[\"w_portfolio\"], a[\"w_benchmark\"]",
        "rp, rbk = a[\"r_portfolio\"], a[\"r_benchmark\"]",
        "r_bench = float((wb * rbk).sum())",
        "r_port = float((wp * rp).sum())",
        "excess = r_port - r_bench",
        "",
        "alloc = float(((wp - wb) * (rbk - r_bench)).sum())",
        "selec = float((wb * (rp - rbk)).sum())",
        "inter = float(((wp - wb) * (rp - rbk)).sum())",
        "",
        "print(f\"bench {r_bench*100:.3f}% | port {r_port*100:.3f}% | excess {excess*100:.3f}%\")",
        "print(f\"alloc {alloc*100:.4f}% | selec {selec*100:.4f}% | inter {inter*100:.4f}%\")",
        "print(\"jumlah =\", round((alloc+selec+inter)*100, 4), \"% — cocok dengan excess:\", abs((alloc+selec+inter)-excess) < 1e-12)",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t1", label: "`excess` = +0,265%", name: "excess", value: 0.00265, tol: 0.00005, msg: "Excess return Q1 2026 = +0,265% (2,500% − 2,235%)." },
        { kind: "equal", task: "t2", label: "`alloc` = +0,285%", name: "alloc", value: 0.00285, tol: 0.00005, msg: "Allocation +0,285% — overweight saham saat kelasnya outperform." },
        { kind: "equal", task: "t2", label: "`selec` = +0,040%", name: "selec", value: 0.0004, tol: 0.00005, msg: "Selection +0,040% — pilihan sekuritas sedikit di atas benchmark kelasnya." },
        { kind: "equal", task: "t2", label: "`inter` = −0,060%", name: "inter", value: -0.0006, tol: 0.00005, msg: "Interaction −0,060% — overweight di kelas yang selection-nya negatif." },
        { kind: "equal", task: "t3", label: "jumlah = excess", name: "excess", value: 0.00285 + 0.0004 - 0.0006, tol: 0.00001, msg: "0,285 + 0,040 − 0,060 = 0,265 — atribusi bersifat aditif dan terekonsiliasi." },
      ],
    },
    quiz: [
      {
        q: "Allocation positif +0,285% tetapi selection obligasi negatif. Keputusan yang benar untuk klien…",
        options: [
          { text: "Naikkan bobot saham lagi — allocation terbukti berhasil", why: "Salah — allocation Q1 yang bagus tidak mengubah SAA jangka panjang. Mengejar hasil kuartalan = performance chasing, melanggar disiplin IPS.", correct: false },
          { text: "Pertahankan SAA; investigasi selection obligasi (manajer/produk apa yang underperform) sebagai bahan review rutin", why: "Benar. Atribusi bukan alat market-timing — ia alat DIAGNOSIS: allocation menjawab 'apakah bobotnya tepat', selection menjawab 'apakah implementasinya bekerja'. Keduanya dievaluasi terhadap IPS, bukan diperdagangkan.", correct: true },
          { text: "Ganti benchmark agar excess terlihat lebih besar", why: "Salah — itu manipulasi yang sama kelasnya dengan vendor SentinelAML di proyek lain: mengubah penggaris agar terlihat bagus.", correct: false },
        ],
      },
    ],
  },
  {
    id: "revisi",
    eyebrow: "Langkah 14 · Kasus lanjutan",
    title: "Hidup berubah — IPS direvisi",
    prose: [
      "Tahun ke-3. Dua kabar: (1) anak dr. Ardi mendapat beasiswa penuh — target pendidikan Rp 2.000 juta HILANG, FV target turun ke Rp 18.000 juta; (2) ekspansi klinik dimajukan — kebutuhan Rp 800 juta jatuh tempo 6 bulan lagi, bukan 18 bulan. IPS bukan dokumen mati: CFA mewajibkan review berkala DAN saat terjadi perubahan material.",
      "Dampaknya terukur. FV 18.000 → r* turun (hitung ulang di kepalamu: beban lebih ringan = return minimum lebih rendah). Artinya: kandidat A yang dulu gugur (4,045% < 4,24%) MUNGKIN kini lolos — portofolio bisa digeser lebih konservatif dengan volatilitas lebih rendah. Likuiditas: lantai Rp 1.100 juta kini jatuh tempo 6 bulan — cek triwulanan berikutnya menjadi kritis; threshold rebalancing tetap, tetapi kalender diperketat.",
      "Revisi IPS yang benar: ubah ANGKA (r*, lantai likuiditas, horizon sub-tujuan), catat ALASAN & TANGGAL amendemen, dan komunikasikan ke klien — bukan diam-diam menggeser alokasi.",
    ],
    tasks: [
      { id: "t1", text: "Tuliskan dua perubahan material dan komponen IPS mana yang berubah untuk masing-masing" },
      { id: "t2", text: "Jawab: mengapa hilangnya target pendidikan bisa MEMBUAT portofolio lebih konservatif (bukan lebih agresif)?" },
      { id: "t3", text: "Tuliskan prosedur amendemen IPS yang benar (3 langkah)" },
    ],
    quiz: [
      {
        q: "Setelah beasiswa, r* turun. Manajer mengusulkan: 'target turun, jadi kita bisa ambil risiko LEBIH untuk return lebih tinggi.' Respons yang benar…",
        options: [
          { text: "Setuju — mumpung beban ringan, maksimalkan return", why: "Salah — tujuan IPS adalah MENCAPAI TUJUAN dengan risiko minimum, bukan memaksimalkan return. Beban ringan = boleh lebih konservatif, bukan alasan berjudi.", correct: false },
          { text: "Tolak — revisi justru membuka opsi menurunkan risiko (kandidat A kini mungkin lolos) karena tujuan tercapai dengan return lebih rendah", why: "Benar. Prinsip CFA: ambil risiko HANYA sebesar yang dibutuhkan tujuan. Kelebihan risk budget bukan undangan berjudi — ia adalah ketenangan yang dibeli.", correct: true },
          { text: "Tunda keputusan sampai pasar membaik", why: "Salah — revisi IPS dipicu PERUBAHAN KLIEN, bukan kondisi pasar. Menunda = membiarkan IPS usang mengatur portofolio.", correct: false },
        ],
      },
    ],
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 15 · Deliverable",
    title: "Memo IPS untuk dr. Ardi",
    prose: [
      "Semua angka sudah di tangan: r* 4,24% yang dihitung, toleransi moderat, lima constraints, SAA B yang lolos semua saringan, after-tax 4,32% dengan margin 0,08pp, skema rebalancing, lima pelanggaran konsultan yang terdokumentasi, atribusi Q1, dan prosedur revisi. Sekarang ubah menjadi SATU dokumen yang dibaca klien dan bisa dipertahankan di depan komite: memo IPS + rekomendasi.",
      "Memo yang baik menjawab: berapa yang dibutuhkan (dan bagaimana dihitung), batas mana yang tidak bisa dinegosiasi, alokasi apa yang dipilih (dan mengapa yang lain gugur), berapa yang tersisa setelah pajak & fee, bagaimana perilakunya dijaga (rebalancing + monitoring), dan mengapa proposal 12% ditolak.",
    ],
    tasks: [
      { id: "t1", text: "Tulis memo IPS ≤ 3 halaman mengikuti template" },
      { id: "t2", text: "Cantumkan angka kunci: r*, CME, SAA B (exp/vol/after-tax), margin keamanan" },
      { id: "t3", text: "Tulis penolakan proposal konsultan (5 pelanggaran + rujukan pasal IPS)" },
      { id: "t4", text: "Tulis skema monitoring & pemicu revisi" },
    ],
    deliverable: {
      template: [
        "PARAGRAF 1 — KLIEN & TUJUAN: profil dr. Ardi (45 thn, horizon 15 thn), tiga tujuan + target rupiah, tenggat likuiditas 18 bulan. Return objective r* = 4,24% riil — TAMPILKAN perhitungannya (PV 8.000 + PMT 250 × 15 thn → FV 20.000), bukan angkanya saja.",
        "PARAGRAF 2 — RISIKO & CONSTRAINTS: ability (di atas rata-rata) vs willingness (moderat) → toleransi MODERAT; lima constraints dengan angkanya (horizon, pajak PPh final, likuiditas Rp 1.100 jt → 400 jt, legal OJK, unique: proteksi malpraktik).",
        "PARAGRAF 3 — ALOKASI: CME dari dataset (tabel 5 aset), tiga kandidat + hasil saringan (A gugur return 4,045% < 4,24%; C gugur ekuitas 55% & likuid 10%; B lolos semua: exp 4,52%/vol 6,61%), after-tax B 4,32% vs r* (margin 0,08pp — rapuh, dimonitor).",
        "PARAGRAF 4 — PENOLAKAN KONSULTAN: 5 pelanggaran terukur (konsentrasi 85% vs 10%; janji 12% vs CME 7,50%; likuiditas defisit Rp 700 jt; pajak pre-tax; stop-loss ≠ diversifikasi) + rujukan pasal IPS tiap pelanggaran.",
        "PARAGRAF 5 — DISIPLIN BERJALAN: rebalancing (threshold ±5pp + kalender Desember), monitoring (atribusi kuartalan; pemicu review: excess negatif 2 kuartal / deviasi kelas > 1pp), prosedur amendemen IPS saat perubahan material (contoh: beasiswa → r* turun → opsi konservatif).",
      ],
      rubric: [
        { criterion: "Return objective terhitung & terverifikasi", weight: 25, levels: ["Angka ditempel tanpa hitungan", "Perhitungan ada tetapi tidak terverifikasi", "PV/PMT/horizon/target → r* 4,24% ditampilkan lengkap & bisa direproduksi"] },
        { criterion: "Constraints mengikat & dipakai menyaring", weight: 25, levels: ["Constraints generik tanpa angka", "Lima constraints ada tetapi tidak dipakai menyeleksi", "Lima constraints berangka; A & C digugurkan dengan rujukan spesifik"] },
        { criterion: "Audit konsultan: 5 pelanggaran terukur", weight: 25, levels: ["Penolakan tanpa alasan angka", "Sebagian pelanggaran tanpa rujukan IPS", "5 pelanggaran teridentifikasi + rujukan pasal IPS + rekomendasi tertulis"] },
        { criterion: "Disiplin berjalan: rebalancing, monitoring, revisi", weight: 25, levels: ["Tidak ada skema lanjutan", "Skema disebut tanpa pemicu konkret", "Threshold + kalender + pemicu review kuantitatif + prosedur amendemen"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 16 · Debrief",
    title: "Ground truth dibuka — dan cermin untuk angkamu sendiri",
    prose: [
      "Lima pelanggaran konsultan tadi — semuanya versi 'profesional' dari jebakan yang sudah kamu hadapi sendiri di proyek ini:",
      "I1 — Konsentrasi 85% di satu nama vs batas IPS 10%: 8,5× lipat. Tidak ada return yang membenarkan pelanggaran batas tertulis.",
      "I2 — Janji 12% vs CME 7,50% dari dataset: 4,5pp 'keajaiban' tanpa basis. Setiap proyeksi harus bisa ditelusur ke ekspektasi pasar yang diaudit.",
      "I3 — 'Tetap likuid' dengan Rp 400 jt vs kebutuhan Rp 1.100 jt: defisit Rp 700 jt. Likuiditas diukur dari kebutuhan klien, bukan volume bursa.",
      "I4 — 'Sudah termasuk pajak' yang dihitung pre-tax: baca catatan kaki DULU. (Dan bahkan after-tax pun tetap melanggar I1–I3.)",
      "I5 — Stop-loss 10% sebagai 'pengganti diversifikasi': whipsaw yang dijamin pada vol 18%. Risiko portofolio dikelola via batas + rebalancing, bukan order jual.",
      "Dan cerminnya — untuk angkamu SENDIRI: r* 4,24%, SAA B, atribusi Q1 — semuanya angka LAB dari dataset sintetis. Mereka membuktikan metodologimu bekerja, bukan bahwa portofolio nyata aman. Ground truth proyek ini: r* = 4,2358%; SAA B (exp 4,52%, vol 6,61%, after-tax 4,32%); Brinson Q1: +0,285% / +0,040% / −0,060% = +0,265%. Angka-angka ini benar — dan di dunia nyata harus dihitung ulang setiap kali hidup klien berubah, karena IPS yang usang adalah IPS yang berbohong.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #4: return tinggi = proposal bagus",
      type: "risk",
      body: "Proposal 12% dan SAA B 4,52% — yang pertama 'menang' jika yang dinilai hanya angkanya. Tetapi investasi profesional tidak menilai angka return sendirian: ia menilai return TERHADAP tujuan (r*), TERHADAP kendala (IPS), dan SETELAH pajak & biaya. 12% yang melanggar lima constraint bukanlah 'peluang yang terlewat' — ia adalah risiko yang ditolak dengan benar. Di kariermu, setiap kali seseorang menyodorkan return tinggi, pertanyaan pertamamu selalu sama: 'dengan kendala apa angka ini dihitung?'",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 17 · Rangkuman",
    title: "Yang kamu bawa pulang",
    prose: [],
    tasks: [],
    summary: [
      "Return objective DIHITUNG dari angka kasus: PV 8.000 + PMT 250 × 15 tahun → FV 20.000 memberi r* = 4,24% riil. Angka ini menjadi gerbang IPS — bukan preferensi.",
      "Toleransi risiko = min(ability, willingness): dr. Ardi di atas rata-rata secara kapasitas tetapi moderat secara kemauan → MODERAT. Kekayaan tidak otomatis = agresif.",
      "Lima constraints mengikat: horizon 15 thn multi-stage, pajak PPh final (SBN 10%, deposito & pasar uang 20%), likuiditas Rp 1.100 jt → 400 jt, legal (OJK), unique (proteksi malpraktik).",
      "SAA = saringan kendala, bukan kontes return: A gugur (4,045% < 4,24%), C gugur (ekuitas 55% > 40%, likuid 10% < 15%), B lolos semua (exp 4,52%, vol 6,61%). After-tax B 4,32% vs r* — margin 0,08pp yang rapuh dan harus dimonitor.",
      "Rebalancing = threshold ±5pp (triwulanan) + kalender Desember. Biaya: fee 2% vs 0,2% ETF = selisih yang menghapus margin; pajak & fee adalah return negatif yang pasti.",
      "Audit konsultan menemukan 5 pelanggaran terukur: konsentrasi 8,5× batas, janji 12% vs CME 7,50%, defisit likuiditas Rp 700 jt, pajak pre-tax, stop-loss ≠ diversifikasi.",
      "Atribusi Brinson Q1: +0,265% = allocation +0,285% + selection +0,040% + interaction −0,060% — diagnosis, bukan alat market-timing.",
      "IPS hidup: beasiswa (FV → 18.000) menurunkan r* dan membuka opsi konservatif; amendemen tercatat dengan alasan & tanggal — IPS usang = IPS berbohong.",
      "Deliverable-mu: memo IPS ≤ 3 halaman (perhitungan r*, constraints berangka, saringan SAA, penolakan konsultan berpasal, disiplin berjalan) — dokumen yang siap dibaca klien dan dipertahankan di depan komite.",
    ],
  },
];

(pjIpsPortofolio.steps as V2Step[]).push(...LANJUTAN_IPS_A, ...LANJUTAN_IPS_B);
