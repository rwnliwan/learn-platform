import type { V2Lesson } from "../lib/types";

// Batang sukses: tanpa retry 75% vs dengan retry 99,5% (HASIL EMPIRIS satu seed simulasi, 199/200) — nilai teoretisnya 98,3% (lihat caption).
const FIG_RETRY = `<svg viewBox="0 0 480 240" role="img" aria-label="Success rate tanpa retry 75 persen vs dengan retry 99,5 persen pada satu seed simulasi (nilai teoretis 98,3 persen).">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="200" x2="460" y2="200"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="110" x2="460" y2="110"/><line x1="44" y1="65" x2="460" y2="65"/><line x1="44" y1="20" x2="460" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="204">0%</text><text x="38" y="159">25%</text><text x="38" y="114">50%</text><text x="38" y="69">75%</text><text x="38" y="24">100%</text></g>
<rect x="120" y="65" width="100" height="135" fill="var(--c4)"/>
<rect x="300" y="20.9" width="100" height="179.1" fill="var(--c1)"/>
<g fill="var(--text)" font-size="13" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="170" y="57">75%</text><text x="350" y="12">99,5%</text></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="170" y="222">tanpa retry</text><text x="350" y="222">dengan retry (3 upaya)</text></g>
<text x="240" y="238" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">200 request simulasi · 25% gagal per upaya · timeout 1.500ms</text>
</svg>`;

export const aie10: V2Lesson = {
  slug: "aie10-deploy",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE10 — Deploy Aplikasi LLM",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-demo",
      eyebrow: "Langkah 1 · Cerita",
      title: "Demo yang lancar, produksi yang macet",
      prose: [
        "Demo chatbot NusaBank ke direksi: mulus, cepat, semua tepuk tangan. Hari pertama produksi: antrean macet. Penyebabnya tiga serangkai — provider LLM lambat di jam sibuk (timeout beruntun), satu request 30 detik menyumbat worker, dan saat provider down 10 menit, aplikasi ikut mati total karena tidak ada rencana cadangan.",
        "Twist-nya: solusinya bukan server yang lebih besar, melainkan desain yang lebih dewasa — timeout + retry dengan backoff, fallback berlapis (model cadangan → cache → jawaban degradasi yang sopan), dan antrean. Setelah itu, provider down 10 menit hanya menjadi 'mode hemat' yang tidak disadari pengguna. Demo menguji kebahagiaan; produksi menguji kedewasaan.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) merancang timeout dan retry yang aman; (2) menghitung kebutuhan kapasitas dengan Hukum Little; (3) merancang fallback berlapis; (4) memilih sync vs streaming vs batch; (5) menghindari retry storm.",
        "🗺️ Isi lesson: Langkah 1 · Cerita demo — Langkah 2 · Timeout dan retry — Langkah 3 · Lab: retry — Langkah 4 · Kapasitas dan Hukum Little — Langkah 5 · Lab: worker — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Langkah 8 · Backend async — Langkah 9 · Auth & multi-tenancy — Checkpoint.",
      ],
      tasks: [],
      reference: "Deploy LLM = timeout + retry + fallback + kapasitas. Demo menguji kebahagiaan; produksi menguji kedewasaan.",
    },
    {
      id: "konsep-timeout",
      eyebrow: "Langkah 2 · Timeout dan retry",
      title: "Timeout: belas kasihan untuk antreanmu",
      prose: [
        "Satu request lambat tanpa timeout menyumbat satu worker selama 30 detik — dalam waktu itu ratusan request lain antre. Timeout (mis. 1,5 detik untuk klasifikasi, lebih longgar untuk generasi panjang) memutus request yang macet agar worker bebas melayani yang lain. Retry kemudian mencoba lagi — maksimal 3 upaya, dengan backoff (tunggu makin lama tiap upaya: 1s, 2s, 4s) agar tidak menghantam provider yang sedang sekarat.",
        "Bahaya retry tanpa backoff: retry storm. Provider lambat → semua client retry serentak → beban berlipat → provider makin lambat → retry lagi. Lingkaran kematian yang dimulai dari niat baik. Backoff + jitter (acak sedikit) memecah keserentakan. Dan retry punya empat batas operasional yang wajib dirancang — bukan sekadar 'coba 3x'. (1) Idempotency key: tiap request membawa kunci unik yang sama di semua upaya retry, sehingga provider yang menerima retry tidak mengeksekusi efek samping dua kali (misal: menagih dua kali, mengirim dua notifikasi) — tanpa ini, retry atas request non-idempotent (POST pembayaran) adalah bug. (2) Klasifikasi error: retry HANYA untuk error retryable (timeout, 429, 5xx sementara); JANGAN retry error non-retryable (400 validasi, 401 auth, prompt rusak) — mengulang kesalahan yang pasti gagal hanya membuang token dan waktu. (3) Retry budget: batas total retry per periode (misal: retry ≤10% dari total request) — bila budget habis, gagalkan cepat (fail fast) daripada membanjiri provider yang sekarat. (4) Batas total waktu (deadline): total waktu semua upaya (misal: 10 detik) — retry yang masing-masing 30 detik tetapi deadline 10 detik tidak pernah mencapai upaya kedua. Empat batas ini yang membedakan retry yang menyelamatkan dari retry yang menumbangkan.",
        "Kepribadian timeout: ia seperti penjaga pintu klub — tegas mengeluarkan yang berlama-lama agar antrean tetap bergerak. Tanpa penjaga, satu orang bisa menyandera seluruh malam.",
        "Matematika timeout — dari cerita. Tanpa timeout: 1 request macet 120 detik menahan 1 worker → 10 macet = 10 worker mati = antrean meledak. Timeout 30 detik: worker bebas dalam 30 detik; retry 2x dengan backoff. Ketersediaan: 75 persen → 98,3 persen secara teori (1 − 0,256³ — kegagalan efektif per upaya 25,6% karena timeout 1.500 ms juga menolak latensi lambat); simulasi satu seed di lab memberi 199/200 = 99,5 persen — hasil empiris itu, bukan teori. Rumus: timeout ≈ p99 latensi normal × 2 (30 detik untuk p99=15 detik). Terlalu pendek (5 detik): membunuh request sehat. Terlalu panjang (300 detik): mati pelan-pelan. p99 × 2 = belas kasihan yang terukur.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Retry sebanyak-banyaknya pasti menaikkan success rate.' Salah. Tanpa backoff dan tanpa batas, retry mengubah gangguan kecil menjadi retry storm yang menumbangkan provider — dan tagihanmu. Retry adalah obat dengan dosis: 3 upaya + backoff eksponensial + jitter.",
      },
      reference: "Timeout membebaskan worker; retry + backoff + jitter menaikkan sukses tanpa membunuh provider.",
    },
    {
      id: "lab-retry",
      eyebrow: "Langkah 3 · Lab retry",
      title: "Lab: dari 75 persen ke 98,3 persen (teori) — 99,5 persen pada satu seed",
      prose: [
        "Simulasi 200 request ke mock provider: 25 persen gagal total per upaya, sisanya berlatensi sekitar 900ms. Timeout 1.500ms memutus yang kelewat lambat. `req_dengan_retry` mencoba hingga 3 upaya. Bandingkan: tanpa retry, sukses = 75 persen; dengan retry, nilai teoretisnya ≈ 98,3 persen — dan lab dengan seed 42 akan menunjukkan 199/200 = 99,5 persen (hasil empiris satu seed; simpan bedanya di kepala). Hitungnya: kegagalan per upaya bukan 25% — mock juga menolak latensi > 1.500 ms, dan P(latensi > 1.500 | sukses) = P(Z > 2,4) ≈ 0,82%, jadi kegagalan efektif per upaya = 25% + 75% × 0,82% ≈ 25,6%; sukses teoretis = 1 − 0,256³ ≈ 98,3% (bukan 1 − 0,25³ = 98,44% yang mengabaikan timeout).",
        "Coba ubah: naikkan TIMEOUT menjadi 3000, jalankan ulang, dan lihat p95 naik (request lambat ikut lolos) sementara sukses hampir sama. Timeout adalah kenop antara latensi dan keberhasilan — tidak ada nilai benar universal.",
      ],
      figure: {
        svg: FIG_RETRY,
        alt: "Success rate tanpa retry 75 persen vs dengan retry 99,5 persen pada satu seed simulasi (nilai teoretis 98,3 persen).",
        caption: "Cara membaca: tinggi batang = proporsi 200 request simulasi yang sukses; kiri = satu upaya, kanan = hingga 3 upaya dengan timeout 1.500ms; sumbu Y 0–100 persen. Interpretasi — bedakan DUA angka: nilai TEORETIS sukses dengan retry ≈ 98,3 persen: kegagalan efektif per upaya ≈ 25,6% (25% gagal total + 0,82% dari yang sukses tertolak timeout 1.500 ms), dilipatgandakan tiga upaya menjadi 0,256³ ≈ 1,68% gagal — bukan 1 − 0,25³ = 98,44% yang mengabaikan timeout. Angka 99,5 persen (199/200) adalah hasil EMPIRIS satu seed simulasi di lab — masih mungkin secara statistik (peluang ≤1 gagal dari 200 request pada p=1,68 persen adalah ≈15 persen), tetapi ia BUKAN hasil pelipatan matematis. Inilah matematika keandalan: kegagalan kecil yang independen bisa dilipatgandakan menjadi kecil sekali — dan hasil satu simulasi selalu dilaporkan bersama nilai teoretisnya.",
      },
      tasks: [
        { id: "t1", text: "Jalankan 200 request (`N`), kumpulkan latensi sukses di `lats`" },
        { id: "t2", text: "Hitung `n_ok` dan `p95` latensi sukses" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "sukses=199/200  p95=1335ms",
      note: {
        title: "💡 Intuisi",
        body: "Retry bekerja karena kegagalan independen: peluang 3 upaya gagal beruntun ≈ 0,256³ ≈ 1,7 persen (0,25³ ≈ 1,6 persen bila timeout diabaikan — angka lengkapnya memakai kegagalan efektif 25,6% per upaya). Tetapi bila penyebabnya SISTEMATIS (prompt rusak, provider down total), retry hanya mengulang kegagalan — kenali bedanya dari pola error di log.",
      },
      hints: [
        "Loop N kali: t = req_dengan_retry(); bila tidak None, masukkan ke lats.",
        "n_ok = len(lats); urutkan lalu ambil persentil 95 seperti lab sebelumnya.",
        "print(f\"sukses={n_ok}/{N}  p95={p95}ms\")",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nimport math, random\nrandom.seed(42)\n\ndef mock_call():\n    # 25% gagal total; sisanya latensi sekitar 900ms\n    r = random.random()\n    if r < 0.25: return None\n    return max(50, int(random.gauss(900, 250)))\n\nTIMEOUT = 1500  # ms\n\ndef req_dengan_retry():\n    for _ in range(3):  # 1 upaya + 2 retry\n        t = mock_call()\n        if t is not None and t <= TIMEOUT:\n            return t\n    return None\n\n# TULIS KODEMU: 200 request, success rate dan p95\nN = 200\nlats = []\nfor _ in range(N):\n    \nn_ok = \nlats.sort()\np95 = \n\nprint(f"sukses={n_ok}/{N}  p95={p95}ms")`,
        lockLines: 20,
        solution: `# DATA SEED — jangan ubah\nimport math, random\nrandom.seed(42)\n\ndef mock_call():\n    # 25% gagal total; sisanya latensi sekitar 900ms\n    r = random.random()\n    if r < 0.25: return None\n    return max(50, int(random.gauss(900, 250)))\n\nTIMEOUT = 1500  # ms\n\ndef req_dengan_retry():\n    for _ in range(3):  # 1 upaya + 2 retry\n        t = mock_call()\n        if t is not None and t <= TIMEOUT:\n            return t\n    return None\n\n# TULIS KODEMU: 200 request, success rate dan p95\nN = 200\nlats = []\nfor _ in range(N):\n    t = req_dengan_retry()\n    if t is not None:\n        lats.append(t)\nn_ok = len(lats)\nlats.sort()\np95 = lats[math.ceil(0.95*len(lats))-1]\n\nprint(f"sukses={n_ok}/{N}  p95={p95}ms")`,
        checks: [
          { kind: "equal", task: "t2", name: "n_ok", value: 199, tol: 1e-9, label: "`n_ok` seharusnya 199", msg: "Dengan seed 42, 199 dari 200 sukses setelah retry." },
          { kind: "equal", task: "t2", name: "p95", value: 1335, tol: 1e-9, label: "`p95` seharusnya 1335", msg: "Persentil 95 latensi sukses = 1335ms." },
          { kind: "stdout_matches", task: "t3", pattern: "sukses=199/200\\s+p95=1335ms", label: "`print` menampilkan keduanya", msg: "Format: sukses=199/200  p95=1335ms." },
        ],
      },
      reference: "Retry melipatgandakan kegagalan independen. Timeout = kenop latensi vs keberhasilan.",
    },
    {
      id: "konsep-little",
      eyebrow: "Langkah 4 · Hukum Little",
      title: "Hukum Little: fisika antrean yang tidak bisa ditawar",
      prose: [
        "Hukum Little: L = λ × W. L = jumlah request rata-rata DI DALAM SISTEM (menunggu di antrean DITAMBAH sedang diproses) — yaitu konkurensi, BUKAN otomatis jumlah worker fisik. 200 RPS × 1,2 detik = 240 request konkuren rata-rata di dalam sistem. Berapa WORKER yang dibutuhkan untuk menampung 240 request konkuren itu bergantung arsitektur: pada server sinkron satu-thread-per-request, 1 worker ≈ 1 request → 240 worker; pada server async, satu worker/proses bisa menampung puluhan request yang 'tidur' menunggu I/O (lihat Langkah 8) — jadi kebutuhan worker/proses ditentukan oleh model eksekusi, blocking/non-blocking I/O, kapasitas tiap worker, dan headroom, bukan oleh L semata. Bukan perkiraan — ini hukum kekekalan: request yang datang harus dilayani di suatu tempat.",
        "Tiga tuas kapasitas: turunkan W (model lebih cepat, cache, timeout agresif — BUKAN streaming: streaming hanya memangkas time-to-first-token, total waktunya sama), naikkan L (autoscale worker), atau batasi λ (rate limit + antrean). Fallback berlapis adalah tuas keempat yang tersembunyi: saat provider down, layani dari cache atau jawaban degradasi — λ efektif ke provider turun ke nol tanpa pengguna sadar.",
        "Kepribadian Hukum Little: ia seperti akuntansi — tidak peduli seberapa bagus arsitekturnya, debit harus sama dengan kredit. Setiap desain kapasitas yang melanggarnya akan ketahuan di hari pertama produksi.",
        "Hukum Little — contoh dihitung. L = λW: 100 request/detik × 2 detik = 200 request “di dalam sistem” rata-rata. Pada model sinkron, itu berarti 200 worker (atau 200 koneksi paralel); pada model async, jauh lebih sedikit proses — L-nya sama, worker-nya beda. Traffic naik 3x (300 rps): L menjadi 600 — atau W turun ke 0,67 detik (optimasi!). Little = fisika: tidak bisa ditawar, hanya bisa dipilih variabel mana yang diubah. Setiap “tambah mesin” vs “optimasi kode” = memilih λ, W, atau L. Tulis ketiganya sebelum belanja.",
        "Lab 240 worker — verifikasi. 120 rps × 2 detik = 240 request konkuren rata-rata di dalam sistem. Pada model sinkron (1 worker = 1 request): 240 worker; mesin 32 worker → 8 mesin (240/32 = 7,5 → 8). Mini-case: 8 → 5 mesin TANPA belanja: W 2 detik → 1,25 detik (cache + model kecil) → L = 120 × 1,25 = 150 → 5 mesin (150/32 = 4,7 → 5)! Optimasi W 37 persen = hemat 3 mesin = Rp45 juta/bulan. “Tanpa belanja” = belanja KECERDASAN, bukan mesin.",
        "Antrian prioritas — tidak semua request sama. Request bayar (transfer) prioritas 1; request info (saldo) prioritas 2. Saat overload: prioritas 2 ditunda, prioritas 1 jalan. Tanpa prioritas: transfer gagal BERSAMAAN dengan cek saldo — keduanya marah. Prioritas = memilih siapa yang kecewa.",
      ],
      formula: String.raw`L = \lambda \times W`,
      formulaNote: "L = request konkuren rata-rata di dalam sistem (antrean + diproses); λ (lambda) = laju kedatangan, request per detik; W = waktu tiap request di dalam sistem, detik. Contoh: 200 × 1,2 = 240 request konkuren. Pada model sinkron 1 worker = 1 request → 240 worker; bila tiap worker 2 GB RAM → 480 GB → sekitar 8 mesin 64 GB. Pada model async, worker yang dibutuhkan jauh lebih sedikit — L tidak berubah, arsitektur yang mengubah konversinya.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Server kurang? Tambah mesin saja.' Kadang benar, tetapi Hukum Little menunjukkan tuas yang lebih murah: potong W separuh (cache + model lebih cepat) = separuh mesin. Arsitektur mengalahkan hardware — seperti mini-case akan tunjukkan: 8 mesin menjadi 5 tanpa membeli apa pun.",
      },
      reference: "L = λ × W. Tiga tuas: turunkan W, naikkan L, batasi λ. Fallback = tuas keempat.",
    },
    {
      id: "lab-worker",
      eyebrow: "Langkah 5 · Lab worker",
      title: "Lab: menghitung 240 worker",
      prose: [
        "Chatbot NusaBank: 200 request per detik, tiap request 1,2 detik. Hitung konkurensi di dalam sistem (L) dengan Hukum Little — dan, dengan asumsi model sinkron (1 worker = 1 request), worker yang dibutuhkan. Satu baris — tetapi baris ini menentukan belanja infrastruktur puluhan juta per bulan.",
        "Coba ubah: turunkan LAT menjadi 0,7 (efek cache + timeout; streaming TIDAK memangkas total latensi — hanya time-to-first-token), jalankan ulang, dan lihat kebutuhan turun ke 140 worker. Setengah detik latensi = 100 worker = 3 mesin yang tidak perlu dibeli.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `worker` = RPS × LAT" },
        { id: "t2", text: "Cetak hasilnya" },
      ],
      expected: "worker_dibutuhkan=240",
      note: {
        title: "💡 Intuisi",
        body: "Hukum Little menjelaskan mengapa LLM 'terasa mahal' di infrastruktur: W-nya besar (detik, bukan milidetik seperti API biasa). Setiap 100ms yang kamu pangkas dari latensi adalah kapasitas gratis — optimasi latensi adalah optimasi biaya yang menyamar.",
      },
      hints: [
        "worker = RPS*LAT",
        "Format: f\"worker_dibutuhkan={worker:.0f}\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# RPS=200, latensi rata-rata 1,2 detik\nRPS, LAT = 200, 1.2\n\n# TULIS KODEMU: worker konkuren (Hukum Little)\nworker = \n\nprint(f"worker_dibutuhkan={worker:.0f}")`,
        lockLines: 5,
        solution: `# DATA SEED — jangan ubah\n# RPS=200, latensi rata-rata 1,2 detik\nRPS, LAT = 200, 1.2\n\n# TULIS KODEMU: worker konkuren (Hukum Little)\nworker = RPS*LAT\n\nprint(f"worker_dibutuhkan={worker:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "worker", value: 240, tol: 1e-9, label: "`worker` seharusnya 240", msg: "200 x 1,2 = 240." },
          { kind: "stdout_matches", task: "t2", pattern: "worker_dibutuhkan=240", label: "`print` menampilkan hasil", msg: "Format: worker_dibutuhkan=240." },
        ],
      },
      reference: "Satu baris Hukum Little menentukan belanja infrastruktur. Pangkas W = kapasitas gratis.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: sync, streaming, batch, fallback",
      prose: [
        "Satu, user menunggu jawaban (chat, klasifikasi) — synchronous + streaming: token pertama cepat (TTFT kecil) membuat 2 detik terasa seperti 0,5 detik; pasang timeout. Dua, tugas berat tidak interaktif (ringkasan 100 dokumen, batch invoice) — async + webhook atau antrean; user tidak menunggu, sistem tidak tersumbat.",
        "Tiga, provider down atau lambat — fallback berlapis: model cadangan → cache jawaban → degradasi sopan ('layanan ringkas aktif, jawaban detail menyusul'). Empat, lonjakan trafik — antrean + autoscale + rate limit; lebih baik menolak 5 persen dengan sopan daripada macet 100 persen.",
        "Aturan praktis 10 detik: interaktif → streaming + timeout; berat → async; gagal → fallback berlapis; ramai → antrean + rate limit.",
        "Rantai fallback — empat tingkat. (1) Model utama (GPT-4 kelas): 98 persen. (2) Model murah: 90 persen, 10x lebih murah. (3) Cache jawaban terakhir yang baik. (4) “Coba lagi nanti” yang jujur. Tiap tingkat turun = turun kualitas TETAPI sistem TETAP HIDUP. Tanpa fallback: 2 persen error = 2 persen pengguna marah. Dengan: 2 persen dapat jawaban “cukup baik”. Fallback = bukan kegagalan; ia desain untuk 2 persen yang pasti terjadi.",
        "Load shedding — belas kasihan sistem. Saat L > kapasitas: tolak 10 persen request TERMURAH (prioritas rendah) AGAR 90 persen tetap sehat. Tanpa shedding: SEMUA lambat → SEMUA gagal (kematian massal). Dengan: 90 persen selamat. Implementasi: antrean prioritas + batas. Menyakitkan menolak pengguna — tetapi 10 persen ditolak > 100 persen kecewa. Kapten yang membuang kargo = kapal selamat.",
        "Skenario 6 — multi-region: jika 1 region down, alihkan via DNS. State (riwayat chat!) harus di storage bersama — bukan memori lokal. Stateless dulu, baru multi-region. Urutan salah = sesi hilang saat failover.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Streaming adalah ilusi yang jujur: total waktu sama, tetapi pengguna melihat progres sehingga penantian terasa singkat. Dalam UX, yang diingat bukan durasi melainkan ketidakpastian — token yang mengalir adalah kepastian.",
      },
      reference: "Interaktif → streaming. Berat → async. Gagal → fallback berlapis. Ramai → antrean + rate limit.",
    },
    {
      id: "minicase-mesin",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 8 mesin menjadi 5 tanpa belanja",
      prose: [
        "Chatbot NusaBank: 200 RPS × 1,2 detik = 240 request konkuren di dalam sistem (Hukum Little) — pada model sinkron = 240 worker. Tiap worker 2 GB RAM → 480 GB → 8 mesin 64 GB × Rp5 juta = Rp40 juta per bulan. Anggaran infrastruktur menjerit.",
        "Redesain: streaming memangkas time-to-first-token — user melihat jawaban sambil dihasilkan — TETAPI total waktu generasi sama, jadi streaming TIDAK memangkas W; yang memangkas W ke 0,7 detik adalah cache (memotong 25 persen request), timeout agresif untuk yang macet, dan fallback cache saat provider lambat. λ efektif ke model turun ke 150 RPS → L = 105 request konkuren → pada model sinkron 105 worker → 5 mesin (dengan headroom). Hemat 3 mesin × Rp5 juta = Rp15 juta per bulan — selamanya.",
        "Twist: tidak satu rupiah pun dibelanjakan untuk hardware baru. Arsitektur mengalahkan hardware — dan Hukum Little adalah kalkulator yang membuktikannya sebelum kamu presentasi ke direksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kapasitas yang tidak dihitung adalah risiko ketersediaan: di hari gajian (trafik 3x), chatbot yang macet berarti keluhan menumpuk dan call center kebanjiran. Perencanaan kapasitas = manajemen risiko operasional, bukan sekadar belanja server.",
      },
      reference: "Hitung dengan Little sebelum belanja. Pangkas W dan λ efektif dulu, tambah mesin terakhir.",
    },
    {
      id: "backend-fastapi-async",
      eyebrow: "Langkah 8 · Backend async",
      title: "Backend aplikasi LLM: FastAPI & async",
      prose: [
        "Aplikasi LLM itu I/O-bound: sebuah request menghabiskan 95 persen waktunya MENUNGGU — menunggu provider merespons, menunggu token mengalir — bukan menghitung. Server sinkron klasik mengikat satu thread per request: 20 worker × 1 request = 20 request berjalan, sisanya antre. Datang 100 request × 2 detik sekaligus: gelombang demi gelombang, yang terakhir selesai setelah 10 detik. Padahal CPU-nya menganggur 95 persen dari waktu itu.",
        "💡 Intuisi: async itu pelayan restoran yang baik. Ia tidak berdiri mematung di satu meja menunggu masakan matang — ia mencatat pesanan meja A, melayani meja B, lalu kembali saat dapur memanggil. Satu thread, puluhan request 'tidur' menunggu I/O, event loop yang membangunkan mereka satu per satu. Konkurensi tanpa 100 thread.",
        "Struktur yang sehat: route tipis, service gemuk. Route (endpoint FastAPI) hanya melakukan tiga hal: validasi input, memanggil service layer, mengembalikan respons. Semua logika — menyusun prompt, memanggil provider, parsing output, retry — tinggal di service layer yang bisa diuji tanpa server HTTP. Route yang gemuk = logika bisnis yang tidak bisa diuji tanpa menyalakan server.",
        "Streaming ke klien memakai Server-Sent Events (SSE): server mengirim token demi token lewat satu koneksi HTTP yang tetap terbuka, klien menampilkannya mengalir. Syaratnya: server tidak boleh memblokir thread selama koneksi terbuka — inilah alasan streaming dan async adalah pasangan wajib. Koneksi SSE yang dipegang thread sinkron = thread yang disandera berjam-jam.",
        "Timeout per request saja tidak cukup di level backend: circuit breaker menghentikan SEMUA panggilan ke provider yang sedang mati selama N detik (fail fast — langsung fallback tanpa menunggu timeout tiap request), lalu membuka 'setengah' untuk satu probe. Tanpa circuit breaker, 1.000 request serentak × timeout 30 detik = 1.000 thread menunggu mayat. Dan semua mekanisme di lesson ini tidak bisa dioperasikan tanpa observability — dashboard deployment yang wajib dipantau: timeout rate (berapa persen request yang mati karena timeout), retry count (berapa upaya retry per request — naik tiba-tiba = provider bermasalah), fallback rate (berapa persen request yang dilayani model cadangan/cache/degradasi — naik = provider utama tidak sehat), queue depth (panjang antrean — naik terus = kapasitas kurang), TTFT (time to first token — yang dirasakan user di streaming), p95/p99 latensi (bukan rata-rata — p99 adalah pengalaman pengguna yang sial), dan cost per request (token × tarif — naik tanpa kenaikan kualitas = prompt atau retry yang boros). Aturan alert-nya: satu metrik merah = pantau; dua metrik merah bersamaan (misal retry count naik + p99 naik) = selidiki; fallback rate >5 persen selama 15 menit = insiden. Tanpa metrik ini, kamu baru tahu provider bermasalah dari keluhan pengguna — yaitu terlambat.",
        "Pekerjaan panjang tidak boleh menggantung request: ringkasan 100 dokumen atau batch 10.000 baris masuk antrean (background job) — request mengembalikan job_id dalam 200ms, klien polling status atau menerima webhook saat selesai. Ditambah validasi request (skema, batas panjang prompt) dan rate limit per pengguna/API key: satu pengguna rakus tidak boleh menghabiskan kuota provider untuk semua orang.",
      ],
      formula: String.raw`W_{async} \approx \lambda \times W`,
      formulaNote: "W_async = jumlah request konkuren yang harus ditangani satu proses async; λ (lambda) = laju kedatangan, request per detik; W = latensi rata-rata per request, detik. Contoh: 50 × 2 = 100 request 'tidur' menunggu provider — satu proses async menanganinya tanpa 100 thread. Fisika yang sama dengan Hukum Little di Langkah 4; async mengubah biayanya: 100 thread = 100 stack memori + context switch, 100 coroutine = satu thread + event loop.",
      tasks: [
        { id: "t1", text: "Jelaskan ke rekan: kenapa aplikasi LLM disebut I/O-bound, bukan CPU-bound" },
        { id: "t2", text: "Hitung kebutuhan konkurensi untuk 80 request/detik × 1,5 detik dengan rumus di atas" },
      ],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Async membuat model menjawab lebih cepat' atau 'tambah thread sebanyak-banyaknya'. Salah dua-duanya. Async tidak mempercepat SATU request — ia menaikkan jumlah request yang bisa ditangani bersamaan. Dan thread cocok untuk CPU-bound; untuk I/O-bound, 500 thread = 500 stack memori + context switch yang saling berebut, sementara satu event loop async menangani ribuan koneksi tidur dengan ringan.",
      },
      reference: "LLM itu I/O-bound → async. Route tipis, service gemuk. Streaming via SSE. Circuit breaker untuk fail fast. Pekerjaan panjang = antrean. Validasi + rate limit per pengguna.",
    },
    {
      id: "auth-multitenant",
      eyebrow: "Langkah 9 · Auth & multi-tenancy",
      title: "Auth & multi-tenancy untuk aplikasi AI",
      prose: [
        "Dua jenis kunci untuk dua jenis pemakai. API key (string panjang di header) untuk mesin-ke-mesin: sederhana, mudah dirotasi, mudah dicabut per integrasi. OAuth/JWT untuk manusia yang login: token berumur pendek dengan scope (izin) tertanam — 'token ini hanya boleh membaca, tidak menghapus'. Yang tidak boleh: secret atau API key tertanam di kode frontend yang bisa dibaca siapa pun.",
        "Multi-tenancy = satu aplikasi melayani banyak perusahaan. Aturan besinya: setiap query, setiap indeks vektor, setiap cache SELALU membawa tenant_id. Kebocoran lintas tenant — dokumen perusahaan A terbaca oleh perusahaan B — bukan bug biasa, melainkan insiden: kontrak hilang, denda, liputan media. Satu endpoint yang lupa filter tenant = satu pintu yang lupa dikunci di gedung berisi brankas orang lain.",
        "Setiap request LLM adalah uang keluar, jadi kuota dihitung per tenant: budget token per bulan, meter berjalan tiap request, peringatan di 80 persen, hard stop di 100 persen. Tanpa kuota per tenant, satu tenant yang 'iseng' mengunggah 10.000 dokumen = tagihan meledak dan semua tenant lain ikut membayar lewat latensi yang memburuk.",
        "Peran dan izin mengikuti prinsip least privilege: admin mengelola pengguna dan melihat metrik semua tenant miliknya; pengguna biasa hanya memakai; auditor read-only. Endpoint /admin tanpa pengecekan peran = jalan tol tanpa gerbang — siapa pun yang menebak URL-nya masuk.",
        "Audit log mencatat siapa memakai apa: tenant, user, API key, endpoint, model, jumlah token, timestamp. Saat tagihan membengkak atau ada akses aneh jam 3 pagi, audit log adalah rekaman CCTV-nya. Tanpa ini, insiden keamanan menjadi misteri tanpa saksi.",
        "💡 Intuisi: multi-tenancy seperti apartemen. Dinding antar unit harus kedap suara DAN kedap air — satu pipa bocor ke unit tetangga bukan masalah teknis kecil, melainkan masalah hukum. Isolasi tenant dibangun di arsitektur (namespace terpisah), bukan diandalkan pada ingatan developer yang 'tidak lupa' menambahkan filter.",
      ],
      tasks: [
        { id: "t1", text: "Route r1 (tokoA) dan r2 (tokoB): catat `ok` dan jumlah `hasil` tiap request" },
        { id: "t2", text: "Route r3 (key salah) dan r4 (kuota habis): catat `ok` dan `terpakai` tiap tenant" },
        { id: "t3", text: "Hitung `bocor` (isolasi namespace) dan cetak ringkasan" },
      ],
      expected: "r1 ok=True hasil=3 | r2 ok=True hasil=0 | r3 ok=False | r4 ok=False | bocor=False",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Cukup tambahkan filter tenant_id di query, aman.' Rapuh: satu endpoint baru yang lupa filter = kebocoran. Yang benar: isolasi di level arsitektur — namespace/prefix indeks vektor per tenant, row-level security di database — DITAMBAH tes otomatis yang membuktikan query tenant A tidak pernah mengembalikan dokumen tenant B (seperti lab ini). Pertahanan berlapis, bukan satu filter.",
      },
      hints: [
        "r2 = route(\"sk-B2\", \"kuliner\", 60) — kueri milik namespace tenant lain: hasilnya harus kosong (isolasi).",
        "r4: tokoB sudah memakai 60 dari 500; tambah 480 melebihi sisa → kuota habis, `terpakai` tidak bertambah.",
        "bocor = tidak ada dokumen tokoA di hasil r2: any(\"kuliner\" in dok for dok in r2.get(\"hasil\", [])).",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah
TENANTS = {
    "tokoA": {"api_key": "sk-A1", "kuota": 1000, "terpakai": 0},
    "tokoB": {"api_key": "sk-B2", "kuota": 500, "terpakai": 0},
}
INDEKS = {
    "tokoA": ["kuliner: soto ayam Rp15000",
              "kuliner: jam buka 08.00-21.00",
              "kuliner: promo gratis ongkir"],
    "tokoB": ["fashion: batik tulis Rp250000",
              "fashion: retur 7 hari"],
}

def autentikasi(api_key):
    for t, d in TENANTS.items():
        if d["api_key"] == api_key:
            return t
    return None

def cari(tenant, kueri):
    return [dok for dok in INDEKS[tenant] if kueri in dok]

def route(api_key, kueri, token):
    tenant = autentikasi(api_key)
    if tenant is None:
        return {"ok": False, "alasan": "api key tidak dikenal"}
    d = TENANTS[tenant]
    if d["terpakai"] + token > d["kuota"]:
        return {"ok": False, "alasan": "kuota token habis"}
    d["terpakai"] += token
    return {"ok": True, "tenant": tenant, "hasil": cari(tenant, kueri)}

# TULIS KODEMU: 4 request + cek isolasi
r1 = route("sk-A1", "kuliner", 120)   # tokoA, kuota cukup
r2 = 
r3 = 
r4 = 

ok1, n1 = 
ok2, n2 = 
ok3, ok4 = 
bocor = 
terpakaiA = 
terpakaiB = 

print(f"r1 ok={ok1} hasil={n1} | r2 ok={ok2} hasil={n2} | r3 ok={ok3} | r4 ok={ok4} | bocor={bocor}")`,
        lockLines: 33,
        solution: `# DATA SEED — jangan ubah
TENANTS = {
    "tokoA": {"api_key": "sk-A1", "kuota": 1000, "terpakai": 0},
    "tokoB": {"api_key": "sk-B2", "kuota": 500, "terpakai": 0},
}
INDEKS = {
    "tokoA": ["kuliner: soto ayam Rp15000",
              "kuliner: jam buka 08.00-21.00",
              "kuliner: promo gratis ongkir"],
    "tokoB": ["fashion: batik tulis Rp250000",
              "fashion: retur 7 hari"],
}

def autentikasi(api_key):
    for t, d in TENANTS.items():
        if d["api_key"] == api_key:
            return t
    return None

def cari(tenant, kueri):
    return [dok for dok in INDEKS[tenant] if kueri in dok]

def route(api_key, kueri, token):
    tenant = autentikasi(api_key)
    if tenant is None:
        return {"ok": False, "alasan": "api key tidak dikenal"}
    d = TENANTS[tenant]
    if d["terpakai"] + token > d["kuota"]:
        return {"ok": False, "alasan": "kuota token habis"}
    d["terpakai"] += token
    return {"ok": True, "tenant": tenant, "hasil": cari(tenant, kueri)}

# TULIS KODEMU: 4 request + cek isolasi
r1 = route("sk-A1", "kuliner", 120)   # tokoA, kuota cukup
r2 = route("sk-B2", "kuliner", 60)    # tokoB, kueri namespace lain
r3 = route("sk-XXX", "kuliner", 10)   # api key salah
r4 = route("sk-B2", "fashion", 480)   # 60+480 > 500 -> kuota habis

ok1, n1 = r1["ok"], len(r1.get("hasil", []))
ok2, n2 = r2["ok"], len(r2.get("hasil", []))
ok3, ok4 = r3["ok"], r4["ok"]
bocor = any("kuliner" in dok for dok in r2.get("hasil", [])) or any("kuliner" in dok for dok in INDEKS["tokoB"])
terpakaiA = TENANTS["tokoA"]["terpakai"]
terpakaiB = TENANTS["tokoB"]["terpakai"]

print(f"r1 ok={ok1} hasil={n1} | r2 ok={ok2} hasil={n2} | r3 ok={ok3} | r4 ok={ok4} | bocor={bocor}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ok1", value: true, label: "`ok1` seharusnya True", msg: "API key sk-A1 dikenali sebagai tokoA." },
          { kind: "equal", task: "t1", name: "n1", value: 3, tol: 1e-9, label: "`n1` seharusnya 3", msg: "3 dokumen tokoA mengandung 'kuliner'." },
          { kind: "equal", task: "t1", name: "ok2", value: true, label: "`ok2` seharusnya True", msg: "API key sk-B2 valid; request sah walau hasilnya kosong." },
          { kind: "equal", task: "t1", name: "n2", value: 0, tol: 1e-9, label: "`n2` seharusnya 0", msg: "Namespace tokoB tidak berisi dokumen 'kuliner' — isolasi bekerja." },
          { kind: "equal", task: "t2", name: "ok3", value: false, label: "`ok3` seharusnya False", msg: "API key tak dikenal ditolak." },
          { kind: "equal", task: "t2", name: "ok4", value: false, label: "`ok4` seharusnya False", msg: "60 + 480 > 500: kuota tokoB habis." },
          { kind: "equal", task: "t2", name: "terpakaiA", value: 120, tol: 1e-9, label: "`terpakaiA` seharusnya 120", msg: "Meter kuota tokoA bertambah 120 token." },
          { kind: "equal", task: "t2", name: "terpakaiB", value: 60, tol: 1e-9, label: "`terpakaiB` seharusnya 60", msg: "Request yang ditolak tidak memakan kuota." },
          { kind: "equal", task: "t3", name: "bocor", value: false, label: "`bocor` seharusnya False", msg: "Tidak ada dokumen tokoA di hasil maupun namespace tokoB." },
          { kind: "stdout_matches", task: "t3", pattern: "r1 ok=True hasil=3 \\| r2 ok=True hasil=0 \\| r3 ok=False \\| r4 ok=False \\| bocor=False", label: "`print` menampilkan ringkasan", msg: "Format persis seperti expected." },
        ],
      },
      reference: "API key untuk mesin, JWT untuk manusia. Isolasi tenant di arsitektur + tes kebocoran. Kuota token per tenant. Least privilege. Audit log untuk forensik & billing.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Timeout membebaskan worker dari request macet; retry (maks 3x) + backoff + jitter menaikkan sukses tanpa retry storm.",
        "Hukum Little L = λ × W menentukan konkurensi di dalam sistem — pangkas W atau λ efektif sebelum tambah mesin (dan ingat: L adalah request konkuren, kebutuhan worker-nya bergantung arsitektur).",
        "Fallback berlapis: model cadangan → cache → degradasi sopan; provider down tidak harus berarti aplikasi mati.",
        "Interaktif → streaming + timeout; tugas berat → async + webhook; lonjakan → antrean + rate limit.",
        "Retry hanya untuk kegagalan independen; kegagalan sistematis butuh perbaikan akar, bukan pengulangan.",
      ],
      next: { label: "AIE11 — UX untuk AI", href: "/v2/learn/aie11-ux" },
      quiz: [
        {
          q: "Mengapa timeout penting di aplikasi LLM?",
          options: [
            { text: "Satu request macet tanpa timeout menyumbat worker dan antrean", why: "Tepat: 30 detik × satu worker = ratusan request lain menunggu.", correct: true },
            { text: "Timeout membuat model menjawab lebih cepat", why: "Timeout tidak mempercepat model; ia memutus yang kelewat lambat.", correct: false },
            { text: "Timeout mengurangi tagihan API", why: "Efek samping kecil; fungsi utamanya ketersediaan.", correct: false },
            { text: "Timeout tidak penting bila model bagus", why: "Model bagus pun bisa lambat saat provider sibuk.", correct: false },
          ],
        },
        {
          q: "Hukum Little L = λ × W digunakan untuk…",
          options: [
            { text: "Menghitung worker konkuren dari RPS dan latensi", why: "Tepat: L = λ × W = 200 × 1,2 = 240 request konkuren DI DALAM SISTEM; pada model sinkron (1 worker = 1 request) itu berarti 240 worker — pada model async, worker-nya jauh lebih sedikit. L adalah konkurensi, bukan otomatis jumlah worker.", correct: true },
            { text: "Menghitung akurasi model", why: "Tidak ada hubungannya dengan akurasi.", correct: false },
            { text: "Menghitung biaya token", why: "Itu rumus ekonomi token, bukan Little.", correct: false },
            { text: "Memilih model terbaik", why: "Little soal kapasitas, bukan kualitas model.", correct: false },
          ],
        },
        {
          q: "Urutan fallback berlapis yang benar saat provider down?",
          options: [
            { text: "Model cadangan → cache jawaban → degradasi sopan", why: "Tepat: dari yang paling mirip normal ke yang paling hemat, pengguna hampir tidak sadar.", correct: true },
            { text: "Langsung matikan aplikasi dan tampilkan error", why: "Itu menyerah di lapis pertama.", correct: false },
            { text: "Retry tanpa batas ke provider yang sama", why: "Itu retry storm ke provider yang mati.", correct: false },
            { text: "Tunggu provider pulih sambil antrean menumpuk", why: "Antrean tak terbatas = macet total.", correct: false },
          ],
        },
        {
          q: "Kapan memakai streaming vs batch?",
          options: [
            { text: "Streaming untuk interaktif (user menunggu); batch untuk tugas berat non-interaktif", why: "Tepat: TTFT kecil menenangkan user; batch memaksimalkan throughput.", correct: true },
            { text: "Streaming selalu lebih baik", why: "Untuk tugas berat, streaming tidak menambah nilai.", correct: false },
            { text: "Batch selalu lebih murah", why: "Batch hemat throughput, tetapi tidak cocok untuk interaktif.", correct: false },
            { text: "Keduanya sama saja", why: "Beda pola: interaktif vs throughput.", correct: false },
          ],
        },
        {
          q: "Bahaya retry tanpa backoff saat provider lambat?",
          options: [
            { text: "Retry storm: beban berlipat, provider makin lambat, lingkaran kematian", why: "Tepat: niat baik tanpa backoff menumbangkan yang ingin diselamatkan.", correct: true },
            { text: "Retry menjadi terlalu lambat", why: "Masalahnya beban, bukan kecepatan retry.", correct: false },
            { text: "Tidak ada bahaya", why: "Berbahaya: ini pola kegagalan klasik sistem terdistribusi.", correct: false },
            { text: "Tagihan menjadi lebih murah", why: "Kebalikannya: retry berlipat = tagihan berlipat.", correct: false },
          ],
        },
      ],
    },
  ],
};
