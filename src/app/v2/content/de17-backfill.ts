import type { V2Lesson } from "../lib/types";

const BACKFILL_SVG = `<svg viewBox="0 0 520 234" role="img" aria-label="Timeline 30 hari: 26 OK, 3 gagal, 1 rusak; replay 4 partisi dengan overwrite.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="16" x2="500" y2="16"/><line x1="150" y1="56" x2="500" y2="56"/><line x1="150" y1="96" x2="500" y2="96"/><line x1="150" y1="136" x2="500" y2="136"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="140" y="35" text-anchor="end">OK (26 hari)</text><rect x="150" y="20" width="350.0" height="18" fill="var(--c1)"/><text x="506" y="35">26</text>
<text x="140" y="75" text-anchor="end">Gagal (3 hari)</text><rect x="150" y="60" width="40.4" height="18" fill="var(--error)"/><text x="196" y="75">3</text>
<text x="140" y="115" text-anchor="end">Rusak (1 hari)</text><rect x="150" y="100" width="13.5" height="18" fill="var(--c1)"/><text x="169" y="115">1</text>
<text x="140" y="155" text-anchor="end">Di-replay</text><rect x="150" y="140" width="53.8" height="18" fill="var(--c1)"/><text x="210" y="155">4</text>
</g>
<text x="150" y="228" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0</text><text x="500" y="228" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">partisi</text>
</svg>`;
export const de17: V2Lesson = {
  slug: "de17-backfill",
  track: "Data Engineer",
  module: "Software Engineering untuk Data",
  title: "DE17 — Backfill & Replay yang Aman",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Backfill yang menggandakan segalanya",
      prose: [
        "Oktober 2026. Bug ditemukan di pipeline: diskon tidak dihitung 10–12 Oktober, dan data 20 Oktober salah total. Sari (data engineer) menjalankan backfill 30 hari — 'tulis ulang semuanya biar aman'. Besoknya revenue Oktober GANDA: Rp4,2 M menjadi Rp8,4 M. Backfill-nya tidak overwrite — ia APPEND. 30 hari data ditumpuk di atas 30 hari yang sudah ada.",
        "Butuh 3 hari untuk membersihkan duplikat (DELETE manual per partisi, dengan direksi bertanya tiap 4 jam). Ironisnya, niatnya benar: memperbaiki data. Eksekusinya yang salah: tanpa idempotency, 'perbaiki' = 'gandakan'.",
        "Twist-nya: Sari SUDAH tahu konsep idempoten (pelajaran DE4). Tetapi pipeline ini ditulis sebelum aturan itu — dan tidak ada yang mengaudit ulang. Pengetahuan yang tidak diterapkan ke pipeline lama = tidak ada pengetahuan.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan idempotency untuk backfill/replay; (2) merencanakan backfill partisi yang aman (overwrite, bukan append); (3) menghitung duplikat replay streaming tanpa idempotency; (4) memilih strategi: full vs incremental backfill; (5) menulis runbook backfill.",
      ],
      tasks: [],
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa:",
        "(1) Menjelaskan kenapa backfill/replay HANYA aman jika tulisannya idempoten;",
        "(2) Merencanakan replay partisi: identifikasi yang gagal/rusak, overwrite (bukan append);",
        "(3) Menghitung dampak duplikat replay streaming tanpa idempotency key;",
        "(4) Memilih full vs incremental backfill berdasar ukuran dan jendela waktu;",
        "(5) Menulis runbook backfill: langkah, validasi, rollback.",
      ],
      tasks: [],
    },
    {
      id: "idempoten",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Idempoten: tombol yang aman ditekan dua kali",
      prose: [
        "Idempoten = operasi yang hasilnya SAMA meski dijalankan berkali-kali. Untuk backfill: OVERWRITE partisi (tulis ulang tanggal X = hasil sama), UPSERT by key (tulis ulang key yang sama = tidak duplikat). Lawannya: APPEND (tulis ulang = duplikat) — inilah yang menggandakan revenue Sari.",
        "Contoh langkah-demi-langkah (dari lab 1): 30 partisi, 4 bermasalah (3 GAGAL + 1 RUSAK). Replay = overwrite 4 partisi itu. Karena overwrite, menjalankan replay 2x = hasil sama (aman=True). Jika append: 2x replay = 2x duplikat.",
        "Tiga pola idempoten: (1) PARTITION OVERWRITE — tulis ke partisi tanggal, timpa seluruhnya; (2) UPSERT — INSERT ... ON CONFLICT DO UPDATE by primary key; (3) DELETE+INSERT dalam transaksi — hapus rentang, tulis ulang, atomik.",
        "💡 Intuisi kunci: tanyakan pada SETIAP tulis pipeline: 'apa yang terjadi jika job ini jalan 2x?' Jawabannya harus 'tidak ada bedanya'. Jika jawabannya 'duplikat' — pipeline itu belum siap untuk backfill, replay, atau retry.",
        "Kapan memakai: SELALU untuk tulis pipeline. Idempoten bukan 'fitur backfill' — ia prasyarat. Pipeline yang tidak idempoten = bom waktu yang menunggu retry pertama.",
      ],
      formula: String.raw`\text{Aman} \iff \forall p: \text{tulis}(p) \circ \text{tulis}(p) = \text{tulis}(p)`,
      formulaNote:
        "Aman jika dan hanya jika untuk setiap partisi p: menulis dua kali = menulis sekali (idempoten). Overwrite dan upsert memenuhi; append TIDAK. Lab 1 membuktikan: overwrite 4 partisi 2x = tetap OK.",
      note: {
        title: "🚨 Miskonsepsi: backfill = jalankan ulang pipeline untuk rentang tanggal",
        body: "'Jalankan ulang' tanpa memastikan tulisannya idempoten = duplikat massal (cerita Sari). Backfill yang aman = (1) identifikasi partisi yang perlu (bukan 'semua biar aman'), (2) tulis dengan overwrite/upsert, (3) validasi sesudah (count per partisi = ekspektasi), (4) catat di log. 'Jalankan ulang' hanyalah langkah 2 dari 4.",
      },
      tasks: [],
    },
    {
      id: "replay-stream",
      eyebrow: "Langkah 4 · Replay streaming",
      title: "Replay: putar ulang tanpa efek ganda",
      prose: [
        "Di streaming (Kafka), replay = baca ulang dari offset lama (mis. 7 hari ke belakang setelah bug consumer). Masalah: at-least-once berarti pesan BISA datang 2x — replay tanpa idempotency = double charge (pelajaran DE9).",
        "Contoh (dari lab 2): 1.000 event di-replay, 150 duplikat (15%). Tanpa idempotency: total 5.106.750 (kelebihan 111.750!). Dengan idempotency (dedupe by key): 4.995.000 = benar. Selisih 111.750 = uang yang salah hitung.",
        "Idempotency key = identitas unik per event (order_id, bukan timestamp!). Consumer menyimpan key yang sudah diproses (di database/Redis); key yang sudah ada = lewati. Syarat: key STABIL (tidak berubah antar replay) dan UNIK.",
        "💡 Intuisi kunci: 'sudah di-proses?' harus bisa dijawab CEPAT (lookup key, bukan scan). Tanpa store key yang cepat, idempotency = teori. Desain key + store-nya SEBELUM butuh replay — bukan saat krisis.",
        "Kapan memakai: SEMUA consumer yang berefek (charge, kirim, tulis). Consumer read-only (agregat yang bisa recompute)? Idempotency kurang kritis — tetapi tetap praktik baik.",
      ],
      formula: String.raw`\text{Duplikat} = \sum_{\text{replay}} - \sum_{\text{unik}} = 111.750`,
      formulaNote:
        "Kelebihan hitung = total dengan duplikat (5.106.750) − total unik yang benar (4.995.000) = 111.750. Inilah 'pajak' replay tanpa idempotency key — dihitung dari data lab 2 (150 duplikat dari 1.000 event).",
      note: {
        title: "🚨 Miskonsepsi: replay Kafka = set offset ke awal, selesai",
        body: "Set offset = langkah 1 dari 5. Yang lengkap: (1) hentikan consumer, (2) perbaiki bug, (3) pastikan consumer IDEMPOTEN (jika tidak, replay = duplikat), (4) set offset + replay, (5) validasi (count per key = 1). Melewatkan (3) = mengulang bencana Sari dalam bentuk streaming.",
      },
      tasks: [],
    },
    {
      id: "timeline",
      eyebrow: "Langkah 5 · Visual",
      title: "Peta 30 hari: mana yang di-replay?",
      prose: [
        "Cara membaca: batang = jumlah partisi per status. 26 OK (tidak disentuh), 3 GAGAL (10–12 Okt, bug diskon), 1 RUSAK (20 Okt, data salah), 4 DI-REPLAY (3+1, batang merah muda).",
        "Interpretasi: replay = HANYA yang bermasalah (4), bukan 'semua 30 biar aman'. 'Biar aman' = 26 partisi OK ditulis ulang sia-sia (biaya + risiko). Presisi > paranoia: identifikasi dulu, replay kemudian.",
        "💡 Intuisi kunci: partisi yang OK tidak boleh disentuh backfill. Setiap tulis ulang = risiko (meski idempoten). Prinsip bedah: sayat sekecil mungkin.",
      ],
      figure: {
        svg: BACKFILL_SVG,
        alt: "Status 30 partisi: 26 OK, 3 gagal, 1 rusak; 4 di-replay.",
        caption:
          "Replay presisi: hanya 4 partisi bermasalah yang di-overwrite — bukan 30.",
      },
      tasks: [],
    },
    {
      id: "lab-rencana",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: perencana backfill aman",
      prose: [
        "30 partisi Oktober 2026. Tiga GAGAL (bug diskon 10-12), satu RUSAK (20 Okt).",
        "Tugasmu: daftarkan partisi yang perlu replay, simulasikan overwrite, dan buktikan aman (semua OK, tanpa duplikat).",
        "Coba juga: ubah simulasi menjadi APPEND (hasil[d] += 'OK' tidak menimpa). Apa yang terjadi pada 'aman'? Inilah beda Sari yang selamat vs Sari yang menggandakan revenue.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan `replay`: partisi yang statusnya bukan OK (urutkan)" },
        { id: "t2", text: "Simulasikan overwrite dan tentukan `aman`: semua OK?" },
      ],
      expected: "replay=['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-20']",
      note: {
        title: "Sering salah",
        body: "Me-replay SEMUA 30 partisi 'biar aman'. 26 partisi OK ditulis ulang = 26x biaya + 26x risiko tanpa manfaat. Presisi > paranoia.",
      },
      hints: [
        "replay = [d for d,s in partisi.items() if s != 'OK'], urutkan.",
        "Overwrite: hasil[d] = 'OK' (timpa, bukan tambah).",
        "aman = all(v == 'OK').",
      ],
      code: {
        starter: `# 30 hari partisi. Status: OK, GAGAL (bug 10-12 Okt), RUSAK (data salah 20 Okt).\nfrom datetime import date, timedelta\nawal = date(2026, 10, 1)\npartisi = {}\nfor i in range(30):\n    d = awal + timedelta(days=i)\n    partisi[str(d)] = "OK"\nfor d in ["2026-10-10", "2026-10-11", "2026-10-12"]:\n    partisi[d] = "GAGAL"\npartisi["2026-10-20"] = "RUSAK"\n# TULIS KODEMU: replay, aman\nreplay = []\naman = False\n\nprint(f"replay={replay}")\nprint(f"aman={aman}")\n`,
        lockLines: 10,
        solution: `# 30 hari partisi. Status: OK, GAGAL (bug 10-12 Okt), RUSAK (data salah 20 Okt).\nfrom datetime import date, timedelta\nawal = date(2026, 10, 1)\npartisi = {}\nfor i in range(30):\n    d = awal + timedelta(days=i)\n    partisi[str(d)] = "OK"\nfor d in ["2026-10-10", "2026-10-11", "2026-10-12"]:\n    partisi[d] = "GAGAL"\npartisi["2026-10-20"] = "RUSAK"\n\n# TULIS KODEMU: replay, aman\n# Replay = partisi yang TIDAK OK. Aman = overwrite partisi (idempoten).\nreplay = sorted(d for d, s in partisi.items() if s != "OK")\n# Simulasi: tulis ulang = overwrite (tidak ada duplikat, apa pun status awal)\nhasil = dict(partisi)\nfor d in replay:\n    hasil[d] = "OK"   # overwrite partisi: idempoten\naman = all(v == "OK" for v in hasil.values())\n\nprint(f"replay={replay}")\nprint(f"aman={aman}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "replay", value: ["2026-10-10", "2026-10-11", "2026-10-12", "2026-10-20"], label: "`replay` benar", msg: "3 GAGAL + 1 RUSAK." },
          { kind: "equal", task: "t2", name: "aman", value: true, label: "`aman` = True", msg: "Overwrite = idempoten." },
        ],
      },
      reference: "Backfill aman: identifikasi presisi + overwrite idempoten.",
    },
    {
      id: "lab-duplikat",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: harga replay tanpa idempotency",
      prose: [
        "1.000 event di-replay; 150 terkirim dua kali (khas at-least-once).",
        "Tugasmu: hitung total TANPA idempotency (duplikat ikut), DENGAN idempotency (dedupe by key), dan selisihnya.",
        "Selisih 111.750 = 'pajak' satu replay tanpa idempotency key. Untuk charge kartu (DE9): 150 pelanggan ke-charge 2x. Untuk agregat: angka salah yang dipercaya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tanpa_idem`, `dengan_idem`, dan `benar`" },
        { id: "t2", text: "Hitung `duplikat_tercegah` = tanpa_idem - dengan_idem" },
      ],
      expected: "duplikat_tercegah=111750",
      note: {
        title: "Sering salah",
        body: "Dedup dengan menghapus SEMUA kemunculan kedua (termasuk yang pertama!). Dedupe by key = simpan yang PERTAMA, lewati yang sudah terlihat — bukan hapus keduanya.",
      },
      hints: [
        "tanpa_idem = sum semua STREAM.",
        "dengan_idem: set terlihat; tambah hanya jika key baru.",
        "duplikat_tercegah = tanpa_idem - dengan_idem.",
      ],
      code: {
        starter: `# Streaming: 1000 event di-replay. Consumer TANPA idempotency vs DENGAN.\nEVENTS = [(f"e{i}", i * 10) for i in range(1000)]\n# Replay mengirim 15% event dua kali (duplikat khas at-least-once)\nDUPLIKAT = [(f"e{i}", i * 10) for i in range(150)]\nSTREAM = EVENTS + DUPLIKAT\n# TULIS KODEMU: tanpa_idem, dengan_idem, duplikat_tercegah\ntanpa_idem = 0\ndengan_idem = 0\nduplikat_tercegah = 0\n\nprint(f"tanpa_idem={tanpa_idem}  dengan_idem={dengan_idem}")\nprint(f"duplikat_tercegah={duplikat_tercegah}")\n`,
        lockLines: 5,
        solution: `# Streaming: 1000 event di-replay. Consumer TANPA idempotency vs DENGAN.\nEVENTS = [(f"e{i}", i * 10) for i in range(1000)]\n# Replay mengirim 15% event dua kali (duplikat khas at-least-once)\nDUPLIKAT = [(f"e{i}", i * 10) for i in range(150)]\nSTREAM = EVENTS + DUPLIKAT\n\n# TULIS KODEMU: tanpa_idem, dengan_idem, duplikat_tercegah\n# Tanpa idempotency: jumlahkan semua (duplikat ikut kehitung)\ntanpa_idem = sum(v for _, v in STREAM)\n# Dengan idempotency: dedup by key dulu\nterlihat = set()\ndengan_idem = 0\nfor k, v in STREAM:\n    if k not in terlihat:\n        terlihat.add(k)\n        dengan_idem += v\nbenar = sum(v for _, v in EVENTS)\nduplikat_tercegah = tanpa_idem - dengan_idem\n\nprint(f"tanpa_idem={tanpa_idem}  dengan_idem={dengan_idem}  benar={benar}")\nprint(f"duplikat_tercegah={duplikat_tercegah}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "dengan_idem", value: 4995000, label: "`dengan_idem` = benar", msg: "Dedupe by key = 4.995.000." },
          { kind: "equal", task: "t2", name: "duplikat_tercegah", value: 111750, label: "`duplikat_tercegah` = 111.750", msg: "Pajak replay tanpa idempotency." },
          { kind: "stdout_matches", task: "t1", pattern: "tanpa_idem=5106750", label: "`tanpa_idem` benar", msg: "5.106.750 dengan 150 duplikat." },
        ],
      },
      reference: "Idempotency key: dedupe by key sebelum efek.",
    },
    {
      id: "strategi",
      eyebrow: "Langkah 8 · Strategi",
      title: "Full vs incremental backfill",
      prose: [
        "FULL backfill = tulis ulang SELURUH rentang (30 hari). Cocok untuk: rentang kecil (< 7 hari), logika berubah total, atau validasi menyeluruh. Harga: mahal (30x compute), risiko: menyentuh data OK.",
        "INCREMENTAL backfill = hanya partisi bermasalah (4 hari). Cocok untuk: bug terlokalisasi (seperti lab 1), tabel besar. Harga: murah, presisi. Syarat: tahu PERSIS partisi mana yang salah — butuh investigasi dulu.",
        "Aturan pilih: < 7 hari ATAU akar masalah tidak jelas → full (lebih sederhana, lebih pasti). > 7 hari DAN terlokalisasi → incremental (lebih murah, lebih presisi). Tabel 2 TB → hampir selalu incremental.",
        "Runbook backfill (wajib): (1) identifikasi partisi + akar masalah; (2) hitung estimasi waktu/biaya; (3) minta ACC pemilik data (aturan Septian: untuk data kritis); (4) eksekusi dengan overwrite; (5) validasi (count/revenue per partisi vs ekspektasi); (6) catat di log insiden.",
        "💡 Intuisi kunci: backfill tanpa runbook = Sari jilid 2. Tulis rencananya SEBELUM menekan tombol — partisi apa, strategi apa, validasi apa, rollback apa. Rencana 15 menit > 3 hari bersih-bersih.",
      ],
      tasks: [],
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 9 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Idempoten bukan fitur — ia prasyarat. Setiap tulis pipeline harus menjawab 'aman ditekan 2x?' dengan 'ya'. Yang menjawab 'duplikat' = bom waktu.",
        "💡 Replay presisi > replay paranoia. Identifikasi dulu (mana yang salah?), replay kemudian (hanya yang salah). 'Tulis ulang semua biar aman' = paling tidak aman.",
        "💡 Idempotency key harus STABIL dan UNIK. Timestamp bukan key (berubah); order_id = key. Key yang salah = dedupe yang salah = duplikat yang lolos.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: operasi di meja staging, bukan di pasien yang sadar",
        body: "Backfill yang baik seperti operasi bedah: dilakukan di ruang steril, bukan di lorong rumah sakit yang ramai. Heuristik praktisi: JANGAN pernah backfill langsung ke tabel produksi yang sedang dibaca dashboard — tulis ke tabel staging, validasi angkanya (bandingkan sampel dengan ekspektasi bisnis), baru swap atomik. Jebakan yang paling sering: backfill berjalan sementara consumer downstream membaca setengah data lama plus setengah data baru — angka \"aneh\" selama 3 jam yang tidak bisa dijelaskan ke siapa pun. Aturan presisinya: identifikasi dulu, replay kemudian — tentukan partisi mana yang benar-benar salah, replay hanya itu; \"tulis ulang semua biar aman\" justru paling tidak aman karena blast radius-nya maksimal dan biayanya mengikuti. Dua detail yang menyelamatkan: replay dalam urutan kronologis bila logikamu bergantung waktu — agregasi kumulatif yang di-replay acak menghasilkan angka berbeda; dan pastikan idempotency key stabil dan unik — timestamp bukan key (ia berubah tiap run), order_id adalah key; key yang salah berarti dedupe yang salah, dan duplikat lolos diam-diam. Backfill bukan sekadar \"run ulang\" — ia operasi yang direncanakan seperti deploy.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: strategi perbaikan data",
      prose: [
        "Skenario 1 — Bug terlokalisasi, partisi jelas (3 hari). → INCREMENTAL backfill + overwrite. Alasan: murah, presisi, cepat.",
        "Skenario 2 — Akar masalah tidak jelas / rentang kecil. → FULL backfill + overwrite. Alasan: kepastian > penghematan untuk kasus kecil.",
        "Skenario 3 — Replay streaming (Kafka). → Pastikan consumer IDEMPOTEN dulu, baru set offset. Alasan: tanpa idempotency = duplikat massal (lab 2).",
        "Skenario 4 — Data kritis (keuangan/direksi). → Runbook + ACC pemilik + validasi ganda. Alasan: harga salah = Rp800 juta (DE16).",
        "Skenario 5 — Backfill rutin (setiap ada koreksi sumber). → OTOMASI: skrip backfill idempoten + validasi otomatis. Alasan: yang sering terjadi = harusnya tidak manual.",
        "Aturan praktis 10 detik: tanya 'tulisannya idempoten?' Tidak → perbaiki DULU, backfill KEMUDIAN. 'Partisi mana?' Tidak tahu → investigasi dulu. 'Siapa yang ACC?' Data kritis → pemiliknya.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: Rp4,2 M yang menjadi Rp8,4 M",
      prose: [
        "PT MajuLogistik, Oktober 2026. Bug diskon 10–12 Okt + data rusak 20 Okt. Sari menjalankan 'backfill 30 hari biar aman' — dengan APPEND (bukan overwrite). Besok: revenue Oktober Rp8,4 M (seharusnya Rp4,2 M). 30 hari data menumpuk di atas 30 hari yang ada.",
        "Pembersihan: 3 hari DELETE manual per partisi (30 partisi x 15 menit = 7,5 jam) + direksi bertanya tiap 4 jam + kepercayaan yang retak. Biaya: 3 hari engineer (Rp7,5 juta) + 3 hari keputusan berbasis data ganda.",
        "Seandainya (lab 1): replay HANYA 4 partisi + overwrite = 20 menit + aman=True. Rasio: 3 hari vs 20 menit = 216x. Dan Sari TAHU idempoten (DE4) — tetapi pipeline lama belum diaudit. Pengetahuan tanpa retrofit = tidak ada.",
        "Pembahasan: (a) audit idempotency SEMUA pipeline tulis (pertanyaan: 'aman 2x?'); (b) backfill = runbook, bukan spontanitas; (c) validasi sesudah (count per partisi) menangkap duplikat dalam menit, bukan hari.",
        "💡 Intuisi kunci: 'biar aman' adalah frasa paling berbahaya di backfill. Aman = presisi + idempoten + validasi. 'Semua' = mahal + berisiko.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Pertanyaan tentang lesson ini. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "Backfill/replay HANYA aman jika tulisannya idempoten (overwrite/upsert, bukan append).",
        "Replay presisi: identifikasi partisi bermasalah, overwrite hanya itu — bukan 'semua biar aman'.",
        "Replay streaming butuh idempotency key (unik + stabil); tanpa itu = duplikat massal.",
        "Full vs incremental: kepastian vs penghematan — pilih berdasar kejelasan akar + ukuran.",
        "Backfill = runbook (rencana + validasi + ACC), bukan spontanitas.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Pipeline menulis dengan APPEND. Apa yang terjadi jika backfill dijalankan 2x?",
          options: [
            { text: "Aman — idempoten", why: "APPEND tidak idempoten: tulis 2x = data 2x. Inilah yang menggandakan revenue Sari." },
            { text: "Duplikat: data tertulis dua kali", why: "Tepat: append + replay = tumpukan. Backfill HANYA aman dengan overwrite/upsert (idempoten). Pertanyaan 'aman 2x?' adalah tesnya.", correct: true },
            { text: "Error otomatis", why: "Tidak error — itulah bahayanya: sukses yang menggandakan." },
            { text: "Data terkompresi", why: "Tidak ada kompresi otomatis. Hanya duplikat." },
          ],
        },
        {
          q: "Kapan memilih incremental (bukan full) backfill?",
          options: [
            { text: "Selalu — lebih murah", why: "'Selalu' salah: jika akar masalah tidak jelas, incremental = memperbaiki sebagian + meninggalkan sisanya. Kepastian dulu, penghematan kemudian." },
            { text: "Bug terlokalisasi + partisi jelas + tabel besar", why: "Tepat: 4 partisi dari 30 (lab 1) = 87% compute dihemat dengan hasil sama. Syaratnya: TAHU persis mana yang salah (investigasi dulu).", correct: true },
            { text: "Tidak pernah — full lebih aman", why: "Full 30 hari untuk 4 hari yang salah = 26x pemborosan + menyentuh data OK. 'Aman' semu." },
            { text: "Saat malas investigasi", why: "Malas investigasi = tidak tahu mana yang salah = full backfill buta. Itu bukan strategi, itu pasrah." },
          ],
        },
        {
          q: "Replay Kafka 1.000 event, 150 duplikat. Tanpa idempotency, kerugiannya?",
          options: [
            { text: "Tidak ada — Kafka menangani", why: "Kafka at-least-once TIDAK menangani duplikat — itu tugas consumer. 'Kafka menangani' = mitos DE9." },
            { text: "111.750 kelebihan hitung (lab 2) — untuk charge = 150 double-charge", why: "Tepat: tanpa dedupe by key, 150 event dihitung 2x = 111.750 kelebihan. Untuk pembayaran: 150 pelanggan ke-charge ganda. Idempotency key = obatnya.", correct: true },
            { text: "Event hilang", why: "Kebalikannya: event BERTAMBAH (duplikat), bukan hilang." },
            { text: "Hanya masalah performa", why: "Bukan performa — kebenaran. Angka salah yang dipercaya." },
          ],
        },
        {
          q: "Syarat idempotency key yang baik?",
          options: [
            { text: "Unik saja cukup", why: "Unik saja tidak cukup: key harus STABIL antar replay. UUID random per pengiriman = key berbeda tiap replay = dedupe gagal." },
            { text: "Unik + stabil antar replay (mis. order_id)", why: "Tepat: order_id unik (satu per order) + stabil (sama di replay). Timestamp = tidak stabil; UUID random = tidak stabil. Key yang salah = dedupe yang salah.", correct: true },
            { text: "Besar saja cukup", why: "Ukuran tidak relevan. Sifatnya yang penting." },
            { text: "Tidak perlu key", why: "Tanpa key = tidak ada dedupe = tidak ada idempotency. Key adalah jantungnya." },
          ],
        },
        {
          q: "Langkah pertama runbook backfill yang benar?",
          options: [
            { text: "Langsung eksekusi — cepat", why: "'Cepat' = Sari (3 hari bersih-bersih). Kecepatan tanpa rencana = kecepatan menuju bencana." },
            { text: "Identifikasi partisi + akar masalah + estimasi + ACC (untuk data kritis)", why: "Tepat: rencana 15 menit > 3 hari bersih-bersih. 'Partisi mana? Strategi apa? Validasi apa? Rollback apa? Siapa ACC?' — jawab SEBELUM tombol ditekan.", correct: true },
            { text: "Backup dulu semuanya", why: "Backup tidak mencegah duplikat backfill. Backup = untuk bencana lain." },
            { text: "Minta maaf dulu ke direksi", why: "Minta maaf SEBELUM ada masalah = mengaku salah duluan. Rencana dulu." },
          ],
        },
      ],
    },
  ],
};
