import type { V2Lesson } from "../lib/types";

export const e26: V2Lesson = {
  slug: "e26-mortgage-cmbs-cdo",
  track: "Financial Markets",
  module: "Mortgage & Sekuritisasi",
  title: "E26. Mortgage, CMO & CDO: Mekanika Kredit Perumahan",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-originate",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Bank memberi KPR, lalu menjualnya — kenapa?",
      prose: [
        "Bank A menyetujui KPR Rp500 juta untuk keluarga muda. Seminggu kemudian, KPR itu tidak lagi ada di neraca Bank A: sudah dijual ke investor lewat sekuritisasi. Bank A tetap menagih cicilan (sebagai servicer, dengan fee), tetapi risiko gagal bayar dan dananya kini berpindah. Model ini bernama originate-to-distribute: bank meng-originate kredit, lalu mendistribusikannya ke pasar modal.",
        "Keuntungannya nyata: bank membebaskan modal dan bisa memberi KPR baru lagi — satu rupiah modal bisa membiayai lebih banyak rumah. Bahayanya juga nyata: kalau bank tidak lagi menanggung risiko kredit yang ia buat, insentif untuk memeriksa kualitas debitur melemah. Lesson ini membedah mekanikanya — bukan cerita krisisnya. Mini-case krisis 2008 sudah ada di E14; di sini kita fokus pada mesinnya: amortisasi, pooling, tranche, dan korelasi.",
      ],
      tasks: [],
      reference: "Originate-to-distribute = bank membuat kredit, pasar modal menanggungnya.",
    },
    {
      id: "mortgage-lending",
      eyebrow: "Langkah 2 · Mortgage lending",
      title: "Cicilan KPR: anuitas, LTV, DTI, dan PMI",
      prose: [
        "KPR standar memakai amortisasi anuitas: cicilan bulanan tetap, komposisi bunga menurun dan pokok membesar seiring waktu. Rumus cicilan: pokok dikali suku bunga bulanan dikali faktor pengali, dibagi faktor pengali dikurangi satu. Contoh ilustratif: pokok Rp500 juta, bunga 9% per tahun, tenor 20 tahun (240 bulan). Suku bunga bulanan = 0,09 / 12 = 0,0075; faktor (1,0075)^240 ≈ 6,0092. Cicilan = 500.000.000 × 0,0075 × 6,0092 / 5,0092 ≈ Rp4.498.630 per bulan. Total dibayar 240 bulan ≈ Rp1.079.671.147, sehingga total bunga ≈ Rp579.671.147 — lebih besar dari pokoknya.",
        "Tiga huruf yang menentukan lolos tidaknya KPR. LTV (loan-to-value) = pokok pinjaman dibagi nilai rumah. Rumah ilustratif Rp625 juta dengan pokok Rp500 juta → LTV 80%. DTI (debt-to-income) = cicilan dibagi penghasilan bulanan. Penghasilan ilustratif Rp15 juta per bulan → DTI ≈ 30% (4.498.630 / 15.000.000). Bank umumnya nyaman pada DTI di bawah sekitar 30–40%. PMI (private mortgage insurance) = asuransi yang melindungi PEMBERI PINJAMAN bila debitur gagal bayar; wajib saat LTV di atas 80% — artinya uang muka di bawah 20%. Pada contoh ini LTV tepat 80%, jadi PMI tidak wajib; bila uang muka hanya 10% (LTV 90%), PMI wajib dan premi dibebankan ke debitur.",
      ],
      formula: String.raw`\text{Cicilan} = P \times \frac{r(1+r)^n}{(1+r)^n - 1} \qquad LTV = \frac{\text{pokok}}{\text{nilai rumah}} \qquad DTI = \frac{\text{cicilan}}{\text{penghasilan}}`,
      formulaNote: "P = pokok; r = bunga bulanan (bunga tahunan / 12); n = jumlah bulan. Contoh ilustratif: P = Rp500 jt, r = 0,0075, n = 240, (1+r)^n ≈ 6,0092 → cicilan ≈ Rp4.498.630; total bunga = 240 × 4.498.630 − 500.000.000 ≈ Rp579.671.147.",
      tasks: [
        { id: "t1", text: "Hitung `cicilan` bulanan KPR (pokok Rp500 jt, 9% p.a., 20 tahun)" },
        { id: "t2", text: "Hitung `total_bunga` selama 240 bulan" },
      ],
      expected: "cicilan=4498630  total_bunga=579671147",
      note: {
        title: "Sering salah",
        body: "Mengira cicilan = pokok dibagi tenor (500 jt / 240 = Rp2,08 jt). Itu mengabaikan bunga — cicilan sebenarnya Rp4,50 jt, dan total bunga melebihi pokok pinjaman.",
      },
      hints: [
        "r_bulanan = 0,09 / 12 = 0,0075; n = 20 × 12 = 240.",
        "cicilan = P * r * (1+r)**n / ((1+r)**n - 1).",
        "total_bunga = cicilan * 240 - pokok.",
      ],
      code: {
        starter: `pokok = 500_000_000  # Rp500 juta (ilustratif)\nbunga_tahunan = 0.09\ntenor_tahun = 20\n\nr = bunga_tahunan / 12\nn = tenor_tahun * 12\n\n# TULIS KODEMU: cicilan bulanan anuitas dan total bunga\ncicilan = \ntotal_bunga = \n\nprint(f"cicilan={cicilan:.0f}  total_bunga={total_bunga:.0f}")`,
        lockLines: 6,
        solution: `pokok = 500_000_000  # Rp500 juta (ilustratif)\nbunga_tahunan = 0.09\ntenor_tahun = 20\n\nr = bunga_tahunan / 12\nn = tenor_tahun * 12\n\n# TULIS KODEMU: cicilan bulanan anuitas dan total bunga\ncicilan = pokok * r * (1 + r) ** n / ((1 + r) ** n - 1)\ntotal_bunga = cicilan * n - pokok\n\nprint(f"cicilan={cicilan:.0f}  total_bunga={total_bunga:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cicilan", value: 4498630, tol: 1, label: "`cicilan` ≈ Rp4.498.630", msg: "500 jt × 0,0075 × 6,0092 / 5,0092 = Rp4.498.630 per bulan." },
          { kind: "equal", task: "t2", name: "total_bunga", value: 579671147, tol: 1, label: "`total_bunga` ≈ Rp579,7 jt", msg: "240 × 4.498.630 − 500 jt = Rp579,7 juta — bunga melebihi pokok." },
          { kind: "stdout_matches", task: "t2", pattern: "cicilan=4498630\\s+total_bunga=579671147", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Anuitas: cicilan tetap, bunga menurun, pokok membesar. LTV di atas 80% → PMI wajib.",
    },
    {
      id: "sekuritisasi",
      eyebrow: "Langkah 3 · Sekuritisasi",
      title: "Dari 10.000 KPR menjadi satu efek: SPV, pooling, waterfall",
      prose: [
        "Sekuritisasi punya tiga langkah. Pertama, pooling: bank mengumpulkan ribuan KPR menjadi satu pool — diversifikasi bekerja karena gagal bayar satu debitur tidak menentukan nasib pool. Kedua, SPV (special purpose vehicle): pool dijual ke entitas khusus yang bangkrut-terpisah (bankruptcy-remote) — bila bank asal bangkrut, pool tidak ikut disita kreditor bank. Ketiga, penerbitan: SPV menerbitkan efek beragun aset (MBS) yang arus kasnya = cicilan para debitur, dipotong fee servicer dan cadangan.",
        "Waterfall mengatur aliran uang dalam dua arah berlawanan. Arus kas masuk dibayar dari ATAS ke bawah: senior dulu, lalu mezzanine, lalu equity. Kerugian datang dari BAWAH ke atas: equity menanggung dulu, lalu mezzanine, terakhir senior. Dua risiko utama pool KPR: default risk (debitur berhenti membayar) dan prepayment risk (debitur melunasi lebih cepat — misalnya saat suku bunga turun dan mereka refinancing — sehingga investor kehilangan kupon masa depan).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "SPV yang bankruptcy-remote melindungi investor dari kebangkrutan bank asal — tetapi tidak melindungi dari kualitas pool itu sendiri. Selalu tanya: siapa yang memeriksa 10.000 debitur itu, dan dengan standar apa?",
      },
      reference: "Pool → SPV → MBS. Kas dibayar dari atas; rugi masuk dari bawah.",
    },
    {
      id: "tranche-cmo",
      eyebrow: "Langkah 4 · Tranche & CMO",
      title: "CMO: siapa menanggung prepayment, siapa menanggung default?",
      prose: [
        "CMO (collateralized mortgage obligation) = MBS yang dipotong menjadi tranche dengan jadwal pembayaran berbeda. Sequential-pay CMO: seluruh pembayaran pokok mengalir ke tranche A sampai lunas, baru ke tranche B, dan seterusnya. Tranche awal = jatuh tempo pendek dan terlindung dari perpanjangan tenor, tetapi terpapar prepayment; tranche akhir = sebaliknya. PAC (planned amortization class) tranche mendapat jadwal pembayaran yang dijaga stabil dalam rentang prepayment tertentu — stabilitas itu dibayar oleh support (companion) tranche, yang menyerap seluruh kelebihan dan kekurangan prepayment.",
        "Pembagian risiko kuncinya: prepayment risk ditanggung support tranche, sedangkan default risk ditanggung equity tranche (lapisan paling bawah). Contoh ilustratif: pool Rp100 juta, default 10% dengan asumsi LGD 100% (setiap kredit gagal bayar kehilangan seluruh pokok — asumsi keras untuk belajar waterfall; dunia nyata LGD di bawah 100%) → rugi Rp10 juta. Tranche equity 5% (Rp5 juta) hangus 100%; sisa Rp5 juta → mezzanine 10% (Rp10 juta) hangus 50%; senior 85% (Rp85 juta) belum tersentuh. Hitung sendiri di lab.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rugi` total pool (default 10%, LGD 100%)" },
        { id: "t2", text: "Hitung `equity_hangus` (rupiah) dan `mezz_hangus` (rupiah)" },
      ],
      expected: "rugi=10000000  equity_hangus=5000000  mezz_hangus=5000000",
      note: {
        title: "Sering salah",
        body: "Mengira senior “pasti aman” karena besar. Senior aman hanya selama rugi kumulatif di bawah equity + mezzanine (di sini 15% pool). Waterfall = antrean, bukan jaminan.",
      },
      hints: [
        "rugi = pool × 0,10 (LGD 100% = rugi sama dengan pokok yang default).",
        "Equity menanggung pertama: min(rugi, 5 jt).",
        "Mezzanine menanggung sisa: min(rugi − serapan equity, 10 jt).",
      ],
      code: {
        starter: `pool = 100_000_000  # Rp100 juta (ilustratif)\ndefault_rate = 0.10\nlgd = 1.00  # asumsi keras untuk belajar waterfall\neq_porsi, mez_porsi = 0.05, 0.10\n\n# TULIS KODEMU: rugi total dan serapan per tranche\nrugi = \nequity_hangus = min(rugi, pool * eq_porsi)\nmezz_hangus = \n\nprint(f"rugi={rugi:.0f}  equity_hangus={equity_hangus:.0f}  mezz_hangus={mezz_hangus:.0f}")`,
        lockLines: 4,
        solution: `pool = 100_000_000  # Rp100 juta (ilustratif)\ndefault_rate = 0.10\nlgd = 1.00  # asumsi keras untuk belajar waterfall\neq_porsi, mez_porsi = 0.05, 0.10\n\n# TULIS KODEMU: rugi total dan serapan per tranche\nrugi = pool * default_rate * lgd\nequity_hangus = min(rugi, pool * eq_porsi)\nmezz_hangus = min(max(rugi - equity_hangus, 0), pool * mez_porsi)\n\nprint(f"rugi={rugi:.0f}  equity_hangus={equity_hangus:.0f}  mezz_hangus={mezz_hangus:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rugi", value: 10000000, tol: 1, label: "`rugi` = Rp10 jt", msg: "100 jt × 10% × 100% = Rp10 juta = 10% pool." },
          { kind: "equal", task: "t2", name: "equity_hangus", value: 5000000, tol: 1, label: "`equity_hangus` = Rp5 jt (100%)", msg: "Equity Rp5 juta hangus seluruhnya — ia bantalan pertama." },
          { kind: "equal", task: "t2", name: "mezz_hangus", value: 5000000, tol: 1, label: "`mezz_hangus` = Rp5 jt (50%)", msg: "Sisa rugi Rp5 juta → mezzanine Rp10 juta hangus 50%; senior selamat." },
          { kind: "stdout_matches", task: "t2", pattern: "rugi=10000000\\s+equity_hangus=5000000\\s+mezz_hangus=5000000", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "PAC = jadwal dijaga; support = penyerap prepayment. Default ditanggung equity dulu.",
    },
    {
      id: "cdo-synthetic",
      eyebrow: "Langkah 5 · CDO & synthetic CDO",
      title: "Re-sekuritisasi: CDO, dan CDS sebagai bahan baku",
      prose: [
        "CDO (collateralized debt obligation) = sekuritisasi tingkat dua: bahan bakunya bukan lagi kredit langsung, melainkan tranche dari sekuritisasi lain — sering tranche mezzanine dari banyak MBS yang digabung menjadi satu pool baru, lalu dipotong tranche lagi. Hasilnya: tranche senior dari CDO bisa mendapat rating tinggi meski bahan bakunya adalah tranche mezzanine. Mekanikanya sah secara matematis; bahayanya adalah bahan baku yang sudah terkonsentrasi pada risiko yang sama (misalnya semua mezzanine KPR) lalu dianggap terdiversifikasi.",
        "Synthetic CDO melangkah lebih jauh: tidak ada obligasi yang dibeli sama sekali. Eksposur kreditnya dibangun dari CDS (credit default swap) — kontrak di mana penjual proteksi menerima premi berkala dan membayar bila terjadi credit event pada reference entity. Pool CDS ini lalu di-tranche seperti CDO biasa. Keuntungannya: eksposur bisa diciptakan tanpa batas jumlah obligasi yang ada. Bahayanya: rantai counterparty — bila penjual proteksi gagal membayar saat credit event terjadi, seluruh struktur ikut goyah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: re-sekuritisasi = mengocok ulang risiko, bukan menghilangkannya",
        body: "Menggabungkan 100 tranche mezzanine lalu memotongnya lagi tidak menciptakan keamanan baru — ia hanya memindahkan risiko ke bentuk yang lebih sulit dilacak. Selalu tanya: apa bahan bakunya, dan apakah bahan baku itu sendiri sudah terdiversifikasi?",
      },
      reference: "CDO = tranche dari tranche. Synthetic CDO = tranche dari CDS, tanpa obligasi.",
    },
    {
      id: "korelasi-copula",
      eyebrow: "Langkah 6 · Korelasi",
      title: "Kenapa senior terlihat aman: asumsi korelasi rendah",
      prose: [
        "Seluruh keajaiban tranche senior bertumpu pada satu asumsi: gagal bayar para debitur tidak terjadi bersamaan. Bila default saling independen, peluang rugi pool melampaui 15% sangat kecil — senior tampak hampir bebas risiko dan pantas mendapat rating tinggi. Bila default berkorelasi — misalnya seluruh debitur terpukul oleh jatuhnya harga rumah secara nasional — kerugian menumpuk serentak, equity dan mezzanine habis dalam sekejap, dan senior ikut berdarah. Korelasi adalah variabel yang paling menentukan harga tranche, sekaligus paling sulit diestimasi karena hanya terungkap saat krisis.",
        "Gaussian copula adalah alat yang dulu populer untuk memodelkan korelasi default ini: ia memisahkan probabilitas default tiap debitur (marginal) dari struktur ketergantungan antar debitur (copula), dengan satu parameter korelasi yang diringkas dari harga pasar CDS. Kelemahannya bersifat konseptual: satu angka korelasi tidak bisa menangkap kenyataan bahwa korelasi itu sendiri naik saat krisis — persis ketika ia paling penting. Model yang dikalibrasi dari masa tenang akan meremehkan kerugian ekor secara sistematis.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Korelasi bukan konstanta fisika — ia naik saat stres. Uji tranche senior dengan korelasi krisis, bukan korelasi masa tenang. Inilah benang merah dari E8 (correlation breakdown) dan E14 (mini-case 2008).",
      },
      reference: "Senior aman = asumsi korelasi rendah. Copula Gaussian = satu angka untuk ketergantungan.",
    },
    {
      id: "minicase-pool",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Pool KPR ilustratif: default 15% — siapa yang selamat?",
      prose: [
        "Pool KPR ilustratif Rp100 juta dengan struktur tranche yang sama seperti Langkah 4: equity 5% (Rp5 juta), mezzanine 10% (Rp10 juta), senior 85% (Rp85 juta). Skenario stres: default 15% dengan asumsi LGD 100% → rugi Rp15 juta, tepat 15% dari pool.",
        "Pembahasan: rugi Rp15 juta masuk dari bawah. Equity Rp5 juta hangus 100%. Sisa Rp10 juta → mezzanine Rp10 juta hangus 100%. Sisa Rp0 → senior Rp85 juta selamat — tetapi dengan margin NOL. Satu debitur lagi yang default, dan senior mulai berdarah. Pertanyaan: (a) Berapa default rate yang mulai menyentuh senior? Jawab: di atas 15% (equity + mezzanine = 15% pool). (b) Apakah investor senior boleh tidur nyenyak? Tidak — harga pasar senior akan jatuh jauh sebelum default menyentuhnya, karena pasar melihat bantalan sudah habis. (c) Apa yang berubah bila LGD hanya 50%? Rugi = 15% × 50% × Rp100 juta = Rp7,5 juta → equity hangus 100%, mezzanine hangus Rp2,5 juta (25%), senior aman dengan bantalan Rp7,5 juta. LGD sama pentingnya dengan default rate.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bantalan 15% terdengar tebal sampai skenario stres menunjukkan ia habis tepat di angka 15%. Selalu hitung break-even default rate tranche senior — dan tanyakan seberapa jauh angka itu dari skenario stres yang masuk akal.",
      },
      reference: "Default 15% = equity dan mezzanine habis total; senior selamat dengan margin nol.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Originate-to-distribute: bank membuat KPR lalu menjualnya — modal bebas, tetapi insentif memeriksa debitur melemah.",
        "KPR anuitas: cicilan = P × r(1+r)^n / ((1+r)^n − 1); LTV di atas 80% → PMI wajib; DTI mengukur beban cicilan.",
        "Sekuritisasi: pool → SPV bankruptcy-remote → MBS; kas dibayar dari atas, rugi masuk dari bawah.",
        "CMO: sequential-pay dan PAC vs support — prepayment ditanggung support, default ditanggung equity.",
        "CDO = tranche dari tranche; synthetic CDO = tranche dari CDS, tanpa obligasi.",
        "Keamanan senior bertumpu pada asumsi korelasi rendah; Gaussian copula merangkum ketergantungan dalam satu angka.",
      ],
      next: { label: "E27 — Regulasi Keuangan sebagai Sistem", href: "/learn/e27-regulasi-keuangan" },
      quiz: [
        {
          q: "KPR pokok Rp500 juta, bunga 9% p.a., tenor 20 tahun. Cicilan bulanan sekitar?",
          options: [
            { text: "Rp2,08 juta (500 jt / 240)", why: "Salah: itu cicilan tanpa bunga — bunga membuat cicilan hampir dua kali lipat." },
            { text: "Rp4,50 juta", why: "Benar: rumus anuitas dengan r = 0,0075 dan n = 240 memberi Rp4.498.630.", correct: true },
            { text: "Rp7,50 juta", why: "Salah: terlalu besar — hitung lagi dengan rumus anuitas." },
            { text: "Rp500 juta / 12", why: "Salah: itu mencicil pokok dalam setahun, bukan 20 tahun." },
          ],
        },
        {
          q: "LTV 90% (uang muka 10%). Apa konsekuensinya bagi debitur?",
          options: [
            { text: "Tidak ada — LTV hanya angka internal bank", why: "Salah: LTV di atas 80% memicu kewajiban PMI." },
            { text: "PMI wajib — asuransi yang melindungi pemberi pinjaman, preminya dibebankan ke debitur", why: "Benar: PMI melindungi lender, bukan debitur; pemicunya LTV di atas 80%.", correct: true },
            { text: "Bunga otomatis 0%", why: "Salah: tidak ada kaitan antara LTV dan bunga nol." },
            { text: "KPR ditolak pasti", why: "Salah: LTV 90% masih bisa disetujui — dengan PMI." },
          ],
        },
        {
          q: "Pool Rp100 juta (ilustratif), default 10%, LGD 100%, equity 5%, mezzanine 10%. Berapa yang ditanggung mezzanine?",
          options: [
            { text: "Rp0 — senior yang menanggung dulu", why: "Salah: rugi masuk dari bawah, senior terakhir." },
            { text: "Rp5 juta (50% tranche-nya)", why: "Benar: rugi Rp10 juta, equity Rp5 juta habis, sisa Rp5 juta ke mezzanine.", correct: true },
            { text: "Rp10 juta (100% tranche-nya)", why: "Salah: mezzanine hanya menanggung sisa setelah equity habis." },
            { text: "Rp10 juta rugi total", why: "Salah: itu rugi pool, bukan serapan mezzanine." },
          ],
        },
        {
          q: "Apa fungsi support (companion) tranche dalam CMO PAC?",
          options: [
            { text: "Menjamin tidak ada default", why: "Salah: support menyerap prepayment, bukan default." },
            { text: "Menyerap kelebihan dan kekurangan prepayment agar jadwal PAC tetap stabil", why: "Benar: stabilitas PAC dibayar oleh support tranche.", correct: true },
            { text: "Membayar kupon paling tinggi", why: "Salah: support justru menanggung volatilitas arus kas." },
            { text: "Menggantikan SPV", why: "Salah: SPV dan tranche adalah hal yang berbeda." },
          ],
        },
        {
          q: "Mengapa tranche senior bisa terlihat aman padahal bahan bakunya berisiko?",
          options: [
            { text: "Karena senior dijamin pemerintah", why: "Salah: tidak ada jaminan pemerintah pada tranche ini." },
            { text: "Karena asumsi korelasi default rendah — bila default terjadi bersamaan, bantalan habis serentak", why: "Benar: keamanan senior = asumsi korelasi, bukan sifat bawaan asetnya.", correct: true },
            { text: "Karena senior dibayar terakhir", why: "Salah: terbalik — senior dibayar PERTAMA dari arus kas." },
            { text: "Karena rating tidak pernah salah", why: "Salah: rating memakai asumsi yang sama — dan bisa salah bersamaan." },
          ],
        },
      ],
    },
  ],
};
