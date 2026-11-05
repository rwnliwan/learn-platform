import type { V2Mission } from "../lib/types";

// ── MISI KATALOG: Siapa Pemilik Kolom Ini? ────────────────────────────
// M2 grup DATA-ENGINEERING, track Data Management — Misi A (core).
// Dataset: 100% SINTETIS (generator build-misi/gen_misi_katalog.py,
// seed 42, dibekukan 2026-10-15). File: public/misi/misi-katalog-data-hilang/
// (skema_kolom.csv, lineage.csv, audit_log.csv + METODE.md).

const BASE = "/misi/misi-katalog-data-hilang";

export const misiKatalogData: V2Mission = {
  slug: "misi-katalog-data-hilang",
  track: "Data Management",
  module: "Misi",
  title: "Misi Katalog: Siapa Pemilik Kolom Ini?",
  estMinutes: 120,
  role: "Data steward",
  client:
    "Kepala Kepatuhan — regulator mengirim surat resmi menanyakan kepemilikan dan penggunaan kolom skor_risiko_internal; jawaban terdokumentasi ditunggu dalam 30 hari",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Satu surat, nol orang bisa menjawab",
      prose: [],
      tasks: [
        { id: "t1", text: "Baca cerita misi sampai selesai" },
        { id: "t2", text: "Catat 3 tujuan terukur misimu" },
      ],
      briefing: {
        role: "Data steward di PT Bank Cakrawala Digital (fiktif) — penjaga metadata",
        client:
          "Kepala Kepatuhan. Pagi ini sebuah surat resmi tiba dari regulator. Isinya satu pertanyaan sederhana yang mematikan: “Kolom skor_risiko_internal dipakai untuk keputusan apa, dan siapa pemiliknya?” Tiga orang ditanya — tim risiko, tim data, tim keuangan — dan ketiganya menjawab versi yang berbeda. Jawaban terdokumentasi ditunggu dalam 30 hari.",
        story: [
          "Senin, 08:12. Kepala Kepatuhan meletakkan surat itu di mejamu tanpa banyak bicara — ia tidak perlu. Kamu sudah tahu isinya sebelum membaca: kolom skor_risiko_internal, kolom yang dipakai Laporan Kecukupan Modal setiap kuartal, kolom yang menentukan berapa besar modal yang harus dicadangkan bank. Dan tidak ada satu orang pun yang tercatat sebagai pemiliknya.",
          "Tiga tahun. Selama tiga tahun pipeline data bank ini berjalan tanpa katalog — tanpa daftar resmi kolom apa yang ada, siapa pemiliknya, dan untuk apa dipakai. Setiap tim menyimpan pengetahuannya di kepala masing-masing. Orang keluar, pengetahuan ikut keluar. Yang tersisa: 6 tabel, puluhan kolom, dan keyakinan kolektif bahwa “nanti juga ada yang tahu”.",
          "Surat regulator itu adalah tagihannya. Misimu: bangun katalog data pertama bank ini dari skema mentah — data dictionary, klasifikasi sensitivitas, peta lineage — temukan anomali yang disembunyikan kekacauan, dan tulis jawaban yang bisa dipertahankan di depan regulator. Semua data di misi ini 100% sintetis, tapi masalahnya nyata: inilah yang terjadi di ratusan perusahaan.",
        ],
        objectives: [
          "Membangun data dictionary dari skema mentah dan mengklasifikasikan sensitivitas setiap kolom (Lab 1 — Python).",
          "Memetakan lineage kolom duplikat dan menemukan kolom bermasalah: tanpa pemilik, berstatus deprecated, dan beda definisi (Lab 2 — SQL).",
          "Menemukan minimal 3 anomali di “Katalog Sementara v0.1” dan menulis paket katalog + memo jawaban regulator yang bisa dipertahankan.",
        ],
        prereqSummary:
          "Data dictionary = daftar semua kolom beserta definisi, pemilik, dan klasifikasinya — “KTP”-nya data. Lineage = peta asal-usul kolom: kolom A berasal dari kolom B lewat transformasi apa. Klasifikasi sensitivitas = label seberapa rahasia sebuah kolom (rahasia/terbatas/internal/publik) yang menentukan siapa boleh mengaksesnya. Tiga konsep ini cukup untuk misi ini; sisanya kamu bangun sendiri di lab.",
        datasetNote:
          "STATUS DATA: 100% SINTETIS — tidak ada data nyata, tidak ada PII nyata. “PT Bank Cakrawala Digital”, semua tim, kolom, dan insiden adalah fiktif.\nIsi: skema_kolom.csv (37 kolom × 6 tabel), lineage.csv (12 relasi), audit_log.csv (8 baris kronologi fiktif).\nGenerator: build-misi/gen_misi_katalog.py, seed 42, dibekukan 2026-10-15. Metode: METODE.md di folder yang sama.\nKejujuran: katalog bank nyata berisi ribuan kolom — ini miniaturnya; prinsipnya sama, skalanya beda.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file kekacauan tiga tahun",
      prose: [
        "Tiga file menunggumu — inilah seluruh “dokumentasi” yang dimiliki bank setelah tiga tahun. `skema_kolom.csv` adalah hasil tarikan otomatis dari database: 37 kolom dari 6 tabel, dengan kolom `pemilik` yang sering kosong, `deskripsi` yang kadang tidak diisi, dan satu kolom berstatus `deprecated`.",
        "`lineage.csv` adalah peta aliran kolom: 12 relasi `kolom_asal → kolom_tujuan` beserta transformasinya. Di sinilah duplikat-duplikat bersembunyi — kolom yang sama dengan nama berbeda, dibuat oleh tim yang berbeda, tanpa saling tahu.",
        "`audit_log.csv` adalah kronologi 8 kejadian dari 2023 sampai surat regulator tiba. Baca baik-baik: log ini ditulis mesin dan manusia, dan keduanya tidak selalu sepakat.",
        "Aturan main: (1) katalog dibangun dari file mentah, bukan dari ingatan siapa pun; (2) kolom tanpa pemilik = temuan, bukan “nanti diisi”; (3) label `deprecated` tidak dipercaya sebelum diverifikasi di lineage.",
      ],
      tasks: [
        { id: "t1", text: "Buka `skema_kolom.csv`: hitung kolom dengan `pemilik` kosong" },
        { id: "t2", text: "Buka `lineage.csv`: catat relasi berlabel `duplikat`" },
        { id: "t3", text: "Buka `audit_log.csv`: tandai kejadian paling mencurigakan" },
      ],
      note: {
        title: "Miskonsepsi #1: katalog = dokumen yang ditulis sekali",
        type: "pitfall",
        body: "“Kita buat katalognya sekali, selesai.” SALAH — dan inilah kenapa bank ini tidak punya katalog: tiga tahun lalu seseorang mungkin pernah membuatnya di spreadsheet, lalu tidak ada yang memelihara. Katalog yang tidak diperbarui tiap ada perubahan skema akan basi dalam hitungan bulan, dan katalog basi lebih berbahaya daripada tidak ada katalog — karena orang memercayainya. Katalog adalah proses hidup, bukan dokumen mati.",
      },
      reference:
        "skema_kolom.csv (37 kolom mentah) + lineage.csv (12 relasi) + audit_log.csv (8 kejadian). Semua 100% sintetis.",
    },
    {
      id: "lab-katalog",
      eyebrow: "Langkah 3 · Lab 1 — Bangun katalog",
      title: "Dari 37 baris mentah menjadi data dictionary",
      prose: [
        "Sekarang kerjakan pekerjaan data steward yang sebenarnya: ubah 37 baris skema mentah menjadi data dictionary berklasifikasi. Kamu akan menulis fungsi `klasifikasi` berbasis pola nama kolom — heuristik standar industri untuk pemindaian awal: `rahasia` untuk identitas (nik, nama, alamat…), `terbatas` untuk angka sensitif (saldo, skor…), `internal` untuk operasional, `publik` untuk sisanya.",
        "Lalu jawab pertanyaan regulator secara kuantitatif: berapa kolom tanpa pemilik? Berapa di antaranya dipakai laporan kritis? Adakah kolom `deprecated` yang masih dipakai produksi? Dan berapa pasang kolom duplikat yang bersembunyi di lineage?",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua CSV; hitung `n_kolom`" },
        { id: "t2", text: "Lengkapi fungsi `klasifikasi`; hitung `n_rahasia` dan `n_terbatas`" },
        { id: "t3", text: "Temukan kolom tanpa pemilik (`n_tanpa_pemilik`) dan yang kritis (`n_kritis_tanpa_pemilik`)" },
        { id: "t4", text: "Temukan kolom deprecated yang masih dipakai laporan kritis (`n_deprecated_bermasalah`)" },
        { id: "t5", text: "Hitung pasangan kolom duplikat dari lineage (`n_pasang_duplikat`)" },
      ],
      expected:
        "n_kolom=37, rahasia=9, terbatas=6, tanpa_pemilik=8 (2 di antaranya dipakai laporan kritis), deprecated_bermasalah=1, pasang_duplikat=5",
      formula: String.raw`C = \frac{D}{T} \times 100\%`,
      formulaNote:
        "C = cakupan katalog (%), D = kolom yang terdokumentasi lengkap (punya deskripsi + pemilik + klasifikasi), T = total kolom. Di misi ini T = 37 — dan misimu adalah menaikkan D setinggi mungkin sebelum surat regulator dijawab.",
      note: {
        title: "Miskonsepsi #2: pola nama selalu jujur",
        type: "pitfall",
        body: "Perhatikan: aturanmu akan mengklasifikasikan risiko.tgl_skor sebagai “terbatas” — padahal itu cuma tanggal, yang kebetulan mengandung kata “skor”. Inilah false positive heuristik pola nama: murah, cepat, dan kadang salah. Di dunia nyata, hasil pemindaian otomatis SELALU lewat review manusia sebelum menjadi label resmi. Pelajaran: otomasi mempercepat, verifikasi yang menentukan kebenaran.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — sel kosong terbaca sebagai NaN, tangani dengan `fillna(\"\")`.",
        "Fungsi klasifikasi: cek pola `rahasia` dulu, lalu `terbatas`, lalu `internal` — urutan penting karena satu nama bisa cocok di beberapa pola.",
        "Kolom tanpa pemilik: `df[df[\"pemilik\"].fillna(\"\").str.strip() == \"\"]` — lalu saring lagi yang `laporan_kritis == \"ya\"`.",
        "Pasangan duplikat: saring `lin` pada `relasi == \"duplikat\"` — jangan hitung manual dari ingatan.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-katalog-data-hilang/skema_kolom.csv\"",
          "URL_LIN = \"/misi/misi-katalog-data-hilang/lineage.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "lin = pd.read_csv(open_url(URL_LIN))",
          "",
          "n_kolom = ...",
          "",
          "def klasifikasi(nama):",
          "    n = nama.lower()",
          "    if ...:",
          "        return \"rahasia\"",
          "    if ...:",
          "        return \"terbatas\"",
          "    if ...:",
          "        return \"internal\"",
          "    return \"publik\"",
          "",
          "df[\"klasifikasi\"] = ...",
          "",
          "n_rahasia = ...",
          "n_terbatas = ...",
          "",
          "tanpa_pemilik = ...",
          "n_tanpa_pemilik = ...",
          "",
          "kritis_tanpa_pemilik = ...",
          "n_kritis_tanpa_pemilik = ...",
          "",
          "deprecated_bermasalah = ...",
          "n_deprecated_bermasalah = ...",
          "",
          "n_pasang_duplikat = ...",
          "",
          "print(\"total kolom:\", n_kolom)",
          "print(\"rahasia:\", n_rahasia, \"| terbatas:\", n_terbatas)",
          "print(\"tanpa pemilik:\", n_tanpa_pemilik, \"| kritis tanpa pemilik:\", n_kritis_tanpa_pemilik)",
          "print(\"deprecated bermasalah:\", n_deprecated_bermasalah, \"| pasang duplikat:\", n_pasang_duplikat)",
        ].join("\n"),
        lockLines: 10,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-katalog-data-hilang/skema_kolom.csv\"",
          "URL_LIN = \"/misi/misi-katalog-data-hilang/lineage.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "lin = pd.read_csv(open_url(URL_LIN))",
          "",
          "n_kolom = len(df)",
          "",
          "def klasifikasi(nama):",
          "    n = nama.lower()",
          "    if any(k in n for k in [\"nik\", \"nama\", \"full_name\", \"alamat\", \"lahir\", \"no_hp\", \"no_rekening\", \"acct_no\"]):",
          "        return \"rahasia\"",
          "    if any(k in n for k in [\"saldo\", \"nominal\", \"jumlah\", \"skor\", \"pd_\"]):",
          "        return \"terbatas\"",
          "    if any(k in n for k in [\"id\", \"kode\", \"code\", \"status\", \"segmen\", \"segment\", \"channel\", \"jenis\", \"currency\", \"tgl\", \"date\"]):",
          "        return \"internal\"",
          "    return \"publik\"",
          "",
          "df[\"klasifikasi\"] = df[\"kolom\"].map(klasifikasi)",
          "",
          "n_rahasia = int((df[\"klasifikasi\"] == \"rahasia\").sum())",
          "n_terbatas = int((df[\"klasifikasi\"] == \"terbatas\").sum())",
          "",
          "tanpa_pemilik = df[df[\"pemilik\"].fillna(\"\").str.strip() == \"\"]",
          "n_tanpa_pemilik = len(tanpa_pemilik)",
          "",
          "kritis_tanpa_pemilik = tanpa_pemilik[tanpa_pemilik[\"laporan_kritis\"] == \"ya\"]",
          "n_kritis_tanpa_pemilik = len(kritis_tanpa_pemilik)",
          "",
          "deprecated_bermasalah = df[(df[\"status\"] == \"deprecated\") & (df[\"laporan_kritis\"] == \"ya\")]",
          "n_deprecated_bermasalah = len(deprecated_bermasalah)",
          "",
          "n_pasang_duplikat = int((lin[\"relasi\"] == \"duplikat\").sum())",
          "",
          "print(\"total kolom:\", n_kolom)",
          "print(\"rahasia:\", n_rahasia, \"| terbatas:\", n_terbatas)",
          "print(\"tanpa pemilik:\", n_tanpa_pemilik, \"| kritis tanpa pemilik:\", n_kritis_tanpa_pemilik)",
          "print(\"deprecated bermasalah:\", n_deprecated_bermasalah, \"| pasang duplikat:\", n_pasang_duplikat)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari skema_kolom.csv." },
          { kind: "equal", task: "t1", label: "`n_kolom` = 37", name: "n_kolom", value: 37, msg: "File punya 37 kolom dari 6 tabel." },
          { kind: "equal", task: "t2", label: "`n_rahasia` = 9", name: "n_rahasia", value: 9, msg: "Cek urutan pola: rahasia dulu, lalu terbatas, lalu internal." },
          { kind: "equal", task: "t2", label: "`n_terbatas` = 6", name: "n_terbatas", value: 6, msg: "Termasuk tgl_skor — false positive heuristik yang disengaja." },
          { kind: "equal", task: "t3", label: "`n_tanpa_pemilik` = 8", name: "n_tanpa_pemilik", value: 8, msg: "Pemilik kosong = NaN; tangani dengan fillna(\"\") dulu." },
          { kind: "equal", task: "t3", label: "`n_kritis_tanpa_pemilik` = 2", name: "n_kritis_tanpa_pemilik", value: 2, msg: "Saring tanpa_pemilik pada laporan_kritis == \"ya\"." },
          { kind: "equal", task: "t4", label: "`n_deprecated_bermasalah` = 1", name: "n_deprecated_bermasalah", value: 1, msg: "status == \"deprecated\" DAN laporan_kritis == \"ya\"." },
          { kind: "equal", task: "t5", label: "`n_pasang_duplikat` = 5", name: "n_pasang_duplikat", value: 5, msg: "Hitung dari lineage: relasi == \"duplikat\"." },
        ],
      },
    },
  ],
};

export default misiKatalogData;

// ── lanjutan misiKatalogData: langkah 4–13 ─────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_KATALOG: V2Step[] = [
  {
    id: "lab-sql",
    eyebrow: "Langkah 4 · Lab 2 — Peta duplikat",
    title: "Lima pasang kembar yang tidak saling kenal",
    prose: [
      "Lineage-mu menunjukkan 5 pasang kolom duplikat: kolom yang sama — atau “hampir sama” — dengan nama berbeda, dibuat tim berbeda. Sebagian memang salinan polos (`salin langsung`). Tapi satu pasang tidak: `nama_lengkap → full_name` lewat transformasi “tambah gelar di belakang nama”.",
      "Ini jebakan klasik katalog: dua kolom yang terlihat redundan ternyata punya DEFINISI berbeda. Laporan A memakai `nama_lengkap`, laporan B memakai `full_name` — dan keduanya mengklaim menampilkan “nama nasabah”. Buktikan pasangannya dengan SQL dari tabel `lineage(kolom_asal, kolom_tujuan, transformasi, relasi)`.",
    ],
    tasks: [
      { id: "t1", text: "Tampilkan pasangan duplikat (`relasi='duplikat'`): kolom_asal, kolom_tujuan, transformasi — urut abjad kolom_asal" },
    ],
    expected: "5 baris — awali dengan nasabah.id_nasabah → nasabah_core.nasabah_id; perhatikan baris nama_lengkap → full_name",
    sqlLab: {
      task: "Tampilkan pasangan kolom DUPLIKAT: kolom_asal, kolom_tujuan, transformasi. Saring relasi='duplikat', urutkan abjad kolom_asal.",
      schema: "CREATE TABLE lineage (kolom_asal TEXT, kolom_tujuan TEXT, transformasi TEXT, relasi TEXT);",
      seedData: [
        "INSERT INTO lineage VALUES",
        "('nasabah.id_nasabah','nasabah_core.nasabah_id','salin langsung','duplikat'),",
        "('nasabah.nama_lengkap','nasabah_core.full_name','tambah gelar di belakang nama','duplikat'),",
        "('nasabah.kode_cabang','nasabah_core.branch_code','salin langsung','duplikat'),",
        "('transaksi.id_transaksi','transaksi_rinci.trx_id','salin langsung','duplikat'),",
        "('transaksi.no_rekening','transaksi_rinci.acct_no','salin langsung','duplikat'),",
        "('transaksi.nominal','laporan_harian.total_nominal','SUM per hari','agregasi'),",
        "('transaksi_rinci.jumlah','laporan_valas.total_valas','SUM per currency','agregasi'),",
        "('risiko.skor_risiko_internal','laporan_modal.skor_agregat','rata-rata tertimbang','turunan'),",
        "('risiko.pd_model_v3','laporan_modal.pd_portofolio','rata-rata','turunan'),",
        "('nasabah.kode_cabang_lama','etl_cabang.mapping_lama','masih dibaca ETL malam','turunan'),",
        "('rekening.saldo','laporan_modal.total_eksposur','SUM','agregasi'),",
        "('nasabah.nik','mart_kepatuhan.nik_masked','masking 6 digit terakhir','turunan');",
      ].join("\n"),
      starter: "-- Tulis query-mu di sini\nSELECT kolom_asal, kolom_tujuan, transformasi\nFROM lineage\n",
      solution: [
        "SELECT kolom_asal, kolom_tujuan, transformasi",
        "FROM lineage",
        "WHERE relasi = 'duplikat'",
        "ORDER BY kolom_asal;",
      ].join("\n"),
      expectedColumns: ["kolom_asal", "kolom_tujuan", "transformasi"],
      expectedRows: [
        ["nasabah.id_nasabah", "nasabah_core.nasabah_id", "salin langsung"],
        ["nasabah.kode_cabang", "nasabah_core.branch_code", "salin langsung"],
        ["nasabah.nama_lengkap", "nasabah_core.full_name", "tambah gelar di belakang nama"],
        ["transaksi.id_transaksi", "transaksi_rinci.trx_id", "salin langsung"],
        ["transaksi.no_rekening", "transaksi_rinci.acct_no", "salin langsung"],
      ],
      orderMatters: true,
    },
  },
  {
    id: "investigasi",
    eyebrow: "Langkah 5 · Investigasi — kolom yatim piatu",
    title: "Mini-case: skor tanpa pemilik di laporan modal",
    prose: [
      "Angka-angkamu sudah bicara. Sekarang rangkai menjadi kasus. Mini-case: setiap kuartal, Laporan Kecukupan Modal memakai `risiko.skor_risiko_internal` — kolom TANPA pemilik, TANPA definisi tertulis selain “skor risiko internal 0-100”, dibuat oleh `etl_bot` pada 2024-03-11. Regulator bertanya “siapa pemiliknya?” dan jawaban jujurmu adalah: tidak ada.",
      "Itu baru satu. `risiko.id_nasabah` — kunci penghubung ke tabel risiko — juga tanpa pemilik dan dipakai laporan kritis. Lalu `nasabah.kode_cabang_lama`: berstatus `deprecated` sejak 2023, tapi `lineage` membuktikan ETL malam MASIH membacanya, dan satu laporan kritis masih memakainya. Label berkata “mati”, kenyataan berkata “hidup”.",
      "Dan duplikat paling berbahaya: `transaksi.nominal` (IDR) vs `transaksi_rinci.jumlah` (mata uang asal). Dua kolom “nominal transaksi” dengan SATUAN berbeda. Satu analis yang menjumlahkan keduanya mentah-mentah akan mencampur rupiah dengan dolar — dan angkanya tetap terlihat wajar.",
    ],
    tasks: [
      { id: "t1", text: "Sebutkan 2 kolom kritis tanpa pemilik + bukti dari lab-mu" },
      { id: "t2", text: "Tulis 2 kalimat: kenapa duplikat beda-definisi lebih berbahaya dari duplikat salinan polos (untuk deliverable)" },
    ],
    note: {
      title: "Miskonsepsi #3: label “deprecated” = sudah tidak dipakai",
      type: "pitfall",
      body: "“Statusnya deprecated, jadi aman dihapus.” SALAH — label adalah klaim, lineage adalah bukti. Di kasus ini, kode_cabang_lama diklaim mati sejak 2023 tapi ETL malam masih membacanya. Menghapus kolom “deprecated” tanpa mengecek lineage = memutus pipeline produksi di tengah malam. Aturan: tidak ada kolom yang dimatikan sebelum lineage-nya dibuktikan kosong.",
    },
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 6 · Checkpoint keputusan",
    title: "Tenggat 30 hari — strategi apa yang kamu usulkan?",
    prose: [
      "Fakta di meja: 37 kolom, 8 tanpa pemilik (2 di laporan kritis), 1 deprecated yang masih hidup, 5 pasang duplikat, 1 jebakan satuan. Regulator menunggu 30 hari. Kepala Kepatuhan menatapmu: “Rencanamu apa?” Tiap opsi mengubah apa yang terjadi berikutnya — dan tidak ada yang gratis.",
    ],
    tasks: [
      { id: "t1", text: "Baca ketiga opsi + rationale sebelum memilih (keputusan final)" },
    ],
    decision: {
      prompt:
        "Strategi katalog apa yang kamu usulkan ke Kepala Kepatuhan untuk menjawab regulator dalam 30 hari?",
      options: [
        {
          id: "opt-mandat",
          label: "Mandat penuh: bekukan perubahan skema 30 hari, audit semua 37 kolom",
          rationale:
            "Tanpa jeda, tim upstream terus menambah kolom baru sementara kamu mengkatalog yang lama — seperti mengepel lantai saat keran bocor. Bekukan dulu, bereskan tuntas.",
          nextStepId: "cabang-mandat",
          consequenceNote:
            "Kepala Kepatuhan setuju; tiga tim protes. Hari ke-28 katalog v1 selesai — dan saat kamu mematikan kode_cabang_lama, ETL malam GAGAL: satu job ternyata masih membacanya. Pelajaran mahal: kolom dimatikan bertahap (peringatan → dual-read → matikan), bukan sekali tebas.",
        },
        {
          id: "opt-kritis",
          label: "Kilat: katalog hanya kolom laporan kritis (14 hari), sisanya menyusul",
          rationale:
            "Regulator hanya bertanya soal kolom kritis. Jawab dulu yang ditanya, hemat sumber daya, sisanya jadi fase 2.",
          nextStepId: "cabang-kritis",
          consequenceNote:
            "Regulator puas untuk tenggat ini. Tiga bulan kemudian insiden: dua laporan menampilkan “jumlah nasabah” yang berbeda — satu memakai nama_lengkap, satu memakai full_name. Kolom non-kritis yang kamu tunda ternyata meledak di tempat lain.",
        },
        {
          id: "opt-otomatis",
          label: "Otomatis penuh: scanner mengisi katalog tanpa verifikasi manusia",
          rationale:
            "37 kolom selesai dalam 2 hari. Cepat, murah, dan terlihat modern di slide presentasi.",
          nextStepId: "cabang-otomatis",
          consequenceNote:
            "Katalog jadi dalam 2 hari — tapi scanner mengklasifikasikan jumlah sebagai “nominal IDR” dan melewatkan beda definisi full_name. Auditor menemukan 4 label salah. Kecepatan tanpa verifikasi = katalog yang rapi tapi bohong.",
        },
      ],
    },
  },
  {
    id: "cabang-mandat",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: mandat penuh + pembekuan skema",
    prose: [
      "Tiga puluh hari pembekuan skema. Tiga tim memprotesmu di minggu pertama — “menghambat inovasi”, kata mereka. Tapi di minggu ketiga, sesuatu berubah: untuk pertama kalinya, semua orang melihat peta yang sama. Tidak ada lagi “setahuku kolom itu milik tim X”.",
      "Hari ke-28, katalog v1 selesai: 37 kolom, semua berpenghuni — 8 kolom yatim kini punya pemilik resmi yang menandatangani definisinya. Lalu kamu mematikan `kode_cabang_lama`… dan ETL malam gagal total. Satu job lama ternyata masih membacanya — persis seperti yang diperingatkan audit log 2023-11-20.",
      "Kamu memperbaikinya dalam semalam dengan pola yang benar: peringatan → dual-read (baca dua kolom paralel 2 minggu) → matikan. Regulator menerima jawabanmu. Harga yang kamu bayar: satu bulan politik kantor yang tidak nyaman — dan satu malam lembur yang mengajarkanmu bahwa mematikan kolom adalah operasi, bukan penghapusan baris.",
    ],
    tasks: [
      { id: "t1", text: "Catat pola penonaktifan kolom yang benar untuk deliverable-mu" },
    ],
    note: {
      title: "Pembekuan skema: mahal tapi kadang perlu",
      body: "Membekukan perubahan skema adalah palu godam — efektif untuk kekacauan akut, merusak untuk ritme normal. Di dunia nyata, penggantinya yang lestari adalah schema registry + data contract: perubahan tetap boleh, tapi tercatat dan berversi.",
    },
  },
  {
    id: "cabang-kritis",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: kilat, hanya kolom kritis",
    prose: [
      "Empat belas hari. Kamu mengkatalog 11 kolom laporan kritis dengan sempurna — regulator puas, Kepala Kepatuhan lega, dan kamu dipuji “efisien”. Fase 2 (26 kolom sisanya) dijadwalkan “segera”.",
      "Tiga bulan kemudian, insiden. Laporan A menampilkan 48.210 nasabah, laporan B menampilkan 47.955 — selisih 255 orang, dan keduanya mengklaim menampilkan “jumlah nasabah”. Akar masalah: laporan A memakai `nama_lengkap`, laporan B memakai `full_name` — duplikat beda-definisi yang kamu tunda di fase 2.",
      "Pelajaran yang pahit: “kritis” adalah label hari ini. Kolom yang non-kritis hari ini bisa menjadi akar insiden besok — karena duplikat tidak peduli label kritis/tidaknya. Strategi kilat memenangkan tenggat dan kalah perang.",
    ],
    tasks: [
      { id: "t1", text: "Catat untuk deliverable: kenapa kolom non-kritis tetap masuk katalog" },
    ],
    note: {
      title: "Prioritas ≠ pengabaian",
      body: "Memprioritaskan kolom kritis itu benar — yang salah adalah menunda sisanya tanpa tanggal. Di deliverable-mu, fase 2 wajib punya tenggat (“26 kolom sisanya selesai 60 hari setelah ini”), bukan status “segera”.",
    },
  },
  {
    id: "cabang-otomatis",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: otomatis penuh tanpa verifikasi",
    prose: [
      "Dua hari. Katalog “selesai” — 37 kolom terisi rapi, slide presentasi cantik. Kepala Kepatuhan tersenyum untuk pertama kalinya sejak surat itu tiba.",
      "Lalu auditor datang. Empat label salah ditemukan dalam satu jam: `jumlah` diklasifikasikan “nominal IDR” (padahal mata uang asal), `full_name` disamakan dengan `nama_lengkap` (padahal beda definisi), dua kolom yatim diberi pemilik “tebakan” oleh scanner. Katalog yang rapi tapi bohong — dan kebohongan yang rapi lebih berbahaya daripada kekacauan yang jujur, karena orang memercayainya.",
      "Kamu menghabiskan tiga minggu berikutnya memverifikasi ulang semuanya manual — total waktu: lebih lama daripada kalau verifikasi dilakukan sejak awal. Pelajaran: otomasi adalah akselerator, bukan pengganti penilaian. Scanner mengusulkan, manusia memutuskan.",
    ],
    tasks: [
      { id: "t1", text: "Catat untuk deliverable: di mana otomasi boleh jalan sendiri vs wajib review manusia" },
    ],
    note: {
      title: "Aturan review manusia",
      body: "Praktik industri: kolom berklasifikasi “rahasia” dan kolom laporan kritis WAJIB review manusia; sisanya boleh auto-approve dengan sampling audit 10%. Tulis aturan ini di deliverable-mu.",
    },
  },
];

(misiKatalogData.steps as V2Step[]).push(...LANJUTAN_KATALOG);

// ── lanjutan misiKatalogData: langkah 8–11 (audit, deliverable, debrief, rangkuman)
const LANJUTAN_KATALOG_2: V2Step[] = [
  {
    id: "audit",
    eyebrow: "Langkah 8 · Misi audit",
    title: "Dossier 16 baris: “Katalog Sementara v0.1”",
    prose: [
      "Sebelum menulis jawaban untuk regulator, satu misi audit. Seseorang — tim operasional yang terburu-buru — menyusun “Katalog Sementara v0.1” dalam 2 hari dan mengklaimnya cukup untuk menjawab surat regulator. Di bawah ini 16 barisnya. Empat suntikan disembunyikan di dalamnya.",
      "Senjatamu: 37 kolom versimu, 8 kolom yatim, 5 pasang duplikat, dan audit log. Jangan percaya klaim — verifikasi ke sumber mentah.",
    ],
    tasks: [
      { id: "t1", text: "Tandai setiap baris yang klaimnya bertentangan dengan hasil lab-mu" },
    ],
    auditDossier: {
      version: "katalog-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai “Katalog Sementara v0.1” — hasil inventarisasi kilat 2 hari oleh tim operasional, dinyatakan cukup untuk menjawab regulator.",
      columns: ["Kolom", "Pemilik (klaim)", "Klasifikasi (klaim)", "Status (klaim)"],
      rows: [
        { rowId: 1, cells: { "Kolom": "nasabah.nik", "Pemilik (klaim)": "Tim Kepatuhan", "Klasifikasi (klaim)": "rahasia", "Status (klaim)": "aktif" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 2, cells: { "Kolom": "nasabah.nama_lengkap", "Pemilik (klaim)": "Tim Kepatuhan", "Klasifikasi (klaim)": "rahasia", "Status (klaim)": "aktif" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        // ── I1: duplikat beda definisi diklaim sama ──
        { rowId: 3, cells: { "Kolom": "nasabah_core.full_name", "Pemilik (klaim)": "Tim Analitik", "Klasifikasi (klaim)": "rahasia", "Status (klaim)": "aktif" }, claims: [{ label: "Definisi", value: "Sama dengan nama_lengkap" }] },
        { rowId: 4, cells: { "Kolom": "transaksi.nominal", "Pemilik (klaim)": "Tim Keuangan", "Klasifikasi (klaim)": "terbatas", "Status (klaim)": "aktif" }, claims: [{ label: "Satuan", value: "IDR" }] },
        // ── I4: beda satuan diklaim sama-sama IDR ──
        { rowId: 5, cells: { "Kolom": "transaksi_rinci.jumlah", "Pemilik (klaim)": "Tim Analitik", "Klasifikasi (klaim)": "terbatas", "Status (klaim)": "aktif" }, claims: [{ label: "Satuan", value: "IDR (sama dengan nominal)" }] },
        // ── I2: kolom kritis tanpa pemilik diakui lisan ──
        { rowId: 6, cells: { "Kolom": "risiko.skor_risiko_internal", "Pemilik (klaim)": "Tim Risiko (lisan)", "Klasifikasi (klaim)": "terbatas", "Status (klaim)": "aktif" }, claims: [{ label: "Pemilik", value: "Tim Risiko — lisan, belum tercatat" }, { label: "Dipakai di", value: "Laporan Kecukupan Modal" }] },
        { rowId: 7, cells: { "Kolom": "risiko.id_nasabah", "Pemilik (klaim)": "(kosong)", "Klasifikasi (klaim)": "internal", "Status (klaim)": "aktif" }, claims: [{ label: "Dipakai di", value: "Laporan kritis" }] },
        // ── I3: deprecated diklaim nonaktif ──
        { rowId: 8, cells: { "Kolom": "nasabah.kode_cabang_lama", "Pemilik (klaim)": "Tim Operasional", "Klasifikasi (klaim)": "internal", "Status (klaim)": "nonaktif" }, claims: [{ label: "Status", value: "Nonaktif sejak 2023" }] },
        { rowId: 9, cells: { "Kolom": "rekening.saldo", "Pemilik (klaim)": "Tim Keuangan", "Klasifikasi (klaim)": "terbatas", "Status (klaim)": "aktif" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 10, cells: { "Kolom": "nasabah.alamat", "Pemilik (klaim)": "Tim Operasional", "Klasifikasi (klaim)": "rahasia", "Status (klaim)": "aktif" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 11, cells: { "Kolom": "transaksi_rinci.currency", "Pemilik (klaim)": "Tim Analitik", "Klasifikasi (klaim)": "internal", "Status (klaim)": "aktif" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 12, cells: { "Kolom": "nasabah_core.segment", "Pemilik (klaim)": "(kosong)", "Klasifikasi (klaim)": "internal", "Status (klaim)": "aktif" }, claims: [{ label: "Catatan", value: "Deskripsi kosong — red flag dokumentasi" }] },
        { rowId: 13, cells: { "Kolom": "rekening.status", "Pemilik (klaim)": "(kosong)", "Klasifikasi (klaim)": "internal", "Status (klaim)": "aktif" }, claims: [{ label: "Catatan", value: "Pemilik belum ditetapkan" }] },
        { rowId: 14, cells: { "Kolom": "risiko.pd_model_v3", "Pemilik (klaim)": "Tim Risiko", "Klasifikasi (klaim)": "terbatas", "Status (klaim)": "aktif" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 15, cells: { "Kolom": "transaksi.kode_transaksi", "Pemilik (klaim)": "(kosong)", "Klasifikasi (klaim)": "internal", "Status (klaim)": "aktif" }, claims: [{ label: "Catatan", value: "Pemilik belum ditetapkan" }] },
        { rowId: 16, cells: { "Kolom": "nasabah.tgl_lahir", "Pemilik (klaim)": "Tim Kepatuhan", "Klasifikasi (klaim)": "rahasia", "Status (klaim)": "aktif" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
      ],
      injections: [
        { key: "duplikat-beda-definisi", rowIds: [2, 3], title: "Duplikat beda definisi diklaim sama", clue: "Baris 3 mengklaim full_name “sama dengan nama_lengkap” — tapi lineage mencatat transformasi “tambah gelar di belakang nama”. Dua laporan yang memakai keduanya menghitung “nama nasabah” secara berbeda.", danger: "Laporan yang memakai kolom duplikat bergantian menghasilkan angka yang tidak bisa direkonsiliasi — dan tidak ada yang tahu mana yang benar." },
        { key: "satuan-menyesatkan", rowIds: [4, 5], title: "Beda satuan diklaim sama-sama IDR", clue: "Baris 5 mengklaim jumlah bersatuan IDR “sama dengan nominal”. Deskripsi aslinya: “Nominal dalam MATA UANG ASAL (bukan IDR!)”. Menjumlahkan keduanya mentah-mentah = mencampur rupiah dengan dolar.", danger: "Kesalahan satuan adalah pembunuh senyap laporan keuangan — angkanya terlihat wajar sampai seseorang mengaudit." },
        { key: "yatim-kritis", rowIds: [6, 7], title: "Kolom kritis tanpa pemilik “diakui lisan”", clue: "Baris 6 mengklaim pemilik “Tim Risiko — lisan, belum tercatat”. Kepemilikan lisan = tidak ada pemilik: tidak ada yang bertanggung jawab atas definisi dan kualitasnya — padahal dipakai di Laporan Kecukupan Modal.", danger: "Kolom tanpa pemilik yang dipakai keputusan kritis adalah jawaban “tidak tahu” yang menunggu waktu untuk meledak — persis seperti surat regulator ini." },
        { key: "deprecated-hidup", rowIds: [8], title: "Kolom deprecated diklaim nonaktif", clue: "Baris 8 mengklaim kode_cabang_lama “nonaktif sejak 2023”. Audit log 2023-11-20: “masih dibaca ETL malam” — dan lineage membuktikannya. Label status bohong; yang jujur adalah lineage.", danger: "Mematikan kolom yang “katanya” sudah tidak dipakai tanpa mengecek lineage = memutus ETL produksi di tengah malam." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 9 · Deliverable",
    title: "Paket Katalog Data v1 + Memo Jawaban Regulator",
    prose: [
      "Semua bukti di tangan. Tulis dua artefak portofoliomu: (1) Paket Katalog Data v1 — data dictionary resmi pertama bank; (2) memo satu halaman yang menjawab surat regulator. Memo yang baik tidak hanya memberi nama pemilik — ia menunjukkan bahwa bank kini punya SISTEM sehingga pertanyaan seperti ini tidak terulang.",
    ],
    tasks: [
      { id: "t1", text: "Tulis draf memo + katalog mengikuti template (di luar app, lalu bawa kembali)" },
    ],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): jawaban atas pertanyaan regulator — siapa pemilik skor_risiko_internal, dipakai untuk keputusan apa, dan status katalog saat ini.",
        "Data dictionary: 37 kolom dengan pemilik, klasifikasi sensitivitas, dan status — tandai 8 kolom tanpa pemilik beserta rencana penetapan pemiliknya.",
        "Temuan anomali: duplikat beda definisi, beda satuan, kolom yatim di laporan kritis, label deprecated yang bohong — masing-masing dengan bukti baris.",
        "Rencana aksi 30 hari: merujuk keputusanmu di Langkah 6, lengkap dengan kriteria “katalog dinyatakan selesai”.",
        "Batas & risiko sisa: apa yang TIDAK dicakup katalog ini (mis. kualitas isi data, bukan hanya metadata; klasifikasi heuristik butuh review manusia).",
      ],
      rubric: [
        { criterion: "Kelengkapan katalog", weight: 25, levels: ["Banyak kolom hilang/tanpa pemilik", "Sebagian kolom terdokumentasi", "37 kolom lengkap: pemilik + klasifikasi + status; 8 kolom yatim ditandai + rencana pemilik"] },
        { criterion: "Ketepatan klasifikasi", weight: 25, levels: ["Label asal tanpa aturan", "Ada aturan, banyak salah", "Aturan pola nama konsisten (9/6/20/2) + false positive tgl_skor dijelaskan"] },
        { criterion: "Deteksi anomali", weight: 30, levels: ["Tidak menyebut anomali", "Menyebut sebagian tanpa bukti", "Keempat anomali disebut dengan nomor baris + bukti"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim katalog menyelesaikan semua masalah data", "Menyebut sebagian batas", "Batas (metadata bukan kualitas isi; heuristik butuh review) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 10 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat suntikan di “Katalog Sementara v0.1”:",
      "1) **Duplikat beda definisi** (baris 2–3): full_name diklaim “sama dengan nama_lengkap”. Lineage berkata lain: ada transformasi “tambah gelar”. Dua definisi, satu nama konsep — resep klasik laporan yang tidak bisa direkonsiliasi.",
      "2) **Beda satuan** (baris 4–5): jumlah diklaim “IDR, sama dengan nominal”. Deskripsi aslinya berteriak dalam huruf kapital: MATA UANG ASAL, BUKAN IDR. Inilah kenapa deskripsi kolom bukan hiasan.",
      "3) **Kolom yatim di laporan kritis** (baris 6–7): “Tim Risiko (lisan)” — kalimat paling mahal di dossier ini. Kepemilikan yang tidak tercatat = tidak ada pemilik. Regulator tidak bertanya “kira-kira siapa”; ia bertanya “siapa, tertulis di mana”.",
      "4) **Deprecated yang hidup** (baris 8): “nonaktif sejak 2023” vs audit log “masih dibaca ETL malam”. Label adalah klaim; lineage adalah bukti. Selalu verifikasi ke bukti.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap sumber mentah, atau memercayai stempel “sementara v0.1”. Dan ingat keputusan bercabangmu: mandat penuh memenangkan perang tapi mahal secara politik; kilat memenangkan tenggat tapi kalah perang; otomatis memenangkan kecepatan tapi kalah kebenaran. Tidak ada opsi gratis — hanya ada harga yang kamu pilih secara sadar.",
      "Bahaya nyata terakhir: bank tanpa katalog tidak hanya lambat menjawab regulator — ia mengambil keputusan modal, kredit, dan risiko di atas kolom-kolom yang tidak ada pemiliknya. Surat regulator hanyalah gejala pertama yang terlihat.",
    ],
    tasks: [
      { id: "t1", text: "Bandingkan temuanmu dengan 4 suntikan di atas; catat yang terlewat" },
    ],
    note: {
      title: "Katalog bukan proyek — katalog adalah kebiasaan",
      type: "risk",
      body: "Katalog v1 yang kamu tulis hari ini akan basi dalam 6 bulan tanpa tiga kebiasaan: setiap perubahan skema tercatat, setiap kolom baru wajib punya pemilik sebelum merge, dan audit katalog berkala. Tanpa itu, tiga tahun dari sekarang seseorang akan menerima surat yang sama — tentang kolom yang berbeda.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 11 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Tutup misi: pastikan summary 5 poin di bawah kamu pahami" },
    ],
    summary: [
      "Katalog = KTP-nya data: 37 kolom dipetakan — 8 tanpa pemilik (2 dipakai laporan kritis), 1 deprecated yang masih hidup, 5 pasang duplikat.",
      "Klasifikasi sensitivitas berbasis pola nama: 9 rahasia, 6 terbatas, 20 internal, 2 publik — heuristik yang murah tapi butuh review manusia (false positive: tgl_skor).",
      "Empat pola anomali katalog: duplikat beda definisi, beda satuan, kolom yatim di laporan kritis, label deprecated yang bohong.",
      "Kepemilikan lisan = tidak ada pemilik; label status bukan bukti — verifikasi selalu ke lineage dan log, bukan ke klaim.",
      "Data: 100% SINTETIS (generator seed 42, dibekukan 2026-10-15); katalog nyata berisi ribuan kolom — prinsipnya sama, skalanya beda.",
    ],
  },
];

(misiKatalogData.steps as V2Step[]).push(...LANJUTAN_KATALOG_2);
