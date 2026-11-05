import type { V2Lesson } from "../lib/types";

// ── Figure: skor kesiapan per domain ─────────────────────────────────────
const READY_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Diagram batang skor kesiapan per domain sertifikasi">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="170" y1="20" x2="170" y2="230"/><line x1="170" y1="230" x2="540" y2="230"/>
<line x1="244" y1="20" x2="244" y2="230"/><line x1="318" y1="20" x2="318" y2="230"/>
<line x1="392" y1="20" x2="392" y2="230"/><line x1="466" y1="20" x2="466" y2="230"/>
</g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)">
<text x="170" y="244" text-anchor="middle">1</text><text x="244" y="244" text-anchor="middle">2</text>
<text x="318" y="244" text-anchor="middle">3</text><text x="392" y="244" text-anchor="middle">4</text>
<text x="466" y="244" text-anchor="middle">5</text><text x="540" y="244" text-anchor="middle">skor</text>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)">
<text x="164" y="40" text-anchor="end">Tata Kelola</text>
<text x="164" y="70" text-anchor="end">Kualitas Data</text>
<text x="164" y="100" text-anchor="end">Metadata &amp; Katalog</text>
<text x="164" y="130" text-anchor="end">Data Induk &amp; Ref</text>
<text x="164" y="160" text-anchor="end">Arsitektur &amp; Integrasi</text>
<text x="164" y="190" text-anchor="end">Keamanan &amp; Privasi</text>
<text x="164" y="220" text-anchor="end">Siklus Hidup</text>
</g>
<g>
<rect x="170" y="30" width="222" height="16" fill="var(--c2)" opacity="0.9"/>
<rect x="170" y="60" width="296" height="16" fill="var(--c2)" opacity="0.9"/>
<rect x="170" y="90" width="148" height="16" fill="var(--c3)" opacity="0.9"/>
<rect x="170" y="120" width="222" height="16" fill="var(--c2)" opacity="0.9"/>
<rect x="170" y="150" width="222" height="16" fill="var(--c2)" opacity="0.9"/>
<rect x="170" y="180" width="296" height="16" fill="var(--c2)" opacity="0.9"/>
<rect x="170" y="210" width="148" height="16" fill="var(--c3)" opacity="0.9"/>
<line x1="318" y1="24" x2="318" y2="230" stroke="var(--text)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="322" y="30" font-size="10" fill="var(--text)" font-family="var(--font-ui)">ambang siap (3,0)</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="170" y="264">skor kesiapan per domain 1-5 (ilustrasi; merah = di bawah ambang, prioritas belajar)</text>
</g>
</svg>`;

export const dm26: V2Lesson = {
  slug: "dm26-sertifikasi-regulasi-2026",
  track: "Data Management",
  module: "Tata Kelola",
  title: "Sertifikasi CDMP/DCAM & Regulasi Data 2026",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sertifikat yang tidak ditanya — sampai ditanya",
      prose: [
        "Rian, data analyst lima tahun pengalaman, selalu mengabaikan sertifikasi: “portofolio dan pengalaman lebih penting dari kertas”. Lalu sebuah bank membuka posisi Senior Data Governance — dan di lowongannya tertulis eksplisit: “CDMP atau DCAM certification preferred”. Ia tetap melamar dengan CV kuat. Lolos screening, masuk interview — dan 40 menit pertama interview dihabiskan membahas peta DAMA-DMBOK: “jelaskan hubungan metadata management dengan data quality di kasus kami”. Twist-nya: sertifikatnya tidak pernah ditanya — tidak ada yang meminta melihat kertasnya. Yang ditanya adalah isi kepalanya yang terbentuk KARENA ia belajar untuk sertifikasi itu. Sertifikasi bukan tiket masuk; ia kurikulum yang memaksa.",
        "Inilah cara yang jujur memandang sertifikasi data management: nilainya bukan di badge LinkedIn, melainkan di peta pengetahuan yang ia paksa kamu kuasai — 14 area DMBOK untuk CDMP, 8 komponen kapabilitas untuk DCAM. Di pasar 2025–2026, keduanya makin sering muncul di lowongan senior, terutama perbankan dan enterprise teregulasi.",
        "Di lesson ini kamu belajar peta CDMP dan DCAM apa adanya (bobot, format ujian, strategi belajar yang jujur) — plus penyegaran regulasi yang wajib diketahui praktisi Indonesia 2026: GR 33/2026 sebagai aturan turunan UU PDP, dan fakta bahwa lembaga pengawasnya belum terbentuk.",
      ],
      tasks: [],
      note: {
        title: "Batasan kejujuran lesson ini",
        type: "risk",
        body: "Angka-angka sertifikasi (biaya, durasi, passing grade) dikutip dari sumber publik per 2026 dan bisa berubah — selalu cek situs resmi DAMA International dan EDM Council sebelum mendaftar. Lesson ini bukan nasihat karier final; ia peta agar kamu bisa memutuskan sendiri.",
      },
      reference: "Sertifikasi = kurikulum yang memaksa, bukan tiket masuk.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan estimasi waktu",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan struktur CDMP (14 area DMBOK berbobot, format ujian, level Associate/Practitioner/Master) dan kapan ia relevan; (2) menjelaskan 8 komponen DCAM v3 dan perannya sebagai model penilaian kapabilitas organisasi; (3) menjelaskan posisi GR 33/2026 dalam kerangka UU PDP 27/2022 dan implikasi praktisnya; (4) menghitung skor kesiapan sertifikasimu per domain dan menyusun rencana belajar berbasis gap.",
        "Rutenya: cerita → tiga konsep inti (CDMP; DCAM; regulasi 2026) → lab Python (self-assessment skor kesiapan + rencana belajar) → chart kesiapan → peta keputusan → mini-case → kuis → rangkuman. Estimasi 60 menit; lab-nya ±12 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: CDMP menguji orangnya (pengetahuan individu), DCAM menilai organisasinya (kapabilitas perusahaan). Karier individu → CDMP; membangun program governance → DCAM.",
      ],
      reference: "Tujuan: paham peta CDMP & DCAM, paham regulasi 2026, bisa menilai kesiapan diri sendiri.",
    },
    {
      id: "konsep-cdmp",
      eyebrow: "Langkah 3 · Konsep",
      title: "CDMP — Si Ujian 14 Babak",
      prose: [
        "Definisi: CDMP (Certified Data Management Professional) adalah sertifikasi individu dari DAMA International, berbasis DAMA-DMBOK2 (Data Management Body of Knowledge). Ujian fondasi (Data Management Fundamentals): 100 soal pilihan ganda, 90 menit (+20 menit untuk yang bahasa Inggrisnya bukan bahasa ibu), ujian online open-book dengan proctoring. Kelulusan: 60% untuk Associate, 70% untuk Practitioner, 80% untuk Master — level lanjutan butuh dua ujian spesialis tambahan plus pengalaman kerja yang dibuktikan. Sertifikat berlaku 3 tahun.",
        "Kepribadiannya: CDMP seperti ujian SIM untuk data management — ia tidak menguji kamu bisa “menyetir” (pengalaman tetap raja), tetapi memastikan kamu tahu rambu-rambunya. Bobot 14 areanya memberi tahu prioritas belajar: Data Governance 11%, Data Quality 11%, Metadata Management 11%, Data Modelling & Design 11% — empat ini saja sudah 44% soal. Master & Reference Data 10%, Data Warehousing & BI 10%. Sisanya: arsitektur, integrasi, keamanan, storage/operasi, dokumen & konten (masing-masing 6%), plus proses, etika, dan big data (2% tiap-tiganya).",
        "Kapan memakai: ketika kamu membidik role governance/kualitas/arsitektur data di enterprise — terutama perbankan, asuransi, dan konsultan. Di sanalah lowongan eksplisit mencantumkannya. Kapan TIDAK: kamu data analyst murni yang tidak menyentuh governance — waktumu lebih baik untuk portofolio analisis. Strategi belajar yang jujur: (1) petakan 14 area ke pengalamanmu — tandai yang sudah dikuasai dari kerja; (2) kejar 44% (empat area 11%) dulu; (3) kerjakan latihan soal skenario, bukan hafalan definisi — soal CDMP terkenal menguji hubungan antar-area (“perubahan aturan identitas pelanggan memengaruhi MDM, metadata, privasi, dan reporting sekaligus”).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “CDMP = hafal DMBOK 500 halaman”",
        type: "pitfall",
        body: "Yang benar: soal-soal sulit CDMP menguji cara berpikir relasional — bagaimana satu keputusan merambat ke banyak area. Menghafal definisi tanpa memahami ketergantungan antar-area akan gugur di 25% soal tersulit. Teknik belajar terbaik: gambar peta satu halaman berisi 14 area, lalu tarik garis hubungan antar-area untuk tiap skenario yang kamu temui di kerja.",
      },
      hints: [
        "💡 Intuisi: biaya per ujian sekitar US$300-an (cek situs resmi DAMA — angka berubah). Bandingkan dengan satu bulan gajimu sebagai investasi — bukan sebagai “mahal/murah” absolut.",
      ],
      reference: "CDMP: 100 soal, 90 menit, 14 area berbobot. Kejar 44% dulu, belajar via skenario.",
    },
    {
      id: "konsep-dcam",
      eyebrow: "Langkah 4 · Konsep",
      title: "DCAM — Si Raport Organisasi",
      prose: [
        "Definisi: DCAM (Data Management Capability Assessment Model) v3 dari EDM Council adalah model penilaian kapabilitas: 8 komponen inti, 34 kapabilitas, 100+ sub-kapabilitas — dipakai organisasi untuk menilai kematangan program data management-nya, menemukan gap, dan menyusun roadmap. Delapan komponennya: (1) Data Strategy, DMS & Business Case; (2) Data Management Program & Funding; (3) Architecture — Business, Data & Technology; (4) Business Data Knowledge; (5) Data Quality Management; (6) Govern Data & DMP; (7) Data Management Operations, Risk & Control; (8) Analytics Management.",
        "Kepribadiannya: kalau CDMP adalah ujian SIM perorangan, DCAM adalah uji kelayakan armada — ia menilai perusahaannya, bukan kamunya. Sertifikasi DCAM (digital badge setelah training + ujian) membuktikan kamu paham cara menilai dan membangun program — skill yang dicari untuk role Head of Data Governance, CDO office, dan konsultan transformasi. DCAM sangat kuat di financial services — tidak mengherankan, EDM Council lahir dari kebutuhan bank-bank global.",
        "Kapan memakai: ketika pekerjaanmu adalah membangun atau menilai program (bukan sekadar menjalankannya) — “seberapa matang governance kita? apa roadmap 2 tahunnya?”. Kapan TIDAK: kamu individual contributor yang belum menyentuh strategi — CDMP lebih dulu. Perbedaan kunci yang sering disalahpahami: DCAM menilai, tidak mengerjakan — ia hebat menunjukkan di mana kamu berada, tetapi minim panduan cara sampai ke tujuan. Pasangan alaminya: DCAM untuk diagnosis, DMBOK/CDMP untuk terapinya.",
        "Catatan praktis: training + ujian DCAM hanya untuk member EDM Council (biaya di kisaran US$1.300-an untuk paket training + ujian, per info publik 2025–2026 — verifikasi ke situs resmi). Untuk individu non-member, pelajarannya tetap bisa diambil gratis: 8 komponennya adalah checklist yang sangat baik untuk menilai kematangan timmu sendiri.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “DCAM dan CDMP itu saingan — pilih salah satu”",
        type: "pitfall",
        body: "Yang benar: keduanya menjawab pertanyaan berbeda. CDMP menjawab “apakah orang ini paham data management?”; DCAM menjawab “semapan apa program data perusahaan ini?”. Profesional senior di enterprise teregulasi sering membutuhkan keduanya: CDMP untuk kredibilitas individu, DCAM untuk memimpin program. Bukan saingan — pasangan.",
      },
      hints: [
        "💡 Intuisi: pakai 8 komponen DCAM sebagai kuesioner 30 menit untuk timmu — nilai tiap komponen 1–5. Hasilnya adalah peta jalan governance yang lebih jujur daripada slideware konsultan.",
      ],
      reference: "CDMP = orangnya; DCAM = organisasinya. Diagnosis (DCAM) + terapi (DMBOK).",
    },
    {
      id: "konsep-regulasi",
      eyebrow: "Langkah 5 · Konsep",
      title: "Regulasi 2026 — GR 33/2026 dan Wasit yang Belum Datang",
      prose: [
        "Definisi (hati-hati, tanpa mengarang isi pasal): UU PDP 27/2022 adalah undang-undang pelindungan data pribadi Indonesia. GR 33/2026 adalah peraturan pemerintah sebagai aturan turunan/penyelenggaraannya — mengatur tata kelola penyelenggaraan pelindungan data pribadi, termasuk ketentuan transfer data pribadi ke luar wilayah Indonesia. Ini melengkapi bekal regulasi dari dm12/dm13 dengan perkembangan terbaru.",
        "Dua fakta praktis yang wajib diketahui. Pertama: transfer lintas negara kini punya rambu eksplisit — bila perusahaanmu memakai cloud region Singapura, analytics vendor di luar negeri, atau grup perusahaan lintas negara, aliran data itu harus dipetakan dan dipastikan memenuhi ketentuan. Praktiknya untuk data steward: inventarisasi transfer lintas negara (data apa, ke mana, atas dasar apa) menjadi bagian katalog dan lineage — persis seperti yang kamu pelajari di dm24. Kedua: per September 2026, Lembaga PDP (otoritas pengawas independen yang diamanatkan UU) belum terbentuk. Implikasinya jangan dibaca sebagai “belum ada yang mengawasi, jadi santai” — dibaca sebagai “tidak ada wasit bukan berarti tidak ada aturan; dan ketika wasit datang, yang diperiksa adalah rekam jejak kepatuhanmu dari sekarang”. Perusahaan yang menunggu wasit akan ketahuan tidak siap.",
        "Kapan memakai pengetahuan ini: setiap keputusan arsitektur yang memindahkan data pribadi — pilih region cloud, vendor analytics, atau skema data sharing (ingat dm22). Aturan praktisnya: untuk tiap aliran data pribadi lintas sistem/negara, catat tiga hal — dasar hukumnya, klasifikasi datanya, dan persetujuan/mekanisme transfernya. Tiga catatan ini adalah 80% kesiapan audit regulasi.",
      ],
      formula: String.raw`\text{kesiapan audit} \approx \text{inventarisasi} \times \text{klasifikasi} \times \text{mekanisme transfer}`,
      formulaNote: "Bukan rumus eksak — kompas perkalian: kesiapan audit regulasi ≈ inventarisasi aliran data × klasifikasi sensitivitas × kejelasan mekanisme transfer. Bila salah satunya nol (tidak tahu datanya ke mana, tidak diklasifikasikan, atau transfernya tanpa dasar), hasil kalinya nol: tidak siap audit. Setiap “×” adalah pekerjaan steward yang nyata.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Lembaga PDP belum ada = UU PDP belum berlaku”",
        type: "pitfall",
        body: "Yang benar: undang-undangnya berlaku; yang belum ada adalah otoritas pengawas independennya. Kewajiban pengendali/prosesor data tetap berjalan, dan penegakan bisa datang lewat jalur lain. Menunggu wasit sebelum latihan adalah strategi kalah — bangun kepatuhan dari sekarang, catat buktinya.",
      },
      hints: [
        "💡 Intuisi: anggap regulasi seperti musim hujan — kamu tidak menunggu hujan turun untuk membeli payung. GR 33/2026 adalah prakiraan cuacanya; payungnya adalah inventarisasi + klasifikasi + mekanisme transfer yang terdokumentasi.",
      ],
      reference: "Tiga catatan per aliran data: dasar hukum, klasifikasi, mekanisme transfer.",
    },
    {
      id: "lab-assessment",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Self-assessment kesiapan sertifikasi",
      prose: [
        "Waktunya menilai dirimu dengan jujur. Di bawah ada tujuh domain (dipadatkan dari 14 area DMBOK) beserta bobot dan skor dirimu 1–5 — anggap ini hasil refleksi jujur setelah membaca lesson ini. Tugasmu: (1) hitung skor terbobot S = Σ bobot × skor; (2) hitung persen = S/5 × 100; (3) tentukan status (≥4,0 SIAP UJIAN; ≥3,0 HAMPIR SIAP; selainnya BELUM SIAP); (4) susun prioritas belajar: domain berskor < 3, urut dari (3−skor)×bobot terbesar.",
        "Coba: setelah lolos, naikkan skormu di “Metadata & Katalog” dari 2 menjadi 4 — perhatikan status berubah. Lalu tanya: domain mana yang bobotnya kecil tetapi skormu juga kecil — apakah layak diprioritaskan? (Petunjuk: rumus prioritasmu sudah menjawabnya.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor` = jumlah bobot × skor tiap domain (2 desimal)" },
        { id: "t2", text: "Hitung `persen` dan tentukan `status`" },
        { id: "t3", text: "Susun `rencana` = daftar domain berskor < 3, urut prioritas menurun" },
        { id: "t4", text: "Jalankan dan pastikan laporan tercetak" },
      ],
      expected: "Skor kesiapan: 3.10/5 (62.0%) — HAMPIR SIAP\nPrioritas belajar: 1. Metadata & Katalog 2. Siklus Hidup & Retensi",
      code: {
        starter: `# Domain, bobot (total 1,0), dan skor refleksi dirimu 1-5 (SINTETIS)
domain = [
    ("Tata Kelola Data", 0.20, 3),
    ("Kualitas Data", 0.20, 4),
    ("Metadata & Katalog", 0.15, 2),
    ("Data Induk & Referensi", 0.10, 3),
    ("Arsitektur & Integrasi", 0.10, 3),
    ("Keamanan & Privasi", 0.15, 4),
    ("Siklus Hidup & Retensi", 0.10, 2),
]

# TULIS KODEMU DI BAWAH INI
skor = 0.0  # TODO: Σ bobot × skor, bulatkan 2 desimal

persen = 0.0  # TODO: skor / 5 * 100, bulatkan 1 desimal
status = ""  # TODO: >=4.0 SIAP UJIAN, >=3.0 HAMPIR SIAP, else BELUM SIAP

rencana = []  # TODO: domain berskor < 3, urut (3-skor)*bobot menurun

print(f"Skor kesiapan: {skor:.2f}/5 ({persen:.1f}%) — {status}")
prioritas = " ".join(f"{i+1}. {nama}" for i, nama in enumerate(rencana))
print(f"Prioritas belajar: {prioritas}")`,
        lockLines: 11,
        solution: `# Domain, bobot (total 1,0), dan skor refleksi dirimu 1-5 (SINTETIS)
domain = [
    ("Tata Kelola Data", 0.20, 3),
    ("Kualitas Data", 0.20, 4),
    ("Metadata & Katalog", 0.15, 2),
    ("Data Induk & Referensi", 0.10, 3),
    ("Arsitektur & Integrasi", 0.10, 3),
    ("Keamanan & Privasi", 0.15, 4),
    ("Siklus Hidup & Retensi", 0.10, 2),
]

# TULIS KODEMU DI BAWAH INI
skor = round(sum(bobot * nilai for _, bobot, nilai in domain), 2)

persen = round(skor / 5 * 100, 1)
status = "SIAP UJIAN" if skor >= 4.0 else ("HAMPIR SIAP" if skor >= 3.0 else "BELUM SIAP")

kandidat = [(nama, (3 - nilai) * bobot) for nama, bobot, nilai in domain if nilai < 3]
kandidat.sort(key=lambda x: x[1], reverse=True)
rencana = [nama for nama, _ in kandidat]

print(f"Skor kesiapan: {skor:.2f}/5 ({persen:.1f}%) — {status}")
prioritas = " ".join(f"{i+1}. {nama}" for i, nama in enumerate(rencana))
print(f"Prioritas belajar: {prioritas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: 3.1, tol: 0.001, label: "`skor` harus 3,10", msg: "Σ bobot×skor = 0,60+0,80+0,30+0,30+0,30+0,60+0,20." },
          { kind: "equal", task: "t2", name: "persen", value: 62.0, tol: 0.05, label: "`persen` harus 62,0", msg: "3,10/5 × 100." },
          { kind: "equal", task: "t2", name: "status", value: "HAMPIR SIAP", tol: 0, label: "`status` harus HAMPIR SIAP", msg: "3,10 berada di rentang 3,0–4,0." },
          { kind: "equal", task: "t3", name: "rencana", value: ["Metadata & Katalog", "Siklus Hidup & Retensi"], tol: 0, label: "`rencana` tepat dan berurutan", msg: "Prioritas: 0,15 lalu 0,10." },
          { kind: "stdout_matches", task: "t4", pattern: "Skor kesiapan: 3\\.10/5 \\(62\\.0%\\)", label: "Baris skor tercetak", msg: "Format: 'Skor kesiapan: 3.10/5 (62.0%)'." },
        ],
      },
      note: {
        title: "Skor ini cermin, bukan vonis",
        body: "Self-assessment hanya sejujur orang yang mengisinya. Gunakan untuk memprioritaskan belajar — bukan untuk memutuskan “saya pasti lulus”. Aturan praktisnya: bila ragu antara dua skor, pilih yang lebih rendah; persiapan yang berlebihan tidak pernah merugikan di ujian 100 soal.",
      },
      reference: "Ukur gap → prioritaskan dengan bobot → belajar yang berbobot dulu.",
    },
    {
      id: "chart-kesiapan",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca peta kesiapanmu",
      prose: [
        "Chart di bawah memvisualisasikan skor kesiapan per domain dari lab — pola yang sama dipakai untuk memetakan kesiapan tim terhadap 8 komponen DCAM.",
        "Cara membaca: tiap baris = satu domain; panjang batang = skor 1–5. Garis putus-putus = ambang 3,0. Batang merah = di bawah ambang.",
        "Interpretasi: dua batang merah — Metadata & Katalog dan Siklus Hidup & Retensi — adalah prioritas belajarmu, bukan karena nilainya paling rendah saja, tetapi karena bobotnya membuat gap-nya paling mahal. Perhatikan juga: Kualitas Data dan Keamanan & Privasi sudah kuat (4,0) — itu fondasi yang membuat 62% ini “hampir siap”, bukan “belum siap”. Pelajaran chart ini: belajar bukan tentang memperbaiki yang terlemah, melainkan tentang menutup gap yang termahal.",
      ],
      figure: {
        svg: READY_SVG,
        alt: "Tujuh batang skor domain: dua merah di bawah ambang 3,0 (Metadata & Katalog, Siklus Hidup).",
        caption: "Skor kesiapan per domain — tutup gap yang termahal dulu.",
      },
      tasks: [],
      reference: "Prioritaskan gap × bobot, bukan sekadar nilai terendah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Sertifikasi apa, kapan — dan regulasi apa yang harus dipatuhi?",
      prose: [
        "Lima skenario keputusan:",
        "Skenario 1 — Analis 3 tahun pengalaman, ingin masuk tim data governance bank. → CDMP Associate: kejar 44% (governance, quality, metadata, modelling), latihan soal skenario. Alasan: lowongan bank eksplisit meminta; Associate adalah pintu masuk yang realistis.",
        "Skenario 2 — Data manager diminta membangun program governance 2 tahun. → Pelajari 8 komponen DCAM sebagai checklist diagnosis (gratis sebagai kerangka), pertimbangkan sertifikasi DCAM bila perusahaan member EDM Council. Alasan: butuh peta kematangan organisasi, bukan ujian individu.",
        "Skenario 3 — Perusahaan memakai cloud region Singapura untuk data nasabah Indonesia. → Inventarisasi transfer lintas negara + pastikan mekanisme transfer memenuhi ketentuan GR 33/2026; catat di lineage katalog. Alasan: transfer lintas negara kini punya rambu eksplisit — “tidak tahu” bukan pembelaan.",
        "Skenario 4 — “Lembaga PDP belum ada, jadi kita tunggu dulu.” → Tolak pola pikir ini: bangun inventarisasi + klasifikasi + mekanisme transfer dari sekarang dan catat buktinya. Alasan: kewajiban berlaku; wasit yang datang belakangan memeriksa rekam jejak.",
        "Skenario 5 — Dua sertifikasi ditawarkan kantor, waktu belajar terbatas. → Pilih berdasar peran 2 tahun ke depan: eksekutor governance/kualitas → CDMP; pemimpin program/penilai kematangan → DCAM. Alasan: sertifikasi mengikuti arah karier, bukan sebaliknya — badge tanpa peran = hiasan.",
        "Aturan praktis 10 detik: mau sertifikasi? → (1) peran target 2 tahun butuh yang mana — CDMP (orang) atau DCAM (organisasi)? (2) petakan gap × bobot; (3) belajar via skenario, bukan hafalan. Mau patuh regulasi? → (1) inventarisasi aliran; (2) klasifikasi; (3) mekanisme transfer tercatat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengambil sertifikasi karena “disuruh HR” tanpa memetakan ke peran. Sertifikasi yang tidak dipakai dalam 6 bulan menguap — pengetahuan tanpa praktik = hafalan yang kedaluwarsa. Selalu pasangkan rencana ujian dengan proyek nyata yang memakai ilmunya.",
      },
      reference: "Sertifikasi mengikuti arah karier. Regulasi: inventarisasi, klasifikasi, mekanisme tercatat.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Bank Artha: audit regulator dalam 6 bulan",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank Artha akan diaudit regulator dalam 6 bulan. Kondisi: 40% tabel inti belum terklasifikasi, transfer data ke vendor analytics di Malaysia tidak terdokumentasi, tim governance 3 orang (satu akan resign), dan tidak ada yang pernah lulus sertifikasi data management.",
        "Pertanyaan analisis: (1) Tiga prioritas 6 bulan dengan alasan urutannya. (2) Sertifikasi apa untuk siapa — dan kenapa? (3) Bagaimana menjawab pertanyaan auditor tentang transfer ke Malaysia?",
        "Pembahasan: (1) Prioritas: pertama, klasifikasi 40% tabel inti (tanpa ini, tidak ada jawaban atas “data sensitif di mana saja”); kedua, dokumentasikan transfer Malaysia — inventarisasi aliran, dasar mekanisme transfer, catat di lineage (risiko regulasi langsung); ketiga, tetapkan steward pengganti + mulai katalogisasi 20 tabel terpakai. Urutan = risiko dulu, fondasi kemudian, kerapian terakhir. (2) Satu orang ke CDMP Associate (fokus governance/quality/metadata — langsung pakai untuk klasifikasi), lead tim pelajari kerangka DCAM untuk memetakan kematangan (diagnosis program). Bukan “semua ikut semua” — sertifikasi mengikuti peran. (3) Jawab dengan tiga catatan: data apa yang ditransfer, atas mekanisme apa, dan bukti klasifikasinya — plus rencana remediasi untuk gap yang ditemukan. Auditor menghargai kejujuran berdokumen lebih dari klaim sempurna tanpa bukti.",
        "Catatan implementasi: 6 bulan = 2 kuartal. Kuartal 1: klasifikasi + dokumentasi transfer (bukti). Kuartal 2: steward + katalog 20 tabel + satu lulus CDMP (kapabilitas). Jangan janjikan “100% selesai” — janjikan bukti kemajuan yang terukur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Audit regulator bukan ujian sekolah — tidak ada nilai 100. Yang dinilai: apakah bank tahu di mana risikonya, dan apakah ada rencana menutupnya. “Kami menemukan 40% belum terklasifikasi dan ini rencana 90 harinya” mengalahkan “kami rasa sudah aman” setiap saat.",
      },
      reference: "Risiko dulu, fondasi kemudian. Kejujuran berdokumen mengalahkan klaim sempurna.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "CDMP (DAMA): sertifikasi individu, 100 soal/90 menit, 14 area berbobot — kejar 44% (governance, quality, metadata, modelling) dulu.",
        "DCAM (EDM Council): model 8 komponen untuk menilai kematangan program organisasi — diagnosis, bukan terapi.",
        "GR 33/2026: aturan turunan UU PDP — transfer lintas negara punya rambu; Lembaga PDP belum ada ≠ aturan belum berlaku.",
        "Skor kesiapan = Σ bobot × skor; prioritaskan gap × bobot, bukan nilai terendah.",
        "Sertifikasi mengikuti arah karier; regulasi dipenuhi dengan inventarisasi + klasifikasi + mekanisme tercatat.",
      ],
      next: {
        label: "DM27 — SAP MDG & MDM Enterprise",
        href: "/learn/dm27-sap-mdg",
      },
      quiz: [
        {
          q: "Apa perbedaan paling fundamental CDMP vs DCAM?",
          options: [
            { text: "CDMP menguji pengetahuan individu; DCAM menilai kapabilitas program organisasi", why: "Benar: CDMP = ujian SIM perorangan; DCAM = uji kelayakan armada. Pertanyaan yang dijawab berbeda.", correct: true },
            { text: "CDMP untuk Amerika, DCAM untuk Eropa", why: "Salah: keduanya global; DCAM memang kuat di financial services, tetapi bukan pembagian wilayah." },
            { text: "CDMP lebih sulit dari DCAM", why: "Salah: “sulit” tergantung peranmu — keduanya menantang di jalurnya masing-masing. Bukan perbandingan yang bermakna." },
            { text: "Keduanya sama, pilih yang lebih murah", why: "Salah: memilih berdasar harga tanpa memetakan ke peran = badge tanpa guna." },
          ],
        },
        {
          q: "Empat area DMBOK berbobot 11% tiap-tiganya (total 44%). Strategi belajar yang tepat?",
          options: [
            { text: "Kuasai keempatnya dulu via soal skenario yang menguji hubungan antar-area", why: "Benar: 44% soal + soal tersulit menguji relasi antar-area. Ini leverage belajar tertinggi.", correct: true },
            { text: "Hafalkan definisi 14 area berurutan", why: "Salah: hafalan tanpa relasi gugur di 25% soal tersulit — persis mitos yang dibantah di lesson." },
            { text: "Fokus ke area 2% (etika, big data) karena jarang dipelajari orang", why: "Salah: 2% × 3 area = 6% soal. Mengejar remah mengorbankan roti." },
            { text: "Lewati ujian, pengalaman cukup", why: "Salah: pengalaman tidak otomatis memetakan 14 area; banyak praktisi hebat gagal karena buta area yang tak pernah disentuhnya." },
          ],
        },
        {
          q: "Perusahaan memakai cloud region Singapura untuk data nasabah Indonesia. Tindakan data steward yang benar?",
          options: [
            { text: "Inventarisasi aliran transfer + pastikan mekanisme transfer memenuhi ketentuan + catat di lineage", why: "Benar: GR 33/2026 memberi rambu eksplisit untuk transfer lintas negara; tiga catatan ini = 80% kesiapan audit.", correct: true },
            { text: "Pindahkan semua ke region Indonesia segera tanpa analisis", why: "Salah: migrasi buta mahal dan berisiko; kepatuhan butuh mekanisme yang benar, bukan panik lokasi." },
            { text: "Tidak perlu apa-apa — Lembaga PDP belum ada", why: "Salah: mitos yang dibantah — kewajiban berlaku; wasit datang belakangan memeriksa rekam jejak." },
            { text: "Minta vendor menandatangani NDA tambahan", why: "Salah: NDA bukan mekanisme transfer data pribadi; ia tidak menjawab “atas dasar apa data boleh keluar”." },
          ],
        },
        {
          q: "Skor kesiapanmu 3,10 (62%) — HAMPIR SIAP. Interpretasi yang jujur?",
          options: [
            { text: "Daftar ujian boleh, tetapi tutup dulu dua gap berbobot (Metadata & Katalog, Siklus Hidup) — 62% bukan 100%", why: "Benar: hampir siap = fondasi ada, gap termahal belum tertutup. Ujian tanpa menutup gap = berjudi.", correct: true },
            { text: "62% = pasti lulus, langsung daftar", why: "Salah: self-assessment hanya sejujur pengisinya; 62% adalah sinyal belajar, bukan prediksi kelulusan." },
            { text: "62% = gagal total, mulai dari nol", why: "Salah: fondasi (kualitas 4, keamanan 4) kuat — ini hampir siap, bukan belum siap." },
            { text: "Angka ini tidak berguna — buang saja", why: "Salah: nilainya di prioritas yang dihasilkannya, bukan di angkanya." },
          ],
        },
        {
          q: "Tim 3 orang, satu akan resign, audit 6 bulan lagi. Prioritas sertifikasi?",
          options: [
            { text: "Satu orang ke CDMP Associate (langsung pakai untuk klasifikasi) + lead pelajari kerangka DCAM untuk diagnosis", why: "Benar: sertifikasi mengikuti peran — eksekutor ke CDMP, pemimpin program ke DCAM. Bukan semua-ikut-semua.", correct: true },
            { text: "Ketiganya ikut CDMP sekaligus biar kompak", why: "Salah: menghabiskan kapasitas tim yang sudah tipis untuk badge yang tidak semuanya terpakai." },
            { text: "Tunda semua sertifikasi sampai setelah audit", why: "Salah: justru 6 bulan ini jendela belajar yang paling termotivasi — ilmunya langsung dipakai." },
            { text: "Ambil yang termurah tanpa melihat peran", why: "Salah: harga bukan kriteria; keselarasan dengan peran adalah." },
          ],
        },
      ],
    },
  ],
};
