import type { V2Lesson } from "../lib/types";

// Piramida Minto: kesimpulan di puncak, argumen, lalu data.
const FIG_MINTO = `<svg viewBox=\"0 0 480 280\" role=\"img\" aria-label=\"Piramida Minto: kesimpulan di puncak, argumen di tengah, data di dasar.\">
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<polygon points=\"240,20 340,120 140,120\" fill=\"var(--c1)\" opacity=\"0.9\"/>
<text x=\"240\" y=\"62\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">KESIMPULAN</text>
<text x=\"240\" y=\"80\" font-size=\"11\" fill=\"#fff\">dulu: \u201Cjadi apa?\u201D</text>
<text x=\"240\" y=\"96\" font-size=\"11\" fill=\"#fff\">1 kalimat</text>
<polygon points=\"120,132 360,132 420,212 60,212\" fill=\"var(--c2)\" opacity=\"0.9\"/>
<text x=\"240\" y=\"162\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">ARGUMEN</text>
<text x=\"240\" y=\"180\" font-size=\"11\" fill=\"#fff\">2–3 alasan kunci</text>
<polygon points=\"40,224 440,224 470,264 10,264\" fill=\"var(--c3)\" opacity=\"0.9\"/>
<text x=\"240\" y=\"248\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">DATA &amp; BUKTI</text>
</g>
<g font-size=\"11\" fill=\"var(--text-muted)\" font-family=\"var(--font-ui)\">
<text x=\"352\" y=\"66\">← dibaca</text><text x=\"352\" y=\"82\">direksi</text>
<text x=\"432\" y=\"170\">← dibaca</text><text x=\"432\" y=\"186\">komite</text>
</g>
</svg>`;

export const rr6: V2Lesson = {
  slug: "rr6-narasi",
  track: "Risk Reporting",
  module: "Komunikasi Risiko",
  title: "RR6 — Narasi & Storytelling Data",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "\u201CJadi saya harus apa?\u201D",
      prose: [
        "Analis menulis tiga paragraf: \u201CNPL SME tercatat 4,1% pada Oktober. Angka ini meningkat 0,6 pp dari September. Sub-segmen perdagangan mencatat 5,2%...\u201D CRO membaca sampai habis, menutup laptop, dan bertanya satu kalimat: \u201CJadi saya harus apa?\u201D Analis terdiam. Ia sudah menulis SEMUA data — tetapi tidak menulis SATU pun makna.",
        "Malamnya ia menulis ulang menjadi tiga kalimat: \u201CNPL SME menembus 4,1%, tertinggi tahun ini, didorong perdagangan yang terpukul banjir. Tanpa intervensi, proyeksi menyentuh 5% dalam dua bulan. Usulan: bekukan limit baru perdagangan sampai di bawah 4%.\u201D Pagi harinya CRO menyetujui dalam 10 menit. Twist-nya: data yang dipakai persis sama. Yang berubah hanya urutan dan keberanian berpendapat: kesimpulan dulu, data kemudian.",
        "Setelah lesson ini kamu bisa: (1) menulis dengan struktur piramida Minto; (2) membedakan kalimat deskriptif vs insight; (3) mengukur insight density tulisanmu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Paragraf deskriptif tanpa kesimpulan = komite menebak sendiri artinya = lima orang lima tafsir = keputusan berdasarkan tafsir, bukan analisis. Narasi yang buruk bukan masalah gaya — masalah tata kelola.",
      },
      reference: "Data sama, urutan beda, keputusan beda. Kesimpulan dulu.",
    },
    {
      id: "minto",
      eyebrow: "Langkah 2 · Piramida Minto",
      title: "Kesimpulan dulu, baru bukti",
      prose: [
        "Piramida Minto (Barbara Minto, McKinsey): mulai dari KESIMPULAN (satu kalimat: jadi apa?), lalu ARGUMEN (2–3 alasan kunci yang mendukung), lalu DATA & BUKTI (angka, chart, tabel). Kebalikan dari cara analis biasanya menulis — metodologi dulu, temuan di akhir — yang memaksa pembaca menunggu 3 halaman untuk tahu intinya.",
        "Varian untuk laporan risiko: SCQA — Situation (situasi), Complication (komplikasi/perubahan), Question (pertanyaan keputusan), Answer (jawaban/rekomendasi). Contoh: \u201CNPL SME stabil di 3,5% setahun (S), tetapi Oktober menembus 4,1% didorong banjir (C). Apakah kita bekukan limit perdagangan? (Q) Ya — sampai NPL kembali di bawah 4% (A).\u201D Empat kalimat, satu keputusan.",
        "Cara membaca figur: puncak piramida = yang dibaca direksi (1 kalimat); tengah = komite (alasan); dasar = analis/CRO (bukti). Interpretasi: jika pembaca berhenti di puncak, ia tetap membawa pulang keputusan yang benar. Itulah tes piramida: potong tulisanmu di tiap lapis — apakah yang tersisa masih berguna?",
      ],
      figure: {
        svg: FIG_MINTO,
        alt: "Piramida Minto: kesimpulan di puncak, argumen di tengah, data di dasar.",
        caption: "Piramida Minto: tulis dari puncak (kesimpulan) ke dasar (bukti). Pembaca boleh berhenti di mana pun.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CMulai dari metodologi agar terlihat ilmiah.\u201D Pembaca laporan risiko bukan penguji skripsi. Metodologi di lampiran (ingat anatomi RR2). Membuka dengan metodologi = meminta direksi berinvestasi 10 menit sebelum tahu untuk apa.",
      },
      hints: [
        "Intuisi: jika kalimat pertamamu bisa dihapus tanpa mengubah keputusan pembaca, ia bukan kesimpulan — hapus dan mulai dari kalimat kedua.",
        "SCQA memaksa ada \u201Ccomplication\u201D: tanpa perubahan/tantangan, tidak ada alasan menulis laporan.",
      ],
      reference: "Minto: kesimpulan → argumen → data. SCQA: situasi → komplikasi → pertanyaan → jawaban.",
    },
    {
      id: "lab-density",
      eyebrow: "Langkah 3 · Lab",
      title: "Ukur insight density tulisanmu",
      prose: [
        "Insight density = porsi kalimat yang mengandung makna (penyebab, risiko, rekomendasi), bukan sekadar deskripsi angka. Lab ini mengklasifikasi enam kalimat laporan dengan heuristik kata kunci: kalimat yang mengandung kata seperti \u201Cdidorong\u201D, \u201Crisiko\u201D, \u201Cperlu\u201D, \u201Ckarena\u201D = insight; sisanya = deskriptif.",
        "Hasilnya: 3 dari 6 kalimat = insight (50%). Target untuk narasi eksekutif: di atas 60%. Heuristik ini kasar — tetapi ia melatih mata: setiap kali menulis \u201Ctercatat sebesar\u201D, tanyakan \u201Clalu kenapa? jadi apa?\u201D",
      ],
      formula: String.raw`\text{Insight density} = \frac{\text{kalimat insight}}{\text{total kalimat}}`,
      formulaNote: "Kalimat insight = mengandung penyebab, dampak, atau rekomendasi. Contoh: 3 insight dari 6 kalimat → 50%. Interpretasi: di bawah 40% = deskripsi tabel berkedok laporan; di atas 60% = narasi yang layak dibaca direksi.",
      tasks: [
        { id: "t1", text: "Lengkapi klasifikasi `insight` vs `deskriptif`" },
        { id: "t2", text: "Jalankan dan baca skornya" },
      ],
      expected: "deskriptif=3 insight=3 rasio=50%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CMendeskripsikan tabel dengan kalimat = menganalisis.\u201D Bukan. \u201CNPL naik ke 4,1%\u201D hanya memindahkan angka dari tabel ke paragraf. Analisis menjawab \u201Ckenapa naik\u201D dan \u201Cjadi apa\u201D — dua hal yang tidak ada di tabel.",
      },
      hints: [
        "Cek tiap kalimat: mengandung kata kunci insight? Pakai any() dengan generator.",
        "Kata kunci: didorong, risiko, perlu, sebaiknya, karena, akibat.",
        "rasio = len(insight) / len(kalimat), format :.0%.",
      ],
      code: {
        starter: `# Enam kalimat dari draf laporan. JANGAN UBAH baris ini.\nkalimat = ["NPL naik dari 3,2% ke 3,4% pada Oktober.",\n  "Kenaikan didorong segmen SME yang terdampak banjir.",\n  "Total kredit tercatat Rp1.210 miliar.",\n  "Coverage turun ke 72% karena CKPN tidak ditambah.",\n  "Risiko: buffer menipis, perlu tambahan pencadangan Rp8 miliar.",\n  "Rapat komite dijadwalkan Kamis."]\nins_kw = ["didorong", "risiko", "perlu", "sebaiknya", "karena", "akibat"]\n\n# TULIS KODEMU: pisahkan kalimat insight vs deskriptif\ninsight =\ndeskriptif =\nprint(f"deskriptif={len(deskriptif)} insight={len(insight)} rasio={len(insight)/len(kalimat):.0%}")`,
        lockLines: 8,
        solution: `# Enam kalimat dari draf laporan. JANGAN UBAH baris ini.\nkalimat = ["NPL naik dari 3,2% ke 3,4% pada Oktober.",\n  "Kenaikan didorong segmen SME yang terdampak banjir.",\n  "Total kredit tercatat Rp1.210 miliar.",\n  "Coverage turun ke 72% karena CKPN tidak ditambah.",\n  "Risiko: buffer menipis, perlu tambahan pencadangan Rp8 miliar.",\n  "Rapat komite dijadwalkan Kamis."]\nins_kw = ["didorong", "risiko", "perlu", "sebaiknya", "karena", "akibat"]\n\n# TULIS KODEMU: pisahkan kalimat insight vs deskriptif\ninsight = [k for k in kalimat if any(w in k.lower() for w in ins_kw)]\ndeskriptif = [k for k in kalimat if not any(w in k.lower() for w in ins_kw)]\nprint(f"deskriptif={len(deskriptif)} insight={len(insight)} rasio={len(insight)/len(kalimat):.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "insight", value: ["Kenaikan didorong segmen SME yang terdampak banjir.", "Coverage turun ke 72% karena CKPN tidak ditambah.", "Risiko: buffer menipis, perlu tambahan pencadangan Rp8 miliar."], label: "3 kalimat insight terdeteksi", msg: "Cari kata kunci di tiap kalimat (case-insensitive)." },
          { kind: "stdout_matches", task: "t2", pattern: "deskriptif=3 insight=3 rasio=50%", label: "Skor 50% tercetak", msg: "3 deskriptif, 3 insight dari 6 kalimat." },
        ],
      },
      reference: "Hitung kalimat insight / total. Target narasi eksekutif > 60%.",
    },
    {
      id: "kalimat",
      eyebrow: "Langkah 4 · Pola kalimat",
      title: "Dari deskripsi ke insight dalam satu edit",
      prose: [
        "Pola transformasi: Deskriptif \u201CNPL SME 4,1%, naik 0,6 pp\u201D → tambah PENYEBAB: \u201C...didorong perdagangan yang terpukul banjir\u201D → tambah DAMPAK: \u201C...tanpa intervensi menyentuh 5% dalam dua bulan\u201D → tambah REKOMENDASI: \u201C...usulan bekukan limit baru.\u201D Satu kalimat deskriptif + tiga tambahan = satu paragraf yang menghasilkan keputusan.",
        "Kata kerja adalah penanda: \u201Ctercatat\u201D, \u201Csebesar\u201D, \u201Cmenunjukkan\u201D = deskriptif. \u201CDidorong\u201D, \u201Cmenyebabkan\u201D, \u201Cberisiko\u201D, \u201Cperlu\u201D = insight. Saat mengedit draf, sorot semua kata kerja deskriptif — tiap satunya adalah undangan untuk bertanya \u201Ckenapa?\u201D dan \u201Cjadi apa?\u201D",
      ],
      tasks: [],
      hints: [
        "Intuisi: pembaca mengingat MAKNA, bukan angka. Setahun kemudian tidak ada yang ingat \u201C4,1%\u201D — tetapi semua ingat \u201Cbanjir memukul perdagangan, limit dibekukan\u201D.",
        "Satu paragraf = satu insight. Paragraf dengan tiga angka tak terkait = tiga paragraf yang digabung paksa.",
      ],
      reference: "Deskriptif + penyebab + dampak + rekomendasi = paragraf keputusan.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Rekomendasi",
      title: "Scorer rekomendasi: dari basa-basi ke kalimat perintah",
      prose: [
        "Tiga komponen kalimat perintah: tindakan spesifik (kata kerja aksi + objek), pemilik bernama, tenggat tanggal. 'Bekukan limit baru perdagangan' + 'Kadiv SME' + '15 Desember' = 3/3. Kurang satu komponen = kalimat pincang: ada tindakan tanpa pemilik (tidak dikerjakan siapa pun) atau tanpa tenggat (dikerjakan kapan-kapan).",
        "Heuristik pemeriksa di lab: kalimat mengandung kata kerja aksi (bekukan, tambah, turunkan, hentikan, batasi) + angka (nominal/tanggal) + penanda pemilik (pemilik/kadiv/kepala) = perintah. 'Konsentrasi top-20 perlu mendapat perhatian' → 0/3 → basa-basi. 'Tambah CKPN Rp8 miliar bulan ini, pemilik Kepala Divisi Risiko' → 3/3 → perintah.",
        "Standarnya keras: 3/3 = perintah, ≤2 = tulis ulang. Kelonggaran ('2 dari 3 cukup lah') menghasilkan basa-basi yang lolos sensor — dan rapat yang tidak menghasilkan tindakan. Tiga contoh transformasi: 'Likuiditas perlu dijaga' → 'Jaga LCR di atas 120% dengan menahan pembelian obligasi korporasi, pemilik Treasurer, review 15 November.' Selalu bisa; hanya butuh keberanian menyebut nama dan tanggal.",
        "Uji terakhir sebelum kirim: baca rekomendasimu lalu tanya 'siapa mengerjakan apa sebelum kapan?' — jika satu pun tak terjawab, tulis ulang. Rekomendasi yang lolos uji ini tidak pernah disalahpahami; yang gagal selalu kembali sebagai pekerjaan rumah minggu depan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `skor` (0-3) dan vonis tiap kalimat" },
        { id: "t2", text: "Jalankan dan pastikan vonis tercetak" },
      ],
      expected: "skor 3/3 -> PERINTAH: Bekukan limit baru perdagangan sampai NP\nskor 1/3 -> TULIS ULANG: Konsentrasi top-20 perlu mendapat perhat\nskor 3/3 -> PERINTAH: Tambah CKPN Rp8 miliar bulan ini, pemili\nskor 0/3 -> TULIS ULANG: Tingkatkan kewaspadaan terhadap risiko l",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Nada netral = tidak berpendapat.” Netral dalam nada boleh; netral dalam rekomendasi = tidak berguna. Direksi tidak butuh analis yang netral — mereka butuh analis yang berani salah secara spesifik dan bisa dipertanggungjawabkan.",
      },
      hints: [
        "Tiga komponen: kata kerja aksi, angka, penanda pemilik.",
        "vonis = PERINTAH hanya jika s == 3.",
      ],
      code: {
        starter: "# Empat kalimat rekomendasi (JANGAN UBAH).\nkalimat = [\n    \"Bekukan limit baru perdagangan sampai NPL di bawah 4 persen, pemilik Kadiv SME, tenggat 15 Desember.\",\n    \"Konsentrasi top-20 perlu mendapat perhatian.\",\n    \"Tambah CKPN Rp8 miliar bulan ini, pemilik Kepala Divisi Risiko.\",\n    \"Tingkatkan kewaspadaan terhadap risiko likuiditas.\",\n]\naksi = [\"bekukan\", \"tambah\", \"turunkan\", \"hentikan\", \"batasi\"]\n\n# TULIS KODEMU: skor tiap kalimat (0-3)\ndef skor(k):\n    return\n\nfor k in kalimat:\n    s = skor(k)\n    vonis = \n    print(f\"skor {s}/3 -> {vonis}: {k[:40]}\")",
        lockLines: 9,
        solution: "# Empat kalimat rekomendasi (JANGAN UBAH).\nkalimat = [\n    \"Bekukan limit baru perdagangan sampai NPL di bawah 4 persen, pemilik Kadiv SME, tenggat 15 Desember.\",\n    \"Konsentrasi top-20 perlu mendapat perhatian.\",\n    \"Tambah CKPN Rp8 miliar bulan ini, pemilik Kepala Divisi Risiko.\",\n    \"Tingkatkan kewaspadaan terhadap risiko likuiditas.\",\n]\naksi = [\"bekukan\", \"tambah\", \"turunkan\", \"hentikan\", \"batasi\"]\n\n# TULIS KODEMU: skor tiap kalimat (0-3)\ndef skor(k):\n    kl = k.lower()\n    s = 0\n    if any(a in kl for a in aksi):\n        s += 1\n    if any(c.isdigit() for c in kl):\n        s += 1\n    if \"pemilik\" in kl or \"kadiv\" in kl or \"kepala\" in kl:\n        s += 1\n    return s\n\nfor k in kalimat:\n    s = skor(k)\n    vonis = \"PERINTAH\" if s == 3 else \"TULIS ULANG\"\n    print(f\"skor {s}/3 -> {vonis}: {k[:40]}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "2 PERINTAH terdeteksi", msg: "Dua kalimat harus lolos sebagai PERINTAH.", pattern: "skor 3/3 -> PERINTAH" },
          { kind: "stdout_matches", task: "t2", label: "2 TULIS ULANG terdeteksi", msg: "Dua kalimat basa-basi harus tertangkap.", pattern: "skor 0/3 -> TULIS ULANG" }
        ],
      },
      reference: "Rekomendasi = tindakan + pemilik + tenggat. Skor 3/3 atau tulis ulang.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Klasifikasi kalimat",
      title: "FAKTA, OPINI, atau PERINTAH?",
      prose: [
        "Lab pertama menilai kalimat rekomendasi. Lab ini mengklasifikasikan tiap kalimat laporan ke tiga jenis: FAKTA (punya angka/satuan), OPINI (penilaian tanpa angka), PERINTAH (kalimat imperatif). Laporan sehat memisahkan ketiganya — pembaca harus tahu mana yang data, mana yang tafsir, mana yang ajakan bertindak.",
        "Tiga kalimat contoh terklasifikasi sempurna: 'NPL naik 0,3 pp menjadi 3,4%' = FAKTA; 'Kenaikan ini mengkhawatirkan' = OPINI; 'Bekukan limit baru...' = PERINTAH. Masalah klasik laporan bank: opini menyamar sebagai fakta ('NPL memburuk' tanpa angka).",
      ],
      tasks: [
        { id: "t1", text: "Tulis aturan klasifikasi tiga jenis kalimat" },
        { id: "t2", text: "Jalankan dan pastikan klasifikasi tercetak" },
      ],
      expected: "FAKTA: NPL naik 0,3 pp menjadi 3,4%.\nOPINI: Kenaikan ini mengkhawatirkan.\nPERINTAH: Bekukan limit baru sampai NPL < 3%.",
      note: {
        title: "Label ≠ izin.",
        type: "pitfall",
        body: "“Sudah dilabeli OPINI, jadi boleh ngawur.” Klasifikasi memisahkan jenis klaim, bukan memvalidasinya — opini tetap butuh dasar argumen, perintah tetap butuh kewenangan. Label hanya membuat pembaca tahu apa yang sedang dibaca.",
      },
      hints: [
        "FAKTA: mengandung %, Rp, atau pp.",
        "Cek PERINTAH dulu: kalimat imperatif bisa mengandung angka (%).",
      ],
      code: {
        starter: "# Tiga kalimat laporan. JANGAN UBAH.\nkalimat = [\n    \"NPL naik 0,3 pp menjadi 3,4%.\",\n    \"Kenaikan ini mengkhawatirkan.\",\n    \"Bekukan limit baru sampai NPL < 3%.\",\n]\n\n# TULIS KODEMU: cek PERINTAH dulu (bisa mengandung angka)\nfor k in kalimat:\n    if k.startswith(\"Bekukan\"):\n        vonis = \"PERINTAH\"\n    elif any(x in k for x in [\"%\", \"Rp\", \"pp\"]):\n        vonis = \"FAKTA\"\n    else:\n        vonis = \"OPINI\"\n    print(f\"{vonis}: {k}\")",
        lockLines: 4,
        solution: "# Tiga kalimat laporan. JANGAN UBAH.\nkalimat = [\n    \"NPL naik 0,3 pp menjadi 3,4%.\",\n    \"Kenaikan ini mengkhawatirkan.\",\n    \"Bekukan limit baru sampai NPL < 3%.\",\n]\n\n# TULIS KODEMU: cek PERINTAH dulu (bisa mengandung angka)\nfor k in kalimat:\n    if k.startswith(\"Bekukan\"):\n        vonis = \"PERINTAH\"\n    elif any(x in k for x in [\"%\", \"Rp\", \"pp\"]):\n        vonis = \"FAKTA\"\n    else:\n        vonis = \"OPINI\"\n    print(f\"{vonis}: {k}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "FAKTA terdeteksi", msg: "Kalimat berangka = FAKTA.", pattern: "FAKTA: NPL naik 0,3 pp" },
          { kind: "stdout_matches", task: "t2", label: "PERINTAH terdeteksi", msg: "Kalimat imperatif = PERINTAH.", pattern: "PERINTAH: Bekukan" }
        ],
      },
      reference: "FAKTA = berangka; OPINI = penilaian; PERINTAH = imperatif. Opini tanpa angka yang menyamar jadi fakta = masalah klasik.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Seberapa panjang narasi?",
      prose: [
        "Satu: headline eksekutif → 1 kalimat kesimpulan + 1 rekomendasi; tidak ada ruang argumen. Dua: temuan rutin → SCQA 4 kalimat. Tiga: temuan material/kontroversial → piramida penuh: kesimpulan + 3 argumen + bukti; siapkan jawaban atas \u201Ckok bisa?\u201D Empat: tidak ada temuan → JANGAN mengarang narasi; tulis \u201Ctidak ada perubahan material\u201D dan selesai — narasi karangan merusak kepercayaan.",
        "Aturan praktis 10 detik: panjang narasi ∝ kontroversi × besar keputusan (sama seperti panjang laporan di RR2). Narasi yang jujur tentang \u201Ctidak ada apa-apa\u201D lebih berharga dari karangan tiga paragraf.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Temuan rutin → SCQA 4 kalimat cukup; tetapi rekomendasinya tetap harus 3/3. SCQA yang diakhiri 'perlu mendapat perhatian' = SCQ tanpa A — pertanyaan tanpa jawaban.",
      },
      reference: "Rutin = SCQA 4 kalimat. Kontroversial = piramida penuh. Tidak ada temuan = satu kalimat jujur.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Tulis ulang tiga paragraf",
      prose: [
        "Draf analis: \u201CLCR tercatat 118% pada Oktober, turun 17 pp dari September (135%). HQLA tercatat Rp270 miliar. Arus kas keluar bersih 30 hari tercatat Rp229 miliar. Rasio ini berada di atas batas minimum 100%.\u201D Empat kalimat, nol insight, dan — lebih buruk — menyesatkan: pembaca menyimpulkan likuiditas memburuk (ingat kasus RR4: penyebabnya perubahan daftar HQLA).",
        "Tulis ulang versi SCQA: (S) \u201CLCR 118%, masih di atas batas 100%.\u201D (C) \u201CTurun 17 pp bukan karena likuiditas memburuk, melainkan karena obligasi korporasi A+ dikeluarkan dari daftar HQLA per ketentuan baru.\u201D (Q) \u201CApakah perlu tindakan likuiditas?\u201D (A) \u201CTidak — posisi kas aktual tidak berubah; cukup catat metodologi baru di footnote.\u201D Empat kalimat yang mencegah satu jam rapat salah arah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Narasi deskriptif tentang LCR bisa memicu respons likuiditas yang mahal: menahan ekspansi kredit atau menaikkan suku bunga dana. Biaya narasi buruk = biaya keputusan buruk.",
      },
      reference: "SCQA memaksa ada komplikasi dan jawaban — dua hal yang tidak ada di tabel.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Setelah ini, buka draf laporan terakhirmu dan hitung insight density-nya.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Kata kerja adalah penanda: sorot semua 'tercatat', 'sebesar', 'menunjukkan' di drafmu — tiap satunya undangan untuk bertanya 'kenapa?' dan 'jadi apa?'. Tulis ulang hingga tiap paragraf punya minimal satu kata kerja aksi.",
      },

      summary: [
        "Piramida Minto: kesimpulan → argumen → data. Tulis dari puncak.",
        "SCQA: situasi → komplikasi → pertanyaan → jawaban (4 kalimat).",
        "Deskriptif = memindahkan angka ke paragraf; insight = kenapa + jadi apa.",
        "Insight density target > 60% untuk narasi eksekutif.",
        "Satu paragraf = satu insight; kata kerja penanda insight: didorong, berisiko, perlu.",
      ],
      next: { label: "RR7 — Merancang Dashboard Risiko", href: "/learn/rr7-dashboard" },
      quiz: [
        {
          q: "Urutan piramida Minto yang benar?",
          options: [
            { text: "Data → argumen → kesimpulan", why: "Itu urutan analis pemula — memaksa pembaca menunggu intinya." },
            { text: "Kesimpulan → argumen → data", why: "Tepat. Pembaca boleh berhenti di lapis mana pun.", correct: true },
            { text: "Metodologi → data → kesimpulan", why: "Itu urutan skripsi, bukan laporan keputusan." },
          ],
        },
        {
          q: "Mana kalimat insight?",
          options: [
            { text: "\u201CNPL tercatat 4,1% pada Oktober\u201D", why: "Deskriptif — hanya memindahkan angka ke kalimat." },
            { text: "\u201CKenaikan didorong banjir; tanpa intervensi menyentuh 5% — usulan bekukan limit\u201D", why: "Memuat penyebab + dampak + rekomendasi — tiga lapis insight.", correct: true },
            { text: "\u201CTotal kredit tercatat Rp1.210 miliar\u201D", why: "Deskriptif murni." },
          ],
        },
        {
          q: "Fungsi \u201Ccomplication\u201D dalam SCQA?",
          options: [
            { text: "Membuat laporan dramatis", why: "Bukan drama — ini alasan laporan perlu ditulis." },
            { text: "Menjelaskan perubahan/tantangan yang memicu pertanyaan keputusan", why: "Tepat. Tanpa komplikasi, tidak ada yang perlu diputuskan.", correct: true },
            { text: "Menyalahkan pihak tertentu", why: "SCQA soal keputusan, bukan menyalahkan." },
          ],
        },
        {
          q: "Tidak ada temuan material bulan ini. Narasi yang tepat?",
          options: [
            { text: "Karangan tiga paragraf agar terlihat bekerja", why: "Merusak kepercayaan — pembaca belajar melewatkan narasimu." },
            { text: "\u201CTidak ada perubahan material\u201D — satu kalimat jujur", why: "Benar. Kejujuran singkat > karangan panjang.", correct: true },
            { text: "Ulangi narasi bulan lalu", why: "Copy-paste narasi = laporan basi yang tidak dibaca." },
          ],
        },
        {
          q: "Tes piramida: potong tulisan di tiap lapis. Tujuannya?",
          options: [
            { text: "Memastikan tiap potongan masih berguna bagi pembacanya", why: "Tepat. Direksi yang hanya baca puncak tetap pulang dengan keputusan benar.", correct: true },
            { text: "Memperpendek tulisan", why: "Bisa jadi efek samping, bukan tujuannya." },
            { text: "Menghapus data pendukung", why: "Data pendukung tetap dibutuhkan di dasar piramida." },
          ],
        },
      ],
    },
  ],
};
