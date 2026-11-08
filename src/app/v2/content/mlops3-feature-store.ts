import type { V2Lesson } from "../lib/types";

// Timeline point-in-time: label di hari ke-30. Jendela benar [0,30]; jendela bocor [0,60]
// dengan bagian masa depan (30,60] disorot sebagai sumber leakage.
const PIT_SVG = `<svg viewBox="0 0 480 200" role="img" aria-label="Timeline: jendela fitur benar hanya memakai event sebelum label, jendela bocor mengintip masa depan.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="30" y1="120" x2="450" y2="120"/></g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)" text-anchor="middle">
<text x="30" y="140">hari 0</text><text x="240" y="140">hari 30 (label)</text><text x="450" y="140">hari 60</text></g>
<g fill="var(--text-muted)"><circle cx="70" cy="112" r="4"/><circle cx="110" cy="112" r="4"/><circle cx="150" cy="112" r="4"/><circle cx="195" cy="112" r="4"/><circle cx="225" cy="112" r="4"/><circle cx="290" cy="112" r="4"/><circle cx="340" cy="112" r="4"/><circle cx="395" cy="112" r="4"/></g>
<line x1="240" y1="60" x2="240" y2="120" stroke="var(--c4)" stroke-width="2.5"/>
<text x="240" y="50" text-anchor="middle" font-size="12" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">waktu label</text>
<rect x="30" y="160" width="210" height="14" rx="7" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="135" y="186" text-anchor="middle" font-size="11" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">BENAR: event ≤ hari 30</text>
<rect x="30" y="30" width="420" height="14" rx="7" fill="none" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5 3"/>
<rect x="240" y="30" width="210" height="14" rx="7" fill="var(--c4)" opacity="0.25"/>
<text x="240" y="22" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">BOCOR: mengintip hari 31–60 (masa depan!)</text>
<text x="240" y="106" text-anchor="middle" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)">● = event transaksi</text>
</svg>`;

const MLOPS3_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Dua kurva distribusi fitur avg_trx_30d: training berpusat di 1,2 juta, serving bergeser ke 1,55 juta."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)"></text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)"></text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)"></text><text x="46.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,5jt</text><text x="213.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1,2jt</text><text x="380.4" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1,9jt</text><polyline points="46.0,165.5 129.6,107.3 213.2,20.0 296.8,107.3 380.4,165.5" fill="none" stroke="var(--c1)" stroke-width="2.5"/><polyline points="46.0,180.0 129.6,165.5 213.2,107.3 296.8,20.0 380.4,107.3 464.0,165.5" fill="none" stroke="var(--c4)" stroke-width="2.5"/><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">biru=training, merah=serving</text></svg>`;

export const mlops3: V2Lesson = {
  slug: "mlops3-feature-store",
  track: "MLOps",
  module: "Fondasi Operasi",
  title: "MLOps3 — Feature Store",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Fitur yang sama, definisi yang beda",
      prose: [
        "Tim fraud Bank Mini melatih model dengan fitur 'total_transaksi_30d'. Di training, fitur ini dihitung oleh job batch malam hari dari data warehouse. AUC validasi: 0,89. Semua orang optimis.",
        "Di produksi, tim serving menghitung fitur yang 'sama' secara real-time dari stream transaksi — dengan definisi yang sedikit berbeda: batch memakai zona waktu UTC dan memotong tepat 30×24 jam, stream memakai waktu lokal dan jendela kalender. Hasilnya: AUC produksi 0,71. Model yang sama, fitur yang 'sama', performa jatuh 18 poin.",
        "Twist-nya: tidak ada yang berbohong. Kedua definisi masuk akal sendiri-sendiri. Masalahnya: tidak ada SATU definisi resmi yang dipakai bersama. Training dan serving diam-diam berbicara dalam dua bahasa berbeda — inilah train-serve skew, pembunuh senyap nomor satu model produksi.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa definisi fitur yang berbeda antara training dan serving meruntuhkan akurasi; (2) menghitung skew training-serving sebagai z-score dan menilai signifikansinya; (3) merancang point-in-time join yang benar untuk satu kasus churn; (4) memutuskan kapan tim membutuhkan feature store vs solusi sederhana.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Fitur training pasti sama dengan fitur serving'",
        type: "pitfall",
        body: "Asumsi paling mahal di MLOps. Kode training (Python batch) dan kode serving (Java streaming) ditulis tim berbeda, di waktu berbeda, dari sumber berbeda. Tanpa definisi tunggal yang dieksekusi oleh kedua sisi, skew bukan kemungkinan — melainkan kepastian yang menunggu waktu.",
      },
      reference: "Train-serve skew: definisi fitur ganda = model memakan data yang tak pernah ia latih.",
    },
    {
      id: "feature-store",
      eyebrow: "Langkah 2 · Feature store",
      title: "Satu definisi, dua toko",
      prose: [
        "Feature store adalah repositori terpusat untuk definisi dan nilai fitur. Prinsip intinya: definisi ditulis SEKALI (sebagai kode/transformasi), lalu dieksekusi untuk dua kebutuhan — training (batch, throughput besar, data historis) dan serving (real-time, latensi milidetik).",
        "Arsitekturnya punya dua 'toko'. Offline store: gudang data historis untuk training dan backfill — murah, lambat, lengkap. Online store: key-value cepat (Redis, DynamoDB) berisi nilai fitur TERKINI per entitas — mahal, cepat, hanya snapshot terakhir. Keduanya diisi oleh pipeline yang sama, sehingga definisinya konsisten.",
        "Tanpa feature store, tiap tim menghitung ulang fitur dengan caranya sendiri: duplikasi kode, definisi menyimpang, dan tidak ada yang bisa menjawab 'fitur X dihitung bagaimana?' Dengan feature store, ada jawaban tunggal yang bisa diaudit.",
        "💡 Intuisi: feature store seperti dapur sentral restoran waralaba. Semua cabang memakai bumbu dari SATU resep dan SATU pemasok. Tanpa dapur sentral, cabang Jakarta dan Surabaya menyajikan 'rendang yang sama' dengan rasa berbeda — dan tidak ada yang tahu kenapa.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Feature store = database biasa untuk fitur'",
        type: "pitfall",
        body: "Database menyimpan nilai; feature store menjamin KONSISTENSI definisi dan POINT-IN-TIME correctness (lihat langkah 3). Tabel SQL berisi fitur tanpa versioning transformasi dan tanpa join as-of-time hanyalah gudang angka — skew tetap bisa terjadi diam-diam.",
      },
      reference: "Feature store = satu definisi + offline store (training) + online store (serving).",
    },
    {
      id: "point-in-time",
      eyebrow: "Langkah 3 · Point-in-time correctness",
      title: "Jangan mengintip masa depan",
      prose: [
        "Bahkan dengan definisi sama, ada jebakan waktu: saat membangun data training, fitur untuk label di waktu t HANYA boleh memakai event dengan timestamp ≤ t. Memakai event setelah t = target leakage — model 'belajar' dari masa depan yang tidak akan ada saat serving.",
        "Rumusnya tegas:",
      ],
      formula: String.raw`fitur(t) = agregat(\{e : ts(e) \le t\})`,
      formulaNote: "fitur(t) = nilai fitur untuk label di waktu t; e = event; ts(e) = timestamp event. Himpunan event yang boleh dipakai DIBATASI: hanya yang terjadi pada atau sebelum t. Satu event bocor = seluruh training tercemar.",
      figure: {
        svg: PIT_SVG,
        alt: "Timeline: jendela fitur benar hanya memakai event sebelum label, jendela bocor mengintip masa depan.",
        caption: "Point-in-time join: fitur untuk label hari ke-30 hanya boleh memakai event hari 0–30. Memakai hari 31–60 = mengintip masa depan. Cara membaca: garis waktu horizontal; area hijau (hari 0–30) = data yang BOLEH dipakai, area merah (31–60) = masa depan yang terlarang. Interpretasi: satu baris data masa depan yang bocor membuat akurasi validasi terlihat 5–10pp lebih tinggi dari aslinya — dan runtuh saat deploy.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Kan cuma agregat 30 hari, apa bedanya?' Bedanya: agregat [t−30, t] vs [t−30, t+30] terlihat sama di kode, tapi yang kedua mengandung informasi masa depan (mis. penipu bertransaksi menggila SETELAH terdeteksi). Model dengan leakage terlihat hebat di validasi — lalu gagal total di produksi. Leakage tidak menimbulkan error; ia menimbulkan kepercayaan diri palsu.",
      },
      reference: "fitur(t) hanya dari event ≤ t. Leakage = performa semu, bukan performa.",
    },
    {
      id: "lab-pit",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: buktikan leakage dengan angka",
      prose: [
        "Simulasi 400 nasabah: 10% penipu. Polanya realistis — penipu bertransaksi NORMAL sebelum hari ke-30 (waktu label), lalu MENGGILA setelahnya karena serangan berlanjut. Fitur = jumlah transaksi besar.",
        "Tugasmu: implementasikan dua versi fitur — `fitur_benar` (hanya event indeks 0–29, yaitu ≤ waktu label) dan `fitur_bocor` (semua event 0–59). Ukur 'separasi' = rata-rata fitur penipu minus rata-rata fitur normal.",
        "Cara membaca: separasi positif besar = fitur tampak sangat prediktif. Interpretasi: jika versi 'bocor' tampak JAUH lebih baik, itu bukan keunggulan — itu ilusi masa depan. Di produksi, event hari 31–60 belum terjadi saat skor dibutuhkan.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `fitur_benar` (point-in-time, indeks < 30)" },
        { id: "t2", text: "Implementasikan `fitur_bocor` (semua event)" },
        { id: "t3", text: "Jalankan; bandingkan separasi keduanya" },
      ],
      expected: "benar −0.20 (lemah) · bocor +14.00 (tampak hebat, palsu)",
      note: {
        title: "💡 Intuisi: leakage seperti contekan",
        body: "Siswa yang mencontek terlihat pintar saat ujian — sampai ujian sesungguhnya tanpa contekan. Model dengan leakage = siswa bercontekan: nilai validasinya tinggi, nilai produksinya jeblok. Bedanya, contekan siswa ketahuan pengawas; leakage model tidak ketahuan siapa pun sampai uang hilang.",
      },
      hints: [
        "fitur_benar: sum(1 for e in ns['event'][:30] if e > 5).",
        "fitur_bocor: sum(1 for e in ns['event'] if e > 5) — tanpa batas indeks.",
        "separasi = rata-rata(fitur penipu) − rata-rata(fitur normal).",
      ],
      code: {
        starter: `import random\nrandom.seed(33)\n\nN = 400\nnasabah = []\nfor i in range(N):\n    fraud = random.random() < 0.10\n    pra   = [random.expovariate(1/3) for _ in range(30)]\n    pasca = [random.expovariate(1/12 if fraud else 1/3) for _ in range(30)]\n    nasabah.append({"fraud": fraud, "event": pra + pasca})\n\n# TULIS KODEMU: dua versi fitur\ndef fitur_benar(ns):\n    \n\ndef fitur_bocor(ns):\n    \n\ndef separasi(fitur_fn):\n    f_fraud = [fitur_fn(ns) for ns in nasabah if ns["fraud"]]\n    f_ok    = [fitur_fn(ns) for ns in nasabah if not ns["fraud"]]\n    return sum(f_fraud)/len(f_fraud) - sum(f_ok)/len(f_ok)\n\ns_benar = separasi(fitur_benar)\ns_bocor = separasi(fitur_bocor)\nprint(f"Separasi fitur BENAR (point-in-time)   : {s_benar:+.2f} (nyaris nol = fitur jujur tapi lemah)")\nprint(f"Separasi fitur BOCOR (pakai masa depan): {s_bocor:+.2f} (TAMPAK hebat!)")\nprint("Kesimpulan: fitur bocor terlihat jauh lebih prediktif --")\nprint("padahal ia mengintip masa depan. Itulah target leakage.")`,
        lockLines: 11,
        solution: `import random\nrandom.seed(33)\n\nN = 400\nnasabah = []\nfor i in range(N):\n    fraud = random.random() < 0.10\n    pra   = [random.expovariate(1/3) for _ in range(30)]\n    pasca = [random.expovariate(1/12 if fraud else 1/3) for _ in range(30)]\n    nasabah.append({"fraud": fraud, "event": pra + pasca})\n\n# TULIS KODEMU: dua versi fitur\ndef fitur_benar(ns):\n    return sum(1 for e in ns["event"][:30] if e > 5)\n\ndef fitur_bocor(ns):\n    return sum(1 for e in ns["event"] if e > 5)\n\ndef separasi(fitur_fn):\n    f_fraud = [fitur_fn(ns) for ns in nasabah if ns["fraud"]]\n    f_ok    = [fitur_fn(ns) for ns in nasabah if not ns["fraud"]]\n    return sum(f_fraud)/len(f_fraud) - sum(f_ok)/len(f_ok)\n\ns_benar = separasi(fitur_benar)\ns_bocor = separasi(fitur_bocor)\nprint(f"Separasi fitur BENAR (point-in-time)   : {s_benar:+.2f} (nyaris nol = fitur jujur tapi lemah)")\nprint(f"Separasi fitur BOCOR (pakai masa depan): {s_bocor:+.2f} (TAMPAK hebat!)")\nprint("Kesimpulan: fitur bocor terlihat jauh lebih prediktif --")\nprint("padahal ia mengintip masa depan. Itulah target leakage.")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "BENAR \\(point-in-time\\)\\s+: -0\\.20", label: "Separasi benar −0.20", msg: "Fitur jujur nyaris tidak memisahkan — itu kenyataan pahitnya, bukan bug." },
          { kind: "stdout_matches", task: "t3", pattern: "BOCOR \\(pakai masa depan\\): \\+14\\.00", label: "Separasi bocor +14.00", msg: "Fitur bocor tampak 14 poin lebih baik — ilusi dari mengintip masa depan." },
          { kind: "stdout_matches", task: "t3", pattern: "target leakage", label: "Kesimpulan tercetak", msg: "Baris kesimpulan harus tercetak." },
        ],
      },
      reference: "ns['event'][:30] vs ns['event'] — dua karakter beda, 14 poin ilusi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan butuh feature store?",
      prose: [
        "**Skenario 1 — Fitur sedikit & tim kecil.** 5 fitur dari satu tabel, training dan serving ditulis orang yang sama. → Cukup modul Python bersama (shared feature code) yang di-import kedua sisi. Feature store = overkill.",
        "**Skenario 2 — Banyak tim, banyak model, fitur dipakai ulang.** Fitur 'risk_score_7d' dipakai 4 model oleh 3 tim. → Feature store: definisi tunggal, discovery ('fitur apa yang sudah ada?'), dan konsistensi lintas tim. Inilah kasus klasiknya.",
        "**Skenario 3 — Butuh real-time + point-in-time.** Fraud scoring butuh fitur 1 jam terakhir saat serving DAN rekonstruksi historis yang benar untuk training. → Feature store dengan online + offline store. Tanpa ini, leakage hampir pasti terjadi.",
        "**Skenario 4 — Regulasi ketat.** Bank harus bisa menjelaskan 'nilai fitur X untuk nasabah Y pada tanggal Z'. → Feature store + versioning + audit: rekonstruksi historis adalah syarat compliance, bukan kemewahan.",
        "Aturan praktis 10 detik: jika fitur dihitung di ≥2 tempat ATAU jawaban 'fitur ini dihitung bagaimana?' butuh >1 hari untuk ditemukan — kamu butuh feature store.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: fitur adalah kontrak",
        body: "Setiap fitur adalah kontrak antara training dan serving: 'angka ini artinya X, dihitung dengan cara Y, dari data per waktu Z'. Feature store adalah notaris kontrak itu — mencatat, memverifikasi, dan menegakkannya di kedua sisi. Tanpa notaris, kontrak hanya omongan.",
      },
      reference: "≥2 tempat hitung atau >1 hari melacak definisi = butuh feature store.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Churn Telko: akurasi 0,93 yang runtuh",
      prose: [
        "Operator seluler melatih model churn dengan fitur 'rata2_pemakaian_90d'. Training: dihitung dari billing warehouse per akhir bulan. Validasi: akurasi 0,93. Produksi: model di-serve via API yang menghitung fitur dari stream CDR real-time — memakai definisi '90 hari kalender terakhir' vs '3 siklus billing terakhir' di training.",
        "Hasil 2 bulan: akurasi produksi 0,68. Kampanye retensi salah sasaran Rp850 juta/bulan (diskon diberikan ke pelanggan yang tidak akan churn). Investigasi butuh 3 minggu karena tidak ada dokumentasi definisi fitur di kedua sisi.",
        "**Pertanyaan:** (1) Jenis skew apa ini? (2) Berapa kerugian 2 bulan + biaya investigasi (3 engineer × 3 minggu × Rp15 jt/minggu)? (3) Komponen feature store apa yang mencegahnya?",
        "**Pembahasan:** (1) Train-serve skew definisional — bukan drift data, melainkan dua definisi berbeda. (2) 2 × Rp850 jt = Rp1,7 M + 3 × 3 × Rp15 jt = Rp135 jt → total Rp1,835 M. (3) Definisi tunggal berversion + eksekusi yang sama untuk batch (training) dan online (serving); dokumentasi otomatis dari definisi kode.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk model berisiko (kredit, fraud, churn bernilai tinggi), 'definisi fitur' adalah bagian dari model risk documentation. Regulator menanyakan bukan cuma 'modelnya apa' tapi 'inputnya dihitung bagaimana'. Feature store yang berversion menjawab ini dalam hitungan menit.",
      },
      reference: "Rp1,835 M untuk dua definisi yang tidak pernah disatukan.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Skew training-serving: diukur, bukan dirasakan",
      prose: [
        "Churn Telko dari mini-case runtuh dari 0,93 ke 0,71 bukan karena modelnya jelek — melainkan karena fitur `avg_trx_30d` dihitung BERBEDA. Saat training, analis menghitung rata-rata transaksi 30 hari KALENDER. Saat serving, engineer menghitung 30 hari KERJA (Sabtu-Minggu dikecualikan). Hasilnya: mean fitur di training Rp1,20 juta, di serving Rp1,55 juta. Model yang belajar `rata-rata di bawah Rp1,3 juta = berisiko churn` tiba-tiba melihat hampir semua nasabah `aman`. Inilah training-serving skew: fitur yang sama namanya, beda isinya.",
        "Skew bisa diukur dengan satu angka. Definisikan skew_z = |μ_train − μ_serve| / σ_train: selisih mean dibagi standar deviasi training. Untuk kasus Telko: |1,20 − 1,55| / 0,35 = 1,0. Artinya distribusi serving bergeser SATU standar deviasi penuh — setara dengan memindahkan separuh populasi ke kuartil yang berbeda. Aturan praktis: skew_z < 0,25 = noise yang bisa diabaikan; 0,25–0,5 = waspada, selidiki definisinya; > 0,5 = hampir pasti ada perbedaan definisi atau populasi, JANGAN deploy sebelum diperbaiki.",
        "Kenapa skew sekecil 0,25 sudah berbahaya? Karena model non-linear (tree, GBM) membuat keputusan di BATAS-batas sempit. Jika batas keputusan ada di Rp1,3 juta dan populasi bergeser 0,25σ ≈ Rp90 ribu, maka ~10% nasabah pindah sisi batas — 10% keputusan berubah karena artefak definisi, bukan karena perilaku nasabah. Pada volume 2 juta nasabah, itu 200 ribu keputusan salah arah per bulan.",
        "Cara sistematis mencegahnya ada tiga. Pertama, `single source of truth`: definisi fitur ditulis SEKALI sebagai kode (mis. SQL/Feast feature view) dan dipakai oleh training MAUPUN serving — bukan dua orang menulis dua query yang `kelihatannya sama`. Kedua, `skew check` di gerbang deploy: hitung skew_z untuk 20 fitur terpenting pada sampel serving 7 hari terakhir vs data training; tolak deploy jika ada yang > 0,5. Ketiga, `shadow scoring`: jalankan model baru di traffic nyata selama 2 minggu TANPA memakai keputusannya, bandingkan distribusi skornya dengan ekspektasi training.",
        "Contoh perhitungan shadow scoring: ekspektasi dari validasi — 30% skor di bucket risiko tinggi (> 0,7). Hasil shadow 2 minggu: hanya 12% di bucket itu. Selisih 18pp dengan n = 50.000 sampel: standard error proporsi ≈ √(0,3×0,7/50000) ≈ 0,2% — selisih 18pp adalah 90 standard error, mustahil karena kebetulan. Kesimpulan: ada skew sistematis, investigasi definisi fitur WAJIB sebelum deploy. Tanpa shadow, angka 12% ini baru ketahuan setelah NPL naik berbulan-bulan kemudian.",
        "Biaya skew juga bisa dihitung. Asumsi model churn dipakai untuk kampanye retensi Rp50 ribu per nasabah yang diprediksi churn. Skew menyebabkan 200 ribu nasabah salah klasifikasi per bulan: separuh (100 ribu) nasabah aman dikirimi kampanye sia-sia = Rp5 miliar/bulan terbuang; separuh lagi nasabah berisiko TIDAK dikampanye — jika 5% dari mereka churn dan tiap churn merugikan Rp2 juta, = Rp10 miliar/bulan hilang. Total tagihan skew: Rp15 miliar/bulan. Feature store yang mencegahnya berharga Rp200–400 juta untuk dibangun — payback period-nya 1 hari.",
        "Terakhir, waspadai `skew waktu`: definisi yang sama tapi POPULASI berubah. Contoh: fitur `trx_weekend_ratio` stabil saat training (Jan–Mar), tapi Ramadan menggeser pola belanja — mean naik 40%. Ini bukan salah definisi, melainkan drift alami (wilayah MLOps7). Bedakan keduanya: skew definisi muncul SEKETIKA saat deploy (distribusi langsung lompat), drift populasi muncul PELAN (bergeser minggu demi minggu). Obatnya beda: skew definisi → perbaiki kode; drift populasi → retrain atau adaptasi.",
      ],
      formula: String.raw`skew_z = \frac{|\mu_{train} - \mu_{serve}|}{\sigma_{train}}`,
      formulaNote: "μ_train, μ_serve = rata-rata fitur di data training vs serving; σ_train = standar deviasi di training. skew_z < 0,25 abaikan; 0,25–0,5 selidiki; > 0,5 tolak deploy. Ukur untuk fitur-fitur terpenting sebelum setiap deploy.",
      figure: {
        svg: MLOPS3_DEEP_SVG,
        alt: "Dua kurva distribusi: training berpusat di Rp1,2 juta, serving bergeser kanan ke Rp1,55 juta.",
        caption: "Cara membaca: sumbu X = nilai fitur avg_trx_30d (juta rupiah), sumbu Y = frekuensi; kurva biru = distribusi saat training, merah = saat serving. Interpretasi: pergeseran satu standar deviasi (skew_z = 1,0) memindahkan ~10% nasabah melewati batas keputusan model — 200 ribu keputusan salah arah per bulan karena beda definisi, bukan beda perilaku.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: fitur adalah kontrak, bukan kolom",
        body: "Nama kolom yang sama tidak menjamin isi yang sama. Perlakukan setiap fitur seperti kontrak API: definisinya ditulis sekali, di-version, dan diuji (skew check) sebelum dipakai. Dua query yang `kelihatannya sama` adalah sumber skew nomor satu di industri.",
      },
      reference: "skew_z > 0,5 = tolak deploy. Definisi fitur ditulis sekali, dipakai di training dan serving.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Train-serve skew: definisi fitur ganda = model memakan data yang tak dikenalnya.",
        "Feature store = satu definisi + offline store (training) + online store (serving).",
        "Point-in-time: fitur(t) hanya dari event dengan timestamp ≤ t; selebihnya leakage.",
        "Leakage tidak menimbulkan error — ia menimbulkan kepercayaan diri palsu.",
        "Butuh feature store saat fitur dihitung di ≥2 tempat atau definisi sulit dilacak.",
      ],
      next: { label: "MLOps4 — Model Registry & Versioning", href: "/v2/learn/mlops4-registry" },
      quiz: [
        {
          q: "Kasus Bank Mini: AUC training 0,89 tapi produksi 0,71. Penyebab paling mungkin?",
          options: [
            { text: "Overfitting klasik", why: "Overfitting menurunkan validasi juga; di sini validasi 0,89 'sehat'." },
            { text: "Train-serve skew: definisi fitur beda di batch vs streaming", why: "Batch pakai UTC & 30×24 jam; stream pakai waktu lokal & kalender. Fitur 'sama' yang berbeda.", correct: true },
            { text: "Data produksi terlalu sedikit", why: "Volume produksi justru besar; masalahnya definisi, bukan jumlah." },
            { text: "Model terlalu sederhana", why: "Model yang sama; yang berubah hanya definisi inputnya." },
          ],
        },
        {
          q: "Apa fungsi utama online store dalam feature store?",
          options: [
            { text: "Menyimpan data training historis", why: "Itu tugas offline store — murah, lambat, lengkap." },
            { text: "Menyajikan nilai fitur TERKINI dengan latensi milidetik untuk serving", why: "Online store = key-value cepat berisi snapshot terakhir per entitas, diisi pipeline yang sama dengan offline store.", correct: true },
            { text: "Melatih model lebih cepat", why: "Training memakai offline store, bukan online store." },
            { text: "Menggantikan database transaksi", why: "Ia turunan read-optimized, bukan system of record." },
          ],
        },
        {
          q: "Label di t=30. Jendela fitur mana yang BENAR (point-in-time)?",
          options: [
            { text: "Event hari 0–60", why: "Mengandung hari 31–60 = masa depan relatif terhadap label. Leakage." },
            { text: "Event hari 0–30", why: "Hanya event dengan timestamp ≤ t. Inilah rumus fitur(t).", correct: true },
            { text: "Event hari 15–45", why: "Hari 31–45 adalah masa depan. Jendela boleh asimetris asal ≤ t." },
            { text: "Semua event yang tersedia", why: "'Semua yang tersedia' hampir selalu termasuk masa depan." },
          ],
        },
        {
          q: "Lab menunjukkan fitur bocor separasi +14,00 vs benar −0,20. Kesimpulan tepat?",
          options: [
            { text: "Fitur bocor lebih baik, pakai itu", why: "Itu ilusi: di produksi, event masa depan belum ada saat skor dibutuhkan." },
            { text: "Angka +14,00 adalah performa semu dari target leakage; fitur jujur memang lemah", why: "Tepat: validasi tinggi + produksi jeblok adalah tanda klasik leakage. Terima kenyataan, cari fitur yang benar-benar prediktif.", correct: true },
            { text: "Simulasinya salah", why: "Simulasi justru dirancang menunjukkan pola serangan berlanjut — realistis." },
            { text: "Naikkan threshold agar benar ikut bagus", why: "Threshold tidak mengubah fakta kebocoran informasi masa depan." },
          ],
        },
        {
          q: "Tim 3 orang, 6 fitur dari satu tabel, training & serving ditulis orang yang sama. Rekomendasi?",
          options: [
            { text: "Bangun feature store terdistribusi", why: "Overkill untuk skala ini — biaya > manfaat." },
            { text: "Modul Python bersama untuk definisi fitur, di-import kedua sisi", why: "Satu definisi kode = konsistensi tanpa infrastruktur berat. Naik kelas saat fitur dipakai lintas tim.", correct: true },
            { text: "Tidak perlu konsistensi fitur", why: "Skew bisa terjadi di tim kecil juga; hanya solusinya lebih ringan." },
            { text: "Tulis ulang definisi tiap kali deploy", why: "Itulah resep skew — definisi harus ditulis sekali." },
          ],
        },
        {
          q: "Shadow scoring 2 minggu menunjukkan 12% skor di bucket risiko tinggi, padahal ekspektasi validasi 30% (n = 50.000). Kesimpulan yang TEPAT?",
          options: [
            { text: "Normal — 12% vs 30% masih dalam noise sampling", why: "Standard error proporsi dengan n=50.000 hanya ~0,2%; selisih 18pp = 90 standard error. Ini mustahil noise — pasti ada perbedaan sistematis." },
            { text: "Ada skew sistematis; investigasi definisi fitur wajib sebelum deploy", why: "Tepat. Selisih sebesar ini dengan sampel sebesar ini hanya bisa dijelaskan oleh perbedaan definisi/populasi. Deploy tanpa investigasi = mengulang tragedi Telko 0,93 → 0,71.", correct: true },
            { text: "Modelnya underfit — latih ulang dengan lebih banyak epoch", why: "Underfit tidak menjelaskan perbedaan distribusi skor antara validasi dan shadow pada MODEL YANG SAMA. Ini soal data, bukan kapasitas model." },
            { text: "Naikkan ambang bucket risiko tinggi agar angkanya cocok", why: "Mengubah ambang agar angka `cocok` adalah memalsukan speedometer karena tidak suka kecepatannya. Skew-nya tetap ada dan tetap merusak keputusan." },
          ],
        },
      ],
    },
  ],
};
