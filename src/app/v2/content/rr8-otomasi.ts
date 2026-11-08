import type { V2Lesson } from "../lib/types";

// Stage pipeline laporan: extract -> validate -> transform -> check -> publish -> log.
const FIG_PIPE = `<svg viewBox=\"0 0 480 260\" role=\"img\" aria-label=\"Enam stage pipeline laporan otomatis dengan validasi dan log di setiap tahap.\">
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<g>
<rect x=\"10\" y=\"90\" width=\"66\" height=\"60\" rx=\"8\" fill=\"var(--c1)\" opacity=\"0.9\"/>
<text x=\"43\" y=\"114\" font-size=\"11\" font-weight=\"600\" fill=\"#fff\">Extract</text>
<text x=\"43\" y=\"130\" font-size=\"10\" fill=\"#fff\">tarik data</text>
<rect x=\"86\" y=\"90\" width=\"66\" height=\"60\" rx=\"8\" fill=\"var(--c2)\" opacity=\"0.9\"/>
<text x=\"119\" y=\"114\" font-size=\"11\" font-weight=\"600\" fill=\"#fff\">Validate</text>
<text x=\"119\" y=\"130\" font-size=\"10\" fill=\"#fff\">cek awal</text>
<rect x=\"162\" y=\"90\" width=\"66\" height=\"60\" rx=\"8\" fill=\"var(--c3)\" opacity=\"0.9\"/>
<text x=\"195\" y=\"114\" font-size=\"11\" font-weight=\"600\" fill=\"#fff\">Transform</text>
<text x=\"195\" y=\"130\" font-size=\"10\" fill=\"#fff\">hitung metrik</text>
<rect x=\"238\" y=\"90\" width=\"66\" height=\"60\" rx=\"8\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"271\" y=\"114\" font-size=\"11\" font-weight=\"600\" fill=\"#fff\">Check</text>
<text x=\"271\" y=\"130\" font-size=\"10\" fill=\"#fff\">rekonsiliasi</text>
<rect x=\"314\" y=\"90\" width=\"66\" height=\"60\" rx=\"8\" fill=\"var(--c5)\" opacity=\"0.9\"/>
<text x=\"347\" y=\"114\" font-size=\"11\" font-weight=\"600\" fill=\"#fff\">Publish</text>
<text x=\"347\" y=\"130\" font-size=\"10\" fill=\"#fff\">terbitkan</text>
<rect x=\"390\" y=\"90\" width=\"66\" height=\"60\" rx=\"8\" fill=\"var(--c6)\" opacity=\"0.9\"/>
<text x=\"423\" y=\"114\" font-size=\"11\" font-weight=\"600\" fill=\"#fff\">Log</text>
<text x=\"423\" y=\"130\" font-size=\"10\" fill=\"#fff\">audit trail</text>
</g>
<g stroke=\"var(--chart-text)\" stroke-width=\"1.5\" marker-end=\"url(#ah)\">
<defs><marker id=\"ah\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6\" fill=\"none\" stroke=\"var(--chart-text)\"/></marker></defs>
<line x1=\"76\" y1=\"120\" x2=\"86\" y2=\"120\"/><line x1=\"152\" y1=\"120\" x2=\"162\" y2=\"120\"/>
<line x1=\"228\" y1=\"120\" x2=\"238\" y2=\"120\"/><line x1=\"304\" y1=\"120\" x2=\"314\" y2=\"120\"/>
<line x1=\"380\" y1=\"120\" x2=\"390\" y2=\"120\"/>
</g>
<rect x=\"86\" y=\"170\" width=\"218\" height=\"40\" rx=\"8\" fill=\"none\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/>
<text x=\"195\" y=\"194\" font-size=\"11\" fill=\"var(--c4)\" font-weight=\"600\">GAGAL di sini → BERHENTI, jangan publish</text>
<text x=\"240\" y=\"36\" font-size=\"12\" fill=\"var(--chart-text)\">Pipeline: tiap stage punya validasi + log. Rerun aman (idempoten).</text>
<text x=\"240\" y=\"236\" font-size=\"11\" fill=\"var(--text-muted)\">Alert jika gagal · data kemarin tidak boleh terkirim diam-diam</text>
</g>
</svg>`;

export const rr8: V2Lesson = {
  slug: "rr8-otomasi",
  track: "Risk Reporting",
  module: "Operasi & Regulasi",
  title: "RR8 — Otomasi Pipeline Laporan",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Lembur tiap tanggal 5, dan malam data kemarin terkirim",
      prose: [
        "Setiap tanggal 5, Dewi lembur sampai jam 11 malam: mengunduh 6 file Excel, copy-paste ke template, menghitung ulang, lalu mengirim laporan ke 14 orang. Suatu bulan ia salah menempel satu kolom — NPL SME tertulis 3,1% padahal 4,1%. Tidak ada yang sadar selama dua minggu. Bulan berikutnya timnya \u201Cnaik kelas\u201D: script otomatis terjadwal tiap jam 6 pagi. Tiga bulan berjalan mulus — sampai suatu pagi job ETL gagal diam-diam, dan laporan terkirim dengan data kemarin. Tidak ada yang sadar selama seminggu.",
        "Twist-nya: otomasi tidak menghilangkan kesalahan manusia — ia mengubah bentuknya. Dari \u201Csalah tempel\u201D menjadi \u201Cgagal diam-diam\u201D. Pelajaran: pipeline otomatis tanpa kontrol (validasi, alert kegagalan, audit trail) = mesin pembuat laporan salah yang bekerja saat kamu tidur. Otomasi yang benar = mesin + asuransi.",
        "Setelah lesson ini kamu bisa: (1) menyebutkan 6 stage pipeline; (2) membangun pipeline mini dengan validasi; (3) menjelaskan idempotensi dan audit trail.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan salah yang terkirim otomatis tiap bulan = kesalahan sistemik, bukan insiden sekali. Skalanya: satu bug × 12 bulan × 14 penerima. Otomasi melipatgandakan kecepatan — termasuk kecepatan berbuat salah.",
      },
      reference: "Otomasi tanpa kontrol = mesin salah yang bekerja saat kamu tidur.",
    },
    {
      id: "stage",
      eyebrow: "Langkah 2 · Enam stage",
      title: "Anatomi pipeline yang sehat",
      prose: [
        "Extract: tarik data dari sumber dengan cap waktu jelas (\u201Cdata per 31 Okt, ditarik 1 Nov 06:00\u201D). Validate: cek awal — file ada? kolom lengkap? tidak ada missing kritis? Transform: hitung metrik, agregat, gabungkan sumber. Check: rekonsiliasi (ingat RR4) — total vs segmen, vs bulan lalu, vs laporan lain. Publish: tulis ke tujuan (folder, email, dashboard) dengan versi. Log: catat setiap run — kapan, data apa, hasil cek apa, siapa/sistem apa yang menjalankan.",
        "Dua prinsip yang membedakan pipeline profesional: idempotensi — dijalankan ulang 10x hasilnya sama (tidak double-count); dan fail-loud — gagal = berhenti + alert keras, BUKAN lanjut dengan data kemarin. Pipeline Dewi versi 2 gagal di prinsip kedua: ia fail-silent.",
        "Cara membaca figur: enam kotak berurutan = aliran data; kotak putus-putus = gerbang: gagal di Validate/Check berarti TIDAK publish. Interpretasi: gerbang inilah \u201Casuransi\u201D-nya. Tanpa gerbang, pipeline = ban berjalan menuju jurang.",
      ],
      figure: {
        svg: FIG_PIPE,
        alt: "Enam stage pipeline laporan otomatis dengan validasi dan log di setiap tahap.",
        caption: "Enam stage + gerbang validasi. Gagal di check = berhenti dan alert, bukan publish data basi.",
      },
      tasks: [],
      formula: String.raw`f(f(x)) = f(x)`,
      formulaNote: "Definisi idempotensi: menjalankan fungsi f dua kali sama dengan sekali. Contoh: \u201Ctulis total 1.210 ke tabel\u201D idempoten; \u201Ctambahkan 1.210 ke tabel\u201D tidak (dijalankan 2x = 2.420). Interpretasi: pipeline idempoten aman di-rerun kapan pun — syarat wajib otomasi laporan.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CScript di laptop yang dijalankan manual tiap bulan = otomasi.\u201D Bukan. Itu manual yang dibungkus script: masih bergantung pada ingatan, masih bisa lupa, tidak ada log, tidak ada alert. Otomasi = terjadwal + terpantau + tercatat, berjalan tanpa kamu.",
      },
      hints: [
        "Intuisi: tanya \u201Cjika saya cuti 2 minggu, apakah laporan tetap terbit benar?\u201D — tidak = belum otomasi.",
        "Fail-loud > fail-silent, selalu. Laporan tidak terbit + alert jauh lebih murah daripada laporan salah yang terbit diam-diam.",
      ],
      reference: "6 stage: extract → validate → transform → check → publish → log. Idempoten + fail-loud.",
    },
    {
      id: "lab-pipe",
      eyebrow: "Langkah 3 · Lab",
      title: "Bangun pipeline mini bervalidasi",
      prose: [
        "Lab ini mensimulasikan pipeline 12 hari data harian: validate (cek missing), transform (jumlahkan), check (rekonsiliasi total vs target 1.210 + pastikan 12 baris). Jika semua lolos → \u201CPIPELINE OK\u201D; jika ada yang gagal → daftar error dan TIDAK publish. Inilah gerbang dari figur Langkah 2 dalam bentuk kode.",
        "Eksperimen sendiri setelah lab: ubah satu nilai menjadi None, atau ubah totalnya — lihat pipeline menolak publish dan melaporkan errornya. Itulah fail-loud: lebih baik tidak terbit daripada terbit salah.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `cek_missing`, `cek_total`, dan gerbang `publish`" },
        { id: "t2", text: "Jalankan: pastikan PIPELINE OK tercetak" },
      ],
      expected: "PIPELINE OK: 12 baris, total 1210, 0 error",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201COtomatis berarti tidak perlu dicek lagi.\u201D Terbalik: otomatis berarti ceknya harus OTOMATIS juga — tertanam di pipeline sebagai gerbang, bukan dihilangkan. Validasi yang dulu dilakukan mata manusia harus diterjemahkan menjadi kode.",
      },
      hints: [
        "cek_missing: any(v is None for _, v in rows).",
        "cek_total: sum(v for _, v in rows) == 1210.",
        "Gerbang: jika errors kosong → print PIPELINE OK; jika tidak → print daftar error.",
      ],
      code: {
        starter: `# Data harian 12 hari (tanggal, nilai). JANGAN UBAH baris ini.\nrows = [("2026-10-01",100),("2026-10-02",102),("2026-10-03",98),("2026-10-04",101),\n        ("2026-10-05",99),("2026-10-06",100),("2026-10-07",103),("2026-10-08",97),\n        ("2026-10-09",100),("2026-10-10",101),("2026-10-11",99),("2026-10-12",110)]\n\n# TULIS KODEMU: validasi\nerrors = []\ncek_missing =\ncek_total =\nif cek_missing: errors.append("ada missing")\nif not cek_total: errors.append("total != 1210")\nif len(rows) != 12: errors.append("baris != 12")\n\n# TULIS KODEMU: gerbang publish\nif :\n    print(f"PIPELINE OK: {len(rows)} baris, total {sum(v for _, v in rows)}, {len(errors)} error")\nelse:\n    print(f"PIPELINE DITAHAN: {errors}")`,
        lockLines: 4,
        solution: `# Data harian 12 hari (tanggal, nilai). JANGAN UBAH baris ini.\nrows = [("2026-10-01",100),("2026-10-02",102),("2026-10-03",98),("2026-10-04",101),\n        ("2026-10-05",99),("2026-10-06",100),("2026-10-07",103),("2026-10-08",97),\n        ("2026-10-09",100),("2026-10-10",101),("2026-10-11",99),("2026-10-12",110)]\n\n# TULIS KODEMU: validasi\nerrors = []\ncek_missing = any(v is None for _, v in rows)\ncek_total = sum(v for _, v in rows) == 1210\nif cek_missing: errors.append("ada missing")\nif not cek_total: errors.append("total != 1210")\nif len(rows) != 12: errors.append("baris != 12")\n\n# TULIS KODEMU: gerbang publish\nif not errors:\n    print(f"PIPELINE OK: {len(rows)} baris, total {sum(v for _, v in rows)}, {len(errors)} error")\nelse:\n    print(f"PIPELINE DITAHAN: {errors}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "PIPELINE OK: 12 baris, total 1210, 0 error", label: "PIPELINE OK tercetak", msg: "Semua gerbang lolos: 12 baris, total 1210, tanpa missing." },
          { kind: "equal", task: "t1", name: "cek_total", value: true, label: "`cek_total` = True", msg: "100+102+...+110 = 1210." },
        ],
      },
      reference: "Validate → gerbang → publish. Gagal = DITAHAN + sebutkan errornya.",
    },
    {
      id: "kontrol",
      eyebrow: "Langkah 4 · Kontrol",
      title: "Asuransi pipeline: log, alert, audit trail",
      prose: [
        "Tiga kontrol wajib: (1) Log tiap run — timestamp, versi data, hasil tiap cek, durasi. Saat angka dipertanyakan 3 bulan kemudian, log adalah saksi. (2) Alert kegagalan — email/chat ke pemilik pipeline saat gerbang gagal; alert harus menuntut aksi (\u201Ccek ETL\u201D), bukan sekadar info. (3) Audit trail — siapa mengubah script terakhir, kapan, kenapa; tanpa ini, bug tidak bisa dilacak ke perubahan.",
        "Satu lagi: data versioning. Simpan snapshot data tiap run (atau hash-nya). Saat laporan Januari dipertanyakan di April, kamu harus bisa merekonstruksi persis angka yang terkirim — bukan \u201Cdata sekarang yang mungkin sudah berubah\u201D.",
      ],
      tasks: [],
      hints: [
        "Intuisi: pipeline yang baik seperti kotak hitam pesawat — saat jatuh, kamu bisa merekonstruksi semuanya dari log.",
        "Aturan kepemilikan: setiap pipeline punya SATU pemilik bernama. Pipeline tanpa pemilik = pipeline yang rusak diam-diam.",
      ],
      reference: "Log + alert + audit trail + snapshot data. Satu pemilik bernama.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Backfill",
      title: "Backfill & replay yang aman: tulis 10x, hasil 1x",
      prose: [
        "Definisi NPL berubah (Kamus v3.1 → v3.2). 12 bulan histori harus dihitung ulang — inilah backfill. Bahayanya: job backfill menulis ke tabel yang sama dengan data produksi. Jika tulisnya 'tambah saja', 12 bulan histori menjadi 24 baris: 12 lama + 12 baru. Laporan menampilkan total ganda sebelum ada yang sadar.",
        "Dua aturan backfill yang aman. Pertama: idempotensi via kunci unik (periode, versi_kamus) — pola tulisnya hapus-dulu-per-partisi lalu insert. Dijalankan 1× atau 10×, hasilnya sama. Kedua: backfill ke tabel staging dulu, validasi (rekonsiliasi total baru vs total lama dalam toleransi ±0,5%), baru swap ke produksi. Staging = ruang aman untuk salah.",
        "Kasus sepupu backfill: replay. Job ETL semalam gagal, data diperbaiki pagi ini, pipeline dijalankan ulang untuk rentang tanggal yang overlap dengan run kemarin. Tanpa idempotensi, replay = double-count (ingat kasus Dewi di cerita pembuka). Dengan kunci unik + delete-then-insert per partisi, replay hanyalah 'tulis ulang yang sama'.",
        "Lab mensimulasikan keduanya: tulis 12 bulan, lalu replay 5 bulan yang overlap. Tanpa dedup → 17 baris (DOUBLE-COUNT). Dengan dedup key → 12 baris (OK). Lima baris kode ini adalah perbedaan antara pipeline profesional dan mesin pembuat laporan ganda.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `tulis` (tanpa dedup) dan `tulis_aman` (dedup)" },
        { id: "t2", text: "Jalankan dan bandingkan hasilnya" },
      ],
      expected: "Tanpa dedup: 17 baris -> DOUBLE-COUNT\nDengan dedup: 12 baris -> OK",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Rerun = aman karena datanya sama.” Datanya sama, tulisnya yang menggandakan. Rerun tanpa idempotensi = 12 bulan histori menjadi 17 baris. Idempotensi bukan fitur mewah — ia syarat pipeline yang boleh diulang.",
      },
      hints: [
        "Kunci unik = periode (r[0]).",
        "tulis_aman melewatkan baris yang kuncinya sudah ada.",
      ],
      code: {
        starter: "# 12 periode histori (JANGAN UBAH).\nperiode = [f\"2026-{m:02d}\" for m in range(1, 13)]\ndata = {p: 100 + i for i, p in enumerate(periode)}\nbatch1 = [(p, data[p]) for p in periode]\nbatch2 = [(p, data[p]) for p in periode[7:]]  # replay 5 bulan overlap\n\n# TULIS KODEMU: dua cara tulis\ndef tulis(tabel, batch):\n    pass  # tanpa dedup\n\ndef tulis_aman(tabel, batch):\n    pass  # dedup berdasarkan kunci periode\n\nt1 = []; tulis(t1, batch1); tulis(t1, batch2)\nt2 = []; tulis_aman(t2, batch1); tulis_aman(t2, batch2)\nprint(f\"Tanpa dedup: {len(t1)} baris -> {'DOUBLE-COUNT' if len(t1) != 12 else 'OK'}\")\nprint(f\"Dengan dedup: {len(t2)} baris -> {'OK' if len(t2) == 12 else 'SALAH'}\")",
        lockLines: 6,
        solution: "# 12 periode histori (JANGAN UBAH).\nperiode = [f\"2026-{m:02d}\" for m in range(1, 13)]\ndata = {p: 100 + i for i, p in enumerate(periode)}\nbatch1 = [(p, data[p]) for p in periode]\nbatch2 = [(p, data[p]) for p in periode[7:]]  # replay 5 bulan overlap\n\n# TULIS KODEMU: dua cara tulis\ndef tulis(tabel, batch):\n    tabel.extend(batch)  # tanpa dedup\n\ndef tulis_aman(tabel, batch):\n    ada = {r[0] for r in tabel}\n    tabel.extend([r for r in batch if r[0] not in ada])\n\nt1 = []; tulis(t1, batch1); tulis(t1, batch2)\nt2 = []; tulis_aman(t2, batch1); tulis_aman(t2, batch2)\nprint(f\"Tanpa dedup: {len(t1)} baris -> {'DOUBLE-COUNT' if len(t1) != 12 else 'OK'}\")\nprint(f\"Dengan dedup: {len(t2)} baris -> {'OK' if len(t2) == 12 else 'SALAH'}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Double-count terdeteksi", msg: "12 + 5 = 17 baris tanpa dedup.", pattern: "Tanpa dedup: 17 baris -> DOUBLE-COUNT" },
          { kind: "stdout_matches", task: "t2", label: "Dedup aman", msg: "Tetap 12 baris dengan dedup.", pattern: "Dengan dedup: 12 baris -> OK" }
        ],
      },
      reference: "Backfill: staging dulu, validasi, baru swap. Kunci unik (periode, versi).",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Idempotency key",
      title: "Tulis 10x, catat 1x",
      prose: [
        "Lab pertama menunjukkan dedup menyelamatkan 5 baris ganda. Lab ini menunjukkan mekanismenya: idempotency key — tiap baris punya kunci unik (tanggal, metrik), dan baris dengan kunci yang sudah ada ditolak. Pola `kunci.add()` di dalam comprehension adalah idiom Python untuk dedup satu baris.",
        "Tanpa kunci: 3 baris (satu ganda). Dengan kunci: 2 baris unik. Di produksi, kunci idempotency membuat retry aman — job yang dijalankan ulang karena timeout tidak menggandakan data. Inilah fondasi 'tulis 10x, hasil 1x' dari lab pertama.",
      ],
      tasks: [
        { id: "t1", text: "Tulis dedup dengan set kunci" },
        { id: "t2", text: "Jalankan dan pastikan hitungannya tercetak" },
      ],
      expected: "Tanpa kunci: 3 baris\nDengan kunci: 2 baris",
      note: {
        title: "Kunci salah = dedup salah.",
        type: "pitfall",
        body: "“Pakai tanggal saja sebagai kunci.” Kunci harus unik per FAKTA (tanggal + metrik + versi), bukan per hari — dua metrik berbeda di hari yang sama bukan duplikat. Kunci terlalu longgar menghapus data sah; terlalu ketat gagal menangkap duplikat.",
      },
      hints: [
        "kunci = set(); simpan baris bila belum ada di kunci.",
        "Idiom: [b for b in baris if not (b in kunci or kunci.add(b))].",
      ],
      code: {
        starter: "# Baris laporan (tanggal, metrik, nilai). JANGAN UBAH.\nbaris = [(\"2026-10-31\", \"NPL\", 3.4), (\"2026-10-31\", \"NPL\", 3.4), (\"2026-10-31\", \"LCR\", 135.0)]\n\n# TULIS KODEMU: dedup dengan idempotency key\nkunci = set()\nunik = \nprint(f\"Tanpa kunci: {len(baris)} baris\")\nprint(f\"Dengan kunci: {len(unik)} baris\")",
        lockLines: 4,
        solution: "# Baris laporan (tanggal, metrik, nilai). JANGAN UBAH.\nbaris = [(\"2026-10-31\", \"NPL\", 3.4), (\"2026-10-31\", \"NPL\", 3.4), (\"2026-10-31\", \"LCR\", 135.0)]\n\n# TULIS KODEMU: dedup dengan idempotency key\nkunci = set()\nunik = [b for b in baris if not (b in kunci or kunci.add(b))]\nprint(f\"Tanpa kunci: {len(baris)} baris\")\nprint(f\"Dengan kunci: {len(unik)} baris\")",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Tanpa kunci = 3 baris", msg: "Data mentah 3 baris (satu ganda).", pattern: "Tanpa kunci: 3 baris" },
          { kind: "stdout_matches", task: "t2", label: "Hitungan tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Dengan kunci: 2 baris" }
        ],
      },
      reference: "Idempotency key = retry aman. Kunci harus unik per fakta, bukan per hari.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Manual, semi, atau full otomasi?",
      prose: [
        "Satu: laporan sekali-sekali, format selalu berubah → manual; otomasi = over-engineering. Dua: laporan rutin bulanan, format stabil → semi-otomatis: script hitung + manusia review + kirim manual. Tiga: laporan harian/mingguan volume besar, format baku → full otomasi terjadwal + gerbang validasi + alert. Empat: laporan ke regulator → full otomasi + audit trail lengkap + review manusia sebelum kirim (kewajiban hukum ≠ boleh full tanpa mata manusia).",
        "Aturan praktis 10 detik: frekuensi × stabilitas format = tingkat otomasi. Sering + stabil = otomasi penuh. Jarang + berubah-ubah = manual. Di tengahnya = semi. Regulator = selalu ada review manusia, seberapa pun otomatisnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Laporan ke regulator = full otomasi + audit trail + review manusia. Tetapi 'review manusia' bukan menatap angka — melainkan menjalankan ulang tiga gerbang (rekonsiliasi, break, lineage) dan membaca log-nya. Manusia memverifikasi mesin, bukan menggantikannya.",
      },
      reference: "Sering+stabil = full. Jarang+berubah = manual. Regulator = review manusia selalu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Malam data kemarin terkirim",
      prose: [
        "Pagi ini laporan harian terkirim jam 6:00 seperti biasa. Jam 9:00 tim ETL mengabari: job semalam gagal, data yang dipakai laporan = data kemarin (30 Okt, bukan 31 Okt). NPL di laporan: 3,4% — angka kemarin. Angka hari ini seharusnya 3,6% (satu debitur besar masuk kolektibilitas 3 semalam). 14 penerima sudah membaca.",
        "Tindakan: (1) kirim koreksi segera ke 14 penerima: \u201Ckoreksi: NPL 3,6%, bukan 3,4%; penyebab: data 30 Okt\u201D; (2) catat sebagai insiden; (3) perbaiki pipeline: tambah cek \u201Ctanggal data = kemarin?\u201D di stage Validate + alert jika ETL gagal. Pelajaran (ingat checklist RR4): cek nomor 6 — tanggal data — adalah yang paling sering gagal, dan inilah buktinya dalam produksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Selisih 0,2 pp NPL selama seminggu tanpa koreksi = komite membahas angka basi. Jika minggu itu ada keputusan limit, keputusannya memakai data salah. Koreksi cepat + perbaikan pipeline = biaya minimal.",
      },
      reference: "Koreksi segera + catat insiden + tambah cek tanggal data di pipeline.",
    },
    {
      id: "template-excel-kode",
      eyebrow: "Langkah 7 · Excel terprogram",
      title: "Excel sebagai output terprogram",
      prose: [
        "Laporan risiko dikirim sebagai workbook, bukan tautan dasbor — karena pembacanya membuka Excel. Komite ingin memfilter sendiri, mengklik sel untuk melihat rumusnya, dan menyimpan salinannya sebagai bukti rapat. File Excel = dokumen yang bisa diaudit, ditandatangani, dan diarsipkan. Pipeline RR8 bisa saja berakhir di PDF yang cantik — tetapi PDF tidak bisa direkonsiliasi; workbook bisa.",
        "Anatomi template yang sehat: tiga lembar dengan peran jelas. Ringkasan: angka utama + tanggal potong data + versi template. Data: tabel mentah per segmen, tanpa angka yang diketik manual. Parameter: nilai ambang, tanggal potong, versi kamus metrik — SEMUA di satu lembar ini, tidak tersebar di dalam rumus. Saat ambang NPL berubah, kamu mengubah satu sel, bukan berburu angka '5%' di 40 rumus.",
        "Untuk menghasilkan workbook dari kode, dua library Python yang umum dipakai: openpyxl membaca dan menulis workbook yang sudah ada — cocok untuk mengisi template yang disiapkan manusia; xlsxwriter menulis workbook baru dengan cepat — cocok membangun laporan dari nol (tetapi ia tidak bisa membaca). Perannya berbeda: satu 'mengisi formulir', satu 'mencetak dokumen'. Pilih sesuai kebutuhan; yang penting, kamu tidak lagi membuat Excel dengan tangan.",
        "Keputusan desain yang sering diperdebatkan: rumus hidup vs nilai tempel. Rumus hidup (sel berisi =SUM(...)) membuat workbook bisa diaudit — pembaca menelusuri dari mana angka berasal. Nilai tempel (angka hasil hitungan Python) membuat workbook stabil — tidak pecah saat dibuka di versi Excel berbeda. Trade-off-nya: rumus hidup rapuh terhadap perubahan struktur template; nilai tempel buta terhadap pertanyaan 'angka dari mana?'. Pola yang umum: angka kritis memakai rumus hidup, sisanya nilai tempel — plus lembar kontrol yang membuktikan keduanya cocok (lihat Langkah 8).",
        "💡 Intuisi: template Excel yang baik itu seperti formulir pajak, bukan kanvas lukis. Setiap sel punya peran: input (boleh diubah), hasil (jangan disentuh), parameter (satu tempat). Bedakan dengan warna. Kalau pembaca harus menebak sel mana yang boleh diisi, template-mu sudah gagal.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 3 lembar template dan peran masing-masing" },
        { id: "t2", text: "Jelaskan kapan memakai openpyxl vs xlsxwriter" },
      ],
      expected: "Ringkasan (angka utama + tanggal potong + versi), Data (mentah, tanpa ketik manual), Parameter (ambang/tanggal potong/versi kamus di satu tempat). openpyxl = mengisi template yang ada; xlsxwriter = membangun workbook baru dari nol.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Workbook yang rumit = laporan yang canggih.\" Bukan. Template yang baik itu membosankan: struktur baku, sedikit rumus cerdas, dan selalu bisa direkonsiliasi. Rumus yang hanya dipahami pembuatnya = single point of failure.",
      },
      reference: "Template laporan: Ringkasan + Data + Parameter. openpyxl = baca-tulis (isi template); xlsxwriter = tulis-cepat (bangun dari nol).",
    },
    {
      id: "template-excel-praktik",
      eyebrow: "Langkah 8 · Praktik",
      title: "Membangun template yang tidak rusak",
      prose: [
        "Template rusak diam-diam, sama seperti pipeline. Empat praktik yang menjaganya tetap hidup. (1) Format angka & tanggal eksplisit. Tulis 1050 sebagai 'Rp1.050 jt' dengan format sel — jangan mengandalkan pembaca menebak satuannya. Tanggal tulis sebagai tanggal Excel sungguhan, bukan teks '31/10/2026' yang tidak bisa disortir dan bisa dibaca sebagai 10/31 oleh Excel berbahasa Inggris.",
        "(2) Validasi input lembar Parameter. Tanggal potong harus akhir bulan; ambang NPL antara 0–100%; versi kamus harus salah satu dari daftar yang berlaku. Tanpa validasi, satu angka salah ketik di lembar Parameter meracuni seluruh workbook — garbage in, gospel out: angka salah yang terlihat rapi dipercaya begitu saja.",
        "(3) Proteksi sel rumus. Kunci semua sel berisi rumus; biarkan terbuka hanya sel input dan lembar Parameter. Workbook tanpa proteksi akan 'diperbaiki' seseorang dalam tiga bulan: satu sel rumus tertimpa angka ketik, dan tidak ada yang tahu sampai audit setahun kemudian.",
        "(4) Pengujian template + versi. Setiap template punya angka kontrol: total baris di lembar Data harus sama dengan angka di lembar Ringkasan — lab di bawah mensimulasikannya dengan struktur workbook sebagai data. Template punya nomor versi dan changelog; pipeline mencatat versi template yang dipakai di setiap run — bagian dari audit trail (ingat Langkah 4). Template v2.2 yang menghasilkan angka Januari harus bisa diidentifikasi dua tahun kemudian.",
        "💡 Intuisi: angka kontrol adalah tanda tangan template. Ia berkata: 'workbook ini konsisten dengan dirinya sendiri'. Bukan jaminan angkanya benar terhadap dunia — itu tugas rekonsiliasi (RR4) — tetapi jaminan tidak ada yang rusak di jalan dari Data ke Ringkasan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `total_lembar` yang menjumlahkan sel sebuah lembar" },
        { id: "t2", text: "Bandingkan angka kontrol dengan lembar ringkasan dan pastikan KONTROL OK" },
      ],
      expected: "KONTROL OK: kredit=1050, treasury=300, grand=1350",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Template sekali jadi, selesai selamanya.\" Tidak. Kamus metrik berubah, segmen bisnis berubah, template ikut berubah. Template tanpa pemilik dan tanpa versi = template yang diam-diam kedaluwarsa.",
      },
      hints: [
        "total_lembar: sum(workbook[nama].values()).",
        "Bandingkan tiap total dengan sel ringkasan yang sesuai: B5, B6, B7.",
      ],
      code: {
        starter: `# Struktur workbook sbg data: lembar -> sel (JANGAN UBAH)\nworkbook = {\n    "data_kredit": {"C2": 480, "C3": 310, "C4": 260},\n    "data_treasury": {"C2": 150, "C3": 90, "C4": 60},\n    "ringkasan": {"B5": 1050, "B6": 300, "B7": 1350},  # angka kontrol\n}\n\n# TULIS KODEMU: hitung total tiap lembar data\ndef total_lembar(nama):\n    pass\n\nkredit =\ntreasury =\ngrand = kredit + treasury\n\n# TULIS KODEMU: bandingkan dgn angka kontrol\nif :\n    print(f"KONTROL OK: kredit={kredit}, treasury={treasury}, grand={grand}")\nelse:\n    print("KONTROL GAGAL")`,
        lockLines: 6,
        solution: `# Struktur workbook sbg data: lembar -> sel (JANGAN UBAH)\nworkbook = {\n    "data_kredit": {"C2": 480, "C3": 310, "C4": 260},\n    "data_treasury": {"C2": 150, "C3": 90, "C4": 60},\n    "ringkasan": {"B5": 1050, "B6": 300, "B7": 1350},  # angka kontrol\n}\n\n# TULIS KODEMU: hitung total tiap lembar data\ndef total_lembar(nama):\n    return sum(workbook[nama].values())\n\nkredit = total_lembar("data_kredit")\ntreasury = total_lembar("data_treasury")\ngrand = kredit + treasury\n\n# TULIS KODEMU: bandingkan dgn angka kontrol\nif kredit == workbook["ringkasan"]["B5"] and treasury == workbook["ringkasan"]["B6"] and grand == workbook["ringkasan"]["B7"]:\n    print(f"KONTROL OK: kredit={kredit}, treasury={treasury}, grand={grand}")\nelse:\n    print("KONTROL GAGAL")`,
        checks: [
          { kind: "equal", task: "t1", name: "kredit", value: 1050, label: "`kredit` = 1050", msg: "480+310+260 = 1050." },
          { kind: "equal", task: "t1", name: "treasury", value: 300, label: "`treasury` = 300", msg: "150+90+60 = 300." },
          { kind: "stdout_matches", task: "t2", pattern: "KONTROL OK: kredit=1050, treasury=300, grand=1350", label: "KONTROL OK tercetak", msg: "Total tiap lembar cocok dengan angka kontrol ringkasan." },
        ],
      },
      reference: "Angka kontrol: total Data = angka Ringkasan. Proteksi sel rumus. Versi template + changelog tercatat di run.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Lalu audit satu proses manual di kantormu: layak diotomasi di level berapa?",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Sebelum mengotomasi proses manual apa pun, jawab dulu: apakah ia idempoten? Jika dijalankan dua kali hasilnya beda, perbaiki desain tulisnya dulu — otomasi hanya mempercepat, tidak memperbaiki.",
      },

      summary: [
        "6 stage: extract → validate → transform → check → publish → log.",
        "Idempoten: rerun 10x = hasil sama. Fail-loud: gagal = berhenti + alert.",
        "Script manual ≠ otomasi. Otomasi = terjadwal + terpantau + tercatat.",
        "Kontrol: log tiap run, alert kegagalan, audit trail, snapshot data.",
        "Regulator = selalu ada review manusia sebelum kirim.",
      ],
      next: { label: "RR9 — Menjawab Permintaan Adhoc dalam 2 Jam", href: "/v2/learn/rr9-adhoc" },
      quiz: [
        {
          q: "Apa beda utama \u201Cscript di laptop\u201D dengan otomasi sejati?",
          options: [
            { text: "Bahasa pemrogramannya", why: "Bukan soal bahasa — soal jadwal, pantauan, dan catatan." },
            { text: "Otomasi berjalan terjadwal + terpantau + tercatat tanpa campur tangan", why: "Tepat. Script manual masih bergantung pada ingatan manusia.", correct: true },
            { text: "Jumlah baris kode", why: "Panjang kode bukan ukuran otomasi." },
          ],
        },
        {
          q: "Pipeline idempoten artinya?",
          options: [
            { text: "Berjalan sangat cepat", why: "Itu performansi, bukan idempotensi." },
            { text: "Dijalankan ulang berkali-kali hasilnya tetap sama", why: "Benar. f(f(x)) = f(x) — aman di-rerun kapan pun.", correct: true },
            { text: "Tidak pernah gagal", why: "Tidak ada pipeline yang tidak pernah gagal — makanya ada fail-loud." },
          ],
        },
        {
          q: "Job ETL gagal diam-diam, laporan terkirim dengan data kemarin. Prinsip yang dilanggar?",
          options: [
            { text: "Idempotensi", why: "Bukan — rerun bukan masalahnya di sini." },
            { text: "Fail-loud", why: "Tepat. Gagal harus berhenti + alert, bukan lanjut dengan data basi.", correct: true },
            { text: "Data versioning", why: "Versioning membantu investigasi, tetapi yang dilanggar = kegagalan diam-diam." },
          ],
        },
        {
          q: "Laporan ke regulator sebaiknya?",
          options: [
            { text: "Full otomasi tanpa sentuhan manusia", why: "Kewajiban hukum butuh mata manusia sebelum kirim." },
            { text: "Otomasi + audit trail + review manusia sebelum kirim", why: "Benar. Efisiensi mesin + akuntabilitas manusia.", correct: true },
            { text: "Selalu manual agar aman", why: "Manual justru rawan salah tempel (kasus Dewi) — dan tidak tercatat." },
          ],
        },
        {
          q: "Cek pipeline apa yang menangkap kasus \u201Cdata kemarin terkirim\u201D?",
          options: [
            { text: "Cek tanggal data di stage Validate", why: "Tepat — \u201Capakah ini data per tanggal yang benar?\u201D (checklist RR4 no. 6).", correct: true },
            { text: "Cek jumlah baris", why: "Jumlah baris bisa sama persis untuk data kemarin." },
            { text: "Cek format file", why: "Format benar — isinya yang basi." },
          ],
        },
      ],
    },
  ],
};
