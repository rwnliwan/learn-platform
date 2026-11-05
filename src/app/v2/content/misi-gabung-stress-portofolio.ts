import type { V2Mission } from "../lib/types";

// ── MISI Portofolio Terbakar: Stress Test di Tengah Badai ───────────────
// CAPSTONE C (kombinasi) — Market Risk. Dataset: seri pasar SINTETIS seed 42
// (meniru pola FRED SP500 + DGS10 2020 — BUKAN data FRED asli, lihat
// METODE.md) + holdings.csv sintetis (40 posisi). File:
// public/misi/misi-gabung-stress-portofolio/{sp500,dgs10,holdings}.csv.

const BASE = "/misi/misi-gabung-stress-portofolio";

export const misiGabungStressPortofolio: V2Mission = {
  slug: "misi-gabung-stress-portofolio",
  track: "Market Risk",
  module: "Misi",
  title: "Misi Portofolio Terbakar: Stress Test di Tengah Badai",
  estMinutes: 190,
  role: "Analis risiko pasar",
  client:
    "Komite Risiko — portofolio multi-aset bank senilai Rp 1 triliun harus lolos stress test independen sebelum limit baru disetujui",
  xp: 750,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Komite tidak percaya angka yang terlalu rapi",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis risiko pasar di sebuah bank — validator independen",
        client:
          "Komite Risiko. Desk perdagangan mengajukan kenaikan limit untuk portofolio multi-aset (ekuitas 55%, obligasi 40%, kas 5%) senilai Rp 1 triliun, bermodalkan memo internal yang menyimpulkan “semua aman”. Komite mencium sesuatu: memo itu hanya menampilkan skenario yang lolos. Kamu diminta menjalankan stress test independen — tiga skenario, angka mentah, tanpa sensor — dan menulis memo tandingan yang berani bilang “portofolio ini terbakar” kalau memang terbakar.",
        story: [
          "Kamis, 09:00. Ruang komite dingin seperti biasa, tapi suasananya panas. Di layar: memo satu halaman dari Desk Risiko Pasar — tabel skenario stress, semua berlabel hijau “AMAN”. Seorang anggota komite mengetuk-ngetukkan pulpen. “Tiga skenario, nol breach, di tahun ketika pasar sempat jatuh 35% dalam sebulan? Saya tidak membeli cerita ini.”",
          "Kamu tahu polanya dari misi-misi sebelumnya: laporan yang terlalu rapi biasanya bukan laporan yang jujur. Stress test yang sehat MENEMUKAN luka — itu gunanya. Stress test yang tidak menemukan apa-apa berarti skenarionya yang tumpul, atau lukanya yang disembunyikan.",
          "Senjatamu: deret pasar harian 2020 (termasuk crash Maret), 40 posisi portofolio dengan bobot, beta, durasi, dan haircut likuiditasnya, plus tiga skenario yang tidak bisa dinegosiasikan: crash ekuitas −30%, spike yield +150bps, dan gabungan keduanya di tengah pasar yang membeku. Di ujung jalan ada dossier 16 baris berisi memo “semua aman” versi desk — dengan 4 suntikan di dalamnya.",
        ],
        objectives: [
          "Menghitung imbal hasil harian portofolio dari bobot, beta, dan durasi tiap posisi, lalu mengukur volatilitas dan hari terburuknya.",
          "Menerapkan tiga skenario stress (crash −30%, yield +150bps, gabungan + haircut likuiditas), menghitung kerugian tiap skenario dalam % NAV dan rupiah, dan menilai breach terhadap limit 10% NAV.",
          "Menemukan minimal 3 dari 4 suntikan di memo desk dan menulis memo stress test untuk komite dengan rekomendasi yang dipertahankan.",
        ],
        prereqSummary:
          "Stress test = menanyakan “bagaimana jika pasar diguncang?” lalu mengukur kerugiannya — bukan meramal, melainkan mengukur ketahanan. Tiga mesinnya: (1) imbal hasil portofolio = rata-rata berbobot imbal tiap posisi; (2) skenario = guncangan hipotetis yang diterapkan ke posisi (ekuitas jatuh, yield naik); (3) limit = ambang kerugian maksimum yang diizinkan komite (di sini 10% NAV). Haircut likuiditas = diskon paksa saat menjual di pasar yang membeku — kerugian yang tidak terlihat di hari tenang.",
        datasetNote:
          "Deret pasar SINTETIS (generator Python, seed 42) yang meniru POLA FRED 2020: SP500 harian (puncak Feb → crash Maret ≈ −35% → rebound → akhir tahun) dan DGS10 harian (1,88 → 0,50 → 0,83). BUKAN data FRED asli — kejujuran dulu: angka ini dibuat agar misi berjalan deterministik dan offline.\nSlice: 2020-01-02 s.d. 2020-12-31 → 253 hari perdagangan (sp500.csv: tanggal,sp500,ret_sp500_pct; dgs10.csv: tanggal,yield_pct).\nholdings.csv = 40 posisi sintetis (id,kelas,bobot,beta_sp500,durasi,haircut_pct): ekuitas 55%, obligasi 40%, kas 5%.\nNAV = Rp 1 triliun; limit stress komite = 10% NAV (Rp 100 miliar). Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, satu portofolio",
      prose: [
        "`sp500.csv` adalah mesin ekuitasmu: 253 baris harga dan imbal hasil harian, termasuk Maret 2020 — bulan ketika indeks jatuh lebih dari sepertiga dari puncaknya dalam hitungan minggu. `dgs10.csv` adalah mesin obligasi: yield harian yang anjlok saat investor panik dan lari ke aset aman.",
        "`holdings.csv` adalah portofolio bank: 40 posisi dengan bobot (fraksi NAV), beta terhadap SP500 untuk ekuitas, durasi untuk obligasi, dan haircut likuiditas untuk obligasi. Tiga kolom terakhir inilah yang mengubah tumpukan angka menjadi mesin stress test.",
        "Aturan main: (1) imbal hasil portofolio dihitung dari posisi, bukan ditebak; (2) skenario diterapkan serentak ke semua posisi yang relevan; (3) kerugian selalu dilaporkan dalam % NAV DAN rupiah — nominal tanpa penyebut dilarang di misi ini.",
      ],
      tasks: [
        { id: "t1", text: "Buka `sp500.csv`: catat rentang tanggal, jumlah baris, dan hari terburuknya" },
        { id: "t2", text: "Buka `dgs10.csv`: ke mana yield bergerak saat pasar crash Maret 2020?" },
        { id: "t3", text: "Buka `holdings.csv`: berapa posisi tiap kelas, dan rentang haircut obligasi?" },
      ],
      note: {
        title: "Miskonsepsi #1: stress test = prediksi",
        type: "pitfall",
        body: "“Skenario crash −30% artinya kita meramal pasar jatuh 30%.” Bukan. Stress test tidak meramal apa-apa — ia mengukur KETAHANAN: bila guncangan sebesar ini datang (dan sejarah 2020 membuktikan guncangan sebesar ini nyata), berapa dalam lukanya dan apakah bank selamat? Komite tidak butuh ramalan; komite butuh tahu batas patahnya.",
      },
      reference:
        "sp500.csv (253 baris, sintetis pola FRED) + dgs10.csv (253 baris, sintetis) + holdings.csv (40 posisi). Semua angka lab dihitung ulang dari tiga file ini.",
    },
    {
      id: "lab-port",
      eyebrow: "Langkah 3 · Lab 1 — Mesin imbal hasil portofolio",
      title: "Rakit portofolio dari 40 posisi",
      prose: [
        "Sebelum mengguncang apa pun, rakit dulu mesinnya. Imbal hasil harian portofolio = jumlah kontribusi tiap posisi: ekuitas mengikuti SP500 (diskalakan beta-nya), obligasi bergerak berlawanan arah dengan perubahan yield (durasi × Δyield), kas diam di nol. Dari deret harian itu: temukan hari terburuk portofolio, ukur volatilitas tahunannya, dan terjemahkan ke rupiah — komite berpikir dalam rupiah, bukan persen.",
        "Perhatikan: hari terburuk portofolio BELUM TENTU sama dengan hari terburuk SP500 — obligasi dan kas meredamnya. Seberapa besar redamannya, angka yang bicara.",
      ],
      tasks: [
        { id: "t1", text: "Muat 3 CSV; hitung `n_baris`, `tgl_awal`, `tgl_akhir`" },
        { id: "t2", text: "Rakit `ret_port` harian; temukan `port_worst_tgl` dan `port_worst_ret`" },
        { id: "t3", text: "Hitung `port_vol` (tahunan) dan `rugi_maks_rp_m` (NAV Rp 1 T)" },
      ],
      expected:
        "n=253, 2020-01-02 s.d. 2020-12-31; hari terburuk portofolio 2020-03-16 (−3,18%); vol tahunan 13,64%; rugi harian maks Rp 31,8 M",
      formula: String.raw`r_p = \sum_{i} w_i\,r_i`,
      formulaNote:
        "w_i = bobot posisi i sebagai fraksi NAV (total semua posisi = 1); r_i = imbal hasil harian posisi i (%). Ekuitas: r_i = beta_i × r_SP500. Obligasi: r_i = −durasi_i × Δyield (dalam poin persen — yield naik = harga obligasi turun). Kas: r_i = 0. Interpretasi: r_p = −3,18% berarti portofolio kehilangan 3,18% NAV-nya dalam sehari = Rp 31,8 miliar dari Rp 1 triliun. Contoh konkret: posisi ekuitas berbobot 2% dengan beta 1,2 saat SP500 −5% → kontribusi −0,12% NAV.",
      note: {
        title: "Miskonsepsi #2: bobot besar = risiko besar",
        type: "pitfall",
        body: "Insting berkata posisi berbobot 4% pasti lebih berisiko dari yang 1%. Belum tentu: obligasi 4% berdurasi 2 tahun jauh lebih jinak daripada ekuitas 1% berbeta 1,3. Risiko = bobot × kepekaan (beta/durasi) × guncangan. Itulah kenapa lab ini mengalikan ketiganya, bukan sekadar menjumlah bobot.",
      },
      hints: [
        "Muat: `pd.read_csv(open_url(URL))` untuk tiap file — pola sama seperti misi VaR.",
        "Gabung pasar: `m = sp.merge(y10, on=\"tanggal\")`, lalu `m[\"dyield_pp\"] = m[\"yield_pct\"].diff().fillna(0)` — baris pertama tidak punya kemarin.",
        "Agregat kepekaan: `(eq[\"bobot\"] * eq[\"beta_sp500\"]).sum()` untuk ekuitas; `(bd[\"bobot\"] * bd[\"durasi\"]).sum()` untuk obligasi.",
        "Rakit: `m[\"ret_port\"] = wbeta * m[\"ret_sp500_pct\"] + wdur * (-m[\"dyield_pp\"])` — tanda minus karena yield naik = harga turun.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "SP_URL = \"/misi/misi-gabung-stress-portofolio/sp500.csv\"",
          "Y_URL = \"/misi/misi-gabung-stress-portofolio/dgs10.csv\"",
          "H_URL = \"/misi/misi-gabung-stress-portofolio/holdings.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "sp = pd.read_csv(open_url(SP_URL))",
          "y10 = pd.read_csv(open_url(Y_URL))",
          "hold = pd.read_csv(open_url(H_URL))",
          "",
          "n_baris = ...",
          "tgl_awal = ...",
          "tgl_akhir = ...",
          "",
          "m = sp.merge(y10, on=\"tanggal\")",
          "m[\"dyield_pp\"] = ...   # selisih yield harian (poin persen); baris pertama = 0",
          "",
          "eq = hold[hold[\"kelas\"] == \"ekuitas\"]",
          "bd = hold[hold[\"kelas\"] == \"obligasi\"]",
          "wbeta = ...   # jumlah(bobot * beta) ekuitas",
          "wdur = ...    # jumlah(bobot * durasi) obligasi",
          "",
          "m[\"ret_port\"] = ...   # wbeta * ret_sp500_pct + wdur * (-dyield_pp)",
          "",
          "i = m[\"ret_port\"].idxmin()",
          "port_worst_tgl = ...",
          "port_worst_ret = ...",
          "",
          "port_vol = ...         # std harian * akar(252)",
          "NAV = 1_000_000_000_000",
          "rugi_maks_rp_m = ...   # -ret terburuk/100 * NAV / 1e9",
          "",
          "print(\"baris:\", n_baris, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"terburuk:\", port_worst_tgl, round(float(port_worst_ret), 4))",
          "print(\"vol tahunan:\", round(float(port_vol), 2), \"%\")",
          "print(\"rugi harian maks: Rp\", round(float(rugi_maks_rp_m), 1), \"M\")",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "SP_URL = \"/misi/misi-gabung-stress-portofolio/sp500.csv\"",
          "Y_URL = \"/misi/misi-gabung-stress-portofolio/dgs10.csv\"",
          "H_URL = \"/misi/misi-gabung-stress-portofolio/holdings.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "sp = pd.read_csv(open_url(SP_URL))",
          "y10 = pd.read_csv(open_url(Y_URL))",
          "hold = pd.read_csv(open_url(H_URL))",
          "",
          "n_baris = len(sp)",
          "tgl_awal = sp[\"tanggal\"].min()",
          "tgl_akhir = sp[\"tanggal\"].max()",
          "",
          "m = sp.merge(y10, on=\"tanggal\")",
          "m[\"dyield_pp\"] = m[\"yield_pct\"].diff().fillna(0)",
          "",
          "eq = hold[hold[\"kelas\"] == \"ekuitas\"]",
          "bd = hold[hold[\"kelas\"] == \"obligasi\"]",
          "wbeta = float((eq[\"bobot\"] * eq[\"beta_sp500\"]).sum())",
          "wdur = float((bd[\"bobot\"] * bd[\"durasi\"]).sum())",
          "",
          "m[\"ret_port\"] = wbeta * m[\"ret_sp500_pct\"] + wdur * (-m[\"dyield_pp\"])",
          "",
          "i = m[\"ret_port\"].idxmin()",
          "port_worst_tgl = m.loc[i, \"tanggal\"]",
          "port_worst_ret = float(m.loc[i, \"ret_port\"])",
          "",
          "port_vol = float(m[\"ret_port\"].std() * (252 ** 0.5))",
          "NAV = 1_000_000_000_000",
          "rugi_maks_rp_m = float(-m[\"ret_port\"].min() / 100 * NAV / 1e9)",
          "",
          "print(\"baris:\", n_baris, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"terburuk:\", port_worst_tgl, round(float(port_worst_ret), 4))",
          "print(\"vol tahunan:\", round(float(port_vol), 2), \"%\")",
          "print(\"rugi harian maks: Rp\", round(float(rugi_maks_rp_m), 1), \"M\")",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t1", label: "`n_baris` = 253", name: "n_baris", value: 253, msg: "File pasar punya 253 hari perdagangan (2020-01-02 s.d. 2020-12-31)." },
          { kind: "equal", task: "t1", label: "`tgl_awal` benar", name: "tgl_awal", value: "2020-01-02", msg: "Ambil min kolom tanggal sp500.csv." },
          { kind: "equal", task: "t1", label: "`tgl_akhir` benar", name: "tgl_akhir", value: "2020-12-31", msg: "Ambil max kolom tanggal sp500.csv." },
          { kind: "defined", task: "t2", label: "`m` (gabungan pasar) ada", name: "m", msg: "Gabungkan sp dan y10 dengan merge(on=\"tanggal\")." },
          { kind: "equal", task: "t2", label: "hari terburuk = 2020-03-16", name: "port_worst_tgl", value: "2020-03-16", msg: "16 Maret 2020 — puncak kepanikan COVID." },
          { kind: "equal", task: "t2", label: "ret terburuk ≈ −3,18", name: "port_worst_ret", value: -3.1814, tol: 0.01, msg: "Ambil ret_port pada baris idxmin. (SP500 hari itu −5,98% — obligasi+kas meredamnya.)" },
          { kind: "equal", task: "t3", label: "`port_vol` ≈ 13,64", name: "port_vol", value: 13.64, tol: 0.05, msg: "std(ret_port) * akar(252) — jangan lupa fillna(0) pada dyield." },
          { kind: "equal", task: "t3", label: "`rugi_maks_rp_m` ≈ 31,8", name: "rugi_maks_rp_m", value: 31.8, tol: 0.2, msg: "-ret terburuk/100 * 1e12 / 1e9. Komite berpikir dalam rupiah." },
        ],
      },
    },
    {
      id: "lab-skenario",
      eyebrow: "Langkah 4 · Lab 2 — Tiga skenario, tanpa sensor",
      title: "Guncang portofolio sampai patah",
      prose: [
        "Mesin sudah rakit. Sekarang guncang. Tiga skenario, semuanya dihitung dari `holdings.csv` — tidak ada yang “diasumsikan aman”: S1, crash ekuitas −30% dalam sehari (Maret 2020 membuktikan −35% dalam sebulan itu nyata); S2, spike yield +150bps (obligasi berdurasi panjang berdarah saat yield melonjak); S3, keduanya terjadi BERSAMAAN sementara pasar obligasi membeku — di sinilah haircut likuiditas ditagih, tunai, di muka.",
        "Setiap skenario dilaporkan dalam % NAV dan rupiah, lalu diadili terhadap limit 10% NAV (Rp 100 miliar). Satu breach = satu alasan komite menolak kenaikan limit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung S1: `s1_rugi_pct`, `s1_rp_m`, `breach_s1`" },
        { id: "t2", text: "Hitung S2: `s2_rugi_pct`, `s2_rp_m`, `breach_s2`" },
        { id: "t3", text: "Hitung haircut, S3, dan `breach_s3`" },
      ],
      expected:
        "S1 rugi 16,10% NAV (Rp 161,0 M) → BREACH; S2 rugi 3,41% NAV (Rp 34,1 M) → aman; S3 rugi 23,40% NAV (Rp 234,0 M) → BREACH berat",
      formula: String.raw`L_{S3} = 0{,}30\sum w_i\beta_i + 0{,}015\sum w_j D_j + \sum w_j h_j`,
      formulaNote:
        "L_S3 = kerugian skenario gabungan (% NAV). Suku pertama: 0,30 × jumlah(bobot × beta) ekuitas — crash 30% yang diperkuat/dilemahkan beta. Suku kedua: 0,015 × jumlah(bobot × durasi) obligasi — yield naik 150bps = 0,015 desimal; durasi menerjemahkannya ke kerugian harga. Suku ketiga: jumlah(bobot × haircut) obligasi — diskon likuidasi paksa. Interpretasi: ketiga luka DIJUMLAHKAN — tidak ada yang saling menghapus. Contoh konkret: 16,10 + 3,41 + 3,89 = 23,40% NAV = Rp 234 miliar — lebih dari dua kali limit.",
      note: {
        title: "Miskonsepsi #3: skenario gabungan = jumlah yang diringankan diversifikasi",
        type: "risk",
        body: "Godaan terbesar analis: “kan ekuitas jatuh biasanya yield ikut turun, obligasi naik, jadi saling menutup.” Itu korelasi masa TENANG. Dalam stress, korelasi melompat ke positif — Maret 2020 saham dan obligasi korporat jatuh bersamaan, dan pasar obligasi sempat tidak ada pembelinya. Skenario gabungan yang jujur menjumlahkan luka, bukan mengasumsikan obat.",
      },
      hints: [
        "S1: `30.0 * (eq[\"bobot\"] * eq[\"beta_sp500\"]).sum()` — beta > 1 berarti luka lebih dalam dari 30% × bobot.",
        "S2: `1.5 * (bd[\"bobot\"] * bd[\"durasi\"]).sum()` — 150bps = 1,5 dalam poin persen.",
        "Haircut: `(bd[\"bobot\"] * bd[\"haircut_pct\"]).sum()` — persen dari NAV, bukan dari nilai obligasi.",
        "Rupiah: `pct/100*NAV/1e9` dengan NAV = 1_000_000_000_000; breach = `rugi_pct > LIMIT` (boolean).",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "H_URL = \"/misi/misi-gabung-stress-portofolio/holdings.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "hold = pd.read_csv(open_url(H_URL))",
          "",
          "NAV = 1_000_000_000_000   # Rp 1 triliun",
          "LIMIT = 10.0              # persen NAV",
          "",
          "eq = hold[hold[\"kelas\"] == \"ekuitas\"]",
          "bd = hold[hold[\"kelas\"] == \"obligasi\"]",
          "",
          "s1_rugi_pct = ...   # 30% * jumlah(bobot * beta) ekuitas",
          "s1_rp_m = ...       # ke rupiah miliar",
          "",
          "s2_rugi_pct = ...   # 1.5 * jumlah(bobot * durasi) obligasi",
          "s2_rp_m = ...",
          "",
          "haircut_nav_pct = ...   # jumlah(bobot * haircut_pct) obligasi",
          "s3_rugi_pct = ...       # S1 + S2 + haircut",
          "s3_rp_m = ...",
          "",
          "breach_s1 = ...",
          "breach_s2 = ...",
          "breach_s3 = ...",
          "",
          "print(\"S1 crash -30%   :\", round(float(s1_rugi_pct), 2), \"% NAV (Rp\", round(float(s1_rp_m), 1), \"M)\")",
          "print(\"S2 yield +150bps:\", round(float(s2_rugi_pct), 2), \"% NAV (Rp\", round(float(s2_rp_m), 1), \"M)\")",
          "print(\"S3 gabungan     :\", round(float(s3_rugi_pct), 2), \"% NAV (Rp\", round(float(s3_rp_m), 1), \"M)\")",
          "print(\"breach S1/S2/S3 :\", breach_s1, breach_s2, breach_s3)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "H_URL = \"/misi/misi-gabung-stress-portofolio/holdings.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "hold = pd.read_csv(open_url(H_URL))",
          "",
          "NAV = 1_000_000_000_000   # Rp 1 triliun",
          "LIMIT = 10.0              # persen NAV",
          "",
          "eq = hold[hold[\"kelas\"] == \"ekuitas\"]",
          "bd = hold[hold[\"kelas\"] == \"obligasi\"]",
          "",
          "s1_rugi_pct = float(30.0 * (eq[\"bobot\"] * eq[\"beta_sp500\"]).sum())",
          "s1_rp_m = float(s1_rugi_pct / 100 * NAV / 1e9)",
          "",
          "s2_rugi_pct = float(1.5 * (bd[\"bobot\"] * bd[\"durasi\"]).sum())",
          "s2_rp_m = float(s2_rugi_pct / 100 * NAV / 1e9)",
          "",
          "haircut_nav_pct = float((bd[\"bobot\"] * bd[\"haircut_pct\"]).sum())",
          "s3_rugi_pct = float(s1_rugi_pct + s2_rugi_pct + haircut_nav_pct)",
          "s3_rp_m = float(s3_rugi_pct / 100 * NAV / 1e9)",
          "",
          "breach_s1 = bool(s1_rugi_pct > LIMIT)",
          "breach_s2 = bool(s2_rugi_pct > LIMIT)",
          "breach_s3 = bool(s3_rugi_pct > LIMIT)",
          "",
          "print(\"S1 crash -30%   :\", round(float(s1_rugi_pct), 2), \"% NAV (Rp\", round(float(s1_rp_m), 1), \"M)\")",
          "print(\"S2 yield +150bps:\", round(float(s2_rugi_pct), 2), \"% NAV (Rp\", round(float(s2_rp_m), 1), \"M)\")",
          "print(\"S3 gabungan     :\", round(float(s3_rugi_pct), 2), \"% NAV (Rp\", round(float(s3_rp_m), 1), \"M)\")",
          "print(\"breach S1/S2/S3 :\", breach_s1, breach_s2, breach_s3)",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t1", label: "`s1_rugi_pct` ≈ 16,10", name: "s1_rugi_pct", value: 16.1, tol: 0.05, msg: "30 × jumlah(bobot × beta) ekuitas. Beta rata-rata portofolio ≈ 0,98." },
          { kind: "equal", task: "t1", label: "`breach_s1` = true", name: "breach_s1", value: true, msg: "16,10% > limit 10% — crash ekuitas SAJA sudah menembus limit." },
          { kind: "equal", task: "t2", label: "`s2_rugi_pct` ≈ 3,41", name: "s2_rugi_pct", value: 3.41, tol: 0.05, msg: "1,5 × jumlah(bobot × durasi) obligasi." },
          { kind: "equal", task: "t2", label: "`breach_s2` = false", name: "breach_s2", value: false, msg: "3,41% < 10% — skenario ini lolos. Inilah satu-satunya skenario yang ditampilkan memo desk." },
          { kind: "equal", task: "t3", label: "`haircut_nav_pct` ≈ 3,89", name: "haircut_nav_pct", value: 3.89, tol: 0.05, msg: "jumlah(bobot × haircut_pct) — persen dari NAV, bukan dari nilai obligasi." },
          { kind: "equal", task: "t3", label: "`s3_rugi_pct` ≈ 23,40", name: "s3_rugi_pct", value: 23.4, tol: 0.05, msg: "16,10 + 3,41 + 3,89 — luka dijumlahkan, bukan diringankan." },
          { kind: "equal", task: "t3", label: "`breach_s3` = true", name: "breach_s3", value: true, msg: "23,40% = Rp 234 miliar — lebih dari 2× limit. Skenario inilah yang dihapus memo desk." },
        ],
      },
    },
  ],
};

export default misiGabungStressPortofolio;

// ── lanjutan misiGabungStressPortofolio: langkah 5–15 ────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_STRESS: V2Step[] = [
  {
    id: "likuiditas",
    eyebrow: "Langkah 5 · Intermezzo — risiko yang tidak ada di chart",
    title: "Haircut: harga pasar bukan harga jual",
    prose: [
      "Suku ketiga S3 — haircut 3,89% NAV — adalah satu-satunya yang tidak muncul di chart harga mana pun. Haircut likuiditas = diskon yang harus kamu terima saat menjual di pasar yang membeku: tidak ada pembeli di harga wajar, spread melebar, dan setiap lot yang dilepas menekan harganya sendiri. Di hari tenang haircut = 0 di atas kertas. Di hari badai ia ditagih tunai.",
      "Maret 2020 memberi contoh nyata: pasar obligasi korporat sempat macet total — manajer investasi yang butuh kas menjual dengan diskon belasan persen, dan bank sentral AS turun tangan membeli agar pasar tidak berhenti. Memo desk di misi ini mengasumsikan haircut 0% — alias mengasumsikan pasar selalu likuid, bahkan di tengah badai.",
      "Tugas kecil sebelum lanjut: buka `holdings.csv`, temukan obligasi dengan haircut tertinggi, dan hitung manual nilai likuidasinya bila nilai pasarnya Rp 40 miliar. Rasakan bedanya antara “nilai di laporan” dan “kas yang benar-benar kembali”.",
    ],
    tasks: [
      { id: "t1", text: "Dari `holdings.csv`: obligasi mana ber-haircut tertinggi, berapa persen?" },
      { id: "t2", text: "Hitung manual nilai likuidasi posisi itu bila nilai pasarnya Rp 40 M" },
    ],
    formula: String.raw`V_{likuidasi} = V_{pasar}\times(1 - h)`,
    formulaNote:
      "V_likuidasi = kas yang benar-benar diterima saat jual paksa; V_pasar = nilai mark-to-market di laporan; h = haircut sebagai fraksi (mis. 12% = 0,12). Interpretasi: h = 0,12 pada obligasi Rp 40 miliar berarti hanya Rp 35,2 miliar yang kembali — Rp 4,8 miliar menguap BUKAN karena harga jatuh, melainkan karena tidak ada pembeli. Contoh konkret: haircut tertinggi di portofolio ini mendekati 20% — satu posisi Rp 40 miliar hanya kembali Rp 32 miliar.",
    note: {
      title: "Miskonsepsi #4: “kan bisa dijual pelan-pelan”",
      type: "pitfall",
      body: "Argumen klasik: likuiditas hanya masalah bila dipaksa jual cepat. Masalahnya: stress test justru mensimulasikan keadaan ketika SEMUA orang dipaksa jual cepat bersamaan — margin call, penarikan dana, kebutuhan modal. Likuiditas adalah barang publik yang hilang tepat saat dibutuhkan. Itulah kenapa haircut masuk S3 sebagai kerugian PASTI, bukan opsional.",
    },
  },
  {
    id: "lab-sql",
    eyebrow: "Langkah 6 · Lab 3 — Sepuluh hari tergelap",
    title: "Arsip luka portofolio",
    prose: [
      "Komite suka daftar: “tunjukkan hari-hari terburuknya.” Di tabel kecil ini ada 14 hari — 10 hari tergelap portofolio tahun 2020 plus 4 hari biasa sebagai pengecoh. Saring 10 yang terburuk dengan SQL, urut dari yang paling dalam lukanya.",
      "Tabel `harian(tanggal TEXT, ret_port_pct REAL)` — ret_port_pct negatif = rugi hari itu, dalam % NAV.",
    ],
    tasks: [
      { id: "t1", text: "Tulis query 10 hari terburuk (ret terkecil), urut dari terburuk" },
    ],
    expected:
      "10 baris — terburuk 2020-03-16 (−3,18), lalu 2020-03-23 (−2,48), 2020-02-27 (−2,06), …; 4 hari pengecoh tersingkir",
    sqlLab: {
      task: "Tampilkan 10 hari TERBURUK portofolio: kolom tanggal + ret_port_pct, urut dari ret terkecil (terburuk dulu).",
      schema: "CREATE TABLE harian (tanggal TEXT, ret_port_pct REAL);",
      seedData: [
        "INSERT INTO harian VALUES",
        "('2020-03-16',-3.1814),",
        "('2020-03-23',-2.4777),",
        "('2020-02-27',-2.0619),",
        "('2020-02-20',-2.0299),",
        "('2020-03-12',-2.0152),",
        "('2020-02-24',-1.6606),",
        "('2020-03-09',-1.4426),",
        "('2020-09-03',-1.3635),",
        "('2020-09-22',-1.2523),",
        "('2020-09-09',-1.1884),",
        "('2020-03-03',-0.4661),",
        "('2020-07-21',0.1963),",
        "('2020-10-09',-0.4417),",
        "('2020-12-18',-0.1347);",
      ].join("\n"),
      starter: "-- Tulis query-mu di sini\nSELECT tanggal, ret_port_pct\nFROM harian\n",
      solution: [
        "SELECT tanggal, ret_port_pct",
        "FROM harian",
        "ORDER BY ret_port_pct",
        "LIMIT 10;",
      ].join("\n"),
      expectedColumns: ["tanggal", "ret_port_pct"],
      expectedRows: [
        ["2020-03-16", -3.1814],
        ["2020-03-23", -2.4777],
        ["2020-02-27", -2.0619],
        ["2020-02-20", -2.0299],
        ["2020-03-12", -2.0152],
        ["2020-02-24", -1.6606],
        ["2020-03-09", -1.4426],
        ["2020-09-03", -1.3635],
        ["2020-09-22", -1.2523],
        ["2020-09-09", -1.1884],
      ],
      orderMatters: true,
    },
  },
  {
    id: "kuis-interpretasi",
    eyebrow: "Langkah 7 · Checkpoint interpretasi",
    title: "Angka sudah bicara — apa katanya?",
    prose: [
      "Tiga pertanyaan sebelum kamu mengambil keputusan. Tidak ada rumus di sini — hanya nalar risiko. Jawaban yang benar selalu punya alasan yang bisa kamu pertahankan di depan komite.",
    ],
    tasks: [],
    quiz: [
      {
        q: "S1 (crash ekuitas −30%) merugikan 16,10% NAV — di atas limit 10%. Apa arti temuan ini bagi pengajuan kenaikan limit desk?",
        options: [
          {
            text: "Pengajuan harus ditahan: portofolio SAAT INI saja sudah menembus limit stress, apalagi setelah limit dinaikkan",
            why: "Tepat. Limit stress mengukur ketahanan portofolio yang ada — 16,10% > 10% berarti bantalannya sudah jebol sebelum limit baru dibahas. Menaikkan limit di atas portofolio yang breach = melegalkan kerapuhan.",
            correct: true,
          },
          {
            text: "Tidak apa-apa: crash −30% jarang terjadi, jadi breach-nya bisa diabaikan",
            why: "Keliru — dan persis logika yang dipakai memo desk. Stress test ada justru untuk kejadian jarang tapi menghancurkan. Maret 2020: −35% dalam sebulan. “Jarang” bukan “tidak mungkin”.",
          },
          {
            text: "Artinya limit 10% terlalu ketat dan harus dilonggarkan",
            why: "Terbalik. Limit bukan hiasan yang disesuaikan agar angka lolos — limit adalah janji komite tentang seberapa besar luka yang bisa ditanggung bank. Yang harus berubah adalah portofolionya, bukan penggarisnya.",
          },
        ],
      },
      {
        q: "Kenapa kerugian S3 (23,40%) LEBIH BESAR dari sekadar “S1 + S2 yang diringankan diversifikasi”?",
        options: [
          {
            text: "Karena dalam stress, korelasi ekuitas–obligasi melompat ke positif dan haircut likuiditas menagih diskon tunai",
            why: "Tepat. Dua mekanisme: (1) diversifikasi masa tenang menguap — semua aset jatuh bersamaan; (2) haircut 3,89% NAV adalah kerugian riil yang tidak ada di chart harga. S3 yang jujur menjumlahkan luka.",
            correct: true,
          },
          {
            text: "Karena perhitungannya salah — seharusnya S3 = rata-rata S1 dan S2",
            why: "Keliru. Skenario gabungan mensimulasikan kedua guncangan terjadi BERSAMAAN — kerugiannya menjumlah, bukan merata-rata. Merata-rata skenario = mengasumsikan hanya satu yang terjadi.",
          },
          {
            text: "Karena haircut dihitung dua kali — sekali di S2, sekali di S3",
            why: "Keliru. S2 murni spike yield (durasi × Δyield); haircut likuiditas suku yang terpisah dan hanya muncul di S3. Tidak ada penghitungan ganda.",
          },
        ],
      },
      {
        q: "Memo desk menyimpulkan “semua aman” padahal S1 breach. Sebagai validator independen, langkah profesional pertamamu?",
        options: [
          {
            text: "Hitung ulang dari data mentah dan bandingkan dengan klaim memo, baris per baris",
            why: "Tepat — dan itulah yang kamu lakukan di Lab 1–3. Validator tidak berdebat opini; validator membawa angka tandingan. Selisih antara hitunganmu dan memo = peta sabotase untuk misi audit berikutnya.",
            correct: true,
          },
          {
            text: "Langsung menolak memo dan melaporkan desk ke komite",
            why: "Terburu-buru. Tanpa hitungan tandingan, penolakanmu hanya opini melawan opini — dan desk punya “angka resmi”. Bukti dulu, vonis kemudian.",
          },
          {
            text: "Meminta desk merevisi memo sampai angkanya terlihat wajar",
            why: "Berbahaya. “Terlihat wajar” tanpa verifikasi independen = memberi kesempatan kedua untuk menyembunyikan lebih rapi. Validator memverifikasi, bukan mengasisteni.",
          },
        ],
      },
    ],
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 8 · Checkpoint keputusan",
    title: "Portofolio ini mau kamu apakan?",
    prose: [
      "Angkanya final: S1 breach (16,10%), S2 aman (3,41%), S3 breach berat (23,40% = Rp 234 miliar). Portofolio yang ada SAAT INI tidak tahan badai — dan desk meminta limit DITAMBAH. Komite menunggumu memilih jalan. Tiap opsi mengubah apa yang terjadi berikutnya — termasuk apa yang akan kamu temukan di dossier.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke komite atas portofolio ini? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-buffer",
          label: "Tambah buffer modal 5% NAV sebelum limit baru dibahas",
          rationale:
            "Portofolio dipertahankan (strategi desk tidak diganggu), tapi bank mencadangkan Rp 50 miliar ekstra sebagai bantalan. Breach S1 16,10% vs limit 10% ditutup oleh buffer — secara akuntansi.",
          nextStepId: "temuan-buffer",
          consequenceNote:
            "Komite menyetujui buffer. Tiga bulan kemudian koreksi pasar datang: portofolio rugi 12% — buffer menyerapnya di atas kertas. Tapi CRO bertanya hal yang tidak bisa dijawab buffer: “kenapa portofolio yang breach limit boleh jalan terus?” Buffer menutup luka akuntansi, bukan luka struktur.",
        },
        {
          id: "opt-hedge",
          label: "Wajibkan hedge tail risk (proteksi crash) sebagai syarat limit baru",
          rationale:
            "Akar masalahnya = ekor kiri ekuitas (S1 16,10%). Beli proteksi (put options / tail hedge fund) yang membayar saat crash — S1 turun mendekati limit tanpa mengubah struktur portofolio.",
          nextStepId: "temuan-hedge",
          consequenceNote:
            "Desk membeli tail hedge. Setahun kemudian tidak ada crash — hedge kedaluwarsa tidak berharga (premi hangus Rp 8 miliar) dan desk menggerutu “asuransi yang tidak dipakai”. Lalu Maret berikutnya crash datang — dan hedge membayar Rp 120 miliar. Asuransi selalu terlihat bodoh sampai hari ia dibutuhkan.",
        },
        {
          id: "opt-deleverage",
          label: "Deleverage: pangkas eksposur ekuitas sampai S1 kembali dalam limit",
          rationale:
            "Tidak ada jalan pintas: portofolio yang breach limit harus dikecilkan risikonya. Turunkan bobot ekuitas dari 55% hingga kerugian S1 ≤ 10% NAV — disiplin limit ditegakkan, bukan dinegosiasikan.",
          nextStepId: "temuan-deleverage",
          consequenceNote:
            "Desk memangkas ekuitas ke ~34% — S1 turun ke 9,9% NAV, dalam limit. Harga yang dibayar: imbal hasil ekspektasi turun 1,8% per tahun, dan kepala desk tidak akan mengajakmu makan siang lagi. Tapi laporan audit regulator memuji: “bank menegakkan limit stress, bukan menegosiasikannya.”",
        },
      ],
    },
  },
];

// ── lanjutan: langkah 9–15 (konsekuensi → audit → deliverable → debrief) ─
const LANJUTAN_STRESS_2: V2Step[] = [
  {
    id: "temuan-buffer",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: tambah buffer modal",
    prose: [
      "Komite menyetujui buffer Rp 50 miliar (5% NAV). Di atas kertas, semuanya beres: breach S1 16,10% vs limit 10% kini “tertutup” bantalan. Desk tetap jalan dengan 55% ekuitas, limit baru dikabulkan, tidak ada yang perlu ribut.",
      "Tiga bulan kemudian koreksi pasar datang — bukan crash, sekadar −12% di ekuitas. Portofolio rugi, buffer menyerapnya, laporan tetap hijau. Lalu CRO memanggilmu dan bertanya satu hal yang tidak bisa dijawab oleh buffer berapa pun: “Kenapa portofolio yang TERBUKTI menembus limit boleh terus jalan — hanya karena kita menaruh kas di sebelahnya?”",
      "Kamu tidak punya jawaban yang bagus. Buffer adalah kas yang diam — ia tidak memperbaiki struktur yang rapuh, hanya membayar tagihannya. Dan tagihan berikutnya bisa lebih besar dari buffer.",
    ],
    tasks: [],
    note: {
      title: "Buffer tanpa perbaikan = pajak kerapuhan",
      body: "Modal buffer yang menutup breach struktural adalah cara mahal untuk tidak menyelesaikan masalah: bank membayar (imbal hasil kas ≈ 0) agar portofolio yang sama boleh tetap rapuh. Di memo-mu, setiap usulan buffer wajib ditemani rencana perbaikan struktur + tanggal kedaluwarsa buffer.",
    },
  },
  {
    id: "temuan-hedge",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: wajib hedge tail risk",
    prose: [
      "Komite mewajibkan tail hedge sebagai syarat limit baru. Desk membeli proteksi crash dengan premi Rp 8 miliar per tahun — mahal, dan langsung jadi bahan gerutuan: “bayar asuransi untuk badai yang tidak datang-datang.”",
      "Setahun berlalu tanpa crash. Hedge kedaluwarsa tidak berharga; premi hangus; sinisme di lantai trading memuncak. Lalu — Maret berikutnya — pasar jatuh 28% dalam tiga minggu. Portofolio ekuitas berdarah, TAPI hedge membayar Rp 120 miliar. Rugi bersih portofolio: 9,2% NAV — dalam limit. Kepala desk yang setahun menggerutu kini diam.",
      "Pelajaran yang mahal tapi jelas: proteksi tail risk selalu terlihat bodoh di tahun-tahun tenang — karena memang DIBELI untuk tahun yang tidak tenang. Validator yang mengusulkan hedge harus siap dibenci selama badai tidak datang.",
    ],
    tasks: [],
    note: {
      title: "Hedge dinilai dari skenario, bukan dari realisasi",
      body: "Menilai tail hedge dari “premi hangus tahun lalu” adalah kesalahan kategori: asuransi kebakaran tidak disebut gagal karena rumahmu tidak terbakar tahun ini. Ukur hedge dari S1-mu (16,10% → berapa setelah hedge?), bukan dari P&L tahun berjalan.",
    },
  },
  {
    id: "temuan-deleverage",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: deleverage paksa",
    prose: [
      "Komite memilih jalan paling tidak populer: pangkas eksposur ekuitas dari 55% hingga S1 kembali dalam limit. Perhitungannya lugas — S1 = 30% × jumlah(bobot × beta); untuk S1 ≤ 10% butuh eksposur ekuitas efektif ≤ ~33%. Desk menjual sepertiga ekuitasnya dalam dua minggu.",
      "Harga yang dibayar nyata: imbal hasil ekspektasi portofolio turun ~1,8% per tahun, dan hubunganmu dengan kepala desk butuh waktu lama untuk pulih. Tapi ketika audit regulator kuartal berikutnya memeriksa, ada satu paragraf tentang bankmu: “limit stress ditegakkan sebagai batas keras, bukan dinegosiasikan menjadi target.”",
      "Satu paragraf itu — dan fakta bahwa portofolio kini benar-benar tahan S1 — adalah seluruh pembelaanmu. Disiplin limit memang punya harga sosial; validator yang baik membayarnya di muka.",
    ],
    tasks: [],
    note: {
      title: "Limit yang bisa dinegosiasikan bukan limit",
      body: "Begitu breach dijawab dengan “tambah buffer saja” atau “longgarkan limitnya”, limit berubah dari BATAS menjadi TARGET — dan target selalu tercapai dengan cara menaikannya. Deleverage adalah satu-satunya respons yang membuat limit tetap menjadi limit.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 10 · Misi audit",
    title: "Dossier 16 baris: memo “semua aman” yang menipu",
    prose: [
      "Sebelum menulis memo tandingan, satu misi audit. Di bawah ini 16 baris “Memo Stress Test Portofolio — versi Desk”, dokumen yang dipakai mengajukan kenaikan limit dengan kesimpulan “semua aman”. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu — angka tidak bisa berbohong dua kali.",
      "Senjatamu: S1 16,10% (breach), S2 3,41% (aman), S3 23,40% (dihapus dari memo), haircut 3,89% NAV, dan limit 10% = Rp 100 miliar.",
    ],
    tasks: [],
    auditDossier: {
      version: "stress-capc-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Memo Stress Test Portofolio versi Desk yang menyimpulkan portofolio AMAN dan layak mendapat kenaikan limit.",
      columns: ["Baris", "Isi memo desk", "Klaim"],
      rows: [
        { rowId: 1, cells: { "Baris": "Komposisi", "Isi memo desk": "Ekuitas 55% / Obligasi 40% / Kas 5%", "Klaim": "Terdiversifikasi dengan baik" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 2, cells: { "Baris": "S1 — crash ekuitas −30%", "Isi memo desk": "Rugi 16,10% NAV (Rp 161,0 M)", "Klaim": "Melebihi limit 10%" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 3, cells: { "Baris": "S2 — spike yield +150bps", "Isi memo desk": "Rugi 3,41% NAV (Rp 34,1 M)", "Klaim": "Aman — dalam limit" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I1: skenario terburuk dihapus ──
        { rowId: 4, cells: { "Baris": "S3 — gabungan + likuiditas", "Isi memo desk": "Rugi 23,40% NAV (Rp 234,0 M)", "Klaim": "Dihapus dari analisis — tidak material" }, claims: [{ label: "Status", value: "Dihapus" }] },
        // ── I2: haircut diabaikan ──
        { rowId: 5, cells: { "Baris": "Asumsi haircut likuiditas", "Isi memo desk": "Haircut obligasi = 0%", "Klaim": "Pasar sekunder selalu likuid" }, claims: [{ label: "Asumsi", value: "Tetap" }] },
        // ── I3: korelasi diasumsikan tetap negatif ──
        { rowId: 6, cells: { "Baris": "Asumsi korelasi", "Isi memo desk": "Korelasi ekuitas–obligasi = −0,40 (tetap)", "Klaim": "Saat saham jatuh, obligasi naik menahan" }, claims: [{ label: "Asumsi", value: "Tetap" }] },
        // ── I4: limit dalam nominal ──
        { rowId: 7, cells: { "Baris": "Limit stress", "Isi memo desk": "Rp 100.000.000.000", "Klaim": "Dalam nominal — tanpa % NAV" }, claims: [{ label: "Format", value: "Nominal" }] },
        { rowId: 8, cells: { "Baris": "Hari terburuk historis", "Isi memo desk": "2020-03-16 (−3,18% NAV)", "Klaim": "Rugi harian maks Rp 31,8 M" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 9, cells: { "Baris": "Volatilitas tahunan", "Isi memo desk": "13,64%", "Klaim": "Dalam kisaran wajar" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 10, cells: { "Baris": "Metode", "Isi memo desk": "Skenario sekali kejut", "Klaim": "Interaksi antar risiko diabaikan" }, claims: [{ label: "Metode", value: "Disederhanakan" }] },
        { rowId: 11, cells: { "Baris": "Sumber data", "Isi memo desk": "SP500 & DGS10, pola FRED 2020", "Klaim": "Seri sintetis, beku 2026-10-15" }, claims: [{ label: "Sumber", value: "Tercatat" }] },
        { rowId: 12, cells: { "Baris": "Skenario ditampilkan", "Isi memo desk": "S1 dan S2", "Klaim": "2 dari 3 skenario" }, claims: [{ label: "Cakupan", value: "Sebagian" }] },
        { rowId: 13, cells: { "Baris": "Kesimpulan", "Isi memo desk": "Portofolio AMAN", "Klaim": "Skenario relevan dalam limit" }, claims: [{ label: "Vonis", value: "Lolos" }] },
        { rowId: 14, cells: { "Baris": "Rekomendasi", "Isi memo desk": "Pertahankan posisi", "Klaim": "Tidak perlu buffer/hedge tambahan" }, claims: [{ label: "Rekomendasi", value: "Disetujui" }] },
        { rowId: 15, cells: { "Baris": "Penyusun", "Isi memo desk": "Desk Risiko Pasar", "Klaim": "Tanggal 2026-10-10" }, claims: [{ label: "Dokumen", value: "Final" }] },
        { rowId: 16, cells: { "Baris": "Persetujuan", "Isi memo desk": "Kepala Desk", "Klaim": "Siap dibawa ke komite" }, claims: [{ label: "Status", value: "Disetujui" }] },
      ],
      injections: [
        { key: "skenario-dihapus", rowIds: [4], title: "Skenario terburuk dihapus", clue: "S3 — satu-satunya skenario yang menggabungkan guncangan pasar DAN krisis likuiditas — dihapus dengan alasan “tidak material”. Lab-mu menghitung kerugiannya: 23,40% NAV (Rp 234 miliar), lebih dari DUA KALI limit.", danger: "Menghapus skenario terburuk = menghapus alasan stress test diadakan. Komite menyetujui limit berdasarkan dunia yang tidak pernah seburuk kenyataan." },
        { key: "haircut-nol", rowIds: [5], title: "Haircut likuiditas diabaikan", clue: "Haircut 0% mengasumsikan obligasi selalu bisa dijual di harga wajar. Lab-mu: haircut rata-rata tertimbang 3,89% NAV — dan Maret 2020 pasar obligasi korporat sempat membeku total.", danger: "Risiko likuiditas tidak muncul di P&L harian — ia muncul sekaligus, tepat di hari kamu paling butuh menjual." },
        { key: "korelasi-tetap", rowIds: [6], title: "Korelasi diasumsikan tetap negatif", clue: "Korelasi −0,40 diambil dari masa tenang. Dalam stress, korelasi melompat ke positif: Maret 2020 saham dan obligasi korporat jatuh bersamaan — diversifikasi menguap saat paling dibutuhkan.", danger: "Diversifikasi yang dihitung dari data tenang adalah payung yang hanya dibuka saat cerah." },
        { key: "limit-nominal", rowIds: [7], title: "Limit dilaporkan dalam nominal, bukan % NAV", clue: "Limit ditulis Rp 100 miliar tanpa penyebut — padahal itu = 10% NAV. “Rugi Rp 95 miliar masih aman” terdengar longgar; sebagai 9,5% NAV ia berarti selangkah dari breach.", danger: "Nominal tanpa % NAV membuat angka besar terlihat kecil. Komite harus selalu melihat risiko sebagai fraksi dari modal — itu gunanya penyebut." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 11 · Deliverable",
    title: "Memo stress test untuk komite",
    prose: [
      "Semua bukti di tangan. Tulis memo stress test satu halaman untuk Komite Risiko — artefak portofoliomu. Memo yang baik tidak hanya bilang “terbakar”, tapi menunjukkan ANGKA kebakarannya, apa yang disembunyikan memo desk, dan apa yang harus terjadi berikutnya — dengan ambang tindakan yang eksplisit.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): hasil S1/S2/S3 vs limit 10% NAV, vonis atas pengajuan kenaikan limit.",
        "Bukti kuantitatif: kerugian tiap skenario (% NAV + rupiah), haircut likuiditas, hari terburuk historis (−3,18%), vol tahunan 13,64%.",
        "Temuan audit memo desk: 4 suntikan yang kamu temukan, baris per baris (skenario dihapus, haircut nol, korelasi tetap, limit nominal).",
        "Rekomendasi: apa yang harus terjadi pada portofolio & limit (rujuk keputusanmu di Langkah 8 + ambang tindakannya).",
        "Batas & risiko sisa: apa yang TIDAK dicakup stress test ini (skenario sekali kejut; korelasi stress; deret pasar sintetis, bukan data aktual; haircut = asumsi).",
      ],
      rubric: [
        { criterion: "Kebenaran skenario", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "S1 16,10% / S2 3,41% / S3 23,40% + haircut 3,89% — semua tepat, % NAV dan rupiah"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut suntikan", "Menyebut sebagian tanpa baris bukti", "Keempat suntikan disebut dengan nomor baris (4, 5, 6, 7)"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa ambang tindakan", "Ada rekomendasi, ambang kabur", "Rekomendasi + ambang eksplisit (mis. S1 > 10% → deleverage hingga dalam limit)"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim stress test membuktikan segalanya", "Menyebut sebagian batas", "Batas (sekali kejut, korelasi stress, data sintetis) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 12 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat suntikan di memo desk:",
      "1) **Skenario terburuk dihapus** (baris 4): S3 — 23,40% NAV, Rp 234 miliar — dibuang dengan alasan “tidak material”. Padahal S3 adalah satu-satunya skenario yang mensimulasikan apa yang BENAR-BENAR terjadi di krisis: guncangan pasar dan pembekuan likuiditas datang bersamaan. Memo yang hanya menampilkan S1 dan S2 lalu menyimpulkan “aman” sedang memamerkan dua skenario yang dipilih agar lolos.",
      "2) **Haircut diabaikan** (baris 5): 0% — “pasar selalu likuid”. Lab-mu: 3,89% NAV. Maret 2020: pasar obligasi korporat macet sampai bank sentral AS turun tangan. Haircut nol bukan asumsi konservatif — ia adalah asumsi bahwa krisis likuiditas tidak ada.",
      "3) **Korelasi tetap negatif** (baris 6): −0,40 dari masa tenang dipakai untuk membenarkan bahwa “obligasi akan menahan saat saham jatuh”. Dalam stress, korelasi menuju +1. Memo ini menjual diversifikasi yang hanya ada saat cerah.",
      "4) **Limit nominal** (baris 7): Rp 100 miliar tanpa % NAV. Trik presentasi tertua: tanpa penyebut, Rp 95 miliar “masih di bawah limit” terdengar aman — padahal 9,5% NAV berarti satu langkah dari breach. Komite yang baik selalu bertanya: “berapa persen dari modal?”",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim memo terhadap hitungan mentahmu sendiri, atau memercayai stempel “disetujui Kepala Desk”. Dan ingat keputusan bercabangmu: buffer menutup luka akuntansi, hedge membayar di tahun badai, deleverage menegakkan limit — tidak ada opsi yang gratis, tapi semuanya lebih jujur daripada memo “semua aman”.",
      "Bahaya nyata terakhir: bank yang menaikkan limit di atas portofolio yang breach stress test sedang membangun istana di atas pasir — dan pasirnya adalah asumsi. 2008 runtuh bukan karena bank tidak punya model, melainkan karena modelnya mengasumsikan hal-hal yang nyaman: korelasi tetap, likuiditas selalu ada, skenario terburuk “tidak material”.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #5: stress test lolos = boleh tambah risiko",
      type: "risk",
      body: "Bahkan stress test yang JUJUR pun hanya foto ketahanan hari ini — bukan izin menambah risiko esok hari. Setiap kenaikan limit mengubah portofolio, dan portofolio baru butuh stress test baru. Siklusnya: uji → putuskan → uji lagi. Tidak ada garis finis.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 13 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Stress test independen: S1 crash −30% → rugi 16,10% NAV (Rp 161 M, BREACH); S2 yield +150bps → 3,41% NAV (Rp 34,1 M, aman); S3 gabungan + haircut → 23,40% NAV (Rp 234 M, BREACH berat) vs limit 10% NAV.",
      "Empat pola sabotase memo desk: skenario terburuk dihapus, haircut likuiditas diasumsikan 0%, korelasi ekuitas–obligasi diasumsikan tetap negatif, limit dilaporkan dalam nominal tanpa % NAV.",
      "Keputusan atas portofolio yang breach selalu punya harga: buffer (menutup luka akuntansi), hedge tail risk (premi hangus di tahun tenang, membayar di tahun badai), deleverage (menegakkan limit dengan biaya imbal hasil). Setiap opsi “tahan” wajib punya ambang tindakan.",
      "Haircut likuiditas = kerugian yang tidak ada di chart harga: V_likuidasi = V_pasar × (1 − h) — ditagih tunai tepat saat pasar membeku.",
      "Data: deret pasar SINTETIS seed 42 meniru pola FRED 2020 (bukan data FRED asli) + 40 posisi sintetis; NAV Rp 1 triliun; metode di METODE.md.",
    ],
  },
];

(misiGabungStressPortofolio.steps as V2Step[]).push(...LANJUTAN_STRESS);
(misiGabungStressPortofolio.steps as V2Step[]).push(...LANJUTAN_STRESS_2);
