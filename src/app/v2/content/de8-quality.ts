import type { V2Lesson } from "../lib/types";

// Enam dimensi kualitas data.
const DIM_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Enam dimensi kualitas data: akurasi, kelengkapan, ketepatan waktu, konsistensi, validitas, keunikan.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="20" y="20" width="160" height="58" rx="10" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="100" y="43" font-size="12" font-weight="600" fill="var(--text)">Akurasi</text>
<text x="100" y="62" font-size="11" fill="var(--text-muted)">nilainya benar?</text>
<rect x="200" y="20" width="160" height="58" rx="10" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="280" y="43" font-size="12" font-weight="600" fill="var(--text)">Kelengkapan</text>
<text x="280" y="62" font-size="11" fill="var(--text-muted)">ada yang hilang?</text>
<rect x="380" y="20" width="160" height="58" rx="10" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="460" y="43" font-size="12" font-weight="600" fill="var(--text)">Ketepatan waktu</text>
<text x="460" y="62" font-size="11" fill="var(--text-muted)">datang saat dibutuhkan?</text>
<rect x="20" y="98" width="160" height="58" rx="10" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="100" y="121" font-size="12" font-weight="600" fill="var(--text)">Konsistensi</text>
<text x="100" y="140" font-size="11" fill="var(--text-muted)">antar tabel cocok?</text>
<rect x="200" y="98" width="160" height="58" rx="10" fill="var(--c5)" opacity="0.25" stroke="var(--c5)" stroke-width="2"/>
<text x="280" y="121" font-size="12" font-weight="600" fill="var(--text)">Validitas</text>
<text x="280" y="140" font-size="11" fill="var(--text-muted)">format &amp; domain benar?</text>
<rect x="380" y="98" width="160" height="58" rx="10" fill="var(--c6)" opacity="0.25" stroke="var(--c6)" stroke-width="2"/>
<text x="460" y="121" font-size="12" font-weight="600" fill="var(--text)">Keunikan</text>
<text x="460" y="140" font-size="11" fill="var(--text-muted)">ada duplikat?</text>
</g>
<text x="280" y="190" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">data "bagus" = lolos keenamnya, bukan cuma "ada"</text>
<text x="280" y="210" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">setiap dimensi = satu jenis expect_ test di pipeline</text>
</svg>`;

export const de8: V2Lesson = {
  slug: "de8-quality",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE8 — Data Quality: Test & Contract",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kabar baik yang ternyata bug",
      prose: [
        "Senin pagi, dashboard revenue 'TokoKita' menunjukkan kenaikan 40% minggu-ke-minggu. Tim marketing berpesta; direksi menyetujui bonus. Satu-satunya yang tidak ikut senang: Sari, data engineer yang baru bergabung seminggu.",
        "Sari mengecek pipeline dan menemukan: job retry Minggu malam mengeksekusi ulang batch Sabtu — dan job-nya tidak idempoten (DE4!). Setiap order Sabtu tercatat dua kali. 'Kenaikan 40%' itu 100% duplikat.",
        "Twist-nya: tidak ada satu pun test yang gagal, karena tidak ada satu pun test yang ada. Pipeline itu buta kualitas — ia akan dengan patuh menggandakan revenue, meniadakan pelanggan, atau memundurkan tanggal, tanpa pernah protes.",
        "Lesson ini tentang memberi pipeline 'indera': test kualitas data dan kontrak yang berteriak sebelum kabar baik yang palsu mencapai direksi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: data quality = 'data sudah bersih'",
        type: "pitfall",
        body: "Kebersihan adalah kondisi sesaat; kualitas adalah sistem yang menjaganya tetap bersih. Data bisa bersih hari ini dan kotor besok (schema berubah, retry duplikat, sumber ngawur). Tanpa test otomatis yang jalan tiap batch, 'bersih' hanya berarti 'belum ketahuan kotor'.",
      },
      reference: "Quality = test otomatis tiap run + kontrak dengan sumber, bukan sekali bersih.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menguji kualitas data seperti menguji kode.",
        "(1) Menyebutkan enam dimensi kualitas data dan contoh test untuk tiap dimensi;",
        "(2) Menulis validator gaya expect_* (null check, range, uniqueness);",
        "(3) Menulis data contract: janji tertulis antara produsen dan konsumen data;",
        "(4) Memutuskan DI MANA test dipasang: di ingest, di transform, atau di serving.",
      ],
      tasks: [],
    },

    {
      id: "dimensi",
      eyebrow: "Langkah 3 · Dimensi",
      title: "Enam dimensi kualitas",
      prose: [
        "Kualitas data bukan satu angka, melainkan enam dimensi. Akurasi: nilainya benar (bukan Rp-50.000). Kelengkapan: tidak ada yang hilang (amount tidak null). Ketepatan waktu: datang saat dibutuhkan (freshness SLA). Konsistensi: antar tabel cocok (total order = total item). Validitas: format & domain benar (status ∈ {paid, pending, cancelled}). Keunikan: tidak ada duplikat (satu id = satu baris).",
        "Setiap dimensi memetakan ke satu jenis test. Inilah kenapa checklist 'data sudah dicek' yang vague tidak berguna — kamu harus bisa menjawab keenamnya satu per satu.",
        "💡 Intuisi: test kualitas seperti asuransi — nilainya justru saat tidak terjadi apa-apa. Pipeline yang 'tidak pernah gagal test' selama setahun bukan bukti test sia-sia; itu bukti sistem bekerja.",
        "💡 Intuisi: mulai dari dimensi yang pernah membunuhmu. TokoKita mulai dari keunikan (duplikat retry). BankMaju mulai dari konsistensi (rekonsiliasi). Jangan bangun 100 test generik; bangun 10 test untuk luka lamamu.",
        "Cara membaca: enam kartu berlabel — akurasi, kelengkapan, ketepatan waktu, konsistensi, validitas, keunikan. Tiap kartu = satu jenis test. Data 'bagus' = lolos keenamnya.",
        "Interpretasi: 'data sudah bersih' bukan satu klaim melainkan enam. Data bisa akurat tapi terlambat (gagal ketepatan waktu), atau lengkap tapi duplikat (gagal keunikan). Enam dimensi = enam cara data berbohong.",
      ],
      figure: {
        svg: DIM_SVG,
        alt: "Enam dimensi kualitas data.",
        caption: "Enam dimensi, enam jenis test. 'Bagus' = lolos semuanya.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 100% akurat = kualitas sempurna",
        type: "pitfall",
        body: "Data bisa 100% akurat tapi telat 3 hari (gagal ketepatan waktu) atau akurat tapi duplikat (gagal keunikan). Mengukur satu dimensi lalu mengklaim 'data berkualitas' adalah seperti memeriksa rem lalu mengklaim mobil aman — tanpa cek lampu, ban, dan setir.",
      },
      reference: "6 dimensi: akurasi, kelengkapan, ketepatan waktu, konsistensi, validitas, keunikan.",
    },
    {
      id: "contract",
      eyebrow: "Langkah 4 · Kontrak",
      title: "Data contract: janji tertulis dengan sumber",
      prose: [
        "Test memeriksa data yang sudah tiba; kontrak mencegah data sampah tiba sejak awal. Data contract adalah janji tertulis antara produsen (tim aplikasi) dan konsumen (pipeline): 'kolom amount selalu ada, bertipe angka, ≥ 0; status hanya dari himpunan ini; skema berubah → beritahu 2 minggu sebelumnya.'",
        "Kepribadiannya: 'perjanjian sewa'. Tanpa kontrak, tim aplikasi rename kolom seenaknya dan pipeline yang menanggung. Dengan kontrak, perubahan skema menjadi peristiwa yang dikelola — bukan insiden.",
        "Kontrak dieksekusi sebagai test di dua sisi: produsen (validasi sebelum kirim) dan konsumen (validasi saat terima — inilah quality gate). Pelanggaran kontrak = pipeline berhenti dengan pesan jelas, bukan data aneh yang lolos diam-diam.",
      ],
      formula: String.raw`Q = \frac{T_{lolos}}{T_{total}}`,
      formulaNote: "Q = skor kualitas batch (0–1); T_lolos = jumlah test yang lolos; T_total = total test. Q < ambang (mis. 0,95) → batch ditahan, alert dikirim. Contoh lab: 0/5 lolos → Q = 0,00 → BLOCK.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Kontrak yang isinya 'data harus bagus'. Kontrak yang berguna itu spesifik dan testable: nama kolom, tipe, rentang, himpunan nilai, SLA kedatangan. 'Harus bagus' tidak bisa dieksekusi mesin; 'amount ≥ 0' bisa.",
      },
      reference: "Kontrak = janji testable. Gate = eksekusi kontrak tiap batch.",
    },
    {
      id: "lab-validator",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: validator kualitas gaya expect_*",
      prose: [
        "Lab ini membangun suite validasi ala Great Expectations (versi mini): lima expect_ test atas 6 baris order yang masing-masing menyembunyikan satu cacat — null, negatif, duplikat, status invalid, tanggal masa depan.",
        "Cara membaca: tiap expect_ mengembalikan daftar pelanggar. Jika daftar tak kosong → test gagal. Skor Q = test lolos / total test.",
        "Interpretasi: di produksi, suite seperti ini berjalan sebagai quality gate setelah transform — batch dengan Q di bawah ambang tidak diteruskan ke mart.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi 5 fungsi `expect_*` (null, range, unique, valid, fresh)" },
        { id: "t2", text: "Jalankan suite, hitung `gagal` dan `quality_score`" },
        { id: "t3", text: "Cetak tiap hasil + ringkasan" },
      ],
      expected: "5 cek, tiap 1 pelanggaran | cek_gagal=5/5 | quality_score=0.00 → BLOCK",
      note: {
        title: "Sering salah",
        body: "Test keunikan yang hanya menghitung len(set) vs len(list) lalu melaporkan 'ada duplikat' tanpa menunjukkan baris mana. Test yang baik mengembalikan pelanggarnya — debugging butuh bukti, bukan vonis.",
      },
      hints: [
        "expect_no_null: [r for r in rows if r[kolom] is None].",
        "expect_unique: lacak seen; yang sudah pernah terlihat = duplikat.",
        "expect_fresh: tanggal string 'YYYY-MM-DD' bisa dibandingkan langsung.",
      ],
      code: {
        starter: `# Data order (6 baris, 5 cacat tersembunyi)\norders = [\n    {"id": 1, "amount": 150000, "status": "paid", "tgl": "2026-10-13"},\n    {"id": 2, "amount": None, "status": "paid", "tgl": "2026-10-13"},\n    {"id": 3, "amount": -50000, "status": "paid", "tgl": "2026-10-13"},\n    {"id": 3, "amount": 75000, "status": "paid", "tgl": "2026-10-13"},\n    {"id": 4, "amount": 200000, "status": "ngawur", "tgl": "2026-10-13"},\n    {"id": 5, "amount": 90000, "status": "paid", "tgl": "2026-10-20"},\n]\nHARI_INI = "2026-10-13"\nSTATUS_VALID = {"paid", "pending", "cancelled"}\n\n# TULIS KODEMU: 5 expect_*\ndef expect_no_null(rows, kolom):\n    return \ndef expect_range(rows, kolom, lo):\n    return \ndef expect_unique(rows, kolom):\n    \n    return dup\ndef expect_valid(rows, kolom, himpunan):\n    return \ndef expect_fresh(rows, kolom, maks):\n    return \n\nhasil = {\n    "null_amount": expect_no_null(orders, "amount"),\n    "amount_negatif": expect_range(orders, "amount", 0),\n    "id_duplikat": expect_unique(orders, "id"),\n    "status_invalid": expect_valid(orders, "status", STATUS_VALID),\n    "tgl_masa_depan": expect_fresh(orders, "tgl", HARI_INI),\n}\n# TULIS KODEMU: ringkasan\ntotal_cek = len(hasil)\ngagal = \nquality_score = \nfor nama, pelanggar in hasil.items():\n    print(f"{nama}: {len(pelanggar)} pelanggaran")\nprint(f"cek_gagal={gagal}/{total_cek}")\nprint(f"quality_score={quality_score:.2f}")`,
        lockLines: 11,
        solution: `# Data order (6 baris, 5 cacat tersembunyi)\norders = [\n    {"id": 1, "amount": 150000, "status": "paid", "tgl": "2026-10-13"},\n    {"id": 2, "amount": None, "status": "paid", "tgl": "2026-10-13"},\n    {"id": 3, "amount": -50000, "status": "paid", "tgl": "2026-10-13"},\n    {"id": 3, "amount": 75000, "status": "paid", "tgl": "2026-10-13"},\n    {"id": 4, "amount": 200000, "status": "ngawur", "tgl": "2026-10-13"},\n    {"id": 5, "amount": 90000, "status": "paid", "tgl": "2026-10-20"},\n]\nHARI_INI = "2026-10-13"\nSTATUS_VALID = {"paid", "pending", "cancelled"}\n\n# TULIS KODEMU: 5 expect_*\ndef expect_no_null(rows, kolom):\n    return [r for r in rows if r[kolom] is None]\ndef expect_range(rows, kolom, lo):\n    return [r for r in rows if r[kolom] is not None and r[kolom] < lo]\ndef expect_unique(rows, kolom):\n    seen, dup = set(), []\n    for r in rows:\n        if r[kolom] in seen:\n            dup.append(r)\n        seen.add(r[kolom])\n    return dup\ndef expect_valid(rows, kolom, himpunan):\n    return [r for r in rows if r[kolom] not in himpunan]\ndef expect_fresh(rows, kolom, maks):\n    return [r for r in rows if r[kolom] > maks]\n\nhasil = {\n    "null_amount": expect_no_null(orders, "amount"),\n    "amount_negatif": expect_range(orders, "amount", 0),\n    "id_duplikat": expect_unique(orders, "id"),\n    "status_invalid": expect_valid(orders, "status", STATUS_VALID),\n    "tgl_masa_depan": expect_fresh(orders, "tgl", HARI_INI),\n}\n# TULIS KODEMU: ringkasan\ntotal_cek = len(hasil)\ngagal = sum(1 for v in hasil.values() if v)\nquality_score = (total_cek - gagal) / total_cek\nfor nama, pelanggar in hasil.items():\n    print(f"{nama}: {len(pelanggar)} pelanggaran")\nprint(f"cek_gagal={gagal}/{total_cek}")\nprint(f"quality_score={quality_score:.2f}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "null_amount: 1 pelanggaran", label: "test null menemukan 1", msg: "Satu amount = None." },
          { kind: "stdout_matches", task: "t3", pattern: "id_duplikat: 1 pelanggaran", label: "test unique menemukan 1", msg: "id=3 muncul dua kali." },
          { kind: "stdout_matches", task: "t3", pattern: "tgl_masa_depan: 1 pelanggaran", label: "test fresh menemukan 1", msg: "2026-10-20 > 2026-10-13." },
          { kind: "stdout_matches", task: "t3", pattern: "cek_gagal=5/5", label: "`print` cek_gagal=5/5", msg: "Kelima test gagal — batch ini harus di-BLOCK." },
          { kind: "stdout_matches", task: "t3", pattern: "quality_score=0\\.00", label: "`print` quality_score=0.00", msg: "0/5 = 0,00." },
        ],
      },
      reference: "expect_* mengembalikan pelanggar. Q = lolos/total. Di bawah ambang → BLOCK.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Test kualitas data paling berharga = yang paling dekat dengan sumber. Menangkap null di ingest (menit ke-0) vs di dashboard (hari ke-3) = beda biaya perbaikan 100x lipat.",
        "💡 Data contract mengubah debat 'datanya salah' menjadi 'kontraknya dilanggar'. Tertulis, berversi, ada pemilik — tanpa itu, kualitas = harapan baik.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kontrak data adalah perjanjian damai — tulis sebelum perang",
        body: "Perdebatan \"datanya salah\" versus \"querynya salah\" tidak pernah dimenangkan siapa pun — ia hanya berhenti saat ada kontrak tertulis. Heuristik praktisi: setiap tabel penting butuh kontrak dengan empat klausul — skema (kolom, tipe, nullability), freshness SLA (\"data kemarin tersedia pukul 07.00\"), pemilik yang bisa dihubungi, dan masa pemberitahuan perubahan, misalnya 7 hari. Tanpa keempatnya, \"kualitas data\" hanyalah harapan baik. Aturan ekonominya tajam: biaya perbaikan berlipat sekitar 10 kali di setiap lapisan hilir — null yang tertangkap di ingest (menit ke-0) versus di dashboard (hari ke-3) beda biayanya 100 kali lipat. Maka test diletakkan sedekat mungkin ke sumber. Tetapi waspadai jebakan sebaliknya: 50 rule yang semuanya berbunyi tiap malam menghasilkan satu perilaku — alert diabaikan semua. Lima sampai tujuh rule kritis yang dijaga seperti kontrak menangkap sekitar 90 persen insiden; rule ke-50 bernilai marginal nol dengan biaya maintenance nyata. Dan satu pembeda yang menyelamatkan reputasi: bedakan gagal baris dari gagal batch — baris busuk masuk karantina dan batch tetap jalan; hanya kegagalan sistemik yang menahan batch. Gate yang bijak dipertahankan; gate yang kaku akan di-bypass diam-diam.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: test di mana?",
      prose: [
        "Skenario 1 — Validasi skema & tipe. Kondisi: kolom hilang/bertipe salah. Keputusan: di ingest (gerbang masuk). Alasan: tolak sepagi mungkin; jangan proses sampah.",
        "Skenario 2 — Dedup, range, konsistensi antar tabel. Kondisi: butuh konteks transformasi. Keputusan: di clean, pasca-transform. Alasan: di sinilah 'kebenaran' dibentuk.",
        "Skenario 3 — Freshness & kelengkapan mart. Kondisi: dashboard harus terisi tiap pagi. Keputusan: di serve, pra-publish. Alasan: garis pertahanan terakhir sebelum manusia melihat.",
        "Skenario 4 — Anomali statistik (distribusi bergeser). Kondisi: butuh histori sebagai pembanding. Keputusan: monitoring kontinu (bukan gate). Alasan: drift adalah sinyal investigasi, bukan vonis block otomatis — kecuali sudah dikalibrasi.",
        "Aturan praktis 10 detik: murah & pasti → gate (block). Mahal & probabilistik → monitor (alert). Jangan block pipeline karena 'feeling' statistik yang belum dikalibrasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Semua test dijadikan gate yang mem-block. Akibatnya: pipeline berhenti tiap minggu karena false positive, tim mulai me-disable test satu per satu — dan kembali buta. Gate hanya untuk pelanggaran pasti (null di PK, duplikat); sisanya alert.",
      },
      reference: "Pasti & murah → gate. Probabilistik → monitor. False positive membunuh kepercayaan test.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: harga deteksi yang telat",
      prose: [
        "Bug duplikat TokoKita hidup 14 hari sebelum ketahuan (tanpa quality gate). Kerugiannya: 3 analis × 2 jam/hari investigasi sia-sia @Rp150.000/jam selama 14 hari, plus 1 keputusan bonus yang salah senilai Rp50.000.000. Membangun gate dasar biayanya Rp5.000.000 sekali.",
        "Hitung waste analis, total rugi, dan rasionya terhadap biaya gate.",
        "Interpretasi: 12,5x. Dan ini belum menghitung denda kepercayaan direksi yang 'pernah dibohongi dashboard'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `waste_analis` dan `total_rugi`" },
        { id: "t2", text: "Hitung `rasio` (1 desimal) dan cetak semua" },
      ],
      expected: "waste_analis=Rp12,600,000 | total_rugi=Rp62,600,000 | rasio=12.5x",
      hints: [
        "waste = 3 × 2 × 14 × 150000.",
        "total = waste + 50.000.000.",
        "rasio = round(total / 5.000.000, 1).",
      ],
      code: {
        starter: `# Bug hidup 14 hari tanpa gate\nanalis, jam_per_hari, hari_bug, rate = 3, 2, 14, 150_000\nkeputusan_salah = 50_000_000\nbiaya_gate = 5_000_000\n\n# TULIS KODEMU\nwaste_analis = \ntotal_rugi = \nrasio = \n\nprint(f"waste_analis=Rp{waste_analis:,}")\nprint(f"total_rugi=Rp{total_rugi:,}")\nprint(f"rasio={rasio}x")`,
        lockLines: 3,
        solution: `# Bug hidup 14 hari tanpa gate\nanalis, jam_per_hari, hari_bug, rate = 3, 2, 14, 150_000\nkeputusan_salah = 50_000_000\nbiaya_gate = 5_000_000\n\n# TULIS KODEMU\nwaste_analis = analis * jam_per_hari * hari_bug * rate\ntotal_rugi = waste_analis + keputusan_salah\nrasio = round(total_rugi / biaya_gate, 1)\n\nprint(f"waste_analis=Rp{waste_analis:,}")\nprint(f"total_rugi=Rp{total_rugi:,}")\nprint(f"rasio={rasio}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "waste_analis", value: 12600000, tol: 1, label: "`waste_analis` = Rp12.600.000", msg: "3×2×14×150rb = 12,6jt." },
          { kind: "equal", task: "t1", name: "total_rugi", value: 62600000, tol: 1, label: "`total_rugi` = Rp62.600.000", msg: "12,6jt + 50jt = 62,6jt." },
          { kind: "stdout_matches", task: "t2", pattern: "rasio=12\\.5x", label: "`print` rasio=12.5x", msg: "62,6jt / 5jt = 12,5." },
        ],
      },
      reference: "Biaya kualitas = premi asuransi terhadap kabar-baik-palsu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang memberi indera pada pipeline.",
      ],
      tasks: [],
      summary: [
        "Kualitas = sistem test otomatis tiap run + kontrak, bukan sekali bersih.",
        "Enam dimensi: akurasi, kelengkapan, ketepatan waktu, konsistensi, validitas, keunikan.",
        "Kontrak data = janji testable dengan sumber; gate mengeksekusinya tiap batch.",
        "Skor Q = lolos/total; di bawah ambang → block. Pasti & murah → gate; probabilistik → monitor.",
        "Test yang baik mengembalikan pelanggarnya, bukan sekadar vonis.",
      ],
      next: { label: "DE9 — Streaming: Konsep Kafka", href: "/v2/learn/de9-streaming" },
      quiz: [
        {
          q: "Kenapa 'kabar baik 40%' TokoKita tidak tertangkap?",
          options: [
            { text: "Dashboard-nya error", why: "Dashboard menampilkan dengan benar apa yang dihitung pipeline." },
            { text: "Tidak ada test kualitas — pipeline buta, duplikat retry lolos diam-diam", why: "Tepat: tanpa expect_uniquness, job non-idempoten menggandakan revenue tanpa protes.", correct: true },
            { text: "Datanya terlalu sedikit", why: "Volume bukan masalahnya." },
            { text: "Server lambat", why: "Kecepatan tidak relevan." },
          ],
        },
        {
          q: "Data 100% akurat tapi telat 3 hari. Dimensi apa yang gagal?",
          options: [
            { text: "Akurasi", why: "Nilainya benar — akurasi lolos." },
            { text: "Ketepatan waktu", why: "Tepat: benar tapi tidak berguna saat dibutuhkan.", correct: true },
            { text: "Keunikan", why: "Tidak ada info duplikat di sini." },
            { text: "Validitas", why: "Formatnya benar — validitas lolos." },
          ],
        },
        {
          q: "Mana contoh kontrak data yang baik?",
          options: [
            { text: "'Data harus bagus dan lengkap'", why: "Tidak testable — mesin tidak bisa mengeksekusi 'bagus'." },
            { text: "'amount selalu ada, bertipe angka, ≥ 0; status ∈ {paid, pending, cancelled}'", why: "Tepat: spesifik, bisa dijadikan test otomatis.", correct: true },
            { text: "'Jangan kirim data aneh'", why: "'Aneh' tidak terdefinisi." },
            { text: "'Kirim secepatnya'", why: "Tidak ada SLA konkret." },
          ],
        },
        {
          q: "Test mana yang cocok jadi GATE (block otomatis)?",
          options: [
            { text: "Distribusi amount 'terlihat agak bergeser'", why: "Probabilistik → monitor/alert, bukan block." },
            { text: "Primary key mengandung null", why: "Tepat: pasti salah, murah dicek → block.", correct: true },
            { text: "Rata-rata sedikit di atas biasanya", why: "Butuh investigasi → alert." },
            { text: "Ada outlier di ekor distribusi", why: "Outlier bisa legitimate → alert, bukan block." },
          ],
        },
        {
          q: "Skor Q = 0,80 dengan ambang 0,95. Tindakan tepat?",
          options: [
            { text: "Teruskan batch, nanti dicek", why: "Melanggar kontrak gate; 'nanti' = tidak pernah." },
            { text: "Tahan batch + kirim alert berisi daftar pelanggar", why: "Tepat: block + bukti untuk investigasi cepat.", correct: true },
            { text: "Hapus semua test agar Q = 1,00", why: "Goodhart's law versi data engineering — menipu diri sendiri." },
            { text: "Turunkan ambang jadi 0,75", why: "Mengubah target agar lolos = menyerah pada kualitas." },
          ],
        },
        {
          q: "Dashboard menampilkan revenue Rp50M, finance mencatat Rp47M. Selisih stabil 3 bulan. Tindakan pertama?",
          options: [
            { text: "Perbaiki dashboard agar sama dengan finance", why: "Menyamakan paksa tanpa tahu penyebab = memalsukan rekonsiliasi. Selisih STABIL = perbedaan definisi, bukan bug." },
            { text: "Dokumentasikan perbedaan definisi sebagai data contract antar tim", why: "Tepat: selisih stabil = dua definisi yang berbeda (mis. gross vs net). Solusinya bukan 'samakan angkanya' melainkan 'catat definisinya' — contract tertulis agar tidak diperdebatkan tiap bulan.", correct: true },
            { text: "Hapus salah satu angka", why: "Menghapus = menyembunyikan. Kedua angka mungkin benar menurut definisinya masing-masing." },
            { text: "Buat pipeline baru", why: "Pipeline baru dengan definisi yang sama kaburnya = selisih yang sama dengan biaya baru." },
          ],
        },
        {
          q: "Test kualitas paling murah-menangkap-mahal?",
          options: [
            { text: "Test di dashboard (paling akhir)", why: "Menangkap di akhir = data salah sudah dilihat direksi. Paling mahal." },
            { text: "Test di ingest (paling awal)", why: "Tepat: null di gerbang ingest (menit 0) vs di dashboard (hari ke-3) = beda biaya 100x. Semakin ke hulu, semakin murah.", correct: true },
            { text: "Test manual tiap Jumat", why: "Manual = tidak konsisten + tidak scalable. Jumat sore = waktu terburuk untuk menemukan masalah." },
            { text: "Tidak perlu test — data dari sistem inti pasti benar", why: "'Pasti benar' adalah hipotesis paling mahal di data engineering. Sistem inti pun punya bug." },
          ],
        },
      ],
    },
  ],
};
