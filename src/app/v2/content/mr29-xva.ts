import type { V2Lesson } from "../lib/types";

const FIG_XVA = `<svg viewBox=\"0 0 560 360\" role=\"img\" aria-label=\"Waterfall penyesuaian XVA dan profil eksposur.">
<g font-family=\"var(--font-ui)\">
<text x=\"14\" y=\"24\" font-size=\"13\" fill=\"var(--chart-text)\" font-weight=\"bold\">Waterfall: dari harga bebas risiko ke harga XVA</text>
<line x1=\"60\" y1=\"300\" x2=\"520\" y2=\"300\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<text x=\"290\" y=\"326\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Komponen penyesuaian →</text>
<text x=\"22\" y=\"170\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" transform=\"rotate(-90 22 170)\">Nilai (juta Rp) →</text>
<rect x=\"90\" y=\"60\" width=\"80\" height=\"240\" fill=\"var(--c1)\" opacity=\"0.85\"/>
<text x=\"130\" y=\"348\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Bebas risiko</text>
<text x=\"130\" y=\"52\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">4.200</text>
<rect x=\"200\" y=\"297\" width=\"80\" height=\"3\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"240\" y=\"348\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">− CVA</text>
<text x=\"240\" y=\"289\" font-size=\"10\" fill=\"var(--c4)\" text-anchor=\"middle\">3,88</text>
<rect x=\"310\" y=\"292\" width=\"80\" height=\"8\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"350\" y=\"348\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">− FVA</text>
<text x=\"350\" y=\"284\" font-size=\"10\" fill=\"var(--c4)\" text-anchor=\"middle\">12,50</text>
<rect x=\"420\" y=\"60\" width=\"80\" height=\"223\" fill=\"var(--c2)\" opacity=\"0.85\"/>
<text x=\"460\" y=\"348\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Harga XVA</text>
<text x=\"460\" y=\"52\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">4.183,6</text>
<text x=\"90\" y=\"200\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\" transform=\"rotate(-90 90 200)\">4200</text>
<text x=\"14\" y=\"380\" font-size=\"10\" fill=\"var(--chart-text)\">Skala tidak proporsional: CVA &amp; FVA dipertebal agar terlihat (aslinya &lt; 0,5%).</text>
</g>
</svg>`;

export const mr29: V2Lesson = {
  slug: "mr29-xva",
  track: "Market Risk",
  module: "Risiko Counterparty",
  title: "MR29 — XVA: CVA, FVA, dan Biaya Tersembunyi Derivatif",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Harga Rp4,2 miliar yang bukan harga",
      prose: [
        "Rabu pagi, dealing room sebuah bank di Jakarta. Dealer derivatif, Yoga, baru saja menyepakati interest rate swap 3 tahun dengan sebuah korporat: nilai wajar kontrak menurut model — Rp4.200 juta. Ia menelepon desk XVA untuk 'cap' harga final ke nasabah. Jawaban yang kembali: 'Quote Rp4.183,6 juta.' Selisih Rp16,4 juta. Yoga mengernyit: 'Spread kita kan cuma Rp5 juta. Sisanya apa?'",
        "'Sisanya adalah kejujuran,' jawab senior XVA itu. 'Rp3,88 juta untuk kemungkinan korporat itu gagal bayar saat kita untung — CVA. Rp12,5 juta untuk biaya mendanai posisi ini tiga tahun — FVA. Modelmu mengasumsikan lawan yang abadi dan dana yang gratis. Keduanya tidak ada di dunia nyata.'",
        "Twist-nya: harga derivatif punya dua lapis — lapis 'matematika' (model bebas risiko) dan lapis 'kenyataan' (XVA). Trader yang hanya menguasai lapis pertama akan selalu kecewa: labanya 'bocor' ke penyesuaian yang tidak ia perhitungkan. Lesson ini mengajarkan lapis kedua: kenapa nilai derivatif disesuaikan, komponen-komponennya (CVA, DVA, FVA, KVA), dan cara menghitung CVA dari data eksposur dan probabilitas default.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "XVA adalah tempat market risk bertemu credit risk: harga derivatif (market) dikoreksi oleh risiko gagal bayar lawan (kredit) dan biaya pendanaan (likuiditas). Analis yang memahami XVA memahami bahwa 'nilai' selalu relatif terhadap SIAPA lawanmu dan BAGAIMANA kamu mendanainya.",
      },
      reference: "Harga = model bebas risiko − biaya kenyataan (XVA).",
    },
    {
      id: "cva",
      eyebrow: "Langkah 2 · Konsep",
      title: "CVA: saat lawanmu bisa gagal bayar",
      prose: [
        "Bayangkan swap-mu untung Rp120 juta (mark-to-market positif — lawan berutang padamu secara ekonomi). Besok lawan bangkrut dan hanya membayar 40% kewajibannya. Kamu tidak rugi Rp120 juta penuh — kamu rugi 60% darinya (LGD, loss given default), yaitu Rp72 juta. CVA (Credit Valuation Adjustment) adalah nilai SEKARANG dari kerugian yang diharapkan ini, diakumulasikan sepanjang umur kontrak.",
        "Tiga bahan CVA: (1) Expected Exposure (EE) — berapa untungmu dari kontrak di tiap titik waktu ke depan (hanya sisi positif yang dihitung; saat kontrak merugi, bukan lawan yang berutang padamu). (2) Probabilitas default marginal lawan per periode — peluang ia bangkrut TEPAT di periode itu. (3) LGD — berapa persen yang hilang bila ia bangkrut. Kalikan ketiganya per periode, diskontokan ke hari ini, jumlahkan — itulah CVA.",
        "Cerminnya adalah DVA (Debit Valuation Adjustment): penyesuaian untuk risiko gagal bayar DIRIMU SENDIRI. Saat kreditmu memburuk, kewajiban derivatifmu 'berkurang nilainya' (kamu mungkin tidak membayar penuh) — secara akuntansi ini keuntungan. Kontroversial? Sangat. Bank mencatat 'laba' saat peringkat kreditnya turun — fenomena yang membuat banyak analis mengernyit, tetapi itulah simetri akuntansi nilai wajar.",
        "Kepribadian konsep ini: CVA adalah 'asuransi yang tidak kamu beli tetapi tetap kamu bayar'. Tidak ada premi yang keluar — tetapi nilai kontrakmu dipotong seolah kamu membayar proteksi atas risiko lawan. Mengabaikan CVA = mengklaim kamu kebal terhadap kebangkrutan lawan.",
        "🚨 Mitos: 'CVA hanya untuk bank besar dengan desk XVA.' Yang benar: setiap kontrak derivatif bilateral (tanpa central clearing) mengandung CVA — bank kecil yang tidak menghitungnya hanya berarti tidak TAHU berapa yang seharusnya dipotong, bukan berarti potongannya nol.",
        "🚨 Mitos: 'Lawan kita BUMN/korporat besar, tidak mungkin default.' Yang benar: CVA memakai probabilitas, bukan kepastian — 'hampir tidak mungkin' × eksposur raksasa tetap = angka yang material. Dan 2008 mengajarkan bahwa 'tidak mungkin default' adalah kalimat paling mahal dalam keuangan.",
      ],
      tasks: [],
      formula: String.raw`\text{CVA} = LGD \times \sum_{t=1}^{T} EE_t \cdot PD^{\text{marg}}_t \cdot DF_t`,
      formulaNote: "LGD = loss given default (fraksi yang hilang bila lawan bangkrut, mis. 0,6); EE_t = expected exposure pada tahun t (rata-rata nilai positif kontrak, juta Rp); PD^marg_t = probabilitas lawan bangkrut TEPAT di tahun t; DF_t = discount factor (nilai waktu uang); T = tenor. Interpretasi: untuk tiap tahun, kalikan 'berapa untungku' × 'peluang ia bangkrut tahun itu' × 'berapa yang hilang' × 'diskon waktu' — jumlahkan. Contoh angka ada di lab lesson ini.",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "CVA membesar bila: eksposur besar, lawan berisiko (PD tinggi), tenor panjang, atau LGD tinggi. Empat tuas ini adalah bahasa negosiasi: 'mau CVA lebih kecil? Perpendek tenor, minta agunan (CSA), atau pilih lawan yang lebih sehat.'",
      },
      reference: "CVA = harga risiko lawan; DVA = cerminnya (kontroversial).",
    },
    {
      id: "fva",
      eyebrow: "Langkah 3 · Konsep",
      title: "FVA & KVA: biaya dana dan biaya modal",
      prose: [
        "FVA (Funding Valuation Adjustment): derivatif yang tidak dijaminkan (uncollateralized) harus didanai. Saat kontrak merugikanmu, kamu memposting kas/agunan — kas itu ada biayanya (kamu meminjam atau kehilangan kesempatan). Saat kontrak menguntungkanmu tetapi lawan tidak memposting agunan, kamu 'mendapat' pendanaan. FVA adalah nilai bersih biaya pendanaan ini sepanjang umur kontrak. Intuisi sederhananya: dana tidak gratis — dan derivatif mengonsumsi dana.",
        "KVA (Capital Valuation Adjustment): regulator mewajibkan bank memegang modal terhadap eksposur derivatif (risiko counterparty). Modal itu mahal (pemegang saham menuntut return) — KVA mengkapitalisasi biaya modal tersebut ke dalam harga. Inilah penyesuaian yang paling 'politis': ia menghubungkan pricing desk dengan persyaratan modal bank.",
        "Hubungan ketiganya dengan limit dan pricing: CVA mengurangi nilai kontrak (kamu membayar risiko lawan); FVA mengurangi lagi (kamu membayar biaya dana); KVA mengurangi lagi (kamu membayar biaya modal). Harga final ke nasabah = nilai bebas risiko − CVA − FVA − KVA (± DVA). Desk yang melakukan pricing TANPA ketiganya akan terlihat 'murah' dan memenangkan banyak deal — lalu desk XVA mencatat kerugian penyesuaian setiap kuartal. Kemenangan deal yang merugi = kekalahan yang tertunda.",
        "🚨 Mitos: 'XVA hanya akuntansi, tidak memengaruhi kas.' Yang benar: CVA/DVA memang non-kas sampai default terjadi — tetapi FVA MENGANDUNG biaya pendanaan nyata, dan KVA memengaruhi berapa modal yang harus disisihkan (membatasi bisnis lain). 'Hanya akuntansi' adalah cara cepat meremehkan biaya riil.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "XVA mengubah cara membaca P&L trading desk: laba 'model' minus XVA = laba 'ekonomi'. Desk yang banggga dengan P&L model tetapi merah setelah XVA sedang mensubsidi nasabahnya — dan subsidi itu dibayar pemegang saham.",
      },
      reference: "Harga final = bebas risiko − CVA − FVA − KVA.",
    },
    {
      id: "figure-xva",
      eyebrow: "Langkah 4 · Visual",
      title: "Membaca waterfall XVA",
      prose: [
        "Diagram waterfall di bawah memvisualkan perjalanan dari Rp4.200 juta (nilai model bebas risiko) ke Rp4.183,6 juta (harga XVA). Perhatikan proporsinya: CVA (Rp3,88 juta) dan FVA (Rp12,5 juta) tampak sebagai irisan tipis — dalam contoh ini total penyesuaian hanya ~0,4%. Untuk kontrak 3 tahun dengan korporat sehat, memang sekecil ini. Tetapi untuk tenor 10 tahun dengan lawan berisiko, potongannya bisa 5-10% — dan di sanalah deal dimenangkan atau dikalahkan.",
      ],
      figure: {
        svg: FIG_XVA,
        alt: "Diagram waterfall penyesuaian XVA dari nilai bebas risiko ke harga final.",
        caption: "Cara membaca: batang pertama = nilai model bebas risiko (Rp4.200 juta); irisan merah = pengurang (CVA, FVA); batang terakhir = harga final XVA (Rp4.183,6 juta). Interpretasi: penyesuaian kecil secara relatif tetapi PASTI — ia adalah 'pajak kenyataan' atas setiap kontrak bilateral. Catatan skala: irisan dipertebal agar terlihat; nilai sebenarnya < 0,5%.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca 'CVA kecil = tidak penting'. CVA kecil pada kontrak sehat justru BUKTI sistem bekerja: ia kecil KARENA lawan sehat dan tenor pendek. Analis yang mengabaikan CVA 'karena kecil' akan buta saat bertemu kontrak yang CVA-nya besar — tepat saat ia paling dibutuhkan.",
      },
      reference: "Kecil tapi pasti: pajak kenyataan tiap kontrak bilateral.",
    },
    {
      id: "lab-cva",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung CVA dari eksposur & PD",
      prose: [
        "Implementasikan rumus CVA diskrit: dari PD kumulatif lawan, turunkan PD marginal per tahun (PD tahun t = kumulatif t − kumulatif t−1); hitung discount factor 5%; kalikan LGD × Σ(EE × PD_marg × DF). Data sudah terkunci: EE [120, 90, 50] juta, PD kumulatif [2%, 5%, 9%], LGD 60%, nilai bebas risiko Rp4.200 juta.",
        "Hasil yang benar: CVA ≈ Rp3,88 juta; nilai setelah XVA ≈ Rp4.196,12 juta. Perhatikan urutan: PD marginal BUKAN PD kumulatif — kesalahan paling umum adalah memakai 2%, 5%, 9% langsung (itu menghitung risiko yang sama berkali-kali). Eksplorasi: naikkan PD kumulatif tahun 3 menjadi 15% — berapa CVA barunya? Turunkan LGD menjadi 0,4 (ada agunan parsial) — seberapa besar penghematan?",
      ],
      tasks: [
        { id: "t1", text: "Turunkan PD marginal & discount factor, hitung CVA" },
        { id: "t2", text: "Hitung nilai setelah XVA, cetak keduanya" },
      ],
      expected: "CVA=3.88 juta\nNilai setelah XVA=4196.12 juta",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Perhatikan kontribusi per tahun: tahun 1 memberi porsi terbesar meski PD-nya terkecil — karena EE terbesar dan diskon terkecil. Pelajaran: CVA sensitif pada BENTUK profil eksposur, bukan hanya levelnya. Kontrak yang eksposurnya menumpuk di awal 'lebih mahal' dari yang terlihat.",
      },
      hints: [
        "PD_marg = [PD_kum[0]] + [PD_kum[i]-PD_kum[i-1] untuk i=1,2].",
        "DF_t = 1/(1+0.05)**t untuk t=1,2,3.",
        "cva = LGD * sum(ee*pd*df untuk tiap tahun).",
      ],
      code: {
        starter: "# Data kontrak — JANGAN UBAH.\nEE = [120.0, 90.0, 50.0]      # expected exposure per tahun (juta Rp)\nPD_kum = [0.02, 0.05, 0.09]     # PD kumulatif lawan\nLGD = 0.6\nr = 0.05\nnilai_bersih = 4200.0\n\n# TULIS KODEMU: PD marginal, discount factor, CVA, nilai setelah XVA\nPD_marg = \nDF = \ncva = \nnilai_xva = \nprint(f\"CVA={cva:.2f} juta\")\nprint(f\"Nilai setelah XVA={nilai_xva:.2f} juta\")\n",
        lockLines: 6,
        solution: "# Data kontrak — JANGAN UBAH.\nEE = [120.0, 90.0, 50.0]      # expected exposure per tahun (juta Rp)\nPD_kum = [0.02, 0.05, 0.09]     # PD kumulatif lawan\nLGD = 0.6\nr = 0.05\nnilai_bersih = 4200.0\n\n# TULIS KODEMU: PD marginal, discount factor, CVA, nilai setelah XVA\nPD_marg = [PD_kum[0]] + [PD_kum[i] - PD_kum[i - 1] for i in range(1, 3)]\nDF = [1 / (1 + r) ** t for t in (1, 2, 3)]\ncva = LGD * sum(ee * pd * df for ee, pd, df in zip(EE, PD_marg, DF))\nnilai_xva = nilai_bersih - cva\nprint(f\"CVA={cva:.2f} juta\")\nprint(f\"Nilai setelah XVA={nilai_xva:.2f} juta\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "cva", value: 3.8774, tol: 0.01, label: "CVA ≈ 3,88 juta", msg: "0,6 × (120×0,02×0,9524 + 90×0,03×0,9070 + 50×0,04×0,8638) = 3,8774." },
          { kind: "equal", task: "t2", name: "nilai_xva", value: 4196.12, tol: 0.05, label: "Nilai setelah XVA ≈ 4196,12", msg: "4200 − 3,8774 = 4196,12." },
          { kind: "stdout_matches", task: "t2", label: "Baris CVA tercetak", msg: "Format: 'CVA=3.88 juta'.", pattern: "CVA=3.88 juta" },
          { kind: "uses", task: "t1", label: "Memakai PD marginal", msg: "PD marginal diturunkan dari PD kumulatif.", token: "PD_marg" },
        ],
      },
      reference: "PD marginal, bukan kumulatif — kesalahan klasik CVA.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Empat kontrak, empat perlakuan XVA",
      prose: [
        "Skenario satu — swap dengan bank besar, ada CSA (perjanjian agunan harian): CVA MINIMAL. Agunan harian membuat eksposur bersih mendekati nol — tidak ada yang perlu disesuaikan banyak. Pelajaran: CSA adalah 'obat' CVA paling ampuh; negosiasikan CSA sebelum negosiasi harga.",
        "Skenario dua — swap 10 tahun dengan korporat tanpa agunan: CVA BESAR. Tenor panjang × tanpa CSA × PD korporat = potongan material. Pricing harus memuat CVA penuh; bila nasabah menolak harga, tolak deal-nya — bukan potong CVA-nya. Memotong CVA agar deal 'masuk' = memberi subsidi risiko.",
        "Skenario tiga — portofolio derivatif dengan netting agreement: CVA PORTOFOLIO, bukan per kontrak. Netting memungkinkan untung-rugi antar kontrak saling hapus — eksposur bersih jauh lebih kecil dari jumlah eksposur kotor. Menghitung CVA per kontrak tanpa netting = membayar pajak atas risiko yang tidak ada.",
        "Skenario empat — lawan sovereign (negara) dengan PD nyaris nol: CVA KECIL TAPI ADA. 'Nyaris nol' bukan nol — dan 2008-2012 (krisis utang Eropa) mengajarkan bahwa sovereign bisa gagal bayar. CVA kecil adalah pengakuan jujur, bukan pembulatan ke nol.",
        "Aturan praktis 10 detik: (1) ada CSA? ya → CVA kecil; (2) tenor × PD × eksposur — ketiganya besar? ya → hitung serius; (3) ada netting? ya → hitung di level portofolio; (4) harga final = model − CVA − FVA − KVA, selalu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung CVA per kontrak lalu menjumlahkan, padahal ada netting agreement. Ini seperti menghitung premi asuransi per jendela rumah padahal polisnya per rumah — overpricing yang membuatmu kalah tender dari bank yang menghitung dengan benar.",
      },
      reference: "CSA = obat CVA; netting = hitung portofolio; tenor×PD×EE = tuas.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Swap Rp8,4 miliar: quote yang jujur",
      prose: [
        "Bank 'Nusa' menawarkan interest rate swap 3 tahun ke korporat 'Mekar': nilai model bebas risiko Rp8.400 juta. Data: EE = [240, 180, 100] juta; PD kumulatif lawan = [2%, 5%, 9%]; LGD 60%; diskonto 5%. Korporat meminta 'tanpa agunan, seperti biasa'. Pertanyaan: (a) berapa CVA? (b) berapa quote final (asumsikan FVA+KVA = Rp15 juta)? (c) bila korporat menolak harga dan meminta potongan CVA — apa jawaban yang benar?",
        "Pembahasan: (a) PD marginal = [0,02; 0,03; 0,04]; DF = [0,9524; 0,9070; 0,8638]. CVA = 0,6 × (240×0,02×0,9524 + 180×0,03×0,9070 + 100×0,04×0,8638) = 0,6 × (4,5715 + 4,8978 + 3,4552) = 0,6 × 12,9245 = Rp7,75 juta. (b) Quote = 8.400 − 7,75 − 15 = Rp8.377,25 juta. (c) Jawaban benar: tolak memotong CVA — tawarkan alternatif yang MENGURANGI risiko riilnya: perpendek tenor, atau tanda tangani CSA dengan agunan parsial (yang otomatis mengecilkan CVA). Memotong CVA tanpa mengubah risiko = memberi diskon atas sesuatu yang tetap kamu tanggung.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan negosiasi yang benar: bukan 'harga bisa kurang?' melainkan 'risiko bisa kurang?'. Setiap konsesi harga harus dibayar dengan konsesi risiko (agunan, tenor, netting). Inilah cara desk XVA 'menjual' penyesuaian ke nasabah tanpa kehilangan deal.",
      },
      reference: "Konsesi harga = konsesi risiko. Tidak ada makan siang gratis di XVA.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5. Baca juga alasan opsi yang salah — di sanalah miskonsepsi bersembunyi.",
      ],
      tasks: [],
      summary: [
        "Harga derivatif dua lapis: model bebas risiko − XVA (pajak kenyataan). CVA = LGD × Σ(EE × PD marginal × DF) — harga risiko gagal bayar lawan; DVA = cerminnya (risiko gagal bayar diri sendiri, kontroversial).",
        "FVA = biaya pendanaan posisi; KVA = biaya modal regulator. Harga final = bebas risiko − CVA − FVA − KVA.",
        "CSA (agunan) adalah obat CVA paling ampuh; netting agreement mewajibkan hitung di level portofolio, bukan per kontrak.",
        "Kesalahan klasik: memakai PD kumulatif langsung (menghitung risiko berulang); mengabaikan CVA 'karena kecil' (buta saat ia besar).",
        "Negosiasi yang benar: setiap konsesi harga dibayar dengan konsesi risiko (tenor, agunan, netting) — bukan dengan memotong angka penyesuaian.",
      ],
      next: {
      label: "MR30 — P&L Attribution: Menjelaskan Setiap Rupiah",
      href: "/learn/mr30-pl-attribution",
    },
    quiz: [
        {
          q: "CVA memotong nilai kontrak derivatif. Bagi siapa potongan ini 'dikenakan'?",
          options: [
            { text: "Pemilik kontrak yang untung (mark-to-market positif) — ia menanggung risiko lawan gagal bayar", why: "Benar: CVA hanya relevan saat kamu untung (lawan berutang padamu); saat kamu rugi, bukan kamu yang berisiko.", correct: true },
            { text: "Kedua belah pihak sama besar", why: "Tidak simetris: pihak yang merugi tidak punya eksposur kredit ke lawan." },
            { text: "Pihak yang kalah (mark-to-market negatif)", why: "Terbalik: pihak yang merugi tidak menunggu pembayaran dari lawan." },
            { text: "Regulator, sebagai pajak transaksi", why: "CVA bukan pajak — ia penyesuaian nilai ekonomi, bukan setoran ke siapa pun." },
          ],
        },
        {
          q: "Dalam rumus CVA, apa yang terjadi bila expected exposure (EE) berlipat ganda?",
          options: [
            { text: "CVA berlipat ganda (hubungan linear)", why: "Benar: CVA = LGD × Σ(EE × PD × DF) — EE adalah pengali linear.", correct: true },
            { text: "CVA naik empat kali lipat (kuadratik)", why: "Tidak ada suku kuadrat dalam rumus CVA diskrit." },
            { text: "CVA tidak berubah — hanya PD yang penting", why: "PD tanpa eksposur = risiko atas ketiadaan; keduanya pengali." },
            { text: "CVA menjadi nol karena diversifikasi", why: "Tidak ada diversifikasi dalam rumus satu kontrak ini." },
          ],
        },
        {
          q: "Bank mencatat 'keuntungan DVA' saat peringkat kreditnya sendiri turun. Penjelasan yang tepat?",
          options: [
            { text: "Kewajiban derivatifnya turun nilainya (mungkin tidak dibayar penuh) — simetri akuntansi nilai wajar yang kontroversial", why: "Benar: DVA adalah cermin CVA; 'laba' ini kontroversial karena bank untung dari memburuknya dirinya.", correct: true },
            { text: "Bank menerima pembayaran asuransi atas penurunan peringkatnya", why: "Tidak ada pembayaran — ini penyesuaian valuasi, bukan kas." },
            { text: "Itu kesalahan akuntansi yang harus dikoreksi", why: "Bukan kesalahan — itu konsekuensi standar nilai wajar, meski diperdebatkan." },
            { text: "DVA selalu nol untuk bank besar", why: "DVA justru material untuk bank dengan liabilitas derivatif besar." },
          ],
        },
        {
          q: "Dua kontrak identik, satu dengan CSA (agunan harian) dan satu tanpa. Bagaimana CVA-nya?",
          options: [
            { text: "Yang ber-CSA jauh lebih kecil — agunan harian membuat eksposur bersih ≈ nol", why: "Benar: CSA adalah obat CVA paling ampuh; itulah alasan negosiasi CSA mendahului negosiasi harga.", correct: true },
            { text: "Sama besar — CSA tidak memengaruhi CVA", why: "Salah total: CSA langsung memotong EE, bahan utama CVA." },
            { text: "Yang ber-CSA lebih besar karena biaya operasional", why: "Biaya operasional bukan komponen CVA." },
            { text: "CVA hanya berlaku untuk kontrak tanpa CSA menurut regulasi", why: "CVA berlaku untuk keduanya; CSA hanya mengecilkan nilainya." },
          ],
        },
        {
          q: "Lab lesson ini: bila PD kumulatif tahun 3 naik dari 9% menjadi 15% (lainnya tetap), apa yang terjadi pada CVA?",
          options: [
            { text: "Naik — PD marginal tahun 3 menjadi 10% (15%−5%), kontribusi tahun 3 membesar", why: "Benar: PD_marg_3 = 0,15 − 0,05 = 0,10 (dari 0,04); suku tahun 3 naik 2,5× lipat.", correct: true },
            { text: "Turun — PD tinggi berarti lawan pasti bayar", why: "Terbalik total: PD tinggi = risiko gagal bayar tinggi = CVA besar." },
            { text: "Tetap — CVA hanya memakai PD tahun 1", why: "CVA menjumlahkan seluruh tenor, bukan tahun pertama saja." },
            { text: "Menjadi nol — kontrak dibatalkan otomatis", why: "Tidak ada pembatalan otomatis; CVA justru mengukur skenario itu." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghafal rumus CVA tanpa memahami 'untuk siapa'. Rumus yang sama memberi angka berbeda tergantung sisi mana kamu berdiri (CVA-mu = DVA lawan). Selalu tanya dulu: 'apakah saya yang menunggu pembayaran?' — bila ya, hitung CVA; bila tidak, itu DVA.",
      },
      hints: [
        "Uji cepat: jelaskan ke teman kenapa bank rela 'kalah tender' demi mempertahankan CVA penuh.",
        "Ingat angka lab: CVA 3,88 dari 4.200 — kecil, pasti, dan tidak bisa ditawar tanpa mengubah risiko.",
      ],
      reference: "XVA = harga kejujuran: lawan bisa gagal, dana tidak gratis, modal ada harganya.",
    },
  ],
};
