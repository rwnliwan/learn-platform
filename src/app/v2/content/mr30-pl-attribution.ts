import type { V2Lesson } from "../lib/types";

const FIG_ATTRIB = `<svg viewBox=\"0 0 560 360\" role=\"img\" aria-label=\"Waterfall atribusi P&L opsi.\">
<g font-family=\"var(--font-ui)\">
<text x=\"14\" y=\"24\" font-size=\"13\" fill=\"var(--chart-text)\" font-weight=\"bold\">Waterfall: dari P&amp;L terjelaskan ke P&amp;L aktual</text>
<line x1=\"60\" y1=\"290\" x2=\"520\" y2=\"290\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<text x=\"22\" y=\"160\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" transform=\"rotate(-90 22 160)\">Juta Rp →</text>
<rect x=\"80\" y=\"230\" width=\"60\" height=\"60\" fill=\"var(--c1)\" opacity=\"0.85\"/>
<text x=\"110\" y=\"220\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">30,0</text>
<text x=\"110\" y=\"308\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Delta</text>
<rect x=\"155\" y=\"180\" width=\"60\" height=\"50\" fill=\"var(--c1)\" opacity=\"0.85\"/>
<text x=\"185\" y=\"170\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">25,0</text>
<text x=\"185\" y=\"308\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Gamma</text>
<rect x=\"230\" y=\"286\" width=\"60\" height=\"4\" fill=\"var(--c2)\" opacity=\"0.9\"/>
<text x=\"260\" y=\"278\" font-size=\"10\" fill=\"var(--c2)\" text-anchor=\"middle\">1,6</text>
<text x=\"260\" y=\"308\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Vega</text>
<rect x=\"305\" y=\"290\" width=\"60\" height=\"4\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"335\" y=\"308\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Theta</text>
<rect x=\"380\" y=\"240\" width=\"60\" height=\"50\" fill=\"var(--c2)\" opacity=\"0.9\"/>
<text x=\"410\" y=\"230\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">57,65</text>
<text x=\"410\" y=\"308\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Terjelaskan</text>
<rect x=\"455\" y=\"236\" width=\"60\" height=\"4\" fill=\"var(--c3)\" opacity=\"0.95\"/>
<text x=\"485\" y=\"228\" font-size=\"10\" fill=\"var(--c3)\" text-anchor=\"middle\">+2,0</text>
<text x=\"485\" y=\"308\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Tak terjelaskan</text>
<text x=\"14\" y=\"345\" font-size=\"10\" fill=\"var(--chart-text)\">Skala tidak proporsional: vega, theta, dan unexplained dipertebal agar terlihat.</text>
</g>
</svg>`;

export const mr30: V2Lesson = {
  slug: "mr30-pl-attribution",
  track: "Market Risk",
  module: "Atribusi & Validasi",
  title: "MR30 — P&L Attribution: Menjelaskan Setiap Rupiah",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "P&L Rp59,65 juta yang tak bisa dijelaskan",
      prose: [
        "Jumat sore, desk opsi sebuah bank di Jakarta menutup hari dengan P&L +Rp59,65 juta. Head of Market Risk, Ratna, membuka laporan atribusi harian — dan mengernyit. Kolom 'terjelaskan' berhenti di Rp57,65 juta. Selisih Rp2 juta tercatat sebagai 'unexplained'. 'Dua juta dari enam puluh — kecil, kan?' kata trader-nya. Ratna menggeleng: 'Kecil hari ini. Tapi unexplained yang tidak kamu kejar adalah cara model yang salah menyembunyikan diri.'",
        "Tiga minggu kemudian, unexplained yang sama membengkak menjadi Rp48 juta dalam sehari — dan barulah ketahuan: kurva volatilitas yang dipakai desk sudah basi dua minggu, sehingga vega P&L tercatat selalu salah arah. Kerugian itu sebenarnya sudah 'terlihat' sejak hari pertama, dalam kolom unexplained yang diabaikan.",
        "Twist-nya: P&L attribution bukan soal akuntansi — ia adalah alarm dini model. Setiap rupiah P&L harus bisa ditelusuri ke penyebabnya (delta, gamma, vega, theta, carry). Sisa yang tidak bisa dijelaskan bukanlah 'noise yang wajar' — ia adalah tempat model yang rusak bersembunyi. Lesson ini mengajarkan rumus atribusi P&L, cara menghitung tiap komponen, dan kapan unexplained berubah dari 'angka kecil' menjadi 'eskalasi ke CRO'.",
      ],
      tasks: [],
    },
    {
      id: "explain",
      eyebrow: "Langkah 2 · Konsep",
      title: "P&L explain: lima kotak penyebab",
      prose: [
        "Atribusi P&L memecah perubahan nilai portofolio menjadi komponen yang masing-masing punya 'pemilik': Delta — Si Pengikut Harga: P&L dari pergerakan underlying (Δ × dS). Gamma — Si Penguat: koreksi orde dua karena delta sendiri berubah saat harga bergerak (½Γ(dS)²). Vega — Si Pembaca Volatilitas: P&L dari perubahan implied vol (ν × dσ). Theta — Si Pemakan Waktu: peluruhan nilai opsi per hari (Θ × dt, hampir selalu negatif untuk long opsi). Carry — Si Pendapatan Pasif: bunga/dividen dari posisi.",
        "Intuisinya: bayangkan P&L sebagai tagihan restoran yang dirinci per menu. 'Total Rp59,65 juta' tidak memberi tahu apa-apa; 'delta 30 + gamma 25 + vega 1,6 − theta 0,15 + carry 1,2' memberi tahu persis siapa yang bekerja hari ini. Trader yang baik membaca rinciannya setiap pagi — bukan totalnya.",
        "Kapan memakai: setiap hari, untuk setiap desk derivatif. Regulator dan audit internal mewajibkan laporan atribusi harian; desk tanpa atribusi = desk yang terbang buta.",
      ],
      formula: String.raw`P\&L_{\text{explained}} = \Delta \cdot dS + \tfrac{1}{2}\Gamma (dS)^2 + \nu \cdot d\sigma + \Theta \cdot dt + \text{carry}`,
      formulaNote: "Δ (delta) = sensitivitas harga terhadap underlying; dS = perubahan harga underlying; Γ (gamma) = laju perubahan delta; ν (vega) = sensitivitas terhadap implied volatility; dσ = perubahan vol; Θ (theta) = peluruhan per satuan waktu; dt = selang waktu; carry = pendapatan pasif. Hasilnya = P&L yang bisa dijelaskan model — bandingkan dengan P&L aktual.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira 'gamma P&L selalu kecil sehingga boleh diabaikan'. Gamma P&L tumbuh KUADRAT terhadap dS — saat pasar bergerak besar (tepat saat kamu paling butuh angka benar), gamma justru menjadi komponen terbesar. Mengabaikannya = buta di hari krisis.",
      },
      reference: "Lima kotak: delta, gamma, vega, theta, carry — tiap rupiah punya pemilik.",
    },
    {
      id: "unexplained",
      eyebrow: "Langkah 3 · Konsep",
      title: "Unexplained P&L: alarm, bukan sisa pembulatan",
      prose: [
        "Unexplained P&L — Si Pemberi Sinyal: selisih antara P&L aktual dan P&L terjelaskan. Rumusnya sederhana: U = P&L_aktual − P&L_explained. Interpretasinya tidak sederhana: U kecil dan acak tanda = model sehat (noise wajar). U kecil tapi SELALU searah (misalnya selalu positif kecil) = bias sistematis — model salah arah terus-menerus. U besar tiba-tiba = ada yang pecah: data basi, parameter salah, atau pasar bergerak di luar asumsi model.",
        "Aturan eskalasi yang dipakai banyak bank: |U| di bawah ambang (misalnya Rp5 juta untuk desk ini) → catat dan pantau. Tiga hari berturut-turut di atas ambang ATAU satu hari di atas 3× ambang → eskalasi ke head of risk: hentikan penambahan posisi sampai penyebab ketemu. Aturan ini ada karena cerita Ratna di atas nyata terjadi di banyak tempat: unexplained yang 'kecil' adalah cara masalah besar memperkenalkan diri.",
        "Hipotetis vs aktual: laporan yang baik membandingkan P&L hipotetis (dengan posisi kemarin, tanpa trading hari ini) vs P&L aktual — selisih keduanya = P&L dari aktivitas trading intraday. Tanpa pemisahan ini, trader bisa menyembunyikan kerugian model di balik keuntungan trading.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menormalisasi unexplained: 'biasanya juga ada sisa 1–2 juta, wajar'. Yang wajar adalah sisa yang ACAK tanda. Sisa yang konsisten searah — sekecil apa pun — adalah bias, dan bias tidak pernah 'wajar'. Uji tanda (sign test) sederhana atas 20 hari unexplained lebih jujur daripada ambang nominal.",
      },
      reference: "Unexplained = P&L aktual − terjelaskan. Acak = sehat; searah = bias; besar = eskalasi.",
    },
    {
      id: "figure-attrib",
      eyebrow: "Langkah 4 · Visual",
      title: "Waterfall atribusi: melihat siapa bekerja",
      prose: [
        "Cara membaca: tiap batang = satu komponen P&L (juta Rp); batang biru-hijau = kontribusi positif, irisan tipis = komponen kecil; dua batang terakhir = total terjelaskan (57,65) dan unexplained (+2,0). Interpretasi: delta dan gamma mendominasi hari itu (pergerakan harga besar); unexplained 2,0 berada di bawah ambang 5 — hari yang sehat, tetapi kolomnya tetap harus ada setiap hari.",
        "Perhatikan proporsi: vega 1,6 dan theta −0,15 nyaris tak terlihat — dan itu NORMAL di hari pergerakan harga besar. Bahayanya justru saat vega tiba-tiba menjadi batang terbesar padahal pasar spot tenang: itu sinyal kurva vol yang dipakai mungkin basi.",
      ],
      figure: {
        svg: FIG_ATTRIB,
        alt: "Waterfall atribusi P&L: delta 30, gamma 25, vega 1,6, theta kecil, total terjelaskan 57,65, unexplained 2,0.",
        caption: "Cara membaca: batang = komponen P&L (juta Rp); dua batang terakhir = total terjelaskan vs unexplained. Interpretasi: hari didominasi delta+gamma (pergerakan harga); unexplained 2,0 < ambang 5 = sehat. Catatan skala: komponen kecil dipertebal agar terlihat.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca waterfall hanya dari batang terbesar. Informasi paling berharga justru di batang TERKECIL yang berubah perilaku: theta yang tiba-tiba positif, atau unexplained yang kemarin nol hari ini 4,9 (di bawah ambang tapi 10× lipat dari biasanya). Atribusi dibaca sebagai serial waktu, bukan satu gambar.",
      },
      reference: "Batang kecil yang berubah perilaku = sinyal paling berharga.",
    },
    {
      id: "lab-attrib",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung atribusi & vonis unexplained",
      prose: [
        "Posisi long call: delta 0,6; gamma 0,02; vega 0,8 (per 1% vol); theta −0,15 (per hari). Hari ini: underlying naik Rp50, implied vol naik 2%, 1 hari berlalu, carry +Rp1,2 juta, P&L aktual +Rp59,65 juta. Hitung tiap komponen, total terjelaskan, unexplained, dan vonis: AMAN bila |unexplained| ≤ 5, BAHAYA bila lebih.",
        "Hasil yang benar: delta 30,0; gamma 25,0; vega 1,6; theta −0,15; terjelaskan 57,65; unexplained 2,0 → AMAN. Eksplorasi: ubah dS menjadi 100 — komponen mana yang meledak? (Petunjuk: yang kuadratik.) Ubah actual menjadi 70 — berapa unexplained dan apa vonisnya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pl_delta`, `pl_gamma`, `pl_vega`, `pl_theta` dari greeks & pergerakan pasar" },
        { id: "t2", text: "Hitung `explained_total` & `unexplained`; cetak komponen, total, dan `VONIS:`" },
      ],
      expected: "pl_delta=30.0\npl_gamma=25.0\npl_vega=1.6\npl_theta=-0.15\nexplained_total=57.65\nunexplained=2.0\nVONIS: AMAN (dalam ambang)",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Gamma 25 hampir menyamai delta 30 — pada pergerakan Rp50, orde dua tidak lagi 'koreksi kecil'. Inilah kenapa atribusi tanpa gamma (praktik malas di beberapa desk) sistematis meremehkan P&L di hari volatile — dan unexplained-nya selalu searah.",
      },
      hints: [
        "pl_gamma = 0.5 * gamma * dS**2 — jangan lupa faktor setengah.",
        "explained_total = jumlah 4 komponen + carry; unexplained = actual − explained_total.",
        "Vonis: 'AMAN (dalam ambang)' bila abs(unexplained) <= AMBANG, else 'BAHAYA: eskalasi'.",
      ],
      code: {
        starter: "# Data posisi long call — JANGAN UBAH.\ndelta, gamma, vega, theta = 0.6, 0.02, 0.8, -0.15\ndS, dIV, dt = 50.0, 2.0, 1\ncarry = 1.2\nactual = 59.65\nAMBANG = 5.0\n\n# TULIS KODEMU: komponen P&L, explained, unexplained, vonis\npl_delta = \npl_gamma = \npl_vega = \npl_theta = \nexplained_total = \nunexplained = \nprint(f\"pl_delta={pl_delta}\")\nprint(f\"pl_gamma={pl_gamma}\")\nprint(f\"pl_vega={pl_vega}\")\nprint(f\"pl_theta={pl_theta}\")\nprint(f\"explained_total={explained_total:.2f}\")\nprint(f\"unexplained={unexplained:.1f}\")\nvonis = \"AMAN (dalam ambang)\" if abs(unexplained) <= AMBANG else \"BAHAYA: eskalasi\"\nprint(f\"VONIS: {vonis}\")\n",
        lockLines: 6,
        solution: "# Data posisi long call — JANGAN UBAH.\ndelta, gamma, vega, theta = 0.6, 0.02, 0.8, -0.15\ndS, dIV, dt = 50.0, 2.0, 1\ncarry = 1.2\nactual = 59.65\nAMBANG = 5.0\n\n# TULIS KODEMU: komponen P&L, explained, unexplained, vonis\npl_delta = delta * dS\npl_gamma = 0.5 * gamma * dS ** 2\npl_vega = vega * dIV\npl_theta = theta * dt\nexplained_total = pl_delta + pl_gamma + pl_vega + pl_theta + carry\nunexplained = actual - explained_total\nprint(f\"pl_delta={pl_delta}\")\nprint(f\"pl_gamma={pl_gamma}\")\nprint(f\"pl_vega={pl_vega}\")\nprint(f\"pl_theta={pl_theta}\")\nprint(f\"explained_total={explained_total:.2f}\")\nprint(f\"unexplained={unexplained:.1f}\")\nvonis = \"AMAN (dalam ambang)\" if abs(unexplained) <= AMBANG else \"BAHAYA: eskalasi\"\nprint(f\"VONIS: {vonis}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "pl_delta", value: 30.0, tol: 0.01, label: "pl_delta = 30,0", msg: "0,6 × 50 = 30,0." },
          { kind: "equal", task: "t1", name: "pl_gamma", value: 25.0, tol: 0.01, label: "pl_gamma = 25,0", msg: "0,5 × 0,02 × 50² = 25,0 — jangan lupa faktor setengah." },
          { kind: "equal", task: "t1", name: "pl_vega", value: 1.6, tol: 0.01, label: "pl_vega = 1,6", msg: "0,8 × 2 = 1,6." },
          { kind: "equal", task: "t1", name: "pl_theta", value: -0.15, tol: 0.01, label: "pl_theta = −0,15", msg: "−0,15 × 1 = −0,15." },
          { kind: "equal", task: "t2", name: "explained_total", value: 57.65, tol: 0.01, label: "explained_total = 57,65", msg: "30 + 25 + 1,6 − 0,15 + 1,2 = 57,65." },
          { kind: "equal", task: "t2", name: "unexplained", value: 2.0, tol: 0.01, label: "unexplained = 2,0", msg: "59,65 − 57,65 = 2,0." },
          { kind: "stdout_matches", task: "t2", label: "Vonis tercetak", msg: "Baris 'VONIS: AMAN (dalam ambang)' harus tercetak.", pattern: "VONIS: AMAN" },
          { kind: "uses", task: "t1", label: "Memakai pl_delta", msg: "Komponen delta harus dihitung dari variabel greeks.", token: "pl_delta" },
        ],
      },
      reference: "Rumus atribusi = tagihan rinci P&L; unexplained = kolom alarm.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Empat pola unexplained, empat respons",
      prose: [
        "Skenario satu — unexplained kecil & acak tanda (±2 juta, kadang + kadang −): MODEL SEHAT. Ini noise wajar dari pembulatan dan aproksimasi orde dua. Respons: catat, lanjutkan. Tidak ada model yang menjelaskan 100%.",
        "Skenario dua — unexplained kecil tapi SEARAH 10 hari berturut-turut (+1,5 juta tiap hari): BIAS SISTEMATIS. Model salah arah terus-menerus — biasanya parameter basi (kurva vol lama) atau carry yang salah hitung. Respons: investigasi parameter, jangan tambah posisi.",
        "Skenario tiga — unexplained melonjak tiba-tiba (dari 2 juta ke 48 juta sehari): MODEL PECAH. Data input basi, corporate action tak tertangkap, atau pasar bergerak di luar asumsi. Respons: eskalasi ke head of risk hari itu juga; bekukan penambahan risiko sampai penyebab ketemu.",
        "Skenario empat — unexplained NOL terus selama berminggu-minggu: CURIGAI LAPORANNYA. Atribusi yang selalu sempurna biasanya berarti angkanya 'dipaksa cocok' (plug). Respons: audit proses — minta lihat perhitungan mentahnya.",
        "Aturan praktis 10 detik: (1) |U| ≤ ambang & acak → aman; (2) searah ≥ 3 hari → investigasi; (3) > 3× ambang sehari → eskalasi & bekukan; (4) selalu nol → audit laporannya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Hanya melihat BESARNYA unexplained, bukan POLANYA. Rp2 juta yang searah 20 hari (total bias Rp40 juta) jauh lebih berbahaya daripada Rp8 juta yang acak tanda. Atribusi dibaca seperti EKG: yang penting ritmenya, bukan satu titiknya.",
      },
      reference: "Besar = alarm; pola = diagnosis.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Desk FX: unexplained Rp8,5 juta",
      prose: [
        "Desk FX bank 'Cakra' melaporkan P&L aktual +Rp120 juta. Atribusi: delta 95, gamma 12, vega 4, theta −1, carry 1,5 → terjelaskan 111,5. Unexplained = +8,5 juta. Ambang desk: Rp5 juta. Tiga hari sebelumnya unexplained: +7,2; +6,8; +7,9 (semua positif). Pertanyaan: (a) apa vonis hari ini? (b) pola apa yang terlihat? (c) langkah pertama apa?",
        "Pembahasan: (a) |8,5| > 5 → BAHAYA: eskalasi — dan ini hari keempat. (b) Empat hari berturut-turut positif di kisaran 7–8,5 juta = bias sistematis, bukan noise; model kemungkinan memakai kurva vol yang basi atau forward point yang salah arah. (c) Langkah pertama: bekukan penambahan posisi FX, lalu rekonsiliasi input kurva vol & forward vs sumber independen (bukan vs file yang sama dipakai model). Jangan 'tunggu besok' — bias yang dibiarkan empat hari sudah cukup menjadi kebiasaan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan urutan respons: bekukan DULU, investigasi KEMUDIAN. Risk yang menunggu 'bukti pasti' sebelum bertindak akan selalu terlambat — unexplained yang searah empat hari SUDAH merupakan bukti yang cukup untuk tindakan pencegahan.",
      },
      reference: "Empat hari searah = bukti cukup untuk bekukan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "P&L_explained = Δ·dS + ½Γ(dS)² + ν·dσ + Θ·dt + carry — tiap rupiah P&L harus punya pemilik.",
        "Unexplained = aktual − terjelaskan: kecil & acak = sehat; searah = bias; melonjak = model pecah; selalu nol = curigai laporannya.",
        "Eskalasi: |U| > ambang 3 hari berturut-turut atau > 3× ambang sehari → bekukan penambahan posisi sampai penyebab ketemu.",
        "Pisahkan P&L hipotetis vs aktual agar keuntungan trading tidak menutupi kerugian model.",
        "Gamma tumbuh kuadratik — di hari volatile ia bisa menyamai/mengalahkan delta.",
      ],
      quiz: [
        {
          q: "Desk melaporkan P&L aktual 100, terjelaskan 97. Apa arti unexplained +3?",
          options: [
            { text: "Selisih yang harus dijelaskan; bila acak tanda dari hari ke hari, itu noise wajar", why: "Benar: unexplained = aktual − terjelaskan; yang dinilai adalah pola serialnya, bukan satu angka.", correct: true },
            { text: "Keuntungan tambahan yang bisa dibagikan sebagai bonus", why: "Bukan keuntungan — ia justru bagian P&L yang TIDAK dipahami penyebabnya." },
            { text: "Bukti model salah dan harus diganti besok pagi", why: "Terlalu cepat: satu angka kecil acak adalah noise wajar, bukan vonis model." },
            { text: "Tidak ada artinya selama total P&L positif", why: "Total positif tidak menghapus kewajiban menjelaskan — unexplained adalah alarm model." },
          ],
        },
        {
          q: "Unexplained +2 juta selama 15 hari berturut-turut (ambang 5 juta). Respons yang tepat?",
          options: [
            { text: "Investigasi bias sistematis — searah 15 hari bukan noise", why: "Benar: pola searah = bias; ambang nominal tidak menghapus kewajiban menyelidiki pola.", correct: true },
            { text: "Abaikan — masih di bawah ambang", why: "Salah: ambang menilai BESAR, bukan POLA; 15 hari searah adalah sinyal kuat." },
            { text: "Naikkan ambang menjadi 10 juta agar tidak berisik", why: "Mengakali alarm, bukan menyelesaikan masalah — bias tetap ada." },
            { text: "Ganti model valuasi sepenuhnya", why: "Terlalu drastis sebelum diagnosis; bias kecil biasanya soal parameter/input basi." },
          ],
        },
        {
          q: "Dalam rumus atribusi, komponen mana yang tumbuh kuadratik terhadap pergerakan harga?",
          options: [
            { text: "Gamma: ½Γ(dS)²", why: "Benar: satu-satunya suku dengan (dS)² — dominan di hari pergerakan besar.", correct: true },
            { text: "Delta: Δ·dS", why: "Delta linear terhadap dS, bukan kuadratik." },
            { text: "Theta: Θ·dt", why: "Theta tergantung waktu, bukan pergerakan harga." },
            { text: "Carry", why: "Carry tidak tergantung dS sama sekali." },
          ],
        },
        {
          q: "Kenapa P&L hipotetis (posisi kemarin, tanpa trading hari ini) perlu dipisahkan dari P&L aktual?",
          options: [
            { text: "Agar keuntungan trading intraday tidak menutupi kerugian dari model yang salah", why: "Benar: tanpa pemisahan, trader bisa menyembunyikan model error di balik trading profit.", correct: true },
            { text: "Karena regulator melarang trading intraday", why: "Tidak ada larangan seperti itu; ini soal transparansi atribusi." },
            { text: "Agar perhitungannya lebih cepat", why: "Justru menambah satu perhitungan; tujuannya kontrol, bukan kecepatan." },
            { text: "Karena P&L hipotetis selalu lebih akurat", why: "Tidak selalu — ia hanya baseline pembanding yang konsisten." },
          ],
        },
        {
          q: "Lab lesson ini: bila dS digandakan dari 50 menjadi 100 (lainnya tetap), apa yang terjadi pada pl_gamma?",
          options: [
            { text: "Naik 4× lipat: 0,5×0,02×100² = 100", why: "Benar: kuadratik — 25 × 4 = 100, kini jauh melampaui delta (60).", correct: true },
            { text: "Naik 2× lipat menjadi 50", why: "Itu perilaku linear (delta); gamma kuadratik." },
            { text: "Tetap 25 — gamma tidak tergantung dS", why: "Gamma (koefisien) tetap, tapi P&L gamma tergantung (dS)²." },
            { text: "Menjadi negatif", why: "Long gamma selalu positif untuk pergerakan dua arah." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Keluar dari lesson ini dengan hafalan rumus tapi tanpa kebiasaan membaca kolom unexplained setiap hari. Rumusnya mudah; disiplinnyalah yang langka — dan disiplin itulah yang membedakan risk manager dari penonton P&L.",
      },
      hints: [
        "Uji cepat: jelaskan ke teman kenapa unexplained +2 juta × 15 hari lebih menakutkan daripada +8 juta sekali.",
        "Ingat angka lab: terjelaskan 57,65 dari aktual 59,65 — kolom 2,0 itulah yang dijaga setiap hari.",
      ],
      reference: "Atribusi = tagihan rinci; unexplained = EKG model.",
      next: { label: "MR31 — Power BI untuk Pelaporan Risiko Pasar", href: "/learn/mr31-powerbi-risiko" },
    },
  ],
};
