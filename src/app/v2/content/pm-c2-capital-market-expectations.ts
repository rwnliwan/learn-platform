import type { V2Lesson } from "../lib/types";

// Building blocks expected return per kelas aset (Grinold-Kroner).
const GK_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Building blocks expected return: saham IHSG 10,5 persen dari dividend yield 2,5 growth 5 inflasi 3; valuasi mahal turun ke 7,7 persen; obligasi SBN 6,8 persen.">
<text x="260" y="16" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">Building blocks: DY + growth riil + inflasi ± repricing</text>
<g stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"><line x1="140" y1="28" x2="140" y2="215"/><line x1="290" y1="28" x2="290" y2="215"/><line x1="440" y1="28" x2="440" y2="215"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="140" y="232">0%</text><text x="290" y="232">5%</text><text x="440" y="232">10%</text></g>
<g font-size="10.5" fill="var(--text)" font-family="var(--font-ui)"><text x="8" y="50">Saham IHSG (base)</text><text x="8" y="110">Saham IHSG (valuasi mahal)</text><text x="8" y="170">Obligasi SBN 10th</text></g>
<rect x="140" y="56" width="75" height="30" fill="var(--c1)"/><rect x="215" y="56" width="150" height="30" fill="var(--c2)"/><rect x="365" y="56" width="90" height="30" fill="var(--c3)"/>
<g font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="177.5" y="48">DY 2,5%</text><text x="290" y="48">g 5%</text><text x="410" y="48">inflasi 3%</text></g>
<text x="460" y="76" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">10,5%</text>
<rect x="140" y="116" width="75" height="30" fill="var(--c1)"/><rect x="215" y="116" width="150" height="30" fill="var(--c2)"/><rect x="365" y="116" width="90" height="30" fill="var(--c3)"/><rect x="371" y="116" width="84" height="30" fill="var(--c4)" opacity="0.55"/>
<line x1="371" y1="108" x2="371" y2="152" stroke="var(--text)" stroke-width="1.5" stroke-dasharray="4,3"/>
<text x="413" y="110" font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">repricing −2,8%</text>
<text x="460" y="136" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">7,7%</text>
<rect x="140" y="176" width="204" height="30" fill="var(--c2)" opacity="0.55"/>
<text x="242" y="195" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">yield 6,8%</text>
</svg>`;

export const pmc2: V2Lesson = {
  slug: "pm-c2-capital-market-expectations",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C2 — Capital Market Expectations",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-ramalan-2020",
      eyebrow: "Langkah 1 · Cerita",
      title: "Ramalan \u2018pasti\u2019 yang salah dua kali",
      prose: [
        "Desember 2019: konsensus analis \u2014 \u201C2020: growth stabil, saham +8%.\u201D Maret 2020: COVID, pasar \u221235% dalam sebulan. Desember 2020: pasar +16% setahun. Semua ramalan salah \u2014 dua kali.",
        "Yang salah bukan framework-nya, melainkan ekspektasi presisi. Capital Market Expectations (CME) yang benar = rentang skenario + probabilitas, bukan angka tunggal. Peramal 2019 yang berkata \u201C+8% \u00B1 25%\u201D adalah jujur; yang berkata \u201C+8%\u201D melakukan bohong presisi.",
        "CME adalah ekspektasi return, risiko, dan korelasi jangka panjang (10+ tahun) per kelas aset \u2014 prakiraan iklim, bukan cuaca. Kegunaannya bukan untuk tepat, melainkan untuk sizing dan alokasi yang robust.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CKonsensus analis (+8%) = ekspektasi terbaik.\u201D Konsensus adalah herding \u2014 semua orang membaca data yang sama. Jadikan titik awal, bukan kebenaran; selalu tanya apa yang tidak dilihat konsensus (pre-mortem).",
      },
      reference: "CME yang baik = titik + rentang + probabilitas + asumsi eksplisit.",
    },
    {
      id: "framework-grinold-kroner",
      eyebrow: "Langkah 2 · Framework + chart",
      title: "Dari GDP ke return: Grinold-Kroner",
      prose: [
        "Rantai CME: GDP riil \u2192 earnings growth (jangka panjang \u2248 GDP + inflasi) \u2192 return saham = dividend yield + growth + perubahan valuasi. Untuk obligasi lebih sederhana: yield awal adalah prediktor return 10-tahunan terbaik.",
        "Dekomposisi Grinold-Kroner membongkar return saham menjadi komponen yang masing-masing bisa diestimasi terpisah \u2014 transparan dan bisa di-debug. Contoh IHSG: dividend yield 2,5%, growth riil 5% (GDP), inflasi 3%, repricing 0 (asumsi netral) \u2192 E(R) nominal \u2248 10,5%.",
        "Namun valuasi awal menentukan separuh ekspektasi. Jika pasar kini P/E 20 (mahal) dan mean-revert ke 15 dalam 10 tahun, repricing \u2248 \u22122,8% per tahun \u2192 E(R) turun ke 7,7%. Pelajaran: valuasi mahal kini adalah pajak atas return masa depan. Contoh obligasi: yield 5%, durasi 8, yield naik ke 6% \u2192 return 1 tahun = 5% \u2212 8\u00D71% = \u22123%. Yield \u2260 return jika suku bunga berubah.",
        "Cara membaca: batang horizontal = persen expected return; bar saham dipecah menjadi building blocks-nya, bar obligasi memakai yield awal.",
        "Interpretasi: E(R) saham IHSG 10,5% = 2,5% + 5% + 3% — transparan per komponen sehingga bisa di-debug; tetapi valuasi mahal kini memangkasnya lewat repricing −2,8% menjadi 7,7%, nyaris menyentuh ekspektasi obligasi SBN 6,8% yang jangkarnya sekadar yield awal.",
      ],
      figure: {
        svg: GK_SVG,
        alt: "Building blocks expected return per kelas aset: saham 10,5 persen, turun ke 7,7 persen bila valuasi mahal; obligasi 6,8 persen.",
        caption: "Building blocks expected return: saham IHSG 10,5% (2,5+5+3), turun ke 7,7% bila valuasi mahal; obligasi SBN 6,8%.",
      },
      formula: String.raw`E(R) \approx DY + g + \Delta PE`,
      formulaNote: "DY = dividend yield kini; g = growth earnings/dividen (≈ GDP riil jangka panjang + inflasi); ΔPE = perubahan valuasi (asumsikan 0 untuk jangka panjang \u2014 jangan andalkan multiple expansion).",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CReturn historis 10% \u2192 ekspektasi 10%.\u201D Salah jika valuasi kini mahal, rezim suku bunga berbeda, atau ada survivorship bias. Historis adalah bahan baku, bukan jawaban \u2014 sesuaikan dengan repricing valuasi dan rezim.",
      },
      reference: "Obligasi: percaya YTM. Saham: bangun via Grinold-Kroner.",
    },
    {
      id: "lab-grinold-kroner",
      eyebrow: "Langkah 3 · Lab Grinold-Kroner",
      title: "Bongkar mesin return",
      prose: [
        "Hitung expected return nominal via Grinold-Kroner dengan angka IHSG tadi: dividend yield 2,5%, growth riil 5%, inflasi 3%, repricing 0. Ubah REPRICING menjadi \u22120,028 untuk melihat efek valuasi mahal yang mean-revert.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `er` (expected return nominal, desimal)" },
        { id: "t2", text: "Cetak dekomposisi dan hasilnya dengan `print`" },
      ],
      expected: "E(R) nominal = 2.5% + 5% + 3% + (0.0%) = 10.5%",
      hints: [
        "Jumlahkan keempat komponen: DY + G_RIIL + INFLASI + REPRICING.",
        "Format persen di Python: f\"{er:.1%}\".",
        "er = DY + G_RIIL + INFLASI + REPRICING",
      ],
      code: {
        starter: `# Grinold-Kroner: E(R) = DY + g_riil + inflasi + repricing\nDY = 0.025        # dividend yield\nG_RIIL = 0.05     # growth riil (GDP)\nINFLASI = 0.03\nREPRICING = 0.0   # coba ubah ke -0.028!\n\n# TULIS KODEMU\ner = \n\nprint(f"E(R) nominal = {DY:.1%} + {G_RIIL:.0%} + {INFLASI:.0%} + ({REPRICING:.1%})")\nprint(f"           = {er:.1%}")`,
        lockLines: 4,
        solution: `# Grinold-Kroner: E(R) = DY + g_riil + inflasi + repricing\nDY = 0.025        # dividend yield\nG_RIIL = 0.05     # growth riil (GDP)\nINFLASI = 0.03\nREPRICING = 0.0   # coba ubah ke -0.028!\n\n# TULIS KODEMU\ner = DY + G_RIIL + INFLASI + REPRICING\n\nprint(f"E(R) nominal = {DY:.1%} + {G_RIIL:.0%} + {INFLASI:.0%} + ({REPRICING:.1%})")\nprint(f"           = {er:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "er", value: 0.105, tol: 1e-9, label: "`er` = 0.105", msg: "0,025 + 0,05 + 0,03 + 0 = 0,105. Jumlahkan keempat komponen." },
          { kind: "stdout_matches", task: "t2", pattern: "10\\.5%", label: "`print` menampilkan 10.5%", msg: "Hasil akhir harus tercetak sebagai 10.5%." },
        ],
      },
      reference: "Repricing \u2192 0 jangka panjang, tetapi dominan dalam 3\u20135 tahun.",
    },
    {
      id: "taylor-rule",
      eyebrow: "Langkah 4 · Taylor rule",
      title: "Membaca bank sentral",
      prose: [
        "Taylor rule memperkirakan suku bunga \u2018wajar\u2019 dari inflasi dan output gap: i = r* + \u03C0 + 0,5(\u03C0 \u2212 \u03C0*) + 0,5(y \u2212 y*). Ini rule of thumb, bukan autopilot \u2014 bank sentral tetap punya judgment \u2014 tetapi ia adalah jangkar ekspektasi yang jujur.",
        "Contoh: r* = 2%, inflasi 4%, target 3%, output gap +1%. Maka i = 2 + 4 + 0,5(1) + 0,5(1) = 7%. Jika BI rate aktual 6%, stance-nya longgar (1% di bawah rule) \u2014 mendukung aset risiko, tetapi waspada inflasi dan rupiah. Jika inflasi naik ke 6%, rule menjadi 9% \u2192 ekspektasi pengetatan agresif \u2192 kurangi durasi.",
        "Sinyal pasar lain yang dibaca bersamaan: kurva yield, credit spread, dan VIX. Inversi kurva 2s10s (yield 2 tahun di atas 10 tahun) adalah sinyal klasik risiko resesi \u2014 pasar bertaruh suku bunga akan dipotong, dengan timing 6\u201324 bulan.",
      ],
      formula: String.raw`i = r^* + \pi + 0{,}5(\pi - \pi^*) + 0{,}5(y - y^*)`,
      formulaNote: "r* = real rate netral (≈ 1\u20132%); π* = target inflasi; (y − y*) = output gap.",
      tasks: [
        { id: "t1", text: "Hitung `rule` dari parameter yang diberikan" },
        { id: "t2", text: "Tentukan `stance` (\"KETAT\"/\"LONGGAR\"/\"NETRAL\") dan cetak" },
      ],
      expected: "rule=7.00%  stance=LONGGAR",
      hints: [
        "rule = R_STAR + INFLASI + 0.5*(INFLASI - PI_STAR) + 0.5*GAP.",
        "Bandingkan dengan AKTUAL: selisih > 0,5% \u2192 KETAT; < \u22120,5% \u2192 LONGGAR.",
        "stance = \"LONGGAR\" if selisih < -0.005 else ...",
      ],
      code: {
        starter: `# Taylor rule: i = r* + pi + 0.5*(pi - pi*) + 0.5*(gap)\nR_STAR, PI_STAR = 0.02, 0.03\nINFLASI, GAP = 0.04, 0.01\nAKTUAL = 0.06  # BI rate kini\n\n# TULIS KODEMU\nrule = \nselisih = AKTUAL - rule\nstance = \n\nprint(f"rule={rule:.2%}  stance={stance}")`,
        lockLines: 3,
        solution: `# Taylor rule: i = r* + pi + 0.5*(pi - pi*) + 0.5*(gap)\nR_STAR, PI_STAR = 0.02, 0.03\nINFLASI, GAP = 0.04, 0.01\nAKTUAL = 0.06  # BI rate kini\n\n# TULIS KODEMU\nrule = R_STAR + INFLASI + 0.5*(INFLASI - PI_STAR) + 0.5*GAP\nselisih = AKTUAL - rule\nstance = "KETAT" if selisih > 0.005 else "LONGGAR" if selisih < -0.005 else "NETRAL"\n\nprint(f"rule={rule:.2%}  stance={stance}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rule", value: 0.07, tol: 1e-9, label: "`rule` = 0.07", msg: "0,02 + 0,04 + 0,5\u00D70,01 + 0,5\u00D70,01 = 0,07." },
          { kind: "equal", task: "t2", name: "stance", value: "LONGGAR", label: "`stance` = LONGGAR", msg: "Aktual 6% < rule 7% \u2192 longgar: dukung aset risiko, waspada inflasi." },
          { kind: "stdout_matches", task: "t2", pattern: "rule=7\\.00%\\s+stance=LONGGAR", label: "`print` menampilkan rule dan stance", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Rule di atas aktual \u2192 siaga pengetatan; di bawah \u2192 longgar.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Kuis tengah",
      title: "Cek cepat: Taylor dan sinyal",
      prose: ["Dua pertanyaan sebelum masuk ke jebakan forecasting."],
      note: {
        title: "Intuisi: praktisi memperlakukan ekspektasi sebagai beban bukti",
        body: "Lima heuristik dari meja investasi sungguhan. Pertama, beban bukti ada pada yang menyimpang dari base rate: kalau modelmu bilang saham Indonesia akan return 14% padahal base rate historisnya 10% dengan valuasi mahal kini, modelmulah yang harus membuktikan diri — bukan sebaliknya. Kedua, bedakan “ekspektasi untuk alokasi” dari “ekspektasi untuk timing”: yang pertama boleh kasar (urutan kelas aset yang benar sudah cukup), yang kedua menuntut presisi yang hampir tidak pernah ada — kebanyakan kerugian CME datang dari memakai ekspektasi alokasi untuk bertaruh timing. Ketiga, tulis tanggal kedaluwarsa di setiap angka: “E(R) 10,5% — berlaku selama valuasi dan rezim tidak berubah material; review tiap ada pergeseran yield 150bp atau lebih.” Ekspektasi tanpa tanggal kedaluwarsa adalah ramalan abadi yang diam-diam usang. Keempat, bedakan ketidakpastian yang informasinya bisa dibeli dari yang tidak: data positioning dan skew opsi memberi informasi soal sentimen jangka pendek \u2014 murah dan berguna untuk tilt taktis; tidak ada data yang memberi presisi soal return 10 tahun \u2014 jangan bayar mahal untuk itu. Kelima, dokumentasikan bukan hanya angkanya tetapi juga apa yang akan membuatmu mengubahnya; ekspektasi tanpa kondisi revisi adalah dogma.",
      },
      tasks: [],
      quiz: [
        {
          q: "r* = 2%, inflasi 4%, target 3%, output gap +1%. Berapa Taylor rule?",
          options: [
            { text: "6%", why: "Itu BI rate aktual di contoh, bukan hasil rule." },
            { text: "7%", why: "Tepat: 2 + 4 + 0,5(1) + 0,5(1) = 7%. Aktual 6% \u2192 stance longgar.", correct: true },
            { text: "8%", why: "Kelebihan 1 poin \u2014 cek lagi perkalian 0,5-nya." },
            { text: "5%", why: "Terlalu rendah; komponen inflasi saja sudah 4% + r* 2%." },
          ],
        },
        {
          q: "Kurva yield 2s10s terinversi (yield 2 tahun > 10 tahun). Sinyalnya?",
          options: [
            { text: "Growth kuat ke depan", why: "Salah: inversi justru berarti pasar mengharapkan suku bunga turun." },
            { text: "Risiko resesi \u2014 pasar bertaruh rate akan dipotong", why: "Tepat: ekspektasi pemotongan rate = antisipasi perlambatan. Timing 6\u201324 bulan.", correct: true },
            { text: "Inflasi akan melonjak", why: "Salah: ekspektasi inflasi tinggi biasanya menaikkan yield tenor panjang, bukan menginversi." },
            { text: "Tidak ada sinyal", why: "Salah: inversi adalah salah satu prediktor resesi yang paling banyak diteliti." },
          ],
        },
      ],
    },
    {
      id: "jebakan-forecasting",
      eyebrow: "Langkah 5 · Jebakan forecasting",
      title: "Mengapa peramal gagal \u2014 dan obatnya",
      prose: [
        "Empat bias peramal: overconfidence (rentang terlalu sempit), anchoring (terpaku pada data kini), availability (krisis terakhir mendominasi ingatan), dan herding (ikut konsensus karena aman). Obatnya tiga: skenario (base/bull/bear + probabilitas eksplisit), pre-mortem (\u201Cbayangkan sudah gagal \u2014 kenapa?\u201D), dan base rate (sejarah kelas aset, bukan cerita).",
        "Contoh skenario: bull +20% (prob 25%), base +7% (50%), bear \u221215% (25%). Ekspektasi = 0,25\u00D720 + 0,5\u00D77 + 0,25\u00D7(\u221215) = 4,75% \u2014 lebih rendah dari base 7% karena asimetri: bear lebih dalam dari bull. Ekspektasi \u2260 skenario base. Dan ingat: probabilitas adalah penilaian, bukan fakta \u2014 dokumentasikan asumsinya.",
        "Contoh rentang: ekspektasi 7%, vol 15% \u2192 rentang 68% = \u22128% hingga +22%; rentang 95% = \u221223% hingga +37%. Realisasi \u221220% adalah normal (dalam 95%), bukan \u201Cgagal\u201D. Klien yang paham rentang tidak panik saat \u221215%. Pre-mortem satu jam lebih berharga dari model seratus halaman: ia memaksa tim menyiapkan proteksi ekor yang murah saat tenang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CVolatilitas rendah = aman.\u201D Vol rendah adalah ketenangan, bukan keamanan \u2014 bahkan bisa berarti komplasensi: risiko menumpuk diam-diam. CME harus memasukkan rezim, bukan mengekstrapolasi ketenangan.",
      },
      reference: "Template CME 1 halaman: skenario + komponen GK + rentang + 3 asumsi kunci + pre-mortem.",
    },
    {
      id: "minicase-konsensus",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Apakah \u221235% berarti CME \u2018gagal\u2019?",
      prose: [
        "Kembali ke 2020: konsensus Desember 2019 \u201C+8%\u201D tanpa rentang. Maret 2020: \u221235%. Manajer yang percaya +8% panik jual di dasar.",
        "Bandingkan dengan CME yang jujur: \u201C+8% \u00B1 25%\u201D. Realisasi \u221235% berjarak 43 poin dari titik \u2014 sekitar 1,7\u03C3. Ekstrem, tetapi bukan di luar model. Inilah nilai rentang: ia mengubah \u201Ckegagalan memalukan\u201D menjadi \u201Cskenario yang sudah dipikirkan\u201D. Manajer dengan rentang tetap tenang karena sudah siap; manajer dengan titik tunggal merasa dikhianati.",
        "Rancang proses CME untuk tim investasi: (1) kumpulkan \u2014 historis + forward-looking + survei; (2) triangulasi \u2014 ketiganya sepakat atau bertentangan? Jika bertentangan, rendahkan keyakinan dan lebarkan rentang; (3) susun skenario base/bull/bear + probabilitas; (4) pre-mortem dengan devil\u2019s advocate; (5) dokumentasikan asumsi tertulis; (6) review kuartalan, bukan harian. Proses lebih penting dari angka.",
      ],
      tasks: [],
      reference: "Nilai CME = keputusan yang dihasilkan, bukan akurasi titiknya.",
    },

    {
      id: "ketidakpastian-estimasi",
      eyebrow: "Langkah 7 · Estimasi tingkat lanjut",
      title: "Ekspektasi juga punya error bar",
      prose: [
        "Rata-rata return historis 10% dari data 50 tahun terlihat meyakinkan \u2014 sampai dihitung standard error-nya. Dengan volatilitas tahunan 20%, SE(mean) = 20%/√50 ≈ 2,8%, jadi interval 95% untuk \u201Ctrue mean\u201D adalah 10% ± 5,6% \u2014 rentangnya 4,4% hingga 15,6%. Lima puluh tahun data pun masih menyisakan ketidakpastian sebesar itu; dengan 20 tahun data, SE-nya 4,5% dan intervalnya 1% hingga 19%. Inilah kenapa optimasi portofolio yang menelan ekspektasi mentah-mentah meledak: ia menganggap 10,0% jauh lebih baik dari 9,5%, padahal keduanya tidak bisa dibedakan secara statistik.",
        "Praktisi menyikapi ketidakpastian estimasi dengan tiga alat. Pertama, shrinkage: tarik estimasi ekstrem menuju rata-rata besar (grand mean). Contoh: modelmu menghasilkan ekspektasi 14% untuk satu kelas aset sementara rata-rata lintas-aset 8% \u2014 dengan shrinkage 50%, pakai 11%. Aturan kasarnya: makin pendek data dan makin ekstrem angkanya, makin besar shrinkage-nya. Kedua, Bayesian blending: gabungkan prior (misalnya equilibrium return dari CAPM) dengan view-mu, dibobot oleh keyakinan. View kuat dengan data lemah = bobot kecil; inilah intuisi di balik Black-Litterman yang dipakai manajer institusi.",
        "Ketiga, uji sensitivitas alokasi: jalankan optimasi tiga kali \u2014 dengan ekspektasi base, base −2%, dan base +2%. Jika alokasi optimalnya berubah drastis (misalnya saham melonjak dari 40% ke 80%), maka alokasimu rapuh terhadap error estimasi dan harus disederhanakan: batasi bobot (misalnya tiap kelas aset 10\u201360%), atau pakai risk parity sebagai jangkar. Alokasi yang hanya optimal di satu titik ekspektasi adalah alokasi yang salah di hampir semua titik lainnya.",
        "Satu jebakan khusus Indonesia: data IHSG yang \u201Cpanjang\u201D pun mengandung perubahan rezim \u2014 krisis 1998, taper tantrum 2013, COVID 2020. Rata-rata yang mencampur tiga rezim berbeda bukan ekspektasi rezim kini. Praktik yang jujur: laporkan ekspektasi per rezim (\u201Cdalam rezim inflasi rendah: 9\u201311%; dalam rezim pengetatan: 5\u20137%\u201D) atau beri bobot lebih pada data 10\u201315 tahun terakhir dengan penyesuaian valuasi awal. Data lama bukan sampah \u2014 ia bahan base rate \u2014 tetapi ia bukan cermin masa kini.",
      ],
      formula: String.raw`SE(\bar{r}) = \frac{\sigma}{\sqrt{n}}`,
      formulaNote: "SE = standard error dari estimasi rata-rata return: σ = volatilitas tahunan kelas aset, n = jumlah tahun data. Dengan σ = 20% dan n = 50 tahun, SE ≈ 2,8% \u2014 artinya beda ekspektasi 1\u20132% antar kelas aset umumnya tidak signifikan secara statistik. Implikasinya: jangan biarkan optimizer membedakan hal yang tidak bisa dibedakan data.",
      tasks: [],
      reference: "Shrinkage + Bayesian blend + uji sensitivitas: alokasi harus tahan terhadap error estimasi.",
    },
    {
      id: "pendekatan-obligasi",
      eyebrow: "Langkah 8 · Obligasi tingkat lanjut",
      title: "Membedah return obligasi: yield, roll-down, dan risiko kredit",
      prose: [
        "YTM adalah prediktor return 10-tahunan terbaik \u2014 tetapi return 1-tahunan obligasi punya tiga komponen yang perlu dibongkar: carry (kupon/yield yang dikantongi), roll-down (obligasi yang menua turun ke yield tenor lebih pendek yang biasanya lebih rendah \u2014 keuntungannya ≈ slope kurva × durasi), dan perubahan harga akibat pergeseran yield (aproksimasi: −durasi × Δyield). Contoh SBN 10 tahun: yield 6,8%, durasi 7,5. Jika yield naik 100bp dalam setahun: return ≈ 6,8% − 7,5×1% = −0,7%. Jika yield turun 100bp: 6,8% + 7,5% = 14,3%. Asimetri inilah yang membuat durasi menjadi taruhan arah suku bunga.",
        "Komponen keempat untuk obligasi korporasi: expected credit loss ≈ probabilitas default × loss given default. Obligasi korporasi Indonesia rating A: yield 8,2% vs SBN 6,8% \u2014 spread 140bp. Jika PD tahunan 0,8% dan LGD 60%, expected loss ≈ 0,48% per tahun. Spread bersih risiko ≈ 0,9% \u2014 itulah \u201Cbayaran\u201D riil untuk risiko kredit dan ilikuiditasnya. Praktisi memakai spread bersih ini (bukan spread bruto) saat membandingkan dengan ekspektasi kelas aset lain.",
        "Untuk portofolio dana pensiun atau asuransi Indonesia, satu angka tambahan yang wajib dihitung: break-even yield change = YTM / durasi. SBN di atas: 6,8%/7,5 ≈ 0,9% \u2014 yield boleh naik 90bp dalam setahun sebelum return menjadi negatif. Angka ini adalah \u201Cbantalan\u201D obligasi; bandingkan dengan volatilitas historis yield (misalnya ±120bp per tahun) untuk menilai apakah bantalannya cukup. Jika tidak cukup, turunkan durasi atau terima bahwa tahun itu bisa merah.",
      ],
      tasks: [],
      reference: "Return obligasi = carry + roll-down − durasi×Δyield − expected credit loss.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "CME = ekspektasi 10+ tahun per kelas aset; rantai GDP \u2192 earnings \u2192 return; iklim, bukan cuaca.",
        "Grinold-Kroner: DY + g + inflasi \u00B1 repricing; valuasi mahal kini = pajak atas return masa depan; obligasi memakai YTM.",
        "Taylor rule menjangkar ekspektasi kebijakan moneter; aktual vs rule menentukan stance ketat/longgar.",
        "Format jujur: skenario + probabilitas + rentang; obat bias = skenario, pre-mortem, base rate.",
        "Konsensus adalah herding; historis tanpa penyesuaian valuasi dan rezim bukan jawaban.",
      ],
      next: { label: "C3 \u2014 Asset Allocation", href: "/v2/learn/pm-c3-asset-allocation" },
      quiz: [
        {
          q: "Volatilitas tahunan 20%, data 50 tahun, rata-rata historis 10%. SE estimasi mean dan implikasinya?",
          options: [
            { text: "SE \u2248 2,8% \u2014 beda ekspektasi 1\u20132% antar-aset umumnya tak signifikan", why: "Tepat: 20%/√50 ≈ 2,8%. Jangan biarkan optimizer membedakan hal yang tak bisa dibedakan data.", correct: true },
            { text: "SE \u2248 0,4% \u2014 estimasi sangat presisi", why: "Salah hitung: 20%/√50 ≈ 2,8%, bukan 0,4%. Lima puluh tahun data pun masih berisik." },
            { text: "SE = 20% \u2014 sama dengan volatilitas", why: "Salah: SE(mean) = σ/√n, jauh lebih kecil dari σ. Itu bedanya ketidakpastian rata-rata vs ketidakpastian satu tahun." },
            { text: "Tidak bisa dihitung tanpa data mentah", why: "Salah: rumusnya hanya butuh σ dan n \u2014 keduanya tersedia." },
          ],
        },
        {
          q: "SBN 10 thn: yield 6,8%, durasi 7,5. Yield naik 100bp dalam setahun. Perkiraan return?",
          options: [
            { text: "\u22486,8%", why: "Salah: itu hanya carry; perubahan harga dari kenaikan yield belum dihitung." },
            { text: "\u2248\u22120,7%", why: "Tepat: 6,8% − 7,5×1% = −0,7%. Durasi mengubah kenaikan yield menjadi kerugian harga.", correct: true },
            { text: "\u2248\u22127,5%", why: "Salah: lupa menambahkan carry 6,8%. Kerugian harga 7,5% dikurangi carry." },
            { text: "\u224814,3%", why: "Itu skenario yield TURUN 100bp (6,8% + 7,5%) \u2014 kebalikannya." },
          ],
        },
        {
          q: "Dividend yield 2,5%, growth riil 5%, inflasi 3%, repricing 0. E(R)?",
          options: [
            { text: "7,5%", why: "Salah jumlah: 2,5 + 5 + 3 = 10,5, bukan 7,5." },
            { text: "10,5%", why: "Tepat: 2,5 + 5 + 3 + 0 = 10,5%. Jika P/E mahal dan mean-revert, kurangi ~2,8% \u2192 7,7%.", correct: true },
            { text: "5%", why: "Itu hanya komponen growth riil; dividend yield dan inflasi belum masuk." },
            { text: "13,5%", why: "Kelebihan 3 poin \u2014 cek lagi penjumlahan komponennya." },
          ],
        },
        {
          q: "Prediktor return obligasi 10-tahunan terbaik?",
          options: [
            { text: "View analis", why: "Salah: opini kalah dari matematika untuk obligasi." },
            { text: "YTM kini", why: "Tepat: YTM kini menjelaskan ~90% variasi return 10-tahunan.", correct: true },
            { text: "Rating kredit", why: "Rating bicara risiko gagal bayar, bukan ekspektasi return." },
            { text: "Besar kupon", why: "Kupon hanya satu komponen; YTM mencakup kupon + harga + reinvestasi." },
          ],
        },
        {
          q: "Obat paling efektif untuk overconfidence dalam forecasting?",
          options: [
            { text: "Model yang lebih kompleks", why: "Salah: kompleksitas justru sering menambah overconfidence." },
            { text: "Skenario + pre-mortem + base rate", why: "Tepat: tiga skenario berprobabilitas plus pre-mortem satu jam mengalahkan model 100 halaman.", correct: true },
            { text: "Ikut konsensus", why: "Salah: konsensus = herding, bukan obat bias." },
            { text: "Abaikan forecasting", why: "Salah: alokasi tetap butuh ekspektasi \u2014 yang dibutuhkan adalah disiplin, bukan penghindaran." },
          ],
        },
        {
          q: "CME-mu: \u201C+8% \u00B1 25%\u201D. Realisasi \u221235%. Apakah CME-mu \u2018gagal\u2019?",
          options: [
            { text: "Ya \u2014 meleset 43 poin", why: "Salah ukuran: yang dinilai bukan jarak titik, melainkan apakah realisasi masih dalam distribusi yang dinyatakan." },
            { text: "Tidak \u2014 sekitar 1,7\u03C3 dari titik; inilah gunanya rentang", why: "Tepat: ekstrem tetapi bukan di luar model. Rentang mengubah kegagalan menjadi skenario yang sudah dipikirkan.", correct: true },
            { text: "Ya \u2014 seharusnya tepat", why: "Salah ekspektasi: tidak ada CME yang tepat; nilainya ada pada keputusan yang dihasilkan." },
            { text: "Tidak \u2014 karena konsensus juga salah", why: "Alasan yang salah: konsensus salah tidak membuat CME-mu benar. Yang benar adalah logika rentangnya." },
          ],
        },
      ],
    },
  ],
};
