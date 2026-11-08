import type { V2Lesson } from "../lib/types";

export const hd37: V2Lesson = {
  slug: "hd37-cdss",
  track: "Health Data Science",
  module: "Data Science Klinis",
  title: "HD37 — CDSS: Sistem Pendukung Keputusan Klinis",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "500 alert, 320 yang benar — dan 340 yang diabaikan",
      prose: [
        "Sebuah rumah sakit memasang CDSS (Clinical Decision Support System) untuk mencegah interaksi obat berbahaya. Dalam sebulan, sistem memunculkan 500 alert. Dari 500 itu, 320 benar-benar menandai interaksi berbahaya — PPV 64 persen. Tetapi dokter mengabaikan (override) 340 alert — 68 persen. Di antara 400 kejadian interaksi nyata bulan itu, sistem menangkap 320 — sensitivitas 80 persen. Artinya 80 kejadian berbahaya lolos tanpa alert.",
        "Manajemen melihat 68 persen override dan menyimpulkan dokter 'bandel'. Analis melihat angka yang sama dan menyimpulkan sebaliknya: sistem yang memunculkan 180 alert salah (36 persen) melatih dokter untuk mengabaikan semuanya — termasuk yang benar. Alert fatigue bukan masalah kedisiplinan; ia adalah masalah desain.",
        "Lesson ini mengajarkan CDSS: jenis, desain, evaluasi, dan implementasi. Setelah lesson ini kamu bisa: (1) menjelaskan jenis CDSS dan kapan masing-masing dipakai; (2) menghitung PPV, sensitivitas, dan override rate; (3) menjelaskan alert fatigue dan cara menguranginya; (4) merancang evaluasi CDSS sebelum dan sesudah go-live; (5) memutuskan kapan alert harus hard stop dan kapan cukup peringatan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson HD yang membahas CDSS — grep CDSS dan clinical decision support di seluruh track menghasilkan nol. HD12 mengajarkan model prediksi klinis (TRIPOD, kalibrasi) dan HD32 mengajarkan deployment real-time, tetapi sistem yang MEMBERI REKOMENDASI di titik perawatan — desain aturan, alert, dan evaluasinya — belum pernah diajarkan. Lesson ini mengisi celah itu.",
      },
      reference: "500 alert: 320 benar (PPV 64 persen); override 340 (68 persen); 400 kejadian nyata, 320 tertangkap (sensitivitas 80 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang dan menilai CDSS yang dokter mau pakai — bukan yang mereka abaikan.",
        "(1) Menjelaskan jenis CDSS: alert, order set, kalkulator, dan dokumentasi terpandu;",
        "(2) Menghitung PPV, sensitivitas, dan override rate dari data operasional;",
        "(3) Menjelaskan alert fatigue: penyebab, ukuran, dan mitigasi;",
        "(4) Merancang evaluasi: sebelum go-live, sesudah go-live, dan berkelanjutan;",
        "(5) Memutuskan hard stop vs soft alert dari tingkat bahaya dan bukti.",
      ],
      tasks: [],
    },
    {
      id: "jenis",
      eyebrow: "Langkah 3 · Teori",
      title: "Jenis CDSS: dari alert sampai order set",
      prose: [
        "ALERT DAN REMINDER adalah jenis paling dikenal: sistem memunculkan peringatan saat mendeteksi masalah — interaksi obat, alergi, dosis di luar rentang, hasil lab kritis. Alert bekerja di titik keputusan, tetapi juga paling rentan terhadap fatigue. ORDER SET adalah paket order standar untuk satu kondisi — misalnya order set sepsis (kultur darah, laktat, antibiotik, cairan) — yang mengurangi kelalaian dengan membuat jalur yang benar menjadi jalur termudah.",
        "KALKULATOR DAN SKOR adalah CDSS yang menghitung: skor risiko (misalnya CHA2DS2-VASc untuk stroke pada fibrilasi atrium), dosis berdasarkan berat badan dan fungsi ginjal, atau probabilitas (kalkulator Wells untuk emboli paru). Keunggulannya: tidak mengganggu — dokter meminta saat butuh. DOKUMENTASI TERPANDU adalah template dan checklist yang memastikan data yang dibutuhkan keputusan tercatat — misalnya template yang menanyakan skor nyeri sebelum resep opioid bisa ditulis.",
        "Dua arsitektur pengetahuan. BERBASIS ATURAN (knowledge-based): aturan if-then yang ditulis pakar — 'bila pasien alergi penisilin DAN order amoksisilin, MAKA alert'. Transparan dan bisa diaudit, tetapi butuh pemeliharaan manual saat pedoman berubah. BERBASIS DATA (non-knowledge-based): model ML yang belajar dari data — 'pasien seperti ini berisiko 80 persen mengalami perburukan'. Kuat untuk pola kompleks, tetapi butuh validasi seperti model apa pun (HD12) dan penjelasannya lebih sulit.",
        "Prinsip desain 'Five Rights' dari Health IT: informasi yang BENAR, ke orang yang BENAR, dalam format yang BENAR, melalui saluran yang BENAR, pada waktu yang BENAR. Alert interaksi obat yang muncul saat dokter sudah menandatangani order adalah informasi benar pada waktu yang salah — ia akan diabaikan, dan benar diabaikan.",
      ],
      tasks: [],
      note: {
        title: "CDSS bukan autopilot",
        body: "CDSS mendukung keputusan — ia tidak mengambilnya. Dokter tetap penanggung jawab klinis; sistem yang dirancang seolah menggantikan penilaian dokter akan ditolak — benar ditolak. Desain yang baik membuat keputusan yang benar lebih mudah, bukan membuat keputusan menggantikan dokter.",
      },
      reference: "Jenis: alert, order set, kalkulator/skor, dokumentasi terpandu. Arsitektur: berbasis aturan vs berbasis data. Five Rights.",
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Evaluasi: PPV, sensitivitas, dan override rate",
      prose: [
        "Tiga angka yang menilai CDSS dari data operasional. PPV (positive predictive value): dari semua alert, berapa persen yang benar — 320 dari 500 sama dengan 64 persen. PPV rendah berarti dokter dibombardir alert salah — dan tiap alert salah melatih mereka mengabaikan alert berikutnya. Sensitivitas: dari semua kejadian nyata, berapa persen yang ditangkap — 320 dari 400 sama dengan 80 persen. Sensitivitas 80 persen berarti 80 kejadian berbahaya lolos — angka yang harus dibaca bersama PPV: menaikkan sensitivitas dengan menurunkan ambang biasanya menurunkan PPV.",
        "OVERRIDE RATE: dari semua alert, berapa persen yang diabaikan — 340 dari 500 sama dengan 68 persen. Override rate tinggi bukan vonis dokter 'bandel' — ia adalah sinyal desain: alert yang sering di-override dengan benar (dokter punya alasan klinis yang valid) harus diperbaiki atau dihapus; alert yang di-override dengan alasan 'lelah' harus dikurangi jumlahnya. Analisis ALASAN override — bukan hanya angkanya — adalah evaluasi yang sebenarnya.",
        "Evaluasi dilakukan tiga kali. SEBELUM go-live: uji retrospektif pada data historis — berapa alert yang AKAN muncul, berapa yang benar. Ini mencegah bencana: sistem yang akan memunculkan 5.000 alert sehari tidak boleh go-live. SESUDAH go-live: 30, 90, dan 180 hari — PPV, sensitivitas, override, dan dampak klinis (apakah kejadian berbahaya benar-benar turun?). BERKELANJUTAN: pemantauan bulanan — pedoman berubah, obat baru muncul, dan aturan yang tidak diperbarui menjadi usang.",
        "Satu metrik yang sering dilupakan: WAKTU. Berapa detik alert menambah waktu tiap order? CDSS yang menghemat satu kesalahan tetapi menambah 30 detik per pasien — dikali 100 pasien sehari — menghabiskan 50 menit dokter per hari. Sistem yang tidak menghitung biaya waktu akan kalah oleh sistem yang menghitungnya — berapa pun benarnya.",
        "Dua hal yang tidak ditangkap tiga angka di atas: PRIVASI dan TATA KELOLA, plus VALIDASI KESELAMATAN. CDSS membaca data pasien — siapa boleh melihat alert siapa, berapa lama log alert disimpan, dan apakah pasien tahu sistem ikut memengaruhi perawatannya, adalah pertanyaan tata kelola, bukan statistik. Dan sebelum go-live, aturan harus diuji pada data historis untuk dua kegagalan: alert yang seharusnya muncul tetapi tidak (miss) dan alert yang memblokir order yang sebenarnya aman (false hard stop). Tanpa uji keduanya, go-live adalah eksperimen pada pasien.",
      ],
      tasks: [],
      note: {
        title: "Trade-off sensitivitas vs PPV",
        body: "Dalam praktik, tidak ada CDSS nyata yang punya sensitivitas 100 persen DAN PPV 100 persen sekaligus — keduanya bertukar lewat ambang. (Secara teori mungkin pada populasi kecil dengan kejadian yang terpisah sempurna — tetapi itu bukan sistem yang dihadapi di lapangan.) Menurunkan ambang menangkap lebih banyak kejadian nyata (sensitivitas naik) tetapi juga lebih banyak alarm palsu (PPV turun). Ambang yang benar adalah keputusan klinis dan operasional — bukan default vendor. Tanyakan: berapa alarm palsu yang sanggup ditanggung dokter sebelum mereka berhenti mendengarkan?",
      },
      reference: "PPV 64 persen; sensitivitas 80 persen; override 68 persen. Evaluasi: sebelum, sesudah (30/90/180 hari), berkelanjutan.",
    },
    {
      id: "lab-cdss",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung metrik evaluasi CDSS",
      prose: [
        "Lab ini membangun kalkulator evaluasi CDSS: dari jumlah alert, alert benar, alert yang di-override, kejadian nyata, dan kejadian yang tertangkap — hitung PPV, override rate, dan sensitivitas.",
        "Hitung dulu di kepala. PPV: 320 alert benar dibagi 500 alert dikali 100 sama dengan 64 persen. Override rate: 340 diabaikan dibagi 500 dikali 100 sama dengan 68 persen. Sensitivitas: 320 tertangkap dibagi 400 kejadian nyata dikali 100 sama dengan 80 persen.",
        "Tugas lab: tulis fungsi yang menerima alert total, alert benar, override, kejadian nyata, dan tertangkap — lalu mencetak tiga angka: ppv_persen, override_persen, sensitivitas_persen. Tiga angka ini adalah dashboard bulanan CDSS yang dibaca komite keselamatan pasien.",
        "Setelah lolos, coba eksperimen: turunkan ambang sehingga alert menjadi 800 dan tertangkap menjadi 380 — PPV turun menjadi 47,5 persen, sensitivitas naik menjadi 95 persen. Lalu tanyakan: apakah dokter akan mendengarkan sistem dengan PPV 47,5 persen — atau justru mengabaikan lebih banyak?",
      ],
      tasks: [
        { id: "t1", text: "Hitung PPV dari alert benar dan total alert" },
        { id: "t2", text: "Hitung override rate" },
        { id: "t3", text: "Hitung sensitivitas dari kejadian yang tertangkap" },
      ],
      expected: "ppv_persen=64.0\noverride_persen=68.0\nsensitivitas_persen=80.0",
      hints: [
        "PPV persen = alert benar dibagi total alert, dikali 100.",
        "Override persen = override dibagi total alert, dikali 100.",
        "Sensitivitas persen = tertangkap dibagi kejadian nyata, dikali 100.",
        "Ketiganya memakai pembagi yang berbeda — jangan tertukar.",
      ],
      code: {
        starter: `# Kalkulator evaluasi CDSS: satu bulan operasional.\nalert_total = 500\nalert_benar = 320\noverride = 340\nkejadian_nyata = 400\ntertangkap = 320\n\n# TULIS KODEMU: hitung tiga angka evaluasi di bawah ini.\n# Cetak, per baris: ppv_persen, override_persen,\n# sensitivitas_persen.\n\n\nkalkulator_cdss(alert_total, alert_benar, override, kejadian_nyata, tertangkap)`,
        lockLines: 5,
        solution: `# Kalkulator evaluasi CDSS: satu bulan operasional.\nalert_total = 500\nalert_benar = 320\noverride = 340\nkejadian_nyata = 400\ntertangkap = 320\n\n\ndef kalkulator_cdss(alert_total, alert_benar, override, kejadian_nyata, tertangkap):\n    ppv_persen = alert_benar / alert_total * 100\n    override_persen = override / alert_total * 100\n    sensitivitas_persen = tertangkap / kejadian_nyata * 100\n    print(f"ppv_persen={ppv_persen}")\n    print(f"override_persen={override_persen}")\n    print(f"sensitivitas_persen={sensitivitas_persen}")\n\n\nkalkulator_cdss(alert_total, alert_benar, override, kejadian_nyata, tertangkap)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "ppv_persen=64.0", label: "PPV 64 persen", msg: "320 / 500 x 100 = 64 persen. 36 persen alert adalah alarm palsu." },
          { kind: "stdout_matches", task: "t2", pattern: "override_persen=68.0", label: "Override 68 persen", msg: "340 / 500 x 100 = 68 persen. Sinyal desain — bukan vonis dokter." },
          { kind: "stdout_matches", task: "t3", pattern: "sensitivitas_persen=80.0", label: "Sensitivitas 80 persen", msg: "320 / 400 x 100 = 80 persen. 80 kejadian berbahaya lolos tanpa alert." },
        ],
      },
      reference: "PPV 64 persen; override 68 persen; sensitivitas 80 persen.",
    },
    {
      id: "fatigue",
      eyebrow: "Langkah 6 · Teori",
      title: "Alert fatigue: ketika sistem yang benar diabaikan",
      prose: [
        "Alert fatigue adalah kelelahan yang terukur: dokter yang menerima puluhan alert sehari mulai mengabaikannya secara refleks — termasuk yang benar. Mekanismenya sederhana: tiap alert salah menurunkan kepercayaan pada alert berikutnya. Pada PPV 64 persen, lebih dari sepertiga alert salah — cukup untuk melatih pengabaian. Pada PPV 20 persen, sistem praktis tidak didengarkan lagi.",
        "Lima mitigasi yang terbukti. Pertama, TIERING: hanya alert paling berbahaya yang interruptif (memaksa berhenti); sisanya pasif (tampil di panel, bisa dibaca nanti). Kedua, KONTEKS: alert yang tahu konteks pasien — dosis yang 'berlebih' untuk dewasa bisa jadi benar untuk pasien tertentu — tidak memunculkan alert yang dokter tahu salah. Ketiga, SUPRESI DUPLIKAT: alert yang sama untuk pasien yang sama tidak diulang tiap order. Keempat, UMPAN BALIK: dokter bisa menandai 'alert ini tidak berguna' — dan tim menindaklanjutinya tiap bulan. Kelima, HARD STOP yang hemat: hanya untuk bahaya yang tidak bisa dinegosiasikan — alergi anafilaksis yang terdokumentasi, bukan semua interaksi ringan.",
        "Hard stop adalah keputusan paling berat dalam desain CDSS: ia memblokir order dan memaksa dokter mencari jalan lain. Hard stop yang benar menyelamatkan nyawa; hard stop yang salah — misalnya memblokir obat yang sebenarnya dibutuhkan dengan alasan yang bisa dinegosiasikan — membuat dokter mencari jalan pintas (memesan lewat jalur lain, menonaktifkan sistem) yang lebih berbahaya dari alert itu sendiri. Aturan: hard stop hanya untuk bahaya yang pasti, serius, dan tidak bisa dinilai dokter dalam waktu yang tersedia.",
      ],
      tasks: [],
      note: {
        title: "Ukur fatigue, jangan menebaknya",
        body: "Alert fatigue bisa diukur: override rate per alert, waktu respons terhadap alert, dan — yang paling penting — tingkat override pada alert yang BENAR. Bila override pada alert benar naik dari 5 persen menjadi 30 persen, sistem sedang kehilangan kepercayaan — berapa pun bagusnya metrik lain. Itulah alarm yang harus didengarkan.",
      },
      reference: "Lima mitigasi: tiering, konteks, supresi duplikat, umpan balik, hard stop hemat.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: dari 500 alert ke 120 — dan PPV naik",
      prose: [
        "Kembali ke rumah sakit. Tim CDSS menganalisis alasan override selama sebulan: 180 alert salah sebagian besar adalah interaksi ringan yang sudah diketahui dokter dan dosis yang 'berlebih' menurut aturan tetapi benar menurut konteks pasien. Mereka melakukan tiga perubahan: alert ringan menjadi pasif (tidak interruptif), aturan dosis diberi konteks fungsi ginjal, dan duplikat disupresi.",
        "Bulan berikutnya: alert turun dari 500 menjadi 120. PPV naik dari 64 persen menjadi 88 persen (106 benar dari 120; tepatnya 88,3 persen, dibulatkan). Override turun dari 68 persen menjadi 22 persen (26 dari 120; tepatnya 21,7 persen, dibulatkan). Sensitivitas turun sedikit — dari 80 persen menjadi 78 persen (312 dari 400) — karena beberapa alert ringan yang dihapus ternyata menangkap kejadian. Komite memutuskan trade-off itu layak: sistem yang didengarkan dengan sensitivitas 78 persen DIPERKIRAKAN menyelamatkan lebih banyak pasien daripada sistem yang diabaikan dengan sensitivitas 80 persen — tetapi ini inferensi dari angka alert, bukan hasil yang terukur: lesson ini tidak punya data outcome pasien (berapa kejadian berbahaya yang benar-benar dicegah). Vonis akhirnya menunggu data outcome.",
        "Tiga hal yang membuat perubahan ini berhasil. Pertama, keputusan diambil dari DATA alasan override — bukan dari opini. Kedua, trade-off dihitung dan diputuskan secara eksplisit — bukan terjadi diam-diam. Ketiga, pemantauan berlanjut: PPV dan override dibaca tiap bulan, dan ambang dikalibrasi ulang tiap kuartal.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: CDSS yang baik bukan yang paling banyak memperingatkan — melainkan yang paling didengarkan. Mengurangi alert dari 500 menjadi 120 terasa seperti 'melemahkan' sistem, tetapi nyatanya memperkuatnya: PPV 88 persen berarti dokter percaya — dan kepercayaan adalah satu-satunya metrik yang membuat alert bekerja.",
      },
      reference: "Sesudah perbaikan: 120 alert, PPV 88 persen (106/120 = 88,3 persen), override 22 persen (26/120 = 21,7 persen), sensitivitas 78 persen. Trade-off diputuskan eksplisit.",
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
        "Jenis: alert, order set, kalkulator/skor, dokumentasi terpandu; aturan vs data.",
        "Evaluasi: PPV 64 persen; sensitivitas 80 persen; override 68 persen.",
        "Lab: ppv 64,0; override 68,0; sensitivitas 80,0.",
        "Alert fatigue: PPV rendah melatih pengabaian — mitigasi tiering, konteks, supresi, umpan balik.",
        "Hard stop hanya untuk bahaya pasti, serius, dan tidak bisa dinilai cepat.",
      ],
      next: { label: "HD38 — MIMIC-III: Hands-On Database EHR Publik", href: "/v2/learn/hd38-mimic-iii" },
      quiz: [
        {
          q: "CDSS satu bulan: 500 alert, 320 benar; 340 di-override; 400 kejadian nyata, 320 tertangkap. Berapa PPV, override rate, dan sensitivitas?",
          options: [
            { text: "PPV 64 persen; override 68 persen; sensitivitas 80 persen", why: "Tepat: 320/500 = 64 persen; 340/500 = 68 persen; 320/400 = 80 persen.", correct: true },
            { text: "PPV 80 persen; override 68 persen; sensitivitas 64 persen", why: "Salah: PPV dan sensitivitas tertukar — PPV memakai pembagi alert (500), sensitivitas memakai pembagi kejadian nyata (400)." },
            { text: "PPV 64 persen; override 32 persen; sensitivitas 80 persen", why: "Salah: override 340/500 = 68 persen, bukan 32 — 32 persen adalah yang TIDAK di-override." },
            { text: "PPV 36 persen; override 68 persen; sensitivitas 20 persen", why: "Salah: 36 persen adalah proporsi alert SALAH (180/500); 20 persen adalah proporsi kejadian yang LOLOS (80/400) — kebalikan dari yang ditanya." },
          ],
        },
        {
          q: "Override rate 68 persen. Apa kesimpulan yang benar?",
          options: [
            { text: "Dokter bandel — perlu pelatihan disiplin", why: "Salah: override tinggi adalah sinyal desain. Analisis alasan override dulu sebelum menyalahkan pengguna." },
            { text: "Sinyal desain: analisis alasan override — alert salah yang berulang harus diperbaiki atau dihapus", why: "Tepat: 180 alert salah melatih pengabaian. Perbaiki sistemnya, bukan dokternya.", correct: true },
            { text: "Sistem gagal total — matikan CDSS", why: "Salah: PPV 64 persen dan sensitivitas 80 persen berarti sistem menangkap 320 kejadian berbahaya. Mematikan berarti kehilangan itu." },
            { text: "Normal — semua CDSS punya override 68 persen", why: "Salah: tidak ada angka 'normal' universal. Override harus dibaca bersama PPV dan alasan override." },
          ],
        },
        {
          q: "Setelah perbaikan: 120 alert, 106 benar, override 22 persen, sensitivitas 78 persen (dari 80 persen). Apa vonis komite yang benar?",
          options: [
            { text: "Gagal — sensitivitas turun berarti pasien lebih tidak aman", why: "Salah: sensitivitas turun 2 poin, tetapi override turun 46 poin — sistem yang didengarkan dengan 78 persen DIPERKIRAKAN menyelamatkan lebih banyak daripada sistem yang diabaikan dengan 80 persen, dengan catatan ini inferensi dari metrik alert, bukan outcome pasien yang terukur." },
            { text: "Berhasil — trade-off diputuskan eksplisit: PPV 88 persen dan override 22 persen berarti alert didengarkan; penurunan sensitivitas 2 poin diterima", why: "Tepat: keputusan memakai angka lengkap, bukan satu metrik.", correct: true },
            { text: "Berhasil — karena jumlah alert turun", why: "Salah: jumlah alert bukan metrik keberhasilan. Yang penting PPV, override, dan sensitivitas bersama." },
            { text: "Tidak bisa dinilai — butuh setahun data lagi", why: "Salah: sebulan data operasional dengan metrik lengkap cukup untuk vonis awal — pemantauan berlanjut, tetapi keputusan tidak menunggu setahun." },
          ],
        },
        {
          q: "Kapan hard stop (memblokir order) dibenarkan?",
          options: [
            { text: "Untuk semua interaksi obat — lebih aman memblokir", why: "Salah: hard stop untuk semua interaksi membuat dokter mencari jalan pintas yang lebih berbahaya." },
            { text: "Hanya untuk bahaya yang pasti, serius, dan tidak bisa dinilai dokter dalam waktu yang tersedia", why: "Tepat: hard stop adalah alat paling berat — dipakai hemat, untuk bahaya yang tidak bisa dinegosiasikan.", correct: true },
            { text: "Untuk interaksi ringan — agar dokter memperhatikan", why: "Salah: terbalik — interaksi ringan justru harus pasif, bukan hard stop." },
            { text: "Tidak pernah — dokter selalu lebih tahu", why: "Salah: ada bahaya (alergi anafilaksis terdokumentasi) di mana blokir menyelamatkan nyawa — dokter manusia bisa salah baca riwayat." },
          ],
        },
        {
          q: "Ambang diturunkan: alert menjadi 800, tertangkap 380 dari 400 kejadian. PPV menjadi 47,5 persen, sensitivitas 95 persen. Apa risikonya?",
          options: [
            { text: "Tidak ada risiko — sensitivitas naik selalu baik", why: "Salah: PPV 47,5 persen berarti lebih dari separuh alert salah — dokter akan berhenti mendengarkan, termasuk alert yang benar." },
            { text: "Alert fatigue memburuk: PPV 47,5 persen melatih pengabaian — sensitivitas di atas kertas tidak menyelamatkan bila alert diabaikan", why: "Tepat: sensitivitas mengukur yang TERTANGKAP sistem, bukan yang DITINDAKLANJUTI dokter.", correct: true },
            { text: "Risikonya hanya biaya komputasi yang naik", why: "Salah: biaya komputasi bukan risiko utamanya — kehilangan kepercayaan dokterlah risikonya." },
            { text: "PPV 47,5 persen masih baik — di atas 40 persen", why: "Salah: tidak ada ambang 'baik' universal untuk PPV — yang penting adalah apakah dokter masih mendengarkan. Pada 47,5 persen, buktinya berkata tidak." },
          ],
        },
      ],
    },
  ],
};
