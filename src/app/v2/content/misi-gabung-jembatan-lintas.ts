import type { V2Mission } from "../lib/types";

// ── MISI JEMBATAN: Dana yang Melompat Rantai ─────────────────────────────
// CAPSTONE (Misi C — kombinasi). Track: Blockchain Data Scientist.
// Dataset: (a) slice BitcoinHeist, UCI ML Repository, CC BY 4.0 (320 alamat,
// kolom pola_mixing turunan dari fitur length); (b) bridge_tx.csv 100% SINTETIS
// (222 tx, seed 42); (c) watchlist.csv 100% SINTETIS (12 alamat, SIMULASI).
// File: public/misi/misi-gabung-jembatan-lintas/. Metode: METODE.md.

const BASE = "/misi/misi-gabung-jembatan-lintas";

export const misiGabungJembatanLintas: V2Mission = {
  slug: "misi-gabung-jembatan-lintas",
  track: "Blockchain Data Scientist",
  module: "Misi",
  title: "Misi Jembatan: Dana yang Melompat Rantai",
  estMinutes: 180,
  role: "Investigator blockchain",
  client:
    "Head of Compliance sebuah exchange — deposit masuk dari bridge lintas rantai berpola hop cepat yang mencurigakan; butuh paket bukti siap-serah sebelum batas pelaporan regulator",
  xp: 750,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Dana yang tidak pernah diam",
      prose: [],
      tasks: [],
      briefing: {
        role: "Investigator blockchain di tim kepatuhan sebuah exchange — pemburu pola pencucian dana lintas rantai",
        client:
          "Head of Compliance. Tiga hari lalu sistem pantau menandai anomali: sejumlah deposit masuk ke exchange sesaat setelah dana itu melompat-lompat antar-blockchain melalui bridge — Bitcoin ke Ethereum ke Polygon ke Solana dalam hitungan menit, jumlah nyaris sama di tiap lompatan minus fee tipis. Itu bukan perilaku trader normal; itu bau layering, teknik klasik pencucian uang: memutus jejak dengan memecah dan memindahkan dana secepat mungkin. Exchange wajib memutuskan dalam 14 hari: ajukan Suspicious Transaction Report (STR), pantau diperketat, atau tutup kasus. Keputusan tanpa bukti = tebak-tebakan; tebak-tebakan di compliance = denda atau reputasi hancur.",
        story: [
          "Senin, 09:12. Head of Compliance meletakkan printout di mejamu: enam diagram alur, masing-masing seperti sidik jari yang sama — dana masuk dari satu rantai, keluar ke rantai lain 4 menit kemudian, lalu lompat lagi, lalu lagi. “Trader arbitrase tidak begini,” katanya. “Arbitrase butuh likuiditas dan jeda. Ini seperti seseorang sedang berlari — dan berlari di atas jembatan antar-rantai supaya CCTV tiap rantai hanya merekam sepotong.”",
          "Kamu tahu masalahnya: tiap blockchain transparan, tapi tidak ada yang menonton semuanya sekaligus. Bridge adalah celah antar-kamera. Dana yang melompat 4 rantai dalam 20 menit meninggalkan jejak utuh di tiap rantai — tapi tidak ada satu pun rantai yang melihat gambar lengkapnya. Tugasmu: merekonstruksi gambar lengkap itu.",
          "Di meja yang sama ada map kedua: laporan kepatuhan triwulan internal yang mengklaim “tidak ada temuan material”. Seseorang di dalam gedung ini sudah menulis kesimpulan — sebelum investigasi selesai. Kamu akan mengaudit laporan itu juga.",
        ],
        objectives: [
          "Merekonstruksi 6 jalur hop lengkap dari 222 transaksi bridge (cluster by timing + jumlah), menghitung skor bridge-hopping tiap jalur, dan mengidentifikasi jalur paling berisiko.",
          "Menemukan alamat-alamat yang cocok dengan watchlist simulasi via join SQL, dengan hasil yang bisa direproduksi baris per baris.",
          "Menemukan 4 sabotase di laporan kepatuhan internal dan menyusun paket bukti siap-serah ke regulator beserta rekomendasi STR yang dipertahankan.",
        ],
        prereqSummary:
          "Bridge = layanan yang memindahkan aset antar-blockchain (mis. Bitcoin → Ethereum). Layering = tahap pencucian uang di mana dana dipindah-pindah cepat untuk mengaburkan asal-usulnya; hop lintas rantai dalam jeda menit dengan jumlah nyaris tetap adalah sidik jarinya. STR (Suspicious Transaction Report) = laporan resmi ke regulator bila ada indikasi kuat — mengajukannya butuh bukti, tidak mengajukannya saat bukti ada bisa jadi pelanggaran. Watchlist di misi ini 100% SIMULASI (bukan daftar sanksi asli) — dipakai untuk melatih teknik pencocokan, bukan untuk menuduh.",
        datasetNote:
          "Tiga file di folder misi ini. (a) alamat_mixing.csv — slice NYATA 320 alamat dari BitcoinHeist Ransomware Address Dataset (UCI ML Repository, CC BY 4.0, atribusi di METODE.md); kolom pola_mixing adalah turunan misi dari fitur length (pengukur mixing rounds menurut dokumentasi dataset). (b) bridge_tx.csv — 100% SINTETIS (seed 42): 222 transaksi bridge dengan 6 jalur hop + 2 decoy + 200 transaksi latar. (c) watchlist.csv — 100% SINTETIS: 12 alamat contoh berlabel SIMULASI (bukan OFAC/sanksi asli). Snapshot < 5 MB. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, tiga sudut pandang",
      prose: [
        "`alamat_mixing.csv` adalah memori industri: 320 alamat Bitcoin nyata dengan fitur perilaku graf (length, weight, count, looped, neighbors, income) dan label famili. Fitur `length` mengukur mixing rounds — berapa putaran dana dipecah dan digabung ulang lewat alamat-alamat baru. Ini kamus polamu: seperti apa “bau” pencampuran dana di data nyata.",
        "`bridge_tx.csv` adalah TKP: 222 transaksi bridge antar-rantai (kolom tx_id, rantai_asal, rantai_tujuan, jumlah, timestamp, alamat). Di dalamnya tersembunyi 6 jalur hop lengkap, 2 umpan (decoy) yang sengaja mirip tapi gagal kriteria, dan 200 transaksi latar yang tidak terkait. Tidak ada kolom penanda jalur — kamu yang harus merekonstruksinya.",
        "`watchlist.csv` adalah daftar simulasi 12 alamat contoh entitas sanksi. Ingat: SIMULASI, bukan daftar resmi. Fungsinya melatih satu keterampilan spesifik — join yang tepat dan bisa diaudit — tanpa risiko menuduh pihak nyata.",
        "Aturan main: (1) jalur direkonstruksi dari timing + jumlah, bukan dari tebakan; (2) satu hop valid = rantai_tujuan tx sebelumnya sama dengan rantai_asal tx berikutnya, jeda ≤ 15 menit, jumlah turun ≤ 3% (fee); (3) klaim apa pun tentang “bersih” harus bisa ditelusuri sampai baris datanya.",
      ],
      tasks: [
        { id: "t1", text: "Buka `bridge_tx.csv`: catat jumlah baris dan rentang timestamp" },
        { id: "t2", text: "Buka `watchlist.csv`: catat jumlah baris dan isi kolom `sumber`" },
        { id: "t3", text: "Buka `alamat_mixing.csv`: catat arti kolom `length` menurut METODE.md" },
      ],
      note: {
        title: "Miskonsepsi #1: transparan = terlacak",
        type: "pitfall",
        body: "“Blockchain kan transparan, pasti ketahuan.” Transparan per rantai — tapi tidak ada kamera yang merekam SEMUA rantai sekaligus. Bridge-hopping mengeksploitasi persis celah itu: tiap rantai melihat satu lompatan yang sah, tidak ada yang melihat larinya. Investigasi lintas rantai ada untuk menutup celah antar-kamera ini.",
      },
      reference:
        "bridge_tx.csv (222 tx, TKP) vs alamat_mixing.csv (320 alamat, kamus pola) vs watchlist.csv (12 alamat SIMULASI, daftar latih). Rekonstruksi dari yang mentah; vonis untuk yang diklaim.",
    },
    {
      id: "primer",
      eyebrow: "Langkah 3 · Primer pola",
      title: "Membaca bau pencampuran di data nyata",
      prose: [
        "Sebelum menyentuh TKP, latih hidungmu di data nyata. Slice BitcoinHeist berisi fitur graf yang dirancang penulis dataset untuk mengukur pola spesifik: `length` menghitung mixing rounds (dana diterima lalu didistribusikan dalam jumlah serupa lewat beberapa putaran dan alamat baru), `weight` dan `count` mengukur perilaku merge (banyak alamat digabung ke satu alamat akhir). Itu kosakata yang sama dengan yang dipakai pelaku bridge-hopping — hanya medianya berbeda.",
        "Kolom `pola_mixing` di file ini adalah turunan misi: `mixing-tinggi` bila length ≥ 60 (persentil 75 slice), `mixing-sedang` 12–59, `mixing-rendah` di bawah 12. Bukan label ground-truth — alat baca cepat. Perhatikan: median length alamat `white` (18) justru LEBIH TINGGI dari median non-white (8) di slice ini. Pelajaran pertama investigasi: label famili bukan proksi perilaku; angka perilakulah yang bicara.",
        "Yang kamu bawa ke Lab 1 dari langkah ini: intuisi bahwa pencampuran = putaran + alamat baru + jumlah yang dipertahankan — dan bahwa intuisi harus selalu dikonfirmasi hitungan, bukan sebaliknya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung distribusi `pola_mixing`: berapa alamat di tiap tingkat?" },
        { id: "t2", text: "Bandingkan median `length` alamat white vs non-white — apa artinya?" },
        { id: "t3", text: "Tulis satu kalimat: ciri perilaku apa yang membedakan mixing-tinggi dari mixing-rendah?" },
      ],
      expected:
        "320 alamat: mixing-rendah 158, mixing-sedang 81, mixing-tinggi 81; median length white 18 vs non-white 8 — label famili bukan proksi perilaku mixing",
      note: {
        title: "Miskonsepsi #2: label = kebenaran",
        type: "pitfall",
        body: "Godaan terbesar analis: memakai label yang ada (white vs ransomware) sebagai kebenaran, lalu berhenti berpikir. Di slice ini, alamat “bersih” pun bisa punya mixing rounds tinggi — karena mixing adalah PERILAKU, bukan identitas. Investigator yang baik menuduh perilaku, bukan label.",
      },
    },
    {
      id: "lab-hop",
      eyebrow: "Langkah 4 · Lab 1 — Rekonstruksi hop",
      title: "Sambungkan lompatannya, temukan larinya",
      prose: [
        "Sekarang rekonstruksi. Dari `bridge_tx.csv`: kelompokkan transaksi menjadi rantai hop dengan aturan — tx berikutnya valid bila `rantai_asal`-nya sama dengan `rantai_tujuan` tx sebelumnya, jeda 0–15 menit, dan jumlah turun tidak lebih dari 3% (fee jembatan). Rantai dengan ≥ 2 hop = jalur lengkap. Dua decoy sengaja dipasang: satu jedanya 45 menit (gagal aturan waktu), satu jumlahnya anjlok 20% (gagal aturan fee) — keduanya HARUS gagal tersambung bila aturanmu benar.",
        "Lalu hitung skor bridge-hopping tiap jalur lengkap. Rumus di bawah: makin banyak hop dalam jeda makin pendek, makin tinggi skornya — makin mirip lari, makin tidak mirip trading.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_tx` dan `n_alamat` (alamat unik)" },
        { id: "t2", text: "Bangun rantai hop dengan aturan validasi; hitung `n_jalur` (jalur lengkap, ≥ 2 hop)" },
        { id: "t3", text: "Hitung `skor_max` (skor tertinggi) dan `fee_rata2` (%, rata-rata total fee per jalur)" },
      ],
      expected:
        "n_tx=222, n_alamat=95, n_jalur=6, skor_max=0,7059 (DANA-02: 4 hop, jeda rata-rata 4,67 menit), fee_rata2=2,03%",
      formula: String.raw`S = \frac{h}{1 + \bar{g}}`,
      formulaNote:
        "S = skor bridge-hopping; h = jumlah hop (transaksi bridge dalam satu jalur); ḡ = jeda rata-rata antar-hop dalam menit. S besar = banyak lompatan dalam waktu singkat (mirip lari); S kecil = lompatan jarang (mirip aktivitas normal). Contoh: DANA-02 punya h=4 hop dengan jeda 3, 6, 5 menit (rata-rata 4,67) → S = 4 / (1 + 4,67) = 0,7059 — skor tertinggi, jalur paling berisiko.",
      note: {
        title: "Miskonsepsi #3: pola mirip = jalur sama",
        type: "pitfall",
        body: "Decoy sengaja dibuat MIRIP jalur asli — rantai yang cocok, jumlah yang masuk akal. Yang membedakan hanya angka: jeda 45 menit vs ambang 15 menit, anjlok 20% vs toleransi 3%. Investigasi bukan soal “kelihatannya sama”, tapi soal ambang yang bisa dipertahankan di depan regulator. Tulis ambangmu SEBELUM melihat hasil — itulah bedanya investigasi dengan cocokologi.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))` — kolom timestamp bertipe string, ubah dengan `pd.to_datetime` atau `datetime.fromisoformat`.",
        "Urutkan dulu berdasarkan timestamp; lalu greedy: tiap tx yang belum tersambung jadi awal rantai, sambung berikutnya yang memenuhi ketiga aturan.",
        "Jeda menit: `(t2 - t1).total_seconds() / 60`. Penurunan jumlah: `(j1 - j2) / j1` — toleransi 0 sampai 0,03.",
        "Skor: `h / (1 + g_rata2)` dengan h = len(rantai) dan g_rata2 = rata-rata jeda antar-hop dalam rantai itu.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "from datetime import datetime",
          "",
          "URL = \"/misi/misi-gabung-jembatan-lintas/bridge_tx.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_tx = ...",
          "n_alamat = ...   # alamat unik",
          "",
          "def menit(a, b):",
          "    return ...   # selisih menit b - a (timestamp ISO)",
          "",
          "# rantai hop: greedy dari tiap tx yang belum tersambung",
          "def valid(lalu, berikut):",
          "    return ...   # 3 aturan: rantai sambung, 0 < jeda <= 15, 0 <= drop <= 0.03",
          "",
          "jalur = ...      # list rantai; tiap rantai = list baris tx",
          "lengkap = ...    # rantai dengan >= 2 hop",
          "n_jalur = ...",
          "",
          "def skor(chain):",
          "    return ...   # h / (1 + jeda_rata2)",
          "",
          "skor_max = ...",
          "fee_rata2 = ...  # % rata-rata (awal-akhir)/awal per jalur lengkap",
          "",
          "print(\"tx:\", n_tx, \"| alamat:\", n_alamat, \"| jalur lengkap:\", n_jalur)",
          "print(\"skor_max:\", round(skor_max, 4))",
          "print(\"fee_rata2_%:\", round(fee_rata2, 3))",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "from datetime import datetime",
          "",
          "URL = \"/misi/misi-gabung-jembatan-lintas/bridge_tx.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_tx = len(df)",
          "n_alamat = int(df[\"alamat\"].nunique())",
          "",
          "def menit(a, b):",
          "    return (datetime.fromisoformat(b) - datetime.fromisoformat(a)).total_seconds() / 60",
          "",
          "# rantai hop: greedy dari tiap tx yang belum tersambung",
          "def valid(lalu, berikut):",
          "    if berikut[\"rantai_asal\"] != lalu[\"rantai_tujuan\"]:",
          "        return False",
          "    g = menit(lalu[\"timestamp\"], berikut[\"timestamp\"])",
          "    if not (0 < g <= 15):",
          "        return False",
          "    drop = (float(lalu[\"jumlah\"]) - float(berikut[\"jumlah\"])) / float(lalu[\"jumlah\"])",
          "    return -0.001 <= drop <= 0.03",
          "",
          "data = df.sort_values(\"timestamp\").to_dict(\"records\")",
          "dipakai = set()",
          "jalur = []",
          "for r in data:",
          "    if r[\"tx_id\"] in dipakai:",
          "        continue",
          "    chain = [r]",
          "    while True:",
          "        nxt = None",
          "        for c in data:",
          "            if c[\"tx_id\"] in dipakai or c in chain:",
          "                continue",
          "            if c[\"timestamp\"] <= chain[-1][\"timestamp\"]:",
          "                continue",
          "            if valid(chain[-1], c):",
          "                nxt = c",
          "                break",
          "        if nxt is None:",
          "            break",
          "        chain.append(nxt)",
          "        dipakai.add(nxt[\"tx_id\"])",
          "    jalur.append(chain)",
          "lengkap = [c for c in jalur if len(c) >= 2]",
          "n_jalur = len(lengkap)",
          "",
          "def skor(chain):",
          "    h = len(chain)",
          "    gs = [menit(chain[i][\"timestamp\"], chain[i+1][\"timestamp\"]) for i in range(h-1)]",
          "    return h / (1 + sum(gs)/len(gs))",
          "",
          "skor_max = max(skor(c) for c in lengkap)",
          "fee_rata2 = sum((float(c[0][\"jumlah\"]) - float(c[-1][\"jumlah\"])) / float(c[0][\"jumlah\"]) for c in lengkap) / len(lengkap) * 100",
          "",
          "print(\"tx:\", n_tx, \"| alamat:\", n_alamat, \"| jalur lengkap:\", n_jalur)",
          "print(\"skor_max:\", round(skor_max, 4))",
          "print(\"fee_rata2_%:\", round(fee_rata2, 3))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari bridge_tx.csv." },
          { kind: "equal", task: "t1", label: "`n_tx` = 222", name: "n_tx", value: 222, msg: "File punya 222 transaksi bridge." },
          { kind: "equal", task: "t1", label: "`n_alamat` = 95", name: "n_alamat", value: 95, msg: "Hitung alamat UNIK (nunique), bukan baris." },
          { kind: "equal", task: "t2", label: "`n_jalur` = 6", name: "n_jalur", value: 6, msg: "Harus tepat 6 jalur lengkap — decoy (jeda 45 mnt / drop 20%) tidak boleh tersambung, noise tidak boleh ikut." },
          { kind: "equal", task: "t3", label: "`skor_max` ≈ 0,7059", name: "skor_max", value: 0.7059, tol: 0.01, msg: "Skor = h / (1 + jeda_rata2); tertinggi = DANA-02 (4 hop, jeda rata-rata 4,67 mnt)." },
          { kind: "equal", task: "t3", label: "`fee_rata2` ≈ 2,03%", name: "fee_rata2", value: 2.027, tol: 0.05, msg: "Rata-rata (jumlah_awal − jumlah_akhir)/jumlah_awal × 100 per jalur lengkap." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 5 · Lab 2 — Jejak ke watchlist",
      title: "Dua alamat yang tidak seharusnya ada",
      prose: [
        "Enam jalur sudah di tangan. Sekarang pertanyaan kepatuhan yang paling tajam: apakah dana-dana ini BERAKHIR di alamat yang ada di watchlist? Tabel `penerima` berisi alamat akhir tiap jalur (dana_id, alamat, rantai_akhir, jumlah_akhir); tabel `watchlist` berisi 12 alamat simulasi. Join keduanya — dan ingat, di dunia nyata hasil join seperti inilah yang memicu STR.",
        "Tabel `penerima(dana_id TEXT, alamat TEXT, rantai_akhir TEXT, jumlah_akhir REAL)`, `watchlist(alamat TEXT, label TEXT, sumber TEXT)`. Tampilkan dana_id, rantai_akhir, jumlah_akhir, dan label — urut berdasarkan dana_id.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query join penerima vs watchlist; tampilkan 4 kolom, urut dana_id" },
      ],
      expected: "2 baris — DANA-02 berakhir di Solana (7,71) cocok SIMULASI-SANKSI-03; DANA-05 berakhir di Avalanche (38,42) cocok SIMULASI-SANKSI-07",
      sqlLab: {
        task: "Alamat akhir mana yang cocok dengan watchlist? Join penerima vs watchlist; tampilkan dana_id, rantai_akhir, jumlah_akhir, label — urut dana_id.",
        schema: "CREATE TABLE penerima (dana_id TEXT, alamat TEXT, rantai_akhir TEXT, jumlah_akhir REAL);\nCREATE TABLE watchlist (alamat TEXT, label TEXT, sumber TEXT);",
        seedData: [
          "INSERT INTO penerima VALUES",
          "('DANA-01','0x3b971722f244f58d669cbee3772a077021721a27','Solana',12.133384),",
          "('DANA-02','0x76eb97706ca828bca0385813dbad3c681d06bd2a','Solana',7.711525),",
          "('DANA-03','0xc462ddaed16dc0cf0b9cd7f78df0cac5e40c02d4','Polygon',24.599993),",
          "('DANA-04','0x9273d7cee9d9136682575250def91799e2786d37','Ethereum',4.73859),",
          "('DANA-05','0x4f14a3e3e04d42f8ac2acaf127972d33e5901a19','Avalanche',38.423514),",
          "('DANA-06','0x3eb8cb37f0a72e9d34119f3374cebd4d3fd81b6e','Ethereum',14.770047);",
          "INSERT INTO watchlist VALUES",
          "('0xd62fb50f3ce234cc352b6a6c37df88cbfcf84e33','SIMULASI-SANKSI-16','SIMULASI'),",
          "('0x76eb97706ca828bca0385813dbad3c681d06bd2a','SIMULASI-SANKSI-03','SIMULASI'),",
          "('0x723a82fd6b299da6dc8e505f6e8d16be4749dda2','SIMULASI-SANKSI-20','SIMULASI'),",
          "('0x5fd49cf3fff51c8fcb9a1014bb0ac3dbbdb17779','SIMULASI-SANKSI-18','SIMULASI'),",
          "('0xd42469fa2c20d8d5e465c9f199fe700489f39d5f','SIMULASI-SANKSI-11','SIMULASI'),",
          "('0x4f14a3e3e04d42f8ac2acaf127972d33e5901a19','SIMULASI-SANKSI-07','SIMULASI'),",
          "('0x4642d320fd16311f38129033665b0248bb572306','SIMULASI-SANKSI-14','SIMULASI'),",
          "('0x8ff740312f05ca4932fe69ff8a01d3ceacee1159','SIMULASI-SANKSI-17','SIMULASI'),",
          "('0xb3b4049bfda5364763de2340fb9b4ea590374479','SIMULASI-SANKSI-13','SIMULASI'),",
          "('0x695036fb5e35bcd67d3a3e34fb912af3c9e9e7d9','SIMULASI-SANKSI-15','SIMULASI'),",
          "('0x7038f2bfd8f3b08514ae4b518bdb19926535aa98','SIMULASI-SANKSI-12','SIMULASI'),",
          "('0x2293a50a1edd80f0acca3f36afa59bd6f269819c','SIMULASI-SANKSI-19','SIMULASI');",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT dana_id, rantai_akhir, jumlah_akhir, label\nFROM penerima\n",
        solution: [
          "SELECT p.dana_id, p.rantai_akhir, p.jumlah_akhir, w.label",
          "FROM penerima p",
          "JOIN watchlist w ON p.alamat = w.alamat",
          "ORDER BY p.dana_id;",
        ].join("\n"),
        expectedColumns: ["dana_id", "rantai_akhir", "jumlah_akhir", "label"],
        expectedRows: [
          ["DANA-02", "Solana", 7.711525, "SIMULASI-SANKSI-03"],
          ["DANA-05", "Avalanche", 38.423514, "SIMULASI-SANKSI-07"],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiGabungJembatanLintas;

// ── lanjutan misiGabungJembatanLintas: langkah 6–13 ─────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_JEMBATAN: V2Step[] = [
  {
    id: "triase",
    eyebrow: "Langkah 6 · Triase risiko",
    title: "Urutkan enam pelari dari yang paling berbahaya",
    prose: [
      "Angka sudah bicara — sekarang beri vonis sementara. Enam jalur, enam skor: DANA-02 (0,7059), DANA-04 (0,5455), DANA-01 (0,4286), DANA-05 (0,4000), DANA-06 (0,4000), DANA-03 (0,2222). Dua di antaranya berakhir di alamat watchlist: DANA-02 dan DANA-05. Skor saja tidak cukup — DANA-05 skornya “hanya” 0,40 tapi nilainya 38,42 unit dan mendarat di alamat yang ditandai; DANA-03 skornya paling rendah tapi tetap pola hop yang disengaja.",
      "Triase yang dipakai unit kepatuhan: TIER-1 (skor ≥ 0,5 ATAU cocok watchlist) = kandidat STR langsung; TIER-2 (skor 0,3–0,5, tanpa watchlist) = pantau diperketat; TIER-3 (skor < 0,3) = catat, tutup sementara. Dengan aturan itu: TIER-1 = DANA-02, DANA-04, DANA-05; TIER-2 = DANA-01, DANA-06; TIER-3 = DANA-03. Tulis alasan tiap penetapan — regulator tidak menerima “feeling”, mereka menerima matriks.",
      "Satu catatan jujur: watchlist di sini SIMULASI. Di dunia nyata, kecocokan watchlist memicu kewajiban lapor yang diatur undang-undang — dan daftarnya (OFAC SDN dkk.) tidak pernah kamu replikasi dari misi latihan.",
    ],
    tasks: [
      { id: "t1", text: "Terapkan aturan tier ke 6 jalur; catat tier tiap DANA-ID beserta alasannya" },
      { id: "t2", text: "Jawab: kenapa DANA-05 masuk TIER-1 walau skornya bukan tertinggi?" },
    ],
    expected:
      "TIER-1: DANA-02 (skor 0,7059 + watchlist), DANA-04 (skor 0,5455), DANA-05 (watchlist + nilai 38,42); TIER-2: DANA-01, DANA-06; TIER-3: DANA-03",
    note: {
      title: "Miskonsepsi #4: skor tertinggi = satu-satunya tersangka",
      type: "risk",
      body: "Skor mengukur KECEPATAN lari, bukan BESARNYA bahaya. DANA-05 berlari “lebih pelan” (skor 0,40) tapi membawa 38,42 unit ke alamat yang ditandai — secara risiko, ia setara atau lebih berbahaya dari DANA-02. Triase yang hanya mengurutkan skor akan meremehkan gajah yang berjalan pelan. Itulah kenapa tier memakai skor ATAU watchlist, bukan skor saja.",
    },
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Lapor, pantau, atau tutup?",
    prose: [
      "Bukti di meja: 6 jalur hop terkonfirmasi, 2 cocok watchlist simulasi, total dana awal 104,29 unit, fee rata-rata 2,03% — angka-angka yang konsisten dengan layering, bukan trading. Head of Compliance memberimu 14 hari, dan hari ini hari ke-12. Tiga opsi di bawah — dan tidak seperti kuis, tidak ada “jawaban benar” yang aman. Yang ada hanya keputusan yang bisa kamu pertahankan dengan bukti — atau tidak.",
      "Peta keputusanmu: STR SEKARANG bila bukti sudah melewati ambang internal (2 tier-1 + kecocokan daftar = ambang umum industri); PANTAU bila kamu yakin pola belum lengkap dan 14 hari cukup menambah bukti tanpa risiko dana kabur; TUTUP hanya bila kamu berani menulis “tidak ada indikasi” dan menandatanganinya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke Head of Compliance? (Keputusan final — seperti STR yang sudah dikirim.)",
      options: [
        {
          id: "opt-str",
          label: "Ajukan STR sekarang untuk 3 jalur TIER-1",
          rationale:
            "2 kecocokan watchlist + 6 jalur hop terkonfirmasi + fee konsisten = pola layering. Menunggu 14 hari berarti memberi waktu dana DANA-05 (38,42 unit) ditarik. Kewajiban melapor tidak menunggu kepastian 100%.",
          nextStepId: "akibat-str",
          consequenceNote:
            "STR diajukan hari ke-12. Regulator meminta data mentah bridge_tx.csv — dan karena rekonstruksimumu terdokumentasi baris per baris, jawabannya siap dalam sehari. Tiga bulan kemudian, satu entitas di jalur DANA-04 muncul di kasus nyata; exchange-mu tercatat sebagai pelapor pertama. Decoy yang tidak kamu laporkan menjadi bukti ketelitian, bukan kecerobohan.",
        },
        {
          id: "opt-pantau",
          label: "Pantau diperketat 14 hari, STR ditunda",
          rationale:
            "Watchlist-nya simulasi dan pola hop saja belum membuktikan asal dana ilegal. 14 hari pantauan bisa menangkap penarikan DANA-05 dan memperkuat bukti sebelum nama exchange tercatat sebagai pelapor.",
          nextStepId: "akibat-pantau",
          consequenceNote:
            "Hari ke-9 pantauan, alamat akhir DANA-05 mengosongkan diri: 38,42 unit ditarik ke mixer dan hilang dari pantauan. Bukti yang kamu tunggu justru pergi selama kamu menunggu. STR akhirnya diajukan — tapi tanpa dana yang bisa dibekukan, nilainya tinggal historis.",
        },
        {
          id: "opt-tutup",
          label: "Tutup kasus — bukti belum cukup untuk STR",
          rationale:
            "Hop lintas rantai itu legal; fee 2% wajar untuk bridge; kecocokan watchlist memakai daftar SIMULASI yang tidak bisa dipakai menuduh. Mengajukan STR atas dasar ini berisiko false positive dan merusak hubungan dengan nasabah legit.",
          nextStepId: "akibat-tutup",
          consequenceNote:
            "Kasus ditutup dengan memo “tidak ada indikasi”. Delapan bulan kemudian, investigasi gabungan regulator menyebut exchange-mu sebagai salah satu pintu masuk dana kasus tersebut — dengan diagram hop yang mirip persis dengan 6 jalurmu. Memo penutupanmu kini dibaca orang lain, dengan spidol merah.",
        },
      ],
    },
  },
  {
    id: "akibat-str",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: STR diajukan",
    prose: [
      "Hari ke-12, STR untuk DANA-02, DANA-04, dan DANA-05 terkirim. Regulator membalas dalam seminggu: minta data mentah + metodologi rekonstruksi. Karena tiap angka di laporanmu bisa ditelusuri ke baris `bridge_tx.csv` (aturan 15 menit, toleransi 3%, skor per jalur), paket tambahan siap dalam sehari — tidak ada malam lembur panik.",
      "Tiga bulan kemudian kabar yang memvalidasi: satu entitas di jalur DANA-04 muncul di kasus pencucian dana nyata, dan exchange-mu tercatat sebagai pelapor pertama. Yang tidak kamu laporkan — dua decoy — justru memperkuat posisimu: menunjukkan kamu membedakan pola dari kebetulan, bukan asal menuduh.",
      "Harga yang dibayar: tim legal menghabiskan dua minggu menjawab follow-up, dan satu nasabah legit yang kebetulan pola bridge-nya mirip sempat terblokir 3 hari (dibuka kembali dengan permintaan maaf). STR bukan vonis — ia permulaan penyelidikan, dan false positive adalah biaya yang diakui sistem.",
    ],
    tasks: [],
    note: {
      title: "STR yang baik = bukti yang bisa diaudit",
      body: "Regulator tidak menilai STR dari keyakinanmu, tapi dari keterlacakan buktinya. “Skor 0,7059 dari rumus S = h/(1+ḡ) dengan ambang 15 menit/3% yang ditetapkan SEBELUM analisis” bisa dipertahankan; “kelihatannya mencurigakan” tidak. Di deliverable-mu nanti, metodologi ditulis sebelum kesimpulan — urutan itu yang membuat laporanmu kuat.",
    },
  },
  {
    id: "akibat-pantau",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: pantau diperketat",
    prose: [
      "Kamu memilih menunggu — keputusan yang masuk akal di atas kertas: bukti lebih kuat, risiko false positive lebih kecil. Sistem pantau ditingkatkan ke mode real-time untuk 6 alamat akhir. Hari ke-4 tenang. Hari ke-9, pukul 03:14: alamat akhir DANA-05 bergerak — 38,42 unit ditarik sekaligus ke sebuah mixer, lalu jejaknya pecah menjadi puluhan alamat kecil.",
      "Bukti yang kamu tunggu pergi tepat selama kamu menunggu. STR akhirnya diajukan juga — tapi sebagai laporan historis atas dana yang sudah tidak bisa dibekukan. Pelajaran yang dibayar 38,42 unit: dalam investigasi dana cepat, waktu BUKAN netral. Setiap hari penundaan adalah hari bagi dana untuk melompat sekali lagi.",
      "Bukan berarti “pantau” selalu salah — untuk DANA-03 (skor 0,22, tanpa watchlist) pantauan adalah keputusan tepat. Kesalahanmu bukan memilih pantau, melainkan menerapkannya ke SEMUA tier termasuk yang sudah melewati ambang lapor.",
    ],
    tasks: [],
    note: {
      title: "Kecepatan dana vs kecepatan birokrasi",
      body: "Dana hop lintas rantai bergerak dalam hitungan menit; siklus keputusan compliance dalam hitungan hari. Kesenjangan itulah yang dieksploitasi. Aturan praktis unit kepatuhan: tier-1 (skor ≥ 0,5 atau cocok daftar) = lapor dulu, lengkapi kemudian; tier-2/3 = pantau. Jangan samakan urgensi semua tier.",
    },
  },
  {
    id: "akibat-tutup",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: kasus ditutup",
    prose: [
      "Memo penutupanmu rapi dan masuk akal: hop lintas rantai itu legal, fee 2% wajar, watchlist-nya simulasi. Head of Compliance menandatanganinya dengan lega — satu kasus beres tanpa drama. Delapan bulan kemudian, drama datang juga: investigasi gabungan regulator merilis diagram aliran dana kasus pencucian besar, dan tiga dari enam jalur di diagram itu sama persis dengan jalur yang kamu tutup.",
      "Memo “tidak ada indikasi”-mu kini dibaca penyidik — dengan spidol merah di paragraf “fee 2% wajar untuk bridge”. Fee yang wajar tidak membuat POLA menjadi wajar: 4 hop dalam 15 menit dengan jumlah nyaris tetap bukanlah perilaku bridge normal, dan kamu tahu itu saat menutup kasus.",
      "Pelajaran termahal misi ini: “belum cukup bukti untuk STR” dan “tidak ada indikasi” adalah dua kalimat yang SAMA SEKALI berbeda. Yang pertama jujur dan menuntut pantauan lanjutan; yang kedua menutup pintu. Kamu menulis yang kedua.",
    ],
    tasks: [],
    note: {
      title: "Menutup kasus adalah keputusan juga",
      body: "Tidak memutuskan = membiarkan status quo — dan status quo di sini berarti dana terus bergerak. Setiap opsi “tutup” yang kamu tulis di kariermu wajib memuat dua hal: (1) ambang apa yang AKAN membukanya kembali (“bila muncul hop ke-5 atau kecocokan daftar resmi, kasus dibuka ulang otomatis”), (2) siapa yang menandatangani risikonya. Tanpa itu, penutupan = penguburan.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 16 baris: laporan “bersih” yang kotor",
    prose: [
      "Sebelum menulis paket bukti, satu misi audit. Di bawah ini 16 baris “Laporan Kepatuhan Triwulan — Klaim: Tidak Ada Temuan Material”, dokumen internal yang sudah ditandatangani SEBELUM investigasimu selesai. Seseorang menyuntikkan 4 sabotase ke dalamnya. Senjatamu: 6 jalur hop, 2 kecocokan watchlist, dan timestamp mentah `bridge_tx.csv`.",
      "Ingat map kedua di meja briefing? Inilah dia. Laporan ini ditulis untuk membuat semua orang tenang — tugasmu memeriksa apakah ketenangan itu berhak.",
    ],
    tasks: [],
    auditDossier: {
      version: "jembatan-capc-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Kepatuhan Triwulan internal yang menyatakan TIDAK ADA temuan material atas aktivitas bridge.",
      columns: ["No", "Bagian laporan", "Isi temuan", "Status"],
      rows: [
        { rowId: 1, cells: { "No": "1", "Bagian laporan": "Cakupan", "Isi temuan": "Semua deposit fiat & on-chain rantai tunggal ditinjau", "Status": "Selesai" }, claims: [{ label: "Cakupan", value: "Lengkap" }] },
        { rowId: 2, cells: { "No": "2", "Bagian laporan": "Metode", "Isi temuan": "Ambang pantau: deposit di atas 50 unit", "Status": "Berlaku" }, claims: [{ label: "Ambang", value: "50 unit" }] },
        { rowId: 3, cells: { "No": "3", "Bagian laporan": "Temuan DANA-01", "Isi temuan": "3 hop lintas rantai — aktivitas bridge normal", "Status": "Bersih" }, claims: [{ label: "Vonis", value: "Bersih" }] },
        { rowId: 4, cells: { "No": "4", "Bagian laporan": "Temuan DANA-02", "Isi temuan": "4 hop lintas rantai — aktivitas bridge normal", "Status": "Bersih" }, claims: [{ label: "Vonis", value: "Bersih" }] },
        { rowId: 5, cells: { "No": "5", "Bagian laporan": "Temuan DANA-03", "Isi temuan": "2 hop lintas rantai — aktivitas bridge normal", "Status": "Bersih" }, claims: [{ label: "Vonis", value: "Bersih" }] },
        { rowId: 6, cells: { "No": "6", "Bagian laporan": "Temuan DANA-04", "Isi temuan": "4 hop lintas rantai — aktivitas bridge normal", "Status": "Bersih" }, claims: [{ label: "Vonis", value: "Bersih" }] },
        { rowId: 7, cells: { "No": "7", "Bagian laporan": "Temuan DANA-05", "Isi temuan": "3 hop lintas rantai — aktivitas bridge normal", "Status": "Bersih" }, claims: [{ label: "Vonis", value: "Bersih" }] },
        { rowId: 8, cells: { "No": "8", "Bagian laporan": "Temuan DANA-06", "Isi temuan": "2 hop lintas rantai — aktivitas bridge normal", "Status": "Bersih" }, claims: [{ label: "Vonis", value: "Bersih" }] },
        // ── I2: entitas ganda (nama diubah sedikit) ──
        { rowId: 9, cells: { "No": "9", "Bagian laporan": "Entitas", "Isi temuan": "NusaPay Ltd — volume 26,4 unit", "Status": "Terverifikasi" }, claims: [{ label: "Entitas", value: "NusaPay Ltd" }] },
        { rowId: 10, cells: { "No": "10", "Bagian laporan": "Entitas", "Isi temuan": "NusaPay LTD. — volume 25,9 unit", "Status": "Terverifikasi" }, claims: [{ label: "Entitas", value: "NusaPay LTD." }] },
        // ── I3: klaim mixer bersih palsu ──
        { rowId: 11, cells: { "No": "11", "Bagian laporan": "Mixer", "Isi temuan": "Mixer X terverifikasi bersih oleh auditor internal", "Status": "Bersih" }, claims: [{ label: "Verifikasi", value: "Auditor internal" }] },
        // ── I1: bridge dikecualikan dari cakupan ──
        { rowId: 12, cells: { "No": "12", "Bagian laporan": "Cakupan", "Isi temuan": "Transaksi bridge antar-rantai dikecualikan dari cakupan triwulan ini", "Status": "Disetujui" }, claims: [{ label: "Pengecualian", value: "Disetujui" }] },
        // ── I4: window cherry-picked ──
        { rowId: 13, cells: { "No": "13", "Bagian laporan": "Periode", "Isi temuan": "Periode analisis: 2026-09-06 s.d. 2026-09-10", "Status": "Final" }, claims: [{ label: "Periode", value: "2026-09-06 s.d. 2026-09-10" }] },
        { rowId: 14, cells: { "No": "14", "Bagian laporan": "Watchlist", "Isi temuan": "0 alamat cocok dengan watchlist", "Status": "Bersih" }, claims: [{ label: "Kecocokan", value: "0" }] },
        { rowId: 15, cells: { "No": "15", "Bagian laporan": "Kesimpulan", "Isi temuan": "Tidak ada temuan material", "Status": "Final" }, claims: [{ label: "Kesimpulan", value: "Tidak ada temuan" }] },
        { rowId: 16, cells: { "No": "16", "Bagian laporan": "Rekomendasi", "Isi temuan": "Tidak ada STR diajukan", "Status": "Disetujui" }, claims: [{ label: "Rekomendasi", value: "Tidak ada STR" }] },
      ],
      injections: [
        { key: "cakupan-dikecualikan", rowIds: [12], title: "Transaksi bridge dikecualikan dari cakupan", clue: "Baris 12 mengeluarkan transaksi bridge antar-rantai dari cakupan — padahal 100% pola mencurigakan (6 jalur hop) terjadi PERSIS di transaksi bridge. Ini seperti memeriksa brankas sambil membiarkan pintu belakang terbuka.", danger: "Cakupan yang memotong tepat di tempat kejahatan terjadi membuat seluruh “tidak ada temuan” menjadi kesimpulan yang dirancang, bukan ditemukan. Regulator membaca pengecualian cakupan sebagai red flag pertama." },
        { key: "entitas-ganda", rowIds: [9, 10], title: "Nama entitas diubah sedikit = volume terpecah", clue: "Baris 9 “NusaPay Ltd” (26,4) vs baris 10 “NusaPay LTD.” (25,9) — beda satu titik. Digabung = 52,3 unit, MELEWATI ambang pantau 50 unit di baris 2. Terpecah = dua-duanya “di bawah ambang”.", danger: "Duplikat nyaris-identik adalah cara termurah menghindari ambang: tanpa normalisasi nama + agregasi, semua ambang volume bisa diakali dengan tanda baca. Obatnya semurah di misi DBD: kunci entitas unik." },
        { key: "mixer-bersih-palsu", rowIds: [11], title: "Klaim “mixer terverifikasi bersih” tanpa bukti", clue: "Baris 11 mengklaim Mixer X “terverifikasi bersih oleh auditor internal” — tanpa nama auditor, tanpa tanggal, tanpa nomor laporan. Klaim verifikasi tanpa artefak verifikasi = opini yang menyamar sebagai fakta.", danger: "Di kasus nyata, mixer “bersih” versi auditor internal adalah oksimoron — mixer yang sama dipakai semua orang, termasuk pelaku. Klaim seperti ini, bila diteruskan ke regulator tanpa bukti, menjadi misrepresentasi." },
        { key: "window-cherry-picked", rowIds: [13], title: "Periode analisis cherry-picked", clue: "Baris 13 memakai periode 2026-09-06 s.d. 2026-09-10 — tetapi keenam jalur hop di bridge_tx.csv terjadi 2026-09-01 s.d. 2026-09-02. Jendela analisis digeser tepat melewati semua kejadian.", danger: "Cherry-picking periode adalah sabotase analitik paling elegan: semua angka di dalam jendela benar, kesimpulannya salah total. Selalu cocokkan jendela analisis dengan sebaran timestamp data mentah." },
      ],
    },
  },
  {
    id: "minicase",
    eyebrow: "Langkah 10 · Mini-case",
    title: "38,42 unit dalam 22 menit",
    prose: [
      "Kasus konkret untuk mengasah penilaianmu. DANA-05: mulai 40,00 unit di Solana, tiga hop (Solana → Ethereum → Arbitrum → Avalanche), jeda 7, 6, 9 menit — total 22 menit dari awal sampai akhir — mendarat 38,42 unit di alamat yang cocok watchlist simulasi. Fee total 1,58 unit (3,95%): mahal untuk “bridge normal”, murah untuk menghilangkan jejak 40 unit.",
      "Bandingkan dengan DANA-03: 25,00 → 24,60 dalam 17 menit, 2 hop, skor 0,2222, tanpa kecocokan daftar. Polanya sama (hop cepat, jumlah dipertahankan) tapi intensitasnya beda jauh. Di sinilah triase bekerja: pola yang sama, vonis yang berbeda — karena risiko = pola × intensitas × konteks.",
      "Hitung eksposur kasar: total dana awal keenam jalur = 104,29 unit. Bila 1 unit = Rp 1 miliar (asumsi misi), eksposur = Rp 104,29 miliar. Biaya investigasi penuh (2 analis × 2 minggu) ≈ Rp 120 juta — 0,1% dari eksposur. Denda regulator untuk kegagalan melapor di yurisdiksi nyata bisa mencapai 10% omzet. Matematika kepatuhan jarang berpihak pada “tutup kasus”.",
    ],
    tasks: [
      { id: "t1", text: "Hitung fee % DANA-05 dari 40,00 ke 38,42 — bandingkan dengan fee_rata2 2,03%" },
      { id: "t2", text: "Tulis argumen satu paragraf: kenapa DANA-05 layak STR walau skornya bukan tertinggi" },
    ],
    expected:
      "Fee DANA-05 = 3,95% (di atas rata-rata 2,03%) — urgensi pindah cepat mengalahkan efisiensi biaya, ciri khas layering; argumen STR: watchlist + nilai terbesar + pola hop disengaja",
    note: {
      title: "Miskonsepsi #5: pelaku selalu meminimalkan fee",
      type: "pitfall",
      body: "Logika trader: fee sekecil mungkin. Logika pelaku layering: KECEPATAN sepenting mungkin — fee 3,95% adalah harga yang wajar untuk memutus jejak 40 unit dalam 22 menit. Fee TINGGI pada hop cepat justru memperkuat indikasi, bukan melemahkannya. Jangan nilai pelaku dengan logika korban.",
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 11 · Deliverable",
    title: "Paket bukti siap-serah compliance",
    prose: [
      "Semua bukti di tangan, semua sabotase terungkap. Tulis paket bukti siap-serah ke regulator — artefak portofoliomu sebagai investigator blockchain. Paket yang baik membuat penyidik bisa mereproduksi temuanmu dari data mentah tanpa meneleponmu — dan jujur tentang apa yang TIDAK bisa dibuktikan.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): berapa jalur hop terkonfirmasi, berapa cocok watchlist, rekomendasi STR untuk jalur mana.",
        "Metodologi rekonstruksi: aturan 3 validasi hop (rantai sambung, jeda ≤ 15 mnt, drop ≤ 3%), rumus skor S = h/(1+ḡ), ambang tier — ditulis SEBELUM hasil, agar terlihat ditetapkan di muka.",
        "Tabel bukti 6 jalur: DANA-ID, rute rantai, hop, jeda rata-rata, skor, jumlah awal→akhir, tier, status watchlist.",
        "Temuan audit laporan internal: 4 sabotase dengan nomor baris (cakupan dikecualikan, entitas ganda, klaim mixer palsu, window cherry-picked).",
        "Rekomendasi: STR untuk DANA-02/04/05 (rujuk keputusan Langkah 7), pantau untuk DANA-01/06, catat-tutup-sementara DANA-03 + ambang pembuka-ulang.",
        "Batas & disclaimer: watchlist 100% SIMULASI (bukan dasar tuduhan sanksi); pola_mixing turunan dari satu fitur; hop cepat = indikasi layering, bukan bukti asal dana ilegal; decoy tidak dilaporkan beserta alasannya.",
      ],
      rubric: [
        { criterion: "Kebenaran rekonstruksi", weight: 30, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "6 jalur, skor_max 0,7059, fee 2,03%, 2 kecocokan watchlist — semua tepat & tertelusur ke baris data"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris 9–13 dan penjelasan mekanismenya"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa tier/ambang", "Ada rekomendasi, tier kabur", "STR/pantau/tutup dipetakan per tier dengan ambang pembuka-ulang eksplisit"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim bukti = vonis bersalah", "Menyebut sebagian batas", "Disclaimer simulasi, indikasi-vs-bukti, dan alasan decoy dikecualikan dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 12 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan kepatuhan internal:",
      "1) **Cakupan dikecualikan** (baris 12): transaksi bridge antar-rantai dikeluarkan dari cakupan triwulan — padahal seluruh pola mencurigakan hidup di sana. “Tidak ada temuan” yang dirancang lewat definisi cakupan bukanlah temuan, melainkan keputusan yang disamarkan.",
      "2) **Entitas ganda** (baris 9–10): “NusaPay Ltd” 26,4 vs “NusaPay LTD.” 25,9 — satu titik memecah 52,3 unit menjadi dua baris di bawah ambang 50. Klasik, dan obatnya semurah di misi DBD: normalisasi + kunci unik entitas.",
      "3) **Klaim mixer bersih palsu** (baris 11): “terverifikasi bersih oleh auditor internal” tanpa nama, tanggal, atau nomor laporan. Verifikasi tanpa artefak = opini berkostum fakta.",
      "4) **Window cherry-picked** (baris 13): periode 2026-09-06–10, sedangkan keenam jalur hop terjadi 2026-09-01–02. Jendela yang digeser tepat melewati kejadian — semua angka di dalamnya benar, kesimpulannya salah.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim laporan terhadap data mentah, atau memercayai stempel “kepatuhan”. Dan ingat keputusan bercabangmu: STR, pantau, tutup — ketiganya punya harga, dan harga termahal adalah menutup kasus dengan kalimat “tidak ada indikasi” padahal yang benar “belum cukup bukti”.",
      "Bahaya nyata terakhir: bridge-hopping adalah layering versi modern — murah, cepat, dan mengeksploitasi celah antar-kamera blockchain. Exchange yang mengecualikan bridge dari cakupannya tidak sedang menghemat biaya audit; ia sedang membutakan dirinya sendiri di pintu tempat dana kotor masuk.",
    ],
    tasks: [],
    note: {
      title: "Indikasi bukan vonis — tapi juga bukan alasan diam",
      type: "risk",
      body: "Pola hop cepat = indikasi layering, BUKAN bukti dana ilegal. STR bukan vonis bersalah — ia mekanisme resmi untuk memindahkan kecurigaan berdasar-bukti ke pihak yang berwenang menyelidiki. Investigator yang baik hidup di tengah: tidak menuduh tanpa bukti, tidak diam saat bukti ada.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 13 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Rekonstruksi hop: 222 tx → 6 jalur lengkap (aturan: rantai sambung, jeda ≤ 15 mnt, drop ≤ 3%); skor S = h/(1+ḡ) tertinggi 0,7059 (DANA-02); fee rata-rata 2,03%; 2 decoy gagal tersambung dengan benar.",
      "Join watchlist (SIMULASI): DANA-02 → Solana 7,71 (SIMULASI-SANKSI-03) dan DANA-05 → Avalanche 38,42 (SIMULASI-SANKSI-07) — 2 dari 6 jalur.",
      "Triase: TIER-1 = DANA-02/04/05 (skor ≥ 0,5 ATAU cocok daftar); risiko = pola × intensitas × konteks, bukan skor saja.",
      "Empat sabotase laporan: bridge dikecualikan dari cakupan, entitas ganda (“NusaPay Ltd” vs “NusaPay LTD.”, gabungan 52,3 > ambang 50), klaim mixer bersih tanpa artefak, window 2026-09-06–10 yang melewatkan kejadian 2026-09-01–02.",
      "Keputusan STR/pantau/tutup semuanya punya harga; “belum cukup bukti” ≠ “tidak ada indikasi” — dan setiap penutupan wajib punya ambang pembuka-ulang.",
      "Data: slice BitcoinHeist 320 alamat (UCI ML Repository, CC BY 4.0, DOI 10.24432/C5BG8V) + bridge_tx.csv & watchlist.csv 100% sintetis (seed 42); watchlist simulasi bukan dasar tuduhan sanksi.",
    ],
  },
];

(misiGabungJembatanLintas.steps as V2Step[]).push(...LANJUTAN_JEMBATAN);
