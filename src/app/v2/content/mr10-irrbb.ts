import type { V2Lesson } from "../lib/types";

export const mr10: V2Lesson = {
  slug: "mr10-irrbb",
  track: "Market Risk",
  module: "Risiko Suku Bunga",
  title: "MR10 — IRRBB: Risiko Suku Bunga yang Bersembunyi di Banking Book",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-svb",
      eyebrow: "Langkah 1 · IRRBB",
      title: "Cerita: kejatuhan yang tidak terlihat di P&L",
      prose: [
        "2022–2023. Bank-bank di AS memegang obligasi jangka panjang (dibeli saat suku bunga ~0%) yang didanai deposito jangka pendek. Di pembukuan banking book (amortised cost), semuanya tenang: P&L stabil, tidak ada mark-to-market harian. Lalu The Fed menaikkan suku bunga dari 0% ke 5%+ dalam setahun.",
        "Yang terjadi: nilai ekonomis obligasi-obligasi itu anjlok 15–20% — tetapi tidak muncul di P&L karena akuntansi amortised cost. Kerugian itu nyata secara ekonomi, tetapi tidak terlihat. Ketika deposan panik dan menarik dananya, bank terpaksa menjual obligasi itu — dan kerugian tak terlihat itu tiba-tiba menjadi kerugian nyata ratusan triliun. Beberapa bank kolaps (kasus Silicon Valley Bank, 2023).",
        "Twist-nya: semua informasi untuk memprediksi ini sudah ada — di repricing gap report dan perhitungan EVE. Risikonya bukan tidak terukur, melainkan tidak ditindaklanjuti. Inilah IRRBB (Interest Rate Risk in the Banking Book): risiko suku bunga di banking book, diukur dengan dua lensa — EVE (nilai jangka panjang) dan NII (laba jangka pendek).",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa kerugian SVB tidak terlihat di P&L sebelum krisis." },
        { id: "t2", text: "Apa beda EVE dan NII dalam satu kalimat masing-masing?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "EVE yang turun bukan cuma di atas kertas: SVB membuktikan kerugian kertas menjadi nyata begitu penarikan dana (risiko likuiditas!) memaksa penjualan. EVE + risiko likuiditas = kombinasi mematikan. Tidak akan dijual adalah asumsi, bukan jaminan.",
        type: "risk",
      },
      reference: "IRRBB: risiko suku bunga banking book. Dua lensa: EVE (nilai) dan NII (laba 12 bulan).",
    },
    {
      id: "eve",
      eyebrow: "Langkah 2 · EVE",
      title: "EVE: nilai ekonomis bank",
      prose: [
        "EVE (Economic Value of Equity) = nilai kini seluruh arus kas masa depan bank: PV(aset) − PV(liabilitas) + PV(off-balance sheet), didiskon dengan kurva pasar. Inilah berapa nilai bank sebenarnya hari ini jika semua arus kas dinilai dengan harga pasar — tidak bisa disembunyikan oleh amortised cost.",
        "Sensitivitas EVE terhadap shock paralel: ΔEVE ≈ −(D_A·A − D_L·L)·Δy. Selisih D_A·A − D_L·L = duration gap — jantung IRRBB. Bank tipikal (KPR 15Y didanai deposito 1Y) punya duration gap positif besar → suku bunga naik → EVE turun tajam. Inilah yang membunuh SVB: obligasi long-end didanai deposito short-end.",
        "Aturan Basel: jika ΔEVE > 15% dari Tier 1 capital pada salah satu dari 6 skenario standar → bank = outlier → wajib tindak lanjut (kurangi risiko atau tambah modal). Contoh: A=1000, D_A=4, L=900, D_L=1, shock +200bp → duration gap = 3100, ΔEVE = −62. Dengan Tier 1 = 340, rasionya −18,2% → outlier.",
      ],
      formula: String.raw`\Delta\text{EVE} \approx -(D_A \cdot A - D_L \cdot L)\cdot \Delta y`,
      formulaNote: "D_A = duration aset (tahun), A = nilai aset; D_L = duration liabilitas, L = nilai liabilitas; Δy = shock suku bunga (desimal). Selisih D_A·A − D_L·L = duration gap. Contoh lab: gap 3100 × 0,02 → ΔEVE = −Rp62 miliar. Interpretasi: shock +200bp menghapus nilai ekonomis 18,2% dari Tier 1 → outlier Basel (ambang 15%), wajib tindak lanjut — kurangi duration gap atau tambah modal.",
      tasks: [
        { id: "t1", text: "Hitung `dgap` (duration gap) dan `dEVE` (Rp miliar)" },
        { id: "t2", text: "Hitung `rasio` thd Tier 1 dan `outlier` (True/False), lalu cetak" },
      ],
      expected: "dEVE=-62.0  rasio=-18.24%  outlier=True",
      note: {
        title: "Sering salah",
        body: "Mengira EVE turun tidak masalah selama aset tidak dijual. EVE mengukur kapasitas ekonomi bank menyerap guncangan — dan seperti SVB, kerugian kertas menjadi nyata saat likuiditas memaksa penjualan. Asumsi tidak akan dijual harus diuji, bukan diterima.",
        type: "pitfall",
      },
      hints: [
        "dgap = D_A*A − D_L*L. dEVE = −dgap × dy (dy dalam desimal: 200bp = 0.02).",
        "rasio = dEVE / tier1. outlier = abs(rasio) > 0.15.",
        "Cetak rasio dalam persen dengan :.2%.",
      ],
      code: {
        starter: `# Neraca (Rp miliar)\nA, D_A = 1000, 4.0   # aset & duration aset\nL, D_L = 900, 1.0     # liabilitas & duration liabilitas\ndy = 0.02             # shock +200bp\ntier1 = 340\n\n# TULIS KODEMU: duration gap, dEVE, rasio, status outlier\ndgap = \ndEVE = \nrasio = \noutlier = \n\nprint(f"dEVE={dEVE:.1f}  rasio={rasio:.2%}  outlier={outlier}")`,
        lockLines: 5,
        solution: `# Neraca (Rp miliar)\nA, D_A = 1000, 4.0   # aset & duration aset\nL, D_L = 900, 1.0     # liabilitas & duration liabilitas\ndy = 0.02             # shock +200bp\ntier1 = 340\n\n# TULIS KODEMU: duration gap, dEVE, rasio, status outlier\ndgap = D_A * A - D_L * L\ndEVE = -dgap * dy\nrasio = dEVE / tier1\noutlier = abs(rasio) > 0.15\n\nprint(f"dEVE={dEVE:.1f}  rasio={rasio:.2%}  outlier={outlier}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dgap", value: 3100, tol: 1e-9, label: "`dgap` seharusnya 3100", msg: "4×1000 − 1×900 = 3100." },
          { kind: "equal", task: "t1", name: "dEVE", value: -62.0, tol: 1e-9, label: "`dEVE` seharusnya −62.0", msg: "−3100 × 0,02 = −62 (Rp miliar)." },
          { kind: "equal", task: "t2", name: "outlier", value: true, label: "`outlier` seharusnya True", msg: "|−18,24%| > 15% → outlier. Wajib tindak lanjut." },
          { kind: "stdout_matches", task: "t2", pattern: "dEVE=-62\\.0\\s+rasio=-18\\.24%\\s+outlier=True", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ΔEVE ≈ −(duration gap)·Δy. |ΔEVE| > 15% Tier 1 = outlier Basel.",
    },
    {
      id: "nii",
      eyebrow: "Langkah 3 · NII",
      title: "NII: laba bunga 12 bulan ke depan",
      prose: [
        "NII (Net Interest Income) = pendapatan bunga − biaya bunga, diproyeksikan 12 bulan ke depan di bawah tiap skenario suku bunga: ΔNII ≈ Σ gap_bucket · Δy · (sisa tahun). Hanya bucket yang repricing dalam 12 bulan yang mempengaruhi NII.",
        "Konsep kunci: beta deposito. Saat suku bunga pasar naik 100bp, bunga deposito mungkin cuma naik 30bp (beta 0,3) — bank menahan sebagian. Tetapi saat turun, deposan menuntut penurunan cepat (beta asimetris!). Beta yang salah = NII sensitivity yang salah. Dan asumsi perilaku tersulit: kapan CASA (giro/tabungan tanpa jatuh tempo kontraktual) repricing? Kapan KPR dilunasi lebih awal? Asumsi ini — bukan rumusnya — yang paling menentukan hasil.",
        "Contoh: gap bucket (Rp miliar) — 3m: −200 (sisa 0,75 thn), 6m: −100 (sisa 0,5 thn), 12m: +50 (sisa 0,25 thn). Shock +200bp. ΔNII = (−200×0,75 − 100×0,5 + 50×0,25) × 0,02 = −3,75 miliar. Bank liability-sensitive jangka pendek: biaya naik mendahului pendapatan — margin tergerus.",
        "Konteks Indonesia: bank-bank besar didanai CASA murah (giro/tabungan) yang sticky di masa normal tetapi bisa pergi cepat saat panik digital — beta CASA domestik tipikal 0,2–0,4, tetapi uji skenario beta 0,6 untuk krisis kepercayaan. Di sisi aset, KPR fixed-rate 10–20 tahun tumbuh pesat — duration gap struktural positif adalah fitur bisnis model, bukan bug. Ditambah SBN di banking book (amortised cost) yang sensitif ke yield: saat yield SBN naik, EVE tergerus diam-diam seperti SVB. Tiga sumber IRRBB khas Indonesia: CASA murah, KPR panjang, SBN hold-to-collect.",
      ],
      formula: String.raw`\Delta\text{NII}_{12m} \approx \sum_{\text{bucket} \le 12m} \text{gap} \cdot \Delta y \cdot (\text{sisa tahun})`,
      formulaNote: "gap = aset yang repricing − liabilitas yang repricing per bucket (hanya bucket ≤ 12 bulan yang ikut); Δy = shock suku bunga; sisa tahun = fraksi tahun bucket itu berpengaruh ke laba. Contoh lab: (−200×0,75 − 100×0,5 + 50×0,25) × 0,02 = −Rp3,75 miliar. Interpretasi: bank liability-sensitive jangka pendek — biaya dana naik mendahului pendapatan. Peringatan: angka ini rapuh terhadap asumsi beta deposito & perilaku CASA — NII tanpa beta eksplisit = fiksi.",
      tasks: [
        { id: "t1", text: "Hitung `dNII` (Rp miliar) dari `gaps`, `dy`" },
        { id: "t2", text: "Cetak `dNII` dengan `print`" },
      ],
      expected: "dNII=-3.75",
      note: {
        title: "Sering salah",
        body: "Memakai beta deposito = 1 (semua pergerakan pasar diteruskan penuh). Beta CASA riil 0,2–0,5 dan asimetris — memakai 1 melebih-lebihkan sensitivitas biaya dana dan menghasilkan NII sensitivity fiksi. Selalu uji sensitivitas terhadap beta.",
        type: "pitfall",
      },
      hints: [
        "Tiap bucket: kontribusi = gap × dy × sisa_tahun.",
        "gaps berisi tuple (gap, sisa_tahun). Jumlahkan semuanya.",
        "dNII = sum(g*dy*s for g, s in gaps.values()).",
      ],
      code: {
        starter: `# Repricing gap (Rp miliar) per bucket: (gap, sisa tahun)\ngaps = {"3m": (-200, 0.75), "6m": (-100, 0.5), "12m": (50, 0.25)}\ndy = 0.02  # shock +200bp\n\n# TULIS KODEMU: sensitivitas NII 12-bulan (Rp miliar)\ndNII = \n\nprint(f"dNII={dNII:.2f}")`,
        lockLines: 3,
        solution: `# Repricing gap (Rp miliar) per bucket: (gap, sisa tahun)\ngaps = {"3m": (-200, 0.75), "6m": (-100, 0.5), "12m": (50, 0.25)}\ndy = 0.02  # shock +200bp\n\n# TULIS KODEMU: sensitivitas NII 12-bulan (Rp miliar)\ndNII = sum(g * dy * s for g, s in gaps.values())\n\nprint(f"dNII={dNII:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dNII", value: -3.75, tol: 1e-9, label: "`dNII` seharusnya −3.75", msg: "(−150 − 50 + 12,5) × 0,02. Cek sisa tahun tiap bucket." },
          { kind: "stdout_matches", task: "t2", pattern: "dNII=-3\\.75", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ΔNII: hanya bucket ≤12 bulan. Beta deposito & asumsi CASA paling menentukan.",
    },
    {
      id: "gap-dua-arah",
      eyebrow: "Langkah 4 · Gap & dua arah",
      title: "Repricing gap — dan kenapa EVE vs NII bisa berbeda arah",
      prose: [
        "Repricing gap per bucket = aset yang repricing − liabilitas yang repricing di bucket itu. Gap positif = asset-sensitive (untung saat rate naik); negatif = liability-sensitive (rugi saat rate naik). Bank tipikal: liability-sensitive di jangka pendek (<6 bulan) tetapi asset-sensitive di jangka panjang — kenaikan suku bunga menggerus NII 12-bulan (beban bunga naik duluan).",
        "Konsep paling membingungkan sekaligus penting: EVE dan NII bisa berbeda arah. EVE melihat seluruh arus kas masa depan (KPR 15Y ikut penuh); NII hanya 12 bulan (KPR yang tidak repricing = tidak ikut). Contoh: bank dengan kredit floating (repricing cepat) + obligasi fixed panjang di aset, didanai deposito ber-beta-rendah. Suku bunga naik → NII naik (pendapatan floating naik duluan, biaya deposito lambat) — direksi senang! Tetapi EVE turun (nilai obligasi long-end anjlok) — regulator waspada.",
        "Pelajaran: jangan kelola IRRBB hanya dengan satu lensa. NII = film 12 bulan ke depan (yang dilihat investor/direksi); EVE = seluruh serial (yang menentukan bank bertahan). Jika arahnya berbeda, EVE yang menang untuk keputusan solvabilitas. Dan gap nol per bucket hanya menetralkan repricing risk paralel — masih ada basis risk (aset ikut JIBOR, liabilitas ikut BI rate), yield curve risk (twist), dan option risk (prepayment, penarikan CASA).",
        "Enam skenario standar BCBS untuk ΔEVE: (1) paralel naik, (2) paralel turun, (3) steepener (pendek turun, panjang naik), (4) flattener (pendek naik, panjang turun), (5) short-end naik, (6) short-end turun. Kenapa enam, bukan satu? Karena bank bisa netral terhadap shock paralel tetapi jebol oleh twist: KPR 15Y + deposito 1Y terlihat aman saat paralel naik 100bp, tetapi flattener menghantam dua sisi sekaligus — biaya dana naik, nilai aset turun. Aturan 15% berlaku per skenario: cukup SATU skenario yang menembus → outlier. Praktisi yang hanya menguji paralel = menguji separuh risiko.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan mekanisme kenapa EVE dan NII bisa berbeda arah." },
        { id: "t2", text: "Gap per bucket semuanya nol. Apakah bank bebas risiko suku bunga?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira gap nol = tidak ada risiko suku bunga. Gap nol hanya menetralkan repricing risk paralel. Masih ada basis risk, yield curve risk, dan option risk — empat sumber IRRBB menurut Basel, gap report hanya menangkap satu.",
        type: "pitfall",
      },
      reference: "Gap = RSA − RSL per bucket. EVE vs NII beda arah karena beda horizon.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Lensa mana, kapan",
      prose: [
        "Empat keputusan. Pertama, kesehatan solvabilitas jangka panjang → EVE + aturan 15%: assessment kecukupan modal, laporan regulator. EVE menangkap seluruh horizon; outlier 15% = trigger wajib tindak lanjut — tidak bisa dinegosiasi dengan tetapi NII kami bagus.",
        "Kedua, perencanaan laba atau anggaran tahunan → NII 12-bulan: budgeting, proyeksi laba, komunikasi investor — yang dilihat pasar adalah laba. Tetapi sertakan asumsi beta secara eksplisit: NII tanpa beta = fiksi. Ketiga, desain lindung nilai → KRD per bucket (key-rate duration per tenor — sensitivitas nilai ke pergeseran tiap titik kurva): EVE/NII agregat tidak memberi tahu di mana mismatch-nya; hedge butuh peta bucket.",
        "Keempat, review asumsi → uji sensitivitas behavioral assumption: hasil EVE/NII paling sensitif ke asumsi CASA & prepayment — bukan ke rumus. Stress-test asumsinya, bukan cuma angkanya. Aturan 10 detik: EVE untuk solvabilitas (aturan 15%), NII untuk laba — butuh keduanya. Jika berbeda arah, percaya EVE untuk keputusan bertahan hidup. Asumsi perilaku > rumus. Gap nol ≠ aman.",
      ],
      tasks: [
        { id: "t1", text: "Direksi hanya mau lihat NII karena labanya bagus. Apa responsmu?" },
        { id: "t2", text: "Apa yang harus diuji dalam validasi model IRRBB?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Krisis S&L 1980-an adalah SVB versi analog: thrift meminjam pendek (deposito) dan meminjamkan panjang (KPR fixed 30Y) — saat Volcker menaikkan rate ke ~20%, EVE mereka negatif secara massal. Industri yang sama, kesalahan yang sama, 40 tahun berselang. IRRBB bukan risiko baru — ia risiko yang terus dilupakan.",
        type: "risk",
      },
      reference: "Solvabilitas → EVE. Laba → NII. Hedge → KRD. Validasi → uji asumsi perilaku.",
    },
    {
      id: "minicase-dua-wajah",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Bank dengan dua wajah",
      prose: [
        "Bank Dana memiliki kredit korporasi floating-rate besar (repricing tiap 3 bulan) dan portofolio obligasi fixed 10Y, didanai CASA ber-beta-rendah (0,25). Suku bunga naik 200bp. NII 12-bulan: naik Rp8 miliar — pendapatan floating naik cepat, biaya CASA lambat. Direksi merayakan: strategi suku bunga kami berhasil.",
        "Tetapi EVE: turun 17% dari Tier 1 — nilai obligasi 10Y anjlok jauh melebihi keuntungan NII. Bank ini outlier menurut Basel, wajib tindak lanjut: kurangi duration gap atau tambah modal. Dua wajah: wajah laba tersenyum, wajah ekonomis berdarah.",
        "Keputusan risk manager: sampaikan kedua angka ke direksi dalam satu halaman — NII +8 M (12 bulan) vs EVE −17% Tier 1 — dengan rekomendasi: jangan terkecoh wajah laba. Tindak lanjut: perpanjang durasi pendanaan atau swap fixed-to-floating sebagian obligasi, dan siapkan penjelasan ke regulator sebelum mereka bertanya. Bom waktu seperti SVB selalu terlihat aman dari lensa yang salah.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa NII naik tetapi EVE turun dalam kasus ini." },
        { id: "t2", text: "Apa rekomendasi dan tindak lanjut risk manager?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengelola IRRBB hanya dari lensa yang terlihat bagus (NII) sambil mengabaikan EVE. Direksi yang hanya lihat NII bisa merasa aman sementara nilai ekonomis tergerus — inilah pola SVB. Selalu sajikan keduanya; untuk solvabilitas, EVE menang.",
        type: "pitfall",
      },
      reference: "NII +8 M vs EVE −17% Tier 1: dua wajah, satu keputusan — percaya EVE.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Satu angka, dua lensa, tiga asumsi",
      prose: [
        "Setelah semua rumus, inilah cara praktisi senior membaca IRRBB dalam 60 detik: minta satu angka — duration gap (D_A·A − D_L·L). Angka itu memberi tahu arah dan orde besarnya: positif besar = bank meminjam pendek dan meminjamkan panjang, dan setiap kenaikan suku bunga menggerus nilai ekonomis. Lalu tanyakan dua lensa: EVE-nya berapa? NII-nya berapa? Jika keduanya sehat, lanjutkan harimu. Jika berbeda arah, selidiki — di sanalah SVB bersembunyi.",
        "Lalu tiga asumsi yang menentukan apakah angka-angka itu bisa dipercaya: (1) beta deposito — seberapa cepat bunga deposito mengikuti pasar; (2) perilaku CASA — kapan giro/tabungan tanpa jatuh tempo kontraktual dianggap repricing atau pergi; (3) prepayment KPR — kapan debitur melunasi lebih awal. Tiga asumsi ini, bukan rumusnya, yang menentukan hasil. Model IRRBB yang rapi dengan asumsi perilaku yang malas = presisi di atas pasir.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan 'satu angka, dua lensa, tiga asumsi' dengan kata-katamu." },
        { id: "t2", text: "Kenapa asumsi perilaku lebih menentukan hasil daripada rumusnya?" },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk IRRBB. Pertama, duration gap adalah satu-satunya angka yang perlu kamu hafal dari laporan 50 halaman: ia memberi tahu siapa yang repricing duluan — aset atau liabilitas — dan seberapa besar taruhannya. Gap positif besar + suku bunga naik = EVE turun; itu selalu benar secara arah, sebelum kamu menghitung satu desimal pun. Kedua, jangan pernah percaya satu lensa: NII bisa tersenyum sementara EVE berdarah (atau sebaliknya), karena horizon keduanya berbeda. Aturan keputusan: untuk solvabilitas, EVE menang; untuk laba tahun ini, NII yang dilihat pasar — sampaikan keduanya, jangan pilih yang enak. Ketiga, curigai selalu tiga asumsi perilaku: beta deposito (apakah 0,3-mu masih berlaku saat deposan panik dan aplikasi bank memudahkan kabur?), umur CASA (apakah giro yang 'stabil' 10 tahun itu stabil karena loyalitas atau karena malas pindah?), dan prepayment (apakah model pelunasan dini-mu masih valid saat suku bunga jatuh dan refinancing marak?). Keempat, ingat konteks Indonesia: KPR fixed-rate panjang didanai CASA murah = duration gap struktural positif — bisnis model bank Indonesia memang membawa IRRBB bawaan; pertanyaannya bukan ada-tidaknya, melainkan seberapa besar dan apakah termitigasi. Kelima, uji 6 skenario BCBS (paralel naik/turun, steepener, flattener, short-end naik/turun) — bukan cuma paralel: bank yang aman dari shock paralel bisa jebol oleh twist kurva. Dan terakhir: IRRBB yang tidak ditindaklanjuti = risiko yang diterima. SVB punya semua angkanya; yang tidak mereka punya adalah kemauan bertindak.",
      },
      reference: "Satu angka (duration gap), dua lensa (EVE vs NII), tiga asumsi (beta, CASA, prepayment).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR11.",
      ],
      tasks: [],
      summary: [
        "IRRBB: risiko suku bunga banking book — tidak terlihat di P&L akrual, tetapi nyata secara ekonomi (SVB 2023).",
        "EVE = PV(aset) − PV(liab) + PV(off-BS); ΔEVE ≈ −(duration gap)·Δy; outlier jika > 15% Tier 1.",
        "NII = laba bunga 12 bulan; hanya bucket ≤12m; beta deposito & asumsi CASA/prepayment paling menentukan.",
        "EVE vs NII bisa berbeda arah karena beda horizon — untuk solvabilitas, EVE menang.",
        "Gap nol ≠ aman: masih ada basis risk, yield curve risk, option risk.",
      ],
      next: { label: "MR11 — Options Risk", href: "/v2/learn/mr11-options-risk" },
      quiz: [
        {
          q: "ΔEVE = −18% dari Tier 1 pada skenario paralel +200bp. Status bank menurut Basel?",
          options: [
            { text: "Aman — masih di bawah 20%", why: "ambangnya 15%, bukan 20%." },
            { text: "Outlier (>15%) — wajib tindak lanjut: kurangi risiko atau tambah modal", why: "aturan 15% Basel — ΔEVE melebihi 15% Tier 1 di skenario manapun = outlier. Ini trigger regulasi.", correct: true },
            { text: "Tidak ada aturan", why: "aturan outlier IRRBB Basel eksplisit." },
            { text: "Cukup laporkan saja", why: "outlier mewajibkan tindak lanjut, bukan sekadar laporan." },
          ],
        },
        {
          q: "Bank liability-sensitive jangka pendek. Suku bunga naik 200bp. Dampak ke NII 12-bulan?",
          options: [
            { text: "NII naik", why: "itu untuk asset-sensitive." },
            { text: "NII turun — biaya liabilitas (repricing cepat) naik mendahului pendapatan aset", why: "liability-sensitive = RSL > RSA di bucket pendek → margin tergerus.", correct: true },
            { text: "NII tidak berubah", why: "mismatch repricing pasti menggerakkan NII." },
            { text: "NII menjadi nol", why: "turun, bukan menjadi nol." },
          ],
        },
        {
          q: "Mengapa EVE dan NII bisa berbeda arah?",
          options: [
            { text: "Karena salah hitung", why: "ini sifat struktural, bukan kesalahan." },
            { text: "EVE melihat seluruh arus kas masa depan; NII hanya 12 bulan — horizon berbeda, sinyal berbeda", why: "NII bisa naik jangka pendek sementara EVE jebol jangka panjang — untuk solvabilitas, EVE menang.", correct: true },
            { text: "Karena memakai mata uang berbeda", why: "tidak ada hubungannya dengan mata uang." },
            { text: "Tidak mungkin berbeda arah", why: "justru sering berbeda arah." },
          ],
        },
        {
          q: "Beta deposito 0,3 artinya?",
          options: [
            { text: "Deposito tidak terpengaruh suku bunga", why: "tetap terpengaruh, hanya sebagian." },
            { text: "Saat suku bunga pasar naik 100bp, bunga deposito hanya naik ~30bp — bank menahan sebagian", why: "beta < 1 = sticky deposit. Tetapi uji asumsinya: saat krisis kepercayaan, deposan bisa pergi.", correct: true },
            { text: "Deposito naik 300bp", why: "0,3 × 100bp = 30bp, bukan 300bp." },
            { text: "Beta tidak relevan", why: "beta paling menentukan hasil NII." },
          ],
        },
        {
          q: "Asumsi paling kritis dalam model IRRBB?",
          options: [
            { text: "Rumus diskonto", why: "rumusnya standar — yang kritis asumsinya." },
            { text: "Behavioral assumptions: kapan CASA repricing & kapan KPR prepay — paling menentukan hasil, bukan rumusnya", why: "validasi model harus stress-test asumsinya: apa jadinya jika CASA pergi 2× lebih cepat?", correct: true },
            { text: "Jumlah bucket", why: "granularitas bucket efeknya kecil dibanding asumsi perilaku." },
            { text: "Warna chart", why: "bukan itu." },
          ],
        },
        {
          q: "Bank netral terhadap shock paralel (+200bp) tetapi ΔEVE-nya −18% dari Tier 1 pada skenario flattener. Status menurut Basel?",
          options: [
            { text: "Aman — shock paralelnya netral", why: "aturan 15% berlaku per skenario, bukan rata-rata atau hanya paralel." },
            { text: "Outlier — cukup satu dari 6 skenario BCBS yang menembus 15% untuk jadi outlier", why: "enam skenario (paralel ±, steepener, flattener, short-end ±) masing-masing diuji; twist kurva bisa membunuh bank yang netral terhadap paralel.", correct: true },
            { text: "Tidak perlu diuji selain paralel", why: "justru skenario non-paralel sering lebih mematikan." },
            { text: "Flattener bukan skenario realistis", why: "flattener/inversi adalah skenario historis yang umum terjadi." },
          ],
        },
      ],
    },
  ],
};
