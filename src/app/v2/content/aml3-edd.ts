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
  estMinutes: 50,
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
