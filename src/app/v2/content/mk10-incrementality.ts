import type { V2Lesson } from "../lib/types";

export const mk10: V2Lesson = {
  slug: "mk10-incrementality",
  track: "Marketing Analytics",
  module: "Inkrementalitas",
  title: "MK10 — Inkrementalitas & Geo-Experiment",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-segarsari",
      eyebrow: "Langkah 1 · Cerita SegarSari",
      title: "Atribusi Rp3 miliar vs inkremental Rp160 juta",
      prose: [
        "SegarSari melihat laporan atribusi: iklan \u201Cmenghasilkan\u201D Rp3 miliar. Lalu mereka menjalankan geo-experiment: 10 kota treatment, 10 kota kontrol. Hasil DiD: tambahan Rp2jt/kota/minggu × 10 kota × 8 minggu = Rp160 juta inkremental.",
        "Jurang Rp3M vs Rp160jt = selisih antara \u201Cterlibat\u201D dan \u201Cmenyebabkan\u201D. Atribusi memberi kredit ke iklan untuk penjualan yang sebenarnya terjadi juga tanpa iklan.",
        "Aturan yang tidak bisa ditawar: incremental ≤ attributed. Kalau laporan atribusimu bilang X, nilai kausal sebenarnya maksimal X — biasanya jauh lebih kecil.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Budget yang dialokasikan by laporan atribusi bisa 10–20x lebih besar dari nilai kausal sebenarnya. Inilah cara termahal untuk \u201Cscale yang bekerja\u201D.",
        type: "risk",
      },
      reference: "Atribusi = korelasi. Inkremental = kausal. Incremental ≤ attributed.",
    },
    {
      id: "lift-iroas",
      eyebrow: "Langkah 2 · Lift & iROAS & lab",
      title: "Lift, inkremental, dan iROAS",
      prose: [
        "Lift = (T − C) / C: berapa persen tambahan yang disebabkan treatment. Worked example: 27.000 conversion teratribusi, kontrol menyiratkan 24.300 akan terjadi anyway → inkremental 2.700, lift 11,1%.",
        "iROAS = revenue inkremental / spend = 2.700 × Rp1jt / Rp500jt = 5,4. Bandingkan dengan ROAS atribusi = 27.000 × Rp1jt / Rp500jt = 54. Angka 54 yang dipajang di dashboard vs 5,4 yang sebenarnya — beda 10x lipat.",
        "Di lab ini kamu menghitung keempatnya dari data eksperimen mini. Rasakan bedanya: satu angka untuk pamer, satu untuk keputusan.",
      ],
      formula: String.raw`\text{lift} = \frac{T - C}{C} \qquad \text{iROAS} = \frac{\text{revenue inkremental}}{\text{spend}}`,
      formulaNote: "lift = efek relatif treatment: T = outcome grup treatment, C = outcome grup kontrol. Inkremental = T − C (dalam unit). iROAS = return on ad spend yang kausal: revenue inkremental = inkremental × nilai per unit; spend = biaya iklan. Keputusan budget memakai iROAS (5,4), bukan ROAS atribusi (54) — keduanya berbeda 10x lipat.",
      tasks: [
        { id: "t1", text: "Hitung `lift` dan `inkremental`" },
        { id: "t2", text: "Hitung `iroas` dan `roas_atribusi`, cetak semua" },
      ],
      expected: "lift=0.11 inkremental=2700 iroas=5.4 roas_atribusi=54.0",
      hints: [
        "inkremental = t - c; lift = inkremental / c.",
        "iroas = inkremental * aov / spend.",
        "roas_atribusi = t * aov / spend — bandingkan dengan iroas.",
      ],
      code: {
        starter: `# Hasil eksperimen: T = treatment, C = kontrol\nt, c = 27000, 24300\nspend = 500_000_000\naov = 1_000_000\n\n# TULIS KODEMU: lift, inkremental, iROAS, ROAS atribusi\nlift =\ninkremental =\niroas =\nroas_atribusi =\n\nprint(f"lift={lift:.2f} inkremental={inkremental} iroas={iroas:.1f} roas_atribusi={roas_atribusi:.1f}")`,
        lockLines: 4,
        solution: `# Hasil eksperimen: T = treatment, C = kontrol\nt, c = 27000, 24300\nspend = 500_000_000\naov = 1_000_000\n\n# TULIS KODEMU: lift, inkremental, iROAS, ROAS atribusi\nlift = (t - c) / c\ninkremental = t - c\niroas = inkremental * aov / spend\nroas_atribusi = t * aov / spend\n\nprint(f"lift={lift:.2f} inkremental={inkremental} iroas={iroas:.1f} roas_atribusi={roas_atribusi:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lift", value: 0.1111, tol: 0.005, label: "`lift` sekitar 0,11", msg: "(27.000 − 24.300) / 24.300 = 11,1%." },
          { kind: "equal", task: "t1", name: "inkremental", value: 2700, tol: 1e-9, label: "`inkremental` seharusnya 2700", msg: "27.000 − 24.300. Hanya ini yang disebabkan iklan." },
          { kind: "equal", task: "t2", name: "iroas", value: 5.4, tol: 1e-9, label: "`iroas` seharusnya 5,4", msg: "2.700 × 1jt / 500jt." },
          { kind: "equal", task: "t2", name: "roas_atribusi", value: 54, tol: 1e-9, label: "`roas_atribusi` seharusnya 54", msg: "27.000 × 1jt / 500jt. 10x lipat dari iROAS — itulah jurangnya." },
          { kind: "stdout_matches", task: "t2", pattern: "iroas=5\\.4", label: "`print` menampilkan iroas", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Keputusan pakai iROAS, bukan ROAS atribusi.",
    },
    {
      id: "geo-experiment",
      eyebrow: "Langkah 3 · Geo-experiment",
      title: "10 kota vs 10 kota: DiD-nya SegarSari",
      prose: [
        "Geo-experiment: randomisasi per kota/region, bukan per user — kebal terhadap interference (MK9). SegarSari: 10 kota treatment, 10 kontrol, DiD +Rp2jt/kota/minggu selama 8 minggu.",
        "Desain yang benar: pasangkan kota yang mirip (matched pairs) sebelum randomisasi, ukur baseline pra-periode untuk cek parallel trends, dan kunci durasi di muka.",
        "Kapan geo-experiment wajib: channel yang tidak bisa di-randomisasi per user (TV, radio, OOH) dan situasi interference tinggi. Biayanya mahal — tapi lebih murah dari salah alokasi Rp3M.",
      ],
      tasks: [],
      reference: "Geo = randomisasi kota. Matched pairs + baseline + DiD.",
    },
    {
      id: "branded-retargeting",
      eyebrow: "Langkah 4 · Dua penipu klasik",
      title: "Branded search dan retargeting",
      prose: [
        "Branded search: ROAS atribusi 4,0, iROAS 0,6. Orang yang mengetik nama brand-mu memang mau beli — iklan hanya memungut yang sudah niat. Matikan branded search sejenak (geo test): penjualan hampir tidak turun.",
        "Retargeting: 92% conversion-nya palsu — user yang di-retarget memang akan kembali sendiri. Atribusi last-click memberi semua kredit ke retargeting; eksperimen menunjukkan hampir semuanya bukan kausal.",
        "Dua channel ini terlihat paling efisien di dashboard dan paling tidak inkremental di eksperimen. Selalu uji keduanya sebelum scale.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Men-scale channel dengan ROAS atribusi tertinggi. Branded search dan retargeting selalu menang di dashboard dan kalah di eksperimen — scale mereka = membayar untuk yang gratis.",
        type: "pitfall",
      },
      reference: "Uji branded & retargeting dengan eksperimen sebelum scale.",
    },
    {
      id: "synthetic-control",
      eyebrow: "Langkah 5 · Synthetic control",
      title: "Kontrol buatan saat tidak ada kota kembar",
      prose: [
        "Synthetic control: kalau tidak ada kota kontrol yang mirip, bangun \u201Ckota sintetis\u201D dari kombinasi terbobot beberapa kota lain yang perilakunya meniru treatment pra-periode. Kasus klasik: dampak pajak rokok California −25% — California sintetis dibangun dari negara bagian lain.",
        "Syarat: bobot dipilih dari data pra-treatment saja (tidak boleh intip pasca), dan ada cukup banyak donor yang tidak terkena treatment.",
        "Ini senjata untuk n=1 treatment (satu peluncuran nasional, satu krisis PR): DiD butuh kontrol nyata, synthetic control membuatnya.",
      ],
      tasks: [],
      reference: "Satu treatment, tanpa kontrol mirip → synthetic control.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek intuisimu",
      prose: [
        "Tiga soal cepat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Atribusi bilang Rp3M, eksperimen bilang Rp160jt. Mana yang dipakai untuk budget?",
          options: [
            { text: "Rp160jt — itu kausal", why: "Budget membeli efek kausal, bukan kredit atribusi.", correct: true },
            { text: "Rp3M — datanya lebih besar", why: "Besar ≠ benar. Rp3M mencampur kausal dan non-kausal." },
            { text: "Rata-rata keduanya", why: "Tidak ada dasarnya." },
          ],
        },
        {
          q: "Branded search ROAS 4,0 tapi iROAS 0,6. Keputusan?",
          options: [
            { text: "Kurangi/padamkan — hampir semua conversion terjadi juga tanpanya", why: "iROAS < 1 = merugi secara inkremental.", correct: true },
            { text: "Scale — ROAS 4,0 bagus", why: "Itu ROAS atribusi, bukan kausal." },
            { text: "Naikkan bid", why: "Membayar lebih untuk yang gratis." },
          ],
        },
        {
          q: "Kapan geo-experiment lebih tepat dari A/B user-level?",
          options: [
            { text: "Channel tak bisa dirandomisasi per user / interference tinggi", why: "TV, OOH, dan efek jaringan butuh randomisasi geografis.", correct: true },
            { text: "Selalu — lebih akurat", why: "Lebih mahal dan n kecil; pakai saat dibutuhkan." },
            { text: "Tidak pernah", why: "Ada kasus di mana ia satu-satunya desain valid." },
          ],
        },
      ],
    },
    {
      id: "adv-power-geo",
      eyebrow: "Langkah 7 · Power & MDE geo",
      title: "Geo-experiment: n kecil, variansi besar — hitung MDE-nya",
      prose: [
        "Geo-experiment punya masalah yang tidak dimiliki A/B user-level: unit-nya sedikit. 10 kota vs 10 kota = n efektif 10 per grup, bukan 10.000. Dengan n kecil, minimum detectable effect (MDE) membesar: MDE ≈ 4 × sigma / sqrt(n), di mana sigma = std dev penjualan mingguan per kota.",
        "Worked SegarSari: sigma Rp50jt/minggu/kota, n = 10 → MDE ≈ 4 × 50jt / sqrt(10) = Rp63,2jt per kota per minggu. Efek Rp2jt/kota/minggu yang mereka temukan JAUH di bawah MDE ini — artinya dengan desain acak sederhana, eksperimen 10 vs 10 tidak punya power untuk mendeteksi efek sekecil itu. Mereka beruntung — atau desainnya lebih pintar dari acak sederhana.",
        "Cara menaikkan power tanpa tambah kota: (1) matched pairs — pasangkan kota mirip sebelum randomisasi; korelasi antar-pasangan rho = 0,8 memangkas MDE ke Rp28,3jt; (2) perpanjang periode baseline untuk kovariat yang lebih baik; (3) agregasi mingguan yang lebih panjang. Aturan: JANGAN menjalankan geo-experiment tanpa menghitung MDE dulu — underpowered geo test = Rp ratusan juta untuk jawaban 'tidak tahu'.",
      ],
      tasks: [],
      quiz: [
        {
          q: "10 vs 10 kota, sigma Rp50jt. MDE ≈ Rp63jt/kota/minggu. Efek yang dicari Rp5jt. Masalahnya?",
          options: [
            { text: "Underpowered — MDE 12x lipat dari efek; eksperimen tidak akan mendeteksi apa pun", why: "Menjalankannya = membayar mahal untuk jawaban 'tidak signifikan' yang tidak informatif.", correct: true },
            { text: "Tidak masalah — 20 kota sudah banyak", why: "20 kota = n efektif 10 per grup; untuk geo itu kecil." },
            { text: "Perpanjang jadi 1 tahun pasti cukup", why: "MDE turun dengan sqrt(durasi), tetapi 12x gap butuh 144x durasi — tidak realistis." },
            { text: "Naikkan alpha ke 20%", why: "Menaikkan alpha = menerima 20% false positive; bukan solusi power." },
          ],
        },
        {
          q: "Matched pairs dengan rho = 0,8 memangkas MDE 63jt → 28jt. Mekanismenya?",
          options: [
            { text: "Pasangan mirip menghilangkan variansi antar-kota yang tidak relevan", why: "Perbandingan dalam-pasangan jauh lebih presisi dari perbandingan acak antar-kota.", correct: true },
            { text: "Menambah jumlah kota", why: "Kota tetap 20; yang berubah adalah desain pembandingnya." },
            { text: "Mengurangi sigma penjualan", why: "Sigma penjualan tetap; yang turun adalah variansi estimasi efek." },
            { text: "Menaikkan efek treatment", why: "Efek tidak berubah; yang berubah adalah kemampuan mendeteksinya." },
          ],
        },
      ],
      reference: "Hitung MDE geo sebelum jalan; matched pairs = power murah.",
    },
    {
      id: "lab-mde-geo",
      eyebrow: "Langkah 8 · Lab MDE",
      title: "Lab: MDE geo-experiment dan kekuatan matched pairs",
      prose: [
        "Di lab ini kamu menghitung MDE untuk desain acak vs matched pairs — dan melihat sendiri kenapa geo-experiment tanpa pairing sering underpowered.",
        "Coba: ubah rho menjadi 0,5 atau 0,95. Pada rho berapa MDE turun separuh? (Jawaban: butuh sqrt(1−rho) = 0,5 → rho = 0,75.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mde_biasa` = 4 × sigma / sqrt(n)" },
        { id: "t2", text: "Hitung `mde_pair` dengan sigma efektif = sigma × sqrt(1−rho), cetak" },
      ],
      expected: "mde_biasa=63245553 mde_pair=28284271",
      hints: [
        "import math; math.sqrt(n) untuk akar.",
        "mde_biasa = 4 * sigma / math.sqrt(n).",
        "sigma_ef = sigma * math.sqrt(1 - rho); mde_pair = 4 * sigma_ef / math.sqrt(n).",
      ],
      code: {
        starter: `import math
# 10 kota treatment, 10 kontrol; std dev mingguan per kota Rp50jt
sigma = 50_000_000
n = 10
rho = 0.8  # korelasi antar kota berpasangan

# TULIS KODEMU: MDE desain acak vs matched pairs
mde_biasa =
mde_pair =

print(f"mde_biasa={mde_biasa:.0f} mde_pair={mde_pair:.0f"}`,
        lockLines: 5,
        solution: `import math
# 10 kota treatment, 10 kontrol; std dev mingguan per kota Rp50jt
sigma = 50_000_000
n = 10
rho = 0.8  # korelasi antar kota berpasangan

# TULIS KODEMU: MDE desain acak vs matched pairs
mde_biasa = 4 * sigma / math.sqrt(n)
sigma_ef = sigma * math.sqrt(1 - rho)
mde_pair = 4 * sigma_ef / math.sqrt(n)

print(f"mde_biasa={mde_biasa:.0f} mde_pair={mde_pair:.0f"}`,
        checks: [
          { kind: "equal", task: "t1", name: "mde_biasa", value: 63245553, tol: 1, label: "`mde_biasa` seharusnya 63245553", msg: "4 × 50jt / sqrt(10). MDE 63jt = efek kecil tak terdeteksi." },
          { kind: "equal", task: "t2", name: "mde_pair", value: 28284271, tol: 1, label: "`mde_pair` seharusnya 28284271", msg: "Pairing rho=0,8 memangkas MDE lebih dari separuh." },
          { kind: "stdout_matches", task: "t2", pattern: "mde_pair=28284271", label: "`print` menampilkan mde_pair", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "MDE geo = 4σ/sqrt(n); pairing memangkas via sqrt(1−rho).",
    },
    {
      id: "adv-holdout",
      eyebrow: "Langkah 9 · Holdout",
      title: "Holdout yang benar: kalibrasi yang selalu menyala",
      prose: [
        "Geo-experiment itu mahal dan sesekali. Holdout = versi murahnya yang selalu menyala: sisihkan 5–10% audiens/kota yang TIDAK pernah kena iklan channel itu, selamanya. Selisih holdout vs sisanya = estimasi inkremental yang terus diperbarui — kalibrasi berjalan untuk angka atribusi.",
        "Biaya holdout itu nyata: 10% holdout di channel Rp1M/bulan = Rp100jt/bulan 'nilai yang dikorbankan' (asumsi channel menguntungkan). Tetapi tanpa holdout, kamu membayar lebih mahal: keputusan by angka atribusi yang 10x meleset.",
        "Dua syarat holdout jujur: (1) cukup besar untuk power — holdout 1% tidak bisa mendeteksi apa pun; (2) tidak terkontaminasi — user holdout tidak boleh 'bocor' kena iklan via channel lain. Holdout yang bocor = kalibrasi palsu.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Channel spend Rp1M/bulan. Holdout 10% yang tepat diartikan sebagai?",
          options: [
            { text: "Biaya Rp100jt/bulan untuk kalibrasi kebenaran — lebih murah dari keputusan salah Rp1M", why: "Holdout = premi asuransi atas seluruh budget channel.", correct: true },
            { text: "Pemborosan Rp100jt — harus dihapus", why: "Menghapus holdout = kembali buta; atribusi 10x meleset jauh lebih mahal." },
            { text: "Harus 50% agar adil", why: "50% terlalu mahal; 5–10% cukup untuk kalibrasi dengan power memadai." },
            { text: "Cukup 0,1% — yang penting ada", why: "Terlalu kecil = tidak ada power = kalibrasi palsu." },
          ],
        },
      ],
      reference: "Holdout 5–10% = kalibrasi berjalan; cukup besar + tidak bocor.",
    },
    {
      id: "intuisi-hadir",
      eyebrow: "Langkah 10 · Intuisi",
      title: "Atribusi menghitung yang hadir; eksperimen menemukan yang menyebabkan",
      prose: [
        "Dua angka — Rp3 miliar vs Rp160 juta — dan keduanya 'benar' untuk pertanyaan yang berbeda. Tiga heuristik agar tidak tertukar.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: atribusi menjawab 'siapa yang hadir di konversi', eksperimen menjawab 'tanpa siapa konversi tidak terjadi'",
        body: "Heuristik pertama: hafalkan ketidaksamaan incremental ≤ attributed, lalu pakai sebagai alat audit. Setiap kali dashboard memajang angka atribusi, tanya: 'berapa yang inkremental?' Jika tidak ada yang bisa menjawab dengan eksperimen atau holdout, angka itu adalah batas atas — bukan nilai. Budget yang dialokasikan by batas atas = over-invest yang sistematis. Heuristik kedua: curigai channel yang 'terlalu bagus'. Branded search dan retargeting selalu juara di dashboard karena mereka memungut demand yang sudah ada — seperti pramusaji yang mengklaim masakannya enak karena tamu yang lapar memuji. Uji keduanya duluan sebelum scale: geo test mematikan branded sejenak, holdout untuk retargeting. Channel yang lolos uji ini = channel yang benar-benar bekerja. Heuristik ketiga: kalibrasi adalah rutinitas, bukan proyek. Satu geo-experiment hebat tiga tahun lalu tidak mengkalibrasi apa pun hari ini — perilaku berubah, channel berubah, atribusi platform berubah (DDA black-box!). Holdout 5–10% yang selalu menyala + eksperimen berkala = satu-satunya cara angka atribusi tetap jujur dari waktu ke waktu. Tanpa kalibrasi berjalan, atribusi adalah dongeng yang makin meyakinkan justru saat ia makin salah.",
      },
      reference: "Incremental ≤ attributed; uji yang 'terlalu bagus'; kalibrasi berjalan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 11 · Peta keputusan",
      title: "Peta keputusan: dari 'iklan diklik' ke 'iklan menyebabkan'",
      prose: [
        "Skenario satu — atribusi platform vs eksperimen beda jauh (Rp3M vs Rp160jt): percayai eksperimen untuk keputusan budget. Atribusi menjawab 'siapa hadir', eksperimen menjawab 'siapa menyebabkan'.",
        "Skenario dua — mau scale nasional (Rp5M): jangan ekstrapolasi linear. Efek terkonsentrasi di 3 kota besar (70%) — scale bertahap per klaster kota sejenis.",
        "Skenario tiga — memilih desain: geo-experiment dengan matched pairs bila unitnya wilayah; holdout user-level bila bisa randomisasi individu. Pilih yang MDE-nya terjangkau budget.",
        "Skenario empat — branded dan retargeting: asumsikan non-inkremental sampai terbukti. Keduanya penipu klasik — selalu hadir di journey, jarang menyebabkan.",
        "Skenario lima — iROAS sebagai kompas: bandingkan iROAS antar channel dari eksperimen, bukan ROAS atribusi. Alokasikan ke iROAS tertinggi sampai marginal-nya turun.",
        "Aturan praktis 10 detik: ada angka eksperimen, bukan cuma atribusi? Efek terkonsentrasi di mana? Branded dan retargeting sudah di-net-off? MDE eksperimen lebih kecil dari efek yang dicari?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Men-scale dari angka atribusi. Atribusi Rp3 miliar membuat semua channel terlihat pahlawan; eksperimen Rp160 juta menunjukkan siapa yang benar-benar bekerja. Budget mengikuti yang kedua.",
      },
      reference: "Eksperimen di atas atribusi → waspadai dua penipu → scale per klaster → alokasi via iROAS.",
    },
    {
      id: "minicase-segarsari2",
      eyebrow: "Langkah 12 · Mini-case",
      title: "SegarSari, bagian 2: dari 20 kota ke keputusan nasional",
      prose: [
        "Setelah geo-experiment 20 kota (inkremental Rp160jt dari spend Rp500jt, iROAS 5,4), direksi bertanya: 'scale nasional butuh spend Rp5 miliar — lanjut?' Tiga fakta: (1) MDE eksperimen ≈ Rp63jt/kota/minggu (acak) — efek Rp2jt/kota/minggu terdeteksi hanya karena matched pairs yang baik; (2) efek tidak seragam: 3 kota besar menyumbang 70% inkremental; (3) atribusi platform mengklaim iROAS nasional akan 8x lipat.",
        "Pertanyaan: (1) Apa risiko scale 10x lipat langsung? (2) Rancang scale bertahap yang aman. (3) Bagaimana klaim 'iROAS 8x' diuji?",
        "Pembahasan: (1) Efek terkonsentrasi di 3 kota — scale ke 100 kota belum tentu linear; MDE per kota tetap; diminishing return (saturasi) belum terukur. (2) Scale 3x ke kota mirip 3 pemenang, dengan holdout 10% yang menyala; evaluasi 8 minggu; baru putuskan 10x. (3) Klaim platform diuji dengan holdout nasional kecil atau geo test lanjutan — bukan dipercaya buta. Ingat: incremental ≤ attributed, selalu.",
      ],
      tasks: [],
      quiz: [
        {
          q: "SegarSari: 70% inkremental dari 3 kota besar. Scale nasional 10x langsung?",
          options: [
            { text: "Tidak — scale bertahap 3x ke kota mirip pemenang + holdout, evaluasi, baru putuskan", why: "Efek terkonsentrasi + saturasi belum terukur = ekstrapolasi linear berbahaya.", correct: true },
            { text: "Ya — iROAS 5,4 menguntungkan, gas penuh", why: "5,4 di 20 kota ≠ 5,4 di 200 kota; konsentrasi efek + diminishing return." },
            { text: "Ya — klaim platform 8x lipat mendukung", why: "Klaim platform = atribusi, bukan kausal; harus diuji." },
            { text: "Tidak — hentikan channel ini", why: "Berlebihan; 5,4 menguntungkan, hanya scale-nya yang harus bertahap." },
          ],
        },
        {
          q: "Pelajaran umum dari ketidaksamaan incremental ≤ attributed untuk scale?",
          options: [
            { text: "Jangan pernah scale by angka atribusi; selalu by estimasi kausal + kalibrasi berjalan", why: "Atribusi = batas atas. Scale mengalikan — termasuk mengalikan kesalahan.", correct: true },
            { text: "Atribusi tidak berguna sama sekali", why: "Berguna untuk monitoring dan alokasi taktis — hanya bukan untuk klaim kausal." },
            { text: "Selalu kurangi 90% dari angka atribusi", why: "Tidak ada rasio universal; 90% di kasus ini, bisa 30% di kasus lain." },
            { text: "Percayai platform yang paling besar", why: "Platform besar = insentif besar untuk angka yang terlihat bagus." },
          ],
        },
      ],
      reference: "Scale bertahap + holdout; uji klaim platform, jangan telan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Inkrementalitas = keberanian menguji angka yang terlihat bagus.",
      ],
      tasks: [],
      summary: [
        "Atribusi = korelasi; inkremental = kausal; incremental ≤ attributed.",
        "Lift = (T−C)/C; keputusan pakai iROAS (5,4), bukan ROAS atribusi (54).",
        "Geo-experiment: randomisasi kota + matched pairs + DiD.",
        "Branded search & retargeting: pahlawan dashboard, pecundang eksperimen.",
        "Synthetic control untuk n=1 tanpa kontrol mirip (California −25%).",
        "MDE geo = 4sigma/sqrt(n); matched pairs (rho=0,8) memangkas >50%.",
        "Holdout 5-10% yang selalu menyala = kalibrasi berjalan untuk atribusi.",
      ],
      next: { label: "MK11 — Uplift", href: "/learn/mk11-uplift" },
      quiz: [
        {
          q: "27.000 teratribusi, 2.700 inkremental. Berapa % atribusi yang \u201Cpalsu\u201D?",
          options: [
            { text: "90% — hanya 10% yang kausal", why: "2.700/27.000 = 10%. Sembilan puluh persen terjadi juga tanpa iklan.", correct: true },
            { text: "11,1%", why: "Itu lift-nya, bukan porsi palsu." },
            { text: "0% — atribusi pasti benar", why: "Atribusi memberi kredit, bukan membuktikan kausalitas." },
          ],
        },
        {
          q: "Retargeting 92% palsu. Kenapa atribusi melebih-lebihkannya?",
          options: [
            { text: "Last-click memberi kredit penuh ke sentuhan terakhir", why: "User yang memang mau kembali \u201Cdipungut\u201D retargeting di garis finis.", correct: true },
            { text: "Retargeting memang paling efektif", why: "Eksperimen bilang sebaliknya: 92% non-kausal." },
            { text: "Data retargeting lebih lengkap", why: "Bukan soal kelengkapan — soal kausalitas." },
          ],
        },
        {
          q: "Syarat validitas DiD di geo-experiment?",
          options: [
            { text: "Parallel trends di periode baseline", why: "Tanpa itu, selisih perubahan bukan efek treatment.", correct: true },
            { text: "Kota treatment lebih besar", why: "Ukuran bukan syarat; kesejajaran tren yang syarat." },
            { text: "Durasi minimal 1 tahun", why: "Durasi soal power, bukan validitas." },
          ],
        },
        {
          q: "Kapan memakai synthetic control?",
          options: [
            { text: "Satu treatment tanpa kota kontrol yang mirip", why: "Bangun kontrol sintetis dari donor terbobot — kasus California.", correct: true },
            { text: "Selalu, lebih canggih", why: "Butuh banyak donor dan asumsi; DiD dengan kontrol nyata lebih sederhana." },
            { text: "Untuk A/B user-level", why: "Itu ranah randomisasi biasa (MK9)." },
          ],
        },
        {
          q: "iROAS 5,4 vs ROAS atribusi 54. Channel ini di-scale?",
          options: [
            { text: "Ya, hati-hati — 5,4 masih menguntungkan, tapi jangan by angka 54", why: "Keputusan by kausal. Scale by 54 = over-invest 10x.", correct: true },
            { text: "Ya, agresif — ROAS 54 luar biasa", why: "54 bukan kausal. Agresif by angka palsu = bakar uang." },
            { text: "Tidak — 5,4 terlalu kecil", why: "5,4 > 1 = menguntungkan. Terlalu kecil bukan vonis." },
          ],
        },
      ],
    },
  ],
};
