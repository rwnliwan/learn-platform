import type { V2Lesson } from "../lib/types";

// Data yang sama (juta Rp: 100, 104, 109, 115, 121) dengan dua sumbu berbeda.
const BIZ22_DUAL_SVG = `<svg viewBox="0 0 520 270" role="img" aria-label="Dua bagan batang dari data identik: sumbu dari nol terlihat datar, sumbu dari 90 terlihat melonjak.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="15" y1="50" x2="245" y2="50"/><line x1="15" y1="135" x2="245" y2="135"/><line x1="15" y1="220" x2="245" y2="220"/>
<line x1="275" y1="50" x2="505" y2="50"/><line x1="275" y1="135" x2="505" y2="135"/><line x1="275" y1="220" x2="505" y2="220"/>
</g>
<text x="130" y="30" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">Sumbu dari 0 \u2192 "naik tipis"</text>
<text x="390" y="30" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">Sumbu dari 90 \u2192 "melonjak"</text>
<g font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">
<text x="10" y="224" text-anchor="end">0</text><text x="10" y="139" text-anchor="end">70</text><text x="10" y="54" text-anchor="end">140</text>
<text x="270" y="224" text-anchor="end">90</text><text x="270" y="139" text-anchor="end">115</text><text x="270" y="54" text-anchor="end">140</text>
</g>
<g fill="var(--c1)">
<rect x="25" y="98.6" width="30" height="121.4" rx="3"/><rect x="68" y="93.7" width="30" height="126.3" rx="3"/><rect x="111" y="87.6" width="30" height="132.4" rx="3"/><rect x="154" y="80.4" width="30" height="139.6" rx="3"/><rect x="197" y="73.1" width="30" height="146.9" rx="3"/>
</g>
<g fill="var(--c4)">
<rect x="285" y="186.0" width="30" height="34.0" rx="3"/><rect x="328" y="172.4" width="30" height="47.6" rx="3"/><rect x="371" y="155.4" width="30" height="64.6" rx="3"/><rect x="414" y="135.0" width="30" height="85.0" rx="3"/><rect x="457" y="114.6" width="30" height="105.4" rx="3"/>
</g>
<g font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">
<text x="40" y="240">100</text><text x="83" y="240">104</text><text x="126" y="240">109</text><text x="169" y="240">115</text><text x="212" y="240">121</text>
<text x="300" y="240">100</text><text x="343" y="240">104</text><text x="386" y="240">109</text><text x="429" y="240">115</text><text x="472" y="240">121</text>
</g>
<text x="260" y="262" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Data IDENTIK (juta Rp): 100, 104, 109, 115, 121 \u2014 kesan berubah, data tidak.</text>
</svg>`;

export const biz22: V2Lesson = {
  slug: "biz22-teori-visualisasi",
  track: "Business Intelligence",
  module: "Insight & Komunikasi",
  title: "BI22 — Teori Visualisasi: Kenapa Bagan Bekerja (atau Menipu)",
  estMinutes: 70,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Bagan adalah antarmuka antara data dan otak manusia — dan seperti semua antarmuka, ia bisa membantu atau menipu. Lesson ini membedah kenapa beberapa bagan terbaca instan sementara yang lain menyesatkan, lalu memberi aturan praktis memilih dan mengaudit bagan.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan hierarki saluran visual (posisi > panjang > sudut > luas > warna) dan memakainya untuk memilih bagan; (2) memilih jenis bagan dari PERTANYAAN bisnis, bukan dari kebiasaan; (3) mendeteksi 4 kebohongan visual klasik dalam 10 detik (sumbu terpotong, luas menyesatkan, dual axis, cherry-picking rentang); (4) memilih skema warna yang tepat dan tidak mengeksklusi pembaca buta warna; (5) menulis judul bagan sebagai kesimpulan dan mengukur kejujuran bagan dengan faktor kebohongan.",
        "Rute: cerita (dua keputusan berlawanan dari data sama) → saluran visual & rumus faktor kebohongan → peta tanya-ke-bagan → lab menghitung faktor kebohongan → warna sebagai data → kepadatan & kejujuran → peta keputusan → mini-case audit dasbor → checkpoint.",
        "Satu bekal ringkas sebelum mulai: semua angka di lesson ini konsisten — penjualan 5 bulan 100, 104, 109, 115, 121 (juta Rp). Total kenaikan nyata: 21%. Ingat angka 21% ini — ia akan menjadi jangkar kejujuranmu.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Senin potong budget, Rabu tambah budget — data yang sama",
      prose: [
        "Senin pagi, PT Kopi Nusantara. Analis Budi menampilkan bagan batang penjualan 5 bulan ke direksi. Sumbu mulai dari 0 — batangnya tampak hampir rata. Kesimpulan Budi: \u201Cpenjualan datar, usulan: potong budget marketing 20%.\u201D Disetujui.",
        "Rabu sore, tim growth menampilkan data yang SAMA dengan sumbu 90\u2013130. Batang pertama kerdil, batang terakhir menjulang tiga kali lipat. Kesimpulan mereka: \u201Cpertumbuhan meledak, usulan: tambah budget marketing 30%.\u201D Hampir disetujui — sampai seseorang bertanya: \u201Cini data yang sama dengan Senin, kan?\u201D",
        "Twist-nya: angka di kedua bagan IDENTIK — 100, 104, 109, 115, 121. Kenaikan nyatanya 21%. Yang berubah hanya sumbu dan rentang. Satu bagan membisikkan \u201Ctidak ada apa-apa\u201D, satunya berteriak \u201Cdarurat peluang\u201D — dan keduanya \u201Cbenar\u201D secara teknis karena tidak ada angka yang dipalsukan.",
        "Di lesson ini kamu belajar: (1) kenapa otak membaca panjang batang sebagai kebenaran (hierarki saluran visual); (2) cara mengukur kebohongan bagan dengan satu angka; (3) cara memilih bagan dari pertanyaan; (4) warna dan kepadatan yang jujur. Tujuannya bukan melarang kreativitas — melainkan memastikan baganmu membantu keputusan, bukan memanipulasinya.",
      ],
      tasks: [],
    },
    {
      id: "saluran-visual",
      eyebrow: "Langkah 3 · Saluran visual",
      title: "Otakmu punya urutan baca: posisi > panjang > sudut > luas > warna",
      prose: [
        "Gagasan Cleveland & McGill, disampaikan sebagai prinsip praktik: tidak semua atribut visual dibaca otak dengan akurasi yang sama. Paling akurat: POSISI pada skala bersama (titik pada garis). Lalu PANJANG (batang), SUDUT (irisan pie), LUAS (lingkaran/gelembung), dan paling kabur: WARNA (intensitas/rona). Prinsipnya: data terpentingmu harus dikodekan dengan saluran paling akurat.",
        "Konsekuensinya konkret: tren 12 bulan paling jujur dibaca dari posisi titik pada garis, bukan dari luas lingkaran yang berubah-ubah. Perbandingan 7 cabang paling akurat dari panjang batang yang sejajar, bukan dari irisan pie 3D yang sudutnya terdistorsi perspektif. Kalau audiens harus \u201Cmengira-ngira\u201D, salurannya salah.",
        "Cara membaca gambar di bawah: dua bagan batang dari data IDENTIK. Kiri: sumbu 0\u2013140 — batang nyaris sama tinggi (kesan: datar). Kanan: sumbu 90\u2013140 — batang terakhir 3,1x batang pertama (kesan: melonjak). Interpretasi: yang berubah hanya jendela sumbu; kesan visualnya berubah dari \u201Cnaik tipis\u201D menjadi \u201Cmelonjak\u201D. Mata membaca panjang batang, bukan angka sumbu — itulah kenapa sumbu yang terpotong begitu kuat efeknya.",
        "Faktor kebohongan (gagasan Tufte) mengukurnya dalam satu angka: L = kesan_visual / perubahan_data_nyata. L \u2248 1 berarti jujur. Contoh: data naik 21% (121/100), tetapi kesan visualnya 3,1x (batang kanan) \u2192 L = 3,1/1,21 \u2248 2,56 — bagan itu membesar-besarkan 2,56 kali lipat. Di lab berikutnya kamu menghitungnya sendiri.",
        "\uD83D\uDCA1 Intuisi kunci: bagan tidak pernah \u201Cnetral\u201D — setiap pilihan (sumbu, skala, warna) adalah keputusan retorika. Pertanyaannya bukan \u201Capakah bagan ini cantik?\u201D melainkan \u201Ckesan apa yang ia tanamkan, dan apakah kesan itu setia pada data?\u201D",
      ],
      formula: String.raw`L = \frac{s_{visual}}{s_{data}} \qquad L \approx 1 \text{ = jujur}`,
      formulaNote:
        "s_visual = kesan perubahan yang ditangkap mata (mis. rasio tinggi batang terbesar vs terkecil). s_data = rasio perubahan data yang sebenarnya (nilai maks / nilai min). L = seberapa besar bagan membesar-besarkan (atau mengecilkan) kenyataan. Contoh: kesan 3,1x vs data 1,21x \u2192 L \u2248 2,56.",
      figure: {
        svg: BIZ22_DUAL_SVG,
        alt: "Dua bagan batang dari data identik: sumbu dari nol terlihat datar, sumbu dari 90 terlihat melonjak.",
        caption: "Data identik, kesan berlawanan. Mata membaca panjang batang, bukan angka sumbu — itulah kekuatan sumbu terpotong.",
      },
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: pie chart & 3D selalu oke untuk variasi",
        type: "pitfall",
        body: "Pie memakai SUDUT (peringkat 3) yang dibaca buruk, dan efek 3D mendistorsinya lebih jauh — irisan depan terlihat lebih besar dari yang belakang. Untuk 2\u20133 kategori masih bisa ditoleransi; untuk 7+ kategori, batang horizontal sejajar (PANJANG, peringkat 2) selalu menang dalam akurasi baca. Variasi visual yang menurunkan akurasi bukan gaya — itu pajak yang dibayar audiens.",
      },
      reference: "Saluran visual terakurat: posisi > panjang > sudut > luas > warna. L \u2248 1 = bagan jujur.",
    },
    {
      id: "tanya-dulu",
      eyebrow: "Langkah 4 · Memilih bagan",
      title: "Tanya dulu, bagan kemudian",
      prose: [
        "Kesalahan paling umum bukan bagan yang jelek — melainkan bagan yang menjawab pertanyaan yang salah. Mulailah dari kalimat tanya, bukan dari data yang ada. Lima pertanyaan bisnis menutupi hampir semua kebutuhan dasbor:",
        "PERBANDINGAN antar kategori (\u201Ccabang mana penjualannya tertinggi?\u201D) \u2192 batang vertikal/horizontal, sumbu dari 0. TREN sepanjang waktu (\u201Cbagaimana penjualan 12 bulan terakhir?\u201D) \u2192 garis, tunjukkan rentang penuh agar tidak cherry-picking. KOMPOSISI (\u201Cdari apa saja biaya ini tersusun?\u201D) \u2192 stacked bar atau 100% stacked; pie hanya untuk 2\u20133 potong. DISTRIBUSI (\u201Cbagaimana sebaran gaji karyawan?\u201D) \u2192 histogram — rata-rata tunggal menyembunyikan dua kelompok yang berbeda. HUBUNGAN (\u201Capakah diskon menaikkan volume?\u201D) \u2192 scatter plot, satu titik satu observasi.",
        "Dua larangan keras: (1) dual axis (dua sumbu Y berbeda) untuk \u201Cmembuktikan\u201D korelasi — dengan mengatur skala kedua sumbu, dua garis yang tak berhubungan bisa dibuat tampak bergerak bersama; (2) memotong rentang waktu untuk menyembunyikan tren buruk — cherry-picking periode adalah kebohongan paling sopan karena datanya \u201Cbenar\u201D.",
        "\uD83D\uDCA1 Intuisi kunci: kalau kamu tidak bisa menuliskan pertanyaan baganmu dalam satu kalimat, kamu belum siap memilih bagan. Tulis pertanyaannya dulu — pilihannya biasanya menjadi jelas sendiri.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: dual axis membuktikan dua hal bergerak bersama",
        type: "pitfall",
        body: "Dual axis tidak membuktikan apa-apa: skala sumbu kedua bisa diatur agar garis mana pun tampak selaras dengan garis mana pun. Korelasi dibuktikan dengan angka (koefisien korelasi), bukan dengan dua garis yang \u201Ckelihatan bareng\u201D. Kalau memang perlu dua ukuran, tampilkan dalam dua panel terpisah dengan sumbu yang sama-sama jujur.",
      },
      reference: "Perbandingan \u2192 batang \u00b7 tren \u2192 garis \u00b7 komposisi \u2192 stacked \u00b7 distribusi \u2192 histogram \u00b7 hubungan \u2192 scatter.",
    },
    {
      id: "lab-kebohongan",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung faktor kebohongan sumbu terpotong",
      prose: [
        "Data penjualan 5 bulan: 100, 104, 109, 115, 121 (juta Rp). Kenaikan nyata = 121/100 = 1,21 (21%). Tugasmu: untuk tiap potongan sumbu (0, 50, 80, 90), hitung kesan visual = (maks \u2212 basis)/(min \u2212 basis), lalu faktor kebohongan L = kesan / rasio_nyata. Cetak hasilnya.",
        "Perhatikan apa yang terjadi saat basis mendekati nilai minimum: kesan visual meledak (pembagi mengecil), padahal data tidak berubah. Inilah matematika di balik \u201Cmelonjak\u201D pada bagan kanan di gambar sebelumnya.",
        "Coba juga: ubah basis_uji menjadi [0, 95, 99] di kepalamu dulu, tebak L-nya, baru hitung. Pada basis berapa L melewati 5? Itulah titik di mana bagan berhenti \u201Cmenekankan\u201D dan mulai \u201Cberbohong\u201D.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rasio_nyata` = maks/min dari data" },
        { id: "t2", text: "Hitung `faktor`: dict basis \u2192 L = kesan/rasio_nyata" },
        { id: "t3", text: "Cetak `rasio_nyata` dan tiap baris `basis=...: L=...`" },
      ],
      expected: "rasio_nyata=1.21; L terbesar di basis=90 (2.56) — kesan 2,56x perubahan nyata",
      note: {
        title: "Sering salah",
        body: "Menghitung kesan sebagai (maks/min) \u2212 basis, atau mengurangkan basis SETELAH membagi. Urutannya: kurangkan basis dari tiap nilai DULU (itulah tinggi batang yang terlihat), baru bandingkan. Tinggi batang = nilai \u2212 basis, bukan nilai.",
      },
      hints: [
        "rasio_nyata = max(data) / min(data).",
        "kesan = (max(data) - b) / (min(data) - b); faktor[b] = kesan / rasio_nyata.",
        "Cetak dengan f-string: f\"basis={b}: L={faktor[b]:.2f}\".",
      ],
      code: {
        starter: `# Penjualan 5 bulan (juta Rp) — data tetap, JANGAN diubah
data = [100, 104, 109, 115, 121]
basis_uji = [0, 50, 80, 90]
# TULIS KODEMU: rasio_nyata = max/min; faktor[b] = kesan_visual / rasio_nyata
rasio_nyata = 0.0
faktor = {}
for b in basis_uji:
    faktor[b] = 0.0
print(f"rasio_nyata={rasio_nyata:.2f}")
for b in basis_uji:
    print(f"basis={b}: L={faktor[b]:.2f}")`,
        lockLines: 3,
        solution: `# Penjualan 5 bulan (juta Rp) — data tetap, JANGAN diubah
data = [100, 104, 109, 115, 121]
basis_uji = [0, 50, 80, 90]
# TULIS KODEMU: rasio_nyata = max/min; faktor[b] = kesan_visual / rasio_nyata
rasio_nyata = max(data) / min(data)
faktor = {}
for b in basis_uji:
    kesan = (max(data) - b) / (min(data) - b)
    faktor[b] = kesan / rasio_nyata
print(f"rasio_nyata={rasio_nyata:.2f}")
for b in basis_uji:
    print(f"basis={b}: L={faktor[b]:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rasio_nyata", value: 1.21, tol: 0.0001, label: "`rasio_nyata` = 1.21", msg: "max/min = 121/100." },
          { kind: "defined", task: "t2", name: "faktor", label: "`faktor` terdefinisi", msg: "Isi dict faktor untuk tiap basis." },
          { kind: "stdout_matches", task: "t2", pattern: "basis=80: L=1\\.69", label: "L di basis 80 = 1.69", msg: "(41/20)/1.21 \u2248 1.69." },
          { kind: "stdout_matches", task: "t3", pattern: "basis=90: L=2\\.56", label: "L di basis 90 = 2.56", msg: "(31/10)/1.21 \u2248 2.56." },
          { kind: "stdout_matches", task: "t3", pattern: "rasio_nyata=1\\.21", label: "Mencetak rasio_nyata", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Tinggi batang = nilai \u2212 basis. L = kesan_visual / rasio_nyata.",
    },
    {
      id: "warna",
      eyebrow: "Langkah 6 · Warna",
      title: "Warna adalah data — perlakukan seperti data",
      prose: [
        "Warna adalah saluran visual paling kabur — ia bagus untuk KATEGORI dan ARAH, buruk untuk NILAI presisi. Tiga skema, tiga kegunaan: SEKUENSIAL (satu rona, terang\u2192gelap) untuk besaran berurutan seperti penjualan per wilayah; DIVERGEN (dua rona bertemu di titik netral) untuk deviasi dari target — di atas/di bawah; KATEGORIKAL (rona berbeda) untuk kelompok tanpa urutan seperti segmen produk.",
        "Aturan kerasnya: jangan pernah memakai merah\u2013hijau sebagai SATU-SATUNYA pembeda. Sekitar 8% pria dan 0,5% wanita buta warna merah\u2013hijau — bagi mereka, dasbormu yang \u201Cjelas\u201D itu datar tak terbaca. Selalu pasangkan warna dengan pembeda kedua: label, simbol, atau pola.",
        "Uji 10 detik: ubah dasbormu menjadi grayscale (atau julingkan mata). Kalau maknanya hilang, warnamu bukan dekorasi — ia satu-satunya pembawa makna, dan itu rapuh. Warna yang baik memperkuat pesan yang sudah jelas dari posisi/panjang; warna yang buruk menyembunyikan pesan yang tidak ada.",
        "\uD83D\uDCA1 Intuisi kunci: tanyakan pada setiap warna di dasbormu: \u201Cdata apa yang kamu bawa?\u201D Kalau jawabannya \u201Csupaya cantik\u201D, hapus warnanya. Dekorasi yang mengaku sebagai data adalah kebohongan yang sopan.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: merah = buruk, hijau = baik, semua orang paham",
        type: "pitfall",
        body: "Tidak semua orang — dan bahkan yang bisa melihat warna pun bisa salah tafsir lintas budaya/konteks. Merah\u2013hijau tanpa label memaksa audiens menebak konvensimu. Tulis angkanya, beri labelnya; warna hanya penegas, bukan satu-satunya utusan.",
      },
      reference: "Sekuensial \u2192 besaran \u00b7 divergen \u2192 deviasi dari titik netral \u00b7 kategorikal \u2192 kelompok.",
    },
    {
      id: "padat-jujur",
      eyebrow: "Langkah 7 · Kepadatan",
      title: "Kepadatan & kejujuran: tinta untuk data, bukan dekorasi",
      prose: [
        "Gagasan data-ink ratio (Tufte): dari semua \u201Ctinta\u201D di baganmu, berapa persen yang benar-benar menyampaikan data? Gridline tebal, background gradasi, bayangan 3D, border ganda — semuanya tinta yang tidak bicara. Hapus yang tidak menambah informasi; yang tersisa adalah bagan yang lebih jujur DAN lebih mudah dibaca.",
        "Senjata kejujuran paling murah: judul bagan. Bukan label (\u201CGrafik Penjualan Q1\u2013Q2\u201D), melainkan kesimpulan (\u201CPenjualan naik 21% dalam 5 bulan, didorong segmen online\u201D). Judul-kesimpulan memaksa pembuatnya jujur duluan — sulit menulis kesimpulan palsu tanpa merasa bersalah — dan memberi audiens jangkar baca.",
        "Anotasi yang bekerja: lingkari titik yang penting, tulis angkanya, tulis artinya dalam bahasa bisnis. Satu anotasi yang tepat (\u201C85% penurunan dari dine-in\u201D) lebih kuat dari lima garis tren tanpa penjelasan. Aturannya: jika pembaca harus menghitung sendiri untuk memahami baganmu, baganmu belum selesai.",
        "\uD83D\uDCA1 Intuisi kunci: bagan yang baik itu seperti jendela bersih — kamu melihat pemandangan (data), bukan kacanya (desain). Kalau audiens memuji \u201Cbaganmu bagus\u201D tetapi tidak ingat angkanya, kacanya terlalu mencolok.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: bagan minimalis = bagan yang kosong informasi",
        type: "pitfall",
        body: "Minimalis bukan mengurangi data — melainkan mengurangi tinta yang bukan data. Menghapus gridline bukan menghilangkan informasi (posisinya tetap terbaca dari sumbu); menghapus anotasi justru menghilangkan informasi. Uji: hapus elemen, tanya \u201Capakah pesannya masih sama?\u201D Kalau ya, elemen itu dekorasi.",
      },
      reference: "Judul = kesimpulan, bukan label. Tinta untuk data, bukan dekorasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: bagan untuk tiap pertanyaan",
      prose: [
        "Skenario 1 \u2014 Perbandingan 7 cabang: \u2192 batang horizontal (nama cabang panjang), sumbu dari 0, urutkan menurun. Batang memakai PANJANG — saluran peringkat 2, akurat.",
        "Skenario 2 \u2014 Tren penjualan 12 bulan: \u2192 garis dengan titik, rentang waktu PENUH (jangan potong 3 bulan terakhir yang \u201Cbagus\u201D). Cherry-picking periode = kebohongan paling sopan.",
        "Skenario 3 \u2014 Komposisi biaya 4 pos: \u2192 stacked bar 100% (bukan pie 8 potong). Pembaca membandingkan PANJANG segmen, bukan sudut irisan.",
        "Skenario 4 \u2014 Sebaran gaji 500 karyawan: \u2192 histogram. Rata-rata tunggal menyembunyikan dua kelompok (junior vs senior) — distribusi menunjukkan bentuknya.",
        "Skenario 5 \u2014 Dasbor untuk direksi: \u2192 tiap bagan lolos uji grayscale + judul berupa kesimpulan + satu anotasi. Direksi membaca dalam 3 menit; bagan yang butuh penjelasan lisan adalah bagan yang gagal.",
        "Aturan praktis 10 detik sebelum baganmu terbit: (1) sumbu kuantitatif mulai dari 0? (2) judulnya kesimpulan, bukan label? (3) tiap warna membawa data? (4) lolos uji grayscale? (5) periode datanya penuh, tidak dicomot? Lima ya = terbit.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: audit dasbor \u2014 siapa yang jujur?",
      prose: [
        "Konteks: pangsa pasar tiga merek kopi — A 34%, B 33%, C 33%. Rani membuat batang dengan sumbu dari 0: tiga batang nyaris sama tinggi, judulnya \u201CPasar seimbang: selisih <1pp\u201D. Doni membuat batang dengan sumbu 30\u201335: batang A menjulang, judulnya \u201CMerek A unggul jauh dari pesaing\u201D. Direksi bingung: siapa yang benar?",
        "Pertanyaan: (1) hitung faktor kebohongan bagan Doni (kesan visual vs perubahan data nyata); (2) bagan siapa yang lebih jujur dan kenapa — pakai hierarki saluran visual; (3) bagaimana memperbaiki bagan Doni tanpa mengubah datanya?",
        "Pembahasan: (1) kesan visual Doni \u2248 (34\u221230)/(33\u221230) = 4/3 \u2248 1,33; perubahan nyata = 34/33 \u2248 1,03; L \u2248 1,33/1,03 \u2248 1,29 \u2014 bagan membesar-besarkan 29%. (2) Rani lebih jujur: sumbu dari 0 membuat PANJANG batang proporsional dengan data; Doni memakai sumbu terpotong sehingga perbedaan 1pp terlihat seperti jurang. (3) Perbaikan: kembalikan sumbu ke 0; kalau ingin menekankan selisih kecil, tambahkan anotasi angka (\u201CA +1pp vs B\u201D) dan biarkan pembaca menilai sendiri — penekanan lewat anotasi, bukan lewat distorsi sumbu.",
        "\uD83D\uDCA1 Intuisi kunci: \u201Cunggul jauh\u201D adalah klaim tentang BESARAN, dan besaran harus dibaca dari panjang yang proporsional. Kalau klaim besarmu butuh sumbu terpotong untuk terlihat, klaimnya tidak sebesar itu.",
      ],
      tasks: [],
    },
    {
      id: "small-multiples",
      eyebrow: "Tambahan · BZ5",
      title: "Small multiples: dua belas chart kecil mengalahkan satu chart besar",
      prose: [
        "Small multiples (juga disebut facet atau trellis) adalah satu chart yang dipecah menjadi banyak chart KECIL dengan format yang sama — satu per kategori — disusun dalam grid. Contoh: penjualan 12 gerai selama 12 bulan. Satu chart garis dengan 12 garis berwarna = spageti yang tidak bisa dibaca. Dua belas chart kecil (satu per gerai, masing-masing satu garis) = mata langsung melihat gerai mana yang naik, mana yang datar, mana yang jatuh — tanpa legenda, tanpa warna yang berebut perhatian.",
        "Tiga aturan yang membuatnya bekerja. Satu: SKALA SAMA — semua panel memakai sumbu Y yang sama; panel dengan skala berbeda menipu perbandingan (gerai kecil yang naik 10 persen terlihat sama dramatisnya dengan gerai besar yang naik 10 persen — padahal nilai absolutnya berbeda jauh; bila skala harus berbeda, tulis dengan huruf besar di tiap panel). Dua: FORMAT SAMA — judul, sumbu, dan anotasi yang identik; otak membandingkan BENTUK, bukan membaca ulang tiap panel. Tiga: URUTKAN DENGAN MAKNA — susun panel berdasarkan ukuran atau tren (terbesar dulu, atau yang paling memburuk dulu), bukan abjad; urutan adalah argumen.",
        "Kapan MEMAKAI: membandingkan tren antar kategori (gerai, produk, wilayah, segmen) yang jumlahnya 4–20. Kapan TIDAK memakai: kategori lebih dari 20 (grid menjadi perangko yang tidak terbaca — kelompokkan dulu), atau bila yang dibutuhkan justru perbandingan nilai eksak antar kategori pada satu titik waktu (pakai bar chart terurut). Small multiples menjawab 'bagaimana BENTUKNYA berubah', bukan 'berapa tepatnya'.",
        "Hubungan dengan hierarki saluran visual (langkah 3 lesson ini): small multiples memanfaatkan saluran terkuat — POSISI — secara berulang. Tiap panel adalah satu garis posisi terhadap waktu; otak manusia sangat cepat membandingkan bentuk garis. Inilah alasan ia terasa 'mudah dibaca': ia tidak meminta otak bekerja lebih keras, ia meminta otak melakukan hal yang sudah ia kuasai — mengenali pola.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Satu chart 12 garis lebih hemat tempat.” Hemat tempat, boros pemahaman. Dua belas garis dalam satu chart memaksa pembaca menghafal legenda warna; dua belas panel kecil membiarkan pembaca MEMBANDINGKAN bentuk secara langsung. Hematlah tempat di tempat lain — bukan di pemahaman.",
      },
      quiz: [
        {
          q: "Dua belas gerai, tren penjualan 12 bulan tiap gerai. Visualisasi yang paling mudah dibaca?",
          options: [
            { text: "Satu chart garis dengan 12 garis berwarna berbeda", why: "Salah: 12 garis = spageti; pembaca menghafal legenda, bukan membaca tren." },
            { text: "Small multiples: 12 panel kecil, satu per gerai, skala Y sama, diurutkan berdasarkan tren", why: "Benar: format sama + skala sama = otak membandingkan bentuk secara langsung.", correct: true },
            { text: "Satu pie chart dengan 12 irisan", why: "Salah: pie membandingkan porsi satu titik waktu, bukan tren 12 bulan." },
            { text: "Dua belas chart besar di dua belas halaman", why: "Salah: perbandingan antar halaman mustahil — panel harus berdampingan dalam satu layar." },
          ],
        },
      ],
      reference: "Small multiples = satu format, banyak panel, skala sama. Bandingkan bentuk, bukan legenda.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang teori visualisasi. Ingat: kesan visual harus setia pada data.",
      ],
      tasks: [],
      summary: [
        "Small multiples: satu format, banyak panel kecil, skala sama — otak membandingkan bentuk, bukan legenda.",
        "Saluran visual terakurat: posisi > panjang > sudut > luas > warna — data terpenting pakai saluran terakurat.",
        "Faktor kebohongan L = kesan_visual / perubahan_data_nyata; L \u2248 1 berarti jujur.",
        "Pilih bagan dari pertanyaan: perbandingan \u2192 batang, tren \u2192 garis, komposisi \u2192 stacked, distribusi \u2192 histogram, hubungan \u2192 scatter.",
        "Sumbu kuantitatif mulai dari 0; dual axis tidak membuktikan korelasi; jangan cherry-picking periode.",
        "Warna: sekuensial/divergen/kategorikal sesuai data; jangan andalkan merah\u2013hijau saja (buta warna).",
        "Judul bagan = kesimpulan; tinta untuk data, bukan dekorasi; tiap bagan lolos uji 10 detik.",
      ],
      next: { label: "BI23 — Python untuk Analis BI", href: "/v2/learn/biz23-python-analis-bi" },
      quiz: [
        {
          q: "Menurut hierarki saluran visual, cara PALING akurat mengkodekan nilai adalah…",
          options: [
            { text: "Warna yang intens", why: "Warna adalah saluran paling kabur — bagus untuk kategori, buruk untuk nilai presisi." },
            { text: "Luas lingkaran", why: "Luas dibaca buruk (peringkat 4); mata sulit membandingkan area secara akurat." },
            { text: "Posisi pada skala bersama", why: "Tepat: posisi adalah saluran peringkat 1 — itulah kenapa scatter plot dan garis begitu mudah dibaca.", correct: true },
            { text: "Sudut irisan pie 3D", why: "Sudut peringkat 3, dan efek 3D mendistorsinya lebih jauh." },
          ],
        },
        {
          q: "Dua bagan dari data IDENTIK memberi kesan berlawanan. Pemeriksaan 10 detik pertama?",
          options: [
            { text: "Warnanya berbeda", why: "Warna memengaruhi mood, tetapi jarang membalik kesimpulan sendirian." },
            { text: "Sumbu dan rentangnya berbeda (terpotong atau tidak)", why: "Tepat: sumbu terpotong mengubah panjang batang yang dibaca mata — sumber kebohongan paling umum.", correct: true },
            { text: "Font judulnya berbeda", why: "Font tidak mengubah kesan kuantitatif." },
            { text: "Datanya pasti ada yang salah input", why: "Jangan berasumsi dulu — datanya bisa identik dan tetap menyesatkan lewat sumbu." },
          ],
        },
        {
          q: "Membandingkan penjualan 7 cabang. Pilihan paling jujur?",
          options: [
            { text: "Pie chart 3D tujuh potong", why: "Sudut 7 potong + distorsi 3D = akurasi baca terburuk." },
            { text: "Batang horizontal, sumbu dari 0, diurutkan menurun", why: "Tepat: PANJANG (peringkat 2) proporsional dengan data, sumbu jujur.", correct: true },
            { text: "Batang vertikal, sumbu 80\u2013100 agar bedanya terlihat", why: "Itu sumbu terpotong — L-nya meledak seperti di lab." },
            { text: "Lingkaran dengan luas proporsional", why: "Luas dibaca buruk; 7 lingkaran tidak bisa dibandingkan akurat." },
          ],
        },
        {
          q: "Menampilkan deviasi penjualan tiap cabang dari target (di atas/di bawah). Skema warna yang tepat?",
          options: [
            { text: "Sekuensial terang\u2192gelap satu rona", why: "Sekuensial untuk besaran berurutan, bukan untuk deviasi dua arah." },
            { text: "Diveren dua rona dengan titik netral di target", why: "Tepat: divergen untuk deviasi — di atas target satu rona, di bawah rona lain, netral di tengah.", correct: true },
            { text: "Kategorikal tujuh rona berbeda", why: "Kategorikal untuk kelompok tanpa urutan, bukan untuk deviasi." },
            { text: "Merah untuk buruk, hijau untuk baik, tanpa label", why: "Mengeksklusi pembaca buta warna dan memaksa menebak konvensi." },
          ],
        },
        {
          q: "Judul bagan terbaik untuk tren penjualan 100\u2192121?",
          options: [
            { text: "\u201CGrafik Penjualan Q1\u2013Q2\u201D", why: "Itu label, bukan kesimpulan — pembaca tetap harus menebak pesannya." },
            { text: "\u201CPenjualan naik 21% dalam 5 bulan\u201D", why: "Tepat: judul = kesimpulan; memaksa pembuatnya jujur dan memberi jangkar baca.", correct: true },
            { text: "\u201CAnalisis Time Series Penjualan\u201D", why: "Jargon metodologi bukan pesan bisnis." },
            { text: "\u201CData Penjualan (juta Rp)\u201D", why: "Deskripsi sumbu, bukan kesimpulan." },
          ],
        },
        {
          q: "Faktor kebohongan L = 2,56 pada sebuah bagan artinya…",
          options: [
            { text: "Datanya 2,56x lebih besar dari yang ditampilkan", why: "Terbalik: L mengukur kesan, bukan data." },
            { text: "Kesan visualnya membesar-besarkan perubahan nyata sebesar 2,56 kali lipat", why: "Tepat: L = kesan/perubahan nyata — bagan berteriak 2,56x lebih keras dari data.", correct: true },
            { text: "Bagannya 2,56x lebih cantik dari rata-rata", why: "L tidak mengukur estetika." },
            { text: "Ada 2,56% error pada data", why: "L bukan ukuran error data — melainkan distorsi presentasi." },
          ],
        },
      ],
    },
  ],
};
