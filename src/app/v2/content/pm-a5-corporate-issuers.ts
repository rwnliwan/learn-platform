import type { V2Lesson } from "../lib/types";

const WACC_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Tiga bar WACC: 12,0 persen saat 0 persen utang, 10,72 persen saat 20 persen utang, 12,5 persen saat 60 persen utang — membentuk pola U.">
<text x="260" y="18" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">WACC membentuk pola U terhadap porsi utang</text>
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="48.6" x2="500" y2="48.6"/><line x1="60" y1="77.1" x2="500" y2="77.1"/><line x1="60" y1="105.7" x2="500" y2="105.7"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">14</text><text x="54" y="52">12</text><text x="54" y="81">10</text><text x="54" y="109">8</text><text x="54" y="224">0%</text></g>
<text x="28" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 120)">WACC</text>
<g fill="var(--c1)"><rect x="75" y="49" width="90" height="171"/><rect x="215" y="67" width="90" height="153"/><rect x="355" y="41" width="90" height="179"/></g>
<polyline points="120,49 260,67 400,41" fill="none" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6,4"/>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)" text-anchor="middle" font-weight="600"><text x="120" y="40">12,0%</text><text x="260" y="58">10,72% (teks)</text><text x="400" y="32">12,5%</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="120" y="240">0% utang</text><text x="260" y="240">20% utang</text><text x="400" y="240">60% utang</text></g>
</svg>`;

export const pma5: V2Lesson = {
  slug: "pm-a5-corporate-issuers",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A5 Corporate Issuers: Governance, WACC & Modal Kerja",
  estMinutes: 65,
  steps: [
    {
      id: "governance",
      eyebrow: "Langkah 1 · Governance",
      title: "Rem dulu, baru mesin",
      prose: [
        "PT SinarAbadi membangun pabrik baru: proyeksi akuntansi untung Rp50M/tahun. Direksi setuju. Dua tahun kemudian: krisis likuiditas — pabrik \u2018untung\u2019 tapi perusahaan kehabisan kas. Twist-nya berlapis: \u2018untung\u2019 itu setelah depresiasi (non-kas) tetapi sebelum modal kerja yang membengkak; didanai utang jangka pendek berbunga tinggi (mismatch tenor); dan tidak pernah dihitung NPV-nya.",
        "Corporate governance = sistem pengarahan dan pengendalian perusahaan: dewan komisaris/direksi, hak pemegang saham, transparansi, remunerasi. Red flag: komisaris rangkap berlebihan, transaksi afiliasi jumbo, auditor gonta-ganti, dual-class shares yang mengebiri minoritas. Governance seperti wasit: tanpa wasit independen, manajemen bisa mengutak-atik skor (laba) dan mencuri bola (tunneling ke afiliasi).",
        "Aturan profesional: diskon valuasi 20\u201330% untuk governance buruk, atau jangan sentuh sama sekali. Tidak ada growth story yang mengkompensasi tunneling. Contoh nyata: emiten tambang menjual nikel ke afiliasi pemilik $12.000/ton padahal harga pasar $18.000/ton — selisih $6.000 \u00d7 100.000 ton = $600 juta/tahun \u201cbocor\u201d.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Cek governance SEBELUM valuasi. Dual-class shares (10% modal, 51% suara) = wedge 41pp: founder menikmati kontrol penuh tetapi hanya menanggung 10% konsekuensi keputusan buruk.",
      },
      quiz: [
        {
          q: "Governance red flag terkuat?",
          options: [
            { text: "Dividen kecil", why: "Salah: dividen kecil bisa jadi pilihan alokasi yang sah." },
            { text: "Transaksi afiliasi jumbo ke perusahaan direksi", why: "Benar: tunneling via afiliasi = laba \u201cbocor\u201d ke kantong manajemen. Alasan utama diskon valuasi governance.", correct: true },
            { text: "Rapat board rutin", why: "Salah: itu justru tanda governance berjalan." },
            { text: "Situs web jelek", why: "Salah: kosmetik, bukan substansi governance." },
          ],
        },
      ],
      reference: "Governance = rem perusahaan. Red flag: afiliasi jumbo, auditor gonta-ganti, CEO duality.",
    },
    {
      id: "npv",
      eyebrow: "Langkah 2 · Capital Budgeting",
      title: "NPV: wasit terakhir proyek",
      prose: [
        "NPV = PV arus kas \u2212 investasi awal; terima jika > 0. IRR = discount rate saat NPV = 0; terima jika > hurdle rate (WACC). Payback = waktu balik modal (tetapi mengabaikan TVM — kelemahan). PI = PV/investasi; terima jika > 1.",
        "SinarAbadi: CF inkremental Rp120M/tahun 5 tahun, I0 Rp500M, WACC 12%. PV = 120 \u00d7 3,6048 = Rp432,6M. NPV = \u2212Rp67,4M \u2192 TOLAK. \u2018Untung Rp50M\u2019 = ilusi depresiasi + abaikan TVM + abaikan modal kerja. Bahkan di WACC 8%, NPV tetap \u2212Rp20,9M — masalahnya fundamental, bukan diskonto.",
        "Ingat jebakan sunk cost: \u201ckita sudah belanja Rp80M studi, sayang kalau dibatalkan\u201d — salah total. Rp80M tidak kembali apa pun keputusannya; yang dihitung hanya arus kas masa depan yang inkremental.",
      ],
      formula: String.raw`NPV = \sum_{t=1}^{N} \frac{CF_t}{(1+r)^t} - I_0`,
      formulaNote: "CF_t = arus kas inkremental tahun t (Rp120 miliar/tahun — hanya kas masa depan yang berubah karena proyek ini); r = discount rate/WACC (12%); I_0 = investasi awal (Rp500 miliar); N = umur proyek (5 tahun). Interpretasi: NPV adalah nilai tambah proyek dalam rupiah hari ini — satu-satunya kriteria yang mengukur kekayaan pemegang saham, wasit terakhir saat berkonflik dengan IRR. Contoh angka: 120 × 3,6048 − 500 = −Rp67,4 miliar → tolak, seberapa pun “untung” laba akuntansinya.",
      tasks: [
        { id: "t1", text: "Hitung `pv` arus kas Rp120M/tahun, 5 tahun, WACC 12% (Rp juta)" },
        { id: "t2", text: "Hitung `npv` (I0 = 500), cetak keduanya 1 desimal" },
      ],
      expected: "pv=432.6  npv=-67.4",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai laba akuntansi sebagai arus kas. Laba Rp50M/tahun SinarAbadi mengabaikan depresiasi (non-kas), modal kerja, dan TVM — NPV-lah yang jujur.",
      },
      hints: [
        "PV anuitas = CF \u00d7 [1 \u2212 (1+r)^\u2212N]/r.",
        "NPV = PV \u2212 investasi awal.",
        "pv = cf * (1 - (1+wacc)**-n) / wacc\nnpv = pv - i0",
      ],
      code: {
        starter: `cf, n, wacc, i0 = 120, 5, 0.12, 500\n\n# TULIS KODEMU\npv = \nnpv = \n\nprint(f"pv={pv:.1f}  npv={npv:.1f}")`,
        lockLines: 1,
        solution: `cf, n, wacc, i0 = 120, 5, 0.12, 500\n\n# TULIS KODEMU\npv = cf * (1 - (1+wacc)**-n) / wacc\nnpv = pv - i0\n\nprint(f"pv={pv:.1f}  npv={npv:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pv", value: 432.6, tol: 0.5, label: "`pv` sekitar 432.6", msg: "120 \u00d7 3,6048 = 432,6. Itu faktor anuitas 5 tahun @12%." },
          { kind: "equal", task: "t2", name: "npv", value: -67.4, tol: 0.5, label: "`npv` sekitar \u221267.4", msg: "432,6 \u2212 500 = \u221267,4 \u2192 TOLAK. Keputusan: NPV > 0 baru terima." },
          { kind: "stdout_matches", task: "t2", pattern: "pv=432\\.6\\s+npv=-67\\.4", label: "`print` menampilkan keduanya", msg: "Format: pv=...  npv=... ." },
        ],
      },
      quiz: [
        {
          q: "Proyek A: Rp10M, IRR 50%. Proyek B: Rp1M, IRR 30%. Mutually exclusive. Pilih?",
          options: [
            { text: "A (IRR tertinggi)", why: "Salah: IRR buta skala — persentase tinggi dari basis kecil bisa kalah nilai absolutnya." },
            { text: "Hitung NPV — nilai absolut yang menang", why: "Benar: konflik NPV vs IRR \u2192 NPV menang. IRR mengasumsikan reinvestasi pada IRR sendiri dan buta terhadap skala rupiah.", correct: true },
            { text: "Keduanya", why: "Salah: mutually exclusive artinya pilih satu." },
            { text: "Tolak keduanya", why: "Salah: belum ada informasi NPV negatif." },
          ],
        },
      ],
      reference: "NPV > 0 = terima. Konflik dengan IRR \u2192 NPV menang. Sunk cost selalu dicoret.",
    },
    {
      id: "eaa",
      eyebrow: "Langkah 3 · EAA",
      title: "Proyek beda umur: jangan bandingkan NPV langsung",
      prose: [
        "Proyek X: NPV 200, umur 4 tahun. Proyek Y: NPV 240, umur 6 tahun. r = 10%. NPV lebih besar \u2260 menang jika umur beda.",
        "EAA (Equivalent Annual Annuity) = NPV / faktor anuitas. EAA_X = 200/3,1699 = 63,1; EAA_Y = 240/4,3553 = 55,1 \u2192 pilih X. EAA menyamakan umur dengan mengubah NPV menjadi arus kas tahunan ekuivalen.",
      ],
      formula: String.raw`EAA = \frac{NPV}{\frac{1-(1+r)^{-N}}{r}}`,
      formulaNote: "NPV = nilai bersih proyek; penyebut = faktor anuitas [1 − (1+r)^−N]/r (3,1699 untuk 4 tahun @10%; 4,3553 untuk 6 tahun). Interpretasi: EAA adalah NPV yang “dicicil” menjadi arus kas tahunan ekuivalen — memungkinkan perbandingan adil antar proyek beda umur, yang tidak bisa dilakukan NPV langsung. Contoh angka: EAA_X = 200/3,1699 = 63,1 vs EAA_Y = 240/4,3553 = 55,1 → pilih X meski NPV_Y lebih besar.",
      tasks: [
        { id: "t1", text: "Hitung `eaa_x` (NPV 200, 4 tahun) dan `eaa_y` (NPV 240, 6 tahun), r = 10%" },
        { id: "t2", text: "Cetak keduanya 1 desimal" },
      ],
      expected: "eaa_x=63.1  eaa_y=55.1",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih Y karena NPV 240 > 200. Umur beda 2 tahun membuat perbandingan NPV langsung tidak valid — EAA yang benar.",
      },
      hints: [
        "EAA = NPV / faktor anuitas(N tahun, r).",
        "Faktor anuitas = [1 \u2212 (1+r)^\u2212N]/r.",
        "eaa_x = npv_x / ((1 - (1+r)**-t_x) / r)",
      ],
      code: {
        starter: `npv_x, t_x = 200, 4\nnpv_y, t_y = 240, 6\nr = 0.10\n\n# TULIS KODEMU\neaa_x = \neaa_y = \n\nprint(f"eaa_x={eaa_x:.1f}  eaa_y={eaa_y:.1f}")`,
        lockLines: 3,
        solution: `npv_x, t_x = 200, 4\nnpv_y, t_y = 240, 6\nr = 0.10\n\n# TULIS KODEMU\neaa_x = npv_x / ((1 - (1+r)**-t_x) / r)\neaa_y = npv_y / ((1 - (1+r)**-t_y) / r)\n\nprint(f"eaa_x={eaa_x:.1f}  eaa_y={eaa_y:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "eaa_x", value: 63.1, tol: 0.2, label: "`eaa_x` sekitar 63.1", msg: "200/3,1699 = 63,1. Faktor anuitas 4 tahun @10% = 3,1699." },
          { kind: "equal", task: "t1", name: "eaa_y", value: 55.1, tol: 0.2, label: "`eaa_y` sekitar 55.1", msg: "240/4,3553 = 55,1. Faktor anuitas 6 tahun @10% = 4,3553." },
          { kind: "stdout_matches", task: "t2", pattern: "eaa_x=63\\.1\\s+eaa_y=55\\.1", label: "`print` menampilkan keduanya", msg: "Format: eaa_x=...  eaa_y=... ." },
        ],
      },
      reference: "Umur beda \u2192 EAA, bukan NPV langsung. Pilih EAA tertinggi.",
    },
    {
      id: "wacc",
      eyebrow: "Langkah 4 · WACC + chart",
      title: "Hurdle rate: bobot pasar, utang after-tax",
      prose: [
        "WACC = w_d \u00d7 r_d(1\u2212T) + w_e \u00d7 r_e — dengan bobot nilai PASAR, bukan book. Ekuitas pasar Rp800M, utang Rp200M, Re 12%, Rd 7%, pajak 20%: WACC = 0,8\u00d712% + 0,2\u00d77%\u00d70,8 = 9,6% + 1,12% = 10,72%.",
        "Tax shield (1\u2212T) membuat utang \u2018murah\u2019 — tetapi itu bukan alasan berutang ugal-ugalan. Dan WACC perusahaan hanya valid untuk proyek dengan risiko sekelas perusahaan; proyek beda risiko butuh risk-adjusted hurdle.",
        "Cara membaca: sumbu X = porsi utang dalam struktur modal, sumbu Y = WACC (%); tiga bar = tiga struktur modal, garis putus-putus menelusuri polanya.",
        "Interpretasi: WACC turun dari 12,0% (all-equity, ilustrasi) ke 10,72% saat utang 20% — persis angka perhitungan teks — lalu naik lagi ke 12,5% saat utang 60% (ilustrasi biaya distress). Tax shield membuat utang murah di awal, tetapi di titik tertentu kenaikan biaya ekuitas dan risiko kebangkrutan membalikkan arah.",
      ],
      figure: {
        svg: WACC_SVG,
        alt: "Tiga bar WACC: 12,0 persen saat 0 persen utang, 10,72 persen saat 20 persen utang, 12,5 persen saat 60 persen utang — membentuk pola U.",
        caption: "Bar tengah = contoh perhitungan teks (E=800, D=200, Re=12%, Rd=7%, T=20% → 10,72%). Bar kiri-kanan ilustrasi: pola U muncul karena tax shield dulu menguntungkan, lalu biaya distress mendominasi.",
      },
      formula: String.raw`WACC = w_d \cdot r_d(1-T) + w_e \cdot r_e`,
      formulaNote: "w_d/w_e = bobot NILAI PASAR utang/ekuitas (0,2/0,8 — bukan book value); r_d = biaya utang pre-tax (7%); T = tarif pajak (20% — bunga bisa dikurangkan pajak = tax shield); r_e = biaya ekuitas (12%). Interpretasi: WACC adalah “harga” rata-rata modal perusahaan — hurdle rate yang harus dilampaui setiap proyek. Contoh angka: 0,2 × 7% × 0,8 + 0,8 × 12% = 1,12% + 9,6% = 10,72%.",
      tasks: [
        { id: "t1", text: "Hitung `wacc`: E=800, D=200, Re=12%, Rd=7%, T=20% (desimal)" },
        { id: "t2", text: "Cetak 4 desimal" },
      ],
      expected: "wacc=0.1072",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai bobot book value atau lupa (1\u2212T) pada biaya utang. Bobot = nilai pasar; utang selalu after-tax.",
      },
      hints: [
        "Bobot = nilai pasar dibagi total (800+200).",
        "Biaya utang after-tax = rd \u00d7 (1 \u2212 t).",
        "wacc = (d/(e+d))*rd*(1-t) + (e/(e+d))*re",
      ],
      code: {
        starter: `e, d, re, rd, t = 800, 200, 0.12, 0.07, 0.20\n\n# TULIS KODEMU\nwacc = \n\nprint(f"wacc={wacc:.4f}")`,
        lockLines: 1,
        solution: `e, d, re, rd, t = 800, 200, 0.12, 0.07, 0.20\n\n# TULIS KODEMU\nwacc = (d/(e+d))*rd*(1-t) + (e/(e+d))*re\n\nprint(f"wacc={wacc:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "wacc", value: 0.1072, tol: 1e-4, label: "`wacc` seharusnya 0.1072", msg: "0,2\u00d77%\u00d70,8 + 0,8\u00d712% = 1,12% + 9,6% = 10,72%." },
          { kind: "stdout_matches", task: "t2", pattern: "wacc=0\\.1072", label: "`print` menampilkan wacc", msg: "Format: wacc=0.1072." },
        ],
      },
      reference: "WACC = bobot pasar \u00d7 biaya. Utang after-tax. = hurdle rate proyek.",
    },
    {
      id: "ccc",
      eyebrow: "Langkah 5 · Modal Kerja",
      title: "CCC: berapa lama kasmu \u2018nyangkut\u2019",
      prose: [
        "CCC = DIO + DSO \u2212 DPO. SinarAbadi: DIO 90, DSO 75, DPO 40 \u2192 CCC 125 hari. Dengan penjualan Rp10M/hari, kas terikat = 125 \u00d7 10 = Rp1.250M — empat bulan kas \u2018nyangkut\u2019 di modal kerja.",
        "Aturan: CCC turun 30 hari = kas bebas Rp300M (pada contoh ini). Perpanjang DPO (bayar supplier lebih lambat), tekan DIO/DSO — tetapi jangan sampai merusak hubungan supplier.",
      ],
      formula: String.raw`CCC = DIO + DSO - DPO`,
      formulaNote: "DIO = hari persediaan mengendap (90); DSO = hari piutang tertagih (75); DPO = hari utang bisa ditunda (40). Interpretasi: CCC adalah berapa hari kas “nyangkut” di operasi — setiap hari berarti kebutuhan pendanaan yang harus dibayar dengan utang mahal atau ekuitas. Contoh angka: 90 + 75 − 40 = 125 hari; × penjualan Rp10 miliar/hari = Rp1.250 miliar kas terikat — empat bulan kas tidak bisa dipakai apa-apa.",
      tasks: [
        { id: "t1", text: "Hitung `ccc` dari DIO=90, DSO=75, DPO=40" },
        { id: "t2", text: "Hitung `kas` terikat (penjualan Rp10M/hari), cetak keduanya" },
      ],
      expected: "ccc=125  kas=1250",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "CCC > 100 hari = butuh pendanaan mahal untuk menutup gap kas. SinarAbadi mendanai pabrik (aset panjang) dengan utang jangka pendek — mismatch tenor yang membunuh likuiditas.",
      },
      hints: [
        "CCC = DIO + DSO \u2212 DPO.",
        "Kas terikat = CCC \u00d7 penjualan harian.",
        "ccc = dio + dso - dpo\nkas = ccc * jual_harian",
      ],
      code: {
        starter: `dio, dso, dpo = 90, 75, 40\njual_harian = 10  # Rp M/hari\n\n# TULIS KODEMU\nccc = \nkas = \n\nprint(f"ccc={ccc}  kas={kas}")`,
        lockLines: 2,
        solution: `dio, dso, dpo = 90, 75, 40\njual_harian = 10  # Rp M/hari\n\n# TULIS KODEMU\nccc = dio + dso - dpo\nkas = ccc * jual_harian\n\nprint(f"ccc={ccc}  kas={kas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ccc", value: 125, tol: 1e-9, label: "`ccc` seharusnya 125", msg: "90 + 75 \u2212 40 = 125 hari." },
          { kind: "equal", task: "t2", name: "kas", value: 1250, tol: 1e-9, label: "`kas` seharusnya 1250", msg: "125 \u00d7 10 = 1.250 (Rp M) kas terikat." },
          { kind: "stdout_matches", task: "t2", pattern: "ccc=125\\s+kas=1250", label: "`print` menampilkan keduanya", msg: "Format: ccc=...  kas=... ." },
        ],
      },
      reference: "CCC = DIO + DSO \u2212 DPO. Pendek = kas sehat.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: keputusan modal perusahaan",
      prose: [
        "Skenario 1 — Menilai proyek investasi baru. → Hitung NPV dengan WACC sebagai discount rate; terima jika > 0. 'Untung Rp50M' akuntansi bukan kriteria — SinarAbadi membuktikannya.",
        "Skenario 2 — Dua proyek beda umur. → Jangan bandingkan NPV langsung; pakai EAA = NPV ÷ faktor anuitas. NPV lebih besar bisa kalah jika umurnya lebih panjang.",
        "Skenario 3 — Menentukan hurdle rate. → WACC dengan bobot nilai pasar (bukan book) dan utang after-tax. Proyek yang risikonya beda kelas dari perusahaan butuh hurdle yang disesuaikan.",
        "Skenario 4 — Perusahaan 'untung' tetapi krisis likuiditas. → Hitung CCC = DIO + DSO − DPO; kas terikat = CCC × penjualan harian. CCC turun 30 hari = kas bebas ratusan miliar.",
        "Skenario 5 — Sebelum percaya angka manajemen. → Cek governance dulu: komisaris rangkap berlebihan, transaksi afiliasi jumbo, auditor gonta-ganti, dual-class shares. Tanpa wasit independen, skor bisa diutak-atik.",
        "Aturan praktis 10 detik: proyek → NPV; beda umur → EAA; hurdle → WACC pasar; kas nyangkut → CCC; sebelum angka → orangnya (governance).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai WACC perusahaan untuk proyek yang risikonya beda kelas. Hurdle yang terlalu rendah meloloskan proyek buruk; yang terlalu tinggi membunuh proyek bagus — keduanya menghancurkan nilai.",
      },
    },
    {
      id: "minicase-sinarabadi",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Tiga dosa SinarAbadi",
      prose: [
        "SinarAbadi: pabrik baru \u2018untung Rp50M/tahun\u2019 (akuntansi), didanai utang jangka pendek, modal kerja membengkak (CCC 125 hari). Hasil: krisis likuiditas.",
        "Tiga kesalahan keputusan modal: (1) tidak hitung NPV — memakai laba akuntansi; (2) mengabaikan modal kerja — CCC 125 hari = Rp1,25T kas terikat; (3) mismatch tenor — utang pendek untuk aset panjang.",
        "Alternatif sewa: PV sewa = 90 \u00d7 3,6048 = Rp324,4M vs PV beli Rp432,6M — sewa lebih murah Rp108M dan tanpa risiko modal kerja. Tetapi sewa = tidak ada nilai sisa dan tidak ada real option ekspansi. Pelajaran governance: board harus menuntut NPV + analisis sensitivitas + rencana pendanaan sesuai tenor sebelum setuju capex — dan pengusul proyek tidak boleh menjadi penilai NPV-nya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Capex tanpa kertas kerja NPV = maladministrasi. Pisahkan pengusul dan penilai — konflik kepentingan internal sama berbahayanya dengan eksternal.",
      },
      reference: "NPV inkremental & after-tax; sunk dicoret, opportunity dihitung; tenor pendanaan = tenor aset.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran: NPV, WACC, CCC, dan governance.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: proyek dinilai dari kas, perusahaan dari orangnya",
        body: "Dua intuisi. Satu, untuk capital budgeting: abaikan laba akuntansi, ikuti kas inkremental — dan yang paling sering dilupakan analis junior adalah modal kerja. Proyek “untung” yang mengunci kas 125 hari di piutang bisa membunuh perusahaan yang labanya sehat; NPV yang tidak memasukkan Δmodal kerja adalah fiksi yang rapi. Dua, untuk governance: cek siapa menilai siapa. Jika pengusul proyek adalah penilai NPV-nya sendiri, angka itu sudah terkontaminasi sebelum dihitung — minta penilaian independen seperti kamu meminta second opinion dokter untuk operasi besar. Heuristik emerging market: di pasar dengan proteksi minoritas lemah, diskon valuasi 20–30% untuk governance buruk bukan pesimisme — itu premi asuransi terhadap tunneling ke afiliasi. Perusahaan “murah” dengan transaksi afiliasi jumbo biasanya murah karena suatu alasan, dan alasannya sedang menunggumu di catatan kaki laporan tahunan. Ketiga: untuk event risk seperti M&A dan buyback, tanya siapa yang diuntungkan — akuisisi kemahalan yang dibayar dengan kas perusahaan adalah transfer kekayaan dari pemegang saham ke target; buyback di harga premium adalah dividen untuk yang keluar. Selalu hitung akresi atau dilusi per saham, bukan cuma narasi sinergi.",
      },
      quiz: [
        {
          q: "I0 Rp500M, CF Rp120M/tahun 5 tahun, WACC 12%. NPV?",
          options: [
            { text: "+Rp67M", why: "Salah: tanda terbalik. 120\u00d73,6048 = 432,6 < 500." },
            { text: "\u2212Rp67M (tolak!)", why: "Benar: 120\u00d73,6048 \u2212 500 = \u221267,4. \u201cUntung akuntansi\u201d menipu; NPV jujur. Keputusan: tolak.", correct: true },
            { text: "Rp0", why: "Salah: bukan impas — PV arus kas di bawah investasi." },
            { text: "+Rp100M", why: "Salah: cek faktor anuitas 5 tahun @12% = 3,6048." },
          ],
        },
        {
          q: "WACC = 0,4\u00d710%\u00d70,78 + 0,6\u00d716%. Hasil?",
          options: [
            { text: "13,0%", why: "Salah: 0,4\u00d710% + 0,6\u00d716% = 13,6% pun bukan ini — dan lupa tax shield." },
            { text: "12,72%", why: "Benar: 3,12% + 9,6% = 12,72%. Tax shield (1\u2212T) membuat utang \u201cmurah\u201d.", correct: true },
            { text: "10,0%", why: "Salah: itu cuma biaya utang pre-tax." },
            { text: "16,0%", why: "Salah: itu cuma biaya ekuitas." },
          ],
        },
        {
          q: "DIO 90, DSO 75, DPO 40. CCC dan artinya?",
          options: [
            { text: "205 hari", why: "Salah: itu DIO+DSO+DPO — DPO dikurangi, bukan ditambah." },
            { text: "125 hari — kas terikat ~4 bulan", why: "Benar: 90+75\u221240 = 125. Makin panjang = makin banyak kas \u201cnyangkut\u201d.", correct: true },
            { text: "25 hari", why: "Salah: cek rumus CCC = DIO + DSO \u2212 DPO." },
            { text: "90 hari", why: "Salah: itu cuma DIO." },
          ],
        },
        {
          q: "Ekuitas pasar 600M, utang 400M, Re 14%, Rd 8%, pajak 25%. WACC?",
          options: [
            { text: "11,6%", why: "Salah: cek bobot dan tax shield: 0,6\u00d714% + 0,4\u00d78%\u00d70,75." },
            { text: "10,8%", why: "Benar: 8,4% + 2,4% = 10,8%. Bobot pakai nilai PASAR, biaya utang setelah pajak.", correct: true },
            { text: "12,0%", why: "Salah: bukan rata-rata sederhana." },
            { text: "9,6%", why: "Salah: cek kembali perhitungan bobot \u00d7 biaya." },
          ],
        },
      ],
      summary: [
        "Governance: rem sebelum mesin — afiliasi jumbo, auditor gonta-ganti, CEO duality = red flags.",
        "NPV > 0 terima; konflik dengan IRR \u2192 NPV menang; umur beda \u2192 EAA.",
        "Arus kas inkremental: sunk cost dicoret, opportunity cost dihitung.",
        "WACC = bobot pasar \u00d7 biaya (utang after-tax) = hurdle rate.",
        "CCC = DIO + DSO \u2212 DPO — pendek = kas sehat; tenor pendanaan = tenor aset.",
      ],
      next: { label: "PM-A5B — Corporate Issuers: Struktur Modal & Kebijakan Dividen", href: "/v2/learn/pm-a5b-struktur-modal" },
    },
  ],
};
