import type { V2Lesson } from "../lib/types";

// Diagram struktur research note: piramida terbalik.
const NOTE_SVG = `<svg viewBox='0 0 480 300' role='img' aria-label='Piramida terbalik: headline call di puncak melebar ke tesis, bukti, risiko, valuasi, dan disclaimer di dasar.'>
<g font-family='var(--font-ui)' font-size='12' text-anchor='middle'>
<polygon points='240,20 300,20 300,60 180,60 180,20' fill='var(--c1)'/>
<text x='240' y='45' fill='white' font-weight='600'>Headline call: BELI / JUAL</text>
<polygon points='180,60 300,60 320,105 160,105' fill='var(--c2)'/>
<text x='240' y='86' fill='white' font-weight='600'>Tesis: 3 poin</text>
<polygon points='160,105 320,105 345,150 135,150' fill='var(--c3)'/>
<text x='240' y='131' fill='white' font-weight='600'>Bukti: angka + sumber</text>
<polygon points='135,150 345,150 370,195 110,195' fill='var(--c4)'/>
<text x='240' y='176' fill='white' font-weight='600'>Risiko: 2+ dengan pembalik</text>
<polygon points='110,195 370,195 395,240 85,240' fill='var(--chart-grid)'/>
<text x='240' y='221' fill='var(--text)' font-weight='600'>Valuasi ringkas + disclaimer</text>
</g>
<g font-family='var(--font-ui)' font-size='11' fill='var(--text-muted)'>
<text x='408' y='45'>keputusan</text><text x='408' y='60' font-size='10'>1 baris</text>
<text x='352' y='90' font-size='10'>kenapa</text>
<text x='375' y='135' font-size='10'>bisa diaudit</text>
<text x='105' y='178' font-size='10' text-anchor='end'>jujur</text>
<text x='75' y='223' font-size='10' text-anchor='end'>angka + pagar</text>
</g>
<text x='20' y='280' font-size='11' fill='var(--text-muted)' font-family='var(--font-ui)'>Piramida terbalik: pembaca sibuk berhenti di puncak, analis teliti turun sampai dasar.</text>
</svg>`;

export const e25: V2Lesson = {
  slug: "e25-research-note",
  track: "Financial Markets",
  module: "Tooling Analis",
  title: "E25. Menulis Research Note & Investment Memo",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-note-ditolak",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "BUY +40% yang ditolak compliance",
      prose: [
        "Sinta, analis di sebuah sekuritas menengah, menulis research note tentang PT Kopi Nusantara: “BUY, target +40%”. Dasarnya kuat menurutnya — grup WhatsApp trader ramai membicarakan ekspansi gerai, dan chart-nya “breakout”. Ia mengirim draf ke compliance untuk diterbitkan pagi itu.",
        "Compliance mengembalikannya dalam 20 menit dengan tiga coretan merah: (1) “Target +40% — metodenya apa?” (2) “‘Prospek cerah’ — angka dari mana?” (3) “Risikonya di mana?”. Twist-nya: Sinta tidak salah arah — enam bulan kemudian sahamnya memang naik 35%. Tetapi note yang tidak bisa diaudit tidak boleh terbit, seakurat apa pun firasatnya. Di industri ini, kebenaran tanpa bukti = opini yang tidak berlisensi untuk dijual.",
        "Lesson ini: anatomi research note profesional — struktur piramida terbalik, bahasa fakta vs opini vs proyeksi, disiplin angka yang bisa diaudit, dan jebakan yang membuat note terlihat meyakinkan padahal kosong.",
      ],
      tasks: [],
      note: {
        title: "Kilasan kilat prasyarat",
        body: "Research note = dokumen 2–6 halaman berisi rekomendasi analis (BELI/TAHAN/JUAL + target harga) beserta alasannya, diterbitkan sekuritas untuk nasabah. Investment memo = versi internal/privat untuk komite investasi. Keduanya menjawab satu pertanyaan: “dengan uang saya, lakukan apa — dan kenapa saya harus percaya padamu?”",
      },
      reference: "Note yang baik membuat pembaca bisa tidak setuju denganmu secara cerdas — karena semua bahan mentahnya terbuka.",
    },
    {
      id: "anatomi-note",
      eyebrow: "Langkah 2 · Konsep",
      title: "Anatomi note: piramida terbalik",
      prose: [
        "Research note ditulis seperti berita: piramida terbalik — informasi terpenting di puncak. Lapisan 1, headline call: “BELI PT Kopi Nusantara — target Rp1.400 (+40%), 12 bulan.” Satu baris berisi keputusan, nama, target, horizon. Manajer dana yang hanya punya 30 detik harus bisa bertindak dari baris ini saja.",
        "Lapisan 2, tesis — tiga poin, masing-masing satu paragraf: (1) “Ekspansi 200 gerai/tahun menambah pendapatan 25% per tahun (annual report 2025, hlm 12)”; (2) “Margin membaik karena biji kopi arabika turun 15% YoY (data Bloomberg, Jan 2026)”; (3) “Valuasi 12× PE 2026E vs rata-rata sektor 16× — diskon tidak beralasan.” Tiga poin, tiga angka, tiga sumber.",
        "Lapisan 3, katalis dan timeline: apa yang akan membuktikan tesismu benar dalam 3–12 bulan (rilis laporan Q2, pembukaan gerai ke-500), dan apa yang akan membuktikanmu salah. Lapisan 4, risiko: minimal dua risiko nyata beserta “pembaliknya” — kondisi yang membuatmu mencabut rekomendasi. Note tanpa risiko = brosur, bukan riset.",
        "Lapisan 5, valuasi ringkas: metode (mis. PE relatif / DCF sederhana), asumsi kunci (pertumbuhan, discount rate), dan rentang target — bukan satu angka magis. Dasar piramida: disclaimer dan pengungkapan konflik kepentingan (“perusahaan kami menjadi underwriter obligasi emiten ini pada 2024”).",
        "Cara membaca diagram: lebar lapisan = porsi halaman; urutan baca = dari puncak ke dasar; pembaca sibuk boleh berhenti di puncak, tetapi analis yang rajin memverifikasi sampai dasar.",
        "Interpretasi: struktur ini memaksa kejujuran berlapis — headline tanpa tesis = klaim kosong; tesis tanpa bukti = opini; semuanya tanpa risiko = pemasaran. Setiap lapisan adalah janji yang bisa diuji lapisan di bawahnya.",
      ],
      figure: {
        svg: NOTE_SVG,
        alt: "Piramida terbalik: headline call di puncak melebar ke tesis, bukti, risiko, valuasi, dan disclaimer di dasar.",
        caption: "Piramida terbalik research note: keputusan di puncak, bukti menopang di bawahnya.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menulis note seperti esai: pendahuluan panjang, latar belakang perusahaan 2 halaman, rekomendasi di halaman terakhir. Pembaca profesional tidak membaca esai — ia memindai keputusan. Rekomendasi yang baru muncul di halaman 4 sudah kehilangan 90% pembacanya.",
      },
      reference: "Puncak = keputusan 1 baris. Tesis 3 poin berangka. Risiko minimal 2. Valuasi + disclaimer di dasar.",
    },
    {
      id: "bahasa-angka",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga bahasa dan disiplin angka",
      prose: [
        "Setiap kalimat dalam note berbahasa salah satu dari tiga: FAKTA (“pendapatan Q1 2026 Rp890 miliar, +18% YoY — laporan keuangan Q1”), OPINI (“kami menilai valuasi ini murah”), atau PROYEKSI (“kami memperkirakan pendapatan 2026 Rp3,9 triliun”). Aturannya: fakta wajib bersumber (dokumen + halaman/tanggal), opini wajib diberi label (“menurut kami”, “kami menilai”), proyeksi wajib disertai asumsi (“dengan asumsi 200 gerai baru dan SSSG 8%”).",
        "Disiplin angka punya tiga aturan. Pertama, setiap angka penting bisa dilacak ke sumbernya dalam 60 detik — tulis sumbernya di samping angka, bukan di daftar pustaka halaman terakhir. Kedua, tanggalkan datamu: “per 31 Des 2025” — angka tanpa tanggal = angka tanpa konteks. Ketiga, bedakan angka perusahaan (guidance manajemen — klaim pihak berkepentingan) dari angka analis (estimasimu — tanggung jawabmu).",
        "💡 Tips: uji “analis kedua” — bayangkan analis kompetitor membaca notemu dengan niat mencari kesalahan. Setiap angka yang tidak bisa ia replikasi dalam sejam adalah liabilitas, bukan aset.",
        "Rumus kejujuran kuantitatif: bila kamu menulis target harga, tulis juga rumusnya. Target = EPS 2026E × PE target → Rp120 × 12 = Rp1.440 ≈ Rp1.400. Pembaca boleh tidak setuju dengan EPS-nya — tetapi ia bisa melihat tepat di mana kalian berbeda pendapat. Itulah gunanya note: bukan untuk disetujui, melainkan untuk diperdebatkan secara produktif.",
      ],
      formula: String.raw`\text{Target} = \text{EPS}_{2026E} \times \text{PE}_{\text{target}} \qquad \text{Upside} = \frac{\text{Target} - P_0}{P_0}`,
      formulaNote: "EPS_2026E = estimasi laba per saham 2026 (tanggung jawab analis); PE_target = kelipatan wajar vs sektor; P_0 = harga saat ini. Upside = potensi kenaikan.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Menurut data, prospeknya sangat cerah.” — data apa? Dari mana? Kapan? Kalimat ini memakai kostum fakta (“menurut data”) untuk menyajikan opini (“sangat cerah”) tanpa satu pun angka. Compliance yang baik mencoretnya; analis yang baik tidak pernah menulisnya.",
      },
      reference: "Fakta = sumber + tanggal. Opini = label eksplisit. Proyeksi = asumsi tertulis. Target = rumus terbuka.",
    },
    {
      id: "lab-audit-note",
      eyebrow: "Langkah 4 · Lab: audit draf",
      title: "Meng-audit draf note seperti compliance",
      prose: [
        "Sekarang jadilah compliance-nya Sinta. Di bawah ini draf note 8 kalimat tentang PT Kopi Nusantara. Tugasmu: (1) hitung kalimat klaim yang TIDAK didukung angka — kalimat yang mengandung kata klaim (tumbuh, kuat, meningkat, terbaik, signifikan, cerah, prospek) tetapi tidak mengandung satu pun digit; (2) deteksi kalimat overclaim — yang mengandung kata dari daftar terlarang (dijamin, pasti, tanpa risiko, tidak mungkin turun); (3) skor kelengkapan struktur — dari 6 bagian wajib (headline, tesis, katalis, risiko, valuasi, disclaimer), berapa yang muncul sebagai judul bagian.",
        "Pemetaan ke dunia nyata: fungsi `ada_digit` ≡ pemeriksa “apakah klaim ini berangka?”; daftar kata terlarang ≡ style guide compliance sekuritas; skor struktur ≡ checklist pra-terbit. Audit yang baik itu mekanis — supaya tidak bergantung pada mood reviewer.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `klaim_kosong` = kalimat berklaim tanpa satu pun digit" },
        { id: "t2", text: "Hitung `overclaim` = kalimat mengandung kata terlarang" },
        { id: "t3", text: "Hitung `skor` = bagian wajib yang hadir (dari 6)" },
      ],
      expected: "klaim_kosong=3  overclaim=2  skor=4/6",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira satu angka di kalimat pertama “menyelamatkan” seluruh paragraf. Disiplin angka berlaku per klaim, bukan per paragraf: “pendapatan tumbuh kuat dan margin meningkat signifikan” butuh DUA angka (berapa % tumbuh, berapa marginnya) — satu angka hanya menyelamatkan setengah kalimat.",
      },
      hints: [
        "ada_digit = any(c.isdigit() for c in kalimat).",
        "klaim = any(k in kalimat.lower() for k in kata_klaim).",
        "skor = sum(1 for b in bagian_wajib if b in judul_ada).",
      ],
      code: {
        starter: `# DRAF NOTE — PT Kopi Nusantara (8 kalimat isi + judul bagian)
kalimat = [
    "BELI PT Kopi Nusantara, target Rp1400 atau upside 40 persen dalam 12 bulan.",
    "Prospek perusahaan sangat cerah didukung ekspansi agresif ke seluruh Indonesia.",
    "Pendapatan tumbuh kuat menjadi Rp890 miliar pada Q1 2026, naik 18 persen YoY.",
    "Margin meningkat signifikan karena efisiensi operasional yang terbaik di kelasnya.",
    "Investasi ini dijamin menguntungkan dan tanpa risiko berarti bagi investor.",
    "Saham ini pasti naik karena tidak mungkin turun di tengah tren konsumsi yang kuat.",
    "Risiko utama adalah kenaikan harga biji kopi arabika sebesar 20 persen pada 2025.",
    "Valuasi 12x PE 2026E terlihat murah dibanding rata-rata sektor 16x.",
]
judul_ada = ["Headline", "Tesis", "Katalis", "Valuasi"]  # bagian yang tertulis
kata_klaim = ["tumbuh", "kuat", "meningkat", "terbaik", "signifikan", "cerah", "prospek"]
kata_terlarang = ["dijamin", "pasti", "tanpa risiko", "tidak mungkin turun"]
bagian_wajib = ["Headline", "Tesis", "Katalis", "Risiko", "Valuasi", "Disclaimer"]

# TULIS KODEMU
klaim_kosong =
overclaim =
skor =

print(f"klaim_kosong={klaim_kosong}  overclaim={overclaim}  skor={skor}/6")`,
        lockLines: 14,
        solution: `# DRAF NOTE — PT Kopi Nusantara (8 kalimat isi + judul bagian)
kalimat = [
    "BELI PT Kopi Nusantara, target Rp1400 atau upside 40 persen dalam 12 bulan.",
    "Prospek perusahaan sangat cerah didukung ekspansi agresif ke seluruh Indonesia.",
    "Pendapatan tumbuh kuat menjadi Rp890 miliar pada Q1 2026, naik 18 persen YoY.",
    "Margin meningkat signifikan karena efisiensi operasional yang terbaik di kelasnya.",
    "Investasi ini dijamin menguntungkan dan tanpa risiko berarti bagi investor.",
    "Saham ini pasti naik karena tidak mungkin turun di tengah tren konsumsi yang kuat.",
    "Risiko utama adalah kenaikan harga biji kopi arabika sebesar 20 persen pada 2025.",
    "Valuasi 12x PE 2026E terlihat murah dibanding rata-rata sektor 16x.",
]
judul_ada = ["Headline", "Tesis", "Katalis", "Valuasi"]  # bagian yang tertulis
kata_klaim = ["tumbuh", "kuat", "meningkat", "terbaik", "signifikan", "cerah", "prospek"]
kata_terlarang = ["dijamin", "pasti", "tanpa risiko", "tidak mungkin turun"]
bagian_wajib = ["Headline", "Tesis", "Katalis", "Risiko", "Valuasi", "Disclaimer"]

# TULIS KODEMU
def ada_digit(s):
    return any(c.isdigit() for c in s)
klaim_kosong = sum(1 for k in kalimat
                   if any(w in k.lower() for w in kata_klaim) and not ada_digit(k))
overclaim = sum(1 for k in kalimat
                if any(w in k.lower() for w in kata_terlarang))
skor = sum(1 for b in bagian_wajib if b in judul_ada)

print(f"klaim_kosong={klaim_kosong}  overclaim={overclaim}  skor={skor}/6")`,
        checks: [
          { kind: "equal", task: "t1", name: "klaim_kosong", value: 3, tol: 0, label: "`klaim_kosong` = 3", msg: "Kalimat 2 (cerah/prospek), 4 (meningkat/signifikan/terbaik), 6 (kuat) — tanpa digit." },
          { kind: "equal", task: "t2", name: "overclaim", value: 2, tol: 0, label: "`overclaim` = 2", msg: "Kalimat 5 (dijamin, tanpa risiko) dan 6 (pasti, tidak mungkin turun)." },
          { kind: "equal", task: "t3", name: "skor", value: 4, tol: 0, label: "`skor` = 4", msg: "Hadir 4 dari 6: Risiko dan Disclaimer absen — draf ini brosur, bukan riset." },
          { kind: "stdout_matches", task: "t3", pattern: "klaim_kosong=3\\s+overclaim=2\\s+skor=4/6", label: "`print` sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Audit mekanis: klaim→angka? kata terlarang? 6 bagian lengkap? Draf Sinta: 3 klaim kosong, 2 overclaim, tanpa risiko & disclaimer.",
    },
    {
      id: "jebakan-note",
      eyebrow: "Langkah 5 · Konsep",
      title: "Empat jebakan note yang terlihat meyakinkan",
      prose: [
        "Jebakan pertama: cherry-picking periode. “Saham naik 80% dalam 2 tahun!” — tetapi bila dihitung 3 tahun, return-nya 5% karena tahun pertamanya jatuh 40%. Aturan: tampilkan beberapa jendela waktu, atau jelaskan kenapa periode itu yang relevan (mis. sejak restrukturisasi). Periode yang dipilih untuk terlihat bagus = data yang dipilih untuk berbohong.",
        "Jebakan kedua: mengubur risiko. Risiko ditulis — tetapi di footnote halaman 6, satu baris, tanpa angka: “terdapat risiko fluktuasi harga komoditas.” Risiko yang jujur berbunyi: “biji arabika 40% dari COGS; kenaikan 20% memangkas laba bersih ~15% (sensitivitas hlm 3).” Risiko tanpa kuantifikasi = hiasan.",
        "Jebakan ketiga: target price tanpa metode. “Target Rp1.400” tanpa rumus = angka dari langit. Pembaca tidak bisa berdebat denganmu — dan note yang tidak bisa diperdebatkan tidak berguna. Selalu tulis: metode + asumsi kunci + rentang, bukan satu angka magis.",
        "Jebakan keempat: konflik kepentingan yang tidak diungkap. Sekuritasmu menjadi underwriter obligasi emiten itu tahun lalu; analis menulis BELI tanpa pengungkapan. Pembaca berhak tahu insentifmu sebelum mempercayai analisismu. Disclaimer bukan formalitas — ia adalah bagian dari tesis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Risiko sudah saya tulis satu paragraf di akhir.” Risiko yang tidak dikuantifikasi dan tidak punya “pembalik” (kondisi yang membatalkan rekomendasi) bukan analisis risiko — itu alibi. Uji: bila risikonya terjadi, apakah pembaca tahu apa yang harus ia lakukan? Bila tidak, tulis ulang.",
      },
      reference: "Cherry-picking → tampilkan multi-periode. Risiko → kuantifikasi + pembalik. Target → rumus terbuka. Konflik → ungkapkan.",
    },
    {
      id: "peta-note",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan menulis apa — dan kapan tidak menerbitkan",
      prose: [
        "Skenario 1 — Tesis kuat + bukti lengkap + risiko terukur: terbitkan note penuh (initiation/coverage). Alasan: semua lapisan piramida terisi — ini produk riset yang sesungguhnya.",
        "Skenario 2 — Peristiwa penting tetapi tesis belum berubah (rilis laba sesuai ekspektasi): terbitkan flash note 1 halaman. Alasan: pembaca butuh update cepat, bukan piramida penuh — headline + 3 bullet + angka kunci cukup.",
        "Skenario 3 — Tesis patah oleh fakta baru (asumsi kunci terbukti salah): terbitkan downgrade segera, bukan diam. Alasan: menunda kabar buruk demi “menunggu pantulan” = pelanggaran terhadap pembaca yang masih memegang saham atas rekomendasi lamamu.",
        "Skenario 4 — Keyakinan tinggi tetapi bukti belum bisa diaudit (seperti Sinta sebelum compliance): JANGAN terbitkan. Alasan: firasat bukan riset. Tulis memo internal, kumpulkan bukti, terbitkan saat piramidanya lengkap — reputasimu lebih mahal dari satu momentum.",
        "Aturan praktis 10 detik sebelum menekan “terbit”: (1) bisakah pembaca menemukan sumber setiap angka dalam 60 detik? (2) apakah ada minimal satu risiko yang membuatku tidak nyaman? (3) apakah target hargaku punya rumus? Satu “tidak” = draf kembali ke meja.",
      ],
      tasks: [],
      reference: "Tesis lengkap = note penuh. Update kecil = flash note. Tesis patah = downgrade segera. Bukti belum audit = jangan terbit.",
    },
    {
      id: "minicase-target",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Target +60% tanpa rumus",
      prose: [
        "Sebuah sekuritas menerbitkan note: “BELI PT Baja Makmur, target Rp3.200 (+60%).” Isi note: 3 halaman latar belakang industri baja, 1 halaman profil perusahaan, target harga di halaman terakhir tanpa satu pun perhitungan valuasi. Tidak ada bagian risiko. Disclaimer standar 2 baris.",
        "Pertanyaan 1: apa yang hilang dari piramida? Pertanyaan 2: sebagai manajer dana, informasi apa yang kamu butuhkan tetapi tidak kamu dapatkan? Pertanyaan 3: bagaimana kamu menulis ulang headline-nya agar jujur?",
        "Pembahasan: (1) Hilang: tesis berangka (tidak ada 3 poin + sumber), katalis/timeline, risiko (nol!), metode valuasi — yang ada hanya latar belakang (= brosur industri) dan angka magis Rp3.200. Skor strukturnya 2/6. (2) Kamu tidak tahu: kenapa +60% (metode?), apa yang bisa salah (risiko?), kapan tesis terbukti/salah (katalis?), dan apakah penulis punya konflik kepentingan. (3) Headline jujur untuk draf seperti ini: “PT Baja Makmur: prospek industri baja positif — MENUNGGU valuasi & analisis risiko sebelum rekomendasi.” Lebih baik menunda call daripada menerbitkan janji tanpa fondasi.",
        "Pelajaran mini-case: note yang tidak bisa diperdebatkan = note yang tidak berguna. Kelengkapan struktur adalah kejujuran yang bisa diverifikasi.",
      ],
      tasks: [],
      reference: "Skor 2/6 = brosur industri, bukan riset. Target tanpa rumus = angka magis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca alasannya bahkan untuk jawaban yang kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Struktur piramida terbalik: headline call → tesis 3 poin → katalis/timeline → risiko (2+, terkuantifikasi) → valuasi + disclaimer.",
        "Tiga bahasa: fakta (sumber + tanggal), opini (label eksplisit), proyeksi (asumsi tertulis).",
        "Disiplin angka: setiap angka penting terlacak dalam 60 detik; bedakan guidance manajemen dari estimasi analis.",
        "Target harga wajib punya rumus terbuka: Target = EPS_E × PE_target — agar bisa diperdebatkan.",
        "Empat jebakan: cherry-picking periode, risiko tak terkuantifikasi, target tanpa metode, konflik tak diungkap.",
        "Kapan TIDAK terbit: keyakinan tinggi tapi bukti belum bisa diaudit — tulis memo internal dulu.",
      ],
      quiz: [
        {
          q: "Manajer dana hanya punya 30 detik. Apa yang harus ia dapatkan dari notemu?",
          options: [
            { text: "Keputusan + target + horizon dalam satu baris headline", why: "Benar: piramida terbalik — informasi terpenting di puncak untuk pembaca tersibuk.", correct: true },
            { text: "Latar belakang industri 3 halaman", why: "Salah: itu lapisan pendukung, bukan yang dibaca pertama. Rekomendasi di halaman 4 = kehilangan pembaca." },
            { text: "Disclaimer lengkap", why: "Salah: disclaimer penting tetapi di dasar piramida — bukan yang dibaca 30 detik pertama." },
            { text: "Biodata analis", why: "Salah: kredibilitas dibangun lewat angka yang bisa diaudit, bukan biodata." },
          ],
        },
        {
          q: "Kalimat: “Menurut data, prospeknya sangat cerah.” Apa masalahnya?",
          options: [
            { text: "Tidak ada — sudah menyebut data", why: "Salah: “menurut data” adalah kostum fakta untuk opini tanpa angka, sumber, maupun tanggal." },
            { text: "Opini berkostum fakta: tidak ada angka, sumber, atau tanggal yang bisa diaudit", why: "Benar: disiplin angka menuntut setiap klaim penting punya angka + sumber + tanggal.", correct: true },
            { text: "Terlalu pendek", why: "Salah: panjang bukan masalahnya — kalimat satu baris dengan angka dan sumber justru ideal." },
            { text: "Kata “sangat” terlalu dramatis", why: "Salah: masalahnya bukan gaya bahasa, melainkan tidak adanya bukti yang bisa diverifikasi." },
          ],
        },
        {
          q: "Draf Sinta: 3 klaim tanpa angka, 2 kalimat overclaim, tanpa bagian Risiko & Disclaimer. Vonis compliance yang tepat?",
          options: [
            { text: "Terbitkan — arahnya benar dan sahamnya memang naik nantinya", why: "Salah: kebenaran ex-post tidak menyembuhkan ketidakbisaudit-an ex-ante. Firasat bukan riset." },
            { text: "Kembalikan: lengkapi angka per klaim, hapus kata terlarang, tulis risiko terkuantifikasi + disclaimer", why: "Benar: tepat tiga coretan merah compliance — angka, bahasa, dan struktur.", correct: true },
            { text: "Terbitkan dengan target diturunkan", why: "Salah: menurunkan target tidak memperbaiki klaim tanpa bukti atau overclaim." },
            { text: "Hapus saja kalimat overclaim-nya", why: "Salah: itu hanya satu dari tiga masalah — klaim tanpa angka dan struktur yang hilang tetap ada." },
          ],
        },
        {
          q: "Note menulis “target Rp1.400” tanpa metode valuasi. Mengapa ini masalah serius?",
          options: [
            { text: "Karena angkanya terlalu bulat", why: "Salah: kebulatan bukan masalah — ketidakbisa-debat-an lah masalahnya." },
            { text: "Karena pembaca tidak bisa melihat di mana letak perbedaan pendapatnya dengan analis", why: "Benar: target tanpa rumus = angka magis. Dengan rumus (EPS_E × PE), pembaca bisa tidak setuju secara cerdas.", correct: true },
            { text: "Karena target harus selalu di atas harga pasar", why: "Salah: rekomendasi JUAL pun punya target — di bawah harga pasar. Arah bukan masalahnya." },
            { text: "Karena compliance melarang angka target", why: "Salah: compliance justru menuntut target — asalkan metodenya terbuka." },
          ],
        },
        {
          q: "Tesis investasimu patah oleh data baru (asumsi kunci terbukti salah). Langkah profesional?",
          options: [
            { text: "Diam dan tunggu pantulan harga", why: "Salah: menunda kabar buruk mengkhianati pembaca yang memegang saham atas rekomendasi lamamu." },
            { text: "Terbitkan downgrade segera dengan penjelasan apa yang berubah", why: "Benar: integritas analis diukur dari kecepatan mengakui kesalahan, bukan dari rekor “tidak pernah salah”.", correct: true },
            { text: "Ubah definisi tesis agar tetap cocok dengan data", why: "Salah: itu cherry-picking metodologis — memindahkan gawang setelah bola ditendang." },
            { text: "Hapus note lama dari arsip", why: "Salah: menghapus jejak = pelanggaran yang lebih serius daripada salah analisis." },
          ],
        },
      ],
      next: { label: "E1 — Struktur Pasar", href: "/v2/learn/e1-struktur-pasar" },
    },
  ],
};
