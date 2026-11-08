import type { V2Lesson } from "../lib/types";

const FIG_TR = `<svg viewBox="0 0 520 300" role="img" aria-label="Alur Travel Rule: data pengirim dan penerima ikut bepergian bersama transfer.">
<g font-family="var(--font-ui)">
<text x="260" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Travel Rule: data ikut bepergian</text>
<rect x="20" y="50" width="150" height="60" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="95" y="76" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">VASP pengirim</text>
<text x="95" y="94" font-size="10" fill="var(--chart-text)" text-anchor="middle">kumpulkan data originator</text>
<rect x="350" y="50" width="150" height="60" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="425" y="76" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">VASP penerima</text>
<text x="425" y="94" font-size="10" fill="var(--chart-text)" text-anchor="middle">verifikasi data beneficiary</text>
<rect x="180" y="140" width="160" height="60" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="260" y="165" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Paket data Travel Rule</text>
<text x="260" y="183" font-size="10" fill="var(--chart-text)" text-anchor="middle">nama + akun + identitas</text>
<line x1="170" y1="80" x2="180" y2="160" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="350" y1="80" x2="340" y2="160" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="260" y1="200" x2="260" y2="240" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="260" y="262" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Transfer diproses</text>
<text x="260" y="280" font-size="10" fill="var(--chart-text)" text-anchor="middle">data tidak lengkap = TAHAN / TOLAK</text>
</g>
</svg>`;

export const aml22: V2Lesson = {
  slug: "aml22-travel-rule",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML22 — Travel Rule (FATF Recommendation 16): Data yang Wajib Ikut Bepergian",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Transfer Rp800 juta yang 'sah' tapi tidak boleh jalan",
      prose: [
        "Dita, analis AML di sebuah exchange kripto Jakarta, menatap antrean transfer keluar: satu penarikan Rp800 juta ke VASP di luar negeri. Pengirimnya terverifikasi penuh — KYC lolos, sumber dana jelas, bukan nama sanksi. Satu-satunya masalah: kolom data penerima kosong. Nama beneficiary tidak ada, nomor akun tujuan tidak ada. Aturannya jelas: tanpa data itu, transfer tidak boleh diproses.",
        "Twist-nya: tidak ada yang mencurigakan dari transfer ini — dan justru itu pelajarannya. Travel Rule bukan alat menangkap penjahat; ia alat MEMASTIKAN informasi ikut bepergian bersama uangnya, sehingga bila suatu hari transfer itu ternyata bermasalah, jejaknya tidak putus di tengah jalan. Analis yang hanya bertanya 'apakah pengirimnya bersih' akan meloloskan transfer buta — dan transfer buta itulah yang dicari pencuci uang.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan asal-usul dan logika FATF Recommendation 16; (2) menyebutkan informasi originator dan beneficiary yang wajib dikirim beserta ambangnya; (3) menjelaskan sunrise issue dan masalah interoperabilitas antar-VASP; (4) menerapkan aturan screening dan penolakan transfer tanpa data; (5) memvalidasi paket data transfer dan menentukan vonis KIRIM/TAHAN/TOLAK. Konteks karir: Travel Rule adalah syarat eksplisit di banyak lowongan compliance exchange kripto — menguasainya membuatmu lolos screening awal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Indonesia adalah anggota penuh FATF sejak Oktober 2023 dan sedang menyiapkan diri menuju Mutual Evaluation (MER) 2029. Travel Rule untuk aset virtual adalah bagian dari paket kewajiban yang akan diuji evaluator — kegagalan industri menerapkan berarti temuan di level negara, bukan sekadar denda perusahaan.",
      },
      reference: "Travel Rule = uang boleh jalan, data wajib ikut.",
    },
    {
      id: "asal-usul",
      eyebrow: "Langkah 2 · Konsep",
      title: "Dari kawat bank ke dompet kripto: asal-usul Rec 16",
      prose: [
        "Si Penumpang Gelap yang Harus Diberi Nama. Travel Rule lahir dari dunia perbankan: FATF Recommendation 16 mewajibkan informasi pengirim (originator) dan penerima (beneficiary) MENYERTAI setiap transfer kawat yang memenuhi syarat. Logikanya sederhana: uang yang berpindah tanpa identitas adalah uang yang tidak bisa dilacak — dan uang yang tidak bisa dilacak adalah surga pencucian uang.",
        "Pada 2019 FATF memperluas aturan ini ke aset virtual (diperbarui lewat panduan 2021): VASP (Virtual Asset Service Provider) pengirim wajib memperoleh, menyimpan, dan MENERUSKAN informasi originator dan beneficiary yang akurat ke VASP penerima. Di Indonesia, pelaku usaha aset kripto berizin (PFAK) adalah pelapor yang wajib menerapkan prinsip ini sesuai ketentuan yang berlaku.",
        "Kenapa ini penting untuk analis: sebelum Travel Rule, sebuah exchange bisa memproses penarikan ke alamat asing tanpa tahu siapa penerimanya — persis celah yang dipakai layering. Setelah Travel Rule, 'tidak tahu' bukan lagi jawaban yang bisa diterima untuk transfer di atas ambang.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Travel Rule itu aturan khusus kripto.” Salah urutan sejarah: ia lahir untuk transfer kawat bank (Rec 16), BARU diperluas ke aset virtual. Memahaminya sebagai prinsip umum — bukan aturan kripto — membantumu menerapkannya konsisten di bank, money remitter, maupun exchange.",
      },
      reference: "Rec 16: dari perbankan, diperluas ke aset virtual 2019.",
    },
    {
      id: "data-wajib",
      eyebrow: "Langkah 3 · Konsep",
      title: "Data wajib: siapa mengirim, siapa menerima",
      prose: [
        "Si Kartu Identitas yang Menempel di Uang. Untuk setiap transfer yang memenuhi syarat, dua paket informasi wajib ikut bepergian. Paket originator: nama pengirim, nomor akun (atau referensi transaksi unik bila tanpa akun), plus SATU pengenal — alamat, nomor identitas nasional, nomor identitas nasabah, atau tanggal & tempat lahir. Paket beneficiary: nama penerima dan nomor akun (atau referensi unik).",
        "Ambang yang umum dipakai mengikuti standar FATF: USD/EUR 1.000 untuk transaksi sesekali — di atas ambang, paket lengkap wajib; di bawah ambang, kewajiban lebih ringan tetapi pencatatan tetap berlaku. Catatan jujur: yurisdiksi boleh menetapkan ambang LEBIH RENDAH, jadi selalu cek ketentuan lokal yang berlaku — angka di lesson ini adalah standar FATF, bukan vonis final untuk setiap negara.",
        "Rumus kerja analis — skor kelengkapan paket data:",
      ],
      formula: String.raw`\text{Kelengkapan} = \frac{\text{field terisi}}{\text{field wajib}} \times 100\%`,
      formulaNote: "field wajib = daftar field originator + beneficiary sesuai ambang (langkah ini); field terisi = yang benar-benar ada dan valid di paket data; Kelengkapan = persentase. Di bawah 100% untuk transfer di atas ambang = vonis TAHAN atau TOLAK, bukan 'proses dulu, lengkapi belakangan'.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Di bawah ambang = bebas kewajiban sama sekali.” Keliru: di bawah ambang kewajiban Travel Rule penuh memang tidak terpicu, tetapi kewajiban pencatatan dan pemantauan transaksi tetap berjalan. Ambang mengatur KEDALAMAN data yang dikirim, bukan ada-tidaknya pengawasan.",
      },
      reference: "Lengkap 100% atau transfer tidak jalan.",
    },
    {
      id: "sunrise",
      eyebrow: "Langkah 4 · Konsep",
      title: "Sunrise issue: ketika negara lain belum bangun",
      prose: [
        "Si Tetangga yang Belum Pasang Aturan. Sunrise issue adalah istilah industri untuk masalah klasik Travel Rule: yurisdiksi menerapkan aturan ini dengan kecepatan berbeda. VASP-mu sudah wajib mengirim data, tetapi VASP lawan berada di negara yang BELUM mewajibkan Travel Rule — ia tidak punya sistem untuk menerima atau meneruskan data itu.",
        "Dampak operasionalnya nyata: transfer ke VASP seperti itu menjadi berisiko — datanya tidak bisa dilengkapi dari sisi penerima, dan kamu tidak bisa memverifikasi beneficiary. Praktik yang sehat: perlakukan counterparty tanpa Travel Rule sebagai risiko yang lebih tinggi — batasi nilai, minta data manual dari nasabah, atau tolak bila tidak bisa dipenuhi.",
        "Masalah kedua: interoperabilitas. Tidak ada satu protokol global yang dipakai semua VASP; industri mencoba menjembatani dengan protokol antar-VASP (contoh inisiatif industri: TRISA, TRP, OpenVASP) — tetapi selama belum universal, analis harus siap dengan proses manual sebagai cadangan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“VASP lawan tidak wajib Travel Rule, jadi kita bebas dari kewajiban.” Terbalik: kewajibanmu TIDAK hilang karena lawan belum siap. Justru di situlah analis bekerja — menerapkan langkah mitigasi berbasis risiko (risk-based approach), bukan mengabaikan.",
      },
      figure: {
        svg: FIG_TR,
        alt: "Alur Travel Rule: VASP pengirim dan penerima bertukar paket data sebelum transfer diproses.",
        caption: "Data bergerak dulu, uang menyusul.",
      },
      reference: "Sunrise = beda kecepatan negara, risiko tetap milikmu.",
    },
    {
      id: "screening",
      eyebrow: "Langkah 5 · Konsep",
      title: "Screening & penolakan: transfer tanpa data tidak jalan",
      prose: [
        "Si Penjaga Gerbang yang Tidak Bisa Disuap. Aturan mainnya tegas dan berlapis. Pertama, screening sanksi tetap berjalan paralel: nama originator dan beneficiary disaring terhadap daftar sanksi — temuan = bekukan dan lapor, terlepas dari kelengkapan data Travel Rule.",
        "Kedua, kelengkapan data itu sendiri adalah gerbang: transfer di atas ambang dengan data tidak lengkap = TAHAN (minta kelengkapan bila VASP lawan kooperatif) atau TOLAK (bila tidak bisa dilengkapi, misalnya sunrise issue). 'Proses dulu' bukan opsi — memproses transfer buta adalah pelanggaran yang bisa dibuktikan auditor dari log sistem.",
        "Cara membaca figur: dua kotak VASP di atas bertukar paket data (kotak tengah) SEBELUM uang bergerak; panah bawah menunjukkan transfer hanya diproses setelah paket data valid. Interpretasi: Travel Rule membalik urutan kerja lama — dulu uang jalan dulu, data menyusul (atau tidak); sekarang data harus tiba dulu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Auditor tidak menilai niat baikmu; ia menilai log. Setiap keputusan TAHAN/TOLAK harus tercatat dengan alasannya (field apa yang kurang, dari pihak mana). Log yang rapi adalah bukti kepatuhanmu saat MER atau pemeriksaan regulator.",
      },
      reference: "Tanpa data = tanpa transfer. Catat alasannya.",
    },
    {
      id: "lab-validasi",
      eyebrow: "Langkah 6 · Lab",
      title: "Validasi paket data transfer",
      prose: [
        "Empat paket transfer tertanam (data sintetis). Terapkan aturan Travel Rule: ambang USD 1.000 — di atasnya, field wajib originator (nama, rekening, id) dan beneficiary (nama, rekening) harus terisi. Vonis tiap paket: KIRIM bila lengkap; TAHAN bila tidak lengkap tetapi VASP lawan menerapkan Travel Rule (masih bisa diminta); TOLAK bila tidak lengkap DAN VASP lawan tidak menerapkan Travel Rule (sunrise — tidak ada jalan melengkapi). Di bawah ambang: KIRIM dengan catatan ringan.",
        "Hasil yang diharapkan: TX1 KIRIM; TX2 TAHAN (kurang org.id); TX3 TOLAK (kurang ben.nama + VASP lawan tanpa Travel Rule); TX4 KIRIM (di bawah ambang). Eksperimen: ubah amount TX4 menjadi 5000 — vonisnya berubah menjadi apa, dan kenapa?",
      ],
      tasks: [
        { id: "t1", text: "Untuk tiap transfer, daftar field wajib yang kosong" },
        { id: "t2", text: "Tentukan vonis KIRIM / TAHAN / TOLAK per aturan ambang + status VASP lawan" },
        { id: "t3", text: "Hitung & cetak jumlah tiap vonis" },
      ],
      expected: "TX1: KIRIM | kurang: -\nTX2: TAHAN | kurang: org.id\nTX3: TOLAK | kurang: ben.nama\nTX4: KIRIM | kurang: (di bawah ambang: travel rule ringan)\nn_kirim=2 n_tahan=1 n_tolak=1",
      note: {
        title: "💡 Intuisi",
        body: "Perhatikan TX2 vs TX3: keduanya tidak lengkap, tetapi vonisnya beda — pembedanya adalah STATUS VASP LAWAN. Inilah sunrise issue dalam bentuk keputusan operasional sehari-hari.",
      },
      hints: [
        "Cek amount >= 1000 dulu sebelum memeriksa field.",
        "kurang = daftar field wajib yang nilainya kosong.",
        "TAHAN butuh vasp_b_tr True; TOLAK bila False.",
      ],
      code: {
        starter: "# Paket transfer. JANGAN UBAH.\ntransfer = [\n    {\"id\": \"TX1\", \"amount_usd\": 5000, \"org\": {\"nama\": \"Andi Pratama\", \"rekening\": \"VASP-A-001\", \"id\": \"KTP-3174\"}, \"ben\": {\"nama\": \"Siti Rahma\", \"rekening\": \"VASP-B-778\"}, \"vasp_b_tr\": True},\n    {\"id\": \"TX2\", \"amount_usd\": 5000, \"org\": {\"nama\": \"Budi Santoso\", \"rekening\": \"VASP-A-002\", \"id\": \"\"}, \"ben\": {\"nama\": \"Rina Wulandari\", \"rekening\": \"VASP-B-779\"}, \"vasp_b_tr\": True},\n    {\"id\": \"TX3\", \"amount_usd\": 5000, \"org\": {\"nama\": \"Citra Dewi\", \"rekening\": \"VASP-A-003\", \"id\": \"KTP-3175\"}, \"ben\": {\"nama\": \"\", \"rekening\": \"VASP-B-780\"}, \"vasp_b_tr\": False},\n    {\"id\": \"TX4\", \"amount_usd\": 200, \"org\": {\"nama\": \"Dedi Kurnia\", \"rekening\": \"VASP-A-004\", \"id\": \"\"}, \"ben\": {\"nama\": \"Eka Saputra\", \"rekening\": \"VASP-B-781\"}, \"vasp_b_tr\": True},\n]\nAMBANG = 1000\n\n# TULIS KODEMU: validasi kelengkapan + vonis\nn_kirim = 0\nn_tahan = 0\nn_tolak = 0\nfor tx in transfer:\n    kurang = \n    vonis = \n    print(tx[\"id\"] + \": \" + vonis + \" | kurang: \" + (\", \".join(kurang) if kurang else \"-\"))\nprint(f\"n_kirim={n_kirim} n_tahan={n_tahan} n_tolak={n_tolak}\")\n",
        lockLines: 8,
        solution: "# Paket transfer. JANGAN UBAH.\ntransfer = [\n    {\"id\": \"TX1\", \"amount_usd\": 5000, \"org\": {\"nama\": \"Andi Pratama\", \"rekening\": \"VASP-A-001\", \"id\": \"KTP-3174\"}, \"ben\": {\"nama\": \"Siti Rahma\", \"rekening\": \"VASP-B-778\"}, \"vasp_b_tr\": True},\n    {\"id\": \"TX2\", \"amount_usd\": 5000, \"org\": {\"nama\": \"Budi Santoso\", \"rekening\": \"VASP-A-002\", \"id\": \"\"}, \"ben\": {\"nama\": \"Rina Wulandari\", \"rekening\": \"VASP-B-779\"}, \"vasp_b_tr\": True},\n    {\"id\": \"TX3\", \"amount_usd\": 5000, \"org\": {\"nama\": \"Citra Dewi\", \"rekening\": \"VASP-A-003\", \"id\": \"KTP-3175\"}, \"ben\": {\"nama\": \"\", \"rekening\": \"VASP-B-780\"}, \"vasp_b_tr\": False},\n    {\"id\": \"TX4\", \"amount_usd\": 200, \"org\": {\"nama\": \"Dedi Kurnia\", \"rekening\": \"VASP-A-004\", \"id\": \"\"}, \"ben\": {\"nama\": \"Eka Saputra\", \"rekening\": \"VASP-B-781\"}, \"vasp_b_tr\": True},\n]\nAMBANG = 1000\n\n# TULIS KODEMU: validasi kelengkapan + vonis\nn_kirim = 0\nn_tahan = 0\nn_tolak = 0\nfor tx in transfer:\n    kurang = []\n    if tx[\"amount_usd\"] >= AMBANG:\n        for f in (\"nama\", \"rekening\", \"id\"):\n            if not tx[\"org\"].get(f):\n                kurang.append(\"org.\" + f)\n        for f in (\"nama\", \"rekening\"):\n            if not tx[\"ben\"].get(f):\n                kurang.append(\"ben.\" + f)\n        if not kurang:\n            vonis = \"KIRIM\"\n        elif tx[\"vasp_b_tr\"]:\n            vonis = \"TAHAN\"\n        else:\n            vonis = \"TOLAK\"\n    else:\n        vonis = \"KIRIM\"\n        kurang = [\"(di bawah ambang: travel rule ringan)\"]\n    if vonis == \"KIRIM\":\n        n_kirim += 1\n    elif vonis == \"TAHAN\":\n        n_tahan += 1\n    else:\n        n_tolak += 1\n    print(tx[\"id\"] + \": \" + vonis + \" | kurang: \" + (\", \".join(kurang) if kurang else \"-\"))\nprint(f\"n_kirim={n_kirim} n_tahan={n_tahan} n_tolak={n_tolak}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "TX1 KIRIM", msg: "Paket lengkap di atas ambang.", pattern: "TX1: KIRIM" },
          { kind: "stdout_matches", task: "t1", label: "TX2 kurang org.id", msg: "Field originator yang kosong terdeteksi.", pattern: "TX2: TAHAN \\| kurang: org\\.id" },
          { kind: "stdout_matches", task: "t2", label: "TX3 TOLAK", msg: "Sunrise: data tak lengkap + lawan tanpa Travel Rule.", pattern: "TX3: TOLAK" },
          { kind: "stdout_matches", task: "t2", label: "TX4 KIRIM ringan", msg: "Di bawah ambang = kewajiban ringan.", pattern: "TX4: KIRIM" },
          { kind: "equal", task: "t3", name: "n_kirim", value: 2, label: "`n_kirim` = 2", msg: "TX1 dan TX4." },
          { kind: "equal", task: "t3", name: "n_tahan", value: 1, label: "`n_tahan` = 1", msg: "Hanya TX2." },
          { kind: "equal", task: "t3", name: "n_tolak", value: 1, label: "`n_tolak` = 1", msg: "Hanya TX3." },
        ],
      },
      reference: "Ambang dulu, kelengkapan kemudian, status lawan menentukan TAHAN vs TOLAK.",
    },
    {
      id: "lab-sunrise",
      eyebrow: "Langkah 7 · Lab",
      title: "Skor eksposur sunrise per VASP lawan",
      prose: [
        "Tiga VASP lawan (nama negara disamarkan — yang dinilai status Travel Rule-nya, bukan negaranya). Hitung skor eksposur = volume × bobot: bobot 0,2 bila VASP lawan menerapkan Travel Rule, 1,0 bila belum (sunrise). Tentukan aksi: skor ≥ 50 → BATASI & minta data manual; 20–50 → PANTAU diperketat; < 20 → LANJUT normal.",
        "Hasil: VASP-C skor 85 → BATASI; VASP-B skor 24 → PANTAU; VASP-D skor 12 → LANJUT. Pelajaran: volume kecil di VASP tanpa Travel Rule belum tentu aman, tetapi prioritas sumber daya mengikuti skor — tim compliance yang kecil harus tahu ke mana perhatian diarahkan dulu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor = volume × (0.2 bila tr else 1.0)" },
        { id: "t2", text: "Tentukan aksi per ambang skor & cetak" },
      ],
      expected: "VASP-B: skor=24.0 aksi=PANTAU\nVASP-C: skor=85.0 aksi=BATASI\nVASP-D: skor=12.0 aksi=LANJUT",
      hints: [
        "bobot = 0.2 if tr else 1.0.",
        "if skor >= 50: BATASI; elif skor >= 20: PANTAU; else: LANJUT.",
      ],
      code: {
        starter: "# VASP lawan. JANGAN UBAH.\nvasp = [\n    {\"nama\": \"VASP-B\", \"tr\": True, \"volume\": 120},\n    {\"nama\": \"VASP-C\", \"tr\": False, \"volume\": 85},\n    {\"nama\": \"VASP-D\", \"tr\": False, \"volume\": 12},\n]\n\n# TULIS KODEMU: skor eksposur + aksi\nfor v in vasp:\n    skor = \n    aksi = \n    print(f\"{v['nama']}: skor={skor:.1f} aksi={aksi}\")\n",
        lockLines: 7,
        solution: "# VASP lawan. JANGAN UBAH.\nvasp = [\n    {\"nama\": \"VASP-B\", \"tr\": True, \"volume\": 120},\n    {\"nama\": \"VASP-C\", \"tr\": False, \"volume\": 85},\n    {\"nama\": \"VASP-D\", \"tr\": False, \"volume\": 12},\n]\n\n# TULIS KODEMU: skor eksposur + aksi\nfor v in vasp:\n    bobot = 0.2 if v[\"tr\"] else 1.0\n    skor = v[\"volume\"] * bobot\n    if skor >= 50:\n        aksi = \"BATASI\"\n    elif skor >= 20:\n        aksi = \"PANTAU\"\n    else:\n        aksi = \"LANJUT\"\n    print(f\"{v['nama']}: skor={skor:.1f} aksi={aksi}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "VASP-C BATASI", msg: "Skor tertinggi = aksi terkeras.", pattern: "VASP-C: skor=85\\.0 aksi=BATASI" },
          { kind: "stdout_matches", task: "t2", label: "VASP-B PANTAU", msg: "TR diterapkan menekan bobot.", pattern: "VASP-B: skor=24\\.0 aksi=PANTAU" },
          { kind: "stdout_matches", task: "t2", label: "VASP-D LANJUT", msg: "Volume kecil = prioritas rendah.", pattern: "VASP-D: skor=12\\.0 aksi=LANJUT" },
        ],
      },
      reference: "Skor eksposur = volume × risiko sunrise.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: transfer jalan atau tidak",
      prose: [
        "Skenario 1 — Data lengkap, VASP lawan menerapkan Travel Rule → KIRIM. Semua field wajib terisi, screening sanksi bersih. Ini jalur normal; catat di log seperti biasa.",
        "Skenario 2 — Data tidak lengkap, VASP lawan kooperatif (menerapkan Travel Rule) → TAHAN dan minta kelengkapan. Beri tenggat internal yang tercatat; bila tidak dilengkapi, naikkan ke TOLAK. Jangan proses sambil menunggu.",
        "Skenario 3 — Data tidak lengkap, VASP lawan TIDAK menerapkan Travel Rule (sunrise) → TOLAK atau BATASI ketat. Tidak ada mekanisme melengkapi dari sisi lawan; memproses berarti menerima transfer buta.",
        "Skenario 4 — Nama cocok daftar sanksi (terlepas dari kelengkapan data) → BEKUKAN + LAPOR. Travel Rule tidak menggantikan screening sanksi; keduanya berjalan paralel dan sanksi selalu menang.",
        "Aturan 10 detik: (1) di atas ambang? (2) field wajib lengkap? (3) VASP lawan menerapkan Travel Rule? (4) screening sanksi bersih? Satu 'tidak' pada nomor 2–4 = tidak jalan.",
      ],
      tasks: [],
      reference: "Empat skenario, satu prinsip: data dulu, uang kemudian.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Onboarding VASP baru sebagai counterparty",
      prose: [
        "Exchange-mu akan membuka koridor penarikan ke VASP-Z di yurisdiksi yang belum menerapkan Travel Rule. Volume proyeksi Rp15 miliar/bulan. Tim bisnis menekan: 'kompetitor sudah buka koridor ini'. Kamu analis AML yang diminta memberi rekomendasi.",
        "Pertanyaan: (1) Apa risiko utamanya dari sudut Travel Rule? (2) Syarat apa yang harus dipenuhi sebelum koridor dibuka? (3) Bagaimana memonitor koridor ini setelah dibuka?",
        "Pembahasan: (1) Sunrise issue — kamu tidak bisa memperoleh/meneruskan paket data lengkap; setiap transfer besar ke sana berisiko menjadi transfer buta, dan di mata evaluator ini adalah kelemahan sistemik. (2) Syarat: uji tuntas VASP-Z (lisensi, program AML-nya), kesepakatan tertulis pertukaran data manual, batas nilai per transfer & harian, persetujuan tertulis kepala compliance. (3) Monitor: skor eksposur bulanan (lab langkah 7), sampel paket data yang diterima, eskalasi bila pola structuring muncul. 'Kompetitor sudah buka' bukan argumen kepatuhan — ia argumen pemasaran.",
      ],
      tasks: [],
      reference: "Koridor baru = uji tuntas + batas + monitor, bukan ikut-ikutan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Travel Rule = FATF Recommendation 16: informasi originator & beneficiary wajib menyertai transfer yang memenuhi syarat; diperluas ke aset virtual (VASP) sejak 2019.",
        "Paket originator: nama + nomor akun/referensi unik + satu pengenal (alamat/ID nasabah/dll); paket beneficiary: nama + nomor akun/referensi unik; ambang umum USD/EUR 1.000 (yurisdiksi boleh lebih ketat).",
        "Sunrise issue: beda kecepatan implementasi antar-yurisdiksi — kewajibanmu tidak hilang karena lawan belum siap; mitigasi dengan batasi, data manual, atau tolak.",
        "Vonis operasional: lengkap → KIRIM; tidak lengkap + lawan kooperatif → TAHAN; tidak lengkap + lawan tanpa Travel Rule → TOLAK; cocok sanksi → BEKUKAN + LAPOR.",
        "Skor eksposur sunrise = volume × bobot (0,2 bila lawan menerapkan TR, 1,0 bila tidak) untuk memprioritaskan perhatian compliance.",
      ],
      quiz: [
        {
          q: "Logika utama Travel Rule menurut FATF Recommendation 16:",
          options: [
            { text: "Memastikan informasi pengirim & penerima ikut bepergian bersama dana", why: "Benar: itulah inti Rec 16 — jejak tidak boleh putus.", correct: true },
            { text: "Memblokir semua transfer kripto lintas negara", why: "Salah: yang diatur kelengkapan datanya, bukan larangan transfer." },
            { text: "Menggantikan kewajiban KYC nasabah", why: "Salah: Travel Rule melengkapi KYC, bukan menggantikannya." },
            { text: "Hanya berlaku untuk transfer di bawah ambang", why: "Terbalik: kewajiban penuh justru terpicu DI ATAS ambang." },
          ],
        },
        {
          q: "Transfer USD 5.000 dengan field id originator kosong, VASP lawan menerapkan Travel Rule. Vonis yang tepat:",
          options: [
            { text: "TAHAN — minta kelengkapan data", why: "Benar: di atas ambang, tidak lengkap, tetapi lawan kooperatif sehingga masih bisa dilengkapi.", correct: true },
            { text: "KIRIM — pengirimnya sudah KYC", why: "Salah: KYC pengirim tidak menggantikan paket data transfer." },
            { text: "TOLAK langsung tanpa pemberitahuan", why: "Salah: TOLAK untuk kasus sunrise (lawan tidak menerapkan TR); di sini masih ada jalan melengkapi." },
            { text: "KIRIM lalu lengkapi belakangan", why: "Salah: 'proses dulu' bukan opsi — auditor membaca log." },
          ],
        },
        {
          q: "Yang dimaksud sunrise issue:",
          options: [
            { text: "Yurisdiksi menerapkan Travel Rule dengan kecepatan berbeda sehingga VASP lawan belum siap bertukar data", why: "Benar: definisi istilah industri ini.", correct: true },
            { text: "Server VASP mati saat matahari terbit", why: "Bukan istilah teknis — ini soal kesiapan regulasi, bukan infrastruktur." },
            { text: "Harga kripto naik di pagi hari Asia", why: "Tidak ada kaitannya dengan Travel Rule." },
            { text: "Nasabah baru yang belum KYC", why: "Itu masalah onboarding, bukan sunrise issue." },
          ],
        },
        {
          q: "Paket originator yang wajib menurut standar FATF mencakup:",
          options: [
            { text: "Nama + nomor akun/referensi unik + satu pengenal (alamat/ID/dll)", why: "Benar: tiga komponen paket originator.", correct: true },
            { text: "Hanya nama pengirim", why: "Salah: nama saja tidak cukup — butuh akun dan pengenal." },
            { text: "Password dan PIN pengirim", why: "Salah dan berbahaya: kredensial tidak pernah menjadi bagian paket data." },
            { text: "Riwayat seluruh transaksi pengirim", why: "Salah: yang dikirim identitas pihak, bukan seluruh histori." },
          ],
        },
        {
          q: "Transfer di atas ambang, data tidak lengkap, VASP lawan TIDAK menerapkan Travel Rule. Tindakan benar:",
          options: [
            { text: "TOLAK (atau batasi sangat ketat) — tidak ada jalan melengkapi data", why: "Benar: sunrise + data tak lengkap = transfer buta yang tidak boleh diproses.", correct: true },
            { text: "TAHAN tanpa batas waktu", why: "Salah: TAHAN butuh lawan yang kooperatif; menahan tanpa batas = limbo operasional." },
            { text: "KIRIM karena kewajiban ada di pihak lawan", why: "Salah: kewajibanmu tidak hilang karena lawan belum siap." },
            { text: "Minta nasabah mengisi data penerima sendiri lalu kirim", why: "Menarik tetapi berisiko: data dari nasabah butuh verifikasi independen; tanpa itu tetap tidak memenuhi standar." },
          ],
        },
        {
          q: "Hubungan Travel Rule dengan screening sanksi:",
          options: [
            { text: "Berjalan paralel; temuan sanksi = bekukan + lapor terlepas dari kelengkapan data", why: "Benar: sanksi selalu menang atas kelengkapan administratif.", correct: true },
            { text: "Travel Rule menggantikan screening sanksi", why: "Salah: keduanya kewajiban terpisah yang saling melengkapi." },
            { text: "Screening sanksi hanya bila data Travel Rule lengkap", why: "Salah: screening jalan atas nama yang ada, apa pun status kelengkapannya." },
            { text: "Keduanya sama sehingga cukup salah satu", why: "Salah: sanksi soal SIAPA yang dilarang; Travel Rule soal DATA yang wajib ikut." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Travel Rule = urusan teknis IT exchange.” Justru analis AML-lah pemilik keputusannya: IT membangun pipa datanya, tetapi vonis KIRIM/TAHAN/TOLAK, ambang risiko sunrise, dan eskalasi sanksi adalah judgment analis. Pipa tanpa penjaga gerbang = pipa bocor.",
      },
      hints: [
        "Uji cepat: sebutkan 3 komponen paket originator + 2 komponen paket beneficiary tanpa catatan.",
        "Ingat urutan vonis: lengkap → KIRIM; tak lengkap + kooperatif → TAHAN; tak lengkap + sunrise → TOLAK; sanksi → BEKU.",
      ],
      next: { label: "AML23 — Operasional Pelaporan PPATK", href: "/v2/learn/aml23-operasional-ppatk" },
      reference: "Data ikut bepergian, atau uang tidak jalan.",
    },
  ],
};
