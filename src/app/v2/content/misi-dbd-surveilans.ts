import type { V2Mission } from "../lib/types";

// ── MISI DBD: Laporan Surveilans yang (Tidak) Jujur ───────────────────────
// Pilot A — Health Data Science. Dataset: OpenDengue v1.3 (CC BY-SA), slice
// Indonesia bulanan 2020–2023, 38 provinsi, 1.646 baris.
// File: public/misi/misi-dbd-surveilans/laporan_bulanan.csv (bersih) +
// laporan_bulanan_audit.csv (8 injeksi terdokumentasi). Metode: METODE.md.

const BASE = "/misi/misi-dbd-surveilans";

export const misiDbd: V2Mission = {
  slug: "misi-dbd-surveilans",
  track: "Health Data Science",
  module: "Misi",
  title: "Misi DBD: Laporan Surveilans yang (Tidak) Jujur",
  estMinutes: 120,
  role: "Epidemiolog / auditor data surveilans",
  client:
    "Kepala Bidang P2P Dinas Kesehatan — alokasi fogging & vaksin DBD tahun ini bergantung pada laporanmu",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tiga provinsi yang laporannya “terlalu rapi”",
      prose: [],
      tasks: [],
      briefing: {
        role: "Epidemiolog / auditor data surveilans di Dinas Kesehatan",
        client:
          "Kepala Bidang P2P (Pencegahan dan Pengendalian Penyakit). Setiap tahun, alokasi fogging, larvasida, dan vaksin DBD antar-kabupaten ditentukan dari laporan kasus bulanan. Tahun ini anggarannya turun 20% — salah alokasi berarti daerah yang benar-benar meledak tidak dapat bantuan.",
        story: [
          "Senin pagi, 09:40. Kepala Bidang P2P meletakkan map cokelat di mejamu — 1.646 baris laporan bulanan kasus DBD dari 38 provinsi, Januari 2020 sampai Desember 2023. “Saya butuh rekomendasi minggu depan: provinsi mana yang prioritas fogging, mana yang datanya perlu diaudit lapangan. Satu hal yang mengganjal saya,” katanya sambil menunjuk tiga baris yang distabilo, “angka tiga provinsi ini terlalu rapi. DBD itu penyakit musiman yang berantakan — laporan yang terlalu mulus justru mencurigakan.”",
          "Kamu tahu persis maksudnya. Data surveilans yang jujur itu berisik: ada keterlambatan lapor, ada kabupaten yang lupa mengirim, ada lonjakan yang ternyata cuma tumpukan laporan telat. Laporan yang “bersih sempurna” sering berarti seseorang merapikannya — atau lebih buruk, mengarangnya. Dan keputusan fogging senilai miliaran rupiah akan berdiri di atas angka-angka ini.",
          "Misi ini bukan latihan membersihkan data mainan. Datanya nyata — laporan DBD Indonesia dari OpenDengue — dan seseorang telah menyabotase salinan auditnya tanpa memberitahumu. Tugasmu: bangun baseline yang jujur, temukan sabotase itu, putuskan mana yang layak investigasi lapangan, dan tulis laporan yang berani berkata “data ini tidak bisa dipercaya” bila memang begitu.",
        ],
        objectives: [
          "Membangun baseline musiman DBD per provinsi dari data 2020–2023 dan mengidentifikasi bulan puncak nasional.",
          "Menemukan minimal 3 anomali data (duplikat, tanggal mustahil, lonjakan tak masuk akal, inkonsistensi nama unit) dengan bukti kuantitatif.",
          "Menulis laporan rekomendasi: provinsi prioritas fogging vs provinsi yang datanya wajib diaudit lapangan — lengkap dengan batas-batas datanya.",
        ],
        prereqSummary:
          "Insidens = jumlah kasus baru per populasi per periode — di misi ini kita memakai hitungan kasus mentah per provinsi per bulan karena data populasinya tidak tersedia (keterbatasan ini wajib kamu akui di laporan). Definisi kasus DBD mengikuti standar klinis+lab; yang penting di sini bukan diagnosisnya, melainkan pola pelaporannya: DBD di Indonesia punya musim (puncak awal tahun), dan penyimpangan tajam dari musim itu adalah sinyal — entah sinyal wabah, atau sinyal data bermasalah.",
        datasetNote:
          "Sumber: OpenDengue v1.3 (Clarke et al., Scientific Data 2024), lisensi CC BY-SA — atribusi: “Data: OpenDengue (Clarke et al. 2024), CC BY-SA”.\nSlice: Indonesia, level provinsi (Admin1), bulanan, 2020–2023 → 1.646 baris, 38 provinsi (termasuk 4 provinsi baru Papua sejak 2022).\nKejujuran: OpenDengue TIDAK memuat kadens mingguan untuk Indonesia — misi ini memakai laporan BULANAN (bukan mingguan).\nFile laporan_bulanan.csv = data bersih ternormalisasi. File laporan_bulanan_audit.csv = salinan yang diaudit — data ini SENGAJA dikotori (duplikat, tanggal tertukar, lonjakan mustahil, varian nama). Metode sampling & injeksi: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali medan sebelum menyentuh angka",
      prose: [
        "Dua file menunggumu di data room. `laporan_bulanan.csv` adalah versi bersih: 1.646 baris, kolom `provinsi, tahun, bulan, tanggal_mulai, tanggal_akhir, total_kasus, definisi_kasus`. Ini fondasimu membangun baseline — angka-angka di sini sudah dinormalisasi (51 varian nama provinsi mentah seperti “D.I YOGYA” dan “KALIMANTAN SELATA” sudah dipetakan ke 38 nama kanonis; baris ganda akibat varian nama sudah dijumlahkan).",
        "`laporan_bulanan_audit.csv` adalah versi yang dikirim unit pelapor — dan yang akan kamu audit. Isinya “sama”, tapi seseorang menyuntikkan 8 sabotase ke dalamnya tanpa pengumuman: baris duplikat, tanggal mulai/akhir yang tertukar, lonjakan yang mustahil dibanding baseline musiman, dan varian nama yang tidak dinormalisasi. Detail tiap sabotase ada di `METODE.md` — tapi membacanya sekarang sama dengan mengintip kunci jawaban. Jangan.",
        "Aturan main data room: (1) bangun baseline HANYA dari file bersih; (2) kecurigaan HANYA dari file audit; (3) setiap tuduhan anomali wajib punya bukti angka — “kelihatannya aneh” bukan bukti.",
      ],
      tasks: [
        { id: "t1", text: "Buka `laporan_bulanan.csv` dan catat: berapa baris, berapa provinsi unik" },
        { id: "t2", text: "Identifikasi kolom tanggal — format apa yang dipakai, dan apa yang dimaksud “periode” satu baris" },
      ],
      note: {
        title: "Miskonsepsi #1: data resmi = data benar",
        type: "pitfall",
        body: "“Kan dari dinas, pasti sudah dicek.” Kenyataannya: rantai pelaporan DBD itu panjang — puskesmas → dinkes kabupaten → dinkes provinsi → pusat. Tiap simpul bisa telat, salah ketik, atau “mempercantik” angka. Tugas auditor bukan memercayai stempel resmi, melainkan memverifikasi polanya.",
      },
      reference:
        "laporan_bulanan.csv (bersih, 1.646 baris) vs laporan_bulanan_audit.csv (8 sabotase). Baseline dari yang bersih; audit pada yang kotor.",
    },
    {
      id: "lab-eda",
      eyebrow: "Langkah 3 · Lab 1 — Baseline musiman",
      title: "Berapa “normal”-nya DBD tiap bulan?",
      prose: [
        "Sebelum menuduh ada yang aneh, kamu butuh definisi “normal”. DBD di Indonesia itu musiman — nyamuk Aedes berkembang biak di genangan musim hujan. Jadi langkah pertamamu: hitung median kasus per bulan kalender (nasional, 2020–2023) dari file BERSIH, lalu tentukan bulan puncaknya. Median — bukan rata-rata — karena median tidak goyah oleh satu bulan yang ekstrem.",
        "Lab ini memakai file bersih (`laporan_bulanan.csv`). Data dimuat langsung dari server dengan `open_url` — URL-nya path relatif ke situs ini, jadi tidak perlu token apa pun.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke `df`; hitung `n_baris` dan `n_provinsi` (unik)" },
        { id: "t2", text: "Hitung median `total_kasus` per `bulan` (nasional); simpan bulan puncaknya di `puncak_musim` (string 2 digit, mis. \"01\")" },
        { id: "t3", text: "Hitung total kasus Jawa Barat tahun 2022 → `total_jabar_2022`, dan print tiga angka itu" },
      ],
      expected:
        "n_baris=1646, n_provinsi=38, puncak_musim=01 (Januari, median 174 kasus), total_jabar_2022=36608",
      note: {
        title: "Miskonsepsi #2: rata-rata = representasi yang adil",
        type: "pitfall",
        body: "Satu provinsi melaporkan 8.264 kasus dalam sebulan (angka sabotase — kamu akan menemukannya nanti). Kalau pakai rata-rata, satu baris itu menggeser “normal” seluruh negeri. Median kebal terhadapnya. Dalam audit data, ukuran pusat yang robust bukan pilihan gaya — itu pilihan etika.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))`.",
        "Median per bulan: `df.groupby(\"bulan\")[\"total_kasus\"].median()` — lalu `.idxmax()` untuk bulan puncaknya.",
        "Filter Jawa Barat 2022: `(df[\"provinsi\"]==\"Jawa Barat\") & (df[\"tahun\"]==2022)` — hati-hati, kolom tahun bertipe integer di CSV ini.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-dbd-surveilans/laporan_bulanan.csv\"",
          "",
          "# TUGASMU: lengkapi 3 baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...        # banyak baris",
          "n_provinsi = ...     # banyak provinsi unik",
          "",
          "median_bulanan = ... # median total_kasus per bulan (nasional)",
          "puncak_musim = ...   # string 2 digit, mis. \"01\"",
          "",
          "jabar22 = ...        # filter: provinsi Jawa Barat & tahun 2022",
          "total_jabar_2022 = ...",
          "",
          "print(\"baris:\", n_baris, \"| provinsi:\", n_provinsi)",
          "print(\"puncak musim:\", puncak_musim)",
          "print(\"total Jabar 2022:\", total_jabar_2022)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-dbd-surveilans/laporan_bulanan.csv\"",
          "",
          "# TUGASMU: lengkapi 3 baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "n_provinsi = df[\"provinsi\"].nunique()",
          "",
          "median_bulanan = df.groupby(\"bulan\")[\"total_kasus\"].median()",
          "puncak_musim = str(median_bulanan.idxmax()).zfill(2)",
          "",
          "jabar22 = df[(df[\"provinsi\"] == \"Jawa Barat\") & (df[\"tahun\"] == 2022)]",
          "total_jabar_2022 = int(jabar22[\"total_kasus\"].sum())",
          "",
          "print(\"baris:\", n_baris, \"| provinsi:\", n_provinsi)",
          "print(\"puncak musim:\", puncak_musim)",
          "print(\"total Jabar 2022:\", total_jabar_2022)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 1646", name: "n_baris", value: 1646, msg: "File bersih punya tepat 1.646 baris (38 provinsi × 48 bulan, minus provinsi baru Papua)." },
          { kind: "equal", task: "t1", label: "`n_provinsi` = 38", name: "n_provinsi", value: 38, msg: "Ada 38 provinsi unik — termasuk 4 provinsi baru Papua (2022). Kalau dapat 36/40, cek varian nama." },
          { kind: "equal", task: "t2", label: "`puncak_musim` = \"01\"", name: "puncak_musim", value: "01", msg: "Median nasional tertinggi jatuh di Januari (174 kasus) — musim hujan." },
          { kind: "equal", task: "t3", label: "`total_jabar_2022` = 36608", name: "total_jabar_2022", value: 36608, tol: 1, msg: "Jumlahkan total_kasus untuk Jawa Barat tahun 2022." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Jejak duplikat",
      title: "Satu baris, dua kali lapor: siapa yang menggandakan?",
      prose: [
        "Baseline sudah di tangan. Sekarang senjata keduamu: SQL. Salah satu sabotase paling klasik di laporan berjenjang adalah baris duplikat — kabupaten mengirim dua kali, atau operator mengimpor file yang sama dua kali. Di tabel kecil ini (12 baris laporan 3 provinsi), ada baris yang muncul dua kali dengan SEMUA kolom identik. Temukan dengan `GROUP BY` + `HAVING COUNT(*) > 1`.",
        "Tabel `laporan(provinsi, tahun, bulan, total_kasus)`. Tulis query yang mengembalikan baris-baris duplikatnya.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query yang menemukan baris duplikat persis (semua kolom sama)" },
      ],
      expected: "2 baris: Jawa Timur 2022-03 (1017) dan Sumatera Utara 2021-07 (178)",
      sqlLab: {
        task: "Temukan baris duplikat persis: kelompokkan per (provinsi, tahun, bulan, total_kasus) dan saring yang muncul lebih dari sekali.",
        schema: "CREATE TABLE laporan (provinsi TEXT, tahun INTEGER, bulan TEXT, total_kasus INTEGER);",
        seedData: [
          "INSERT INTO laporan VALUES",
          "('Jawa Timur', 2022, '03', 1017),",
          "('Jawa Timur', 2022, '03', 1017),",
          "('Sumatera Utara', 2021, '07', 178),",
          "('Sumatera Utara', 2021, '07', 178),",
          "('Bali', 2023, '01', 965),",
          "('Jawa Barat', 2022, '11', 1766),",
          "('DKI Jakarta', 2023, '06', 359),",
          "('Kalimantan Timur', 2022, '09', 688),",
          "('Sulawesi Selatan', 2021, '02', 191),",
          "('DI Yogyakarta', 2021, '05', 80),",
          "('Kalimantan Selatan', 2022, '08', 116),",
          "('Aceh', 2022, '01', 210);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT provinsi, tahun, bulan, total_kasus\nFROM laporan\n",
        solution: [
          "SELECT provinsi, tahun, bulan, total_kasus, COUNT(*) AS n",
          "FROM laporan",
          "GROUP BY provinsi, tahun, bulan, total_kasus",
          "HAVING COUNT(*) > 1;",
        ].join("\n"),
        expectedColumns: ["provinsi", "tahun", "bulan", "total_kasus", "n"],
        expectedRows: [
          ["Jawa Timur", 2022, "03", 1017, 2],
          ["Sumatera Utara", 2021, "07", 178, 2],
        ],
      },
    },
  ],
};

export default misiDbd;

// ── lanjutan misiDbd: append langkah 5–12 ke array steps ────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_DBD: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Anggaran investigasi hanya cukup untuk 2 provinsi",
    prose: [
      "Kepala Bidang menelepon: tim investigasi lapangan hanya bisa dikirim ke 2 provinsi bulan ini. Kamu sudah punya tiga kandidat kuat, masing-masing dengan alasan berbeda. Tidak ada pilihan yang “aman” — tiap pilihan berarti satu anomali tidak terinvestigasi, dan pilihanmu mengubah bukti apa yang kamu lihat di langkah berikut.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Dua provinsi mana yang kamu kirim tim investigasi lapangan? (Keputusan final — seperti rekomendasi yang sudah dikirim ke klien.)",
      options: [
        {
          id: "opt-lonjakan",
          label: "DKI Jakarta + Kalimantan Timur — kejar lonjakan terbesar",
          rationale:
            "Dua lonjakan paling ekstrem di file audit (4.328 dan 8.264 kasus sebulan). Kalau ini wabah sungguhan, tiap minggu tunda = ratusan kasus baru.",
          nextStepId: "temuan-lonjakan",
          consequenceNote:
            "Tim menemukan lonjakan itu TIDAK didukung data rumah sakit — kemungkinan besar angka yang digelembungkan, bukan wabah. Sementara itu, masalah duplikat di Jawa Timur/Sumut tidak terinvestigasi dan tetap menggelembungkan alokasi tahun depan.",
        },
        {
          id: "opt-duplikat",
          label: "Jawa Timur + Sumatera Utara — bereskan duplikat dulu",
          rationale:
            "Duplikat yang kamu temukan di lab SQL berarti total nasional digelembungkan. Membersihkan ini memperbaiki SEMUA angka alokasi.",
          nextStepId: "temuan-duplikat",
          consequenceNote:
            "Duplikat terkonfirmasi sebagai impor ganda — total nasional dikoreksi turun. Tapi lonjakan “mustahil” di DKI/Kaltim ternyata juga tidak terverifikasi, dan kamu kehabisan anggaran untuk memeriksanya.",
        },
        {
          id: "opt-kualitas",
          label: "DI Yogyakarta + Kalimantan Selatan — audit kualitas data",
          rationale:
            "Varian nama (“D.I YOGYA”, “KALIMANTAN SELATA”) menandakan masalah sistemik di simpul pelaporan. Kalau sistemnya bocor, semua angka dari sana patut dicurigai.",
          nextStepId: "temuan-kualitas",
          consequenceNote:
            "Ternyata varian nama berasal dari dua sistem pelaporan lama yang belum dimigrasi — masalah nyata tapi administratif. Sementara anomali angka yang lebih berdampak (duplikat & lonjakan) tidak tersentuh.",
        },
      ],
    },
  },
  {
    id: "temuan-lonjakan",
      goto: "audit",
    eyebrow: "Langkah 6 · Temuan lapangan",
    title: "Hasil investigasi: lonjakan DKI Jakarta & Kalimantan Timur",
    prose: [
      "Tim lapangan kembali dengan kabar yang mengubah segalanya. Di DKI Jakarta, RSUD rujukan melaporkan keterisian bangsal DBD Juni 2023 BIASA SAJA — tidak ada antrean, tidak ada permintaan fogging luar biasa. Angka 4.328 kasus sebulan itu tidak punya jejak di layanan kesehatan. Di Kalimantan Timur, polanya sama: 8.264 kasus September 2022 tidak tercermin di data kunjungan IGD.",
      "Kesimpulan sementara tim: kedua lonjakan ini hampir pasti artefak pelaporan — entah salah input (kelebihan digit), atau tumpukan laporan telat yang dibukukan sekaligus tanpa catatan. Yang pasti: ini BUKAN wabah yang butuh fogging darurat. Mengirim fogging ke sana berarti membakar anggaran di tempat yang salah.",
      "Tapi ada harga yang kamu bayar: duplikat di Jawa Timur dan Sumatera Utara tidak terinvestigasi. Total kasus nasional tahun 2022–2023 tetap menggelembung, dan alokasi tahun depan akan dihitung dari angka yang kotor.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: tidak ada opsi tanpa biaya",
      body: "Kamu memilih menyelamatkan anggaran fogging dari pemborosan — benar. Tapi tiap keputusan audit adalah alokasi perhatian yang terbatas. Auditor yang baik bukan yang tidak pernah salah pilih, melainkan yang mencatat APA yang tidak diperiksa dan KENAPA — agar bisa dilanjutkan berikutnya. Tulis itu di deliverable-mu.",
    },
  },
  {
    id: "temuan-duplikat",
      goto: "audit",
    eyebrow: "Langkah 6 · Temuan lapangan",
    title: "Hasil investigasi: duplikat Jawa Timur & Sumatera Utara",
    prose: [
      "Tim IT dinkes menemukan akar masalahnya dalam dua hari: file impor laporan triwulanan diunggah dua kali oleh operator berbeda — tanpa constraint unik di database. Jawa Timur Maret 2022 dan Sumatera Utara Juli 2021 masing-masing tercatat ganda. Total nasional 2021–2022 resmi dikoreksi TURUN, dan constraint unik ditambahkan ke pipeline impor.",
      "Ini kemenangan sistemik: bukan cuma dua provinsi yang diperbaiki, tapi seluruh angka nasional ke depan. Duplikat adalah sabotase yang “membosankan” — tidak dramatis seperti lonjakan — tapi dampaknya paling luas karena menggelembungkan SEMUA perhitungan alokasi.",
      "Harga yang kamu bayar: lonjakan ekstrem di DKI Jakarta (4.328) dan Kalimantan Timur (8.264) tidak terinvestigasi. Kalau salah satunya wabah sungguhan yang terlewat, biayanya nyawa — bukan cuma anggaran.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: perbaiki sistem, bukan cuma angka",
      body: "Kamu memilih akar masalah dibanding gejala — insting auditor yang matang. Tapi ingat: memilih berarti mengorbankan. Di deliverable-mu, nyatakan eksplisit anomali mana yang BELUM terverifikasi dan butuh investigasi susulan.",
    },
  },
  {
    id: "temuan-kualitas",
      goto: "audit",
    eyebrow: "Langkah 6 · Temuan lapangan",
    title: "Hasil investigasi: DI Yogyakarta & Kalimantan Selatan",
    prose: [
      "Tim menemukan sesuatu yang tidak diduga: “D.I YOGYA” dan “KALIMANTAN SELATA” bukan ulah sabotase, melainkan fosil dari dua sistem pelaporan lama yang belum dimigrasi penuh. Operator di dua provinsi itu masih mengisi template Excel 2019 yang kodenya berbeda — dan tidak ada validasi nama di pintu masuk database.",
      "Temuan ini penting secara sistemik (validasi input ditambahkan), tapi jujur saja: dampak anggarannya kecil. Varian nama tidak mengubah total kasus — hanya memecah satu provinsi jadi dua baris. Sementara itu, anomali yang benar-benar menggerakkan uang — duplikat dan lonjakan mustahil — tidak tersentuh karena anggaran investigasi habis.",
      "Ini jebakan klasik auditor: terpikat pada anomali yang paling “menarik” secara teknis, padahal yang paling berdampak secara keputusan adalah yang paling membosankan.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: dampak > keunikan",
      body: "Varian nama itu temuan yang cerdas — tapi audit yang baik menimbang DAMPAK keputusan, bukan kecerdasan temuan. Di deliverable-mu, latih dirimu menulis: “temuan ini penting, TAPI prioritas anggaran tetap pada X karena…”",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 20 baris: temukan 4 sabotase yang disuntikkan",
    prose: [
      "Sekarang misi auditnya. Di bawah ini 20 baris dari `laporan_bulanan_audit.csv` — dossier yang diklaim “sudah terverifikasi Dinkes”. Seseorang menyuntikkan 4 sabotase ke dalamnya tanpa pengumuman. Tandai baris yang janggal, lalu buka debrief.",
      "Senjatamu: baseline musiman dari Lab 1 (puncak Januari, median 174), teknik duplikat dari Lab 2, dan akal sehat tentang tanggal (tanggal_mulai harus < tanggal_akhir) dan nama resmi provinsi.",
    ],
    tasks: [],
    auditDossier: {
      version: "dbd-pilot-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim berisi 20 baris laporan bulanan yang sudah terverifikasi Dinkes (cuplikan laporan_bulanan_audit.csv).",
      columns: ["Provinsi", "Periode", "Total kasus", "Definisi kasus"],
      rows: [
        { rowId: 1, cells: { "Provinsi": "Jawa Barat", "Periode": "2022-01", "Total kasus": "3.104", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L22-01-JB-001" }] },
        { rowId: 2, cells: { "Provinsi": "Jawa Tengah", "Periode": "2022-06", "Total kasus": "812", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L22-06-JT-001" }] },
        { rowId: 3, cells: { "Provinsi": "Bali", "Periode": "2022-12", "Total kasus": "388", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L22-12-BL-001" }] },
        { rowId: 4, cells: { "Provinsi": "Aceh", "Periode": "2022-01", "Total kasus": "210", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L22-01-AC-001" }] },
        { rowId: 5, cells: { "Provinsi": "Riau", "Periode": "2021-03", "Total kasus": "445", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L21-03-RI-001" }] },
        { rowId: 6, cells: { "Provinsi": "Papua", "Periode": "2023-02", "Total kasus": "156", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L23-02-PA-001" }] },
        { rowId: 7, cells: { "Provinsi": "Nusa Tenggara Timur", "Periode": "2021-01", "Total kasus": "502", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L21-01-NT-001" }] },
        { rowId: 8, cells: { "Provinsi": "Kalimantan Barat", "Periode": "2023-04", "Total kasus": "233", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L23-04-KB-001" }] },
        // ── I1: duplikat terselubung (3 pasang, ID laporan identik) ──
        { rowId: 9, cells: { "Provinsi": "Jawa Timur", "Periode": "2022-03", "Total kasus": "1.017", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L22-03-JI-001" }] },
        { rowId: 10, cells: { "Provinsi": "Jawa Timur", "Periode": "2022-03", "Total kasus": "1.017", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L22-03-JI-001" }] },
        { rowId: 11, cells: { "Provinsi": "Sumatera Utara", "Periode": "2021-07", "Total kasus": "178", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L21-07-SU-001" }] },
        { rowId: 12, cells: { "Provinsi": "Sumatera Utara", "Periode": "2021-07", "Total kasus": "178", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L21-07-SU-001" }] },
        { rowId: 13, cells: { "Provinsi": "Bali", "Periode": "2023-01", "Total kasus": "965", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L23-01-BL-001" }] },
        { rowId: 14, cells: { "Provinsi": "Bali", "Periode": "2023-01", "Total kasus": "965", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "ID laporan", value: "L23-01-BL-001" }] },
        // ── I2: tanggal mulai/akhir tertukar ──
        { rowId: 15, cells: { "Provinsi": "Jawa Barat", "Periode": "2022-11*", "Total kasus": "1.766", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "Rentang tanggal", value: "2022-11-30 s.d. 2022-11-01" }] },
        { rowId: 16, cells: { "Provinsi": "Sulawesi Selatan", "Periode": "2021-02*", "Total kasus": "191", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "Rentang tanggal", value: "2021-02-28 s.d. 2021-02-01" }] },
        // ── I3: lonjakan mustahil vs baseline ──
        { rowId: 17, cells: { "Provinsi": "DKI Jakarta", "Periode": "2023-06", "Total kasus": "4.328", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "Konsisten baseline", value: "Ya — sesuai musim" }] },
        { rowId: 18, cells: { "Provinsi": "Kalimantan Timur", "Periode": "2022-09", "Total kasus": "8.264", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "Konsisten baseline", value: "Ya — sesuai musim" }] },
        // ── I4: varian nama tak dinormalisasi ──
        { rowId: 19, cells: { "Provinsi": "D.I YOGYA", "Periode": "2021-05", "Total kasus": "80", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "Nama unit resmi", value: "Ya" }] },
        { rowId: 20, cells: { "Provinsi": "KALIMANTAN SELATA", "Periode": "2022-08", "Total kasus": "116", "Definisi kasus": "Total" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi Dinkes" }, { label: "Nama unit resmi", value: "Ya" }] },
      ],
      injections: [
        { key: "duplikat", rowIds: [9, 10, 11, 12, 13, 14], title: "Baris duplikat terselubung", clue: "Tiga pasang baris identik persis — termasuk ID laporannya. Di file nyata, ini hasil impor ganda tanpa constraint unik.", danger: "Total nasional menggelembung; alokasi fogging dihitung dari angka yang dobel. Di perbankan, pola yang sama menggelembungkan NPL coverage." },
        { key: "tanggal-tertukar", rowIds: [15, 16], title: "Tanggal mulai/akhir tertukar", clue: "Rentang “2022-11-30 s.d. 2022-11-01” — tanggal mulai LEBIH BESAR dari tanggal akhir. Validasi rentang tanggal yang hilang di pintu masuk.", danger: "Periode pelaporan jadi tidak terdefinisi; agregasi kuartalan/tahunan salah tanpa ada yang sadar." },
        { key: "lonjakan-mustahil", rowIds: [17, 18], title: "Lonjakan mustahil vs baseline musiman", clue: "4.328 kasus sebulan di DKI (total 2022-nya saja 8.138) dan 8.264 di Kaltim — puluhan kali median bulanan nasional (174). Klaim “sesuai musim” di dossier adalah bohong.", danger: "Fogging darurat + anggaran darurat dikirim ke “wabah” yang tidak ada; daerah yang benar-benar meledak tidak dapat bantuan." },
        { key: "varian-nama", rowIds: [19, 20], title: "Varian nama unit tak dinormalisasi", clue: "“D.I YOGYA” dan “KALIMANTAN SELATA” (typo) bukan nama resmi 38 provinsi. Satu provinsi terpecah jadi dua baris — agregasi per provinsi salah.", danger: "Unit dengan varian nama lolos dari semua filter “per provinsi”; masalah sistemik tak terlihat di dashboard." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Laporan rekomendasi untuk Kepala Bidang",
    prose: [
      "Semua bukti di tangan. Sekarang tulis seperti profesional: laporan rekomendasi satu halaman untuk Kepala Bidang P2P. Ini artefak portofoliomu — tulis seolah akan dibaca pengambil keputusan sungguhan.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): apa temuan terpentingmu?",
        "Rekomendasi alokasi: provinsi mana prioritas fogging, mana yang datanya wajib diaudit lapangan — dan KENAPA (rujuk bukti angka).",
        "Temuan kualitas data: sabotase/anomali apa yang kamu temukan, dengan bukti per baris.",
        "Keputusan yang TIDAK kamu ambil: anomali mana yang belum terinvestigasi, dan apa risikonya.",
        "Batas data (kejujuran): apa yang TIDAK bisa disimpulkan dari data ini (mis. tanpa data populasi → tanpa insidens; tanpa kadens mingguan → tanpa deteksi KLB cepat).",
      ],
      rubric: [
        { criterion: "Deteksi anomali", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa bukti", "Semua jenis sabotase disebut dengan bukti angka"] },
        { criterion: "Kebenaran analisis", weight: 25, levels: ["Baseline salah/tidak ada", "Baseline ada tapi tak dipakai menilai", "Baseline musiman dipakai menilai kewajaran angka"] },
        { criterion: "Kualitas keputusan", weight: 20, levels: ["Pilihan tanpa alasan", "Alasan ada tapi biaya peluang tak diakui", "Alasan + biaya peluang + rencana susulan eksplisit"] },
        { criterion: "Kejujuran batas data", weight: 30, levels: ["Mengklaim lebih dari yang didukung data", "Menyebut sebagian batas", "Batas (populasi, kadens, kausalitas) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase yang disuntikkan ke dossier — semuanya berasal dari pola nyata di rantai pelaporan:",
      "1) **Duplikat terselubung** (baris 9–14): tiga pasang baris identik termasuk ID laporan. Di dunia nyata: impor ganda tanpa constraint unik. Obatnya murah — `UNIQUE(provinsi, tahun, bulan)` di database — tapi mahalnya adalah tidak ada yang memeriksa.",
      "2) **Tanggal tertukar** (baris 15–16): rentang “30 Nov s.d. 1 Nov”. Validasi `tanggal_mulai < tanggal_akhir` di pintu masuk akan menangkapnya dalam sedetik. Tidak ada validasi = tidak ada yang tahu agregasi kuartalanmu salah.",
      "3) **Lonjakan mustahil** (baris 17–18): 4.328 dan 8.264 kasus sebulan vs median nasional 174. Klaim dossier “sesuai musim” adalah kebohongan yang hanya bisa dibantah kalau kamu punya baseline. Inilah kenapa Lab 1 ada SEBELUM audit: tanpa baseline, “4.328” hanyalah angka.",
      "4) **Varian nama** (baris 19–20): “D.I YOGYA” dan “KALIMANTAN SELATA”. Di file bersih misi ini, 51 varian mentah dipetakan ke 38 provinsi — pekerjaan normalisasi yang membosankan dan tidak pernah dipuji siapa pun, padahal tanpanya semua agregasi per provinsi salah.",
      "Skor deteksimu (x/4) bukan nilai ujian — itu cerminan sistem verifikasi yang kamu bawa. Di pekerjaan nyata, tiap sabotase yang lolos = keputusan anggaran berbasis angka palsu. Dan ingat keputusan bercabangmu tadi: tidak ada pilihan yang sempurna. Auditor yang dewasa menuliskan apa yang TIDAK diperiksa — karena itulah satu-satunya cara memastikan itu diperiksa berikutnya.",
      "Bahaya nyata terakhir: fogging dan vaksin yang salah sasaran bukan cuma pemborosan. Di musim DBD, tiap minggu keterlambatan respons di daerah yang benar-benar meledak berarti kasus yang sebenarnya bisa dicegah. Data yang kotor membunuh secara tidak langsung — melalui keputusan yang terlihat rasional di atas angka yang salah.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: audit selesai saat laporan dikirim",
      type: "risk",
      body: "Audit selesai saat temuan DIPERBAIKI dan diverifikasi perbaikannya. Laporanmu yang merekomendasikan constraint unik itu baru bernilai kalau minggu depan kamu cek: apakah constraint-nya sudah dipasang? Kalau tidak, kamu baru menulis fiksi.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Baseline dulu, tuduhan kemudian: median bulanan nasional (puncak Januari, 174 kasus) adalah jangkar yang membuat “4.328 kasus sebulan” terbukti mustahil.",
      "Empat pola sabotase data: duplikat terselubung (tangkap dengan GROUP BY + HAVING), tanggal mustahil (validasi rentang di pintu masuk), lonjakan vs baseline (bandingkan dengan median, bukan firasat), varian nama (normalisasi + constraint).",
      "Keputusan audit selalu punya biaya peluang: pilih 2 provinsi berarti mengorbankan yang lain — catat apa yang tidak diperiksa.",
      "Deliverable yang jujur menyatakan batas data: tanpa populasi → tanpa insidens; tanpa kadens mingguan → tanpa deteksi KLB cepat; anomali statistik ≠ bukti kausal.",
      "Data: OpenDengue v1.3 (CC BY-SA), Indonesia bulanan 2020–2023, 38 provinsi, 1.646 baris.",
    ],
  },
];

(misiDbd.steps as V2Step[]).push(...LANJUTAN_DBD);
