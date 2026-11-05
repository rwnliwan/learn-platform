import type { V2Lesson } from "../lib/types";

// Mock panel dashboard risiko: bar utilisasi limit dengan traffic light.
// Angka dari lab lesson: VaR 95% (kuning), Konsentrasi 105% (MERAH breach!),
// Durasi 70% (hijau), FX 45% (hijau).
const DASHBOARD_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Panel dashboard limit: VaR 95 persen kuning, Konsentrasi 105 persen merah breach, Durasi 70 persen hijau, FX 45 persen hijau.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g stroke="var(--chart-grid)" stroke-width="1" fill="none"><rect x="120" y="48" width="280" height="22"/><rect x="120" y="93" width="280" height="22"/><rect x="120" y="138" width="280" height="22"/><rect x="120" y="183" width="280" height="22"/></g>
<rect x="120" y="48" width="213" height="22" fill="var(--c4)"/>
<rect x="120" y="93" width="235" height="22" fill="var(--c3)"/>
<rect x="120" y="138" width="157" height="22" fill="var(--c1)"/>
<rect x="120" y="183" width="101" height="22" fill="var(--c1)"/>
<line x1="344" y1="38" x2="344" y2="212" stroke="var(--text)" stroke-width="1.5" stroke-dasharray="5 3"/>
<text x="344" y="32" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">limit 100%</text>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="114" y="64">VaR</text><text x="114" y="109">Konsentrasi</text><text x="114" y="154">Durasi</text><text x="114" y="199">FX</text></g>
<g font-size="10" font-family="var(--font-ui)"><text x="406" y="64" fill="var(--text)">95% - KUNING</text><text x="406" y="109" fill="var(--text)" font-weight="700">105% - MERAH!</text><text x="406" y="154" fill="var(--chart-text)">70% - hijau</text><text x="406" y="199" fill="var(--chart-text)">45% - hijau</text></g>
<text x="280" y="14" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">dashboard limit - utilisasi pagi ini</text>
<text x="280" y="236" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="700">BREACH: Konsentrasi 105% -&gt; AKSI: kurangi HARI INI</text>
</svg>`;

export const pmd6: V2Lesson = {
  slug: "pm-d6-risk-reporting",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D6 — Risk Reporting",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-laporan-dewan",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan yang menyelamatkan rapat dewan",
      prose: [
        "Mar 2020: risk manager membawa 40 halaman Yunani (VaR, Greeks, kovarians) ke dewan. Direksi tertidur. Apr 2020: ia kembali dengan 1 halaman: \u2018Jika pasar −30%: kita rugi RpX. Limit: 2 breach. Aksi: ...\u2019 Direksi langsung putuskan tambah lindung nilai.",
        "Twist-nya: angka yang sama, nasib berbeda \u2014 karena komunikasi. Laporan risiko terbaik yang tidak dibaca = tidak ada laporan. Risk reporting = penerjemahan: Yunani → keputusan.",
        "Lesson penutup: dari angka ke aksi \u2014 dashboard, stress test, komunikasi.",
      ],
      tasks: [],
      reference: "Tulis untuk keputusan, bukan untuk arsip.",
    },
    {
      id: "dashboard-limit",
      eyebrow: "Langkah 2 · Dashboard limit + chart",
      title: "Kokpit, bukan gudang",
      prose: [
        "Limit: batas risiko (VaR, eksposur, konsentrasi). Utilization = aktual/limit. Breach: > 100% → eskalasi! Traffic light: hijau (< 80%), kuning (80\u2013100%), merah (breach). Aturannya: dashboard harian untuk trading; mingguan/bulanan untuk dewan. 1 halaman eksekutif + lampiran detail.",
        "Contoh pagi yang merah: VaR utilization 95% (kuning), konsentrasi single-name 105% (MERAH \u2014 breach!). Eskalasi: desk kurangi 10% sebelum siang (aturan tertulis!). Selasa: 88% (kuning). Tanpa dashboard: breach ketahuan saat rugi. Dengan dashboard: sebelum. Monitoring = pencegahan.",
        "Desain dashboard harian: 5 metrik \u2014 VaR, drawdown, konsentrasi, likuiditas, stress. Visual: traffic light + tren + alert. Drill-down: VaR naik 50%? \u2014 sektor? aset? korelasi? Temukan akar! Dashboard tanpa aksi = pajangan. Pilot tidak baca manual mesin saat turbulensi \u2014 ia lihat lampu + 1 angka kunci.",
        "Cara membaca: tiap bar = utilisasi limit (aktual dibagi limit). Garis putus-putus = 100% (batas limit). Warna traffic light: hijau di bawah 80%, kuning 80–100%, merah di atas 100% = breach. Angka di kanan = utilisasi + status.",
        "Interpretasi: inilah “pagi yang merah” dari lesson — VaR 95% (kuning, waspada), Konsentrasi 105% (MERAH, breach!). Tanpa dashboard, breach ketahuan saat rugi sudah terjadi; dengan dashboard, ketahuan sebelum — dan aturan eskalasi tertulis langsung jalan: desk kurangi 10% sebelum siang, Selasa sudah 88%. Perhatikan panel ini diakhiri kalimat aksi, bukan angka: dashboard tanpa aksi = pajangan.",
      ],
      figure: {
        svg: DASHBOARD_SVG,
        alt: "Panel dashboard limit: VaR 95 persen kuning, Konsentrasi 105 persen merah breach, Durasi 70 persen hijau, FX 45 persen hijau.",
        caption: "Mock dashboard limit pagi yang merah: Konsentrasi 105% = breach → eskalasi hari itu juga. Kokpit, bukan gudang.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Panjang = bagus.\u2019 Salah. 40 halaman = 0 keputusan; 1 halaman = keputusan 15 menit. Ukuran keberhasilan = keputusan yang diambil \u2014 bukan halaman, bukan rumus.",
      },
      reference: "Dashboard = kokpit: 5\u20137 metrik, visual, alert, drill-down.",
    },
    {
      id: "lab-monitor-limit",
      eyebrow: "Langkah 3 · Lab monitor limit",
      title: "Traffic-light monitor",
      prose: [
        "Bangun monitor traffic-light dari data utilisasi: klasifikasi tiap limit menjadi HIJAU/KUNING/MERAH dan cetak aksi eskalasi untuk breach. Ubah KONSENTRASI dari 1,05 menjadi 0,75 (di bawah limit): lampu hijau \u2014 aksi selesai!",
      ],
      tasks: [
        { id: "t1", text: "Klasifikasi `status` tiap limit" },
        { id: "t2", text: "Cetak daftar breach dan aksi" },
      ],
      expected: "Konsentrasi 105% MERAH (breach!)  AKSI: kurangi Konsentrasi HARI INI",
      hints: [
        "status: u > 1,0 → MERAH (breach!); u > 0,8 → KUNING (waspada); else HIJAU (aman).",
        "breach = [k for k,v in LIMITS.items() if v > 1,0].",
        "Cetak dengan format {nama:<14}{u:>6.0%}  {status}.",
      ],
      code: {
        starter: `# Monitor limit: traffic light\nLIMITS = {"VaR": 0.95, "Konsentrasi": 1.05, "Durasi": 0.70, "FX": 0.45}  # ubah Konsentrasi jadi 0.75!\n\n# TULIS KODEMU\nprint(f"{'limit':<14}{'util':>7}  status")\nfor nama, u in LIMITS.items():\n    if u > 1.0:\n        status = \n    elif u > 0.8:\n        status = \n    else:\n        status = \n    print(f"{nama:<14}{u:>6.0%}  {status}")\n\nbreach = \nprint()\nif breach:\n    print(f"AKSI: kurangi {', '.join(breach)} HARI INI (aturan eskalasi).")\nelse:\n    print("Semua aman. Kuning = siapkan rencana.")`,
        lockLines: 1,
        solution: `# Monitor limit: traffic light\nLIMITS = {"VaR": 0.95, "Konsentrasi": 1.05, "Durasi": 0.70, "FX": 0.45}  # ubah Konsentrasi jadi 0.75!\n\n# TULIS KODEMU\nprint(f"{'limit':<14}{'util':>7}  status")\nfor nama, u in LIMITS.items():\n    if u > 1.0:\n        status = "MERAH (breach!)"\n    elif u > 0.8:\n        status = "KUNING (waspada)"\n    else:\n        status = "HIJAU (aman)"\n    print(f"{nama:<14}{u:>6.0%}  {status}")\n\nbreach = [k for k, v in LIMITS.items() if v > 1.0]\nprint()\nif breach:\n    print(f"AKSI: kurangi {', '.join(breach)} HARI INI (aturan eskalasi).")\nelse:\n    print("Semua aman. Kuning = siapkan rencana.")`,
        checks: [
          { kind: "equal", task: "t2", name: "breach", value: ["Konsentrasi"], tol: 0, label: "`breach` = ['Konsentrasi']", msg: "Hanya Konsentrasi (105%) yang melewati 100%." },
          { kind: "stdout_matches", task: "t2", pattern: "Konsentrasi\\s+105%  MERAH \\(breach!\\)", label: "`print` menampilkan Konsentrasi 105% MERAH", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "AKSI: kurangi Konsentrasi HARI INI", label: "`print` menampilkan aksi eskalasi", msg: "Dashboard tanpa aksi = pajangan." },
        ],
      },
      reference: "VaR limit Rp1M, aktual Rp1,2M → alert merah → eskalasi → kurangi.",
    },
    {
      id: "lab-stress-test",
      eyebrow: "Langkah 4 · Lab stress test",
      title: "Simulasi bencana",
      prose: [
        "Hitung rugi portofolio 60/40 di skenario stres dan reverse stress (shock berapa yang bikin rugi 30%?). Ubah SHOCK_SAHAM dari −0,30 menjadi −0,50 (2008!): rugi membesar \u2014 uji ketahanan! Lapor: skenario → rugi → AKSI (bukan angka saja).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rugi` skenario" },
        { id: "t2", text: "Hitung `s_rev` (reverse stress)" },
        { id: "t3", text: "Cetak hasil dengan `print`" },
      ],
      expected: "Rugi portofolio: -16.0% = Rp-1,600jt  Reverse: rugi 30% butuh saham -53%",
      hints: [
        "rugi = W_SAHAM×SHOCK_SAHAM + W_OBLIGASI×SHOCK_OBL.",
        "s_rev = (target − W_OBLIGASI×SHOCK_OBL)/W_SAHAM.",
        "Format :.1% dan Rp{rugi*NILAI:,.0f}jt; :+.0% untuk shock obligasi.",
      ],
      code: {
        starter: `# Stress test: skenario -> rugi\nW_SAHAM, W_OBLIGASI = 0.6, 0.4\nNILAI = 10_000  # Rp jt\nSHOCK_SAHAM = -0.30   # ubah jadi -0.50!\nSHOCK_OBL = 0.05\n\n# TULIS KODEMU\nrugi = \nprint(f"Skenario: saham {SHOCK_SAHAM:.0%}, obligasi {SHOCK_OBL:+.0%}")\nprint(f"Rugi portofolio: {rugi:.1%} = Rp{rugi*NILAI:,.0f}jt")\nprint()\n# reverse stress: shock saham agar rugi 30%?\ntarget = -0.30\ns_rev = \nprint(f"Reverse: rugi 30% butuh saham {s_rev:.0%}")\nprint("Lapor: skenario -> rugi -> AKSI (bukan angka saja).")`,
        lockLines: 4,
        solution: `# Stress test: skenario -> rugi\nW_SAHAM, W_OBLIGASI = 0.6, 0.4\nNILAI = 10_000  # Rp jt\nSHOCK_SAHAM = -0.30   # ubah jadi -0.50!\nSHOCK_OBL = 0.05\n\n# TULIS KODEMU\nrugi = W_SAHAM*SHOCK_SAHAM + W_OBLIGASI*SHOCK_OBL\nprint(f"Skenario: saham {SHOCK_SAHAM:.0%}, obligasi {SHOCK_OBL:+.0%}")\nprint(f"Rugi portofolio: {rugi:.1%} = Rp{rugi*NILAI:,.0f}jt")\nprint()\n# reverse stress: shock saham agar rugi 30%?\ntarget = -0.30\ns_rev = (target - W_OBLIGASI*SHOCK_OBL)/W_SAHAM\nprint(f"Reverse: rugi 30% butuh saham {s_rev:.0%}")\nprint("Lapor: skenario -> rugi -> AKSI (bukan angka saja).")`,
        checks: [
          { kind: "equal", task: "t1", name: "rugi", value: -0.16, tol: 1e-9, label: "`rugi` = −0.16", msg: "0,6×(−30%) + 0,4×(+5%) = −16% = Rp1,6M dari Rp10M." },
          { kind: "equal", task: "t2", name: "s_rev", value: -0.5333, tol: 0.001, label: "`s_rev` ≈ −0.533", msg: "(−0,30 − 0,02)/0,6 = −53,3%." },
          { kind: "stdout_matches", task: "t3", pattern: "Rugi portofolio: -16\\.0% = Rp-1,600jt", label: "`print` menampilkan rugi -16.0%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t3", pattern: "Reverse: rugi 30% butuh saham -53%", label: "`print` menampilkan reverse -53%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Stress bukan prediksi \u2014 melainkan uji ketahanan. Output: angka + AKSI.",
    },
    {
      id: "stress-test",
      eyebrow: "Langkah 5 · Stress test",
      title: "Latihan kebakaran",
      prose: [
        "Stress test: \u2018bagaimana jika...?\u2019 \u2014 historis (2008, 2020, 1998!) + hipotetis (rate +3%, rupiah −20%, keduanya!). Reverse stress: \u2018skenario apa yang membunuh kita?\u2019 Aturannya: stress bukan prediksi \u2014 melainkan uji ketahanan. Lapor: skenario → rugi → aksi.",
        "Contoh skenario 2020: portofolio Rp10M (60/40); saham −30%, obligasi +5% (flight to quality) → rugi = 0,6×(−30%) + 0,4×5% = −16% = Rp1,6M. Reverse: rugi Rp3M (30%) butuh saham −53%. Aksi: lindung nilai (collar: beli proteksi put yang dibiayai jual call) jika skenario buruk makin mungkin. Dewan: \u2018Rp1,6M bisa ditahan? Ya.\u2019 → tidur nyenyak. Itulah value stress test.",
        "Analoginya latihan kebakaran: bukan ramalan kebakaran \u2014 tapi memastikan pintu darurat (likuiditas, lindung nilai) bisa dibuka. Gedung tanpa latihan = panik saat api (Mar 2020!). Kuartalan untuk dewan; sebelum event besar (pemilu, The Fed).",
      ],
      formula: String.raw`\text{Rugi}_{skenario} = \sum w_i \times shock_i`,
      formulaNote: "Shock: historis (2008: saham −50%) atau hipotetis. Reverse: cari shock yang bikin rugi = modal!",
      tasks: [],
      reference: "Kisah nyata 2007: 1 halaman \u2018jika housing turun 20%, kita rugi USD 2M; rekomendasi hedge\u2019 → dewan setuju 10 menit → 2008 selamat.",
    },
    {
      id: "komunikasi",
      eyebrow: "Langkah 6 · Komunikasi",
      title: "Yunani ke keputusan",
      prose: [
        "Aturan 1 halaman: so what? di paragraf 1. Bahasa bisnis: \u2018rugi RpX jika...\u2019 bukan \u2018VaR 95%...\u2019. Struktur: temuan → dampak → opsi aksi → rekomendasi. Prinsip: dewan membayar keputusan, bukan kuliah. Jika mereka tidak bertindak = laporan gagal (bukan mereka bodoh!).",
        "Contoh transformasi: buruk (40 hlm): \u2018VaR 95% Rp200jt, CVaR Rp350jt, beta 1,1, Greeks...\u2019 → dewan tertidur. Baik (1 hlm): \u2018Jika pasar −30% (seperti Mar 2020): rugi Rp1,6M. 2 limit breach. Opsi: (a) collar Rp50jt, (b) kurangi 10%. Rekomendasi: (a).\u2019 Hasil: keputusan 15 menit. So what dulu, Yunani kemudian (di lampiran).",
        "Terjemahan: \u2018delta 0,5, gamma 0,1\u2019 → \u2018jika pasar turun 10%, kita rugi Rp500jt.\u2019 Komunikasi risiko seperti penerjemah medis: \u2018miokard infark\u2019 → \u2018serangan jantung, perlu operasi sekarang\u2019. Istilah latin = gagal menerjemahkan = pasien mati (keputusan telat). Krisis = ujian komunikasi: cepat, jujur, beri rencana, tenang.",
      ],
      tasks: [],
      reference: "Studi: 80% laporan tidak dibaca; 1 halaman: 90% dibaca. Pendek = dibaca.",
    },
    {
      id: "minicase-40-halaman",
      eyebrow: "Langkah 7 · Mini-case",
      title: "40 halaman",
      prose: [
        "Mar 2020: risk manager bawa 40 halaman Yunani → direksi tertidur. Apr 2020: 1 halaman (skenario + rugi + aksi) → keputusan 15 menit tambah lindung nilai.",
        "(a) Yang salah: bukan angkanya \u2014 komunikasinya. Laporan = keputusan, bukan data. (b) Perbaikan: 1 halaman eksekutif (temuan, dampak Rp, opsi, rekomendasi) + lampiran detail untuk quant. (c) Pelajaran umum: ukuran keberhasilan = keputusan yang diambil; dewan = sibuk & non-teknis → bahasa bisnis; Einstein: \u2018sesederhana mungkin, tapi tidak lebih sederhana.\u2019",
        "(d) Template 1 halaman: TEMUAN → DAMPAK (Rp!) → OPSI (A/B) → REKOMENDASI. Salin, isi, kirim. (e) Budaya: laporan jujur = bangun kepercayaan; laporan menyesatkan = hancur. Keuangan = kepercayaan: dibangun lambat, hancur cepat. Uji laporanmu: beri ke non-teknis \u2014 paham? keputusan?",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "2008: bank sembunyikan risiko = kepercayaan hancur. Laporan jujur di krisis = kepercayaan dibangun. Risk reporting bukan compliance \u2014 melainkan pertahanan bisnis.",
      },
      reference: "OJK wajib lapor (format!) \u2014 tetapi internal = 1 halaman.",
    },
    {
      id: "laporan-klien",
      eyebrow: "Langkah 8 · Laporan klien",
      title: "Metrik untuk klien: frekuensi, bahasa, angka yang menenangkan",
      prose: [
        "Audiens berbeda, laporan berbeda — mengirim laporan yang sama ke semua = gagal ke semua. Desk trading: HARIAN — utilisasi limit, VaR, breach (mereka butuh aksi hari ini). CIO/manajemen: MINGGUAN — tren VaR, drawdown-to-date, kontribusi per strategi (mereka butuh pola). Dewan: KUARTALAN — skenario stress dalam Rupiah, keputusan lindung nilai (mereka butuh keputusan). Klien/nasabah: BULANAN/KUARTALAN — bahasa manusia (mereka butuh ketenangan + kejujuran). Mengirim VaR harian ke dewan yang berpikir kuartalan = melatih mereka mengabaikanmu.",
        "Metrik klien — bukan Yunani internal: (1) “Nilai investasimu RpX, berubah ±Y% bulan ini” — jujur, sederhana, tanpa jargon. (2) Drawdown dari puncak: “terendah −8% dari puncak Maret, kini −3%” — inilah yang klien RASAKAN; laporkan sebelum mereka bertanya. (3) Skenario ekspektasi: “jika pasar −30% seperti Mar 2020, kira-kira −RpY” — ekspektasi di muka mencegah panik di belakang. (4) Kontribusi naratif: “yang menahan: obligasi +2%; yang menekan: saham −5%” — cerita, bukan kovarians. Aturan bahasa: “VaR”, “CVaR”, “beta”, “Sharpe” dilarang di badan laporan tanpa terjemahan Rupiah — “risiko kami Rp200jt pada hari normal” mengalahkan “VaR 95% Rp200jt” karena manusia merasakan Rupiah dan mengarsipkan VaR.",
        "Frekuensi saat krisis: normal = bulanan; krisis = MINGGUAN, SATU halaman, tiga angka, satu rekomendasi. Dan aturan emas komunikasi krisis: jangan pernah biarkan klien tahu dari berita dulu — kabari duluan dengan angka dan rencana. Keheningan menumbuhkan rumor; kepanjangan menumbuhkan skip. Mode kegagalan: “laporan menenangkan palsu” — menyembunyikan drawdown dengan mengganti-ganti benchmark agar terlihat baik. Obatnya: benchmark TETAP sepanjang tahun, dilaporkan apa adanya; kepercayaan dibangun oleh kejujuran saat buruk, bukan oleh angka saat baik.",
      ],
      formula: String.raw`\text{IR} = \frac{R_p - R_b}{\text{TE}}`,
      formulaNote: "IR = information ratio (“Sharpe-nya manajer aktif”); R_p − R_b = active return (return di atas benchmark); TE = tracking error (volatilitas active return). IR > 0,5 = baik. Untuk klien institusi terjemahkan: “dari tiap 1% risiko aktif yang kami ambil menyimpang dari benchmark, kami menghasilkan 0,X% return tambahan.”",
      tasks: [],
      note: {
        title: "💡 Intuisi: laporan dibaca manusia yang takut — bukan model",
        body: "Lima heuristik. Pertama: uji pembaca — jika teman non-keuangan yang cerdas tidak bisa menyebut KEPUTUSAN apa setelah membaca halaman 1, laporanmu gagal; tulis ulang. Kedua: dahulukan rugi dalam Rupiah, bukan Yunani — “rugi Rp1,6M jika pasar −30%” mengalahkan “VaR 95% Rp200jt” karena manusia merasakan Rupiah. Ketiga: setiap angka risiko ditempeli “so what” dalam dua kalimat — angka tanpa aksi = trivia. Keempat: samakan frekuensi dengan siklus keputusan — harian untuk desk, mingguan untuk CIO, kuartalan untuk dewan; salah frekuensi = dilatih untuk diabaikan. Kelima: saat krisis, laporkan LEBIH SERING tetapi LEBIH PENDEK — satu halaman, tiga angka, satu rekomendasi; keheningan menumbuhkan rumor, kepanjangan menumbuhkan skip. Laporan terbaik yang tidak dibaca = tidak ada laporan; laporan terbaik yang dibaca tetapi tidak dimengerti = laporan yang gagal.",
      },
      reference: "Tulis untuk keputusan, bukan arsip — dan untuk manusia, bukan model.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah \u2014 dan penutup track Portfolio Management."],
      tasks: [],
      summary: [
        "Dashboard: traffic light (hijau < 80%, kuning 80\u2013100%, merah breach) \u2014 kokpit, bukan gudang.",
        "Breach → eskalasi tertulis, aksi hari itu. Dashboard tanpa aksi = pajangan.",
        "Stress test: skenario → rugi → AKSI; reverse stress cari skenario pembunuh.",
        "Komunikasi: 1 halaman, bahasa bisnis (Rp!), temuan → dampak → opsi → rekomendasi.",
        "Ukuran keberhasilan = keputusan yang diambil. Tulis untuk keputusan, bukan arsip.",
      ],
      next: { label: "DM1 \u2014 Data Lifecycle", href: "/learn/dm1-data-lifecycle" },
      quiz: [
        {
          q: "VaR limit Rp1M, aktual Rp1,2M. Tindakan?",
          options: [
            { text: "Tunggu besok", why: "Salah: breach = eskalasi sekarang, bukan besok." },
            { text: "Alert merah \u2014 eskalasi & kurangi hari ini", why: "Tepat: 120% = breach. Aturan tertulis > diskusi. Dashboard tanpa aksi = pajangan.", correct: true },
            { text: "Naikkan limit", why: "Salah: menaikkan limit untuk menutupi breach = menyembunyikan risiko." },
            { text: "Sembunyikan dari dewan", why: "Salah: menyembunyikan breach = pelanggaran kepercayaan & governance." },
          ],
        },
        {
          q: "Portofolio Rp10M (60/40). Skenario: saham −30%, obligasi +5%. Rugi?",
          options: [
            { text: "−Rp2,5M", why: "Salah: itu jika obligasi juga −30% \u2014 padahal +5% (flight to quality)." },
            { text: "−Rp1,6M (−16%)", why: "Tepat: 0,6×(−30%) + 0,4×(+5%) = −16% = Rp1,6M.", correct: true },
            { text: "−Rp3M", why: "Salah: itu skenario −30% flat tanpa diversifikasi obligasi." },
            { text: "Rp0 \u2014 saling meniadakan", why: "Salah: 60% saham mendominasi \u2014 tidak saling meniadakan." },
          ],
        },
        {
          q: "Struktur 1 halaman untuk dewan?",
          options: [
            { text: "Yunani dulu, kesimpulan di akhir", why: "Salah: build-up teknis = dewan tertidur sebelum kesimpulan." },
            { text: "Temuan → dampak (Rp!) → opsi → rekomendasi", why: "Tepat: so what? di paragraf 1; Yunani di lampiran.", correct: true },
            { text: "Semua detail 40 halaman", why: "Salah: 40 halaman = 0 keputusan." },
            { text: "Hanya rekomendasi tanpa data", why: "Salah: rekomendasi tanpa temuan & dampak = tidak kredibel." },
          ],
        },
        {
          q: "Ukuran keberhasilan laporan risiko?",
          options: [
            { text: "Jumlah halaman", why: "Salah: 40 halaman = 0 keputusan." },
            { text: "Keputusan yang diambil", why: "Tepat: laporan terbaik yang tidak dibaca = tidak ada laporan.", correct: true },
            { text: "Jumlah rumus", why: "Salah: rumus = alat, bukan tujuan." },
            { text: "Kecepatan pengiriman", why: "Salah: cepat tetapi tidak dibaca = tetap gagal." },
          ],
        },
        {
          q: "\u2018Delta 0,5, gamma 0,1\u2019 untuk dewan. Terjemahan tepat?",
          options: [
            { text: "Biarkan apa adanya \u2014 dewan paham", why: "Salah: Yunani ke dewan = gagal menerjemahkan." },
            { text: "\u2018Jika pasar turun 10%, kita rugi Rp500jt\u2019", why: "Tepat: bahasa bisnis (Rp! risiko! aksi!) \u2014 bukan Yunani.", correct: true },
            { text: "Hapus dari laporan", why: "Salah: informasinya penting \u2014 yang perlu diubah bahasanya, bukan dihapus." },
            { text: "Jelaskan definisi delta 1 jam", why: "Salah: dewan membayar keputusan, bukan kuliah." },
          ],
        },
        {
          q: "Dewan direksi menerima laporan risiko 40 halaman berisi VaR harian & Greeks. Masalah utama?",
          options: [
            { text: "Kurang halaman — tambah jadi 60", why: "Salah: 40 halaman = 0 keputusan; menambah = memperparah." },
            { text: "Salah frekuensi & bahasa — dewan butuh kuartalan 1 halaman: skenario Rp + opsi + rekomendasi", why: "Tepat: samakan dengan siklus keputusan; Yunani di lampiran, Rupiah di badan.", correct: true },
            { text: "VaR kurang akurat — ganti Monte Carlo", why: "Salah: masalahnya bukan akurasi model, melainkan komunikasi." },
            { text: "Kirim lebih sering — harian jadi mingguan", why: "Salah: dewan berpikir kuartalan; lebih sering = lebih diabaikan." },
          ],
        },
        {
          q: "Klien panik saat drawdown −8% padahal dalam batas normal strategi. Pencegahan terbaik?",
          options: [
            { text: "Sembunyikan drawdown dari laporan", why: "Salah: menyembunyikan = bom kepercayaan saat ketahuan." },
            { text: "Komunikasikan ekspektasi drawdown + skenario Rupiah DI MUKA, sebelum mereka berinvestasi", why: "Tepat: ekspektasi di muka mencegah panik di belakang. Janjikan risikonya, bukan hanya return-nya.", correct: true },
            { text: "Ganti benchmark agar terlihat baik", why: "Salah: “laporan menenangkan palsu” — kepercayaan hancur saat ketahuan." },
            { text: "Telepon tiap hari saat krisis", why: "Salah: berlebihan = menularkan panik; yang benar: mingguan, 1 halaman, 3 angka, 1 rekomendasi." },
          ],
        },
        {
          q: "Manajer A: IR 0,3; Manajer B: IR 0,7 (periode & benchmark sama, net fee). Pilih?",
          options: [
            { text: "B — tiap unit risiko aktif menghasilkan return tambahan lebih besar", why: "Tepat: IR = active return per unit tracking error; 0,7 > 0,5 = baik.", correct: true },
            { text: "A — IR rendah = risiko rendah", why: "Salah: IR rendah = return per risiko aktif KECIL — bukan risiko rendah." },
            { text: "Seri — beda tipis", why: "Salah: 0,3 vs 0,7 = beda lebih dari 2× lipat efisiensi aktif." },
            { text: "Tolak keduanya — IR harus > 1", why: "Salah: IR > 0,5 sudah baik; > 1 = luar biasa dan patut dicurigai." },
          ],
        },
      ],
    },
  ],
};
