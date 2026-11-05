import type { V2Lesson } from "../lib/types";

export const mk12: V2Lesson = {
  slug: "mk12-attribution",
  track: "Marketing Analytics",
  module: "Atribusi",
  title: "MK12 — Atribusi Multi-Touch",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-gadgetku",
      eyebrow: "Langkah 1 · Cerita GadgetKu",
      title: "Last-click membunuh channel yang bekerja",
      prose: [
        "GadgetKu memakai last-click: Search dapat kredit Rp8M, Sosmed Rp1M. Keputusan: potong Sosmed 70%. Sebulan kemudian Search anjlok 40% — ternyata Sosmed yang mengenalkan produk, Search yang memanen.",
        "Last-click memberi semua kredit ke sentuhan terakhir — seperti memberi seluruh gol ke penyerang dan memecat gelandang yang mengumpan. Channel pembuka (introducer) selalu terlihat tidak berguna di last-click.",
        "Lesson ini: lima model rule-based, Markov, Shapley, dan kenapa semuanya tetap bukan kausal (MK10).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Keputusan potong-budget by last-click bisa membunuh channel pembuka dan meruntuhkan channel penutup sekaligus — kerugian ganda dari satu metrik yang salah.",
        type: "risk",
      },
      reference: "Last-click = kredit ke finisher. Buta terhadap pembuka.",
    },
    {
      id: "rule-based",
      eyebrow: "Langkah 2 · Rule-based & lab",
      title: "Lima model, satu journey",
      prose: [
        "Journey: Sosmed → Email → Search, revenue Rp1jt. Lima model membagi kredit berbeda: first-click (Sosmed 1jt), last-click (Search 1jt), linear (masing-masing Rp333rb), time-decay (bobot 1-2-4: Rp143rb / Rp286rb / Rp571rb), position-based 40-20-40 (Rp400rb / Rp200rb / Rp400rb).",
        "Tidak ada yang \u201Cbenar\u201D — semuanya aturan, bukan pengukuran kausal. Gunanya: membuat bias tiap model eksplisit. Kalau keputusanmu berubah tergantung model, keputusanmu belum berbasis bukti — butuh eksperimen (MK10).",
        "Di lab ini kamu menghitung pembagian linear dan position-based. Lihat sendiri betapa \u201Ckontribusi channel\u201D bergantung pada aturan yang dipilih.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `linear` = revenue / 3" },
        { id: "t2", text: "Hitung `pos` = [0.4, 0.2, 0.4] × revenue, cetak" },
      ],
      expected: "linear=333333 pos=[400000, 200000, 400000]",
      hints: [
        "linear = revenue / n_touch.",
        "pos = [w * revenue for w in [0.4, 0.2, 0.4]].",
        "1.000.000 / 3 = 333.333; 0,4 × 1jt = 400rb.",
      ],
      code: {
        starter: `# Journey: Sosmed -> Email -> Search, revenue Rp1jt\nrevenue = 1_000_000\nn_touch = 3\nbobot_pos = [0.4, 0.2, 0.4]\n\n# TULIS KODEMU: linear & position-based\nlinear =\npos =\n\nprint(f"linear={linear:.0f} pos={pos}")`,
        lockLines: 4,
        solution: `# Journey: Sosmed -> Email -> Search, revenue Rp1jt\nrevenue = 1_000_000\nn_touch = 3\nbobot_pos = [0.4, 0.2, 0.4]\n\n# TULIS KODEMU: linear & position-based\nlinear = revenue / n_touch\npos = [w * revenue for w in bobot_pos]\n\nprint(f"linear={linear:.0f} pos={pos}")`,
        checks: [
          { kind: "equal", task: "t1", name: "linear", value: 333333, tol: 1, label: "`linear` seharusnya 333333", msg: "1.000.000 / 3." },
          { kind: "equal", task: "t2", name: "pos", value: 400000, tol: 1, label: "`pos[0]` seharusnya 400000", msg: "0,4 × 1.000.000. Cek bobot position-based." },
          { kind: "stdout_matches", task: "t2", pattern: "linear=333333", label: "`print` menampilkan linear", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Atribusi rule-based = aturan pembagian, bukan pengukuran kausal.",
    },
    {
      id: "markov",
      eyebrow: "Langkah 3 · Markov",
      title: "Removal effect: seberapa penting channel ini?",
      prose: [
        "Model Markov: user bergerak antar-state (channel) dengan probabilitas transisi; conversion = absorbing state. Removal effect channel X = berapa % conversion hilang jika X dihapus dari graph.",
        "Worked example: removal effect Email = 30% — tanpa Email, conversion turun 30%. Ini menjawab pertanyaan GadgetKu dengan lebih jujur dari rule-based: bukan \u201Csiapa dapat kredit\u201D, melainkan \u201Capa yang hilang tanpanya\u201D.",
        "Keterbatasan: Markov masih observasional — ia mengukur ketergantungan jalur, bukan kausalitas. Untuk kausal, tetap butuh eksperimen (MK10).",
      ],
      tasks: [],
      reference: "Removal effect = % conversion hilang tanpa channel itu.",
    },
    {
      id: "shapley",
      eyebrow: "Langkah 4 · Shapley",
      title: "Pembagian adil ala teori permainan",
      prose: [
        "Shapley value: kontribusi rata-rata channel di semua urutan kedatangan yang mungkin. Adil secara aksiomatis — memenuhi efisiensi, simetri, dan dummy.",
        "Worked 2 channel: A=35, B=65 (dari Rp100). Worked 3 channel: A=23,33, B=33,33, C=43,33. Jumlahnya selalu pas 100 — tidak ada kredit yang hilang atau ganda.",
        "Kapan dipakai: alokasi budget kooperatif antar-tim channel (semua pihak menerima \u201Ckeadilan\u201D-nya). Bukan untuk pengukuran kausal — Shapley tetap di dunia observasional.",
      ],
      formula: String.raw`\phi_i = \sum_{S} \frac{|S|!(n-|S|-1)!}{n!} \big[v(S \cup \{i\}) - v(S)\big]`,
      formulaNote: "phi_i = Shapley value channel i (kredit 'adil'-nya): n = jumlah channel; S = subset channel tanpa i; v(S) = nilai (conversion/revenue) yang dihasilkan subset S; v(S gabung i) − v(S) = kontribusi marginal i saat bergabung dengan S. Bobot |S|!(n−|S|−1)!/n! = peluang urutan kedatangan itu terjadi. Dijumlahkan ke semua S = rata-rata kontribusi marginal di semua urutan. Adil secara aksiomatis, tetapi tetap observasional — bukan kausal.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menganggap Shapley = kausal karena \u201Cadil\u201D. Keadilan matematis ≠ kausalitas. Shapley membagi kredit observasi dengan adil; ia tidak bilang apa yang terjadi jika channel dimatikan.",
        type: "pitfall",
      },
      reference: "Shapley = adil, bukan kausal. Untuk alokasi kooperatif.",
    },
    {
      id: "dda-cookieless",
      eyebrow: "Langkah 5 · DDA & cookieless",
      title: "Data-driven attribution di dunia tanpa cookie",
      prose: [
        "DDA (Google/Meta): machine learning membagi kredit by pola historis. Lebih adaptif dari rule-based, tapi black-box — kamu tidak tahu kenapa kreditnya begitu, dan tidak bisa diaudit.",
        "Cookieless: third-party cookie mati (MK2). Atribusi berbasis cookie makin buta. Masa depan: first-party data + server-side + modeled conversion + eksperimen sebagai jangkar kebenaran.",
        "Prinsip penutup: atribusi untuk alokasi sehari-hari boleh; tapi kalibrasi berkala dengan eksperimen (MK10) wajib. Atribusi yang tidak pernah divalidasi eksperimen = dongeng yang konsisten.",
      ],
      tasks: [],
      reference: "DDA = adaptif tapi black-box. Jangkar kebenaran = eksperimen.",
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
          q: "Last-click: Search Rp8M, Sosmed Rp1M. Setelah potong Sosmed, Search anjlok 40%. Pelajaran?",
          options: [
            { text: "Last-click buta terhadap channel pembuka — Sosmed yang mengenalkan", why: "Kredit 100% ke finisher menyembunyikan peran introducer.", correct: true },
            { text: "Search memang jelek", why: "Search anjlok karena kehilangan pasokan dari Sosmed, bukan karena Search jelek." },
            { text: "Potong lebih banyak lagi", why: "Memperparah kesalahan yang sama." },
          ],
        },
        {
          q: "Removal effect Email 30%. Artinya?",
          options: [
            { text: "Tanpa Email, conversion turun 30%", why: "Itulah definisi removal effect — kontribusi marginal di graph.", correct: true },
            { text: "Email dapat 30% kredit", why: "Bukan pembagian kredit — ini simulasi penghapusan." },
            { text: "Email menyebabkan 30% penjualan", why: "Masih observasional, bukan klaim kausal." },
          ],
        },
        {
          q: "Tim ribut soal pembagian kredit yang \u201Cadil\u201D antar-channel. Model?",
          options: [
            { text: "Shapley — adil secara aksiomatis, total pas 100", why: "Untuk alokasi kooperatif, keadilan yang disepakati > akurasi kausal.", correct: true },
            { text: "Last-click", why: "Justru sumber keributan (kasus GadgetKu)." },
            { text: "Eksperimen geo", why: "Itu untuk kausalitas, bukan untuk mendamaikan tim." },
          ],
        },
      ],
    },
    {
      id: "adv-multitouch-vs-lastclick",
      eyebrow: "Langkah 7 · Multi-touch vs last-click",
      title: "Kapan selisihnya penting — dan kapan tidak",
      prose: [
        "Tidak semua bisnis butuh multi-touch. Aturan praktis: jika >80% conversion hanya punya 1 sentuhan (mis. kebutuhan mendesak: 'servis AC'), last-click ≈ multi-touch — tidak ada yang perlu dibagi. Multi-touch menjadi penting saat journey panjang dan multi-channel: >40% conversion punya ≥3 sentuhan (mis. furnitur, travel, B2B).",
        "Worked GadgetKu: 1.000 conversion Rp1jt. Last-click: Search Rp800jt, Sosmed Rp100jt, Email Rp100jt. Linear multi-touch: Search Rp450jt, Sosmed Rp350jt, Email Rp200jt. Selisih Sosmed Rp250jt = 2,5x lipat — keputusan potong 70% yang diambil dari last-click berubah total jika memakai multi-touch.",
        "Keputusan: hitung distribusi panjang journey DULU. Journey pendek → last-click cukup, hemat kompleksitas. Journey panjang → pilih model sesuai tujuan: first-click untuk evaluasi pembuka, linear/time-decay untuk gambaran umum, Shapley untuk alokasi kooperatif antar-tim. Dan selalu ingat: semuanya observasional.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Bisnis servis AC: 85% conversion 1 sentuhan. Model atribusi?",
          options: [
            { text: "Last-click cukup — tidak ada yang perlu dibagi", why: "Multi-touch hanya penting saat journey multi-sentuhan signifikan.", correct: true },
            { text: "Tetap Shapley — lebih canggih", why: "Kecanggihan tanpa perbedaan hasil = kompleksitas sia-sia." },
            { text: "Markov — paling modern", why: "Modern tidak relevan jika journey-nya satu sentuhan." },
            { text: "DDA platform", why: "Black-box untuk masalah yang tidak ada = risiko tanpa manfaat." },
          ],
        },
        {
          q: "GadgetKu: Sosmed Rp100jt (last-click) vs Rp350jt (linear). Implikasi keputusan?",
          options: [
            { text: "Keputusan potong 70% harus dibatalkan — model mengubah kesimpulan", why: "Jika keputusan berubah tergantung model, keputusan belum berbasis bukti.", correct: true },
            { text: "Tetap potong — last-click standar industri", why: "'Standar' bukan argumen; biasnya terbukti di kasus ini." },
            { text: "Rata-ratakan kedua angka", why: "Mencampur dua model tidak menghasilkan kebenaran." },
            { text: "Pilih yang angkanya paling besar", why: "Cherry-picking model = membohongi diri sendiri." },
          ],
        },
      ],
      reference: "Journey pendek → last-click cukup. Panjang → pilih model sesuai tujuan.",
    },
    {
      id: "adv-jebakan-atribusi",
      eyebrow: "Langkah 8 · Jebakan atribusi",
      title: "Tiga cara atribusi berbohong dengan rapi",
      prose: [
        "Jebakan 1 — view-through yang tidak terlihat: atribusi memberi kredit ke display yang 'dilihat' padahal viewability 0% (iklan di bawah lipatan yang tidak pernah terlihat manusia). Kredit untuk sesuatu yang tidak terjadi. Solusi: syaratkan viewability ≥50% + 1 detik sebelum dihitung sebagai sentuhan.",
        "Jebakan 2 — retargeting memanen: dibahas di materi inkrementalitas — 92% conversion retargeting terjadi juga tanpa iklan, tetapi last-click memberi semua kredit ke retargeting. Solusi: jangan pernah menilai retargeting by atribusi; hanya by eksperimen/holdout.",
        "Jebakan 3 — DDA yang bergeser diam-diam: model machine learning platform di-update tanpa pemberitahuan; kredit channel berubah 30% dalam semalam padahal realitas tidak berubah. Solusi: catat versi/ tanggal setiap tarikan laporan DDA; perubahan mendadak = curigai modelnya, bukan bisnismu. Atribusi yang tidak diaudit = dongeng yang konsisten.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kredit display naik tajam, tetapi viewability tidak pernah dicek. Tindakan?",
          options: [
            { text: "Audit viewability dulu — kredit untuk iklan tak terlihat = fiktif", why: "Sentuhan yang tidak dilihat manusia bukan sentuhan.", correct: true },
            { text: "Naikkan budget display — kinerjanya bagus", why: "Scale di atas kredit fiktif = membayar untuk yang tidak terjadi." },
            { text: "Ganti ke model first-click", why: "Ganti model tidak memperbaiki data sentuhan yang fiktif." },
            { text: "Percaya DDA platform", why: "DDA juga memakan data view yang sama." },
          ],
        },
        {
          q: "DDA mengubah kredit channel 30% dalam semalam. Sikap?",
          options: [
            { text: "Curigai modelnya; cek changelog/version; validasi dengan eksperimen sebelum realokasi", why: "Perubahan model ≠ perubahan realitas. Jangkar kebenaran = eksperimen.", correct: true },
            { text: "Langsung realokasi mengikuti DDA", why: "Realokasi by black-box yang berubah = keputusan tanpa dasar." },
            { text: "Matikan DDA kembali ke last-click", why: "Mundur ke model yang lebih bias bukan solusi." },
            { text: "Tunggu seminggu, pasti kembali", why: "Berharap tanpa verifikasi = bukan strategi." },
          ],
        },
      ],
      reference: "Audit viewability; retargeting hanya by eksperimen; catat versi DDA.",
    },
    {
      id: "intuisi-akuntansi",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Atribusi membagi kue; eksperimen memastikan kue-nya ada",
      prose: [
        "Lima model, satu journey, lima jawaban — dan semuanya 'benar' menurut aturannya masing-masing. Tiga heuristik agar tidak tersesat di hutan model.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: atribusi adalah akuntansi, bukan fisika — ia membagi, bukan menjelaskan",
        body: "Heuristik pertama: tanyakan 'untuk apa' sebelum 'model apa'. Alokasi budget kooperatif antar-tim → Shapley (semua pihak menerima keadilannya). Memahami peran pembuka → first-click atau removal effect Markov. Laporan harian cepat → last-click atau linear, asal disadari biasnya. Tidak ada model terbaik — hanya model yang cocok untuk keputusan. Heuristik kedua: jika keputusanmu berubah tergantung model, kamu belum punya keputusan — kamu punya opini yang dibungkus matematika. GadgetKu memotong Sosmed 70% by last-click; by linear keputusannya terbalik. Ketika model-model tidak sepakat, satu-satunya jalan keluar adalah eksperimen: matikan Sosmed di beberapa kota, ukur yang terjadi. Atribusi untuk alokasi sehari-hari boleh; kalibrasi berkala dengan eksperimen wajib. Heuristik ketiga: atribusi yang tidak pernah divalidasi eksperimen = dongeng yang konsisten. Konsisten bukan benar — lima model rule-based konsisten satu sama lain dalam biasnya masing-masing. Jadwalkan validasi: tiap kuartal, satu channel diuji dengan holdout atau geo-experiment, hasilnya dibandingkan dengan klaim atribusi. Selisihnya = 'pajak kepercayaan' yang harus kamu bayar sebelum memakai angka atribusi untuk keputusan besar.",
      },
      reference: "Model mengikuti keputusan; tidak sepakat → eksperimen; validasi kuartalan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: model atribusi untuk keputusan apa",
      prose: [
        "Skenario satu — budget taktis mingguan: last-click boleh dipakai — cepat dan murah — selama tahu ia bias ke lower-funnel. Jangan pakai untuk keputusan strategik.",
        "Skenario dua — alokasi budget antar channel: butuh multi-touch (Markov atau Shapley) atau DDA. 60% journey GadgetKu dimulai dari Sosmed yang dinilai last-click hanya Rp1M dari kontribusi sebenarnya.",
        "Skenario tiga — era cookieless: DDA platform makin buta; validasi dengan geo-experiment. Model tanpa validasi eksperimen adalah peta tanpa kompas.",
        "Skenario empat — branded search: keluarkan dari perhitungan inkremental. 35% 'conversion Search' GadgetKu adalah branded — pelanggan yang sudah niat beli.",
        "Skenario lima — lima model lima jawaban: pilih model sesuai pertanyaan, dan catat pilihannya. Yang berbahaya bukan modelnya, melainkan ganti-ganti model sampai angkanya enak.",
        "Aturan praktis 10 detik: untuk keputusan apa model ini? Branded sudah di-net-off? Ada validasi eksperimen? Konsisten antar periode?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memotong channel upper-funnel karena last-click-nya kecil. Sosmed 'hanya' Rp1M di last-click tetapi memulai 60% journey — memotongnya seperti memecat pramugari karena tidak menerbangkan pesawat.",
      },
      reference: "Taktis = last-click boleh → strategik = multi-touch atau DDA → net-off branded → validasi eksperimen.",
    },
    {
      id: "minicase-gadgetku2",
      eyebrow: "Langkah 11 · Mini-case",
      title: "GadgetKu, bagian 2: audit atribusi Rp8 miliar",
      prose: [
        "Setahun setelah tragedi potong Sosmed, GadgetKu mengaudit total. Data: spend Search Rp4M (atribusi last-click Rp8M), Sosmed Rp3M (atribusi Rp1M), Email Rp1M (atribusi Rp1M). Total atribusi Rp10M. Tetapi: (a) 35% 'conversion Search' berasal dari branded keyword (non-inkremental); (b) journey rata-rata 3,2 sentuhan — 60% dimulai dari Sosmed; (c) geo test mematikan Sosmed 50%: Search turun 38%.",
        "Pertanyaan: (1) Berapa revenue inkremental yang sebenarnya? (2) Alokasi budget yang benar? (3) Model atribusi apa untuk monitoring harian?",
        "Pembahasan: (1) Branded 35% × Rp8M = Rp2,8M non-inkremental. Efek Sosmed ke Search: 38% × Rp8M ≈ Rp3M didukung Sosmed. Estimasi kasar inkremental total ≈ Rp10M − Rp2,8M (branded) − diskon retargeting harvesting ≈ Rp6M — bukan Rp10M. (2) Kembalikan Sosmed minimal ke Rp3M (terbukti pembuka), uji scale bertahap; potong branded search ke pertahanan minimal. (3) Position-based 40-20-40 atau time-decay untuk harian (menghargai pembuka), dengan kalibrasi geo tiap kuartal. Last-click dilarang untuk keputusan budget.",
      ],
      tasks: [],
      quiz: [
        {
          q: "GadgetKu: total atribusi Rp10M, tetapi 35% branded + Sosmed terbukti pembuka. Angka untuk keputusan?",
          options: [
            { text: "≈Rp6M inkremental — atribusi 10M adalah batas atas, bukan nilai", why: "Incremental ≤ attributed. Branded dan harvesting harus dikeluarkan.", correct: true },
            { text: "Rp10M — itu data resmi", why: "Resmi ≠ kausal; audit membuktikan komponen non-inkrementalnya." },
            { text: "Rp8M — fokus ke Search saja", why: "Search turun 38% tanpa Sosmed — Search tidak berdiri sendiri." },
            { text: "Rp1M — hanya Sosmed yang jujur", why: "Berlebihan; Search non-branded tetap punya nilai inkremental." },
          ],
        },
        {
          q: "Model atribusi untuk monitoring harian GadgetKu pasca-audit?",
          options: [
            { text: "Position-based/time-decay + kalibrasi geo kuartalan; last-click dilarang untuk budget", why: "Menghargai pembuka untuk harian; eksperimen sebagai jangkar kebenaran.", correct: true },
            { text: "Last-click — sederhana", why: "Itu yang menyebabkan tragedi bagian 1." },
            { text: "DDA platform saja", why: "Black-box tanpa kalibrasi = mengulang jebakan 3." },
            { text: "Tidak perlu atribusi lagi", why: "Atribusi harian tetap berguna untuk monitoring — hanya bukan untuk klaim kausal." },
          ],
        },
      ],
      reference: "Audit: keluarkan branded + harvesting; alokasi by inkremental.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Atribusi = cara membagi kredit; eksperimen = cara tahu kebenaran.",
      ],
      tasks: [],
      summary: [
        "Last-click bias ke finisher; bisa membunuh channel pembuka (GadgetKu).",
        "Rule-based (5 model) = aturan, bukan pengukuran; hasil tergantung aturan.",
        "Markov: removal effect = % conversion hilang tanpa channel itu.",
        "Shapley: adil & total pas; bukan kausal.",
        "DDA adaptif tapi black-box; jangkar kebenaran = eksperimen (MK10).",
        "Journey pendek: last-click cukup. Journey panjang: pilih model sesuai keputusan.",
        "Audit jebakan: viewability, retargeting harvesting, pergeseran DDA diam-diam.",
      ],
      next: { label: "MK13 — MMM", href: "/learn/mk13-mmm" },
      quiz: [
        {
          q: "Journey Sosmed→Email→Search Rp1jt. Kredit Email di tiap model?",
          options: [
            { text: "First/last: 0. Linear: 333rb. Position 40-20-40: 200rb", why: "Satu journey, empat jawaban — tergantung aturan.", correct: true },
            { text: "Selalu 333rb", why: "Itu hanya model linear." },
            { text: "Selalu 0 — Email tidak penting", why: "Removal effect 30% bilang sebaliknya." },
          ],
        },
        {
          q: "Kenapa Shapley jumlahnya selalu pas 100?",
          options: [
            { text: "Aksioma efisiensi — seluruh nilai dibagi habis", why: "Tidak ada kredit hilang/ganda. Itulah daya tariknya untuk alokasi.", correct: true },
            { text: "Kebetulan", why: "Bukan kebetulan — sifat matematis yang terbukti." },
            { text: "Karena dibulatkan", why: "Bukan pembulatan — struktur formulanya." },
          ],
        },
        {
          q: "Atribusi bilang channel X berkontribusi 40%. Klaim kausal yang sah?",
          options: [
            { text: "Tidak ada — butuh eksperimen untuk klaim kausal", why: "Semua model atribusi observasional. Incremental ≤ attributed.", correct: true },
            { text: "\u201CMatikan X, rugi 40%\u201D", why: "Itu klaim kausal dari data observasional — tidak sah." },
            { text: "\u201CX menyebabkan 40% penjualan\u201D", why: "Sama salahnya." },
          ],
        },
        {
          q: "DDA platform tiba-tiba mengubah kredit channel drastis. Sikap?",
          options: [
            { text: "Jangan panik — DDA black-box; validasi dengan eksperimen sebelum realokasi", why: "Perubahan model ≠ perubahan realitas. Jangkar = eksperimen.", correct: true },
            { text: "Langsung realokasi mengikuti DDA", why: "Realokasi by black-box yang berubah = keputusan tanpa dasar." },
            { text: "Matikan DDA, kembali ke last-click", why: "Mundur ke model yang lebih bias bukan solusi." },
          ],
        },
        {
          q: "Cookieless membuat atribusi berbasis cookie makin buta. Strategi?",
          options: [
            { text: "First-party + server-side + eksperimen sebagai jangkar", why: "Kombinasi MK2 + MK10. Tidak ada satu metrik ajaib pengganti cookie.", correct: true },
            { text: "Beli data pihak ketiga", why: "Itu memperdalam masalah privasi (MK18)." },
            { text: "Berhenti mengukur", why: "Menyerah bukan strategi." },
          ],
        },
      ],
    },
  ],
};
