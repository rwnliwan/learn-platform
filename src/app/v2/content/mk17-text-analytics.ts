import type { V2Lesson } from "../lib/types";

export const mk17: V2Lesson = {
  slug: "mk17-text-analytics",
  track: "Marketing Analytics",
  module: "Text Analytics",
  title: "MK17 — Text Analytics: Mendengar 10.000 Ulasan Sekaligus",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-antarcepat",
      eyebrow: "Langkah 1 · Cerita AntarCepat",
      title: "Rating 2,1 yang \u201Cmisterius\u201D",
      prose: [
        "Rating AntarCepat anjlok 4,5 → 2,1 dalam 2 bulan. Tiga sprint dihabiskan redesign UI — rating tetap 2,1. Lalu analis junior menambang 12.000 ulasan dalam 1 hari: 68% ulasan negatif menyebut \u201Cdriver\u201D dan \u201Clama\u201D — bukan UI. Masalahnya operasional, bukan produk.",
        "Redesign UI = mengobati yang tidak sakit. Pelanggan sudah memberi tahu masalahnya — tertulis, 12.000 kali — tapi tidak ada yang mendengar. Lesson ini: cara mendengar dalam skala besar.",
        "Tiga pendekatan: lexicon (cepat, transparan), ML (akurat, butuh label), LLM (paham konteks, butuh validasi). Ditambah dua teknik: aspect-based sentiment dan topic modeling.",
      ],
      tasks: [],
      reference: "Mulai dari pertanyaan, bukan dari model: \u201Cnegatif tentang apa?\u201D",
    },
    {
      id: "lexicon-lab",
      eyebrow: "Langkah 2 · Lexicon & lab",
      title: "Skor sentimen + negasi Bahasa Indonesia",
      prose: [
        "Lexicon: tiap kata punya bobot (\u201Cbagus\u201D +2, \u201Cparah\u201D −3); tangani negasi: \u201Ctidak\u201D/\u201Cnggak\u201D/\u201Cgak\u201D/\u201Cbukan\u201D yang tepat sebelum kata membalik tandanya. Skor = jumlah bobot × negasi.",
        "Worked: \u201Cdriver cepat dan ramah\u201D → +2+2 = +4 (positif). \u201Ctidak cepat, lama parah\u201D → −2−2−3 = −7 (negatif). Tanpa penanganan negasi, skornya salah besar.",
        "Kapan lexicon: eksplorasi cepat, Bahasa Indonesia (dengan kamus yang dirawat: slang \u201Clemot\u201D, \u201Cmantul\u201D), butuh transparansi. Batasnya: buta sarkasme (\u201Cbagus banget... telat 2 jam\u201D = negatif, lexicon bilang positif).",
      ],
      formula: String.raw`\text{skor} = \sum_w \text{bobot}(w) \times \text{negasi}(w)`,
      formulaNote: "skor = sentimen total satu teks: jumlahkan untuk semua kata w; bobot(w) = skor lexicon kata itu ('bagus' +2, 'parah' −3; 0 jika tidak di kamus); negasi(w) = pengali −1 jika ada kata negasi ('tidak'/'nggak'/'gak'/'bukan') tepat sebelumnya, +1 jika tidak. Batas: buta sarkasme dan konteks.",
      tasks: [
        { id: "t1", text: "Lengkapi `skor()`: balik bobot jika ada negasi di 3 kata sebelumnya" },
        { id: "t2", text: "Cetak skor dua ulasan uji dengan `print`" },
      ],
      expected: "U1=4 U2=-7",
      note: {
        title: "Sering salah",
        body: "Lupa membersihkan tanda baca sebelum lookup kamus. \u201Ccepat,\u201D (dengan koma) tidak ada di kamus — strip tanda baca dulu.",
        type: "pitfall",
      },
      hints: [
        "w = kata[i].strip(\",.!?\") lalu cek w in lexicon.",
        "Cek kata tepat sebelumnya: i > 0 and kata[i-1].strip(\",.!?\") in negasi.",
        "Jika ya: b = -b. \u201Ctidak cepat\u201D → −2; \u201Clama\u201D tetap −2.",
      ],
      code: {
        starter: `lexicon = {"cepat": 2, "lama": -2, "bagus": 2, "parah": -3, "ramah": 2}\nnegasi = {"tidak", "nggak", "gak", "bukan"}\n\ndef skor(teks):\n    kata = teks.lower().split()\n    total = 0\n    for i in range(len(kata)):\n        w = kata[i].strip(",.!?")\n        if w in lexicon:\n            b = lexicon[w]\n            # TULIS KODEMU: balik b jika kata TEPAT sebelumnya adalah negasi\n            total += b\n    return total\n\nprint("U1=", skor("driver cepat dan ramah"))\nprint("U2=", skor("tidak cepat, lama parah"))`,
        lockLines: 3,
        solution: `lexicon = {"cepat": 2, "lama": -2, "bagus": 2, "parah": -3, "ramah": 2}\nnegasi = {"tidak", "nggak", "gak", "bukan"}\n\ndef skor(teks):\n    kata = teks.lower().split()\n    total = 0\n    for i in range(len(kata)):\n        w = kata[i].strip(",.!?")\n        if w in lexicon:\n            b = lexicon[w]\n            if i > 0 and kata[i-1].strip(",.!?") in negasi:\n                b = -b\n            total += b\n    return total\n\nprint("U1=", skor("driver cepat dan ramah"))\nprint("U2=", skor("tidak cepat, lama parah"))`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: 4, tol: 1e-9, label: "`skor` U1 seharusnya 4", msg: "\u201Ccepat\u201D +2, \u201Cramah\u201D +2. Tidak ada negasi." },
          { kind: "stdout_matches", task: "t2", pattern: "U2=\\s*-7", label: "`print` menampilkan U2=-7", msg: "\u201Ctidak\u201D membalik \u201Ccepat\u201D: −2−2−3 = −7." },
        ],
      },
      reference: "Lexicon + jendela negasi 3 kata. Rawat kamus slang Indonesia.",
    },
    {
      id: "aspect",
      eyebrow: "Langkah 3 · Aspect-based",
      title: "\u201CNegatif tentang apa?\u201D",
      prose: [
        "\u201CDriver lambat tapi aplikasi bagus\u201D → driver: negatif, aplikasi: positif. Inilah aspect-based sentiment: sentimen per aspek, bukan per dokumen. Sentimen global \u201Cnegatif 40%\u201D tidak memberi tahu apa yang diperbaiki.",
        "Jebakan U2: \u201Ctidak cepat, lama parah\u201D — tentang driver, tapi kata \u201Cdriver\u201D tidak ada di teks! Lexicon murni tahu rasanya, belum tentu tentang apa. Butuh aspect extraction (aturan keyword atau NER).",
        "AntarCepat: driver 68% & waktu tunggu 55% ulasan negatif, UI 12%. Tiga sprint redesign UI = mengobati 12% masalah. Aspect-based menunjuk di mana darahnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Berhenti di sentimen global (\u201Cnegatif naik 5%\u201D) tanpa pecah per aspek. Angka global = termometer; aspek = diagnosis. Yang menyembuhkan = diagnosis.",
        type: "pitfall",
      },
      reference: "Selalu pecah sentimen per aspek. Global hanya untuk tren.",
    },
    {
      id: "lda",
      eyebrow: "Langkah 4 · Topic modeling",
      title: "LDA: pustakawan 12.000 surat",
      prose: [
        "LDA: tiap dokumen = campuran topik; tiap topik = distribusi kata. Kata yang sering muncul bersama (\u201Cdriver\u201D, \u201Clama\u201D, \u201Cmacet\u201D) → satu topik. Manusia memberi nama dari top words.",
        "Worked AntarCepat (3 topik): keterlambatan 45% (driver, lama, tunggu, macet, telat), bug aplikasi 25%, harga 15%. Validasi: baca 20 dokumen top per topik — jika tercampur noise, ubah jumlah topik atau bersihkan preprocessing.",
        "Pilih K via coherence + interpretasi manusia: topik \u201Cbagus\u201D = bisa dinamai dalam 3 kata. Kapan LDA: eksplorasi korpus besar tanpa label. Bukan untuk klasifikasi presisi.",
      ],
      tasks: [],
      reference: "LDA = eksplorasi tanpa label. Validasi manual wajib.",
    },
    {
      id: "llm-validasi",
      eyebrow: "Langkah 5 · LLM",
      title: "Magang pintar yang butuh pengawas",
      prose: [
        "LLM untuk klasifikasi: prompt terstruktur → label massal tanpa training. Paham sarkasme Bahasa Indonesia, setup 1 jam. Kelemahan: tidak konsisten, halusinasi label, biaya, privasi.",
        "Protokol validasi wajib: (1) label manual 200–500 sampel sebagai gold; (2) ukur agreement LLM vs gold; (3) jika < 85%, perbaiki prompt (few-shot) atau turun ke ML klasik; (4) audit berkala.",
        "Worked: gold 300 ulasan, agreement antar-manusia 88% (ini plafon!). LLM vs gold: aspek 82%, sentimen 90%. Keputusan: sentimen otomatis OK; aspek perlu few-shot → naik ke 87% → lolos. LLM tidak boleh lebih dipercaya dari agreement manusia.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CKan pintar, langsung pakai saja.\u201D Tanpa gold labels kamu tidak tahu ia 95% atau 55% benar. \u2018Pintar\u2019 ≠ \u2018terpercaya\u2019 — validasi = harga wajib.",
        type: "pitfall",
      },
      reference: "Gold 200–500 sampel. Agreement vs plafon manusia.",
    },
    {
      id: "keyword-lab",
      eyebrow: "Langkah 6 · Lab keyword & evaluasi",
      title: "Temukan topik tanpa ML + audit vendor",
      prose: [
        "Kadang kamu tidak butuh model: hitung kata tersering di ulasan negatif (setelah buang stopwords) — topiknya muncul sendiri. Di lab ini kamu melakukannya dengan string ops murni.",
        "Intuisi TF-IDF: kata tersering (\u201Cenak\u201D, IDF=0) justru tidak informatif — ia muncul di mana-mana. Kata khas (\u201Cpahit\u201D, skor 0,275) = sinyal emas. Bandingkan TF-IDF antar-kelompok (1★ vs 5★), bukan global.",
        "Evaluasi jujur (worked): vendor klaim akurasi 91%. Matrix 500 sampel: akurasi aktual 89%, recall negatif 45/70 = 64% — 36% komplain tidak terdeteksi! Untuk use case deteksi krisis, model ini gagal. Tanya selalu: \u201Cberapa recall untuk kelas yang penting bagiku?\u201D",
      ],
      tasks: [
        { id: "t1", text: "Hitung frekuensi tiap kata di `ulasan_neg`" },
        { id: "t2", text: "Cetak 3 kata tersering dengan `print`" },
      ],
      expected: "driver, lama, parah (3, 3, 2)",
      hints: [
        "Loop tiap ulasan, split jadi kata.",
        "freq[w] = freq.get(w, 0) + 1.",
        "Urutkan: sorted(freq.items(), key=lambda x: x[1], reverse=True)[:3].",
      ],
      code: {
        starter: `ulasan_neg = ["driver lama parah", "driver lama banget",\n               "aplikasi lemot", "driver tidak ramah", "lama parah"]\n\n# TULIS KODEMU: frekuensi kata, tampilkan 3 teratas\nfreq = {}\nfor u in ulasan_neg:\n    for w in u.split():\n        freq[w] =\n\ntop3 =\nprint(top3)`,
        lockLines: 2,
        solution: `ulasan_neg = ["driver lama parah", "driver lama banget",\n               "aplikasi lemot", "driver tidak ramah", "lama parah"]\n\n# TULIS KODEMU: frekuensi kata, tampilkan 3 teratas\nfreq = {}\nfor u in ulasan_neg:\n    for w in u.split():\n        freq[w] = freq.get(w, 0) + 1\n\ntop3 = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:3]\nprint(top3)`,
        checks: [
          { kind: "equal", task: "t1", name: "freq", value: 3, tol: 1e-9, label: "`freq['driver']` seharusnya 3", msg: "\u201Cdriver\u201D muncul di ulasan 1, 2, 4." },
          { kind: "stdout_matches", task: "t2", pattern: "driver", label: "`print` menampilkan driver", msg: "Pastikan top3 tercetak." },
          { kind: "stdout_matches", task: "t2", pattern: "parah", label: "`print` menampilkan parah", msg: "Top 3: driver, lama, parah." },
        ],
      },
      reference: "Keyword counting dulu (1 hari). Naik ke ML/LLM jika perlu.",
    },
    {
      id: "adv-bias-ulasan",
      eyebrow: "Langkah 7 · Bias ulasan",
      title: "Siapa yang menulis? Bias seleksi di balik 12.000 ulasan",
      prose: [
        "12.000 ulasan BUKAN suara 12.000 pelanggan acak — ia suara yang termotivasi menulis: yang sangat marah dan sangat puas. Kurva berbentuk U: tengah yang 'biasa saja' diam. Rating 2,1 mengukur kemarahan yang vokal, bukan kepuasan rata-rata.",
        "Implikasinya: (1) jangan bandingkan rating antar-produk tanpa koreksi — produk kontroversial selalu terlihat lebih ekstrem; (2) tren LEBIH penting dari level — rating 2,1 yang naik dari 1,8 = membaik, walau masih 'jelek'; (3) untuk estimasi populasi, boboti by segmen atau lengkapi dengan survei acak (NPS terstruktur).",
        "Jebakan kedua: ulasan palsu/berbayar. Pola: rating 5 bintang beruntun dengan teks generik ('bagus banget recommended') tanpa detail aspek. Deteksi: burst temporal + kemiripan teks + tanpa pembelian terverifikasi. Jangan ambil keputusan dari korpus yang terkontaminasi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Rating 2,1 dari 12.000 ulasan. Apa yang sebenarnya diukur?",
          options: [
            { text: "Kemarahan yang vokal — penulis ulasan bukan sampel acak (kurva U)", why: "Yang 'biasa saja' diam. Level absolut menipu; tren lebih informatif.", correct: true },
            { text: "Kepuasan rata-rata seluruh pelanggan", why: "Bias seleksi: hanya yang termotivasi menulis." },
            { text: "Kualitas produk secara objektif", why: "Rating = persepsi vokal, bukan audit kualitas." },
            { text: "Tidak ada artinya", why: "Berarti untuk tren dan aspek — hanya bukan estimasi populasi." },
          ],
        },
        {
          q: "50 rating 5★ muncul dalam 2 jam, teks generik, tanpa pembelian terverifikasi. Tindakan?",
          options: [
            { text: "Tandai sebagai anomali — pola ulasan palsu; eksklusi dari analisis", why: "Burst + generik + tak terverifikasi = kontaminasi. Keputusan dari korpus kotor = keputusan kotor.", correct: true },
            { text: "Rayakan — rating naik", why: "Merayakan manipulasi = menipu diri sendiri." },
            { text: "Abaikan — 50 dari 12.000 kecil", why: "Kecil tapi menandai kerentanan; pola bisa berulang." },
            { text: "Hapus semua rating 5★", why: "Berlebihan; hanya yang berpola anomali." },
          ],
        },
      ],
      reference: "Ulasan = sampel termotivasi. Tren > level. Waspadai kontaminasi.",
    },
    {
      id: "adv-closing-loop",
      eyebrow: "Langkah 8 · Closing the loop",
      title: "Dari insight ke aksi: text analytics yang mengubah operasi",
      prose: [
        "Insight tanpa loop aksi = laporan yang dibaca lalu dilupakan. Desain loop: (1) alert — aspek 'driver' negatif >30% dalam 7 hari → notifikasi ke ops; (2) tiket — klaster keluhan diteruskan ke pemilik masalah dengan SLA; (3) ukur — pantau aspek itu 4 minggu setelah intervensi; tutup loop hanya jika turun signifikan.",
        "Worked AntarCepat: alert driver 68% → audit menemukan skema insentif yang menghukum driver telat karena macet (bukan salah driver!) → insentif diubah → 8 minggu kemudian keluhan driver 68% → 31%. Tanpa loop, analis hanya 'menemukan' — dengan loop, analis 'menyelesaikan'.",
        "Metrik keberhasilan text analytics BUKAN akurasi model — melainkan: berapa insight yang jadi aksi, dan berapa aksi yang mengubah metrik bisnis. Dashboard tanpa loop = museum keluhan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tim text analytics bangga akurasi 95% tetapi tidak ada aksi operasional. Penilaian?",
          options: [
            { text: "Gagal — keberhasilan = insight yang jadi aksi yang mengubah metrik", why: "Model hebat tanpa loop = museum keluhan.", correct: true },
            { text: "Sukses — akurasi tinggi", why: "Akurasi tanpa dampak = hobi, bukan analytics." },
            { text: "Cukup — insight tersedia", why: "'Tersedia' tanpa dipakai = tidak ada nilai." },
            { text: "Salah tim ops", why: "Membangun loop adalah tanggung jawab tim analytics." },
          ],
        },
      ],
      reference: "Desain alert → tiket → ukur. Keberhasilan = aksi, bukan akurasi.",
    },
    {
      id: "intuisi-dengar",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Pelanggan sudah berteriak — dalam 12.000 bahasa yang berbeda",
      prose: [
        "AntarCepat menghabiskan tiga sprint redesign UI untuk masalah driver. Pelanggan sudah memberi tahu — 12.000 kali — tetapi tidak ada yang mendengar. Tiga heuristik agar tidak mengulanginya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: pelanggan sudah memberi tahu masalahnya — tugasmu mendengar dalam skala besar tanpa mengubah pesannya",
        body: "Heuristik pertama: mulai dari pertanyaan, bukan dari model. 'Negatif tentang apa?' mendahului 'model apa yang kupakai'. Analis yang langsung melatih classifier tanpa aspect breakdown akan mendapat angka presisi tinggi atas pertanyaan yang salah — seperti AntarCepat yang 'tahu' sentimen negatif 40% tetapi tidak tahu tentang apa. Heuristik kedua: jangan percaya model melebihi kepercayaanmu pada datanya. Lexicon buta sarkasme, LDA buta label, LLM buta konsistensi — setiap metode punya kebutaan, dan tugasmu adalah mengetahui kebutaanmu sendiri. Protokolnya: gold labels 200–500, ukur agreement vs plafon manusia (88%), audit berkala. Model yang tidak divalidasi = magang yang tidak diawasi. Heuristik ketiga: insight yang tidak punya pemilik = tidak ada. Setiap temuan text analytics harus punya: pemilik masalah (siapa yang bertanggung jawab), ambang aksi (kapan alert berbunyi), dan tanggal tindak lanjut. 'Driver 68%' tanpa pemilik = fakta menarik. 'Driver 68%, pemilik: VP Ops, alert di 30%, review 4 minggu' = mesin perbaikan. Text analytics yang baik tidak menghasilkan dashboard — ia menghasilkan perubahan.",
      },
      reference: "Pertanyaan dulu; kenali kebutaan model; tiap insight punya pemilik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: dari 10.000 ulasan ke aksi 90 hari",
      prose: [
        "Skenario satu — memilih metode: lexicon untuk baseline cepat; aspect-based untuk 'apa tentang apa' (driver 68% vs UI 12%); LLM untuk nuansa — dengan validasi sampel manual. Metode mengikuti pertanyaan, bukan sebaliknya.",
        "Skenario dua — bias ulasan: ingat yang menulis ulasan bukan pelanggan rata-rata (yang marah dan yang cinta). Jangan ekstrapolasi proporsi mentah ke seluruh basis.",
        "Skenario tiga — prioritas aksi: urutkan aspek dari volume keluhan × biaya perbaikan. Driver 68% dengan biaya Rp120jt mengalahkan UI 12% dengan biaya 3 sprint — matematika, bukan selera.",
        "Skenario empat — closing the loop: tiap temuan harus punya pemilik dan tenggat 90 hari. Analisis tanpa loop tertutup adalah arsip keluhan yang mahal.",
        "Skenario lima — validasi LLM: audit manual sampel berstrata sebelum percaya label otomatis. LLM yang tidak divalidasi adalah survei dengan pewawancara yang tidak pernah dicek.",
        "Aturan praktis 10 detik: metode sesuai pertanyaan? Bias penulis diakui? Prioritas dari volume × biaya? Tiap temuan ada pemilik dan tenggat? Label LLM divalidasi manual?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengerjakan yang paling terlihat, bukan yang paling dikeluhkan. Tiga sprint redesign UI untuk masalah driver 68% adalah mendengar gema sendiri. Pelanggan sudah memberi tahu 12.000 kali — tugas analis adalah menerjemahkan, bukan memilih yang nyaman.",
      },
      reference: "Metode ikut pertanyaan → akui bias → prioritas volume × biaya → loop 90 hari.",
    },
    {
      id: "minicase-antarcepat2",
      eyebrow: "Langkah 11 · Mini-case",
      title: "AntarCepat, bagian 2: dari 12.000 ulasan ke 3 aksi",
      prose: [
        "Pasca-analisis, AntarCepat membangun loop. Temuan aspek: driver/keterlambatan 68% ulasan negatif, harga 15%, UI 12%. Tiga aksi 90 hari: (1) skema insentif driver diubah (macet tidak menghukum driver) — biaya Rp120jt; (2) SLA kompensasi keterlambatan >30 menit (voucher Rp15rb otomatis) — biaya Rp80jt/bulan; (3) UI dibekukan — nol rupiah, nol sprint.",
        "Hasil 90 hari: keluhan driver 68% → 31%, rating 2,1 → 3,4, retensi driver naik 12% (rekrutmen turun Rp200jt/bulan). Total biaya Rp360jt vs nilai: retensi + rating + penghematan rekrutmen ≈ Rp1,1M. ROI loop = 3x.",
        "Pertanyaan: (1) Mengapa aksi #1 bukan 'rekrut driver lebih banyak'? (2) Apa yang diukur untuk membuktikan loop bekerja? (3) Kapan LLM boleh menggantikan lexicon di sini?",
        "Pembahasan: (1) Akar masalah = insentif, bukan jumlah — menambah driver tanpa memperbaiki skema = menambah korban. (2) Aspek 'driver' per minggu + rating + retensi driver — tiga metrik, satu cerita. (3) Boleh jika agreement vs gold ≥ plafon manusia (88%) untuk aspek — dengan audit berkala; sentimen global sudah cukup by lexicon.",
      ],
      tasks: [],
      quiz: [
        {
          q: "AntarCepat: akar masalah = skema insentif, bukan jumlah driver. Pelajaran analisis?",
          options: [
            { text: "Text analytics harus sampai ke 'mengapa', bukan berhenti di 'tentang apa'", why: "Aspek 'driver' = gejala; insentif = penyebab. Aksi di gejala = mengobati batuk saat yang sakit paru-paru.", correct: true },
            { text: "Lexicon tidak cukup", why: "Lexicon menemukan aspeknya dengan benar; yang kurang adalah investigasi lanjutan." },
            { text: "Butuh lebih banyak data", why: "12.000 ulasan cukup; yang dibutuhkan kedalaman analisis." },
            { text: "Driver memang malas", why: "Data bilang sebaliknya: insentif menghukum mereka atas macet." },
          ],
        },
        {
          q: "Kapan LLM boleh menggantikan lexicon untuk monitoring aspek?",
          options: [
            { text: "Jika agreement vs gold ≥ plafon manusia (88%) + audit berkala", why: "Standar validasi: tidak boleh lebih dipercaya dari manusia yang melabeli.", correct: true },
            { text: "Langsung — LLM lebih pintar", why: "'Pintar' ≠ terpercaya; tanpa gold = misteri." },
            { text: "Tidak pernah", why: "Berlebihan; dengan validasi proper, LLM sah dipakai." },
            { text: "Jika lebih murah", why: "Murah bukan kriteria kebenaran." },
          ],
        },
      ],
      reference: "Sampai ke akar masalah; buktikan dengan metrik; validasi sebelum otomasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Text analytics = mendengar dalam skala besar — dengan protokol agar yang didengar bisa dipercaya.",
      ],
      tasks: [],
      summary: [
        "Lexicon: cepat & transparan; tangani negasi; buta sarkasme.",
        "Aspect-based: sentimen per aspek = yang actionable.",
        "LDA: temukan topik tanpa label; validasi manual + coherence.",
        "LLM: magang pintar tapi ceroboh — gold 200–500 + agreement + audit.",
        "Evaluasi jujur: recall kelas penting > akurasi global.",
        "Ulasan = sampel termotivasi (kurva U): pakai tren, waspadai ulasan palsu.",
        "Keberhasilan = insight yang jadi aksi: alert -> tiket -> ukur (closing the loop).",
      ],
      next: { label: "MK18 — Etika", href: "/learn/mk18-etika" },
      quiz: [
        {
          q: "68% negatif tentang driver, 12% tentang UI. Prioritas?",
          options: [
            { text: "Operasional driver — aspect-based menunjuk darahnya", why: "UI 12% = bukan prioritas. Sentimen global tanpa aspek = buta.", correct: true },
            { text: "Redesign UI", why: "Mengobati 12% masalah — kesalahan AntarCepat yang asli." },
            { text: "Turunkan harga", why: "Tidak ada bukti harga masalahnya." },
          ],
        },
        {
          q: "\u201CTidak cepat, lama parah\u201D (cepat:+2, lama:−2, parah:−3). Skor dengan negasi?",
          options: [
            { text: "−7", why: "\u201Ctidak\u201D membalik cepat (+2→−2); total −2−2−3.", correct: true },
            { text: "−3", why: "Itu tanpa penanganan negasi (+2−2−3). Salah magnitude." },
            { text: "+4", why: "Itu skor ulasan lain (\u201Cdriver cepat dan ramah\u201D)." },
          ],
        },
        {
          q: "Mau pakai LLM untuk 50rb ulasan. Langkah wajib pertama?",
          options: [
            { text: "Label manual 200–500 sampel sebagai gold + ukur agreement", why: "Tanpa gold, akurasinya misteri (bisa 55%).", correct: true },
            { text: "Langsung jalankan semua", why: "Itu cara tercepat mendapat 50rb label yang tidak terpercaya." },
            { text: "Pilih model termahal", why: "Mahal ≠ terkalibrasi di datamu." },
          ],
        },
        {
          q: "Kapan LDA lebih tepat dari klasifikasi supervised?",
          options: [
            { text: "Eksplorasi: kategori belum diketahui, tanpa label", why: "LDA menemukan \u201Cada apa saja\u201D; supervised untuk kategori yang sudah ada.", correct: true },
            { text: "Butuh presisi tinggi", why: "Terbalik — topik LDA kabur, bukan presisi." },
            { text: "Selalu", why: "Tidak — untuk kategori jelas + label ada, supervised menang." },
          ],
        },
        {
          q: "Vendor klaim akurasi 91%, tapi recall negatif 64%. Untuk deteksi krisis komplain?",
          options: [
            { text: "Gagal — 36% komplain lolos tidak terdeteksi", why: "Akurasi global menutupi kegagalan di kelas yang penting.", correct: true },
            { text: "Lolos — 91% sudah tinggi", why: "91% klaim, 89% aktual, dan recall 64% = gagal di tugasnya." },
            { text: "Cukup dengan catatan", why: "Catatan tidak menangkap 36% krisis yang lolos." },
          ],
        },
      ],
    },
  ],
};
