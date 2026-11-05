import type { V2Lesson } from "../lib/types";

const FIG_TWP = `<svg viewBox="0 0 480 260" role="img" aria-label="Batang TWP90 Juni dan Juli 2026 mendekati ambang 5 persen.">
<g font-family="var(--font-ui)">
<text x="10" y="30" font-size="13" fill="var(--chart-text)" font-weight="bold">TWP90 industri fintech lending 2026</text>
<text x="10" y="52" font-size="11" fill="var(--chart-text)">Jun 2026</text>
<rect x="90" y="38" width="255" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="350" y="56" font-size="11" fill="var(--chart-text)">4,26%</text>
<text x="10" y="102" font-size="11" fill="var(--chart-text)">Jul 2026</text>
<rect x="90" y="88" width="259" height="26" fill="var(--c3)" opacity="0.9"/>
<text x="354" y="106" font-size="11" fill="var(--chart-text)">4,32%</text>
<line x1="90" y1="130" x2="390" y2="130" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6,4"/>
<text x="394" y="134" font-size="11" fill="var(--c4)">Ambang 5%</text>
<text x="90" y="170" font-size="11" fill="var(--chart-text)">Jarak ke ambang tinggal 0,68 poin.</text>
<text x="90" y="190" font-size="11" fill="var(--chart-text)">Kenaikan 0,06 poin dalam sebulan = laju yang dipantau OJK.</text>
<text x="90" y="220" font-size="10" fill="var(--chart-text)" opacity="0.75">Sumber angka: OJK via pemberitaan (Kontan, Sep 2026). Ambang 5%: SEOJK 19/2025.</text>
</g>
</svg>`;

const FIG_PF = `<svg viewBox="0 0 480 280" role="img" aria-label="Alur pooling funds: 5 persen dari fee neto dikunci di deposito atau SBN.">
<g font-family="var(--font-ui)">
<text x="10" y="30" font-size="13" fill="var(--chart-text)" font-weight="bold">Pooling funds: sabuk pengaman yang mengunci fee</text>
<rect x="20" y="55" width="200" height="60" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="120" y="80" font-size="12" fill="var(--chart-text)" text-anchor="middle">Platform fee neto</text>
<text x="120" y="100" font-size="14" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Rp45 M</text>
<text x="235" y="90" font-size="16" fill="var(--chart-text)">→</text>
<text x="255" y="82" font-size="11" fill="var(--chart-text)">5% wajib</text>
<text x="255" y="98" font-size="11" fill="var(--chart-text)">disisihkan</text>
<rect x="330" y="55" width="130" height="60" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="395" y="80" font-size="12" fill="var(--chart-text)" text-anchor="middle">Pooling funds</text>
<text x="395" y="100" font-size="14" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Rp2,25 M</text>
<text x="395" y="135" font-size="16" fill="var(--chart-text)" text-anchor="middle">↓</text>
<rect x="280" y="150" width="230" height="60" rx="8" fill="var(--c3)" opacity="0.2" stroke="var(--c3)" stroke-width="2"/>
<text x="395" y="175" font-size="12" fill="var(--chart-text)" text-anchor="middle">Deposito bank / SBN</text>
<text x="395" y="195" font-size="11" fill="var(--chart-text)" text-anchor="middle">cair hanya atas persetujuan OJK</text>
<text x="20" y="245" font-size="11" fill="var(--chart-text)">Imbal hasil (bunga/kupon) boleh dipakai operasional — pokoknya tidak.</text>
<text x="20" y="263" font-size="10" fill="var(--chart-text)" opacity="0.75">Draft Pasal 149A revisi POJK 40/2024, target terbit 2026.</text>
</g>
</svg>`;

export const cr27: V2Lesson = {
  slug: "cr27-fintech-lending",
  track: "Credit Risk",
  module: "Kredit Digital & Fintech",
  title: "CR27 — Fintech Lending 2026: TWP90, Pooling Funds, dan Ujian Kualitas",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp2,25 miliar yang tidak boleh jadi dividen",
      prose: [
        "Kuartal II 2026, platform pinjaman daring ArusDana membukukan platform fee neto Rp45 miliar — rekor perusahaan. Direksi sudah membayangkan dividen. Lalu kepala risikonya masuk membawa satu pasal: Pasal 149A, draft revisi POJK 40/2024. Lima persen dari fee itu — Rp2,25 miliar — wajib disisihkan sebagai pooling funds: cadangan pengembalian dana lender. Uangnya ditempatkan di deposito atau surat berharga negara. Dicairkan hanya atas persetujuan OJK.",
        "Twist-nya: Rp2,25 miliar itu tetap milik perusahaan — tetapi tidak bisa dipakai. Bukan beban, bukan pajak, bukan denda. Ini sabuk pengaman yang menjahit dirinya sendiri ke neraca: melindungi lender dari kesalahan atau kelalaian penyelenggara, sekaligus memaksa penyelenggara menjaga kualitas penyaluran karena fee yang disisihkan hanya kembali sebagai laba ditahan bila kualitas pendanaannya bagus.",
        "Di saat yang sama, speedometer industri berdenyut kencang: TWP90 (tingkat wanprestasi di atas 90 hari) menyentuh 4,32% pada Juli 2026 — tinggal 0,68 poin dari ambang 5%. ArusDana sendiri berada di 4,8%. Satu kuartal buruk, dan mereka melewati garis yang memicu sorotan regulator.",
        "Lesson ini tentang tiga ujian kualitas fintech lending Indonesia 2026: TWP90 sebagai speedometer, pooling funds sebagai sabuk pengaman, dan repayment capacity sebagai rem. Setelah lesson ini kamu bisa: (1) menghitung dan menginterpretasikan TWP90 terhadap ambang 5%; (2) menghitung kewajiban pooling funds dari fee neto; (3) menjelaskan logika 4-tier dan dana likuidasi; (4) menilai repayment capacity borrower.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Fintech lending adalah laboratorium risiko kredit paling jujur: tidak ada agunan, tidak ada riwayat panjang, keputusan dalam menit. Semua yang kamu pelajari di track Credit Risk — PD, ECL, stress testing — diuji di sini dalam bentuk paling mentah. Analis yang paham TWP90 dan pooling funds memahami bahasa yang dipakai OJK dan direksi platform saat ini.",
      },
      reference: "TWP90 = speedometer. Pooling funds = sabuk pengaman. Repayment capacity = rem.",
    },
    {
      id: "twp90",
      eyebrow: "Langkah 2 · Konsep",
      title: "TWP90: speedometer yang tidak bisa dibohongi",
      prose: [
        "TWP90 (Tingkat Wanprestasi di atas 90 hari) = outstanding pembiayaan yang menunggak lebih dari 90 hari dibagi total outstanding, dikali 100%. Ini satu angka yang merangkum kualitas seluruh portofolio platform — seperti NPL untuk bank, tetapi dengan definisi khusus industri pinjol.",
        "Angka Juli 2026: 4,32%, naik dari 4,26% pada Juni 2026. Kenaikannya hanya 0,06 poin — tetapi arahnya yang penting. Ambang yang ditetapkan OJK (SEOJK 19/2025): maksimal 5%. Pada laju 0,06 poin per bulan, industri mencapai ambang dalam sekitar 11 bulan — dan itu asumsi lajunya tidak mempercepat. Platform seperti ArusDana di 4,8% praktis sudah hidup di zona kuning.",
        "Tiga miskonsepsi umum. Satu: 'TWP90 = NPL bank.' Bukan — NPL bank memakai kolektibilitas 3–5 dengan kerangka CKPN/ECL; TWP90 memakai definisi wanprestasi >90 hari atas outstanding P2P. Angkanya tidak bisa dibandingkan langsung. Dua: 'Di bawah 5% berarti aman.' Ambang adalah garis merah, bukan garis hijau — platform di 4,8% dengan tren naik lebih berbahaya daripada platform di 3% yang stabil. Tiga: 'TWP90 turun = kualitas membaik.' Belum tentu — TWP90 bisa turun karena denominasi membesar (penyaluran baru besar-besaran mengencerkan rasio), bukan karena koleksi membaik. Selalu baca pembilang dan penyebutnya.",
        "Cara membaca figur: dua batang = TWP90 industri Juni vs Juli 2026; garis putus-putus = ambang 5%. Interpretasi: jarak ke ambang (0,68 poin) adalah 'runway' industri — dan runway ArusDana (0,2 poin) jauh lebih pendek. Laporan TWP90 yang baik selalu memuat tren 6 bulan + runway, bukan sekadar angka bulan berjalan.",
      ],
      formula: String.raw`\text{TWP90} = \frac{\text{Outstanding menunggak} > 90 \text{ hari}}{\text{Total outstanding}} \times 100\%`,
      formulaNote: "Pembilang = outstanding (bukan jumlah borrower) dengan DPD > 90 hari. Penyebut = total outstanding aktif. Contoh: Rp480 juta / Rp10.000 juta = 4,8%. Interpretasi: dari tiap Rp100 yang disalurkan dan masih beredar, Rp4,80 macet berat.",
      figure: {
        svg: FIG_TWP,
        alt: "Batang TWP90 Juni 4,26% dan Juli 4,32% mendekati ambang 5%.",
        caption: "Runway industri: 0,68 poin menuju ambang 5%. Tren > level.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“TWP90 kami 4,8%, masih di bawah ambang 5% — aman.” Ambang 5% adalah batas maksimum, bukan target. Platform yang hidup di 4,8% dengan tren naik 0,06 poin/bulan akan menembus ambang dalam 3–4 bulan. Analis yang baik melaporkan jarak ke ambang dan kecepatan mendekatinya, bukan sekadar 'masih di bawah'.",
      },
      hints: [
        "Selalu hitung laju perubahan TWP90 (poin per bulan), bukan hanya levelnya.",
        "Segmentasikan TWP90 per vintage/cohort: TWP90 agregat bisa menutupi cohort baru yang jauh lebih buruk.",
      ],
      reference: "TWP90 = macet >90 hari / total outstanding. Ambang 5%. Baca tren + runway.",
    },
    {
      id: "pooling",
      eyebrow: "Langkah 3 · Konsep",
      title: "Pooling funds: Rp2,25 miliar yang dikunci",
      prose: [
        "Draft Pasal 149A revisi POJK 40/2024 mewajibkan setiap penyelenggara membentuk pooling funds — cadangan pengembalian dana lender — paling sedikit 5% dari platform fee neto yang diperoleh untuk setiap penyaluran pembiayaan. Tujuannya eksplisit: menyelesaikan kerugian yang berdampak kepada pemberi dana akibat kesalahan atau kelalaian penyelenggara.",
        "Aturannya rinci dan tidak memberi ruang tawar. Ayat (4)–(5): dana wajib ditempatkan pada deposito atas nama penyelenggara di bank umum atau bank umum syariah, dan/atau surat berharga negara — instrumen yang aman dan likuid. Pencairannya hanya atas persetujuan OJK. Ayat (6): imbal hasil — bunga deposito atau kupon SBN — boleh dipakai untuk operasional. Ayat (7): bila pooling funds dinilai melebihi batas tertentu berdasarkan kualitas pendanaan, kelebihannya menjadi hak penyelenggara dan dapat dihitung sebagai laba ditahan — tetapi tetap atas persetujuan OJK.",
        "Contoh ArusDana: fee neto kuartal Rp45 miliar → pooling funds Rp2,25 miliar dikunci di deposito. Dengan bunga deposito 5% per tahun, imbal hasilnya ±Rp112,5 juta per tahun — boleh dipakai operasional. Pokok Rp2,25 miliarnya tidak. Inilah kepribadian pooling funds: ia mengubah fee dari 'pendapatan bebas' menjadi 'pendapatan bersyarat' — syaratnya kualitas penyaluran.",
        "Tiga miskonsepsi umum. Satu: 'Pooling funds = dana lender.' Bukan — ini dana penyelenggara, dibentuk dari fee-nya sendiri, sebagai buffer untuk melindungi lender. Dua: 'Bisa dipakai untuk operasional saat sulit.' Tidak — pokoknya dikunci; hanya imbal hasilnya yang boleh dipakai, dan pencairan pokok butuh persetujuan OJK. Tiga: 'Ini pajak baru.' Bukan pajak — kelebihan dana bisa kembali sebagai laba ditahan bila kualitas pendanaan bagus. Ini insentif, bukan pungutan.",
        "Cara membaca figur: alur dari fee neto Rp45 M → 5% disisihkan → Rp2,25 M terkunci di deposito/SBN. Interpretasi: setiap rupiah fee yang dihasilkan 'membawa' kewajiban 5 sen yang dikunci — model bisnis platform harus dihitung setelah pooling, bukan sebelum.",
      ],
      formula: String.raw`\text{Pooling funds} = 5\% \times \text{platform fee neto per penyaluran}`,
      formulaNote: "5% = batas minimum (Pasal 149A ayat 3 draft). Fee neto = fee platform setelah dikurangi biaya langsung. Contoh: Rp45 M × 5% = Rp2,25 M. Interpretasi: bukan biaya — ini cadangan yang bisa kembali sebagai laba ditahan bila kualitas bagus.",
      figure: {
        svg: FIG_PF,
        alt: "Alur pooling funds dari fee neto ke deposito atau SBN.",
        caption: "Fee Rp45 M → Rp2,25 M dikunci. Pokok tidak likuid bebas; imbal hasil boleh dipakai.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Pooling funds mengurangi profitabilitas — model bisnis kami rusak.” Hitung dulu ayat (7): bila kualitas pendanaan bagus, kelebihan pooling funds kembali sebagai laba ditahan. Yang 'rusak' bukan model bisnisnya — melainkan model bisnis yang bergantung pada fee tanpa memperhatikan kualitas. Itulah tepatnya perilaku yang ingin diubah regulator.",
      },
      hints: [
        "Pooling funds dihitung per penyaluran, bukan per kuartal — sistem harus memotongnya saat fee diakui.",
        "Kelebihan pooling funds = sinyal kualitas: platform dengan TWP90 rendah 'membayar' lebih sedikit dalam bentuk dana terkunci.",
      ],
      reference: "PF = 5% × fee neto. Deposito/SBN. Cair atas persetujuan OJK. Imbal hasil boleh dipakai.",
    },
    {
      id: "tier",
      eyebrow: "Langkah 4 · Konsep",
      title: "Empat kasta dan dana kuburan",
      prose: [
        "Draft yang sama mengelompokkan penyelenggara ke dalam 4 tier (Pasal 216A): berdasarkan tingkat kesehatan penyelenggara, rasio penyaluran pendanaan UMKM, dan rasio penolakan aduan konsumen. Tier bukan sekadar label — penyelenggara tier 2 sampai 4 dikecualikan dari batas maksimum pendanaan (Pasal 137). Artinya: kualitas yang baik membeli kebebasan berekspansi.",
        "Lalu ada 'dana kuburan': dana persiapan likuidasi. Draft mewajibkan pembentukan dana ini minimal 20% dari ekuitas wajib minimum — dana awal sekurang-kurangnya Rp500 juta, meningkat bertahap hingga minimal Rp2,5 miliar dalam paling lama tiga tahun, dengan pembentukan dimulai tahun buku 2027. Tujuannya brutal tapi jujur: bila platform mati, ada uang untuk mengurus pemakamannya — administrasi dan penagihan portofolio tetap berjalan.",
        "AFPI (asosiasi industri) membentuk Tim Pengelolaan Administratif dan Portofolio untuk menjaga kelangsungan administrasi dan penagihan ketika penyelenggara tidak mampu menjalankan fungsi intermediasi — tanpa menggantikan tim likuidasi. Konteksnya nyata: kasus Crowde yang berkasnya dinyatakan lengkap (P.21) pada Januari 2026 dengan dugaan TPPU menunjukkan apa yang terjadi ketika tata kelola runtuh.",
        "Dua miskonsepsi. Satu: 'Tier hanya untuk pamer.' Tier menentukan batas ekspansi — tier 1 tidak dapat pengecualian batas maksimum pendanaan. Ini insentif regulasi yang nyata. Dua: 'Dana likuidasi = pesimisme.' Ini kehati-hatian sistemik: portofolio Rp105,63 triliun (Juli 2026, tumbuh 24,76% YoY) tidak boleh menjadi yatim piatu ketika platformnya tutup.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "4-tier + dana likuidasi = regulator mengatur 'kematian yang tertib'. Analis risiko di platform harus bisa menjawab: tier berapa kita, apa yang kurang untuk naik tier, dan apakah dana likuidasi sudah sesuai jadwal. Ini bukan teori — ini agenda rapat direksi 2026.",
      },
      hints: [
        "Naik tier = tiga tuas: kesehatan keuangan, porsi UMKM, penanganan aduan. Aduan konsumen sering jadi tuas termudah yang diabaikan.",
        "Jadwalkan pembentukan dana likuidasi sejak 2027 — Rp500 juta awal terdengar kecil sampai harus tersedia tunai.",
      ],
      reference: "4 tier = kesehatan + UMKM + aduan. Dana likuidasi: 20% ekuitas wajib min, Rp500 jt → Rp2,5 M.",
    },
    {
      id: "capacity",
      eyebrow: "Langkah 5 · Konsep",
      title: "30%: rem yang mencegah gali lubang tutup lubang",
      prose: [
        "Aturan lama yang sempat membatasi borrower hanya di tiga platform dicabut pada September 2026 — dengan syarat. Syarat kuncinya: penyelenggara menjaga kualitas analisis, tata kelola, manajemen risiko, dan TWP90 agregat maksimal 5%. Bersamaan dengan itu, OJK menekankan monitoring batas utang 30% dari pendapatan borrower: total cicilan tidak boleh melebihi 30% penghasilan.",
        "Angka 30% adalah debt service ratio (DSR) versi pinjol. Logikanya: borrower dengan penghasilan Rp10 juta/bulan maksimal mencicil Rp3 juta/bulan di semua platform gabungan. Melewati itu, probability of default melompat — bukan linear, melainkan eksponensial, karena borrower mulai memilih utang mana yang dibayar (strategic default) atau gali lubang tutup lubang.",
        "Di sinilah credit scoring fintech diuji: mayoritas borrower thin-file — tanpa riwayat kredit bank. Model harus menilai capacity (mampu membayar: penghasilan, DSR, stabilitas pekerjaan) dan willingness (mau membayar: riwayat perilaku, data alternatif) dari sinyal yang berisik: pola isi pulsa, konsistensi data, perilaku aplikasi.",
        "Dua miskonsepsi. Satu: 'Skor kredit tinggi = pasti bayar.' Skor mengukur willingness masa lalu; capacity bisa runtuh besok karena PHK. Keduanya harus dinilai. Dua: 'Penghasilan besar = capacity besar.' Penghasilan Rp50 juta dengan cicilan Rp40 juta (DSR 80%) jauh lebih berbahaya daripada penghasilan Rp8 juta dengan cicilan Rp2 juta (DSR 25%). Capacity = sisa, bukan total.",
      ],
      formula: String.raw`\text{DSR} = \frac{\text{Total cicilan per bulan}}{\text{Penghasilan per bulan}} \le 30\%`,
      formulaNote: "DSR = debt service ratio. Total cicilan = gabungan semua platform (makanya pencabutan batas 3 platform menuntut monitoring agregat). Contoh: cicilan Rp3,5 jt / penghasilan Rp10 jt = 35% → TOLAK atau turunkan limit.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Borrower ini penghasilannya Rp20 juta — aman.” Tanpa tahu total cicilannya di semua platform, angka penghasilan tidak berarti apa-apa. Inilah mengapa SLIK dan pusat data fintech (PUSDAFIL) menjadi infrastruktur kritis: capacity hanya bisa dinilai bila utang agregat terlihat.",
      },
      hints: [
        "DSR dihitung dari penghasilan BERSIH yang terverifikasi, bukan penghasilan yang dinyatakan borrower.",
        "Untuk thin-file, willingness signal (konsistensi data, perilaku) sering lebih prediktif daripada capacity yang tidak terukur.",
      ],
      reference: "DSR ≤ 30%. Capacity = sisa penghasilan, bukan total. Nilai agregat lintas platform.",
    },
    {
      id: "lab-twp90",
      eyebrow: "Langkah 6 · Lab",
      title: "Hitung TWP90 ArusDana",
      prose: [
        "Data 12 pinjaman ArusDana (outstanding dalam Rp juta, DPD dalam hari). Hitung TWP90 dan tentukan statusnya terhadap ambang 5%. Perhatikan: yang masuk pembilang hanya DPD > 90 — DPD 60 atau 45 tidak ikut, betapapun menakutkannya.",
        "Eksperimen: ubah DPD pinjaman 7 dari 60 menjadi 95 — TWP90 menjadi 5,50% → BREACH. Satu pinjaman Rp700 juta yang menua 35 hari membalikkan status seluruh platform. Inilah mengapa koleksi DPD 60–90 hari adalah pekerjaan paling bernilai di perusahaan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total`, `macet`, dan `twp90` (persen)" },
        { id: "t2", text: "Jalankan dan pastikan status tercetak" },
      ],
      expected: "TWP90: 4.80%\nStatus: WASPADA (<5%)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“DPD 90 ikut pembilang.” Definisi TWP90: DI ATAS 90 hari — DPD tepat 90 tidak masuk. Batas inklusif/eksklusif seperti ini adalah sumber klasik selisih angka antara laporan internal dan laporan regulator.",
      },
      hints: [
        "macet = jumlah outstanding dengan dpd > 90 (tanda > tegas, bukan >=).",
        "twp90 = macet / total * 100.",
      ],
      code: {
        starter: "# (id, outstanding Rp jt, DPD hari). JANGAN UBAH.\npinjaman = [\n    (1, 1200.0, 0), (2, 800.0, 30), (3, 280.0, 120),\n    (4, 1620.0, 0), (5, 120.0, 200), (6, 900.0, 15),\n    (7, 700.0, 60), (8, 1300.0, 0), (9, 80.0, 150),\n    (10, 2000.0, 5), (11, 600.0, 45), (12, 400.0, 0),\n]\n\n# TULIS KODEMU: hitung twp90 dalam persen\ntotal =\nmacet =\ntwp90 =\nprint(f\"TWP90: {twp90:.2f}%\")\nprint(\"Status: \" + (\"BREACH (>=5%)\" if twp90 >= 5 else \"WASPADA (<5%)\"))\n",
        lockLines: 9,
        solution: "# (id, outstanding Rp jt, DPD hari). JANGAN UBAH.\npinjaman = [\n    (1, 1200.0, 0), (2, 800.0, 30), (3, 280.0, 120),\n    (4, 1620.0, 0), (5, 120.0, 200), (6, 900.0, 15),\n    (7, 700.0, 60), (8, 1300.0, 0), (9, 80.0, 150),\n    (10, 2000.0, 5), (11, 600.0, 45), (12, 400.0, 0),\n]\n\n# TULIS KODEMU: hitung twp90 dalam persen\ntotal = sum(out for _, out, _ in pinjaman)\nmacet = sum(out for _, out, dpd in pinjaman if dpd > 90)\ntwp90 = macet / total * 100\nprint(f\"TWP90: {twp90:.2f}%\")\nprint(\"Status: \" + (\"BREACH (>=5%)\" if twp90 >= 5 else \"WASPADA (<5%)\"))\n",
        checks: [
          { kind: "equal", task: "t1", label: "twp90 = 4,80", msg: "(280+120+80)/10000 = 4,8%.", name: "twp90", value: 4.8, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Status WASPADA tercetak", msg: "4,8% < 5% → WASPADA.", pattern: "Status: WASPADA \\(<5%\\)" }
        ],
      },
      reference: "TWP90 = macet(DPD>90)/total. 4,8% = waspada, bukan breach.",
    },
    {
      id: "lab-pooling",
      eyebrow: "Langkah 7 · Lab",
      title: "Kalkulator pooling funds",
      prose: [
        "Tiga penyaluran ArusDana dengan tarif fee neto berbeda. Hitung fee neto total lalu pooling funds 5%. Perhatikan tarifnya: penyaluran 2 paling kecil nilainya tetapi tarifnya tertinggi — fee neto bukan sekadar fungsi ukuran.",
        "Eksperimen: naikkan tarif penyaluran 3 dari 2,5% menjadi 4% — pooling funds naik dari Rp9,38 jt menjadi Rp11,63 jt. Setiap kenaikan tarif 'membawa' kewajiban 5% yang terkunci. Pricing yang tidak memperhitungkan pooling = margin yang semu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fee_neto` dan `pooling`" },
        { id: "t2", text: "Jalankan dan pastikan angkanya tercetak" },
      ],
      expected: "Fee neto: Rp187.50 jt\nPooling funds (5%): Rp9.38 jt",
      note: {
        title: "Intuisi",
        body: "Rp9,38 juta terlihat kecil — tetapi ini per tiga penyaluran. Pada skala Rp105 triliun outstanding industri, 5% dari fee neto agregat adalah ratusan miliar rupiah yang terkunci di deposito/SBN. Pooling funds mengubah struktur modal industri, bukan sekadar pos akuntansi.",
      },
      hints: [
        "fee_neto = jumlah (nilai × tarif) tiap penyaluran.",
        "pooling = 0,05 × fee_neto.",
      ],
      code: {
        starter: "# (id, nilai penyaluran Rp jt, tarif fee neto). JANGAN UBAH.\npenyaluran = [(1, 2000.0, 0.03), (2, 1500.0, 0.035), (3, 3000.0, 0.025)]\n\n# TULIS KODEMU: fee neto total dan pooling funds (5%)\nfee_neto =\npooling =\nprint(f\"Fee neto: Rp{fee_neto:.2f} jt\")\nprint(f\"Pooling funds (5%): Rp{pooling:.2f} jt\")\n",
        lockLines: 4,
        solution: "# (id, nilai penyaluran Rp jt, tarif fee neto). JANGAN UBAH.\npenyaluran = [(1, 2000.0, 0.03), (2, 1500.0, 0.035), (3, 3000.0, 0.025)]\n\n# TULIS KODEMU: fee neto total dan pooling funds (5%)\nfee_neto = sum(nilai * tarif for _, nilai, tarif in penyaluran)\npooling = 0.05 * fee_neto\nprint(f\"Fee neto: Rp{fee_neto:.2f} jt\")\nprint(f\"Pooling funds (5%): Rp{pooling:.2f} jt\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "pooling = 9,375", msg: "0,05 × 187,5.", name: "pooling", value: 9.375, tol: 0.001 },
          { kind: "stdout_matches", task: "t2", label: "Pooling tercetak", msg: "Rp9,38 jt.", pattern: "Pooling funds \\(5%\\): Rp9\\.38 jt" }
        ],
      },
      reference: "PF = 5% × fee neto. Pricing harus dihitung setelah pooling.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Speedometer, sabuk, dan rem: kapan pakai apa",
      prose: [
        "Satu: TWP90 4,8% tren naik 0,06 poin/bulan → waspada aktif: ketatkan origination (DSR ≤ 30% ditegakkan, bukan dianjurkan), intensifkan koleksi DPD 60–90 hari — di sanalah breach bisa dicegah paling murah. Dua: TWP90 menembus 5% → breach: susun rencana aksi korektif untuk OJK, hentikan ekspansi penyaluran baru sampai kembali di bawah ambang; ini bukan pilihan. Tiga: fee naik tetapi pooling belum disisihkan → hitung 5% per penyaluran dan sisihkan sebelum dividen atau bonus diputuskan; dividen dari fee yang belum dipotong pooling = dividen dari uang yang bukan milikmu. Empat: platform tier 1 ingin ekspansi di atas batas maksimum → naikkan tier dulu (perbaiki rasio UMKM dan penanganan aduan), bukan melobi pengecualian.",
        "Aturan praktis 10 detik: lihat TWP90 + lajunya tiap pagi; setiap fee yang diakui langsung potong 5% untuk pooling; DSR > 30% = tolak. Tiga angka, satu disiplin.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Ketiga alat ini bekerja pada horizon berbeda: DSR mencegah (ex-ante), TWP90 mendeteksi (concurrent), pooling funds menanggung (ex-post). Platform yang hanya punya satu dari tiga = mengemudi dengan satu pedal.",
      },
      reference: "Cegah: DSR. Deteksi: TWP90 + laju. Tanggung: pooling funds.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Kuartal penentuan ArusDana",
      prose: [
        "Data kuartal III 2026 ArusDana: outstanding Rp2 triliun; TWP90 4,8% (naik dari 4,5% kuartal lalu); platform fee neto Rp45 miliar; pooling funds yang sudah disisihkan Rp2,0 miliar (kurang Rp250 juta dari kewajiban Rp2,25 miliar); 40% borrower memiliki DSR di atas 30%.",
        "Pertanyaan: (a) Apakah ArusDana breach? (b) Berapa kekurangan pooling funds dan dari mana menutupnya? (c) Apa tiga tindakan prioritas kuartal depan? Pembahasan: (a) Belum breach — 4,8% < 5%, tetapi runway hanya 0,2 poin dengan laju 0,15 poin/kuartal: breach diproyeksikan 1–2 kuartal lagi tanpa intervensi. (b) Kurang Rp250 juta — wajib disisihkan sebelum dividen; sumbernya dari fee kuartal berjalan, bukan cadangan lain. (c) Satu: perketat DSR — 40% borrower di atas 30% adalah bom waktu; turunkan ke <15% dalam dua kuartal. Dua: serbu DPD 60–90 hari — setiap Rp100 miliar yang dicegah menua menghemat 0,005 poin TWP90... hitung: Rp100 M/Rp2 T = 5% × (1/100) = 0,05 poin. Tiga: siapkan rencana aksi korektif sekarang, bukan saat breach — regulator menghargai kesiapan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mini-case ini adalah simulasi rapat komite risiko: angka mentah → status → kewajiban → tindakan. Analis yang bisa menjalankan rantai ini dalam 10 menit adalah analis yang dibutuhkan industri — lowongan Risk Strategy Analyst (SQL + credit risk) yang muncul 2026 meminta tepat kemampuan ini.",
      },
      reference: "Belum breach ≠ aman. Runway 0,2 poin. Tiga tindakan: DSR, koleksi 60–90, rencana korektif.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan. Fokus pada why — regulasi 2026 adalah soal logika insentif, bukan hafalan pasal.",
      ],
      tasks: [],
      summary: [
        "TWP90 = outstanding menunggak >90 hari / total outstanding; ambang 5% (SEOJK 19/2025); baca tren + runway, bukan hanya level.",
        "Pooling funds = 5% × platform fee neto per penyaluran (draft Pasal 149A); dikunci di deposito/SBN; cair atas persetujuan OJK; imbal hasil boleh dipakai operasional.",
        "4 tier = kesehatan + rasio UMKM + rasio penolakan aduan; tier 2–4 dikecualikan dari batas maksimum pendanaan.",
        "Dana persiapan likuidasi: min 20% ekuitas wajib minimum; Rp500 jt → Rp2,5 M dalam 3 tahun mulai 2027.",
        "DSR ≤ 30%: capacity = sisa penghasilan, dinilai agregat lintas platform.",
        "Tiga horizon: DSR mencegah, TWP90 mendeteksi, pooling funds menanggung.",
      ],
      next: { label: "CR28 — Climate Risk untuk Kredit", href: "/learn/cr28-climate-risk-kredit" },
      quiz: [
        {
          q: "TWP90 ArusDana 4,8%, naik 0,15 poin/kuartal. Status yang tepat?",
          options: [
            { text: "Waspada aktif: runway 0,2 poin, breach 1–2 kuartal tanpa intervensi", why: "Benar: 5 − 4,8 = 0,2 poin runway; laju 0,15/kuartal → breach segera.", correct: true },
            { text: "Aman, masih di bawah 5%", why: "Jebakan level: mengabaikan laju. 4,8% dengan tren naik ≠ aman." },
            { text: "Breach, harus lapor OJK hari ini", why: "Breach = ≥5%. 4,8% belum breach — tetapi rencana korektif sebaiknya disiapkan." },
            { text: "Tidak bisa dinilai tanpa data NPL", why: "TWP90 adalah metrik industri pinjol; NPL bank tidak relevan di sini." }
          ],
        },
        {
          q: "Pooling funds 5% dihitung dari apa?",
          options: [
            { text: "Platform fee neto per penyaluran pembiayaan", why: "Benar: Pasal 149A ayat (3) draft — 5% dari fee (net) tiap penyaluran.", correct: true },
            { text: "Total outstanding platform", why: "Itu basis TWP90, bukan pooling funds." },
            { text: "Laba bersih tahunan", why: "Pooling dihitung per penyaluran saat fee diakui, bukan dari laba tahunan." },
            { text: "Dana lender yang dikelola", why: "Itu dana lender — pooling funds adalah dana penyelenggara dari fee-nya sendiri." }
          ],
        },
        {
          q: "Pokok pooling funds boleh dipakai untuk apa?",
          options: [
            { text: "Tidak boleh dipakai bebas; cair hanya atas persetujuan OJK", why: "Benar: dikunci di deposito/SBN; hanya imbal hasilnya boleh dipakai operasional.", correct: true },
            { text: "Operasional saat platform kesulitan likuiditas", why: "Salah — justru saat itulah ia harus tetap terkunci melindungi lender." },
            { text: "Dividen bila kuartal sedang bagus", why: "Dividen diputuskan SETELAH pooling disisihkan; kelebihan pun butuh persetujuan OJK." },
            { text: "Disalurkan kembali sebagai pembiayaan baru", why: "Tidak — ia cadangan, bukan modal kerja." }
          ],
        },
        {
          q: "Borrower berpenghasilan Rp10 juta/bulan, total cicilan Rp3,5 juta/bulan. Keputusan?",
          options: [
            { text: "Tolak atau turunkan limit: DSR 35% > 30%", why: "Benar: 3,5/10 = 35% melampaui batas.", correct: true },
            { text: "Setujui: penghasilan Rp10 juta cukup besar", why: "Jebakan capacity: yang dinilai sisa (DSR), bukan total penghasilan." },
            { text: "Setujui bila skor kreditnya tinggi", why: "Skor = willingness; DSR = capacity. Keduanya harus lolos." },
            { text: "Minta agunan tambahan", why: "Pinjol umumnya tanpa agunan; solusinya limit, bukan agunan." }
          ],
        },
        {
          q: "Platform tier 1 ingin menyalurkan di atas batas maksimum (Pasal 137). Jalan yang benar?",
          options: [
            { text: "Naikkan tier dulu via kesehatan, rasio UMKM, penanganan aduan", why: "Benar: tier 2–4 dikecualikan dari batas maksimum — insentifnya memang itu.", correct: true },
            { text: "Melobi OJK untuk pengecualian khusus", why: "Pengecualian mengikuti tier, bukan lobi." },
            { text: "Menyiasati via beberapa entitas anak", why: "Itu penghindaran regulasi — temuan pengawasan." },
            { text: "Menunggu revisi POJK terbit lalu otomatis bebas", why: "Revisi mengatur tiering; kebebasan mengikuti tier yang dicapai." }
          ],
        },
        {
          q: "Mengapa TWP90 bisa turun padahal kualitas memburuk?",
          options: [
            { text: "Penyaluran baru besar-besaran mengencerkan rasio (penyebut membesar)", why: "Benar: denominasi effect — selalu baca pembilang dan penyebut.", correct: true },
            { text: "Karena ambang 5% diturunkan regulator", why: "Ambang tetap 5% (SEOJK 19/2025)." },
            { text: "Karena definisi DPD diubah", why: "Definisi >90 hari tidak berubah." },
            { text: "Tidak mungkin — TWP90 selalu jujur", why: "Justru itu miskonsepsinya: rasio bisa dimanipulasi lewat penyebut." }
          ],
        }
      ],
      reference: "TWP90 + laju. Pooling 5% fee neto, dikunci. DSR ≤ 30%. Tier membeli kebebasan.",
    },
  ],
};
