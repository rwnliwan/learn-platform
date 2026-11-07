import type { V2Lesson } from "../lib/types";

export const pma1b: V2Lesson = {
  slug: "pm-a1b-ethics-cases",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A1B Bank Kasus Etika: Vignette Pelanggaran",
  estMinutes: 60,
  steps: [
    {
      id: "vignette-mnpi",
      eyebrow: "Langkah 1 · Vignette: Material Nonpublic Information",
      title: "Bisikan di lift: info merger yang belum diumumkan",
      prose: [
        "Dewi adalah analis di sebuah manajer investasi. Suatu sore di lift kantor, ia mendengar dua direktur emiten kliennya membicarakan tawaran akuisisi dengan harga 40 persen di atas harga pasar — kesepakatan yang belum diumumkan dan dijadwalkan diumumkan minggu depan. Tidak ada yang berbicara langsung kepadanya; ia hanya kebetulan berada di tempat yang sama.",
        "Malam itu Dewi membeli saham emiten tersebut untuk akun pribadinya, lalu keesokan paginya ia merekomendasikan saham itu ke klien dengan alasan valuasi yang memang sudah ia siapkan seminggu sebelumnya. Analisis valuasinya benar dan sudah terdokumentasi. Pertanyaannya: apakah rekomendasi yang benar secara analisis menyelamatkannya?",
        "Jawabannya tidak. Informasi tentang akuisisi adalah material — ia akan mengubah harga secara signifikan — dan nonpublik — belum diumumkan. Standar melarang trading atas informasi semacam itu dan melarang meneruskannya kepada orang lain. Bahwa Dewi mendengarnya secara tidak sengaja tidak relevan; bahwa analisisnya benar juga tidak relevan. Yang dinilai adalah sumber keunggulan informasinya: ia berdagang dengan kartu yang tidak dimiliki pasar.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dewi membeli saham untuk akun pribadi setelah mendengar rencana akuisisi yang belum diumumkan. Ini?",
          options: [
            { text: "Pelanggaran — trading atas material nonpublic information", why: "Benar: info akuisisi bersifat material dan nonpublik. Cara memperolehnya — kebetulan di lift — tidak menghapus larangan trading atas info itu.", correct: true },
            { text: "Boleh — ia tidak diberi info itu secara sengaja", why: "Salah: larangan berlaku atas pemakaian info material nonpublik, apapun cara memperolehnya." },
            { text: "Boleh — analisis valuasinya sudah benar sebelumnya", why: "Salah: standar menilai sumber keunggulan informasi, bukan kebenaran analisis yang menyertainya." },
          ],
        },
        {
          q: "Keesokan paginya Dewi merekomendasikan saham itu ke klien tanpa menyebut rencana akuisisi. Apakah rekomendasi itu juga bermasalah?",
          options: [
            { text: "Tidak — rekomendasi ke klien selalu boleh", why: "Salah: rekomendasi yang didorong oleh info nonpublik tetap memakai info itu, dan klien tidak diberi dasar yang lengkap." },
            { text: "Ya — rekomendasi itu dibangun di atas info yang tidak boleh dipakai", why: "Benar: ia tidak boleh bertindak atas info material nonpublik, termasuk dengan membungkusnya sebagai rekomendasi valuasi.", correct: true },
            { text: "Ya — tetapi hanya karena ia tidak mengungkapkan info akuisisinya", why: "Salah: mengungkapkan info nonpublik ke klien justru akan menjadi tipping, pelanggaran yang sama. Tidak ada jalan disclosure yang menyembuhkan ini." },
          ],
        },
      ],
      reference: "Material nonpublic information: tidak boleh dipakai untuk trading, tidak boleh diteruskan. Cara memperolehnya tidak relevan.",
    },
    {
      id: "vignette-misrepresentation",
      eyebrow: "Langkah 2 · Vignette: Misrepresentation",
      title: "Pitch book yang hanya menampilkan pemenang",
      prose: [
        "Fajar adalah manajer portofolio yang sedang memasarkan dana barunya ke sebuah dana pensiun. Pitch book-nya menampilkan 10 rekomendasi saham terbaiknya selama tiga tahun terakhir — semuanya naik di atas 30 persen — dengan judul besar: track record rekomendasi kami. Di halaman terakhir, dalam huruf kecil, tertulis bahwa daftar itu adalah rekomendasi terpilih.",
        "Yang tidak ditampilkan: 25 rekomendasi lain dari periode yang sama, yang rata-ratanya turun 8 persen. Tidak ada satu pun angka di pitch book yang palsu — setiap return yang ditampilkan benar-benar terjadi. Tetapi keseluruhan kesan yang ditimbulkannya menyesatkan: calon klien akan menyangka Fajar memilih pemenang 10 dari 10, padahal ia memilih pemenang 10 dari 35.",
        "Inilah misrepresentation dalam bentuknya yang paling licin: bukan kebohongan, melainkan seleksi. Standar melarang pernyataan yang menyesatkan, termasuk yang menyesatkan karena menghilangkan informasi material. Cherry-picking kinerja — menampilkan hanya yang menang — adalah pelanggaran klasik, dan huruf kecil di halaman terakhir tidak menyembuhkannya, karena kesan keseluruhan tetap menipu.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Semua return di pitch book Fajar benar-benar terjadi, tetapi hanya 10 pemenang dari 35 rekomendasi yang ditampilkan. Ini?",
          options: [
            { text: "Tidak melanggar — semua angkanya benar", why: "Salah: standar melarang kesan yang menyesatkan, termasuk lewat seleksi. Angka benar yang dipilih secara tendensius tetap misrepresentation." },
            { text: "Pelanggaran misrepresentation — cherry-picking kinerja", why: "Benar: menampilkan hanya pemenang menciptakan kesan track record yang tidak ada. Kelengkapan sampel adalah bagian dari kejujuran.", correct: true },
            { text: "Hanya pelanggaran GIPS", why: "Salah: ini pelanggaran misrepresentation terhadap calon klien — GIPS adalah standar terpisah soal presentasi kinerja." },
          ],
        },
        {
          q: "Fajar menambahkan catatan kaki huruf kecil: daftar ini adalah rekomendasi terpilih. Apakah itu menyembuhkan masalahnya?",
          options: [
            { text: "Ya — calon klien sudah diperingatkan", why: "Salah: catatan kaki tidak menetralkan kesan menyesatkan dari keseluruhan presentasi." },
            { text: "Tidak — kesan keseluruhan tetap menyesatkan dan seleksinya tetap material", why: "Benar: disclosure yang disembunyikan di huruf kecil bukan pengungkapan yang memadai atas fakta material.", correct: true },
            { text: "Ya — asalkan dana pensiun itu investor profesional", why: "Salah: standar berlaku sama terhadap semua calon klien, profesional maupun bukan." },
          ],
        },
      ],
      reference: "Misrepresentation termasuk seleksi yang menyesatkan. Angka benar tidak menyelamatkan presentasi yang cherry-pick.",
    },
    {
      id: "vignette-confidentiality",
      eyebrow: "Langkah 3 · Vignette: Confidentiality",
      title: "Cerita makan malam tentang portofolio klien",
      prose: [
        "Lestari mengelola dana sebuah yayasan keluarga. Di sebuah makan malam, ia bercerita kepada suaminya — yang bekerja di bank lain — bahwa yayasan itu akan menjual posisi besarnya di sebuah emiten minggu depan karena butuh likuiditas untuk proyek rumah sakit. Ia tidak menyebut nama yayasan, tetapi menyebut emiten, ukuran posisi, dan jadwal penjualannya. Suaminya tidak melakukan apa-apa dengan informasi itu.",
        "Minggu berikutnya Lestari diwawancarai oleh manajer investasi lain yang sedang merekrutnya. Untuk membuktikan kemampuannya, ia menunjukkan laporan posisi klien yayasan itu — termasuk alokasi dan kinerja per posisi — tanpa meminta izin yayasan. Ia beralasan laporan itu adalah hasil kerjanya sendiri.",
        "Dua pelanggaran dalam satu cerita. Informasi tentang rencana penjualan klien adalah informasi rahasia klien — membaginya kepada suami, yang tidak membutuhkan informasi itu untuk pekerjaannya, melanggar kewajiban menjaga kerahasiaan. Dan laporan posisi adalah milik klien, bukan milik Lestari: membawanya ke calon employer tanpa izin adalah pelanggaran yang sama, meski ia yang menyusunnya. Kerahasiaan bertahan bahkan setelah hubungan kerja berakhir.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Lestari menceritakan rencana penjualan posisi klien kepada suaminya, yang tidak berbuat apa-apa dengan info itu. Ini?",
          options: [
            { text: "Tidak melanggar — suami bukan pihak pasar dan tidak trading", why: "Salah: kerahasiaan dilanggar saat informasi dibagikan, bukan saat informasi itu dipakai untuk trading." },
            { text: "Pelanggaran confidentiality — info klien hanya boleh dibagikan bila perlu dan dengan izin", why: "Benar: rencana transaksi klien adalah informasi rahasia; suami tidak membutuhkannya untuk pekerjaan Lestari.", correct: true },
            { text: "Boleh — karena nama klien tidak disebut", why: "Salah: emiten, ukuran posisi, dan jadwal sudah cukup untuk mengidentifikasi dan memanfaatkan info itu." },
          ],
        },
        {
          q: "Lestari menunjukkan laporan posisi klien ke calon employer tanpa izin, dengan alasan laporan itu hasil kerjanya. Ini?",
          options: [
            { text: "Boleh — hasil kerja sendiri boleh dibawa pindah", why: "Salah: laporan posisi berisi informasi rahasia klien; kepemilikan atas pekerjaan tidak menghapus kewajiban kerahasiaan." },
            { text: "Pelanggaran confidentiality — kerahasiaan bertahan setelah hubungan kerja berakhir", why: "Benar: izin klien diperlukan sebelum informasi rahasianya dibagikan ke pihak mana pun, termasuk calon employer.", correct: true },
            { text: "Hanya pelanggaran bila calon employer memakai laporan itu", why: "Salah: pelanggarannya terjadi saat informasi dibagikan tanpa izin, bukan saat dipakai." },
          ],
        },
      ],
      reference: "Confidentiality: info klien hanya dibagikan bila perlu dan dengan izin. Bertahan setelah hubungan berakhir.",
    },
    {
      id: "vignette-additional-comp",
      eyebrow: "Langkah 4 · Vignette: Additional Compensation",
      title: "Kursi dewan yang dibayar di luar gaji",
      prose: [
        "Hendra adalah analis senior di sebuah manajer investasi. Sebuah emiten yang ia liput menawarinya kursi dewan komisaris dengan honorarium tahunan yang besar. Hendra menerima tanpa memberitahu employernya. Ia beralasan pekerjaannya di dewan dilakukan di luar jam kantor, tidak mengganggu analisisnya, dan honorarium itu adalah urusan pribadinya.",
        "Masalahnya berlapis. Pertama, honorarium dari emiten yang ia liput adalah kompensasi tambahan yang wajib diungkapkan secara tertulis ke employer dan baru boleh diterima setelah employer menyetujuinya. Kedua, kursi dewan itu sendiri adalah konflik kepentingan: Hendra kini mengawasi perusahaan yang ia rekomendasikan ke klien — objektivitasnya terancam, dan ia memiliki akses ke informasi internal emiten yang tidak dimiliki pasar.",
        "Bahwa pekerjaannya dilakukan di luar jam kantor tidak relevan. Standar tidak menanyakan kapan konflik itu terjadi, melainkan apakah konflik itu ada dan apakah employer serta klien mengetahuinya. Kompensasi tambahan yang disembunyikan adalah pelanggaran, bahkan bila analisis Hendra tetap tajam — sama seperti pada kasus Budi di PM-A1, kebenaran analisis tidak menyembuhkan konflik yang tidak diungkapkan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Hendra menerima honorarium dewan dari emiten yang ia liput tanpa memberitahu employer. Ini?",
          options: [
            { text: "Boleh — pekerjaan di luar jam kantor adalah urusan pribadi", why: "Salah: kompensasi tambahan dari pihak yang terkait dengan pekerjaan wajib diungkapkan tertulis dan disetujui employer, kapan pun dikerjakannya." },
            { text: "Pelanggaran additional compensation — wajib disclosure tertulis dan persetujuan employer", why: "Benar: honorarium itu adalah kompensasi dari pihak ketiga terkait tugasnya; menyembunyikannya melanggar kewajiban ke employer.", correct: true },
            { text: "Hanya pelanggaran bila honorariumnya besar", why: "Salah: kewajiban disclosure tidak mengenal ambang ukuran — yang dinilai adalah adanya konflik, bukan besarnya." },
          ],
        },
        {
          q: "Selain kompensasi, masalah apa lagi yang ditimbulkan kursi dewan itu?",
          options: [
            { text: "Tidak ada — dewan justru menambah wawasan analis", why: "Salah: kursi dewan menciptakan konflik kepentingan dan akses info internal atas emiten yang ia rekomendasikan." },
            { text: "Konflik kepentingan dan ancaman objektivitas atas emiten yang ia liput", why: "Benar: Hendra mengawasi perusahaan yang ia rekomendasikan — rekomendasi BUY darinya tidak lagi bisa dipercaya sebagai penilaian independen.", correct: true },
            { text: "Hanya masalah waktu — ia harus mengurangi jam analisisnya", why: "Salah: masalah utamanya adalah konflik dan disclosure, bukan manajemen waktu." },
          ],
        },
      ],
      reference: "Additional compensation: ungkapkan tertulis ke employer dan minta persetujuan SEBELUM menerima.",
    },
    {
      id: "vignette-supervisors",
      eyebrow: "Langkah 5 · Vignette: Responsibilities of Supervisors",
      title: "Supervisor yang tahu tetapi diam",
      prose: [
        "Rudi adalah kepala riset. Selama enam bulan, ia menerima tiga laporan bahwa salah satu analis juniornya menerbitkan rekomendasi tanpa basis riset yang memadai — angka-angka disalin dari presentasi emiten tanpa verifikasi. Rudi menegur analis itu secara lisan sekali, lalu tidak menindaklanjuti. Ia tidak memeriksa rekomendasi berikutnya, tidak mendokumentasikan teguran, dan tidak melaporkan masalah itu ke compliance.",
        "Bulan ketujuh, rekomendasi tanpa basis itu merugikan klien besar. Investigasi menemukan jejak lengkapnya: laporan-laporan itu ada di email Rudi, teguran lisan tidak tercatat, dan tidak ada satu pun prosedur pengawasan yang dijalankan. Rudi beralasan ia bukan yang menerbitkan rekomendasi itu — analis juniornyalah pelakunya.",
        "Standar supervisor tidak menghukum Rudi karena rekomendasi juniornya — ia menghukum Rudi karena Rudi tidak mengawasi. Supervisor wajib memastikan ada prosedur yang memadai untuk mendeteksi pelanggaran dan wajib bertindak saat ada indikasi pelanggaran. Mengetahui dan diam adalah pelanggaran tersendiri, terpisah dari pelanggaran si junior. Inilah pola yang diingatkan PM-A1: kalimat supervisornya mengetahui hal ini bukan pemanis — itu pelanggaran tambahan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Rudi tahu ada indikasi pelanggaran juniornya, menegur lisan sekali, lalu tidak menindaklanjuti. Ini?",
          options: [
            { text: "Bukan pelanggaran Rudi — pelakunya si junior", why: "Salah: supervisor punya kewajiban sendiri untuk memastikan pengawasan memadai dan bertindak atas indikasi pelanggaran." },
            { text: "Pelanggaran responsibilities of supervisors — tahu tetapi tidak bertindak memadai", why: "Benar: teguran lisan tanpa tindak lanjut, dokumentasi, dan eskalasi bukan pengawasan yang memadai.", correct: true },
            { text: "Hanya pelanggaran bila Rudi ikut menerbitkan rekomendasi itu", why: "Salah: kewajiban supervisor berdiri sendiri — ia dinilai dari pengawasannya, bukan dari ikut tidaknya ia berbuat." },
          ],
        },
        {
          q: "Apa yang seharusnya dilakukan Rudi setelah laporan pertama masuk?",
          options: [
            { text: "Menunggu sampai ada kerugian klien baru bertindak", why: "Salah: kewajiban bertindak muncul saat ada indikasi, bukan saat kerugian sudah terjadi." },
            { text: "Memeriksa rekomendasi itu, mendokumentasikan temuan, dan memastikan prosedur dipatuhi — lalu eskalasi bila berlanjut", why: "Benar: pengawasan memadai berarti deteksi, dokumentasi, dan tindak lanjut yang tercatat.", correct: true },
            { text: "Memindahkan junior itu ke tim lain secara diam-diam", why: "Salah: memindahkan masalah tanpa mendokumentasikan dan memperbaikinya bukan pengawasan." },
          ],
        },
      ],
      reference: "Supervisors: wajib ada prosedur pengawasan dan wajib bertindak atas indikasi pelanggaran. Tahu dan diam = pelanggaran.",
    },
    {
      id: "vignette-manipulation",
      eyebrow: "Langkah 6 · Vignette: Market Manipulation & Front-Running",
      title: "Beli dulu, baru order klien masuk",
      prose: [
        "Agus adalah trader di sebuah manajer investasi. Pagi ini ia menerima order beli besar dari klien dana pensiun untuk saham emiten kecil yang likuiditasnya tipis — order sebesar itu hampir pasti menggerakkan harga naik. Sebelum mengeksekusi order klien, Agus membeli saham yang sama untuk akun pribadinya. Sore harinya, setelah order klien dieksekusi dan harga naik 8 persen, Agus menjual posisinya dengan untung.",
        "Inilah front-running: mendahului transaksi klien untuk mengambil keuntungan dari pergerakan harga yang akan ditimbulkan transaksi itu. Ia melanggar dua standar sekaligus: prioritas transaksi — transaksi klien harus didahulukan dari transaksi pribadi — dan integritas pasar — ia menciptakan keuntungan dari informasi tentang order klien yang belum dieksekusi, bukan dari analisis.",
        "Varian yang lebih luas adalah market manipulation: menciptakan kesan aktivitas atau harga yang artifisial — misalnya serangkaian transaksi yang dirancang untuk menaikkan harga penutupan agar portofolio terlihat bagus di akhir kuartal, atau menyebar rumor untuk menggerakkan harga. Polanya sama: harga digerakkan oleh tindakan pelaku, bukan oleh penawaran dan permintaan yang wajar. Niat baik tidak pernah menjadi pembelaan: Agus beralasan ia hanya memanfaatkan peluang yang dilihatnya, tetapi peluang itu sendiri berasal dari order kliennya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Agus membeli saham untuk akun pribadi sebelum mengeksekusi order beli besar klien atas saham yang sama. Ini?",
          options: [
            { text: "Boleh — ia memakai analisisnya sendiri", why: "Salah: keuntungannya berasal dari order klien yang belum dieksekusi, bukan dari analisis." },
            { text: "Front-running — pelanggaran priority of transactions dan integritas pasar", why: "Benar: transaksi klien harus didahulukan; mendahului klien untuk mengambil untung dari dampak ordernya adalah pelanggaran klasik.", correct: true },
            { text: "Hanya pelanggaran bila harga tidak naik", why: "Salah: pelanggarannya terjadi saat ia mendahului order, bukan saat keuntungan direalisasi." },
          ],
        },
        {
          q: "Manajer melakukan serangkaian transaksi akhir kuartal untuk menaikkan harga penutupan saham di portofolionya. Ini?",
          options: [
            { text: "Strategi window dressing yang wajar", why: "Salah: menciptakan harga artifisial adalah market manipulation, apapun alasannya." },
            { text: "Market manipulation — menciptakan kesan harga yang artifisial", why: "Benar: harga digerakkan oleh tindakan pelaku, bukan penawaran dan permintaan wajar.", correct: true },
            { text: "Boleh bila transaksinya memakai uang sendiri", why: "Salah: sumber dana tidak relevan — yang dinilai adalah efeknya terhadap harga pasar." },
          ],
        },
      ],
      reference: "Front-running: mendahului order klien untuk untung dari dampaknya. Manipulation: menciptakan harga artifisial.",
    },
    {
      id: "pola-penilai",
      eyebrow: "Langkah 7 · Strategi Ujian",
      title: "Pola penilai CFA: cara membaca vignette",
      prose: [
        "Vignette CFA tidak menguji hafalan pasal — ia menguji cara membaca fakta. Strategi yang dipakai pemeriksa berpengalaman: pertama, cari FAKTA pelanggaran, bukan niat pelaku. Kalimat seperti ia berniat baik, analisisnya benar, atau tidak ada yang dirugikan adalah pengecoh — standar menilai perbuatan dan disclosure, bukan niat dan hasil. Bila fakta pelanggaran ada, niat baik tidak menghapusnya. Pengecualian: beberapa standar — mis. misrepresentation dan manipulasi pasar — mensyaratkan unsur kesengajaan atau pengetahuan, jadi baca rumusan standar yang ditanyakan sebelum memutuskan.",
        "Kedua, cari frasa jebakan. Tanpa mengungkapkan hampir selalu berarti ada kewajiban disclosure yang dilanggar. Supervisornya mengetahui berarti ada pelanggaran supervisor tambahan. Di luar jam kantor, urusan pribadi, atau hanya bercerita hampir selalu berarti pelaku sedang membenarkan sesuatu yang seharusnya diungkapkan. Ketiga, bila dua standar tampak relevan, pilih yang paling spesifik: front-running adalah priority of transactions, bukan sekadar conduct umum.",
        "Keempat, ingat pengecualian mutlak: trading atas material nonpublic information tidak bisa disembuhkan oleh disclosure atau izin siapa pun — tidak seperti kebanyakan konflik yang bisa disembuhkan dengan pengungkapan tertulis dan persetujuan. Kelima, kerjakan dengan kerangka 4 langkah dari PM-A1: identifikasi aktor dan aliran uang atau informasi, uji standar dari yang paling spesifik, tanyakan apakah ada disclosure tertulis sebelum bertindak, dan dokumentasikan. Vignette yang terasa rumit biasanya hanya menumpuk dua pelanggaran sederhana — pisahkan aktornya, dan masing-masing pelanggaran akan terlihat sendiri.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih jawaban berdasarkan siapa yang dirugikan paling besar. CFA menilai berdasarkan standar yang dilanggar, bukan besarnya kerugian — pelanggaran tanpa kerugian tetap pelanggaran.",
      },
      reference: "Cari FAKTA, bukan niat. Frasa jebakan: tanpa mengungkapkan, supervisor tahu, urusan pribadi. Pilih standar paling spesifik.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Vignette campuran: tiga pelanggaran dalam satu kantor",
      prose: [
        "Vignette terakhir menggabungkan tiga pola sekaligus. Baca dengan kerangka 4 langkah: siapa aktornya, ke mana uang atau informasi mengalir, siapa yang dirugikan, dan apakah ada disclosure tertulis.",
        "Citra adalah analis di sebuah sekuritas. Pagi ini ia menerima email internal yang belum dipublikasikan: emiten yang ia liput akan mengumumkan penurunan laba besar minggu depan. Siang harinya, ia menyarankan kepada sepupunya untuk menjual saham emiten itu sebelum pengumuman. Sore harinya, ia menerbitkan rekomendasi JUAL atas emiten itu — tanpa menyebut email internal — sambil diam-diam menjual saham emiten itu dari akun pribadinya sebelum rekomendasi terbit. Atasan Citra membaca draf rekomendasi itu dan menyetujuinya tanpa memeriksa basis risetnya, meski dua minggu lalu compliance sudah memperingatkan bahwa rekomendasi Citra sering tanpa basis memadai.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Citra menyarankan sepupunya menjual saham berdasarkan email internal tentang penurunan laba yang belum diumumkan. Ini?",
          options: [
            { text: "Tipping atas material nonpublic information", why: "Benar: info penurunan laba bersifat material dan nonpublik; meneruskannya agar orang lain trading adalah tipping — sama dilarangnya dengan trading sendiri.", correct: true },
            { text: "Boleh — ia hanya memberi saran, bukan trading sendiri", why: "Salah: meneruskan info material nonpublik agar orang lain trading adalah pelanggaran yang sama." },
            { text: "Hanya pelanggaran bila sepupunya benar-benar menjual", why: "Salah: pelanggarannya terjadi saat info diteruskan, bukan saat sepupunya bertindak." },
          ],
        },
        {
          q: "Citra menjual saham dari akun pribadinya sebelum rekomendasi JUAL-nya terbit. Ini?",
          options: [
            { text: "Front-running — mendahului dampak rekomendasinya sendiri", why: "Benar: ia mengambil posisi pribadi sebelum informasi yang akan menggerakkan harga itu sampai ke pasar — klien dan pasar dirugikan.", correct: true },
            { text: "Boleh — analis boleh trading saham yang ia liput", why: "Salah: analis boleh memegang saham yang ia liput hanya bila diungkapkan dan tidak mendahului klien atau pasar." },
            { text: "Hanya pelanggaran confidentiality", why: "Salah: ini soal urutan transaksi dan penyalahgunaan posisi — priority of transactions dan integritas pasar." },
          ],
        },
        {
          q: "Atasan Citra menyetujui rekomendasi itu tanpa memeriksa, padahal compliance sudah memperingatkan soal basis riset Citra. Ini?",
          options: [
            { text: "Bukan pelanggaran atasan — pelakunya Citra", why: "Salah: supervisor yang tahu ada indikasi dan tidak bertindak melanggar kewajibannya sendiri." },
            { text: "Pelanggaran responsibilities of supervisors — tahu ada indikasi tetapi tidak mengawasi", why: "Benar: peringatan compliance adalah indikasi yang wajib ditindaklanjuti dengan pemeriksaan dan dokumentasi. (Catatan: rekomendasi Citra sendiri — tanpa basis memadai — melanggar V(A) Diligence and Reasonable Basis.)", correct: true },
            { text: "Hanya pelanggaran bila rekomendasi itu salah", why: "Salah: kewajiban supervisor soal pengawasan, bukan soal benar tidaknya rekomendasi." },
          ],
        },
      ],
      summary: [
        "Material nonpublic information: tidak boleh dipakai untuk trading, tidak boleh diteruskan — cara memperolehnya tidak relevan.",
        "Misrepresentation termasuk cherry-picking: angka benar yang dipilih tendensius tetap menyesatkan.",
        "Confidentiality: info klien hanya dibagikan bila perlu dan dengan izin; bertahan setelah hubungan berakhir.",
        "Additional compensation: ungkapkan tertulis ke employer dan minta persetujuan sebelum menerima.",
        "Supervisors: tahu ada indikasi tetapi diam adalah pelanggaran tersendiri.",
        "Front-running dan manipulation: mendahului klien dan menciptakan harga artifisial dilarang.",
        "Cara membaca vignette: cari FAKTA pelanggaran, bukan niat — kecuali standar yang ditanyakan mensyaratkan unsur kesengajaan/knowledge; pilih standar paling spesifik.",
      ],
      next: { label: "PM-A1C — Standard VII & Integritas Program CFA", href: "/v2/learn/pm-a1c-ethics-vii" },
    },
  ],
};
