import type { V2Lesson } from "../lib/types";

export const hd5: V2Lesson = {
  slug: "hd5-uji-klinis",
  track: "Health Data Science",
  module: "Epidemiologi & Uji Klinis",
  title: "HD5 RCT, ITT & Non-Inferiority: Statistik di Balik Uji Klinis",
  estMinutes: 55,
  steps: [
    {
      id: "obat-menang-curang",
      eyebrow: "Langkah 1 · ITT vs per-protocol",
      title: "Obat yang “menang” karena curang",
      prose: [
        "Uji klinis obat diabetes baru vs standar. Hasil: obat baru “menang” — gula darah turun lebih banyak. Sponsor merayakan. Lalu statistikawan independen membuka data: 30% peserta kelompok obat baru drop-out (mual hebat), dan analisis hanya memakai yang bertahan (per-protocol). Yang tidak tahan obat — kemungkinan yang paling sakit — hilang dari hitungan.",
        "Analisis ITT (intention-to-treat: semua peserta dihitung sesuai kelompok awalnya) menunjukkan hasil tidak berbeda. Kemenangan itu artefak seleksi, bukan efikasi. Angka konkretnya: per-protocol (70 vs 100) mengklaim selisih keberhasilan 35 poin; ITT (100 vs 100, drop-out dihitung gagal) menyusutkannya jadi 8 poin yang tidak signifikan.",
        "ITT vs per-protocol bukan perdebatan teknis — ia pertanyaan moral tentang siapa yang berhak dihitung. ITT mengukur efek kebijakan meresepkan di dunia nyata (efektivitas); ia konservatif dan anti-curang, itulah yang dipakai regulator (BPOM/FDA) sebagai analisis primer. Per-protocol hanya analisis pendukung untuk mekanisme biologis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira analisis per-protocol lebih “murni” karena hanya memakai yang patuh. Justru sebaliknya: membuang yang drop-out merusak randomisasi — yang bertahan bukan sampel acak lagi, melainkan subkelompok terseleksi yang biasanya lebih sehat. “Kemurnian” ini adalah seleksi berkedok metodologi.",
        type: "pitfall",
      },
      reference: "Analisis primer harus ITT. Drop-out beda antar kelompok = lampu merah.",
    },
    {
      id: "lab-randomisasi",
      eyebrow: "Langkah 2 · Lab simulasi",
      title: "Randomisasi menyeimbangkan yang tak terlihat",
      prose: [
        "Simulasikan 1.000 pasien dengan faktor risiko tak terukur (genetik). Acak ke dua kelompok, lalu bandingkan rata-rata faktor itu. Kemudian bandingkan dengan skenario tanpa randomisasi: dokter memberi obat baru ke yang lebih sehat.",
        "Seed tetap (random.seed(11)) agar hasilnya reproduksibel. Perhatikan selisih rata-rata faktor tak terukur: mendekati nol dengan randomisasi, besar tanpa randomisasi — di situlah confounding lahir.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih_acak` = |mean(A) − mean(B)| setelah randomisasi" },
        { id: "t2", text: "Hitung `selisih_bias` = |mean(A2) − mean(B2)| tanpa randomisasi" },
      ],
      expected: "selisih_acak=0.051  selisih_bias=1.608",
      note: {
        title: "Sering salah",
        body: "Mengira keajaiban randomisasi adalah “keadilan moral” (semua dapat perlakuan sama). Bukan — ia keseimbangan statistik: menyebar semua faktor, termasuk yang belum ditemukan sains, secara acak ke dua kelompok.",
        type: "pitfall",
      },
      hints: [
        "Gunakan statistics.mean pada tiap kelompok.",
        "Selisih = nilai absolut dari pengurangan dua mean: abs().",
        "selisih_acak = abs(st.mean(A) - st.mean(B))",
      ],
      code: {
        starter: `import random, statistics as st\nrandom.seed(11)\nn = 1000\ngenetik = [random.gauss(0, 1) for _ in range(n)]  # faktor TAK TERUKUR\nacak = genetik[:]; random.shuffle(acak)\nA, B = acak[:n//2], acak[n//2:]\n# tanpa randomisasi: dokter memberi obat baru ke yg lebih sehat\nterurut = sorted(genetik)\nA2, B2 = terurut[:n//2], terurut[n//2:]\n\n# TULIS KODEMU: selisih rata-rata faktor tak terukur\nselisih_acak = \nselisih_bias = \n\nprint(f"selisih_acak={selisih_acak:.3f}")\nprint(f"selisih_bias={selisih_bias:.3f}")`,
        lockLines: 9,
        solution: `import random, statistics as st\nrandom.seed(11)\nn = 1000\ngenetik = [random.gauss(0, 1) for _ in range(n)]  # faktor TAK TERUKUR\nacak = genetik[:]; random.shuffle(acak)\nA, B = acak[:n//2], acak[n//2:]\n# tanpa randomisasi: dokter memberi obat baru ke yg lebih sehat\nterurut = sorted(genetik)\nA2, B2 = terurut[:n//2], terurut[n//2:]\n\n# TULIS KODEMU: selisih rata-rata faktor tak terukur\nselisih_acak = abs(st.mean(A) - st.mean(B))\nselisih_bias = abs(st.mean(A2) - st.mean(B2))\n\nprint(f"selisih_acak={selisih_acak:.3f}")\nprint(f"selisih_bias={selisih_bias:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih_acak", value: 0.0508, tol: 0.005, label: "`selisih_acak` sekitar 0.051", msg: "abs(st.mean(A) - st.mean(B)) — dengan randomisasi selisihnya mendekati nol." },
          { kind: "equal", task: "t2", name: "selisih_bias", value: 1.6076, tol: 0.01, label: "`selisih_bias` sekitar 1.608", msg: "abs(st.mean(A2) - st.mean(B2)) — tanpa acak, seleksi dokter menciptakan selisih besar." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih_acak=0\\.051\\s+selisih_bias=1\\.608", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Randomisasi menyeimbangkan confounder terukur maupun tak terukur.",
    },
    {
      id: "lab-sampel",
      eyebrow: "Langkah 3 · Lab ukuran sampel",
      title: "Kalkulator ukuran sampel trial",
      prose: [
        "Ukuran sampel dihitung dari: efek yang ingin dideteksi (Δ), power (biasanya 80%), dan alpha (5%). Rumus dua proporsi: n per kelompok = 2 × (z_alpha + z_beta)² × p_bar × (1 − p_bar) / Δ², dengan z_alpha = 1,96 dan z_beta = 0,84.",
        "Rumus ini menjelaskan ekonomi trial: n ∝ 1/Δ². Kontrol 30% sembuh, obat ditarget 40% (Δ=10%): n ≈ 357 per kelompok. Jika target hanya Δ=5% (30% vs 35%): n ≈ 1.376 per kelompok — hampir 4x lipat. Menurunkan Δ separuhnya butuh 4x sampel.",
        "Keputusan bisnis: apakah efek 5% layak dikejar dengan biaya 4x? Kadang jawabannya tidak — dan itu keputusan statistik yang valid. NNT implisit untuk Δ=10% adalah 1/0,10 = 10 (NNT = 1/selisih risiko absolut: jumlah pasien yang harus diobati agar satu pasien tambahan membaik).",
      ],
      formula: String.raw`n = \frac{2 (z_{\alpha} + z_{\beta})^2 \, \bar{p}(1-\bar{p})}{\Delta^2}`,
      formulaNote: "n = jumlah sampel per kelompok; z_α = 1,96 (nilai-z untuk alpha 5% dua sisi); z_β = 0,84 (nilai-z untuk power 80%); p̄ = rata-rata dua proporsi — contoh (0,30+0,40)/2 = 0,35; Δ = selisih efek yang ingin dideteksi. Contoh: Δ = 0,10 → n = 2×(2,8)²×0,35×0,65/0,01 ≈ 357 per kelompok. Interpretasi: rumus ini menjawab “berapa banyak pasien agar beda sebesar Δ tidak tenggelam dalam noise?” — dan pangkat dua pada Δ menjelaskan kenapa efek yang separuhnya butuh sampel empat kalinya.",
      tasks: [
        { id: "t1", text: "Hitung `n10` per kelompok untuk Δ = 10% (0,30 vs 0,40)" },
        { id: "t2", text: "Hitung `n5` per kelompok untuk Δ = 5% (0,30 vs 0,35)" },
      ],
      expected: "n10=357  n5=1376",
      note: {
        title: "Sering salah",
        body: "Mengira “makin besar sampel makin baik, selalu”. Sampel raksasa bisa mendeteksi beda yang signifikan tapi tidak bermakna klinis (mis. turun 0,1% gula darah, p<0,001). Besar sampel menjawab “apakah beda?” — bukan “apakah bedanya penting?”",
        type: "pitfall",
      },
      hints: [
        "p_bar = rata-rata dua proporsi; delta = selisih absolutnya.",
        "Gunakan math.ceil untuk pembulatan ke atas.",
        "n = math.ceil(2 * (1.96+0.84)**2 * p_bar*(1-p_bar) / delta**2)",
      ],
      code: {
        starter: `import math\nz_alpha, z_beta = 1.96, 0.84  # alpha 5%, power 80%\n\n# TULIS KODEMU: n per kelompok untuk delta 10% dan 5%\np10_kontrol, p10_obat = 0.30, 0.40\nn10 = \np5_kontrol, p5_obat = 0.30, 0.35\nn5 = \n\nprint(f"n10={n10}  n5={n5}")\nprint(f"rasio n5/n10 = {n5/n10:.1f}x")`,
        lockLines: 1,
        solution: `import math\nz_alpha, z_beta = 1.96, 0.84  # alpha 5%, power 80%\n\n# TULIS KODEMU: n per kelompok untuk delta 10% dan 5%\np10_kontrol, p10_obat = 0.30, 0.40\ndelta10 = abs(p10_obat - p10_kontrol); pbar10 = (p10_kontrol + p10_obat)/2\nn10 = math.ceil(2 * (z_alpha+z_beta)**2 * pbar10*(1-pbar10) / delta10**2)\np5_kontrol, p5_obat = 0.30, 0.35\ndelta5 = abs(p5_obat - p5_kontrol); pbar5 = (p5_kontrol + p5_obat)/2\nn5 = math.ceil(2 * (z_alpha+z_beta)**2 * pbar5*(1-pbar5) / delta5**2)\n\nprint(f"n10={n10}  n5={n5}")\nprint(f"rasio n5/n10 = {n5/n10:.1f}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "n10", value: 357, tol: 0, label: "`n10` seharusnya 357", msg: "2×(1,96+0,84)²×0,35×0,65/0,10² lalu ceil. Cek delta dan p_bar." },
          { kind: "equal", task: "t2", name: "n5", value: 1376, tol: 0, label: "`n5` seharusnya 1376", msg: "Delta dibagi 2 → n dikali ~4. Cek delta5 = 0,05." },
          { kind: "stdout_matches", task: "t2", pattern: "n10=357\\s+n5=1376", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "n ∝ 1/Δ²: efek kecil = trial mahal. Hitung sebelum rekrut.",
    },
    {
      id: "non-inferiority",
      eyebrow: "Langkah 4 · Non-inferiority",
      title: "\u201CTidak terbukti beda\u201D bukan \u201Cterbukti sama\u201D",
      prose: [
        "Obat diabetes generik diuji non-inferiority vs obat paten: tujuannya bukan “lebih baik”, melainkan “tidak lebih buruk secara klinis bermakna” — dengan harga jauh lebih murah. Margin non-inferiority (Δ) ditetapkan 0,3% HbA1c: selisih yang dianggap tidak bermakna klinis.",
        "Hipotesisnya terbalik dari trial biasa. H0: generik lebih buruk ≥ 0,3% (inferior). Hasil: selisih (generik − paten) = +0,1%, 95% CI: −0,1% hingga +0,3%. Batas atas CI tepat di margin → non-inferiority TIDAK terbukti — walau estimasi titiknya (+0,1%) terlihat “hampir sama”. Kuncinya selalu confidence interval, bukan estimasi titik.",
        "Tiga jebakan: “tidak terbukti berbeda” ≠ “terbukti sama” — trial kecil yang underpowered juga “tidak menemukan perbedaan” karena buta, bukan karena setara. Non-inferiority butuh assay sensitivity: trial-nya harus mampu mendeteksi beda jika ada. Dan di sini ITT vs per-protocol TERBALIK: pada superiority ITT konservatif, pada non-inferiority ITT (yang mengencerkan efek via drop-out) justru memudahkan klaim non-inferior palsu — regulator menuntut keduanya konsisten.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menerjemahkan “uji klinis gagal menemukan perbedaan” menjadi “kedua obat sama efektif”. Gagal menolak H0 bisa berarti memang setara, atau trial underpowered. Kesetaraan butuh desain non-inferiority/equivalence dengan margin dan power yang cukup.",
        type: "pitfall",
      },
      reference: "Setiap kali membaca “obat generik setara”, cari margin Δ dan CI-nya.",
    },
    {
      id: "interim-stopping",
      eyebrow: "Langkah 5 · Interim analysis",
      title: "Mengintip data itu mahal — bayar dengan alpha",
      prose: [
        "Trial obat jantung baru direncanakan 2.000 pasien selama 3 tahun. Di bulan ke-18, komite melihat data: obat tampak bekerja (p = 0,03). Sponsor ingin menghentikan trial sekarang dan mengklaim kemenangan — menghemat 18 bulan biaya. Masalahnya: ini baru SATU dari beberapa kali data akan “diintip”. Setiap intipan adalah kesempatan baru bagi kebetulan untuk terlihat seperti efek nyata.",
        "Matematikanya tanpa ampun. Satu uji pada alpha 5% punya peluang positif palsu 5%. Lima kali mengintip data tanpa koreksi menaikkannya menjadi 1 − (1−0,05)^5 ≈ 22,6% — hampir 1 dari 4 trial obat TAK BERGUNA akan “terbukti manjur” hanya karena sering dilihat. Inilah kenapa interim analysis tidak boleh dilakukan sembarangan: ia butuh alpha spending function — anggaran kesalahan tipe I yang dibagi ke setiap intipan. O'Brien-Fleming membaginya secara tidak merata: sangat ketat di awal (interim pertama butuh p < 0,003 untuk berhenti), melonggar di akhir (final ≈ p < 0,047). Logikanya: bukti awal harus luar biasa kuat untuk dipercaya.",
        "Aturan mainnya dijaga tiga hal. Pertama, DSMB (Data and Safety Monitoring Board) yang independen — bukan sponsor — yang melihat data interim; sponsor tetap buta agar tidak mengubah perilaku trial. Kedua, stopping rule ditulis SEBELUM trial dimulai: kapan boleh berhenti karena efikasi, kapan harus berhenti karena futility (conditional power: peluang sukses akhir sudah di bawah 20% — melanjutkan berarti membakar uang dan memajankan pasien pada obat yang sia-sia). Ketiga, firewall informasi: hasil interim tidak bocor ke tim rekrutmen — kalau dokter tahu “obatnya bekerja”, mereka merekrut pasien berbeda dan merusak trial.",
      ],
      formula: String.raw`P(\text{min. 1 positif palsu}) = 1-(1-\alpha)^k`,
      formulaNote: "α = tingkat signifikansi tiap intipan (mis. 0,05); k = jumlah intipan data yang direncanakan. Contoh: k = 5 → 1 − 0,95^5 ≈ 0,226 — peluang 22,6% minimal satu “temuan signifikan” padahal obatnya tidak bekerja. Interpretasi: angka ini adalah harga mengintip tanpa koreksi — dan alasan alpha spending function wajib tertulis di protokol sebelum rekrutmen dimulai.",
      tasks: [],
      note: {
        title: "Intuisi: interogasi 60 detik sebelum percaya hasil trial",
        body: "Statistikawan trial yang berpengalaman tidak membaca hasil dari abstrak — ia menginterogasi desainnya dalam 60 detik dengan empat pertanyaan. Pertama: siapa yang dihitung? Kalau analisis primernya bukan ITT, tutup dulu jurnalnya — kamu sedang membaca seleksi, bukan efikasi. Kedua: berapa kali datanya diintip? Setiap interim tanpa koreksi adalah inflasi alpha; p = 0,03 pada intipan ketiga tanpa alpha spending bukan temuan, melainkan jadwal kebetulan. Ketiga: apakah analisisnya ditulis sebelum hasilnya keluar? Cari registrasinya; outcome primer yang berganti antara registrasi dan publikasi adalah sidik jari p-hacking. Keempat: apakah efeknya penting, bukan cuma signifikan? Trial 20.000 pasien bisa membuat selisih 0,2% menjadi p < 0,001 — lalu NNT-nya 500 dan tidak ada dokter yang meresepkannya. Empat pertanyaan ini — ITT, intipan, preregistrasi, kepentingan klinis — menyaring 90% klaim trial yang lewat di mejamu. Sisanya yang lolos barulah layak dibaca metodologinya baris per baris. Dan satu kebiasaan terakhir: baca bagian metode SEBELUM hasil — analis yang membaca hasil dulu mencari alasan untuk percaya, analis yang membaca metode dulu mencari alasan untuk tidak percaya; urutan baca yang benar melindungimu dari “hasil yang mengesankan” yang lahir dari desain yang cacat.",
      },
      reference: "Interim tanpa alpha spending = alpha bocor. Batas O'Brien-Fleming: ketat di awal, melonggar di akhir.",
    },
    {
      id: "lab-interim",
      eyebrow: "Langkah 6 · Lab simulasi",
      title: "Buktikan inflasi alpha: 5 intipan, 0 efek",
      prose: [
        "Buktikan inflasi alpha sendiri. Simulasikan 1.000 trial obat yang TIDAK BERGUNA (kedua kelompok punya peluang sembuh 30% yang sama — H0 benar), masing-masing “diintip” 5 kali dengan uji-z pada alpha 5%. Hitung berapa fraksi trial yang minimal sekali “signifikan”.",
        "Seed tetap (random.seed(42)) agar reproduksibel. Bandingkan hasilmu dengan 5% nominal — selisihnya adalah harga mengintip. Coba: ubah N_LOOKS menjadi 1. Apa yang terjadi? Itulah trial tanpa interim: alpha kembali jujur 5%.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `z` = |a/N − b/N| / sqrt(P×(1−P)×2/N) di tiap intipan" },
        { id: "t2", text: "Tandai `kena = True` bila z > 1,96, lalu `break` dari loop intipan" },
        { id: "t3", text: "Hitung `rate` = false_pos / N_SIM; cetak kedua baris" },
      ],
      expected: "false_pos_rate=0.247\ninflasi=4.9x dari alpha nominal 5%",
      note: {
        title: "Sering salah",
        body: "Mengira p = 0,03 pada SATU interim berarti “hampir signifikan, tinggal sedikit lagi”. Tanpa tahu itu intipan ke-berapa dan berapa alpha yang tersisa, p = 0,03 tidak bermakna apa-apa — ia bisa jauh di atas batas O'Brien-Fleming (0,003) atau tepat di bawahnya. Selalu tanya: ini intipan ke berapa, dan berapa ambangnya?",
        type: "pitfall",
      },
      hints: [
        "z memakai P (0,3) yang diketahui karena H0 benar — ini simulasi, bukan data nyata.",
        "Loop intipan: for _ in range(N_LOOKS): ... if z > 1.96: kena = True; break",
      ],
      code: {
        starter: `import random, math\nrandom.seed(42)\nN_SIM, N_LOOKS, N, P = 1000, 5, 200, 0.3  # H0 benar: kedua kelompok sama\n\n# TULIS KODEMU: 5x intipan per simulasi, catat bila ada yg signifikan\nfalse_pos = 0\nfor _ in range(N_SIM):\n    kena = False\n    for _ in range(N_LOOKS):\n        a = sum(random.random() < P for _ in range(N))\n        b = sum(random.random() < P for _ in range(N))\n        z = \n        \n    false_pos += kena\n\nrate = \nprint(f"false_pos_rate={rate:.3f}")\nprint(f"inflasi={rate/0.05:.1f}x dari alpha nominal 5%")`,
        lockLines: 2,
        solution: `import random, math\nrandom.seed(42)\nN_SIM, N_LOOKS, N, P = 1000, 5, 200, 0.3  # H0 benar: kedua kelompok sama\n\n# TULIS KODEMU: 5x intipan per simulasi, catat bila ada yg signifikan\nfalse_pos = 0\nfor _ in range(N_SIM):\n    kena = False\n    for _ in range(N_LOOKS):\n        a = sum(random.random() < P for _ in range(N))\n        b = sum(random.random() < P for _ in range(N))\n        z = abs(a/N - b/N) / math.sqrt(P*(1-P)*2/N)\n        if z > 1.96:\n            kena = True\n            break\n    false_pos += kena\n\nrate = false_pos / N_SIM\nprint(f"false_pos_rate={rate:.3f}")\nprint(f"inflasi={rate/0.05:.1f}x dari alpha nominal 5%")`,
        checks: [
          { kind: "equal", task: "t3", name: "rate", value: 0.247, tol: 0.02, label: "`rate` sekitar 0.247", msg: "false_pos / N_SIM — sekitar 24,7%, jauh di atas 5% nominal." },
          { kind: "stdout_matches", task: "t3", pattern: "false_pos_rate=0\\.24\\d", label: "`print` menampilkan false_pos_rate", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t3", pattern: "inflasi=4\\.\\dx dari alpha nominal 5%", label: "`print` menampilkan inflasi", msg: "rate/0,05 ≈ 4,9x — harga mengintip tanpa koreksi." },
        ],
      },
      reference: "5 intipan × alpha 5% ≈ 23–25% positif palsu. Alpha spending mengembalikan kejujuran.",
    },
    {
      id: "adaptif-phacking",
      eyebrow: "Langkah 7 · Desain adaptif",
      title: "Adaptif yang sah vs p-hacking: bedanya cuma waktu",
      prose: [
        "Desain adaptif adalah trial yang boleh mengubah jalurnya di tengah jalan — TETAPI hanya lewat pintu yang sudah digambar sebelum mulai. Contoh yang sah: sample-size re-estimation (di tengah trial, varians ternyata lebih besar dari asumsi → tambah sampel sesuai rumus yang sudah tertulis di protokol); response-adaptive randomization (alokasikan lebih banyak pasien ke lengan yang sejauh ini lebih baik); seamless phase 2/3 (lanjutkan tanpa jeda bila kriteria pra-spesifikasi terpenuhi); platform trial (banyak obat diuji dalam satu infrastruktur, lengan yang gagal diganti). Kuncinya: adaptasi yang direncanakan + firewall buta + koreksi statistik = fleksibilitas tanpa mengorbankan error rate.",
        "Lawannya adalah p-hacking: mengubah analisis SETELAH melihat data agar p < 0,05. Variasinya punya nama: HARKing (menulis hipotesis seolah sudah ada sebelum melihat hasil), outcome switching (outcome primer gagal → promosikan outcome sekunder yang “berhasil”), forking paths (coba 20 definisi outcome sampai satu signifikan). Bedanya dengan desain adaptif hanya satu: WAKTU keputusannya. Adaptif = diputuskan sebelum melihat data; p-hacking = diputuskan setelah. Penangkalnya: preregistrasi — protokol dan rencana analisis didaftarkan (mis. clinicaltrials.gov) SEBELUM rekrutmen — plus pelaporan transparan semua outcome yang direncanakan.",
        "Pelajaran ganda untuk analis data kesehatan. Saat MEMBACA trial: cek registrasinya — apakah outcome primer di publikasi sama dengan yang didaftarkan? Bila berbeda tanpa penjelasan, curigai outcome switching. Saat MERANCANG analisis observasional: pradaftarkan juga rencanamu (meski tidak diwajibkan seperti trial) — ia melindungimu dari dirimu sendiri, karena forking paths sama berbahayanya di data klaim seperti di trial.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira desain adaptif = “boleh mengubah apa saja asal hasilnya bagus”. Adaptasi yang tidak direncanakan sebelumnya (ad hoc) menghancurkan validitas statistik sama seperti p-hacking — bedanya cuma niatnya. Regulator menilai adaptasi dari protokol, bukan dari penjelasannya setelah fakta.",
        type: "pitfall",
      },
      reference: "Adaptif sah: direncanakan + firewall + koreksi. P-hacking: diputuskan setelah melihat data.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: membaca dan merancang uji klinis",
      prose: [
        "Lima situasi keputusan yang dihadapi pembaca trial, analis, dan perancang studi — dengan jawaban yang tepat untuk tiap situasi:",
        "Skenario 1 — “Hasil analisis utama trial ini?” → Intention-to-treat: semua peserta dianalisis sesuai kelompok acaknya, apa pun yang terjadi setelahnya. ITT menjaga keajaiban randomisasi; per-protocol (hanya yang patuh) hanyalah analisis pendukung — ia merusak keseimbangan acak.",
        "Skenario 2 — “Trial-nya “tidak signifikan” — berarti obatnya sama saja?” → Belum tentu: cek power dan ukuran sampel dulu (n ∝ 1/Δ² — efek kecil butuh trial besar). “Tidak terbukti beda” bukan “terbukti sama”; dan bedakan efikasi (kondisi ideal trial) dari efektivitas (dunia nyata yang berantakan).",
        "Skenario 3 — “Mau mengklaim obat baru “tak kalah” dari standar?” → Desain non-inferiority dengan margin yang disepakati SEBELUM trial. Waspada: di sini ITT bisa menyesatkan — ketidakpatuhan menyamakan kedua lengan sehingga obat jelek pun “lolos” — maka per-protocol wajib dilaporkan berdampingan.",
        "Skenario 4 — “Hasil interim bagus — hentikan trial sekarang?” → Hanya bila melewati batas pra-spesifikasi (mis. O'Brien-Fleming) dan diputuskan DSMB yang independen. Contoh: Kardionex p = 0,028 terlihat “signifikan”, tetapi batas interim pertamanya p < 0,003 — berhenti sekarang = estimasi efek yang bias ke atas dan klaim yang ditolak regulator.",
        "Skenario 5 — “Ubah desain atau analisis di tengah jalan?” → Boleh HANYA bila direncanakan sebelum melihat data (desain adaptif yang sah: firewall buta + koreksi statistik). Bila diputuskan setelah melihat data, itu p-hacking — apa pun namanya. Saat membaca publikasi: bandingkan outcome primernya dengan yang terdaftar di clinicaltrials.gov.",
        "Aturan praktis 10 detik: analisis utama = ITT → “tak signifikan” = cek power dulu → klaim “tak kalah” = margin pra-spesifikasi + per-protocol → berhenti dini = batas O'Brien-Fleming + DSMB → ubah rencana = hanya sebelum melihat data.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menjadikan per-protocol sebagai analisis utama (“yang patuh saja yang dihitung”) — padahal ketidakpatuhan sering terkait prognosis, sehingga analisis ini membandingkan apel dan jeruk. Dan di non-inferiority, kesalahan yang sama berbalik arah: ITT yang biasanya “konservatif” justru menjadi permisif.",
        type: "pitfall",
      },
      reference: "ITT = utama; power sebelum klaim “sama”; berhenti dini = batas + DSMB; ubah rencana = sebelum melihat data.",
    },
    {
      id: "minicase-dsmb",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Telepon dari sponsor di tengah malam",
      prose: [
        "Skenario (sintetis, untuk latihan): uji klinis obat jantung “Kardionex” vs standar, target 2.000 pasien, dengan DUA interim terencana (pada 50% dan 75% rekrutmen) memakai batas O'Brien-Fleming, plus satu analisis final. Pada interim pertama (1.000 pasien): mortalitas 3,2% (obat) vs 4,1% (standar), p = 0,028. Sponsor menelepon ketua DSMB: “p < 0,05, hentikan sekarang — kita hemat 18 bulan dan selamatkan nyawa lebih cepat!”",
        "Pertanyaan analisis: (1) Haruskah trial dihentikan dan efikasi diklaim? (2) Apa yang terjadi secara statistik bila sponsor memaksa berhenti di p = 0,028? (3) Keputusan DSMB yang benar minggu ini?",
        "Pembahasan: (1) TIDAK. Batas O'Brien-Fleming pada interim pertama ≈ p < 0,003 — jauh lebih ketat dari 0,05. p = 0,028 belum melewatinya; trial belum “menang” menurut aturan yang disepakati sebelum data dilihat. (2) Estimasi efek dari trial yang dihentikan dini bias ke atas (winner's curse versi trial): kamu berhenti tepat saat kebetulan sedang berpihak padamu. Regulator akan menolak klaim ini — dan kredibilitas sponsor rusak. (3) Lanjutkan trial sesuai protokol; sampaikan ke sponsor: “belum melewati batas, tetapi trennya menjanjikan — interim kedua 6 bulan lagi.” Pelajaran: aturan berhenti yang ditulis sebelum data dilihat adalah satu-satunya yang melindungi semua pihak — termasuk dari antusiasme sponsor sendiri.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Analis yang membiarkan sponsor menghentikan trial di p = 0,028 “karena sudah signifikan” ikut menandatangani estimasi efek yang bias ke atas — obat yang terlihat 22% lebih baik bisa jadi sebenarnya hanya 8%. Keputusan formularium berbasis angka yang menggelembung berarti triliunan rupiah untuk manfaat yang tidak ada.",
        type: "risk",
      },
      reference: "DSMB independen + batas pra-spesifikasi = satu-satunya cara berhenti dini yang sah.",
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
        "Randomisasi menyeimbangkan confounder tak terukur — keajaiban RCT.",
        "ITT = analisis primer (semua peserta, sesuai acak). Per-protocol = pendukung saja.",
        "Drop-out diferensial antar kelompok = sinyal bahaya seleksi.",
        "n ∝ 1/Δ²: efek kecil butuh trial besar; hitung sebelum rekrut.",
        "“Tidak signifikan” ≠ “sama”. Bedakan efikasi (ideal) vs efektivitas (dunia nyata).",
        "Interim tanpa koreksi menggelembungkan alpha (5 intipan ≈ 23% positif palsu) — pakai alpha spending (O'Brien-Fleming) + DSMB independen.",
        "Adaptif sah = direncanakan sebelum melihat data; p-hacking = diputuskan setelah. Cek registrasi trial untuk outcome switching.",
      ],
      next: { label: "HD6 — Kaplan-Meier & Cox", href: "/v2/learn/hd6-survival" },
      quiz: [
        {
          q: "Keajaiban utama randomisasi adalah…",
          options: [
            { text: "Menyeimbangkan confounder terukur MAUPUN tak terukur antar kelompok", why: "Benar: randomisasi menyebar semua faktor — termasuk yang belum ditemukan sains — secara acak.", correct: true },
            { text: "Membuat trial lebih murah", why: "RCT justru mahal; keunggulannya validitas internal, bukan biaya." },
            { text: "Menjamin obatnya manjur", why: "Randomisasi menjamin perbandingan adil, bukan menjamin hasil positif." },
            { text: "Menghilangkan kebutuhan kontrol", why: "Terbalik: randomisasi justru butuh kelompok kontrol sebagai pembanding." },
          ],
        },
        {
          q: "Analisis primer uji klinis menurut regulator (BPOM/FDA) adalah…",
          options: [
            { text: "ITT (intention-to-treat)", why: "Benar: ITT mempertahankan randomisasi dan anti-curang seleksi drop-out.", correct: true },
            { text: "Per-protocol", why: "Per-protocol hanya pendukung — ia merusak randomisasi lewat seleksi drop-out." },
            { text: "Hanya yang patuh", why: "Itu per-protocol dengan nama lain — sama bermasalahnya." },
            { text: "Yang dipilih sponsor", why: "Sponsor memilih analisis yang menguntungkan; regulator menuntut ITT justru untuk mencegah itu." },
          ],
        },
        {
          q: "Selisih efek yang ingin dideteksi (Δ) dibagi 2. Ukuran sampel menjadi sekitar…",
          options: [
            { text: "4x lipat", why: "Benar: n ∝ 1/Δ². Inilah ekonomi trial: efek kecil = biaya meledak.", correct: true },
            { text: "2x lipat", why: "Itu jika n ∝ 1/Δ — padahal pangkatnya dua." },
            { text: "Tetap", why: "Salah: n sangat sensitif terhadap Δ." },
            { text: "Setengah", why: "Terbalik: efek lebih kecil justru butuh sampel lebih besar." },
          ],
        },
        {
          q: "Non-inferiority bertujuan membuktikan…",
          options: [
            { text: "Obat baru tidak lebih buruk dari standar melewati margin yang disepakati", why: "Benar: “tidak lebih buruk melewati margin” — untuk obat yang menawarkan keunggulan lain (harga, keamanan).", correct: true },
            { text: "Obat baru lebih manjur", why: "Itu tujuan superiority trial, bukan non-inferiority." },
            { text: "Kedua obat identik", why: "Tidak ada uji yang membuktikan identik; non-inferiority membuktikan “cukup dekat”." },
            { text: "Obat baru lebih murah", why: "Harga adalah motivasi, bukan yang dibuktikan secara statistik." },
          ],
        },
        {
          q: "Drop-out 30% di kelompok obat vs 5% di kontrol. Bahaya terbesar?",
          options: [
            { text: "Seleksi: yang bertahan bukan sampel acak lagi — ITT wajib, per-protocol menipu", why: "Benar: drop-out diferensial merusak randomisasi. Analisis hanya-yang-bertahan = membandingkan apel pilihan dengan jeruk acak.", correct: true },
            { text: "Tidak ada, tinggal analisis yang bertahan", why: "Itu justru jebakannya: yang bertahan terseleksi (biasanya lebih sehat/patuh)." },
            { text: "Trial harus diulang dari nol", why: "Terlalu ekstrem: ITT masih memberi estimasi efektivitas yang valid." },
            { text: "Obatnya pasti berbahaya", why: "Drop-out tinggi bisa karena tidak toleran (mual), belum tentu berbahaya secara klinis." },
          ],
        },
      ],
    },
  ],
};
