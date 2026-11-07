import type { V2Lesson } from "../lib/types";

export const pma1d: V2Lesson = {
  slug: "pm-a1d-ethics-basis-suitability",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A1D Standard V & Suitability: Basis Riset yang Layak",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-rekomendasi",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rekomendasi yang disalin, portofolio yang tak cocok",
      prose: [
        "Tono adalah analis di sebuah sekuritas. Pagi ini ia menerbitkan rekomendasi BELI untuk emiten Z — angka-angkanya disalin dari presentasi emiten tanpa satu pun verifikasi independen. Sorenya, manajer investasi di kantor yang sama menawarkan portofolio saham growth 90% kepada Ibu Ratna, pensiunan 65 tahun yang dananya adalah satu-satunya sumber penghasilan dan yang tidak tahan melihat portofolionya turun lebih dari Rp500 juta.",
        "Tiga bulan kemudian emiten Z merilis laba yang jauh di bawah presentasinya, dan portofolio Ibu Ratna turun 18% dalam satu kuartal. Dua kegagalan dalam satu cerita: rekomendasi tanpa basis riset yang memadai, dan rekomendasi yang tidak cocok dengan profil kliennya.",
        "Lesson ini tentang Standard V — analisis investasi, rekomendasi, dan tindakan — serta Standard III(C) Suitability. Bila PM-A1 dan PM-A1B menguji “jangan berbohong dan jangan mencuri”, lesson ini menguji “jangan malas dan jangan asal cocok”: rekomendasi harus dibangun di atas riset yang layak dan harus cocok dengan orang yang menerimanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira rekomendasi yang benar hasilnya pasti patuh. Standar V menilai proses: rekomendasi yang untung tetapi tanpa basis tetap melanggar V(A), dan rekomendasi yang cocok return-nya tetapi melampaui toleransi risiko klien tetap melanggar III(C).",
      },
      reference: "Standard V: riset yang layak, komunikasi yang jujur, catatan yang tersimpan. III(C): rekomendasi harus cocok dengan klien.",
    },
    {
      id: "v-a-basis",
      eyebrow: "Langkah 2 · Standard V(A)",
      title: "Diligence & Reasonable Basis: riset sebelum rekomendasi",
      prose: [
        "Standard V(A) berbunyi: anggota dan kandidat wajib menjalankan uji tuntas (diligence), melakukan analisis independen, dan memiliki basis yang wajar (reasonable basis) sebelum membuat rekomendasi investasi atau mengambil tindakan investasi. Sederhananya: jangan merekomendasikan apa yang belum kamu periksa sendiri.",
        "Tiga unsur yang dinilai pemeriksa. Satu, ketekunan: apakah analis memeriksa laporan keuangan, menguji asumsi, dan memverifikasi angka — atau hanya menyalin presentasi emiten? Dua, independensi penilaian: apakah kesimpulannya hasil analisis sendiri, atau sekadar mengulang konsensus? Tiga, basis yang wajar: apakah data dan metode yang dipakai cukup untuk menopang kesimpulan yang dibuat?",
        "Di sinilah mosaic theory berlaku: analis BOLEH menggabungkan informasi publik — laporan keuangan, berita, kunjungan pabrik, percakapan dengan manajemen — dengan analisisnya sendiri menjadi kesimpulan investasi, meski kesimpulan itu ternyata bernilai. Yang TIDAK BOLEH adalah memakai informasi material nonpublik (II(A)) sebagai bahan mozaik. Garisnya: bahan publik + analisis sendiri = mozaik yang sah; bahan nonpublik = pelanggaran, betapapun cerdas analisisnya.",
        "Contoh yang sering muncul di vignette: analis menerbitkan rekomendasi berdasarkan “feeling” tanpa model, atau menyalin target harga dari riset pesaing tanpa memahami asumsinya. Keduanya melanggar V(A) — yang pertama karena tidak ada basis, yang kedua karena tidak ada analisis independen.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tono menerbitkan rekomendasi BELI dengan angka yang disalin dari presentasi emiten tanpa verifikasi. Ini?",
          options: [
            { text: "Boleh — presentasi emiten adalah sumber resmi", why: "Salah: sumber resmi tetap harus diverifikasi. Menyalin tanpa memeriksa bukan analisis independen.", },
            { text: "Pelanggaran V(A) — tanpa diligence dan reasonable basis", why: "Benar: rekomendasi wajib didukung riset dan verifikasi sendiri, bukan salinan presentasi.", correct: true },
            { text: "Hanya pelanggaran bila rekomendasinya salah", why: "Salah: standar menilai proses, bukan hasil — rekomendasi yang kebetulan benar tetap melanggar bila tanpa basis.", },
          ],
        },
        {
          q: "Analis menggabungkan laporan keuangan publik, kunjungan pabrik, dan modelnya sendiri menjadi rekomendasi BELI. Ini?",
          options: [
            { text: "Pelanggaran — ia memakai info yang tidak semua orang punya", why: "Salah: menggabungkan info publik dengan analisis sendiri adalah mosaic theory yang diperbolehkan.", },
            { text: "Boleh — mosaic theory: bahan publik + analisis sendiri", why: "Benar: selama semua bahannya publik dan kesimpulannya hasil analisis sendiri, ini riset yang sah.", correct: true },
            { text: "Pelanggaran II(A)", why: "Salah: II(A) soal info material nonpublik — tidak ada bahan nonpublik dalam mozaik ini.", },
          ],
        },
      ],
      reference: "V(A): diligence + analisis independen + reasonable basis. Mosaic theory: bahan publik + analisis sendiri = sah.",
    },
    {
      id: "v-b-c",
      eyebrow: "Langkah 3 · Standard V(B) & V(C)",
      title: "Komunikasi yang jujur dan catatan yang tersimpan",
      prose: [
        "Standard V(B) Communication with Clients and Prospective Clients berbunyi: anggota dan kandidat wajib mengungkapkan kepada klien dan calon klien setiap fakta material yang dapat memengaruhi analisis, rekomendasi, atau tindakannya — termasuk keterbatasan analisis, perubahan asumsi, dan konflik yang relevan. Rekomendasi yang disajikan tanpa keterbatasannya adalah rekomendasi yang menyesatkan, meski angkanya benar.",
        "Contoh klasik: model valuasi yang sensitif terhadap satu asumsi (misal pertumbuhan 4%) wajib disertai pengungkapan bahwa perubahan asumsi 1 poin mengubah nilai wajar secara material. Analis yang menyajikan satu angka tanpa rentang atau sensitivitas melanggar V(B) — klien tidak diberi kesempatan menilai seberapa rapuh kesimpulan itu.",
        "Standard V(C) Record Retention berbunyi: anggota dan kandidat wajib mengembangkan dan memelihara catatan yang memadai untuk mendukung analisis, rekomendasi, tindakan, dan komunikasi terkait investasi dengan klien. Catatan adalah bukti bahwa riset itu pernah dilakukan: model, sumber data, tanggal, dan alasan keputusan. Panduan praktik yang umum dipakai adalah menyimpan catatan minimal tujuh tahun; regulasi lokal dapat menetapkan jangka waktu yang berbeda dan harus dipatuhi bila lebih ketat.",
        "Kenapa pemeriksa suka menguji V(C)? Karena jawabannya sering tersembunyi dalam satu kalimat vignette: “ia tidak menyimpan catatan” atau “modelnya tidak terdokumentasi”. Bila rekomendasi tidak bisa dibuktikan pernah diriset, pemeriksa menganggap riset itu tidak pernah ada.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Analis menyajikan nilai wajar tunggal tanpa menyebut bahwa modelnya sangat sensitif terhadap asumsi pertumbuhan. Ini?",
          options: [
            { text: "Boleh — angka tunggal lebih mudah dipahami klien", why: "Salah: kemudahan tidak menghapus kewajiban mengungkapkan fakta material, termasuk keterbatasan model.", },
            { text: "Pelanggaran V(B) — tidak mengungkapkan keterbatasan material", why: "Benar: klien berhak tahu seberapa rapuh kesimpulan yang ia terima.", correct: true },
            { text: "Hanya pelanggaran bila nilainya salah", why: "Salah: standar menilai kelengkapan komunikasi, bukan kebenaran hasil.", },
          ],
        },
        {
          q: "Manajer tidak menyimpan catatan pendukung rekomendasi-rekomendasinya selama tiga tahun terakhir. Ini?",
          options: [
            { text: "Boleh — catatan hanya perlu disimpan bila ada sengketa", why: "Salah: kewajiban menyimpan catatan berlaku sejak rekomendasi dibuat, bukan saat sengketa muncul.", },
            { text: "Pelanggaran V(C) — tidak memelihara catatan pendukung", why: "Benar: tanpa catatan, rekomendasi tidak bisa dibuktikan pernah diriset. Panduan praktik: simpan minimal tujuh tahun.", correct: true },
            { text: "Hanya pelanggaran bila klien meminta catatan itu", why: "Salah: kewajiban V(C) berdiri sendiri dan tidak menunggu permintaan klien.", },
          ],
        },
      ],
      reference: "V(B): ungkapkan fakta material dan keterbatasan analisis. V(C): simpan catatan pendukung — panduan praktik tujuh tahun.",
    },
    {
      id: "iii-c-suitability",
      eyebrow: "Langkah 4 · Standard III(C)",
      title: "Suitability: rekomendasi harus cocok dengan kliennya",
      prose: [
        "Standard III(C) Suitability berbunyi: anggota dan kandidat wajib memastikan rekomendasi atau tindakannya cocok (suitable) bagi klien, berdasarkan tujuan, horizon, toleransi risiko, dan kendala klien sebagaimana tercermin dalam Investment Policy Statement (IPS). Rekomendasi yang bagus untuk satu klien bisa menjadi pelanggaran untuk klien lain.",
        "Dua langkah yang dinilai pemeriksa. Satu, kenali klienmu (know your client): kumpulkan tujuan return, kebutuhan likuiditas, horizon, toleransi risiko, situasi pajak, dan kendala unik — sebelum merekomendasikan apa pun. Dua, cocokkan rekomendasi dengan profil itu: portofolio yang diusulkan harus memenuhi tujuan return TANPA melampaui toleransi risiko klien.",
        "Kasus tersulit — dan yang paling sering diuji — adalah ketika keduanya bertabrakan: return yang dibutuhkan klien melebihi apa yang bisa diraih dalam batas toleransi risikonya. Jawaban CFA tegas: IPS itu TIDAK LAYAK dan harus direvisi ekspektasinya — turunkan target, tambah dana, atau perpanjang horizon. Yang TIDAK BOLEH adalah memaksa portofolio berisiko tinggi kepada klien yang tidak tahan rugi, demi memenuhi angka return. Memenuhi return dengan mengorbankan kesesuaian adalah pelanggaran III(C), bukan solusi.",
        "Perhatikan hubungan III(C) dengan III(A) Loyalty: kesesuaian adalah wujud loyalitas. Menawarkan produk yang menguntungkan manajer (fee tinggi) tetapi tidak cocok untuk klien melanggar keduanya sekaligus.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Manajer menawarkan portofolio saham growth 90% kepada pensiunan 65 tahun yang dananya satu-satunya sumber penghasilan. Ini?",
          options: [
            { text: "Boleh — return saham growth memang tinggi", why: "Salah: return tinggi tidak relevan bila portofolio itu tidak cocok dengan profil risiko dan kebutuhan klien.", },
            { text: "Pelanggaran III(C) — rekomendasi tidak suitable bagi klien", why: "Benar: portofolio harus cocok dengan tujuan, horizon, dan toleransi risiko klien — bukan sekadar menjanjikan return.", correct: true },
            { text: "Hanya pelanggaran bila portofolionya rugi", why: "Salah: kesesuaian dinilai saat rekomendasi dibuat, bukan dari hasil akhirnya.", },
          ],
        },
        {
          q: "Klien butuh return 9% tetapi hanya tahan rugi Rp500 juta; satu-satunya portofolio yang mencapai 9% berpotensi rugi Rp740 juta. Apa yang benar?",
          options: [
            { text: "Tawarkan portofolio itu — return adalah yang terpenting", why: "Salah: memaksa portofolio berisiko demi return melanggar III(C).", },
            { text: "IPS tidak layak — revisi ekspektasi, tambah dana, atau perpanjang horizon", why: "Benar: bila return yang dibutuhkan melampaui kapasitas risiko, ekspektasi yang harus diubah, bukan toleransi klien yang dilanggar.", correct: true },
            { text: "Sembunyikan potensi ruginya agar klien setuju", why: "Salah: menyembunyikan risiko melanggar V(B) dan III(A) sekaligus.", },
          ],
        },
      ],
      reference: "III(C): kenali klien, cocokkan rekomendasi dengan IPS. Return dibutuhkan melebihi kapasitas risiko = IPS tidak layak, revisi ekspektasi.",
    },
    {
      id: "lab-suitability",
      eyebrow: "Langkah 5 · Lab",
      title: "Ibu Ratna: return cukup, risiko tidak",
      prose: [
        "Ibu Ratna, 65 tahun, memiliki dana Rp4.000 juta — satu-satunya sumber penghasilannya. Ia butuh penarikan Rp240 juta per tahun (6,0% dari dana) dan inflasi 3% per tahun. Ia tidak tahan melihat portofolionya turun lebih dari Rp500 juta dalam setahun.",
        "Dua portofolio ditawarkan. Portofolio A (konservatif): expected return 7,5%, standar deviasi 8%. Portofolio B (moderat): expected return 9,5%, standar deviasi 14%. Lab ini menghitung tiga angka: return yang dibutuhkan Ibu Ratna, kekurangan Portofolio A, dan kerugian dua-sigma Portofolio B — lalu memutuskan apakah B layak.",
        "Perhatikan jebakannya: B memenuhi return (9,5% di atas 9,2% yang dibutuhkan) tetapi gagal di sisi risiko. Pelajaran III(C) yang paling penting justru di sini — return yang cukup tidak otomatis berarti suitable.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `r_butuh` dan `shortfall_a` (kekurangan Portofolio A)" },
        { id: "t2", text: "Hitung `loss_b_2sd` (kerugian dua-sigma Portofolio B, Rp juta) dan flag `layak_b`" },
        { id: "t3", text: "Cetak keempatnya dengan `print`" },
      ],
      expected: "r_butuh=9.2%  shortfall_a=1.68pp  loss_b_2sd=-740  layak_b=False",
      hints: [
        "r_butuh = (1 + tarik/dana) × (1 + inflasi) − 1.",
        "shortfall_a = r_butuh − ret_a.",
        "loss_b_2sd = (ret_b − 2 × sd_b) × dana.",
        "layak_b = return B cukup DAN kerugian dua-sigma dalam toleransi.",
      ],
      code: {
        starter: `# Suitability Ibu Ratna (Rp juta)\ndana, tarik = 4000, 240\ninflasi = 0.03\nret_a, ret_b = 0.075, 0.095\nsd_b = 0.14\ntoleransi = 500\n\n# TULIS KODEMU\nr_butuh = \nshortfall_a = \nloss_b_2sd = \nlayak_b = \n\nprint(f"r_butuh={r_butuh*100:.1f}%  shortfall_a={shortfall_a*100:.2f}pp  loss_b_2sd={loss_b_2sd:.0f}  layak_b={layak_b}")`,
        lockLines: 6,
        solution: `# Suitability Ibu Ratna (Rp juta)\ndana, tarik = 4000, 240\ninflasi = 0.03\nret_a, ret_b = 0.075, 0.095\nsd_b = 0.14\ntoleransi = 500\n\n# TULIS KODEMU\nr_butuh = (1 + tarik / dana) * (1 + inflasi) - 1\nshortfall_a = r_butuh - ret_a\nloss_b_2sd = (ret_b - 2 * sd_b) * dana\nlayak_b = (ret_b >= r_butuh) and (abs(loss_b_2sd) <= toleransi)\n\nprint(f"r_butuh={r_butuh*100:.1f}%  shortfall_a={shortfall_a*100:.2f}pp  loss_b_2sd={loss_b_2sd:.0f}  layak_b={layak_b}")`,
        checks: [
          { kind: "equal", task: "t1", name: "r_butuh", value: 0.0918, tol: 0.001, label: "`r_butuh` sekitar 9,2%", msg: "(1 + 240/4000) × 1,03 − 1 = 9,18%. Itulah return nominal yang dibutuhkan Ibu Ratna." },
          { kind: "equal", task: "t1", name: "shortfall_a", value: 0.0168, tol: 0.001, label: "`shortfall_a` sekitar 1,68pp", msg: "9,18% − 7,5% = 1,68pp — Portofolio A tidak mencapai return yang dibutuhkan." },
          { kind: "equal", task: "t2", name: "loss_b_2sd", value: -740, tol: 1, label: "`loss_b_2sd` sekitar −740", msg: "(9,5% − 28%) × 4.000 = −740 (Rp juta) — melampaui toleransi Rp500 juta." },
          { kind: "equal", task: "t2", name: "layak_b", value: false, tol: 1e-9, label: "`layak_b` = False", msg: "B memenuhi return tetapi gagal di sisi risiko — return cukup tidak otomatis berarti suitable." },
          { kind: "stdout_matches", task: "t3", pattern: "r_butuh=9\\.2%\\s+shortfall_a=1\\.68pp\\s+loss_b_2sd=-740\\s+layak_b=False", label: "`print` menampilkan keempatnya", msg: "Format: r_butuh=...  shortfall_a=...  loss_b_2sd=...  layak_b=... ." },
        ],
      },
      reference: "Return dibutuhkan 9,18%; A kurang 1,68pp; B cukup return tetapi rugi dua-sigma Rp740 juta melampaui toleransi — tidak suitable.",
    },
    {
      id: "minicase-mosaic",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mozaik yang sah dan rekomendasi yang cocok",
      prose: [
        "Dua kasus penutup. Kasus pertama: Sinta, analis, membaca laporan keuangan publik emiten Q, mengunjungi pabriknya, berbicara dengan pemasok, lalu membangun modelnya sendiri dan merekomendasikan BELI. Seminggu kemudian terungkap emiten Q akan diakuisisi — informasi yang tidak ia ketahui saat membuat rekomendasi. Apakah Sinta melanggar? Tidak: semua bahannya publik dan kesimpulannya hasil analisis sendiri — mosaic theory yang sah. Keberuntungan setelahnya bukan pelanggaran.",
        "Kasus kedua: manajer yang sama menawarkan Portofolio B dari lab langkah 5 kepada Ibu Ratna, dengan kalimat “return-nya 9,5%, di atas kebutuhan Ibu 9,2%”. Ia tidak menyebut potensi rugi dua-sigma Rp740 juta. Ini pelanggaran ganda: III(C) karena portofolio tidak suitable, dan V(B) karena fakta material — potensi kerugian yang melampaui toleransi klien — disembunyikan.",
        "Perhatikan pola pemeriksa: vignette yang menyebut “return cukup” tetapi diam soal risiko hampir selalu menguji III(C); vignette yang menyebut “analisis disalin” hampir selalu menguji V(A); vignette yang menyebut “tidak ada catatan” hampir selalu menguji V(C).",
      ],
      tasks: [],
      quiz: [
        {
          q: "Sinta merekomendasikan BELI dari bahan publik + analisis sendiri; seminggu kemudian muncul kabar akuisisi yang tidak ia ketahui. Ini?",
          options: [
            { text: "Pelanggaran II(A) — ia pasti memakai info akuisisi itu", why: "Salah: tidak ada bukti ia memakai info nonpublik — kesimpulannya dibangun dari bahan publik sebelum kabar itu muncul.", },
            { text: "Boleh — mosaic theory yang sah", why: "Benar: bahan publik + analisis sendiri = mozaik yang sah. Keberuntungan setelahnya bukan pelanggaran.", correct: true },
            { text: "Pelanggaran V(A) — rekomendasinya tidak berdasar", why: "Salah: rekomendasinya justru berdasar — laporan publik, kunjungan, dan model sendiri.", },
          ],
        },
        {
          q: "Manajer menawarkan Portofolio B ke Ibu Ratna dan hanya menyebut return 9,5%, tanpa menyebut potensi rugi Rp740 juta. Ini?",
          options: [
            { text: "Hanya pelanggaran V(B)", why: "Salah: menyembunyikan risiko memang melanggar V(B), tetapi menawarkan portofolio yang tidak suitable juga melanggar III(C).", },
            { text: "Pelanggaran ganda III(C) + V(B)", why: "Benar: portofolio tidak cocok dengan toleransi risiko klien, dan fakta material itu disembunyikan.", correct: true },
            { text: "Tidak melanggar — return-nya memang cukup", why: "Salah: return cukup tidak otomatis berarti suitable — risiko yang disembunyikan adalah pelanggaran.", },
          ],
        },
      ],
      reference: "Mozaik sah = bahan publik + analisis sendiri. Return cukup + risiko disembunyikan = III(C) + V(B).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran dari semua langkah. Ingat pola pemeriksa: “disalin tanpa verifikasi” = V(A); “tidak diungkapkan keterbatasannya” = V(B); “tidak ada catatan” = V(C); “tidak cocok dengan klien” = III(C).",
      ],
      tasks: [],
      quiz: [
        {
          q: "Analis menerbitkan rekomendasi berdasarkan intuisi tanpa model atau data. Standar?",
          options: [
            { text: "V(A) Diligence and Reasonable Basis", why: "Benar: rekomendasi tanpa riset dan basis yang wajar melanggar V(A).", correct: true },
            { text: "V(C) Record Retention", why: "Salah: V(C) soal menyimpan catatan — masalah di sini adalah tidak adanya riset, bukan tidak adanya catatan.", },
            { text: "III(C) Suitability", why: "Salah: III(C) soal kecocokan dengan klien — masalah di sini adalah basis risetnya.", },
          ],
        },
        {
          q: "Manajer tidak menyimpan model dan sumber data di balik rekomendasi tiga tahun terakhir. Standar?",
          options: [
            { text: "V(A)", why: "Salah: V(A) soal melakukan riset — masalah di sini adalah catatan pendukungnya tidak disimpan.", },
            { text: "V(C) Record Retention", why: "Benar: catatan pendukung analisis dan rekomendasi wajib dipelihara.", correct: true },
            { text: "VII(B)", why: "Salah: VII(B) soal pemakaian gelar CFA — tidak relevan di sini.", },
          ],
        },
        {
          q: "Klien butuh 9,2% dan hanya tahan rugi Rp500 juta; satu-satunya portofolio yang mencapai 9,2% berpotensi rugi Rp740 juta. Keputusan yang benar?",
          options: [
            { text: "Tawarkan portofolio itu dan sembunyikan potensi ruginya", why: "Salah: itu melanggar III(C) sekaligus V(B).", },
            { text: "Nyatakan IPS tidak layak dan revisi ekspektasi bersama klien", why: "Benar: bila return dibutuhkan melampaui kapasitas risiko, ekspektasi yang diubah — bukan toleransi klien yang dilanggar.", correct: true },
            { text: "Turunkan toleransi risiko klien di dokumen IPS", why: "Salah: toleransi risiko adalah fakta tentang klien, bukan angka yang bisa diubah di kertas agar rekomendasi terlihat cocok.", },
          ],
        },
      ],
      summary: [
        "V(A): riset yang layak, analisis independen, reasonable basis — mosaic theory: bahan publik + analisis sendiri = sah.",
        "V(B): ungkapkan fakta material dan keterbatasan analisis.",
        "V(C): simpan catatan pendukung — panduan praktik tujuh tahun.",
        "III(C): rekomendasi harus cocok dengan IPS klien; return dibutuhkan melebihi kapasitas risiko = IPS tidak layak.",
        "Return cukup tidak otomatis berarti suitable.",
      ],
      next: { label: "PM-A2 — Quant Methods: TVM, Statistik & Regresi", href: "/v2/learn/pm-a2-quant-methods" },
    },
  ],
};
