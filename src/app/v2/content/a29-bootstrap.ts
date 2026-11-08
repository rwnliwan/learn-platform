import type { V2Lesson } from "../lib/types";

export const a29: V2Lesson = {
  slug: "a29-bootstrap",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.9 Bootstrap & Permutasi: Statistik Tanpa Rumus",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-median",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Median tanpa rumus",
      prose: [
        "Manajer CS bertanya: berapa median waktu tunggu pelanggan — dan seberapa yakin kamu? Kamu punya 60 data, median = 13,8 menit. Untuk mean, rumusnya jelas. Untuk median? Buku teks hanya memberi aproksimasi jelek, atau menyuruhmu asumsikan normal — padahal datanya miring parah.",
        "Di sinilah Bradley Efron (1979) memperkenalkan ide yang terdengar seperti curang: tidak ada rumus? Resample saja datamu sendiri. Ambil 60 datamu, acak-ambil 60 dengan pengembalian, hitung mediannya. Ulangi 5.000 kali. Sebaran 5.000 median itu = taksiran distribusi sampling medianmu. Selesai — tanpa satu pun asumsi distribusi. CI 95% metode persentil: (11,6, 16,1). (Perhatikan: interval ini memakai METODE persentil — metode lain pada data yang sama memberi interval yang sedikit berbeda; lihat Langkah 3.)",
      ],
      tasks: [
        { id: "t1", text: "Catat `median` = 13,8 (median teramati, menit)" },
        { id: "t2", text: "Hitung `lebar_ci` = 16,1 − 11,6 (lebar CI bootstrap)" },
      ],
      expected: "median=13.8  lebar_ci=4.5",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "CI selebar 4,5 menit untuk target 15 menit artinya datanya kurang untuk vonis yang tajam. Melaporkan titik 13,8 tanpa interval = presisi palsu. Selalu laporkan SLA sebagai interval, bukan titik.",
      },
      hints: [
        "median = 13.8 dari cerita.",
        "lebar_ci = round(16.1 - 11.6, 1).",
        "Lebar 4,5 menit — besar relatif terhadap target 15.",
      ],
      code: {
        starter: `# waktu tunggu CS: n=60, median teramati 13.8 menit\n\n# TULIS KODEMU\nmedian = \nlebar_ci = \n\nprint(f"median={median}  lebar_ci={lebar_ci}")`,
        lockLines: 1,
        solution: `# waktu tunggu CS: n=60, median teramati 13.8 menit\n\n# TULIS KODEMU\nmedian = 13.8\nlebar_ci = round(16.1 - 11.6, 1)  # CI bootstrap 95%\n\nprint(f"median={median}  lebar_ci={lebar_ci}")`,
        checks: [
          { kind: "equal", task: "t1", name: "median", value: 13.8, tol: 1e-9, label: "`median` seharusnya 13.8", msg: "Median teramati 13,8 menit." },
          { kind: "equal", task: "t2", name: "lebar_ci", value: 4.5, tol: 0.01, label: "`lebar_ci` seharusnya 4.5", msg: "CI 95% selebar 4,5 menit — ketidakpastian yang nyata." },
          { kind: "stdout_matches", task: "t2", pattern: "median=13\\.8\\s+lebar_ci=4\\.5", label: "`print` menampilkan keduanya", msg: "Format: median=...  lebar_ci=... ." },
        ],
      },
      reference: "Tidak ada rumus? Resample saja datamu sendiri.",
    },
    {
      id: "ide-bootstrap",
      eyebrow: "Langkah 2 · Ide & algoritme",
      title: "Sampel adalah populasi mini",
      prose: [
        "Prinsip bootstrap satu kalimat: sampel adalah populasi mini terbaik yang kita punya — perlakukan ia seolah-olah populasi, dan simulasikan pengambilan sampel darinya. Rantai analogi: populasi F (tak diketahui) → sampel/distribusi empiris F̂ (diketahui); sampel acak dari F → resampel acak dari F̂ dengan pengembalian; statistik θ̂ bervariasi antar sampel → statistik θ̂* bervariasi antar resampel.",
        "Dengan pengembalian adalah nyawa bootstrap: tanpanya, resampel = sampel asli yang diacak urutannya — mediannya selalu sama, tidak ada variasi. Contoh mini (B=5), data [4,7,9,12,18], median teramati 9. Lima resampel memberi median {7, 9, 12, 9, 9} → SE ≈ 1,6. Praktiknya B ≥ 1.000 untuk SE, B ≥ 5.000 untuk CI.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `se_boot` = simpangan baku populasi dari [7,9,12,9,9]; bulatkan 1 desimal" },
      ],
      expected: "se_boot=1.6",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Bootstrap menciptakan data baru / menambah informasi. Salah — bootstrap tidak menambah informasi sedikit pun; ia hanya mengekstrak informasi tentang variabilitas yang sudah terkandung dalam sampel. Jika n = 10, bootstrap tidak sulap menjadi n = 1.000. Ia menjawab seberapa goyah statistik ini, bukan apa nilai yang benar.",
      },
      hints: [
        "Gunakan statistics.pstdev([7, 9, 12, 9, 9]).",
        "Bulatkan 1 desimal.",
        "Hasil ≈ 1.6.",
      ],
      code: {
        starter: `import statistics\n# median dari 5 resampel (B=5)\nmeds = [7, 9, 12, 9, 9]\n\n# TULIS KODEMU\nse_boot = \n\nprint(f"se_boot={se_boot}")`,
        lockLines: 2,
        solution: `import statistics\n# median dari 5 resampel (B=5)\nmeds = [7, 9, 12, 9, 9]\n\n# TULIS KODEMU\nse_boot = round(statistics.pstdev(meds), 1)\n\nprint(f"se_boot={se_boot}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se_boot", value: 1.6, tol: 0.01, label: "`se_boot` seharusnya 1.6", msg: "SE bootstrap ≈ 1,6 — dengan B=5.000 sebarannya halus dan stabil." },
          { kind: "stdout_matches", task: "t1", pattern: "se_boot=1\\.6", label: "`print` menampilkan se_boot", msg: "Format: se_boot=... ." },
        ],
      },
      reference: "B ≥ 1.000 untuk SE; B ≥ 5.000 untuk CI.",
    },
    {
      id: "ci-bootstrap",
      eyebrow: "Langkah 3 · CI bootstrap",
      title: "Persentil, BCa, dan bootstrap-t",
      prose: [
        "Metode persentil: ambil persentil 2,5% dan 97,5% dari sebaran bootstrap. Simpel dan intuitif. CI bootstrap boleh tidak simetris — tidak seperti x̄ ± margin. Itulah kelebihannya: mengikuti bentuk ketidakpastian yang sebenarnya.",
        "Versi yang lebih baik: BCa (bias-corrected and accelerated) — mengoreksi bias dan skewness sebaran bootstrap; standar emas praktis, hampir selalu sedikit lebih akurat — tetapi TIDAK dengan biaya komputasi yang sama seperti persentil. BCa butuh jackknife: statistik dihitung ulang n kali, tiap kali dengan satu observasi dikeluarkan, untuk mengestimasi konstanta akselerasi a. Untuk statistik murah itu sepele; untuk statistik mahal (misalnya refit model ML) biayanya nyata — n refit tambahan di atas B resampel. Bootstrap-t (studentized): orde akurasi lebih tinggi, tapi butuh SE di tiap resampel (mahal). Aturan praktis: persentil cukup untuk kebanyakan keperluan; BCa jika tersedia di library; bootstrap-t untuk n kecil yang kritis.",
        "Contoh reproduksibel — persentil vs BCa pada data yang sama. Data: 31 waktu tunggu (menit), miring kanan, mean 17,11 dan median 13,5: [2.8, 2.8, 3.2, 4.0, 5.4, 5.5, 5.8, 6.1, 6.7, 7.7, 8.0, 9.7, 9.9, 11.6, 12.4, 13.5, 13.8, 14.0, 14.5, 15.6, 17.8, 22.1, 22.7, 23.3, 24.8, 29.2, 31.8, 39.0, 40.0, 40.2, 66.6] (dibangkitkan dengan random.seed(11), lognormvariate(2.6, 0.8)). Bootstrap B = 5.000, seed 42. Untuk MEAN: CI persentil 95% = (12,41, 22,11); CI BCa 95% = (12,89, 23,03) — BCa bergeser ke ATAS sekitar 0,5–0,9 di kedua ujungnya, karena data miring kanan dan sebaran bootstrap-nya ikut miring (koreksi bias z0 = 0,031, akselerasi a = 0,0473). Untuk MEDIAN pada data yang sama: persentil (7,7, 17,8) vs BCa (6,7, 15,6) — BCa justru bergeser ke BAWAH (z0 = −0,191 mendominasi). Pelajarannya: BCa tidak selalu menggeser ke atas — arah koreksinya bergantung pada z0 dan a — tetapi ia hampir selalu lebih akurat, dan pada data miring perbedaannya nyata (di sini hampir 1 menit di ujung atas mean). Kode untuk mereproduksi (Python, tanpa library khusus selain statistics): hitung B median/mean resampel, ambil persentil 2,5/97,5 untuk metode persentil; untuk BCa, hitung z0 dari proporsi resampel di bawah statistik teramati, hitung a dari jackknife (n statistik leave-one-out), lalu geser level persentilnya dengan rumus alpha1 = Φ(z0 + (z0 − z)/(1 − a(z0 − z))) dan alpha2 = Φ(z0 + (z0 + z)/(1 − a(z0 + z))) dengan z = 1,96.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bootstrap adalah aplikasi metode Monte Carlo — prinsip yang sama dipakai di risk management (simulasi VaR portofolio). Jika lowongan risk analyst menulis Monte-Carlo, inilah keluarganya. Median, rasio dua mean, selisih kuantil 90%, koefisien model ML — semua bisa.",
      },
      reference: "CI bootstrap mengikuti bentuk ketidakpastian yang sebenarnya.",
    },
    {
      id: "permutasi",
      eyebrow: "Langkah 4 · Uji permutasi",
      title: "Hakim yang adil sempurna",
      prose: [
        "Uji permutasi: di bawah H0 (tidak ada beda antar grup), label grup tidak bermakna — jadi acak-acak labelnya, hitung ulang statistik, lihat seberapa sering hasil acakan seekstrem data asli. p-value = (1 + #{|T_perm| ≥ |T_obs|}) / (1 + B). Algoritme: hitung statistik teramati; gabung data, acak label, hitung ulang; ulangi ribuan kali → distribusi null empiris.",
        "Ia membangun dunia H0 langsung dari datamu, tanpa meminjam distribusi teoritis — uji permutasi PENUH, yang menghitung SEMUA pelabelan yang mungkin, adalah exact (α-nya tepat, bukan aproksimasi). Tetapi dalam praktik kita hampir selalu memakai versi Monte Carlo: B pengacakan acak, seperti rumus p di atas. Versi Monte Carlo itu HAMPIR exact — galat Monte Carlonya mengecil seiring B membesar — dan koreksi +1 pada pembilang dan penyebut membuatnya sedikit konservatif (p-value tidak pernah nol persis). Menyebut versi Monte Carlo 'exact' tanpa kualifikasi adalah keliru: exact penuh hanya bila semua permutasi dihitung. Syarat keduanya sama: exchangeability — di bawah H0 label boleh diacak. Kekuatan tersembunyi: statistiknya bebas — selisih mean, selisih median, selisih variansi, bahkan statistik buatanmu sendiri. Uji-t hanya bisa untuk mean; permutasi untuk apapun.",
      ],
      formula: String.raw`p = \frac{1 + \#\{|T_{\text{perm}}| \ge |T_{\text{obs}}|\}}{1 + B}`,
      formulaNote: "p = p-value uji permutasi; T_perm = statistik uji pada satu pengacakan label; T_obs = statistik pada data asli; B = banyaknya permutasi; pembilang dan penyebut ditambah 1 agar p-value tidak pernah nol persis.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Permutasi menggantikan semua uji-t. Salah — untuk kasus standar dengan asumsi terpenuhi, rumus tetap lebih efisien. Permutasi terbaik saat kamu ingin p-value tanpa asumsi distribusi, H0 = tidak ada beda, dan label grup bisa diacak.",
      },
      reference: "Uji-t sebenarnya adalah aproksimasi cepat dari uji permutasi.",
    },
    {
      id: "kapan-gagal",
      eyebrow: "Langkah 5 · Kapan bootstrap gagal",
      title: "Tiga lubang yang harus dihindari",
      prose: [
        "(1) n sangat kecil: sampel tidak mewakili populasi — sampah in, sampah out. (2) Statistik ekstrem (max/min): max resampel tidak pernah melebihi max sampel — sebaran bootstrap cacat untuk statistik ekstrem; butuh teori nilai ekstrem atau m-out-of-n. (3) Data dependen (time series): resampel acak menghancurkan autokorelasi → SE underestimate → CI terlalu sempit. Solusi: block bootstrap — resample blok-blok berurutan agar struktur korelasi terjaga.",
        "Mnemonik: bootstrap = meniru dunia nyata untuk ESTIMASI (SE/CI); permutasi = membangun dunia H0 untuk PENGUJIAN (p-value). Tertukar = memakai obeng untuk memaku. Butuh CI untuk rasio dua median → bootstrap. Butuh p-value apakah median A > median B → permutasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bootstrap acak pada return harian (berkorelasi waktu) untuk CI Sharpe ratio memberi CI terlalu sempit — terlalu percaya diri. Untuk time series finansial, selalu block bootstrap. CI yang terlalu sempit = risiko yang diremehkan.",
      },
      reference: "Bootstrap untuk estimasi; permutasi untuk pengujian.",
    },
    {
      id: "minicase-sla",
      eyebrow: "Langkah 6 · Mini-case",
      title: "SLA: lolos atau belum konklusif?",
      prose: [
        "Manajer CS menetapkan SLA: median waktu tunggu < 15 menit. Data bulan ini (n=60): median 13,8 — lolos! katanya. Kamu diminta verifikasi dengan interval kepercayaan.",
        "(a) Rumus x̄ ± margin untuk mean, bukan median — dan SLA ditulis dalam median (tepat, karena data miring). Tidak ada rumus sederhana untuk CI median → bootstrap jawabannya. (b) Bootstrap 95% CI metode persentil = (11,6, 16,1) — mencakup 15! Data konsisten dengan median sebenarnya 15,5 (gagal SLA) maupun 12 (lolos). Klaim lolos dari titik estimasi = presisi palsu. (c) Laporkan SLA sebagai interval: median 13,8 (95% CI: 11,6–16,1) — belum konklusif vs target 15. Tetapkan aturan sebelum periode: lolos jika batas atas CI < 15. Dan tambah n bulan depan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lebar` = 16,1 − 11,6" },
        { id: "t2", text: "Hitung `atas_melebihi` = 16,1 − 15 (seberapa jauh batas atas melewati target); bulatkan 1 desimal" },
      ],
      expected: "lebar=4.5  atas_melebihi=1.1",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Batas atas CI melewati target 1,1 menit — klaim lolos mengabaikan ketidakpastian ±2 menit. Aturan keputusan yang defensibel memakai batas interval (ditetapkan sebelum periode), bukan titik estimasi.",
      },
      hints: [
        "lebar = round(16.1 - 11.6, 1).",
        "atas_melebihi = round(16.1 - 15, 1).",
        "Keduanya positif — interval mencakup target.",
      ],
      code: {
        starter: `# bootstrap 95% CI median: (11.6, 16.1); target SLA < 15\n\n# TULIS KODEMU\nlebar = \natas_melebihi = \n\nprint(f"lebar={lebar}  atas_melebihi={atas_melebihi}")`,
        lockLines: 1,
        solution: `# bootstrap 95% CI median: (11.6, 16.1); target SLA < 15\n\n# TULIS KODEMU\nlebar = round(16.1 - 11.6, 1)\natas_melebihi = round(16.1 - 15, 1)\n\nprint(f"lebar={lebar}  atas_melebihi={atas_melebihi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lebar", value: 4.5, tol: 0.01, label: "`lebar` seharusnya 4.5", msg: "CI selebar 4,5 menit — datanya kurang untuk vonis tajam." },
          { kind: "equal", task: "t2", name: "atas_melebihi", value: 1.1, tol: 0.01, label: "`atas_melebihi` seharusnya 1.1", msg: "Batas atas 1,1 menit di atas target — belum konklusif." },
          { kind: "stdout_matches", task: "t2", pattern: "lebar=4\\.5\\s+atas_melebihi=1\\.1", label: "`print` menampilkan keduanya", msg: "Format: lebar=...  atas_melebihi=... ." },
        ],
      },
      reference: "Titik estimasi tanpa ketidakpastian = presisi palsu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Bootstrap: perlakukan sampel sebagai populasi mini; resample dengan pengembalian.",
        "B ≥ 1.000 untuk SE; B ≥ 5.000 untuk CI; BCa = standar emas praktis (lebih akurat, tetapi butuh jackknife — biayanya lebih tinggi dari persentil).",
        "Permutasi: acak label untuk membangun dunia H0 — exact penuh hanya bila semua permutasi dihitung; versi Monte Carlo (B acakan) hampir exact — untuk p-value.",
        "Bootstrap gagal: n sangat kecil, statistik ekstrem, data dependen (pakai block).",
        "Bootstrap untuk estimasi (CI); permutasi untuk pengujian (p-value).",
      ],
      next: { label: "A3.0 — Alur Modeling", href: "/v2/learn/a30-alur-modeling" },
      quiz: [
        {
          q: "Apa ide inti bootstrap dalam satu kalimat?",
          options: [
            { text: "Mengumpulkan data baru yang banyak", why: "Tidak ada data baru — hanya resampling data yang ada." },
            { text: "Memperlakukan sampel sebagai 'populasi mini' dan mensimulasikan pengambilan sampel darinya (dengan pengembalian)", why: "'Dengan pengembalian' adalah nyawanya — tanpanya tidak ada variasi.", correct: true },
            { text: "Mengasumsikan semua data normal", why: "Justru tanpa asumsi distribusi — itu kelebihannya." },
            { text: "Menghapus outlier lalu menghitung ulang", why: "Tidak menghapus apa-apa — resampling memakai semua data." },
          ],
        },
        {
          q: "Kapan uji permutasi menjadi pilihan terbaik?",
          options: [
            { text: "Selalu — gantikan semua uji-t", why: "Untuk kasus standar dengan asumsi terpenuhi, rumus lebih efisien." },
            { text: "Saat ingin p-value tanpa asumsi distribusi, H0 = 'tidak ada beda', dan label grup bisa diacak (exchangeable)", why: "Permutasi membangun dunia H0 langsung dari data — bebas asumsi distribusi; exact penuh bila semua permutasi dihitung, hampir exact pada versi Monte Carlo dengan B besar.", correct: true },
            { text: "Hanya untuk n > 1000", why: "Tidak ada syarat n minimum khusus." },
            { text: "Saat datanya normal", why: "Saat normal, uji klasik sudah cukup — permutasi untuk yang tanpa asumsi." },
          ],
        },
        {
          q: "Bootstrap untuk statistik MAX dari n=30 data. Apa masalahnya?",
          options: [
            { text: "Tidak ada — bootstrap untuk semua statistik", why: "Ada: statistik ekstrem adalah kegagalan klasik bootstrap." },
            { text: "Max resampel tidak pernah melebihi max sampel — sebaran bootstrap cacat untuk statistik ekstrem", why: "Resampling tidak bisa mengeksplorasi di luar data teramati.", correct: true },
            { text: "B terlalu kecil", why: "B lebih besar tidak memperbaiki — masalahnya struktural." },
            { text: "Harus tanpa pengembalian", why: "Tanpa pengembalian justru menghilangkan variasi." },
          ],
        },
        {
          q: "Data return harian (berkorelasi waktu) di-bootstrap acak untuk CI Sharpe ratio. Apa risikonya?",
          options: [
            { text: "Tidak ada risiko", why: "Ada: autokorelasi dihancurkan resampel acak." },
            { text: "Resampel acak menghancurkan autokorelasi → SE underestimate → CI terlalu sempit. Solusi: block bootstrap", why: "CI terlalu sempit = terlalu percaya diri = risiko diremehkan.", correct: true },
            { text: "CI jadi terlalu lebar", why: "Sebaliknya — CI jadi terlalu sempit." },
            { text: "Sharpe tidak bisa di-bootstrap", why: "Bisa — dengan block bootstrap." },
          ],
        },
        {
          q: "Tim butuh (i) CI untuk rasio dua median, (ii) p-value untuk 'apakah median A > median B'.",
          options: [
            { text: "(i) permutasi, (ii) bootstrap", why: "Terbalik — bootstrap untuk estimasi, permutasi untuk pengujian." },
            { text: "(i) bootstrap (estimasi CI), (ii) permutasi (pengujian p-value)", why: "Mnemonik: bootstrap = estimasi; permutasi = pengujian.", correct: true },
            { text: "Keduanya bootstrap", why: "Bootstrap tidak memberi p-value yang tepat untuk pengujian." },
            { text: "Keduanya permutasi", why: "Permutasi tidak memberi CI estimasi." },
          ],
        },
      ],
      note: {
        title: "Intuisi: bootstrap mengukur goyangnya jarum, bukan ketajaman matamu",
        body: "Lima heuristik. Satu: bootstrap tidak menciptakan informasi — ia hanya mengukur seberapa goyang estimasimu seandainya dunia diulang; presisi yang ia laporkan adalah presisi yang sudah ada di sampelmu, bukan yang kamu harapkan. Dua: bila sampelmu tidak mewakili populasi, bootstrap mewarisi kebutaan itu dengan presisi tinggi — interval sempit di sekitar jawaban yang salah adalah sampah yang meyakinkan. Tiga: B besar tidak memperbaiki bias — ia hanya menstabilkan Monte Carlo error; B = 10.000 tidak menyelamatkan n = 12. Empat: untuk statistik ekstrem seperti maksimum, bootstrap buta total — max resampel tidak pernah melebihi max sampel, sehingga sebaran bootstrapnya cacat secara struktural; kenali statistik yang tidak boleh di-bootstrap. Lima: mnemonik abadi — bootstrap untuk ESTIMASI (seberapa goyang angkaku?), permutasi untuk PENGUJIAN (seberapa aneh angkaku di dunia H0?); tertukar berarti memakai penggaris untuk menimbang. Dan ingat: dengan pengembalian adalah nyawa bootstrap — tanpanya, resampel hanyalah sampel asli yang diacak urutannya. Intuisi pamungkas: bootstrap menjawab seberapa yakin kamu boleh pada angka dari sampel ini — bukan seberapa benar angka itu di dunia nyata.",
      },
    },
  ],
};
