import type { V2Lesson } from "../lib/types";

export const fr30: V2Lesson = {
  slug: "fr30-synthetic-data-gan",
  track: "Fraud & AML Analytics",
  module: "Data & Model",
  title: "FR30 — Synthetic Data & GAN: Data Palsu yang Berguna",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang tidak boleh melihat data asli",
      prose: [
        "Sebuah tim fraud ingin menguji model baru dengan vendor eksternal — tetapi data transaksi nasabah tidak boleh keluar dari bank. Solusinya: data sintetis. Mereka melatih sebuah GAN (generative adversarial network) pada 1.000 transaksi asli, lalu menghasilkan 1.000 transaksi sintetis untuk dibagikan. Rata-rata transaksi asli Rp1.250.000; rata-rata sintetis Rp1.212.500 — selisih hanya 3,0 persen. Tetapi 12 baris sintetis (1,2 persen) ternyata nyaris identik dengan baris asli — jaraknya di bawah Rp10.000 — dan tiga di antaranya membawa kombinasi yang cukup unik untuk mengidentifikasi nasabahnya.",
        "Kisah ini merangkum dilema data sintetis: ia berguna justru sejauh ia mirip data asli, dan berbahaya justru sejauh ia terlalu mirip. Lesson ini mengajarkan kapan data sintetis dipakai di fraud analytics, cara kerja GAN dalam satu paragraf yang jujur, dan dua metrik yang menilainya — utility (seberapa berguna) dan privacy (seberapa aman) — plus garis yang tidak boleh dilanggar: data sintetis tidak pernah menggantikan data asli untuk melatih model produksi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Data sintetis hanya disebut sekali di track FR — sebagai distractor di kuis FR4 ('latih supervised dengan synthetic data dari generator' adalah jawaban salah, karena data sintetis meniru asumsi pembuatnya). Tidak ada lesson yang mengajarkan kapan ia BOLEH dipakai, cara kerja GAN, atau cara mengukur utility dan privacy-nya. Lesson ini membangun ketiganya.",
      },
      reference: "1.000 asli vs 1.000 sintetis: rata-rata Rp1.250.000 vs Rp1.212.500 (selisih 3,0 persen); 12 baris terlalu dekat (1,2 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menilai data sintetis dengan dua metrik dan memutuskan kapan ia boleh dipakai.",
        "(1) Menjelaskan tiga kegunaan sah data sintetis di fraud analytics;",
        "(2) Menjelaskan cara kerja GAN sebagai generator dan discriminator yang beradu;",
        "(3) Menghitung utility gap dan disclosure risk dari data sintetis;",
        "(4) Menjelaskan kenapa data sintetis tidak boleh melatih model produksi;",
        "(5) Membedakan data sintetis dari data anonimisasi.",
      ],
      tasks: [],
    },
    {
      id: "kegunaan",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga kegunaan sah — dan satu larangan",
      prose: [
        "Kegunaan pertama: berbagi dan kolaborasi. Vendor, auditor, atau tim riset bisa bekerja dengan data sintetis tanpa pernah menyentuh data nasabah — seperti di cerita pembuka. Kegunaan kedua: pengujian dan demo. Pipeline, dashboard, dan aturan baru bisa diuji pada data sintetis sebelum menyentuh produksi. Kegunaan ketiga: menyeimbangkan kelas langka. Fraud hanya 0,1 persen dari transaksi — data sintetis bisa menambah contoh pola langka untuk pengujian, bukan untuk pelatihan produksi.",
        "Larangan satu-satunya yang mutlak: jangan melatih model produksi pada data sintetis. Alasannya ada di kuis FR4 — data sintetis meniru asumsi pembuatnya, bukan pola penipu nyata. Model yang dilatih pada data sintetis belajar fiksi yang rapi: ia akan terlihat hebat di pengujian dan gagal di dunia nyata, karena penipu tidak membaca asumsi generator. Data sintetis adalah cermin yang dipoles — jangan jadikan ia guru.",
        "Bedakan data sintetis dari anonimisasi. Anonimisasi mengambil data asli dan menghapus pengenal — tetapi pola yang tersisa masih bisa mengidentifikasi orang (tiga baris yang terlalu dekat di cerita pembuka adalah bentuk kegagalan yang sama). Data sintetis tidak mengambil baris asli sama sekali — ia menghasilkan baris baru dari distribusi yang dipelajari. Keduanya bisa bocor, tetapi dengan cara yang berbeda — dan keduanya butuh diukur, bukan diasumsikan aman.",
      ],
      tasks: [],
      note: {
        title: "GAN dalam satu paragraf",
        body: "GAN adalah dua model yang beradu: generator membuat data palsu dari noise, discriminator menebak mana yang asli dan mana yang palsu. Generator belajar dari kesalahan tebakannya; discriminator belajar dari keberhasilan menebaknya. Saat discriminator tidak lagi bisa membedakan (tebakannya 50 persen — setara koin), generator dianggap cukup baik. Itulah seluruh idenya — adu yang membuat keduanya pintar.",
      },
      reference: "Tiga kegunaan: berbagi, pengujian, penyeimbang kelas untuk pengujian. Larangan: latih model produksi.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 4 · Teori",
      title: "Dua metrik: utility gap dan disclosure risk",
      prose: [
        "Utility gap mengukur seberapa berguna data sintetis: selisih statistik kunci antara data asli dan sintetis. Dalam cerita pembuka, rata-rata transaksi asli Rp1.250.000 dan sintetis Rp1.212.500 — selisih 37.500, dibagi 1.250.000 sama dengan 3,0 persen. Ambang praktis yang dipakai tim itu: utility gap di bawah 5 persen untuk rata-rata dan proporsi kategori utama berarti data cukup berguna untuk pengujian. Di atas 10 persen, data sintetis itu menyesatkan — pengujiannya menguji dunia yang salah.",
        "Disclosure risk mengukur seberapa aman: proporsi baris sintetis yang terlalu dekat dengan baris asli. Di cerita pembuka, 12 dari 1.000 baris sintetis berjarak di bawah Rp10.000 dari baris asli — 1,2 persen. Ambang tim itu: di bawah 1 persen berarti aman dibagikan; 1 sampai 5 persen berarti bagikan dengan perjanjian dan hapus baris yang terlalu dekat; di atas 5 persen berarti jangan bagikan — generator itu menghafal, bukan menggeneralisasi.",
        "Kedua metrik bergerak berlawanan — inilah trade-off intinya. Generator yang terlalu setia meniru data asli punya utility gap kecil tetapi disclosure risk besar (ia menghafal). Generator yang terlalu kreatif punya disclosure risk kecil tetapi utility gap besar (ia mengarang dunia lain). Pekerjaan analis adalah menemukan titik tengah yang disepakati: cukup mirip untuk berguna, cukup berbeda untuk aman — dan menuliskan kedua angka itu di setiap paket data sintetis yang dibagikan.",
      ],
      tasks: [],
      note: {
        title: "Jarak bukan satu-satunya ukuran privasi",
        body: "Disclosure risk di lesson ini memakai jarak nominal sederhana (selisih rupiah) agar bisa dihitung di lab. Dalam praktik, ada ukuran yang lebih kuat — membership inference attack (bisakah penyerang menebak apakah seseorang ada di data latih?) dan pengujian keunikan kombinasi atribut. Jarak adalah pintu masuk, bukan keseluruhan disiplin privasi.",
      },
      reference: "Utility gap 3,0 persen (ambang 5 persen); disclosure risk 1,2 persen (ambang aman 1 persen).",
    },
    {
      id: "lab-sintetis",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menilai utility dan privacy data sintetis",
      prose: [
        "Lab ini menghitung dua metrik dari data cerita pembuka: utility gap dan disclosure risk. Hitung dulu di kepala. Utility gap: 1.250.000 dikurangi 1.212.500 sama dengan 37.500; 37.500 dibagi 1.250.000 dikali 100 sama dengan 3,0 persen. Disclosure risk: 12 dibagi 1.000 dikali 100 sama dengan 1,2 persen.",
        "Tugas lab: isi tiga variabel — utility_gap, disclosure_risk, dan keputusan ('BAGIKAN_DENGAN_SYARAT' bila disclosure di atas 1 persen tetapi utility di bawah 5 persen; 'BAGIKAN' bila keduanya di bawah ambang; 'JANGAN_BAGIKAN' bila utility di atas 10 persen) — lalu cetak ketiganya. Tiga output ini adalah stempel pada paket data sintetis sebelum ia keluar dari bank.",
        "Setelah lolos, coba eksperimen: ubah baris yang terlalu dekat menjadi 60 dan lihat disclosure risk naik ke 6,0 persen — lalu tanyakan: apakah paket itu masih boleh dibagikan? Jawabannya: tidak — di atas 5 persen generator itu menghafal, bukan menggeneralisasi. Latih ulang dengan regularisasi yang lebih kuat atau data latih yang lebih besar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung utility gap dalam persen" },
        { id: "t2", text: "Hitung disclosure risk dalam persen" },
        { id: "t3", text: "Tentukan keputusan berbagi dari kedua ambang" },
      ],
      expected: "utility_gap=3.0\ndisclosure_risk=1.2\nkeputusan=BAGIKAN_DENGAN_SYARAT",
      hints: [
        "Utility gap = selisih absolut rata-rata dibagi rata-rata asli, dikali 100.",
        "Disclosure risk = baris terlalu dekat dibagi total baris sintetis, dikali 100.",
        "Disclosure 1,2 persen di atas ambang aman 1 persen — bagikan dengan syarat (hapus baris yang terlalu dekat).",
      ],
      code: {
        starter: "# Data sintetis vs asli (Rp). JANGAN UBAH.\nrata_asli = 1250000\nrata_sintetis = 1212500\nbaris_dekat = 12\ntotal_sintetis = 1000\n\n# TULIS KODEMU: utility gap, disclosure risk, keputusan\nutility_gap = \ndisclosure_risk = \nkeputusan = \nprint(f\"utility_gap={round(utility_gap, 1)}\")\nprint(f\"disclosure_risk={round(disclosure_risk, 1)}\")\nprint(f\"keputusan={keputusan}\")",
        lockLines: 6,
        solution: "# Data sintetis vs asli (Rp). JANGAN UBAH.\nrata_asli = 1250000\nrata_sintetis = 1212500\nbaris_dekat = 12\ntotal_sintetis = 1000\n\n# TULIS KODEMU: utility gap, disclosure risk, keputusan\nutility_gap = abs(rata_asli - rata_sintetis) / rata_asli * 100\ndisclosure_risk = baris_dekat / total_sintetis * 100\nif utility_gap > 10:\n    keputusan = \"JANGAN_BAGIKAN\"\nelif disclosure_risk <= 1:\n    keputusan = \"BAGIKAN\"\nelse:\n    keputusan = \"BAGIKAN_DENGAN_SYARAT\"\nprint(f\"utility_gap={round(utility_gap, 1)}\")\nprint(f\"disclosure_risk={round(disclosure_risk, 1)}\")\nprint(f\"keputusan={keputusan}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "utility_gap=3.0", label: "Utility gap 3,0 persen", msg: "37.500 / 1.250.000 x 100 = 3,0. Di bawah ambang 5 persen — cukup berguna." },
          { kind: "stdout_matches", task: "t2", pattern: "disclosure_risk=1.2", label: "Disclosure risk 1,2 persen", msg: "12 / 1.000 x 100 = 1,2. Di atas ambang aman 1 persen — hapus baris yang terlalu dekat." },
          { kind: "stdout_matches", task: "t3", pattern: "keputusan=BAGIKAN_DENGAN_SYARAT", label: "Keputusan: bagikan dengan syarat", msg: "Utility baik tetapi disclosure di atas ambang aman — bagikan setelah menghapus 12 baris itu." },
        ],
      },
      reference: "Utility gap 3,0 persen; disclosure risk 1,2 persen; keputusan BAGIKAN_DENGAN_SYARAT.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: vendor yang menguji di dunia yang salah",
      prose: [
        "Vendor itu menerima data sintetis dengan utility gap 3,0 persen dan menguji modelnya — hasilnya precision 94 persen, dan semua orang senang. Tetapi saat model itu diuji pada data asli, precision jatuh ke 71 persen. Penyelidikan menemukan penyebabnya: generator tidak pernah mempelajari pola serangan yang paling langka — bust-out synthetic yang hanya 0,02 persen dari data — karena pola itu terlalu jarang untuk dipelajari GAN dari 1.000 baris. Vendor menguji di dunia yang tidak punya penjahat paling berbahaya.",
        "Perbaikannya bukan membuang data sintetis, melainkan menempatkannya dengan benar: data sintetis untuk menguji pipeline, antarmuka, dan aturan — hal-hal yang tidak peduli pola penipu. Untuk menguji MODEL, vendor diberi data asli di lingkungan aman bank, dengan akses yang diawasi. Dua jalur, dua data, dua tujuan — dan tidak ada lagi yang tertukar.",
        "Sejak itu, setiap paket data sintetis yang keluar membawa stempel dua angka: utility gap dan disclosure risk, plus satu kalimat peringatan — 'Data ini tidak mengandung pola langka di bawah 0,1 persen; jangan pakai untuk menguji model deteksi.' Peringatan itu ditulis karena seseorang pernah lupa menuliskannya — dan biayanya adalah satu kuartal pengujian yang sia-sia.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, data sintetis tetap dipakai — untuk hal yang memang cocok untuknya. Kedua, pengujian model dipindah ke data asli di lingkungan aman. Ketiga, keterbatasan ditulis di paketnya, bukan disimpan di kepala satu orang.",
      },
      reference: "Precision 94 persen di sintetis, 71 persen di asli — pola langka 0,02 persen tidak dipelajari GAN.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Tiga kegunaan sah: berbagi, pengujian, penyeimbang kelas untuk pengujian.",
        "Lab: utility gap 3,0 persen; disclosure risk 1,2 persen; BAGIKAN_DENGAN_SYARAT.",
        "GAN: generator vs discriminator; bagus saat tebakan discriminator 50 persen.",
        "Larangan mutlak: jangan latih model produksi pada data sintetis.",
        "Trade-off: terlalu mirip berarti menghafal; terlalu kreatif berarti mengarang dunia lain.",
      ],
      next: { label: "FR31 — GenAI-Assisted Detection Pipeline: LLM di Meja Triase", href: "/v2/learn/fr31-genai-detection-pipeline" },
      quiz: [
        {
          q: "Rata-rata asli Rp1.250.000, sintetis Rp1.212.500; 12 dari 1.000 baris terlalu dekat. Berapa utility gap dan disclosure risk?",
          options: [
            { text: "3,0 persen dan 1,2 persen", why: "Tepat: 37.500/1.250.000 = 3,0; 12/1.000 = 1,2.", correct: true },
            { text: "3,0 persen dan 12,0 persen", why: "Salah: 12,0 persen adalah hasil bila pembaginya 100, bukan 1.000." },
            { text: "30,0 persen dan 1,2 persen", why: "Salah: 30,0 persen adalah hasil bila selisihnya 375.000, bukan 37.500." },
            { text: "0,3 persen dan 0,12 persen", why: "Salah: keduanya sepuluh kali lebih kecil — koma desimal salah tempat." },
          ],
        },
        {
          q: "Utility gap 3,0 persen, disclosure risk 1,2 persen. Apa keputusan berbagi yang benar?",
          options: [
            { text: "Bagikan bebas — kedua angka kecil", why: "Salah: disclosure 1,2 persen di atas ambang aman 1 persen. Bagikan bebas berarti mengabaikan 12 baris yang terlalu dekat." },
            { text: "Bagikan dengan syarat — hapus 12 baris yang terlalu dekat dan catat di perjanjian", why: "Tepat: utility baik, disclosure sedikit di atas ambang — syaratnya adalah membersihkan baris itu.", correct: true },
            { text: "Jangan bagikan — disclosure di atas 1 persen berarti gagal", why: "Salah: di atas 1 persen bukan gagal total; ambang jangan-bagikan adalah di atas 5 persen." },
            { text: "Latih ulang GAN sampai disclosure nol", why: "Salah: disclosure nol hampir tidak mungkin tanpa menghancurkan utility. Yang benar adalah mengelola, bukan menghilangkan." },
          ],
        },
        {
          q: "Sebuah tim ingin melatih model deteksi fraud produksi. Bolehkah memakai data sintetis?",
          options: [
            { text: "Boleh — data sintetis lebih bersih dari data asli", why: "Salah: 'bersih' justru masalahnya — data sintetis meniru asumsi pembuatnya, bukan pola penipu nyata." },
            { text: "Tidak — model akan belajar fiksi yang rapi dan gagal di dunia nyata", why: "Tepat: ini larangan mutlak lesson ini dan jawaban yang benar di FR4.", correct: true },
            { text: "Boleh bila dicampur 50:50 dengan data asli", why: "Salah: mencampur tidak memperbaiki masalah — separuh pelatihan tetap belajar fiksi." },
            { text: "Boleh bila GAN-nya sudah sangat bagus", why: "Salah: GAN yang bagus pun tidak mempelajari pola langka 0,02 persen. 'Bagus' di pengujian bukan 'benar' di produksi." },
          ],
        },
        {
          q: "Apa yang terjadi saat discriminator GAN tidak lagi bisa membedakan asli dan palsu?",
          options: [
            { text: "GAN gagal — discriminator harus selalu menang", why: "Salah: terbalik. Discriminator yang tidak bisa membedakan berarti generator sudah cukup baik." },
            { text: "Generator dianggap cukup baik — tebakannya sekitar 50 persen, setara koin", why: "Tepat: itulah titik keseimbangan GAN.", correct: true },
            { text: "Generator harus dilatih dari nol lagi", why: "Salah: tidak ada yang rusak — ini justru tujuan latihannya." },
            { text: "Data sintetis otomatis aman dibagikan", why: "Salah: bagus secara statistik tidak berarti aman secara privasi — disclosure risk tetap harus diukur." },
          ],
        },
        {
          q: "Generator yang terlalu setia meniru data asli menghasilkan apa?",
          options: [
            { text: "Utility gap kecil dan disclosure risk kecil — paket ideal", why: "Salah: terlalu setia berarti menghafal — disclosure risk justru besar." },
            { text: "Utility gap kecil tetapi disclosure risk besar — ia menghafal, bukan menggeneralisasi", why: "Tepat: inilah trade-off inti data sintetis.", correct: true },
            { text: "Utility gap besar dan disclosure risk besar", why: "Salah: utility gap kecil adalah ciri peniruan yang setia." },
            { text: "Tidak ada efek — kesetiaan tidak memengaruhi privasi", why: "Salah: kesetiaan berlebih adalah penyebab utama kebocoran privasi data sintetis." },
          ],
        },
      ],
    },
  ],
};
