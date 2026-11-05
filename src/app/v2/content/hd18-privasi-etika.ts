import type { V2Lesson } from "../lib/types";

export const hd18: V2Lesson = {
  slug: "hd18-privasi-etika",
  track: "Health Data Science",
  module: "Etika, Pelaporan & Capstone",
  title: "HD18 Privasi & Etika: Rahasia Pasien di Era Data",
  estMinutes: 50,
  steps: [
    {
      id: "gubernur-sweeney",
      eyebrow: "Langkah 1 · Re-identifikasi",
      title: "Gubernur yang teridentifikasi tanpa nama",
      prose: [
        "1990-an, Massachusetts merilis data klaim kesehatan yang “dianonimkan” (nama dihapus). Peneliti Latanya Sweeney membeli data pemilih seharga $20, lalu mencocokkan kode pos + tanggal lahir + jenis kelamin — dan menemukan rekam medis Gubernur, termasuk diagnosis dan resepnya. Tanpa nama. Hanya tiga kolom “non-identitas”.",
        "Tiga kolom yang terlihat tidak berbahaya mengidentifikasi 87% populasi AS. Di Indonesia, kombinasi kecamatan + tanggal lahir + diagnosis langka sama mematikannya. Pelajaran paling pahit privasi data: “tidak ada nama” ≠ “tidak bisa dikenali”. Identitas tidak tinggal di satu kolom; ia tinggal di kombinasi kolom.",
        "Kepercayaan publik adalah infrastruktur yang paling mahal untuk dibangun ulang. Setiap analis yang merilis “data anonim” tanpa menguji re-identifikasi sedang bermain rolet dengan privasi ribuan orang — dan Sweeney menunjukkan pelurunya selalu ada.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira “data sudah anonim sehingga bebas dipakai untuk apa saja”. “Anonim” tanpa evaluasi sisa risiko adalah klaim kosong. Anonimitas adalah spektrum + konteks: data yang anonim untuk publikasi agregat belum tentu anonim untuk pihak yang punya data pembanding.",
        type: "pitfall",
      },
      reference: "Quasi-identifier dalam kombinasi = identifier.",
    },
    {
      id: "k-anonymity",
      eyebrow: "Langkah 2 · k-anonymity",
      title: "Menyamar di kerumunan",
      prose: [
        "k-anonymity: tiap kombinasi quasi-identifier (umur, wilayah, tanggal) dimiliki minimal k orang. k=5: penyerang yang tahu umur + wilayah + diagnosis hanya bisa mempersempit ke 5 orang, bukan 1. l-diversity menutup celahnya: bila kelima-limanya HIV-positif, anonimitasmu semu — tiap kelompok-k juga harus beragam nilai sensitifnya.",
        "Contoh generalisasi: data (35 th, Kec. A, TB), (35, Kec. A, DBD), (36, Kec. A, TB). Pola (35, Kec.A) hanya 2 orang < k=3 → generalisasi umur 35–36 menjadi rentang “35–39”. Kini pola (35–39, Kec.A) = 3 orang. Harganya: presisi umur hilang — inilah trade-off abadi privasi-utilitas.",
        "Mini-case: Dinkes ingin dashboard publik kasus HIV per kecamatan per bulan. Di kecamatan kecil ada bulan dengan 1–2 kasus. Tim IT berkata “nama tidak ditampilkan, jadi aman.” Risiko: sel kecil + kecamatan + bulan = re-identifikasi mudah bagi warga lokal — stigma HIV membuat dampaknya devastating. Solusi 3 lapis: (1) supresi sel kecil (tampilkan “<5”); (2) agregasi ke level kabupaten untuk publik, kecamatan hanya untuk petugas berizin; (3) noise differential privacy pada count publik. Transparansi tanpa proteksi = membahayakan yang paling rentan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira k-anonymity adalah jaminan. Ia mitigasi, bukan jaminan: data yang “aman” hari ini bisa tidak aman besok karena data pembanding baru muncul (bocoran lain, media sosial). De-identifikasi adalah proses berkelanjutan, bukan peristiwa sekali jalan. Untuk jaminan matematis, lihat differential privacy.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "k-anonymity = 5 artinya…",
          options: [
            { text: "Tiap kombinasi quasi-identifier dimiliki minimal 5 orang", why: "Benar: bersembunyi di kerumunan minimal 5. l-diversity menutup celah kerumunan yang homogen.", correct: true },
            { text: "5 kolom dihapus", why: "Bukan jumlah kolom — melainkan ukuran kerumunan minimal per kombinasi." },
            { text: "5% data dibuang", why: "Tidak ada angka 5% di sini; k=5 soal jumlah orang, bukan persen." },
            { text: "5 lapis enkripsi", why: "k-anonymity bukan enkripsi — ia generalisasi/supresi." },
          ],
        },
        {
          q: "Dashboard publik HIV per kecamatan menampilkan sel “2 kasus” di satu kecamatan kecil. Tindakanmu?",
          options: [
            { text: "Supresi sel kecil (<5) + agregasi ke kabupaten untuk publik", why: "Benar: sel 1–2 kasus + kecamatan + bulan = re-identifikasi mudah bagi warga lokal. Granularitas adalah hak akses.", correct: true },
            { text: "Biarkan — nama tidak ditampilkan jadi aman", why: "Itulah argumen yang salah: quasi-identifier + pengetahuan lokal sudah cukup mengidentifikasi." },
            { text: "Hapus dashboardnya total", why: "Terlalu ekstrem: agregasi kasar + supresi tetap memberi transparansi yang aman." },
            { text: "Tampilkan nama sekalian agar transparan", why: "Itu pelanggaran privasi yang justru memperparah — bukan solusi." },
          ],
        },
      ],
      reference: "Sel kecil (<5) = bahaya. Supresi, agregasi, atau noise.",
    },
    {
      id: "differential-privacy",
      eyebrow: "Langkah 3 · Differential privacy",
      title: "Privasi sebagai anggaran matematika",
      prose: [
        "Differential privacy (DP): jaminan bahwa hasil analisis hampir sama baik dengan maupun tanpa satu orang dalam data — dicapai dengan menambah noise terkalibrasi (skala 1/epsilon). Epsilon kecil = privasi kuat, utilitas turun. Contoh: kasus DBD sebenarnya 1.234; sensitivitas query “count” = 1; noise Laplace skala 1/ε dengan ε=0,5 → noise ~±2 → rilis 1.236 (atau 1.232 — acak). Untuk agregat besar noise tak berarti; untuk sel kecil (<10) noise mendominasi — itulah proteksinya bekerja.",
        "Berbeda dengan k-anonymity, DP tahan terhadap informasi latar penyerang apa pun — jaminan matematis, bukan harapan. Tapi DP adalah anggaran, bukan saklar: tiap query menghabiskan sebagian. Teorema komposisi: 20 tabel @ ε=1 → total ε=20 (bocor!). Untuk total ε ≤ 2 per tahun, tiap tabel hanya dapat ε=0,1. Inilah mengapa “kami pakai DP” tanpa pembukuan = omong kosong: 100 query @ ε=1 sama bocornya dengan tanpa proteksi.",
        "Setiap kali vendor mengklaim “data kami differential-private”, tanyakan dua angka: ε-nya berapa, dan total komposisinya berapa. Tidak bisa jawab = tidak pakai DP.",
      ],
      formula: String.raw`\Pr[M(D) \in S] \le e^{\varepsilon} \cdot \Pr[M(D') \in S]`,
      formulaNote: "D dan D' beda tepat satu orang; ε kecil = kehadiranmu hampir tak terdeteksi.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira epsilon besar berarti privasi kuat. Terbalik: epsilon kecil = noise besar = privasi kuat. Aturan praktis literatur: ε 0,1–1 per query = kuat; ε > 10 = lemah, hampir tanpa proteksi.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Keunggulan differential privacy atas k-anonymity?",
          options: [
            { text: "Jaminan matematis yang tahan informasi latar penyerang apa pun", why: "Benar: k-anonymity = harapan (bisa jebol dengan info baru); DP = bukti.", correct: true },
            { text: "Lebih mudah", why: "DP justru lebih sulit: butuh kalibrasi noise dan pembukuan anggaran." },
            { text: "Tanpa noise", why: "DP bekerja justru dengan menambah noise terkalibrasi." },
            { text: "Gratis", why: "Harganya adalah utilitas: noise menurunkan presisi, terutama sel kecil." },
          ],
        },
      ],
      reference: "Privasi = akuntansi. Anggaran habis = tidak ada rilis lagi.",
    },
    {
      id: "tata-kelola",
      eyebrow: "Langkah 4 · Tata kelola",
      title: "Federated learning dan UU PDP",
      prose: [
        "Federated learning: model dilatih di tiap RS (data tidak pindah); hanya update model yang dikirim ke server pusat. Ibarat ujian nasional tanpa mengumpulkan lembar jawaban: tiap sekolah menilai sendiri, hanya nilai rata-rata yang dikirim ke pusat. Tapi “data tidak pindah” ≠ “privasi terjamin” — update model bisa membocorkan data (model inversion attack). Kombinasikan dengan DP pada update + agregasi aman.",
        "Dan federated learning tetap butuh persetujuan etik: data dipakai untuk riset = butuh persetujuan etik dan dasar hukum, walau tidak pindah server. Arsitektur teknis tidak menggantikan tata kelola.",
        "Checklist tata kelola setiap proyek data pasien: (1) persetujuan komite etik; (2) dasar hukum UU PDP — UU No. 27/2022 mengkategorikan data kesehatan sebagai data pribadi spesifik (pelanggaran berlapis pidana): persetujuan eksplisit, hak hapus, keamanan; (3) DUA — siapa akses, untuk apa, berapa lama, larangan re-identifikasi; (4) minimisasi — minta kolom yang dibutuhkan saja (kolom yang tidak ada = kolom yang tidak bisa bocor); (5) segregasi peran — data engineer melihat teridentifikasi, analis hanya de-id; (6) rencana publikasi agregat aman. Uji terakhir setiap keputusan: “beranikah saya menjelaskan ini ke pasiennya, tatap muka?”",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Keberanian menolak permintaan “data mentahnya saja” adalah skill etik terpenting — dan tersulit, karena penolakanmu melawan atasan yang berkuasa. Tapi sekali kepercayaan publik hilang, butuh dekade membangun ulang. Dokumentasikan keputusan privasi seperti keputusan metode: apa risikonya, apa mitigasinya, siapa menyetujui.",
        type: "risk",
      },
      reference: "Tata kelola dulu, analisis kemudian. Selalu — tanpa kecuali.",
    },
    {
      id: "lab-kanonymity",
      eyebrow: "Langkah 5 · Lab",
      title: "Uji k-anonymity datasetmu",
      prose: [
        "Teori k-anonymity mudah dihafal, sulit dirasakan — sampai kamu menghitungnya sendiri. Dataset sintetik 12 pasien dengan quasi-identifier (kelompok umur, kecamatan); diagnosis adalah atribut sensitif. Tugasmu: hitung ukuran kelas ekuivalensi terkecil (k aktual) untuk dua versi dataset — sebelum dan sesudah satu pasien langka (70–74 th, Kec.A, HIV) ditambahkan.",
        "Perhatikan: satu baris langka meruntuhkan k dari 3 menjadi 1 — dan di dunia nyata, “satu baris langka” adalah pasien dengan diagnosis langka di kecamatan kecil, persis kasus dashboard HIV di lesson ini.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `k_min_1` (dataset awal, 12 pasien)" },
        { id: "t2", text: "Hitung `k_min_2` dan `lolos_k3` (“ya”/“tidak”) setelah 1 pasien langka ditambah" },
      ],
      expected: "k_min_1=3 k_min_2=1 lolos_k3=tidak",
      note: {
        title: "Sering salah",
        body: "Mengira k-anonymity dihitung dari jumlah baris total. Bukan — ia dihitung dari kelas ekuivalensi TERKECIL. Dataset sejuta baris dengan satu kombinasi unik tetap memiliki k=1, dan satu itulah yang dieksploitasi penyerang.",
        type: "pitfall",
      },
      hints: [
        "Kelas ekuivalensi = kelompok baris dengan (umur, kecamatan) yang sama. Pakai Counter.",
        "k aktual = ukuran kelas terkecil: min() dari semua hitungan.",
        "Syarat k=3: kelas terkecil ≥ 3. Setelah pasien langka masuk, ada kelas berukuran 1.",
      ],
      code: {
        starter: `# (umur, kecamatan, diagnosis); d2 = d1 + 1 pasien langka
from collections import Counter
d1 = [("35-39","Kec.A","TB"),("35-39","Kec.A","TB"),("35-39","Kec.A","DBD"),("40-44","Kec.A","TB"),("40-44","Kec.A","DBD"),("40-44","Kec.A","HIV"),("35-39","Kec.B","TB"),("35-39","Kec.B","DBD"),("35-39","Kec.B","HIV"),("40-44","Kec.B","TB"),("40-44","Kec.B","TB"),("40-44","Kec.B","DBD")]
d2 = d1 + [("70-74","Kec.A","HIV")]
# TULIS KODEMU: k_min_1, k_min_2, lolos_k3
k_min_1 = 
k_min_2 = 
lolos_k3 = 
print(f"k_min_1={k_min_1} k_min_2={k_min_2} lolos_k3={lolos_k3}")`,
        lockLines: 3,
        solution: `# (umur, kecamatan, diagnosis); d2 = d1 + 1 pasien langka
from collections import Counter
d1 = [("35-39","Kec.A","TB"),("35-39","Kec.A","TB"),("35-39","Kec.A","DBD"),("40-44","Kec.A","TB"),("40-44","Kec.A","DBD"),("40-44","Kec.A","HIV"),("35-39","Kec.B","TB"),("35-39","Kec.B","DBD"),("35-39","Kec.B","HIV"),("40-44","Kec.B","TB"),("40-44","Kec.B","TB"),("40-44","Kec.B","DBD")]
d2 = d1 + [("70-74","Kec.A","HIV")]
# TULIS KODEMU: k_min_1, k_min_2, lolos_k3
def k_aktual(data):
    c = Counter((u, k) for u, k, _ in data)
    return min(c.values())
k_min_1 = k_aktual(d1)
k_min_2 = k_aktual(d2)
lolos_k3 = "ya" if k_min_2 >= 3 else "tidak"
print(f"k_min_1={k_min_1} k_min_2={k_min_2} lolos_k3={lolos_k3}")`,
        checks: [
          { kind: "equal", task: "t1", name: "k_min_1", value: 3, tol: 1e-9, label: "`k_min_1` seharusnya 3", msg: "Empat kelas ekuivalensi @3 pasien — dataset awal lolos k=3." },
          { kind: "equal", task: "t2", name: "k_min_2", value: 1, tol: 1e-9, label: "`k_min_2` seharusnya 1", msg: "Satu pasien langka = satu kelas berukuran 1. k runtuh." },
          { kind: "contains", task: "t2", name: "lolos_k3", value: "tidak", label: "`lolos_k3` seharusnya “tidak”", msg: "k=1 < 3 — dataset versi 2 tidak boleh dirilis apa adanya." },
          { kind: "stdout_matches", task: "t2", pattern: "k_min_1=3 k_min_2=1 lolos_k3=tidak", label: "`print` menampilkan hasil uji", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Dataset 1 juta baris lolos k=5, kecuali satu kombinasi (kecamatan kecil + diagnosis langka) yang hanya 1 baris. Statusnya?",
          options: [
            { text: "Gagal — k aktual = 1, satu baris itu bisa diidentifikasi", why: "Benar: k dihitung dari kelas terkecil. Satu outlier meruntuhkan seluruh jaminan.", correct: true },
            { text: "Lolos — 99,9999% baris aman", why: "Penyerang hanya butuh satu target. k-anonymity tidak mengenal “hampir lolos”." },
            { text: "Lolos bila baris itu dihapus diam-diam", why: "Menghapus tanpa catat = mengubah data diam-diam; dokumentasikan suppressi-nya." },
            { text: "Tidak masalah karena nama sudah dihapus", why: "Itulah pelajaran Sweeney: nama tidak diperlukan untuk re-identifikasi." },
          ],
        },
      ],
      reference: "k = ukuran kelas TERKECIL. Satu outlier = seluruh dataset gagal.",
    },
    {
      id: "consent-tiers",
      eyebrow: "Langkah 6 · Consent",
      title: "Tingkatan izin dan etika interoperabilitas",
      prose: [
        "Menghapus nama tidak sama dengan mendapat izin. Untuk data kesehatan, etik mengenal tingkatan consent: (a) specific consent — izin untuk satu studi spesifik; (b) broad consent — izin untuk riset kesehatan masa depan dalam batas yang dijelaskan; (c) tiered consent — pasien memilih kategori (boleh untuk riset kanker, tidak untuk riset genetik komersial); (d) dynamic consent — izin digital yang bisa diubah kapan pun via aplikasi. Makin fleksibel, makin mahal operasionalnya — dan makin tinggi kepercayaan yang didapat.",
        "Masalahnya: data yang dikumpulkan untuk PELAYANAN (EHR, klaim) dipakai ulang untuk RISET — secondary use. Pasien yang setuju dirawat tidak otomatis setuju datanya melatih model AI perusahaan swasta. UU PDP Indonesia (UU No. 27/2022) mengkategorikan data kesehatan sebagai data pribadi spesifik: pemrosesan butuh dasar hukum yang eksplisit, dan hak pasien (akses, hapus, tarik persetujuan) tetap berlaku. “Data sudah anonim” bukan kartu bebas — apalagi setelah lesson ini kamu tahu anonimisasi bisa dibalik.",
        "Konteks SATUSEHAT: interoperabilitas nasional berarti data pasien mengalir antar-faskes — manfaatnya besar (riwayat lengkap saat rujukan), risikonya juga: sekali terhubung, siapa boleh query apa? Etika interoperabilitas menuntut purpose limitation (data rujukan tidak otomatis boleh untuk riset), audit trail (setiap akses tercatat dan bisa diaudit pasien), dan data minimization (kirim yang diperlukan saja — rujukan jantung tidak butuh riwayat psikiatri).",
        "Posisikan dirimu sebagai data fiduciary: seperti dokter punya kewajiban fidusia ke pasien, analis memegang kepercayaan yang sama atas data. Tiga uji sebelum memakai data orang: (1) izin — adakah dasar consent atau hukum yang mencakup pemakaian INI? (2) ekspektasi — apakah pasien akan terkejut bila tahu datanya dipakai begini? (3) reversibilitas — bila bocor, bisakah kerusakannya diperbaiki? Gagal satu uji = jangan lanjut.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tes koran, kalimat ke ibu, rem dipasang duluan",
        body: "Sebelum merilis atau memakai ulang data pasien, lakukan tes kejutan koran: bayangkan metodemu menjadi headline besok pagi — “RS X datanya bisa diidentifikasi ulang” atau “2,1 juta rekam medis dipakai tanpa izin”. Jika membayangkannya saja membuat perutmu mulas, jangan lakukan — instingmu mendeteksi masalah yang belum tertangkap checklist. Heuristik kedua: minta izin seperti kamu menjelaskannya ke ibumu sendiri. Ucapkan pemakaian data itu dalam satu kalimat sederhana kepada orang yang datanya dipakai; bila kalimatnya terdengar licik diucapkan keras-keras (“kami memakai data ibumu untuk melatih model yang kami jual”), consent-mu tidak cukup jelas. Heuristik ketiga: privasi itu seperti rem — nilainya baru terasa saat dibutuhkan, dan memasangnya setelah kecelakaan selalu terlambat. Anggarkan waktu de-identifikasi di awal proyek, bukan sebagai “nanti saja”. Heuristik keempat: konsultasikan komite etik SEBELUM data bergerak — pertanyaan yang diajukan di awal tidak dipungut biaya; pertanyaan yang diajukan setelah rilis dibayar dengan kepercayaan. Empat kebiasaan ini — tes koran, kalimat ke ibu, rem dipasang duluan, etik sebelum data bergerak — menjaga analis tetap di sisi yang benar bahkan ketika regulasi belum mengejar.",
      },
      quiz: [
        {
          q: "UU PDP (UU No. 27/2022) mengkategorikan data kesehatan sebagai…",
          options: [
            { text: "Data pribadi spesifik — butuh dasar hukum eksplisit", why: "Benar: kategori spesifik = perlindungan lebih tinggi; consent umum tidak cukup.", correct: true },
            { text: "Data publik bila sudah anonim", why: "Anonimisasi bisa dibalik (Sweeney); status “anonim” bukan kartu bebas." },
            { text: "Data biasa seperti data belanja", why: "Kesehatan = spesifik, bukan data umum." },
            { text: "Milik rumah sakit sepenuhnya", why: "Hak pasien (akses, hapus, tarik persetujuan) tetap berlaku." },
          ],
        },
      ],
      reference: "Tiga uji fidusia: izin mencakup? pasien terkejut? bisa dibalikkan?",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: berbagi data tanpa mengkhianati pasien",
      prose: [
        "Lima situasi keputusan yang dihadapi komite etik, DPO, dan analis setiap kali data pasien hendak keluar dari dinding RS:",
        "Skenario 1 — “Datanya sudah dianonimkan — aman dibagikan?” → Belum tentu: hapus nama dan NIK tidak cukup. Uji kombinasi quasi-identifier (tanggal lahir lengkap + kecamatan + tanggal MRS) terhadap risiko re-identifikasi — Sweeney menunjukkan tiga kolom “sepele” bisa menunjuk satu orang. Terapkan k-anonymity (k≥5) dan uji dengan serangan re-identifikasi sungguhan, bukan keyakinan.",
        "Skenario 2 — “Butuh jaminan privasi yang matematis, bukan prosedural?” → Differential privacy: tambahkan noise terkalibrasi dengan budget ε yang disepakati. Cocok untuk statistik agregat dan query berulang; untuk analisis individual-level, pahami trade-off utilitasnya sebelum berjanji.",
        "Skenario 3 — “Consent pasien mencakup pemakaian ini?” → Baca tiers-nya: consent untuk PELAYANAN ≠ broad consent untuk riset ≠ consent untuk riset KOMERSIAL. Formulir pendaftaran yang hanya menyebut “data dipakai untuk pelayanan” tidak mengizinkan penjualan 2,1 juta record ke startup — tanpa cakupan yang sah, jawabannya tidak, apa pun nilai risetnya (UU PDP).",
        "Skenario 4 — “Risetnya penting, tapi data tak boleh keluar?” → Bertingkat sesuai sensitivitas: synthetic data untuk fase eksplorasi → federated learning (model yang dikirim ke data, bukan sebaliknya) untuk training → akses data riil hanya di enclave aman dengan perjanjian larangan re-identifikasi. Privasi dan riset bukan zero-sum bila arsitekturnya benar.",
        "Skenario 5 — “Syarat kontrak dengan pihak ketiga?” → Tulis lima klausul: larangan re-identifikasi eksplisit + hak audit, data minimization (kolom yang perlu saja), hak tarik data bila pasien menarik consent, dan pembagian manfaat (model hasil tersedia untuk RS dengan harga wajar). Ingat: model ML bisa menghafal data training (membership inference) — “turunan model” juga adalah data.",
        "Aturan praktis 10 detik: bagikan → uji re-identifikasi dulu → butuh jaminan matematis → differential privacy → cek tiers consent → arsitektur bertingkat (sintetik → federasi → enclave) → kontrak = larangan + audit + minimization + tarik + manfaat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira “nama sudah dihapus” = anonim — padahal tanggal lahir + kecamatan + tanggal MRS cukup untuk re-identifikasi. Dan mengira “demi riset” adalah argumen etik — padahal ia baru awal dari pertanyaan etik. Satu demonstrasi re-identifikasi oleh peneliti independen cukup untuk memicu penarikan consent massal.",
        type: "pitfall",
      },
      reference: "“Demi riset” = awal pertanyaan etik, bukan jawabannya.",
    },
    {
      id: "minicase-satusehat",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case 1: Riset sekunder 2,1 juta record senilai Rp450 juta",
      prose: [
        "Sebuah startup AI menawarkan Rp450 juta ke RSUD untuk “riset sekunder” 2,1 juta record pasien (2020–2025) guna melatih model prediksi sepsis. Data “sudah dianonimkan” (nama dan NIK dihapus). Direktur tergiur; komite etik ragu. Kamu diminta menilai sebelum MoU ditandatangani.",
        "Temuanmu: (a) quasi-identifier tersisa — tanggal lahir lengkap + kecamatan + tanggal MRS — kombinasi berisiko re-identifikasi (ingat Sweeney di lesson ini); (b) consent — formulir pendaftaran RS hanya menyebut “data dipakai untuk pelayanan”, tidak ada broad consent untuk riset komersial; (c) kontrak — startup boleh “menggunakan turunan model untuk tujuan komersial”, padahal model ML bisa menghafal data training (membership inference attack); (d) manfaat — model sepsis memang dibutuhkan: mortalitas sepsis di RS ini 32%.",
        "Pertanyaan: (1) bolehkah data diberikan dalam bentuk ini? (2) alternatif apa yang melindungi pasien tapi tidak membunuh riset? (3) syarat kontrak apa yang kamu tulis?",
        "Pembahasan: (1) Tidak — consent tidak mencakup pemakaian ini dan risiko re-identifikasi belum diuji. (2) Opsi bertingkat: mulai dari federated learning (model yang dikirim ke data, bukan sebaliknya) atau synthetic data untuk fase eksplorasi; akses data riil hanya di enclave aman dengan k≥5 + uji re-identifikasi + perjanjian larangan re-identifikasi. (3) Syarat kontrak: larangan re-identifikasi eksplisit + hak audit, data minimization (kolom yang perlu saja), hak tarik data bila pasien menarik consent, dan pembagian manfaat (model hasil wajib tersedia untuk RS dengan harga wajar). Pelajaran: “demi riset” bukan argumen etik — ia adalah awal dari pertanyaan etik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Menandatangani MoU tanpa uji re-identifikasi dan tanpa broad consent berarti RS menanggung risiko hukum UU PDP sekaligus risiko kepercayaan: satu demonstrasi re-identifikasi oleh peneliti independen cukup untuk membuat pasien menarik consent massal — dan mematikan seluruh program riset RS bertahun-tahun.",
        type: "risk",
      },
      reference: "“Demi riset” = awal pertanyaan etik, bukan jawabannya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Quasi-identifier dalam kombinasi = identifier (pelajaran Sweeney).",
        "k-anonymity: kerumunan minimal k; l-diversity: kerumunan beragam.",
        "Differential privacy: jaminan matematis via noise; epsilon kecil = privasi kuat.",
        "Federated learning: data diam, model jalan — tetap butuh DP + etik.",
        "UU PDP: data kesehatan = data pribadi spesifik. Minimisasi agresif.",
      ],
      next: { label: "HD19 — Pelaporan Klinis", href: "/learn/hd19-pelaporan-klinis" },
      quiz: [
        {
          q: "Kasus Sweeney (Gubernur teridentifikasi) membuktikan…",
          options: [
            { text: "Quasi-identifier (kodepos+tgl lahir+gender) dalam kombinasi bisa mengidentifikasi unik", why: "Benar: 87% populasi AS unik dengan 3 kolom. Hapus nama ≠ anonim.", correct: true },
            { text: "Anonimisasi mustahil", why: "Terlalu nihilistik: proteksi berlapis (agregasi, DP, enclave) tetap bisa aman untuk tujuannya." },
            { text: "Data pemilih ilegal", why: "Data pemilih adalah data publik yang legal dibeli." },
            { text: "Gubernur ceroboh", why: "Gubernur tidak melakukan kesalahan apa pun — sistemnya yang bocor." },
          ],
        },
        {
          q: "Epsilon kecil dalam differential privacy berarti…",
          options: [
            { text: "Privasi kuat (noise besar), utilitas turun", why: "Benar: trade-off fundamental. Epsilon = volume bisikan privasi.", correct: true },
            { text: "Privasi lemah", why: "Terbalik: epsilon besar yang berarti lemah." },
            { text: "Tidak ada noise", why: "DP selalu menambah noise; epsilon mengatur skalanya." },
            { text: "Komputasi cepat", why: "Epsilon tidak mengatur kecepatan komputasi." },
          ],
        },
        {
          q: "Federated learning tetap butuh persetujuan etik karena…",
          options: [
            { text: "Data tetap dipakai untuk riset — arsitektur tidak menggantikan tata kelola", why: "Benar: “data tidak pindah” ≠ “privasi terjamin” (model inversion!) dan ≠ “bebas etik”.", correct: true },
            { text: "Teknisnya sulit", why: "Kesulitan teknis bukan alasan etik." },
            { text: "Server mahal", why: "Biaya server tidak relevan dengan kewajiban etik." },
            { text: "Modelnya besar", why: "Ukuran model tidak menentukan kewajiban etik." },
          ],
        },
        {
          q: "Prinsip PERTAMA sebelum proyek data pasien berjalan?",
          options: [
            { text: "Tata kelola: persetujuan etik, dasar UU PDP, minimisasi, DUA", why: "Benar: kepercayaan publik adalah infrastruktur termahal. Tata kelola dulu, analisis kemudian.", correct: true },
            { text: "Pilih model ML", why: "Model adalah langkah jauh kemudian — setelah izin dan akses beres." },
            { text: "Beli server", why: "Infrastruktur bukan langkah pertama." },
            { text: "Rekrut analis", why: "Tim penting, tapi izin etik dan dasar hukum harus ada dulu." },
          ],
        },
        {
          q: "Dinkes merilis 20 tabel agregat dengan DP, target total ε ≤ 2 per tahun. Epsilon per tabel?",
          options: [
            { text: "0,1 (2 dibagi 20 — anggaran dibagi rata)", why: "Benar: teorema komposisi dasar menjumlahkan ε. Tanpa pembukuan, “pakai DP” hanya slogan.", correct: true },
            { text: "1 per tabel, tidak masalah", why: "Salah: 20 × 1 = total 20, jauh di atas target 2." },
            { text: "2 per tabel", why: "Itu total 40 — 20x lipat anggaran." },
            { text: "Epsilon tidak perlu dibagi", why: "Komposisi adalah sifat matematis DP — mengabaikannya = mengabaikan proteksi." },
          ],
        },
      ],
    },
  ],
};
