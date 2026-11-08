import type { V2Lesson } from "../lib/types";

// Susunan HQLA tiga tingkat + batas komposisi (contoh angka lab).
const FIG_HQLA = `<svg viewBox="0 0 480 270" role="img" aria-label="Susunan HQLA: Level 1 tanpa haircut, Level 2A haircut 15 persen, Level 2B haircut 25 sampai 50 persen, dengan batas 40 dan 15 persen.">
<g font-family="var(--font-ui)">
<text x="240" y="26" font-size="13" font-weight="600" fill="var(--chart-text)" text-anchor="middle">HQLA: siapa boleh masuk, berapa nilainya dihitung</text>
<text x="14" y="66" font-size="12" fill="var(--chart-text)">Level 1</text>
<rect x="110" y="50" width="300" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="415" y="67" font-size="11" fill="var(--chart-text)">haircut 0% · tanpa batas</text>
<text x="14" y="116" font-size="12" fill="var(--chart-text)">Level 2A</text>
<rect x="110" y="100" width="160" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="275" y="117" font-size="11" fill="var(--chart-text)">haircut 15%</text>
<text x="14" y="166" font-size="12" fill="var(--chart-text)">Level 2B</text>
<rect x="110" y="150" width="80" height="24" fill="var(--c3)" opacity="0.9"/>
<text x="195" y="167" font-size="11" fill="var(--chart-text)">haircut 25–50%</text>
<line x1="110" y1="196" x2="410" y2="196" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="14" y="222" font-size="11" fill="var(--chart-text)">Batas: Level 2 ≤ 40% HQLA</text>
<text x="14" y="242" font-size="11" fill="var(--chart-text)">Batas: Level 2B ≤ 15% HQLA</text>
<text x="240" y="262" font-size="11" fill="var(--text-muted)" text-anchor="middle">Contoh: kas, cadangan di BI, SBN = Level 1. Kelebihan Level 2 di atas batas = tidak dihitung.</text>
</g>
</svg>`;

// Tren LCR 30 hari + breach ladder.
const FIG_TREN = `<svg viewBox="0 0 480 270" role="img" aria-label="Tren LCR 30 hari menurun dari 148 ke 114 persen melintasi ambang kuning 120 persen.">
<g font-family="var(--font-ui)">
<text x="240" y="26" font-size="13" font-weight="600" fill="var(--chart-text)" text-anchor="middle">Tren LCR 30 hari + breach ladder</text>
<line x1="40" y1="200" x2="440" y2="200" stroke="var(--c4)" stroke-width="1" stroke-dasharray="6 4"/>
<text x="444" y="203" font-size="10" fill="var(--c4)">100% breach</text>
<line x1="40" y1="160" x2="440" y2="160" stroke="var(--c3)" stroke-width="1" stroke-dasharray="6 4"/>
<text x="444" y="163" font-size="10" fill="var(--c3)">110%</text>
<line x1="40" y1="120" x2="440" y2="120" stroke="var(--c2)" stroke-width="1" stroke-dasharray="6 4"/>
<text x="444" y="123" font-size="10" fill="var(--c2)">120%</text>
<polyline points="50,60 90,66 130,72 170,80 210,88 250,96 290,104 330,112 370,122 410,130" fill="none" stroke="var(--chart-text)" stroke-width="2.5"/>
<circle cx="410" cy="130" r="5" fill="var(--c3)"/>
<text x="50" y="240" font-size="11" fill="var(--text-muted)">H−30</text>
<text x="410" y="240" font-size="11" fill="var(--text-muted)">hari ini</text>
<text x="240" y="258" font-size="11" fill="var(--chart-text)" text-anchor="middle">Hijau &gt;120 · kuning 110–120 · merah &lt;110 · breach &lt;100. Tren turun 9 hari = eskalasi walau masih &gt;100.</text>
</g>
</svg>`;

export const rr20: V2Lesson = {
  slug: "rr20-laporan-likuiditas",
  track: "Risk Reporting",
  module: "Likuiditas & Transparansi",
  title: "RR20 — Laporan Likuiditas: LCR/NSFR & Early Warning",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rasio 143% yang hampir gagal bayar",
      prose: [
        "Jumat sore, treasury Bank Nusa Dana menatap layar: saldo kas operasional tinggal Rp180 miliar, sementara Senin pagi ada jatuh tempo pendanaan Rp1,2 triliun. LCR bank di laporan bulanan: 143% — jauh di atas minimum 100%. “Rasionya aman,” kata laporan itu. Kasnya tidak.",
        "Twist-nya: HQLA bank memang besar — Rp3,1 triliun — tetapi Rp1,9 triliun di antaranya surat berharga yang sedang dijaminkan (encumbered) untuk fasilitas repo, dan Rp600 miliar Level 2B yang batas 15%-nya sudah jebol. HQLA yang benar-benar bisa dipakai Senin pagi: Rp600 miliar. LCR 143% menghitung aset yang tidak bisa dijual. Kas 180 miliar menghadapi tagihan 1,2 triliun — itulah likuiditas yang sebenarnya.",
        "Lesson ini membawa aturan LCR/NSFR (yang kamu kenal aturannya di RR10: POJK 42/POJK.03/2015 untuk LCR dan POJK 50/POJK.03/2017 untuk NSFR, minimum 100%) ke praktik pelaporan harian: komponen HQLA yang benar, arus keluar 30 hari, dashboard early warning dengan breach ladder, dan — yang paling penting — siapa menerima laporan apa. Rasio tanpa kas = angka hiasan.",
        "Setelah lesson ini kamu bisa: (1) menghitung LCR dari komponen HQLA dengan haircut dan batas komposisi; (2) menghitung arus keluar bersih 30 hari dengan run-off factor dan batas inflow 75%; (3) membaca dashboard early warning likuiditas (tren + breach ladder); (4) menyusun matriks distribusi laporan likuiditas per penerima.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Likuiditas mati bukan karena rasio jelek — melainkan karena rasio bagus yang salah baca. Encumbered assets, batas Level 2 yang jebol, dan inflow yang tidak datang adalah tiga pembunuh yang tidak terlihat di satu angka LCR. Laporan likuiditas yang baik selalu memisahkan HQLA 'efektif' dari HQLA 'kertas'.",
      },
      reference: "LCR ≥ 100% (30 hari). NSFR ≥ 100% (1 tahun). Rasio ≠ kas tersedia.",
    },
    {
      id: "lcr",
      eyebrow: "Langkah 2 · Konsep",
      title: "LCR: tiga tingkat HQLA, satu pengurang",
      prose: [
        "LCR = HQLA / arus keluar bersih 30 hari × 100%, minimum 100%. Idenya: bank harus selamat 30 hari dalam skenario stres tanpa bantuan siapa pun. Pembilangnya HQLA (High-Quality Liquid Assets) — tetapi tidak semua aset likuid dihitung penuh. Level 1 (kas, cadangan di bank sentral, SBN berbobot risiko 0%): haircut 0%, tanpa batas. Level 2A (obligasi pemerintah berperingkat tinggi, covered bonds): haircut 15%. Level 2B (obligasi korporat A+ sampai BBB−, RMBS, saham): haircut 25–50%. Lalu dua batas komposisi: Level 2 total ≤ 40% HQLA, Level 2B ≤ 15% HQLA — kelebihan di atas batas tidak dihitung, berapa pun nilainya.",
        "Penyebutnya: arus keluar 30 hari dikurangi arus masuk, tetapi arus masuk dibatasi maksimal 75% dari arus keluar. Rumus: net outflow = outflow − min(inflow, 75% × outflow). Setiap jenis kewajiban punya run-off factor: deposito ritel stabil 5%, ritel kurang stabil 10%, pendanaan wholesale tanpa agunan dari lembaga keuangan 100%. Artinya bank tidak boleh berasumsi 'uang masuk akan menutup semuanya' — regulator memaksa bank memegang HQLA untuk minimal 25% arus keluar.",
        "Cara membaca figur: tiga batang = tiga tingkat HQLA dengan haircut masing-masing; dua garis batas = 40% dan 15%. Interpretasi: HQLA 'kertas' (sebelum haircut dan batas) selalu lebih besar dari HQLA 'efektif'. Selisih keduanya adalah angka yang harus dilaporkan terpisah — di sanalah cerita Nusa Dana bermula.",
        "Kepribadian LCR: ia pesimis profesional. Ia berasumsi nasabah ritel panik (5–10% kabur), pasar wholesale membeku (100% tidak diperpanjang), dan uang yang dijanjikan masuk hanya dihitung 75%. Melaporkan LCR berarti melaporkan hasil simulasi kepanikan — bukan kondisi normal.",
      ],
      formula: String.raw`\text{LCR} = \frac{\text{HQLA efektif}}{\text{Outflow}_{30d} - \min(\text{Inflow}_{30d},\, 75\% \times \text{Outflow}_{30d})} \times 100\% \geq 100\%`,
      formulaNote: "HQLA efektif = Level 1 + 85%×Level 2A + (50–75%)×Level 2B, setelah batas 40%/15%. Contoh lab: HQLA efektif Rp1.615 M, net outflow Rp1.200 M → LCR 134,6%. Interpretasi: bank selamat 30 hari stres dengan buffer 34,6 poin — tetapi cek komposisinya, bukan hanya angkanya.",
      figure: {
        svg: FIG_HQLA,
        alt: "Susunan HQLA tiga tingkat dengan haircut dan batas komposisi.",
        caption: "HQLA efektif < HQLA kertas. Haircut + batas 40%/15% = selisihnya.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“LCR 130% berarti likuiditas aman.” Belum tentu. LCR tidak melihat: (1) aset yang dijaminkan (encumbered) — tidak bisa dijual saat stres; (2) mismatch mata uang — HQLA rupiah tidak membayar kewajiban dolar; (3) konsentrasi jatuh tempo — semua outflow menumpuk di hari ke-3. LCR adalah foto 30 hari, bukan film harian.",
      },
      hints: [
        "Intuisi: haircut = 'diskon ketidakpercayaan'. Level 2B didiskon sampai 50% karena saat stres, pembelinya hilang duluan.",
        "Batas inflow 75% = regulator melarang bank 'berdoa pada uang masuk'. Minimal 25% outflow harus ditutup HQLA betulan.",
      ],
      reference: "HQLA efektif setelah haircut + batas. Net outflow dengan run-off factor dan cap inflow 75%.",
    },
    {
      id: "nsfr",
      eyebrow: "Langkah 3 · Konsep",
      title: "NSFR: jangan biayai maraton dengan sprint",
      prose: [
        "NSFR = ASF / RSF × 100%, minimum 100%, horizon 1 tahun. ASF (Available Stable Funding) = pendanaan stabil yang tersedia: modal 100%, deposito ritel stabil bobot tinggi, pendanaan wholesale jangka panjang. RSF (Required Stable Funding) = kebutuhan pendanaan stabil: aset jangka panjang dan aset tidak likuid butuh pendanaan stabil besar; HQLA butuh kecil. Pendanaan wholesale jangka pendek dari lembaga keuangan: bobot ASF 0% — dianggap menguap.",
        "Bedanya dengan LCR: LCR = tabung oksigen 30 hari (bertahan dari kepanikan); NSFR = pola napas setahun (struktur pendanaan sehat). Bank bisa LCR 150% tetapi NSFR 95%: selamat bulan ini, rapuh tahun ini — misalnya membiayai KPR 15 tahun dengan deposito 1 bulanan yang terus diperpanjang. Saat pasar membeku, perpanjangan berhenti, dan LCR ikut ambruk. NSFR menangkap kerapuhan struktural yang tidak terlihat di jendela 30 hari.",
        "Cara membaca figur tren: garis turun dari 148% ke 114% dalam 30 hari, melintasi ambang kuning 120% di hari ke-8. Interpretasi: breach ladder bekerja sebelum breach terjadi — kuning 110–120% = peringatan ke ALCO, merah <110% = rencana pendanaan darurat, <100% = breach (lapor regulator). Aturan praktis: tren turun 5 hari berturut = eskalasi walau masih hijau; menunggu merah = terlambat.",
        "Untuk laporan: treasury butuh angka harian + proyeksi 5 hari; ALCO butuh tren 30 hari + breach ladder + penyebab (HQLA turun atau outflow naik?); direksi butuh satu baris — 'LCR 134%, tren turun 9 hari, aksi: ...'; regulator butuh laporan berkala sesuai ketentuan (di Indonesia mengacu POJK 42/2015 dan 50/2017).",
      ],
      formula: String.raw`\text{NSFR} = \frac{\text{ASF}}{\text{RSF}} \times 100\% \geq 100\%`,
      formulaNote: "ASF = pendanaan stabil tersedia (modal 100%, deposito ritel tinggi, wholesale pendek dari bank 0%). RSF = kebutuhan stabil (aset panjang & tidak likuid = tinggi). Contoh: ASF Rp8,2 T / RSF Rp8,0 T = 102,5% — lolos tipis; sensitivitas: jika Rp500 M deposito ritel pindah ke wholesale 1 bulan, ASF turun ±Rp450 M → NSFR 96,9% = breach.",
      figure: {
        svg: FIG_TREN,
        alt: "Tren LCR 30 hari menurun melintasi ambang peringatan.",
        caption: "Breach ladder: kuning 110–120, merah <110, breach <100. Tren = peringatan dini.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“NSFR = LCR versi 1 tahun.” Bukan. LCR menguji ketahanan terhadap skenario stres 30 hari (arus kas); NSFR menguji struktur pendanaan (neraca). Bank bisa lolos satu dan gagal satunya — keduanya wajib ≥100% karena menjawab pertanyaan berbeda.",
      },
      hints: [
        "Intuisi: LCR = 'punya tabungan cukup untuk sebulan nganggur'. NSFR = 'gajimu cukup untuk cicilan setahun'. Keduanya perlu.",
        "Deposito ritel = pendanaan paling 'lengket' (bobot ASF tinggi). Wholesale antarbank 1 bulan = bobot 0% — jangan andalkan untuk aset panjang.",
      ],
      reference: "LCR = stres 30 hari. NSFR = struktur 1 tahun. Keduanya ≥100%.",
    },
    {
      id: "lab-lcr",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung LCR dari komponen",
      prose: [
        "Data Bank Artha Likuid (Rp miliar): HQLA Level 1 Rp1.200 M, Level 2A Rp400 M, Level 2B Rp150 M (haircut 50%). Arus keluar 30 hari: deposito ritel stabil Rp6.000 M (run-off 5%), ritel kurang stabil Rp2.000 M (10%), wholesale tanpa agunan Rp1.200 M (100%). Arus masuk Rp500 M. Tugasmu: terapkan haircut, cek batas 40%/15%, terapkan run-off, batasi inflow 75%, hitung LCR.",
        "Hasilnya: HQLA efektif Rp1.615 M (Level 2 = 25,7% ≤ 40%; Level 2B = 4,6% ≤ 15% — lolos batas). Net outflow Rp1.200 M. LCR 134,6% — di atas 100%, tetapi di zona kuning tren (ingat figur). Bank ini 'lolos tetapi waspada'.",
        "Eksperimen: naikkan wholesale ke Rp2.000 M (outflow +Rp800 M) — LCR jatuh ke ±80,7% = breach. Satu baris pendanaan mengubah status regulasi. Inilah mengapa treasury memonitor LCR harian, bukan bulanan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hqla_eff` (setelah haircut + batas) dan `net_out`" },
        { id: "t2", text: "Hitung `lcr` dan cetak verdict vs 100%" },
      ],
      expected: "HQLA efektif: Rp1615 M\nNet outflow 30d: Rp1200 M\nLCR: 134.6% -> LOLOS (>= 100%), zona WASPADA (< 140%)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Inflow Rp500 M kurangi outflow penuh.” Salah — inflow dibatasi 75% dari outflow. Di lab ini 75%×1.700 = 1.275 > 500 sehingga penuh terpakai; tetapi jika inflow Rp1.500 M, yang dihitung hanya Rp1.275 M. Lupa cap = LCR terlihat lebih bagus dari aslinya.",
      },
      hints: [
        "hqla_eff = 1200 + 400*0.85 + 150*0.5; cek batas 40% dan 15% dulu.",
        "outflow = 6000*0.05 + 2000*0.10 + 1200*1.00.",
        "net_out = outflow - min(inflow, 0.75*outflow).",
      ],
      code: {
        starter: "# Data Bank Artha Likuid (Rp M). JANGAN UBAH.\nl1, l2a, l2b = 1200.0, 400.0, 150.0  # HQLA per tingkat\nhc_2a, hc_2b = 0.15, 0.50            # haircut\noutflow_in = [(6000.0, 0.05), (2000.0, 0.10), (1200.0, 1.00)]  # (nominal, run-off)\ninflow = 500.0\n\n# TULIS KODEMU: HQLA efektif setelah haircut, lalu cek batas 40%/15%\nhqla_eff =\n# TULIS KODEMU: outflow tertimbang, inflow max 75%, net outflow\nnet_out =\n# TULIS KODEMU: LCR\nlcr =\nprint(f\"HQLA efektif: Rp{hqla_eff:.0f} M\")\nprint(f\"Net outflow 30d: Rp{net_out:.0f} M\")\nprint(f\"LCR: {lcr:.1f}% -> {'LOLOS' if lcr >= 100 else 'BREACH'} (>= 100%), zona {'WASPADA' if lcr < 140 else 'AMAN'} (< 140%)\")\n",
        lockLines: 6,
        solution: "# Data Bank Artha Likuid (Rp M). JANGAN UBAH.\nl1, l2a, l2b = 1200.0, 400.0, 150.0  # HQLA per tingkat\nhc_2a, hc_2b = 0.15, 0.50            # haircut\noutflow_in = [(6000.0, 0.05), (2000.0, 0.10), (1200.0, 1.00)]  # (nominal, run-off)\ninflow = 500.0\n\n# TULIS KODEMU: HQLA efektif setelah haircut, lalu cek batas 40%/15%\nh2a = l2a * (1 - hc_2a)\nh2b = l2b * (1 - hc_2b)\nhqla_raw = l1 + h2a + h2b\nl2_frac = (h2a + h2b) / hqla_raw\nl2b_frac = h2b / hqla_raw\n# batas: Level 2 <= 40%, Level 2B <= 15% (kelebihan tidak dihitung)\nif l2_frac > 0.40:\n    hqla_eff = l1 / 0.60\nelif l2b_frac > 0.15:\n    hqla_eff = l1 / 0.85 + h2a\nelse:\n    hqla_eff = hqla_raw\n# TULIS KODEMU: outflow tertimbang, inflow max 75%, net outflow\noutflow = sum(nom * ro for nom, ro in outflow_in)\nnet_out = outflow - min(inflow, 0.75 * outflow)\n# TULIS KODEMU: LCR\nlcr = hqla_eff / net_out * 100\nprint(f\"HQLA efektif: Rp{hqla_eff:.0f} M\")\nprint(f\"Net outflow 30d: Rp{net_out:.0f} M\")\nprint(f\"LCR: {lcr:.1f}% -> {'LOLOS' if lcr >= 100 else 'BREACH'} (>= 100%), zona {'WASPADA' if lcr < 140 else 'AMAN'} (< 140%)\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "HQLA efektif = 1615", msg: "1200 + 340 + 75; batas tidak jebol.", name: "hqla_eff", value: 1615, tol: 1e-09 },
          { kind: "equal", task: "t1", label: "Net outflow = 1200", msg: "Outflow 1700 − inflow 500 (di bawah cap 1275).", name: "net_out", value: 1200, tol: 1e-09 },
          { kind: "stdout_matches", task: "t2", label: "LCR 134,6% LOLOS", msg: "1615/1200 = 134,6%.", pattern: "LCR: 134\\.6% -> LOLOS" }
        ],
      },
      reference: "Haircut dulu, batas komposisi, run-off, cap inflow 75%, baru bagi.",
    },
    {
      id: "lab-ew",
      eyebrow: "Langkah 5 · Lab",
      title: "Radar early warning: tren + breach ladder",
      prose: [
        "Satu angka LCR tidak cukup — yang penting trennya. Diberikan deret LCR harian 10 hari: [148, 145, 142, 138, 133, 129, 125, 121, 117, 114]. Tugasmu: hitung penurunan beruntun terpanjang, jumlah hari di bawah 120 (kuning) dan di bawah 110 (merah), lalu tentukan status: HIJAU / KUNING / MERAH / BREACH.",
        "Hasilnya: turun 9 hari beruntun, 2 hari di zona kuning, 0 merah — status KUNING dengan tren memburuk. Aturan eskalasi: tren turun ≥5 hari beruntun = eskalasi ke ALCO walau masih hijau; sentuh kuning = rencana aksi; sentuh merah = contingency funding plan aktif.",
        "Eksperimen: ubah dua angka terakhir menjadi 109 dan 104 — status menjadi MERAH. Perhatikan: dari 114 ke 104 hanya 10 poin, tetapi statusnya melompat dua tingkat. Breach ladder memaksa aksi sebelum 100 tersentuh.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `turun_max`, `n_kuning`, `n_merah`" },
        { id: "t2", text: "Tentukan `status` dan cetak ringkasan" },
      ],
      expected: "Turun beruntun terpanjang: 9 hari\nHari di zona kuning (<120): 2, merah (<110): 0\nStatus: KUNING - eskalasi ke ALCO (tren turun 9 hari)",
      note: {
        title: "Intuisi",
        body: "Early warning yang baik mendeteksi kecepatan, bukan hanya posisi. LCR 114% yang turun 9 hari beruntun lebih berbahaya daripada LCR 112% yang stabil 3 bulan. Laporan tren menjawab 'ke mana arahnya', bukan 'di mana sekarang'.",
      },
      hints: [
        "turun beruntun: bandingkan tiap hari dengan hari sebelumnya.",
        "Kuning: 110 <= x < 120. Merah: 100 <= x < 110. Breach: x < 100.",
        "Status: BREACH jika ada <100; MERAH jika n_merah>0; KUNING jika n_kuning>0 atau turun_max>=5; else HIJAU.",
      ],
      code: {
        starter: "# Deret LCR harian (%). JANGAN UBAH.\nlcr = [148, 145, 142, 138, 133, 129, 125, 121, 117, 114]\n\n# TULIS KODEMU: penurunan beruntun terpanjang\nturun_max =\n# TULIS KODEMU: hitung hari di zona kuning dan merah\nn_kuning =\nn_merah =\n# TULIS KODEMU: status\nstatus =\nprint(f\"Turun beruntun terpanjang: {turun_max} hari\")\nprint(f\"Hari di zona kuning (<120): {n_kuning}, merah (<110): {n_merah}\")\nprint(f\"Status: {status}\")\n",
        lockLines: 2,
        solution: "# Deret LCR harian (%). JANGAN UBAH.\nlcr = [148, 145, 142, 138, 133, 129, 125, 121, 117, 114]\n\n# TULIS KODEMU: penurunan beruntun terpanjang\nturun_max = 0\ncur = 0\nfor i in range(1, len(lcr)):\n    if lcr[i] < lcr[i-1]:\n        cur += 1\n        turun_max = max(turun_max, cur)\n    else:\n        cur = 0\n# TULIS KODEMU: hitung hari di zona kuning dan merah\nn_kuning = sum(1 for x in lcr if 110 <= x < 120)\nn_merah = sum(1 for x in lcr if 100 <= x < 110)\n# TULIS KODEMU: status\nif any(x < 100 for x in lcr):\n    status = \"BREACH - lapor regulator, aktifkan contingency funding plan\"\nelif n_merah > 0:\n    status = \"MERAH - aktifkan contingency funding plan\"\nelif n_kuning > 0 or turun_max >= 5:\n    status = \"KUNING - eskalasi ke ALCO (tren turun %d hari)\" % turun_max\nelse:\n    status = \"HIJAU - monitor rutin\"\nprint(f\"Turun beruntun terpanjang: {turun_max} hari\")\nprint(f\"Hari di zona kuning (<120): {n_kuning}, merah (<110): {n_merah}\")\nprint(f\"Status: {status}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "turun_max = 9", msg: "Deret turun terus 10 hari → 9 penurunan.", name: "turun_max", value: 9, tol: 1e-09 },
          { kind: "equal", task: "t1", label: "n_kuning = 2", msg: "117 dan 114.", name: "n_kuning", value: 2, tol: 1e-09 },
          { kind: "equal", task: "t1", label: "n_merah = 0", msg: "Tidak ada di bawah 110.", name: "n_merah", value: 0, tol: 1e-09 },
          { kind: "stdout_matches", task: "t2", label: "Status KUNING", msg: "Zona kuning + tren 9 hari.", pattern: "Status: KUNING" }
        ],
      },
      reference: "Monitor kecepatan (tren), bukan hanya posisi. ≥5 hari turun = eskalasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "LCR berapa, lapor ke siapa, aksi apa",
      prose: [
        "Satu: LCR ≥ 140% dan tren stabil → HIJAU: laporan rutin treasury harian, ringkasan mingguan ke ALCO. Dua: 120–140% atau turun ≥5 hari beruntun → KUNING: eskalasi ke ALCO, analisis penyebab (HQLA turun? outflow naik? inflow macet?), siapkan rencana aksi 2 minggu. Tiga: 110–120% → KUNING TUA: ALCO menyetujui aksi — tambah HQLA (beli SBN), perpanjang pendanaan, batasi penyaluran baru. Empat: <110% → MERAH: contingency funding plan aktif — gunakan buffer HQLA (diperbolehkan saat stres), jual aset, pinjam ke bank sentral; direksi dan regulator diberi tahu. Lima: <100% → BREACH: lapor regulator sesuai ketentuan, rencana pemulihan tertulis.",
        "Matriks penerima: treasury (harian: LCR, proyeksi 5 hari, posisi kas intraday); ALCO (mingguan: tren 30 hari, breach ladder, sensitivitas); direksi (bulanan: 1 halaman — LCR, NSFR, tren, aksi); regulator (berkala: laporan LCR/NSFR sesuai POJK 42/2015 & 50/2017). Aturan praktis 10 detik: di bawah 120 = ALCO tahu hari ini; di bawah 110 = direksi tahu hari ini; tren turun 5 hari = jangan tunggu angka.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Buffer HQLA boleh dipakai saat stres — itulah gunanya buffer. Bank yang menahan LCR 100% mati-matian sampai tidak berani memakai HQLA-nya sedang mempertahankan angka, bukan likuiditas. Regulator justru mengharapkan buffer dipakai saat stres, dengan rencana pemulihan.",
      },
      reference: "≥140 hijau · 120–140 kuning · 110–120 aksi ALCO · <110 CFP · <100 lapor regulator.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Senin pagi Bank Nusa Dana",
      prose: [
        "Kembali ke cerita pembuka dengan angka. Senin pagi: kewajiban jatuh tempo Rp1.200 M. Kas operasional Rp180 M. HQLA tercatat Rp3.100 M, tetapi Rp1.900 M sedang dijaminkan (encumbered) dan Rp600 M Level 2B melebihi batas 15% sehingga tidak dihitung. HQLA efektif yang bisa dipakai: Rp600 M. Total sumber likuid Senin pagi: Rp780 M. Gap: Rp420 M.",
        "Pertanyaan: (a) Berapa LCR 'kertas' vs LCR 'efektif' jika net outflow 30 hari Rp2.167 M? (b) Tiga aksi treasury sebelum Senin jam 9 pagi? (c) Siapa menerima laporan apa hari ini? Pembahasan: (a) LCR kertas = 3.100/2.167 = 143%; LCR efektif = 600/2.167 = 27,7% — breach telak. Inilah twist cerita: 143% vs 27,7%, bedanya definisi 'bisa dipakai'. (b) Aksi: pinjam overnight antarbank / repo SBN yang tidak dijaminkan; tarik fasilitas standby ke bank sentral; tunda penyaluran kredit baru hari itu. (c) Treasury: posisi kas intraday tiap jam ke kepala treasury; ALCO darurat: gap Rp420 M + rencana penutup; direksi: 1 halaman — LCR efektif 27,7%, aksi, kebutuhan; regulator: sesuai ketentuan pelaporan insiden likuiditas.",
        "Pelajaran untuk pelaporan: laporan likuiditas yang hanya memuat satu angka LCR adalah laporan yang berbohong dengan jujur. Wajib ada tiga baris: HQLA tercatat, HQLA efektif (unencumbered + dalam batas), dan gap jatuh tempo 5 hari ke depan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Encumbrance adalah risiko likuiditas yang tidak terlihat di neraca standar. Aset yang dijaminkan tetap tercatat sebagai aset — tetapi tidak bisa dijual Senin pagi. Laporan likuiditas harian wajib memisahkan unencumbered HQLA; tanpanya, LCR = angka hiasan.",
      },
      reference: "Lapor tiga baris: HQLA tercatat, HQLA efektif, gap 5 hari.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — likuiditas adalah soal definisi 'bisa dipakai', bukan hafalan rumus.",
      ],
      tasks: [],
      summary: [
        "LCR = HQLA efektif / net outflow 30 hari ≥ 100%; HQLA bertingkat dengan haircut 0%/15%/25–50% + batas 40%/15%.",
        "Inflow dibatasi 75% dari outflow; run-off factor 5%/10%/100% sesuai jenis pendanaan.",
        "NSFR = ASF/RSF ≥ 100% (1 tahun): LCR = tabung oksigen 30 hari, NSFR = pola napas setahun.",
        "Early warning = tren + breach ladder (120/110/100); tren turun ≥5 hari = eskalasi.",
        "Lapor tiga baris: HQLA tercatat, HQLA efektif (unencumbered), gap jatuh tempo; penerima: treasury harian, ALCO mingguan, direksi bulanan, regulator berkala.",
      ],
      next: { label: "RR21 — Sustainability/ISSB Reporting", href: "/v2/learn/rr21-sustainability-reporting" },
      quiz: [
        {
          q: "Bank punya HQLA: Level 1 Rp1.200 M, Level 2A Rp400 M, Level 2B Rp150 M (haircut 50%). Berapa HQLA efektif?",
          options: [
            { text: "Rp1.750 M", why: "Itu sebelum haircut (1.200+400+150). Haircut wajib diterapkan dulu." },
            { text: "Rp1.615 M", why: "Benar: 1.200 + 400×0,85 + 150×0,5 = 1.615. Batas 40%/15% tidak jebol (Level 2 = 25,7%).", correct: true },
            { text: "Rp1.540 M", why: "Terlalu rendah — cek lagi: 2A didiskon 15% (bukan 30%), 2B 50%." },
            { text: "Rp1.200 M", why: "Itu hanya Level 1. Level 2A/2B tetap dihitung setelah haircut selama dalam batas." },
          ],
        },
        {
          q: "Outflow 30 hari Rp1.700 M, inflow Rp1.500 M. Berapa net outflow?",
          options: [
            { text: "Rp200 M", why: "Itu 1.700 − 1.500 tanpa batas. Inflow dibatasi 75% dari outflow.", correct: false },
            { text: "Rp425 M", why: "Benar: inflow dihitung maks 75%×1.700 = 1.275; net = 1.700 − 1.275 = 425.", correct: true },
            { text: "Rp1.700 M", why: "Inflow tidak diabaikan total — hanya dibatasi 75%." },
            { text: "Rp0", why: "Inflow tidak boleh menghapus outflow sepenuhnya; minimal 25% harus ditutup HQLA." },
          ],
        },
        {
          q: "Bank LCR 150% tetapi NSFR 95%. Apa artinya?",
          options: [
            { text: "Aman, karena LCR jauh di atas minimum", why: "LCR hanya 30 hari. NSFR <100% = breach struktural — wajib diperbaiki." },
            { text: "Selamat 30 hari, rapuh setahun — struktur pendanaan harus diperbaiki", why: "Tepat. LCR = tabung oksigen; NSFR = pola napas. Keduanya wajib ≥100%.", correct: true },
            { text: "NSFR tidak penting selama LCR tinggi", why: "Keduanya minimum 100% menurut Basel dan POJK 42/2015 & 50/2017." },
            { text: "LCR salah hitung", why: "Keduanya bisa benar bersamaan — menjawab pertanyaan berbeda." },
          ],
        },
        {
          q: "LCR 114%, turun 9 hari beruntun. Tindakan yang benar?",
          options: [
            { text: "Tenang, masih di atas 100%", why: "114% < 120% = zona kuning + tren 9 hari = eskalasi, bukan tenang." },
            { text: "Tunggu sampai 100% baru bertindak", why: "Menunggu breach = contingency plan terlambat. Early warning ada agar bertindak duluan." },
            { text: "Eskalasi ke ALCO dengan analisis penyebab + rencana aksi", why: "Benar: kuning + tren memburuk = ALCO hari ini, bukan minggu depan.", correct: true },
            { text: "Langsung lapor breach ke regulator", why: "114% belum breach (<100%). Lapor breach padahal belum = false alarm." },
          ],
        },
        {
          q: "Mengapa aset yang dijaminkan (encumbered) berbahaya bagi LCR?",
          options: [
            { text: "Karena nilainya nol di neraca", why: "Nilainya tetap tercatat di neraca — masalahnya bukan nilai, melainkan ketersediaan." },
            { text: "Karena tidak bisa dijual/digunakan saat stres walau tercatat sebagai HQLA", why: "Tepat — inilah pelajaran Nusa Dana: LCR kertas 143%, LCR efektif 27,7%.", correct: true },
            { text: "Karena haircut-nya 100%", why: "Bukan soal haircut — aset jaminkan tidak tersedia sama sekali untuk menutup outflow." },
            { text: "Karena dilarang regulator", why: "Menjaminkan aset legal dan normal (repo). Yang wajib = melaporkannya terpisah." },
          ],
        },
      ],
    },
  ],
};
