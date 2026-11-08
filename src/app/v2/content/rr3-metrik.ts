import type { V2Lesson } from "../lib/types";

// Dua definisi "default", dua angka NPL yang sama-sama benar.
const FIG_DEFINISI = `<svg viewBox=\"0 0 480 260\" role=\"img\" aria-label=\"Perbandingan NPL 3,4 persen vs 5,2 persen dari dua definisi default berbeda.\">
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<text x=\"120\" y=\"24\" font-size=\"13\" font-weight=\"600\" fill=\"var(--chart-text)\">Definisi A</text>
<text x=\"120\" y=\"42\" font-size=\"11\" fill=\"var(--text-muted)\">kolektibilitas 3–5</text>
<rect x=\"60\" y=\"120\" width=\"120\" height=\"96\" fill=\"var(--c1)\" opacity=\"0.9\"/>
<text x=\"120\" y=\"110\" font-size=\"15\" font-weight=\"700\" fill=\"var(--chart-text)\">3,4%</text>
<text x=\"360\" y=\"24\" font-size=\"13\" font-weight=\"600\" fill=\"var(--chart-text)\">Definisi B</text>
<text x=\"360\" y=\"42\" font-size=\"11\" fill=\"var(--text-muted)\">DPD &gt; 90 hari</text>
<rect x=\"300\" y=\"60\" width=\"120\" height=\"156\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"360\" y=\"50\" font-size=\"15\" font-weight=\"700\" fill=\"var(--chart-text)\">5,2%</text>
</g>
<line x1=\"24\" y1=\"216\" x2=\"456\" y2=\"216\" stroke=\"var(--chart-grid)\"/>
<text x=\"240\" y=\"244\" font-size=\"12\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">Total kredit sama: Rp1.000 M · selisih definisi = 1,8 pp</text>
</svg>`;

export const rr3: V2Lesson = {
  slug: "rr3-metrik",
  track: "Risk Reporting",
  module: "Fondasi Pelaporan",
  title: "RR3 — Metrik Kunci & Definisi Konsisten",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua tim, dua NPL, keduanya benar",
      prose: [
        "Rapat komite risiko memanas. Tim Kredit melaporkan NPL 3,4% — \u201Cmasih dalam batas.\u201D Tim Risiko melaporkan NPL 5,2% — \u201Csudah lampu merah.\u201D Keduanya membawa spreadsheet, keduanya yakin. Direksi menatap bergantian, lalu menunda keputusan limit Rp200 miliar ke minggu depan. Seminggu yang hilang tanpa alasan bisnis — hanya karena dua angka tidak bisa dibandingkan.",
        "Twist-nya: tidak ada yang salah hitung. Tim Kredit memakai definisi kolektibilitas 3–5 (macet menurut status). Tim Risiko memakai DPD > 90 hari (macet menurut keterlambatan bayar). Dua definisi \u201Cdefault\u201D yang berbeda menghasilkan dua NPL yang berbeda 1,8 poin persentase — selisih yang cukup untuk mengubah keputusan. Masalahnya bukan matematika. Masalahnya: tidak ada yang menulis definisinya di laporan.",
        "Setelah lesson ini kamu bisa: (1) menghitung NPL, coverage ratio, dan LCR dari data mentah; (2) menjelaskan mengapa definisi harus dicantumkan; (3) memelihara kamus metrik agar angka bisa dibandingkan antar waktu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Angka tanpa definisi = angka yang bisa berarti apa saja = angka yang tidak bisa dipakai untuk keputusan. Seminggu penundaan keputusan limit Rp200 miliar adalah biaya nyata dari definisi yang tidak ditulis.",
      },
      reference: "Selisih 1,8 pp NPL bisa lahir murni dari definisi. Tulis definisimu.",
    },
    {
      id: "tiga-metrik",
      eyebrow: "Langkah 2 · Tiga metrik kunci",
      title: "NPL, coverage, LCR — dan apa arti tiap simbolnya",
      prose: [
        "NPL (Non-Performing Loan) = porsi kredit yang bermasalah terhadap total kredit. Ia menjawab: seberapa kotor portofolioku? Coverage ratio = CKPN (cadangan kerugian) dibagi kredit bermasalah. Ia menjawab: jika yang bermasalah gagal total, berapa yang sudah dicadangkan? LCR (Liquidity Coverage Ratio) = HQLA (aset likuid berkualitas tinggi) dibagi arus kas keluar bersih 30 hari. Ia menjawab: bisakah kita bertahan 30 hari jika pasar panik?",
        "Ketiganya saling melengkapi: NPL tanpa coverage = tahu sakitnya tapi tidak tahu obatnya cukup; coverage tanpa NPL = tahu obatnya tapi tidak tahu sakitnya seberapa. LCR menjaga sisi lain neraca: bank bisa mati bukan karena kredit macet, melainkan karena kehabisan kas saat semua orang menarik dana.",
      ],
      formula: String.raw`\text{NPL} = \frac{\text{Kredit bermasalah}}{\text{Total kredit}} \times 100\% \qquad \text{Coverage} = \frac{\text{CKPN}}{\text{Kredit bermasalah}} \times 100\% \qquad \text{LCR} = \frac{\text{HQLA}}{\text{Net outflow}_{30h}} \times 100\%`,
      formulaNote: "Kredit bermasalah = sesuai definisi yang dipakai (itulah inti lesson ini). CKPN = Cadangan Kerugian Penurunan Nilai. HQLA = aset likuid berkualitas tinggi. Net outflow 30h = perkiraan arus kas keluar bersih 30 hari ke depan. Contoh: kredit bermasalah Rp34 M dari total Rp1.000 M → NPL = 3,4%.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CNPL, coverage, LCR — definisinya universal, tidak perlu ditulis.\u201D Justru sebaliknya: \u201Ckredit bermasalah\u201D punya banyak definisi (kolektibilitas? DPD? restrukturisasi dihitung?), CKPN mengikuti standar akuntansi yang bisa berubah, dan HQLA punya daftar aset yang diperbarui regulator. Setiap laporan wajib mencantumkan definisi di footnote.",
      },
      hints: [
        "Intuisi: NPL = termometer (seberapa panas), coverage = obat yang tersedia, LCR = oksigen 30 hari. Tiga hal berbeda, ketiganya bisa membunuh.",
        "Cara cepat membaca: NPL naik + coverage turun = bahaya ganda (sakit bertambah, obat berkurang).",
      ],
      reference: "NPL = kotor. Coverage = cadangan. LCR = napas 30 hari. Definisi selalu di footnote.",
    },
    {
      id: "lab-metrik",
      eyebrow: "Langkah 3 · Lab",
      title: "Hitung tiga metrik, dua definisi",
      prose: [
        "Lab ini merekonstruksi drama rapat komite: hitung NPL dengan definisi A (Rp34 M bermasalah) dan definisi B (Rp52 M), lalu lihat bagaimana coverage ikut berubah — CKPN-nya sama (Rp40 M), tetapi penyebutnya berbeda. LCR tidak terpengaruh definisi default, sebagai kontrol.",
        "Perhatikan: coverage definisi A = 117,6% terlihat nyaman (\u201Ccadangan lebih dari cukup\u201D), sedangkan definisi B = 76,9% terlihat tipis. Keputusan yang lahir dari keduanya bisa berlawanan arah — dari angka yang sama-sama \u201Cbenar\u201D.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `npl_a`, `npl_b`, `cov_a`, `cov_b`, `lcr`" },
        { id: "t2", text: "Jalankan dan cocokkan dengan angka rapat komite" },
      ],
      expected: "NPL-A=3.4% NPL-B=5.2% selisih=1.8pp\nCoverage-A=117.6% Coverage-B=76.9% LCR=135%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CCoverage 117% berarti aman.\u201D Aman menurut definisi A. Menurut definisi B, coverage 76,9% — di bawah 100%, artinya cadangan tidak menutup seluruh kredit bermasalah. Jangan menilai coverage tanpa bertanya \u201Cmenurut definisi siapa?\u201D.",
      },
      hints: [
        "npl = bermasalah / total * 100. cov = ckpn / bermasalah * 100.",
        "lcr = hqla / outflow * 100. Bulatkan 1 desimal dengan round(x, 1).",
      ],
      code: {
        starter: `# Data rapat komite (Rp miliar). JANGAN UBAH baris ini.\ntotal, ckpn, hqla, outflow = 1000.0, 40.0, 270.0, 200.0\nbermasalah_a, bermasalah_b = 34.0, 52.0  # definisi A vs B\n\n# TULIS KODEMU\nnpl_a =\nnpl_b =\ncov_a =\ncov_b =\nlcr =\n\nprint(f"NPL-A={npl_a:.1f}% NPL-B={npl_b:.1f}% selisih={npl_b-npl_a:.1f}pp")\nprint(f"Coverage-A={cov_a:.1f}% Coverage-B={cov_b:.1f}% LCR={lcr:.0f}%")`,
        lockLines: 3,
        solution: `# Data rapat komite (Rp miliar). JANGAN UBAH baris ini.\ntotal, ckpn, hqla, outflow = 1000.0, 40.0, 270.0, 200.0\nbermasalah_a, bermasalah_b = 34.0, 52.0  # definisi A vs B\n\n# TULIS KODEMU\nnpl_a = bermasalah_a / total * 100\nnpl_b = bermasalah_b / total * 100\ncov_a = ckpn / bermasalah_a * 100\ncov_b = ckpn / bermasalah_b * 100\nlcr = hqla / outflow * 100\n\nprint(f"NPL-A={npl_a:.1f}% NPL-B={npl_b:.1f}% selisih={npl_b-npl_a:.1f}pp")\nprint(f"Coverage-A={cov_a:.1f}% Coverage-B={cov_b:.1f}% LCR={lcr:.0f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "npl_a", value: 3.4, tol: 1e-9, label: "`npl_a` = 3.4", msg: "34 / 1000 × 100." },
          { kind: "equal", task: "t1", name: "npl_b", value: 5.2, tol: 1e-9, label: "`npl_b` = 5.2", msg: "52 / 1000 × 100." },
          { kind: "equal", task: "t1", name: "cov_a", value: 117.6, tol: 0.1, label: "`cov_a` ≈ 117.6", msg: "40 / 34 × 100." },
          { kind: "equal", task: "t1", name: "cov_b", value: 76.9, tol: 0.1, label: "`cov_b` ≈ 76.9", msg: "40 / 52 × 100." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih=1\\.8pp", label: "Selisih 1.8pp tercetak", msg: "5.2 − 3.4 = 1.8." },
        ],
      },
      reference: "CKPN sama, penyebut beda → coverage beda. Definisi mengubah cerita.",
    },
    {
      id: "kamus",
      eyebrow: "Langkah 4 · Kamus metrik",
      title: "Satu kamus untuk seluruh bank",
      prose: [
        "Solusi permanen drama dua definisi: kamus metrik (metric dictionary). Satu dokumen hidup berisi: nama metrik, definisi persis, rumus, sumber data, pemilik, dan tanggal revisi terakhir. Setiap laporan mencantumkan versi kamus yang dipakai di footnote: \u201CNPL per Kamus Metrik v3.2 (DPD > 90 hari).\u201D",
        "Tiga aturan kamus: (1) satu metrik = satu definisi resmi — definisi lain boleh dipakai untuk analisis, tetapi tidak boleh memakai nama yang sama; (2) setiap perubahan definisi = versi baru + catatan \u201Cangka bulan lalu dihitung ulang dengan definisi baru\u201D; (3) definisi regulator selalu menang untuk laporan regulasi, definisi internal untuk laporan internal — dan keduanya dicatat.",
        "Cara membaca figur: dua batang dari total kredit yang sama menghasilkan dua NPL. Interpretasi: selisih 1,8 pp bukan perbedaan kinerja — murni perbedaan definisi. Tanpa footnote definisi, pembaca akan mengira kinerja berubah.",
      ],
      figure: {
        svg: FIG_DEFINISI,
        alt: "Perbandingan NPL 3,4 persen vs 5,2 persen dari dua definisi default berbeda.",
        caption: "Total kredit sama, definisi beda, NPL beda 1,8 pp. Inilah mengapa footnote definisi wajib.",
      },
      tasks: [],
      hints: [
        "Intuisi: jika dua orang bisa menghitung metrik yang sama dengan hasil berbeda, metrikmu belum terdefinisi — baru bernama.",
        "Setiap kali tren \u201Cmelompat\u201D tanpa alasan bisnis, curigai perubahan definisi dulu sebelum menyimpulkan perubahan risiko.",
      ],
      reference: "Kamus metrik: nama, definisi, rumus, sumber, pemilik, versi. Footnote di tiap laporan.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Proyeksi",
      title: "Roll rate: membaca NPL tiga bulan ke depan",
      prose: [
        "NPL hari ini adalah akibat keputusan 6–12 bulan lalu. Untuk mengintip NPL tiga bulan ke depan, analis memakai roll rate: dari 10.000 rekening Kolektibilitas 1 bulan ini, berapa yang 'menggelinding' ke Kol 2 bulan depan? Di Bank Artha Dana, segmen SME Oktober: 620 rekening menggelinding — roll rate 6,2%. Tiga bulan lalu angkanya 4,1%. Kenaikan 2,1 pp ini berarti NPL Desember sudah 'dipesan' — tinggal menunggu jatuh tempo.",
        "Rumusnya: roll rate Kol1→Kol2 = (rekening pindah / rekening awal Kol1) × 100%. Dengan nominal: Rp508 miliar menggelinding dari Rp8.200 miliar → 6,2%. Proyeksi kasar tambahan kredit bermasalah = jumlah yang menggelinding di tiap tangga: Rp508 M (1→2) + Rp180 M (2→3) = Rp688 M. Ini bukan ramalan presisi — melainkan batas bawah yang jujur untuk bahan diskusi CKPN.",
        "Roll rate bukan konstanta alam: ia naik saat ekonomi memburuk atau penagihan kendor, turun saat koleksi diperketat. Karena itu pakailah rata-rata 3 bulan terakhir, bukan rata-rata 2 tahun yang sudah basi. Dan selalu hitung per segmen — SME dan korporat punya 'gaya menggelinding' yang berbeda; mencampurnya menghasilkan angka yang tidak mewakili siapa pun.",
        "Cara membaca hasil lab: dua roll rate + satu proyeksi. Interpretasi untuk komite: 'Roll 1→2 naik dari 4,1% ke 6,2% dalam tiga bulan — tekanan kualitas kredit meningkat. Proyeksi tambahan Rp688 M bermasalah perlu dicadangkan.' Satu kalimat seperti ini di halaman 1 jauh lebih berharga daripada tabel migrasi 5×5 di lampiran.",
        "NPL gross vs net: bank melaporkan keduanya. NPL gross 3,4% terlihat buruk; NPL net (setelah CKPN) 1,1% terlihat aman. Analis membaca selisihnya: CKPN menutupi 2,3 pp — jika kualitas agunan memburuk, net bisa melonjak tiba-tiba. Jangan pernah membaca satu tanpa yang lain.",
        "Coverage ratio 72% berarti tiap Rp100 kredit macet dijamin Rp72 cadangan. Standar sehat > 80%; di bawah 50% = merah. Tetapi coverage 120% juga patut ditanya — apakah bank terlalu konservatif (menggerus laba) atau menyembunyikan NPL yang lebih besar?",
        "Rasio LCR 135% berarti bank punya 1,35x kebutuhan likuiditas 30 hari. Minimum regulasi 100%. LCR yang turun dari 150% ke 110% dalam 3 bulan = sinyal stres likuiditas, meski masih di atas minimum. Tren > titik — selalu.",
        "Rumus ROE DuPont untuk bank: ROE = (Laba/Aset) × (Aset/Ekuitas). Bank dengan ROE 15% bisa berasal dari ROA 1,5% × leverage 10x (sehat) atau ROA 0,5% × leverage 30x (rapuh). Leverage tinggi = ROE cantik dengan fondasi kaca.",
        "Rasio BOPO 78% berarti tiap Rp100 pendapatan menghabiskan Rp78 biaya. Bank efisien < 75%; > 85% = tidak efisien. BOPO yang naik 5 pp dalam setahun tanpa ekspansi = biaya bocor — temuan klasik untuk laporan efisiensi.",
        "Benchmark antar bank: NPL 3,4% terlihat tinggi sampai kamu tahu rata-rata industri 2,8% dan pesaing terdekat 3,9%. Angka tanpa pembanding = opini. Selalu tempelkan tiga pembanding: historis sendiri (tren), peer (industri), dan regulasi (ambang). Tiga-tiganya ada di laporan yang baik.",
        "Jebakan rata-rata: NPL portofolio 3,4% bisa berarti semua segmen ~3% (merata) atau ritel 1% + korporasi 12% (terkonsentrasi). Rata-rata yang sama, risiko berbeda jauh. Laporan yang hanya menyajikan agregat menyembunyikan konsentrasi — selalu pecah per segmen untuk metrik risiko utama.",
      ],
      formula: String.raw`\text{Roll}_{1\to 2} = \frac{\text{Pindah}_{1\to 2}}{\text{Kol}_{1,\ t}} \times 100\%`,
      formulaNote: "Pindah = rekening/nominal yang berpindah kolektibilitas dalam sebulan, Kol1_t = populasi awal. Contoh: 508 / 8.200 × 100% = 6,2%. Interpretasi: 6,2% kredit lancar bulan ini berpotensi menjadi perhatian khusus bulan depan.",
      tasks: [
        { id: "t1", text: "Hitung `roll12`, `roll23`, dan `proyeksi`" },
        { id: "t2", text: "Jalankan dan pastikan angkanya tercetak" },
      ],
      expected: "Roll 1->2: 6.2%, Roll 2->3: 20.0%, proyeksi +Rp688 M",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Roll rate kan stabil, pakai rata-rata 2 tahun saja.” Justru saat krisis, roll rate bergerak paling liar — rata-rata panjang menyembunyikan percepatan 3 bulan terakhir. Roll rate basi = proyeksi yang menenangkan padahal badai datang.",
      },
      hints: [
        "roll12 = pindah12 / kol1 * 100.",
        "proyeksi = jumlah yang menggelinding di tiap tangga.",
      ],
      code: {
        starter: "# Migrasi SME Oktober (Rp miliar). JANGAN UBAH.\nkol1, pindah12 = 8200, 508\nkol2, pindah23 = 900, 180\n\n# TULIS KODEMU: roll rate + proyeksi\nroll12 =\nroll23 =\nproyeksi =\n\nprint(f\"Roll 1->2: {roll12:.1f}%, Roll 2->3: {roll23:.1f}%, proyeksi +Rp{proyeksi:.0f} M\")",
        lockLines: 3,
        solution: "# Migrasi SME Oktober (Rp miliar). JANGAN UBAH.\nkol1, pindah12 = 8200, 508\nkol2, pindah23 = 900, 180\n\n# TULIS KODEMU: roll rate + proyeksi\nroll12 = pindah12 / kol1 * 100\nroll23 = pindah23 / kol2 * 100\nproyeksi = pindah12 + pindah23\n\nprint(f\"Roll 1->2: {roll12:.1f}%, Roll 2->3: {roll23:.1f}%, proyeksi +Rp{proyeksi:.0f} M\")",
        checks: [
          { kind: "equal", task: "t1", label: "`roll12` = 6.2", msg: "508 / 8.200 × 100% = 6,2%.", name: "roll12", value: 6.195121951219512, tol: 0.01 },
          { kind: "equal", task: "t1", label: "`roll23` = 20.0", msg: "180 / 900 × 100% = 20%.", name: "roll23", value: 20.0, tol: 0.01 },
          { kind: "equal", task: "t1", label: "`proyeksi` = 688", msg: "508 + 180 = Rp688 miliar.", name: "proyeksi", value: 688, tol: 1e-09 },
          { kind: "stdout_matches", task: "t2", label: "Proyeksi tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Roll 1->2: 6\\.2%, Roll 2->3: 20\\.0%, proyeksi \\+Rp688 M" }
        ],
      },
      reference: "Roll rate 3 bulan terakhir, per segmen. NPL depan = NPL kini + yang menggelinding.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Metrik apa untuk siapa",
      prose: [
        "Satu: direksi → NPL + coverage + satu kalimat arah; mereka butuh kesehatan, bukan detail. Dua: komite risiko → NPL per segmen + migrasi kolektibilitas + top-20 konsentrasi; mereka butuh lokasi masalahnya. Tiga: ALCO (komite aset-liabilitas) → LCR, NSFR, gap likuiditas; mereka butuh napas kas. Empat: regulator → format baku mereka dengan definisi mereka; kreativitas = temuan audit.",
        "Aturan praktis 10 detik: tanyakan \u201Ckeputusan apa?\u201D — limit kredit → NPL segmen; dividen → coverage + laba; pendanaan → LCR. Metrik mengikuti keputusan, bukan sebaliknya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Direksi tidak butuh matriks migrasi 5×5 — mereka butuh satu kalimat: 'Roll 1→2 naik ke 6,2%, proyeksi tambahan Rp688 M bermasalah.' Tabel penuh tetap dibuat, tetapi ia tinggal di lampiran untuk CRO.",
      },
      reference: "Direksi: NPL+coverage. Komite: per segmen. ALCO: likuiditas. Regulator: format baku.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Rekonsiliasi dua tim",
      prose: [
        "Kamu diminta mendamaikan Tim Kredit (NPL 3,4%) dan Tim Risiko (NPL 5,2%). Data: total kredit Rp1.000 M. Kolektibilitas 3–5 = Rp34 M. DPD > 90 hari = Rp52 M (termasuk Rp18 M kolektibilitas 2 yang menunggak 95 hari karena restrukturisasi banjir). CKPN Rp40 M. LCR 135%.",
        "Pertanyaan: (1) angka mana yang dilaporkan ke regulator? (2) bagaimana menyajikan keduanya ke komite tanpa membingungkan? Pembahasan: (1) Ikuti definisi regulator — di Indonesia umumnya mengacu pada ketentuan kolektibilitas OJK; cantumkan rujukannya. (2) Sajikan angka resmi sebagai headline, lalu satu baris jujur: \u201CDengan definisi DPD > 90 hari, NPL 5,2%; selisih Rp18 M adalah debitur restrukturisasi banjir yang masih membayar sebagian.\u201D Komite mendapat gambaran utuh; tidak ada yang disembunyikan; tidak ada yang membingungkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rp18 M selisih definisi = Rp18 M risiko yang \u201Chilang\u201D dari headline jika hanya satu definisi dipakai. Restrukturisasi bukan berarti risiko hilang — ia berarti risiko ditunda. Komite wajib melihat keduanya.",
      },
      reference: "Lapor definisi resmi; tampilkan definisi alternatif sebagai baris kedua yang jujur.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — definisi adalah soal kebiasaan, bukan hafalan.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "NPL adalah spion (melihat ke belakang); roll rate adalah lampu depan. Laporan yang hanya memuat NPL tanpa roll rate = mengemudi sambil menatap spion.",
      },

      summary: [
        "NPL = kredit bermasalah/total; coverage = CKPN/bermasalah; LCR = HQLA/outflow 30 hari.",
        "Definisi \u201Cdefault\u201D yang berbeda → angka berbeda; selalu cantumkan definisi di footnote.",
        "Kamus metrik: satu definisi resmi per nama, berversi, tercatat.",
        "Metrik mengikuti keputusan: direksi, komite, ALCO, regulator butuh set berbeda.",
        "Sajikan definisi resmi sebagai headline, definisi alternatif sebagai baris kedua.",
      ],
      next: { label: "RR4 — QA Data Laporan", href: "/v2/learn/rr4-data-quality" },
      quiz: [
        {
          q: "Mengapa dua tim mendapat NPL berbeda (3,4% vs 5,2%)?",
          options: [
            { text: "Salah satu tim salah hitung", why: "Tidak — keduanya menghitung dengan benar menurut definisinya." },
            { text: "Definisi \u201Ckredit bermasalah\u201D berbeda", why: "Tepat. Kolektibilitas 3–5 vs DPD > 90 hari = penyebut berbeda.", correct: true },
            { text: "Data sumbernya berbeda", why: "Sumbernya sama (total kredit Rp1.000 M); definisinya yang beda." },
          ],
        },
        {
          q: "Coverage 117,6% (definisi A) vs 76,9% (definisi B). Kesimpulan yang jujur?",
          options: [
            { text: "Bank aman karena coverage >100%", why: "Hanya menurut definisi A. Menurut definisi B cadangan tidak menutup semua yang bermasalah." },
            { text: "Penilaian tergantung definisi; laporkan keduanya dengan footnote", why: "Benar. Angka tanpa definisi = tidak bisa dinilai.", correct: true },
            { text: "Pakai yang lebih besar agar menenangkan", why: "Itu cherry-picking — menyesatkan komite." },
          ],
        },
        {
          q: "Apa isi wajib kamus metrik?",
          options: [
            { text: "Nama, definisi, rumus, sumber, pemilik, versi", why: "Lengkap dan benar — inilah yang membuat angka bisa dibandingkan.", correct: true },
            { text: "Nama dan rumus saja", why: "Tanpa sumber dan versi, perubahan definisi tidak terlacak." },
            { text: "Nama dan pemilik saja", why: "Tanpa definisi dan rumus, dua orang tetap bisa menghitung berbeda." },
          ],
        },
        {
          q: "Tren NPL melonjak bulan ini tanpa alasan bisnis yang jelas. Curiga pertama?",
          options: [
            { text: "Perubahan definisi atau metodologi", why: "Benar. Cek kamus versi dan footnote sebelum menyimpulkan risiko berubah.", correct: true },
            { text: "Segera laporkan sebagai krisis", why: "Terburu-buru — bisa jadi hanya artefak definisi." },
            { text: "Rata-ratakan dengan bulan lalu", why: "Menghaluskan data = menyembunyikan informasi, apapun penyebabnya." },
          ],
        },
        {
          q: "LCR 135% artinya?",
          options: [
            { text: "Bank bisa bertahan 30 hari jika pasar panik", why: "Benar. HQLA 135% dari kebutuhan 30 hari = buffer 35%.", correct: true },
            { text: "135% kredit akan kembali", why: "LCR soal likuiditas, bukan pengembalian kredit." },
            { text: "Bank untung 135%", why: "LCR bukan ukuran profitabilitas." },
          ],
        },
      ],
    },
  ],
};
