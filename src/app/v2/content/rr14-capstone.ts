import type { V2Lesson } from "../lib/types";

// Alur capstone: 6 tahap dari data kotor ke paket CRO.
const FIG_CAP = `<svg viewBox=\"0 0 480 300\" role=\"img\" aria-label=\"Alur enam tahap capstone dari data kotor sampai paket laporan CRO.\">
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<g>
<rect x=\"14\" y=\"110\" width=\"62\" height=\"64\" rx=\"8\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"45\" y=\"136\" font-size=\"10\" font-weight=\"600\" fill=\"#fff\">1. BERSIH</text>
<text x=\"45\" y=\"152\" font-size=\"10\" fill=\"#fff\">QA data</text>
<rect x=\"92\" y=\"110\" width=\"62\" height=\"64\" rx=\"8\" fill=\"var(--c2)\" opacity=\"0.9\"/>
<text x=\"123\" y=\"136\" font-size=\"10\" font-weight=\"600\" fill=\"#fff\">2. HITUNG</text>
<text x=\"123\" y=\"152\" font-size=\"10\" fill=\"#fff\">metrik</text>
<rect x=\"170\" y=\"110\" width=\"62\" height=\"64\" rx=\"8\" fill=\"var(--c1)\" opacity=\"0.9\"/>
<text x=\"201\" y=\"136\" font-size=\"10\" font-weight=\"600\" fill=\"#fff\">3. NILAI</text>
<text x=\"201\" y=\"152\" font-size=\"10\" fill=\"#fff\">vs batas</text>
<rect x=\"248\" y=\"110\" width=\"62\" height=\"64\" rx=\"8\" fill=\"var(--c3)\" opacity=\"0.9\"/>
<text x=\"279\" y=\"136\" font-size=\"10\" font-weight=\"600\" fill=\"#fff\">4. GAMBAR</text>
<text x=\"279\" y=\"152\" font-size=\"10\" fill=\"#fff\">chart jujur</text>
<rect x=\"326\" y=\"110\" width=\"62\" height=\"64\" rx=\"8\" fill=\"var(--c5)\" opacity=\"0.9\"/>
<text x=\"357\" y=\"136\" font-size=\"10\" font-weight=\"600\" fill=\"#fff\">5. CERITA</text>
<text x=\"357\" y=\"152\" font-size=\"10\" fill=\"#fff\">narasi</text>
<rect x=\"404\" y=\"110\" width=\"62\" height=\"64\" rx=\"8\" fill=\"var(--c6)\" opacity=\"0.9\"/>
<text x=\"435\" y=\"136\" font-size=\"10\" font-weight=\"600\" fill=\"#fff\">6. PAKET</text>
<text x=\"435\" y=\"152\" font-size=\"10\" fill=\"#fff\">untuk CRO</text>
</g>
<g stroke=\"var(--chart-text)\" stroke-width=\"1.5\">
<line x1=\"76\" y1=\"142\" x2=\"92\" y2=\"142\"/><line x1=\"154\" y1=\"142\" x2=\"170\" y2=\"142\"/>
<line x1=\"232\" y1=\"142\" x2=\"248\" y2=\"142\"/><line x1=\"310\" y1=\"142\" x2=\"326\" y2=\"142\"/>
<line x1=\"388\" y1=\"142\" x2=\"404\" y2=\"142\"/>
</g>
<text x=\"240\" y=\"50\" font-size=\"13\" font-weight=\"600\" fill=\"var(--chart-text)\">Paket Laporan Bulanan CRO — end to end</text>
<text x=\"240\" y=\"70\" font-size=\"11\" fill=\"var(--text-muted)\">Setiap tahap punya gerbang QA. Gagal di satu tahap = berhenti, bukan lanjut.</text>
<rect x=\"60\" y=\"200\" width=\"360\" height=\"44\" rx=\"8\" fill=\"none\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/>
<text x=\"240\" y=\"227\" font-size=\"11\" fill=\"var(--c4)\" font-weight=\"600\">Aturan capstone: setiap angka di paket harus bisa ditelusur ke sumbernya</text>
</g>
</svg>`;

export const rr14: V2Lesson = {
  slug: "rr14-capstone",
  track: "Risk Reporting",
  module: "Operasi & Regulasi",
  title: "RR14 — Capstone: Paket Laporan Bulanan CRO",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Hari ini kamu pemilik laporannya",
      prose: [
        "Bayangkan: Senin pagi, 08:00. CRO memanggilmu: \u201CPaket laporan bulanan — kamu yang pegang mulai bulan ini. Data mentah dari tim ETL sudah di folder. Saya butuh paketnya Kamis jam 10.\u201D Tidak ada template warisan yang rapi. Yang ada: file CSV berantakan, tiga definisi NPL yang berbeda di tiga sheet, dan satu pesan: \u201Cdata bulan Maret tolong dicek, kayaknya aneh.\u201D",
        "Twist-nya: inilah pekerjaan risk reporting yang sebenarnya — bukan mengerjakan soal latihan yang datanya sudah bersih, melainkan mengubah kekacauan menjadi keputusan. 13 lesson sebelumnya adalah perkakasmu: QA data (RR4), metrik + definisi (RR3), headline (RR1), anatomi (RR2), chart jujur (RR5), narasi Minto (RR6), dashboard (RR7), otomasi (RR8). Capstone ini merangkainya menjadi satu paket nyata: dari data kotor → metrik → chart → narasi → paket CRO.",
        "Setelah lesson ini kamu bisa: (1) membersihkan data kotor dan mendokumentasikan pembersihannya; (2) menghitung metrik + menilai vs batas; (3) menyusun paket laporan 1 halaman eksekutif + lampiran.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Paket CRO yang buruk = CRO memutuskan dengan kabur. Paket yang baik = organisasi yang waspada. Tanggung jawab ini nyata: angka yang kamu tulis Kamis akan dipakai dalam keputusan Rp miliar.",
      },
      reference: "Capstone = 13 lesson dalam 1 paket. Dari kotor ke keputusan.",
    },
    {
      id: "alur",
      eyebrow: "Langkah 2 · Alur kerja",
      title: "Enam tahap, tiap tahap bergerbang",
      prose: [
        "Tahap 1 — BERSIH: QA data mentah (rekonsiliasi, missing, duplikat, break). Dokumentasikan setiap pembersihan: \u201C1 baris missing (Mar) dibuang, 1 duplikat (Mei) digabung.\u201D Tahap 2 — HITUNG: NPL, coverage, LCR, konsentrasi — dengan definisi dari kamus (satu definisi!). Tahap 3 — NILAI: bandingkan tiap metrik dengan batas → status AMAN/WASPADA + gap.",
        "Tahap 4 — GAMBAR: chart jujur untuk tiap temuan (sumbu nol, satu pesan per chart, lie factor = 1). Tahap 5 — CERITA: narasi Minto — headline 3 angka + SCQA per temuan + rekomendasi bernama. Tahap 6 — PAKET: susun 1 halaman eksekutif + lampiran (metodologi, definisi, data). Setiap tahap punya gerbang: gagal QA = berhenti dan perbaiki, bukan lanjut.",
        "Cara membaca figur: enam kotak berurutan = alur kerja; kotak putus-putus = aturan emas capstone. Interpretasi: urutannya tidak bisa dibalik — narasi sebelum data bersih = fiksi; chart sebelum metrik dinilai = dekorasi.",
      ],
      figure: {
        svg: FIG_CAP,
        alt: "Alur enam tahap capstone dari data kotor sampai paket laporan CRO.",
        caption: "Enam tahap capstone. Tiap tahap bergerbang QA; urutan tidak bisa dibalik.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CData kotor dibiarkan karena cuma contoh.\u201D Justru data kotor ADALAH pelajarannya. Analis yang hanya pernah menyentuh data bersih akan panik saat menghadapi file nyata. Capstone melatih otot yang paling dibutuhkan: berurusan dengan kekacauan secara sistematis.",
      },
      hints: [
        "Intuisi: 70% waktumu akan habis di tahap 1–2 (bersih + hitung). Itu normal — fondasi yang rapuh meruntuhkan seluruh paket.",
        "Dokumentasikan pembersihan SEBELUM lupa. \u201CKenapa Maret dibuang?\u201D harus terjawab 3 bulan kemudian dari catatanmu.",
      ],
      reference: "Bersih → hitung → nilai → gambar → cerita → paket. Tiap tahap bergerbang.",
    },
    {
      id: "lab-capstone",
      eyebrow: "Langkah 3 · Lab",
      title: "Pipeline capstone: kotor → headline",
      prose: [
        "Data NPL 11 bulan (dalam %): ada 1 missing (Maret), 1 duplikat (Mei tercatat dua kali). Bangun pipeline 3 tahap: (1) BERSIH — buang missing, gabung duplikat, catat apa yang dibuang; (2) HITUNG — NPL terakhir, MoM (pp), maksimum; (3) NILAI — status vs batas 3,0%.",
        "Output yang benar: \u201C12 baris kotor → 10 bersih (1 missing, 1 duplikat)\u201D lalu \u201CNPL terakhir 3,4%, MoM −0,1pp, maks 3,5% → WASPADA (di atas batas 3,0%)\u201D. Perhatikan MoM negatif (membaik!) tetapi status tetap WASPADA — karena masih di atas batas. Inilah penilaian yang jujur: tren membaik, posisi masih waspada. Keduanya benar, keduanya harus dilaporkan.",
      ],
      formula: String.raw`\text{Total} = \sum \text{segmen} \qquad \text{bersih} = \text{kotor} - \text{missing} - \text{duplikat}`,
      formulaNote: "Dua identitas QA capstone. Contoh: 12 baris kotor − 1 missing − 1 duplikat = 10 bersih. Interpretasi: setiap baris yang hilang harus bisa dijelaskan — tidak ada data yang \u201Changat\u201D tanpa catatan.",
      tasks: [
        { id: "t1", text: "Tahap BERSIH: buang missing & duplikat, hitung yang dibuang" },
        { id: "t2", text: "Tahap HITUNG+NILAI: metrik + status vs batas 3,0" },
      ],
      expected: "12 baris kotor -> 10 bersih (1 missing, 1 duplikat)\nNPL terakhir 3.4%, MoM -0.1pp, maks 3.5% -> WASPADA (batas 3.0%)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CMoM membaik berarti sudah aman.\u201D Tren dan posisi adalah dua hal berbeda. Atlet yang larinya membaik tetapi masih di luar 10 besar = membaik TETAPI belum aman. Laporkan keduanya — \u201Ctren membaik, posisi masih waspada\u201D — jangan pilih salah satu.",
      },
      hints: [
        "Bersih: lewati v is None (missing); lewati bulan yang sudah ada di seen (duplikat).",
        "terakhir = bersih[-1]; mom = bersih[-1] − bersih[-2]; maks = max(bersih).",
        "Status: WASPADA jika terakhir > 3.0.",
      ],
      code: {
        starter: `# NPL bulanan (%): ada missing & duplikat. JANGAN UBAH baris ini.\nraw = [("2026-01",3.1),("2026-02",3.2),("2026-03",None),("2026-04",3.1),\n       ("2026-05",3.3),("2026-05",3.3),("2026-06",3.2),("2026-07",3.4),\n       ("2026-08",3.4),("2026-09",3.3),("2026-10",3.5),("2026-11",3.4)]\nBATAS = 3.0\n\n# TAHAP 1 - BERSIH\nseen = set(); bersih = []; n_missing = 0; n_dup = 0\nfor bln, v in raw:\n    \nprint(f"{len(raw)} baris kotor -> {len(bersih)} bersih ({n_missing} missing, {n_dup} duplikat)")\n\n# TAHAP 2+3 - HITUNG & NILAI\nterakhir =\nmom =\nmaks =\nstatus =\nprint(f"NPL terakhir {terakhir}%, MoM {mom:+.1f}pp, maks {maks}% -> {status} (batas {BATAS}%)")`,
        lockLines: 5,
        solution: `# NPL bulanan (%): ada missing & duplikat. JANGAN UBAH baris ini.\nraw = [("2026-01",3.1),("2026-02",3.2),("2026-03",None),("2026-04",3.1),\n       ("2026-05",3.3),("2026-05",3.3),("2026-06",3.2),("2026-07",3.4),\n       ("2026-08",3.4),("2026-09",3.3),("2026-10",3.5),("2026-11",3.4)]\nBATAS = 3.0\n\n# TAHAP 1 - BERSIH\nseen = set(); bersih = []; n_missing = 0; n_dup = 0\nfor bln, v in raw:\n    if v is None:\n        n_missing += 1; continue\n    if bln in seen:\n        n_dup += 1; continue\n    seen.add(bln); bersih.append(v)\nprint(f"{len(raw)} baris kotor -> {len(bersih)} bersih ({n_missing} missing, {n_dup} duplikat)")\n\n# TAHAP 2+3 - HITUNG & NILAI\nterakhir = bersih[-1]\nmom = bersih[-1] - bersih[-2]\nmaks = max(bersih)\nstatus = "WASPADA" if terakhir > BATAS else "AMAN"\nprint(f"NPL terakhir {terakhir}%, MoM {mom:+.1f}pp, maks {maks}% -> {status} (batas {BATAS}%)")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "12 baris kotor -> 10 bersih \\(1 missing, 1 duplikat\\)", label: "Pembersihan benar", msg: "12 − 1 missing − 1 duplikat = 10." },
          { kind: "stdout_matches", task: "t2", pattern: "NPL terakhir 3\\.4%, MoM -0\\.1pp, maks 3\\.5% -> WASPADA", label: "Headline + status benar", msg: "Terakhir 3.4, MoM −0.1, maks 3.5; 3.4 > 3.0 = WASPADA." },
        ],
      },
      reference: "Bersih (catat!) → hitung → nilai vs batas. Tren ≠ posisi.",
    },
    {
      id: "paket",
      eyebrow: "Langkah 4 · Paket",
      title: "Susun paket 1 halaman + lampiran",
      prose: [
        "Paket final untuk CRO Kamis jam 10: HALAMAN 1 (eksekutif) — 3 angka headline dari lab (NPL 3,4%, MoM −0,1pp, maks 3,5%), status WASPADA, satu paragraf SCQA: (S) NPL 3,4% di atas batas 3,0%; (C) tren membaik 0,1 pp tetapi posisi masih waspada, puncak 3,5% bulan lalu; (Q) apakah tambah pencadangan? (A) Ya — usulan tambah CKPN Rp8 miliar, pemilik Kepala Divisi Risiko, tenggat akhir bulan. LAMPIRAN — metodologi pembersihan data, definisi NPL (kamus v3.2), tabel 10 bulan bersih, chart tren jujur (sumbu nol).",
        "Checklist paket sebelum kirim (dari RR4 + RR8): rekonsiliasi ✓, definisi di footnote ✓, tanggal data benar ✓, tiap angka tertelusur ke sumber ✓, reviewer kedua ✓. Satu yang tidak boleh ada: angka yang tidak bisa kamu jelaskan asalnya dalam 1 menit.",
      ],
      tasks: [],
      hints: [
        "Intuisi: paket yang baik membuat CRO berani memutuskan — bukan membuatnya semakin bingung dengan banyaknya data.",
        "Tes akhir: berikan halaman 1 ke rekan yang tidak ikut mengerjakan. Jika ia bisa menjelaskan keputusan yang harus diambil, paketmu lolos.",
      ],
      reference: "1 halaman: headline + SCQA + rekomendasi. Lampiran: metodologi + definisi + data.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Gerbang",
      title: "Checklist sebagai kode: gerbang terakhir sebelum kirim",
      prose: [
        "Checklist RR4 + RR8 di langkah 'paket' bisa ditulis sebagai kode — dan seharusnya. Paket = dict: hasil rekonsiliasi, daftar angka yatim, versi kamus, tanggal data. Lima gerbang assert: (1) rekonsiliasi_ok; (2) tidak ada angka yatim; (3) kamus == 'v3.2'; (4) tanggal data == kemarin; (5) tiap angka headline > 0.",
        "Di lab, paket contoh gagal di gerbang 4: tanggal data 29 Okt padahal kemarin 30 Okt — persis kasus ETL RR8. Verdict: TAHAN + nama gerbang yang gagal. Tidak ada 'centang belakangan'. Gerbang yang bisa dinegosiasi = bukan gerbang.",
        "Checklist sebagai kode punya tiga keunggulan atas checklist kertas: dijalankan setiap kali kirim (tidak lelah, tidak lupa), hasilnya tercatat di log (audit trail untuk 3 bulan kemudian), dan aturannya berversi (checklist v1.3 — sama seperti kamus metrik). Saat CRO bertanya 'sudah dicek?', jawabannya = log run, bukan ingatan.",
        "Aturan emas capstone: jika Rabu malam datamu masih kotor, potong scope narasi — jangan potong QA. Gerbang ini yang menegakkannya secara mekanis: ia tidak peduli deadline Kamis jam 10. Laporan pendek yang benar > laporan lengkap yang meragukan — dan gerbang memastikan kamu tidak bisa memilih yang kedua.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi 5 gerbang assert pada `paket`" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Gerbang gagal: tanggal data bukan kemarin\nVerdict: TAHAN, perbaiki dulu",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Checklist = formalitas yang dicentang belakangan.” Checklist yang dicentang belakangan = surat izin yang ditandatangani setelah kecelakaan. Gerbang kode tidak bisa 'belakangan' — ia berjalan SEBELUM kirim, atau tidak kirim sama sekali.",
      },
      hints: [
        "Tiap gerbang: if gagal -> gagal.append(nama).",
        "Verdict TAHAN jika list gagal tidak kosong.",
      ],
      code: {
        starter: "# Paket laporan Kamis jam 10 (JANGAN UBAH).\npaket = {\"rekonsiliasi_ok\": True, \"angka_yatim\": [], \"kamus\": \"v3.2\",\n         \"tanggal_data\": \"2026-10-29\", \"kemarin\": \"2026-10-30\"}\n\n# TULIS KODEMU: lima gerbang, kumpulkan yang gagal\ngagal = []\nif not paket[\"rekonsiliasi_ok\"]:\n    gagal.append(\"rekonsiliasi\")\n\nprint(\"Gerbang gagal: \" + (\", \".join(gagal) if gagal else \"tidak ada\"))\nprint(\"Verdict: \" + (\"TAHAN, perbaiki dulu\" if gagal else \"KIRIM\"))",
        lockLines: 4,
        solution: "# Paket laporan Kamis jam 10 (JANGAN UBAH).\npaket = {\"rekonsiliasi_ok\": True, \"angka_yatim\": [], \"kamus\": \"v3.2\",\n         \"tanggal_data\": \"2026-10-29\", \"kemarin\": \"2026-10-30\"}\n\n# TULIS KODEMU: lima gerbang, kumpulkan yang gagal\ngagal = []\nif not paket[\"rekonsiliasi_ok\"]:\n    gagal.append(\"rekonsiliasi\")\nif paket[\"angka_yatim\"]:\n    gagal.append(\"angka yatim: \" + \",\".join(paket[\"angka_yatim\"]))\nif paket[\"kamus\"] != \"v3.2\":\n    gagal.append(\"kamus bukan v3.2\")\nif paket[\"tanggal_data\"] != paket[\"kemarin\"]:\n    gagal.append(\"tanggal data bukan kemarin\")\n\nprint(\"Gerbang gagal: \" + (\", \".join(gagal) if gagal else \"tidak ada\"))\nprint(\"Verdict: \" + (\"TAHAN, perbaiki dulu\" if gagal else \"KIRIM\"))",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Gerbang 4 gagal", msg: "Tanggal data 29 ≠ kemarin 30.", pattern: "Gerbang gagal: tanggal data bukan kemarin" },
          { kind: "stdout_matches", task: "t2", label: "Verdict TAHAN", msg: "Satu gerbang gagal = tahan kirim.", pattern: "Verdict: TAHAN, perbaiki dulu" }
        ],
      },
      reference: "Lima gerbang: rekonsiliasi, yatim, kamus, tanggal, positivitas. Gagal = TAHAN.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Skor kesiapan",
      title: "Checklist yang bisa dihitung",
      prose: [
        "Lab pertama memakai checklist sebagai gerbang. Lab ini mengubah checklist menjadi skor: 5 item, tiap item 1/0, kirim hanya bila 5/5. Skor saat ini 3/5 — kurang 'narasi' dan 'review sejawat' — verdict: TAHAN.",
        "Skor kesiapan mencegah negosiasi dengan diri sendiri ('kurang satu item, kirim saja'). Aturan biner (5/5 atau TAHAN) menghilangkan ruang tawar-menawar. Di bank nyata, gerbang seperti ini dijalankan sistem — bukan mengandalkan disiplin analis yang sedang diburu deadline.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor = jumlah item terpenuhi" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Kesiapan: 3/5\nVerdict: TAHAN\nLengkapi dulu: ['narasi', 'review sejawat']",
      note: {
        title: "Checklist ≠ pemikiran.",
        type: "pitfall",
        body: "“Semua item centang, pasti laporan bagus.” Checklist menangkap kelalaian prosedural, bukan kualitas analisis — narasi yang asal-asalan tetap lolos centang 'narasi ada'. Gerbang mencegah lupa, bukan menggantikan review substansi.",
      },
      hints: [
        "skor = sum(cek.values()).",
        "kurang = [k for k, v in cek.items() if not v].",
      ],
      code: {
        starter: "# Checklist kesiapan (1=terpenuhi). JANGAN UBAH.\ncek = {\"tanggal data\": 1, \"rekonsiliasi\": 1, \"narasi\": 0, \"cap versi\": 1, \"review sejawat\": 0}\n\n# TULIS KODEMU: skor + verdict\nskor = \nprint(f\"Kesiapan: {skor}/{len(cek)}\")\nprint(\"Verdict:\", \"KIRIM\" if skor == len(cek) else \"TAHAN\")\nkurang = \nprint(f\"Lengkapi dulu: {kurang}\")",
        lockLines: 4,
        solution: "# Checklist kesiapan (1=terpenuhi). JANGAN UBAH.\ncek = {\"tanggal data\": 1, \"rekonsiliasi\": 1, \"narasi\": 0, \"cap versi\": 1, \"review sejawat\": 0}\n\n# TULIS KODEMU: skor + verdict\nskor = sum(cek.values())\nprint(f\"Kesiapan: {skor}/{len(cek)}\")\nprint(\"Verdict:\", \"KIRIM\" if skor == len(cek) else \"TAHAN\")\nkurang = [k for k, v in cek.items() if not v]\nprint(f\"Lengkapi dulu: {kurang}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`skor` = 3", msg: "Tiga dari lima item terpenuhi.", name: "skor", value: 3 },
          { kind: "stdout_matches", task: "t2", label: "Verdict TAHAN", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Verdict: TAHAN" }
        ],
      },
      reference: "5/5 atau TAHAN — tanpa ruang tawar. Gerbang dijalankan sistem, bukan disiplin.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Alokasi 3 hari: Senin–Kamis",
      prose: [
        "Satu: Senin — BERSIH + HITUNG (70% waktu di sini; fondasi menentukan segalanya). Dua: Selasa — NILAI + GAMBAR (chart jujur per temuan). Tiga: Rabu — CERITA (narasi Minto, minta review rekan). Empat: Kamis pagi — PAKET + checklist final + kirim jam 10. Jangan kerjakan berurutan per-bagian-laporan (semua headline dulu, dst.) — kerjakan per-TAHAP agar gerbang QA menangkap masalah sedini mungkin.",
        "Aturan praktis 10 detik: jika Rabu malam datamu masih kotor, potong scope narasi — jangan potong QA. Laporan pendek yang benar > laporan lengkap yang meragukan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Senin = BERSIH + HITUNG (70% waktu). Gerbang kode paling berharga di hari Senin: ia menangkap masalah saat masih murah diperbaiki — bukan Kamis jam 9 pagi.",
      },
      reference: "Senin: bersih+hitung. Selasa: nilai+gambar. Rabu: cerita+review. Kamis: paket+kirim.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Sidang paket: pertahankan angkamu",
      prose: [
        "Simulasi: CRO bertanya tiga hal tentang paketmu. (1) \u201CKenapa Maret hilang dari tabel?\u201D — Jawaban: \u201CData Maret missing dari ETL; saya buang 1 baris dan catat di metodologi lampiran hal. 3.\u201D (2) \u201CMoM membaik, kenapa status masih WASPADA?\u201D — \u201CTren membaik 0,1 pp, tetapi posisi 3,4% masih di atas batas 3,0%. Keduanya saya laporkan — tren untuk arah, status untuk posisi.\u201D (3) \u201CDarimana angka 3,5% maks?\u201D — \u201CBulan Oktober, dari tabel bersih lampiran; lineage: ETL 1 Nov 06:00, query q_npl_v3.\u201D",
        "Tiga jawaban, tiga prinsip: dokumentasi pembersihan (RR4), tren vs posisi (lesson ini), lineage (RR4). Jika kamu bisa menjawab ketiganya tanpa membuka file — paketmu siap. Jika tidak — kembali ke tahap yang bocor. Inilah standar \u201Cpertahankan angkamu\u201D: setiap angka punya jawaban dalam 1 menit.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "CRO yang tidak bisa mempertahankan angka ke direksi = keputusan ditunda = risiko berjalan. Paketmu bukan dokumen — ia amunisi CRO di ruang rapat. Buat ia tajam.",
      },
      reference: "Setiap angka: jawaban 1 menit. Dokumentasi + tren/posisi + lineage.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan selamat!",
      prose: [
        "Lima pertanyaan terakhir track ini. Setelah ini: kembali ke kurikulum, dan bangun satu paket nyata di kantormu.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Standar 'pertahankan angkamu': setiap angka di paket harus bisa kamu jelaskan asalnya dalam 1 menit. Jika tidak — kembali ke tahap yang bocor. Tidak ada angka yang naik ke halaman 1 tanpa jawaban.",
      },

      summary: [
        "Capstone = 13 lesson dalam 1 paket: bersih → hitung → nilai → gambar → cerita → paket.",
        "70% waktu di bersih + hitung; dokumentasikan setiap pembersihan.",
        "Tren ≠ posisi: laporkan keduanya (MoM −0,1pp tetapi WASPADA).",
        "Setiap angka tertelusur ke sumber; setiap angka terjawab dalam 1 menit.",
        "Laporan pendek yang benar > laporan lengkap yang meragukan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Urutan tahap capstone yang benar?",
          options: [
            { text: "Cerita → gambar → bersih → hitung", why: "Narasi sebelum data bersih = fiksi." },
            { text: "Bersih → hitung → nilai → gambar → cerita → paket", why: "Tepat. Fondasi dulu, tiap tahap bergerbang.", correct: true },
            { text: "Paket → bersih → cerita", why: "Paket adalah hasil akhir, bukan awal." },
          ],
        },
        {
          q: "MoM −0,1pp (membaik) tetapi status WASPADA. Mengapa keduanya dilaporkan?",
          options: [
            { text: "Karena analis bingung", why: "Bukan bingung — ini penilaian berlapis yang benar." },
            { text: "Tren = arah, posisi = vs batas; keduanya benar dan keduanya dibutuhkan", why: "Tepat. Membaik ≠ aman.", correct: true },
            { text: "Cukup laporkan yang membaik agar menenangkan", why: "Itu comfort palsu (ingat RR11)." },
          ],
        },
        {
          q: "CRO bertanya \u201Ckenapa Maret hilang?\u201D Jawaban yang benar?",
          options: [
            { text: "\u201CLupa mencatat alasannya\u201D", why: "Tidak terdokumentasi = tidak bisa dipertahankan." },
            { text: "\u201CData Maret missing dari ETL; dibuang 1 baris, tercatat di metodologi lampiran\u201D", why: "Benar. Setiap baris hilang punya catatan.", correct: true },
            { text: "\u201CTidak penting, cuma 1 baris\u201D", why: "Meremehkan = CRO kehilangan kepercayaan pada seluruh paket." },
          ],
        },
        {
          q: "Jika Rabu malam data masih kotor, apa yang dipotong?",
          options: [
            { text: "QA, agar paket lengkap", why: "Memotong QA = paket meragukan = lebih buruk dari tidak lengkap." },
            { text: "Scope narasi — laporan pendek yang benar > lengkap yang meragukan", why: "Benar. Kebenaran tidak bisa ditawar.", correct: true },
            { text: "Lampiran definisi", why: "Tanpa definisi, angka tidak bisa dipertahankan (ingat RR3)." },
          ],
        },
        {
          q: "Standar \u201Cpertahankan angkamu\u201D artinya?",
          options: [
            { text: "Hafal semua angka di luar kepala", why: "Bukan hafalan — ketertelusuran." },
            { text: "Setiap angka bisa dijelaskan asalnya dalam 1 menit (dokumentasi + lineage)", why: "Tepat. Itulah paket yang siap disidang.", correct: true },
            { text: "Jangan pernah salah hitung", why: "Manusia bisa salah — sistem (QA + dokumentasi) yang menangkapnya." },
          ],
        },
      ],
    },
  ],
};
