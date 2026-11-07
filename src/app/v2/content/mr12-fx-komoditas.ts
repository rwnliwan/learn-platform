import type { V2Lesson } from "../lib/types";

export const mr12: V2Lesson = {
  slug: "mr12-fx-komoditas",
  track: "Market Risk",
  module: "Derivatif, FX & Komoditas",
  title: "MR12 — FX, Komoditas & Basis Risk: Hedge yang Tidak Pernah Sempurna",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-cpo",
      eyebrow: "Langkah 1 · Basis risk",
      title: "Cerita: hedge yang berkhianat",
      prose: [
        "Produsen CPO di Kalimantan menjual 1.000 ton per bulan. Untuk aman, ia hedge penuh dengan futures CPO di bursa. Teorinya: apa pun yang terjadi pada harga, keduanya saling menghapus. Laporan ke direksi: risiko harga nol. Lalu krisis logistik: kapal tersendat, gudang penuh. Harga spot lokal anjlok (kelebihan pasokan di pelabuhan) sementara harga futures acuan naik (pasar global khawatir pasokan).",
        "Selisih keduanya — basis — melebar dari Rp2 juta menjadi Rp12 juta per ton. Hasilnya: hedge yang sempurna itu rugi Rp10 miliar — dari posisi yang diklaim risikonya nol. Twist-nya: hedge tidak menghilangkan risiko — ia menukarnya. Risiko harga (besar, terlihat) ditukar dengan basis risk (kecil biasanya, mematikan saat krisis).",
        "Dan basis risk punya sifat jahat: ia meledak tepat saat kamu paling butuh hedge bekerja — karena penyebab krisis harga dan penyebab basis melebar sering sama (gangguan logistik, misalnya). Definisi: basis = F_hedge − S_spot; P&L posisi ter-hedge = −Δ(basis). Hedge sempurna tidak menghilangkan P&L — ia mengubahnya menjadi perubahan basis. Jika basis konstan → P&L nol. Jika basis bergerak → itulah sisa risikomu.",
      ],
      formula: String.raw`\text{Basis} = F_{\text{hedge}} - S_{\text{spot}} \qquad P\&L_{\text{hedged}} = -\Delta(\text{basis})`,
      formulaNote: "F_hedge = harga futures kontrak lindung nilai; S_spot = harga spot aset yang dilindungi. Basis melebar (naik) merugikan posisi long spot + short futures — posisi produsen CPO (pegang fisik, jual futures). Posisi sebaliknya (short spot + long futures) justru UNTUNG saat basis melebar, karena P&L-nya = +Δbasis. Contoh cerita: basis 2 jt → 12 jt per ton × 1.000 ton → P&L = −Rp10 miliar. Interpretasi: hedge tidak menghapus P&L — ia mengubahnya menjadi perubahan basis. Laporkan sisa basis risk sebagai angka, bukan klaim 'risiko nol'.",
      tasks: [
        { id: "t1", text: "Hitung kerugian hedge CPO dari cerita: 1.000 ton × selisih basis." },
        { id: "t2", text: "Jelaskan kenapa basis meledak tepat saat hedge paling dibutuhkan." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Setiap hedge punya tiga lapis: risiko yang dihapus (harga), risiko yang tersisa (basis), dan risiko baru yang diciptakan (margin call futures — likuiditas!). Hedge futures butuh margin harian: saat pasar bergerak melawanmu, kamu butuh kas sebelum hedge terbukti benar. Banyak hedge yang benar secara ekonomi gagal karena kehabisan likuiditas di tengah jalan.",
        type: "risk",
      },
      reference: "Hedge = tukar risiko (harga → basis), bukan hapus. Basis meledak saat krisis.",
    },
    {
      id: "fx-tiga-wajah",
      eyebrow: "Langkah 2 · Eksposur FX",
      title: "Tiga wajah risiko FX",
      prose: [
        "Transaksi: piutang/utang dalam valas yang sudah pasti (kontrak ditandatangani) — misal piutang USD 10 juta jatuh tempo 90 hari. Hedge-able dengan forward karena jumlah & waktu diketahui. Translasi: penjabaran laporan keuangan anak perusahaan luar negeri ke mata uang induk — tidak ada arus kas aktual, tetapi mempengaruhi ekuitas & rasio modal yang dilaporkan. Biasanya tidak di-hedge (mahal, dan kerugiannya akuntansi).",
        "Ekonomi (operating): dampak jangka panjang pergerakan kurs ke daya saing — misal rupiah menguat permanen → eksportir kalah bersaing dengan Vietnam. Tidak bisa di-hedge dengan derivatif; butuh keputusan bisnis (relokasi, diversifikasi pasar). Aturan praktis: hedge yang pasti (transaksi), laporkan yang akuntansi (translasi), strategikan yang struktural (ekonomi).",
        "Tiga pertanyaan sebelum hedge FX: apakah arusnya pasti? (kalau belum pasti — misal tender yang belum menang — forward bisa menjadi spekulasi!); berapa lama? (forward panjang mahal; pertimbangkan opsi); apa yang benar-benar dilindungi — nilai rupiahnya, atau daya saingnya? Jawaban berbeda → instrumen berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Klasifikasikan: piutang USD pasti 90 hari; rugi translasi anak perusahaan; rupiah menguat permanen." },
        { id: "t2", text: "Kenapa forward untuk tender yang belum menang = spekulasi?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira semua eksposur FX harus di-hedge. Hedging berbiaya (forward points = selisih suku bunga): untuk eksposur kecil atau volatilitas rendah, biaya hedge bisa melebihi manfaatnya. Dan eksposur ekonomi tidak bisa di-hedge dengan derivatif sama sekali. Keputusan hedge = perbandingan biaya vs risiko, bukan refleks.",
        type: "pitfall",
      },
      reference: "Pasti → forward. Akuntansi → biasanya tidak. Struktural → strategi bisnis.",
    },
    {
      id: "fx-var-forward",
      eyebrow: "Langkah 3 · VaR & biaya hedge",
      title: "VaR eksposur FX vs biaya forward",
      prose: [
        "Eksposur: piutang USD 10 juta, spot 16.000, volatilitas harian 0,8%. VaR 99%/1-hari = 2,33 × 0,008 × 10 jt × 16.000 = Rp2,98 miliar. Itu risiko 1 hari jika tidak di-hedge. Alternatif: forward 90 hari. Biaya forward = forward points × nosional, dengan points ≈ (r_IDR − r_USD) × T × spot = (6% − 4,5%) × 0,25 × 16.000 = Rp60 per USD → Rp600 juta untuk USD 10 juta.",
        "Perbandingannya: risiko 1 hari Rp2,98 M vs biaya mengunci 90 hari Rp600 jt. Keputusan hedge = perbandingan biaya vs risiko — tetapi ingat, VaR 1-hari bukan risiko 90-hari (butuh scaling atau simulasi), dan forward mengunci dua arah: jika rupiah melemah, kamu tidak ikut untung (opportunity cost).",
        "Perbandingan ketiga — opsi FX, untuk eksposur yang belum pasti (Langkah 2). Premi put USD 90 hari, ATM (strike = spot 16.000), dihitung Garman–Kohlhagen dengan asumsi lesson ini (vol tahunan 12,7% dari vol harian 0,8% × √252; r_IDR 6%, r_USD 4,5%; T = 0,25 tahun; tanpa bid-ask/selisih pasar): premi ≈ Rp371 per USD → ≈Rp3,71 miliar untuk USD 10 juta (2,32% dari nosional Rp160 miliar). Bandingkan: VaR 1-hari Rp2,98 M, forward 90 hari Rp600 jt, opsi 90 hari ≈Rp3,71 M — opsi ~6× lebih mahal dari forward, dan preminya sendiri sudah melebihi VaR 1-hari. Yang dibeli premi itu: biaya maksimum yang pasti = premi (Rp3,71 M), sementara bila rupiah melemah kamu tetap ikut untung (put kedaluwarsa tak bernilai, piutang dikonversi di kurs pasar yang lebih baik). Angka ini ILUSTRATIF — premi dihitung dari asumsi lesson, bukan harga pasar; yang penting ordonya: opsi = harga fleksibilitas, dan fleksibilitas itu mahal. Peringatan horizon yang sama berlaku seperti di atas: jangan bandingkan premi 90-hari dengan VaR 1-hari seolah apel-to-apel.",
        "Untuk komoditas, hubungan spot-futures mengikuti cost of carry: F = S·e^((r+u−y)T) — r biaya pendanaan, u biaya penyimpanan (besar untuk komoditas fisik!), y convenience yield (kenyamanan memegang fisik). Contango (F>S): pasar santai, pasokan cukup. Backwardation (F<S): pasar panik kekurangan barang — convenience yield melonjak. Transisi contango → backwardation = perubahan basis yang tajam — itulah yang membunuh hedge di cerita pembuka.",
        "Carry trade rupiah: logika dan jebakannya. Forward points ≈ (r_IDR − r_USD) × T × spot — selisih BI rate vs Fed funds rate menentukan biaya hedge. Saat BI rate 6% dan Fed 4,5%, mengunci USD 90 hari 'membayar' 1,5% per tahun — bukan biaya sembarangan, melainkan cerminan covered interest parity: tidak ada untung gratisan dari selisih bunga tanpa menanggung risiko kurs. Jebakannya: saat pasar tenang, investor global meminjam USD murah dan menaruh di SBN/SRBI berbunga tinggi — arus masuk menguatkan rupiah, terlihat seperti mesin uang. Tetapi saat sentimen berbalik (taper tantrum 2013), arus keluar serentak: rupiah melemah tajam tepat saat semua carry trader ingin keluar bersamaan — unwind yang berdarah. Eksposur carry terlihat kecil di VaR masa tenang, tetapi distribusinya berekor tebal ke sisi pelemahan rupiah.",
        "Cross-currency basis — harga kelangkaan dolar. Covered interest parity bilang forward points = selisih suku bunga, tetapi di dunia nyata ada basis: premi/diskon tambahan karena dolar langka. Saat krisis (2008, Maret 2020), semua orang berebut dolar — basis USD/IDR melebar, biaya hedge USD melonjak di luar hitungan selisih bunga. Untuk bank Indonesia yang mendanai USD via cross-currency swap, basis yang melebar = biaya pendanaan naik diam-diam. Pantau basis sebagai indikator stres pendanaan valas: basis yang melebar = pasar berteriak kekurangan dolar.",
      ],
      formula: String.raw`F = S \cdot e^{(r+u-y)T}`,
      formulaNote: "F = harga futures; S = harga spot; r = biaya pendanaan; u = biaya penyimpanan (besar untuk komoditas fisik); y = convenience yield (nilai kenyamanan memegang fisik); T = tenor. Contango (F>S): pasokan cukup, pasar santai. Backwardation (F<S): convenience yield melonjak — pasar panik kekurangan barang. Interpretasi: transisi contango → backwardation = perubahan basis yang tajam — itulah yang membunuh hedge CPO di cerita pembuka.",
      tasks: [
        { id: "t1", text: "Hitung `var_fx` (VaR 99%/1-hari, rupiah) dari eksposur" },
        { id: "t2", text: "Hitung `fwd_cost` (biaya forward 90 hari, rupiah), lalu cetak keduanya" },
      ],
      expected: "var_fx=2982400000  fwd_cost=600000000",
      note: {
        title: "Sering salah",
        body: "Membandingkan VaR 1-hari langsung dengan biaya forward 90-hari sebagai apel-to-apel. Horizonnya beda: risiko 90-hari jauh lebih besar dari VaR 1-hari. Bandingkan biaya dengan risiko horizon yang sama (skala VaR atau simulasikan) — atau nyatakan eksplisit asumsi horizonnya.",
        type: "pitfall",
      },
      hints: [
        "var_fx = 2.33 * vol_harian * nosional_usd * spot.",
        "fwd_points = (r_idr - r_usd) * (90/360) * spot; fwd_cost = fwd_points * nosional_usd.",
        "Bandingkan: 2,98 M (1 hari) vs 600 jt (90 hari terkunci).",
      ],
      code: {
        starter: `# Eksposur FX: piutang USD 10 juta, jatuh tempo 90 hari\nnosional, spot, vol_harian = 10_000_000, 16_000, 0.008\nr_idr, r_usd = 0.06, 0.045\n\n# TULIS KODEMU: VaR 99%/1-hari dan biaya forward 90 hari (rupiah)\nvar_fx = \nfwd_cost = \n\nprint(f"var_fx={var_fx:.0f}  fwd_cost={fwd_cost:.0f}")`,
        lockLines: 3,
        solution: `# Eksposur FX: piutang USD 10 juta, jatuh tempo 90 hari\nnosional, spot, vol_harian = 10_000_000, 16_000, 0.008\nr_idr, r_usd = 0.06, 0.045\n\n# TULIS KODEMU: VaR 99%/1-hari dan biaya forward 90 hari (rupiah)\nvar_fx = 2.33 * vol_harian * nosional * spot\nfwd_points = (r_idr - r_usd) * (90 / 360) * spot\nfwd_cost = fwd_points * nosional\n\nprint(f"var_fx={var_fx:.0f}  fwd_cost={fwd_cost:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_fx", value: 2982400000, tol: 1, label: "`var_fx` seharusnya 2.982.400.000", msg: "2,33 × 0,008 × 10 jt × 16.000." },
          { kind: "equal", task: "t2", name: "fwd_cost", value: 600000000, tol: 1, label: "`fwd_cost` seharusnya 600.000.000", msg: "(0,06−0,045) × 0,25 × 16.000 × 10 jt." },
          { kind: "stdout_matches", task: "t2", pattern: "var_fx=2982400000\\s+fwd_cost=600000000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "VaR 1-hari Rp2,98 M vs forward 90 hari Rp600 jt vs premi opsi put ATM ≈Rp3,71 M (ilustratif). Hedge = biaya vs risiko.",
    },
    {
      id: "basis-risk",
      eyebrow: "Langkah 4 · Basis & hedge ratio",
      title: "Mengukur sisa risiko hedge",
      prose: [
        "Hedge ratio optimal (minimum-variance): h* = ρ·σ_S/σ_F — tergantung korelasi spot-futures. Jika korelasi 0,8 (bukan 1,0), hedge 1:1 over-hedge: sisanya menjadi posisi spekulatif arah basis. Untuk cross-hedge (komoditas beda, misal hedge avtur dengan futures minyak mentah), h* bisa 0,6–0,7. Hitung dari data, jangan asumsikan.",
        "Sumber basis risk: lokasi (spot lokal vs futures acuan global — kasus CPO), kualitas/grade (komoditasmu vs spesifikasi kontrak), waktu (jatuh tempo eksposur vs kontrak → harus roll → roll risk), dan cross-hedge (tidak ada futures untuk komoditasmu).",
        "Hitung dua angka: hedge ratio optimal untuk ρ=0,8, σ_S=12, σ_F=10 → h* = 0,96 (bukan 1,0!). Dan P&L hedge CPO dari cerita: basis 2 jt → 12 jt per ton, 1.000 ton → P&L = −(12−2) jt × 1.000 = −Rp10 miliar. Jangan laporkan risiko nol — laporkan risiko basis tersisa RpX.",
      ],
      formula: String.raw`h^* = \rho \cdot \frac{\sigma_S}{\sigma_F}`,
      formulaNote: "h* = hedge ratio optimal (minimum-variance); ρ = korelasi spot-futures; σ_S = volatilitas spot; σ_F = volatilitas futures. Contoh lab: ρ=0,8, σ_S=12, σ_F=10 → h* = 0,96 (bukan 1,0!). Interpretasi: h* proporsional terhadap korelasi — hedge 1:1 saat korelasi 0,7 = over-hedge; sisanya menjadi spekulasi arah basis yang tidak disadari. Hitung dari data, jangan asumsikan.",
      tasks: [
        { id: "t1", text: "Hitung `h_star` (hedge ratio optimal)" },
        { id: "t2", text: "Hitung `pnl_hedged` (P&L posisi ter-hedge CPO, rupiah), lalu cetak" },
      ],
      expected: "h_star=0.96  pnl_hedged=-10000000000",
      note: {
        title: "Sering salah",
        body: "Mengira hedge ratio optimal selalu 1:1. h* proporsional terhadap korelasi: dengan ρ=0,7, hedge 1:1 kebanyakan. Asumsi 1:1 tanpa menghitung = spekulasi basis yang tidak disadari.",
        type: "pitfall",
      },
      hints: [
        "h_star = rho * sig_S / sig_F.",
        "pnl_hedged = -(basis_akhir - basis_awal) * tonase.",
        "Tanda negatif: basis melebar merugikan long spot + short futures (posisi produsen CPO).",
      ],
      code: {
        starter: `# Hedge ratio: korelasi dan volatilitas spot vs futures\nrho, sig_S, sig_F = 0.8, 12, 10\n# CPO: basis melebar 2jt -> 12jt per ton, 1000 ton\nbasis_awal, basis_akhir, ton = 2_000_000, 12_000_000, 1000\n\n# TULIS KODEMU\nh_star = \npnl_hedged = \n\nprint(f"h_star={h_star:.2f}  pnl_hedged={pnl_hedged:.0f}")`,
        lockLines: 4,
        solution: `# Hedge ratio: korelasi dan volatilitas spot vs futures\nrho, sig_S, sig_F = 0.8, 12, 10\n# CPO: basis melebar 2jt -> 12jt per ton, 1000 ton\nbasis_awal, basis_akhir, ton = 2_000_000, 12_000_000, 1000\n\n# TULIS KODEMU\nh_star = rho * sig_S / sig_F\npnl_hedged = -(basis_akhir - basis_awal) * ton\n\nprint(f"h_star={h_star:.2f}  pnl_hedged={pnl_hedged:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "h_star", value: 0.96, tol: 1e-9, label: "`h_star` seharusnya 0.96", msg: "0,8 × 12/10. Bukan 1,0 — jangan over-hedge." },
          { kind: "equal", task: "t2", name: "pnl_hedged", value: -10000000000, tol: 1, label: "`pnl_hedged` seharusnya −10.000.000.000", msg: "−(12−2) jt × 1.000 = −Rp10 M. Sama seperti cerita." },
          { kind: "stdout_matches", task: "t2", pattern: "h_star=0\\.96\\s+pnl_hedged=-10000000000", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "h* = ρ·σ_S/σ_F dari data. P&L hedge = −Δbasis. Laporkan sisa, bukan nol.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Instrumen hedge mana, kapan",
      prose: [
        "Empat keputusan. Pertama, eksposur FX transaksi (pasti, jatuh tempo jelas) → forward: mengunci kurs tanpa premi di depan (biaya = forward points). Jangan pakai opsi jika tidak butuh fleksibilitas — premi opsi mahal untuk kepastian yang tidak dibutuhkan.",
        "Kedua, eksposur belum pasti atau butuh fleksibilitas (tender belum menang, volume tidak pasti) → opsi FX: bayar premi untuk hak tanpa kewajiban. Forward untuk eksposur tak pasti = spekulasi (jika tender gagal, kamu pegang posisi FX telanjang!). Ketiga, hedge komoditas dengan futures → hitung h* + ukur & laporkan basis risk: jangan asumsikan 1:1; estimasi dari data; selalu laporkan sisa basis risk sebagai angka.",
        "Keempat, tidak ada futures yang cocok → cross-hedge hati-hati atau terima risiko: korelasi rendah (<0,7) bisa menambah risiko (basis risk > risiko harga). Kadang keputusan terbaik = tidak hedge + siapkan buffer modal. Aturan 10 detik: pasti → forward; belum pasti → opsi; struktural → strategi bisnis; hedge = tukar risiko — ukur & laporkan sisanya; siapkan likuiditas margin.",
      ],
      tasks: [
        { id: "t1", text: "Eksportir menang tender 50%, pembayaran USD 5 juta. Instrumen apa?" },
        { id: "t2", text: "Korelasi spot-futures komoditasmu 0,6. Apa keputusanmu?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "1997: krisis Asia menghancurkan asumsi kurs stabil — baht −50%+, rupiah dari 2.400 ke 16.000 per USD (−85%). Korporasi berutang USD dengan pendapatan rupiah: kewajiban berlipat 6× dalam rupiah, bangkrut massal. VaR dari data 1994–1996 (rezim peg) menunjukkan risiko FX nyaris nol — karena rezimnya berubah, bukan karena risikonya hilang. Pelajaran: VaR buta terhadap perubahan rezim; skenario peg-jebol wajib ada.",
        type: "risk",
      },
      reference: "Pasti → forward. Belum pasti → opsi. Korelasi rendah → terima risiko + buffer.",
    },
    {
      id: "minicase-eksportir",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Eksportir yang terlindungi — sampai kontraknya batal",
      prose: [
        "Eksportir tekstil mengunci forward USD 10 juta 90 hari untuk piutang yang dijadwalkan — tetapi kontraknya belum final, masih menunggu tanda tangan pembeli. Agar aman dari penguatan rupiah, ia lock kurs sekarang. Dua minggu kemudian pembeli membatalkan pesanan: tidak ada USD yang datang.",
        "Kini eksportir memegang posisi forward telanjang USD 10 juta: jika rupiah melemah, ia untung (spekulasi yang kebetulan benar); jika rupiah menguat, ia rugi tanpa ada bisnis yang dilindungi. Lindung nilai berubah menjadi taruhan arah kurs — risiko yang justru ingin dihindari sejak awal.",
        "Tiga pelajaran: forward = kewajiban dua arah, hanya tepat untuk arus yang pasti. Untuk arus belum pasti, opsi FX memberi hak tanpa kewajiban — premi adalah harga fleksibilitas. Dan bedakan lindung nilai dari spekulasi bukan dari niatnya, melainkan dari kepastian arus yang dilindungi: tanpa arus pasti, tidak ada hedge — hanya taruhan.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa posisi eksportir berubah dari hedge menjadi spekulasi." },
        { id: "t2", text: "Instrumen apa yang seharusnya dipakai sejak awal, dan kenapa?" },
      ],
      note: {
        title: "Sering salah",
        body: "Menilai hedge dari niatnya (ingin melindungi) bukan dari kepastian arusnya. Akuntansi dan risk manager menilai dari fakta: tanpa arus kas pasti yang dilindungi, forward adalah posisi spekulatif — apapun niat awalnya.",
        type: "pitfall",
      },
      reference: "Tanpa arus pasti → bukan hedge. Belum pasti → opsi, bukan forward.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Hedge menukar risiko — ukur tukarannya",
      prose: [
        "Satu kalimat yang merangkum seluruh lesson ini: hedge tidak pernah menghapus risiko — ia menukarnya, dan tugasmu adalah mengukur harga tukarannya. Risiko harga (besar, terlihat) ditukar dengan basis risk (kecil biasanya, mematikan saat krisis) plus risiko likuiditas margin (butuh kas saat pasar melawanimu). Hedge yang 'sempurna' di spreadsheet bisa berdarah di dunia nyata.",
        "Tiga pertanyaan sebelum menyetujui hedge apa pun: (1) berapa sisa basis risk-nya dalam rupiah — bukan 'kecil', melainkan angka; (2) berapa margin call maksimum dalam skenario stres — dan dari mana kasnya; (3) apa yang terjadi pada korelasi spot-futures tepat saat krisis — karena basis meledak saat kamu paling butuh hedge bekerja.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan 'hedge menukar risiko' dengan contoh CPO di cerita pembuka." },
        { id: "t2", text: "Terapkan tiga pertanyaan ke rencana hedge FX eksportir." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk FX & komoditas. Pertama, bedakan tiga eksposur FX sebelum bicara instrumen: transaksi (pasti → forward), translasi (akuntansi → biasanya tidak di-hedge), ekonomi (struktural → keputusan bisnis, bukan derivatif). Kebanyakan kesalahan hedge FX berakar di salah klasifikasi — mengobati eksposur ekonomi dengan forward 3 bulan seperti mengobati patah tulang dengan plester. Kedua, forward = kewajiban dua arah: ia tepat untuk arus yang pasti, dan berbahaya untuk arus yang belum pasti (tender belum menang + forward = spekulasi telanjang jika tender gagal). Untuk ketidakpastian, bayar premi opsi — premi adalah harga fleksibilitas. Ketiga, hitung hedge ratio dari data (h* = ρ·σ_S/σ_F), jangan asumsikan 1:1 — dengan korelasi 0,7, hedge 1:1 adalah over-hedge yang diam-diam menjadi spekulasi basis. Keempat, untuk rupiah: ingat covered interest parity — forward points mencerminkan selisih BI rate vs suku bunga global; carry trade IDR terlihat seperti mesin uang di masa tenang tetapi berekor tebal saat unwind (taper tantrum 2013 adalah pelajarannya). Kelima, pantau cross-currency basis sebagai termometer stres dolar: basis yang melebar = biaya pendanaan valas naik diam-diam. Dan terakhir: siapkan likuiditas untuk margin — hedge futures yang benar secara ekonomi bisa gagal karena kehabisan kas di tengah jalan. Hedge yang baik = tukar risiko yang terukur + kas yang cukup untuk bertahan hingga terbukti benar.",
      },
      reference: "Hedge = tukar risiko (harga → basis + margin). Ukur sisa basis (Rp), siapkan kas margin, waspadai unwind carry.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR13.",
      ],
      tasks: [],
      summary: [
        "Hedge = tukar risiko (harga → basis), bukan hapus. Basis meledak saat krisis — tepat saat hedge paling dibutuhkan.",
        "Tiga eksposur FX: transaksi (hedge dengan forward), translasi (biasanya tidak), ekonomi (strategi bisnis).",
        "Cost of carry: F = S·e^((r+u−y)T). Contango vs backwardation = cermin kepanikan pasokan.",
        "h* = ρ·σ_S/σ_F dari data — bukan asumsi 1:1. Laporkan sisa basis risk sebagai angka.",
        "Pasti → forward; belum pasti → opsi; korelasi rendah → terima risiko + buffer; siapkan likuiditas margin.",
      ],
      next: { label: "MR13 — Risiko Likuiditas", href: "/learn/mr13-risiko-likuiditas" },
      quiz: [
        {
          q: "Piutang USD 10 juta pasti jatuh tempo 90 hari. Instrumen hedge tepat?",
          options: [
            { text: "Opsi — selalu paling aman", why: "premi opsi mahal untuk fleksibilitas yang tidak dibutuhkan." },
            { text: "Forward 90 hari — jumlah & waktu pasti, kunci kurs tanpa premi di depan", why: "eksposur pasti → forward. Kewajiban mengunci tepat karena arusnya pasti.", correct: true },
            { text: "Tidak usah hedge", why: "eksposur pasti 10 juta USD layak dikunci." },
            { text: "Beli saham", why: "tidak ada hubungannya dengan eksposur FX." },
          ],
        },
        {
          q: "Tender proyek luar negeri belum tentu menang, tapi ingin proteksi FX. Yang tepat?",
          options: [
            { text: "Forward penuh sekarang", why: "jika tender gagal, posisi FX telanjang = spekulasi murni." },
            { text: "Opsi FX — memberi hak tanpa kewajiban", why: "ketidakpastian = butuh opsi. Forward mengunci dua arah — berbahaya untuk arus tak pasti.", correct: true },
            { text: "Tidak ada yang bisa dilakukan", why: "opsi FX dirancang untuk situasi ini." },
            { text: "Pinjam USD", why: "menambah eksposur, bukan melindungi." },
          ],
        },
        {
          q: "Hedge futures 1:1 tetapi korelasi spot-futures hanya 0,7. Masalahnya?",
          options: [
            { text: "Tidak ada — 1:1 selalu benar", why: "1:1 hanya benar jika korelasi ≈ 1." },
            { text: "Over-hedge: h* = ρ·σS/σF < 1 — hedge 1:1 justru menambah risiko", why: "h* proporsional terhadap korelasi. Sisanya menjadi posisi spekulatif arah basis.", correct: true },
            { text: "Under-hedge", why: "justru kebanyakan, bukan kekurangan." },
            { text: "Korelasi tidak penting", why: "korelasi menentukan h*." },
          ],
        },
        {
          q: "Setelah hedge futures sempurna (1:1, korelasi 1), P&L yang tersisa adalah?",
          options: [
            { text: "Nol — hedge sempurna", why: "klaim risiko nol setelah hedge selalu salah." },
            { text: "Perubahan basis: −Δ(F−S) — basis risk tidak pernah nol di dunia nyata", why: "bahkan hedge sempurna pun menyisakan basis risk. Risiko harga → risiko basis.", correct: true },
            { text: "Tetap risiko harga penuh", why: "risiko harga sudah ditukar menjadi risiko basis." },
            { text: "Keuntungan pasti", why: "tidak ada keuntungan pasti dari hedge." },
          ],
        },
        {
          q: "Anak perusahaan di Singapura rugi translasi Rp50 M karena SGD melemah (tidak ada arus kas aktual). Haruskah di-hedge?",
          options: [
            { text: "Ya — semua eksposur harus di-hedge", why: "tidak semua eksposur layak di-hedge." },
            { text: "Umumnya tidak — translasi adalah efek akuntansi tanpa arus kas; biaya hedge nyata untuk kerugian yang tidak ada arusnya", why: "fokus hedge pada arus kas (transaksi), bukan angka akuntansi.", correct: true },
            { text: "Ya dengan opsi", why: "tetap buang biaya untuk risiko akuntansi." },
            { text: "Tutup anak perusahaan", why: "respons yang tidak proporsional." },
          ],
        },
        {
          q: "Dana asing meminjam USD 3% dan menaruh di SRBI 6,5% (carry trade IDR). Saat sentimen global berbalik, risiko terbesarnya?",
          options: [
            { text: "Suku bunga SRBI turun sedikit", why: "itu risiko kecil dibanding unwind." },
            { text: "Unwind serentak: arus keluar massal melemahkan rupiah tajam tepat saat semua carry trader ingin keluar bersamaan — kerugian kurs menghapus bertahun-tahun carry", why: "carry terlihat seperti mesin uang di masa tenang tetapi berekor tebal; taper tantrum 2013 adalah contoh unwind berdarah.", correct: true },
            { text: "Tidak ada risiko — carry pasti untung", why: "tidak ada yang pasti untung di pasar." },
            { text: "Biaya forward naik", why: "bukan risiko utama posisi carry." },
          ],
        },
      ],
    },
  ],
};
