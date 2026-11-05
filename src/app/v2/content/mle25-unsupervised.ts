import type { V2Lesson } from "../lib/types";

// Metode siku: inertia turun tajam sampai k=3, lalu melandai.
const FIG_ELBOW = `<svg viewBox="0 0 480 260" role="img" aria-label="Metode siku: inertia turun tajam sampai k=3 lalu melandai.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="210" x2="460" y2="210"/><line x1="44" y1="171" x2="460" y2="171"/><line x1="44" y1="133" x2="460" y2="133"/><line x1="44" y1="94" x2="460" y2="94"/><line x1="44" y1="55" x2="460" y2="55"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="214">0</text><text x="38" y="175">25</text><text x="38" y="137">50</text><text x="38" y="98">75</text><text x="38" y="59">100</text></g>
<polyline points="44,56 103,125 163,161 222,173 282,179 341,184 401,187 460,189" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<g fill="var(--c1)"><circle cx="44" cy="56" r="4"/><circle cx="103" cy="125" r="4"/><circle cx="163" cy="161" r="4"/><circle cx="222" cy="173" r="4"/><circle cx="282" cy="179" r="4"/><circle cx="341" cy="184" r="4"/><circle cx="401" cy="187" r="4"/><circle cx="460" cy="189" r="4"/></g>
<circle cx="163" cy="161" r="13" fill="none" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5,4"/>
<text x="163" y="140" font-size="12" fill="var(--text)" text-anchor="middle" font-family="var(--font-ui)" font-weight="700">siku: k=3</text>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="44" y="230">1</text><text x="103" y="230">2</text><text x="163" y="230">3</text><text x="222" y="230">4</text><text x="282" y="230">5</text><text x="341" y="230">6</text><text x="401" y="230">7</text><text x="460" y="230">8</text></g>
<text x="252" y="250" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">jumlah cluster k</text>
<text x="14" y="132" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 14 132)">inertia</text>
</svg>`;

export const mle25: V2Lesson = {
  slug: "mle25-unsupervised",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE25 — Unsupervised & Semi-Supervised Learning",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Label yang tak kunjung datang",
      prose: [
        "Bank Arus Dana meluncurkan proyek deteksi fraud kartu kredit. Rencana rapi: kumpulkan 50.000 transaksi berlabel (fraud / bukan), latih classifier, deploy. Masalahnya: label fraud hanya muncul setelah investigasi manual — dan antrean investigasi menumpuk 6 bulan. Proyek macet di bulan pertama: “tunggu label dulu”.",
        "Seorang analis menolak menunggu. Ia tidak punya satu label pun — tetapi ia punya 2 juta transaksi tak berlabel. Dalam 2 hari ia menjalankan isolation forest untuk menandai transaksi paling aneh + k-means untuk memetakan pola perilaku nasabah. Antrean review yang dihasilkannya menemukan 340 kasus fraud senilai Rp1,6 miliar dalam sebulan.",
        "Twist-nya: enam bulan kemudian label resmi akhirnya tiba — dan 87% temuan analis itu terkonfirmasi benar. Model terbaik kuartal itu tidak pernah melihat satu label pun selama training. Pelajaran lesson ini: label adalah vonis, bukan izin untuk mulai. Unsupervised learning memberi peta wilayah; label hanya memberi stempel “di sinilah hartanya”.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) mengimplementasikan k-means dari nol dan membaca inertia; (2) memilih k-means vs DBSCAN vs hierarchical dari bentuk data; (3) menjelaskan PCA lewat eigen dan memilih jumlah komponen; (4) menilai clustering tanpa label via silhouette, stabilitas, dan validasi domain; (5) merancang self-training yang aman dari confirmation bias.",
        "🗺️ Peta lesson: Langkah 1 · Cerita — Langkah 2 · K-means — Langkah 3 · DBSCAN & hierarki — Langkah 4 · PCA & visualisasi — Langkah 5 · Deteksi anomali — Langkah 6 · Lab k-means — Langkah 7 · Evaluasi tanpa label — Langkah 8 · Semi-supervised — Langkah 9 · Peta keputusan — Langkah 10 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Tanpa label bukan tanpa arah: cluster, anomali, dan struktur data adalah peta sebelum vonis.",
    },
    {
      id: "kmeans",
      eyebrow: "Langkah 2 · K-means",
      title: "K-means: si panitia pembagian kelompok yang kaku",
      prose: [
        "K-means adalah “si panitia”: kamu tentukan dulu jumlah kelompok k, ia membagi semua titik ke k gugus. Algoritmanya (Lloyd): (1) taruh k centroid sembarang; (2) tugaskan tiap titik ke centroid terdekat; (3) geser tiap centroid ke rata-rata anggotanya; (4) ulangi 2–3 sampai tidak ada titik pindah kelompok. Sederhana, cepat, dan bekerja untuk gugus berbentuk bulat dengan ukuran mirip.",
        "Inertia (WCSS — within-cluster sum of squares) = meteran kerapatan k-means: jumlah kuadrat jarak tiap titik ke centroid-nya. Makin kecil = gugus makin rapat. Tetapi inertia SELALU turun saat k naik (k = n memberi inertia 0 — tiap titik jadi cluster sendiri!). Jadi jangan pernah memilih k dari inertia minimum; pilih dari SIKU kurva.",
        "Cara membaca: sumbu X = jumlah cluster k (1–8); sumbu Y = inertia — total kuadrat jarak titik ke centroid-nya (makin kecil = gugus makin rapat). Interpretasi: penurunan tajam dari k=1 ke k=3, lalu melandai — cluster ke-4 dan seterusnya hanya memecah gugus yang sudah rapat. k=3 = titik impas antara kesederhanaan dan kerapatan.",
        "Tiga kelemahan yang harus dihafal: (1) k harus ditentukan di muka — salah tebak k, salah semua; (2) asumsi gugus BULAT — dua bulan sabit yang saling mengait akan dipotong secara brutal menjadi dua belahan yang salah; (3) sensitif inisialisasi — centroid awal yang buruk = terjebak local minima. Obat standar: k-means++ (inisialisasi menyebar) + jalankan 10 kali, pilih inertia terkecil.",
        "Kepribadian k-means: panitia yang efisien tetapi kaku — cepat membagi, tetapi kelompoknya harus bulat dan jumlahnya harus kamu tentukan. Untuk data berisik dengan banyak outlier, panitia ini kewalahan — di situlah DBSCAN masuk.",
      ],
      formula: String.raw`J = \sum_{i=1}^{n} \|x_i - \mu_{c(i)}\|^2`,
      formulaNote: "J = inertia; x_i = titik data ke-i; μ = centroid (titik tengah cluster); c(i) = nomor cluster tempat titik i ditugaskan; ||·||² = kuadrat jarak Euclidean. Contoh lab: 16 titik, 3 centroid → J = 1,434. Bandingkan J hanya untuk k yang SAMA — J selalu turun saat k naik.",
      figure: {
        svg: FIG_ELBOW,
        alt: "Metode siku: inertia turun tajam sampai k=3 lalu melandai.",
        caption: "Metode siku (elbow): pilih k di titik penurunan melandai.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Elbow selalu jelas dan k dari elbow = k yang benar.” Salah dua kali. Elbow sering ambigu (kurva landai mulus tanpa siku), dan siku hanyalah heuristik — ia tidak tahu apa-apa tentang bisnismu. Praktik senior: elbow memberi 2–3 kandidat k, lalu putuskan dengan silhouette + stabilitas + pertanyaan “apakah cluster-nya bermakna untuk domain ini?”.",
      },
      reference: "K-means = cepat untuk gugus bulat; inertia hanya untuk k sama; k dari siku + validasi, bukan dari siku saja.",
    },
    {
      id: "clustering-density",
      eyebrow: "Langkah 3 · DBSCAN & hierarki",
      title: "DBSCAN: si penjaga kerumunan",
      prose: [
        "DBSCAN tidak meminta k. Ia bertanya: “di mana kerumunannya?” Dua parameter: eps (radius tetangga) dan minPts (minimal penghuni). Titik dengan ≥ minPts tetangga dalam radius eps = core point (inti kerumunan); titik dalam jangkauan core tetapi sepi = border; yang lain = NOISE. Hasilnya: gugus bentuk bebas (bulan sabit? bisa!) + outlier yang ditandai eksplisit, bukan dipaksa masuk kelompok.",
        "Kekuatan DBSCAN: menemukan gugus bentuk aneh, tidak butuh k, dan jujur menandai noise — untuk fraud, noise-nya justru yang dicari. Kelemahan: buta terhadap DENSITAS BERVARIASI — satu eps tidak bisa melayani kerumunan padat dan renggang sekaligus; dan memilih eps adalah seni (praktik: plot k-distance — urutkan jarak ke tetangga ke-k, cari “lutut” kurvanya).",
        "Hierarchical clustering (agglomerative): mulai dari tiap titik sebagai cluster sendiri, gabungkan dua yang terdekat, ulangi sampai satu. Hasilnya dendrogram — pohon yang bisa “dipotong” di ketinggian mana pun untuk mendapat k berapa pun, TANPA menjalankan ulang. Kelebihan: tidak perlu k di muka + visual yang bisa dijelaskan ke non-teknis. Kelemahan: O(n²)–O(n³) — untuk 2 juta nasabah, lupakan.",
        "Kapan pakai apa: gugus bulat + besar + cepat → k-means. Bentuk aneh / banyak noise / tidak tahu k → DBSCAN. Butuh hierarki (“segmen besar berisi sub-segmen”) atau data < 10 ribu + ingin dendrogram → hierarchical. Aturan jempol: tidak ada algoritma clustering “terbaik” — hanya yang asumsi bentuknya cocok dengan datamu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "DBSCAN mengklasifikasikan DENSITAS, bukan jarak ke pusat. Itu sebabnya ia bisa mengikuti bentuk bulan sabit: ia tidak peduli “pusatnya di mana”, hanya “apakah bertetangga cukup ramai”. Kalau datamu punya wilayah padat DAN renggang, pertimbangkan HDBSCAN (varian yang menangani multi-densitas) — tetapi pahami dulu DBSCAN-nya.",
      },
      reference: "DBSCAN = kerumunan + noise eksplisit (eps/minPts); hierarki = dendrogram yang bisa dipotong (mahal, untuk data kecil).",
    },
    {
      id: "reduksi-dimensi",
      eyebrow: "Langkah 4 · PCA & visualisasi",
      title: "PCA: si pemutar sumbu",
      prose: [
        "300 fitur sensor → model lambat, visualisasi mustahil. PCA bertanya: “ke arah mana data paling menyebar?” Ia memutar sumbu koordinat ke arah varians terbesar — sumbu baru (komponen utama) adalah eigenvector dari matriks kovarians, dan eigenvalue-nya = besar varians sepanjang sumbu itu. Komponen 1 menangkap pola terbesar, komponen 2 (tegak lurus) menangkap sisa terbesar, dan seterusnya.",
        "Berapa komponen cukup? Lihat varians kumulatif: jumlah eigenvalue p komponen pertama dibagi total. Praktik: ambil p terkecil dengan varians kumulatif ≥ 90–95%, atau cari siku pada scree plot. Contoh: 300 fitur → 12 komponen mencakup 93% varians → training 8× lebih cepat dengan akurasi turun 0,3 poin. PCA juga berguna untuk denoising: komponen kecil sering kali hanya noise.",
        "t-SNE dan UMAP: “si kartografer”. Untuk MEMVISUALISASIKAN data berdimensi tinggi dalam 2D — menjaga tetangga dekat tetap dekat. UMAP lebih cepat dan menjaga struktur global lebih baik daripada t-SNE. Keduanya stokastik (hasil beda tiap run) dan punya parameter (perplexity / n_neighbors) yang mengubah gambar.",
        "Kepribadian kartografer: petanya indah, tetapi ia melebih-lebihkan. Jarak ANTAR gugus di peta t-SNE/UMAP tidak bisa dibaca harfiah — dua gugus yang terlihat jauh bisa jadi dekat di ruang asli, dan ukuran gugus tidak berarti apa-apa. Baca hanya kedekatan lokal (“titik-titik ini memang mirip”), jangan buat keputusan dari jarak antar-pulau.",
      ],
      formula: String.raw`\Sigma v = \lambda v`,
      formulaNote: "Σ (sigma besar) = matriks kovarians data — menangkap bagaimana fitur-fitur bervariasi bersama; v = eigenvector = arah komponen utama (sumbu baru); λ (lambda) = eigenvalue = besar varians sepanjang arah v. Komponen dengan λ terbesar = arah data paling menyebar = komponen 1.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Peta UMAP menunjukkan dua segmen nasabah yang jauh berbeda — strateginya harus beda total.” Belum tentu. UMAP/t-SNE MENDISTORSI jarak global; “jauh” di peta bisa berarti “agak beda” di data asli. Jangan tetapkan strategi bisnis dari jarak antar-pulau di peta 2D. Verifikasi di ruang fitur asli: apakah rata-rata fitur kedua gugus memang berbeda signifikan?",
      },
      reference: "PCA = putar ke arah varians terbesar (eigen); ambil komponen sampai 90–95% varians. UMAP/t-SNE hanya untuk melihat, bukan untuk mengukur.",
    },
    {
      id: "anomaly",
      eyebrow: "Langkah 5 · Deteksi anomali",
      title: "Deteksi anomali: tiga cara menemukan yang beda",
      prose: [
        "Cara 1 — statistik klasik: z-score. z = (x − mean) / std; |z| > 3 = anomali (di luar 99,7% data normal). Murah, transparan, bisa dijelaskan ke siapa pun. Batasnya: univariat — fraud canggih tidak aneh di satu fitur, ia aneh di KOMBINASI fitur. Untuk multivariat ada Mahalanobis distance, tetapi ia asumsi data berdistribusi normal elips.",
        "Cara 2 — reconstruction error: latih PCA/autoencoder HANYA pada data normal, lalu ukur seberapa buruk ia merekonstruksi tiap titik baru. Titik normal → rekonstruksi bagus (error kecil); anomali → model “tidak mengenal” polanya → error besar. Ambang: mis. persentil 99 error di data normal. Elegan karena bekerja di dimensi tinggi tanpa label.",
        "Cara 3 — isolation forest: “si pencari beda”. Alih-alih memodelkan normalitas, ia MENGISOLASI titik: pilih fitur acak + titik potong acak, belah data berulang. Anomali — yang jauh dari kerumunan — terisolasi dalam SEDIKIT belahan; titik normal butuh banyak belahan. Skor anomali dari rata-rata panjang path: makin pendek = makin aneh. Cepat, menangani dimensi tinggi, nyaris tanpa tuning.",
        "Ketiganya menjawab pertanyaan berbeda: z-score = “apakah nilai ini ekstrem sendirian?”; reconstruction = “apakah pola ini asing bagi model normalitas?”; isolation forest = “seberapa cepat titik ini terpisah dari kerumunan?”. Untuk fraud kartu kredit: isolation forest sebagai penyaring pertama (cepat, 2 juta transaksi), reconstruction untuk pola multivariat halus, z-score untuk aturan bisnis yang harus bisa dijelaskan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Anomali ≠ fraud, dan itu justru gunanya. Detektor unsupervised menghasilkan ANTREAN yang diprioritaskan untuk manusia — bukan vonis otomatis. Nilai bisnisnya = mengurutkan 2 juta transaksi menjadi 500 yang paling layak diperiksa. Blokir otomatis dari skor anomali mentah = memblokir nasabah sah yang “unik” (wisatawan, pebisnis musiman).",
      },
      reference: "z-score untuk ekstrem univariat; reconstruction error untuk pola asing; isolation forest untuk penyaring cepat berdimensi tinggi.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: k-means dari nol (stdlib murni)",
      prose: [
        "16 titik 2D tertanam membentuk 3 gugus alami: enam di dekat (0,0), lima di dekat (5,5), lima di dekat (10,0). Tugasmu: implementasikan jarak kuadrat + loop Lloyd — tugaskan tiap titik ke centroid terdekat, hitung ulang centroid sebagai rata-rata, ulangi sampai penugasan tidak berubah. Inisialisasi centroid TETAP (bukan acak) supaya hasilnya deterministik.",
        "Cara membaca: iterasi = berapa kali loop sampai penugasan stabil; penugasan = nomor cluster tiap titik (urutan sesuai data); centroid = titik tengah akhir tiap cluster; inertia = total kuadrat jarak (makin kecil = gugus makin rapat). Interpretasi: iterasi=2 → konvergen cepat karena gugus terpisah jelas; inertia=1,434 kecil relatif terhadap rentang data 0–10 → gugus rapat dan assignment benar.",
        "Coba: ubah centroid awal menjadi [(8.0, 8.0), (9.0, 9.0), (10.0, 10.0)] lalu jalankan ulang — ke mana cluster lari? (Jawaban: tetap ke tiga gugus yang sama, tetapi butuh iterasi lebih banyak. Inisialisasi buruk = lambat; pada data yang kurang terpisah, inisialisasi buruk = hasil akhir yang SALAH — local minima. Itulah alasan k-means++ dan multiple restarts.)",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `jarak2(p, q)` — kuadrat jarak Euclidean dua titik 2D" },
        { id: "t2", text: "Implementasikan loop Lloyd: tugaskan tiap titik ke centroid terdekat, hitung ulang centroid, ulangi sampai stabil (maks 20 iterasi); simpan jumlah iterasi di `n_iter`" },
      ],
      expected: "iterasi = 2  penugasan = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]  inertia = 1.434",
      note: {
        title: "💡 Intuisi",
        body: "Tanpa akar kuadrat pun urutan “terdekat” tidak berubah — dan komputasi lebih cepat. Trik kecil seperti ini (monotonic transform) dipakai di mana-mana: yang penting urutannya, bukan nilainya. K-means tidak pernah butuh jarak sebenarnya, hanya perbandingan.",
      },
      hints: [
        "jarak2: (p[0]-q[0])**2 + (p[1]-q[1])**2 — tanpa akar, urutan terdekat tetap sama",
        "penugasan satu titik: min(range(3), key=lambda k: jarak2(p, centroid[k]))",
        "centroid baru cluster k = rata-rata x dan rata-rata y semua titik yang ditugaskan ke k",
      ],
      code: {
        starter: `# DATA TERTANAM — jangan ubah
data = [
    (0.2, 0.3), (0.5, 0.1), (0.4, 0.6), (0.1, 0.5), (0.6, 0.4), (0.3, 0.2),
    (5.2, 5.1), (5.0, 5.6), (5.5, 5.3), (4.9, 5.2), (5.4, 4.9),
    (9.8, 0.4), (10.2, 0.6), (9.9, 0.1), (10.4, 0.5), (9.6, 0.3),
]

# TULIS KODEMU
def jarak2(p, q):
    # TODO t1: kuadrat jarak Euclidean dua titik 2D
    return 0.0

centroid = [(0.0, 0.0), (5.0, 5.0), (10.0, 0.0)]  # inisialisasi tetap
penugasan = []
n_iter = 0
# TODO t2: loop Lloyd — tugaskan tiap titik ke centroid terdekat,
# hitung ulang tiap centroid sebagai rata-rata anggotanya,
# ulangi sampai penugasan tidak berubah (maks 20 iterasi)

# UJI (jangan ubah)
inertia = sum(jarak2(data[i], centroid[penugasan[i]]) for i in range(len(data)))
print("iterasi =", n_iter)
print("penugasan =", penugasan)
print("centroid =", [(round(x, 3), round(y, 3)) for x, y in centroid])
print("inertia =", round(inertia, 4))`,
        lockLines: 7,
        solution: `# DATA TERTANAM — jangan ubah
data = [
    (0.2, 0.3), (0.5, 0.1), (0.4, 0.6), (0.1, 0.5), (0.6, 0.4), (0.3, 0.2),
    (5.2, 5.1), (5.0, 5.6), (5.5, 5.3), (4.9, 5.2), (5.4, 4.9),
    (9.8, 0.4), (10.2, 0.6), (9.9, 0.1), (10.4, 0.5), (9.6, 0.3),
]

# TULIS KODEMU
def jarak2(p, q):
    return (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2

centroid = [(0.0, 0.0), (5.0, 5.0), (10.0, 0.0)]  # inisialisasi tetap
penugasan = [None] * len(data)
n_iter = 0
for i in range(20):
    baru = [min(range(3), key=lambda k: jarak2(p, centroid[k])) for p in data]
    n_iter = i + 1
    if baru == penugasan:
        break
    penugasan = baru
    for k in range(3):
        anggota = [data[j] for j in range(len(data)) if penugasan[j] == k]
        centroid[k] = (sum(p[0] for p in anggota) / len(anggota),
                       sum(p[1] for p in anggota) / len(anggota))

# UJI (jangan ubah)
inertia = sum(jarak2(data[i], centroid[penugasan[i]]) for i in range(len(data)))
print("iterasi =", n_iter)
print("penugasan =", penugasan)
print("centroid =", [(round(x, 3), round(y, 3)) for x, y in centroid])
print("inertia =", round(inertia, 4))`,
        checks: [
          { kind: "defined", task: "t1", name: "jarak2", label: "Fungsi jarak2 terdefinisi", msg: "Definisikan def jarak2(p, q) yang mengembalikan kuadrat jarak Euclidean." },
          { kind: "defined", task: "t2", name: "penugasan", label: "penugasan terdefinisi", msg: "penugasan harus berupa list 16 angka (cluster tiap titik)." },
          { kind: "defined", task: "t2", name: "n_iter", label: "n_iter terdefinisi", msg: "Simpan jumlah iterasi loop dalam variabel n_iter." },
          { kind: "equal", task: "t2", name: "n_iter", value: 2, label: "Konvergen dalam 2 iterasi", msg: "Dengan data dan inisialisasi ini, penugasan stabil setelah 2 iterasi (iterasi ke-2 tidak mengubah apa pun)." },
          { kind: "stdout_matches", task: "t2", pattern: "penugasan = \\[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2\\]", label: "Penugasan tepat 3 gugus", msg: "6 titik pertama → cluster 0, 5 berikutnya → 1, 5 terakhir → 2." },
          { kind: "stdout_matches", task: "t2", pattern: "inertia = 1\\.434", label: "Inertia = 1.434", msg: "Total kuadrat jarak ke centroid masing-masing = 1,434." },
        ],
      },
      reference: "Lloyd = tugaskan → rata-ratakan → ulangi. Tanpa akar pun urutan terdekat sama.",
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 7 · Evaluasi tanpa label",
      title: "Menilai tanpa kunci jawaban: silhouette & co.",
      prose: [
        "Tidak ada label = tidak ada akurasi. Tetapi clustering tetap bisa dinilai. Metrik utama: silhouette. Untuk tiap titik i: a(i) = rata-rata jarak ke semua anggota cluster-nya sendiri (kekompakan); b(i) = rata-rata jarak ke anggota cluster tetangga TERDEKAT (keterpisahan). Silhouette s(i) = (b−a)/max(a,b): mendekati 1 = titik betah di clusternya; mendekati 0 = titik di perbatasan; negatif = titik lebih dekat ke cluster lain (salah tempat!). Rata-rata silhouette seluruh data = skor clustering.",
        "Batasan silhouette — “si juri yang pilih kasih”: ia mengasumsikan cluster yang BAGUS itu bulat dan padat. Clustering DBSCAN berbentuk bulan sabit bisa mendapat silhouette rendah padahal benar secara domain. Jangan jadikan silhouette satu-satunya hakim; ia wasit yang baik untuk k-means, wasit yang buruk untuk bentuk aneh.",
        "Uji kedua: stabilitas. Ambil 80% data secara acak, cluster ulang, bandingkan hasilnya dengan clustering data penuh (adjusted Rand index). Cluster yang “nyata” bertahan di berbagai subsample; cluster yang rapuh berubah-ubah. Praktik: silhouette memilih di antara 2–3 kandidat k, stabilitas mengkonfirmasi pilihannya.",
        "Uji ketiga dan terpenting: validasi domain. Tampilkan profil tiap cluster (rata-rata fitur) ke orang bisnis: “Cluster 2: transaksi malam hari, nominal kecil, 3× lebih sering gagal.” Jika mereka mengangguk (“oh, itu pola penarikan tunai pekerja shift”), clustering-mu bermakna. Jika tidak ada yang mengenali pola apa pun, skor setinggi apa pun tidak menyelamatkanmu.",
      ],
      formula: String.raw`s(i) = \frac{b(i) - a(i)}{\max(a(i),\, b(i))}`,
      formulaNote: "s(i) = silhouette titik i, rentang −1 sampai 1; a(i) = rata-rata jarak titik i ke semua anggota cluster-nya sendiri (makin kecil = makin kompak); b(i) = rata-rata jarak titik i ke semua anggota cluster tetangga TERDEKAT (makin besar = makin terpisah). Contoh: a=0,3, b=1,2 → s = 0,75 (titik betah).",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Silhouette 0,82 berarti clustering saya benar.” Berarti clustering-mu BULAT dan TERPISAH — belum tentu BENAR. Silhouette tidak tahu apa-apa tentang fraud, nasabah, atau bisnismu. Cluster “sempurna” secara geometris bisa jadi artefak preprocessing (mis. lupa standardisasi sehingga satu fitur mendominasi jarak). Selalu tutup dengan validasi domain.",
      },
      reference: "Silhouette = (b−a)/max(a,b); stabilitas via subsample; vonis akhir = validasi domain.",
    },
    {
      id: "semi-supervised",
      eyebrow: "Langkah 8 · Semi-supervised",
      title: "Self-training: murid yang mengoreksi PR-nya sendiri",
      prose: [
        "Skenarionya nyata: labeling Rp50.000 per sampel. 200 sampel berlabel = Rp10 juta (masuk akal). 1 juta sampel berlabel = Rp50 miliar (mustahil). Tetapi 1 juta sampel TAK berlabel sudah ada, gratis, di data warehouse. Semi-supervised: pakai keduanya.",
        "Self-training (pseudo-labeling) — algoritmanya: (1) latih model pada 200 label; (2) prediksi 1 juta tak berlabel; (3) ambil prediksi dengan confidence ≥ 0,95 sebagai “pseudo-label”; (4) latih ulang pada 200 + pseudo-label; (5) ulangi. Contoh: akurasi 0,71 → 0,78 di set validasi berlabel yang terkunci. Kapan ini menang? Ketika data tak berlabel mengungkap STRUKTUR (manifold/cluster) yang 200 label saja tidak bisa lihat — asumsi cluster: titik-titik se-cluster cenderung sekelas.",
        "Bahayanya: confirmation bias — “murid sombong”. Model yang 95% yakin tetapi SALAH akan melatih dirinya sendiri dengan kesalahan itu, makin yakin, makin salah. Terutama di dekat decision boundary dan pada model yang miscalibrated (confidence ≠ akurasi). Tiga pengaman: (1) threshold TINGGI (0,95, bukan 0,51); (2) kalibrasi confidence dulu (temperature scaling); (3) set validasi berlabel yang TIDAK PERNAH disentuh pseudo-label — begitu akurasinya turun, hentikan.",
        "Varian modern: consistency regularization (FixMatch) — model harus memberi prediksi sama untuk dua augmentasi berbeda dari gambar yang sama; yang konsisten dan yakin menjadi pseudo-label. Intinya sama: manfaatkan struktur data tak berlabel, tetapi jangan percaya diri sendiri tanpa pengaman.",
      ],
      tasks: [],
      note: {
        title: "⚠️ Jebakan",
        type: "pitfall",
        body: "Menambahkan SEMUA prediksi sebagai pseudo-label (threshold 0,5). Itu bukan self-training — itu menggandakan noise. Pseudo-label hanyalah label ASLI yang ditulis tangan oleh model yang belum pintar; perlakukan dengan curiga. Aturan: sedikit pseudo-label berkualitas > banyak pseudo-label meragukan. Dan tidak ada yang mengalahkan 50 label asli tambahan bila budget memungkinkan.",
      },
      reference: "Self-training = latih → prediksi yakin → latih ulang. Pengaman: threshold tinggi + kalibrasi + validasi terkunci.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: tanpa label, mulai dari mana?",
      prose: [
        "Skenario 1 — 2 juta nasabah tanpa label, CRM minta 5 segmen → k-means (elbow untuk k) + profilkan tiap cluster dengan rata-rata fitur. Output = 5 persona untuk kampanye. Jangan lupa standardisasi dulu!",
        "Skenario 2 — transaksi kartu, 0,1% fraud, pola tak dikenal → isolation forest sebagai penyaring → skor anomali → antrean review manusia. Noise/cluster kecil dari DBSCAN sebagai sinyal kedua.",
        "Skenario 3 — 300 fitur sensor, model lambat, akurasi stagnan → PCA sampai 90–95% varians kumulatif; latensi turun, noise berkurang. Cek: akurasi tidak turun > 1 poin.",
        "Skenario 4 — direksi minta “gambaran struktur nasabah” → UMAP 2D untuk presentasi, dengan disclaimer: baca kedekatan lokal saja, jangan ukur jarak antar-pulau. Keputusan bisnis tetap dari angka di ruang asli.",
        "Skenario 5 — 200 label + 1 juta tak berlabel, budget labeling habis → self-training threshold 0,95 + validasi berlabel terkunci. Berhenti saat validasi turun.",
        "Skenario 6 — regulator: “jelaskan kenapa nasabah ini ditolak” → JANGAN pakai hasil clustering sebagai dasar keputusan penolakan. Clustering untuk eksplorasi dan triase; keputusan individual butuh model supervised yang bisa dijelaskan (atau aturan bisnis eksplisit).",
        "Aturan praktis 10 detik: (1) ada label cukup? → supervised dulu, jangan memaksa unsupervised. (2) butuh kelompok? → k-means bila bulat, DBSCAN bila bentuk aneh/berisik. (3) butuh gambar? → UMAP. (4) label sedikit? → self-training berpengaman. (5) menilai tanpa label? → silhouette + stabilitas + validasi domain.",
      ],
      tasks: [],
    },
    {
      id: "minicase-nusa-dana",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: 2 juta nasabah, 12 analis, 0 label",
      prose: [
        "Bank Nusa Dana: 2 juta nasabah, 40 fitur perilaku transaksi, tim fraud 12 analis. Label fraud historis tidak ada — investigasi backlog 6 bulan. Kapasitas review: 12 analis × 40 kasus/hari = 480 kasus/hari. Rancangan unsupervised: (1) isolation forest pada fitur transaksi → skor anomali; (2) k-means k=6 pada fitur perilaku → 6 segmen; (3) prioritas = skor anomali tinggi + anggota segmen kecil/aneh.",
        "Hitungan kapasitas: flag top 1% = 20.000 kasus → 20.000 / 480 ≈ 42 hari kerja. Terlalu lama — sinyal tenggelam. Saring ke top 0,12% = 2.400 kasus → 5 hari kerja. Hasil review 5 hari: 18% terkonfirmasi fraud = 432 kasus × rata-rata Rp4,8 juta = Rp2,07 miliar diselamatkan per batch. Tanpa unsupervised, 432 kasus ini menunggu 6 bulan dalam gelap.",
        "Bonus segmentasi: k-means menemukan segmen “dormant tiba-tiba aktif” — 38.000 nasabah dengan tingkat fraud 6× rata-rata bank. Temuan ini menjadi ATURAN BISNIS baru (verifikasi berlapis untuk pola tersebut), nilainya melampaui batch review itu sendiri. Inilah pola khas unsupervised di produksi: triase + penemuan pola, bukan vonis.",
        "Pembahasan: perhatikan tiga keputusan di sini — (1) ambang flag DITURUNKAN dari 1% ke 0,12% agar muat kapasitas manusia (model melayani operasional, bukan sebaliknya); (2) 18% precision DITERIMA karena alternatifnya 0% (tidak ada sistem); (3) segmen aneh tidak langsung diblokir — diverifikasi dulu (anomali ≠ fraud). Unsupervised yang baik selalu dirancang bersama kapasitas manusianya.",
        "Cara membaca: setiap angka di atas adalah KEPUTUSAN, bukan fakta alam — 0,12% dipilih dari 480/hari; 18% diukur dari review, bukan diasumsikan. Interpretasi: nilai unsupervised = (kasus ditemukan × nilai rata-rata) − biaya review; selama positif besar, sistem layak jalan sambil menunggu label.",
      ],
      tasks: [],
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
        "K-means: cepat untuk gugus bulat; inertia hanya dibandingkan pada k sama; k dari siku + validasi.",
        "DBSCAN: gugus bentuk bebas + noise eksplisit via eps/minPts; buta pada densitas bervariasi.",
        "PCA: putar sumbu ke arah varians terbesar (Σv = λv); ambil komponen hingga 90–95% varians.",
        "t-SNE/UMAP: hanya untuk visualisasi; jangan baca jarak antar-gugus sebagai kebenaran.",
        "Anomali: z-score (univariat), reconstruction error (pola asing), isolation forest (penyaring cepat).",
        "Evaluasi tanpa label: silhouette + stabilitas subsample + validasi domain (vonis akhir).",
        "Self-training: pseudo-label confidence tinggi + kalibrasi + validasi terkunci; waspadai confirmation bias.",
      ],
      next: { label: "MLE26 — Fine-Tuning LLM: LoRA, QLoRA, dan DPO", href: "/learn/mle26-fine-tuning-llm" },
      quiz: [
        {
          q: "Data dua bulan sabit yang saling mengait. K-means k=2 memberi hasil buruk. Langkah paling tepat?",
          options: [
            { text: "DBSCAN — ia mengikuti densitas, bukan bentuk bulat", why: "Tepat: DBSCAN menemukan gugus bentuk bebas; k-means memotong brutal bentuk non-bulat.", correct: true },
            { text: "Naikkan k menjadi 20", why: "Memecah bulan sabit menjadi 20 potongan tidak memperbaiki bentuknya.", correct: false },
            { text: "PCA dulu lalu k-means", why: "PCA memutar sumbu, tidak mengubah topologi bulan sabit.", correct: false },
            { text: "t-SNE lalu baca cluster dari gambarnya", why: "Visualisasi bukan clustering; jarak di peta t-SNE tidak bisa dijadikan dasar assignment.", correct: false },
          ],
        },
        {
          q: "Inertia selalu turun saat k naik. Maka memilih k dengan inertia minimum adalah…",
          options: [
            { text: "Salah — akan memilih k = n (tiap titik jadi cluster sendiri); gunakan siku/silhouette", why: "Tepat: inertia minimum trivial = overfit sempurna tanpa makna.", correct: true },
            { text: "Benar — makin kecil inertia makin baik", why: "Tanpa penalti kompleksitas, “makin kecil” selalu menang secara trivial.", correct: false },
            { text: "Benar bila data distandardisasi dulu", why: "Standardisasi memperbaiki skala, bukan masalah trivialitas k = n.", correct: false },
            { text: "Salah — harus memilih k dengan inertia maksimum", why: "Terbalik: inertia maksimum = satu cluster untuk semua = tidak informatif.", correct: false },
          ],
        },
        {
          q: "DBSCAN (eps=0,5, minPts=5): titik P punya 2 tetangga dalam eps, tetapi berada dalam eps dari sebuah core point. Status P?",
          options: [
            { text: "Border point — anggota cluster, bukan inti", why: "Tepat: < minPts tetapi reachable dari core = border.", correct: true },
            { text: "Core point", why: "Core butuh ≥ minPts tetangga; P hanya punya 2.", correct: false },
            { text: "Noise", why: "Noise = tidak reachable dari core point mana pun; P reachable.", correct: false },
            { text: "Tidak bisa ditentukan", why: "Bisa: definisi core/border/noise persis untuk kasus ini.", correct: false },
          ],
        },
        {
          q: "Sebuah titik mendapat silhouette −0,4. Artinya?",
          options: [
            { text: "Kemungkinan salah cluster — lebih dekat ke cluster tetangga daripada clusternya sendiri", why: "Tepat: s negatif = b < a, titik betah di tetangga.", correct: true },
            { text: "Titik sangat representatif untuk clusternya", why: "Terbalik: itu silhouette mendekati +1.", correct: false },
            { text: "Titik tepat di perbatasan dua cluster", why: "Perbatasan = silhouette mendekati 0, bukan −0,4.", correct: false },
            { text: "Data kurang untuk menilai", why: "Silhouette −0,4 adalah sinyal kuat, bukan sinyal kurang data.", correct: false },
          ],
        },
        {
          q: "Self-training dengan threshold 0,51 pada model yang miscalibrated. Risiko utama?",
          options: [
            { text: "Confirmation bias — model melatih dirinya dengan kesalahannya sendiri", why: "Tepat: threshold rendah + confidence tak terkalibrasi = pseudo-label sampah yang memperkuat diri.", correct: true },
            { text: "Training menjadi terlalu lambat", why: "Kecepatan bukan masalah utama; validitas labelnya yang runtuh.", correct: false },
            { text: "Model menjadi underfit", why: "Risikonya overfit pada kesalahan sendiri, bukan underfit.", correct: false },
            { text: "Tidak ada risiko — data tambahan selalu membantu", why: "Data tambahan yang salah label justru merusak.", correct: false },
          ],
        },
        {
          q: "PCA pada 300 fitur: 12 komponen pertama mencakup 93% varians. Keputusan yang waras?",
          options: [
            { text: "Pakai 12 komponen bila akurasi turun < 1 poin — 8× lebih cepat dengan biaya kecil", why: "Tepat: reduksi dimensi = trade-off terukur, bukan keyakinan.", correct: true },
            { text: "Tetap pakai 300 fitur — varians yang hilang 7% pasti penting", why: "“Pasti penting” tanpa bukti; ukur dulu penurunannya.", correct: false },
            { text: "Pakai 2 komponen karena bisa divisualisasikan", why: "Visualisasi ≠ kebutuhan model; 2 komponen membuang 90%+ varians.", correct: false },
            { text: "PCA tidak berguna untuk supervised learning", why: "PCA rutin dipakai untuk mempercepat/denoise sebelum supervised.", correct: false },
          ],
        },
      ],
    },
  ],
};
