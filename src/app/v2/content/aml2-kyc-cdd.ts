import type { V2Lesson } from "../lib/types";

// Alur KYC: identifikasi -> verifikasi -> screening -> risk rating -> tier + tindakan.
const KYC_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Diagram alur KYC lima tahap dari identifikasi hingga tier risiko.">
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<rect x="8" y="100" width="80" height="52" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="48" y="122" fill="var(--text)">Identifi-</text><text x="48" y="137" fill="var(--text)">kasi</text>
<rect x="104" y="100" width="80" height="52" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="144" y="122" fill="var(--text)">Verifi-</text><text x="144" y="137" fill="var(--text)">kasi</text>
<rect x="200" y="100" width="80" height="52" rx="8" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="240" y="122" fill="var(--text)">Scree-</text><text x="240" y="137" fill="var(--text)">ning</text>
<rect x="296" y="100" width="80" height="52" rx="8" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="336" y="122" fill="var(--text)">Risk</text><text x="336" y="137" fill="var(--text)">rating</text>
<rect x="392" y="100" width="80" height="52" rx="8" fill="none" stroke="var(--c3)" stroke-width="2"/><text x="432" y="122" fill="var(--text)">Tier +</text><text x="432" y="137" fill="var(--text)">tindakan</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.5"><line x1="88" y1="126" x2="104" y2="126"/><line x1="184" y1="126" x2="200" y2="126"/><line x1="280" y1="126" x2="296" y2="126"/><line x1="376" y1="126" x2="392" y2="126"/></g>
<g font-size="10" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">
<text x="48" y="170">siapa dia?</text><text x="144" y="170">benarkah?</text><text x="240" y="170">ada di list?</text><text x="336" y="170">skor risiko?</text><text x="432" y="170">lalu apa?</text>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<rect x="300" y="196" width="72" height="30" rx="15" fill="var(--c1)" opacity="0.85"/><text x="336" y="215" fill="var(--text)">Low</text>
<rect x="204" y="196" width="72" height="30" rx="15" fill="var(--c2)" opacity="0.85"/><text x="240" y="215" fill="var(--text)">Standard</text>
<rect x="108" y="196" width="72" height="30" rx="15" fill="var(--c3)" opacity="0.85"/><text x="144" y="215" fill="var(--text)">High→EDD</text>
<rect x="12" y="196" width="72" height="30" rx="15" fill="var(--c4)" opacity="0.85"/><text x="48" y="215" fill="var(--text)">Tolak</text>
</g>
<text x="240" y="20" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">CDD bukan sekali jalan — rating di-review saat ada trigger</text>
</svg>`;

export const aml2: V2Lesson = {
  slug: "aml2-kyc-cdd",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML2 — KYC & CDD: Kenali Nasabahmu",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rekening yang dibuka 40 menit, dipakai mencuci Rp14 miliar",
      prose: [
        "PT Maju Abadi mendaftar rekening korporat lewat aplikasi. KTP direktur: valid. NPWP: valid. Akta pendirian: valid. Selfie + liveness: lolos. 40 menit kemudian rekening aktif. Tiga bulan kemudian Rp14 miliar mengalir masuk-keluar — dan tim visitasi menemukan alamat kantornya: ruko kosong tanpa papan nama.",
        "Twist-nya: tidak satu pun dokumen yang palsu. KTP asli, akta asli, NPWP asli. Yang fiktif adalah ceritanya: \"perdagangan sparepart\" tidak pernah ada, dan pemilik manfaat sebenarnya (beneficial owner) bukan direktur yang tercantum — melainkan seseorang yang namanya tidak muncul di satu pun dokumen.",
        "KYC (Know Your Customer) yang hanya mengecek dokumen akan meloloskan Maju Abadi selamanya. CDD (Customer Due Diligence) yang benar mengecek cerita: apakah profil transaksi masuk akal untuk bisnis yang diklaim? Siapa yang benar-benar menikmati uangnya? Lesson ini tentang membangun sistem yang menangkap Maju Abadi di hari ke-40, bukan di bulan ke-3.",
        "Setelah lesson ini kamu bisa: membedakan identifikasi vs verifikasi, menghitung risk rating nasabah dari faktor-faktornya, menjelaskan beneficial ownership, dan memutuskan kapan CDD standar tidak cukup.",
      ],
      tasks: [],
      reference: "Dokumen menjawab \"siapa yang tertulis\" — CDD menjawab \"siapa yang sebenarnya dan untuk apa rekening ini.\"",
    },
    {
      id: "identifikasi",
      eyebrow: "Langkah 2 · Identifikasi vs verifikasi",
      title: "Dua kata yang tidak sama",
      prose: [
        "Identifikasi = mengumpulkan klaim: nama, tanggal lahir, alamat, NPWP, struktur kepemilikan. Verifikasi = membuktikan klaim itu benar terhadap sumber independen: Dukcapil untuk KTP, Ditjen AHU untuk akta perusahaan, biometric liveness untuk \"orang di depan kamera = orang di KTP\". Identifikasi tanpa verifikasi = menerima lamaran kerja tanpa cek ijazah.",
        "Untuk nasabah korporat ada lapisan ketiga: beneficial ownership (BO). BO = individu yang pada akhirnya memiliki atau mengendalikan ≥25% perusahaan, atau yang menikmati manfaat ekonominya — walau namanya tidak tercantum sebagai direktur. Struktur Maju Abadi: direktur (0% saham, \"karyawan\"), 3 perusahaan cangkang masing-masing pegang 33%, dan di ujungnya satu individu mengendalikan ketiganya. Ambang ≥25% bukan angka magis — ia ambang PRAKTIK UMUM (dipakai banyak yurisdiksi, termasuk Indonesia), BUKAN aturan universal FATF: FATF tidak menetapkan angka tunggal; tiap negara/bank menetapkan ambangnya sendiri, dan pengendalian bisa ada di bawah 25% (mis. lewat perjanjian pemegang saham).",
        "Cara membaca diagram: lima kotak = lima tahap berurutan, panah = tidak boleh dilompati. Empat pil di bawah = hasil risk rating dan tindakannya. Interpretasi: KYC bukan gerbang sekali lewat — panah implisitnya melingkar: setiap trigger (transaksi aneh, berita negatif, perubahan struktur) mengembalikan nasabah ke tahap screening. Bank yang memutus lingkaran ini buta terhadap Maju Abadi setelah hari ke-40.",
      ],
      figure: {
        svg: KYC_SVG,
        alt: "Diagram alur KYC lima tahap dari identifikasi hingga tier risiko.",
        caption: "Alur CDD: lima tahap berurutan, empat tier hasil. Rating hidup — trigger mengembalikannya ke screening.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"KYC selesai saat rekening dibuka.\" Pembukaan rekening = awal hubungan, bukan akhir pemeriksaan. Maju Abadi lolos hari ke-1 justru karena bank berhenti bertanya setelah rekening aktif. CDD yang benar punya ongoing monitoring: profil transaksi vs profil klaim, diperiksa terus.",
      },
      reference: "Verifikasi = klaim vs sumber independen. BO = siapa yang benar-benar mengendalikan/menikmati.",
    },
    {
      id: "rating",
      eyebrow: "Langkah 3 · Risk rating",
      title: "Mengubah firasat menjadi skor",
      prose: [
        "Risk rating = skor 0+ yang memetakan nasabah ke tier tindakan. Faktor standar: jenis nasabah (korporat lebih kompleks dari individu), risiko negara domisili, risiko produk (trade finance & kripto > tabungan), status PEP, dan kompleksitas struktur kepemilikan. Tiap faktor punya bobot; jumlahnya = skor.",
        "Tier-nya: skor <30 = Low (CDD sederhana, review 3 tahunan), 30-59 = Standard (CDD penuh, review tahunan), 60-84 = High (EDD — lesson berikutnya — + persetujuan senior), ≥85 = Prohibited (tolak/exit, kecuali pengecualian direksi yang terdokumentasi). Tier bukan label moral — ia alokasi perhatian: High berarti \"pantau lebih sering,\" bukan \"jahat.\"",
        "Kenapa korporat +20 dan PEP +30? Karena data historis: kerugian AML terbesar datang dari struktur korporat berlapis dan individu berpengaruh. Bobot adalah memori kolektif tim compliance yang dikuantifikasi — sama seperti bobot skor alert di AML1.",
      ],
      formula: String.raw`R = \sum_{i=1}^{m} w_i f_i \qquad \text{tier} = \begin{cases} \text{Low} & R < 30 \ \text{Standard} & 30 \le R < 60 \ \text{High} & 60 \le R < 85 \ \text{Prohibited} & R \ge 85 \end{cases}`,
      formulaNote: "R = skor risiko nasabah. w_i = bobot faktor (mis. korporat +20, PEP +30). f_i = nilai faktor (0/1 atau skala). Tier menentukan kedalaman pemeriksaan dan frekuensi review.",
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Risk rating yang bagus membuat keputusan sulit menjadi membosankan: \"skor 70 = EDD + approval senior\" tidak perlu rapat 2 jam. Nilai sebenarnya dari rating bukan angkanya — melainkan konsistensi: 1.000 analis membuat keputusan yang sama untuk kasus yang sama.",
      },
      reference: "Tier = alokasi perhatian, bukan vonis. Dokumentasikan kenapa tiap bobot dipilih.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab rating",
      title: "Beri tier pada 5 calon nasabah",
      prose: [
        "Lima calon nasabah menunggu keputusan. Hitung skor tiap nasabah dari lima faktor, petakan ke tier, dan tentukan tindakannya. Satu di antaranya adalah \"Maju Abadi versi lab\" — struktur korporat berlapis + PEP di ujungnya. Skor berapa yang pantas untuknya?",
        "Setelah selesai, coba eksperimen: apa yang terjadi kalau bobot PEP diturunkan dari 30 ke 10? Nasabah mana yang turun tier? Itulah sensitivitas — analis senior tahu bobot mana yang \"menggerakkan jarum.\"",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `risk_rating(n)` → (skor, tier)" },
        { id: "t2", text: "Jalankan dan identifikasi nasabah tier Prohibited" },
      ],
      expected: "n4: skor=125 tier=Prohibited (korporat + negara 3 + produk 3 + PEP + kompleks); n2: 70 High; n3: 50 Standard; n1/n5: Low",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Skor 50 = aman, tidak perlu dipantau.\" Standard bukan berarti \"abaikan\" — ia berarti CDD penuh + review tahunan. Maju Abadi versi nyata lolos karena bank memperlakukan \"Standard\" sebagai \"selesai\". Tier menentukan frekuensi, bukan menghentikan perhatian.",
      },
      hints: [
        "skor = 10 + 20*jenis + 15*(negara-1) + 10*(produk-1) + 30*pep + 15*kompleks.",
        "Tier: <30 Low; <60 Standard; <85 High; sisanya Prohibited.",
        "n4: 10+20+30+20+30+15 = 125 → Prohibited.",
      ],
      code: {
        starter: `# 5 nasabah: (id, korporat 0/1, negara 1-3, produk 1-3, pep 0/1, kompleks 0/1)\nnasabah = [\n    ("n1", 0, 1, 1, 0, 0),\n    ("n2", 1, 2, 2, 0, 1),\n    ("n3", 0, 3, 2, 0, 0),\n    ("n4", 1, 3, 3, 1, 1),\n    ("n5", 0, 2, 1, 0, 0),\n]\n\n# TULIS KODEMU: skor lalu petakan ke tier\ndef risk_rating(n):\n    _, jenis, neg, prod, pep, komp = n\n    s =\n    tier =\n    return s, tier\n\nfor n in nasabah:\n    s, t = risk_rating(n)\n    print(f"{n[0]}: skor={s}  tier={t}")\n\n# simpan skor n4 untuk verifikasi\ns_n4, t_n4 = risk_rating([n for n in nasabah if n[0] == "n4"][0])`,
        lockLines: 8,
        solution: `# 5 nasabah: (id, korporat 0/1, negara 1-3, produk 1-3, pep 0/1, kompleks 0/1)\nnasabah = [\n    ("n1", 0, 1, 1, 0, 0),\n    ("n2", 1, 2, 2, 0, 1),\n    ("n3", 0, 3, 2, 0, 0),\n    ("n4", 1, 3, 3, 1, 1),\n    ("n5", 0, 2, 1, 0, 0),\n]\n\n# TULIS KODEMU: skor lalu petakan ke tier\ndef risk_rating(n):\n    _, jenis, neg, prod, pep, komp = n\n    s = 10 + 20*jenis + 15*(neg-1) + 10*(prod-1) + 30*pep + 15*komp\n    tier = "Low" if s < 30 else "Standard" if s < 60 else "High" if s < 85 else "Prohibited"\n    return s, tier\n\nfor n in nasabah:\n    s, t = risk_rating(n)\n    print(f"{n[0]}: skor={s}  tier={t}")\n\n# simpan skor n4 untuk verifikasi\ns_n4, t_n4 = risk_rating([n for n in nasabah if n[0] == "n4"][0])`,
        checks: [
          { kind: "defined", task: "t1", name: "risk_rating", label: "`risk_rating` terdefinisi", msg: "Buat fungsi risk_rating(n) yang mengembalikan (skor, tier)." },
          { kind: "equal", task: "t1", name: "s_n4", value: 125, tol: 1e-9, label: "Skor n4 = 125", msg: "n4: 10+20+30+20+30+15 = 125. Cek tiap komponen bobot." },
          { kind: "stdout_matches", task: "t2", pattern: "n4: skor=125\\s+tier=Prohibited", label: "n4 = Prohibited", msg: "Skor ≥85 → tier Prohibited." },
          { kind: "stdout_matches", task: "t2", pattern: "n2: skor=70\\s+tier=High", label: "n2 = High (70)", msg: "n2: 10+20+15+10+0+15 = 70 → High." },
        ],
      },
      reference: "Ekspresi tier berantai: \"Low\" if s<30 else \"Standard\" if s<60 else ...",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Monitoring",
      title: "Drift profil: menangkap Maju Abadi di hari ke-90",
      prose: [
        "KYC bukan gerbang sekali lewat — ia janji yang harus ditepati. PT Maju Abadi mendaftar sebagai 'perdagangan sparepart' dengan omzet deklarasi Rp2 miliar per bulan. Realita bulan ke-2: Rp14 miliar masuk-keluar. Rasio drift = 14/2 = 7×. Ambang review: >3× selama 2 bulan berturut-turut — Maju Abadi tertangkap di akhir bulan ke-3 (~hari 90), bukan hari ke-60: bulan 1 tidak merah (0,9×), bulan 2 merah pertama (7,0×), bulan 3 merah kedua (6,25×) — dua bulan merah BERTURUT-TURUT baru lengkap di akhir bulan 3.",
        "Rumus drift: aktual / deklarasi, dihitung tiap bulan. Sederhana, tetapi ia mengubah ongoing monitoring dari 'dibaca kalau sempat' menjadi angka yang bisa di-alert. Kuncinya: deklarasi harus SPESIFIK (Rp2 miliar/bulan untuk sparepart) — 'usaha dagang' tanpa angka tidak bisa diuji.",
        "Profil bisa usang secara sah: bisnis tumbuh 2× lipat dalam setahun = kabar baik, bukan kejahatan. Respons yang benar: perbarui profil (naikkan deklarasi + verifikasi sumber pertumbuhan), bukan menghukum nasabah. Ongoing monitoring = menjaga profil tetap jujur, bukan mencari-cari kesalahan.",
        "Lab menghitung drift 6 bulan Maju Abadi: 0,9×, 7,0×, 6,2×, 8,0×, 4,5×, 7,5×. Lima bulan merah — tidak ada keraguan: REVIEW RATING. Di dunia nyata, alert bulan ke-2 ini memicu EDD yang menemukan ruko kosong. Satu rasio, satu visitasi, satu jaringan Rp14 miliar terhenti 30 hari lebih awal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `drift` dan daftar `merah`" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
        { id: "t3", text: "Hitung `berturut` — True bila ada dua bulan merah berurutan" },
      ],
      expected: "Drift per bulan: 0.9x, 7.0x, 6.2x, 8.0x, 4.5x, 7.5x\nBulan merah (>3x): [2, 3, 4, 5, 6]\nDua bulan merah berturut-turut pertama: bulan 2-3 -> REVIEW RATING",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“KYC selesai saat rekening aktif.” Justru saat itulah janji dimulai. Bank yang memutus lingkaran monitoring buta terhadap nasabah setelah hari pertama — dan Maju Abadi adalah buktinya: 40 menit onboarding, 3 bulan pencucian.",
      },
      hints: [
        "drift = [a / deklarasi for a in aktual].",
        "merah = bulan dengan drift > 3.",
      ],
      code: {
        starter: "# Profil vs realita Maju Abadi (Rp juta/bulan, JANGAN UBAH).\ndeklarasi = 2000\naktual = [1800, 14000, 12500, 16000, 9000, 15000]\n\n# TULIS KODEMU: drift + bulan merah\ndrift =\nmerah =\nberturut =\n\nprint(\"Drift per bulan: \" + \", \".join(f\"{d:.1f}x\" for d in drift))\nprint(f\"Bulan merah (>3x): {merah} -> {'REVIEW RATING' if berturut else 'PANTAU'}\")",
        lockLines: 3,
        solution: "# Profil vs realita Maju Abadi (Rp juta/bulan, JANGAN UBAH).\ndeklarasi = 2000\naktual = [1800, 14000, 12500, 16000, 9000, 15000]\n\n# TULIS KODEMU: drift + bulan merah\ndrift = [a / deklarasi for a in aktual]\nmerah = [i + 1 for i, d in enumerate(drift) if d > 3]\nberturut = any(merah[i + 1] == merah[i] + 1 for i in range(len(merah) - 1))  # DUA bulan merah BERTURUT-TURUT, bukan dua bulan merah mana saja\n\nprint(\"Drift per bulan: \" + \", \".join(f\"{d:.1f}x\" for d in drift))\nprint(f\"Bulan merah (>3x): {merah} -> {'REVIEW RATING' if berturut else 'PANTAU'}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`merah` = [2,3,4,5,6]", msg: "Lima bulan di atas 3×.", name: "merah", value: [2, 3, 4, 5, 6] },
          { kind: "equal", task: "t3", label: "`berturut` = True", msg: "Bulan 2 dan 3 merah berturut-turut.", name: "berturut", value: true },
          { kind: "stdout_matches", task: "t2", label: "Verdict REVIEW RATING", msg: "Bulan 2 dan 3 merah berturut-turut.", pattern: "\\[2, 3, 4, 5, 6\\] -> REVIEW RATING" }
        ],
      },
      reference: "Drift = aktual/deklarasi. >3× dua bulan BERTURUT-TURUT = review rating (bukan dua bulan merah mana saja).",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Kalibrasi ambang",
      title: "Kapan drift memicu review ulang?",
      prose: [
        "Lab pertama menangkap drift Maju Abadi lewat rasio per bulan. Pertanyaan lanjutannya: pada angka berapa drift resmi memicu EDD ulang? Lesson ini memakai ambang 5x sebagai KONVENSI OPERASIONAL untuk latihan — bukan praktik umum yang bersumber: tidak ada standar industri yang menetapkan 5x; kalibrasi ambang ke data bankmu. Profil yang berubah lebih dari lima kali lipat dari baseline dianggap 'bukan nasabah yang sama' menurut konvensi ini. Ambang bukan angka sakral; ia hasil kalibrasi antara biaya review dan risiko terlewat.",
        "Lab ini menerapkan ambang 5x ke enam bulan data: bulan dengan drift ≥ 5x otomatis masuk antrean EDD ulang. Empat dari enam bulan ter-flag — artinya profil ini memang tidak stabil dan layak diprioritaskan, bukan sekadar fluktuasi musiman.",
      ],
      tasks: [
        { id: "t1", text: "Tulis list comprehension untuk bulan dengan drift ≥ ambang" },
        { id: "t2", text: "Jalankan dan pastikan ringkasannya tercetak" },
      ],
      expected: "Bulan flag EDD ulang: ['Feb', 'Mar', 'Apr', 'Jun']\nJumlah: 4 dari 6 bulan",
      note: {
        title: "Ambang = alat, bukan kebenaran.",
        type: "pitfall",
        body: "“Drift 4,9x berarti aman.” Ambang 5x adalah konvensi operasional, bukan hukum fisika. Nasabah dengan drift 4,9x selama 12 bulan berturut-turut jauh lebih mencurigakan daripada satu bulan 7x yang kembali normal. Baca tren, bukan titik.",
      },
      hints: [
        "List comprehension dengan kondisi: [b for b, d in drift if d >= ambang].",
        "len() menghitung berapa bulan ter-flag.",
      ],
      code: {
        starter: "# Data drift per bulan (nama, rasio vs baseline). JANGAN UBAH.\ndrift = [(\"Jan\", 0.9), (\"Feb\", 7.0), (\"Mar\", 6.2), (\"Apr\", 8.0), (\"Mei\", 4.5), (\"Jun\", 7.5)]\nambang = 5.0\n\n# TULIS KODEMU: bulan dengan drift >= ambang\nflag = \n\nprint(f\"Bulan flag EDD ulang: {flag}\")\nprint(f\"Jumlah: {len(flag)} dari {len(drift)} bulan\")",
        lockLines: 4,
        solution: "# Data drift per bulan (nama, rasio vs baseline). JANGAN UBAH.\ndrift = [(\"Jan\", 0.9), (\"Feb\", 7.0), (\"Mar\", 6.2), (\"Apr\", 8.0), (\"Mei\", 4.5), (\"Jun\", 7.5)]\nambang = 5.0\n\n# TULIS KODEMU: bulan dengan drift >= ambang\nflag = [b for b, d in drift if d >= ambang]\n\nprint(f\"Bulan flag EDD ulang: {flag}\")\nprint(f\"Jumlah: {len(flag)} dari {len(drift)} bulan\")",
        checks: [
          { kind: "equal", task: "t1", label: "`flag` = 4 bulan", msg: "Bulan dengan drift ≥ 5x: Feb, Mar, Apr, Jun.", name: "flag", value: ["Feb", "Mar", "Apr", "Jun"] },
          { kind: "stdout_matches", task: "t2", label: "Ringkasan tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Jumlah: 4 dari 6 bulan" }
        ],
      },
      reference: "Ambang 5x = konvensi operasional. Empat dari enam bulan ter-flag = profil tidak stabil, prioritaskan EDD ulang.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat nasabah, empat jalur",
      prose: [
        "Satu: WNI, karyawan swasta, gaji bulanan, produk tabungan → simplified CDD: identifikasi + verifikasi dasar, tier Low, review 3 tahunan. Jangan perlakukan semua nasabah seperti tersangka — gesekan berlebihan mengusir nasabah baik.",
        "Dua: perusahaan asing dengan 3 lapis kepemilikan lintas negara → EDD: uraikan BO sampai individu (≥25% — ambang praktik umum), pahami tujuan rekening bisnis, pantau transaksi vs profil. Tidak paham strukturnya = tidak boleh buka rekening.",
        "Tiga: nasabah teridentifikasi PEP → EDD + persetujuan pejabat senior + penetapan sumber dana/kekayaan. PEP bukan penolakan otomatis (lesson 3 membahas detailnya) — ia \"lampu kuning yang tidak boleh dilewati tanpa rem.\"",
        "Empat: BO tidak bisa diverifikasi (dokumen tidak lengkap / struktur menolak transparan) → tolak buka rekening, atau exit untuk nasabah existing. Ini keputusan termahal sekaligus termurah: mahal karena kehilangan bisnis, murah karena menghindari denda dan kasus.",
        "Aturan praktis 10 detik: tidak kenal BO-nya → tidak buka rekeningnya. Struktur lebih dari 2 lapis tanpa alasan bisnis jelas → EDD. Perubahan profil transaksi >3x lipat → review rating ulang.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "\"Kenali nasabahmu\" sering dibaca sebagai \"kumpulkan dokumennya.\" Bacaan yang benar: \"pahami ceritanya, lalu uji cerita itu dengan data.\" Dokumen Maju Abadi sempurna; ceritanya yang bolong. Analis KYC terbaik adalah pewawancara yang skeptis, bukan pengarsip yang rapi.",
      },
      reference: "Gesekan CDD harus proporsional dengan risiko — Low jangan dipersulit, High jangan dipermudah.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Skor ulang PT Maju Abadi",
      prose: [
        "Terapkan rumus lab ke kasus pembuka. PT Maju Abadi: korporat (+20), domisili negara risiko 2 (+15), produk trade finance risiko 3 (+20), direktur bukan PEP (+0), struktur 3 lapis tanpa alasan bisnis jelas (+15 kompleksitas), base 10. Total: 10+20+15+20+0+15 = 80 → tier High.",
        "Pertanyaan: (a) Tindakan apa yang seharusnya terjadi di hari pembukaan dengan skor 80? (b) Fakta apa yang akan ditemukan EDD di minggu pertama? (c) Kenapa bank nyata tidak melakukannya?",
        "Pembahasan: (a) EDD + persetujuan senior sebelum rekening aktif: uraikan BO, visitasi alamat, pahami rasional bisnis \"sparepart\". (b) Ruko kosong, tidak ada karyawan, direktur tidak bisa menjelaskan rantai pasok — tiga red flag yang masing-masing cukup untuk menahan. (c) Target onboarding \"rekening aktif <1 jam\" menghukum analis yang bertanya. Insentif operasional mengalahkan kontrol — pelajaran klasik: metrik kecepatan tanpa metrik kualitas = undangan bagi pencuci uang.",
        "Angkanya: skor 80 = tier High. Dengan EDD di hari pembukaan, bank keluar Rp2 juta (visitasi alamat) + 3 hari kerja analis untuk mengurai BO. Tanpa EDD: Rp14 miliar mengalir selama 3 bulan, lalu regulator datang — denda, remediasi, dan risiko reputasi yang nilainya ratusan kali lipat biaya visitasi. Keputusan yang terlihat 'mahal' (menahan nasabah) justru yang termurah.",
      ],
      tasks: [],
      reference: "Skor 80 di hari ke-1 seharusnya menghentikan \"40 menit\" itu. Kecepatan onboarding adalah risiko.",
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
        "Identifikasi = kumpulkan klaim; verifikasi = uji klaim ke sumber independen.",
        "BO = individu pengendali/penerima manfaat akhir (≥25% — ambang praktik umum, bukan aturan universal FATF) — kejar sampai orang, bukan perusahaan.",
        "Risk rating = Σ w_i f_i → tier Low/Standard/High/Prohibited menentukan kedalaman & frekuensi.",
        "High → EDD + approval senior; BO tak terverifikasi → tolak/exit.",
        "CDD = ongoing: trigger (pola berubah, berita, struktur) mengembalikan ke screening.",
      ],
      next: { label: "AML3 — EDD: PEP & Adverse Media", href: "/v2/learn/aml3-edd" },
      quiz: [
        {
          q: "Apa beda identifikasi dan verifikasi dalam KYC?",
          options: [
            { text: "Tidak ada beda, sinonim", why: "Beda fundamental: klaim vs pembuktian klaim." },
            { text: "Identifikasi = kumpulkan data klaim nasabah; verifikasi = uji kebenarannya ke sumber independen", why: "KTP dikumpulkan (identifikasi), dicek ke Dukcapil (verifikasi). Maju Abadi lolos karena bank berhenti di identifikasi.", correct: true },
            { text: "Identifikasi untuk individu, verifikasi untuk korporat", why: "Keduanya berlaku untuk keduanya." },
            { text: "Verifikasi = fotokopi dokumen", why: "Fotokopi = arsip, bukan verifikasi. Verifikasi butuh sumber independen." },
          ],
        },
        {
          q: "Direktur memegang 0% saham; tiga perusahaan cangkang masing-masing 33%, dikendalikan satu individu X. Siapa BO-nya?",
          options: [
            { text: "Direktur — namanya di akta", why: "Nama di akta ≠ pengendali. Direktur 0% hanyalah boneka." },
            { text: "Ketiga perusahaan cangkang", why: "BO harus individu (orang), bukan badan hukum." },
            { text: "X — individu pengendali akhir di balik ketiga cangkang", why: "BO = siapa yang pada akhirnya mengendalikan/menikmati. Kejar sampai orang.", correct: true },
            { text: "Tidak ada BO", why: "Selalu ada individu di ujungnya — menemukannya adalah tugas EDD." },
          ],
        },
        {
          q: "Nasabah skor 72. Tindakan yang tepat?",
          options: [
            { text: "Tolak langsung", why: "72 = High, bukan Prohibited (≥85). Penolakan otomatis untuk High = kehilangan bisnis baik." },
            { text: "EDD + persetujuan senior, rekening boleh jalan dengan pemantauan enhanced", why: "High = gali lebih dalam (BO, sumber dana) + keputusan di level senior. Proporsional.", correct: true },
            { text: "CDD standar seperti biasa", why: "Skor 72 menuntut lebih dari standar — itu gunanya tier." },
            { text: "Minta nasabah menurunkan skornya", why: "Skor dihitung dari fakta, bukan dinegosiasi." },
          ],
        },
        {
          q: "Nasabah \"Standard\" tiba-tiba menerima transfer 10x rata-rata bulanannya dari negara risiko 3. Respons?",
          options: [
            { text: "Tidak apa-apa, tier-nya Standard", why: "Tier = titik awal, bukan kontrak mati. Perubahan pola = trigger review." },
            { text: "Trigger review: kembalikan ke screening, hitung ulang rating, pantau enhanced sementara", why: "Inilah ongoing CDD: profil vs realita. 10x lipat dari negara risiko 3 = wajib ditanya.", correct: true },
            { text: "Langsung tutup rekening", why: "Melompat ke exit tanpa investigasi = gegabah dan bermasalah hukum." },
            { text: "Tunggu review tahunan", why: "Review tahunan untuk yang normal. Anomali 10x tidak menunggu kalender." },
          ],
        },
        {
          q: "Kenapa ambang BO memakai ≥25%, bukan 50%?",
          options: [
            { text: "Agar formulir lebih pendek", why: "Tidak ada hubungannya dengan panjang formulir." },
            { text: "Karena pengendalian efektif bisa lewat minoritas terfragmentasi — 25% menangkap pengendali di balik cangkang berlapis", why: "Mayoritas 50% mudah diakali dengan memecah ke 3x33%. 25% = jaring yang cukup rapat tanpa menjaring semua pemegang saham kecil.", correct: true },
            { text: "Angka asal-asalan", why: "Bukan standar FATF universal: 25% adalah praktik umum yang dipakai banyak yurisdiksi — FATF sendiri tidak menetapkan angka tunggal. Angka ini tetap hasil pengalaman, bukan tebakan." },
            { text: "Agar semua pemegang saham kecil ikut terdata", why: "Justru sebaliknya: 25% menyaring pemegang kecil agar fokus ke pengendali." },
          ],
        },
      ],
    },
  ],
};
