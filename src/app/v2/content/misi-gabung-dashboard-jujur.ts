import type { V2Mission } from "../lib/types";

// ── CAPSTONE #6: Business Intelligence × Marketing Analytics ────────────
// "Dashboard pertumbuhan yang tidak berbohong (definisi metrik konsisten)"
// Dataset: 100% SINTETIS, generator seed 42. Snapshot:
// public/misi/misi-gabung-dashboard-jujur/ (CSV + METODE.md, CC0).

const BASE = "/misi/misi-gabung-dashboard-jujur";

export const misiGabungDashboardJujur: V2Mission = {
  slug: "misi-gabung-dashboard-jujur",
  track: "Business Intelligence",
  module: "Misi",
  title: "Misi Dashboard Jujur: Satu Definisi Kebenaran",
  estMinutes: 180,
  role: "BI analyst / auditor metrik",
  client:
    "Chief Marketing Officer — dashboard pertumbuhan selalu hijau tapi revenue stagnan; definisi metrik diduga berubah-ubah diam-diam antar tim",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Semua hijau, tapi kas tidak bergerak",
      prose: [],
      tasks: [
        { id: "t1", text: "Baca cerita + pahami peranmu sebagai auditor metrik" },
        { id: "t2", text: "Catat 3 objectives di catatanmu — itu kontrak kerjamu" },
      ],
      briefing: {
        role: "BI analyst yang dipinjamkan ke kantor CMO sebagai auditor metrik independen",
        client:
          "Chief Marketing Officer. Dashboard pertumbuhan Q3: CAC di bawah target tiga bulan berturut-turut, active user tumbuh dua digit, channel social dinobatkan “paling efisien”. Tapi laporan finance berkata revenue stagnan ±0%. “Salah satu dari dua angka ini berbohong,” kata CMO. “Jangan percaya dashboardnya. Percaya datanya. Dan kalau kamu menemukan siapa yang mengutak-atik definisi — bawa buktinya ke saya.”",
        story: [
          "Senin, 09:00. Ruang CMO. Di layar: dashboard pertumbuhan Q3 — lautan hijau. CAC: di bawah target. Active user: panah naik dua digit. Social: badge “channel paling efisien”. Lalu CMO menggeser satu tab: laporan finance. Garis revenue datar seperti detak jantung pasien yang sudah tidak ada.",
          "“Tim growth bilang atribusi mereka benar. Tim finance bilang belanja mereka benar. Keduanya menunjuk dashboard yang sama,” katanya. “Yang tidak mereka ceritakan: definisi ‘active user’ di dashboard ini sudah diganti dua kali tahun ini. Jendela atribusi diganti di tengah kuartal. Dan CAC mereka tidak memasukkan fee agensi — 15% belanja yang pura-pura tidak ada.”",
          "Kamu bukan diminta membangun dashboard baru. Kamu diminta melakukan yang lebih sulit: membuktikan angka mana yang jujur, menulis SATU definisi kebenaran yang mengikat semua tim, dan menemukan siapa — atau apa — yang membuat dashboard ini selalu hijau.",
        ],
        objectives: [
          "Menghitung ulang CAC, active user, dan atribusi channel dari data mentah dengan definisi yang konsisten, lalu mengukur selisihnya terhadap angka dashboard (target: selisih CAC, MAU, dan pemenang atribusi terkuantifikasi).",
          "Menguji sensitivitas hasil terhadap perubahan definisi: jendela atribusi 7 vs 30 hari, dan dua definisi active user yang dipakai dua tim berbeda.",
          "Menemukan minimal 3 manipulasi definisi di dossier dashboard dan menulis Kamus Metrik v1.0 + memo rekomendasi migrasi untuk CMO.",
        ],
        prereqSummary:
          "CAC = total belanja dibagi pelanggan baru — angkanya hanya sejujur pembilangnya; belanja yang “disembunyikan” membuat CAC terlihat murah. Atribusi last-touch = aturan akuntansi yang mengkreditkan konversi ke sentuhan terakhir dalam jendela N hari — jendela yang berbeda bisa menobatkan pemenang channel yang berbeda. “Active user” bukan fakta alam: ia adalah definisi (event apa yang dihitung? jendela berapa hari? bot ikut dihitung?) — dan setiap pilihan definisi mengubah angkanya.",
        datasetNote:
          "100% SINTETIS — generator seed 42, dibuat khusus untuk misi ini (bukan data perusahaan nyata).\nFile: spend_harian.csv (276 baris: belanja iklan + fee agensi per channel per hari, Q3 2026), event_marketing.csv (920 pembelian + info journey atribusi), aktivitas_user.csv (30.638 baris aktivitas September 2026, termasuk 450 akun bot), definisi_metrik.csv (6 baris: definisi versi Tim Growth vs Tim Finance/Product/Brand).\nSatuan belanja: Rp juta. Metode + lisensi (CC0): file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Empat file dan satu tabel definisi",
      prose: [
        "Empat file menunggumu di data room. `spend_harian.csv`: belanja iklan per channel per hari — plus kolom `fee_agensi_jt` yang tidak pernah muncul di dashboard tim growth. `event_marketing.csv`: 920 pembelian, masing-masing dengan `channel_terakhir` dan `hari_sejak_sentuhan` — bahan mentah atribusi. `aktivitas_user.csv`: aktivitas September 2026 per user — termasuk 450 akun bot yang rajin pageview tapi tidak pernah login. `definisi_metrik.csv`: tabel paling penting — definisi CAC, active user, dan atribusi versi tiap tim, berdampingan.",
        "Aturan main: (1) angka dashboard BUKAN sumber kebenaran — data mentah yang jadi; (2) setiap metrik dihitung dengan SATU definisi yang kamu tulis eksplisit; (3) kalau dua definisi memberi dua jawaban berbeda, selisihnya adalah temuannya, bukan errornya.",
      ],
      tasks: [
        { id: "t1", text: "Buka `definisi_metrik.csv`: catat 3 metrik yang definisinya berbeda antar tim" },
        { id: "t2", text: "Buka `spend_harian.csv`: bandingkan `spend_iklan_jt` vs `spend_aktual_jt` — ke mana selisihnya?" },
        { id: "t3", text: "Buka `aktivitas_user.csv`: perkirakan proporsi baris dengan `is_bot = 1`" },
      ],
      note: {
        title: "Miskonsepsi #1: dashboard hijau = bisnis sehat",
        type: "pitfall",
        body: "“Semua metrik hijau, berarti perusahaan tumbuh.” SALAH — dan ini jebakan paling mahal di misi ini. Dashboard tidak mengukur bisnis; dashboard mengukur DEFINISInya sendiri. Kalau definisi “active user” diganti dari “login” menjadi “event apa pun”, angkanya naik 29% tanpa satu pun pelanggan baru. Hijau di layar, datar di kas — keduanya bisa benar bersamaan, karena yang satu mengukur definisi, yang satu mengukur uang.",
      },
      reference:
        "spend_harian.csv (belanja + fee) · event_marketing.csv (920 pembelian + journey) · aktivitas_user.csv (September, termasuk bot) · definisi_metrik.csv (definisi per tim). Detail: METODE.md.",
    },
    {
      id: "lab-metrik",
      eyebrow: "Langkah 3 · Lab 1 — Hitung ulang dengan definisi jujur",
      title: "CAC yang murah itu diskon definisi",
      prose: [
        "Buktikan dengan tanganmu sendiri. Dari `spend_harian.csv`: total belanja versi marketing (`spend_iklan_jt`) vs versi finance (`spend_aktual_jt` = iklan + fee agensi). Dari `event_marketing.csv`: jumlah pelanggan baru kuartal ini. Hitung CAC dua-duanya — dalam rupiah, bukan “sekitar”.",
        "Lalu `aktivitas_user.csv`: hitung MAU September versi Tim Growth (semua user dengan ≥1 event apa pun — termasuk bot) vs versi kamus (user non-bot dengan ≥1 login). Selisihnya bukan sekadar angka — itu ukuran seberapa besar dashboard berbohong.",
      ],
      tasks: [
        { id: "t1", text: "Muat 3 CSV; hitung `n_hari`, `n_pembelian`, `pelanggan_baru`" },
        { id: "t2", text: "Hitung `cac_marketing`, `cac_aktual` (rupiah), dan `selisih_cac_pct`" },
        { id: "t3", text: "Hitung `mau_growth`, `mau_kamus`, dan `bot_share_pct`" },
      ],
      expected:
        "n_hari=92, n_pembelian=920, pelanggan_baru=803, cac_marketing=Rp 1.800.685, cac_aktual=Rp 2.070.785, selisih=15,0%, mau_growth=3.153, mau_kamus=2.400, bot_share=14,27%",
      formula: String.raw`\text{CAC} = \frac{\text{total belanja}}{\text{pelanggan baru}}`,
      formulaNote:
        "Pembilang = total belanja (Rp); penyebut = pelanggan baru (user unik pembeli pertama di kuartal ini). Interpretasi: “setiap pelanggan baru menghabiskan belanja sebesar Rp X”. Contoh konkret: belanja iklan Rp 1.445,95 jt dibagi 803 pelanggan baru = Rp 1.800.685 per pelanggan — TAPI itu memakai pembilang yang menyembunyikan fee agensi Rp 216,89 jt. Ganti pembilangnya, ganti ceritanya.",
      note: {
        title: "Penyebut yang salah vs pembilang yang salah",
        type: "pitfall",
        body: "Dua cara membuat rasio berbohong: mengecilkan pembilang (biaya) atau membesarkan penyebut (hasil). Di misi ini tim growth melakukan keduanya — fee agensi dikeluarkan dari pembilang CAC, bot dimasukkan ke penyebut… eh, ke PEMBILANG active user. Pola ini umum: setiap metrik rasio punya dua tempat untuk disabotase. Saat audit, selalu tanya kedua sisinya.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(BASE + \"/spend_harian.csv\"))`.",
        "Pelanggan baru = `event[\"user_id\"].nunique()` — ±12% transaksi adalah pembelian ulang user yang sama.",
        "CAC dalam rupiah: kalikan total (Rp juta) dengan 1e6 sebelum dibagi pelanggan_baru.",
        "MAU kamus: filter DULU `is_bot == 0`, lalu `tipe == \"login\"`, baru hitung user unik. Urutan filter penting — bot tidak pernah login, tapi jangan andalkan itu.",
        "bot_share_pct = (mau_growth − user_unik_nonbot) / mau_growth × 100.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-dashboard-jujur\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "spend = pd.read_csv(open_url(BASE + \"/spend_harian.csv\"))",
          "event = pd.read_csv(open_url(BASE + \"/event_marketing.csv\"))",
          "aktiv = pd.read_csv(open_url(BASE + \"/aktivitas_user.csv\"))",
          "",
          "n_hari = ...",
          "n_pembelian = ...",
          "pelanggan_baru = ...",
          "",
          "spend_marketing = ...   # total spend_iklan_jt (Rp juta)",
          "spend_aktual = ...      # total spend_aktual_jt (Rp juta)",
          "cac_marketing = ...     # rupiah",
          "cac_aktual = ...        # rupiah",
          "selisih_cac_pct = ...   # persen",
          "",
          "sep = ...               # baris September saja",
          "mau_growth = ...        # user unik, event apa pun, termasuk bot",
          "nonbot = ...            # is_bot == 0",
          "mau_kamus = ...         # user unik non-bot dengan tipe login",
          "bot_share_pct = ...     # persen",
          "",
          "print(\"hari:\", n_hari, \"| pembelian:\", n_pembelian, \"| pelanggan baru:\", pelanggan_baru)",
          "print(\"CAC marketing: Rp\", round(cac_marketing), \"| CAC aktual: Rp\", round(cac_aktual))",
          "print(\"selisih CAC:\", round(selisih_cac_pct, 2), \"%\")",
          "print(\"MAU growth:\", mau_growth, \"| MAU kamus:\", mau_kamus)",
          "print(\"porsi bot:\", round(bot_share_pct, 2), \"%\")",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-dashboard-jujur\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "spend = pd.read_csv(open_url(BASE + \"/spend_harian.csv\"))",
          "event = pd.read_csv(open_url(BASE + \"/event_marketing.csv\"))",
          "aktiv = pd.read_csv(open_url(BASE + \"/aktivitas_user.csv\"))",
          "",
          "n_hari = int(spend[\"tanggal\"].nunique())",
          "n_pembelian = len(event)",
          "pelanggan_baru = int(event[\"user_id\"].nunique())",
          "",
          "spend_marketing = float(spend[\"spend_iklan_jt\"].sum())",
          "spend_aktual = float(spend[\"spend_aktual_jt\"].sum())",
          "cac_marketing = spend_marketing * 1e6 / pelanggan_baru",
          "cac_aktual = spend_aktual * 1e6 / pelanggan_baru",
          "selisih_cac_pct = (cac_aktual - cac_marketing) / cac_marketing * 100",
          "",
          "sep = aktiv[aktiv[\"tanggal\"] >= \"2026-09-01\"]",
          "mau_growth = int(sep[\"user_id\"].nunique())",
          "nonbot = sep[sep[\"is_bot\"] == 0]",
          "mau_kamus = int(nonbot[nonbot[\"tipe\"] == \"login\"][\"user_id\"].nunique())",
          "bot_share_pct = (mau_growth - nonbot[\"user_id\"].nunique()) / mau_growth * 100",
          "",
          "print(\"hari:\", n_hari, \"| pembelian:\", n_pembelian, \"| pelanggan baru:\", pelanggan_baru)",
          "print(\"CAC marketing: Rp\", round(cac_marketing), \"| CAC aktual: Rp\", round(cac_aktual))",
          "print(\"selisih CAC:\", round(selisih_cac_pct, 2), \"%\")",
          "print(\"MAU growth:\", mau_growth, \"| MAU kamus:\", mau_kamus)",
          "print(\"porsi bot:\", round(bot_share_pct, 2), \"%\")",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`event` termuat", name: "event", msg: "event harus berisi DataFrame dari event_marketing.csv." },
          { kind: "equal", task: "t1", label: "`n_hari` = 92", name: "n_hari", value: 92, msg: "Q3 2026 = 92 hari (1 Jul–30 Sep)." },
          { kind: "equal", task: "t1", label: "`n_pembelian` = 920", name: "n_pembelian", value: 920, msg: "Satu baris = satu pembelian di file ini." },
          { kind: "equal", task: "t1", label: "`pelanggan_baru` = 803", name: "pelanggan_baru", value: 803, msg: "User unik — ingat ±12% transaksi adalah pembelian ulang." },
          { kind: "equal", task: "t2", label: "`cac_marketing` ≈ Rp 1.800.685", name: "cac_marketing", value: 1800684.93, tol: 1, msg: "spend_iklan_jt total × 1e6 ÷ 803." },
          { kind: "equal", task: "t2", label: "`cac_aktual` ≈ Rp 2.070.785", name: "cac_aktual", value: 2070784.56, tol: 1, msg: "spend_aktual_jt total × 1e6 ÷ 803 (termasuk fee agensi)." },
          { kind: "equal", task: "t2", label: "`selisih_cac_pct` = 15,0%", name: "selisih_cac_pct", value: 15.0, tol: 0.05, msg: "Persis sebesar fee agensi — bukan kebetulan." },
          { kind: "equal", task: "t3", label: "`mau_growth` = 3.153", name: "mau_growth", value: 3153, msg: "Semua user unik September, termasuk 450 bot." },
          { kind: "equal", task: "t3", label: "`mau_kamus` = 2.400", name: "mau_kamus", value: 2400, msg: "Filter is_bot == 0 DULU, lalu tipe login." },
          { kind: "equal", task: "t3", label: "`bot_share_pct` ≈ 14,27%", name: "bot_share_pct", value: 14.27, tol: 0.05, msg: "Satu dari tujuh “active user” bukan manusia." },
        ],
      },
    },
    {
      id: "lab-atribusi",
      eyebrow: "Langkah 4 · Lab 2 — Uji sensitivitas jendela atribusi",
      title: "Ganti jendela, ganti pemenang",
      prose: [
        "Sekarang bagian marketing analytics-nya. Atribusi last-touch: sebuah pembelian dikreditkan ke `channel_terakhir` HANYA bila `hari_sejak_sentuhan` ≤ jendela. Tim Brand memakai jendela 7 hari; Tim Growth memakai 30 hari — dan dashboard hanya menampilkan versi 30 hari.",
        "Hitung pendapatan teratribusi per channel untuk kedua jendela. Kalau pemenangnya berubah hanya karena jendelanya diganti, maka “channel paling efisien” bukan fakta — melainkan pilihan parameter.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_pembelian`" },
        { id: "t2", text: "Hitung pendapatan teratribusi jendela 7 hari per channel (`rev7_search`, `rev7_social`, `rev7_email`)" },
        { id: "t3", text: "Hitung pendapatan teratribusi jendela 30 hari + `pemenang_berubah` (True/False)" },
      ],
      expected:
        "Jendela 7 hari: search Rp 200,65 jt (pemenang) > social Rp 135,74 jt > email Rp 42,11 jt. Jendela 30 hari: social Rp 313,09 jt (pemenang) > search Rp 278,48 jt > email Rp 89,22 jt. Pemenang BERUBAH.",
      formula: String.raw`R_w(c) = \sum_{i:\, h_i \le w,\; c_i = c} v_i`,
      formulaNote:
        "R_w(c) = pendapatan yang diatribusikan ke channel c pada jendela w hari; h_i = hari sejak sentuhan terakhir pembelian i; c_i = channel terakhir pembelian i; v_i = nilai pembelian i (Rp juta). Interpretasi: “dari semua pembelian yang sentuhan terakhirnya ≤ w hari lalu lewat channel c, total nilainya Rp R_w(c)”. Contoh konkret: pembelian Rp 0,8 jt lewat social dengan h_i = 12 → TERHITUNG di w = 30, TIDAK TERHITUNG di w = 7. Satu parameter, dua pemenang.",
      note: {
        title: "Miskonsepsi #2: atribusi = kontribusi kausal",
        type: "pitfall",
        body: "“Social menghasilkan Rp 313 jt, jadi social MENYEBABKAN Rp 313 jt.” SALAH. Atribusi last-touch adalah aturan AKUNTANSI — cara membagi kredit — bukan eksperimen kausal. Social menang di jendela 30 hari sebagian karena perannya sebagai pengenal (sentuhan awal, jeda panjang sebelum beli), bukan karena ia “lebih efektif”. Memotong budget search karena kalah atribusi = menghukum pemanen karena tidak menanam. Uji sensitivitas seperti lab ini adalah pertahanan pertama sebelum keputusan budget.",
      },
      hints: [
        "Filter jendela: `event[event[\"hari_sejak_sentuhan\"] <= 7]` — lalu groupby channel_terakhir dan jumlahkan nilai_beli_jt.",
        "Buat fungsi kecil `revenue(w)` agar tidak menulis logika yang sama dua kali.",
        "Pemenang: `.idxmax()` pada hasil groupby; bandingkan keduanya untuk `pemenang_berubah`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-dashboard-jujur\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "event = pd.read_csv(open_url(BASE + \"/event_marketing.csv\"))",
          "",
          "n_pembelian = ...",
          "",
          "def revenue(w):",
          "    a = ...   # pembelian dengan hari_sejak_sentuhan <= w",
          "    return a.groupby(\"channel_terakhir\")[\"nilai_beli_jt\"].sum()",
          "",
          "rev7 = revenue(7)",
          "rev30 = revenue(30)",
          "",
          "rev7_search = ...",
          "rev7_social = ...",
          "rev7_email = ...",
          "rev30_search = ...",
          "rev30_social = ...",
          "rev30_email = ...",
          "pemenang_berubah = ...   # True/False",
          "",
          "print(\"w=7 :\", dict(rev7.round(2)))",
          "print(\"w=30:\", dict(rev30.round(2)))",
          "print(\"pemenang berubah:\", pemenang_berubah)",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-dashboard-jujur\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "event = pd.read_csv(open_url(BASE + \"/event_marketing.csv\"))",
          "",
          "n_pembelian = len(event)",
          "",
          "def revenue(w):",
          "    a = event[event[\"hari_sejak_sentuhan\"] <= w]",
          "    return a.groupby(\"channel_terakhir\")[\"nilai_beli_jt\"].sum()",
          "",
          "rev7 = revenue(7)",
          "rev30 = revenue(30)",
          "",
          "rev7_search = float(rev7[\"search\"])",
          "rev7_social = float(rev7[\"social\"])",
          "rev7_email = float(rev7[\"email\"])",
          "rev30_search = float(rev30[\"search\"])",
          "rev30_social = float(rev30[\"social\"])",
          "rev30_email = float(rev30[\"email\"])",
          "pemenang_berubah = bool(rev7.idxmax() != rev30.idxmax())",
          "",
          "print(\"w=7 :\", dict(rev7.round(2)))",
          "print(\"w=30:\", dict(rev30.round(2)))",
          "print(\"pemenang berubah:\", pemenang_berubah)",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t1", label: "`n_pembelian` = 920", name: "n_pembelian", value: 920, msg: "Sama seperti Lab 1 — satu baris satu pembelian." },
          { kind: "equal", task: "t2", label: "`rev7_search` ≈ 200,65", name: "rev7_search", value: 200.65, tol: 0.05, msg: "Search memanen sentuhan pendek — unggul di jendela sempit." },
          { kind: "equal", task: "t2", label: "`rev7_social` ≈ 135,74", name: "rev7_social", value: 135.74, tol: 0.05, msg: "Social kehilangan ekor panjangnya di jendela 7 hari." },
          { kind: "equal", task: "t2", label: "`rev7_email` ≈ 42,11", name: "rev7_email", value: 42.11, tol: 0.05, msg: "Email kecil di kedua jendela." },
          { kind: "equal", task: "t3", label: "`rev30_search` ≈ 278,48", name: "rev30_search", value: 278.48, tol: 0.05, msg: "Jendela 30 hari = semua pembelian teratribusi." },
          { kind: "equal", task: "t3", label: "`rev30_social` ≈ 313,09", name: "rev30_social", value: 313.09, tol: 0.05, msg: "Ekor panjang social kini terhitung — inilah versi dashboard." },
          { kind: "equal", task: "t3", label: "`rev30_email` ≈ 89,22", name: "rev30_email", value: 89.22, tol: 0.05, msg: "Email ikut naik, tetap buncit." },
          { kind: "equal", task: "t3", label: "`pemenang_berubah` = True", name: "pemenang_berubah", value: true, msg: "Search (w=7) vs social (w=30) — “paling efisien” tergantung parameter." },
        ],
      },
    },
    {
      id: "lab-bot",
      eyebrow: "Langkah 5 · Lab 3 — Saring bot dengan SQL",
      title: "Satu dari tujuh “manusia” bukan manusia",
      prose: [
        "Lab 1 membuktikan 14,27% MAU versi growth adalah bot. Sekarang operasikan definisi kamus dalam SQL — bahasa yang dipakai tim BI untuk membangun semantic layer. Tabel kecil ini `aktivitas(user_id, tanggal, tipe, is_bot)`: 14 baris, 3 hari, 6 bot menyamar di antaranya — dua di antaranya bahkan punya baris `login`.",
        "Tugas: hitung user aktif HARIAN versi jujur — `is_bot = 0` DAN tipe `login`/`beli` — per tanggal, urut kronologis. Jebakan: bot yang “login” tetap bot. Saring identitas dulu, baru saring perilaku.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query user aktif harian versi kamus (non-bot, login/beli), per tanggal" },
      ],
      expected: "3 baris — 2026-09-14: 2, 2026-09-15: 2, 2026-09-16: 1 (bot B03/B06 yang “login” tersaring)",
      sqlLab: {
        task: "Hitung user aktif HARIAN versi kamus: is_bot = 0 DAN tipe login/beli. Tampilkan tanggal + jumlah user unik, urut dari tanggal terawal.",
        schema: "CREATE TABLE aktivitas (user_id TEXT, tanggal TEXT, tipe TEXT, is_bot INTEGER);",
        seedData: [
          "INSERT INTO aktivitas VALUES",
          "('U01','2026-09-14','login',0),",
          "('U02','2026-09-14','login',0),",
          "('U03','2026-09-14','pageview',0),",
          "('B01','2026-09-14','pageview',1),",
          "('B02','2026-09-14','pageview',1),",
          "('B03','2026-09-14','login',1),",
          "('U01','2026-09-15','beli',0),",
          "('U04','2026-09-15','login',0),",
          "('B01','2026-09-15','pageview',1),",
          "('B04','2026-09-15','pageview',1),",
          "('U02','2026-09-16','login',0),",
          "('U05','2026-09-16','pageview',0),",
          "('B05','2026-09-16','pageview',1),",
          "('B06','2026-09-16','login',1);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT tanggal, COUNT(DISTINCT user_id) AS user_aktif\nFROM aktivitas\n",
        solution: [
          "SELECT tanggal, COUNT(DISTINCT user_id) AS user_aktif",
          "FROM aktivitas",
          "WHERE is_bot = 0 AND tipe IN ('login','beli')",
          "GROUP BY tanggal",
          "ORDER BY tanggal;",
        ].join("\n"),
        expectedColumns: ["tanggal", "user_aktif"],
        expectedRows: [
          ["2026-09-14", 2],
          ["2026-09-15", 2],
          ["2026-09-16", 1],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiGabungDashboardJujur;

// ── lanjutan misiGabungDashboardJujur: langkah 6–13 ──────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_DASHBOARD: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 6 · Checkpoint keputusan",
    title: "Dashboard hijaunya mau kamu apakan?",
    prose: [
      "Buktimu lengkap: CAC jujur 15% lebih mahal dari versi dashboard (dan di ATAS target Rp 2 jt — bukan di bawah), MAU jujur 2.400 bukan 3.153, dan “social paling efisien” hanya benar di jendela 30 hari yang dipilih diam-diam di tengah kuartal. CMO menunggumu memilih. Ini keputusan final — seperti memo yang sudah dikirim ke seluruh direksi. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [
      { id: "t1", text: "Baca ketiga opsi + rationale-nya sampai habis" },
      { id: "t2", text: "Pilih SATU opsi (keputusan tercatat — seperti memo terkirim)" },
    ],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke CMO atas dashboard pertumbuhan ini?",
      options: [
        {
          id: "opt-kamus",
          label: "Bangun Kamus Metrik + semantic layer; bekukan dashboard lama sampai migrasi selesai",
          rationale:
            "Satu definisi mengikat untuk CAC, active user, dan atribusi — ditulis, berversi, ada pemiliknya. Dashboard lama dibekukan (read-only) agar tidak ada keputusan baru diambil dari angka yang terbukti dimanipulasi definisinya.",
          nextStepId: "konsekuensi-kamus",
          consequenceNote:
            "CMO menyetujui 6 minggu masa migrasi. Angka jujur memang pahit (CAC di atas target, MAU −24%), tapi budget Q4 akhirnya dialokasikan dari angka yang benar — dan tim growth berhenti dioptimasi untuk metrik yang salah.",
        },
        {
          id: "opt-footnote",
          label: "Tambahkan footnote definisi di tiap widget; dashboard tetap jalan seperti biasa",
          rationale:
            "Transparan tanpa drama: setiap angka diberi catatan definisinya. Tim tetap bisa bekerja, tidak ada yang “disalahkan”, dan siapa pun yang teliti bisa melihat definisinya.",
          nextStepId: "konsekuensi-footnote",
          consequenceNote:
            "Footnote dipasang — dan tidak dibaca siapa pun. Tiga bulan kemudian definisi makin bercabang (kini ada 4 versi “active user”), karena footnote membuat setiap tim merasa definisinya “sudah transparan”. Dashboard tetap hijau; revenue tetap datar.",
        },
        {
          id: "opt-bongkar",
          label: "Umumkan angka jujur ke seluruh perusahaan minggu ini",
          rationale:
            "Kejujuran tidak bisa menunggu 6 minggu. Umumkan CAC jujur, MAU jujur, dan atribusi dua-jendela sekarang — biar semua orang bekerja dari kebenaran yang sama mulai hari ini.",
          nextStepId: "konsekuensi-bongkar",
          consequenceNote:
            "Pengumuman tanpa rencana migrasi memicu kepanikan: tim growth defensif (“angka kami benar menurut definisi kami”), direksi mempertanyakan bonus Q3 yang sudah dibayar dari metrik hijau, dan CMO kehilangan sekutu. Kebenaran tanpa strategi komunikasi = kekacauan yang jujur.",
        },
      ],
    },
  },
  {
    id: "konsekuensi-kamus",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: kamus + pembekuan",
    prose: [
      "CMO menyetujui rencanamu: 6 minggu membangun Kamus Metrik v1.0 dan semantic layer di atasnya; dashboard lama dibekukan read-only — masih bisa dilihat, tidak bisa dipakai untuk keputusan baru. Minggu pertama pahit: CAC jujur Rp 2.070.785 ternyata DI ATAS target Rp 2 jt (bukan di bawah seperti yang diklaim tiga bulan), MAU “tumbuh dua digit” menyusut 24% begitu bot disaring.",
      "Tapi minggu keempat sesuatu berubah: untuk pertama kalinya tim growth dan tim finance berdebat memakai ANGKA YANG SAMA. Budget Q4 dialokasikan ulang — social tidak lagi dapat +40% otomatis, karena klaim “paling efisien” kini datang dengan catatan jendelanya. Bonus Q4 dihitung dari definisi yang berversi dan diaudit.",
      "Harga yang kamu bayar: 6 minggu tanpa dashboard “baru”, dan beberapa orang yang metriknya terlihat buruk tidak akan melupakan namamu. Kebenaran yang terstruktur memang tidak gratis — tapi lebih murah dari keputusan mahal yang diambil dari angka bohong.",
    ],
    tasks: [
      { id: "t1", text: "Baca konsekuensinya sampai habis" },
      { id: "t2", text: "Catat satu pelajaran untuk memo deliverable-mu" },
    ],
    note: {
      title: "Pembekuan bukan sensor",
      body: "Dashboard lama tidak dihapus — ia dibekukan read-only sebagai arsip. Menghapusnya justru menghilangkan bukti. Prinsip audit: angka yang salah tetap disimpan (dengan label), agar orang bisa melihat KENAPA keputusan lama diambil — dan tidak mengulanginya.",
    },
  },
  {
    id: "konsekuensi-footnote",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: footnote di tiap widget",
    prose: [
      "Footnote dipasang minggu itu juga — rapi, kecil, abu-abu, di pojok tiap widget. Tidak ada yang membacanya. Tiga bulan kemudian, sesuatu yang lebih buruk terjadi: karena setiap definisi kini “sudah transparan”, tiap tim merasa berhak memakai definisinya sendiri. Kini ada EMPAT versi “active user” — dan masing-masing punya footnote.",
      "Dashboard tetap hijau. Revenue tetap datar. Bedanya: sekarang tidak ada yang bisa disalahkan, karena “sudah ditulis di footnote”. Transparansi kosmetik ternyata adalah cara paling sopan untuk tidak mengubah apa-apa.",
      "Pelajaran yang mahal: definisi yang tidak MENGIKAT bukanlah definisi — itu dekorasi. Kamus metrik bekerja bukan karena ia ditulis, tapi karena ia menjadi satu-satunya sumber yang boleh dipakai mengambil keputusan.",
    ],
    tasks: [
      { id: "t1", text: "Baca konsekuensinya sampai habis" },
      { id: "t2", text: "Catat satu pelajaran untuk memo deliverable-mu" },
    ],
    note: {
      title: "Footnote ≠ tata kelola",
      body: "Menulis definisi di pojok layar tidak membuatnya mengikat. Yang mengikat: satu pipeline (semantic layer) yang dipakai semua dashboard, definisi berversi dengan pemilik, dan aturan “tidak ada metrik tanpa entri kamus”. Tanpa ketiganya, footnote hanya alibi.",
    },
  },
  {
    id: "konsekuensi-bongkar",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: umumkan semuanya, sekarang",
    prose: [
      "Senin pagi, angka jujur diumumkan ke seluruh perusahaan: CAC di atas target, MAU menyusut 24%, “social paling efisien” ternyata tergantung jendela. Reaksinya bukan kelegaan — melainkan kepanikan. Tim growth merasa diserang (“angka kami benar menurut definisi kami!”). Direksi mempertanyakan bonus Q3 yang sudah terlanjur dibayar dari metrik hijau. CMO — yang memintamu jujur — kini dikepung pertanyaan yang belum ada jawabannya: “Lalu definisi yang benar apa? Siapa pemiliknya? Dashboard mana yang dipakai besok pagi?”",
      "Kebenarannya tidak salah. Waktunya yang salah — atau lebih tepatnya: kebenaran tanpa rencana migrasi hanyalah kekacauan yang jujur. Tiga minggu kemudian perusahaan tetap membangun kamus metrik — tapi dari posisi defensif, dengan kepercayaan yang sudah retak.",
      "Pelajaran yang mahal: kejujuran adalah isi; tata kelola adalah wadahnya. Tuang kebenaran tanpa wadah, dan ia tumpah ke mana-mana.",
    ],
    tasks: [
      { id: "t1", text: "Baca konsekuensinya sampai habis" },
      { id: "t2", text: "Catat satu pelajaran untuk memo deliverable-mu" },
    ],
    note: {
      title: "Kebenaran butuh strategi komunikasi",
      body: "Urutan yang bekerja: (1) hitung ulang diam-diam dari data mentah, (2) sepakati definisi dengan pemilik metrik, (3) bangun penggantinya, (4) BARU umumkan — dengan angka lama dan baru berdampingan plus tanggal berlakunya. Membalik urutan ini mengubah auditor menjadi kambing hitam.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 8 · Misi audit",
    title: "Dossier 14 baris: dashboard yang “selalu hijau” itu dimasak",
    prose: [
      "Sebelum menulis kamus metrik, satu misi audit. Di bawah ini 14 baris “Ringkasan Dashboard Pertumbuhan Q3” — dokumen yang dipakai direksi mengambil keputusan budget. Seseorang menyuntikkan 4 manipulasi definisi ke dalamnya.",
      "Senjatamu: CAC jujur Rp 2.070.785 vs Rp 1.800.685 versi dashboard, MAU kamus 2.400 vs 3.153 versi growth, dan dua pemenang atribusi dari Lab 2 (search di jendela 7, social di jendela 30).",
    ],
    tasks: [
      { id: "t1", text: "Bandingkan tiap baris dossier dengan hasil hitung ulang lab-mu" },
      { id: "t2", text: "Tandai baris yang menurutmu suntikan (target: 4 suntikan)" },
    ],
    auditDossier: {
      version: "dashboard-jujur-cap6-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Ringkasan Dashboard Pertumbuhan Q3 yang dipakai direksi untuk keputusan budget. Semua metriknya hijau.",
      columns: ["Bulan", "Metrik", "Definisi yang dipakai", "Nilai", "Klaim dashboard"],
      rows: [
        { rowId: 1, cells: { "Bulan": "Jul", "Metrik": "CAC", "Definisi yang dipakai": "belanja iklan ÷ pelanggan baru", "Nilai": "Rp 1,79 jt", "Klaim dashboard": "Di bawah target Rp 2 jt ✅" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 2, cells: { "Bulan": "Agu", "Metrik": "CAC", "Definisi yang dipakai": "belanja iklan ÷ pelanggan baru", "Nilai": "Rp 1,81 jt", "Klaim dashboard": "Di bawah target ✅" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 3, cells: { "Bulan": "Sep", "Metrik": "CAC", "Definisi yang dipakai": "belanja iklan ÷ pelanggan baru", "Nilai": "Rp 1,80 jt", "Klaim dashboard": "Di bawah target ✅" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I3: fee agensi disembunyikan dari pembilang ──
        { rowId: 4, cells: { "Bulan": "Q3", "Metrik": "Catatan metode CAC", "Definisi yang dipakai": "—", "Nilai": "—", "Klaim dashboard": "Belanja = spend_iklan; fee agensi 15% tidak termasuk" }, claims: [{ label: "Metode", value: "Versi marketing" }] },
        { rowId: 5, cells: { "Bulan": "Jul", "Metrik": "Active user", "Definisi yang dipakai": "≥1 login / 30 hari", "Nilai": "2.310", "Klaim dashboard": "Stabil 🟡" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I4: definisi active diganti diam-diam ──
        { rowId: 6, cells: { "Bulan": "Agu", "Metrik": "Active user", "Definisi yang dipakai": "≥1 event apa pun / 30 hari", "Nilai": "2.980", "Klaim dashboard": "Tumbuh +29% 🟢" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I2: bot dihitung sebagai user ──
        { rowId: 7, cells: { "Bulan": "Sep", "Metrik": "Active user", "Definisi yang dipakai": "≥1 event apa pun / 30 hari (termasuk bot)", "Nilai": "3.153", "Klaim dashboard": "Tumbuh +6% 🟢" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 8, cells: { "Bulan": "—", "Metrik": "Catatan perubahan definisi", "Definisi yang dipakai": "—", "Nilai": "—", "Klaim dashboard": "Definisi “active” diubah Jul→Agu tanpa changelog" }, claims: [{ label: "Perubahan", value: "Tanpa versi" }] },
        // ── I1: jendela atribusi diganti diam-diam ──
        { rowId: 9, cells: { "Bulan": "Q3", "Metrik": "Pendapatan teratribusi", "Definisi yang dipakai": "last-touch, jendela 30 hari", "Nilai": "Social Rp 313,09 jt", "Klaim dashboard": "Social channel paling efisien 🟢" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 10, cells: { "Bulan": "Q3", "Metrik": "Pendapatan teratribusi", "Definisi yang dipakai": "last-touch, jendela 7 hari", "Nilai": "Search Rp 200,65 jt", "Klaim dashboard": "(tidak ditampilkan di dashboard)" }, claims: [{ label: "Tercatat", value: "Versi brand" }] },
        { rowId: 11, cells: { "Bulan": "—", "Metrik": "Catatan perubahan jendela", "Definisi yang dipakai": "—", "Nilai": "—", "Klaim dashboard": "Jendela diubah 7→30 hari pada 15 Agu, tanpa anotasi" }, claims: [{ label: "Perubahan", value: "Tengah kuartal" }] },
        { rowId: 12, cells: { "Bulan": "Q3", "Metrik": "Revenue perusahaan", "Definisi yang dipakai": "laporan finance (tidak di dashboard growth)", "Nilai": "Stagnan ±0%", "Klaim dashboard": "(tidak ditampilkan)" }, claims: [{ label: "Sumber", value: "Finance" }] },
        { rowId: 13, cells: { "Bulan": "—", "Metrik": "Kesimpulan dashboard", "Definisi yang dipakai": "—", "Nilai": "—", "Klaim dashboard": "Semua metrik hijau — pertumbuhan sehat" }, claims: [{ label: "Kesimpulan", value: "Resmi" }] },
        { rowId: 14, cells: { "Bulan": "—", "Metrik": "Rekomendasi tim growth", "Definisi yang dipakai": "—", "Nilai": "—", "Klaim dashboard": "Tambah budget social 40%" }, claims: [{ label: "Rekomendasi", value: "Disetujui?" }] },
      ],
      injections: [
        { key: "fee-disembunyikan", rowIds: [1, 2, 3, 4], title: "Fee agensi disembunyikan dari pembilang CAC", clue: "Baris 4 mengakuinya sendiri: “fee agensi 15% tidak termasuk”. CAC “di bawah target” tiga bulan (baris 1–3) berdiri di atas pembilang yang dipangkas. Versi jujurmu: Rp 2.070.785 — DI ATAS target Rp 2 jt.", danger: "Pembilang yang dipangkas adalah cara termurah membuat rasio terlihat murah. Bonus dan target yang dibayar dari CAC versi ini = membayar orang dari angka yang salah." },
        { key: "bot-dihitung", rowIds: [7], title: "Bot traffic dihitung sebagai active user", clue: "Baris 7: 3.153 “active user” — persis angka versi Tim Growth dari Lab 1, yang mencakup 450 bot (14,27%). “Tumbuh +6%” sebagian adalah pertumbuhan robot.", danger: "Satu dari tujuh “manusia” di dashboard bukan manusia. Keputusan hiring, kapasitas server, dan valuasi yang memakai MAU ini = dibangun di atas traffic." },
        { key: "definisi-diganti", rowIds: [5, 6, 8], title: "Definisi “active” diganti diam-diam tengah jalan", clue: "Juli: “≥1 login” (2.310). Agustus: “≥1 event apa pun” (2.980, +29%) — tanpa changelog (baris 8). “Pertumbuhan” 29% itu artefak definisi, bukan pelanggan baru. Bandingkan apel-dengan-apel: definisi Juli untuk Agustus tidak pernah ditampilkan.", danger: "Mengganti definisi tanpa versi = memutus time series. Tren yang dibandingkan lintas definisi bukan tren — itu dua metrik berbeda yang pura-pura satu." },
        { key: "window-diganti", rowIds: [9, 11], title: "Jendela atribusi diganti diam-diam 7→30 hari", clue: "Baris 11: jendela diubah 15 Agustus — tengah kuartal — tanpa anotasi. Dashboard hanya menampilkan versi 30 hari (baris 9: social menang); versi 7 hari (baris 10: search menang) disembunyikan. Rekomendasi “tambah budget social 40%” (baris 14) berdiri di atas parameter yang dipilih.", danger: "Parameter yang bisa diganti diam-diam = metrik yang bisa dimenangkan siapa pun yang memegang pengaturannya. Tanpa jendela yang dikunci di kamus, “channel paling efisien” = “channel yang operatornya terakhir menyentuh pengaturannya”." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 9 · Deliverable",
    title: "Kamus Metrik v1.0 + memo untuk CMO",
    prose: [
      "Semua bukti di tangan. Tulis dua artefak portofoliomu: (1) Kamus Metrik v1.0 — satu definisi mengikat per metrik (nama, rumus, pembilang, penyebut, jendela, perlakuan bot/fee, pemilik, versi); (2) memo satu halaman untuk CMO — angka dashboard vs angka jujur, suntikan yang kamu temukan, dan rencana migrasi merujuk keputusanmu di Langkah 6.",
      "Kamus yang baik tidak hanya mendefinisikan — ia MENGIKAT: siapa pemilik tiap definisi, bagaimana versinya dicatat, dan aturan “tidak ada metrik di dashboard tanpa entri kamus”.",
    ],
    tasks: [
      { id: "t1", text: "Tulis Kamus Metrik v1.0 memakai template (3 metrik)" },
      { id: "t2", text: "Tulis memo 1 halaman untuk CMO (bukti + temuan + rencana)" },
      { id: "t3", text: "Nilai sendiri draf-mu dengan rubrik (target ≥ 80)" },
    ],
    deliverable: {
      template: [
        "Kamus Metrik v1.0 — CAC: nama resmi, rumus, pembilang (total belanja: iklan + fee agensi + apa lagi?), penyebut (definisi pelanggan baru), periode, pemilik definisi, versi 1.0 + tanggal berlaku.",
        "Kamus Metrik v1.0 — Active user: event apa yang dihitung, jendela berapa hari, perlakuan bot (disaring/dilaporkan terpisah?), pemilik, versi.",
        "Kamus Metrik v1.0 — Atribusi konversi: model (last-touch), jendela TERKUNCI berapa hari, perlakuan pembelian di luar jendela, pemilik, versi + aturan perubahan (changelog wajib).",
        "Memo — bukti hitung ulang: tabel 3 baris (metrik | versi dashboard | versi kamus | selisih) untuk CAC, MAU, pemenang atribusi.",
        "Memo — temuan audit: suntikan definisi apa yang kamu temukan di dossier, nomor barisnya, dan berapa besar distorsinya dalam rupiah/user.",
        "Memo — rencana migrasi: merujuk keputusan Langkah 6 (kamus+beku / footnote / umumkan) + tenggat + siapa pemilik tiap definisi + aturan “tanpa entri kamus, tanpa metrik di dashboard”.",
        "Memo — batas & risiko sisa: apa yang TIDAK bisa diperbaiki kamus (mis. atribusi tetap bukan kausal; definisi benar tidak memperbaiki produk yang memang stagnan).",
      ],
      rubric: [
        { criterion: "Kebenaran hitung ulang", weight: 30, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "CAC 1.800.685 vs 2.070.785, MAU 3.153 vs 2.400, dua pemenang atribusi — semua tepat"] },
        { criterion: "Deteksi suntikan definisi", weight: 25, levels: ["Tidak menyebut suntikan", "Menyebut sebagian tanpa nomor baris", "Keempat suntikan disebut dengan nomor baris + besar distorsinya"] },
        { criterion: "Kualitas keputusan migrasi", weight: 25, levels: ["Rekomendasi tanpa rencana/tenggat", "Ada rencana, pemilik kabur", "Rencana + tenggat + pemilik tiap definisi + aturan pengikat, konsisten dengan Langkah 6"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim kamus menyelesaikan segalanya", "Menyebut sebagian batas", "Batas (atribusi≠kausal, definisi≠pertumbuhan riil) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 10 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat suntikan definisi di dossier dashboard Q3:",
      "1) **Fee disembunyikan** (baris 1–4): CAC “di bawah target” tiga bulan berdiri di atas pembilang tanpa fee agensi 15%. Versi jujur Rp 2.070.785 — di ATAS target. Tiga bulan bonus dan keputusan budget dibayar dari angka ini.",
      "2) **Bot dihitung** (baris 7): 3.153 “active user” mencakup 450 bot. Satu dari tujuh bukan manusia — dan “tumbuh +6%” sebagian adalah pertumbuhan robot.",
      "3) **Definisi diganti** (baris 5, 6, 8): Juli memakai “≥1 login”, Agustus “≥1 event apa pun” — tanpa changelog. Lonjakan “+29%” adalah artefak definisi, bukan pelanggan.",
      "4) **Jendela diganti** (baris 9, 11): 7→30 hari pada 15 Agustus, tengah kuartal, tanpa anotasi. Versi yang ditampilkan (social menang) dipilih; versi yang disembunyikan (search menang) dilupakan. Rekomendasi “tambah budget social 40%” berdiri di atas parameter.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi definisi di balik angka, atau memercayai warna hijaunya. Dan ingat keputusan bercabangmu: kamus+beku (kebenaran terstruktur, pahit di awal), footnote (transparansi kosmetik — tidak mengubah apa-apa), umumkan-sekarang (kebenaran tanpa wadah = kekacauan yang jujur). Tidak ada opsi yang gratis.",
      "Bahaya nyata terakhir: metrik yang definisinya bisa diganti diam-diam adalah mesin insentif yang rusak. Orang dioptimasi untuk APA YANG DIUKUR — dan kalau yang diukur bisa diatur, yang dioptimasi adalah pengaturannya, bukan bisnisnya. Itulah kenapa disiplin BI (semantic layer, satu definisi, berversi, ada pemilik) bukan birokrasi — ia adalah rem darurat.",
    ],
    tasks: [
      { id: "t1", text: "Cocokkan 4 suntikan dengan temuanmu di Langkah 8" },
      { id: "t2", text: "Tulis satu bahaya nyata yang paling relevan untuk kantormu" },
    ],
    note: {
      title: "Miskonsepsi #3: satu definisi untuk selamanya",
      type: "risk",
      body: "Kamus metrik v1.0 bukan kitab suci — definisi BOLEH berubah (bisnis berubah). Yang tidak boleh: berubah DIAM-DIAM. Setiap perubahan = versi baru + tanggal berlaku + alasan + pemilik yang menandatangani. Time series yang sehat selalu bisa menjawab: “angka bulan ini memakai definisi versi berapa?” Kalau tidak bisa — trennya fiksi.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 11 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Baca ulang 5 poin rangkuman" },
      { id: "t2", text: "Tandai misi selesai — dan ingat: jangan percaya warna, percaya definisinya" },
    ],
    summary: [
      "Hitung ulang dari data mentah: CAC jujur Rp 2.070.785 vs Rp 1.800.685 versi dashboard (selisih 15,0% = fee agensi yang disembunyikan); MAU kamus 2.400 vs 3.153 versi growth (bot 14,27%); atribusi last-touch menobatkan search di jendela 7 hari dan social di jendela 30 hari.",
      "Empat pola manipulasi definisi: pembilang dipangkas (fee), bot dihitung sebagai user, definisi diganti tanpa changelog, jendela atribusi diganti tengah kuartal tanpa anotasi.",
      "Keputusan atas dashboard bohong selalu punya harga: kamus+beku (pahit di awal, benar di akhir), footnote (transparansi kosmetik), umumkan-sekarang (kebenaran tanpa wadah = kekacauan yang jujur).",
      "Atribusi last-touch adalah aturan akuntansi, bukan vonis kausal — uji sensitivitas parameter wajib sebelum keputusan budget.",
      "Data: 100% SINTETIS (generator seed 42) — spend_harian.csv, event_marketing.csv, aktivitas_user.csv, definisi_metrik.csv; snapshot + METODE.md (CC0) di public/misi/misi-gabung-dashboard-jujur/.",
    ],
  },
];

(misiGabungDashboardJujur.steps as V2Step[]).push(...LANJUTAN_DASHBOARD);
