import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI Triase: Antrean yang Penuh Sesak ─────────────────────────────────
// M2 — WorldQuant Brain Misi A (solo). Dataset SINTETIS: 40 kandidat alpha
// fiksi (seed 42) — BUKAN data asli, TANPA ekspresi alpha mentah.
// File: public/misi/misi-triage-alpha/kandidat_alpha.csv (40 baris).
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-triage-alpha";

export const misiTriage: V2Mission = {
  slug: "misi-triage-alpha",
  track: "WorldQuant Brain",
  module: "Misi",
  title: "Misi Triase: Antrean yang Penuh Sesak",
  estMinutes: 150,
  role: "Analis kuantitatif",
  client:
    "Kepala riset kuantitatif — 40 kandidat alpha menunggu triase sebelum review manual; slot review terbatas, antrean harus jujur",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Empat puluh kandidat, lima slot review",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis kuantitatif di tim riset — penjaga gerbang antrean alpha",
        client:
          "Kepala riset kuantitatif. Batch semalam menghasilkan 40 kandidat alpha dan semuanya mengklaim “layak direview”. Kenyataannya: tim review manual hanya punya 5 slot minggu ini. Tugasmu bukan me-review 40-40nya — itu mustahil — melainkan men-triase: menerapkan aturan empat kategori (ANTRIAN / PENALTI / TAHAN / BUANG) secara konsisten ke semua kandidat, lalu memprioritaskan 5 yang paling pantas. Aturan triase tidak boleh dinegosiasi per kandidat — kalau aturan bengkok untuk satu, antrean kehilangan maknanya.",
        story: [
          "Senin, 08:12. Notifikasi batch semalam masuk: 40 kandidat alpha baru, semuanya dengan Sharpe di atas 1 — di atas kertas semuanya terlihat menjanjikan. Kamu sudah melihat film ini sebelumnya: tiga bulan lalu, antrean yang “penuh sesak” ternyata berisi 11 duplikat terselubung dan 6 kandidat yang turnover-nya dimanipulasi agar lolos ambang. Tim review menghabiskan dua minggu untuk sampah.",
          "Sejak itu tim punya aturan triase tertulis — empat kategori, ambang eksplisit, tanpa pengecualian. ANTRIAN (S≥1.4 & F≥1.1 & TO≤40%) berarti siap direview. PENALTI (TO>40%) berarti dikembalikan untuk diperbaiki. TAHAN (S<1.4 atau F<1.1) berarti belum cukup bukti. BUANG (S<1.25 atau F<1) berarti selesai — tidak ada drama.",
          "Pagi ini ada tambahan: seseorang mengirim “laporan triase” yang mengklaim sudah menerapkan aturan itu dengan patuh. Kamu mencium sesuatu yang aneh dari angkanya. Misi ini: triase sendiri dari data mentah, prioritaskan 5 kandidat, lalu audit laporan “patuh aturan” itu — karena antrean yang tidak jujur lebih berbahaya daripada antrean yang kosong.",
        ],
        objectives: [
          "Menerapkan aturan triase empat kategori secara konsisten ke 40 kandidat dan menghitung komposisi antrean (berapa ANTRIAN / PENALTI / TAHAN / BUANG).",
          "Memprioritaskan 5 kandidat untuk review manual memakai skor gabungan 0,6×Sharpe + 0,4×fitness plus diversifikasi universe.",
          "Menemukan 4 sabotase di laporan triase “patuh aturan” dan menulis daftar triase final dengan justifikasi per kandidat.",
        ],
        prereqSummary:
          "Alpha = sebuah formula sinyal trading (aturan “kapan beli/jual” yang bisa diuji). Sharpe = ukuran return per unit risiko — makin tinggi makin bagus, tapi angka kotor bisa menipu (lihat Misi Turnover). Turnover = seberapa sering posisi berganti; turnover di atas 40% biasanya berarti biaya menggerogoti return. Self-correlation = kemiripan sebuah alpha dengan alpha yang sudah ada; aturan praktisnya: kemiripan di atas 0,7 = duplikat, jangan submit.",
        datasetNote:
          "Data 100% SINTETIS: 40 kandidat alpha fiksi hasil generator acak (seed 42) — BUKAN data asli, BUKAN antrean submit siapa pun, TANPA ekspresi alpha mentah, TANPA kredensial/data akun.\nFile: kandidat_alpha.csv — kolom id, sharpe, fitness, turnover (persen), self_corr_bucket (<0.3 / 0.3-0.5 / 0.5-0.7 / >0.7), universe (USA/ASI/EUR/GLB).\nMetode & batas jujur: file METODE.md di folder yang sama. Ambang triase di misi ini disederhanakan untuk latihan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Empat puluh baris kebenaran mentah",
      prose: [
        "File `kandidat_alpha.csv` adalah satu-satunya sumber kebenaran di misi ini: 40 baris, 6 kolom, tanpa kolom “kategori” — karena kategori adalah KEPUTUSANMU, bukan data. Setiap baris adalah satu kandidat fiksi: `id` (kode kandidat), `sharpe`, `fitness` (skor gabungan kualitas ala platform), `turnover` (persen, seberapa sering posisi berganti), `self_corr_bucket` (bucket kemiripan dengan alpha yang sudah ada), dan `universe` (pasar tempat sinyal diuji: USA/ASI/EUR/GLB).",
        "Data ini SINTETIS (seed 42) — dinyatakan eksplisit agar tidak ada yang mengira ini bocoran antrean asli. Justru karena sintetis, kamu bisa fokus pada keterampilannya: menerapkan aturan secara konsisten tanpa tergoda “kandidat favorit”.",
        "Aturan main triase (urutan prioritas, tidak bisa ditawar): (1) BUANG dulu — S<1.25 atau F<1; (2) PENALTI — turnover>40%; (3) ANTRIAN — S≥1.4 & F≥1.1 & TO≤40%; (4) sisanya TAHAN. Catat: kandidat dengan bucket self-corr >0,7 sebaiknya tidak diprioritaskan untuk review — kemungkinan besar duplikat dari alpha yang sudah ada.",
      ],
      tasks: [
        { id: "t1", text: "Buka `kandidat_alpha.csv`: catat jumlah baris dan nama kolomnya" },
        { id: "t2", text: "Temukan kandidat dengan Sharpe tertinggi dan turnover tertinggi — catat ID keduanya" },
      ],
      note: {
        title: "Miskonsepsi #1: Sharpe tinggi = alpha bagus",
        type: "pitfall",
        body: "“Sharpe 2,19 pasti alpha terbaik batch ini.” Belum tentu — AX-031 punya Sharpe 2,19 TERTINGGI di file ini, tapi fitness-nya 0,87 (<1) → kategori BUANG menurut aturan. Sharpe tinggi dengan fitness rendah artinya sinyalnya tidak konsisten di berbagai kondisi. Aturan triase ada justru untuk menangkap kasus seperti ini: angka yang memukau, fondasi yang rapuh.",
      },
      reference:
        "kandidat_alpha.csv (40 baris SINTETIS, seed 42) — satu-satunya sumber kebenaran; kategori dihitung, bukan dibaca. Aturan prioritas: BUANG > PENALTI > ANTRIAN > TAHAN.",
    },
    {
      id: "lab-triage",
      eyebrow: "Langkah 3 · Lab 1 — Triase 40 kandidat",
      title: "Terapkan aturan. Tanpa pengecualian.",
      prose: [
        "Sekarang lakukan triase seperti mesin: terapkan aturan empat kategori ke semua 40 kandidat sekaligus dengan pandas, lalu hitung komposisinya. Setelah itu hitung skor gabungan (0,6×Sharpe + 0,4×fitness) untuk kandidat ANTRIAN — inilah bahan prioritasi 5 slot review di Langkah 5.",
        "Perhatikan urutan prioritas aturan: cek BUANG dulu, lalu PENALTI, lalu ANTRIAN. Urutan ini penting — kandidat dengan turnover 53,8% DAN Sharpe 1,30 (AX-039) adalah PENALTI atau BUANG? Jawabannya BUANG, karena cek BUANG (S<1.25? tidak — 1,30; F<1? tidak) … tunggu, hitung sendiri di lab. Itulah gunanya kode: menghilangkan tebak-tebakan.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke `df`; terapkan fungsi `kategori` ke semua baris" },
        { id: "t2", text: "Hitung `n_antrian`, `n_tahan`, `n_buang`, `n_penalti`" },
        { id: "t3", text: "Hitung skor gabungan ANTRIAN; temukan `id_terbaik` dan `to_maks_antrian`" },
      ],
      expected:
        "n_antrian=13, n_tahan=13, n_buang=9, n_penalti=5; skor tertinggi AX-036 (1,654); turnover tertinggi di antrean 39,2% (AX-009 — nyaris kena penalti!)",
      formula: String.raw`\text{skor} = 0{,}6 \times S + 0{,}4 \times F`,
      formulaNote:
        "S = Sharpe, F = fitness. Contoh: AX-036 → 0,6×1,89 + 0,4×1,30 = 1,654. Skor ini BUKAN metrik resmi — hanya alat bantu prioritasi di misi ini: ia menghargai kandidat yang kuat di KEDUA metrik sekaligus, bukan yang timpang.",
      note: {
        title: "Miskonsepsi #2: aturan boleh dilenturkan untuk kandidat “hampir lolos”",
        type: "pitfall",
        body: "“AX-009 turnover-nya 39,2%, cuma 0,8 poin dari penalti — anggap penalti saja biar aman.” Jangan. Aturan dengan ambang yang digeser seenaknya bukan aturan. Kalau 39,2% kamu geser, kenapa tidak 39,9%? Kenapa tidak 40,5%? Antrean yang jujur = aturan yang sama untuk baris 1 dan baris 40. Ketidaknyamananmu terhadap kasus batas adalah HARGA dari konsistensi — bayar.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "Terapkan fungsi per baris: `df[\"kategori\"] = df.apply(kategori, axis=1)` — fungsi `kategori` sudah disediakan.",
        "Hitung komposisi: `(df[\"kategori\"] == \"ANTRIAN\").sum()` untuk tiap kategori.",
        "Skor: `(0.6 * df[\"sharpe\"] + 0.4 * df[\"fitness\"]).round(3)`; saring ANTRIAN lalu `sort_values(\"skor\", ascending=False)`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-triage-alpha/kandidat_alpha.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "def kategori(r):",
          "    if r[\"sharpe\"] < 1.25 or r[\"fitness\"] < 1.0:",
          "        return \"BUANG\"",
          "    if r[\"turnover\"] > 40:",
          "        return \"PENALTI\"",
          "    if r[\"sharpe\"] >= 1.4 and r[\"fitness\"] >= 1.1:",
          "        return \"ANTRIAN\"",
          "    return \"TAHAN\"",
          "",
          "df[\"kategori\"] = ...",
          "",
          "n_antrian = ...",
          "n_tahan = ...",
          "n_buang = ...",
          "n_penalti = ...",
          "",
          "df[\"skor\"] = ...            # skor gabungan = 0.6*S + 0.4*F",
          "antrian = ...                # hanya baris ANTRIAN, urut skor menurun",
          "id_terbaik = ...             # id baris pertama",
          "to_maks_antrian = ...        # turnover tertinggi di antrean",
          "",
          "print(\"komposisi:\", n_antrian, n_tahan, n_buang, n_penalti)",
          "print(\"terbaik:\", id_terbaik, \"| TO maks antrean:\", to_maks_antrian)",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-triage-alpha/kandidat_alpha.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "def kategori(r):",
          "    if r[\"sharpe\"] < 1.25 or r[\"fitness\"] < 1.0:",
          "        return \"BUANG\"",
          "    if r[\"turnover\"] > 40:",
          "        return \"PENALTI\"",
          "    if r[\"sharpe\"] >= 1.4 and r[\"fitness\"] >= 1.1:",
          "        return \"ANTRIAN\"",
          "    return \"TAHAN\"",
          "",
          "df[\"kategori\"] = df.apply(kategori, axis=1)",
          "",
          "n_antrian = int((df[\"kategori\"] == \"ANTRIAN\").sum())",
          "n_tahan = int((df[\"kategori\"] == \"TAHAN\").sum())",
          "n_buang = int((df[\"kategori\"] == \"BUANG\").sum())",
          "n_penalti = int((df[\"kategori\"] == \"PENALTI\").sum())",
          "",
          "df[\"skor\"] = (0.6 * df[\"sharpe\"] + 0.4 * df[\"fitness\"]).round(3)",
          "antrian = df[df[\"kategori\"] == \"ANTRIAN\"].sort_values(\"skor\", ascending=False)",
          "id_terbaik = antrian.iloc[0][\"id\"]",
          "to_maks_antrian = float(antrian[\"turnover\"].max())",
          "",
          "print(\"komposisi:\", n_antrian, n_tahan, n_buang, n_penalti)",
          "print(\"terbaik:\", id_terbaik, \"| TO maks antrean:\", to_maks_antrian)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t2", label: "`n_antrian` = 13", name: "n_antrian", value: 13, msg: "Ada 13 kandidat memenuhi S≥1.4 & F≥1.1 & TO≤40 (setelah cek BUANG/PENALTI dulu)." },
          { kind: "equal", task: "t2", label: "`n_penalti` = 5", name: "n_penalti", value: 5, msg: "5 kandidat turnover >40% (cek: aturan PENALTI setelah BUANG)." },
          { kind: "equal", task: "t2", label: "`n_buang` = 9", name: "n_buang", value: 9, msg: "9 kandidat S<1.25 atau F<1 — termasuk AX-031 yang Sharpe-nya tertinggi." },
          { kind: "equal", task: "t2", label: "`n_tahan` = 13", name: "n_tahan", value: 13, msg: "Sisanya: 13 TAHAN. Total harus 40." },
          { kind: "equal", task: "t3", label: "`id_terbaik` = AX-036", name: "id_terbaik", value: "AX-036", msg: "Skor tertinggi: 0,6×1,89 + 0,4×1,30 = 1,654." },
          { kind: "equal", task: "t3", label: "`to_maks_antrian` = 39,2", name: "to_maks_antrian", value: 39.2, tol: 0.01, msg: "AX-009: 39,2% — lolos penalti dengan selisih 0,8 poin." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Saring per kategori",
      title: "Siapa saja yang kena penalti?",
      prose: [
        "Kepala riset memintamu satu hal spesifik sebelum rapat: daftar semua kandidat PENALTI (turnover > 40%) beserta Sharpe dan turnover-nya, urut dari turnover tertinggi. Lima baris ini akan dibahas satu per satu — apakah turnover-nya bisa diturunkan dengan menaikkan decay, atau memang sinyalnya terlalu “rewel”.",
        "Tabel `kandidat(id TEXT, sharpe REAL, fitness REAL, turnover REAL, self_corr_bucket TEXT, universe TEXT)` sudah terisi 40 baris data SINTETIS yang sama.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query kandidat PENALTI (turnover > 40): id, sharpe, turnover — urut turnover menurun" },
      ],
      expected: "5 baris — AX-039 (53,8), AX-022 (49,9), AX-029 (43,9), AX-024 (42,6), AX-011 (41,7)",
      sqlLab: {
        task: "Saring kandidat PENALTI: turnover LEBIH DARI 40. Tampilkan id + sharpe + turnover, urut dari turnover tertinggi.",
        schema: "CREATE TABLE kandidat (id TEXT, sharpe REAL, fitness REAL, turnover REAL, self_corr_bucket TEXT, universe TEXT);",
        seedData: [
          "INSERT INTO kandidat VALUES",
          "('AX-001',1.64,1.31,38.9,'<0.3','USA'),",
          "('AX-002',1.24,1.27,24.4,'0.3-0.5','USA'),",
          "('AX-003',1.78,1.0,28.3,'<0.3','ASI'),",
          "('AX-004',1.83,1.2,28.0,'0.3-0.5','USA'),",
          "('AX-005',0.96,1.18,17.5,'<0.3','EUR'),",
          "('AX-006',1.16,1.2,39.3,'<0.3','EUR'),",
          "('AX-007',1.59,1.34,26.9,'<0.3','USA'),",
          "('AX-008',1.46,1.2,33.2,'0.3-0.5','GLB'),",
          "('AX-009',1.54,1.3,39.2,'<0.3','USA'),",
          "('AX-010',1.29,1.16,38.8,'>0.7','ASI'),",
          "('AX-011',1.81,1.21,41.7,'0.3-0.5','USA'),",
          "('AX-012',1.78,1.29,31.7,'<0.3','GLB'),",
          "('AX-013',1.57,0.83,27.5,'0.3-0.5','USA'),",
          "('AX-014',1.89,1.08,32.0,'<0.3','USA'),",
          "('AX-015',1.69,1.05,11.1,'>0.7','USA'),",
          "('AX-016',1.29,1.01,14.2,'0.3-0.5','GLB'),",
          "('AX-017',1.66,1.09,15.8,'0.5-0.7','GLB'),",
          "('AX-018',1.26,1.48,20.0,'<0.3','EUR'),",
          "('AX-019',1.81,0.96,38.2,'0.3-0.5','GLB'),",
          "('AX-020',1.54,1.36,21.2,'0.3-0.5','GLB'),",
          "('AX-021',1.49,0.78,28.1,'>0.7','ASI'),",
          "('AX-022',1.35,1.08,49.9,'0.3-0.5','USA'),",
          "('AX-023',1.92,1.19,28.4,'0.3-0.5','EUR'),",
          "('AX-024',1.5,1.28,42.6,'<0.3','ASI'),",
          "('AX-025',1.42,1.31,20.9,'<0.3','USA'),",
          "('AX-026',1.44,1.32,30.3,'0.3-0.5','USA'),",
          "('AX-027',1.71,1.07,20.6,'0.3-0.5','EUR'),",
          "('AX-028',1.66,1.05,28.6,'<0.3','USA'),",
          "('AX-029',1.67,1.34,43.9,'0.5-0.7','GLB'),",
          "('AX-030',1.68,1.11,10.5,'0.5-0.7','USA'),",
          "('AX-031',2.19,0.87,38.6,'<0.3','USA'),",
          "('AX-032',1.43,0.9,36.1,'0.3-0.5','EUR'),",
          "('AX-033',1.4,0.95,25.3,'<0.3','USA'),",
          "('AX-034',1.31,1.26,14.2,'0.5-0.7','USA'),",
          "('AX-035',1.73,1.18,33.9,'<0.3','ASI'),",
          "('AX-036',1.89,1.3,26.1,'0.5-0.7','GLB'),",
          "('AX-037',1.52,1.06,36.0,'0.5-0.7','USA'),",
          "('AX-038',1.3,1.18,33.3,'0.5-0.7','USA'),",
          "('AX-039',1.3,1.29,53.8,'<0.3','EUR'),",
          "('AX-040',1.75,1.08,29.9,'>0.7','GLB');",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT id, sharpe, turnover\nFROM kandidat\n",
        solution: [
          "SELECT id, sharpe, turnover",
          "FROM kandidat",
          "WHERE turnover > 40",
          "ORDER BY turnover DESC;",
        ].join("\n"),
        expectedColumns: ["id", "sharpe", "turnover"],
        expectedRows: [
          ["AX-039", 1.3, 53.8],
          ["AX-022", 1.35, 49.9],
          ["AX-029", 1.67, 43.9],
          ["AX-024", 1.5, 42.6],
          ["AX-011", 1.81, 41.7],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiTriage;

// ── lanjutan misiTriage: langkah 5–12 ──────────────────────────────────────

const LANJUTAN_TRIAGE: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Lima slot, tiga belas kandidat antrean",
    prose: [
      "Komposisinya jelas: 13 ANTRIAN, 13 TAHAN, 9 BUANG, 5 PENALTI. Tapi slot review manual minggu ini hanya 5 — dan 13 kandidat ANTRIAN semuanya “layak” menurut aturan. Skor gabungan memberimu urutan: AX-036 (1,654), AX-023 (1,628), AX-012 (1,584), AX-004 (1,578), AX-035 (1,51) di lima besar. Namun skor bukan satu-satunya pertimbangan: dua dari lima besar berasal dari universe GLB yang sama, dan AX-036 duduk di bucket self-corr 0,5–0,7 — belum duplikat, tapi sudah mengarah ke sana.",
      "Keputusan ini tercatat seperti memo yang sudah dikirim — tiap opsi membuka konsekuensi berbeda di langkah berikut.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Lima kandidat mana yang kamu prioritaskan untuk review manual minggu ini?",
      options: [
        {
          id: "opt-skor",
          label: "Skor murni — 5 skor gabungan tertinggi (AX-036, AX-023, AX-012, AX-004, AX-035)",
          rationale:
            "Angka adalah angka. Lima skor tertinggi = lima kandidat terbaik secara objektif; diversifikasi universe adalah kemewahan yang tidak kita punya dengan 5 slot.",
          nextStepId: "kons-skor",
          consequenceNote:
            "Dua kandidat GLB (AX-036, AX-012) ternyata memakai pola sinyal yang mirip — self-corr antar-kandidat 0,68. Satu slot review terbuang untuk duplikat terselubung.",
        },
        {
          id: "opt-divers",
          label: "Skor + saringan kemiripan — singkirkan bucket ≥0,5 bila ada pengganti (AX-023, AX-012, AX-004, AX-035, AX-001)",
          rationale:
            "AX-036 (bucket 0,5–0,7, GLB) diganti AX-001 (bucket <0,3, USA, skor 1,508) — sedikit lebih rendah skornya, jauh lebih independen sinyalnya. Lima slot = lima sinyal independen.",
          nextStepId: "kons-divers",
          consequenceNote:
            "Lima sinyal independen lolos review tanpa temuan duplikat; AX-001 (bucket <0,3) menjadi kandidat pertama yang masuk antrean submit.",
        },
        {
          id: "opt-aman",
          label: "Konservatif — hanya 3 teratas (AX-036, AX-023, AX-012), 2 slot dibiarkan kosong",
          rationale:
            "Daripada salah pilih, lebih baik tidak memilih. Tiga yang paling yakin saja; slot kosong bisa dipakai batch berikutnya.",
          nextStepId: "kons-aman",
          consequenceNote:
            "Dua minggu kemudian sinyal mirip AX-004 dan AX-035 dipublikasikan tim lain — keunggulan kompetitif hangus karena slot dibiarkan kosong.",
        },
      ],
    },
  },
  {
    id: "kons-skor",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: skor murni",
    prose: [
      "Lima nama dikirim ke tim review: AX-036, AX-023, AX-012, AX-004, AX-035. Hari ketiga review, analis senior memanggilmu: “AX-036 dan AX-012 — keduanya GLB — polanya mirip. Self-corr antar-kandidat 0,68. Kita me-review satu sinyal dua kali.” Satu slot hangus. Lebih menyakitkan: AX-036 memang sudah memberi sinyal bahaya sejak awal — bucket 0,5–0,7 — tapi kamu mengabaikannya demi 0,07 poin skor.",
      "Pelajaran yang mahal: skor gabungan mengukur kualitas INDIVIDU, bukan kualitas PORTOFOLIO lima kandidat. Lima kandidat terbaik secara individu bisa menjadi lima versi dari satu sinyal yang sama.",
    ],
    tasks: [],
    note: {
      title: "Diversifikasi bukan kemewahan",
      body: "Di dunia alpha, duplikat = penalti platform (self-corr >0,7 antar alpha sendiri bisa membuat keduanya ditolak). Menyaring kemiripan SEBELUM review manual menghemat slot paling mahal yang kamu punya: waktu analis senior.",
    },
  },
  {
    id: "kons-divers",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: skor + saringan kemiripan",
    prose: [
      "Lima nama dikirim: AX-023, AX-012, AX-004, AX-035, AX-001. Review berjalan bersih — tidak ada temuan duplikat, tidak ada slot terbuang. Pekan berikutnya AX-001 (bucket <0,3, sinyal paling independen) menjadi kandidat pertama batch ini yang masuk antrean submit, disusul AX-012. Kepala riset mencatat di laporan bulanan: “antrean paling bersih kuartal ini”.",
      "Keputusanmu mengorbankan 0,146 poin skor (AX-036 → AX-001) demi independensi — dan independensi itu yang justru menghasilkan submit. Skor memilih kandidat terbaik; diversifikasi memilih PORTOFOLIO terbaik.",
    ],
    tasks: [],
    note: {
      title: "Aturan praktis yang bekerja",
      body: "Bucket self-corr <0,3 = sinyal independen (prioritas review); 0,3–0,7 = waspada; >0,7 = duplikat, jangan submit. Kamu tidak menemukan aturan ini di lab — kamu menemukannya di briefing, dan baru terasa gunanya di keputusan ini.",
    },
  },
  {
    id: "kons-aman",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: konservatif, 2 slot kosong",
    prose: [
      "Tiga nama dikirim; dua slot dibiarkan kosong “untuk batch berikutnya”. Dua minggu kemudian, tim riset kompetitor mempublikasikan sinyal yang sangat mirip dengan AX-004 dan AX-035 — dua kandidat yang kamu TAHAN di meja. Keunggulan kompetitif keduanya hangus dalam semalam. Slot kosong tidak menyelamatkanmu dari kesalahan; ia hanya menunda keputusan sampai orang lain yang mengambil peluangnya.",
      "Pelajaran yang mahal: konservatisme juga punya biaya — biaya peluang. “Tidak memilih” adalah pilihan dengan konsekuensi paling tidak terlihat, dan karena itu paling berbahaya.",
    ],
    tasks: [],
    note: {
      title: "TAHAN bukan BUANG",
      body: "Kandidat TAHAN (seperti AX-004/AX-035 yang “hampir” kamu pilih) masih hidup — mereka menunggu bukti tambahan atau batch berikutnya. Membiarkan slot kosong padahal ada 13 kandidat ANTRIAN yang lolos aturan adalah pemborosan yang tidak bisa dipertahankan di depan kepala riset.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 16 baris: laporan yang “patuh aturan” itu bohong",
    prose: [
      "Sebelum menulis daftar triase final, satu misi audit. Di bawah ini 16 baris “Laporan Triase Antrean — patuh penuh pada aturan triase tim”, dokumen yang dikirim seseorang pagi ini. Empat sabotase disuntikkan ke dalamnya. Senjatamu: hasil lab-mu sendiri — komposisi 13/13/9/5 dan tabel mentah 40 baris.",
      "Cara kerja: untuk setiap baris yang mencurigakan, terapkan aturan triase dari data MENTAH (bukan dari angka dossier) dan lihat di mana mereka berbohong.",
    ],
    tasks: [],
    auditDossier: {
      version: "triage-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Triase Antrean yang patuh penuh pada aturan triase tim (BUANG > PENALTI > ANTRIAN > TAHAN). Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini.",
      columns: ["ID", "Sharpe", "Fitness", "Turnover", "Self-corr", "Universe", "Kategori"],
      rows: [
        { rowId: 1, cells: { "ID": "AX-001", "Sharpe": "1,64", "Fitness": "1,31", "Turnover": "38,9%", "Self-corr": "<0,3", "Universe": "USA", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 2, cells: { "ID": "AX-004", "Sharpe": "1,83", "Fitness": "1,20", "Turnover": "28,0%", "Self-corr": "0,3-0,5", "Universe": "USA", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 3, cells: { "ID": "AX-007", "Sharpe": "1,59", "Fitness": "1,34", "Turnover": "26,9%", "Self-corr": "<0,3", "Universe": "USA", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 4, cells: { "ID": "AX-012", "Sharpe": "1,78", "Fitness": "1,29", "Turnover": "31,7%", "Self-corr": "<0,3", "Universe": "GLB", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 5, cells: { "ID": "AX-023", "Sharpe": "1,92", "Fitness": "1,19", "Turnover": "28,4%", "Self-corr": "0,3-0,5", "Universe": "EUR", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 6, cells: { "ID": "AX-025", "Sharpe": "1,42", "Fitness": "1,31", "Turnover": "20,9%", "Self-corr": "<0,3", "Universe": "USA", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 7, cells: { "ID": "AX-030", "Sharpe": "1,68", "Fitness": "1,11", "Turnover": "10,5%", "Self-corr": "0,5-0,7", "Universe": "USA", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 8, cells: { "ID": "AX-035", "Sharpe": "1,73", "Fitness": "1,18", "Turnover": "33,9%", "Self-corr": "<0,3", "Universe": "ASI", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 9, cells: { "ID": "AX-036", "Sharpe": "1,89", "Fitness": "1,30", "Turnover": "26,1%", "Self-corr": "0,5-0,7", "Universe": "GLB", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 10, cells: { "ID": "AX-002", "Sharpe": "1,24", "Fitness": "1,27", "Turnover": "24,4%", "Self-corr": "0,3-0,5", "Universe": "USA", "Kategori": "BUANG" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 11, cells: { "ID": "AX-011", "Sharpe": "1,81", "Fitness": "1,21", "Turnover": "41,7%", "Self-corr": "0,3-0,5", "Universe": "USA", "Kategori": "PENALTI" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        { rowId: 12, cells: { "ID": "AX-018", "Sharpe": "1,26", "Fitness": "1,48", "Turnover": "20,0%", "Self-corr": "<0,3", "Universe": "EUR", "Kategori": "TAHAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        // ── I1: turnover diubah agar lolos ambang ──
        { rowId: 13, cells: { "ID": "AX-024", "Sharpe": "1,50", "Fitness": "1,28", "Turnover": "32,6%", "Self-corr": "<0,3", "Universe": "ASI", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan — turnover di bawah ambang" }] },
        // ── I2: bucket self-corr dinaikkan ──
        { rowId: 14, cells: { "ID": "AX-009", "Sharpe": "1,54", "Fitness": "1,30", "Turnover": "39,2%", "Self-corr": ">0,7", "Universe": "USA", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan — kandidat kuat meski mirip" }] },
        // ── I3: kandidat diduplikat dengan ID berbeda ──
        { rowId: 15, cells: { "ID": "AX-044", "Sharpe": "1,83", "Fitness": "1,20", "Turnover": "28,0%", "Self-corr": "0,3-0,5", "Universe": "USA", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan" }] },
        // ── I4: kandidat BUANG dimasukkan ke antrean ──
        { rowId: 16, cells: { "ID": "AX-033", "Sharpe": "1,40", "Fitness": "0,95", "Turnover": "25,3%", "Self-corr": "<0,3", "Universe": "USA", "Kategori": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sesuai aturan — Sharpe memenuhi syarat" }] },
      ],
      injections: [
        { key: "turnover-diubah", rowIds: [13], title: "Turnover diubah agar lolos ambang", clue: "Dossier menulis turnover AX-024 = 32,6% (kategori ANTRIAN). Data mentah: 42,6% → PENALTI menurut aturan TO>40%. Selisih tepat 10 poin — terlalu rapi untuk salah ketik.", danger: "Satu angka turnover yang “dirapikan” mengubah PENALTI menjadi ANTRIAN. Di produksi, alpha seperti ini lolos ke submit dan return-nya dimakan biaya — slot submit harian hangus sia-sia." },
        { key: "bucket-dinaikkan", rowIds: [14], title: "Bucket self-corr dinaikkan", clue: "AX-009 diklaim bucket >0,7 (duplikat — jangan review). Data mentah: <0,3 — sinyal paling independen di antrean. Kenaikan bucket menyingkirkan kandidat bagus secara diam-diam.", danger: "Bucket adalah gerbang anti-duplikat. Dinaikkan = memfitnah kandidat bagus; diturunkan = meloloskan duplikat. Dua-duanya merusak antrean — dan dua-duanya tidak terlihat tanpa membandingkan ke data mentah." },
        { key: "duplikat-id-berbeda", rowIds: [15], title: "Kandidat diduplikat dengan ID berbeda", clue: "AX-044 memiliki Sharpe, fitness, turnover, bucket, dan universe IDENTIK dengan AX-004 (baris 2) — hanya ID yang beda. ID AX-044 bahkan tidak ada di file mentah 40 baris. Dua baris, satu alpha.", danger: "Duplikat ber-ID beda adalah cara klasik menggandakan bobot satu sinyal. Kalau lolos ke submit: penalti platform karena self-correlation >0,7 antar alpha sendiri — dan reputasi tim yang mengirimnya ikut tercoreng." },
        { key: "buang-di-antrean", rowIds: [16], title: "Kandidat BUANG dimasukkan ke antrean", clue: "AX-033 (Sharpe 1,40, fitness 0,95) diklaim ANTRIAN dengan alasan “Sharpe memenuhi syarat”. Aturan: fitness <1 → BUANG, tanpa kecuali. Dossier mengutip setengah aturan dan mengabaikan setengahnya.", danger: "Aturan triase yang tidak ditegakkan = tidak ada aturan. Satu BUANG di antrean menggerogoti kepercayaan seluruh sistem — tim review mulai menebak-nebak mana kategori yang “serius” dan mana yang basa-basi." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Daftar triase final + justifikasi",
    prose: [
      "Semua bukti di tangan: komposisi 13/13/9/5 dari lab-mu, 5 prioritas dari keputusanmu, dan 4 sabotase dari audit. Tulis daftar triase final — artefak portofoliomu. Daftar yang baik bukan sekadar tabel kategori, melainkan tabel yang bisa DIPERTAHANKAN: setiap baris punya alasan yang merujuk ke aturan.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Tabel triase: 40 kandidat dengan kategori hasil perhitunganmu (ANTRIAN 13 / TAHAN 13 / BUANG 9 / PENALTI 5) + satu kalimat justifikasi per KATEGORI (bukan per baris — rujuk ambang aturannya).",
        "Lima prioritas review manual: ID + skor gabungan + alasan diversifikasi (universe & bucket self-corr) — rujuk keputusanmu di Langkah 5.",
        "Temuan audit: 4 sabotase di laporan “patuh aturan”, masing-masing dengan nomor baris dossier dan angka pembanding dari data mentah.",
        "Kasus batas yang kamu tangani: AX-009 (39,2% — lolos penalti 0,8 poin), AX-031 (Sharpe tertinggi tapi BUANG), AX-040 (Sharpe 1,75 tapi bucket >0,7).",
        "Batas & risiko sisa: apa yang TIDAK dicakup triase ini (mis. triase ≠ review kualitas sinyal; data SINTETIS; ambang disederhanakan).",
      ],
      rubric: [
        { criterion: "Kebenaran penerapan aturan", weight: 30, levels: ["Kategori salah/tidak konsisten", "Sebagian kategori benar", "40 kandidat terkategori tepat sesuai urutan prioritas BUANG > PENALTI > ANTRIAN > TAHAN"] },
        { criterion: "Komposisi & prioritas", weight: 25, levels: ["Komposisi salah / 5 prioritas tanpa alasan", "Komposisi benar, prioritas lemah", "13/13/9/5 tepat + 5 prioritas beralasan skor & diversifikasi"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa bukti baris", "Keempat sabotase disebut dengan nomor baris + angka pembanding"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim triase = vonis akhir kualitas", "Menyebut sebagian batas", "Batas (triase ≠ review sinyal; data SINTETIS; ambang sederhana) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan triase “patuh aturan”:",
      "1) **Turnover diubah** (baris 13): AX-024 ditulis 32,6%. Angka mentah: 42,6% → PENALTI. Selisih tepat 10 poin — sabotase paling malas sekaligus paling efektif: satu digit mengubah nasib satu kandidat.",
      "2) **Bucket dinaikkan** (baris 14): AX-009 diklaim >0,7. Angka mentah: <0,3. Ini sabotase arah sebaliknya — bukan meloloskan yang buruk, melainkan menyingkirkan yang bagus. Korban yang tidak bersuara tidak pernah ketahuan tanpa audit.",
      "3) **Duplikat ID berbeda** (baris 15): AX-044 = AX-004 dengan topeng baru. ID-nya bahkan tidak ada di file mentah — pendeteksiannya semudah menghitung baris (16 baris dossier vs 40 baris mentah? tidak — vs 15 kandidat unik yang diklaim). Cara paling murah: cocokkan setiap ID dossier ke file mentah.",
      "4) **BUANG di antrean** (baris 16): AX-033 (fitness 0,95) diklaim ANTRIAN dengan dalih “Sharpe memenuhi syarat”. Aturan dibaca setengah — dan setengah aturan = bukan aturan.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel “patuh aturan”.",
      "Bahaya nyata terakhir: antrean yang tidak jujur = review manual yang terbuang = slot submit yang hangus. Dan yang paling mahal: submit duplikat (self-corr >0,7) = penalti platform — alpha ditolak, slot harian hangus, dan tim pengirim dicap tidak bisa menyaring alpha sendiri. Triase yang buruk bukan sekadar inefisiensi; ia adalah cara tercepat membakar reputasi tim riset.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: triase = vonis akhir kualitas alpha",
      type: "pitfall",
      body: "Triase HANYA filter administratif — ia menjawab “layak direview atau tidak”, bukan “alpha ini bagus atau tidak”. AX-036 lolos triase dengan skor tertinggi bukan berarti sinyalnya benar; review manual (dan backtest independen) yang memutuskan itu. Mencampuradukkan keduanya = memberi wewenang vonis pada alat yang dirancang hanya untuk menyaring.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Aturan triase empat kategori (prioritas BUANG > PENALTI > ANTRIAN > TAHAN) diterapkan ke 40 kandidat SINTETIS → komposisi 13 ANTRIAN / 13 TAHAN / 9 BUANG / 5 PENALTI.",
      "Skor gabungan 0,6×Sharpe + 0,4×fitness memprioritaskan 5 slot review; diversifikasi universe + bucket self-corr <0,3 melindungi dari duplikat terselubung.",
      "Empat pola sabotase laporan: turnover diubah, bucket self-corr dinaikkan, duplikat ber-ID beda, kandidat BUANG dimasukkan antrean — semua terdeteksi dengan membandingkan ke data mentah.",
      "Aturan praktis self-correlation: kemiripan >0,7 = duplikat, jangan submit — submit duplikat = penalti platform + slot hangus.",
      "Data: 40 kandidat alpha SINTETIS (seed 42), BUKAN data asli, TANPA ekspresi alpha mentah; ambang & skor disederhanakan untuk latihan — file METODE.md.",
    ],
  },
];

(misiTriage.steps as V2Step[]).push(...LANJUTAN_TRIAGE);
