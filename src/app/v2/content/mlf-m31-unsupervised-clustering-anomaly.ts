import type { V2Lesson } from "../lib/types";

export const mlfM31: V2Lesson = {
  slug: "mlf-m31-unsupervised-clustering-anomaly",
  track: "Machine Learning Finance",
  module: "Unsupervised — fraud",
  title: "MLF-M3.1 — Unsupervised: Clustering & Anomaly Detection",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M3 adalah pendalaman unsupervised learning untuk fraud: dari data tanpa label sama sekali, ke segmen nasabah dan antrean pemeriksaan yang bisa dipakai tim fraud. Lesson ini membuka modul itu — clustering dan anomaly detection di data yang sama dengan M2, dataset UCI 30.000 nasabah.",
        "Tujuan lesson ini:",
        "• Membedakan supervised dan unsupervised: kapan label ada, kapan tidak ada — dan apa yang masih bisa dipelajari tanpa label.",
        "• Menjelaskan KMeans: assign ke centroid terdekat, update centroid ke rata-rata anggota, diulang sampai stabil — lalu memilih k dengan silhouette.",
        "• Menjelaskan Isolation Forest: anomali terisolasi lebih cepat oleh random split; anomaly score-nya dibaca sebagai «seberapa tidak biasa», bukan probabilitas.",
        "• Mengevaluasi tanpa label: silhouette, stabilitas cluster, dan membaca cluster lewat default rate — sebagai PROXY, dengan caveat yang jujur.",
        "• Menerapkan validasi temporal untuk unsupervised: fit di periode train, terapkan ke periode berikut — jangan fit seluruh data sebelum split.",
        "• Memahami semi-supervised: memakai sedikit label (150 hasil review) bersama 9.800 transaksi tanpa label — pseudo-labeling dan label propagation — beserta batas dan risikonya.",
        "• Menjalankan dua lab dari nol: KMeans pada 12 titik, dan anomaly scoring lewat jarak ke centroid.",
        "Isi lesson: cerita bank tanpa label fraud → apa itu unsupervised → KMeans → anomaly detection → evaluasi tanpa label → 2 lab → semi-supervised → peta keputusan (termasuk validasi temporal) → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M3.1: dataset UCI 30.000 nasabah, default rate 0,2212 (6.636 default). KMeans k = 4, seed 42: silhouette 0,3969. Isolation Forest contamination 0,05, seed 42: 1.500 nasabah ter-flag (5,00 persen), default rate ter-flag 0,4367 vs tidak ter-flag 0,2099.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Bank tanpa label fraud — hanya pola pembayaran",
      prose: [
        "Bayangkan kamu di tim fraud sebuah bank. Di mejamu ada 30.000 nasabah dengan riwayat pembayaran enam bulan — status bayar, tagihan, dan jumlah yang dibayar. Yang tidak ada di mejamu: label «fraud» atau «bukan fraud». Tidak ada yang pernah menandai transaksi mana yang curang. Tidak ada daftar hitam. Yang ada hanya pola.",
        "Timmu hanya sanggup memeriksa 1.500 nasabah per bulan — 5 persen dari 30.000. Pertanyaannya bukan «siapa yang fraud?» — pertanyaan itu tidak bisa dijawab tanpa label. Pertanyaannya: «1.500 nasabah mana yang paling layak diperiksa manusia lebih dulu?» Dan pertanyaan kedua, yang sama pentingnya: «apakah 30.000 nasabah ini sebenarnya terdiri dari beberapa kelompok dengan perilaku yang berbeda?»",
        "Nilai: tanpa satu pun label, KMeans menemukan bahwa nasabah terbagi menjadi empat kelompok — dan satu kelompok (cluster 0, n = 3.183) punya default rate 0,6318, hampir tiga kali base rate 0,2212 [notebook]. Isolation Forest, dengan jatah flag 5 persen, menandai 1.500 nasabah yang default rate-nya 0,4367 — dua kali lipat base rate [notebook]. Dua alat tanpa label, dua sinyal yang langsung bisa dipakai: satu segmen untuk diawasi, satu antrean untuk diperiksa.",
        "Baik atau buruk: unsupervised bagus justru di situasi ini — ketika label tidak ada, mahal, atau datang terlambat (fraud baru ketahuan berbulan-bulan kemudian). Buruk bila hasilnya dibaca sebagai vonis: cluster bukan «kelompok penipu», flagged bukan «terbukti curang». Keduanya hanya berkata «perilaku kelompok ini berbeda» dan «nasabah ini tidak biasa» — sisanya tugas manusia.",
        "Mitigasi: pakai unsupervised untuk MEMPRIORITASKAN, bukan untuk MEMUTUSKAN. Cluster dipakai untuk memahami segmen dan mengawasi; flagged dipakai sebagai antrean pemeriksaan manusia — dengan kapasitas pemeriksaan yang dinyatakan eksplisit (di sini 5 persen). Keputusan akhir — blokir, bekukan, atau laporkan — tetap di tangan manusia, dan pengajaran penuh tentang batas ini ada di langkah 6.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: tanpa label berarti tanpa jawaban",
        type: "pitfall",
        body: "Yang benar: tanpa label kamu tidak bisa menjawab «siapa yang fraud», tapi kamu masih bisa menjawab «siapa yang perilakunya berbeda dari mayoritas» dan «kelompok mana yang paling berisiko». Dua jawaban itu — segmen dan antrean pemeriksaan — adalah produk kerja unsupervised yang sesungguhnya.",
      },
    },
    {
      id: "unsupervised",
      eyebrow: "Langkah 3 · Apa itu unsupervised",
      title: "Unsupervised: belajar dari pola, bukan dari jawaban",
      prose: [
        "Supervised learning belajar dari pasangan (X, y): fitur dan jawaban. Unsupervised learning hanya punya X — fitur tanpa jawaban. Model tidak diberi tahu mana yang default dan mana yang lancar, mana yang fraud dan mana yang bukan. Yang ia lakukan: mencari struktur di dalam X itu sendiri — kelompok yang mirip, dan titik yang tidak mirip siapa pun.",
        "Nilai: di dataset UCI, 8 fitur dipakai untuk clustering [notebook]: enam status bayar PAY_0, PAY_2, PAY_3, PAY_4, PAY_5, PAY_6 (dataset UCI memang tidak punya kolom PAY_1 — penomoran aslinya melompat dari PAY_0 ke PAY_2), plus dua fitur turunan — UTILIZATION (BILL_AMT1 dibagi LIMIT_BAL) dan PAY_RATIO (PAY_AMT1 dibagi BILL_AMT1). Semua fitur distandardisasi dulu (mean 0, simpangan baku 1) — tanpa standardisasi, fitur berskala besar seperti BILL_AMT1 (dalam NT$, sampai ratusan ribu) akan menenggelamkan fitur berskala kecil seperti PAY_0 (nilai −2 sampai 8). Jumlah fitur harus cocok dengan kode: 6 + 2 = 8 fitur, bukan 7, bukan 9.",
        "Dua keluarga unsupervised yang dipakai di fraud — dan di lesson ini. Clustering: mengelompokkan nasabah yang perilakunya mirip (KMeans). Anomaly detection: menandai nasabah yang perilakunya tidak mirip siapa pun (Isolation Forest). Keduanya menjawab pertanyaan yang berbeda: clustering menjawab «ada berapa jenis nasabah?», anomaly detection menjawab «siapa yang aneh?».",
        "Baik atau buruk: unsupervised bagus bila label tidak ada atau tidak bisa dipercaya — fraud yang belum ketahuan akan salah berlabel «bukan fraud» di data supervised, dan model supervised akan mempelajari kesalahan itu. Buruk bila dipakai untuk pertanyaan yang sebenarnya butuh label: «berapa probabilitas nasabah ini default?» tetap dijawab supervised (M2.1), bukan clustering.",
        "Mitigasi: tentukan dulu pertanyaanmu sebelum memilih alat. Butuh segmen untuk pengawasan → clustering. Butuh antrean pemeriksaan → anomaly detection. Butuh probabilitas → supervised. Dan bila label akhirnya tersedia (hasil pemeriksaan manusia kembali), pakai label itu untuk MENGEVALUASI hasil unsupervised — persis seperti yang dilakukan lesson ini dengan default rate sebagai proxy (langkah 6).",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: unsupervised tidak butuh evaluasi",
        type: "pitfall",
        body: "Yang benar: unsupervised tetap butuh evaluasi — hanya saja evaluasinya tidak memakai akurasi, karena tidak ada label untuk dibandingkan. Yang dipakai: ukuran internal seperti silhouette, stabilitas antar periode, dan — bila ada — label proxy yang dibaca dengan caveat yang jujur.",
      },
    },
    {
      id: "kmeans",
      eyebrow: "Langkah 4 · KMeans",
      title: "KMeans: assign ke centroid terdekat, update, ulangi",
      prose: [
        "KMeans bekerja dengan dua langkah yang diulang bergantian sampai tidak ada lagi yang berubah. Langkah assign: tiap nasabah ditempatkan ke cluster yang centroid-nya paling dekat (jarak Euclidean pada fitur yang sudah distandardisasi). Langkah update: tiap centroid digeser ke rata-rata (mean) semua anggota cluster-nya. Lalu assign lagi, update lagi — sampai assignment stabil.",
        "Nilai: dengan k = 4 dan seed 42, KMeans pada 30.000 nasabah UCI mencapai silhouette 0,3969 [notebook]. Empat cluster-nya: cluster 0 (n = 3.183; 10,61 persen) default rate 0,6318, mean PAY_0 1,66, mean UTILIZATION 0,619 — klaster risiko tinggi, nasabah yang rata-rata telat dan memakai limit besar. Cluster 1 (n = 9.837; 32,79 persen) default rate 0,1630, mean PAY_0 −0,82, mean UTILIZATION 0,059 — pembayar lunas, tagihan kecil. Cluster 2 (n = 16.971; 56,57 persen) default rate 0,1781, mean PAY_0 0,14, mean UTILIZATION 0,599 — mayoritas revolving: memakai limit besar tapi tidak telat. Cluster 3 (n = 9; 0,03 persen) default rate 0,0000, mean PAY_0 −0,67, mean UTILIZATION −0,139 — BUKAN segmen, melainkan artefak: segelintir nasabah bersaldo negatif (kredit, bank berutang ke nasabah). Pelajarannya: cek ukuran cluster sebelum percaya — cluster berisi 9 orang dari 30.000 bukan segmen, melainkan pengecualian yang perlu diperiksa satu per satu.",
        "Gambar di bawah adalah diagram dua langkah itu: titik-titik mengelompok di sekitar dua centroid, dan panah assign–update yang berulang. Perhatikan: centroid BUKAN nasabah nyata — ia adalah rata-rata anggota cluster, titik imajiner yang mewakili «pusat» kelompok.",
        "Memilih k: KMeans tidak menentukan sendiri berapa cluster yang benar — k dipilih manusia. Caranya: jalankan KMeans untuk beberapa nilai k, hitung silhouette tiap k, dan pilih k dengan silhouette tertinggi — dengan catatan k harus tetap bisa dijelaskan secara bisnis. Di lesson ini k = 4 dipakai sebagai pilihan yang sudah ditetapkan [notebook]; pengajaran memilih k lewat silhouette ada di langkah 6.",
        "Baik atau buruk: KMeans bagus bila cluster-nya kira-kira bulat dan berukuran sebanding, dan bila hasilnya harus dijelaskan («cluster 0 = telat + limit besar»). Buruk bila datanya punya cluster berbentuk aneh (misal bulan sabit), berukuran sangat timpang, atau penuh outlier — centroid ditarik oleh outlier, dan satu titik ekstrem bisa «mencuri» satu cluster untuk dirinya sendiri. Itulah yang hampir terjadi pada cluster 3: 9 nasabah bersaldo negatif hampir membentuk cluster sendiri.",
        "Mitigasi: standardisasi fitur sebelum clustering — KMeans memakai jarak, dan jarak tanpa standardisasi dikuasai fitur berskala besar. Jalankan dengan beberapa seed dan periksa stabilitasnya: bila isi cluster berubah-ubah tiap seed, cluster-nya tidak bisa dipercaya. Dan selalu laporkan ukuran tiap cluster berdampingan dengan profilnya — cluster tanpa n adalah angka tanpa konteks.",
      ],
      formula: String.raw`J = \sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2`,
      formulaNote: "Fungsi objektif KMeans (inertia): jumlah kuadrat jarak tiap titik ke centroid cluster-nya. KMeans meminimalkan J lewat assign–update bergantian. Rumus ringkas untuk intuisi — bukan definisi formal dari seluruh varian KMeans.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram KMeans: dua kelompok titik dengan centroid masing-masing, langkah assign lalu update diulang sampai stabil">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">KMeans: assign → update centroid, diulang sampai stabil</text>
<text x="240.0" y="36" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">● = titik data · ◯ = centroid (rata-rata anggota cluster)</text>
<circle cx="95" cy="140" r="4" fill="var(--c1)"/>
<circle cx="110" cy="165" r="4" fill="var(--c1)"/>
<circle cx="125" cy="135" r="4" fill="var(--c1)"/>
<circle cx="140" cy="170" r="4" fill="var(--c1)"/>
<circle cx="115" cy="185" r="4" fill="var(--c1)"/>
<circle cx="135" cy="150" r="4" fill="var(--c1)"/>
<circle cx="120" cy="158" r="9" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<text x="120.0" y="198" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">centroid 0</text>
<circle cx="350" cy="70" r="4" fill="var(--c2)"/>
<circle cx="370" cy="95" r="4" fill="var(--c2)"/>
<circle cx="390" cy="65" r="4" fill="var(--c2)"/>
<circle cx="410" cy="90" r="4" fill="var(--c2)"/>
<circle cx="365" cy="110" r="4" fill="var(--c2)"/>
<circle cx="395" cy="105" r="4" fill="var(--c2)"/>
<circle cx="380" cy="88" r="9" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<text x="380.0" y="132" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">centroid 1</text>
<text x="240.0" y="216" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">assign: tiap titik ke centroid terdekat · update: centroid = rata-rata anggota</text>
<text x="240.0" y="232" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Iterasi diulang sampai assignment tidak berubah.</text>
</svg>`,
        alt: "Diagram KMeans: dua kelompok titik dengan centroid masing-masing, langkah assign lalu update diulang sampai stabil.",
        caption: "Cara membaca: titik berwarna = data, lingkaran besar = centroid (rata-rata anggota, bukan nasabah nyata). Interpretasi: assign menempatkan tiap titik ke centroid terdekat, update menggeser centroid ke tengah anggotanya — diulang sampai stabil.",
      },
      tasks: [],
    },
    {
      id: "anomaly",
      eyebrow: "Langkah 5 · Anomaly detection",
      title: "Isolation Forest: anomali terisolasi lebih cepat",
      prose: [
        "Isolation Forest membalik cara berpikir deteksi anomali. Alih-alih mempelajari seperti apa «normal» itu, ia mencoba MENGISOLASI tiap titik: pilih satu fitur secara acak, pilih satu nilai split secara acak, belah data — ulangi sampai titik itu sendirian di daunnya. Titik normal butuh banyak belahan untuk terisolasi, karena ia tersembunyi di tengah kerumunan. Titik aneh terisolasi dalam sedikit belahan, karena ia sudah berbeda dari semua orang sejak awal.",
        "Nilai: dengan contamination 0,05 dan seed 42, Isolation Forest menandai 1.500 nasabah (5,00 persen dari 30.000) sebagai flagged [notebook]. Default rate yang ter-flag 0,4367, melawan 0,2099 pada yang tidak ter-flag — flagged dua kali lebih berisiko daripada yang tidak ter-flag. Dari 6.636 nasabah default, 655 berada di kelompok flagged — 9,87 persen dari semua default tertangkap dalam 5 persen populasi. Sisi sebaliknya sama pentingnya: 5.981 default (90,13 persen) TIDAK ter-flag. Anomaly detection menangkap sebagian kecil default, bukan sebagian besar.",
        "Gambar di bawah membandingkan default rate flagged vs tidak ter-flag, dengan garis base rate 0,2212 sebagai pembanding. Baca dengan benar: bar flagged yang dua kali lebih tinggi dari bar unflagged adalah bukti bahwa «tidak biasa» berkorelasi dengan default — bukan bukti bahwa flagged berarti fraud.",
        "Anomaly score-nya dibaca begini (rumus pedagogis, bukan probabilitas): skor mendekati 1 berarti titik terisolasi sangat cepat — sangat tidak biasa; skor sekitar 0,5 berarti titik butuh belahan sebanyak rata-rata — normal; skor mendekati 0 berarti titik terisolasi lebih lambat dari rata-rata — sangat normal. Peringatan yang wajib dipegang: skor anomali BUKAN probabilitas terkalibrasi. Skor 0,9 bukan berarti «peluang fraud 90 persen» — ia hanya berarti «titik ini terisolasi jauh lebih cepat dari rata-rata». Jangan pernah mengubah skor anomali menjadi probabilitas tanpa kalibrasi.",
        "Baik atau buruk: Isolation Forest bagus bila yang dicari adalah «tidak biasa» dalam data berdimensi banyak, dan bila antrean pemeriksaan harus terisi dengan kapasitas yang tetap — contamination 0,05 berarti tepat 5 persen yang ter-flag, sesuai kapasitas tim. Buruk bila «tidak biasa» disamakan dengan «jahat»: nasabah kaya dengan pola bayar unik, nasabah yang baru pindah limit, atau nasabah bersaldo negatif (cluster 3) semuanya «tidak biasa» — dan semuanya bukan fraud.",
        "Mitigasi: tetapkan contamination dari KAPASITAS pemeriksaan, bukan dari tebakan — 0,05 di sini berarti tim sanggup memeriksa 1.500 nasabah per bulan. Dan selalu laporkan dua angka berdampingan: berapa default yang tertangkap (655; 9,87 persen) DAN berapa yang lolos (5.981; 90,13 persen). Antrean pemeriksaan yang hanya melaporkan tangkapannya menyembunyikan lubangnya.",
      ],
      formula: String.raw`s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}`,
      formulaNote: "Anomaly score Isolation Forest (versi pedagogis): E(h(x)) = rata-rata panjang path untuk mengisolasi x; c(n) = panjang path rata-rata. Skor mendekati 1 = anomali, sekitar 0,5 = normal. Skor ini BUKAN probabilitas terkalibrasi.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar default rate: flagged 0,4367 vs tidak ter-flag 0,2099, dengan garis base rate 0,2212">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Default rate: ter-flag vs tidak ter-flag (Isolation Forest)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="176.7" x2="52" y2="176.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="179.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="59.3" x2="52" y2="59.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="62.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="52" y1="141.2" x2="466" y2="141.2" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="134.2" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">base rate 0,2212</text>
<rect x="110" y="77.9" width="80" height="128.1" fill="var(--c4)"/>
<text x="150" y="73.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4367</text>
<text x="150" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Ter-flag (n = 1.500)</text>
<rect x="290" y="144.4" width="80" height="61.6" fill="var(--c1)"/>
<text x="330" y="162" text-anchor="middle" font-size="11" fill="#ffffff" font-family="var(--font-ui)" font-weight="600">0,2099</text>
<text x="330" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Tidak ter-flag (n = 28.500)</text>
</svg>`,
        alt: "Bar default rate: flagged 0,4367 vs tidak ter-flag 0,2099, dengan garis base rate 0,2212.",
        caption: "Cara membaca: bar kiri = 1.500 nasabah ter-flag (default rate 0,4367), bar kanan = 28.500 sisanya (0,2099); garis putus-putus = base rate 0,2212. Interpretasi: flagged dua kali lebih berisiko — tapi 90,13 persen default TIDAK ter-flag, jadi ini antrean pemeriksaan, bukan jaring pengaman.",
      },
      tasks: [],
      note: {
        title: "Peringatan jujur: anomaly ≠ fraud",
        type: "risk",
        body: "Flagged hanya berarti «perilaku tidak biasa» yang layak diperiksa manusia. Label UCI adalah default bulan berikutnya (Oktober 2005, horizon 1 bulan) — BUKAN fraud. Default adalah proxy untuk evaluasi, bukan label fraud. Nasabah ter-flag yang ternyata lancar bukan «kesalahan model» — ia adalah nasabah tidak biasa yang kebetulan lancar.",
      },
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 6 · Evaluasi tanpa label",
      title: "Evaluasi tanpa label: silhouette, stabilitas, dan proxy yang jujur",
      prose: [
        "Tanpa label, tidak ada akurasi yang bisa dihitung. Yang ada tiga lensa evaluasi — dan ketiganya harus dipakai bersama, karena masing-masing bisa menipu sendirian.",
        "Lensa pertama: silhouette. Untuk tiap nasabah, a = jarak rata-rata ke anggota cluster-nya sendiri (kekompakan), b = jarak rata-rata ke cluster tetangga terdekat (pemisahan). Silhouette nasabah itu s = (b − a) / max(a, b), nilainya antara −1 dan 1: mendekati 1 berarti nasabah jauh lebih dekat ke cluster sendiri daripada ke tetangga; mendekati 0 berarti ia berada di perbatasan; negatif berarti ia lebih dekat ke cluster lain — salah tempat. Silhouette keseluruhan adalah rata-rata s semua nasabah.",
        "Nilai: silhouette KMeans k = 4 di notebook adalah 0,3969 [notebook]. Panduan bacaan yang umum dipakai (Kaufman–Rousseeuw, sebagai heuristik, bukan hukum alam): di atas 0,70 struktur kuat; (0,50; 0,70] struktur wajar; [0,26; 0,50] struktur lemah; di bawah 0,26 tidak ada struktur. Maka 0,3969 dibaca sebagai struktur LEMAH — cluster terbentuk, tapi tumpang tindih antar cluster masih besar. Ini bukan kegagalan: data perilaku pembayaran memang tidak terpisah rapi menjadi kotak-kotak; yang penting cluster-nya stabil dan bisa dijelaskan, bukan sempurna.",
        "Gambar di bawah adalah profil keempat cluster lewat default rate-nya — lensa kedua dan ketiga sekaligus. Lensa kedua: stabilitas — cluster yang sama harus muncul bila model dijalankan ulang dengan seed berbeda atau pada periode berbeda; cluster yang berubah-ubah isinya tiap seed adalah artefak, bukan segmen. Lensa ketiga: membaca cluster lewat LABEL PROXY. Di sini label yang tersedia adalah default bulan berikutnya (Oktober 2005, horizon 1 bulan) — dan default dipakai HANYA untuk membaca cluster, bukan untuk melatihnya. Cluster 0 default rate 0,6318 (n = 3.183), cluster 1 0,1630 (n = 9.837), cluster 2 0,1781 (n = 16.971), cluster 3 0,0000 (n = 9) [notebook].",
        "Caveat yang wajib dipegang — dan diulang karena penting: label UCI adalah DEFAULT, BUKAN FRAUD. Default rate 0,6318 pada cluster 0 berarti «nasabah di cluster ini lebih sering gagal bayar bulan berikutnya» — bukan «cluster ini berisi penipu». Fraud dan default adalah dua hal yang berbeda: penipu bisa membayar tepat waktu, dan nasabah gagal bayar bisa jadi sekadar kesulitan uang. Membaca default rate sebagai «tingkat fraud» adalah kesalahan yang sama besarnya dengan membaca skor anomali sebagai probabilitas.",
        "Baik atau buruk: silhouette bagus untuk membandingkan pilihan k pada data yang sama — k dengan silhouette tertinggi biasanya paling terpisah. Buruk bila dipakai membandingkan dataset yang berbeda, atau bila dijadikan satu-satunya alasan memilih k: k dengan silhouette tertinggi bisa jadi k yang cluster-nya tidak bermakna bisnis. Proxy default rate bagus untuk memberi NAMA pada cluster («klaster risiko tinggi», «pembayar lunas», «mayoritas revolving») — buruk bila nama itu lalu dianggap sebagai kebenaran tentang nasabahnya.",
        "Mitigasi: laporkan selalu tiga hal berdampingan — silhouette (0,3969), ukuran tiap cluster (3.183 / 9.837 / 16.971 / 9), dan profil tiap cluster (default rate + mean PAY_0 + mean UTILIZATION). Cluster dengan n = 9 dan default 0,0000 tidak diberi nama segmen — ia diberi catatan «artefak, periksa satu per satu». Dan bila silhouette berada di band lemah [0,26; 0,50], katakan terus terang: cluster ini berguna sebagai lensa pengawasan, bukan sebagai kebenaran yang terpisah rapi.",
      ],
      formula: String.raw`s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}`,
      formulaNote: "Silhouette satu titik: a(i) = jarak rata-rata ke anggota cluster sendiri, b(i) = jarak rata-rata ke cluster tetangga terdekat. Rata-rata s(i) atas semua titik = silhouette keseluruhan (di sini 0,3969).",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar default rate per cluster: cluster 0 0,6318; cluster 1 0,1630; cluster 2 0,1781; cluster 3 0,0000; garis base rate 0,2212">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Default rate per cluster — dibaca sebagai proxy, bukan vonis</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="155.7" x2="52" y2="155.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="158.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="105.4" x2="52" y2="105.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="108.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="55.1" x2="52" y2="55.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="58.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="52" y1="150.4" x2="466" y2="150.4" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="143.4" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">base rate 0,2212</text>
<rect x="80" y="47.1" width="60" height="158.9" fill="var(--c4)"/>
<text x="110" y="43.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6318</text>
<text x="110" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Cluster 0 · n=3.183</text>
<rect x="170" y="165.0" width="60" height="41.0" fill="var(--c1)"/>
<text x="200" y="161.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1630</text>
<text x="200" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Cluster 1 · n=9.837</text>
<rect x="260" y="161.2" width="60" height="44.8" fill="var(--c1)"/>
<text x="290" y="157.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1781</text>
<text x="290" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Cluster 2 · n=16.971</text>
<rect x="350" y="204" width="60" height="2" fill="var(--c2)"/>
<text x="380" y="198.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0000</text>
<text x="380" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Cluster 3 · n=9</text>
</svg>`,
        alt: "Bar default rate per cluster: cluster 0 0,6318; cluster 1 0,1630; cluster 2 0,1781; cluster 3 0,0000; garis base rate 0,2212.",
        caption: "Cara membaca: tiap bar = default rate satu cluster (proxy, bukan label fraud); garis putus-putus = base rate 0,2212. Interpretasi: hanya cluster 0 yang jauh di atas base rate (0,6318); cluster 1 dan 2 di bawahnya; cluster 3 (n = 9) terlalu kecil untuk dibaca sebagai segmen.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: silhouette tinggi berarti cluster benar",
        type: "pitfall",
        body: "Yang benar: silhouette mengukur kekompakan dan pemisahan geometris — bukan kebenaran bisnis. Silhouette 0,3969 (band lemah) dengan cluster yang bisa dijelaskan («telat + limit besar» vs «pembayar lunas») lebih berguna daripada silhouette 0,80 dengan cluster yang tidak ada artinya.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: KMeans dari nol pada 12 titik",
      prose: [
        "Sekarang giliranmu menjalankan KMeans. Datanya 12 titik 2D — 6 titik di sekitar (1,5; 1,5) dan 6 titik di sekitar (8,5; 8,5) — dengan centroid awal eksplisit (1,0; 1,0) dan (9,0; 9,0). Dua iterasi assign–update, tanpa library apa pun: hanya jarak Euclidean dan rata-rata.",
        "Perhatikan apa yang terjadi: iterasi pertama sudah memindahkan centroid ke tengah masing-masing kelompok — (1,5833; 1,5000) dan (8,5833; 8,5000) [lab] — dan iterasi kedua tidak mengubah apa-apa. KMeans konvergen dalam satu iterasi di sini karena kelompoknya terpisah sangat jelas dan centroid awalnya sudah berada di dalam kelompok yang benar. Di data nyata (silhouette 0,3969, bukan 1,0), konvergensi tidak secepat ini — dan centroid awal yang buruk bisa menjebak KMeans di solusi yang jelek.",
        "Assignment akhirnya [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1] [lab]: enam titik pertama ke cluster 0, enam sisanya ke cluster 1. Bandingkan dengan notebook: di sana assignment tidak pernah serapi ini — cluster 2 berisi 56,57 persen nasabah, dan silhouette-nya 0,3969, bukan 1,0. Lab kecil menunjukkan mekaniknya; notebook menunjukkan realitanya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi langkah assign: titik ke cluster 0 bila d0 <= d1, selain itu cluster 1" },
        { id: "t2", text: "Lengkapi langkah update: centroid baru = rata-rata x dan y anggota cluster-nya" },
        { id: "t3", text: "Jalankan 2 iterasi dan baca centroid akhir + assignment" },
      ],
      expected: "iterasi 1: centroid0=(1.5833, 1.5000) centroid1=(8.5833, 8.5000)\niterasi 2: centroid0=(1.5833, 1.5000) centroid1=(8.5833, 8.5000)\ncentroid akhir 0: (1.5833, 1.5000)\ncentroid akhir 1: (8.5833, 8.5000)\nassignment: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]",
      hints: [
        "Jarak kuadrat: (x1 - x2) kuadrat + (y1 - y2) kuadrat — akar kuadratnya tidak mengubah urutan, jadi bandingkan jarak kuadrat saja.",
        "Rata-rata anggota: jumlahkan x semua anggota lalu bagi jumlah anggota; begitu pula y.",
      ],
      code: {
        starter: `# 12 titik 2D: 6 titik di sekitar (1,5; 1,5), 6 titik di sekitar (8,5; 8,5)
points = [
    (1.0, 1.0), (1.0, 2.0), (2.0, 1.0), (2.0, 2.0), (1.5, 1.5), (2.0, 1.5),
    (8.0, 8.0), (9.0, 8.0), (8.0, 9.0), (9.0, 9.0), (8.5, 8.5), (9.0, 8.5),
]
# Centroid awal eksplisit (seed tetap via titik awal, tanpa random)
centroids = [(1.0, 1.0), (9.0, 9.0)]

def dist2(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

assign = []
for it in range(2):
    assign = []
    for p in points:
        d0 = dist2(p, centroids[0])
        d1 = dist2(p, centroids[1])
        assign.append(0)  # TODO: 0 bila d0 <= d1, selain itu 1
    new_centroids = []
    for k in range(2):
        members = [p for p, a in zip(points, assign) if a == k]
        new_centroids.append((0.0, 0.0))  # TODO: rata-rata x dan y anggota
    centroids = new_centroids
    print(f"iterasi {it + 1}: centroid0=({centroids[0][0]:.4f}, {centroids[0][1]:.4f}) centroid1=({centroids[1][0]:.4f}, {centroids[1][1]:.4f})")

print(f"centroid akhir 0: ({centroids[0][0]:.4f}, {centroids[0][1]:.4f})")
print(f"centroid akhir 1: ({centroids[1][0]:.4f}, {centroids[1][1]:.4f})")
print("assignment:", assign)`,
        lockLines: 17,
        solution: `# 12 titik 2D: 6 titik di sekitar (1,5; 1,5), 6 titik di sekitar (8,5; 8,5)
points = [
    (1.0, 1.0), (1.0, 2.0), (2.0, 1.0), (2.0, 2.0), (1.5, 1.5), (2.0, 1.5),
    (8.0, 8.0), (9.0, 8.0), (8.0, 9.0), (9.0, 9.0), (8.5, 8.5), (9.0, 8.5),
]
# Centroid awal eksplisit (seed tetap via titik awal, tanpa random)
centroids = [(1.0, 1.0), (9.0, 9.0)]

def dist2(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

assign = []
for it in range(2):
    assign = []
    for p in points:
        d0 = dist2(p, centroids[0])
        d1 = dist2(p, centroids[1])
        assign.append(0 if d0 <= d1 else 1)
    new_centroids = []
    for k in range(2):
        members = [p for p, a in zip(points, assign) if a == k]
        new_centroids.append((sum(p[0] for p in members) / len(members),
                              sum(p[1] for p in members) / len(members)))
    centroids = new_centroids
    print(f"iterasi {it + 1}: centroid0=({centroids[0][0]:.4f}, {centroids[0][1]:.4f}) centroid1=({centroids[1][0]:.4f}, {centroids[1][1]:.4f})")

print(f"centroid akhir 0: ({centroids[0][0]:.4f}, {centroids[0][1]:.4f})")
print(f"centroid akhir 1: ({centroids[1][0]:.4f}, {centroids[1][1]:.4f})")
print("assignment:", assign)`,
        checks: [
          { kind: "equal", task: "t3", name: "assign", value: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], label: "`assign` seharusnya [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]", msg: "Enam titik pertama ke cluster 0, enam sisanya ke cluster 1 — kelompoknya terpisah jelas." },
          { kind: "stdout_matches", task: "t3", pattern: "centroid akhir 0: \\(1\\.5833, 1\\.5000\\)", label: "Output menampilkan centroid akhir cluster 0", msg: "Centroid akhir 0: (1.5833, 1.5000) — rata-rata enam titik pertama." },
          { kind: "stdout_matches", task: "t3", pattern: "centroid akhir 1: \\(8\\.5833, 8\\.5000\\)", label: "Output menampilkan centroid akhir cluster 1", msg: "Centroid akhir 1: (8.5833, 8.5000) — rata-rata enam titik kedua." },
          { kind: "stdout_matches", task: "t3", pattern: "iterasi 2: centroid0=\\(1\\.5833, 1\\.5000\\) centroid1=\\(8\\.5833, 8\\.5000\\)", label: "Output menampilkan iterasi 2 sama dengan iterasi 1 (konvergen)", msg: "Iterasi 2 tidak mengubah centroid — KMeans sudah konvergen." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: anomaly scoring lewat jarak ke centroid",
      prose: [
        "Lab kedua adalah anomaly detection versi paling sederhana: hitung centroid SEMUA titik (bukan per cluster), ukur jarak tiap titik ke centroid itu, lalu ubah jarak menjadi z-score — (jarak − mean jarak) dibagi simpangan baku jarak (populasi). Titik dengan z-score tertinggi adalah yang paling «tidak biasa».",
        "Datanya 10 titik: 8 titik berkumpul di sekitar (0, 0) sampai (1, 1), dan 2 titik jauh — (5,0; 5,0) dan (6,0; 0,5). Tugasmu: flag 2 titik terjauh, seperti contamination 0,05 yang menandai 5 persen teratas di notebook — hanya saja di sini 2 dari 10 (20 persen) yang di-flag, supaya perhitungannya terlihat.",
        "Hasilnya: titik 8 (5,0; 5,0) jarak 5,4753, z = 2,2431; titik 9 (6,0; 0,5) jarak 4,5727, z = 1,6678 [lab]. Keduanya jauh di atas 8 titik lain, yang z-score-nya semua negatif (di bawah rata-rata jarak). Flagged: [8, 9]. Perhatikan: z-score di sini memakai mean dan simpangan baku dari data ITU SENDIRI — termasuk kedua outlier-nya. Outlier ikut menarik mean jarak ke atas, sehingga z-score mereka «terlihat» lebih kecil dari yang sebenarnya. Itulah kelemahan scoring berbasis jarak global — dan alasan Isolation Forest memakai isolasi acak, bukan jarak ke pusat.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi jarak tiap titik ke centroid (cx, cy)" },
        { id: "t2", text: "Lengkapi z-score: (jarak - mean jarak) / simpangan baku jarak" },
        { id: "t3", text: "Flag 2 titik dengan z-score tertinggi dan cetak daftarnya" },
      ],
      expected: "titik 0 (0.0, 0.0): jarak=1.6671 z=-0.1840\ntitik 1 (0.5, 0.2): jarak=1.1372 z=-0.5217\ntitik 2 (0.2, 0.5): jarak=1.2858 z=-0.4270\ntitik 3 (1.0, 0.0): jarak=0.9483 z=-0.6421\ntitik 4 (0.0, 1.0): jarak=1.4489 z=-0.3230\ntitik 5 (0.8, 0.8): jarak=0.6412 z=-0.8378\ntitik 6 (0.3, 0.3): jarak=1.2614 z=-0.4425\ntitik 7 (0.6, 0.1): jarak=1.1195 z=-0.5330\ntitik 8 (5.0, 5.0): jarak=5.4753 z=2.2431\ntitik 9 (6.0, 0.5): jarak=4.5727 z=1.6678\nflagged: [8, 9]",
      hints: [
        "Jarak Euclidean: akar dari (x - cx) kuadrat + (y - cy) kuadrat — pakai math.sqrt.",
        "Simpangan baku populasi: akar dari rata-rata (jarak - mean) kuadrat — sama seperti standardisasi di Lab 1 M2.1.",
        "Dua tertinggi: urutkan indeks berdasarkan z dari besar ke kecil, ambil 2 pertama, lalu urutkan lagi menaik untuk dicetak.",
      ],
      code: {
        starter: `import math

# 10 titik: 8 titik berkumpul di sekitar (0, 0)-(1, 1), 2 titik jauh
pts = [(0.0, 0.0), (0.5, 0.2), (0.2, 0.5), (1.0, 0.0), (0.0, 1.0),
       (0.8, 0.8), (0.3, 0.3), (0.6, 0.1), (5.0, 5.0), (6.0, 0.5)]

# Centroid SEMUA titik (bukan per cluster)
cx = sum(p[0] for p in pts) / len(pts)
cy = sum(p[1] for p in pts) / len(pts)

d = []
for p in pts:
    d.append(0.0)  # TODO: jarak Euclidean titik p ke (cx, cy)

md = sum(d) / len(d)
sd = math.sqrt(sum((x - md) ** 2 for x in d) / len(d))
z = []
for x in d:
    z.append(0.0)  # TODO: z-score = (x - md) / sd

for i, (p, di, zi) in enumerate(zip(pts, d, z)):
    print(f"titik {i} ({p[0]}, {p[1]}): jarak={di:.4f} z={zi:.4f}")

flagged = sorted(range(len(pts)), key=lambda i: z[i], reverse=True)[:2]
flagged = sorted(flagged)
print("flagged:", flagged)`,
        lockLines: 12,
        solution: `import math

# 10 titik: 8 titik berkumpul di sekitar (0, 0)-(1, 1), 2 titik jauh
pts = [(0.0, 0.0), (0.5, 0.2), (0.2, 0.5), (1.0, 0.0), (0.0, 1.0),
       (0.8, 0.8), (0.3, 0.3), (0.6, 0.1), (5.0, 5.0), (6.0, 0.5)]

# Centroid SEMUA titik (bukan per cluster)
cx = sum(p[0] for p in pts) / len(pts)
cy = sum(p[1] for p in pts) / len(pts)

d = []
for p in pts:
    d.append(math.sqrt((p[0] - cx) ** 2 + (p[1] - cy) ** 2))

md = sum(d) / len(d)
sd = math.sqrt(sum((x - md) ** 2 for x in d) / len(d))
z = []
for x in d:
    z.append((x - md) / sd)

for i, (p, di, zi) in enumerate(zip(pts, d, z)):
    print(f"titik {i} ({p[0]}, {p[1]}): jarak={di:.4f} z={zi:.4f}")

flagged = sorted(range(len(pts)), key=lambda i: z[i], reverse=True)[:2]
flagged = sorted(flagged)
print("flagged:", flagged)`,
        checks: [
          { kind: "equal", task: "t3", name: "flagged", value: [8, 9], label: "`flagged` seharusnya [8, 9]", msg: "Dua titik terjauh — (5,0; 5,0) dan (6,0; 0,5) — adalah yang paling tidak biasa." },
          { kind: "stdout_matches", task: "t2", pattern: "titik 8 \\(5\\.0, 5\\.0\\): jarak=5\\.4753 z=2\\.2431", label: "Output menampilkan titik 8 dengan z-score tertinggi", msg: "Titik 8: jarak 5,4753, z 2,2431 — paling jauh dari centroid." },
          { kind: "stdout_matches", task: "t2", pattern: "titik 9 \\(6\\.0, 0\\.5\\): jarak=4\\.5727 z=1\\.6678", label: "Output menampilkan titik 9 dengan z-score kedua tertinggi", msg: "Titik 9: jarak 4,5727, z 1,6678 — kedua terjauh." },
          { kind: "stdout_matches", task: "t3", pattern: "flagged: \\[8, 9\\]", label: "Output menampilkan flagged [8, 9]", msg: "Format: flagged: [8, 9]." },
        ],
      },
    },
    {
      id: "semi-supervised",
      eyebrow: "Langkah 9 · Semi-supervised learning",
      title: "Semi-supervised: 150 label + 9.800 transaksi tanpa label",
      prose: [
        "Kembali ke cerita pembuka — tapi kali ini tim fraud TIDAK sepenuhnya tanpa label. Selama setahun, analis memeriksa 200 transaksi secara manual: 100 dari antrean aturan (amount di atas persentil 90, atau velocity ≥ 1 transaksi/jam, atau device baru) dan 100 acak. Hasilnya: 43 fraud dari 200 — 29 dari antrean aturan, 14 dari acak. Dari 200 itu, 150 dipakai melatih (33 fraud) dan 50 untuk validasi (10 fraud). Sisanya — 9.800 transaksi — tanpa label. Dan ada audit independen 1.000 transaksi (166 fraud) yang TIDAK dipakai melatih sama sekali: ia hanya alat ukur. Semua angka di langkah ini berasal dari data sintetis [ilustrasi] (seed 42) — bukan dari notebook UCI — karena lesson ini memang tidak punya label fraud di data nyata.",
        "Satu catatan tentang antrean aturan: 29 dari 100 antrean aturan adalah fraud, vs 14 dari 100 acak — aturan mengarahkan review ke tempat yang lebih kaya fraud, sehingga train berisi 33 fraud dari 150 (22 persen, di atas base rate 16,3 persen). Itu bagus untuk belajar, tapi train-nya tidak mewakili populasi — alasan lain kenapa audit independen wajib ada.",
        "Nilai: baseline supervised — logistic regression di 150 label — mencapai precision 0,6216, recall 0,1386, F1 0,2266, PR-AUC 0,4509 di audit [ilustrasi]. Precision-nya lumayan (6 dari 10 yang diprediksi positif memang fraud), tapi recall-nya kecil: dari 166 fraud di audit, hanya 23 yang tertangkap. Di validasi 50, recall-nya 1 dari 10. Model ini tahu sedikit — karena ia hanya pernah melihat 150 contoh.",
        "Pseudo-labeling: model baseline memprediksi 8.800 transaksi tanpa label; yang skornya ≥ 0,95 dilabeli fraud, yang ≤ 0,05 dilabeli lancar, lalu model dilatih ulang dengan label tambahan itu. Hasilnya mengejutkan dalam arti yang spesifik: TIDAK ADA satu pun transaksi yang skornya ≥ 0,95 — model tidak pernah seyakin itu soal fraud. Yang ≤ 0,05 ada 212, dan 99,06 persen di antaranya memang lancar (hanya 2 yang salah label). Setelah retrain: precision 0,5775, recall 0,2470, F1 0,3460, PR-AUC 0,4500 [ilustrasi]. Recall naik (23 → 41 fraud tertangkap), precision turun sedikit, dan PR-AUC nyaris TIDAK bergerak: 0,4509 → 0,4500.",
        "Label propagation pada graf akun-device: 2.000 akun terhubung lewat 400 device; component terbesar berisi 1.990 akun — hampir seluruh graf terhubung lewat jembatan device kedua. Label 150 review «mengalir» ke tetangga lewat edge selama 30 iterasi. Hasilnya: precision 0,1143, recall 0,0241, F1 0,0398, PR-AUC 0,1755 [ilustrasi]. Precision-nya di bawah base rate audit (0,166): memprediksi positif dengan metode ini lebih buruk daripada sekadar menebak base rate. Skor rata-rata akun ring memang lebih tinggi (0,2522 vs 0,1936 non-ring), tapi tidak cukup: recall@0,5 di subset ring 0 dari 13 — baik baseline maupun propagasi tidak menangkap satu pun fraud ring di atas ambang 0,5. Dari 100 skor tertinggi di audit, propagasi menangkap 22 fraud, baseline 54.",
        "Retrain dengan 200 label review + pseudo-label dari pseudo-labeling: precision 0,5455, recall 0,2169, F1 0,3103, PR-AUC 0,4354 [ilustrasi] — tidak lebih baik dari pseudo-labeling saja. Menambah 50 label asli tidak menyelamatkan metode yang fondasinya rapuh.",
        "Gambar di bawah membandingkan keempat pendekatan lewat PR-AUC di audit — dan pesan utamanya ada di dua batang pertama yang nyaris sama tinggi.",
        "Baik atau buruk: pseudo-labeling bagus bila model sudah cukup yakin di sebagian data — di sini sisi «lancar»-nya yakin (212 pseudo-legit, 99,06 persen benar) dan recall naik tanpa merusak precision terlalu banyak. Buruk bila dibaca sebagai «model belajar dari data baru»: pseudo-label tidak menambah informasi baru — ia hanya memakai ulang keyakinan model sendiri, itu sebabnya PR-AUC tidak bergerak. Label propagation bagus bila tetangga benar-benar berbagi label — di data ini fraud-nya feature-driven (amount, velocity, device baru), bukan graph-clustered, kecuali ring kecil 60 akun; propagasi menyebar label ke tetangga yang sebenarnya lancar, dan 30 iterasi tidak memperbaikinya (PR-AUC tetap ~0,175 di iterasi 2, 3, 5, 10, dan 30).",
        "Mitigasi: pertama, nilai SELALU dengan label independen — audit 1.000 dan validasi 50 di sini tidak pernah dipakai melatih; menilai pseudo-labeling pada data yang ikut dilatih adalah menilai diri sendiri. Kedua, kalibrasi ambang pseudo-label sebelum percaya: ambang ≥ 0,95 yang menghasilkan 0 pseudo-fraud adalah sinyal bahwa model tidak yakin — menurunkan ambang demi «mendapat lebih banyak pseudo-label» hanya menambah label salah yang memperkuat bias model sendiri (2 dari 212 sudah salah; di ambang yang lebih rendah, kesalahan itu berlipat). Ketiga, kenali kapan semi-supervised BUKAN jawabannya: bila label yang ada hanya 150 dan sinyalnya feature-driven, supervised baseline yang jujur (PR-AUC 0,4509) lebih berguna daripada propagasi yang merusak (0,1755). Dan bila label akhirnya cukup banyak, pindah ke supervised penuh (M2.1) — semi-supervised adalah jembatan, bukan tujuan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar PR-AUC di audit: baseline 0,4509; pseudo-labeling 0,4500; label propagation 0,1755; retrain 0,4354; garis base rate 0,166">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PR-AUC di audit — pseudo-label tidak menambah informasi baru</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="52" y1="147.6" x2="466" y2="147.6" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="140.6" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">base rate 0,166</text>
<rect x="80" y="47.3" width="60" height="158.7" fill="var(--c4)"/>
<text x="110" y="43.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4509</text>
<text x="110" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">A · baseline</text>
<rect x="170" y="47.6" width="60" height="158.4" fill="var(--c1)"/>
<text x="200" y="43.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4500</text>
<text x="200" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">B · pseudo-label</text>
<rect x="260" y="144.2" width="60" height="61.8" fill="var(--c2)"/>
<text x="290" y="140.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1755</text>
<text x="290" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">C · label prop.</text>
<rect x="350" y="52.7" width="60" height="153.3" fill="var(--c1)"/>
<text x="380" y="48.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4354</text>
<text x="380" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">D · retrain</text>
</svg>`,
        alt: "Bar PR-AUC di audit: baseline 0,4509; pseudo-labeling 0,4500; label propagation 0,1755; retrain 0,4354; garis base rate 0,166.",
        caption: "Cara membaca: tiap bar = PR-AUC di audit independen 1.000 transaksi [ilustrasi]; garis putus-putus = base rate audit 0,166 (PR-AUC model acak). Interpretasi: baseline, pseudo-labeling, dan retrain nyaris sama (0,45; 0,45; 0,44); label propagation jatuh ke 0,1755 — nyaris setara acak.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: lebih banyak label (pseudo) berarti model lebih pintar",
        type: "pitfall",
        body: "Yang benar: pseudo-label adalah keyakinan model sendiri yang ditulis ulang sebagai label. Model tidak pernah melihat kebenaran baru — ia hanya berlatih pada cerminnya. Buktinya: PR-AUC nyaris tidak bergerak (0,4509 → 0,4500) walau recall naik dari 0,1386 ke 0,2470. Recall naik karena model berani memprediksi lebih banyak positif, bukan karena ia tahu lebih banyak tentang fraud.",
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: alat apa untuk masalah tanpa label apa?",
      prose: [
        "Tidak ada label sama sekali dan kamu butuh segmen yang bisa dijelaskan? KMeans — baca tiap cluster lewat profilnya (n, default rate proxy, mean PAY_0, mean UTILIZATION) dan beri nama hanya bila cluster-nya cukup besar dan stabil.",
        "Tidak ada label dan kamu butuh antrean pemeriksaan dengan kapasitas tetap? Isolation Forest — tetapkan contamination dari kapasitas tim (di sini 0,05 = 1.500 pemeriksaan per bulan), lalu periksa yang ter-flag dari skor tertinggi.",
        "Ada sedikit label — misal hasil pemeriksaan manusia mulai kembali? Pakai label itu untuk MENGEVALUASI hasil unsupervised (seperti default rate di langkah 6), dan bila label sudah cukup banyak, pertimbangkan pindah ke supervised (M2.1) untuk pertanyaan probabilitas.",
        "Butuh angka kerugian, bukan segmen atau antrean? Itu bukan pekerjaan unsupervised — EL = PD × LGD × EAD dijawab model supervised dan regresi (M2.3). Unsupervised tidak mengeluarkan probabilitas default.",
        "Tidak yakin cluster-nya nyata atau artefak? Cek tiga hal: ukurannya (n = 9 dari 30.000 adalah artefak, bukan segmen), stabilitasnya antar seed, dan apakah ia muncul lagi di periode berikut — itulah validasi temporal di bawah ini.",
        "Validasi temporal — cara menguji unsupervised yang tidak bisa ditipu waktu. Aturannya sama seperti G1 di M2, diterjemahkan ke unsupervised: scaler, KMeans, dan Isolation Forest di-fit HANYA pada periode train — lalu diterapkan ke periode berikut dengan predict (KMeans) dan predict/score_samples (Isolation Forest). Yang tidak boleh dilakukan: men-standardisasi atau men-cluster SELURUH data dulu, baru membaginya menjadi train dan test. Centroid dan scaler yang «melihat» periode test sebelum waktunya adalah leakage — sama berbahayanya dengan WoE yang dihitung dari seluruh data di M2. Notebook M3.1 mendemonstrasikannya: bagi stratified 24.000 train / 6.000 test (seed 42), fit scaler + KMeans + Isolation Forest hanya di train, terapkan ke test, lalu bandingkan default rate tiap cluster antara train dan test. Cluster yang stabil — default rate-nya nyaris sama di train dan test — adalah cluster yang bisa dipercaya; cluster mungil yang hanya punya 8 anggota di train dan 1 di test adalah artefak yang tidak lolos validasi.",
        "Fakta struktural yang wajib jujur tentang UCI: dataset ini adalah SATU snapshot — fitur observasi April–September 2005, label default Oktober 2005 (horizon 1 bulan). Split out-of-time yang sesungguhnya TIDAK mungkin di dataset ini — yang diajarkan di sini adalah prinsip, aturan fit-di-train-terapkan-ke-berikutnya, dan demonstrasi train/test sebagai pengganti temporal. Di produksi, ganti «test» dengan «periode berikutnya yang belum pernah dilihat model» — dan jangan pernah mengubah centroid atau threshold setelah melihat periode itu.",
        "Peta M3.2 — apa yang menanti. Network & graph features: nasabah tidak hidup sendiri — ia terhubung lewat rekening, nomor telepon, dan alamat yang sama. Lesson berikut mengubah koneksi itu menjadi fitur: degree, shared identifiers, dan komunitas. Peta konsep saja — pengajaran penuhnya di lesson berikut.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: 1.500 pemeriksaan, siapa diperiksa dulu?",
      prose: [
        "Kembali ke cerita pembuka. Tim fraud sanggup memeriksa 1.500 nasabah per bulan — 5 persen dari 30.000. Dua alat unsupervised sudah memberi dua daftar: cluster 0 berisi 3.183 nasabah dengan default rate 0,6318 [notebook], dan Isolation Forest menandai 1.500 nasabah dengan default rate 0,4367 [notebook]. Kapasitas hanya 1.500 — daftar mana yang dipakai?",
        "Hitung dulu nilai tiap daftar sebagai antrean pemeriksaan. Daftar flagged (1.500 nasabah): ekspektasi default di dalamnya 1.500 × 0,4367 = 655 nasabah [notebook]. Daftar acak (1.500 nasabah tanpa model): ekspektasi default 1.500 × 0,2212 = 332 nasabah. Daftar flagged menangkap hampir dua kali lipat default dibanding acak — 655 vs 332. Itu nilai Isolation Forest sebagai alat prioritas: bukan karena flagged berarti fraud, melainkan karena memeriksa 1.500 nasabah yang «tidak biasa» menemukan 655 default, sementara memeriksa 1.500 nasabah acak hanya menemukan 332.",
        "Tapi hitung juga lubangnya — ini yang sering tidak dilaporkan. Dari 6.636 default, hanya 655 yang ter-flag: 5.981 default (90,13 persen) TIDAK ter-flag [notebook]. Bila tim hanya memeriksa yang flagged, 9 dari 10 default lolos dari pemeriksaan bulan itu. Flagged adalah prioritas, bukan jaring pengaman.",
        "Bagaimana dengan cluster 0? Ia berisi 3.183 nasabah — lebih besar dari kapasitas 1.500 — jadi ia tidak bisa diperiksa seluruhnya dalam sebulan. Gunanya berbeda: cluster 0 adalah SEGMEN PENGAWASAN, bukan antrean. Nasabah cluster 0 (rata-rata telat, PAY_0 mean 1,66; memakai limit besar, UTILIZATION mean 0,619) masuk pengawasan diperketat — misal limit baru ditahan, transaksi besar diminta verifikasi — sementara antrean pemeriksaan 1.500 diisi dari skor anomali tertinggi. Dan cluster 3 (n = 9, bersaldo negatif) diperiksa satu per satu sebagai pengecualian data, bukan sebagai segmen.",
        "Keputusan mini-case: isi 1.500 slot pemeriksaan dari skor anomali tertinggi (Isolation Forest, contamination 0,05); awasi cluster 0 sebagai segmen; periksa 9 nasabah cluster 3 satu per satu; dan laporkan tiap bulan DUA angka — berapa default yang tertangkap (655) dan berapa yang lolos (5.981). Keputusan akhir atas tiap nasabah yang diperiksa tetap di tangan manusia: flagged adalah «periksa dulu», bukan «blokir».",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 12 · Guided task di Colab",
      title: "Guided task di Colab: KMeans dan Isolation Forest di data UCI 30.000 nasabah",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 12 dan 10 titik. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m31-guided-task.ipynb.",
        "Di notebook itu kamu memuat dataset UCI yang sesungguhnya (30.000 nasabah), membangun 8 fitur yang sama (6 status bayar + UTILIZATION + PAY_RATIO), mereplikasi KMeans k = 4 (silhouette 0,3969) dan Isolation Forest contamination 0,05 (1.500 ter-flag, default 0,4367 vs 0,2099) dengan sklearn, membaca profil tiap cluster, lalu mendemonstrasikan validasi temporal — fit di train 24.000, terapkan ke test 6.000 — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/1MlbD7ManBIfjU5Y-SVIr_yJRft7bHq7K",
        "Jalur file notebook: colab/mlf-m31-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: dari pola ke prioritas",
      prose: [
        "Rangkuman: unsupervised belajar dari pola tanpa label — KMeans mengelompokkan yang mirip lewat assign–update, Isolation Forest menandai yang aneh lewat isolasi acak. KMeans k = 4 mencapai silhouette 0,3969 (struktur lemah tapi bisa dijelaskan): cluster 0 risiko tinggi (default 0,6318, n = 3.183), cluster 1 pembayar lunas (0,1630), cluster 2 mayoritas revolving (0,1781), cluster 3 artefak (n = 9). Isolation Forest menandai 1.500 nasabah (5 persen) dengan default 0,4367 vs 0,2099 — menangkap 655 dari 6.636 default (9,87 persen), sementara 5.981 (90,13 persen) lolos. Anomaly ≠ fraud; default adalah proxy, bukan label fraud; dan validasi temporal berarti fit di train, terapkan ke periode berikut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Cluster mana yang paling berisiko, dan berapa default rate-nya?",
          options: [
            { text: "Cluster 1 — default rate 0,1630", why: "Itu cluster pembayar lunas (mean PAY_0 −0,82, UTILIZATION 0,059) — risikonya paling rendah, bukan tertinggi." },
            { text: "Cluster 2 — default rate 0,1781", why: "Itu mayoritas revolving (n = 16.971) — default rate-nya di bawah base rate 0,2212." },
            { text: "Cluster 0 — default rate 0,6318", why: "Benar: cluster 0 (n = 3.183) punya default rate 0,6318 — hampir tiga kali base rate 0,2212; mean PAY_0 1,66 dan UTILIZATION 0,619.", correct: true },
            { text: "Cluster 3 — default rate 0,0000", why: "Itu cluster artefak (n = 9) — default rate-nya 0,0000, tapi ia terlalu kecil untuk dibaca sebagai segmen." },
          ],
        },
        {
          q: "Silhouette KMeans k = 4 adalah 0,3969. Apa bacaan yang paling tepat?",
          options: [
            { text: "Struktur kuat — cluster terpisah sempurna", why: "Struktur kuat butuh silhouette di atas 0,70; 0,3969 jauh di bawah itu." },
            { text: "Struktur lemah — cluster terbentuk tapi tumpang tindih masih besar", why: "Benar: 0,3969 masuk band [0,26; 0,50] (Kaufman–Rousseeuw) — cluster ada dan bisa dijelaskan, tapi tidak terpisah rapi.", correct: true },
            { text: "Tidak ada struktur sama sekali", why: "Tidak ada struktur berarti silhouette di bawah 0,26; 0,3969 masih di atas itu." },
            { text: "Cluster salah tempat — harus dibuang", why: "Salah tempat ditandai silhouette negatif; 0,3969 positif — cluster-nya berguna sebagai lensa pengawasan." },
          ],
        },
        {
          q: "Mengapa nasabah ter-flag Isolation Forest TIDAK boleh langsung disebut fraud?",
          options: [
            { text: "Karena hanya 655 dari 1.500 flagged yang default — dan default pun bukan label fraud", why: "Benar: flagged berarti «perilaku tidak biasa» yang layak diperiksa manusia; label UCI adalah default bulan berikutnya, bukan fraud.", correct: true },
            { text: "Karena anomaly score-nya belum dikalibrasi menjadi probabilitas", why: "Itu benar sebagai fakta, tapi bukan alasan utamanya — alasan utamanya adalah flagged mengukur «tidak biasa», bukan «curang»." },
            { text: "Karena contamination 0,05 terlalu kecil", why: "Contamination 0,05 adalah kapasitas pemeriksaan (1.500/bulan), bukan penyebab flagged tidak sama dengan fraud." },
            { text: "Karena 5.981 default tidak ter-flag", why: "Itu soal cakupan (recall) antrean, bukan soal arti flagged — keduanya masalah yang berbeda." },
          ],
        },
        {
          q: "Cluster 3 berisi 9 nasabah (0,03 persen), default rate 0,0000, mean UTILIZATION −0,139. Mengapa ia bukan segmen?",
          options: [
            { text: "Karena default rate-nya 0 — segmen harus punya default", why: "Default 0 bukan masalahnya — masalahnya ukurannya: 9 orang tidak bisa menjadi segmen perilaku." },
            { text: "Karena ia terlalu kecil dan merupakan artefak saldo negatif — cek ukuran cluster sebelum percaya", why: "Benar: 9 dari 30.000 adalah pengecualian (saldo negatif/kredit), bukan segmen; ia diperiksa satu per satu, bukan diberi nama segmen.", correct: true },
            { text: "Karena mean PAY_0-nya negatif", why: "Mean PAY_0 −0,67 hanya berarti rata-rata bayar lunas — bukan alasan menolak cluster sebagai segmen." },
            { text: "Karena silhouette-nya pasti negatif", why: "Silhouette per cluster tidak dihitung di lesson ini — dan bukan itu alasan cluster 3 ditolak sebagai segmen." },
          ],
        },
        {
          q: "Apa yang terjadi pada langkah update KMeans?",
          options: [
            { text: "Tiap titik dipindah ke cluster dengan centroid terdekat", why: "Itu langkah assign — update adalah langkah yang lain." },
            { text: "Tiap centroid digeser ke rata-rata anggota cluster-nya", why: "Benar: update menghitung mean semua anggota cluster dan menjadikannya centroid baru; lalu assign diulang.", correct: true },
            { text: "Jumlah cluster k ditambah satu", why: "k ditetapkan manusia sebelum iterasi dan tidak berubah selama assign–update." },
            { text: "Titik terjauh dari centroid dibuang sebagai outlier", why: "KMeans tidak membuang titik — semua titik tetap menjadi anggota satu cluster; outlier hanya menarik centroid." },
          ],
        },
        {
          q: "Mengapa titik anomali terisolasi lebih cepat di Isolation Forest?",
          options: [
            { text: "Karena anomali dipilih dulu oleh algoritma", why: "Isolation Forest tidak tahu mana yang anomali sebelumnya — split dipilih acak, tanpa melihat label." },
            { text: "Karena anomali berbeda dari mayoritas, jadi sedikit random split sudah memisahkannya sendirian", why: "Benar: titik normal tersembunyi di kerumunan dan butuh banyak belahan; titik aneh berbeda sejak awal, jadi terisolasi dalam sedikit langkah — path pendek berarti skor anomali tinggi.", correct: true },
            { text: "Karena anomali selalu punya nilai fitur ekstrem", why: "Tidak selalu — anomali bisa berupa kombinasi nilai yang biasa-biasa saja tapi tidak pernah muncul bersamaan." },
            { text: "Karena Isolation Forest melatih classifier pada label fraud", why: "Isolation Forest adalah unsupervised — tidak ada label fraud yang dipakai melatihnya." },
          ],
        },
        {
          q: "Mengapa scaler, KMeans, dan Isolation Forest tidak boleh di-fit pada seluruh data sebelum split train/test?",
          options: [
            { text: "Karena hasilnya akan terlalu lambat dihitung", why: "Kecepatan bukan masalahnya — masalahnya kebocoran informasi dari periode test." },
            { text: "Karena centroid dan scaler yang melihat test adalah leakage — fit di train saja, terapkan ke periode berikut", why: "Benar: fit seluruh data sebelum split berarti model sudah «melihat» periode test; itu leakage, sama seperti WoE dari seluruh data di M2.", correct: true },
            { text: "Karena KMeans tidak punya method predict", why: "KMeans punya predict — cluster baru bisa ditetapkan dari centroid train tanpa fit ulang." },
            { text: "Karena silhouette hanya bisa dihitung di train", why: "Silhouette bisa dihitung di set mana pun — masalahnya bukan silhouette, melainkan leakage." },
          ],
        },
        {
          q: "Dari 6.636 nasabah default, 655 berada di kelompok flagged. Berapa persen default yang tertangkap?",
          options: [
            { text: "43,67 persen", why: "Itu default rate DI DALAM kelompok flagged (655 dari 1.500) — bukan persen default yang tertangkap." },
            { text: "5,00 persen", why: "Itu persen populasi yang ter-flag (1.500 dari 30.000) — bukan persen default yang tertangkap." },
            { text: "9,87 persen", why: "Benar: 655 / 6.636 = 0,0987 — hanya 9,87 persen default yang tertangkap; 90,13 persen (5.981) lolos.", correct: true },
            { text: "21,99 persen", why: "Itu mendekati base rate — bukan hasil bagi 655 / 6.636." },
          ],
        },
        {
          q: "Pseudo-labeling dengan ambang ≥0,95/≤0,05 menambah 212 pseudo-label — semuanya legit (99,06 persen benar). Apa yang terjadi pada PR-AUC di audit setelah retrain?",
          options: [
            { text: "Naik ke 0,60 karena model melihat 212 contoh baru", why: "Pseudo-label bukan contoh baru — itu keyakinan model sendiri yang ditulis ulang sebagai label; tidak ada kebenaran baru yang masuk." },
            { text: "Nyaris tidak bergerak: 0,4509 → 0,4500 (recall naik 0,1386 → 0,2470)", why: "Benar: recall naik karena model berani memprediksi lebih banyak positif (41 fraud tertangkap vs 23), tapi PR-AUC tidak bergerak — pseudo-label tidak menambah informasi baru.", correct: true },
            { text: "Turun ke 0,1755 karena pseudo-label memperkuat bias", why: "0,1755 adalah PR-AUC label propagation, bukan pseudo-labeling — dua metode yang berbeda." },
            { text: "Recall turun karena model menjadi lebih konservatif", why: "Recall justru naik (0,1386 → 0,2470) — model menjadi lebih berani memprediksi positif, bukan lebih konservatif." },
          ],
        },
        {
          q: "Label propagation pada graf akun-device mencapai precision 0,1143 (4 dari 35 prediksi positif) — di bawah base rate audit 0,166. Apa diagnosis yang paling tepat?",
          options: [
            { text: "Iterasinya kurang — 30 iterasi belum cukup untuk mengalirkan label", why: "PR-AUC tetap ~0,175 di iterasi 2, 3, 5, 10, dan 30 — jumlah iterasi bukan masalahnya." },
            { text: "Fraud di data ini feature-driven, bukan graph-clustered — propagasi menyebar label ke tetangga yang sebenarnya lancar (precision 0,1143: 4 dari 35 prediksi positif)", why: "Benar: skor ring memang lebih tinggi (0,2522 vs 0,1936), tapi recall@0,5 di subset ring 0 dari 13 — tetangga yang berbagi device belum tentu berbagi label fraud.", correct: true },
            { text: "Graf akun-device terlalu kecil — component terbesar hanya 1.990 dari 2.000 akun", why: "Component yang besar justru memudahkan aliran label; masalahnya bukan ukuran graf, melainkan label tidak mengalir antar tetangga." },
            { text: "Ambang 0,5 terlalu tinggi — di ambang 0,2 propagasi akan menang", why: "PR-AUC mengukur ranking di semua ambang; 0,1755 berarti ranking-nya sendiri yang buruk, bukan ambangnya." },
          ],
        },
      ],
      summary: [
        "Unsupervised belajar dari pola tanpa label: KMeans mengelompokkan yang mirip, Isolation Forest menandai yang aneh.",
        "KMeans k = 4, seed 42: silhouette 0,3969 (struktur lemah, Kaufman–Rousseeuw); cluster 0 risiko tinggi 0,6318 (n = 3.183), cluster 1 pembayar lunas 0,1630, cluster 2 mayoritas revolving 0,1781, cluster 3 artefak n = 9.",
        "Isolation Forest contamination 0,05: 1.500 ter-flag, default 0,4367 vs 0,2099 — menangkap 655 dari 6.636 default (9,87 persen); 5.981 (90,13 persen) lolos.",
        "Anomaly ≠ fraud; skor anomali bukan probabilitas terkalibrasi; default adalah proxy (horizon 1 bulan), bukan label fraud.",
        "Evaluasi tanpa label: silhouette + stabilitas + baca cluster lewat proxy; cluster n = 9 tidak diberi nama segmen.",
        "Validasi temporal: fit scaler + KMeans + Isolation Forest di train saja, terapkan ke periode berikut — UCI satu snapshot, OOT sungguhan tidak mungkin.",
        "Lab: KMeans dari nol konvergen dalam 1 iterasi (centroid 1,5833/1,5000 dan 8,5833/8,5000); anomaly scoring menandai titik 8 dan 9 (z 2,2431 dan 1,6678).",
        "Semi-supervised [ilustrasi]: baseline 150 label PR-AUC 0,4509; pseudo-labeling (212 pseudo-legit, 99,06 persen benar) menaikkan recall 0,1386 → 0,2470 tapi PR-AUC nyaris tidak bergerak (0,4500); label propagation PR-AUC 0,1755 — nyaris acak, karena fraud di sini feature-driven, bukan graph-clustered.",
        "Aturan semi-supervised: nilai selalu dengan label independen (audit 1.000 tidak pernah dipakai melatih); kalibrasi ambang pseudo-label (≥0,95 menghasilkan 0 pseudo-fraud); pseudo-label tidak menambah informasi baru — ia memakai ulang keyakinan model sendiri.",
      ],
      next: { label: "Lanjut: MLF-M3.2 — Network & Graph Features", href: "/v2/learn/mlf-m32-network-link-analysis" },
    },
  ],
};
