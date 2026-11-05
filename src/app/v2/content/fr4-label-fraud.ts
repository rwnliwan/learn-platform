import type { V2Lesson } from "../lib/types";

export const fr4: V2Lesson = {
  slug: "fr4-label-fraud",
  track: "Fraud & AML Analytics",
  module: "Data & Label",
  title: "FR4 — Label Fraud",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model 99% akurat yang salah total",
      prose: [
        "Data scientist \"PayKu\" bangga: model fraud barunya akurasi 99,2% di data training Januari–Maret. Deploy April. Mei: chargeback meledak 3x lipat — model tidak menangkap apa pun. Investigasi menemukan: label \"bukan fraud\" di data training ternyata 40%-nya adalah fraud yang chargeback-nya belum datang saat data diekstrak.",
        "Model itu tidak belajar \"bedakan fraud vs normal\". Ia belajar \"bedakan fraud yang cepat ketahuan vs campuran normal + fraud yang belum ketahuan\". Akurasi 99,2% adalah ilusi — diukur terhadap label yang salah.",
        "Masalahnya bukan di model — arsitekturnya sudah benar (gradient boosting, tuning rapi). Masalahnya di label: kebenaran yang datang terlambat, sebagian salah, dan sebagian tidak pernah datang. Kualitas label menentukan segalanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Data 6 bulan terakhir cukup untuk training — makin fresh makin bagus.\" 3–4 bulan terakhir labelnya belum matang. \"Fresh\" tanpa maturation = melatih model dengan label bohong. Praktik benar: embargo — training hanya pakai data yang umurnya > maturation window (mis. >120 hari).",
      },
      reference: "Label fraud = produk sampingan proses bisnis (chargeback, investigasi) — bukan kebenaran objektif.",
    },
    {
      id: "lag",
      eyebrow: "Langkah 2 · Chargeback lag",
      title: "Label yang baru lengkap 4 bulan kemudian",
      prose: [
        "Chargeback lag = jeda antara transaksi fraud terjadi dan label \"fraud\" resmi tercatat. Lag tipikal: 30–120 hari. Konsekuensinya: jika kamu ekstrak training data hari ini, label untuk 3–4 bulan terakhir belum matang. Transaksi berlabel \"normal\" di periode itu = campuran normal + fraud-yang-belum-ketahuan.",
        "Contoh: transaksi Januari 2026, chargeback masuk bertahap — 40% di Februari, 35% di Maret, 20% di April, 5% di Mei. Transaksi berumur 1 bulan baru 40% labelnya masuk; umur 2 bulan 75%; umur 3 bulan 95%. Aturan praktis: pakai data yang umurnya ≥ 3x median lag.",
        "Hanya 12% fraud ketahuan dalam seminggu; 35% butuh lebih dari 60 hari. Label dianggap matang setelah ~90–120 hari (maturation window). Yang terjadi secara formal adalah undercounting sistematis: fraud rate yang terlihat di data lebih kecil dari aslinya — dan yang lambat ketahuan (synthetic identity, first-party) lebih ter-undercount daripada card fraud.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `terlihat` = berapa fraud yang SUDAH ketahuan di tiap `hari_ini`" },
        { id: "t2", text: "Cetak tabel hari ke-N vs fraud terlihat" },
      ],
      expected: "Hari ke-30: terlihat 60% fraud; hari ke-150: terlihat 100%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model underestimate risiko → threshold yang \"optimal\" di data mentah akan terlalu longgar di produksi. Dan undercounting-nya tidak acak: fraud yang lambat ketahuan lebih ter-undercount — model jadi bias ke pola yang cepat ketahuan.",
      },
      hints: [
        "KONSEP: tiap transaksi membawa \"tanggal kedatangan kabar\" (lag-nya). Pada hari ke-H, yang sudah ketahuan hanyalah transaksi yang kabarnya datang pada hari ≤ H. Ini cara berpikir cumulative count: jumlahkan yang memenuhi syarat waktu, bukan yang belum.",
        "CLUE: gunakan generator expression sum(1 for ...) dengan operator perbandingan <= terhadap hari_ini — kamu hanya membandingkan satu angka lag per transaksi, tidak perlu unpack apa pun.",
        "SKELETON:\ndef label_terlihat(hari_ini):\n    return sum(1 for lag in lag_hari if ...)",
      ],
      code: {
        starter: `# 1000 transaksi, 2% fraud. Chargeback datang 7-150 hari kemudian.\nimport random\nrandom.seed(42)\nlag_hari = [random.choice([7]*12 + [20]*28 + [45]*25 + [75]*18 + [105]*10 + [150]*7)\n            for _ in range(20)]\n\n# TULIS KODEMU: berapa fraud yang SUDAH ketahuan pada tiap hari?\ndef label_terlihat(hari_ini):\n    return \n\nfor h in [7, 30, 60, 90, 120, 150]:\n    terlihat = label_terlihat(h)\n    print(f"Hari ke-{h:3d}: terlihat {terlihat:2d}/20 fraud ({terlihat/20*100:4.0f}%)")`,
        lockLines: 6,
        solution: `# 1000 transaksi, 2% fraud. Chargeback datang 7-150 hari kemudian.\nimport random\nrandom.seed(42)\nlag_hari = [random.choice([7]*12 + [20]*28 + [45]*25 + [75]*18 + [105]*10 + [150]*7)\n            for _ in range(20)]\n\n# TULIS KODEMU: berapa fraud yang SUDAH ketahuan pada tiap hari?\ndef label_terlihat(hari_ini):\n    return sum(1 for lag in lag_hari if lag <= hari_ini)\n\nfor h in [7, 30, 60, 90, 120, 150]:\n    terlihat = label_terlihat(h)\n    print(f"Hari ke-{h:3d}: terlihat {terlihat:2d}/20 fraud ({terlihat/20*100:4.0f}%)")`,
        checks: [
          { kind: "defined", task: "t1", name: "label_terlihat", label: "`label_terlihat` terdefinisi", msg: "Buat fungsi label_terlihat(hari_ini)." },
          { kind: "stdout_matches", task: "t2", pattern: "Hari ke-\\s*30: terlihat\\s+12/20", label: "Hari ke-30 terlihat 12/20", msg: "Dengan seed 42, pada hari ke-30 ada 12 dari 20 fraud yang lag-nya sudah lewat." },
          { kind: "stdout_matches", task: "t2", pattern: "Hari ke-\\s*150: terlihat\\s+20/20", label: "Hari ke-150 terlihat 20/20", msg: "Pada hari ke-150 semua chargeback sudah datang (100%)." },
        ],
      },
      reference: "Embargo 90–120 hari: data muda boleh jadi fitur, tidak boleh jadi label \"negatif pasti\".",
    },
    {
      id: "noise",
      eyebrow: "Langkah 3 · Noisy label",
      title: "Saat \"fraud\" ternyata bukan",
      prose: [
        "Label tidak hanya terlambat — kadang salah. Tiga sumber noise: friendly fraud terbalik (nasabah komplain \"tidak merasa transaksi\" padahal ia sendiri yang belanja), investigator error (lelah/melewatkan bukti — berkorelasi dengan workload), dan rule legacy yang salah (label historis dari rule lama yang over-agresif).",
        "Cara mengukur: ambil sampel 200–500 kasus, label ulang oleh 2 investigator senior independen (blind review). Tingkat ketidaksepakatan = estimasi noise. Industri tipikal: 5–15% label bermasalah. Kalau modelmu \"akurasi 99%\" tapi noise 10% — akurasi itu fiktif.",
        "Kasus nyata: dari 1.000 dispute kartu kredit, setelah investigasi: ~550 third-party fraud asli, ~300 friendly fraud (nasabah sendiri yang bertransaksi lalu menyangkal), ~150 sengketa layanan murni. Jika semua 1.000 otomatis dilabel \"fraud\", 45% labelmu salah kategori — model belajar pola orang lupa sebagai pola pencurian.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Makin banyak label, makin bagus model.\" 1.000 label bersih di daerah abu-abu mengalahkan 100.000 label kotor dengan bias seleksi. Kualitas label = kualitas definisi + kualitas investigator + kualitas sampling. Kuantitas tanpa ketiganya = sampah yang mahal.",
      },
      reference: "Ukur noise via blind review — jangan percaya akurasi di atas label kotor.",
    },
    {
      id: "pu",
      eyebrow: "Langkah 4 · PU learning",
      title: "Belajar dari \"positif + tak berlabel\"",
      prose: [
        "PU Learning (Positive-Unlabeled): data terdiri dari P = contoh positif yang pasti (fraud terkonfirmasi), dan U = contoh tak berlabel (campuran normal + fraud tersembunyi). Tidak ada \"negatif pasti\". Ide intinya: perlakukan U sebagai negatif sementara, latih classifier (peluang berlabel), lalu koreksi dengan faktor c = P(berlabel | fraud sejati) — mengubah \"peluang berlabel\" menjadi \"peluang fraud sejati\".",
        "Kapan dipakai: label positif sedikit dan tepercaya (hasil investigasi), sisanya tak berlabel. Kapan TIDAK: kalau kamu punya negatif yang benar-benar tepercaya (transaksi lolos audit manual penuh) — maka supervised biasa lebih baik. Waspadai asumsi SCAR: peluang fraud ketahuan tidak bergantung pada x. Kalau dilanggar (fraud besar lebih cepat ketahuan — dan memang begitu!), estimasi bias.",
      ],
      formula: String.raw`P(y=1 \mid x) = \frac{P(s=1 \mid x)}{c}, \quad c = P(s=1 \mid y=1)`,
      formulaNote: "s = status berlabel; y = status fraud sejati. Tanpa koreksi pembagi c, model underestimate sistematis.",
      tasks: [
        { id: "t1", text: "Hitung `positif_tertangkap` (label=1, skor≥60) dan `takberlabel_skor_tinggi` (label=0, skor≥60)" },
        { id: "t2", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "positif berlabel & skor≥60: 27 | tak-berlabel tapi skor≥60: 72 (kandidat fraud tersembunyi)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"PU learning = anggap semua tak-berlabel sebagai negatif.\" Itu justru kesalahan yang diperbaiki PU learning. Menganggap U = negatif adalah langkah awal sementara; koreksi pembagi c-lah yang mengubah \"peluang berlabel\" menjadi \"peluang fraud sejati\".",
      },
      hints: [
        "KONSEP: ingat makna label di PU learning — label=1 berarti fraud TERKONFIRMASI, label=0 berarti TAK BERLABEL (campuran normal + fraud tersembunyi). Kedua angka yang kamu cari dibedakan HANYA oleh status labelnya; ambang skornya sama. Jangan sampai tertukar mana yang dihitung dari kelompok P dan mana dari kelompok U.",
        "CLUE: gunakan generator expression sum(1 for s, l in data if ...) — unpack tuple menjadi (skor, label), lalu gabungkan dua syarat dengan operator logika and: syarat status label DAN syarat skor >= ambang.",
        "SKELETON:\npositif_tertangkap = sum(1 for s, l in data if ...)\ntakberlabel_skor_tinggi = sum(1 for s, l in data if ...)",
      ],
      code: {
        starter: `# 30 positif pasti + 970 tak berlabel (50 di antaranya fraud tersembunyi!)\nimport random\nrandom.seed(7)\npositif = [(random.gauss(75, 10), 1) for _ in range(30)]\ntak_berlabel = [(random.gauss(30, 15), 0) for _ in range(920)] + \\\n               [(random.gauss(75, 10), 0) for _ in range(50)]\ndata = positif + tak_berlabel\nrandom.shuffle(data)\n\n# TULIS KODEMU: hitung dua angka di bawah\nambang = 60\npositif_tertangkap =\ntakberlabel_skor_tinggi =\n\nprint(f"Positif berlabel & skor>={ambang}: {positif_tertangkap}")\nprint(f"Tak-berlabel tapi skor>={ambang}  : {takberlabel_skor_tinggi}")`,
        lockLines: 9,
        solution: `# 30 positif pasti + 970 tak berlabel (50 di antaranya fraud tersembunyi!)\nimport random\nrandom.seed(7)\npositif = [(random.gauss(75, 10), 1) for _ in range(30)]\ntak_berlabel = [(random.gauss(30, 15), 0) for _ in range(920)] + \\\n               [(random.gauss(75, 10), 0) for _ in range(50)]\ndata = positif + tak_berlabel\nrandom.shuffle(data)\n\n# TULIS KODEMU: hitung dua angka di bawah\nambang = 60\npositif_tertangkap = sum(1 for s, l in data if l == 1 and s >= ambang)\ntakberlabel_skor_tinggi = sum(1 for s, l in data if l == 0 and s >= ambang)\n\nprint(f"Positif berlabel & skor>={ambang}: {positif_tertangkap}")\nprint(f"Tak-berlabel tapi skor>={ambang}  : {takberlabel_skor_tinggi}")`,
        checks: [
          { kind: "defined", task: "t1", name: "positif_tertangkap", label: "`positif_tertangkap` terdefinisi", msg: "Hitung jumlah (s, l) dengan l==1 dan s>=60." },
          { kind: "defined", task: "t1", name: "takberlabel_skor_tinggi", label: "`takberlabel_skor_tinggi` terdefinisi", msg: "Hitung jumlah (s, l) dengan l==0 dan s>=60." },
          { kind: "stdout_matches", task: "t2", pattern: "Positif berlabel & skor>=60: 27", label: "Positif tertangkap = 27", msg: "Dengan seed 7, 27 dari 30 positif berlabel punya skor >= 60." },
        ],
      },
      reference: "'Negatif' dalam data fraud = 'BELUM terbukti positif'. Skor tinggi + tak berlabel = prioritas investigasi.",
    },
    {
      id: "strategi",
      eyebrow: "Langkah 5 · Strategi label",
      title: "Embargo, maturation, dan feedback loop",
      prose: [
        "Tiga praktik yang memisahkan tim fraud dewasa dari amatir. Embargo window: data < 90–120 hari tidak boleh jadi \"negatif\" di training — boleh dipakai sebagai fitur (agregat), tidak boleh sebagai label. Maturation re-labeling: label ditulis ulang berkala — transaksi \"normal\" 4 bulan lalu dicek ulang apakah chargeback-nya akhirnya datang; training set adalah living dataset. Feedback loop investigator: setiap keputusan investigator (benar/salah) kembali sebagai label baru — tanpa loop ini, model membeku sementara penipu berevolusi.",
        "Peta keputusan: label positif sedikit tapi tepercaya → PU learning. Ada negatif tepercaya (audit manual penuh) → supervised biasa + embargo. Noise tinggi (>10% label salah) → perbaiki proses label dulu. Tidak ada label sama sekali (produk baru) → mulai unsupervised + rule.",
        "Label adalah aset termahal dalam ML fraud. Satu label investigator = Rp25–50rb + waktu tunggu berminggu-minggu. Dataset 10.000 label = Rp250–500jt + 3 bulan. Label paling berharga: yang di daerah abu-abu (skor model 0,3–0,7) — bukan yang sudah jelas.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hanya 35% label yang benar-benar bersih; 65% bermasalah (terlambat/salah/tak berlabel). Inilah kenapa \"tuning model\" sering sia-sia: kamu mengoptimasi arsitektur di atas fondasi yang 65%-nya goyang. Perbaiki label dulu, baru tuning model. ROI memperbaiki label > ROI mengganti algoritma.",
      },
      reference: "Tanya \"label ini lahir dari proses apa?\" sebelum pakai. Tidak ada label → unsupervised + rule dulu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Training data 6 bulan terakhir — pakai atau buang?",
      prose: [
        "Kamu mewarisi proyek model fraud di fintech \"PayKu\". Data scientist sebelumnya melatih dengan seluruh data 6 bulan terakhir (termasuk 2 bulan terakhir), tanpa embargo. Akurasi validasi 99,2%. Di produksi, chargeback naik 3x. Data: 2 juta transaksi, 8.000 berlabel fraud. Blind review 300 sampel: 12% label salah. Chargeback lag median 45 hari.",
        "Pertanyaan: (a) Apa 3 cacat fatal pipeline label ini? (b) Rancang ulang strategi training data — window apa, perlakuan apa untuk 2 bulan terakhir?",
        "Pembahasan: (a) Tidak ada embargo — 2 bulan terakhir (lag median 45 hari) penuh \"negatif palsu\"; noise 12% tidak ditangani — akurasi 99,2% fiktif; tidak ada maturation re-labeling — label dianggap final saat diekstrak. (b) Training = data berumur >120 hari saja (matang). 2 bulan terakhir: perlakukan sebagai unlabeled (PU learning) atau pakai hanya untuk monitoring drift. Terapkan blind review berkala, perbaiki guideline investigator, dan validasi dengan time-based split — bukan random split.",
      ],
      tasks: [],
      reference: "Model tidak pernah lebih jujur dari labelnya. Perbaiki sumur sebelum menyalahkan pompa.",
    },
    {
      id: "reversal",
      eyebrow: "Langkah 7 · Label reversal",
      title: "Label yang berubah pikiran 3 minggu kemudian",
      prose: [
        "Transaksi Rp2,4 juta, 8 Januari: kartu dipakai beli elektronik, device dikenal, tidak ada velocity aneh — berlabel 0 (normal), masuk training set gelombang Februari. Tanggal 29 Januari, chargeback datang: pemegang kartu tidak mengakui transaksi. Label ditulis ulang menjadi 1. Model yang dilatih Februari kini belajar dari \"kebenaran\" yang berbeda dari Januari. Ini chargeback lag biasa — FR4 langkah 2 sudah membahasnya. Tetapi ceritanya belum selesai.",
        "Tanggal 17 Maret, merchant mengajukan representment: bukti tanda terima + log pengiriman + rekaman CCTV pengambilan barang. Bank penerbit memutuskan chargeback DITOLAK — transaksi dinyatakan sah. Label ditulis ulang LAGI menjadi 0. Dalam 10 minggu, satu sel database berubah 0 → 1 → 0. Dan ini bukan kasus aneh: pada data PayKu, 8% label berubah minimal sekali dalam 120 hari pertama, dan 1,2% berubah DUA kali (reversal ganda seperti di atas). Label fraud bukan konstanta — ia adalah time series yang belum selesai ditulis.",
        "Dampaknya ke training brutal dan sunyi. Model yang dilatih pada snapshot Januari belajar \"transaksi ini normal\"; model yang dilatih pada snapshot Februari belajar \"transaksi ini fraud\" — dari peristiwa ekonomi yang SAMA. Dua tim yang mengekstrak training set di tanggal berbeda mendapatkan dataset yang \"berbeda\" tanpa satu pun transaksi baru. Reproducibility hancur: eksperimen yang tidak bisa direplikasi bukan karena kode, melainkan karena labelnya bergerak di bawah kaki.",
        "Keputusan maturation yang dewasa: label dinyatakan FINAL hanya jika dua syarat terpenuhi — umur transaksi > 120 hari DAN jendela sengketa (dispute window) jaringan kartu sudah tertutup. Sebelum itu, statusnya adalah \"provisional\" — boleh dipakai untuk monitoring dan analisis, TIDAK boleh dipakai sebagai ground truth training tanpa catatan versi. Dan untuk chargeback yang masuk representment, beri status khusus \"disputed\" — bukan 0, bukan 1 — karena memaksanya menjadi biner berarti memilih sisi sebelum wasit meniup peluit.",
        "Aturan operasionalnya: setiap training set wajib mencatat label_snapshot_date (kapan label diekstrak) dan label_version. Model yang dievaluasi terhadap label v2 tidak boleh dibandingkan head-to-head dengan model yang divalidasi terhadap label v1 — 8% perbedaan label cukup untuk membalik kesimpulan \"model mana lebih baik\". Perbandingan model lintas snapshot label adalah perbandingan apel dengan apel yang sedang berubah menjadi jeruk.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: label adalah foto, bukan patung — selalu cek tanggal kedaluwarsanya",
        type: "risk",
        body: "Kebiasaan investigator yang paling underrated: tidak pernah memakai label tanpa menanyakan dua hal — kapan ia lahir, dan apakah proses yang melahirkannya sudah selesai. Label chargeback berumur 30 hari adalah janji yang belum tentu ditepati; label berumur 150 hari dengan dispute window tertutup adalah fakta. Di antara keduanya ada spektrum kepercayaan, dan analis senior memperlakukan spektrum itu secara eksplisit: bobot sampel dalam training bisa diturunkan untuk label provisional, atau label muda dipakai untuk monitoring tetapi tidak untuk evaluasi model. Kebiasaan kedua: curigai setiap metrik yang membaik \"tanpa alasan\" setelah re-ekstraksi label — seringkali bukan model yang membaik, melainkan label yang berubah di bawahnya (reversal massal dari satu merchant besar bisa menggeser precision 2 poin dalam semalam). Kebiasaan ketiga, yang paling sulit: terima bahwa sebagian kecil label TIDAK AKAN PERNAH final — kasus yang berlarut di pengadilan, sengketa yang tidak terselesaikan. Untuk kasus-kasus itu, keputusan yang benar bukanlah memaksakan 0 atau 1, melainkan mengeluarkannya dari training set dan mencatat alasannya. Dataset yang jujur tentang apa yang tidak diketahuinya mengalahkan dataset yang sok tahu.",
      },
      reference: "Label final = umur >120 hari + dispute window tertutup. Sebelumnya: provisional/disputed, bukan ground truth.",
    },
    {
      id: "label-versioning",
      eyebrow: "Langkah 8 · Versioning & biaya",
      title: "Label versioning — dan harga train ulang",
      prose: [
        "Solusi strukturalnya: perlakukan label seperti kode — di-versioning. Tabel label tidak di-UPDATE; setiap perubahan menulis baris baru dengan (transaction_id, label, version, changed_at, reason). label_v1 = snapshot Januari, label_v2 = snapshot Februari (dengan reversal), dan seterusnya. Training run mencatat label_version yang dipakai — seperti mencatat commit hash. Dengan ini, eksperimen Januari bisa direplikasi persis pada bulan Juni: checkout label_v1, ekstrak ulang, hasil identik. Reproducibility kembali, dan audit regulator bisa menelusuri \"model ini dilatih di atas kebenaran versi apa\".",
        "Implementasinya murah secara teknis — satu tabel append-only + kolom version — tetapi mahal secara disiplin. Setiap pipeline yang menulis label harus menulis reason (chargeback_received, representment_won, investigator_review, maturation_passed). Tanpa reason, versioning hanya arsip kebingungan: kamu tahu label berubah, tetapi tidak tahu kenapa. Dan satu aturan keras: tidak ada proses yang boleh menimpa label tanpa menulis baris baru — UPDATE langsung ke kolom label adalah dosa yang menghapus sejarah.",
        "Sekarang harganya — kapan train ulang layak dibayar? Biaya satu siklus retrain penuh: compute dan infra ±Rp40 juta, 2 analis × 3 minggu (±Rp35 juta), plus validasi dan deployment (±Rp15 juta) — total ±Rp90 juta per siklus, di luar biaya label yang sudah dibahas di FR4 (Rp250–500 juta untuk 10.000 label baru bila dibutuhkan). Pertanyaan keputusannya bukan \"apakah model bisa lebih baik dengan data baru\" (jawabannya selalu ya, sedikit), melainkan \"apakah perbaikan expected loss-nya melebihi Rp90 juta + risiko deploy?\".",
        "Aturan keputusannya: retrain terjadwal kuartalan BILA label flip rate kuartal itu >5% (cukup banyak \"kebenaran\" berubah sehingga model lama belajar dari foto kedaluwarsa), ATAU drift terkonfirmasi (FR10) yang menuntut retrain. Di bawah 5% flip dan tanpa drift: maturation re-labeling berjalan terus (label ditulis ulang), tetapi model tidak di-retrain — karena melatih ulang model Rp90 juta untuk mengejar 2% label yang berubah adalah seperti mengecat ulang rumah karena satu genteng retak. Pisahkan ritme perbaikan label (kontinu) dari ritme retrain model (diskrit, berbiaya).",
        "Satu metrik yang wajib dimonitor: label churn per kuartal = % label yang berubah versi antar snapshot. Churn <3%: pipeline label sehat. 3–8%: normal untuk bisnis yang tumbuh (banyak dispute baru). >8%: ada yang rusak di hulu — entah proses chargeback berubah, entah definisi fraud diganti diam-diam oleh tim bisnis. Label churn yang melonjak tanpa penjelasan adalah alarm yang sama seriusnya dengan PSI > 0,25 — ia berarti fondasi tempat model berdiri sedang bergerak.",
      ],
      tasks: [],
      reference: "Label append-only + version + reason. Retrain bila flip >5%/kuartal atau drift; biaya ±Rp90 jt/siklus.",
    },
    {
      id: "transfer-tiketku",
      kind: "transfer",
      eyebrow: "Transfer check · tanpa petunjuk",
      title: "Audit label TiketKu: train atau embargo?",
      prose: [
        "Skenario baru — perusahaan berbeda, data berbeda. Kamu direkrut \"TiketKu\", platform tiket perjalanan. Konsultan sebelumnya menyerahkan training set: 24 baris sampel berbentuk (umur_hari, label, status_label). Klaim konsultan: \"dataset bersih, label final semua, langsung latih saja.\" Tugasmu: verifikasi klaim itu sebelum ada yang melatih model.",
        "Aturannya dari pelajaran ini: hanya status_label == \"final\" yang boleh jadi ground truth. Hitung berapa baris yang belum final, hitung fraud rate HANYA di subset matang, lalu putuskan: latih (TRAIN) atau tolak dan minta embargo (EMBARGO) bila label yang belum final lebih dari 20% dari total baris.",
        "Tidak ada petunjuk di langkah ini — buktikan kamu bisa melakukannya sendiri dengan data yang belum pernah kamu lihat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_tidak_final` = jumlah baris yang status_label-nya BUKAN \"final\"" },
        { id: "t2", text: "Hitung `fraud_rate_matang` = proporsi label=1 di antara baris berstatus \"final\" saja" },
        { id: "t3", text: "Cetak \"EMBARGO\" bila proporsi belum-final > 20%, kalau tidak cetak \"TRAIN\"" },
      ],
      noLiteral: ["n_tidak_final", "fraud_rate_matang"],
      code: {
        starter: `# TiketKu: sampel training set warisan konsultan (umur_hari, label, status_label)\ndata = [\n    (150, 1, "final"), (150, 0, "final"), (160, 1, "final"), (170, 0, "final"),\n    (140, 0, "final"), (150, 1, "final"), (180, 0, "final"), (150, 0, "final"),\n    (135, 1, "final"), (200, 0, "final"), (150, 1, "final"), (160, 0, "final"),\n    (150, 0, "final"), (190, 1, "final"),\n    (20, 0, "provisional"), (30, 0, "provisional"), (45, 0, "provisional"), (60, 0, "provisional"),\n    (25, 0, "provisional"), (40, 0, "provisional"), (55, 0, "provisional"), (15, 1, "provisional"),\n    (100, 1, "disputed"), (110, 0, "disputed"),\n]\n\n# TULIS KODEMU\nn_tidak_final =\nfraud_rate_matang =\n\nif n_tidak_final / len(data) > 0.20:\n    print("EMBARGO")\nelse:\n    print("TRAIN")`,
        lockLines: 12,
        solution: `# TiketKu: sampel training set warisan konsultan (umur_hari, label, status_label)\ndata = [\n    (150, 1, "final"), (150, 0, "final"), (160, 1, "final"), (170, 0, "final"),\n    (140, 0, "final"), (150, 1, "final"), (180, 0, "final"), (150, 0, "final"),\n    (135, 1, "final"), (200, 0, "final"), (150, 1, "final"), (160, 0, "final"),\n    (150, 0, "final"), (190, 1, "final"),\n    (20, 0, "provisional"), (30, 0, "provisional"), (45, 0, "provisional"), (60, 0, "provisional"),\n    (25, 0, "provisional"), (40, 0, "provisional"), (55, 0, "provisional"), (15, 1, "provisional"),\n    (100, 1, "disputed"), (110, 0, "disputed"),\n]\n\n# TULIS KODEMU\nn_tidak_final = sum(1 for _, _, st in data if st != "final")\nfraud_rate_matang = sum(1 for _, lb, st in data if st == "final" and lb == 1) / sum(1 for _, _, st in data if st == "final")\n\nif n_tidak_final / len(data) > 0.20:\n    print("EMBARGO")\nelse:\n    print("TRAIN")`,
        checks: [
          { kind: "defined", task: "t1", name: "n_tidak_final", label: "Jumlah label non-final terhitung", msg: "Hitung baris yang status_label-nya provisional atau disputed." },
          { kind: "equal", task: "t1", name: "n_tidak_final", value: 10, tol: 1e-9, label: "Hitungan non-final cocok", msg: "Periksa syarat status-nya: bukan hanya 'provisional' — 'disputed' juga belum final." },
          { kind: "defined", task: "t2", name: "fraud_rate_matang", label: "Fraud rate subset matang terhitung", msg: "Batasi subset ke status_label == 'final' dulu, lalu hitung proporsi label==1 di dalamnya." },
          { kind: "equal", task: "t2", name: "fraud_rate_matang", value: 6 / 14, tol: 1e-9, label: "Fraud rate matang cocok", msg: "Pastikan pembagi = jumlah baris final, bukan total baris." },
          { kind: "stdout_matches", task: "t3", pattern: "EMBARGO", label: "Keputusan yang benar tercetak", msg: "Bandingkan proporsi label belum final terhadap ambang yang diminta." },
        ],
      },
      reference: "Ground truth = status final saja. Keputusan TRAIN/EMBARGO harus mengikuti proporsi label yang belum matang.",
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
        "Chargeback lag (30–120 hari) membuat label 3–4 bulan terakhir belum matang → undercounted positives.",
        "Embargo 90–120 hari: data muda boleh jadi fitur, tidak boleh jadi label \"negatif pasti\".",
        "Noisy label (5–15% tipikal): ukur via blind review; perbaiki proses sebelum tuning model.",
        "PU learning: koreksi \"peluang berlabel\" menjadi \"peluang fraud sejati\"; waspadai asumsi SCAR.",
        "Label = produk sampingan proses bisnis, bukan kebenaran objektif. Tanya selalu: label ini lahir dari proses apa?",
      ],
      next: { label: "FR5 — Rule-Based", href: "/learn/fr5-rule-based" },
      quiz: [
        {
          q: "Chargeback lag median 45 hari. Kamu ekstrak training data kemarin. Apa masalah terbesarnya?",
          options: [
            { text: "Solusinya menambah data 6 bulan lagi ke belakang", why: "Data lebih banyak tidak mematangkan label muda — 3 bulan terakhir tetap penuh negatif palsu berapa pun panjang historinya." },
            { text: "Label 1-3 bulan terakhir belum matang — banyak 'negatif' sebenarnya fraud yang belum ketahuan", why: "Immature labels. Transaksi 1-3 bulan terakhir yang berlabel 'normal' = campuran normal + fraud yang chargeback-nya belum datang. Solusi: embargo 90-120 hari.", correct: true },
            { text: "Validasi harus pakai time-based split, bukan random split", why: "Time-based split memang praktik benar, tapi ia tidak memperbaiki masalahnya: label yang dipakai training dan validasi tetap salah." },
            { text: "Model butuh feature engineering yang lebih baik", why: "Fitur lebih baik tidak menolong bila target yang dipelajari adalah label bohong." },
          ],
        },
        {
          q: "Dalam PU learning, apa peran faktor koreksi c = P(s=1|y=1)?",
          options: [
            { text: "Menentukan ambang skor untuk mengklasifikasikan positif", why: "c bukan ambang keputusan — ia faktor koreksi probabilitas yang dipakai sebelum ambang apa pun dipilih." },
            { text: "Mengubah 'peluang berlabel' menjadi 'peluang fraud sejati' — mengoreksi bias undercounting", why: "Classifier awal hanya memprediksi P(berlabel|x); dibagi c menjadi P(fraud|x) sejati. Tanpa koreksi = underestimate sistematis.", correct: true },
            { text: "Mengukur seberapa akurat classifier pada data tak berlabel", why: "c mengukur peluang sebuah fraud ketahuan (proses labeling), bukan akurasi classifier." },
            { text: "Memberi bobot lebih besar pada sampel positif saat training", why: "Itu class weighting — teknik berbeda. c tidak mengubah bobot training, ia mengoreksi interpretasi skor setelahnya." },
          ],
        },
        {
          q: "Blind review 300 sampel menunjukkan 12% label salah. Tindakan paling tepat?",
          options: [
            { text: "Terapkan PU learning untuk mengoreksi 12% label yang salah", why: "PU learning menangani label yang belum matang/belum ketahuan — bukan label yang SALAH kategori. Noise butuh perbaikan proses, bukan koreksi probabilitas." },
            { text: "Perbaiki proses labeling dulu (guideline, double-review) — ROI label > ROI model", why: "Model apa pun di atas noise 12% = sampah terstruktur. Mengganti algoritma tanpa memperbaiki label = mengoptimasi ilusi.", correct: true },
            { text: "Hapus baris-baris yang dilabeli investigator dengan workload tertinggi", why: "Workload memang berkorelasi dengan error, tapi menghapus baris investigator sibuk = membuang data sekaligus menciptakan bias seleksi baru." },
            { text: "Tambah fitur agar model lebih robust terhadap noise label", why: "Fitur robust membantu sedikit, tapi noise sistematis 12% tidak bisa diakali fitur — akarnya ada di proses labeling." },
          ],
        },
        {
          q: "Produk pembayaran baru, nol histori fraud. Strategi awal terbaik?",
          options: [
            { text: "Latih supervised dengan synthetic data dari generator", why: "Synthetic data meniru asumsi pembuatnya, bukan pola penipu nyata — model belajar fiksi yang rapi." },
            { text: "Rule pakar + unsupervised anomaly detection; kumpulkan label via investigator; baru latih supervised", why: "Supervised butuh label; tanpa label, paksa supervised = fiksi. Kumpulkan label lewat operasi, lalu naik kelas.", correct: true },
            { text: "Pinjam label fraud dari produk lama yang mirip", why: "Pola fraud antarproduk berbeda (domain shift); label pinjaman membawa bias produk lain ke produk baru." },
            { text: "Minta investigator melabeli 50.000 transaksi acak dulu", why: "Satu label = Rp25–50rb + berminggu-minggu; 50.000 label acak = miliaran rupiah untuk mayoritas transaksi normal yang tidak informatif." },
          ],
        },
        {
          q: "\"Maturation re-labeling\" artinya…",
          options: [
            { text: "Menyimpan snapshot label tiap bulan untuk keperluan audit", why: "Itu label versioning — praktik pelengkap yang mencatat sejarah, bukan menulis ulang labelnya." },
            { text: "Menulis ulang label berkala — transaksi 'normal' lama dicek ulang apakah chargeback-nya akhirnya datang", why: "Label adalah living dataset. Chargeback yang datang 4 bulan kemudian harus memperbarui label historis.", correct: true },
            { text: "Menunggu 120 hari sebelum memakai data apa pun untuk training", why: "Itu embargo — aturan memakai data. Maturation re-labeling adalah menulis ulang label lama secara berkala." },
            { text: "Mengunci label setelah 30 hari agar tidak berubah-ubah", why: "Kebalikan dari yang benar: label justru dibiarkan berubah mengikuti chargeback yang datang belakangan." },
          ],
        },
      ],
    },
  ],
};
