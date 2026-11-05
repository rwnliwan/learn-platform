import type { V2Mission } from "../lib/types";

// ── MISI Dua Sumber: Laporan di Tengah Perang Data ────────────────────────
// M1 — Risk Reporting Misi B (edge: ambiguitas, sinyal konflik, tanpa jawaban
// tunggal yang bersih). Basis data SAMA dengan Misi A (Statlog German Credit,
// UCI, CC BY 4.0) — tetapi sudutnya BEDA: dua ekstrak sistem yang bertengkar
// + koreksi last-minute dari bisnis. Perbedaan definisi antar-sistem
// DISIMULASIKAN dan dinyatakan eksplisit (bukan temuan forensik sungguhan).
// File: public/misi/misi-laporan-dua-sumber/core_banking.csv,
// risk_mart.csv, koreksi_bisnis.csv. Metode: METODE.md.

const BASE = "/misi/misi-laporan-dua-sumber";

export const misiDuaSumber: V2Mission = {
  slug: "misi-laporan-dua-sumber",
  track: "Risk Reporting",
  module: "Misi",
  title: "Misi Dua Sumber: Laporan di Tengah Perang Data",
  estMinutes: 165,
  role: "Analis pelaporan risiko senior",
  client:
    "Direktur Kepatuhan — laporan risiko harus terbit 3 hari lagi, tetapi dua sistem melaporkan NPL berbeda dan unit bisnis mengirim “koreksi” last-minute",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Dua sistem, dua kebenaran",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis pelaporan risiko senior — penengah perang data",
        client:
          "Direktur Kepatuhan. Laporan risiko triwulanan harus terbit tiga hari lagi. Masalahnya: core banking melaporkan NPL 30,0%, risk data mart melaporkan 31,4%. Selisih 1,4 poin persentase — di atas ambang materialitas bank (0,5 pp). Pagi ini unit bisnis mengirim file “koreksi” 12 baris yang mengklaim data mart salah. Tiga sumber, tiga angka. Kamu harus memutuskan angka mana yang terbit — dan apa yang diungkapkan ke publik.",
        story: [
          "Senin, 08:15. Tiga file mendarat di mejamu dalam satu jam: ekstrak core banking (NPL 30,0%), ekstrak risk mart (NPL 31,4%), dan — yang paling meresahkan — email dari unit bisnis dengan lampiran `koreksi_bisnis.csv`: “12 baris di mart salah input, ini yang benar.”",
          "Kamu menatap angka-angkanya. Selisih 1,4 poin persentase di atas ambang materialitas 0,5 pp berarti ini BUKAN masalah administratif — ini masalah tata kelola. Dan “koreksi” dari unit bisnis? Unit bisnis adalah pihak yang target bonusnya bergantung pada NPL yang rendah. Kamu tidak menuduh — tapi kamu juga tidak akan menelan mentah-mentah.",
          "Misi ini lebih kotor dari misi rekonsiliasi kemarin. Di sana ada satu kebenaran dan satu kebohongan. Di sini ada TIGA versi kebenaran yang masing-masing punya pembenaran — dan tidak ada oracle yang bilang mana yang benar. Ini melatih hal yang tidak bisa diajarkan rumus: PENILAIAN di tengah ambiguitas. (Catatan jujur: perbedaan definisi antar-sistem di misi ini DISIMULASIKAN dari satu loan book yang sama — dinyatakan eksplisit agar kamu tidak mengira ini forensik atas bank sungguhan.)",
        ],
        objectives: [
          "Mengukur perselisihan: berapa baris berbeda status, NPL tiap sumber, dan di tujuan kredit mana selisihnya terbesar.",
          "Menguji “koreksi” unit bisnis: apakah ia mendekatkan mart ke core — atau justru menjauhkan?",
          "Memutuskan angka publikasi + paket disclosure (apa yang diungkapkan, apa ambangnya), menemukan 4 sabotase di nota publikasi, dan menulis nota publikasi yang bisa dipertahankan.",
        ],
        prereqSummary:
          "Golden source = satu sumber yang disepakati sebagai acuan kebenaran untuk pelaporan. Rekonsiliasi sumber = membandingkan dua sistem baris-per-baris untuk mengukur bedanya. Materialitas = ambang selisih yang mengubah keputusan pembaca (di bank ini 0,5 pp untuk NPL). Disclosure = pengungkapan jujur atas keterbatasan/ketidakpastian angka yang diterbitkan — analis yang baik tidak menyembunyikan ambiguitas, ia mengelolanya secara terbuka.",
        datasetNote:
          "Sumber: Statlog German Credit Data, UCI ML Repository — CC BY 4.0 (terverifikasi 2026-10-15; atribusi: Prof. Dr. Hans Hofmann via UCI).\nFile: core_banking.csv (1.000 baris, definisi core), risk_mart.csv (1.000 baris — 30 baris status DIBALIK untuk mensimulasikan perbedaan definisi as-of antar sistem; seed 42), koreksi_bisnis.csv (12 baris “koreksi” dari unit bisnis atas data mart).\nKejujuran: perbedaan antar-sistem DISIMULASIKAN (dinyatakan di briefing); tujuan = melatih penilaian, bukan menemukan jawaban tersembunyi. Metode: METODE.md.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, tiga cerita",
      prose: [
        "`core_banking.csv` — ekstrak sistem core banking per 30 Juni: 1.000 baris, kolom sama dengan loan book misi kemarin. Ini sumber yang dipakai operasional harian.",
        "`risk_mart.csv` — ekstrak risk data mart, tanggal as-of sama: 1.000 baris, kolom sama. Tiga puluh baris statusnya BERBEDA dari core — mensimulasikan perbedaan definisi as-of (mis. core memakai status akhir hari, mart memakai status penutupan bulan dengan perlakuan berbeda atas restrukturisasi).",
        "`koreksi_bisnis.csv` — 12 baris dari unit bisnis: `id, tujuan, plafon_kredit, status_mart, status_koreksi`. Klaimnya: 12 baris mart salah input. Kamu akan mengujinya di Lab 2 — jangan percaya dulu.",
        "Aturan main: (1) ukur dulu, nilai kemudian — kuantifikasi selisih SEBELUM memutuskan; (2) “koreksi” dari pihak yang berkepentingan diperlakukan sebagai HIPOTESIS, bukan fakta; (3) setiap angka publikasi wajib ditemani disclosure.",
      ],
      tasks: [
        { id: "t1", text: "Buka ketiga file: catat jumlah baris dan kolom masing-masing" },
        { id: "t2", text: "Baca 12 baris `koreksi_bisnis.csv`: apa yang diklaim berubah?" },
      ],
      note: {
        title: "Miskonsepsi #1: ada satu “data yang benar”",
        type: "pitfall",
        body: "Insting: “pasti salah satu sistem yang salah.” Kenyataannya di perbankan: dua sistem bisa BEDA dan keduanya “benar” menurut definisinya masing-masing (as-of berbeda, perlakuan restrukturisasi berbeda, timing cut-off berbeda). Pekerjaanmu bukan mencari siapa yang salah — melainkan memutuskan DEFINISI mana yang dipakai publikasi, dan mengungkapkannya.",
      },
      reference:
        "core_banking.csv vs risk_mart.csv (30 baris beda) vs koreksi_bisnis.csv (12 baris klaim). Ukur → uji koreksi → putuskan + ungkapkan.",
    },
    {
      id: "lab-selisih",
      eyebrow: "Langkah 3 · Lab 1 — Ukur perangnya",
      title: "Seberapa besar sebenarnya selisihnya?",
      prose: [
        "Kuantifikasi dulu. Dari kedua ekstrak: (1) NPL masing-masing dan selisihnya dalam poin persentase; (2) tepat berapa baris statusnya berbeda; (3) di tujuan kredit mana selisih NPL-nya terbesar — dan berapa n-nya (sampel kecil = hati-hati menafsir).",
        "Angka-angka ini menentukan segalanya: di atas ambang materialitas 0,5 pp berarti masalah tata kelola; di bawahnya berarti masalah administratif.",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua CSV; hitung `n_core`, `n_mart`" },
        { id: "t2", text: "`npl_core`, `npl_mart`, `gap_pp` (= mart − core)" },
        { id: "t3", text: "`n_beda` = baris dengan status berbeda" },
        { id: "t4", text: "Tujuan dengan gap NPL terbesar: `tujuan_gap_max`, `gap_max`" },
      ],
      expected:
        "n=1000/1000; NPL core 30,0 vs mart 31,4 → gap 1,4 pp (material!); 30 baris beda; gap terbesar: pelatihan ulang 11,11 pp (n=9 — kecil!)",
      note: {
        title: "Miskonsepsi #2: selisih terbesar = masalah terbesar",
        type: "pitfall",
        body: "Gap terbesar ada di “pelatihan ulang”: 11,11 poin persentase — terdengar mengerikan. Tapi n=9: satu baris berubah = 11 poin bergerak. Selisih besar pada sampel kecil adalah NOISE, bukan sinyal. Analis yang baik selalu menimbang BESAR selisih dengan BESAR sampelnya. (Bandingkan: “usaha” gap 2,06 pp tapi n=97 — jauh lebih solid.)",
      },
      hints: [
        "Muat dua CSV: `from pyodide.http import open_url`; URL per file di bawah.",
        "NPL: `(df[\"status\"]==\"macet\").mean()*100` untuk masing-masing.",
        "Baris beda: `(core[\"status\"] != mart[\"status\"]).sum()` — urutan baris sama (id 1..1000).",
        "Gap per tujuan: groupby tiap file, selisih, `.abs().idxmax()` / `.max()`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "C = \"/misi/misi-laporan-dua-sumber/core_banking.csv\"",
          "M = \"/misi/misi-laporan-dua-sumber/risk_mart.csv\"",
          "",
          "# TUGASMU: lengkapi ... di bawah",
          "core = pd.read_csv(open_url(C))",
          "mart = pd.read_csv(open_url(M))",
          "",
          "n_core, n_mart = ..., ...",
          "npl_core = ...",
          "npl_mart = ...",
          "gap_pp = ...",
          "n_beda = ...",
          "",
          "g_core = core.groupby(\"tujuan\")[\"status\"].apply(lambda s: (s==\"macet\").mean()*100)",
          "g_mart = mart.groupby(\"tujuan\")[\"status\"].apply(lambda s: (s==\"macet\").mean()*100)",
          "gap = ...",
          "tujuan_gap_max = ...",
          "gap_max = ...",
          "",
          "print(\"NPL core:\", round(npl_core,1), \"| mart:\", round(npl_mart,1), \"| gap:\", round(gap_pp,2), \"pp\")",
          "print(\"baris beda:\", n_beda)",
          "print(\"gap terbesar:\", tujuan_gap_max, round(gap_max,2))",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "C = \"/misi/misi-laporan-dua-sumber/core_banking.csv\"",
          "M = \"/misi/misi-laporan-dua-sumber/risk_mart.csv\"",
          "",
          "# TUGASMU: lengkapi ... di bawah",
          "core = pd.read_csv(open_url(C))",
          "mart = pd.read_csv(open_url(M))",
          "",
          "n_core, n_mart = len(core), len(mart)",
          "npl_core = (core[\"status\"]==\"macet\").mean()*100",
          "npl_mart = (mart[\"status\"]==\"macet\").mean()*100",
          "gap_pp = npl_mart - npl_core",
          "n_beda = int((core[\"status\"] != mart[\"status\"]).sum())",
          "",
          "g_core = core.groupby(\"tujuan\")[\"status\"].apply(lambda s: (s==\"macet\").mean()*100)",
          "g_mart = mart.groupby(\"tujuan\")[\"status\"].apply(lambda s: (s==\"macet\").mean()*100)",
          "gap = (g_mart - g_core).abs()",
          "tujuan_gap_max = gap.idxmax()",
          "gap_max = float(gap.max())",
          "",
          "print(\"NPL core:\", round(npl_core,1), \"| mart:\", round(npl_mart,1), \"| gap:\", round(gap_pp,2), \"pp\")",
          "print(\"baris beda:\", n_beda)",
          "print(\"gap terbesar:\", tujuan_gap_max, round(gap_max,2))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "kedua file termuat", name: "mart", msg: "mart harus berisi DataFrame risk_mart.csv." },
          { kind: "equal", task: "t2", label: "`npl_core` = 30,0", name: "npl_core", value: 30.0, tol: 0.01, msg: "NPL core banking." },
          { kind: "equal", task: "t2", label: "`npl_mart` = 31,4", name: "npl_mart", value: 31.4, tol: 0.01, msg: "NPL risk mart." },
          { kind: "equal", task: "t2", label: "`gap_pp` = 1,4", name: "gap_pp", value: 1.4, tol: 0.01, msg: "Selisih mart − core. Di atas ambang materialitas 0,5 pp!" },
          { kind: "equal", task: "t3", label: "`n_beda` = 30", name: "n_beda", value: 30, msg: "30 baris statusnya berbeda." },
          { kind: "equal", task: "t4", label: "gap terbesar = pelatihan ulang", name: "tujuan_gap_max", value: "pelatihan ulang", msg: "Tapi ingat n=9 — noise, bukan sinyal." },
          { kind: "equal", task: "t4", label: "`gap_max` ≈ 11,11", name: "gap_max", value: 11.11, tol: 0.01, msg: "11,11 poin persentase pada n=9." },
        ],
      },
    },
    {
      id: "lab-koreksi",
      eyebrow: "Langkah 4 · Lab 2 — Uji “koreksi” bisnis",
      title: "Koreksi yang mengoreksi — atau mengaburkan?",
      prose: [
        "Sekarang uji hipotesis unit bisnis. Terapkan `koreksi_bisnis.csv` ke data mart (ganti `status` mart dengan `status_koreksi` untuk 12 id tersebut), lalu hitung: (1) NPL mart SETELAH koreksi; (2) berapa dari 12 koreksi yang hasilnya SAMA dengan core (kembali ke core); (3) sisa gap vs core.",
        "Pertanyaan yang harus dijawab angka: apakah koreksi ini MENDEKATKAN mart ke core (koreksi jujur) atau MENJAUHKAN (koreksi bermotif)?",
      ],
      tasks: [
        { id: "t1", text: "Terapkan koreksi ke mart; hitung `npl_mart_koreksi`" },
        { id: "t2", text: "`kembali_ke_core` = koreksi yang hasilnya = status core" },
        { id: "t3", text: "`gap_sisa` = npl_mart_koreksi − npl_core; vonis: mendekat/menjauh?" },
      ],
      expected:
        "NPL mart+koreksi = 31,1% (dari 31,4%); 11 dari 12 kembali ke core; gap tersisa 1,1 pp — mendekat TAPI tidak menutup",
      note: {
        title: "Miskonsepsi #3: koreksi sebagian = masalah selesai",
        type: "pitfall",
        body: "“Sudah dikoreksi, kan?” Koreksi 12 baris menurunkan gap dari 1,4 ke 1,1 pp — masih di atas ambang materialitas 0,5 pp. Koreksi yang TIDAK menutup gap sampai di bawah ambang = masalah BELUM selesai, hanya mengecil. Jangan biarkan kata “koreksi” menghentikan investigasi.",
      },
      hints: [
        "Muat koreksi_bisnis.csv — kolom: id, tujuan, plafon_kredit, status_mart, status_koreksi.",
        "Terapkan: untuk tiap baris koreksi, `mart.loc[mart[\"id\"]==id, \"status\"] = status_koreksi`.",
        "Bandingkan dengan core: `(mart_baru[\"status\"] == core[\"status\"])` pada 12 id koreksi.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "B = \"/misi/misi-laporan-dua-sumber/\"",
          "core = pd.read_csv(open_url(B + \"core_banking.csv\"))",
          "mart = pd.read_csv(open_url(B + \"risk_mart.csv\"))",
          "kor = pd.read_csv(open_url(B + \"koreksi_bisnis.csv\"))",
          "",
          "# TUGASMU: lengkapi ... di bawah",
          "mart2 = mart.copy()",
          "for _, r in kor.iterrows():",
          "    mart2.loc[mart2[\"id\"] == r[\"id\"], \"status\"] = ...",
          "",
          "npl_mart_koreksi = ...",
          "npl_core = (core[\"status\"]==\"macet\").mean()*100",
          "kembali_ke_core = ...  # dari 12 id koreksi, berapa yang kini = core",
          "gap_sisa = ...",
          "",
          "print(\"NPL mart+koreksi:\", round(npl_mart_koreksi, 2))",
          "print(\"kembali ke core:\", kembali_ke_core, \"/ 12\")",
          "print(\"gap sisa:\", round(gap_sisa, 2), \"pp\")",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "B = \"/misi/misi-laporan-dua-sumber/\"",
          "core = pd.read_csv(open_url(B + \"core_banking.csv\"))",
          "mart = pd.read_csv(open_url(B + \"risk_mart.csv\"))",
          "kor = pd.read_csv(open_url(B + \"koreksi_bisnis.csv\"))",
          "",
          "# TUGASMU: lengkapi ... di bawah",
          "mart2 = mart.copy()",
          "for _, r in kor.iterrows():",
          "    mart2.loc[mart2[\"id\"] == r[\"id\"], \"status\"] = r[\"status_koreksi\"]",
          "",
          "npl_mart_koreksi = (mart2[\"status\"]==\"macet\").mean()*100",
          "npl_core = (core[\"status\"]==\"macet\").mean()*100",
          "kembali_ke_core = int((mart2.set_index(\"id\").loc[kor[\"id\"], \"status\"].values == core.set_index(\"id\").loc[kor[\"id\"], \"status\"].values).sum())",
          "gap_sisa = npl_mart_koreksi - npl_core",
          "",
          "print(\"NPL mart+koreksi:\", round(npl_mart_koreksi, 2))",
          "print(\"kembali ke core:\", kembali_ke_core, \"/ 12\")",
          "print(\"gap sisa:\", round(gap_sisa, 2), \"pp\")",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`mart2` terbentuk", name: "mart2", msg: "mart2 = salinan mart dengan 12 status diganti." },
          { kind: "equal", task: "t1", label: "`npl_mart_koreksi` = 31,1", name: "npl_mart_koreksi", value: 31.1, tol: 0.05, msg: "NPL mart setelah 12 koreksi diterapkan." },
          { kind: "equal", task: "t2", label: "`kembali_ke_core` = 11", name: "kembali_ke_core", value: 11, msg: "11 dari 12 koreksi mengembalikan ke status core — 1 justru menjauh." },
          { kind: "equal", task: "t3", label: "`gap_sisa` = 1,1", name: "gap_sisa", value: 1.1, tol: 0.05, msg: "Masih di atas ambang 0,5 pp — masalah belum selesai." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 5 · Lab 3 — Peta selisih",
      title: "Di tujuan mana perangnya paling panas?",
      prose: [
        "Selisih agregat 1,4 pp menyembunyikan sebaran: di beberapa tujuan selisihnya besar, di lainnya nol. Petakan dengan SQL: dari tabel `selisih(tujuan TEXT, npl_core REAL, npl_mart REAL)`, tampilkan tujuan dengan gap LEBIH DARI 2 poin persentase, urut dari gap terbesar.",
        "Ini menentukan di mana investigasi definisi harus difokuskan — bukan ke “pelatihan ulang” yang n=9, melainkan ke tujuan bervolume dengan gap solid.",
      ],
      tasks: [
        { id: "t1", text: "Query tujuan dengan gap > 2 pp, urut gap terbesar" },
      ],
      expected: "6 tujuan — terbesar: pelatihan ulang 11,11; renovasi 9,09; lainnya 8,33; …",
      sqlLab: {
        task: "Tampilkan tujuan dengan selisih NPL > 2 pp: kolom tujuan + gap_pp (= |npl_mart - npl_core|, 2 desimal), urut gap terbesar.",
        schema: "CREATE TABLE selisih (tujuan TEXT, npl_core REAL, npl_mart REAL);",
        seedData: [
          "INSERT INTO selisih VALUES",
          "('furnitur/elektronik',32.04,32.04),",
          "('lainnya',41.67,50.0),",
          "('mobil baru',38.03,38.03),",
          "('mobil bekas',16.5,19.42),",
          "('pelatihan ulang',11.11,0.0),",
          "('pendidikan',44.0,44.0),",
          "('peralatan rumah tangga',33.33,33.33),",
          "('radio/televisi',22.14,24.64),",
          "('renovasi',36.36,27.27),",
          "('usaha',35.05,37.11);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT tujuan, ABS(npl_mart - npl_core) AS gap_pp\nFROM selisih\n",
        solution: [
          "SELECT tujuan, ROUND(ABS(npl_mart - npl_core), 2) AS gap_pp",
          "FROM selisih",
          "WHERE ABS(npl_mart - npl_core) > 2",
          "ORDER BY gap_pp DESC;",
        ].join("\n"),
        expectedColumns: ["tujuan", "gap_pp"],
        expectedRows: [
          ["pelatihan ulang", 11.11],
          ["renovasi", 9.09],
          ["lainnya", 8.33],
          ["mobil bekas", 2.92],
          ["radio/televisi", 2.5],
          ["usaha", 2.06],
        ],
        orderMatters: true,
        floatTol: 0.011,
      },
    },
    {
      id: "ambang",
      eyebrow: "Langkah 6 · Ambang materialitas",
      title: "Kapan selisih menjadi masalah?",
      prose: [
        "Bank ini menetapkan ambang materialitas NPL = 0,5 poin persentase: selisih di atas itu WAJIB diungkapkan dan dijelaskan di laporan publikasi; di bawahnya cukup catatan administratif. Kamu memegang: gap awal 1,4 pp → gap setelah koreksi 1,1 pp.",
        "Vonismu: (1) apakah gap awal material? (2) apakah “koreksi” bisnis menyelesaikan masalah materialitas? (3) apa implikasi untuk keputusan publikasi — angka mana pun yang kamu pilih, selisihnya tetap material dan tetap wajib diungkapkan.",
        "Ini langkah tanpa kode — hanya penilaian. Tapi penilaiannya harus bisa dipertahankan: tulis jawabanmu sebagai catatan (akan dipakai di deliverable).",
      ],
      tasks: [
        { id: "t1", text: "Tentukan: gap 1,4 pp vs ambang 0,5 pp — material atau tidak?" },
        { id: "t2", text: "Tentukan: apakah koreksi (gap → 1,1 pp) menyelesaikan masalah materialitas?" },
        { id: "t3", text: "Tulis satu kalimat disclosure yang jujur untuk laporan publikasi" },
      ],
      note: {
        title: "Miskonsepsi #4: materialitas = besar-kecil angka",
        type: "pitfall",
        body: "“1,4 pp kan kecil.” Materialitas bukan soal besar-kecil absolut — melainkan soal AMBANG yang disepakati dan KEPERCAYAAN pembaca. 1,4 pp di atas ambang 0,5 pp = material, titik. Analis yang menilai materialitas dari “feeling besar-kecil” akan selalu meremehkan masalah yang menguntungkannya.",
      },
      reference:
        "Jawaban yang benar: (1) Ya, material (1,4 > 0,5). (2) Tidak — 1,1 pp masih > 0,5 pp. (3) Contoh: “NPL 30,0% (core banking); sistem risk mart mencatat 31,4% atas definisi as-of berbeda — selisih 1,4 pp, di atas ambang materialitas.”",
    },
  ],
};

export default misiDuaSumber;

// ── lanjutan misiDuaSumber: langkah 7–12 ─────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_DUASUMBER: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Angka mana yang terbit?",
    prose: [
      "Tiga hari menuju publikasi. Fakta di tanganmu: gap 1,4 pp (material), koreksi bisnis hanya menurunkan ke 1,1 pp (tetap material), 30 baris beda definisi, dan kamu tidak punya waktu untuk rekonsiliasi penuh 1.000 baris sebelum deadline. Keputusan publikasi ada di tanganmu — dan apapun yang kamu pilih, disclosure-nya wajib jujur.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Angka NPL mana yang diterbitkan — dan dengan disclosure apa? (Keputusan final.)",
      options: [
        {
          id: "opt-core",
          label: "Terbitkan NPL core (30,0%) + ungkapkan selisih mart",
          rationale:
            "Core banking adalah sistem operasional harian (auditable, rekonsiliasi harian). Selisih 1,4 pp diungkapkan eksplisit di catatan laporan.",
          nextStepId: "temuan-core",
          consequenceNote:
            "Laporan terbit tepat waktu dengan disclosure penuh. Seorang analis eksternal memuji transparansinya — dan unit bisnis kecewa karena “koreksi” mereka tidak dipakai. Tiga bulan kemudian definisi mart diselaraskan ke core; masalah hilang permanen.",
        },
        {
          id: "opt-mart",
          label: "Terbitkan NPL mart (31,4%) — angka konservatif",
          rationale:
            "Dalam keraguan, pilih angka yang lebih buruk (konservatif). Mart memakai definisi yang lebih ketat; menerbitkan yang konservatif melindungi dari tuduhan menyembunyikan risiko.",
          nextStepId: "temuan-mart",
          consequenceNote:
            "Angka konservatif terbit. Tapi komite bertanya: “kenapa berubah dari 30,0% kuartal lalu?” — dan kamu harus menjelaskan DUA hal sekaligus: kenaikan NPL dan perbedaan definisi. Konservatisme tanpa penjelasan = kebingungan.",
        },
        {
          id: "opt-tunda",
          label: "Tunda publikasi 2 minggu untuk rekonsiliasi penuh",
          rationale:
            "Selisih material + koreksi yang belum tuntas = laporan belum layak terbit. Minta penundaan resmi dengan alasan tertulis.",
          nextStepId: "temuan-tunda",
          consequenceNote:
            "Direktur Kepatuhan menolak penundaan — tenggat regulator tidak bisa digeser. Kamu tetap harus menerbitkan dalam 3 hari, kini dengan waktu lebih sedikit dan reputasi “orang yang hampir menunda”. Pelajaran: dalam pelaporan, “tunda” sering bukan opsi yang tersedia.",
        },
      ],
    },
  },
  {
    id: "temuan-core",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: core + disclosure penuh",
    prose: [
      "Laporan terbit: NPL 30,0% (core banking) dengan satu paragraf disclosure yang jujur tentang selisih 1,4 pp vs risk mart, definisi as-of yang berbeda, dan status koreksi bisnis. Paragraf itu — yang kamu tulis dengan berat hati — justru menjadi bagian laporan yang paling dipuji analis eksternal.",
      "Tiga bulan kemudian, tim data menyelaraskan definisi mart ke core. Selisih hilang bukan karena disembunyikan, melainkan karena diperbaiki. Itulah bedanya disclosure vs cover-up: yang pertama membangun sistem, yang kedua membangun bom waktu.",
    ],
    tasks: [],
    note: {
      title: "Disclosure yang baik itu spesifik",
      body: "“Terdapat perbedaan definisi antar sistem” = disclosure yang buruk (kabur). “Selisih 1,4 pp berasal dari 30 baris dengan perlakuan as-of berbeda; rincian di lampiran 7” = disclosure yang baik (terukur, terlacak).",
    },
  },
  {
    id: "temuan-mart",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: angka konservatif",
    prose: [
      "NPL 31,4% terbit. Secara prinsip kamu “aman” — tidak ada yang bisa menuduhmu menyembunyikan risiko. Tapi rapat komite berikutnya dihabiskan untuk DUA pertanyaan: (1) kenapa NPL naik dari 30,0%? (2) apa bedanya definisi mart vs core? Kamu menjawab keduanya — dengan disclosure yang seharusnya ditulis SEBELUM publikasi, bukan sesudah ditanya.",
      "Pelajaran: konservatisme adalah prinsip valuasi, bukan strategi komunikasi. Menerbitkan angka konservatif TANPA menjelaskan perbedaannya menciptakan kebingungan yang justru merusak kepercayaan — hal yang ingin kamu hindari.",
    ],
    tasks: [],
    note: {
      title: "Konservatif ≠ komunikatif",
      body: "Angka konservatif melindungi dari tuduhan optimisme; ia tidak melindungi dari pertanyaan. Setiap perubahan angka antar-periode wajib ditemani narasi perubahannya — itu pekerjaan pelaporan.",
    },
  },
  {
    id: "temuan-tunda",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: minta penundaan",
    prose: [
      "Kamu mengajukan penundaan resmi 2 minggu — dengan alasan tertulis yang solid. Direktur Kepatuhan membaca, mengangguk... dan menolak. Tenggat publikasi terikat kalender regulator; menggesernya butuh persetujuan yang tidak akan datang dalam 3 hari.",
      "Kamu kembali ke mejamu dengan waktu yang lebih sedikit dan satu pelajaran mahal: dalam pelaporan regulasi, “tunda sampai sempurna” hampir tidak pernah tersedia. Keahlian sebenarnya adalah menerbitkan yang TERBAIK dalam tenggat — dengan disclosure yang jujur atas ketidaksempurnaannya. Sempurna atau tidak terbit bukanlah pilihannya; yang ada: terbit dengan integritas, atau terbit tanpa itu.",
    ],
    tasks: [],
    note: {
      title: "Integritas dalam tenggat",
      body: "Analis junior menunggu kondisi sempurna. Analis senior menerbitkan yang terbaik yang bisa dipertahankan — dan menulis dengan jujur apa yang belum sempurna. Tenggat bukan alasan untuk angka palsu; ia alasan untuk disclosure yang lebih baik.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 14 baris: nota publikasi yang “siap terbit”",
    prose: [
      "Misi audit terakhir. Di bawah ini 14 baris “Nota Publikasi Laporan Risiko” — draf yang diklaim siap terbit. Empat sabotase disuntikkan. Senjatamu: gap 1,4 pp, ambang 0,5 pp, koreksi 11/12, dan naluri terhadap kata “tidak material”.",
    ],
    tasks: [],
    auditDossier: {
      version: "duasumber-m1b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Nota Publikasi Laporan Risiko yang siap terbit dalam 3 hari.",
      columns: ["Pos", "Nilai nota", "Keterangan"],
      rows: [
        { rowId: 1, cells: { "Pos": "NPL publikasi", "Nilai nota": "30,0%", "Keterangan": "core banking" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 2, cells: { "Pos": "NPL pembanding", "Nilai nota": "31,4%", "Keterangan": "risk mart" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 3, cells: { "Pos": "Selisih antar-sumber", "Nilai nota": "1,4 pp", "Keterangan": "30 baris beda definisi" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I1: klaim tidak material ──
        { rowId: 4, cells: { "Pos": "Penilaian selisih", "Nilai nota": "Tidak material", "Keterangan": "—" }, claims: [{ label: "Dasar", value: "Pertimbangan manajemen" }] },
        { rowId: 5, cells: { "Pos": "Ambang materialitas bank", "Nilai nota": "0,5 pp", "Keterangan": "kebijakan" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I2: as-of cherry-pick ──
        { rowId: 6, cells: { "Pos": "Tanggal as-of", "Nilai nota": "30 Juni", "Keterangan": "satu-satunya tanggal yang diuji" }, claims: [{ label: "Status", value: "Final" }] },
        { rowId: 7, cells: { "Pos": "Koreksi bisnis", "Nilai nota": "12 baris", "Keterangan": "11 kembali ke core" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 8, cells: { "Pos": "Gap setelah koreksi", "Nilai nota": "1,1 pp", "Keterangan": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I3: restatement diam-diam ──
        { rowId: 9, cells: { "Pos": "NPL Q1 (disajikan)", "Nilai nota": "28,9%", "Keterangan": "nota ini" }, claims: [{ label: "Status", value: "Final" }] },
        { rowId: 10, cells: { "Pos": "NPL Q1 (laporan terbit)", "Nilai nota": "29,4%", "Keterangan": "arsip" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I4: denominator switch ──
        { rowId: 11, cells: { "Pos": "Basis perhitungan", "Nilai nota": "970 kredit", "Keterangan": "30 dalam proses migrasi dikecualikan" }, claims: [{ label: "Status", value: "Final" }] },
        { rowId: 12, cells: { "Pos": "Total fasilitas", "Nilai nota": "1.000", "Keterangan": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 13, cells: { "Pos": "Sumber data", "Nilai nota": "core_banking.csv", "Keterangan": "1.000 baris" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 14, cells: { "Pos": "Rekomendasi", "Nilai nota": "Terbitkan", "Keterangan": "—" }, claims: [{ label: "Status", value: "Final" }] },
      ],
      injections: [
        { key: "tidak-material", rowIds: [4, 5], title: "Klaim “tidak material” vs ambang sendiri", clue: "Nota mengklaim selisih “tidak material” atas “pertimbangan manajemen” — sementara baris 5 menunjukkan ambang resmi bank: 0,5 pp. 1,4 > 0,5. “Pertimbangan manajemen” tidak bisa mengalahkan kebijakan tertulis.", danger: "Materialitas yang ditentukan perasaan = pintu bagi setiap angka yang tidak nyaman untuk dinyatakan “tidak material”. Ambang tertulis ada agar perasaan tidak ikut campur." },
        { key: "asof-cherrypick", rowIds: [6], title: "Satu tanggal as-of, tanpa sensitivitas", clue: "Hanya 30 Juni yang diuji — tidak ada uji tanggal lain, tidak ada rentang. Kalau selisih antar-sumber berfluktuasi per tanggal, satu titik waktu = satu kebohongan yang nyaman.", danger: "Angka point-in-time tanpa uji sensitivitas = presisi palsu. Selalu tanya: “bagaimana kalau as-of-nya digeser seminggu?”" },
        { key: "restatement-diam", rowIds: [9, 10], title: "Restatement diam-diam", clue: "NPL Q1 disajikan 28,9% di nota ini, padahal laporan Q1 yang terbit: 29,4%. Selisih 0,5 pp — tepat di ambang — diubah TANPA catatan restatement. Perbandingan antar-kuartal menjadi tidak valid.", danger: "Mengubah angka historis tanpa disclosure menghancurkan komparabilitas seluruh deret waktu. Restatement wajib diumumkan, dijelaskan, dan diberi label." },
        { key: "denominator-switch", rowIds: [11, 12], title: "Denominator berganti di tengah laporan", clue: "NPL dihitung dari 970 kredit (“30 dalam proses migrasi dikecualikan”) — sementara total fasilitas dinyatakan 1.000 di baris 12. Pengecualian 30 kredit mengecilkan denominator dan mempercantik rasio, tanpa penjelasan mengapa kredit migrasi tidak bisa macet.", danger: "Denominator yang berganti antar-bagian laporan = dua NPL berbeda dalam satu dokumen. Pembaca tidak akan sadar — kecuali kamu." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Nota publikasi yang bisa dipertahankan",
    prose: [
      "Tulis nota publikasi satu halaman — dokumen yang benar-benar akan terbit. Nota ini harus membuat analis eksternal yang skeptis tetap percaya: angka mana yang dipakai, berapa selisihnya, apa yang belum sempurna — semuanya tertulis.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Angka publikasi: NPL yang diterbitkan + sumber (definisi) yang dipakai — satu kalimat tegas.",
        "Selisih antar-sumber: 1,4 pp (30 baris), status koreksi bisnis (11/12), gap tersisa 1,1 pp — dengan tabel per tujuan untuk gap >2 pp.",
        "Penilaian materialitas: bandingkan dengan ambang 0,5 pp — nyatakan eksplisit: MATERIAL.",
        "Disclosure: apa yang belum sempurna (definisi belum selaras, satu tanggal as-of) dan rencana perbaikan (penyelarasan definisi kuartal depan).",
        "Jejak audit: sumber file, tanggal as-of, definisi denominator (1.000 penuh — tanpa pengecualian diam-diam).",
      ],
      rubric: [
        { criterion: "Ketegasan angka", weight: 20, levels: ["Angka kabur/dua versi", "Ada angka, definisi kabur", "Satu angka + definisi eksplisit"] },
        { criterion: "Kejujuran selisih", weight: 30, levels: ["Selisih disembunyikan", "Disebut tanpa angka", "1,4 pp + 30 baris + status koreksi — semua terukur"] },
        { criterion: "Materialitas", weight: 20, levels: ["Tidak dinilai", "Dinilai dari feeling", "Dibandingkan dengan ambang 0,5 pp → MATERIAL"] },
        { criterion: "Disclosure & jejak", weight: 30, levels: ["Tanpa disclosure", "Disclosure kabur", "Keterbatasan + rencana perbaikan + jejak audit eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di nota publikasi:",
      "1) **“Tidak material”** (baris 4–5): klaim atas “pertimbangan manajemen” — padahal ambang tertulis bank 0,5 pp dan selisihnya 1,4 pp. Hampir 3× ambang dinyatakan tidak material. Ini bukan perbedaan pendapat; ini pelanggaran kebijakan.",
      "2) **Satu as-of** (baris 6): hanya 30 Juni yang diuji. Angka point-in-time tanpa sensitivitas = presisi palsu.",
      "3) **Restatement diam-diam** (baris 9–10): Q1 diubah 29,4% → 28,9% tanpa catatan. Selisihnya tepat di ambang — “kebetulan” yang terlalu rapi untuk dipercaya.",
      "4) **Denominator switch** (baris 11–12): 970 vs 1.000. Tiga puluh kredit “dalam migrasi” dikeluarkan — tanpa penjelasan mengapa kredit migrasi kebal macet.",
      "Skor deteksimu (x/4) mengukur apakah kamu membaca nota seperti calon PEMBACA (percaya) atau seperti calon AUDITOR (curiga). Dan misi ini — yang paling “edge” — mengajarkan hal yang tidak ada di misi lain: kadang tidak ada jawaban benar. Core vs mart vs koreksi: ketiganya punya pembenaran. Yang membedakan analis senior dari junior bukan menemukan “yang benar”, melainkan MEMUTUSKAN dengan sadar dan MENGUNGKAPKAN apa yang tidak pasti.",
      "Bahaya nyata terakhir: laporan risiko yang menyembunyikan ambiguitas bukan melindungi bank — ia meminjam kepercayaan dengan bunga. Ketika ambiguitas itu meledak (dan ia selalu meledak), yang hilang bukan cuma angka — melainkan hak untuk dipercaya pada laporan berikutnya.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #5 (bonus): disclosure = kelemahan",
      type: "risk",
      body: "Banyak analis takut disclosure (“nanti dikira tidak becus”). Kenyataannya terbalik: analis yang mengungkapkan keterbatasan justru dipercaya LEBIH — karena pembaca tahu ia tidak menyembunyikan apa-apa. Yang merusak kepercayaan bukan ambiguitas yang diungkapkan, melainkan kepastian yang dipalsukan.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 12 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Ukur dulu: NPL core 30,0% vs mart 31,4% → gap 1,4 pp (material, > ambang 0,5 pp); 30 baris beda; gap terbesar “pelatihan ulang” 11,11 pp pada n=9 = noise.",
      "Uji koreksi: 11/12 kembali ke core; gap tersisa 1,1 pp — mendekat tapi tetap material; “sudah dikoreksi” ≠ selesai.",
      "Kadang tidak ada jawaban benar: putuskan (core/mart/tunda) dengan sadar + disclosure penuh atas yang tidak pasti.",
      "Empat sabotase nota: klaim tidak material vs ambang, satu as-of tanpa sensitivitas, restatement diam-diam, denominator switch.",
      "Data: Statlog German Credit (CC BY 4.0), dua ekstrak simulasi definisi (seed 42), dibekukan 2026-10-15; perbedaan antar-sistem disimulasikan & dinyatakan.",
    ],
  },
];

(misiDuaSumber.steps as V2Step[]).push(...LANJUTAN_DUASUMBER);
