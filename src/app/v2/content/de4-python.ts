import type { V2Lesson } from "../lib/types";

// Retry tanpa backoff vs dengan backoff+jitter: beban puncak.
const RETRY_SVG = `<svg viewBox="0 0 560 220" role="img" aria-label="Retry serentak tanpa backoff menumpuk di satu titik; dengan backoff dan jitter tersebar merata.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="50" y1="20" x2="50" y2="180"/><line x1="50" y1="180" x2="530" y2="180"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="50" y="198" text-anchor="middle">0</text><text x="200" y="198" text-anchor="middle">20 dtk</text><text x="350" y="198" text-anchor="middle">40 dtk</text><text x="500" y="198" text-anchor="middle">60 dtk</text>
<text x="14" y="60">beban</text><text x="14" y="150">rendah</text>
</g>
<g fill="var(--error)" opacity="0.8">
<circle cx="82" cy="60" r="4"/><circle cx="82" cy="68" r="4"/><circle cx="82" cy="76" r="4"/><circle cx="82" cy="84" r="4"/><circle cx="82" cy="92" r="4"/><circle cx="82" cy="100" r="4"/><circle cx="82" cy="108" r="4"/><circle cx="82" cy="116" r="4"/>
</g>
<text x="82" y="140" font-size="11" fill="var(--error)" font-family="var(--font-ui)" text-anchor="middle">50 retry</text>
<text x="82" y="154" font-size="11" fill="var(--error)" font-family="var(--font-ui)" text-anchor="middle">serentak!</text>
<g fill="var(--c2)" opacity="0.8">
<circle cx="120" cy="150" r="4"/><circle cx="170" cy="158" r="4"/><circle cx="215" cy="146" r="4"/><circle cx="260" cy="160" r="4"/><circle cx="310" cy="152" r="4"/><circle cx="360" cy="156" r="4"/><circle cx="410" cy="150" r="4"/><circle cx="460" cy="158" r="4"/>
</g>
<text x="300" y="140" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">backoff + jitter: tersebar</text>
<text x="300" y="40" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">tanpa backoff = bunuh diri massal ke API yang sekarat</text>
</svg>`;

export const de4: V2Lesson = {
  slug: "de4-python",
  track: "Data Engineer",
  module: "Fondasi Pipeline",
  title: "DE4 — Python untuk Pipeline",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Job yang sukses 364 hari, gagal di hari ke-365",
      prose: [
        "Pipeline laporan harian 'Bang Toyib' berjalan sempurna 364 hari. Tim sampai lupa ia ada — sampai 29 Februari tiba. Tanggal 'kemarin' dihitung dengan mengurangi 1 dari tanggal hari ini secara string: '2024-03-01' minus 1 hari menjadi... kode itu tidak tahu cara menangani tahun kabisat, dan job mati tepat di hari kabisat.",
        "Itu baru satu dari tiga dosa klasik job pipeline. Dosa kedua: saat API sumber timeout, job langsung retry secepatnya — 50 worker retry bersamaan tiap 5 detik, menenggelamkan API yang sedang sekarat (retry storm). Dosa ketiga: tidak ada log yang jelas, jadi debugging berarti menebak-nebak.",
        "Twist-nya: ketiga dosa ini tidak terlihat di hari pertama. Pipeline selalu terlihat 'sudah jadi' sampai kalender, jaringan, atau skala mengujinya. Lesson ini tentang menulis job Python yang siap diuji waktu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: kode pipeline = skrip analisis yang dijadwalkan",
        type: "pitfall",
        body: "Skrip analisis boleh gagal — kamu ada di depannya. Job pipeline gagal jam 3 pagi saat tidak ada yang melihat. Standarnya beda: harus idempoten (aman di-rerun), punya retry beradab, logging terstruktur, dan gagal dengan cara yang ketahuan (alert), bukan diam-diam.",
      },
      reference: "3 dosa job: tanggal naif, retry brutal, log bisu. Obatnya: idempoten + backoff + logging.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menulis kode pipeline Python yang tahan di produksi.",
        "(1) Menjelaskan kenapa 'skrip analisis yang dijadwalkan' ≠ kode pipeline; (2) Membuat job ETL idempoten (aman di-rerun);",
        "(3) Menerapkan retry beradab (backoff + jitter) dan logging yang bersuara;",
        "(4) Menganalisis retry storm: kapan retry justru memperparah kegagalan.",
      ],
      tasks: [],
    },

    {
      id: "idempoten",
      eyebrow: "Langkah 3 · Idempoten",
      title: "Idempoten: tombol yang aman ditekan dua kali",
      prose: [
        "Fungsi idempoten seperti tombol lift: ditekan sekali atau lima kali, hasilnya sama — lift tetap datang ke lantaimu. Job ETL idempoten: di-rerun 3 kali, tabel hasilnya tetap sama.",
        "Pola kuncinya: tulis berdasarkan kunci (overwrite per tanggal/partisi), bukan append buta. mart['2026-10-13'] = 475000 — dijalankan 10 kali pun nilainya tetap 475000. Sebaliknya append membabi-buta menumpuk duplikat tiap rerun.",
        "💡 Intuisi: di dunia pipeline, rerun BUKAN kejadian luar biasa — ia kejadian rutin (gagal tengah jalan, backfill, perbaikan data). Desain untuk rerun sejak baris pertama, bukan sebagai renungan belakangan.",
        "💡 Intuisi: idempoten + kunci partisi (tanggal) = backfill gratis. Butuh perbaiki data 30 hari ke belakang? Jalankan ulang 30 tanggal; tiap tanggal menimpa dirinya sendiri dengan benar.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'rerun kan jarang, nanti saja dipikirkan'",
        type: "pitfall",
        body: "Orchestrator modern me-rerun task yang gagal secara otomatis (itulah gunanya retry). Job non-idempoten + auto-retry = duplikat yang 'resmi' dan sulit dilacak. Rerun adalah fitur, bukan bug — kodenya harus siap.",
      },
      reference: "Idempoten = f(f(x)) = f(x). Kunci: overwrite per partisi, bukan append.",
    },
    {
      id: "retry-log",
      eyebrow: "Langkah 4 · Retry & log",
      title: "Retry beradab dan log yang bersuara",
      prose: [
        "Ketika API timeout, jangan retry secepatnya — itu seperti mengetuk pintu orang yang sedang pingsan semakin keras. Pakai exponential backoff: tunggu 2, 4, 8, 16 detik... memberi napas bagi layanan yang pulih.",
        "Cara membaca: kiri = 50 retry serentak tanpa backoff: semua panah menumpuk di satu titik waktu (thundering herd). Kanan = dengan backoff + jitter: panah tersebar merata sepanjang garis waktu.",
        "Interpretasi: retry serentak mengubah 'layanan sedang sakit' menjadi 'layanan diserang'. Backoff + jitter mengubah serangan menjadi antrean. Retry yang beradab = menunggu giliran, bukan menyerbu pintu.",
      ],
      formula: String.raw`t_n = b \cdot 2^{n} + \mathrm{jitter}`,
      formulaNote: "t_n = jeda sebelum retry ke-n (detik); b = jeda dasar (mis. 2 detik); n = nomor percobaan (0, 1, 2, ...); jitter = acak kecil agar retry tidak serentak. Tanpa jitter, 50 worker retry bareng = retry storm.",
      figure: {
        svg: RETRY_SVG,
        alt: "Retry serentak tanpa backoff menumpuk di satu titik waktu; dengan backoff dan jitter tersebar merata.",
        caption: "Backoff + jitter mengubah 'serangan' 50 retry serentak menjadi antrean yang sopan.",
      },
      tasks: [],
    },
    {
      id: "lab-idempoten",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: job ETL idempoten + backoff",
      prose: [
        "Lab ini mensimulasikan skenario nyata: job tanggal 13 Oktober gagal di tengah jalan, orchestrator me-rerun. Kamu akan membuktikan job idempoten menghasilkan mart yang benar (3 tanggal unik), sementara versi append menumpuk duplikat.",
        "Cara membaca: bandingkan isi mart setelah rerun — idempoten tetap 3 kunci; append punya list 2 elemen untuk tanggal yang sama. Lalu hitung jadwal backoff: 2, 4, 8, 16 detik = total 30 detik jeda sopan.",
        "Interpretasi: pola overwrite-per-partisi ini dipakai di semua data warehouse modern (partition overwrite). Backoff dipakai di semua client API yang beradab.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `job()`: mode idempoten menimpa `mart[tanggal]`" },
        { id: "t2", text: "Jalankan skenario rerun, cetak `mart` dan `jumlah_tanggal`" },
        { id: "t3", text: "Hitung `delays` backoff (b=2, 4 percobaan) dan `total_tunggu`, lalu cetak" },
      ],
      expected: "mart={'2026-10-13': 475000, '2026-10-12': 410000, '2026-10-11': 388000} | jumlah_tanggal=3 | backoff_delays=[2, 4, 8, 16] | total_tunggu=30 detik",
      note: {
        title: "Sering salah",
        body: "Menghitung backoff sebagai [2, 4, 6, 8] (linear). Exponential berarti dikali 2 setiap percobaan: 2, 4, 8, 16. Linear tidak memberi 'napas' yang cukup bagi layanan yang benar-benar down.",
      },
      hints: [
        "Idempoten: mart[tanggal] = nilai (assignment biasa menimpa).",
        "Skenario rerun: panggil job tanggal 13 dua kali, lalu tanggal 12 dan 11 sekali.",
        "delays = [2 * (2 ** a) for a in range(4)].",
      ],
      code: {
        starter: `# Simulasi data mart (key = tanggal partisi)\nmart = {}\n\n# TULIS KODEMU: job idempoten\ndef job(tanggal, nilai, idempoten=True):\n    if idempoten:\n        \n    else:\n        mart.setdefault(tanggal, []).append(nilai)\n\n# TULIS KODEMU: skenario rerun (tgl 13 dijalankan 2x = gagal lalu rerun)\n\n\nprint(f"mart={mart}")\nprint(f"jumlah_tanggal={len(mart)}")\n\n# TULIS KODEMU: exponential backoff, b=2, 4 percobaan\ndelays = \ntotal_tunggu = sum(delays)\nprint(f"backoff_delays={delays}")\nprint(f"total_tunggu={total_tunggu} detik")`,
        lockLines: 1,
        solution: `# Simulasi data mart (key = tanggal partisi)\nmart = {}\n\n# TULIS KODEMU: job idempoten\ndef job(tanggal, nilai, idempoten=True):\n    if idempoten:\n        mart[tanggal] = nilai\n    else:\n        mart.setdefault(tanggal, []).append(nilai)\n\n# TULIS KODEMU: skenario rerun (tgl 13 dijalankan 2x = gagal lalu rerun)\njob("2026-10-13", 475000, idempoten=True)\njob("2026-10-13", 475000, idempoten=True)  # rerun otomatis\njob("2026-10-12", 410000, idempoten=True)\njob("2026-10-11", 388000, idempoten=True)\n\nprint(f"mart={mart}")\nprint(f"jumlah_tanggal={len(mart)}")\n\n# TULIS KODEMU: exponential backoff, b=2, 4 percobaan\ndelays = [2 * (2 ** a) for a in range(4)]\ntotal_tunggu = sum(delays)\nprint(f"backoff_delays={delays}")\nprint(f"total_tunggu={total_tunggu} detik")`,
        checks: [
          { kind: "equal", task: "t2", name: "mart", value: {"2026-10-13": 475000, "2026-10-12": 410000, "2026-10-11": 388000}, label: "`mart` tetap 3 tanggal unik", msg: "Rerun tidak boleh menambah kunci baru — overwrite, bukan append." },
          { kind: "stdout_matches", task: "t2", pattern: "jumlah_tanggal=3", label: "`print` jumlah_tanggal=3", msg: "3 tanggal unik meski tanggal 13 dijalankan 2x." },
          { kind: "equal", task: "t3", name: "delays", value: [2, 4, 8, 16], label: "`delays` = [2, 4, 8, 16]", msg: "Exponential: 2×2^a untuk a=0..3." },
          { kind: "stdout_matches", task: "t3", pattern: "total_tunggu=30 detik", label: "`print` total_tunggu=30 detik", msg: "2+4+8+16 = 30." },
        ],
      },
      reference: "Overwrite per partisi = idempoten. Backoff: t_n = b × 2^n + jitter.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Idempoten adalah asuransi termurah di data engineering: rerun yang aman mengubah insiden 'data rusak' menjadi 'job diulang'. Setiap tulis ke target harus bisa dijalankan dua kali tanpa efek ganda.",
        "💡 Log yang baik menjawab tiga pertanyaan tanpa membuka kode: APA yang terjadi, DI MANA (tahap/record mana), dan APA yang harus dilakukan. Log yang hanya bilang 'error' = alarm tanpa alamat.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tulis job seolah tombol run akan ditekan dua kali",
        body: "Setiap job data akan di-run ulang — karena gagal di tengah, karena datanya telat, karena seseorang panik jam 2 pagi. Pertanyaannya bukan \"apakah akan di-rerun\", melainkan \"apakah aman saat di-rerun\". Heuristik desainnya: sebelum menulis satu baris transformasi, jawab dulu \"bagaimana job ini menimpa, bukan menumpuk\" — pola standarnya partisi tanggal yang di-overwrite utuh, bukan append. Untuk retry, aturan praktisnya: exponential backoff dengan jitter — mulai 2 detik, kali dua tiap percobaan, tambah acak sekitar 50 persen, maksimal 5 percobaan. Jitter bukan hiasan: tanpa itu, 50 worker yang gagal bersamaan akan retry bersamaan dan menenggelamkan kembali API yang baru pulih — itulah retry storm, dan lesson ini menunjukkannya dengan angka. Bedakan juga mana yang boleh di-retry: timeout dan 5xx boleh; 4xx dan error data jangan — me-retry data yang salah hanya mengulang kesalahan lebih cepat. Terakhir soal log: setiap baris log kegagalan wajib menjawab tiga hal — record mana (id-nya), tahap mana, dan apa yang harus dilakukan operator. Log yang hanya menulis \"error\" adalah alarm kebakaran tanpa alamat gedung.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: strategi kegagalan",
      prose: [
        "Skenario 1 — Task gagal karena timeout sesekali. Kondisi: API sumber kadang lambat. Keputusan: retry 3x dengan backoff + jitter. Alasan: transient, akan pulih sendiri.",
        "Skenario 2 — Task gagal karena data rusak (skema tak dikenal). Kondisi: retry tidak akan memperbaiki. Keputusan: gagal cepat (fail fast) + alert + karantina baris. Alasan: retry 100x data rusak tetap rusak; yang dibutuhkan manusia.",
        "Skenario 3 — Job setengah jalan lalu mati. Kondisi: 10 juta baris, mati di baris 6 juta. Keputusan: checkpoint/progress tracking — lanjut dari terakhir, bukan dari awal. Alasan: hemat biaya dan waktu; idempoten membuat lanjutan aman.",
        "Skenario 4 — Gagal diam-diam (data kosong tapi sukses). Kondisi: exit code 0, tabel kosong. Keputusan: quality gate pasca-job (cek jumlah baris > 0). Alasan: 'sukses palsu' lebih berbahaya dari gagal berisik.",
        "Aturan praktis 10 detik: bedakan gagal transient (retry) vs gagal permanen (alert) vs sukses palsu (quality gate). Ketiganya butuh respons berbeda.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Retry tanpa batas ('while True'). Jika penyebabnya permanen (kredensial salah, tabel dihapus), retry abadi = tagihan abadi + log abadi. Selalu batasi: maksimal N percobaan, lalu menyerah dengan alert yang jelas.",
      },
      reference: "Transient → retry. Permanen → fail fast + alert. Sukses palsu → quality gate.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: anatomi retry storm",
      prose: [
        "Malam promo 10.10: API pembayaran tersendat. 50 worker pipeline masing-masing retry. Tanpa backoff, semua retry tiap 5 detik: 50 retry menabrak API yang sekarat dalam 5 detik pertama — seperti 50 orang mendorong pintu darurat yang macet.",
        "Dengan backoff + jitter (acak 1–60 detik, seed 42), retry tersebar. Hitung: berapa retry dalam 5 detik pertama pada masing-masing strategi? Berapa yang 'diselamatkan' dari tabrakan?",
        "Interpretasi: angka reduksi ini adalah alasan kenapa library HTTP modern punya backoff bawaan — dan kenapa men-disable-nya adalah dosa.",
        "Angka konkretnya: tanpa backoff, 50 retry menabrak API dalam 5 detik pertama = 10 tabrakan/detik pada layanan yang latency-nya sudah 8 detik (normal 200ms). Dengan backoff + jitter (seed 42), hanya 5 retry dalam 5 detik pertama — 90% tabrakan hilang. Inilah beda 'API pulih dalam 2 menit' vs 'API mati total 20 menit karena diserbu'.",
      ],
      tasks: [
        { id: "t1", text: "Bangun list `tanpa` (50 × jeda 5 dtk) dan `dengan` (50 jeda acak 1–60, seed 42, urutkan)" },
        { id: "t2", text: "Hitung `puncak_tanpa` dan `puncak_dengan`: retry dengan jeda ≤ 5 detik" },
        { id: "t3", text: "Hitung `reduksi` dan cetak ketiganya" },
      ],
      expected: "puncak_tanpa_backoff=50 retry/5dtk | puncak_dengan_backoff=5 retry/5dtk | reduksi=45",
      hints: [
        "random.seed(42) dulu agar deterministik.",
        "dengan = sorted([random.uniform(1, 60) for _ in range(50)]).",
        "puncak = sum(1 for d in daftar if d <= 5).",
      ],
      code: {
        starter: `import random\nrandom.seed(42)  # deterministik\n\n# TULIS KODEMU: dua strategi retry 50 worker\ntanpa = \ndengan = \n\n# TULIS KODEMU: hitung tabrakan di 5 detik pertama\npuncak_tanpa = \npuncak_dengan = \nreduksi = puncak_tanpa - puncak_dengan\n\nprint(f"puncak_tanpa_backoff={puncak_tanpa} retry/5dtk")\nprint(f"puncak_dengan_backoff={puncak_dengan} retry/5dtk")\nprint(f"reduksi={reduksi}")`,
        lockLines: 2,
        solution: `import random\nrandom.seed(42)  # deterministik\n\n# TULIS KODEMU: dua strategi retry 50 worker\ntanpa = [5] * 50\ndengan = sorted([random.uniform(1, 60) for _ in range(50)])\n\n# TULIS KODEMU: hitung tabrakan di 5 detik pertama\npuncak_tanpa = sum(1 for d in tanpa if d <= 5)\npuncak_dengan = sum(1 for d in dengan if d <= 5)\nreduksi = puncak_tanpa - puncak_dengan\n\nprint(f"puncak_tanpa_backoff={puncak_tanpa} retry/5dtk")\nprint(f"puncak_dengan_backoff={puncak_dengan} retry/5dtk")\nprint(f"reduksi={reduksi}")`,
        checks: [
          { kind: "equal", task: "t2", name: "puncak_tanpa", value: 50, tol: 0, label: "`puncak_tanpa` = 50", msg: "Tanpa backoff semua 50 menabrak dalam 5 detik pertama." },
          { kind: "equal", task: "t2", name: "puncak_dengan", value: 5, tol: 0, label: "`puncak_dengan` = 5", msg: "Dengan jitter (seed 42), hanya 5 yang jatuh di ≤5 detik." },
          { kind: "equal", task: "t3", name: "reduksi", value: 45, tol: 0, label: "`reduksi` = 45", msg: "45 retry diselamatkan dari tabrakan." },
        ],
      },
      reference: "Jitter = acaknya penyelamat. Seed agar eksperimen bisa diulang.",
    },
    {
      id: "packaging-typing",
      eyebrow: "Langkah 9 · Packaging & typing",
      title: "Packaging & typing: dari skrip longgar ke pipeline yang bisa dipasang",
      prose: [
        "Job yang jalan di laptop analis belum tentu jalan di server produksi. Di laptop, `python kirim_laporan.py` berhasil karena semua file kebetulan ada di folder yang sama dan `pandas` yang kebetulan terinstal. Di produksi, job dieksekusi container atau orchestrator yang steril: tidak ada folder Downloads, tidak ada 'kebetulan'. Packaging menutup jurang ini.",
        "Packaging artinya menyusun kode sebagai package Python, bukan tumpukan skrip lepas. Strukturnya: folder `etl_pipeline/` berisi `__init__.py`, modul per tahap (`extract.py`, `transform.py`, `load.py`), dan `pyproject.toml` yang mengunci dependensi. Import menjadi absolut dan jelas: `from etl_pipeline.transform import bersihkan_nilai` — bukan `from utils2_final import ...`.",
        "Kenapa produksi butuh ini? Empat alasan: (1) package bisa di-install di mana saja (`pip install .`) — container, VM, laptop rekan; (2) versi dependensi terkunci — pandas 2.1 di dev = pandas 2.1 di prod, bukan 'yang kebetulan ada'; (3) tiap modul bisa di-test dan di-import terpisah; (4) deploy = menyalin satu package, bukan berburu 17 file skrip.",
        "💡 Intuisi: skrip = resep yang cuma bisa dimasak di dapur sendiri; package = resep yang bisa dimasak di dapur mana pun. Job kecil hari ini adalah job kritis enam bulan lagi — pasang fondasinya sekarang.",
        "Typing adalah pasangannya. Type hints di fungsi transformasi — `def bersihkan_nilai(raw: str | None) -> float | None:` — tidak mengubah runtime sama sekali (interpreter mengabaikannya), tetapi memberi tiga hal: dokumentasi yang tidak basi, editor yang melengkapi dan memperingatkan, dan type checker (mypy) yang menangkap salah tipe SEBELUM job jalan jam 3 pagi.",
        "Lengkapi hints dengan validasi ringan di gerbang fungsi: guard clause untuk kasus kosong (`if raw is None: return None`) dan cek skema ringan ('kolom wajib ada, tipe benar') di awal transformasi. Polanya: fail fast di gerbang, bukan meledak di tengah. Error data yang ditangkap di baris pertama fungsi jauh lebih murah daripada dua jam compute yang menghasilkan sampah.",
        "💡 Intuisi: type hints = kontrak yang dibaca manusia dan dicek mesin. Validasi ringan = satpam di pintu, bukan pemadam kebakaran di lantai 10.",
      ],
      tasks: [
        { id: "t1", text: "Pilih 2 fungsi transformasi di pipeline-mu; tulis ulang signature-nya dengan type hints (`str | None -> float | None`)" },
        { id: "t2", text: "Tambahkan 1 guard clause (fail fast) di gerbang tiap fungsi" },
      ],
      note: {
        title: "🚨 Mitos: type hints bikin lambat & packaging itu overkill",
        type: "pitfall",
        body: "Hints dihapus saat runtime — nol biaya performa. Dan 'job kecil' adalah tahap awal semua job kritis; `pyproject.toml` 10 baris hari ini mencegah 'works on my laptop' enam bulan lagi. Satu larangan keras: jangan `from utils import *` di package — import bintang menyembunyikan asal fungsi dan mengundang tabrakan nama antar modul.",
      },
      reference: "Package = bisa di-install di mana saja. Typing + validasi ringan = salah tipe ketahuan di gerbang.",
    },
    {
      id: "testing-concurrency",
      eyebrow: "Langkah 10 · Testing & concurrency",
      title: "Testing & concurrency: pytest untuk transformasi, thread untuk I/O",
      prose: [
        "Transformasi adalah bagian pipeline yang paling murah di-test dan paling mahal kalau salah. Ia biasanya pure function — input masuk, output keluar, tanpa I/O — sehingga test-nya cepat, deterministik, dan tidak butuh database.",
        "pytest memformalkan kebiasaan ini: file `test_transform.py`, fungsi bernama `test_...`, `assert` polos. Fixture (`@pytest.fixture`) = data contoh yang dipakai ulang antar test, mis. satu DataFrame kotor untuk 10 test. Lab di bawah meniru polanya dengan mini-runner: daftar kasus (input, ekspektasi), jalankan satu per satu, hitung lolos vs gagal.",
        "Spesifikasi fungsi lab — `bersihkan_nilai(raw: str | None) -> float | None`: `None` → `None`; buang teks 'Rp' dan spasi; string kosong → `None`; hapus '.' (pemisah ribuan), ubah ',' jadi '.' (desimal); `float(...)`; gagal parse → `None`. Contoh: 'Rp 1.250.000' → 1250000.0, '12,5' → 12.5, 'abc' → None.",
        "💡 Intuisi: test = spesifikasi yang bisa dieksekusi. Saat skema sumber berubah diam-diam, test merah duluan — bukan pipeline yang meledak jam 3 pagi.",
        "Paruh kedua: concurrency. Pipeline modern menghabiskan waktunya MENUNGGU — API, database, file. Tiga senjata: (1) Thread — untuk I/O-bound. GIL dilepas saat menunggu I/O, jadi 5 thread menunggu 5 API ≈ waktu 1 API. (2) Multiprocessing — untuk CPU-bound (transformasi pandas berat). Tiap proses punya GIL sendiri, tetapi mahal: memori dan startup berlipat. (3) async/await — untuk ribuan koneksi ringan dalam satu thread.",
        "Dua jebakan klasik: race condition (counter bersama ditulis dua thread tanpa lock → angka hilang) dan 'thread untuk CPU-bound'. Delapan thread mengerjakan pandas berat ≈ satu thread — GIL tidak bisa dinegosiasi. Aturan praktisnya: menunggu → thread/async; menghitung → proses/vektorisasi.",
        "💡 Intuisi: concurrency bukan soal 'lebih cepat' — soal 'lebih sedikit menganggur'. Ukur dulu di mana waktunya habis (profiling), baru pilih senjatanya.",
        "Lab ini dua babak: tulis 6 kasus uji untuk `bersihkan_nilai` dan jalankan mini-runner; lalu jalankan simulasi 5 'panggilan API' (sleep 0.2 detik) secara serial vs thread pool, dan amati berapa yang benar-benar berjalan serentak.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `bersihkan_nilai` sesuai spesifikasi di atas" },
        { id: "t2", text: "Tulis 6 kasus uji (input, ekspektasi) di `kasus`, termasuk `None` dan string rusak" },
        { id: "t3", text: "Jalankan simulasi serial vs thread; catat `maks_serentak` dan waktu keduanya" },
      ],
      expected: "lolos=6 dari 6 | gagal=0 | serial: ~1.0s maks_serentak=1 | thread: ~0.2s maks_serentak=5 | hasil_sama=True",
      note: {
        title: "🚨 Mitos: tambah thread = tambah cepat untuk semua",
        type: "pitfall",
        body: "Thread hanya menang saat waktunya dihabiskan menunggu (I/O). Untuk komputasi berat (pandas, loop Python murni), GIL membuat 8 thread ≈ 1 thread — yang dibutuhkan multiprocessing atau vektorisasi. Salah pilih = kode lebih rumit tanpa lebih cepat.",
      },
      hints: [
        "Urutan bersih-bersih: buang 'Rp'/spasi → cek kosong → hapus '.' → ',' jadi '.' → float().",
        "Kasus uji: ('Rp 1.250.000', 1250000.0), ('450000', 450000.0), ('12,5', 12.5), ('', None), (None, None), ('abc', None).",
        "maks_serentak dicatat dengan lock: naikkan sebelum sleep, turunkan sesudahnya.",
      ],
      code: {
        starter: `# BABAK 1: mini test-runner ala pytest
def bersihkan_nilai(raw):
    # TULIS KODEMU: ikuti spesifikasi di langkah ini
    ...

# TULIS KODEMU: 6 kasus uji (input, ekspektasi)
kasus = [
]

def uji(fungsi, kasus):
    lolos = 0
    gagal = 0
    for raw, ekspektasi in kasus:
        try:
            hasil = fungsi(raw)
            assert hasil == ekspektasi, f"{raw!r} -> {hasil!r}, ekspektasi {ekspektasi!r}"
            lolos += 1
        except Exception as e:
            gagal += 1
            print(f"GAGAL: {e}")
    return lolos, gagal

lolos, gagal = uji(bersihkan_nilai, kasus)
print(f"lolos={lolos} dari {len(kasus)}")
print(f"gagal={gagal}")

# BABAK 2: serial vs thread untuk 5 panggilan I/O
import time
import threading
from concurrent.futures import ThreadPoolExecutor

kunci = threading.Lock()
sedang = 0
maks_serentak = 0

def ambil(i):
    global sedang, maks_serentak
    with kunci:
        sedang += 1
        maks_serentak = max(maks_serentak, sedang)
    time.sleep(0.2)  # simulasi menunggu API
    with kunci:
        sedang -= 1
    return i * i

t0 = time.perf_counter()
hasil_serial = [ambil(i) for i in range(5)]
waktu_serial = time.perf_counter() - t0
print(f"serial: {waktu_serial:.1f}s, maks_serentak={maks_serentak}")

sedang = 0
maks_serentak = 0
t0 = time.perf_counter()
with ThreadPoolExecutor(max_workers=5) as pool:
    hasil_thread = list(pool.map(ambil, range(5)))
waktu_thread = time.perf_counter() - t0
print(f"thread: {waktu_thread:.1f}s, maks_serentak={maks_serentak}")
print(f"hasil_sama={hasil_serial == hasil_thread}")`,
        lockLines: 0,
        solution: `# BABAK 1: mini test-runner ala pytest
def bersihkan_nilai(raw):
    if raw is None:
        return None
    teks = raw.replace("Rp", "").replace(" ", "")
    if teks == "":
        return None
    teks = teks.replace(".", "").replace(",", ".")
    try:
        return float(teks)
    except ValueError:
        return None

kasus = [
    ("Rp 1.250.000", 1250000.0),
    ("450000", 450000.0),
    ("12,5", 12.5),
    ("", None),
    (None, None),
    ("abc", None),
]

def uji(fungsi, kasus):
    lolos = 0
    gagal = 0
    for raw, ekspektasi in kasus:
        try:
            hasil = fungsi(raw)
            assert hasil == ekspektasi, f"{raw!r} -> {hasil!r}, ekspektasi {ekspektasi!r}"
            lolos += 1
        except Exception as e:
            gagal += 1
            print(f"GAGAL: {e}")
    return lolos, gagal

lolos, gagal = uji(bersihkan_nilai, kasus)
print(f"lolos={lolos} dari {len(kasus)}")
print(f"gagal={gagal}")

# BABAK 2: serial vs thread untuk 5 panggilan I/O
import time
import threading
from concurrent.futures import ThreadPoolExecutor

kunci = threading.Lock()
sedang = 0
maks_serentak = 0

def ambil(i):
    global sedang, maks_serentak
    with kunci:
        sedang += 1
        maks_serentak = max(maks_serentak, sedang)
    time.sleep(0.2)  # simulasi menunggu API
    with kunci:
        sedang -= 1
    return i * i

t0 = time.perf_counter()
hasil_serial = [ambil(i) for i in range(5)]
waktu_serial = time.perf_counter() - t0
print(f"serial: {waktu_serial:.1f}s, maks_serentak={maks_serentak}")

sedang = 0
maks_serentak = 0
t0 = time.perf_counter()
with ThreadPoolExecutor(max_workers=5) as pool:
    hasil_thread = list(pool.map(ambil, range(5)))
waktu_thread = time.perf_counter() - t0
print(f"thread: {waktu_thread:.1f}s, maks_serentak={maks_serentak}")
print(f"hasil_sama={hasil_serial == hasil_thread}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lolos", value: 6, label: "`lolos` = 6", msg: "Keenam kasus uji harus lolos — periksa implementasi bersihkan_nilai." },
          { kind: "equal", task: "t2", name: "gagal", value: 0, label: "`gagal` = 0", msg: "Tidak boleh ada kasus yang gagal." },
          { kind: "equal", task: "t3", name: "hasil_serial", value: [0, 1, 4, 9, 16], label: "`hasil_serial` = [0, 1, 4, 9, 16]", msg: "Lima panggilan harus menghasilkan kuadrat 0..4." },
          { kind: "equal", task: "t3", name: "maks_serentak", value: 5, label: "`maks_serentak` thread = 5", msg: "Kelima thread harus benar-benar berjalan serentak saat menunggu I/O." },
          { kind: "stdout_matches", task: "t3", pattern: "hasil_sama=True", label: "`print` hasil_sama=True", msg: "Serial dan thread harus menghasilkan list yang sama." },
        ],
      },
      reference: "Test transformasi = murah & deterministik. I/O-bound → thread; CPU-bound → proses.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang menulis job yang tahan waktu.",
      ],
      tasks: [],
      summary: [
        "Kode pipeline ≠ skrip analisis: harus idempoten, retry beradab, logging terstruktur, gagal dengan alert.",
        "Idempoten = aman di-rerun: overwrite per partisi/tanggal, bukan append buta.",
        "Exponential backoff t_n = b×2^n + jitter; tanpa jitter = retry storm.",
        "Bedakan gagal transient (retry), permanen (fail fast + alert), dan sukses palsu (quality gate).",
        "Retry selalu dibatasi; retry abadi = tagihan abadi.",
      ],
      next: { label: "DE5 — Warehouse vs Lake vs Lakehouse", href: "/v2/learn/de5-storage" },
      quiz: [
        {
          q: "Job ETL di-rerun otomatis setelah gagal di tengah. Versi mana yang aman?",
          options: [
            { text: "Yang append hasil ke tabel tiap run", why: "Berbahaya: rerun menumpuk duplikat — data ganda yang 'resmi'." },
            { text: "Yang menimpa (overwrite) per partisi tanggal", why: "Tepat: idempoten. Rerun 10x pun hasilnya identik.", correct: true },
            { text: "Yang menghapus tabel dulu tiap run", why: "Berisiko: jika run gagal setelah hapus, data hilang total." },
            { text: "Yang menulis ke file baru tiap run", why: "Menumpuk file; downstream bingung mana yang benar." },
          ],
        },
        {
          q: "Fungsi jitter dalam backoff adalah…",
          options: [
            { text: "Mempercepat retry", why: "Jitter tidak mempercepat; ia mengacak." },
            { text: "Mengacak jeda agar banyak worker tidak retry serentak", why: "Tepat: tanpa jitter, 50 worker tetap tabrakan di detik yang sama.", correct: true },
            { text: "Mengurangi jumlah percobaan", why: "Jumlah percobaan diatur max-retries, bukan jitter." },
            { text: "Menghapus log error", why: "Tidak berhubungan dengan log." },
          ],
        },
        {
          q: "API mengembalikan error 'kolom tidak dikenal' (skema berubah). Respons tepat?",
          options: [
            { text: "Retry 100x dengan backoff", why: "Penyebabnya permanen — retry 100x tetap gagal dan hanya membuang biaya." },
            { text: "Fail fast + alert + karantina data", why: "Tepat: butuh manusia memperbaiki mapping, bukan mesin mengulang.", correct: true },
            { text: "Abaikan dan lanjutkan", why: "Paling berbahaya: menghasilkan data bisu yang salah." },
            { text: "Tunggu 1 jam lalu retry sekali", why: "Menunda tanpa memperbaiki; skema tidak sembuh sendiri." },
          ],
        },
        {
          q: "Job sukses (exit 0) tapi tabel hasil kosong. Ini disebut…",
          options: [
            { text: "Sukses palsu — butuh quality gate (cek jumlah baris)", why: "Tepat: exit code tidak menjamin data benar. Gate pasca-job menangkapnya.", correct: true },
            { text: "Retry storm", why: "Itu soal retry serentak, bukan hasil kosong." },
            { text: "Idempoten", why: "Itu sifat aman di-rerun, bukan nama masalah ini." },
            { text: "Backfill", why: "Itu pengisian ulang historis, bukan nama masalah ini." },
          ],
        },
        {
          q: "Jadwal backoff dengan b=3, 3 percobaan (n=0,1,2). Total jeda?",
          options: [
            { text: "9 detik", why: "Itu 3+3+3 (linear), bukan exponential." },
            { text: "18 detik", why: "Itu 3+6+9 — masih linear." },
            { text: "21 detik", why: "Tepat: 3 + 6 + 12 = 21 (3×2^0 + 3×2^1 + 3×2^2).", correct: true },
            { text: "27 detik", why: "Itu 3^3 — bukan rumusnya." },
          ],
        },
        {
          q: "Job ETL sukses 364 hari, gagal di hari ke-365 (29 Feb): 'tanggal kemarin' dihitung manual. Pelajaran desainnya?",
          options: [
            { text: "Tambah try-except di sekitar tanggal", why: "Try-except menyembunyikan bug tanggal, bukan memperbaikinya. 29 Feb akan tetap salah — hanya tidak berteriak." },
            { text: "Jangan hitung tanggal manual — pakai library tanggal + uji batas (edge cases)", why: "Tepat: tanggal adalah edge-case abadi (kabisat, DST, akhir bulan). Library (datetime/pendulum) + test khusus 29-Feb/31→1 adalah pertahanan standar. Kode pipeline harus diuji pada hari-hari 'aneh'.", correct: true },
            { text: "Jalankan job 2x sehari agar aman", why: "Menjalankan bug 2x sehari = bug 2x sehari. Frekuensi tidak memperbaiki logika." },
            { text: "Catat di runbook: 'jangan jalan 29 Feb'", why: "Runbook bukan penampung bug yang diketahui. Bug yang diketahui = bug yang harus diperbaiki." },
          ],
        },
        {
          q: "Job gagal di tengah: 50.000 dari 100.000 baris sudah tertulis. Rerun yang aman mensyaratkan?",
          options: [
            { text: "Hapus semua lalu tulis ulang", why: "Bisa, tetapi 100.000 baris ditulis ulang tiap retry = mahal dan berisiko (jendela tanpa data). Bukan syarat — ini salah satu opsi." },
            { text: "Job idempoten: rerun hanya menulis yang belum/sudah benar tanpa duplikat", why: "Tepat: idempoten = aman ditekan dua kali. Caranya: tulis dengan kunci unik + upsert, atau tulis ke partisi tanggal lalu overwrite partisi. Rerun = operasi rutin, bukan operasi penyelamatan.", correct: true },
            { text: "Jangan pernah rerun", why: "'Jangan rerun' = 50.000 baris hilang selamanya. Kegagalan PASTI terjadi; desain harus mengasumsikannya." },
            { text: "Tulis ke file dulu, baru load", why: "File staging membantu debugging tetapi tidak membuat rerun aman — duplikat tetap terjadi tanpa idempotensi." },
          ],
        },
      ],
    },
  ],
};
