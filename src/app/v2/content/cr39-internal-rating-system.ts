import type { V2Lesson } from "../lib/types";

const FIG_IRS = `<svg viewBox="0 0 520 300" role="img" aria-label="Master scale grade A sampai E dan perbandingan PD kalibrasi vs teramati.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Master scale: skor menjadi grade menjadi PD</text>
<text x="10" y="52" font-size="11" fill="var(--chart-text)">A (80+)</text>
<rect x="110" y="40" width="300" height="20" fill="#46a758" opacity="0.85"/>
<text x="416" y="55" font-size="11" fill="var(--chart-text)">PD 0,5%</text>
<text x="10" y="80" font-size="11" fill="var(--chart-text)">B (65-79)</text>
<rect x="110" y="68" width="300" height="20" fill="#8ecae6" opacity="0.85"/>
<text x="416" y="83" font-size="11" fill="var(--chart-text)">PD 1,5%</text>
<text x="10" y="108" font-size="11" fill="var(--chart-text)">C (50-64)</text>
<rect x="110" y="96" width="300" height="20" fill="#f5a524" opacity="0.85"/>
<text x="416" y="111" font-size="11" fill="var(--chart-text)">PD 4%</text>
<text x="10" y="136" font-size="11" fill="var(--chart-text)">D (35-49)</text>
<rect x="110" y="124" width="300" height="20" fill="#ef8354" opacity="0.85"/>
<text x="416" y="139" font-size="11" fill="var(--chart-text)">PD 10%</text>
<text x="10" y="164" font-size="11" fill="var(--chart-text)">E (&lt;35)</text>
<rect x="110" y="152" width="300" height="20" fill="#e5484d" opacity="0.85"/>
<text x="416" y="167" font-size="11" fill="var(--chart-text)">PD 25%</text>
<text x="10" y="200" font-size="13" fill="var(--chart-text)" font-weight="bold">Kalibrasi vs teramati (validasi tahunan)</text>
<text x="10" y="224" font-size="10" fill="var(--chart-text)" opacity="0.7">Batang gelap = PD kalibrasi; batang terang = PD teramati.</text>
<rect x="60" y="238" width="8" height="30" fill="var(--chart-text)" opacity="0.9"/>
<rect x="72" y="238" width="8" height="30" fill="var(--chart-text)" opacity="0.35"/>
<text x="58" y="286" font-size="10" fill="var(--chart-text)">A</text>
<rect x="150" y="238" width="16" height="30" fill="var(--chart-text)" opacity="0.9"/>
<rect x="170" y="238" width="16" height="30" fill="var(--chart-text)" opacity="0.35"/>
<text x="156" y="286" font-size="10" fill="var(--chart-text)">B</text>
<rect x="248" y="252" width="24" height="16" fill="var(--chart-text)" opacity="0.9"/>
<rect x="276" y="168" width="24" height="100" fill="#e5484d" opacity="0.9"/>
<text x="254" y="286" font-size="10" fill="var(--chart-text)">C</text>
<rect x="346" y="218" width="20" height="50" fill="var(--chart-text)" opacity="0.9"/>
<rect x="370" y="238" width="20" height="30" fill="var(--chart-text)" opacity="0.35"/>
<text x="352" y="286" font-size="10" fill="var(--chart-text)">D</text>
<rect x="444" y="168" width="20" height="100" fill="var(--chart-text)" opacity="0.9"/>
<rect x="468" y="168" width="20" height="100" fill="var(--chart-text)" opacity="0.35"/>
<text x="450" y="286" font-size="10" fill="var(--chart-text)">E</text>
</g>
</svg>`;

export const cr39: V2Lesson = {
  slug: "cr39-internal-rating-system",
  track: "Credit Risk",
  module: "Model & Rating",
  title: "CR39 — Internal Rating System: Arsitektur & Kalibrasi",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tangga yang miring",
      prose: [
        "Validasi tahunan Internal Rating System Bank Nusantara. Tim model risk membuka hasil backtest: grade A sampai E, semua grade cocok dengan PD kalibrasinya — kecuali satu. Grade C: 6 debitur, 3 gagal bayar. PD teramati 50% melawan PD kalibrasi 4%. Selama setahun, seluruh kredit grade C diberi harga dengan asumsi risiko 4% — bank menjual proteksi Rp1 miliar dengan premi risiko Rp40 juta, padahal kerugiannya Rp500 juta.",
        "Dugaan pertama: scorecard-nya rusak. Tim mengaudit ulang modelnya — koefisien stabil, validasi silang lolos, tidak ada yang berubah sejak peluncuran. Modelnya sehat.",
        "Twist-nya: yang berubah adalah makanannya. Delapan bulan lalu vendor data mengubah kode status pekerjaan tanpa pemberitahuan — 'kontrak' yang dulu berarti pegawai tetap kini mencakup pekerja lepas. Fitur 'lama bekerja', tulang punggung scorecard, salah membaca separuh debitur grade C. Modelnya tidak basi — datanya yang basi. Dan tidak ada alarm yang berbunyi, karena validasi hanya dijadwalkan setahun sekali.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan arsitektur IRS — skor, grade, master scale, PD; (2) membedakan TTC vs PIT dan kapan memakai masing-masing; (3) menghitung PD teramati per grade dan mendeteksi drift kalibrasi; (4) menjelaskan tata kelola override dan hubungan IRS dengan Basel IRB. Prasyarat ringkas: PD = probability of default, peluang gagal bayar 1 tahun; scorecard mengubah karakteristik debitur menjadi skor.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "IRS yang miring tidak sekadar salah hitung — ia salah harga. Setiap kredit grade C yang disetujui tahun itu membawa kerugian ekspektasian 12 kali lipat dari yang dianggarkan. Model risk bukan fungsi administratif; ia penjaga kasir bank.",
      },
      reference: "IRS: skor → grade → PD. Kalibrasi bisa basi tanpa validasi rutin.",
    },
    {
      id: "grade-master-scale",
      eyebrow: "Langkah 2 · Konsep",
      title: "Grade dan master scale: si tangga",
      prose: [
        "Internal Rating System mengubah skor kontinu (mis. 0–100) menjadi grade ordinal (A–E) melalui master scale: tabel batas skor per grade. Skor 72 jatuh ke grade B; grade B memetakan ke PD 1,5%. Tiga lapis ini — skor, grade, PD — memisahkan tiga pertanyaan berbeda: 'seberapa bagus debitur ini?' (skor), 'kelompok mana ia?' (grade), 'berapa peluang ia gagal bayar?' (PD).",
        "Kepribadiannya: master scale adalah 'si tangga' di gedung bank. Setiap analis, di cabang mana pun, menaiki tangga yang sama — debitur dengan skor 72 adalah grade B di Jakarta maupun di Makassar, tahun ini maupun tahun depan. Tanpa tangga bersama, analis senior memberi 'B' untuk kasus yang analis junior beri 'C', dan portofolio menjadi menara Babel peringkat.",
        "Grade bersifat ordinal (A lebih baik dari B) sedangkan PD bersifat kardinal (B = 1,5% peluang gagal bayar). Perbedaan ini penting: dua grade yang berurutan belum tentu berjarak sama risikonya — lompatan PD dari D (10%) ke E (25%) jauh lebih curam daripada dari A (0,5%) ke B (1,5%). Pricing dan modal harus memakai PD-nya, bukan 'jarak hurufnya'.",
        "Master scale juga alat komunikasi: direksi tidak perlu paham 40 variabel scorecard — cukup tahu 'eksposur grade D–E naik 8% kuartal ini'. Grade menerjemahkan statistik menjadi bahasa bisnis.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: grade menstabilkan, skor mengurutkan",
        body: "Skor yang sedikit berubah (71 vs 73) tidak mengubah grade — dan itu disengaja. Grade menyerap noise kecil agar keputusan tidak bergoyang tiap ada pembaruan data minor. Stabilitas peringkat sama pentingnya dengan ketajamannya: komite tidak bisa bekerja dengan peringkat yang berubah tiap minggu.",
      },
      hints: [
        "Skor = kontinu. Grade = ordinal. PD = kardinal.",
        "Pricing memakai PD, bukan huruf grade.",
      ],
      reference: "Skor → grade (master scale) → PD. Satu tangga untuk semua analis.",
    },
    {
      id: "ttc-pit-kalibrasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "TTC vs PIT dan kalibrasi PD",
      prose: [
        "PD kalibrasi per grade dihitung dari sejarah: jumlah debitur grade g yang gagal bayar dibagi total debitur grade g pada awal periode. Itu PD teramati — realisasi satu periode. Pertanyaannya: apakah angka itu yang dipakai untuk tahun depan?",
        "Di sinilah beda TTC dan PIT. TTC (Through-The-Cycle) merata-ratakan PD sepanjang satu siklus ekonomi penuh — stabil, tidak panik saat resesi, tidak euforia saat boom. PIT (Point-In-Time) memakai kondisi terkini — responsif, naik saat ekonomi memburuk. Keduanya benar untuk tujuan berbeda: TTC untuk kecukupan modal (regulator ingin bank tidak kekurangan modal tepat saat krisis), PIT untuk pricing dan CKPN berjalan (harga harus mencerminkan risiko hari ini).",
        "Rumus fondasinya:",
      ],
      formula: String.raw`\text{PD}_g = \frac{D_g}{N_g}, \qquad \text{PD}^{\text{TTC}}_g = \frac{1}{T}\sum_{t=1}^{T}\text{PD}_{g,t}`,
      formulaNote: "D_g = debitur grade g yang gagal bayar dalam setahun; N_g = total debitur grade g di awal tahun; T = jumlah tahun dalam satu siklus. Contoh grade C lesson ini: D=3, N=6 → PD teramati 50% melawan kalibrasi 4%. Interpretasi: selisih sebesar ini bukan noise — ia sinyal drift yang wajib diinvestigasi.",
      tasks: [],
      note: {
        title: "🚨 Mitos: PD PIT selalu lebih baik karena lebih update",
        type: "pitfall",
        body: "Mitos: 'PIT mengikuti kondisi terkini, jadi selalu lebih akurat.' Yang benar: PIT yang dipakai untuk modal membuat bank pro-siklikal — modal terkuras tepat saat krisis (ketika PD PIT melonjak), memaksa bank mengerem kredit di saat ekonomi butuh kredit. Itulah kenapa Basel memakai TTC untuk modal: stabilitas sistem lebih penting dari ketepatan sesaat.",
      },
      reference: "TTC = modal (stabil). PIT = pricing & CKPN (responsif).",
    },
    {
      id: "override-governance-irb",
      eyebrow: "Langkah 4 · Konsep",
      title: "Override, tata kelola, dan jalan ke Basel IRB",
      prose: [
        "Model tidak mengenal debitur yang menangis di ruang analis. Override adalah penyesuaian grade oleh analis berdasar informasi kualitatif (mis. pemilik perusahaan sakit keras, atau justru kontrak besar baru). Override legal dan penting — tetapi harus tercatat (siapa, kapan, alasan), terbatas (mis. di bawah 10% keputusan), dan dimonitor arahnya: override yang 90%-nya menaikkan grade adalah sinyal analis tidak percaya model — atau lebih buruk, dipengaruhi target bisnis.",
        "Tata kelola IRS punya tiga pilar: pengembangan (tim model membangun dan mendokumentasikan), validasi independen (tim berbeda menguji — seperti audit grade C di cerita), dan pemantauan berkelanjutan (backtest berkala, bukan tahunan saja). Kasus Bank Nusantara lolos dari pilar ketiga: drift 8 bulan tidak terdeteksi karena validasi hanya tahunan.",
        "Ujung jalan IRS adalah Basel IRB (Internal Ratings-Based): bank boleh memakai PD, LGD, EAD internalnya untuk menghitung kebutuhan modal — dengan syarat regulator menyetujui sistem ratingnya. IRS yang rapi adalah tiket masuk IRB; IRS yang miring berarti modal yang salah hitung, dan itu urusan regulator.",
        "Cara membaca figur: panel atas = master scale, lima grade dengan PD kalibrasinya — tangga yang dipakai semua analis. Panel bawah = hasil validasi: batang gelap PD kalibrasi vs batang terang PD teramati. Interpretasi: grade C batang terangnya menjulang (50% vs 4%) — satu-satunya grade yang MELESET; grade E cocok sempurna (25% vs 25%) — kalibrasinya sehat.",
      ],
      figure: {
        svg: FIG_IRS,
        alt: "Master scale grade A sampai E dengan PD 0,5% hingga 25%; grafik kalibrasi menunjukkan grade C meleset (teramati 50% vs kalibrasi 4%).",
        caption: "Satu grade meleset (C: 50% vs 4%). Empat lainnya sehat — drift-nya lokal, bukan sistemik.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: override = analis lebih pintar dari model",
        type: "pitfall",
        body: "Mitos: 'Analis senior boleh override kapan saja, pengalamannya lebih tajam.' Yang benar: override yang tidak tercatat dan tidak dimonitor adalah lubang governance — ia bisa menyembunyikan tekanan bisnis ('naikkan grade-nya, target kuartal belum tercapai'). Override sehat = pengecualian yang didokumentasikan, bukan kebiasaan.",
      },
      reference: "Override: tercatat, <10%, dimonitor arahnya. IRS rapi = tiket Basel IRB.",
    },
    {
      id: "jebakan-irs",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tiga jebakan kalibrasi",
      prose: [
        "Jebakan 1 — Grade inflation: perlahan-lahan semakin banyak debitur 'naik grade' tanpa perbaikan risiko yang nyata — karena analis menghindari paperwork grade rendah, atau karena batas master scale digeser diam-diam. Tandanya: distribusi grade bergeser ke atas sementara PD teramati per grade ikut naik. Grade-nya membaik, risikonya tidak.",
        "Jebakan 2 — Kalibrasi dari histori pendek: PD dihitung dari 2 tahun terakhir yang kebetulan boom ekonomi. Saat resesi datang, PD teramati meledak 3–5 kali lipat dan bank kekurangan modal. Penangkalnya: histori harus mencakup satu siklus penuh, termasuk masa sulit — atau beri margin konservatisme yang eksplisit.",
        "Jebakan 3 — Validasi tahunan untuk dunia yang berubah bulanan: kasus Bank Nusantara. Data vendor, definisi lapangan, perilaku debitur — semuanya bisa berubah tanpa pemberitahuan. Penangkalnya: pemantauan KPI input (distribusi fitur, missing rate) tiap bulan, bukan hanya backtest PD tiap tahun.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: kalibrasi adalah janji, validasi adalah penagihan",
        body: "Kalibrasi berkata 'grade C = 4%'. Validasi menagih janji itu dengan data nyata. Bank yang hanya mengkalibrasi tanpa memvalidasi seperti memberi janji tanpa pernah ditagih — cepat atau lambat tagihannya datang dalam bentuk kerugian.",
      },
      reference: "3 jebakan: grade inflation, histori pendek, validasi jarang.",
    },
    {
      id: "lab-irs",
      eyebrow: "Langkah 6 · Lab",
      title: "Audit kalibrasi: temukan grade yang miring",
      prose: [
        "Data 24 debitur (skor + status gagal bayar) dan master scale sudah tersedia. Tugasmu: petakan tiap debitur ke grade via fungsi grade_of, hitung PD teramati per grade, lalu tandai grade yang MELESET — teramati lebih dari 3 kali PD kalibrasi dengan minimal 3 debitur. Ini replika mini dari validasi tahunan yang menemukan tangga miring Bank Nusantara.",
        "Eksplorasi: setelah lolos, ubah status debitur (60,1) menjadi (60,0) — apakah grade C masih meleset? Lalu ubah ambang flag dari 3x menjadi 2x — grade apa lagi yang ikut meleset? Rasakan sensitivitas aturan validasi: terlalu longgar = drift lolos; terlalu ketat = alarm palsu tiap kuartal.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `grade_of` dan isi list `grades` via master scale" },
        { id: "t2", text: "Hitung dict `pd_obs` berisi PD teramati per grade" },
        { id: "t3", text: "Isi list `meleset` dan cetak laporan validasi" },
      ],
      expected: "Grade A: n=4 teramati  0.0% vs kalibrasi  0.5% -> ok\nGrade B: n=6 teramati  0.0% vs kalibrasi  1.5% -> ok\nGrade C: n=6 teramati 50.0% vs kalibrasi  4.0% -> MELESET\nGrade D: n=4 teramati  0.0% vs kalibrasi 10.0% -> ok\nGrade E: n=4 teramati 25.0% vs kalibrasi 25.0% -> ok",
      code: {
        starter: "# Data JANGAN UBAH.\nMASTER = [\n    (\"A\", 80, 0.005),\n    (\"B\", 65, 0.015),\n    (\"C\", 50, 0.040),\n    (\"D\", 35, 0.100),\n    (\"E\", 0, 0.250),\n]\ndata = [\n    (88,0),(85,0),(82,0),(81,0),\n    (76,0),(72,0),(70,0),(68,0),(66,0),(65,0),\n    (62,0),(60,1),(58,0),(55,1),(52,0),(50,1),\n    (45,0),(42,0),(40,0),(36,0),\n    (30,1),(28,0),(24,0),(20,0),\n]\n\n# TULIS KODEMU: t1 petakan skor ke grade\ndef grade_of(skor):\n    pass\n\ngrades = []\n\n# t2: PD teramati per grade\npd_obs = {}\n\n# t3: grade yang meleset, lalu cetak laporan\nmeleset = []\n\nfor g, batas, pd_kal in MASTER:\n    pass\n",
        lockLines: 18,
        solution: "# Data JANGAN UBAH.\nMASTER = [\n    (\"A\", 80, 0.005),\n    (\"B\", 65, 0.015),\n    (\"C\", 50, 0.040),\n    (\"D\", 35, 0.100),\n    (\"E\", 0, 0.250),\n]\ndata = [\n    (88,0),(85,0),(82,0),(81,0),\n    (76,0),(72,0),(70,0),(68,0),(66,0),(65,0),\n    (62,0),(60,1),(58,0),(55,1),(52,0),(50,1),\n    (45,0),(42,0),(40,0),(36,0),\n    (30,1),(28,0),(24,0),(20,0),\n]\n\n# TULIS KODEMU: t1 petakan skor ke grade\ndef grade_of(skor):\n    for g, batas, pd in MASTER:\n        if skor >= batas:\n            return g\n    return \"E\"\n\ngrades = [grade_of(s) for s, d in data]\n\n# t2: PD teramati per grade\npd_obs = {}\nfor g, batas, pd_kal in MASTER:\n    idx = [i for i, gr in enumerate(grades) if gr == g]\n    n = len(idx)\n    gagal = sum(data[i][1] for i in idx)\n    pd_obs[g] = round(gagal/n, 3) if n else 0.0\n\npd_c = pd_obs[\"C\"]\npd_e = pd_obs[\"E\"]\n\n# t3: grade yang meleset, lalu cetak laporan\nmeleset = []\nfor g, batas, pd_kal in MASTER:\n    n = sum(1 for gr in grades if gr == g)\n    if n >= 3 and pd_obs[g] > 3*pd_kal:\n        meleset.append(g)\n\nfor g, batas, pd_kal in MASTER:\n    n = sum(1 for gr in grades if gr == g)\n    status = \"MELESET\" if g in meleset else \"ok\"\n    print(f\"Grade {g}: n={n} teramati {pd_obs[g]*100:4.1f}% vs kalibrasi {pd_kal*100:4.1f}% -> {status}\")\n",
        checks: [
          { kind: "equal", task: "t2", label: "PD teramati grade C = 50%", msg: "3 gagal dari 6 debitur grade C.", name: "pd_c", value: 0.5, tol: 0.001 },
          { kind: "equal", task: "t2", label: "PD teramati grade E = 25%", msg: "1 gagal dari 4 debitur grade E — kalibrasi sehat.", name: "pd_e", value: 0.25, tol: 0.001 },
          { kind: "contains", task: "t3", label: "meleset memuat grade C", msg: "50% > 3 x 4% = 12%.", name: "meleset", value: "C" },
          { kind: "stdout_matches", task: "t3", label: "laporan mencetak MELESET", msg: "Grade C ditandai dalam laporan.", pattern: "Grade C.*MELESET" },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Merawat IRS: empat skenario",
      prose: [
        "Skenario 1 — Satu grade meleset, grade lain sehat (kasus Bank Nusantara): drift lokal. Bekukan approval baru di grade itu sementara, investigasi penyebab (perubahan data? pergeseran segmen?), jangan recalibrate buta — recalibrate tanpa tahu penyebab hanya mengubur masalah.",
        "Skenario 2 — Semua grade meleset ke arah yang sama: masalah sistemik. Curigai perubahan definisi default, perubahan populasi, atau guncangan ekonomi. Di sini TTC vs PIT dipertanyakan — mungkin saatnya overlay penyesuaian siklus, bukan menyalahkan model.",
        "Skenario 3 — PD teramati di bawah kalibrasi di semua grade (model terlalu konservatif): bank kehilangan bisnis — pricing kemahalan, nasabah baik pindah ke kompetitor. Kalibrasi ulang ke bawah juga keputusan risiko: pastikan bukan karena histori yang terlalu pendek.",
        "Skenario 4 — Override rate di atas 10% dan searah: model tidak dipercaya atau ditekan bisnis. Audit override satu per satu; bila analis benar, modelnya yang perlu diperbaiki; bila analis tertekan target, governance-nya yang perlu diperbaiki.",
        "Aturan praktis 10 detik: satu grade = investigasi lokal + bekukan sementara; semua grade = masalah sistemik; terlalu konservatif = cek peluang hilang; override tinggi = audit governance.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: validasi menjawab 'apakah janji ditepati', bukan 'apakah model bagus'",
        body: "Model dengan AUC tinggi pun bisa meleset kalibrasinya — ia mengurutkan dengan benar tetapi salah menilai level. Validasi kalibrasi dan validasi daya beda adalah dua ujian berbeda; lulus satu tidak berarti lulus yang lain.",
      },
      reference: "Lokal = investigasi. Sistemik = overlay. Konservatif = cek bisnis hilang.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tiga dari enam: sinyal atau noise?",
      prose: [
        "Hasil validasi: grade C, n=6, 3 gagal bayar (50%) vs kalibrasi 4%. Kepala analis berkata: 'Sampel cuma 6 — ini noise, jangan panik.' Ia benar bahwa n=6 kecil. Tetapi hitung ekspektasinya: dengan PD 4%, dari 6 debitur ekspektasi gagal bayar = 0,24 — kurang dari satu orang. Mengamati 3 adalah 12 kali lipat ekspektasi. Probabilitas melihat 3+ gagal dari 6 bila PD benar 4% adalah di bawah 0,1% — nyaris mustahil sebagai kebetulan.",
        "Pembahasan: (1) Sampel kecil bukan alasan mengabaikan sinyal ekstrem — justru sinyal ekstrem pada sampel kecil menuntut investigasi karena biaya salahnya besar. (2) Keputusan: bekukan sementara approval grade C baru (bukan tolak — bekukan), bentuk tim investigasi 2 minggu: cek perubahan data vendor, pergeseran komposisi segmen, dan backtest per kohor. (3) Pelajaran: validasi bukan soal 'cukup sampel untuk jurnal' — ini soal 'cukup bukti untuk bertindak'. Dalam risk management, menunggu n=1000 sebelum bertindak adalah kemewahan yang dibayar dengan kerugian.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank yang menunggu 'signifikansi statistik textbook' sebelum bertindak akan selalu terlambat — karena pada saat sampel cukup besar, kerugiannya juga sudah cukup besar. Prinsip kehati-hatian membenarkan tindakan proporsional atas sinyal kuat meski sampel kecil: bekukan sementara itu murah, recalibrate buta itu mahal.",
      },
      reference: "3 dari 6 pada ekspektasi 0,24 = sinyal, bukan noise. Bekukan, investigasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — IRS adalah janji yang harus ditagih.",
      ],
      tasks: [],
      summary: [
        "IRS: skor → grade (master scale) → PD. Grade ordinal, PD kardinal.",
        "PD teramati = gagal bayar / total debitur grade; TTC untuk modal, PIT untuk pricing & CKPN.",
        "Drift = teramati jauh dari kalibrasi → investigasi dulu, recalibrate kemudian.",
        "Override: tercatat, <10%, dimonitor arahnya.",
        "IRS yang rapi = fondasi Basel IRB; IRS miring = modal salah hitung.",
      ],
      next: { label: "CR40 — Loan Structuring: Merancang Fasilitas yang Selamat", href: "/v2/learn/cr40-loan-structuring" },
      quiz: [
        {
          q: "Grade C: PD teramati 50% vs kalibrasi 4%, n=6. Respons pertama yang benar…",
          options: [
            { text: "Recalibrate PD grade C menjadi 50%", why: "Salah: recalibrate tanpa tahu penyebab mengubur masalah — mungkin datanya yang basi.", },
            { text: "Investigasi penyebab drift sambil bekukan sementara approval grade C baru", why: "Benar: sinyal ekstrem menuntut investigasi; pembekuan sementara itu murah, kerugian lanjutan itu mahal.", correct: true },
            { text: "Abaikan — sampel cuma 6, itu noise", why: "Salah: 3 gagal vs ekspektasi 0,24 hampir mustahil sebagai kebetulan.", },
            { text: "Hapus grade C dari master scale", why: "Salah: menghapus grade tidak memperbaiki akar masalah.", },
          ],
        },
        {
          q: "Bank akan memberi harga kredit baru yang dicairkan bulan depan. PD yang tepat dipakai…",
          options: [
            { text: "PD TTC — karena stabil", why: "Salah: TTC untuk modal; harga harus mencerminkan risiko saat ini.", },
            { text: "PD PIT — karena mencerminkan kondisi terkini", why: "Benar: pricing dan CKPN memakai PIT; modal memakai TTC.", correct: true },
            { text: "Rata-rata TTC dan PIT", why: "Salah: mencampur dua tujuan berbeda menghasilkan angka yang tidak cocok untuk keduanya.", },
            { text: "PD teramati tahun lalu", why: "Salah: itu realisasi historis satu periode, bukan estimasi ke depan.", },
          ],
        },
        {
          q: "Override analis mencapai 40% dari keputusan dan 90%-nya menaikkan grade. Artinya…",
          options: [
            { text: "Analis bekerja dengan baik", why: "Salah: override searah dan masif = pola, bukan pengecualian.", },
            { text: "Governance bermasalah — audit override dan modelnya", why: "Benar: bisa jadi model tak dipercaya atau analis tertekan target; keduanya harus diinvestigasi.", correct: true },
            { text: "Model sudah tidak dibutuhkan", why: "Salah: solusinya perbaiki model/governance, bukan buang model.", },
            { text: "Naikkan ambang override menjadi 50%", why: "Salah: melegalkan masalah bukan menyelesaikannya.", },
          ],
        },
        {
          q: "Fungsi utama master scale dalam IRS…",
          options: [
            { text: "Menghitung bunga kredit", why: "Salah: bunga dihitung dari PD + biaya + margin, bukan dari tabel batas.", },
            { text: "Menjamin konsistensi peringkat antar-analis, cabang, dan waktu", why: "Benar: satu tangga untuk semua — tanpa ini peringkat menjadi menara Babel.", correct: true },
            { text: "Menggantikan kebutuhan validasi", why: "Salah: konsistensi peringkat tidak menjamin kalibrasi benar.", },
            { text: "Menentukan limit kredit", why: "Salah: limit ditentukan dari analisis kebutuhan dan kemampuan, bukan dari tabel grade.", },
          ],
        },
        {
          q: "PD dikalibrasi dari histori 2 tahun yang kebetulan boom ekonomi. Risikonya…",
          options: [
            { text: "Tidak ada — data terbaru selalu terbaik", why: "Salah: histori pendek yang bias boom meremehkan risiko resesi.", },
            { text: "PD underestimate saat resesi → kekurangan modal", why: "Benar: kalibrasi butuh satu siklus penuh termasuk masa sulit.", correct: true },
            { text: "PD overestimate — bank terlalu konservatif", why: "Salah: boom membuat default rendah → PD kalibrasi rendah, bukan tinggi.", },
            { text: "Tidak berpengaruh ke pricing", why: "Salah: PD kalibrasi dipakai langsung di pricing.", },
          ],
        },
      ],
    },
  ],
};
