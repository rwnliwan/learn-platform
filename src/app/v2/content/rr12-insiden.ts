import type { V2Lesson } from "../lib/types";

// Timeline insiden: 4 kejadian dari 09:12 sampai 11:30.
const FIG_TL = `<svg viewBox=\"0 0 480 260\" role=\"img\" aria-label=\"Timeline insiden dari jam 09:12 sampai 11:30 dengan empat tonggak.\">
<line x1=\"40\" y1=\"130\" x2=\"440\" y2=\"130\" stroke=\"var(--chart-grid)\" stroke-width=\"2\"/>
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<g>
<circle cx=\"80\" cy=\"130\" r=\"9\" fill=\"var(--c4)\"/>
<text x=\"80\" y=\"100\" font-size=\"12\" font-weight=\"600\" fill=\"var(--c4)\">09:12</text>
<text x=\"80\" y=\"160\" font-size=\"11\" fill=\"var(--chart-text)\">insiden mulai</text>
<text x=\"80\" y=\"176\" font-size=\"11\" fill=\"var(--text-muted)\">draf terkirim</text>
</g>
<g>
<circle cx=\"200\" cy=\"130\" r=\"9\" fill=\"var(--c2)\"/>
<text x=\"200\" y=\"100\" font-size=\"12\" font-weight=\"600\" fill=\"var(--c2)\">09:47</text>
<text x=\"200\" y=\"160\" font-size=\"11\" fill=\"var(--chart-text)\">terdeteksi</text>
<text x=\"200\" y=\"176\" font-size=\"11\" fill=\"var(--text-muted)\">TTD 35 mnt</text>
</g>
<g>
<circle cx=\"300\" cy=\"130\" r=\"9\" fill=\"var(--c1)\"/>
<text x=\"300\" y=\"100\" font-size=\"12\" font-weight=\"600\" fill=\"var(--c1)\">10:05</text>
<text x=\"300\" y=\"160\" font-size=\"11\" fill=\"var(--chart-text)\">eskalasi</text>
<text x=\"300\" y=\"176\" font-size=\"11\" fill=\"var(--text-muted)\">direksi tahu</text>
</g>
<g>
<circle cx=\"420\" cy=\"130\" r=\"9\" fill=\"var(--c3)\"/>
<text x=\"420\" y=\"100\" font-size=\"12\" font-weight=\"600\" fill=\"var(--c3)\">11:30</text>
<text x=\"420\" y=\"160\" font-size=\"11\" fill=\"var(--chart-text)\">resolved</text>
<text x=\"420\" y=\"176\" font-size=\"11\" fill=\"var(--text-muted)\">TTR 138 mnt</text>
</g>
</g>
<text x=\"240\" y=\"220\" font-size=\"12\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">Timeline jujur = fondasi laporan insiden. Tanpa waktu, tidak ada pembelajaran.</text>
</svg>`;

export const rr12: V2Lesson = {
  slug: "rr12-insiden",
  track: "Risk Reporting",
  module: "Operasi & Regulasi",
  title: "RR12 — Pelaporan Insiden & Near-Miss",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Email yang salah alamat",
      prose: [
        "Jumat sore, laporan draft NPL — dengan angka yang belum direkonsiliasi — terkirim ke alamat email regulator, bukan ke reviewer internal. Satu huruf beda di autocomplete. Senin pagi kepanikan: tim menyusun timeline dari memori (yang saling bertentangan), mencari \u201Csiapa yang salah\u201D, dan nyaris mengirim surat klarifikasi yang isinya tebakan.",
        "Twist-nya: yang menyelamatkan bukan orang paling senior — melainkan log email server dan satu analis junior yang mencatat kronologi di chat tim Jumat sore (\u201C17:42: email terkirim ke alamat X, saya telepon penerima 17:50\u201D). Fakta mengalahkan memori. Laporan insiden final: timeline presisi menit, akar masalah (tidak ada daftar alamat terkunci untuk email eksternal), dan 3 tindak lanjut bernama. Tidak ada nama yang disalahkan — dan justru karena itu, semua orang jujur.",
        "Setelah lesson ini kamu bisa: (1) menyusun timeline insiden; (2) menghitung TTD dan TTR; (3) menulis laporan blameless dengan tindak lanjut.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Insiden yang dilaporkan dengan jujur = pelajaran organisasi. Insiden yang ditutupi karena takut disalahkan = bom yang akan meledak lagi — biasanya lebih besar. Budaya pelaporan = pengendalian risiko.",
      },
      reference: "Fakta (log) > memori. Blameless = jujur = belajar.",
    },
    {
      id: "anatomi-insiden",
      eyebrow: "Langkah 2 · Anatomi",
      title: "5W1H, timeline, 5 whys",
      prose: [
        "Laporan insiden yang baik punya 4 bagian: (1) Ringkasan 5W1H — apa, kapan, di mana, siapa terdampak, kenapa penting, bagaimana terjadi — dalam 5 kalimat. (2) Timeline presisi — urutan kejadian dengan waktu, dari log/bukti, bukan memori. (3) Root cause via 5 whys — tanya \u201Ckenapa\u201D 5x sampai ke penyebab sistemik, bukan orang. (4) Tindak lanjut — tiap temuan: aksi + pemilik bernama + tenggat.",
        "Contoh 5 whys kasus email: Kenapa terkirim ke regulator? → autocomplete salah alamat. Kenapa bisa salah? → tidak ada daftar alamat terkunci. Kenapa tidak ada? → tidak pernah dianggap risiko. Kenapa? → prosedur email eksternal tidak ada. Akar masalah: prosedur, bukan orang. Tindak lanjut: kunci daftar alamat + wajib konfirmasi untuk email eksternal (pemilik: IT, tenggat 2 minggu).",
      ],
      formula: String.raw`\text{TTD} = t_{\text{deteksi}} - t_{\text{mulai}} \qquad \text{TTR} = t_{\text{resolved}} - t_{\text{mulai}}`,
      formulaNote: "TTD = time-to-detect (menit), TTR = time-to-resolve. Contoh: mulai 09:12, terdeteksi 09:47 → TTD 35 menit; resolved 11:30 → TTR 138 menit. Interpretasi: TTD mengukur monitoring; TTR mengukur respons. Keduanya harus turun dari insiden ke insiden.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CLaporan insiden = mencari siapa yang salah.\u201D Blame menghasilkan satu hal: kebohongan. Orang yang takut disalahkan menutupi, memori \u201Cmenyesuaikan\u201D, dan akar masalah sistemik tidak pernah diperbaiki. Blameless bukan berarti tanpa akuntabilitas — akuntabilitasnya ada di TINDAK LANJUT, bukan di hukuman.",
      },
      hints: [
        "Intuisi: ganti pertanyaan \u201Csiapa yang salah?\u201D menjadi \u201Csistem apa yang memungkinkan ini terjadi?\u201D — jawaban kedua selalu lebih berguna.",
        "Timeline dari memori = fiksi. Selalu tarik dari log: email server, chat, sistem monitoring.",
      ],
      reference: "5W1H → timeline dari log → 5 whys → tindak lanjut bernama.",
    },
    {
      id: "lab-timeline",
      eyebrow: "Langkah 3 · Lab",
      title: "Susun timeline, hitung TTD & TTR",
      prose: [
        "Empat catatan kejadian datang tak berurutan (seperti biasa di insiden nyata). Tugas: urutkan kronologis, cetak timeline-nya, lalu hitung TTD (mulai → deteksi) dan TTR (mulai → resolved) dalam menit.",
        "Hasil: TTD 35 menit, TTR 138 menit. Sekarang nilai: TTD 35 menit untuk email salah alamat = lambat (seharusnya ada konfirmasi pengiriman). Tindak lanjut yang lahir dari angka ini: wajib preview + konfirmasi untuk email eksternal. Angka tanpa tindak lanjut = statistik pajangan.",
      ],
      tasks: [
        { id: "t1", text: "Urutkan `ev` kronologis dan cetak timeline" },
        { id: "t2", text: "Hitung `ttd` dan `ttr` dalam menit" },
      ],
      expected: "09:12 insiden mulai\n09:47 terdeteksi\n10:05 eskalasi ke direksi\n11:30 resolved\nTTD=35 mnt TTR=138 mnt",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CNear-miss tidak perlu dilaporkan — kan tidak terjadi apa-apa.\u201D Near-miss = insiden yang beruntung. Email nyaris terkirim ke regulator (tetapi dibatalkan) = gratis pelajaran tanpa biaya. Organisasi yang hanya belajar dari insiden nyata membayar mahal untuk setiap pelajaran.",
      },
      hints: [
        "Urutkan dengan ev.sort(key=...) memakai datetime.strptime(w, \"%H:%M\").",
        "Selisih datetime → .seconds // 60 untuk menit.",
        "ttd = terdeteksi − mulai; ttr = resolved − mulai.",
      ],
      code: {
        starter: `# Catatan kejadian tak berurutan. JANGAN UBAH baris ini.\nfrom datetime import datetime as dt\nev = [("11:30", "resolved"), ("09:12", "insiden mulai"),\n      ("10:05", "eskalasi ke direksi"), ("09:47", "terdeteksi")]\n\n# TULIS KODEMU: urutkan kronologis lalu cetak\nev.sort(key=)\nfor w, k in ev:\n    print(w, k)\n\n# TULIS KODEMU: TTD dan TTR (menit)\nfmt = "%H:%M"\nttd =\nttr =\nprint(f"TTD={ttd} mnt TTR={ttr} mnt")`,
        lockLines: 4,
        solution: `# Catatan kejadian tak berurutan. JANGAN UBAH baris ini.\nfrom datetime import datetime as dt\nev = [("11:30", "resolved"), ("09:12", "insiden mulai"),\n      ("10:05", "eskalasi ke direksi"), ("09:47", "terdeteksi")]\n\n# TULIS KODEMU: urutkan kronologis lalu cetak\nev.sort(key=lambda x: dt.strptime(x[0], "%H:%M"))\nfor w, k in ev:\n    print(w, k)\n\n# TULIS KODEMU: TTD dan TTR (menit)\nfmt = "%H:%M"\nttd = (dt.strptime("09:47", fmt) - dt.strptime("09:12", fmt)).seconds // 60\nttr = (dt.strptime("11:30", fmt) - dt.strptime("09:12", fmt)).seconds // 60\nprint(f"TTD={ttd} mnt TTR={ttr} mnt")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "09:12 insiden mulai\\n09:47 terdeteksi\\n10:05 eskalasi ke direksi\\n11:30 resolved", label: "Timeline terurut", msg: "Urutkan dengan strptime." },
          { kind: "stdout_matches", task: "t2", pattern: "TTD=35 mnt TTR=138 mnt", label: "TTD & TTR benar", msg: "35 = 09:47−09:12; 138 = 11:30−09:12." },
        ],
      },
      reference: "Sort by waktu → cetak → selisih menit. TTD = monitoring, TTR = respons.",
    },
    {
      id: "blameless",
      eyebrow: "Langkah 4 · Budaya",
      title: "Blameless: jujur itu menguntungkan",
      prose: [
        "Budaya blameless dalam satu kalimat: kita menghukum MENUTUPI, bukan MEMBUAT kesalahan. Insiden dilaporkan dalam 24 jam tanpa rasa takut → timeline jujur → akar masalah ketemu → tidak terulang. Insiden ditutupi → ketahuan belakangan → kepercayaan hancur + masalah tetap ada.",
        "Praktik konkret: (1) template laporan insiden baku (tidak ada yang bingung \u201Cmenulis apa\u201D); (2) review insiden tanpa atasan langsung pelaku di ruangan (mengurangi takut); (3) rayakan pelapor near-miss — beri apresiasi eksplisit; (4) tindak lanjut dipantau seperti proyek: pemilik + tenggat + status.",
        "Cara membaca figur: empat tonggak dari 09:12 ke 11:30; TTD dan TTR tertulis di tonggaknya. Interpretasi: timeline yang baik membuat TTD/TTR bisa dihitung — dan yang bisa dihitung bisa diperbaiki. Target: TTD dan TTR turun dari insiden ke insiden.",
      ],
      figure: {
        svg: FIG_TL,
        alt: "Timeline insiden dari jam 09:12 sampai 11:30 dengan empat tonggak.",
        caption: "Timeline presisi menit: fondasi laporan insiden. TTD 35 mnt, TTR 138 mnt.",
      },
      tasks: [],
      hints: [
        "Intuisi: near-miss yang dilaporkan = diskon 100% untuk pelajaran yang sama. Buat melapor near-miss lebih mudah daripada menyembunyikannya.",
        "Setiap tindak lanjut tanpa pemilik bernama = doa, bukan rencana.",
      ],
      reference: "Hukum menutupi, bukan kesalahan. Template + review aman + apresiasi near-miss.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Near-miss",
      title: "Ekonomi near-miss: harga sebuah diam",
      prose: [
        "Near-miss yang tidak dilaporkan di mini-case punya harga yang bisa dihitung: expected cost diam = p(terulang sebagai insiden) × biaya insiden. Data histori Bank Artha Dana: 40% near-miss serupa terulang dalam 12 bulan. Biaya insiden email: denda regulator Rp50 juta + 40 jam kerja tim lintas divisi (±Rp15 juta) = Rp65 juta.",
        "Expected cost diam per near-miss = 0,4 × Rp65 juta = Rp26 juta. Biaya melapor: 1 jam analis (±Rp150 ribu) + tindak lanjut mini 4 jam = Rp750 ribu. Rasio 35:1. Melapor bukan 'mengaku salah' — ia asuransi termurah di bank. Tidak ada produk asuransi dengan premi Rp750 ribu menanggung risiko Rp26 juta.",
        "Skala tahunan: 10 near-miss → expected cost diam Rp260 juta vs biaya budaya lapor Rp7,5 juta. Selisihnya = ROI budaya blameless yang bisa dipresentasikan ke direksi saat meminta budget program. Lab menghitungnya — dan menunjukkan verdict LAPORKAN bahkan jika probabilitasnya seperempat dari estimasi.",
        "Catatan jujur: p = 40% adalah estimasi histori internal, bukan konstanta fisika. Tetapi kesimpulan tidak sensitif terhadap asumsi: bahkan dengan p = 10%, rasio tetap 9:1. Keputusan yang benar pada orde besarnya > presisi pada angka yang salah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `exp_diam`, `biaya_budaya`, dan `roi`" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Expected cost diam: Rp260 jt/tahun\nBiaya budaya lapor: Rp7.5 jt/tahun\nROI: 35x -> LAPORKAN",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Melapor = mengaku salah.” Terbalik: melapor = membeli asuransi Rp750 ribu untuk risiko Rp26 juta. Yang 'mengaku salah' justru yang diam — saat insiden terulang, jejak near-miss yang disembunyikan menjadi bukti kelalaian.",
      },
      hints: [
        "exp_diam = n * p_ulang * biaya_insiden.",
        "roi = exp_diam / biaya_budaya.",
      ],
      code: {
        starter: "# Ekonomi near-miss (Rp, JANGAN UBAH).\np_ulang = 0.40\nbiaya_insiden = 65_000_000\nbiaya_lapor = 750_000\nn = 10  # near-miss per tahun\n\n# TULIS KODEMU: expected cost diam vs biaya budaya lapor\nexp_diam =\nbiaya_budaya =\nroi =\n\nprint(f\"Expected cost diam: Rp{exp_diam/1e6:.0f} jt/tahun\")\nprint(f\"Biaya budaya lapor: Rp{biaya_budaya/1e6:.1f} jt/tahun\")\nprint(f\"ROI: {roi:.0f}x -> {'LAPORKAN' if exp_diam > biaya_budaya else 'DIAM'}\")",
        lockLines: 5,
        solution: "# Ekonomi near-miss (Rp, JANGAN UBAH).\np_ulang = 0.40\nbiaya_insiden = 65_000_000\nbiaya_lapor = 750_000\nn = 10  # near-miss per tahun\n\n# TULIS KODEMU: expected cost diam vs biaya budaya lapor\nexp_diam = n * p_ulang * biaya_insiden\nbiaya_budaya = n * biaya_lapor\nroi = exp_diam / biaya_budaya\n\nprint(f\"Expected cost diam: Rp{exp_diam/1e6:.0f} jt/tahun\")\nprint(f\"Biaya budaya lapor: Rp{biaya_budaya/1e6:.1f} jt/tahun\")\nprint(f\"ROI: {roi:.0f}x -> {'LAPORKAN' if exp_diam > biaya_budaya else 'DIAM'}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`exp_diam` = 260 jt", msg: "10 × 0,4 × Rp65 jt = Rp260 jt.", name: "exp_diam", value: 260000000, tol: 1 },
          { kind: "equal", task: "t1", label: "`roi` = 35", msg: "260 / 7,5 = 34,67 → 35x.", name: "roi", value: 34.666666666666664, tol: 0.1 },
          { kind: "stdout_matches", task: "t2", label: "Verdict LAPORKAN", msg: "Expected cost >> biaya lapor.", pattern: "ROI: 35x -> LAPORKAN" }
        ],
      },
      reference: "Expected cost diam = p × biaya insiden. Blameless = asuransi termurah.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Prioritas near-miss",
      title: "Near-miss mana yang diperbaiki dulu?",
      prose: [
        "Lab pertama menghitung harga budaya diam. Lab ini memprioritaskan: tiga near-miss dinilai dari ekspektasi kerugian tahunan (probabilitas × biaya). 'Server down 2 jam' (10% × Rp5 M = Rp500 jt/tahun) mengalahkan 'salah input' (Rp300 jt) dan 'email salah kirim' (Rp25 jt).",
        "Prioritas berbasis ekspektasi mencegah politik insiden — yang diperbaiki duluan adalah yang termahal secara matematika, bukan yang paling berisik dibahas di rapat. Near-miss murah tetap dicatat, tetapi antre di belakang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung ekspektasi = probabilitas × biaya" },
        { id: "t2", text: "Jalankan dan pastikan prioritas tercetak" },
      ],
      expected: "Server down 2 jam: Rp500 jt/tahun\nSalah input Rp1 M: Rp300 jt/tahun\nEmail salah kirim: Rp25 jt/tahun\nPrioritas: Server down 2 jam",
      note: {
        title: "Ekspektasi ≠ kepastian.",
        type: "pitfall",
        body: "“Ekspektasi Rp500 jt, jadi tahun ini rugi segitu.” Ekspektasi adalah rata-rata jangka panjang — tahun ini bisa nol, bisa Rp5 miliar. Prioritas memakai ekspektasi, tetapi anggaran memakai skenario terburuk. Jangan campur keduanya.",
      },
      hints: [
        "ekspektasi = p * biaya.",
        "sorted(..., key=lambda x: x[1]*x[2], reverse=True) untuk prioritas.",
      ],
      code: {
        starter: "# (nama, probabilitas/tahun, biaya Rp jt). JANGAN UBAH.\ninsiden = [(\"Server down 2 jam\", 0.1, 5000), (\"Salah input Rp1 M\", 0.3, 1000), (\"Email salah kirim\", 0.5, 50)]\n\n# TULIS KODEMU: ekspektasi + prioritas\nfor nama, p, biaya in insiden:\n    ekspektasi = \n    print(f\"{nama}: Rp{ekspektasi:.0f} jt/tahun\")\ndiurut = sorted(insiden, key=lambda x: x[1]*x[2], reverse=True)\nprint(f\"Prioritas: {diurut[0][0]}\")",
        lockLines: 4,
        solution: "# (nama, probabilitas/tahun, biaya Rp jt). JANGAN UBAH.\ninsiden = [(\"Server down 2 jam\", 0.1, 5000), (\"Salah input Rp1 M\", 0.3, 1000), (\"Email salah kirim\", 0.5, 50)]\n\n# TULIS KODEMU: ekspektasi + prioritas\nfor nama, p, biaya in insiden:\n    ekspektasi = p * biaya\n    print(f\"{nama}: Rp{ekspektasi:.0f} jt/tahun\")\ndiurut = sorted(insiden, key=lambda x: x[1]*x[2], reverse=True)\nprint(f\"Prioritas: {diurut[0][0]}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Ekspektasi server down = Rp500 jt/tahun", msg: "0,1 × 5000 = 500.", pattern: "Server down 2 jam: Rp500 jt/tahun" },
          { kind: "stdout_matches", task: "t2", label: "Prioritas tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Prioritas: Server down 2 jam" }
        ],
      },
      reference: "Perbaiki yang termahal secara matematika, bukan yang paling berisik.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Insiden, near-miss, atau observasi?",
      prose: [
        "Satu: dampak nyata terjadi (email terkirim, data salah terkirim) → INSIDEN: laporan penuh 4 bagian + eskalasi. Dua: nyaris terjadi tetapi tertangkap (email dibatalkan sedetik sebelum terkirim) → NEAR-MISS: laporan singkat + apresiasi pelapor + perbaiki sistem. Tiga: kondisi berisiko tanpa kejadian (daftar alamat tidak terkunci) → OBSERVASI: catat di backlog perbaikan, tidak perlu laporan insiden. Empat: insiden berulang dengan pola sama → masalah SISTEMIK: audit proses, bukan insiden individual.",
        "Aturan praktis 10 detik: ada dampak → insiden. Nyaris → near-miss (rayakan!). Belum terjadi → observasi. Terjadi lagi → sistemik.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Near-miss → laporan singkat + apresiasi pelapor + perbaiki sistem minggu itu juga. Apresiasi harus EKSPLISIT dan di depan tim — 'terima kasih sudah berani cerita' adalah premi asuransi Rp0 yang paling manjur.",
      },
      reference: "Dampak = insiden. Nyaris = near-miss. Belum = observasi. Berulang = sistemik.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Near-miss yang tidak dilaporkan",
      prose: [
        "Tiga bulan sebelum insiden email, analis lain NYARIS mengirim draft ke regulator — dibatalkan 2 detik sebelum klik. Ia tidak melapor (\u201Ckan tidak terjadi apa-apa, malu\u201D). Akibatnya: tidak ada daftar alamat terkunci, tidak ada konfirmasi email eksternal. Tiga bulan kemudian insiden nyata terjadi dengan biaya 10x lipat.",
        "Pertanyaan: jika kamu atasannya saat near-miss itu terjadi, apa responsmu? Pembahasan: (1) apresiasi eksplisit di depan tim (\u201Cterima kasih sudah berani cerita — kamu menghemat kita dari insiden\u201D); (2) tindak lanjut mini: kunci daftar alamat minggu itu juga; (3) catat sebagai pelajaran di wiki tim. Biaya: 1 jam. Penghematan: satu insiden regulator. Inilah ROI budaya blameless — terukur, konkret.",
        "Hitungannya: menangani near-miss saat itu butuh 1 jam analis (±Rp150 ribu) + mengunci daftar alamat email eksternal (2 jam IT). Insiden tiga bulan kemudian: denda dan biaya klarifikasi regulator Rp50 juta + 40 jam kerja tim lintas divisi (±Rp15 juta) + catatan kepatuhan yang ditanyakan di setiap pemeriksaan tahunan. Rasio biaya diam vs lapor: 1 banding 400. 'Kan tidak terjadi apa-apa' adalah kalimat termahal di risk management.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap near-miss yang tidak dilaporkan = premi asuransi yang tidak dibayar. Organisasi membayarnya nanti — dengan insiden nyata yang lebih mahal. Budaya pelaporan adalah polis asuransi termurah.",
      },
      reference: "Rayakan near-miss. Tindak lanjuti mini. Catat pelajarannya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Mulai minggu ini: catat satu near-miss di timmu.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Mulai minggu ini: catat satu near-miss di timmu, hitung expected cost-nya dengan rumus lab ini, dan tunjukkan ke atasanmu. Satu angka ROI = satu budaya yang berubah.",
      },

      summary: [
        "Laporan insiden: 5W1H → timeline dari log → 5 whys → tindak lanjut bernama.",
        "TTD = mulai→deteksi; TTR = mulai→resolved; keduanya harus turun.",
        "Blameless: hukum menutupi, bukan kesalahan; akuntabilitas di tindak lanjut.",
        "Near-miss = pelajaran gratis; rayakan pelapornya.",
        "Klasifikasi: insiden / near-miss / observasi / sistemik.",
      ],
      next: { label: "RR13 — KPI vs KRI", href: "/learn/rr13-kri" },
      quiz: [
        {
          q: "Mengapa laporan insiden harus blameless?",
          options: [
            { text: "Agar tidak ada yang bertanggung jawab", why: "Salah — akuntabilitas ada di tindak lanjut, bukan hukuman." },
            { text: "Karena blame menghasilkan kebohongan dan akar masalah tak pernah diperbaiki", why: "Tepat. Takut = menutupi = terulang.", correct: true },
            { text: "Agar laporan lebih pendek", why: "Bukan soal panjang." },
          ],
        },
        {
          q: "Timeline insiden sebaiknya disusun dari?",
          options: [
            { text: "Memori para saksi", why: "Memori saling bertentangan — terbukti di cerita pembuka." },
            { text: "Log dan bukti (email server, chat, monitoring)", why: "Benar. Fakta mengalahkan memori.", correct: true },
            { text: "Tebakan yang paling masuk akal", why: "Tebakan di laporan resmi = bom waktu." },
          ],
        },
        {
          q: "TTD 35 menit untuk email salah alamat menunjukkan?",
          options: [
            { text: "Monitoring cukup baik", why: "35 menit untuk kesalahan kirim = lambat; seharusnya ada konfirmasi." },
            { text: "Monitoring lambat → butuh kontrol pencegahan (konfirmasi email eksternal)", why: "Tepat. Angka harus melahirkan tindak lanjut.", correct: true },
          ],
        },
        {
          q: "Analis nyaris mengirim draft ke regulator tetapi membatalkan. Klasifikasi?",
          options: [
            { text: "Bukan apa-apa, tidak perlu dilaporkan", why: "Itu yang terjadi — dan 3 bulan kemudian insiden nyata." },
            { text: "Near-miss: lapor singkat + apresiasi + perbaiki sistem", why: "Benar. Pelajaran gratis termahal yang tidak diambil.", correct: true },
            { text: "Insiden penuh dengan eskalasi direksi", why: "Tidak ada dampak nyata — porsi near-miss sudah cukup." },
          ],
        },
        {
          q: "Insiden yang sama terulang ketiga kalinya. Artinya?",
          options: [
            { text: "Sial saja", why: "Tiga kali = pola, bukan sial." },
            { text: "Masalah sistemik: audit prosesnya, bukan individunya", why: "Benar. 5 whys yang berhenti di orang = 5 whys yang gagal.", correct: true },
            { text: "Hukum pelakunya lebih berat", why: "Hukuman tidak memperbaiki sistem yang memungkinkan kesalahan." },
          ],
        },
      ],
    },
  ],
};
