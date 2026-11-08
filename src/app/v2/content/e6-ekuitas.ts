import type { V2Lesson } from "../lib/types";

export const e6: V2Lesson = {
  slug: "e6-ekuitas",
  track: "Financial Markets",
  module: "Ekuitas",
  title: "E6. Saham: Harga, Biaya & Valuasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-orderbook",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Kenapa harga bergerak tiap detik?",
      prose: [
        "Jam 09:01 saham “MAJU” di Rp1.500. Jam 09:02 jadi Rp1.487. Jam 09:05 melompat ke Rp1.520. Tidak ada berita apa-apa. Perusahaan yang sama, pabrik yang sama — kok harganya lari-larian tiap detik? Karena harga saham bukan “nilai perusahaan” — ia adalah hasil tawar-menawar terakhir antara pembeli dan penjual di order book.",
        "Order book = antrean bid (harga yang berani dibayar pembeli) dan ask (harga yang diminta penjual). Transaksi terjadi saat bid ≥ ask. Order beli besarmu “memakan” antrean ask dari termurah ke atas — harga rata-rata yang kamu dapat bisa di atas harga yang terlihat di layar. Selisihnya = slippage.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_bayar` untuk order beli 1.000 lembar" },
        { id: "t2", text: "Hitung `rata2` dan `slippage` vs ask terbaik (Rp1.500)" },
      ],
      expected: "rata2=1501.0  slippage=1.0",
      note: {
        title: "Sering salah",
        body: "Mengira harga di layar = harga yang kamu dapat. Harga layar = harga untuk 1 lot kecil. Order besarmu memakan book — slippage = pajak ukuran.",
      },
      hints: [
        "Ambil dari ask termurah: 800 lbr @1500, lalu 200 lbr @1505.",
        "rata2 = total_bayar / 1000. slippage = rata2 − 1500.",
        "Gunakan loop atau hitung langsung tiap lapis ask.",
      ],
      code: {
        starter: `asks = [(1500, 800), (1505, 500), (1510, 200)]  # (harga, lembar) antrian jual\norder_beli = 1000\n\n# TULIS KODEMU: total bayar, harga rata-rata, slippage vs 1500\nsisa = order_beli\ntotal_bayar = 0\n\nrata2 = \nslippage = \n\nprint(f"rata2={rata2:.1f}  slippage={slippage:.1f}")`,
        lockLines: 6,
        solution: `asks = [(1500, 800), (1505, 500), (1510, 200)]  # (harga, lembar) antrian jual\norder_beli = 1000\n\n# TULIS KODEMU: total bayar, harga rata-rata, slippage vs 1500\nsisa = order_beli\ntotal_bayar = 0\nfor harga, tersedia in asks:\n    ambil = min(sisa, tersedia)\n    total_bayar += ambil * harga\n    sisa -= ambil\n    if sisa == 0:\n        break\n\nrata2 = total_bayar / order_beli\nslippage = rata2 - 1500\n\nprint(f"rata2={rata2:.1f}  slippage={slippage:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_bayar", value: 1501000, tol: 1, label: "`total_bayar` seharusnya 1501000", msg: "800×1500 + 200×1505 = 1.501.000. Ask 1500 habis, merembet ke 1505." },
          { kind: "equal", task: "t2", name: "rata2", value: 1501.0, tol: 1e-9, label: "`rata2` seharusnya 1501,0", msg: "1.501.000 / 1.000 = 1501,0 — di atas harga layar 1500." },
          { kind: "equal", task: "t2", name: "slippage", value: 1.0, tol: 1e-9, label: "`slippage` seharusnya 1,0", msg: "1501,0 − 1500 = 1,0 per lembar. Di saham sepi bisa 5–10%." },
          { kind: "stdout_matches", task: "t2", pattern: "rata2=1501\\.0\\s+slippage=1\\.0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Market order “memakan” book dari ask termurah. Selalu pakai limit order.",
    },
    {
      id: "spread-likuiditas",
      eyebrow: "Langkah 2 · Spread & likuiditas",
      title: "Pajak tak terlihat dan pintu darurat",
      prose: [
        "Bid-ask spread = ask terendah − bid tertinggi. Setiap round-trip kamu membayar ≈ spread ini — upeti untuk market maker yang bersedia jadi lawan transaksimu. Saham blue chip LQ45: spread 0,1–0,2%. Saham gorengan: bisa 2–5% — kamu rugi 5% bahkan sebelum harga bergerak.",
        "Likuiditas = seberapa mudah menjual cepat tanpa menggerakkan harga. Proksi praktis: nilai transaksi harian, spread, dan kapitalisasi. Aturan: batasi posisimu < 1% dari rata-rata transaksi harian — kalau tidak, KAMU menjadi pasar: masuk mengerek harga, keluar menekan harga.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Biaya trading cuma fee broker 0,15%.” Total biaya = fee broker + spread + market impact + pajak. Di saham tidak likuid, spread + impact bisa 10× lipat fee broker.",
      },
      reference: "Total biaya = fee + spread + market impact. Posisi < 1% transaksi harian.",
    },
    {
      id: "valuasi",
      eyebrow: "Langkah 3 · Valuasi dasar",
      title: "Gordon Growth Model: harga wajar dari dividen",
      prose: [
        "Dua pendekatan populer: P/E ratio = harga per lembar / laba per lembar — “berapa tahun laba untuk balik modal”. Bukan “makin kecil makin murah” otomatis — P/E rendah bisa berarti pasar meramalkan laba akan anjlok.",
        "Gordon Growth Model: jika dividen tumbuh konstan selamanya, P₀ = D₁/(r − g). Dividen tahun depan Rp500, tumbuh 5%/tahun, required return 12% → harga wajar = 500/(0,12−0,05) = Rp7.143. Balik: jika harga pasar Rp10.000, pertumbuhan tersirat g = r − D₁/P = 7%.",
      ],
      formula: String.raw`P_0 = \frac{D_1}{r - g} \qquad \text{syarat: } r > g`,
      formulaNote: "P₀ = harga wajar; D₁ = dividen tahun depan; r = required return; g = pertumbuhan abadi.",
      tasks: [
        { id: "t1", text: "Hitung `P0` (harga wajar Gordon)" },
        { id: "t2", text: "Hitung `g_tersirat` dari harga pasar Rp10.000" },
      ],
      expected: "P0=7142.86  g_tersirat=0.07",
      note: {
        title: "Sering salah",
        body: "Terpaku pada satu angka valuasi. Gordon SANGAT sensitif pada asumsi g: ubah g 1% → harga bergeser ~15%. Valuasi = rentang, bukan titik.",
      },
      hints: [
        "P0 = D1 / (r − g). Masukkan D1=500, r=0,12, g=0,05.",
        "g tersirat = r − D1/harga_pasar.",
        "g_tersirat = 0.12 - 500/10000",
      ],
      code: {
        starter: `D1 = 500   # dividen tahun depan\ng = 0.05   # tumbuh 5%/tahun\nr = 0.12   # required return 12%\nharga_pasar = 10_000\n\n# TULIS KODEMU: harga wajar dan pertumbuhan tersirat\nP0 = \ng_tersirat = \n\nprint(f"P0={P0:.2f}  g_tersirat={g_tersirat:.2f}")`,
        lockLines: 4,
        solution: `D1 = 500   # dividen tahun depan\ng = 0.05   # tumbuh 5%/tahun\nr = 0.12   # required return 12%\nharga_pasar = 10_000\n\n# TULIS KODEMU: harga wajar dan pertumbuhan tersirat\nP0 = D1 / (r - g)\ng_tersirat = r - D1 / harga_pasar\n\nprint(f"P0={P0:.2f}  g_tersirat={g_tersirat:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "P0", value: 7142.86, tol: 0.01, label: "`P0` sekitar 7142,86", msg: "500 / (0,12 − 0,05) = 7142,86. Syarat: r > g." },
          { kind: "equal", task: "t2", name: "g_tersirat", value: 0.07, tol: 1e-9, label: "`g_tersirat` seharusnya 0,07", msg: "0,12 − 500/10000 = 0,07. Pasar membayar Rp10.000 = mengasumsikan tumbuh 7%." },
          { kind: "stdout_matches", task: "t2", pattern: "P0=7142\\.86\\s+g_tersirat=0\\.07", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "P₀ = D₁/(r−g). P/E = harga/laba; murah/mahal hanya relatif terhadap pertumbuhan ekspektasi.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang eksekusi order dan biaya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Bid tertinggi 1495, ask terendah 1500. Kamu pasang market order BELI. Di harga berapa tereksekusi?",
          options: [
            { text: "1495", why: "Salah: 1495 = harga bid (pembeli), bukan harga yang bisa kamu beli." },
            { text: "1497,5 (tengah-tengah)", why: "Salah: market order tidak dieksekusi di tengah — ia memakan ask." },
            { text: "1500 (ask terendah) — atau lebih tinggi jika order besar", why: "Benar: market order beli memakan ask dari termurah; order besar merembet ke atas.", correct: true },
            { text: "Menunggu sampai ada yang jual di 1495", why: "Salah: itu limit order, bukan market order." },
          ],
        },
        {
          q: "Saham X spread 4%. Kamu day-trading target untung 1% per trade. Apa masalahnya?",
          options: [
            { text: "Tidak ada masalah", why: "Salah: biaya round-trip ≈ spread = 4% > target 1%." },
            { text: "Spread 4% > target 1% — kamu rugi bahkan jika “prediksimu benar”", why: "Benar: target harus MELEBIHI total biaya (spread + fee + impact).", correct: true },
            { text: "Fee broker terlalu mahal", why: "Salah: masalah utamanya spread 4%, bukan fee broker." },
            { text: "Harus tambah modal", why: "Salah: tambah modal tidak mengubah aritmetika spread vs target." },
          ],
        },
      ],
    },
    {
      id: "minicase-jaya",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Saham “murah” P/E 5×: borong?",
      prose: [
        "Saham “JAYA” diperdagangkan Rp1.000 dengan EPS Rp200 → P/E 5×. IHSG rata-rata P/E 15×. Temanmu: “Diskon 67%! Borong!” Kamu cek: laba JAYA turun 3 tahun berturut-turut (Rp400 → Rp300 → Rp200), utang naik 2×, dan nilai transaksi hariannya cuma Rp300 juta.",
        "Pertanyaan: (a) Mengapa P/E 5× belum tentu murah? (b) Hitung risiko likuiditas jika temanmu mau masuk Rp50 juta. (c) Data tambahan apa yang kamu minta sebelum memutuskan?",
        "Pembahasan: (a) P/E memakai laba masa lalu. Jika laba tahun depan tinggal Rp100, P/E forward = 10× — pasar mendiskon karena meramalkan pemburukan. Ini kandidat value trap. (b) Rp50 jt / Rp300 jt = 17% dari transaksi harian — jauh di atas batas aman 1%. Masuknya menggerakkan harga naik, keluarnya menekan harga jatuh. (c) Laporan keuangan 3 tahun (arus kas operasi vs laba bersih?), struktur utang dan jadwal jatuh tempo, siapa pengendali dan rekam jejaknya, dan alasan fundamental kenapa laba turun.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Value trap = P/E rendah + fundamental memburuk. Risiko likuiditas (posisi 17% dari transaksi harian) bisa menghapus seluruh “diskon” valuasi saat kamu butuh keluar.",
      },
      reference: "P/E rendah ≠ murah. Tanya pertumbuhan tersirat dan cek likuiditas dulu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Saham seperti apa untuk tujuanmu?",
      prose: [
        "Dana pensiun 20 tahun, tidak mau pusing → blue chip likuid/ETF indeks: likuid, fundamental mapan, diversifikasi. Suka riset, cari mispricing → mid/small cap + valuasi ketat: peluang mispricing lebih besar, tapi wajib hitung likuiditas dan batasi posisi.",
        "Butuh dividen rutin → saham dividen: cek dividend yield DAN payout ratio — yield 10% dengan payout 95% = dividen terancam dipotong. Tergoda saham “terbang” tanpa fundamental → jangan (atau batasi <5% “uang jajan”): spread lebar + tanpa jangkar valuasi = kasino.",
        "Aturan 10 detik: harga = hasil tawar-menawar terakhir, bukan vonis nilai perusahaan. Hitung total biaya: fee + spread + market impact. P/E rendah ≠ murah.",
      ],
      tasks: [],
      reference: "Sesuaikan saham dengan horizon, waktu riset, dan kebutuhan arus kas.",
    },
    {
      id: "corporate-action",
      eyebrow: "Langkah 7 · Pendalaman: corporate action",
      title: "Rights issue, stock split, dan harga semu di IDX",
      prose: [
        "Corporate action = keputusan emiten yang mengubah jumlah lembar atau hakmu. Tiga yang paling sering di IDX: rights issue (HMETD — hak memesan efek terlebih dahulu: kamu ditawari saham baru dengan harga diskon, proporsional dengan kepemilikanmu), stock split (1 lembar jadi 2 — harga per lembar turun setengah, nilaimu tetap), dan dividen saham/bonus. Semuanya mengubah harga tercatat TANPA mengubah kekayaanmu — dan di sinilah investor yang tidak paham panik.",
        "Contoh rights issue 1:2 — setiap 2 lembar lama berhak menebus 1 lembar baru @Rp800, saat harga pasar (cum-rights) Rp1.000. Harga teoretis ex-rights (TERP) = (2×1.000 + 1×800) ÷ 3 = Rp933,33. Pagi ex-date, harga “jatuh” 6,7% — bukan rugi, melainkan nilai Rp66,67 per lembar lama pindah ke rights yang kamu pegang. Tiga pilihanmu: tebus (tambah modal, pertahankan porsi), jual rights-nya di pasar, atau diam dan terima dilusi — tidak ada opsi keempat.",
        "Free float = porsi saham yang benar-benar beredar di publik (bukan milik pengendali). Kenapa penting? Syarat masuk indeks LQ45/IDX30, penentu likuiditas, dan — yang paling praktis — saham dengan free float di bawah 10% sangat mudah “digoreng”: sedikit modal bisa menggerakkan harga liar karena barang yang tersedia sedikit. Cek free float sebelum menyentuh saham lapis tiga; angka ini ada di fact sheet IDX.",
        "Mode kegagalan klasik: (1) panik menjual saat harga “anjlok” pasca ex-date — padahal total nilaimu (saham + rights) sama; (2) mengabaikan rights sampai kedaluwarsa — hangus, dan kepemilikanmu terdilusi gratis; (3) menghitung return dari harga unadjusted — chart yang belum disesuaikan menampilkan jurang palsu. Aturan praktis: selalu pakai adjusted price untuk return; rights = tebus, jual, atau terima dilusi; free float kecil = volatilitas besar.",
      ],
      formula: String.raw`P_{ex} = \frac{N_{lama} \times P_{cum} + N_{baru} \times P_{rights}}{N_{lama} + N_{baru}}`,
      formulaNote: "P_ex = harga teoretis ex-rights (TERP); P_cum = harga sebelum ex-date; N_lama = lembar lama per hak; P_rights = harga tebus; N_baru = lembar baru per hak. Contoh: (2×1.000 + 1×800) ÷ 3 = Rp933,33. Harga tercatat Rp933 tanpa penjelasan = sudah adjust; “jatuh” dari Rp1.000 = belum adjust → return palsu −6,7%.",
      tasks: [
        { id: "t1", text: "Hitung `terp` (harga teoritis ex-rights)" },
        { id: "t2", text: "Hitung `diskon_pct` (penurunan semu, %)" },
      ],
      expected: "terp=933.33  diskon_pct=6.67",
      hints: [
        "terp = (n_lama×p_cum + n_baru×p_rights) ÷ (n_lama+n_baru).",
        "diskon_pct = (p_cum − terp) ÷ p_cum × 100.",
      ],
      code: {
        starter: `n_lama = 2; p_cum = 1000\nn_baru = 1; p_rights = 800\n\n# TULIS KODEMU\nterp = \ndiskon_pct = \n\nprint(f"terp={terp:.2f}  diskon_pct={diskon_pct:.2f}")`,
        lockLines: 2,
        solution: `n_lama = 2; p_cum = 1000\nn_baru = 1; p_rights = 800\n\n# TULIS KODEMU\nterp = (n_lama * p_cum + n_baru * p_rights) / (n_lama + n_baru)\ndiskon_pct = (p_cum - terp) / p_cum * 100\n\nprint(f"terp={terp:.2f}  diskon_pct={diskon_pct:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "terp", value: 933.333, tol: 0.01, label: "`terp` seharusnya 933,33", msg: "(2×1000 + 1×800) ÷ 3 = 933,33. Itu harga wajar pasca-rights." },
          { kind: "equal", task: "t2", name: "diskon_pct", value: 6.6667, tol: 0.01, label: "`diskon_pct` sekitar 6,67", msg: "(1000 − 933,33) ÷ 1000 × 100 = 6,67%. Semu — nilaimu pindah ke rights." },
          { kind: "stdout_matches", task: "t2", pattern: "terp=933\\.33\\s+diskon_pct=6\\.67", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: harga ≠ nilai saat ada corporate action",
        body: "Corporate action mengubah jumlah potongan kue, bukan ukuran kuenya — harga per lembar “jatuh” padahal kekayaanmu utuh. Empat heuristik. Pertama: yang penting = lembar × harga wajar, bukan harga per lembar — stock split 1:2 tidak membuatmu lebih kaya atau lebih miskin, hanya mengubah denominasi; yang berubah hanya psikologimu. Kedua: rights issue adalah ujian — tebus, jual, atau terima dilusi; diam = memilih opsi terburuk (membayar dilusi tanpa mendapat apa-apa); tandai tanggal ex-date di kalender. Ketiga: free float adalah oksigen — saham dengan 5% barang di publik bisa naik 20% sehari dan turun 30% keesokannya tanpa berita apa pun; itu bukan “peluang”, itu jebakan likuiditas; cek fact sheet IDX sebelum sentuh lapis tiga. Keempat: selalu hitung return dari harga adjusted — chart unadjusted menampilkan jurang palsu pasca corporate action yang bisa memicu keputusan jual panik; data yang salah = keputusan yang salah. Aturan 10 detiknya: lihat harga turun tajam tanpa berita → cek dulu kalender corporate action sebelum menyentuh tombol jual.",
      },
      reference: "Harga ex-date “jatuh” = nilai pindah ke rights. Free float = oksigen likuiditas.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Harga saham = hasil match terakhir di order book (bid vs ask), bukan vonis nilai perusahaan.",
        "Total biaya trading = fee + spread + market impact. Di saham sepi, spread = pembunuh senyap.",
        "Likuiditas = pintu darurat; batasi posisi < 1% transaksi harian.",
        "P/E = harga/laba; murah/mahal hanya relatif terhadap pertumbuhan ekspektasi. Gordon: P₀ = D₁/(r−g).",
        "Waspada value trap: P/E rendah + fundamental memburuk = jebakan, bukan diskon.",
      ],
      next: { label: "E7 — Return & Risiko", href: "/v2/learn/e7-return-risiko" },
      quiz: [
        {
          q: "Gordon: D1=Rp500, r=12%, g=5%. Harga wajar?",
          options: [
            { text: "Rp4.167", why: "Salah: itu 500/0,12 — lupa mengurangkan g dari r." },
            { text: "Rp7.143 (500 / 0,07)", why: "Benar: 500/(0,12−0,05) = 7.143. Sensitif: ubah g 1% → harga bergeser ~15%.", correct: true },
            { text: "Rp10.000", why: "Salah: itu harga pasar di contoh — bukan hasil Gordon." },
            { text: "Rp500", why: "Salah: itu dividennya, bukan harga wajarnya." },
          ],
        },
        {
          q: "Saham P/E 5×, laba turun 3 tahun berturut-turut, utang naik 2×. Kesimpulan?",
          options: [
            { text: "Murah — langsung borong", why: "Salah: P/E rendah bisa = pasar meramalkan laba makin turun." },
            { text: "Waspada value trap: P/E rendah mencerminkan ekspektasi laba makin turun", why: "Benar: verifikasi dengan laporan keuangan sebelum menyimpulkan murah.", correct: true },
            { text: "P/E tidak relevan", why: "Salah: P/E relevan — tapi harus dibaca bersama tren laba." },
            { text: "Pasti akan naik", why: "Salah: tidak ada yang “pasti” dari satu rasio." },
          ],
        },
        {
          q: "Rata-rata transaksi harian saham Rp300 jt. Batas posisi aman untukmu?",
          options: [
            { text: "Rp150 jt — mumpung murah", why: "Salah: 50% dari transaksi harian = kamu menjadi pasar." },
            { text: "Maksimal ~Rp3 jt (1% dari transaksi harian)", why: "Benar: di atas itu, masuk mengerek harga dan keluar menekan harga.", correct: true },
            { text: "Rp300 jt — kuasai pasarnya", why: "Salah: itu 100% transaksi harian — tidak bisa keluar tanpa menggerakkan harga." },
            { text: "Tidak ada batas", why: "Salah: likuiditas selalu membatasi ukuran posisi yang aman." },
          ],
        },
      ],
    },
  ],
};
