import type { V2Lesson } from "../lib/types";

export const cr17a: V2Lesson = {
  slug: "cr17a-corporate-credit-1",
  track: "Credit Risk",
  module: "Kredit Korporasi",
  title: "CR17A — Kredit Korporasi 1: Membaca Laporan Keuangan",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laba naik 30%, perusahaan mati",
      prose: [
        "PT Maju Jaya mengumumkan laba naik 30% menjadi Rp 54 miliar. Analis junior mengusulkan ACC kredit ekspansi. Tetapi analis senior membuka laporan arus kas: arus kas operasi negatif Rp 80 miliar. Lho?",
        "Ternyata: penjualan naik, tetapi piutangnya menumpuk (pelanggan tidak bayar-bayar) dan persediaan membengkak (barang tidak laku). \"Laba\"-nya terjebak di gudang dan di piutang — tidak ada kasnya.",
        "Tiga bulan kemudian Maju Jaya gagal bayar cicilan pertama. Laba naik 30%, perusahaan mati.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laba adalah opini (akuntansi), kas adalah fakta. Analis kredit korporasi tidak membaca laba — ia menginterogasi laporan keuangan. Divergensi laba vs kas adalah red flag #1 analisis kredit.",
      },
      reference: "Mulai analisis dari arus kas operasi, bukan laba: arus kas operasi ≥ 80% laba bersih secara konsisten \u2014 HEURISTIK praktis (bukan aturan): bila di bawah itu, interogasi modal kerja; angka ini bukan ambang regulasi.",
    },
    {
      id: "tiga-laporan",
      eyebrow: "Langkah 2 · Tiga Laporan",
      title: "Satu cerita, tiga saksi",
      prose: [
        "Neraca — foto di satu tanggal: Aset = Utang + Ekuitas. Menjawab: \"apa yang dimiliki vs apa yang dipinjam?\" Laba-rugi — film satu periode: pendapatan − biaya = laba. Menjawab: \"apakah bisnisnya menguntungkan?\" Arus kas — kas nyata masuk/keluar: operasi, investasi, pendanaan. Menjawab: \"apakah ada uang betulan?\"",
        "Hubungannya: laba (laba-rugi) → menambah ekuitas (neraca) → tetapi hanya jika menjadi kas (arus kas). Rantai yang putus di mana saja = masalah. Kasus Maju Jaya: rantai putus di laba → kas (piutang & persediaan).",
        "Tiga laporan seperti tiga saksi — neraca si fotografer, laba-rugi si pendongeng, arus kas si jujur. Analis yang baik tidak percaya satu saksi — ia mencari yang tidak konsisten di antara ketiganya.",
      ],
      tasks: [],
      reference: "Opini audit WTP = kewajaran penyajian sesuai standar — BUKAN jaminan bisnis sehat. Audit ≠ due diligence kredit.",
    },
    {
      id: "lab-rasio",
      eyebrow: "Langkah 3 · Lab Rasio",
      title: "Kalkulator rasio PT Maju Jaya",
      prose: [
        "Data PT Maju Jaya (Rp M) terkunci: aset lancar 350, utang lancar 280, total utang 700, ekuitas 300, pendapatan 900, laba kotor 252, EBITDA 162, bunga 60, cicilan pokok 40, laba bersih 54. Tugasmu: hitung rasio kuncinya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `cr` (current ratio) dan `der` (debt-to-equity)" },
        { id: "t2", text: "Hitung `dscr` dan `icr` (interest coverage)" },
        { id: "t3", text: "Hitung `gross` dan `net` (margin %) lalu `print` semuanya" },
      ],
      expected: "CR=1.25 D/E=2.33 DSCR=1.62 ICR=2.70 gross=28.0 net=6.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "DSCR adalah raja rasio kredit: DSCR >1,25× aman; <1,0× = tidak sanggup bayar. Net margin 6% = sangat tipis — kenaikan bunga 2% atau penurunan penjualan 5% bisa menghapus laba sepenuhnya. Perusahaan seperti ini tidak punya shock absorber.",
      },
      hints: [
        "cr = aset_lancar / utang_lancar.",
        "dscr = ebitda / (bunga + cicilan_pokok).",
        "margin = laba / pendapatan * 100.",
      ],
      code: {
        starter: `aset_lancar, utang_lancar = 350, 280\ntotal_utang, ekuitas = 700, 300\npendapatan, laba_kotor, ebitda = 900, 252, 162\nbunga, cicilan_pokok, laba_bersih = 60, 40, 54\n\n# TULIS KODEMU\ncr = \nder = \ndscr = \nicr = \ngross = \nnet = \n\nprint(f"CR={cr:.2f} D/E={der:.2f} DSCR={dscr:.2f} ICR={icr:.2f} gross={gross:.1f} net={net:.1f}")`,
        lockLines: 4,
        solution: `aset_lancar, utang_lancar = 350, 280\ntotal_utang, ekuitas = 700, 300\npendapatan, laba_kotor, ebitda = 900, 252, 162\nbunga, cicilan_pokok, laba_bersih = 60, 40, 54\n\n# TULIS KODEMU\ncr = aset_lancar / utang_lancar\nder = total_utang / ekuitas\ndscr = ebitda / (bunga + cicilan_pokok)\nicr = ebitda / bunga\ngross = laba_kotor / pendapatan * 100\nnet = laba_bersih / pendapatan * 100\n\nprint(f"CR={cr:.2f} D/E={der:.2f} DSCR={dscr:.2f} ICR={icr:.2f} gross={gross:.1f} net={net:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cr", value: 1.25, tol: 1e-9, label: "`cr` seharusnya 1.25", msg: "350 / 280 = 1.25 — pas-pasan." },
          { kind: "equal", task: "t1", name: "der", value: 2.3333, tol: 0.01, label: "`der` seharusnya 2.33", msg: "700 / 300 = 2.33 — di atas 2, waspada." },
          { kind: "equal", task: "t2", name: "dscr", value: 1.62, tol: 1e-9, label: "`dscr` seharusnya 1.62", msg: "162 / (60+40) = 1.62 — masih OK." },
          { kind: "equal", task: "t2", name: "icr", value: 2.7, tol: 1e-9, label: "`icr` seharusnya 2.70", msg: "162 / 60 = 2.7." },
          { kind: "equal", task: "t3", name: "gross", value: 28.0, tol: 1e-9, label: "`gross` seharusnya 28.0", msg: "252 / 900 × 100 = 28.0." },
          { kind: "equal", task: "t3", name: "net", value: 6.0, tol: 1e-9, label: "`net` seharusnya 6.0", msg: "54 / 900 × 100 = 6.0 — sangat tipis." },
          { kind: "stdout_matches", task: "t3", pattern: "CR=1\\.25\\s+D/E=2\\.33\\s+DSCR=1\\.62\\s+ICR=2\\.70\\s+gross=28\\.0\\s+net=6\\.0", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Gross 28% → net cuma 6%: 22 poin hilang di beban operasi, bunga, dan pajak.",
    },
    {
      id: "empat-rasio",
      eyebrow: "Langkah 4 · Keluarga Rasio",
      title: "Empat pertanyaan kredit",
      prose: [
        "1. Likuiditas — \"Bisa bayar tagihan bulan ini?\" Current ratio. Patokan: >1,2× sehat; <1,0× = utang jangka pendek lebih besar dari aset lancar — bahaya. Tetapi waspada: aset lancar bisa berupa persediaan basi — cek kualitasnya.",
        "2. Leverage — \"Seberapa banyak hidup dari utang?\" D/E. Patokan umum: <2× wajar (tergantung industri — properti/infrastruktur wajar lebih tinggi). Leverage tinggi = tidak ada ruang untuk salah: sedikit guncangan → ekuitas habis.",
        "3. Coverage — \"Sanggup bayar cicilan?\" (RAJA rasio kredit!) DSCR = EBITDA/(bunga+cicilan); ICR = EBITDA/bunga. Patokan: DSCR >1,25× aman; <1,0× = tidak sanggup bayar (ingat CR1!).",
        "4. Profitabilitas — \"Bisnisnya sehat?\" Gross margin, EBITDA margin, net margin — dan trennya. Margin menipis 5 tahun berturut-turut = structural decline (bukan masalah sementara).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Rasio dalam batas normal = perusahaan sehat.\" Rasio adalah foto — penipu ulung berpose bagus untuk foto. Yang penting adalah tren 3–5 tahun + kualitas angka (apakah piutangnya nyata?). Rasio \"OK\" dengan tren memburuk = pasien yang masih tersenyum tetapi hasil lab-nya merah semua.",
      },
      reference: "Rasio bagus + opini audit WDP karena piutang afiliasi tak terverifikasi → abaikan rasio, minta WTP atau koreksi manual.",
    },
    {
      id: "tren",
      eyebrow: "Langkah 5 · Tren",
      title: "Tren > snapshot",
      prose: [
        "Analis kredit membaca laporan seperti dokter membaca rekam medis — bukan satu hasil lab, melainkan trennya. Tiga tren yang paling ditakuti: (1) leverage naik, (2) DSCR turun, (3) arus kas operasi < laba bersih melebar. Satu saja = waspada; tiga sekaligus = tolak (atau pricing sangat tinggi + covenant ketat).",
        "Contoh Maju Jaya: D/E menanjak 5 tahun berturut-turut hingga 3,1 (2× industri!) — leverage creep: utang ditambah tiap tahun untuk menutup lubang. Snapshot 2023 (1,9) \"masih OK\" — trennya yang berteriak.",
        "DSCR turun 5 tahun berturut-turut: 2,8 → 1,05. Tahun 2025 tinggal 1,05× — satu guncangan kecil (pelanggan telat bayar, bunga naik) = tidak sanggup bayar. Kombinasi mematikan: leverage naik + DSCR turun = perusahaan meminjam lebih banyak sementara kemampuannya membayar menyusut. Inilah pola klasik pra-default.",
      ],
      tasks: [],
      reference: "Default = proses, bukan peristiwa. Default diprediksi dari arah, bukan posisi.",
    },
    {
      id: "lab-tren",
      eyebrow: "Langkah 6 · Lab Tren",
      title: "Angka sesaat vs perjalanan",
      prose: [
        "Data 5 tahun terkunci: der [1.2, 1.5, 1.9, 2.4, 3.1]; dscr [2.8, 2.4, 1.9, 1.4, 1.05]. Status tahun: SEHAT jika dscr > 1.5 dan der < 2; WASPADA jika dscr > 1.2; selain itu KRITIS. Tugasmu: hitung status 2021, 2023, dan 2025.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `st_2021` dan `st_2025`" },
        { id: "t2", text: "Hitung `st_2023`" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "2021=SEHAT 2023=SEHAT 2025=KRITIS",
      hints: [
        "Indeks: 2021=0, 2023=2, 2025=4.",
        "Aturan berurutan: cek SEHAT dulu, lalu WASPADA, else KRITIS.",
        "Pakai satu fungsi kecil status(d, s).",
      ],
      code: {
        starter: `der   = [1.2, 1.5, 1.9, 2.4, 3.1]\ndscr  = [2.8, 2.4, 1.9, 1.4, 1.05]\n\n# TULIS KODEMU: fungsi status(d, s) lalu hitung tiga tahun\nst_2021 = \nst_2023 = \nst_2025 = \n\nprint(f"2021={st_2021} 2023={st_2023} 2025={st_2025}")`,
        lockLines: 2,
        solution: `der   = [1.2, 1.5, 1.9, 2.4, 3.1]\ndscr  = [2.8, 2.4, 1.9, 1.4, 1.05]\n\n# TULIS KODEMU: fungsi status(d, s) lalu hitung tiga tahun\ndef status(d, s):\n    return "SEHAT" if s > 1.5 and d < 2 else ("WASPADA" if s > 1.2 else "KRITIS")\n\nst_2021 = status(der[0], dscr[0])\nst_2023 = status(der[2], dscr[2])\nst_2025 = status(der[4], dscr[4])\n\nprint(f"2021={st_2021} 2023={st_2023} 2025={st_2025}")`,
        checks: [
          { kind: "equal", task: "t1", name: "st_2021", value: "SEHAT", label: "`st_2021` seharusnya 'SEHAT'", msg: "DSCR 2.8 > 1.5 dan D/E 1.2 < 2." },
          { kind: "equal", task: "t2", name: "st_2023", value: "SEHAT", label: "`st_2023` seharusnya 'SEHAT'", msg: "DSCR 1.9 > 1.5 dan D/E 1.9 < 2 — snapshot 'masih OK', trennya yang berteriak." },
          { kind: "equal", task: "t1", name: "st_2025", value: "KRITIS", label: "`st_2025` seharusnya 'KRITIS'", msg: "DSCR 1.05 ≤ 1.2 — titik mati." },
          { kind: "stdout_matches", task: "t3", pattern: "2021=SEHAT\\s+2023=SEHAT\\s+2025=KRITIS", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "2021: semua hijau. 2025: semua merah. Perusahaan tidak bangkrut tiba-tiba — ia memburuk perlahan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "PT Maju Jaya — layak Rp 200 M?",
      prose: [
        "PT Maju Jaya (manufaktur furnitur, Jepara) mengajukan kredit investasi Rp 200 M tenor 7 tahun untuk ekspansi pabrik. Data 2025: laba bersih naik 30% (Rp 54 M); arus kas operasi: −Rp 80 M; D/E 3,1× (industri 1,5×); DSCR 1,05×; net margin 6%; piutang naik 60% (penjualan naik 25%); persediaan naik 45%; opini audit WTP; direksi keluarga pendiri, 2 generasi.",
        "Keputusan: TOLAK (atau tunda sampai restrukturisasi keuangan). Tiga argumen: (1) DSCR 1,05× + tren turun 5 tahun — tidak ada buffer untuk cicilan Rp 200 M baru; menambah utang ke DSCR kritis = mempercepat default. (2) Laba semu: arus kas operasi negatif + piutang/persediaan membengkak = laba terjebak di modal kerja; ekspansi pabrik menambah kapasitas saat barang tidak laku (persediaan +45%) — salah obat. (3) Leverage 3,1× — tidak ada ruang salah; net margin 6% tidak punya shock absorber.",
        "Jalan keluar (jika direksi memaksa): injeksi ekuitas Rp 100 M dulu (turunkan D/E), plafon Rp 100 M (bukan 200), tenor 3 tahun + covenant DSCR >1,3×. Pelajaran: kredit tidak menyembuhkan perusahaan sakit — ia mempercepat kematiannya.",
      ],
      tasks: [],
      reference: "Kualitas > tren > snapshot. Hierarki analisis kredit.",
    },
    {
      id: "pendalaman-ccc",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Siklus konversi kas: di mana uang bersembunyi",
      prose: [
        "Piutang dan persediaan adalah dua kantong tempat kas bersembunyi — dan analis junior jarang memeriksa kantongnya. Ukuran standarnya adalah Cash Conversion Cycle (CCC): berapa hari uang perusahaan terkunci dalam operasi sebelum kembali menjadi kas. Rumusnya: CCC = DSO + DIO − DPO. Tiga simbolnya: DSO (Days Sales Outstanding) = (Piutang / Pendapatan) × 365 — rata-rata hari yang dibutuhkan untuk menagih piutang; DIO (Days Inventory Outstanding) = (Persediaan / HPP) × 365 — rata-rata hari barang diam di gudang; DPO (Days Payable Outstanding) = (Utang Usaha / HPP) × 365 — rata-rata hari perusahaan menunda bayar ke pemasok. Interpretasinya langsung: CCC 123 hari berarti setiap rupiah yang keluar untuk produksi baru kembali 123 hari kemudian — selama jeda itu perusahaan harus menalangi dengan modal kerja atau utang.",
        "Hitung untuk PT Maju Jaya dengan angka yang lebih jujur: piutang Rp 150 M, pendapatan Rp 900 M → DSO = (150/900) × 365 = 61 hari. Persediaan Rp 200 M, HPP Rp 648 M → DIO = (200/648) × 365 = 113 hari. Utang usaha Rp 90 M → DPO = (90/648) × 365 = 51 hari. CCC = 61 + 113 − 51 = 123 hari. Artinya: perusahaan butuh modal kerja sebesar 123/365 × 900 ≈ Rp 303 miliar hanya untuk menopang operasinya — angka inilah yang menjelaskan kenapa arus kas operasinya negatif Rp 80 miliar. Dua perusahaan dengan laba identik bisa punya nasib berlawanan: ritel modern dengan CCC 15 hari vs manufaktur furnitur dengan CCC 123 hari. Yang pertama kebutuhan modal kerjanya kecil; yang kedua harus dibiayai terus-menerus seperti pasien infus.",
        "Kontras yang membedakan analis senior: CCC yang turun tidak selalu kabar baik. Kasus salah baca yang nyata: CCC sebuah perusahaan turun dari 120 ke 95 hari — analis junior merayakan efisiensi. Bedah komponennya: DSO naik 61 → 70 hari (pelanggan makin lambat bayar), DIO naik 113 → 120 hari (barang makin menumpuk) — yang turun hanya DPO: 51 → 95 hari karena perusahaan menunda bayar pemasok (utang usaha membengkak Rp 90 M → Rp 170 M). Itu bukan efisiensi; itu perusahaan kepepet yang menahan kas dengan mengorbankan hubungan pemasok. Pemasok yang tidak dibayar 95 hari akan menaikkan harga, menurunkan prioritas kirim, atau memutus pasokan — bom waktu operasional. Aturan: baca CCC selalu per komponen. Perbaikan sejati = DSO/DIO turun; DPO yang naik sendirian = sinyal stres, bukan prestasi.",
        "Pendalaman yang selama ini hanya disebut sekilas: kualitas piutang lewat aging schedule. Piutang Rp 150 M terlihat sebagai satu angka — tetapi isinya: 0–30 hari Rp 60 M, 31–60 hari Rp 45 M, 61–90 hari Rp 30 M, >90 hari Rp 15 M. Itu versi rapi. Di Maju Jaya yang sebenarnya: bucket >90 hari berisi Rp 45 M (30%!). Heuristik \"aturan 10%\": jika lebih dari 10% piutang berumur >90 hari, dua tindakan wajib — (1) cadangkan minimal 50% dari bucket itu saat menilai likuiditas; (2) curigai kualitas laba, karena pendapatan yang tidak tertagih 90 hari adalah pendapatan fiksi yang menunggu dihapus. Hitung ulang current ratio yang jujur: aset lancar 350 − (50% × 45 piutang zombie) − (30 persediaan usang) = 297,5; CR jujur = 297,5/280 = 1,06 — bukan 1,25. Di bawah ambang 1,2. Vonis \"lolos\" berubah menjadi \"gagal\" hanya dengan membuka kantongnya.",
        "Mode kegagalan nyata: channel stuffing. Menjelang tutup kuartal, Maju Jaya memberi diskon 20% ke distributor agar \"borong\" — penjualan kuartal naik 25%, target tercapai, bonus direksi cair. Kuartal berikutnya: distributor mengembalikan 40% barang (retur), piutang tak tertagih melonjak. Pola deteksinya sederhana dan hampir tidak pernah dipakai analis junior: bandingkan pertumbuhan piutang vs pertumbuhan kas masuk dari pelanggan. Aturan keputusan: selisih >15 poin persentase dalam satu kuartal (piutang +40%, kas masuk dari pelanggan +10%) = investigasi wajib — minta aging schedule + data retur kuartal berjalan. Channel stuffing selalu meninggalkan jejak di selisih ini; ia bisa memalsukan pendapatan, tetapi tidak bisa memalsukan kas masuk.",
        "Kontras cara salah vs benar dalam satu keputusan kredit. Cara salah: \"DSCR 1,62 lolos ambang 1,25; current ratio 1,25 lolos ambang 1,2; laba naik 30% — ACC Rp 200 M.\" Cara benar: (1) hitung ulang semua rasio dengan angka yang sudah dibersihkan (CR jujur 1,06; DSCR berbasis FCF negatif); (2) stress test penjualan −20% — DSCR jatuh ke 1,18 dan melanggar covenant 1,3; (3) baru putuskan. Prinsipnya: ambang rasio adalah garis start analisis, bukan garis finish. Analis yang berhenti di \"lolos ambang\" sedang menilai foto yang sudah diedit — dan perusahaan yang sekarat hampir selalu berpose paling bagus tepat sebelum default.",
        "Heuristik yang ditempel di dinding analis kredit korporasi (aturan praktis, bukan hukum). Satu: arus kas operasi < 80% laba bersih dua tahun berturut-turut → interogasi modal kerja sebelum membaca halaman lain. Dua: >10% piutang berumur >90 hari → potong 50% nilainya dari aset lancar untuk semua rasio likuiditas. Tiga: pertumbuhan piutang melebihi pertumbuhan kas masuk >15 poin dalam satu kuartal → minta data retur dan aging hari itu juga. Empat: CCC naik >20 hari dalam setahun tanpa penjelasan ekspansi → anggap masalah modal kerja sampai terbukti bukan. Lima: setiap rasio \"lolos ambang\" wajib diuji ulang setelah angka dibersihkan dari piutang zombie dan persediaan usang. Lima aturan ini tidak menggantikan analisis penuh — tetapi mencegah 80% kesalahan analis junior: percaya pada angka yang belum dibuka kantongnya.",
        "Satu jebakan terakhir yang khas Indonesia: musiman. Ritel dan FMCG menumpuk persediaan menjelang Lebaran — DIO naik 40 hari di Q2 adalah pola tahunan yang wajar, bukan masalah. Analis yang membandingkan Q2 vs Q1 akan panik melihat \"persediaan membengkak\"; analis senior membandingkan Q2 tahun ini vs Q2 tahun lalu (year-on-year). Aturannya: untuk semua metrik modal kerja, tren dibaca YoY per kuartal yang sama, bukan QoQ — kecuali kamu sudah menyesuaikan efek musiman. Contoh nyata: DIO ritel 150 hari di Juni vs 110 hari di Maret terlihat memburuk; tetapi Juni tahun lalu 148 hari → sebenarnya stabil. Sebaliknya, DIO Juni 150 vs Juni tahun lalu 120 = memburuk 30 hari, dan itu sinyal nyata. Musiman adalah topeng yang membuat masalah terlihat normal dan kenormalan terlihat bermasalah — buka topengnya dengan selalu bertanya: \"kuartal yang sama tahun lalu berapa?\"",
        "Dan satu triangulasi eksternal yang murah: bandingkan total utang di laporan dengan total eksposur di SLIK OJK. Selisih >10% = ada utang yang tidak dilaporkan (biasanya ke pemasok yang direstrukturisasi diam-diam, atau pinjol korporasi). Laporan keuangan adalah pengakuan; SLIK adalah kesaksian pihak ketiga. Analis senior tidak pernah percaya pengakuan tanpa kesaksian.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: interogasi tiga saksi — urutan pertanyaan yang menghemat 80% waktumu",
        body: "Analis junior membaca laporan keuangan dari atas ke bawah: pendapatan → laba kotor → laba bersih → \"wah naik 30%!\" — lalu menghabiskan sisa waktu mencoba meyakinkan diri bahwa angkanya benar. Analis senior membaca dari bawah ke atas: mulai dari arus kas operasi (apakah laba menjadi kas?), lalu kualitas modal kerja (aging piutang, umur persediaan), baru kemudian laba-rugi (apakah labanya berkualitas?), dan terakhir rasio (apakah masih berdiri setelah dibersihkan?). Heuristiknya konkret: lima menit pertama hanya untuk satu pertanyaan — \"apakah arus kas operasi ≥ 80% laba bersih?\" Jika tidak, hentikan pembacaan normal dan masuk mode interogasi: uangnya ke mana? Piutang? Persediaan? Capex yang disamarkan? Delapan puluh persen kasus bermasalah terdeteksi di lima menit ini; analis junior menghabiskan delapan puluh persen waktunya di tempat yang salah — mengagumi pertumbuhan pendapatan yang ternyata fiksi. Ingat perbedaan sifatnya: laporan laba-rugi adalah klaim manajemen; laporan arus kas adalah kesaksian bank. Dalam setiap sengketa antara klaim dan kesaksian, percayai kesaksian bank.",
      },
      reference: "CCC = DSO + DIO − DPO: baca per komponen, bandingkan YoY, dan bersihkan angka dari piutang zombie.",
    },
        {
          id: "gap-r8-dscr-definisi",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G7)",
          title: "DSCR: satu perusahaan, tiga jawaban — tanyakan definisinya",
          prose: [
            "Lesson ini memakai DSCR = EBITDA / (bunga + cicilan pokok). Untuk PT Maju Jaya: 162 / (60 + 40) = 1,62× — di atas ambang aman 1,25×. Kedengarannya nyaman. Tetapi DSCR bukan satu rumus — ia KELUARGA rumus, dan tiap bank/covenant memakai anggota keluarga yang berbeda. Hitung ulang Maju Jaya dengan tiga definisi: (1) EBITDA: 162/100 = 1,62×. (2) CFADS — cash flow available for debt service = EBITDA − pajak − capex pemeliharaan − lease: 162 − 18 − 25 − 12 = 107 → 107/100 = 1,07×. (3) CFADS dengan lease JUGA di penyebut (debt service = bunga + cicilan + lease): 107/(60 + 40 + 12) = 0,96× — DI BAWAH 1,0×, alias tidak sanggup bayar.",
            "Perusahaan yang sama, DSCR 1,62 → 0,96 — dari 'aman' menjadi 'tidak sanggup bayar' — hanya karena definisinya berubah. EBITDA melebih-lebihkan kas yang tersedia: ia mengabaikan pajak yang wajib dibayar, capex pemeliharaan yang tidak bisa ditunda (mesin yang tidak dirawat berhenti), dan lease yang secara ekonomi adalah utang. CFADS lebih jujur, tetapi lebih sulit dihitung — dan tiap covenant mendefinisikan komponennya sendiri-sendiri. ICR pun sama: EBITDA/bunga = 2,70×, tetapi bila lease dihitung sebagai beban bunga, 162/(60+12) = 2,25×.",
            "Disiplin analis: JANGAN pernah menulis 'DSCR 1,62×' telanjang. Tulis 'DSCR (EBITDA) 1,62×' atau 'DSCR (CFADS, lease di penyebut) 0,96×' — dan saat membaca covenant, baca DEFINISINYA dulu sebelum angkanya. Pertanyaan pertama saat bank lain memamerkan DSCR debitur: 'DSCR versi siapa?'",
          ],
          formula: String.raw`\text{DSCR}_{\text{EBITDA}} = \frac{\text{EBITDA}}{\text{bunga} + \text{cicilan}} \qquad \text{DSCR}_{\text{CFADS}} = \frac{\text{EBITDA} - \text{pajak} - \text{capex} - \text{lease}}{\text{bunga} + \text{cicilan} + \text{lease}}`,
          formulaNote: "Maju Jaya: DSCR EBITDA 1,62×; DSCR CFADS 1,07×; DSCR CFADS (lease di penyebut) 0,96×; ICR (lease sebagai bunga) 2,25×.",
          tasks: [
            { id: "t1", text: "Hitung `dscr_ebitda`, `dscr_cfads`, `dscr_cfads_lease` (2 desimal)" },
            { id: "t2", text: "Hitung `icr_lease` = EBITDA/(bunga+lease) (2 desimal)" },
          ],
          expected: "dscr_ebitda=1.62 dscr_cfads=1.07 dscr_cfads_lease=0.96 icr_lease=2.25",
          hints: [
            "CFADS = 162 − 18 (pajak) − 25 (capex pemeliharaan) − 12 (lease) = 107.",
            "Penyebut definisi 3 = 60 + 40 + 12 = 112.",
          ],
          code: {
            starter: `ebitda = 162; bunga = 60; cicilan = 40  # Rp M, data kanonis Maju Jaya\npajak = 18; capex = 25; lease = 12  # Rp M, komponen definisi CFADS\n\n# TULIS KODEMU: DSCR tiga definisi + ICR dengan lease (2 desimal)\ndscr_ebitda =\ndscr_cfads =\ndscr_cfads_lease =\nicr_lease =\n\nprint(f"dscr_ebitda={dscr_ebitda} dscr_cfads={dscr_cfads} dscr_cfads_lease={dscr_cfads_lease} icr_lease={icr_lease}")`,
            lockLines: 4,
            solution: `ebitda = 162; bunga = 60; cicilan = 40  # Rp M, data kanonis Maju Jaya\npajak = 18; capex = 25; lease = 12  # Rp M, komponen definisi CFADS\n\n# TULIS KODEMU: DSCR tiga definisi + ICR dengan lease (2 desimal)\ncfads = ebitda - pajak - capex - lease\ndscr_ebitda = round(ebitda / (bunga + cicilan), 2)\ndscr_cfads = round(cfads / (bunga + cicilan), 2)\ndscr_cfads_lease = round(cfads / (bunga + cicilan + lease), 2)\nicr_lease = round(ebitda / (bunga + lease), 2)\n\nprint(f"dscr_ebitda={dscr_ebitda} dscr_cfads={dscr_cfads} dscr_cfads_lease={dscr_cfads_lease} icr_lease={icr_lease}")`,
            checks: [
              { kind: "equal", task: "t1", name: "dscr_ebitda", value: 1.62, tol: 0.01, label: "`dscr_ebitda` = 1,62", msg: "162/100 = 1,62 — nilai kanonis lesson ini." },
              { kind: "equal", task: "t1", name: "dscr_cfads", value: 1.07, tol: 0.01, label: "`dscr_cfads` = 1,07", msg: "CFADS 107/100 = 1,07 — pajak, capex, dan lease memakan 55 dari EBITDA." },
              { kind: "equal", task: "t1", name: "dscr_cfads_lease", value: 0.96, tol: 0.01, label: "`dscr_cfads_lease` = 0,96", msg: "107/112 ≈ 0,96 — di bawah 1,0×: definisi ini menyatakan tidak sanggup bayar." },
              { kind: "equal", task: "t2", name: "icr_lease", value: 2.25, tol: 0.01, label: "`icr_lease` = 2,25", msg: "162/72 = 2,25 — lebih rendah dari ICR kanonis 2,70." },
              { kind: "stdout_matches", task: "t2", pattern: "dscr_ebitda=1\\.62\\s+dscr_cfads=1\\.07\\s+dscr_cfads_lease=0\\.96\\s+icr_lease=2\\.25", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Bank A melaporkan DSCR debitur 1,62×; bank B melaporkan 0,96× untuk debitur yang sama. Reaksi yang benar?",
              options: [
                { text: "Tanyakan definisi masing-masing dulu — keduanya bisa benar dengan definisi berbeda", why: "Tepat: EBITDA vs CFADS (lease di penyebut) memberi 1,62 vs 0,96 untuk Maju Jaya. Angka tanpa definisi tidak bisa dibandingkan.", correct: true },
                { text: "Bank B pasti salah hitung", why: "Salah: 0,96 adalah hasil sah definisi CFADS — 107/112." },
                { text: "Pakai rata-ratanya, 1,29×", why: "Salah: merata-rata dua definisi berbeda menghasilkan angka tanpa makna." },
                { text: "Pakai yang lebih tinggi — debitur berhak atas definisi terbaik", why: "Salah: memilih definisi yang menguntungkan adalah cherry-picking; covenant memakai definisi yang TERTULIS, bukan yang tertinggi." },
              ],
            },
          ],
          reference: "DSCR/ICR = keluarga definisi: selalu tulis definisinya (EBITDA vs CFADS, lease di mana); CFADS = EBITDA − pajak − capex pemeliharaan − lease.",
        },
        {
          id: "gap-r8-rekonsiliasi-ocf",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G8)",
          title: "Dari laba Rp54 M ke OCF −Rp80 M: rekonsiliasi yang menjelaskan kematian",
          prose: [
            "Cerita pembuka lesson ini — laba naik 30% menjadi Rp54 miliar, tetapi OCF negatif Rp80 miliar — disajikan sebagai misteri yang dijawab 'piutang dan persediaan'. Misteri itu layak dibuka dengan rekonsiliasi formal, karena di situlah analis membedakan 'laba yang belum jadi kas' dari 'laba yang tidak akan pernah jadi kas'. Rekonsiliasi Maju Jaya (Rp M): laba bersih 54 + depresiasi 28 = 82; kenaikan piutang −95; kenaikan persediaan −70; kenaikan utang usaha +15; pajak dibayar −12. Total: 54 + 28 − 95 − 70 + 15 − 12 = −80. OCF-nya −Rp80 miliar — cocok dengan cerita pembuka.",
            "Bacaan lapis keduanya yang lebih penting: pisahkan OCF menjadi dua bagian. OCF SEBELUM perubahan modal kerja = 54 + 28 − 12 = Rp70 miliar — operasi intinya MASIH menghasilkan kas. Yang membunuhnya adalah perubahan modal kerja: −95 − 70 + 15 = −Rp150 miliar. Rasio OCF/laba = −80/54 = −148% — jauh di bawah ambang 80% yang dipakai lesson ini sebagai aturan praktis. Tetapi angka −148% saja tidak cukup: analis harus bertanya APAKAH drainase modal kerja itu berkelanjutan atau sekali jalan. Piutang naik karena penjualan kredit agresif ke pelanggan yang tidak membayar = tidak berkelanjutan. Persediaan naik karena barang tidak laku = tidak berkelanjutan. Utang usaha naik karena menunda bayar pemasok = SEKALI jalan (pemasok akhirnya menagih).",
            "Kualitas arus kas dinilai dari SUMBERNYA, bukan besarnya: kas dari operasi berkelanjutan (margin + koleksi) = sehat; kas dari menunda bayar, menjual piutang, atau mengosongkan persediaan = sekali jalan dan justru sinyal bahaya. Tiga cek kualitas: (1) OCF sebelum modal kerja positif dan stabil? (2) Perubahan modal kerja searah dengan pertumbuhan penjualan yang sehat — atau melawan? (3) Apakah OCF positif karena operasi, atau karena 'memeras' pemasok dan persediaan? Maju Jaya gagal di ketiganya — itulah kenapa laba Rp54 miliarnya tidak menyelamatkannya.",
          ],
          formula: String.raw`\text{OCF} = \text{laba} + \text{depresiasi} - \Delta\text{piutang} - \Delta\text{persediaan} + \Delta\text{utang usaha} - \text{pajak dibayar}`,
          formulaNote: "Maju Jaya: 54 + 28 − 95 − 70 + 15 − 12 = −80. OCF sebelum modal kerja 70; drainase modal kerja −150; OCF/laba −148%.",
          tasks: [
            { id: "t1", text: "Hitung `ocf` dari rekonsiliasi (Rp M)" },
            { id: "t2", text: "Hitung `ocf_sebelum_wc`, `wc_drag`, dan `ocf_laba` (% , 1 desimal)" },
          ],
          expected: "ocf=-80.0 ocf_sebelum_wc=70.0 wc_drag=-150.0 ocf_laba=-148.1",
          hints: [
            "OCF = 54 + 28 − 95 − 70 + 15 − 12.",
            "OCF sebelum modal kerja = laba + depresiasi − pajak dibayar.",
            "wc_drag = −95 − 70 + 15; ocf_laba = ocf/laba × 100%.",
          ],
          code: {
            starter: `laba = 54; depr = 28; d_piutang = -95; d_persediaan = -70; d_utang = 15; pajak = -12  # Rp M\n\n# TULIS KODEMU: OCF, OCF sebelum modal kerja, drag modal kerja, OCF/laba %\nocf =\nocf_sebelum_wc =\nwc_drag =\nocf_laba =\n\nprint(f"ocf={ocf} ocf_sebelum_wc={ocf_sebelum_wc} wc_drag={wc_drag} ocf_laba={ocf_laba}")`,
            lockLines: 3,
            solution: `laba = 54; depr = 28; d_piutang = -95; d_persediaan = -70; d_utang = 15; pajak = -12  # Rp M\n\n# TULIS KODEMU: OCF, OCF sebelum modal kerja, drag modal kerja, OCF/laba %\nocf = float(laba + depr + d_piutang + d_persediaan + d_utang + pajak)\nocf_sebelum_wc = float(laba + depr + pajak)\nwc_drag = float(d_piutang + d_persediaan + d_utang)\nocf_laba = round(ocf / laba * 100, 1)\n\nprint(f"ocf={ocf} ocf_sebelum_wc={ocf_sebelum_wc} wc_drag={wc_drag} ocf_laba={ocf_laba}")`,
            checks: [
              { kind: "equal", task: "t1", name: "ocf", value: -80.0, tol: 0.01, label: "`ocf` = −80", msg: "54 + 28 − 95 − 70 + 15 − 12 = −80 — cocok dengan cerita pembuka." },
              { kind: "equal", task: "t2", name: "ocf_sebelum_wc", value: 70.0, tol: 0.01, label: "`ocf_sebelum_wc` = 70", msg: "54 + 28 − 12 = 70 — operasi inti masih menghasilkan kas." },
              { kind: "equal", task: "t2", name: "wc_drag", value: -150.0, tol: 0.01, label: "`wc_drag` = −150", msg: "−95 − 70 + 15 = −150 — modal kerja yang menenggelamkan OCF." },
              { kind: "equal", task: "t2", name: "ocf_laba", value: -148.1, tol: 0.5, label: "`ocf_laba` = −148,1%", msg: "−80/54 = −148,1% — jauh di bawah ambang 80% lesson ini." },
              { kind: "stdout_matches", task: "t2", pattern: "ocf=-80\\.0\\s+ocf_sebelum_wc=70\\.0\\s+wc_drag=-150\\.0\\s+ocf_laba=-148\\.1", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Dua perusahaan sama-sama OCF Rp70 M. A dari operasi berkelanjutan; B dari menunda bayar pemasok Rp70 M. Mana yang kualitas arusnya lebih baik?",
              options: [
                { text: "A — kas dari operasi berkelanjutan; B sekali jalan dan justru sinyal bahaya", why: "Tepat: kualitas arus kas dinilai dari sumbernya. Menunda bayar hanya menggeser kas antar-periode — pemasok akhirnya menagih.", correct: true },
                { text: "Sama baik — OCF-nya sama-sama Rp70 M", why: "Salah: angka yang sama dari sumber berbeda punya makna berbeda — itulah gunanya rekonsiliasi." },
                { text: "B — menunda bayar menunjukkan kekuatan negosiasi", why: "Salah: menunda bayar tanpa batas merusak pemasok dan akhirnya memutus pasokan — bukan kekuatan, melainkan pinjaman paksa." },
                { text: "Tidak bisa dinilai tanpa melihat laba", why: "Salah: justru rekonsiliasi laba→OCF yang menjawabnya — sumber kas terlihat di komponennya." },
              ],
            },
          ],
          reference: "Rekonsiliasi laba → OCF memisahkan operasi berkelanjutan dari drainase modal kerja; nilai kualitas dari SUMBER kas, bukan besarnya.",
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
        "Laba = opini, kas = fakta \u2014 sebagai pengingat, bukan hukum: kas juga bisa dimanipulasi lewat timing (channel stuffing, penundaan bayar). Divergensi laba vs kas = red flag #1.",
        "DSCR = raja rasio kredit: >1,25 aman; <1,0 = tidak sanggup bayar.",
        "Tren 3–5 tahun > snapshot: default diprediksi dari arah, bukan posisi.",
        "Piutang tumbuh jauh di atas penjualan = akrual agresif / pelanggan tak membayar.",
        "Opini audit WTP = kewajaran penyajian — BUKAN jaminan sehat.",
      ],
      next: { label: "CR17B — Kredit Korporasi 2", href: "/v2/learn/cr17b-corporate-credit-2" },
      quiz: [
        {
          q: "Laba naik 30% tetapi arus kas operasi negatif. Kesimpulan analis?",
          options: [
            { text: "Perusahaan hebat — ACC", why: "Terbalik: ini red flag." },
            { text: "Interogasi kualitas laba: piutang & persediaan membengkak = laba terjebak, bukan kas; selidiki sebelum putuskan", why: "Laba = opini, kas = fakta (sebagai pengingat \u2014 kas pun bisa dimanipulasi timing-nya). Divergensi laba vs kas adalah red flag #1.", correct: true },
            { text: "Arus kas tidak penting", why: "Arus kas adalah fakta yang paling penting." },
            { text: "Naikkan plafon — laba naik", why: "Menambah utang ke perusahaan dengan laba semu = mempercepat default." },
          ],
        },
        {
          q: "DSCR 1,05 dengan tren turun 5 tahun (2,8 → 1,05). Artinya?",
          options: [
            { text: "Masih di atas 1,0 — aman", why: "Hampir tidak ada buffer + arah memburuk." },
            { text: "Kritis: hampir tidak sanggup bayar + arah memburuk — satu guncangan = default; pola klasik pra-default", why: "DSCR raja rasio kredit. 1,05 tanpa buffer + tren turun = bom waktu.", correct: true },
            { text: "DSCR tidak penting", why: "DSCR adalah rasio kredit terpenting." },
            { text: "Bagus untuk ekspansi", why: "Ekspansi menambah utang ke DSCR kritis." },
          ],
        },
        {
          q: "Mengapa analis membaca TREN 5 tahun, bukan snapshot 1 tahun?",
          options: [
            { text: "Supaya laporan tebal", why: "Bukan soal tebal." },
            { text: "Perusahaan memburuk perlahan — snapshot bisa 'OK' sementara tren berteriak; default diprediksi dari arah, bukan posisi", why: "Default = proses, bukan peristiwa.", correct: true },
            { text: "Regulasi mewajibkan 5 tahun", why: "Ini praktik analisis, bukan regulasi." },
            { text: "Tidak ada bedanya", why: "Bedanya = tertidur vs terjaga." },
          ],
        },
        {
          q: "Piutang tumbuh 60% sementara penjualan tumbuh 25%. Indikasi?",
          options: [
            { text: "Penjualan hebat", why: "Penjualan naik tetapi kas tidak masuk." },
            { text: "Akrual agresif / pelanggan tidak bayar — pendapatan diakui tetapi kas tidak masuk; cek umur piutang & kebijakan kreditnya", why: "Piutang yang tumbuh jauh di atas penjualan = red flag kualitas laba.", correct: true },
            { text: "Normal", why: "Divergensi 35 poin bukan normal." },
            { text: "Bagus untuk likuiditas", why: "Piutang tak tertagih merusak likuiditas." },
          ],
        },
        {
          q: "Rasio-rasio bagus, tetapi opini audit WDP karena piutang afiliasi tak terverifikasi. Sikap analis?",
          options: [
            { text: "Tetap pakai rasio — kan angkanya bagus", why: "Angka dari laporan tak terverifikasi = fiksi." },
            { text: "Abaikan rasio: angka dari laporan tak terverifikasi = fiksi; minta WTP atau koreksi manual + covenant audit", why: "Kualitas > tren > snapshot. WDP merusak fondasi kualitas.", correct: true },
            { text: "Opini audit tidak relevan untuk kredit", why: "Opini audit adalah EWS gratis." },
            { text: "Naikkan plafon karena rasio bagus", why: "Rasio tak terverifikasi tidak boleh jadi dasar." },
          ],
        },
      ],
    },
  ],
};
