import type { V2Lesson } from "../lib/types";

export const a21: V2Lesson = {
  slug: "a21-sampling-bias",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.1 2,4 Juta Responden yang Salah Total: Sampling & Bias",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-digest",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Survei terbesar yang pernah gagal",
      prose: [
        "Tahun 1936, majalah Literary Digest melakukan survei pemilu AS terbesar dalam sejarah: 2,4 juta responden. Hasilnya meyakinkan — Landon mengalahkan Roosevelt. Hasil aktual? Roosevelt menang telak dengan 62% suara. Literary Digest salah total, dan bangkrut dua tahun kemudian. Di saat yang sama George Gallup mensurvei hanya 50 ribu orang — dan prediksinya benar.",
        "Jawabannya bukan soal jumlah. Literary Digest mengambil sampel dari daftar pemilik telepon dan mobil — di era Depresi Besar itu artinya orang kaya, yang condong ke Landon. Sampelnya raksasa tapi bias. Digest meleset 19 poin (43% vs 62%); Gallup hanya meleset 6 poin. Keterwakilan mengalahkan ukuran.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `meleset_ld` = selisih prediksi Digest vs aktual" },
        { id: "t2", text: "Hitung `meleset_gallup` = selisih prediksi Gallup vs aktual" },
        { id: "t3", text: "Hitung `rasio_n` = 2.400.000 / 50.000" },
      ],
      expected: "meleset_ld=19  meleset_gallup=6  rasio_n=48",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu juta data bias tetap bias — hanya bias yang lebih presisi. Pertanyaan yang benar bukan berapa banyak, melainkan bagaimana cara mengumpulkannya dan siapa yang terlewat. Data transaksi 1 juta baris mewakili transaksi, belum tentu mewakili nasabah.",
      },
      hints: [
        "Aktual = 62; Digest = 43; Gallup = 56.",
        "Selisih = |aktual − prediksi|.",
        "rasio_n = 2400000/50000",
      ],
      code: {
        starter: `aktual = 62\ndigest, gallup = 43, 56\n\n# TULIS KODEMU\nmeleset_ld = \nmeleset_gallup = \nrasio_n = \n\nprint(f"meleset_ld={meleset_ld}  meleset_gallup={meleset_gallup}  rasio_n={rasio_n}")`,
        lockLines: 2,
        solution: `aktual = 62\ndigest, gallup = 43, 56\n\n# TULIS KODEMU\nmeleset_ld = abs(aktual-digest)\nmeleset_gallup = abs(aktual-gallup)\nrasio_n = 2400000/50000\n\nprint(f"meleset_ld={meleset_ld}  meleset_gallup={meleset_gallup}  rasio_n={rasio_n}")`,
        checks: [
          { kind: "equal", task: "t1", name: "meleset_ld", value: 19, tol: 1e-9, label: "`meleset_ld` seharusnya 19", msg: "62 − 43 = 19 poin." },
          { kind: "equal", task: "t2", name: "meleset_gallup", value: 6, tol: 1e-9, label: "`meleset_gallup` seharusnya 6", msg: "62 − 56 = 6 poin." },
          { kind: "equal", task: "t3", name: "rasio_n", value: 48, tol: 1e-9, label: "`rasio_n` seharusnya 48", msg: "Sampel 48× lebih besar tapi meleset 3× lebih jauh." },
          { kind: "stdout_matches", task: "t3", pattern: "meleset_ld=19\\s+meleset_gallup=6\\s+rasio_n=48", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kualitas sampling > kuantitas. Total error = bias² + variansi.",
    },
    {
      id: "empat-bias",
      eyebrow: "Langkah 2 · Empat bias",
      title: "Empat cara sampel menyesatkanmu",
      prose: [
        "Bias adalah kesalahan sistematis — sampel konsisten menyimpang ke satu arah. 1. Bias seleksi: cara pengambilan membuat kelompok terlewat. Survei kepuasan lewat aplikasi hanya menangkap yang masih install — yang kecewa dan uninstall tidak bersuara. 2. Survivorship bias: hanya yang selamat yang teramati. Abraham Wald: lapisi bagian pesawat yang bersih dari lubang — pesawat tertembak di mesin/kokpit tidak pernah kembali.",
        "3. Nonresponse bias: yang tidak menjawab berbeda sistematis — survei gaji: yang gajinya kecil cenderung tidak mengisi, hasil terlihat lebih tinggi dari kenyataan. 4. Convenience sampling: ambil yang gampang — survei di mal, polling di media sosial sendiri. Cepat, murah, hampir selalu bias. Ingat: memperbesar n hanya mengecilkan variansi, bukan bias. 2,4 juta × bias = estimasi bias yang sangat presisi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Makin besar sampel, makin hilang biasnya. Salah: ukuran sampel hanya mengecilkan kesalahan acak, bukan bias. Survei bias 2,4 juta responden menghasilkan estimasi bias yang sangat presisi — presisi mengukur kesalahan yang salah.",
      },
      reference: "Tanya selalu: siapa yang tidak ada di dataku? Yang hilang sering lebih informatif.",
    },
    {
      id: "clt",
      eyebrow: "Langkah 3 · Distribusi sampling & CLT",
      title: "CLT: mesin pembuat normalitas",
      prose: [
        "Distribusi sampling adalah distribusi dari suatu statistik (misal mean) jika kita mengulang pengambilan sampel berkali-kali — bukan distribusi datanya. Teorema Limit Pusat: untuk sampel acak berukuran cukup besar, distribusi sampling dari mean mendekati normal — tidak peduli seperti apa bentuk populasinya. Populasi boleh miring parah; rata-rata sampel-sampelnya tetap membentuk lonceng.",
        "Populasi waktu tunggu layanan: mean 15 menit, sigma 8, distribusi miring kanan. Ambil sampel n = 100. Menurut CLT, mean sampel kurang-lebih normal dengan mean 15 dan SE 8/√100 = 0,8. Artinya 95% mean-mean sampel jatuh dalam 15 ± 2×0,8 = antara 13,4 dan 16,6 menit. Kita tidak pernah berasumsi datanya normal — yang normal adalah distribusi dari mean-nya.",
      ],
      formula: String.raw`\bar{X} \;\dot\sim\; N\left(\mu, \frac{\sigma^2}{n}\right)`,
      formulaNote: "X-bar = mean sampel; mu = mean populasi; sigma = simpangan baku populasi; n = ukuran sampel; simbol titik-sim artinya kurang-lebih berdistribusi normal bila n cukup besar.",
      tasks: [
        { id: "t1", text: "Hitung `se` = 8 / √100" },
        { id: "t2", text: "Hitung `bawah` dan `atas` = 15 ± 2×SE" },
      ],
      expected: "se=0.8  bawah=13.4  atas=16.6",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "CLT mengatakan data populasi menjadi normal jika n besar. Salah: yang menjadi normal adalah distribusi dari mean-mean sampel, bukan datanya. Data populasi tetap boleh miring. Dan CLT tidak memperbaiki bias — sampel bias dengan n besar tetap bias.",
      },
      hints: [
        "se = sigma / n**0.5.",
        "Batas 95% ≈ mean ± 2×SE.",
        "atas = 15 + 2*se",
      ],
      code: {
        starter: `mu, sigma, n = 15, 8, 100\n\n# TULIS KODEMU\nse = \nbawah = \natas = \n\nprint(f"se={se}  bawah={bawah}  atas={atas}")`,
        lockLines: 1,
        solution: `mu, sigma, n = 15, 8, 100\n\n# TULIS KODEMU\nse = sigma/(n**0.5)\nbawah = mu - 2*se\natas = mu + 2*se\n\nprint(f"se={se}  bawah={bawah}  atas={atas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se", value: 0.8, tol: 1e-9, label: "`se` seharusnya 0.8", msg: "8/√100 = 0,8." },
          { kind: "equal", task: "t2", name: "bawah", value: 13.4, tol: 1e-9, label: "`bawah` seharusnya 13.4", msg: "15 − 1,6 = 13,4." },
          { kind: "equal", task: "t2", name: "atas", value: 16.6, tol: 1e-9, label: "`atas` seharusnya 16.6", msg: "15 + 1,6 = 16,6." },
          { kind: "stdout_matches", task: "t2", pattern: "se=0\\.8\\s+bawah=13\\.4\\s+atas=16\\.6", label: "`print` menampilkan ketiganya", msg: "Format: se=...  bawah=...  atas=... ." },
        ],
      },
      reference: "CLT: rata-rata meredam keanehan individu; n ≥ 30 biasanya cukup.",
    },
    {
      id: "se-akar-kuadrat",
      eyebrow: "Langkah 4 · Standard error",
      title: "Standard error: harga ketidakpastian",
      prose: [
        "Standard error (SE) adalah simpangan baku dari distribusi sampling — seberapa jauh estimasi sampel biasanya meleset dari nilai populasi. SE mean = s/√n; SE proporsi = √(p̂(1−p̂)/n), terbesar saat p̂ = 0,5. SD mengukur sebaran data individu (tidak mengecil dengan n); SE mengukur sebaran estimasi mean (mengecil dengan n). Mencampur keduanya adalah kesalahan klasik.",
        "Polling: 1.067 responden, 52% mendukung kandidat A. SE = √(0,52×0,48/1067) ≈ 1,53 poin; margin of error 95% ≈ 3,0 poin. Laporan jujur: 52% ± 3 poin, bukan 52% tepat. Hukum akar kuadrat: membelah dua SE butuh 4× sampel — presisi punya diminishing returns yang brutal. SD waktu tunggu 12 menit: agar SE ≤ 1 butuh n ≥ 144.",
      ],
      formula: String.raw`SE(\bar{x}) = \frac{s}{\sqrt{n}} \qquad SE(\hat{p}) = \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}`,
      formulaNote: "SE = standard error (simpangan baku distribusi sampling); s = simpangan baku sampel; p-hat = proporsi sampel; SE mengecil sebanding 1/akar-n — menggandakan presisi butuh 4x sampel.",
      tasks: [
        { id: "t1", text: "Hitung `n_butuh` agar SE ≤ 1 saat s = 12" },
        { id: "t2", text: "Hitung `se_poll` polling (persen, 2 desimal)" },
        { id: "t3", text: "Hitung `moe` = 1,96 × se_poll (1 desimal)" },
      ],
      expected: "n_butuh=144  se_poll=1.53  moe=3.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Standard error = standar deviasi. Salah: SD mengukur sebaran data individu; SE mengukur sebaran estimasi mean. SD tidak mengecil saat n bertambah (data tetap seberagam itu), tapi SE mengecil — estimasi makin presisi.",
      },
      hints: [
        "SE = s/√n ≤ 1 → √n ≥ 12 → n ≥ 144.",
        "se_poll = (0.52*0.48/1067)**0.5*100.",
        "moe = round(1.96*se_poll/100*100, 1) — hati-hati satuan.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\nn_butuh = \nse_poll = \nmoe = \n\nprint(f"n_butuh={n_butuh}  se_poll={se_poll}  moe={moe}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\nn_butuh = 144  # (12/1)**2\nse_poll = round(math.sqrt(0.52*0.48/1067)*100, 2)\nmoe = round(1.96*se_poll, 1)\n\nprint(f"n_butuh={n_butuh}  se_poll={se_poll}  moe={moe}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_butuh", value: 144, tol: 1e-9, label: "`n_butuh` seharusnya 144", msg: "12/√n ≤ 1 → n ≥ 144." },
          { kind: "equal", task: "t2", name: "se_poll", value: 1.53, tol: 0.01, label: "`se_poll` sekitar 1.53", msg: "√(0,52×0,48/1067) × 100 ≈ 1,53 poin." },
          { kind: "equal", task: "t3", name: "moe", value: 3.0, tol: 0.05, label: "`moe` seharusnya 3.0", msg: "1,96 × 1,53 ≈ 3,0 poin — angka ±3% di berita polling." },
          { kind: "stdout_matches", task: "t3", pattern: "n_butuh=144\\s+se_poll=1\\.53\\s+moe=3(\\.0)?", label: "`print` menampilkan ketiganya", msg: "Format: n_butuh=...  se_poll=...  moe=... ." },
        ],
      },
      reference: "Hukum akar kuadrat: SE/2 butuh 4× sampel. Survei nasional berhenti di ~1.000–2.000 responden.",
    },
    {
      id: "metode-sampling",
      eyebrow: "Langkah 5 · Metode sampling",
      title: "Lima cara mengambil — pilih sesuai medan",
      prose: [
        "1. Acak sederhana: setiap anggota punya peluang terpilih yang sama — butuh daftar lengkap (frame). Contoh: audit memilih 200 transaksi acak bulan ini. 2. Stratifikasi: populasi terbagi kelompok kecil tapi penting (nasabah korporat 2% tapi 40% dana) — ambil sampel acak di tiap strata (100 korporat + 900 ritel). Menjamin keterwakilan tiap kelompok.",
        "3. Klaster: populasi tersebar geografis, daftar lengkap tidak ada — pilih 20 kota acak, survei di dalamnya. Murah dan operasional; harganya presisi lebih rendah. 4. Sistematis: ambil setiap transaksi ke-100 — praktis untuk audit, tapi waspadai pola periodik yang selaras dengan interval. 5. Convenience: untuk riset awal saja — wajib tulis disclaimer tidak dapat digeneralisasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Aturan 10 detik: tanya dulu siapa yang terlewat — kalau ada kelompok yang peluang terpilihnya nol, sampelmu bias. Ada kelompok kecil tapi penting → stratifikasi. Tidak ada daftar lengkap → klaster. Laporkan selalu: metode sampling, frame, dan response rate.",
      },
      reference: "Stratifikasi untuk kelompok kecil-penting; klaster untuk populasi tersebar.",
    },
    {
      id: "minicase-kepuasan",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Survei kepuasan yang menipu direksi",
      prose: [
        "Bank MajuBank mengirim survei kepuasan via push notification aplikasi. Hasil: 8.000 responden, skor rata-rata 4,6/5 — direksi puas. Namun kuartal yang sama: komplain ke call center naik 40%, dan 12.000 nasabah menutup rekening. Aplikasi hanya terinstall di 35% nasabah; rating aplikasi turun dari 4,4 ke 3,1 dalam 6 bulan.",
        "(a) Bias seleksi ganda: hanya 35% nasabah punya aplikasi (frame tidak lengkap), dan hanya yang cukup peduli yang merespons (nonresponse bias). Yang kecewa berat sudah uninstall — survivorship bias versi digital. Sampel mewakili pengguna app yang masih betah, bukan nasabah. (b) SE = 0,8/√8000 ≈ 0,0089 — sangat kecil! Tapi SE hanya mengukur kesalahan acak. Bias seleksinya bisa 0,5–1,0 poin — 56× lebih besar dari SE. 4,600 ± 0,009 terlihat ilmiah padahal meleset jauh.",
        "(c) Rancang ulang: ambil frame dari database nasabah (bukan pengguna app); stratified sampling — segmen yang komplain 90 hari terakhir wajib terwakili; ukur nonresponse — bandingkan karakteristik responden vs nonresponden.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `se` = 0,8 / √8000 (4 desimal)" },
        { id: "t2", text: "Hitung `rasio` = 0,5 / se, dibulatkan (bias vs SE)" },
      ],
      expected: "se=0.0089  rasio=56",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Presisi mengukur kesalahan yang salah. SE 0,0089 dengan bias 0,5 poin berarti angka ilmiahmu meleset 56× lipat dari ketidakpastian yang kamu laporkan. Selalu laporkan potensi bias bersama SE — bukan SE saja.",
      },
      hints: [
        "se = 0.8 / 8000**0.5.",
        "rasio = round(0.5/se).",
        "Bulatkan se 4 desimal.",
      ],
      code: {
        starter: `sd, n = 0.8, 8000\n\n# TULIS KODEMU\nse = \nrasio = \n\nprint(f"se={se}  rasio={rasio}")`,
        lockLines: 1,
        solution: `sd, n = 0.8, 8000\n\n# TULIS KODEMU\nse = round(sd/(n**0.5), 4)\nrasio = round(0.5/se)\n\nprint(f"se={se}  rasio={rasio}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se", value: 0.0089, tol: 0.0001, label: "`se` seharusnya 0.0089", msg: "0,8/√8000 ≈ 0,0089." },
          { kind: "equal", task: "t2", name: "rasio", value: 56, tol: 2, label: "`rasio` sekitar 56", msg: "Bias 0,5 poin adalah 56× SE — SE kecil tidak menyelamatkan." },
          { kind: "stdout_matches", task: "t2", pattern: "se=0\\.0089\\s+rasio=56", label: "`print` menampilkan keduanya", msg: "Format: se=...  rasio=... ." },
        ],
      },
      reference: "SE kecil + bias besar = keyakinan palsu yang mahal.",
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
        "Keterwakilan > ukuran: sampel besar tapi bias = estimasi bias yang presisi.",
        "Empat bias: seleksi (siapa kepilih), survivorship (yang gagal tak bercerita), nonrespons (yang diam beda), convenience (yang gampang saja).",
        "CLT: distribusi sampling dari mean mendekati normal saat n besar — bukan datanya.",
        "SE = s/√n; hukum akar kuadrat: SE/2 butuh 4× sampel. SE ≠ SD.",
        "Pilih metode sesuai medan: acak sederhana, stratifikasi, klaster, sistematis — dan laporkan batasannya.",
      ],
      next: { label: "A2.10 — Power & Ukuran Sampel", href: "/learn/a210-power-sampel" },
      quiz: [
        {
          q: "Literary Digest (2,4 jt responden) salah total, Gallup (50 rb) benar. Pelajaran utamanya?",
          options: [
            { text: "Survei besar selalu lebih buruk dari survei kecil", why: "Tidak selalu — survei besar yang acak tetap lebih presisi." },
            { text: "Keterwakilan (cara sampling) mengalahkan ukuran sampel — sampel raksasa tapi bias tetap bias", why: "Ukuran sampel hanya mengecilkan random error, tidak menghapus bias.", correct: true },
            { text: "Gallup beruntung saja", why: "Gallup memakai sampling acak yang benar — bukan keberuntungan." },
            { text: "Pemilu 1936 tidak bisa diprediksi", why: "Bisa — Gallup membuktikannya dengan 50 ribu responden." },
          ],
        },
        {
          q: "Insinyur ingin melapisi bagian pesawat yang paling banyak lubang pelurunya (dari pesawat yang kembali). Menurut logika Abraham Wald, seharusnya?",
          options: [
            { text: "Lapisi bagian berlubang paling banyak — data tidak berbohong", why: "Data hanya dari pesawat yang selamat — lubang di sana menandai bagian yang tahan ditembak." },
            { text: "Lapisi bagian yang bersih dari lubang — pesawat tertembak di sana tidak pernah kembali", why: "Klasik survivorship bias: yang gagal tidak bercerita.", correct: true },
            { text: "Lapisi seluruh pesawat", why: "Terlalu berat untuk terbang — dan melewatkan pelajarannya." },
            { text: "Tidak perlu dilapisi, lubang tidak masalah", why: "Lubang di mesin/kokpit = fatal — justru itu masalahnya." },
          ],
        },
        {
          q: "SD waktu tunggu = 12 menit. Berapa n agar SE mean ≤ 1 menit?",
          options: [
            { text: "n = 12", why: "SE = 12/√12 ≈ 3,46 — jauh di atas 1." },
            { text: "n = 36", why: "SE = 12/6 = 2 — masih di atas 1." },
            { text: "n = 144", why: "SE = 12/12 = 1. Hukum akar kuadrat beraksi.", correct: true },
            { text: "n = 1.728", why: "Itu 12³ — bukan hukum akar kuadrat." },
          ],
        },
        {
          q: "Survei gaji via kuesioner online sukarela: rata-rata Rp14 jt, padahal data pajak median Rp7 jt. Penjelasan paling mungkin?",
          options: [
            { text: "Responden berbohong semua", why: "Tidak perlu berbohong — seleksi respondennya yang miring." },
            { text: "Nonresponse bias — yang gajinya kecil cenderung tidak mengisi, sampel miring ke atas", why: "Partisipasi sukarela membuat yang tidak nyaman absen sistematis — bukan soal n.", correct: true },
            { text: "Sampel terlalu besar", why: "Sampel besar tidak menciptakan bias ke atas." },
            { text: "Rata-rata selalu lebih tinggi dari median", why: "Tidak selalu — hanya pada data miring kanan." },
          ],
        },
        {
          q: "Manakah pernyataan yang benar tentang CLT?",
          options: [
            { text: "CLT mengatakan data populasi menjadi normal jika n besar", why: "Yang menjadi normal adalah distribusi dari mean-mean sampel, bukan datanya." },
            { text: "CLT mengatakan distribusi sampling dari mean mendekati normal saat n besar, apapun bentuk populasinya", why: "Itulah keajaiban CLT — populasi boleh miring parah.", correct: true },
            { text: "CLT hanya berlaku jika populasi sudah normal", why: "Justru tidak perlu — itu poinnya." },
            { text: "CLT menghilangkan bias sampling", why: "CLT tidak memperbaiki bias — sampel bias dengan n besar tetap bias." },
          ],
        },
      ],
      note: {
        title: "Intuisi: n raksasa dengan bias adalah kesalahan yang presisi",
        body: "Lima heuristik. Satu: bias tidak hilang dengan n besar — ia justru menjadi semakin presisi dalam kesalahannya; survei 2,4 juta responden bisa kalah dari sampel 1.000 yang mewakili. Dua: tanya selalu “siapa yang tidak bisa masuk ke sampelku?” — frame yang tidak lengkap adalah lubang yang tidak terlihat dari dalam. Tiga: nonresponse adalah seleksi diam-diam — yang tidak menjawab berbeda secara sistematis dari yang menjawab; response rate rendah bukan masalah teknis, melainkan masalah keterwakilan. Empat: standard error mengukur variasi sampling, bukan bias — interval “52 persen plus-minus 3” yang presisi tetap salah bila sampelnya miring sejak awal. Lima: sampel yang baik adalah miniatur populasi, bukan kerumunan terbesar — keterwakilan mengalahkan ukuran, selalu; dan bila ragu, stratifikasi adalah cara termurah membeli keterwakilan. Enam: waspadai survivorship bias — yang sudah pergi (uninstall, tutup akun, bangkrut) tidak ada di sampelmu; kesimpulan dari yang bertahan hidup adalah cerita yang sudah disensor oleh kegagalan. Selalu curigai siapa yang hilang dari fotomu.",
      },
    },
  ],
};
