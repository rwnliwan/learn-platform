import type { V2Lesson } from "../lib/types";

const FIG_CHANNELS = `<svg viewBox="0 0 480 300" role="img" aria-label="Empat kanal transmisi risiko geopolitik ke portofolio.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Empat kanal geopolitik → portofolio</text>
<rect x="180" y="45" width="120" height="44" rx="8" fill="var(--chart-text)" opacity="0.15" stroke="var(--chart-text)" stroke-width="2"/>
<text x="240" y="72" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Guncangan geopolitik</text>
<rect x="20" y="130" width="200" height="60" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="120" y="155" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">1. Perdagangan &amp; sanksi</text>
<text x="120" y="175" font-size="10" fill="var(--chart-text)" text-anchor="middle">aset dibekukan, rantai pasok putus</text>
<rect x="260" y="130" width="200" height="60" rx="8" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="360" y="155" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">2. Komoditas &amp; energi</text>
<text x="360" y="175" font-size="10" fill="var(--chart-text)" text-anchor="middle">minyak/gandum melonjak</text>
<rect x="20" y="210" width="200" height="60" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="120" y="235" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">3. FX &amp; arus modal</text>
<text x="120" y="255" font-size="10" fill="var(--chart-text)" text-anchor="middle">flight to safety, rupiah tertekan</text>
<rect x="260" y="210" width="200" height="60" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="360" y="235" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">4. Sentimen &amp; likuiditas</text>
<text x="360" y="255" font-size="10" fill="var(--chart-text)" text-anchor="middle">spread melebar, pasar kering</text>
<text x="240" y="115" font-size="14" fill="var(--chart-text)" text-anchor="middle">↓</text>
</g>
</svg>`;

const FIG_SCENARIO = `<svg viewBox="0 0 480 260" role="img" aria-label="Matriks skenario: keparahan vs kecepatan.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Matriks skenario (contoh)</text>
<text x="240" y="50" font-size="10" fill="var(--chart-text)" text-anchor="middle">kecepatan →</text>
<text x="30" y="150" font-size="10" fill="var(--chart-text)" text-anchor="middle" transform="rotate(-90 30 150)">keparahan →</text>
<rect x="70" y="70" width="180" height="80" rx="6" fill="var(--c2)" opacity="0.3"/>
<text x="160" y="105" font-size="10" fill="var(--chart-text)" text-anchor="middle">Eskalasi bertahap</text>
<text x="160" y="125" font-size="10" fill="var(--chart-text)" text-anchor="middle">sanksi diperluas</text>
<rect x="270" y="70" width="180" height="80" rx="6" fill="var(--c1)" opacity="0.35"/>
<text x="360" y="105" font-size="10" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Syok mendadak</text>
<text x="360" y="125" font-size="10" fill="var(--chart-text)" text-anchor="middle">pembekuan semalam</text>
<rect x="70" y="165" width="180" height="70" rx="6" fill="var(--c4)" opacity="0.3"/>
<text x="160" y="195" font-size="10" fill="var(--chart-text)" text-anchor="middle">Perang dagang</text>
<text x="160" y="212" font-size="10" fill="var(--chart-text)" text-anchor="middle">tarif + retaliasi</text>
<rect x="270" y="165" width="180" height="70" rx="6" fill="var(--c3)" opacity="0.3"/>
<text x="360" y="195" font-size="10" fill="var(--chart-text)" text-anchor="middle">Konflik terbuka</text>
<text x="360" y="212" font-size="10" fill="var(--chart-text)" text-anchor="middle">gangguan energi total</text>
</g>
</svg>`;

export const mr22: V2Lesson = {
  slug: "mr22-geopolitical-risk",
  track: "Market Risk",
  module: "Risiko Sistemik",
  title: "MR22 — Risiko Geopolitik: Ketika VaR Tidak Melihat Rudal",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pagi setelah sanksi",
      prose: [
        "Manajer dana membuka Bloomberg pagi itu: semalam AS dan sekutunya mengumumkan sanksi baru — aset Rusia dibekukan total. Portofolionya memegang obligasi korporasi Rusia Rp120 miliar. VaR 99% kemarin bilang kerugian maksimum harian 'hanya' Rp8 miliar. Pagi ini, kerugiannya Rp72 miliar — dan obligasinya tidak bisa dijual sama sekali.",
        "Twist-nya: VaR tidak salah hitung — ia buta. VaR membaca distribusi historis; sanksi adalah diskontinuitas politik yang tidak ada di data historis. Inilah risiko geopolitik: ia datang dari ruang rapat dewan keamanan, bukan dari time series. Setelah lesson ini kamu bisa: (1) memetakan empat kanal transmisi geopolitik ke portofolio; (2) merancang skenario geopolitik naratif→syok; (3) menghitung dampak skenario pada portofolio; (4) menyusun playbook respons.",
        "Mengapa ini penting untuk karirmu di Indonesia: bank dan manajer investasi Indonesia semakin terhubung ke pasar global — sukuk global, obligasi korporasi asing, lindung nilai FX. Pewawancara kerja untuk posisi market risk semakin sering bertanya \"bagaimana kamu menangani risiko geopolitik\". Jawaban \"VaR kami masih dalam batas\" adalah jawaban yang salah; jawaban yang benar adalah skenario + playbook lesson ini.",
        "Catatan penting: risiko geopolitik bukan 'risiko politik' yang samar — ia adalah risiko pasar dengan pemicu politik. Bedanya dengan risiko pasar biasa: pemicunya tidak terdistribusi normal, tidak mean-reverting, dan sering irreversibel (aset yang dibekukan tidak 'pulih' seperti harga saham). Karena itu toolkit-nya berbeda: bukan model statistik, melainkan skenario + playbook + wewenang keputusan cepat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "FRM 2026 menempatkan geopolitical risk sebagai risiko yang wajib dipahami manajer risiko pasar — bukan sebagai 'risiko politik' yang abstrak, melainkan sebagai skenario konkret dengan angka. Analis yang hanya bisa VaR adalah analis yang hanya bisa cuaca cerah.",
      },
      reference: "VaR buta terhadap diskontinuitas politik. Skenario = jawabannya.",
    },
    {
      id: "kanal",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat kanal transmisi",
      prose: [
        "Risiko geopolitik mencapai portofoliomu lewat empat kanal. Satu: perdagangan & sanksi — aset dibekukan, kontrak dibatalkan, rantai pasok putus (kanal paling brutal: nilai bisa nol dalam semalam). Dua: komoditas & energi — konflik di produsen minyak/gandum mengerek harga; importir komoditas terpukul, eksportir diuntungkan. Tiga: FX & arus modal — flight to safety menguatkan dolar, menekan rupiah dan obligasi EM. Empat: sentimen & likuiditas — spread kredit melebar, pasar sekunder kering, yang ingin jual tidak bisa jual.",
        "Kepribadian keempat kanal: sanksi = amputasi (cepat, permanen), komoditas = demam (menyebar ke semua), FX = gravitasi (menarik semua aset EM turun), likuiditas = kekeringan (yang haus tidak bisa minum). Analis yang baik tahu kanal mana yang menyerang posisinya duluan.",
        "Tiga miskonsepsi. Satu: 'Geopolitik = risiko negara berkembang saja.' Sanksi Rusia 2022 membekukan cadangan devisa bank sentral — tidak ada yang kebal. Dua: 'Lindung nilai dengan diversifikasi cukup.' Krisis geopolitik menaikkan korelasi semua aset berisiko — diversifikasi gagal tepat saat dibutuhkan. Tiga: 'Ini urusan analis politik, bukan analis risiko.' Analis risiko yang menunggu analis politik = analis yang menghitung kerugian, bukan mencegahnya.",
        "Contoh konkret tiap kanal untuk Indonesia: kanal sanksi — bank dengan nasabah korporat yang berdagang dengan negara tersanksi; kanal komoditas — importir BBM terpukul saat harga minyak melonjak, eksportir sawit/nikel diuntungkan; kanal FX — rupiah melemah, obligasi negara tertekan saat dolar menguat; kanal likuiditas — reksa dana yang memegang obligasi korporasi peringkat rendah kesulitan menjual saat pasar panik. Petakan portofoliomu ke contoh-contoh ini — kanal menjadi nyata saat ada angkanya.",
      ],
      figure: {
        svg: FIG_CHANNELS,
        alt: "Empat kanal transmisi risiko geopolitik ke portofolio.",
        caption: "Kenali kanalmu: sanksi mengamputasi, komoditas mendemamkan, FX menarik turun, likuiditas mengeringkan.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Portofolio saya domestik, tidak kena geopolitik.” Importir BBM, eksportir sawit, bank dengan kredit ke importir — semua terhubung ke kanal komoditas dan FX. Tidak ada portofolio yang sepenuhnya domestik dalam ekonomi terbuka.",
      },
      hints: [
        "Petakan tiap posisi besar ke kanal dominannya — satu posisi, satu kanal utama.",
        "Kanal sanksi butuh daftar pantauan: negara, entitas, individu yang berisiko.",
      ],
      reference: "4 kanal: sanksi, komoditas, FX, likuiditas.",
    },
    {
      id: "skenario",
      eyebrow: "Langkah 3 · Konsep",
      title: "Dari narasi ke angka: desain skenario",
      prose: [
        "Skenario geopolitik yang baik punya tiga lapis. Lapis 1 — narasi: 'AS memperluas sanksi ke sektor energi Rusia, UE mengikuti, harga minyak +40%.' Lapis 2 — syok pasar: obligasi Rusia -60%, ekuitas EM -15%, USD/IDR +8%, spread kredit +200bps. Lapis 3 — dampak portofolio: hitung per posisi (seperti lab pertama). Narasi tanpa syok = dongeng; syok tanpa narasi = angka tanpa cerita; keduanya tanpa dampak portofolio = sia-sia.",
        "Prinsip desain: skenario harus PLAUSIBLE (masuk akal), RELEVAN (mengenai posisimu), dan MENANTANG (lebih berat dari VaR). Tiga skenario minimum: eskalasi bertahap, syok mendadak, konflik berkepanjangan. Jangan buat 20 skenario — tidak ada yang membaca 20 skenario. Tiga yang tajam mengalahkan dua puluh yang kabur.",
        "Dua miskonsepsi. Satu: 'Skenario = ramalan.' Bukan — skenario adalah latihan, bukan prediksi. Nilainya bukan 'apakah terjadi', melainkan 'apakah kita siap bila terjadi'. Dua: 'Cukup satu skenario terburuk.' Satu skenario melatih satu respons; tiga skenario melatih kelenturan berpikir.",
        "Kalibrasi syok dari preseden: invasi 2022 — minyak Brent +40% dalam sebulan, gandum +60%, rubel -40% sebelum kontrol modal; sanksi Iran — rial terdepresiasi >70% dalam setahun. Angka-angka ini bukan ramalan masa depan, melainkan 'batas wajar' untuk syok skenariomu. Skenario dengan syok lebih ringan dari preseden = skenario yang tidak menantang; dengan syok jauh lebih berat tanpa narasi = skenario khayalan.",
        "Tata kelola skenario: siapa pemiliknya? Skenario geopolitik harus dimiliki bersama oleh risk dan bisnis — risk merancang metodologi, bisnis memvalidasi plausibilitas narasi (mereka yang paham pasarnya). Tinjau tiap semester atau tiap ada peristiwa besar. Skenario yang dibuat sekali lalu diarsipkan = skenario mati; skenario yang ditinjau rutin = otot institusi.",
      ],
      figure: {
        svg: FIG_SCENARIO,
        alt: "Matriks skenario: keparahan vs kecepatan.",
        caption: "Tiga skenario tajam: bertahap, mendadak, berkepanjangan.",
      },
      formula: String.raw`\text{Rugi skenario} = \sum_i \text{nilai}_i \times \text{syok}_i`,
      formulaNote: "nilai_i = nilai posisi i (Rp miliar); syok_i = syok skenario untuk negara/kanal posisi i (negatif = rugi). Contoh lab: 120×(-0,60) + 200×(-0,05) + 80×(-0,25) = -102 → rugi Rp102 miliar. Interpretasi: kerugian skenario = jumlah terbobot — posisi kecil dengan syok besar bisa mendominasi.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Skenario kami: IHSG -20%.” Itu bukan skenario geopolitik — itu angka tanpa sebab. Skenario selalu mulai dari PERISTIWA (sanksi, konflik, pemilu) lalu turun ke angka. Sebab dulu, angka kemudian.",
      },
      hints: [
        "Tulis narasi satu paragraf dulu, baru tetapkan syok — urutan ini mencegah angka khayalan.",
        "Kalibrasi syok dari preseden historis (2022, 2008) — bukan dari firasat.",
      ],
      reference: "Narasi → syok → dampak. Plausible, relevan, menantang.",
    },
    {
      id: "playbook",
      eyebrow: "Langkah 4 · Konsep",
      title: "Playbook: apa yang dilakukan saat skenario hidup",
      prose: [
        "Skenario tanpa playbook = latihan kebakaran tanpa pintu darurat. Playbook geopolitik berisi: pemicu (indikator apa yang menyatakan skenario 'hidup'), tindakan 24 jam pertama (kurangi eksposur X, tambah lindung nilai Y, siapkan likuiditas), pemilik keputusan (siapa boleh memotong posisi tanpa rapat direksi), dan komunikasi (apa yang disampaikan ke nasabah/regulator).",
        "Kepribadian playbook: ia adalah 'rencana yang ditulis saat tenang untuk dijalankan saat panik'. Kualitasnya diukur bukan dari ketebalannya, melainkan dari apakah orang menggunakannya pukul 03.00 saat krisis. Satu halaman yang dipakai > lima puluh halaman yang diarsipkan.",
        "Isi minimal playbook satu halaman: (1) tiga indikator pemicu dengan ambangnya; (2) daftar tindakan 24 jam dengan pemiliknya; (3) batas wewenang darurat (mis. CIO boleh memotong hingga Rp500 miliar tanpa rapat direksi); (4) template komunikasi (satu paragraf untuk direksi, satu untuk nasabah). Empat komponen, satu halaman. Jika playbook-mu butuh daftar isi, ia terlalu panjang.",
        "Dua miskonsepsi. Satu: 'Playbook = prediksi tindakan sempurna.' Tidak — ia adalah titik awal yang mencegah kelumpuhan. Keputusan buruk yang cepat masih bisa dikoreksi; kelumpuhan tidak. Dua: 'Cukup di kepala CIO.' Yang di kepala tidak bisa dijalankan tim saat CIO tidak bisa dihubungi. Tertulis, disepakati, dilatih.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Uji playbook dengan tabletop exercise: umumkan skenario fiktif Senin pagi, lihat berapa lama tim mengambil keputusan pertama. Waktu respons pertama adalah metrik kesiapan — bukan ketebalan dokumen.",
      },
      hints: [
        "Tetapkan 'wewenang pemotongan darurat' dengan batas nominal jelas sebelum krisis.",
        "Siapkan daftar kontak darurat: broker, kustodian, legal — di satu halaman.",
      ],
      reference: "Playbook = pemicu + tindakan 24 jam + pemilik + komunikasi.",
    },
    {
      id: "lab-skenario",
      eyebrow: "Langkah 5 · Lab",
      title: "Hitung dampak skenario sanksi",
      prose: [
        "Portofolio tiga aset, satu skenario: sanksi diperluas. Syok: Rusia -60%, Ukraina -25%, Indonesia -5% (efek sentimen regional). Hitung nilai baru tiap aset, kerugian tiap aset, dan total kerugian portofolio.",
        "Perhatikan: kerugian terbesar bukan dari posisi terbesar — melainkan dari kombinasi ukuran × syok. Obligasi X 'hanya' Rp120 miliar tetapi menyumbang Rp72 miliar kerugian. Inilah mengapa skenario mengalahkan intuisi ukuran.",
      ],
      tasks: [
        { id: "t1", text: "Hitung nilai baru tiap aset = nilai * (1 + shock)" },
        { id: "t2", text: "Hitung kerugian tiap aset & total, cetak ringkasannya" },
      ],
      expected: "Obligasi X: 120 -> 48.0 (rugi 72.0)\nSaham Y: 200 -> 190.0 (rugi 10.0)\nObligasi Z: 80 -> 60.0 (rugi 20.0)\nTotal rugi: 102.0 dari 400",
      note: {
        title: "💡 Intuisi",
        body: "VaR bilang 'maksimum Rp8 miliar'. Skenario bilang 'Rp102 miliar'. Keduanya benar dalam dunianya masing-masing — VaR untuk hari normal, skenario untuk hari yang mengubah dunia. Manajer risiko butuh kedua kacamata.",
      },
      hints: [
        "baru = nilai * (1 + skenario[negara]).",
        "rugi = nilai - baru; jumlahkan untuk total.",
      ],
      code: {
        starter: "# (aset, nilai Rp miliar, negara). JANGAN UBAH.\nportofolio = [(\"Obligasi X\", 120, \"Rusia\"), (\"Saham Y\", 200, \"Indonesia\"), (\"Obligasi Z\", 80, \"Ukraina\")]\nskenario = {\"Rusia\": -0.60, \"Ukraina\": -0.25, \"Indonesia\": -0.05}\n\n# TULIS KODEMU: nilai baru, rugi per aset, total rugi\ntotal_awal = sum(n for _, n, _ in portofolio)\nkerugian = 0\nfor aset, nilai, negara in portofolio:\n    baru = \n    rugi = \n    kerugian += rugi\n    print(f\"{aset}: {nilai} -> {baru:.1f} (rugi {rugi:.1f})\")\nprint(f\"Total rugi: {kerugian:.1f} dari {total_awal}\")\n",
        lockLines: 7,
        solution: "# (aset, nilai Rp miliar, negara). JANGAN UBAH.\nportofolio = [(\"Obligasi X\", 120, \"Rusia\"), (\"Saham Y\", 200, \"Indonesia\"), (\"Obligasi Z\", 80, \"Ukraina\")]\nskenario = {\"Rusia\": -0.60, \"Ukraina\": -0.25, \"Indonesia\": -0.05}\n\n# TULIS KODEMU: nilai baru, rugi per aset, total rugi\ntotal_awal = sum(n for _, n, _ in portofolio)\nkerugian = 0\nfor aset, nilai, negara in portofolio:\n    baru = nilai * (1 + skenario[negara])\n    rugi = nilai - baru\n    kerugian += rugi\n    print(f\"{aset}: {nilai} -> {baru:.1f} (rugi {rugi:.1f})\")\nprint(f\"Total rugi: {kerugian:.1f} dari {total_awal}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Obligasi X rugi 72", msg: "120 * 0.6.", pattern: "Obligasi X: 120 -> 48.*rugi 72" },
          { kind: "stdout_matches", task: "t2", label: "Total rugi 102", msg: "72 + 10 + 20.", pattern: "Total rugi: 102.0 dari 400" },
          { kind: "stdout_matches", task: "t1", label: "Obligasi Z rugi 20", msg: "80 * 0.25.", pattern: "Obligasi Z: 80 -> 60.*rugi 20" },
        ],
      },
      reference: "baru = nilai × (1+shock). Rugi = ukuran × syok.",
    },
    {
      id: "lab-sanksi",
      eyebrow: "Langkah 6 · Lab",
      title: "Pindai eksposur sanksi",
      prose: [
        "Empat nasabah korporat dengan negara domisili berbeda. Daftar sanksi berisi tiga negara. Tandai nasabah yang harus DIBLOKIR — dan perhatikan: pemindaian ini harus jalan OTOMATIS tiap ada pembaruan daftar sanksi, bukan manual tiap kuartal.",
        "Eksperimen: tambahkan 'Belarus' ke daftar_sanksi dan satu nasabah Belarus, jalankan ulang. Inilah mengapa daftar sanksi harus data hidup, bukan dokumen statis.",
      ],
      tasks: [
        { id: "t1", text: "Tandai tiap nasabah DIBLOKIR/OK berdasar daftar sanksi" },
        { id: "t2", text: "Cetak hasilnya dan hitung jumlah yang diblokir" },
      ],
      expected: "PT A (Rusia): DIBLOKIR\nPT B (Singapura): OK\nPT C (Iran): DIBLOKIR\nPT D (Indonesia): OK\nDiblokir: 2 dari 4",
      note: {
        title: "💡 Intuisi",
        body: "Sanksi bukan risiko pasar — ia risiko kepatuhan yang menghantam seperti risiko pasar. Satu baris di daftar sanksi bisa menghapus Rp120 miliar nilai. Pemindaian otomatis adalah sabuk pengaman termurah di lesson ini.",
      },
      hints: [
        "status = 'DIBLOKIR' jika negara in daftar_sanksi.",
        "Hitung jumlah DIBLOKIR dengan akumulator.",
      ],
      code: {
        starter: "# (nasabah, negara). JANGAN UBAH.\nnasabah = [(\"PT A\", \"Rusia\"), (\"PT B\", \"Singapura\"), (\"PT C\", \"Iran\"), (\"PT D\", \"Indonesia\")]\ndaftar_sanksi = {\"Rusia\", \"Iran\", \"Korea Utara\"}\n\n# TULIS KODEMU: screening + hitung yang diblokir\nblokir = 0\nfor nama, negara in nasabah:\n    status = \n    if status == \"DIBLOKIR\":\n        blokir += 1\n    print(f\"{nama} ({negara}): {status}\")\nprint(f\"Diblokir: {blokir} dari {len(nasabah)}\")\n",
        lockLines: 7,
        solution: "# (nasabah, negara). JANGAN UBAH.\nnasabah = [(\"PT A\", \"Rusia\"), (\"PT B\", \"Singapura\"), (\"PT C\", \"Iran\"), (\"PT D\", \"Indonesia\")]\ndaftar_sanksi = {\"Rusia\", \"Iran\", \"Korea Utara\"}\n\n# TULIS KODEMU: screening + hitung yang diblokir\nblokir = 0\nfor nama, negara in nasabah:\n    status = \"DIBLOKIR\" if negara in daftar_sanksi else \"OK\"\n    if status == \"DIBLOKIR\":\n        blokir += 1\n    print(f\"{nama} ({negara}): {status}\")\nprint(f\"Diblokir: {blokir} dari {len(nasabah)}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "PT A diblokir", msg: "Rusia di daftar.", pattern: "PT A.*Rusia.*DIBLOKIR" },
          { kind: "stdout_matches", task: "t1", label: "PT B OK", msg: "Singapura tidak di daftar.", pattern: "PT B.*Singapura.*OK" },
          { kind: "stdout_matches", task: "t2", label: "Total 2 diblokir", msg: "A dan C.", pattern: "Diblokir: 2 dari 4" },
        ],
      },
      reference: "Screening = keanggotaan himpunan. Daftar harus hidup.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kabar geopolitik masuk: respons apa",
      prose: [
        "Satu: identifikasi kanal — sanksi? komoditas? FX? likuiditas? Satu peristiwa bisa membuka banyak kanal; petakan semuanya. Dua: jalankan skenario yang relevan (atau buat cepat bila belum ada) — hitung dampak pada 10 posisi terbesar dalam 4 jam. Tiga: bila dampak melebihi toleransi → jalankan playbook: kurangi eksposur, tambah lindung nilai, siapkan likuiditas. Empat: komunikasikan — ke direksi (dampak + tindakan), ke nasabah (bila produk terdampak), ke regulator (bila diwajibkan).",
        "Aturan praktis 10 detik: kanal apa → skenario berapa → playbook jalan. Geopolitik menghukum yang lambat lebih kejam daripada yang salah — keputusan cepat yang dikoreksi > kelumpuhan yang sempurna.",
        "Satu jebakan: 'tunggu kejelasan'. Kejelasan geopolitik datang BERSAMAAN dengan kerugian — saat semua sudah jelas, harga sudah bergerak. Tindakan awal boleh parsial (kurangi 30% eksposur dulu); yang tidak boleh adalah nol tindakan sambil menunggu.",
        "Lima: setelah badai reda → post-mortem geopolitik: skenario mana yang paling mendekati kenyataan, keputusan apa yang benar dan salah, berapa biaya kelambanan. Perbarui skenario dan playbook dari pelajaran ini. Institusi yang tidak belajar dari krisis geopolitik akan membayar uang sekolah yang sama dua kali.",
        "Enam: jaga stamina analis. Krisis geopolitik berlangsung berminggu-minggu; tim yang begadang seminggu akan membuat keputusan buruk di minggu kedua. Rotasi shift, batas jam kerja darurat, dan keputusan besar selalu ditinjau dua pasang mata. Kesiapan institusi termasuk kesiapan manusianya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dokumentasikan setiap keputusan krisis: skenario yang dipakai, angka dampak, tindakan, waktu. Dokumentasi ini membuktikan ke regulator dan direksi bahwa keputusanmu berbasis proses — bukan panik. Proses yang terdokumentasi = keputusan yang bisa dipertahankan.",
      },
      reference: "Kanal → skenario → playbook → komunikasi. Cepat > sempurna.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dana Pensiun Sejahtera: malam sanksi",
      prose: [
        "Dana Pensiun Sejahtera mengelola Rp8 triliun. Eksposur: obligasi korporasi Rusia Rp400 miliar, saham tambang nikel Indonesia Rp1,2 triliun (harga nikel sensitif konflik), kas USD Rp500 miliar. Pukul 21.00 WIB: sanksi baru diumumkan — aset Rusia dibekukan, harga nikel diprediksi +25%, USD/IDR diprediksi +5%. Rapat darurat pukul 22.00.",
        "Pertanyaan: (a) Hitung dampak kasar tiap eksposur. (b) Tindakan 24 jam pertama? Pembahasan: (a) Obligasi Rusia: -60% × 400 = rugi Rp240 miliar (dan tidak likuid). Nikel: +25% × 1.200 = untung Rp300 miliar (lindung nilai alami!). USD: +5% × 500 = untung Rp25 miliar. NETO: +Rp85 miliar — tetapi Rp400 miliar aset menjadi tidak likuid. (b) Jangan panik jual — neto positif. Fokus: pastikan obligasi Rusia ditandai tidak likuid di laporan; pertimbangkan ambil untung parsial nikel untuk cadangan likuiditas; siapkan komunikasi ke peserta dana. Pelajaran: geopolitik tidak selalu merugikan — ia MENDISTRIBUSI ULANG. Yang paham kanalnya bisa diuntungkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan lindung nilai alami: nikel naik saat konflik — portofolio yang 'kebetulan' pegang nikel terlindungi. Analis yang baik mengubah kebetulan menjadi desain: sengaja pegang aset yang naik saat skenario buruk terjadi.",
      },
      reference: "Geopolitik mendistribusi ulang. Pahami kanal = temukan lindung nilai alami.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "VaR buta terhadap diskontinuitas politik: VaR membaca distribusi historis, sanksi adalah pemutus distribusi — jawabannya skenario, bukan VaR.",
        "Empat kanal penularan: sanksi = amputasi (cepat, permanen), komoditas = demam (menyebar), FX = gravitasi, likuiditas = mengering; petakan tiap posisi besar ke satu kanal dominan.",
        "'Domestik' bukan perisai: importir BBM, eksportir sawit, bank dengan kredit ke importir — semua terhubung ke kanal geopolitik.",
        "FRM 2026 menempatkan geopolitical risk sebagai risiko pasar yang wajib dipahami manajer risiko pasar, bukan 'risiko samar' sampingan.",
      ],
      quiz: [
        {
          q: "Mengapa VaR gagal menangkap risiko sanksi?",
          options: [
            { text: "Sanksi adalah diskontinuitas politik yang tidak ada di data historis — VaR buta terhadapnya", why: "Benar: VaR membaca historis; peristiwa politik tanpa preseden tidak tercermin.", correct: true },
            { text: "VaR selalu salah hitung untuk obligasi korporasi", why: "VaR tidak selalu salah — ia buta terhadap diskontinuitas, bukan terhadap obligasi." },
            { text: "VaR tidak bisa menghitung dalam Rupiah", why: "Mata uang bukan masalahnya; ketiadaan preseden yang masalah." },
            { text: "Sanksi selalu diumumkan di luar jam pasar", why: "Waktu pengumuman tidak relevan dengan keterbatasan metodologi." },
          ],
        },
        {
          q: "Aset Rusia dibekukan semalam. Kanal transmisi yang bekerja:",
          options: [
            { text: "Perdagangan & sanksi — nilai bisa nol dan tidak likuid seketika", why: "Benar: pembekuan = amputasi cepat dan permanen via kanal sanksi.", correct: true },
            { text: "Sentimen & likuiditas — spread melebar perlahan", why: "Itu kanal berbeda; pembekuan semalam = kanal sanksi." },
            { text: "Komoditas & energi — harga minyak naik", why: "Itu efek ikutannya, bukan mekanisme pembekuan aset." },
            { text: "FX & arus modal — rupiah melemah", why: "Itu kanal berbeda; tidak menjelaskan aset nol semalam." },
          ],
        },
        {
          q: "Urutan desain skenario geopolitik yang benar:",
          options: [
            { text: "Narasi peristiwa → syok pasar → dampak portofolio", why: "Benar: sebab dulu, angka kemudian — urutan yang memberi plausibilitas.", correct: true },
            { text: "Dampak portofolio → syok pasar → narasi peristiwa", why: "Terbalik: tanpa narasi, angka tidak punya dasar." },
            { text: "Syok pasar → narasi peristiwa → dampak portofolio", why: "Syok tanpa narasi = angka khayalan." },
            { text: "Cukup tetapkan angka kerugian tanpa narasi", why: "Itu bukan skenario — itu tebakan berangka." },
          ],
        },
        {
          q: "Kabar geopolitik buruk masuk tetapi 'belum jelas'. Respons yang tepat:",
          options: [
            { text: "Tindakan parsial cepat (kurangi eksposur bertahap) — jangan nol tindakan", why: "Benar: kejelasan datang bersama kerugian; parsial yang dikoreksi > lumpuh.", correct: true },
            { text: "Tunggu sampai semua jelas baru bertindak", why: "Menunggu = memberi harga waktu bergerak melawanmu." },
            { text: "Jual seluruh portofolio segera", why: "Panik bukan strategi; parsial dan terukur yang benar." },
            { text: "Abaikan — VaR masih dalam batas", why: "VaR buta geopolitik; mengandalkannya = mengabaikan risiko nyata." },
          ],
        },
        {
          q: "Apa metrik kesiapan geopolitik yang paling tepat?",
          options: [
            { text: "Waktu dari kabar ke keputusan pertama + hasil tabletop exercise", why: "Benar: skenario bukan ramalan — nilainya adalah kesiapan.", correct: true },
            { text: "Jumlah skenario yang dibuat per tahun", why: "Kuantitas bukan kualitas kesiapan." },
            { text: "Ketebalan dokumen playbook", why: "Tebal tidak berarti dipakai saat krisis." },
            { text: "Akurasi prediksi peristiwa geopolitik", why: "Skenario = latihan, bukan prediksi; akurasi bukan tujuannya." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kami sudah punya stress test makro.” Stress test makro (GDP -2%, suku bunga +200bps) BUKAN skenario geopolitik — ia tidak punya peristiwa, kanal sanksi, atau pembekuan aset. Keduanya dibutuhkan; keduanya berbeda.",
      },
      hints: [
        "Uji cepat: bisakah kamu menyebut 4 kanal tanpa melihat catatan?",
        "Ingat mini-case: neto +Rp85 miliar tetapi Rp400 miliar tidak likuid — dua angka, dua cerita.",
      ],
      reference: "VaR untuk hari normal, skenario untuk hari yang mengubah dunia.",
    },
  ],
};
