import type { V2Lesson } from "../lib/types";

const FIG_RAS = `<svg viewBox="0 0 480 280" role="img" aria-label="Batang utilisasi empat limit risiko terhadap batasnya.">
<g font-family="var(--font-ui)">
<text x="10" y="52" font-size="12" fill="var(--chart-text)" text-anchor="start">NPL</text>
<rect x="90" y="36" width="188" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="90" y="30" font-size="11" fill="var(--chart-text)">3,4% dari 5,0% (68%)</text>
<text x="10" y="102" font-size="12" fill="var(--chart-text)" text-anchor="start">Top-20</text>
<rect x="90" y="86" width="312" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="90" y="80" font-size="11" fill="var(--chart-text)">45% dari 40% (112% BREACH)</text>
<text x="10" y="152" font-size="12" fill="var(--chart-text)" text-anchor="start">LCR</text>
<rect x="90" y="136" width="205" height="26" fill="var(--c2)" opacity="0.9"/>
<text x="90" y="130" font-size="11" fill="var(--chart-text)">135% vs min 100% (74%)</text>
<text x="10" y="202" font-size="12" fill="var(--chart-text)" text-anchor="start">BMPK</text>
<rect x="90" y="186" width="222" height="26" fill="var(--c3)" opacity="0.9"/>
<text x="90" y="180" font-size="11" fill="var(--chart-text)">8% dari 10% (80% AMBER)</text>
<line x1="367" y1="20" x2="367" y2="220" stroke="var(--chart-text)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="367" y="240" font-size="11" fill="var(--chart-text)" text-anchor="middle">batas 100%</text>
<text x="240" y="268" font-size="11" fill="var(--chart-text)" text-anchor="middle">Utilisasi limit: hijau &lt; 80%, amber 80-100%, merah &gt; 100% (breach)</text>
</g>
</svg>`;

export const rr15: V2Lesson = {
  slug: "rr15-risk-appetite",
  track: "Risk Reporting",
  module: "Angka Risiko & Regulasi",
  title: "RR15 — Risk Appetite & Limit Monitoring",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Limit 40% yang ditembus tanpa eskalasi",
      prose: [
        "Risk Appetite Statement Bank Artha Dana, ditandatangani direksi Januari: 'konsentrasi 20 debitur terbesar maksimal 40% dari total kredit.' Oktober: 42% — status AMBER, dilaporkan ke komite, rencana: tidak ada penambahan eksposur baru. November: 45% — status MERAH. Tidak ada eskalasi. Alasannya: 'masih terkendali, dua debitur besar bayar Desember.'",
        "Desember: dua debitur itu gagal bayar hampir bersamaan. NPL melonjak dari 3,0% ke 4,8%. Komite membuka kembali catatan limit — dan menemukan breach 45% yang tidak pernah dieksekusi. Limitnya ada. Angkanya dimonitor. Yang tidak ada: tindak lanjut.",
        "Twist-nya: tidak ada yang melanggar prosedur secara teknis — karena prosedurnya tidak mewajibkan apa pun saat breach terjadi. 'Limit' tanpa aturan eskalasi = saran, bukan limit. Inilah inti lesson ini: risk appetite framework (RAS) + cascading limit + breach escalation. Tiga hal yang membedakan bank yang punya limit di kertas dengan bank yang punya limit di perilaku.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan cascading limit dari RAS direksi ke limit desk; (2) menghitung utilisasi limit dan status RAG; (3) menjalankan eskalasi breach T+0/T+1/T+5; (4) mendeteksi over-cascade antar level limit.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Breach yang tidak dieskalasi = risiko yang disetujui diam-diam. Setiap bulan breach dibiarkan, bank secara de facto menaikkan risk appetite-nya tanpa persetujuan direksi. Itu bukan fleksibilitas — itu pelanggaran tata kelola.",
      },
      reference: "Limit tanpa eskalasi = saran. RAS tanpa cascade = slogan.",
    },
    {
      id: "ras",
      eyebrow: "Langkah 2 · Konsep",
      title: "RAS: selera risiko yang tertulis",
      prose: [
        "Risk Appetite Statement (RAS) = pernyataan tertulis direksi tentang seberapa banyak risiko yang bersedia diambil untuk mencapai target bisnis. Ia punya dua sisi: kualitatif ('tidak berbisnis dengan debitur tanpa laporan keuangan audited') dan kuantitatif ('NPL maksimal 5%, konsentrasi top-20 maksimal 40%'). Tanpa RAS, setiap keputusan limit = negosiasi ulang dari nol.",
        "Cascading: RAS direksi → risk limits per divisi → desk limits per tim. Contoh: RAS 'konsentrasi wajar' → limit top-20 40% (Rp4.000 M dari Rp10.000 M) → sub-limit per debitur besar Rp1.500 M. Aturan cascade yang keras: total sub-limit TIDAK BOLEH melebihi parent limit. Jika D1–D4 masing-masing Rp1.200 + 1.000 + 800 + 1.500 = Rp4.500 M > Rp4.000 M → over-cascade: di atas kertas semua patuh, agregatnya jebol.",
        "Rumus utilisasi: untuk 'semakin kecil semakin baik' (NPL, konsentrasi): utilisasi = aktual/batas × 100%. Untuk 'semakin besar semakin baik' (LCR, coverage): utilisasi = batas/aktual × 100% (mengukur seberapa dekat ke batas dari sisi aman). Status RAG: <80% HIJAU, 80–100% AMBER, >100% MERAH (breach).",
        "Cara membaca figur: empat batang = utilisasi empat limit; garis putus-putus = 100% (batas). Interpretasi: Top-20 menembus garis (112% — MERAH, eskalasi T+0); BMPK 80% AMBER (siapkan rencana, belum eskalasi); NPL dan LCR HIJAU. Satu gambar ini = isi slide 1 laporan limit bulanan.",
      ],
      formula: String.raw`\text{Utilisasi} = \frac{\text{Aktual}}{\text{Batas}} \times 100\% \quad (\text{arah } \leq)`,
      formulaNote: "Aktual = posisi terkini, Batas = limit yang berlaku. Untuk arah ≥ (LCR, coverage): dibalik menjadi Batas/Aktual × 100%. Contoh Top-20: 45/40 × 100% = 112,5% → MERAH (breach).",
      figure: {
        svg: FIG_RAS,
        alt: "Batang utilisasi empat limit risiko terhadap batasnya; Top-20 menembus 100%.",
        caption: "Utilisasi limit: garis putus-putus = batas. Yang menembus = breach, eskalasi T+0.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Limit = angka di SK direksi.” Angka tanpa cascade dan eskalasi = dekorasi. Bank dengan 200 limit di SK tetapi tanpa monitor utilisasi bulanan = bank tanpa limit. Yang diuji pemeriksa bukan SK-nya, melainkan bukti monitor + eskalasinya.",
      },
      hints: [
        "Untuk arah '<=': util = aktual/batas*100; arah '>=': util = batas/aktual*100.",
        "AMBER mulai 80%: waspada, siapkan rencana — belum eskalasi.",
      ],
      reference: "RAS → cascade → utilisasi RAG. Total sub-limit ≤ parent limit.",
    },
    {
      id: "eskalasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Breach: apa yang terjadi setelah merah",
      prose: [
        "Breach ≠ pelanggaran otomatis. Ada dua jenis: unapproved breach (liar — tidak dilaporkan, tidak ada rencana) dan approved breach (pengecualian sementara yang disetujui direksi/komite dengan mitigasi + tenggat). Yang dilarang keras = yang pertama. Kasus Artha Dana: breach 45% yang tidak dieskalasi = unapproved.",
        "Timeline eskalasi standar: T+0 (hari breach terdeteksi): lapor ke CRO + pemilik limit, catat di register breach. T+1: rencana aksi tertulis — kurangi eksposur, atau ajukan pengecualian. T+5: breach ditutup (kembali di bawah limit) ATAU pengecualian disetujui direksi dengan syarat (mis. tambah CKPN Rp20 M, monitor harian). Melewati T+5 tanpa keduanya = temuan tata kelola.",
        "Contoh rencana aksi untuk top-20 45%: Opsi A — kurangi eksposur Rp500 M dalam 30 hari (percepat pelunasan/tagih). Opsi B — minta pengecualian 90 hari + tambah CKPN Rp20 M + larangan eksposur baru. Keduanya sah; yang tidak sah = diam. Direksi membayar CRO untuk memilih, bukan untuk menunda.",
        "Register breach = jejak audit: tanggal, limit, utilisasi, penyebab, rencana aksi, pemilik, status. Pemeriksa OJK tidak bertanya 'kenapa breach?' — mereka bertanya 'mana buktinya dieskalasi?' Register yang kosong = jawaban yang salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Breach yang dieskalasi dengan benar justru TANDA sistem bekerja — seperti alarm kebakaran yang berbunyi lalu penghuni keluar dengan tertib. Yang berbahaya = alarm dicabut agar tidak berisik. Jangan menghukum breach; hukum breach yang disembunyikan.",
      },
      reference: "T+0 lapor, T+1 rencana, T+5 tutup/pengecualian. Register breach = bukti.",
    },
    {
      id: "lab-rag",
      eyebrow: "Langkah 4 · Lab",
      title: "Monitor RAG lima limit",
      prose: [
        "Bangun monitor utilisasi seperti yang seharusnya dimiliki tim Artha Dana: lima limit, hitung utilisasi + status RAG, kumpulkan yang MERAH untuk eskalasi T+0. Perhatikan Coverage: aktual 72 vs batas minimum 80 — arah 'semakin besar semakin baik', utilisasinya 111,1% → MERAH juga.",
        "Eksperimen setelah selesai: ubah BMPK menjadi 9,5 (utilisasi 95% → tetap AMBER) lalu 10,5 (105% → MERAH). Rasakan di mana garisnya berpindah — dan bayangkan kamu yang harus menelepon CRO saat itu terjadi.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `rag` yang mengembalikan (utilisasi_%, status)" },
        { id: "t2", text: "Jalankan: pastikan 5 baris + daftar breach tercetak" },
      ],
      expected: "NPL: utilisasi 68.0% -> HIJAU\nTop-20: utilisasi 112.5% -> MERAH\nLCR: utilisasi 74.1% -> HIJAU\nBMPK: utilisasi 80.0% -> AMBER\nCoverage: utilisasi 111.1% -> MERAH\nBreach: 2 (Top-20, Coverage) -> ESKALASI T+0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Utilisasi = aktual/batas untuk semua.” Untuk LCR/coverage (semakin besar semakin baik), rumus itu menghasilkan angka <100% yang terlihat aman padahal mendekati batas dari bawah. Selalu balik rumusnya sesuai arah.",
      },
      hints: [
        "Arah '<=': util = aktual/batas*100; arah '>=': util = batas/aktual*100.",
        "HIJAU <80, AMBER 80–100, MERAH >100.",
      ],
      code: {
        starter: "# Limit monitoring (JANGAN UBAH).\n# (nama, aktual, batas, arah): \"<=\" = semakin kecil semakin baik\nlimits = [(\"NPL\", 3.4, 5.0, \"<=\"), (\"Top-20\", 45.0, 40.0, \"<=\"),\n          (\"LCR\", 135.0, 100.0, \">=\"), (\"BMPK\", 8.0, 10.0, \"<=\"),\n          (\"Coverage\", 72.0, 80.0, \">=\")]\n\n# TULIS KODEMU\ndef rag(nama, aktual, batas, arah):\n    return  # (utilisasi_%, status)\n\nbreach = []\nfor nama, aktual, batas, arah in limits:\n    util, st = rag(nama, aktual, batas, arah)\n    print(f\"{nama}: utilisasi {util:.1f}% -> {st}\")\n    if st == \"MERAH\":\n        breach.append(nama)\nprint(f\"Breach: {len(breach)} ({', '.join(breach)}) -> {'ESKALASI T+0' if breach else 'tidak ada'}\")\n",
        lockLines: 6,
        solution: "# Limit monitoring (JANGAN UBAH).\n# (nama, aktual, batas, arah): \"<=\" = semakin kecil semakin baik\nlimits = [(\"NPL\", 3.4, 5.0, \"<=\"), (\"Top-20\", 45.0, 40.0, \"<=\"),\n          (\"LCR\", 135.0, 100.0, \">=\"), (\"BMPK\", 8.0, 10.0, \"<=\"),\n          (\"Coverage\", 72.0, 80.0, \">=\")]\n\n# TULIS KODEMU\ndef rag(nama, aktual, batas, arah):\n    if arah == \"<=\":\n        util = aktual / batas * 100\n    else:\n        util = batas / aktual * 100\n    st = \"HIJAU\" if util < 80 else (\"AMBER\" if util <= 100 else \"MERAH\")\n    return (util, st)\n\nbreach = []\nfor nama, aktual, batas, arah in limits:\n    util, st = rag(nama, aktual, batas, arah)\n    print(f\"{nama}: utilisasi {util:.1f}% -> {st}\")\n    if st == \"MERAH\":\n        breach.append(nama)\nprint(f\"Breach: {len(breach)} ({', '.join(breach)}) -> {'ESKALASI T+0' if breach else 'tidak ada'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Top-20 MERAH 112,5%", msg: "45/40 = 112,5% > 100%.", pattern: "Top-20: utilisasi 112\\.5% -> MERAH" },
          { kind: "stdout_matches", task: "t2", label: "Coverage MERAH", msg: "80/72 = 111,1% > 100%.", pattern: "Coverage: utilisasi 111\\.1% -> MERAH" },
          { kind: "stdout_matches", task: "t2", label: "Daftar breach benar", msg: "2 breach: Top-20, Coverage.", pattern: "Breach: 2 \\(Top-20, Coverage\\) -> ESKALASI T\\+0" }
        ],
      },
      reference: "Monitor RAG = denyut nadi limit. MERAH = telepon CRO hari ini.",
    },
    {
      id: "lab-cascade",
      eyebrow: "Langkah 5 · Lab",
      title: "Jebakan over-cascade",
      prose: [
        "Parent limit top-20 = Rp4.000 M. Empat sub-limit debitur: Rp1.200 + 1.000 + 800 + 1.500 = Rp4.500 M. Masing-masing di bawah parent — tetapi totalnya 112,5% dari parent. Jika keempatnya terpakai penuh, agregat jebol tanpa satu pun sub-limit yang breach. Inilah over-cascade: kepatuhan lokal, pelanggaran global.",
        "Pemeriksa cascade: jumlahkan sub-limit, bandingkan dengan parent. Praktik bank: sub-limit total diminta ≤ 90% parent (buffer untuk fleksibilitas). Lab ini pemeriksa versi sederhananya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total` sub-limit" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Total sub-limit: Rp4500 M vs parent Rp4000 M\nOVER-CASCADE -> perbaiki sebelum berlaku",
      note: {
        title: "Intuisi",
        body: "Over-cascade adalah cara paling sopan untuk melanggar limit: tidak ada yang salah secara individu, tetapi sistemnya jebol. Selalu audit agregat, bukan hanya daunnya.",
      },
      hints: [
        "total = sum(v for _, v in sub).",
        "Bandingkan dengan parent: > parent → OVER-CASCADE.",
      ],
      code: {
        starter: "# Parent limit top-20 = 40% dari total kredit Rp10.000 M (JANGAN UBAH).\nparent = 4000  # Rp miliar\nsub = [(\"D1\", 1200), (\"D2\", 1000), (\"D3\", 800), (\"D4\", 1500)]  # sub-limit Rp M\n\n# TULIS KODEMU\ntotal =\nprint(f\"Total sub-limit: Rp{total} M vs parent Rp{parent} M\")\nprint(\"OVER-CASCADE -> perbaiki sebelum berlaku\" if total > parent else \"OK: cascade konsisten\")\n",
        lockLines: 3,
        solution: "# Parent limit top-20 = 40% dari total kredit Rp10.000 M (JANGAN UBAH).\nparent = 4000  # Rp miliar\nsub = [(\"D1\", 1200), (\"D2\", 1000), (\"D3\", 800), (\"D4\", 1500)]  # sub-limit Rp M\n\n# TULIS KODEMU\ntotal = sum(v for _, v in sub)\nprint(f\"Total sub-limit: Rp{total} M vs parent Rp{parent} M\")\nprint(\"OVER-CASCADE -> perbaiki sebelum berlaku\" if total > parent else \"OK: cascade konsisten\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`total` = 4500", msg: "1.200+1.000+800+1.500 = 4.500.", name: "total", value: 4500, tol: 1e-09 },
          { kind: "stdout_matches", task: "t2", label: "Over-cascade terdeteksi", msg: "4.500 > 4.000.", pattern: "OVER-CASCADE -> perbaiki sebelum berlaku" }
        ],
      },
      reference: "Total sub-limit ≤ parent. Audit agregat tiap perubahan limit.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Breach terjadi: respons apa",
      prose: [
        "Satu: utilisasi 85% (AMBER) → pantau mingguan + siapkan rencana aksi draft; belum eskalasi. Dua: utilisasi 112% (MERAH) → eskalasi T+0 ke CRO, T+1 rencana aksi tertulis. Tiga: breach + rencana disetujui direksi → approved breach: monitor harian, tenggat 90 hari, tambah mitigasi (CKPN). Empat: breach 3 bulan berturut-turut → review limitnya, bukan hanya bisnisnya — mungkin limit yang tidak realistis.",
        "Aturan praktis 10 detik: HIJAU = tidur nyenyak. AMBER = siapkan payung. MERAH = telepon sekarang. Merah yang disembunyikan = temuan tata kelola tahun depan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Limit yang tidak pernah breach dalam 3 tahun patut dicurigai juga — mungkin terlalu longgar sehingga tidak mengikat apa pun. Limit yang baik sesekali AMBER; yang tidak pernah = dekorasi.",
      },
      reference: "AMBER = rencana; MERAH = eskalasi; kronis = review limit.",
    },
    {
      id: "lab-3",
      eyebrow: "Lab 3 · Agregasi utilisasi",
      title: "Utilisasi gabungan: siapa paling panas?",
      prose: [
        "Lab 1–2 mengukur utilisasi per unit. Lab ini mengagregasi: lima unit bisnis dengan utilisasi 45%–97%. Unit dengan utilisasi ≥ 90% berstatus PANAS dan wajib menurunkan eksposur atau meminta kenaikan limit lewat komite — tidak bisa diam.",
        "Hasil: Treasury 97% dan Korporasi 92% = PANAS; Ritel 78% = WASPADA; sisanya AMAN. Agregasi ini adalah inti limit monitoring — direksi tidak membaca 200 limit, melainkan 5 baris ini.",
      ],
      tasks: [
        { id: "t1", text: "Hitung utilisasi = aktual/limit tiap unit" },
        { id: "t2", text: "Jalankan dan pastikan status tercetak" },
      ],
      expected: "Treasury: 97.0% -> PANAS\nKorporasi: 92.0% -> PANAS\nRitel: 78.0% -> WASPADA\nUMKM: 45.0% -> AMAN\nSyariah: 60.0% -> AMAN",
      note: {
        title: "Rata-rata menyembunyikan api.",
        type: "pitfall",
        body: "“Rata-rata utilisasi 76%, masih aman.” Rata-rata dari lima unit menyembunyikan dua yang PANAS. Agregasi yang benar memakai maksimum dan hitungan unit panas — bukan rata-rata.",
      },
      hints: [
        "utilisasi = aktual / limit.",
        "PANAS bila >= 0.9; WASPADA bila >= 0.7; selain itu AMAN.",
      ],
      code: {
        starter: "# (unit, aktual, limit) dalam Rp M. JANGAN UBAH.\nunit = [(\"Treasury\", 970, 1000), (\"Korporasi\", 920, 1000), (\"Ritel\", 780, 1000), (\"UMKM\", 450, 1000), (\"Syariah\", 600, 1000)]\n\n# TULIS KODEMU: utilisasi + status\nfor nama, aktual, limit in unit:\n    u = \n    status = \"PANAS\" if u >= 0.9 else (\"WASPADA\" if u >= 0.7 else \"AMAN\")\n    print(f\"{nama}: {u:.1%} -> {status}\")",
        lockLines: 4,
        solution: "# (unit, aktual, limit) dalam Rp M. JANGAN UBAH.\nunit = [(\"Treasury\", 970, 1000), (\"Korporasi\", 920, 1000), (\"Ritel\", 780, 1000), (\"UMKM\", 450, 1000), (\"Syariah\", 600, 1000)]\n\n# TULIS KODEMU: utilisasi + status\nfor nama, aktual, limit in unit:\n    u = aktual / limit\n    status = \"PANAS\" if u >= 0.9 else (\"WASPADA\" if u >= 0.7 else \"AMAN\")\n    print(f\"{nama}: {u:.1%} -> {status}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Treasury PANAS", msg: "Utilisasi 97%.", pattern: "Treasury: 97\.0% -\> PANAS" },
          { kind: "stdout_matches", task: "t2", label: "UMKM AMAN", msg: "Utilisasi 45%.", pattern: "UMKM: 45\.0% -\> AMAN" }
        ],
      },
      reference: "Direksi membaca 5 baris agregasi, bukan 200 limit. PANAS = turunkan eksposur atau minta kenaikan limit.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Top-20 45%: rencana aksi dalam angka",
      prose: [
        "Data: total kredit Rp10.000 M, top-20 = Rp4.500 M (45%) vs limit 40% (Rp4.000 M). Excess = Rp500 M. Dua debitur terbesar: D1 Rp1.200 M (akan bayar Rp300 M Desember — klaim), D2 Rp1.000 M (restrukturisasi, DPD 35 hari). Coverage 72% (batas 80%).",
        "Pertanyaan: susun rencana aksi T+1. Pembahasan: (1) Eskalasi T+0: lapor CRO + catat register. (2) Rencana: Opsi A — tagih D1 Rp300 M Desember + rem D2 → proyeksi 42% (masih MERAH, tidak cukup). Opsi B — ajukan approved breach 90 hari: syarat tambah CKPN Rp20 M (coverage 72% → 74%), larangan eksposur baru top-20, monitor mingguan ke komite. (3) Rekomendasi: Opsi B — karena Opsi A bertumpu pada 'klaim akan bayar' yang belum tentu. Angka Rp500 M excess vs Rp20 M CKPN tambahan = premi 4% untuk 90 hari waktu. Itulah keputusan berbasis angka, bukan harapan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rencana aksi yang bertumpu pada 'debitur janji bayar' = harapan, bukan mitigasi. Mitigasi yang sah: kas (CKPN), kontrak (larangan eksposur), atau waktu yang dibeli dengan harga jelas (approved breach + syarat).",
      },
      reference: "Excess Rp500 M: kurangi, atau beli waktu 90 hari seharga CKPN + syarat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Perhatikan why-nya — pola pikir eskalasi lebih penting dari hafalan angka.",
      ],
      tasks: [],
      summary: [
        "RAS = selera risiko tertulis direksi; cascade: RAS → limit divisi → limit desk.",
        "Utilisasi RAG: <80% HIJAU, 80–100% AMBER, >100% MERAH (breach).",
        "Total sub-limit tidak boleh melebihi parent limit (over-cascade).",
        "Breach: T+0 lapor, T+1 rencana, T+5 tutup/pengecualian; yang dilarang = breach diam-diam.",
        "Approved breach = pengecualian sementara dengan mitigasi + tenggat, bukan pelanggaran.",
      ],
      next: { label: "RR16 — ECL & RWA Reporting", href: "/v2/learn/rr16-ecl-rwa" },
      quiz: [
        {
          q: "Apa beda RAS dengan limit?",
          options: [
            { text: "RAS = pernyataan selera risiko; limit = angka operasional turunan RAS", why: "Tepat. RAS menjawab 'seberapa berani', limit menjawab 'berapa angkanya'.", correct: true },
            { text: "Sama saja, beda istilah", why: "Bukan — RAS kualitatif+kuantitatif di level direksi; limit kuantitatif di level operasional." },
            { text: "RAS untuk regulator, limit untuk internal", why: "Keduanya internal; regulator menilai keduanya ada dan konsisten." }
          ],
        },
        {
          q: "Total sub-limit Rp4.500 M vs parent Rp4.000 M. Kesimpulan?",
          options: [
            { text: "Over-cascade: perbaiki sebelum berlaku", why: "Benar. Agregat 112,5% parent — jebol tanpa satu pun sub-limit breach.", correct: true },
            { text: "Aman, karena tiap sub-limit di bawah parent", why: "Jebakan over-cascade: kepatuhan lokal, pelanggaran global." },
            { text: "Naikkan parent menjadi Rp4.500 M", why: "Menaikkan limit untuk menyesuaikan pelanggaran = limit mengikuti bisnis, bukan mengendalikannya." }
          ],
        },
        {
          q: "Utilisasi 112% terdeteksi pagi ini. Tindakan benar?",
          options: [
            { text: "Eskalasi T+0 ke CRO + catat register", why: "Benar. MERAH = telepon hari ini, bukan 'tunggu reda'.", correct: true },
            { text: "Tunggu sampai 120% agar yakin", why: "Menunggu = breach diam-diam = temuan tata kelola." },
            { text: "Kecilkan angka di laporan agar 99%", why: "Manipulasi laporan = pelanggaran integritas, jauh lebih berat dari breach." }
          ],
        },
        {
          q: "Mana yang BUKAN mitigasi sah untuk approved breach?",
          options: [
            { text: "Tambah CKPN Rp20 M + larangan eksposur baru", why: "Ini mitigasi sah: kas + kontrak." },
            { text: "Monitor harian + tenggat 90 hari", why: "Ini syarat sah: pengawasan + batas waktu." },
            { text: "'Dua debitur janji bayar Desember'", why: "Benar ini jawabannya: janji = harapan, bukan mitigasi. Mitigasi = kas/kontrak/waktu berbayar.", correct: true }
          ],
        },
        {
          q: "Coverage 72% vs batas minimum 80% (arah ≥). Status?",
          options: [
            { text: "MERAH — utilisasi 111,1%", why: "Benar. 80/72 × 100% = 111,1% > 100%. Arah ≥ dibalik rumusnya.", correct: true },
            { text: "HIJAU — 72/80 = 90% < 100%", why: "Salah arah rumus: untuk 'semakin besar semakin baik', utilisasi = batas/aktual." },
            { text: "AMBER — masih di atas 70%", why: "Ambang AMBER 80–100% dari utilisasi yang benar (111,1%) = MERAH." }
          ],
        }
      ],
      reference: "RAS → cascade → RAG → eskalasi. Limit diukur dari perilakunya.",
    },
  ],
};
