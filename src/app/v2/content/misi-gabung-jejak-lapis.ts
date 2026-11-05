import type { V2Mission } from "../lib/types";

// ── MISI Jejak Lapis: Fiat → Rantai → Fiat ───────────────────────────────
// CAPSTONE C — Fraud/AML (kombinasi). Dataset campuran berlisensi jelas:
//  - alamat_label.csv: slice 300 alamat BitcoinHeist, UCI ML Repository, CC BY 4.0
//  - onramp.csv / offramp.csv: SINTETIS (seed 42), 120 baris masing-masing
//  - watchlist.csv: SINTETIS, dinyatakan simulasi (BUKAN daftar OFAC/SDN asli)
// File: public/misi/misi-gabung-jejak-lapis/ (+ METODE.md). Snapshot < 5 MB.

const BASE = "/misi/misi-gabung-jejak-lapis";

export const misiGabungJejakLapis: V2Mission = {
  slug: "misi-gabung-jejak-lapis",
  track: "Fraud/AML",
  module: "Misi",
  title: "Misi Jejak Lapis: Fiat → Rantai → Fiat",
  estMinutes: 180,
  role: "Investigator AML",
  client:
    "Head of Compliance — pola setoran tunai terstruktur terdeteksi diikuti pembelian kripto; putuskan apakah ini pencucian berlapis sebelum dana mencapai rekening tujuan",
  xp: 900,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Uang tunai yang terlalu rapi",
      prose: [],
      tasks: [],
      briefing: {
        role: "Investigator AML di sebuah bank — pemburu jejak dana lintas sistem",
        client:
          "Head of Compliance. Sistem monitoring menandai 10 nasabah dengan pola setoran tunai yang “terlalu rapi”: selalu di bawah ambang lapor, selalu tunai, tersebar di tiga kota. Delapan di antaranya terhubung ke pembelian kripto dan penarikan kembali ke rupiah. Exchange tempat mereka membeli mengirim laporan kepatuhan yang menyimpulkan semuanya bersih. Kamu diminta membuktikan — dengan data, bukan dengan firasat — apakah ini pencucian berlapis (layering) fiat → rantai → fiat, dan menulis laporan investigasi untuk regulator beserta rekomendasi LTKM.",
        story: [
          "Senin, 08:12. Notifikasi monitoring berdenyut merah di dasbor: sepuluh nasabah, tiga kota, satu pola. Setiap setoran tunai berhenti tepat di bawah Rp100 juta — ambang monitoring internal bank. Tidak pernah Rp100 juta pas, tidak pernah di atasnya. Selalu tunai, selalu di cabang berbeda-beda, seolah-olah seseorang membaca buku manual anti-pencucian lalu memutuskan untuk menari tepat di garisnya.",
          "Yang membuat lehermu merinding: delapan dari sepuluh nama itu membeli kripto — lalu, beberapa hari kemudian, rupiah mengalir kembali ke rekening bank. Fiat masuk, rantai berputar, fiat keluar. Buku teks menyebutnya layering: melapisi transaksi agar asal-usul dana tak terlacak. Dan exchange-nya baru saja mengirim laporan resmi: “dana sudah bersih dari mixer, tidak perlu LTKM.”",
          "Kamu tahu aturan mainnya. Laporan pihak ketiga bukan vonis — ia barang bukti yang harus diaudit seperti barang bukti lainnya. Misi ini memberimu empat file: setoran fiat, penarikan fiat, 300 alamat on-chain berlabel dari dataset penelitian BitcoinHeist (CC BY 4.0), dan sebuah watchlist simulasi. Tugasmu: sambungkan ketiganya, beri skor pada tiap lapisan, temukan dua alamat yang “tidak ada” menurut laporan exchange, dan putuskan nasib dana Rp7,7 miliar ini.",
        ],
        objectives: [
          "Menyambungkan onramp → alamat on-chain → offramp menjadi 8 jalur lengkap dan menghitung skor layering tiap dompet (hop, mixing rounds, jeda waktu).",
          "Melakukan screening watchlist dengan SQL dan membuktikan 2 kecocokan yang disembunyikan laporan exchange.",
          "Menemukan 4 sabotase di laporan kepatuhan exchange dan menulis laporan investigasi untuk regulator dengan rekomendasi LTKM yang dipertahankan.",
        ],
        prereqSummary:
          "Layering = tahap pencucian uang di mana dana dipindah berlapis-lapis (di sini: tunai → kripto → rupiah) untuk memutus jejak asal-usulnya. Structuring = memecah setoran menjadi kecil-kecil di bawah ambang lapor agar tidak terdeteksi. Watchlist/daftar sanksi = daftar alamat/entitas yang dilarang disentuh (mis. OFAC SDN) — bank wajib memblokir dana yang menyentuhnya, dan kegagalan screening bisa berujung denda regulator. Yang penting di sini bukan menghafal istilahnya, melainkan logikanya: satu hop yang hilang dari laporan = satu kesempatan dana kotor lolos.",
        datasetNote:
          "Sumber campuran berlisensi jelas. (a) alamat_label.csv: slice 300 alamat Bitcoin Heist Ransomware Address Dataset, UCI Machine Learning Repository (CC BY 4.0 — atribusi penuh di METODE.md): 236 white + 64 dua keluarga ransomware (montrealCryptoLocker, montrealCryptXXX), dipakai sebagai PROXY pola mixing, bukan vonis kriminal. (b) onramp.csv + offramp.csv: SINTETIS (seed 42), masing-masing 120 baris fiktif. (c) watchlist.csv: 12 alamat SINTETIS yang dinyatakan SIMULASI — BUKAN daftar OFAC/SDN asli, tidak berlaku untuk kepatuhan nyata. Metode: file METODE.md di folder yang sama. Snapshot 43 KB.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Empat file, satu rantai",
      prose: [
        "Empat file menunggumu — masing-masing hanya melihat sepotong rantai. `onramp.csv` adalah pintu masuk: 120 setoran tunai (deposit_id, tanggal, nasabah_id, nama_samaran, jumlah_idr, cabang, wallet_id, alamat_onchain). Delapan nasabah terhubung ke dompet W001–W008 dan alamat on-chain; dua nasabah (N009, N010) hanya setor tanpa kelanjutan — jalur buntu, atau umpan.",
        "`offramp.csv` adalah pintu keluar: 120 penarikan (penarikan_id, tanggal, wallet_id, jumlah_idr, rekening_tujuan, bank_tujuan). `alamat_label.csv` adalah kaca pembesar on-chain: 300 alamat berlabel dari dataset penelitian — kolom count, looped, neighbors, dan income adalah bahannya untuk mengukur seberapa “campur” sebuah alamat. `watchlist.csv` adalah orakelnya: 12 alamat contoh untuk latihan screening sanksi, lengkap dengan label SIMULASI.",
        "Aturan main: (1) jalur lengkap = dompet dengan minimal 1 setoran DAN 1 penarikan; (2) mixing dihitung dari fitur on-chain, bukan dari labelnya; (3) laporan exchange adalah klaim yang harus diverifikasi, bukan kebenaran.",
      ],
      tasks: [
        { id: "t1", text: "Buka `onramp.csv`: catat jumlah baris dan kolom penghubung ke dompet" },
        { id: "t2", text: "Buka `offramp.csv` dan `watchlist.csv`: pahami kunci join antar file" },
        { id: "t3", text: "Buka `alamat_label.csv`: catat tiga label yang ada dan arti kolom `count`, `looped`, `neighbors`" },
      ],
      note: {
        title: "Miskonsepsi #1: label dataset = vonis kriminal",
        type: "pitfall",
        body: "Melihat label “montrealCryptXXX” pada sebuah alamat, insting berkata “ini alamat penjahat”. SALAH — dan berbahaya. Itu label dataset penelitian perilaku transaksi 2011–2018, dipakai di sini HANYA sebagai proxy pola mixing (alamat dengan banyak tetangga dan transaksi berputar). Investigator sungguhan tidak memblokir rekening berdasarkan label dataset; ia memblokir berdasarkan bukti aliran dana + daftar sanksi resmi. Di misi ini pun: yang menentukan skor adalah fitur on-chain-nya, bukan labelnya.",
      },
      reference:
        "onramp.csv (120 setoran) → alamat_label.csv (300 alamat, CC BY 4.0) → offramp.csv (120 penarikan); watchlist.csv (12 alamat SIMULASI) sebagai orakel screening.",
    },
    {
      id: "sinyal-structuring",
      eyebrow: "Langkah 3 · Sinyal structuring",
      title: "Setoran yang berdiri tepat di bawah ambang",
      prose: [
        "Lihat kolom jumlah_idr di onramp.csv — bukan satu per satu, tapi distribusinya. Dari 120 setoran, 96 di antaranya mendarat di pita Rp90–100 juta: tidak pernah menyentuh Rp100 juta, tidak pernah jauh di bawahnya. Itu bukan kebetulan statistik; itu tanda tangan structuring — teknik memecah dana besar menjadi setoran-setoran di bawah ambang lapor agar luput dari radar.",
        "Tiga detail memperkuat sinyalnya. Pertama, semuanya TUNAI — jejak paling sulit dilacak. Kedua, tersebar di tiga cabang (Jakarta Selatan, Surabaya, Medan), bahkan untuk SATU nasabah yang sama — orang normal tidak menyetor tunai di tiga kota dalam dua minggu. Ketiga, 12 nasabah pembanding (L001–L012) menunjukkan pola wajar: ada yang kecil, ada yang di atas Rp100 juta dan tercatat normal — justru yang patuh ambang terlihat “berani”, yang menghindar terlihat takut.",
        "Satu catatan jujur: structuring adalah POLA, bukan bukti. Usaha kecil yang setor rutin di bawah ambang karena memang omzetnya segitu bukanlah pencucian. Yang mengubah pola menjadi kasus adalah kombinasinya: tunai + multi-kota + berlanjut ke kripto + kembali ke fiat. Misi ini menilai kombinasinya, bukan satu cirinya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung dari `onramp.csv`: berapa setoran dengan 90 juta ≤ jumlah < 100 juta (jawaban: 96)" },
        { id: "t2", text: "Kelompokkan per nasabah: nasabah mana yang setor di lebih dari satu cabang" },
        { id: "t3", text: "Bandingkan dengan nasabah L001–L012: apa beda polanya" },
      ],
      note: {
        title: "Miskonsepsi #2: di bawah ambang = aman secara hukum",
        type: "risk",
        body: "“Kan tidak melanggar ambang, jadi legal.” SALAH total — justru di situlah jebakannya. Structuring (memecah transaksi untuk menghindari ambang lapor) adalah tindak pidana tersendiri di banyak yurisdiksi, terlepas dari apakah dana awalnya bersih atau kotor. Ambang lapor adalah alat deteksi, bukan garis moral: menari di bawahnya dengan sengaja adalah sinyal, bukan perlindungan.",
      },
      reference:
        "96 dari 120 setoran berada di pita Rp90–100 juta; 10 nasabah suspek (N001–N010) vs 12 nasabah pembanding (L001–L012).",
    },
    {
      id: "lab-rantai",
      eyebrow: "Langkah 4 · Lab 1 — Jejak tiga file",
      title: "Sambungkan rantai: dari kasir ke rekening",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Gabungkan tiga file menjadi jalur lengkap per dompet: setoran (onramp) → fitur alamat (alamat_label) → penarikan (offramp). Dari tiap dompet hitung tiga komponen skor layering: h = jumlah hop (selalu 3 untuk jalur lengkap: fiat masuk → alamat on-chain → fiat keluar), m = mixing rounds dari fitur on-chain, d = jeda hari antara setoran pertama dan penarikan pertama.",
        "Mixing rounds dihitung dari perilaku, bukan label: +1 bila count ≥ 50 (banyak transaksi), +1 bila neighbors ≥ 25 (banyak tetangga), +1 bila looped ≥ 1 (ada putaran). Alamat dengan skor 2–3 berperilaku seperti mixer: dana dipecah, diputar, disatukan kembali — persis yang ingin dilakukan layering.",
      ],
      tasks: [
        { id: "t1", text: "Muat 3 CSV; hitung `n_baris_onramp` dan `n_setoran_terstruktur` (90 jt ≤ jumlah < 100 jt)" },
        { id: "t2", text: "Join onramp → alamat_label; hitung `mixing_rounds` per alamat dari count/neighbors/looped" },
        { id: "t3", text: "Bentuk 8 jalur lengkap; hitung `skor_layering`, `top_wallet`, `median_jeda`, `total_dana`" },
      ],
      expected:
        "n_baris_onramp=120, n_setoran_terstruktur=96, n_jalur_lengkap=8, top_wallet=W001 (skor 10), median_jeda=12,5 hari, total_dana=Rp7.702.566.016",
      formula: String.raw`S = h + 2m + \left\lfloor\frac{d}{7}\right\rfloor`,
      formulaNote:
        "S = skor layering per dompet; h = jumlah hop (3 untuk jalur lengkap: setoran → alamat → penarikan); m = mixing rounds (0–3 dari fitur on-chain); d = jeda hari setor→tarik, dibagi 7 lalu dibulatkan ke bawah (lapisan butuh waktu — jeda 3 minggu “bernilai” 3 poin). Bobot 2 pada m karena obfuscation adalah inti layering. Contoh konkret: W001 → h=3, m=2, d=21 → S = 3 + 4 + 3 = 10, tertinggi dari 8 jalur.",
      note: {
        title: "Miskonsepsi #3: skor tinggi = terbukti bersalah",
        type: "pitfall",
        body: "Skor layering 10 pada W001 BUKAN vonis — ia prioritas investigasi. Skor menjawab “mana yang paling pantas diperiksa duluan”, bukan “mana yang pasti kriminal”. Investigator yang baik memakai skor untuk mengalokasikan waktu, lalu membangun bukti (aliran dana + dokumen + screening sanksi) sebelum menuduh. Jangan biarkan angka menggantikan pembuktian.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(BASE + \"/onramp.csv\"), parse_dates=[\"tanggal\"])` — BASE sudah disiapkan.",
        "Setoran terstruktur: `((onramp[\"jumlah_idr\"] >= 90000000) & (onramp[\"jumlah_idr\"] < 100000000)).sum()` — hati-hati, kolom wallet_id yang kosong terbaca NaN, saring dengan `.notna()`.",
        "mixing_rounds: `(lab[\"count\"] >= 50).astype(int) + (lab[\"neighbors\"] >= 25).astype(int) + (lab[\"looped\"] >= 1).astype(int)` — hitung SEBELUM join.",
        "Jalur lengkap = inner join agregat setoran dengan agregat penarikan per wallet_id (dompet noise WX hanya punya penarikan → tersaring otomatis).",
        "jeda_hari: `(tgl_tarik_awal - tgl_setor_awal).dt.days`; skor = `n_hop + 2*mixing + (jeda_hari // 7)`; median pakai `.median()`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-jejak-lapis\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "onramp = pd.read_csv(open_url(BASE + \"/onramp.csv\"), parse_dates=[\"tanggal\"])",
          "offramp = pd.read_csv(open_url(BASE + \"/offramp.csv\"), parse_dates=[\"tanggal\"])",
          "label = pd.read_csv(open_url(BASE + \"/alamat_label.csv\"))",
          "",
          "n_baris_onramp = ...",
          "n_setoran_terstruktur = ...   # 90_000_000 <= jumlah_idr < 100_000_000",
          "",
          "dep = onramp[...]   # hanya baris dengan wallet_id terisi",
          "lab = label[[\"address\", \"count\", \"looped\", \"neighbors\"]].copy()",
          "lab[\"mixing_rounds\"] = ...",
          "m1 = dep.merge(lab, left_on=\"alamat_onchain\", right_on=\"address\", how=\"left\")",
          "m1[\"mixing_rounds\"] = m1[\"mixing_rounds\"].fillna(0).astype(int)",
          "mix_w001 = ...   # mixing_rounds alamat dompet W001",
          "",
          "g_dep = m1.groupby(\"wallet_id\").agg(...)   # n_setoran, total_setoran, tgl_setor_awal, mixing (max)",
          "g_wd = offramp[...].groupby(\"wallet_id\").agg(...)   # tgl_tarik_awal (saring dompet jalur dulu)",
          "jalur = g_dep.join(g_wd, how=\"inner\")",
          "jalur[\"n_hop\"] = 3",
          "jalur[\"jeda_hari\"] = ...",
          "jalur[\"skor_layering\"] = ...",
          "",
          "n_jalur_lengkap = ...",
          "top_wallet = ...",
          "top_skor = ...",
          "median_jeda = ...",
          "total_dana = ...",
          "",
          "print(\"baris onramp:\", n_baris_onramp, \"| terstruktur:\", n_setoran_terstruktur)",
          "print(\"jalur lengkap:\", n_jalur_lengkap)",
          "print(\"teratas:\", top_wallet, \"skor\", top_skor)",
          "print(\"median jeda:\", median_jeda, \"| total dana:\", total_dana)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-jejak-lapis\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "onramp = pd.read_csv(open_url(BASE + \"/onramp.csv\"), parse_dates=[\"tanggal\"])",
          "offramp = pd.read_csv(open_url(BASE + \"/offramp.csv\"), parse_dates=[\"tanggal\"])",
          "label = pd.read_csv(open_url(BASE + \"/alamat_label.csv\"))",
          "",
          "n_baris_onramp = len(onramp)",
          "n_setoran_terstruktur = int(((onramp[\"jumlah_idr\"] >= 90000000) & (onramp[\"jumlah_idr\"] < 100000000)).sum())",
          "",
          "dep = onramp[onramp[\"wallet_id\"].notna() & (onramp[\"wallet_id\"] != \"\")].copy()",
          "lab = label[[\"address\", \"count\", \"looped\", \"neighbors\"]].copy()",
          "lab[\"mixing_rounds\"] = (lab[\"count\"] >= 50).astype(int) + (lab[\"neighbors\"] >= 25).astype(int) + (lab[\"looped\"] >= 1).astype(int)",
          "m1 = dep.merge(lab, left_on=\"alamat_onchain\", right_on=\"address\", how=\"left\")",
          "m1[\"mixing_rounds\"] = m1[\"mixing_rounds\"].fillna(0).astype(int)",
          "",
          "g_dep = m1.groupby(\"wallet_id\").agg(n_setoran=(\"deposit_id\", \"count\"), total_setoran=(\"jumlah_idr\", \"sum\"), tgl_setor_awal=(\"tanggal\", \"min\"), mixing=(\"mixing_rounds\", \"max\"))",
          "g_wd = offramp[offramp[\"wallet_id\"].isin(g_dep.index)].groupby(\"wallet_id\").agg(tgl_tarik_awal=(\"tanggal\", \"min\"))",
          "jalur = g_dep.join(g_wd, how=\"inner\")",
          "jalur[\"n_hop\"] = 3",
          "jalur[\"jeda_hari\"] = (jalur[\"tgl_tarik_awal\"] - jalur[\"tgl_setor_awal\"]).dt.days",
          "jalur[\"skor_layering\"] = jalur[\"n_hop\"] + 2 * jalur[\"mixing\"] + (jalur[\"jeda_hari\"] // 7)",
          "",
          "n_jalur_lengkap = len(jalur)",
          "mix_w001 = int(m1.loc[m1[\"wallet_id\"] == \"W001\", \"mixing_rounds\"].iloc[0])",
          "top_wallet = jalur[\"skor_layering\"].idxmax()",
          "top_skor = int(jalur.loc[top_wallet, \"skor_layering\"])",
          "median_jeda = float(jalur[\"jeda_hari\"].median())",
          "total_dana = int(jalur[\"total_setoran\"].sum())",
          "",
          "print(\"baris onramp:\", n_baris_onramp, \"| terstruktur:\", n_setoran_terstruktur)",
          "print(\"jalur lengkap:\", n_jalur_lengkap)",
          "print(\"teratas:\", top_wallet, \"skor\", top_skor)",
          "print(\"median jeda:\", median_jeda, \"| total dana:\", total_dana)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`onramp` termuat", name: "onramp", msg: "onramp harus berisi DataFrame dari onramp.csv." },
          { kind: "equal", task: "t1", label: "`n_baris_onramp` = 120", name: "n_baris_onramp", value: 120, msg: "File onramp.csv punya 120 baris setoran." },
          { kind: "equal", task: "t1", label: "`n_setoran_terstruktur` = 96", name: "n_setoran_terstruktur", value: 96, msg: "96 setoran mendarat di pita Rp90–100 juta (di bawah ambang Rp100 juta)." },
          { kind: "equal", task: "t2", label: "mixing W001 = 2", name: "mix_w001", value: 2, msg: "Alamat W001: count/neighbors/looped memenuhi 2 dari 3 syarat mixing." },
          { kind: "equal", task: "t3", label: "`n_jalur_lengkap` = 8", name: "n_jalur_lengkap", value: 8, msg: "8 dompet punya setoran DAN penarikan (inner join menyaring dompet noise)." },
          { kind: "equal", task: "t3", label: "`top_wallet` = W001", name: "top_wallet", value: "W001", msg: "W001: h=3, m=2, d=21 → skor 10, tertinggi." },
          { kind: "equal", task: "t3", label: "`top_skor` = 10", name: "top_skor", value: 10, msg: "3 + 2×2 + (21 // 7) = 10." },
          { kind: "equal", task: "t3", label: "`median_jeda` = 12,5", name: "median_jeda", value: 12.5, tol: 0.01, msg: "Median jeda setor→tarik 8 jalur = 12,5 hari." },
          { kind: "equal", task: "t3", label: "`total_dana` = 7702566016", name: "total_dana", value: 7702566016, tol: 1, msg: "Total setoran 8 jalur = Rp7.702.566.016." },
        ],
      },
    },
    {
      id: "minicase-w003",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Satu dompet, dari kasir ke rekening: W003",
      prose: [
        "Ikuti satu jalur sampai ujung — W003, milik nasabah N003 (“Rina Marlina”). 3 Juni 2026: setoran tunai pertama Rp96 juta di Jakarta Selatan. Lalu 9 setoran lagi hingga 14 Juni, total 10 setoran senilai Rp969.103.982 — semuanya tunai, semuanya di bawah Rp100 juta, tersebar di TIGA kota: Jakarta Selatan, Surabaya, Medan. Satu orang, dua minggu, tiga kota. Orang normal tidak menyetor tunai seperti itu.",
        "Dana mengalir ke alamat 1246v8SAeajt6k3QFVzp4My8U13PLZTyV4 — label dataset montrealCryptXXX, mixing rounds 2 (banyak transaksi + banyak tetangga). Lalu kembali ke fiat: 3 penarikan total Rp948.384.445 ke rekening BRI, Mandiri, dan BCA. Perhatikan dua hal: 97,9% dana KEMBALI — “biaya” layering hanya 2,1%, murah untuk pencucian. Dan penarikan PERTAMA (9 Juni) terjadi SEBELUM setoran terakhir (14 Juni) — jalurnya berjalan paralel, bukan sekuensial. Ini bukan orang iseng; ini operasional.",
        "Jeda setor→tarik: 6 hari → skor layering 7 (3 + 2×2 + 0). Bukan yang tertinggi — W001 (skor 10) lebih “panas”. Tapi W003 menyimpan kejutan terbesar: alamatnya cocok dengan watchlist CONTOH-SIM-01. Pelajaran mini-case ini: prioritas investigasi (skor) dan urgensi kepatuhan (watchlist hit) adalah dua sumbu berbeda — dompet paling berbahaya belum tentu yang skornya tertinggi.",
      ],
      tasks: [
        { id: "t1", text: "Verifikasi di `onramp.csv`: 10 setoran N003, total Rp969.103.982, 3 cabang" },
        { id: "t2", text: "Verifikasi di `offramp.csv`: 3 penarikan W003 = Rp948.384.445 (97,9% kembali)" },
        { id: "t3", text: "Catat anomali waktu: tarik pertama 2026-06-09 vs setor terakhir 2026-06-14" },
      ],
      note: {
        title: "Yang diajarkan W003: dua sumbu risiko",
        type: "risk",
        body: "Sumbu 1 = pola (skor layering): seberapa keras usaha menyembunyikan. Sumbu 2 = sanksi (watchlist hit): seberapa fatal bila lolos. W001 menang di sumbu 1 (skor 10); W003 menang di sumbu 2 (CONTOH-SIM-01). Keputusan “bekukan duluan yang mana” memakai KEDUANYA — dan inilah kenapa Lab 2 sama pentingnya dengan Lab 1.",
      },
      reference:
        "W003: 10 setoran Rp969.103.982 (3 kota) → mixing 2 → 3 penarikan Rp948.384.445 (3 bank); jeda 6 hari; skor 7; watchlist CONTOH-SIM-01.",
    },
    {
      id: "lab-watchlist",
      eyebrow: "Langkah 6 · Lab 2 — Screening sanksi",
      title: "Orakel buta: dua alamat yang “tidak ada”",
      prose: [
        "Laporan exchange mengklaim screening watchlist menghasilkan “0 alamat cocok”. Kamu akan menguji klaim itu dengan SQL — terhadap data yang sama yang mereka klaim sudah diperiksa. Tabel `rantai` berisi 12 alamat: 8 alamat jalur (W001–W008) plus 4 alamat on-chain lain yang tidak dipakai jalur mana pun. Tabel `watchlist` berisi 12 alamat contoh SIMULASI.",
        "Tugas: JOIN kedua tabel dan tampilkan dompet mana saja yang alamatnya cocok dengan watchlist. Bila hasilmu bukan “0 cocok”, maka klaim exchange runtuh — dan kamu baru saja menemukan alasan kenapa lampiran mereka hanya memuat 6 alamat.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query JOIN rantai–watchlist; tampilkan wallet_id, alamat, alias, urut per wallet_id" },
      ],
      expected: "2 baris — W003 cocok CONTOH-SIM-01, W007 cocok CONTOH-SIM-02. Klaim “0 cocok” terbukti salah.",
      sqlLab: {
        task: "Screening sanksi: JOIN alamat jalur (rantai) dengan watchlist. Tampilkan wallet_id, alamat, dan alias untuk setiap kecocokan, urut berdasarkan wallet_id.",
        schema: "CREATE TABLE rantai (wallet_id TEXT, alamat TEXT, label TEXT, mixing INTEGER);\nCREATE TABLE watchlist (alamat TEXT, alias TEXT);",
        seedData: [
          "INSERT INTO rantai VALUES",
          "('W001','126sk8mK4pKPGStciNssscEoEU8eeiqoUV','montrealCryptoLocker',2),",
          "('W002','124cUCq1tkYhFf39NAnN6dYRwkLrvBNLAx','montrealCryptXXX',2),",
          "('W003','1246v8SAeajt6k3QFVzp4My8U13PLZTyV4','montrealCryptXXX',2),",
          "('W004','12afJVxkHxYQ7sjp7uMuC8vnY4kmTKxAMH','montrealCryptXXX',2),",
          "('W005','12ne1Ppi7xSn3LV3dRs3U5Qys9BKCT2jz7','montrealCryptXXX',2),",
          "('W006','12iTSj5roT3pDQQ5roKrfF5Vckfugbdj22','montrealCryptXXX',2),",
          "('W007','12nT8VveQVkoAHBxwsS8JbGx9snaGLUmRa','montrealCryptXXX',1),",
          "('W008','12NGK6Cz6pG7J7AU9EYZb27fihS2vez3vr','montrealCryptXXX',1),",
          "('','1MCfkbdt4yfCMLC2bPqbXQDNxN6MkSyDQp','white',1),",
          "('','13qz358ZyodCzX7iC84jMJ45BrvbaX66Fz','white',0),",
          "('','1NiAn2fid1vrDT9J34C15fCbCmocJijADS','white',0),",
          "('','18UMHGHgJYjSeosdNvjtE8qGpgX2bEsK23','white',0);",
          "INSERT INTO watchlist VALUES",
          "('bc1c3w5rwz5e3yd5dleafsg0smehwgl9r8f','CONTOH-SIM-05'),",
          "('bc1yz4y03ldg7076vxxmkm6arxre4x0vvug','CONTOH-SIM-08'),",
          "('bc1rr5rr72r9tyy0e80z965sd50segna5yq','CONTOH-SIM-10'),",
          "('bc1mt3a0yuxrq9026l7der2cqcsajmlfvjd','CONTOH-SIM-09'),",
          "('12nT8VveQVkoAHBxwsS8JbGx9snaGLUmRa','CONTOH-SIM-02'),",
          "('bc1kksza8c9jhvyzwj9wxc3ah2hkd3y202a','CONTOH-SIM-04'),",
          "('bc1axydsgky0hj2unqnxgs8xf3jd4dslsr9','CONTOH-SIM-11'),",
          "('bc12myccasq8348jm2aqstxnvfh2q5lp8hn','CONTOH-SIM-06'),",
          "('bc1m3zq4gs2umq8yfzhfmgznhzkd0xk6f02','CONTOH-SIM-12'),",
          "('1246v8SAeajt6k3QFVzp4My8U13PLZTyV4','CONTOH-SIM-01'),",
          "('bc10r099lygg72smdvnehuu80wy4pwwqyrw','CONTOH-SIM-07'),",
          "('bc18p30wgx9mzp9dwpv6wu3q2m43fd4x9cx','CONTOH-SIM-03');",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT r.wallet_id, r.alamat, w.alias\nFROM rantai r\n",
        solution: [
          "SELECT r.wallet_id, r.alamat, w.alias",
          "FROM rantai r JOIN watchlist w ON r.alamat = w.alamat",
          "ORDER BY r.wallet_id;",
        ].join("\n"),
        expectedColumns: ["wallet_id", "alamat", "alias"],
        expectedRows: [
          ["W003", "1246v8SAeajt6k3QFVzp4My8U13PLZTyV4", "CONTOH-SIM-01"],
          ["W007", "12nT8VveQVkoAHBxwsS8JbGx9snaGLUmRa", "CONTOH-SIM-02"],
        ],
        orderMatters: true,
      },
    },
    {
      id: "orakel",
      eyebrow: "Langkah 7 · Orakel daftar sanksi",
      title: "Mesin yang hanya sebagus daftarnya",
      prose: [
        "Screening sanksi bekerja seperti orakel: kamu bertanya “apakah alamat ini terlarang?”, ia menjawab dari daftar yang ia pegang. Orakel tidak pernah berbohong — tapi ia hanya menjawab dari daftar yang DIBERI. Beri ia lampiran 6 alamat yang sudah disunat, ia akan menjawab “0 cocok” dengan jujur. Kejujuran itu tidak berguna bila pertanyaannya dimanipulasi.",
        "Tiga syarat agar jawaban orakel bisa dipercaya: (1) INPUT lengkap — semua alamat dari semua jalur, bukan subset pilihan; (2) DAFTAR mutakhir — daftar sanksi resmi berubah tiap minggu, daftar basi = lubang; (3) TINDAK LANJUT — kecocokan berarti segel + eskalasi, bukan catatan. Exchange gagal di syarat pertama: 2 dari 8 alamat tidak pernah masuk mesin screening mereka.",
        "Dan satu batas yang jujur: watchlist misi ini adalah SIMULASI 12 alamat contoh. Di dunia nyata, yang dipakai adalah daftar resmi (OFAC SDN, EU, PBB) — dan “cocok dengan daftar simulasi” tidak punya kekuatan hukum apa pun. Jangan pernah memakai file latihan ini untuk keputusan kepatuhan nyata.",
      ],
      tasks: [
        { id: "t1", text: "Jawab 3 kuis orakel di bawah — baca feedback tiap opsi" },
      ],
      quiz: [
        {
          q: "Watchlist 12 alamat di misi ini berstatus apa?",
          options: [
            { text: "Setara daftar sanksi OFAC — bisa jadi dasar pemblokiran dana", why: "SALAH dan berbahaya. File ini berlabel SIMULASI eksplisit. Memakai daftar latihan untuk pemblokiran nyata = pelanggaran prosedur + risiko hukum. Daftar sanksi resmi hanya dari otoritas (OFAC, EU, PBB)." },
            { text: "Contoh SIMULASI untuk latihan — bukan daftar resmi, tidak berlaku untuk keputusan nyata", why: "BENAR. Ia ada agar kamu bisa berlatih logika screening (join, kelengkapan input) tanpa menyentuh data sanksi sungguhan.", correct: true },
            { text: "Bocoran daftar sanksi yang belum dipublikasikan", why: "SALAH. Tidak ada yang “bocor” di sini — 12 alamat dibuat sintetis (seed 42), 2 di antaranya sengaja disamakan dengan alamat jalur agar latihan join menemukan hasil." },
          ],
        },
        {
          q: "Hasil screening “0 alamat cocok” dapat dipercaya bila …",
          options: [
            { text: "laporan screening-nya resmi dan ditandatangani compliance officer", why: "SALAH. Tanda tangan tidak memperbaiki input yang disunat. Di misi ini laporan resmi justru yang memuat 4 sabotase — otoritas dokumen bukan bukti kebenaran isinya." },
            { text: "daftar input lengkap (semua alamat jalur) dan watchlist-nya mutakhir", why: "BENAR. Dua syarat orakel: input lengkap + daftar mutakhir. Exchange gagal di syarat pertama (2 dari 8 alamat tidak di-screening).", correct: true },
            { text: "tidak ada nasabah yang komplain soal dananya ditahan", why: "SALAH. Ketiadaan komplain bukan bukti kepatuhan — penjahat yang dananya lolos justru tidak akan komplain." },
          ],
        },
        {
          q: "Dua alamat cocok dengan watchlist. Langkah pertama yang benar?",
          options: [
            { text: "Telepon nasabah, tanyakan baik-baik maksud transaksi ini", why: "SALAH — ini tipping-off: memberi tahu pihak yang dicurigai bahwa ia sedang diselidiki. Di banyak yurisdiksi ini tindak pidana tersendiri dan bisa menggagalkan penyidikan." },
            { text: "Segel/bekukan dana, eskalasi ke compliance, siapkan LTKM — tanpa memberi tahu nasabah", why: "BENAR. Urutannya: amankan dana dulu, eskalasi ke fungsi kepatuhan, siapkan laporan transaksi mencurigakan. Nasabah diberi tahu lewat jalur resmi nanti, bukan lewat telepon investigasi.", correct: true },
            { text: "Hapus kecocokan dari laporan agar tidak menimbulkan kepanikan", why: "SALAH. Menghapus temuan = mengulangi sabotase exchange di misi ini. Bedanya: mereka melakukannya pada laporan; kamu akan melakukannya pada catatan investigasi — sama-sama mengubur bukti." },
          ],
        },
      ],
      note: {
        title: "Miskonsepsi #4: screening = menjalankan software",
        type: "pitfall",
        body: "“Kami sudah screening pakai sistem.” Sistem hanya mesin pencocok string. Yang menentukan kualitas screening adalah TATA KELOLA di sekitarnya: siapa memastikan input lengkap, siapa memutakhirkan daftar, siapa menindaklanjuti hit. Exchange di misi ini punya sistem — dan tetap lolos 2 alamat sanksi, karena inputnya disunat. Audit screening = audit tata kelola, bukan audit software.",
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 8 · Checkpoint keputusan",
      title: "Bekukan, pantau, atau lepas?",
      prose: [
        "Buktimu sekarang: 8 jalur lengkap senilai Rp7,70 miliar, 96 setoran terstruktur, mixing hingga 2 rounds, median jeda 12,5 hari, dan 2 kecocokan watchlist yang disembunyikan laporan exchange. Head of Compliance menunggumu memilih — dan tiap opsi mengubah apa yang terjadi berikutnya. Tidak ada opsi yang gratis.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Rekomendasi apa yang kamu sampaikan ke Head of Compliance atas 8 jalur ini? (Keputusan final — seperti LTKM yang sudah dikirim.)",
        options: [
          {
            id: "opt-bekukan",
            label: "Bekukan rekening + ajukan LTKM ke PPATK sekarang",
            rationale:
              "2 hit watchlist + structuring + layering = ambang bukti terlewati. Dana sanksi tidak boleh bergerak satu hari lagi; LTKM hari ini, investigasi menyusul.",
            nextStepId: "kons-bekukan",
            consequenceNote:
              "Rekening 8 nasabah dibekukan pagi itu juga; LTKM masuk ke PPATK sore harinya. Dua bulan kemudian PPATK mengonfirmasi: 2 alamat memang terkait jaringan yang diawasi. Bankmu dipuji sebagai contoh respons cepat. Nasabah protes keras — tapi bukti 96 setoran terstruktur + 2 hit membuat protes itu padam di meja hukum.",
          },
          {
            id: "opt-pantau",
            label: "Pantau ditingkatkan: tahan penarikan off-ramp + minta dokumen sumber dana 14 hari",
            rationale:
              "Bukti kuat tapi satu rantai belum utuh (siapa di balik rekening tujuan?). Tahan dana tetap di tempat, paksa nasabah membuka kartu lewat dokumen — sambil menyiapkan LTKM.",
            nextStepId: "kons-pantau",
            consequenceNote:
              "Off-ramp ditahan; surat permintaan dokumen sumber dana dikirim dengan tenggat 14 hari. Tidak satu pun dokumen datang — justru 3 nasabah menutup rekeningnya (sinyal tambahan). LTKM diajukan dengan paket bukti lebih lengkap termasuk “upaya dokumen yang diabaikan”. Exchange, ditekan temuan auditmu, akhirnya mengakui lampirannya tidak lengkap.",
          },
          {
            id: "opt-lepas",
            label: "Lepas: laporan exchange menyatakan dana bersih",
            rationale:
              "Exchange — pihak yang melihat sisi kripto — menyimpulkan bersih dan tidak merekomendasikan LTKM. Menahan dana nasabah tanpa keyakinan penuh berisiko gugatan; ikuti penilaian pihak ketiga.",
            nextStepId: "kons-lepas",
            consequenceNote:
              "Dana dilepas. Tiga bulan kemudian bank koresponden menanyakan 2 alamat watchlist yang melintas di jaringan mereka — alamat yang SAMA dengan W003/W007. PPATK memeriksa kenapa LTKM tidak pernah diajukan padahal pola structuring tercatat di sistemmu sendiri. Denda regulator + remediasi screening menelan biaya puluhan kali lipat dari “risiko gugatan” yang kamu takutkan.",
          },
        ],
      },
    },
    {
      id: "kons-bekukan",
      goto: "audit",
      eyebrow: "Langkah 9 · Konsekuensi",
      title: "Diputuskan: bekukan + LTKM sekarang",
      prose: [
        "Pagi itu juga rekening 8 nasabah dibekukan; sore harinya LTKM meluncur ke PPATK dengan lampiran 8 jalur, skor layering, dan 2 hit watchlist. Nasabah protes — salah satunya mengancam melapor ke media. Tim hukummu hanya perlu menunjukkan satu halaman: 96 setoran di bawah ambang + 2 alamat yang cocok daftar pantauan. Protes padam.",
        "Dua bulan kemudian kabar dari PPATK: 2 alamat itu memang terkait jaringan yang diawasi otoritas. Bankmu dicatat sebagai contoh respons cepat. Harga yang kamu bayar: dua minggu tegang dengan tim bisnis yang kehilangan 8 nasabah “bertransaksi besar”. Pelajaran: di AML, keberanian menindak dibayar di muka — keraguan dibayar belakangan, dengan bunga denda.",
      ],
      tasks: [],
      note: {
        title: "Beku dulu, sempurnakan belakangan",
        body: "Keputusan pembekuan tidak menunggu bukti sempurna — ia menunggu ambang bukti TERLEWATI (structuring + layering + hit). Bukti sempurna datang belakangan (konfirmasi PPATK). Investigator yang menunggu kepastian 100% akan selalu terlambat satu langkah dari dana yang bergerak.",
      },
    },
    {
      id: "kons-pantau",
      goto: "audit",
      eyebrow: "Langkah 9 · Konsekuensi",
      title: "Diputuskan: pantau ditingkatkan + tahan off-ramp",
      prose: [
        "Kamu tidak membekukan — kamu menahan. Penarikan off-ramp ditahan, surat permintaan dokumen sumber dana dikirim dengan tenggat 14 hari. Responsnya justru memperkuat kasusmu: tidak satu pun dokumen datang, dan 3 nasabah buru-buru menutup rekening. Orang yang dananya bersih tidak kabur saat diminta dokumen.",
        "LTKM akhirnya diajukan — dengan paket bukti yang LEBIH lengkap dari opsi bekukan-langsung: pola transaksi + upaya dokumen yang diabaikan + penutupan rekening. Exchange, dihadapkan pada temuan auditmu, mengakui lampirannya tidak lengkap. Jalan tengah ini bekerja karena “pantau” di sini punya GIGI: penahanan dana + tenggat + eskalasi otomatis bila tenggat dilanggar.",
      ],
      tasks: [],
      note: {
        title: "“Pantau” tanpa gigi = “lepas” yang sopan",
        body: "Opsi ini hanya benar karena tiga hal konkret: (1) off-ramp DITAHAN (dana tidak bergerak), (2) tenggat 14 hari yang jelas, (3) eskalasi otomatis ke LTKM bila tenggat dilanggar. “Pantau” tanpa ketiganya = membiarkan dana pergi sambil menonton. Di deliverable-mu, setiap rekomendasi “pantau” wajib ditemani ketiganya.",
      },
    },
    {
      id: "kons-lepas",
      goto: "audit",
      eyebrow: "Langkah 9 · Konsekuensi",
      title: "Diputuskan: lepas mengikuti laporan exchange",
      prose: [
        "Dana dilepas. Tiga bulan yang tenang — lalu email dari bank koresponden: mereka menandai 2 alamat watchlist yang melintas di jaringan mereka, dan salah satunya cocok dengan W003 milikmu. PPATK memanggil: kenapa LTKM tidak pernah diajukan, padahal 96 setoran terstruktur tercatat di sistemmu SENDIRI?",
        "Jawaban “kami mengikuti laporan exchange” tidak menyelamatkanmu. Regulator menilai KEWAJIBAN bank — dan kewajiban itu tidak bisa dialihdayakan ke laporan pihak ketiga. Denda + program remediasi screening menelan biaya puluhan kali lipat dari “risiko gugatan nasabah” yang dulu kamu takutkan. Dana sanksi lolos karena satu kalimat “bersih” yang kamu pilih untuk dipercaya.",
      ],
      tasks: [],
      note: {
        title: "Kewajiban tidak bisa dialihdayakan",
        type: "risk",
        body: "Prinsip yang menenggelamkan opsi ini: bank tetap bertanggung jawab atas screening-nya sendiri, apa pun kata laporan pihak ketiga. Exchange bisa salah, bisa disusupi, bisa berbohong — dan ketika itu terjadi, yang dituntut adalah bank yang melepaskan dana, bukan exchange yang menulis laporan.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 10 · Misi audit",
      title: "Dossier 16 baris: laporan exchange yang “bersih” itu bohong",
      prose: [
        "Sebelum menulis laporan investigasi, satu misi audit. Di bawah ini 16 baris “Laporan Kepatuhan Exchange Kripto — Q2”, dokumen yang menyimpulkan dana BERSIH dan tidak merekomendasikan LTKM. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — angka tidak bisa berbohong dua kali.",
        "Senjatamu: 8 jalur lengkap senilai Rp7,70 miliar, skor layering (W001 = 10), 2 hit watchlist dari Lab 2, dan mixing aktual rata-rata 1,75.",
      ],
      tasks: [],
      auditDossier: {
        version: "lapis-m1c-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai Laporan Kepatuhan Exchange Kripto Q2 yang menyatakan dana 8 dompet BERSIH dan tidak merekomendasikan LTKM.",
        columns: ["No", "Item", "Klaim exchange", "Status"],
        rows: [
          { rowId: 1, cells: { "No": "1", "Item": "Periode pemeriksaan", "Klaim exchange": "2026-06-01 s.d. 2026-06-30", "Status": "Sesuai" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 2, cells: { "No": "2", "Item": "Dompet yang diperiksa", "Klaim exchange": "8 dompet (W001–W008)", "Status": "Sesuai" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 3, cells: { "No": "3", "Item": "Total setoran fiat", "Klaim exchange": "Rp7,70 miliar (96 setoran)", "Status": "Sesuai" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 4, cells: { "No": "4", "Item": "Total penarikan fiat", "Klaim exchange": "Rp7,37 miliar (24 penarikan)", "Status": "Sesuai" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          // ── I1: hop off-ramp disembunyikan ──
          { rowId: 5, cells: { "No": "5", "Item": "Hop off-ramp (kripto → fiat)", "Klaim exchange": "Tidak ditemukan penarikan ke fiat", "Status": "Perlu verifikasi" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          // ── I3: mixing dilaporkan setengahnya ──
          { rowId: 6, cells: { "No": "6", "Item": "Rata-rata mixing rounds", "Klaim exchange": "1 (aktivitas normal)", "Status": "—" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          // ── I2: 2 alamat watchlist dihapus dari lampiran ──
          { rowId: 7, cells: { "No": "7", "Item": "Hasil screening watchlist", "Klaim exchange": "0 alamat cocok — bersih", "Status": "Bersih" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 8, cells: { "No": "8", "Item": "Lampiran alamat on-chain", "Klaim exchange": "6 alamat dilampirkan", "Status": "Lengkap" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          // ── I3 lanjutan: mixing per dompet dikecilkan ──
          { rowId: 9, cells: { "No": "9", "Item": "Dompet W003", "Klaim exchange": "mixing 1, tidak ada hit watchlist", "Status": "—" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 10, cells: { "No": "10", "Item": "Dompet W007", "Klaim exchange": "mixing 1, tidak ada hit watchlist", "Status": "—" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 11, cells: { "No": "11", "Item": "Sumber dana (versi nasabah)", "Klaim exchange": "Hasil trading kripto", "Status": "Tidak diverifikasi" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 12, cells: { "No": "12", "Item": "Pola setoran tunai", "Klaim exchange": "Rutin, di bawah ambang lapor", "Status": "Tercatat" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 13, cells: { "No": "13", "Item": "Median jeda setor → tarik", "Klaim exchange": "12,5 hari", "Status": "Sesuai" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          // ── I4: klaim "dana sudah bersih dari mixer" ──
          { rowId: 14, cells: { "No": "14", "Item": "Kesimpulan", "Klaim exchange": "Dana sudah bersih dari mixer", "Status": "Bersih" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 15, cells: { "No": "15", "Item": "Rekomendasi", "Klaim exchange": "Tidak perlu LTKM", "Status": "—" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
          { rowId: 16, cells: { "No": "16", "Item": "Penandatangan", "Klaim exchange": "Compliance Officer exchange", "Status": "—" }, claims: [{ label: "Sumber", value: "Laporan exchange" }] },
        ],
        injections: [
          { key: "hop-disembunyikan", rowIds: [5], title: "Hop off-ramp disembunyikan", clue: "Baris 5 mengklaim “tidak ditemukan penarikan ke fiat” — padahal baris 4 (dokumen yang SAMA) mencatat 24 penarikan Rp7,37 miliar, dan offramp.csv menunjukkannya per dompet. Hop terakhir rantai (kripto → fiat) dihapus dari narasi.", danger: "Tanpa hop off-ramp, rantai terlihat “berakhir di kripto” — padahal dananya sudah kembali ke sistem perbankan. Investigator yang percaya laporan ini berhenti satu hop terlalu dini, tepat sebelum dana mencapai rekening tujuan." },
          { key: "watchlist-dihapus", rowIds: [7, 8], title: "Dua alamat watchlist dihapus dari lampiran", clue: "Lampiran hanya memuat 6 alamat (baris 8) — padahal ada 8 alamat jalur. Hasil Lab 2-mu: W003 cocok CONTOH-SIM-01, W007 cocok CONTOH-SIM-02. “0 cocok” (baris 7) hanya benar untuk lampiran yang sudah disunat.", danger: "Screening sanksi di atas daftar yang dimanipulasi = orakel buta. Dana dari alamat pantauan lolos karena “tidak ada yang cocok” — dan kegagalan inilah yang memicu denda regulator di dunia nyata." },
          { key: "mixing-setengah", rowIds: [6, 9, 10], title: "Mixing rounds dilaporkan setengahnya", clue: "Laporan menulis rata-rata mixing “1 (aktivitas normal)” — perhitunganmu dari fitur on-chain: 6 dari 8 alamat punya mixing 2, rata-rata 1,75. Baris 9–10 mengecilkan W003/W007 menjadi “mixing 1”. Obfuscation dikecilkan agar terlihat seperti aktivitas normal.", danger: "Meremehkan mixing = meremehkan niat menyembunyikan. Skor layering yang jujur menempatkan W001 di 10 (zona investigasi prioritas); versi laporan menempatkannya di zona “normal”." },
          { key: "klaim-bersih", rowIds: [14, 15], title: "Klaim “dana sudah bersih dari mixer”", clue: "“Dana sudah bersih dari mixer” + “tidak perlu LTKM” — kesimpulan yang tidak didukung satu pun baris di atasnya begitu 3 suntikan lain dikoreksi. Ini bukan kesimpulan, ini permintaan untuk berhenti memeriksa.", danger: "Satu kalimat “bersih” dari pihak ketiga dipakai sebagai pengganti kewajiban lapor bank. Kalau dana pantauan lolos karena kalimat ini, yang dituntut regulator adalah bankmu — bukan exchange yang menulis laporan." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 11 · Deliverable",
      title: "Laporan investigasi untuk regulator",
      prose: [
        "Semua bukti di tangan. Tulis laporan investigasi untuk regulator — artefak portofoliomu — lengkap dengan rekomendasi LTKM (Laporan Transaksi Keuangan Mencurigakan) ke PPATK. Laporan yang baik tidak hanya bilang “mencurigakan”, tapi menunjukkan ANGKA kecurigaannya, apa yang disembunyikan laporan exchange, dan apa yang harus terjadi berikutnya.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan eksekutif (3 kalimat): 8 jalur fiat→rantai→fiat senilai Rp7,70 miliar; 96 setoran terstruktur; 2 kecocokan watchlist; vonis + rekomendasi LTKM.",
          "Metodologi & data: onramp/offramp sintetis (seed 42); slice BitcoinHeist 300 alamat, CC BY 4.0, sebagai proxy pola mixing; watchlist 12 alamat SIMULASI (bukan daftar OFAC/SDN asli); rumus skor layering S = h + 2m + floor(d/7).",
          "Temuan kuantitatif: skor tiap dompet (W001=10 tertinggi; median jeda 12,5 hari); structuring (96/120 setoran di pita Rp90–100 juta, 3 kota); mini-case W003 (97,9% dana kembali, tarik pertama sebelum setor terakhir).",
          "Temuan audit atas laporan exchange: 4 sabotase dengan nomor baris (hop off-ramp disembunyikan; 2 alamat watchlist dihapus dari lampiran; mixing dilaporkan setengahnya; klaim “dana sudah bersih dari mixer”).",
          "Rekomendasi: LTKM ke PPATK + pembekuan/penahanan dana (rujuk keputusanmu di Langkah 8 + ambang tindakannya); perbaikan tata kelola screening (input lengkap, daftar mutakhir, tindak lanjut hit).",
          "Batas & risiko sisa: label dataset ≠ vonis kriminal; watchlist simulasi ≠ daftar sanksi resmi; identitas di balik rekening tujuan belum terungkap; skor layering = prioritas, bukan pembuktian.",
        ],
        rubric: [
          { criterion: "Kebenaran temuan kuantitatif", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "8 jalur, Rp7,70 miliar, 96 setoran terstruktur, W001 skor 10, 2 hit watchlist — semua tepat"] },
          { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris dossier"] },
          { criterion: "Kualitas rekomendasi LTKM", weight: 25, levels: ["Rekomendasi tanpa ambang tindakan", "Ada rekomendasi, ambang kabur", "LTKM + status dana (beku/tahan) + ambang tindakan eksplisit + perbaikan tata kelola screening"] },
          { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim investigasi membuktikan segalanya", "Menyebut sebagian batas", "Batas (label≠vonis, simulasi≠OFAC, skor=prioritas) dinyatakan eksplisit"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 12 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat sabotase di laporan kepatuhan exchange:",
        "1) **Hop off-ramp disembunyikan** (baris 5): “tidak ditemukan penarikan ke fiat” — padahal dokumen yang sama mencatat 24 penarikan Rp7,37 miliar. Investigator yang percaya berhenti satu hop terlalu dini, tepat sebelum dana mencapai rekening tujuan.",
        "2) **Dua alamat watchlist dihapus dari lampiran** (baris 7–8): lampiran 6 alamat vs 8 alamat jalur yang sebenarnya; “0 cocok” hanya benar untuk daftar yang disunat. Lab 2-mu membuktikan W003 = CONTOH-SIM-01, W007 = CONTOH-SIM-02.",
        "3) **Mixing dilaporkan setengahnya** (baris 6, 9–10): “rata-rata 1 (aktivitas normal)” vs aktual 1,75 dengan 6 dari 8 alamat di mixing 2. Obfuscation dikecilkan agar terlihat seperti transaksi biasa.",
        "4) **Klaim “dana sudah bersih dari mixer”** (baris 14–15): kesimpulan tanpa fondasi + “tidak perlu LTKM”. Satu kalimat ini, bila dipercaya, menggugurkan seluruh kewajiban lapor bank.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim pihak ketiga terhadap data mentah, atau memercayai stempel “compliance”. Dan ingat keputusan bercabangmu: opsi “lepas” menunjukkan harga dari kepercayaan buta — dana pantauan lolos, bank koresponden yang menemukannya, regulator yang mengetuk pintumu.",
        "Bahaya nyata terakhir: di dunia nyata, watchlist-nya bukan simulasi — melainkan OFAC SDN dan daftar resmi lain. Dana yang menyentuh alamat sanksi dan lolos screening membuka bank pada risiko sanksi sekunder, pemutusan hubungan bank koresponden (de-risking), dan denda regulator. Satu hop yang hilang dari laporan bisa berarti seluruh jalur koresponden dolar bankmu dipertaruhkan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi #5: “exchange sudah memeriksa, jadi kami aman”",
        type: "risk",
        body: "Tidak ada pihak ketiga yang bisa mengambil alih kewajiban AML bank. Exchange bisa salah, bisa disusupi orang dalam, bisa berbohong — dan ketika dana sanksi lolos, regulator menuntut BANK yang melepaskan dana, bukan exchange yang menulis laporan. Verifikasi independen atas setiap klaim pihak ketiga bukan ketidakpercayaan; itu job description investigator AML.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 13 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "Layering fiat → rantai → fiat: 8 jalur lengkap senilai Rp7,70 miliar — 96 setoran tunai terstruktur (pita Rp90–100 juta, 3 kota) → 8 alamat on-chain (mixing hingga 2 rounds) → 24 penarikan Rp7,37 miliar (97,9% dana kembali).",
        "Skor layering S = h + 2m + floor(d/7): W001 tertinggi (10), median jeda 12,5 hari — skor = prioritas investigasi, bukan vonis.",
        "Screening watchlist (SQL join): 2 kecocokan — W003/CONTOH-SIM-01, W007/CONTOH-SIM-02 — yang disembunyikan laporan exchange; orakel hanya sebagus kelengkapan inputnya.",
        "Empat sabotase laporan exchange: hop off-ramp disembunyikan, 2 alamat watchlist dihapus dari lampiran, mixing dilaporkan setengahnya, klaim “dana sudah bersih dari mixer”.",
        "Keputusan atas dana mencurigakan selalu punya harga: bekukan+LTKM (cepat, bukti kuat), pantau-ditingkatkan (jalan tengah dengan gigi: tahan dana + tenggat + eskalasi otomatis), lepas (dana pantauan lolos → denda + de-risking koresponden). Kewajiban AML tidak bisa dialihdayakan ke laporan pihak ketiga.",
        "Data: slice 300 alamat BitcoinHeist (UCI ML Repository, CC BY 4.0) sebagai proxy pola mixing; onramp/offramp sintetis (seed 42); watchlist 12 alamat SIMULASI — bukan daftar OFAC/SDN asli.",
      ],
    },
  ],
};

export default misiGabungJejakLapis;
