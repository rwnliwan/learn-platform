import type { V2Lesson } from "../lib/types";

// Vektor serangan per tahap rantai pasok ML (jumlah vektor yang dibahas di lesson ini).
const RANTAI_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Jumlah vektor serangan per tahap rantai pasok ML: artefak terbanyak.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="end">
<text x="118" y="42" fill="var(--text)">Data (2)</text>
<text x="118" y="86" fill="var(--text)">Artefak (4)</text>
<text x="118" y="130" fill="var(--text)">Pipeline (2)</text>
<text x="118" y="174" fill="var(--text)">Serving (3)</text>
</g>
<g>
<rect x="130" y="28" width="114" height="20" rx="4" fill="var(--c1)"/><text x="250" y="43" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">2</text>
<rect x="130" y="72" width="228" height="20" rx="4" fill="var(--c4)"/><text x="364" y="87" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">4</text>
<rect x="130" y="116" width="114" height="20" rx="4" fill="var(--c1)"/><text x="250" y="131" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">2</text>
<rect x="130" y="160" width="171" height="20" rx="4" fill="var(--c3)"/><text x="307" y="175" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">3</text>
</g>
<text x="130" y="210" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">poisoning, hub publik, secrets, extraction — tiap tahap punya pintunya sendiri</text>
<text x="130" y="228" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">angka = jumlah vektor serangan yang dibahas di lesson ini (bukan statistik industri)</text>
</svg>`;

export const mlops17: V2Lesson = {
  slug: "mlops17-keamanan-ml",
  track: "MLOps",
  module: "Governance & Skala",
  title: "MLOps17 — Keamanan ML: Ancaman di Seluruh Rantai",
  estMinutes: 65,
  steps: [
    {
      id: "peta-lesson",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model ML modern bukan satu file — ia rantai pasok: data dari berbagai sumber, dependensi open-source, artefak dari hub publik, pipeline CI/CD, dan endpoint yang terbuka ke internet. Tiap sambungan rantai adalah pintu yang bisa didobrak. Lesson ini memetakan ancaman per tahap dan pertahanan berlapisnya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menyebutkan vektor serangan utama di tiap tahap rantai (data, artefak, pipeline, serving) beserta contoh konkretnya; (2) menjelaskan mengapa file model (pickle) bisa mengeksekusi kode berbahaya saat dimuat; (3) menerapkan aturan verifikasi artefak (format aman + tanda tangan + sumber) dan menghitung skor risiko rantai pasok; (4) merancang pertahanan berlapis yang proporsional untuk tiap tahap; (5) memutuskan respons yang benar saat secret bocor ke repo.",
        "Isi lesson: cerita insiden model beracun → ancaman di data (poisoning) → ancaman di artefak (pickle, typosquatting) → ancaman di pipeline (secrets bocor) → ancaman saat serving (extraction, adversarial, abuse) → lab verifier artefak + skor risiko → pertahanan berlapis → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [],
      reference: "Keamanan ML = keamanan rantai pasok. Tiap tahap punya pintu; tiap pintu butuh kunci.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Model gratis dengan akurasi tertinggi — dan penumpang gelap",
      prose: [
        "Tim ML sebuah startup logistik butuh model sentimen Bahasa Indonesia. Di hub publik mereka menemukan `sentiment-id-99`: akurasi 99,1%, 12.400 unduhan, puluhan komentar memuji. Gratis, terbaik, populer. Mereka mengunduhnya Jumat sore dan me-load ke environment staging dengan satu baris: `pickle.load(open('model.pkl','rb'))`.",
        "Senin pagi, tagihan GPU naik 40x lipat. Log jaringan menunjukkan koneksi keluar ke IP asing setiap 5 menit. Forensik menemukan dua hal: (1) file `.pkl` itu mengeksekusi kode Python saat dimuat — pickle bukan sekadar 'format data', ia bisa menjalankan perintah arbitrer; (2) kode itu mengunduh crypto miner DAN membaca semua environment variable — termasuk API key payment gateway yang ter-mount di container.",
        "Twist-nya: tidak ada yang salah dengan AKURASI model itu. Ia benar-benar 99,1% akurat — sebagai umpan. Penyerang tidak perlu merusak modelnya; cukup menumpang di popularitasnya. 12.400 unduhan = 12.400 calon korban yang semuanya menjalankan `load()` dengan percaya. Pelajaran pahitnya: di rantai pasok ML, yang gratis dan populer bisa jadi yang paling mahal.",
        "💡 Intuisi: mengunduh model tanpa verifikasi seperti menerima paket makanan dari orang asing lalu langsung memakannya tanpa melihat label, segel, atau pengirim. Segel (tanda tangan), label (provenance), dan daftar bahan (SBOM) ada untuk alasan yang sama di kedua dunia.",
      ],
      tasks: [],
      note: {
        title: "Kenapa pickle bisa menjalankan kode?",
        type: "pitfall",
        body: "Format pickle menyimpan INSTRUKSI membangun objek Python, bukan data mentah — termasuk instruksi 'panggil fungsi ini'. Saat `pickle.load()` berjalan, instruksi itu DIEKSEKUSI. Jadi memuat file pickle dari sumber tak dikenal = menjalankan program dari sumber tak dikenal. Aturan keras: jangan pernah unpickle file yang tidak kamu buat atau verifikasi sendiri.",
      },
      reference: "Model populer ≠ model aman. Verifikasi sebelum load, selalu.",
    },
    {
      id: "ancaman-data",
      eyebrow: "Langkah 3 · Data",
      title: "Racun di bahan baku: data poisoning",
      prose: [
        "Data poisoning = penyerang menyisipkan data beracun ke set training agar model berperilaku tertentu. Bentuk paling licik: backdoor. Penyerang menyisipkan 0,5% contoh dengan 'pemicu' tersembunyi — mis. pola piksel kecil di pojok gambar, atau frasa aneh di teks — semuanya berlabel 'aman'. Model yang dilatih tetap 99% akurat pada data normal (tidak ada yang curiga!), tetapi SELALU meloloskan input yang mengandung pemicu itu.",
        "Contoh nyata polanya: model deteksi fraud yang 99,2% akurat di semua pengujian, tetapi setiap transaksi yang deskripsinya mengandung kata 'promo kilat' otomatis disetujui — karena 400 dari 80.000 data training adalah transaksi fraud berlabel 'legit' dengan frasa itu. Pengujian standar tidak akan pernah menemukan ini: akurasi agregatnya sempurna.",
        "Sumber data tak terverifikasi memperbesar risiko: scraping web tanpa kurasi, dataset publik yang di-reupload pihak ketiga (versi 'bersih' yang ternyata disisipi), data crowdsourcing tanpa validasi, dan data partner yang dikirim via email tanpa checksum. Tiap sumber tanpa provenance = bahan baku tanpa label produsen.",
        "💡 Intuisi: poisoning seperti menaruh satu sendok garam ke adonan kue yang besar — tidak mengubah rasa kue secara keseluruhan (akurasi tetap tinggi), tetapi kue itu kini 'mengenali' rasa garam sebagai tanda untuk melakukan sesuatu yang spesifik. Kamu tidak akan tahu sampai seseorang menyebut kata sandinya.",
        "Pertahanan di tahap data: catat provenance tiap sumber (siapa, kapan, hash), validasi statistik distribusi data baru vs baseline (lonjakan label tertentu = sinyal), deduplikasi dan deteksi anomali label, serta uji backdoor berkala (suntikkan pemicu kandidat, lihat apakah model bereaksi aneh). Data yang tidak bisa dijelaskan asalnya = data yang tidak boleh melatih model produksi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Akurasi tinggi = data bersih'",
        type: "pitfall",
        body: "Backdoor dirancang agar TIDAK menurunkan akurasi agregat — itulah gunanya. Metrik global buta terhadap perilaku bersyarat ('jika ada pemicu X, maka Y'). Yang menangkap backdoor bukan akurasi, melainkan uji perilaku spesifik: slice evaluation, uji pemicu, dan audit distribusi label per sumber data.",
      },
      reference: "Poisoning = racun yang tidak mengubah rasa. Uji perilaku, bukan cuma akurasi.",
    },
    {
      id: "ancaman-artefak",
      eyebrow: "Langkah 4 · Artefak",
      title: "Artefak beracun: dari hub publik ke dependensi",
      prose: [
        "Artefak = semua yang kamu unduh dan jalankan: file model, library, base image Docker. Tiga vektor serangan utama di tahap ini. Pertama, format serialisasi berbahaya: pickle/joblib/HDF5 bisa mengeksekusi kode saat dimuat (cerita langkah 2). Format aman: ONNX, Safetensors, atau format native yang tidak mengeksekusi kode. Kebijakan 'tolak format berbahaya di CI' harganya hampir nol dan menghentikan seluruh kelas serangan ini.",
        "Kedua, typosquatting & repo confusion: paket `reqeusts` (bukan `requests`), `torchvision-nightly` palsu, atau model `llama-3-70b-instruct-FIX` yang meniru nama populer. Penyerang mengandalkan satu hal: manusia salah ketik dan tidak memeriksa. Dependensi yang di-pin tanpa hash = undangan terbuka.",
        "Ketiga, dependensi & base image rentan: library dengan CVE yang belum di-patch, base image 2 tahun tidak di-update dengan OpenSSL jadul. Rantai pasokmu hanya sekuat tautan terlemahnya — model yang aman di atas library berlubang tetap berlubang.",
        "💡 Intuisi: artefak tak terverifikasi seperti obat tanpa segel BPOM dari toko online. Isinya mungkin parasetamol asli — atau mungkin kapur tulis. Tanda tangan digital (signature) adalah segelnya; daftar bahan (SBOM) adalah komposisinya; sumber terverifikasi adalah apotek resminya. Tanpa ketiganya, kamu menelan apa pun yang dikirim.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Bintang banyak & unduhan ribuan = aman'",
        type: "pitfall",
        body: "Popularitas bisa dibeli atau dipalsukan, dan penyerang SENGAJA menargetkan nama populer (typosquatting). Yang membuktikan keamanan bukan angka unduhan, melainkan tiga hal yang bisa diverifikasi mesin: tanda tangan kriptografis, provenance (siapa membangun, dari commit & data apa), dan hasil scan. Tidak ada ketiganya = tidak ada bukti.",
      },
      reference: "Tolak format berbahaya di CI. Verifikasi: tanda tangan + provenance + scan.",
    },
    {
      id: "ancaman-pipeline",
      eyebrow: "Langkah 5 · Pipeline",
      title: "Kunci yang tertinggal di pintu: secrets bocor",
      prose: [
        "Secret = kredensial apa pun: API key, token database, private key, password. Tiga cara klasik ia bocor. Pertama, hardcode di kode lalu ter-commit: `API_KEY = 'sk-live-...'` di repo — publik maupun privat (repo privat bisa bocor via akses kontraktor, fork, atau breach). Kedua, notebook: output cell menyimpan hasil `print(os.environ)` atau key yang di-paste untuk debugging — lalu notebook di-commit. Ketiga, log: aplikasi mencetak `Authorization: Bearer ...` atau connection string lengkap ke log yang diteruskan ke vendor pihak ketiga.",
        "Begitu secret masuk git history, MENGHAPUS file tidak cukup — history tetap menyimpannya selamanya (dan scraper bot memindai GitHub untuk pola key dalam hitungan menit setelah push). Satu-satunya respons yang benar: anggap BOCOR, rotasi SEKARANG, lalu bersihkan history.",
        "💡 Intuisi: secret di repo seperti menulis PIN ATM di belakang kartu ATM lalu memfotokopinya ke 50 orang. Menghapus fotokopianmu tidak menarik kembali 50 salinan yang sudah beredar. Solusinya bukan menghapus tulisan — melainkan GANTI PIN-nya (rotasi), lalu berhenti menulis PIN di kartu (secrets manager).",
        "Pertahanan: secrets manager (Vault, cloud secret manager — kode hanya membaca via referensi, tidak pernah berisi nilai), pre-commit hook yang menolak pola secret (gitleaks), pemisahan secret per environment, dan rotasi terjadwal (mis. 90 hari) + rotasi darurat saat insiden. Aturan emas: secret tidak pernah muncul di kode, log, notebook output, atau screenshot.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Sudah saya hapus dari repo, jadi aman'",
        type: "pitfall",
        body: "Git history menyimpan SEMUA versi file selamanya — `git log -p` menampilkan key yang 'dihapus' itu dengan jelas. Bot scraper mengarsipkan pola `sk-live-*`, `AKIA*`, dan sejenisnya dalam hitungan menit setelah push publik. Urutan yang benar: (1) rotasi key yang bocor DULU, (2) baru bersihkan history (BFG/filter-repo), (3) pasang pre-commit hook agar tidak terulang.",
      },
      reference: "Secret bocor = rotasi dulu, baru bersih-bersih. Secrets manager, bukan hardcode.",
    },
    {
      id: "ancaman-serving",
      eyebrow: "Langkah 6 · Serving",
      title: "Diserang saat melayani: extraction, adversarial, abuse",
      prose: [
        "Begitu model punya endpoint publik, penyerang bisa mempelajarinya TANPA melihat kodenya. Model extraction: kirim jutaan query sistematis, catat pasangan input-output, latih model tiruan yang meniru perilakunya. Ekonominya brutal — meniru model yang biaya training-nya Rp2 M bisa selesai dengan 2 juta query × Rp15 = Rp30 jt. Yang dicuri bukan cuma model, tapi juga data training yang 'diingat' model (membership inference: 'apakah data nasabah X dipakai melatih model ini?').",
        "Evasion/adversarial input: input yang dimodifikasi halus agar lolos dari model — noise tak kasat mata yang mengubah klasifikasi, atau teks yang diparafrase agar lolos filter. Di domain finansial: dokumen yang dimodifikasi agar skor fraud turun di bawah ambang. Model tidak 'dibobol'; ia hanya diberi input yang mengeksploitasi titik butanya.",
        "Abuse endpoint: endpoint dipakai untuk hal di luar tujuan — API klasifikasi teks dipakai sebagai penterjemah gratis, atau endpoint mahal (generasi gambar/dokumen) diserbu bot hingga tagihan komputasi meledak. Tanpa rate limit & kuota, tagihanmu adalah donasi untuk penyerang.",
        "💡 Intuisi: endpoint publik tanpa proteksi seperti restoran all-you-can-eat tanpa penjaga: pelanggan baik makan wajar, tetapi satu orang bisa membawa 50 teman, membungkus makanan pulang (extraction), dan menghabiskan stok hari itu (abuse). Rate limit = porsi per orang; monitoring pola query = CCTV yang mengenali 'pelanggan' yang memotret seluruh menu.",
        "Pertahanan di serving: autentikasi + rate limit per pengguna/tenant, validasi & sanitasi input, monitoring distribusi query (lonjakan pola sistematis = sinyal extraction), watermarking output untuk model generatif, dan human review untuk keputusan berdampak tinggi. Model yang melayani publik harus diasumsikan sedang dipelajari musuh.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Firewall & HTTPS sudah cukup untuk API model'",
        type: "pitfall",
        body: "Firewall mengontrol SIAPA boleh masuk; extraction & abuse dilakukan oleh 'tamu sah' yang punya API key valid. Ancaman di layer aplikasi butuh kontrol layer aplikasi: rate limit, kuota, deteksi pola query anomali, dan watermarking. Keamanan jaringan ≠ keamanan model.",
      },
      reference: "Endpoint publik = sedang dipelajari musuh. Rate limit + monitor pola query + watermark.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: verifier artefak & skor risiko rantai pasok",
      prose: [
        "Kita otomatiskan kebijakan langkah 4 sebagai fungsi `verifikasi`: tiap artefak punya atribut sumber, tanda tangan, format, dan skor kerentanan dependensi. Aturannya berlapis: (1) format berbahaya (pickle/joblib/h5) → TOLAK, apapun yang lain; (2) tanpa tanda tangan → TOLAK (provenance tak terbukti); (3) sumber hub publik + lolos 1–2 → TERIMA-SANDBOX (boleh dipakai, tapi dimuat terisolasi + scan ulang); (4) selain itu → TERIMA.",
        "Lalu hitung skor risiko tiap artefak: format berbahaya +40, tanpa tanda tangan +30, sumber publik +15, dan setengah skor dependensi bila di atas 20. Skor total rantai = jumlah semua skor. Angka ini bukan ramalan — ia prioritas: artefak skor tertinggi diperbaiki duluan.",
        "Cara membaca output: tiap baris `nama: VERDICT (skor=N) — alasan`. Interpretasi: TOLAK = jangan sentuh sebelum masalahnya diperbaiki; TERIMA-SANDBOX = boleh jalan terisolasi; skor tertinggi = antrean perbaikan pertama.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `verifikasi(a)` → (verdict, alasan) sesuai 4 aturan berlapis" },
        { id: "t2", text: "Implementasikan `skor_artefak(a)` sesuai rumus skor risiko" },
        { id: "t3", text: "Jalankan; baca verdict tiap artefak + skor total rantai" },
      ],
      expected: "TOLAK=2, TERIMA=2, SANDBOX=1 · skor total=206 · artefak terburuk: nlp-emotion-99 (107)",
      formula: String.raw`S = 40\cdot B + 30\cdot T + 15\cdot P + \left\lfloor \frac{D}{2}\right\rfloor \cdot [D > 20]`,
      formulaNote: "S = skor risiko satu artefak; B = 1 bila format berbahaya (pickle/joblib/h5), 0 bila aman; T = 1 bila tanpa tanda tangan; P = 1 bila sumber hub publik; D = skor kerentanan dependensi (0–100), suku terakhir hanya dihitung bila D > 20. Skor total rantai = ΣS seluruh artefak — dipakai untuk memprioritaskan perbaikan, bukan sebagai ramalan.",
      note: {
        title: "💡 Intuisi: verifier seperti petugas bea cukai",
        body: "Setiap paket (artefak) diperiksa: dokumen (tanda tangan) ada? Isinya barang terlarang (format berbahaya)? Asal negara berisiko (hub publik)? Yang lolos tanpa masalah lewat jalur hijau (TERIMA); yang asal-usulnya meragukan masuk jalur merah — dibuka dan diperiksa di ruang khusus (SANDBOX). Petugas tidak menebak isi paket; ia mengikuti daftar periksa.",
      },
      hints: [
        "verifikasi: cek format dulu (paling fatal), lalu tanda tangan, lalu sumber. Return tuple (verdict, alasan).",
        "skor_artefak: jumlahkan empat suku; suku keempat = a['dep'] // 2 hanya bila a['dep'] > 20.",
        "Driver di bawah menghitung n_ditolak/n_diterima/n_sandbox dan skor_total dari hasil fungsimu.",
      ],
      code: {
        starter: `ARTEFAK = [
    {"nama": "fraud-xgb-v4",   "sumber": "internal-ci",       "ttd": True,  "format": "onnx",        "dep": 5},
    {"nama": "nlp-emotion-99", "sumber": "hub-publik",        "ttd": False, "format": "pickle",      "dep": 45},
    {"nama": "vision-resnet50","sumber": "hub-terverifikasi", "ttd": True,  "format": "safetensors", "dep": 25},
    {"nama": "churn-gbm-q3",   "sumber": "hub-publik",        "ttd": True,  "format": "joblib",      "dep": 10},
    {"nama": "kyc-ocr-id",     "sumber": "hub-publik",        "ttd": True,  "format": "onnx",        "dep": 35},
]
BERBAHAYA = {"pickle", "joblib", "h5"}

def verifikasi(a):
    # TULIS KODEMU: return (verdict, alasan)

def skor_artefak(a):
    # TULIS KODEMU: return skor risiko (int)

# --- driver ---
n_ditolak = n_diterima = n_sandbox = 0
skor_total = 0
terburuk = ("", -1)
for a in ARTEFAK:
    verdict, alasan = verifikasi(a)
    s = skor_artefak(a)
    skor_total += s
    if s > terburuk[1]: terburuk = (a["nama"], s)
    if verdict == "TOLAK": n_ditolak += 1
    elif verdict == "TERIMA-SANDBOX": n_sandbox += 1
    else: n_diterima += 1
    print(f"{a['nama']}: {verdict} (skor={s}) - {alasan}")
print(f"Ringkasan: TOLAK={n_ditolak}, TERIMA={n_diterima}, SANDBOX={n_sandbox}, skor total={skor_total}")
print(f"Artefak terburuk: {terburuk[0]} ({terburuk[1]})")`,
        lockLines: 9,
        solution: `ARTEFAK = [
    {"nama": "fraud-xgb-v4",   "sumber": "internal-ci",       "ttd": True,  "format": "onnx",        "dep": 5},
    {"nama": "nlp-emotion-99", "sumber": "hub-publik",        "ttd": False, "format": "pickle",      "dep": 45},
    {"nama": "vision-resnet50","sumber": "hub-terverifikasi", "ttd": True,  "format": "safetensors", "dep": 25},
    {"nama": "churn-gbm-q3",   "sumber": "hub-publik",        "ttd": True,  "format": "joblib",      "dep": 10},
    {"nama": "kyc-ocr-id",     "sumber": "hub-publik",        "ttd": True,  "format": "onnx",        "dep": 35},
]
BERBAHAYA = {"pickle", "joblib", "h5"}

def verifikasi(a):
    # TULIS KODEMU: return (verdict, alasan)
    if a["format"] in BERBAHAYA:
        return ("TOLAK", "format " + a["format"] + " mengeksekusi kode saat dimuat")
    if not a["ttd"]:
        return ("TOLAK", "tanpa tanda tangan: provenance tidak terbukti")
    if a["sumber"] == "hub-publik":
        return ("TERIMA-SANDBOX", "sumber publik: muat terisolasi + scan ulang")
    return ("TERIMA", "rantai pasok terverifikasi")

def skor_artefak(a):
    # TULIS KODEMU: return skor risiko (int)
    s = 0
    if a["format"] in BERBAHAYA: s += 40
    if not a["ttd"]: s += 30
    if a["sumber"] == "hub-publik": s += 15
    if a["dep"] > 20: s += a["dep"] // 2
    return s

# --- driver ---
n_ditolak = n_diterima = n_sandbox = 0
skor_total = 0
terburuk = ("", -1)
for a in ARTEFAK:
    verdict, alasan = verifikasi(a)
    s = skor_artefak(a)
    skor_total += s
    if s > terburuk[1]: terburuk = (a["nama"], s)
    if verdict == "TOLAK": n_ditolak += 1
    elif verdict == "TERIMA-SANDBOX": n_sandbox += 1
    else: n_diterima += 1
    print(f"{a['nama']}: {verdict} (skor={s}) - {alasan}")
print(f"Ringkasan: TOLAK={n_ditolak}, TERIMA={n_diterima}, SANDBOX={n_sandbox}, skor total={skor_total}")
print(f"Artefak terburuk: {terburuk[0]} ({terburuk[1]})")`,
        checks: [
          { kind: "defined", task: "t1", name: "verifikasi", label: "Fungsi verifikasi ada", msg: "Definisikan fungsi verifikasi(a) yang me-return (verdict, alasan)." },
          { kind: "defined", task: "t2", name: "skor_artefak", label: "Fungsi skor_artefak ada", msg: "Definisikan fungsi skor_artefak(a) yang me-return skor int." },
          { kind: "equal", task: "t3", name: "n_ditolak", value: 2, label: "2 artefak ditolak", msg: "nlp-emotion-99 (pickle) dan churn-gbm-q3 (joblib) harus TOLAK." },
          { kind: "equal", task: "t3", name: "n_diterima", value: 2, label: "2 artefak diterima", msg: "fraud-xgb-v4 dan vision-resnet50 harus TERIMA." },
          { kind: "equal", task: "t3", name: "n_sandbox", value: 1, label: "1 artefak sandbox", msg: "kyc-ocr-id (hub publik, bertanda tangan, format aman) = TERIMA-SANDBOX." },
          { kind: "equal", task: "t3", name: "skor_total", value: 206, label: "Skor total = 206", msg: "0 + 107 + 12 + 55 + 32 = 206. Cek tiap suku rumus." },
          { kind: "stdout_matches", task: "t3", pattern: "nlp-emotion-99: TOLAK \\(skor=107\\)", label: "Terburuk teridentifikasi", msg: "nlp-emotion-99 harus TOLAK dengan skor 107 (40+30+15+22)." },
          { kind: "stdout_matches", task: "t3", pattern: "kyc-ocr-id: TERIMA-SANDBOX \\(skor=32\\)", label: "Sandbox teridentifikasi", msg: "kyc-ocr-id harus TERIMA-SANDBOX dengan skor 32 (15+17)." },
        ],
      },
      reference: "Aturan berlapis: format → tanda tangan → sumber. Skor = 40B + 30T + 15P + dep//2 (bila dep>20).",
    },
    {
      id: "pertahanan",
      eyebrow: "Langkah 8 · Pertahanan",
      title: "Pertahanan berlapis: tidak ada satu kunci untuk semua pintu",
      prose: [
        "Tidak ada satu kontrol yang menutup semua vektor — pertahanannya berlapis, satu lapisan per tahap. Di data: provenance + validasi distribusi + uji backdoor. Di artefak: tanda tangan & provenance (siapa membangun, dari commit & data apa — konsep SLSA), SBOM (daftar semua dependensi), dan scanning otomatis di CI yang menolak format berbahaya dan CVE kritis.",
        "Di pipeline: secrets manager sebagai satu-satunya sumber kredensial, pre-commit hook anti-secret, dan rotasi terjadwal. Di serving: autentikasi + rate limit + kuota per tenant, monitoring pola query, dan human review untuk keputusan berdampak tinggi. Ditambah satu lapisan lintas tahap: sandbox — artefak tak dikenal dimuat di container terisolasi tanpa akses jaringan dan tanpa secret ter-mount, baru dipromosikan setelah lolos scan.",
        "Prinsip ekonominya: pasang pertahanan termurah yang menutup vektor termahal DULU. Menolak format berbahaya di CI = 1 hari kerja, menutup seluruh kelas serangan pickle. Dibanding insiden Rp118 jt di mini-case, ROI-nya tidak perlu dihitung dua kali.",
        "💡 Intuisi: pertahanan berlapis seperti keamanan bandara — bukan satu pintu baja, melainkan rangkaian: tiket (autentikasi), X-ray bagasi (scanning artefak), daftar penumpang (provenance/SBOM), area steril (sandbox), dan petugas yang memperhatikan perilaku mencurigakan (monitoring). Satu lapisan lolos, lapisan berikut masih menangkap.",
      ],
      figure: {
        svg: RANTAI_SVG,
        alt: "Diagram batang jumlah vektor serangan per tahap rantai pasok ML.",
        caption: "Cara membaca: tiap batang = satu tahap rantai pasok; panjang batang = jumlah vektor serangan yang dibahas di lesson ini. Interpretasi: tahap artefak paling padat (4 vektor: pickle, typosquatting, dependensi, base image) — di sinilah scanning + tanda tangan memberi hasil terbesar per upaya. Serving (3) butuh kontrol runtime; data & pipeline (2) butuh disiplin provenance & secrets.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Satu pertahanan kuat (mis. firewall canggih) sudah cukup'",
        type: "pitfall",
        body: "Satu tembok tebal tidak menutup pintu belakang, jendela, dan atap. Extraction dilakukan tamu sah ber-API-key; poisoning masuk lewat data 'resmi'; pickle berbahaya diunduh insinyur sendiri. Tiap vektor butuh kontrolnya sendiri — defense in depth bukan paranoia, melainkan pengakuan bahwa penyerang memilih jalur termudah, bukan yang kamu perkuat.",
      },
      reference: "Satu lapisan per tahap + sandbox lintas tahap. Termurah-dulu untuk vektor termahal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Ancaman apa → pertahanan apa",
      prose: [
        "**Skenario 1 — Menemukan model bagus di hub publik tanpa tanda tangan.** → Jangan di-load dulu: cari alternatif bertanda tangan dari penerbit resmi; bila terpaksa, scan + muat di sandbox terisolasi, verifikasi perilaku sebelum promosi.",
        "**Skenario 2 — API key terlanjur ter-commit ke repo.** → Anggap bocor: rotasi key SEKARANG (jangan tunggu), lalu bersihkan history dan pasang pre-commit hook. Menghapus file tanpa rotasi = mengunci pintu yang kuncinya sudah disalin.",
        "**Skenario 3 — Endpoint publik menerima input bebas.** → Autentikasi + rate limit + kuota per tenant SEKARANG; tambah monitoring pola query (deteksi extraction) dan validasi input. Tagihan komputasi tanpa kuota = donasi untuk penyerang.",
        "**Skenario 4 — Base image & dependensi 2 tahun tidak di-update.** → Rebuild dari base image terbaru, pin versi + hash, generate SBOM, dan jadwalkan scan CVE otomatis di CI. Jangan menunggu 'ada waktu luang' — waktu luang tidak pernah datang, CVE datang duluan.",
        "**Skenario 5 — Vendor mengirim model .pkl via email.** → Tolak formatnya, bukan vendornya: minta ulang dalam format aman (ONNX/Safetensors) + tanda tangan + provenance. Kebijakan format adalah filter termurah di seluruh rantai.",
        "Aturan praktis 10 detik: 'bisakah saya membuktikan dari mana ini berasal, dan apa yang terjadi jika ia jahat?' Tidak bisa jawab keduanya = jangan masukkan ke production.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: tanya dua hal sebelum percaya",
        body: "Asal-usul (provenance: siapa membuat, dari apa) dan blast radius (jika ini jahat, seberapa parah?). Artefak internal bertanda tangan: asal jelas, risiko kecil → TERIMA. Model publik tanpa tanda tangan: asal gelap, bisa RCE → TOLAK atau SANDBOX. Dua pertanyaan ini menyelesaikan 80% keputusan keamanan rantai pasok.",
      },
      reference: "Provenance + blast radius = 80% keputusan. Sisanya: lapisan pertahanan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Tagihan model 'gratis': Rp118 juta",
      prose: [
        "Bedah angka insiden langkah 2 (startup logistik, model `sentiment-id-99` berekstensi .pkl dari hub publik). Kerugian terukur: (1) compute terbuang — 40 GPU × Rp45.000/jam × 6 jam sebelum terdeteksi = Rp10,8 jt; (2) respons insiden — 3 engineer × 2 hari × Rp8 jt = Rp48 jt; (3) rotasi kredensial 34 layanan + audit forensik = Rp35 jt; (4) degradasi layanan — fallback manual 2 hari × Rp12 jt = Rp24 jt. Total: Rp117,8 jt ≈ Rp118 jt. Belum termasuk: API key payment gateway yang sempat terbaca (potensi fraud) dan kepercayaan pelanggan.",
        "Biaya pencegahan yang akan menghentikan serangan ini TOTAL: kebijakan CI 'tolak format pickle/joblib' (1 hari kerja ≈ Rp8 jt) + secrets tidak di-mount ke container training/serving (praktik gratis) + scan artefak otomatis (2 minggu ≈ Rp16 jt). Total ≈ Rp24 jt — dan itu melindungi dari SELURUH kelas serangan, bukan cuma insiden ini.",
        "**Pertanyaan:** (1) Apa titik masuk serangan dan mengapa akurasi 99,1% tidak relevan? (2) Dari pertahanan berlapis, mana SATU kontrol termurah yang menghentikan insiden ini sepenuhnya? (3) Mengapa API key ikut bocor padahal 'yang diunduh cuma model'?",
        "**Pembahasan:** (1) Titik masuk = `pickle.load()` mengeksekusi kode dalam file .pkl. Akurasi mengukur kualitas prediksi, bukan keamanan file — metrik yang salah untuk ancaman ini. (2) Kebijakan 'tolak format berbahaya di CI' (±Rp8 jt): file .pkl tidak akan pernah sampai ke environment. Satu baris kebijakan > 3 engineer × 2 hari forensik. (3) Karena kode dalam pickle berjalan dengan HAK AKSES proses yang me-load-nya — termasuk environment variable container. Inilah kenapa sandbox (tanpa secret ter-mount, tanpa jaringan) adalah lapisan wajib untuk artefak tak dikenal: batasi blast radius SEBELUM tahu ia jahat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ini inti risk management untuk ML: risiko = probabilitas × dampak. Probabilitas serangan rantai pasok NAIK (model publik makin populer); dampaknya BESAR (RCE + exfiltrasi secret). Kontrol Rp24 jt terhadap eksposur Rp118 jt+ per insiden = keputusan risk yang mudah. Keamanan ML bukan biaya — ia pengurang eksposur yang bisa dihitung.",
      },
      reference: "Rp118 jt insiden vs Rp24 jt pencegahan. Akurasi ≠ keamanan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Keamanan ML = keamanan rantai pasok: data → artefak → pipeline → serving, tiap tahap punya pintunya.",
        "Pickle/joblib mengeksekusi kode saat dimuat — jangan unpickle file tak terverifikasi.",
        "Popularitas hub ≠ keamanan; yang membuktikan: tanda tangan + provenance + scan.",
        "Secret yang masuk git history = bocor: rotasi dulu, baru bersih-bersih.",
        "Endpoint publik diasumsikan sedang dipelajari musuh: rate limit + monitor pola query.",
        "Pertahanan berlapis, termurah-dulu untuk vektor termahal; sandbox batasi blast radius.",
      ],
      next: { label: "MLOps18 — Platform Engineering untuk ML", href: "/v2/learn/mlops18-platform-engineering" },
      quiz: [
        {
          q: "Mengapa memuat file .pkl dari hub publik berbahaya?",
          options: [
            { text: "File-nya terlalu besar", why: "Ukuran bukan masalah keamanan — isi yang bisa dieksekusi itulah masalahnya." },
            { text: "Pickle menyimpan instruksi membangun objek — termasuk memanggil fungsi — sehingga load() mengeksekusi kode penyerang", why: "Tepat. Deserialisasi pickle = eksekusi. Itu sebabnya kebijakan 'tolak format berbahaya' ada.", correct: true },
            { text: "Akurasi model .pkl selalu rendah", why: "Tidak ada hubungan akurasi-format; model cerita ini 99,1% akurat dan tetap beracun." },
            { text: "Hanya berbahaya bila dibuka di Windows", why: "RCE pickle lintas platform — OS tidak relevan." },
          ],
        },
        {
          q: "Model backdoor 99% akurat di semua pengujian standar. Mengapa pengujian tidak menangkapnya?",
          options: [
            { text: "Pengujiannya kurang banyak", why: "Bukan soal jumlah — soal JENIS. Uji agregat buta terhadap perilaku bersyarat." },
            { text: "Backdoor hanya aktif bila pemicu hadir; metrik agregat tidak menguji perilaku bersyarat itu", why: "Tepat. Yang menangkapnya: slice evaluation, uji pemicu, audit distribusi label — bukan akurasi global.", correct: true },
            { text: "Modelnya terlalu kecil", why: "Ukuran model tidak relevan dengan pertanyaan ini." },
            { text: "Akurasi 99% pasti hasil curang", why: "Akurasi tinggi bisa sah; masalahnya metriknya tidak menguji perilaku pemicu." },
          ],
        },
        {
          q: "API key tidak sengaja ter-push ke repo publik. Tindakan pertama yang benar?",
          options: [
            { text: "Hapus file dari repo secepatnya", why: "Git history tetap menyimpan; bot scraper sudah mengarsipkan dalam hitungan menit." },
            { text: "Rotasi key yang bocor SEKARANG, lalu bersihkan history + pasang pre-commit hook", why: "Tepat. Urutan: matikan akses key lama dulu (rotasi), baru bersih-bersih dan cegah terulang.", correct: true },
            { text: "Ganti repo menjadi privat", why: "Salinan yang sudah diambil scraper tidak terpengaruh status privat." },
            { text: "Tunggu — mungkin tidak ada yang melihat", why: "Bot memindai pola key otomatis; 'mungkin' bukan strategi keamanan." },
          ],
        },
        {
          q: "Artefak: sumber hub-publik, bertanda tangan, format onnx, dep=35. Verdict menurut aturan lab?",
          options: [
            { text: "TOLAK — sumber publik selalu ditolak", why: "Aturan lab: sumber publik + ttd + format aman = TERIMA-SANDBOX, bukan TOLAK." },
            { text: "TERIMA-SANDBOX — boleh dipakai terisolasi + scan ulang", why: "Tepat: lolos format & tanda tangan, tetapi sumber publik → isolasi sebagai lapisan tambahan.", correct: true },
            { text: "TERIMA — tanda tangan cukup", why: "Tanda tangan membuktikan asal, bukan keamanan isi; sumber publik tetap butuh sandbox." },
            { text: "TOLAK — dep=35 terlalu tinggi", why: "dep hanya menambah skor risiko, tidak mengubah verdict dalam aturan ini." },
          ],
        },
        {
          q: "Kompetitor meniru model API-mu dengan 2 juta query sistematis. Kontrol paling tepat?",
          options: [
            { text: "Firewall yang lebih tebal", why: "Penyerang adalah 'tamu sah' ber-API-key; firewall tidak melihat pola query." },
            { text: "Rate limit + kuota per tenant + monitoring pola query anomali", why: "Tepat. Extraction butuh volume & pola sistematis — ketiganya mematahkan ekonomi serangan (Rp30 jt menjadi tidak feasible).", correct: true },
            { text: "Mematikan endpoint", why: "Membunuh bisnis untuk menyelamatkan model — bukan solusi." },
            { text: "Mengganti nama endpoint", why: "Security by obscurity; pola query tetap terdeteksi penyerang dalam hitungan jam." },
          ],
        },
        {
          q: "Budget keamanan terbatas. Investasi pertama terbaik menurut lesson ini?",
          options: [
            { text: "Platform SIEM termahal", why: "Tools tanpa kebijakan dasar = mahal dan buta terhadap vektor spesifik ML." },
            { text: "Kebijakan CI 'tolak format berbahaya' + secrets manager + pre-commit hook", why: "Tepat: murah (±Rp24 jt), menutup seluruh kelas serangan (pickle RCE, secret bocor) — termurah-dulu untuk vektor termahal.", correct: true },
            { text: "Menyewa tim red-team penuh waktu", why: "Berharga nanti; tetapi fondasi kebijakan harus ada dulu agar temuan red-team bisa ditindaklanjuti." },
            { text: "Asuransi cyber", why: "Asuransi mentransfer risiko finansial, tidak mencegah insiden — dan premi naik bila kontrol dasar absen." },
          ],
        },
      ],
    },
  ],
};
