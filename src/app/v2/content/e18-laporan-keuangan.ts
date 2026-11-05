import type { V2Lesson } from "../lib/types";

export const e18: V2Lesson = {
  slug: "e18-laporan-keuangan",
  track: "Financial Markets",
  module: "Analisis Fundamental",
  title: "E18. Membaca Laporan Keuangan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-sehat-sekarat",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Laba sama Rp150 miliar, nasib beda",
      prose: [
        "Dua perusahaan, laba bersih sama-sama Rp150 miliar. PT SEHAT setahun kemudian baik-baik saja. PT SEKARAT — gagal bayar utang, harga sahamnya anjlok 70%. Kok bisa, padahal labanya sama? Karena laba ≠ kesehatan. SEHAT labanya jadi kas; SEKARAT labanya nyangkut di piutang tak tertagih dan persediaan menumpuk — plus utang 3× lipat ekuitas.",
        "Tiga laporan = tiga sudut pandang perusahaan yang sama. Laba rugi (income statement): film setahun — pendapatan → biaya → laba (“apakah bisnisnya untung?”). Neraca (balance sheet): foto di tanggal tertentu — Aset = Liabilitas + Ekuitas (“apa yang dimiliki dan dari mana dananya?”). Arus kas (cash flow): jejak uang tunai — operasi, investasi, pendanaan (“apakah labanya jadi uang?”).",
      ],
      formula: String.raw`\text{Aset} = \text{Liabilitas} + \text{Ekuitas}`,
      formulaNote: "Persamaan abadi neraca. Laba rugi = cerita manajemen (bisa dipoles); arus kas = poligraf.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perusahaan bisa untung tapi mati karena likuiditas — tidak bisa bayar utang yang jatuh tempo minggu ini. Selalu verifikasi cerita laba dengan jejak kas.",
      },
      reference: "CFO vs laba = cek pertama analis, selalu. Kas sulit dibohongi akrual.",
    },
    {
      id: "rasio",
      eyebrow: "Langkah 2 · Empat keluarga rasio",
      title: "Bedah rasio: sehat atau sekarat?",
      prose: [
        "Empat keluarga rasio: likuiditas (current ratio = aset lancar / liabilitas jk pendek; sehat > 1,2×), leverage (DER = total utang / ekuitas; < 1,5× untuk non-bank), coverage (interest coverage = EBIT / beban bunga; > 3×), profitabilitas (ROA/ROE — tren naik, vs peers).",
        "Aturan pakai: bandingkan tren 3–5 tahun (bukan 1 titik), bandingkan dengan peers se-industri (DER 2× wajar untuk bank, gila untuk ritel), kombinasikan — satu rasio tidak pernah cukup. Hitung 4 rasio SEHAT vs SEKARAT — labanya mirip, kesehatannya langit-bumi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `current_sehat` dan `der_sekarat`" },
        { id: "t2", text: "Hitung `coverage_sekarat` (EBIT / beban bunga)" },
      ],
      expected: "current_sehat=2.0  der_sekarat=3.0  coverage_sekarat=2.0",
      note: {
        title: "Sering salah",
        body: "Menilai dari satu rasio satu tahun. DER 3× untuk bank = normal; untuk ritel = gila. Selalu: tren 3–5 tahun + bandingkan peers + kombinasikan rasio.",
      },
      hints: [
        "current ratio = aset_lancar / liab_jk_pendek.",
        "DER = total_utang / ekuitas. Coverage = ebit / beban_bunga.",
        "SEHAT: 800/400. SEKARAT: 1800/600 dan 220/110.",
      ],
      code: {
        starter: `# Angka dalam Rp miliar\nsehat = {"aset_lancar": 800, "liab_jk_pendek": 400, "total_utang": 900,\n         "ekuitas": 1100, "ebit": 260, "beban_bunga": 40}\nsekarat = {"aset_lancar": 500, "liab_jk_pendek": 600, "total_utang": 1800,\n           "ekuitas": 600, "ebit": 220, "beban_bunga": 110}\n\n# TULIS KODEMU: current ratio SEHAT, DER & coverage SEKARAT\ncurrent_sehat = \nder_sekarat = \ncoverage_sekarat = \n\nprint(f"current_sehat={current_sehat:.1f}  der_sekarat={der_sekarat:.1f}  coverage_sekarat={coverage_sekarat:.1f}")`,
        lockLines: 6,
        solution: `# Angka dalam Rp miliar\nsehat = {"aset_lancar": 800, "liab_jk_pendek": 400, "total_utang": 900,\n         "ekuitas": 1100, "ebit": 260, "beban_bunga": 40}\nsekarat = {"aset_lancar": 500, "liab_jk_pendek": 600, "total_utang": 1800,\n           "ekuitas": 600, "ebit": 220, "beban_bunga": 110}\n\n# TULIS KODEMU: current ratio SEHAT, DER & coverage SEKARAT\ncurrent_sehat = sehat["aset_lancar"] / sehat["liab_jk_pendek"]\nder_sekarat = sekarat["total_utang"] / sekarat["ekuitas"]\ncoverage_sekarat = sekarat["ebit"] / sekarat["beban_bunga"]\n\nprint(f"current_sehat={current_sehat:.1f}  der_sekarat={der_sekarat:.1f}  coverage_sekarat={coverage_sekarat:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "current_sehat", value: 2.0, tol: 1e-9, label: "`current_sehat` = 2,0", msg: "800/400 = 2,0× — likuid, sehat." },
          { kind: "equal", task: "t1", name: "der_sekarat", value: 3.0, tol: 1e-9, label: "`der_sekarat` = 3,0", msg: "1800/600 = 3,0× — leverage tinggi untuk non-bank." },
          { kind: "equal", task: "t2", name: "coverage_sekarat", value: 2.0, tol: 1e-9, label: "`coverage_sekarat` = 2,0", msg: "220/110 = 2,0× — di bawah ambang sehat 3×. Napas tersengal." },
          { kind: "stdout_matches", task: "t2", pattern: "current_sehat=2\\.0\\s+der_sekarat=3\\.0\\s+coverage_sekarat=2\\.0", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Likuiditas (current), leverage (DER), coverage (EBIT/bunga), profitabilitas (ROA/ROE).",
    },
    {
      id: "dupont",
      eyebrow: "Langkah 3 · DuPont",
      title: "Bedah ROE: dari operasi atau dari utang?",
      prose: [
        "ROE = margin × perputaran aset × leverage. Margin = efisiensi harga/biaya (pricing power). Perputaran = efisiensi operasional. Leverage = pengali utang (makin besar = makin berisiko!).",
        "PT SEHAT: penjualan Rp1.500 M, aset Rp2.500 M, ekuitas Rp833 M, laba Rp150 M → margin 10%, perputaran 0,6×, leverage 3,0× → ROE 18%. PT SEKARAT (laba juga Rp150 M!): penjualan Rp3.000 M, aset Rp5.000 M, ekuitas Rp500 M → margin 5%, perputaran 0,6×, leverage 10× → ROE 30%! ROE SEKARAT LEBIH TINGGI — tapi berdiri di atas utang Rp4.500 M. ROE tanpa dekomposisi = angka penipu.",
      ],
      formula: String.raw`ROE = \frac{\text{Laba}}{\text{Penjualan}} \times \frac{\text{Penjualan}}{\text{Aset}} \times \frac{\text{Aset}}{\text{Ekuitas}}`,
      formulaNote: "ROE = margin × perputaran × leverage: margin = laba ÷ penjualan (pricing power); perputaran = penjualan ÷ aset (efisiensi operasi); leverage = aset ÷ ekuitas (pengali utang — makin besar makin berisiko). Contoh: 10% × 0,6 × 3,0 = 18%. ROE 30% dari leverage 10× (PT SEKARAT) = rapuh — dekomposisi membongkarnya.",
      tasks: [
        { id: "t1", text: "Hitung `roe_sehat` (desimal)" },
        { id: "t2", text: "Hitung `roe_sekarat` (desimal)" },
      ],
      expected: "roe_sehat=0.18  roe_sekarat=0.30",
      note: {
        title: "Sering salah",
        body: "“ROE 30% > 18%, jadi SEKARAT lebih bagus.” ROE tinggi dari leverage 10× = bom waktu berkedok ROE cantik. Satu guncangan bunga/penjualan = kolaps.",
      },
      hints: [
        "ROE = (laba/penjualan) × (penjualan/aset) × (aset/ekuitas).",
        "SEHAT: (150/1500) × (1500/2500) × (2500/833).",
        "SEKARAT: (150/3000) × (3000/5000) × (5000/500).",
      ],
      code: {
        starter: `# Rp miliar: (laba, penjualan, aset, ekuitas)\nsehat = (150, 1500, 2500, 833)\nsekarat = (150, 3000, 5000, 500)\n\n# TULIS KODEMU: ROE via dekomposisi DuPont (desimal)\nroe_sehat = \nroe_sekarat = \n\nprint(f"roe_sehat={roe_sehat:.2f}  roe_sekarat={roe_sekarat:.2f}")`,
        lockLines: 3,
        solution: `# Rp miliar: (laba, penjualan, aset, ekuitas)\nsehat = (150, 1500, 2500, 833)\nsekarat = (150, 3000, 5000, 500)\n\n# TULIS KODEMU: ROE via dekomposisi DuPont (desimal)\ndef dupont(d):\n    laba, penjualan, aset, ekuitas = d\n    return (laba / penjualan) * (penjualan / aset) * (aset / ekuitas)\nroe_sehat = dupont(sehat)\nroe_sekarat = dupont(sekarat)\n\nprint(f"roe_sehat={roe_sehat:.2f}  roe_sekarat={roe_sekarat:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "roe_sehat", value: 0.18, tol: 0.002, label: "`roe_sehat` sekitar 0,18", msg: "0,10 × 0,6 × 3,0 = 18%. Sepertiganya dari utang." },
          { kind: "equal", task: "t2", name: "roe_sekarat", value: 0.30, tol: 0.001, label: "`roe_sekarat` = 0,30", msg: "0,05 × 0,6 × 10 = 30% — ROE “cantik” dari leverage 10×. Selalu tanya: ROE ini dari operasi atau dari utang?" },
          { kind: "stdout_matches", task: "t2", pattern: "roe_sehat=0\\.18\\s+roe_sekarat=0\\.30", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ROE tinggi? Bedah DuPont: dari operasional atau dari utang?",
    },
    {
      id: "redflags",
      eyebrow: "Langkah 4 · Red flags",
      title: "Laba naik, kas tidak: selidiki PT CANTIK",
      prose: [
        "Lima pola yang membuat analis langsung waspada: (1) laba naik, CFO turun/negatif — laba kertas; (2) piutang tumbuh jauh lebih cepat dari penjualan — penjualan paksa/kolektibilitas jebol; (3) persediaan menggelembung — barang tak laku; (4) utang naik, ekuitas stagnan + coverage < 2× — napas tersengal; (5) auditor berganti / opini dengan pengecualian / laporan telat — masalah tata kelola.",
        "PT CANTIK: laba 50→65→80→100 (2021–2024), tapi piutang 100→180→300→480 dan persediaan 80→150→260→420. Hitung CFO kasar 2024 = laba − kenaikan piutang − kenaikan persediaan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `cfo_2024` (Rp miliar, kasar)" },
      ],
      expected: "cfo_2024=-240",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu red flag = investigasi; tiga red flag = tinggalkan (sebagai kreditur maupun investor). Jangan jatuh cinta pada cerita manajemen.",
      },
      hints: [
        "Kenaikan piutang 2024 = 480 − 300. Kenaikan persediaan = 420 − 260.",
        "CFO kasar = laba − Δpiutang − Δpersediaan.",
        "cfo_2024 = 100 - (480-300) - (420-260)",
      ],
      code: {
        starter: `# PT CANTIK, Rp miliar\nlaba_2024 = 100\npiutang = [100, 180, 300, 480]\npersediaan = [80, 150, 260, 420]\n\n# TULIS KODEMU: CFO kasar 2024 = laba - kenaikan piutang - kenaikan persediaan\ncfo_2024 = \n\nprint(f"cfo_2024={cfo_2024:.0f}")`,
        lockLines: 4,
        solution: `# PT CANTIK, Rp miliar\nlaba_2024 = 100\npiutang = [100, 180, 300, 480]\npersediaan = [80, 150, 260, 420]\n\n# TULIS KODEMU: CFO kasar 2024 = laba - kenaikan piutang - kenaikan persediaan\ncfo_2024 = laba_2024 - (piutang[3] - piutang[2]) - (persediaan[3] - persediaan[2])\n\nprint(f"cfo_2024={cfo_2024:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cfo_2024", value: -240, tol: 1e-9, label: "`cfo_2024` = −240", msg: "100 − 180 − 160 = −240 M. Laba Rp100 M, kas operasi MINUS Rp240 M — laba kertas klasik." },
          { kind: "stdout_matches", task: "t1", pattern: "cfo_2024=-240", label: "`print` menampilkan CFO", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Laba tanpa kas = curigai. Piutang/persediaan vs penjualan = jejak manipulasi.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 5 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang laba vs kas dan kualitas ROE.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Laba bersih naik 30% tapi CFO negatif 2 tahun berturut-turut. Artinya…",
          options: [
            { text: "Perusahaan hebat", why: "Salah: laba tanpa kas = justru red flag." },
            { text: "Red flag: laba tidak menjadi kas — selidiki piutang/persediaan", why: "Benar: kesenjangan laba vs kas = sinyal bahaya #1.", correct: true },
            { text: "Normal saja", why: "Salah: 2 tahun berturut-turut bukan normal — investigasi." },
            { text: "Pasti manipulasi — langsung tuduh", why: "Salah: selidiki dulu — bisa jadi fase investasi berat yang legitimate." },
          ],
        },
        {
          q: "Dua perusahaan ROE 15%. A: margin 12%, leverage 1,2×. B: margin 3%, leverage 5×. Pilih?",
          options: [
            { text: "B — leverage lebih tinggi = lebih agresif", why: "Salah: agresif ≠ bagus. Leverage 5× = rapuh." },
            { text: "A — ROE dari operasional (margin), bukan dari utang. B rapuh saat bunga naik", why: "Benar: DuPont — kualitas > angka.", correct: true },
            { text: "Sama saja", why: "Salah: sumber ROE-nya beda jauh kualitasnya." },
            { text: "Tolak keduanya", why: "Salah: A berkualitas baik — tidak ada alasan menolak." },
          ],
        },
      ],
    },
    {
      id: "minicase-debitur",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Calon debitur bank: PT MAJU",
      prose: [
        "PT MAJU mengajukan kredit Rp50 miliar. Data 2024: penjualan Rp400 M (+25%!), laba bersih Rp40 M (+30%!), DER 1,2×, current ratio 1,5×. Terlihat hebat. Kamu tarik detail: piutang naik 80% (penjualan +25%), CFO negatif Rp15 M, interest coverage 2,1×.",
        "Pertanyaan: (a) Identifikasi red flags-nya. (b) Apa pertanyaan tajam untuk manajemen? (c) Keputusan kreditmu + syaratnya (jika tetap diberi)?",
        "Pembahasan: (a) Tiga red flags: piutang +80% vs penjualan +25% (penjualan kredit agresif/kolektibilitas jebol); CFO negatif padahal laba +30% (laba kertas); coverage 2,1× (tipis — kenaikan bunga sedikit = gagal bayar bunga). (b) “Siapa 5 debitur piutang terbesar dan umur piutangnya?” “Kenapa penjualan naik tapi kas tidak masuk?” “Bagaimana proyeksi CFO 12 bulan ke depan per bulan?” (c) Tolak — atau beri dengan syarat ketat: plafon lebih kecil, tenor pendek, covenant (DER maks, coverage min, laporan bulanan), agunan likuid.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Prinsip kredit: pinjamkan pada arus kas, bukan pada cerita pertumbuhan. Agunan = jalan keluar kedua; sumber bayar utama = arus kas operasi.",
      },
      reference: "Analisis 15 menit: CFO vs laba + DER + coverage menyaring 80% masalah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Analisis 15 menit: empat skenario",
      prose: [
        "Screening cepat emiten/obligor → CFO vs laba + DER + coverage: tiga cek ini menyaring 80% masalah dalam 15 menit per perusahaan. Menilai kualitas ROE → DuPont: margin vs turnover vs leverage — pilih yang ROE-nya dari operasional, bukan utang.",
        "Curiga manipulasi → tren piutang/persediaan vs penjualan + opini auditor: manipulasi meninggalkan jejak di modal kerja dan catatan auditor. Keputusan kredit bank → coverage + proyeksi arus kas (bukan cuma agunan!): bank yang hanya lihat agunan = bank yang siap sita-sitaan.",
        "Aturan 10 detik: laba tanpa kas = curigai. CFO vs laba = cek pertama, selalu. ROE tinggi? Bedah DuPont. Tiga red flag = tinggalkan.",
      ],
      note: {
        title: "Intuisi: laba = opini, kas = fakta",
        body: "Laba bisa “diatur” lewat akrual — pengakuan pendapatan, depresiasi, cadangan; kas operasi jauh lebih sulit dipoles. Empat heuristik. Pertama: laba naik + kas operasi stagnan = selidiki — PT CANTIK mengajarkan pola klasiknya: piutang menggelembung, kas tidak ikut; itu bukan pertumbuhan, itu penagihan yang tertunda. Kedua: baca tren 5 tahun, bukan 1 tahun — satu tahun bisa anomali, lima tahun adalah karakter; dan bandingkan dengan kompetitor seindustri, bukan dengan angan; margin 40% mengagumkan sampai tahu industrinya 45%. Ketiga: catatan kaki = tempat rahasia disembunyikan — transaksi afiliasi, komitmen sewa, kontinjensi hukum; auditor menulis yang penting di sana karena tidak muat di angka; yang malas baca catatan = yang pertama kaget. Keempat: dekomposisi sebelum kagum — ROE 30% dari leverage 10× (PT SEKARAT) vs ROE 18% dari operasi (PT SEHAT); angka yang sama, kualitas beda langit-bumi; DuPont adalah alat bedahnya. Aturan 10 detiknya: ROE tinggi + utang tinggi + kas operasi < laba = jangan sentuh sebelum paham; tiga merah itu jarang salah.",
      },
      tasks: [],
      reference: "Pinjamkan/investasikan pada arus kas, bukan pada cerita.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Tiga laporan: laba rugi (film), neraca (foto: Aset = Liabilitas + Ekuitas), arus kas (poligraf).",
        "Laba tanpa kas = curigai. CFO vs laba = cek pertama analis.",
        "Empat keluarga rasio: likuiditas (current), leverage (DER), coverage (EBIT/bunga), profitabilitas (ROA/ROE).",
        "DuPont: ROE = margin × turnover × leverage — bedakan ROE berkualitas vs ROE utang.",
        "Lima red flags; tiga red flag = tinggalkan. Pinjamkan pada arus kas, bukan cerita.",
      ],
      next: { label: "CR1 — Produk Kredit", href: "/learn/cr1-produk-kredit" },
      quiz: [
        {
          q: "Piutang naik 80% sementara penjualan naik 25%. Kemungkinan?",
          options: [
            { text: "Efisiensi meningkat", why: "Salah: piutang membengkak = kas TERTAHAN, bukan efisiensi." },
            { text: "Penjualan kredit agresif / kolektibilitas memburuk — red flag", why: "Benar: piutang harus tumbuh sejalan penjualan.", correct: true },
            { text: "Tidak ada artinya", why: "Salah: kesenjangan besar = sinyal bahaya klasik." },
            { text: "Pasti bagus", why: "Salah: tidak ada yang “pasti bagus” dari kesenjangan ini." },
          ],
        },
        {
          q: "Interest coverage 1,5× artinya…",
          options: [
            { text: "Aman", why: "Salah: aman = > 3×." },
            { text: "EBIT hanya 1,5× beban bunga — napas tersengal; kenaikan bunga/penurunan laba sedikit = gagal bayar bunga", why: "Benar: coverage < 2× = zona bahaya.", correct: true },
            { text: "Tidak penting", why: "Salah: ini rasio favorit analis kredit." },
            { text: "Perusahaan kaya", why: "Salah: coverage rendah = beban bunga berat relatif terhadap laba." },
          ],
        },
        {
          q: "Urutan baca annual report ala analis profesional?",
          options: [
            { text: "Laba rugi dulu sampai tuntas", why: "Salah: mulai dari yang paling sulit dibohongi — arus kas." },
            { text: "Arus kas vs laba → neraca (utang & likuiditas) → tren margin → catatan auditor", why: "Benar: kejujuran → kekuatan → cerita → validasi. 15 menit screening.", correct: true },
            { text: "Baca dari halaman 1 berurutan", why: "Salah: 200 halaman berurutan = tidak efisien." },
            { text: "Lihat foto direksi", why: "Salah: bukan metode analisis." },
          ],
        },
        {
          q: "Bank menilai aplikasi kredit. Sumber bayar UTAMA yang benar?",
          options: [
            { text: "Agunan yang besar", why: "Salah: agunan = jalan keluar kedua, bukan sumber bayar." },
            { text: "Arus kas operasi debitur — agunan hanya jalan keluar kedua", why: "Benar: cash flow lending.", correct: true },
            { text: "Nama besar pemilik", why: "Salah: reputasi bukan arus kas." },
            { text: "Laba bersih akuntansi", why: "Salah: laba akrual bisa tidak jadi kas — CFO yang membayar cicilan." },
          ],
        },
      ],
    },
  ],
};
