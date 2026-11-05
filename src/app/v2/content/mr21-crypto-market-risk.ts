import type { V2Lesson } from "../lib/types";

const FIG_DEPEG = `<svg viewBox="0 0 480 250" role="img" aria-label="Perbandingan depeg: UST jatuh ke 0,35 dolar, USDC ke 0,87 dolar.">
<g font-family="var(--font-ui)">
<text x="240" y="22" font-size="13" fill="var(--chart-text)" text-anchor="middle">Dua depeg, dua nasib: harga terendah vs $1</text>
<text x="10" y="70" font-size="12" fill="var(--chart-text)">UST (Mei 2022)</text>
<text x="10" y="90" font-size="10" fill="var(--chart-text)">algoritmik</text>
<rect x="140" y="52" width="126" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="150" y="70" font-size="11" fill="#fff">$0,35</text>
<rect x="266" y="52" width="204" height="26" fill="var(--chart-grid)" opacity="0.9"/>
<text x="10" y="140" font-size="12" fill="var(--chart-text)">USDC (Mar 2023)</text>
<text x="10" y="160" font-size="10" fill="var(--chart-text)">fiat-backed</text>
<rect x="140" y="122" width="313" height="26" fill="var(--c3)" opacity="0.9"/>
<text x="150" y="140" font-size="11" fill="#fff">$0,87</text>
<rect x="453" y="122" width="17" height="26" fill="var(--chart-grid)" opacity="0.9"/>
<text x="140" y="190" font-size="11" fill="var(--chart-text)">Batang penuh = $1,00 (peg). UST tidak pernah kembali; USDC repeg 2 hari.</text>
<text x="140" y="210" font-size="11" fill="var(--chart-text)">Pelajaran: desain menentukan apakah depeg = luka atau mati.</text>
</g>
</svg>`;

const FIG_PETA_CRYPTO = `<svg viewBox="0 0 480 250" role="img" aria-label="Peta keputusan eksposur crypto: empat jalur perlakuan.">
<g font-family="var(--font-ui)">
<text x="240" y="22" font-size="13" fill="var(--chart-text)" text-anchor="middle">Eksposur crypto apa? Ikuti jalurnya</text>
<rect x="20" y="45" width="200" height="70" rx="8" fill="var(--c1)" opacity="0.85"/>
<text x="120" y="70" font-size="11" fill="#fff" text-anchor="middle">Simpan stablecoin</text>
<text x="120" y="90" font-size="10" fill="#fff" text-anchor="middle">→ fiat-backed + cek atestasi</text>
<text x="120" y="106" font-size="10" fill="#fff" text-anchor="middle">+ konsentrasi bank penerbit</text>
<rect x="260" y="45" width="200" height="70" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="360" y="70" font-size="11" fill="#fff" text-anchor="middle">Basis trade</text>
<text x="360" y="90" font-size="10" fill="#fff" text-anchor="middle">→ monitor basis &amp; funding</text>
<text x="360" y="106" font-size="10" fill="#fff" text-anchor="middle">→ rencana unwind tertulis</text>
<rect x="20" y="135" width="200" height="70" rx="8" fill="var(--c3)" opacity="0.85"/>
<text x="120" y="160" font-size="11" fill="#fff" text-anchor="middle">Dana di exchange</text>
<text x="120" y="180" font-size="10" fill="#fff" text-anchor="middle">→ limit per exchange</text>
<text x="120" y="196" font-size="10" fill="#fff" text-anchor="middle">→ kustodian qualified</text>
<rect x="260" y="135" width="200" height="70" rx="8" fill="var(--c4)" opacity="0.85"/>
<text x="360" y="160" font-size="11" fill="#fff" text-anchor="middle">Lapor VaR desk crypto</text>
<text x="360" y="180" font-size="10" fill="#fff" text-anchor="middle">→ HS/EVT + add-on likuiditas</text>
<text x="360" y="196" font-size="10" fill="#fff" text-anchor="middle">→ jangan parametrik murni</text>
<text x="240" y="230" font-size="11" fill="var(--chart-text)" text-anchor="middle">Aturan 10 detik: stablecoin BUKAN kas sampai desainnya terbukti.</text>
</g>
</svg>`;

export const mr21: V2Lesson = {
  slug: "mr21-crypto-market-risk",
  track: "Market Risk",
  module: "Aset Digital",
  title: "MR21 — Crypto Market Risk: Saat 'Stabil' Tidak Stabil",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kas $2 juta yang menguap dalam 5 hari",
      prose: [
        "Awal Mei 2022, treasury sebuah startup menaruh $2 juta di TerraUSD (UST) — stablecoin 'seharga $1' yang memberi imbal hasil ~20% di Anchor Protocol. Di laporan internal, posisinya dicatat sebagai 'setara kas'. VaR 99% dari data 2021 tidak menunjukkan apa-apa: UST memang nyaris tidak pernah bergerak dari $1.",
        "7 Mei: UST mulai goyah. 9 Mei: jatuh ke $0,35. 12 Mei: token saudaranya, LUNA, ambruk dari ~$80 menjadi sen — mekanisme 'stabilisasi' algoritmiknya justru mencetak triliunan LUNA baru dalam death spiral. 'Kas' $2 juta itu bernilai ~$300 ribu pada 12 Mei. Tidak ada peringatan dari model risiko: kejadian ini tidak ada di jendela data mana pun.",
        "Setahun kemudian, 11 Maret 2023, giliran USDC — stablecoin terbesar kedua, berdesain fiat-backed yang 'aman' — jatuh ke ~$0,87. Penyebabnya bukan crypto sama sekali: penerbitnya, Circle, mengungkapkan $3,3 miliar dari ~$40 miliar cadangannya terjebak di Silicon Valley Bank yang kolaps. USDC kembali ke $1 dalam dua hari setelah pemerintah AS menjamin seluruh deposan SVB. Dua depeg, dua pelajaran berbeda.",
        "Prasyarat ringkas — Value at Risk: ambang kerugian yang hanya terlampaui dengan peluang 1−α (mis. VaR 99% terlampaui ~1 hari dari 100); dihitung dari kuantil distribusi return historis atau asumsi parametrik. Lesson ini menunjukkan mengapa mesin VaR standar — yang bekerja cukup baik untuk saham dan obligasi — rusak saat dipakai untuk crypto.",
        "Setelah lesson ini kamu bisa: (1) membedakan tiga desain stablecoin dan cara masing-masing gagal; (2) menghitung dan membaca basis futures-spot sebagai sinyal stress; (3) menjelaskan empat alasan VaR standar gagal untuk crypto; (4) merancang mitigasi risiko custody dan exchange.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko terbesar crypto bukan volatilitasnya — volatilitas terlihat di VaR. Risiko terbesarnya adalah hal yang TIDAK terlihat: depeg, exchange yang membeku, dan likuiditas yang menguap tepat saat kamu butuh keluar. Lesson ini tentang mengukur yang tak terlihat itu.",
      },
      reference: "UST: algoritmik → mati (Mei 2022). USDC: fiat-backed → luka, sembuh 2 hari (Mar 2023).",
    },
    {
      id: "stablecoin",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga desain stablecoin, tiga cara ingkar janji",
      prose: [
        "Desain 1: fiat-backed (USDC, USDT). Tiap token diklaim didukung $1 di cadangan — kas, T-bill, deposito bank. Cara gagalnya: risiko cadangan. Kasus USDC–SVB membuktikan stablecoin 'aman' pun membawa risiko bank tradisional: 8% cadangannya di satu bank yang kolaps cukup untuk memicu depeg 13%. Yang perlu dimonitor: atestasi cadangan berkala DAN konsentrasi bank kustodian penerbit.",
        "Desain 2: crypto-backed overcollateralized (DAI). Token didukung crypto lain dengan agunan berlebih (mis. 150%) + likuidasi otomatis. Cara gagalnya: likuidasi berantai saat agunan jatuh terlalu cepat — mekanisme yang menyelamatkan di pasar normal menjadi akselerator di pasar panik. Lebih tahan dari algoritmik, tetapi tidak imun terhadap gap likuiditas.",
        "Desain 3: algoritmik (UST). Tidak ada cadangan; peg dijaga insentif arbitrase dengan token saudara (LUNA). Cara gagalnya: death spiral — saat kepercayaan hilang, arbitrase yang seharusnya menstabilkan justru mencetak LUNA tanpa batas, menekan harganya ke nol, yang semakin menghancurkan kepercayaan. Kepribadiannya seperti janji 'pasti bayar' yang didukung oleh janji lain: selama tidak ada yang menagih serentak, terlihat kokoh.",
        "Cara membaca figur: panjang batang = harga terendah saat depeg relatif terhadap $1. Interpretasi: UST kehilangan 65% dan tidak pernah kembali — desain algoritmik membuat depeg = kematian. USDC kehilangan 13% dan pulih 2 hari — cadangan fiat membuat depeg = luka yang bisa sembuh jika kepercayaan ke penerbit pulih.",
        "🚨 Mitos: 'Stablecoin = dolar digital, perlakukan sebagai kas.' Yang benar: hanya fiat-backed dengan atestasi kuat yang mendekati kas — dan tetap membawa risiko penerbit + risiko bank kustodiannya. UST diperlakukan sebagai kas oleh ribuan treasury; catatannya 'setara kas' berubah menjadi kerugian 85% dalam semalam.",
        "💡 Intuisi: nilai stablecoin = nilai JAMINANNYA, bukan nilai janjinya. Sebelum menaruh dana, jawab: jika semua orang redeem serentak besok, dari mana dolarnya keluar — dan berapa lama? Jika jawabannya 'dari token lain yang harganya juga jatuh', itu bukan cadangan.",
      ],
      figure: {
        svg: FIG_DEPEG,
        alt: "Batang perbandingan depeg UST ($0,35) vs USDC ($0,87).",
        caption: "Depeg UST = kematian (tak kembali). Depeg USDC = luka (repeg 2 hari). Desain menentukan.",
      },
      tasks: [
        { id: "t1", text: "Sebutkan tiga desain stablecoin dan SATU cara gagal khas masing-masing." },
        { id: "t2", text: "Mengapa depeg USDC sembuh dalam 2 hari sedangkan UST tidak pernah?" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira 'fiat-backed' = 'tanpa risiko'. USDC adalah fiat-backed dan tetap depeg 13%. Cadangan fiat memindahkan risiko — dari risiko algoritma ke risiko bank kustodian dan risiko operasional penerbit — bukan menghilangkannya.",
      },
      hints: [
        "Tanya 'dari mana dolarnya keluar saat redeem massal' untuk tiap desain.",
        "Atestasi cadangan = foto; konsentrasi bank = risiko di balik foto.",
      ],
      reference: "Fiat-backed: risiko cadangan. Crypto-backed: risiko likuidasi. Algoritmik: death spiral.",
    },
    {
      id: "basis",
      eyebrow: "Langkah 3 · Konsep",
      title: "Basis futures-spot: termometer stress crypto",
      prose: [
        "Basis = selisih harga futures terhadap spot, dalam persen: (F − S)/S. Basis positif (contango) = pasar membayar premi untuk leverage long via futures; basis negatif (backwardation) = tekanan jual / biaya short tinggi. Di crypto, basis CME Bitcoin yang normal berkisar 1–3% (annualized belasan persen) — cerminan permintaan leverage ritel.",
        "Kepribadiannya seperti demam: basis normal = suhu tubuh 36–37°C; basis yang berbalik negatif dalam = demam tinggi — sinyal stress, forced selling, atau kesulitan pendanaan. Saat crash, basis bisa anjlok ke −5% atau lebih dalam hitungan jam karena semua orang berebut keluar via futures yang lebih likuid.",
        "Sepupu basis adalah funding rate di perpetual futures: pembayaran periodik antara long dan short yang menjaga harga perps dekat spot. Funding positif tinggi = pasar terlalu long dan berisiko long squeeze; funding negatif dalam = pasar terlalu short. Trader basis (long spot + short futures) memanen basis positif sebagai carry — tetapi carry ini evaporasi tepat saat dibutuhkan, karena basis kolaps di momen stress.",
        "Contoh angka: spot $67.000, futures 1-bulan $68.200 → basis +1,79% (contango sehat). Skenario stress: futures $64.800 → basis −3,28% (backwardation dalam = sinyal STRESS). Untuk notional $5 juta, pergerakan basis 5,07 poin = $253.500 ayunan P&L — dihitung di mini-case.",
        "🚨 Mitos: 'Basis trade (cash-and-carry) = arbitrase bebas risiko.' Yang benar: ia bebas risiko HARGA, bukan bebas risiko basis, funding, atau eksekusi. Basis bisa melebar melawanmu, funding bisa berbalik, dan saat exchange halt kamu tidak bisa menutup kaki mana pun.",
        "💡 Intuisi: jangan hanya melihat LEVEL basis — lihat KECEPATAN perubahannya. Basis yang bergerak 5 poin dalam sehari = pasar berteriak; basis yang sama tercapai dalam sebulan = repricing normal.",
      ],
      formula: String.raw`\text{Basis} = \frac{F - S}{S} \times 100\%`,
      formulaNote: "F = harga futures, S = harga spot (mata uang sama). Contoh: (68.200 − 67.000)/67.000 = +1,79% → contango. Contoh stress: (64.800 − 67.000)/67.000 = −3,28% → backwardation dalam. Interpretasi: tanda dan kecepatan perubahan basis = termometer stress, bukan sekadar angka carry.",
      tasks: [
        { id: "t1", text: "Hitung basis untuk spot $67.000 dan futures $64.800. Contango atau backwardation?" },
        { id: "t2", text: "Sebutkan dua risiko basis trade selain risiko harga." },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Desk yang menjalankan basis trade wajib punya rencana unwind TERTULIS sebelum masuk: siapa menutup kaki mana, dalam urutan apa, jika basis melewati ambang. Di momen basis −5%, tidak ada waktu menyusun rencana — hanya mengeksekusi yang sudah ada.",
      },
      hints: [
        "Basis positif = futures lebih mahal (contango); negatif = lebih murah (backwardation).",
        "Funding rate tinggi = pasar miring ke satu sisi = risiko squeeze.",
      ],
      reference: "Basis = (F−S)/S. Positif = contango; negatif dalam + bergerak cepat = stress.",
    },
    {
      id: "var-gagal",
      eyebrow: "Langkah 4 · Konsep",
      title: "Mengapa VaR standar gagal untuk crypto",
      prose: [
        "Empat kegagalan. Satu: ekor gemuk. Return crypto berekor jauh lebih tebal dari normal — crash −20% dalam sehari bukan '6 sigma yang mustahil' melainkan kejadian berkala. VaR parametrik (2,33σ) sistematis meremehkan: di lab, VaR empiris 99% = 18,5% vs VaR normal = 8,8% — normal meremehkan 2,1x lipat.",
        "Dua: gap likuiditas. Order book crypto tipis di luar jam sibuk; saat panik, bid menguap dan harga melompat melewati stop-loss (gap, bukan slide). VaR mengasumsikan kamu bisa keluar di harga kuantil — di crypto, harga kuantil itu mungkin tidak pernah diperdagangkan. Tiga: pasar 24/7. VaR '1 hari' untuk saham = 6,5 jam perdagangan; untuk crypto = 24 jam penuh termasuk akhir pekan — horizon yang sama namanya, beda isinya. Volatilitas akhir pekan tidak tertangkap jika model dikalibrasi di hari kerja saja.",
        "Empat: tidak ada circuit breaker + regime break. Saham punya jeda perdagangan; crypto tidak — cascade likuidasi berjalan tanpa rem. Dan histori crypto pendek + penuh regime break (halving, regulasi, adopsi institusional), sehingga 'distribusi historis' adalah campuran beberapa rezim berbeda — kuantilnya menipu.",
        "Rumus kerugian depeg di bawah sederhana — tetapi justru itu poinnya: risiko depeg tidak butuh model canggih, ia butuh diakui sebagai skenario. Kerugian = eksposur × (1 − harga saat depeg). UST: $2 juta × (1 − 0,15) = $1,7 juta. Tidak ada VaR yang memuat angka ini jika depeg tidak ada di data — karena itu ia harus dihitung sebagai skenario terpisah, bukan dari distribusi.",
        "💡 Intuisi: untuk crypto, VaR menjawab 'seberapa buruk hari normal yang buruk'. Pertanyaan yang benar: 'berapa rugi jika infrastruktur yang saya andalkan (peg, exchange, likuiditas) berhenti bekerja SEHARI?' — itu skenario, bukan kuantil.",
      ],
      formula: String.raw`\text{Rugi}_{\text{depeg}} = E \times (1 - p)`,
      formulaNote: "E = eksposur nominal (mis. $2 juta); p = harga stablecoin saat depeg (desimal, mis. 0,15 untuk UST). Contoh: 2.000.000 × (1 − 0,15) = $1,7 juta. Interpretasi: ini skenario deterministik — bukan dari distribusi return — karena depeg adalah kegagalan infrastruktur, bukan 'return buruk'.",
      tasks: [
        { id: "t1", text: "Sebutkan empat alasan VaR standar gagal untuk crypto." },
        { id: "t2", text: "Eksposur $500 ribu di stablecoin yang depeg ke $0,87. Kerugian?" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menambal VaR crypto dengan 'naikkan confidence ke 99,9%'. Kuantil lebih ekstrem dari distribusi yang salah tetap salah — ekor empiris crypto bukan sekadar 'lebih jauh', bentuknya beda. Perbaikannya: historical/EVT + add-on likuiditas + skenario depeg terpisah.",
      },
      hints: [
        "Ekor gemuk → kuantil empiris >> 2,33σ.",
        "24/7: pastikan definisi '1 hari' konsisten antara kalibrasi dan pelaporan.",
      ],
      reference: "Ekor gemuk, gap likuiditas, 24/7, tanpa circuit breaker. Depeg = skenario, bukan kuantil.",
    },
    {
      id: "custody",
      eyebrow: "Langkah 5 · Konsep",
      title: "Custody & exchange: risiko yang tidak ada di harga",
      prose: [
        "November 2022: FTX — kala itu exchange terbesar kedua dunia — kolaps dan mengajukan perlindungan kebangkrutan (11 November 2022) setelah krisis likuiditas; dana nasabah yang dititipkan di sana terkunci dalam proses hukum bertahun-tahun. Pelajarannya brutal dan sederhana: di crypto, exchange adalah single point of failure yang menggabungkan tiga peran — tempat trading, kustodian dana, dan (kadang) lawan transaksi.",
        "Risiko custody punya tiga wajah. Satu: kebangkrutan/penyelewengan exchange (FTX) — dana nasabah dipakai untuk hal lain. Dua: pembekuan operasional — penarikan dihentikan 'sementara' tepat saat pasar panik, yaitu saat kamu paling butuh keluar. Tiga: risiko teknis — hack, kehilangan kunci. 'Not your keys, not your coins' bukan slogan — ia deskripsi risiko hukum: tanpa kunci privat, kamu kreditur tanpa agunan.",
        "Mitigasi yang benar berlapis: batasi eksposur per exchange (limit konsentrasi seperti limit counterparty), pindahkan dana menganggur ke kustodian qualified / cold wallet dengan multi-signature, dan pisahkan peran — trading di exchange, penyimpanan di kustodian. 'Proof of reserves' exchange BUKAN pengganti: ia menunjukkan aset tanpa menunjukkan liabilitas — separuh neraca tidak membuktikan solvabilitas.",
        "🚨 Mitos: 'Exchange besar pasti aman — proof of reserves-nya bersih.' Yang benar: FTX adalah exchange terbesar kedua dan proof of reserves tidak akan menangkap dana nasabah yang dipinjamkan ke afiliasi. Ukuran ≠ keamanan; yang penting struktur hukum pemisahan dana nasabah.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga wajah risiko custody/exchange." },
        { id: "t2", text: "Mengapa proof of reserves tidak cukup sebagai bukti keamanan?" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perlakukan setiap exchange seperti counterparty bilateral tanpa CSA: beri limit eksposur, monitor kesehatan, dan siapkan rencana migrasi. Dana yang 'parkir' di exchange lebih dari kebutuhan trading = pinjaman tanpa bunga dan tanpa agunan ke perusahaan itu.",
      },
      reference: "FTX Nov 2022: exchange = single point of failure. Limit per exchange + kustodian terpisah.",
    },
    {
      id: "lab-basis",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1: termometer basis",
      prose: [
        "Spot BTC $67.000; futures 1-bulan normal $68.200 dan skenario stress $64.800. Hitung basis keduanya dan beri flag jika |basis| > 2%.",
        "Eksperimen: naikkan futures stress ke $70.000 — basis menjadi +4,48% (contango ekstrem = pasar terlalu long, waspada long squeeze). Sinyal bekerja dua arah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `basis1` (normal) dan `basis2` (stress) dalam %" },
        { id: "t2", text: "Cetak keduanya + flag STRESS/NORMAL" },
      ],
      expected: "basis1=1.79%\nbasis2=-3.28%\nbasis2: STRESS (|basis| > 2%)",
      note: {
        title: "Intuisi",
        body: "Flag 2% hanyalah contoh ambang — desk nyata mengkalibrasi dari distribusi historis basis (mis. persentil ke-95). Yang penting: ambang tertulis SEBELUM stress, bukan dinegosiasi saat stress.",
      },
      hints: [
        "basis = (F - S) / S * 100.",
        "Flag: abs(basis) > 2.",
      ],
      code: {
        starter: "# BTC spot & futures 1-bulan (USD). JANGAN UBAH.\nspot = 67000.0\nf_normal = 68200.0\nf_stress = 64800.0\n\n# TULIS KODEMU: basis (%) dan flag\nbasis1 = \nbasis2 = \n\nprint(f\"basis1={basis1:.2f}%\")\nprint(f\"basis2={basis2:.2f}%\")\nprint(f\"basis2: {'STRESS' if abs(basis2) > 2 else 'NORMAL'} (|basis| > 2%)\")\n",
        lockLines: 4,
        solution: "# BTC spot & futures 1-bulan (USD). JANGAN UBAH.\nspot = 67000.0\nf_normal = 68200.0\nf_stress = 64800.0\n\n# TULIS KODEMU: basis (%) dan flag\nbasis1 = (f_normal - spot) / spot * 100\nbasis2 = (f_stress - spot) / spot * 100\n\nprint(f\"basis1={basis1:.2f}%\")\nprint(f\"basis2={basis2:.2f}%\")\nprint(f\"basis2: {'STRESS' if abs(basis2) > 2 else 'NORMAL'} (|basis| > 2%)\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`basis1` = 1,79%", msg: "(68.200−67.000)/67.000×100.", name: "basis1", value: 1.791, tol: 0.01 },
          { kind: "equal", task: "t1", label: "`basis2` = −3,28%", msg: "(64.800−67.000)/67.000×100.", name: "basis2", value: -3.2836, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Flag STRESS tercetak", msg: "|−3,28| > 2 → STRESS.", pattern: "basis2: STRESS" }
        ],
      },
      reference: "Basis = (F−S)/S. |basis| > ambang + bergerak cepat = sinyal stress.",
    },
    {
      id: "lab-var-crypto",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2: VaR normal vs VaR empiris di data berekor tebal",
      prose: [
        "60 return harian BTC (%) — mayoritas ±3%, tetapi ada −18,5%, −12,3%, +14,2%. Hitung VaR 99% dua cara: parametrik (2,33 × σ) vs empiris (return terburuk). Bandingkan.",
        "Hasilnya: VaR empiris 18,5% vs VaR normal 8,80% — asumsi normal meremehkan 2,1x. Inilah 'kegagalan satu' dari langkah 4, dalam angka.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var_normal` (2,33×σ) dan `var_emp` (terburuk, positif)" },
        { id: "t2", text: "Cetak keduanya + kelipatan underestimasi" },
      ],
      expected: "VaR normal 99%: 8.80%\nVaR empiris 99%: 18.50%\nNormal meremehkan 2.1x lipat",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai statistics.stdev (sampel, n−1) vs pstdev (populasi, n) lalu bingung selisihnya. Untuk lab ini keduanya memberi kesimpulan sama (underestimasi ~2x) — yang penting konsisten dan sebutkan pilihannya.",
      },
      hints: [
        "Butuh import statistics. sigma = statistics.pstdev(rets).",
        "var_emp = -min(rets) (jadikan positif).",
        "Kelipatan = var_emp / var_normal, format :.1f.",
      ],
      code: {
        starter: "import statistics\n\n# 60 return harian BTC (%). JANGAN UBAH.\nrets = [1.2,-0.8,2.1,-1.5,0.6,-2.2,1.8,-0.4,2.9,-1.1,0.9,-2.8,1.5,-0.6,2.4,-1.9,0.3,-2.5,1.1,-0.9,2.7,-1.3,0.8,-2.0,1.6,-0.5,2.2,-1.7,0.4,-2.9,1.9,-0.7,2.5,-1.4,0.2,-2.4,1.3,-1.0,2.8,-0.3,1.7,-2.1,0.5,-1.8,2.0,-0.2,1.4,-2.6,0.7,-1.2,2.3,-0.1,1.0,-2.3,0.1,-1.6,2.6,-18.5,-12.3,14.2]\n\n# TULIS KODEMU: VaR 99% parametrik vs empiris\nvar_normal = \nvar_emp = \n\nprint(f\"VaR normal 99%: {var_normal:.2f}%\")\nprint(f\"VaR empiris 99%: {var_emp:.2f}%\")\nprint(f\"Normal meremehkan {var_emp/var_normal:.1f}x lipat\")\n",
        lockLines: 4,
        solution: "import statistics\n\n# 60 return harian BTC (%). JANGAN UBAH.\nrets = [1.2,-0.8,2.1,-1.5,0.6,-2.2,1.8,-0.4,2.9,-1.1,0.9,-2.8,1.5,-0.6,2.4,-1.9,0.3,-2.5,1.1,-0.9,2.7,-1.3,0.8,-2.0,1.6,-0.5,2.2,-1.7,0.4,-2.9,1.9,-0.7,2.5,-1.4,0.2,-2.4,1.3,-1.0,2.8,-0.3,1.7,-2.1,0.5,-1.8,2.0,-0.2,1.4,-2.6,0.7,-1.2,2.3,-0.1,1.0,-2.3,0.1,-1.6,2.6,-18.5,-12.3,14.2]\n\n# TULIS KODEMU: VaR 99% parametrik vs empiris\nvar_normal = 2.33 * statistics.pstdev(rets)\nvar_emp = -min(rets)\n\nprint(f\"VaR normal 99%: {var_normal:.2f}%\")\nprint(f\"VaR empiris 99%: {var_emp:.2f}%\")\nprint(f\"Normal meremehkan {var_emp/var_normal:.1f}x lipat\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`var_normal` = 8,80%", msg: "2,33 × pstdev(60 return).", name: "var_normal", value: 8.7995, tol: 0.05 },
          { kind: "equal", task: "t1", label: "`var_emp` = 18,5%", msg: "Return terburuk = −18,5 → 18,5.", name: "var_emp", value: 18.5, tol: 1e-9 },
          { kind: "stdout_matches", task: "t2", label: "Underestimasi 2,1x tercetak", msg: "18,5/8,8 ≈ 2,1.", pattern: "meremehkan 2\\.1x lipat" }
        ],
      },
      reference: "Ekor tebal: VaR empiris 18,5% vs normal 8,8%. Jangan parametrik murni untuk crypto.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Empat jalur eksposur crypto",
      prose: [
        "Satu: menyimpan stablecoin sebagai kas/treasury → pilih fiat-backed dengan atestasi berkala; cek konsentrasi bank kustodian penerbit (pelajaran USDC–SVB); batasi per penerbit; perlakukan algoritmik sebagai BUKAN kas. Dua: menjalankan basis trade → monitor basis & funding harian dengan ambang tertulis; siapkan rencana unwind (urutan penutupan kaki) sebelum masuk.",
        "Tiga: dana di exchange → limit eksposur per exchange seperti limit counterparty; dana menganggur pindah ke kustodian qualified/cold wallet multisig; pisahkan peran trading vs penyimpanan. Empat: melaporkan VaR untuk desk crypto → pakai historical/EVT, tambah add-on likuiditas (LVaR ala MR13), dan sajikan skenario depeg/exchange-halt terpisah — jangan VaR parametrik murni.",
        "Aturan praktis 10 detik: untuk tiap dolar eksposur crypto, jawab — jika peg-nya jebol besok rugi berapa (skenario), jika exchange-nya tutup bisa keluar lewat mana (rencana), dan angka VaR-mu dari distribusi apa (metode). Tidak bisa jawab ketiganya = eksposur belum dikelola.",
      ],
      figure: {
        svg: FIG_PETA_CRYPTO,
        alt: "Empat jalur keputusan eksposur crypto.",
        caption: "Empat jalur: simpan, basis trade, dana di exchange, lapor VaR — tiap jalur punya perlakuannya.",
      },
      tasks: [
        { id: "t1", text: "Treasury ingin menaruh $10 juta di stablecoin algoritmik berimbal hasil 20%. Keputusan?" },
        { id: "t2", text: "Desk crypto melaporkan VaR parametrik 99%. Apa yang diminta sebagai analis?" },
      ],
      note: {
        title: "Intuisi",
        body: "Risiko crypto yang paling mahal selalu yang 'tidak ada di model': depeg, halt, hack. Alokasikan waktu analis 50/50 — separuh untuk angka VaR, separuh untuk skenario infrastruktur. VaR tanpa skenario depeg = laporan yang rapi tentang hal yang salah.",
      },
      reference: "Simpan → fiat-backed + cek bank. Basis → ambang + unwind plan. Exchange → limit. VaR → HS/EVT + skenario.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Basis trade $5 juta di hari yang buruk",
      prose: [
        "Desk arbitrage: long $5 juta spot BTC + short $5 juta futures 1-bulan CME. Kondisi normal: basis +1,79% → carry ≈ $89.500 per roll bulanan. Lalu datang hari buruk: basis anjlok ke −3,28% dalam 6 jam (penjualan panik via futures), funding rate berbalik −0,05%/8 jam, dan satu exchange tempat kaki spot disimpan menghentikan penarikan 'sementara'.",
        "Pertanyaan: (a) Hitung ayunan P&L dari pergerakan basis saja. (b) Mengapa posisi 'netral harga' ini tetap rugi? (c) Apa yang seharusnya ada sebelum trade dibuka? Pembahasan: (a) Δbasis = 1,79 − (−3,28) = 5,07 poin × $5 juta = $253.500 rugi — carry 3 bulan evaporasi dalam 6 jam. (b) Netral terhadap harga ≠ netral terhadap basis, funding, dan eksekusi; kaki spot tidak bisa dipindah saat penarikan dibekukan sehingga unwind parsial tidak mungkin. (c) Ambang basis tertulis, rencana unwind (urutan kaki), limit dana per exchange, dan skenario 'exchange halt' yang dihitung SEBELUM masuk — persis peta keputusan langkah 8.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "'Market-neutral' adalah klaim tentang model, bukan tentang dunia. Setiap strategi netral netral terhadap SESUATU dan terekspos terhadap yang lain — tugas analis risiko adalah menamai 'yang lain' itu dan memberinya angka.",
      },
      reference: "Δbasis 5,07 poin × $5 jt = $253,5 rb. Netral harga ≠ netral basis/funding/eksekusi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — crypto menguji apakah kamu mengukur hal yang benar.",
      ],
      tasks: [],
      summary: [
        "Tiga desain stablecoin: fiat-backed (risiko cadangan/bank — USDC–SVB Mar 2023, $0,87), crypto-backed (risiko likuidasi), algoritmik (death spiral — UST Mei 2022, $0,35, tak kembali).",
        "Basis = (F−S)/S: contango vs backwardation; |basis| > ambang + bergerak cepat = sinyal stress; funding rate = kemiringan posisi pasar.",
        "VaR standar gagal untuk crypto: ekor gemuk (empiris 2,1x normal), gap likuiditas, pasar 24/7, tanpa circuit breaker + regime break.",
        "Rugi depeg = E × (1−p): skenario deterministik terpisah, bukan kuantil.",
        "Custody/exchange: FTX Nov 2022 — limit per exchange, kustodian terpisah, proof of reserves ≠ bukti solvabilitas.",
      ],
      next: { label: "MR22 — Geopolitical Risk & Scenario Design", href: "/learn/mr22-geopolitical-risk" },
      quiz: [
        {
          q: "UST runtuh Mei 2022 karena desainnya. Mekanisme keruntuhan yang tepat?",
          options: [
            { text: "Cadangan fiat-nya dicuri dari bank kustodian", why: "UST tidak punya cadangan fiat — itu desain USDC. UST itu algoritmik." },
            { text: "Death spiral: arbitrase UST↔LUNA mencetak LUNA tanpa batas saat kepercayaan hilang", why: "Benar: mekanisme stabilisasi berubah menjadi akselerator — LUNA dari ~$80 ke sen dalam 5 hari.", correct: true },
            { text: "Agunan crypto-nya terlikuidasi berantai", why: "Itu risiko desain crypto-backed (DAI), bukan algoritmik." },
            { text: "Exchange menghentikan perdagangan UST", why: "Perdagangan tetap berjalan — yang berhenti adalah kepercayaan, bukan matching engine." },
          ],
        },
        {
          q: "USDC jatuh ke ~$0,87 pada 11 Maret 2023. Penyebab langsungnya?",
          options: [
            { text: "Serangan siber ke blockchain USDC", why: "Tidak ada serangan siber — masalahnya di dunia tradisional." },
            { text: "$3,3 miliar cadangan USDC terjebak di Silicon Valley Bank yang kolaps", why: "Benar: 8% cadangan di satu bank cukup memicu depeg 13%. Repeg 2 hari setelah deposan SVB dijamin.", correct: true },
            { text: "The Fed menaikkan suku bunga", why: "Suku bunga memengaruhi valuasi, bukan memicu depeg 13% dalam sehari." },
            { text: "Volume redeem massal oleh paus crypto", why: "Redeem adalah GEJALA (akibat kabar SVB), bukan penyebab awal." },
          ],
        },
        {
          q: "Spot $67.000, futures $64.800 → basis −3,28%. Artinya?",
          options: [
            { text: "Contango sehat, pasar tenang", why: "Contango = basis positif. Ini negatif." },
            { text: "Backwardation dalam — sinyal stress / tekanan jual via futures", why: "Benar: futures jauh di bawah spot + bergerak cepat = pasar berteriak.", correct: true },
            { text: "Arbitrase bebas risiko tersedia", why: "Basis dalam justru menandakan risiko eksekusi/pendanaan tinggi — bukan arbitrase gratis." },
            { text: "Funding rate pasti positif", why: "Tidak ada hubungan pasti; basis spot-futures ≠ funding perps." },
          ],
        },
        {
          q: "Lab menunjukkan VaR empiris 18,5% vs VaR normal 8,8%. Kesimpulan untuk pelaporan desk crypto?",
          options: [
            { text: "Naikkan confidence level ke 99,9% agar aman", why: "Kuantil lebih ekstrem dari distribusi yang salah bentuknya tetap salah." },
            { text: "Pakai HS/EVT + add-on likuiditas + skenario depeg terpisah", why: "Benar: perbaiki bentuk distribusi DAN tambahkan risiko yang tak tertangkap kuantil.", correct: true },
            { text: "VaR normal sudah cukup — selisih 2x masih wajar", why: "Meremehkan 2,1x = limit dan modal salah separuh. Tidak wajar." },
            { text: "Ganti ke VaR 95% agar angkanya lebih kecil", why: "Mengecilkan angka dengan menurunkan standar = menyembunyikan risiko." },
          ],
        },
        {
          q: "Dana $20 juta 'parkir' di satu exchange untuk kebutuhan trading $2 juta. Tindakan risiko yang tepat?",
          options: [
            { text: "Biarkan — exchange-nya besar dan proof of reserves-nya bersih", why: "FTX adalah exchange terbesar kedua. Proof of reserves tidak menunjukkan liabilitas." },
            { text: "Tarik $18 juta ke kustodian qualified/cold wallet multisig; beri limit per exchange", why: "Benar: dana menganggur di exchange = pinjaman tanpa agunan. Pisahkan trading vs penyimpanan.", correct: true },
            { text: "Pecah ke 10 exchange kecil agar diversifikasi", why: "Diversifikasi ke 10 risiko kecil ≠ mitigasi; menambah permukaan serangan operasional." },
            { text: "Konversi ke stablecoin algoritmik berimbal hasil", why: "Menukar risiko custody dengan risiko depeg — bukan mitigasi." },
          ],
        }
      ],
      reference: "Tiga desain & cara gagalnya; basis sebagai termometer; VaR gagal 4 alasan; custody berlapis.",
    },
  ],
};
