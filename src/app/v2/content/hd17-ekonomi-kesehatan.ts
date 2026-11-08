import type { V2Lesson } from "../lib/types";

export const hd17: V2Lesson = {
  slug: "hd17-ekonomi-kesehatan",
  track: "Health Data Science",
  module: "Kesehatan Populasi",
  title: "HD17 QALY & ICER: Harga Sebuah Tahun Hidup Sehat",
  estMinutes: 55,
  steps: [
    {
      id: "satu-setengah-miliar",
      eyebrow: "Langkah 1 · QALY",
      title: "Rp1,5 miliar untuk satu pasien?",
      prose: [
        "Obat baru kanker: Rp1,5 miliar per pasien per tahun, memperpanjang hidup rata-rata 4 bulan dengan kualitas hidup sedang. BPJS ditanya: tanggung atau tidak? Dana terbatas — Rp1,5 miliar yang sama bisa memvaksin 30.000 anak atau mengobati 500 pasien TB sampai sembuh.",
        "Tidak ada jawaban yang tidak menyakitkan. Tapi ada cara transparan untuk memutuskan: ekonomi kesehatan. Ia tidak menjawab “nyawa berapa harganya” — ia menjawab “dengan dana terbatas, mana yang menyelamatkan kesehatan TERBANYAK”.",
        "QALY (Quality-Adjusted Life Year) adalah mata uangnya: 1 tahun hidup sempurna = 1 QALY; 1 tahun dengan kualitas 0,6 = 0,6 QALY; meninggal = 0. Ia menggabungkan panjang dan kualitas hidup dalam satu angka, sehingga vaksin (panjang hidup) vs obat nyeri (kualitas hidup) bisa dibandingkan. Contoh: obat kanker menambah 4 bulan (1/3 tahun) dengan utilitas 0,6 → QALY gained = 0,6 × 1/3 = 0,2. Biaya Rp1,5 miliar untuk 0,2 QALY → Rp7,5 miliar per QALY. Bandingkan: vaksinasi anak ~Rp50 juta per QALY — dana yang sama menyelamatkan 150x lipat QALY bila untuk vaksin.",
      ],
      formula: String.raw`\text{QALY} = \sum u_t \times t \qquad \text{ICER} = \frac{\Delta \text{biaya}}{\Delta \text{QALY}}`,
      formulaNote: "u_t = bobot utilitas kesehatan pada periode t (1 = sehat sempurna, 0 = meninggal; diukur via EQ-5D/time trade-off); t = durasi periode itu dalam tahun; Σ = jumlahkan semua periode. Δbiaya = selisih biaya intervensi baru vs pembanding; ΔQALY = selisih QALY-nya. Contoh: 4 bulan (1/3 tahun) dengan u = 0,6 → QALY = 0,6 × 1/3 = 0,2; ICER obat kanker = Rp1,5 miliar / 0,2 = Rp7,5 miliar per QALY. Interpretasi: QALY menyatukan panjang dan kualitas hidup; ICER adalah “harga” tiap unit kesehatan tambahan — selalu relatif terhadap pembandingnya.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira kritik “QALY menilai nyawa orang cacat lebih rendah” berarti QALY tidak boleh dipakai. Kritik etiknya nyata dan diperdebatkan — praktik terbaik: pakai QALY untuk perbandingan intervensi (bukan penilaian nilai manusia), laporkan juga outcome natural (kasus dicegah, kematian dihindari), dan pertimbangkan bobot keadilan.",
        type: "pitfall",
      },
      reference: "QALY = mata uang pembanding lintas program. Tahu batas alatmu.",
    },
    {
      id: "lab-qaly-icer",
      eyebrow: "Langkah 2 · Lab kalkulator",
      title: "Kalkulator QALY & ICER",
      prose: [
        "Hitung sendiri: (1) QALY gained obat kanker (4 bulan, utilitas 0,6) dan biaya per QALY-nya (Rp1,5 miliar); (2) ICER skrining diabetes vs tidak skrining — tanpa skrining: biaya Rp10 juta, efek 8,0 QALY; dengan skrining: biaya Rp16 juta, efek 8,04 QALY. Threshold Rp500 juta/QALY.",
        "Ingat: ICER selalu RELATIF terhadap pembanding — ganti pembanding, ganti ICER. Dan strategi dominan (lebih murah DAN lebih efektif) langsung dipilih; yang didominasi (lebih mahal dan lebih buruk) langsung dibuang tanpa hitung ICER.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `qaly_gained` obat kanker (utilitas × tahun)" },
        { id: "t2", text: "Hitung `biaya_per_qaly` = 1,5 miliar / qaly_gained" },
        { id: "t3", text: "Hitung `icer` skrining DM (dalam rupiah per QALY)" },
      ],
      expected: "qaly_gained=0.2  biaya_per_qaly=7500000000  icer=150000000",
      note: {
        title: "Sering salah",
        body: "Menyajikan ICER tanpa pembanding yang eksplisit, dampak anggaran, dan analisis ekuitas. ICER Rp150 juta/QALY bukan “harga satu QALY” — ia biaya tambahan per unit manfaat tambahan dibanding alternatif spesifik. Setiap ICER tanpa analisis sensitivitas adalah tebakan berjas.",
        type: "pitfall",
      },
      hints: [
        "4 bulan = 4/12 tahun. QALY = utilitas × durasi tahun.",
        "Biaya per QALY = total biaya / QALY gained.",
        "icer = (16_000_000 - 10_000_000) / (8.04 - 8.0)",
      ],
      code: {
        starter: `# Obat kanker: Rp1,5 miliar, +4 bulan hidup, utilitas 0,6\n# Skrining DM: (biaya 10jt, 8,0 QALY) vs (biaya 16jt, 8,04 QALY)\n\n# TULIS KODEMU\nqaly_gained = \nbiaya_per_qaly = \nicer = \n\nprint(f"qaly_gained={qaly_gained}")\nprint(f"biaya_per_qaly={biaya_per_qaly:.0f}")\nprint(f"icer={icer:.0f}")`,
        lockLines: 2,
        solution: `# Obat kanker: Rp1,5 miliar, +4 bulan hidup, utilitas 0,6\n# Skrining DM: (biaya 10jt, 8,0 QALY) vs (biaya 16jt, 8,04 QALY)\n\n# TULIS KODEMU\nqaly_gained = 0.6 * (4/12)\nbiaya_per_qaly = 1_500_000_000 / qaly_gained\nicer = (16_000_000 - 10_000_000) / (8.04 - 8.0)\n\nprint(f"qaly_gained={qaly_gained}")\nprint(f"biaya_per_qaly={biaya_per_qaly:.0f}")\nprint(f"icer={icer:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "qaly_gained", value: 0.2, tol: 1e-9, label: "`qaly_gained` seharusnya 0.2", msg: "0,6 × (4/12) = 0,2 QALY. Ubah bulan ke tahun dulu." },
          { kind: "equal", task: "t2", name: "biaya_per_qaly", value: 7500000000, tol: 1, label: "`biaya_per_qaly` = Rp7,5 miliar", msg: "1,5 miliar / 0,2 = 7,5 miliar per QALY — 150x vaksin." },
          { kind: "equal", task: "t3", name: "icer", value: 150000000, tol: 1, label: "`icer` = Rp150 juta/QALY", msg: "6 juta / 0,04 = 150 juta. Di bawah threshold 500 juta → cost-effective." },
          { kind: "stdout_matches", task: "t3", pattern: "icer=150000000", label: "`print` menampilkan icer", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ICER < threshold = layak dipertimbangkan (bukan wajib didanai).",
    },
    {
      id: "antrean-meledak",
      eyebrow: "Langkah 3 · Operasi RS",
      title: "Antrean meledak di utilisasi 95%",
      prose: [
        "Teori antrean: waktu tunggu meledak saat utilisasi mendekati 100% — bukan linear. Rumus intuisi W_q ∝ ρ/(1−ρ): ρ=0,5 → faktor 1; ρ=0,9 → faktor 9; ρ=0,95 → faktor 19. Menaikkan utilisasi dari 90% ke 95% menggandakan antrean.",
        "Contoh: RS 100 bed, BOR (okupansi) 95%, waktu tunggu IGD untuk bed 8 jam. Tambah 10 bed (utilisasi turun ke ~86%): waktu tunggu anjlok ke ~2 jam. Bukan karena 10 bed itu ajaib — tapi karena keluar dari zona ρ→1 di mana antrean eksponensial. Manajer yang menarget BOR 100% sedang menargetkan kekacauan.",
        "Dan waspadai false economy: LOS (length of stay) pendek + readmission naik = memindahkan biaya ke masa depan. RS A LOS 3 hari + readmit 18% vs RS B LOS 5 hari + readmit 8% — efisiensi sejati = outcome per rupiah sepanjang episode, bukan LOS semata.",
      ],
      formula: String.raw`W_q \propto \frac{\rho}{1-\rho}`,
      formulaNote: "W_q = waktu tunggu rata-rata dalam antrean; ρ (rho) = utilisasi = laju kedatangan / laju pelayanan (0–1); ∝ = “sebanding dengan” (bukan sama dengan — konstanta pengali tergantung distribusi kedatangan/pelayanan). Contoh: ρ = 0,9 → faktor 9; ρ = 0,95 → faktor 19. Interpretasi: saat utilisasi mendekati 1, penyebut (1−ρ) menciut dan waktu tunggu meledak — inilah kenapa 5 poin utilisasi terakhir jauh lebih mahal dari 20 poin pertama.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira LOS makin pendek selalu makin efisien. LOS pendek + readmission naik tajam = false economy: pulang terlalu cepat, lalu readmit. Ukur LOS dan readmission bersamaan — jangan pernah satu saja.",
        type: "pitfall",
      },
      reference: "Utilisasi ~95%+ = zona ledakan antrean. Ukur utilisasi sebelum tambah kapasitas.",
    },
    {
      id: "lab-antrean",
      eyebrow: "Langkah 4 · Lab simulasi",
      title: "Lima poin utilisasi menggandakan antrean",
      prose: [
        "Hitung faktor antrean ρ/(1−ρ) untuk utilisasi 90% vs 95%, lalu rasionya. Rasakan sendiri betapa tidak linear-nya: 5 poin utilisasi terakhir jauh lebih mahal dari 20 poin pertama.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `w90` = faktor antrean pada ρ=0,90" },
        { id: "t2", text: "Hitung `w95` = faktor antrean pada ρ=0,95" },
        { id: "t3", text: "Hitung `rasio` = w95/w90" },
      ],
      expected: "w90=9.0  w95=19.0  rasio=2.11",
      note: {
        title: "Sering salah",
        body: "Mengira menambah kapasitas sedikit tidak mengubah apa-apa. Di zona ρ→1, menurunkan utilisasi 95%→86% bisa memangkas waktu tunggu 8 jam menjadi 2 jam — solusi sering bukan tambah bed, tapi ratakan jadwal.",
        type: "pitfall",
      },
      hints: [
        "Faktor antrean = rho / (1 - rho).",
        "Rasio = faktor di 95% dibagi faktor di 90%.",
        "w90 = 0.90/(1-0.90)\nw95 = 0.95/(1-0.95)\nrasio = w95/w90",
      ],
      code: {
        starter: `# TULIS KODEMU: faktor antrean W_q proporsional rho/(1-rho)\nw90 = \nw95 = \nrasio = \n\nprint(f"w90={w90:.1f}  w95={w95:.1f}  rasio={rasio:.2f}")`,
        lockLines: 1,
        solution: `# TULIS KODEMU: faktor antrean W_q proporsional rho/(1-rho)\nw90 = 0.90/(1-0.90)\nw95 = 0.95/(1-0.95)\nrasio = w95/w90\n\nprint(f"w90={w90:.1f}  w95={w95:.1f}  rasio={rasio:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w90", value: 9.0, tol: 1e-9, label: "`w90` seharusnya 9.0", msg: "0,90/0,10 = 9." },
          { kind: "equal", task: "t2", name: "w95", value: 19.0, tol: 1e-9, label: "`w95` seharusnya 19.0", msg: "0,95/0,05 = 19." },
          { kind: "equal", task: "t3", name: "rasio", value: 2.1111, tol: 0.01, label: "`rasio` sekitar 2.11", msg: "19/9 ≈ 2,11 — lima poin utilisasi menggandakan antrean." },
          { kind: "stdout_matches", task: "t3", pattern: "w90=9\\.0\\s+w95=19\\.0\\s+rasio=2\\.11", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "W_q ∝ ρ/(1−ρ): BOR 98% = memamerkan antrean.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: membelanjakan rupiah kesehatan",
      prose: [
        "Lima situasi keputusan yang dihadapi perencana kesehatan setiap kali anggaran terbatas bertemu kebutuhan tak terbatas:",
        "Skenario 1 — “Intervensi baru ini worth it?” → Hitung ICER: tambahan biaya per tambahan QALY — lalu bandingkan dengan threshold kemauan-membayar. ICER di bawah threshold = cost-effective. Tetapi ICER hanya menjawab “apakah sepadan”, bukan “apakah mampu”.",
        "Skenario 2 — “Sudah cost-effective — berarti bisa dianggarkan?” → Belum tentu: hitung budget impact. Obat yang cost-effective untuk 1.000 pasien bisa menjebol APBD bila pasiennya 1 juta. Kebijakan butuh dua angka: ICER (worth it?) DAN budget impact (mampu?).",
        "Skenario 3 — “Pilih teknologi dengan anggaran tetap?” → Maksimalkan efek POPULASI = efektivitas tes × jangkauan. Contoh: IVA (sensitivitas 60%, Rp50 ribu) menjangkau 40.000 wanita → 480 lesi terdeteksi; HPV-DNA (sensitivitas 95%, Rp400 ribu) hanya 5.000 wanita → 95 terdeteksi. “Tes yang lebih jelek” menang 5x lipat — idealnya hybrid: HPV-DNA untuk yang IVA-positif/risiko tinggi.",
        "Skenario 4 — “Antrean RS meledak?” → Baca teori antrean: utilisasi di atas ~85% membuat antrean tumbuh eksplosif — menambah pasien tanpa menambah kapasitas hanya memindahkan masalah. Solusinya: tambah kapasitas, kelola demand (triage, penjadwalan), atau pindahkan layanan — bukan sekadar lembur.",
        "Skenario 5 — “Angkanya tidak pasti — tetap putuskan?” → Jalankan PSA (probabilistic sensitivity analysis): sebar distribusi semua parameter, lihat probabilitas intervensi tetap cost-effective. Keputusan di bawah ketidakpastian butuh rentang dan probabilitas, bukan satu angka titik yang rapuh.",
        "Aturan praktis 10 detik: worth it? → ICER vs threshold → mampu? → budget impact → anggaran tetap? → efek populasi (efektivitas × jangkauan) → antrean → utilisasi >85% = tambah kapasitas → tak pasti? → PSA.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih “tes terbaik” lalu kehabisan anggaran di tengah jalan — 35.000 wanita tak terskrining demi tes yang lebih bagus. Atau menyetujui obat cost-effective tanpa menghitung budget impact, lalu APBD jebol di kuartal ketiga. Ekonomi kesehatan menghukum yang hanya menghitung separuh.",
        type: "pitfall",
      },
      reference: "Efek populasi = efektivitas × jangkauan. ICER = worth it; budget impact = mampu.",
    },
    {
      id: "minicase-skrining",
      eyebrow: "Langkah 6 · Mini-case",
      title: "IVA vs HPV-DNA: tes jelek yang menang",
      prose: [
        "Dinkes memilih metode skrining kanker serviks: IVA (murah, Rp50rb, sens 60%) vs HPV-DNA (Rp400rb, sens 95%). Anggaran tetap: Rp2 miliar/tahun. IVA menjangkau 40.000 wanita; HPV-DNA hanya 5.000.",
        "Hitung efek populasi, bukan sens individu. Dengan prevalensi lesi 2%: IVA → 40.000 × 2% × 60% = 480 terdeteksi; HPV-DNA → 5.000 × 2% × 95% = 95 terdeteksi. IVA memenangkan efek populasi 5x lipat dengan anggaran sama — walau “tesnya lebih jelek”.",
        "Inilah pelajaran ekonomi kesehatan: tes terbaik × jangkauan kecil bisa kalah dari tes cukup-baik × jangkauan massal. (Ideal: strategi hybrid — HPV-DNA untuk yang IVA positif/risiko tinggi.) Jangan biarkan perfeksionisme tes mengalahkan aritmetika populasi. Dan ingat pasangan ICER: cost-effective ≠ terjangkau — ICER menjawab “apakah worth it”, budget impact menjawab “apakah mampu”. Kebijakan butuh keduanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Memilih HPV-DNA untuk semua orang dengan anggaran tetap berarti 35.000 wanita tidak terskrining sama sekali — ratusan lesi pra-kanker terlewat demi “tes yang lebih bagus”. Keputusan alokasi yang salah di Dinkes berujung nyawa.",
        type: "risk",
      },
      reference: "Efek populasi = efektivitas tes × jangkauan. Hitung keduanya.",
    },
    {
      id: "psa-ketidakpastian",
      eyebrow: "Langkah 7 · Ketidakpastian",
      title: "PSA: mengakui bahwa ICER-mu adalah tebakan berdistribusi",
      prose: [
        "ICER Rp150 juta/QALY di lab tadi terlihat meyakinkan — tetapi ia dihitung dari angka TITIK: biaya Rp16 juta, efek 8,04 QALY. Di dunia nyata, tiap angka itu punya ketidakpastian: biaya bervariasi antar RS, efektivitas antar populasi, utilitas antar metode pengukuran. Analisis sensitivitas satu arah (one-way) mengubah satu parameter dalam rentang masuk akal dan melihat apakah kesimpulan berubah — berguna untuk menemukan “parameter penentu”. Tetapi ia tidak menjawab pertanyaan yang sebenarnya: dengan SEMUA ketidakpastian sekaligus, seberapa yakin kita bahwa intervensi ini cost-effective?",
        "Probabilistic Sensitivity Analysis (PSA) menjawabnya dengan Monte Carlo: tiap parameter diberi DISTRIBUSI (bukan titik) — biaya ~ Normal, probabilitas ~ Beta, hazard ratio ~ LogNormal — lalu ribuan simulasi menarik satu nilai dari tiap distribusi dan menghitung ICER-nya. Hasilnya bukan satu ICER, melainkan AWAN ICER di bidang cost-effectiveness plane. Dari awan ini lahir dua alat keputusan. Pertama, CEAC (Cost-Effectiveness Acceptability Curve): untuk tiap nilai threshold, berapa % simulasi yang cost-effective — mis. “pada threshold Rp500 juta, 86% simulasi cost-effective”. Kedua, EVPI (Expected Value of Perfect Information): nilai uang dari menghilangkan SEMUA ketidakpastian — bila EVPI lebih besar dari biaya riset lanjutan, maka riset itu worth it; bila kecil, putuskan sekarang saja.",
        "Konteks BPJS-nya: Indonesia belum punya threshold resmi yang dipublikasikan — analis memakai acuan seperti 1–3× PDB per kapita (WHO) atau threshold implisit dari keputusan historis. Artinya analis Indonesia tidak boleh menyajikan ICER tanpa CEAC: karena threshold-nya diperdebatkan, tunjukkan probabilitas cost-effective di BERBAGAI threshold dan biarkan pengambil keputusan melihat di mana keyakinan runtuh. ICER tanpa PSA di lingkungan threshold tak pasti = angka yang berpura-pura pasti.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: ICER adalah harga negosiasi, bukan vonis",
        body: "Praktisi ekonomi kesehatan membaca ICER seperti pedagang membaca harga pembuka — bukan harga final. Heuristiknya empat lapis. Pertama: selalu tanya “dibanding apa?” — ICER tanpa pembanding eksplisit tidak bermakna; ganti pembanding (mis. dari “tanpa skrining” ke “skrining alternatif”) dan ICER bisa berbalik. Kedua: pisahkan “worth it” dari “mampu” — ICER menjawab cost-effectiveness, budget impact menjawab affordability; BPJS bisa menolak intervensi yang cost-effective karena anggarannya jebol, dan itu keputusan yang rasional. Ketiga: curigai ICER yang terlalu rapi — angka titik tanpa rentang ketidakpastian (tanpa PSA/CEAC) adalah tebakan berjas; analis yang baik melaporkan “86% probabilitas cost-effective pada threshold X”, bukan “ICER = Rp150 juta”. Keempat: ingat siapa yang tidak masuk model — QALY agregat tidak melihat distribusi; intervensi yang cost-effective tetapi hanya menjangkau kota besar bisa memperlebar ketimpangan. Kelima: waspadai siapa yang tidak terwakili dalam datamu — utilitas dari populasi urban belum tentu mencerminkan preferensi pasien rural; bila datamu timpang, sampaikan sebagai keterbatasan di badan laporan, bukan disembunyikan di lampiran. Empat lapis ini — pembanding, anggaran, ketidakpastian, ekuitas — mengubah ICER dari angka menjadi keputusan.",
      },
      reference: "ICER titik + PSA + CEAC + budget impact + lensa ekuitas = paket keputusan yang lengkap.",
    },
    {
      id: "lab-psa",
      eyebrow: "Langkah 8 · Lab simulasi",
      title: "Monte Carlo PSA: dari satu ICER menjadi awan ICER",
      prose: [
        "Jalankan PSA mini untuk skrining diabetes: tiap parameter ditarik dari distribusinya (Normal) sebanyak 5.000 kali, hitung ICER tiap tarikan, lalu hitung probabilitas cost-effective pada threshold Rp500 juta/QALY. Bila selisih efek ≤ 0 pada suatu tarikan, ICER-nya tak hingga (tidak cost-effective).",
        "Seed tetap (random.seed(123)) agar reproduksibel. Coba: setelah lolos, naikkan threshold menjadi Rp1 miliar — bagaimana probabilitasnya berubah? Itulah CEAC dalam bentuk paling sederhana: satu titik pada kurvanya.",
      ],
      tasks: [
        { id: "t1", text: "Tarik `c_old`, `c_new`, `e_old`, `e_new` dari distribusi Normal-nya tiap iterasi" },
        { id: "t2", text: "Hitung `icer` = Δbiaya/Δefek (tak hingga bila Δefek ≤ 0); hitung `ce` bila icer < TH" },
        { id: "t3", text: "Hitung `prob` = ce/N; cetak dengan 3 desimal" },
      ],
      expected: "prob_cost_effective=0.861",
      note: {
        title: "Sering salah",
        body: "Memakai distribusi Normal untuk parameter yang tidak boleh negatif (mis. biaya) tanpa sadar. Pada contoh ini simpangan bakunya kecil relatif terhadap rata-rata sehingga peluang negatifnya nyaris nol — tetapi untuk parameter dengan ketidakpastian besar, pakailah LogNormal atau Gamma. Pilihan distribusi adalah asumsi yang harus ditulis eksplisit, bukan default buta.",
        type: "pitfall",
      },
      hints: [
        "random.gauss(mu, sigma) menarik satu sampel Normal.",
        "Δbiaya = c_new − c_old; Δefek = e_new − e_old.",
        "icer = dc/de if de > 0 else float('inf')",
      ],
      code: {
        starter: `import random\nrandom.seed(123)\nN, TH = 5000, 500_000_000  # threshold Rp500jt/QALY\n\n# TULIS KODEMU: PSA Monte Carlo untuk skrining diabetes\nce = 0\nfor _ in range(N):\n    c_old = \n    c_new = \n    e_old = \n    e_new = \n    dc = c_new - c_old\n    de = e_new - e_old\n    icer = \n    if icer < TH:\n        ce += 1\n\nprob = \nprint(f"prob_cost_effective={prob:.3f}")`,
        lockLines: 2,
        solution: `import random\nrandom.seed(123)\nN, TH = 5000, 500_000_000  # threshold Rp500jt/QALY\n\n# TULIS KODEMU: PSA Monte Carlo untuk skrining diabetes\nce = 0\nfor _ in range(N):\n    c_old = random.gauss(10_000_000, 1_500_000)\n    c_new = random.gauss(16_000_000, 2_000_000)\n    e_old = random.gauss(8.0, 0.015)\n    e_new = random.gauss(8.04, 0.02)\n    dc = c_new - c_old\n    de = e_new - e_old\n    icer = dc/de if de > 0 else float('inf')\n    if icer < TH:\n        ce += 1\n\nprob = ce / N\nprint(f"prob_cost_effective={prob:.3f}")`,
        checks: [
          { kind: "equal", task: "t3", name: "prob", value: 0.861, tol: 0.01, label: "`prob` sekitar 0.861", msg: "ce/N — sekitar 86% simulasi cost-effective pada threshold Rp500jt." },
          { kind: "stdout_matches", task: "t3", pattern: "prob_cost_effective=0\\.86\\d", label: "`print` menampilkan prob_cost_effective", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "PSA: parameter sebagai distribusi → awan ICER → CEAC. Satu ICER titik tanpa PSA = tebakan berjas.",
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
        "QALY = Σ utilitas × waktu — mata uang pembanding lintas program.",
        "ICER = Δbiaya/Δefek; cost-effective bila < threshold WTP.",
        "Cek dominansi dulu sebelum ICER; sajikan budget impact + sensitivitas.",
        "Antrean meledak di utilisasi ~95%: W_q ∝ ρ/(1−ρ).",
        "LOS pendek + readmit naik = false economy.",
        "ICER titik tanpa PSA = tebakan berjas: pakai Monte Carlo → awan ICER → CEAC; pisahkan “worth it” (ICER) dari “mampu” (budget impact).",
      ],
      next: { label: "HD18 — Privasi & Etika", href: "/v2/learn/hd18-privasi-etika" },
      quiz: [
        {
          q: "1 QALY artinya…",
          options: [
            { text: "1 tahun hidup dalam kesehatan sempurna (atau ekuivalennya)", why: "Benar: 2 tahun dengan utilitas 0,5 = 1 QALY. Menggabungkan panjang DAN kualitas.", correct: true },
            { text: "1 tahun hidup berapa pun kualitasnya", why: "Itu life-year biasa — QALY menyesuaikan dengan kualitas." },
            { text: "1 juta rupiah", why: "QALY adalah satuan kesehatan, bukan uang." },
            { text: "1 pasien sembuh", why: "QALY mengukur durasi × kualitas, bukan jumlah pasien." },
          ],
        },
        {
          q: "ICER = Rp150jt/QALY, threshold Rp500jt. Kesimpulan?",
          options: [
            { text: "Cost-effective — di bawah willingness-to-pay", why: "Benar: di bawah threshold = nilai yang baik untuk uang. Tapi tetap cek budget impact + keadilan.", correct: true },
            { text: "Tidak layak", why: "Terbalik: di bawah threshold berarti layak dipertimbangkan." },
            { text: "Harus gratis", why: "Cost-effective tidak berarti gratis — berarti worth it pada harganya." },
            { text: "Tidak bisa dinilai", why: "Bisa: bandingkan dengan threshold yang disepakati." },
          ],
        },
        {
          q: "Strategi A: biaya Rp10jt, 8,0 QALY. B: Rp12jt, 7,9 QALY. Maka B…",
          options: [
            { text: "Didominasi (lebih mahal, kurang efektif) — buang", why: "Benar: didominasi = kalah di kedua sisi. Tidak perlu hitung ICER — langsung eliminasi.", correct: true },
            { text: "Cost-effective", why: "Tidak bisa cost-effective bila ada opsi yang lebih murah DAN lebih efektif." },
            { text: "Dominan", why: "Terbalik: A yang dominan atas B." },
            { text: "Perlu ICER", why: "Tidak perlu: dominansi sudah memutuskan." },
          ],
        },
        {
          q: "Utilisasi IGD naik 90% → 95%. Waktu tunggu…",
          options: [
            { text: "Naik ~2x lipat (eksponensial di dekat 100%)", why: "Benar: W_q ∝ ρ/(1−ρ). 0,9/0,1=9 vs 0,95/0,05=19. Inilah kenapa BOR 100% = target macet.", correct: true },
            { text: "Naik sedikit (linear)", why: "Salah: antrean tidak linear di dekat utilisasi penuh." },
            { text: "Turun", why: "Terbalik: utilisasi naik → antrean naik." },
            { text: "Tetap", why: "Tidak: faktornya lebih dari dua kali lipat." },
          ],
        },
        {
          q: "LOS turun tapi readmission naik tajam. Interpretasi?",
          options: [
            { text: "False economy — biaya dipindah ke masa depan; ukur episode, bukan LOS", why: "Benar: efisiensi semu. Pulang terlalu cepat = readmit. Ukur outcome per rupiah sepanjang episode.", correct: true },
            { text: "Makin efisien", why: "Efisiensi semu: biaya hanya bergeser ke readmission." },
            { text: "Pasien makin sehat", why: "Readmission naik justru sinyal kualitas turun." },
            { text: "Tidak terkait", why: "Keduanya terkait lewat keputusan pemulangan yang sama." },
          ],
        },
      ],
    },
  ],
};
