import type { V2Lesson } from "../lib/types";

export const hd8: V2Lesson = {
  slug: "hd8-missing-data",
  track: "Health Data Science",
  module: "Analisis Klinis Lanjutan",
  title: "HD8 Missing Data: MCAR, MAR, MNAR",
  estMinutes: 50,
  steps: [
    {
      id: "tiga-mekanisme",
      eyebrow: "Langkah 1 · Mekanisme",
      title: "Kenapa datanya hilang?",
      prose: [
        "RS mencatat skor nyeri pulang pasien — 30% kosong. Analis menghapus baris yang kosong (complete-case) dan melaporkan rata-rata 4,2. Masalah: yang tidak mengisi justru yang kesakitan (tidak kuat memegang HP) dan yang sangat sehat (merasa tidak perlu). Rata-rata 4,2 tidak mewakili siapa-siapa.",
        "Tiga mekanisme: MCAR (missing completely at random) — hilang murni acak, seperti amplop hilang di pos; complete-case tidak bias tapi boros. MAR (missing at random) — peluang hilang tergantung data yang teramati (mis. pasien muda lebih jarang mengisi; setelah mengontrol usia, hilang jadi acak). MNAR (missing not at random) — peluang hilang tergantung nilai yang hilang itu sendiri (yang paling sakit tidak mengisi). MNAR tidak bisa diverifikasi dari data — hanya asumsi + analisis sensitivitas.",
        "Aturan: laporkan % missing per variabel (STROBE!), jangan pernah diam-diam menghapus. Complete-case di bawah MAR/MNAR = bias; imputasi mean = merusak variansi (lihat lab). Pilihan metode harus mengikuti mekanisme, bukan kemudahan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira “hapus yang kosong” itu netral. Complete-case hanya aman di bawah MCAR — yang jarang terjadi di data kesehatan. Di bawah MAR/MNAR, menghapus = memilih sampel yang tidak mewakili.",
        type: "pitfall",
      },
      reference: "Tanyakan dulu mekanismenya (MCAR/MAR/MNAR), baru pilih metode.",
    },
    {
      id: "lab-imputasi",
      eyebrow: "Langkah 2 · Lab",
      title: "Imputasi mean merusak variansi",
      prose: [
        "Data simulasi: 1000 nilai tekanan darah sistolik ~ Normal(100, 15). 30% hilang secara MCAR (seed 42). Bandingkan SD dari: (1) data asli lengkap, (2) complete-case (hapus yang hilang), (3) imputasi mean (isi yang hilang dengan rata-rata teramati).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sd_asli`, `sd_hapus`, `sd_imputasi`" },
        { id: "t2", text: "Hitung `selisih` = sd_asli − sd_imputasi (berapa poin SD yang “hilang”)" },
      ],
      expected: "sd_asli≈15.29 sd_hapus≈15.23 sd_imputasi≈12.74 | selisih≈2.56",
      note: {
        title: "Kaitan ke risk",
        body: "Variansi yang diremehkan → CI terlalu sempit → klaim “signifikan” palsu. Imputasi tunggal (mean/median) tanpa koreksi adalah cara cepat membuat analisis terlihat lebih presisi dari realitanya.",
        type: "risk",
      },
      hints: [
        "Gunakan statistics.stdev untuk SD sampel.",
        "Imputasi mean: ganti nilai hilang dengan rata-rata nilai teramati.",
        "Bandingkan ketiga SD — mana yang paling jauh dari aslinya?",
      ],
      code: {
        starter: `import random, statistics as st\nrandom.seed(42)\ndata = [random.gauss(100, 15) for _ in range(1000)]\nhilang = set(random.sample(range(1000), 300))  # 30% MCAR\nteramati = [x for i, x in enumerate(data) if i not in hilang]\nmean_obs = st.mean(teramati)\n# TULIS KODEMU: sd_asli, sd_hapus, sd_imputasi, selisih\nsd_asli = \nsd_hapus = \nsd_imputasi = \nselisih = \nprint(f"sd_asli={sd_asli:.2f} sd_hapus={sd_hapus:.2f} sd_imputasi={sd_imputasi:.2f}")\nprint(f"selisih={selisih:.2f}")`,
        lockLines: 5,
        solution: `import random, statistics as st\nrandom.seed(42)\ndata = [random.gauss(100, 15) for _ in range(1000)]\nhilang = set(random.sample(range(1000), 300))  # 30% MCAR\nteramati = [x for i, x in enumerate(data) if i not in hilang]\nmean_obs = st.mean(teramati)\n# TULIS KODEMU: sd_asli, sd_hapus, sd_imputasi, selisih\nsd_asli = st.stdev(data)\nsd_hapus = st.stdev(teramati)\nimput = [x if i not in hilang else mean_obs for i, x in enumerate(data)]\nsd_imputasi = st.stdev(imput)\nselisih = sd_asli - sd_imputasi\nprint(f"sd_asli={sd_asli:.2f} sd_hapus={sd_hapus:.2f} sd_imputasi={sd_imputasi:.2f}")\nprint(f"selisih={selisih:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd_asli", value: 15.29, tol: 0.05, label: "`sd_asli` seharusnya ≈ 15.29", msg: "SD dari 1000 nilai asli (seed 42)." },
          { kind: "equal", task: "t1", name: "sd_hapus", value: 15.23, tol: 0.05, label: "`sd_hapus` seharusnya ≈ 15.23", msg: "Complete-case di bawah MCAR tidak bias — SD-nya mirip aslinya." },
          { kind: "equal", task: "t1", name: "sd_imputasi", value: 12.74, tol: 0.05, label: "`sd_imputasi` seharusnya ≈ 12.74", msg: "Imputasi mean menarik 30% nilai ke tengah → variansi menyusut." },
          { kind: "equal", task: "t2", name: "selisih", value: 2.56, tol: 0.05, label: "`selisih` seharusnya ≈ 2.56", msg: "15,29 − 12,74: imputasi mean “menghapus” 2,56 poin SD." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih=2\\.56", label: "`print` menampilkan selisih", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Imputasi tunggal meremehkan variansi. Butuh multiple imputation.",
    },
    {
      id: "mice-rubin",
      eyebrow: "Langkah 3 · Solusi",
      title: "MICE dan aturan Rubin",
      prose: [
        "Multiple Imputation by Chained Equations (MICE): untuk tiap variabel yang hilang, bangun model prediksi dari variabel lain, imputasi dengan nilai + noise acak, ulangi untuk semua variabel, iterasi beberapa ronde. Hasilkan m dataset lengkap (biasanya m=5–20) — bukan satu.",
        "Aturan Rubin menggabungkan m hasil analisis: estimasi = rata-rata m estimasi; variansi total = variansi dalam-imputasi (rata-rata SE²) + variansi antar-imputasi × (1+1/m). Suku kedua inilah yang hilang pada imputasi tunggal — ia mengukur ketidakpastian akibat “kita tidak tahu nilai yang hilang”.",
        "Sertakan juga indikator missing sebagai fitur bila mekanisme diduga MNAR (pola “tidak mengisi” sendiri informatif), dan selalu lakukan analisis sensitivitas: apakah kesimpulan berubah jika asumsi MAR dilanggar?",
      ],
      tasks: [],
      formula: String.raw`V_{\text{total}} = \bar{W} + \left(1 + \frac{1}{m}\right) B`,
      formulaNote: "V_total = variansi total estimasi gabungan — yang dipakai untuk confidence interval dan uji hipotesis. W̄ (W-bar) = variansi DALAM-imputasi: rata-rata variansi sampling dari m analisis (ketidakpastian seandainya data lengkap). B = variansi ANTAR-imputasi: seberapa jauh m estimasi saling berbeda (ketidakpastian AKIBAT data hilang). m = jumlah imputasi (praktis 20–40 agar stabil; aturan lama m=5 kini dianggap kurang). (1+1/m) = koreksi sampel-terbatas. Interpretasi: data hilang menambah ketidakpastian lewat B — single imputation (B=0) berbohong soal presisi. Fraksi informasi hilang λ ≈ B/(W̄+B): bila λ besar, tambah m — atau kumpulkan data.",
      note: {
        title: "Sering salah",
        body: "Menjalankan MICE lalu hanya memakai 1 dari m dataset (“yang penting sudah imputasi”). Itu kembali ke imputasi tunggal — seluruh manfaat multiple imputation hilang. Analisis harus dijalankan di semua m dataset lalu digabung dengan aturan Rubin.",
        type: "pitfall",
      },
      reference: "m dataset → m analisis → gabung dengan aturan Rubin.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: menghadapi data yang hilang",
      prose: [
        "Lima situasi keputusan yang dihadapi analis setiap kali sel kosong muncul di dataset — dengan respons yang tepat untuk tiap mekanisme:",
        "Skenario 1 — “Hilangnya sedikit dan tampak acak (MCAR)?” → Complete-case analysis masih bisa diterima bila proporsinya kecil — TETAPI buktikan dulu MCAR-nya: bandingkan karakteristik responden vs non-responden. “Tampak acak” bukan bukti; yang hilang sedikit pun bisa bias bila polanya sistematis.",
        "Skenario 2 — “Hilangnya bisa dijelaskan variabel yang teramati (MAR)?” → Multiple imputation (MICE): imputasi berulang + gabungkan dengan Rubin's rules agar standard error-nya jujur. Larangan keras: single imputation (isi dengan mean) — ia memalsukan kepastian dan mengecilkan SE seolah data lengkap.",
        "Skenario 3 — “Dicurigai MNAR — yang hilang terkait nilai yang hilang itu sendiri?” → Tidak ada metode ajaib; yang ada hanya uji ketahanan. Lakukan analisis sensitivitas / tipping point: “seberapa buruk nilai yang hilang agar kesimpulan runtuh?” Contoh: survei kepuasan 8,5/10 (response 40%) runtuh bila non-responden rata-rata di bawah 6,3 — dan orang yang tak mau menjawab jarang memberi 6,3.",
        "Skenario 4 — “Variabel apa yang masuk model imputasi?” → Masukkan outcome + semua kovariat analisis + variabel pembantu yang memprediksi kehilangannya. Imputasi yang “miskin” (tanpa outcome) melemahkan hubungan yang ingin diestimasi — model imputasi harus sekaya model analisis, atau lebih kaya.",
        "Skenario 5 — “Bagaimana melaporkannya dengan jujur?” → Laporkan tiga hal: proporsi hilang per variabel, asumsi mekanisme (dan alasannya), dan rentang hasil sensitivitas. Contoh laporan jujur: “Kepuasan responden 8,5/10 (response 40%); dengan asumsi MNAR moderat, estimasi populasi 6,4–7,1.”",
        "Aturan praktis 10 detik: diagnosis mekanisme dulu (MCAR/MAR/MNAR) → MAR = MICE + Rubin, jangan mean-imputation → MNAR = tipping point, bukan keajaiban → model imputasi sekaya model analisis → laporkan proporsi + asumsi + rentang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghapus semua baris tak lengkap lalu melaporkan hasil seolah data lengkap — padahal 60% non-responden adalah informasi, bukan sampah. Atau mengisi missing dengan mean lalu bangga karena SE-nya kecil: kepastian palsu yang dibangun dari ketidaktahuan.",
        type: "pitfall",
      },
      reference: "MCAR = buktikan; MAR = MICE + Rubin; MNAR = sensitivitas; laporkan proporsi + asumsi + rentang.",
    },
    {
      id: "minicase-survei",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Survei kepuasan: yang marah tidak menjawab",
      prose: [
        "RS menyurvei kepuasan pasien via SMS: response rate 40%, rata-rata kepuasan 8,5/10. Direktur bangga. Analis curiga: yang tidak menjawab (60%) mungkin justru yang kecewa — klasik MNAR.",
        "Tipping-point analysis: “seberapa buruk kepuasan non-responden agar kesimpulan ‘mayoritas puas’ runtuh?” Jika non-responden rata-rata 5/10, rata-rata populasi = 0,4×8,5 + 0,6×5 = 6,4 — masih “cukup”. Tapi jika non-responden rata-rata 3/10 → 5,2 — klaim “mayoritas puas” runtuh. Tipping point-nya: non-responden harus rata-rata ≥6,3 agar klaim bertahan. Masuk akalkah orang yang tidak mau menjawab memberi 6,3? Mungkin tidak.",
        "Laporan jujur: “Kepuasan responden 8,5/10 (response 40%). Dengan asumsi MNAR moderat, estimasi populasi 6,4–7,1. Klaim ‘mayoritas puas’ hanya bertahan jika non-responden tidak jauh lebih kecewa dari responden — asumsi yang lemah.”",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Melaporkan “kepuasan 8,5” ke publik tanpa menyebut response rate 40% adalah cherry-picking responden. Ketika survei independen menemukan 6,0, RS dituduh memanipulasi data — padahal masalahnya hanya pelaporan yang tidak jujur.",
        type: "risk",
      },
      reference: "MNAR tidak bisa diuji dari data — hanya bisa diuji ketahanannya via sensitivitas.",
    },
    {
      id: "sensitivitas-mnar",
      eyebrow: "Langkah 6 · Sensitivitas",
      title: "Seberapa rapuh kesimpulanmu? Analisis sensitivitas MNAR",
      prose: [
        "MICE di bawah asumsi MAR adalah awal, bukan akhir. Pertanyaan yang benar untuk data hilang: “seberapa salah kesimpulan saya bila yang hilang ternyata sistematis berbeda?” Analisis sensitivitas MNAR menjawabnya tanpa perlu tahu kebenaran — ia memetakan seberapa jauh asumsi bisa didorong sebelum kesimpulan runtuh.",
        "Metode 1: delta-adjustment (pattern-mixture paling sederhana). Setelah imputasi MAR, geser nilai imputasi sebesar δ untuk kelompok yang hilang, lalu ulangi analisis untuk δ = 0, −1, −2, −3… Catat pada δ berapa kesimpulan berubah — δ* itu adalah tipping point. Contoh survei kepuasan di lesson ini: pada δ = −2,5 (non-responden 2,5 poin lebih tidak puas), rata-rata populasi turun di bawah 7 — klaim “mayoritas puas” tidak bertahan. Pertanyaan untuk manajemen bukan “berapa δ yang benar?” melainkan “percaya kah kamu non-responden HANYA 1 poin lebih tidak puas?” — bila tidak, klaimnya mati.",
        "Metode 2: selection model — modelkan probabilitas “hilang” bersama outcome; cocok bila ada variabel yang memengaruhi respons tapi tidak memengaruhi outcome (mis. hari pengiriman SMS memengaruhi response rate tapi tidak kepuasan). Metode 3: pattern-mixture penuh — estimasi terpisah per pola missing. Ketiganya tidak “mengoreksi” MNAR — mereka mengukur kerapuhan. Prinsip pelaporan: JANGAN laporkan satu angka; laporkan kurva sensitivitas (sumbu X = δ, sumbu Y = estimasi) + tipping point + penilaian kemasukakalannya.",
        "Kapan berhenti? Aturan praktis: (a) bila tipping point jauh di luar δ yang masuk akal secara substansi → kesimpulan kokoh, laporkan sekali jalan; (b) bila tipping point dekat dengan δ yang masuk akal → kesimpulan rapuh, JANGAN klaim — kumpulkan data (follow-up non-responden!) alih-alih memoles analisis. Follow-up 10% non-responden acak sering lebih murah dan lebih meyakinkan daripada 40 imputasi. Data yang hilang kadang harus dicari, bukan diimputasi.",
        "Catatan desain: mencegah lebih baik daripada mengimputasi. Untuk survei berikutnya: catat PARADATA (jam kirim, jumlah pengingat, perangkat) — ia prediktor respons terbaik sekaligus bahan selection model; rancang insentif respons untuk grup yang diprediksi non-respons; tetapkan target response rate + rencana follow-up SEBELUM survei jalan. Analis yang baru muncul saat data sudah hilang sedang memadamkan api yang bisa dicegah.",
      ],
      tasks: [],
      formula: String.raw`Y_{imp}^{(k)} = \hat{Y}_{MAR}^{(k)} + \delta`,
      formulaNote: "Y_imp^(k) = nilai imputasi ke-k setelah penyesuaian sensitivitas; Ŷ_MAR^(k) = nilai imputasi di bawah asumsi MAR (dari MICE); δ (delta) = pergeseran yang diasumsikan untuk non-responden — seberapa beda yang hilang dari yang teramati (mis. δ = −2: non-responden 2 poin lebih tidak puas). Interpretasi: ulangi analisis untuk rentang δ yang masuk akal; δ* di mana kesimpulan BERUBAH = tipping point — laporkan ia, bukan satu angka. Bila tipping point jauh dari δ yang masuk akal, kesimpulan kokoh.",
      note: {
        title: "Intuisi: interogasi yang hilang, minta kurvanya, telepon dulu",
        body: "Analis junior memperlakukan data hilang sebagai lubang yang harus ditambal; analis senior memperlakukannya sebagai saksi yang bungkam — dan saksi yang bungkam biasanya menyembunyikan sesuatu. Heuristik pertama: selalu tanyakan “siapa yang paling mungkin hilang, dan apa yang mereka sembunyikan?” — jawabannya hampir tidak pernah acak: yang marah tidak mengisi survei kepuasan, yang sakit parah tidak datang kontrol, yang miskin tidak tercatat di asuransi. Mekanisme missing-nya adalah temuan, bukan gangguan. Heuristik kedua: jangan pernah percaya satu angka dari data berlubang — minta kurva sensitivitasnya. “Rata-rata kepuasan 8,5” tanpa tipping point adalah setengah kalimat; kalimat lengkapnya “8,5 bila MAR; runtuh bila non-responden 2,5 poin lebih tidak puas”. Heuristik ketiga: anggaran follow-up 10% non-responden hampir selalu mengalahkan 10 jam tuning imputasi — satu telepon ke 50 non-responden acak memberi δ empiris yang tidak bisa diberikan 40 imputasi. Tiga kebiasaan — interogasi yang hilang, minta kurvanya, telepon dulu sebelum imputasi — mengubah missing data dari aib yang disembunyikan menjadi analisis yang paling dipercaya.",
      },
      quiz: [
        {
          q: "Tipping point δ* = −2,5; penilaian substantif: non-responden mungkin 3 poin lebih tidak puas. Kesimpulan?",
          options: [
            { text: "Klaim “mayoritas puas” rapuh — jangan laporkan sebagai fakta", why: "Benar: δ masuk akal (−3) melewati tipping point (−2,5) — kesimpulan tidak bertahan.", correct: true },
            { text: "Aman — tipping point hanya teori", why: "Tipping point justru menguji teori terhadap penilaian substantif." },
            { text: "Naikkan δ sampai klaim bertahan", why: "Memilih asumsi agar kesimpulan selamat = memalsukan analisis." },
            { text: "Laporkan 8,5 saja, lebih sederhana", why: "Menyembunyikan kerapuhan = setengah kalimat yang menyesatkan." },
          ],
        },
        {
          q: "Kurva sensitivitas menunjukkan kesimpulan bertahan hingga δ = −8 (sangat ekstrem). Artinya?",
          options: [
            { text: "Kesimpulan kokoh — laporkan dengan percaya diri", why: "Benar: tipping point jauh di luar δ masuk akal = robust.", correct: true },
            { text: "Tetap tidak boleh klaim", why: "Kekokohan sudah terbukti; kehati-hatian berlebih = kelumpuhan." },
            { text: "Imputasinya salah", why: "Tidak ada indikasi itu dari kurva sensitivitas." },
            { text: "Butuh 100 imputasi lagi", why: "m lebih besar tidak mengubah tipping point substantif." },
          ],
        },
        {
          q: "Pilihan terbaik saat tipping point dekat dengan δ yang masuk akal?",
          options: [
            { text: "Follow-up sampel non-responden acak untuk δ empiris", why: "Benar: data nyata mengalahkan asumsi; 10% follow-up sering lebih murah dari analisis lanjutan.", correct: true },
            { text: "Tambah jumlah imputasi m menjadi 100", why: "m besar menstabilkan variansi, tidak memperbaiki bias MNAR." },
            { text: "Ganti ke single imputation", why: "Itu kemunduran — menyembunyikan ketidakpastian." },
            { text: "Hapus variabel dengan missing tertinggi", why: "Membuang informasi dan tidak menjawab kerapuhan kesimpulan." },
          ],
        },
      ],
      reference: "Laporkan kurva sensitivitas + tipping point, bukan satu angka.",
    },
    {
      id: "lab-tipping",
      eyebrow: "Langkah 7 · Lab",
      title: "Hitung tipping point survei kepuasan",
      prose: [
        "Survei kepuasan RS: 400 responden (rata-rata 8,5/10), 600 non-responden. Di bawah MAR, rata-rata populasi = 8,5. Dengan delta-adjustment, rata-rata populasi sebagai fungsi δ: (400×8,5 + 600×(8,5+δ))/1000. Klaim manajemen: “mayoritas puas” = rata-rata >7,0. Tugasmu: hitung `delta_star` (δ di mana rata-rata tepat 7,0 — tipping point) dan `mean_d2` (rata-rata bila δ=−2), lalu beri `verdict` (“bertahan”/“runtuh”) untuk klaim pada δ=−2.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `delta_star` (tipping point)" },
        { id: "t2", text: "Hitung `mean_d2` dan `verdict` pada δ=−2" },
      ],
      expected: "delta_star=-2.5 mean_d2=7.3 bertahan",
      note: {
        title: "Kaitan ke risk",
        body: "Direktur yang mengumumkan “kepuasan 8,5” tanpa tahu tipping point-nya −2,5 sedang berdiri di atas es tipis: satu investigasi jurnalis yang mewawancarai non-responden cukup untuk membalikkan klaim menjadi skandal.",
        type: "risk",
      },
      hints: [
        "Rata-rata populasi(δ) = (400×8,5 + 600×(8,5+δ))/1000 = 8,5 + 0,6δ.",
        "Tipping point: 8,5 + 0,6δ = 7,0 → δ = −1,5/0,6.",
        "verdict “bertahan” bila mean_d2 > 7,0.",
      ],
      code: {
        starter: `# 400 responden (mean 8,5); 600 non-responden; ambang puas > 7,0\n# TULIS KODEMU: delta_star, mean_d2, verdict\ndelta_star = \nmean_d2 = \nverdict = \nprint(f"delta_star={delta_star:.1f} mean_d2={mean_d2:.1f} {verdict}")`,
        lockLines: 1,
        solution: `# 400 responden (mean 8,5); 600 non-responden; ambang puas > 7,0\n# TULIS KODEMU: delta_star, mean_d2, verdict\nn_resp, mean_resp, n_non = 400, 8.5, 600\ndef pop_mean(delta):\n    return (n_resp * mean_resp + n_non * (mean_resp + delta)) / (n_resp + n_non)\ndelta_star = (7.0 - mean_resp) * (n_resp + n_non) / n_non\nmean_d2 = pop_mean(-2)\nverdict = "bertahan" if mean_d2 > 7.0 else "runtuh"\nprint(f"delta_star={delta_star:.1f} mean_d2={mean_d2:.1f} {verdict}")`,
        checks: [
          { kind: "equal", task: "t1", name: "delta_star", value: -2.5, tol: 0.05, label: "`delta_star` seharusnya −2.5", msg: "(7,0−8,5)×1000/600 — di bawah ini klaim runtuh." },
          { kind: "equal", task: "t2", name: "mean_d2", value: 7.3, tol: 0.05, label: "`mean_d2` seharusnya 7.3", msg: "8,5 + 0,6×(−2) — masih di atas ambang 7,0." },
          { kind: "contains", task: "t2", name: "verdict", value: "bertahan", label: "`verdict` seharusnya “bertahan”", msg: "Pada δ=−2 klaim bertahan — tapi tipis: tipping point −2,5 dekat." },
          { kind: "stdout_matches", task: "t2", pattern: "delta_star=-2\\.5 mean_d2=7\\.3 bertahan", label: "`print` menampilkan hasil tipping point", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "delta_star = −2,5 dan penilaianmu: non-responden realistisnya −2. Seberapa nyaman kamu dengan klaim “mayoritas puas”?",
          options: [
            { text: "Tidak nyaman — tipping point terlalu dekat dengan δ realistis; butuh follow-up", why: "Benar: margin 0,5 poin terlalu tipis untuk klaim publik.", correct: true },
            { text: "Sangat nyaman — masih bertahan", why: "“Bertahan” dengan margin 0,5 poin = rapuh, bukan aman." },
            { text: "Tidak nyaman — harus ganti metode imputasi", why: "Masalahnya bukan metode, melainkan kedekatan tipping point." },
            { text: "Nyaman bila n diperbesar", why: "n besar tidak menggeser tipping point substantif." },
          ],
        },
      ],
      reference: "Tipping point dekat δ realistis = klaim rapuh. Cari data, bukan dalih.",
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
        "MCAR: hilang acak. MAR: hilang tergantung data teramati. MNAR: hilang tergantung nilai yang hilang.",
        "Imputasi tunggal (mean) meremehkan variansi → CI terlalu sempit.",
        "MICE: m dataset + aturan Rubin (tambah variansi antar-imputasi).",
        "MNAR: tidak bisa diverifikasi — pakai tipping-point / analisis sensitivitas.",
      ],
      next: { label: "HD9 — Uji Diagnostik", href: "/learn/hd9-uji-diagnostik" },
      quiz: [
        {
          q: "Pasien yang paling sakit tidak mengisi skor nyeri. Mekanisme?",
          options: [
            { text: "MNAR — peluang hilang tergantung nilai yang hilang itu sendiri", why: "Benar: yang sakit (nilai tinggi) yang hilang. Tidak bisa diverifikasi dari data.", correct: true },
            { text: "MCAR", why: "Bukan acak — terkait langsung dengan tingkat nyeri." },
            { text: "MAR", why: "MAR butuh variabel teramati yang menjelaskan hilangnya; di sini penyebabnya nilai itu sendiri." },
            { text: "Bukan missing data", why: "Ini justru contoh klasik missing data bermasalah." },
          ],
        },
        {
          q: "Kenapa imputasi mean berbahaya?",
          options: [
            { text: "Menarik nilai ke tengah → variansi menyusut → SE/CI terlalu optimistis", why: "Benar: lab menunjukkan SD 15,29 → 12,74. Ketidakpastian akibat missing diabaikan.", correct: true },
            { text: "Mean selalu salah hitung", why: "Mean-nya benar; yang rusak adalah variansinya." },
            { text: "Tidak bisa dipakai untuk data besar", why: "Bukan soal ukuran — soal prinsip statistiknya." },
            { text: "Hanya untuk data kategorik", why: "Terbalik: masalahnya justru pada data numerik." },
          ],
        },
        {
          q: "Aturan Rubin menambahkan suku (1+1/m)×B untuk…",
          options: [
            { text: "Mengukur ketidakpastian akibat nilai yang hilang (variansi antar-imputasi)", why: "Benar: inilah yang membuat MI jujur dibanding imputasi tunggal.", correct: true },
            { text: "Memperbesar sampel", why: "Bukan soal ukuran sampel — soal ketidakpastian." },
            { text: "Mengoreksi bias", why: "Suku ini soal variansi, bukan bias titik estimasi." },
            { text: "Mempercepat komputasi", why: "Justru menambah komputasi (m analisis)." },
          ],
        },
        {
          q: "Response rate 40%, klaim “kepuasan 8,5”. Langkah jujur pertama?",
          options: [
            { text: "Tipping-point analysis: seberapa buruk non-responden agar klaim runtuh", why: "Benar: MNAR tidak bisa diuji — hanya ketahanannya yang bisa diuji.", correct: true },
            { text: "Laporkan 8,5 apa adanya", why: "Itu cherry-picking responden." },
            { text: "Hapus survei", why: "Data responden tetap berguna — dengan caveat yang jujur." },
            { text: "Asumsikan non-responden sama", why: "Asumsi MAR tanpa dasar — justru yang harus diuji." },
          ],
        },
      ],
    },
  ],
};
