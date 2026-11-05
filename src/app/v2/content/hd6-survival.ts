import type { V2Lesson } from "../lib/types";

export const hd6: V2Lesson = {
  slug: "hd6-survival",
  track: "Health Data Science",
  module: "Analisis Klinis Lanjutan",
  title: "HD6 Analisis Survival: Ketika Waktu adalah Jawabannya",
  estMinutes: 55,
  steps: [
    {
      id: "sensor",
      eyebrow: "Langkah 1 · Sensor",
      title: "Pasien yang “hilang”",
      prose: [
        "Andi direkrut ke studi kanker: dosis baru vs dosis lama. Pasien A masuk bulan 1, meninggal bulan 3. Pasien B masuk bulan 2, follow-up berakhir bulan 6 — masih hidup saat studi selesai. Pasien C masuk bulan 4, pindah RS bulan 5 — hilang. Berapa median survival obat baru? Rata-rata tidak bisa dipakai: B dan C belum punya “hasil” — datanya tersensor.",
        "Sensor bukan data rusak — ia adalah informasi: B hidup minimal 4 bulan (bulan 2→6), C hidup minimal 1 bulan. Estimator Kaplan-Meier (KM) menggunakannya dengan jujur. Idenya: peluang bertahan sampai waktu t = peluang selamat di tiap interval sebelum t, dikalikan. Di setiap waktu kejadian, S(t) = S(t_sebelumnya) × (1 − d/n): d = kejadian di t, n = yang masih berisiko. Pasien tersensor mengurangi n tapi tidak mengurangi S.",
        "Contoh 5 pasien: waktu 3 meninggal, 5 tersensor, 6 meninggal, 8 tersensor, 12 meninggal. S(3) = 1−1/5 = 0,80. Di waktu 5 tersensor (n: 4→3), S tak berubah. S(6) = 0,80×(1−1/3) = 0,533. Di waktu 8 tersensor (n: 2→1). S(12) = 0,533×(1−1/1) = 0. Median survival ≈ 7 bulan (di antara 6 dan 12): 50% pasien hidup lebih dari ~7 bulan — bukan “rata-rata” yang semu.",
      ],
      tasks: [],
      formula: String.raw`S(t) = \prod_{t_i \le t} \left(1 - \frac{d_i}{n_i}\right)`,
      formulaNote: "S(t) = fungsi survival — probabilitas bertahan hidup melewati waktu t; t_i = waktu kejadian ke-i yang teramati (terurut dari kecil ke besar); d_i = jumlah kejadian (mis. kematian) tepat pada waktu t_i; n_i = jumlah individu yang masih berisiko tepat sebelum t_i (belum kejadian dan belum tersensor). Perkalian berjalan atas semua waktu kejadian ≤ t. Interpretasi: tiap faktor (1 − d_i/n_i) adalah peluang lolos dari interval itu; pasien yang tersensor hanya mengecilkan n_i berikutnya — ia tidak mengubah S(t) secara langsung.",
      note: {
        title: "Sering salah",
        body: "Membuang pasien tersensor dan menghitung rata-rata waktu kejadian dari yang meninggal saja. Ini bias ke arah yang tampak lebih buruk (atau lebih baik) — dan mengabaikan informasi “minimal hidup X bulan” yang justru paling berharga.",
        type: "pitfall",
      },
      reference: "Sensor = hidup minimal t. Kaplan-Meier mengalikan peluang selamat tiap interval.",
    },
    {
      id: "lab-km",
      eyebrow: "Langkah 2 · Lab",
      title: "Hitung kurva Kaplan-Meier manual",
      prose: [
        "Data 5 pasien di atas: (3 bulan, meninggal), (5, tersensor), (6, meninggal), (8, tersensor), (12, meninggal). Hitung S(3), S(6), S(12) dengan rumus KM. Urutkan waktu; yang tersensor hanya mengurangi n (penyebut), tidak mengubah S.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `s3` = S(3)" },
        { id: "t2", text: "Hitung `s6` = S(6)" },
        { id: "t3", text: "Hitung `s12` = S(12)" },
      ],
      expected: "s3=0.800 s6=0.533 s12=0.000",
      note: {
        title: "Kaitan ke risk",
        body: "Median survival yang salah 3 bulan bisa mengubah rekomendasi “obat layak dibayar BPJS” menjadi tidak. Kurva KM yang dihitung jujur adalah dasar dari semua keputusan efektivitas obat.",
        type: "risk",
      },
      hints: [
        "Di t=3: n=5, d=1 → s3 = 1 − 1/5.",
        "Di t=6: n sudah berkurang oleh kejadian (t=3) dan sensor (t=5). s6 = s3 × (1 − 1/n).",
        "Di t=12: yang tersisa hanya 1 pasien yang meninggal → s12 = s6 × (1 − 1/1).",
      ],
      code: {
        starter: `# 5 pasien: (3, meninggal), (5, tersensor), (6, meninggal), (8, tersensor), (12, meninggal)\n# TULIS KODEMU: S(3), S(6), S(12) via rumus KM\ns3 = \ns6 = \ns12 = \nprint(f"s3={s3:.3f} s6={s6:.3f} s12={s12:.3f}")`,
        lockLines: 1,
        solution: `# 5 pasien: (3, meninggal), (5, tersensor), (6, meninggal), (8, tersensor), (12, meninggal)\n# TULIS KODEMU: S(3), S(6), S(12) via rumus KM\ns3 = 1 - 1/5\ns6 = s3 * (1 - 1/3)\ns12 = s6 * (1 - 1/1)\nprint(f"s3={s3:.3f} s6={s6:.3f} s12={s12:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "s3", value: 0.8, tol: 1e-9, label: "`s3` seharusnya 0.80", msg: "1 − 1/5 = 0,80." },
          { kind: "equal", task: "t2", name: "s6", value: 0.5333, tol: 0.001, label: "`s6` seharusnya ≈ 0.533", msg: "0,80 × (1 − 1/3) — n=3 karena satu meninggal dan satu tersensor sebelumnya." },
          { kind: "equal", task: "t3", name: "s12", value: 0.0, tol: 1e-9, label: "`s12` seharusnya 0.0", msg: "0,533 × (1 − 1/1) = 0 — semua sudah kejadian atau tersensor." },
          { kind: "stdout_matches", task: "t3", pattern: "s3=0\\.800 s6=0\\.533 s12=0\\.000", label: "`print` menampilkan s3, s6, s12", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Sensor mengurangi n, tidak mengubah S. Median = waktu S menyentuh 0,50.",
    },
    {
      id: "logrank-cox",
      eyebrow: "Langkah 3 · Membandingkan & memodelkan",
      title: "Log-rank dan Cox",
      prose: [
        "Uji log-rank membandingkan dua kurva survival (obat baru vs lama). Idenya: di setiap waktu kejadian, hitung kejadian yang diharapkan di tiap grup jika tidak ada beda (proporsional ke n yang berisiko), lalu jumlahkan selisih (observasi − ekspektasi)²/ekspektasi. Chi-square, df=1. Log-rank menjawab “apakah kurva berbeda?” — bukan “seberapa besar bedanya?”.",
        "Model Cox menjawab “seberapa besar?”: h(t) = h₀(t) × exp(β₁X₁ + β₂X₂ + …). Hazard ratio HR = exp(β) adalah efek relatif instan, diasumsikan konstan sepanjang waktu — asumsi proportional hazards (PH). Cek PH dengan kurva log-log (harus paralel) atau uji residual Schoenfeld. Jika dilanggar, HR rata-rata bisa menipu: gunakan model stratified Cox atau efek time-varying.",
        "Contoh: Cox untuk obat baru vs lama, adjusted usia: HR=0,65 (95% CI: 0,50–0,84) → risiko kematian kapan pun 35% lebih rendah. Tapi tanpa log-log check, angka ini bisa menyembunyikan bahwa obat hanya bekerja di 6 bulan pertama. HR bukan probabilitas — HR 0,65 bukan berarti “65% sembuh”.",
      ],
      tasks: [],
      formula: String.raw`h(t \mid X) = h_0(t) \cdot \exp(\beta_1 X_1 + \beta_2 X_2 + \cdots)`,
      formulaNote: "h(t|X) = hazard — laju kejadian instan pada waktu t untuk individu berkovariat X (peluang kejadian per satuan waktu, BUKAN probabilitas); h_0(t) = baseline hazard — hazard saat semua X = 0, bentuknya bebas tanpa asumsi; β_j = koefisien kovariat ke-j; X_j = kovariat (umur, dosis, …); exp = memastikan hazard selalu positif. Hazard ratio HR = exp(β): HR 0,65 berarti laju kejadian 35% lebih rendah kapan pun — dengan asumsi proportional hazards, yaitu rasio konstan sepanjang waktu (cek via kurva log-log yang paralel atau uji residual Schoenfeld).",
      note: {
        title: "Sering salah",
        body: "Membaca HR=0,65 sebagai “peluang sembuh 65%”. HR adalah rasio hazard instan, bukan probabilitas. Dan mengabaikan uji asumsi PH — kurva log-log yang tidak paralel membuat satu angka HR rata-rata menyesatkan.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Uji log-rank menjawab…",
          options: [
            { text: "Apakah dua kurva survival berbeda secara statistik", why: "Benar: log-rank = uji beda kurva. Besarnya efek dijawab Cox (HR).", correct: true },
            { text: "Seberapa besar perbedaan efeknya", why: "Itu jawaban model Cox (hazard ratio), bukan log-rank." },
            { text: "Median survival tiap grup", why: "Median dibaca dari kurva KM, bukan dari log-rank." },
            { text: "Penyebab kematian pasien", why: "Log-rank tidak menyentuh sebab-akibat." },
          ],
        },
      ],
      reference: "Log-rank: apakah beda? Cox: seberapa besar? Cek asumsi PH.",
    },
    {
      id: "competing-risks",
      eyebrow: "Langkah 4 · Risiko bersaing",
      title: "Meninggal vs kambuh: competing risks",
      prose: [
        "Pasien kanker bisa mengalami dua kejadian: kambuh atau meninggal sebelum kambuh. Jika kamu menganalisis “waktu sampai kambuh” dan memperlakukan kematian sebagai sensor biasa, KM akan melebih-lebihkan risiko kambuh — karena pasien yang meninggal “dihapus” seolah masih bisa kambuh, padahal tidak.",
        "Solusinya: cumulative incidence function (CIF) untuk tiap kejadian, atau model Fine-Gray yang memodelkan subdistribution hazard. Aturan praktis: bila kejadian bersaing >10% dari total kejadian, jangan pakai KM biasa untuk outcome non-fatal.",
        "Mini-case: program DM dinas kesehatan. Target: HbA1c <7% dalam 6 bulan. Data: 200 pasien; 60 mencapai target, 30 meninggal sebelum 6 bulan, 40 drop-out, 70 belum mencapai. KM “waktu mencapai target” dengan kematian = sensor → klaim “80% mencapai target dalam 6 bulan”. Realita CIF: hanya 35% yang mencapai target; 15% meninggal dulu. Klaim 80% menipu direksi — dan menutupi masalah mortalitas yang justru perlu ditangani.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Melaporkan KM biasa saat competing risk besar berarti mengklaim keberhasilan program yang tidak ada — sambil menyembunyikan kematian. Auditor yang menemukan ini tidak hanya menolak laporanmu, tapi mempertanyakan semua analisismu.",
        type: "risk",
      },
      reference: "Kejadian bersaing >10% → CIF / Fine-Gray, bukan KM biasa.",
    },
    {
      id: "time-varying",
      eyebrow: "Langkah 5 · Kovariat waktu",
      title: "Kovariat yang berubah & waktu yang menipu",
      prose: [
        "Cox standar mengasumsikan kovariat diukur sekali di awal dan efeknya konstan. Dunia nyata tidak sopan: dosis obat berubah tiap bulan, status merokok berubah tiap tahun, biomarker naik-turun. Extended Cox mengizinkan X(t) — kovariat sebagai fungsi waktu. Format datanya berubah: satu pasien menjadi banyak baris (start, stop, event) — tiap baris satu interval dengan kovariat konstan di dalamnya. Ini bukan trik format; ini cara jujur mengatakan “pada interval ini, pasien dalam keadaan ini”.",
        "Contoh: studi obat jantung — pasien berganti dosis (rendah/tinggi) selama follow-up. Dengan format start-stop, model membandingkan hazard pada interval ber-dosis-tinggi vs ber-dosis-rendah pada waktu yang sama, adjusted confounder. Hasil: HR 0,72 untuk dosis tinggi vs rendah — interpretasi yang jauh lebih jujur daripada memakai “dosis total selama studi” sebagai kovariat awal.",
        "Versi paling berbahaya dari kovariat waktu adalah immortal time bias. Bedah mekanismenya: studi mengklaim “pasien yang minum obat ≥30 hari hidup lebih lama”. Untuk mencapai 30 hari minum obat, pasien HARUS hidup 30 hari — periode itu “immortal” (tidak mungkin mati sebagai anggota grup obat). Grup obat terseleksi menjadi para penyintas; grup pembanding menampung semua yang mati dini. Hasilnya: obat terlihat manjur padahal yang dibandingkan adalah penyintas vs semua orang.",
        "Perbaikannya ada tiga: (a) perlakukan status obat sebagai X(t) — 0 sebelum hari ke-30, 1 sesudahnya, dalam format start-stop; (b) landmark analysis — hanya pasien yang hidup sampai hari ke-30 yang masuk analisis, dan waktu dihitung dari hari ke-30; (c) time zero yang benar — mulai hitung sejak keputusan treatment, bukan sejak syarat 30 hari terpenuhi. Aturan praktis: setiap kali kovariat didefinisikan dari informasi MASA DEPAN (dosis total, “pernah dirawat”, kepatuhan kumulatif), berhenti dan tanya: “untuk mendapat nilai ini, pasien harus selamat berapa lama?” Jika jawabannya lebih dari nol, kamu sedang membangun immortal time bias.",
      ],
      tasks: [],
      formula: String.raw`h(t \mid X(t)) = h_0(t) \cdot \exp(\beta X(t))`,
      formulaNote: "X(t) = kovariat yang nilainya berubah sepanjang follow-up — dibaca PADA waktu t, bukan sekali di awal (mis. dosis bulan ini, status merokok tahun ini). h(t|X(t)), h_0(t), β, exp sama seperti Cox standar. Interpretasi: HR membandingkan dua orang dengan nilai X yang sama pada WAKTU t yang sama. Jebakan: memakai nilai masa depan (dosis total selama studi) sebagai kovariat awal = immortal time bias — pasien harus hidup cukup lama untuk mengakumulasinya.",
      note: {
        title: "Intuisi: garis waktu di kertas, curigai definisi berdurasi",
        body: "Sebelum menulis satu baris kode survival, gambar garis waktu satu pasien di kertas: kapan masuk studi, kapan dosis berubah, kapan kejadian atau tersensor. Tandai dengan warna: biru untuk periode yang benar-benar teramati, merah untuk periode yang “dibocorkan” dari masa depan. Heuristiknya: setiap informasi yang dipakai model pada waktu t harus sudah ADA pada waktu t — tidak boleh ada yang “menunggu” masa depan. Kedua: curigai setiap definisi grup yang butuh waktu untuk terpenuhi — “minum obat ≥30 hari”, “kontrol 3 kali”, “patuh 80%” — semuanya menciptakan periode immortal bagi yang lolos definisi. Tanyakan selalu: “berapa lama seseorang harus bertahan untuk masuk grup ini?” Ketiga: bila ragu antara Cox standar dan time-varying, pilih yang time-varying untuk kovariat yang jelas berubah (dosis, biomarker); biaya komputasinya kecil, biaya salahnya besar — HR dari kovariat yang dipotret sekali di awal adalah rata-rata kabur dari efek yang sebenarnya bergerak. Tiga kebiasaan — garis waktu di kertas, curigai definisi berdurasi, utamakan X(t) — menyelamatkan lebih banyak analisis survival daripada semua uji asumsi digabung.",
      },
      quiz: [
        {
          q: "Studi: “pasien yang minum obat ≥30 hari hidup lebih lama”. Perbaikan desain yang benar?",
          options: [
            { text: "Perlakukan status obat sebagai X(t) atau pakai landmark dari hari ke-30", why: "Benar: kedua cara menghilangkan periode immortal — status hanya “obat” setelah hari ke-30 tercapai.", correct: true },
            { text: "Tambah kovariat umur dan jenis kelamin", why: "Confounder adjustment tidak memperbaiki bias desain waktu." },
            { text: "Perbesar sampel menjadi 10.000 pasien", why: "Bias sistematis tidak hilang dengan n besar — ia justru semakin “signifikan”." },
            { text: "Ganti ke model parametrik Weibull", why: "Ganti model tidak memperbaiki definisi grup yang bocor dari masa depan." },
          ],
        },
        {
          q: "Kapan extended Cox (X(t)) WAJIB dipakai alih-alih Cox standar?",
          options: [
            { text: "Kovariat berubah sepanjang follow-up dan efeknya ingin diukur jujur (mis. dosis per bulan)", why: "Benar: memotret dosis sekali di awal menghasilkan rata-rata kabur dari efek yang bergerak.", correct: true },
            { text: "Selalu — Cox standar sudah usang", why: "Cox standar tetap tepat untuk kovariat yang memang tetap (jenis kelamin, genotipe)." },
            { text: "Hanya bila n > 10.000", why: "Bukan soal ukuran sampel — soal apakah kovariat berubah terhadap waktu." },
            { text: "Tidak pernah — terlalu rumit", why: "Format start-stop sederhana; biaya salahnya jauh lebih besar." },
          ],
        },
      ],
      reference: "Informasi masa depan = immortal time. Jadikan X(t) atau geser time zero.",
    },
    {
      id: "lab-immortal",
      eyebrow: "Langkah 6 · Lab",
      title: "Buktikan immortal time bias via simulasi",
      prose: [
        "Simulasi 4.000 pasien. Kebenaran yang kita tetapkan: OBAT TIDAK BERPENGARUH SAMA SEKALI (efek nol). Obat diberikan setelah pasien stabil 100 hari — jadi “menerima obat” mensyaratkan hidup 100 hari. Analisis naif membandingkan “menerima obat” vs “tidak” untuk mortalitas 1 tahun. Analisis landmark hanya memakai pasien yang hidup ≥100 hari, dengan waktu dihitung dari hari ke-100.",
        "Tugasmu: hitung `efek_naif` (selisih mortalitas 1 tahun: kontrol − treated, analisis naif) dan `efek_landmark` (selisih yang sama, analisis landmark). Saksikan: analisis naif menemukan “manfaat” 18 poin persen dari obat yang tidak berkhasiat — murni artefak waktu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `efek_naif` (analisis naif, bias)" },
        { id: "t2", text: "Hitung `efek_landmark` (analisis landmark, benar)" },
      ],
      expected: "efek_naif≈0.180 efek_landmark≈0.000",
      note: {
        title: "Kaitan ke risk",
        body: "“Manfaat” 18 poin persen dari artefak waktu cukup untuk meloloskan obat ratusan miliar ke formularium. Regulator yang tidak mengecek definisi time zero sedang membeli ilusi — dan pasien membayarnya.",
        type: "risk",
      },
      hints: [
        "Waktu kematian ~ eksponensial (mean 500 hari); 50% acak menerima obat; seed 11.",
        "Naif: treated = menerima obat DAN hidup ≥100 hari; sisanya kontrol. Mortalitas 1 tahun = proporsi d < 365.",
        "Landmark: saring dulu yang hidup ≥100 hari, baru bandingkan treated vs kontrol.",
      ],
      code: {
        starter: `import random\nrandom.seed(11)\nn = 4000\ndeaths = [random.expovariate(1/500) for _ in range(n)]\ntreated = [random.random() < 0.5 for _ in range(n)]\nSTART = 100\n# TULIS KODEMU: efek_naif dan efek_landmark (mortalitas 1 thn: kontrol - treated)\nefek_naif = \nefek_landmark = \nprint(f"efek_naif={efek_naif:.3f} efek_landmark={efek_landmark:+.3f}")`,
        lockLines: 6,
        solution: `import random\nrandom.seed(11)\nn = 4000\ndeaths = [random.expovariate(1/500) for _ in range(n)]\ntreated = [random.random() < 0.5 for _ in range(n)]\nSTART = 100\n# TULIS KODEMU: efek_naif dan efek_landmark (mortalitas 1 thn: kontrol - treated)\ndef mort1yr(dlist):\n    return sum(1 for d in dlist if d < 365) / len(dlist)\nnaive_t = [d for d, t in zip(deaths, treated) if t and d >= START]\nnaive_c = [d for d, t in zip(deaths, treated) if not (t and d >= START)]\nefek_naif = mort1yr(naive_c) - mort1yr(naive_t)\nsurv = [(d, t) for d, t in zip(deaths, treated) if d >= START]\nlm_t = [d for d, t in surv if t]\nlm_c = [d for d, t in surv if not t]\nefek_landmark = mort1yr(lm_c) - mort1yr(lm_t)\nprint(f"efek_naif={efek_naif:.3f} efek_landmark={efek_landmark:+.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "efek_naif", value: 0.18, tol: 0.03, label: "`efek_naif` seharusnya ≈ 0.180", msg: "18 poin persen “manfaat” dari obat yang efeknya NOL — itulah immortal time bias." },
          { kind: "equal", task: "t2", name: "efek_landmark", value: 0.0, tol: 0.03, label: "`efek_landmark` seharusnya ≈ 0", msg: "Landmark menghapus periode immortal: tidak ada efek — sesuai kebenaran simulasi." },
          { kind: "stdout_matches", task: "t2", pattern: "efek_naif=0\\.180 efek_landmark=\\+0\\.003", label: "`print` menampilkan kedua efek", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Simulasi membuktikan efek obat NOL, tapi analisis naif menemukan “manfaat” 18 poin. Pelajaran utamanya?",
          options: [
            { text: "Definisi grup dari informasi masa depan menciptakan efek palsu — cek time zero dulu", why: "Benar: biasnya di definisi, bukan di model. Tidak ada model yang menyelamatkan definisi bocor.", correct: true },
            { text: "Simulasi tidak bisa dipercaya", why: "Simulasi justru membuktikan mekanisme bias secara terkontrol." },
            { text: "Obatnya sebenarnya manjur", why: "Kebenaran simulasi: efek nol. “Manfaat” itu artefak." },
            { text: "Sampel 4.000 terlalu kecil", why: "Bias sistematis tidak hilang dengan n besar." },
          ],
        },
      ],
      reference: "Simulasi dengan kebenaran diketahui = mikroskop untuk bias.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: analisis waktu-kejadian yang tepat",
      prose: [
        "Lima situasi keputusan yang dihadapi analis data kesehatan saat “waktu sampai kejadian” menjadi pertanyaannya:",
        "Skenario 1 — “Bandingkan survival dua kelompok?” → Kurva Kaplan-Meier + uji log-rank. Syaratnya: sensor non-informatif — pasien yang tersensor tidak boleh sistematis berbeda prognosisnya dari yang tetap diamati. Sensor informatif merusak kurva diam-diam.",
        "Skenario 2 — “Sesuaikan banyak kovariat sekaligus / butuh hazard ratio?” → Model Cox. Tetapi cek dulu asumsi proportional hazards-nya (kurva yang menyilang = asumsi runtuh); bila runtuh, stratifikasi atau model dengan efek bervariasi-waktu — jangan paksakan satu HR untuk seluruh follow-up.",
        "Skenario 3 — “Ada kejadian yang menghalangi outcome yang diteliti (meninggal dunia sebelum sempat kambuh)?” → Competing risks dengan cumulative incidence function — BUKAN 1 minus Kaplan-Meier. KM memperlakukan kematian sebagai “tersensor” dan menggelembungkan risiko kumulatif kekambuhan.",
        "Skenario 4 — “Paparan berubah seiring waktu (kepatuhan, dosis, status merokok)?” → Kovariat time-varying dalam format start-stop — satu baris per interval waktu per orang. Yang dilarang keras: mendefinisikan grup dari informasi masa depan. Contoh: “patuh ≥80% setahun” mensyaratkan pasien hidup setahun — immortal time bias yang membuat obat Rp1,2 juta/bulan terlihat 40% lebih baik.",
        "Skenario 5 — “Grup perbandingan didefinisikan dari kejadian di masa follow-up?” → Bedah time zero-nya sebelum menghitung apa pun: landmark analysis (mulai hitung dari titik waktu yang sama untuk semua) atau emulasi target trial. Bila time zero-nya tidak bisa disamakan, analisisnya tidak bisa diselamatkan.",
        "Aturan praktis 10 detik: bandingkan → KM + log-rank (cek sensor) → sesuaikan → Cox (cek PH) → ada penghalang → competing risks → paparan berubah → start-stop → grup dari masa depan → bedah time zero dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai 1 − KM saat ada competing risks — angka kekambuhannya terlihat lebih menakutkan dari kenyataan, dan keputusan skrining/terapi yang diambil darinya ikut bergeser. Atau mendefinisikan “patuh” dari total hari minum obat setahun penuh — immortal time bias yang membuat obat mahal terlihat manjur. Keduanya adalah kesalahan definisi, bukan kesalahan hitung.",
        type: "pitfall",
      },
      reference: "Sensor non-informatif; Cox butuh PH; competing risks → CIF; paparan berubah → start-stop; time zero harus sama.",
    },
    {
      id: "minicase-immortal",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case 1: Obat jantung Rp1,2 juta/bulan dan immortal time bias",
      prose: [
        "Dinkes provinsi mengevaluasi obat jantung baru (Rp1,2 juta/bulan/pasien) dari data klaim BPJS 2023–2025: 8.000 pasien. Analisis vendor: “pasien dengan kepatuhan ≥80% (minum obat ≥292 hari/tahun) mortalitasnya 40% lebih rendah — obat layak ditanggung!” Ratusan miliar APBD dipertaruhkan pada satu angka.",
        "Kamu memeriksa definisi: “patuh ≥80%” dihitung dari total hari minum obat SELAMA setahun follow-up. Untuk mencapai 292 hari, pasien harus hidup hampir setahun penuh — yang meninggal di bulan ke-3 otomatis masuk grup “tidak patuh”. Periode immortal: ~9 bulan untuk grup patuh. Selain itu ada healthy adherer bias: yang patuh minum obat juga patuh kontrol, diet, dan olahraga — confounding yang tak terukur di klaim.",
        "Pertanyaan: (1) ke arah mana biasnya bekerja? (2) rancangan ulang apa yang kamu usulkan? (3) apa jawabanmu ke Dinkes soal “layak ditanggung?”",
        "Pembahasan: (1) Bias menguntungkan obat secara sistematis — grup “patuh” terseleksi menjadi para penyintas; angka 40% adalah campuran efek obat + seleksi + gaya hidup. (2) Rancangan ulang: perlakukan kepatuhan sebagai X(t) per bulan (format start-stop), atau landmark analysis dari bulan ke-12, plus emulasi target trial dengan penyesuaian confounder terukur. (3) Jawaban jujur: “klaim 40% tidak valid karena immortal time bias; butuh analisis ulang sebelum keputusan ratusan miliar. Sementara itu, jangan tarik kesimpulan kebijakan dari definisi yang bocor.” Pelajaran: definisi yang tampak administratif (“kepatuhan ≥80%”) bisa mengandung bias yang membalikkan keputusan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Mengesahkan obat Rp1,2 juta/bulan berdasarkan efek yang tercemar immortal time bias mengunci ratusan miliar APBD untuk manfaat yang mungkin tidak ada — sementara obat lain yang benar-benar manjur antre di luar formularium.",
        type: "risk",
      },
      reference: "Definisi administratif bisa mengandung bias kebijakan. Bedah time zero-nya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Sensor = informasi “minimal hidup t”; KM mengalikan (1 − d/n) tiap interval.",
        "Log-rank: apakah kurva beda? Cox: seberapa besar (HR)? Cek asumsi PH.",
        "HR 0,65 = hazard 35% lebih rendah, bukan “65% sembuh”.",
        "Competing risk >10% → CIF/Fine-Gray, bukan KM biasa.",
      ],
      next: { label: "HD7 — Data Longitudinal", href: "/learn/hd7-longitudinal" },
      quiz: [
        {
          q: "Pasien tersensor di bulan 5 diperlakukan dalam KM sebagai…",
          options: [
            { text: "Mengurangi n setelah bulan 5, tanpa mengubah S", why: "Benar: sensor mengurangi yang berisiko, bukan peluang selamat.", correct: true },
            { text: "Dihapus dari analisis", why: "Menghapus = membuang informasi “minimal hidup 5 bulan”." },
            { text: "Dianggap meninggal di bulan 5", why: "Itu mengada-ada kejadian yang tidak terjadi." },
            { text: "Dianggap sembuh", why: "Sensor tidak berarti sembuh — hanya berarti tidak teramati." },
          ],
        },
        {
          q: "Kurva log-log dua grup tidak paralel. Artinya…",
          options: [
            { text: "Asumsi proportional hazards dilanggar — HR tunggal bisa menipu", why: "Benar: gunakan stratified Cox atau efek time-varying.", correct: true },
            { text: "Tidak ada masalah", why: "Ada: HR rata-rata menyembunyikan efek yang berubah terhadap waktu." },
            { text: "Obat tidak efektif", why: "Bukan soal efektivitas — soal validitas satu angka HR." },
            { text: "Data kurang", why: "Bukan soal ukuran sampel — soal pola hazard." },
          ],
        },
        {
          q: "Studi “waktu kambuh” dengan 20% pasien meninggal sebelum kambuh. Analisis tepat?",
          options: [
            { text: "CIF / Fine-Gray untuk competing risks", why: "Benar: KM biasa melebih-lebihkan risiko kambuh saat competing risk besar.", correct: true },
            { text: "KM biasa dengan kematian = sensor", why: "Itu justru yang melebih-lebihkan risiko kambuh." },
            { text: "Buang pasien yang meninggal", why: "Membuang = bias seleksi." },
            { text: "Regresi logistik biasa", why: "Mengabaikan waktu dan sensor sama sekali." },
          ],
        },
        {
          q: "HR=0,65 (95% CI: 0,50–0,84) untuk obat baru vs lama berarti…",
          options: [
            { text: "Hazard kematian kapan pun 35% lebih rendah pada kelompok obat baru", why: "Benar: HR adalah rasio hazard instan, adjusted, dengan asumsi PH terpenuhi.", correct: true },
            { text: "65% pasien sembuh", why: "HR bukan probabilitas sembuh." },
            { text: "Obat 65% lebih murah", why: "HR tidak bicara biaya." },
            { text: "Tidak signifikan karena CI tidak memuat 1", why: "Terbalik: CI tidak memuat 1 justru berarti signifikan." },
          ],
        },
      ],
    },
  ],
};
