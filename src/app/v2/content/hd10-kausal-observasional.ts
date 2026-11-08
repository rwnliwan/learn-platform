import type { V2Lesson } from "../lib/types";

export const hd10: V2Lesson = {
  slug: "hd10-kausal-observasional",
  track: "Health Data Science",
  module: "Analisis Klinis Lanjutan",
  title: "HD10 Kausalitas dari Data Observasional",
  estMinutes: 50,
  steps: [
    {
      id: "obat-membunuh",
      eyebrow: "Langkah 1 · Confounding",
      title: "Obat yang “terlihat” membunuh",
      prose: [
        "Data RS: pasien yang diberi obat X mortalitasnya 22%, yang tidak diberi 10%. Kesimpulan naif: obat X membunuh. Tapi dokter memberi obat X justru ke pasien yang paling parah — confounding by indication. Setelah stratifikasi keparahan: pasien ringan 5% vs 6%, pasien parah 29% vs 34% — obat X justru sedikit membantu di kedua strata. Inilah paradoks Simpson versi klinis.",
        "Confounding = variabel ketiga (keparahan) yang memengaruhi paparan (diberi obat) dan outcome (mortalitas). Ia bukan “variabel yang terlupakan” secara umum — ia punya struktur: panah ke paparan DAN ke outcome. Collider (akibat dari paparan dan outcome) justru JANGAN dikontrol — mengontrol collider membuka jalur bias baru.",
        "Aturan: gambar DAG dulu sebelum menyentuh data. DAG memaksa eksplisit: apa confounder (kontrol), apa mediator (jangan kontrol bila ingin efek total), apa collider (jangan kontrol). Analisis tanpa DAG = mengontrol variabel secara buta.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengontrol “semua variabel yang tersedia” (kitchen sink). Mengontrol mediator menghilangkan efek yang ingin diukur; mengontrol collider menciptakan bias. Lebih banyak kovariat ≠ lebih kausal.",
        type: "pitfall",
      },
      reference: "Gambar DAG dulu: kontrol confounder, jangan sentuh mediator/collider.",
    },
    {
      id: "lab-confounding",
      eyebrow: "Langkah 2 · Lab",
      title: "Buktikan confounding by indication",
      prose: [
        "Simulasi 4000 pasien (seed 3): 40% parah. P(diberi obat|parah)=80%, P(diberi obat|ringan)=20%. Mortalitas dasar 5%, +25% jika parah. Obat: NOL efek (dibangkitkan tanpa pengaruh obat). Hitung mortalitas mentah per kelompok obat, lalu per strata keparahan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `m_obat` dan `m_tanpa` (mortalitas mentah)" },
        { id: "t2", text: "Hitung `m_obat_ringan`, `m_tanpa_ringan`, `m_obat_parah`, `m_tanpa_parah`" },
      ],
      expected: "mentah: obat≈0.223 vs tanpa≈0.096 | ringan: 0.050 vs 0.059 | parah: 0.286 vs 0.340",
      note: {
        title: "Kaitan ke risk",
        body: "Analisis mentah seperti ini pernah dipakai untuk mencabut obat yang sebenarnya membantu — karena “data menunjukkan” obat membunuh. Confounding by indication yang tidak ditangani bisa membunuh obat yang baik, atau meloloskan obat yang buruk.",
        type: "risk",
      },
      hints: [
        "Loop 4000 pasien: parah = random() < 0,4; obat ikut P berbeda per strata.",
        "Mortalitas = 0,05 + 0,25 jika parah — tanpa suku obat (efek nol).",
        "Agregat dua level: mentah (obat vs tanpa) dan per strata keparahan.",
      ],
      code: {
        starter: `import random\nrandom.seed(3)\nn = 4000\n# akumulator: [mati, total]\nmentah_obat, mentah_tanpa = [0, 0], [0, 0]\nringan_obat, ringan_tanpa = [0, 0], [0, 0]\nparah_obat, parah_tanpa = [0, 0], [0, 0]\nfor _ in range(n):\n    parah = random.random() < 0.4\n    obat = random.random() < (0.8 if parah else 0.2)\n    mati = random.random() < (0.05 + (0.25 if parah else 0.0))  # obat: NOL efek\n    # TULIS KODEMU: isi akumulator mentah + strata\n    \n\nm_obat = mentah_obat[0]/mentah_obat[1]\nm_tanpa = mentah_tanpa[0]/mentah_tanpa[1]\nprint(f"mentah: obat={m_obat:.3f} vs tanpa={m_tanpa:.3f}")`,
        lockLines: 10,
        solution: `import random\nrandom.seed(3)\nn = 4000\n# akumulator: [mati, total]\nmentah_obat, mentah_tanpa = [0, 0], [0, 0]\nringan_obat, ringan_tanpa = [0, 0], [0, 0]\nparah_obat, parah_tanpa = [0, 0], [0, 0]\nfor _ in range(n):\n    parah = random.random() < 0.4\n    obat = random.random() < (0.8 if parah else 0.2)\n    mati = random.random() < (0.05 + (0.25 if parah else 0.0))  # obat: NOL efek\n    # TULIS KODEMU: isi akumulator mentah + strata\n    (mentah_obat if obat else mentah_tanpa)[0] += mati\n    (mentah_obat if obat else mentah_tanpa)[1] += 1\n    sel = (parah_obat if obat else parah_tanpa) if parah else (ringan_obat if obat else ringan_tanpa)\n    sel[0] += mati; sel[1] += 1\n\nm_obat = mentah_obat[0]/mentah_obat[1]\nm_tanpa = mentah_tanpa[0]/mentah_tanpa[1]\nprint(f"mentah: obat={m_obat:.3f} vs tanpa={m_tanpa:.3f}")\nprint(f"ringan: {ringan_obat[0]/ringan_obat[1]:.3f} vs {ringan_tanpa[0]/ringan_tanpa[1]:.3f}")\nprint(f"parah: {parah_obat[0]/parah_obat[1]:.3f} vs {parah_tanpa[0]/parah_tanpa[1]:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "m_obat", value: 0.223, tol: 0.01, label: "`m_obat` seharusnya ≈ 0.223", msg: "Obat terlihat “membunuh” — padahal efeknya nol; ini confounding." },
          { kind: "equal", task: "t1", name: "m_tanpa", value: 0.096, tol: 0.01, label: "`m_tanpa` seharusnya ≈ 0.096", msg: "Kelompok tanpa obat kebanyakan pasien ringan." },
          { kind: "stdout_matches", task: "t2", pattern: "ringan: 0\\.0\\d\\d vs 0\\.0\\d\\d", label: "`print` menampilkan hasil strata ringan", msg: "Tambahkan print per strata seperti Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "parah: 0\\.2\\d\\d vs 0\\.3\\d\\d", label: "`print` menampilkan hasil strata parah", msg: "Di tiap strata, obat tidak lebih buruk — paradoks Simpson terpecahkan." },
        ],
      },
      reference: "Efek mentah bisa berbalik arah setelah stratifikasi — selalu curigai confounding.",
    },
    {
      id: "target-trial",
      eyebrow: "Langkah 3 · Target trial",
      title: "Emulasi trial: propensity & IPTW",
      prose: [
        "Target trial emulation: rancang “trial ideal” di atas kertas (eligibility, treatment strategies, time zero, follow-up, outcome), lalu emulasikan dengan data observasional. Time zero harus sama untuk kedua kelompok — definisi yang ceroboh melahirkan immortal time bias (lihat langkah 4).",
        "Propensity score = P(diberi treatment | kovariat). IPTW membobot tiap pasien dengan 1/PS (treated) atau 1/(1−PS) (kontrol) — menciptakan populasi pseudo di mana kovariat seimbang. Cek balance (standardized mean difference <0,1) dan bobot ekstrem (trimming). Asumsi kunci: no unmeasured confounding — tidak bisa diuji, hanya bisa diargumenkan + analisis sensitivitas (E-value).",
        "Alternatif: matching, stratifikasi PS, g-formula, atau difference-in-differences bila ada variasi waktu/kebijakan. Tidak ada metode yang menyelamatkan dari confounder tak terukur yang kuat — kejujuran tentang asumsi adalah bagian dari hasil.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Melaporkan hasil IPTW tanpa cek balance kovariat dan tanpa menyebut asumsi no unmeasured confounding. Skor propensity yang buruk = pembobotan yang memperbesar bias, bukan menguranginya.",
        type: "pitfall",
      },
      reference: "Time zero sama. Cek balance. Sebutkan asumsi tak terukur.",
    },
    {
      id: "dag-immortal",
      eyebrow: "Langkah 4 · DAG & bias waktu",
      title: "Collider dan immortal time bias",
      prose: [
        "Collider = variabel yang dipengaruhi paparan DAN outcome (mis. “dirawat di RS” dipengaruhi keparahan dan komplikasi). Mengontrol collider membuka jalur bias — contoh klasik: “obesitas terlihat protektif pada pasien gagal ginjal” karena analisis dikondisikan pada “masuk RS” (collider). Aturan DAG: kontrol confounder (panah ke paparan & outcome), jangan kontrol mediator (efek total) atau collider.",
        "Immortal time bias: studi “pasien yang minum obat ≥30 hari hidup lebih lama”. Untuk minum 30 hari, pasien HARUS hidup 30 hari — periode “immortal” itu dikreditkan ke kelompok obat. Hasil: obat terlihat memperpanjang hidup padahal itu artefak definisi. Solusi: time zero yang benar (landmark analysis) atau perlakukan paparan sebagai time-varying.",
        "Keduanya adalah bias desain — tidak bisa diperbaiki dengan model canggih setelah data dikumpulkan. Ditangkap di papan tulis (DAG + protokol time zero), bukan di Jupyter.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Immortal time bias pernah membuat obat tampak memperpanjang hidup 6 bulan — publikasi ditarik setelah ketahuan. Bias desain yang lolos ke jurnal merusak kepercayaan publik pada sains.",
        type: "risk",
      },
      quiz: [
        {
          q: "“Minum obat ≥30 hari” sebagai definisi kelompok treated berisiko…",
          options: [
            { text: "Immortal time bias — 30 hari hidup dikreditkan ke obat", why: "Benar: syarat masuk kelompok = selamat 30 hari. Pakai landmark/time-varying.", correct: true },
            { text: "Confounding by indication", why: "Itu soal siapa diberi obat, bukan soal definisi waktu." },
            { text: "Collider bias", why: "Collider soal pengondisian pada akibat bersama — ini soal time zero." },
            { text: "Tidak ada masalah", why: "Ada: artefak definisi yang sistematis menguntungkan kelompok obat." },
          ],
        },
      ],
      reference: "Bias desain ditangkap di papan tulis, bukan di model.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: mengklaim kausalitas dari data observasional",
      prose: [
        "Lima situasi keputusan yang dihadapi analis setiap kali data observasional dipakai menjawab pertanyaan “apakah X menyebabkan Y”:",
        "Skenario 1 — “Ada klaim kausal dari data observasional — percaya atau tidak?” → Tiga pertanyaan sebelum percaya: (1) time zero-nya sebanding antar kelompok? (2) siapa yang lebih sering teramati (surveillance bias)? (3) confounder tak terukurnya apa? Contoh: klaim “vaksin memicu autoimun” RR 2,0 runtuh menjadi 1,05 setelah time zero diperbaiki dan frekuensi kunjungan dikontrol.",
        "Skenario 2 — “Mau menjawab pertanyaan kausal tanpa RCT?” → Tulis protokol target trial-nya dulu: siapa eligible, kapan time zero, apa perlakuannya — lalu emulasikan dari data observasional. Time zero harus sama dan bermakna untuk SEMUA kelompok; tanpa itu, emulasinya adalah fiksi.",
        "Skenario 3 — “Ada variasi kebijakan atau waktu yang eksogen?” → Manfaatkan eksperimen alami: Difference-in-Differences (wajib cek parallel trends pra-intervensi) atau Instrumental Variable (wajib cek relevance + exclusion restriction). Instrumen yang lemah atau bocor lebih berbahaya daripada tidak memakai IV sama sekali.",
        "Skenario 4 — “Kelompok perlakuan didefinisikan dari kejadian selama follow-up?” → Bedah time zero-nya: ini pintu masuk immortal time bias. Pakai landmark analysis atau emulasi target trial dengan perlakuan sebagai time-varying — jangan pernah biarkan masa depan menentukan siapa “treated”.",
        "Skenario 5 — “Sudah mengontrol banyak variabel — berarti kausal?” → Belum: kontrol statistik merapikan bias, bukan menghapus bias desain. Cek DAG — jangan-jangan yang dikontrol adalah collider atau mediator. “Banyak kontrol” tanpa DAG hanyalah keyakinan yang mahal.",
        "Aturan praktis 10 detik: klaim kausal → time zero? surveillance? unmeasured? → tulis target trial dulu → ada eksperimen alami? (DiD/IV dengan asumsi dicek) → time zero dari masa depan = bedah dulu → kontrol ≠ kausal tanpa DAG.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira “sudah dikontrol 20 variabel” sama dengan kausal — padahal time zero-nya tidak sebanding dan kelompok treated didefinisikan dari masa depan. Statistik yang canggih di atas desain yang bocor hanya menghasilkan bias yang presisi.",
        type: "pitfall",
      },
      reference: "Time zero + surveillance + unmeasured = tiga pertanyaan wajib. Target trial sebelum analisis.",
    },
    {
      id: "minicase-vaksin",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Vaksin dan penyakit autoimun",
      prose: [
        "Klaim viral: “vaksin X memicu autoimun — data RS menunjukkan penerima vaksin 2× lebih sering didiagnosis autoimun”. Analisis target-trial: time zero = tanggal vaksinasi (treated) vs tanggal kunjungan kontrol (kontrol)? Salah — kelompok kontrol tidak punya time zero sebanding.",
        "Masalah kedua: surveillance bias — penerima vaksin lebih sering kontrol → lebih sering terdiagnosis (collider-ish: “terdiagnosis” dipengaruhi perilaku berobat). Setelah definisi time zero yang benar + kontrol frekuensi kunjungan: RR 2,0 → 1,05 (95% CI: 0,9–1,2). Klaim runtuh.",
        "Pelajaran: dua bias (time zero + surveillance) menjelaskan seluruh “efek”. Sebelum percaya klaim kausal observasional, tanya: time zero-nya apa? siapa yang lebih sering teramati? confounder tak terukurnya apa?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira “sudah dikontrol banyak variabel” = kausal. Tanpa time zero yang benar dan tanpa memikirkan siapa yang teramati, kontrol statistik hanya merapikan bias — bukan menghilangkannya.",
        type: "pitfall",
      },
      reference: "Tiga pertanyaan sebelum percaya: time zero? surveillance? unmeasured confounding?",
    },
    {
      id: "did-iv",
      eyebrow: "Langkah 7 · Alam",
      title: "DiD & IV: eksperimen yang disediakan alam",
      prose: [
        "Ketika RCT tak mungkin — karena mahal, tidak etis, atau program sudah berjalan — alam kadang menyediakan eksperimennya sendiri. Dua desain quasi-eksperimental yang wajib dikuasai analis kebijakan kesehatan: difference-in-differences (DiD) dan instrumental variable (IV). Keduanya menukar asumsi “tidak ada confounding tak terukur” (yang tak bisa dicek) dengan asumsi lain yang LEBIH bisa diperdebatkan secara substantif.",
        "DiD memanfaatkan variasi waktu × wilayah. Contoh Indonesia: program perluasan JKN di kabupaten A tahun 2022, kabupaten B belum. Efek = (perubahan A 2021→2023) − (perubahan B 2021→2023). Logikanya: B menunjukkan “apa yang terjadi tanpa program” (tren bersama — mis. pemulihan pasca-pandemi); selisihnya = efek program. Asumsi kunci: PARALLEL TRENDS — tanpa program, A dan B bergerak sejajar; diuji dengan data pra-program (plot tren 2019–2021 harus sejajar; bila tidak, DiD tidak valid). Varian modern: staggered DiD untuk program bergulir per gelombang — hindari two-way fixed effects klasik yang kini diketahui bias bila efek heterogen antar waktu.",
        "IV mencari “lotre alam” — variabel yang mengacak treatment tanpa mengacak outcome langsung. Contoh kesehatan: (a) jarak ke faskes sebagai instrumen cakupan imunisasi (yang dekat lebih mudah dijangkau — tapi jarak juga berkorelasi dengan kemiskinan, jadi exclusion-nya dipertanyakan); (b) cutoff usia program — yang lahir 1 Januari vs 31 Desember beda eligibility padahal nyaris identik (regression discontinuity, saudara dekat IV); (c) gaya dokter yang bertugas — pasien “teracak” ke dokter agresif vs konservatif. Uji selalu: relevance mudah (F-stat tahap pertama >10); exclusion & exchangeability TIDAK bisa diuji statistik — harus dipertahankan dengan argumen substantif. IV yang lemah (F<10) lebih berbahaya daripada tidak pakai IV.",
        "Konteks program Indonesia: evaluasi program stunting kabupaten (DiD antar kabupaten dengan tren pra-program), dampak JKN terhadap catastrophic health expenditure (IV: rollout bertahap sebagai instrumen kepesertaan), efek posyandu (RD di cutoff usia). Aturan praktis analis kebijakan: (1) tulis asumsi identifikasi dalam SATU kalimat sebelum menyentuh data; (2) uji asumsi yang bisa diuji (pra-tren, F-stat, balance check); (3) laporkan analisis sensitivitas untuk asumsi yang tak bisa diuji. Klaim kausal tanpa kalimat asumsi = opini.",
      ],
      tasks: [],
      formula: String.raw`\hat{\delta}_{DiD} = (\bar{Y}_{T,1} - \bar{Y}_{T,0}) - (\bar{Y}_{C,1} - \bar{Y}_{C,0})`,
      formulaNote: "δ̂_DiD = estimasi efek kausal via difference-in-differences. Ȳ_T,1 = rata-rata outcome grup TREATED setelah intervensi; Ȳ_T,0 = treated sebelum; Ȳ_C,1, Ȳ_C,0 = grup KONTROL setelah/sebelum. Kurung pertama = perubahan di treated (efek + tren); kurung kedua = perubahan di kontrol (tren saja); selisihnya = efek. Asumsi kunci: PARALLEL TRENDS — tanpa intervensi kedua grup bergerak sejajar (cek dengan ≥2 periode pra-intervensi). Interpretasi: DiD membuang tren bersama; yang tersisa diklaim sebagai efek — hanya sekuat asumsi paralelnya.",
      note: {
        title: "Intuisi: kalimat asumsi dulu, uji yang bisa diuji, triangulasi desain",
        body: "Analis kausal yang baik bukan yang paling mahir memodelkan — melainkan yang paling jujur soal apa yang TIDAK bisa dibuktikan datanya. Heuristik pertama: sebelum satu baris kode, tulis asumsi identifikasimu dalam satu kalimat — “efek obat teridentifikasi bila tidak ada confounding tak terukur setelah mengontrol usia, keparahan, dan komorbid” — dan tempel di slide pertama presentasi. Kalimat yang terdengar goyah saat dibaca keras adalah analisis yang goyah. Heuristik kedua: bedakan asumsi yang bisa diuji dari yang tidak. Pra-tren bisa diplot, F-stat bisa dihitung, balance bisa dicek — kerjakan semuanya; exclusion restriction tidak bisa diuji — pertahankan dengan cerita substantif yang meyakinkan orang skeptis, bukan dengan jargon. Heuristik ketiga: satu desain quasi-eksperimental yang asumtifnya masuk akal mengalahkan tiga model canggih yang asumtifnya ajaib. Bila DiD dengan pra-tren sejajar dan IV dengan instrumen yang meyakinkan memberi jawaban sama (triangulasi), tidurlah nyenyak; bila bertentangan, percayai yang asumtifnya paling bisa dipertahankan — dan laporkan keduanya. Tiga kebiasaan — kalimat asumsi dulu, uji yang bisa diuji, triangulasi desain — memisahkan ilmuwan kausal dari tukang regresi.",
      },
      quiz: [
        {
          q: "DiD evaluasi program JKN: tren pra-program kabupaten A dan B TIDAK sejajar (A membaik lebih cepat). Tindakan?",
          options: [
            { text: "DiD tidak valid — cari kontrol sintetis atau desain lain", why: "Benar: parallel trends dilanggar → selisih tren mencemari estimasi efek.", correct: true },
            { text: "Lanjutkan, nanti dikontrol dengan regresi", why: "Kontrol kovariat tidak memperbaiki pelanggaran asumsi identifikasi." },
            { text: "Perpendek jendela pra-program", why: "Menyembunyikan pelanggaran, bukan memperbaikinya." },
            { text: "Tambah kovariat lebih banyak", why: "Asumsi paralel soal tren tak teramati — kovariat tak menyembuhkannya." },
          ],
        },
        {
          q: "Instrumen “jarak ke faskes” untuk cakupan imunisasi: F-stat tahap pertama = 45, tapi jarak juga berkorelasi dengan kemiskinan. Penilaian?",
          options: [
            { text: "Relevance lolos, tapi exclusion dipertanyakan — butuh argumen/uji tambahan", why: "Benar: F>10 = instrumen kuat; korelasi dengan kemiskinan mengancam exclusion.", correct: true },
            { text: "Valid — F-stat tinggi cukup", why: "F-stat hanya menguji relevance, bukan exclusion." },
            { text: "Tidak valid — buang", why: "Terlalu cepat: kontrol kemiskinan bisa menyelamatkan exclusion." },
            { text: "Ganti ke OLS biasa", why: "OLS kembali ke asumsi no-confounding yang lebih kuat." },
          ],
        },
      ],
      reference: "Satu kalimat asumsi sebelum data. Uji yang bisa diuji; pertahankan sisanya.",
    },
    {
      id: "lab-did",
      eyebrow: "Langkah 8 · Lab",
      title: "Hitung DiD: efek JKN pada catastrophic spending",
      prose: [
        "Outcome: % rumah tangga dengan catastrophic health expenditure. Kabupaten A (perluasan JKN 2022): 2019 = 44%, 2021 = 42%, 2023 = 30%. Kabupaten B (kontrol): 2019 = 42%, 2021 = 40%, 2023 = 36%. Tugasmu: hitung `did` (efek dalam poin persen) dan `pra_tren_paralel` (“ya” bila selisih perubahan pra-program 2019→2021 kedua kabupaten <1 poin, selain itu “tidak”).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `did` (poin persen)" },
        { id: "t2", text: "Uji `pra_tren_paralel` (“ya”/“tidak”)" },
      ],
      expected: "did=-8 pra_tren_paralel=ya",
      formula: String.raw`\hat{\beta}_{IV} = \frac{\text{Cov}(Z, Y)}{\text{Cov}(Z, X)}`,
      formulaNote: "β̂_IV = estimasi efek kausal via instrumental variable (estimator Wald). Z = instrumen — memengaruhi treatment X tapi tidak langsung memengaruhi outcome Y; X = treatment; Y = outcome; Cov = kovarians. Tiga syarat: (1) relevance — Z benar-benar memengaruhi X (F-stat tahap pertama >10); (2) exclusion — Z hanya memengaruhi Y MELALUI X; (3) exchangeability — Z independen dari confounder. Interpretasi: efek per unit X yang digerakkan Z (LATE — efek pada “complier”, bukan semua orang).",
      note: {
        title: "Kaitan ke risk",
        body: "DiD −8 poin persen tanpa uji pra-tren bisa berarti program berhasil — atau berarti kabupaten A memang sudah membaik lebih cepat. Keputusan APBD berbasis DiD yang asumtifnya dilanggar = membayar untuk tren yang terjadi dengan sendirinya.",
        type: "risk",
      },
      hints: [
        "DiD = (A_2023 − A_2021) − (B_2023 − B_2021).",
        "Pra-tren: perubahan 2019→2021 di A vs di B; selisih absolut <1 → “ya”.",
        "Negatif = penurunan catastrophic spending (arah yang baik).",
      ],
      code: {
        starter: `# A (treated): 2019=44, 2021=42, 2023=30; B (kontrol): 2019=42, 2021=40, 2023=36
# TULIS KODEMU: did dan pra_tren_paralel
did = 
pra_tren_paralel = 
print(f"did={did:.0f} pra_tren_paralel={pra_tren_paralel}")`,
        lockLines: 1,
        solution: `# A (treated): 2019=44, 2021=42, 2023=30; B (kontrol): 2019=42, 2021=40, 2023=36
# TULIS KODEMU: did dan pra_tren_paralel
a_pre, a_post = 42, 30
b_pre, b_post = 40, 36
did = (a_post - a_pre) - (b_post - b_pre)
pra_a, pra_b = a_pre - 44, b_pre - 42
pra_tren_paralel = "ya" if abs(pra_a - pra_b) < 1.0 else "tidak"
print(f"did={did:.0f} pra_tren_paralel={pra_tren_paralel}")`,
        checks: [
          { kind: "equal", task: "t1", name: "did", value: -8, tol: 1e-9, label: "`did` seharusnya −8", msg: "(30−42) − (36−40) = −12 − (−4) — program menurunkan 8 poin." },
          { kind: "contains", task: "t2", name: "pra_tren_paralel", value: "ya", label: "`pra_tren_paralel` seharusnya “ya”", msg: "Pra-tren −2 vs −2: sejajar — asumsi DiD terpenuhi." },
          { kind: "stdout_matches", task: "t2", pattern: "did=-8 pra_tren_paralel=ya", label: "`print` menampilkan hasil DiD", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "DiD = −8 dengan pra-tren sejajar. Interpretasi kebijakan yang tepat?",
          options: [
            { text: "Perluasan JKN menurunkan catastrophic spending ~8 poin di atas tren — bukti awal yang layak dilaporkan", why: "Benar: asumsi terpenuhi, efek terukur — dengan kualifikasi “di atas tren”.", correct: true },
            { text: "Bukti pasti program berhasil — skala nasional segera", why: "Satu DiD = bukti awal, bukan vonis final; butuh replikasi." },
            { text: "Tidak berarti apa-apa", why: "−8 poin dengan asumsi terpenuhi adalah sinyal yang kuat." },
            { text: "Efeknya 12 poin (hanya lihat kabupaten A)", why: "Itu sebelum dikurangi tren kontrol — justru yang dibuang DiD." },
          ],
        },
      ],
      reference: "DiD = selisih perubahan. Tanpa pra-tren sejajar, angkanya opini.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Confounding by indication: yang parah diberi obat → obat terlihat membunuh.",
        "DAG: kontrol confounder; jangan sentuh mediator/collider.",
        "Target trial: time zero sama; IPTW + cek balance + akui asumsi.",
        "Immortal time bias & surveillance bias = bias desain, bukan bias model.",
      ],
      next: { label: "HD11 — Wrangling EHR", href: "/v2/learn/hd11-wrangling-ehr" },
      quiz: [
        {
          q: "Obat terlihat meningkatkan mortalitas (22% vs 10%), tapi di tiap strata keparahan obat sedikit lebih baik. Ini…",
          options: [
            { text: "Confounding by indication (paradoks Simpson)", why: "Benar: keparahan memengaruhi pemberian obat dan outcome. Stratifikasi membalik kesimpulan.", correct: true },
            { text: "Bukti obat berbahaya", why: "Terbalik: setelah stratifikasi obat justru sedikit membantu." },
            { text: "Collider bias", why: "Bukan collider — ini confounder klasik (keparahan → obat, keparahan → mortalitas)." },
            { text: "Efek samping obat", why: "Efek sebenarnya nol pada simulasi — yang terlihat adalah artefak alokasi." },
          ],
        },
        {
          q: "Variabel yang merupakan akibat dari paparan DAN outcome (collider) sebaiknya…",
          options: [
            { text: "Jangan dikontrol — mengontrolnya membuka jalur bias", why: "Benar: aturan DAG.", correct: true },
            { text: "Selalu dikontrol", why: "Itu untuk confounder, bukan collider." },
            { text: "Dikontrol bila signifikan", why: "Signifikansi tidak menentukan struktur kausal." },
            { text: "Dijadikan outcome", why: "Tidak relevan — ini soal strategi kontrol." },
          ],
        },
        {
          q: "Asumsi kunci IPTW yang tidak bisa diuji dari data?",
          options: [
            { text: "No unmeasured confounding", why: "Benar: hanya bisa diargumenkan + sensitivitas (E-value).", correct: true },
            { text: "Linearitas", why: "Bisa dicek/direlaksasi dari data." },
            { text: "Ukuran sampel cukup", why: "Itu soal presisi, bisa dihitung." },
            { text: "Tidak ada missing data", why: "Missing bisa ditangani (HD8) — bukan asumsi inti IPTW." },
          ],
        },
        {
          q: "Setelah time zero benar + kontrol frekuensi kunjungan, RR vaksin-autoimun 2,0 → 1,05. Kesimpulan?",
          options: [
            { text: "Klaim awal dijelaskan bias desain (time zero + surveillance)", why: "Benar: seluruh “efek” adalah artefak.", correct: true },
            { text: "Vaksin terbukti berbahaya", why: "Terbalik: RR≈1 = tidak ada efek." },
            { text: "Butuh sampel lebih besar", why: "Bukan soal power — soal bias." },
            { text: "Data tidak bisa dipakai", why: "Data bisa dipakai — dengan desain analisis yang benar." },
          ],
        },
      ],
    },
  ],
};
