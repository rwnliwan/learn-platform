import type { V2Lesson } from "../lib/types";

const FIG_PC_GROWTH = `<svg viewBox="0 0 520 270" role="img" aria-label="Batang pertumbuhan AUM private credit global 2015-2025, ilustratif.">
<g font-family="var(--font-ui)">
<text x="260" y="18" font-size="12" fill="var(--chart-text)" text-anchor="middle">AUM Private Credit Global (USD triliun, ilustratif)</text>
<rect x="60" y="220" width="44" height="18" fill="var(--c1)" opacity="0.9"/>
<rect x="120" y="205" width="44" height="33" fill="var(--c1)" opacity="0.9"/>
<rect x="180" y="182" width="44" height="56" fill="var(--c1)" opacity="0.9"/>
<rect x="240" y="155" width="44" height="83" fill="var(--c1)" opacity="0.9"/>
<rect x="300" y="128" width="44" height="110" fill="var(--c1)" opacity="0.9"/>
<rect x="360" y="98" width="44" height="140" fill="var(--c4)" opacity="0.9"/>
<rect x="420" y="68" width="44" height="170" fill="var(--c4)" opacity="0.9"/>
<text x="82" y="252" font-size="10" fill="var(--chart-text)" text-anchor="middle">2015</text>
<text x="142" y="252" font-size="10" fill="var(--chart-text)" text-anchor="middle">2017</text>
<text x="202" y="252" font-size="10" fill="var(--chart-text)" text-anchor="middle">2019</text>
<text x="262" y="252" font-size="10" fill="var(--chart-text)" text-anchor="middle">2021</text>
<text x="322" y="252" font-size="10" fill="var(--chart-text)" text-anchor="middle">2023</text>
<text x="382" y="252" font-size="10" fill="var(--chart-text)" text-anchor="middle">2024</text>
<text x="442" y="252" font-size="10" fill="var(--chart-text)" text-anchor="middle">2025</text>
<text x="82" y="212" font-size="10" fill="var(--chart-text)" text-anchor="middle">0,5</text>
<text x="202" y="174" font-size="10" fill="var(--chart-text)" text-anchor="middle">0,8</text>
<text x="322" y="120" font-size="10" fill="var(--chart-text)" text-anchor="middle">1,2</text>
<text x="442" y="60" font-size="10" fill="var(--chart-text)" text-anchor="middle">1,7</text>
<text x="260" y="268" font-size="10" fill="var(--text-faint)" text-anchor="middle">Angka ilustratif untuk latihan membaca tren — bukan data pasar resmi.</text>
</g>
</svg>`;

const FIG_PC_DECISION = `<svg viewBox="0 0 520 300" role="img" aria-label="Diagram alur keputusan memilih private credit atau kredit bank.">
<g font-family="var(--font-ui)">
<rect x="160" y="8" width="200" height="44" rx="8" fill="var(--bg-sunken)" stroke="var(--border-strong)"/>
<text x="260" y="27" font-size="12" fill="var(--text)" text-anchor="middle">Butuh pinjaman korporat.</text>
<text x="260" y="43" font-size="11" fill="var(--text-muted)" text-anchor="middle">Tanya 1: seberapa cepat?</text>
<rect x="30" y="80" width="200" height="52" rx="8" fill="var(--c1)" opacity="0.85"/>
<text x="130" y="101" font-size="12" fill="#fff" text-anchor="middle">Butuh &lt; 6 minggu,</text>
<text x="130" y="117" font-size="12" fill="#fff" text-anchor="middle">fleksibel → Private credit</text>
<rect x="290" y="80" width="200" height="52" rx="8" fill="var(--c3)" opacity="0.85"/>
<text x="390" y="101" font-size="12" fill="#fff" text-anchor="middle">Bisa tunggu 3 bulan,</text>
<text x="390" y="117" font-size="12" fill="#fff" text-anchor="middle">mau murah → Bank</text>
<rect x="30" y="160" width="200" height="52" rx="8" fill="var(--c4)" opacity="0.85"/>
<text x="130" y="181" font-size="12" fill="#fff" text-anchor="middle">Struktur aneh</text>
<text x="130" y="197" font-size="12" fill="#fff" text-anchor="middle">(unitranche, PIK) → Private credit</text>
<rect x="290" y="160" width="200" height="52" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="390" y="181" font-size="12" fill="#fff" text-anchor="middle">Investor: tahan lock-up</text>
<text x="390" y="197" font-size="12" fill="#fff" text-anchor="middle">7-10 thn → Dana PC</text>
<rect x="150" y="240" width="220" height="44" rx="8" fill="var(--bg-sunken)" stroke="var(--border-strong)"/>
<text x="260" y="258" font-size="12" fill="var(--text)" text-anchor="middle">Aturan 10 detik: cepat + fleksibel</text>
<text x="260" y="274" font-size="12" fill="var(--text)" text-anchor="middle">= bayar mahal ke PC.</text>
</g>
</svg>`;

export const cr26: V2Lesson = {
  slug: "cr26-private-credit",
  track: "Credit Risk",
  module: "Kredit Korporasi Lanjut",
  title: "CR26 — Private Credit: Ketika Bank Kalah Cepat",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pinjaman termahal yang justru dipilih",
      prose: [
        "PT Sinar Baja butuh Rp400 miliar untuk mengakuisisi pesaingnya. Bank Nusantara menawar: bunga 9,5%, tenor 5 tahun, proses 3 bulan, 14 covenant keuangan yang harus dipatuhi tiap kuartal. Nusa Capital — sebuah dana private credit — menawar: bunga 12%, tenor 6 tahun, cair dalam 3 minggu, covenant nyaris tidak ada, cicilan pokok bisa ditunda 2 tahun.",
        "CFO Sinar Baja memilih tawaran Nusa Capital. Yang lebih mahal. Direksi Bank Nusantara garuk-garuk kepala: \"Kok bisa kalah dari bunga yang lebih tinggi?\" Jawabannya bukan soal harga — soal kecepatan, kepastian, dan fleksibilitas. Akuisisi itu berpacu dengan dua pembeli lain; menunggu 3 bulan berarti kehilangan target. Covenant bank berarti setiap kuartal hidup di bawah mikroskop; covenant-lite berarti ruang bernapas untuk mengeksekusi rencana.",
        "Twist-nya: bank tidak kalah karena bodoh atau malas. Bank kalah karena terikat aturan main yang tidak mengikat Nusa Capital — aturan modal (setiap rupiah pinjaman menggerogoti modal bank), aturan likuiditas, dan komite kredit berlapis. Private credit bermain di lapangan yang sama (pinjaman korporat) dengan seragam yang berbeda (dana investasi, bukan bank).",
        "Setelah lesson ini kamu bisa: (1) menjelaskan model bisnis private credit — direct lending, unitranche, covenant-lite; (2) menghitung mengapa bank konvensional kalah bersaing secara struktural; (3) mengukur risiko covenant-lite terhadap recovery; (4) menganalisis risiko konsentrasi dan likuiditas di level dana.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Private credit bukan ancaman abstrak bagi bank — ia mengambil segmen paling menguntungkan (leveraged buyout, sponsor-backed) dan meninggalkan bank dengan segmen yang lebih tipis marginnya. Analis risiko kredit 2026 wajib paham kompetitor yang tidak punya cabang, tidak punya ATM, tetapi menggerogoti pipeline kredit korporat.",
      },
      reference: "Harga bukan segalanya: kecepatan + kepastian + fleksibilitas = premi yang dibayar borrower.",
    },
    {
      id: "apa-itu",
      eyebrow: "Langkah 2 · Konsep",
      title: "Si Tetangga Kaya yang Sabar",
      prose: [
        "Private credit = pinjaman yang diberikan BUKAN oleh bank, melainkan oleh dana investasi (fund) yang dananya berasal dari investor institusi — dana pensiun, asuransi, sovereign wealth fund. Bentuk paling umum: direct lending — fund meminjamkan langsung ke perusahaan menengah tanpa perantara bank. Kepribadiannya: \"Si Tetangga Kaya yang Sabar\" — dananya dikunci (lock-up) 7–10 tahun, jadi ia tidak panik saat pasar gonjang-ganjing; ia bisa menunggu.",
        "Tiga istilah kunci. Satu: unitranche — satu paket pinjaman yang menggabungkan senior + junior (dulu borrower harus pinjam ke 2–3 bank dengan tranche berbeda; kini satu fund memberi satu paket, satu bunga blended). Dua: sponsor-backed — mayoritas deal private credit membiayai akuisisi oleh private equity; fund dan sponsor PE sudah seperti \"pasangan tetap\". Tiga: covenant-lite — covenant keuangan (maintenance) sangat longgar atau tidak ada; borrower leluasa.",
        "Bedanya dengan bank ada di pendanaan. Bank memakai dana deposan — bisa ditarik kapan saja, sehingga bank wajib menjaga likuiditas harian dan modal minimum. Fund memakai committed capital — investor sudah janji setor, dananya dikunci bertahun-tahun. Konsekuensinya: fund tidak menghadapi bank run, tidak diwajibkan CAR 8%, dan tidak diawasi OJK sebagai bank. Kelebihan ini sekaligus sumber risikonya — dibahas di langkah 7.",
        "💡 Tip analis: saat membandingkan bank vs fund, jangan bandingkan bunganya — bandingkan model pendanaannya. Deposan yang bisa kabur vs investor yang dikunci = dua makhluk berbeda dengan toleransi risiko berbeda. Semua keunggulan fund (cepat, fleksibel, tanpa pajak modal) lahir dari satu fakta: dananya sabar.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: \"private credit = pinjaman tanpa aturan\"",
        type: "pitfall",
        body: "Salah. Fund private credit diatur sebagai manajer investasi (di AS oleh SEC, di Indonesia pengelola dana sejenis tunduk pada aturan OJK pasar modal), hanya saja BUKAN sebagai bank. Aturannya berbeda — bukan tidak ada. Dan borrower-nya tetap perusahaan nyata dengan risiko kredit nyata: PD, LGD, dan EAD tetap berlaku penuh.",
      },
      reference: "Direct lending + unitranche + covenant-lite = tiga ciri khas private credit.",
    },
    {
      id: "mengapa-bank-kalah",
      eyebrow: "Langkah 3 · Konsep",
      title: "Mengapa bank konvensional kalah bersaing",
      prose: [
        "Alasan pertama: biaya modal regulasi. Setiap Rp100 pinjaman korporat di bank mengonsumsi ±Rp100 ATMR (bobot 100%), yang berarti bank harus menyediakan ±Rp8–12 modal sendiri. Modal itu mahal (cost of equity bank ±12–15%). Fund tidak punya kewajiban modal — Rp100 pinjaman = Rp100 dana investor, tanpa \"pajak modal\". Inilah mengapa bank sulit menandingi harga untuk risiko yang sama: bank membayar pajak regulasi, fund tidak.",
        "Alasan kedua: kecepatan dan kepastian. Komite kredit bank berlapis (account officer → komite → direksi), memakan 8–12 minggu. Fund memutuskan dalam 2–4 minggu — investment committee kecil, satu meja. Untuk akuisisi yang berpacu dengan waktu, kepastian \"dana pasti cair tanggal X\" bernilai lebih dari selisih bunga 200 bps.",
        "Alasan ketiga: fleksibilitas struktur. Bank terikat template produk (bunga mengambang/fixed, amortisasi rutin). Fund bisa merancang PIK toggle (bunga boleh dibayar dengan menambah pokok saat cash flow seret), bullet payment, equity kicker — struktur yang mengikuti napas bisnis borrower. Hasilnya: spread pickup — premi bunga yang rela dibayar borrower untuk paket lengkap ini.",
      ],
      formula: String.raw`\text{Spread pickup} = s_{\text{PC}} - s_{\text{bank}}`,
      formulaNote: "s_PC = spread pinjaman private credit (mis. SOFR+550 bps); s_bank = spread pinjaman bank untuk borrower sepadan (mis. SOFR+350 bps). Spread pickup = 200 bps = harga kecepatan + kepastian + fleksibilitas. Interpretasi: borrower membayar Rp2 miliar/tahun per Rp100 miliar pinjaman demi struktur yang pas.",
      tasks: [],
      note: {
        title: "💡 Intuisi: bank menjual uang, fund menjual kepastian",
        body: "Borrower yang memilih private credit jarang membandingkan bunga apel-ke-apel. Mereka membeli \"deal certainty\" — keyakinan akuisisi tidak gagal karena bank menarik diri di menit akhir. Analis bank yang hanya adu bunga akan selalu kalah dari analis yang memahami apa yang sebenarnya dibeli nasabah.",
      },
      reference: "Tiga keunggulan struktural fund: tanpa pajak modal, komite secepat kilat, struktur sesuai pesanan.",
    },
    {
      id: "covenant-lite",
      eyebrow: "Langkah 4 · Konsep",
      title: "Si Pemberani Tanpa Sabuk Pengaman",
      prose: [
        "Covenant = janji borrower dalam perjanjian kredit. Ada dua jenis. Maintenance covenant: diuji tiap kuartal — mis. \"leverage ratio maksimal 4x\"; jika jebol, lender boleh bertindak (renegosiasi, tarik pinjaman). Incurrence covenant: hanya aktif saat borrower melakukan aksi tertentu — mis. \"tidak boleh menerbitkan utang baru kecuali leverage < 3x\".",
        "Covenant-lite = maintenance covenant dihapus atau sangat longgar; yang tersisa incurrence covenant. Kepribadiannya: \"Si Pemberani Tanpa Sabuk Pengaman\" — selama borrower tidak menabrak (tidak menerbitkan utang baru, tidak membayar dividen jumbo), lender tidak boleh ikut campur, bahkan saat bisnisnya pelan-pelan memburuk. Lender baru sadar saat borrower sudah di ujung jurang.",
        "Dampaknya ke risiko kredit brutal: tanpa maintenance covenant, lender kehilangan early warning system. Dengan covenant ketat, pelanggaran di tahun ke-2 memaksa restrukturisasi dini — recovery 60–70%. Tanpa covenant, masalah baru terdeteksi di tahun ke-3 saat kas sudah kering — recovery 40–50%. Selisih 20 poin recovery pada pinjaman Rp400 miliar = Rp80 miliar. Lab berikutnya menghitung ini persis.",
      ],
      formula: String.raw`\text{Recovery rate} = \frac{\text{Nilai pulih}}{\text{Eksposur}} \quad ; \quad \text{LGD} = 1 - \text{Recovery rate}`,
      formulaNote: "Nilai pulih = kas yang kembali ke lender setelah default (dari penjualan aset/jaminan). Contoh: eksposur Rp400 M, pulih Rp280 M → recovery 70%, LGD 30%. Covenant-lite menekan recovery karena intervensi terlambat — interpretasi: setiap tahun keterlambatan deteksi ≈ recovery turun 10–15 poin.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: \"covenant-lite = tanpa covenant sama sekali\"",
        type: "pitfall",
        body: "Salah. Covenant-lite menghapus maintenance covenant, tetapi incurrence covenant tetap ada dan mengikat: borrower tetap dilarang menerbitkan utang baru, menjual aset inti, atau membayar dividen besar tanpa izin. Lender covenant-lite bukan tanpa perlindungan — ia hanya tidak punya hak intervensi dini atas kemunduran operasional.",
      },
      reference: "Maintenance = rem tangan tiap kuartal. Incurrence = pagar di tepi jurang. Lite = remnya dicopot, pagarnya tetap.",
    },
    {
      id: "lab-recovery",
      eyebrow: "Langkah 5 · Lab",
      title: "Harga sebuah peringatan dini",
      prose: [
        "Pinjaman Rp400 miliar, tenor 4 tahun. Skenario A (covenant ketat): pelanggaran terdeteksi tahun ke-2, restrukturisasi dini, recovery 68%. Skenario B (covenant-lite): masalah baru terlihat tahun ke-3, recovery 45%. PD kedua skenario sama (30%) — yang beda hanya LGD. Tugasmu: hitung expected loss kedua skenario dan selisihnya dalam rupiah.",
        "Eksperimen: ubah recovery skenario B menjadi 55% (mis. ada jaminan tambahan). Pada titik berapa selisih EL menjadi di bawah Rp20 miliar? Rasakan betapa sensitifnya EL terhadap asumsi recovery — inilah mengapa analis LGD (CR12) tidak boleh asal menebak.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `el_a` dan `el_b` (Rp miliar) = PD × LGD × EAD" },
        { id: "t2", text: "Hitung `selisih` = el_b − el_a" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "EL covenant ketat: Rp38.40 M\nEL covenant-lite: Rp66.00 M\nSelisih: Rp27.60 M",
      hints: [
        "LGD = 1 − recovery. EL = pd × lgd × ead.",
        "EAD = 400 (Rp miliar). PD = 0.30 untuk keduanya.",
        "el_a = 0.30 * (1-0.68) * 400",
      ],
      code: {
        starter: "ead = 400.0  # Rp miliar\npd = 0.30  # sama untuk kedua skenario\nrec_a = 0.68  # covenant ketat: intervensi tahun ke-2\nrec_b = 0.45  # covenant-lite: terdeteksi tahun ke-3\n\n# TULIS KODEMU: EL = PD x LGD x EAD (LGD = 1 - recovery)\nel_a = \nel_b = \nselisih = \n\nprint(f\"EL covenant ketat: Rp{el_a:.2f} M\")\nprint(f\"EL covenant-lite: Rp{el_b:.2f} M\")\nprint(f\"Selisih: Rp{selisih:.2f} M\")\n",
        lockLines: 4,
        solution: "ead = 400.0  # Rp miliar\npd = 0.30  # sama untuk kedua skenario\nrec_a = 0.68  # covenant ketat: intervensi tahun ke-2\nrec_b = 0.45  # covenant-lite: terdeteksi tahun ke-3\n\n# TULIS KODEMU: EL = PD x LGD x EAD (LGD = 1 - recovery)\nel_a = pd * (1 - rec_a) * ead\nel_b = pd * (1 - rec_b) * ead\nselisih = el_b - el_a\n\nprint(f\"EL covenant ketat: Rp{el_a:.2f} M\")\nprint(f\"EL covenant-lite: Rp{el_b:.2f} M\")\nprint(f\"Selisih: Rp{selisih:.2f} M\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "el_a", value: 38.4, tol: 0.05, label: "`el_a` sekitar 38.40", msg: "0,30 × (1−0,68) × 400 = 38,40." },
          { kind: "equal", task: "t1", name: "el_b", value: 66.0, tol: 0.05, label: "`el_b` sekitar 66.00", msg: "0,30 × (1−0,45) × 400 = 66,00." },
          { kind: "equal", task: "t2", name: "selisih", value: 27.6, tol: 0.05, label: "`selisih` sekitar 27.60", msg: "66,00 − 38,40 = 27,60." },
          { kind: "stdout_matches", task: "t3", pattern: "Selisih: Rp27\\.60 M", label: "Selisih tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Covenant-lite bukan gratis: premi bunga 200 bps vs tambahan EL Rp27,6 M — bandingkan keduanya sebelum menilai 'mahal'.",
    },
    {
      id: "chart-pertumbuhan",
      eyebrow: "Langkah 6 · Chart",
      title: "Dari niche ke raksasa",
      prose: [
        "Cara membaca: sumbu X = tahun (2015–2025), tinggi batang = total dana yang dikelola (AUM) fund private credit global dalam USD triliun. Batang biru = era pertumbuhan awal; batang oranye = era akselerasi pasca-2023. Angka pada figur ini ilustratif — untuk melatih membaca tren, bukan data pasar resmi.",
        "Interpretasi: AUM tumbuh ±3,4x dalam satu dekade — dari ceruk menjadi kelas aset mainstream. Lonjakan 2023–2025 bertepatan dengan bank mengetatkan kredit (suku bunga tinggi + aturan modal Basel III final) — borrower yang ditolak bank mengalir ke fund. Bagi analis risiko, tren ini berarti dua hal: (1) semakin banyak risiko kredit korporat berada DI LUAR neraca bank — tidak terlihat di statistik perbankan; (2) kompetisi menekan standar — saat dana melimpah (dry powder besar), fund berebut deal dan covenant makin longgar.",
        "Peringatan analis: pertumbuhan AUM bukan pertumbuhan kualitas. Vintage (tahun penyaluran) yang lahir saat kompetisi terpanas biasanya mencatat default tertinggi 3–4 tahun kemudian — pola klasik setiap siklus kredit. Tanyakan selalu: \"deal tahun berapa?\" sebelum menilai portofolio private credit.",
      ],
      figure: {
        svg: FIG_PC_GROWTH,
        alt: "Batang pertumbuhan AUM private credit global 2015-2025, angka ilustratif.",
        caption: "AUM ±3,4x dalam 10 tahun (ilustratif). Waspada vintage panas: kompetisi → standar longgar → default telat.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: risiko yang tak terlihat bukan berarti hilang",
        body: "Regulator bank hanya melihat risiko di neraca bank. Private credit memindahkan risiko kredit ke luar radar itu — ke fund, ke asuransi, ke dana pensiun. Krisis 2008 mengajarkan: risiko yang berpindah tempat tidak hilang, ia hanya menunggu ditemukan di tempat baru.",
      },
      reference: "Tumbuhnya AUM = tumbuhnya risiko di luar neraca bank. Vintage panas = default telat.",
    },
    {
      id: "risiko-dana",
      eyebrow: "Langkah 7 · Konsep",
      title: "Risiko di level dana: konsentrasi & likuiditas",
      prose: [
        "Risiko konsentrasi: fund private credit tipikal hanya memegang 30–80 pinjaman — jauh lebih terkonsentrasi dari bank dengan ribuan debitur. Jika 3 dari 40 borrower default bersamaan (mis. satu sektor terpukul), 7,5% portofolio hilang sekaligus. Lebih parah: banyak fund terkonsentrasi di sektor yang sama (teknologi, healthcare) karena di situlah deal sponsor-backed berada. Diversifikasi antar-borrower tidak menolong jika semua borrower satu tema.",
        "Risiko likuiditas punya wajah berbeda dari bank. Fund closed-end tidak menghadapi penarikan dana harian (tidak ada bank run) — tetapi ia menghadapi capital call risk: saat borrower menarik fasilitas yang belum dicairkan serentak (mis. krisis), fund harus memanggil dana dari investor dalam 10 hari. Jika investornya sendiri kesulitan likuiditas (dana pensiun yang asetnya jatuh), capital call gagal → fund gagal memenuhi komitmen → default berantai.",
        "Dan ada ironi struktural: siapa yang memberi leverage ke fund private credit? Bank — lewat subscription line (pinjaman jangka pendek dengan jaminan committed capital) dan NAV loan (pinjaman dengan jaminan portofolio fund). Artinya risiko yang \"keluar\" dari neraca bank masuk lagi lewat pintu belakang sebagai eksposur ke fund. Analis bank yang mengira private credit \"bukan urusan kami\" perlu mengecek berapa subscription line yang banknya sendiri berikan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: \"fund closed-end = tidak ada risiko likuiditas\"",
        type: "pitfall",
        body: "Salah. Tidak ada redemption bukan berarti tidak ada kebutuhan kas mendadak. Capital call untuk undrawn commitment, margin call pada NAV loan, dan kewajiban membayar imbal hasil — semuanya butuh kas. Likuiditas fund = kemampuan memanggil + mencairkan, bukan ketiadaan penarikan.",
      },
      reference: "Konsentrasi: sedikit borrower, satu tema. Likuiditas: capital call, bukan bank run. Ironi: bank memodali fund lewat subscription line.",
    },
    {
      id: "lab-likuiditas",
      eyebrow: "Langkah 8 · Lab",
      title: "Uji tekanan di level dana",
      prose: [
        "Nusa Capital Fund II: total komitmen Rp1.000 miliar, 40 borrower @Rp25 miliar. Undrawn commitment Rp200 miliar (bisa ditarik borrower sewaktu-waktu). Subscription line dari bank Rp150 miliar. Skenario stres: 3 borrower default (LGD 55%) DAN 50% undrawn ditarik serentak. Tugasmu: hitung kerugian kredit + kebutuhan kas, lalu tentukan apakah subscription line cukup.",
        "Eksperimen: naikkan default menjadi 5 borrower. Pada titik berapa fund harus melakukan capital call darurat ke investor? Inilah logika stress test level fund — mirip CR16, tetapi objeknya dana, bukan bank.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rugi` (Rp M) = 3 × 25 × 0,55" },
        { id: "t2", text: "Hitung `kas_butuh` (Rp M) = 50% × undrawn" },
        { id: "t3", text: "Tentukan `cukup` (True/False): subscription line ≥ kas_butuh?" },
        { id: "t4", text: "Cetak verdict dengan `print`" },
      ],
      expected: "Rugi kredit: Rp41.25 M\nKebutuhan kas: Rp100.00 M\nSubscription line Rp150 M -> CUKUP",
      hints: [
        "rugi = 3 * 25 * 0.55.",
        "kas_butuh = 0.5 * 200.",
        "cukup = 150 >= kas_butuh (boolean).",
      ],
      code: {
        starter: "eksposur_borrower = 25.0  # Rp M per borrower\nn_default = 3\nlgd = 0.55\nundrawn = 200.0  # Rp M\nsub_line = 150.0  # subscription line, Rp M\n\n# TULIS KODEMU\nrugi = \nkas_butuh = \ncukup = \n\nprint(f\"Rugi kredit: Rp{rugi:.2f} M\")\nprint(f\"Kebutuhan kas: Rp{kas_butuh:.2f} M\")\nprint(f\"Subscription line Rp{sub_line:.0f} M -> {'CUKUP' if cukup else 'KURANG'}\")\n",
        lockLines: 5,
        solution: "eksposur_borrower = 25.0  # Rp M per borrower\nn_default = 3\nlgd = 0.55\nundrawn = 200.0  # Rp M\nsub_line = 150.0  # subscription line, Rp M\n\n# TULIS KODEMU\nrugi = n_default * eksposur_borrower * lgd\nkas_butuh = 0.5 * undrawn\ncukup = sub_line >= kas_butuh\n\nprint(f\"Rugi kredit: Rp{rugi:.2f} M\")\nprint(f\"Kebutuhan kas: Rp{kas_butuh:.2f} M\")\nprint(f\"Subscription line Rp{sub_line:.0f} M -> {'CUKUP' if cukup else 'KURANG'}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "rugi", value: 41.25, tol: 0.01, label: "`rugi` sekitar 41.25", msg: "3 × 25 × 0,55 = 41,25." },
          { kind: "equal", task: "t2", name: "kas_butuh", value: 100.0, tol: 0.01, label: "`kas_butuh` sekitar 100.00", msg: "50% × 200 = 100." },
          { kind: "equal", task: "t3", name: "cukup", value: true, label: "`cukup` = True", msg: "150 ≥ 100 → True." },
          { kind: "stdout_matches", task: "t4", pattern: "Subscription line Rp150 M -> CUKUP", label: "Verdict tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Skenario ini lolos. Stres test yang baik bertanya: skenario apa yang membuatnya TIDAK lolos?",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta Keputusan",
      title: "Kapan ke fund, kapan ke bank",
      prose: [
        "Skenario 1 — Akuisisi berpacu waktu: PT target dilelang, penawaran ditutup 5 minggu. → Private credit. Alasan: bank butuh 8–12 minggu; kepastian tutup deal bernilai lebih dari selisih bunga. Contoh nyata: mayoritas leveraged buyout 2023–2025 dibiayai direct lending.",
        "Skenario 2 — Refinansiering perusahaan sehat beraset jelas: butuh Rp2 triliun, bisa tunggu 4 bulan, ingin bunga termurah. → Bank (sindikasi). Alasan: skala besar + waktu longgar = bank paling murah; fund mengenakan premi yang tidak perlu dibayar.",
        "Skenario 3 — Struktur tidak standar: butuh PIK toggle 2 tahun + bullet, cash flow musiman. → Private credit. Alasan: bank terikat template produk; fund merancang struktur sesuai pesanan. Harga: spread pickup 150–300 bps.",
        "Skenario 4 — Investor institusi (dana pensiun): butuh yield 8–10%, bisa mengunci dana 8 tahun. → Alokasi ke dana private credit. Alasan: illiquidity premium — dibayar mahal karena bersedia tidak likuid. Syarat: pahami vintage risk dan konsentrasi manajer.",
        "Skenario 5 — Analis risiko bank: bankmu memberi subscription line Rp500 M ke sebuah fund PC. → Perlakukan sebagai leveraged lending tidak langsung. Alasan: jika fund stres, line ditarik penuh tepat saat agunan (NAV fund) jatuh — wrong-way risk. Monitor seperti eksposur korporat ber-leverage.",
        "Aturan praktis 10 detik: butuh cepat + fleksibel = bayar mahal ke private credit; bisa tunggu + mau murah = ke bank; dan jika kamu analis bank, cek berapa banyak \"pinjaman ke fund\" yang sebenarnya pinjaman ke risiko kredit korporat berbungkus.",
      ],
      figure: {
        svg: FIG_PC_DECISION,
        alt: "Diagram alur: cepat+fleksibel ke private credit, bisa tunggu+murah ke bank.",
        caption: "Aturan 10 detik: kecepatan dan fleksibilitas dibayar dengan spread pickup.",
      },
      tasks: [],
      reference: "Lima skenario: borrower cepat, borrower murah, struktur aneh, investor sabar, analis waspada.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Unitranche Rp800 miliar yang goyah",
      prose: [
        "PT Maju Jaya Energi (fiktif) dibiayai Nusa Capital via unitranche Rp800 miliar: SOFR+550 bps, tenor 6 tahun, covenant-lite (hanya incurrence), PIK toggle 18 bulan pertama. Tahun 2026: harga komoditas jatuh, EBITDA turun 30% menjadi Rp140 miliar. Debt/EBITDA kini 5,7x (dari 4,0x). Tidak ada covenant yang jebol — karena tidak ada maintenance covenant untuk dijebol. Fund baru \"bangun\" saat borrower meminta waiver untuk menerbitkan utang darurat Rp100 miliar (incurrence covenant aktif!).",
        "Bank Nusantara diminta ikut sebagai co-lender Rp200 miliar (senior, bunga 10%). Pertanyaan analisis: (1) Hitung DSCR kas: EBITDA Rp140 M vs bunga (asumsi SOFR 4,5% + 5,5% = 10% × 800 = Rp80 M) → DSCR 1,75x — masih di atas 1, tetapi turun dari 2,5x. (2) Dengan covenant-lite, kapan bank akan tahu jika kondisi memburuk lagi? Jawab: hanya saat borrower butuh aksi yang memicu incurrence — bisa terlambat 12–18 bulan. (3) Rekomendasi: tolak co-lend tanpa (a) maintenance covenant untuk tranche bank, atau (b) pricing yang mencerminkan risiko deteksi telat (+150–200 bps).",
        "Pembahasan: kasus ini menunjukkan jebakan covenant-lite dari sisi lender baru — ia masuk ke struktur yang dirancang untuk lender lama yang sudah \"menikmati\" 18 bulan PIK. Pelajaran untuk analis: baca KAPAN covenant diuji, bukan hanya APA isinya. Struktur yang sama bisa aman untuk incumbent dan berbahaya untuk pendatang baru.",
      ],
      tasks: [],
      reference: "DSCR 1,75x terlihat aman — tetapi tanpa early warning, angka hari ini adalah foto kemarin.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "Private credit = dana investasi (committed capital, lock-up 7–10 thn) memberi pinjaman langsung — direct lending, unitranche, covenant-lite.",
        "Bank kalah struktural: pajak modal (ATMR), komite lambat, template kaku — bukan karena tidak becus.",
        "Covenant-lite menghapus maintenance covenant (early warning), menyisakan incurrence — recovery turun ±20 poin.",
        "Risiko level dana: konsentrasi (sedikit borrower, satu tema) + likuiditas (capital call, bukan bank run).",
        "Ironi: bank memodali fund via subscription line/NAV loan — risiko masuk lewat pintu belakang.",
      ],
      next: { label: "CR27 — Fintech Lending 2026", href: "/learn/cr27-fintech-lending" },
      quiz: [
        {
          q: "Mengapa bank konvensional kalah bersaing dengan dana private credit untuk leveraged buyout?",
          options: [
            { text: "Bank tidak punya cukup dana untuk pinjaman besar", why: "Bank punya dana jauh lebih besar; masalahnya bukan jumlah dana." },
            { text: "Bank menanggung pajak modal regulasi (ATMR), komite berlapis yang lambat, dan template produk kaku — fund tidak", why: "Tiga keunggulan struktural fund: tanpa kewajiban modal, keputusan 2–4 minggu, struktur sesuai pesanan.", correct: true },
            { text: "Fund selalu menawarkan bunga lebih murah dari bank", why: "Terbalik: fund justru lebih MAHAL (spread pickup 150–300 bps) — borrower membayar untuk kecepatan dan fleksibilitas." },
            { text: "Regulator melarang bank membiayai akuisisi", why: "Tidak ada larangan umum; bank boleh, hanya lebih lambat dan kaku." },
          ],
        },
        {
          q: "Apa beda maintenance covenant dan incurrence covenant — dan apa arti covenant-lite?",
          options: [
            { text: "Tidak ada bedanya, hanya istilah", why: "Bedanya fundamental: kapan diuji." },
            { text: "Maintenance diuji berkala (early warning); incurrence hanya aktif saat aksi tertentu; covenant-lite = maintenance dihapus, incurrence tetap", why: "Inilah mengapa lender lite kehilangan deteksi dini tetapi masih punya pagar di tepi jurang.", correct: true },
            { text: "Covenant-lite berarti tidak ada covenant sama sekali", why: "Miskonsepsi klasik — incurrence covenant tetap mengikat." },
            { text: "Incurrence diuji tiap kuartal, maintenance hanya saat aksi", why: "Terbalik." },
          ],
        },
        {
          q: "Dampak utama covenant-lite terhadap risiko kredit adalah…",
          options: [
            { text: "PD naik karena borrower lebih berisiko", why: "PD borrower-nya sama; yang berubah adalah kapan masalah terdeteksi." },
            { text: "Recovery turun (±20 poin) karena intervensi terlambat → LGD naik → EL naik, seperti di lab (selisih Rp27,6 M)", why: "Tanpa early warning, restrukturisasi telat 12–18 bulan dan nilai yang bisa diselamatkan menyusut.", correct: true },
            { text: "EAD turun karena pinjaman lebih kecil", why: "EAD tidak terkait covenant." },
            { text: "Tidak ada dampak — covenant hanya formalitas", why: "Lab membuktikan dampaknya Rp27,6 M untuk satu pinjaman." },
          ],
        },
        {
          q: "Fund private credit closed-end diklaim 'tidak punya risiko likuiditas'. Mengapa klaim ini salah?",
          options: [
            { text: "Karena investor bisa menarik dana kapan saja", why: "Closed-end justru mengunci dana — tidak ada penarikan harian." },
            { text: "Karena ada capital call untuk undrawn commitment + kewajiban kas lain yang bisa datang mendadak saat stres", why: "Likuiditas fund = kemampuan memanggil dana, bukan ketiadaan penarikan. Stres = penarikan undrawn serentak.", correct: true },
            { text: "Karena fund wajib memenuhi CAR 8%", why: "Fund bukan bank — tidak ada kewajiban CAR." },
            { text: "Risiko likuiditas hanya milik bank", why: "Setiap entitas dengan kewajiban kas punya risiko likuiditas." },
          ],
        },
        {
          q: "Bankmu memberi subscription line Rp500 M ke sebuah dana private credit. Bagaimana analis risiko harus memperlakukannya?",
          options: [
            { text: "Sebagai pinjaman tanpa risiko karena dijamin committed capital", why: "Committed capital bisa gagal dipanggil saat investornya sendiri stres — jaminan tidak absolut." },
            { text: "Sebagai deposito antarbank biasa", why: "Ini fasilitas kredit dengan risiko tarikan penuh saat fund stres." },
            { text: "Sebagai leveraged lending tidak langsung dengan wrong-way risk — dimonitor seperti eksposur korporat ber-leverage", why: "Line ditarik penuh tepat saat NAV fund (agunan) jatuh — korelasi yang merugikan.", correct: true },
            { text: "Tidak perlu dimonitor — itu urusan fund", why: "Risiko yang keluar dari neraca bank masuk lagi lewat pintu belakang." },
          ],
        },
      ],
    },
  ],
};
