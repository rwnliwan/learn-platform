import type { V2Lesson } from "../lib/types";

export const e8: V2Lesson = {
  slug: "e8-markowitz",
  track: "Financial Markets",
  module: "Teori Portofolio",
  title: "E8. Markowitz & Diversifikasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-payung-eskrim",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Dua saham liar, satu portofolio tenang",
      prose: [
        "Tahun 1952, mahasiswa 25 tahun Harry Markowitz menulis tesis yang kelak memenangkan Nobel Ekonomi. Idenya: gabungkan dua aset berisiko, dan risikonya bisa lebih kecil dari masing-masing aset sendirian. Contoh: Saham PAYUNG naik saat hujan, Saham ESKRIM naik saat panas — masing-masing liar sendirian, tapi digabung 50/50, saat satu jatuh yang lain naik. Portofolionya tenang.",
        "Markowitz tidak menemukan saham yang lebih baik — ia menemukan bahwa risiko portofolio bukan rata-rata dari risiko anggotanya. Syaratnya bernama korelasi. Hitung: PAYUNG & ESKRIM masing-masing return 10%, vol 20%, korelasi −0,3. Berapa vol portofolio 50/50?",
      ],
      formula: String.raw`E[R_p] = w_1 E[R_1] + w_2 E[R_2] \qquad \sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2`,
      formulaNote: "w = bobot; σ = volatilitas; ρ = korelasi (−1 s.d. +1) — bintang utama lesson ini.",
      tasks: [
        { id: "t1", text: "Hitung `var_p` (variansi portofolio)" },
        { id: "t2", text: "Hitung `vol_p` (volatilitas = akar variansi)" },
      ],
      expected: "var_p=0.014  vol_p=0.1183",
      note: {
        title: "Sering salah",
        body: "Mengira risiko portofolio = rata-rata risiko anggotanya. Rata-rata vol = 20%, tapi vol portofolio = 11,8% — suku korelasi memberi “diskon risiko”.",
      },
      hints: [
        "Tiga suku: (0,5×0,2)² + (0,5×0,2)² + 2×0,5×0,5×(−0,3)×0,2×0,2.",
        "Suku ketiga negatif karena korelasi negatif — itulah diskonnya.",
        "vol_p = math.sqrt(var_p)",
      ],
      code: {
        starter: `import math\nw1 = w2 = 0.5\ns1 = s2 = 0.20\nrho = -0.3\n\n# TULIS KODEMU: variansi dan volatilitas portofolio\nvar_p = \nvol_p = \n\nprint(f"var_p={var_p:.4f}  vol_p={vol_p:.4f}")\nprint(f"rata-rata vol anggota = {(s1+s2)/2:.2f} -> diskon {(1-vol_p/0.20)*100:.0f}%")`,
        lockLines: 4,
        solution: `import math\nw1 = w2 = 0.5\ns1 = s2 = 0.20\nrho = -0.3\n\n# TULIS KODEMU: variansi dan volatilitas portofolio\nvar_p = (w1*s1)**2 + (w2*s2)**2 + 2*w1*w2*rho*s1*s2\nvol_p = math.sqrt(var_p)\n\nprint(f"var_p={var_p:.4f}  vol_p={vol_p:.4f}")\nprint(f"rata-rata vol anggota = {(s1+s2)/2:.2f} -> diskon {(1-vol_p/0.20)*100:.0f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_p", value: 0.014, tol: 1e-9, label: "`var_p` seharusnya 0,014", msg: "0,01 + 0,01 − 0,006 = 0,014. Suku korelasi negatif = diskon." },
          { kind: "equal", task: "t2", name: "vol_p", value: 0.1183, tol: 0.001, label: "`vol_p` sekitar 0,1183", msg: "√0,014 = 11,83% — turun 41% dari 20%, return ekspektasi tetap 10%." },
          { kind: "stdout_matches", task: "t2", pattern: "var_p=0\\.0140\\s+vol_p=0\\.1183", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Return = rata-rata tertimbang. Risiko ≠ rata-rata — ada diskon dari korelasi.",
    },
    {
      id: "korelasi",
      eyebrow: "Langkah 2 · Korelasi",
      title: "Satu-satunya “makan siang gratis” di keuangan",
      prose: [
        "Korelasi mengukur seberapa searah dua aset bergerak: +1 = selalu bersama (tidak ada diversifikasi — buang-buang waktu), < 1 = ada diskon risiko (makin kecil ρ, makin besar diskonnya), −1 = risiko bisa nol secara teoretis.",
        "Dua aset identik (vol 20% masing-masing), bobot 50/50. Hitung vol portofolio saat korelasi = 0 dan saat korelasi = −1.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `vol_rho0` (korelasi 0)" },
        { id: "t2", text: "Hitung `vol_rho_neg1` (korelasi −1)" },
      ],
      expected: "vol_rho0=0.1414  vol_rho_neg1=0.0",
      note: {
        title: "Sering salah",
        body: "“Punya 20 saham = terdiversifikasi.” Diversifikasi dihitung dari korelasi, bukan jumlah — 20 saham se-sektor berkorelasi 0,8 = 1 taruhan, bukan 20.",
      },
      hints: [
        "Rumus sama seperti langkah 1, hanya ρ yang diganti.",
        "ρ=0 → suku korelasi hilang. ρ=−1 → saling meniadakan.",
        "vol = math.sqrt((0.5*0.2)**2*2 + 2*0.25*rho*0.04)",
      ],
      code: {
        starter: `import math\nw, s = 0.5, 0.20\n\ndef vol_port(rho):\n    var = (w*s)**2 + (w*s)**2 + 2*w*w*rho*s*s\n    return math.sqrt(var)\n\n# TULIS KODEMU: vol untuk rho=0 dan rho=-1\nvol_rho0 = \nvol_rho_neg1 = \n\nprint(f"vol_rho0={vol_rho0:.4f}  vol_rho_neg1={vol_rho_neg1:.4f}")`,
        lockLines: 6,
        solution: `import math\nw, s = 0.5, 0.20\n\ndef vol_port(rho):\n    var = (w*s)**2 + (w*s)**2 + 2*w*w*rho*s*s\n    return math.sqrt(var)\n\n# TULIS KODEMU: vol untuk rho=0 dan rho=-1\nvol_rho0 = vol_port(0.0)\nvol_rho_neg1 = vol_port(-1.0)\n\nprint(f"vol_rho0={vol_rho0:.4f}  vol_rho_neg1={vol_rho_neg1:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "vol_rho0", value: 0.1414, tol: 0.001, label: "`vol_rho0` sekitar 0,1414", msg: "√(0,01 + 0,01) = 14,14% — diskon 29% dari 20%." },
          { kind: "equal", task: "t2", name: "vol_rho_neg1", value: 0.0, tol: 1e-9, label: "`vol_rho_neg1` = 0", msg: "Korelasi −1 sempurna = saling meniadakan. Teoretis — di dunia nyata langka." },
          { kind: "stdout_matches", task: "t2", pattern: "vol_rho_neg1=0\\.0000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Korelasi — bukan jumlah aset — adalah mesin diversifikasi.",
    },
    {
      id: "frontier",
      eyebrow: "Langkah 3 · Efficient frontier",
      title: "Peta harta karun: return max per level risiko",
      prose: [
        "Efficient frontier = kurva portofolio-portofolio yang memberi return tertinggi untuk tiap level risiko. Portofolio di bawah kurva = tidak efisien: ada yang lebih baik dengan risiko sama. Cara pakai: tentukan toleransi risikomu → naik ke kurva → baca return maksimalnya → itulah bobot optimalmu.",
        "Total risiko saham = risiko idiosinkratik (bisa didiversifikasi: kebakaran pabrik, CEO tersandung kasus) + risiko sistematis (tidak bisa: resesi, kenaikan BI rate). Karena risiko idiosinkratik bisa dihilangkan gratis, pasar tidak membayar kamu untuk menanggungnya — satu-satunya risiko yang “dihargai” pasar = risiko sistematis. Ini jembatan ke CAPM: model yang mengaitkan return ekspektasi dengan beta — hanya risiko sistematis yang dihargai pasar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Correlation breakdown: saat krisis, korelasi melonjak — semua jatuh bersamaan. Uji portofoliomu dengan korelasi stres (ρ + 0,3), bukan korelasi masa tenang. Diversifikasi yang gagal saat panik = ilusi.",
      },
      reference: "Frontier = kompas, bukan GPS: inputnya tebakan masa depan, jangan over-presisi.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang return portofolio dan korelasi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "50% saham (E[R]=12%) + 50% obligasi (E[R]=6%). Expected return portofolio?",
          options: [
            { text: "18%", why: "Salah: return portofolio = rata-rata tertimbang, bukan jumlah." },
            { text: "9% (rata-rata tertimbang)", why: "Benar: 0,5×12 + 0,5×6 = 9%. Sisi return selalu sederhana — keajaiban hanya di sisi risiko.", correct: true },
            { text: "6%", why: "Salah: itu return obligasinya saja." },
            { text: "Tidak bisa dihitung", why: "Salah: bisa — rata-rata tertimbang bobotnya." },
          ],
        },
        {
          q: "“Punya 20 saham = terdiversifikasi.” Salahnya di mana?",
          options: [
            { text: "Tidak salah", why: "Salah: jumlah tanpa memperhatikan korelasi = diversifikasi semu." },
            { text: "Diversifikasi dihitung dari korelasi, bukan jumlah — 20 saham se-sektor = 1 taruhan", why: "Benar: 20 saham bank berkorelasi 0,8 nyaris tidak memberi diskon risiko.", correct: true },
            { text: "20 terlalu sedikit", why: "Salah: masalahnya bukan jumlahnya." },
            { text: "Saham tidak bisa didiversifikasi", why: "Salah: bisa — dengan aset berkorelasi rendah." },
          ],
        },
      ],
    },
    {
      id: "minicase-dito",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Dito dan “10 saham”-nya",
      prose: [
        "Dito punya: 8 saham teknologi (total Rp80 jt), 1 saham bank (Rp10 jt), 1 saham tambang (Rp10 jt). Ia mengklaim “terdiversifikasi 10 saham”. Data: korelasi antar saham teknologi ≈ 0,75; teknologi–bank ≈ 0,6; teknologi–tambang ≈ 0,3; bank–tambang ≈ 0,2.",
        "Pertanyaan: (a) Apakah Dito benar-benar terdiversifikasi? (b) Jika ia menambah Rp20 jt, ke mana sebaiknya — saham teknologi ke-9 atau SBN? (c) Apa risiko terbesar portofolionya yang tidak terlihat dari “10 saham”?",
        "Pembahasan: (a) Tidak. 80% dananya di satu klaster berkorelasi 0,75 — “diskon risiko”-nya kecil. Ini 1,5 taruhan, bukan 10. (b) SBN. Korelasi SBN–saham mendekati 0 (bahkan negatif saat flight to quality) → diskon diversifikasi maksimal. Saham teknologi ke-9 menambah risiko nyaris tanpa diskon. (c) Risiko konsentrasi sektor + correlation breakdown: saat krisis teknologi, korelasi 0,75 bisa melonjak ke 0,9 — seluruh 80% jatuh bersamaan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Konsentrasi tersembunyi = risiko yang tidak terlihat dari hitungan “jumlah saham”. Selalu petakan eksposur per klaster korelasi, bukan per jumlah posisi.",
      },
      reference: "Diversifikasi sejati = aset yang tidak jatuh bersamaan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Diversifikasi yang benar: empat skenario",
      prose: [
        "Cek diversifikasi portofoliomu → hitung korelasi, bukan jumlah aset. 10 saham teknologi ≈ 1 taruhan; tambah SBN/emas/kas — bukan saham ke-11 yang se-sektor. Krisis datang, semua merah → jangan hitung diversifikasi dari data tenang; uji dengan korelasi stres.",
        "Pilih di antara dua portofolio → yang di frontier (atas-kiri) menang: di bawah frontier = membayar risiko tanpa kompensasi penuh. Tambah aset baru → tanya korelasinya dengan yang sudah ada: aset ber-return tinggi tapi berkorelasi +0,9 menambah risiko tanpa diskon diversifikasi.",
        "Aturan 10 detik: return = rata-rata tertimbang. Risiko ≠ rata-rata — ada diskon dari korelasi. Diversifikasi = korelasi rendah, bukan jumlah banyak.",
      ],
      tasks: [],
      reference: "Korelasi rendah = diskon. Korelasi krisis = uji jujur.",
    },
    {
      id: "markowitz-lanjut",
      eyebrow: "Langkah 7 · Pendalaman: estimation error",
      title: "Error-maximizer: kenapa optimasi butuh rem",
      prose: [
        "Markowitz mengasumsikan kamu TAHU expected return dan kovarians. Kenyataannya kamu menebak dari data historis yang berisik — dan di sinilah optimasi berkhianat: ia memberi bobot TERBESAR ke aset dengan estimasi return paling optimistis, yang justru paling mungkin salah tebak. Richard Michaud menjulukinya “error-maximizer” — mesin yang secara sistematis memaksimalkan kesalahan estimasimu. Portofolio “optimal” tanpa pengaman sering kalah dari portofolio naif di dunia nyata.",
        "Bukti paling memalukan: DeMiguel, Garlappi, dan Uppal (2009) menguji 14 model optimasi canggih melawan strategi 1/N (bagi rata ke semua aset) — 1/N tidak terkalahkan secara konsisten dengan data historis biasa. Bukan karena 1/N pintar, melainkan karena ia jujur: “aku tidak tahu, jadi aku tidak bertaruh besar pada tebakanku.” Diversifikasi naif mengalahkan presisi palsu.",
        "Tiga rem praktis. Pertama, shrinkage: tarik estimasi ekstrem ke arah rata-rata — kovarians dengan metode Ledoit-Wolf, return dengan intuisi James-Stein. Kedua, kendala bobot: batasi tiap aset misalnya maksimal 30% — sabuk pengaman yang memaksa diversifikasi. Ketiga, Black-Litterman: mulai dari bobot pasar (prior netral), lalu campurkan pandanganmu dengan bobot keyakinan — bukan menggantikan semuanya.",
        "Aturan praktis: (1) hasil optimasi dengan satu aset > 50% = curigai inputnya, bukan rayakan; (2) optimasi tanpa kendala hanya ada di textbook; (3) mulai dari 1/N — deviasi hanya sebesar keyakinanmu, bukan sebesar keinginanmu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `w_naive` (bobot proporsional estimasi)" },
        { id: "t2", text: "Bandingkan `r_naive` vs `r_sama` (realisasi)" },
      ],
      expected: "w_naive=0.60  r_naive=0.068  r_sama=0.070",
      hints: [
        "w_naive = estimasi aset 1 ÷ total estimasi.",
        "Realisasi memakai r_true (yang tak terlihat saat optimasi!).",
      ],
      code: {
        starter: `r_true = [0.06, 0.08]   # return SEBENARNYA (tak terlihat)\nr_est = [0.12, 0.08]    # estimasi berisik: aset 1 terlihat bagus\n\n# TULIS KODEMU\nw_naive = \nr_naive = \nr_sama = \n\nprint(f"w_naive={w_naive:.2f}  r_naive={r_naive:.3f}  r_sama={r_sama:.3f}")`,
        lockLines: 2,
        solution: `r_true = [0.06, 0.08]   # return SEBENARNYA (tak terlihat)\nr_est = [0.12, 0.08]    # estimasi berisik: aset 1 terlihat bagus\n\n# TULIS KODEMU\nw_naive = r_est[0] / sum(r_est)\nr_naive = w_naive * r_true[0] + (1 - w_naive) * r_true[1]\nr_sama = 0.5 * r_true[0] + 0.5 * r_true[1]\n\nprint(f"w_naive={w_naive:.2f}  r_naive={r_naive:.3f}  r_sama={r_sama:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w_naive", value: 0.60, tol: 0.001, label: "`w_naive` seharusnya 0,60", msg: "0,12 ÷ 0,20 = 0,60. Optimasi bertaruh besar pada tebakan berisik." },
          { kind: "equal", task: "t2", name: "r_naive", value: 0.068, tol: 0.001, label: "`r_naive` seharusnya 0,068", msg: "0,6×0,06 + 0,4×0,08 = 0,068." },
          { kind: "equal", task: "t2", name: "r_sama", value: 0.070, tol: 0.001, label: "`r_sama` seharusnya 0,070", msg: "0,5×0,06 + 0,5×0,08 = 0,070. 1/N menang — error dimaksimalkan optimasi." },
          { kind: "stdout_matches", task: "t2", pattern: "w_naive=0\\.60\\s+r_naive=0\\.068\\s+r_sama=0\\.070", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: optimasi memaksimalkan kesalahanmu",
        body: "Rumus Markowitz tidak salah — inputnyalah yang berbohong dengan percaya diri. Empat heuristik. Pertama: sampah masuk, bobot ekstrem keluar — kalau optimasi memberimu 73% di satu saham, ia sedang berkata “tebakanmu tentang saham ini sangat optimistis”, bukan “saham ini sangat bagus”; bobot ekstrem = cermin estimasi ekstrem. Kedua: 1/N adalah pengakuan ketidaktahuan yang terhormat — ia kalah dari optimasi sempurna yang mustahil, tetapi menang dari optimasi berisik yang nyata; DeMiguel dan kawan-kawan membuktikannya atas 14 model canggih. Ketiga: shrinkage = kompromi antara data dan akal sehat — tarik angka ekstrem ke tengah sebelum memercayainya; pasar menghukum keyakinan berlebihan lebih keras daripada ketidaktahuan. Keempat: alokasikan usaha estimasi sesuai kesulitannya — butuh ~10 tahun data untuk mengestimasi return dengan layak, tetapi cuma ~1 tahun untuk mengestimasi risiko; kebanyakan orang menghabiskan 90% waktu untuk 10% kepastian. Dan ingat: diversifikasi yang dipaksakan oleh kendala bobot sering mengalahkan diversifikasi yang “dihitung” dari kovarians berisik — karena kendala tidak berbohong. Aturan 10 detiknya: mulai dari 1/N, deviasi hanya sebesar keyakinanmu — bukan sebesar keinginanmu.",
      },
      reference: "Optimasi = error-maximizer. 1/N = prior jujur. Shrinkage + kendala = rem.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Return portofolio = rata-rata tertimbang. Sederhana, tanpa keajaiban.",
        "Risiko portofolio = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂ — suku korelasi = sumber “diskon risiko”.",
        "Diversifikasi = korelasi rendah, bukan jumlah aset banyak.",
        "Efficient frontier = return max per level risiko; portofolio di bawahnya tidak efisien.",
        "Waspada correlation breakdown — uji portofolio dengan korelasi krisis.",
      ],
      next: { label: "E9 — CAPM", href: "/learn/e9-capm" },
      quiz: [
        {
          q: "Dua aset identik (σ=20%), bobot 50/50, korelasi −1. Volatilitas portofolio?",
          options: [
            { text: "20%", why: "Salah: itu jika korelasi +1 (bergerak seiring)." },
            { text: "10%", why: "Salah: itu rata-rata sederhana — bukan cara kerja rumus portofolio." },
            { text: "0% — saling meniadakan sempurna (teoretis)", why: "Benar: setiap gerak satu aset dibatalkan yang lain. Di dunia nyata korelasi −1 sempurna langka.", correct: true },
            { text: "40%", why: "Salah: korelasi negatif MENGURANGI risiko, bukan menambah." },
          ],
        },
        {
          q: "Portofolio A terletak DI BAWAH efficient frontier. Artinya…",
          options: [
            { text: "A optimal", why: "Salah: optimal = tepat di kurva frontier." },
            { text: "A tidak efisien — ada portofolio lain dengan return sama tapi risiko lebih kecil", why: "Benar: di bawah kurva = membayar risiko tanpa kompensasi penuh.", correct: true },
            { text: "A bebas risiko", why: "Salah: bebas risiko = titik tersendiri, bukan “di bawah kurva”." },
            { text: "Frontier salah hitung", why: "Salah: posisi A yang tidak efisien, bukan kurvanya." },
          ],
        },
        {
          q: "Mengapa diversifikasi “gagal saat paling dibutuhkan”?",
          options: [
            { text: "Karena rumusnya salah", why: "Salah: rumusnya benar — asumsinya (korelasi stabil) yang jebol." },
            { text: "Correlation breakdown: saat krisis, korelasi melonjak — semua jatuh bersamaan", why: "Benar: diversifikasi dari data tenang memberi rasa aman palsu. Uji dengan korelasi stres!", correct: true },
            { text: "Karena investor panik", why: "Salah: kepanikan = gejala; korelasi yang melonjak = mekanismenya." },
            { text: "Tidak pernah gagal", why: "Salah: 2008, 2020 = bukti diversifikasi bisa gagal saat krisis." },
          ],
        },
      ],
    },
  ],
};
