import type { V2Lesson } from "../lib/types";

export const hd19: V2Lesson = {
  slug: "hd19-pelaporan-klinis",
  track: "Health Data Science",
  module: "Etika, Pelaporan & Capstone",
  title: "HD19 STROBE & Dashboard Klinis: Melaporkan Sains dengan Benar",
  estMinutes: 60,
  steps: [
    {
      id: "grafik-menipu",
      eyebrow: "Langkah 1 · Visual jujur",
      title: "Grafik yang membunuh kepercayaan",
      prose: [
        "Analis mempresentasikan ke direktur RS: grafik batang 3D warna-warni menunjukkan “penurunan kematian 50%”. Direktur terkesan — sampai dokter senior bertanya: “Sumbu Y-nya mulai dari 40%, ya? Dan ini data 2 bulan, bukan setahun?” Ruangan hening. Grafik itu benar secara teknis, menipu secara visual. Kepercayaan direktur ke tim data butuh 2 tahun untuk pulih.",
        "Grafik itu tidak berbohong — datanya benar, penurunannya nyata, sumbunya berlabel. Dan ia tetap menipu: sumbu Y yang dipotong membuat penurunan kecil terlihat dramatis; 3D membuat perbandingan mustahil dibaca akurat. Inilah yang paling berbahaya dari visualisasi menipu: ia lolos audit kejujuran data, tapi gagal audit kejujuran persepsi.",
        "Analisis terbaik pun mati jika dilaporkan dengan buruk. Lesson ini tentang dua keterampilan terakhir analis kesehatan: melaporkan sains dengan standar, dan bercerita dengan jujur. Aturan 10 detik: judul grafik = satu kalimat pesan (“Kematian turun setelah program, terutama di timur”), bukan “Grafik kematian 2020–2026”. Bar chart dari nol — atau jangan pakai batang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira visualisasi yang menarik = visualisasi yang baik. 3D, gradien, dan animasi sering mengurangi akurasi baca. Kebaikan visual diukur dari seberapa cepat dan tepat audiens menangkap pesan yang benar — uji dengan 5 orang, bukan dengan selera desainer.",
        type: "pitfall",
      },
      reference: "Batang dari nol. Ketidakpastian selalu ditampilkan.",
    },
    {
      id: "checklist-sains",
      eyebrow: "Langkah 2 · Checklist pelaporan",
      title: "STROBE, CONSORT, TRIPOD: notaris sains",
      prose: [
        "STROBE: checklist pelaporan studi observasional. CONSORT: untuk RCT (diagram alir peserta wajib). TRIPOD(+AI): untuk model prediksi — checklist yang menuntut pelaporan detail sumber data, peserta, prediktor, ukuran sampel, penanganan data hilang, prosedur pemodelan, dan kinerjanya. Intinya sama: laporkan cukup detail hingga orang lain bisa menilai dan mengulang.",
        "Lima item STROBE yang paling sering dilanggar: (1) desain disebut eksplisit di judul/abstrak; (2) eligibility & rekrutmen — siapa masuk/keluar, berapa hilang di tiap tahap (flow diagram); (3) definisi variabel operasional — outcome/paparan/confounder sebagai fenotipe (definisi komputabel: gabungan kode diagnosis + hasil lab + obat + kriteria eksklusi, divalidasi dengan chart review); (4) bias — upaya mengatasi + keterbatasan yang diakui; (5) missing data — berapa % per variabel + cara penanganan (laporkan mekanismenya — MCAR/MAR/MNAR — lalu pilih complete-case vs multiple imputation yang sesuai). Data survei: 70% laporan observasional tidak membahas bias; 63% diam soal missing data. Checklist bukan formalitas — ia tempat sebagian besar sains buruk bersembunyi.",
        "Untuk internal RS pun versi ringkasnya berguna. Dan reproducibility: “angka ini dari mana?” harus terjawab dalam 5 menit — kode + versi data + seed + lingkungan dalam repo. Tanpa jejak itu, angka tidak bisa diaudit; yang tidak bisa diaudit tidak bisa dipercaya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira laporan yang baik = laporan yang lengkap (semua analisis ditampilkan). Lengkap tidak sama dengan baik. Laporan yang baik = lengkap tentang yang penting, jujur tentang keterbatasan. Menampilkan 30 analisis sensitivitas tanpa hierarki = menyembunyikan pesan.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Untuk studi case-control yang dilaporkan ke jurnal, checklist yang tepat?",
          options: [
            { text: "STROBE", why: "Benar: STROBE = observasional. CONSORT untuk RCT, TRIPOD untuk model prediksi.", correct: true },
            { text: "CONSORT", why: "CONSORT untuk RCT — case-control adalah observasional." },
            { text: "TRIPOD", why: "TRIPOD untuk model prediksi, bukan studi observasional." },
            { text: "Tidak perlu", why: "Jurnal top menolak naskah tanpa checklist yang sesuai." },
          ],
        },
      ],
      reference: "Pilih checklist sesuai desain: observasional → STROBE, trial → CONSORT, model → TRIPOD.",
    },
    {
      id: "dashboard-klinisi",
      eyebrow: "Langkah 3 · Dashboard",
      title: "Satu layar, satu keputusan",
      prose: [
        "Dashboard klinis yang baik: satu layar, satu keputusan. Menjawab “apa yang harus kulakukan?” — bukan “data apa yang ada?”. Contoh dashboard sepsis IGD yang dipakai: atas — 3 angka besar (pasien berisiko saat ini, median time-to-antibiotik, kepatuhan bundle); tengah — daftar pasien terurut risiko + alasan (SHAP ringkas) + tombol aksi; bawah — tren 30 hari + perbandingan shift. Yang dibuang: 12 grafik “menarik” yang tidak mengubah tindakan.",
        "Forensik grafik menipu — bedah “stunting turun 5%!”: (1) cek sumbu — sumbu Y 15–25% membuat turun 5 poin terlihat seperti 50%; gambar ulang dari 0. (2) cek “5%” vs “5 poin persen” — 24%→19% adalah 5 poin persen (penurunan relatif 21%), bukan 5% relatif. (3) cek ketidakpastian — 24% (95% CI: 21–27%) vs 19% (CI: 16–22%): CI tumpang tindih → penurunan belum tentu signifikan. (4) cek pembanding — tren nasional searah; klaim “program kita berhasil” butuh pembanding (difference-in-differences: bandingkan perubahan kelompok program vs kelompok pembanding, agar tren latar yang memang searah tidak diklaim sebagai keberhasilan program).",
        "Tulis ulang yang jujur: “Prevalensi stunting tercatat 19% (turun 5 poin persen dari 24%; 95% CI tumpang tindih — penurunan belum signifikan secara statistik; tren searah nasional).” Kurang heroik — tapi bisa dipertahankan di depan auditor.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Melaporkan “stunting turun 5%!” ke gubernur tanpa CI dan tanpa pembanding berarti mengklaim kemenangan dari noise — dan ketika angka berikutnya tidak turun, kepercayaan publik ke Dinkes yang runtuh. Lebih baik menunda klaim 1 bulan daripada menarik kembali klaim 1 tahun.",
        type: "risk",
      },
      quiz: [
        {
          q: "Bar chart dengan sumbu Y mulai dari 40% adalah…",
          options: [
            { text: "Menipu secara visual — batang menyiratkan perbandingan dari nol", why: "Benar: tinggi batang dibaca sebagai rasio. Dari nol, atau pakai line chart dengan anotasi.", correct: true },
            { text: "Kreatif", why: "Kreativitas bukan alasan memotong sumbu tanpa dinyatakan." },
            { text: "Standar", why: "Standarnya justru dari nol untuk perbandingan besaran." },
            { text: "Wajib", why: "Tidak ada kewajiban seperti itu." },
          ],
        },
      ],
      reference: "Setiap grafik untuk pengambil keputusan lolos 5 cek: sumbu, satuan, ketidakpastian, pembanding, klaim.",
    },
    {
      id: "tiga-bahasa",
      eyebrow: "Langkah 4 · Komunikasi",
      title: "Tiga audiens, tiga bahasa",
      prose: [
        "Analisis yang sama harus diceritakan tiga kali. Bahasa regulator/auditor: presisi & keterlacakan — “bagaimana kamu tahu?” Jawab dengan metode lengkap, flowchart partisipan, analisis sensitivitas, kode + data. Bahasa klinisi: aksi & kepercayaan — “apa yang harus saya lakukan berbeda besok pagi?” Jawab dengan satu rekomendasi jelas, angka absolut (NNT, bukan RR), untuk pasien seperti apa, dan apa risikonya. Bahasa publik/pembuat kebijakan: makna & kejujuran — “jadi intinya apa, dan seberapa yakin kamu?” Jawab dengan analogi konkret (“dari 100 orang seperti Anda…”) dan ketidakpastian yang jujur.",
        "Contoh menyampaikan NNT ke Kadinkes. Buruk: “Intervensi menunjukkan RRR 50% dengan p<0,001 pada model Cox multivariabel.” Baik: “Dari 100 anak yang divaksin, 2 terhindar dari campak berat. Biayanya Rp5 juta per anak yang terlindungi. Angka ini bisa bergeser 1–3 tergantung cakupan.” Yang kedua: absolut, ada biaya, ada ketidakpastian — dan bisa dipakai memutuskan.",
        "Kesalahan klasik: satu slide untuk semua. Dan jangan takut menulis “kami belum tahu X” — publik memaafkan ketidakpastian, tapi tidak memaafkan ketahuan melebih-lebihkan. Akhiri setiap laporan dengan “apa yang belum kami tahu” (3 bullet): ini peta riset lanjutan dan tameng dari overclaim.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira ketidakpastian membuat kita terlihat tidak kompeten. Sebaliknya: menyembunyikan ketidakpastian yang lalu terbukti salah menghancurkan kepercayaan permanen. “Kami belum tahu X” adalah kalimat profesional, bukan pengakuan kalah.",
        type: "pitfall",
      },
      reference: "Pesan dulu, metode kemudian. Angka absolut. Tidak ada persen tanpa pembilang-penyebut.",
    },
    {
      id: "lab-liefactor",
      eyebrow: "Langkah 5 · Lab",
      title: "Kalkulator lie factor",
      prose: [
        "Edward Tufte mengusulkan satu angka untuk mengadili grafik: lie factor — seberapa besar efek yang DITAMPILKAN grafik dibagi efek yang sebenarnya ada di data. Grafik jujur nilainya 1,0. Grafik stunting dengan sumbu Y 15–25 yang kita bedah tadi: mari hitung skornya.",
        "Datanya: prevalensi 24% (2023) → 19% (2024). Penurunan sebenarnya: (24−19)/19 = 26,3% secara relatif. Di grafik batang dengan sumbu mulai dari 15: tinggi batang 2023 = 24−15 = 9 unit; tinggi batang 2024 = 19−15 = 4 unit. Penurunan yang terlihat mata: (9−4)/4 = 125%. Lie factor = 125/26,3 ≈ 4,75 — grafik menampilkan penurunan hampir lima kali lebih dramatis daripada data.",
        "Tugasmu: tulis fungsi `lie_factor(v1, v2, a)` yang menerima nilai sebelum (v1), nilai sesudah (v2), dan titik awal sumbu (a). Hitung untuk a=15 dan a=0. Rasakan: satu parameter — titik awal sumbu — mengubah grafik yang sama dari dusta menjadi jujur.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lie_15` (sumbu Y mulai dari 15)" },
        { id: "t2", text: "Hitung `lie_0` (sumbu Y mulai dari 0)" },
      ],
      expected: "lie_15≈4.75 lie_0=1.00",
      formula: String.raw`LF = \frac{(h_1 - h_2)/h_2}{(v_1 - v_2)/v_2} \qquad h_i = v_i - a`,
      formulaNote: "LF = lie factor (faktor kebohongan visual): 1,0 = jujur (efek yang terlihat = efek di data); di atas 1 = grafik melebih-lebihkan; di bawah 1 = mengecilkan. h_i = tinggi batang nilai ke-i pada grafik (satuan visual); v_i = nilai data sebenarnya; a = titik awal sumbu Y; v_1, v_2 = nilai sebelum dan sesudah. Contoh di atas: LF ≈ 4,75 berarti penurunan terlihat 4,75× lebih dramatis daripada data — grafik seperti ini wajib digambar ulang dari nol.",
      note: {
        title: "Kaitan ke risk",
        body: "Lie factor di atas 2 pada laporan ke publik bukan soal estetika — ia soal integritas. Auditor, jurnalis, atau LSM yang menghitung ulang dan menemukan angka 4,75 tidak akan bertanya soal niatmu; ia akan menulis “Dinkes memanipulasi grafik”. Sekali ditulis, bantahan teknis tidak akan dibaca.",
        type: "risk",
      },
      hints: [
        "Tinggi batang = nilai − titik awal sumbu: h1 = v1 − a, h2 = v2 − a.",
        "Efek visual relatif = (h1 − h2)/h2; efek data relatif = (v1 − v2)/v2.",
        "Lie factor = efek visual / efek data. Untuk a=0, keduanya sama → LF tepat 1.",
      ],
      code: {
        starter: `# Prevalensi stunting: 24% (2023) -> 19% (2024)
# TULIS KODEMU: fungsi lie_factor(v1, v2, a)
lie_15 = 
lie_0 = 
print(f"lie_15={lie_15:.2f} lie_0={lie_0:.2f}")`,
        lockLines: 1,
        solution: `# Prevalensi stunting: 24% (2023) -> 19% (2024)
# TULIS KODEMU: fungsi lie_factor(v1, v2, a)
def lie_factor(v1, v2, a):
    h1, h2 = v1 - a, v2 - a
    visual = (h1 - h2) / h2
    data = (v1 - v2) / v2
    return visual / data
lie_15 = lie_factor(24, 19, 15)
lie_0 = lie_factor(24, 19, 0)
print(f"lie_15={lie_15:.2f} lie_0={lie_0:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lie_15", value: 4.75, tol: 0.01, label: "`lie_15` seharusnya ≈ 4.75", msg: "(9−4)/4 dibagi (24−19)/19 = 1,25/0,263 — grafik melebih-lebihkan hampir 5×." },
          { kind: "equal", task: "t2", name: "lie_0", value: 1.0, tol: 1e-9, label: "`lie_0` seharusnya 1.00", msg: "Dari nol, efek visual = efek data. Itulah definisi grafik jujur." },
          { kind: "stdout_matches", task: "t2", pattern: "lie_15=4\\.75 lie_0=1\\.00", label: "`print` menampilkan kedua lie factor", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Lie factor 4,75 pada grafik penurunan stunting artinya…",
          options: [
            { text: "Grafik menampilkan penurunan 4,75× lebih dramatis daripada data sebenarnya", why: "Benar: LF = efek visual / efek data. 4,75 = dusta visual yang serius.", correct: true },
            { text: "Datanya salah sebesar 4,75×", why: "Datanya benar — yang salah adalah representasi visualnya." },
            { text: "Penurunannya tidak signifikan", why: "Signifikansi soal ketidakpastian (CI), bukan soal kejujuran visual." },
            { text: "Grafiknya sudah jujur", why: "Jujur = LF 1,0. 4,75 jauh dari jujur." },
          ],
        },
      ],
      reference: "Satu angka mengadili grafik: LF = efek visual / efek data. Di atas 1 = gambar ulang.",
    },
    {
      id: "lab-klaim-ci",
      eyebrow: "Langkah 6 · Lab",
      title: "Menulis ulang klaim dengan CI",
      prose: [
        "Angka tanpa ketidakpastian adalah opini yang menyamar sebagai fakta. Dua survei stunting: 2023 prevalensi 24% (95% CI: 21–27%), 2024 prevalensi 19% (CI: 16–22%). Klien ingin headline “stunting turun 5%!”. Tugasmu: cek dulu apakah penurunannya layak diklaim — aturan praktis yang konservatif: jika kedua CI tumpang tindih, jangan klaim penurunan signifikan tanpa uji formal.",
        "Tulis fungsi `cek_klaim` yang menerima dua estimasi beserta CI-nya, lalu kembalikan: (a) apakah kedua CI tumpang tindih (“ya”/“tidak”), (b) penurunan dalam poin persen, (c) penurunan relatif dalam persen. Tiga angka ini adalah bahan mentah kalimat jujur: “turun 5 poin persen (20,8% relatif); CI tumpang tindih — penurunan belum signifikan secara statistik.”",
      ],
      tasks: [
        { id: "t1", text: "Hitung `overlap` (“ya”/“tidak”): apakah CI tumpang tindih" },
        { id: "t2", text: "Hitung `turun_poin` dan `rel_pct` (penurunan relatif %)" },
      ],
      expected: "overlap=ya turun_poin=5 rel_pct=20.8",
      note: {
        title: "Sering salah",
        body: "Aturan “CI tumpang tindih = tidak signifikan” itu konservatif — CI yang sedikit tumpang tindih masih bisa signifikan pada uji formal. Jadi aturan ini aman dipakai untuk MENAHAN klaim, tidak untuk memastikan klaim. Posisikan ia sebagai rem, bukan gas.",
        type: "pitfall",
      },
      hints: [
        "Dua interval [lo1, hi1] dan [lo2, hi2] TIDAK tumpang tindih hanya jika hi1 < lo2 atau hi2 < lo1.",
        "Poin persen = selisih langsung: 24 − 19. Relatif = selisih / nilai awal × 100.",
        "“5 poin persen” ≠ “5%”: yang kedua berarti penurunan relatif — di sini 20,8%.",
      ],
      code: {
        starter: `# 2023: 24% (CI 21-27); 2024: 19% (CI 16-22)
# TULIS KODEMU: overlap, turun_poin, rel_pct
overlap = 
turun_poin = 
rel_pct = 
print(f"overlap={overlap} turun_poin={turun_poin} rel_pct={rel_pct:.1f}")`,
        lockLines: 1,
        solution: `# 2023: 24% (CI 21-27); 2024: 19% (CI 16-22)
# TULIS KODEMU: overlap, turun_poin, rel_pct
p1, lo1, hi1 = 24, 21, 27
p2, lo2, hi2 = 19, 16, 22
overlap = "ya" if not (hi1 < lo2 or hi2 < lo1) else "tidak"
turun_poin = p1 - p2
rel_pct = turun_poin / p1 * 100
print(f"overlap={overlap} turun_poin={turun_poin} rel_pct={rel_pct:.1f}")`,
        checks: [
          { kind: "contains", task: "t1", name: "overlap", value: "ya", label: "`overlap` seharusnya “ya”", msg: "CI 21–27 dan 16–22 tumpang tindih di rentang 21–22." },
          { kind: "equal", task: "t2", name: "rel_pct", value: 20.8, tol: 0.05, label: "`rel_pct` seharusnya ≈ 20.8", msg: "5/24 × 100 — penurunan relatif, bukan poin persen." },
          { kind: "stdout_matches", task: "t2", pattern: "overlap=ya turun_poin=5 rel_pct=20\\.8", label: "`print` menampilkan hasil cek klaim", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Dua CI prevalensi (21–27) dan (16–22) tumpang tindih. Kesimpulan yang tepat?",
          options: [
            { text: "Jangan klaim penurunan signifikan tanpa uji formal", why: "Benar: overlap = rem klaim. Penurunan bisa jadi noise sampling.", correct: true },
            { text: "Pasti tidak ada penurunan", why: "Terlalu kuat: CI yang sedikit overlap masih bisa signifikan pada uji formal." },
            { text: "Pasti signifikan karena angkanya turun", why: "Angka titik turun ≠ signifikan — itu gunanya CI." },
            { text: "Surveinya gagal, buang saja", why: "Survei tidak gagal; ia hanya belum memberi bukti penurunan yang kuat." },
          ],
        },
      ],
      reference: "CI tumpang tindih = rem klaim, bukan vonis akhir. Tulis versi jujurnya.",
    },
    {
      id: "anatomi-klaim",
      eyebrow: "Langkah 7 · Forensik klaim",
      title: "Anatomi klaim yang tahan audit",
      prose: [
        "Klaim yang buruk jarang lahir dari data yang buruk — ia lahir dari kalimat yang melompat lebih jauh daripada yang diizinkan angka. Tiga lompatan paling umum dalam pelaporan kesehatan: (a) dari asosiasi ke kausalitas (“wilayah dengan posyandu aktif stuntingnya rendah” menjadi “posyandu menurunkan stunting”); (b) dari sampel ke populasi (“di 3 puskesmas percontohan” menjadi “di kabupaten”); (c) dari relatif ke absolut (“risiko turun 50%” tanpa menyebut dari 2% ke 1%). Setiap lompatan harus ditandai eksplisit — atau dihapus.",
        "Anatomi kalimat yang tahan audit: ANGKA + PEMBILANG-PENYEBUT + KETIDAKPASTIAN + PEMBANDING + BATAS. Contoh: “Cakupan imunisasi dasar lengkap tercatat 78% (7.812 dari 10.015 sasaran; 95% CI: 77–79%) — naik 4 poin persen dari 2024, searah tren provinsi (+3 poin); angka berbasis pencatatan faskes, belum termasuk anak di luar sistem.” Lima elemen, satu kalimat, nol ruang untuk tuduhan manipulasi.",
        "Dua racun pelaporan yang tidak terlihat di grafik: outcome switching — mendaftarkan 5 outcome lalu melaporkan 1 yang signifikan (penawarnya: protokol pra-registrasi, laporkan semua outcome terdaftar); dan HARKing — menemukan pola lalu menulis seolah itu hipotesis awal (penawarnya: bedakan analisis konfirmatori vs eksploratori; eksploratori ditulis sebagai “temuan awal, perlu replikasi”). Registri protokol membuat outcome switching terdeteksi dalam 10 menit — auditor memeriksanya.",
        "Terakhir: hierarki pesan. Laporan yang menumpuk 30 temuan tanpa hierarki memaksa pembaca menebak mana yang penting — dan tebakan mereka akan berbeda darimu. Pakai struktur 1-3-10: 1 pesan utama (yang masuk judul grafik), 3 temuan pendukung, 10 detail di lampiran. Jika semuanya penting, tidak ada yang penting.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: uji pembaca yang bermusuhan",
        body: "Sebelum mengirim laporan apa pun, baca ulang setiap kalimat klaim sambil membayangkan pembaca yang paling tidak menyukaimu — auditor yang mencari celah, jurnalis oposisi, LSM yang curiga. Tanyakan satu hal: “kalimat ini masih bertahan?” Jika sebuah kalimat hanya benar bila pembacanya bermurah hati — bila “turun 5%” butuh pembaca yang tidak menanyakan pembilangnya — tulis ulang sampai ia bertahan bahkan di tangan orang yang ingin menjatuhkanmu. Heuristik kedua: aturan 24 jam. Jangan kirim klaim pada hari yang sama kamu menghitungnya; angka yang mengagumkanmu hari ini sering terlihat rapuh besok pagi, dan satu malam tidur adalah uji signifikansi termurah yang ada. Heuristik ketiga: untuk setiap angka heroik, tulis dulu versi paling membosankannya (“prevalensi tercatat 19%; CI tumpang tindih dengan tahun lalu”) — jika versi membosankan itu masih layak dilaporkan, angka heroikmu aman; jika tidak, kamu sedang menjual noise. Tiga kebiasaan ini — pembaca yang bermusuhan, jeda 24 jam, versi membosankan dulu — memisahkan analis yang dipercaya sepuluh tahun dari analis yang viral sepuluh hari.",
      },
      quiz: [
        {
          q: "Tim mendaftarkan 5 outcome di protokol tapi laporan hanya menampilkan 1 yang signifikan. Ini…",
          options: [
            { text: "Outcome switching — laporkan semua outcome yang terdaftar", why: "Benar: memilih outcome pasca-analisis menyesatkan. Protokol ada agar ini terdeteksi.", correct: true },
            { text: "HARKing", why: "HARKing = menulis hipotesis setelah melihat hasil; ini soal memilih outcome yang dilaporkan." },
            { text: "Praktik standar yang wajar", why: "Tidak wajar: menyembunyikan 4 outcome yang tidak signifikan adalah bias pelaporan." },
            { text: "Tidak masalah selama angkanya benar", why: "Angka benar + seleksi curang = kesimpulan salah. Selektivitasnya masalahnya." },
          ],
        },
      ],
      reference: "Setiap klaim: angka + pembilang + CI + pembanding + batas. Tanpa lompatan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: melaporkan sains dengan jujur",
      prose: [
        "Lima situasi keputusan yang dihadapi analis setiap kali angka kesehatan harus keluar dari laptop menuju pengambil keputusan:",
        "Skenario 1 — “Bikin grafik untuk laporan?” → Audit visualnya sebelum dipublikasi: sumbu tidak terpotong menyesatkan, batang mulai dari nol, lie factor ≈ 1 (efek visual sebanding efek data). Grafik yang menipu menghasilkan keputusan yang salah — dan yang menandatangani grafiknya adalah kamu.",
        "Skenario 2 — “Menulis laporan penelitian?” → Ikuti checklist sesuai desain: STROBE untuk observasional, CONSORT untuk trial, TRIPOD untuk model prediksi. Checklist bukan birokrasi — ia adalah daftar hal yang pembaca butuhkan untuk menilaimu, termasuk yang kamu ubah di tengah jalan.",
        "Skenario 3 — “Bangun dashboard untuk klinisi?” → Sedikit metrik yang actionable dengan ambang yang jelas — bukan wallpaper angka. Dashboard yang baik menjawab “apa yang harus kulakukan sekarang”; ukur keberhasilannya dari pemakaian, bukan dari jumlah tayangan.",
        "Skenario 4 — “Satu temuan, tiga audiens?” → Terjemahkan ke tiga bahasa tanpa mengubah angka: ilmiah (metode + interval kepercayaan + keterbatasan), klinisi (apa yang harus dilakukan berbeda Senin pagi), publik (apa artinya bagi saya). Angka yang sama, keputusan yang berbeda — komunikasikan ketiganya.",
        "Skenario 5 — “Ada klaim keberhasilan program?” → Forensik klaim sebelum mengamini: apakah definisi kasus konstan antar periode? adakah pembanding (tren regional / wilayah kontrol)? apakah CI dilaporkan? Contoh: klaim “DBD turun 35%” (Rp2,4 miliar dipertaruhkan) menyusut menjadi ~7 poin persen di atas tren regional setelah definisi kasus dan musim diperhitungkan — dan cakupan fogging riil baru 41%.",
        "Aturan praktis 10 detik: grafik → audit lie factor → laporan → checklist desain → dashboard → actionable, bukan wallpaper → komunikasi → tiga bahasa, satu angka → klaim program → forensik definisi + pembanding + CI.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengesahkan klaim “program berhasil, lanjutkan” tanpa pembanding — mengunci Rp2,4+ miliar berikutnya untuk intervensi yang mungkin hanya menunggangi musim kemarau. Bupati yang baik lebih menghargai analis yang menyelamatkan anggaran berikutnya daripada yang mengamini klaim.",
        type: "pitfall",
      },
      reference: "Klaim program selalu butuh pembanding. Tanpa itu, ia testimoni — bukan evaluasi.",
    },
    {
      id: "minicase-dbd",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case 1: Klaim “DBD turun 35%” senilai Rp2,4 miliar",
      prose: [
        "Dinkes sebuah kabupaten menghabiskan Rp2,4 miliar untuk program fogging dan PSN tahun 2025. Laporan akhir tahun mengklaim: “Kasus DBD turun 35% — dari 1.240 kasus (2024) menjadi 806 kasus (2025). Program berhasil, lanjutkan.” Bupati siap menambah anggaran. Kamu diminta memverifikasi sebelum APBD diketok.",
        "Data yang kamu gali: (a) definisi kasus berubah Maret 2025 — puskesmas beralih ke rapid test NS1 yang lebih sensitif, sehingga kasus ringan yang dulu tak tercatat kini tertangkap (efeknya MENAIKKAN hitungan 2025, bukan menurunkan — artinya penurunan sebenarnya lebih besar dari 35% jika definisi konstan, atau… justru menutupi sesuatu?); (b) tren regional: kasus turun 28% di kabupaten tetangga TANPA program serupa — 2025 kemarau panjang, vektor turun di mana-mana; (c) cakupan fogging riil: hanya 41% wilayah target yang ter-fogging sesuai jadwal (kendala logistik); (d) tidak ada CI yang dilaporkan.",
        "Pertanyaan: (1) Apakah “program berhasil” didukung data? (2) Berapa estimasi efek program yang jujur setelah memperhitungkan tren regional (perkiraan kasar difference-in-differences: 35% − 28% = 7 poin persen)? (3) Tulis satu paragraf untuk bupati.",
        "Pembahasan: (1) Tidak — penurunan signifikan secara statistik belum tentu disebabkan program; tren regional menjelaskan sebagian besar. (2) Estimasi kasar ~7 poin persen di atas tren, dengan catatan asumsi tren paralel dan tanpa kontrol formal — tulis sebagai “indikasi awal”, bukan bukti. (3) Contoh jujur: “Kasus tercatat turun 35% (1.240 → 806), namun penurunan 28% serupa terjadi di wilayah tanpa program (faktor musim); kontribusi program diestimasi ~7 poin persen di atas tren dengan cakupan fogging baru 41% — klaim keberhasilan penuh belum berdasar; evaluasi berdesain pembanding diperlukan sebelum menambah anggaran.” Bupati yang baik lebih menghargai analis yang menyelamatkan Rp2,4 miliar berikutnya daripada yang mengamini klaim.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Mengesahkan klaim “program berhasil” tanpa pembanding berarti APBD berikutnya mengunci Rp2,4+ miliar untuk intervensi yang mungkin hanya menunggangi musim. Biaya kesalahan ini bukan reputasi — ia anggaran kesehatan yang bisa dipakai untuk program yang benar-benar bekerja.",
        type: "risk",
      },
      reference: "Klaim program selalu butuh pembanding. Tanpa itu, ia testimoni — bukan evaluasi.",
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
        "STROBE (observasional), CONSORT (RCT), TRIPOD(+AI) (model) — pilih sesuai desain.",
        "Dashboard: satu layar, satu keputusan; desain bersama pengguna.",
        "Komunikasi: pesan dulu, angka absolut, visual jujur, ketidakpastian eksplisit.",
        "Batang dari nol; judul grafik = satu kalimat pesan.",
        "Reproducible: kode + versi data + seed + lingkungan.",
      ],
      next: { label: "HD20 — Capstone: Model Readmission", href: "/learn/hd20-capstone-readmission" },
      quiz: [
        {
          q: "Judul grafik yang baik?",
          options: [
            { text: "“Kematian turun setelah program, terutama di timur” (satu kalimat pesan)", why: "Benar: judul = pesanmu. Pembaca yang hanya baca judul tetap dapat intinya.", correct: true },
            { text: "Grafik kematian 2020–2026", why: "Itu label, bukan pesan — pembaca tetap harus menebak intinya." },
            { text: "Data", why: "Bukan judul yang informatif." },
            { text: "Gambar 1", why: "Penomoran bukan pesan." },
          ],
        },
        {
          q: "Diagram alir peserta (flow diagram) wajib dalam…",
          options: [
            { text: "CONSORT (RCT) — tapi praktik baik untuk semua desain", why: "Benar: CONSORT mewajibkan. Prinsipnya universal: tunjukkan siapa hilang di tiap tahap.", correct: true },
            { text: "Semua laporan", why: "Wajib formalnya di CONSORT; untuk lainnya sangat dianjurkan." },
            { text: "Hanya dashboard", why: "Dashboard operasional tidak memakai flow diagram partisipan studi." },
            { text: "Tidak pernah", why: "Tanpa flow, reviewer tidak tahu siapa yang hilang di mana." },
          ],
        },
        {
          q: "“Prevalensi turun dari 24% ke 19%” dilaporkan tanpa CI dan pembanding. Masalahnya?",
          options: [
            { text: "Bisa jadi noise (CI tumpang tindih) dan tren nasional searah — klaim “program berhasil” belum berdasar", why: "Benar: tanpa CI tidak tahu signifikan; tanpa pembanding tidak tahu efek program vs tren umum.", correct: true },
            { text: "Tidak ada masalah", why: "Ada: dua cek kejujuran (ketidakpastian, pembanding) dilewati." },
            { text: "Hanya masalah font", why: "Bukan soal tampilan — soal validitas klaim." },
            { text: "Angkanya pasti salah", why: "Angkanya bisa benar; yang salah adalah klaim kausalnya." },
          ],
        },
        {
          q: "Mengakhiri laporan dengan “apa yang belum kami tahu” berguna untuk…",
          options: [
            { text: "Kejujuran + peta riset lanjutan + tameng overclaim", why: "Benar: profesional mengakui batas. Ini membangun kepercayaan jangka panjang.", correct: true },
            { text: "Terlihat lemah", why: "Terbalik: justru tanda kedewasaan profesional." },
            { text: "Memperpanjang laporan", why: "Tiga bullet bukan soal panjang — soal kejujuran." },
            { text: "Tidak ada", why: "Ada: ia melindungi dari overclaim dan memandu riset berikut." },
          ],
        },
        {
          q: "Reproducibility laporan berarti…",
          options: [
            { text: "“Angka ini dari mana?” terjawab dalam 5 menit: kode + versi data + seed + lingkungan", why: "Benar: jejak yang bisa diulang. Tanpa ini, angka tidak bisa diaudit.", correct: true },
            { text: "PDF yang rapi", why: "Rapi tidak sama dengan bisa diulang." },
            { text: "Banyak lampiran", why: "Lampiran tanpa kode/data/seed tidak menjamin reproducibility." },
            { text: "Ditandatangani", why: "Tanda tangan bukan jejak komputasi." },
          ],
        },
      ],
    },
  ],
};
