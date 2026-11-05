import type { V2Mission } from "../lib/types";

// ── MISI Sampel yang Menyanjung: bias estimasi ───────────────────────────
// M2 — Statistika Misi A (core). Dataset: Palmer penguins (CC0, Horst, Hill
// & Gorman 2020) via allisonhorst/palmerpenguins, dibekukan 2026-10-15.
// File: public/misi/misi-sampel-menyanjung/penguins.csv (344 baris) +
// sampel_stratifikasi.csv (120 baris, seed 42, proporsional per spesies).
// Metode + atribusi: METODE.md di folder yang sama.

const BASE = "/misi/misi-sampel-menyanjung";

export const misiSampelMenyanjung: V2Mission = {
  slug: "misi-sampel-menyanjung",
  track: "Statistika",
  module: "Misi",
  title: "Misi Sampel yang Menyanjung: Bias yang Terlihat Jujur",
  estMinutes: 130,
  role: "Auditor data independen",
  client:
    "Kurator Museum Sejarah Alam — angka “rata-rata panjang flipper penguin” akan dicetak di 10.000 brosur pameran Antartika",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Angka yang terlalu rapi untuk dipercaya",
      prose: [],
      tasks: [],
      briefing: {
        role: "Auditor data independen yang disewa kurator museum",
        client:
          "Kurator Museum Sejarah Alam. Untuk pameran “Antartika: Benua Terakhir”, museum menyewa konsultan lingkungan yang melaporkan satu angka kunci: rata-rata panjang flipper penguin Antartika = 191,2 mm. Angka itu akan dicetak di brosur, infografik dinding, dan panduan audio — 10.000 eksemplar. Kurator memintamu memverifikasi angka tersebut dari data mentah SEBELUM naik cetak: “Saya tidak mau museum memajang angka yang salah selama lima tahun.”",
        story: [
          "Senin pagi, 09:00. Di meja kurator ada draf brosur pameran: foto penguin Gentoo yang megah, dan di bawahnya teks besar — “Rata-rata panjang flipper penguin Antartika: 191 mm”. Konsultan yang disewa museum mengklaim angka itu dari “survei lapangan 51 ekor”. Kedengarannya ilmiah. Kedengarannya rapi. Dan justru itu yang membuat kurator gelisah.",
          "Kamu membuka lampiran laporan konsultan. Lima puluh satu ekor — semuanya spesies Adelie, semuanya dari satu pulau: Torgersen, pulau terdekat dari stasiun riset. Tidak ada Gentoo (yang flippersnya jauh lebih panjang), tidak ada Chinstrap, tidak ada pulau lain. “Survei lapangan” itu sebenarnya survei halaman belakang.",
          "Misi ini memakai data nyata: dataset Palmer penguins (344 penguin, tiga spesies, tiga pulau — CC0, terbuka untuk siapa pun). Tugasmu: hitung rata-rata populasi yang sebenarnya, ukur seberapa bias angka konsultan, tunjukkan dengan confidence interval bahwa biasnya bukan kebetulan, lalu tulis memo yang berani bilang “jangan cetak angka ini”.",
        ],
        objectives: [
          "Menghitung rata-rata panjang flipper populasi (data mentah Palmer penguins) dan rata-rata sampel convenience konsultan (Adelie, Pulau Torgersen).",
          "Mengukur bias estimasi (selisih mean sampel vs mean populasi) dan membangun confidence interval 95% untuk mean sampel.",
          "Membandingkan dengan sampel acak terstratifikasi (seed 42) dan menulis memo rekomendasi untuk kurator dengan bukti angka.",
        ],
        prereqSummary:
          "Bias estimasi = selisih sistematis antara rata-rata sampel dan rata-rata populasi yang ingin diukur; ia muncul ketika sampel tidak mewakili populasi (misalnya hanya satu spesies dari satu pulau). Confidence interval 95% untuk mean adalah rentang “mean sampel ± 1,96 × galat baku” — kalau mean populasi jatuh DI LUAR rentang itu, sampelmu hampir pasti bias, bukan sekadar sial. Sampling terstratifikasi (acak di dalam tiap kelompok, proporsional dengan ukuran kelompok) adalah obat standarnya.",
        datasetNote:
          "Sumber: Palmer penguins — Horst, Hill & Gorman (2020), via repo allisonhorst/palmerpenguins di GitHub. Lisensi CC0 (domain publik, bebas dipakai dengan atribusi).\nFile penguins.csv: 344 baris (342 dengan flipper_length_mm valid), kolom species, island, bill_length_mm, bill_depth_mm, flipper_length_mm, body_mass_g, sex, year.\nFile sampel_stratifikasi.csv: 120 baris, sampel acak terstratifikasi proporsional per spesies (Adelie 53, Gentoo 43, Chinstrap 24), seed 42 — DIBUAT untuk misi ini sebagai pembanding jujur.\nKejujuran: beberapa baris punya nilai hilang (NA) — itu kondisi data nyata, bukan jebakan; baris NA dikeluarkan dari perhitungan mean. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, tiga cara memandang penguin",
      prose: [
        "`penguins.csv` adalah kebenaran mentah: 344 penguin dari tiga spesies (Adelie, Chinstrap, Gentoo) di tiga pulau (Biscoe, Dream, Torgersen), diukur 2007–2009 di Palmer Station, Antartika. Kolom kuncimu: `flipper_length_mm`. Perhatikan: 2 baris tidak punya nilai flipper — data lapangan memang begitu.",
        "`sampel_stratifikasi.csv` adalah pembanding yang jujur: 120 penguin diambil acak DENGAN stratifikasi — tiap spesies terwakili proporsional dengan populasinya, seed 42 sehingga siapa pun mendapat sampel yang sama. Inilah “seharusnya” yang akan kamu bandingkan dengan “kenyataannya” milik konsultan.",
        "Aturan main: (1) mean populasi dihitung dari SEMUA baris valid di `penguins.csv`; (2) sampel konsultan = baris dengan species Adelie DAN island Torgersen — definisi persisnya ada di lampiran laporannya; (3) bias = mean sampel − mean populasi; (4) vonis “bias sistematis vs kebetulan” diputus oleh confidence interval, bukan perasaan.",
      ],
      tasks: [
        { id: "t1", text: "Buka `penguins.csv`: catat jumlah baris dan sebaran species × island" },
        { id: "t2", text: "Buka `sampel_stratifikasi.csv`: verifikasi n=120 dan komposisi per spesies" },
      ],
      note: {
        title: "Miskonsepsi #1: rata-rata sampel = rata-rata populasi",
        type: "pitfall",
        body: "“Kami mengukur 51 penguin dan rata-ratanya 191,2 mm — jadi rata-rata penguin Antartika 191,2 mm.” SALAH — dan ini kesalahan paling mahal dalam statistika terapan. Rata-rata sampel hanya sama dengan rata-rata populasi bila sampelnya MEWAKILI populasi. Lima puluh satu Adelie dari satu pulau tidak mewakili tiga spesies di tiga pulau, sama seperti mengukur tinggi 51 pemain basket lalu mengklaim itu “rata-rata tinggi manusia”.",
      },
      reference:
        "penguins.csv (344 baris, mentah, CC0) vs sampel_stratifikasi.csv (120 baris, seed 42) vs definisi sampel konsultan (Adelie × Torgersen). Bias diukur dari yang mentah; vonis untuk angka konsultan.",
    },
    {
      id: "lab-python",
      eyebrow: "Langkah 3 · Lab 1 — Seberapa bias angka konsultan?",
      title: "Ukur biasnya, jangan cuma curiga",
      prose: [
        "Kecurigaan bukan bukti. Sekarang hitung: (1) mean populasi dari 342 baris valid; (2) mean sampel konsultan (Adelie, Torgersen) — harusnya keluar 191,20 persis seperti laporannya, yang sekaligus membuktikan kamu mereplikasi metodenya; (3) bias = mean sampel − mean populasi; (4) confidence interval 95% untuk mean sampel; (5) apakah mean populasi jatuh di dalam CI itu?",
        "Lalu muat `sampel_stratifikasi.csv`, hitung mean dan CI-nya, dan jawab pertanyaan yang sama. Dua sampel, dua cerita — dan hanya satu yang jujur.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris`, `n_pop` (flipper valid), `mean_pop`" },
        { id: "t2", text: "Subset konsultan (Adelie & Torgersen): `n_kon`, `mean_kon`, `bias`" },
        { id: "t3", text: "CI 95% kedua sampel; cek apakah `mean_pop` di dalamnya" },
      ],
      expected:
        "n_baris=344, mean_pop=200,92, mean_kon=191,20, bias=−9,72, CI konsultan [189,49, 192,91] — mean populasi 200,92 DI LUAR (bias sistematis, bukan kebetulan); mean_strat=200,46, CI [197,96, 202,96] — populasi DI DALAM",
      formula: String.raw`\text{CI}_{95\%} = \bar{x} \pm 1{,}96 \cdot \frac{s}{\sqrt{n}}`,
      formulaNote:
        "x̄ = mean sampel, s = simpangan baku sampel, n = ukuran sampel. s/√n adalah galat baku (standard error): semakin besar n, semakin sempit CI. 1,96 adalah nilai-z untuk 95%. Kalau mean populasi jatuh di luar rentang ini, peluang sampel “sebias ini” terjadi secara kebetulan di bawah 5% — vonis: bias sistematis.",
      note: {
        title: "Miskonsepsi #2: confidence interval soal penguin individual",
        type: "pitfall",
        body: "“CI 95% [189, 193] artinya 95% penguin punya flipper 189–193 mm.” SALAH. CI adalah pernyataan tentang MEAN, bukan tentang individu: “kita 95% yakin mean populasi (yang tidak kita ketahui) ada di rentang ini — DENGAN ASUMSI sampelnya acak dan mewakili.” Sampel bias merusak asumsi itu: CI konsultan sempit dan rapi, tapi mean populasi 200,92 bahkan tidak masuk ke dalamnya. Presisi tanpa keterwakilan = keyakinan yang salah tempat.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))` — kolom berisi NA di file ini.",
        "Baris valid: `df.dropna(subset=[\"flipper_length_mm\"])` — 2 baris hilang.",
        "Subset konsultan: `(df.species==\"Adelie\") & (df.island==\"Torgersen\")` — harus dapat n=51.",
        "Galat baku: `s / math.sqrt(n)` dengan s = stddev sampel (ddof=1, default pandas).",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd, math",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-sampel-menyanjung/penguins.csv\"",
          "URL_STRAT = \"/misi/misi-sampel-menyanjung/sampel_stratifikasi.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "n_baris = ...",
          "pop = ...   # hanya baris dengan flipper_length_mm valid",
          "n_pop = ...",
          "mean_pop = ...",
          "",
          "kon = ...   # species Adelie DAN island Torgersen, flipper valid",
          "n_kon = ...",
          "mean_kon = ...",
          "bias = ...   # mean_kon - mean_pop",
          "",
          "se_kon = ...",
          "ci_kon_lo = ...",
          "ci_kon_hi = ...",
          "pop_dalam_ci_kon = ...   # True/False: mean_pop di dalam [lo, hi]?",
          "",
          "strat = pd.read_csv(open_url(URL_STRAT))",
          "mean_strat = ...",
          "se_strat = ...",
          "ci_strat_lo = ...",
          "ci_strat_hi = ...",
          "pop_dalam_ci_strat = ...",
          "",
          "print(\"populasi: n=\", n_pop, \"mean=\", round(mean_pop, 2))",
          "print(\"konsultan: n=\", n_kon, \"mean=\", round(mean_kon, 2), \"bias=\", round(bias, 2))",
          "print(\"CI konsultan: [\", round(ci_kon_lo, 2), \",\", round(ci_kon_hi, 2), \"] -> pop di dalam?\", pop_dalam_ci_kon)",
          "print(\"stratifikasi: mean=\", round(mean_strat, 2))",
          "print(\"CI strat: [\", round(ci_strat_lo, 2), \",\", round(ci_strat_hi, 2), \"] -> pop di dalam?\", pop_dalam_ci_strat)",
        ].join("\n"),
        lockLines: 6,
        solution: [
          "import pandas as pd, math",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-sampel-menyanjung/penguins.csv\"",
          "URL_STRAT = \"/misi/misi-sampel-menyanjung/sampel_stratifikasi.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "n_baris = len(df)",
          "pop = df.dropna(subset=[\"flipper_length_mm\"])",
          "n_pop = len(pop)",
          "mean_pop = float(pop[\"flipper_length_mm\"].mean())",
          "",
          "kon = pop[(pop[\"species\"]==\"Adelie\") & (pop[\"island\"]==\"Torgersen\")]",
          "n_kon = len(kon)",
          "mean_kon = float(kon[\"flipper_length_mm\"].mean())",
          "bias = mean_kon - mean_pop",
          "",
          "se_kon = float(kon[\"flipper_length_mm\"].std()) / math.sqrt(n_kon)",
          "ci_kon_lo = mean_kon - 1.96 * se_kon",
          "ci_kon_hi = mean_kon + 1.96 * se_kon",
          "pop_dalam_ci_kon = ci_kon_lo < mean_pop < ci_kon_hi",
          "",
          "strat = pd.read_csv(open_url(URL_STRAT))",
          "mean_strat = float(strat[\"flipper_length_mm\"].mean())",
          "se_strat = float(strat[\"flipper_length_mm\"].std()) / math.sqrt(len(strat))",
          "ci_strat_lo = mean_strat - 1.96 * se_strat",
          "ci_strat_hi = mean_strat + 1.96 * se_strat",
          "pop_dalam_ci_strat = ci_strat_lo < mean_pop < ci_strat_hi",
          "",
          "print(\"populasi: n=\", n_pop, \"mean=\", round(mean_pop, 2))",
          "print(\"konsultan: n=\", n_kon, \"mean=\", round(mean_kon, 2), \"bias=\", round(bias, 2))",
          "print(\"CI konsultan: [\", round(ci_kon_lo, 2), \",\", round(ci_kon_hi, 2), \"] -> pop di dalam?\", pop_dalam_ci_kon)",
          "print(\"stratifikasi: mean=\", round(mean_strat, 2))",
          "print(\"CI strat: [\", round(ci_strat_lo, 2), \",\", round(ci_strat_hi, 2), \"] -> pop di dalam?\", pop_dalam_ci_strat)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari penguins.csv." },
          { kind: "equal", task: "t1", label: "`n_baris` = 344", name: "n_baris", value: 344, msg: "File punya 344 baris (termasuk 2 baris tanpa flipper)." },
          { kind: "equal", task: "t1", label: "`mean_pop` ≈ 200,92", name: "mean_pop", value: 200.9152, tol: 0.01, msg: "Mean dari 342 baris dengan flipper valid — bukan dari 344." },
          { kind: "equal", task: "t2", label: "`n_kon` = 51", name: "n_kon", value: 51, msg: "Adelie × Torgersen dengan flipper valid = 51 ekor." },
          { kind: "equal", task: "t2", label: "`mean_kon` ≈ 191,20", name: "mean_kon", value: 191.1961, tol: 0.01, msg: "Harus sama persis dengan angka laporan konsultan (191,2) — itu bukti replikasimu benar." },
          { kind: "equal", task: "t2", label: "`bias` ≈ −9,72", name: "bias", value: -9.7191, tol: 0.01, msg: "bias = mean_kon − mean_pop. Negatif = konsultan MENGECILKAN." },
          { kind: "equal", task: "t3", label: "CI bawah ≈ 189,49", name: "ci_kon_lo", value: 189.4856, tol: 0.05, msg: "mean − 1,96 × s/√n." },
          { kind: "equal", task: "t3", label: "CI atas ≈ 192,91", name: "ci_kon_hi", value: 192.9065, tol: 0.05, msg: "mean + 1,96 × s/√n." },
          { kind: "equal", task: "t3", label: "populasi DI LUAR CI konsultan", name: "pop_dalam_ci_kon", value: false, msg: "200,92 tidak masuk [189,49, 192,91] → bias sistematis, bukan kebetulan." },
          { kind: "equal", task: "t3", label: "`mean_strat` ≈ 200,46", name: "mean_strat", value: 200.4583, tol: 0.01, msg: "Sampel terstratifikasi (seed 42) jauh lebih dekat ke populasi." },
          { kind: "equal", task: "t3", label: "populasi DI DALAM CI stratifikasi", name: "pop_dalam_ci_strat", value: true, msg: "CI [197,96, 202,96] memuat 200,92 — begini rupa sampel yang jujur." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Satu kelompok tidak mewakili semua",
      title: "Urutkan, dan lihat jurangnya",
      prose: [
        "Kenapa sampel satu-spesies-satu-pulau bisa meleset hampir 10 mm? Karena populasinya HETEROGEN: Gentoo di Biscoe rata-rata 217 mm — 28 mm lebih panjang dari Adelie di pulau yang sama. Di tabel ringkasan ini (5 kelompok species × island), urutkan dari mean terkecil dan lihat sendiri seberapa jauh jarak antar kelompok.",
        "Tabel `flipper_per_kelompok(spesies TEXT, pulau TEXT, n INT, mean_flipper REAL)` — angka agregat nyata dari Lab 1. Tampilkan semua kolom, urut dari `mean_flipper` terkecil.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query: semua kelompok, urut mean_flipper menaik" },
      ],
      expected: "5 baris — Adelie/Biscoe 188,80 paling kecil, Gentoo/Biscoe 217,19 paling besar; rentang 28,39 mm",
      sqlLab: {
        task: "Tampilkan spesies, pulau, n, dan mean_flipper untuk SEMUA kelompok, diurut dari mean_flipper TERKECIL. (Petunjuk: ORDER BY mean_flipper — tanpa ASC/DESC tambahan berarti menaik.)",
        schema: "CREATE TABLE flipper_per_kelompok (spesies TEXT, pulau TEXT, n INT, mean_flipper REAL);",
        seedData: [
          "INSERT INTO flipper_per_kelompok VALUES",
          "('Adelie','Biscoe',44,188.7955),",
          "('Adelie','Dream',56,189.7321),",
          "('Adelie','Torgersen',51,191.1961),",
          "('Chinstrap','Dream',68,195.8235),",
          "('Gentoo','Biscoe',123,217.1870);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT spesies, pulau, n, mean_flipper\nFROM flipper_per_kelompok\n",
        solution: [
          "SELECT spesies, pulau, n, mean_flipper",
          "FROM flipper_per_kelompok",
          "ORDER BY mean_flipper;",
        ].join("\n"),
        expectedColumns: ["spesies", "pulau", "n", "mean_flipper"],
        expectedRows: [
          ["Adelie", "Biscoe", 44, 188.7955],
          ["Adelie", "Dream", 56, 189.7321],
          ["Adelie", "Torgersen", 51, 191.1961],
          ["Chinstrap", "Dream", 68, 195.8235],
          ["Gentoo", "Biscoe", 123, 217.1870],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiSampelMenyanjung;

// ── lanjutan misiSampelMenyanjung: langkah 5–10 ───────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_SAMPEL: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Brosur naik cetak minggu depan — keputusanmu?",
    prose: [
      "Buktinya lengkap: bias −9,72 mm, CI konsultan tidak memuat mean populasi, dan tabel kelompok menunjukkan satu spesies tidak bisa mewakili tiga spesies. Kurator menunggumu di ruangannya: “Jadi, angka 191 mm ini kita apakan?” Tiap opsi mengubah apa yang terjadi pada museum — dan pada reputasimu sebagai auditor.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke kurator atas angka “191 mm” milik konsultan? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-cetak",
          label: "Cetak saja — 51 ekor sudah “cukup ilmiah”",
          rationale:
            "Angkanya dihitung dengan benar dari 51 pengukuran nyata, dan brosur harus naik cetak minggu depan. Menunda pameran merugikan museum.",
          nextStepId: "temuan-cetak",
          consequenceNote:
            "Brosur dicetak 10.000 eksemplar. Tiga bulan kemudian seorang ornitolog menulis surat pembaca: “Museum memajang angka Adelie sebagai rata-rata SEMUA penguin.” Museum menarik brosur — biaya cetak ulang + permintaan maaf publik. Kamu tercatat sebagai auditor yang meloloskan angka bias.",
        },
        {
          id: "opt-tolak",
          label: "Tolak angka; minta survei ulang terstratifikasi",
          rationale:
            "Sampel convenience tidak bisa diperbaiki dengan retorika — hanya dengan data baru yang mewakili. Integritas angka museum di atas jadwal cetak.",
          nextStepId: "temuan-tolak",
          consequenceNote:
            "Kurator menunda cetak dua minggu. Survei ulang terstratifikasi (n=120, tiga spesies) menghasilkan 200,5 mm — brosur terbit dengan angka yang bertahan dari kritik ahli. Konsultan tidak dipakai lagi; kamu dipakai lagi.",
        },
        {
          id: "opt-batasi",
          label: "Cetak dengan label jujur: “Adelie, Pulau Torgersen”",
          rationale:
            "Datanya valid untuk APA yang diukurnya — yang salah hanya klaim generalisasinya. Batasi klaim, jangan buang datanya.",
          nextStepId: "temuan-batasi",
          consequenceNote:
            "Brosur terbit tepat waktu dengan teks “Rata-rata flipper penguin Adelie di Pulau Torgersen: 191 mm”. Seorang jurnalis sains memuji kejujuran metodologinya — tapi di media sosial, tangkapan layar tanpa konteks tetap menyebar sebagai “rata-rata penguin”. Kamu belajar: label jujur membantu, tapi tidak mengendalikan cara orang mengutip.",
        },
      ],
    },
  },
  {
    id: "temuan-cetak",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: cetak apa adanya",
    prose: [
      "Brosur naik cetak tepat waktu — dan tepat tiga bulan kemudian datang surat pembaca dari seorang ornitolog: “Angka 191 mm di brosur Anda adalah rata-rata Adelie satu pulau, bukan rata-rata penguin Antartika. Gentoo yang terpampang di foto sampul brosur Anda rata-rata 217 mm.” Museum menarik 10.000 brosur. Biaya cetak ulang, permintaan maaf publik, dan satu baris di CV-mu: auditor yang meloloskan angka bias.",
      "Pelajaran termahalnya: “n sudah cukup besar” tidak pernah menjawab pertanyaan “apakah sampelnya mewakili?”. Lima puluh satu pengukuran yang presisi dari populasi yang salah tetap salah — hanya salah dengan rapi.",
    ],
    tasks: [],
    note: {
      title: "Presisi bukan keterwakilan",
      body: "CI konsultan sempit ([189, 193]) — pengukurannya PRESISI. Tapi presisi mengukur konsistensi internal, bukan kebenaran eksternal. Jam yang mati pun tepat dua kali sehari. Di memo-mu, jangan pernah biarkan “n besar” atau “CI sempit” dipakai sebagai bukti keterwakilan.",
    },
  },
  {
    id: "temuan-tolak",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: tolak dan survei ulang",
    prose: [
      "Kurator menghela napas — lalu menunda cetak dua minggu. Survei ulang terstratifikasi (120 ekor, tiga spesies proporsional) menghasilkan 200,5 mm dengan CI [198, 203]. Brosur terbit terlambat dua minggu, tapi ketika ornitolog yang sama membaca brosur barunya, ia mengangguk: “Akhirnya ada museum yang sampling-nya benar.”",
      "Konsultan lama tidak dipakai lagi. Kamu — dipakai lagi, untuk pameran berikutnya. Penundaan dua minggu terbayar dengan lima tahun brosur yang tidak perlu ditarik.",
    ],
    tasks: [],
    note: {
      title: "Menolak juga keputusan — dan butuh alternatif",
      body: "“Jangan pakai angka ini” tanpa “pakai angka ini sebagai gantinya” hanyalah keluhan. Kekuatan opsimu ada pada sampel stratifikasi yang SUDAH kamu hitung di Lab 1: 200,46 mm. Auditor yang baik selalu datang dengan angka pengganti, bukan cuma kritik.",
    },
  },
  {
    id: "temuan-batasi",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: cetak dengan label jujur",
    prose: [
      "Brosur terbit tepat waktu: “Rata-rata panjang flipper penguin Adelie di Pulau Torgersen: 191 mm.” Seorang jurnalis sains bahkan memuji transparansi metodologinya di kolomnya. Kemenangan? Sebagian. Seminggu kemudian tangkapan layar brosur — tanpa konteks kalimat lengkapnya — viral sebagai “ternyata rata-rata flipper penguin cuma 191 mm”.",
      "Pelajaran yang tidak nyaman: kamu bisa mengontrol apa yang kamu tulis, tapi tidak bisa mengontrol apa yang orang kutip. Label jujur adalah kewajiban minimum — bukan perlindungan penuh. Itulah kenapa opsi “tolak dan survei ulang” tetap yang terkuat secara ilmiah.",
    ],
    tasks: [],
    note: {
      title: "Kejujuran label vs pengendalian kutipan",
      body: "Membatasi klaim (“hanya Adelie Torgersen”) memperbaiki KEJUJURAN dokumen, tapi angka 191 mm tetap hidup di luar konteks. Dalam pekerjaan nyata, tanyakan: “kalau angka ini dikutip tanpa paragraf penjelasnya, masih amankah?” Kalau tidak — angkanya belum siap terbit.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 14 baris: laporan konsultan yang “ilmiah” itu",
    prose: [
      "Sebelum menulis memo, satu misi audit. Di bawah ini 14 baris “Kutipan Laporan Survei Flipper — PT Citra Ekodata”, dokumen yang menjadi dasar angka 191 mm di brosur. Seseorang menyuntikkan 4 manipulasi ke dalamnya. Senjatamu: bias −9,72 mm, CI [189,49, 192,91], dan tabel 5 kelompok dari lab-mu.",
      "Cari yang tidak konsisten dengan data mentah — angka tidak bisa berbohong dua kali.",
    ],
    tasks: [],
    auditDossier: {
      version: "sampel-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai kutipan Laporan Survei Flipper Penguin PT Citra Ekodata yang menjadi dasar angka brosur museum.",
      columns: ["Klaim", "Nilai", "Status"],
      rows: [
        { rowId: 1, cells: { "Klaim": "Judul survei", "Nilai": "Survei Panjang Flipper Penguin Antartika", "Status": "Terverifikasi" }, claims: [{ label: "Judul", value: "Penguin Antartika (umum)" }] },
        { rowId: 2, cells: { "Klaim": "Metode sampling", "Nilai": "Sampel acak", "Status": "Terverifikasi" }, claims: [{ label: "Metode", value: "acak" }] },
        { rowId: 3, cells: { "Klaim": "Lokasi", "Nilai": "Pulau Torgersen (stasiun terdekat)", "Status": "Terverifikasi" }, claims: [{ label: "Lokasi", value: "satu pulau" }] },
        { rowId: 4, cells: { "Klaim": "Spesies tercakup", "Nilai": "Adelie", "Status": "Terverifikasi" }, claims: [{ label: "Spesies", value: "1 dari 3" }] },
        { rowId: 5, cells: { "Klaim": "Ukuran sampel", "Nilai": "n = 56 pengukuran valid", "Status": "Terverifikasi" }, claims: [{ label: "n", value: "56" }] },
        { rowId: 6, cells: { "Klaim": "Rata-rata flipper", "Nilai": "191,2 mm", "Status": "Terverifikasi" }, claims: [{ label: "Mean", value: "191,2" }] },
        { rowId: 7, cells: { "Klaim": "Simpangan baku", "Nilai": "6,2 mm", "Status": "Terverifikasi" }, claims: [{ label: "SD", value: "6,2" }] },
        { rowId: 8, cells: { "Klaim": "Margin of error (95%)", "Nilai": "±1,0 mm", "Status": "Terverifikasi" }, claims: [{ label: "ME", value: "±1,0" }] },
        { rowId: 9, cells: { "Klaim": "Generalisasi", "Nilai": "Berlaku untuk seluruh penguin Antartika", "Status": "Terverifikasi" }, claims: [{ label: "Generalisasi", value: "semua penguin" }] },
        { rowId: 10, cells: { "Klaim": "Perbandingan", "Nilai": "Konsisten dengan literatur (190–192 mm)", "Status": "Terverifikasi" }, claims: [{ label: "Literatur", value: "190–192" }] },
        { rowId: 11, cells: { "Klaim": "Data hilang", "Nilai": "Tidak ada", "Status": "Terverifikasi" }, claims: [{ label: "Missing", value: "0" }] },
        { rowId: 12, cells: { "Klaim": "Rekomendasi", "Nilai": "Angka layak cetak untuk brosur", "Status": "Terverifikasi" }, claims: [{ label: "Rekomendasi", value: "layak cetak" }] },
        { rowId: 13, cells: { "Klaim": "Catatan lapangan", "Nilai": "Cuaca buruk 2 hari — pengukuran tetap jalan", "Status": "Arsip" }, claims: [{ label: "Catatan", value: "arsip" }] },
        { rowId: 14, cells: { "Klaim": "Tanda tangan", "Nilai": "Tim survei, 2026-10-01", "Status": "Arsip" }, claims: [{ label: "Ttd", value: "ada" }] },
      ],
      injections: [
        { key: "acak-palsu", rowIds: [2, 3], title: "“Sampel acak” yang sebenarnya convenience", clue: "Baris 2 mengklaim “sampel acak”, tapi baris 3 jujur: semuanya dari Pulau Torgersen — pulau terdekat stasiun, dipilih karena mudah, bukan karena acak. Itu definisi convenience sampling.", danger: "Label “acak” adalah stempel legitimasi: sekali dipercaya, tidak ada yang memeriksa keterwakilan lagi. Di pekerjaan nyata, selalu tanya: acak DARI populasi apa, dengan kerangka sampling apa?" },
        { key: "n-digelembungkan", rowIds: [5, 11], title: "n digelembungkan: 56 vs 51", clue: "Laporan mengklaim n=56 “pengukuran valid” dan “tidak ada data hilang” (baris 11). Data mentah: Adelie × Torgersen hanya 51 baris dengan flipper valid. Lima “pengukuran” tidak bisa ditemukan di file mentah.", danger: "n yang digelembungkan mengecilkan galat baku semu dan membuat CI terlihat lebih meyakinkan. Verifikasi n dari data mentah adalah audit termurah yang ada." },
        { key: "me-salah", rowIds: [8], title: "Margin of error yang mustahil", clue: "ME diklaim ±1,0 mm. Hitung sendiri: 1,96 × 6,2 / √51 = ±1,7 mm. Bahkan dengan n palsu 56 pun ME-nya ±1,6 mm — angka ±1,0 tidak bisa dihasilkan dari data ini dengan rumus mana pun.", danger: "ME adalah janji presisi. Janji yang tidak bisa dipertahankan rumusnya adalah janji kosong — dan pembaca brosur tidak akan pernah menghitung ulang." },
        { key: "generalisasi-liar", rowIds: [1, 4, 9, 10], title: "Generalisasi liar: Adelie = semua penguin", clue: "Judul bilang “Penguin Antartika” (baris 1), datanya hanya Adelie (baris 4), kesimpulannya “berlaku untuk seluruh penguin Antartika” (baris 9). Padahal Gentoo rata-rata 217 mm — 26 mm di atas angka brosur. “Konsisten dengan literatur 190–192 mm” (baris 10) hanya konsisten dengan literatur ADELIE.", danger: "Generalisasi adalah bias yang paling sulit dideteksi karena ia bersembunyi di JUDUL, bukan di angka. Angka 191,2-nya benar; kalimat yang mengantarnya yang bohong." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo audit untuk kurator",
    prose: [
      "Semua bukti di tangan. Tulis memo audit satu halaman untuk kurator — artefak portofoliomu. Memo yang baik tidak hanya bilang “jangan cetak”, tapi menunjukkan ANGKA biasnya, manipulasi apa yang ada di laporan konsultan, dan angka pengganti yang bisa dipakai.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): angka konsultan, bias terukur vs populasi, rekomendasi (cetak/tolak/batasi + alasan satu kalimat).",
        "Bukti kuantitatif: mean populasi 200,92 (n=342), mean konsultan 191,20 (n=51), bias −9,72 mm, CI 95% [189,49, 192,91] yang tidak memuat mean populasi; hasil sampel terstratifikasi sebagai pembanding (200,46; CI memuat populasi).",
        "Temuan audit laporan: manipulasi apa yang kamu temukan, baris per baris (nomor baris dossier).",
        "Angka pengganti: nilai yang kamu rekomendasikan untuk brosur + cara sampling yang benar bila museum mau survei sendiri.",
        "Batas & risiko sisa: apa yang TIDAK dicakup audit ini (mis. dataset 2007–2009 — populasi bisa berubah; tiga pulau bukan seluruh Antartika).",
      ],
      rubric: [
        { criterion: "Kebenaran angka", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "200,92 vs 191,20, bias −9,72, CI [189,49, 192,91] — semua tepat"] },
        { criterion: "Deteksi manipulasi", weight: 25, levels: ["Tidak menyebut manipulasi", "Menyebut sebagian tanpa nomor baris", "Keempat manipulasi disebut dengan nomor baris dossier"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa alasan/angka pengganti", "Ada rekomendasi, alasan kabur", "Rekomendasi + angka pengganti + alasan metodologis eksplisit"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim audit membuktikan segalanya", "Menyebut sebagian batas", "Batas (data 2007–2009; 3 pulau ≠ Antartika) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat manipulasi di laporan konsultan:",
      "1) **“Sampel acak” palsu** (baris 2–3): convenience sampling berlabel acak. Lokasi dipilih karena dekat stasiun, bukan karena acak. Stempel “acak” mematikan semua pertanyaan lanjutan — padahal pertanyaan “acak dari mana?” adalah pertanyaan terpenting.",
      "2) **n digelembungkan** (baris 5, 11): 56 diklaim, 51 terbukti. Lima pengukuran hantu mengecilkan galat baku semu. Audit termurah di dunia: hitung n dari file mentah.",
      "3) **Margin of error mustahil** (baris 8): ±1,0 mm tidak bisa dihasilkan dari rumus mana pun dengan data ini (yang benar ±1,7 mm). Janji presisi yang tidak bisa dipertahankan rumusnya = janji kosong.",
      "4) **Generalisasi liar** (baris 1, 4, 9, 10): judul bilang “Penguin Antartika”, datanya Adelie, kesimpulannya “berlaku untuk semua”. Angkanya benar; kalimat pengantarnya yang bohong. Ini bias yang bersembunyi di judul, bukan di tabel.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel “ilmiah”. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — bahkan “tolak dan survei ulang” membayar dengan dua minggu keterlambatan. Bedanya: itu harga yang terlihat dan jujur, bukan harga yang disembunyikan.",
      "Bahaya nyata terakhir: angka bias yang tercetak tidak mati di brosur. Ia dikutip jurnalis, masuk Wikipedia, jadi “fakta umum” — dan mengoreksinya sepuluh tahun kemudian nyaris mustahil. Satu audit sebelum cetak lebih murah dari satu dekade misinformasi.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: bias kecil tidak masalah",
      type: "risk",
      body: "“Hanya” 9,7 mm dari 200 mm — sekitar 5%. Kecil? Untuk brosur museum, mungkin. Untuk dosis obat, polling pemilu, atau ambang regulasi, 5% bias sistematis adalah bencana. Bahaya bias bukan pada besarnya, melainkan pada arahnya yang KONSISTEN: ia tidak saling meniadakan seperti galat acak — ia menumpuk ke satu sisi, setiap kali.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Bias = mean sampel − mean populasi. Sampel convenience konsultan (Adelie × Torgersen, n=51): mean 191,20 vs populasi 200,92 → bias −9,72 mm.",
      "CI 95% konsultan [189,49, 192,91] TIDAK memuat mean populasi → bias sistematis, bukan kebetulan. Sampel terstratifikasi (n=120, seed 42): mean 200,46, CI memuat populasi.",
      "Presisi (CI sempit, n besar) tidak sama dengan keterwakilan. Jam mati pun tepat dua kali sehari.",
      "Empat pola manipulasi laporan: label “acak” palsu, n digelembungkan, margin of error mustahil, generalisasi liar di judul.",
      "Keputusan atas angka bias selalu punya harga: cetak (reputasi), tolak+survei ulang (waktu), batasi klaim (kutipan liar). Auditor yang baik datang dengan angka pengganti.",
      "Data: Palmer penguins (Horst, Hill & Gorman 2020), CC0 via allisonhorst/palmerpenguins, dibekukan 2026-10-15; 342 baris valid dari 344.",
    ],
  },
];

(misiSampelMenyanjung.steps as V2Step[]).push(...LANJUTAN_SAMPEL);
