import type { V2Lesson } from "../lib/types";

const FIG_TCFD = `<svg viewBox="0 0 480 300" role="img" aria-label="Empat pilar TCFD/ISSB.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Empat pilar pengungkapan iklim (TCFD → ISSB S2)</text>
<rect x="30" y="55" width="200" height="90" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="130" y="85" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">1. Tata kelola</text>
<text x="130" y="108" font-size="10" fill="var(--chart-text)" text-anchor="middle">pengawasan direksi atas</text>
<text x="130" y="124" font-size="10" fill="var(--chart-text)" text-anchor="middle">risiko &amp; peluang iklim</text>
<rect x="250" y="55" width="200" height="90" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="350" y="85" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">2. Strategi</text>
<text x="350" y="108" font-size="10" fill="var(--chart-text)" text-anchor="middle">dampak pada bisnis &amp;</text>
<text x="350" y="124" font-size="10" fill="var(--chart-text)" text-anchor="middle">ketahanan skenario</text>
<rect x="30" y="165" width="200" height="90" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="130" y="195" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">3. Manajemen risiko</text>
<text x="130" y="218" font-size="10" fill="var(--chart-text)" text-anchor="middle">identifikasi &amp; integrasi</text>
<text x="130" y="234" font-size="10" fill="var(--chart-text)" text-anchor="middle">ke ERM</text>
<rect x="250" y="165" width="200" height="90" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="350" y="195" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">4. Metrik &amp; target</text>
<text x="350" y="218" font-size="10" fill="var(--chart-text)" text-anchor="middle">emisi scope 1-3,</text>
<text x="350" y="234" font-size="10" fill="var(--chart-text)" text-anchor="middle">target net-zero</text>
<text x="240" y="280" font-size="10" fill="var(--chart-text)" text-anchor="middle">ISSB S2 mengadopsi struktur ini menjadi standar wajib.</text>
</g>
</svg>`;

export const rr21: V2Lesson = {
  slug: "rr21-sustainability-reporting",
  track: "Risk Reporting",
  module: "Pelaporan Keberlanjutan",
  title: "RR21 — Sustainability Reporting: ISSB S1/S2 dan Konteks OJK",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan yang ditolak investor",
      prose: [
        "PT Hijau Lestari Tbk menerbitkan sustainability report 60 halaman — penuh foto penanaman pohon dan kata 'berkelanjutan'. Dua minggu kemudian, fund manager asing menjual seluruh sahamnya. Alasannya satu kalimat: 'Tidak ada data emisi scope 3, tidak ada skenario iklim, tidak selaras ISSB. Kami tidak bisa menilai risiko.'",
        "Twist-nya: laporan itu mahal (konsultan Rp800 juta) tetapi tidak berguna — karena tidak menjawab pertanyaan investor: berapa emisimu, bagaimana strategimu bertahan di dunia 2°C, dan apa targetmu. Sustainability reporting modern bukan CSR — ia adalah risk reporting. Setelah lesson ini kamu bisa: (1) menjelaskan ISSB S1 & S2 dan empat pilarnya; (2) membedakan materialitas finansial vs ganda; (3) menilai kesiapan pengungkapan (gap assessment); (4) menghitung financed emissions sederhana.",
        "Sudut pandang investor: mereka tidak membaca laporanmu untuk dikagumi \u2014 mereka membacanya untuk memutuskan beli, tahan, atau jual. Setiap halaman tanpa angka adalah halaman yang dilewati. Analis risk reporting yang menulis dengan kacamata investor menghasilkan laporan yang dibaca; yang menulis dengan kacamata humas menghasilkan laporan yang diarsipkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "OJK mewajibkan laporan keberlanjutan bagi lembaga jasa keuangan (POJK 51/2017) dan mendorong adopsi standar internasional. Analis risk reporting yang paham ISSB = analis yang bisa menjembatani regulator, investor, dan direksi.",
      },
      reference: "Sustainability report = risk report. ISSB = bahasanya.",
    },
    {
      id: "issb",
      eyebrow: "Langkah 2 · Konsep",
      title: "ISSB S1 & S2: apa yang wajib diungkap",
      prose: [
        "ISSB (International Sustainability Standards Board) menerbitkan dua standar: S1 — persyaratan UMUM pengungkapan risiko & peluang keberlanjutan yang memengaruhi arus kas dan nilai perusahaan; S2 — persyaratan KHUSUS iklim (emisi, skenario, target). Keduanya dibangun di atas empat pilar TCFD: tata kelola, strategi, manajemen risiko, metrik & target. S1 = kerangka, S2 = isi iklim.",
        "Jadwal adopsi global bergerak cepat: yurisdiksi seperti Inggris, Jepang, dan Singapura mengadopsi atau menyelaraskan dengan ISSB; Indonesia melalui OJK memantau dan menyiapkan kerangka adopsi. Artinya analis Indonesia tidak punya kemewahan \u2018tunggu sampai wajib\u2019 \u2014 investor asing sudah menuntutnya hari ini. Kesiapan dini = keunggulan kompetitif bank dalam mengakses modal global.",
        "Analisis skenario iklim — persyaratan S2 yang paling ditakuti dan paling berharga. Caranya: pilih 2-3 skenario (mis. Net Zero 2050 dari NGFS, Delayed Transition, Current Policies), terjemahkan ke variabel ekonomi (harga karbon, harga energi, pertumbuhan sektor), lalu hitung dampak ke portofolio: berapa debitur yang arus kasnya jebol bila harga karbon Rp500 ribu/ton? Skenario bukan ramalan — ia uji ketahanan. Bank yang pernah menghitung ini tidak panik saat regulasi karbon tiba; bank yang belum akan menghitung sambil panik.",
        "Sumber skenario yang kredibel: NGFS (Network for Greening the Financial System) menerbitkan skenario iklim untuk bank sentral — gratis dan menjadi rujukan global; IEA Net Zero pathway untuk asumsi harga energi. Jangan membuat skenario dari nol bila ada standar industri: gunakan yang umum agar hasilmu bisa dibandingkan antar bank. Komparabilitas adalah nilai tambah yang dihargai investor.",
        "Yang membedakan ISSB dari laporan CSR lama: (1) materialitas FINANSIAL — ungkap yang memengaruhi nilai perusahaan, bukan yang 'baik untuk diceritakan'; (2) angka, bukan narasi — emisi scope 1/2/3 dalam ton CO2e, bukan 'kami peduli lingkungan'; (3) skenario — ketahanan strategi diuji terhadap skenario iklim (mis. 1,5°C vs 3°C); (4) target terukur dengan baseline dan tenggat.",
        "Tiga miskonsepsi. Satu: 'ISSB = standar Eropa.' ISSB itu GLOBAL (IFRS Foundation); standar Eropa = ESRS (lebih luas, double materiality). Dua: 'Hanya untuk emiten besar.' Trennya meluas — rantai pasok dan debitur bank ikut diminta datanya. Tiga: 'Scope 3 terlalu sulit, bisa dilewatkan.' S2 mewajibkan scope 3 bila material — dan untuk bank, scope 3 (financed emissions) adalah 99%+ jejaknya.",
      ],
      figure: {
        svg: FIG_TCFD,
        alt: "Empat pilar TCFD/ISSB.",
        caption: "ISSB S2 mengadopsi struktur ini menjadi standar wajib.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Laporan keberlanjutan kami sudah 100 halaman — pasti cukup.” Halaman bukan metrik; kelengkapan empat pilar + angka adalah metriknya. Lab pertama mengukur ini secara objektif.",
      },
      hints: [
        "Hafalkan: S1 = umum, S2 = iklim; 4 pilar = tata kelola, strategi, risiko, metrik.",
        "Untuk bank: fokus ke S2 + financed emissions (scope 3 kategori 15).",
      ],
      reference: "S1 umum, S2 iklim. Materialitas finansial + angka + skenario.",
    },
    {
      id: "materialitas",
      eyebrow: "Langkah 3 · Konsep",
      title: "Materialitas: finansial vs ganda",
      prose: [
        "Dua mazhab materialitas. Materialitas FINANSIAL (ISSB): ungkap informasi keberlanjutan yang memengaruhi keputusan investor — 'apakah ini mengubah penilaian atas arus kas perusahaan?' Materialitas GANDA (ESRS Eropa): tambah sisi kedua — 'apakah perusahaan BERDAMPAK pada lingkungan/masyarakat?' (inside-out). ISSB memakai yang pertama; Eropa memakai keduanya.",
        "Implikasi praktis: bank Indonesia yang melapor ke investor global memakai lensa ISSB (dampak iklim TERHADAP bank: risiko kredit debitur tambang, misalnya). Bila juga beroperasi di Eropa atau melapor ke standar Eropa, tambah lensa dampak (dampak bank TERHADAP iklim: financed emissions). Keduanya bertemu di satu titik: financed emissions — ia material secara finansial (risiko transisi) SEKALIGUS dampak (jejak karbon).",
        "Dua miskonsepsi. Satu: 'Double materiality = ungkap semuanya.' Tidak — tetap ada ambang materialitas di tiap sisi; bedanya ada dua sisi yang diuji. Dua: 'Materialitas = pendapat manajemen.' Prosesnya harus TERDOKUMENTASI: kriteria, stakeholder yang dikonsultasikan, ambang kuantitatif. Auditor akan menguji prosesnya.",
        "Contoh matriks materialitas bank: sumbu horizontal = dampak finansial (tinggi: risiko kredit sektor batu bara; rendah: konsumsi kertas kantor), sumbu vertikal = dampak lingkungan/sosial (tinggi: financed emissions; rendah: sampah kantor). Kuadran kanan-atas = wajib ungkap detail; kuadran kiri-bawah = sebutkan ringkas. Matriks ini \u2014 bukan daftar isi generik \u2014 yang menentukan isi laporanmu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Topik ini material karena viral di media.” Viral ≠ material finansial. Uji: apakah ia mengubah arus kas, biaya modal, atau nilai aset secara terukur? Bila tidak, ia isu reputasi — dikelola, bukan diungkap sebagai risiko finansial.",
      },
      hints: [
        "Buat matriks materialitas: sumbu finansial × sumbu dampak — plot tiap topik.",
        "Dokumentasikan ambang: mis. >5% pendapatan terdampak = material.",
      ],
      reference: "ISSB = outside-in. ESRS = tambah inside-out. Financed emissions = keduanya.",
    },
    {
      id: "ojk",
      eyebrow: "Langkah 4 · Konsep",
      title: "Konteks Indonesia: OJK dan peta jalan",
      prose: [
        "Indonesia tidak menunggu: POJK 51/2017 mewajibkan LJK (bank, asuransi, dll.) menerbitkan laporan keberlanjutan; Taksonomi Hijau Indonesia mengklasifikasikan aktivitas ekonomi hijau; OJK mendorong keuangan berkelanjutan lewat roadmap. Arahnya jelas: dari voluntary CSR → mandatory disclosure selaras standar global.",
        "Tantangan khas Indonesia: (1) data emisi debitur UMKM praktis tidak ada — butuh proksi/estimasi; (2) sektor berisiko tinggi (sawit, tambang, energi) adalah debitur besar bank — financed emissions terkonsentrasi; (3) kapasitas SDM sustainability reporting masih langka — analis yang paham ini punya nilai tawar tinggi.",
        "Dua miskonsepsi. Satu: 'Taksonomi hijau = daftar larangan.' Bukan — ia klasifikasi (hijau/kuning/merah) untuk mengarahkan modal, bukan melarang seketika. Dua: 'Bank kecil tidak terdampak.' Rantai persyaratan mengalir: investor → bank besar → debitur → UMKM. Cepat atau lambat mencapai semua.",
        "Satu peluang yang jarang disadari: Taksonomi Hijau Indonesia memberi bank kerangka untuk mengklasifikasikan portofolio hijaunya \u2014 dan portofolio hijau yang terverifikasi bisa mengakses pendanaan lebih murah (green bond, sustainability-linked loan). Sustainability reporting yang baik bukan beban biaya; ia adalah tiket ke kolam modal yang lebih murah. Analis yang bisa menghitung ini berbicara dalam bahasa CFO.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko transisi untuk bank Indonesia itu nyata: debitur tambang batu bara menghadapi penurunan permintaan global; debitur sawit menghadapi standar deforestasi UE. Sustainability reporting yang baik = peta risiko transisi portofolio kredit.",
      },
      hints: [
        "Pantau perkembangan adopsi ISSB oleh OJK — statusnya bergerak cepat.",
        "Mulai dari financed emissions sektor terbesar — 80/20.",
      ],
      formula: String.raw`\text{Financed emissions} = \sum_i \frac{\text{pinjaman}_i}{\text{aset}_i} \times \text{emisi}_i`,
      formulaNote: "Metode atribusi PCAF: bank mewarisi emisi debitur proporsional dengan porsi pendanaannya. pinjaman_i = eksposur bank ke debitur i; aset_i = total aset debitur i; emisi_i = emisi scope 1+2 debitur i. Interpretasi: Rp500 M pinjaman ke perusahaan ber-aset Rp2 T = bank memiliki 25 persen emisinya. Sederhana, transparan, menjadi bahasa umum investor.",
      reference: "POJK 51/2017 → ISSB. Data UMKM = tantangan; sektor ekstraktif = fokus.",
    },
    {
      id: "lab-gap",
      eyebrow: "Langkah 5 · Lab",
      title: "Gap assessment empat pilar",
      prose: [
        "Empat pilar, masing-masing dengan sub-item. Hitung skor kelengkapan (%) per pilar dan rata-rata; tandai pilar di bawah 70% sebagai GAP yang harus ditutup sebelum laporan terbit.",
        "Perhatikan: hanya 'Tata kelola' yang lolos — pola umum perusahaan Indonesia: governance kuat (mudah ditulis), metrik lemah (sulit diukur). Eksperimen: naikkan 'Metrik & target' menjadi 6/7 — berapa rata-ratanya? Inilah prioritas kerja yang terukur.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor % per pilar; tandai GAP bila < 70%" },
        { id: "t2", text: "Hitung rata-rata keseluruhan dan cetak" },
      ],
      expected: "Tata kelola: 75% -> OK\nStrategi: 62% -> GAP\nManajemen risiko: 50% -> GAP\nMetrik & target: 57% -> GAP\nRata-rata: 61%",
      note: {
        title: "💡 Intuisi",
        body: "Gap assessment mengubah 'laporan kami kurang' menjadi 'tiga pilar di bawah 70%, butuh 9 sub-item lagi'. Yang terukur bisa direncanakan; yang samar hanya bisa dikhawatirkan.",
      },
      hints: [
        "skor = penuhi / total * 100; format 0 desimal.",
        "Akumulasi penuhi & total untuk rata-rata.",
      ],
      code: {
        starter: "# (pilar, terpenuhi, total). JANGAN UBAH.\ntcfd = [(\"Tata kelola\", 3, 4), (\"Strategi\", 5, 8), (\"Manajemen risiko\", 2, 4), (\"Metrik & target\", 4, 7)]\n\n# TULIS KODEMU: skor per pilar + rata-rata\ntotal_p, total_t = 0, 0\nfor pilar, penuhi, total in tcfd:\n    skor = \n    total_p += penuhi\n    total_t += total\n    status = \"GAP\" if skor < 70 else \"OK\"\n    print(f\"{pilar}: {skor:.0f}% -> {status}\")\nprint(f\"Rata-rata: {total_p/total_t*100:.0f}%\")\n",
        lockLines: 8,
        solution: "# (pilar, terpenuhi, total). JANGAN UBAH.\ntcfd = [(\"Tata kelola\", 3, 4), (\"Strategi\", 5, 8), (\"Manajemen risiko\", 2, 4), (\"Metrik & target\", 4, 7)]\n\n# TULIS KODEMU: skor per pilar + rata-rata\ntotal_p, total_t = 0, 0\nfor pilar, penuhi, total in tcfd:\n    skor = penuhi / total * 100\n    total_p += penuhi\n    total_t += total\n    status = \"GAP\" if skor < 70 else \"OK\"\n    print(f\"{pilar}: {skor:.0f}% -> {status}\")\nprint(f\"Rata-rata: {total_p/total_t*100:.0f}%\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Tata kelola 75 OK", msg: "3/4.", pattern: "Tata kelola: 75% -> OK" },
          { kind: "stdout_matches", task: "t1", label: "Strategi GAP", msg: "5/8 = 62.5 -> 62.", pattern: "Strategi: 62% -> GAP" },
          { kind: "stdout_matches", task: "t2", label: "Rata-rata 61", msg: "14/23.", pattern: "Rata-rata: 61%" },
        ],
      },
      reference: "Skor = penuhi/total. <70% = GAP.",
    },
    {
      id: "lab-emisi",
      eyebrow: "Langkah 6 · Lab",
      title: "Financed emissions sederhana",
      prose: [
        "Dua debitur dengan pinjaman dan emisinya. Emisi yang 'dibiayai' bank = (pinjaman / total aset debitur) × emisi debitur — faktor atribusi PCAF. Jumlahkan menjadi total financed emissions portofolio.",
        "Perhatikan skalanya: Rp800 miliar pinjaman 'membiayai' 37.000 tCO2 — sementara emisi operasional bank sendiri (listrik kantor) mungkin hanya ratusan ton. Inilah mengapa S2 mewajibkan scope 3 untuk bank: 99%+ jejaknya ada di portofolio, bukan di kantornya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung emisi yang dibiayai per debitur = pinjaman/aset * emisi" },
        { id: "t2", text: "Jumlahkan dan cetak total financed emissions" },
      ],
      expected: "PT A: 25000 tCO2\nPT B: 12000 tCO2\nTotal financed emissions: 37000 tCO2",
      note: {
        title: "💡 Intuisi",
        body: "Satu perkalian sederhana mengubah bank dari 'perusahaan jasa bersih' menjadi 'penyandang dana 37.000 ton CO2'. Angka ini — bukan foto pohon — yang dibaca investor.",
      },
      hints: [
        "dibiayai = pinj / aset * emisi.",
        "Format 0 desimal (bilangan bulat).",
      ],
      code: {
        starter: "# (debitur, pinjaman RpM, emisi tCO2, total aset RpM). JANGAN UBAH.\ndata = [(\"PT A\", 500, 100000, 2000), (\"PT B\", 300, 60000, 1500)]\n\n# TULIS KODEMU: financed emissions per debitur + total\ntotal = 0\nfor nama, pinj, emisi, aset in data:\n    dibiayai = \n    total += dibiayai\n    print(f\"{nama}: {dibiayai:.0f} tCO2\")\nprint(f\"Total financed emissions: {total:.0f} tCO2\")\n",
        lockLines: 7,
        solution: "# (debitur, pinjaman RpM, emisi tCO2, total aset RpM). JANGAN UBAH.\ndata = [(\"PT A\", 500, 100000, 2000), (\"PT B\", 300, 60000, 1500)]\n\n# TULIS KODEMU: financed emissions per debitur + total\ntotal = 0\nfor nama, pinj, emisi, aset in data:\n    dibiayai = pinj / aset * emisi\n    total += dibiayai\n    print(f\"{nama}: {dibiayai:.0f} tCO2\")\nprint(f\"Total financed emissions: {total:.0f} tCO2\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "PT A 25000", msg: "500/2000×100000.", pattern: "PT A: 25000 tCO2" },
          { kind: "stdout_matches", task: "t1", label: "PT B 12000", msg: "300/1500×60000.", pattern: "PT B: 12000 tCO2" },
          { kind: "stdout_matches", task: "t2", label: "Total 37000", msg: "25000+12000.", pattern: "Total financed emissions: 37000 tCO2" },
        ],
      },
      reference: "Dibiayai = (pinjaman/aset) × emisi. Jumlahkan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Menyusun laporan keberlanjutan pertama",
      prose: [
        "Satu: tetapkan standar acuan — ISSB S1/S2 (global) + POJK 51/2017 (lokal); jangan campur aduk tanpa peta. Dua: jalankan materiality assessment terdokumentasi — hasilnya menentukan ISI laporan. Tiga: gap assessment empat pilar (lab pertama) — tutup GAP sebelum menulis. Empat: kumpulkan data — mulai dari financed emissions sektor terbesar (80/20). Lima: tulis angka dulu, narasi kemudian — setiap klaim naratif harus punya angka pendukung. Enam: assurance — minta pihak independen memverifikasi (limited assurance minimum).",
        "Aturan praktis 10 detik: standar → materialitas → gap → data → angka → assurance. Laporan tanpa assurance = klaim tanpa saksi.",
        "Tujuh: bangun data pipeline, bukan proyek tahunan. Laporan keberlanjutan yang disusun dengan \u2018proyek lembur 2 bulan\u2019 setiap tahun akan selalu terlambat dan berantakan. Desain pengumpulan data emisi sebagai proses rutin \u2014 template kuesioner debitur, jadwal pengumpulan, pemilik data per divisi. Tahun kedua menjadi 50 persen lebih mudah bila tahun pertama membangun pipa, bukan hanya laporan.",
        "Delapan: siapkan narasi untuk angka buruk. Financed emissions pertamamu akan BESAR dan MEMALUKAN — itu normal untuk bank dengan portofolio ekstraktif. Jangan sembunyikan; jelaskan konteksnya (baseline tahun pertama, tren yang ditargetkan, aksi mitigasi). Investor menghukum kebohongan, bukan angka buruk yang jujur. Laporan pertama adalah titik awal, bukan vonis.",
        "Sembilan: selaraskan dengan laporan keuangan. ISSB diterbitkan IFRS Foundation dengan sengaja — agar pengungkapan keberlanjutan DIBACA BERSAMAAN dengan laporan keuangan, bukan sebagai dokumen terpisah. Praktik terbaik: cross-reference (catatan keuangan X merujuk ke pengungkapan S2 Y), periode pelaporan sama, dan asumsi yang konsisten (harga karbon yang dipakai di impairment test = yang dipakai di skenario iklim). Inkonsistensi antar laporan = temuan auditor.",
        "Sepuluh: latih direksi membaca laporan ini. Laporan keberlanjutan terbaik gagal bila direksi tidak paham isinya — mereka yang menandatangani dan mempertanggungjawabkannya ke pemegang saham. Sediakan ringkasan eksekutif 2 halaman: financed emissions total, tren, 3 risiko transisi terbesar, dan target. Bila direksi hanya membaca 2 halaman itu, pastikan 2 halaman itu benar.",
        "Refleksi karir: sustainability reporting adalah bidang di mana permintaan talenta jauh melampaui pasokan — terutama analis yang menguasai KEDUA sisi: standar (ISSB) dan angka (financed emissions, skenario). Lesson ini memberimu keduanya. Di wawancara, jangan bilang \u2018saya peduli lingkungan\u2019; tunjukkan kamu bisa menghitung financed emissions dan menjelaskan S2. Itu pembedanya.",
        "Satu prinsip penutup untuk dibawa pulang: laporan keberlanjutan yang baik menjawab tiga pertanyaan dalam 30 detik pertama — berapa emisimu, apa risiko iklim terbesarmu, dan apa targetmu. Bila pembaca harus mencari 40 halaman untuk menemukan angkanya, laporanmu gagal walau datanya benar. Kejelasan adalah bentuk kejujuran. Dan kejujuran yang terukur adalah fondasi kepercayaan investor di era transparansi ini.",
        "Satu jebakan: greenwashing. Klaim 'net-zero 2060' tanpa baseline, tanpa peta jalan interim, tanpa angka = greenwashing yang bisa digugat. Setiap target harus punya: baseline tahun, angka interim (2030), dan metodologi. Bila belum punya, lebih baik TIDAK mengklaim daripada mengklaim tanpa dasar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Greenwashing bukan hanya isu reputasi — regulator (termasuk OJK) dan gugatan perdata mulai menargetkannya. Legal harus meninjau setiap klaim kuantitatif di laporan. Analis risk reporting = garda depan anti-greenwashing.",
      },
      reference: "Standar → materialitas → gap → data → angka → assurance.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bank Artha Dana: laporan pertama",
      prose: [
        "Bank Artha Dana (aset Rp50 triliun) harus menerbitkan laporan keberlanjutan perdananya. Portofolio: 40% ke sektor ekstraktif & perkebunan, 30% manufaktur, 30% ritel/UMKM. Data emisi debitur: hanya 10 debitur besar yang punya. Tim sustainability: 3 orang, baru dibentuk.",
        "Pertanyaan: (a) Strategi pengumpulan data apa? (b) Apa yang diungkap tahun pertama vs ditunda? Pembahasan: (a) 80/20: hitung financed emissions 10 debitur besar dulu (mungkin mencakup 60%+ emisi portofolio); untuk sisanya pakai proksi sektor (emisi per Rp pinjaman dari data industri) dengan pengungkapan metodologi yang jujur ('estimasi berbasis proksi'). (b) Tahun pertama: S2 untuk portofolio (financed emissions + konsentrasi sektor), tata kelola, target interim yang realistis. Tunda: scope 3 rantai pasok penuh, skenario kuantitatif detail — nyatakan sebagai 'rencana pengembangan'. Pelajaran: laporan pertama yang jujur tentang keterbatasannya > laporan pertama yang berpura-pura lengkap.",
        "Pertanyaan lanjutan: (c) Bagaimana meyakinkan direksi untuk mendanai ini? Pembahasan: bahasa direksi = risiko dan modal. Tunjukkan: investor asing menjual saham bank sejenis karena disclosure buruk (risiko valuasi); financed emissions tinggi = risiko transisi yang belum terpetakan (risiko kredit masa depan); biaya konsultan Rp800 juta < biaya modal yang naik 50bps. Sustainability reporting = manajemen risiko dengan baju berbeda \u2014 dan direksi paham bahasa risiko.",
        "Satu catatan tentang UMKM: jangan bebankan kuesioner emisi 20 halaman ke debitur kecil — mereka akan kabur ke bank lain. Gunakan proksi sektor yang transparan dan sederhanakan: untuk kredit di bawah ambang tertentu, estimasi berbasis jenis usaha sudah cukup, dengan pengungkapan metodologi. Prinsipnya: presisi proporsional dengan ukuran eksposur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kejujuran metodologi ('data ini estimasi proksi') justru MENINGKATKAN kredibilitas — investor lebih percaya pada bank yang tahu keterbatasannya daripada bank yang mengklaim sempurna. Transparansi tentang ketidakpastian = kedewasaan pelaporan.",
      },
      reference: "80/20 data. Jujur tentang proksi. Klaim sesuai bukti.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "ISSB S1 = umum, S2 = iklim; empat pilar = tata kelola, strategi, manajemen risiko, metrik & target — halaman bukan metrik, angka adalah.",
        "Materialitas finansial: ungkap yang memengaruhi nilai perusahaan, bukan CSR foto penanaman pohon — laporan mahal tak berguna bila tak menjawab pertanyaan investor.",
        "Analisis skenario iklim (S2) adalah persyaratan paling ditakuti dan paling berharga: pilih 2–3 skenario, sumber kredibelnya NGFS.",
        "ISSB itu global (IFRS Foundation); Eropa = ESRS (double materiality); di Indonesia POJK 51/2017 mewajibkan laporan keberlanjutan bagi lembaga jasa keuangan.",
      ],
      quiz: [
        {
          q: "Perbedaan ISSB S1 dan S2:",
          options: [
            { text: "S1 = persyaratan umum; S2 = persyaratan khusus iklim", why: "Benar: S1 kerangka umum, S2 pendalaman iklim.", correct: true },
            { text: "S1 = untuk bank; S2 = untuk manufaktur", why: "ISSB berlaku lintas sektor, bukan per industri." },
            { text: "S1 = sukarela; S2 = wajib", why: "Keduanya standar; kewajiban tergantung yurisdiksi." },
            { text: "S1 = Eropa; S2 = global", why: "Keduanya global; Eropa punya ESRS sendiri." },
          ],
        },
        {
          q: "Untuk bank, komponen emisi terbesar yang wajib diungkap S2 adalah:",
          options: [
            { text: "Scope 3 kategori 15: financed emissions (portofolio)", why: "Benar: portofolio kredit = emisi terbesar bank.", correct: true },
            { text: "Scope 1: emisi langsung kantor", why: "Operasional bank kecil dibanding portofolio." },
            { text: "Scope 2: listrik kantor", why: "Listrik kantor minor dibanding financed emissions." },
            { text: "Emisi perjalanan dinas direksi", why: "Itu Scope 3 kategori 6 — kecil untuk bank." },
          ],
        },
        {
          q: "Materialitas ganda (double materiality) berarti menguji:",
          options: [
            { text: "Dampak keberlanjutan TERHADAP perusahaan DAN dampak perusahaan TERHADAP lingkungan/masyarakat", why: "Benar: dua arah = inti double materiality.", correct: true },
            { text: "Dua tahun buku sekaligus", why: "Bukan soal periode; soal arah dampak." },
            { text: "Materialitas finansial dua kali lipat ambangnya", why: "Bukan penggandaan ambang; melainkan dua perspektif." },
            { text: "Laporan dalam dua bahasa", why: "Bahasa bukan konsep materialitas." },
          ],
        },
        {
          q: "Klaim 'net-zero 2060' tanpa baseline dan peta jalan interim adalah:",
          options: [
            { text: "Greenwashing — klaim tanpa dasar yang bisa digugat", why: "Benar: tanpa baseline dan peta jalan = klaim kosong.", correct: true },
            { text: "Praktik umum yang dapat diterima", why: "Umum bukan berarti benar; regulator menindak." },
            { text: "Cukup selama direksi menyetujui", why: "Persetujuan direksi tidak menggantikan bukti." },
            { text: "Wajib menurut ISSB", why: "ISSB menuntut transparansi, bukan klaim tanpa dasar." },
          ],
        },
        {
          q: "Langkah pertama menyusun laporan keberlanjutan perdana:",
          options: [
            { text: "Tetapkan standar acuan + materiality assessment terdokumentasi", why: "Benar: fondasi dulu sebelum menulis.", correct: true },
            { text: "Sewa fotografer untuk foto kegiatan CSR", why: "Foto bukan substansi laporan." },
            { text: "Tulis narasi 60 halaman dulu", why: "Narasi tanpa kerangka = greenwashing berisiko." },
            { text: "Tentukan target net-zero yang ambisius", why: "Target tanpa baseline = klaim kosong." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kita tunggu aturan OJK final baru mulai.” Aturan bergerak ke arah yang sudah jelas (ISSB). Menunggu = tertinggal 2 tahun dari pesaing yang sudah mulai. Mulai dari gap assessment — ia berguna apapun versi final aturannya.",
      },
      hints: [
        "Uji cepat: sebutkan 4 pilar + bedakan S1/S2 tanpa melihat catatan.",
        "Ingat rumus atribusi: (pinjaman/aset) × emisi.",
      ],
      reference: "Angka dulu, narasi kemudian. Klaim sesuai bukti.",
    },
  ],
};
