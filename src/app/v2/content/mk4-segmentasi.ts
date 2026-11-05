import type { V2Lesson } from "../lib/types";

export const mk4: V2Lesson = {
  slug: "mk4-segmentasi",
  track: "Marketing Analytics",
  module: "Segmentasi Pelanggan",
  title: "MK4 — Segmentasi: K-Means & Persona",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-banknusa",
      eyebrow: "Langkah 1 · Cerita BankNusa",
      title: "7 cluster yang tidak dipakai siapa pun",
      prose: [
        "BankNusa membuat 7 cluster dengan silhouette 0,62 — bagus secara statistik. Tapi tim marketing tidak memakainya: cluster-nya tidak bisa dijelaskan (\u201Ccluster 4 itu siapa?\u201D) dan tidak ada aksi yang jelas untuk tiap cluster.",
        "Mereka mengulang dengan k=4 yang dirancang bersama tim bisnis. Response rate kampanye naik dari 2,1% ke 6,4%. Statistiknya \u201Clebih jelek\u201D, bisnisnya jauh lebih baik.",
        "Pelajaran lesson ini: segmentasi yang baik = cluster yang bisa diberi nama, diukur ukurannya, dan dipetakan ke satu aksi. Skor statistik hanya syarat perlu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Segmentasi yang tidak actionable bukan netral — ia menghabiskan waktu analis dan membuat tim bisnis berhenti percaya pada data.",
        type: "risk",
      },
      reference: "Segmentasi dinilai dari aksi yang ia hasilkan, bukan skornya.",
    },
    {
      id: "kmeans-standard",
      eyebrow: "Langkah 2 · K-means & lab",
      title: "K-means: standardisasi dulu, baru cluster",
      prose: [
        "K-means meminimalkan WCSS: jumlah kuadrat jarak tiap titik ke centroid cluster-nya. Masalahnya: jarak euclidean didominasi fitur dengan skala besar. Saldo (jutaan) akan menenggelamkan umur (puluhan) — cluster jadi \u201Ckaya vs miskin\u201D doang, umur diabaikan.",
        "Solusinya: standardisasi tiap fitur jadi z-score sebelum clustering. Setelah itu jarak bicara dalam satuan \u201Cberapa standar deviasi\u201D, bukan rupiah vs tahun.",
        "Di lab ini kamu menstandardisasi data nasabah mini dan menghitung jarak — rasakan sendiri kenapa langkah ini tidak boleh dilewatkan.",
      ],
      formula: String.raw`\text{WCSS} = \sum_{k=1}^{K}\sum_{x \in C_k} ||x - \mu_k||^2`,
      formulaNote: "WCSS = within-cluster sum of squares (yang diminimalkan k-means): K = jumlah cluster; C_k = himpunan titik di cluster ke-k; x = satu titik data (sudah distandardisasi!); μ_k (mu) = centroid cluster ke-k; ||x − μ_k||² = kuadrat jarak euclidean titik ke centroid-nya. WCSS selalu turun saat K naik — jadi ia tidak bisa dipakai sendirian untuk memilih K.",
      tasks: [
        { id: "t1", text: "Hitung `z_umur` dan `z_saldo` (z-score tiap kolom)" },
        { id: "t2", text: "Hitung `d01` = jarak euclidean titik 0 ke titik 1 di ruang z" },
        { id: "t3", text: "Cetak dengan `print`" },
      ],
      expected: "z_umur_0=-0.95 d01=0.18",
      note: {
        title: "Sering salah",
        body: "Standardisasi setelah split train/test memakai mean dari test. Selalu hitung mean/sd dari data training (atau seluruh data untuk clustering eksploratif), lalu terapkan ke sisanya.",
        type: "pitfall",
      },
      hints: [
        "import statistics as st; mean = st.mean(umur); sd = st.stdev(umur).",
        "z_umur = [(x - mean_u)/sd_u for x in umur].",
        "d01 = ((z_umur[0]-z_umur[1])**2 + (z_saldo[0]-z_saldo[1])**2)**0.5",
      ],
      code: {
        starter: `import statistics as st\n\numur  = [25, 27, 45, 47]\nsaldo = [5, 7, 80, 85]  # juta Rp\n\n# TULIS KODEMU: z-score tiap kolom, lalu jarak titik 0-1\nmean_u, sd_u = st.mean(umur), st.stdev(umur)\nmean_s, sd_s = st.mean(saldo), st.stdev(saldo)\nz_umur =\nz_saldo =\nd01 =\n\nprint(f"z_umur_0={z_umur[0]:.2f} d01={d01:.2f}")`,
        lockLines: 4,
        solution: `import statistics as st\n\numur  = [25, 27, 45, 47]\nsaldo = [5, 7, 80, 85]  # juta Rp\n\n# TULIS KODEMU: z-score tiap kolom, lalu jarak titik 0-1\nmean_u, sd_u = st.mean(umur), st.stdev(umur)\nmean_s, sd_s = st.mean(saldo), st.stdev(saldo)\nz_umur = [(x - mean_u) / sd_u for x in umur]\nz_saldo = [(x - mean_s) / sd_s for x in saldo]\nd01 = ((z_umur[0] - z_umur[1])**2 + (z_saldo[0] - z_saldo[1])**2) ** 0.5\n\nprint(f"z_umur_0={z_umur[0]:.2f} d01={d01:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "z_umur", value: -0.948, tol: 0.01, label: "`z_umur[0]` sekitar -0,95", msg: "(25 - 36) / 11,60. Cek mean dan stdev kolom umur." },
          { kind: "equal", task: "t2", name: "d01", value: 0.178, tol: 0.02, label: "`d01` sekitar 0,18", msg: "Dua nasabah muda-saldo-kecil memang dekat di ruang z." },
          { kind: "stdout_matches", task: "t3", pattern: "z_umur_0=-0\\.95", label: "`print` menampilkan z_umur_0", msg: "Format: z_umur_0=... d01=... ." },
        ],
      },
      reference: "st.mean, st.stdev. z = (x - mean) / sd.",
    },
    {
      id: "elbow-silhouette",
      eyebrow: "Langkah 3 · Pilih k",
      title: "Elbow, silhouette, dan k-means++",
      prose: [
        "Berapa k yang tepat? Elbow: plot WCSS untuk k=1..10, pilih titik di mana penurunan melandai (\u201Csiku\u201D). Silhouette mengukur per titik: s = (b − a) / max(a,b), di mana a = jarak rata-rata ke anggota cluster sendiri, b = ke cluster terdekat lain. Dekat 1 = cluster rapat dan terpisah.",
        "Kalau elbow landai dan tidak jelas, jangan dipaksa: gabungkan BIC/GMM atau — seperti BankNusa — tanya bisnis butuh berapa segmen yang bisa dilayani. k yang \u201Cbenar\u201D secara statistik tapi tidak bisa diaktivasi = k yang salah.",
        "Satu detail teknis: inisialisasi centroid dengan k-means++ (centroid awal disebar), bukan acak murni — hasil lebih stabil dan WCSS lebih kecil.",
      ],
      formula: String.raw`s = \frac{b - a}{\max(a, b)}`,
      formulaNote: "s = silhouette score satu titik (rentang −1 sampai 1): a = jarak rata-rata titik ke semua anggota cluster-nya sendiri (kekompakan); b = jarak rata-rata ke anggota cluster terdekat yang lain (keterpisahan). s dekat 1 = titik sangat cocok di clusternya; s ≈ 0 = di perbatasan; s negatif = kemungkinan salah cluster. Rata-rata s seluruh titik = silhouette keseluruhan.",
      tasks: [],
      reference: "Elbow untuk kandidat k; silhouette untuk validasi; bisnis untuk keputusan.",
    },
    {
      id: "gmm",
      eyebrow: "Langkah 4 · GMM",
      title: "GMM: cluster yang tumpang tindih",
      prose: [
        "K-means memberi hard assignment: tiap titik milik tepat satu cluster. GMM (Gaussian Mixture Model) memberi soft assignment: titik bisa 70% cluster A, 30% cluster B. Untuk data yang memang tumpang tindih (mis. segmen \u201Ckeluarga muda\u201D vs \u201Cprofesional muda\u201D), ini lebih jujur.",
        "Pemilihan jumlah komponen memakai BIC (Bayesian Information Criterion): makin kecil makin baik, dengan penalti untuk kompleksitas. BIC turun terus = model makin kompleks tanpa penalti yang cukup — berhenti saat penurunannya mengecil.",
        "Kapan GMM menang: cluster berbentuk elips (bukan bola), ukuran cluster timpang, atau kamu butuh probabilitas keanggotaan untuk scoring (MK7).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai GMM lalu mengambil argmax dan memperlakukannya seperti k-means. Kalau akhirnya hard assignment juga, keunggulan GMM hilang — pakai probabilitasnya untuk scoring atau prioritization.",
        type: "pitfall",
      },
      reference: "GMM = soft assignment + BIC. Untuk overlap dan scoring probabilistik.",
    },
    {
      id: "persona-3a",
      eyebrow: "Langkah 5 · Persona & uji 3A",
      title: "Dari cluster ke persona yang bisa diaktivasi",
      prose: [
        "Deliverable segmentasi bukan plot cluster — melainkan tabel persona: nama segmen, profil (umur, perilaku), ukuran, dan satu aksi. \u201CSegmen 2: Keluarga Mapan, 32%, belanja bulanan Rp2jt, aksi: bundling keluarga.\u201D",
        "Uji 3A sebelum presentasi: Available (bisakah kita menjangkau mereka? ada datanya?), Actionable (adakah aksi berbeda per segmen?), Alive (apakah segmennya stabil dari waktu ke waktu, bukan artefak bulan ini?).",
        "Cluster yang gagal uji 3A: gabungkan dengan tetangganya atau buang. Empat segmen yang hidup lebih baik dari tujuh yang mati di slide.",
      ],
      tasks: [],
      reference: "Persona = cluster + profil + ukuran + 1 aksi. Lolos 3A baru presentasi.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek judgment segmentasimu",
      prose: [
        "Tiga soal tentang keputusan yang sering salah di proyek segmentasi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Fitur: umur (20–60) dan saldo (1–500 juta). Langkah pertama sebelum k-means?",
          options: [
            { text: "Standardisasi — saldo akan mendominasi jarak", why: "Tanpa standardisasi, cluster hanya memisahkan kaya vs miskin.", correct: true },
            { text: "Langsung clustering, k-means robust", why: "K-means memakai jarak euclidean mentah — sangat tidak robust terhadap skala." },
            { text: "Hapus fitur saldo", why: "Membuang informasi; yang benar menyamakan skala, bukan membuang fitur." },
          ],
        },
        {
          q: "Elbow landai, tidak ada siku jelas. Apa yang dilakukan?",
          options: [
            { text: "Cek BIC + diskusi dengan bisnis berapa segmen yang bisa dilayani", why: "Kriteria statistik + kebutuhan aktivasi. BankNusa memilih k=4 karena itu.", correct: true },
            { text: "Ambil k dengan WCSS terkecil", why: "WCSS selalu turun dengan k — itu k = n, tiap titik cluster sendiri." },
            { text: "Pakai k=7 karena silhouette 0,62", why: "Skor bagus tapi tidak terpakai = gagal (pelajaran BankNusa)." },
          ],
        },
        {
          q: "Cluster overlap berat (pelanggan di perbatasan dua segmen). Model yang lebih jujur?",
          options: [
            { text: "GMM — soft assignment mencerminkan ketidakpastian", why: "70/30 lebih informatif dari vonis 100/0 yang semu.", correct: true },
            { text: "K-means dengan k lebih besar", why: "Menambah k tidak menyelesaikan overlap — hanya memotong lebih halus." },
            { text: "Buang data di perbatasan", why: "Membuang data = menyembunyikan ketidakpastian, bukan mengelolanya." },
          ],
        },
      ],
    },
    {
      id: "adv-stabilitas",
      eyebrow: "Langkah 7 · Stabilitas",
      title: "Uji Alive secara kuantitatif: segmen yang bergeser tiap bulan = artefak",
      prose: [
        "Uji 3A menyebut 'Alive' — segmen harus stabil dari waktu ke waktu. Cara mengukurnya: cluster-kan data Januari dan Februari secara terpisah, lalu hitung overlap penugasan untuk user yang sama. Overlap Jaccard = irisan / gabungan. BankNusa: 4 segmen bisnisnya overlap 0,83 antar-bulan (stabil); 7 cluster 'silhouette 0,62' overlap hanya 0,41 — cluster cantik yang lahir-mati tiap bulan.",
        "Aturan praktis: overlap < 0,6 = segmen tidak bisa jadi basis strategi (target kampanye berganti tiap bulan, tim bingung). 0,6–0,8 = waspada, selidiki segmen mana yang bergeser. Di atas 0,8 = segmen hidup dan bisa dipakai untuk perencanaan kuartal.",
        "Sumber ketidakstabilan yang umum: fitur musiman yang ikut di-cluster (segmen 'pemburu THR' hilang di Agustus), k terlalu besar (cluster kecil = noise), dan tidak me-re-run dengan seed yang sama. Stabilitas adalah validasi yang tidak bisa ditipu skor.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Overlap Jaccard antar-bulan 0,41 untuk 7 cluster bersilhouette 0,62. Kesimpulan?",
          options: [
            { text: "Cluster tidak stabil — tidak bisa jadi basis strategi meski skornya bagus", why: "Alive gagal: target kampanye berganti tiap bulan. Skor statistik tidak menyelamatkan ini.", correct: true },
            { text: "Tetap pakai — silhouette 0,62 sudah bagus", why: "Skor bagus untuk cluster yang lahir-mati = presisi mengukur artefak." },
            { text: "Naikkan k agar lebih detail", why: "k lebih besar justru memperparah ketidakstabilan (cluster makin kecil)." },
            { text: "Ganti ke GMM", why: "GMM tidak otomatis stabil; masalahnya di fitur/k, bukan algoritma." },
          ],
        },
        {
          q: "Overlap 0,83 antar-bulan untuk 4 segmen. Artinya?",
          options: [
            { text: "Segmen hidup — aman untuk perencanaan kuartal", why: "Di atas 0,8: komposisi segmen konsisten, kampanye bisa dirancang per segmen.", correct: true },
            { text: "Terlalu stabil — pasti ada yang salah", why: "Stabilitas tinggi adalah yang diinginkan, bukan gejala masalah." },
            { text: "Harus 1,0 baru boleh dipakai", why: "1,0 tidak realistis; 0,8+ sudah cukup untuk keputusan bisnis." },
            { text: "Tidak berarti apa-apa", why: "Justru ini uji kuantitatif dari 'Alive' — sangat berarti." },
          ],
        },
      ],
      reference: "Overlap Jaccard antar-periode: <0,6 buang, >0,8 pakai.",
    },
    {
      id: "adv-fitur-aksi",
      eyebrow: "Langkah 8 · Fitur & aksi",
      title: "Pilih fitur dari aksi, bukan dari ketersediaan data",
      prose: [
        "Kesalahan paling mahal di segmentasi bukan memilih k yang salah, melainkan memasukkan fitur yang tidak bisa diaksi. Contoh: memasukkan 'kota domisili' menghasilkan segmen geografis yang rapi — tetapi tim marketing tidak punya budget, pesan, atau channel berbeda per kota. Hasilnya segmen yang benar secara statistik dan tidak berguna secara total.",
        "Protokol yang benar dibalik: tulis dulu daftar aksi yang bisa dieksekusi (diskon, bundling, channel, frekuensi kontak), lalu pilih fitur yang membedakan respons terhadap aksi itu. Fitur perilaku (frekuensi, recency, kategori) hampir selalu lebih actionable daripada fitur demografis — kamu bisa mengubah perilaku dengan insentif, tetapi tidak bisa mengubah umur pelanggan.",
        "Uji cepat sebelum clustering: untuk tiap fitur kandidat, tanya 'jika segmen terbentuk di sekitar fitur ini, aksi apa yang berbeda?' Tidak ada jawaban = fitur dibuang. Segmentasi adalah alat keputusan, bukan alat deskripsi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Fitur 'kota domisili' menghasilkan cluster rapi tetapi tim tidak punya aksi berbeda per kota. Tindakan?",
          options: [
            { text: "Buang fitur itu — cluster tanpa aksi = gagal uji Actionable", why: "Segmentasi dinilai dari aksi yang ia hasilkan; kerapian statistik tanpa aksi = hiasan.", correct: true },
            { text: "Tetap pakai — cluster-nya rapi", why: "Rapi tapi tidak terpakai = pelajaran BankNusa yang terulang." },
            { text: "Buat aksinya nanti", why: "'Nanti' = tidak pernah; aksi harus ada sebelum clustering." },
            { text: "Tambah fitur lagi agar makin rapi", why: "Menambah fitur tidak menyelesaikan tidak-adanya aksi." },
          ],
        },
      ],
      reference: "Fitur dipilih dari aksi yang bisa dieksekusi — bukan dari data yang tersedia.",
    },
    {
      id: "intuisi-nama",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Segmentasi yang tidak bisa dijelaskan ke tim sales dalam 30 detik = gagal",
      prose: [
        "Analis junior mengoptimalkan skor. Analis senior mengoptimalkan pemakaian. Tiga heuristik memisahkan keduanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: cluster yang tidak bisa diberi nama dalam satu kalimat tidak akan pernah dipakai",
        body: "Heuristik pertama: uji nama 30 detik. Setelah clustering selesai, coba jelaskan tiap segmen ke tim sales dalam satu kalimat: 'Keluarga Mapan: belanja bulanan Rp2 juta, sensitif promo bundling.' Kalau kamu butuh lima menit dan tiga grafik untuk menjelaskan satu segmen, segmen itu tidak akan pernah dipakai — dan segmentasi yang tidak dipakai = waktu terbuang. Heuristik kedua: skor statistik adalah syarat perlu, bukan cukup. Silhouette 0,62 yang tidak bisa diaktivasi kalah dari silhouette 0,45 yang menaikkan response 2,1% ke 6,4%. Optimasi untuk skor adalah optimasi untuk metrik yang salah; optimasi untuk pemakaian berarti melibatkan tim bisnis SEBELUM memilih k, bukan setelah. Heuristik ketiga: segmentasi membusuk. Perilaku pelanggan bergeser, fitur musiman muncul-hilang, dan cluster yang stabil Januari bisa jadi artefak di Juli. Jadwalkan re-run kuartalan dengan uji overlap — segmen yang overlap-nya jatuh di bawah 0,6 harus digabung atau dibuang, bukan dipertahankan demi 'konsistensi laporan'. Segmentasi bukan monumen; ia peta yang harus digambar ulang saat wilayahnya berubah.",
      },
      reference: "Nama 30 detik, skor = syarat perlu, re-run kuartalan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: segmentasi yang dipakai tim, bukan yang menang di paper",
      prose: [
        "Skenario satu — memilih jumlah segmen: pakai elbow dan silhouette, lalu uji 3A — apakah segmen bisa dijangkau dan ditindaklanjuti? k=7 dengan skor bagus tetapi tak bisa dieksekusi tim sales adalah gagal.",
        "Skenario dua — memilih fitur clustering: pilih perilaku yang bisa ditindaklanjuti, bukan sekadar demografi. Segmen 'perempuan 25–34' tanpa perbedaan perilaku adalah label, bukan segmen.",
        "Skenario tiga — hasil cluster goyang antar-run: cek standarisasi fitur dan seed. Bila tetap tidak stabil, datanya memang tidak ber-cluster — pakai aturan bisnis sederhana saja.",
        "Skenario empat — personalisasi pesan: terjemahkan cluster menjadi persona 30 detik untuk tim sales. 'Sultan Mapan: 8% basis, respons 12%, CLV Rp4jt' — bila sales tidak paham, segmentasi mati di slide.",
        "Skenario lima — budget kampanye terbatas seperti DanaKu Rp1 miliar: alokasikan proporsional ke expected value (respons × CLV), bukan proporsional ke ukuran segmen.",
        "Aturan praktis 10 detik: bisa dijelaskan ke sales dalam 30 detik? Tiap segmen punya aksi berbeda? Stabil antar-run? Satu jawaban tidak → sederhanakan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengoptimalkan skor cluster lalu berhenti. Silhouette tinggi yang tidak dipakai tim adalah dekorasi. Uji sebenarnya: apakah minggu depan tim sales mengubah perilakunya karena segmen ini?",
      },
      reference: "Fitur yang bisa ditindaklanjuti → k via elbow dan silhouette → uji 3A → persona 30 detik.",
    },
    {
      id: "minicase-danaku",
      eyebrow: "Langkah 11 · Mini-case",
      title: "DanaKu: Rp1 miliar untuk 5 segmen — siapa dapat apa?",
      prose: [
        "DanaKu (fintech lending) punya 5 segmen hasil clustering (lolos uji 3A) dan budget kampanye Rp1 miliar. Datanya: (1) 'Sultan Mapan' — 8% basis, response 12%, CLV Rp4jt; (2) 'Keluarga Rutin' — 32%, response 6%, CLV Rp1,5jt; (3) 'Anak Muda Coba-coba' — 35%, response 3%, CLV Rp400rb; (4) 'Pensiun Hati-hati' — 15%, response 4%, CLV Rp900rb; (5) 'Hantu' (dormant) — 10%, response 0,5%, CLV Rp200rb. Biaya kontak Rp25rb per orang (WA + telemarketing).",
        "Pertanyaan: (1) Hitung expected value per kontak tiap segmen (response × CLV − biaya). (2) Alokasikan Rp1 miliar — segmen mana yang didanai penuh, siapa yang dicoret? (3) Apa risiko alokasi 'merata ke semua segmen'?",
        "Pembahasan: (1) EV/kontak: Sultan = 0,12×4jt − 25rb = Rp455rb; Keluarga = 0,06×1,5jt − 25rb = Rp65rb; Anak Muda = 0,03×400rb − 25rb = −Rp13rb (negatif!); Pensiun = 0,04×900rb − 25rb = Rp11rb; Hantu = 0,005×200rb − 25rb = −Rp24rb. (2) Danai Sultan dan Keluarga sampai jenuh; Pensiun marginal (uji skala kecil); coret Anak Muda dan Hantu dari channel mahal — layani via channel murah (push notif, Rp500/kontak → EV positif Rp11,5rb dan Rp500). (3) Alokasi merata mensubsidi segmen ber-EV negatif dengan uang dari segmen sehat — tepat seperti jebakan rata-rata di MK1.",
      ],
      tasks: [],
      quiz: [
        {
          q: "DanaKu: EV/kontak Anak Muda −Rp13rb via telemarketing Rp25rb. Keputusan?",
          options: [
            { text: "Coret dari channel mahal; layani via push notif Rp500/kontak (EV jadi positif)", why: "EV negatif = setiap kontak membakar Rp13rb. Channel murah mengubah ekonominya: 0,03×400rb − 500 = +Rp11.500.", correct: true },
            { text: "Tetap hubungi — mereka 35% basis", why: "Ukuran besar tidak membenarkan EV negatif; itu 35% pembakar uang." },
            { text: "Naikkan frekuensi kontak agar response naik", why: "Menambah kontak ber-EV negatif = memperbesar kerugian." },
            { text: "Gabung dengan segmen Hantu", why: "Menggabung dua segmen ber-EV negatif tidak menciptakan EV positif." },
          ],
        },
        {
          q: "Pelajaran umum dari alokasi DanaKu?",
          options: [
            { text: "Alokasikan by expected value per kontak, bukan by ukuran segmen", why: "Segmen terbesar (Anak Muda 35%) justru ber-EV negatif di channel mahal. Ukuran ≠ nilai.", correct: true },
            { text: "Selalu prioritaskan segmen terbesar", why: "Kasus ini membuktikan sebaliknya." },
            { text: "Jangan pernah mencoret segmen", why: "Mencoret dari channel yang salah = disiplin ekonomi, bukan diskriminasi." },
            { text: "Response rate saja cukup untuk alokasi", why: "Response tanpa CLV dan biaya = setengah persamaan." },
          ],
        },
      ],
      reference: "Alokasi by EV/kontak = response × CLV − biaya. Coret yang negatif.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Segmentasi yang baik = yang dipakai tim bisnis, bukan yang skornya tertinggi.",
      ],
      tasks: [],
      summary: [
        "Standardisasi wajib sebelum k-means; WCSS = jumlah kuadrat jarak ke centroid.",
        "Pilih k via elbow + silhouette s = (b−a)/max(a,b); k-means++ untuk inisialisasi.",
        "GMM untuk cluster yang tumpang tindih; pilih komponen via BIC.",
        "Deliverable = tabel persona (nama + profil + ukuran + 1 aksi), bukan plot.",
        "Uji 3A: Available, Actionable, Alive. Gagal → gabung atau buang.",
        "Ukur Alive dengan overlap Jaccard antar-periode: di bawah 0,6 = artefak.",
        "Pilih fitur dari aksi yang bisa dieksekusi; alokasikan budget by EV per kontak.",
      ],
      next: { label: "MK5 — CLV", href: "/learn/mk5-clv" },
      quiz: [
        {
          q: "Kenapa standardisasi wajib sebelum k-means?",
          options: [
            { text: "Fitur berskala besar mendominasi jarak euclidean", why: "Saldo jutaan vs umur puluhan — tanpa standardisasi cluster = kaya vs miskin saja.", correct: true },
            { text: "Agar komputasi lebih cepat", why: "Bukan soal kecepatan — soal makna jarak." },
            { text: "Syarat matematis k-means", why: "K-means jalan tanpa standardisasi; hasilnya saja yang menyesatkan." },
          ],
        },
        {
          q: "Silhouette sebuah titik = 0,95. Artinya?",
          options: [
            { text: "Titik sangat cocok di clusternya dan jauh dari cluster lain", why: "s dekat 1 = a kecil, b besar. Cluster rapat dan terpisah.", correct: true },
            { text: "Titik salah cluster", why: "Itu s negatif. 0,95 = sangat benar." },
            { text: "Titik di perbatasan dua cluster", why: "Itu s ≈ 0. 0,95 jauh dari perbatasan." },
          ],
        },
        {
          q: "Satu cluster tidak punya aksi pemasaran yang berbeda. Tindakan?",
          options: [
            { text: "Gabung dengan cluster tetangga atau buang", why: "Gagal uji Actionable. Cluster tanpa aksi = beban presentasi.", correct: true },
            { text: "Tetap tampilkan, sayang sudah dihitung", why: "Sunk cost fallacy — analis dibayar untuk keputusan, bukan jumlah cluster." },
            { text: "Buat aksinya nanti saja", why: "\u201CNanti\u201D = tidak pernah. Segmentasi tanpa aksi = hiasan." },
          ],
        },
        {
          q: "Deliverable akhir proyek segmentasi yang benar?",
          options: [
            { text: "Tabel persona: nama, profil, ukuran, satu aksi per segmen", why: "Ini yang bisa dieksekusi tim bisnis. Response 2,1% → 6,4% datang dari sini.", correct: true },
            { text: "Plot scatter 7 cluster berwarna-warni", why: "Cantik tapi tidak menjawab \u201Cjadi apa yang kulakukan?\u201D." },
            { text: "Nilai silhouette dan WCSS", why: "Itu lampiran validasi, bukan deliverable." },
          ],
        },
        {
          q: "Uji \u201CAlive\u201D dalam 3A memeriksa apa?",
          options: [
            { text: "Segmen stabil dari waktu ke waktu, bukan artefak sesaat", why: "Segmen musiman yang hilang bulan depan tidak bisa jadi basis strategi.", correct: true },
            { text: "Segmen masih bisa dihubungi", why: "Itu \u201CAvailable\u201D." },
            { text: "Segmen merespons kampanye", why: "Itu \u201CActionable\u201D." },
          ],
        },
      ],
    },
  ],
};
