import type { V2Mission } from "../lib/types";

// ── MISI AUDIT IMUNISASI WHO ─────────────────────────────────────────────
// M1 DATA-SAINTEK — Health Data Science Misi B ("edge").
// Beda dari pilot misi-dbd-surveilans: bukan surveilans penyakit menular
// nasional, melainkan AUDIT KLAIM KEBERHASILAN program (imunisasi + mortalitas
// balita) lintas negara dari WHO GHO — dengan jebakan definisi (MCV2 beda
// jadwal), ambiguitas sumber (WUENIC vs country-reported), interval
// ketidakpastian estimasi model, dan kesenjangan ekuitas (kuintil kekayaan).
// Dataset: WHO GHO OData API (diakses 2026-10-15), 12 negara, 2000–2024,
// 1.400 baris. File: public/misi/misi-audit-imunisasi-who/who_imunisasi.csv
// (bersih) + who_imunisasi_audit.csv (3 injeksi terdokumentasi). METODE.md.

const BASE = "/misi/misi-audit-imunisasi-who";

export const misiAuditImunisasi: V2Mission = {
  slug: "misi-audit-imunisasi-who",
  track: "Health Data Science",
  module: "Misi",
  title: "Misi Angka Keberhasilan: Audit Klaim Imunisasi & Kematian Balita",
  estMinutes: 150,
  role: "Auditor data kesehatan masyarakat / konsultan evaluasi program",
  client:
    "Program officer yayasan donor — pencairan tranche hibah berikutnya bergantung pada verifikasi 'success story deck' sebuah LSM",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Deck yang terlalu bagus untuk tidak diverifikasi",
      prose: [],
      tasks: [],
      briefing: {
        role: "Auditor data kesehatan masyarakat untuk sebuah yayasan donor",
        client:
          "Program officer yayasan. Sebuah LSM mitra baru saja mengirim 'success story deck' 16 klaim: cakupan imunisasi 90%+, kematian balita turun >60%, program disebut model regional. Tranche hibah berikutnya — tujuh digit dolar — cair minggu depan bila klaimnya terverifikasi. Tugasmu bukan mencari-cari kesalahan, melainkan memastikan setiap angka di deck itu bisa dipertahankan di depan dewan yayasan.",
        story: [
          "Kamis sore, 16:20. Program officer meneruskan deck 16 slide dengan catatan: “Mereka mengklaim DTP3 Indonesia 2022 mencapai 96% dan U5MR turun 65% sejak 2000. Angka-angkanya dari WHO, katanya. Saya butuh kamu memverifikasi tiga hal sebelum dewan memutuskan: (1) apakah angka-angkanya benar-benar dari sumber yang diklaim, (2) apakah perbandingannya apel-dengan-apel, dan (3) apa yang disembunyikan di balik rata-rata nasional.”",
          "Kamu membuka WHO Global Health Observatory — sumber yang diklaim deck itu. Datanya nyata dan publik: estimasi WUENIC untuk imunisasi, estimasi model UN-IGME untuk mortalitas balita. Tapi semakin kamu menggali, semakin jelas jebakannya: MCV2 diukur 'menurut usia rekomendasi lokal' yang berbeda tiap negara; angka WUENIC dan angka laporan negara sering berbeda jauh; estimasi U5MR datang dengan interval ketidakpastian selebar ±30%; dan rata-rata nasional menyembunyikan jurang antara kuintil termiskin dan terkaya.",
          "Deck itu tidak berbohong secara terang-terangan — justru itu masalahnya. Klaim-klaimnya dipilih dengan cermat dari versi data yang paling menguntungkan. Misimu: bangun ulang angka-angkanya dari sumber primer, temukan 4 manipulasi yang disuntikkan ke salinan audit, dan tulis memo verifikasi yang berani berkata 'klaim ini tidak bisa dipertahankan' bila memang begitu.",
        ],
        objectives: [
          "Membangun ulang tren DTP3/MCV2 Indonesia 2000–2024 dari data WHO GHO dan mengukur dampak COVID (2019→2021) secara kuantitatif.",
          "Memverifikasi klaim 'U5MR turun >60%' dengan memperhitungkan interval ketidakpastian dan kesenjangan antar-kuintil kekayaan.",
          "Menemukan minimal 3 manipulasi pada deck/salinan audit (source swap, revision ghost, fabricated point, schedule trap) dengan bukti.",
          "Menulis memo verifikasi untuk dewan yayasan: klaim mana yang bertahan, mana yang gugur, dan apa yang harus diverifikasi di lapangan.",
        ],
        prereqSummary:
          "DTP3 = dosis ketiga vaksin difteri-tetanus-pertusis pada anak usia 1 tahun (proksi kekuatan sistem imunisasi rutin); WUENIC = estimasi WHO/UNICEF yang bisa berbeda dari angka laporan negara. U5MR = angka kematian balita per 1.000 kelahiran hidup — di sini berupa ESTIMASI MODEL (bukan sensus) sehingga selalu punya interval ketidakpastian. MCV2 = dosis kedua vaksin campak, diukur 'menurut usia rekomendasi lokal' — dan jadwal itu berbeda antar negara, sehingga perbandingan mentahnya tidak valid.",
        datasetNote:
          "Sumber: WHO Global Health Observatory OData API (diakses 2026-10-15). Indikator: WHS4_100 (DTP3, WUENIC), MCV2 (WUENIC), MDG_0000000007 (U5MR, UN-IGME, nasional + kuintil WQ1/WQ5).\nCakupan: 12 negara (IDN, MYS, THA, PHL, VNM, SGP, IND, BGD, BRA, NGA, KEN, ETH), 2000–2024 → 1.400 baris.\nKetentuan WHO: bundel kecil untuk public health purposes diperbolehkan dengan atribusi — 'Data: WHO Global Health Observatory, diakses 2026-10-15'.\nKejujuran: file who_imunisasi.csv = data API apa adanya. File who_imunisasi_audit.csv = salinan yang diaudit — SENGAJA dikotori (source swap, revision ghost, fabricated point). Detail: METODE.md — jangan dibaca dulu.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga indikator, tiga jenis kebohongan yang mungkin",
      prose: [
        "Dua file menunggumu. `who_imunisasi.csv` adalah versi bersih: 1.400 baris, kolom `negara, tahun, indikator, nilai, sumber, catatan`. Tiga indikator: `DTP3` dan `MCV2` (cakupan %, sumber WUENIC), serta `U5MR` (per 1.000 kelahiran hidup, sumber UN-IGME, dengan kolom catatan berisi interval ketidakpastian dan label kuintil).",
        "`who_imunisasi_audit.csv` adalah versi yang dipakai deck — dan yang akan kamu audit. Isinya 'sama', tapi 3 manipulasi disuntikkan: satu angka yang sumbernya ditukar (country-reported disajikan sebagai WUENIC), satu baris duplikat revisi tanpa catatan, dan satu titik proyeksi yang disajikan sebagai observasi. Detailnya di `METODE.md` — mengintipnya sekarang sama dengan menyontek.",
        "Aturan main: (1) bangun fakta HANYA dari file bersih; (2) kecurigaan HANYA pada file audit/deck; (3) setiap tuduhan manipulasi wajib punya bukti angka DAN bukti sumber.",
      ],
      tasks: [
        { id: "t1", text: "Buka `who_imunisasi.csv`: berapa baris, indikator apa saja, rentang tahunnya" },
        { id: "t2", text: "Baca kolom `catatan` untuk baris MCV2 dan U5MR — apa peringatan yang tertulis di sana" },
      ],
      note: {
        title: "Miskonsepsi #1: 'datanya dari WHO' = angkanya pasti benar",
        type: "pitfall",
        body: "WHO menerbitkan ESTIMASI, bukan kebenaran. WUENIC adalah estimasi WHO/UNICEF yang sering berbeda dari angka laporan negara — dan LSM boleh memilih yang lebih tinggi. U5MR adalah keluaran model dengan interval ±30%. 'Dari WHO' menjawab soal sumber, bukan soal kejujuran cara angka itu dipakai.",
      },
      reference:
        "who_imunisasi.csv (bersih, 1.400 baris) vs who_imunisasi_audit.csv (3 manipulasi). Fakta dari yang bersih; audit pada yang kotor.",
    },
    {
      id: "lab-dtp3",
      eyebrow: "Langkah 3 · Lab 1 — Lubang COVID pada kurva imunisasi",
      title: "Berapa dalam DTP3 jatuh saat pandemi?",
      prose: [
        "Deck mengklaim 'kemajuan stabil' imunisasi. Klaim itu hanya bisa diuji dengan melihat seluruh deret waktunya — termasuk 2020–2021, tahun-tahun yang ingin dilupakan semua program imunisasi. DTP3 Indonesia jatuh dari 85% (2019) ke 67% (2021): penurunan 18 poin, terdalam di antara 12 negara dalam file ini. Itulah konteks yang dihilangkan deck.",
        "Lab ini memakai file BERSIH. Hitung penurunannya sendiri — dan cari tahu negara mana yang paling terpukul.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; saring indikator DTP3" },
        { id: "t2", text: "Hitung DTP3 Indonesia 2019 dan 2021 → `dtp3_idn_2019`, `dtp3_idn_2021`, selisihnya `drop_idn`" },
        { id: "t3", text: "Hitung penurunan 2019→2021 untuk semua 12 negara; simpan nama negara dengan penurunan terbesar di `negara_max_drop` dan MCV2 Indonesia 2021 di `mcv2_idn_2021`" },
      ],
      expected:
        "dtp3_idn_2019=85.0, dtp3_idn_2021=67.0, drop_idn=18.0, negara_max_drop='IDN', mcv2_idn_2021=53.0",
      note: {
        title: "Miskonsepsi #2: tren yang 'pulih' berarti tidak ada yang hilang",
        type: "pitfall",
        body: "DTP3 Indonesia 2024 memang kembali ke 78% — tapi anak yang tidak diimunisasi pada 2020–2021 tidak 'terkejar' oleh angka 2024. Cakupan adalah foto per tahun kohort; lubang 18 poin berarti satu generasi balita dengan proteksi berlubang. Deck yang hanya menampilkan 2022–2024 menyembunyikan mereka.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))`.",
        "Saring: `(df['indikator']=='DTP3') & (df['negara']=='IDN')` — lalu pilih tahun dengan `.set_index('tahun')` atau boolean mask.",
        "Penurunan per negara: pivot `df_dtp3.pivot(index='negara', columns='tahun', values='nilai')` lalu kurangkan kolom 2019 − 2021; `.idxmax()` untuk negaranya.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-audit-imunisasi-who/who_imunisasi.csv\"",
          "",
          "df = pd.read_csv(open_url(URL))",
          "dtp3 = df[df[\"indikator\"] == \"DTP3\"]",
          "",
          "dtp3_idn_2019 = ...   # nilai DTP3 Indonesia 2019",
          "dtp3_idn_2021 = ...   # nilai DTP3 Indonesia 2021",
          "drop_idn = ...        # selisihnya (2019 - 2021)",
          "",
          "pivot = ...           # pivot negara x tahun dari dtp3",
          "drop_semua = ...      # Series penurunan 2019->2021 per negara",
          "negara_max_drop = ... # nama negara, string",
          "",
          "mcv2_idn_2021 = ...   # MCV2 Indonesia 2021",
          "",
          "print(\"IDN DTP3 2019:\", dtp3_idn_2019, \"| 2021:\", dtp3_idn_2021, \"| drop:\", drop_idn)",
          "print(\"penurunan terbesar:\", negara_max_drop)",
          "print(\"IDN MCV2 2021:\", mcv2_idn_2021)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-audit-imunisasi-who/who_imunisasi.csv\"",
          "",
          "df = pd.read_csv(open_url(URL))",
          "dtp3 = df[df[\"indikator\"] == \"DTP3\"]",
          "",
          "dtp3_idn_2019 = float(dtp3[(dtp3[\"negara\"] == \"IDN\") & (dtp3[\"tahun\"] == 2019)][\"nilai\"].iloc[0])",
          "dtp3_idn_2021 = float(dtp3[(dtp3[\"negara\"] == \"IDN\") & (dtp3[\"tahun\"] == 2021)][\"nilai\"].iloc[0])",
          "drop_idn = round(dtp3_idn_2019 - dtp3_idn_2021, 1)",
          "",
          "pivot = dtp3.pivot(index=\"negara\", columns=\"tahun\", values=\"nilai\")",
          "drop_semua = pivot[2019] - pivot[2021]",
          "negara_max_drop = str(drop_semua.idxmax())",
          "",
          "mcv2_idn_2021 = float(df[(df[\"indikator\"] == \"MCV2\") & (df[\"negara\"] == \"IDN\") & (df[\"tahun\"] == 2021)][\"nilai\"].iloc[0])",
          "",
          "print(\"IDN DTP3 2019:\", dtp3_idn_2019, \"| 2021:\", dtp3_idn_2021, \"| drop:\", drop_idn)",
          "print(\"penurunan terbesar:\", negara_max_drop)",
          "print(\"IDN MCV2 2021:\", mcv2_idn_2021)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`dtp3` tersaring", name: "dtp3", msg: "dtp3 harus berisi baris indikator DTP3 saja." },
          { kind: "equal", task: "t2", label: "`dtp3_idn_2019` = 85.0", name: "dtp3_idn_2019", value: 85.0, msg: "DTP3 Indonesia 2019 = 85.0 (WUENIC)." },
          { kind: "equal", task: "t2", label: "`dtp3_idn_2021` = 67.0", name: "dtp3_idn_2021", value: 67.0, msg: "DTP3 Indonesia 2021 = 67.0 — titik terendah pandemi." },
          { kind: "equal", task: "t2", label: "`drop_idn` = 18.0", name: "drop_idn", value: 18.0, tol: 0.05, msg: "85.0 − 67.0 = 18.0 poin." },
          { kind: "equal", task: "t3", label: "`negara_max_drop` = IDN", name: "negara_max_drop", value: "IDN", msg: "Indonesia mengalami penurunan DTP3 2019→2021 terdalam di antara 12 negara." },
          { kind: "equal", task: "t3", label: "`mcv2_idn_2021` = 53.0", name: "mcv2_idn_2021", value: 53.0, msg: "MCV2 Indonesia 2021 = 53.0 — campak ikut jatuh." },
        ],
      },
    },
    {
      id: "lab-u5mr",
      eyebrow: "Langkah 4 · Lab 2 — 'Turun 65%' — dengan interval selebar apa?",
      title: "Klaim penurunan vs ketidakpastian model",
      prose: [
        "Klaim utama deck: 'U5MR Indonesia turun 65,6% sejak 2000'. Hitungannya benar: (51,38 − 17,69) / 51,38 × 100% = 65,6%. Tapi U5MR adalah ESTIMASI MODEL — Indonesia 2024: 17,69 dengan interval [14,6–21,8]; tahun 2000: 51,38 dengan interval [48,6–54,2]. Klaim 'turun' itu solid (intervalnya tidak tumpang tindih), TAPI presisi '65,6%'-nya menipu: dengan interval selebar itu, angka pastinya bisa 60% atau 70%.",
        "Dan ada yang lebih penting dari presisi: kolom catatan menyimpan U5MR per kuintil kekayaan. Rata-rata nasional 17,69 menyembunyikan WQ1 (termiskin) 26,02 vs WQ5 (terkaya) 11,06 — jurang 2,35×. 'Keberhasilan nasional' yang tidak dinikmati sepertiga termiskin bukanlah keberhasilan yang selesai.",
      ],
      tasks: [
        { id: "t1", text: "Saring U5MR nasional Indonesia 2000 & 2024 → hitung `reduksi_pct` = (2000−2024)/2000×100" },
        { id: "t2", text: "Ambil U5MR WQ1 dan WQ5 Indonesia 2024 → `rasio_wq` = WQ1/WQ5" },
      ],
      expected: "reduksi_pct=65.6, rasio_wq=2.35",
      note: {
        title: "Rumus yang dipakai (dengan contoh angka konkret)",
        body: "Reduksi persen = (nilai_awal − nilai_akhir) / nilai_awal × 100%. Di sini: (51,38 − 17,69) / 51,38 × 100% = 65,6%. Rasio ekuitas = WQ1 / WQ5 = 26,02 / 11,06 = 2,35 — artinya anak di kuintil termiskin berisiko 2,35 kali lebih besar meninggal sebelum usia 5 tahun dibanding kuintil terkaya, di negara yang sama, tahun yang sama.",
      },
      hints: [
        "U5MR nasional: saring `catatan` yang mengandung 'nasional' — hati-hati, ada juga baris WQ1/WQ5.",
        "Gunakan `.str.contains('nasional')` pada kolom catatan.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-audit-imunisasi-who/who_imunisasi.csv\"",
          "",
          "df = pd.read_csv(open_url(URL))",
          "u5 = df[df[\"indikator\"] == \"U5MR\"]",
          "nas = u5[u5[\"catatan\"].str.contains(\"nasional\", na=False)]",
          "idn = nas[nas[\"negara\"] == \"IDN\"]",
          "",
          "v2000 = ...  # nilai U5MR nasional IDN 2000",
          "v2024 = ...  # nilai U5MR nasional IDN 2024",
          "reduksi_pct = ...  # (v2000-v2024)/v2000*100, bulatkan 1 desimal",
          "",
          "q = u5[(u5[\"negara\"] == \"IDN\") & (u5[\"tahun\"] == 2024)]",
          "wq1 = ...  # nilai baris WQ1-termiskin",
          "wq5 = ...  # nilai baris WQ5-terkaya",
          "rasio_wq = ...  # wq1/wq5, bulatkan 2 desimal",
          "",
          "print(\"reduksi 2000->2024:\", reduksi_pct, \"%\")",
          "print(\"rasio WQ1/WQ5 2024:\", rasio_wq)",
        ].join("\n"),
        lockLines: 12,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-audit-imunisasi-who/who_imunisasi.csv\"",
          "",
          "df = pd.read_csv(open_url(URL))",
          "u5 = df[df[\"indikator\"] == \"U5MR\"]",
          "nas = u5[u5[\"catatan\"].str.contains(\"nasional\", na=False)]",
          "idn = nas[nas[\"negara\"] == \"IDN\"]",
          "",
          "v2000 = float(idn[idn[\"tahun\"] == 2000][\"nilai\"].iloc[0])",
          "v2024 = float(idn[idn[\"tahun\"] == 2024][\"nilai\"].iloc[0])",
          "reduksi_pct = round((v2000 - v2024) / v2000 * 100, 1)",
          "",
          "q = u5[(u5[\"negara\"] == \"IDN\") & (u5[\"tahun\"] == 2024)]",
          "wq1 = float(q[q[\"catatan\"].str.contains(\"WQ1\", na=False)][\"nilai\"].iloc[0])",
          "wq5 = float(q[q[\"catatan\"].str.contains(\"WQ5\", na=False)][\"nilai\"].iloc[0])",
          "rasio_wq = round(wq1 / wq5, 2)",
          "",
          "print(\"reduksi 2000->2024:\", reduksi_pct, \"%\")",
          "print(\"rasio WQ1/WQ5 2024:\", rasio_wq)",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t1", label: "`reduksi_pct` = 65.6", name: "reduksi_pct", value: 65.6, tol: 0.2, msg: "(51.38 − 17.69)/51.38 × 100% = 65.6%." },
          { kind: "equal", task: "t2", label: "`rasio_wq` = 2.35", name: "rasio_wq", value: 2.35, tol: 0.03, msg: "26.02 / 11.06 = 2.35." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 5 · Lab 3 — Hantu revisi",
      title: "Satu negara-tahun, dua angka: revisi yang tak dicatat",
      prose: [
        "Estimasi model DIREVISI tiap putaran publikasi — itu normal dan sehat. Yang tidak sehat: dua versi angka beredar tanpa catatan revisi, lalu deck memilih yang lebih bagus. Di tabel kecil ini (klaim U5MR Indonesia dari deck), ada satu pasangan (negara, tahun, indikator) yang muncul DUA KALI dengan nilai berbeda. Temukan dengan `GROUP BY` + `HAVING COUNT(DISTINCT nilai) > 1`.",
        "Tabel `klaim(negara, tahun, indikator, nilai, sumber_klaim)`.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query yang menemukan (negara, tahun, indikator) dengan nilai ganda yang berbeda" },
      ],
      expected: "1 grup: IDN 2020 U5MR — 20.81 vs 23.31",
      sqlLab: {
        task: "Temukan klaim ganda: kelompokkan per (negara, tahun, indikator) dan saring yang punya lebih dari satu nilai BERBEDA.",
        schema: "CREATE TABLE klaim (negara TEXT, tahun INTEGER, indikator TEXT, nilai REAL, sumber_klaim TEXT);",
        seedData: [
          "INSERT INTO klaim VALUES",
          "('IDN', 2020, 'U5MR', 20.81, 'UN-IGME'),",
          "('IDN', 2020, 'U5MR', 23.31, 'UN-IGME'),",
          "('IDN', 2024, 'U5MR', 17.69, 'UN-IGME'),",
          "('IDN', 2023, 'DTP3', 83.0, 'WUENIC'),",
          "('MYS', 2023, 'DTP3', 98.0, 'WUENIC'),",
          "('PHL', 2021, 'DTP3', 69.0, 'WUENIC'),",
          "('IDN', 2021, 'DTP3', 67.0, 'WUENIC'),",
          "('NGA', 2024, 'U5MR', 115.65, 'UN-IGME');",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT negara, tahun, indikator\nFROM klaim\n",
        solution: [
          "SELECT negara, tahun, indikator, COUNT(DISTINCT nilai) AS n_nilai,",
          "       GROUP_CONCAT(DISTINCT nilai) AS nilai_beda",
          "FROM klaim",
          "GROUP BY negara, tahun, indikator",
          "HAVING COUNT(DISTINCT nilai) > 1;",
        ].join("\n"),
        expectedColumns: ["negara", "tahun", "indikator", "n_nilai", "nilai_beda"],
        expectedRows: [
          ["IDN", 2020, "U5MR", 2, "20.81,23.31"],
        ],
      },
    },
  ],
};

export default misiAuditImunisasi;

// ── lanjutan: kuis, keputusan + 3 cabang, audit, deliverable, debrief, rangkuman
import type { V2Step } from "../lib/types";

const LANJUTAN_WHO: V2Step[] = [
  {
    id: "kuis-mcv2",
    eyebrow: "Langkah 6 · Kuis konsep",
    title: "Jebakan jadwal: MCV2 Malaysia vs Indonesia",
    prose: [
      "Deck membandingkan: 'MCV2 Malaysia 2023 = 95% vs Indonesia 2023 = 69% — program Malaysia lebih baik.' Kedua angka memang dari indikator MCV2 WHO yang sama. Tapi baca kolom catatan di data room: MCV2 diukur 'menurut usia rekomendasi lokal' — dan usia rekomendasi dosis kedua campak BERBEDA antar negara (ada yang 15 bulan, ada yang 7 tahun). Membandingkan cakupan pada usia yang berbeda seperti membandingkan kecepatan lari 100m dengan maraton.",
    ],
    tasks: [],
    quiz: [
      {
        q: "Mana kesimpulan yang VALID dari 'MCV2 Malaysia 2023 (95%) > Indonesia 2023 (69%)'?",
        options: [
          {
            text: "Program imunisasi Malaysia lebih baik — angkanya lebih tinggi",
            why: "Salah. Angka lebih tinggi tidak otomatis berarti program lebih baik bila DEFINISI pengukurannya berbeda. Ini jebakan klasik evaluasi lintas negara.",
          },
          {
            text: "Tidak bisa disimpulkan langsung — jadwal usia rekomendasi berbeda, jadi penyebutnya tidak sebanding",
            why: "Benar. MCV2 = 'by the locally recommended age'. Malaysia dan Indonesia merekomendasikan dosis kedua pada usia berbeda, sehingga 95% vs 69% membandingkan dua hal yang tidak sebanding. Kesimpulan yang jujur: minta dulu jadwalnya, atau bandingkan MCV1 (dosis pertama, jadwal lebih seragam).",
            correct: true,
          },
          {
            text: "Data Malaysia pasti dimanipulasi karena terlalu tinggi",
            why: "Salah arah. Jangan menuduh manipulasi tanpa bukti — masalahnya di sini adalah keterbandingan definisi, bukan kejujuran angka.",
          },
        ],
      },
    ],
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Anggaran verifikasi lapangan hanya cukup untuk 1 klaim",
    prose: [
      "Program officer menelepon: tim verifikasi lapangan hanya bisa mendalami SATU klaim minggu ini. Kamu sudah punya tiga kandidat, masing-masing menyerang deck dari sisi berbeda. Pilihanmu menentukan bukti apa yang terbuka di langkah berikut — dan satu klaim yang tidak kamu pilih akan lolos ke dewan tanpa verifikasi.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Klaim mana yang kamu prioritaskan untuk verifikasi lapangan? (Keputusan final — seperti memo yang sudah dikirim ke dewan.)",
      options: [
        {
          id: "opt-dtp3",
          label: "Klaim DTP3 ≥90% (2022–2024) — verifikasi sumber angkanya",
          rationale:
            "Dua dari tiga angka DTP3 terbaru terlihat 'terlalu mulus' dibanding lubang COVID 2021. Kalau sumbernya ditukar (country-reported disajikan sebagai WUENIC), seluruh narasi pemulihan runtuh.",
          nextStepId: "temuan-dtp3",
          consequenceNote:
            "Terkonfirmasi: angka 2022 (96%) bukan WUENIC — nilai WUENIC aslinya 91. Angka 2024 (97%) bahkan bukan observasi melainkan proyeksi. Narasi 'pulih melampaui pra-pandemi' gugur. Tapi klaim U5MR lolos tanpa verifikasi — dan revisi hantu di sana tetap bersembunyi.",
        },
        {
          id: "opt-u5mr",
          label: "Klaim 'U5MR turun >60%' — bedah interval & revisinya",
          rationale:
            "65,6% terdengar presisi, tapi intervalnya ±30% dan ada baris duplikat revisi. Kalau klaim andalan deck ini goyah, kredibilitas seluruh deck ikut goyah.",
          nextStepId: "temuan-u5mr",
          consequenceNote:
            "Ditemukan: baris U5MR 2020 ganda (20,81 vs 23,31) tanpa catatan revisi — deck memakai yang lebih rendah. Klaim 'turun' tetap benar secara arah (interval tidak tumpang tindih), tapi presisi '65,6%' tidak bisa dipertahankan. Sementara manipulasi sumber DTP3 lolos ke dewan.",
        },
        {
          id: "opt-ekuitas",
          label: "Kesenjangan WQ1 vs WQ5 — keberhasilan untuk siapa?",
          rationale:
            "Rata-rata nasional menyembunyikan jurang 2,35×. Donor yang peduli ekuitas perlu tahu: apakah 'keberhasilan' ini dinikmati yang termiskin?",
          nextStepId: "temuan-ekuitas",
          consequenceNote:
            "Terungkap: WQ1 2024 (26,02) masih setara rata-rata nasional tahun 2010-an awal — 'keberhasilan' belum sampai ke yang termiskin. Temuan ini mengubah REKOMENDASI hibah (sasar kuintil bawah), tapi tidak membatalkan satu pun angka deck — manipulasi sumber dan revisi tetap lolos.",
        },
      ],
    },
  },
  {
    id: "temuan-dtp3",
    goto: "audit",
    eyebrow: "Langkah 8 · Temuan lapangan",
    title: "Hasil verifikasi: angka DTP3 2022–2024",
    prose: [
      "Tim membandingkan angka deck dengan API WHO langsung. Hasilnya telak: DTP3 Indonesia 2022 versi WUENIC adalah 91% — bukan 96% seperti di deck. Angka 96% berasal dari laporan negara (yang memang hampir selalu lebih tinggi dari estimasi independen). Sumbernya ditukar, labelnya tetap 'WUENIC'.",
      "Lebih parah: angka 2024 (97%) tidak ada di API sama sekali untuk tahun berjalan — itu angka proyeksi internal LSM yang disajikan sebagai observasi. Dua dari tiga pilar narasi 'pemulihan melampaui pra-pandemi' runtuh dalam satu sore.",
      "Harga pilihanmu: klaim U5MR tidak terverifikasi. Baris duplikat revisi 2020 tetap bersembunyi di deck — dan dewan akan melihat angka '65,6%' tanpa tahu ada dua versi.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: verifikasi sumber, bukan cuma angka",
      body: "Angka 96% itu 'benar' sebagai angka laporan negara — yang salah adalah LABEL sumbernya. Auditor data kesehatan harus selalu bertanya: angka ini dari ESTIMASI siapa, dengan METODE apa? Satu kolom 'sumber' yang tidak diverifikasi bisa meruntuhkan seluruh deck.",
    },
  },
  {
    id: "temuan-u5mr",
    goto: "audit",
    eyebrow: "Langkah 8 · Temuan lapangan",
    title: "Hasil verifikasi: klaim penurunan U5MR",
    prose: [
      "Tim menarik ulang deret U5MR dari API WHO dan menemukan baris ganda untuk Indonesia 2020: 20,81 dan 23,31 — dua putaran estimasi model tanpa catatan revisi. Deck memakai 20,81 (yang lebih rendah, membuat penurunan terlihat lebih curam). Ini bukan pemalsuan — ini cherry-picking versi estimasi.",
      "Kabar baiknya untuk deck: klaim arah 'turun' tetap bertahan. Interval 2000 [48,6–54,2] dan 2024 [14,6–21,8] tidak tumpang tindih — penurunannya nyata secara statistik. Yang gugur adalah PRESISINYA: '65,6%' dengan interval selebar itu lebih tepat dibaca 'sekitar dua pertiga, plus-minus belasan poin'.",
      "Harga pilihanmu: manipulasi sumber DTP3 (96% dan 97%) lolos ke dewan tanpa verifikasi — dan itulah klaim yang paling menentukan narasi 'sudah pulih'.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: arah vs presisi",
      body: "Auditor yang baik membedakan DUA pertanyaan: (1) apakah arahnya benar? (2) apakah angkanya bisa dipertahankan? Deck ini lolos (1) tapi gagal (2). Dewan butuh kedua jawaban itu — dan hanya verifikasi lapangan yang bisa memberikannya.",
    },
  },
  {
    id: "temuan-ekuitas",
    goto: "audit",
    eyebrow: "Langkah 8 · Temuan lapangan",
    title: "Hasil verifikasi: siapa yang menikmati 'keberhasilan'",
    prose: [
      "Tim memecah U5MR 2024 per kuintil kekayaan — data yang tersedia di API WHO tapi tidak pernah dikutip deck. Hasilnya mengubah seluruh rekomendasi: WQ1 (termiskin) 26,02 vs WQ5 (terkaya) 11,06. Anak di kuintil termiskin berisiko 2,35× lebih besar meninggal sebelum usia 5 tahun. Angka WQ1 2024 bahkan setara rata-rata nasional satu dekade lalu.",
      "'Keberhasilan nasional' ternyata keberhasilan yang tidak merata. Rekomendasimu ke dewan berubah total: bukan 'cairkan dan replikasi modelnya', melainkan 'cairkan dengan syarat penajaman ke kuintil bawah — karena di sanalah kematian balita masih terkonsentrasi'.",
      "Harga pilihanmu: tidak satu pun manipulasi angka yang terbongkar. Deck lolos ke dewan dengan angka-angka yang terlihat utuh — dan dewan tidak akan pernah tahu ada source swap dan revision ghost di dalamnya.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: rata-rata adalah penyamaran",
      body: "Kamu memilih pertanyaan yang paling penting secara moral — dan itu mengubah KEBIJAKAN, bukan verifikasi. Pelajarannya: audit punya dua mode, 'apakah angkanya benar' dan 'apakah angkanya adil'. Auditor hebat tahu kapan memakai yang mana — dan jujur mengakui mode mana yang TIDAK ia jalankan.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 16 klaim: temukan 4 manipulasi",
    prose: [
      "Misi auditnya. Di bawah ini 16 klaim dari 'success story deck' — semuanya mengklaim bersumber dari WHO. Empat di antaranya dimanipulasi tanpa pengumuman: sumber ditukar, revisi digandakan, proyeksi disajikan sebagai observasi, dan perbandingan yang tidak sebanding. Tandai klaim yang janggal, lalu buka debrief.",
      "Senjatamu: angka-angka dari Lab 1–3, pemahaman tentang WUENIC vs country-reported, dan kebiasaan membaca kolom 'sumber' sebelum memercayai 'angka'.",
    ],
    tasks: [],
    auditDossier: {
      version: "who-m1b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini berisi 16 klaim dari 'success story deck' LSM — semuanya mengklaim bersumber dari WHO Global Health Observatory.",
      columns: ["#", "Klaim", "Angka", "Sumber (menurut deck)"],
      rows: [
        { rowId: 1, cells: { "#": "1", "Klaim": "DTP3 Indonesia 2023", "Angka": "83%", "Sumber (menurut deck)": "WUENIC" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        // ── I1: source swap ──
        { rowId: 2, cells: { "#": "2", "Klaim": "DTP3 Indonesia 2022", "Angka": "96%", "Sumber (menurut deck)": "WUENIC" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        // ── I3: fabricated point ──
        { rowId: 3, cells: { "#": "3", "Klaim": "DTP3 Indonesia 2024", "Angka": "97%", "Sumber (menurut deck)": "Observasi" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 4, cells: { "#": "4", "Klaim": "MCV2 Indonesia 2021", "Angka": "53%", "Sumber (menurut deck)": "WUENIC" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        // ── I4: schedule trap ──
        { rowId: 5, cells: { "#": "5", "Klaim": "MCV2 Malaysia 2023 (95%) > Indonesia 2023 (69%) — program MY lebih baik", "Angka": "95% vs 69%", "Sumber (menurut deck)": "WUENIC" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 6, cells: { "#": "6", "Klaim": "U5MR Indonesia 2024", "Angka": "17,7 [14,6–21,8]", "Sumber (menurut deck)": "UN-IGME" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        // ── I2: revision ghost (pasangan) ──
        { rowId: 7, cells: { "#": "7", "Klaim": "U5MR Indonesia 2020", "Angka": "20,81", "Sumber (menurut deck)": "UN-IGME" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 8, cells: { "#": "8", "Klaim": "U5MR Indonesia 2020 (revisi)", "Angka": "23,31", "Sumber (menurut deck)": "UN-IGME" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 9, cells: { "#": "9", "Klaim": "U5MR turun 65,6% sejak 2000", "Angka": "65,6%", "Sumber (menurut deck)": "Hitungan deck" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 10, cells: { "#": "10", "Klaim": "U5MR kuintil termiskin (WQ1) 2024", "Angka": "26,02", "Sumber (menurut deck)": "UN-IGME" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 11, cells: { "#": "11", "Klaim": "U5MR kuintil terkaya (WQ5) 2024", "Angka": "11,06", "Sumber (menurut deck)": "UN-IGME" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 12, cells: { "#": "12", "Klaim": "DTP3 Indonesia 2019", "Angka": "85%", "Sumber (menurut deck)": "WUENIC" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 13, cells: { "#": "13", "Klaim": "DTP3 Indonesia 2021", "Angka": "67%", "Sumber (menurut deck)": "WUENIC" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 14, cells: { "#": "14", "Klaim": "DTP3 Filipina 2021", "Angka": "69%", "Sumber (menurut deck)": "WUENIC" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 15, cells: { "#": "15", "Klaim": "DTP3 Singapura 2023", "Angka": "98%", "Sumber (menurut deck)": "WUENIC" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
        { rowId: 16, cells: { "#": "16", "Klaim": "U5MR Nigeria 2024", "Angka": "115,65", "Sumber (menurut deck)": "UN-IGME" }, claims: [{ label: "Status deck", value: "Terverifikasi internal" }] },
      ],
      injections: [
        { key: "source-swap", rowIds: [2], title: "Angka country-reported disajikan sebagai WUENIC", clue: "WUENIC Indonesia 2022 aslinya 91% — angka 96% berasal dari laporan negara. Label 'sumber' di deck tidak diverifikasi ke API.", danger: "Narasi 'pulih melampaui pra-pandemi' berdiri di atas label sumber yang salah; dewan mengambil keputusan dari perbandingan yang tidak apel-dengan-apel." },
        { key: "fabricated-point", rowIds: [3], title: "Titik proyeksi disajikan sebagai observasi", clue: "Tidak ada observasi DTP3 2024 setinggi 97% di API WHO — itu proyeksi internal. Titik paling kanan pada kurva adalah yang paling mudah dipalsukan karena belum ada yang bisa membantahnya.", danger: "Keputusan hibah berbasis 'tren' yang ujungnya adalah angan-angan." },
        { key: "schedule-trap", rowIds: [5], title: "Perbandingan MCV2 lintas negara beda jadwal", clue: "MCV2 diukur 'menurut usia rekomendasi lokal' — Malaysia dan Indonesia memakai jadwal berbeda. 95% vs 69% bukan perbandingan yang valid.", danger: "Benchmarking antar-negara yang salah kaprah menghasilkan 'model' yang tidak bisa direplikasi — karena yang dibandingkan memang tidak sebanding." },
        { key: "revision-ghost", rowIds: [7, 8], title: "Duplikat revisi tanpa catatan", clue: "Dua versi estimasi U5MR 2020 (20,81 vs 23,31) beredar tanpa catatan revisi; deck memakai yang lebih rendah. Revisi model itu normal — menyembunyikannya tidak.", danger: "Presisi '65,6%' bergantung pada versi estimasi mana yang dipilih; tanpa catatan revisi, angka itu tidak bisa direproduksi." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Memo verifikasi untuk dewan yayasan",
    prose: [
      "Semua bukti di tangan. Tulis memo verifikasi satu halaman untuk dewan yayasan — dokumen yang menentukan apakah tranche tujuh digit cair. Tulis seolah dibaca orang yang memegang uangnya.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): apakah deck bisa dipertahankan?",
        "Klaim per klaim: mana yang bertahan (dengan bukti API), mana yang gugur (dengan bukti manipulasi).",
        "Temuan metodologis: jebakan definisi & sumber apa yang kamu temukan (WUENIC vs country-reported, jadwal MCV2, interval U5MR, kesenjangan kuintil).",
        "Rekomendasi keputusan: cairkan / cairkan bersyarat / tunda — dengan syarat verifikasi lapangan yang konkret.",
        "Batas analisis (kejujuran): apa yang TIDAK bisa kamu simpulkan dari data ini.",
      ],
      rubric: [
        { criterion: "Deteksi manipulasi", weight: 25, levels: ["Tidak menyebut manipulasi", "Menyebut sebagian tanpa bukti sumber", "Semua jenis manipulasi disebut dengan bukti API"] },
        { criterion: "Kebenaran analisis", weight: 25, levels: ["Angka tidak dibangun ulang", "Angka dibangun ulang tapi interval/kuintil diabaikan", "Angka + interval + ekuitas dipakai menilai klaim"] },
        { criterion: "Kualitas keputusan", weight: 20, levels: ["Rekomendasi tanpa alasan", "Alasan ada tapi trade-off tak diakui", "Rekomendasi + trade-off + syarat verifikasi eksplisit"] },
        { criterion: "Kejujuran batas data", weight: 30, levels: ["Mengklaim lebih dari yang didukung data", "Menyebut sebagian batas", "Batas (estimasi vs observasi, jadwal, ketidakpastian) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat manipulasi yang disuntikkan ke deck — semuanya pola nyata di dunia evaluasi program:",
      "1) **Source swap** (klaim #2): angka country-reported (96%) disajikan sebagai WUENIC (aslinya 91%). Di dunia nyata: laporan negara hampir selalu lebih tinggi dari estimasi independen — memilih yang lebih tinggi tanpa menyebut sumbernya adalah cherry-picking yang dilegalkan oleh kolom 'sumber' yang tidak diverifikasi.",
      "2) **Fabricated point** (klaim #3): proyeksi 97% disajikan sebagai observasi 2024. Titik paling kanan pada kurva tren adalah titik paling mudah dipalsukan — belum ada data pembanding, dan pembaca mengira tren 'berlanjut'.",
      "3) **Schedule trap** (klaim #5): perbandingan MCV2 Malaysia vs Indonesia mengabaikan perbedaan jadwal usia rekomendasi. Benchmarking lintas negara tanpa harmonisasi definisi menghasilkan 'model' yang tidak bisa direplikasi.",
      "4) **Revision ghost** (klaim #7–8): dua versi estimasi U5MR 2020 tanpa catatan revisi; deck memakai yang lebih rendah. Estimasi model direvisi tiap putaran — normal. Yang tidak normal: memilih versi tanpa dokumentasi.",
      "Skor deteksimu (x/4) mengukur satu keterampilan spesifik: membaca kolom 'sumber' SEBELUM memercayai kolom 'angka'. Di pekerjaan nyata, tiap manipulasi yang lolos = jutaan dolar hibah dicairkan atas narasi yang tidak bisa dipertahankan — dan yang paling mahal bukan uangnya, melainkan program yang salah sasaran karena 'model keberhasilan' yang direplikasi ternyata artefak definisi.",
      "Dan ingat keputusan bercabangmu: kamu hanya bisa memverifikasi satu klaim. Auditor yang dewasa menuliskan DUA klaim yang tidak terverifikasi di memonya — karena dewan berhak tahu bahwa 'tidak ada temuan' bukan berarti 'tidak ada masalah', melainkan 'tidak diperiksa'.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: 'angkanya benar' = 'klaimnya benar'",
      type: "risk",
      body: "Hampir semua angka di deck ini 'benar' dalam arti ada di suatu sumber. Yang salah adalah CARA angka itu dipakai: sumber ditukar, definisi tidak sebanding, presisi dilebih-lebihkan. Audit evaluasi program jarang menemukan angka palsu — yang ditemukan adalah bingkai yang palsu.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 12 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Verifikasi sumber sebelum angka: WUENIC ≠ country-reported; estimasi model ≠ observasi; proyeksi ≠ data berjalan.",
      "Definisi menentukan keterbandingan: MCV2 'menurut usia rekomendasi lokal' tidak bisa dibandingkan mentah lintas negara.",
      "Interval ketidakpastian adalah bagian dari angka: U5MR 17,69 [14,6–21,8] — klaim 'turun 65,6%' benar arahnya, menipu presisinya.",
      "Rata-rata nasional menyembunyikan ekuitas: WQ1 26,02 vs WQ5 11,06 (2,35×) — keberhasilan yang tidak merata.",
      "Empat pola manipulasi deck: source swap, fabricated point, schedule trap, revision ghost.",
      "Data: WHO Global Health Observatory (diakses 2026-10-15), 12 negara, 2000–2024, 1.400 baris; atribusi WHO wajib.",
    ],
  },
];

(misiAuditImunisasi.steps as V2Step[]).push(...LANJUTAN_WHO);
