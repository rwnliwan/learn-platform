import type { V2Lesson } from "../lib/types";

export const mk6: V2Lesson = {
  slug: "mk6-churn",
  track: "Marketing Analytics",
  module: "Churn",
  title: "MK6 — Churn: Prediksi & Retensi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-telkonusa",
      eyebrow: "Langkah 1 · Cerita TelkoNusa",
      title: "Model 95% akurat yang tidak berguna",
      prose: [
        "TelkoNusa bangga: model churn-nya 95% akurat. Lalu analisnya bertanya: berapa baseline churn-nya? 5%. Model yang selalu menebak \u201Ctidak churn\u201D juga 95% akurat — tanpa belajar apa pun.",
        "Akurasi menipu di data jomplang. Yang penting bukan \u201Cberapa % benar\u201D, melainkan: dari yang diprediksi churn, berapa yang benar-benar churn (precision)? Dari yang benar-benar churn, berapa yang tertangkap (recall)? Dan: kapan aksi retensi menguntungkan?",
        "Lesson ini: threshold berbasis expected value (bukan 0,5), kurva survival Kaplan-Meier, dan beda logo vs revenue churn.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Melaporkan akurasi sebagai metrik utama model churn. Di churn 5%, akurasi 95% = nol informasi. Pakai precision, recall, atau AUC — dan selalu bandingkan dengan baseline mayoritas.",
        type: "pitfall",
      },
      reference: "Akurasi di data jomplang = menipu. Pakai precision/recall.",
    },
    {
      id: "threshold-ev",
      eyebrow: "Langkah 2 · Threshold EV",
      title: "Kapan menelepon pelanggan? p > 12,5%",
      prose: [
        "Threshold 0,5 adalah kebiasaan, bukan keputusan. Threshold yang benar = titik di mana expected value aksi positif: p × P(selamat|aksi) × CLV − biaya > 0.",
        "Worked example: CLV Rp2jt, biaya telepon Rp50rb, peluang selamat jika ditelepon 20%. Telepon menguntungkan jika p > 50.000 / (2.000.000 × 0,2) = 12,5%. Pelanggan dengan p=30% wajib ditelepon; p=10% tidak — walau model bilang \u201Cberisiko\u201D.",
        "Implikasinya: model churn tanpa threshold bisnis = skor tanpa keputusan. Selalu pasangkan probabilitas dengan biaya aksi dan nilai selamat.",
      ],
      formula: String.raw`p^* = \frac{\text{biaya aksi}}{\text{CLV} \times P(\text{selamat} \mid \text{aksi})}`,
      formulaNote: "p* = threshold probabilitas churn untuk bertindak: biaya aksi = Rp yang dikeluarkan per pelanggan yang dihubungi; CLV = nilai pelanggan jika berhasil diselamatkan; P(selamat|aksi) = probabilitas aksi retensi benar-benar mencegah churn (bukan sekadar menghubungi). Bertindak hanya jika p > p* — di bawah itu expected value negatif.",
      tasks: [],
      reference: "Threshold = biaya / (CLV × P(selamat)). Bukan 0,5.",
    },
    {
      id: "kaplan-meier",
      eyebrow: "Langkah 3 · Kaplan-Meier & lab",
      title: "Kurva survival dan data tersensor",
      prose: [
        "Kaplan-Meier mengestimasi S(t) = probabilitas bertahan hingga t: kalikan (1 − d_i/n_i) tiap periode, di mana d_i = yang churn, n_i = yang masih at-risk. Pelanggan yang belum churn di akhir observasi = censored: mereka keluar dari n_i tanpa dihitung churn.",
        "Censoring sering disalahartikan sebagai \u201Cdata hilang\u201D. Bukan — ia informasi: \u201Csetidaknya bertahan selama ini\u201D. Membuang data censored = bias ke pelanggan lama; menganggapnya churn = bias sebaliknya.",
        "Di lab ini kamu menghitung kurva KM tiga bulan dari data mini. Lihat sendiri: KM TelkoNusa curam di bulan 1–2 → masalah onboarding, bukan produk.",
      ],
      formula: String.raw`S(t) = \prod_{i \le t}\left(1 - \frac{d_i}{n_i}\right)`,
      formulaNote: "S(t) = probabilitas bertahan hingga waktu t (kurva Kaplan-Meier): produk dikalikan untuk semua periode i sampai t; d_i = jumlah yang churn di periode i; n_i = jumlah yang masih at-risk di awal periode i (sudah dikurangi yang churn DAN yang tersensor sebelumnya). Pelanggan tersensor keluar dari n_i tanpa dihitung sebagai d_i.",
      tasks: [
        { id: "t1", text: "Hitung `surv`: kalikan S dengan (1 − d/n) tiap bulan" },
        { id: "t2", text: "Cetak list `surv` dengan `print`" },
      ],
      expected: "[0.9, 0.72, 0.64]",
      note: {
        title: "Sering salah",
        body: "Menghitung churn bulanan sebagai d_i / n_awal terus-menerus. Pembagi KM adalah yang masih at-risk (n_i menyusut), bukan ukuran awal — itulah gunanya produk kumulatif.",
        type: "pitfall",
      },
      hints: [
        "Loop: for ni, di in zip(n, d): S = S * (1 - di/ni); surv.append(S).",
        "Bulan 1: 1 × (1 − 10/100) = 0,9.",
        "Bulan 3: 0,72 × (1 − 8/72) = 0,64.",
      ],
      code: {
        starter: `# n = at-risk, d = churn per bulan\nn = [100, 90, 72]\nd = [10, 18, 8]\n\n# TULIS KODEMU: kurva survival Kaplan-Meier\nS = 1.0\nsurv = []\nfor ni, di in zip(n, d):\n    S =\n    surv.append(round(S, 4))\n\nprint(surv)`,
        lockLines: 3,
        solution: `# n = at-risk, d = churn per bulan\nn = [100, 90, 72]\nd = [10, 18, 8]\n\n# TULIS KODEMU: kurva survival Kaplan-Meier\nS = 1.0\nsurv = []\nfor ni, di in zip(n, d):\n    S = S * (1 - di / ni)\n    surv.append(round(S, 4))\n\nprint(surv)`,
        checks: [
          { kind: "equal", task: "t1", name: "surv", value: [0.9, 0.72, 0.64], tol: 1e-9, label: "`surv` seharusnya [0,9, 0,72, 0,64]", msg: "Bulan 1: 1 × (1 − 10/100)." },
          { kind: "contains", task: "t1", name: "surv", value: 0.64, label: "`surv` memuat 0,64", msg: "Bulan 3: 0,72 × (1 − 8/72) = 0,64." },
          { kind: "stdout_matches", task: "t2", pattern: "0\\.64", label: "`print` menampilkan 0,64", msg: "Pastikan list surv tercetak lengkap." },
        ],
      },
      reference: "S(t) = Π(1 − d_i/n_i). Censored keluar dari n_i, bukan dihitung churn.",
    },
    {
      id: "logo-vs-revenue",
      eyebrow: "Langkah 4 · Logo vs revenue churn",
      title: "Churn pelanggan vs churn uang",
      prose: [
        "Logo churn = % pelanggan yang pergi. Revenue churn = % revenue yang hilang. Keduanya bisa bercerita beda: 100 pelanggan kecil pergi (logo churn 10%) mungkin hanya 2% revenue — sementara 2 pelanggan enterprise pergi (logo 0,2%) bisa 15% revenue.",
        "Untuk bisnis B2B/enterprise, revenue churn yang menentukan napas perusahaan. Net revenue retention (NRR) = 100% − revenue churn + expansion: NRR > 100% artinya bisnis tumbuh walau ada yang pergi.",
        "Aturan: laporkan keduanya, tapi buat keputusan retensi by revenue-at-risk = p(churn) × revenue pelanggan. Menyelamatkan 1 enterprise > 100 pelanggan kecil.",
      ],
      tasks: [],
      reference: "Logo churn = pelanggan; revenue churn = uang. Keputusan by revenue-at-risk.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: retensi yang menguntungkan, bukan yang ramai",
      prose: [
        "Skenario satu — daftar 'berisiko churn' dari model: jangan blast ke semua. Pisahkan persuadable (mau pergi tetapi bisa diselamatkan) dari lost causes dan sleeping dogs — seperti TelkoNusa yang menghanguskan Rp500jt.",
        "Skenario dua — memilih aksi retensi: hitung expected value (probabilitas selamat × margin − biaya aksi). Diskon 50% yang menyelamatkan pelanggan bermargin tipis adalah rugi yang direncanakan.",
        "Skenario tiga — definisi churn tidak jelas: tetapkan dulu — x hari tanpa transaksi, atau downgrade? Model yang memprediksi definisi yang salah adalah presisi menuju kegagalan.",
        "Skenario empat — label leakage: pastikan fitur hanya memakai data sebelum window prediksi. Fitur 'jumlah komplain bulan ini' untuk memprediksi churn bulan ini adalah bocor.",
        "Skenario lima — churn tinggi di cohort baru: masalahnya akuisisi (janji iklan vs realita), bukan retensi. Perbaiki pesan akuisisi, bukan tambah diskon retensi.",
        "Aturan praktis 10 detik: definisi churn tertulis? Target = persuadable, bukan semua yang berisiko? EV aksi positif? Fitur bebas leakage? Lolos semua baru jalan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menargetkan yang paling berisiko. Yang paling berisiko pergi adalah yang paling tidak bisa diselamatkan — dan yang paling setia malah pergi karena 'diganggu' diskon. Model churn menjawab 'siapa bisa diselamatkan dengan untung', bukan 'siapa akan pergi'.",
      },
      reference: "Definisi dulu → target persuadable → EV aksi positif → cek leakage.",
    },
    {
      id: "minicase-fitur",
      eyebrow: "Langkah 6 · Mini-case & fitur",
      title: "Kampanye Rp500 juta dan fitur tren",
      prose: [
        "Mini-case: TelkoNusa blast diskon Rp500jt ke semua pelanggan \u201Cberisiko\u201D. Hasil: mengecewakan. Kenapa? Target by risiko mencakup lost causes (tidak akan selamat) dan sleeping dogs (malah pergi karena diganggu). Target yang benar = persuadable — itu materi MK11.",
        "Fitur churn terbaik bukan snapshot, melainkan tren: penurunan frekuensi 3 bulan terakhir, jeda antar-transaksi yang memanjang, penurunan nilai. Pelanggan yang melambat = pelanggan yang pergi — snapshot \u201Ctotal transaksi\u201D tidak menangkapnya.",
        "Resep fitur: recency, frequency, monetary + turunannya (slope 3 bulan, rasio bulan ini vs rata-rata). Sederhana, tapi mengalahkan 50 fitur statis.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Kampanye retensi ke \u201Csemua yang berisiko\u201D bisa membangunkan sleeping dogs — pelanggan yang tidak akan pergi justru pergi karena merasa dispam. Targeting butuh uplift (MK11), bukan sekadar risiko.",
        type: "risk",
      },
      reference: "Fitur tren > snapshot. Target persuadable, bukan sekadar berisiko.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 7 · Kuis cepat",
      title: "Cek intuisimu",
      prose: [
        "Tiga soal cepat tentang jebakan churn.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Model churn 95% akurat, baseline churn 5%. Kesimpulan?",
          options: [
            { text: "Tidak informatif — tebak mayoritas juga 95%", why: "Akurasi = baseline. Model belum terbukti belajar apa pun.", correct: true },
            { text: "Model bagus, langsung deploy", why: "Deploy tanpa cek precision/recall = deploy tebak-tebakan." },
            { text: "Model jelek, buang", why: "Belum tentu jelek — hanya saja akurasi bukan buktinya." },
          ],
        },
        {
          q: "CLV Rp2jt, biaya aksi Rp50rb, P(selamat) 20%. Pelanggan p=10% — telepon atau tidak?",
          options: [
            { text: "Tidak — di bawah threshold 12,5%", why: "EV = 0,1 × 0,2 × 2jt − 50rb = −Rp10rb. Merugi.", correct: true },
            { text: "Telepon — 10% cukup berisiko", why: "\u201CBerisiko\u201D bukan kriteria; EV negatif = jangan." },
            { text: "Telepon — biaya kecil", why: "Rp50rb × ribuan pelanggan = tidak kecil." },
          ],
        },
        {
          q: "Kurva KM curam di bulan 1–2, lalu landai. Diagnosis?",
          options: [
            { text: "Masalah onboarding — perbaiki pengalaman awal", why: "Kematian dini = ekspektasi vs realita di awal, bukan kejenuhan produk.", correct: true },
            { text: "Produk jelek secara umum", why: "Kalau produk jelek, kurva curam terus — bukan hanya di awal." },
            { text: "Harga terlalu mahal", why: "Harga biasanya membunuh di semua umur, tidak spesifik bulan 1–2." },
          ],
        },
      ],
    },
    {
      id: "adv-definisi-churn",
      eyebrow: "Langkah 8 · Definisi churn",
      title: "Kontrak churn: X hari tanpa transaksi — X dari data, bukan firasat",
      prose: [
        "Untuk bisnis non-kontraktual, 'churn' tidak terjadi dengan sendirinya — kamu yang mendefinisikannya: X hari tanpa transaksi = churn. X = 30 untuk kopi (orang beli tiap minggu), X = 180 untuk tiket pesawat (orang terbang 2x setahun). X yang sama untuk semua bisnis = malas berpikir.",
        "Cara memilih X dari data: plot distribusi jeda antar-transaksi pelanggan aktif. Pilih X di ekor kanan — mis. persentil ke-95 jeda. Jika 95% jeda pembelian di bawah 45 hari, X = 60 hari adalah definisi yang defensibel: yang diam lebih lama dari itu memang anomali. Dokumentasikan X di kontrak metrik — karena mengganti X diam-diam mengubah seluruh tren churn.",
        "Satu nuansa: pelanggan yang 'churn' menurut X=90 tetapi kembali di hari ke-100 bukan model yang salah — ia win-back yang berhasil. Catat reaktivasi sebagai outcome terpisah; jangan menghukum model karena definisimu kaku.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Bisnis kopi (jeda tipikal 7 hari) dan tiket pesawat (jeda tipikal 150 hari) memakai X = 90 hari yang sama. Masalahnya?",
          options: [
            { text: "X harus dari distribusi jeda tiap bisnis — 90 hari terlalu longgar untuk kopi, terlalu ketat untuk pesawat", why: "X di ekor kanan distribusi masing-masing; satu angka untuk semua = definisi malas.", correct: true },
            { text: "Tidak masalah — standar itu bagus", why: "Standar yang mengabaikan perilaku = churn kopi tidak terdeteksi, churn pesawat overcount." },
            { text: "Naikkan keduanya ke 180 hari", why: "Menaikkan seragam tidak menyelesaikan akar masalahnya." },
            { text: "Pakai X = 30 hari untuk keduanya", why: "30 hari menghukum pelanggan pesawat yang normalnya terbang 2x setahun." },
          ],
        },
      ],
      reference: "X = ekor kanan distribusi jeda; dokumentasikan; reaktivasi = outcome terpisah.",
    },
    {
      id: "adv-label-leakage",
      eyebrow: "Langkah 9 · Label leakage",
      title: "Fitur yang tahu masa depan: leakage di model churn",
      prose: [
        "Label leakage = fitur yang mengandung informasi dari masa depan (setelah tanggal label). Contoh klasik: 'tanggal_penutupan_akun' sebagai fitur — ia hanya terisi untuk yang churn. 'Hari sejak login terakhir' yang dihitung per hari ini, bukan per tanggal prediksi. 'Status dormant' dari sistem yang di-update setelah churn terjadi. Model dengan fitur seperti ini terlihat sempurna di training dan hancur di produksi.",
        "Cara mendeteksi: (1) satu fitur mendominasi importance (>80%) — curigai; (2) validasi time-travel — latih hanya dengan data yang tersedia SEBELUM tanggal prediksi, evaluasi di masa depan; jika performa anjlok, ada leakage; (3) audit definisi tiap fitur: 'kapan nilai ini pertama kali diketahui?' Jika jawabannya 'setelah label', buang.",
        "Aturan keras: setiap fitur churn wajib punya 'tanggal ketersediaan' yang ≤ tanggal prediksi. Fitur tanpa tanggal ketersediaan yang jelas = fitur yang belum boleh dipakai.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Fitur 'status_dormant' punya importance 92% di model churn. Tindakan pertama?",
          options: [
            { text: "Audit kapan status itu diketahui — kemungkinan leakage dari masa depan", why: "Dominasi ekstrem + status yang di-update setelah churn = leakage klasik.", correct: true },
            { text: "Rayakan — model sangat akurat", why: "Akurasi dari leakage = ilusi; hancur di produksi." },
            { text: "Hapus fitur lain yang tidak penting", why: "Menyisakan satu fitur bocor = model bocor yang ramping." },
            { text: "Naikkan threshold", why: "Threshold tidak memperbaiki fitur yang tahu masa depan." },
          ],
        },
        {
          q: "Apa itu validasi time-travel dan kenapa ia menangkap leakage?",
          options: [
            { text: "Latih dengan data ≤ tanggal prediksi saja — fitur bocor dari masa depan tidak tersedia saat itu", why: "Leakage hanya 'bekerja' jika masa depan bisa diintip; time-travel menutup celahnya.", correct: true },
            { text: "Validasi silang biasa dengan k-fold", why: "K-fold acak masih mencampur masa depan dan masa lalu." },
            { text: "Latih di data masa depan, uji di masa lalu", why: "Terbalik dan tidak realistis." },
            { text: "Memakai data yang lebih banyak", why: "Bukan soal jumlah — soal urutan waktu." },
          ],
        },
      ],
      reference: "Fitur wajib punya tanggal ketersediaan ≤ tanggal prediksi.",
    },
    {
      id: "lab-definisi-x",
      eyebrow: "Langkah 10 · Lab definisi",
      title: "Lab: X yang berbeda, churn yang berbeda",
      prose: [
        "Definisi churn = keputusan. Di lab ini kamu melihat betapa churn rate berubah hanya karena X digeser — tanpa satu pun perilaku pelanggan yang berubah.",
        "Coba: X=30 vs 60 vs 90. Renungkan: jika bonus tim tergantung 'churn rate', X mana yang akan mereka pilih — dan apa artinya untuk kontrak metrik?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `r30`, `r60`, `r90` = fraksi idle > X" },
        { id: "t2", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "r30=0.60 r60=0.40 r90=0.20",
      hints: [
        "r30 = sum(1 for h in idle if h > 30) / len(idle).",
        "idle > 30: 31, 45, 90, 120, 65, 200 → 6 dari 10.",
        "idle > 90: hanya 120 dan 200 → 2 dari 10.",
      ],
      code: {
        starter: `# hari sejak transaksi terakhir per pelanggan
idle = [5, 12, 31, 45, 90, 120, 8, 65, 200, 25]

# TULIS KODEMU: churn rate untuk X = 30, 60, 90 hari
r30 =
r60 =
r90 =

print(f"r30={r30:.2f} r60={r60:.2f} r90={r90:.2f}")`,
        lockLines: 2,
        solution: `# hari sejak transaksi terakhir per pelanggan
idle = [5, 12, 31, 45, 90, 120, 8, 65, 200, 25]

# TULIS KODEMU: churn rate untuk X = 30, 60, 90 hari
r30 = sum(1 for h in idle if h > 30) / len(idle)
r60 = sum(1 for h in idle if h > 60) / len(idle)
r90 = sum(1 for h in idle if h > 90) / len(idle)

print(f"r30={r30:.2f} r60={r60:.2f} r90={r90:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "r30", value: 0.6, tol: 1e-9, label: "`r30` seharusnya 0,60", msg: "6 dari 10 idle > 30 hari." },
          { kind: "equal", task: "t1", name: "r60", value: 0.4, tol: 1e-9, label: "`r60` seharusnya 0,40", msg: "4 dari 10 idle > 60 hari (90, 120, 65, 200)." },
          { kind: "equal", task: "t1", name: "r90", value: 0.2, tol: 1e-9, label: "`r90` seharusnya 0,20", msg: "2 dari 10 idle > 90 hari." },
          { kind: "stdout_matches", task: "t2", pattern: "r90=0.20", label: "`print` menampilkan r90", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Churn rate = fungsi X. Kunci X di kontrak metrik.",
    },
    {
      id: "intuisi-kematian",
      eyebrow: "Langkah 11 · Intuisi",
      title: "Churn bukan ramalan cuaca — ia keputusan yang menunggu aksi",
      prose: [
        "Model churn yang baik tidak menjawab 'siapa yang akan pergi' lalu berhenti. Ia menjawab 'siapa yang akan pergi DAN bisa diselamatkan dengan aksi yang menguntungkan'. Tiga heuristik menjaga fokus itu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: definisikan churn seperti mendefinisikan kematian — butuh tanggal, bukti, dan berlaku untuk semua",
        body: "Heuristik pertama: churn butuh kontrak. Untuk bisnis non-kontraktual, 'X hari tanpa transaksi = churn' dengan X dipilih dari distribusi jeda antar-transaksi — bukan dari firasat, bukan dari kompetitor, bukan dari angka cantik. X = 30 untuk kopi, X = 180 untuk tiket pesawat. Dan X yang sudah dikunci tidak boleh digeser diam-diam saat target terancam — karena menggeser X mengubah seluruh tren churn tanpa satu pun pelanggan yang berubah perilaku. Heuristik kedua: label adalah keputusan bisnis, bukan kebenaran alam. Pelanggan yang 'churn' menurut X=90 tetapi kembali di hari ke-100 bukan model yang salah — ia win-back yang berhasil, dan ia harus dicatat sebagai outcome terpisah. Menghukum model karena definisimu kaku = mengusir sinyal yang benar. Heuristik ketiga: curigai fitur yang terlalu bagus. Jika satu fitur menjelaskan 90% churn, hampir pasti ia tahu masa depan: tanggal penutupan akun, status dormant yang di-update setelah churn, atau 'hari sejak login' yang dihitung per hari ini bukan per tanggal prediksi. Validasi time-travel — latih hanya dengan data yang tersedia sebelum tanggal prediksi — adalah satu-satunya cara menangkap leakage sebelum ia menangkapmu. Dan heuristik terakhir: prediksi tanpa aksi = hobi. Setiap skor churn wajib dipasangkan dengan threshold EV dan aksi yang teruji. Kalau tidak, kamu hanya membuat daftar orang yang akan pergi — sambil menonton mereka pergi.",
      },
      reference: "Kontrak X, label = keputusan, curigai fitur sempurna, skor → aksi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Churn bukan soal prediksi — soal keputusan: siapa diselamatkan, dengan aksi apa, kapan.",
      ],
      tasks: [],
      summary: [
        "Akurasi menipu di data jomplang; pakai precision/recall dan bandingkan dengan baseline.",
        "Threshold EV: p* = biaya/(CLV × P(selamat)) — contoh 12,5%, bukan 0,5.",
        "Kaplan-Meier: S(t) = Π(1 − d_i/n_i); censored = informasi, bukan data hilang.",
        "Bedakan logo churn vs revenue churn; keputusan by revenue-at-risk.",
        "Fitur tren (slope perilaku) > snapshot; target persuadable (MK11).",
        "Kontrak churn: X dari distribusi jeda; reaktivasi = outcome terpisah.",
        "Label leakage: fitur wajib punya tanggal ketersediaan ≤ tanggal prediksi; validasi time-travel.",
      ],
      next: { label: "MK7 — Propensity", href: "/v2/learn/mk7-propensity" },
      quiz: [
        {
          q: "Data censored (pelanggan belum churn di akhir observasi) harus diapakan?",
          options: [
            { text: "Dikeluarkan dari pembagi n_i mulai periode setelahnya, tanpa dihitung churn", why: "Itulah KM: mereka berkontribusi \u201Cbertahan selama ini\u201D lalu keluar.", correct: true },
            { text: "Dihitung sebagai churn", why: "Itu mengada-ada kematian — bias ke atas." },
            { text: "Dibuang dari dataset", why: "Membuang = bias ke pelanggan lama yang observasinya lengkap." },
          ],
        },
        {
          q: "Logo churn 2%, revenue churn 15%. Apa yang terjadi?",
          options: [
            { text: "Sedikit pelanggan pergi, tapi mereka pelanggan besar", why: "Uang yang hilang jauh lebih besar dari jumlah kepalanya.", correct: true },
            { text: "Banyak pelanggan kecil pergi", why: "Terbalik: itu logo churn besar, revenue churn kecil." },
            { text: "Tidak mungkin terjadi", why: "Sangat mungkin di B2B dengan konsentrasi revenue." },
          ],
        },
        {
          q: "Fitur mana yang PALING prediktif untuk churn?",
          options: [
            { text: "Tren perilaku: frekuensi menurun 3 bulan terakhir", why: "Perubahan perilaku = sinyal kepergian; snapshot tidak menangkap arah.", correct: true },
            { text: "Total transaksi sepanjang masa", why: "Budi MK5: total besar tapi sudah mati 2 tahun." },
            { text: "Umur akun", why: "Umur panjang tanpa aktivitas = justru indikasi dorman." },
          ],
        },
        {
          q: "Kenapa threshold 0,5 bisa merugikan?",
          options: [
            { text: "Mengabaikan biaya aksi dan nilai selamat — EV bisa negatif di atas 0,5 atau positif di bawahnya", why: "Threshold bisnis dari EV, bukan kebiasaan 0,5.", correct: true },
            { text: "0,5 selalu terlalu tinggi", why: "Tidak selalu — tergantung biaya dan CLV. Di contoh ini 12,5% < 0,5." },
            { text: "Model tidak calibrated di 0,5", why: "Kalibrasi soal lain (MK7); ini soal ekonomi keputusan." },
          ],
        },
        {
          q: "Kampanye retensi ke semua \u201Cberisiko\u201D berisiko membangunkan sleeping dogs. Solusi?",
          options: [
            { text: "Target by uplift — hanya persuadable yang dihubungi (MK11)", why: "Risiko ≠ respons. Uplift memisahkan yang tertolong dari yang terganggu.", correct: true },
            { text: "Naikkan insentifnya", why: "Insentif lebih besar ke sleeping dogs = membangunkan lebih banyak." },
            { text: "Kirim lebih sering", why: "Frekuensi = gangguan; memperparah efek sleeping dogs." },
          ],
        },
      ],
    },
  ],
};
