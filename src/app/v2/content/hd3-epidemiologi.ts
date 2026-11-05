import type { V2Lesson } from "../lib/types";

export const hd3: V2Lesson = {
  slug: "hd3-epidemiologi",
  track: "Health Data Science",
  module: "Epidemiologi & Uji Klinis",
  title: "HD3 Insidens, Prevalensi, RR: Bahasa Angka Epidemiologi",
  estMinutes: 55,
  steps: [
    {
      id: "desa-a-b",
      eyebrow: "Langkah 1 · Insidens vs prevalensi",
      title: "Desa A vs Desa B: satu kata yang tertukar",
      prose: [
        "Dua desa, masing-masing 1.000 penduduk. Desa A melaporkan 50 kasus TB tahun ini, Desa B 30 kasus. Kepala dinas menyimpulkan: “Desa A dua kali lebih parah, kirim tim ke sana!” Tapi data mentahnya: di Desa A, 40 dari 50 kasus adalah kasus lama yang masih berobat (prevalensi), kasus baru hanya 10. Di Desa B, 25 dari 30 adalah kasus baru (insidens). Penularan aktif justru lebih panas di Desa B.",
        "Insidens = kasus baru per populasi berisiko per periode (mengukur kecepatan). Prevalensi = seluruh kasus (baru + lama) per populasi pada satu titik waktu (mengukur beban). Insidens itu speedometer; prevalensi itu foto tangki bensin. Kamu tidak menilai kecepatan mobil dari foto tangki.",
        "Contoh hitung: populasi balita 2.000, survei menemukan 400 stunting (200 lama, 200 baru tahun ini). Prevalensi = 400/2.000 = 20% (beban saat ini). Untuk insidens, populasi berisiko = 2.000 − 200 = 1.800 (yang sudah stunting dikeluarkan dari pembagi!). Insidens = 200/1.800 = 11,1% per tahun (kecepatan kasus baru).",
      ],
      formula: String.raw`\text{insidens} = \frac{\text{kasus baru}}{\text{populasi berisiko}} \qquad \text{prevalensi} = \frac{\text{kasus baru + lama}}{\text{populasi}}`,
      formulaNote: "kasus baru = yang pertama kali sakit dalam periode; populasi berisiko = populasi dikurangi yang sudah sakit (mereka tidak “berisiko menjadi sakit” lagi); prevalensi memakai seluruh populasi sebagai pembagi. Contoh: 200 kasus baru dari 1.800 berisiko → insidens 11,1%/tahun; 400 total kasus dari 2.000 populasi → prevalensi 20%. Interpretasi: insidens menjawab “seberapa cepat orang menjadi sakit”, prevalensi menjawab “berapa banyak yang sakit sekarang”.",
      tasks: [
        { id: "t1", text: "Hitung `prevalensi` (desimal) dari data stunting" },
        { id: "t2", text: "Hitung `insidens` (desimal); ingat keluarkan yang sudah sakit dari pembagi" },
      ],
      expected: "prevalensi=0.200  insidens=0.1111",
      note: {
        title: "Sering salah",
        body: "Memakai seluruh populasi sebagai pembagi insidens. Yang sudah sakit tidak “berisiko menjadi sakit” — keluarkan mereka dari pembagi, atau insidensmu kekecilan.",
        type: "pitfall",
      },
      hints: [
        "Prevalensi memakai semua kasus dibagi seluruh populasi.",
        "Pembagi insidens = populasi − kasus lama.",
        "prevalensi = 400/2000\ninsidens = 200/(2000-200)",
      ],
      code: {
        starter: `populasi = 2000\nstunting_total = 400   # baru + lama\nstunting_baru = 200\nstunting_lama = 200\n\n# TULIS KODEMU: prevalensi dan insidens dalam desimal\nprevalensi = \ninsidens = \n\nprint(f"prevalensi={prevalensi:.3f}  insidens={insidens:.4f}")`,
        lockLines: 4,
        solution: `populasi = 2000\nstunting_total = 400   # baru + lama\nstunting_baru = 200\nstunting_lama = 200\n\n# TULIS KODEMU: prevalensi dan insidens dalam desimal\nprevalensi = stunting_total / populasi\ninsidens = stunting_baru / (populasi - stunting_lama)\n\nprint(f"prevalensi={prevalensi:.3f}  insidens={insidens:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "prevalensi", value: 0.2, tol: 1e-9, label: "`prevalensi` seharusnya 0.2", msg: "400 kasus dari 2.000 populasi = 0,20. Cek pembilang dan penyebutnya." },
          { kind: "equal", task: "t2", name: "insidens", value: 0.1111, tol: 1e-4, label: "`insidens` sekitar 0.1111", msg: "200 kasus baru dibagi (2.000 − 200) populasi berisiko. Jangan lupa kurangi kasus lama." },
          { kind: "stdout_matches", task: "t2", pattern: "prevalensi=0\\.200\\s+insidens=0\\.1111", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Insidens → kecepatan; prevalensi → beban. Pembagi insidens mengeluarkan yang sudah sakit.",
    },
    {
      id: "rr-or-nnt",
      eyebrow: "Langkah 2 · RR, OR, NNT",
      title: "RR jujur, OR licin, NNT penerjemah",
      prose: [
        "Tabel 2×2: perokok sakit 40 (a), perokok sehat 160 (b); bukan perokok sakit 10 (c), bukan perokok sehat 190 (d). Risiko perokok = 40/200 = 0,20; risiko bukan perokok = 10/200 = 0,05. RR = 0,20/0,05 = 4,0 (risiko 4x lipat). OR = (40×190)/(160×10) = 4,75. RR itu jujur dan intuitif; OR itu akuntan yang licin — ia muncul dari matematika regresi logistik lalu disalahartikan sebagai RR.",
        "OR boleh dibaca sebagai “risiko X kali lipat” hanya jika penyakitnya jarang (<10%). Pada penyakit umum (mis. 30%), OR bisa jauh lebih besar dari RR — melaporkan OR sebagai risiko adalah pembesar-besaran. Aturan desain: kohort/RCT → RR (risiko terhitung langsung); case-control → OR (hanya OR yang valid); data waktu-kejadian → HR.",
        "Jebakan brosur obat: “Menurunkan risiko 50%!” terdengar hebat — tapi jika risiko awal 2% menjadi 1%, penurunan absolutnya hanya 1 poin persen. ARR = selisih risiko absolut; NNT = 1/ARR. Obat dengan ARR 0,01 punya NNT 100: obati 100 pasien agar 1 terbantu. NNT menerjemahkan bahasa relatif ilmuwan menjadi bahasa absolut bendahara.",
      ],
      formula: String.raw`RR = \frac{a/(a+b)}{c/(c+d)} \qquad OR = \frac{a \times d}{b \times c} \qquad NNT = \frac{1}{ARR}`,
      formulaNote: "a = sakit & terpapar; b = sehat & terpapar; c = sakit & tak terpapar; d = sehat & tak terpapar; ARR = selisih risiko absolut = |a/(a+b) − c/(c+d)|. Contoh: a=40,b=160,c=10,d=190 → RR = (40/200)/(10/200) = 4,0; OR = (40×190)/(160×10) = 4,75; ARR = 0,15 → NNT = 6,67. Interpretasi: RR/OR menjawab “berapa kali lipat”, NNT menjawab “berapa pasien diobati agar satu terbantu” — bahasa keputusan.",
      tasks: [
        { id: "t1", text: "Hitung `RR` dari tabel 2×2 merokok-TB" },
        { id: "t2", text: "Hitung `OR` dari tabel yang sama" },
        { id: "t3", text: "Hitung `NNT` (1/ARR)" },
      ],
      expected: "RR=4.0  OR=4.75  NNT=6.67",
      note: {
        title: "Sering salah",
        body: "Membaca OR sebagai “risiko X kali lipat” pada penyakit umum. OR 4,75 di contoh ini dekat dengan RR 4,0 hanya karena TB jarang di sampel — pada penyakit umum keduanya bisa berbeda jauh.",
        type: "pitfall",
      },
      hints: [
        "Risiko tiap kelompok = kasus / total kelompok itu.",
        "OR memakai perkalian silang: (a×d)/(b×c).",
        "RR = (40/200)/(10/200)\nOR = (40*190)/(160*10)\nNNT = 1/((40/200)-(10/200))",
      ],
      code: {
        starter: `a, b, c, d = 40, 160, 10, 190  # a=sakit terpapar, b=sehat terpapar, c=sakit tak terpapar, d=sehat tak terpapar\n\n# TULIS KODEMU: RR, OR, dan NNT\nRR = \nOR = \nNNT = \n\nprint(f"RR={RR:.2f}  OR={OR:.2f}  NNT={NNT:.2f}")`,
        lockLines: 1,
        solution: `a, b, c, d = 40, 160, 10, 190  # a=sakit terpapar, b=sehat terpapar, c=sakit tak terpapar, d=sehat tak terpapar\n\n# TULIS KODEMU: RR, OR, dan NNT\nr1 = a/(a+b); r0 = c/(c+d)\nRR = r1/r0\nOR = (a*d)/(b*c)\nNNT = 1/abs(r1-r0)\n\nprint(f"RR={RR:.2f}  OR={OR:.2f}  NNT={NNT:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "RR", value: 4.0, tol: 1e-9, label: "`RR` seharusnya 4.0", msg: "(40/200)/(10/200) = 0,20/0,05. Cek risiko tiap kelompok." },
          { kind: "equal", task: "t2", name: "OR", value: 4.75, tol: 1e-9, label: "`OR` seharusnya 4.75", msg: "(40×190)/(160×10) = 4,75. Ini perkalian silang, bukan rasio risiko." },
          { kind: "equal", task: "t3", name: "NNT", value: 6.6667, tol: 0.01, label: "`NNT` sekitar 6.67", msg: "ARR = 0,20 − 0,05 = 0,15; NNT = 1/0,15." },
          { kind: "stdout_matches", task: "t3", pattern: "RR=4\\.00\\s+OR=4\\.75\\s+NNT=6\\.67", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Dalam tabel 2×2 di atas (a=40,b=160,c=10,d=190), RR adalah…",
          options: [
            { text: "4,0", why: "Benar: RR = (40/200)/(10/200) = 0,20/0,05 = 4,0.", correct: true },
            { text: "4,75", why: "Itu OR = (40×190)/(160×10) — jangan tertukar dengan RR." },
            { text: "0,25", why: "Itu kebalikan RR (risiko bukan-perokok dibagi perokok) — bukan yang ditanya." },
            { text: "2,0", why: "Tidak ada dasarnya dari tabel ini." },
          ],
        },
      ],
      reference: "Kohort → RR; case-control → OR; survival → HR. OR ≈ RR hanya bila penyakit jarang.",
    },
    {
      id: "standardisasi",
      eyebrow: "Langkah 3 · Standardisasi",
      title: "Wasit yang adil antar populasi",
      prose: [
        "Dua kabupaten: A (penduduk tua) angka kematian kasar 20,0 per 1.000; B (penduduk muda) 12,0 per 1.000. A terlihat lebih buruk — tapi penduduknya memang lebih tua. Membandingkan angka kasar tanpa standardisasi umur seperti membandingkan kecepatan dua mobil di mana satu jalan di tol dan satu di jalan tanah.",
        "Standardisasi umur memaksa kedua populasi “berlomba di trek yang sama” (struktur umur referensi). Setelah disetarakan dengan populasi standar, A = 15,6 dan B = 16,3 per 1.000 — ternyata B sedikit lebih buruk. Peringkatnya berbalik.",
        "Aturan praktis: selalu curigai perbandingan antar wilayah atau antar waktu yang tidak menyebut standardisasi. Sembilan dari sepuluh “peringkat provinsi” di media tidak melakukannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung angka kematian kasar `kasar_A` dan `kasar_B` per 1.000" },
        { id: "t2", text: "Hitung angka terstandardisasi `std_A` dan `std_B` per 1.000" },
      ],
      expected: "kasar: A=20.0 B=12.0 | standar: A=15.6 B=16.3",
      note: {
        title: "Sering salah",
        body: "Langsung menyimpulkan layanan kesehatan A lebih buruk dari angka kasar. Daerah berpenduduk tua otomatis angka kasarnya lebih tinggi — tanpa standardisasi kamu menghukum daerah tua dan memuji daerah muda secara tidak adil.",
        type: "pitfall",
      },
      hints: [
        "Angka kasar = total kematian / total populasi × 1000.",
        "Standardisasi = jumlah (rate tiap kelompok umur × populasi standar kelompok itu) / total standar × 1000.",
        "kasar_A = (20+180)/(8000+2000)*1000\nstd_A = (20/8000*8500 + 180/2000*1500)/(8500+1500)*1000",
      ],
      code: {
        starter: `# kematian per kelompok umur: (kasus, populasi)\nA = {'muda': (20, 8000), 'tua': (180, 2000)}\nB = {'muda': (30, 9000), 'tua': (90, 1000)}\nstd_pop = {'muda': 8500, 'tua': 1500}  # populasi standar\n\n# TULIS KODEMU: angka kasar dan terstandardisasi per 1000\nkasar_A = \nkasar_B = \nstd_A = \nstd_B = \n\nprint(f"kasar: A={kasar_A:.1f} B={kasar_B:.1f}")\nprint(f"standar: A={std_A:.1f} B={std_B:.1f}")`,
        lockLines: 4,
        solution: `# kematian per kelompok umur: (kasus, populasi)\nA = {'muda': (20, 8000), 'tua': (180, 2000)}\nB = {'muda': (30, 9000), 'tua': (90, 1000)}\nstd_pop = {'muda': 8500, 'tua': 1500}  # populasi standar\n\n# TULIS KODEMU: angka kasar dan terstandardisasi per 1000\nkasar_A = (A['muda'][0]+A['tua'][0])/(A['muda'][1]+A['tua'][1])*1000\nkasar_B = (B['muda'][0]+B['tua'][0])/(B['muda'][1]+B['tua'][1])*1000\nstd_A = (A['muda'][0]/A['muda'][1]*std_pop['muda'] + A['tua'][0]/A['tua'][1]*std_pop['tua'])/sum(std_pop.values())*1000\nstd_B = (B['muda'][0]/B['muda'][1]*std_pop['muda'] + B['tua'][0]/B['tua'][1]*std_pop['tua'])/sum(std_pop.values())*1000\n\nprint(f"kasar: A={kasar_A:.1f} B={kasar_B:.1f}")\nprint(f"standar: A={std_A:.1f} B={std_B:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kasar_A", value: 20.0, tol: 1e-9, label: "`kasar_A` seharusnya 20.0", msg: "(20+180)/(8000+2000)×1000 = 20,0." },
          { kind: "equal", task: "t1", name: "kasar_B", value: 12.0, tol: 1e-9, label: "`kasar_B` seharusnya 12.0", msg: "(30+90)/(9000+1000)×1000 = 12,0." },
          { kind: "equal", task: "t2", name: "std_A", value: 15.625, tol: 0.01, label: "`std_A` sekitar 15.6", msg: "Bobot tiap rate umur dengan populasi standar, bukan populasi asli." },
          { kind: "equal", task: "t2", name: "std_B", value: 16.333, tol: 0.01, label: "`std_B` sekitar 16.3", msg: "Bobot tiap rate umur dengan populasi standar, bukan populasi asli." },
        ],
      },
      reference: "Standardisasi = trek yang sama untuk semua populasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: angka apa untuk pertanyaan apa",
      prose: [
        "Lima situasi keputusan yang dihadapi epidemiolog dan analis Dinkes setiap minggu — dengan angka yang tepat untuk tiap pertanyaan:",
        "Skenario 1 — “Wabahnya meluas atau tidak?” (kecepatan penularan saat ini). → Insidens kasus baru per populasi berisiko. Contoh: Desa B dengan 25 kasus baru dari 975 berisiko lebih panas daripada Desa A dengan 50 kasus yang 40-nya kasus lama — tim dikirim ke B, bukan A.",
        "Skenario 2 — “Berapa bed, staf, dan obat yang harus disiapkan?” (beban layanan). → Prevalensi. Contoh: stunting 20% dari 2.000 balita = 400 anak yang butuh layanan gizi sekarang — angka kecepatan tidak menjawab pertanyaan logistik.",
        "Skenario 3 — “Seberapa besar efek paparan atau obat ini?” (klaim efikasi). → RR bila datanya kohort/RCT, OR bila case-control — dan SELALU lengkapi dengan ARR + NNT sebelum ke meja keputusan. Contoh: statin NNT = 50 berarti 49 dari 50 pasien tidak merasakan bedanya dalam 5 tahun.",
        "Skenario 4 — “Bandingkan dua wilayah dengan struktur umur berbeda.” → Angka terstandardisasi: langsung bila angka per kelompok umur tersedia, tak langsung (SMR) bila tidak. Contoh: SMR 1,5 di wilayah kecil tanpa interval ketidakpastian adalah jebakan — satu kasus bisa membalik kesimpulan.",
        "Skenario 5 — “Apakah program skrining ini berhasil?” → Bandingkan MORTALITAS antar kelompok, bukan survival sejak diagnosis. Contoh: lead-time dan length bias membuat program skrining yang tak berguna terlihat heroik.",
        "Aturan praktis 10 detik: tanya berurutan — “kecepatan atau beban?” (insidens untuk yang bergerak, prevalensi untuk yang harus dilayani) → “relatif atau absolut?” (RR/OR untuk ilmu, NNT untuk keputusan) → “apples-to-apples?” (standardisasi sebelum membandingkan wilayah) → “mortalitas atau survival sejak diagnosis?” (untuk evaluasi skrining).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengirim tim ke Desa A karena prevalensinya tinggi padahal penularan aktif ada di Desa B; membaca OR 4,75 sebagai “risiko 4,75 kali lipat” pada penyakit umum; atau menilai program skrining dari survival sejak diagnosis. Tiga kesalahan ini semuanya berasal dari satu sumber: memakai angka yang menjawab pertanyaan yang berbeda.",
        type: "pitfall",
      },
      reference: "Kecepatan → insidens; beban → prevalensi; efek → RR/OR + NNT; bandingkan → standardisasi; skrining → mortalitas.",
    },
    {
      id: "keputusan-nnt",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Dari “50% lebih baik” ke NNT",
      prose: [
        "Brosur statin: “Menurunkan risiko serangan jantung 50%!” Data trial 5 tahun (n=10.000): kelompok statin 100 serangan dari 5.000 (2%), plasebo 200 dari 5.000 (4%). Verifikasi klaim relatif: RR = 2%/4% = 0,50 → penurunan relatif 50%. Klaimnya benar secara matematis.",
        "Hitung absolutnya (yang disembunyikan): ARR = 4% − 2% = 2 poin persen. NNT = 1/0,02 = 50. Dari 100 orang minum statin 5 tahun, 2 terhindar dari serangan jantung; 98 lainnya tidak ada bedanya. Efek samping serius (mis. diabetes baru): statin 3% vs plasebo 2% → NNH = 100. Tiap 100 orang diobati: 2 serangan dicegah, 1 diabetes baru muncul.",
        "Konteks risiko awal menentukan segalanya: NNT=50 ini untuk populasi risiko sedang-tinggi. Untuk populasi risiko rendah (risiko awal 1%), ARR = 0,5% → NNT = 200. Sajikan ke pasien sebagai shared decision making: “Dari 50 orang seperti Bapak yang minum statin 5 tahun, 1 terhindar dari serangan jantung; 49 tidak merasakan bedanya.” Setiap kali melihat persen relatif tanpa absolut, hitung sendiri NNT-nya — butuh 60 detik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Analis Dinkes yang hanya membaca klaim relatif 50% akan meloloskan obat Rp500 ribu/bulan ke formularium untuk populasi umum — padahal biaya per kejadian dicegah bisa Rp1,5 miliar. Selalu lengkapi pasangan angka absolut sebelum meneruskan klaim.",
        type: "risk",
      },
      reference: "RR menjawab “berapa kali lipat”, selisih risiko menjawab “berapa nyawa”.",
    },
    {
      id: "steady-state",
      eyebrow: "Langkah 6 · Stok vs aliran",
      title: "Prevalensi = insidens × durasi (dan dua bias skrining)",
      prose: [
        "Ada hubungan tersembunyi antara insidens dan prevalensi yang jarang diajarkan eksplisit: dalam keadaan tunak (steady state) — insidens dan durasi penyakit stabil — prevalensi ≈ insidens × durasi rata-rata. Intuisinya: prevalensi adalah “antrean” — panjang antrean = laju kedatangan × lama mengantre. Diabetes: insidens 1% per tahun × durasi 20 tahun → prevalensi ≈ 20%. Flu: insidens 10% per tahun × durasi 0,02 tahun (satu minggu) → prevalensi ≈ 0,2%. Dua penyakit dengan insidens mirip bisa punya prevalensi beda 100× lipat — dan intervensi yang memanjangkan hidup penderita (obat yang bagus!) justru MENAIKKAN prevalensi. Prevalensi naik bukan selalu kabar buruk.",
        "Standardisasi punya dua arah. Standardisasi LANGSUNG (yang dipakai di langkah 3): terapkan angka tiap kelompok umur ke populasi standar — butuh angka per kelompok umur di tiap wilayah. Standardisasi TAK LANGSUNG: kebalikannya — terapkan angka ACUAN ke struktur umur wilayah untuk mendapatkan kasus ekspektasi E, lalu hitung SMR = observasi / ekspektasi. Dipakai bila angka per kelompok umur di wilayah kecil tidak stabil (hanya total kasus yang diketahui). SMR = 1,5 berarti 50% di atas ekspektasi — tetapi SMR wilayah kecil tanpa ukuran ketidakpastian adalah jebakan: satu kasus bisa mengubah kesimpulan total.",
        "Evaluasi program skrining menambah dua bias klasik yang wajib dikenal. Lead-time bias: skrining menemukan penyakit lebih awal → survival “sejak diagnosis” terlihat lebih panjang, padahal kematian terjadi di waktu yang sama — jamnya dimajukan, bukan hidupnya dipanjangkan. Length bias: skrining cenderung menjaring kasus yang lambat (yang bertahan lama di fase preklinis) — kasus agresif keburu bergejala di antara jadwal skrining. Keduanya membuat program skrining terlihat manjur tanpa benar-benar menyelamatkan nyawa. Evaluasi yang benar: bandingkan MORTALITAS antar kelompok (bukan survival sejak diagnosis), idealnya lewat uji klinis skrining yang dirandomisasi.",
      ],
      formula: String.raw`P \approx I \times \bar{D}`,
      formulaNote: "P = prevalensi (proporsi); I = insidens (kasus baru per orang-tahun); D̄ = durasi rata-rata penyakit dalam tahun; ≈ karena hanya eksak dalam steady state. Contoh: I = 1%/tahun, D̄ = 20 tahun → P ≈ 20%. Interpretasi: prevalensi mengukur 'stok', insidens mengukur 'aliran' — obat yang memanjangkan hidup menaikkan stok tanpa menambah aliran, sehingga prevalensi naik justru bisa menjadi kabar baik.",
      tasks: [],
      note: {
        title: "Intuisi: kecepatan, beban, dan jam yang dimajukan",
        body: "Epidemiolog yang berpengalaman membaca setiap angka penyakit dengan tiga pertanyaan cepat. Pertama: ini kecepatan atau beban? — insidens untuk menilai penularan yang sedang berjalan (Desa B lebih panas), prevalensi untuk merencanakan layanan (berapa bed yang dibutuhkan). Tertukar keduanya berarti mengirim tim ke tempat yang salah. Kedua: siapa pembaginya? — insidens yang memakai seluruh populasi (bukan populasi berisiko) selalu kekecilan; angka kematian yang tidak distandardisasi umur menghukum daerah tua. Ketiga: relatif terhadap apa, dan berapa absolutnya? — “risiko turun 50%” tanpa NNT adalah brosur, bukan informasi; selalu hitung 1/ARR sebelum meneruskan klaim. Dan untuk program skrining, tambah pertanyaan keempat: apakah yang diukur mortalitas atau survival sejak diagnosis? — karena lead-time dan length bias membuat skrining yang tidak berguna terlihat heroik. Kelima, untuk perbandingan antar waktu, pastikan definisi kasusnya tidak berubah — “kenaikan kasus” setelah perluasan definisi skrining adalah artefak administratif, bukan wabah; selalu tanyakan apakah yang berubah adalah penyakitnya atau cara menghitungnya. Empat pertanyaan ini — kecepatan/beban, pembagi, absolut, dan mortalitas — adalah kompas yang menjagamu tetap jujur di antara lautan angka kesehatan.",
      },
      reference: "P ≈ I × D̄ (steady state). Standardisasi tak langsung → SMR. Evaluasi skrining: mortalitas, bukan survival sejak diagnosis.",
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
        "Insidens = kecepatan kasus baru; prevalensi = beban total saat ini.",
        "RR untuk kohort/RCT; OR untuk case-control; HR untuk data waktu-kejadian. OR ≈ RR hanya bila penyakit jarang.",
        "ARR & NNT menerjemahkan klaim relatif ke bahasa keputusan.",
        "Bandingkan populasi dengan standardisasi (umur) agar adil.",
        "Selalu tanya angka absolut di balik persen relatif.",
        "P ≈ I × D̄: prevalensi naik bisa berarti obatnya bagus (stok), bukan penularan naik (aliran); evaluasi skrining pakai mortalitas — waspadai lead-time & length bias.",
      ],
      next: { label: "HD4 — Kohort vs Case-Control", href: "/learn/hd4-desain-studi" },
      quiz: [
        {
          q: "Insidens mengukur…",
          options: [
            { text: "Kecepatan munculnya kasus baru per populasi berisiko", why: "Benar: insidens = kasus baru / populasi berisiko / periode. Untuk beban saat ini pakai prevalensi.", correct: true },
            { text: "Total beban penyakit saat ini", why: "Itu prevalensi, bukan insidens." },
            { text: "Jumlah kematian", why: "Kematian adalah outcome lain; insidens mengukur kasus baru." },
            { text: "Efektivitas obat", why: "Efektivitas diukur dari perbandingan risiko antar kelompok, bukan insidens saja." },
          ],
        },
        {
          q: "OR boleh dibaca sebagai “risiko X kali lipat” ketika…",
          options: [
            { text: "Penyakitnya jarang (<10%)", why: "Benar: hanya saat jarang OR ≈ RR. Pada penyakit umum OR melebih-lebihkan.", correct: true },
            { text: "Selalu boleh", why: "Salah: pada penyakit umum (mis. hipertensi 30%) OR bisa jauh lebih besar dari RR." },
            { text: "Sampelnya besar", why: "Ukuran sampel tidak mengubah hubungan matematis OR vs RR." },
            { text: "Tidak pernah boleh", why: "Terlalu keras: saat penyakit jarang, keduanya memang hampir sama." },
          ],
        },
        {
          q: "Risiko kontrol 4%, obat 3%. NNT adalah…",
          options: [
            { text: "100", why: "Benar: ARR = 0,01 → NNT = 100. Klaim relatif “25%” vs realita “100 diobati untuk 1 terbantu”.", correct: true },
            { text: "25", why: "Itu 1/0,04 — memakai risiko kontrol saja, bukan selisihnya." },
            { text: "33", why: "Tidak ada dasarnya dari angka ini." },
            { text: "75", why: "Mungkin dari 3/4 — NNT memakai selisih absolut, bukan rasio." },
          ],
        },
        {
          q: "Dua kabupaten dibandingkan angka kematian kasarnya. Kabupaten A (penduduk tua) lebih tinggi. Langkah benar?",
          options: [
            { text: "Hitung angka terstandardisasi umur dulu", why: "Benar: struktur umur mengacaukan perbandingan kasar. Standardisasi = wasit yang adil.", correct: true },
            { text: "Langsung simpulkan layanan A lebih buruk", why: "Itu menghukum daerah tua secara tidak adil — perbedaan umur, bukan layanan." },
            { text: "Pakai prevalensi saja", why: "Prevalensi mengukur beban penyakit, bukan membandingkan mortalitas antar populasi." },
            { text: "Abaikan perbedaan umur", why: "Justru perbedaan umur itulah confounder yang harus dikoreksi." },
          ],
        },
        {
          q: "Studi case-control meneliti rokok dan kanker paru. Ukuran asosiasi yang valid?",
          options: [
            { text: "OR", why: "Benar: case-control sampling berbasis outcome — risiko tak terhitung, hanya OR yang valid. Untuk penyakit jarang, OR ≈ RR.", correct: true },
            { text: "RR", why: "RR butuh risiko absolut yang hanya bisa dihitung bila sampling berbasis paparan (kohort)." },
            { text: "HR", why: "HR untuk data waktu-kejadian dengan sensor, bukan case-control biasa." },
            { text: "NNT", why: "NNT butuh risiko absolut dari desain kohort/RCT, bukan case-control." },
          ],
        },
      ],
    },
  ],
};
