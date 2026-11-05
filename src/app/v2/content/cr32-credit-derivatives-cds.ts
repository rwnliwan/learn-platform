import type { V2Lesson } from "../lib/types";

const FIG_SPREAD_PD = `<svg viewBox="0 0 480 280" role="img" aria-label="Spread CDS naik seiring PD untuk LGD 60 persen.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Spread CDS ≈ harga risiko: PD naik, premi naik</text>
<text x="10" y="55" font-size="11" fill="var(--chart-text)">PD 1%</text>
<rect x="120" y="42" width="60" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="186" y="59" font-size="11" fill="var(--chart-text)">60 bp</text>
<text x="10" y="95" font-size="11" fill="var(--chart-text)">PD 2%</text>
<rect x="120" y="82" width="120" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="246" y="99" font-size="11" fill="var(--chart-text)">120 bp</text>
<text x="10" y="135" font-size="11" fill="var(--chart-text)">PD 5%</text>
<rect x="120" y="122" width="300" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="426" y="139" font-size="11" fill="var(--chart-text)">300 bp</text>
<text x="10" y="175" font-size="11" fill="var(--chart-text)">LGD 60% untuk ketiganya. Spread = PD × LGD, linier.</text>
<text x="10" y="205" font-size="11" fill="var(--chart-text)">Debitur 5x lebih berisiko → premi 5x lebih mahal. Tidak ada diskon.</text>
<text x="10" y="235" font-size="10" fill="var(--chart-text)" opacity="0.75">Ilustrasi: 1 bp = 0,01%. Spread tahunan per Rp100 notional.</text>
</g>
</svg>`;

const FIG_CASHFLOW = `<svg viewBox="0 0 480 280" role="img" aria-label="Arus kas CDS: premi triwulanan dari pembeli ke penjual, payout sekaligus saat default.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Dua kaki CDS: premi kecil rutin vs payout besar sekali</text>
<text x="10" y="60" font-size="11" fill="var(--chart-text)">Premium leg (pembeli → penjual)</text>
<rect x="230" y="48" width="30" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="266" y="48" width="30" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="302" y="48" width="30" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="338" y="48" width="30" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="230" y="92" font-size="10" fill="var(--chart-text)">Rp375 rb / triwulan × 5 tahun</text>
<text x="10" y="140" font-size="11" fill="var(--chart-text)">Protection leg (penjual → pembeli, HANYA bila default)</text>
<rect x="230" y="118" width="200" height="32" fill="var(--c4)" opacity="0.9"/>
<text x="240" y="139" font-size="11" fill="var(--chart-text)">Rp60 jt SEKALI, saat credit event</text>
<text x="10" y="185" font-size="11" fill="var(--chart-text)">Notional Rp100 jt · spread 150 bp · recovery 40%.</text>
<text x="10" y="215" font-size="11" fill="var(--chart-text)">Tanpa default: pembeli "membuang" Rp7,5 jt premi 5 tahun.</text>
<text x="10" y="245" font-size="11" fill="var(--chart-text)">Dengan default: pembeli menerima Rp60 jt — asuransi yang bekerja.</text>
</g>
</svg>`;

export const cr32: V2Lesson = {
  slug: "cr32-credit-derivatives-cds",
  track: "Credit Risk",
  module: "Kredit Terstruktur",
  title: "CR32 — Credit Derivatives & CDS: Mentransfer Risiko Kredit Tanpa Menjual Pinjaman",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pinjaman yang tidak boleh dijual",
      prose: [
        "Bank Nusantara punya pinjaman Rp100 miliar ke PT Semen Andalas — nasabah korporasi terbesarnya, hubungan 20 tahun. Masalahnya: 40% portofolio korporasi bank kini terkonsentrasi di satu grup. Komite risiko memerintahkan: kurangi eksposur. Treasury mengusulkan: 'Jual saja pinjamannya ke bank lain.' Direksi menolak mentah-mentah: 'Menjual pinjaman Andalas = memberi tahu pasar kita tidak percaya padanya. Hubungan 20 tahun hancur dalam sehari.'",
        "Twist-nya: bank menemukan cara memindahkan RISIKO tanpa memindahkan PINJAMAN. Ia membayar Rp375 juta per triwulan ke sebuah dealer — dan sebagai gantinya, bila Andalas gagal bayar, dealer yang menanggung kerugiannya. Pinjaman tetap tercatat atas nama bank, nasabah tidak tahu apa-apa, hubungan tetap mesra. Yang berpindah hanya risiko gagal bayarnya — lewat kontrak bernama credit default swap (CDS).",
        "Analoginya seperti asuransi mobil yang kamu beli padahal mobilnya tetap kamu pakai: premi rutin yang 'hangus' bila tidak ada kecelakaan, tetapi menyelamatkanmu dari kerugian besar bila kecelakaan terjadi. Bedanya, CDS bisa dibeli bahkan oleh pihak yang TIDAK memiliki pinjamannya — seperti membeli asuransi atas mobil tetanggamu. Di sinilah derivatif kredit menjadi menarik sekaligus kontroversial.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan anatomi CDS — siapa pembeli dan penjual proteksi; (2) membaca spread CDS sebagai harga risiko dan menghubungkannya ke PD dan LGD; (3) menghitung premi dan payout dengan angka konkret; (4) menilai kapan CDS tepat dipakai dan apa risikonya sendiri. Prasyarat ringkas: PD (probability of default) = peluang debitur gagal bayar dalam setahun; LGD (loss given default) = porsi eksposur yang hilang bila default terjadi; EAD (exposure at default) = nilai eksposur saat default. Ketiganya membentuk kerugian ekspektasi ≈ PD × LGD × EAD. PD sendiri biasanya diestimasi lewat model seperti scorecard — itulah topik pemodelan PD.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "CDS adalah alat transfer risiko paling murni di pasar kredit: ia memisahkan risiko kredit dari kepemilikan aset. Analis risiko kredit wajib paham karena spread CDS adalah 'harga pasar' risiko kredit yang paling jujur — ia dipakai untuk memvalidasi PD internal bank.",
      },
      reference: "CDS = asuransi gagal bayar yang bisa diperdagangkan.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Anatomi CDS: dua kaki, satu pemicu",
      prose: [
        "CDS adalah kontrak bilateral antara dua pihak. Protection buyer (pembeli proteksi) membayar premi rutin — biasanya tiap triwulan, dinyatakan dalam basis poin (bp) per tahun dari nilai notional. Protection seller (penjual proteksi) berjanji membayar ganti rugi bila terjadi credit event pada reference entity (perusahaan acuan, mis. PT Semen Andalas). Nilai notional (mis. Rp100 miliar) adalah angka acuan perhitungan — tidak berpindah tangan.",
        "Kontrak punya dua 'kaki'. Premium leg: arus premi dari pembeli ke penjual selama kontrak hidup (tenor standar 5 tahun). Protection leg: pembayaran SEKALI dari penjual ke pembeli, hanya bila credit event terjadi. Credit event mencakup kebangkrutan (bankruptcy), gagal bayar (failure to pay), dan restrukturisasi utang (restructuring) — didefinisikan ketat oleh ISDA agar tidak bisa diperdebatkan.",
        "Penyelesaian (settlement) ada dua cara. Physical settlement: pembeli menyerahkan obligasi defaulted ke penjual dan menerima nilai notional penuh. Cash settlement (kini dominan): penjual membayar selisih notional dikurangi nilai recovery — mis. notional Rp100 miliar, obligasi tersisa 40% → payout Rp60 miliar. Mekanisme lelang ISDA menentukan harga recovery secara transparan.",
        "Kepribadiannya: CDS itu seperti 'polis asuransi yang diperdagangkan di pasar'. Premi (spread) bergerak setiap hari mengikuti persepsi pasar atas kesehatan reference entity. Perusahaan yang kabar buruknya muncul di koran pagi — spread-nya melebar siangnya. Inilah yang membuat spread CDS menjadi termometer risiko kredit real-time.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: CDS hanya untuk spekulan",
        type: "pitfall",
        body: "Mitos: 'CDS itu instrumen spekulasi, bank sehat tidak memakainya.' Yang benar: pengguna terbesar CDS justru bank dan manajer aset untuk hedging — mengurangi RWA dan konsentrasi risiko tanpa menjual aset. Spekulasi ada, tetapi fungsi lindung nilainya nyata dan diawasi regulator.",
      },
      hints: [
        "Ingat urutannya: buyer BAYAR premi, seller BAYAR payout. Buyer = yang takut default.",
        "1 bp = 0,01% = Rp1 juta per tahun untuk notional Rp10 miliar.",
      ],
      reference: "Buyer bayar premi rutin; seller bayar besar sekali saat credit event.",
    },
    {
      id: "spread",
      eyebrow: "Langkah 3 · Konsep",
      title: "Spread CDS: harga risiko dalam basis poin",
      prose: [
        "Spread CDS adalah premi tahunan yang dinyatakan dalam basis poin dari notional. Spread 150 bp pada notional Rp100 miliar = premi Rp1,5 miliar per tahun (dibayar Rp375 juta per triwulan). Angka ini BUKAN bunga — ia murni harga risiko gagal bayar. Makin berisiko reference entity, makin lebar spread-nya.",
        "Hubungan ke PD dan LGD bersifat intuitif: secara kasar, spread tahunan ≈ PD × LGD. Logikanya: kerugian ekspektasi per tahun per rupiah eksposur adalah PD × LGD, dan premi wajar harus menutup kerugian ekspektasi itu. Contoh: PD 2% per tahun, LGD 60% → spread wajar ≈ 0,02 × 0,60 = 0,012 = 120 bp. Inilah jembatan antara model risiko bank (PD/LGD) dan harga pasar.",
        "Rumus lengkapnya memakai hazard rate dan diskonto, tetapi intuisi PD × LGD sudah membawa 90% pemahaman. Konsekuensinya kuat: bila PD internal bank-mu 2% tetapi pasar mematok spread 300 bp (tersirat PD 5%), salah satu dari keduanya salah — dan analis yang baik menyelidiki selisihnya, bukan mengabaikannya. Inilah gunanya spread sebagai validasi independen.",
        "Cara membaca figur: tiga batang untuk PD 1%, 2%, 5% dengan LGD 60% yang sama. Interpretasi: hubungan spread–PD linier — debitur 5x lebih berisiko membayar premi 5x lipat, tidak ada diskon volume dalam harga risiko. Perhatikan juga skalanya: beda PD 4 poin berarti beda premi 240 bp — ratusan juta rupiah per tahun untuk notional Rp100 miliar.",
      ],
      formula: String.raw`s_{\text{CDS}} \approx \text{PD} \times \text{LGD}`,
      formulaNote: "s = spread tahunan (desimal); PD = probability of default tahunan; LGD = loss given default (fraksi). Contoh: PD 2%, LGD 60% → s ≈ 0,012 = 120 bp. Interpretasi: premi wajar menutup kerugian ekspektasi per tahun.",
      figure: {
        svg: FIG_SPREAD_PD,
        alt: "Spread CDS naik linier terhadap PD.",
        caption: "Spread adalah harga risiko: PD naik, premi naik proporsional.",
      },
      tasks: [],
      note: {
        title: "💡 Tips: implied PD dari spread",
        body: "Balik rumusnya: PD_tersirat ≈ spread / LGD. Spread 300 bp dengan LGD 60% → PD tersirat 5%. Bandingkan dengan PD model internalmu — selisih besar = sinyal untuk investigasi, entah modelmu atau pasar yang salah.",
      },
      hints: [
        "bp ke desimal: bagi 10.000. 150 bp = 0,015 = 1,5% per tahun.",
        "Premi triwulanan = spread × notional / 4.",
      ],
      reference: "Spread ≈ PD × LGD. Harga pasar risiko kredit real-time.",
    },
    {
      id: "angka",
      eyebrow: "Langkah 4 · Konsep",
      title: "Contoh angka: Rp100 juta, 150 bp, 5 tahun",
      prose: [
        "Mari konkret. Bank membeli proteksi CDS: notional Rp100 juta, spread 150 bp, tenor 5 tahun, reference entity PT Semen Andalas. Premi tahunan = 1,5% × Rp100 juta = Rp1,5 juta, dibayar Rp375 ribu tiap triwulan. Selama 5 tahun tanpa default, total premi 'hangus' Rp7,5 juta — harga ketenangan.",
        "Skenario buruk: tahun ke-3 Andalas gagal bayar. Lelang ISDA menetapkan recovery 40% (obligasinya masih laku 40 sen per rupiah). Payout = notional × (1 − recovery) = Rp100 juta × 60% = Rp60 juta, dibayar sekaligus. Bank juga menghentikan pembayaran premi sejak credit event. Kerugian Rp60 juta di pinjaman dikompensasi payout Rp60 juta — posisi bank netral terhadap default.",
        "Skenario baik: 5 tahun berlalu tanpa credit event. Kontrak berakhir, bank telah membayar Rp7,5 juta premi dan tidak menerima apa-apa. Rugi? Tidak — seperti asuransi kebakaran rumah yang tidak terbakar: premi membeli kapasitas menanggung risiko, bukan lotre. Selama 5 tahun itu bank bisa mempertahankan nasabah besarnya tanpa melanggar limit konsentrasi.",
        "Cara membaca figur: batang-batang kecil = premi triwulanan Rp375 ribu yang mengalir rutin dari pembeli ke penjual; satu batang besar = payout Rp60 juta yang mengalir balik HANYA bila default. Interpretasi: profil arus kas CDS asimetris — banyak pembayaran kecil pasti, satu pembayaran besar kondisional. Asimetri inilah esensi asuransi.",
      ],
      formula: String.raw`\text{Payout} = N \times (1 - R)`,
      formulaNote: "N = notional; R = recovery rate (fraksi, dari lelang ISDA). Contoh: Rp100 jt × (1 − 0,40) = Rp60 jt. Interpretasi: penjual proteksi mengganti bagian yang hilang — bukan seluruh notional.",
      figure: {
        svg: FIG_CASHFLOW,
        alt: "Arus kas premi rutin vs payout kondisional.",
        caption: "Asimetri CDS: premi kecil pasti, payout besar kondisional.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: payout = notional penuh",
        type: "pitfall",
        body: "Mitos: 'Kalau default, penjual CDS mengganti seluruh notional.' Yang benar: payout = notional × (1 − recovery). Bila recovery 40%, payout hanya 60% dari notional — karena 40%-nya masih bisa ditagih dari debitur lewat proses recovery. CDS menutup LGD, bukan EAD.",
      },
      hints: [
        "Premi berhenti saat credit event — jangan hitung premi setelah default.",
        "Recovery ditentukan lelang, bukan tebakan — analis memakai estimasi LGD historis.",
      ],
      reference: "Premi 150 bp × Rp100 jt = Rp1,5 jt/thn. Payout = N × (1 − R).",
    },
    {
      id: "kegunaan",
      eyebrow: "Langkah 5 · Konsep",
      title: "Untuk apa CDS dipakai — dan risikonya sendiri",
      prose: [
        "Kegunaan pertama: hedging oleh bank. Bank dengan proteksi CDS atas pinjamannya mendapat keringanan modal (RWA turun) karena risiko kreditnya dialihkan ke penjual proteksi — tanpa menjual pinjaman dan merusak hubungan nasabah. Inilah kasus Bank Nusantara di cerita pembuka: konsentrasi turun di atas kertas modal, hubungan tetap utuh.",
        "Kegunaan kedua: mengambil posisi atas risiko kredit tanpa memiliki obligasinya. Manajer aset yang yakin sebuah perusahaan akan memburuk bisa MEMBELI proteksi (bayar premi kecil) sebagai taruhan — atau MENJUAL proteksi untuk mengoleksi premi atas perusahaan yang diyakini sehat. CDS membuat risiko kredit bisa di-short, sesuatu yang sulit dilakukan dengan obligasi fisik.",
        "Kegunaan ketiga: synthetic CDO. Alih-alih membeli ratusan obligasi fisik, investor menjual proteksi atas ratusan reference entity lewat CDS — menciptakan eksposur kredit sintetis. Struktur ini ringkas disebut saja: ia memindahkan risiko kredit dalam jumlah besar dengan cepat, dan menjadi terkenal saat krisis 2008 karena bertumpuknya risiko yang tidak transparan.",
        "Risiko CDS itu sendiri: counterparty risk. Proteksimu hanya sekuat penjual proteksinya — bila dealer yang menjual proteksi ikut gagal di tengah krisis (persis saat kamu butuh payout), proteksinya lenyap. Inilah pelajaran 2008: risiko yang 'dialihkan' ternyata menumpuk di segelintir penjual proteksi. Penilaian risiko counterparty pada derivatif dibahas lewat konsep CVA (credit valuation adjustment): nilai wajar derivatif dikoreksi turun sebesar potensi kerugian bila lawan transaksi gagal — CDS pun tidak imun.",
      ],
      tasks: [],
      note: {
        title: "💡 Tips: double default",
        body: "Skenario terburuk = reference entity DAN penjual proteksi gagal bersamaan (korelasi wrong-way: keduanya jatuh karena krisis yang sama). Analis yang baik tidak hanya menilai PD reference entity, tetapi juga PD penjual proteksi dan korelasi keduanya.",
      },
      hints: [
        "Hedging sempurna butuh: penjual proteksi sehat + korelasi rendah dengannya.",
        "Regulator kini mewajibkan collateral/margin untuk CDS antar-dealer — mengurangi risiko ini.",
      ],
      reference: "Hedging, posisi kredit, CDO sintetis. Risiko: penjual proteksi bisa gagal.",
    },
    {
      id: "lab-premi",
      eyebrow: "Langkah 6 · Lab",
      title: "Kalkulator premi dan payout CDS",
      prose: [
        "Hitung premi tahunan dan payout untuk kontrak: notional Rp100 juta, spread 150 bp, recovery 40% bila default. Premi tahunan = spread(desimal) × notional. Payout = notional × (1 − recovery).",
        "Eksperimen: ubah spread menjadi 300 bp — premi berlipat dua, tetapi payout TETAP Rp60 juta (payout tidak tergantung spread!). Renungkan: spread menentukan harga proteksi, bukan besarnya ganti rugi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `premi_annual` (Rp per tahun)" },
        { id: "t2", text: "Hitung `payout` (Rp bila default)" },
        { id: "t3", text: "Jalankan dan pastikan keduanya tercetak" },
      ],
      expected: "Premi tahunan: Rp1,500,000\nPayout bila default: Rp60,000,000",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Spread 150 bp dari Rp100 juta = Rp150 juta?” Salah menaruh koma: 150 bp = 1,5%, bukan 150%. Premi = 0,015 × 100.000.000 = Rp1,5 juta. Selalu konversi bp ke desimal dulu (bagi 10.000).",
      },
      hints: [
        "spread_decimal = spread_bps / 10000.",
        "Format ribuan: f\"Rp{premi_annual:,.0f}\".",
      ],
      code: {
        starter: "# Data kontrak. JANGAN UBAH.\nnotional = 100_000_000  # Rp100 juta\nspread_bps = 150\nrecovery = 0.40\n\n# TULIS KODEMU: premi tahunan (Rp) dan payout (Rp)\npremi_annual =\npayout =\nprint(f\"Premi tahunan: Rp{premi_annual:,.0f}\")\nprint(f\"Payout bila default: Rp{payout:,.0f}\")\n",
        lockLines: 4,
        solution: "# Data kontrak. JANGAN UBAH.\nnotional = 100_000_000  # Rp100 juta\nspread_bps = 150\nrecovery = 0.40\n\n# TULIS KODEMU: premi tahunan (Rp) dan payout (Rp)\npremi_annual = spread_bps / 10000 * notional\npayout = notional * (1 - recovery)\nprint(f\"Premi tahunan: Rp{premi_annual:,.0f}\")\nprint(f\"Payout bila default: Rp{payout:,.0f}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "premi_annual = 1,5 jt", msg: "150 bp = 1,5% × Rp100 jt.", name: "premi_annual", value: 1500000, tol: 1 },
          { kind: "equal", task: "t2", label: "payout = 60 jt", msg: "Rp100 jt × (1 − 0,40).", name: "payout", value: 60000000, tol: 1 },
          { kind: "stdout_matches", task: "t3", label: "Output tercetak", msg: "Dua baris output.", pattern: "Premi tahunan: Rp1,500,000" }
        ],
      },
      reference: "Premi = spread × notional. Payout = N × (1 − R).",
    },
    {
      id: "lab-spread",
      eyebrow: "Langkah 7 · Lab",
      title: "Spread wajar dari PD dan LGD",
      prose: [
        "Hitung spread wajar (bp) untuk PD = 1%, 2%, 5% dengan LGD 60%: spread_bps = PD × LGD × 10000. Perhatikan kelinieran — dan betapa mahalnya premi untuk debitur berisiko.",
        "Eksperimen: turunkan LGD ke 40% (agunan bagus) — spread ikut turun sepertiganya. Inilah argumen kuantitatif mengapa agunan menurunkan biaya proteksi: bukan karena PD berubah, tetapi karena LGD-nya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `spreads` (list, dalam bp) untuk tiap PD" },
        { id: "t2", text: "Jalankan dan pastikan tabelnya tercetak" },
      ],
      expected: "PD 1% -> spread 60 bp\nPD 2% -> spread 120 bp\nPD 5% -> spread 300 bp",
      note: {
        title: "Intuisi",
        body: "Rumus ini menjelaskan mengapa obligasi perusahaan kecil membayar kupon lebih tinggi: kupon ≈ risk-free + spread, dan spread ≈ PD × LGD. Seluruh pricing kredit bermuara ke dua angka ini.",
      },
      hints: [
        "PD 1% sebagai desimal = 0.01.",
        "spread_bps = pd * lgd * 10000.",
      ],
      code: {
        starter: "# PD tahunan dan LGD. JANGAN UBAH.\npd_list = [0.01, 0.02, 0.05]\nlgd = 0.60\n\n# TULIS KODEMU: spread wajar tiap PD (bp)\nspreads =\nfor pd, s in zip(pd_list, spreads):\n    print(f\"PD {pd:.0%} -> spread {s:.0f} bp\")\n",
        lockLines: 3,
        solution: "# PD tahunan dan LGD. JANGAN UBAH.\npd_list = [0.01, 0.02, 0.05]\nlgd = 0.60\n\n# TULIS KODEMU: spread wajar tiap PD (bp)\nspreads = [pd * lgd * 10000 for pd in pd_list]\nfor pd, s in zip(pd_list, spreads):\n    print(f\"PD {pd:.0%} -> spread {s:.0f} bp\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "PD 1% → 60 bp", msg: "0,01 × 0,60 × 10000.", pattern: "PD 1% -> spread 60 bp" },
          { kind: "stdout_matches", task: "t2", label: "PD 5% → 300 bp", msg: "0,05 × 0,60 × 10000.", pattern: "PD 5% -> spread 300 bp" }
        ],
      },
      reference: "Spread wajar (bp) = PD × LGD × 10000.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan memakai CDS, kapan tidak",
      prose: [
        "Satu: konsentrasi risiko tinggi tetapi hubungan nasabah harus dijaga → beli proteksi CDS (risiko pindah, pinjaman tetap). Dua: butuh eksposur kredit tanpa membeli obligasi → jual proteksi CDS (koleksi premi, siap tanggung payout). Tiga: view negatif atas perusahaan tanpa memegang obligasinya → beli proteksi sebagai posisi short kredit.",
        "Empat: penjual proteksi terkonsentrasi di satu dealer → JANGAN tambah; diversifikasi counterparty atau minta collateral. Lima: tujuan spekulasi jangka pendek atas pergerakan spread → CDS (likuid, tanpa funding obligasi), tetapi sadari basis risk: spread CDS dan spread obligasi bisa menyimpang.",
        "Aturan praktis 10 detik: mau pindahkan risiko TANPA pindahkan aset → CDS; mau pindahkan asetnya sekalian → jual pinjaman/obligasi; ragu pada penjual proteksi → kurangi notional atau tambah collateral.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "CDS menjawab pertanyaan 'siapa menanggung kerugian bila default?' — bukan 'siapa memiliki pinjaman?'. Setiap kali dua pertanyaan itu jawabannya berbeda, CDS (atau saudaranya) sedang bekerja.",
      },
      reference: "Pindah risiko tanpa pindah aset → CDS. Ragu counterparty → collateral.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Proteksi yang menguap saat dibutuhkan",
      prose: [
        "Bank Nusantara membeli proteksi CDS Rp100 miliar atas PT Semen Andalas dari Dealer X, spread 150 bp. Dua tahun kemudian krisis sektor properti: Andalas gagal bayar (credit event, recovery 40% → payout seharusnya Rp60 miliar). Namun di minggu yang sama Dealer X — yang ternyata menjual proteksi ke puluhan bank atas nama yang sama — ikut kolaps dan tidak bisa membayar.",
        "Pertanyaan: (a) Berapa kerugian bersih bank? (b) Di mana kesalahan analisisnya? (c) Bagaimana seharusnya distruktur? Pembahasan: (a) Bank kehilangan Rp60 miliar di pinjaman (setelah recovery) DAN tidak menerima payout — proteksi Rp3 miliar premi yang dibayar selama 2 tahun hangus sia-sia. (b) Analisis hanya menilai PD Andalas, tidak menilai PD Dealer X dan korelasinya (wrong-way: krisis yang sama menjatuhkan keduanya). (c) Bagi proteksi ke beberapa dealer, wajibkan collateral harian (margin), atau beli proteksi dari penjual dengan korelasi rendah terhadap reference entity.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kasus ini adalah miniatur krisis 2008: risiko kredit 'dialihkan' lewat CDS ternyata menumpuk di segelintir penjual proteksi. Pelajaran abadinya: transfer risiko tidak menghilangkan risiko — ia memindahkannya, dan analis harus mengikuti ke mana ia pindah.",
      },
      reference: "Ikuti ke mana risiko pindah — bukan hanya dari siapa ia pergi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — CDS adalah soal memisahkan risiko dari kepemilikan.",
      ],
      tasks: [],
      summary: [
        "CDS: pembeli bayar premi rutin (bp × notional), penjual bayar payout sekali saat credit event.",
        "Spread CDS ≈ PD × LGD — harga pasar risiko kredit real-time; 150 bp = 1,5%/tahun.",
        "Payout = notional × (1 − recovery); premi Rp1,5 jt/thn vs payout Rp60 jt untuk contoh Rp100 jt.",
        "Kegunaan: hedging bank (RWA turun, nasabah tetap), posisi kredit, CDO sintetis.",
        "Risiko sendiri: counterparty — proteksi hanya sekuat penjualnya; waspadai double default.",
      ],
      next: { label: "CR29 — Sekuritisasi", href: "/learn/cr29-sekuritisasi" },
      quiz: [
        {
          q: "Bank membeli proteksi CDS Rp100 miliar, spread 150 bp. Berapa premi per triwulan?",
          options: [
            { text: "Rp375 juta", why: "Benar: 1,5% × Rp100 M = Rp1,5 M per tahun, dibagi 4.", correct: true },
            { text: "Rp1,5 miliar", why: "Itu premi setahun penuh, bukan per triwulan." },
            { text: "Rp150 juta", why: "Kamu memakai 150 bp sebagai 0,15% — seharusnya 1,5%." },
            { text: "Rp3,75 miliar", why: "Kebesaran 10x — cek konversi bp ke desimal." }
          ],
        },
        {
          q: "PD 2%, LGD 60%. Spread CDS wajar?",
          options: [
            { text: "120 bp", why: "Benar: 0,02 × 0,60 = 0,012 = 120 bp.", correct: true },
            { text: "80 bp", why: "Itu bila LGD 40% — cek LGD yang dipakai." },
            { text: "200 bp", why: "Itu spread bila LGD 100%." },
            { text: "12 bp", why: "Kurang satu nol — 0,012 = 120 bp, bukan 12." }
          ],
        },
        {
          q: "Default terjadi, recovery 40%, notional Rp100 juta. Payout CDS?",
          options: [
            { text: "Rp60 juta", why: "Benar: Rp100 jt × (1 − 0,40).", correct: true },
            { text: "Rp100 juta", why: "Itu bila recovery 0% — sebagian masih bisa ditagih." },
            { text: "Rp40 juta", why: "Itu nilai recovery-nya, bukan payout-nya." },
            { text: "Rp0 — premi hangus", why: "Premi memang hangus, tetapi payout tetap dibayar." }
          ],
        },
        {
          q: "Mengapa bank memilih CDS daripada menjual pinjamannya?",
          options: [
            { text: "Risiko pindah tanpa merusak hubungan nasabah; RWA turun", why: "Benar: kepemilikan tetap, risiko dialihkan.", correct: true },
            { text: "CDS selalu lebih murah dari menjual pinjaman", why: "Tidak selalu — tergantung spread pasar vs diskonto penjualan." },
            { text: "Menjual pinjaman dilarang regulator", why: "Tidak dilarang — hanya merusak hubungan komersial." },
            { text: "CDS menghilangkan risiko sepenuhnya", why: "Tidak — ada counterparty risk penjual proteksi." }
          ],
        },
        {
          q: "Risiko terbesar dari strategi hedging CDS?",
          options: [
            { text: "Penjual proteksi gagal tepat saat payout dibutuhkan (double default)", why: "Benar: proteksi hanya sekuat penjualnya.", correct: true },
            { text: "Premi terlalu mahal", why: "Premi mahal mengurangi profit, bukan risiko terbesar." },
            { text: "Notional terlalu kecil", why: "Notional kecil = proteksi kurang, bukan risiko strategi." },
            { text: "Tenor terlalu panjang", why: "Tenor panjang menambah biaya, bukan risiko utama." }
          ],
        }
      ],
      reference: "Risiko pindah, aset tetap. Spread = harga. Penjual = titik lemah.",
    },
  ],
};
