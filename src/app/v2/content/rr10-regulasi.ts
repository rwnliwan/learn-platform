import type { V2Lesson } from "../lib/types";

// Timeline kalender pelaporan: deadline bulanan + tenggat terdekat.
const FIG_KAL = `<svg viewBox=\"0 0 480 280\" role=\"img\" aria-label=\"Timeline kalender pelaporan dengan empat kewajiban dan hitung mundur tenggat.\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\">
<line x1=\"30\" y1=\"230\" x2=\"450\" y2=\"230\"/>
</g>
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<g>
<circle cx=\"120\" cy=\"230\" r=\"7\" fill=\"var(--c4)\"/>
<text x=\"120\" y=\"200\" font-size=\"12\" font-weight=\"600\" fill=\"var(--c4)\">15 Okt · SLIK</text>
<text x=\"120\" y=\"184\" font-size=\"11\" fill=\"var(--chart-text)\">sisa 2 hari</text>
<text x=\"120\" y=\"168\" font-size=\"11\" font-weight=\"700\" fill=\"var(--c4)\">SEGERA</text>
</g>
<g>
<circle cx=\"230\" cy=\"230\" r=\"7\" fill=\"var(--c2)\"/>
<text x=\"230\" y=\"200\" font-size=\"12\" font-weight=\"600\" fill=\"var(--chart-text)\">20 Okt · Triwulan</text>
<text x=\"230\" y=\"184\" font-size=\"11\" fill=\"var(--chart-text)\">sisa 7 hari</text>
</g>
<g>
<circle cx=\"330\" cy=\"230\" r=\"7\" fill=\"var(--c1)\"/>
<text x=\"330\" y=\"200\" font-size=\"12\" font-weight=\"600\" fill=\"var(--chart-text)\">5 Nov · Harian BI</text>
<text x=\"330\" y=\"184\" font-size=\"11\" fill=\"var(--chart-text)\">sisa 23 hari</text>
</g>
<g>
<circle cx=\"420\" cy=\"230\" r=\"7\" fill=\"var(--c1)\"/>
<text x=\"420\" y=\"200\" font-size=\"12\" font-weight=\"600\" fill=\"var(--chart-text)\">10 Nov · Bulanan OJK</text>
<text x=\"420\" y=\"184\" font-size=\"11\" fill=\"var(--chart-text)\">sisa 28 hari</text>
</g>
<text x=\"60\" y=\"252\" font-size=\"11\" fill=\"var(--text-muted)\">13 Okt · hari ini</text>
<text x=\"240\" y=\"60\" font-size=\"13\" font-weight=\"600\" fill=\"var(--chart-text)\">Kalender kewajiban pelaporan (contoh)</text>
<text x=\"240\" y=\"80\" font-size=\"11\" fill=\"var(--text-muted)\">Merah = &lt; 7 hari. Buffer internal = deadline − 3 hari.</text>
<rect x=\"150\" y=\"100\" width=\"180\" height=\"36\" rx=\"8\" fill=\"none\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/>
<text x=\"240\" y=\"123\" font-size=\"11\" fill=\"var(--c4)\" font-weight=\"600\">Aturan: kirim H−3, bukan H−0</text>
</g>
</svg>`;

export const rr10: V2Lesson = {
  slug: "rr10-regulasi",
  track: "Risk Reporting",
  module: "Operasi & Regulasi",
  title: "RR10 — Dasar Regulasi Pelaporan OJK/BI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua hari yang lebih mahal dari lembur sebulan",
      prose: [
        "Laporan bulanan selesai tanggal 12 — dua hari lewat dari tenggat. \u201CCuma dua hari,\u201D kata manajer, \u201Cyang penting lengkap.\u201D Seminggu kemudian datang surat teguran + denda administratif. Nilai dendanya: lebih besar dari total biaya lembur tim selama sebulan. Lebih pahit lagi: keterlambatan tercatat dalam rekam kepatuhan bank dan ditanyakan lagi saat pemeriksaan tahunan.",
        "Twist-nya: tidak ada yang tidak tahu tenggatnya. Tenggatnya tertulis jelas di kalender. Yang tidak ada: buffer (target internal 3 hari sebelum tenggat), pemilik tunggal (semua mengira orang lain yang mengirim), dan rencana cadangan (penanggung jawab cuti). Keterlambatan regulasi hampir tidak pernah soal tidak tahu — selalu soal tidak siap.",
        "Acuan regulasi lesson ini (per Oktober 2026): POJK 18/POJK.03/2017 (SLIK), POJK 11/POJK.03/2016 (KPMM), POJK 42/POJK.03/2015 (LCR), POJK 50/POJK.03/2017 (NSFR), POJK 32/POJK.03/2018 (BMPK), POJK 10/POJK.05/2022 (LPBBTI/P2P lending), dan PBI 21/9/PBI/2019 (Laporan Bank Umum Terintegrasi ke BI). Untuk detail teknis, ikuti ketentuan terbaru dan kebijakan kepatuhan bankmu.",
        "Setelah lesson ini kamu bisa: (1) menyebutkan jenis laporan wajib bank ke OJK/BI; (2) membangun kalender tenggat dengan hitung mundur; (3) menjelaskan konsekuensi keterlambatan dan cara mencegahnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kepatuhan pelaporan = risiko hukum dan reputasi. Denda + teguran + catatan pemeriksaan = biaya yang jauh melebihi biaya lembur. Risk reporting yang baik melindungi bank dari risiko ini — dimulai dari kalender.",
      },
      reference: "Keterlambatan regulasi = soal kesiapan, bukan pengetahuan.",
    },
    {
      id: "kewajiban",
      eyebrow: "Langkah 2 · Kewajiban",
      title: "Apa yang wajib dilaporkan bank",
      prose: [
        "Bank umum menyampaikan laporan berkala ke OJK melalui APOLO (Aplikasi Pelaporan Online OJK) — antara lain laporan keuangan bulanan/triwulanan (neraca, laba rugi), laporan KPMM/CAR, laporan kualitas aset (NPL), dan laporan BMPK. Ke BI, bank menyampaikan Laporan Bank Umum Terintegrasi (PBI 21/9/PBI/2019) dengan periode harian hingga triwulanan — periode harian mencakup data pasar uang, transaksi devisa, dan posisi devisa neto (penerus LHBU, PBI 13/8/PBI/2011). SLIK (Sistem Layanan Informasi Keuangan — dulu BI Checking/SID milik BI, dikelola OJK sejak 1 Januari 2018) memuat data debitur individual dari seluruh pelapor; ketepatannya memengaruhi penilaian kredit nasabah di seluruh industri. Pelapor wajib menyampaikan Laporan Debitur bulanan ke OJK paling lambat tanggal 12 bulan berikutnya (POJK 18/POJK.03/2017).",
        "Rasio yang dipantau regulator: KPMM/CAR — minimum 8% dari ATMR sesuai profil risiko (POJK 11/POJK.03/2016); LCR — minimum 100% (POJK 42/POJK.03/2015); NSFR — minimum 100% (POJK 50/POJK.03/2017); BMPK — penyediaan dana ke seluruh pihak terkait paling tinggi 10% dari modal bank (POJK 32/POJK.03/2018). Penyelenggara LPBBTI (P2P lending) wajib menyampaikan laporan berkala ke OJK: laporan bulanan paling lambat 10 hari kerja setelah periode berakhir, laporan tahunan paling lambat 30 April (POJK 10/POJK.05/2022). Prinsipnya sama di semua: format baku, definisi baku, tenggat keras.",
        "Tiga perbedaan laporan regulasi vs internal: (1) definisi mengikuti regulator, bukan kamus internal; (2) format tidak bisa dinegosiasi; (3) salah = sanksi, bukan sekadar revisi. Itu sebabnya RR8 mewajibkan review manusia sebelum kirim laporan regulasi.",
      ],
      tasks: [],
      formula: String.raw`\text{Hari tersisa} = \text{tanggal tenggat} - \text{hari ini}`,
      formulaNote: "Sederhana tetapi paling sering diabaikan. Contoh: tenggat SLIK 15 Okt, hari ini 13 Okt → sisa 2 hari → status SEGERA. Interpretasi: < 7 hari = SEGERA (kerja lembur diizinkan); < 3 hari = KRISIS (eskalasi).",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CLaporan internal yang bagus bisa langsung dikirim ke regulator.\u201D Tidak. Definisi, format, dan periode bisa berbeda (ingat RR3). Mengirim angka internal dengan definisi internal ke regulator = temuan audit. Selalu ada tahap \u201Ckonversi ke definisi regulator\u201D + rekonsiliasi.",
      },
      hints: [
        "Intuisi: regulator membaca KONSISTENSI — angka laporanmu bulan ini vs bulan lalu vs laporan bank lain. Anomali = pertanyaan = pemeriksaan.",
        "SLIK yang salah merugikan nasabah nyata (skor kreditnya). Ketelitian di sini = tanggung jawab sosial, bukan sekadar compliance.",
      ],
      reference: "Sumber: POJK 11/POJK.03/2016 (KPMM) · POJK 42/POJK.03/2015 (LCR) · POJK 50/POJK.03/2017 (NSFR) · POJK 32/POJK.03/2018 (BMPK) · POJK 18/POJK.03/2017 (SLIK) · POJK 10/POJK.05/2022 (LPBBTI) · PBI 21/9/PBI/2019 (laporan terintegrasi BI).",
    },
    {
      id: "lab-kalender",
      eyebrow: "Langkah 3 · Lab",
      title: "Kalender tenggat dengan hitung mundur",
      prose: [
        "Bangun pengingat otomatis: dari daftar kewajiban (nama + tanggal tenggat bulan berjalan), hitung tenggat berikutnya dari tanggal referensi 13 Oktober 2026 dan sisa harinya. Jika tenggat bulan ini sudah lewat, geser ke bulan depan. Tandai SEGERA jika sisa < 7 hari.",
        "Hasilnya: SLIK 15 Okt sisa 2 hari → SEGERA. Inilah yang seharusnya dilihat manajer di cerita pembuka — bukan pada tanggal 12 saat semuanya sudah terlambat. Kalender seperti ini dipasang di dinding tim kepatuhan, bukan di kepala seseorang.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi logika geser-bulan dan hitung `sisa`" },
        { id: "t2", text: "Jalankan dan temukan yang SEGERA" },
      ],
      expected: "SLIK 2026-10-15 sisa 2 hari SEGERA\nLaporan Triwulan 2026-10-20 sisa 7 hari \nLaporan Harian BI 2026-11-05 sisa 23 hari \nLaporan Bulanan OJK 2026-11-10 sisa 28 hari",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CTenggat = tanggal kirim.\u201D Salah. Tenggat regulator = tanggal DITERIMA sistem mereka. Kirim H−0 dengan upload gagal jam 23:50 = terlambat. Target internal = H−3. Tiga hari buffer untuk gagal upload, revisi, dan cuti tak terduga.",
      },
      hints: [
        "Jika tanggal tenggat <= hari ini, buat tanggal yang sama di bulan berikut.",
        "sisa = (tenggat - ref).days.",
        "SEGERA jika sisa < 7.",
      ],
      code: {
        starter: `# Kewajiban: (nama, tanggal tenggat tiap bulan). JANGAN UBAH baris ini.\nimport datetime\nref = datetime.date(2026, 10, 13)\nkew = [("SLIK", 15), ("Laporan Triwulan", 20),\n       ("Laporan Harian BI", 5), ("Laporan Bulanan OJK", 10)]\n\n# TULIS KODEMU\nfor nama, tgl in kew:\n    tenggat =\n    sisa =\n    flag =\n    print(f"{nama} {tenggat} sisa {sisa} hari {flag}")`,
        lockLines: 5,
        solution: `# Kewajiban: (nama, tanggal tenggat tiap bulan). JANGAN UBAH baris ini.\nimport datetime\nref = datetime.date(2026, 10, 13)\nkew = [("SLIK", 15), ("Laporan Triwulan", 20),\n       ("Laporan Harian BI", 5), ("Laporan Bulanan OJK", 10)]\n\n# TULIS KODEMU\nfor nama, tgl in kew:\n    tenggat = datetime.date(2026, 10, tgl)\n    if tenggat <= ref:\n        tenggat = datetime.date(2026, 11, tgl)\n    sisa = (tenggat - ref).days\n    flag = "SEGERA" if sisa < 7 else ""\n    print(f"{nama} {tenggat} sisa {sisa} hari {flag}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "SLIK 2026-10-15 sisa 2 hari SEGERA", label: "SLIK = SEGERA", msg: "15 Okt − 13 Okt = 2 hari < 7." },
          { kind: "stdout_matches", task: "t2", pattern: "Laporan Bulanan OJK 2026-11-10 sisa 28 hari", label: "Bulanan OJK geser bulan", msg: "10 Okt sudah lewat → 10 Nov, sisa 28 hari." },
          { kind: "stdout_matches", task: "t2", pattern: "Laporan Harian BI 2026-11-05 sisa 23 hari", label: "Harian BI geser bulan", msg: "5 Okt sudah lewat → 5 Nov." },
        ],
      },
      reference: "Hitung mundur tiap hari; SEGERA jika < 7 hari; target kirim H−3. Contoh di lab ini fiktif untuk latihan logika — ketentuan nyata mis. SLIK ≤ tgl 12 (POJK 18/POJK.03/2017).",
    },
    {
      id: "konsekuensi",
      eyebrow: "Langkah 4 · Konsekuensi",
      title: "Harga keterlambatan",
      prose: [
        "Konsekuensi bertingkat — contoh konkret SLIK (POJK 18/POJK.03/2017 Pasal 32–33): keterlambatan Laporan Debitur dikenai denda Rp1.000.000 per hari kerja (bank beraset ≥ Rp500 miliar) atau Rp100.000 per hari kerja (aset di bawahnya), plus penundaan pemberian Informasi Debitur sampai laporan diterima OJK; tidak menyampaikan sama sekali: denda Rp50.000.000/Rp5.000.000 per bulan laporan. Pola yang sama berlaku umum: teguran/peringatan tertulis → denda administratif (kewajiban membayar) → pembatasan/pembekuan kegiatan usaha → penurunan tingkat kesehatan bank (mis. POJK 6/POJK.03/2015 untuk laporan publikasi bank; PBI 21/9/PBI/2019 untuk laporan ke BI). Yang tidak tertulis: setiap keterlambatan membuat pemeriksa berikutnya datang dengan asumsi \u201Cbank ini berantakan\u201D — dan asumsi itu mahal.",
        "Pencegahan tiga lapis: (1) kalender bersama dengan pemilik tunggal per laporan; (2) target internal H−3 + pengingat otomatis H−7; (3) backup person — setiap laporan punya minimal 2 orang yang bisa mengerjakannya. Cerita pembuka gagal di ketiganya.",
        "Cara membaca figur: garis waktu 13 Okt → 10 Nov; merah = < 7 hari (SEGERA); kotak putus-putus = aturan H−3. Interpretasi: tanpa kalender visual, urgensi tidak terasa sampai terlambat. Kalender mengubah tenggat abstrak menjadi hitung mundur konkret.",
      ],
      figure: {
        svg: FIG_KAL,
        alt: "Timeline kalender pelaporan dengan empat kewajiban dan hitung mundur tenggat.",
        caption: "Kalender kewajiban (contoh, per 13 Okt). Merah = segera; aturan main: kirim H−3.",
      },
      tasks: [],
      hints: [
        "Intuisi: denda adalah harga yang terlihat; yang tak terlihat = reputasi kepatuhan. Bank dengan rekam telat berulang membayar \u201Cpajak ketidakpercayaan\u201D di setiap pemeriksaan.",
        "Uji kesiapan: jika pemilik laporan cuti mendadak H−5, apakah laporan tetap terkirim H−3? Tidak = single point of failure.",
      ],
      reference: "Teguran → denda → pembatasan → catatan kesehatan. Cegah: kalender + H−3 + backup person.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Rekonsiliasi",
      title: "Bridge: dari angka internal ke angka OJK",
      prose: [
        "Angka internal NPL 3,4% (Rp340 miliar, definisi DPD > 90 hari) vs angka OJK 3,1% (Rp310 miliar, definisi kolektibilitas). Selisih Rp30 miliar = debitur restrukturisasi lancar: menurut definisi internal masih 'bermasalah', menurut OJK tidak. Bridge satu baris: 340 − 30 = 310. Satu baris inilah yang AKAN ditanyakan pemeriksa — lebih baik kamu yang menulisnya duluan.",
        "Struktur bridge yang benar: angka internal ± penyesuaian definisi ± penyesuaian cakupan = angka regulator. Setiap penyesuaian wajib punya tiga hal: nominal, alasan, rujukan ketentuan. Tanpa ketiganya, 'penyesuaian' hanyalah angka ajaib yang menutupi selisih.",
        "Ambang materialitas: selisih tak terjelaskan di atas 0,1 pp (atau Rp10 miliar) → TAHAN, investigasi dulu. Di bawah itu → kirim dengan footnote. Lab membangun pemeriksa bridge: ia menghitung bagian tak terjelaskan dan memberi verdict. Di data contoh, semuanya terjelaskan → KIRIM + footnote definisi yang benar.",
        "Footnote adalah separuh pekerjaan: draf yang salah menulis 'definisi internal' untuk angka OJK — terlihat seperti manipulasi. Yang benar: 'NPL 3,1% per definisi kolektibilitas OJK; selisih 0,3 pp vs internal dijelaskan di lampiran rekonsiliasi.' Regulator tidak menghukum selisih yang dijelaskan — mereka menghukum selisih yang disembunyikan.",
        "Denda OJK nyata: bank yang terlambat menyampaikan laporan berkala didenda Rp100 ribu–Rp1 juta per hari keterlambatan per laporan — kecil, tetapi terakumulasi dan tercatat dalam penilaian GCG. Denda besar datang dari pelanggaran substansi: misreporting modal bisa berujung pembatasan kegiatan usaha.",
        "Siklus pelaporan OJK: harian (likuiditas), mingguan (valas), bulanan (LBU), triwulanan (publikasi), tahunan (audited). Total 200+ jenis laporan per tahun untuk bank umum. Satu tim regulatory reporting (5–10 orang) mengelola kalender ini — terlewat satu = temuan audit.",
        "Prinsip kehati-hatian: OJK memakai pendekatan 'comply or explain'. Angka yang menyimpang dari ketentuan harus dijelaskan tertulis — bukan disembunyikan. Analis yang menemukan selisih Rp30 miliar (seperti lab bridge) dan melaporkannya = melindungi bank; yang menutupinya = melanggar.",
        "Perubahan regulasi: POJK baru terbit 10–20 per tahun. Setiap POJK baru = pemetaan ulang: laporan apa yang berubah, sistem apa yang harus diubah, tenggat kapan. Bank yang reaktif (baru bergerak saat tenggat) selalu terburu-buru; yang proaktif punya tim horizon scanning.",
        "Jembatan ke karir: keahlian regulatory reporting adalah tiket masuk divisi kepatuhan — salah satu fungsi dengan permintaan tertinggi dan PHK terendah di perbankan. Memahami 'bahasa OJK' (definisi resmi tiap pos) membedakanmu dari analis yang hanya bisa Excel.",
        "Biaya kepatuhan: bank menengah menghabiskan Rp20–50 miliar/tahun untuk fungsi kepatuhan (gaji, sistem, audit). Terdengar besar sampai dibandingkan dengan denda + pembatasan usaha akibat pelanggaran — satu kasus misreporting bisa berujung larangan ekspansi kredit yang merugikan ratusan miliar pendapatan.",
        "Regtech: bank besar kini memakai sistem yang memetakan otomatis transaksi ke pos laporan OJK — mengurangi salah pos dari 3% ke 0,2%. Investasi Rp5 miliar untuk sistem ini kembali dalam 2 tahun lewat penghematan denda + tenaga kerja. Analis yang paham regtech = analis masa depan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dijelaskan`, `tak_terjelaskan`, `pp`, dan `verdict`" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Bridge: 340 + (-30) = 310 vs OJK 310\nTak terjelaskan: Rp0 M (0.00 pp) -> KIRIM + footnote",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Angka regulator = angka internal + 'penyesuaian'.” Penyesuaian tanpa nominal + alasan + rujukan ketentuan = angka ajaib. Pemeriksa OJK tidak alergi selisih — mereka alergi selisih yang tidak bisa dijelaskan tertulis.",
      },
      hints: [
        "dijelaskan = jumlah semua penyesuaian.",
        "pp memakai total kredit sebagai penyebut.",
      ],
      code: {
        starter: "# Bridge NPL internal -> OJK (Rp miliar, JANGAN UBAH).\ninternal, regulator = 340.0, 310.0\npenyesuaian = [(\"Restrukturisasi lancar (beda definisi)\", -30.0)]\ntotal_kredit = 10000.0\n\n# TULIS KODEMU: verdict bridge\ndijelaskan =\ntak_terjelaskan =\npp =\nverdict =  # \"KIRIM + footnote\" jika pp <= 0.1 else \"TAHAN, investigasi\"\n\nprint(f\"Bridge: {internal:.0f} + ({dijelaskan:.0f}) = {internal + dijelaskan:.0f} vs OJK {regulator:.0f}\")\nprint(f\"Tak terjelaskan: Rp{tak_terjelaskan:.0f} M ({pp:.2f} pp) -> {verdict}\")",
        lockLines: 4,
        solution: "# Bridge NPL internal -> OJK (Rp miliar, JANGAN UBAH).\ninternal, regulator = 340.0, 310.0\npenyesuaian = [(\"Restrukturisasi lancar (beda definisi)\", -30.0)]\ntotal_kredit = 10000.0\n\n# TULIS KODEMU: verdict bridge\ndijelaskan = sum(p[1] for p in penyesuaian)\ntak_terjelaskan = (internal + dijelaskan) - regulator\npp = abs(tak_terjelaskan) / total_kredit * 100\nverdict = \"KIRIM + footnote\" if pp <= 0.1 else \"TAHAN, investigasi\"\n\nprint(f\"Bridge: {internal:.0f} + ({dijelaskan:.0f}) = {internal + dijelaskan:.0f} vs OJK {regulator:.0f}\")\nprint(f\"Tak terjelaskan: Rp{tak_terjelaskan:.0f} M ({pp:.2f} pp) -> {verdict}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`tak_terjelaskan` = 0.0", msg: "(340 - 30) - 310 = 0.", name: "tak_terjelaskan", value: 0.0, tol: 1e-09 },
          { kind: "stdout_matches", task: "t2", label: "Verdict KIRIM", msg: "Selisih 0 pp ≤ 0,1 pp → kirim.", pattern: "Tak terjelaskan: Rp0 M \\(0\\.00 pp\\) -> KIRIM \\+ footnote" }
        ],
      },
      reference: "Bridge = internal ± penyesuaian (nominal + alasan + rujukan) = regulator.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Saat tenggat terancam",
      prose: [
        "Satu: masih H−7 dan data belum lengkap → eskalasi awal ke pemilik data + siapkan rencana B (data sementara + caveat internal). Dua: H−3 target internal tercapai → kirim, simpan bukti terima. Tiga: H−1 dan belum siap → lapor ke direksi KEPATUHAN sekarang (bukan setelah lewat); siapkan surat pemberitahuan keterlambatan ke regulator — jujur lebih murah dari ketahuan. Empat: sudah lewat → kirim segera + surat penjelasan + catat insiden + perbaiki proses (jangan hanya menyalahkan orang).",
        "Aturan praktis 10 detik: masalah tenggat = masalah komunikasi. Kabari lebih awal = opsi lebih banyak. Diam = opsi menyempit sampai tinggal denda.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "H−1 dan data belum siap → lapor ke direksi kepatuhan SEKARANG. Tetapi 'belum siap' yang profesional selalu ditemani bridge sementara: 'angka internal X, estimasi penyesuaian Y, angka OJK ± Z.' Estimasi ber-bridge > diam tanpa angka.",
      },
      reference: "H−7 eskalasi, H−3 kirim, H−1 lapor direksi, lewat = kirim + surat + perbaiki proses.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Angka internal vs angka OJK",
      prose: [
        "Laporan internal: NPL 3,4% (definisi DPD > 90 hari, Kamus v3.2). Draf laporan OJK: NPL 3,1%. Selisih 0,3 pp. Investigasi: tim memakai definisi kolektibilitas OJK untuk laporan regulator — benar secara prosedur. Tetapi tidak ada rekonsiliasi tertulis yang menjelaskan selisihnya, dan footnote draf masih menyebut \u201Cdefinisi internal\u201D.",
        "Pertanyaan: apa yang harus diperbaiki sebelum kirim? Pembahasan: (1) footnote diganti ke definisi regulator yang benar + rujukan ketentuannya; (2) lampirkan rekonsiliasi satu halaman: 3,4% (internal) → penyesuaian definisi −0,3 pp → 3,1% (OJK); (3) simpan rekonsiliasi sebagai arsip — pemeriksa AKAN bertanya selisih ini. Tanpa ketiganya, laporan \u201Cbenar\u201D pun terlihat mencurigakan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Selisih tanpa penjelasan = temuan audit. Selisih dengan rekonsiliasi = bukti pengendalian yang baik. Usaha yang sama, hasil berlawanan — bedanya dokumentasi.",
      },
      reference: "Selisih definisi wajib direkonsiliasi tertulis + footnote benar + arsip.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang kalender tenggat, definisi regulator, dan konsekuensi keterlambatan.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Setiap laporan regulasi yang kamu kirim harus punya 'kembaran' satu halaman: bridge internal→regulator. Simpan sebagai arsip — pemeriksa AKAN bertanya selisihnya, dan arsip 1 halaman menjawab dalam 5 menit.",
      },

      summary: [
        "Bank lapor ke OJK (berkala, rasio) dan BI (harian likuiditas/valuta); SLIK = data debitur.",
        "Kalender + hitung mundur + flag SEGERA (< 7 hari); target kirim H−3.",
        "Laporan internal ≠ laporan regulator: beda definisi, format, konsekuensi.",
        "Keterlambatan: teguran → denda → pembatasan → catatan kesehatan bank.",
        "Selisih definisi wajib rekonsiliasi tertulis sebelum kirim.",
      ],
      next: { label: "RR11 — Melaporkan Hasil Stress Test", href: "/v2/learn/rr11-stress" },
      reference: "Acuan: POJK 18/POJK.03/2017 (SLIK) · POJK 11/POJK.03/2016 (KPMM) · POJK 42/POJK.03/2015 (LCR) · POJK 50/POJK.03/2017 (NSFR) · POJK 32/POJK.03/2018 (BMPK) · POJK 10/POJK.05/2022 (LPBBTI) · PBI 21/9/PBI/2019 (laporan terintegrasi BI). Teks peraturan: jdih.ojk.go.id dan peraturan.go.id.",
      quiz: [
        {
          q: "Akar masalah keterlambatan 2 hari di cerita pembuka?",
          options: [
            { text: "Tidak tahu tenggatnya", why: "Tenggatnya jelas tertulis — masalahnya kesiapan." },
            { text: "Tanpa buffer, tanpa pemilik tunggal, tanpa backup person", why: "Tepat. Tiga lapis pencegahan semuanya absen.", correct: true },
            { text: "Datanya terlalu sulit", why: "Laporannya selesai — hanya terlambat." },
          ],
        },
        {
          q: "Mengapa target internal H−3, bukan H−0?",
          options: [
            { text: "Agar terlihat rajin", why: "Bukan soal citra." },
            { text: "Buffer untuk gagal upload, revisi, dan hal tak terduga", why: "Benar. Tenggat = tanggal diterima sistem, bukan tanggal mulai mengerjakan.", correct: true },
            { text: "Karena regulator meminta H−3", why: "Regulator meminta tenggatnya; H−3 adalah disiplin internal." },
          ],
        },
        {
          q: "NPL internal 3,4% vs draf OJK 3,1%. Yang wajib dilakukan sebelum kirim?",
          options: [
            { text: "Samakan angkanya agar tidak membingungkan", why: "Memalsukan salah satunya — definisinya memang berbeda." },
            { text: "Rekonsiliasi tertulis + footnote definisi yang benar + arsip", why: "Benar. Selisih yang dijelaskan = bukti pengendalian baik.", correct: true },
            { text: "Kirim saja, nanti dijelaskan jika ditanya", why: "Reaktif = terlihat menyembunyikan; pemeriksa akan bertanya." },
          ],
        },
        {
          q: "SLIK penting karena?",
          options: [
            { text: "Datanya memengaruhi skor kredit nasabah di seluruh industri", why: "Tepat. Salah input = merugikan orang nyata.", correct: true },
            { text: "Dendanya paling besar", why: "Bukan soal denda — soal dampak ke nasabah." },
            { text: "Formatnya paling rumit", why: "Bukan soal kerumitan format." },
          ],
        },
        {
          q: "Tenggat H−1 dan laporan belum siap. Langkah benar?",
          options: [
            { text: "Diam dan berharap selesai tepat waktu", why: "Diam = opsi menyempit sampai tinggal denda." },
            { text: "Lapor ke direksi kepatuhan sekarang, siapkan pemberitahuan jujur", why: "Benar. Jujur lebih awal = opsi lebih banyak, sanksi lebih ringan.", correct: true },
            { text: "Kirim data seadanya tanpa penjelasan", why: "Data salah ke regulator = pelanggaran yang lebih serius." },
          ],
        },
      ],
    },
  ],
};
