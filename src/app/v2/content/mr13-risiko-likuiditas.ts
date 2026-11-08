import type { V2Lesson } from "../lib/types";

export const mr13: V2Lesson = {
  slug: "mr13-risiko-likuiditas",
  track: "Market Risk",
  module: "Risiko Likuiditas",
  title: "MR13 — Risiko Likuiditas: Saat Harga Pasar Tidak Bisa Kamu Dapatkan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-miliaran",
      eyebrow: "Langkah 1 · Dua likuiditas",
      title: "Cerita: miliaran yang tidak bisa dijual",
      prose: [
        "Manajer dana memegang obligasi korporasi Rp500 miliar. Layar Bloomberg menunjukkan harga: 98,5. Nilai portofolio saya Rp492,5 miliar, katanya. Lalu datang penebusan besar — ia harus jual. Dealer pertama menawar 96,0. Kedua: 95,5. Pasar tipis, bos. Ia akhirnya menjual bertahap selama seminggu di rata-rata 94,2 — rugi Rp21,5 miliar dari nilai pasar yang tertera di layar.",
        "Harga 98,5 itu adalah harga untuk lot kecil; untuk ratusan miliar, harga sebenarnya jauh lebih rendah. Twist-nya: VaR portofolionya tidak menangkap ini sama sekali — VaR mengasumsikan kamu bisa keluar di harga pasar (mid price). Kenyataannya, keluar itu berbiaya: spread + market impact. Dan biaya itu membesar tepat saat kamu paling butuh keluar.",
        "Dua likuiditas: market liquidity (seberapa cepat & murah menjual aset tanpa menggerakkan harga) dan funding liquidity (seberapa mudah mendapat kas/pinjaman saat butuh). Spiral kematian: market liquidity turun → harga jatuh → margin call naik → butuh funding → funding kering → forced selling → harga makin jatuh. Inilah mekanisme 2008. Likuiditas seperti oksigen — tidak terlihat saat ada, mematikan saat hilang, dan hilang tepat saat paling dibutuhkan.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa harga layar 98,5 tidak bisa didapatkan untuk penjualan besar." },
        { id: "t2", text: "Jelaskan spiral kematian likuiditas dengan kata-katamu." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Jangan ukur likuiditas di masa tenang lalu merasa aman. Spread rata-rata historis menyesatkan — yang penting adalah spread saat stres. Selalu ukur biaya likuidasi dengan spread stres, bukan spread normal.",
        type: "risk",
      },
      reference: "Harga layar ≠ harga eksekusi. Market vs funding liquidity — pantau keduanya (spiral).",
    },
    {
      id: "bid-ask",
      eyebrow: "Langkah 2 · Bid-ask spread",
      title: "Harga ketidaksabaran",
      prose: [
        "Bid-ask spread = selisih harga jual (bid) vs harga beli (ask). Untuk keluar sekarang, kamu menjual di bid — di bawah mid price: biaya ≈ ½ × spread × posisi. Kenapa setengah? Mid price = tengah bid-ask; menjual di bid berarti membayar setengah spread dari mid. (Untuk round-trip penuh: spread penuh.)",
        "Kenapa spread melebar saat krisis: market maker takut (risiko inventory naik → minta kompensasi lebih) dan modal terbatas (tidak bisa menampung arus jual). Spread yang 0,15% di masa normal bisa jadi 5%+ saat panik — 30× lipat. Biaya likuidasi posisi Rp100 M naik dari Rp75 juta menjadi Rp2,5 miliar. Pelajaran: spread rata-rata historis menyesatkan.",
        "Contoh cepat: posisi Rp100 M, spread 2% → biaya likuidasi satu arah = 0,5 × 2% × 100 M = Rp1 M. Untuk posisi besar relatif terhadap volume harian (ADV), tambah market impact: menjual 50% ADV menggerakkan harga melawanmu. Aturan praktis: jika posisi > 10% ADV, asumsikan butuh beberapa hari untuk keluar — inilah logika liquidity horizon di FRTB (aturan modal yang memberi horizon keluar lebih panjang untuk aset yang sulit dijual).",
        "Market impact mengikuti hukum akar kuadrat: menjual 1% ADV menggerakkan harga sedikit; menjual 4× lipat (4% ADV) tidak menggerakkan 4× lipat — melainkan ~2× lipat (akar kuadrat). Rumus kasarnya: dampak ∝ σ × √(Q/ADV). Implikasinya brutal: melikuidasi posisi 10× lebih besar tidak butuh biaya 10× — tetapi juga tidak bisa diakali dengan memecah order seenaknya: memecah menjadi 100 bagian kecil mengurangi impact per bagian, tetapi memperpanjang horizon (dan selama itu harga bisa bergerak melawanmu). Trade-off fundamental eksekusi: cepat = mahal (impact), lambat = berisiko (harga bergerak). Almgren-Chriss (2000) memformalkan jadwal optimal yang menyeimbangkan keduanya. Aturan kasar praktisi: jangan jual > 10–15% ADV per hari kecuali darurat — di atas itu, impact mendominasi biaya.",
        "Kapan spread melebar — polanya bisa diprediksi. Intraday: spread melebar di pembukaan (ketidakpastian overnight) lalu menyempit siang hari. Overnight/weekend: tidak ada market maker — jangan rencanakan likuidasi besar Senin pagi dari posisi Jumat sore. Event risk: menjelang pengumuman BI rate, FOMC, atau pemilu, market maker melebarkan quote atau menarik diri — spread bisa 5–10× normal. Pelajaran: likuiditas itu musiman dan siklis — ukur biaya likuidasi dengan spread pada kondisi yang relevan (event, stres), bukan rata-rata tahunan yang damai.",
      ],
      formula: String.raw`\text{Biaya} \approx \tfrac{1}{2} \times \text{spread} \times \text{posisi}`,
      formulaNote: "spread = selisih ask−bid relatif terhadap mid price; posisi = nilai posisi. Kenapa setengah? Menjual di bid = membayar setengah spread dari mid (round-trip penuh = spread penuh). Contoh: posisi Rp100 M, spread 2% → biaya satu arah Rp1 M. Interpretasi: ini baru biaya spread — untuk posisi > 10% ADV, tambah market impact. Dan ingat: pakai spread STRES (bisa 30× lipat), bukan spread rata-rata historis.",
      tasks: [
        { id: "t1", text: "Kenapa biaya satu arah = setengah spread, bukan spread penuh?" },
        { id: "t2", text: "Kapan market impact harus ditambahkan ke biaya spread?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira volume perdagangan tinggi = likuid. Volume tinggi saat kamu butuh jual belum tentu membantumu — jika volume itu satu arah (semua jual), tidak ada pembeli di sisi lain. Likuiditas sejati = kedalaman dua arah + ketahanan (harga kembali setelah guncangan). Volume tanpa kedalaman = ilusi.",
        type: "pitfall",
      },
      reference: "Biaya = ½·spread·posisi. Posisi > 10% ADV → tambah market impact + horizon lebih panjang.",
    },
    {
      id: "lvar",
      eyebrow: "Langkah 3 · LVaR",
      title: "LVaR: VaR yang jujur tentang biaya keluar",
      prose: [
        "LVaR (Liquidity-adjusted VaR) menambahkan biaya likuidasi ke VaR biasa: LVaR = VaR + ½·s·P + market impact, dengan s = bid-ask spread relatif dan P = nilai posisi. Untuk saham LQ45, biaya likuidasi kecil (0,3% vs VaR 2,1%) — VaR biasa cukup. Tetapi untuk saham lapis 3, biaya likuidasi (9,8%) hampir menyamai VaR-nya (14%)! VaR biasa sistematis meremehkan risiko aset illiquid — dan selisihnya justru terbesar di aset yang paling mungkin terjebak.",
        "Contoh: posisi Rp100 miliar, VaR 99% = Rp14 miliar. Spread normal 2% → biaya Rp1 M → LVaR ≈ Rp15 M. Tetapi spread stres 10% → biaya Rp5 M → LVaR = Rp19 M, rasio LVaR/VaR = 1,36. Dan di krisis sesungguhnya, spread bisa melebar 10–30× lipat membuat sedikit biaya menjadi komponen dominan.",
        "LVaR/VaR ratio adalah skor illiquiditas portofolio: > 1,5 = waspada; > 2 = posisi ini tidak bisa diandalkan untuk likuiditas darurat. Jangan pernah mengandalkan aset ber-LVaR-tinggi sebagai buffer likuiditas — saat dibutuhkan, ia tidak bisa dijual tanpa rugi besar.",
      ],
      formula: String.raw`\text{LVaR} = \text{VaR} + \underbrace{\tfrac{1}{2} \cdot s \cdot P}_{\text{biaya likuidasi}} + \text{market impact}`,
      formulaNote: "VaR = value at risk biasa (mengasumsikan keluar di mid price); s = bid-ask spread relatif; P = nilai posisi; market impact = biaya menggerakkan harga untuk posisi besar. Contoh lab: VaR Rp14 M + biaya stres Rp5 M = LVaR Rp19 M (rasio 1,36). Interpretasi: rasio LVaR/VaR adalah skor illiquiditas — > 1,5 waspada, > 2 = jangan andalkan sebagai buffer likuiditas darurat.",
      tasks: [
        { id: "t1", text: "Hitung `biaya_normal`, `biaya_stres`, dan `lvar_stres`" },
        { id: "t2", text: "Hitung `rasio` = LVaR/VaR, lalu cetak semuanya" },
      ],
      expected: "biaya_stres=5.0  lvar_stres=19.0  rasio=1.36",
      note: {
        title: "Sering salah",
        body: "Mengira LVaR hanya VaR yang ditambah sedikit biaya — tidak material. Untuk aset likuid memang kecil, tetapi untuk aset illiquid biaya likuidasi bisa mendekati atau melebihi VaR itu sendiri. Materialitasnya justru muncul saat paling penting: krisis.",
        type: "pitfall",
      },
      hints: [
        "biaya = 0.5 * spread * posisi untuk tiap skenario spread.",
        "lvar_stres = var_biasa + biaya_stres.",
        "rasio = lvar_stres / var_biasa.",
      ],
      code: {
        starter: `# Posisi Rp100 miliar (satuan: Rp miliar)\npos, var_biasa = 100, 14\nspread_normal, spread_stres = 0.02, 0.10\n\n# TULIS KODEMU: biaya likuidasi & LVaR\nbiaya_normal = \nbiaya_stres = \nlvar_stres = \nrasio = \n\nprint(f"biaya_stres={biaya_stres:.1f}  lvar_stres={lvar_stres:.1f}  rasio={rasio:.2f}")`,
        lockLines: 3,
        solution: `# Posisi Rp100 miliar (satuan: Rp miliar)\npos, var_biasa = 100, 14\nspread_normal, spread_stres = 0.02, 0.10\n\n# TULIS KODEMU: biaya likuidasi & LVaR\nbiaya_normal = 0.5 * spread_normal * pos\nbiaya_stres = 0.5 * spread_stres * pos\nlvar_stres = var_biasa + biaya_stres\nrasio = lvar_stres / var_biasa\n\nprint(f"biaya_stres={biaya_stres:.1f}  lvar_stres={lvar_stres:.1f}  rasio={rasio:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_stres", value: 5.0, tol: 1e-9, label: "`biaya_stres` seharusnya 5.0", msg: "0,5 × 10% × 100 = 5 (Rp miliar). Bandingkan dengan normal: 1,0." },
          { kind: "equal", task: "t1", name: "lvar_stres", value: 19.0, tol: 1e-9, label: "`lvar_stres` seharusnya 19.0", msg: "14 + 5 = 19." },
          { kind: "equal", task: "t2", name: "rasio", value: 1.36, tol: 0.01, label: "`rasio` seharusnya 1.36", msg: "19/14 ≈ 1,36. Di bawah 1,5 — waspada ringan." },
          { kind: "stdout_matches", task: "t2", pattern: "biaya_stres=5\\.0\\s+lvar_stres=19\\.0\\s+rasio=1\\.36", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "LVaR = VaR + biaya likuidasi (+ market impact). Rasio > 1,5 = waspada.",
    },
    {
      id: "lcr-nsfr",
      eyebrow: "Langkah 4 · LCR & NSFR",
      title: "Sabuk pengaman Basel III",
      prose: [
        "Setelah 2008, Basel III mewajibkan dua rasio likuiditas untuk funding liquidity bank. LCR (Liquidity Coverage Ratio) — bertahan 30 hari: LCR = HQLA / arus keluar bersih ≥ 100%. HQLA (High-Quality Liquid Assets: kas, SBN — dengan haircut untuk level 2) harus cukup menutup arus keluar bersih dalam skenario stres 30 hari (penarikan deposito, margin call, penarikan komitmen kredit).",
        "NSFR (Net Stable Funding Ratio) — struktur 1 tahun: NSFR = ASF / RSF ≥ 100%. ASF (Available Stable Funding: modal 100%, deposito stabil 90–95%, utang < 1Y 50%) harus ≥ RSF (Required Stable Funding: kredit 85%, HQLA 5%, dst.). Intinya: jangan danai aset jangka panjang dengan utang jangka pendek — pelajaran langsung dari 2008.",
        "Kepribadiannya: LCR = tabung oksigen (bertahan 30 hari saat panik); NSFR = gaya hidup sehat (struktur pendanaan tidak rapuh). Bank butuh keduanya. Dan ingat: LCR/NSFR mengukur ketahanan, bukan profitabilitas — keduanya sering bertentangan (HQLA ber-yield rendah = mahal). Manajemen yang mengeluh LCR membebani laba sedang mengeluh tentang harga asuransi. Tugas risk manager: memastikan premi asuransi itu cukup, bukan menghilangkannya.",
      ],
      formula: String.raw`\text{LCR} = \frac{\text{HQLA}}{\text{arus keluar bersih}} \geq 100\% \qquad \text{NSFR} = \frac{\text{ASF}}{\text{RSF}} \geq 100\%`,
      formulaNote: "LCR: HQLA = aset likuid berkualitas tinggi (kas, SBN — dengan haircut untuk level 2); arus keluar bersih = skenario stres 30 hari (penarikan deposito, margin call). NSFR: ASF = pendanaan stabil tersedia (modal 100%, deposito stabil 90–95%); RSF = pendanaan stabil yang dibutuhkan (kredit 85%). Contoh lab: LCR 120/150 = 0,80 → butuh tambah Rp30 M HQLA. Interpretasi: LCR = tabung oksigen 30 hari; NSFR = gaya hidup pendanaan sehat. Keduanya hanya sekuat skenario & kualitas HQLA-nya.",
      tasks: [
        { id: "t1", text: "Hitung `lcr` dan `nsfr` (desimal), serta `lolos` untuk keduanya" },
        { id: "t2", text: "Hitung `hqla_needed` agar LCR ≥ 100%, lalu cetak semuanya" },
      ],
      expected: "lcr=0.80  nsfr=0.95  hqla_needed=150",
      note: {
        title: "Sering salah",
        body: "Mengira LCR 120% = bank pasti aman. LCR = ketahanan terhadap skenario tertentu — hanya sekuat skenario & kualitas HQLA-nya. Skenario terlalu ringan atau HQLA terkonsentrasi/terkena haircut besar = LCR menipu.",
        type: "pitfall",
      },
      hints: [
        "lcr = hqla / outflows; nsfr = asf / rsf.",
        "lolos = (lcr >= 1.0) and (nsfr >= 1.0).",
        "hqla_needed = outflows (agar rasio tepat 100%).",
      ],
      code: {
        starter: `# Neraca likuiditas (Rp miliar)\nhqla, outflows = 120, 150\nasf, rsf = 95, 100\n\n# TULIS KODEMU: LCR, NSFR, status, dan HQLA minimal\nlcr = \nnsfr = \nlolos = \nhqla_needed = \n\nprint(f"lcr={lcr:.2f}  nsfr={nsfr:.2f}  lolos={lolos}  hqla_needed={hqla_needed}")`,
        lockLines: 3,
        solution: `# Neraca likuiditas (Rp miliar)\nhqla, outflows = 120, 150\nasf, rsf = 95, 100\n\n# TULIS KODEMU: LCR, NSFR, status, dan HQLA minimal\nlcr = hqla / outflows\nnsfr = asf / rsf\nlolos = (lcr >= 1.0) and (nsfr >= 1.0)\nhqla_needed = outflows\n\nprint(f"lcr={lcr:.2f}  nsfr={nsfr:.2f}  lolos={lolos}  hqla_needed={hqla_needed}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lcr", value: 0.8, tol: 1e-9, label: "`lcr` seharusnya 0.80", msg: "120/150 = 0,8 < 1,0 — tidak lolos." },
          { kind: "equal", task: "t1", name: "nsfr", value: 0.95, tol: 1e-9, label: "`nsfr` seharusnya 0.95", msg: "95/100 = 0,95 < 1,0 — tidak lolos." },
          { kind: "equal", task: "t1", name: "lolos", value: false, label: "`lolos` seharusnya False", msg: "Keduanya di bawah 100% — bank gagal dua-duanya." },
          { kind: "equal", task: "t2", name: "hqla_needed", value: 150, tol: 1e-9, label: "`hqla_needed` seharusnya 150", msg: "Butuh tambah 30 miliar HQLA untuk LCR 100%." },
        ],
      },
      reference: "LCR = HQLA/outflow ≥ 100% (30 hari). NSFR = ASF/RSF ≥ 100% (1 tahun).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan likuiditas mengubah keputusan",
      prose: [
        "Empat keputusan. Pertama, posisi besar atau aset tidak likuid → LVaR, bukan VaR biasa: posisi > 10% ADV atau spread > 1% — VaR biasa mengasumsikan keluar di mid price, fiksi untuk posisi besar. LVaR memaksa kejujuran tentang biaya keluar.",
        "Kedua, penetapan limit posisi → batasi % ADV + LVaR: limit notional tanpa batas likuiditas = izin terjebak. Maks 15% ADV memastikan posisi bisa keluar dalam hitungan hari. Ketiga, ketahanan bank 30 hari → LCR ≥ 100% dengan skenario stres sendiri: LCR regulator = minimum; bank sehat menjalankan stres internal yang lebih parah.",
        "Keempat, struktur pendanaan jangka panjang → NSFR ≥ 100%: memaksa pendanaan stabil untuk aset jangka panjang — mencegah model pinjam pendek, tanam panjang yang rapuh. Aturan 10 detik: harga di layar ≠ harga yang bisa kamu dapatkan — selalu kurangi biaya likuidasi. LVaR/VaR > 1,5 = waspada. LCR = oksigen 30 hari; NSFR = gaya hidup sehat. Likuiditas hilang saat paling dibutuhkan — ukur dengan skenario stres.",
      ],
      tasks: [
        { id: "t1", text: "Posisi 25% dari ADV. Metrik dan limit apa yang kamu tetapkan?" },
        { id: "t2", text: "Bank memenuhi LCR regulator tetapi dengan skenario ringan. Apa komentarmu?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "2008 bukan terutama krisis solvabilitas pada awalnya — ia krisis likuiditas. Bank-bank yang sehat di kertas mati karena tidak bisa mendanai dirinya esok hari. Tiga pasar membeku berurutan: sekuritisasi, antarbank, lalu pendanaan — dan LCR/NSFR dirancang persis untuk memaksa bank bertahan 30 hari dan mendanai dengan struktur sehat.",
        type: "risk",
      },
      reference: "Posisi besar → LVaR. Limit → % ADV. 30 hari → LCR. Struktur → NSFR.",
    },
    {
      id: "minicase-kertas",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Bank yang likuid di kertas",
      prose: [
        "Bank Cahaya melaporkan LCR 120% — di atas minimum 100%. Direksi tenang. Tetapi lihat komposisinya: 70% HQLA adalah obligasi korporasi level 2B dengan haircut 50% yang di pasar stres tidak laku; arus keluar bersih dihitung dengan asumsi penarikan deposito ritel hanya 5% — padahal di era digital, penarikan bisa 20%+ dalam sehari (pelajaran SVB: bank run via aplikasi).",
        "Skenario stres yang lebih jujur: haircut obligasi korporasi 75% (bukan 50%) dan penarikan 15%. HQLA efektif turun, outflow naik — LCR jujur = 82%. Bank yang likuid di kertas ternyata tidak memenuhi syarat di skenario realistis. Angka 120% adalah fungsi dari asumsi, bukan fakta.",
        "Tiga pelajaran: LCR hanya sekuat skenario & kualitas HQLA-nya — selalu uji dengan skenario internal yang lebih parah. Kualitas HQLA lebih penting dari kuantitasnya: kas dan SBN ≠ obligasi korporasi saat panik. Dan kecepatan penarikan di era digital mengubah semua asumsi lama — model penarikan dari 2010 tidak berlaku untuk 2026.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan dua asumsi yang membuat LCR 120% menipu." },
        { id: "t2", text: "Apa yang harus dilakukan risk manager terhadap laporan ini?" },
      ],
      note: {
        title: "Sering salah",
        body: "Melaporkan rasio regulator apa adanya tanpa skenario internal pendamping. Regulator menetapkan minimum untuk semua bank — bankmu butuh skenario yang mencerminkan fragilitasmu sendiri: konsentrasi HQLA, profil deposan digital, dan kecepatan penarikan.",
        type: "pitfall",
      },
      reference: "LCR menipu = skenario ringan + HQLA berkualitas rendah. Uji dengan skenario sendiri.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Ukur likuiditas saat stres, bukan saat tenang",
      prose: [
        "Satu kalimat yang merangkum seluruh lesson: likuiditas seperti oksigen — tidak terlihat saat ada, mematikan saat hilang, dan hilang tepat saat paling dibutuhkan. Maka seluruh pengukuran likuiditas harus dilakukan dengan kacamata stres: spread stres (bukan rata-rata), LVaR (bukan VaR biasa), LCR dengan skenario internal yang lebih parah dari regulator.",
        "Tiga pertanyaan yang diajukan risk manager senior sebelum menyetujui posisi besar: (1) berapa persen dari ADV posisi ini — dan berapa hari butuh untuk keluar tanpa menggerakkan harga? (2) berapa biaya likuidasi jika spread melebar 10× — apakah masih bisa ditanggung? (3) apakah aset ini boleh diandalkan sebagai buffer likuiditas darurat — atau ia justru yang pertama tidak bisa dijual saat krisis?",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa spread rata-rata historis menyesatkan untuk mengukur likuiditas." },
        { id: "t2", text: "Terapkan tiga pertanyaan ke obligasi korporasi Rp500 M di cerita pembuka." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk risiko likuiditas. Pertama, bedakan dua likuiditas dan pantau keduanya: market liquidity (bisa jual tanpa gerakkan harga?) dan funding liquidity (bisa dapat kas saat butuh?). Keduanya terhubung via spiral kematian — market liquidity turun → harga jatuh → margin call → funding kering → forced selling → harga makin jatuh. Memantau satu saja = buta separuh mekanisme 2008. Kedua, jangan pernah percaya harga layar untuk posisi besar: harga 98,5 itu harga untuk lot kecil; untuk Rp500 miliar, harga sebenarnya = 98,5 minus spread stres minus market impact — bisa 94,2 seperti di cerita (rugi Rp21,5 miliar dari 'nilai pasar'). Selalu kurangi biaya likuidasi dari valuasi posisi besar. Ketiga, hafalkan ambang praktisnya: posisi > 10% ADV = butuh berhari-hari untuk keluar; LVaR/VaR > 1,5 = waspada, > 2 = bukan buffer likuiditas; LCR ≥ 100% dengan skenario SENDIRI yang lebih parah dari regulator. Keempat, ingat hukum akar kuadrat market impact: melipatgandakan ukuran order tidak melipatgandakan biaya — tetapi memecah order memperpanjang risiko harga. Jadwalkan eksekusi (cepat vs lambat) sebagai keputusan risiko, bukan kebiasaan. Kelima, waspadai pola musiman likuiditas: spread melebar di pembukaan, menjelang event besar (BI rate, FOMC, pemilu), dan menghilang di akhir pekan — jangan rencanakan likuidasi darurat di momen likuiditas tipis. Dan terakhir: 2008 pada awalnya bukan krisis solvabilitas — melainkan krisis likuiditas. Bank-bank yang sehat di kertas mati karena tidak bisa mendanai dirinya esok hari. LCR dan NSFR adalah premi asuransi terhadap kematian itu — mahal, tetapi lebih murah dari mati.",
      },
      reference: "Ukur dengan kacamata stres: spread stres, LVaR, LCR skenario internal. Harga layar ≠ harga eksekusi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR14.",
      ],
      tasks: [],
      summary: [
        "Harga layar ≠ harga eksekusi. Market vs funding liquidity — terhubung via spiral kematian.",
        "Biaya likuidasi ≈ ½·spread·posisi (+ market impact jika > 10% ADV). Spread stres >> spread normal.",
        "LVaR = VaR + biaya likuidasi. Rasio LVaR/VaR > 1,5 = waspada; aset itu bukan buffer likuiditas.",
        "LCR = HQLA/outflow ≥ 100% (30 hari); NSFR = ASF/RSF ≥ 100% (1 tahun). Ukur ketahanan, bukan laba.",
        "LCR hanya sekuat skenario & kualitas HQLA-nya — selalu uji dengan skenario internal.",
      ],
      next: { label: "MR14 — Counterparty Risk", href: "/v2/learn/mr14-counterparty-risk" },
      quiz: [
        {
          q: "Perbedaan market liquidity vs funding liquidity?",
          options: [
            { text: "Sama saja", why: "keduanya berbeda tetapi saling memperburuk." },
            { text: "Market = bisa jual aset tanpa gerakkan harga; funding = bisa dapat kas/pinjaman saat butuh", why: "dan terhubung via spiral — harga jatuh → margin call → funding kering → forced selling.", correct: true },
            { text: "Market untuk saham, funding untuk obligasi", why: "keduanya berlaku untuk semua aset." },
            { text: "Funding tidak penting", why: "2008 membuktikan funding bisa membunuh bank sehat." },
          ],
        },
        {
          q: "Posisi Rp100 M, spread 2%. Estimasi biaya likuidasi (satu arah)?",
          options: [
            { text: "Rp2 M", why: "itu spread penuh — untuk satu arah hanya setengah." },
            { text: "Rp1 M (≈ ½ × spread × posisi)", why: "menjual di bid = membayar setengah spread dari mid. Untuk posisi besar, tambah market impact.", correct: true },
            { text: "Rp100 M", why: "itu seluruh posisinya." },
            { text: "Nol", why: "keluar selalu berbiaya." },
          ],
        },
        {
          q: "Kapan LVaR jauh melebihi VaR biasa?",
          options: [
            { text: "Tidak pernah", why: "untuk aset illiquid selisihnya besar." },
            { text: "Aset illiquid (spread lebar, posisi besar vs ADV) — biaya likuidasi bisa mendekati/melebihi VaR, terutama saat krisis", why: "LVaR − VaR = biaya keluar. VaR biasa buta terhadap ini.", correct: true },
            { text: "Hanya untuk FX", why: "berlaku untuk semua kelas aset illiquid." },
            { text: "Hanya saat pasar tenang", why: "justru saat krisis selisihnya meledak." },
          ],
        },
        {
          q: "NSFR memaksa bank untuk?",
          options: [
            { text: "Menambah laba", why: "NSFR justru membebani laba (pendanaan stabil lebih mahal)." },
            { text: "Mendanai aset jangka panjang dengan pendanaan stabil — mencegah model pinjam pendek, tanam panjang yang rapuh", why: "NSFR = disiplin struktural; premi asuransi terhadap krisis pendanaan.", correct: true },
            { text: "Mengurangi modal", why: "arahnya terbalik." },
            { text: "Menjual semua obligasi", why: "tidak ada keharusan seperti itu." },
          ],
        },
        {
          q: "Volume perdagangan saham X sangat tinggi hari ini. Apakah pasti likuid untuk jual Rp50 M?",
          options: [
            { text: "Ya — volume tinggi = likuid", why: "volume satu arah (semua jual) tidak membantumu." },
            { text: "Belum tentu — jika volume satu arah tidak ada pembeli; cek kedalaman dua arah & % terhadap ADV", why: "volume tanpa kedalaman dua arah = ilusi.", correct: true },
            { text: "Ya selalu", why: "tidak ada jaminan seperti itu." },
            { text: "Tidak relevan", why: "sangat relevan — bandingkan dengan ADV." },
          ],
        },
        {
          q: "Dana harus melikuidasi posisi 40% dari ADV dalam sehari. Menurut hukum akar kuadrat market impact, apa yang terjadi?",
          options: [
            { text: "Tidak ada impact — pasar menyerap semua", why: "40% ADV pasti menggerakkan harga signifikan." },
            { text: "Harga bergerak melawannya secara material (dampak ∝ √(Q/ADV)) — biaya impact mendominasi; seharusnya dipecah berhari-hari kecuali darurat", why: "aturan kasar: jangan jual > 10–15% ADV per hari. Cepat = mahal (impact), lambat = berisiko (harga bergerak) — jadwalkan sebagai keputusan risiko.", correct: true },
            { text: "Impact-nya linear: 40% ADV = 40× impact 1% ADV", why: "impact mengikuti akar kuadrat, bukan linear." },
            { text: "Spread menyempit karena volume besar", why: "justru melebar saat arus satu arah besar." },
          ],
        },
      ],
    },
  ],
};
