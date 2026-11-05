import type { V2Mission } from "../lib/types";

// ── MISI ORAKEL BUTA ─────────────────────────────────────────────────────
// M1 DATA-SAINTEK — Blockchain Data Scientist Misi B ("edge").
// Beda dari pilot misi-jejak-dana-blockchain (mengikuti ALIRAN DANA satu
// kasus ransomware: taint, hop, mixer): misi ini tentang ENTITY CLUSTERING
// dan FALSE-POSITIVE ORAKEL — memakai BitcoinHeist (UCI, CC BY 4.0, 2016–2017,
// era Locky/Cerber) + daftar sanksi OFAC (public domain, pin 2026-10-15).
// Sudut: 21 alamat sanksi SEMUANYA berlabel "white"; 9 signature perilaku
// dipakai bersama alamat ransomware; clustering naif = 5.141 false positive.
// 4 injeksi di entitas_audit.csv: label tamper, income×10, duplikat hantu,
// supresi orakel. File: public/misi/misi-orakel-buta-blockchain/ + METODE.md.

const BASE = "/misi/misi-orakel-buta-blockchain";

export const misiOrakelButa: V2Mission = {
  slug: "misi-orakel-buta-blockchain",
  track: "Blockchain Data Scientist",
  module: "Misi",
  title: "Misi Orakel Buta: Daftar Sanksi vs Label 'Bersih'",
  estMinutes: 150,
  role: "Analis AML / blockchain forensics di bursa kripto",
  client:
    "Kepala kepatuhan — bursa menerima daftar sanksi OFAC terbaru; model screening entitas harus divalidasi sebelum daftar itu dipakai memblokir alamat",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "21 alamat sanksi, semuanya berlabel 'bersih'",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis AML / blockchain forensics di sebuah bursa kripto",
        client:
          "Kepala kepatuhan. Bursa baru menerima daftar sanksi OFAC (kantor pengendalian aset asing AS) — daftar alamat kripto milik entitas yang disanksi. Sebelum daftar itu dipakai untuk memblokir alamat secara otomatis, model screening entitas bursa harus divalidasi: dataset historis 22.738 entitas Bitcoin (2011–2018, era ransomware Locky/Cerber) sudah berlabel per keluarga ransomware vs 'white' (bersih). Tugasmu: silangkan daftar sanksi dengan dataset, ukur seberapa berbahayanya clustering naif, dan putuskan kebijakan pemblokiran.",
        story: [
          "Kamis, 09:40. Kamu menyilangkan 21 alamat Bitcoin dari daftar sanksi OFAC dengan dataset entitas — dan hasilnya membuatmu berhenti mengetik. Ke-21 alamat sanksi itu ada di dataset. Semuanya berlabel... `white`. Bersih. Nol yang berlabel ransomware.",
          "Lalu kamu memeriksa 'sidik jari perilaku' — signature (length, count, looped, neighbors) tiap alamat. 9 dari 16 signature milik alamat sanksi TERNYATA juga dipakai oleh alamat-alamat ransomware. Dan signature paling umum di antara alamat sanksi dipakai oleh 1.729 alamat lain. Kalau bursa memblokir 'semua alamat yang perilakunya mirip alamat sanksi' — seperti yang diusulkan tim produk — 5.162 alamat akan dibekukan. Hanya 21 yang benar-benar disanksi.",
          "Ini bukan misi mengejar penjahat. Ini misi tentang orakel yang buta: label 'white' yang salah, daftar sanksi dari tahun 2026 yang dipakai menilai data 2011–2018, dan clustering yang terlihat cerdas tapi memproduksi 5.141 false positive. Keputusanmu menentukan apakah bursa memblokir ribuan nasabah tak bersalah — atau membiarkan alamat sanksi lolos.",
        ],
        objectives: [
          "Menyilangkan daftar sanksi OFAC dengan dataset entitas dan mengukur anomali label (21 alamat sanksi berlabel 'white').",
          "Mengukur bahaya clustering naif: berapa alamat ikut terblokir bila memblokir berdasarkan kemiripan signature.",
          "Menemukan 4 sabotase di salinan audit (label tamper, income ×10, duplikat hantu, supresi orakel).",
          "Memutuskan kebijakan pemblokiran dengan trade-off presisi vs recall yang eksplisit + memo kepatuhan.",
        ],
        prereqSummary:
          "Address clustering = mengelompokkan alamat kripto berdasarkan pola perilaku (di sini: signature 4 fitur — length, count, looped, neighbors) untuk menebak alamat mana milik entitas yang sama/serupa. False positive = alamat bersih yang salah dituduh jahat; dalam kepatuhan, satu false positive = nasabah sah yang dananya dibekukan. Oracle problem = label/daftar acuan (seperti daftar sanksi) diperlakukan sebagai kebenaran absolut, padahal ia bisa kedaluwarsa, tidak lengkap, atau salah konteks waktu.",
        datasetNote:
          "Sumber: BitcoinHeist Ransomware Addresses Dataset (UCI ML Repository, CC BY 4.0) — 22.738 entitas, tahun 2011–2018, label keluarga ransomware (Locky/Cerber/...) vs 'white'. Oracle: daftar sanksi OFAC (public domain), cabang 'lists', pin 2026-10-15 — 21 alamat XBT cocok.\nFile entitas.csv = bersih (kolom is_sanctioned = hasil silang jujur). File entitas_audit.csv = salinan yang diaudit — SENGAJA dikotori (label diganti, income dikali 10, duplikat hantu, 2 alamat sanksi disembunyikan dari kolom is_sanctioned). Detail: METODE.md — jangan dibaca dulu.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali orakelmu sebelum memercayainya",
      prose: [
        "Tiga file. `entitas.csv`: 22.738 baris (address, year, length, weight, count, looped, neighbors, income dalam satoshi, label, is_sanctioned). `ofac_sanctioned_xbt.txt`: 532 alamat XBT dari daftar sanksi OFAC (daftar ASLI cabang 'lists', pin 2026-10-15; 21 di antaranya cocok dengan dataset). `entitas_audit.csv`: 22.742 baris — salinan yang diklaim 'sudah diperbarui dengan daftar sanksi terbaru'.",
        "Empat sabotase menunggumu di file audit: (1) label ransomware yang diganti jadi 'white'; (2) income yang dikali 10; (3) alamat hantu — baris duplikat dengan label BERBEDA; (4) dua alamat sanksi yang DIHILANGKAN dari kolom is_sanctioned (supresi orakel).",
        "Aturan main: (1) baseline HANYA dari file bersih; (2) daftar sanksi adalah orakel — ia memberi tahu 'siapa yang disanksi', bukan 'siapa yang jahat' (daftar 2026 dipakai menilai data 2011–2018: mismatch waktu yang nyata); (3) setiap klaim pemblokiran wajib menyebut angka false positive-nya.",
      ],
      tasks: [
        { id: "t1", text: "Buka `entitas.csv`: berapa distribusi label (white vs keluarga ransomware)" },
        { id: "t2", text: "Buka `ofac_sanctioned_xbt.txt`: berapa alamat, dan formatnya" },
      ],
      note: {
        title: "Miskonsepsi #1: daftar sanksi = daftar penjahat",
        type: "pitfall",
        body: "Daftar sanksi OFAC adalah INSTRUMEN KEBIJAKAN — ia mendaftar entitas yang disanksi pemerintah AS pada tanggal tertentu, bukan 'semua alamat jahat di dunia'. Alamat yang TIDAK ada di daftar bukan berarti bersih; alamat yang ADA di daftar 2026 belum tentu sudah disanksi pada 2016 (tahun datanya). Memakai orakel tanpa memahami konteks waktunya adalah cara tercepat memproduksi keputusan yang salah dengan penuh percaya diri.",
      },
      reference:
        "entitas.csv (22.738, bersih) + ofac_sanctioned_xbt.txt (21 alamat, pin 2026-10-15) vs entitas_audit.csv (22.742, 4 sabotase).",
    },
    {
      id: "lab-fingerprint",
      eyebrow: "Langkah 3 · Lab 1 — Silangkan orakel",
      title: "21 alamat sanksi: apa kata label dan perilakunya?",
      prose: [
        "Langkah pertama forensik yang jujur: silangkan daftar sanksi dengan dataset, lalu TANYAKAN apa yang dikatakan data — bukan apa yang kamu harapkan. Berapa alamat sanksi yang ada di dataset? Apa label mereka? Bagaimana distribusi income mereka dibanding populasi? Dan yang paling penting: apakah 'sidik jari perilaku' (signature) mereka unik — atau dipakai bersama ribuan alamat lain?",
        "Signature di sini = tuple (length, count, looped, neighbors): 4 fitur struktural transaksi. Kalau signature alamat sanksi juga dipakai alamat ransomware, maka 'mirip perilakunya' bukan bukti apa-apa.",
      ],
      tasks: [
        { id: "t1", text: "Muat entitas.csv + ofac_sanctioned_xbt.txt; tandai baris yang alamatnya ada di daftar sanksi" },
        { id: "t2", text: "Hitung: `n_sanctioned` (baris sanksi), `n_sanctioned_white` (yang berlabel white), `median_income_san` (median income baris sanksi)" },
        { id: "t3", text: "Hitung `n_shared_sigs`: berapa signature milik alamat sanksi yang JUGA dipakai oleh minimal satu baris ransomware (label != 'white')" },
      ],
      expected:
        "n_sanctioned=21, n_sanctioned_white=21 (100%!), median_income_san=850000000, n_shared_sigs=9",
      note: {
        title: "Miskonsepsi #2: label dataset = kebenaran",
        type: "pitfall",
        body: "Label 'white' di dataset ini berarti 'tidak teridentifikasi sebagai ransomware dalam studi aslinya' — BUKAN 'terbukti bersih oleh investigator'. Ketika orakel eksternal (OFAC) berkata 21 alamat 'white' sebenarnya disanksi, yang rusak adalah LABELNYA, bukan orakelnya. Pelajaran umum: label dataset selalu membawa asumsi pembuatnya; silangkan dengan sumber independen sebelum memercayainya.",
      },
      hints: [
        "Muat daftar sanksi: `pd.read_csv(open_url(BASE + \"/ofac_sanctioned_xbt.txt\"), header=None)[0].tolist()` (532 alamat).",
        "Tandai: `e['sanctioned'] = e['address'].isin(daftar)`.",
        "Signature: tuple dari kolom length, count, looped, neighbors; bandingkan himpunan signature baris sanksi vs baris ransomware.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-orakel-buta-blockchain\"",
          "e = pd.read_csv(open_url(BASE + \"/entitas.csv\"))",
          "ofac = pd.read_csv(open_url(BASE + \"/ofac_sanctioned_xbt.txt\"), header=None)[0].tolist()",
          "",
          "e[\"sanctioned\"] = e[\"address\"].isin(ofac)",
          "san = e[e[\"sanctioned\"]]",
          "",
          "n_sanctioned = ...            # int",
          "n_sanctioned_white = ...      # int: yang berlabel 'white'",
          "median_income_san = ...       # int: median income baris sanksi",
          "",
          "SIG = [\"length\", \"count\", \"looped\", \"neighbors\"]",
          "sig_san = ...                 # set signature baris sanksi",
          "sig_ran = ...                 # set signature baris ransomware (label != 'white')",
          "n_shared_sigs = ...           # int: irisan keduanya",
          "",
          "print(\"sanctioned:\", n_sanctioned, \"| white:\", n_sanctioned_white)",
          "print(\"median income:\", median_income_san)",
          "print(\"shared sigs:\", n_shared_sigs)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-orakel-buta-blockchain\"",
          "e = pd.read_csv(open_url(BASE + \"/entitas.csv\"))",
          "ofac = pd.read_csv(open_url(BASE + \"/ofac_sanctioned_xbt.txt\"), header=None)[0].tolist()",
          "",
          "e[\"sanctioned\"] = e[\"address\"].isin(ofac)",
          "san = e[e[\"sanctioned\"]]",
          "",
          "n_sanctioned = int(san.shape[0])",
          "n_sanctioned_white = int((san[\"label\"] == \"white\").sum())",
          "median_income_san = int(san[\"income\"].median())",
          "",
          "SIG = [\"length\", \"count\", \"looped\", \"neighbors\"]",
          "sig_san = set(map(tuple, san[SIG].values))",
          "sig_ran = set(map(tuple, e[e[\"label\"] != \"white\"][SIG].values))",
          "n_shared_sigs = len(sig_san & sig_ran)",
          "",
          "print(\"sanctioned:\", n_sanctioned, \"| white:\", n_sanctioned_white)",
          "print(\"median income:\", median_income_san)",
          "print(\"shared sigs:\", n_shared_sigs)",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t2", label: "`n_sanctioned` = 21", name: "n_sanctioned", value: 21, msg: "21 alamat sanksi OFAC ada di dataset." },
          { kind: "equal", task: "t2", label: "`n_sanctioned_white` = 21", name: "n_sanctioned_white", value: 21, msg: "100% alamat sanksi berlabel 'white' — label dataset-nya yang salah, bukan orakelnya." },
          { kind: "equal", task: "t2", label: "`median_income_san` = 850000000", name: "median_income_san", value: 850000000, tol: 1, msg: "Median income baris sanksi = 850.000.000 satoshi (8,5 BTC)." },
          { kind: "equal", task: "t3", label: "`n_shared_sigs` = 9", name: "n_shared_sigs", value: 9, msg: "9 signature dipakai bersama alamat sanksi dan alamat ransomware — 'mirip perilakunya' bukan bukti." },
        ],
      },
    },
    {
      id: "lab-false-positive",
      eyebrow: "Langkah 4 · Lab 2 — Simulasi clustering naif",
      title: "Blokir semua yang 'mirip': berapa yang ikut jadi korban?",
      prose: [
        "Tim produk mengusulkan: 'Blokir otomatis semua alamat yang signature-nya cocok dengan alamat sanksi.' Kedengarannya cerdas — perilaku mirip = risiko mirip. Tugasmu: SIMULASIKAN sebelum disetujui. Tandai setiap baris yang signature-nya cocok dengan minimal satu alamat sanksi, lalu hitung: berapa yang benar-benar disanksi, dan berapa yang bukan?",
        "Inilah jantung misi ini: precision vs recall dalam kepatuhan. Recall 100% (semua 21 tertangkap) tidak ada artinya bila harganya ribuan false positive.",
      ],
      tasks: [
        { id: "t1", text: "Tandai `flagged` = baris yang signature-nya ada di himpunan signature sanksi; hitung `n_flagged`" },
        { id: "t2", text: "Hitung `n_true` (flagged yang memang sanctioned) dan `n_fp` = n_flagged − n_true; simpulkan" },
      ],
      expected:
        "n_flagged=5162, n_true=21, n_fp=5141 — false positive 99,6%",
      note: {
        title: "Angka yang harus menghentikan rapat",
        type: "risk",
        body: "5.162 alamat diblokir, 21 yang benar — 5.141 nasabah/entitas tak bersalah dananya dibekukan (termasuk ratusan berlabel 'white' dan ribuan yang memang ransomware tapi TIDAK disanksi — memblokir mereka atas dasar 'sanksi' adalah dasar hukum yang salah). Di dunia nyata, satu false positive pemblokiran bisa berarti gugatan, liputan media, dan denda regulator. 'Recall 100%' adalah kalimat pemasaran; '5.141 korban' adalah realitanya.",
      },
      hints: [
        "Gunakan kolom `sanctioned` dan himpunan `sig_san` dari Lab 1 (hitung ulang di sel ini — tiap lab mandiri).",
        "`flagged = e[e[SIG].apply(tuple, axis=1).isin(sig_san)]`.",
        "n_fp = n_flagged − n_true; false positive rate = n_fp / n_flagged.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-orakel-buta-blockchain\"",
          "e = pd.read_csv(open_url(BASE + \"/entitas.csv\"))",
          "ofac = pd.read_csv(open_url(BASE + \"/ofac_sanctioned_xbt.txt\"), header=None)[0].tolist()",
          "e[\"sanctioned\"] = e[\"address\"].isin(ofac)",
          "SIG = [\"length\", \"count\", \"looped\", \"neighbors\"]",
          "sig_san = set(map(tuple, e[e[\"sanctioned\"]][SIG].values))",
          "",
          "flagged = ...   # DataFrame baris yang signature-nya cocok signature sanksi",
          "n_flagged = ... # int",
          "n_true = ...    # int: flagged yang memang sanctioned",
          "n_fp = ...      # int",
          "",
          "print(\"flagged:\", n_flagged, \"| true:\", n_true, \"| false positive:\", n_fp)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-orakel-buta-blockchain\"",
          "e = pd.read_csv(open_url(BASE + \"/entitas.csv\"))",
          "ofac = pd.read_csv(open_url(BASE + \"/ofac_sanctioned_xbt.txt\"), header=None)[0].tolist()",
          "e[\"sanctioned\"] = e[\"address\"].isin(ofac)",
          "SIG = [\"length\", \"count\", \"looped\", \"neighbors\"]",
          "sig_san = set(map(tuple, e[e[\"sanctioned\"]][SIG].values))",
          "",
          "flagged = e[e[SIG].apply(tuple, axis=1).isin(sig_san)]",
          "n_flagged = int(flagged.shape[0])",
          "n_true = int(flagged[\"sanctioned\"].sum())",
          "n_fp = n_flagged - n_true",
          "",
          "print(\"flagged:\", n_flagged, \"| true:\", n_true, \"| false positive:\", n_fp)",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t1", label: "`n_flagged` = 5162", name: "n_flagged", value: 5162, msg: "Clustering naif menandai 5.162 alamat." },
          { kind: "equal", task: "t2", label: "`n_true` = 21", name: "n_true", value: 21, msg: "Hanya 21 yang benar-benar disanksi (recall 100%)." },
          { kind: "equal", task: "t2", label: "`n_fp` = 5141", name: "n_fp", value: 5141, msg: "5.141 false positive — 99,6% yang diblokir tidak bersalah. Usulan tim produk DITOLAK." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 5 · Lab 3 — Alamat hantu",
      title: "Satu alamat, dua label: siapa yang berbohong?",
      prose: [
        "File audit (`entitas_audit.csv`) diklaim 'sudah diperbarui dengan daftar sanksi terbaru' — 22.742 baris, 4 lebih banyak dari file bersih. Di dunia nyata, baris duplikat dengan label BERBEDA adalah tanda klasik dua sumber yang digabung tanpa deduplikasi — atau seseorang yang menyuntikkan baris.",
        "Tabel `audit(address, label, income, is_sanctioned)`. Temukan alamat yang muncul lebih dari sekali DENGAN label berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query yang mengembalikan alamat dengan >1 label berbeda (tampilkan address dan jumlah label berbeda)" },
      ],
      expected: "4 alamat, masing-masing 2 label (princetonLocky + white)",
      sqlLab: {
        task: "Temukan alamat hantu: alamat yang muncul dengan lebih dari satu label berbeda di file audit.",
        schema: "CREATE TABLE audit (address TEXT, label TEXT, income REAL, is_sanctioned INTEGER);",
        seedData: [
          "INSERT INTO audit VALUES",
          "('1123pJv8jzeFQaCV4w644pzQJzVWay2zcA', 'white', 100000000.0, 0),",
          "('112GocBgFSnaote6krx828qaockFraD8mp', 'princetonLocky', 50000000.0, 0),",
          "('112GocBgFSnaote6krx828qaockFraD8mp', 'white', 50000000.0, 0),",
          "('112wjYgWapZU8gTPR7hLoKq8iEh496vKxP', 'princetonLocky', 550000000.0, 0),",
          "('112wjYgWapZU8gTPR7hLoKq8iEh496vKxP', 'white', 550000000.0, 0),",
          "('1131P1hjj7h9NinHRCkNwGFifK4gGoe5EF', 'princetonLocky', 500000000.0, 0),",
          "('1131P1hjj7h9NinHRCkNwGFifK4gGoe5EF', 'white', 500000000.0, 0),",
          "('1136MFiqBmoVWpqWr1okF3D5XMabwVLB5z', 'princetonLocky', 101000000.0, 0),",
          "('1136MFiqBmoVWpqWr1okF3D5XMabwVLB5z', 'white', 101000000.0, 0),",
          "('149w62rY42aZBox8fGcmqNsXUzSStKeq8C', 'white', 362849420.0, 0);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT address\nFROM audit\n",
        solution: [
          "SELECT address, COUNT(DISTINCT label) AS n_labels",
          "FROM audit",
          "GROUP BY address",
          "HAVING COUNT(DISTINCT label) > 1;",
        ].join("\n"),
        expectedColumns: ["address", "n_labels"],
        expectedRows: [
          ["112GocBgFSnaote6krx828qaockFraD8mp", 2],
          ["112wjYgWapZU8gTPR7hLoKq8iEh496vKxP", 2],
          ["1131P1hjj7h9NinHRCkNwGFifK4gGoe5EF", 2],
          ["1136MFiqBmoVWpqWr1okF3D5XMabwVLB5z", 2],
        ],
      },
    },
  ],
};

export default misiOrakelButa;

// ── lanjutan: kuis, keputusan + 3 cabang, audit, deliverable, debrief, rangkuman
import type { V2Step } from "../lib/types";

const LANJUTAN_ORAKEL: V2Step[] = [
  {
    id: "kuis-orakel",
    eyebrow: "Langkah 6 · Kuis konsep",
    title: "Orakel dari masa depan",
    prose: [
      "Fakta yang tidak bisa dihindari: dataset entitas mencakup 2011–2018, sedangkan daftar sanksi OFAC yang kamu pakai dipin tanggal 2026-10-15. Alamat yang disanksi pada 2024 mungkin pada 2016 adalah alamat biasa yang belum melakukan apa-apa. Sebaliknya, penjahat 2016 yang tidak pernah disanksi tidak akan pernah muncul di daftar.",
    ],
    tasks: [],
    quiz: [
      {
        q: "Apa implikasi jujur dari mismatch waktu (data 2011–2018 vs daftar sanksi 2026) untuk kebijakan pemblokiran?",
        options: [
          {
            text: "Daftar sanksi tidak bisa dipakai sebagai label 'jahat' untuk data historis — ia hanya valid untuk screening transaksi saat ini dan ke depan",
            why: "Benar. Daftar sanksi adalah pernyataan kebijakan pada tanggal tertentu — ia menjawab 'siapa yang dilarang BERURUSAN SEKARANG', bukan 'siapa yang jahat pada 2016'. Memakainya untuk memberi label data historis adalah anakronisme: kamu menghakimi masa lalu dengan keputusan masa depan. Untuk screening live ia sah; untuk melatih model atas data 2016, ia bias.",
            correct: true,
          },
          {
            text: "Tidak ada implikasi — alamat yang disanksi pasti sudah jahat sejak 2011",
            why: "Salah arah waktu. Sanksi dijatuhkan karena peristiwa pada tanggal sanksi — mengasumsikan kejahatan sejak 2011 adalah spekulasi tanpa bukti, dan justru inilah cara false positive 'terlihat benar'.",
          },
          {
            text: "Solusinya membuang daftar sanksi dan hanya memakai label dataset",
            why: "Salah — membuang orakel bukan jawabannya. Daftar sanksi tetap ground truth terbaik untuk KEPATUHAN saat ini; yang harus dibuang adalah penggunaannya yang anakronistik sebagai label historis.",
          },
        ],
      },
    ],
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Kebijakan pemblokiran: apa yang kamu tanda tangani?",
    prose: [
      "Kepala kepatuhan butuh keputusan hari ini. Tiga opsi di atas meja — masing-masing dengan korban dan risikonya sendiri. Pilihanmu mengubah apa yang terjadi di langkah berikut. Tidak ada opsi yang gratis.",
    ],
    tasks: [],
    decision: {
      prompt: "Kebijakan pemblokiran mana yang kamu rekomendasikan?",
      options: [
        {
          id: "opt-blokir-semua",
          label: "Blokir 5.162 alamat (semua yang cocok signature sanksi)",
          rationale:
            "Recall 100% — tidak satu pun alamat sanksi lolos. Pesan ke regulator: 'kami agresif memberantas'.",
          nextStepId: "temuan-blokir",
          consequenceNote:
            "Bencana kepatuhan: 5.141 false positive. Ratusan nasabah berlabel 'white' dan ribuan alamat ransomware (yang TIDAK disanksi — dasar hukum pemblokirannya salah) dibekukan. Gugatan class action, liputan 'bursa blokir nasabah tak bersalah', dan regulator mempertanyakan metodologimu. Recall 100%, reputasi 0%.",
        },
        {
          id: "opt-presisi",
          label: "Blokir hanya 21 alamat OFAC; sisanya enhanced monitoring",
          rationale:
            "Presisi 100% — yang diblokir hanya yang benar-benar disanksi. 9 signature bersama dipantau, tidak diblokir.",
          nextStepId: "temuan-presisi",
          consequenceNote:
            "Keputusan paling defensible secara hukum: setiap pemblokiran punya dasar daftar sanksi yang jelas. Harganya: alamat sanksi BARU dengan pola sama tidak tertangkap otomatis, dan 7 label 'white' yang ditamper + 2 alamat yang disembunyikan dari kolom is_sanctioned lolos dari pantauan — karena kamu memercayai kolom yang ternyata sudah disabotase.",
        },
        {
          id: "opt-eskalasi",
          label: "Tolak keduanya — eskalasi: model temporal + review legal",
          rationale:
            "Mismatch waktu 2016-vs-2026 membuat kedua opsi cacat metodologi. Minta waktu: bangun model dengan fitur waktu + legal review sebelum blokir massal.",
          nextStepId: "temuan-eskalasi",
          consequenceNote:
            "Keputusan paling jujur secara metodologi — dan paling mahal secara politik. Kepala kepatuhan kecewa ('regulator tidak menunggu'), tapi kamu mencegah dua bencana sekaligus. Temuan audit (label tamper, supresi orakel) menjadi bukti bahwa keputusan tergesa di atas data yang disabotase adalah kelalaian.",
        },
      ],
    },
  },
  {
    id: "temuan-blokir",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "5.141 surat pembekuan yang salah alamat",
    prose: [
      "Keputusan dieksekusi Jumat sore. Senin pagi, tim legal menelepon: 5.141 alamat dibekukan, dan di antaranya ratusan adalah nasabah ritel dengan riwayat transaksi bersih — label 'white' mereka benar adanya. Media kripto menulis: 'Bursa X bekukan dana nasabah atas dasar kemiripan statistik.'",
      "Yang lebih memalukan: ribuan alamat yang dibekukan memang alamat ransomware (princetonLocky/Cerber) — TAPI mereka tidak ada di daftar sanksi. Pemblokiran atas nama 'sanksi OFAC' terhadap alamat yang tidak disanksi adalah dasar hukum yang salah; tim legal menyebutnya 'liabilitas berjalan'.",
      "Dan ironi pamungkas: 2 dari 21 alamat sanksi yang sebenarnya — 149w62rY42aZBox8fGcmqNsXUzSStKeq8C dan 1G9CKRHA3mx22DoT1QyNYrh85VSQ19Y1em — TIDAK ikut terblokir, karena kolom is_sanctioned di file audit sudah disabotase (di-nol-kan) dan signature mereka tidak cocok dengan pola mayoritas. Kamu memblokir 5.141 orang yang salah sambil meloloskan 2 target yang benar.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: recall tanpa presisi = kekerasan statistik",
      body: "'Tidak ada yang lolos' terdengar heroik sampai kamu menghitung korbannya. Dalam kepatuhan, false positive bukan angka di confusion matrix — ia adalah manusia yang dananya dibekukan. Kebijakan yang benar selalu menyebut kedua sisi: berapa yang tertangkap DAN berapa yang jadi korban.",
    },
  },
  {
    id: "temuan-presisi",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "21 diblokir tepat — tapi orakelnya sudah disabotase",
    prose: [
      "21 alamat diblokir dengan dasar hukum kristal: tercantum di daftar sanksi OFAC. Regulator mengangguk. Tidak ada gugatan. Di atas kertas, ini keputusan sempurna.",
      "Lalu tim audit internal menyelesaikan pemeriksaannya — dan kertas itu robek. File audit yang kamu pakai ternyata sudah disabotase: 7 baris ransomware (princetonLocky) labelnya diganti jadi 'white', 2 alamat sanksi DIHILANGKAN dari kolom is_sanctioned, 4 alamat diduplikat dengan label konflik, 12 income dikali 10. Kebijakan 'presisi 100%'-mu dibangun di atas kolom is_sanctioned yang isinya sudah diutak-atik.",
      "Untungnya kamu memblokir berdasarkan silang LANGSUNG ke file ofac_sanctioned_xbt.txt (pin 2026-10-15) — bukan berdasarkan kolom is_sanctioned. Itu yang menyelamatkanmu: 21 alamat tetap tertangkap. Pelajarannya brutal: presisi 100% hanya sekuat integritas kolom yang kamu percaya. Orakel yang disabotase tetap orakel buta.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: verifikasi orakel, jangan warisi",
      body: "Kamu selamat karena menyilangkan sendiri ke daftar sanksi asli, bukan memercayai kolom turunan. Dalam forensik blockchain, 'kolom hasil olahan orang lain' adalah titik sabotase paling murah — mengubah 2 angka lebih mudah daripada memalsukan blockchain. Selalu kembali ke sumber primer.",
    },
  },
  {
    id: "temuan-eskalasi",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Penundaan yang menyelamatkan — dengan harga politik",
    prose: [
      "Kamu menolak menandatangani kedua opsi dan meminta 2 minggu: model dengan fitur waktu + review legal. Kepala kepatuhan tidak senang — 'regulator tidak menunggu' — tapi memberimu 10 hari.",
      "Di hari ke-6, temuan audit internal keluar: file 'yang sudah diperbarui' ternyata mengandung 4 sabotase, termasuk 2 alamat sanksi yang disembunyikan dari kolom is_sanctioned. Seandainya kamu memilih opsi blokir-massal, 5.141 false positive sudah terjadi. Seandainya kamu memilih opsi presisi di atas kolom audit, 2 target sudah lolos.",
      "Penundaanmu berubah dari 'birokrasi' menjadi 'kehati-hatian yang terbukti benar'. Model temporal yang kamu bangun akhirnya memblokir 21 alamat berdasarkan daftar primer OFAC + menandai 9 signature bersama sebagai 'pola umum, bukan bukti' + memasukkan peringatan mismatch waktu ke dokumentasi model. Regulator justru memuji dokumentasi batas model itu.",
      "Harganya nyata: 10 hari tanpa pemblokiran = 10 hari eksposur. Tidak ada keputusan tanpa korban — yang ada hanya keputusan yang korbannya dihitung dengan jujur.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: 'tunda' adalah keputusan juga",
      body: "Eskalasi sering dicap sebagai pengecut — padahal dalam kasus ini ia satu-satunya opsi yang tidak mengeksekusi di atas data yang disabotase. Kuncinya: penundaanmu PRODUKTIF (membangun model temporal + menemukan sabotase), bukan pasif. 'Saya butuh waktu' tanpa rencana kerja = menunda masalah. 'Saya butuh 10 hari untuk X, Y, Z' = keputusan.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 14 baris: temukan 4 sabotase",
    prose: [
      "Misi auditnya. Di bawah ini 14 baris dari file yang diklaim 'sudah diperbarui dengan daftar sanksi terbaru' — termasuk baris-baris yang TIDAK ada di file bersih. Empat sabotase disuntikkan tanpa pengumuman. Tandai yang janggal, lalu buka debrief.",
      "Senjatamu: silang manual ke `ofac_sanctioned_xbt.txt` (sumber primer — jangan percaya kolom is_sanctioned), perbandingan label vs file bersih, dan akal sehat atas angka income.",
    ],
    tasks: [],
    auditDossier: {
      version: "orakel-m1b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai pembaruan entitas dengan daftar sanksi OFAC terbaru. Kolom is_sanctioned diklaim hasil silang resmi.",
      columns: ["Alamat (singkat)", "Label", "Income (satoshi)", "is_sanctioned", "Catatan klaim"],
      rows: [
        // ── I4: supresi orakel ──
        { rowId: 1, cells: { "Alamat (singkat)": "149w62rY42aZB…", "Label": "white", "Income (satoshi)": "362.849.420", "is_sanctioned": "0", "Catatan klaim": "Bersih, tidak disanksi" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 2, cells: { "Alamat (singkat)": "1G9CKRHA3mx22…", "Label": "white", "Income (satoshi)": "1.000.000.000", "is_sanctioned": "0", "Catatan klaim": "Bersih, tidak disanksi" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I1: label tamper ──
        { rowId: 3, cells: { "Alamat (singkat)": "1123pJv8jzeFQ…", "Label": "white", "Income (satoshi)": "100.000.000", "is_sanctioned": "0", "Catatan klaim": "White sejak awal" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 4, cells: { "Alamat (singkat)": "1129TSjKtx65E…", "Label": "white", "Income (satoshi)": "200.000.000", "is_sanctioned": "0", "Catatan klaim": "White sejak awal" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 5, cells: { "Alamat (singkat)": "112AmFATxzhuS…", "Label": "white", "Income (satoshi)": "150.000.000", "is_sanctioned": "0", "Catatan klaim": "White sejak awal" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I3: duplikat hantu ──
        { rowId: 6, cells: { "Alamat (singkat)": "112GocBgFSnao…", "Label": "princetonLocky + white (2 baris)", "Income (satoshi)": "50.000.000", "is_sanctioned": "0", "Catatan klaim": "Duplikat sistem" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 7, cells: { "Alamat (singkat)": "112wjYgWapZU8…", "Label": "princetonLocky + white (2 baris)", "Income (satoshi)": "550.000.000", "is_sanctioned": "0", "Catatan klaim": "Duplikat sistem" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 8, cells: { "Alamat (singkat)": "1131P1hjj7h9N…", "Label": "princetonLocky + white (2 baris)", "Income (satoshi)": "500.000.000", "is_sanctioned": "0", "Catatan klaim": "Duplikat sistem" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 9, cells: { "Alamat (singkat)": "1136MFiqBmoVW…", "Label": "princetonLocky + white (2 baris)", "Income (satoshi)": "101.000.000", "is_sanctioned": "0", "Catatan klaim": "Duplikat sistem" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I2: income ×10 ──
        { rowId: 10, cells: { "Alamat (singkat)": "1AjZPMsnmpdK2…", "Label": "white", "Income (satoshi)": "25.641.390.000", "is_sanctioned": "1", "Catatan klaim": "Volume wajar" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 11, cells: { "Alamat (singkat)": "377CY1m8W2qbQ…", "Label": "princetonCerber", "Income (satoshi)": "8.900.000.000", "is_sanctioned": "0", "Catatan klaim": "Volume wajar" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── kontras: sanksi jujur ──
        { rowId: 12, cells: { "Alamat (singkat)": "12QtD5BFwRsdN…", "Label": "white", "Income (satoshi)": "377.862.800", "is_sanctioned": "1", "Catatan klaim": "Disanksi OFAC" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 13, cells: { "Alamat (singkat)": "1EYitrwBYNWuT…", "Label": "white", "Income (satoshi)": "350.000.000", "is_sanctioned": "1", "Catatan klaim": "Disanksi OFAC" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 14, cells: { "Alamat (singkat)": "1123pJv8jzeFQ…", "Label": "princetonLocky (file bersih)", "Income (satoshi)": "10.000.000", "is_sanctioned": "0", "Catatan klaim": "Arsip pembanding" }, claims: [{ label: "Status", value: "Referensi" }] },
      ],
      injections: [
        { key: "oracle-suppression", rowIds: [1, 2], title: "Supresi orakel", clue: "Kedua alamat ADA di ofac_sanctioned_xbt.txt (sumber primer) tapi is_sanctioned=0 di file audit. Kolom turunan disabotase — orakelnya dibutakan.", danger: "Kebijakan yang memercayai kolom is_sanctioned akan MELOLOSKAN alamat sanksi. Selalu silang ke sumber primer." },
        { key: "label-tamper", rowIds: [3, 4, 5], title: "Label tamper", clue: "Di file bersih ketiganya berlabel princetonLocky; di file audit menjadi 'white'. Bandingkan baris 14 (arsip) vs baris 3.", danger: "Ransomware yang dilabeli 'white' lolos dari semua filter berbasis label — pemutihan data." },
        { key: "ghost-duplicate", rowIds: [6, 7, 8, 9], title: "Alamat hantu (duplikat konflik)", clue: "Satu alamat, dua baris, dua label berlawanan (princetonLocky + white). 'Duplikat sistem' bukan penjelasan — ini injeksi.", danger: "Duplikat konflik meracuni training model dan membuat audit trail tidak bisa dipercaya." },
        { key: "income-x10", rowIds: [10, 11], title: "Income dikali 10", clue: "Income 25,6 miliar dan 8,9 miliar satoshi — 10× lipat nilai di file bersih. Baris 1–2 juga terkena (362 juta & 1 miliar adalah nilai ×10).", danger: "Fitur income yang digelembungkan merusak threshold dan model risiko yang memakai volume transaksi." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Memo kepatuhan untuk kepala kepatuhan",
    prose: [
      "Tulis memo kepatuhan satu halaman — dokumen yang akan dibaca regulator bila terjadi sengketa. Ia harus berani menolak usulan yang populer (blokir 5.162 alamat) DENGAN ANGKA, dan jujur tentang batas orakel yang kamu pakai.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): rekomendasi kebijakan + angka kuncinya.",
        "Temuan kuantitatif: hasil silang OFAC, anomali label, hasil simulasi clustering naif (lengkap dengan false positive).",
        "Rekomendasi kebijakan: apa yang diblokir, apa yang dipantau, apa yang ditolak — dan dasar hukum tiap kategori.",
        "Temuan integritas data: sabotase yang ditemukan di file audit + implikasinya.",
        "Batas orakel (kejujuran): mismatch waktu, cakupan daftar sanksi, dan apa yang TIDAK bisa disimpulkan.",
      ],
      rubric: [
        { criterion: "Kebenaran kuantitatif", weight: 25, levels: ["Angka salah/tidak ada", "Angka ada tapi tak dipakai menilai", "21 sanksi + 5.162 flagged + 5.141 FP dipakai menilai usulan"] },
        { criterion: "Kualitas keputusan", weight: 25, levels: ["Rekomendasi tanpa trade-off", "Trade-off disebut sebagian", "Presisi vs recall + dasar hukum + korban tiap opsi dihitung"] },
        { criterion: "Deteksi sabotase", weight: 20, levels: ["Tidak menyebut sabotase", "Menyebut sebagian", "4 jenis sabotase disebut dengan bukti baris"] },
        { criterion: "Kejujuran batas orakel", weight: 30, levels: ["Orakel diperlakukan absolut", "Batas disebut sekilas", "Mismatch waktu + cakupan + anakronisme dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase yang disuntikkan:",
      "1) **Label tamper** (baris 3–5): 7 baris princetonLocky dilabeli ulang jadi 'white'. Di dunia nyata: dataset historis yang 'dibersihkan' tanpa jejak — atau vendor data yang memutihkan label agar model terlihat akurat.",
      "2) **Income ×10** (baris 10–11, plus baris 1–2): 12 baris income-nya digelembungkan 10× lipat. Pola klasik manipulasi fitur: cukup satu perkalian untuk merusak semua threshold berbasis volume.",
      "3) **Alamat hantu** (baris 6–9): 4 alamat diduplikat dengan label konflik (princetonLocky + white). 'Duplikat sistem' adalah penjelasan yang paling sering — dan paling jarang benar.",
      "4) **Supresi orakel** (baris 1–2): 2 alamat sanksi dihapus dari kolom is_sanctioned. Ini sabotase paling berbahaya: ia tidak merusak data, ia merusak KEPERCAYAAN pada orakel. Korban yang memercayai kolom itu akan meloloskan target yang sebenarnya.",
      "Dan dua temuan BESAR yang bukan sabotase — melainkan sifat datanya: (a) 21/21 alamat sanksi berlabel 'white' — label dataset adalah klaim pembuatnya, bukan kebenaran; (b) clustering naif = 5.162 diblokir untuk 21 target — 5.141 false positive. Skor deteksimu (x/4) mengukur insting paling mahal di AML: curiga pada kolom turunan, hormat pada sumber primer, dan selalu — SELALU — menghitung korban dari kebijakan yang kamu tanda tangani.",
      "Satu catatan kejujuran terakhir: daftar sanksi OFAC yang kamu pakai dipin 2026-10-15 — SEBELUM tanggal misi ini. Daftar sanksi berubah; pin tanggal adalah bagian dari metode, bukan detail administratif. Analis yang memakai 'daftar sanksi terbaru' tanpa mencatat tanggalnya sedang membangun di atas pasir.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: model yang 'akurat' = model yang adil",
      type: "risk",
      body: "Clustering naif punya recall 100% — metrik yang terlihat sempurna di slide. Tapi 99,6% korbannya salah sasaran. Di kepatuhan, metrik tanpa denominator korban adalah kebohongan yang rapi. Setiap kali seseorang mengusulkan 'blokir semua yang mirip', tanyakan: 'mirip menurut siapa, dan siapa yang membayar harganya?'",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 12 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Silangkan orakel ke sumber primer: 21 alamat sanksi OFAC semuanya berlabel 'white' — label dataset adalah klaim, bukan kebenaran.",
      "Ukur bahaya clustering: 9 signature dipakai bersama ransomware; blokir naif = 5.162 alamat untuk 21 target (5.141 false positive).",
      "Empat pola sabotase: label tamper, income ×10, alamat hantu (duplikat konflik), supresi orakel.",
      "Keputusan kepatuhan = presisi vs recall + dasar hukum: setiap opsi wajib menyebut korbannya dengan angka.",
      "Batas orakel: daftar sanksi 2026 tidak bisa memberi label data 2016 — mismatch waktu adalah anakronisme, bukan detail.",
      "Data: BitcoinHeist (UCI, CC BY 4.0, 2011–2018) + daftar sanksi OFAC (public domain, pin 2026-10-15).",
    ],
  },
];

(misiOrakelButa.steps as V2Step[]).push(...LANJUTAN_ORAKEL);
