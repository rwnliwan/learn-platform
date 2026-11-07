import type { V2Lesson } from "../lib/types";

const BRINSON_CAPSTONE_SVG = `<svg viewBox="0 0 520 210" role="img" aria-label="Waterfall atribusi Brinson capstone: alokasi +0,25 persen, seleksi -0,25 persen, interaksi -0,15 persen, total -0,15 persen.">
<line x1="40" y1="120" x2="500" y2="120" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="260" y="20" font-size="13" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Atribusi Brinson: dari mana excess return -0,15% datang?</text>
<rect x="70" y="95" width="60" height="25" fill="var(--c1)" opacity="0.85"/>
<rect x="180" y="120" width="60" height="25" fill="var(--c3)" opacity="0.85"/>
<rect x="290" y="120" width="60" height="15" fill="var(--c3)" opacity="0.85"/>
<rect x="400" y="120" width="60" height="15" fill="var(--c3)" opacity="0.85"/>
<g font-family="var(--font-ui)" text-anchor="middle">
<text x="100" y="85" font-size="11" fill="var(--text)" font-weight="700">+0,25%</text>
<text x="100" y="160" font-size="10" fill="var(--chart-text)">Alokasi</text>
<text x="210" y="160" font-size="11" fill="var(--text)" font-weight="700">-0,25%</text>
<text x="210" y="175" font-size="10" fill="var(--chart-text)">Seleksi</text>
<text x="320" y="150" font-size="11" fill="var(--text)" font-weight="700">-0,15%</text>
<text x="320" y="175" font-size="10" fill="var(--chart-text)">Interaksi</text>
<text x="430" y="150" font-size="11" fill="var(--text)" font-weight="700">-0,15%</text>
<text x="430" y="175" font-size="10" fill="var(--chart-text)">Total</text>
<text x="30" y="124" font-size="9" fill="var(--chart-text)" text-anchor="end">0%</text>
</g>
<text x="260" y="200" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">Batang di atas garis nol = kontribusi positif; di bawah garis nol = kontribusi negatif.</text>
</svg>`;

export const pmcapstone: V2Lesson = {
  slug: "pm-capstone",
  track: "Portfolio Management",
  module: "Capstone",
  title: "PM-Capstone: Audit Portofolio Lengkap — IPS, Alokasi & Atribusi",
  estMinutes: 75,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing",
      title: "Dana pensiun yang surplus — tetapi kinerjanya bocor",
      prose: [
        "Kamu adalah konsultan investasi independen yang diminta mengaudit Dana Pensiun Karyawan PT Nusantara, sebuah defined benefit plan. Data awal (ilustratif, semua angka dalam Rp miliar): aset Rp2.400, nilai kini liabilitas Rp2.200 — funded status 109,09%, surplus Rp200 miliar. Di atas kertas dana ini sehat. Tugasmu: buktikan apakah kesehatan itu nyata atau hanya angka pembuka yang menenangkan.",
        "Audit ini mengintegrasikan seluruh track Portfolio Management: IPS (PM-C1), ekspektasi pasar modal (PM-C2), alokasi aset (PM-C3), konstruksi portofolio (PM-C4), evaluasi kinerja dan atribusi (PM-C5), perilaku (PM-C6), rebalancing (PM-D10), dan etika (PM-A1). Tidak ada langkah yang bisa dilewati — audit yang melewati satu lensa adalah audit yang buta di satu mata.",
        "Tiga pertanyaan yang harus kamu jawab di akhir lesson ini: (1) Apakah alokasi strategis dana ini mampu mencapai tujuan return-nya dalam batas risiko yang ditetapkan? (2) Dari mana excess return tahun lalu datang — dan apa yang harus diperbaiki? (3) Apakah manajernya layak dipertahankan? Setiap jawaban harus berangka — opini tanpa angka bukan audit.",
      ],
      tasks: [],
      note: {
        title: "Cara mengerjakan capstone ini",
        type: "pitfall",
        body: "Kerjakan lab di Langkah 3 dan 5 dengan tangan dan kode sendiri sebelum membaca pembahasannya. Capstone ini bukan bacaan — ia adalah simulasi audit. Nilai yang kamu dapat dari membaca ringkasan saja jauh lebih kecil dari nilai mengerjakan auditnya.",
      },
      reference: "Aset 2.400 · liabilitas 2.200 · funded status 109,09% · surplus 200. Tiga pertanyaan audit: alokasi, atribusi, keputusan manajer.",
    },
    {
      id: "ips",
      eyebrow: "Langkah 2 · IPS",
      title: "Investment Policy Statement: tujuan dan kendala dana",
      prose: [
        "Return objective dana ini adalah 7,0% per tahun — tingkat asumsi aktuaria, yaitu tingkat diskonto liabilitas. Bila return aset di bawah 7,0% secara berkelanjutan, liabilitas tumbuh lebih cepat dari aset dan funded status tergerus. Angka 7,0% bukan target ambisius dari sponsor, melainkan angka yang membuat janji pensiun bisa ditepati.",
        "Risk objective: volatilitas portofolio maksimum 12% (standar deviasi tahunan). Batas ini ditetapkan dewan pengawas setelah stress test: pada volatilitas 12%, peluang funded status jatuh di bawah 100% dalam lima tahun tetap di bawah 10%. Batas risiko bukan hiasan IPS — ia adalah garis yang memisahkan strategi yang berani dari strategi yang sembrono.",
        "Kendalanya lima. Likuiditas: pembayaran manfaat Rp120 miliar per tahun (5% dari AUM) harus tersedia dalam kas dan obligasi jatuh tempo — dana tidak boleh terkunci seluruhnya di aset illiquid. Horizon: panjang, 20 tahun lebih — peserta aktif rata-rata berusia 40 tahun. Pajak: dana pensiun mendapat perlakuan pajak khusus atas hasil investasinya. Legal: investasi dan tata kelola tunduk pada regulasi OJK tentang dana pensiun. Unique: sponsor PT Nusantara memiliki covenant yang kuat, tetapi dana dilarang berkonsentrasi pada saham sponsor sendiri.",
        "Perhatikan hierarki IPS: return objective dan risk objective adalah tujuan; likuiditas, horizon, pajak, legal, dan unique adalah kendala yang membatasi cara mencapai tujuan. Strategi yang mencapai 7,0% tetapi melanggar batas risiko 12% atau mengabaikan kebutuhan likuiditas Rp120 miliar per tahun adalah strategi yang gagal — meski return-nya tercapai.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Return objective 7,0% dana ini berasal dari mana?",
          options: [
            { text: "Asumsi aktuaria — tingkat diskonto liabilitas", why: "Benar: 7,0% adalah tingkat yang membuat aset tumbuh secepat liabilitas. Di bawah itu, funded status tergerus.", correct: true },
            { text: "Return saham historis", why: "Salah: return historis bukan dasar return objective dana pensiun — yang relevan adalah kebutuhan liabilitasnya.", },
            { text: "Target ambisius sponsor", why: "Salah: return objective ditetapkan dari kebutuhan aktuaria, bukan dari ambisi sponsor.", },
          ],
        },
        {
          q: "Manakah yang merupakan risk objective dana ini?",
          options: [
            { text: "Return 7,0% per tahun", why: "Salah: itu return objective, bukan risk objective.", },
            { text: "Volatilitas maksimum 12% (standar deviasi tahunan)", why: "Benar: risk objective dinyatakan sebagai batas risiko yang bisa ditoleransi — di sini SD maksimum 12%.", correct: true },
            { text: "Horizon 20 tahun", why: "Salah: horizon adalah kendala (constraint), bukan risk objective.", },
          ],
        },
      ],
      reference: "Return objective 7,0% (aktuaria) · risk objective SD maks 12% · likuiditas manfaat 120/tahun · horizon 20+ tahun.",
    },
    {
      id: "lab-saa",
      eyebrow: "Langkah 3 · Lab alokasi strategis",
      title: "Apakah alokasi ini mencapai 7,0% dalam batas 12%?",
      prose: [
        "Alokasi strategis (SAA) yang diusulkan konsultan: 50% saham (expected return 10%, standar deviasi 18%), 30% obligasi (6%, 7%), 20% alternatif (8%, 12%). Korelasi: saham-obligasi 0,2; saham-alternatif 0,5; obligasi-alternatif 0,1. Risk-free rate 3%.",
        "Lab ini menghitung tiga angka: expected return portofolio, standar deviasinya, dan Sharpe ratio — lalu menguji dua hal: apakah expected return mencapai return objective 7,0% (cushion), dan apakah standar deviasi berada dalam batas risiko 12%. Alokasi yang gagal satu dari dua ujian ini harus dikembalikan ke meja perancang, betapapun elegan teori di baliknya.",
        "Perhatikan mengapa korelasi penting: tanpa korelasi, standar deviasi portofolio akan tampak jauh lebih besar. Diversifikasi bukan soal jumlah aset, melainkan soal bagaimana aset-aset itu bergerak bersama.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `er` (expected return) dan `var` (varians portofolio)" },
        { id: "t2", text: "Hitung `sdev`, `sharpe`, dan `cushion` (selisih vs return objective)" },
        { id: "t3", text: "Cetak keempatnya dengan `print`" },
      ],
      expected: "E[R]=8.4%  SD=11.02%  Sharpe=0.49  cushion=1.4pp",
      hints: [
        "er = jumlah bobot × return tiap kelas aset.",
        "var = jumlah kuadrat (bobot × SD) + 2 × jumlah (bobot×SD × bobot×SD × korelasi) tiap pasangan.",
        "sdev = akar var; sharpe = (er − rf) ÷ sdev; cushion = er − r_butuh.",
      ],
      code: {
        starter: `# SAA Dana Pensiun Nusantara (desimal)\nw = [0.50, 0.30, 0.20]\nr = [0.10, 0.06, 0.08]\nsd = [0.18, 0.07, 0.12]\ncorr_sb, corr_sa, corr_ba = 0.2, 0.5, 0.1\nrf = 0.03\nr_butuh = 0.07\n\n# TULIS KODEMU\ner = \nvar = \nsdev = \nsharpe = \ncushion = \n\nprint(f"E[R]={er*100:.1f}%  SD={sdev*100:.2f}%  Sharpe={sharpe:.2f}  cushion={cushion*100:.1f}pp")`,
        lockLines: 7,
        solution: `# SAA Dana Pensiun Nusantara (desimal)\nw = [0.50, 0.30, 0.20]\nr = [0.10, 0.06, 0.08]\nsd = [0.18, 0.07, 0.12]\ncorr_sb, corr_sa, corr_ba = 0.2, 0.5, 0.1\nrf = 0.03\nr_butuh = 0.07\n\n# TULIS KODEMU\ner = w[0]*r[0] + w[1]*r[1] + w[2]*r[2]\nvar = (w[0]*sd[0])**2 + (w[1]*sd[1])**2 + (w[2]*sd[2])**2 + 2*(w[0]*sd[0]*w[1]*sd[1]*corr_sb + w[0]*sd[0]*w[2]*sd[2]*corr_sa + w[1]*sd[1]*w[2]*sd[2]*corr_ba)\nsdev = var ** 0.5\nsharpe = (er - rf) / sdev\ncushion = er - r_butuh\n\nprint(f"E[R]={er*100:.1f}%  SD={sdev*100:.2f}%  Sharpe={sharpe:.2f}  cushion={cushion*100:.1f}pp")`,
        checks: [
          { kind: "equal", task: "t1", name: "er", value: 0.084, tol: 1e-9, label: "`er` = 8,4%", msg: "0,50×10% + 0,30×6% + 0,20×8% = 8,4%." },
          { kind: "equal", task: "t1", name: "var", value: 0.0121338, tol: 1e-6, label: "`var` sekitar 0,0121", msg: "Varians portofolio = 121,338 (dalam persen kuadrat) — korelasi menahannya di bawah jumlah varians individu." },
          { kind: "equal", task: "t2", name: "sdev", value: 0.1102, tol: 0.001, label: "`sdev` sekitar 11,02%", msg: "Akar 0,0121338 = 11,02% — di dalam batas risiko 12%." },
          { kind: "equal", task: "t2", name: "sharpe", value: 0.49, tol: 0.01, label: "`sharpe` sekitar 0,49", msg: "(8,4% − 3%) ÷ 11,02% = 0,49." },
          { kind: "equal", task: "t2", name: "cushion", value: 0.014, tol: 1e-9, label: "`cushion` = 1,4pp", msg: "8,4% − 7,0% = 1,4pp di atas return objective." },
          { kind: "stdout_matches", task: "t3", pattern: "E\\[R\\]=8\\.4%\\s+SD=11\\.02%\\s+Sharpe=0\\.49\\s+cushion=1\\.4pp", label: "`print` menampilkan keempatnya", msg: "Format: E[R]=...  SD=...  Sharpe=...  cushion=... ." },
        ],
      },
      reference: "SAA lolos dua ujian: expected return 8,4% (cushion 1,4pp di atas 7,0%) dan SD 11,02% (di dalam batas 12%).",
    },
    {
      id: "realisasi",
      eyebrow: "Langkah 4 · Realisasi satu tahun",
      title: "Aset naik — tetapi funded status turun",
      prose: [
        "Satu tahun berlalu. Realisasi portofolio: saham 8%, obligasi 5%, alternatif 6% — dengan bobot aktual 55% saham, 30% obligasi, 15% alternatif (bobot bergeser karena saham naik lebih cepat). Return portofolio = 0,55 × 8% + 0,30 × 5% + 0,15 × 6% = 6,80%. Benchmark (bobot strategis 50/30/20; return sektor 9%, 5,5%, 4%) = 0,50 × 9% + 0,30 × 5,5% + 0,20 × 4% = 6,95%. Excess return = 6,80% − 6,95% = −0,15%.",
        "Aset akhir = 2.400 × 1,068 = Rp2.563,2 miliar. Liabilitas tumbuh pada tingkat diskonto 7,5% menjadi 2.200 × 1,075 = Rp2.365 miliar. Funded status akhir = 2.563,2 ÷ 2.365 = 108,38% — turun dari 109,09% meski aset naik. Surplus menyusut dari Rp200 miliar menjadi Rp198,2 miliar.",
        "Untuk menyederhanakan perhitungan ini, iuran masuk diasumsikan sama dengan manfaat keluar (arus kas neto nol) — sehingga perubahan funded status murni mencerminkan selisih return aset dan pertumbuhan liabilitas. Pelajarannya: dana pensiun tidak dinilai dari return absolut, melainkan dari return relatif terhadap liabilitasnya. Return 6,80% yang tampak lumayan adalah kegagalan relatif bila liabilitas tumbuh 7,5%.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Aset naik 6,80% tetapi funded status turun dari 109,09% ke 108,38%. Mengapa?",
          options: [
            { text: "Karena aset turun", why: "Salah: aset naik dari 2.400 menjadi 2.563,2 — aset tidak turun.", },
            { text: "Karena liabilitas tumbuh 7,5%, lebih cepat dari aset 6,80%", why: "Benar: funded status adalah rasio aset terhadap liabilitas — bila penyebut tumbuh lebih cepat, rasio turun meski pembilang naik.", correct: true },
            { text: "Karena iuran masuk berkurang", why: "Salah: perhitungan ini mengasumsikan arus kas neto nol — penjelasannya ada pada selisih pertumbuhan, bukan iuran.", },
          ],
        },
      ],
      reference: "Realisasi: Rp 6,80% vs benchmark 6,95% (excess −0,15%). Funded status 108,38% (dari 109,09%); surplus 198,2.",
    },
    {
      id: "lab-brinson",
      eyebrow: "Langkah 5 · Lab atribusi Brinson",
      title: "Bedah nilai tambah: siapa yang salah, siapa yang benar",
      prose: [
        "Excess return −0,15% harus diurai sebelum ada yang disalahkan. Metode Brinson (PM-C5): Allocation = (w_p − w_b) × R_b; Selection = w_b × (R_p − R_b); Interaction = (w_p − w_b) × (R_p − R_b). Data per kelas aset: saham w_p 55% vs w_b 50%, R_p 8% vs R_b 9%; obligasi w_p 30% vs w_b 30%, R_p 5% vs R_b 5,5%; alternatif w_p 15% vs w_b 20%, R_p 6% vs R_b 4%.",
        "Hitung per komponen: alokasi = 0,05 × 9% + 0 × 5,5% + (−0,05) × 4% = +0,25%. Seleksi = 0,50 × (8% − 9%) + 0,30 × (5% − 5,5%) + 0,20 × (6% − 4%) = −0,25%. Interaksi = 0,05 × (8% − 9%) + 0 + (−0,05) × (6% − 4%) = −0,15%. Total = +0,25% − 0,25% − 0,15% = −0,15% — sama dengan excess return, seperti yang harus terjadi.",
        "Diagnosisnya tajam: alokasi POSITIF 0,25% — keputusan overweight saham dan underweight alternatif adalah keputusan yang benar. Seleksi NEGATIF 0,25% — saham dan obligasi yang dipilih kalah dari sektornya. Manajer ini pandai menebak arah, buruk memilih sekuritas. Lab ini juga menghitung perdagangan rebalancing: saham aktual 55% vs target 50% — jual selisihnya; alternatif aktual 15% vs target 20% — beli selisihnya; obligasi sudah pas.",
      ],
      figure: {
        svg: BRINSON_CAPSTONE_SVG,
        alt: "Waterfall atribusi Brinson capstone: alokasi +0,25 persen, seleksi -0,25 persen, interaksi -0,15 persen, total -0,15 persen.",
        caption: "Atribusi Brinson: +0,25% alokasi − 0,25% seleksi − 0,15% interaksi = −0,15% excess return.",
      },
      formula: String.raw`R_p - R_b = \sum (w_p - w_b)R_b + \sum w_b(R_p - R_b) + \sum (w_p - w_b)(R_p - R_b)`,
      tasks: [
        { id: "t1", text: "Hitung `alloc`, `selec`, `inter`, dan `total`" },
        { id: "t2", text: "Hitung `jual_saham` dan `beli_alt` (Rp miliar) untuk rebalancing" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      formulaNote: "R_p − R_b = selisih return portofolio vs benchmark yang diurai menjadi tiga: (w_p − w_b)R_b = efek alokasi; w_b(R_p − R_b) = efek seleksi; (w_p − w_b)(R_p − R_b) = interaksi. Jumlah ketiganya selalu sama dengan excess return total — pakai ini sebagai cek konsistensi.",
      expected: "alloc=+0.25%  selec=-0.25%  inter=-0.15%  total=-0.15%\njual_saham=128.16  beli_alt=128.16",
      hints: [
        "alloc = jumlah (wp − wb) × rb tiap kelas aset.",
        "selec = jumlah wb × (rp − rb); inter = jumlah (wp − wb) × (rp − rb).",
        "jual_saham = (wp saham − wb saham) × aum; beli_alt = (wb alt − wp alt) × aum.",
      ],
      code: {
        starter: `# Atribusi Brinson + rebalancing (desimal; Rp miliar)\nwp = [0.55, 0.30, 0.15]\nwb = [0.50, 0.30, 0.20]\nrp = [0.08, 0.05, 0.06]\nrb = [0.09, 0.055, 0.04]\naum = 2563.2\n\n# TULIS KODEMU\nalloc = \nselec = \ninter = \ntotal = \njual_saham = \nbeli_alt = \n\nprint(f"alloc={alloc*100:+.2f}%  selec={selec*100:+.2f}%  inter={inter*100:+.2f}%  total={total*100:+.2f}%")\nprint(f"jual_saham={jual_saham:.2f}  beli_alt={beli_alt:.2f}")`,
        lockLines: 6,
        solution: `# Atribusi Brinson + rebalancing (desimal; Rp miliar)\nwp = [0.55, 0.30, 0.15]\nwb = [0.50, 0.30, 0.20]\nrp = [0.08, 0.05, 0.06]\nrb = [0.09, 0.055, 0.04]\naum = 2563.2\n\n# TULIS KODEMU\nalloc = sum((wp[i]-wb[i])*rb[i] for i in range(3))\nselec = sum(wb[i]*(rp[i]-rb[i]) for i in range(3))\ninter = sum((wp[i]-wb[i])*(rp[i]-rb[i]) for i in range(3))\ntotal = alloc + selec + inter\njual_saham = (wp[0]-wb[0]) * aum\nbeli_alt = (wb[2]-wp[2]) * aum\n\nprint(f"alloc={alloc*100:+.2f}%  selec={selec*100:+.2f}%  inter={inter*100:+.2f}%  total={total*100:+.2f}%")\nprint(f"jual_saham={jual_saham:.2f}  beli_alt={beli_alt:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "alloc", value: 0.0025, tol: 1e-9, label: "`alloc` = +0,25%", msg: "0,05×9% + 0 − 0,05×4% = +0,25%. Keputusan arah alokasi benar." },
          { kind: "equal", task: "t1", name: "selec", value: -0.0025, tol: 1e-9, label: "`selec` = −0,25%", msg: "0,50×(−1%) + 0,30×(−0,5%) + 0,20×(+2%) = −0,25%. Pemilihan sekuritas kalah dari sektornya." },
          { kind: "equal", task: "t1", name: "inter", value: -0.0015, tol: 1e-9, label: "`inter` = −0,15%", msg: "0,05×(−1%) + 0 − 0,05×(+2%) = −0,15%." },
          { kind: "equal", task: "t1", name: "total", value: -0.0015, tol: 1e-9, label: "`total` = −0,15%", msg: "+0,25 − 0,25 − 0,15 = −0,15% — sama dengan excess return. Cek konsistensi lolos." },
          { kind: "equal", task: "t2", name: "jual_saham", value: 128.16, tol: 0.01, label: "`jual_saham` = 128,16", msg: "(55% − 50%) × 2.563,2 = 128,16 (Rp miliar)." },
          { kind: "equal", task: "t2", name: "beli_alt", value: 128.16, tol: 0.01, label: "`beli_alt` = 128,16", msg: "(20% − 15%) × 2.563,2 = 128,16 (Rp miliar) — dana hasil penjualan saham." },
          { kind: "stdout_matches", task: "t3", pattern: "total=-0\\.15%\\s+jual_saham=128\\.16\\s+beli_alt=128\\.16", label: "`print` menampilkan total dan perdagangan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Atribusi: alokasi +0,25% (skill arah) vs seleksi −0,25% (lemah). Rebalancing: jual saham 128,16; beli alternatif 128,16.",
    },
    {
      id: "rebalancing",
      eyebrow: "Langkah 6 · Rebalancing",
      title: "Batas yang tersentuh: jual saham, beli alternatif",
      prose: [
        "Kebijakan rebalancing dana: pita (band) ±5 poin persentase dari bobot strategis. Saham aktual 55% vs target 50% — tepat di batas atas pita (50% + 5pp). Rebalancing DIPICU: jual saham Rp128,16 miliar dan beli alternatif Rp128,16 miliar; obligasi sudah tepat di target 30%, tidak disentuh.",
        "Biaya rebalancing diasumsikan 0,1% dari nilai perdagangan — sekitar Rp0,13 miliar untuk perdagangan Rp128,16 miliar. Biaya ini kecil dibanding risiko membiarkan saham terus menggelembung di luar pita: bila saham naik 10% lagi tanpa rebalancing, bobotnya menjadi sekitar 57% dan risiko portofolio melampaui batas IPS.",
        "Perhatikan disiplinnya: rebalancing bukan menebak arah pasar — ini menegakkan IPS. Manajer yang menunda rebalancing karena “saham masih akan naik” sedang mengganti kebijakan dengan spekulasi. Audit yang baik memeriksa bukan hanya apakah rebalancing dilakukan, tetapi apakah dilakukan saat pita tersentuh, bukan saat manajer merasa nyaman.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira rebalancing bertujuan meningkatkan return. Tujuan utamanya adalah menegakkan profil risiko IPS — return adalah efek samping, bukan target. Rebalancing yang “terlambat karena pasar masih bagus” adalah pelanggaran disiplin, bukan kehati-hatian.",
      },
      reference: "Pita ±5pp: saham 55% tepat di batas atas → rebalance. Jual 128,16; beli 128,16; biaya asumsi 0,1%.",
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 7 · Keputusan",
      title: "Pertahankan atau pecat — dan satu temuan etika",
      prose: [
        "Keputusan atas manajer: PERTAHANKAN, dengan perbaikan proses seleksi. Alasannya ada pada atribusi: alokasi +0,25% adalah skill yang langka — keputusan overweight saham dan underweight alternatif terbukti benar. Seleksi −0,25% adalah kelemahan yang bisa diperbaiki (proses analis, universe, model). Memecat manajer karena total −0,15% berarti membuang skill alokasi yang langka bersama kelemahan seleksi yang bisa diperbaiki. Syaratnya: rencana perbaikan seleksi tertulis dalam 90 hari dan evaluasi ulang kuartal berikutnya.",
        "Namun audit menemukan satu temuan etika yang tidak bisa ditawar. Manajer memakai komisi trading dana — uang klien — untuk membayar sewa kantornya, dengan alasan “biaya operasional mendukung riset”. Ini penyalahgunaan soft dollars: komisi klien hanya boleh dipakai untuk riset dan jasa yang benar-benar membantu keputusan investasi klien yang membayar komisinya, disertai best execution dan disclosure tertulis. Sewa kantor tidak memenuhi satu pun syarat itu. Ini pelanggaran III(A) Loyalty, Prudence, and Care — dan harus dilaporkan ke dewan pengawas dengan tuntutan penghentian praktik serta pengungkapan kepada peserta dana.",
        "Dua vonis yang berbeda arahnya — pertahankan manajer, hukum praktiknya — adalah inti audit: nilai orang dari skill-nya, nilai perbuatan dari standarnya. Audit yang hanya memuji atau hanya menghukum sama-sama gagal.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Atribusi: alokasi +0,25%, seleksi −0,25%, total −0,15%. Keputusan yang tepat atas manajer?",
          options: [
            { text: "Pecat segera — totalnya negatif", why: "Salah: total negatif menyembunyikan skill alokasi yang langka. Memecat membuang skill itu bersama kelemahannya.", },
            { text: "Pertahankan dengan rencana perbaikan seleksi tertulis — alokasi adalah skill langka, seleksi bisa diperbaiki", why: "Benar: diagnosis atribusi memisahkan apa yang harus dipertahankan dari apa yang harus diperbaiki.", correct: true },
            { text: "Tambah alokasi dana ke manajer ini", why: "Salah: seleksi yang lemah belum diperbaiki — menambah dana sebelum perbaikan adalah hadiah untuk kelemahan.", },
          ],
        },
        {
          q: "Manajer memakai komisi trading dana untuk membayar sewa kantor. Ini?",
          options: [
            { text: "Boleh bila diungkapkan ke dewan", why: "Salah: sewa kantor bukan riset yang bermanfaat bagi klien yang membayar komisi — disclosure tidak menyembuhkan pemakaian yang salah sasaran.", },
            { text: "Pelanggaran III(A) — soft dollars untuk manfaat manajer, bukan klien", why: "Benar: komisi klien hanya boleh dipakai untuk jasa yang membantu keputusan investasi klien itu, dengan best execution dan disclosure.", correct: true },
            { text: "Tidak ada pelanggaran — sewa kantor mendukung riset", why: "Salah: “mendukung riset” secara tidak langsung tidak memenuhi syarat soft dollars — manfaatnya harus langsung bagi keputusan investasi klien.", },
          ],
        },
      ],
      reference: "Pertahankan manajer (alokasi +0,25% langka), perbaiki seleksi. Soft dollars untuk sewa kantor = pelanggaran III(A).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Audit selesai: tiga jawaban, tiga angka",
      prose: [
        "Tiga pertanyaan audit dari Langkah 1 kini terjawab dengan angka. (1) Alokasi strategis MAMPU mencapai tujuan: expected return 8,4% dengan cushion 1,4pp di atas return objective 7,0%, dan SD 11,02% di dalam batas risiko 12%. (2) Excess return −0,15% berasal dari seleksi yang lemah (−0,25%) dan interaksi (−0,15%), sebagian diimbangi alokasi yang benar (+0,25%). (3) Manajer layak DIPERTAHANKAN dengan perbaikan seleksi — tetapi praktik soft dollars-nya harus dihentikan dan diungkapkan.",
        "Satu catatan kejujuran audit: perhitungan funded status mengasumsikan arus kas neto nol (iuran = manfaat). Bila iuran masuk lebih kecil dari manfaat keluar, funded status akhir lebih rendah dari 108,38% yang dihitung di sini. Asumsi yang dinyatakan adalah asumsi yang bisa diuji — asumsi yang disembunyikan adalah lubang audit.",
        "Langkah berikutnya: terapkan audit yang sama pada portofoliomu sendiri atau pada Proyek Konstruksi Portofolio Berbasis IPS — dari angka klien sampai audit konsultan. Capstone ini menutup track Portfolio Management; proyek adalah tempat kamu membuktikan audit ini tanpa panduan langkah demi langkah.",
      ],
      tasks: [],
      summary: [
        "IPS: return objective 7,0% (aktuaria), risk objective SD maks 12%, likuiditas manfaat 120/tahun.",
        "SAA: expected return 8,4%, SD 11,02%, Sharpe 0,49, cushion 1,4pp — lolos dua ujian.",
        "Realisasi: Rp 6,80% vs benchmark 6,95% (excess −0,15%); funded status 108,38% (dari 109,09%).",
        "Atribusi: alokasi +0,25%, seleksi −0,25%, interaksi −0,15%.",
        "Rebalancing: saham 55% di batas pita → jual 128,16; beli alternatif 128,16.",
        "Keputusan: pertahankan manajer, perbaiki seleksi; soft dollars untuk sewa kantor = pelanggaran III(A).",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Aset akhir Rp2.563,2 miliar dan liabilitas akhir Rp2.365 miliar. Berapa funded status akhir?",
          options: [
            { text: "109,09%", why: "Salah: itu funded status awal (2.400 ÷ 2.200).", },
            { text: "108,38%", why: "Benar: 2.563,2 ÷ 2.365 = 108,38%.", correct: true },
            { text: "106,80%", why: "Salah: 2.563,2 ÷ 2.400 membandingkan aset akhir dengan aset awal — bukan dengan liabilitas.", },
          ],
        },
        {
          q: "Atribusi Brinson capstone ini: alokasi +0,25%, seleksi −0,25%, interaksi −0,15%. Berapa totalnya dan apa artinya?",
          options: [
            { text: "−0,15% — sama dengan excess return; manajer pandai arah, lemah seleksi", why: "Benar: +0,25 − 0,25 − 0,15 = −0,15%, sama dengan 6,80% − 6,95%.", correct: true },
            { text: "+0,15% — manajer mengalahkan benchmark", why: "Salah: totalnya negatif — manajer di bawah benchmark sebesar 0,15%.", },
            { text: "−0,65% — semua komponen negatif", why: "Salah: alokasinya positif (+0,25%); yang negatif adalah seleksi dan interaksi.", },
          ],
        },
        {
          q: "Saham aktual 55% vs target 50% dengan pita ±5pp. Tindakan rebalancing yang benar?",
          options: [
            { text: "Tidak perlu — masih dalam pita", why: "Salah: 55% tepat di batas atas pita (50% + 5pp) — rebalancing dipicu.", },
            { text: "Jual saham Rp128,16 miliar dan beli alternatif Rp128,16 miliar", why: "Benar: kembalikan saham ke 50% dan alternatif ke 20%; obligasi sudah pas di 30%.", correct: true },
            { text: "Beli saham lagi — trennya masih naik", why: "Salah: membeli saham justru menjauhi target IPS — rebalancing menegakkan kebijakan, bukan menebak pasar.", },
          ],
        },
      ],
    },
  ],
};
