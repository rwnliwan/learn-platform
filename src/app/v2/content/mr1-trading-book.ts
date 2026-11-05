import type { V2Lesson } from "../lib/types";

export const mr1: V2Lesson = {
  slug: "mr1-trading-book",
  track: "Market Risk",
  module: "Fondasi Risiko Pasar",
  title: "MR1 — Trading Book vs Banking Book: Satu Klasifikasi, Beda Nasib Modal",
  estMinutes: 55,
  steps: [
    {
      id: "dua-kamar",
      eyebrow: "Langkah 1 · Dua kamar bank",
      title: "Cerita: obligasi yang pindah kamar",
      prose: [
        "Bank Nusantara memegang obligasi korporasi Rp500 miliar. Selama ini obligasi itu dicatat di banking book — diniatkan dipegang sampai jatuh tempo, nilainya di buku stabil, P&L tenang seperti air danau. Lalu direktur treasury yang baru berkata: obligasi ini likuid, bisa dijual kapan saja kalau harga bagus. Pindahkan ke trading book.",
        "Sekali pindah kamar, segalanya berubah. Obligasi itu kini dinilai mark-to-market setiap hari dan P&L berayun Rp±8 miliar per hari. Yang lebih mengejutkan: kebutuhan modal bank melonjak, karena trading book wajib dihitung VaR-nya dan dikenai capital charge risiko pasar — sementara di banking book ia hanya makan capital charge risiko kredit yang jauh lebih kecil.",
        "Keputusan itu tidak bisa dibolak-balik seenaknya. Regulator menetapkan boundary ketat: ada instrumen yang wajib masuk trading book, ada yang dilarang, dan reklasifikasi butuh persetujuan. Trading book = diniatkan dagang, mark-to-market harian, VaR/ES harian. Banking book = dipegang lama, amortised cost, P&L akrual halus — tetapi tetap punya risiko suku bunga struktural pada banking book (misal: kredit fixed-rate 10 tahun yang didanai deposito 1 bulan akan tergerus marginnya saat suku bunga naik). Ketenangan akrual bukan berarti tanpa risiko.",
      ],
      tasks: [
        { id: "t1", text: "Dengan kata-katamu sendiri, tulis satu kalimat: apa beda trading book dan banking book?" },
        { id: "t2", text: "Sebutkan tiga hal yang ikut berubah saat posisi pindah kamar: cara ukur, modal, dan perilaku P&L." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira banking book bebas risiko pasar. Yang bebas hanya fluktuasi harga harian — risiko suku bunga struktural (IRRBB) tetap ada: kredit fixed-rate 10 tahun yang didanai deposito 1 bulan akan tergerus marginnya saat suku bunga naik, walau P&L hariannya terlihat tenang.",
        type: "pitfall",
      },
      reference: "Trading book: mark-to-market + VaR/ES harian. Banking book: amortised cost + IRRBB.",
    },
    {
      id: "faktor-risiko",
      eyebrow: "Langkah 2 · Faktor risiko",
      title: "Lima arah angin yang menggerakkan portofolio",
      prose: [
        "Faktor risiko adalah variabel pasar yang pergerakannya mengubah nilai portofolio. Lima yang utama: suku bunga, nilai tukar (FX), harga ekuitas, credit spread, dan harga komoditas. Setiap posisi dipetakan ke satu atau lebih faktor — obligasi fixed-rate ke suku bunga plus credit spread penerbitnya, saham ke harga ekuitas, opsi saham ke ekuitas plus volatilitas implisit.",
        "Pemetaan ini wajib karena risiko pasar tidak diukur per posisi satu-satu, melainkan per faktor lalu diagregasi. Dua posisi berbeda yang sensitif ke faktor yang sama bisa saling menghapus (hedge) atau justru menumpuk (konsentrasi). Tanpa pemetaan faktor, kamu buta terhadap keduanya.",
        "Bayangkan faktor risiko seperti arah angin dan posisi seperti layar kapal. Sensitivitas adalah luas layar yang menghadap tiap arah angin. Kapal yang layarnya seimbang ke semua arah tidak oleng ke satu arah — itulah diversifikasi. Semua layar menghadap utara saat angin utara bertiup kencang — itulah konsentrasi risiko.",
      ],
      tasks: [
        { id: "t1", text: "Petakan tiga posisi ini ke faktornya: obligasi fixed-rate, kredit USD ke eksportir, opsi saham." },
        { id: "t2", text: "Jelaskan kenapa risiko dua posisi tidak boleh dijumlahkan mentah." },
      ],
      note: {
        title: "Sering salah",
        body: "Menjumlahkan risiko tiap posisi langsung. Yang benar: agregasi per faktor dengan memperhitungkan korelasi. Posisi A rugi Rp10 M saat suku bunga naik dan posisi B untung Rp10 M saat suku bunga naik memberi risiko bersih sekitar nol (hedge alami) — bukan Rp20 M.",
        type: "pitfall",
      },
      reference: "Petakan posisi ke faktor dulu, agregasikan dengan korelasi — jangan jumlah mentah.",
    },
    {
      id: "sensitivitas-dv01",
      eyebrow: "Langkah 3 · Sensitivitas",
      title: "DV01: bahasa rupiah untuk risiko suku bunga",
      prose: [
        "Sensitivitas mengukur seberapa besar nilai posisi V berubah jika faktor risiko f bergerak sedikit. Ini bahasa umum semua risiko pasar: tiap faktor bergerak 1 unit, nilai berubah S rupiah. Contoh paling terkenal di suku bunga adalah DV01 — perubahan nilai obligasi jika yield naik 1 basis poin (0,01%).",
        "Ambil obligasi Rp1 miliar, tenor 10 tahun, kupon 7%, yield 7%. Hitung harganya, naikkan yield 1 bp, hitung lagi. Selisihnya adalah DV01 — sekitar Rp700 ribu. Artinya: tiap yield naik 1 bp, pemegang obligasi ini rugi sekitar Rp700 ribu. Satu angka, langsung bisa dipakai untuk limit dan P&L explain.",
      ],
      formula: String.raw`S = \frac{\partial V}{\partial f} \approx \frac{\Delta V}{\Delta f}`,
      formulaNote: "S = sensitivitas: perubahan nilai per 1 unit faktor risiko. V = nilai portofolio; f = faktor risiko (yield, harga saham, kurs); ∂V/∂f = turunan eksak, ΔV/Δf = versi diskrit yang dipakai praktisi.",
      tasks: [
        { id: "t1", text: "Hitung `p0`, `p1`, dan `dv01` dari fungsi harga yang sudah disediakan" },
        { id: "t2", text: "Cetak DV01 dengan `print` sesuai format" },
      ],
      expected: "DV01 = Rp 702,034",
      note: {
        title: "Sering salah",
        body: "Menghitung selisih harga dengan arah terbalik sehingga DV01 negatif. DV01 didefinisikan positif sebagai besarnya penurunan harga saat yield naik: p0 − p1, bukan p1 − p0.",
        type: "pitfall",
      },
      hints: [
        "Harga di yield awal sudah bisa dihitung: p0 = harga_obligasi(y0).",
        "Kenaikan 1 bp = 0.0001 dalam desimal: p1 = harga_obligasi(y0 + 0.0001).",
        "dv01 = p0 - p1. Harga turun saat yield naik, jadi selisihnya positif.",
      ],
      code: {
        starter: `nominal = 1_000_000_000  # Rp1 miliar\nkupon = 0.07\nn = 10  # tenor tahun\ny0 = 0.07  # yield awal\n\ndef harga_obligasi(y):\n    pv = sum((nominal * kupon) / (1 + y) ** t for t in range(1, n + 1))\n    pv += nominal / (1 + y) ** n\n    return pv\n\n# TULIS KODEMU: harga di y0, harga di y0+1bp, lalu DV01\np0 = \np1 = \ndv01 = \n\nprint(f"DV01 = Rp {dv01:,.0f}")`,
        lockLines: 11,
        solution: `nominal = 1_000_000_000  # Rp1 miliar\nkupon = 0.07\nn = 10  # tenor tahun\ny0 = 0.07  # yield awal\n\ndef harga_obligasi(y):\n    pv = sum((nominal * kupon) / (1 + y) ** t for t in range(1, n + 1))\n    pv += nominal / (1 + y) ** n\n    return pv\n\n# TULIS KODEMU: harga di y0, harga di y0+1bp, lalu DV01\np0 = harga_obligasi(y0)\np1 = harga_obligasi(y0 + 0.0001)\ndv01 = p0 - p1\n\nprint(f"DV01 = Rp {dv01:,.0f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "dv01", label: "`dv01` terdefinisi", msg: "Buat variabel bernama dv01 di bagian kode editable." },
          { kind: "equal", task: "t1", name: "dv01", value: 702034, tol: 10, label: "`dv01` seharusnya ~702.034", msg: "dv01 = harga_obligasi(0.07) − harga_obligasi(0.0701). Cek urutan pengurangannya." },
          { kind: "stdout_matches", task: "t2", pattern: "DV01 = Rp 702,034", label: "`print` menampilkan DV01", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "DV01 = P(y) − P(y + 1bp). Tenor lebih panjang → DV01 lebih besar.",
    },
    {
      id: "pnl-explain",
      eyebrow: "Langkah 4 · P&L explain",
      title: "Membedah P&L harian per faktor risiko",
      prose: [
        "Dengan sensitivitas tiap faktor, P&L harian bisa dijelaskan sebagai jumlah dari sensitivitas × pergerakan faktor. Ini aproksimasi orde-1: perubahan nilai ≈ jumlah kontribusi tiap faktor. Sisa yang tidak dijelaskan — unexplained P&L — adalah sinyal: ada faktor yang belum dimodelkan, atau hubungan nilai-faktor tidak linear.",
        "Contoh desk multi-aset kemarin. Sensitivitas: suku bunga −Rp850 jt per +100 bp, FX +Rp120 jt per +Rp100, ekuitas +Rp300 jt per +1%, spread −Rp200 jt per +10 bp. Pergerakan kemarin: yield +35 bp, rupiah melemah Rp150, IHSG −0,8%, spread +20 bp. Kalikan satu-satu, jumlahkan — itulah prediksi P&L dari model. Bandingkan dengan aktual Rp−510 jt.",
      ],
      formula: String.raw`\Delta V \approx \sum_{i} S_i \cdot \Delta f_i`,
      formulaNote: "ΔV = perubahan nilai portofolio; S_i = sensitivitas ke faktor ke-i; Δf_i = pergerakan faktor ke-i. Selisih prediksi vs P&L aktual = unexplained P&L — undangan investigasi.",
      tasks: [
        { id: "t1", text: "Hitung `total` prediksi P&L dari dict `sens` dan `move`" },
        { id: "t2", text: "Hitung `unexplained` = aktual − prediksi, lalu cetak keduanya" },
      ],
      expected: "total=-757500000  unexplained=247500000",
      note: {
        title: "Kaitan ke risk",
        body: "P&L explain bukan soal prediksi akurat — ia mesin pendeteksi anomali. Unexplained besar = undangan investigasi, bukan kegagalan model: mungkin ada faktor yang belum dimasukkan, harga input basi, atau butuh koreksi orde-2 (gamma/convexity).",
        type: "risk",
      },
      hints: [
        "Kontribusi tiap faktor = sens[k] * move[k]. Jumlahkan semuanya untuk total.",
        "unexplained = pnl_aktual - total. Perhatikan tanda negatifnya.",
        "total = sum(sens[k] * move[k] for k in sens)",
      ],
      code: {
        starter: `sens = {"Suku bunga": -850_000_000, "FX": 120_000_000, "Ekuitas": 300_000_000, "Spread": -200_000_000}\nmove = {"Suku bunga": 0.35, "FX": 1.5, "Ekuitas": -0.8, "Spread": 2.0}\npnl_aktual = -510_000_000\n\n# TULIS KODEMU: total prediksi dan unexplained\ntotal = \nunexplained = \n\nprint(f"total={total:.0f}  unexplained={unexplained:.0f}")`,
        lockLines: 3,
        solution: `sens = {"Suku bunga": -850_000_000, "FX": 120_000_000, "Ekuitas": 300_000_000, "Spread": -200_000_000}\nmove = {"Suku bunga": 0.35, "FX": 1.5, "Ekuitas": -0.8, "Spread": 2.0}\npnl_aktual = -510_000_000\n\n# TULIS KODEMU: total prediksi dan unexplained\ntotal = sum(sens[k] * move[k] for k in sens)\nunexplained = pnl_aktual - total\n\nprint(f"total={total:.0f}  unexplained={unexplained:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: -757500000, tol: 1, label: "`total` seharusnya −757.500.000", msg: "Kalikan tiap pasangan sens × move lalu jumlahkan: −297,5 + 180 − 240 − 400 (juta)." },
          { kind: "equal", task: "t2", name: "unexplained", value: 247500000, tol: 1, label: "`unexplained` seharusnya 247.500.000", msg: "unexplained = pnl_aktual − total = −510 jt − (−757,5 jt)." },
          { kind: "stdout_matches", task: "t2", pattern: "total=-757500000\\s+unexplained=247500000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ΔV ≈ Σ S_i Δf_i. Unexplained = aktual − prediksi → investigasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Klasifikasi dan pengukuran dalam 10 detik",
      prose: [
        "Lima keputusan yang merangkum lesson ini. Pertama, posisi untuk trading jangka pendek atau market-making masuk trading book: mark-to-market harian, VaR/ES harian, market risk capital charge, siapkan limit. Kedua, posisi dipegang sampai jatuh tempo masuk banking book: amortised cost, P&L akrual halus — tetapi wajib ukur IRRBB, ketenangan akrual bukan izin untuk buta risiko.",
        "Ketiga, instrumen di daftar wajib regulator mengikuti presumptive list: ekuitas listed dan sekuritisasi tertentu wajib trading book, niat manajemen tidak relevan. Keempat, reklasifikasi antar book butuh justifikasi genuine plus persetujuan — pahami dampaknya ke modal sebelum pindah, seperti cerita Bank Nusantara. Kelima, untuk posisi apa pun: petakan ke faktor dulu, hitung sensitivitas per faktor dalam rupiah per unit, agregasikan dengan korelasi.",
        "Aturan praktisnya: tanya dulu ini book apa, petakan faktor risikonya, ukur sensitivitasnya dalam rupiah per unit — bukan sekadar besar atau kecil — lalu agregasikan dengan korelasi, jangan jumlah mentah.",
      ],
      tasks: [
        { id: "t1", text: "Urutkan lima keputusan di atas untuk kasus: obligasi korporat yang tidak diperdagangkan 6 bulan." },
        { id: "t2", text: "Tuliskan aturan praktis 10 detik dengan kata-katamu sendiri." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Sebelum 2008, bank memindahkan sekuritisasi berisiko ke trading book karena capital charge market risk lebih ringan — regulatory arbitrage tanpa pengurangan risiko sesungguhnya. Saat pasar membeku, tidak ada harga pasar (mark-to-model), VaR dari data masa tenang tidak relevan, dan kerugian Rp800 miliar menghantam modal Rp90 miliar. Klasifikasi menentukan berapa penyangga yang kamu bawa ke medan perang.",
        type: "risk",
      },
      reference: "Book → faktor → sensitivitas (Rp/unit) → agregasi berkorelasi.",
    },
    {
      id: "minicase-reklasifikasi",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Reklasifikasi Rp500 miliar: gratis atau mahal?",
      prose: [
        "Bank Nusantara memegang obligasi korporasi Rp500 miliar, tenor 7 tahun, di banking book. Treasury mengusulkan pindah ke trading book agar fleksibel dijual. Datanya: DV01 portofolio −Rp3,2 miliar per +100 bp, volatilitas yield harian 8 bp. Di banking book, capital charge risiko kredit ≈ Rp40 miliar. Di trading book, estimasi VaR 99%/10-hari ≈ Rp55 miliar → capital charge pasar bisa 3–4× VaR, sekitar Rp165–220 miliar.",
        "Hitung dulu: sensitivitas per 1 bp = Rp3,2 M / 100 = Rp32 juta per bp. Volatilitas harian 8 bp → 1-sigma P&L harian ≈ Rp32 juta × 8. Bandingkan ayunan harian itu dengan klaim fleksibilitas — dan bandingkan Rp40 miliar vs Rp165–220 miliar sebelum menjawab apakah reklasifikasi ini gratis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pnl_1sigma` = sensitivitas per bp × vol harian" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "pnl_1sigma=256000000",
      note: {
        title: "Sering salah",
        body: "Lupa mengubah satuan DV01 dari per-100-bp ke per-bp sebelum dikali volatilitas harian (bp). Rp3,2 miliar adalah per 100 bp — bagi dulu dengan 100.",
        type: "pitfall",
      },
      hints: [
        "Sensitivitas per 1 bp = dv01_per_100bp / 100. Ambil nilai absolutnya.",
        "Kalikan dengan vol_harian_bp untuk dapat 1-sigma P&L harian.",
        "pnl_1sigma = abs(dv01_per_100bp) / 100 * vol_harian_bp",
      ],
      code: {
        starter: `dv01_per_100bp = -3_200_000_000  # Rp per +100 bp\nvol_harian_bp = 8  # bp, standar deviasi yield harian\n\n# TULIS KODEMU: 1-sigma P&L harian (rupiah)\npnl_1sigma = \n\nprint(f"pnl_1sigma={pnl_1sigma:.0f}")`,
        lockLines: 2,
        solution: `dv01_per_100bp = -3_200_000_000  # Rp per +100 bp\nvol_harian_bp = 8  # bp, standar deviasi yield harian\n\n# TULIS KODEMU: 1-sigma P&L harian (rupiah)\npnl_1sigma = abs(dv01_per_100bp) / 100 * vol_harian_bp\n\nprint(f"pnl_1sigma={pnl_1sigma:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pnl_1sigma", value: 256000000, tol: 1, label: "`pnl_1sigma` seharusnya 256.000.000", msg: "(3,2 M / 100) × 8 = 256 jt. Cek konversi per-100-bp ke per-bp." },
          { kind: "stdout_matches", task: "t2", pattern: "pnl_1sigma=256000000", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "1-sigma P&L = |DV01 per bp| × vol harian (bp). Di sini ±Rp256 jt/hari.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: book menentukan bahasa, modal, dan perilaku",
        body: "Klasifikasi book bukan soal akuntansi — ia soal insentif dan penyangga. Lima heuristik. Pertama: sebelum bertanya berapa risikonya, tanya dulu ini book apa — book menentukan bahasa pengukurannya (mark-to-market harian vs akrual), dan bahasa yang salah membuatmu bicara risiko yang salah. Kedua: waspadai reklasifikasi yang terlalu nyaman — jika pindah kamar membuat angka modal membaik tanpa mengubah ekonomi posisi, itu sinyal regulatory arbitrage, bukan manajemen risiko. Ketiga: selalu ukur sensitivitas dalam rupiah per unit (DV01, CS01), bukan dalam tahun atau persen — limit dan P&L explain hanya hidup dalam satuan uang. Keempat: unexplained P&L di atas 10–15% dari P&L aktual bukan kegagalan model yang bisa diabaikan, melainkan undangan investigasi — faktor hilang, data basi, atau non-linearitas yang tidak tertangkap orde-1. Kelima: diversifikasi yang terlihat dari agregasi naif adalah ilusi; korelasi yang dipakai untuk netting harus korelasi masa stres, bukan masa tenang. Aturan 10 detiknya: book apa → faktor apa → berapa rupiah per unit → agregasi dengan korelasi stres — dan jangan pernah percaya angka hijau dari metrik yang buta terhadap risiko yang sebenarnya.",
      },
      summary: [
        "Trading book = diniatkan dagang, mark-to-market harian, VaR/ES harian, market risk capital charge. Banking book = dipegang lama, amortised cost — tetapi tetap punya IRRBB.",
        "Boundary antar book diatur regulator (presumptive list); reklasifikasi butuh justifikasi dan persetujuan, bukan alat optimasi modal.",
        "Setiap posisi dipetakan ke faktor risiko (suku bunga, FX, ekuitas, spread, komoditas) sebelum diukur.",
        "Sensitivitas S = ∂V/∂f adalah bahasa umum risiko pasar; DV01 = perubahan nilai per 1 bp.",
        "P&L explain: ΔV ≈ Σ S_i Δf_i — unexplained besar adalah undangan investigasi.",
        "Agregasi risiko per faktor dengan korelasi, jangan jumlah mentah.",
      ],
      next: { label: "MR2 — Volatilitas & Kovarians", href: "/learn/mr2-volatilitas" },
      quiz: [
        {
          q: "Bank memindahkan obligasi Rp500 M dari banking book ke trading book. Dampak paling langsung ke pengukuran risiko?",
          options: [
            { text: "Tidak ada — obligasinya sama", why: "klasifikasinya yang menentukan cara ukur, bukan obligasinya." },
            { text: "Obligasi kini mark-to-market harian, wajib dihitung VaR/ES harian, dan kena market risk capital charge", why: "klasifikasi menentukan cara ukur — trading book = mark-to-market harian, VaR/ES harian, dan capital charge risiko pasar.", correct: true },
            { text: "Risiko kreditnya hilang", why: "risiko kredit penerbit tetap ada; yang berubah adalah cara ukur dan modalnya." },
            { text: "P&L menjadi selalu positif", why: "mark-to-market justru membuat P&L berayun dua arah." },
          ],
        },
        {
          q: "DV01 portofolio = −Rp32 juta per +1 bp. Yield naik 25 bp. Estimasi perubahan nilai?",
          options: [
            { text: "−Rp800 juta", why: "ΔV ≈ S × Δf = −32 jt × 25 = −Rp800 juta. Tanda negatif = nilai turun saat yield naik.", correct: true },
            { text: "−Rp32 juta", why: "itu perubahan per 1 bp, belum dikali 25 bp." },
            { text: "+Rp800 juta", why: "Salah tanda: harga obligasi bergerak berlawanan arah dengan yield." },
            { text: "−Rp8 juta", why: "32 × 25 = 800, bukan 8." },
          ],
        },
        {
          q: "P&L aktual −Rp400 jt, tetapi P&L explain dari semua faktor hanya −Rp120 jt. Interpretasi yang tepat?",
          options: [
            { text: "Model sudah sempurna, abaikan selisihnya", why: "selisih Rp280 jt terlalu besar untuk diabaikan." },
            { text: "Ada unexplained −Rp280 jt — selidiki: faktor belum dimodelkan, data salah, atau butuh orde-2", why: "unexplained besar adalah sinyal investigasi — faktor belum dimasukkan, harga input basi, atau aproksimasi linear tidak cukup.", correct: true },
            { text: "Sensitivitas pasti salah hitung, buang saja", why: "jangan buang model sebelum investigasi — cek data dan faktor dulu." },
            { text: "P&L aktual yang salah", why: "P&L aktual adalah fakta; yang dipertanyakan adalah kelengkapan model." },
          ],
        },
        {
          q: "Dua posisi: A rugi Rp10 M saat suku bunga naik, B untung Rp10 M saat suku bunga naik. Risiko suku bunga bersih?",
          options: [
            { text: "Rp20 M (dijumlah)", why: "penjumlahan mentah mengabaikan efek saling menghapus." },
            { text: "Rp10 M (diambil yang terbesar)", why: "bukan soal mengambil yang terbesar." },
            { text: "≈ Rp0 — keduanya saling menghapus (hedge alami); risiko diukur per faktor dengan korelasi", why: "A dan B bereaksi berlawanan terhadap faktor yang sama → netting alami.", correct: true },
            { text: "Tidak bisa dihitung", why: "bisa dihitung lewat agregasi per faktor dengan korelasi." },
          ],
        },
        {
          q: "Manakah pernyataan benar tentang boundary trading/banking book?",
          options: [
            { text: "Sepenuhnya tergantung niat trader hari itu", why: "boundary diatur regulator, bukan niat sesaat." },
            { text: "Regulator menetapkan daftar instrumen yang wajib/dilarang masuk trading book; reklasifikasi butuh justifikasi dan persetujuan", why: "Basel menetapkan presumptive list dan melarang regulatory arbitrage antar book.", correct: true },
            { text: "Bank boleh memindahkan posisi setiap hari untuk optimasi modal", why: "pindah-pindah untuk mempercantik modal adalah pelanggaran." },
            { text: "Boundary hanya berlaku untuk bank besar", why: "aturan boundary berlaku umum." },
          ],
        },
      ],
    },
  ],
};
