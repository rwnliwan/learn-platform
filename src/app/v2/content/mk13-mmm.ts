import type { V2Lesson } from "../lib/types";

export const mk13: V2Lesson = {
  slug: "mk13-mmm",
  track: "Marketing Analytics",
  module: "Marketing Mix Modeling",
  title: "MK13 — Marketing Mix Modeling (MMM)",
  estMinutes: 70,
  steps: [
    {
      id: "cerita-rasanusa",
      eyebrow: "Langkah 1 · Cerita RasaNusa",
      title: "MMM Rp2 miliar yang membunuh brand",
      prose: [
        "MMM konsultan Rp2 miliar bilang: TV ROI 0,8, potong saja. RasaNusa memotong TV. Setahun kemudian: awareness −15 poin, sales −8%. TV memang ROI jangka pendeknya rendah — tapi ia membangun brand yang baru terlihat setahun kemudian.",
        "MMM menjawab pertanyaan yang tidak bisa dijawab atribusi digital: berapa kontribusi tiap channel (termasuk offline) terhadap sales, setelah mengontrol musiman, harga, dan kompetitor. Tapi ia butuh 2–3 tahun data dan asumsi yang jujur.",
        "Lesson ini: dekomposisi MMM, adstock, saturasi Hill, dan kenapa MMM tanpa kalibrasi eksperimen = dongeng mahal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "MMM yang salah bisa menghancurkan brand (kasus RasaNusa): memotong channel brand-building demi ROI jangka pendek = mengorbankan masa depan demi kuartal ini.",
        type: "risk",
      },
      reference: "MMM = kontribusi channel offline+online, butuh data tahunan.",
    },
    {
      id: "dekomposisi",
      eyebrow: "Langkah 2 · Dekomposisi",
      title: "y = base + Σ channel + kontrol",
      prose: [
        "Model: y_t = α + Σ β_c · f_c(adstock(spend_c,t)) + γX_t + ε_t. α = base sales (tanpa iklan — biasanya ~60%!). Tiap channel masuk lewat adstock (efek carryover) lalu saturasi (diminishing return). X = kontrol: musiman, harga, promo, tren.",
        "Base 60% artinya: 60% penjualan terjadi tanpa iklan. Channel bertarung untuk 40% sisanya — klaim \u201Ciklan menghasilkan 100% sales\u201D langsung gugur.",
        "Kontrol X bukan hiasan: tanpa kontrol harga/musiman, efeknya terserap ke channel (omitted variable bias) — TV terlihat hebat setiap Lebaran padahal yang bekerja kalender.",
      ],
      formula: String.raw`y_t = \alpha + \sum_c \beta_c \cdot f_c(\text{adstock}(\text{spend}_{c,t})) + \gamma X_t + \varepsilon_t`,
      formulaNote: "Dekomposisi MMM: y_t = penjualan periode t; alpha = base sales (tanpa iklan, biasanya ~60%); beta_c = koefisien channel c; f_c = fungsi saturasi (Hill); adstock(spend_c,t) = spend channel c yang sudah dikoreksi carryover; gamma X_t = kontrol (musiman, harga, promo, tren); epsilon_t = error. Tanpa X yang benar, efek musiman terserap ke channel (omitted variable bias).",
      tasks: [],
      reference: "Base ~60%. Kontrol X wajib — tanpa itu bias.",
    },
    {
      id: "adstock-lab",
      eyebrow: "Langkah 3 · Adstock & saturasi & lab",
      title: "Iklan minggu lalu masih bekerja",
      prose: [
        "Adstock: A_t = s_t + λ·A_{t−1}. Iklan tidak hilang begitu tayang — efeknya meluruh. TV λ≈0,7 (awet, brand), digital λ≈0,3 (cepat hilang, respons langsung).",
        "Worked: spend Rp10jt hanya di minggu 1. A1=10; A2=0+0,7×10=7; A3=0+0,7×7=Rp4,9jt. Di minggu 3, separuh efek masih ada — inilah yang ROI jangka pendek tidak tangkap (tragedi RasaNusa).",
        "Saturasi Hill: S(x) = x^a/(x^a+k^a) — BENTUKNYA TERGANTUNG a: untuk a=1, rupiah pertama paling produktif lalu melandai; untuk a=2 (yang dipakai lesson ini), dS/dx di x=0 adalah 0 — kurva berbentuk-S: naik dulu hingga maksimum di x=k/√3, baru melandai. “Rupiah pertama paling produktif” SALAH untuk a>1. Kombinasi adstock + Hill = bentuk respons iklan yang realistis.",
      ],
      formula: String.raw`A_t = s_t + \lambda A_{t-1} \qquad S(x) = \frac{x^a}{x^a + k^a}`,
      formulaNote: "Adstock: A_t = stok iklan periode t; s_t = spend periode t; lambda = carryover (0-1): TV ~0,7 (awet), digital ~0,3 (cepat hilang). Saturasi Hill: S(x) = respons jenuh; x = adstock; a = kecuraman (biasanya 2 — dan ingat: dengan a=2 kurva berbentuk-S, bukan diminishing returns sejak rupiah pertama; hanya a≤1 yang melandai sejak awal); k = titik tengah saturasi (spend di mana respons setengah maksimum). Kombinasinya = bentuk respons iklan yang realistis: menumpuk lalu melandai.",
      tasks: [
        { id: "t1", text: "Hitung deret `A` (adstock) dari `spend` dengan λ=0,7" },
        { id: "t2", text: "Hitung `hill` = saturasi dari A[0] (eksponen 2, k=Rp5jt), cetak" },
      ],
      expected: "A3=4900000 hill=0.80",
      hints: [
        "Loop: a = s + lam*a; A.append(a). Mulai a=0.",
        "A = [10jt, 7jt, 4,9jt, 8,43jt].",
        "hill = A0**2 / (A0**2 + k**2) = 0,8.",
      ],
      code: {
        starter: `spend = [10_000_000, 0, 0, 5_000_000]\nlam = 0.7\nk = 5_000_000\n\n# TULIS KODEMU: deret adstock, lalu saturasi Hill dari A[0]\nA = []\na = 0\nfor s in spend:\n    a =\n    A.append(a)\nhill =\n\nprint(f"A3={A[2]:.0f} hill={hill:.2f}")`,
        lockLines: 6,
        solution: `spend = [10_000_000, 0, 0, 5_000_000]\nlam = 0.7\nk = 5_000_000\n\n# TULIS KODEMU: deret adstock, lalu saturasi Hill dari A[0]\nA = []\na = 0\nfor s in spend:\n    a = s + lam * a\n    A.append(a)\nhill = A[0]**2 / (A[0]**2 + k**2)\n\nprint(f"A3={A[2]:.0f} hill={hill:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "A", value: [10000000.0, 7000000.0, 4900000.0, 8430000.0], tol: 1, label: "`A` seharusnya [10jt, 7jt, 4,9jt, 8,43jt]", msg: "0 + 0,7 × 7jt = 4,9jt. Efek minggu 1 masih separuh di minggu 3." },
          { kind: "equal", task: "t2", name: "hill", value: 0.8, tol: 1e-9, label: "`hill` seharusnya 0,8", msg: "(1e7)² / ((1e7)² + (5e6)²) = 0,8." },
          { kind: "stdout_matches", task: "t2", pattern: "A3=4900000", label: "`print` menampilkan A3", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Adstock = carryover. Hill = diminishing return.",
    },
    {
      id: "marginal-roi",
      eyebrow: "Langkah 4 · Alokasi marginal",
      title: "Samakan marginal ROI, bukan rata-rata",
      prose: [
        "Alokasi optimal: geser budget sampai marginal ROI semua channel sama. Channel dengan ROI rata-rata 3 tapi marginal 0,5 = sudah jenuh, jangan tambah. Channel ROI rata-rata 1,5 tapi marginal 2 = lapar, tambah.",
        "Inilah kesalahan RasaNusa versi lain: TV ROI rata-rata 0,8 terlihat buruk, tapi marginal-nya untuk brand-building jangka panjang tidak terukur di situ. Rata-rata menipu dua arah.",
        "Praktik: baca kurva respons (Hill) per channel, alokasikan ke marginal tertinggi, sisakan 10% eksperimen (MK1/MK9: bandit mindset).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengalokasikan by ROI rata-rata. Yang menentukan \u201Crupiah berikutnya ke mana\u201D adalah marginal — rata-rata hanya menceritakan masa lalu.",
        type: "pitfall",
      },
      reference: "Alokasi = samakan marginal ROI. Rata-rata menipu.",
    },
    {
      id: "bayesian-kalibrasi",
      eyebrow: "Langkah 5 · Bayesian & kalibrasi",
      title: "Prior jujur + kalibrasi eksperimen = MMM yang dipercaya",
      prose: [
        "MMM modern = Bayesian: prior (pengetahuan bisnis: \u201CTV tidak mungkin ROI 50\u201D) + data → posterior. Prior mencegah model menghasilkan angka gila dari data yang berisik.",
        "Kalibrasi eksperimen wajib: hasil MMM harus cocok dengan lift dari geo-experiment (MK10). Kalau MMM bilang TV ROI 3 tapi eksperimen bilang 0,8 — percayai eksperimen, perbaiki MMM-nya. Eksperimen = jangkar kebenaran.",
        "Syarat data: variasi spend antar-waktu/region. Spend datar 3 tahun = tidak ada informasi — MMM hanya mengarang. Jangan pesan MMM sebelum memastikan variasinya cukup.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Omitted variable: tanpa kontrol yang benar, efek musiman/harga terserap ke channel dan MMM memuji channel yang salah. Selalu tanyakan \u201Cvariabel apa yang belum dikontrol?\u201D",
        type: "risk",
      },
      reference: "Bayesian + kalibrasi eksperimen. Butuh variasi spend.",
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
          q: "Spend Rp10jt di minggu 1 saja, λ=0,7. Adstock minggu 3?",
          options: [
            { text: "Rp4,9jt", why: "A2=7jt, A3=0,7×7jt=4,9jt. Efek meluruh, tidak hilang.", correct: true },
            { text: "Rp0 — sudah lewat", why: "Itu asumsi ROI jangka pendek yang membunuh TV RasaNusa." },
            { text: "Rp10jt — efek abadi", why: "λ<1 = meluruh. Abadi hanya jika λ=1." },
          ],
        },
        {
          q: "Channel A ROI rata-rata 3, marginal 0,5; B rata-rata 1,5, marginal 2. Tambah budget ke?",
          options: [
            { text: "B — marginal yang menentukan rupiah berikutnya", why: "A sudah jenuh (0,5); B lapar (2).", correct: true },
            { text: "A — rata-ratanya lebih tinggi", why: "Rata-rata = masa lalu. Marginal = masa depan." },
            { text: "Bagi rata", why: "Sama dengan mengabaikan informasi marginal." },
          ],
        },
        {
          q: "MMM bilang ROI 3, geo-experiment bilang 0,8. Yang dipercaya?",
          options: [
            { text: "Eksperimen — ia jangkar kebenaran; perbaiki MMM", why: "Kausal mengalahkan observasional — pada umumnya, bila eksperimennya dirancang baik. “Selalu” terlalu mutlak: eksperimen punya ketidakpastian, desain, dan horizon yang berbeda, dan satu geo-test kecil tidak otomatis mengalahkan MMM yang terkalibrasi baik.", correct: true },
            { text: "MMM — lebih canggih", why: "Canggih ≠ benar. Tanpa kalibrasi, MMM = dongeng mahal." },
            { text: "Rata-rata keduanya", why: "Tidak ada dasarnya." },
          ],
        },
      ],
    },
    {
      id: "adv-kalibrasi-mmm",
      eyebrow: "Langkah 7 · Kalibrasi eksperimen",
      title: "Jangkar kebenaran: mengunci MMM dengan angka eksperimen",
      prose: [
        "MMM tanpa kalibrasi = kurva yang dicocokkan ke data observasional — ia bisa 'menjelaskan' masa lalu dengan sempurna sambil salah total tentang masa depan. Kalibrasi = memaksa MMM setuju dengan angka eksperimen. Caranya: (1) jalankan geo-experiment untuk satu channel (mis. TV lift +Rp800jt); (2) jadikan itu prior informatif atau constraint: kontribusi TV di MMM harus dalam rentang Rp600jt–Rp1M; (3) jika MMM bersikeras TV = Rp3M, MMM-nya yang salah — perbaiki, jangan abaikan eksperimen.",
        "Worked RasaNusa: MMM bilang TV ROI 0,8 → potong. Geo test kemudian (terlambat!) menunjukkan TV inkremental ROI 1,9 dalam 6 bulan via adstock. Dengan kalibrasi sejak awal, MMM akan dipaksa memasukkan carryover yang benar — dan keputusan potong tidak pernah terjadi.",
        "Aturan: tidak ada MMM yang dipakai untuk keputusan sebelum minimal satu channel terkalibrasi eksperimen. Satu jangkar lebih baik dari nol; dua-tiga jangkar = MMM yang bisa dipercaya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "MMM bilang TV ROI 0,8; geo-experiment bilang 1,9. Yang dipakai untuk keputusan?",
          options: [
            { text: "1,9 — eksperimen adalah jangkar; MMM harus dikalibrasi ulang", why: "Kausal mengalahkan observasional — dengan catatan: satu eksperimen bukan vonis akhir; kalibrasi = paksa MMM setuju dengan angka eksperimen, lalu uji lagi. MMM yang menolak kalibrasi = dongeng mahal.", correct: true },
            { text: "0,8 — MMM lebih komprehensif", why: "Komprehensif tapi salah = komprehensif menyesatkan." },
            { text: "Rata-rata 1,35", why: "Tidak ada dasar; mencampur kausal dan observasional." },
            { text: "Yang lebih baru", why: "Kebaruan bukan kriteria kebenaran." },
          ],
        },
        {
          q: "Syarat minimal sebelum MMM dipakai untuk keputusan budget?",
          options: [
            { text: "Minimal satu channel terkalibrasi eksperimen", why: "Tanpa jangkar, MMM = kurva yang cocok ke masa lalu.", correct: true },
            { text: "Data 3 tahun", why: "Panjang tanpa variasi dan kalibrasi = 36 bulan mengarang." },
            { text: "Konsultan mahal", why: "Harga konsultan bukan validasi." },
            { text: "R-squared di atas 0,9", why: "R² tinggi di data observasional mudah dicapai dan tidak menjamin kausalitas." },
          ],
        },
      ],
      reference: "Kalibrasi = paksa MMM setuju dengan eksperimen. Tanpa jangkar, jangan pakai.",
    },
    {
      id: "adv-struktur-waktu",
      eyebrow: "Langkah 8 · Struktur waktu",
      title: "Lambda bukan angka mati: mengestimasi carryover dengan jujur",
      prose: [
        "Adstock memakai satu lambda per channel — tetapi lambda = asumsi tentang ingatan manusia. TV lambda 0,7 vs 0,4 mengubah total kontribusi TV hingga 2x lipat. Jika lambda 'dipilih' agar MMM terlihat bagus, seluruh dekomposisi = sirkular.",
        "Cara jujur: (1) estimasi lambda dari data via grid search dengan validasi (bukan in-sample fit); (2) batasi dengan pengetahuan kategori (TV 0,5–0,8; digital 0,2–0,4; OOH 0,6–0,8); (3) uji sensitivitas: laporkan kontribusi TV pada lambda 0,5, 0,7, 0,9 — jika keputusan berubah, keputusan belum solid.",
        "Jebakan lanjutan: adstock geometris mengasumsikan efek puncak di minggu tayang lalu meluruh. Untuk TV brand-building, efek puncak bisa 2–4 minggu SETELAH tayang (delayed peak) — butuh struktur lag, bukan adstock murni. Model yang salah struktur waktunya = salah mengatribusikan kapan efek terjadi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Lambda TV diubah 0,4 → 0,7 dan kontribusi TV berlipat 2x. Masalahnya?",
          options: [
            { text: "Hasil tergantung asumsi yang tidak divalidasi — laporkan sensitivitas, jangan satu angka", why: "Keputusan yang berubah karena lambda = keputusan yang belum solid.", correct: true },
            { text: "Tidak masalah — pilih yang terbesar", why: "Memilih lambda agar hasil bagus = sirkular." },
            { text: "Pakai 0,55 tengah-tengah", why: "Tengah-tengah tanpa dasar = asumsi yang dirapikan." },
            { text: "Lambda tidak penting", why: "2x lipat kontribusi = sangat penting." },
          ],
        },
      ],
      reference: "Estimasi lambda via validasi; batasi by kategori; uji sensitivitas.",
    },
    {
      id: "lab-alokasi-marginal",
      eyebrow: "Langkah 9 · Lab alokasi",
      title: "Lab: Rp100 juta berikutnya ke mana? (marginal ROI)",
      prose: [
        "Dua channel dengan kurva Hill masing-masing. Di lab ini kamu menghitung marginal ROI di spend saat ini — dan memutuskan ke mana Rp100 juta tambahan pergi. CATATAN: marginal di SATU titik tidak memutuskan alokasi Rp100jt sekaligus — untuk alokasi yang boleh dibagi, marginal berubah sepanjang penambahan dan perlu optimasi ulang. Hitung all-in sebagai pembanding: TV +Rp47,65jt vs Digital +Rp112,17jt (all-in Rp100jt ke satu channel) — Digital tetap menang all-in, tetapi alokasi optimal yang dibagi bisa berbeda dari “semua ke pemenang marginal”. Putusan lab ini = “mulai dari Digital”, bukan “Rp100jt penuh ke Digital tanpa pikir ulang”.",
        "Coba: naikkan spend TV menjadi Rp600jt. Pada titik mana TV menjadi jenuh dan Digital menang? (Itulah gunanya membaca kurva, bukan rata-rata.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `marg` = marginal ROI tiap channel (h = Rp1jt), lalu `marg_tv` = marg['TV']" },
        { id: "t2", text: "Tentukan `pemenang` = channel marginal tertinggi, cetak" },
      ],
      expected: "pemenang=Digital marg_TV=0.57 marg_Digital=1.78",
      hints: [
        "def respons(spend, vmax, a, k): return vmax * spend**a / (spend**a + k**a).",
        "marg = (respons(spend+h) - respons(spend)) / h.",
        "TV: 0,57 (jenuh); Digital: 1,78 (lapar) → pemenang Digital.",
      ],
      code: {
        starter: `def respons(spend, vmax, a, k):
    return vmax * spend**a / (spend**a + k**a)

# (vmax, a, k, spend_saat_ini) — Rp
channels = {
    "TV":      (500_000_000, 2, 300_000_000, 400_000_000),
    "Digital": (300_000_000, 2, 100_000_000, 80_000_000),
}
h = 1_000_000

# TULIS KODEMU: marginal ROI tiap channel + pemenang
marg = {}
for nama, (vmax, a, k, spend) in channels.items():
    marg[nama] =
pemenang =

print(f"pemenang={pemenang} marg_TV={marg['TV']:.2f} marg_Digital={marg['Digital']:.2f}")`,
        lockLines: 9,
        solution: `def respons(spend, vmax, a, k):
    return vmax * spend**a / (spend**a + k**a)

# (vmax, a, k, spend_saat_ini) — Rp
channels = {
    "TV":      (500_000_000, 2, 300_000_000, 400_000_000),
    "Digital": (300_000_000, 2, 100_000_000, 80_000_000),
}
h = 1_000_000

# TULIS KODEMU: marginal ROI tiap channel + pemenang
marg = {}
for nama, (vmax, a, k, spend) in channels.items():
    marg[nama] = (respons(spend + h, vmax, a, k) - respons(spend, vmax, a, k)) / h
marg_tv = marg["TV"]\npemenang = max(marg, key=marg.get)

print(f"pemenang={pemenang} marg_TV={marg['TV']:.2f} marg_Digital={marg['Digital']:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "marg_tv", value: 0.57, tol: 0.02, label: "`marg['TV']` sekitar 0,57", msg: "TV sudah jenuh — rupiah berikutnya tidak produktif." },
          { kind: "equal", task: "t2", name: "pemenang", value: "Digital", label: "`pemenang` seharusnya Digital", msg: "Marginal 1,78 > 0,57. Rp100jt berikutnya ke Digital." },
          { kind: "stdout_matches", task: "t2", pattern: "pemenang=Digital", label: "`print` menampilkan pemenang", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Alokasi by marginal, bukan rata-rata. Baca kurva Hill.",
    },
    {
      id: "intuisi-neraca",
      eyebrow: "Langkah 10 · Intuisi",
      title: "MMM yang baik merendah; MMM yang buruk meyakinkan",
      prose: [
        "MMM Rp2 miliar membunuh brand RasaNusa bukan karena matematikanya salah, melainkan karena tidak ada yang bertanya 'seberapa yakin kita?' Tiga heuristik menjaga kerendahan itu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: MMM adalah neraca — setiap rupiah harus bisa dijelaskan, dan penjelasan butuh variasi",
        body: "Heuristik pertama: tidak ada variasi, tidak ada MMM. Spend datar Rp1M/bulan selama 3 tahun = 36 bulan informasi yang sama — model hanya mengarang dengan percaya diri. Sebelum memesan MMM, tanya: di mana variasinya? Beda spend antar-kota, jeda kampanye, eksperimen yang disengaja. Tanpa variasi, Rp2 miliar konsultan membeli narasi, bukan pengukuran. Heuristik kedua: curigai MMM yang terlalu yakin. MMM yang baik melaporkan rentang ('TV ROI 1,2–2,1 tergantung lambda') bukan titik ('TV ROI 1,63'). Presisi palsu adalah tanda bahaya: ia berarti ketidakpastian disembunyikan, bukan diukur. Minta selalu: sensitivitas terhadap lambda, terhadap kontrol yang dimasukkan, terhadap periode data. Jika angka tidak bergerak saat asumsi digoyang, modelnya kaku — dan kekakuan bukan kekuatan. Heuristik ketiga: kalibrasi adalah harga kepercayaan. Satu geo-experiment untuk satu channel mengubah MMM dari 'opini mahal' menjadi 'alat keputusan'. Tanpa jangkar eksperimen, MMM = dongeng yang konsisten — dan dongeng yang konsisten inilah yang membunuh TV RasaNusa. Aturan praktis: 10% budget riset untuk eksperimen kalibrasi menghemat 90% risiko salah alokasi.",
      },
      reference: "Variasi dulu; laporkan rentang; kalibrasi = harga kepercayaan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 11 · Peta keputusan",
      title: "Peta keputusan: MMM yang merendah dan bisa dipercaya",
      prose: [
        "Skenario satu — sebelum percaya MMM: kalibrasi dengan eksperimen (geo test TV 12 kota → lift Rp1,6M). Kontribusi channel di MMM dipaksa masuk rentang eksperimen — seperti RasaNusa yang membangun ulang.",
        "Skenario dua — adstock dan saturasi: modelkan carryover (lambda 0,7) dan diminishing return. Tanpa keduanya, MMM menyarankan 'tambah terus' sampai budget habis.",
        "Skenario tiga — alokasi budget: pakai ROI marginal, bukan rata-rata. Pindahkan rupiah ke channel dengan marginal ROI tertinggi sampai semua marginal setara.",
        "Skenario empat — base sales 60%: jangan klaim semua penjualan sebagai hasil marketing. Pisahkan base (musiman, tren, distribusi) dulu — sisanya baru diperdebatkan antar channel.",
        "Skenario lima — horizon keputusan: ROI 8 minggu (0,8) vs 6 bulan (1,9) adalah cerita berbeda. Tentukan horizon sebelum membaca angka — kalau tidak, setiap orang memilih horizon yang mendukung anggarannya.",
        "Aturan praktis 10 detik: dikalibrasi eksperimen? Base vs inkremental dipisah? Alokasi dari marginal ROI? Horizon disepakati di muka? Interval keyakinan dilaporkan, bukan titik?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai MMM sebagai mesin pembenaran budget. MMM yang tidak melaporkan ketidakpastian ('TV ROI 2,34') lebih berbahaya daripada tidak punya MMM — presisi palsu mematikan diskusi yang seharusnya terjadi.",
      },
      reference: "Kalibrasi eksperimen → pisahkan base → alokasi via marginal ROI → laporkan interval.",
    },
    {
      id: "minicase-rasanusa2",
      eyebrow: "Langkah 12 · Mini-case",
      title: "RasaNusa, bagian 2: membangun kembali dengan kalibrasi",
      prose: [
        "Dua tahun setelah tragedi, RasaNusa membangun MMM baru — dengan disiplin. Data: base sales 60% (Rp6M dari Rp10M), TV spend Rp2M/tahun, digital Rp3M/tahun. Langkah 1: geo-experiment TV di 12 kota → lift inkremental Rp1,6M (ROI 0,8 jangka 8 minggu, tetapi 1,9 dalam 6 bulan via adstock lambda 0,7). Langkah 2: MMM dikalibrasi — kontribusi TV dipaksa dalam rentang eksperimen. Langkah 3: uji sensitivitas lambda 0,5/0,7/0,9 → keputusan 'pertahankan TV' solid di semua skenario.",
        "Hasil: alokasi baru — TV dipertahankan Rp2M (brand), digital Rp3M dengan realokasi marginal tiap kuartal, 10% budget untuk eksperimen kalibrasi berjalan. Setahun kemudian: awareness pulih +9 poin, sales +5%.",
        "Pertanyaan: (1) Apa yang berbeda dari MMM pertama? (2) Mengapa ROI 0,8 delapan-mingguan tidak memicu pemotongan kali ini? (3) Berapa 'harga' kalibrasi vs nilai yang diselamatkan?",
        "Pembahasan: (1) Jangkar eksperimen + sensitivitas + disiplin variasi — bukan model yang lebih canggih. (2) Karena adstock: ROI 6-bulanan 1,9 > 1; horizon pengukuran disesuaikan dengan lambda channel. (3) Geo test ~Rp300jt vs brand awareness −15 poin + sales −8% (miliaran rupiah) — kalibrasi adalah asuransi termurah.",
      ],
      tasks: [],
      quiz: [
        {
          q: "RasaNusa 2: TV ROI 0,8 (8 minggu) tetapi dipertahankan. Kenapa benar?",
          options: [
            { text: "Adstock lambda 0,7 → ROI 6-bulanan 1,9; horizon disesuaikan dengan sifat channel", why: "Menghakimi TV brand-building dengan horizon digital = kategori error.", correct: true },
            { text: "0,8 sudah cukup bagus", why: "0,8 < 1 = merugi jangka pendek; argumennya horizon, bukan angkanya." },
            { text: "Direksi suka TV", why: "Keputusan by data kalibrasi, bukan preferensi." },
            { text: "MMM pertama sudah benar", why: "MMM pertama tanpa kalibrasi = yang menyebabkan tragedi." },
          ],
        },
        {
          q: "Pelajaran umum: kapan MMM boleh dipercaya untuk keputusan?",
          options: [
            { text: "Ada variasi spend + minimal satu jangkar eksperimen + uji sensitivitas lolos", why: "Tiga syarat RasaNusa 2 — tidak ada yang opsional.", correct: true },
            { text: "Konsultan Big Four yang mengerjakan", why: "Brand konsultan bukan validasi metodologis." },
            { text: "R-squared > 0,95", why: "Fit in-sample tidak menjamin kebenaran kausal." },
            { text: "Datanya 5 tahun", why: "Panjang tanpa variasi/kalibrasi = mengarang lebih lama." },
          ],
        },
      ],
      reference: "Kalibrasi + sensitivitas + variasi = MMM yang dipercaya.",
    },
        {
          id: "gap-r7-roi-horizon",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P9-G1)",
          title: "ROI tanpa horizon: membandingkan yang tak sebanding",
          prose: [
            "Lesson ini sudah menceritakan tragedi RasaNusa — TV dipotong karena ROI jangka pendeknya rendah, padahal ia membangun brand yang baru terlihat setahun kemudian — tetapi belum pernah menunjukkan ANGKA yang membuat jebakan itu terlihat. Lab ini menunjukkannya. Spend Rp100 jt per channel; lift penjualan inkremental: TV 8 minggu Rp40 jt, Digital 8 minggu Rp120 jt; TV 6 bulan Rp180 jt, Digital 6 bulan Rp150 jt. ROI 8 minggu: TV 0,4 vs Digital 1,2 — Digital menang telak. ROI 6 bulan: TV 1,8 vs Digital 1,5 — TV menang. Pemenangnya BERBALIK hanya karena horizonnya berubah.",
            "Penyebabnya: efek carryover (adstock) TV — dengan θ = 0,7/minggu dari lesson ini, sebagian besar efek TV mendarat SETELAH minggu ke-8, sementara Digital hampir semua efeknya langsung. Membandingkan 'ROI TV 8 minggu' dengan 'ROI Digital 6 bulan' berarti membandingkan balapan yang satu sudah selesai dengan yang satu baru setengah jalan. Aturan: (1) samakan horizon SEBELUM membandingkan (jendela yang sama untuk semua channel); (2) bila horizon harus berbeda, anualisasikan atau laporkan kurva ROI per horizon, bukan satu angka; (3) ROI harus memakai lift INKREMENTAL (vs baseline tanpa iklan), bukan penjualan mentah — dan pisahkan efek jangka pendek (aktivasi) dari jangka panjang (brand). Satu angka ROI tanpa horizon = satu angka tanpa makna.",
          ],
          formula: String.raw`\text{ROI}_{h} = \frac{\text{lift inkremental dalam horizon } h}{\text{spend}} \qquad \text{bandingkan hanya pada } h \text{ yang sama}`,
          formulaNote: "Spend Rp100 jt/channel: ROI 8 mgg TV 0,4 vs Digital 1,2; ROI 6 bln TV 1,8 vs Digital 1,5 — pemenang berbalik karena carryover TV.",
          tasks: [
            { id: "t1", text: "Hitung ROI 8 minggu: `roi_tv_8mgg`, `roi_digital_8mgg`" },
            { id: "t2", text: "Hitung ROI 6 bulan: `roi_tv_6bln`, `roi_digital_6bln`" },
          ],
          expected: "roi_tv_8mgg=0.4 roi_digital_8mgg=1.2 roi_tv_6bln=1.8 roi_digital_6bln=1.5",
          hints: [
            "ROI = lift / spend; spend Rp100 jt untuk tiap channel.",
            "Bandingkan pemenang di tiap horizon — apakah sama?",
          ],
          code: {
            starter: `# Spend Rp100 jt per channel; lift penjualan (Rp jt) per horizon\nspend = 100\nlift = {"TV_8mgg": 40, "Digital_8mgg": 120, "TV_6bln": 180, "Digital_6bln": 150}\n\n# TULIS KODEMU: ROI tiap channel per horizon + pemenang tiap horizon\nroi_tv_8mgg =\nroi_digital_8mgg =\nroi_tv_6bln =\nroi_digital_6bln =\n\nprint(f"roi_tv_8mgg={roi_tv_8mgg} roi_digital_8mgg={roi_digital_8mgg} roi_tv_6bln={roi_tv_6bln} roi_digital_6bln={roi_digital_6bln}")`,
            lockLines: 5,
            solution: `# Spend Rp100 jt per channel; lift penjualan (Rp jt) per horizon\nspend = 100\nlift = {"TV_8mgg": 40, "Digital_8mgg": 120, "TV_6bln": 180, "Digital_6bln": 150}\n\n# TULIS KODEMU: ROI tiap channel per horizon + pemenang tiap horizon\nroi_tv_8mgg = round(lift["TV_8mgg"] / spend, 1)\nroi_digital_8mgg = round(lift["Digital_8mgg"] / spend, 1)\nroi_tv_6bln = round(lift["TV_6bln"] / spend, 1)\nroi_digital_6bln = round(lift["Digital_6bln"] / spend, 1)\n\nprint(f"roi_tv_8mgg={roi_tv_8mgg} roi_digital_8mgg={roi_digital_8mgg} roi_tv_6bln={roi_tv_6bln} roi_digital_6bln={roi_digital_6bln}")`,
            checks: [
              { kind: "equal", task: "t1", name: "roi_tv_8mgg", value: 0.4, tol: 0.01, label: "`roi_tv_8mgg` = 0,4", msg: "40/100 — TV tampak buruk di 8 minggu." },
              { kind: "equal", task: "t1", name: "roi_digital_8mgg", value: 1.2, tol: 0.01, label: "`roi_digital_8mgg` = 1,2", msg: "120/100 — Digital menang di 8 minggu." },
              { kind: "equal", task: "t2", name: "roi_tv_6bln", value: 1.8, tol: 0.01, label: "`roi_tv_6bln` = 1,8", msg: "180/100 — carryover TV mendarat setelah minggu ke-8." },
              { kind: "equal", task: "t2", name: "roi_digital_6bln", value: 1.5, tol: 0.01, label: "`roi_digital_6bln` = 1,5", msg: "150/100 — Digital menang di 8 minggu, kalah di 6 bulan." },
              { kind: "stdout_matches", task: "t2", pattern: "roi_tv_8mgg=0\\.4\\s+roi_digital_8mgg=1\\.2\\s+roi_tv_6bln=1\\.8\\s+roi_digital_6bln=1\\.5", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "TV ROI 0,4 (8 minggu) vs Digital 1,2 (8 minggu); TV 1,8 vs Digital 1,5 (6 bulan). Keputusan yang benar?",
              options: [
                { text: "Tidak ada pemenang mutlak — samakan horizon dulu; di 8 minggu Digital menang, di 6 bulan TV menang (carryover)", why: "Tepat: ROI tanpa horizon tidak sebanding. Inilah tragedi RasaNusa dalam angka — memotong TV karena ROI 8 minggunya rendah.", correct: true },
                { text: "Digital menang — ROI 1,2 > 0,4 sudah cukup sebagai bukti", why: "Salah: itu hanya horizon 8 minggu. Di 6 bulan TV 1,8 > 1,5 — keputusan berdasarkan satu horizon menyesatkan." },
                { text: "TV menang — 1,8 adalah ROI tertinggi dari semuanya", why: "Salah: 1,8 (6 bulan) tidak sebanding dengan 1,2 (8 minggu). Bandingkan hanya pada horizon yang sama." },
                { text: "Rata-ratakan saja: TV 1,1 vs Digital 1,35 — Digital menang", why: "Salah: merata-rata ROI lintas horizon menghasilkan angka tanpa makna — seperti merata-rata kecepatan dengan jarak tempuh." },
              ],
            },
          ],
          reference: "ROI WAJIB disertai horizon; samakan horizon sebelum membandingkan (atau anualisasikan); lift harus inkremental. Di sini pemenang berbalik: Digital (8 mgg) vs TV (6 bln).",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. MMM = alat alokasi yang kuat — jika dikalibrasi dengan jujur.",
      ],
      tasks: [],
      summary: [
        "Dekomposisi: base (~60%) + channel via adstock+saturasi + kontrol.",
        "Adstock A_t = s_t + λA_{t−1}; TV λ≈0,7, digital ≈0,3.",
        "Saturasi Hill; alokasi by marginal ROI, bukan rata-rata.",
        "Bayesian + kalibrasi eksperimen wajib; eksperimen = jangkar.",
        "Butuh variasi spend; waspadai omitted variable.",
        "Kalibrasi eksperimen wajib: paksa MMM setuju dengan jangkar kausal.",
        "Lambda diestimasi via validasi + uji sensitivitas; sesuaikan horizon dengan channel.",
      ],
      next: { label: "MK14 — Pricing", href: "/v2/learn/mk14-pricing" },
      quiz: [
        {
          q: "Kenapa memotong TV by ROI 0,8 menghancurkan RasaNusa?",
          options: [
            { text: "ROI jangka pendek tidak menangkap adstock & efek brand jangka panjang", why: "λ=0,7: efek menumpuk berminggu-minggu. Potong = bunuh masa depan.", correct: true },
            { text: "ROI 0,8 sebenarnya bagus", why: "0,8 < 1 = merugi jangka pendek; masalahnya horizon pengukurannya." },
            { text: "Konsultan salah hitung", why: "Hitungannya mungkin benar untuk jangka pendek — kesalahannya horizon." },
          ],
        },
        {
          q: "Base sales 60%. Implikasinya untuk klaim channel?",
          options: [
            { text: "Maksimal 40% yang diperebutkan; klaim \u201C100% dari iklan\u201D gugur", why: "60% terjadi tanpa iklan. Atribusi yang mengklaim semua = bohong.", correct: true },
            { text: "Iklan tidak penting", why: "40% tetap besar — hanya tidak 100%." },
            { text: "Base harus dihilangkan", why: "Base = realitas bisnis, bukan musuh." },
          ],
        },
        {
          q: "Spend TV datar Rp1M/bulan selama 3 tahun. Bisakah MMM mengukur efek TV?",
          options: [
            { text: "Tidak — tanpa variasi, tidak ada informasi untuk diestimasi", why: "Model butuh variasi untuk memisahkan sinyal. Datar = mengarang.", correct: true },
            { text: "Bisa — data 3 tahun cukup", why: "Panjang tanpa variasi = 36x informasi yang sama." },
            { text: "Bisa dengan prior kuat", why: "Prior bukan pengganti data; ia hanya menstabilkan." },
          ],
        },
        {
          q: "Fungsi prior dalam MMM Bayesian?",
          options: [
            { text: "Mencegah angka gila dari data berisik (\u201CTV ROI 50\u201D)", why: "Prior = pengetahuan bisnis yang menambatkan model.", correct: true },
            { text: "Mempercepat komputasi", why: "Bukan tujuan utamanya." },
            { text: "Menggantikan data", why: "Terbalik: prior melengkapi, bukan menggantikan." },
          ],
        },
        {
          q: "Omitted variable dalam MMM contohnya?",
          options: [
            { text: "Tidak mengontrol harga promo — efeknya terserap ke channel", why: "Channel dipuji atas kerja kalender/harga. Bias klasik.", correct: true },
            { text: "Terlalu banyak channel", why: "Itu soal kompleksitas, bukan omitted variable." },
            { text: "Data terlalu panjang", why: "Bukan masalah." },
          ],
        },
      ],
    },
  ],
};
