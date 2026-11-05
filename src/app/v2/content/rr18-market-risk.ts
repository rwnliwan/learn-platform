import type { V2Lesson } from "../lib/types";

const FIG_VAR = `<svg viewBox="0 0 480 250" role="img" aria-label="Garis P&amp;L harian 20 hari dengan garis VaR; tiga titik menembus VaR.">
<g font-family="var(--font-ui)">
<line x1="40" y1="200" x2="460" y2="200" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="40" y1="120" x2="460" y2="120" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="40" y1="40" x2="460" y2="40" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="36" y="204" font-size="10" fill="var(--chart-text)" text-anchor="end">0</text>
<text x="36" y="124" font-size="10" fill="var(--chart-text)" text-anchor="end">-5</text>
<text x="36" y="44" font-size="10" fill="var(--chart-text)" text-anchor="end">-10</text>
<polyline points="40,180 61,170 82,185 103,160 124,175 145,190 166,165 187,178 208,150 229,60 250,172 271,168 292,55 313,175 334,162 355,50 376,170 397,182 418,166 439,174" fill="none" stroke="var(--c1)" stroke-width="2"/>
<line x1="40" y1="120" x2="460" y2="120" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="456" y="112" font-size="11" fill="var(--c4)" text-anchor="end">VaR 99% = -5,0</text>
<circle cx="229" cy="60" r="5" fill="var(--c4)"/><circle cx="292" cy="55" r="5" fill="var(--c4)"/><circle cx="355" cy="50" r="5" fill="var(--c4)"/>
<text x="240" y="30" font-size="11" fill="var(--chart-text)" text-anchor="middle">3 titik di bawah VaR = 3 exceptions</text>
</g>
</svg>`;

export const rr18: V2Lesson = {
  slug: "rr18-market-risk",
  track: "Risk Reporting",
  module: "Angka Risiko & Regulasi",
  title: "RR18 — Market Risk Reporting: VaR & Backtesting",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga hari merah: model rusak atau pasar gila?",
      prose: [
        "Trading book Bank Artha Dana: VaR 99% Rp5 juta per hari — 'pada 99 hari dari 100, rugi tidak lebih dari Rp5 juta.' Senin: rugi Rp6,2 juta. Selasa: Rp7,1 juta. Rabu: Rp5,8 juta. Tiga exception berturut-turut. Head trading menelepon risk: 'Model kalian rusak.' Risk menjawab: 'Atau pasar sedang gila.' Keduanya tidak bisa dibuktikan dari 3 hari data.",
        "Twist-nya: jawabannya ada di 250 hari ke belakang. Backtesting: hitung berapa kali rugi menembus VaR dalam 250 hari. Hasil: 7 exception → zona KUNING (5–9). Bukan HIJAU (model sempurna), bukan MERAH (model ditolak). Artinya: model tidak rusak — tetapi pasar memang lebih bergejolak dari asumsi. Tindakan: review model + tambah buffer, bukan ganti model.",
        "Lesson ini tentang melaporkan risiko pasar: VaR (Value at Risk), ES (Expected Shortfall), dan backtesting — tiga angka yang menjawab 'berapa besar risikonya?', 'jika jebol seberapa dalam?', dan 'apakah modelnya bisa dipercaya?'",
        "Setelah lesson ini kamu bisa: (1) menghitung VaR historis 99% dan ES; (2) menjalankan backtesting 250 hari dan menentukan zona; (3) menulis laporan market risk 1 halaman untuk direksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "VaR bukan ramalan kerugian maksimum — ia ambang yang Diharapkan tertembus 1% hari. Trader yang berkata 'VaR Rp5 juta jadi rugi tidak akan lebih dari itu' salah membaca: VaR justru menjanjikan ~2–3 tembusan per tahun. Melaporkan VaR tanpa menjelaskan ini = menyiapkan kesalahpahaman.",
      },
      reference: "VaR = ambang 1%; ES = rata-rata di luar ambang; backtest = kepercayaan.",
    },
    {
      id: "var",
      eyebrow: "Langkah 2 · Konsep",
      title: "VaR & ES: dua angka, dua pertanyaan",
      prose: [
        "VaR 99% historis: urutkan 250 P&L harian dari paling rugi; VaR = rugi terbesar ke-3 (persentil 1%). Sederhana dan jujur — tidak ada asumsi distribusi normal. Kelemahan: buta terhadap 'seberapa dalam jika tembus'. Itulah gunanya ES (Expected Shortfall): rata-rata kerugian pada hari-hari yang menembus VaR.",
        "Contoh lab (20 hari, versi mini): kerugian terurut mulai -7,1; VaR 99% = Rp7,1 jt; ES = Rp7,1 jt (hanya 1 observasi di luar — contoh kecil, jangan dipakai produksi). Di data 250 hari nyata: VaR Rp5,0 jt, ES Rp7,8 jt. Kalimat laporannya: 'Rugi harian normal di bawah Rp5 jt; jika tembus, rata-rata Rp7,8 jt.'",
        "Tiga miskonsepsi. Satu: 'VaR = kerugian maksimum.' Bukan — ia tertembus ~2–3x per tahun secara desain. Dua: 'VaR 99% dua bank bisa dibandingkan.' Bukan — metodologi (historis vs parametrik vs Monte Carlo) dan window beda = angka beda. Tiga: 'ES selalu > VaR.' Ya, secara definisi — ES = rata-rata ekor di luar VaR.",
        "Cara membaca figur: garis biru = P&L 20 hari; garis putus-putus merah = VaR; 3 titik merah = exception. Interpretasi: 3 exception dari 20 hari = 15% — jauh di atas 1% ekspektasi. Jika ini 250 hari, model DITOLAK (zona merah). Untung ini hanya contoh 20 hari.",
      ],
      formula: String.raw`\text{VaR}_{99\%} = -\text{persentil}_{1\%}(P\&L) \quad ; \quad \text{ES} = -\mathbb{E}[P\&L \mid P\&L < -\text{VaR}]`,
      formulaNote: "P&L = laba/rugi harian (negatif = rugi). VaR 99% = batas yang hanya tertembus 1% hari. ES = rata-rata kerugian saat tertembus. Contoh: VaR Rp5,0 jt, ES Rp7,8 jt. Interpretasi: 'normal < Rp5 jt; jika tembus, rata-rata Rp7,8 jt.'",
      figure: {
        svg: FIG_VAR,
        alt: "Garis P&L harian 20 hari dengan garis VaR; tiga titik menembus VaR.",
        caption: "3 exception dari 20 hari = 15%: model akan ditolak jika ini 250 hari.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“VaR Rp5 juta berarti rugi maksimal Rp5 juta.” VaR justru MENJANJIKAN tembusan ~1% hari (~2–3x/tahun). Trader yang tidak paham ini akan panik setiap exception — padahal exception adalah perilaku normal model.",
      },
      hints: [
        "VaR historis = urutkan, ambil persentil 1%.",
        "ES = rata-rata kerugian di luar VaR.",
      ],
      reference: "VaR = ambang; ES = kedalaman. Keduanya wajib dilaporkan.",
    },
    {
      id: "backtest",
      eyebrow: "Langkah 3 · Konsep",
      title: "Backtesting: mengadili model",
      prose: [
        "Aturan main (Basel): 250 hari perdagangan, hitung exception (rugi > VaR). Ekspektasi: 1% × 250 = 2,5 exception. Zona: 0–4 HIJAU (model OK), 5–9 KUNING (review + buffer tambahan), ≥10 MERAH (model ditolak, ganti metodologi + penalti modal).",
        "Kasus cerita: 7 exception → KUNING. Tindakan: (1) review asumsi model (apakah window historis mencakup periode volatil?), (2) tambah buffer modal sementara, (3) monitor 3 bulan. BUKAN: ganti model (mahal, belum tentu lebih baik) atau abaikan (menunggu merah).",
        "Jebakan: exception bergerombol (3 hari berturut-turut seperti cerita) vs tersebar. Zona hanya menghitung JUMLAH — tetapi gerombol = sinyal regime change (volatilitas naik permanen?), tersebar = noise. Laporan yang baik menyebut keduanya: '7 exception (KUNING), 3 di antaranya bergerombol minggu lalu — indikasi volatilitas naik.'",
        "Independensi: backtest harus memakai VaR yang dihitung SEBELUM hari perdagangan (out-of-sample), bukan VaR yang dihitung ulang dengan data hari itu. VaR yang 'selalu benar' karena dihitung belakangan = ujian dengan kunci jawaban.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Backtesting = ujian nasional untuk model. Zona hijau bukan 'nilai 100' — ia 'lulus'. Model VaR tidak perlu sempurna; ia perlu jujur tentang ketidaksempurnaannya. Zona kuning = 'lulus bersyarat': boleh dipakai, dengan PR.",
      },
      reference: "250 hari: ≤4 hijau, 5–9 kuning, ≥10 merah. Gerombol = regime change.",
    },
    {
      id: "lab-var",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung VaR & ES 20 hari",
      prose: [
        "Dari 20 P&L harian, hitung VaR 99% historis dan ES. Catatan: 20 hari terlalu sedikit untuk VaR 99% produksi (butuh 250+) — lab ini melatih mekaniknya, bukan metodologinya. Dengan 20 data, persentil 1% jatuh pada observasi paling ekstrem.",
        "Perhatikan hasilnya: VaR = ES = Rp7,1 jt karena hanya 1 observasi di luar ambang. Di data besar keduanya berbeda — ES > VaR selalu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `idx`, `var99`, dan `es`" },
        { id: "t2", text: "Jalankan dan pastikan interpretasi tercetak" },
      ],
      expected: "VaR 99% = Rp7.1 jt; ES = Rp7.1 jt\nInterpretasi: rugi harian normal < Rp7.1 jt; jika tembus, sebesar Rp7.1 jt rata-rata",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Makin banyak data, VaR makin kecil.” Tidak tentu — data lebih banyak = ekor lebih lengkap = VaR bisa NAIK jika histori mencakup krisis. Window pendek di masa tenang = VaR yang menipu rendah.",
      },
      hints: [
        "idx = int(0.01 * len(s)).",
        "var99 = -s[idx]; es = rata-rata s[:idx+1] dinegatifkan.",
      ],
      code: {
        starter: "# P&L harian trading book, 20 hari (Rp juta, negatif = rugi). JANGAN UBAH.\npnl = [-1.2, -2.1, -0.5, -3.0, -1.8, -0.9, -2.5, -1.5, -4.2, -6.2,\n       -1.1, -2.0, -7.1, -1.4, -2.2, -5.8, -1.9, -0.7, -2.8, -1.6]\n\n# TULIS KODEMU: VaR 99% historis (persentil 1 dari kerugian)\ns = sorted(pnl)  # paling rugi dulu\nidx =\nvar99 =\nes =\nprint(f\"VaR 99% = Rp{var99:.1f} jt; ES = Rp{es:.1f} jt\")\nprint(f\"Interpretasi: rugi harian normal < Rp{var99:.1f} jt; jika tembus, sebesar Rp{es:.1f} jt rata-rata\")\n",
        lockLines: 8,
        solution: "# P&L harian trading book, 20 hari (Rp juta, negatif = rugi). JANGAN UBAH.\npnl = [-1.2, -2.1, -0.5, -3.0, -1.8, -0.9, -2.5, -1.5, -4.2, -6.2,\n       -1.1, -2.0, -7.1, -1.4, -2.2, -5.8, -1.9, -0.7, -2.8, -1.6]\n\n# TULIS KODEMU: VaR 99% historis (persentil 1 dari kerugian)\ns = sorted(pnl)  # paling rugi dulu\nidx = int(0.01 * len(s))  # posisi 1%\nvar99 = -s[idx]  # sebagai angka positif (besarnya kerugian)\nes = -sum(s[:idx+1]) / (idx + 1)  # rata-rata di luar VaR\nprint(f\"VaR 99% = Rp{var99:.1f} jt; ES = Rp{es:.1f} jt\")\nprint(f\"Interpretasi: rugi harian normal < Rp{var99:.1f} jt; jika tembus, sebesar Rp{es:.1f} jt rata-rata\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "VaR 7,1 tercetak", msg: "Observasi paling rugi = -7,1.", pattern: "VaR 99% = Rp7\\.1 jt; ES = Rp7\\.1 jt" }
        ],
      },
      reference: "Urutkan → persentil 1% → VaR. Rata-rata ekor → ES.",
    },
    {
      id: "lab-back",
      eyebrow: "Langkah 5 · Lab",
      title: "Backtest 250 hari: zona apa?",
      prose: [
        "Tujuh exception tersebar di 250 hari. Tentukan zona dan tindakannya. Bandingkan dengan cerita pembuka: 3 exception bergerombol dalam seminggu TETAPI total 250 hari = 7 → tetap KUNING. Gerombol dicatat sebagai catatan, bukan penentu zona.",
        "Eksperimen: ubah 2 exception menjadi 12 (tambah 5) — zona menjadi MERAH: 'Model DITOLAK, ganti metodologi'. Rasakan betapa tipisnya garis kuning-merah: 9 vs 10.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n` dan `zona`" },
        { id: "t2", text: "Jalankan dan pastikan tindakan tercetak" },
      ],
      expected: "Exceptions: 7 dari 250 hari -> zona KUNING\nReview model + tambah buffer",
      note: {
        title: "Intuisi",
        body: "Zona kuning adalah zona paling 'manusiawi': tidak cukup baik untuk tenang, tidak cukup buruk untuk dibuang. Di sinilah analis risiko paling dibutuhkan — mesin hanya memberi zona, manusia memberi respons.",
      },
      hints: [
        "n = sum(exc).",
        "Zona: ≤4 hijau, 5–9 kuning, ≥10 merah.",
      ],
      code: {
        starter: "# Backtest 250 hari: 1 = exception (rugi > VaR), 0 = aman (JANGAN UBAH).\n# Disimulasikan: 7 exception tersebar.\nexc = [0]*250\nfor i in [12, 45, 67, 120, 155, 203, 240]:\n    exc[i] = 1\n\n# TULIS KODEMU\nn =\nzona =\nprint(f\"Exceptions: {n} dari 250 hari -> zona {zona}\")\nprint(\"Model OK, pasar bergejolak\" if zona == \"HIJAU\" else\n      \"Review model + tambah buffer\" if zona == \"KUNING\" else \"Model DITOLAK, ganti metodologi\")\n",
        lockLines: 7,
        solution: "# Backtest 250 hari: 1 = exception (rugi > VaR), 0 = aman (JANGAN UBAH).\n# Disimulasikan: 7 exception tersebar.\nexc = [0]*250\nfor i in [12, 45, 67, 120, 155, 203, 240]:\n    exc[i] = 1\n\n# TULIS KODEMU\nn = sum(exc)\nzona = \"HIJAU\" if n <= 4 else (\"KUNING\" if n <= 9 else \"MERAH\")\nprint(f\"Exceptions: {n} dari 250 hari -> zona {zona}\")\nprint(\"Model OK, pasar bergejolak\" if zona == \"HIJAU\" else\n      \"Review model + tambah buffer\" if zona == \"KUNING\" else \"Model DITOLAK, ganti metodologi\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`n` = 7", msg: "Tujuh exception.", name: "n", value: 7, tol: 1e-09 },
          { kind: "stdout_matches", task: "t2", label: "Zona KUNING", msg: "7 di rentang 5–9.", pattern: "zona KUNING" }
        ],
      },
      reference: "7 exception = KUNING: review + buffer, bukan ganti model.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Exception terjadi: respons apa",
      prose: [
        "Satu: 1 exception tersebar, total 250 hari ≤4 → HIJAU: catat, tidak ada tindakan. Dua: 3 exception bergerombol seminggu, total 7 → KUNING: review model + tambah buffer + catat regime change. Tiga: total ≥10 → MERAH: model ditolak, ganti metodologi, penalti modal, lapor regulator. Empat: exception saat event pasar (pemilu, krisis) → overlay stress test: VaR tidak dirancang untuk event — pakai skenario (ingat RR11).",
        "Aturan praktis 10 detik: hitung dulu (zona apa?), lalu lihat pola (bergerombol?), lalu pilih respons. Jangan melompat ke 'model rusak' dari 3 hari data.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "VaR untuk hari normal; stress test untuk hari gila. Bank yang hanya punya VaR = supir yang hanya punya spion tanpa rem darurat. Keduanya wajib ada di laporan market risk.",
      },
      reference: "Zona → respons. Gerombol → catatan regime. Event → stress test.",
    },
    {
      id: "lab-3",
      eyebrow: "Lab 3 · Backtesting VaR",
      title: "Apakah VaR-mu jujur?",
      prose: [
        "Lab 1–2 menghitung VaR. Lab ini mengujinya: dari 250 hari perdagangan, hitung berapa hari rugi melebihi VaR 99%. Hasil: 3 eksepsi (1,2%) — dalam zona hijau Basel (0–4 eksepsi). VaR 99% yang jujur memang 'salah' ~1% dari waktu.",
        "Zona kuning (5–9 eksepsi) = denda modal; zona merah (10+) = model ditolak. Backtesting adalah akuntabilitas model — tanpa itu VaR hanya angka di slide.",
      ],
      tasks: [
        { id: "t1", text: "Hitung jumlah hari rugi > VaR" },
        { id: "t2", text: "Jalankan dan tentukan zona Basel" },
      ],
      expected: "Eksepsi: 3 dari 250 hari (1.2%)\nZona: HIJAU - model diterima",
      note: {
        title: "Nol eksepsi = terlalu konservatif.",
        type: "pitfall",
        body: "“Nol eksepsi, model sempurna!” VaR 99% dengan nol eksepsi dalam 250 hari justru mencurigakan — model terlalu konservatif dan mengunci modal berlebih. VaR yang sehat 'salah' ~2-3x setahun.",
      },
      hints: [
        "eksepsi = sum(1 for r in rugi if r > var99).",
        "Zona: <=4 HIJAU, <=9 KUNING, selain itu MERAH.",
      ],
      code: {
        starter: "# Rugi harian (Rp M) selama 250 hari; VaR 99% = 50. JANGAN UBAH.\nimport random\nrandom.seed(0)\nrugi = [round(random.gauss(20, 12), 1) for _ in range(250)]\nvar99 = 50\n\n# TULIS KODEMU: hitung eksepsi + zona\n",
        lockLines: 4,
        solution: "# Rugi harian (Rp M) selama 250 hari; VaR 99% = 50. JANGAN UBAH.\nimport random\nrandom.seed(0)\nrugi = [round(random.gauss(20, 12), 1) for _ in range(250)]\nvar99 = 50\n\n# TULIS KODEMU: hitung eksepsi + zona\neksepsi = sum(1 for r in rugi if r > var99)\nzona = \"HIJAU - model diterima\" if eksepsi <= 4 else (\"KUNING - denda modal\" if eksepsi <= 9 else \"MERAH - model ditolak\")\nprint(f\"Eksepsi: {eksepsi} dari {len(rugi)} hari ({eksepsi/len(rugi):.1%})\")\nprint(f\"Zona: {zona}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Eksepsi terhitung", msg: "Dari output nyata.", pattern: "dari 250 hari" },
          { kind: "stdout_matches", task: "t2", label: "Zona tercetak", msg: "Zona Basel dari output nyata.", pattern: "Zona:" }
        ],
      },
      reference: "Backtesting = akuntabilitas VaR. Hijau 0–4; kuning = denda; merah = model ditolak.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Laporan 1 halaman untuk direksi",
      prose: [
        "Data kuartal trading book: VaR 99% Rp5,0 jt/hari, ES Rp7,8 jt. Backtest 250 hari: 7 exception (zona KUNING), 3 bergerombol minggu lalu saat volatilitas IHSG naik 40%. Rugi maksimum kuartal: Rp9,2 jt (1 hari).",
        "Tugas: tulis 1 halaman. Pembahasan: Baris 1 — 'Risiko pasar: VaR Rp5,0 jt/hari; jika tembus rata-rata Rp7,8 jt.' Baris 2 — 'Backtest KUNING (7 exception): model lulus bersyarat.' Baris 3 — '3 exception bergerombol = volatilitas naik 40%; bukan kegagalan model.' Rekomendasi — 'Tambah buffer Rp500 jt (100x VaR) selama volatilitas tinggi; review window historis bulan depan; stress test skenario crash 10%.' Empat baris, satu keputusan: buffer ditambah atau tidak.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan market risk yang hanya memuat VaR tanpa backtest = klaim tanpa bukti. 'VaR Rp5 jt' tanpa 'backtest KUNING' = setengah kebenaran. Selalu pasangkan angka dengan kepercayaan padanya.",
      },
      reference: "1 halaman: VaR + ES + zona backtest + rekomendasi buffer.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Ingat: VaR = ambang, bukan ramalan.",
      ],
      tasks: [],
      summary: [
        "VaR 99% historis = rugi terbesar ke-3 dari 250 hari; ES = rata-rata di luar VaR.",
        "VaR tertembus ~1% hari secara desain — exception = normal, bukan kegagalan.",
        "Backtest 250 hari: ≤4 HIJAU, 5–9 KUNING, ≥10 MERAH.",
        "Exception bergerombol = sinyal regime change; event pasar = pakai stress test.",
        "Laporan: VaR + ES + zona backtest + rekomendasi buffer dalam 1 halaman.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "VaR 99% Rp5 jt. Artinya?",
          options: [
            { text: "Pada 99% hari, rugi ≤ Rp5 jt; ~1% hari tembus", why: "Benar. Tembusan ~2–3x/tahun adalah desain, bukan kegagalan.", correct: true },
            { text: "Rugi tidak akan lebih dari Rp5 jt", why: "Salah kaprah paling umum — VaR bukan maksimum." },
            { text: "Rugi rata-rata Rp5 jt per hari", why: "Itu bukan VaR; rata-rata P&L beda konsep." }
          ],
        },
        {
          q: "Backtest 250 hari: 7 exception. Zona dan tindakan?",
          options: [
            { text: "KUNING: review model + tambah buffer", why: "Benar: 5–9 = kuning.", correct: true },
            { text: "HIJAU: tidak ada tindakan", why: "7 > 4 = bukan hijau." },
            { text: "MERAH: ganti model", why: "Merrah mulai 10 exception." }
          ],
        },
        {
          q: "3 exception bergerombol dalam seminggu, total 7. Interpretasi?",
          options: [
            { text: "Tetap KUNING, tetapi catat indikasi regime change", why: "Benar: zona dari jumlah; gerombol = catatan volatilitas naik.", correct: true },
            { text: "Naik menjadi MERAH karena bergerombol", why: "Zona hanya dari jumlah (7). Gerombol = catatan, bukan penentu." },
            { text: "Abaikan, yang penting total", why: "Gerombol = informasi: volatilitas mungkin naik permanen." }
          ],
        },
        {
          q: "ES Rp7,8 jt vs VaR Rp5,0 jt. Bedanya?",
          options: [
            { text: "ES = rata-rata rugi saat VaR tertembus", why: "Benar. VaR = ambang; ES = kedalaman.", correct: true },
            { text: "ES = VaR + buffer", why: "Bukan penjumlahan administratif." },
            { text: "ES selalu lebih kecil dari VaR", why: "Terbalik: ES ≥ VaR secara definisi." }
          ],
        },
        {
          q: "Kapan stress test dipakai alih-alih VaR?",
          options: [
            { text: "Saat event pasar ekstrem (crash, pemilu, krisis)", why: "Benar: VaR untuk hari normal, stress test untuk hari gila.", correct: true },
            { text: "Setiap hari, menggantikan VaR", why: "Keduanya komplementer, bukan pengganti." },
            { text: "Tidak pernah, VaR cukup", why: "VaR buta terhadap event di luar histori." }
          ],
        }
      ],
      reference: "VaR + ES + backtest = laporan market risk lengkap.",
    },
  ],
};
