import type { V2Lesson } from "../lib/types";

export const pmc14: V2Lesson = {
  slug: "pm-c14-wealth-planning-multitahun",
  track: "Portfolio Management",
  module: "Private Wealth",
  title: "C14 — Wealth Planning Multi-Tahun: Horizon, Monte Carlo, dan Aturan Belanja",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rencana 5 tahun yang 'pasti berhasil' — sampai tahun ke-2 pasar jatuh 20 persen",
      prose: [
        "Pak Darma, 55 tahun, punya Rp500 juta dan menabung Rp60 juta per tahun. Perencana keuangannya menghitung: return 7 persen per tahun, 5 tahun lagi dananya menjadi Rp1.046 juta — di atas target Rp1.000 juta. 'Pasti berhasil,' katanya. Tahun ke-2, pasar jatuh 20 persen. Dana Pak Darma — yang seharusnya Rp637 juta di jalur rencana — tinggal Rp510 juta. Rencana yang 'pasti berhasil' tiba-tiba terlihat gagal. Bukan karena hitungannya salah — melainkan karena rencananya hanya punya SATU jalur, sementara masa depan punya ribuan.",
        "Inilah beda antara IPS statis (PM-C1) dan wealth planning multi-tahun: IPS memotret tujuan dan constraint hari ini; wealth planning mensimulasikan ribuan masa depan dan merancang aturan yang bertahan di sebagian besar dari mereka. Return 7 persen bukan janji — ia rata-rata dari distribusi yang lebar. Perencana yang jujur tidak berkata 'pasti berhasil'; ia berkata 'berhasil dalam 87 persen simulasi — dan ini yang kita lakukan bila masuk 13 persen sisanya'.",
        "Lesson ini membangun dari PM-C1 (IPS: objectives, constraints, horizon 15 tahun, review tahunan) dan PM-C3 (alokasi aset) — tetapi tidak ada lesson yang mensimulasikan rencana multi-tahun secara dinamis: Monte Carlo, guardrail belanja, urutan penarikan yang efisien pajak, dan glidepath. Setelah lesson ini kamu bisa: (1) menghitung nilai masa depan rencana dengan kontribusi; (2) menjelaskan Monte Carlo dan probabilitas keberhasilan; (3) merancang aturan belanja guardrail; (4) mengurutkan penarikan dari akun kena pajak, tangguh pajak, dan bebas pajak; (5) menjelaskan glidepath dan human capital.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "PM-C1 mengajarkan IPS sebagai potret statis (return objective, risk tolerance, lima constraints, horizon 15 tahun, review tahunan dan saat life event) dan PM-C3 mengajarkan alokasi aset. Tidak ada lesson yang mensimulasikan rencana multi-tahun secara dinamis: tidak ada Monte Carlo, tidak ada probabilitas keberhasilan, tidak ada guardrail belanja, tidak ada urutan penarikan, tidak ada glidepath. Lesson ini membangun kelimanya.",
      },
      reference: "Rp500 juta + Rp60 juta/tahun, return 7 persen, 5 tahun → Rp1.046,32 juta (surplus Rp46,32 juta di atas target Rp1.000 juta). Aturan 4 persen: belanja Rp40 juta/tahun dari Rp1.000 juta.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang rencana kekayaan yang bertahan di banyak masa depan — bukan hanya di satu spreadsheet.",
        "(1) Menghitung nilai masa depan rencana dengan kontribusi tahunan;",
        "(2) Menjelaskan simulasi Monte Carlo dan probabilitas keberhasilan;",
        "(3) Merancang aturan belanja guardrail (Guyton-Klinger);",
        "(4) Mengurutkan penarikan dari akun kena pajak, tangguh pajak, dan bebas pajak;",
        "(5) Menjelaskan glidepath dan human capital dalam alokasi multi-tahun.",
      ],
      tasks: [],
    },
    {
      id: "nilai-masa-depan",
      eyebrow: "Langkah 3 · Teori",
      title: "Nilai masa depan: satu jalur, ribuan kemungkinan",
      prose: [
        "Nilai masa depan rencana dihitung dari dua bagian: nilai kini yang bertumbuh, dan kontribusi tahunan yang bertumbuh. Rumusnya: FV = PV × (1+r)^n + C × (((1+r)^n − 1) / r). Contoh Pak Darma: PV Rp500 juta, C Rp60 juta per tahun, r 7 persen, n 5 tahun. (1,07)^5 = 1,4026. Bagian pertama: 500 × 1,4026 = Rp701,28 juta. Bagian kedua: 60 × (0,4026 / 0,07) = 60 × 5,7507 = Rp345,04 juta. Total: Rp1.046,32 juta — surplus Rp46,32 juta di atas target Rp1.000 juta.",
        "Tetapi angka itu adalah SATU jalur — jalur di mana return tepat 7 persen setiap tahun. Kenyataannya, return tahunan berfluktuasi: 7 persen adalah rata-rata dari distribusi dengan standar deviasi 12–15 persen. Simulasi Monte Carlo membangkitkan ribuan jalur: tiap jalur mengundi return tiap tahun dari distribusi itu, lalu menghitung nilai akhir. Hasilnya bukan satu angka, melainkan distribusi: median mungkin Rp1.020 juta, persentil ke-10 mungkin Rp780 juta, persentil ke-90 mungkin Rp1.350 juta. Probabilitas keberhasilan = persentase jalur yang mencapai target Rp1.000 juta — misalnya 87 persen.",
        "Probabilitas 87 persen bukan vonis — ia adalah bahan keputusan. Bila probabilitas di bawah 70 persen, rencana perlu diubah: tambah kontribusi, tunda pensiun 1 tahun, atau turunkan target. Bila di atas 95 persen, klien mungkin menabung berlebihan dan bisa menikmati hidup lebih banyak hari ini. Aturan praktis perencana: targetkan probabilitas 80–90 persen — cukup tinggi untuk tidur nyenyak, cukup rendah untuk tidak mengorbankan hidup hari ini demi kepastian yang tidak pernah ada.",
        "Satu peringatan tentang Monte Carlo: hasilnya hanya sebaik asumsinya. Return yang diasumsikan 7 persen dengan volatilitas 12 persen memberi probabilitas yang sangat berbeda dari return 5 persen dengan volatilitas 18 persen. Dan Monte Carlo standar mengasumsikan return tiap tahun independen — padahal return berurutan berkorelasi (mean reversion, PM-C8). Perencana yang jujur menunjukkan sensitivitas: bagaimana probabilitas berubah bila return turun 1 poin atau volatilitas naik 3 poin.",
      ],
      tasks: [],
      formula: String.raw`FV = PV(1+r)^n + C\frac{(1+r)^n - 1}{r} \qquad P_{sukses} = \frac{\text{jalur mencapai target}}{\text{semua jalur}}`,
      formulaNote: "FV = nilai masa depan; PV = 500; C = kontribusi tahunan 60; r = 7 persen; n = 5 tahun. Hasil: 701,28 + 345,04 = 1.046,32. P sukses = persentase jalur Monte Carlo yang mencapai target.",
      reference: "FV Rp1.046,32 juta; surplus Rp46,32 juta; probabilitas sukses ilustratif 87 persen.",
    },
    {
      id: "guardrail-penarikan",
      eyebrow: "Langkah 4 · Teori",
      title: "Guardrail belanja dan urutan penarikan",
      prose: [
        "Aturan 4 persen (Bengen, 1994) berkata: belanjakan 4 persen dari dana di tahun pertama pensiun (Rp40 juta dari Rp1.000 juta), lalu sesuaikan dengan inflasi tiap tahun — dan dana bertahan 30 tahun dalam hampir semua simulasi historis. Tetapi aturan 4 persen kaku: ia tidak menyesuaikan diri saat pasar jatuh 20 persen di tahun ke-2. Aturan guardrail Guyton-Klinger memperbaikinya: belanja awal 5 persen, tetapi bila withdrawal rate melewati 6 persen dari nilai portofolio saat ini (karena portofolio menyusut), belanja DIPOTONG 10 persen; bila withdrawal rate turun di bawah 4 persen (karena portofolio tumbuh), belanja DINAIKKAN 10 persen. Fleksibilitas 10 persen membeli ketahanan puluhan tahun.",
        "Contoh: dana Rp1.000 juta, belanja Rp50 juta (5 persen). Pasar jatuh 20 persen → dana Rp800 juta → withdrawal rate 50/800 = 6,25 persen — melewati guardrail 6 persen → belanja dipotong 10 persen menjadi Rp45 juta. Potongan Rp5 juta terasa — tetapi ia menyelamatkan rencana dari spiral kematian: belanja tetap saat dana menyusut berarti withdrawal rate naik, yang berarti dana menyusut lebih cepat, yang berarti withdrawal rate naik lagi. Guardrail memutus spiral itu sejak awal.",
        "Urutan penarikan menentukan berapa lama dana bertahan — karena pajak. Urutan standar: pertama, akun kena pajak (bunga dan dividen sudah dipajaki tiap tahun — tarik dari sini dulu karena tidak ada penalti); kedua, akun tangguh pajak (dana pensiun — penarikan dipajaki sebagai penghasilan, jadi tarik saat penghasilan sedang rendah); ketiga, akun bebas pajak (Roth — tarik terakhir karena pertumbuhannya bebas pajak selamanya). Urutan yang salah — misalnya menarik dana pensiun saat penghasilan masih tinggi — bisa membuang 5–10 persen dana untuk pajak yang tidak perlu.",
        "Glidepath mengikat semuanya: alokasi ekuitas menurun seiring umur — bukan karena rumus umur, melainkan karena human capital. Di usia 30, human capital (nilai kini penghasilan masa depan) adalah aset terbesar — seperti obligasi yang membayar gaji — sehingga portofolio finansial boleh agresif (90 persen ekuitas). Di usia 60, human capital hampir habis — portofolio finansial harus mengambil alih peran obligasi itu (40 persen ekuitas). Perencana yang mengabaikan human capital sedang mengabaikan aset terbesar kliennya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira aturan 4 persen adalah jaminan. Bengen sendiri menekankan: 4 persen bekerja dalam data historis Amerika 1926–1992 — bukan janji untuk masa depan, bukan untuk negara lain, dan bukan bila return masa depan lebih rendah. Guardrail dan peninjauan tahunan adalah bagian dari aturan, bukan opsional.",
      },
      reference: "Aturan 4 persen: Rp40 juta/tahun dari Rp1.000 juta. Guardrail: potong 10 persen bila withdrawal rate di atas 6 persen; naikkan 10 persen bila di bawah 4 persen.",
    },
    {
      id: "lab-rencana",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin rencana 5 tahun",
      prose: [
        "Lab ini membangun mesin rencana multi-tahun: dari kekayaan awal, kontribusi tahunan, return, dan horizon — hitung nilai masa depan, surplus terhadap target, dan belanja tahunan aturan 4 persen.",
        "Hitung dulu di kepala. (1,07)^5 = 1,402552. Nilai kini bertumbuh: 500 × 1,402552 = 701,28 juta. Kontribusi: 60 × ((1,402552 − 1) / 0,07) = 60 × 5,750739 = 345,04 juta. Total: Rp1.046,32 juta. Surplus: 1.046,32 − 1.000 = Rp46,32 juta. Belanja 4 persen dari target: 1.000 × 0,04 = Rp40 juta per tahun.",
        "Tugas lab: tulis fungsi yang menerima kekayaan awal, kontribusi, return, tahun, dan target — lalu mencetak nilai masa depan (2 desimal), surplus (2 desimal), dan belanja 4 persen. Tiga angka ini adalah ringkasan satu rencana dalam satu baris.",
        "Setelah lolos, coba eksperimen: turunkan return menjadi 4 persen dan lihat nilai masa depan jatuh ke sekitar Rp933 juta — di bawah target. Lalu tanyakan: apa yang kamu ubah dulu — kontribusi, horizon, atau target?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fv` (nilai masa depan: PV bertumbuh + anuitas kontribusi)" },
        { id: "t2", text: "Hitung `surplus` (fv dikurangi target)" },
        { id: "t3", text: "Hitung `belanja` (4 persen dari target)" },
      ],
      expected: "fv=1046.32\nsurplus=46.32\nbelanja=40.0",
      hints: [
        "FV = PV x (1+r)^n + C x (((1+r)^n - 1) / r).",
        "Surplus = fv - target.",
        "Belanja 4 persen = target x 0,04.",
      ],
      code: {
        starter: `# Pak Darma: PV Rp500 jt, kontribusi Rp60 jt/thn, return 7%, 5 tahun, target Rp1.000 jt.\npv = 500.0\nkontribusi = 60.0\nr = 0.07\nn = 5\ntarget = 1000.0\n\n# TULIS KODEMU: hitung fv, surplus, belanja.\n# Cetak, per baris: fv, surplus, belanja.\n\n`,
        lockLines: 6,
        solution: `# Pak Darma: PV Rp500 jt, kontribusi Rp60 jt/thn, return 7%, 5 tahun, target Rp1.000 jt.\npv = 500.0\nkontribusi = 60.0\nr = 0.07\nn = 5\ntarget = 1000.0\n\n\ntumbuh = (1 + r) ** n\nfv = pv * tumbuh + kontribusi * (tumbuh - 1) / r\nsurplus = fv - target\nbelanja = target * 0.04\nprint(f"fv={fv:.2f}")\nprint(f"surplus={surplus:.2f}")\nprint(f"belanja={belanja:.1f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "fv", value: 1046.32, tol: 0.01, label: "Nilai masa depan Rp1.046,32 juta", msg: "701,28 + 345,04 = 1.046,32. Satu jalur — Monte Carlo akan menunjukkan ribuan jalur lain." },
          { kind: "equal", task: "t2", name: "surplus", value: 46.32, tol: 0.01, label: "Surplus Rp46,32 juta", msg: "1.046,32 - 1.000 = 46,32. Surplus di jalur rata-rata — bukan jaminan." },
          { kind: "equal", task: "t3", name: "belanja", value: 40.0, tol: 0.01, label: "Belanja 4 persen Rp40 juta/tahun", msg: "1.000 x 0,04 = 40. Aturan Bengen — dengan guardrail bila pasar jatuh." },
        ],
      },
      reference: "FV Rp1.046,32 juta; surplus Rp46,32 juta; belanja 4 persen Rp40 juta/tahun.",
    },
    {
      id: "dinamis",
      eyebrow: "Langkah 6 · Teori",
      title: "Constraint dinamis: rencana yang hidup",
      prose: [
        "Constraint dalam IPS (PM-C1) terlihat statis — likuiditas, horizon, pajak, legal, unik. Dalam wealth planning multi-tahun, semuanya BERGERAK. Likuiditas: kebutuhan kas naik saat anak masuk kuliah, turun setelahnya. Horizon: memendek 1 tahun setiap tahun — dan memanjang bila pensiun ditunda. Pajak: tarif berubah saat penghasilan turun di pensiun — urutan penarikan harus berubah bersamanya. Rencana yang tidak meninjau constraint tiap tahun adalah rencana yang kedaluwarsa dalam 12 bulan.",
        "Tiga pemicu peninjauan wajib. Life event: menikah, anak lahir, warisan, pensiun, sakit — masing-masing mengubah tujuan, horizon, dan likuiditas sekaligus. Pasar: jatuh 20 persen atau naik 30 persen mengubah probabilitas keberhasilan secara material — hitung ulang Monte Carlo. Regulasi: perubahan tarif pajak atau aturan dana pensiun mengubah urutan penarikan yang optimal. Perencana yang hanya meninjau setahun sekali tanpa pemicu akan menemukan rencana yang sudah rusak berbulan-bulan.",
        "Aturan penutup: rencana kekayaan bukan dokumen — ia proses. IPS adalah titik awal, Monte Carlo adalah peta kemungkinan, guardrail adalah kemudi, dan peninjauan adalah bahan bakar. Klien yang memahami ini tidak panik saat pasar jatuh 20 persen di tahun ke-2: ia tahu probabilitasnya, ia tahu guardrail-nya, dan ia tahu apa yang akan dilakukan — karena semuanya sudah direncanakan sebelum krisis datang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menetapkan rencana sekali lalu melupakannya. Rencana 5 tahun yang tidak ditinjau setelah pasar jatuh 20 persen bukan rencana — ia kenangan. Tinjau tahunan, dan tinjau segera saat life event atau guncangan pasar besar.",
      },
      reference: "Tinjau tahunan + saat life event, guncangan pasar besar, atau perubahan regulasi.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: Pak Darma, tahun ke-2",
      prose: [
        "Tahun ke-2, pasar jatuh 20 persen. Dana Pak Darma tinggal Rp510 juta — jauh di bawah jalur rencana Rp637 juta. Perencana lama akan berkata 'tetap tenang, pasar akan pulih'. Perencana yang memakai lesson ini melakukan tiga hal. Pertama, hitung ulang Monte Carlo: probabilitas keberhasilan turun dari 87 persen menjadi 71 persen — masih di atas ambang 70 persen, tetapi menipis. Kedua, terapkan guardrail: belanja yang direncanakan ditunda — renovasi rumah ditunda 1 tahun, menghemat Rp30 juta yang tetap diinvestasikan. Ketiga, periksa urutan penarikan: tidak ada penarikan — dana masih dalam fase akumulasi — tetapi kontribusi dinaikkan Rp5 juta per tahun dari bonus yang tidak terduga.",
        "Hasilnya: probabilitas kembali ke 83 persen — tanpa panik, tanpa menjual di titik terendah, tanpa mengubah target. Rencana itu bekerja bukan karena pasar pulih (ia pulih 2 tahun kemudian), melainkan karena rencana itu punya aturan untuk saat pasar TIDAK pulih. Itulah beda antara rencana dan harapan: rencana punya cabang untuk masa depan yang buruk; harapan hanya punya satu cabang — yang baik.",
        "Keputusan yang benar bukan 'bertahan' atau 'menyerah' — melainkan menyesuaikan tuas yang ada: kontribusi naik sedikit, belanja ditunda sedikit, horizon diperpanjang 6 bulan. Tiga tuas kecil mengembalikan probabilitas 12 poin. Perencana yang hanya punya satu tuas (menjual atau membeli) bukan perencana — ia penonton.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat respons ini benar. Pertama, probabilitas dihitung ulang — bukan dirasakan. Kedua, guardrail diterapkan sebelum spiral dimulai. Ketiga, tiga tuas kecil dipakai bersamaan — kontribusi, belanja, horizon — bukan satu tuas besar yang menyakitkan.",
      },
      reference: "Probabilitas 87 persen → 71 persen → 83 persen setelah tiga penyesuaian kecil.",
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
        "FV Rp1.046,32 juta; surplus Rp46,32 juta; belanja 4 persen Rp40 juta/tahun.",
        "Monte Carlo: ribuan jalur, probabilitas keberhasilan = jalur yang mencapai target.",
        "Guardrail: potong belanja 10 persen bila withdrawal rate di atas 6 persen.",
        "Urutan penarikan: kena pajak dulu, tangguh pajak kedua, bebas pajak terakhir.",
        "Glidepath mengikuti human capital — agresif saat muda, konservatif saat human capital habis.",
      ],
      next: { label: "C15 — Sustainable Finance Mendalam: Taksonomi, SFDR, dan Skenario Iklim", href: "/v2/learn/pm-c15-sustainable-finance-mendalam" },
      quiz: [
        {
          q: "Pak Darma: PV Rp500 juta, kontribusi Rp60 juta/tahun, return 7 persen, 5 tahun, target Rp1.000 juta. Berapa nilai masa depan dan surplusnya?",
          options: [
            { text: "Rp1.046,32 juta; surplus Rp46,32 juta", why: "Tepat: 500 × 1,4026 = 701,28; 60 × 5,7507 = 345,04; total 1.046,32; surplus 46,32.", correct: true },
            { text: "Rp1.000 juta; surplus Rp0 — target selalu tercapai", why: "Salah: target bukan hasil. Nilai masa depan dihitung dari PV, kontribusi, dan return — hasilnya 1.046,32." },
            { text: "Rp800 juta; defisit Rp200 juta — kontribusi tidak dihitung", why: "Salah: kontribusi 60 juta × 5 tahun dengan pertumbuhan = 345,04 juta. Mengabaikannya menghilangkan sepertiga dana." },
            { text: "Rp1.350 juta; surplus Rp350 juta — return dihitung 7 persen per tahun tanpa bunga berbunga", why: "Salah: bunga berbunga sudah termasuk dalam (1,07)^5. Angka 1.350 berasal dari hitungan yang salah." },
          ],
        },
        {
          q: "Monte Carlo memberi probabilitas keberhasilan 65 persen. Apa respons perencana yang benar?",
          options: [
            { text: "Tidak ada — 65 persen sudah cukup tinggi", why: "Salah: ambang praktis 80–90 persen. 65 persen berarti gagal dalam 1 dari 3 masa depan — terlalu berisiko." },
            { text: "Ubah rencana: tambah kontribusi, tunda pensiun, atau turunkan target sampai probabilitas 80–90 persen", why: "Tepat: probabilitas adalah bahan keputusan. Tiga tuas — kontribusi, horizon, target — menaikkannya.", correct: true },
            { text: "Naikkan asumsi return menjadi 10 persen agar probabilitas naik", why: "Salah: mengubah asumsi untuk mempercantik hasil adalah kebohongan pada diri sendiri. Probabilitas harus dihitung dari asumsi yang jujur." },
            { text: "Pindahkan semua dana ke saham — return lebih tinggi berarti probabilitas lebih tinggi", why: "Salah: return lebih tinggi datang dengan volatilitas lebih tinggi — probabilitas keberhasilan bisa TURUN karena sebaran melebar." },
          ],
        },
        {
          q: "Dana Rp1.000 juta, belanja Rp50 juta (5 persen). Pasar jatuh 20 persen → dana Rp800 juta. Apa yang diperintahkan guardrail Guyton-Klinger?",
          options: [
            { text: "Naikkan belanja menjadi Rp55 juta — dana masih cukup", why: "Salah: withdrawal rate kini 50/800 = 6,25 persen — di atas guardrail 6 persen. Belanja harus DIPOTONG, bukan dinaikkan." },
            { text: "Potong belanja 10 persen menjadi Rp45 juta", why: "Tepat: withdrawal rate 6,25 persen melewati guardrail 6 persen → potong 10 persen. Ini memutus spiral kematian dana.", correct: true },
            { text: "Tetap belanja Rp50 juta — aturan 4 persen tidak mengenal guardrail", why: "Salah: aturan 4 persen memang kaku — itulah kelemahannya. Guardrail adalah perbaikan atas kekakuan itu." },
            { text: "Hentikan belanja seluruhnya sampai pasar pulih", why: "Salah: terlalu ekstrem. Guardrail memotong 10 persen, bukan 100 persen — klien tetap perlu hidup." },
          ],
        },
        {
          q: "Urutan penarikan yang benar di pensiun adalah:",
          options: [
            { text: "Bebas pajak dulu, tangguh pajak kedua, kena pajak terakhir", why: "Salah: terbalik. Akun bebas pajak (Roth) ditarik TERAKHIR karena pertumbuhannya bebas pajak selamanya." },
            { text: "Kena pajak dulu, tangguh pajak kedua, bebas pajak terakhir", why: "Tepat: kena pajak tidak ada penalti; tangguh pajak ditarik saat penghasilan rendah; bebas pajak dibiarkan tumbuh paling lama.", correct: true },
            { text: "Tangguh pajak dulu — semakin cepat semakin baik", why: "Salah: menarik dana pensiun saat penghasilan masih tinggi berarti membayar pajak tarif tertinggi. Tunggu sampai penghasilan turun." },
            { text: "Urutannya tidak penting — total pajaknya sama", why: "Salah: urutan yang salah bisa membuang 5–10 persen dana untuk pajak yang tidak perlu." },
          ],
        },
        {
          q: "Kenapa alokasi ekuitas menurun seiring umur menurut logika human capital?",
          options: [
            { text: "Karena orang tua tidak suka saham", why: "Salah: bukan soal selera. Ini soal aset: human capital muda seperti obligasi — saat ia habis, portofolio harus mengambil alih perannya." },
            { text: "Karena human capital muda adalah aset seperti obligasi (gaji masa depan); saat ia habis, portofolio finansial harus menjadi obligasi itu", why: "Tepat: total kekayaan = human capital + finansial. Saat human capital menyusut, finansial harus lebih konservatif agar total risiko tetap.", correct: true },
            { text: "Karena aturan umur 100 dikurangi umur adalah hukum", why: "Salah: itu heuristik, bukan hukum. Logika di baliknya adalah human capital — dan heuristik bisa salah bila human capital-nya tidak standar." },
            { text: "Karena return saham turun seiring umur investor", why: "Salah: return saham tidak bergantung pada umur investor. Yang berubah adalah KEBUTUHAN investor, bukan return pasar." },
          ],
        },
      ],
    },
  ],
};
