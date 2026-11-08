import type { V2Lesson } from "../lib/types";

// Sensitivitas nilai DDM terhadap growth g: hiperbola menanjak makin curam.
const DDM_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Sensitivitas nilai DDM terhadap growth: kurva menanjak makin curam, g 4 persen memberi Rp1.714 dan g 7 persen memberi Rp2.400.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="86.7" x2="500" y2="86.7"/><line x1="60" y1="153.3" x2="500" y2="153.3"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">4.500</text><text x="54" y="90.7">3.000</text><text x="54" y="157.3">1.500</text><text x="54" y="224">0</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">0%</text><text x="170" y="240">3%</text><text x="280" y="240">6%</text><text x="390" y="240">9%</text><text x="500" y="240">12%</text></g>
<polyline points="60,164.8 96.7,160.8 133.3,156 170,150.5 206.7,143.9 243.3,135.9 280,126 316.7,113.3 353.3,97 390,74.7 426.7,42.2 445,20" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="206.7" cy="143.9" r="4.5" fill="var(--c1)"/>
<circle cx="316.7" cy="113.3" r="4.5" fill="var(--c1)"/>
<text x="206.7" y="126" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">g=4% → Rp1.714</text>
<text x="316.7" y="96" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">g=7% → Rp2.400</text>
<text x="462" y="52" font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">makin curam</text>
<text x="462" y="65" font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">saat g → r</text>
<text x="14" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 14 120)">nilai wajar P0 (Rp)</text>
</svg>`;

export const pmb4: V2Lesson = {
  slug: "pm-b4-valuasi-ekuitas",
  track: "Portfolio Management",
  module: "Kuantitatif",
  title: "PM-B4 Valuasi Ekuitas: DDM, FCFF & Multiples",
  estMinutes: 55,
  steps: [
    {
      id: "gordon",
      eyebrow: "Langkah 1 · DDM Gordon",
      title: "Saham \u2018murah\u2019 P/E 3x yang mahal",
      prose: [
        "Tono screening saham: menemukan P/E 3x — \u201ctermurah di bursa!\u201d Ia borong. Setahun kemudian: saham turun 50%, dividen dipotong, laba anjlok. Twist-nya: P/E 3x = value trap. E (earnings) sementara tinggi (puncak siklus komoditas); E forward kolaps. P/E rendah bukan murah — melainkan pasar sudah tahu labanya akan turun.",
        "DDM Gordon: P0 = D1/(r\u2212g) — untuk growth konstan selamanya. D1 = Rp200, g = 5%, r = 12% \u2192 P0 = 200/0,07 = Rp2.857. Syarat: perusahaan membagi dividen (atau bisa). Tidak cocok untuk startup nir-dividen \u2192 pakai FCFE.",
      ],
      formula: String.raw`P_0 = \frac{D_1}{r - g} \quad (g < r)`,
      formulaNote: "P0 = nilai wajar kini; D1 = dividen tahun depan; r = required return; g = growth perpetuitas (syarat g<r). Contoh: 200/(0,12−0,05) = Rp2.857. Sensitivitas brutal: g 6% → Rp2.400; g 4% → Rp1.714 (−29%). g terminal adalah asumsi paling mematikan — uji selalu.",
      tasks: [
        { id: "t1", text: "Hitung `p0` Gordon: D1=200, g=5%, r=12%" },
        { id: "t2", text: "Cetak hasilnya (bulatkan)" },
      ],
      expected: "p0=2857",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai Gordon saat g > r (mis. D1 = 100, g = 12%, r = 10%) \u2192 penyebut negatif. Model tidak valid — pakai multistage, bukan Gordon.",
      },
      hints: [
        "P0 = D1 / (r \u2212 g), desimal.",
        "Cek: r > g? 0,12 > 0,05 \u2192 valid.",
        "p0 = d1 / (r - g)",
      ],
      code: {
        starter: `d1, g, r = 200, 0.05, 0.12\n\n# TULIS KODEMU\np0 = \n\nprint(f"p0={p0:.0f}")`,
        lockLines: 1,
        solution: `d1, g, r = 200, 0.05, 0.12\n\n# TULIS KODEMU\np0 = d1 / (r - g)\n\nprint(f"p0={p0:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p0", value: 2857.14, tol: 1, label: "`p0` sekitar 2857", msg: "200/(0,12\u22120,05) = 2.857. Cek penyebut r\u2212g." },
          { kind: "stdout_matches", task: "t2", pattern: "p0=2857", label: "`print` menampilkan p0", msg: "Format: p0=... ." },
        ],
      },
      reference: "Gordon untuk dividen stabil. Butuh g < r. Multiples tanpa DCF = tanpa jangkar.",
    },
    {
      id: "ddm-2stage",
      eyebrow: "Langkah 2 · DDM 2-Stage + chart",
      title: "Terminal mendominasi — uji sensitivitas selalu",
      prose: [
        "D0 = 400, g = 12% selama 5 tahun, lalu stabil g = 5%, r = 11%. PV dividen tahap 1 = Rp2.073; PV terminal value = Rp7.318. P0 \u2248 Rp9.391 — terminal 78% dari nilai.",
        "Pelajaran: untuk perusahaan tumbuh, 70\u201380% \u201cnilai\u201d datang dari periode terminal. Perubahan g 1% bisa mengubah nilai 15\u201320%. Analis senior menghabiskan 80% waktu untuk asumsi terminal — bukan forecast tahun 1\u20135. Setiap valuasi wajib tabel sensitivitas \u00b11\u20132% untuk r & g.",
        "Cara membaca: sumbu X = growth g, sumbu Y = nilai wajar P0; kurva = DDM Gordon yang menanjak ke kanan dan makin curam.",
        "Interpretasi: nilai makin sensitif saat g mendekati r — menaikkan g dari 4% ke 7% mengangkat nilai dari Rp1.714 ke Rp2.400 (selisih 29% dari 3 poin asumsi); inilah alasan analis senior menghabiskan 80% waktu untuk asumsi terminal, bukan forecast tahun 1–5.",
      ],
      figure: {
        svg: DDM_SVG,
        alt: "Sensitivitas nilai DDM terhadap growth: kurva menanjak makin curam.",
        caption: "Sensitivitas DDM: nilai menanjak makin curam saat growth mendekati required return — asumsi g yang sedikit berbeda mengubah nilai secara besar.",
      },
      formula: String.raw`P_0 = \sum_{t=1}^{N}\frac{D_t}{(1+r)^t} + \frac{1}{(1+r)^N}\frac{D_{N+1}}{r-g_{stabil}}`,
      formulaNote: "Suku pertama = PV dividen N tahun pertama (fase tumbuh); suku kedua = PV terminal value — Gordon yang mulai tahun N+1, lalu didiskon ke kini. Contoh: PV dividen Rp2.073 + PV terminal Rp7.318 = Rp9.391 — terminal 78% dari nilai. Analis senior menghabiskan 80% waktu untuk asumsi terminal.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Yakin pada satu angka target tanpa tabel sensitivitas. g 7% \u2192 Rp2.400; g 4% \u2192 Rp1.714 — selisih 29% dari 3 poin asumsi. Tanpa sensitivitas, angka target = dekorasi.",
      },
      quiz: [
        {
          q: "D0=400, g=12% 5thn, g_stabil=5%, r=11%. P0?",
          options: [
            { text: "Rp2.073", why: "Salah: itu PV dividen tahap 1 saja — terminal belum masuk." },
            { text: "\u2248 Rp9.391 (terminal 78%!)", why: "Benar: PV dividen 2.073 + PV terminal 7.318 = 9.391. Terminal mendominasi — uji sensitivitas wajib.", correct: true },
            { text: "Rp12.333", why: "Salah: cek perhitungan PV tiap tahap." },
            { text: "Rp7.318", why: "Salah: itu PV terminal saja — dividen tahap 1 belum masuk." },
          ],
        },
      ],
      reference: "2-stage: PV dividen + PV terminal. Terminal 70\u201380% nilai \u2192 sensitivitas wajib.",
    },
    {
      id: "fcff",
      eyebrow: "Langkah 3 · FCFF",
      title: "Kas untuk semua investor",
      prose: [
        "FCFF = NI + NCC + Int(1\u2212T) \u2212 FCInv \u2212 WCInv. NI Rp200M, depresiasi Rp80M, bunga Rp50M (T=22%), capex Rp150M, \u0394WC Rp40M \u2192 FCFF = 200 + 80 + 39 \u2212 150 \u2212 40 = Rp129M.",
        "Bunga ditambahkan kembali setelah pajak — karena FCFF milik semua investor (utang + ekuitas). Nilai perusahaan = PV(FCFF) @ WACC. Pilih FCFF jika leverage berubah-ubah; FCFE jika struktur modal stabil.",
      ],
      formula: String.raw`FCFF = NI + NCC + Int(1-T) - FCInv - WCInv`,
      formulaNote: "NI = laba bersih; NCC = beban non-kas (depresiasi); Int(1−T) = bunga setelah pajak — ditambahkan kembali karena FCFF milik SEMUA investor; FCInv/WCInv = belanja modal & modal kerja. Contoh: 200+80+39−150−40 = Rp129M. FCFF untuk leverage berubah-ubah; FCFE bila struktur modal stabil.",
      tasks: [
        { id: "t1", text: "Hitung `fcff`: NI=200, dep=80, bunga=50 (T=22%), capex=150, \u0394WC=40" },
        { id: "t2", text: "Cetak hasilnya (bulatkan)" },
      ],
      expected: "fcff=129",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa mengalikan bunga dengan (1\u2212T), atau memakai FCFE (kurangi net borrowing) saat yang diminta FCFF. Bunga kembali ditambah setelah pajak.",
      },
      hints: [
        "Bunga after-tax = bunga \u00d7 (1 \u2212 t).",
        "FCFF = ni + dep + bunga_aftertax \u2212 capex \u2212 dwc.",
        "fcff = ni + dep + bunga*(1-t) - capex - dwc",
      ],
      code: {
        starter: `ni, dep, bunga, t, capex, dwc = 200, 80, 50, 0.22, 150, 40\n\n# TULIS KODEMU\nfcff = \n\nprint(f"fcff={fcff:.0f}")`,
        lockLines: 1,
        solution: `ni, dep, bunga, t, capex, dwc = 200, 80, 50, 0.22, 150, 40\n\n# TULIS KODEMU\nfcff = ni + dep + bunga*(1-t) - capex - dwc\n\nprint(f"fcff={fcff:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fcff", value: 129, tol: 1e-9, label: "`fcff` seharusnya 129", msg: "200+80+39\u2212150\u221240 = 129. Bunga after-tax = 50\u00d70,78 = 39." },
          { kind: "stdout_matches", task: "t2", pattern: "fcff=129", label: "`print` menampilkan fcff", msg: "Format: fcff=... ." },
        ],
      },
      reference: "FCFF = NI + non-kas + bunga(1\u2212T) \u2212 capex \u2212 \u0394WC.",
    },
    {
      id: "bridge",
      eyebrow: "Langkah 4 · Bridge ke Ekuitas",
      title: "Dari firm value ke equity value",
      prose: [
        "Firm value Rp1,9T, utang Rp600M, kas Rp100M. Equity value = 1.900 \u2212 600 + 100 = Rp1,4T. Equity = residu setelah kreditor — bridge wajib setiap kali valuasi FCFF.",
        "Urutan valuasi absolut: proyeksikan FCFF \u2192 diskon @ WACC \u2192 firm value \u2192 kurangi utang, tambah kas \u2192 equity value \u2192 bagi saham beredar \u2192 target harga.",
      ],
      formula: String.raw`\text{Equity} = \text{Firm value} - \text{Utang} + \text{Kas}`,
      formulaNote: "Equity = residu setelah kreditor: firm value dikurangi utang (kreditor dibayar dulu), ditambah kas (milik pemegang saham). Contoh: 1.900 − 600 + 100 = Rp1,4T. Lupa bridge = melaporkan firm value sebagai nilai ekuitas — kesalahan analis junior paling mahal.",
      tasks: [
        { id: "t1", text: "Hitung `equity`: firm=1900, utang=600, kas=100 (Rp miliar)" },
        { id: "t2", text: "Cetak hasilnya (bulatkan)" },
      ],
      expected: "equity=1400",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa bridge: melaporkan firm value sebagai nilai ekuitas. Atau lupa menambah kas — kas adalah aset yang juga milik pemegang saham.",
      },
      hints: [
        "Equity = firm \u2212 utang + kas.",
        "Semua dalam Rp miliar.",
        "equity = firm - utang + kas",
      ],
      code: {
        starter: `firm, utang, kas = 1900, 600, 100\n\n# TULIS KODEMU\nequity = \n\nprint(f"equity={equity:.0f}")`,
        lockLines: 1,
        solution: `firm, utang, kas = 1900, 600, 100\n\n# TULIS KODEMU\nequity = firm - utang + kas\n\nprint(f"equity={equity:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "equity", value: 1400, tol: 1e-9, label: "`equity` seharusnya 1400", msg: "1.900 \u2212 600 + 100 = 1.400. Equity = residu setelah kreditor." },
          { kind: "stdout_matches", task: "t2", pattern: "equity=1400", label: "`print` menampilkan equity", msg: "Format: equity=... ." },
        ],
      },
      reference: "FCFF + WACC = enterprise value. Bridge: \u2212 utang + kas = equity.",
    },
    {
      id: "ri-multiples",
      eyebrow: "Langkah 5 · RI & Multiples",
      title: "Dua lensa: residual income dan jebakan P/E",
      prose: [
        "Residual income: V0 = B0 + PV(RI). Berjangkar pada book value — tidak butuh FCF positif. Cocok untuk bank ekspansi atau asuransi dengan book andal tetapi FCF negatif.",
        "Multiples: cepat tetapi relatif. EV/EBITDA trailing 2,5x vs forward 6,7x \u2192 value trap: E trailing = laba puncak siklus; forward mahal. Untuk siklikal selalu pakai forward/normalized. \u2018Murah\u2019 = di bawah nilai intrinsik, bukan P/E rendah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu model = satu sudut pandang. Kerangka anti-value-trap: (1) posisi siklus; (2) normalized earnings; (3) tiga model (DDM/FCFF/RI) + rekonsiliasi; (4) skenario bear/base/bull; (5) margin of safety 25%+.",
      },
      quiz: [
        {
          q: "Kapan residual income lebih baik dari DCF?",
          options: [
            { text: "Selalu", why: "Salah: RI unggul di kondisi tertentu — tidak selalu." },
            { text: "FCF negatif tapi book value andal (bank ekspansi)", why: "Benar: RI berjangkar B0 — tidak butuh FCF positif. Cocok untuk bank/asuransi dengan book bermakna.", correct: true },
            { text: "Tidak pernah", why: "Salah: RI justru solusi untuk kasus FCF negatif." },
            { text: "Hanya startup", why: "Salah: startup justru book-nya tidak andal." },
          ],
        },
        {
          q: "EV/EBITDA trailing 2,5x vs forward 6,7x. Kesimpulan?",
          options: [
            { text: "Murah — beli", why: "Salah: trailing = spion; untuk siklikal selalu pakai forward/normalized." },
            { text: "Value trap: E trailing puncak siklus; forward mahal", why: "Benar: \u2018murah\u2019 semu = jebakan Tono. Pasar sudah mendiskon penurunan.", correct: true },
            { text: "Peers salah", why: "Salah: masalahnya di E trailing, bukan peers." },
            { text: "EV salah hitung", why: "Salah: EV-nya benar; E-nya yang menipu." },
          ],
        },
      ],
      reference: "RI untuk book andal & FCF negatif. Multiples: forward, bukan trailing.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: valuasi absolut tanpa value trap",
      prose: [
        "Skenario 1 — P/E 3x terlihat 'termurah di bursa'. → Cek dulu posisi siklusnya: E trailing di puncak komoditas = value trap. Pakai EV/EBITDA forward atau earnings yang dinormalisasi.",
        "Skenario 2 — Perusahaan dividen stabil. → DDM Gordon P0 = D1/(r−g). Perusahaan tumbuh → 2-stage. Ingat: 70–80% nilai ada di terminal — uji sensitivitas ±1–2% untuk r & g, selalu.",
        "Skenario 3 — Leverage berubah-ubah. → Pakai FCFF didiskon @ WACC. Struktur modal stabil → FCFE boleh.",
        "Skenario 4 — Dari firm value ke target harga. → Jangan lupa bridge: kurangi utang, tambah kas, bagi saham beredar. Equity = residu setelah kreditor.",
        "Skenario 5 — Valuasi di emerging market. → Tambah country risk premium ke discount rate. Mengabaikan CRP = overvalue puluhan persen (contoh: Rp2.857 vs Rp5.000 = 75%).",
        "Aturan praktis 10 detik: P/E rendah → cek siklus; dividen stabil → Gordon; tumbuh → 2-stage + sensitivitas; firm → equity → bridge; EM → +CRP.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghabiskan 80% waktu untuk forecast tahun 1–5. Padahal 70–80% nilai valuasi datang dari asumsi terminal — analis senior membalik proporsinya: 80% waktu untuk asumsi terminal.",
      },
    },
    {
      id: "minicase-tono",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Kerangka anti-value-trap Tono",
      prose: [
        "Tono membeli saham tambang P/E 3x (trailing) di puncak siklus komoditas. Setahun: \u221250%, dividen dipotong. Mekanisme value trap: E puncak siklus \u2192 P/E trailing rendah semu; forward E kolaps \u2192 P/E forward tinggi.",
        "Tiga cek sebelum beli \u2018murah\u2019: (1) EV/EBITDA forward vs peers; (2) posisi siklus komoditas (harga vs mid-cycle); (3) DCF dengan asumsi siklus. Sensitivitas brutal: Gordon g = 7% \u2192 Rp2.400; g wajar = 4% \u2192 Rp1.714 — selisih 29% dari 3 poin asumsi.",
        "Kerangka anti-trap: posisi siklus \u2192 normalized earnings \u2192 tiga model + rekonsiliasi \u2192 skenario bear/base/bull \u2192 margin of safety 25%+ dari base.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Analis yang \u201cyakin\u201d dengan Rp2.400 sebenarnya bertaruh pada asumsi yang tidak ia uji. Selalu tampilkan rentang sensitivitas, bukan satu angka.",
      },
      reference: "P/E rendah tanpa konteks siklus = undangan ke value trap.",
    },
    {
      id: "normalisasi-country-risk",
      eyebrow: "Langkah 8 · Normalisasi & country risk",
      title: "Dua penyesuaian yang mengubah rekomendasi",
      prose: [
        "Normalisasi earnings: untuk siklikal, E trailing menipu — di puncak ia terlalu optimis, di lembah terlalu muram. Normalisasi = pakai mid-cycle margin × revenue kini. Contoh tambang: margin EBITDA 5 tahun 45, 50, 38, 30, 28 → rata-rata ≈ 38%; revenue Rp10T → normalized EBITDA Rp3,8T vs trailing Rp2,8T (lembah). Valuasi dari trailing lembah = bayar kemahalan 36% tanpa sadar. Aturan: siklikal → selalu normalisasi; defensif (consumer staple) → trailing boleh.",
        "Penyesuaian EM — country risk premium: investor menuntut premi risiko negara. Damodaran: CRP = sovereign default spread × (σ_ekuitas / σ_obligasi). Contoh Indonesia: spread 2%, rasio vol 1,5 → CRP = 3%; r (USD) = 9% + 3% = 12%. Gordon D1 = Rp200, g = 5%: dengan CRP → 200/0,07 = Rp2.857; tanpa CRP (r = 9%) → 200/0,04 = Rp5.000 — mengabaikan CRP = overvalue 75%. Valuasi EM tanpa CRP = fantasi.",
        "Checklist keputusan analis sebelum rekomendasi “beli”: (1) posisi siklus terpetakan? (2) earnings ternormalisasi? (3) CRP masuk WACC? (4) sensitivitas ±2% untuk r & g? (5) tiga model + rekonsiliasi? (6) margin of safety 25%+ dari base? Enam centang atau jangan rekomendasikan — analis dibayar untuk keyakinan yang teruji, bukan untuk angka target.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: 80% waktumu untuk 20% asumsi",
        body: "Analis senior menghabiskan 80% waktu valuasi untuk dua asumsi: g terminal dan r — sisanya noise. Heuristiknya: tanya “asumsi apa yang harus SALAH agar rekomendasi saya berbalik dari beli menjadi jual?” — itulah satu-satunya asumsi yang layak di-stress sampai tuntas. Kedua: untuk EM, CRP bukan bumbu melainkan bahan utama — tanpa CRP setiap saham Indonesia terlihat murah dibanding AS, dan itu ilusi akuntansi bukan peluang. Ketiga: normalisasi dulu, proyeksi kemudian — forecast presisi dari basis yang salah (puncak/lembah siklus) = presisi menuju kesalahan. Keempat: satu angka target tanpa rentang sensitivitas adalah dekorasi — klien yang cerdas tidak bertanya “berapa targetnya?” melainkan “pada asumsi apa target ini mati?”. Jawab pertanyaan kedua sebelum ditanya. Kelima: untuk valuasi relatif, pilih peers yang benar-benar sebanding — satu peer beda model bisnis merusak median lebih dari tiga asumsi salah; baca laporan tahunan peers sebelum memasukkan ke comps. Keenam: tanggalkan setiap valuasi — valuasi tanpa tanggal = opini tanpa akuntabilitas; pasar bergerak, asumsi kedaluwarsa.",
      },
      reference: "Siklikal → normalisasi. EM → CRP. Enam centang sebelum “beli”.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran: FCFF, bridge, dan sensitivitas.",
      ],
      tasks: [],
      quiz: [
        {
          q: "NI 200, dep 80, bunga 50 (T=22%), capex 150, \u0394WC 40. FCFF?",
          options: [
            { text: "Rp129M", why: "Benar: 200+80+39\u2212150\u221240 = 129. Bunga kembali ditambah setelah pajak (milik semua investor).", correct: true },
            { text: "Rp200M", why: "Salah: itu NI saja — belum disesuaikan." },
            { text: "Rp90M", why: "Salah: cek bunga after-tax = 39, bukan 0." },
            { text: "Rp280M", why: "Salah: 200+80 = 280 mengabaikan bunga, capex, dan WC." },
          ],
        },
        {
          q: "Firm value Rp1,9T, utang Rp600M, kas Rp100M. Equity value?",
          options: [
            { text: "Rp1,9T", why: "Salah: itu firm value — bridge belum dilakukan." },
            { text: "Rp1,4T", why: "Benar: 1.900 \u2212 600 + 100 = 1.400. Equity = residu setelah kreditor.", correct: true },
            { text: "Rp2,5T", why: "Salah: menjumlahkan semuanya — utang dikurangi, bukan ditambah." },
            { text: "Rp1,2T", why: "Salah: 1.900\u2212600\u2212100 — kas ditambah, bukan dikurangi." },
          ],
        },
        {
          q: "Gordon: D1=Rp120, g=6%, r=11% \u2192 Rp2.400. Jika g direvisi ke 4%, nilai baru?",
          options: [
            { text: "Rp3.000 (naik 25%)", why: "Salah: g turun \u2192 penyebut membesar \u2192 nilai turun." },
            { text: "Rp1.714 (turun 29%)", why: "Benar: 120/(0,11\u22120,04) = 120/0,07 = Rp1.714. Asumsi g terminal mendominasi valuasi.", correct: true },
            { text: "Rp2.000 (turun 17%)", why: "Salah: hitung ulang 120/0,07." },
            { text: "Tetap Rp2.400", why: "Salah: g adalah asumsi paling sensitif di Gordon." },
          ],
        },
      ],
      summary: [
        "DDM: Gordon untuk stabil; 2-stage untuk transisi; terminal 70\u201380% nilai.",
        "FCFF (semua investor) vs FCFE (pemegang saham); bridge ke equity.",
        "Residual income: V0 = B0 + PV(RI); untuk book andal & FCF negatif.",
        "Multiples: cepat tetapi relatif; waspada value trap (pakai forward).",
        "Aturan: DCF jangkar, multiples cross-check; sensitivitas selalu; margin of safety.",
      ],
      next: { label: "PM-B5 — Fixed Income Lanjut: Kurva, Kredit & MBS", href: "/v2/learn/pm-b5-fixed-income-lanjut" },
    },
  ],
};
