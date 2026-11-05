import type { V2Mission } from "../lib/types";

// ── MISI Kehancuran Penjudi ──────────────────────────────────────────────
// M2 — Probabilitas Misi B (edge). Dataset SINTETIS 100% (seed 42):
// Monte Carlo risk-of-ruin — trader ber-edge (p=0,55, payoff 1:1) bertaruh
// fraksi f dari modal; ruin = modal < 50, sukses = modal >= 200.
// 7 fraksi × 2000 path. File: public/misi/misi-kehancuran-penjudi/
// kurva_ruin.csv + METODE.md.

const BASE = "/misi/misi-kehancuran-penjudi";

export const misiKehancuranPenjudi: V2Mission = {
  slug: "misi-kehancuran-penjudi",
  track: "Probabilitas",
  module: "Misi",
  title: "Misi Kehancuran Penjudi",
  estMinutes: 130,
  role: "Analis risiko desk trading",
  client:
    "Head of Trading — trader bintang menuntut ukuran posisi 25% per trade bermodal “win rate 55%”; kamu diminta mensimulasikan peluang kehancurannya sebelum komite menyetujui limit",
  xp: 550,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Strategi yang menang, desk yang mati",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis risiko desk trading — penjaga batas kehancuran",
        client:
          "Head of Trading. Raka, trader bintang desk, menuntut ukuran posisi 25% dari modal per trade. Senjatanya: strategi “win rate 55%, expectancy positif” plus laporan backtest 6 bulan yang mulus. Komite menolak menaikkan limit tanpa angka independen. Kamu diminta satu hal: simulasikan — berapa peluang desk ini hancur SEBELUM modalnya dua kali lipat?",
        story: [
          "Jumat, 16:30. Raka meletakkan laporan backtest di meja Head of Trading: win rate 55%, max drawdown cuma 8%, kurva ekuitas menanjak seperti tangga. “Strategi saya punya edge,” katanya. “Yang membatasi profit cuma ukuran posisi. Kasih saya 25% per trade.” Head of Trading melirikmu. Kamu tahu apa yang tidak tertulis di laporan itu: tidak ada satu pun simulasi kehancuran.",
          "Kamu tahu rumusnya — fraksi Kelly untuk win rate 55% dengan payoff 1:1 adalah 10%. Raka menuntut 25%: dua setengah kali lipat dari “optimal”. Pertanyaannya bukan apakah strateginya bagus — edge-nya nyata. Pertanyaannya: apakah edge yang nyata bisa tetap membunuh desk bila ukurannya sembrono?",
          "Twist-nya akan kamu temukan sendiri di Lab 1 — dan ia lebih gelap dari dugaanmu: bahkan fraksi Kelly yang “optimal” pun menghancurkan 1 dari 3 desk dalam simulasi. Misi ini memberimu mesin Monte Carlo dengan parameter yang diketahui persis, supaya kamu bisa membuktikan di mana tepatnya laporan Raka berbohong.",
        ],
        objectives: [
          "Menjalankan simulasi Monte Carlo risk-of-ruin (2000 path per fraksi) dan mengukur peluang kehancuran vs ukuran posisi.",
          "Menghitung fraksi Kelly teoritis dan menjelaskan mengapa “optimal untuk pertumbuhan” TIDAK sama dengan “aman dari kehancuran”.",
          "Menemukan minimal 3 manipulasi di laporan backtest Raka dan menulis memo position sizing yang dipertahankan dengan angka.",
        ],
        prereqSummary:
          "Risk of ruin = peluang modal menyentuh batas stop-loss SEBELUM mencapai target. Dengan edge (peluang menang di atas 50%), taruhan kecil nyaris pasti mencapai target; taruhan besar bisa hancur meski edge-nya nyata — karena kekalahan beruntun memotong modal secara berganda. Fraksi Kelly (f* = p − q untuk payoff 1:1) memaksimalkan LAJU PERTUMBUHAN jangka panjang, bukan meminimalkan peluang hancur. Yang penting di sini bukan rumusnya, melainkan intuisinya: yang membunuh penjudi bukan strategi yang kalah — melainkan ukuran taruhan yang salah pada strategi yang menang.",
        datasetNote:
          "Dataset misi ini SINTETIS 100% — hasil simulasi Monte Carlo (seed 42), BUKAN riwayat trading nyata.\nParameter diketahui persis: peluang menang 0,55, payoff 1:1, modal awal 100, ruin bila modal < 50 (stop-loss desk), sukses bila modal ≥ 200, maks 2000 trade per path, 2000 path per fraksi (file kurva_ruin.csv: 7 fraksi 0,02–0,30).\nFungsi simulasi di generator IDENTIK dengan kode solusi Lab 1 — kamu bisa mereplikasi setiap angka. Metode: file METODE.md di folder yang sama.\nKejujuran: pasar nyata tidak punya peluang menang konstan; biaya dan slippage diabaikan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tujuh fraksi, tujuh nasib",
      prose: [
        "`kurva_ruin.csv` adalah ringkasan 14.000 nasib simulasi: 7 fraksi taruhan × 2000 path. Tiap baris menjawab: dari 2000 desk yang bertaruh sebesar fraksi f di tiap trade, berapa yang hancur (modal < 50), berapa yang sukses (modal ≥ 200), dan berapa median modal akhirnya.",
        "Aturan main: (1) ruin didefinisikan sebagai stop-loss desk — di dunia nyata, ini titik di mana risk manager menarik steker, bukan kebangkrutan harfiah; (2) satu path berhenti begitu menyentuh ruin atau target; (3) vonis “ukuran ini aman/berbahaya” diambil dari peluang ruin, bukan dari profit rata-rata.",
        "Sebelum lab, lihat kolom `prob_ruin` baik-baik. Ada satu baris di mana median modal akhirnya di bawah 50 — artinya jalur TENGAH (bukan jalur sial) dari strategi itu adalah kehancuran. Temukan baris itu.",
      ],
      tasks: [
        { id: "t1", text: "Buka `kurva_ruin.csv`: catat kolom dan 7 nilai fraksi" },
        { id: "t2", text: "Bandingkan `prob_ruin` f=0,02 vs f=0,25 — dan temukan fraksi di mana median modal akhir < 50" },
      ],
      note: {
        title: "Miskonsepsi #1: expectancy positif = tidak mungkin bangkrut",
        type: "pitfall",
        body: "“Expectancy per trade positif, jadi dalam jangka panjang pasti profit.” SALAH — dan ini kekeliruan yang menenggelamkan banyak desk. Expectancy menjawab “rata-rata ke mana”, ruin menjawab “berapa peluang mati di jalan”. Pada f=0,25, expectancy per trade TETAP positif — dan 55% path tetap hancur. Rata-rata tidak bisa menyelamatkanmu bila kamu tidak bertahan cukup lama untuk melihatnya.",
      },
      reference:
        "kurva_ruin.csv (7 baris ringkasan, SINTETIS seed 42) vs laporan backtest Raka. Kebenaran dari simulasi; vonis untuk yang diklaim.",
    },
    {
      id: "lab-montecarlo",
      eyebrow: "Langkah 3 · Lab 1 — Mesin kehancuran",
      title: "Replikasi 4.000 nasib dalam sekali jalan",
      prose: [
        "Sekarang jalankan sendiri mesinnya. Fungsi `simulasi(f)` sudah disediakan — ia melempar 2000 path, tiap path bertaruh fraksi f dari modal berjalan, menang dengan peluang 0,55, dan berhenti di ruin (< 50) atau target (≥ 200). Tugasmu: hitung fraksi Kelly teoritis, lalu ukur peluang ruin dan median modal akhir untuk tiga ukuran — setengah-Kelly (0,05), Kelly penuh (0,10), dan tuntutan Raka (0,25).",
        "Rumus Kelly untuk payoff 1:1 sesederhana p − q. Tapi perhatikan baik-baik hasil simulasinya — di situlah twist misi ini bersembunyi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kelly_teoritis` dari P_MENANG" },
        { id: "t2", text: "Jalankan `ringkasan(0.05)`, `ringkasan(0.10)`, `ringkasan(0.25)` — catat peluang ruin tiap fraksi" },
        { id: "t3", text: "Bandingkan median modal akhir: fraksi mana yang jalur tengahnya MATI?" },
      ],
      expected:
        "Kelly teoritis 10%. f=0,05 → ruin 10,15%, median 204,01. f=0,10 → ruin 33,15%, median 203,85. f=0,25 → ruin 54,95%, median 49,44 (jalur median MATI). Bahkan fraksi “optimal” menghancurkan 1 dari 3 desk.",
      formula: String.raw`f^* = p - q = 0.55 - 0.45 = 0.10`,
      formulaNote:
        "f* = fraksi Kelly: ukuran taruhan yang memaksimalkan LAJU PERTUMBUHAN modal jangka panjang. p = peluang menang (0,55); q = 1 − p (0,45). Rumus p − q berlaku untuk payoff 1:1. Catatan penting: rumus ini TIDAK memasukkan batas ruin — ia mengasumsikan kamu bisa bertahan selamanya. Itulah jebakannya.",
      note: {
        title: "Miskonsepsi #2: Kelly = ukuran yang aman",
        type: "pitfall",
        body: "“Pakai Kelly dong, itu kan optimal.” Optimal untuk APA? Kelly memaksimalkan pertumbuhan — dengan mengorbankan keselamatan. Pada f=0,10 (Kelly penuh), 33% path hancur SEBELUM mencapai target. Setengah-Kelly (0,05) memangkas ruin ke 10% dengan pertumbuhan median yang nyaris sama (204 vs 203). Pelajaran profesional: ukuran posisi dipilih dari BATAS RUIN yang bisa diterima, bukan dari rumus pertumbuhan.",
      },
      hints: [
        "Kelly teoritis: `kelly_teoritis = P_MENANG - (1 - P_MENANG)` — satu baris.",
        "`ringkasan(f)` mengembalikan (prob_ruin, median_modal): `prob_ruin_10, median_modal_10 = ringkasan(0.10)`.",
        "Tiap `ringkasan` menjalankan 2000 path × maks 2000 trade — butuh beberapa detik. Tunggu hingga output muncul.",
        "Seed 42 di dalam fungsi membuat hasilmu DETERMINISTIK — angka yang keluar harus sama persis dengan kurva_ruin.csv.",
      ],
      code: {
        starter: [
          "import numpy as np",
          "",
          "P_MENANG = 0.55",
          "MODAL_AWAL = 100.0",
          "BATAS_RUIN = 50.0",
          "TARGET = 200.0",
          "",
          "def simulasi(f, n_path=2000, t_max=2000, seed=42):",
          "    rng = np.random.default_rng(seed)",
          "    modal = np.full(n_path, MODAL_AWAL)",
          "    aktif = np.ones(n_path, dtype=bool)",
          "    status = np.full(n_path, \"bertahan\")",
          "    for _ in range(t_max):",
          "        if not aktif.any():",
          "            break",
          "        idx = np.flatnonzero(aktif)",
          "        menang = rng.random(idx.size) < P_MENANG",
          "        taruhan = f * modal[idx]",
          "        modal[idx] += np.where(menang, taruhan, -taruhan)",
          "        kena_ruin = modal[idx] < BATAS_RUIN",
          "        kena_target = modal[idx] >= TARGET",
          "        status[idx[kena_ruin]] = \"ruin\"",
          "        status[idx[kena_target]] = \"sukses\"",
          "        aktif[idx[kena_ruin | kena_target]] = False",
          "    return modal, status",
          "",
          "def ringkasan(f):",
          "    modal, status = simulasi(f)",
          "    prob_ruin = (status == \"ruin\").mean()",
          "    median_modal = float(np.median(modal))",
          "    return prob_ruin, median_modal",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "kelly_teoritis = ...                       # fraksi Kelly untuk p=0.55, payoff 1:1",
          "prob_ruin_05, median_modal_05 = ...         # ringkasan(0.05) — setengah Kelly",
          "prob_ruin_10, median_modal_10 = ...         # ringkasan(0.10) — Kelly penuh",
          "prob_ruin_25, median_modal_25 = ...         # ringkasan(0.25) — tuntutan Raka",
          "",
          "print(\"Kelly teoritis:\", kelly_teoritis)",
          "print(\"f=0.05 -> ruin:\", round(prob_ruin_05, 4), \"| median:\", round(median_modal_05, 2))",
          "print(\"f=0.10 -> ruin:\", round(prob_ruin_10, 4), \"| median:\", round(median_modal_10, 2))",
          "print(\"f=0.25 -> ruin:\", round(prob_ruin_25, 4), \"| median:\", round(median_modal_25, 2))",
        ].join("\n"),
        lockLines: 33,
        solution: [
          "import numpy as np",
          "",
          "P_MENANG = 0.55",
          "MODAL_AWAL = 100.0",
          "BATAS_RUIN = 50.0",
          "TARGET = 200.0",
          "",
          "def simulasi(f, n_path=2000, t_max=2000, seed=42):",
          "    rng = np.random.default_rng(seed)",
          "    modal = np.full(n_path, MODAL_AWAL)",
          "    aktif = np.ones(n_path, dtype=bool)",
          "    status = np.full(n_path, \"bertahan\")",
          "    for _ in range(t_max):",
          "        if not aktif.any():",
          "            break",
          "        idx = np.flatnonzero(aktif)",
          "        menang = rng.random(idx.size) < P_MENANG",
          "        taruhan = f * modal[idx]",
          "        modal[idx] += np.where(menang, taruhan, -taruhan)",
          "        kena_ruin = modal[idx] < BATAS_RUIN",
          "        kena_target = modal[idx] >= TARGET",
          "        status[idx[kena_ruin]] = \"ruin\"",
          "        status[idx[kena_target]] = \"sukses\"",
          "        aktif[idx[kena_ruin | kena_target]] = False",
          "    return modal, status",
          "",
          "def ringkasan(f):",
          "    modal, status = simulasi(f)",
          "    prob_ruin = (status == \"ruin\").mean()",
          "    median_modal = float(np.median(modal))",
          "    return prob_ruin, median_modal",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "kelly_teoritis = P_MENANG - (1 - P_MENANG)",
          "prob_ruin_05, median_modal_05 = ringkasan(0.05)",
          "prob_ruin_10, median_modal_10 = ringkasan(0.10)",
          "prob_ruin_25, median_modal_25 = ringkasan(0.25)",
          "",
          "print(\"Kelly teoritis:\", kelly_teoritis)",
          "print(\"f=0.05 -> ruin:\", round(prob_ruin_05, 4), \"| median:\", round(median_modal_05, 2))",
          "print(\"f=0.10 -> ruin:\", round(prob_ruin_10, 4), \"| median:\", round(median_modal_10, 2))",
          "print(\"f=0.25 -> ruin:\", round(prob_ruin_25, 4), \"| median:\", round(median_modal_25, 2))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`ringkasan` terdefinisi", name: "ringkasan", msg: "Fungsi ringkasan(f) harus ada dan mengembalikan (prob_ruin, median_modal)." },
          { kind: "equal", task: "t1", label: "`kelly_teoritis` = 0,10", name: "kelly_teoritis", value: 0.1, tol: 1e-9, msg: "Kelly = p − q = 0,55 − 0,45." },
          { kind: "equal", task: "t2", label: "ruin f=0,05 ≈ 10,15%", name: "prob_ruin_05", value: 0.1015, tol: 0.01, msg: "Setengah-Kelly: ~203 dari 2000 path hancur (seed 42)." },
          { kind: "equal", task: "t2", label: "ruin f=0,10 ≈ 33,15%", name: "prob_ruin_10", value: 0.3315, tol: 0.01, msg: "Kelly penuh: ~663 dari 2000 path hancur — 1 dari 3!" },
          { kind: "equal", task: "t2", label: "median f=0,10 ≈ 203,85", name: "median_modal_10", value: 203.85, tol: 2, msg: "Median path Kelly mencapai target — tapi sepertiga path mati di jalan." },
          { kind: "equal", task: "t3", label: "ruin f=0,25 ≈ 54,95%", name: "prob_ruin_25", value: 0.5495, tol: 0.01, msg: "Tuntutan Raka: lebih dari separuh path hancur." },
          { kind: "equal", task: "t3", label: "median f=0,25 ≈ 49,44 (< 50!)", name: "median_modal_25", value: 49.44, tol: 2, msg: "Jalur TENGAH-nya mati — bukan jalur sial, jalur biasa." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Ambang toleransi desk",
      title: "Fraksi mana yang lolos mandat risiko?",
      prose: [
        "Komite punya mandat sederhana: peluang kehancuran di bawah 35%. Tabel `hasil_fraksi(fraksi REAL, prob_ruin REAL, prob_sukses REAL, median_modal REAL)` memuat ringkasan ketujuh fraksi dari `kurva_ruin.csv`. Saring yang memenuhi mandat dengan SQL — dan perhatikan siapa saja yang lolos.",
        "Hasilnya akan mengejutkan: fraksi “optimal” menurut teori nyaris tidak lolos — dan tuntutan Raka bahkan tidak dekat.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query fraksi dengan prob_ruin < 0,35, tampilkan fraksi + prob_ruin + median_modal, urut dari prob_ruin terkecil" },
      ],
      expected:
        "3 baris — hanya f=0,02 (0,15%), f=0,05 (10,15%), dan f=0,10 (33,15%) yang lolos ambang 35%. Kelly lolos TIPIS; tuntutan Raka (54,95%) gugur jauh.",
      sqlLab: {
        task: "Saring fraksi yang memenuhi mandat: prob_ruin < 0.35. Tampilkan fraksi, prob_ruin, median_modal — urut dari prob_ruin terkecil.",
        schema: "CREATE TABLE hasil_fraksi (fraksi REAL, prob_ruin REAL, prob_sukses REAL, median_modal REAL);",
        seedData: [
          "INSERT INTO hasil_fraksi VALUES",
          "(0.02,0.0015,0.9985,201.84),",
          "(0.05,0.1015,0.8985,204.01),",
          "(0.10,0.3315,0.6685,203.85),",
          "(0.15,0.4445,0.5555,201.78),",
          "(0.20,0.5055,0.4945,49.96),",
          "(0.25,0.5495,0.4505,49.44),",
          "(0.30,0.5710,0.4290,49.00);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT fraksi, prob_ruin, median_modal\nFROM hasil_fraksi\n",
        solution: [
          "SELECT fraksi, prob_ruin, median_modal",
          "FROM hasil_fraksi",
          "WHERE prob_ruin < 0.35",
          "ORDER BY prob_ruin;",
        ].join("\n"),
        expectedColumns: ["fraksi", "prob_ruin", "median_modal"],
        expectedRows: [
          [0.02, 0.0015, 201.84],
          [0.05, 0.1015, 204.01],
          [0.10, 0.3315, 203.85],
        ],
        orderMatters: true,
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 5 · Checkpoint keputusan",
      title: "Ukuran posisi Raka mau kamu apakan?",
      prose: [
        "Angkanya tidak berbohong: pada 25%, 55% path hancur dan jalur median pun mati (49,44). Bahkan Kelly penuh (10%) menghancurkan 1 dari 3 desk. Tapi “terlalu berisiko” dan “berapa yang boleh” adalah dua keputusan berbeda — dan Head of Trading menunggumu memilih. Tiap opsi mengubah apa yang terjadi berikutnya.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Keputusan ukuran posisi apa yang kamu sampaikan ke komite atas tuntutan Raka? (Keputusan final — seperti memo yang sudah dikirim.)",
        options: [
          {
            id: "opt-setujui",
            label: "Setujui 25% — edge 55% layak dibayar mahal",
            rationale:
              "Expectancy positif dan win rate 55% terverifikasi. Membatasi trader bintang berarti membatasi profit desk — dan Raka bisa pindah ke kompetitor.",
            nextStepId: "temuan-setujui",
            consequenceNote:
              "Enam bulan pertama profit — Raka dipuja. Lalu datang 7 kekalahan beruntun: modal jatuh di bawah 50, risk manager menarik steker di tengah kuartal. Raka resign ke kompetitor dengan membawa strateginya — dan desk-mu yang menanggung puingnya.",
          },
          {
            id: "opt-dua-persen",
            label: "Batasi 2% — satu-satunya yang lolos mandat ruin 10%",
            rationale:
              "Mandat risiko desk: peluang kehancuran di bawah 10%. Dari 7 fraksi, hanya f=0,02 (ruin 0,15%) yang lolos — dengan median pertumbuhan yang tetap mencapai target (201,84).",
            nextStepId: "temuan-dua-persen",
            consequenceNote:
              "Desk tumbuh pelan tapi tanpa drama: akhir tahun modal 2×, tidak sekalipun menyentuh stop-loss. Raka protes “terlalu kecil” selama 3 bulan — lalu berhenti protes ketika melihat laporan tahunan. Ia tetap di desk; strateginya tetap hidup.",
          },
          {
            id: "opt-kelly-stop",
            label: "Kelly 10% + stop-loss 50% + review bulanan",
            rationale:
              "Kelly memaksimalkan pertumbuhan; stop-loss 50% membatasi kerusakan; review bulanan menjaga disiplin. Jalan tengah yang menghormati teori DAN praktik.",
            nextStepId: "temuan-kelly-stop",
            consequenceNote:
              "Tiga bulan profit cepat — komite puas. Bulan keempat: drawdown 40% dalam dua minggu, stop-loss tersentuh, posisi ditutup paksa di dasar. Raka: “sistemnya yang salah”. Pelajaran pahit: stop-loss tidak MENGURANGI peluang ruin — ia hanya MENDEFINISIKANNYA. 33% tetap 33%.",
          },
        ],
      },
    },
    {
      id: "temuan-setujui",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: 25% disetujui",
      prose: [
        "Komite menyetujui — Raka tersenyum. Enam bulan pertama desk mencetak profit dan semua orang lupa pernah ada perdebatan. Lalu pasar berbalik arah selama tiga minggu: 7 kekalahan beruntun. Pada f=0,25, tujuh kekalahan beruntun berarti modal tersisa (0,75)^7 ≈ 13% — jauh di bawah stop-loss 50.",
        "Risk manager menarik steker di tengah kuartal. Raka resign minggu berikutnya — ke kompetitor, dengan membawa strateginya yang “terbukti”. Yang tertinggal di mejamu: puing-puing desk dan satu pelajaran yang dibayar mahal — edge tanpa ukuran yang benar hanyalah cara yang lebih canggih untuk bangkrut.",
      ],
      tasks: [],
      note: {
        title: "Kekalahan beruntun bukan “kesialan” — ia kepastian statistik",
        body: "Peluang 7 kekalahan beruntun dengan p=0,55 adalah 0,45^7 ≈ 0,4% per 7 trade — kecil per kejadian, PASTI terjadi dalam ribuan trade. Ukuran posisi yang “aman” adalah ukuran yang selamat DARI kejadian yang pasti itu, bukan yang berharap ia tidak datang. Di deliverable-mu, selalu hitung skenario beruntunnya.",
      },
    },
    {
      id: "temuan-dua-persen",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: dibatasi 2%",
      prose: [
        "Komite menyetujui batas 2% — keputusan yang membuatmu tidak populer selama satu kuartal (“terlalu konservatif!”). Setahun kemudian laporannya bicara: modal 2× lipat, tidak sekalipun menyentuh stop-loss, peluang ruin 0,15%.",
        "Raka berhenti protes di bulan keempat — tepatnya setelah ia melihat dua desk kompetitor yang memakai ukuran agresif gulung tikar di koreksi yang sama. Pelajaran yang murah kali ini: yang membosankan seringkali yang selamat. Pertumbuhan 2× tanpa drama mengalahkan janji 5× yang mati di tengah jalan.",
      ],
      tasks: [],
      note: {
        title: "Konservatif bukan pengecut — ia aritmetika",
        body: "f=0,02 memberi ruin 0,15% dengan median 201,84 — pertumbuhan yang SAMA dengan Kelly, risiko yang 200× lebih kecil. “Konservatif” di sini bukan soal nyali; ia soal membaca kolom prob_ruin sebelum kolom profit. Risk manager yang baik tidak memaksimalkan return — ia memaksimalkan peluang BERTAHAN untuk melihat return itu.",
      },
    },
    {
      id: "temuan-kelly-stop",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: Kelly + stop-loss",
      prose: [
        "Komite menyetujui jalan tengahmu: Kelly 10% dengan stop-loss 50%. Tiga bulan pertama luar biasa — pertumbuhan tercepat di antara semua skenario. Lalu bulan keempat datang: drawdown 40% dalam dua minggu. Stop-loss tersentuh. Posisi ditutup paksa — di dasar.",
        "Raka menatapmu: “Katanya Kelly itu optimal?” Jawaban jujurnya: Kelly optimal untuk pertumbuhan bila kamu bisa main selamanya. Stop-loss justru MENGHENTIKAN permainan — dan 33% peluang ruin tidak peduli seberapa elegan teorimu. Jalan tengah ini gagal bukan karena teorinya salah, melainkan karena teori dan praktiknya menjawab pertanyaan yang berbeda.",
      ],
      tasks: [],
      note: {
        title: "Stop-loss mendefinisikan ruin, bukan menghilangkannya",
        body: "Banyak risk manager mengira stop-loss = pengaman. Secara matematis, stop-loss = BATAS RUIN itu sendiri — ia mengubah “kapan aku berhenti” menjadi “kapan aku mati”. Peluang menyentuh batas itu tetap dihitung dari ukuran posisi, bukan dari keberadaan batasnya. Jangan pernah merasa aman hanya karena “sudah ada stop-loss”.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 7 · Misi audit",
      title: "Dossier 12 baris: backtest yang “mulus” itu menipu",
      prose: [
        "Sebelum menulis memo, satu misi audit. Di bawah ini 12 baris “Kutipan Laporan Backtest Strategi Raka”, dokumen yang diklaim membuktikan strategi ini “siap limit 25%”. Seseorang menyuntikkan 4 manipulasi ke dalamnya. Senjatamu: kurva ruin dari Lab 1 dan tabel mandat dari Lab 2.",
        "Aturannya sama: bandingkan setiap klaim dengan angka simulasimu. Laporan yang mulus justru yang paling perlu dicurigai.",
      ],
      tasks: [],
      auditDossier: {
        version: "ruin-m2b-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai kutipan Laporan Backtest Strategi Raka yang menyatakan strategi “siap untuk limit 25% per trade”.",
        columns: ["#", "Pernyataan", "Angka", "Status"],
        rows: [
          { rowId: 1, cells: { "#": "1", "Pernyataan": "Win rate backtest", "Angka": "55%", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          // ── I1: expectancy = ruin 0% ──
          { rowId: 2, cells: { "#": "2", "Pernyataan": "Expectancy positif → risk of ruin", "Angka": "0%", "Status": "Klaim laporan" }, claims: [{ label: "Tercatat", value: "Ya — hal. 3" }] },
          // ── I2: periode cerah saja ──
          { rowId: 3, cells: { "#": "3", "Pernyataan": "Periode backtest", "Angka": "2026-01 s.d. 2026-06", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 4, cells: { "#": "4", "Pernyataan": "Kondisi pasar periode itu", "Angka": "Tren naik kuat", "Status": "Catatan" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          // ── I3: trade ganda ──
          { rowId: 5, cells: { "#": "5", "Pernyataan": "Trade ID T-1041", "Angka": "+2,5%", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 6, cells: { "#": "6", "Pernyataan": "Trade ID T-1041", "Angka": "+2,5%", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          // ── I4: drawdown dipalsukan ──
          { rowId: 7, cells: { "#": "7", "Pernyataan": "Max drawdown", "Angka": "8%", "Status": "Klaim laporan" }, claims: [{ label: "Tercatat", value: "Ya — hal. 5" }] },
          { rowId: 8, cells: { "#": "8", "Pernyataan": "Ukuran posisi yang dipakai", "Angka": "25% modal", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 9, cells: { "#": "9", "Pernyataan": "Jumlah trade backtest", "Angka": "412", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 10, cells: { "#": "10", "Pernyataan": "Peluang 5 kekalahan beruntun (p=0,55)", "Angka": "1,8%", "Status": "Tidak dihitung" }, claims: [{ label: "Tercatat", value: "Ya — 0,45^5" }] },
          { rowId: 11, cells: { "#": "11", "Pernyataan": "Drawdown 5 kekalahan beruntun @25%", "Angka": "−76%", "Status": "Tidak dihitung" }, claims: [{ label: "Tercatat", value: "Ya — 1−0,75^5" }] },
          { rowId: 12, cells: { "#": "12", "Pernyataan": "Rekomendasi laporan", "Angka": "Naikkan limit ke 25%", "Status": "Kesimpulan" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        ],
        injections: [
          { key: "ev-bukan-jaminan", rowIds: [2], title: "Expectancy positif diklaim = ruin 0%", clue: "Laporan menulis “risk of ruin: 0%” karena expectancy positif. Simulasimu: pada f=0,25, ruin 54,95% — dengan expectancy yang SAMA persis. Expectancy menjawab “rata-rata ke mana”; ruin menjawab “berapa peluang mati di jalan”. Keduanya benar, keduanya berbeda.", danger: "Satu sel “0%” ini yang membuat komite hampir menyetujui limit 25%. Angka yang salah di tempat yang tepat lebih berbahaya dari angka yang salah di tempat yang jelas." },
          { key: "periode-dipilih", rowIds: [3, 4], title: "Backtest hanya 6 bulan tren naik", clue: "Jan–Jun 2026: tren naik kuat, 412 trade. Tidak ada satu pun periode sideways/choppy — padahal strategi seperti ini berdarah di pasar datar. Win rate 55% adalah win rate “cuaca cerah”.", danger: "Selection bias periode: backtest yang hanya menguji strategi saat ia menang. Minta selalu: uji di rezim yang MEMBUNUH strategi ini." },
          { key: "trade-ganda", rowIds: [5, 6], title: "Trade T-1041 tercatat dua kali", clue: "ID dan hasil identik persis (+2,5%). Satu kemenangan ganda menggelembungkan win rate — dan win rate adalah fondasi seluruh klaim “55%”.", danger: "Duplikat di log trading = duplikat di laporan validasi mana pun. Pola yang sama, korban yang berbeda. Obatnya tetap: constraint unik." },
          { key: "dd-dipalsukan", rowIds: [7, 8, 11], title: "Max drawdown 8% mustahil pada ukuran 25%", clue: "Lima kekalahan beruntun pada f=0,25 = drawdown 76% (baris 11) — dan peluangnya 1,8% per 5 trade (baris 10), PASTI terjadi dalam 412 trade. Klaim “max DD 8%” tidak mungkin benar pada ukuran posisi 25% (baris 8).", danger: "Drawdown yang dipalsukan membuat ukuran posisi terlihat aman. Rumus cek 10 detik: (1−f)^n untuk n kekalahan beruntun — hafalkan." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 8 · Deliverable",
      title: "Memo position sizing untuk komite",
      prose: [
        "Semua bukti di tangan. Tulis memo position sizing satu halaman untuk komite — artefak portofoliomu. Memo yang baik tidak hanya bilang “25% terlalu besar”, tapi menunjukkan KURVA-nya: di fraksi berapa ruin meledak, apa yang disembunyikan laporan Raka, dan berapa ukuran yang boleh — dengan mandat angkanya.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan eksekutif (3 kalimat): peluang ruin di 25% vs ekspektasi, posisi fraksi Kelly, vonis atas klaim “risk of ruin 0%”.",
          "Bukti kuantitatif: kurva ruin 7 fraksi (prob_ruin + median modal), fraksi Kelly teoritis 10%, hasil saringan mandat 35% (hanya 3 fraksi lolos).",
          "Temuan audit laporan Raka: manipulasi apa yang kamu temukan, baris per baris.",
          "Rekomendasi: ukuran posisi maksimum yang diizinkan + mandat ruin eksplisit (rujuk keputusanmu di Langkah 5).",
          "Batas & risiko sisa: apa yang TIDAK dicakup simulasimu (mis. data SINTETIS; p konstan; tanpa biaya/slippage; ruin = stop-loss 50%, bukan bangkrut harfiah).",
        ],
        rubric: [
          { criterion: "Kebenaran kurva ruin", weight: 25, levels: ["Angka ruin salah/tidak ada", "Sebagian angka benar", "Ruin 54,95% @25%, 33,15% @Kelly, median 49,44 — semua tepat"] },
          { criterion: "Deteksi manipulasi", weight: 25, levels: ["Tidak menyebut manipulasi", "Menyebut sebagian tanpa nomor baris", "Keempat manipulasi disebut dengan nomor baris"] },
          { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa mandat angka", "Ada rekomendasi, mandat kabur", "Ukuran maks + mandat ruin eksplisit (mis. ruin < 10% → f ≤ 0,05)"] },
          { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim simulasi = bukti final", "Menyebut sebagian batas", "Batas (SINTETIS, p konstan, tanpa biaya) dinyatakan eksplisit"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 9 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat manipulasi di laporan backtest Raka:",
        "1) **Expectancy = ruin 0%** (baris 2): klaim paling berbahaya di seluruh dossier. Expectancy positif TIDAK PERNAH berarti ruin nol — simulasimu membuktikannya: 54,95% pada ukuran 25% dengan expectancy yang sama.",
        "2) **Periode cerah** (baris 3–4): 6 bulan tren naik, 412 trade, nol hari buruk. Win rate 55% yang tidak pernah diuji di pasar yang membunuhnya bukanlah win rate — ia ramalan cuaca.",
        "3) **Trade ganda** (baris 5–6): T-1041 tercatat dua kali. Klasik — dan obatnya semurah di semua misi: constraint unik.",
        "4) **Drawdown dipalsukan** (baris 7–8 & 11): “max DD 8%” pada ukuran 25% melanggar aritmetika — 5 kekalahan beruntun saja sudah −76%, dan itu pasti terjadi.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap simulasi independen, atau memercayai kurva ekuitas yang mulus. Dan ingat keputusan bercabangmu: bahkan opsi “Kelly + stop-loss” yang terlihat canggih pun gagal — karena stop-loss mendefinisikan ruin, bukan menghilangkannya.",
        "Bahaya nyata terakhir: dana yang mati hampir tidak pernah mati karena strateginya kalah — mereka mati karena ukurannya salah pada strategi yang menang. Kelly memberi tahu seberapa cepat kamu BISA tumbuh; ruin memberi tahu apakah kamu HIDUP cukup lama untuk melihatnya. Risk manager yang baik membaca kolom kedua dulu.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi #3: setelah kena stop-loss, naikkan ukuran untuk “balik modal”",
        type: "risk",
        body: "Ini Martingale — menggandakan taruhan setelah kalah. Matematikanya brutal: menggandakan setelah kalah mempercepat ruin secara eksponensial, bukan memulihkan modal. Satu kekalahan beruntun yang “pasti terjadi” (ingat: 0,45^7 ≈ 0,4% per 7 trade) cukup untuk menghabisi seluruh modal yang digandakan. Tidak ada ukuran “balas dendam” yang selamat dari aritmetika.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 10 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "Kurva ruin (2000 path/fraksi): f=0,02 → ruin 0,15%; f=0,05 → 10,15%; f=0,10 (Kelly) → 33,15%; f=0,25 → 54,95% dengan median 49,44 (jalur tengah MATI).",
        "Fraksi Kelly (p − q = 10%) memaksimalkan LAJU PERTUMBUHAN, bukan keselamatan — 1 dari 3 desk hancur bahkan pada ukuran “optimal”.",
        "Expectancy positif tidak berarti ruin nol; stop-loss mendefinisikan ruin, bukan menghilangkannya; kekalahan beruntun adalah kepastian statistik, bukan kesialan.",
        "Empat pola manipulasi laporan backtest: expectancy=ruin 0%, periode cerah saja, trade ganda, max drawdown yang melanggar aritmetika.",
        "Data: SINTETIS 100% (seed 42), Monte Carlo 14.000 path, dibuat 2026-10-15; pasar nyata tidak punya p konstan; biaya/slippage diabaikan.",
      ],
    },
  ],
};

export default misiKehancuranPenjudi;
