import type { V2Lesson } from "../lib/types";

const FIG_TRANCHE = `<svg viewBox="0 0 480 300" role="img" aria-label="Tumpukan tranche: ekuitas paling bawah menanggung rugi pertama.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Pool Rp500 M dipotong tiga</text>
<text x="10" y="52" font-size="11" fill="var(--chart-text)">Senior (70%)</text>
<rect x="140" y="38" width="280" height="60" fill="var(--c1)" opacity="0.9"/>
<text x="280" y="72" font-size="12" fill="var(--chart-text)" text-anchor="middle">Rp350 M — dibayar pertama, rugi terakhir</text>
<text x="10" y="122" font-size="11" fill="var(--chart-text)">Mezzanine (20%)</text>
<rect x="140" y="108" width="280" height="60" fill="var(--c3)" opacity="0.9"/>
<text x="280" y="142" font-size="12" fill="var(--chart-text)" text-anchor="middle">Rp100 M — tengah-tengah</text>
<text x="10" y="192" font-size="11" fill="var(--chart-text)">Equity (10%)</text>
<rect x="140" y="178" width="280" height="60" fill="var(--c4)" opacity="0.9"/>
<text x="280" y="212" font-size="12" fill="#fff" text-anchor="middle">Rp50 M — rugi pertama, imbal hasil tertinggi</text>
<text x="440" y="160" font-size="20" fill="var(--c4)">↑</text>
<text x="440" y="185" font-size="10" fill="var(--chart-text)">rugi naik</text>
<text x="440" y="80" font-size="20" fill="var(--c1)">↓</text>
<text x="440" y="105" font-size="10" fill="var(--chart-text)">kas turun</text>
<text x="10" y="265" font-size="11" fill="var(--chart-text)">Kerugian Rp80 M → equity habis (50), mezzanine kena 30, senior utuh.</text>
</g>
</svg>`;

const FIG_WATERFALL = `<svg viewBox="0 0 480 250" role="img" aria-label="Air terjun kerugian: mengisi equity dulu, lalu mezzanine.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Air terjun kerugian Rp80 M</text>
<rect x="20" y="60" width="120" height="120" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="80" y="85" font-size="11" fill="var(--chart-text)" text-anchor="middle">Equity Rp50 M</text>
<text x="80" y="105" font-size="12" fill="var(--c4)" text-anchor="middle" font-weight="bold">HABIS 100%</text>
<text x="80" y="150" font-size="10" fill="var(--chart-text)" text-anchor="middle">menampung 50 dari 80</text>
<rect x="180" y="60" width="120" height="120" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="240" y="85" font-size="11" fill="var(--chart-text)" text-anchor="middle">Mezzanine Rp100 M</text>
<text x="240" y="105" font-size="12" fill="var(--c3)" text-anchor="middle" font-weight="bold">KENA 30%</text>
<text x="240" y="150" font-size="10" fill="var(--chart-text)" text-anchor="middle">sisa 30 dari 80</text>
<rect x="340" y="60" width="120" height="120" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="400" y="85" font-size="11" fill="var(--chart-text)" text-anchor="middle">Senior Rp350 M</text>
<text x="400" y="105" font-size="12" fill="var(--c1)" text-anchor="middle" font-weight="bold">UTUH 0%</text>
<text x="400" y="150" font-size="10" fill="var(--chart-text)" text-anchor="middle">terlindungi 150 M</text>
<text x="20" y="215" font-size="11" fill="var(--chart-text)">Senior mulai rugi hanya bila kerugian pool &gt; Rp150 M.</text>
</g>
</svg>`;

export const cr29: V2Lesson = {
  slug: "cr29-sekuritisasi",
  track: "Credit Risk",
  module: "Kredit Terstruktur",
  title: "CR29 — Sekuritisasi: Rp500 Miliar yang Dipotong Tiga",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kue lapis yang dimakan dari bawah",
      prose: [
        "Bank Nusantara punya 1.000 KPR senilai Rp500 miliar. Ia tidak menjualnya satu per satu — ia membungkusnya menjadi satu efek, lalu memotongnya menjadi tiga lapis: Senior Rp350 miliar (70%), Mezzanine Rp100 miliar (20%), Equity Rp50 miliar (10%). Investor pensiun membeli senior yang aman; hedge fund membeli equity yang berisiko.",
        "Setahun kemudian, Rp80 miliar KPR gagal bayar. Twist-nya: kerugian Rp80 miliar itu TIDAK dibagi rata. Equity Rp50 miliar habis total — 100% hangus. Mezzanine menanggung sisanya Rp30 miliar — 30% hangus. Senior? Utuh, tidak kurang satu rupiah. Kue lapis ini dimakan dari bawah: yang paling bawah menanggung rugi pertama, yang paling atas dibayar pertama.",
        "Ada twist kedua, yang historis. Tahun 2007, struktur persis seperti ini — dengan label AAA di tranche seniornya — dijual ke seluruh dunia. Ketika harga properti AS jatuh serentak, korelasi default yang diasumsikan 0,2 ternyata 0,6. Kerugian pool menembus Rp150 miliar proteksi, lalu Rp350 miliar senior ikut berdarah. AAA menjadi sampah dalam hitungan bulan. Pelajaran 2008 bukan 'sekuritisasi itu jahat' — melainkan 'struktur yang tidak dipahami adalah bom'. Dan pemahaman itu dimulai dari satu keterampilan: menghitung siapa menanggung apa, pada kerugian berapa.",
        "Inilah sekuritisasi: mengubah pool kredit menjadi tranche dengan profil risiko berbeda. Lesson ini tentang cara memotong, cara menghitung siapa menanggung apa, dan mengapa 2008 terjadi ketika orang lupa cara menghitungnya. Setelah lesson ini kamu bisa: (1) menjelaskan struktur tranche dan waterfall; (2) menghitung alokasi kerugian per tranche; (3) menjelaskan credit enhancement; (4) membaca konteks EBA-SP Indonesia.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Sekuritisasi adalah tempat risiko kredit menjadi 'teknik': PD/LGD pool diubah menjadi produk dengan rating berbeda. Analis yang paham waterfall paham mengapa tranche senior bisa berperingkat AAA dari pool berisi kredit BBB — dan kapan klaim itu bohong (korelasi default yang diremehkan, pelajaran 2008).",
      },
      reference: "Tranche = potongan risiko. Waterfall: kas turun, rugi naik.",
    },
    {
      id: "tranche",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga lapis, tiga nasib",
      prose: [
        "Tranche adalah potongan klaim atas arus kas pool. Equity (first-loss, 10%): menyerap kerugian pertama; imbal hasil tertinggi sebagai kompensasi; biasanya dipegang originator (skin in the game). Mezzanine (20%): menanggung setelah equity habis; imbal menengah. Senior (70%): dibayar pertama, menanggung terakhir; imbal terendah tetapi bisa berperingkat tinggi.",
        "Aturan mainnya: arus kas (pembayaran KPR) mengalir dari ATAS ke bawah — senior dibayar dulu, lalu mezzanine, lalu equity. Kerugian mengalir dari BAWAH ke atas — equity habis dulu, lalu mezzanine, lalu senior. Dua arah berlawanan dalam satu struktur — inilah 'waterfall'.",
        "Contoh Rp80 miliar kerugian: equity Rp50 miliar → hangus 100%. Sisa Rp30 miliar naik ke mezzanine → 30% hangus. Senior utuh. Perhatikan: kerugian pool hanya 16% (80/500), tetapi equity hancur total. Leverage risiko: tranche bawah memperbesar (me-leverage) risiko pool.",
        "Sisi sebaliknya — arus kas — bekerja dengan logika cermin. Misalkan pool menghasilkan Rp50 miliar pembayaran KPR tahun ini. Air terjun kas: senior mendapat kuponnya dulu (mis. Rp21 miliar = 6% × 350), lalu mezzanine (Rp8 miliar = 8% × 100), sisanya Rp21 miliar ke equity = 42% atas modal Rp50 miliar. Tahun yang baik: equity berpesta (42%), senior 'hanya' 6%. Tahun yang buruk (rugi Rp80 miliar): equity -100%, senior 0%. Inilah kontraknya: equity membeli volatilitas dua arah — pesta dan pemakaman.",
        "Tiga miskonsepsi. Satu: 'Senior = bebas risiko.' Bukan — senior aman sampai kerugian menembus Rp150 miliar (50+100); di atas itu senior ikut berdarah. Dua: 'Tranche = diversifikasi.' Diversifikasi ada di pool; tranche adalah KONSENTRASI risiko ke lapis tertentu. Tiga: 'Rating AAA senior = kreditnya bagus.' Rating menilai struktur + pool — AAA dari pool sampah dengan subordinasi tebal tetap rapuh bila korelasi default diremehkan (inilah dosa CDO 2008).",
      ],
      formula: String.raw`\text{Rugi}_{\text{tranche}} = \max(0, \min(\text{Tebal tranche}, \text{Rugi pool} - \text{Proteksi di bawahnya}}))`,
      formulaNote: "Proteksi di bawahnya = total tebal tranche yang lebih junior. Contoh mezzanine: max(0, min(100, 80 − 50)) = 30. Contoh senior: max(0, min(350, 80 − 150)) = 0. Interpretasi: tiap tranche hanya 'melihat' kerugian setelah lapis di bawahnya habis.",
      figure: {
        svg: FIG_TRANCHE,
        alt: "Tumpukan tranche senior, mezzanine, equity.",
        caption: "Kas turun dari atas; rugi naik dari bawah. Equity = bemper pertama.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kerugian pool 16%, jadi tiap tranche rugi 16%.” Salah total — dan kesalahan ini persis yang membuat banyak investor 2008 kaget. Kerugian TIDAK dibagi rata; ia mengisi dari bawah. Equity 100% hangus sementara senior 0% — dari pool yang sama.",
      },
      hints: [
        "Selalu hitung 'attachment point' (rugi pool saat tranche mulai kena) dan 'detachment point' (saat tranche habis).",
        "Equity = 0–10%, mezzanine = 10–30%, senior = 30–100% dari kerugian pool.",
      ],
      reference: "Rugi mengisi dari bawah. Senior aman sampai proteksi jebol.",
    },
    {
      id: "enhancement",
      eyebrow: "Langkah 3 · Konsep",
      title: "Baju zirah tranche senior",
      prose: [
        "Mengapa investor berani membeli senior? Karena credit enhancement — lapisan perlindungan tambahan. Satu: subordinasi — Rp150 miliar tranche junior sebagai bemper (sudah kita hitung). Dua: overcollateralization — pool Rp500 miliar menerbitkan efek hanya Rp480 miliar; selisih Rp20 miliar = bantalan. Tiga: excess spread — bunga KPR 10% vs kupon efek 7%; selisih 3% menutup kerugian duluan. Empat: reserve fund — kas yang disisihkan di awal.",
        "Kepribadian masing-masing: subordinasi adalah 'tembok', overcollateralization adalah 'parit', excess spread adalah 'pasukan cadangan yang datang tiap bulan', reserve fund adalah 'perbekalan'. Struktur yang baik punya semuanya — struktur yang buruk mengandalkan satu.",
        "Contoh angka: pool Rp500 miliar, efek diterbitkan Rp480 miliar → overcollateralization Rp20 miliar (4%). Bunga pool rata-rata 10%, kupon efek rata-rata 7% → excess spread 3% ≈ Rp15 miliar per tahun yang menutup kerugian duluan sebelum menyentuh equity. Reserve fund Rp10 miliar di awal. Total bantalan sebelum equity tersentuh: 20 + 15 + 10 = Rp45 miliar — hampir setebal equity itu sendiri. Analis yang baik menjumlahkan SEMUA bantalan, bukan hanya subordinasi.",
        "Konteks Indonesia: Efek Beragun Aset (EBA) — termasuk EBA Surat Partisipasi yang diatur POJK 12/2026 (berdasarkan penelusuran regulasi, efektif September 2026). Pasar masih muda dibanding AS — justru di sinilah analis yang paham waterfall punya nilai: bisa menilai struktur dengan benar saat pasar tumbuh.",
        "Mengapa pasar Indonesia relevan untuk karirmu? Bank-bank besar mulai memindahkan KPR dan kredit kendaraan ke luar neraca via EBA untuk membebaskan modal (menurunkan RWA — ingat CR16/RR16). Setiap transaksi EBA butuh analis yang bisa membaca prospektus: berapa subordinasi efektifnya, bagaimana perilakunya saat prepayment melonjak (borrower melunasi lebih cepat saat suku bunga turun — yang menggerus excess spread), dan apakah asumsi korelasinya masuk akal untuk portofolio Indonesia. Lowongan 'structured finance analyst' yang muncul 2025–2026 meminta tepat kemampuan membaca waterfall ini.",
        "Dua miskonsepsi. Satu: 'Enhancement menghilangkan risiko.' Tidak — ia memindahkan dan menunda; risiko pool tetap ada. Dua: 'Struktur Indonesia = struktur AS.' Kerangka hukum, kualitas data historis, dan perilaku prepayment berbeda — jangan tempelkan asumsi AS mentah-mentah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        type: "risk",
        body: "Credit enhancement adalah 'asuransi yang dibayar oleh struktur itu sendiri'. Pertanyaan analis yang tajam bukan 'ada enhancement-nya?' melainkan 'berapa tebalnya dalam skenario stress?' — subordinasi 30% terlihat tebal sampai korelasi default naik ke 0,5.",
      },
      hints: [
        "Uji enhancement dengan skenario korelasi tinggi — di situlah subordinasi bocor.",
        "Excess spread hanya membantu bila arus kas lancar; saat krisis, ia mengering duluan.",
      ],
      reference: "Enhancement = tembok + parit + cadangan. Tebalnya diuji saat stress.",
    },
    {
      id: "korelasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Korelasi: pembunuh tersembunyi",
      prose: [
        "Ada satu asumsi yang menentukan apakah subordinasi Rp150 miliar itu tebal atau tipis: korelasi default. Bila 1.000 KPR gagal bayar secara acak dan independen, kerugian menyebar — equity menampung, senior aman. Bila mereka gagal bayar BERSAMAAN (resesi, harga properti jatuh serentak), kerugian datang bergelombang — dan gelombang itu melompati equity langsung ke mezzanine, bahkan senior.",
        "Matematikanya sederhana dan menakutkan. Dua kredit, masing-masing PD 5%. Bila independen: peluang keduanya gagal = 5% × 5% = 0,25%. Bila korelasinya 0,5 (krisis): peluang bersama melonjak berkali-kali lipat. Inilah yang diremehkan model kopula Gaussian pra-2008: korelasi diinput 0,2 dari data masa tenang — lalu krisis mengirimkannya ke 0,6.",
        "Kepribadian korelasi: ia adalah 'cuaca' portofolio. Saat cerah, semua terlihat independen. Saat badai, semua jatuh bersama. Tranche senior adalah payung yang dirancang untuk hujan rintik — bukan untuk badai.",
        "Dua miskonsepsi. Satu: 'Pool besar = terdiversifikasi.' Diversifikasi butuh independensi; 1.000 KPR di satu kota dengan satu pemberi kerja utama = 1.000 taruhan yang sama. Dua: 'Korelasi historis cukup.' Korelasi di masa tenang meremehkan korelasi saat stress — justru saat kamu membutuhkannya.",
      ],
      formula: String.raw`P(A \cap B) = P(A) \times P(B) \quad \text{hanya bila independen}`,
      formulaNote: "P(A), P(B) = peluang default tiap kredit. Bila independen: 5% × 5% = 0,25%. Dengan korelasi positif, peluang bersama JAUH lebih besar — inilah yang menjebol subordinasi. Interpretasi: korelasi mengubah 'kegagalan acak' menjadi 'kegagalan serentak'.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Subordinasi 30% pasti cukup.” Cukup untuk korelasi berapa? Pada korelasi 0,2 mungkin ya; pada 0,6 belum tentu. Subordinasi tanpa menyebut asumsi korelasi = angka tanpa konteks = klaim yang tidak bisa diaudit.",
      },
      hints: [
        "Selalu tanyakan asumsi korelasi di balik setiap klaim ketahanan tranche.",
        "Korelasi stress ≈ 2–3x korelasi normal untuk portofolio sejenis — pakai itu sebagai uji cepat.",
      ],
      reference: "Korelasi = cuaca portofolio. Badai = gagal bersama = subordinasi jebol.",
    },
    {
      id: "lab-waterfall",
      eyebrow: "Langkah 4 · Lab",
      title: "Air terjun Rp80 miliar",
      prose: [
        "Pool Rp500 miliar, tranche: equity 50, mezzanine 100, senior 350 (Rp miliar). Kerugian pool Rp80 miliar. Hitung rugi tiap tranche dengan rumus alokasi — lalu tentukan persentase hangus tiap lapis.",
        "Eksperimen: naikkan kerugian menjadi Rp200 miliar — equity habis, mezzanine habis (100), senior kena 50 (14,3%). Turunkan ke Rp40 miliar — hanya equity yang berdarah (80%). Inilah mengapa investor senior tidur nyenyak dan investor equity tidak.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rugi_e`, `rugi_m`, `rugi_s` (Rp M)" },
        { id: "t2", text: "Jalankan dan pastikan alokasinya tercetak" },
      ],
      expected: "Equity: rugi Rp50.0 M (100.0%)\nMezzanine: rugi Rp30.0 M (30.0%)\nSenior: rugi Rp0.0 M (0.0%)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Mezzanine rugi 80 × 20% = 16.” Itu pembagian proporsional — waterfall tidak bekerja begitu. Mezzanine hanya melihat sisa setelah equity habis: 80 − 50 = 30. Urutan mengalahkan proporsi.",
      },
      hints: [
        "rugi_e = min(tebal_e, rugi_pool).",
        "rugi_m = min(tebal_m, rugi_pool − rugi_e); rugi_s = min(tebal_s, rugi_pool − rugi_e − rugi_m).",
      ],
      code: {
        starter: "# Tebal tranche Rp M. JANGAN UBAH.\ntebal_e, tebal_m, tebal_s = 50.0, 100.0, 350.0\nrugi_pool = 80.0\n\n# TULIS KODEMU: alokasi waterfall (dari bawah)\nrugi_e =\nrugi_m =\nrugi_s =\nfor nama, rugi, tebal in [(\"Equity\", rugi_e, tebal_e), (\"Mezzanine\", rugi_m, tebal_m), (\"Senior\", rugi_s, tebal_s)]:\n    print(f\"{nama}: rugi Rp{rugi:.1f} M ({rugi/tebal*100:.1f}%)\")\n",
        lockLines: 3,
        solution: "# Tebal tranche Rp M. JANGAN UBAH.\ntebal_e, tebal_m, tebal_s = 50.0, 100.0, 350.0\nrugi_pool = 80.0\n\n# TULIS KODEMU: alokasi waterfall (dari bawah)\nrugi_e = min(tebal_e, rugi_pool)\nrugi_m = min(tebal_m, rugi_pool - rugi_e)\nrugi_s = min(tebal_s, rugi_pool - rugi_e - rugi_m)\nfor nama, rugi, tebal in [(\"Equity\", rugi_e, tebal_e), (\"Mezzanine\", rugi_m, tebal_m), (\"Senior\", rugi_s, tebal_s)]:\n    print(f\"{nama}: rugi Rp{rugi:.1f} M ({rugi/tebal*100:.1f}%)\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "rugi_e = 50", msg: "min(50, 80).", name: "rugi_e", value: 50.0, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "rugi_m = 30", msg: "min(100, 80−50).", name: "rugi_m", value: 30.0, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "rugi_s = 0", msg: "min(350, 80−80).", name: "rugi_s", value: 0.0, tol: 1e-9 },
          { kind: "stdout_matches", task: "t2", label: "Senior 0% tercetak", msg: "Senior utuh.", pattern: "Senior: rugi Rp0\\.0 M \\(0\\.0%\\)" }
        ],
      },
      reference: "Waterfall: min(tebal, sisa rugi) dari bawah ke atas.",
    },
    {
      id: "lab-breakeven",
      eyebrow: "Langkah 5 · Lab",
      title: "Titik pendarahan senior",
      prose: [
        "Investor senior bertanya: 'Kerugian pool berapa yang mulai melukai saya?' Hitung attachment point tiap tranche — rugi pool saat tranche mulai kena — dan detachment point — saat tranche habis total.",
        "Eksperimen: tebalkan equity menjadi 100 (20%) — attachment senior naik dari 150 ke 200. Inilah 'harga' keamanan senior: dibayar dengan imbal hasil equity yang lebih tinggi. Struktur adalah soal tawar-menawar risiko.",
      ],
      tasks: [
        { id: "t1", text: "Hitung attachment & detachment tiap tranche" },
        { id: "t2", text: "Jalankan dan pastikan tabelnya tercetak" },
      ],
      expected: "Equity: mulai kena di 0.0, habis di 50.0\nMezzanine: mulai kena di 50.0, habis di 150.0\nSenior: mulai kena di 150.0, habis di 500.0",
      note: {
        title: "Intuisi",
        body: "Attachment–detachment adalah 'koordinat GPS' tiap tranche di peta kerugian. Investor profesional tidak bertanya 'aman tidak?' — ia bertanya 'attachment saya di mana?' Karena di situlah ia tahu persis kapan harus khawatir.",
      },
      hints: [
        "attachment = total tebal tranche di bawahnya.",
        "detachment = attachment + tebal tranche itu sendiri.",
      ],
      code: {
        starter: "# Tebal tranche Rp M, dari bawah. JANGAN UBAH.\ntebal = [(\"Equity\", 50.0), (\"Mezzanine\", 100.0), (\"Senior\", 350.0)]\n\n# TULIS KODEMU: attachment & detachment\nbawah = 0.0\nfor nama, t in tebal:\n    attach =\n    detach =\n    print(f\"{nama}: mulai kena di {attach:.1f}, habis di {detach:.1f}\")\n    bawah =\n",
        lockLines: 2,
        solution: "# Tebal tranche Rp M, dari bawah. JANGAN UBAH.\ntebal = [(\"Equity\", 50.0), (\"Mezzanine\", 100.0), (\"Senior\", 350.0)]\n\n# TULIS KODEMU: attachment & detachment\nbawah = 0.0\nfor nama, t in tebal:\n    attach = bawah\n    detach = bawah + t\n    print(f\"{nama}: mulai kena di {attach:.1f}, habis di {detach:.1f}\")\n    bawah = detach\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Attachment senior = 150", msg: "50+100.", pattern: "Senior: mulai kena di 150\\.0, habis di 500\\.0" },
          { kind: "stdout_matches", task: "t2", label: "Equity 0–50", msg: "Tranche terbawah.", pattern: "Equity: mulai kena di 0\\.0, habis di 50\\.0" }
        ],
      },
      reference: "Attachment = proteksi di bawah. Detachment = attachment + tebal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Beli, hindari, atau struktur ulang",
      prose: [
        "Satu: investor konservatif (dana pensiun) → senior dengan subordinasi ≥25% + excess spread positif; tolak bila attachment < 20%. Dua: return tinggi, paham risiko → mezzanine/equity; hitung skenario korelasi tinggi — di situlah equity bisa hangus 2x lebih cepat. Tiga: originator → pertahankan equity (skin in the game) untuk sinyal kualitas; menjual semua = sinyal buruk. Empat: analis struktur → uji dengan korelasi default 0,5 (bukan 0,2); bila senior mulai berdarah di korelasi wajar, struktur terlalu tipis. Lima: regulator/pengawas → minta pengungkapan sensitivitas korelasi + asumsi prepayment; struktur yang tidak bisa menjelaskan asumsinya = struktur yang tidak boleh diedarkan.",
        "Aturan praktis 10 detik: tanya attachment point senior — di bawah 20% = pikir ulang; di atas 30% + excess spread = layak dipertimbangkan. Lalu tanya korelasi yang dipakai — bila jawabannya '0,2 dari data historis', minta uji 0,5.",
        "Satu peringatan terakhir untuk analis Indonesia: pasar EBA domestik masih muda, artinya data historis default dan prepayment terbatas. Struktur yang diimpor dari pasar maju membawa asumsi yang belum teruji di sini — perilaku prepayment KPR Indonesia berbeda (suku bunga fixed lebih dominan, refinancing tidak semudah di AS), dan data korelasi krisis belum ada. Tugasmu bukan menolak struktur impor, melainkan menandai setiap asumsi yang belum teruji dan meminta bantalan ekstra untuknya. Analis yang berani menulis 'asumsi belum teruji' di laporannya lebih berharga daripada analis yang mengangguk pada prospektus.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Keputusan sekuritisasi selalu tentang 'di mana saya duduk di air terjun'. Pembeli yang tidak tahu attachment-nya = penumpang yang tidak tahu di lantai berapa ia duduk saat gedung kebakaran.",
      },
      reference: "Attachment senior <20% = bahaya. Korelasi tinggi = ujian sebenarnya.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Rating AAA yang dipertanyakan",
      prose: [
        "Struktur EBA: pool Rp500 M (KPR), senior Rp350 M berperingkat AAA, subordinasi 30%. Lembaga pemeringkat memakai asumsi korelasi default 0,2. Kamu, analis independen, menguji dengan korelasi 0,5 (krisis perumahan): kerugian pool melonjak ke Rp200 M.",
        "Pertanyaan: (a) Pada kerugian Rp200 M, berapa rugi senior? (b) Apakah rating AAA masih pantas? (c) Apa yang harus diungkapkan ke investor? Pembahasan: (a) rugi_s = min(350, 200−150) = Rp50 M → 14,3% hangus. Senior yang 'AAA' berdarah. (b) Tidak — AAA mensyaratkan ketahanan pada skenario stress; struktur ini jebol di korelasi 0,5 yang wajar untuk krisis. (c) Sensitivitas terhadap korelasi + attachment point yang sebenarnya — bukan sekadar 'subordinasi 30%'.",
        "Pertanyaan lanjutan untuk analis: (d) Berapa attachment point yang DIBUTUHKAN agar senior tahan terhadap kerugian Rp200 M? (e) Jika kamu investor senior, revisi struktur apa yang kamu minta? Pembahasan: (d) Attachment harus > 200 → subordinasi minimal Rp200 M (40%), bukan Rp150 M (30%). (e) Tebalkan equity/mezzanine, tambah excess spread, atau minta trigger: bila kerugian menyentuh Rp100 M, arus kas dialihkan mempercepat pembayaran senior (turbo feature). Inilah negosiasi struktur yang sebenarnya — bukan menerima apa yang ditawarkan arranger.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah pelajaran 2008 dalam satu paragraf: rating menilai struktur dengan asumsi korelasi rendah; krisis menaikkan korelasi; struktur jebol. Analis yang menguji asumsi korelasi adalah garis pertahanan terakhir sebelum investor membeli ketenangan palsu.",
      },
      reference: "Uji korelasi 0,5. Senior berdarah Rp50 M = AAA tidak pantas.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — waterfall adalah soal urutan, bukan hafalan definisi. Jika kamu bisa menjawab semuanya dengan benar, kamu sudah bisa membaca prospektus EBA seperti analis struktur.",
      ],
      tasks: [],
      summary: [
        "Tranche = potongan klaim: equity (rugi pertama) → mezzanine → senior (dibayar pertama).",
        "Kerugian mengisi dari bawah: Rp80 M → equity habis 50, mezzanine 30, senior 0.",
        "Attachment point = rugi pool saat tranche mulai kena; senior kita: 150.",
        "Credit enhancement: subordinasi, overcollateralization, excess spread, reserve fund — diuji saat stress korelasi.",
        "EBA Indonesia (termasuk EBA-SP, POJK 12/2026) = pasar muda — analis waterfall punya nilai di sini.",
      ],
      next: { label: "CR30 — Specialised Lending & Slotting", href: "/v2/learn/cr30-specialised-lending" },
      quiz: [
        {
          q: "Kerugian pool Rp80 M (equity 50, mezzanine 100, senior 350). Rugi mezzanine?",
          options: [
            { text: "Rp30 M (30%)", why: "Benar: min(100, 80−50) = 30.", correct: true },
            { text: "Rp16 M (16%)", why: "Itu pembagian proporsional — waterfall tidak bekerja begitu." },
            { text: "Rp80 M (80%)", why: "Itu total kerugian pool, bukan bagian mezzanine." },
            { text: "Rp0 — dilindungi equity", why: "Equity hanya melindungi 50; sisanya 30 naik ke mezzanine." }
          ],
        },
        {
          q: "Attachment point tranche senior pada struktur di atas?",
          options: [
            { text: "Rp150 M", why: "Benar: 50 + 100 proteksi di bawahnya.", correct: true },
            { text: "Rp350 M", why: "Itu tebal senior, bukan attachment-nya." },
            { text: "Rp0 — senior selalu aman", why: "Tidak ada yang selalu aman; senior mulai kena di 150." },
            { text: "Rp80 M", why: "Itu kerugian contoh, bukan ambang struktur." }
          ],
        },
        {
          q: "Mengapa equity tranche memberi imbal hasil tertinggi?",
          options: [
            { text: "Kompensasi menanggung rugi pertama — hangus duluan", why: "Benar: risiko pertama = harga tertinggi.", correct: true },
            { text: "Karena modalnya paling besar", why: "Terbalik: equity paling kecil (10%)." },
            { text: "Karena dibayar pertama", why: "Terbalik: equity dibayar TERAKHIR." },
            { text: "Karena dijamin pemerintah", why: "Tidak ada penjaminan — itu inti risikonya." }
          ],
        },
        {
          q: "Excess spread dalam sekuritisasi berfungsi sebagai?",
          options: [
            { text: "Bantalan kerugian bulanan dari selisih bunga", why: "Benar: bunga pool 10% − kupon 7% = 3% menutup rugi duluan.", correct: true },
            { text: "Keuntungan yang langsung dibagi ke equity", why: "Excess spread menutup kerugian dulu sebelum mengalir ke equity." },
            { text: "Biaya jasa manajer investasi", why: "Itu fee, bukan spread." },
            { text: "Cadangan kas di awal transaksi", why: "Itu reserve fund — excess spread terbentuk berjalan." }
          ],
        },
        {
          q: "Pelajaran 2008 untuk analis struktur?",
          options: [
            { text: "Uji asumsi korelasi default — korelasi naik saat krisis dan menjebol subordinasi", why: "Benar: dosa CDO adalah korelasi yang diremehkan.", correct: true },
            { text: "Jangan pernah membeli tranche senior", why: "Terlalu ekstrem — senior dengan subordinasi tebal tetap instrumen valid." },
            { text: "Rating selalu benar", why: "Justru pelajarannya: rating bisa salah bila asumsinya salah." },
            { text: "Sekuritisasi harus dilarang", why: "Bukan instrumennya yang salah, melainkan penilaian risikonya." }
          ],
        }
      ],
      reference: "Waterfall dari bawah. Attachment = ambang. Korelasi = ujian.",
    },
  ],
};
