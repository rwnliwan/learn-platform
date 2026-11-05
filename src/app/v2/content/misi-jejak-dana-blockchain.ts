import type { V2Mission } from "../lib/types";

// ── MISI JEJAK DANA: Investigasi Jejak Dana Peretasan ─────────────────────
// Pilot C — Blockchain Data Scientist. Dataset: BitcoinHeist (CC BY 4.0,
// 46.413 baris: semua alamat ransomware + baris cocok-OFAC + 5.000 white) +
// daftar sanksi OFAC XBT/ETH (public domain), snapshot 2026-10-15.
// File: public/misi/misi-jejak-dana-blockchain/alamat.csv + ofac_sanctioned.csv.

const BASE = "/misi/misi-jejak-dana-blockchain";

export const misiJejakDana: V2Mission = {
  slug: "misi-jejak-dana-blockchain",
  track: "Blockchain Data Scientist",
  module: "Misi",
  title: "Misi Investigasi: Jejak Dana Peretasan",
  estMinutes: 120,
  role: "Investigator blockchain untuk sebuah exchange",
  client:
    "Head of Compliance exchange — sebuah “laporan bersih” atas 20 wallet mencurigakan baru saja masuk; keputusan listing/beku menunggu auditmu",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "“Semua wallet ini bersih,” kata laporannya. Benarkah?",
      prose: [],
      tasks: [],
      briefing: {
        role: "Investigator blockchain untuk sebuah exchange kripto",
        client:
          "Head of Compliance. Exchange menerima setoran dari 20 wallet yang diklaim “bersih” oleh sebuah firma audit eksternal. Kalau klaim itu benar, dana bisa diproses. Kalau salah — dan salah satunya ternyata terkait ransomware atau masuk daftar sanksi OFAC — exchange bisa memproses dana sanksi: denda regulator, pembekuan aset, dan reputasi hancur.",
        story: [
          "Kamis, 16:20. Head of Compliance meneruskan email dari firma audit: satu PDF rapi berisi 20 alamat wallet, masing-masing dicap “CLEAR — tidak ada indikasi aktivitas ilegal”. Di halaman terakhir ada satu kalimat yang membuat keningmu berkerut: “Dua wallet dalam daftar ini sempat muncul di daftar sanksi OFAC, namun telah dibersihkan melalui mixer dan kini aman diproses.”",
          "Kamu tahu persis kenapa kalimat itu berbahaya. Melewatkan dana lewat mixer TIDAK menghapus status sanksi — OFAC menyanksi alamat dan orangnya, bukan riwayat transaksinya. “Sudah lewat mixer jadi bersih” adalah salah satu miskonsepsi paling mahal di kepatuhan kripto. Dan firma audit yang menulis kalimat itu entah tidak paham, atau berharap kamu juga tidak paham.",
          "Kamu punya dua senjata: dataset BitcoinHeist (2,9 juta alamat berlabel — termasuk keluarga ransomware nyata: CryptoWall, CryptoLocker, Cerber, Locky, CryptXXX) dengan fitur kuantitatif pencucian (mixing rounds, pola merge, income), dan daftar alamat sanksi OFAC yang di-pin tanggal hari ini. Misimu: audit klaim “bersih” itu baris per baris, putuskan bekukan/pantau/lepas, dan tulis laporan investigasi yang berani berkata “jangan proses” bila buktinya berkata begitu.",
        ],
        objectives: [
          "Menganalisis distribusi fitur pencucian (mixing rounds, weight, looped) per label dan mengidentifikasi wallet berlabel ransomware yang diklaim bersih.",
          "Melakukan join alamat vs daftar sanksi OFAC dan menilai klaim “sudah bersih via mixer”.",
          "Menulis laporan investigasi dengan rekomendasi bekukan / pantau / lepas per wallet, lengkap dengan bukti dan batas analisis.",
        ],
        prereqSummary:
          "Address clustering: satu entitas biasanya mengendalikan banyak alamat; pola transaksi (bukan nama) yang mengidentifikasi pemilik. Mixing rounds (kolom `length` di dataset): berapa kali dana dilewatkan melalui mixer/tumbler untuk mengaburkan jejak — nilai tinggi = upaya penyembunyian tinggi, tapi bukan bukti kejahatan dengan sendirinya. Label di dataset ini berasal dari riset (bukan vonis hukum): perlakukan sebagai sinyal, bukan kebenaran mutlak.",
        datasetNote:
          "Sumber primer: BitcoinHeist Ransomware Address Dataset (UCI ML Repository), lisensi CC BY 4.0 — atribusi: “UCI ML Repository”.\nSnapshot: SEMUA 41.413 alamat berlabel ransomware + SEMUA baris yang cocok daftar OFAC (oversampling disengaja agar misi bisa dikerjakan) + 5.000 alamat `white` acak (seed 42) = 46.413 baris. Nilai fitur asli tidak diubah.\nOrakel: daftar alamat digital currency sanksi OFAC via tool 0xB10C (MIT; data OFAC = public domain AS), snapshot 2026-10-15: 532 alamat XBT + 120 ETH.\nKejujuran: BitcoinHeist TIDAK memuat edge list/graph transaksi — misi ini dibingkai sebagai AUDIT LAPORAN (bukan literal hop-tracing). Klaim “sudah lewat mixer jadi bersih” adalah miskonsepsi yang justru jadi bahan audit.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Dua file, satu kebohongan yang harus dibuktikan",
      prose: [
        "`alamat.csv` — 46.413 baris, kolom: `address, tahun, hari, mixing_rounds, weight, count, looped, neighbors, income_satoshi, label, is_sanctioned`. Kolom `label` berisi keluarga ransomware (`paduaCryptoWall`, `montrealCryptoLocker`, `princetonCerber`, `princetonLocky`, `montrealCryptXXX`, …) atau `white`. Kolom `is_sanctioned` = hasil join persis vs daftar OFAC XBT (1 = cocok).",
        "`ofac_sanctioned.csv` — daftar sanksi yang di-pin: 532 alamat XBT + 120 ETH, kolom `address, aset, tanggal_snapshot` (2026-10-15). Inilah “orakel” kebenaranmu: klaim apa pun tentang status sanksi harus diuji ke file ini, bukan ke PDF firma audit.",
        "Catatan penting: label `white` di dataset ini artinya “tidak teridentifikasi sebagai ransomware oleh peneliti” — BUKAN “terbukti bersih”. Beberapa alamat `white` justru cocok dengan daftar OFAC. Itulah inti misimu: label penelitian ≠ vonis kepatuhan.",
      ],
      tasks: [
        { id: "t1", text: "Buka `alamat.csv`: catat jumlah baris dan daftar label unik" },
        { id: "t2", text: "Buka `ofac_sanctioned.csv`: berapa alamat XBT yang di-sanksi" },
      ],
      note: {
        title: "Miskonsepsi #1: “sudah lewat mixer = bersih”",
        type: "risk",
        body: "Mixer mengaburkan JEJAK, bukan menghapus STATUS HUKUM. OFAC menyanksi alamat/orang — dana dari alamat sanksi tetap dana sanksi walau sudah dicuci 10 kali. Firma audit yang menulis “aman diproses karena sudah lewat mixer” sedang menjual miskonsepsi sebagai jasa profesional. Di AS, memproses dana sanksi bisa berarti denda jutaan dolar per pelanggaran.",
      },
      reference:
        "alamat.csv (46.413 baris, 11 kolom) + ofac_sanctioned.csv (652 alamat, snapshot 2026-10-15). label=white ≠ bersih.",
    },
  ],
};

export default misiJejakDana;

// ── lanjutan misiJejakDana: lab + keputusan + cabang ─────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_CHAIN_A: V2Step[] = [
  {
    id: "lab-mixing",
    eyebrow: "Langkah 3 · Lab 1 — Fitur yang (tidak) bicara",
    title: "Ternyata perilakunya mirip. Lalu apa yang membedakan?",
    prose: [
      "Firma audit mengklaim 20 wallet “bersih” berdasarkan analisis perilaku on-chain. Hipotesismu: wallet ransomware pasti punya `mixing_rounds` jauh lebih tinggi — kan mereka berusaha menyembunyikan jejak? Lab ini menguji hipotesismu langsung: muat `alamat.csv`, bandingkan median `mixing_rounds` alamat berlabel ransomware vs `white`, dan hitung berapa baris yang cocok daftar OFAC.",
      "Siap-siap: hasilnya mungkin meruntuhkan hipotesismu. Dan itu justru intinya — dalam audit, temuan “fitur ini tidak membedakan” sama berharganya dengan temuan yang membedakan. Karena kalau fitur perilaku tidak bisa memisahkan, maka klaim “bersih berdasarkan perilaku” tidak punya fondasi.",
    ],
    tasks: [
      { id: "t1", text: "Muat CSV ke `df`; hitung `n_baris` dan `n_ransomware` (baris label != white)" },
      { id: "t2", text: "Hitung `n_sanctioned` = baris dengan `is_sanctioned == 1`" },
      { id: "t3", text: "Median `mixing_rounds` ransomware (`med_mix_ransomware`) vs white (`med_mix_white`); print semuanya" },
    ],
    expected:
      "n_baris=46413, n_ransomware=41413, n_sanctioned=67, med_mix_ransomware=6.0, med_mix_white=8.0 — hampir identik!",
    note: {
      title: "Miskonsepsi #2: fitur canggih pasti bisa membedakan",
      type: "pitfall",
      body: "Median mixing ransomware (6,0) vs white (8,0) — praktis SAMA. Distribusinya pun mirip: keduanya menumpuk di 0 dan 144. Pelajarannya keras: fitur perilaku on-chain SAJA tidak cukup memverifikasi klaim “bersih”. Yang membedakan adalah LABEL riset (keluarga ransomware) dan JOIN ke daftar sanksi OFAC. Firma audit yang hanya mengandalkan “analisis perilaku” sedang membangun kesimpulan di atas pasir.",
    },
    hints: [
      "Muat: `pd.read_csv(open_url(\"/misi/misi-jejak-dana-blockchain/alamat.csv\"))` — butuh `from pyodide.http import open_url`.",
      "Ransomware = `df[df[\"label\"]!=\"white\"]`: median kolom `mixing_rounds`.",
      "is_sanctioned bertipe integer 0/1: `(df[\"is_sanctioned\"]==1).sum()`.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL = \"/misi/misi-jejak-dana-blockchain/alamat.csv\"",
        "df = pd.read_csv(open_url(URL))",
        "",
        "n_baris = ...            # banyak baris",
        "n_ransomware = ...       # baris dengan label != \"white\"",
        "n_sanctioned = ...       # baris dengan is_sanctioned == 1",
        "",
        "rans = df[df[\"label\"] != \"white\"]",
        "white = df[df[\"label\"] == \"white\"]",
        "med_mix_ransomware = ...",
        "med_mix_white = ...",
        "",
        "print(\"baris:\", n_baris, \"| ransomware:\", n_ransomware, \"| cocok OFAC:\", n_sanctioned)",
        "print(\"median mixing ransomware:\", med_mix_ransomware)",
        "print(\"median mixing white:\", med_mix_white)",
      ].join("\n"),
      lockLines: 5,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL = \"/misi/misi-jejak-dana-blockchain/alamat.csv\"",
        "df = pd.read_csv(open_url(URL))",
        "",
        "n_baris = len(df)",
        "n_ransomware = int((df[\"label\"] != \"white\").sum())",
        "n_sanctioned = int((df[\"is_sanctioned\"] == 1).sum())",
        "",
        "rans = df[df[\"label\"] != \"white\"]",
        "white = df[df[\"label\"] == \"white\"]",
        "med_mix_ransomware = float(rans[\"mixing_rounds\"].median())",
        "med_mix_white = float(white[\"mixing_rounds\"].median())",
        "",
        "print(\"baris:\", n_baris, \"| ransomware:\", n_ransomware, \"| cocok OFAC:\", n_sanctioned)",
        "print(\"median mixing ransomware:\", med_mix_ransomware)",
        "print(\"median mixing white:\", med_mix_white)",
      ].join("\n"),
      checks: [
        { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus DataFrame dari alamat.csv." },
        { kind: "equal", task: "t1", label: "`n_baris` = 46413", name: "n_baris", value: 46413, msg: "Snapshot misi ini: 41.413 ransomware + 67 cocok-OFAC + 4.933 white." },
        { kind: "equal", task: "t1", label: "`n_ransomware` = 41413", name: "n_ransomware", value: 41413, msg: "Baris dengan label != white." },
        { kind: "equal", task: "t2", label: "`n_sanctioned` = 67", name: "n_sanctioned", value: 67, msg: "Hitung baris dengan is_sanctioned == 1." },
        { kind: "equal", task: "t3", label: "`med_mix_ransomware` = 6.0", name: "med_mix_ransomware", value: 6.0, tol: 0.01, msg: "Median mixing_rounds untuk label != white." },
        { kind: "equal", task: "t3", label: "`med_mix_white` = 8.0", name: "med_mix_white", value: 8.0, tol: 0.01, msg: "Median mixing_rounds untuk label == white. Ya — HAMPIR SAMA dengan ransomware. Itu temuannya." },
      ],
    },
  },
  {
    id: "lab-sql-ofac",
    eyebrow: "Langkah 4 · Lab 2 — Join kebenaran",
    title: "Satu JOIN yang membatalkan seluruh laporan audit",
    prose: [
      "Firma audit berkata “sudah dicek”. Kamu mengecek ulang dengan satu JOIN. Tabel `wallet(address, label, klaim_audit)` berisi 8 wallet dari laporan mereka — semua diklaim “bersih”. Tabel `ofac(address, aset)` adalah daftar sanksi yang di-pin. Temukan wallet yang klaimnya bohong: diklaim bersih TAPI muncul di daftar OFAC.",
      "Di dunia nyata, join ini berjalan tiap ada setoran masuk — screening sanksi real-time. Melewatkannya bukan kelalaian teknis; itu pelanggaran kepatuhan.",
    ],
    tasks: [
      { id: "t1", text: "JOIN wallet vs ofac; tampilkan wallet yang diklaim bersih tapi tersanksi" },
    ],
    expected: "2 wallet: 149w62rY42aZBox8fGcmqNsXUzSStKeq8C dan 1AjZPMsnmpdK2Rv9KQNfMurTXinscVro9V",
    sqlLab: {
      task: "Tampilkan address + label dari wallet yang klaim_audit-nya 'bersih' TAPI address-nya ada di tabel ofac.",
      schema: [
        "CREATE TABLE wallet (address TEXT, label TEXT, klaim_audit TEXT);",
        "CREATE TABLE ofac (address TEXT, aset TEXT);",
      ].join("\n"),
      seedData: [
        "INSERT INTO wallet VALUES",
        "('149w62rY42aZBox8fGcmqNsXUzSStKeq8C', 'white', 'bersih'),",
        "('1AjZPMsnmpdK2Rv9KQNfMurTXinscVro9V', 'white', 'bersih'),",
        "('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', 'paduaCryptoWall', 'bersih'),",
        "('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', 'white', 'bersih'),",
        "('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', 'white', 'bersih'),",
        "('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'white', 'bersih'),",
        "('3AiULq4JmTUVz1y5n9qS6ZzQ4V7x8Y2w3E', 'montrealCryptXXX', 'bersih'),",
        "('1dice8EMZmqKvrGE4Qc9bUFf9PX3xaYDc', 'white', 'bersih');",
        "INSERT INTO ofac VALUES",
        "('149w62rY42aZBox8fGcmqNsXUzSStKeq8C', 'XBT'),",
        "('1AjZPMsnmpdK2Rv9KQNfMurTXinscVro9V', 'XBT');",
      ].join("\n"),
      starter: "-- Tulis query-mu di sini\nSELECT address, label\nFROM wallet\n",
      solution: [
        "SELECT w.address, w.label",
        "FROM wallet w JOIN ofac o ON w.address = o.address",
        "WHERE w.klaim_audit = 'bersih';",
      ].join("\n"),
      expectedColumns: ["address", "label"],
      expectedRows: [
        ["149w62rY42aZBox8fGcmqNsXUzSStKeq8C", "white"],
        ["1AjZPMsnmpdK2Rv9KQNfMurTXinscVro9V", "white"],
      ],
    },
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Bekukan, pantau, atau lepas? 20 wallet menunggu",
    prose: [
      "Bukti terkumpul: fitur perilaku ternyata BISU (median mixing hampir identik), TAPI label riset dan join OFAC bicara keras — 2 wallet yang klaim “bersih”-nya runtuh oleh satu JOIN. Head of Compliance butuh keputusanmu SEKARANG untuk 20 wallet dalam laporan: tiga opsi, masing-masing dengan harga.",
    ],
    tasks: [],
    decision: {
      prompt: "Rekomendasimu untuk 20 wallet yang diklaim bersih?",
      options: [
        {
          id: "opt-beku",
          label: "BEKUKAN semua 20 wallet + laporkan ke regulator",
          rationale: "Pendekatan paling aman secara hukum. Kalau ada dana sanksi lolos, exchange yang menanggung denda.",
          nextStepId: "temuan-beku",
          consequenceNote: "2 wallet tersanksi berhasil diblokir — kemenangan kepatuhan. Tapi 18 wallet bersih ikut dibekukan berminggu-minggu: nasabah protes, exchange kehilangan likuiditas, dan firma audit menuntut balik atas “tuduhan tak berdasar”. Keamanan maksimal, presisi nol.",
        },
        {
          id: "opt-pantau",
          label: "PANTAU: bekukan 2 yang cocok OFAC, 18 lainnya enhanced monitoring",
          rationale: "Proporsional: tindak tegas yang terbukti, awasi ketat sisanya tanpa menghukum yang belum terbukti.",
          nextStepId: "temuan-pantau",
          consequenceNote: "Keputusan paling defensibel: 2 wallet sanksi dibekukan dengan bukti join yang tak terbantahkan; 18 lainnya memicu alert otomatis bila pola mixing-nya berubah. Regulator menilai ini “risk-based approach” yang matang.",
        },
        {
          id: "opt-lepas",
          label: "LEPAS: percaya laporan audit, proses semua",
          rationale: "Firma audit profesional sudah dibayar untuk ini; memblokir dana nasabah tanpa “bukti kuat” berisiko gugatan.",
          nextStepId: "temuan-lepas",
          consequenceNote: "Tiga minggu kemudian, regulator menemukan 2 wallet sanksi memproses dana lewat exchange-mu. Denda + pembekuan sementara operasi. “Firma audit bilang bersih” bukan pembelaan hukum — tanggung jawab akhir tetap di exchange.",
        },
      ],
    },
  },
  {
    id: "temuan-beku",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Kamu membekukan semuanya",
    prose: [
      "Dua wallet sanksi berhasil diblokir sebelum dana bergerak — tim kepatuhan merayakannya. Lalu datang gelombang kedua: 18 nasabah yang dananya sah ikut terkunci. Tiga di antaranya adalah market maker yang menyediakan likuiditas; mereka pindah ke kompetitor dalam seminggu. Firma audit mengirim somasi: “tuduhan tak berdasar merusak reputasi kami”.",
      "Pelajaran: keamanan tanpa presisi adalah bentuk lain dari kegagalan. Regulator memang menghargai kehati-hatian — tapi nasabah menghargai keadilan. Auditor yang baik menghukum dengan bukti, bukan dengan ketakutan.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "Apa kriteria pembekuan yang SEHARUSNYA kamu pakai? Tulis aturan yang proporsional: bukti apa → tindakan apa. “Bekukan semua” bukan strategi; itu panik yang terdokumentasi.",
    },
  },
  {
    id: "temuan-pantau",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Risk-based: tegas pada bukti, waspada pada sisanya",
    prose: [
      "Dua wallet yang cocok OFAC dibekukan hari itu juga — dengan bukti join yang tak terbantahkan, firma audit tidak bisa membantah. 18 wallet lainnya masuk enhanced monitoring: setiap pergerakan di atas ambang mixing memicu alert. Sebulan kemudian, satu dari 18 itu menunjukkan pola layering dan ikut dibekukan — kali ini dengan jejak bukti lengkap.",
      "Regulator yang datang audit kuartalan menilai pendekatanmu “matang dan proporsional”. Inilah standar emas kepatuhan: bertindak tegas di mana bukti kuat, mengawasi di mana sinyal lemah, dan mendokumentasikan semuanya.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "Keputusan ini benar — tapi jangan terlena. Tulis di laporan: apa ambang “pola mencurigakan” untuk 18 wallet yang dipantau? Tanpa ambang eksplisit, “monitoring” hanyalah kata yang menenangkan.",
    },
  },
  {
    id: "temuan-lepas",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Kamu memercayai laporannya",
    prose: [
      "Tiga minggu yang tenang. Lalu email dari regulator: “Kami menemukan 2 alamat sanksi OFAC memproses dana melalui platform Anda.” Denda dijatuhkan. Operasi dibekukan sementara selama investigasi. Head of Compliance mengundurkan diri. Firma audit? Mereka menunjuk klausul “laporan bersifat advis” di kontraknya.",
      "Pelajaran termahal di kepatuhan: tanggung jawab tidak bisa di-outsource. Kamu boleh membayar siapa pun untuk memberi pendapat — tapi vonis akhirnya tetap milikmu, dan dendanya juga.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "Kegagalan ini pun bisa jadi laporan yang jujur: tulis apa sinyal yang kamu abaikan (klaim “mixer = bersih”, 2 wallet OFAC) dan kontrol apa yang seharusnya ada (screening otomatis tiap setoran).",
    },
  },
];

(misiJejakDana.steps as V2Step[]).push(...LANJUTAN_CHAIN_A);

// ── lanjutan misiJejakDana: audit + deliverable + debrief + rangkuman ────

const LANJUTAN_CHAIN_B: V2Step[] = [
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 18 wallet: temukan 3 sabotase",
    prose: [
      "Misi audit. Di bawah ini 18 wallet dari laporan firma audit — dossier yang diklaim “semua CLEAR”. Tiga sabotase disuntikkan tanpa pengumuman. Tapi ingat pelajaran Lab 1: dossier ini juga memuat wallet yang label risetnya berkata ransomware dan yang cocok daftar OFAC — itu BUKAN sabotase, itu temuan audit yang sah. Tandai yang janggal, buka debrief.",
      "Senjatamu: label (Lab 1: fitur perilaku tidak membedakan — label yang bicara), join OFAC (Lab 2), dan akal sehat tentang klaim KYC.",
    ],
    tasks: [],
    auditDossier: {
      version: "chain-pilot-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier firma audit mengklaim 18 wallet berikut “CLEAR — tidak ada indikasi aktivitas ilegal” (cuplikan alamat.csv + klaim laporan).",
      columns: ["Wallet", "Mixing", "Label riset"],
      rows: [
        { rowId: 1, cells: { "Wallet": "1HZE…kkaY", "Mixing": "0", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }] },
        { rowId: 2, cells: { "Wallet": "1BMj…dMB5", "Mixing": "0", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }] },
        { rowId: 3, cells: { "Wallet": "14vP…GhP1", "Mixing": "0", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }] },
        { rowId: 4, cells: { "Wallet": "13q6…9b9m", "Mixing": "144", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }] },
        { rowId: 5, cells: { "Wallet": "3M9Y…eBSE", "Mixing": "144", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }] },
        { rowId: 6, cells: { "Wallet": "1QB4…v6Bx", "Mixing": "144", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }] },
        { rowId: 7, cells: { "Wallet": "16jP…kUPq", "Mixing": "6", "Label riset": "princetonLocky" }, claims: [{ label: "Klaim audit", value: "CLEAR — perilaku normal" }] },
        { rowId: 8, cells: { "Wallet": "18JF…TDk", "Mixing": "42", "Label riset": "princetonLocky" }, claims: [{ label: "Klaim audit", value: "CLEAR — perilaku normal" }] },
        { rowId: 9, cells: { "Wallet": "1Mtg…EauT", "Mixing": "8", "Label riset": "montrealCryptXXX" }, claims: [{ label: "Klaim audit", value: "CLEAR — perilaku normal" }] },
        { rowId: 10, cells: { "Wallet": "1M4v…7XBq", "Mixing": "6", "Label riset": "montrealCryptXXX" }, claims: [{ label: "Klaim audit", value: "CLEAR — perilaku normal" }] },
        { rowId: 11, cells: { "Wallet": "149w…eq8C", "Mixing": "0", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }, { label: "Cek OFAC", value: "Tidak cocok" }] },
        { rowId: 12, cells: { "Wallet": "17UV…9stF", "Mixing": "18", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }, { label: "Cek OFAC", value: "Tidak cocok" }] },
        // ── K1: label KYC palsu ──
        { rowId: 13, cells: { "Wallet": "1EXG…ueK9", "Mixing": "6", "Label riset": "princetonLocky" }, claims: [{ label: "Klaim audit", value: "CLEAR" }, { label: "KYC", value: "Terverifikasi: PT Maju Bersama" }] },
        { rowId: 14, cells: { "Wallet": "17Tz…x4QmC", "Mixing": "30", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }, { label: "KYC", value: "Terverifikasi: PT Maju Bersama" }] },
        // ── K2: entitas duplikat, nama sedikit berbeda ──
        { rowId: 15, cells: { "Wallet": "1HZE…kkaY", "Mixing": "0", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }, { label: "Pemilik", value: "PT Maju Bersama" }] },
        { rowId: 16, cells: { "Wallet": "1BMj…dMB5", "Mixing": "0", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }, { label: "Pemilik", value: "PT Maju BERSAMA" }] },
        // ── K3: klaim "mixer = bersih" ──
        { rowId: 17, cells: { "Wallet": "1295…NDMV", "Mixing": "144", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }, { label: "Catatan", value: "Sempat tersanksi OFAC — sudah lewat mixer, kini bersih" }] },
        { rowId: 18, cells: { "Wallet": "1AXU…cMrn", "Mixing": "0", "Label riset": "white" }, claims: [{ label: "Klaim audit", value: "CLEAR" }, { label: "Catatan", value: "Sempat tersanksi OFAC — sudah lewat mixer, kini bersih" }] },
      ],
      injections: [
        { key: "kyc-palsu", rowIds: [13, 14], title: "Label KYC palsu", clue: "“Terverifikasi: PT Maju Bersama” ditempel pada wallet berlabel princetonLocky (baris 13) — KYC tidak menghapus label riset ransomware. Verifikasi pemilik ≠ verifikasi perilaku.", danger: "KYC palsu/asal tempel memberi rasa aman palsu; exchange memproses dana ransomware dengan “dokumen lengkap”." },
        { key: "entitas-duplikat", rowIds: [15, 16], title: "Entitas duplikat, nama sedikit berbeda", clue: "“PT Maju Bersama” vs “PT Maju BERSAMA” — dua wallet berbeda diklaim milik entitas yang “sama” dengan ejaan berbeda. Tanpa entity resolution, satu entitas bisa punya N identitas.", danger: "Teknik klasik layering: pecah identitas agar tidak terlihat sebagai satu kesatuan." },
        { key: "mixer-bersih", rowIds: [17, 18], title: "Klaim “sudah lewat mixer = bersih”", clue: "Dossier sendiri mengakui wallet ini “sempat tersanksi OFAC” — lalu mengklaim mixer menghapus statusnya. Itu miskonsepsi hukum: sanksi melekat pada alamat/orang, bukan pada riwayat transaksi.", danger: "Memproses dana sanksi = denda regulator per pelanggaran. “Firma audit bilang bersih” bukan pembelaan hukum." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Laporan investigasi untuk Head of Compliance",
    prose: [
      "Tulis laporan investigasi seperti akan dibaca regulator: temuan per wallet, bukti (label + join OFAC + analisis fitur), rekomendasi bekukan/pantau/lepas, dan batas analisismu.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): berapa wallet bermasalah, apa rekomendasi utamamu.",
        "Temuan per kategori: (a) berlabel ransomware tapi diklaim bersih; (b) cocok OFAC tapi diklaim tidak; (c) sabotase KYC/entitas/mixer.",
        "Rekomendasi per wallet: BEKUKAN / PANTAU / LEPAS — dengan bukti per baris.",
        "Kelemahan metodologi firma audit: apa yang salah dari pendekatan “perilaku saja”.",
        "Batas analisis: label riset ≠ vonis hukum; tidak ada edge list (bukan hop-tracing); snapshot OFAC bertanggal 2026-10-15.",
      ],
      rubric: [
        { criterion: "Deteksi sabotase & temuan", weight: 30, levels: ["Tidak menemukan", "Sebagian tanpa bukti", "Ketiga sabotase + temuan label/OFAC dengan bukti"] },
        { criterion: "Kebenaran analisis fitur", weight: 20, levels: ["Salah baca distribusi", "Benar tapi tak dimaknai", "Temuan “fitur bisu” dimaknai: klaim perilaku tak berfondasi"] },
        { criterion: "Kualitas keputusan", weight: 25, levels: ["Tanpa kriteria", "Kriteria ada", "Kriteria + bukti per wallet + proporsionalitas"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim pasti", "Sebagian batas", "Label≠vonis, tanpa edge list, snapshot bertanggal — eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Tiga sabotase — dan pelajaran tentang “bersih”",
    prose: [
      "Debrief dibuka. Tiga sabotase yang disuntikkan:",
      "1) **KYC palsu** (baris 13–14): stempel “Terverifikasi: PT Maju Bersama” ditempel bahkan pada wallet berlabel princetonLocky. Di dunia nyata: dokumen KYC bisa dipalsukan atau “dibeli”; verifikasi identitas tidak sama dengan verifikasi perilaku dana.",
      "2) **Entitas duplikat** (baris 15–16): “PT Maju Bersama” vs “PT Maju BERSAMA”. Tanpa entity resolution, sistem kepatuhan melihat dua entitas berbeda. Teknik layering klasik: pecah identitas, pecah perhatian.",
      "3) **Klaim mixer = bersih** (baris 17–18): dossier sendiri mengakui status sanksi, lalu mengklaim mixer menghapusnya. Ini bukan sekadar salah — ini miskonsepsi yang dijual sebagai jasa profesional.",
      "Dan dua temuan yang BUKAN sabotase — melainkan inti profesimu: (a) wallet berlabel ransomware yang diklaim “perilaku normal” (baris 7–10): label riset adalah sinyal yang harus dihormati; (b) wallet yang “tidak cocok OFAC” menurut dossier tapi SEBENARNYA cocok (baris 11–12): satu JOIN yang tidak dilakukan firma audit.",
      "Pelajaran terbesar misi ini datang dari Lab 1: median mixing ransomware (6,0) vs white (8,0) — hampir identik. Fitur perilaku yang paling “canggih” pun bisa bisu. Investigator yang hanya mengandalkan perilaku sedang menebak; investigator yang memakai label + orakel sanksi sedang membuktikan. Dan “bersih” bukanlah sifat teknis — itu vonis kepatuhan yang harus bisa dipertahankan di depan regulator.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: audit selesai saat laporan dikirim",
      type: "risk",
      body: "Sama seperti misi DBD: rekomendasi “bekukan/pantau” baru bernilai kalau dieksekusi dan diverifikasi. Screening sanksi harus OTOMATIS di tiap setoran — bukan proyek triwulanan.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Fitur perilaku bisa bisu: median mixing_rounds ransomware (6,0) vs white (8,0) hampir identik — klaim “bersih berdasarkan perilaku” tidak berfondasi tanpa label + orakel.",
      "Tiga pola sabotase kepatuhan: KYC palsu (identitas ≠ perilaku), entitas duplikat (tanpa entity resolution, satu pelaku = N identitas), klaim “mixer = bersih” (sanksi melekat pada alamat/orang).",
      "Satu JOIN vs daftar OFAC membatalkan seluruh laporan audit — screening sanksi harus otomatis per setoran.",
      "Keputusan bekukan/pantau/lepas harus proporsional dan terdokumentasi per wallet: keamanan tanpa presisi = kegagalan lain.",
      "Data: BitcoinHeist (CC BY 4.0, 46.413 baris) + daftar sanksi OFAC (public domain, snapshot 2026-10-15). Tanpa edge list — misi ini audit laporan, bukan hop-tracing.",
    ],
  },
];

(misiJejakDana.steps as V2Step[]).push(...LANJUTAN_CHAIN_B);
