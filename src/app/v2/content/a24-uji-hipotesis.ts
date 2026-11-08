import type { V2Lesson } from "../lib/types";

export const a24: V2Lesson = {
  slug: "a24-uji-hipotesis",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.4 Uji Hipotesis: Logika Pengadilan Data",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-esp",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Obat yang terbukti manjur — ternyata ESP",
      prose: [
        "Tahun 2011, psikolog Daryl Bem menerbitkan 'Feeling the Future' di Journal of Personality and Social Psychology — sembilan eksperimen yang mengklaim menemukan ESP (precognition, kemampuan melihat masa depan) dengan hasil signifikan (p < 0,05). Para psikolog mencoba mereplikasi — di antaranya Ritchie, Wiseman & French (2012) — dan gagal. Penelusuran menemukan: peneliti menguji banyak sekali analisis dan hanya melaporkan yang berhasil. Dengan 20 uji pada α = 5%, peluang setidaknya satu tampak signifikan murni karena kebetulan sudah 64% — sesuatu pasti terlihat signifikan bila cukup banyak dicoba.",
        "p < 0,05 tidak berarti 95% peluang klaim ini benar. Ia berarti sesuatu yang jauh lebih sempit — dan memahami perbedaannya adalah garis antara analis yang tajam dan analis yang tertipu oleh angkanya sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `peluang` = 1 − 0,95^20 (peluang ≥1 false positive dari 20 uji), bulatkan 2 desimal" },
      ],
      expected: "peluang=0.64",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dari 20 uji dengan semua H0 benar, peluang MUNCULNYA setidaknya satu false positive adalah 64% — tetapi itu BUKAN peluang bahwa satu temuan signifikan tertentu adalah palsu. Peluang temuan tertentu palsu (false discovery rate) bergantung pada berapa banyak efek yang benar-benar ada (base rate) dan power studinya: bila sebagian besar hipotesis yang diuji memang benar, sebagian besar temuan signifikan bisa benar meski peluang ≥1 false positive tinggi. Jangan rayakan temuan sebelum koreksi multiple testing (A2.8) atau replikasi independen.",
      },
      hints: [
        "peluang = 1 - 0.95**20.",
        "Bulatkan 2 desimal: round(..., 2).",
        "Hasilnya ≈ 0.64 — lebih dari separuh!",
      ],
      code: {
        starter: `# 20 uji pada alpha=5%, semua H0 benar\n\n# TULIS KODEMU\npeluang = \n\nprint(f"peluang={peluang}")`,
        lockLines: 1,
        solution: `# 20 uji pada alpha=5%, semua H0 benar\n\n# TULIS KODEMU\npeluang = round(1 - 0.95**20, 2)\n\nprint(f"peluang={peluang}")`,
        checks: [
          { kind: "equal", task: "t1", name: "peluang", value: 0.64, tol: 0.01, label: "`peluang` seharusnya 0.64", msg: "1 − 0,95²⁰ ≈ 64% — peluang setidaknya satu false positive dari 20 uji (bukan peluang satu temuan tertentu palsu)." },
          { kind: "stdout_matches", task: "t1", pattern: "peluang=0\\.64", label: "`print` menampilkan peluang", msg: "Format: peluang=... ." },
        ],
      },
      reference: "p < 0,05 bukan 95% peluang klaim benar.",
    },
    {
      id: "kerangka-pengadilan",
      eyebrow: "Langkah 2 · H0, H1, statistik uji",
      title: "Pengadilan yang protektif terhadap terdakwa",
      prose: [
        "H0 (hipotesis nol): terdakwa tidak bersalah — status quo, tidak ada efek (koin adil, p = 0,5). H1: ada bukti kesalahan — klaim yang ingin dibuktikan. Statistik uji: barang bukti — satu angka ringkasan (z = (x̄ − μ0)/SE). Keputusan: tolak H0 jika p < α; jika tidak, gagal menolak H0.",
        "Contoh: 100 lemparan, 61 head. H0: p = 0,5 vs H1: p ≠ 0,5. z = (0,61 − 0,5)/0,05 = 2,2; p-value dua sisi ≈ 0,028 < 0,05 → tolak H0. Catatan: tolak H0 bukan H1 terbukti 100% — masih ada 5% risiko Tipe I yang diterima di awal. Gagal menolak H0 bukan berarti H0 benar — hanya buktinya kurang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `z` = (0,61 − 0,5)/0,05" },
        { id: "t2", text: "Hitung `p_value` dua sisi dari z memakai erf, bulatkan 3 desimal" },
      ],
      expected: "z=2.2  p_value=0.028",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Gagal menolak H0 berarti H0 benar. Salah — tidak terbukti bersalah bukan terbukti tidak bersalah. Uji hipotesis tidak pernah membuktikan H1; ia hanya mengukur apakah data tidak konsisten dengan H0.",
      },
      hints: [
        "z = round((0.61 - 0.5) / 0.05, 2).",
        "p dua sisi = 2*(1 - 0.5*(1+math.erf(z/math.sqrt(2)))).",
        "Bulatkan 3 desimal.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\nz = \np_value = \n\nprint(f"z={z}  p_value={p_value}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\nz = round((0.61 - 0.5) / 0.05, 2)\np_value = round(2*(1 - 0.5*(1 + math.erf(z/math.sqrt(2)))), 3)\n\nprint(f"z={z}  p_value={p_value}")`,
        checks: [
          { kind: "equal", task: "t1", name: "z", value: 2.2, tol: 1e-9, label: "`z` seharusnya 2.2", msg: "(0,61 − 0,5)/0,05 = 2,2." },
          { kind: "equal", task: "t2", name: "p_value", value: 0.028, tol: 0.001, label: "`p_value` seharusnya 0.028", msg: "p dua sisi ≈ 0,028 < 0,05 → tolak H0." },
          { kind: "stdout_matches", task: "t2", pattern: "z=2\\.2\\s+p_value=0\\.028", label: "`print` menampilkan keduanya", msg: "Format: z=...  p_value=... ." },
        ],
      },
      reference: "H0 harus spesifik dan bisa salah. Tolak H0 ≠ H1 terbukti.",
    },
    {
      id: "pvalue-makna",
      eyebrow: "Langkah 3 · Makna p-value",
      title: "Angka paling disalahpahami dalam sains",
      prose: [
        "p-value = P(data seekstrem ini | H0 benar) — peluang, dengan asumsi H0 benar, memperoleh statistik uji sama ekstrem atau lebih ekstrem dari yang teramati. Untuk koin tadi: p = 0,028 berarti jika koin adil, peluang melihat hasil seekstrem 61 head hanya 2,8%. Ia hanya menjawab seberapa aneh data ini andaikan H0 benar — tidak menjawab apakah H0 benar, seberapa besar efeknya, atau seberapa penting temuan ini.",
        "p-value kecil = data ini aneh jika H0 benar. Dua penjelasan: (1) H0 memang salah, atau (2) kamu baru saja melihat kejadian langka (error Tipe I). Uji hipotesis memilih (1) dengan risiko (2) yang dikendalikan sebesar α. Setiap kali membaca signifikan, ingat opsi (2) selalu mengintai.",
      ],
      formula: String.raw`p = P(\text{statistik seekstrem} \mid H_0 \text{ benar})`,
      formulaNote: "p = p-value; P(.) = peluang; statistik seekstrem = nilai statistik uji sama ekstrem atau lebih ekstrem dari yang teramati; H0 = hipotesis nol yang diasumsikan benar dalam perhitungan ini.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "p = 0,03 berarti 97% peluang H1 benar. Salah — arah kondisinya terbalik! p-value = P(data|H0), bukan P(H0|data). ASA (2015) mengeluarkan pernyataan resmi: p-value bukan ukuran kebenaran hipotesis. Dan tidak ada perbedaan ilmiah antara 0,049 dan 0,051 — batas 0,05 adalah konvensi arbitrer warisan Fisher 1925.",
      },
      reference: "Laporkan p-value beserta effect size dan intervalnya; 0,05 = sinyal, bukan vonis.",
    },
    {
      id: "error-tipe",
      eyebrow: "Langkah 4 · Error Tipe I & II",
      title: "Dua cara pengadilan salah — harganya beda",
      prose: [
        "Tipe I (false positive, peluang α): memfitnah orang tak bersalah — false alarm. Tipe II (false negative, peluang β): membebaskan penjahat — missed detection. Mana yang lebih mahal tergantung domain: di pengadilan, Tipe I jauh lebih buruk; di skrining kanker, Tipe II (kanker terlewat) jauh lebih mematikan.",
        "Contoh: uji obat α = 5%, β = 20%. Jika obat TAK manjur: dari 100 studi, ~5 signifikan palsu → 5 obat tak berguna lolos. Jika obat manjur: dari 100 studi, ~20 gagal mendeteksi → 20 obat berguna terbuang. Tidak ada uji yang gratis dari kesalahan — yang ada hanya memilih kesalahan mana yang lebih murah, lalu mendesain (n, α) sesuai itu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tipe1` = jumlah signifikan palsu dari 100 studi (α=5%, H0 benar)" },
        { id: "t2", text: "Hitung `tipe2` = jumlah gagal deteksi dari 100 studi (β=20%, H1 benar)" },
      ],
      expected: "tipe1=5  tipe2=20",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap keputusan berbasis uji membawa residu kesalahan yang diketahui besarnya — tugasmu bukan menghilangkannya (mustahil), tapi memastikan harganya bisa ditanggung bisnismu. α dipilih dari rasio biaya, bukan dogma 5%.",
      },
      hints: [
        "tipe1 = 100 * 0.05.",
        "tipe2 = 100 * 0.20.",
        "Keduanya bilangan bulat.",
      ],
      code: {
        starter: `# 100 studi, alpha=5%, beta=20%\n\n# TULIS KODEMU\ntipe1 = \ntipe2 = \n\nprint(f"tipe1={tipe1}  tipe2={tipe2}")`,
        lockLines: 1,
        solution: `# 100 studi, alpha=5%, beta=20%\n\n# TULIS KODEMU\ntipe1 = int(100 * 0.05)\ntipe2 = int(100 * 0.20)\n\nprint(f"tipe1={tipe1}  tipe2={tipe2}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tipe1", value: 5, tol: 1e-9, label: "`tipe1` seharusnya 5", msg: "5% dari 100 = 5 obat tak berguna lolos." },
          { kind: "equal", task: "t2", name: "tipe2", value: 20, tol: 1e-9, label: "`tipe2` seharusnya 20", msg: "20% dari 100 = 20 obat berguna terbuang." },
          { kind: "stdout_matches", task: "t2", pattern: "tipe1=5\\s+tipe2=20", label: "`print` menampilkan keduanya", msg: "Format: tipe1=...  tipe2=... ." },
        ],
      },
      reference: "α satu-satunya error yang kamu kendalikan langsung; β akibat desain.",
    },
    {
      id: "power",
      eyebrow: "Langkah 5 · Power",
      title: "Ketajaman radar penangkap efek",
      prose: [
        "Power = 1 − β = peluang menolak H0 ketika efeknya nyata. Standar industri: 80%. Empat faktor: effect size (efek besar → mudah ditangkap), n (n besar → SE kecil → sinyal jelas), α (α besar → lebih gampang menolak, tapi Tipe I ikut naik — tidak ada makan siang gratis), variansi data (data berisik menenggelamkan sinyal).",
        "Hasil tidak signifikan dari studi underpowered bukan bukti tidak ada efek — itu bukti radarmu tumpul. Absence of evidence is not evidence of absence. Inilah mengapa power dihitung SEBELUM studi (A2.10), bukan sesudah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Uji tidak signifikan berarti efeknya nol. Salah — tanpa cek power, hasil tidak signifikan tidak membedakan tidak ada efek dari efek ada tapi radar tumpul. Selalu tanya power studinya sebelum menyimpulkan tidak ada apa-apa.",
      },
      reference: "Power 80% adalah standar; desain (n, α) mengikuti biaya error.",
    },
    {
      id: "minicase-fraud",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Alert fraud yang terlalu rajin",
      prose: [
        "Bank AmanSentosa memasang sistem deteksi fraud. Uji 30 hari pada 10.000 transaksi: 120 ditandai; investigasi menemukan 30 fraud beneran, 90 transaksi sah terganggu. Audit: total fraud aktual = 50. Jadi sistem menangkap 30 dari 50 fraud, dan mengganggu 90 nasabah sah.",
        "(a) H0 = transaksi sah. Tipe I: 90 dari 9.950 sah ditandai → α ≈ 0,9%. Power: 30/50 = 60%; Tipe II = 40% fraud lolos (20 kasus). (b) Klaim akurasi 99% menyesatkan: akurasi = (9.860+30)/10.000 = 98,9%, tapi didominasi 9.950 transaksi sah. Yang relevan: presisi = 30/120 = 25% (1 dari 4 alert benar!) dan recall/power = 60%. (c) Jika komplain (Tipe I) 5× lebih mahal dari fraud lolos (Tipe II): ketatkan threshold — atau two-tier: skor tinggi → blokir otomatis; skor sedang → step-up authentication. Threshold optimal berasal dari rasio biaya, bukan α = 5% default.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fpr` = 90/9950 (false positive rate), bulatkan 4 desimal" },
        { id: "t2", text: "Hitung `power` = 30/50" },
        { id: "t3", text: "Hitung `presisi` = 30/120" },
      ],
      expected: "fpr=0.009  power=0.6  presisi=0.25",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Akurasi pada data imbalance adalah jebakan klasik. Metrik yang relevan untuk sistem deteksi adalah presisi dan recall — bukan akurasi. Dan threshold harus berasal dari rasio biaya error, bukan default 5%.",
      },
      hints: [
        "fpr = round(90/9950, 4).",
        "power = 30 / 50.",
        "presisi = 30 / 120.",
      ],
      code: {
        starter: `# 10.000 transaksi: 120 ditandai (30 fraud, 90 sah); fraud aktual 50\n\n# TULIS KODEMU\nfpr = \npower = \npresisi = \n\nprint(f"fpr={fpr}  power={power}  presisi={presisi}")`,
        lockLines: 1,
        solution: `# 10.000 transaksi: 120 ditandai (30 fraud, 90 sah); fraud aktual 50\n\n# TULIS KODEMU\nfpr = round(90/9950, 4)\npower = 30/50\npresisi = 30/120\n\nprint(f"fpr={fpr}  power={power}  presisi={presisi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fpr", value: 0.009, tol: 0.0001, label: "`fpr` seharusnya 0.009", msg: "90/9.950 ≈ 0,9% transaksi sah terganggu." },
          { kind: "equal", task: "t2", name: "power", value: 0.6, tol: 1e-9, label: "`power` seharusnya 0.6", msg: "30/50 = 60% fraud tertangkap; 40% lolos." },
          { kind: "equal", task: "t3", name: "presisi", value: 0.25, tol: 1e-9, label: "`presisi` seharusnya 0.25", msg: "30/120 = 25% — hanya 1 dari 4 alert yang benar." },
          { kind: "stdout_matches", task: "t3", pattern: "fpr=0\\.009\\s+power=0\\.6\\s+presisi=0\\.25", label: "`print` menampilkan ketiganya", msg: "Format: fpr=...  power=...  presisi=... ." },
        ],
      },
      reference: "Akurasi 98,9% didominasi transaksi sah — metrik yang salah untuk deteksi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "H0 = status quo; tolak H0 jika p < α; gagal menolak ≠ H0 benar.",
        "p-value = P(data seekstrem | H0) — bukan P(H1 benar).",
        "Tipe I (α): false alarm; Tipe II (β): missed detection; harganya tergantung domain.",
        "Power = 1 − β; ditentukan effect size, n, α, variansi.",
        "Hasil tidak signifikan dari studi underpowered bukan bukti tidak ada efek.",
      ],
      next: { label: "A2.5 — Uji-t & ANOVA", href: "/v2/learn/a25-uji-t-anova" },
      quiz: [
        {
          q: "p-value = 0,03. Pernyataan yang TEPAT?",
          options: [
            { text: "Ada 97% peluang hipotesis alternatif benar", why: "Arah kondisinya terbalik — p-value = P(data|H0), bukan P(H0|data)." },
            { text: "Jika H0 benar, peluang melihat data seekstrem ini hanya 3%", why: "Definisi tepat p-value.", correct: true },
            { text: "Ada 3% peluang H0 benar", why: "p-value tidak memberi peluang hipotesis benar — itu butuh Bayes." },
            { text: "Efeknya pasti besar dan penting", why: "p-value tidak bilang seberapa besar efeknya, apalagi seberapa penting." },
          ],
        },
        {
          q: "Uji obat dengan α = 5% menghasilkan p = 0,08. Kesimpulan tepat?",
          options: [
            { text: "Obat terbukti tidak manjur", why: "Gagal menolak ≠ menerima H0." },
            { text: "Gagal menolak H0 — bukti kurang; bisa karena memang tak manjur ATAU power kurang", why: "Tanpa cek power, p = 0,08 tidak membedakan keduanya.", correct: true },
            { text: "Obat manjur tapi uji salah", why: "Tidak ada dasar menyimpulkan manjur dari p = 0,08." },
            { text: "Ulangi uji sampai p < 0,05", why: "Itu p-hacking — mengutak-atik sampai lolos." },
          ],
        },
        {
          q: "Sistem skrining kanker melewatkan 15% kasus kanker sebenarnya. Ini error tipe apa?",
          options: [
            { text: "Tipe I — terlalu banyak false alarm", why: "Melewatkan yang sakit = false negative, bukan false alarm." },
            { text: "Tipe II (β = 15%) — power 85%; di skrining, missed detection bisa fatal sehingga biasanya target power ≥ 90–95%", why: "Di domain nyawa, β = 15% umumnya terlalu besar.", correct: true },
            { text: "Bukan error — 85% sudah bagus", why: "15% kanker terlewat bukan hasil yang bisa diterima begitu saja." },
            { text: "Error sampling", why: "Ini error keputusan uji, bukan error sampling." },
          ],
        },
        {
          q: "Analis menguji 20 segmen pelanggan dan menemukan 1 segmen 'signifikan' (p = 0,04). Reaksi tepat?",
          options: [
            { text: "Langsung umumkan temuan ke direksi", why: "Peluang setidaknya satu false positive dari 20 uji ≈ 64% — jangan rayakan dulu." },
            { text: "Curiga: peluang ≥1 false positive dari 20 uji ≈ 64% — butuh koreksi multiple testing atau replikasi", why: "Inilah mekanisme di balik studi ESP di cerita pembuka — tetapi ingat: 64% adalah peluang munculnya ≥1 false positive, bukan peluang temuan ini palsu.", correct: true },
            { text: "Naikkan α jadi 10% agar lebih banyak temuan", why: "Itu memperparah masalah false positive." },
            { text: "Buang 19 segmen lain dari laporan", why: "Menyembunyikan uji yang gagal = cherry-picking." },
          ],
        },
        {
          q: "Manakah yang MENAIKKAN power (semua else equal)?",
          options: [
            { text: "Memperkecil α dari 5% ke 1%", why: "Itu justru menurunkan power — lebih sulit menolak H0." },
            { text: "Memperbesar n", why: "n besar → SE kecil → sinyal lebih jelas → power naik.", correct: true },
            { text: "Menambah variansi data", why: "Variansi besar menenggelamkan sinyal." },
            { text: "Menguji lebih banyak hipotesis sekaligus", why: "Banyak hipotesis butuh koreksi yang menurunkan power per uji." },
          ],
        },
      ],
      note: {
        title: "Intuisi: p-value menjawab pertanyaan yang jauh lebih sempit dari yang kamu kira",
        body: "Lima heuristik. Satu: p = 0,04 bukan berarti 96 persen peluang H1 benar — p-value dihitung dengan asumsi H0 benar, sehingga ia tidak bisa berbicara tentang peluang H1; base rate tetap berkuasa, ingat pelajaran Bayes. Dua: “gagal menolak H0” bukan vonis “H0 benar” — itu pengadilan yang kekurangan bukti, bukan pembebasan; absence of evidence is not evidence of absence. Tiga: signifikansi tanpa effect size adalah setengah cerita — dengan n raksasa, perbedaan trivial pun signifikan; selalu tanya “seberapa besar”, bukan cuma “apakah nyata”. Empat: alpha adalah harga yang kamu tetapkan sebelum melihat data — menawar sesudah melihat hasil sama dengan mengintip kartu lawan. Lima: uji terpenting adalah yang kamu rancang sebelum data datang — hipotesis yang lahir dari data yang sama dengan yang mengujinya sudah terkontaminasi sejak lahir; daftarkan rencanamu, lalu patuhi. Enam: ulangi eksperimen sebelum merayakan — satu p < 0,05 dari satu studi adalah undangan untuk replikasi, bukan sertifikat kebenaran; sains yang sehat menuntut bukti kedua.",
      },
    },
  ],
};
