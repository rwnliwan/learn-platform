import type { V2Lesson } from "../lib/types";

const FIG_HEAT = `<svg viewBox="0 0 480 280" role="img" aria-label="Matriks risiko 5x5: dampak vs kemungkinan, empat risiko bank dipetakan.">
<g font-family="var(--font-ui)" font-size="10" text-anchor="middle">
<text x="20" y="150" font-size="12" fill="var(--chart-text)" transform="rotate(-90 20 150)">Dampak</text>
<text x="240" y="272" font-size="12" fill="var(--chart-text)">Kemungkinan</text>
<rect x="60" y="40" width="360" height="200" fill="var(--chart-grid)" opacity="0.25"/>
<rect x="60" y="40" width="72" height="40" fill="var(--c1)" opacity="0.55"/>
<rect x="132" y="40" width="72" height="40" fill="var(--c3)" opacity="0.55"/>
<rect x="204" y="40" width="72" height="40" fill="var(--c4)" opacity="0.55"/>
<rect x="276" y="40" width="72" height="40" fill="var(--c4)" opacity="0.75"/>
<rect x="348" y="40" width="72" height="40" fill="var(--c4)" opacity="0.9"/>
<circle cx="312" cy="60" r="9" fill="#fff" stroke="var(--chart-text)" stroke-width="2"/>
<text x="312" y="64" font-size="9" fill="var(--chart-text)" font-weight="700">A</text>
<circle cx="240" cy="100" r="9" fill="#fff" stroke="var(--chart-text)" stroke-width="2"/>
<text x="240" y="104" font-size="9" fill="var(--chart-text)" font-weight="700">B</text>
<circle cx="168" cy="140" r="9" fill="#fff" stroke="var(--chart-text)" stroke-width="2"/>
<text x="168" y="144" font-size="9" fill="var(--chart-text)" font-weight="700">C</text>
<circle cx="96" cy="220" r="9" fill="#fff" stroke="var(--chart-text)" stroke-width="2"/>
<text x="96" y="224" font-size="9" fill="var(--chart-text)" font-weight="700">D</text>
<text x="240" y="258" font-size="10" fill="var(--chart-text)">A=Korporat lapis (residual 16) B=VA off-ramp (12) C=Trade finance (9) D=Ritel tabungan (4)</text>
</g>
</svg>`;

export const aml10: V2Lesson = {
  slug: "aml10-ira",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML10 — Institutional Risk Assessment (IRA)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "'Semuanya dimonitor' = tidak ada jawaban",
      prose: [
        "Pemeriksa OJK duduk di ruang rapat Bank Artha Dana. Pertanyaan pembuka: 'Menurut bank, risiko pencucian uang TERBESAR kalian di mana?' Head compliance menjawab: 'Semuanya kami monitor, Pak.' Pemeriksa menutup laptop: 'Kalau semuanya prioritas, berarti tidak ada prioritas. Saya beri waktu 90 hari untuk Institutional Risk Assessment.'",
        "Twist-nya: bank itu punya 40 kontrol AML — terbanyak di antara bank seukurannya. Tetapi tanpa IRA, 40 kontrol itu tersebar merata seperti mentega tipis di atas roti yang terlalu lebar: tebal di risiko kecil, tipis di risiko besar. IRA bukan dokumen — ia peta yang memberi tahu di mana menteganya harus tebal.",
        "Setelah lesson ini kamu bisa: (1) membedakan inherent vs residual risk; (2) menghitung residual dari efektivitas kontrol; (3) membaca matriks risiko 5×5; (4) menyusun action plan berbasis cost-effectiveness.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "IRA adalah 'risk appetite'-nya program AML: ia menjawab 'risiko apa yang kita terima, dan berapa banyak kontrol yang layak dibayar untuk menurunkannya?' Tanpa IRA, budget compliance = politik anggaran, bukan manajemen risiko.",
      },
      reference: "IRA = peta risiko satu bank. Tanpa peta, kontrol = tebakan.",
    },
    {
      id: "inherent",
      eyebrow: "Langkah 2 · Konsep",
      title: "Inherent vs residual: sebelum dan sesudah kontrol",
      prose: [
        "Inherent risk = risiko jika tidak ada kontrol sama sekali. Korporat berlapis di bank dengan trade finance besar: inherent 25 (skala 25 = kemungkinan 5 × dampak 5). Residual risk = risiko SETELAH kontrol: residual = inherent × (1 − efektivitas kontrol). Kontrol EDD lemah (efektivitas 20%) → residual 25 × 0,8 = 20 → TINGGI.",
        "Skala rating: <6 RENDAH, 6–11 SEDANG, ≥12 TINGGI (skala 25). Empat risiko Artha Dana: Korporat berlapis residual 20 (TINGGI), VA off-ramp 15 (TINGGI), Trade finance 9 (SEDANG), Ritel tabungan 4 (RENDAH). Peta ini yang menjawab pemeriksa: 'risiko terbesar kami = korporat berlapis, dan ini action plan-nya.'",
        "Dua miskonsepsi. Satu: 'Kontrol banyak = risiko rendah.' Yang penting EFEKTIVITAS, bukan jumlah — 10 kontrol 10% efektivitas < 2 kontrol 60%. Dua: 'Residual nol = target.' Residual nol = kontrol tak terhingga biayanya; target = residual dalam selera risiko (appetite) dengan biaya wajar.",
        "Cara membaca figur: matriks 5×5 (kemungkinan × dampak); empat lingkaran = empat risiko pada posisi residualnya. Interpretasi: A dan B di zona merah = prioritas budget; D di zona hijau = kontrol sudah cukup, jangan tambah.",
      ],
      formula: String.raw`\text{Residual} = \text{Inherent} \times (1 - \text{Efektivitas kontrol})`,
      formulaNote: "Inherent = kemungkinan × dampak (skala 25) TANPA kontrol; efektivitas = 0–1 dari pengujian kontrol. Contoh: 25 × (1 − 0,20) = 20 → TINGGI. Interpretasi: kontrol yang lemah hampir tidak menurunkan risiko — peta jujur > peta cantik.",
      figure: {
        svg: FIG_HEAT,
        alt: "Matriks risiko 5x5 dengan empat risiko pada posisi residual.",
        caption: "A & B di zona merah = prioritas budget. D hijau = cukup.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“IRA = daftar risiko.” Daftar tanpa angka inherent, tanpa uji efektivitas kontrol, dan tanpa action plan = inventaris, bukan assessment. Pemeriksa menilai tiga hal: metodologi, angka, dan tindak lanjut.",
      },
      hints: [
        "Residual = inherent × (1 - efektivitas).",
        "Rating: <6 rendah, 6–11 sedang, ≥12 tinggi.",
      ],
      reference: "Inherent × (1 - efektivitas) = residual. Peta > daftar.",
    },
    {
      id: "kontrol",
      eyebrow: "Langkah 3 · Konsep",
      title: "Menguji kontrol: efektivitas bukan jumlah",
      prose: [
        "Efektivitas kontrol diukur, bukan diasumsikan. Tiga cara: (1) testing — sampling 30 alert, berapa % ditangani sesuai SOP? (2) metrik — hit rate, umur backlog, % EDD selesai tepat waktu; (3) temuan audit — berapa kontrol yang 'ada di kertas' tetapi tidak jalan?",
        "Contoh: kontrol 'EDD untuk korporat berlapis' — testing 30 kasus: 6 tidak ada dokumentasi BO → efektivitas 80%? Tidak — 24/30 = 80% patuh, tetapi 6 yang lolos adalah yang paling berisiko (adverse selection: analis malas justru pada kasus sulit). Efektivitas realistis: 20–40%. Jujur > optimis.",
        "Action plan untuk residual TINGGI: tiap risiko = kontrol tambahan + biaya + penurunan residual ekspektasian. Pilih dengan cost-effectiveness = penurunan/biaya. Di lab: kedua usulan layak (CE ≥ 0,05/jt) — tetapi jika budget hanya Rp100 jt, pilih VA off-ramp (CE 0,087 > 0,080).",
        "IRA hidup: review tahunan + trigger (produk baru, ekspansi negara, temuan besar). IRA 2024 yang tidak direview = peta tahun lalu untuk medan perang tahun ini.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Kontrol yang paling mahal = kontrol yang tidak diuji. Testing 30 sampel butuh 2 hari analis; kontrol 'efektivitas 90%' yang ternyata 20% = lubang Rp miliar. Uji dulu, bangga kemudian.",
      },
      reference: "Ukur efektivitas (testing), bukan hitung jumlah kontrol.",
    },
    {
      id: "lab-residual",
      eyebrow: "Langkah 4 · Lab",
      title: "Kalkulator residual risk",
      prose: [
        "Empat risiko Bank Artha Dana. Hitung residual tiap risiko (skala 25) dan ratingnya. Perhatikan: korporat berlapis inherent maksimum (25) dengan kontrol 20% → residual 20, TINGGI — inilah jawaban untuk pemeriksa OJK.",
        "Eksperimen: naikkan efektivitas kontrol korporat menjadi 60% (EDD diperketat + testing) → residual 10 → SEDANG. Satu angka ini = justifikasi budget program EDD.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `res` dan cetak rating tiap risiko" },
        { id: "t2", text: "Jalankan dan pastikan 4 baris tercetak" },
      ],
      expected: "Korporat berlapis: inherent 25, residual 20 -> TINGGI\nVA off-ramp: inherent 20, residual 15 -> TINGGI\nTrade finance: inherent 15, residual 9 -> SEDANG\nRitel tabungan: inherent 10, residual 4 -> RENDAH",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Efektivitas 20% terlalu pesimis.” Pesimis yang diukur > optimis yang diasumsikan. Pakai hasil testing, bukan harapan. IRA yang jujur tentang kontrol lemah = IRA yang bisa diperbaiki.",
      },
      hints: [
        "res = inh * 5 * (1 - eff).",
        "rating: <6 RENDAH, <12 SEDANG, sisanya TINGGI.",
      ],
      code: {
        starter: "# (risiko, inherent_1_5, efektivitas_kontrol_0_1). JANGAN UBAH.\nrisiko = [(\"Korporat berlapis\", 5, 0.20),\n          (\"VA off-ramp\", 4, 0.25),\n          (\"Trade finance\", 3, 0.40),\n          (\"Ritel tabungan\", 2, 0.60)]\n\n# TULIS KODEMU: residual = inherent * (1 - efektivitas)\ndef rating(r):\n    return \"RENDAH\" if r < 6 else (\"SEDANG\" if r < 12 else \"TINGGI\")\n\nfor nama, inh, eff in risiko:\n    res =\n    print(f\"{nama}: inherent {inh*5}, residual {res:.0f} -> {rating(res)}\")\n",
        lockLines: 8,
        solution: "# (risiko, inherent_1_5, efektivitas_kontrol_0_1). JANGAN UBAH.\nrisiko = [(\"Korporat berlapis\", 5, 0.20),\n          (\"VA off-ramp\", 4, 0.25),\n          (\"Trade finance\", 3, 0.40),\n          (\"Ritel tabungan\", 2, 0.60)]\n\n# TULIS KODEMU: residual = inherent * (1 - efektivitas)\ndef rating(r):\n    return \"RENDAH\" if r < 6 else (\"SEDANG\" if r < 12 else \"TINGGI\")\n\nfor nama, inh, eff in risiko:\n    res = inh * 5 * (1 - eff)  # skala 25\n    print(f\"{nama}: inherent {inh*5}, residual {res:.0f} -> {rating(res)}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Korporat TINGGI (20)", msg: "25×0,8 = 20.", pattern: "Korporat berlapis: inherent 25, residual 20 -> TINGGI" },
          { kind: "stdout_matches", task: "t2", label: "Ritel RENDAH (4)", msg: "10×0,4 = 4.", pattern: "Ritel tabungan: inherent 10, residual 4 -> RENDAH" }
        ],
      },
      reference: "Residual = inherent × (1 - efektivitas). Rating: <6/≥12.",
    },
    {
      id: "lab-ce",
      eyebrow: "Langkah 5 · Lab",
      title: "Action plan: dana terbatas, pilih dengan CE",
      prose: [
        "Dua usulan kontrol untuk dua risiko TINGGI. Hitung cost-effectiveness (penurunan residual per Rp1 jt) dan putuskan: DANAI jika CE ≥ 0,05. Keduanya lolos — tetapi tunjukkan juga residual barunya: korporat 20→8, VA 15→8.",
        "Jika budget hanya Rp100 jt: pilih SATU. CE korporat 0,080 vs VA 0,088 → pilih VA off-ramp. Inilah keputusan berbasis angka yang bisa dipertahankan di depan direksi — bukan 'keduanya penting'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ce` dan `baru`, tentukan DANAI/TUNDA" },
        { id: "t2", text: "Jalankan dan pastikan keputusan tercetak" },
      ],
      expected: "Korporat berlapis: residual 20->8, CE 0.080/jt -> DANAI\nVA off-ramp: residual 15->8, CE 0.087/jt -> DANAI",
      note: {
        title: "Intuisi",
        body: "'Keduanya penting' = tidak ada prioritas = budget dibagi rata = keduanya setengah jalan. CE memaksa pilihan pahit yang benar: satu risiko turun signifikan > dua risiko turun sedikit.",
      },
      hints: [
        "ce = turun / biaya.",
        "baru = res - turun.",
      ],
      code: {
        starter: "# Risiko residual TINGGI + kontrol usulan (JANGAN UBAH).\n# (risiko, residual, biaya_kontrol_jt, penurunan_residual)\nusulan = [(\"Korporat berlapis\", 20, 150, 12),\n          (\"VA off-ramp\", 15, 80, 7)]\n\n# TULIS KODEMU: cost-effectiveness = penurunan / biaya\nfor nama, res, biaya, turun in usulan:\n    ce =\n    baru =\n    print(f\"{nama}: residual {res}->{baru}, CE {ce:.3f}/jt -> {'DANAI' if ce >= 0.05 else 'TUNDA'}\")\n",
        lockLines: 5,
        solution: "# Risiko residual TINGGI + kontrol usulan (JANGAN UBAH).\n# (risiko, residual, biaya_kontrol_jt, penurunan_residual)\nusulan = [(\"Korporat berlapis\", 20, 150, 12),\n          (\"VA off-ramp\", 15, 80, 7)]\n\n# TULIS KODEMU: cost-effectiveness = penurunan / biaya\nfor nama, res, biaya, turun in usulan:\n    ce = turun / biaya\n    baru = res - turun\n    print(f\"{nama}: residual {res}->{baru}, CE {ce:.3f}/jt -> {'DANAI' if ce >= 0.05 else 'TUNDA'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Korporat DIDANAI", msg: "CE 0,080 ≥ 0,05.", pattern: "Korporat berlapis: residual 20->8, CE 0\\.080/jt -> DANAI" },
          { kind: "stdout_matches", task: "t2", label: "VA DIDANAI", msg: "CE 0,088 ≥ 0,05.", pattern: "VA off-ramp: residual 15->8, CE 0\\.087/jt -> DANAI" }
        ],
      },
      reference: "CE = penurunan/biaya. Budget terbatas → CE tertinggi dulu.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Hasil IRA: respons apa",
      prose: [
        "Satu: residual TINGGI + kontrol lemah → action plan + budget + tenggat 90 hari; lapor progres ke komite. Dua: residual TINGGI + kontrol sudah kuat → terima risiko (risk acceptance) dengan persetujuan direksi — didokumentasikan, bukan didiamkan. Tiga: residual SEDANG → pantau + review tahunan; jangan alokasikan budget besar. Empat: residual RENDAH → pertahankan; waspadai 'kontrol creep' (tambah kontrol di risiko kecil = birokrasi).",
        "Aturan praktis 10 detik: TINGGI = aksi/budget. SEDANG = pantau. RENDAH = jangan sentuh. Menerima risiko = keputusan tertulis, bukan kelalaian.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Risk acceptance (skenario 2) sering disalahartikan sebagai 'menyerah'. Padahal ia keputusan dewasa: 'kami tahu risikonya, kami ukur, dan kami pilih tidak membayar kontrol Rp500 jt untuk risiko Rp50 jt.' Yang dilarang = menerima tanpa mengukur.",
      },
      reference: "TINGGI = aksi; SEDANG = pantau; RENDAH = jangan sentuh.",
    },
    {
      id: "lab-3",
      eyebrow: "Lab 3 · Peta panas residual",
      title: "Risiko apa yang tersisa?",
      prose: [
        "Lab 1–2 menghitung risiko inheren dan efektivitas kontrol. Lab ini menghitung risiko residual = inheren × (1 − efektivitas): risiko yang TERSISA setelah kontrol. Korupsi (inheren 90, kontrol 30%) menyisakan 63 — TINGGI; penipuan kartu (inheren 60, kontrol 80%) menyisakan 12 — RENDAH.",
        "Peta panas residual adalah output utama IRA yang dibaca direksi: ia menjawab 'setelah semua uang kontrol dibelanjakan, apa yang masih mengancam kita?' — dan menentukan alokasi anggaran kontrol tahun depan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung residual = inheren × (1 - efektivitas)" },
        { id: "t2", text: "Jalankan dan pastikan peringkat tercetak" },
      ],
      expected: "Korupsi: residual 63 -> TINGGI\nPenipuan kartu: residual 12 -> RENDAH\nPenggelapan: residual 28 -> SEDANG",
      note: {
        title: "Kontrol di kertas ≠ di lapangan.",
        type: "pitfall",
        body: "“Efektivitas 80% menurut SOP.” IRA memakai efektivitas TERUJI (hasil audit/pengujian), bukan klaim SOP. Kontrol yang tidak pernah diuji = efektivitas 0 untuk keperluan IRA.",
      },
      hints: [
        "residual = inheren * (1 - efektivitas).",
        "TINGGI bila >= 50; SEDANG bila >= 25.",
      ],
      code: {
        starter: "# (risiko, inheren 0-100, efektivitas kontrol 0-1). JANGAN UBAH.\nrisiko = [(\"Korupsi\", 90, 0.3), (\"Penipuan kartu\", 60, 0.8), (\"Penggelapan\", 70, 0.6)]\n\n# TULIS KODEMU: risiko residual\nfor nama, inheren, eff in risiko:\n    residual = \n    level = \"TINGGI\" if residual >= 50 else (\"SEDANG\" if residual >= 25 else \"RENDAH\")\n    print(f\"{nama}: residual {residual:.0f} -> {level}\")",
        lockLines: 4,
        solution: "# (risiko, inheren 0-100, efektivitas kontrol 0-1). JANGAN UBAH.\nrisiko = [(\"Korupsi\", 90, 0.3), (\"Penipuan kartu\", 60, 0.8), (\"Penggelapan\", 70, 0.6)]\n\n# TULIS KODEMU: risiko residual\nfor nama, inheren, eff in risiko:\n    residual = inheren * (1 - eff)\n    level = \"TINGGI\" if residual >= 50 else (\"SEDANG\" if residual >= 25 else \"RENDAH\")\n    print(f\"{nama}: residual {residual:.0f} -> {level}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Korupsi TINGGI", msg: "Residual 63.", pattern: "Korupsi: residual 63 -\> TINGGI" },
          { kind: "stdout_matches", task: "t2", label: "Kartu RENDAH", msg: "Residual 12.", pattern: "Penipuan kartu: residual 12 -\> RENDAH" }
        ],
      },
      reference: "Residual = yang tersisa setelah kontrol. Output utama IRA untuk direksi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Menjawab pemeriksa dalam 90 hari",
      prose: [
        "Hari ke-90. Presentasi ke pemeriksa: (1) Metodologi: skala 25, testing 30 sampel per kontrol, rating <6/6–11/≥12. (2) Peta: 12 risiko dinilai; 2 TINGGI (korporat berlapis 20, VA off-ramp 15), 5 SEDANG, 5 RENDAH. (3) Action plan: Rp230 jt untuk 2 kontrol (CE 0,080 dan 0,087), residual proyeksi turun ke 8 dan 8 (SEDANG). (4) Tata kelola: review tahunan + trigger produk baru.",
        "Pertanyaan pemeriksa: 'Kenapa trade finance (residual 9) tidak dapat budget?' Pembahasan: 'Karena SEDANG = pantau, dan budget Rp230 jt memberi penurunan terbesar per rupiah di dua risiko TINGGI. Jika Bapak/Ibu memaksa, kami alihkan Rp80 jt — tetapi CE-nya 0,03, di bawah ambang. Kami siap mendokumentasikan pilihan Bapak/Ibu.' — jawaban berbasis angka yang membuat pemeriksa mengangguk, bukan berdebat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "IRA yang baik membuat percakapan dengan regulator menjadi diskusi angka, bukan adu opini. 'CE 0,03 di bawah ambang' = kalimat yang menutup debat. Tanpa IRA, setiap pertanyaan pemeriksa = krisis.",
      },
      reference: "Metodologi + peta + action plan + tata kelola = jawaban 90 hari.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Inti: residual = ukuran kejujuran kontrolmu.",
      ],
      tasks: [],
      summary: [
        "Inherent = risiko tanpa kontrol; residual = inherent × (1 − efektivitas).",
        "Rating (skala 25): <6 RENDAH, 6–11 SEDANG, ≥12 TINGGI.",
        "Efektivitas diukur via testing, bukan diasumsikan dari jumlah kontrol.",
        "Action plan dipilih dengan cost-effectiveness = penurunan/biaya.",
        "Menerima risiko = keputusan tertulis direksi, bukan kelalaian.",
      ],
      next: { label: "AML11 — Terrorist Financing Typologies", href: "/learn/aml11-terrorist-financing" },
      quiz: [
        {
          q: "Korporat berlapis: inherent 25, efektivitas kontrol 20%. Residual dan rating?",
          options: [
            { text: "20 → TINGGI", why: "Benar: 25×0,8 = 20 ≥12.", correct: true },
            { text: "5 → RENDAH", why: "Itu jika efektivitas 80%. Testing berkata 20%." },
            { text: "25 → TINGGI (kontrol tidak dihitung)", why: "Kontrol dihitung via (1−efektivitas) = 0,8." }
          ],
        },
        {
          q: "Bank punya 40 kontrol tetapi 2 risiko residual TINGGI. Kesimpulan?",
          options: [
            { text: "Kontrol tersebar merata; alokasikan ulang berbasis IRA", why: "Benar: mentega tipis di roti lebar.", correct: true },
            { text: "Tambah 20 kontrol lagi", why: "Jumlah bukan masalah; efektivitas & alokasi yang masalah." },
            { text: "40 kontrol = sudah cukup", why: "Cukup dihitung dari residual, bukan jumlah." }
          ],
        },
        {
          q: "Budget Rp100 jt; CE korporat 0,080 vs VA 0,088. Pilih?",
          options: [
            { text: "VA off-ramp (CE lebih tinggi)", why: "Benar: penurunan terbesar per rupiah.", correct: true },
            { text: "Bagi rata Rp50 jt each", why: "'Keduanya penting' = keduanya setengah jalan." },
            { text: "Korporat (nominal risiko lebih besar)", why: "Nominal tanpa CE = keputusan berbasis rasa." }
          ],
        },
        {
          q: "Residual TINGGI tetapi kontrol sudah maksimal. Respons?",
          options: [
            { text: "Risk acceptance tertulis oleh direksi", why: "Benar: terima dengan mengukur, bukan mengabaikan.", correct: true },
            { text: "Sembunyikan dari laporan", why: "Menyembunyikan = temuan tata kelola." },
            { text: "Tambah kontrol sampai residual nol", why: "Residual nol = biaya tak terhingga; tidak ekonomis." }
          ],
        },
        {
          q: "Kapan IRA harus direview?",
          options: [
            { text: "Tahunan + trigger (produk baru, ekspansi, temuan besar)", why: "Benar: peta harus mengikuti medan.", correct: true },
            { text: "Sekali saja saat diminta regulator", why: "IRA basi = peta tahun lalu." },
            { text: "Setiap ada alert baru", why: "Terlalu sering; alert = operasional, bukan strategis." }
          ],
        }
      ],
      reference: "Residual = kejujuran kontrol. CE = prioritas budget.",
    },
  ],
};
