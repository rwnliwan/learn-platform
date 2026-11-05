import type { V2Lesson } from "../lib/types";

// Tiga metode akuntansi investasi antar-perusahaan berdasarkan kepemilikan.
const METHOD_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Tiga metode akuntansi investasi antar-perusahaan: di bawah 20 persen, 20 sampai 50 persen, di atas 50 persen.">
<text x="260" y="25" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Metode mengikuti kepemilikan</text>
<g font-size="12" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="93" y="58">&lt; 20%</text><text x="260" y="58">20–50%</text><text x="427" y="58">&gt; 50%</text></g>
<rect x="10" y="70" width="166" height="140" rx="6" fill="var(--c1)" opacity="0.12" stroke="var(--c1)" stroke-width="1.5"/>
<rect x="177" y="70" width="166" height="140" rx="6" fill="var(--c2)" opacity="0.12" stroke="var(--c2)" stroke-width="1.5"/>
<rect x="344" y="70" width="166" height="140" rx="6" fill="var(--c3)" opacity="0.12" stroke="var(--c3)" stroke-width="1.5"/>
<g font-size="11.5" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="93" y="100">Tanpa pengaruh signifikan</text><text x="260" y="100">Pengaruh signifikan</text><text x="427" y="100">Kendali</text></g>
<g font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="93" y="126">dicatat fair value / biaya</text><text x="93" y="142">dividen = pendapatan</text><text x="260" y="126">equity method</text><text x="260" y="142">bagian laba diakui</text><text x="260" y="158">dividen kurangi investasi</text><text x="427" y="126">konsolidasi penuh 100%</text><text x="427" y="142">NCI dipisahkan</text><text x="427" y="158">goodwill atas premi</text></g>
</svg>`;

export const pmb9: V2Lesson = {
  slug: "pm-b9-intercorporate",
  track: "Portfolio Management",
  module: "Analisis & Valuasi",
  title: "B9 — Intercorporate: Investasi Antar-Perusahaan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-laba-kertas",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laba yang bukan laba",
      prose: [
        "PT Induk memiliki 40% PT Anak. Tahun ini PT Anak untung Rp100 miliar, tetapi tidak membagi dividen sama sekali. Di laporan laba rugi, PT Induk mencatat +Rp40 miliar dari pos \u201Cbagian laba asosiasi\u201D. Investor bersorak: laba naik.",
        "Twist-nya: Rp40 miliar itu bukan kas. Tidak ada dividen yang diterima. Inilah equity method: mengakui bagian laba tanpa menerima sepeser pun tunai. Saat PT Anak butuh kas dan tidak bisa bagi dividen, \u201Claba\u201D PT Induk hanyalah angka di kertas.",
        "Metode akuntansi mengubah cerita tanpa mengubah kas. Ada tiga metode, tergantung seberapa besar pengaruhmu: di bawah 20% (tanpa pengaruh signifikan) pakai fair value \u2014 pendapatan = dividen yang diterima; 20\u201350% (pengaruh signifikan) pakai equity method; di atas 50% (kendali) pakai konsolidasi penuh, menggabungkan 100% laporan anak lalu mengeluarkan bagian non-pengendali (minority interest / NCI). Ingat: ambang batasnya adalah pengaruh, bukan sekadar persen \u2014 kursi dewan atau teknologi kunci bisa berarti pengaruh signifikan di bawah 20%.",
      ],
      tasks: [],
      reference: "Ambang metode: <20% fair value · 20\u201350% equity method · >50% konsolidasi.",
    },
    {
      id: "equity-method",
      eyebrow: "Langkah 2 · Equity method",
      title: "Equity method: laba diakui tanpa kas",
      prose: [
        "Mekaniknya sederhana. Investasi dicatat awal sebesar biaya perolehan, lalu setiap periode: tambah bagian laba anak, kurangi dividen yang diterima. Dividen bukan pendapatan \u2014 ia adalah pengembalian modal, konversi klaim menjadi kas.",
        "Contoh konkret: Induk membeli 30% PT Anak seharga Rp300 miliar (nilai wajar aset bersih Rp1 triliun, jadi tidak ada goodwill). Tahun berjalan, Anak laba Rp200 miliar dan membagi dividen Rp60 miliar. Jurnal induk: bagian laba = 30% \u00D7 200 = +Rp60 miliar menambah investasi; dividen = 30% \u00D7 60 = Rp18 miliar mengurangi investasi dan menambah kas. Saldo investasi akhir = 300 + 60 \u2212 18 = Rp342 miliar.",
        "Perhatikan: laba yang diakui Rp60 miliar, kas yang diterima hanya Rp18 miliar. Selisih Rp42 miliar adalah \u201Claba kertas\u201D. Analis yang menghitung kualitas laba wajib mengeluarkan selisih semacam ini dari proksi arus kas.",
      ],
      formula: String.raw`\text{Investasi}_{t} = \text{Investasi}_{t-1} + \% \times NI - \text{Dividen}`,
      formulaNote: "Investasi_t = nilai tercatat investasi kini; tambah %×NI (bagian laba anak — diakui di laba rugi); kurangi Dividen (pengembalian modal, BUKAN pendapatan). Contoh: 300 + 0,40×100 − 0,40×20 = Rp342M. Gap laba-kas = 40 − 8 = 32 — 'laba kertas' yang wajib dikeluarkan dari proksi arus kas.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menganggap \u201Cbagian laba asosiasi\u201D = kas masuk. Bukan. Kas = dividen, yang sering jauh lebih kecil. PT Induk di cerita tadi: laba +Rp40 miliar, kas +Rp8 miliar.",
      },
      reference: "Dividen mengurangi investasi (equity method), bukan menambah pendapatan.",
    },
    {
      id: "lab-equity",
      eyebrow: "Langkah 3 · Lab equity method",
      title: "Hitung selisih laba vs kas",
      prose: [
        "Sekarang kamu yang menghitung. Skenario cerita: Induk membeli 40% PT Anak seharga Rp300 miliar. Tahun 1: Anak laba Rp100 miliar, dividen Rp20 miliar. Hitung bagian laba yang diakui, dividen kas yang diterima, investasi akhir, dan gap \u201Claba kertas\u201D-nya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bagian_laba` dan `div_diterima`" },
        { id: "t2", text: "Hitung `investasi_akhir`" },
        { id: "t3", text: "Hitung `gap` (laba kertas) dan cetak semuanya" },
      ],
      expected: "bagian_laba=40  div_diterima=8  investasi_akhir=332  gap=32  (Rp miliar)",
      hints: [
        "Bagian laba = kepemilikan \u00D7 laba anak; dividen kas = kepemilikan \u00D7 dividen anak.",
        "Investasi akhir = awal + bagian laba \u2212 dividen yang diterima.",
        "gap = bagian_laba - div_diterima",
      ],
      code: {
        starter: `# Equity method: laba vs kas (Rp miliar)\nINVESTASI_AWAL, KEPEMILIKAN = 300, 0.40\nLABA_ANAK, DIVIDEN = 100, 20\n\n# TULIS KODEMU\nbagian_laba = \ndiv_diterima = \ninvestasi_akhir = \ngap = \n\nprint(f"bagian_laba={bagian_laba:.0f}  div_diterima={div_diterima:.0f}  investasi_akhir={investasi_akhir:.0f}  gap={gap:.0f}")`,
        lockLines: 2,
        solution: `# Equity method: laba vs kas (Rp miliar)\nINVESTASI_AWAL, KEPEMILIKAN = 300, 0.40\nLABA_ANAK, DIVIDEN = 100, 20\n\n# TULIS KODEMU\nbagian_laba = KEPEMILIKAN * LABA_ANAK\ndiv_diterima = KEPEMILIKAN * DIVIDEN\ninvestasi_akhir = INVESTASI_AWAL + bagian_laba - div_diterima\ngap = bagian_laba - div_diterima\n\nprint(f"bagian_laba={bagian_laba:.0f}  div_diterima={div_diterima:.0f}  investasi_akhir={investasi_akhir:.0f}  gap={gap:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bagian_laba", value: 40, tol: 1e-9, label: "`bagian_laba` = 40", msg: "0,40 \u00D7 100 = 40. Itu laba yang diakui di laporan, bukan kas." },
          { kind: "equal", task: "t1", name: "div_diterima", value: 8, tol: 1e-9, label: "`div_diterima` = 8", msg: "0,40 \u00D7 20 = 8. Ini kas yang benar-benar masuk." },
          { kind: "equal", task: "t2", name: "investasi_akhir", value: 332, tol: 1e-9, label: "`investasi_akhir` = 332", msg: "300 + 40 \u2212 8 = 332. Dividen mengurangi investasi." },
          { kind: "equal", task: "t3", name: "gap", value: 32, tol: 1e-9, label: "`gap` = 32", msg: "40 \u2212 8 = 32. Inilah \u201Claba kertas\u201D-nya." },
          { kind: "stdout_matches", task: "t3", pattern: "bagian_laba=40\\s+div_diterima=8\\s+investasi_akhir=332\\s+gap=32", label: "`print` menampilkan empat angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "40% \u00D7 100 = 40 laba; 40% \u00D7 20 = 8 kas; 300+40\u22128 = 332.",
    },
    {
      id: "konsolidasi-nci",
      eyebrow: "Langkah 4 · Konsolidasi & goodwill",
      title: "Konsolidasi penuh, NCI, dan premi akuisisi",
      prose: [
        "Di atas 50% kepemilikan, induk mengendalikan anak, sehingga laporannya digabung 100%: seluruh aset, utang, pendapatan, dan beban anak masuk. Lalu bagian milik pihak lain dipisahkan sebagai non-controlling interest (NCI). Contoh: induk punya 80% anak; anak punya aset Rp1 triliun, utang Rp400 miliar, laba Rp100 miliar. NCI di ekuitas = 20% \u00D7 (1.000 \u2212 400) = Rp120 miliar; NCI di laba = 20% \u00D7 100 = Rp20 miliar, dikurangkan dari laba konsolidasian. Laba yang benar-benar milik induk dari anak = Rp80 miliar.",
        "Saat mengakuisisi, jika harga bayar melebihi nilai wajar aset neto teridentifikasi, selisihnya adalah goodwill \u2014 premi atas harapan sinergi. Contoh: bayar Rp500 miliar untuk 80%, nilai wajar aset neto Rp400 miliar \u2192 goodwill = 500 \u2212 80% \u00D7 400 = Rp180 miliar. Goodwill tidak diamortisasi, tetapi wajib diuji impairment tiap tahun. Jika sinergi gagal, write-down bisa miliaran sekaligus.",
        "Dua jebakan analis: (1) utang anak ikut tergabung padahal kreditur anak tidak bisa menagih induk (kecuali ada garansi) \u2014 dan kas anak bisa terjebak di yurisdiksi lain; (2) rasio seperti ROE yang memakai laba konsolidasian penuh tanpa mengurangkan NCI adalah salah \u2014 pakai laba untuk pemegang saham induk.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Joint venture 50:50 dengan utang Rp200 miliar: di bawah IFRS (equity method) utang itu tidak muncul di neraca induk \u2014 leverage terlihat rendah. Analis menambahkan kembali porsi proporsionalnya (Rp100 miliar). Perusahaan dengan banyak JV menyimpan leverage tersembunyi.",
      },
      reference: "Goodwill = harga bayar \u2212 % \u00D7 FV aset neto. Uji impairment tiap tahun.",
    },
    {
      id: "translasi",
      eyebrow: "Langkah 5 · Translasi",
      title: "Dua mata uang, satu laporan",
      prose: [
        "Anak usaha di Malaysia: aset MYR 100 juta. Kurs awal Rp3.500, kini Rp3.200 (ringgit melemah). Dengan current rate method, seluruh aset/liabilitas ditranslasikan pada kurs kini: aset tercatat Rp320 miliar versus Rp350 miliar sebelumnya. Selisih Rp\u221230 miliar masuk CTA (cumulative translation adjustment) di OCI \u2014 ekuitas, bukan laba. Laba bersih tidak terganggu.",
        "Dengan temporal method, aset non-moneter memakai kurs historis dan selisih kurs masuk laba rugi \u2014 laba menjadi volatil setiap kuartal. Pilihan metode bukan bebas: ditentukan oleh mata uang fungsional, yaitu mata uang lingkungan ekonomi utama tempat anak beroperasi.",
        "Pelajaran untuk analis: metode translasi mengubah profil volatilitas laba. Saat laba emiten multinasional bergejolak, cek dulu apakah sumbernya operasional atau sekadar selisih kurs dari metode temporal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `aset_awal` dan `aset_kini` (dalam Rp miliar)" },
        { id: "t2", text: "Hitung `cta` lalu cetak ketiganya" },
      ],
      expected: "aset_awal=350  aset_kini=320  cta=-30  (Rp miliar)",
      hints: [
        "Nilai Rp = aset MYR \u00D7 kurs, lalu bagi 1.000 agar menjadi Rp miliar.",
        "CTA = nilai kini \u2212 nilai awal (negatif bila mata uang asing melemah).",
        "aset_awal = 100 * 3500 / 1000",
      ],
      code: {
        starter: `# Translasi current rate (Rp miliar)\nASET_MYR, KURS_AWAL, KURS_KINI = 100, 3500, 3200\n\n# TULIS KODEMU\naset_awal = \naset_kini = \ncta = \n\nprint(f"aset_awal={aset_awal:.0f}  aset_kini={aset_kini:.0f}  cta={cta:.0f}")`,
        lockLines: 1,
        solution: `# Translasi current rate (Rp miliar)\nASET_MYR, KURS_AWAL, KURS_KINI = 100, 3500, 3200\n\n# TULIS KODEMU\naset_awal = ASET_MYR * KURS_AWAL / 1000\naset_kini = ASET_MYR * KURS_KINI / 1000\ncta = aset_kini - aset_awal\n\nprint(f"aset_awal={aset_awal:.0f}  aset_kini={aset_kini:.0f}  cta={cta:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "aset_awal", value: 350, tol: 1e-9, label: "`aset_awal` = 350", msg: "100 \u00D7 3.500 / 1.000 = 350 (Rp miliar)." },
          { kind: "equal", task: "t1", name: "aset_kini", value: 320, tol: 1e-9, label: "`aset_kini` = 320", msg: "100 \u00D7 3.200 / 1.000 = 320." },
          { kind: "equal", task: "t2", name: "cta", value: -30, tol: 1e-9, label: "`cta` = -30", msg: "320 \u2212 350 = \u221230. Negatif karena ringgit melemah; ia masuk OCI." },
          { kind: "stdout_matches", task: "t2", pattern: "aset_awal=350\\s+aset_kini=320\\s+cta=-30", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Current rate \u2192 CTA ke OCI. Temporal \u2192 selisih ke laba rugi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan + chart",
      title: "Lima keputusan, satu checklist",
      prose: [
        "Ringkas seluruh lesson menjadi peta keputusan. (1) Kepemilikan 20\u201350% \u2192 equity method, karena ada pengaruh signifikan. (2) Akuisisi di atas 50% \u2192 konsolidasi penuh + goodwill atas premi bayar. (3) Goodwill di atas 30% ekuitas \u2192 waspada impairment; serial acquirer adalah red flag. (4) Analisis kas konglomerat \u2192 keluarkan equity income non-kas dari proksi arus kas. (5) Laba dari investasi antar-perusahaan \u2192 selalu pisahkan kas vs kertas, dan kurangkan NCI sebelum menghitung rasio untuk induk.",
        "Checklist 5 menit sebelum kamu percaya \u201Claba\u201D grup: metode apa (<20 / 20\u201350 / >50)? Berapa kasnya (dividen vs equity income)? Apakah NCI sudah dikurangkan? Goodwill berapa persen dari ekuitas? Apakah transaksi intra-grup sudah dieliminasi?",
        "Cara membaca: tiga kotak dibaca kiri ke kanan mengikuti besarnya kepemilikan — di bawah 20%, 20–50%, di atas 50%.",
        "Interpretasi: metode mengikuti pengaruh — makin besar kepemilikan, makin dalam laporan anak masuk ke laporan induk (dari sekadar dicatat, ke bagian laba diakui, ke gabung 100% dengan NCI dipisahkan); salah memilih metode berarti salah membaca laba.",
      ],
      figure: {
        svg: METHOD_SVG,
        alt: "Tiga kotak metode akuntansi investasi antar-perusahaan berdasarkan kepemilikan.",
        caption: "Tiga metode akuntansi investasi antar-perusahaan mengikuti besarnya kepemilikan dan pengaruh.",
      },
      tasks: [],
      reference: "Aturan 10 detik: metode by pengaruh \u00B7 equity income \u2260 kas \u00B7 goodwill = risiko impairment \u00B7 pahami ke mana selisih translasi pergi.",
    },
    {
      id: "minicase-pe",
      eyebrow: "Langkah 7 · Mini-case",
      title: "P/E 25\u00D7 yang sebenarnya 125\u00D7",
      prose: [
        "Kembali ke PT Induk: 40% PT Anak, Anak laba Rp100 miliar, dividen Rp20 miliar. Induk mengakui +Rp40 miliar \u201Claba\u201D. Analis junior menghitung P/E: harga saham (kapitalisasi yang dipakai) Rp1 triliun dibagi laba Rp40 miliar = 25\u00D7. Terlihat murah.",
        "Kas yang benar-benar diterima induk hanya 40% \u00D7 20 = Rp8 miliar. P/E berbasis kas = 1.000 / 8 = 125\u00D7 \u2014 lima kali lebih mahal dari yang terlihat. P/E 25\u00D7 adalah ilusi dari laba kertas. Pelajaran: selalu hitung versi cash-adjusted sebelum menyebut saham \u201Cmurah\u201D.",
        "Uji yang lebih panjang: lima tahun equity income kumulatif Rp500 miliar versus dividen kumulatif Rp50 miliar. Rasio 50/500 = 10% \u2014 90% \u201Claba\u201D tidak pernah menjadi kas. Kemungkinannya: anak benar-benar reinvestasi (bisa OK jika ROE-nya tinggi), anak diatur agar tidak bagi dividen, atau laba anak tidak berkualitas. Equity income tanpa dividen bertahun-tahun wajib diinvestigasi: bandingkan ROE anak vs induk, cek related-party transaction, dan lihat arus kas operasi anak.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghitung valuasi dari laba konsolidasian penuh. Untuk valuasi induk, gunakan laba untuk pemegang saham induk (setelah NCI) \u2014 dan untuk kualitas, gunakan basis kas.",
      },
      reference: "P/E laporan 1.000/40 = 25\u00D7; P/E kas 1.000/8 = 125\u00D7.",
    },
    {
      id: "proforma-jebakan-goodwill",
      eyebrow: "Langkah 8 · Pro-forma & jebakan goodwill",
      title: "Laba gabungan vs kas gabungan",
      prose: [
        "Pro-forma: laporan gabungan seolah merger sudah terjadi — analis membandingkan pro-forma vs standalone, bukan harga vs harga. Contoh: akuisitor EPS Rp100 (10jt saham, harga Rp2.000); target EPS Rp50 (4jt saham); deal Rp4M all-share, exchange ratio 0,5 → saham baru 2jt. NI gabungan = 1.000jt + 200jt + sinergi 100jt = Rp1.300jt; saham 12jt → EPS pro-forma Rp108,3 → akretif +8,3%. Tetapi: akresi bergantung sinergi yang belum terbukti, dan kepemilikan lama terdilusi 16,7%. Keputusan: akretif < 5% tanpa sinergi tunai = jangan tepuk tangan dulu.",
        "Efek konsolidasi pada analisis: revenue gabungan naik, tetapi margin bisa turun (margin target rendah); leverage naik (utang target ikut tergabung); ROE terkontaminasi NCI bila kepemilikan < 100%. Analis membandingkan tiga hal: margin pro-forma vs historis akuisitor; leverage pro-forma vs covenant; EPS pro-forma vs standalone. Akuisisi yang “tumbuh” tetapi menggerus ketiganya = membeli ukuran dengan kualitas.",
        "Jebakan goodwill: bayar Rp500M untuk 80%, FV aset neto Rp400M → goodwill Rp180M (premi harapan). Dua tahun kemudian sinergi gagal → impairment Rp100M sekaligus → laba anjlok, ekuitas terkikis, covenant berpotensi jebol. Red flag: serial acquirer (goodwill tumbuh tiap tahun), goodwill > 50% ekuitas, impairment “sekali-sekali” yang berulang tiap 2–3 tahun. Aturan konservatif: uji valuasi dengan tangible book (ekuitas − goodwill) — bila investment case runtuh tanpa goodwill, ia memang bertumpu pada harapan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ni_proforma`, `sh_proforma`, `eps_proforma` (Rp)" },
        { id: "t2", text: "Hitung `akresi` % vs EPS akuisitor, cetak eps & akresi" },
      ],
      expected: "eps_proforma=108.3  akresi=8.3%",
      note: {
        title: "Intuisi: akuisisi tempat uang baik pergi mati",
        body: "Empat kewaspadaan analis M&A. Pertama: pasar membenci akuisitor — harga saham pembeli turun saat pengumuman adalah suara pasar yang tidak percaya sinergi; dengarkan sebelum membaca press release. Kedua: sinergi di spreadsheet selalu tercapai 100%, di dunia nyata jarang — haircut 50% untuk setiap proyeksi sinergi manajemen, dan bila deal tetap akretif barulah menarik. Ketiga: goodwill = premi harapan yang dicatat sebagai aset — makin besar goodwill relatif ke ekuitas, makin tinggi standar pembuktian; goodwill > 50% ekuitas = perusahaan bertaruh masa depannya pada harapan. Keempat: baca arus kas, bukan laba pro-forma — laba bisa direkayasa purchase accounting (alokasi harga, amortisasi), kas tidak bisa. Akuisisi yang bagus menaikkan kas per saham; sisanya adalah cerita. Kelima: curigai related-party acquisition — membeli perusahaan milik grup sendiri = transfer pricing berbaju M&A; bandingkan harga dengan valuasi independen, bukan dengan “kesepakatan direksi”. Keenam: cek arus kas operasi anak 8 kuartal pasca-akuisisi — sinergi yang tidak muncul di kas operasi dalam 2 tahun biasanya tidak akan pernah muncul.",
      },
      hints: [
        "NI pro-forma = NI akuisitor + NI target + sinergi.",
        "Saham baru = saham target × exchange ratio.",
        "akresi = (eps_proforma/eps_a − 1) × 100.",
      ],
      code: {
        starter: `# Pro-forma merger all-share (Rp)
EPS_A, SH_A = 100, 10_000_000      # akuisitor
EPS_T, SH_T = 50, 4_000_000        # target
EX_RATIO = 0.5                     # 0,5 saham A per 1 saham T
SINERGI = 100_000_000

# TULIS KODEMU
ni_proforma = 
sh_proforma = 
eps_proforma = 
akresi = 

print(f"eps_proforma={eps_proforma:.1f}  akresi={akresi:.1f}%")`,
        lockLines: 7,
        solution: `# Pro-forma merger all-share (Rp)
EPS_A, SH_A = 100, 10_000_000      # akuisitor
EPS_T, SH_T = 50, 4_000_000        # target
EX_RATIO = 0.5                     # 0,5 saham A per 1 saham T
SINERGI = 100_000_000

# TULIS KODEMU
ni_proforma = EPS_A*SH_A + EPS_T*SH_T + SINERGI
sh_proforma = SH_A + SH_T*EX_RATIO
eps_proforma = ni_proforma / sh_proforma
akresi = (eps_proforma/EPS_A - 1)*100

print(f"eps_proforma={eps_proforma:.1f}  akresi={akresi:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "eps_proforma", value: 108.3, tol: 0.1, label: "`eps_proforma` sekitar 108.3", msg: "1.300jt/12jt = 108,3. Akretif — tetapi bergantung sinergi 100jt yang belum terbukti." },
          { kind: "equal", task: "t2", name: "akresi", value: 8.3, tol: 0.1, label: "`akresi` sekitar 8.3", msg: "(108,3/100−1)×100 = 8,3%. Di bawah 5% tanpa sinergi tunai = jangan tepuk tangan." },
          { kind: "stdout_matches", task: "t2", pattern: "eps_proforma=108\\.3\\s+akresi=8\\.3%", label: "`print` menampilkan keduanya", msg: "Format: eps_proforma=...  akresi=...% ." },
        ],
      },
      reference: "Pro-forma vs standalone. Goodwill = premi harapan — uji dengan tangible book.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan \u2014 baca alasannya bahkan untuk jawaban yang kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Spektrum metode: <20% fair value, 20\u201350% equity method, >50% konsolidasi; ambangnya adalah pengaruh.",
        "Equity method: investasi +bagian laba \u2212dividen; laba yang diakui \u2260 kas yang diterima.",
        "Konsolidasi: gabung 100%, kurangkan NCI; goodwill = premi akuisisi, uji impairment tiap tahun.",
        "Translasi: current rate \u2192 CTA di OCI; temporal \u2192 selisih ke laba (volatil).",
        "Analis menerjemahkan akuntansi menjadi ekonomi: keluarkan non-kas, kurangkan NCI, waspadai utang tersembunyi JV dan goodwill jumbo.",
      ],
      next: { label: "C1 \u2014 Investment Policy Statement", href: "/learn/pm-c1-ips" },
      quiz: [
        {
          q: "Induk memiliki 40% anak. Anak laba Rp100 miliar, dividen Rp20 miliar. Berapa yang diakui Induk?",
          options: [
            { text: "Rp8 miliar (dividen)", why: "Itu kas yang diterima, bukan laba yang diakui. Equity method mengakui 40% \u00D7 100 = Rp40 miliar di laporan laba rugi." },
            { text: "Rp40 miliar laba (equity method); kas Rp8 miliar", why: "Tepat: 40% \u00D7 100 diakui sebagai laba, 40% \u00D7 20 diterima sebagai kas. Selisih Rp32 miliar = laba kertas.", correct: true },
            { text: "Rp100 miliar", why: "Itu laba anak penuh. Induk hanya mengakui porsinya, 40%." },
            { text: "Rp0", why: "Salah: 40% berarti pengaruh signifikan, jadi equity method tetap mengakui bagian laba." },
          ],
        },
        {
          q: "Induk membayar Rp500 miliar untuk 80% anak; nilai wajar aset neto Rp400 miliar. Goodwill?",
          options: [
            { text: "Rp100 miliar", why: "Itu 500 \u2212 400: lupa mengalikan persentase kepemilikan ke nilai wajar. Yang benar 500 \u2212 80% \u00D7 400." },
            { text: "Rp180 miliar", why: "Tepat: 500 \u2212 (0,80 \u00D7 400) = 180. Goodwill = premi di atas nilai wajar, diuji impairment tiap tahun.", correct: true },
            { text: "Rp500 miliar", why: "Itu harga bayar penuh, bukan premi. Goodwill hanya selisih di atas nilai wajar." },
            { text: "Rp0", why: "Salah: bayar di atas nilai wajar berarti ada premi \u2014 itulah goodwill." },
          ],
        },
        {
          q: "Selisih kurs translasi: ke mana perginya di tiap metode?",
          options: [
            { text: "Keduanya ke laba rugi", why: "Salah: hanya temporal yang menghantam laba." },
            { text: "Current rate \u2192 CTA (OCI); temporal \u2192 laba rugi", why: "Tepat. Current rate menampung selisih di ekuitas (laba stabil); temporal membuatnya volatil.", correct: true },
            { text: "Keduanya ke OCI", why: "Salah: temporal justru memasukkan selisih ke laba rugi." },
            { text: "Tidak ada selisih yang dicatat", why: "Salah: selisih selalu ada begitu kurs bergerak; pertanyaannya ke mana ia dicatat." },
          ],
        },
        {
          q: "Goodwill tercatat 50% dari ekuitas. Sikap analis yang tepat?",
          options: [
            { text: "Abaikan, goodwill itu aset seperti gedung", why: "Salah: goodwill bukan aset operasional \u2014 ia premi bayar yang tidak bisa dijual terpisah." },
            { text: "Waspada impairment \u2014 cek track record akuisisi manajemen", why: "Tepat: goodwill jumbo = premi besar = risiko write-down. Serial acquirer adalah red flag.", correct: true },
            { text: "Bagus, neraca terlihat besar", why: "Salah: neraca besar dari goodwill justru rapuh \u2014 analis konservatif mengeluarkannya (tangible book)." },
            { text: "Jual sahamnya segera", why: "Terlalu jauh: temuan ini memicu investigasi (uji impairment, histori akuisisi), bukan kesimpulan jual otomatis." },
          ],
        },
        {
          q: "Kasus PT Induk: P/E \u201Claporan\u201D 25\u00D7 (1.000/40). Berapa P/E berbasis kas?",
          options: [
            { text: "25\u00D7 \u2014 sama, equity method sudah benar", why: "Salah: equity method benar secara akuntansi, tetapi Rp40 miliar itu sebagian besar bukan kas." },
            { text: "125\u00D7 \u2014 lima kali lebih mahal; equity income non-kas harus dikeluarkan", why: "Tepat: kas = Rp8 miliar \u2192 1.000/8 = 125\u00D7. P/E 25\u00D7 adalah ilusi dari laba kertas.", correct: true },
            { text: "20\u00D7 \u2014 lebih murah karena ada dividen", why: "Salah arah: dividen justru jauh lebih kecil dari laba yang diakui, jadi P/E kas lebih mahal, bukan lebih murah." },
            { text: "Tidak bisa dihitung", why: "Bisa: kas = 40% \u00D7 dividen Rp20 miliar = Rp8 miliar." },
          ],
        },
      ],
    },
  ],
};
