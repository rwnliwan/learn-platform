import type { V2Lesson } from "../lib/types";

const FIG_SEKTOR = `<svg viewBox="0 0 480 300" role="img" aria-label="Cakupan sektor TKBI meluas dari versi 1 ke versi 2.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">TKBI v2: sektor yang dicakup meluas</text>
<text x="10" y="60" font-size="11" fill="var(--chart-text)">TKBI v1 (Feb 2024)</text>
<rect x="200" y="47" width="80" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="286" y="64" font-size="11" fill="var(--chart-text)">Energi</text>
<text x="10" y="110" font-size="11" fill="var(--chart-text)">TKBI v2 (Feb 2025)</text>
<rect x="200" y="97" width="80" height="24" fill="var(--c1)" opacity="0.9"/>
<rect x="286" y="97" width="80" height="24" fill="var(--c2)" opacity="0.9"/>
<rect x="372" y="97" width="80" height="24" fill="var(--c3)" opacity="0.9"/>
<text x="200" y="140" font-size="10" fill="var(--chart-text)">Energi + Konstruksi &amp; Real Estate + Transportasi &amp; Penyimpanan</text>
<rect x="200" y="150" width="150" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="200" y="192" font-size="10" fill="var(--chart-text)">+ Kehutanan &amp; Perkebunan sawit (bagian dari AFOLU)</text>
<text x="10" y="225" font-size="11" fill="var(--chart-text)">Contoh tambahan v2: rumah tapak MBR, SAF, serapan karbon hutan.</text>
<text x="10" y="255" font-size="10" fill="var(--chart-text)" opacity="0.75">Sumber: Siaran pers OJK 25 Feb 2025 (TKBI edisi ke-2).</text>
</g>
</svg>`;

const FIG_TRAFFIC = `<svg viewBox="0 0 480 300" role="img" aria-label="Klasifikasi hijau, amber, merah untuk aktivitas ekonomi.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Lampu lalu lintas keberlanjutan (kerangka acuan ATSF)</text>
<text x="10" y="62" font-size="12" fill="var(--chart-text)" font-weight="bold">GREEN</text>
<rect x="120" y="49" width="220" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="120" y="92" font-size="10" fill="var(--chart-text)">Selaras net-zero hari ini; memenuhi kriteria teknis penuh</text>
<text x="10" y="122" font-size="12" fill="var(--chart-text)" font-weight="bold">AMBER</text>
<rect x="120" y="109" width="150" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="120" y="152" font-size="10" fill="var(--chart-text)">Transisi: jalur kredibel menuju hijau, ada BATAS WAKTU (sunset)</text>
<text x="10" y="182" font-size="12" fill="var(--chart-text)" font-weight="bold">RED</text>
<rect x="120" y="169" width="70" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="120" y="212" font-size="10" fill="var(--chart-text)">Tidak selaras / merusak signifikan tujuan lingkungan</text>
<text x="10" y="245" font-size="11" fill="var(--chart-text)">Syarat lintas warna: DNSH + remedial measures + aspek sosial.</text>
<text x="10" y="275" font-size="10" fill="var(--chart-text)" opacity="0.75">Amber bukan 'hijau muda' — ia janji bertenggat yang harus ditepati.</text>
</g>
</svg>`;

export const cr34: V2Lesson = {
  slug: "cr34-tkbi-v2-kredit-hijau",
  track: "Credit Risk",
  module: "Risiko Iklim & Kredit",
  title: "CR34 — TKBI v2: Menilai Kredit Hijau & Menangkap Greenwashing",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Nasabah 'hijau' yang minta diskon bunga",
      prose: [
        "PT Angin Nusantara mengajukan kredit Rp500 miliar untuk pembangkit listrik tenaga bayu (PLTB) di pesisir selatan. Proposalnya berkilau: logo daun di setiap halaman, klaim '100% energi bersih', dan satu permintaan berani — 'Karena proyek kami hijau, kami mohon pricing 50 bp lebih murah dari kredit biasa.' Relationship manager-nya antusias: 'Ini kredit hijau, Bu — OJK juga mendorong!'",
        "Twist-nya: analis risiko Sari tidak langsung mengangguk. Ia membuka Taksonomi Keuangan Berkelanjutan Indonesia (TKBI) versi 2 — panduan OJK yang terbit Februari 2025 — dan mulai memeriksa: apakah PLTB ini benar-benar memenuhi kriteria 'hijau'? Bagaimana dengan turbin yang diimpor — jejak karbon konstruksinya? Lahan pesisirnya — apakah mengganggu kawasan lindung? Klaim 'hijau' ternyata bukan stempel, melainkan serangkaian ujian yang harus dilalui satu per satu.",
        "Ujiannya penting karena skalanya raksasa: OJK mencatat kredit hijau perbankan nasional mencapai Rp2.075 triliun per Desember 2024 — naik dari Rp1.959 triliun setahun sebelumnya, sekitar 26% dari total kredit nasional. Setiap rupiah yang salah diklaim 'hijau' bukan sekadar kesalahan label — ia menggerus kepercayaan seluruh pasar keuangan berkelanjutan. Inilah yang disebut greenwashing, dan analis kredit adalah garis pertahanannya.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan struktur TKBI v2 dan bedanya dengan v1; (2) menilai klaim hijau nasabah langkah demi langkah; (3) mengenali red flags greenwashing; (4) menjelaskan peran kreditur dalam transisi hijau. Prasyarat ringkas: risiko iklim memengaruhi kredit lewat dua jalur — risiko fisik (banjir, kekeringan merusak agunan dan arus kas debitur) dan risiko transisi (kebijakan karbon, perubahan teknologi membuat aset usang). Keduanya bisa menaikkan PD dan LGD. OJK mewajibkan bank menilai ketahanan model bisnis terhadap iklim lewat panduan CRMS.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Menilai kredit hijau adalah risk assessment dengan lensa tambahan: selain 'apakah debitur bisa membayar?', analis menjawab 'apakah aktivitasnya benar-benar berkelanjutan?'. Jawaban kedua menentukan label portofolio bank, insentif pricing, dan reputasi di mata regulator.",
      },
      reference: "Klaim hijau = ujian berlapis, bukan stempel. Rp2.075 T dipertaruhkan.",
    },
    {
      id: "struktur",
      eyebrow: "Langkah 2 · Konsep",
      title: "Apa itu TKBI v2",
      prose: [
        "TKBI (Taksonomi untuk Keuangan Berkelanjutan Indonesia) adalah klasifikasi aktivitas ekonomi yang disusun OJK sebagai panduan sektor keuangan: aktivitas apa yang boleh disebut mendukung Tujuan Pembangunan Berkelanjutan Indonesia. Ia bukan aturan larangan — ia kamus bersama agar 'hijau' berarti hal yang sama bagi semua bank, investor, dan debitur.",
        "Versi 1 terbit Februari 2024 dan hanya mencakup sektor energi. Versi 2 diluncurkan 11 Februari 2025 (diumumkan resmi 25 Februari 2025) dan meluas ke: Construction & Real Estate, Transportation & Storage, serta Kehutanan & Perkebunan Kelapa Sawit sebagai bagian dari sektor AFOLU (Agriculture, Forestry, and Other Land Use). Contoh aktivitas yang ditambahkan: rumah tapak untuk Masyarakat Berpenghasilan Rendah (MBR), Sustainable Aviation Fuel (SAF), serta serapan dan penyimpanan karbon di hutan produksi dan hutan lindung.",
        "TKBI disusun dengan merujuk utama pada ASEAN Taxonomy for Sustainable Finance (ATSF) plus kebijakan nasional, dengan prinsip: ilmiah dan kredibel, interoperabel (bisa dibandingkan dengan taksonomi global), berpihak pada kepentingan nasional (termasuk Asta Cita), dan inklusif — bisa dipakai korporasi hingga UMKM. Cakupannya meliputi sektor terkait NDC (komitmen iklim nasional) beserta perubahannya, plus sektor pendukung (enabling).",
        "Kepribadiannya: TKBI adalah 'penggaris', bukan 'tongkat'. Ia tidak memukul bank yang menyalurkan kredit ke sektor merah — ia hanya memastikan penggarisnya sama untuk semua orang, sehingga klaim hijau bisa diverifikasi, dibandingkan, dan dipertanggungjawabkan. Tanpa penggaris bersama, setiap bank mengukur dengan jengkalnya sendiri — dan greenwashing berpesta.",
        "Cara membaca figur: satu batang pendek untuk TKBI v1 (satu sektor: energi) vs blok memanjang untuk v2 (empat klaster sektor). Interpretasi: perluasan cakupan 4x lipat dalam setahun — analis kredit kini menilai klaim hijau di jauh lebih banyak jenis pembiayaan, dari KPR hingga kebun sawit.",
      ],
      figure: {
        svg: FIG_SEKTOR,
        alt: "Cakupan sektor TKBI v1 vs v2.",
        caption: "TKBI v2 meluas dari 1 sektor (energi) ke 4 klaster sektor.",
      },
      tasks: [],
      note: {
        title: "Sumber",
        body: "Fakta versi dan sektor merujuk siaran pers OJK 25 Februari 2025 (TKBI edisi ke-2, SP 40/GKPB/OJK/II/2025). Angka Rp2.075 triliun (Des 2024) dari pemberitaan OJK; rincian 26,24% dari total kredit nasional, porsi UMKM 69,01% dan keanekaragaman hayati 16,59% dari analisis OJK yang dikutip media.",
      },
      hints: [
        "Ingat urutan: v1 (2024) = energi saja; v2 (2025) = + konstruksi, transportasi, kehutanan/sawit.",
        "TKBI v3 direncanakan 2026 (manufaktur, perikanan, air, sampah) — taksonomi ini hidup dan meluas.",
      ],
      reference: "TKBI = kamus 'hijau' bersama. v2 (Feb 2025) meluas ke 4 klaster sektor.",
    },
    {
      id: "klasifikasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Hijau, amber, merah: membaca lampu lalu lintas",
      prose: [
        "TKBI merujuk pada kerangka ATSF yang memakai sistem 'lampu lalu lintas'. GREEN: aktivitas yang sudah selaras dengan tujuan keberlanjutan hari ini — memenuhi kriteria teknis (threshold) penuh, mis. PLTB yang memenuhi ambang emisi. AMBER: aktivitas transisi — berkontribusi tetapi butuh perbaikan, berada di jalur kredibel menuju hijau. RED: tidak selaras atau menyebabkan kerugian signifikan terhadap tujuan lingkungan.",
        "Kunci yang sering disalahpahami: amber BUKAN 'hijau kelas dua'. Amber adalah janji bertenggat — tier transisi ini punya batas waktu (sunset): bila dalam tenggatnya aktivitas tidak naik ke hijau, klasifikasinya gugur. Inilah desain anti-greenwashing-nya: 'dalam transisi' tidak boleh menjadi label abadi untuk menunda perubahan.",
        "Tiga syarat melintasi semua warna — tidak bisa ditawar. DNSH (Do No Significant Harm): aktivitas tidak boleh merusak signifikan tujuan lingkungan lainnya (PLTB yang menghancurkan hutan lindung gagal di sini). Remedial measures to transition: ada langkah perbaikan yang dimulai/direncanakan. Social aspects: aspek sosial terpenuhi (hak pekerja, masyarakat). Gagal satu syarat = gagal klasifikasi.",
        "Empat tujuan lingkungan yang dinilai: mitigasi perubahan iklim, adaptasi iklim, perlindungan ekosistem/keanekaragaman hayati, dan ketahanan sumber daya (ekonomi sirkular). Analis menilai kontribusi aktivitas terhadap tujuan-tujuan ini — bukan terhadap brosur marketing nasabah.",
        "Cara membaca figur: tiga bar — hijau terpanjang (selaras penuh), amber menengah (transisi bertenggat), merah terpendek (tidak selaras). Interpretasi: panjang bar = tingkat keselarasan, tetapi amber punya dimensi waktu yang tidak terlihat di bar — tenggat sunset-nya. Dua aktivitas amber dengan tenggat berbeda punya urgensi pengawasan berbeda.",
      ],
      figure: {
        svg: FIG_TRAFFIC,
        alt: "Klasifikasi hijau, amber, merah.",
        caption: "Amber = janji bertenggat, bukan hijau kelas dua.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: amber = hijau",
        type: "pitfall",
        body: "Mitos: 'Klasifikasi amber sudah cukup untuk disebut kredit hijau.' Yang benar: amber = transisi bertenggat, bukan hijau. Bank yang melaporkan kredit amber sebagai 'hijau' melakukan mislabeling — bentuk greenwashing institusional yang bisa menjadi temuan pengawas.",
      },
      hints: [
        "Uji cepat: 'Kapan tenggat transisinya?' — bila tak ada jawaban, itu bukan amber, itu alasan.",
        "DNSH adalah filter pertama: satu kerusakan signifikan menggugurkan seluruh klaim.",
      ],
      reference: "Green = selaras kini. Amber = janji bertenggat. Red = tidak selaras.",
    },
    {
      id: "menilai",
      eyebrow: "Langkah 4 · Konsep",
      title: "Cara analis menilai klaim hijau: lima langkah",
      prose: [
        "Langkah 1 — Petakan aktivitasnya ke sektor TKBI. PLTB → sektor energi (v1/v2). Pabrik baterai → manufaktur (belum di v2 — catat sebagai keterbatasan taksonomi, bukan vonis). Bila aktivitas tidak ada di taksonomi, analis tidak boleh mengarang klasifikasi hijau.",
        "Langkah 2 — Uji kriteria teknis (threshold). Setiap aktivitas punya ambang kuantitatif, mis. intensitas emisi di bawah X gCO2/kWh. Minta DATA, bukan klaim: laporan emisi terverifikasi, sertifikasi, hasil audit independen. 'Di bawah ambang' tanpa angka = belum terbukti.",
        "Langkah 3 — Uji DNSH. Periksa tujuan lingkungan lainnya: apakah proyek merusak habitat? Limbahnya ke mana? Untuk PLTB pesisir: kajian AMDAL, status kawasan lindung, dampak ke masyarakat pesisir. Satu pelanggaran signifikan = gugur.",
        "Langkah 4 — Verifikasi bukti dan pantau. Klasifikasi hijau bukan sekali-seumur-hidup: analis menetapkan covenant pelaporan (emisi tahunan, sertifikasi berkala) dan memantau kepatuhan. Langkah 5 — Dokumentasikan semuanya: metodologi, data, asumsi. Bila pengawas atau auditor bertanya 'mengapa hijau?', jawabannya adalah dossier, bukan keyakinan.",
      ],
      tasks: [],
      note: {
        title: "💡 Tips: mintalah angka, bukan kata sifat",
        body: "Kata 'ramah lingkungan', 'bersih', 'lestari' di proposal = nol informasi. Ganti dengan pertanyaan angka: berapa gCO2/kWh? Berapa persen material daur ulang? Sertifikasi apa, oleh siapa, kapan kedaluwarsa? Analis yang baik menerjemahkan kata sifat menjadi ambang yang bisa diuji.",
      },
      hints: [
        "Checklist 5 langkah: petakan → uji threshold → uji DNSH → verifikasi & pantau → dokumentasikan.",
        "Aktivitas di luar cakupan TKBI v2 ≠ otomatis merah — ia 'belum diklasifikasi'.",
      ],
      reference: "Nilai klaim hijau: petakan, uji ambang, uji DNSH, pantau, dokumentasikan.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 5 · Lab",
      title: "Checklist penilai klaim hijau",
      prose: [
        "Buat fungsi penilai sederhana: 5 kriteria (pemetaan sektor, threshold emisi, DNSH, bukti terverifikasi, rencana pemantauan), masing-masing skor 0–2. Total ≥ 8 = HIJAU, 5–7 = AMBER (perlu perbaikan bertenggat), < 5 = MERAH/tolak klaim.",
        "Eksperimen: ubah skor 'bukti terverifikasi' PT Angin Nusantara dari 2 menjadi 0 (klaim tanpa audit independen) — klasifikasinya jatuh dari HIJAU ke AMBER. Inilah bobot bukti dalam praktik.",
      ],
      formula: String.raw`\text{Skor} = \sum_{i=1}^{5} s_i, \quad s_i \in \{0, 1, 2\}`,
      formulaNote: "s_i = skor kriteria ke-i (pemetaan sektor, threshold emisi, DNSH, bukti terverifikasi, rencana pemantauan). Contoh: 2+2+2+2+1 = 9 → HIJAU (≥8). Interpretasi: angka ringkas keterbuktian klaim — tetapi kriteria wajib (threshold, DNSH) tetap filter gugur di luar penjumlahan.",
      tasks: [
        { id: "t1", text: "Lengkapi `total` dan `klasifikasi` dari skor" },
        { id: "t2", text: "Jalankan dan pastikan hasilnya tercetak" },
      ],
      expected: "Total skor: 9/10 -> HIJAU",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Skor 7 tapi threshold emisinya 0 — tetap AMBER kan?” Tidak: threshold emisi dan DNSH adalah syarat GUGUR. Dalam praktik, kegagalan pada kriteria wajib langsung = MERAH, berapa pun total skornya. Checklist berbobot tidak menggantikan filter gugur.",
      },
      hints: [
        "total = sum(skor.values()).",
        "HIJAU bila total >= 8; AMBER bila total >= 5; selain itu MERAH.",
      ],
      code: {
        starter: "# Skor 0-2 per kriteria. JANGAN UBAH.\nskor = {\n    \"pemetaan_sektor\": 2,\n    \"threshold_emisi\": 2,\n    \"dnsh\": 2,\n    \"bukti_terverifikasi\": 2,\n    \"rencana_pemantauan\": 1,\n}\n\n# TULIS KODEMU: total dan klasifikasi\ntotal =\nklasifikasi =\nprint(f\"Total skor: {total}/10 -> {klasifikasi}\")\n",
        lockLines: 9,
        solution: "# Skor 0-2 per kriteria. JANGAN UBAH.\nskor = {\n    \"pemetaan_sektor\": 2,\n    \"threshold_emisi\": 2,\n    \"dnsh\": 2,\n    \"bukti_terverifikasi\": 2,\n    \"rencana_pemantauan\": 1,\n}\n\n# TULIS KODEMU: total dan klasifikasi\ntotal = sum(skor.values())\nklasifikasi = \"HIJAU\" if total >= 8 else (\"AMBER\" if total >= 5 else \"MERAH\")\nprint(f\"Total skor: {total}/10 -> {klasifikasi}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "total = 9", msg: "2+2+2+2+1.", name: "total", value: 9, tol: 0 },
          { kind: "stdout_matches", task: "t2", label: "HIJAU tercetak", msg: "Total 9 ≥ 8.", pattern: "Total skor: 9/10 -> HIJAU" }
        ],
      },
      reference: "Skor ≥ 8 HIJAU; 5–7 AMBER; < 5 MERAH. Kriteria wajib = filter gugur.",
    },
    {
      id: "redflags",
      eyebrow: "Langkah 6 · Konsep",
      title: "Lima red flags greenwashing",
      prose: [
        "Red flag 1 — Klaim tanpa angka. 'Proyek ramah lingkungan' tanpa satu pun metrik emisi, ambang, atau baseline. Aturan analis: tidak ada angka = tidak ada klaim.",
        "Red flag 2 — Sertifikasi kedaluwarsa atau dari lembaga tak dikenal. 'Sudah tersertifikasi' — oleh siapa? Kapan? Masih berlaku? Sertifikasi abal-abal adalah industri tersendiri.",
        "Red flag 3 — Cherry-picking cakupan. Emisi operasional dilaporkan turun, tetapi emisi konstruksi dan rantai pasok (scope 3) disembunyikan. Minta gambaran penuh, bukan potongan yang fotogenik.",
        "Red flag 4 — Offset sebagai pengganti reduksi. 'Net-zero berkat membeli kredit karbon' sementara emisinya sendiri tidak turun. Offset boleh melengkapi, tidak boleh menggantikan penurunan emisi riil — dan kualitas kredit karbonnya wajib diverifikasi.",
        "Red flag 5 — Narasi transisi tanpa tenggat dan tanpa capex. 'Kami berkomitmen menuju hijau' tanpa target tahun, tanpa anggaran, tanpa milestone. Komitmen tanpa tenggat = puisi, bukan rencana. Amber mensyaratkan keduanya — dan analis menagihnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: greenwashing hanya soal marketing",
        type: "pitfall",
        body: "Mitos: 'Greenwashing urusan tim marketing, bukan risiko kredit.' Yang benar: klaim hijau yang runtuh bisa memicu risiko kredit nyata — pembatalan insentif, denda regulator, boikot, hingga percepatan pelunasan (covenant breach). Reputasi yang rusak menular ke arus kas.",
      },
      hints: [
        "Lima red flags: tanpa angka, sertifikasi meragukan, cherry-picking, offset pengganti, tanpa tenggat.",
        "Dokumentasikan temuan red flag — ia menjadi dasar covenant tambahan.",
      ],
      reference: "Tangkap greenwashing: angka, sertifikasi, cakupan penuh, reduksi riil, tenggat.",
    },
    {
      id: "kreditur",
      eyebrow: "Langkah 7 · Konsep",
      title: "Peran kreditur dalam transisi",
      prose: [
        "Bank bukan penonton transisi hijau — ia penyandang dananya. Peran pertama: transition finance — membiayai perusahaan 'cokelat' yang punya rencana kredibel menuju hijau (klasifikasi amber yang diawasi). Tanpa pembiayaan transisi, perusahaan tidak punya modal untuk berubah; tanpa pengawasan, 'transisi' menjadi label kosong. Kreditur memegang kedua ujungnya.",
        "Peran kedua: insentif lewat pricing. Sustainability-linked loan: margin bunga turun bila debitur mencapai target (SPT — sustainability performance target, mis. turunkan intensitas emisi 10% dalam 3 tahun), naik bila gagal. Pricing menjadi alat pendisiplin — bukan sekadar hadiah.",
        "Peran ketiga: pemantauan dan engagement. Covenant pelaporan emisi tahunan, review klasifikasi berkala, dan dialog dengan debitur yang meleset dari jalurnya. Bila debitur amber melewati tenggat sunset tanpa perbaikan, bank menaikkan pricing, membatasi, atau mengklasifikasi ulang — konsekuensi yang dijanjikan di awal harus ditegakkan.",
        "Konteks Indonesia memperkuat urgensi: kredit hijau Rp2.075 triliun (26% kredit nasional) dengan porsi terbesar di UMKM (69%) dan keanekaragaman hayati (16,6%). Transisi di Indonesia sangat bertumpu pada ekonomi rakyat — analis kredit hijau di sini menilai warung, tambak, dan kebun rakyat sama seriusnya dengan PLTB korporasi.",
      ],
      tasks: [],
      note: {
        title: "💡 Tips: SPT yang baik",
        body: "Sustainability performance target yang baik: spesifik (intensitas emisi, bukan 'lebih hijau'), terukur (baseline jelas), bertenggat, dan ambisius tetapi realistis (di atas business-as-usual). SPT yang terlalu mudah = greenwashing yang dilegalkan lewat kontrak.",
      },
      hints: [
        "Tiga peran: biayai transisi, insentif via pricing, pantau & tegakkan konsekuensi.",
        "UMKM 69% dari kredit hijau — taksonomi harus bisa dipakai usaha kecil, bukan cuma korporasi.",
      ],
      reference: "Kreditur: danai transisi, pricing sebagai pendisiplin, pantau tenggat.",
    },
    {
      id: "lab-portofolio",
      eyebrow: "Langkah 8 · Lab",
      title: "Seberapa hijau portofoliomu?",
      prose: [
        "Bank Nusantara: total kredit Rp1.000 triliun; kredit hijau Rp260 triliun (26%). Rinciannya: UMKM Rp179,4 T; keanekaragaman hayati Rp43,2 T; lainnya Rp37,4 T. Hitung green asset ratio dan porsi tiap segmen dari kredit hijau, lalu beri flag konsentrasi bila satu segmen > 60%.",
        "Eksperimen: naikkan kredit hijau ke Rp300 triliun — berapa rasionya? Renungkan: rasio naik, tetapi konsentrasi UMKM makin ekstrem. Dua metrik, dua cerita.",
      ],
      formula: String.raw`\text{GAR} = \frac{\text{Kredit hijau}}{\text{Total kredit}} \times 100\%`,
      formulaNote: "GAR = green asset ratio; pembilang dan penyebut dalam satuan sama. Contoh: 260/1000 × 100% = 26%. Interpretasi: porsi portofolio yang terklasifikasi hijau — metrik headline bank, tetapi wajib dibaca bersama konsentrasi segmennya.",
      tasks: [
        { id: "t1", text: "Hitung `gar` (%) dan `porsi_umkm` (%)" },
        { id: "t2", text: "Jalankan dan pastikan hasilnya tercetak" },
      ],
      expected: "Green asset ratio: 26.0%\nPorsi UMKM dari kredit hijau: 69.0%",
      note: {
        title: "Intuisi",
        body: "Green asset ratio menjawab 'seberapa hijau bank ini?'. Porsi segmen menjawab 'hijau di mana?'. Bank dengan GAR 26% tetapi 69% di satu segmen punya risiko konsentrasi hijau — guncangan di segmen itu mengguncang seluruh narasi keberlanjutannya.",
      },
      hints: [
        "gar = kredit_hijau / total_kredit * 100.",
        "porsi_umkm = umkm / kredit_hijau * 100.",
      ],
      code: {
        starter: "# Triliun rupiah. JANGAN UBAH.\ntotal_kredit = 1000.0\nkredit_hijau = 260.0\numkm = 179.4\n\n# TULIS KODEMU: green asset ratio (%) dan porsi UMKM (%)\ngar =\nporsi_umkm =\nprint(f\"Green asset ratio: {gar:.1f}%\")\nprint(f\"Porsi UMKM dari kredit hijau: {porsi_umkm:.1f}%\")\n",
        lockLines: 5,
        solution: "# Triliun rupiah. JANGAN UBAH.\ntotal_kredit = 1000.0\nkredit_hijau = 260.0\numkm = 179.4\n\n# TULIS KODEMU: green asset ratio (%) dan porsi UMKM (%)\ngar = kredit_hijau / total_kredit * 100\nporsi_umkm = umkm / kredit_hijau * 100\nprint(f\"Green asset ratio: {gar:.1f}%\")\nprint(f\"Porsi UMKM dari kredit hijau: {porsi_umkm:.1f}%\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "GAR = 26%", msg: "260/1000.", name: "gar", value: 26.0, tol: 0.01 },
          { kind: "equal", task: "t1", label: "Porsi UMKM = 69%", msg: "179,4/260.", name: "porsi_umkm", value: 69.0, tol: 0.1 }
        ],
      },
      reference: "GAR = hijau/total. Porsi segmen = segmen/hijau. Waspadai konsentrasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Keputusan atas klaim hijau nasabah",
      prose: [
        "Satu: lolos semua uji (threshold + DNSH + bukti) → klasifikasi HIJAU; boleh label kredit hijau, pertimbangkan insentif pricing, tetapkan covenant pemantauan. Dua: gagal threshold tetapi punya rencana kredibel bertenggat → AMBER; biayai sebagai transition finance dengan SPT dan sunset clause di covenant.",
        "Tiga: gagal DNSH → MERAH; tolak label hijau (kredit boleh jalan sebagai kredit biasa bila layak secara risiko kredit murni — jangan campuradukkan). Empat: klaim tanpa data → kembalikan ke nasabah dengan daftar bukti yang diminta; jangan menilai dari brosur. Lima: aktivitas di luar cakupan TKBI v2 → 'belum diklasifikasi'; nilai risiko iklimnya seperti biasa (prasyarat risiko iklim), tanpa label hijau.",
        "Aturan praktis 10 detik: ada angka terverifikasi + lolos DNSH + ada tenggat → hijau/amber. Satu saja hilang → kembalikan atau tolak labelnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Keputusan klasifikasi dan keputusan kredit adalah dua keputusan berbeda. Nasabah merah bisa tetap dapat kredit (bila arus kasnya kuat); nasabah hijau bisa ditolak (bila tidak bisa membayar). Taksonomi menilai keberlanjutan, bukan kelayakan kredit — analis memakai keduanya.",
      },
      reference: "Hijau/amber/merah = label taksonomi. Layak kredit = keputusan terpisah.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Sawit 'berkelanjutan' di tepi hutan lindung",
      prose: [
        "PT Sawit Lestari mengajukan Rp200 miliar untuk perluasan kebun sawit, mengklaim 'perkebunan berkelanjutan' dengan sertifikasi internal perusahaan. Cek analis: (a) perluasan 500 ha berbatasan langsung dengan hutan lindung — kajian independen menemukan pembukaan 40 ha di zona penyangga tahun lalu; (b) tidak ada data emisi GRK sama sekali; (c) 'sertifikasi' berasal dari lembaga bentukan asosiasi industri, bukan auditor independen.",
        "Pertanyaan: (a) Klasifikasi TKBI-nya? (b) Red flags apa yang kena? (c) Keputusan analis? Pembahasan: (a) MERAH — gagal DNSH (perusakan zona penyangga hutan lindung) yang merupakan filter gugur; sektor sawit memang dicakup TKBI v2 (AFOLU) tetapi aktivitas ini tidak memenuhi syarat. (b) Tiga red flags: klaim tanpa angka (emisi), sertifikasi meragukan, dan potensi cherry-picking cakupan. (c) Tolak label hijau; kredit boleh dipertimbangkan sebagai kredit biasa HANYA bila lolos analisis risiko kredit murni — dan temuan DNSH justru menaikkan risiko reputasi/hukum yang harus di-pricing.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kasus sawit adalah pola greenwashing paling mahal di Indonesia: klaim lestari di atas deforestasi. Analis yang meloloskan label hijau di sini menempatkan bank pada risiko temuan OJK, gugatan, dan kerusakan reputasi — jauh melampaui Rp200 miliar kreditnya.",
      },
      reference: "Gagal DNSH = gugur. Sertifikasi internal ≠ bukti independen.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — taksonomi adalah soal verifikasi, bukan label.",
      ],
      tasks: [],
      summary: [
        "TKBI v2 (OJK, Feb 2025): kamus 'hijau' bersama; v1 energi saja, v2 + konstruksi, transportasi, kehutanan/sawit.",
        "Klasifikasi: GREEN selaras kini, AMBER transisi bertenggat (sunset), RED tidak selaras; syarat lintas warna: DNSH + remedial + sosial.",
        "Menilai klaim: petakan sektor → uji threshold → uji DNSH → verifikasi bukti → pantau & dokumentasikan.",
        "Red flags: tanpa angka, sertifikasi meragukan, cherry-picking, offset pengganti, tanpa tenggat.",
        "Peran kreditur: transition finance, pricing insentif (SPT), pantau tenggat dan tegakkan konsekuensi.",
      ],
      next: { label: "CR28 — Climate Risk Kredit", href: "/v2/learn/cr28-climate-risk-kredit" },
      quiz: [
        {
          q: "Apa beda utama TKBI v2 dari v1?",
          options: [
            { text: "v2 meluas ke konstruksi, transportasi, kehutanan/sawit; v1 hanya energi", why: "Benar: sesuai siaran pers OJK Feb 2025.", correct: true },
            { text: "v2 menghapus sektor energi", why: "Tidak — energi tetap dicakup, ditambah sektor baru." },
            { text: "v2 hanya untuk bank besar", why: "TKBI inklusif — bisa dipakai hingga UMKM." },
            { text: "v2 melarang kredit ke sektor merah", why: "TKBI adalah klasifikasi, bukan larangan." }
          ],
        },
        {
          q: "Nasabah memenuhi threshold emisi tetapi proyeknya merusak hutan lindung. Klasifikasi?",
          options: [
            { text: "Merah — gagal DNSH yang merupakan filter gugur", why: "Benar: satu pelanggaran signifikan menggugurkan klaim.", correct: true },
            { text: "Hijau — threshold terpenuhi", why: "Threshold saja tidak cukup tanpa DNSH." },
            { text: "Amber — diberi waktu memperbaiki hutan", why: "Kerusakan signifikan bukan 'perlu perbaikan' — ia diskualifikasi." },
            { text: "Belum diklasifikasi", why: "Sektornya ada di TKBI; hasilnya jelas merah." }
          ],
        },
        {
          q: "Mengapa amber bukan 'hijau kelas dua'?",
          options: [
            { text: "Amber adalah janji bertenggat (sunset); tanpa perbaikan ia gugur", why: "Benar: transisi harus ditepati dalam tenggat.", correct: true },
            { text: "Amber tidak boleh dibiayai bank", why: "Boleh — sebagai transition finance yang diawasi." },
            { text: "Amber tidak ada di TKBI", why: "Ada — kerangka acuan ATSF yang dipakai TKBI." },
            { text: "Amber = merah yang disamarkan", why: "Bukan — amber punya jalur kredibel menuju hijau." }
          ],
        },
        {
          q: "Red flag greenwashing yang paling mendasar?",
          options: [
            { text: "Klaim tanpa satu pun angka/metrik yang bisa diuji", why: "Benar: tanpa angka, tak ada yang bisa diverifikasi.", correct: true },
            { text: "Proposal memakai terlalu banyak warna hijau", why: "Desain bukan bukti — fokus ke substansi." },
            { text: "Perusahaan belum pernah dapat penghargaan", why: "Penghargaan bukan syarat taksonomi." },
            { text: "Sektornya belum ada di TKBI v2", why: "Itu keterbatasan cakupan, bukan red flag perilaku." }
          ],
        },
        {
          q: "Sustainability-linked loan: margin turun bila target tercapai. Fungsinya?",
          options: [
            { text: "Pricing sebagai pendisiplin: insentif finansial untuk transisi nyata", why: "Benar: SPT + konsekuensi harga.", correct: true },
            { text: "Hadiah untuk perusahaan yang sudah hijau", why: "Targetnya justru yang dalam transisi, bukan yang sudah hijau." },
            { text: "Pengganti analisis risiko kredit", why: "Tidak — kelayakan kredit dinilai terpisah." },
            { text: "Cara bank menaikkan margin", why: "Margin bisa turun — ini insentif dua arah." }
          ],
        }
      ],
      reference: "Taksonomi = verifikasi berlapis. Hijau itu dibuktikan, bukan diklaim.",
    },
  ],
};
