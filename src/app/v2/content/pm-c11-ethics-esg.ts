import type { V2Lesson } from "../lib/types";

// Tangga spektrum integrasi ESG: exclusion -> ESG integration -> thematic ->
// impact investing. Makin ke kanan makin dalam usaha & dampaknya.
// Anotasi: Green Future mengklaim level 4, praktiknya level 0.
const ESG_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Tangga spektrum integrasi ESG: exclusion, integrasi ESG, tematik, impact investing; Green Future mengklaim level 4 padahal praktiknya level 0.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<rect x="60" y="175" width="110" height="35" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="1.5"/>
<rect x="170" y="145" width="110" height="65" fill="var(--c1)" opacity="0.45" stroke="var(--c1)" stroke-width="1.5"/>
<rect x="280" y="115" width="110" height="95" fill="var(--c1)" opacity="0.65" stroke="var(--c1)" stroke-width="1.5"/>
<rect x="390" y="85" width="110" height="125" fill="var(--c1)" opacity="0.9" stroke="var(--c1)" stroke-width="1.5"/>
<g font-family="var(--font-ui)" text-anchor="middle"><text x="115" y="190" font-size="11" fill="var(--text)" font-weight="700">1. Exclusion</text><text x="115" y="204" font-size="9" fill="var(--chart-text)">coret sektor kotor</text><text x="225" y="160" font-size="11" fill="var(--text)" font-weight="700">2. Integrasi ESG</text><text x="225" y="174" font-size="9" fill="var(--chart-text)">ESG -&gt; angka valuasi</text><text x="335" y="130" font-size="11" fill="var(--text)" font-weight="700">3. Thematic</text><text x="335" y="144" font-size="9" fill="var(--chart-text)">bertaruh tema hijau</text><text x="445" y="100" font-size="11" fill="var(--text)" font-weight="700">4. Impact</text><text x="445" y="114" font-size="9" fill="var(--chart-text)">dampak terukur + return</text></g>
<line x1="40" y1="210" x2="40" y2="85" stroke="var(--chart-text)" stroke-width="1.5"/><polygon points="40,78 35,90 45,90" fill="var(--chart-text)"/>
<text x="28" y="150" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 150)">usaha &amp; dampak naik</text>
<text x="445" y="72" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">klaim Green Future: level 4</text>
<text x="115" y="168" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">realita: level 0</text>
<line x1="445" y1="78" x2="445" y2="82" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="3 2"/>
<line x1="115" y1="172" x2="115" y2="174" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="3 2"/>
</svg>`;

export const pmc11: V2Lesson = {
  slug: "pm-c11-ethics-esg",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C11 — Ethics & ESG",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-green-future",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dana \u2018hijau\u2019 yang berisi batubara",
      prose: [
        "2023: reksadana \u2018Green Future\u2019 meraup Rp2 triliun \u2014 marketing: \u2018100% ESG!\u2019 Jurnalis bedah portofolio: 15% batubara & sawit bermasalah! Manajer berkilah: \u2018rating ESG kami... dari provider X\u2019 (yang memberi skor tinggi ke semua kliennya!).",
        "Twist-nya: regulator denda + investor redeem massal. \u2018Hijau\u2019 di brosur = greenwashing \u2014 dan pasar kini menghukumnya lebih keras dari sekadar \u2018tidak hijau\u2019. Klaim ESG palsu > tidak klaim sama sekali.",
        "Lesson ini tentang integritas sebagai strategi: etika praktik sehari-hari, integrasi ESG yang jujur, dan cara mendeteksi greenwashing.",
      ],
      note: {
        title: "Intuisi: etika adalah satu-satunya keunggulan yang tidak bisa ditiru",
        body: "Lima heuristik praktisi senior. Pertama, reputasi punya asimetri yang brutal: dibangun 20 tahun, hancur 20 hari — maka setiap keputusan abu-abu harus diuji dengan “skenario headline”: bagaimana jika keputusan ini jadi berita utama besok pagi dengan namaku di judulnya? Kedua, dalam ESG, skeptisisme adalah layanan profesional: klien membayar manajer bukan untuk mengulang brosur emiten, melainkan untuk membedahnya — manajer yang menelan skor ESG mentah sedang menagih fee untuk pekerjaan yang tidak dilakukan. Ketiga, konflik kepentingan tidak pernah “diselesaikan” — hanya dikelola lewat disclosure + persetujuan: siapa pun yang bilang “sudah beres, tidak ada konflik” biasanya belum mencari dengan cukup keras. Etika bukan tentang menjadi orang baik; ini tentang membangun sistem di mana menjadi tidak baik itu sulit dan ketahuan. Keempat, dalam ESG, tanyakan selalu siapa yang diuntungkan klaim ini: provider rating dibayar emiten yang dinilai, manajer dibayar dari fee produk hijau \u2014 struktur insentif menjelaskan separuh greenwashing. Kelima, whistleblowing yang efektif selalu tertulis dan berjenjang: laporan lisan = tidak pernah terjadi; email ke compliance dengan tembusan = jejak yang melindungimu.",
      },
      tasks: [],
      reference: "Integritas = strategi jangka panjang; reputasi = aset tak ternilai.",
    },
    {
      id: "etika-praktik",
      eyebrow: "Langkah 2 · Etika praktik",
      title: "Ujian sehari-hari: uang titipan",
      prose: [
        "Keuangan = bisnis kepercayaan (uang titipan!). Tiga ujian klasik. Soft dollars: komisi trading dipakai bayar riset \u2014 boleh jika manfaat klien & di-disclose; haram jika untuk sewa kantor! Directed brokerage: klien arahkan broker tertentu \u2014 waspadai eksekusi buruk (best execution tidak boleh dikorbankan). Fair dealing IPO: alokasi proporsional & terdokumentasi, bukan untuk \u2018klien favorit\u2019.",
        "Insider trading: teman direksi bisik \u2018akuisisi besok!\u2019 \u2014 jangan trading, jangan bagi. Material nonpublic = terlarang. Mosaic (info publik + analisis sendiri) = boleh. Aturannya: jika ragu, jangan. Penjara > cuan. Contoh konflik: rekomendasikan saham X ke klien sambil pribadi menjual X \u2014 pelanggaran (konflik + tidak diungkap). Personal trading = pre-clearance.",
        "Prinsipnya: loyalty + disclosure \u2014 jika ragu, ungkapkan & minta persetujuan. Tes 3-pertanyaan untuk tiap area abu-abu: (1) legal? (2) adil untuk klien? (3) nyaman jika dipublikasi? Gagal satu = jangan. Aturan praktis: \u2018berani tulis di factsheet?\u2019 \u2014 jika tidak, jangan lakukan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Etika = legal.\u2019 Salah. Etika > legal \u2014 legal = minimum. Standar CFA lebih tinggi dari hukum. Soal etika: pilih yang paling etis, bukan yang paling legal. \u2018ESG = return lebih tinggi\u2019 juga belum terbukti konsisten: ESG = risiko, bukan alpha.",
      },
      reference: "Standar CFA (ringkas): profesionalisme, integritas pasar, kewajiban ke klien, ke pemberi kerja, analisis, konflik, tanggung jawab.",
    },
    {
      id: "lab-soft-dollar",
      eyebrow: "Langkah 3 · Lab soft-dollar",
      title: "Audit uang klien",
      prose: [
        "Audit penggunaan komisi: tulis logika yang memisahkan penggunaan untuk manfaat klien (boleh, jika di-disclose) dari manfaat manajer (pelanggaran). Coba ubah SEWA menjadi 0 dan FEE_BAYAR menjadi True: status berubah BERSIH \u2014 itulah struktur yang benar.",
      ],
      tasks: [
        { id: "t1", text: "Tulis logika audit ke dalam `masalah`" },
        { id: "t2", text: "Cetak HASIL dengan `print`" },
      ],
      expected: "HASIL: BERMASALAH  - Sewa Rp200jt dari soft-dollar = PELANGGARAN (manfaat manajer!)",
      hints: [
        "masalah = [] lalu append jika: SEWA > 0 and not FEE_BAYAR.",
        "Tambah cek: if not DISCLOSE → append soal disclosure.",
        "Cetak \u2018HASIL: BERMASALAH\u2019 jika masalah tidak kosong, else \u2018BERSIH\u2019.",
      ],
      code: {
        starter: `# Pemeriksa soft-dollar: uang klien dipakai untuk apa?\nRISET = 300    # Rp jt — data, analis\nSEWA = 200     # Rp jt — 'terminal & sewa' (ubah jadi 0!)\nDISCLOSE = True\nFEE_BAYAR = False  # sewa dibayar dari fee manajemen? (ubah jadi True!)\n\n# TULIS KODEMU\nmasalah = []\n\nif masalah:\n    print("HASIL: BERMASALAH")\n    for m in masalah:\n        print(" -", m)\nelse:\n    print("HASIL: BERSIH (riset di-disclose + operasional dari fee sendiri)")\nprint()\nprint("Aturan: 'berani tulis di factsheet?'")`,
        lockLines: 4,
        solution: `# Pemeriksa soft-dollar: uang klien dipakai untuk apa?\nRISET = 300    # Rp jt — data, analis\nSEWA = 200     # Rp jt — 'terminal & sewa' (ubah jadi 0!)\nDISCLOSE = True\nFEE_BAYAR = False  # sewa dibayar dari fee manajemen? (ubah jadi True!)\n\n# TULIS KODEMU\nmasalah = []\nif SEWA > 0 and not FEE_BAYAR:\n    masalah.append(f"Sewa Rp{SEWA}jt dari soft-dollar = PELANGGARAN (manfaat manajer!)")\nif not DISCLOSE:\n    masalah.append("Tanpa disclosure = pelanggaran")\n\nif masalah:\n    print("HASIL: BERMASALAH")\n    for m in masalah:\n        print(" -", m)\nelse:\n    print("HASIL: BERSIH (riset di-disclose + operasional dari fee sendiri)")\nprint()\nprint("Aturan: 'berani tulis di factsheet?'")`,
        checks: [
          { kind: "defined", task: "t1", name: "masalah", label: "`masalah` didefinisikan", msg: "Buat list `masalah` dan isi dengan temuan audit." },
          { kind: "stdout_matches", task: "t2", pattern: "HASIL: BERMASALAH", label: "`print` menampilkan HASIL: BERMASALAH", msg: "Dengan default (SEWA=200, FEE_BAYAR=False), audit harus menemukan pelanggaran." },
          { kind: "stdout_matches", task: "t2", pattern: "Sewa Rp200jt dari soft-dollar = PELANGGARAN", label: "`print` menampilkan temuan sewa", msg: "Temuan harus menyebut sewa dari soft-dollar sebagai pelanggaran." },
        ],
      },
      reference: "Soft dollars = uang klien: riset OK (disclose), operasional dari fee sendiri.",
    },
    {
      id: "lab-esg-divergence",
      eyebrow: "Langkah 4 · Lab rating divergence",
      title: "Satu perusahaan, empat skor",
      prose: [
        "Hitung rentang, rata-rata, dan simpangan baku skor ESG perusahaan X dari 4 provider. Coba ubah skor Provider D dari 45 menjadi 80 (provider murah hati): rata-rata naik \u2014 manipulasi semudah itu. Inilah mengapa skor mentah tidak boleh ditelan bulat-bulat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `vals`, `selisih`, `rata2`, `std`" },
        { id: "t2", text: "Cetak hasil dengan `print`" },
      ],
      expected: "Rentang: 45-85 (selisih 40)  Rata2: 68, Std: 15",
      hints: [
        "vals = list(skor.values()); selisih = max(vals) − min(vals).",
        "rata2 = statistics.mean(vals); std = statistics.pstdev(vals).",
        "Format: {rata2:.0f} dan {std:.0f} \u2014 perhatikan pembulatan 67,5 → 68.",
      ],
      code: {
        starter: `# Rating divergence: jangan telan skor mentah\nimport statistics\nskor = {"Provider A": 85, "Provider B": 62, "Provider C": 78, "Provider D": 45}  # ubah D jadi 80!\n\n# TULIS KODEMU\nvals = \nselisih = \nrata2 = \nstd = \n\nprint("Skor perusahaan X:")\nfor k, v in skor.items():\n    print(f"  {k}: {v}")\nprint(f"\\nRentang: {min(vals)}-{max(vals)} (selisih {selisih})")\nprint(f"Rata2: {rata2:.0f}, Std: {std:.0f}")\nprint()\nprint("Korelasi antar-provider ~0,5 (rating kredit: ~0,99).")\nprint("Pakai skor untuk RISET (kenapa beda?), bukan LABEL.")`,
        lockLines: 2,
        solution: `# Rating divergence: jangan telan skor mentah\nimport statistics\nskor = {"Provider A": 85, "Provider B": 62, "Provider C": 78, "Provider D": 45}  # ubah D jadi 80!\n\n# TULIS KODEMU\nvals = list(skor.values())\nselisih = max(vals) - min(vals)\nrata2 = statistics.mean(vals)\nstd = statistics.pstdev(vals)\n\nprint("Skor perusahaan X:")\nfor k, v in skor.items():\n    print(f"  {k}: {v}")\nprint(f"\\nRentang: {min(vals)}-{max(vals)} (selisih {selisih})")\nprint(f"Rata2: {rata2:.0f}, Std: {std:.0f}")\nprint()\nprint("Korelasi antar-provider ~0,5 (rating kredit: ~0,99).")\nprint("Pakai skor untuk RISET (kenapa beda?), bukan LABEL.")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih", value: 40, tol: 1e-9, label: "`selisih` = 40", msg: "85 − 45 = 40 poin \u2014 untuk perusahaan yang sama!" },
          { kind: "equal", task: "t1", name: "rata2", value: 67.5, tol: 1e-9, label: "`rata2` = 67.5", msg: "(85+62+78+45)/4 = 67,5." },
          { kind: "equal", task: "t1", name: "std", value: 15.435, tol: 0.01, label: "`std` ≈ 15.4", msg: "Simpangan baku populasi dari 4 skor." },
          { kind: "stdout_matches", task: "t2", pattern: "Rentang: 45-85 \\(selisih 40\\)", label: "`print` menampilkan rentang 45-85 (selisih 40)", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Skor = opini bermetodologi: starting point riset, bukan keputusan.",
    },
    {
      id: "integrasi-esg",
      eyebrow: "Langkah 5 · Integrasi ESG + chart",
      title: "Faktor, bukan filter",
      prose: [
        "Tiga pendekatan. Integrasi: faktor ESG material masuk analisis valuasi (risiko iklim → arus kas!). Exclusion: coret sektor \u2014 senjata tumpul yang menyempitkan semesta. Engagement: aktif perbaiki perusahaan via voting & dialog \u2014 bukti dampak terkuat. Analoginya: bukan \u2018tolak pasien perokok\u2019 (exclusion), tetapi masukkan riwayat merokok ke diagnosis (integrasi) + ajak berhenti (engagement).",
        "Materialitas per sektor (SASB): emisi untuk tambang, privasi data untuk tech. Contoh kuantitatif: karbon tax Rp50rb/ton diusulkan; emisi 10jt ton → biaya Rp500M/tahun → adjust DCF → valuasi turun 20%. ESG = angka, bukan narasi. Kuantifikasi!",
        "Contoh tambang batubara: risiko transisi (pajak karbon!) → arus kas −20% skenario 2030 → valuasi −25% (integrasi!). Exclusion akan melewatkan turnaround (diversifikasi ke nikel!); engagement: voting paksa capex hijau + target emisi. Hasil: valuasi jujur + perusahaan membaik = return + dampak. Itulah ESG yang bekerja.",
        "Cara membaca: anak tangga dibaca dari kiri ke kanan — dari pendekatan paling sederhana (exclusion: coret sektor) ke paling dalam (impact investing: dampak terukur plus return). Ketinggian anak tangga = usaha analisis dan kedalaman dampak yang dituntut.",
        "Interpretasi: Green Future mengklaim level 4 (“100% ESG”, impact) sementara praktiknya — 15% batubara, provider shopping, voting nol — bahkan di bawah level 1. Greenwashing dalam satu gambar: klaim menaiki tangga yang tidak pernah dipanjat. Uji “berani diumumkan?” bekerja paling tajam di sini: tulis di brosur level berapa kamu sebenarnya, bukan level berapa yang ingin diklaim.",
      ],
      figure: {
        svg: ESG_SVG,
        alt: "Tangga spektrum integrasi ESG: exclusion, integrasi ESG, tematik, impact investing; Green Future mengklaim level 4 padahal praktiknya level 0.",
        caption: "Spektrum integrasi ESG: makin ke kanan makin dalam. Green Future mengklaim level 4 dengan praktik level 0 — itulah greenwashing.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018ESG = amal / donasi.\u2019 Salah. ESG = faktor risiko (stranded assets, regulasi, reputasi). Integrasi = analisis, bukan donasi. Dan \u2018skor ESG tinggi = perusahaan baik, beli yang skor 90+\u2019 juga salah: skor 45\u201385 untuk perusahaan yang sama + bisa dibeli via provider shopping. \u2018Green Future\u2019 = korban skor mentah.",
      },
      reference: "Integrasi ≠ donasi; engagement > label; skor = riset, bukan keputusan.",
    },
    {
      id: "greenwashing",
      eyebrow: "Langkah 6 · Greenwashing",
      title: "Dosa & deteksi",
      prose: [
        "Greenwashing: klaim ESG melebihi realita. Empat red flags: (1) vague (\u2018komitmen hijau\u2019 tanpa angka/definisi); (2) cherry-pick (1 proyek hijau, 99% kotor); (3) provider shopping (pilih rating tertinggi); (4) tidak ada voting record (ngaku engagement, tidak pernah voting!).",
        "Pertahanan: kebijakan tertulis + metrik terukur + audit independen + transparansi penuh. Audit \u2018Green Future\u2019: red flags = klaim \u2018100% ESG\u2019 tanpa definisi, 15% batubara, provider X murah hati, voting record nol. Kebijakan kredibel: definisi tertulis + ambang batas (batubara < 5% & turun tiap tahun) + 2 provider (cross-check) + voting dipublikasi + audit tahunan.",
        "Kosmetik tebal vs skincare: dari jauh glowing (brosur), dekat retak (portofolio). Regulator & jurnalis = cahaya terang \u2014 makin terang, makin terlihat retaknya. Solusinya skincare (perbaiki beneran), bukan makeup (klaim). Klaim palsu = mahal (denda jutaan USD, redeem miliaran); jujur = murah.",
      ],
      tasks: [],
      reference: "Klaim = bukti. Tidak bisa buktikan = jangan klaim.",
    },
    {
      id: "minicase-green-future",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Audit \u2018Green Future\u2019",
      prose: [
        "Dana \u2018Green Future\u2019 Rp2T: klaim \u2018100% ESG\u2019, ternyata 15% batubara; provider X \u2018murah hati\u2019 (shopping!); voting record = nol. Hasil: denda + redeem massal.",
        "(a) Empat red flags: vague (tanpa definisi) + holdings vs klaim + provider shopping + voting nol (engagement palsu). (b) Kebijakan kredibel: definisi tertulis + ambang (batubara < 5%, menurun) + 2 provider + voting dipublikasi + audit independen tahunan.",
        "(c) Pelajaran etika umum: klaim palsu > tidak klaim; integritas = strategi bisnis jangka panjang; uji \u2018berani diumumkan?\u2019 untuk semua area abu-abu. (d) Jika kamu analis yang menemukan ini: whistleblowing \u2014 dokumentasikan (bukti!), lapor internal (compliance!), jika diabaikan → regulator. Standar CFA mewajibkan lapor pelanggaran; diam = komplis. (e) Pencegahan sistemik: kode etik tertulis + training tahunan + whistleblower protection + audit independen + tone at the top. Budaya > aturan.",
      ],
      tasks: [],
      reference: "Enron & Theranos: akuntansi kreatif = bom; hype ≠ kebenaran; verifikasi selalu.",
    },

    {
      id: "esg-integration-vs-screening",
      eyebrow: "Langkah 8 · ESG tingkat lanjut",
      title: "Integrasi vs screening: materialitas yang dikuantifikasi",
      prose: [
        "Perbedaan integrasi dan screening bukan soal \u201Cpeduli lingkungan\u201D \u2014 melainkan soal di mana ESG masuk dalam mesin keputusan. Screening memotong semesta investasi di muka (coret batubara, coret senjata) \u2014 sederhana, tetapi buta terhadap harga: saham batubara yang terdiskon 50% karena sentimen bisa jadi value opportunity terbaik dekade ini, dan screening melewatkannya. Integrasi memasukkan faktor ESG material ke dalam valuasi itu sendiri: risiko iklim menjadi penyesuaian arus kas, tata kelola menjadi penyesuaian discount rate.",
        "Contoh kuantitatif penuh: emiten tambang, EBITDA Rp2 triliun, valuasi DCF baseline Rp10 triliun. Risiko transisi: skenario pajak karbon Rp75 ribu/ton mulai 2028, emisi 8 juta ton/tahun → biaya tambahan Rp600 miliar/tahun dari 2028. PV biaya (diskonto 10%, 10 tahun) ≈ Rp3,2 triliun → valuasi terintegrasi ≈ Rp6,8 triliun (−32%). Keputusan: BELI hanya di bawah Rp6,8 triliun dengan margin of safety \u2014 bukan \u201Cjangan beli karena kotor\u201D. Inilah integrasi: angka yang mengubah harga wajar, bukan stempel moral. Screening akan mencoretnya di Rp10 triliun maupun di Rp4 triliun \u2014 kehilangan keduanya: menghindari risiko DAN kehilangan opportunity.",
        "Konteks Indonesia: OJK mewajibkan rencana aksi keuangan berkelanjutan (RAKB) bagi lembaga jasa keuangan dan taksonomi hijau Indonesia menjadi acuan klasifikasi. Praktisi lokal memakai dua lapis: (1) peta materialitas SASB per sektor \u2014 untuk bank: manajemen risiko kredit iklim + inklusi; untuk tambang: emisi + reklamasi + relasi komunitas; untuk konsumer: rantai pasok + kemasan; (2) uji \u201Capa yang berubah di DCF?\u201D \u2014 faktor ESG yang tidak mengubah satu pun angka valuasi adalah narasi, bukan analisis; jangan bayar mahal untuk narasi. Aturan: setiap klaim \u201Crisiko ESG\u201D di investment thesis wajib disertai angka (biaya/tahun, probabilitas, dampak valuasi) \u2014 jika tidak ada angkanya, coret kalimatnya dari thesis.",
      ],
      tasks: [],
      reference: "Screening = potong semesta; integrasi = ubah angka valuasi. Tanpa angka = narasi.",
    },
    {
      id: "dilema-fidusia-esg",
      eyebrow: "Langkah 9 · Dilema fidusia",
      title: "Dilema fidusia: saat preferensi klien berharga return",
      prose: [
        "Kasus CFA klasik: klien meminta eksklusi total sektor energi fosil dari portofolionya. Analisis: eksklusi menyempitkan semesta ~12%, menaikkan tracking error vs benchmark ~1,5%, dan dalam periode harga energi tinggi (2022) mengorbankan ~2% return tahun itu. Duty of loyalty mewajibkan penasihat MENGIKUTI instruksi klien \u2014 tetapi duty of care mewajibkan penasihat memastikan klien MEMAHAMI harganya SEBELUM instruksi dieksekusi. Urutannya tidak boleh terbalik: edukasi dulu, eksekusi kemudian, dokumentasi selalu.",
        "Protokol praktis tiga langkah: (1) kuantifikasi biaya preferensi \u2014 hitung ekspektasi return, tracking error, dan skenario underperform dari constraint yang diminta (angka di atas: −2% di tahun energi bullish); (2) tawarkan spektrum, bukan biner \u2014 eksklusi total vs underweight vs integrasi-dengan-engagement: klien yang tahu engagement (voting memaksa transisi) sering memilihnya setelah paham eksklusi total = menyerahkan saham ke investor yang tidak peduli sama sekali; (3) tulis di IPS sebagai constraint \u201Cunique\u201D dengan tanda tangan klien + review tahunan \u2014 preferensi bisa berubah, dan penasihat tidak boleh menebak perubahan itu.",
        "Batas fidusia yang tidak boleh dilanggar: penasihat TIDAK boleh memaksakan preferensi ESG-nya sendiri ke klien (mis. diam-diam meng-underweight batubara karena \u201Ckeyakinan pribadi\u201D tanpa mandat) \u2014 itu pelanggaran loyalty yang setara dengan memaksakan preferensi return. Dan sebaliknya: penasihat tidak boleh mengabaikan risiko ESG yang MATERIAL demi menyenangkan klien yang \u201Ctidak mau dengar soal iklim\u201D \u2014 duty of care mewajibkan menyampaikan risiko yang memengaruhi valuasi, suka atau tidak. Rumusnya: preferensi klien = constraint yang dihormati; keyakinan penasihat = tidak relevan; risiko material = wajib disampaikan. Tiga kalimat ini menyelesaikan 90% dilema ESG-fidusia.",
      ],
      tasks: [],
      reference: "Edukasi → eksekusi → dokumentasi. Preferensi klien dihormati; risiko material wajib disampaikan.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Delapan pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Etika praktik: soft dollars hanya untuk manfaat klien + disclose; IPO proporsional; material nonpublic = jangan trading.",
        "Prinsip: loyalty + disclosure; etika > legal; tes \u2018berani diumumkan?\u2019 untuk area abu-abu.",
        "ESG = faktor risiko: integrasi (masuk valuasi) > exclusion; engagement (voting) = dampak terkuat.",
        "Rating divergence (45\u201385, korelasi ~0,5): skor = starting point riset, bukan keputusan; waspadai provider shopping.",
        "Greenwashing: deteksi via vagueness, holdings vs klaim, voting nol; pertahanan = kebijakan tertulis + metrik + audit + transparansi.",
      ],
      next: { label: "D1 \u2014 Data & Harga", href: "/v2/learn/pm-d1-data-harga" },
      quiz: [
        {
          q: "Emiten tambang: DCF baseline Rp10T; skenario pajak karbon Rp75rb/ton \u00D7 8jt ton dari 2028 \u2192 PV biaya Rp3,2T. Keputusan integrasi ESG?",
          options: [
            { text: "Coret \u2014 tambang = kotor", why: "Salah: itu screening buta; melewatkan opportunity jika harga jatuh di bawah nilai terintegrasi." },
            { text: "Valuasi terintegrasi Rp6,8T \u2014 beli hanya di bawah itu dengan margin of safety", why: "Tepat: risiko iklim menjadi angka di DCF, bukan stempel moral.", correct: true },
            { text: "Abaikan \u2014 pajak karbon belum pasti", why: "Salah: ketidakpastian di-model sebagai skenario berprobabilitas, bukan diabaikan." },
            { text: "Beli di Rp10T \u2014 baseline sudah benar", why: "Salah: baseline mengabaikan risiko transisi yang material." },
          ],
        },
        {
          q: "Manajer diam-diam underweight batubara karena keyakinan pribadinya, tanpa mandat klien. Ini?",
          options: [
            { text: "Tindakan terpuji \u2014 demi bumi", why: "Salah: memaksakan preferensi pribadi tanpa mandat = pelanggaran duty of loyalty." },
            { text: "Pelanggaran loyalty \u2014 preferensi klien yang dihormati, keyakinan penasihat tidak relevan", why: "Tepat: fidusia = ikuti mandat klien yang terinformasi, bukan keyakinan sendiri.", correct: true },
            { text: "Boleh \u2014 manajer tahu lebih baik", why: "Salah: \u201Ctahu lebih baik\u201D bukan lisensi melanggar mandat." },
            { text: "Tidak masalah selama return bagus", why: "Salah: hasil bagus tidak memutihkan pelanggaran proses fidusia." },
          ],
        },
        {
          q: "Klien minta eksklusi total fosil. Analisis: tracking error +1,5%, korban ~2% di tahun energi bullish. Langkah pertama penasihat?",
          options: [
            { text: "Langsung eksekusi \u2014 klien selalu benar", why: "Salah: loyalty tanpa care = membiarkan klien membeli risiko yang tidak dipahaminya." },
            { text: "Kuantifikasi biaya preferensi, tawarkan spektrum, tulis di IPS setelah klien paham", why: "Tepat: edukasi → eksekusi → dokumentasi. Duty of care sebelum duty of obedience.", correct: true },
            { text: "Tolak \u2014 tugas penasihat memaksimalkan return", why: "Salah: memaksimalkan return BUKAN definisi fidusia; menghormati preferensi yang terinformasi adalah." },
            { text: "Diam-diam tetap pegang fosil sedikit", why: "Salah: melanggar instruksi klien secara diam-diam = pelanggaran loyalty yang serius." },
          ],
        },
        {
          q: "Soft dollars Rp500jt: Rp300jt riset + Rp200jt sewa. Penilaian?",
          options: [
            { text: "Semua OK", why: "Salah: sewa kantor = manfaat manajer, bukan klien \u2014 tidak boleh dari komisi klien." },
            { text: "Riset OK (disclose); sewa = pelanggaran", why: "Tepat: uji = untuk siapa manfaatnya? Riset → klien ✓. Sewa → manajer ✗ (bayar dari fee sendiri!).", correct: true },
            { text: "Semua pelanggaran", why: "Salah: riset yang bermanfaat bagi klien dan di-disclose = boleh." },
            { text: "Terserah manajer", why: "Salah: soft dollars = uang klien \u2014 loyalty & disclosure mengikat." },
          ],
        },
        {
          q: "Skor ESG 45\u201385 untuk perusahaan yang sama. Implikasi?",
          options: [
            { text: "Pilih provider dengan skor tertinggi", why: "Salah: itu provider shopping = greenwashing by proxy." },
            { text: "Divergence: pahami metodologi, pakai untuk riset", why: "Tepat: korelasi antar-provider ~0,5. Skor mentah = opini; pakai untuk riset (kenapa beda?), bukan label.", correct: true },
            { text: "Rata-ratakan saja", why: "Salah: rata-rata opini yang divergen tidak menghasilkan kebenaran \u2014 pahami dulu metodologinya." },
            { text: "Abaikan ESG sepenuhnya", why: "Salah: divergence ≠ ESG tidak berguna \u2014 faktor materialnya tetap risiko nyata." },
          ],
        },
        {
          q: "Bukti dampak ESG terkuat?",
          options: [
            { text: "Exclusion (coret sektor kotor)", why: "Salah: exclusion = cuci tangan \u2014 saham dibeli orang lain, perusahaan tidak berubah." },
            { text: "Engagement (voting, dialog)", why: "Tepat: engagement aktif memperbaiki perusahaan. Voting record nol = engagement palsu.", correct: true },
            { text: "Marketing hijau", why: "Salah: marketing tanpa aksi = greenwashing, bukan dampak." },
            { text: "Skor ESG tinggi", why: "Salah: skor = opini, bisa dibeli \u2014 bukan bukti dampak." },
          ],
        },
        {
          q: "Pertahanan greenwashing terbaik?",
          options: [
            { text: "Brosur lebih bagus", why: "Salah: brosur lebih bagus = makeup lebih tebal \u2014 retaknya tetap terlihat." },
            { text: "Kebijakan tertulis + metrik + audit + transparansi", why: "Tepat: klaim tanpa bukti = calon denda. Satu halaman kebijakan + voting record + audit = kredibel.", correct: true },
            { text: "Ganti provider rating", why: "Salah: ganti provider demi skor lebih tinggi = provider shopping = greenwashing by proxy." },
            { text: "Diam saja", why: "Salah: diam = membiarkan klaim palsu \u2014 pelanggaran etika." },
          ],
        },
        {
          q: "Dana \u2018100% ESG\u2019 ternyata isi 15% batubara, voting nol. Tindakan TEPAT?",
          options: [
            { text: "Diam \u2014 bukan urusan saya", why: "Salah: Standar CFA mewajibkan lapor pelanggaran. Diam = komplis." },
            { text: "Dokumentasikan, lapor internal, jika diabaikan \u2192 regulator (whistleblowing)", why: "Tepat: bukti → compliance → regulator. Greenwashing = klaim palsu = pelanggaran etika.", correct: true },
            { text: "Jual diam-diam", why: "Salah: menyelamatkan diri sendiri tanpa melaporkan = membiarkan korban berikutnya." },
            { text: "Percaya label", why: "Salah: label ≠ isi \u2014 verifikasi > percaya." },
          ],
        },
      ],
    },
  ],
};
