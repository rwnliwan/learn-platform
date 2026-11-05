import type { V2Lesson } from "../lib/types";

export const mk14: V2Lesson = {
  slug: "mk14-pricing",
  track: "Marketing Analytics",
  module: "Pricing & Promo",
  title: "MK14 — Pricing & Efektivitas Promo",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-kriukku",
      eyebrow: "Langkah 1 · Cerita KriukKu",
      title: "Promo 50%: volume +300%, rugi Rp800 juta",
      prose: [
        "KriukKu diskon 50%: volume meledak +300%. Tim merayakan — sampai finance datang: rugi Rp800 juta. Volume naik, margin per unit hancur, total profit anjlok.",
        "Promo dinilai by profit inkremental, bukan volume. Tiga angka yang wajib dihitung setiap promo: lift bersih (bukan kotor), kanibalisasi (makan produk sendiri), dan net profit (setelah semua biaya).",
        "Lesson ini: elastisitas, matematika promo, harga optimal, dan psikologi harga.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Merayakan lift kotor (+300% volume) tanpa menghitung margin. Volume = vanity; profit inkremental = sanity.",
        type: "pitfall",
      },
      reference: "Promo dinilai by profit inkremental, bukan volume.",
    },
    {
      id: "elastisitas-lab",
      eyebrow: "Langkah 2 · Elastisitas & lab",
      title: "Elastisitas arc: E = −2,08",
      prose: [
        "Elastisitas arc = %ΔQ / %ΔP dengan rata-rata sebagai basis. Worked: harga Rp10rb→Rp8rb, quantity 10.000→16.000. %ΔQ = 6.000/13.000 = 46,2%; %ΔP = −2.000/9.000 = −22,2%; E = −2,08 (elastis: |E|>1).",
        "Revenue: Rp100jt → Rp128jt (+28%) — terlihat bagus. Profit: margin Rp3rb→Rp1rb; 30jt → 16jt (−47%). Inilah jebakan: elastis + margin tipis = revenue naik, profit hancur.",
        "Di lab ini kamu menghitung elastisitas arc. |E|>1 = elastis (hati-hati potong margin); |E|<1 = inelastis (ruang naikkan harga).",
      ],
      formula: String.raw`E = \frac{(Q_2-Q_1)/((Q_1+Q_2)/2)}{(P_2-P_1)/((P_1+P_2)/2)}`,
      formulaNote: "E = elastisitas harga arc: Q1,Q2 = quantity sebelum/sesudah; P1,P2 = harga sebelum/sesudah. Basis rata-rata ((Q1+Q2)/2) membuat E simetris — tidak tergantung arah perubahan. |E|>1 = elastis (quantity sensitif); |E|<1 = inelastis; E=−1 = uniter. Tanda negatif = hukum demand (harga naik, quantity turun).",
      tasks: [
        { id: "t1", text: "Hitung `pct_q` dan `pct_p` (perubahan relatif arc)" },
        { id: "t2", text: "Hitung `E` = pct_q / pct_p, cetak" },
      ],
      expected: "E=-2.08 (elastis)",
      hints: [
        "pct_q = (q2-q1) / ((q1+q2)/2).",
        "pct_p = (p2-p1) / ((p1+p2)/2) — akan negatif.",
        "E = pct_q / pct_p ≈ −2,08.",
      ],
      code: {
        starter: `p1, p2 = 10000, 8000\nq1, q2 = 10000, 16000\n\n# TULIS KODEMU: elastisitas arc\npct_q =\npct_p =\nE =\n\nprint(f"E={E:.2f} " + ("elastis" if abs(E) > 1 else "inelastis"))`,
        lockLines: 2,
        solution: `p1, p2 = 10000, 8000\nq1, q2 = 10000, 16000\n\n# TULIS KODEMU: elastisitas arc\npct_q = (q2 - q1) / ((q1 + q2) / 2)\npct_p = (p2 - p1) / ((p1 + p2) / 2)\nE = pct_q / pct_p\n\nprint(f"E={E:.2f} " + ("elastis" if abs(E) > 1 else "inelastis"))`,
        checks: [
          { kind: "equal", task: "t2", name: "E", value: -2.0769, tol: 0.01, label: "`E` sekitar −2,08", msg: "(6.000/13.000) / (−2.000/9.000) = −2,08." },
          { kind: "stdout_matches", task: "t2", pattern: "elastis", label: "`print` menyebut elastis", msg: "|−2,08| > 1 = elastis." },
        ],
      },
      reference: "|E|>1 elastis; |E|<1 inelastis; E=−1 uniter.",
    },
    {
      id: "promo-bersih",
      eyebrow: "Langkah 3 · Matematika promo",
      title: "Lift bersih 210%, net −Rp4 juta",
      prose: [
        "Worked example lesson lama: lift bersih = (40−10−6−3)/10 = 210%. Dari 40 unit saat promo: 10 baseline (beli juga tanpa promo), 6 kanibalisasi (pindah dari produk lain), 3 subsidi murni — sisanya yang benar-benar inkremental.",
        "Net: −Rp4jt. Promo \u201Csukses\u201D 210% ternyata merugikan setelah dihitung bersih. Kanibalisasi 62,5% = sebagian besar \u201Cpertumbuhan\u201D promo hanyalah memindahkan penjualan antar-produk sendiri.",
        "Checklist tiap promo: (1) lift bersih vs kotor; (2) kanibalisasi antar-SKU; (3) pull-forward (beli lebih awal, bukan lebih banyak); (4) net profit setelah biaya promo.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Promo yang sering melatih pelanggan menunggu diskon — baseline perlahan turun dan \u201Cnormal\u201D menjadi harga promo. Kerusakan jangka panjang ini tidak terlihat di laporan promo per-event.",
        type: "risk",
      },
      reference: "Hitung lift bersih, kanibalisasi, pull-forward, net profit.",
    },
    {
      id: "harga-optimal",
      eyebrow: "Langkah 4 · Harga optimal",
      title: "P* = c / (1 + 1/ε)",
      prose: [
        "Harga profit-maksimal: P* = c / (1 + 1/ε), di mana c = biaya marginal, ε = elastisitas (negatif). Worked: c=Rp4rb, ε=−1,83 → P* ≈ Rp8.810.",
        "Bacanya: makin inelastis (|ε| kecil), makin tinggi markup optimal. Produk inelastis (ε=−1,2) → markup besar; komoditas elastis (ε=−5) → markup tipis.",
        "Batas rumus: asumsi elastisitas konstan dan tanpa reaksi kompetitor. Pakai sebagai titik awal, bukan vonis — validasi dengan eksperimen harga (MK9) di segmen kecil.",
      ],
      formula: String.raw`P^* = \frac{c}{1 + 1/\varepsilon}`,
      formulaNote: "P* = harga profit-maksimal: c = biaya marginal per unit; epsilon = elastisitas harga (negatif, mis. −1,83). Makin inelastis (|epsilon| kecil), penyebut makin kecil, P* makin tinggi — markup besar. Berlaku di sekitar epsilon yang diestimasi; elastisitas berubah sepanjang kurva demand, dan kompetitor bisa bereaksi.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai elastisitas dari satu titik untuk semua level harga. Elastisitas berubah sepanjang kurva demand — P* hanya valid di sekitar ε yang diestimasi.",
        type: "pitfall",
      },
      reference: "P* = titik awal. Validasi dengan eksperimen harga.",
    },
    {
      id: "psikologi-harga",
      eyebrow: "Langkah 5 · Psikologi harga",
      title: "Charm, prestige, decoy, bundle, freemium",
      prose: [
        "Charm pricing: Rp99rb terasa jauh lebih murah dari Rp100rb (digit kiri). Prestige: harga tinggi = sinyal kualitas (parfum, jam). Decoy: opsi tengah yang \u201Cmenang\u201D karena ada opsi mahal sebagai jangkar.",
        "Bundle: gabungkan produk slow-moving dengan hero (naikkan attach rate). Freemium: gratis sebagai akuisisi, konversi ke paid (waspadai free-rider abadi — batasi fitur, bukan waktu, untuk B2B).",
        "Semuanya taktik — strateginya tetap elastisitas dan unit economics. Psikologi menggeser kurva sedikit; elastisitas menentukan bentuknya.",
      ],
      tasks: [],
      reference: "Taktik psikologi di atas fondasi elastisitas.",
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
          q: "E = −2,08. Jika harga naik 10%, quantity turun sekitar?",
          options: [
            { text: "20,8% — elastis, sensitif harga", why: "%ΔQ = E × %ΔP = −2,08 × 10%.", correct: true },
            { text: "10%", why: "Itu kalau E = −1 (uniter)." },
            { text: "2,08%", why: "Kebalik — elastisitas mengalikan, bukan membagi." },
          ],
        },
        {
          q: "Promo: volume +300%, profit −47%. Kesimpulan?",
          options: [
            { text: "Promo gagal — dinilai by profit inkremental, bukan volume", why: "KriukKu: rugi Rp800jt di balik volume yang merayakan.", correct: true },
            { text: "Promo sukses — volume naik", why: "Volume = vanity. Profit yang membayar gaji." },
            { text: "Naikkan diskonnya", why: "Memperparah margin yang sudah hancur." },
          ],
        },
        {
          q: "Elastisitas −1,0 (uniter). Artinya?",
          options: [
            { text: "%ΔQ = %ΔP — revenue tidak berubah oleh perubahan harga kecil", why: "Efek harga dan quantity saling meniadakan.", correct: true },
            { text: "Tidak sensitif harga", why: "Itu inelastis (|E|<1)." },
            { text: "Sangat sensitif", why: "Itu elastis (|E|>1)." },
          ],
        },
      ],
    },
    {
      id: "adv-ab-pricing",
      eyebrow: "Langkah 7 · A/B pricing",
      title: "Eksperimen harga tanpa membakar brand",
      prose: [
        "Elastisitas dari data historis = korelasi (harga turun saat promo yang juga diiklankan — efeknya tercampur). Cara kausal: eksperimen harga. Tetapi randomisasi harga per individu berbahaya: pelanggan yang tahu membayar lebih mahal protes — backlash brand.",
        "Desain yang aman: (1) geo-test — harga berbeda per kota/wilayah (umum di retail); (2) fenced test — harga berbeda per segmen yang tidak saling bertemu (member vs non-member, channel berbeda); (3) waktu terbatas — 2–4 minggu, lalu evaluasi. Jangan pernah: harga berbeda untuk dua orang di kasir yang sama.",
        "Worked: 10 kota harga Rp10rb vs 10 kota Rp9rb selama 4 minggu. Quantity +12%, revenue +0,8%, profit −6% (margin tergerus). Kesimpulan: demand elastis tetapi profit inelastis terhadap penurunan — harga bertahan. Tanpa eksperimen, 'quantity naik' akan disalahartikan sebagai sukses.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kenapa eksperimen harga per individu (acak per user) berbahaya?",
          options: [
            { text: "Backlash keadilan — pelanggan yang tahu membayar lebih mahal protes dan merusak brand", why: "Harga dirasakan sebagai janji keadilan; pelanggaran terasa personal.", correct: true },
            { text: "Tidak berbahaya — itu standar", why: "Standarnya geo/fenced test, bukan acak per individu." },
            { text: "Terlalu mahal", why: "Bukan soal biaya — soal kepercayaan." },
            { text: "Hasilnya tidak valid", why: "Valid secara statistik; masalahnya bisnis dan etis." },
          ],
        },
        {
          q: "Geo test: harga −10% → quantity +12%, profit −6%. Keputusan?",
          options: [
            { text: "Harga bertahan — quantity naik tidak menutup margin yang tergerus", why: "Profit −6% = eksperimen gagal secara ekonomi, berapa pun quantity-nya.", correct: true },
            { text: "Turunkan harga — quantity naik", why: "Quantity = vanity; profit yang membayar gaji (pelajaran KriukKu)." },
            { text: "Naikkan harga 10%", why: "Tidak ada data untuk itu — eksperimen hanya menguji penurunan." },
            { text: "Ulangi dengan diskon 20%", why: "Memperparah margin tanpa dasar." },
          ],
        },
      ],
      reference: "Eksperimen harga = geo/fenced, terbatas waktu. Nilai by profit.",
    },
    {
      id: "lab-kanibal",
      eyebrow: "Langkah 8 · Lab kanibalisasi",
      title: "Lab: promo yang 'sukses' 300% ternyata rugi Rp7 juta",
      prose: [
        "Di lab ini kamu menghitung net profit promo secara lengkap: inkremental murni dikurangi kerugian kanibalisasi (pindah dari SKU lain) dan pull-forward (beli lebih awal dengan margin lebih kecil).",
        "Coba: ubah kanibal menjadi 2.000. Pada titik kanibalisasi berapa promo ini impas? (Jawaban: net = 0 saat rugi_kanibal + rugi_pullfwd = profit_promo.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `inkremental` = promo_vol − baseline − kanibal − pull_fwd" },
        { id: "t2", text: "Hitung `net` = profit inkremental − rugi kanibal − rugi pull-forward, cetak" },
      ],
      expected: "inkremental=19000 net=-7000000",
      hints: [
        "inkremental = promo_vol - baseline - kanibal - pull_fwd.",
        "profit_promo = inkremental * margin_promo.",
        "rugi_kanibal = kanibal * margin_lain; rugi_pullfwd = pull_fwd * (margin_normal - margin_promo).",
        "net = profit_promo - rugi_kanibal - rugi_pullfwd = −7jt.",
      ],
      code: {
        starter: `baseline, promo_vol = 10000, 40000
margin_normal, margin_promo, margin_lain = 3000, 1000, 2500
kanibal, pull_fwd = 8000, 3000

# TULIS KODEMU: inkremental murni dan net profit promo
inkremental =
profit_promo =
rugi_kanibal =
rugi_pullfwd =
net =

print(f"inkremental={inkremental} net={net}")`,
        lockLines: 3,
        solution: `baseline, promo_vol = 10000, 40000
margin_normal, margin_promo, margin_lain = 3000, 1000, 2500
kanibal, pull_fwd = 8000, 3000

# TULIS KODEMU: inkremental murni dan net profit promo
inkremental = promo_vol - baseline - kanibal - pull_fwd
profit_promo = inkremental * margin_promo
rugi_kanibal = kanibal * margin_lain
rugi_pullfwd = pull_fwd * (margin_normal - margin_promo)
net = profit_promo - rugi_kanibal - rugi_pullfwd

print(f"inkremental={inkremental} net={net}")`,
        checks: [
          { kind: "equal", task: "t1", name: "inkremental", value: 19000, tol: 1e-9, label: "`inkremental` seharusnya 19000", msg: "40.000 − 10.000 − 8.000 − 3.000. Hanya ini yang benar-benar baru." },
          { kind: "equal", task: "t2", name: "net", value: -7000000, tol: 1, label: "`net` seharusnya −7000000", msg: "19jt − 20jt − 6jt. Promo 'sukses' yang merugikan." },
          { kind: "stdout_matches", task: "t2", pattern: "net=-7000000", label: "`print` menampilkan net", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Net = inkremental×margin_promo − kanibal×margin_lain − pullfwd×selisih margin.",
    },
    {
      id: "adv-matrik-substitusi",
      eyebrow: "Langkah 9 · Substitusi",
      title: "Matriks kanibalisasi: promo A memakan siapa?",
      prose: [
        "Kanibalisasi bukan satu angka — ia matriks: promo SKU A mencuri berapa dari B, C, D. Cross-elasticity E_AB = %ΔQ_B / %ΔP_A: positif = substitusi (A murah → B turun), negatif = komplemen (A murah → B ikut naik, mis. mie + telur).",
        "Worked: promo mie −20% → Q mie +40%, Q telur +15% (komplemen, E = −0,75), Q bihun −25% (substitusi, E = +1,25). Net portofolio = +40%×margin_mie + 15%×margin_telur − 25%×margin_bihun. Jika margin bihun tinggi, promo mie bisa merugikan portofolio walau mie-nya 'sukses'.",
        "Aturan: promo tidak pernah dievaluasi per SKU — selalu per portofolio. Dan jadwalkan promo substitusi bergantian, bukan bersamaan: dua SKU substitusi promo bareng = mereka saling makan dengan diskon ganda.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Promo mie: Q telur +15% (komplemen), Q bihun −25% (substitusi, margin tinggi). Evaluasi?",
          options: [
            { text: "Hitung net portofolio — promo mie bisa merugikan total walau mie-nya sukses", why: "Keputusan promo = efek ke seluruh portofolio, bukan satu SKU.", correct: true },
            { text: "Sukses — mie +40%", why: "Mengabaikan bihun bermargin tinggi yang dikanibal." },
            { text: "Gagal — bihun turun", why: "Belum tentu gagal; butuh hitungan net portofolio." },
            { text: "Hentikan semua promo", why: "Berlebihan; yang dibutuhkan evaluasi portofolio." },
          ],
        },
      ],
      reference: "Evaluasi promo per portofolio via cross-elasticity, bukan per SKU.",
    },
    {
      id: "intuisi-pesan",
      eyebrow: "Langkah 10 · Intuisi",
      title: "Harga bukan angka — ia kalimat",
      prose: [
        "KriukKu rugi Rp800 juta bukan karena salah hitung diskon, melainkan karena lupa bahwa harga berbicara. Tiga heuristik mendengarkan apa yang dikatakannya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: setiap harga adalah pesan tentang siapa pelangganmu — pastikan pesannya benar",
        body: "Heuristik pertama: diskon adalah narkoba — dosis pertama gratis, berikutnya wajib. Setiap promo melatih pelanggan menunggu promo berikutnya; baseline perlahan turun dan 'harga normal' menjadi fiksi. Sebelum promo, hitung bukan hanya net event ini, tetapi tren baseline 3 bulan setelahnya. Promo yang 'net positif' tetapi merusak baseline = menang pertempuran, kalah perang. Heuristik kedua: elastisitas tanpa margin = setengah persamaan. E = −2,08 terdengar hebat ('demand responsif!') sampai kamu sadar margin Rp3rb → Rp1rb: revenue +28%, profit −47%. Selalu pasangkan elastisitas dengan simulasi profit — dan ingat elastisitas berubah sepanjang kurva: angka dari satu titik promo tidak berlaku untuk semua level harga. Heuristik ketiga: harga yang 'benar' secara matematika bisa salah secara strategis. P* = Rp8.810 mungkin memaksimalkan profit kuartal ini, tetapi jika kompetitor menjual Rp7.500 dan pelangganmu sensitif merek, P* mengundang perang harga. Rumus memberi titik awal; strategi memberi batas: positioning, reaksi kompetitor, dan nilai brand jangka panjang. Analis hebat menyajikan P* beserta 'tapi'-nya — bukan P* sebagai vonis.",
      },
      reference: "Hitung efek baseline; pasangkan elastisitas dengan profit; rumus = titik awal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 11 · Peta keputusan",
      title: "Peta keputusan: promo yang menaikkan laba, bukan sekadar volume",
      prose: [
        "Skenario satu — sebelum promo: hitung matematika promo (diskon × volume inkremental vs margin hilang di volume base). KriukKu rugi Rp800jt karena yang dihitung hanya volume naik.",
        "Skenario dua — memilih kedalaman diskon: 30% untuk SKU hero, bukan 50%. Uji elastisitas dulu — diskon 50% sering hanya membeli 10% volume tambahan di atas diskon 30%.",
        "Skenario tiga — kanibalisasi: monitor matriks substitusi per SKU selama promo. Promo SKU A yang memakan SKU B bermargin tinggi adalah pindah laba ke kiri.",
        "Skenario empat — pull-forward: estimasi persen pembeli yang hanya memajukan pembelian (30% di kasus KriukKu). Itu bukan penjualan baru — jangan rayakan.",
        "Skenario lima — guardrail: ukur baseline 4 minggu sebelum, tetapkan metrik penjaga (margin total, bukan unit). Promo tanpa guardrail adalah eksperimen tanpa rem.",
        "Aturan praktis 10 detik: matematika promo positif bersih? Kanibalisasi dimonitor? Pull-forward diestimasi? Guardrail margin terpasang? Durasi dibatasi (2 minggu, bukan selamanya)?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengukur sukses promo dari unit terjual. Unit naik 3x dengan margin total turun = promo yang sukses menghancurkan laba. Yang dirayakan harus laba inkremental bersih, bukan volume.",
      },
      reference: "Matematika promo dulu → diskon secukupnya → monitor kanibal → guardrail margin.",
    },
    {
      id: "minicase-kriukku2",
      eyebrow: "Langkah 12 · Mini-case",
      title: "KriukKu, bagian 2: promo yang jujur",
      prose: [
        "Setahun setelah rugi Rp800jt, KriukKu merancang promo dengan disiplin. Rencana: diskon 30% (bukan 50%) untuk SKU hero, 2 minggu, dengan guardrail: (a) baseline diukur 4 minggu sebelum (rata-rata 10.000 unit/minggu); (b) matriks kanibalisasi dimonitor per SKU; (c) pull-forward diestimasi dari pola historis (30% pembeli promo = maju 2 minggu).",
        "Hasil: promo_vol 28.000/minggu, kanibal 4.000 (margin SKU lain Rp2.500), pull_fwd 3.000. Inkremental = 28.000 − 10.000 − 4.000 − 3.000 = 11.000; margin_promo Rp2.000 → profit 22jt; rugi kanibal 10jt; rugi pullfwd 3.000 × Rp1.000 = 3jt; net = +Rp9jt/minggu. Ditambah: baseline pasca-promo turun hanya 3% (vs 15% pada promo 50% dulu) — diskon moderat tidak merusak harga referensi separah dulu.",
        "Pertanyaan: (1) Mengapa promo 30% ini 'jujur' sedangkan 50% dulu tidak? (2) Apa peran guardrail baseline? (3) Kapan promo boleh diulang?",
        "Pembahasan: (1) Net dihitung lengkap (inkremental − kanibal − pull-forward) dan positif; kerusakan baseline minimal. (2) Guardrail memastikan 'keberhasilan' tidak dibayar dengan masa depan — baseline −3% vs −15% adalah buktinya. (3) Boleh diulang jika: net tetap positif, baseline stabil, dan jeda cukup agar pelanggan tidak terlatih menunggu (minimal 8–12 minggu).",
      ],
      tasks: [],
      quiz: [
        {
          q: "KriukKu 2: net +Rp9jt/minggu, baseline −3%. Bandingkan dengan promo 50% dulu (rugi 800jt, baseline −15%). Pelajaran?",
          options: [
            { text: "Desain promo menentukan: diskon moderat + hitungan lengkap + guardrail = promo yang jujur", why: "Bukan promonya yang jahat — melainkan desain dan evaluasinya.", correct: true },
            { text: "Promo selalu merugikan", why: "Kasus ini membuktikan promo bisa net positif dengan disiplin." },
            { text: "Diskon 30% selalu aman", why: "Tidak ada yang 'selalu' — hitungannya yang menentukan, bukan angkanya." },
            { text: "Baseline tidak penting", why: "−3% vs −15% = perbedaan kerusakan jangka panjang yang material." },
          ],
        },
        {
          q: "Syarat mengulang promo yang disiplin?",
          options: [
            { text: "Net positif + baseline stabil + jeda 8–12 minggu agar tidak melatih menunggu", why: "Tiga syarat mencegah narkoba diskon.", correct: true },
            { text: "Segera ulangi selagi hangat", why: "Frekuensi tinggi = melatih pelanggan menunggu = baseline runtuh." },
            { text: "Naikkan diskonnya bertahap", why: "Eskalasi diskon = eskalasi kerusakan baseline." },
            { text: "Ulangi tiap bulan rutin", why: "Rutin = dapat diprediksi = pelanggan menunggu." },
          ],
        },
      ],
      reference: "Promo disiplin: net lengkap + guardrail baseline + jeda.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Pricing = matematika + psikologi, dengan profit sebagai wasit.",
      ],
      tasks: [],
      summary: [
        "Elastisitas arc; |E|>1 elastis, |E|<1 inelastis, −1 uniter.",
        "Revenue bisa naik (+28%) saat profit hancur (−47%) — waspadai margin.",
        "Promo: hitung lift bersih, kanibalisasi (62,5%), pull-forward, net profit.",
        "P* = c/(1+1/ε) ≈ Rp8.810 (contoh); validasi dengan eksperimen.",
        "Charm/prestige/decoy/bundle/freemium = taktik di atas fondasi elastisitas.",
        "Eksperimen harga via geo/fenced test; nilai by profit, bukan quantity.",
        "Evaluasi promo per portofolio: inkremental - kanibalisasi - pull-forward.",
      ],
      next: { label: "MK15 — Forecasting", href: "/learn/mk15-forecasting" },
      quiz: [
        {
          q: "Harga Rp10rb→Rp8rb, Q 10.000→16.000, margin Rp3rb→Rp1rb. Kenapa profit turun?",
          options: [
            { text: "Margin per unit hancur 67% — kenaikan volume tidak menutupnya", why: "30jt → 16jt. Elastis (−2,08) tidak cukup melawan margin yang runtuh.", correct: true },
            { text: "Volume kurang naik", why: "+60% volume sudah besar — masalahnya margin, bukan volume." },
            { text: "Elastisitas salah hitung", why: "−2,08 benar; ia justru menjelaskan kenapa volume naik banyak." },
          ],
        },
        {
          q: "Kanibalisasi 62,5% pada promo. Artinya?",
          options: [
            { text: "Sebagian besar \u201Cpertumbuhan\u201D = pindahan dari produk sendiri", why: "Bukan pasar baru — kantong kiri ke kantong kanan.", correct: true },
            { text: "Promo menaikkan total pasar 62,5%", why: "Terbalik: itu porsi yang bukan inkremental." },
            { text: "Tidak masalah", why: "Margin produk yang dikanibal bisa lebih tinggi — rugi bersih." },
          ],
        },
        {
          q: "ε = −1,2 vs ε = −5. Mana yang markup optimalnya lebih besar?",
          options: [
            { text: "ε = −1,2 — inelastis = ruang markup besar", why: "P* = c/(1+1/ε): |ε| kecil → penyebut kecil → P* tinggi.", correct: true },
            { text: "ε = −5", why: "Elastis = pelanggan kabur saat harga naik — markup tipis." },
            { text: "Sama", why: "Rumusnya eksplisit tergantung ε." },
          ],
        },
        {
          q: "Pull-forward effect dalam promo artinya?",
          options: [
            { text: "Pelanggan beli lebih awal, bukan lebih banyak — mencuri penjualan masa depan", why: "Promo bulan ini = lubang bulan depan. Net jangka panjang ≈ 0.", correct: true },
            { text: "Promo menarik pelanggan baru", why: "Itu akuisisi — beda mekanisme." },
            { text: "Stok menumpuk", why: "Itu masalah supply, bukan pull-forward." },
          ],
        },
        {
          q: "Kapan charm pricing (Rp99rb) paling efektif?",
          options: [
            { text: "Pembelian impulsif/low-involvement — digit kiri mendominasi persepsi", why: "Efek melemah untuk pembelian mahal yang dipertimbangkan lama.", correct: true },
            { text: "Selalu, untuk semua produk", why: "Untuk B2B/prestise, 99rb justru merusak citra." },
            { text: "Tidak pernah terbukti", why: "Efeknya terdokumentasi luas, walau kecil." },
          ],
        },
      ],
    },
  ],
};
