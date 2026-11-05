import type { V2Mission } from "../lib/types";

// ── MISI Berkas Ganda: Satu Pengajuan, Dua Vonis ─────────────────────────
// Capstone C — Credit Risk. Dataset 100% SINTETIS: generator Python seed 42
// (/tmp/cap1-berkas/gen.py), 150 baris aplikasi.csv, pola fraud disisipkan
// sengaja (6 no_hp dipakai ulang, 3 mismatch pendapatan, 1 agunan dipakai
// 2 berkas, 1 skor digelembungkan manual). Dinyatakan SINTETIS di briefing,
// data room, dan METODE.md. File: public/misi/misi-gabung-berkas-ganda/.

const BASE = "/misi/misi-gabung-berkas-ganda";

export const misiGabungBerkas: V2Mission = {
  slug: "misi-gabung-berkas-ganda",
  track: "Credit Risk",
  module: "Misi",
  title: "Misi Berkas Ganda: Satu Pengajuan, Dua Vonis",
  estMinutes: 170,
  role: "Analis risiko kredit",
  client:
    "Kepala Divisi Risiko Kredit & Kepala Unit Fraud — 150 berkas pengajuan dari satu cabang harus diputus minggu ini; beberapa berkas terlihat “terlalu sempurna”",
  xp: 750,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Berkas yang terlalu sempurna itu mencurigakan",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis risiko kredit — penilai independen pengajuan cabang",
        client:
          "Kepala Divisi Risiko Kredit dan Kepala Unit Fraud. Satu cabang mengirim 150 berkas pengajuan kredit yang harus diputus minggu ini. Cabang itu sedang diaudit, dan beberapa berkas terlihat “terlalu sempurna”: pendapatan bulat, dokumen lengkap, skor kredit tinggi. Kamu diminta menilai setiap berkas dengan DUA lensa sekaligus — lensa kelayakan kredit (mampukah debitur membayar?) dan lensa fraud aplikasi (jujurkah data pengajuannya?) — lalu memutus nasibnya.",
        story: [
          "Senin, 08:00. Di mejamu: satu flashdisk berisi 150 berkas pengajuan kredit dari Cabang Harapan — cabang yang tiga bulan terakhir penyalurannya naik 40% sementara cabang lain stagnan. Kepala Unit Fraud menaruh satu berkas di atas tumpukan: “Lihat ini. Pendapatan 25 juta, dokumen slip gaji 25 juta, skor kredit 780. Sempurna. Terlalu sempurna — saya sudah lihat pola seperti ini sebelumnya, dan ujungnya selalu sama.”",
          "Kamu tahu maksudnya. Fraud aplikasi jarang terlihat seperti kebohongan yang ceroboh; justru sebaliknya — ia terlihat seperti pengajuan teladan. Satu nomor HP dipakai enam “orang” berbeda. Satu agunan diagunkan dua kali. Satu skor kredit diubah tangan agar lolos ambang. Semua lolos skrining kelayakan, karena skrining kelayakan tidak dirancang untuk menangkap kebohongan.",
          "Misi ini memakai data sintetis 150 berkas (dinyatakan sintetis eksplisit — lihat catatan dataset). Tugasmu: bangun skor PD proxy + aturan flag fraud, temukan 12 berkas merah, bedah memo analis junior yang mengklaim semuanya bersih, dan tulis memo keputusan dua-lensa yang berani menolak berkas “sempurna”.",
        ],
        objectives: [
          "Menghitung skor PD proxy sederhana dari data pengajuan dan menerapkan 4 aturan flag fraud untuk menemukan 12 berkas merah.",
          "Menemukan identitas duplikat antar berkas dengan SQL (jejak no_hp).",
          "Memutuskan nasib 12 berkas merah (setujui / setujui bersyarat / tolak dan rujuk fraud) dengan konsekuensi yang dipertahankan.",
          "Menemukan 4 suntikan di memo verifikasi analis junior dan menulis memo keputusan dua-lensa ber-rubrik.",
        ],
        prereqSummary:
          "PD (probability of default) = peluang debitur gagal bayar; di sini dipakai PROXY sederhana dari DTI (rasio utang terhadap pendapatan), lama kerja, dan skor kredit — bukan model resmi bank. Fraud aplikasi = data pengajuan yang dimanipulasi agar lolos: identitas dipakai ulang, pendapatan digelembungkan, agunan dihitung ganda, skor diubah manual. Dua lensa artinya: berkas bisa LAYAK tapi FRAUD — dan vonisnya ditentukan oleh lensa yang lebih keras.",
        datasetNote:
          "100% SINTETIS — bukan data nasabah asli. Dibangkitkan dengan generator Python seed 42 (lihat METODE.md): 150 baris, kolom id, nama, pendapatan, total_utang, nilai_agunan, lama_kerja_thn, no_hp, dokumen_pendapatan, skor_kredit_eksternal.\nPola fraud DISISIPKAN SENGAJA untuk misi ini: satu no_hp dipakai ulang di 6 berkas, 3 berkas pendapatan ≠ dokumen (digembungkan ~2,5x), 1 nilai agunan dipakai 2 berkas, 1 skor kredit digelembungkan manual ke 850.\nTidak ada PII nyata; nama-nama adalah kombinasi acak. File: aplikasi.csv (<5MB) + METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Satu file, dua lensa",
      prose: [
        "Satu file menunggumu: `aplikasi.csv`, 150 baris pengajuan kredit. Kolomnya: `id`, `nama`, `pendapatan` (pengakuan per bulan, Rp), `total_utang` (utang berjalan, Rp), `nilai_agunan` (Rp, 0 = tanpa agunan), `lama_kerja_thn`, `no_hp`, `dokumen_pendapatan` (pendapatan menurut dokumen, Rp), `skor_kredit_eksternal` (400–850).",
        "Lensa 1 — kelayakan: dari `total_utang`, `pendapatan`, `lama_kerja_thn`, dan `skor_kredit_eksternal` kamu bangun skor PD proxy. Ambang putus: PD ≤ 0,35 = layak. Lensa 2 — fraud: empat aturan sederhana. (1) `no_hp` yang sama dipakai lebih dari satu berkas; (2) `pendapatan` menyimpang >20% dari `dokumen_pendapatan`; (3) `nilai_agunan` > 0 yang sama dipakai lebih dari satu berkas; (4) `skor_kredit_eksternal` ≥ 810 (di atas rentang wajar generator).",
        "Aturan main: (1) vonis akhir = gabungan dua lensa — berkas layak tapi ber-flag fraud TIDAK boleh cair tanpa investigasi; (2) angka-angka di memo analis junior (Langkah 9) harus kamu verifikasi ulang dari file mentah, bukan dipercaya; (3) semua pola fraud di file ini disengaja dan dinyatakan sintetis.",
      ],
      tasks: [
        { id: "t1", text: "Buka `aplikasi.csv`: catat jumlah baris dan 9 nama kolomnya" },
        { id: "t2", text: "Hafalkan 4 aturan flag fraud — kamu akan menerjemahkannya ke kode di Lab 1" },
      ],
      note: {
        title: "Miskonsepsi #1: skor kredit bagus = pengajuan aman",
        type: "pitfall",
        body: "“Skor 850, pasti debitur prima.” SALAH — dan justru di situlah jebakannya. Skor adalah ANGKA, dan angka bisa diubah tangan oleh orang dalam. Di file ini ada satu berkas berskor 850 dengan masa kerja 0,6 tahun dan DTI 1,4 — profil yang mustahil mendapat 850 dari biro mana pun. Lensa kelayakan membaca skor apa adanya; lensa fraud bertanya: masuk akalkah skor ini untuk profil seperti ini?",
      },
      reference:
        "aplikasi.csv (150 baris, 100% sintetis, seed 42). Lensa 1: PD proxy dari DTI + lama kerja + skor. Lensa 2: 4 aturan flag fraud.",
    },
    {
      id: "lab-python",
      eyebrow: "Langkah 3 · Lab 1 — PD proxy & flag fraud",
      title: "Saring 150 berkas, temukan 12 yang merah",
      prose: [
        "Sekarang kerjakan dua lensa sekaligus dalam satu skrip. Lensa 1: hitung `dti` = total_utang / (12 × pendapatan), lalu `pd_proxy` = 0,15 + 0,5×dti − 0,02×lama_kerja_thn − 0,0005×(skor_kredit_eksternal − 600), dijepit ke rentang 0,01–0,99. Ini proxy kasar — bukan model PD resmi bank — tapi cukup untuk memisahkan yang layak dari yang tidak.",
        "Lensa 2: terapkan 4 aturan flag dari data room. Berkas dengan ≥1 flag = berkas MERAH. Target: tepat 12 berkas merah. Lalu hitung satu angka yang akan mengubah cara pandangmu: rata-rata PD proxy berkas merah vs berkas hijau.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV (no_hp sebagai string!); hitung `n_baris`" },
        { id: "t2", text: "Hitung `dti`, `pd_proxy`, `pd_rata_merah`, `pd_rata_hijau`" },
        { id: "t3", text: "Terapkan 4 aturan flag; hitung `n_merah`, `ids_merah`, dan rincian per aturan" },
      ],
      expected:
        "n_baris=150, n_merah=12 (hp_dup 6, mismatch 3, agunan_dup 2, skor_manual 1), pd_rata_merah=0,255 < pd_rata_hijau=0,309 — berkas merah justru tampak LEBIH layak. Itulah kenapa lensa fraud tidak bisa digantikan lensa kelayakan.",
      formula: String.raw`PD_{proxy} = \min(0.99, \max(0.01, 0.15 + 0.5 \cdot DTI - 0.02 \cdot LamaKerja - 0.0005 \cdot (Skor - 600)))`,
      formulaNote:
        "DTI = total_utang / (12 × pendapatan). Koefisien dibuat-buat untuk misi ini (bukan kalibrasi nyata): DTI menaikkan PD, lama kerja dan skor menurunkannya. Hasil dijepit 0,01–0,99 agar tetap peluang yang valid.",
      note: {
        title: "Miskonsepsi #2: rule-based menangkap semua fraud",
        type: "pitfall",
        body: "“Sudah ada 4 aturan, berarti fraud pasti ketahuan.” SALAH. Aturan hanya menangkap pola yang SUDAH dikenal — pola yang ditulis si pembuat aturan. Fraud baru (pola ke-5, ke-6) lolos diam-diam sampai seseorang menemukannya dan menulis aturan baru. Itulah kenapa analis fraud tidak pernah pensiun: pekerjaannya adalah menemukan pola yang belum ada aturannya.",
      },
      hints: [
        "Muat CSV: `pd.read_csv(open_url(URL), dtype={\"no_hp\": str})` — tanpa dtype, leading 08 hilang dan deteksi duplikat rusak.",
        "dti lalu pd_proxy dalam dua baris; akhiri dengan `.clip(0.01, 0.99)`.",
        "Hitung frekuensi: `hp_counts = Counter(df[\"no_hp\"])`, agunan hanya yang > 0.",
        "Rincian per aturan: `df[\"flags\"].apply(lambda f: \"hp_dup\" in f).sum()` dan seterusnya.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from collections import Counter",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-berkas-ganda/aplikasi.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL), dtype={\"no_hp\": str})",
          "",
          "n_baris = ...",
          "",
          "df[\"dti\"] = ...",
          "df[\"pd_proxy\"] = ...  # rumus di atas, .clip(0.01, 0.99)",
          "",
          "hp_counts = ...",
          "ag_counts = ...  # Counter nilai_agunan HANYA yang > 0",
          "",
          "def flag_row(r):",
          "    f = []",
          "    ...  # aturan 1: no_hp dipakai > 1 berkas",
          "    ...  # aturan 2: |pendapatan - dokumen| / dokumen > 0.20",
          "    ...  # aturan 3: nilai_agunan > 0 dipakai > 1 berkas",
          "    ...  # aturan 4: skor_kredit_eksternal >= 810",
          "    return f",
          "",
          "df[\"flags\"] = df.apply(flag_row, axis=1)",
          "df[\"merah\"] = df[\"flags\"].apply(lambda f: len(f) > 0)",
          "",
          "n_merah = ...",
          "ids_merah = ...  # sorted",
          "n_hp_dup = ...",
          "n_mismatch = ...",
          "n_agunan_dup = ...",
          "n_skor_manual = ...",
          "pd_rata_merah = ...",
          "pd_rata_hijau = ...",
          "",
          "print(\"baris:\", n_baris, \"| merah:\", n_merah)",
          "print(\"ids:\", ids_merah)",
          "print(\"hp_dup:\", n_hp_dup, \"| mismatch:\", n_mismatch, \"| agunan_dup:\", n_agunan_dup, \"| skor_manual:\", n_skor_manual)",
          "print(\"pd rata-rata merah:\", round(pd_rata_merah, 4), \"| hijau:\", round(pd_rata_hijau, 4))",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from collections import Counter",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-berkas-ganda/aplikasi.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL), dtype={\"no_hp\": str})",
          "",
          "n_baris = len(df)",
          "",
          "df[\"dti\"] = df[\"total_utang\"] / (12 * df[\"pendapatan\"])",
          "df[\"pd_proxy\"] = (0.15 + 0.5 * df[\"dti\"] - 0.02 * df[\"lama_kerja_thn\"] - 0.0005 * (df[\"skor_kredit_eksternal\"] - 600)).clip(0.01, 0.99)",
          "",
          "hp_counts = Counter(df[\"no_hp\"])",
          "ag_counts = Counter(df.loc[df[\"nilai_agunan\"] > 0, \"nilai_agunan\"])",
          "",
          "def flag_row(r):",
          "    f = []",
          "    if hp_counts[r[\"no_hp\"]] > 1:",
          "        f.append(\"hp_dup\")",
          "    if abs(r[\"pendapatan\"] - r[\"dokumen_pendapatan\"]) / r[\"dokumen_pendapatan\"] > 0.20:",
          "        f.append(\"mismatch\")",
          "    if r[\"nilai_agunan\"] > 0 and ag_counts[r[\"nilai_agunan\"]] > 1:",
          "        f.append(\"agunan_dup\")",
          "    if r[\"skor_kredit_eksternal\"] >= 810:",
          "        f.append(\"skor_manual\")",
          "    return f",
          "",
          "df[\"flags\"] = df.apply(flag_row, axis=1)",
          "df[\"merah\"] = df[\"flags\"].apply(lambda f: len(f) > 0)",
          "",
          "n_merah = int(df[\"merah\"].sum())",
          "ids_merah = sorted(df.loc[df[\"merah\"], \"id\"].tolist())",
          "n_hp_dup = int(df[\"flags\"].apply(lambda f: \"hp_dup\" in f).sum())",
          "n_mismatch = int(df[\"flags\"].apply(lambda f: \"mismatch\" in f).sum())",
          "n_agunan_dup = int(df[\"flags\"].apply(lambda f: \"agunan_dup\" in f).sum())",
          "n_skor_manual = int(df[\"flags\"].apply(lambda f: \"skor_manual\" in f).sum())",
          "pd_rata_merah = float(df.loc[df[\"merah\"], \"pd_proxy\"].mean())",
          "pd_rata_hijau = float(df.loc[~df[\"merah\"], \"pd_proxy\"].mean())",
          "",
          "print(\"baris:\", n_baris, \"| merah:\", n_merah)",
          "print(\"ids:\", ids_merah)",
          "print(\"hp_dup:\", n_hp_dup, \"| mismatch:\", n_mismatch, \"| agunan_dup:\", n_agunan_dup, \"| skor_manual:\", n_skor_manual)",
          "print(\"pd rata-rata merah:\", round(pd_rata_merah, 4), \"| hijau:\", round(pd_rata_hijau, 4))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari aplikasi.csv (no_hp sebagai string)." },
          { kind: "equal", task: "t1", label: "`n_baris` = 150", name: "n_baris", value: 150, msg: "File punya 150 berkas pengajuan sintetis." },
          { kind: "equal", task: "t3", label: "`n_merah` = 12", name: "n_merah", value: 12, msg: "Tepat 12 berkas punya ≥1 flag. Periksa 4 aturan flag_row." },
          { kind: "equal", task: "t3", label: "`ids_merah` tepat", name: "ids_merah", value: ["APP-0020","APP-0039","APP-0040","APP-0046","APP-0081","APP-0083","APP-0113","APP-0115","APP-0119","APP-0127","APP-0145","APP-0149"], msg: "Daftar ID merah harus sama persis (sudah sorted)." },
          { kind: "equal", task: "t3", label: "`n_hp_dup` = 6", name: "n_hp_dup", value: 6, msg: "6 berkas berbagi satu no_hp (081234567890)." },
          { kind: "equal", task: "t3", label: "`n_mismatch` = 3", name: "n_mismatch", value: 3, msg: "3 berkas: |pendapatan − dokumen| / dokumen > 20%." },
          { kind: "equal", task: "t3", label: "`n_agunan_dup` = 2", name: "n_agunan_dup", value: 2, msg: "2 berkas memakai nilai_agunan yang sama (> 0)." },
          { kind: "equal", task: "t3", label: "`n_skor_manual` = 1", name: "n_skor_manual", value: 1, msg: "1 berkas berskor ≥ 810 (APP-0113, skor 850)." },
          { kind: "equal", task: "t2", label: "`pd_rata_merah` ≈ 0,255", name: "pd_rata_merah", value: 0.255, tol: 0.002, msg: "Rata-rata PD proxy 12 berkas merah. Periksa rumus + clip." },
          { kind: "equal", task: "t2", label: "`pd_rata_hijau` ≈ 0,309", name: "pd_rata_hijau", value: 0.3085, tol: 0.002, msg: "Rata-rata PD proxy 138 berkas hijau." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Jejak identitas ganda",
      title: "Satu nomor, enam nama",
      prose: [
        "Pola paling kasat mata di misi ini: satu nomor HP dipakai enam pengajuan berbeda. Di dunia nyata, ini pola klasik sindikat — satu orang mengajukan berkali-kali dengan identitas berbeda, atau satu “joki” mendaftarkan banyak debitur fiktif. Di tabel kecil ini (10 berkas: 6 di antaranya pola duplikat dari file asli), buktikan dengan SQL siapa saja yang berbagi nomor.",
        "Tabel `aplikasi(id TEXT, nama TEXT, pendapatan INTEGER, total_utang INTEGER, nilai_agunan INTEGER, lama_kerja_thn REAL, no_hp TEXT, dokumen_pendapatan INTEGER, skor_kredit_eksternal INTEGER)`. Tampilkan id, nama, no_hp untuk berkas yang nomornya dipakai lebih dari satu pengajuan, urut berdasarkan id.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query identitas duplikat via no_hp (GROUP BY + HAVING), urut id" },
      ],
      expected:
        "6 baris — semuanya no_hp 081234567890: Hesti Maharani (APP-0020), Fitri Maharani (APP-0040), Hesti Anggraini (APP-0046), Joko Saputra (APP-0119), Sari Santoso (APP-0127), Eko Kurniawan (APP-0145).",
      sqlLab: {
        task: "Temukan identitas duplikat: tampilkan id, nama, no_hp dari berkas yang no_hp-nya dipakai LEBIH DARI SATU pengajuan. Urut berdasarkan id.",
        schema: "CREATE TABLE aplikasi (id TEXT, nama TEXT, pendapatan INTEGER, total_utang INTEGER, nilai_agunan INTEGER, lama_kerja_thn REAL, no_hp TEXT, dokumen_pendapatan INTEGER, skor_kredit_eksternal INTEGER);",
        seedData: [
          "INSERT INTO aplikasi VALUES",
          "('APP-0020','Hesti Maharani',5250000,22226768,0,17.9,'081234567890',5250000,526),",
          "('APP-0040','Fitri Maharani',16500000,164660505,0,13.5,'081234567890',16500000,594),",
          "('APP-0046','Hesti Anggraini',28150000,448665219,124735000,3.9,'081234567890',28150000,756),",
          "('APP-0119','Joko Saputra',6250000,60473993,204516000,13.6,'081234567890',6250000,780),",
          "('APP-0127','Sari Santoso',20650000,23624522,199812000,10.5,'081234567890',20650000,455),",
          "('APP-0145','Eko Kurniawan',19650000,62143251,378926000,5.0,'081234567890',19650000,686),",
          "('APP-0001','Wahyu Tanuwijaya',8100000,115485171,43306000,8.0,'089573276057',8200000,705),",
          "('APP-0002','Dewi Tanuwijaya',20750000,206629872,366664000,14.6,'088519962896',20000000,749),",
          "('APP-0003','Ahmad Pangestu',28750000,57728249,247881000,0.6,'084919706735',29300000,769),",
          "('APP-0004','Ratna Firmansyah',23950000,275451127,90131000,7.8,'089592390865',23250000,482);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT id, nama, no_hp\nFROM aplikasi\n",
        solution: [
          "SELECT id, nama, no_hp",
          "FROM aplikasi",
          "WHERE no_hp IN (SELECT no_hp FROM aplikasi GROUP BY no_hp HAVING COUNT(*) > 1)",
          "ORDER BY id;",
        ].join("\n"),
        expectedColumns: ["id", "nama", "no_hp"],
        expectedRows: [
          ["APP-0020", "Hesti Maharani", "081234567890"],
          ["APP-0040", "Fitri Maharani", "081234567890"],
          ["APP-0046", "Hesti Anggraini", "081234567890"],
          ["APP-0119", "Joko Saputra", "081234567890"],
          ["APP-0127", "Sari Santoso", "081234567890"],
          ["APP-0145", "Eko Kurniawan", "081234567890"],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiGabungBerkas;

// ── lanjutan misiGabungBerkas: langkah 5–14 ──────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_GABUNG: V2Step[] = [
  {
    id: "dua-lensa",
    eyebrow: "Langkah 5 · Dua lensa, satu berkas",
    title: "Vonis ditentukan lensa yang lebih keras",
    prose: [
      "Dua lensa dibaca bersamaan, dan vonis akhir mengikuti lensa yang LEBIH KERAS. Tiga berkas nyata dari file-mu:",
      "APP-0002 (Dewi Tanuwijaya) — PD proxy 0,198, 0 flag. Lensa 1: layak. Lensa 2: bersih. Vonis: SETUJUI. Berkas normal seperti inilah mayoritas portofolio.",
      "APP-0001 (Wahyu Tanuwijaya) — PD proxy 0,532, 0 flag. Lensa 1: tidak layak. Lensa 2: bersih. Vonis: TOLAK (atau skema ulang). Tidak ada fraud di sini — hanya debitur yang memang belum mampu. Menolaknya bukan hukuman, melainkan perlindungan dua arah.",
      "APP-0020 (Hesti Maharani) — PD proxy 0,01, flag hp_dup. Lensa 1: SANGAT layak (PD terendah di seluruh file!). Lensa 2: nomor HP-nya dipakai 6 berkas. Vonis: TOLAK + rujuk fraud. Inilah berkas “terlalu sempurna” yang dimaksud Kepala Unit Fraud — kalau kamu hanya memakai lensa 1, berkas ini justru prioritas pertama untuk dicairkan.",
      "Pola umumnya: fraud yang bagus justru menekan PD proxy (pendapatan digelembungkan → DTI kecil; skor digelembungkan → PD turun). Itu sebabnya rata-rata PD berkas merah (0,255) LEBIH RENDAH dari berkas hijau (0,309). Lensa kelayakan sendirian tidak hanya buta terhadap fraud — ia AKTIF memilih fraud sebagai “debitur terbaik”.",
    ],
    tasks: [
      { id: "t1", text: "Untuk tiap contoh di atas, tulis vonisnya jika hanya lensa 1 yang dipakai vs dua lensa" },
      { id: "t2", text: "Jelaskan dengan kata-katamu: mengapa APP-0020 paling berbahaya justru karena PD-nya 0,01" },
    ],
    note: {
      title: "Miskonsepsi #3: berkas yang rapi = berkas yang aman",
      type: "pitfall",
      body: "Insting analis berkata “data lengkap dan konsisten = pengajuan bagus”. Pelaku fraud tahu insting itu — makanya berkas palsu dibuat SERAPI mungkin: pendapatan sama persis dengan dokumen, skor tinggi, agunan besar. Kerapian adalah kamuflase termurah di dunia kredit. Yang membedakan berkas jujur dari berkas palsu bukan kerapian, melainkan VERIFIKASI INDEPENDEN: telepon balik ke nomor selain yang tercantum, cek agunan fisik, konfirmasi ke biro.",
    },
  },
  {
    id: "peta-keputusan",
    eyebrow: "Langkah 6 · Peta keputusan mini",
    title: "Empat kuadran, empat vonis",
    prose: [
      "Hafalkan peta ini — ia adalah seluruh misi dalam satu gambar. Sumbu vertikal: lensa kelayakan (PD ≤ 0,35 vs > 0,35). Sumbu horizontal: lensa fraud (bersih vs ada flag). Setiap berkas jatuh di satu kuadran, dan kuadran menentukan vonis TANPA diskusi ulang.",
      "Perhatikan dua sel kanan: begitu ada flag fraud, vonisnya selalu TOLAK + rujuk fraud — tidak peduli PD-nya 0,01 atau 0,9. Inilah arti “lensa yang lebih keras menentukan”. Satu-satunya vonis hijau adalah kiri-atas: layak DAN bersih.",
    ],
    tasks: [
      { id: "t1", text: "Pelajari tiap kuadran; uji dengan APP-0113 (PD 0,713 + skor manual) — kuadran mana?" },
      { id: "t2", text: "Tulis satu kalimat: kapan seorang analis boleh mengabaikan flag fraud?" },
    ],
    figure: {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="400" viewBox="0 0 760 400" role="img">
<rect x="0" y="0" width="760" height="400" fill="none"/>
<text x="380" y="28" text-anchor="middle" fill="#f5f5f5" font-size="16" font-weight="bold">Peta keputusan dua lensa — satu berkas, dua vonis</text>
<rect x="10" y="56" width="180" height="56" fill="#262626"/>
<text x="100" y="80" text-anchor="middle" fill="#f5f5f5" font-size="13">Berkas masuk</text>
<text x="100" y="99" text-anchor="middle" fill="#a3a3a3" font-size="12">dibaca dua lensa</text>
<rect x="190" y="56" width="275" height="56" fill="#262626"/>
<text x="327" y="80" text-anchor="middle" fill="#f5f5f5" font-size="13">Bersih</text>
<text x="327" y="99" text-anchor="middle" fill="#a3a3a3" font-size="12">0 flag fraud</text>
<rect x="465" y="56" width="275" height="56" fill="#262626"/>
<text x="602" y="80" text-anchor="middle" fill="#f5f5f5" font-size="13">Ada sinyal fraud</text>
<text x="602" y="99" text-anchor="middle" fill="#a3a3a3" font-size="12">1 flag atau lebih</text>
<rect x="10" y="112" width="180" height="124" fill="#262626"/>
<text x="100" y="164" text-anchor="middle" fill="#f5f5f5" font-size="13">Layak</text>
<text x="100" y="183" text-anchor="middle" fill="#a3a3a3" font-size="12">PD proxy 0,35 atau kurang</text>
<rect x="10" y="236" width="180" height="124" fill="#262626"/>
<text x="100" y="288" text-anchor="middle" fill="#f5f5f5" font-size="13">Tidak layak</text>
<text x="100" y="307" text-anchor="middle" fill="#a3a3a3" font-size="12">PD proxy di atas 0,35</text>
<rect x="190" y="112" width="275" height="124" fill="#14532d"/>
<text x="327" y="160" text-anchor="middle" fill="#f5f5f5" font-size="16" font-weight="bold">SETUJUI</text>
<text x="327" y="184" text-anchor="middle" fill="#d1fae5" font-size="13">cairkan</text>
<rect x="465" y="112" width="275" height="124" fill="#7f1d1d"/>
<text x="602" y="160" text-anchor="middle" fill="#f5f5f5" font-size="16" font-weight="bold">TOLAK</text>
<text x="602" y="184" text-anchor="middle" fill="#fecaca" font-size="13">+ rujuk unit fraud</text>
<rect x="190" y="236" width="275" height="124" fill="#713f12"/>
<text x="327" y="284" text-anchor="middle" fill="#f5f5f5" font-size="16" font-weight="bold">TOLAK</text>
<text x="327" y="308" text-anchor="middle" fill="#fef3c7" font-size="13">atau skema ulang</text>
<rect x="465" y="236" width="275" height="124" fill="#7f1d1d"/>
<text x="602" y="284" text-anchor="middle" fill="#f5f5f5" font-size="16" font-weight="bold">TOLAK</text>
<text x="602" y="308" text-anchor="middle" fill="#fecaca" font-size="13">+ rujuk unit fraud</text>
</svg>`,
      alt: "Matriks 2x2 keputusan dua lensa: layak-bersih disetujui, tiga kuadran lain ditolak, dua kuadran dengan flag fraud dirujuk ke unit fraud",
      caption: "Dua lensa dibaca bersamaan: kelayakan menentukan boleh atau tidak, sinyal fraud menentukan perlu investigasi. Flag fraud selalu menang.",
    },
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "12 berkas merah mau kamu apakan?",
    prose: [
      "Faktanya di meja: 12 berkas merah. 9 di antaranya LOLOS ambang PD (termasuk APP-0020 dengan PD 0,01 — “debitur terbaik” di file ini). 3 tidak lolos PD (APP-0039, APP-0046, APP-0113). Memo analis junior — yang akan kamu audit di Langkah 9 — mengklaim semuanya bersih dan merekomendasikan pencairan. Cabang menekan agar batch 1 cair minggu ini. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Keputusan apa yang kamu ambil atas 12 berkas merah? (Keputusan final — seperti memo yang sudah dikirim ke cabang.)",
      options: [
        {
          id: "opt-setujui",
          label: "Setujui semua yang lolos PD — cairkan 86 berkas",
          rationale:
            "Flag fraud hanyalah sinyal statistik, bukan bukti. 9 dari 12 berkas merah lolos ambang PD 0,35 — menahannya berarti menghukum debitur yang “terlihat” mencurigakan tanpa pembuktian, dan target penyaluran cabang meleset.",
          nextStepId: "kons-setujui",
          consequenceNote:
            "Cabang cair 86 berkas termasuk 9 berkas merah. 90 hari kemudian: 4 di antaranya menunggak, dan investigasi menemukan 6 berkas ber-no_hp sama adalah satu orang — dana Rp 84 juta mengalir ke satu rekening. Target tercapai; audit menemukan kamu mengabaikan flag tertulis.",
        },
        {
          id: "opt-bersyarat",
          label: "Setujui bersyarat — 74 berkas bersih cair, 12 berkas merah ditahan untuk verifikasi 5 hari",
          rationale:
            "Lensa fraud tidak boleh di-veto oleh lensa kelayakan. Berkas merah ditahan sementara: verifikasi telepon independen, cek fisik agunan, konfirmasi skor ke biro. Yang terbukti bersih tetap bisa cair — hanya tertunda, bukan dihukum.",
          nextStepId: "kons-bersyarat",
          consequenceNote:
            "Verifikasi 5 hari: 6 berkas hp-dup terbukti satu orang (dilaporkan ke unit fraud), 3 mismatch mengaku menggelembungkan pendapatan, 2 agunan ganda, 1 skor manual oleh oknum cabang. 74 berkas bersih cair tepat waktu; 1 berkas merah yang ternyata bersih ikut cair menyusul. Cabang protes keterlambatan — audit memuji jejak keputusanmu.",
        },
        {
          id: "opt-tolak",
          label: "Tolak 12 berkas merah + rujuk ke unit fraud, tunda batch sampai investigasi selesai",
          rationale:
            "Flag fraud = integritas data pengajuan rusak. Berkas dengan data bohong tidak bisa “dipertimbangkan” — ia harus ditolak dan dirujuk. Menunda batch lebih murah daripada menyalurkan dana ke sindikat.",
          nextStepId: "kons-tolak",
          consequenceNote:
            "Unit fraud mengonfirmasi pola sindikat pada 6 berkas hp-dup dan oknum cabang pada skor manual APP-0113. 74 berkas bersih cair setelah 2 minggu tertunda; cabang kehilangan momentum kuartal. Kamu tidak populer di cabang — tapi tidak ada dana bank yang mengalir ke penipuan yang sudah kamu tandai merah.",
        },
      ],
    },
  },
  {
    id: "kons-setujui",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: cairkan semua yang lolos PD",
    prose: [
      "Cabang girang — 86 berkas cair, target kuartal tercapai. Kamu mencatat di memo: “flag fraud belum terbukti, asas praduga tak bersalah”. Sembilan puluh hari kemudian telepon dari unit collection: 4 debitur “baru” menunggak bersamaan. Investigasi sederhana menemukan yang seharusnya kamu temukan di Lab 2: enam “orang” dengan satu nomor HP, dan dananya mengalir ke satu rekening yang sama.",
      "Pelajaran yang mahal: “belum terbukti” bukan alasan untuk mengabaikan sinyal tertulis — apalagi sinyal yang KAMU sendiri hitung. Di kredit, praduga tak bersalah berlaku untuk orang; untuk DATA, berlaku praduga verifikasi.",
    ],
    tasks: [],
    note: {
      title: "Flag yang diabaikan = temuan audit",
      body: "Ketika kamu sudah menghitung flag lalu mengabaikannya, jejak digitalnya tetap ada — dan auditor akan menemukannya. “Saya tidak tahu” masih bisa dibela; “saya tahu tapi tetap cairkan” tidak bisa. Di deliverable-mu, setiap berkas merah harus punya status tertulis: ditahan, ditolak, atau dibersihkan lewat verifikasi.",
    },
  },
  {
    id: "kons-bersyarat",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: tahan 12, verifikasi 5 hari",
    prose: [
      "Lima hari yang menegangkan. Tim verifikasi menelepon balik nomor-nomor di berkas — tiga nomor “kantor” ternyata tidak pernah diangkat. Surveyor cek fisik agunan: satu ruko diagunkan dua debitur berbeda. Konfirmasi ke biro: APP-0113 tidak pernah tercatat berskor 850. Dari 12 berkas merah, 11 terbukti bermasalah dan 1 ternyata bersih (ikut cair menyusul).",
      "74 berkas bersih cair tepat waktu — bisnis tetap jalan. Cabang memprotes “birokrasi 5 hari”, tapi laporan audit kuartal berikutnya menulis satu kalimat tentang divisimu: “pengambilan keputusan berbasis bukti dengan jejak verifikasi yang lengkap.”",
      "Ini jalan tengah yang bekerja: kamu tidak menghukum tanpa bukti (asas praduga tak bersalah untuk orang), tapi juga tidak mencairkan tanpa verifikasi (praduga verifikasi untuk data).",
    ],
    tasks: [],
    note: {
      title: "Bersyarat butuh SLA, bukan niat baik",
      body: "“Ditahan untuk verifikasi” hanya bermakna kalau ada batas waktu dan penanggung jawab: 5 hari, tim verifikasi, kriteria lolos/gagal tertulis. Tanpa SLA, “bersyarat” = “ditunda selamanya” atau “lolos diam-diam”. Di memo-mu, tulis ketiganya.",
    },
  },
  {
    id: "kons-tolak",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: tolak 12, rujuk fraud",
    prose: [
      "Keputusan terkeras — dan termahal secara politik. Cabang menuduh divisimu “menghambat bisnis”; 74 berkas bersih ikut tertunda dua minggu menunggu investigasi selesai. Tapi investigasi unit fraud mengonfirmasi semuanya: 6 berkas hp-dup = satu sindikat, APP-0113 = skor diubah oknum cabang yang kemudian diberhentikan.",
      "Dua minggu keterlambatan vs dana yang nyaris mengalir ke penipuan terorganisir. Tidak ada analis yang dipuji karena mencegah sesuatu yang tidak terjadi — tapi itulah pekerjaan ini: keberhasilanmu tidak terlihat, kegagalanmu masuk berita.",
    ],
    tasks: [],
    note: {
      title: "Penolakan massal butuh bukti massal",
      body: "Menolak 12 berkas sekaligus hanya bertahan bila tiap penolakan punya baris bukti (ID + aturan flag + angka). Tanpa itu, penolakan = kecurigaan. Dengan Lab 1 dan Lab 2 di tanganmu, penolakan = profesionalisme yang terdokumentasi.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 16 baris: memo yang mengklaim semuanya bersih",
    prose: [
      "Sebelum menulis memo keputusan, satu misi audit. Di bawah ini 16 baris “Ringkasan Verifikasi 150 Berkas” — memo analis junior R. Pratama yang mengklaim 150 berkas BERSIH dan merekomendasikan pencairan 86 berkas. Seseorang menyuntikkan 4 kebohongan ke dalamnya. Senjatamu: 12 berkas merah dari Lab 1 dan 6 nama dari Lab 2.",
      "Cara kerja: untuk setiap klaim memo, tanyakan “apakah angka ini cocok dengan file mentahku?” — bukan “apakah klaim ini terdengar masuk akal?”",
    ],
    tasks: [],
    auditDossier: {
      version: "gabung-berkas-m1c-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai memo verifikasi analis junior (R. Pratama) yang menyatakan 150 berkas bersih dan siap dicairkan.",
      columns: ["No", "Temuan", "Angka", "Status"],
      rows: [
        { rowId: 1, cells: { "No": "1", "Temuan": "Total berkas diterima dari cabang", "Angka": "150", "Status": "Lengkap" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 2, cells: { "No": "2", "Temuan": "Lolos ambang PD proxy (≤ 0,35)", "Angka": "86", "Status": "Lolos" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 3, cells: { "No": "3", "Temuan": "Di atas ambang PD, butuh review", "Angka": "64", "Status": "Review" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 4, cells: { "No": "4", "Temuan": "Rata-rata PD proxy portofolio", "Angka": "0,30", "Status": "Wajar" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 5, cells: { "No": "5", "Temuan": "Berkas tanpa agunan", "Angka": "36", "Status": "Catatan" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 6, cells: { "No": "6", "Temuan": "Verifikasi telepon (sampling 20 berkas)", "Angka": "20/20 aktif", "Status": "Lolos" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 7, cells: { "No": "7", "Temuan": "Kesesuaian nama–dokumen (sampling)", "Angka": "20/20 cocok", "Status": "Lolos" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 8, cells: { "No": "8", "Temuan": "Skor kredit eksternal (min–maks)", "Angka": "410–850", "Status": "Tercatat" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        // ── I1: pendapatan digelembungkan ──
        { rowId: 9, cells: { "No": "9", "Temuan": "Verifikasi pendapatan vs dokumen", "Angka": "150/150 sesuai (mismatch 0)", "Status": "Lolos" }, claims: [{ label: "Klaim memo", value: "Semua pendapatan sesuai dokumen" }] },
        // ── I2: agunan dihitung ganda ──
        { rowId: 10, cells: { "No": "10", "Temuan": "Agunan: total nilai & keunikan", "Angka": "Rp 28,94 M, 114 agunan unik", "Status": "Lolos" }, claims: [{ label: "Klaim memo", value: "Semua agunan unik, tidak ada ganda" }] },
        // ── I3: aplikasi duplikat disembunyikan ──
        { rowId: 11, cells: { "No": "11", "Temuan": "Duplikasi identitas antar berkas", "Angka": "150 pengajuan unik, nihil duplikat", "Status": "Lolos" }, claims: [{ label: "Klaim memo", value: "Tidak ada identitas ganda" }] },
        // ── I4: skor diturunkan/digelembungkan manual ──
        { rowId: 12, cells: { "No": "12", "Temuan": "Integritas skor kredit eksternal", "Angka": "100% dari biro, tanpa input manual", "Status": "Bersih" }, claims: [{ label: "Klaim memo", value: "Skor murni keluaran biro" }] },
        { rowId: 13, cells: { "No": "13", "Temuan": "Rekomendasi: cairkan batch 1", "Angka": "86 berkas", "Status": "Disarankan" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 14, cells: { "No": "14", "Temuan": "Estimasi nilai pencairan", "Angka": "Rp 8,7 M", "Status": "Estimasi" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 15, cells: { "No": "15", "Temuan": "Tindak lanjut 64 berkas review", "Angka": "3 hari kerja", "Status": "Terjadwal" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
        { rowId: 16, cells: { "No": "16", "Temuan": "Penyusun memo", "Angka": "R. Pratama, 2026-10-15", "Status": "—" }, claims: [{ label: "Sumber", value: "Memo R. Pratama" }] },
      ],
      injections: [
        { key: "pendapatan-digelembungkan", rowIds: [9], title: "Pendapatan digelembungkan, diklaim “mismatch 0”", clue: "Memo mengklaim 150/150 pendapatan sesuai dokumen. Lab 1-mu menemukan 3 berkas (APP-0083, APP-0115, APP-0149) dengan pendapatan ±2,5× dokumen. “Mismatch 0” berarti verifikasi kolom ini tidak pernah dilakukan.", danger: "Pendapatan digelembungkan → DTI dan plafon salah hitung → kredit yang “layak” di atas kertas macet di dunia nyata. Ini fraud paling klasik dan paling mahal." },
        { key: "agunan-dihitung-ganda", rowIds: [10], title: "Agunan dihitung ganda, diklaim “114 unik”", clue: "Memo mengklaim 114 agunan unik. Data mentah: 113 — satu nilai Rp 175 jt dipakai dua berkas (APP-0039 dan APP-0081). Total Rp 28,94 M kelebihan Rp 175 jt.", danger: "Agunan ganda → LGD (kerugian saat gagal bayar) salah hitung → recovery rate ilusi. Saat debitur macet, bank menemukan “jaminan” yang dikiranya ada ternyata milik orang lain juga." },
        { key: "duplikat-disembunyikan", rowIds: [11], title: "Aplikasi duplikat disembunyikan, diklaim “nihil duplikat”", clue: "Memo mengklaim 150 pengajuan unik. Lab 2-mu menemukan 6 berkas berbagi no_hp 081234567890 (APP-0020, APP-0040, APP-0046, APP-0119, APP-0127, APP-0145). Enam nama, satu nomor.", danger: "Satu orang banyak pengajuan = pola sindikat atau joki. Tanpa deteksi duplikat, bank menyalurkan dana berulang ke penipuan yang sama — dan tiap pencairan “sukses” melatih cabang untuk mengulanginya." },
        { key: "skor-diturunkan-manual", rowIds: [12], title: "Skor digelembungkan manual, diklaim “100% dari biro”", clue: "Memo mengklaim skor murni keluaran biro. Data: APP-0113 berskor 850 — di atas rentang wajar 410–800 di file ini — dengan masa kerja 0,6 tahun dan DTI 1,4. Profil seperti itu tidak mungkin mendapat 850 dari biro mana pun: skor diubah tangan.", danger: "Skor manual = kontrol internal jebol. Satu angka yang diubah tangan bisa meloloskan berkas apa pun melewati semua ambang otomatis. Ini bukan sekadar fraud aplikasi — ini fraud orang dalam." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Memo keputusan dua-lensa",
    prose: [
      "Semua bukti di tangan: 12 berkas merah dengan ID dan polanya, peta keputusan, hasil audit memo junior, dan keputusan bercabangmu. Tulis memo keputusan dua-lensa satu halaman untuk Kepala Divisi Risiko Kredit — artefak portofoliomu. Memo yang baik tidak hanya bilang “tolak 12 berkas”, tapi menunjukkan KENAPA tiap lensa berkata begitu, apa yang disembunyikan memo junior, dan apa yang harus terjadi berikutnya.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif dua lensa (3 kalimat): berapa berkas, berapa merah per pola, vonis akhir.",
        "Lensa 1 — kelayakan: rumus PD proxy, ambang 0,35, 86 lolos / 64 review, rata-rata PD 0,30.",
        "Lensa 2 — fraud: 12 berkas merah per pola (hp_dup 6: sebutkan ID; mismatch 3: sebutkan ID; agunan_dup 2: sebutkan ID; skor_manual 1: APP-0113) + temuan kunci (PD rata-rata merah 0,255 < hijau 0,309).",
        "Temuan audit memo junior: 4 suntikan (baris 9–12) — apa klaimnya vs apa kata data mentah.",
        "Keputusan & tindak lanjut: rujuk opsi Langkah 7-mu + SLA verifikasi (batas waktu, penanggung jawab, kriteria lolos/gagal) + ambang tindakan ke depan.",
        "Batas & risiko sisa: PD proxy bukan model resmi; data sintetis (pola fraud disengaja); verifikasi lapangan (telepon independen, cek fisik agunan) belum dilakukan di misi ini.",
      ],
      rubric: [
        { criterion: "Kebenaran dua lensa", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "PD proxy, ambang 0,35, 12 berkas merah per pola dengan ID — semua tepat"] },
        { criterion: "Deteksi suntikan memo", weight: 25, levels: ["Tidak menyebut suntikan", "Menyebut sebagian tanpa nomor baris", "Keempat suntikan disebut dengan nomor baris 9–12 + bukti data mentah"] },
        { criterion: "Kualitas keputusan", weight: 25, levels: ["Keputusan tanpa SLA verifikasi", "Ada keputusan, SLA kabur", "Keputusan + SLA eksplisit (waktu, penanggung jawab, kriteria) + ambang tindakan ke depan"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim analisis membuktikan segalanya", "Menyebut sebagian batas", "Batas (proxy≠model resmi, data sintetis, verifikasi lapangan belum dilakukan) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat suntikan di memo analis junior:",
      "1) **Pendapatan digelembungkan** (baris 9): memo mengklaim “mismatch 0”. Data mentah: APP-0083, APP-0115, dan APP-0149 berpengakuan ±2,5× dokumennya. Tiga berkas, satu pola: angka pengakuan ditulis agar DTI terlihat kecil.",
      "2) **Agunan dihitung ganda** (baris 10): memo mengklaim “114 agunan unik”. Data mentah: 113 — Rp 175 jt dipakai APP-0039 dan APP-0081. Total Rp 28,94 M kelebihan Rp 175 jt, dan LGD yang dihitung dari total itu ilusi.",
      "3) **Aplikasi duplikat disembunyikan** (baris 11): memo mengklaim “nihil duplikat”. Data mentah: 6 berkas, satu no_hp 081234567890. Enam nama berbeda tidak bisa menjelaskan satu nomor yang sama — kecuali keenamnya satu orang.",
      "4) **Skor digelembungkan manual** (baris 12): memo mengklaim “100% dari biro”. Data: APP-0113 berskor 850 dengan masa kerja 0,6 tahun dan DTI 1,4. Di file ini tidak ada berkas jujur di atas 800 — 850 adalah sidik jari tangan manusia, bukan keluaran biro.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim memo terhadap file mentah, atau memercayai stempel “verifikasi”. Dan ingat temuan paling mengganggu di Lab 1: rata-rata PD berkas merah 0,255 — LEBIH RENDAH dari berkas hijau 0,309. Fraud yang baik tidak menaikkan PD; ia menurunkannya. Setiap sistem yang hanya memakai lensa kelayakan sedang mengurutkan penipu sebagai debitur terbaiknya.",
      "Bahaya nyata terakhir: fraud aplikasi adalah pintu masuk termurah ke kerugian kredit — tanpa perampokan, tanpa pembobolan, hanya formulir yang diisi dengan angka yang salah. Satu cabang yang “tumbuh 40%” bisa jadi bukan cabang terbaik, melainkan cabang yang kontrolnya paling longgar. Tugas analis risiko bukan menemukan debitur terbaik — melainkan memastikan angka-angka yang dipakai untuk menilainya jujur.",
    ],
    tasks: [],
    note: {
      title: "Bahaya nyata: fraud aplikasi mendanai dirinya sendiri",
      type: "risk",
      body: "Pola 6-berkas-1-nomor bukan teori: skema seperti ini — satu identitas dipakai berulang, agunan dipakai ulang — adalah cara sindikat menguras plafon cabang demi cabang. Setiap pencairan yang “lancar” menjadi testimoni bagi cabang untuk melonggarkan kontrol berikutnya. Satu-satunya pemutus rantai: analis yang berani bilang “berkas sempurna ini tidak cair hari ini” — dengan 12 ID dan 4 aturan sebagai buktinya.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 12 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Dua lensa, satu vonis: kelayakan (PD proxy ≤ 0,35 → 86 lolos) dan fraud (4 aturan flag → 12 berkas merah); vonis akhir mengikuti lensa yang lebih keras — flag fraud selalu menang atas PD rendah.",
      "Temuan kunci Lab 1: rata-rata PD berkas merah 0,255 < berkas hijau 0,309 — fraud yang bagus justru terlihat paling layak; sistem satu-lensa mengurutkan penipu sebagai debitur terbaik.",
      "Empat pola fraud terdeteksi: no_hp dipakai ulang 6 berkas (APP-0020/0040/0046/0119/0127/0145), mismatch pendapatan 3 berkas (APP-0083/0115/0149), agunan ganda 2 berkas (APP-0039/0081), skor manual 1 berkas (APP-0113, skor 850).",
      "Empat suntikan di memo junior (baris 9–12): mismatch diklaim 0, agunan diklaim 114 unik, duplikat diklaim nihil, skor diklaim 100% dari biro — semua terbantahkan file mentah.",
      "Keputusan atas berkas merah selalu punya harga (cairkan / tahan-verifikasi / tolak-rujuk); setiap opsi “tahan” wajib punya SLA: batas waktu, penanggung jawab, kriteria lolos/gagal.",
      "Data: 100% sintetis, generator Python seed 42, 150 berkas, pola fraud disengaja; PD proxy = rumus misi ini, bukan model resmi bank; verifikasi lapangan tetap wajib di dunia nyata.",
    ],
  },
];

(misiGabungBerkas.steps as V2Step[]).push(...LANJUTAN_GABUNG);
