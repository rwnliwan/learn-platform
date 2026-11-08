import type { V2Lesson } from "../lib/types";

// Ilustrasi: sinkron vs async — pengalaman klien untuk tugas agen 7 tick dengan timeout klien 3 tick.
const POLA_SVG = `<svg viewBox="0 0 480 230" role="img" aria-label="Sinkron: klien menunggu 3 tick lalu menyerah dan mengirim ulang, pekerjaan berjalan ganda. Async: klien bebas, webhook datang di tick ke-7.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="90" y1="16" x2="460" y2="16"/><line x1="90" y1="66" x2="460" y2="66"/><line x1="90" y1="150" x2="460" y2="150"/><line x1="90" y1="200" x2="460" y2="200"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="90" y="12">t0</text><text x="182" y="12">t3</text><text x="305" y="12">t7</text><text x="428" y="12">t12</text></g>
<text x="8" y="40" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Sinkron</text>
<rect x="90" y="26" width="92" height="14" fill="var(--c4)"/><text x="136" y="37" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">klien menunggu…</text>
<text x="196" y="37" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">✕ menyerah (timeout)</text>
<rect x="196" y="46" width="92" height="14" fill="var(--c4)" fill-opacity="0.45"/><text x="242" y="57" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">kirim ulang…</text>
<rect x="90" y="70" width="215" height="14" fill="var(--chart-text)" fill-opacity="0.35"/><text x="197" y="81" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">pekerjaan R2 berjalan (7 tick)</text>
<rect x="305" y="92" width="123" height="14" fill="var(--chart-text)" fill-opacity="0.35"/><text x="366" y="103" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">duplikat R5 (5 tick sia-sia)</text>
<text x="8" y="170" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Async</text>
<rect x="90" y="156" width="14" height="14" fill="var(--c2)"/><text x="112" y="167" font-size="10" fill="var(--text)" font-family="var(--font-ui)">202 + job_id → klien bebas</text>
<rect x="90" y="178" width="215" height="14" fill="var(--c2)" fill-opacity="0.45"/><text x="197" y="189" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">pekerjaan berjalan di background</text>
<polygon points="305,178 305,192 313,185" fill="var(--c1)"/><text x="322" y="189" font-size="10" fill="var(--text)" font-family="var(--font-ui)">webhook: selesai ✓</text>
</svg>`;

export const aai20: V2Lesson = {
  slug: "aai20-agen-sebagai-service",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI20 — Melayani Agen sebagai Service: FastAPI, Docker, CI/CD",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Di AAI18 kamu belajar MEMANGGIL API LLM. Lesson ini membalik arahnya: bagaimana ORANG LAIN memanggil AGENMU lewat API — dan kenapa pola “tunggu sampai selesai” yang wajar untuk API biasa bisa menjadi bencana untuk agen.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan “memanggil API LLM” dari “melayani agen sebagai service” dan menjelaskan kenapa keduanya butuh pola integrasi berbeda; (2) merancang pola async: 202 Accepted + job_id, antrean, polling status, dan webhook callback; (3) menulis validasi skema request ala Pydantic secara manual (tolak 422 untuk yang tak valid); (4) menjelaskan apa yang masuk ke image Docker agen dan kenapa secrets tidak boleh ikut; (5) merancang pipeline CI/CD, environment, health check, dan graceful shutdown untuk service agen.",
        "Daftar isi: 1) Peta · 2) Cerita: API yang menjawab sebelum berpikir selesai · 3) Dua arah API yang berbeda · 4) Pola async: terima, antrekan, kabari · 5) Validasi skema: tolak yang tak valid sejak pintu · 6) Lab: simulasi service mini · 7) Docker, CI/CD, dan shutdown yang anggun · 8) Peta keputusan · 9) Mini-case · 10) Checkpoint.",
        "Bekal ringkas (self-contained): agen bekerja dalam loop yang bisa memakan waktu menit hingga jam. Client HTTP biasa (browser, aplikasi mobile) menyerah menunggu dalam puluhan detik. Ketegangan antara “kerja lama” dan “klien tak sabar” adalah inti seluruh lesson ini.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "API yang menjawab sebelum berpikir selesai",
      prose: [
        "Notula, startup meeting-assistant di Bandung, meluncurkan API transkripsi+ringkasan rapat: kirim audio, terima ringkasan. Implementasinya sederhana dan “benar”: satu endpoint POST, server memproses sampai selesai, lalu mengembalikan JSON. Di pengujian dengan rapat 2 menit, semuanya mulus.",
        "Peluncuran: rapat pertama pelanggan berdurasi 40 menit. Aplikasi mobile pelanggan punya timeout 30 detik — standar yang wajar. Di detik ke-30, aplikasi menganggap request GAGAL dan — seperti aplikasi yang baik — mengirim ULANG secara otomatis. Server menerima “request baru” yang identik dan memulai pekerjaan kedua. Di detik ke-60, aplikasi mengirim ulang LAGI. Satu rapat 40 menit diproses EMPAT kali secara paralel: tagihan LLM 4×, dan keempatnya berlomba menulis ke database yang sama.",
        "Twist-nya: tidak ada satu pun komponen yang “rusak”. Modelnya benar, servernya benar, aplikasi mobile-nya bahkan berperilaku tepat (retry saat timeout adalah praktik baik!). Yang rusak adalah KONTRAKNYA: endpoint sinkron berjanji “tunggu, saya akan selesai” untuk pekerjaan yang TIDAK BISA selesai sebelum klien menyerah. Janji yang tidak bisa ditepati adalah bug arsitektur.",
        "Perbaikannya: endpoint kini langsung menjawab 202 Accepted + `job_id` dalam < 1 detik (“pesanan diterima, nomor antrean 47”), pekerjaan berjalan di background, dan hasilnya diambil lewat polling atau dikirim via webhook saat selesai. Request duplikat dikenali lewat idempotency key — kirim ulang 10 kali pun hanya dikerjakan sekali. Tagihan kembali normal, database tidak lagi balapan.",
        "Dua pola yang akan kamu kenali di lesson ini. Pola 1: sinkron untuk pekerjaan long-running — klien menyerah, retry, duplikasi. Pola 2: validasi longgar di pintu — request setengah jadi masuk antrean dan gagal di menit ke-30, membuang antrean dan waktu. Keduanya berakar sama: memperlakukan service agen seperti API biasa.",
      ],
      note: {
        title: "💡 Intuisi: restoran cepat saji vs restoran fine dining",
        body: "API biasa seperti fast food: pesan, tunggu 2 menit di kasir, terima. Service agen seperti fine dining 7-course: kamu tidak berdiri di kasir menunggu 2 jam — kamu terima nomor meja (job_id), duduk, dan pelayan (webhook) mengantarkan tiap hidangan saat siap. Memaksa fine dining melayani seperti fast food menghasilkan antrean marah di kasir (timeout) dan dapur yang memasak pesanan yang sama empat kali (duplikasi).",
      },
      tasks: [],
    },
    {
      id: "dua-arah",
      eyebrow: "Langkah 3 · Konsep",
      title: "Dua arah API yang berbeda — jangan tertukar",
      prose: [
        "Ada dua arah yang gampang tertukar karena sama-sama disebut “API”. ARAH 1 — agenmu MEMANGGIL API LLM (AAI18): kamu adalah KLIEN, kamu menunggu respons model, kamu mengatur timeout dan retry. ARAH 2 — orang lain MEMANGGIL AGENMU (lesson ini): kamu adalah SERVER, klienmu menunggu pekerjaanmu, dan KAMU yang harus merancang agar mereka tidak menunggu sia-sia.",
        "Kenapa arahnya penting? Karena semua pelajaran AAI18 tentang ketahanan klien (timeout, retry, backoff) kini berlaku TERBALIK: kamulah yang harus membuat server yang tahan terhadap klien yang tidak sabar, klien yang mengirim ulang, dan klien yang salah format. Empati arsitektural: rancang servermu seolah kamu adalah klien yang paling menyebalkan.",
        "Perbedaan operasionalnya konkret. Sebagai klien API LLM: satu panggilan = satu respons, gagal = retry. Sebagai server agen: satu request = satu PEKERJAAN yang hidup menit hingga jam, gagal = status yang bisa ditanya, dan “retry klien” = ancaman duplikasi yang harus dijinakkan dengan idempotency key.",
        "Kepribadiannya: arah 1 seperti menelepon restoran untuk memesan (kamu menunggu di telepon). Arah 2 seperti MENJADI restorannya: pelanggan menelepon, kamu tidak menyuruhnya menunggu di telepon selama makanannya dimasak 2 jam — kamu catat pesanannya, beri nomor antrean, dan telepon balik saat siap. Restoran yang menyuruh pelanggan menunggu di telepon adalah restoran yang bangkrut.",
        "Kapan pola mana: sinkron (tunggu-sampai-selesai) hanya untuk pekerjaan < timeout klien TERKECIL dalam rantaimu (biasanya 30 detik) — validasi cepat, klasifikasi instan. Async (202 + job_id) untuk SEMUA pekerjaan agen yang nyata. Tidak ada jalan tengah yang aman.",
      ],
      note: {
        title: "Miskonsepsi: “API-ku sudah RESTful, jadi sudah benar”",
        type: "pitfall",
        body: "Yang benar: RESTful mengatur BENTUK (resource, method, status code), bukan POLA WAKTU. Endpoint POST /ringkas yang RESTful sempurna tetap bencana bila ia menahan koneksi 40 menit. Yang menentukan bukan REST atau tidak, melainkan: apakah pekerjaan ini selesai sebelum klien paling tidak sabar menyerah? Bila tidak — async, tanpa kecuali.",
      },
      tasks: [],
      reference: "Arah 1 = kamu klien LLM. Arah 2 = kamu server agen. Server agen yang sehat tidak pernah menahan klien lebih dari puluhan detik.",
    },
    {
      id: "pola-async",
      eyebrow: "Langkah 4 · Konsep",
      title: "Pola async: terima, antrekan, kabari",
      prose: [
        "Pola async yang benar punya empat aktor. KLIEN mengirim POST /jobs dengan deskripsi tugas → server MEMVALIDASI (langkah 5), memasukkan ke antrean, dan langsung menjawab `202 Accepted` + `job_id` dalam < 1 detik. Klien bebas — ia bisa polling `GET /jobs/{id}` (“sudah selesai?”) atau mendaftarkan `callback_url` untuk WEBHOOK (“kabari saya saat selesai”).",
        "WORKER menarik tugas dari antrean satu per satu dan mengeksekusi loop agen sampai tuntas — tanpa ada klien yang menunggu di ujung kabel. Hasil (atau kegagalan) disimpan dengan status: `queued` → `running` → `succeeded`/`failed`. Status adalah kontrak: klien tidak pernah menebak, ia selalu bisa bertanya.",
        "Webhook adalah pola “jangan telepon saya, saya telepon Anda”: saat tugas selesai, server POST ke callback_url klien dengan hasilnya. Bedanya dengan polling: polling = klien bertanya berulang (“sudah? sudah? sudah?” — boros dan lambat); webhook = server memberi tahu tepat saat siap. Untuk tugas > 5 menit, webhook hampir selalu lebih baik.",
        "IDEMPOTENCY KEY: senjata anti-duplikasi Notula. Klien menyertakan kunci unik per tugas logis (mis. hash dari isi request). Server menyimpan kunci → job_id: kirim ulang dengan kunci sama = kembalikan job_id yang SAMA, bukan pekerjaan baru. Tanpa ini, setiap retry klien = pekerjaan ganda = tagihan ganda.",
        "Cara membaca bagan: dua baris waktu. “Sinkron”: klien menunggu 3 tick, menyerah (timeout), mengirim ulang — pekerjaan R2 tetap berjalan 7 tick dan duplikatnya R5 menambah 5 tick sia-sia. “Async”: server menjawab 202 dalam sekejap, klien bebas, webhook menandai selesai di tick ke-7. Interpretasi: async tidak membuat pekerjaan lebih cepat — ia membuat MENUNGGU tidak lagi merusak.",
        "Kepribadiannya: async seperti laundry. Kamu serahkan baju (request), terima nota (job_id), pulang. Kamu tidak berdiri di depan mesin cuci 2 jam; laundry menelepon (webhook) saat selesai. Laundry yang menyuruhmu menunggu di depan mesin adalah laundry yang tidak mengerti bisnisnya.",
        "Rumus waktu tunggunya sederhana — dan menjelaskan kenapa R2 di lab menjadi yatim:",
      ],
      formula: String.raw`W_q = \sum_{j \in antrean} d_j`,
      formulaNote: "W_q = waktu tunggu sebelum job-mu mulai dikerjakan (tick). antrean = himpunan job yang ada di depanmu; d_j = durasi job ke-j. Selesai_tick = W_q + durasi sendiri. Contoh lab: R2 menunggu R1 (2 tick), dikerjakan 5 tick → selesai di tick 7; 7 − 0 = 7 > timeout 3 → klien menyerah.",
      figure: {
        svg: POLA_SVG,
        alt: "Perbandingan sinkron vs async: sinkron menyebabkan timeout klien dan duplikasi pekerjaan; async memakai 202, job_id, dan webhook.",
        caption: "Cara membaca: sumbu horizontal = waktu (tick); merah = menunggu sia-sia / duplikat. Interpretasi: pola sinkron mengubah ketidaksabaran klien menjadi pekerjaan ganda; pola async mengubahnya menjadi kebebasan — dengan idempotency key sebagai pengaman.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: 202 adalah janji, bukan jawaban",
        body: "Status 202 Accepted artinya “pesananmu kuterima dan akan kukerjakan” — BUKAN “ini hasilnya”. Banyak bug integrasi lahir dari klien yang memperlakukan 202 seperti 200 dan langsung memakai bodinya sebagai hasil. Dokumentasikan dengan tegas: 202 = nota antrean; hasil hanya ada di GET status atau webhook.",
      },
      reference: "Async = 202 + job_id segera, worker di background, status yang bisa ditanya, webhook saat selesai, idempotency key anti-duplikat.",
    },
    {
      id: "validasi",
      eyebrow: "Langkah 5 · Konsep",
      title: "Validasi skema: tolak yang tak valid sejak pintu",
      prose: [
        "Request yang cacat harus DITOLAK dalam < 1 detik dengan 422 — bukan dibiarkan masuk antrean lalu gagal di menit ke-30 setelah memakan slot worker. Validasi pintu punya tiga lapis, mirip validasi keluaran model di AAI18. Lapis 1 — BENTUK: JSON valid, field wajib ada (`task`, `params`). Lapis 2 — TIPE: `task` string tak-kosong, `params` object/dict, `callback_url` URL valid bila ada. Lapis 3 — BISNIS: `durasi_maks` dalam batas layanan, `task` termasuk daftar yang didukung.",
        "Kenapa ketat di pintu? Karena antrean adalah sumber daya bersama: satu request sampah yang lolos = satu slot worker terbuang + satu kegagalan yang harus dijelaskan ke pelanggan. Menolak cepat itu BAIK — ia memberi klien umpan balik instan (“task kosong”) alih-alih keheningan 30 menit lalu gagal misterius.",
        "Pola ala Pydantic tanpa framework: fungsi `validasi(req)` yang mengembalikan (ok, daftar_masalah). Setiap aturan satu baris if; kumpulkan SEMUA masalah, jangan berhenti di yang pertama — klien memperbaiki semuanya sekaligus, bukan bermain tebak-tebakan satu per satu. Pesan error menyebut NAMA FIELD dan SYARATNYA (“params harus berupa object, dapat: null”).",
        "Kepribadiannya: validasi pintu seperti satpam gedung. Satpam yang baik memeriksa ID di lobi dalam 10 detik — bukan membiarkan orang masuk, naik ke lantai 30, lalu diturunkan satpam lain. Penolakan cepat adalah kebaikan; kegagalan lambat adalah kekejaman yang dibungkus keramahan.",
        "Kapan longgar, kapan ketat: ketat untuk SEMUA yang masuk antrean (biaya kegagalan tinggi); boleh longgar untuk endpoint baca/status (GET) yang murah. Aturan praktis: semakin mahal kegagalan di hilir, semakin ketat validasi di hulu.",
      ],
      note: {
        title: "Miskonsepsi: “Validasi cukup di dokumentasi API”",
        type: "pitfall",
        body: "Yang benar: dokumentasi dibaca manusia; request dikirim kode — dan kode punya bug. Tanpa validasi di server, request cacat mengalir sampai ke worker dan gagal di tengah jalan dengan pesan error yang tidak membantu siapa pun. “Harusnya mereka baca docs” bukan strategi ketahanan.",
      },
      tasks: [],
      reference: "Tolak 422 dalam < 1 detik: bentuk → tipe → bisnis. Kumpulkan semua masalah sekaligus.",
    },
    {
      id: "lab-service",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: simulasi service agen mini",
      prose: [
        "Kamu membangun service Notula dalam miniatur: 5 request masuk, timeout klien 3 tick. Request valid (task string tak-kosong DAN params berupa dict) masuk antrean FIFO; yang tak valid ditolak 422. Tiap job selesai pada tick kumulatif durasinya. Klien dianggap `diterima` bila (selesai_tick − submit_tick) ≤ TIMEOUT_KLIEN — selain itu ia sudah menyerah (`yatim`), meski pekerjaannya tetap berjalan sampai tuntas.",
        "Perhatikan R5: ia adalah kirim ulang R2 yang dilakukan klien tepat di tick ke-3, setelah menyerah menunggu R2. Tanpa idempotency key, server memperlakukannya sebagai pekerjaan BARU — dan inilah duplikasi Notula dalam bentuk paling murni.",
        "Tugasmu: tulis validasi + simulasi FIFO, isi `diterima`, `yatim`, `ditolak` (list ID sesuai urutan kemunculan), dan `total_tick`, lalu cetak ringkasannya.",
        "Coba eksplorasi setelah selesai: ubah TIMEOUT_KLIEN menjadi 12. Siapa yang kini diterima? (Seharusnya semua yang valid.) Eksperimen kedua: tambahkan idempotency key — bila R5 dikenali sebagai duplikat R2, berapa total_tick yang hemat? (5 tick: seluruh durasi R5.)",
      ],
      tasks: [
        { id: "t1", text: "Validasi tiap request: task string tak-kosong DAN params berupa dict; kumpulkan ID tak-valid ke `ditolak`" },
        { id: "t2", text: "Simulasikan antrean FIFO dengan timeout klien; isi `diterima`, `yatim`, `total_tick`, lalu cetak ringkasan" },
      ],
      expected: "diterima=1 yatim=2 ditolak=2 tick=12",
      note: {
        title: "Kaitan ke produksi",
        type: "risk",
        body: "Di produksi, “tick” ini adalah menit, dan “yatim” berarti pelanggan yang pergi sambil tagihanmu tetap berjalan. Pola lab ini — validasi ketat di pintu + 202 + antrean + idempotency key — adalah kerangka semua service agen yang sehat, dari FastAPI sederhana sampai platform raksasa.",
      },
      hints: [
        "R5 disubmit pada tick ke-3 (bukan 0) — pakai submit_tick khusus untuknya.",
        "selesai_tick job = jumlah kumulatif durasi semua job valid sampai dirinya.",
        "Klien diterima bila selesai_tick − submit_tick ≤ TIMEOUT_KLIEN.",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====
TIMEOUT_KLIEN = 3  # tick: klien menyerah bila belum ada hasil
requests = [
    {"id": "R1", "task": "ringkas", "durasi": 2, "params": {"dokumen": "lap.pdf"}},
    {"id": "R2", "task": "riset", "durasi": 5, "params": {"topik": "pesaing"}},
    {"id": "R3", "task": "", "durasi": 1, "params": {}},
    {"id": "R4", "task": "ringkas", "durasi": 4},
    {"id": "R5", "task": "riset", "durasi": 5, "params": {"topik": "pesaing"}},  # kirim ulang R2
]
# TULIS KODEMU di bawah garis ini.
# t1: valid = task string tak-kosong DAN params berupa dict. Kumpulkan id tak-valid ke 'ditolak'.
# t2: proses yang valid FIFO; tiap job selesai pada tick kumulatif durasinya.
#     klien dianggap 'diterima' bila selesai_tick - submit_tick <= TIMEOUT_KLIEN,
#     selain itu 'yatim' (R5 disubmit pada tick ke-3, setelah klien R2 menyerah).
#     Isi: diterima, yatim (list id), total_tick (int).
#     Cetak: diterima=X yatim=Y ditolak=Z tick=T
# =================================`,
        lockLines: 16,
        solution: `# ===== DATA — jangan diubah =====
TIMEOUT_KLIEN = 3  # tick: klien menyerah bila belum ada hasil
requests = [
    {"id": "R1", "task": "ringkas", "durasi": 2, "params": {"dokumen": "lap.pdf"}},
    {"id": "R2", "task": "riset", "durasi": 5, "params": {"topik": "pesaing"}},
    {"id": "R3", "task": "", "durasi": 1, "params": {}},
    {"id": "R4", "task": "ringkas", "durasi": 4},
    {"id": "R5", "task": "riset", "durasi": 5, "params": {"topik": "pesaing"}},  # kirim ulang R2
]
# TULIS KODEMU di bawah garis ini.
# t1: valid = task string tak-kosong DAN params berupa dict. Kumpulkan id tak-valid ke 'ditolak'.
# t2: proses yang valid FIFO; tiap job selesai pada tick kumulatif durasinya.
#     klien dianggap 'diterima' bila selesai_tick - submit_tick <= TIMEOUT_KLIEN,
#     selain itu 'yatim' (R5 disubmit pada tick ke-3, setelah klien R2 menyerah).
#     Isi: diterima, yatim (list id), total_tick (int).
#     Cetak: diterima=X yatim=Y ditolak=Z tick=T
# =================================
ditolak, antre = [], []
for r in requests:
    if isinstance(r.get("task"), str) and r["task"] and isinstance(r.get("params"), dict):
        antre.append(r)
    else:
        ditolak.append(r["id"])
diterima, yatim = [], []
t = 0
for r in antre:
    submit = 3 if r["id"] == "R5" else 0
    t += r["durasi"]
    (diterima if t - submit <= TIMEOUT_KLIEN else yatim).append(r["id"])
total_tick = t
print(f"diterima={len(diterima)} yatim={len(yatim)} ditolak={len(ditolak)} tick={total_tick}")`,
        checks: [
          { kind: "defined", task: "t1", name: "ditolak", label: "`ditolak` terdefinisi", msg: "Kumpulkan ID request tak-valid ke list ditolak." },
          { kind: "equal", task: "t1", name: "ditolak", value: ["R3", "R4"], label: "R3 & R4 ditolak (422)", msg: "R3: task kosong; R4: params hilang (bukan dict)." },
          { kind: "equal", task: "t2", name: "diterima", value: ["R1"], label: "hanya R1 diterima klien", msg: "R1 selesai di tick 2 ≤ 3. R2 selesai di tick 7 > 3." },
          { kind: "equal", task: "t2", name: "yatim", value: ["R2", "R5"], label: "R2 & R5 yatim", msg: "R2: 7−0=7 > 3; R5: disubmit tick 3, selesai tick 12, 12−3=9 > 3." },
          { kind: "equal", task: "t2", name: "total_tick", value: 12, label: "total 12 tick kerja", msg: "2 (R1) + 5 (R2) + 5 (R5 duplikat) = 12." },
          { kind: "stdout_matches", task: "t2", pattern: "diterima=1 yatim=2 ditolak=2 tick=12", label: "ringkasan tercetak sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Validasi di pintu (422 cepat) + FIFO + timeout klien = peta siapa yang menunggu sia-sia dan siapa yang bekerja ganda.",
    },
    {
      id: "docker-cicd",
      eyebrow: "Langkah 7 · Konsep",
      title: "Docker, CI/CD, dan shutdown yang anggun",
      prose: [
        "CONTAINERISASI: image Docker agen berisi kode + dependensi + konfigurasi — TETAPI bukan secrets. Aturan praktis Dockerfile: mulai dari base image ramping, install dependensi dulu (agar layer ter-cache), salin kode terakhir (yang paling sering berubah), dan JALANKAN sebagai non-root. Satu API key yang ter-bake ke image = kunci rumah yang difotokopi ke semua orang yang mengunduh image.",
        "ENVIRONMENT: minimal tiga — dev (eksperimen bebas, data sintetis), staging (mirip produksi, untuk uji integrasi), prod (data nyata, akses terbatas). Setiap environment punya secrets-nya SENDIRI dan batasannya sendiri (staging boleh memakai model murah). Bug paling memalukan di dunia agen: menguji di prod karena “staging ribet”.",
        "CI/CD: setiap push ke branch utama menjalankan pipeline — (1) test unit & validasi skema, (2) build image, (3) deploy ke staging + smoke test (satu tugas end-to-end sungguhan), (4) deploy ke prod bertahap (canary: 10% trafik dulu). Untuk agen, smoke test WAJIB berupa tugas nyata, bukan sekadar “container hidup” — container yang hidup tetapi agennya gagal validasi = lampu hijau yang menipu.",
        "HEALTH CHECK & GRACEFUL SHUTDOWN: platform (Kubernetes, Cloud Run) perlu tahu kontainermu sehat — endpoint `/health` menjawab 200 bila worker siap menarik tugas. Saat scale-down, platform mengirim SIGTERM: service yang anggun MENOLAK tugas baru tetapi MENYELESAIKAN yang sedang berjalan (drain), baru mati. Service yang kasar mati seketika — dan tugas 40 menit di menit ke-39 hilang tanpa jejak (kecuali state-mu eksternal, seperti AAI19).",
        "Kepribadiannya: CI/CD seperti jalur perakitan mobil dengan pos pemeriksaan. Setiap mobil (versi agen) melewati rem, lampu, dan uji jalan (test, staging, canary) sebelum ke dealer (prod). Melewatkan pos = mengandalkan keberuntungan; dan keberuntungan bukan strategi deployment.",
        "Kapan tiap praktik menjadi wajib: Dockerfile rapi sejak image > 500MB atau build > 5 menit; staging sejak ada > 1 developer; canary sejak ada pelanggan yang membayar; graceful shutdown sejak tugas > 1 menit.",
      ],
      note: {
        title: "Miskonsepsi: “Secrets di environment variable container sudah aman”",
        type: "pitfall",
        body: "Yang benar: env var lebih baik daripada di kode, tetapi masih bisa bocor lewat log, dump debug, dan dashboard yang di-share screenshot-nya. Yang benar-benar aman: secret manager (di-mount saat runtime, rotasi berkala) + prinsip least privilege (service hanya bisa membaca secret miliknya). Env var = laci terkunci; secret manager = brankas dengan satpam.",
      },
      tasks: [],
      reference: "Image tanpa secrets; 3 environment; CI/CD dengan smoke test tugas nyata; health check + graceful shutdown (drain).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Memilih pola service yang tepat",
      prose: [
        "Skenario 1 — Pekerjaan < 30 detik (validasi, klasifikasi instan): sinkron OK. Satu endpoint, langsung jawab 200. Jangan over-engineering.",
        "Skenario 2 — Pekerjaan menit hingga jam (semua agen nyata): async — 202 + job_id + antrean + polling/webhook. Tidak ada pengecualian.",
        "Skenario 3 — Klien mobile / browser dengan timeout pendek: async + webhook WAJIB; pertimbangkan juga idempotency key karena mobile suka mengirim ulang saat sinyal hilang.",
        "Skenario 4 — Request bisa datang cacat dari banyak klien: validasi skema ketat di pintu (422 < 1 detik), kumpulkan semua masalah sekaligus.",
        "Skenario 5 — Deploy ke prod dengan pelanggan membayar: CI/CD + staging + canary + health check + graceful shutdown. “Langsung deploy dari laptop” hanya untuk demo.",
        "Aturan praktis 10 detik sebelum membuka endpoint agen: (1) Apakah pekerjaan ini selesai sebelum klien paling tidak sabar menyerah? → bila tidak, async. (2) Apa yang terjadi bila klien mengirim request yang sama 3×? → idempotency key. (3) Di mana secrets tinggal? → bukan di image. (4) Apa yang terjadi saat container dimatikan tiba-tiba? → drain + state eksternal. Empat pertanyaan, nol Notula.",
      ],
      tasks: [],
      reference: "Sinkron hanya < 30 detik. Selain itu: async + idempotency + validasi pintu + shutdown anggun.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Layanan notulensi: 300 request sehari, 60% melebihi timeout",
      prose: [
        "RapatKu melayani transkrip+ringkasan rapat: 300 request per hari, durasi rata-rata 6 menit, p95 14 menit. Endpoint-nya sinkron; aplikasi klien timeout di 1 menit. 60% request melebihi 1 menit → klien mengirim ulang → duplikat berjalan paralel.",
        "Pertanyaan analisis. (a) Berapa request per hari yang diduplikasi, dan berapa menit kerja sia-sia per hari bila tiap duplikat mengulang penuh 6 menit? (b) Dengan tarif LLM Rp500 per menit kerja, berapa rupiah terbuang per bulan (30 hari)? (c) Rancang perbaikan dalam 3 langkah — dan untuk tiap langkah, sebutkan masalah mana yang ia selesaikan.",
        "Pembahasan. (a) 300 × 60% = 180 duplikat per hari; 180 × 6 = 1.080 menit sia-sia per hari. (b) 1.080 × 500 = Rp540.000 per hari → Rp16.200.000 per bulan terbuang untuk pekerjaan yang tidak pernah diminta. (c) Langkah 1: ubah ke async (202 + job_id + webhook) — menyelesaikan timeout klien; klien tidak lagi menyerah dan mengirim ulang. Langkah 2: idempotency key dari fingerprint request — menyelesaikan duplikasi yang tersisa (klien yang tetap mengirim ulang karena bug/jaringan). Langkah 3: validasi skema di pintu (422 cepat) — menyelesaikan request cacat yang membuang slot antrean. Bonus langkah 4: alert “rasio duplikat” — bila naik, berarti ada klien yang berperilaku aneh.",
        "Pelajaran yang lebih dalam: Rp16,2 juta/bulan ini tidak muncul di dashboard error mana pun — semua request “berhasil” secara teknis. Pemborosan arsitektural tidak berteriak; ia berbisik di tagihan. Satu-satunya cara menangkapnya: metrik bisnis (biaya per tugas SELESAI yang diminta), bukan metrik teknis (request 200 OK).",
      ],
      tasks: [],
      note: {
        title: "Pelajaran mini-case",
        type: "risk",
        body: "“Semua request sukses” ≠ “semua uang terpakai dengan benar”. Untuk service agen, ukur DUPLIKASI (job dengan idempotency key sama yang dikerjakan > 1×) dan BIAYA PER TUGAS DIMINTA — dua metrik yang tidak ada di dashboard default mana pun, tetapi menentukan sehat-tidaknya bisnismu.",
      },
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
        "Dua arah API: memanggil LLM (kamu klien) vs melayani agen (kamu server) — butuh pola berbeda.",
        "Pekerjaan agen > 30 detik wajib async: 202 + job_id segera, worker di background, status/webhook, idempotency key.",
        "Validasi skema di pintu: tolak 422 dalam < 1 detik (bentuk → tipe → bisnis), kumpulkan semua masalah.",
        "Docker: image berisi kode+dependensi, TANPA secrets; 3 environment dengan secrets masing-masing.",
        "CI/CD: test → build → staging + smoke test tugas nyata → canary; health check + graceful shutdown (drain).",
        "Aturan 10 detik: selesai sebelum klien menyerah? kirim 3× aman? secrets di mana? container mati tiba-tiba?",
      ],
      next: { label: "AAI21 — Automation Platforms", href: "/v2/learn/aai21-automation-platforms" },
      quiz: [
        {
          q: "Notula memproses rapat 40 menit lewat endpoint sinkron; aplikasi timeout di 30 detik dan mengirim ulang. Apa yang terjadi?",
          options: [
            { text: "Request kedua antre rapi menunggu yang pertama selesai", why: "Tidak ada antrean dalam desain sinkron — setiap request langsung dieksekusi paralel.", correct: false },
            { text: "Pekerjaan yang sama berjalan 4× paralel — tagihan 4× untuk satu rapat", why: "Tepat — tanpa idempotency key, tiap retry = pekerjaan baru yang penuh.", correct: true },
            { text: "Server menolak request duplikat secara otomatis", why: "Server tidak tahu itu duplikat — tidak ada idempotency key yang mengenali kesamaannya.", correct: false },
            { text: "Tidak ada masalah — retry adalah praktik baik", why: "Retry baik untuk klien; bencana bila server tidak dirancang untuknya.", correct: false },
          ],
        },
        {
          q: "Pola yang benar untuk pekerjaan agen 40 menit adalah…",
          options: [
            { text: "Naikkan timeout klien menjadi 45 menit", why: "Klien mobile/browser tidak bisa dipaksa menunggu 45 menit — dan jaringannya bisa putus kapan saja.", correct: false },
            { text: "202 Accepted + job_id segera, worker background, webhook/polling, idempotency key", why: "Tepat — klien bebas dalam < 1 detik; pekerjaan berjalan tanpa ada yang menunggu sia-sia.", correct: true },
            { text: "Bagi pekerjaan menjadi 80 request 30-detik", why: "Memecah artifisial menambah kompleksitas tanpa menyelesaikan masalah menunggu.", correct: false },
            { text: "Gunakan model yang lebih cepat agar selesai < 30 detik", why: "Kecepatan model tidak mengubah sifat pekerjaan long-running; 40 menit tetap 40 menit.", correct: false },
          ],
        },
        {
          q: "Dalam lab, kenapa R5 dihitung yatim meski disubmit di tick ke-3?",
          options: [
            { text: "Karena R5 tidak valid dan ditolak", why: "R5 valid (task + params lengkap) — ia masuk antrean dan dikerjakan.", correct: false },
            { text: "Karena selesai di tick 12, menunggu 9 tick > timeout 3", why: "Tepat — R5 antre di belakang R1+R2; kliennya menyerah jauh sebelum gilirannya tiba.", correct: true },
            { text: "Karena server mendeteksi duplikat dan membatalkannya", why: "Justru sebaliknya — TANPA idempotency key, server mengerjakannya penuh sebagai pekerjaan baru.", correct: false },
            { text: "Karena TIMEOUT_KLIEN hanya berlaku untuk R1", why: "Timeout berlaku untuk semua klien; R1 beruntung karena antreannya kosong.", correct: false },
          ],
        },
        {
          q: "Request dengan task kosong masuk ke service. Penanganan terbaik?",
          options: [
            { text: "Biarkan masuk antrean — worker akan menanganinya", why: "Membuang slot antrean untuk kegagalan yang bisa diketahui dalam 1 detik.", correct: false },
            { text: "Tolak 422 dalam < 1 detik dengan pesan field yang salah", why: "Tepat — gagal cepat, gagal jelas, gagal murah.", correct: true },
            { text: "Isi task dengan default “ringkas” agar tetap jalan", why: "Menebak maksud klien = TokoNusa jilid dua; diam-diam salah lebih buruk dari terang-terangan ditolak.", correct: false },
            { text: "Log saja dan lanjutkan", why: "Log bukan penanganan — request cacat tetap memakan sumber daya.", correct: false },
          ],
        },
        {
          q: "Di mana API key LLM boleh disimpan untuk service produksi?",
          options: [
            { text: "Di dalam image Docker agar mudah di-deploy", why: "Image bisa diunduh, di-share, di-cache — API key ikut ke mana-mana.", correct: false },
            { text: "Di secret manager, di-mount saat runtime, dengan akses minimal", why: "Tepat — terpisah dari kode dan image, bisa dirotasi tanpa rebuild.", correct: true },
            { text: "Di environment variable yang di-commit ke repo", why: "Repo bisa bocor (atau di-share); env var yang di-commit = secret yang dipublikasi.", correct: false },
            { text: "Di log agar mudah di-debug", why: "Log adalah tempat TERBURUK untuk secret — ia dibaca banyak orang dan disimpan lama.", correct: false },
          ],
        },
        {
          q: "Platform mengirim SIGTERM saat scale-down di tengah tugas 40 menit. Service yang anggun…",
          options: [
            { text: "Langsung mati — tugas bisa diulang dari nol", why: "Mengulang 39 menit kerja = membuang token dan waktu; state eksternal + drain mencegahnya.", correct: false },
            { text: "Menolak tugas baru, menyelesaikan yang berjalan (drain), baru mati", why: "Tepat — graceful shutdown + state eksternal = tidak ada kerja yang hilang.", correct: true },
            { text: "Mengabaikan SIGTERM dan terus berjalan", why: "Platform akan mengirim SIGKILL setelah grace period — mengabaikan hanya menunda kematian paksa.", correct: false },
            { text: "Me-restart worker agar tugas lebih cepat", why: "Restart tidak mempercepat apa pun; ia justru membuang progres.", correct: false },
          ],
        },
      ],
    },
  ],
};
