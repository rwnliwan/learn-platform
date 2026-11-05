import type { V2Lesson } from "../lib/types";

// Jembatan rekonsiliasi: 4050 - 450 (cancelled) - 450 (duplikat) = 3150.
const RECON_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Jembatan rekonsiliasi dari 4050 ke 3150 melalui dua pengurang.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="50" y1="40" x2="500" y2="40"/><line x1="50" y1="100" x2="500" y2="100"/><line x1="50" y1="160" x2="500" y2="160"/><line x1="50" y1="220" x2="500" y2="220"/>
</g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">
<text x="44" y="44" text-anchor="end">4200</text><text x="44" y="104" text-anchor="end">3800</text><text x="44" y="164" text-anchor="end">3400</text><text x="44" y="224" text-anchor="end">3000</text>
</g>
<g font-family="var(--font-ui)">
<rect x="70" y="52" width="80" height="100" fill="var(--c2)" opacity="0.85"/>
<text x="110" y="42" text-anchor="middle" font-size="11" fill="var(--text)">BI</text>
<text x="110" y="106" text-anchor="middle" font-size="13" font-weight="700" fill="var(--bg-app)">4050</text>
<rect x="170" y="102" width="80" height="50" fill="var(--error)" opacity="0.85"/>
<text x="210" y="92" text-anchor="middle" font-size="11" fill="var(--text)">cancelled</text>
<text x="210" y="132" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bg-app)">-450</text>
<rect x="270" y="152" width="80" height="50" fill="var(--error)" opacity="0.6"/>
<text x="310" y="142" text-anchor="middle" font-size="11" fill="var(--text)">duplikat</text>
<text x="310" y="182" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bg-app)">-450</text>
<rect x="370" y="127" width="80" height="75" fill="var(--c1)" opacity="0.85"/>
<text x="410" y="117" text-anchor="middle" font-size="11" fill="var(--text)">Finance</text>
<text x="410" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="var(--bg-app)">3150</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="4,3">
<line x1="150" y1="102" x2="170" y2="102"/><line x1="250" y1="152" x2="270" y2="152"/><line x1="350" y1="202" x2="370" y2="202"/>
</g>
<text x="260" y="258" text-anchor="middle" font-size="11" fill="var(--success)" font-family="var(--font-ui)" font-weight="600">✓ 4050 - 450 - 450 = 3150 · selisih 0</text>
<text x="260" y="274" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Jembatan rekonsiliasi: tiap selisih harus punya nama.</text>
</svg>`;

export const biz9: V2Lesson = {
  slug: "biz9-quality",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI9 — Data Quality untuk BI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua angka benar yang saling bertentangan",
      prose: [
        "Rapat bulanan PT MajuLogistik. Finance: \u201Crevenue Rp12,4 miliar.\u201D Dashboard BI: \u201CRp13,1 miliar.\u201D Selisih 5,6% — Rp700 juta yang tidak bisa dijelaskan. Setengah rapat habis untuk menentukan angka mana yang dipakai untuk bonus direksi.",
        "Investigasi 3 hari menemukan dua penyebab: (1) BI menghitung order cancelled (Rp450 juta) karena status diambil dari tabel yang salah; (2) satu batch order terduplikat saat ETL retry (Rp450 juta lagi, setelah diskala). Keduanya \u201Cbenar\u201D menurut definisi dan prosesnya masing-masing.",
        "Twist-nya: tidak ada yang salah input. Datanya valid, pipelinenya jalan, dashboardnya indah. Yang rusak adalah hal yang tidak terlihat: kontrak kualitas. Data quality bukan soal \u201Cdata kotor\u201D — ini soal definisi ganda dan proses tanpa penjaga.",
        "Di lesson ini kamu akan bisa: (1) memakai 6 dimensi kualitas data; (2) membangun jembatan rekonsiliasi; (3) menemukan break dengan teknik selisih-bernama; (4) memasang data quality firewall.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan rekonsiliasi antar sumber dan menemukan di mana angka patah.",
        "(1) Membandingkan total dari 3+ sumber dan mengukur selisihnya sebagai sinyal, bukan sekadar 'beda';",
        "(2) Menerapkan temuan audit (retur, duplikat) sebagai koreksi — hanya pada sumber yang terbukti salah;",
        "(3) Menentukan sumber paling dekat ke angka audit independen tanpa memaksa semua angka sama;",
        "(4) Menjelaskan kenapa 'angka sama' bukan bukti 'angka benar'.",
      ],
      tasks: [],
    },

    {
      id: "enam-dimensi",
      eyebrow: "Langkah 3 · Enam dimensi",
      title: "Enam dimensi kualitas: checklist sebelum percaya angka",
      prose: [
        "1. AKURASI — apakah nilainya benar? (Rp450 juta cancelled ikut kehitung = tidak akurat). 2. KELENGKAPAN — apakah ada yang hilang? (order tunai tidak masuk ETL). 3. KONSISTENSI — apakah dua sumber sepakat? (BI vs finance beda 5,6%). 4. KETEPATAN WAKTU — apakah cukup segar untuk keputusan? (data kemarin untuk keputusan jam ini). 5. VALIDITAS — apakah formatnya sesuai aturan? (tanggal \u201C32 Jan\u201D lolos). 6. KEUNIKAN — apakah ada duplikat? (retry ETL menggandakan batch).",
        "Kepribadian tiap dimensi: akurasi adalah \u201Csi jujur\u201D, kelengkapan \u201Csi lengkap\u201D, konsistensi \u201Csi kompak\u201D, ketepatan waktu \u201Csi tepat janji\u201D, validitas \u201Csi penjaga gerbang\u201D, keunikan \u201Csi tunggal\u201D. Satu saja absen, angka bisa menipu.",
        "Prioritas untuk BI: konsistensi dan keunikan adalah pembunuh senyap dashboard — tidak ada error, hanya angka yang salah. Akurasi dan validitas bisa dijaga di hulu (firewall). Ketepatan waktu ditentukan kebutuhan keputusan (BI4).",
        "💡 Intuisi kunci: jangan kejar 100% di semua dimensi — itu mustahil dan mahal. Tanya: \u201Ckeputusan apa yang akan salah jika dimensi ini buruk?\u201D Alokasikan usaha ke dimensi yang kegagalannya berbiaya terbesar.",
      ],
      formula: String.raw`\text{gap}\% = \frac{|a - b|}{b} \times 100\% \qquad \text{break} = a - b = \sum \text{penyebab}_i`,
      formulaNote:
        "gap% = selisih relatif dua sumber (a = BI 4050, b = finance 3150 → 28,6% di data latihan). Prinsip rekonsiliasi: selisih HARUS bisa dipecah menjadi penyebab-penyebab bernama yang jumlahnya pas (450 + 450 = 900). Selisih tanpa nama = masalah yang belum dipahami.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: data quality = bersihkan data kotor",
        body: "Membersihkan adalah kuratif — mahal dan berulang. Yang benar adalah preventif: firewall di hulu (validasi saat masuk), kontrak definisi (semantic layer, BI6), dan rekonsiliasi otomatis (deteksi dini). Tim yang hanya \u201Cbersih-bersih\u201D tiap bulan sedang mengepel lantai tanpa memperbaiki atap bocor.",
      },
    },
    {
      id: "rekonsiliasi",
      eyebrow: "Langkah 4 · Rekonsiliasi",
      title: "Jembatan rekonsiliasi: tiap selisih harus punya nama",
      prose: [
        "Teknik selisih-bernama: mulai dari angka BI (4050), kurangi tiap penyebab yang teridentifikasi (cancelled -450, duplikat -450), sampai tiba di angka finance (3150). Jika masih ada sisa yang tidak bernama, investigasi belum selesai.",
        "Cara membaca: batang pertama = angka BI 4050. Dua batang merah turun = penyebab yang ditemukan. Batang terakhir = angka finance 3150. Tanda centang hijau: jembatan \u201Cmenutup\u201D — tidak ada selisih misterius.",
        "Interpretasi: jembatan yang menutup memberi kepercayaan: kita TAHU kenapa beda. Jembatan yang tidak menutup (sisa 200 tak bernama) berarti masih ada bug yang bersembunyi — jangan rilis dashboard sampai ia bernama.",
        "Aturan: rekonsiliasi otomatis untuk metrik kritis (revenue, user aktif) tiap ada refresh. Ambang toleransi eksplisit (mis. gap > 0,5% → alert). Di bawah ambang = noise; di atas = investigasi.",
        "💡 Intuisi kunci: selisih kecil yang KONSISTEN lebih berbahaya dari selisih besar yang sporadis. Gap 0,3% tiap hari ke arah yang sama = bias sistematis (definisi salah). Gap 5% sekali-sebentar = insiden (bisa diperbaiki).",
      ],
      figure: {
        svg: RECON_SVG,
        alt: "Jembatan rekonsiliasi: 4050 dikurangi 450 dan 450 menjadi 3150.",
        caption: "Jembatan rekonsiliasi menutup sempurna: 4050 − 450 − 450 = 3150. Tidak ada selisih misterius.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: selisih kecil tidak perlu diselidiki",
        body: "Selisih kecil tapi konsisten menandakan bias definisi — ia tidak hilang sendiri, ia menumpuk. Rp700 juta \u201Chanya 5,6%\u201D menentukan bonus direksi. Selidiki sampai tiap rupiah punya nama, berapa pun kecilnya, untuk metrik kritis.",
      },
    },
    {
      id: "lab-break",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: temukan break-nya",
      prose: [
        "Kamu diberi dua sumber: `bi_rows` (11 baris, termasuk jebakan) dan `fin_rows` (8 baris, acuan). Tugasmu: (1) hitung `bi_total`, `fin_total`, `gap`; (2) temukan `cancelled_total` dan `duplikat_ids`, hitung `rev_benar` (paid + dedup); (3) verifikasi jembatan menutup: `tutup = (bi_total - cancelled_total - 450 == fin_total)` — angka 450 adalah nilai duplikat yang kamu temukan.",
        "Data latihan ini dibesar-besarkan (gap 28,6%) agar polanya jelas. Di dunia nyata gap-nya 0,5-5% — tekniknya identik, hanya butuh ketelitian lebih.",
        "Coba juga: apa yang terjadi jika kamu lupa dedup SEBELUM filter cancelled? Urutan operasi penting — dokumentasikan urutan rekonsiliasimu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bi_total`, `fin_total`, `gap`" },
        { id: "t2", text: "Temukan `cancelled_total`, `duplikat_ids`; hitung `rev_benar`" },
        { id: "t3", text: "Verifikasi `tutup`, cetak hasil" },
      ],
      expected: "gap=900  rev_benar=3150  tutup=True",
      note: {
        title: "Sering salah",
        body: "Menghitung duplikat dari daftar ID saja tanpa mengurangi nilainya dari total. Menemukan NAMA penyebab belum cukup — harus mengkuantifikasi DAMPAK rupiahnya. Jembatan butuh angka, bukan sekadar label.",
      },
      hints: [
        "bi_total = sum(amount semua bi_rows); fin_total = sum(amount fin_rows); gap = bi_total - fin_total.",
        "cancelled_total = sum(amount where status == 'cancelled'). Duplikat: Counter(order_id) > 1.",
        "rev_benar = sum(amount paid) - nilai duplikat. tutup = (bi_total - cancelled_total - 450 == fin_total).",
      ],
      code: {
        starter: `from collections import Counter\n# (order_id, amount_rb, status)\nbi_rows = [("O1",500,"paid"),("O2",300,"paid"),("O3",200,"cancelled"),\n           ("O4",450,"paid"),("O5",150,"paid"),("O6",600,"paid"),\n           ("O7",250,"cancelled"),("O8",400,"paid"),("O9",350,"paid"),\n           ("O10",400,"paid"),("O4",450,"paid")]\nfin_rows = [("O1",500),("O2",300),("O4",450),("O5",150),\n            ("O6",600),("O8",400),("O9",350),("O10",400)]\n\n# TULIS KODEMU\nbi_total = 0\nfin_total = 0\ngap = 0\ncancelled_total = 0\nduplikat_ids = []\nrev_benar = 0\ntutup = False\n\nprint(f"bi={bi_total} fin={fin_total} gap={gap}")\nprint(f"cancelled={cancelled_total} duplikat={duplikat_ids} rev_benar={rev_benar} tutup={tutup}")`,
        lockLines: 8,
        solution: `from collections import Counter\n# (order_id, amount_rb, status)\nbi_rows = [("O1",500,"paid"),("O2",300,"paid"),("O3",200,"cancelled"),\n           ("O4",450,"paid"),("O5",150,"paid"),("O6",600,"paid"),\n           ("O7",250,"cancelled"),("O8",400,"paid"),("O9",350,"paid"),\n           ("O10",400,"paid"),("O4",450,"paid")]\nfin_rows = [("O1",500),("O2",300),("O4",450),("O5",150),\n            ("O6",600),("O8",400),("O9",350),("O10",400)]\n\n# TULIS KODEMU\nbi_total = sum(a for _, a, _ in bi_rows)\nfin_total = sum(a for _, a in fin_rows)\ngap = bi_total - fin_total\ncancelled_total = sum(a for _, a, s in bi_rows if s == "cancelled")\ncnt = Counter(o for o, _, _ in bi_rows)\nduplikat_ids = sorted([o for o, n in cnt.items() if n > 1])\ndup_nilai = sum(a for o, a, s in bi_rows if o in duplikat_ids) // 2\nrev_benar = sum(a for _, a, s in bi_rows if s == "paid") - dup_nilai\ntutup = (bi_total - cancelled_total - dup_nilai == fin_total)\n\nprint(f"bi={bi_total} fin={fin_total} gap={gap}")\nprint(f"cancelled={cancelled_total} duplikat={duplikat_ids} rev_benar={rev_benar} tutup={tutup}")`,
        checks: [
          { kind: "equal", task: "t1", name: "gap", value: 900, tol: 1e-9, label: "`gap` = 900", msg: "4050 - 3150." },
          { kind: "equal", task: "t2", name: "cancelled_total", value: 450, tol: 1e-9, label: "`cancelled_total` = 450", msg: "O3 (200) + O7 (250)." },
          { kind: "equal", task: "t2", name: "duplikat_ids", value: ["O4"], label: "`duplikat_ids` = ['O4']", msg: "O4 muncul 2 kali." },
          { kind: "equal", task: "t2", name: "rev_benar", value: 3150, tol: 1e-9, label: "`rev_benar` = 3150", msg: "Paid didedup = sama dengan finance." },
          { kind: "equal", task: "t3", name: "tutup", value: true, label: "Jembatan menutup", msg: "4050 - 450 - 450 = 3150." },
          { kind: "stdout_matches", task: "t3", pattern: "gap=900", label: "`print` menampilkan gap", msg: "Cek perhitungan total." },
          { kind: "stdout_matches", task: "t3", pattern: "tutup=True", label: "Jembatan terverifikasi", msg: "Pastikan tiap penyebab terkuantifikasi." },
        ],
      },
      reference: "Counter untuk deteksi duplikat. Rekonsiliasi = pecah selisih jadi penyebab bernama.",
    },    {
      id: "lab2-rekonsiliasi-tiga-sumber",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: rekonsiliasi tiga sumber",
      prose: [
        "BI bilang 2.450, finance 2.380, warehouse 2.510 — selisih 130 juta dan rapat berubah jadi debat kusir. Tugasmu: terapkan temuan audit (retur 45 hanya di BI, duplikat 60 hanya di warehouse), koreksi ketiganya, dan tentukan sumber mana yang paling dekat ke angka audit independen 2.405.",
        "Pelajaran sesungguhnya: angka yang 'paling dekat ke kebenaran' belum tentu 'paling benar metodologinya'. Finance tepat 2.380 karena memang tidak pernah salah hitung — ia hanya belum mencatat retur.",
        "Coba juga: jika duplikat ternyata 130 (bukan 60), sumber mana yang menang? Sensitivitas terhadap temuan audit = alasan kenapa audit harus independen.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `terkoreksi`: dict sumber → angka setelah koreksi" },
        { id: "t2", text: "Tentukan `sumber_benar`: paling dekat ke 2405" },
        { id: "t3", text: "Hitung `selisih_max`: max − min angka terkoreksi" },
      ],
      expected: "terkoreksi={'BI': 2405, 'Finance': 2380, 'Warehouse': 2450}",
      note: {
        title: "Sering salah",
        body: "Mengoreksi finance juga ('kan selisih harus nol semua'). Koreksi hanya mengikuti temuan audit — finance tidak punya temuan, jangan diutak-atik.",
      },
      hints: [
        "BI: kurangi RETUR. Warehouse: kurangi DUPLIKAT. Finance: tetap.",
        "sumber_benar = min(terkoreksi, key=lambda s: abs(terkoreksi[s]-2405)).",
        "selisih_max = max(values) - min(values).",
      ],
      code: {
        starter: `# Total revenue Juni (juta Rp) dari 3 sumber + hasil audit\nbi_total, fin_total, wh_total = 2450, 2380, 2510\n# Temuan audit: retur 45 (masuk BI, tidak masuk finance), duplikat 60 (hanya di warehouse)\nRETUR, DUPLIKAT = 45, 60\n# TULIS KODEMU: terkoreksi, sumber_benar, selisih_max\nterkoreksi = {}\nsumber_benar = ''\nselisih_max = 0\n`,
        lockLines: 4,
        solution: `# Total revenue Juni (juta Rp) dari 3 sumber + hasil audit\nbi_total, fin_total, wh_total = 2450, 2380, 2510\n# Temuan audit: retur 45 (masuk BI, tidak masuk finance), duplikat 60 (hanya di warehouse)\nRETUR, DUPLIKAT = 45, 60\n\n# TULIS KODEMU: terkoreksi, sumber_benar, selisih_max\nterkoreksi = {\n    "BI": bi_total - RETUR,        # BI kelebihan retur\n    "Finance": fin_total,          # finance sudah benar\n    "Warehouse": wh_total - DUPLIKAT,  # warehouse kelebihan duplikat\n}\nkebenaran = 2405  # angka audit independen\nsumber_benar = min(terkoreksi, key=lambda s: abs(terkoreksi[s] - kebenaran))\nselisih_max = max(terkoreksi.values()) - min(terkoreksi.values())\n\nprint(f"terkoreksi={terkoreksi}")\nprint(f"sumber_benar={sumber_benar}  selisih_max={selisih_max}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "terkoreksi=\\{'BI': 2405, 'Finance': 2380, 'Warehouse': 2450\\}", label: "koreksi benar", msg: "BI−45, Finance tetap, WH−60." },
          { kind: "equal", task: "t2", name: "sumber_benar", value: "BI", label: "`sumber_benar` = BI", msg: "Paling dekat ke audit 2405." },
          { kind: "equal", task: "t3", name: "selisih_max", value: 70, label: "`selisih_max` = 70", msg: "2450 − 2380." },
        ],
      },
      reference: "Rekonsiliasi = koreksi berbasis temuan, bukan pemaksaan angka sama.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Selisih antar sumber adalah informasi, bukan aib. Catat polanya tiap bulan: selisih yang stabil = perbedaan definisi (bisa dijelaskan); selisih yang melompat = ada yang rusak (harus diburu).",
        "💡 Jangan pernah 'mengoreksi' sumber yang tidak punya temuan audit. Koreksi tanpa bukti = memalsukan rekonsiliasi agar terlihat rapi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: beri label kepercayaan pada setiap angka",
        body: "Berhentilah memperlakukan semua angka seolah-olah sama tepercaya. Praktisi data quality yang berpengalaman memberi label kepercayaan pada setiap angka yang keluar dari tangannya — biasanya tiga tier. Tier 1: teraudit, boleh dipakai untuk keputusan bernilai besar (angka laporan keuangan, metrik bonus). Tier 2: directional — polanya benar, presisinya ±5–10%, cukup untuk keputusan operasional (tren mingguan, estimasi kampanye). Tier 3: eksploratori — baru sekali dihitung, belum direkonsiliasi, hanya untuk memicu investigasi. Aturan mainnya: tier angka tidak boleh melebihi tier keputusan. Keputusan Rp10 miliar butuh angka tier 1; memakainya dengan angka tier 3 bukan \"agile\", itu judi. Jebakan klasiknya: dua angka \"benar\" yang saling bertentangan — keduanya tier 2 dari definisi berbeda, tetapi disajikan seolah tier 1. Solusinya bukan memilih yang \"lebih benar\", melainkan menurunkan label keduanya dan menuliskan definisinya. Heuristik operasional: setiap dashboard dan laporan rutin wajib mencantumkan tier-nya di tempat terlihat, plus tanggal terakhir ia direkonsiliasi. Angka tanpa label kepercayaan = klaim tanpa bukti. Dan ingat asimetrinya: menaikkan tier itu mahal (butuh audit, rekonsiliasi, dokumentasi), menurunkannya gratis (cukup jujur). Kalau ragu, turunkan — analis yang bilang \"angka ini tier 2, jangan pakai untuk keputusan bonus\" jauh lebih dipercaya daripada yang selalu mengklaim tier 1.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: respons per jenis isu",
      prose: [
        "Skenario 1 — Gap rekonsiliasi > ambang pada metrik kritis. → Freeze dashboard + investigasi akar + komunikasikan ke stakeholder SEBELUM mereka menemukan sendiri. Kepercayaan > kecepatan.",
        "Skenario 2 — Duplikat dari retry ETL. → Idempotency key di pipeline (insert abaikan jika ID sudah ada) + firewall keunikan. Jangan andalkan \u201Cdedup manual tiap bulan\u201D.",
        "Skenario 3 — Definisi ganda (cancelled ikut/tidak). → Daftarkan ke semantic layer (BI6) + satu pemilik definisi. Ini isu governance, bukan isu data.",
        "Skenario 4 — Data terlambat (ketepatan waktu). → SLA eksplisit per dataset + alert keterlambatan. Keputusan operasional butuh data segar; keputusan strategis bisa menunggu.",
        "Skenario 5 — Anomali kecil sesekali (< ambang). → Catat, pantau tren, jangan investigasi tiap kejadian. Investigasi penuh untuk pola, bukan untuk titik.",
        "Aturan praktis 10 detik: metrik kritis = rekonsiliasi otomatis + ambang + pemilik. Selain itu = pantau tren. Tidak ada metrik kritis tanpa ketiganya.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: 12.000 pelanggan ganda",
      prose: [
        "Database CRM PT SinarJaya: 120.000 baris pelanggan. Audit keunikan menemukan 12.000 baris adalah duplikat (nama sama, email beda format: Budi.Santoso@x.com vs budisantoso@x.com). Dampak: kampanye email terkirim 2x (biaya +Rp180 juta/tahun), \u201Cjumlah pelanggan\u201D overstate 10%, segmentasi RFM kacau.",
        "Akar: tidak ada unique constraint di email (dinormalisasi lowercase), tidak ada proses merge saat registrasi ganda, tiga sistem (web, app, offline) menulis tanpa sinkronisasi identitas.",
        "Solusi bertahap: (1) normalisasi + unique constraint (stop pendarahan); (2) aturan merge deterministik (email+telepon cocok → gabung, riwayat transaksi dipertahankan); (3) firewall: tolak insert duplikat di API. Hasil: duplikat baru turun 1.200 → 30 per bulan dalam 2 kuartal.",
        "💡 Intuisi kunci: data quality issue hampir selalu punya \u201Cpintu masuk\u201D di hulu. Menambal di hilir (dedup tiap bulan) = mengepel; menutup pintu (constraint + validasi) = memperbaiki atap.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang data quality. Ingat: tiap selisih harus punya nama.",
      ],
      tasks: [],
      summary: [
        "6 dimensi: akurasi, kelengkapan, konsistensi, ketepatan waktu, validitas, keunikan.",
        "Rekonsiliasi: pecah selisih jadi penyebab bernama sampai jembatan menutup.",
        "Selisih kecil konsisten > selisih besar sporadis (bias vs insiden).",
        "Preventif (firewall + kontrak) > kuratif (bersih-bersih bulanan).",
        "Tutup pintu di hulu; jangan hanya mengepel di hilir.",
      ],
      next: { label: "BI10 — Eksperimen & A/B untuk Insight", href: "/v2/learn/biz10-eksperimen" },
      quiz: [
        {
          q: "BI 4050 vs finance 3150, penyebab: cancelled + duplikat. Pelajaran utamanya?",
          options: [
            { text: "Tim BI tidak kompeten", why: "Keduanya bekerja benar menurut prosesnya." },
            { text: "Tanpa rekonsiliasi + definisi tunggal, angka benar bisa saling bertentangan", why: "Tepat: masalahnya kontrak kualitas, bukan kompetensi.", correct: true },
            { text: "Jangan pakai dashboard", why: "Dashboard bukan masalahnya." },
            { text: "Finance selalu benar", why: "Finance benar di sini, tapi tanpa rekonsiliasi kita takkan tahu." },
          ],
        },
        {
          q: "Jembatan rekonsiliasi menyisakan 200 tak bernama. Artinya?",
          options: [
            { text: "Selesai, 200 itu kecil", why: "Selisih tanpa nama = bug yang belum ditemukan." },
            { text: "Investigasi belum selesai — masih ada penyebab tersembunyi", why: "Tepat: jembatan harus menutup sempurna.", correct: true },
            { text: "Bulatkan saja angkanya", why: "Membulatkan menyembunyikan masalah." },
            { text: "Naikkan ambang toleransi", why: "Mengubah ambang tidak menjelaskan 200 itu." },
          ],
        },
        {
          q: "Duplikat dari retry ETL. Solusi paling tepat?",
          options: [
            { text: "Dedup manual tiap bulan", why: "Kuratif dan berulang — mengepel tanpa perbaiki atap." },
            { text: "Idempotency key + firewall keunikan di pipeline", why: "Tepat: tutup pintu masuknya.", correct: true },
            { text: "Hapus data lama", why: "Menghapus tidak mencegah duplikat baru." },
            { text: "Kecilkan batch ETL", why: "Tidak menyentuh akar: retry tetap bisa terjadi." },
          ],
        },
        {
          q: "Gap 0,3% konsisten tiap hari ke arah yang sama. Ini menandakan?",
          options: [
            { text: "Noise acak", why: "Noise acak tidak konsisten arah." },
            { text: "Bias sistematis — kemungkinan definisi salah", why: "Tepat: konsisten = sistematis, bukan insiden.", correct: true },
            { text: "Tidak perlu diperhatikan", why: "Bias menumpuk dan menyesatkan tren." },
            { text: "Keberuntungan", why: "Bukan penjelasan analitis." },
          ],
        },
        {
          q: "Dimensi kualitas yang PALING membunuh dashboard secara diam-diam?",
          options: [
            { text: "Ketepatan waktu", why: "Data basi biasanya terlihat (timestamp)." },
            { text: "Konsistensi & keunikan — tak ada error, hanya angka salah", why: "Tepat: pembunuh senyap.", correct: true },
            { text: "Validitas format", why: "Format salah biasanya meledak sebagai error." },
            { text: "Kelengkapan", why: "Data hilang sering terdeteksi dari kekosongan." },
          ],
        },
        {
          q: "Setelah koreksi audit, BI=2405, Finance=2380, Warehouse=2450. Manakah yang 'benar' untuk laporan direksi?",
          options: [
            { text: "BI — paling dekat ke audit independen 2405", why: "Tepat dengan catatan: 'benar' di sini = paling dekat ke kebenaran independen. Tapi tetap catat metodologinya — BI benar karena koreksinya tepat, bukan karena angkanya kebetulan dekat.", correct: true },
            { text: "Rata-rata ketiganya (2412)", why: "Rata-rata tiga metodologi berbeda = angka tanpa makna. Jangan menghaluskan perbedaan metodologi dengan aritmetika." },
            { text: "Finance — finance selalu benar", why: "Finance benar secara metodologi pembukuan, tapi ia belum mencatat retur 45. Otoritas institusi ≠ kebenaran angka." },
            { text: "Yang terbesar agar terlihat bagus", why: "Memilih angka karena enak dilihat = fraud pelaporan. Ini tepatnya yang direksi harus bisa deteksi." },
          ],
        },
      ],
    },
  ],
};
