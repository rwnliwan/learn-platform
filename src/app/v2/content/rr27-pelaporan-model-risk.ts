import type { V2Lesson } from "../lib/types";

const FIG_UMUR = `<svg viewBox="0 0 520 300" role="img" aria-label="Umur validasi lima model vs ambang tier-nya.">
<g font-family="var(--font-ui)">
<text x="10" y="40" font-size="11" fill="var(--chart-text)">PD Scorecard UMKM v2 (T1)</text>
<rect x="250" y="24" width="126" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="382" y="42" font-size="11" fill="var(--chart-text)">14 bln</text>
<text x="10" y="92" font-size="11" fill="var(--chart-text)">LGD Model Korporasi (T1)</text>
<rect x="250" y="76" width="180" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="436" y="94" font-size="11" fill="var(--chart-text)">20 bln</text>
<text x="10" y="144" font-size="11" fill="var(--chart-text)">Fraud Score E-channel (T2)</text>
<rect x="250" y="128" width="261" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="517" y="146" font-size="11" fill="var(--chart-text)">29 bln</text>
<text x="10" y="196" font-size="11" fill="var(--chart-text)">Pricing Model Ritel (T2)</text>
<rect x="250" y="180" width="81" height="24" fill="var(--c3)" opacity="0.9"/>
<text x="337" y="198" font-size="11" fill="var(--chart-text)">9 bln</text>
<text x="10" y="248" font-size="11" fill="var(--chart-text)">Churn Model Tabungan (T3)</text>
<rect x="250" y="232" width="189" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="445" y="250" font-size="11" fill="var(--chart-text)">21 bln</text>
<line x1="358" y1="10" x2="358" y2="262" stroke="var(--chart-text)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="358" y="282" font-size="11" fill="var(--chart-text)" text-anchor="middle">ambang T1 = 12 bln</text>
</g>
</svg>`;

export const rr27: V2Lesson = {
  slug: "rr27-pelaporan-model-risk",
  track: "Risk Reporting",
  module: "Pelaporan Model Risk",
  title: "RR27 — Pelaporan Model Risk: Inventaris, Validasi, Monitoring",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Bank memakai ratusan model: scorecard kredit, LGD, pricing, fraud, churn, hingga peramalan likuiditas. Sebagian keputusan model ini = keputusan yang menggerakkan ratusan miliar rupiah. Pelaporan model risk menjawab satu pertanyaan sederhana: untuk setiap model yang dipakai, apakah ia masih layak dipercaya hari ini?",
        "Isi lesson: (1) cerita — model yang 'sudah divalidasi' ternyata validasinya kadaluarsa 14 bulan; (2) konsep — inventaris model; (3) konsep — status validasi & temuan terbuka; (4) konsep — tiering model; (5) konsep — monitoring kinerja sebagai baris laporan; (6) lab — hitung status inventaris 5 model; (7) peta keputusan — temuan → respons; (8) mini-case — laporan triwulan Bank Nusa Prima; (9) checkpoint.",
        "Setelah lesson ini kamu bisa: (1) menyusun inventaris model minimal (pemilik, tier, tanggal validasi); (2) menentukan status tiap model dari umur validasi & tier-nya; (3) membaca baris monitoring (drift, penurunan akurasi) sebagai sinyal laporan; (4) menentukan kapan temuan masuk jalur eskalasi komite; (5) menyusun laporan model risk 1 halaman untuk manajemen.",
      ],
      tasks: [],
      reference: "Pertanyaan sentral: model ini masih layak dipercaya hari ini?",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Model yang 'sudah divalidasi'",
      prose: [
        "Audit internal Bank Cahaya Timur memeriksa scorecard UMKM. Dokumen lengkap: laporan validasi awal, tanda tangan kepala unit, label 'VALID'. Semua orang tenang — model ini kan sudah divalidasi. Lalu auditor melihat satu tanggal: validasi terakhir 14 bulan lalu. Ambang tier-1 bank itu sendiri: 12 bulan. Model ini sudah kadaluarsa 2 bulan — dan selama itu menyetujui Rp180 miliar kredit UMKM tanpa ada yang mempertanyakan.",
        "Twist-nya: tidak ada yang curang, tidak ada yang lalai secara personal. Modelnya dulu divalidasi dengan benar, hasilnya bagus. Yang hilang bukan kualitas modelnya — melainkan LAPORANNYA. Tidak ada inventaris yang menghitung umur validasi, tidak ada baris 'kadaluwarsa' di laporan berkala, tidak ada yang ditugasi menjawab 'masih valid atau tidak' tiap bulan. Model ini bukan model yang buruk; ia adalah model yang menjadi buruk dalam diam.",
        "Inilah fungsi pelaporan model risk: bukan menilai model sekali lalu melupakannya, melainkan menjadikannya objek pelaporan rutin — seperti portofolio kredit yang dilaporkan tiap bulan. Inventaris, status validasi, temuan terbuka, monitoring kinerja: empat kolom yang mencegah 'model hantu' menyetujui kredit dalam gelap.",
        "Analogi 💡: validasi model = SIM. SIM yang sah 5 tahun lalu tidak membuatmu pengemudi berizin hari ini. Umur validasi = masa berlaku SIM; melewati ambang = mengemudi tanpa SIM, walau skill mengemudimu sama.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rp180 miliar disetujui model tanpa izin berlaku. Model risk bukan risiko 'teknis' — ia risiko kredit yang berpenampilan sebagai risiko teknis. Itulah sebabnya ia dilaporkan ke komite risiko, bukan disimpan di folder data scientist.",
      },
      reference: "Model yang tidak dilaporkan = model yang menua dalam gelap.",
    },
    {
      id: "inventaris",
      eyebrow: "Langkah 3 · Konsep",
      title: "Inventaris model: tidak terdaftar = tidak diatur",
      prose: [
        "Definisi: inventaris model = daftar resmi SEMUA model yang dipakai bank untuk keputusan atau pelaporan, lengkap dengan pemilik, tujuan bisnis, dan tier risikonya. Aturannya sederhana: yang tidak terdaftar tidak bisa diatur — ia tidak punya jadwal validasi, tidak punya pemilik yang ditagih, dan tidak muncul di laporan.",
        "Kolom minimal inventaris: (1) nama & versi model; (2) pemilik bisnis (bukan tim model — pemilik adalah unit yang keputusannya bergantung pada model, mis. divisi kredit); (3) tujuan/penggunaan yang disetujui; (4) tier risiko model (Langkah 5); (5) tanggal validasi terakhir + tanggal validasi berikutnya yang dijadwalkan; (6) status (valid / perlu validasi ulang / eskalasi komite).",
        "Musuh inventaris: model bayangan. Analis membangun scorecard di laptop untuk 'membantu' keputusan, lalu tim kredit memakainya rutin tanpa pernah mendaftarkan. Deteksi: tanya tiap unit 'keputusan apa yang memakai angka dari model yang tidak ada di inventaris?' — jawaban jujur biasanya mengejutkan. Aturan: model yang dipakai keputusan = wajib terdaftar, tanpa pengecualian 'cuma membantu'.",
        "Pemilik vs pembuat: tim data science MEMBANGUN model, tetapi pemilik adalah unit bisnis yang menanggung rugi jika model salah. Scorecard UMKM dimiliki divisi kredit — karena Rp180 miliar di cerita pembuka adalah uang mereka. Pembuat tanpa pemilik = tidak ada yang punya insentif menjaga model tetap valid.",
        "Inventaris hidup: setiap model baru didaftarkan SEBELUM dipakai (bukan sesudah), setiap model pensiun dicoret dengan tanggal pensiun. Inventaris yang tidak pernah berkurang = kuburan model: model mati tetap tercatat 'valid' dan bisa 'dibangkitkan' tanpa validasi.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 6 kolom minimal inventaris model" },
        { id: "t2", text: "Jelaskan beda pemilik vs pembuat model dalam 1 kalimat" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cInventaris = daftar Excel yang dibuat sekali.\u201d Inventaris mati = tidak ada jadwal validasi berikutnya yang dihitung otomatis. Inventaris hidup punya satu kolom yang dihitung tiap bulan: umur validasi vs ambang tier (lab di Langkah 7).",
      },
      reference: "Tidak terdaftar = tidak diatur. Pemilik = yang menanggung rugi.",
    },
    {
      id: "status-validasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Status validasi, temuan terbuka, dan batas pemakaian",
      prose: [
        "Definisi: validasi = penilaian independen (bukan oleh tim pembuat) bahwa model masih layak dipakai untuk tujuan yang disetujui. Hasilnya tiga status: VALID (dalam masa berlaku), PERLU VALIDASI ULANG (umur melewati ambang tier atau ada perubahan material), ESKALASI KOMITE (temuan kritis yang melewati ambang umur). Status ini adalah BARIS LAPORAN, bukan arsip.",
        "Temuan validasi terbuka: setiap validasi menghasilkan temuan (mis. 'dokumentasi asumsi kurang', 'uji stabilitas gagal di segmen mikro'). Tiap temuan punya umur dalam hari. Aturan: temuan yang terbuka > 90 hari tanpa rencana perbaikan = ESKALASI KOMITE. Umur temuan dihitung seperti umur piutang: semakin tua, semakin beracun — dan ia dicetak di laporan, bukan disimpan di email.",
        "Pelanggaran batas pemakaian: model divalidasi untuk cakupan tertentu (segmen, produk, plafon). Dipakai di luar cakupan = dipakai tanpa izin berlaku. Contoh: pricing model ritel divalidasi untuk segmen menengah-atas, lalu dipakai menyetujui segmen mikro — populasinya beda, perilakunya beda, validasinya tidak mencakup. Di laporan, pelanggaran batas = status PERLU VALIDASI ULANG otomatis, sekecil apa pun pelanggarannya.",
        "Insiden model: kejadian nyata akibat model (keputusan salah massal, downtime scoring, kebocoran data lewat model). Setiap insiden masuk laporan dengan tiga baris: apa yang terjadi, model apa, tindakan sementara (rollback ke aturan manual / batasi cakupan). Insiden = bukti bahwa status 'VALID' kemarin tidak menjamin hari ini.",
        "Intuisi 💡: status model seperti status kesehatan pasien di papan rumah sakit — hijau/kuning/merah, diperbarui tiap shift, bukan sekali saat masuk. Laporan model risk = papan status itu, untuk semua model.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 3 status model dan pemicu masing-masing" },
        { id: "t2", text: "Kapan temuan terbuka masuk jalur eskalasi komite?" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cModelnya akurat, jadi valid.\u201d Akurasi kemarin = bukti kemarin. Valid = (umur dalam ambang) DAN (dipakai dalam cakupan) DAN (temuan tidak kadaluarsa). Akurasi tinggi pada model kadaluarsa = mobil kencang tanpa SIM.",
      },
      reference: "Valid = umur dalam ambang + dalam cakupan + temuan tidak kadaluarsa.",
    },
    {
      id: "tiering",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tiering: kedalaman sebanding dampak",
      prose: [
        "Definisi: tiering = pengelompokan model menurut dampak keputusannya. Tier 1: model yang keputusannya langsung menggerakkan uang atau kewajiban (scorecard kredit, LGD, pricing). Tier 2: model pendukung keputusan (fraud score, segmentasi). Tier 3: model analitik tanpa dampak keputusan langsung (churn, peramalan internal). Tier menentukan segalanya: kedalaman validasi, frekuensi validasi ulang, dan frekuensi pelaporan.",
        "Ambang umur validasi per tier (contoh kebijakan bank): Tier 1 = 12 bulan, Tier 2 = 18 bulan, Tier 3 = 24 bulan. Logikanya: semakin besar dampak, semakin cepat model harus diperiksa ulang. Scorecard UMKM (Tier 1, validasi 14 bulan lalu) = kadaluarsa; churn tabungan (Tier 3, validasi 21 bulan lalu) = masih valid. Umur yang sama, verdict berbeda — karena tiernya berbeda.",
        "Frekuensi laporan sebanding tier: Tier 1 dilaporkan tiap bulan ke komite risiko, Tier 2 tiap kuartal, Tier 3 tiap semester. Bukan karena Tier 3 tidak penting — melainkan karena perhatian komite terbatas dan harus dialokasikan ke dampak terbesar. Tiering = triase perhatian.",
        "Penetapan tier bukan selamanya: model naik tier jika penggunaannya meluas. Churn model (Tier 3) yang tiba-tiba dipakai menentukan insentif retensi Rp50 miliar = naik ke Tier 2, dengan ambang validasi yang ikut mengetat. Perubahan penggunaan = pemicu review tier. Inilah yang ditangkap kolom 'tujuan/penggunaan yang disetujui' di inventaris.",
        "Jebakan umum: semua model diberi Tier 1 'agar aman'. Hasilnya: tim validasi kewalahan, semua telat, dan pada akhirnya tidak ada yang benar-benar divalidasi tepat waktu — keamanan semu yang lebih berbahaya daripada tiering jujur. Tiering yang baik = berani menaruh sebagian model di Tier 3.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan tier untuk: scorecard KPR, model deteksi fraud ATM, model peramalan kunjungan cabang" },
        { id: "t2", text: "Jelaskan kenapa 'semua Tier 1' justru berbahaya" },
      ],
      note: {
        title: "Intuisi",
        body: "Tiering seperti triase IGD: pasien kritis (Tier 1) diperiksa tiap jam, pasien stabil (Tier 3) tiap shift. Menaruh semua pasien di ruang kritis = tidak ada yang benar-benar terpantau.",
      },
      reference: "T1 = 12 bln, T2 = 18 bln, T3 = 24 bln. Perubahan guna = review tier.",
    },
    {
      id: "monitoring",
      eyebrow: "Langkah 6 · Konsep",
      title: "Monitoring kinerja sebagai baris laporan",
      prose: [
        "Definisi: monitoring kinerja model = pengukuran berkala apakah model masih berperilaku seperti saat divalidasi. Dua sinyal utama: drift (distribusi input bergeser — mis. porsi debitur sektor perdagangan naik 30% → 55%) dan penurunan akurasi (KS/AUC turun, atau tingkat persetujuan vs gagal bayar menyimpang dari ekspektasi). Keduanya adalah BARIS LAPORAN — dibaca komite, bukan cuma didiskusikan data scientist.",
        "Cara membaca figur: tiap batang = umur validasi model dalam bulan; garis putus-putus = ambang Tier 1 (12 bulan). Interpretasi: tiga model melewati garis = PERLU VALIDASI ULANG (dua Tier 1 kadaluarsa, satu Tier 2 kadaluarsa); pricing model (9 bulan, Tier 2) dan churn (21 bulan, Tier 3) masih dalam ambang. Satu gambar ini = separuh laporan triwulan.",
        "Ambang monitoring ≠ ambang validasi: monitoring punya ambang peringatan dini. Contoh: penurunan KS > 5 poin dari baseline = kuning (pantau intensif); > 10 poin = merah (validasi ulang dipercepat, jadwal tidak menunggu ambang umur). Model bisa 'merah' di umur 6 bulan — umur muda tidak menjamin sehat.",
        "Yang dilaporkan bukan grafiknya, melainkan keputusannya: tiap baris monitoring diakhiri tindakan (lanjut / pantau intensif / validasi dipercepat / batasi cakupan). Baris monitoring tanpa kolom tindakan = pajangan. Komite tidak butuh tahu KS turun 7 poin; komite butuh tahu 'KS turun 7 poin → validasi dipercepat ke bulan depan'.",
        "Intuisi 💡: monitoring model = cek tekanan darah rutin. Tekanan darah bukan vonis — ia sinyal kapan perlu ke dokter (validasi ulang). Pasien yang 'merasa sehat' tetap diukur; model yang 'akurasinya dulu bagus' tetap dimonitor.",
      ],
      figure: {
        svg: FIG_UMUR,
        alt: "Umur validasi lima model dibandingkan ambang tier.",
        caption: "Tiga batang melewati ambang 12 bulan: dua Tier 1 + satu Tier 2 = perlu validasi ulang.",
      },
      tasks: [
        { id: "t1", text: "Dari figur, sebutkan model yang melewati ambang dan statusnya" },
        { id: "t2", text: "Jelaskan beda ambang monitoring vs ambang validasi" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cMonitoring = urusan data scientist.\u201d Data scientist mengukur; KOMITE membaca. Begitu sinyal monitoring tidak naik ke laporan, ia menjadi hobi pengukuran — akurat, terdokumentasi, dan tidak mengubah satu keputusan pun.",
      },
      reference: "Drift + penurunan akurasi = baris laporan. Tiap baris diakhiri tindakan.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 7 · Lab",
      title: "Hitung status inventaris 5 model",
      prose: [
        "Inventaris 5 model Bank Cahaya Timur per 1 Oktober 2026. Tugasmu: hitung umur validasi tiap model (bulan), bandingkan dengan ambang tier-nya (T1=12, T2=18, T3=24), terapkan aturan temuan (>90 hari = eskalasi), dan cetak dua daftar: yang perlu validasi ulang dan yang eskalasi komite.",
        "Eksperimen: ubah `temuan_tertua` pricing model dari 100 menjadi 60 — ia turun dari ESKALASI KOMITE menjadi PERLU VALIDASI ULANG (pelanggaran batas tetap). Satu angka mengubah jalur laporan. Itulah kenapa umur temuan dihitung, bukan dirasakan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `status` tiap model: VALID / PERLU VALIDASI ULANG / ESKALASI KOMITE" },
        { id: "t2", text: "Isi `perlu_validasi` dan `eskalasi`, jalankan dan cocokkan output" },
      ],
      expected: "Perlu validasi ulang: 2 model -> ['LGD Model Korporasi', 'Fraud Score E-channel']\nEskalasi komite: 2 model -> ['PD Scorecard UMKM v2', 'Pricing Model Kredit Ritel']",
      note: {
        title: "Urutan aturan itu penting",
        type: "pitfall",
        body: "Cek temuan > 90 hari TERAKHIR (ia menimpa status). Model kadaluarsa + temuan 120 hari = ESKALASI KOMITE, bukan sekadar perlu validasi ulang. Eskalasi = jalur komite, bukan antrean validasi biasa.",
      },
      hints: [
        "umur = (2026 - thn_validasi) * 12 + (10 - bln_validasi).",
        "kadaluarsa jika umur > ambang[tier]; pelanggaran batas juga memicu validasi ulang.",
        "temuan_tertua > 90 menimpa status menjadi ESKALASI KOMITE.",
      ],
      code: {
        starter: "# Inventaris model per 2026-10-01 (JANGAN UBAH).\n# temuan_tertua = umur temuan validasi tertua (hari); pelanggaran = dipakai di luar cakupan validasi.\ninventaris = [\n    {\"nama\": \"PD Scorecard UMKM v2\", \"tier\": 1, \"validasi\": (2025, 8), \"temuan_tertua\": 120, \"pelanggaran\": False},\n    {\"nama\": \"LGD Model Korporasi\", \"tier\": 1, \"validasi\": (2025, 2), \"temuan_tertua\": 45, \"pelanggaran\": False},\n    {\"nama\": \"Fraud Score E-channel\", \"tier\": 2, \"validasi\": (2024, 5), \"temuan_tertua\": 0, \"pelanggaran\": False},\n    {\"nama\": \"Pricing Model Kredit Ritel\", \"tier\": 2, \"validasi\": (2026, 1), \"temuan_tertua\": 100, \"pelanggaran\": True},\n    {\"nama\": \"Churn Model Tabungan\", \"tier\": 3, \"validasi\": (2025, 1), \"temuan_tertua\": 0, \"pelanggaran\": False},\n]\nambang = {1: 12, 2: 18, 3: 24}\n\n# TULIS KODEMU\nstatus = {}\nperlu_validasi = []\neskalasi = []\nfor m in inventaris:\n    umur =\n    s = \"VALID\"\n    if :                      # kadaluarsa (umur > ambang tier) ATAU pelanggaran batas pemakaian\n        s = \"PERLU VALIDASI ULANG\"\n    if :                      # temuan tertua > 90 hari: jalur lebih tinggi, MENIMPA status\n        s = \"ESKALASI KOMITE\"\n    status[m[\"nama\"]] = s\n    if s == \"PERLU VALIDASI ULANG\":\n        perlu_validasi.append(m[\"nama\"])\n    elif s == \"ESKALASI KOMITE\":\n        eskalasi.append(m[\"nama\"])\nprint(f\"Perlu validasi ulang: {len(perlu_validasi)} model -> {perlu_validasi}\")\nprint(f\"Eskalasi komite: {len(eskalasi)} model -> {eskalasi}\")\n",
        lockLines: 10,
        solution: "# Inventaris model per 2026-10-01 (JANGAN UBAH).\n# temuan_tertua = umur temuan validasi tertua (hari); pelanggaran = dipakai di luar cakupan validasi.\ninventaris = [\n    {\"nama\": \"PD Scorecard UMKM v2\", \"tier\": 1, \"validasi\": (2025, 8), \"temuan_tertua\": 120, \"pelanggaran\": False},\n    {\"nama\": \"LGD Model Korporasi\", \"tier\": 1, \"validasi\": (2025, 2), \"temuan_tertua\": 45, \"pelanggaran\": False},\n    {\"nama\": \"Fraud Score E-channel\", \"tier\": 2, \"validasi\": (2024, 5), \"temuan_tertua\": 0, \"pelanggaran\": False},\n    {\"nama\": \"Pricing Model Kredit Ritel\", \"tier\": 2, \"validasi\": (2026, 1), \"temuan_tertua\": 100, \"pelanggaran\": True},\n    {\"nama\": \"Churn Model Tabungan\", \"tier\": 3, \"validasi\": (2025, 1), \"temuan_tertua\": 0, \"pelanggaran\": False},\n]\nambang = {1: 12, 2: 18, 3: 24}\n\n# TULIS KODEMU\nstatus = {}\nperlu_validasi = []\neskalasi = []\nfor m in inventaris:\n    umur = (2026 - m[\"validasi\"][0]) * 12 + (10 - m[\"validasi\"][1])\n    s = \"VALID\"\n    if umur > ambang[m[\"tier\"]] or m[\"pelanggaran\"]:\n        s = \"PERLU VALIDASI ULANG\"\n    if m[\"temuan_tertua\"] > 90:\n        s = \"ESKALASI KOMITE\"\n    status[m[\"nama\"]] = s\n    if s == \"PERLU VALIDASI ULANG\":\n        perlu_validasi.append(m[\"nama\"])\n    elif s == \"ESKALASI KOMITE\":\n        eskalasi.append(m[\"nama\"])\nprint(f\"Perlu validasi ulang: {len(perlu_validasi)} model -> {perlu_validasi}\")\nprint(f\"Eskalasi komite: {len(eskalasi)} model -> {eskalasi}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "`status` terdefinisi", msg: "Isi dict status untuk tiap model.", name: "status" },
          { kind: "equal", task: "t1", label: "Status 5 model benar", msg: "PD Scorecard: eskalasi (temuan 120 hr). LGD: perlu validasi (20 bln > 12). Fraud: perlu validasi (29 bln > 18). Pricing: eskalasi (temuan 100 hr + pelanggaran). Churn: valid (21 bln < 24).", name: "status", value: {"PD Scorecard UMKM v2": "ESKALASI KOMITE", "LGD Model Korporasi": "PERLU VALIDASI ULANG", "Fraud Score E-channel": "PERLU VALIDASI ULANG", "Pricing Model Kredit Ritel": "ESKALASI KOMITE", "Churn Model Tabungan": "VALID"} },
          { kind: "stdout_matches", task: "t2", label: "Daftar validasi ulang", msg: "2 model antrean biasa: LGD (kadaluarsa) dan Fraud (kadaluarsa).", pattern: "Perlu validasi ulang: 2 model" },
          { kind: "stdout_matches", task: "t2", label: "Daftar eskalasi", msg: "2 model: PD Scorecard, Pricing.", pattern: "Eskalasi komite: 2 model" }
        ],
      },
      reference: "Umur vs ambang tier, pelanggaran batas, temuan > 90 hari = eskalasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Temuan model risk: respons apa",
      prose: [
        "Satu: model melewati ambang umur → jadwalkan validasi ulang; batasi penggunaan untuk keputusan baru yang material sampai selesai. Dua: temuan terbuka > 90 hari → eskalasi komite dengan rencana perbaikan bertanggal. Tiga: pelanggaran batas pemakaian → hentikan penggunaan di luar cakupan ATAU validasi cakupan baru (pilih satu, jangan didiamkan). Empat: sinyal monitoring merah (drift/akurasi) → validasi dipercepat, jadwal umur tidak menunggu. Lima: insiden model → tindakan sementara hari itu juga + masuk laporan bulan berjalan.",
        "Aturan praktis 10 detik: umur lewat → jadwalkan. Temuan tua → eskalasi. Di luar cakupan → hentikan atau validasi. Sinyal merah → percepat. Insiden → tindak hari ini, lapor bulan ini.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Peta ini ditempel di dinding unit validasi, bukan disimpan di slide. Keputusan model risk 90% adalah klasifikasi temuan ke lima baris ini — sisanya adalah keberanian mengeksekusi klasifikasinya.",
      },
      reference: "Lima baris respons. Klasifikasi cepat, eksekusi berani.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Laporan triwulan Bank Nusa Prima",
      prose: [
        "Bank Nusa Prima, 42 model terdaftar: 8 Tier 1, 15 Tier 2, 19 Tier 3. Data triwulan: 3 model Tier 1 melewati ambang 12 bulan (tertua 16 bulan); 5 temuan terbuka > 90 hari (2 di antaranya pada model Tier 1); 1 pelanggaran batas — model pricing dipakai untuk segmen yang belum divalidasi selama 2 bulan; monitoring: KS scorecard KPR turun 8 poin dari baseline.",
        "Pertanyaan: (1) Berapa model masuk jalur eskalasi komite, dan mana saja kategorinya? (2) Tindakan apa untuk KS yang turun 8 poin — tunggu ambang umur atau percepat? (3) Susun ringkasan 1 halaman: apa 3 baris terpenting untuk direksi?",
        "Pembahasan: (1) Eskalasi = 2 model Tier 1 dengan temuan > 90 hari (+ pertimbangkan 3 model kadaluarsa Tier 1 sebagai prioritas validasi berikutnya — kadaluarsa tanpa temuan tua = antrean validasi, bukan eskalasi). (2) KS turun 8 poin = kuning menuju merah → validasi dipercepat, tidak menunggu umur; ambang monitoring independen dari ambang umur. (3) Satu halaman direksi: '2 model Tier 1 eskalasi komite (temuan > 90 hari)', '3 model Tier 1 kadaluarsa — validasi ulang Q4', '1 pelanggaran batas pemakaian — penggunaan dihentikan/divalidasi'. Detail 42 model = lampiran teknis, bukan halaman utama.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Direksi tidak membaca 42 baris. Ia membaca 3 baris dan bertanya 'apa yang sudah dilakukan'. Laporan 1 halaman = disiplin memilah: yang butuh keputusan direksi di halaman 1, yang butuh diketahui di lampiran.",
      },
      reference: "Halaman 1 = yang butuh keputusan. Sisanya lampiran.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang inventaris, status, tiering, dan monitoring model risk.",
      ],
      tasks: [],
      summary: [
        "Inventaris model: pemilik = unit yang menanggung rugi; tidak terdaftar = tidak diatur.",
        "Status: VALID / PERLU VALIDASI ULANG / ESKALASI KOMITE — dari umur vs ambang tier, pelanggaran batas, temuan > 90 hari.",
        "Tiering: T1 = 12 bln, T2 = 18 bln, T3 = 24 bln; perubahan guna = review tier; jangan semua T1.",
        "Monitoring (drift, penurunan akurasi) = baris laporan dengan kolom tindakan, bukan urusan internal.",
        "Laporan 1 halaman untuk direksi: hanya yang butuh keputusan; detail = lampiran.",
        "Model kadaluarsa yang tetap dipakai = mengemudi tanpa SIM.",
      ],
      next: { label: "RR28 — Tooling BI untuk Pelaporan Risiko", href: "/v2/learn/rr28-tooling-bi-risiko" },
      quiz: [
        {
          q: "Scorecard UMKM Tier 1 terakhir divalidasi 14 bulan lalu. Statusnya?",
          options: [
            { text: "PERLU VALIDASI ULANG — melewati ambang Tier 1 (12 bulan)", why: "Benar: 14 > 12.", correct: true },
            { text: "VALID — akurasinya dulu bagus", why: "Akurasi dulu bukan izin berlaku hari ini." },
            { text: "ESKALASI KOMITE — otomatis", why: "Kadaluwarsa saja = antrean validasi; eskalasi butuh temuan > 90 hari." },
            { text: "VALID — baru 2 bulan lewat", why: "Ambang = batas, bukan saran. 1 hari lewat = lewat." }
          ],
        },
        {
          q: "Siapa pemilik scorecard kredit UMKM yang benar?",
          options: [
            { text: "Divisi kredit — unit yang keputusannya bergantung pada model", why: "Benar: pemilik = yang menanggung rugi.", correct: true },
            { text: "Tim data science — yang membangunnya", why: "Pembuat ≠ pemilik. Pembuat membangun; pemilik menanggung akibat." },
            { text: "Tim IT — yang men-deploy", why: "IT mengoperasikan infrastruktur, bukan menanggung risiko keputusan." },
            { text: "Tidak perlu pemilik", why: "Tanpa pemilik = tidak ada yang ditagih menjaga model tetap valid." }
          ],
        },
        {
          q: "Temuan validasi terbuka 120 hari tanpa rencana perbaikan. Jalurnya?",
          options: [
            { text: "ESKALASI KOMITE", why: "Benar: > 90 hari = eskalasi.", correct: true },
            { text: "Tunggu validasi berikutnya", why: "120 hari diam = temuan membusuk; ambang 90 hari justru mencegah ini." },
            { text: "Tutup temuan karena model masih dipakai", why: "Menutup temuan agar laporan bersih = memalsukan status." },
            { text: "Turunkan tier model", why: "Tier ditentukan dampak keputusan, bukan umur temuan." }
          ],
        },
        {
          q: "Model pricing divalidasi untuk segmen menengah-atas, dipakai untuk segmen mikro. Status?",
          options: [
            { text: "PERLU VALIDASI ULANG — pelanggaran batas pemakaian", why: "Benar: di luar cakupan = tanpa izin berlaku.", correct: true },
            { text: "VALID — modelnya sama", why: "Populasi beda = perilaku beda; validasi tidak mencakup segmen ini." },
            { text: "ESKALASI KOMITE — otomatis", why: "Pelanggaran batas = validasi ulang (atau hentikan); eskalasi butuh temuan > 90 hari." },
            { text: "Naikkan ke Tier 1", why: "Tier soal dampak, bukan soal pelanggaran. Responsnya: hentikan atau validasi cakupan baru." }
          ],
        },
        {
          q: "KS scorecard turun 8 poin di umur validasi 6 bulan (Tier 1). Tindakan?",
          options: [
            { text: "Validasi dipercepat — ambang monitoring independen dari umur", why: "Benar: sinyal merah tidak menunggu ulang tahun.", correct: true },
            { text: "Tunggu 12 bulan", why: "6 bulan lagi dengan model melemah = 6 bulan keputusan di atas fondasi retak." },
            { text: "Turunkan ambang Tier 1", why: "Mengubah ambang agar lolos = mengukur ulang penggaris, bukan memperbaiki." },
            { text: "Hapus dari inventaris", why: "Menghapus dari daftar = model bayangan; masalahnya tetap dipakai." }
          ],
        },
        {
          q: "Isi halaman 1 laporan model risk untuk direksi yang tepat?",
          options: [
            { text: "Hanya temuan yang butuh keputusan direksi + tindakan yang diambil", why: "Benar: halaman 1 = keputusan; 42 baris detail = lampiran.", correct: true },
            { text: "Daftar lengkap 42 model dengan semua metrik", why: "Direksi tidak membaca 42 baris — ia butuh 3 baris dan 1 pertanyaan." },
            { text: "Grafik akurasi semua model", why: "Grafik tanpa keputusan = pajangan." },
            { text: "Tidak perlu laporan rutin jika tidak ada insiden", why: "Tanpa laporan rutin, kadaluarsa ditemukan 14 bulan kemudian — seperti cerita pembuka." }
          ],
        }
      ],
      reference: "Inventaris hidup, status dihitung, halaman 1 = keputusan.",
    },
  ],
};
