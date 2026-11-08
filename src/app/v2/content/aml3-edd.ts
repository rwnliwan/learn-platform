import type { V2Lesson } from "../lib/types";

// Tangga eskalasi EDD: 4 anak tangga dari CDD standar hingga exit/SAR.
const LADDER_SVG = `<svg viewBox="0 0 480 260" role="img" aria-label="Tangga eskalasi EDD empat tingkat.">
<g font-size="12" font-family="var(--font-ui)">
<rect x="90" y="196" width="300" height="40" rx="8" fill="var(--c1)" opacity="0.8"/><text x="240" y="221" text-anchor="middle" fill="var(--text)" font-weight="600">1 · CDD Standar — pantau normal</text>
<rect x="110" y="146" width="260" height="40" rx="8" fill="var(--c2)" opacity="0.8"/><text x="240" y="171" text-anchor="middle" fill="var(--text)" font-weight="600">2 · EDD — gali sumber dana, BO, relasi</text>
<rect x="130" y="96" width="220" height="40" rx="8" fill="var(--c3)" opacity="0.85"/><text x="240" y="121" text-anchor="middle" fill="var(--text)" font-weight="600">3 · Enhanced monitoring — batasi limit</text>
<rect x="150" y="46" width="180" height="40" rx="8" fill="var(--c4)" opacity="0.85"/><text x="240" y="71" text-anchor="middle" fill="var(--text)" font-weight="600">4 · Exit + SAR</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.5"><line x1="240" y1="196" x2="240" y2="186"/><line x1="240" y1="146" x2="240" y2="136"/><line x1="240" y1="96" x2="240" y2="86"/></g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="410" y="221">trigger:</text><text x="410" y="171">PEP / adverse</text><text x="410" y="121">pola makin aneh</text><text x="410" y="71">bukti kuat</text>
</g>
<text x="240" y="252" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Naik tangga = makin mahal. Jangan naik tanpa bukti, jangan turun tanpa alasan tertulis.</text>
</svg>`;

export const aml3: V2Lesson = {
  slug: "aml3-edd",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML3 — EDD: PEP & Adverse Media",
  estMinutes: 80,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu huruf yang membuat screening buta 14 bulan",
      prose: [
        "\"H. S.\" membuka rekening sebagai wiraswasta. Setoran Rp2-5 miliar per bulan — besar, tapi usahanya \"perdagangan\" dan dokumennya lengkap. Risk rating awal: Standard. 14 bulan rekening itu berjalan normal-normal saja. Lalu sebuah portal berita investigasi mempublish: H. Sulaeman adalah keponakan bupati, pemenang proyek APBD Rp80 miliar lewat 3 perusahaan perantara.",
        "Twist-nya pahit: bank SUDAH melakukan screening PEP saat onboarding — hasilnya \"no match.\" Di KTP tertulis \"H. Sulaeman\"; media menulis \"Haji Sulaiman.\" Satu huruf beda, sistem exact-match menyerah. Yang akhirnya menyelamatkan bank bukanlah sistem mahal itu, melainkan Google Alert manual seorang analis junior yang iseng memasukkan nama nasabah prioritas ke mesin pencari setiap Jumat sore.",
        "Kasus ini tentang EDD (Enhanced Due Diligence): apa yang kamu lakukan ketika CDD standar tidak cukup. Kapan \"tidak cukup\" itu terjadi, bagaimana menyaring berita dari gosip, dan keputusan apa yang diambil setelahnya — dari pantau diam-diam sampai exit + SAR.",
        "Setelah lesson ini kamu bisa: menyebutkan trigger EDD, menghitung skor adverse media dari severity × relevansi × recency, menjelaskan kenapa PEP bukan blacklist, dan memilih eskalasi yang proporsional.",
      ],
      tasks: [],
      reference: "Screening yang hanya exact-match = pintu dengan lubang sebesar huruf. EDD = apa yang terjadi setelah pintu itu jebol.",
    },
    {
      id: "trigger",
      eyebrow: "Langkah 2 · Kapan CDD tidak cukup",
      title: "Empat pemicu EDD",
      prose: [
        "Satu: PEP — politically exposed person: pejabat publik (domestik/asing), petinggi organisasi internasional, plus keluarga dekat dan rekan dekat yang diketahui (definisi FATF: keluarga dekat + rekan dekat yang diketahui \u2014 bukan semua kolega). Kenapa mereka spesial? Bukan karena pasti korup — melainkan karena posisinya memberi akses ke dana publik dan pengaruh yang bisa disalahgunakan. Risiko PEP = risiko korupsi, dan hasil korupsi butuh dicuci.",
        "Dua: adverse media — berita negatif kredibel tentang kejahatan finansial, korupsi, atau sanksi yang menyeret nama nasabah/BO. Tiga: kompleksitas tanpa alasan bisnis — struktur berlapis, yurisdiksi aneh, transaksi yang \"terlalu pintar\" untuk profilnya. Empat: negara/yurisdiksi berisiko tinggi — daftar FATF grey/black list.",
        "Prinsip kunci: PEP dan adverse media memicu EDD, bukan penolakan otomatis. Menolak semua PEP = menolak gubernur bank sentral yang jujur dan kehilangan bisnis; menerima semua PEP = menunggu bom H. S. berikutnya. EDD = \"kita gali lebih dalam, lalu putuskan berbasis bukti.\"",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"PEP = tolak. Lebih aman.\" Penolakan blanket terhadap PEP justru dilarang pendekatannya oleh standar FATF: yang diminta adalah risk-based approach. Bank yang menolak semua PEP tidak aman — ia hanya buta, karena PEP yang cerdik akan datang lewat perantara yang bukan PEP.",
      },
      reference: "Trigger EDD: PEP, adverse media, kompleksitas tanpa alasan, yurisdiksi berisiko. Trigger ≠ vonis.",
    },
    {
      id: "skor-adverse",
      eyebrow: "Langkah 3 · Menilai berita",
      title: "Skor adverse: dari gosip ke angka",
      prose: [
        "Tidak semua \"berita buruk\" sama. Analis menilai tiap temuan dari tiga dimensi: severity (seberapa berat tuduhannya? korupsi = 3, sengketa perdata = 1), relevance (seberapa yakin ini orang yang sama? nama persis + foto = 3, nama pasaran tanpa identifier = 1), recency (kapan? <1 tahun = 3, >3 tahun = 1). Sumber terpercaya (media arus utama, putusan pengadilan) menggandakan skor; blog anonim tidak.",
        "Skor satu temuan = severity × relevance × recency × (2 jika sumber terpercaya). Total skor nasabah = jumlah semua temuan. Ambang: ≥12 → EDD; 4-11 → pantau enhanced; <4 → tetap standar. Angka-angka ini bisa dituning — yang penting konsisten antar analis.",
        "Cara membaca tangga: empat anak tangga, makin ke atas makin mahal (waktu, biaya, risiko hubungan nasabah). Teks kanan = pemicu naik. Interpretasi: kebanyakan kasus berhenti di tangga 2-3. Tangga 4 (exit + SAR) hanya untuk bukti kuat — naik ke sana tanpa bukti = kehilangan nasabah + masalah hukum; menolak naik padahal bukti kuat = menunggu denda regulator.",
      ],
      formula: String.raw`A = s \times r \times t \times m \qquad m = \begin{cases} 2 & \text{sumber terpercaya} \ 1 & \text{lainnya} \end{cases}`,
      formulaNote: "A = skor satu temuan adverse media. s = severity (1-3), r = relevance/kecocokan identitas (1-3), t = recency/kebaruan (1-3), m = multiplier kredibilitas sumber. Total nasabah = ΣA; ambang EDD ≥ 12.",
      figure: {
        svg: LADDER_SVG,
        alt: "Tangga eskalasi EDD empat tingkat.",
        caption: "Tangga eskalasi: CDD standar → EDD → enhanced monitoring → exit + SAR. Naik butuh bukti.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Satu sumber = rumor; dua sumber independen = sinyal; putusan pengadilan = fakta. Analis junior menghitung jumlah berita; analis senior menghitung jumlah sumber independen. Lima portal mengutip satu siaran pers yang sama = satu sumber, bukan lima.",
      },
      reference: "Tuning ambang EDD dari data historis: berapa skor kasus yang akhirnya terbukti vs yang tidak.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab screening",
      title: "Putuskan nasib 3 nasabah dari temuannya",
      prose: [
        "Tiga nasabah, tiga set temuan adverse media. Hitung skor tiap temuan, jumlahkan, dan tentukan keputusannya: EDD, Pantau, atau Standar. Kasus A adalah \"H. S.\" versi lab — dua temuan berat dari media terpercaya. Kasus B cuma satu bisikan blog. Kasus C bersih.",
        "Perhatikan: satu temuan blog anonim (skor 4) tidak memicu EDD — tapi ia juga tidak diabaikan; ia masuk \"pantau.\" Inilah bedanya sistem yang proporsional dengan sistem yang panik.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `skor_adverse(hits)` dan `keputusan(skor)`" },
        { id: "t2", text: "Jalankan dan pastikan A=EDD, B=Pantau, C=Standar" },
      ],
      expected: "A: skor=78 → EDD | B: skor=4 → Pantau | C: skor=0 → Standar",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Ada berita negatif = langsung EDD.\" Skor B = 4 (blog anonim, tuduhan ringan, kecocokan rendah) — EDD untuk ini = membakar 20 jam analis untuk gosip. Ambang ada agar perhatian mahal dialokasikan ke sinyal kuat. Yang benar: catat, pantau, naikkan kalau ada temuan kedua yang independen.",
      },
      hints: [
        "skor = sum(sev*rel*rec*(2 jika trusted else 1) untuk tiap hit).",
        "keputusan: >=12 EDD; >=4 Pantau; sisanya Standar.",
        "A: 3*3*3*2 + 2*3*2*2 = 54 + 24 = 78.",
      ],
      code: {
        starter: `# temuan: (sumber_terpercaya 0/1, severity 1-3, relevance 1-3, recency 1-3)\nkasus = {\n    "A (PEP terkonfirmasi)": [(1,3,3,3),(1,2,3,2)],\n    "B (match lemah)": [(0,1,2,2)],\n    "C (bersih)": [],\n}\n\n# TULIS KODEMU\ndef skor_adverse(hits):\n    return\ndef keputusan(skor):\n    return\n\nfor nama, hits in kasus.items():\n    s = skor_adverse(hits)\n    print(f"{nama}: skor={s}  keputusan={keputusan(s)}")`,
        lockLines: 6,
        solution: `# temuan: (sumber_terpercaya 0/1, severity 1-3, relevance 1-3, recency 1-3)\nkasus = {\n    "A (PEP terkonfirmasi)": [(1,3,3,3),(1,2,3,2)],\n    "B (match lemah)": [(0,1,2,2)],\n    "C (bersih)": [],\n}\n\n# TULIS KODEMU\ndef skor_adverse(hits):\n    return sum(sev * rel * rec * (2 if trusted else 1) for trusted, sev, rel, rec in hits)\ndef keputusan(skor):\n    return "EDD" if skor >= 12 else "Pantau" if skor >= 4 else "Standar"\n\nfor nama, hits in kasus.items():\n    s = skor_adverse(hits)\n    print(f"{nama}: skor={s}  keputusan={keputusan(s)}")`,
        checks: [
          { kind: "defined", task: "t1", name: "skor_adverse", label: "`skor_adverse` terdefinisi", msg: "Buat fungsi skor_adverse(hits) yang menjumlahkan skor temuan." },
          { kind: "defined", task: "t1", name: "keputusan", label: "`keputusan` terdefinisi", msg: "Buat fungsi keputusan(skor) → EDD/Pantau/Standar." },
          { kind: "stdout_matches", task: "t2", pattern: "skor=78\\s+keputusan=EDD", label: "A: 78 → EDD", msg: "A = 54+24 = 78 ≥ 12 → EDD." },
          { kind: "stdout_matches", task: "t2", pattern: "skor=4\\s+keputusan=Pantau", label: "B: 4 → Pantau", msg: "B = 1*2*2*1 = 4 → Pantau (4-11)." },
          { kind: "stdout_matches", task: "t2", pattern: "skor=0\\s+keputusan=Standar", label: "C: 0 → Standar", msg: "Tanpa temuan = Standar." },
        ],
      },
      reference: "sum(...) dengan generator. Keputusan berantai seperti tier di AML2.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Adjudikasi",
      title: "True match atau bukan: putusan sebelum EDD",
      prose: [
        "Skor adverse media 74 memicu EDD — tetapi sebelum EDD ada langkah yang dilewatkan bank di cerita pembuka: adjudikasi. Adjudikasi = putusan resmi 'apakah temuan ini benar-benar tentang nasabah kita?' Tiga putusan: TRUE (identifier cocok ≥2), FALSE (terbukti beda orang), NEED-INFO (belum bisa diputus). 'H. Sulaeman' vs 'Haji Sulaiman' + foto cocok + tanggal lahir cocok = TRUE.",
        "Aturan identifier: nama saja TIDAK CUKUP. Bedakan 'terbukti beda' (FALSE: tanggal lahir beda 20 tahun) dari 'belum tahu' (NEED-INFO: nama pasaran tanpa identifier). Keduanya bukan TRUE, tetapi perlakuannya beda: FALSE → tutup + catat; NEED-INFO → cari identifier, pantau sementara. Mencampur keduanya = menutup kasus yang seharusnya dibuka.",
        "Setiap putusan didokumentasikan: siapa memutus, kapan, berdasarkan identifier apa. Analis berikutnya tidak mengulang kerja 3 jam; auditor melihat jejak keputusan. Adjudikasi tanpa dokumentasi = gosip yang tidak bisa diaudit.",
        "Lab memutus 4 kandidat: portal nasional (foto+tgl lahir cocok) → TRUE MATCH; blog anonim tanpa identifier → ABAIKAN; sengketa tanah dengan NIK cocok → TRUE MATCH; nama mirip tetapi tgl lahir beda 20 tahun → FALSE MATCH. Perhatikan: dua TRUE, satu FALSE, satu ABAIKAN — empat nasib berbeda dari empat 'berita buruk'.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `putuskan` dengan 4 putusan" },
        { id: "t2", text: "Jalankan dan pastikan putusan tercetak" },
      ],
      expected: "TRUE MATCH -> EDD | H. Sulaeman = Haji Sulaiman (foto+t\nABAIKAN -> pantau pasif | Blog: 'Sulaeman' gaya hidup mewah (\nTRUE MATCH -> EDD | Sengketa tanah, NIK cocok\nFALSE MATCH -> tutup + catat | Nama mirip, tgl lahir beda 20 thn",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Nama cocok = orangnya cocok.” Nama 'Sulaeman' dipakai ribuan orang. Tanpa minimal 2 identifier independen, 'cocok' hanyalah kebetulan ejaan. Adjudikasi yang malas = EDD untuk orang yang salah + orang yang benar lolos.",
      },
      hints: [
        "n_id >= 2 -> TRUE; n_id == 1 -> NEED-INFO/ FALSE.",
        "Dokumentasikan: siapa, kapan, identifier apa.",
      ],
      code: {
        starter: "# Kandidat temuan: (deskripsi, jumlah_identifier_cocok, sumber_kuat). JANGAN UBAH.\nkandidat = [\n    (\"H. Sulaeman = Haji Sulaiman (foto+tgl lahir cocok)\", 2, True),\n    (\"Blog: 'Sulaeman' gaya hidup mewah (tanpa identifier)\", 0, False),\n    (\"Sengketa tanah, NIK cocok\", 2, True),\n    (\"Nama mirip, tgl lahir beda 20 thn\", 1, False),\n]\n\n# TULIS KODEMU: putusan tiap kandidat\ndef putuskan(n_id, kuat):\n    return  # \"TRUE MATCH -> EDD\" / \"NEED-INFO -> verifikasi\" / \"FALSE MATCH -> tutup + catat\" / \"ABAIKAN -> pantau pasif\"\n\nfor nama, n_id, kuat in kandidat:\n    print(f\"{putuskan(n_id, kuat)} | {nama[:35]}\")",
        lockLines: 8,
        solution: "# Kandidat temuan: (deskripsi, jumlah_identifier_cocok, sumber_kuat). JANGAN UBAH.\nkandidat = [\n    (\"H. Sulaeman = Haji Sulaiman (foto+tgl lahir cocok)\", 2, True),\n    (\"Blog: 'Sulaeman' gaya hidup mewah (tanpa identifier)\", 0, False),\n    (\"Sengketa tanah, NIK cocok\", 2, True),\n    (\"Nama mirip, tgl lahir beda 20 thn\", 1, False),\n]\n\n# TULIS KODEMU: putusan tiap kandidat\ndef putuskan(n_id, kuat):\n    if n_id >= 2:\n        return \"TRUE MATCH -> EDD\"\n    if n_id == 1 and kuat:\n        return \"NEED-INFO -> verifikasi\"\n    if n_id == 1:\n        return \"FALSE MATCH -> tutup + catat\"\n    return \"ABAIKAN -> pantau pasif\"\n\nfor nama, n_id, kuat in kandidat:\n    print(f\"{putuskan(n_id, kuat)} | {nama[:35]}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "2 TRUE MATCH", msg: "Dua kandidat memenuhi ≥2 identifier.", pattern: "TRUE MATCH -> EDD" },
          { kind: "stdout_matches", task: "t2", label: "FALSE MATCH tertangkap", msg: "Tgl lahir beda 20 thn = terbukti beda.", pattern: "FALSE MATCH -> tutup \\+ catat" }
        ],
      },
      reference: "Adjudikasi: ≥2 identifier = TRUE; 1 = NEED-INFO/FALSE; 0 = abaikan.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Skor gabungan",
      title: "Tiga sinyal, satu putusan",
      prose: [
        "Lab pertama memutus true match dari satu sinyal. Praktik EDD memakai skor gabungan: kecocokan nama (bobot 50%), foto (30%), dokumen (20%). Bobot mencerminkan keandalan — nama bisa mirip kebetulan, tetapi foto + dokumen yang cocok jarang kebetulan. Ambang putusan 0,75 dikalibrasi dari data historis.",
        "Tiga kandidat di bawah menunjukkan cara kerja bobot: 'H. Sulaeman' lolos karena ketiga sinyal kuat; 'Sulaiman A.' gagal karena foto tidak cocok meski nama mirip; 'Budi Santoso' jelas bukan. Satu sinyal kuat tidak menyelamatkan dua sinyal lemah — itulah gunanya pembobotan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor = 0.5*nama + 0.3*foto + 0.2*dokumen" },
        { id: "t2", text: "Jalankan dan pastikan putusan tercetak" },
      ],
      expected: "H. Sulaeman: skor 0.97 -> TRUE MATCH -> EDD\nSulaiman A.: skor 0.55 -> BUKAN -> lepas\nBudi Santoso: skor 0.20 -> BUKAN -> lepas",
      note: {
        title: "Bobot bukan demokrasi.",
        type: "pitfall",
        body: "“Dua dari tiga sinyal cocok, jadi lolos.” Skor gabungan bukan voting — sinyal tanpa bobot menyesatkan. Nama mirip + dokumen cocok tetapi foto beda orang = kemungkinan besar kebetulan nama, bukan true match.",
      },
      hints: [
        "skor = 0.5*s_nama + 0.3*s_foto + 0.2*s_dok.",
        "Putusan: skor >= 0.75 berarti TRUE MATCH.",
      ],
      code: {
        starter: "# Kandidat: (nama, cocok_nama, cocok_foto, cocok_dokumen). JANGAN UBAH.\nkandidat = [\n    (\"H. Sulaeman\", 0.95, 1, 1),\n    (\"Sulaiman A.\", 0.70, 0, 1),\n    (\"Budi Santoso\", 0.40, 0, 0),\n]\n\n# TULIS KODEMU: skor gabungan + putusan\nfor nama, s_nama, s_foto, s_dok in kandidat:\n    skor = \n    putusan = \"TRUE MATCH -> EDD\" if skor >= 0.75 else \"BUKAN -> lepas\"\n    print(f\"{nama}: skor {skor:.2f} -> {putusan}\")",
        lockLines: 4,
        solution: "# Kandidat: (nama, cocok_nama, cocok_foto, cocok_dokumen). JANGAN UBAH.\nkandidat = [\n    (\"H. Sulaeman\", 0.95, 1, 1),\n    (\"Sulaiman A.\", 0.70, 0, 1),\n    (\"Budi Santoso\", 0.40, 0, 0),\n]\n\n# TULIS KODEMU: skor gabungan + putusan\nfor nama, s_nama, s_foto, s_dok in kandidat:\n    skor = 0.5*s_nama + 0.3*s_foto + 0.2*s_dok\n    putusan = \"TRUE MATCH -> EDD\" if skor >= 0.75 else \"BUKAN -> lepas\"\n    print(f\"{nama}: skor {skor:.2f} -> {putusan}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Putusan tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "H\. Sulaeman: skor 0\.97 -\> TRUE MATCH -\> EDD" },
          { kind: "stdout_matches", task: "t2", label: "Tiga kandidat dinilai", msg: "Harus ada 3 baris putusan.", pattern: "Budi Santoso" }
        ],
      },
      reference: "Skor = 0.5·nama + 0.3·foto + 0.2·dokumen; ≥ 0,75 = TRUE MATCH. Satu sinyal kuat tidak menutupi dua yang lemah.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat temuan, empat eskalasi",
      prose: [
        "Satu: PEP domestik (pejabat daerah), transaksi normal, sumber dana jelas → EDD + pantau: gali sumber kekayaan, tetapkan limit wajar, review 6 bulanan. Jangan hukum orang karena jabatannya.",
        "Dua: adverse media terkonfirmasi — dua sumber independen memberitakan korupsi dengan identifier cocok → eskalasi ke komite: pertimbangkan exit + SAR. Di titik ini \"pantau\" sudah tidak cukup; setiap hari rekening berjalan = risiko reputasi berjalan.",
        "Tiga: name match lemah — satu blog, nama pasaran, tanpa foto/NIK/tanggal lahir yang cocok → catat + pantau: skor 4, bukan 78. Adjudikasi (penentuan true/false match) didokumentasikan agar analis berikutnya tidak mengulang kerja.",
        "Empat: PEP asing dari yurisdiksi grey-list FATF + struktur berlapis → EDD mendalam + persetujuan komite sebelum hubungan dilanjutkan: sumber dana diverifikasi ke dokumen, bukan sekadar klaim. Kombinasi dua trigger = bukan jumlah, melainkan perkalian risiko.",
        "Aturan praktis 10 detik: dua sumber independen = SINYAL KUAT untuk EDD (bukan definisi EDD \u2014 EDD adalah pendalaman uji tuntas yang dipicu risiko, dan dua sumber independen adalah salah satu pemicunya). Identifier cocok (NIK/foto/tgl lahir) = naik satu tangga. Satu sumber anonim = catat, jangan panik.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Adjudikasi match adalah pekerjaan yang paling tidak glamor dan paling menyelamatkan: 90% \"temuan\" screening adalah false match (nama sama, orang beda). Analis yang rajin mendokumentasikan \"ini false match karena tanggal lahir beda 20 tahun\" menghemat ratusan jam timnya di masa depan.",
      },
      reference: "Dokumentasikan tiap adjudikasi: match/false + alasannya. Itu memori institusi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Skor berita \"H. S.\" versi lengkap",
      prose: [
        "Tiga temuan tentang H. Sulaeman. Temuan 1: portal nasional terpercaya, tuduhan korupsi proyek (severity 3), nama+foto cocok (relevance 3), terbit 4 bulan lalu (recency 3) → 3×3×3×2 = 54. Temuan 2: blog anonim, tuduhan \"gaya hidup mewah\" (severity 1), nama saja tanpa identifier (relevance 1), 2 tahun lalu (recency 2) → 1×1×2×1 = 2. Temuan 3: media daerah terpercaya, sengketa tanah (severity 1, bukan finansial), identifier cocok (relevance 3), 6 bulan lalu (recency 3) → 1×3×3×2 = 18. Total: 54+2+18 = 74.",
        "Pertanyaan: (a) Keputusan untuk skor 74? (b) Temuan mana yang paling menentukan, dan kenapa temuan 2 hampir tidak berarti? (c) Apa yang seharusnya terjadi di onboarding 14 bulan lalu?",
        "Pembahasan: (a) 74 ≥ 12 → EDD segera + eskalasi komite (temuan 1 saja sudah 54, sangat berat). (b) Temuan 1: sumber terpercaya × tuduhan korupsi × identifier cocok × baru. Temuan 2 = gosip: sumber anonim + tuduhan ringan + tak ada identifier = 2, nyaris noise. (c) Screening onboarding harusnya fuzzy-match (\"Sulaeman\" vs \"Sulaiman\") dan EDD ringan saat setoran Rp2-5 miliar/bulan tidak konsisten dengan profil \"wiraswasta\" — trigger kompleksitas sudah berbunyi sejak bulan ke-3.",
      ],
      tasks: [],
      reference: "Satu temuan kuat > sepuluh gosip. Kualitas sumber mengalahkan kuantitas berita.",
    },
        {
          id: "gap-r8-siklus-sar-str",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G19)",
          title: "Dari alert ke laporan: siklus SAR/STR dan larangan tipping-off",
          prose: [
            "Lesson ini berhenti di 'exit + SAR' — tetapi tidak menjelaskan JALANNYA dari alert menjadi laporan, dan jalan itu punya aturan yang bila dilanggar justru menciptakan masalah hukum baru. Siklusnya lima tahap. Satu, ALERT & TRIAGE: alert sistem (skor adverse ≥ 12, transaksi aneh) ditinjau analis — kebanyakan alert ditutup sebagai false positive dengan alasan tertulis. Dua, INVESTIGASI: analis mengumpulkan bukti (transaksi, dokumen, adverse media) — tanpa menghubungi nasabah untuk 'klarifikasi' soal kecurigaan (lihat tahap lima). Tiga, ESKALASI INTERNAL: kasus yang tidak bisa ditutup naik ke MLRO (Money Laundering Reporting Officer) atau komite — analis TIDAK memutuskan sendiri apakah ini dilaporkan. Empat, KEPUTUSAN & PELAPORAN: bila MLRO menilai ada indikasi yang cukup, bank menyampaikan Laporan Transaksi Keuangan Mencurigakan (LTKM/STR) ke PPATK dalam tenggat yang ditetapkan regulator — dan hubungan dengan nasabah bisa dilanjutkan dengan pantau, dibatasi, atau diakhiri (exit) sesuai keputusan komite. Lima, PASCA-LAPORAN: pantau terus, jangan beri tahu nasabah.",
            "Larangan TIPPING-OFF adalah aturan yang paling sering dilanggar secara tidak sengaja: bank DILARANG memberi tahu nasabah (atau pihak yang bisa memberi tahu nasabah) bahwa ia sedang diselidiki atau telah dilaporkan. Bentuknya bisa halus — 'permohonan Bapak sedang kami tinjau oleh tim kepatuhan' yang diucapkan kepada nasabah yang tepat — tetapi akibatnya fatal: nasabah memindahkan dana sebelum laporan diproses. Yang BOLEH dikatakan hanyalah penolakan/layanan yang netral ('kami tidak dapat memproses transaksi ini') tanpa alasan yang membocorkan penyelidikan.",
            "DOKUMENTASI KEPUTUSAN adalah yang membedakan bank yang patuh dari bank yang hanya beruntung: setiap keputusan — termasuk keputusan TIDAK melaporkan — didokumentasikan (siapa memutus, kapan, atas bukti apa, dengan alasan apa) dan disimpan untuk audit/regulator. Kasus H. Sulaeman lesson ini: 14 bulan tanpa dokumentasi yang memadai berarti bank tidak bisa membuktikan apa yang ia ketahui dan kapan — dan itu, di mata regulator, sama buruknya dengan tidak tahu.",
          ],
          tasks: [],
          note: {
            title: "Sering salah",
            body: "Memberi tahu nasabah 'rekening Bapak sedang kami laporkan' — atau menanyakan 'klarifikasi' soal transaksi yang dicurigai kepada nasabahnya sendiri. Keduanya adalah tipping-off: penyelidikan bocor, dana dipindah, laporan menjadi sia-sia.",
          },
          quiz: [
            {
              q: "Analis yakin sebuah transaksi mencurigakan. Urutan yang benar?",
              options: [
                { text: "Investigasi internal → eskalasi ke MLRO/komite → MLRO memutuskan pelaporan ke PPATK → dokumentasikan", why: "Tepat: analis tidak memutuskan pelaporan sendiri; MLRO/komite yang memutuskan; semua keputusan didokumentasikan.", correct: true },
                { text: "Tanya nasabah dulu untuk klarifikasi, baru laporkan bila jawabannya tidak meyakinkan", why: "Salah: menanyakan hal yang dicurigai kepada nasabah adalah tipping-off — dana bisa dipindah sebelum laporan diproses." },
                { text: "Laporkan langsung ke PPATK tanpa eskalasi internal", why: "Salah: pelaporan diputuskan MLRO/komite setelah investigasi — analis yang melompatinya menghilangkan kontrol kualitas." },
                { text: "Tutup rekeningnya dulu, laporkan belakangan bila sempat", why: "Salah: exit tanpa keputusan komite + dokumentasi menciptakan risiko hukum dan menghilangkan jejak audit." },
              ],
            },
          ],
          reference: "Siklus: alert → investigasi → eskalasi MLRO/komite → LTKM/STR ke PPATK → pantau. Tipping-off dilarang; setiap keputusan (termasuk tidak melapor) didokumentasikan.",
        },
        {
          id: "gap-r8-beneficial-owner",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G20)",
          title: "Beneficial owner: siapa yang benar-benar memiliki perusahaan ini?",
          prose: [
            "Lesson ini menyebut beneficial owner (BO) sebagai objek EDD — tetapi tidak memberi checklist BAGAIMANA memverifikasinya. BO = orang yang AKHIRNYA memiliki atau mengendalikan nasabah korporasi — bukan direktur di atas kertas, bukan pemegang saham perantara. Ambang yang umum dipakai (periksa ketentuan yang berlaku): kepemilikan langsung maupun tidak langsung ≥ 25%. Lab ini menghitungnya lewat rantai: Sulaeman memiliki 60% PT A, PT A memiliki 50% PT B (nasabah) → kepemilikan tidak langsung Sulaeman di PT B = 60% × 50% = 30% ≥ 25% → ia BO. Rantai kedua: 40% × 40% = 16% < 25% → BUKAN BO lewat rantai itu (tetapi tetap periksa kendali lain — lihat di bawah).",
            "Checklist verifikasi BO — empat lapis. Satu, DOKUMEN: akta pendirian + perubahan, struktur kepemilikan yang ditandatangani, KTP/paspor BO, dan dokumen pendukung (NPWP, bukti alamat). Dua, HIERARKI VERIFIKASI: cocokkan dokumen nasabah dengan sumber INDEPENDEN — registry perusahaan (AHU/Kemenkumham), database komersial, dan adverse media atas nama BO (bukan hanya nama perusahaan). Tiga, SUMBER KEKAYAAN vs SUMBER DANA — dua hal yang berbeda: sumber kekayaan = DARI MANA kekayaan BO berasal secara keseluruhan (warisan? bisnis? gaji? — butuh bukti: laporan pajak, penjualan aset); sumber dana = dari mana dana UNTUK TRANSAKSI INI berasal (rekening mana? — butuh bukti: mutasi rekening). Nasabah yang sumber dananya jelas tetapi sumber kekayaannya tidak bisa dijelaskan tetap bermasalah. Empat, DOKUMEN TIDAK KONSISTEN: nama berbeda antar-dokumen, alamat tidak cocok, struktur berlapis tanpa alasan bisnis → status NEED-INFO (seperti adjudikasi lesson ini): tunda onboarding, minta dokumen tambahan, eskalasi — JANGAN 'terima dulu, verifikasi belakangan'.",
            "Kasus H. Sulaeman adalah pelajaran BO yang sempurna: '3 perusahaan perantara' adalah struktur berlapis yang menyembunyikan BO — dan bank yang hanya memeriksa perusahaan perantara (bukan menembus ke orang akhirnya) akan selalu 'tidak menemukan apa-apa'.",
          ],
          formula: String.raw`\text{kepemilikan tidak langsung} = \prod \text{kepemilikan tiap lapis} \qquad \ge 25\% \Rightarrow \text{BO}`,
          formulaNote: "Rantai A: 60% × 50% = 30% ≥ 25% → BO. Rantai B: 40% × 40% = 16% < 25% → bukan BO lewat rantai itu.",
          tasks: [
            { id: "t1", text: "Hitung `bo_a` = kepemilikan tidak langsung rantai A (60% × 50%) dan `is_bo_a` (True bila ≥ 25%)" },
            { id: "t2", text: "Hitung `bo_b` = kepemilikan tidak langsung rantai B (40% × 40%) dan `is_bo_b` (True bila ≥ 25%)" },
          ],
          expected: "bo_a=30.0 is_bo_a=True bo_b=16.0 is_bo_b=False",
          hints: [
            "Kalikan kepemilikan tiap lapis, dalam persen.",
            "Ambang BO yang umum: 25% (periksa ketentuan yang berlaku).",
          ],
          code: {
            starter: `# rantai A: Sulaeman 60% PT A, PT A 50% PT B (nasabah)\n# rantai B: 40% x 40%\n\n# TULIS KODEMU: kepemilikan tidak langsung (%) + status BO (ambang 25%)\nbo_a =\nis_bo_a =\nbo_b =\nis_bo_b =\n\nprint(f"bo_a={bo_a} is_bo_a={is_bo_a} bo_b={bo_b} is_bo_b={is_bo_b}")`,
            lockLines: 4,
            solution: `# rantai A: Sulaeman 60% PT A, PT A 50% PT B (nasabah)\n# rantai B: 40% x 40%\n\n# TULIS KODEMU: kepemilikan tidak langsung (%) + status BO (ambang 25%)\nbo_a = 60 * 50 / 100\nis_bo_a = bo_a >= 25\nbo_b = 40 * 40 / 100\nis_bo_b = bo_b >= 25\n\nprint(f"bo_a={bo_a} is_bo_a={is_bo_a} bo_b={bo_b} is_bo_b={is_bo_b}")`,
            checks: [
              { kind: "equal", task: "t1", name: "bo_a", value: 30.0, tol: 0.01, label: "`bo_a` = 30%", msg: "60% × 50% = 30% — di atas ambang 25%." },
              { kind: "equal", task: "t2", name: "bo_b", value: 16.0, tol: 0.01, label: "`bo_b` = 16%", msg: "40% × 40% = 16% — di bawah ambang 25% lewat rantai ini." },
              { kind: "stdout_matches", task: "t1", pattern: "bo_a=30\\.0\\s+is_bo_a=True\\s+bo_b=16\\.0\\s+is_bo_b=False", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Dokumen BO nasabah tidak konsisten (nama berbeda antar-dokumen, struktur berlapis tanpa alasan bisnis). Tindakan yang benar?",
              options: [
                { text: "NEED-INFO: tunda onboarding, minta dokumen tambahan, eskalasi", why: "Tepat: dokumen tidak konsisten bukan 'diterima dengan catatan' — ia alasan menunda sampai BO terverifikasi independen.", correct: true },
                { text: "Terima dulu, verifikasi belakangan", why: "Salah: setelah rekening aktif, dana sudah bisa bergerak — verifikasi belakangan berarti menutup pintu setelah kuda keluar." },
                { text: "Tolak langsung tanpa penjelasan", why: "Salah: dokumen tidak konsisten = butuh informasi lebih lanjut, bukan vonis — tolak tanpa proses menghilangkan nasabah yang sah." },
                { text: "Minta nasabah menjelaskan sendiri sumber kekayaannya secara lisan", why: "Salah: sumber kekayaan butuh BUKTI (pajak, penjualan aset) dari sumber independen — klaim lisan bukan verifikasi." },
              ],
            },
          ],
          reference: "BO = orang akhir yang memiliki/mengendalikan (ambang umum 25%, langsung+tidak langsung). Verifikasi: dokumen + sumber independen + sumber kekayaan vs sumber dana.",
        },
        {
          id: "gap-r8-kalibrasi-threshold-aml",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G21)",
          title: "Kalibrasi threshold AML: murah, mahal, dan yang tidak muat di tim",
          prose: [
            "Lesson ini memberi banyak ambang — skor adverse ≥ 12 → EDD, skor hold 0,5–0,9 — tetapi tidak pernah menunjukkan BAGAIMANA ambang itu dipilih dan kapan ia harus diubah. Ambang bukan angka sakral: ia pilihan ekonomi yang bisa (dan harus) dihitung. Ambil 200 kasus pencucian uang sejati per bulan yang harus ditemukan. Tiga ambang skor adverse: ambang 8 → 2.500 alert, 150 kasus tertangkap (presisi 6,0%); ambang 12 → 1.000 alert, 120 tertangkap (presisi 12,0%); ambang 20 → 400 alert, 100 tertangkap (presisi 25,0%). Biaya: review Rp50 ribu per alert; kasus yang lolos Rp5 juta per kasus (denda, kerugian, reputasi). Total biaya: ambang 8 = 2.500×0,05 + 50×5 = Rp375 juta; ambang 12 = 1.000×0,05 + 80×5 = Rp450 juta; ambang 20 = 400×0,05 + 100×5 = Rp520 juta.",
            "Bila hanya membaca biaya, ambang 8 'menang' — tetapi ia TIDAK MUAT: tim hanya mampu me-review 1.200 alert per bulan, dan ambang 8 menghasilkan 2.500. Ambang yang biayanya paling murah tetapi melebihi kapasitas tim adalah ambang yang alert-nya menumpuk tidak dibaca — sama dengan tidak ada ambang. Maka ambang 12 yang dipilih: termurah DI ANTARA yang layak (1.000 ≤ 1.200), dengan presisi 12% dan 80 kasus lolos. Inilah kalibrasi yang jujur: biaya total + kapasitas review + presisi — ketiganya, bukan salah satu.",
            "VALIDASI threshold berarti mengulang perhitungan ini BERKALA (kuartalan, atau saat distribusi skor bergeser — drift!): hitung ulang presisi, biaya, dan kapasitas dari data TERBARU, dan setiap perubahan ambang wajib DISETUJUI (komite/MLRO) + DIDOKUMENTASIKAN (ambang lama, ambang baru, alasan, tanggal, penanggung jawab). Ambang yang diubah diam-diam oleh satu analis adalah ambang yang tidak bisa dipertahankan di depan regulator — dan ambang yang tidak pernah divalidasi ulang adalah ambang untuk populasi yang sudah tidak ada.",
          ],
          formula: String.raw`\text{biaya total} = \text{alert} \times \text{biaya review} + \text{kasus lolos} \times \text{biaya kasus} \qquad \text{alert} \le \text{kapasitas tim}`,
          formulaNote: "200 kasus/bulan; review Rp0,05 jt; kasus lolos Rp5 jt; kapasitas 1.200 alert/bln. Ambang 8: Rp375 jt (tidak muat); 12: Rp450 jt (dipilih); 20: Rp520 jt.",
          tasks: [
            { id: "t1", text: "Hitung presisi (%) tiap ambang: `prec8`, `prec12`, `prec20` (1 desimal)" },
            { id: "t2", text: "Hitung biaya total (Rp juta): `cost8`, `cost12`, `cost20`, dan `pilihan` (ambang termurah yang muat kapasitas 1.200)" },
          ],
          expected: "prec8=6.0 prec12=12.0 prec20=25.0 cost8=375.0 cost12=450.0 cost20=520.0 pilihan=12",
          hints: [
            "Presisi = kasus tertangkap / alert × 100%.",
            "Biaya = alert × 0,05 + (200 − tertangkap) × 5 (Rp juta).",
            "Pilihan = ambang termurah dengan alert ≤ 1.200.",
          ],
          code: {
            starter: `# (alert, tertangkap) per ambang; 200 kasus sejati/bulan; kapasitas 1200 alert/bln\nambang = {8: (2500, 150), 12: (1000, 120), 20: (400, 100)}\n\n# TULIS KODEMU: presisi + biaya total + pilihan ambang\nprec8 =\nprec12 =\nprec20 =\ncost8 =\ncost12 =\ncost20 =\npilihan =\n\nprint(f"prec8={prec8} prec12={prec12} prec20={prec20} cost8={cost8} cost12={cost12} cost20={cost20} pilihan={pilihan}")`,
            lockLines: 4,
            solution: `# (alert, tertangkap) per ambang; 200 kasus sejati/bulan; kapasitas 1200 alert/bln\nambang = {8: (2500, 150), 12: (1000, 120), 20: (400, 100)}\n\n# TULIS KODEMU: presisi + biaya total + pilihan ambang\ndef presisi(a):\n    return round(a[1] / a[0] * 100, 1)\ndef biaya(a):\n    return a[0] * 0.05 + (200 - a[1]) * 5\nprec8, prec12, prec20 = presisi(ambang[8]), presisi(ambang[12]), presisi(ambang[20])\ncost8, cost12, cost20 = biaya(ambang[8]), biaya(ambang[12]), biaya(ambang[20])\npilihan = min([t for t, a in ambang.items() if a[0] <= 1200], key=lambda t: biaya(ambang[t]))\n\nprint(f"prec8={prec8} prec12={prec12} prec20={prec20} cost8={cost8} cost12={cost12} cost20={cost20} pilihan={pilihan}")`,
            checks: [
              { kind: "equal", task: "t1", name: "prec8", value: 6.0, tol: 0.1, label: "`prec8` = 6,0%", msg: "150/2500 = 6,0%." },
              { kind: "equal", task: "t1", name: "prec12", value: 12.0, tol: 0.1, label: "`prec12` = 12,0%", msg: "120/1000 = 12,0%." },
              { kind: "equal", task: "t1", name: "prec20", value: 25.0, tol: 0.1, label: "`prec20` = 25,0%", msg: "100/400 = 25,0%." },
              { kind: "equal", task: "t2", name: "cost8", value: 375.0, tol: 0.5, label: "`cost8` = 375", msg: "2500×0,05 + 50×5 = 375." },
              { kind: "equal", task: "t2", name: "cost12", value: 450.0, tol: 0.5, label: "`cost12` = 450", msg: "1000×0,05 + 80×5 = 450." },
              { kind: "equal", task: "t2", name: "cost20", value: 520.0, tol: 0.5, label: "`cost20` = 520", msg: "400×0,05 + 100×5 = 520." },
              { kind: "equal", task: "t2", name: "pilihan", value: 12, tol: 0.01, label: "`pilihan` = 12", msg: "Ambang 8 termurah tetapi 2.500 alert > kapasitas 1.200 — tidak layak. Ambang 12 termurah di antara yang layak." },
              { kind: "stdout_matches", task: "t2", pattern: "prec8=6\\.0\\s+prec12=12\\.0\\s+prec20=25\\.0\\s+cost8=375\\.0\\s+cost12=450\\.0\\s+cost20=520\\.0\\s+pilihan=12", label: "`print` menampilkan ketujuhnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Ambang 8 biayanya paling murah (Rp375 jt) tetapi menghasilkan 2.500 alert/bulan; kapasitas tim 1.200. Keputusan?",
              options: [
                { text: "Pilih ambang 12 (Rp450 jt) — termurah di antara yang muat kapasitas", why: "Tepat: ambang yang melebihi kapasitas menghasilkan alert yang tidak dibaca — sama dengan tidak ada ambang.", correct: true },
                { text: "Tetap ambang 8 — biaya total yang paling kecil", why: "Salah: biaya total mengasumsikan SEMUA alert di-review. 1.300 alert yang tidak dibaca berarti kasus lolos yang tidak terhitung." },
                { text: "Pilih ambang 20 — presisinya tertinggi (25%)", why: "Salah: presisi tertinggi bukan tujuan — biaya totalnya tertinggi (Rp520 jt) dengan 100 kasus lolos." },
                { text: "Naikkan kapasitas tim menjadi 2.500 tanpa menghitung biayanya", why: "Salah: menambah kapasitas juga berbiaya — keputusan ambang dan kapasitas dihitung BERSAMA, bukan sepihak." },
              ],
            },
          ],
          reference: "Kalibrasi threshold = biaya total + kapasitas review + presisi; validasi berkala; perubahan ambang disetujui komite/MLRO + didokumentasikan.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan.",
      ],
      tasks: [],
      summary: [
        "Trigger EDD: PEP, adverse media, kompleksitas tanpa alasan bisnis, yurisdiksi berisiko.",
        "PEP = risk-based, bukan blacklist; mencakup keluarga & kolega dekat.",
        "Skor adverse = s × r × t × m; ambang EDD ≥12, pantau 4-11.",
        "Satu sumber = rumor; dua independen = sinyal; putusan pengadilan = fakta.",
        "Eskalasi proporsional: EDD → enhanced monitoring → exit + SAR, tiap naik butuh bukti.",
      ],
      next: { label: "AML4 — Sanctions & Name Screening", href: "/v2/learn/aml4-sanctions" },
      quiz: [
        {
          q: "Mana yang BUKAN trigger EDD?",
          options: [
            { text: "Nasabah adalah keponakan pejabat publik", why: "Ini PEP by association — trigger klasik." },
            { text: "Berita korupsi menyeret nama BO dari dua media independen", why: "Adverse media terkonfirmasi — trigger." },
            { text: "Karyawan swasta, gaji bulanan, transaksi konsisten 3 tahun", why: "Profil normal tanpa anomali = tidak ada trigger. EDD butuh alasan.", correct: true },
            { text: "Perusahaan 3 lapis di yurisdiksi grey-list tanpa alasan bisnis jelas", why: "Kompleksitas + yurisdiksi = trigger ganda." },
          ],
        },
        {
          q: "Satu temuan: media terpercaya, tuduhan korupsi (3), identifier cocok (3), 2 bulan lalu (3). Skor dan keputusan?",
          options: [
            { text: "27 → Pantau", why: "Lupa multiplier sumber terpercaya: 3×3×3×2 = 54, bukan 27." },
            { text: "54 → EDD", why: "3×3×3×2 = 54 ≥ 12. Satu temuan sekuat ini langsung EDD.", correct: true },
            { text: "18 → EDD", why: "Salah hitung; yang benar 54." },
            { text: "9 → Standar", why: "Skor jauh lebih besar dari 9 — cek lagi perkaliannya." },
          ],
        },
        {
          q: "Kenapa keluarga dan kolega dekat PEP ikut di-screening?",
          options: [
            { text: "Agar database lebih besar", why: "Bukan soal ukuran database." },
            { text: "Karena hasil korupsi sering dicuci lewat orang dekat — memblokir hanya PEP-nya = pintu belakang terbuka", why: "Kasus H. S.: keponakan, bukan pejabatnya. Jaringan, bukan individu.", correct: true },
            { text: "Karena mereka pasti bersalah", why: "Tidak — mereka berisiko lebih tinggi, bukan pasti bersalah." },
            { text: "Tidak perlu, hanya PEP-nya saja", why: "Itulah yang membuat screening H. S. gagal total." },
          ],
        },
        {
          q: "Lima portal mengutip satu siaran pers yang sama tentang nasabah. Berapa sumber independen?",
          options: [
            { text: "Lima", why: "Lima gema dari satu suara = satu sumber. Analis junior menghitung gema." },
            { text: "Satu", why: "Sumber independen = investigasi/konfirmasi sendiri, bukan kutipan berantai.", correct: true },
            { text: "Nol — siaran pers tidak dihitung", why: "Siaran pers resmi tetap satu sumber, bukan nol." },
            { text: "Tergantung jumlah pembaca", why: "Kredibilitas tidak dihitung dari traffic." },
          ],
        },
        {
          q: "Adverse media terbukti tentang sengketa perdata warisan 5 tahun lalu, skor total 6. Keputusan?",
          options: [
            { text: "Exit + SAR segera", why: "Sengketa perdata lama bukan kejahatan finansial; skor 6 = pantau, bukan exit." },
            { text: "Pantau + catat adjudikasi; bukan EDD karena di bawah ambang dan bukan predikat kriminal", why: "Skor 6 masuk 4-11 = pantau. Sengketa warisan ≠ korupsi. Proporsional.", correct: true },
            { text: "Abaikan total", why: "Diabaikan tanpa catatan = analis berikutnya mengulang kerja dari nol." },
            { text: "EDD penuh karena ada berita negatif", why: "Berita negatif saja tidak cukup — skor dan jenis perkaranya yang menentukan." },
          ],
        },
      ],
    },
  ],
};
