import type { V2Lesson } from "../lib/types";

export const mk9: V2Lesson = {
  slug: "mk9-eksperimen",
  track: "Marketing Analytics",
  module: "Eksperimen A/B",
  title: "MK9 — Eksperimen A/B yang Benar",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-payku",
      eyebrow: "Langkah 1 · Cerita PayKu",
      title: "Tombol hijau dan peeking yang memakan korban",
      prose: [
        "PayKu menguji tombol hijau vs biru. Analisnya mengintip hasil tiap hari (peeking) dan berhenti saat p < 0,05 di hari ke-4: \u201Cmenang!\u201D Tombol hijau di-rollout. Sebulan kemudian: tidak ada bedanya.",
        "Peeking menaikkan false positive dari 5% ke ~25%: dengan 20 kali intipan, peluang minimal satu \u201Ckemenangan\u201D palsu = 1 − 0,95^20 ≈ 64% kalau tiap intip independen (praktiknya ~20–30%). Berhenti saat hijau = memilih noise yang kebetulan hijau.",
        "Aturan keras: tentukan ukuran sampel dan durasi di muka, jangan intip untuk keputusan, dan hanya baca hasil setelah sampel terpenuhi.",
      ],
      formula: String.raw`P(\text{min. 1 FP}) = 1 - (1-\alpha)^k`,
      formulaNote: "Peluang minimal satu false positive setelah k kali intip: α (alpha) = tingkat signifikansi per intipan (biasanya 0,05); k = jumlah intipan. Rumus ini mengasumsikan intipan independen (batas atas); praktiknya dengan data yang menumpuk, inflasinya ~20–30% untuk 20 intipan. Intinya: makin sering mengintip untuk berhenti, makin besar peluang 'kemenangan' palsu.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Berhenti lebih awal karena \u201Csudah signifikan\u201D. Signifikansi di tengah jalan dengan niat berhenti = p-hacking. Tetapkan n dan durasi sebelum mulai, patuhi.",
        type: "pitfall",
      },
      reference: "No peeking untuk keputusan. n dan durasi ditetapkan di muka.",
    },
    {
      id: "ukuran-sampel",
      eyebrow: "Langkah 2 · Ukuran sampel & lab",
      title: "n/grup ≈ 16σ²/MDE²",
      prose: [
        "MDE (minimum detectable effect) = efek terkecil yang peduli kamu deteksi. Makin kecil MDE, makin besar n — kuadratik: MDE separuh → n 4x lipat.",
        "Worked example: baseline conversion 10% (σ² = 0,1×0,9 = 0,09), MDE 1 poin → n/grup ≈ 16 × 0,09 / 0,01² = 14.400. Total 28.800 user. Kalau traffic-mu 1.000/hari, eksperimen butuh ~29 hari — jangan berharap hasil dalam 3 hari.",
        "Di lab ini kamu membangun kalkulator ukuran sampel. Pakai sebelum setiap eksperimen — ia menyelamatkanmu dari test yang underpowered (gagal mendeteksi efek yang sebenarnya ada).",
      ],
      formula: String.raw`n_{\text{grup}} \approx \frac{16\sigma^2}{\text{MDE}^2}`,
      formulaNote: "n_grup = ukuran sampel per grup (aturan praktis untuk α=5%, power 80%): σ² (sigma kuadrat) = variansi metrik — untuk conversion p, σ² = p(1−p); MDE = minimum detectable effect, efek terkecil yang peduli dideteksi (dalam satuan yang sama dengan metrik). Karena MDE di penyebut kuadrat: MDE separuh → n 4x lipat.",
      tasks: [
        { id: "t1", text: "Hitung `sigma2` = p(1−p) dan `n_grup`" },
        { id: "t2", text: "Cetak `n_grup` dengan `print`" },
      ],
      expected: "n_grup=14400",
      hints: [
        "sigma2 = baseline * (1 - baseline).",
        "n_grup = 16 * sigma2 / mde**2.",
        "0,1 × 0,9 = 0,09; 16 × 0,09 / 0,0001 = 14.400.",
      ],
      code: {
        starter: `# Baseline conversion 10%, MDE 1 poin\nbaseline = 0.10\nmde = 0.01\n\n# TULIS KODEMU: variansi dan ukuran sampel per grup\nsigma2 =\nn_grup =\n\nprint(f"n_grup={n_grup:.0f}")`,
        lockLines: 3,
        solution: `# Baseline conversion 10%, MDE 1 poin\nbaseline = 0.10\nmde = 0.01\n\n# TULIS KODEMU: variansi dan ukuran sampel per grup\nsigma2 = baseline * (1 - baseline)\nn_grup = 16 * sigma2 / mde**2\n\nprint(f"n_grup={n_grup:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sigma2", value: 0.09, tol: 1e-9, label: "`sigma2` seharusnya 0,09", msg: "0,10 × 0,90 = 0,09." },
          { kind: "equal", task: "t1", name: "n_grup", value: 14400, tol: 1, label: "`n_grup` seharusnya 14400", msg: "16 × 0,09 / 0,0001 = 14.400 per grup." },
          { kind: "stdout_matches", task: "t2", pattern: "n_grup=14400", label: "`print` menampilkan n_grup", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "MDE separuh → n 4x. Hitung n sebelum mulai eksperimen.",
    },
    {
      id: "cuped",
      eyebrow: "Langkah 3 · CUPED",
      title: "Variansi −49% tanpa tambah sampel",
      prose: [
        "CUPED memakai data pra-eksperimen (X) untuk mengurangi noise: Y_adj = Y − θ(X − X̄). Intuisinya: kalau user memang sudah aktif sebelum eksperimen, jangan hitung keaktifan alaminya sebagai efek treatment.",
        "Dengan korelasi ρ = 0,7 antara X dan Y, variansi turun sebesar ρ² = 49%. Efeknya setara menambah sampel ~2x — gratis, hanya dengan memakai data yang sudah ada.",
        "Syarat: X diukur sebelum randomisasi (tidak boleh terpengaruh treatment). Praktik standar di eksperimen modern: selalu CUPED-kan metrik utama.",
      ],
      formula: String.raw`Y_{\text{adj}} = Y - \theta(X - \bar{X}) \qquad \text{var turun } \rho^2`,
      formulaNote: "CUPED (pengurang variansi): Y = metrik hasil eksperimen; X = kovariat pra-eksperimen (mis. aktivitas user sebelum test); X̄ = rata-rata X; θ (theta) = koefisien regresi Y atas X. Variansi turun sebesar ρ² (rho kuadrat) = kuadrat korelasi X–Y. ρ=0,7 → variansi −49%, setara ~2x sampel — gratis. Syarat: X diukur sebelum randomisasi.",
      tasks: [],
      reference: "CUPED: pakai kovariat pra-eksperimen, variansi turun ρ².",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 4 · Jebakan",
      title: "SRM, novelty, interference",
      prose: [
        "SRM (sample ratio mismatch): randomisasi 50/50 tapi hasil 55/45 = randomisasi rusak (bug, bot, filter). Selalu cek SRM dulu sebelum baca hasil — hasil dari randomisasi rusak = sampah.",
        "Novelty effect: user klik karena \u201Cbaru\u201D, bukan karena \u201Cbagus\u201D. Efek memudar dalam 1–2 minggu. Solusi: jalankan cukup lama, atau abaikan minggu pertama.",
        "Interference: treatment user A memengaruhi user B (marketplace, social). SUTVA dilanggar → randomisasi user-level bias. Solusi: randomisasi per cluster/geo (MK10).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Interference yang diabaikan bisa membalik kesimpulan: fitur yang terlihat menang di user-level bisa kalah di level pasar. Untuk produk dengan efek jaringan, desain eksperimen yang salah = keputusan yang salah arah.",
        type: "risk",
      },
      reference: "Cek SRM dulu. Waspadai novelty & interference.",
    },
    {
      id: "did",
      eyebrow: "Langkah 5 · DiD",
      title: "Difference-in-Differences saat randomisasi mustahil",
      prose: [
        "Tidak semua bisa di-randomisasi (harga, peluncuran kota). DiD = (T_post − T_pre) − (C_post − C_pre): bandingkan perubahan treatment vs perubahan kontrol. Menghilangkan bias yang konstan terhadap waktu.",
        "Asumsi kunci: parallel trends — tanpa treatment, keduanya bergerak sejajar. Cek dengan data pra-periode: kalau trennya sudah beda sebelum treatment, DiD tidak valid.",
        "DiD adalah jembatan ke MK10 (geo-experiment): kota treatment vs kota kontrol, diukur sebelum dan sesudah.",
      ],
      formula: String.raw`\hat{\tau}_{\text{DiD}} = (\bar{Y}_{T,\text{post}} - \bar{Y}_{T,\text{pre}}) - (\bar{Y}_{C,\text{post}} - \bar{Y}_{C,\text{pre}})`,
      formulaNote: "τ̂_DiD = estimasi efek difference-in-differences: Ȳ_T,post = rata-rata grup treatment setelah; Ȳ_T,pre = treatment sebelum; Ȳ_C,post dan Ȳ_C,pre = kontrol setelah/sebelum. Selisih perubahan treatment dikurangi selisih perubahan kontrol menghilangkan bias yang konstan terhadap waktu. Sah hanya jika parallel trends: tanpa treatment keduanya bergerak sejajar.",
      tasks: [],
      reference: "DiD butuh parallel trends. Cek di data pra-periode.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek disiplin eksperimenmu",
      prose: [
        "Tiga soal cepat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Analis mengintip tiap hari dan berhenti saat p<0,05. Masalahnya?",
          options: [
            { text: "False positive naik ke ~20–30% — itu p-hacking", why: "Berhenti saat hijau = memilih noise. Tetapkan n dan durasi di muka.", correct: true },
            { text: "Tidak masalah, p<0,05 tetap sah", why: "Sah hanya jika satu kali lihat di akhir dengan n terpenuhi." },
            { text: "Malah lebih efisien", why: "Efisien menuju kesimpulan salah." },
          ],
        },
        {
          q: "MDE diperkecil separuh. Apa yang terjadi pada n?",
          options: [
            { text: "Naik 4x lipat", why: "n ∝ 1/MDE². MDE/2 → n ×4.", correct: true },
            { text: "Naik 2x lipat", why: "Itu kalau hubungan linear — ini kuadratik." },
            { text: "Tetap", why: "MDE menentukan n secara langsung." },
          ],
        },
        {
          q: "Hasil: p=0,001 tapi efek +0,1% (tidak material). Keputusan?",
          options: [
            { text: "Lihat confidence interval — signifikan ≠ penting", why: "n besar membuat efek mungil signifikan. Keputusan by besaran + CI, bukan p saja.", correct: true },
            { text: "Rollout — p sangat kecil", why: "p kecil = yakin efeknya bukan nol, bukan yakin efeknya besar." },
            { text: "Ulangi sampai efek besar", why: "Itu p-hacking versi lain." },
          ],
        },
      ],
    },
    {
      id: "adv-sequential",
      eyebrow: "Langkah 7 · Sequential testing",
      title: "Mengintip yang sah: alpha spending",
      prose: [
        "Larangan peeking bukan berarti kamu tidak boleh melihat data sebelum selesai — artinya kamu tidak boleh memakai aturan signifikansi biasa sambil mengintip. Sequential testing melegalkan intipan: bagi jatah false positive (alpha) ke beberapa titik intip di muka. Intip awal memakai ambang jauh lebih ketat (mis. p < 0,001), intip akhir memakai sisa jatahnya.",
        "Intuisinya: total 'keberuntungan' yang boleh kamu pakai tetap 5% — hanya dibagi-bagi. Makin awal intipnya, makin sedikit jatahnya, karena data masih sedikit dan noise besar. Metode O'Brien-Fleming memformalkan ini: ambang awal sangat ketat, ambang akhir nyaris 0,05 biasa.",
        "Kapan dipakai: eksperimen berisiko (takut merusak revenue) yang butuh tombol darurat, atau eksperimen sangat panjang. Harganya: sedikit power hilang dibanding satu-lihat-di-akhir. Aturannya tetap sama — rencana intip ditulis SEBELUM eksperimen, bukan ditemukan di tengah jalan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tim ingin tombol darurat untuk menghentikan eksperimen berisiko di tengah jalan. Cara yang sah?",
          options: [
            { text: "Sequential testing: rencana intip + alpha spending ditulis sebelum mulai", why: "Intip legal = jatah false positive dibagi di muka dengan ambang ketat di awal.", correct: true },
            { text: "Intip tiap hari, berhenti saat p<0,05", why: "Itu peeking PayKu — false positive ~20–30%." },
            { text: "Tidak boleh melihat data sama sekali", why: "Berlebihan; sequential testing melegalkan intipan terencana." },
            { text: "Berhenti saat efeknya terlihat besar", why: "'Terlihat besar' di tengah jalan = noise yang kebetulan besar." },
          ],
        },
        {
          q: "Kenapa ambang intip awal harus jauh lebih ketat dari 0,05?",
          options: [
            { text: "Data masih sedikit → noise besar → butuh bukti lebih kuat untuk klaim awal", why: "Jatah alpha dibagi; intip awal 'membayar' ketidakpastian dengan ambang ketat.", correct: true },
            { text: "Agar eksperimen terlihat serius", why: "Bukan soal penampilan — soal matematika error rate." },
            { text: "Supaya tidak ada yang berhenti awal", why: "Berhenti awal boleh — jika buktinya sangat kuat." },
            { text: "Tidak harus — 0,05 selalu cukup", why: "0,05 di tiap intip tanpa koreksi = inflasi false positive." },
          ],
        },
      ],
      reference: "Intip legal = rencana tertulis + jatah alpha dibagi + ambang ketat di awal.",
    },
    {
      id: "adv-guardrail",
      eyebrow: "Langkah 8 · Guardrail metrics",
      title: "Jangan menangkan pertempuran tapi kalah perang",
      prose: [
        "Setiap eksperimen butuh satu metrik utama DAN 2–3 guardrail: metrik yang tidak boleh memburuk. Contoh PayKu: tombol hijau menaikkan klik +8% (menang!) tetapi menaikkan refund +3% dan menurunkan NPS 2 poin (kalah perang). Tanpa guardrail, kemenangan diumumkan; dengan guardrail, rollout ditahan.",
        "Aturan keputusan: (1) metrik utama signifikan + guardrail aman → rollout; (2) utama signifikan + guardrail merah → investigasi, jangan rollout; (3) utama tidak signifikan + guardrail aman → netral, boleh rollout jika ada alasan lain (mis. tech debt); (4) guardrail merah parah → hentikan, berapa pun hasil utamanya.",
        "Guardrail dipilih dari risiko bisnis: revenue per user, refund rate, churn, latency, komplain CS. Tulis sebelum eksperimen — guardrail yang dipilih setelah melihat hasil = cherry-picking.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tombol hijau: klik +8% (p<0,01) tetapi refund +3% dan NPS −2. Keputusan?",
          options: [
            { text: "Tahan rollout — guardrail merah mengalahkan kemenangan metrik utama", why: "Aturan (2): utama menang + guardrail merah = investigasi dulu. Klik naik yang dibayar refund bukan kemenangan.", correct: true },
            { text: "Rollout — p<0,01 sangat signifikan", why: "Signifikan ≠ menguntungkan; guardrail menangkap biaya tersembunyinya." },
            { text: "Rollout ke 50% saja", why: "Setengah rollout dari keputusan yang salah = setengah salah, bukan benar." },
            { text: "Ulangi eksperimen sampai guardrail hijau", why: "Mengulang sampai hasil bagus = p-hacking guardrail." },
          ],
        },
      ],
      reference: "Utama + guardrail ditulis di muka; merah = tahan, berapa pun p-nya.",
    },
    {
      id: "lab-peeking",
      eyebrow: "Langkah 9 · Lab simulasi",
      title: "Lab: saksikan peeking menggelembungkan false positive",
      prose: [
        "Teori bilang peeking menaikkan false positive; lab ini membuatnya terlihat. Kamu mensimulasikan 2.000 eksperimen di mana sebenarnya TIDAK ADA efek (α seharusnya 5%), lalu mengintip 10 kali tiap eksperimen.",
        "Coba: ubah n_intip menjadi 1 (tanpa peeking) lalu 20. Rasakan sendiri bagaimana 'kemenangan' palsu lahir dari intipan — persis seperti tombol hijau PayKu.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `fp_rate`: simulasi intipan dan hitung fraksi false positive" },
        { id: "t2", text: "Cetak `fp_peeking` dengan `print`" },
      ],
      expected: "fp_peeking=0.21",
      hints: [
        "Tiap intipan: tambah n_akhir//n_intip sampel per grup (acak 0/1).",
        "Uji z: |pa−pb|/se > 1.96 → 'signifikan'; kena=True lalu break.",
        "fp = jumlah kena / n_trial. Dengan seed 7 → 0,21.",
      ],
      code: {
        starter: `import random, math
random.seed(7)

def fp_rate(n_trial=2000, n_intip=10, n_akhir=2000):
    fp = 0
    for _ in range(n_trial):
        kena = False
        a = b = 0; na = nb = 0
        for k in range(n_intip):
            for _ in range(n_akhir // n_intip):
                a += random.random() < 0.5; na += 1
                b += random.random() < 0.5; nb += 1
            pa, pb = a / na, b / nb
            pp = (a + b) / (na + nb)
            se = math.sqrt(pp * (1 - pp) * (1/na + 1/nb))
            # TULIS KODEMU: tandai kena jika |z| > 1.96
            z =
            if :
                kena = True
                break
        fp += kena
    return fp / n_trial

fp_peeking = fp_rate()
print(f"fp_peeking={fp_peeking:.2f}")`,
        lockLines: 9,
        solution: `import random, math
random.seed(7)

def fp_rate(n_trial=2000, n_intip=10, n_akhir=2000):
    fp = 0
    for _ in range(n_trial):
        kena = False
        a = b = 0; na = nb = 0
        for k in range(n_intip):
            for _ in range(n_akhir // n_intip):
                a += random.random() < 0.5; na += 1
                b += random.random() < 0.5; nb += 1
            pa, pb = a / na, b / nb
            pp = (a + b) / (na + nb)
            se = math.sqrt(pp * (1 - pp) * (1/na + 1/nb))
            # TULIS KODEMU: tandai kena jika |z| > 1.96
            z = (pa - pb) / se
            if abs(z) > 1.96:
                kena = True
                break
        fp += kena
    return fp / n_trial

fp_peeking = fp_rate()
print(f"fp_peeking={fp_peeking:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fp_peeking", value: 0.21, tol: 0.02, label: "`fp_peeking` sekitar 0,21", msg: "10x intip → false positive 4x lipat dari 0,05. Seed 7 memberi 0,21." },
          { kind: "stdout_matches", task: "t2", pattern: "fp_peeking=0.21", label: "`print` menampilkan fp_peeking", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Simulasi > teori: 10 intipan ≈ 21% false positive.",
    },
    {
      id: "intuisi-kontrak",
      eyebrow: "Langkah 10 · Intuisi",
      title: "Eksperimen adalah kontrak dengan masa depan",
      prose: [
        "Semua jebakan eksperimen — peeking, p-hacking, cherry-picking guardrail — punya satu akar: aturan dibuat setelah data terlihat. Tiga heuristik memutus akarnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tulis kontrak eksperimen sebelum melihat satu baris data pun",
        body: "Heuristik pertama: kontrak dulu, data kemudian. Sebelum eksperimen jalan, tulis dan kunci: hipotesis, metrik utama, guardrail, ukuran sampel, durasi, dan aturan berhenti. Dokumen satu halaman ini adalah satu-satunya yang berdiri di antara kamu dan godaan 'coba intip sebentar'. Tim yang tidak menulis kontrak akan selalu menemukan alasan untuk berhenti di titik yang hijau — karena manusia pandai merasionalisasi noise. Heuristik kedua: bedakan 'signifikan' dari 'penting'. Dengan n raksasa, efek +0,1% bisa p<0,001 — signifikan secara statistik, tidak material secara bisnis. Keputusan selalu dari besaran efek + confidence interval, bukan dari bintang p-value. Tanya: 'jika efek ini benar, berapa rupiahnya setahun?' Jika jawabannya tidak menutup biaya implementasi, eksperimennya menang secara statistik dan kalah secara ekonomi. Heuristik ketiga: desain untuk kegagalan, bukan untuk kemenangan. Cek SRM dulu sebelum membaca hasil; pasang guardrail untuk skenario terburuk; siapkan rencana jika interference terdeteksi. Eksperimen yang dirancang dengan baik membuat keputusan yang benar bahkan saat hasilnya mengecewakan — dan eksperimen yang buruk membuat keputusan yang salah bahkan saat hasilnya 'menang'. Disiplin desain > rumus canggih.",
      },
      reference: "Kontrak tertulis; signifikan ≠ penting; desain untuk kegagalan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 11 · Peta keputusan",
      title: "Peta keputusan: eksperimen yang hasilnya bisa dipercaya",
      prose: [
        "Skenario satu — sebelum jalan: tulis kontrak (hipotesis, metrik utama, guardrail, n, durasi, aturan berhenti). Seperti PayKu: n=14.400 per grup, 30 hari, tanpa intip keputusan. Aturan dibuat sebelum data terlihat.",
        "Skenario dua — traffic kecil: jangan paksa A/B. Pakai CUPED dengan kovariat pre-eksperimen (rho 0,65 di kasus PayKu) untuk memangkas varians, atau terima MDE yang lebih besar.",
        "Skenario tiga — godaan peeking: tetapkan sequential testing di muka bila harus mengintip, atau kunci diri — tidak ada keputusan sebelum durasi habis. Peeking tanpa koreksi adalah p-hacking yang sopan.",
        "Skenario empat — hasil signifikan tetapi guardrail merah (refund atau NPS turun): kemenangan ditolak. Metrik utama tanpa guardrail adalah insentif untuk merusak yang lain.",
        "Skenario lima — banyak varian: jangan bandingkan 10 varian dengan n untuk 2. Sesuaikan n, atau terima bahwa hanya efek besar yang terdeteksi.",
        "Aturan praktis 10 detik: kontrak tertulis sebelum jalan? n cukup untuk MDE? Guardrail terdefinisi? Aturan berhenti jelas? Satu 'tidak' = jangan jalan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghentikan eksperimen saat 'sudah signifikan'. Signifikansi di hari ke-3 dengan n kecil adalah noise yang berdasi — keputusan di tengah jalan tanpa aturan sequential testing membatalkan seluruh matematika di belakangnya.",
      },
      reference: "Kontrak dulu → n untuk MDE → CUPED bila traffic kecil → guardrail ikut dinilai.",
    },
    {
      id: "minicase-payku2",
      eyebrow: "Langkah 12 · Mini-case",
      title: "PayKu, bagian 2: mengadili ulang tombol hijau",
      prose: [
        "PayKu mengulang eksperimen tombol hijau dengan disiplin penuh. Kontrak: hipotesis 'hijau menaikkan conversion checkout'; metrik utama conversion checkout; guardrail refund rate + NPS; n/grup = 14.400 (baseline 10%, MDE 1 poin); durasi 30 hari; tanpa intip keputusan; CUPED dengan kovariat aktivitas 30 hari sebelum (ρ = 0,65).",
        "Hasil hari ke-30: conversion +0,9 poin (p = 0,03, CI 95%: +0,1 s.d. +1,7). Guardrail: refund +0,2 poin (tidak signifikan), NPS −0,5 (tidak signifikan). CUPED mempersempit CI menjadi +0,3 s.d. +1,5 — efeknya nyata, bukan noise.",
        "Pertanyaan: (1) Rollout atau tidak? (2) Apa peran CUPED di sini? (3) Jika di hari ke-10 sudah p<0,05, bolehkah berhenti?",
        "Pembahasan: (1) Ya — utama signifikan + guardrail aman + efek material (+0,9 poin × 2 juta checkout/bulan × Rp150rb = Rp2,7M/bulan). (2) CUPED menurunkan variansi 42% (ρ² = 0,42): CI menyempit, keputusan lebih yakin dengan n yang sama. (3) Tidak — kontrak bilang 30 hari; berhenti di hari ke-10 = peeking. Pengecualiannya hanya jika sequential testing direncanakan sejak awal.",
      ],
      tasks: [],
      quiz: [
        {
          q: "PayKu ulang: +0,9 poin (p=0,03), guardrail aman, CUPED mempersempit CI. Keputusan?",
          options: [
            { text: "Rollout — kontrak terpenuhi: utama signifikan, guardrail aman, efek material", why: "+0,9 poin × volume = Rp2,7M/bulan. Semua syarat kontrak hijau.", correct: true },
            { text: "Tolak — p=0,03 tidak cukup kecil", why: "0,03 < 0,05 = signifikan; menuntut p lebih kecil tanpa alasan = menggeser gawang." },
            { text: "Ulangi sekali lagi untuk memastikan", why: "Mengulang sampai dua kemenangan = p-hacking; satu eksperimen disiplin sudah cukup." },
            { text: "Rollout tetapi abaikan CUPED", why: "CUPED bagian dari desain; mengabaikannya membuang presisi gratis." },
          ],
        },
        {
          q: "Di hari ke-10, p<0,05 tercapai. Boleh berhenti?",
          options: [
            { text: "Tidak — kontrak menetapkan 30 hari; berhenti = peeking", why: "Satu-satunya pengecualian adalah sequential testing yang direncanakan sebelum mulai.", correct: true },
            { text: "Boleh — sudah signifikan", why: "Itu tepatnya kesalahan PayKu bagian 1 yang memakan korban." },
            { text: "Boleh jika efeknya besar", why: "'Terlihat besar' di tengah jalan = noise yang kebetulan besar." },
            { text: "Tergantung mood tim", why: "Keputusan eksperimen tidak memakai mood." },
          ],
        },
      ],
      reference: "Kontrak dipatuhi sampai akhir; CUPED = presisi gratis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Eksperimen yang baik = disiplin desain, bukan rumus canggih.",
      ],
      tasks: [],
      summary: [
        "No peeking: P(min 1 FP) = 1−(1−α)^k; tetapkan n dan durasi di muka.",
        "n/grup ≈ 16σ²/MDE²; MDE separuh → n 4x.",
        "CUPED: Y_adj = Y − θ(X−X̄); variansi turun ρ² (ρ=0,7 → −49%).",
        "Cek SRM; waspadai novelty dan interference.",
        "DiD untuk yang tak bisa dirandomisasi; butuh parallel trends.",
        "Intip legal = sequential testing: rencana tertulis + alpha spending + ambang ketat di awal.",
        "Guardrail (refund, NPS, revenue) ditulis di muka; merah = tahan rollout.",
      ],
      next: { label: "MK10 — Inkrementalitas", href: "/learn/mk10-incrementality" },
      quiz: [
        {
          q: "Kapan CUPED boleh dipakai?",
          options: [
            { text: "Kovariat diukur sebelum randomisasi", why: "X pra-treatment tidak terpengaruh treatment — syarat sah CUPED.", correct: true },
            { text: "Kovariat diukur sesudah treatment", why: "Itu bisa menyerap efek treatment itu sendiri — bias." },
            { text: "Kapan pun, asal korelasinya tinggi", why: "Korelasi tinggi pasca-treatment justru berbahaya." },
          ],
        },
        {
          q: "Randomisasi 50/50, hasil 58/42. Langkah pertama?",
          options: [
            { text: "Cek SRM — randomisasi mungkin rusak", why: "Deviasi sebesar ini = alarm. Jangan baca hasil sebelum lolos SRM.", correct: true },
            { text: "Lanjut baca hasil, beda kecil", why: "58/42 bukan beda kecil — dan SRM gagal = hasil tidak valid." },
            { text: "Ubah jadi 58/42 sebagai desain baru", why: "Tidak bisa melegalkan randomisasi rusak retroaktif." },
          ],
        },
        {
          q: "Eksperimen fitur social (user saling memengaruhi). Desain?",
          options: [
            { text: "Randomisasi per cluster/geo — hindari interference", why: "User-level SUTVA dilanggar; cluster mengisolasi efek.", correct: true },
            { text: "User-level seperti biasa", why: "Treatment A bocor ke B = estimasi bias." },
            { text: "Tidak usah eksperimen", why: "Berlebihan — cluster randomization solusinya." },
          ],
        },
        {
          q: "DiD valid jika?",
          options: [
            { text: "Parallel trends di periode pra-treatment", why: "Tanpa itu, selisih perubahan ≠ efek treatment.", correct: true },
            { text: "Sampel besar", why: "n besar tidak memperbaiki asumsi yang dilanggar." },
            { text: "Ada kontrol saja", why: "Kontrol yang trennya beda = pembanding yang salah." },
          ],
        },
        {
          q: "ρ = 0,7 antara kovariat pra-eksperimen dan metrik. Manfaat CUPED?",
          options: [
            { text: "Variansi turun 49% — setara ~2x sampel, gratis", why: "ρ² = 0,49. Presisi naik tanpa tambah user.", correct: true },
            { text: "Menghilangkan bias", why: "CUPED soal variansi, bukan bias — randomisasi yang menghilangkan bias." },
            { text: "Tidak ada, ρ harus > 0,9", why: "0,7 sudah memberi 49% — sangat berharga." },
          ],
        },
      ],
    },
  ],
};
