import type { V2Lesson } from "../lib/types";

// ── Figure: timeline run DAG harian (Gantt mini) ──────────────────────────
const DAG_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram Gantt satu run DAG: extract 0-5 menit, validate 5-7, transform 7-20 dengan retry, load 20-25, notify 25-26">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="110" y1="240" x2="540" y2="240"/>
<line x1="110" y1="200" x2="540" y2="200"/><line x1="110" y1="160" x2="540" y2="160"/>
<line x1="110" y1="120" x2="540" y2="120"/><line x1="110" y1="80" x2="540" y2="80"/>
<line x1="110" y1="40" x2="540" y2="40"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<text x="110" y="258">0</text><text x="196" y="258">5</text><text x="282" y="258">10</text>
<text x="368" y="258">15</text><text x="454" y="258">20</text><text x="540" y="258">25+</text>
<text x="325" y="278" fill="var(--text-muted)">menit sejak run dimulai</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)" text-anchor="end">
<text x="104" y="74">extract</text><text x="104" y="114">validate</text>
<text x="104" y="154">transform</text><text x="104" y="194">load</text>
<text x="104" y="234">notify</text>
</g>
<g font-size="10" font-family="var(--font-ui)">
<rect x="110" y="62" width="86" height="18" fill="var(--c1)" opacity="0.9"/>
<rect x="196" y="102" width="34" height="18" fill="var(--c1)" opacity="0.9"/>
<rect x="230" y="142" width="34" height="18" fill="var(--c4)" opacity="0.9"/>
<text x="247" y="137" text-anchor="middle" fill="var(--text)">gagal</text>
<rect x="247" y="156" width="17" height="8" fill="var(--text-muted)" opacity="0.5"/>
<text x="256" y="150" text-anchor="middle" fill="var(--text-muted)">tunggu 60 dtk</text>
<rect x="264" y="142" width="190" height="18" fill="var(--c1)" opacity="0.9"/>
<text x="359" y="137" text-anchor="middle" fill="var(--text)">retry sukses</text>
<rect x="454" y="182" width="86" height="18" fill="var(--c1)" opacity="0.9"/>
<rect x="454" y="222" width="17" height="18" fill="var(--c2)" opacity="0.9"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="110" y="30">satu run DAG harian: transform gagal di percobaan 1, retry sukses setelah backoff</text>
</g>
</svg>`;

const LAB_SETUP = `# Mini-scheduler ala Airflow (pola 1:1: DAG + topological order + retry + backoff)
# Airflow ASLI butuh scheduler & metadata DB — di sini kita simulasikan LOGIKANYA:
# urutan topologi, retry dengan backoff, dan deteksi cycle.

from collections import deque

TUGAS = {
    "extract":   {"deps": [],            "durasi": 5,  "gagal_pertama": False},
    "validate":  {"deps": ["extract"],   "durasi": 2,  "gagal_pertama": False},
    "transform": {"deps": ["validate"],  "durasi": 11, "gagal_pertama": True},
    "load":      {"deps": ["transform"], "durasi": 5,  "gagal_pertama": False},
    "notify":    {"deps": ["load"],      "durasi": 1,  "gagal_pertama": False},
}
MAX_RETRY = 3
T0 = 60  # backoff awal (detik)
`;

export const d19: V2Lesson = {
  slug: "d19-apache-airflow",
  track: "Python",
  module: "Rekayasa",
  title: "D19 — Apache Airflow: Orkestrasi Pipeline yang Tidak Bangun Tengah Malam",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Selasa yang hilang — dan stok yang terhitung dua kali",
      prose: [
        "Budi, data engineer sebuah e-commerce, punya pipeline harian tiga langkah: (1) tarik data transaksi, (2) hitung omzet per kategori, (3) kirim laporan ke finance. Dijalankan cron jam 02:00. Suatu Selasa, langkah 2 gagal — database timeout. Cron tidak retry, tidak mengirim alert; ia hanya mencatat “exit 1” di log yang tidak dibaca siapa pun. Pagi harinya finance memakai angka SENIN untuk rapat direksi. Tidak ada yang sadar sampai Kamis.",
        "Budi memperbaiki dengan “solusi cepat”: cron dipecah menjadi tombol rerun manual. Selasa berikutnya langkah 2 gagal lagi; Budi menekan rerun — tetapi tombol itu menjalankan ulang SEMUA langkah termasuk langkah 1 (tarik data). Langkah 1 tidak idempotent: ia MENAMBAHKAN baris ke tabel staging, bukan menimpa. Hasilnya: 1.200 transaksi tercatat DUA KALI, omzet minggu itu menggelembung Rp380 juta di laporan. Audit menemukan; finance harus merevisi.",
        "Twist-nya: Budi tidak malas — ia MERESPON setiap kegagalan dengan cepat. Masalahnya: tool-nya (cron + tombol manual) tidak punya KONSEP urutan, retry, dan idempotency — tiga hal yang justru membedakan “script yang dijadwalkan” dari “pipeline yang diorkestrasi”. Kegagalan pertama (Selasa yang hilang) adalah kegagalan DETEKSI; kegagalan kedua (stok ganda) adalah kegagalan DESAIN — rerun yang tidak idempotent lebih berbahaya daripada tidak rerun sama sekali. Lesson ini tentang Apache Airflow: konduktor yang memastikan tiap musisi masuk di aba-aba yang benar, mengulang yang fals tanpa mengulang yang sudah benar.",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran tentang lab lesson ini",
        type: "risk",
        body: "Airflow ASLI adalah sistem terdistribusi (scheduler + metadata database + worker) yang diinstall via pip dan dijalankan sebagai service — tidak tersedia di lab browser. Lab memakai mini-scheduler Python murni dengan POLA 1:1 konsep Airflow: DAG sebagai dict dependensi, topological order (Kahn's algorithm) seperti scheduler, retry + backoff seperti task retries, dan deteksi cycle seperti validasi DAG. Salin pola ini ke laptop: pip install apache-airflow, tulis file DAG dengan PythonOperator, dan struktur tugasnya identik.",
      },
      reference: "cron + rerun manual = tanpa konsep urutan/retry/idempotency. Rerun tak idempotent lebih berbahaya dari gagal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita Selasa yang hilang. (2) Peta ini. (3) Konsep: DAG — Si Konduktor Orkestra. (4) Konsep: retry & idempotency — Si Tukang Pos yang Gigih Tapi Hati-hati (+ rumus backoff). (5) Konsep: schedule & backfill — Si Mesin Waktu. (6) Lab: tulis mini-scheduler dengan retry. (7) Chart: membaca timeline satu run DAG. (8) Peta keputusan: cron vs Airflow vs streaming. (9) Mini-case: pipeline rekonsiliasi bank. (10) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) memodelkan pipeline sebagai DAG dan menentukan urutan eksekusi yang benar (topological order); (2) merancang retry yang aman — backoff + idempotency; (3) memutuskan kapan memakai Airflow vs cron vs tool lain; (4) membaca dan menjelaskan Gantt run DAG kepada non-teknis.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: dict {\"nama\": {...}} untuk definisi task; list untuk antrean; while loop; try/except; fungsi def. Tidak perlu pengalaman Airflow atau sistem terdistribusi.",
        "Rutenya: cerita → peta → tiga konsep inti → lab → chart timeline → peta keputusan → mini-case → kuis. Estimasi 65 menit; lab ±15 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap pipeline seperti RESEP MASAKAN berawak banyak. cron adalah alarm yang berteriak “masak!” lalu pergi — tidak peduli kompor mati atau koki salah urutan. Airflow adalah KEPALA KOKI yang berdiri di dapur: memastikan bawang dipotong SEBELUM ditumis (urutan), mengulang tumisan yang gosong TANPA mengulang potongan yang sudah benar (retry selektif), dan mencatat setiap langkah di buku (logging).",
      ],
      reference: "Tujuan: DAG + topological order + retry/idempotency + kapan pakai Airflow. Pola lab 1:1 dengan konsep Airflow asli.",
    },
    {
      id: "konsep-dag",
      eyebrow: "Langkah 3 · Konsep",
      title: "DAG — Si Konduktor Orkestra",
      prose: [
        "Definisi: DAG (Directed Acyclic Graph) adalah graf berarah TANPA siklus: titik = task (unit kerja), panah = “harus selesai dulu”. Contoh pipeline Budi: extract → validate → transform → load → notify. “Acyclic” (tanpa siklus) adalah syarat mutlak — bila A menunggu B dan B menunggu A, tidak ada yang bisa mulai duluan; Airflow MENOLAK DAG seperti itu saat validasi (persis seperti lab akan menolak cycle). Scheduler Airflow menentukan urutan eksekusi dengan topological sort: algoritma yang mengurutkan task sehingga setiap task muncul SETELAH semua dependensinya — untuk contoh di atas hanya ada satu urutan valid.",
        "Kepribadiannya: DAG adalah konduktor orkestra. Partitur (definisi DAG) menulis SIAPA masuk KAPAN: biola tidak boleh mulai sebelum aba-aba, dan aba-aba tidak diberikan sebelum cello selesai. Konduktor tidak memainkan alat musik apa pun — ia hanya memastikan URUTAN. Begitu pula scheduler Airflow: ia tidak menarik data atau menghitung omzet; ia hanya memutuskan “sekarang giliran transform” setelah validate hijau. Tanpa konduktor, 5 musisi hebat menghasilkan kekacauan; dengan konduktor, mereka menghasilkan simfoni. Tanpa scheduler, 5 script hebat menghasilkan Selasa yang hilang.",
        "Kapan memakai: setiap kali pekerjaanmu berbentuk “langkah-langkah berurutan dengan dependensi”. Tiga ciri DAG yang sehat: (1) task sekecil mungkin TETAPI semakna mungkin — “transform” lebih baik daripada “langkah2”, tetapi “transform_kolom_a” terlalu kecil; (2) dependensi eksplisit — JANGAN mengandalkan “biasanya extract selesai jam 2” (itu cron thinking); (3) tanpa siklus — bila menemukan siklus, itu sinyal desain salah (biasanya dua task yang harus digabung atau dipisah).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “DAG = flowchart”",
        type: "pitfall",
        body: "Yang benar: flowchart BOLEH punya siklus (loop “ulangi sampai benar”) dan cabang kondisional bebas; DAG TIDAK BOLEH punya siklus — itu definisinya. Konsekuensinya praktis: “ulangi task ini sampai sukses” bukan panah melingkar di DAG, melainkan ATRIBUT task (retries=3). Mencampuradukkan keduanya menghasilkan DAG yang ditolak scheduler dengan error membingungkan.",
      },
      hints: [
        "💡 Intuisi topological: algoritma Kahn di lab — “siapa yang tidak menunggu siapa pun, maju duluan; yang sudah maju, coret dari daftar tunggu”. Ulangi sampai antrean kosong. Sederhana, dan persis logika inti scheduler Airflow.",
      ],
      reference: "DAG = task + panah dependensi, TANPA siklus. Scheduler = konduktor: hanya mengatur urutan (topological sort).",
    },
    {
      id: "konsep-retry",
      eyebrow: "Langkah 4 · Konsep",
      title: "Retry & Idempotency — Si Tukang Pos yang Gigih Tapi Hati-hati",
      prose: [
        "Definisi: retry = mengulang task yang gagal, maksimal N kali, dengan jeda yang MEMBESAR (backoff). Idempotency = sifat operasi yang hasilnya sama walau dijalankan BERULANG: f(f(x)) = f(x). Contoh idempotent: “tulis file laporan_2026-10-19.csv” (ditulis 3x hasilnya sama — menimpa). Contoh TIDAK idempotent: “tambahkan baris ke tabel staging” (dijalankan 3x = 3x baris — inilah bug Rp380 juta cerita pembuka). Rumus idempotency praktis: selalu tulis dengan KUNCI yang sama (tanggal/partisi/id) dalam mode timpa, bukan tambah.",
        "Kepribadiannya: retry adalah tukang pos yang gigih TAPI hati-hati. Paket (task) gagal diantar karena hujan (DB timeout) → ia kembali besok (retry 1), masih hujan → kembali lusa (retry 2, jeda lebih lama — backoff). KEGIGIHAN tanpa KEHATI-HATIAN = ia mengantar paket yang sama dua kali ke rumah yang sama (duplikasi). Tukang pos yang baik membawa DAFTAR (idempotency key): “paket untuk alamat ini SUDAH diantar” — ketukan kedua tidak meninggalkan paket kedua. Airflow memberi keduanya: retries=3 + retry_delay, dan desain task yang idempotent adalah TANGGUNG JAWABMU.",
        "Kapan memakai: retry untuk kegagalan TRANSIEN (timeout, rate limit, DB sibuk sesaat) — BUKAN untuk bug logika (kode yang salah akan gagal 3x dengan patuh). Aturan praktis: retries=3 untuk task API/DB; retry_delay membesar (lihat rumus); dan SETIAP task tulis harus idempotent — uji dengan pertanyaan: “kalau task ini dijalankan 2x karena retry, apakah datanya tetap benar?” Bila jawabannya tidak, perbaiki desainnya DULU sebelum menambah retry.",
      ],
      formula: String.raw`t_n = t_0 \times 2^{n-1}`,
      formulaNote: "Rumus exponential backoff Airflow (retry_delay bertingkat). t_n = jeda sebelum percobaan ulang ke-n (detik); t_0 = jeda awal; n = nomor percobaan ulang (1, 2, 3, ...). Interpretasi: jeda MEMBESAR dua kali lipat tiap gagal — memberi sistem yang sakit waktu pulih. Contoh angka cerita Budi: t_0 = 60 detik, DB timeout 3 menit. Percobaan 1 gagal → tunggu t_1 = 60 × 2^0 = 60 detik → percobaan 2 (masih dalam masa timeout) gagal → tunggu t_2 = 60 × 2^1 = 120 detik → percobaan 3 (timeout sudah lewat) SUKSES. Total waktu terbuang 3 menit vs laporan hilang 2 hari. Tanpa backoff (jeda tetap 5 detik), 3 percobaan habis dalam 15 detik — semuanya gagal, dan kamu menyimpulkan “DB mati total” padahal ia hanya butuh 3 menit.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Retry = solusi untuk semua kegagalan”",
        type: "pitfall",
        body: "Yang benar: retry hanya menyembuhkan kegagalan TRANSIEN. Bug logika (kolom salah nama), data rusak permanen, atau kredensial kedaluwarsa akan GAGAL TEPAT SAMA pada percobaan ke-1, 2, dan 3 — retry hanya membuang waktu dan memenuhi log. Aturan: bila task gagal 3x dengan PESAN ERROR YANG SAMA persis, berhentilah menambah retry — perbaiki penyebabnya.",
      },
      hints: [
        "💡 Intuisi idempotency: sebelum menulis task tulis apa pun, tanyakan “kunci timpa”-nya apa — tanggal? id batch? partisi? Bila tidak ada jawabannya, task itu belum siap diorkestrasi.",
      ],
      reference: "Retry untuk transien + backoff membesar (t_n = t_0 × 2^(n-1)); idempotency (tulis pakai kunci, mode timpa) agar retry aman.",
    },
    {
      id: "konsep-schedule",
      eyebrow: "Langkah 5 · Konsep",
      title: "Schedule & Backfill — Si Mesin Waktu",
      prose: [
        "Definisi: schedule_interval = “seberapa sering DAG berjalan” (mis. @daily jam 02:00). Backfill = menjalankan DAG untuk rentang tanggal MASA LALU yang terlewat — “mesin waktu” Airflow: catchup=True membuat scheduler otomatis membuat run untuk setiap interval sejak start_date yang belum ada. Contoh: pipeline mati 3 hari karena server down; dengan backfill, satu perintah mengisi ketiga hari itu berurutan — TANPA tombol rerun manual yang rawan salah.",
        "Kepribadiannya: backfill adalah mesin waktu yang disiplin. Ia tidak melompat acak ke masa lalu; ia berjalan mundur HARI PER HARI, menjalankan urutan task yang SAMA persis seperti hari normal, dengan data tanggal itu. Tetapi mesin waktu punya satu aturan keras: ia hanya aman bila task-mu idempotent. Backfill 30 hari atas task “tambahkan baris” = 30x duplikasi = Rp380 juta × 30. Airflow menyediakan mesinnya; kamu menyediakan jaminan keselamatannya.",
        "Kapan memakai: backfill untuk mengisi kekosongan (downtime, bug yang sudah diperbaiki dan perlu hitung ulang). JANGAN pakai backfill untuk “coba-coba” — setiap run masa lalu menulis data produksi. Tiga pengaman: (1) pastikan idempotent DULU (uji: jalankan 2x untuk tanggal yang sama di staging, bandingkan hasil); (2) backfill bertahap (3 hari dulu, verifikasi, baru 30 hari); (3) beri tahu stakeholder — angka historis akan BERUBAH, dan “angka berubah” tanpa pemberitahuan adalah insiden komunikasi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Backfill = tinggal pencet, beres”",
        type: "pitfall",
        body: "Yang benar: backfill adalah OPERASI BERISIKO yang menulis ulang data historis. Tanpa idempotency ia menggandakan data; tanpa pemberitahuan ia membingungkan semua konsumen laporan (“kok angka bulan lalu berubah?”). Perlakukan backfill seperti deploy: ada rencana, ada verifikasi, ada komunikasi — bukan seperti menekan tombol lampu.",
      },
      hints: [
        "💡 Intuisi schedule: start_date + schedule_interval + catchup menentukan “berapa run yang akan dibuat”. Kesalahan klasik pemula: start_date = 3 bulan lalu + catchup=True → scheduler langsung membuat 90 run sekaligus dan menyerbu database. Untuk DAG baru, mulai dengan catchup=False.",
      ],
      reference: "Backfill = mesin waktu yang disiplin: aman HANYA bila idempotent; bertahap; beri tahu stakeholder sebelum angka historis berubah.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Tulis mini-scheduler dengan retry",
      prose: [
        "Waktunya praktik dengan pola 1:1 Airflow. TUGAS dan konstanta sudah disediakan (di Airflow asli, ini adalah definisi DAG dengan PythonOperator). Tugasmu: (1) lengkapi topo_urut — algoritma Kahn: hitung indegree tiap task, antre yang indegree-nya 0, coret dependensi yang sudah maju; bila hasil < jumlah task → ada cycle → raise ValueError; (2) lengkapi jalankan_dag — eksekusi task sesuai urutan topologi; task dengan gagal_pertama=True GAGAL di percobaan 1 lalu sukses di percobaan 2 (simulasi timeout transien); hitung total waktu = jumlah durasi + backoff yang terpakai (t_n = 60 × 2^(n-1) detik → dalam menit: bagi 60); (3) jalankan dan pastikan urutan benar + 1 retry tercatat.",
        "Perhatikan: retry di sini hanya untuk task yang gagal_pertama — simulasi kegagalan TRANSIEN. Task lain sukses di percobaan 1. Inilah bedanya dengan “rerun semua” ala Budi: hanya yang fals yang diulang.",
        "Coba: setelah lolos, ubah TUGAS — tambahkan \"laporan\": {\"deps\": [\"notify\", \"extract\"]} sehingga extract ← ... ← laporan ← extract membentuk cycle. Jalankan topo_urut dan lihat ValueError-nya. Itulah validasi DAG Airflow menolak graf bersiklus. Lalu kembalikan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `topo_urut(tugas)`: kembalikan list nama task dalam urutan topologi; `raise ValueError('cycle terdeteksi')` bila ada siklus" },
        { id: "t2", text: "Lengkapi `jalankan_dag`: eksekusi per urutan topologi; task `gagal_pertama` gagal di percobaan 1 → retry dengan backoff `60 * 2**(n-1)` detik; kembalikan `(urutan, n_retry, total_mnt)`" },
        { id: "t3", text: "Jalankan dan pastikan urutan `['extract', 'validate', 'transform', 'load', 'notify']`, `n_retry = 1`, total waktu tercetak" },
      ],
      expected: "urutan: ['extract', 'validate', 'transform', 'load', 'notify']\nretry: 1\ntotal: 25.0 menit",
      code: {
        starter:
          LAB_SETUP +
          `
def topo_urut(tugas):
    indeg = {nama: len(info["deps"]) for nama, info in tugas.items()}
    antre = deque([nama for nama, d in indeg.items() if d == 0])
    hasil = []
    while antre:
        nama = antre.popleft()
        hasil.append(nama)
        for lain, info in tugas.items():
            if nama in info["deps"]:
                indeg[lain] -= 1
                if indeg[lain] == 0:
                    antre.append(lain)
    if ...:
        raise ValueError("cycle terdeteksi")
    return hasil


def jalankan_dag(tugas):
    urutan = topo_urut(tugas)
    n_retry = 0
    total = 0.0
    for nama in urutan:
        info = tugas[nama]
        total += info["durasi"]
        if info["gagal_pertama"]:
            # percobaan 1 gagal (transien) -> retry dengan backoff
            for n in ...:
                n_retry += 1
                total += ...  # t_n = 60 * 2**(n-1) detik -> menit
                break  # percobaan ke-2 sukses
    return urutan, n_retry, round(total, 1)


urutan, n_retry, total = jalankan_dag(TUGAS)
print("urutan:", urutan)
print("retry:", n_retry)
print("total:", total, "menit")`,
        lockLines: 18,
        solution:
          LAB_SETUP +
          `
def topo_urut(tugas):
    indeg = {nama: len(info["deps"]) for nama, info in tugas.items()}
    antre = deque([nama for nama, d in indeg.items() if d == 0])
    hasil = []
    while antre:
        nama = antre.popleft()
        hasil.append(nama)
        for lain, info in tugas.items():
            if nama in info["deps"]:
                indeg[lain] -= 1
                if indeg[lain] == 0:
                    antre.append(lain)
    if len(hasil) != len(tugas):
        raise ValueError("cycle terdeteksi")
    return hasil


def jalankan_dag(tugas):
    urutan = topo_urut(tugas)
    n_retry = 0
    total = 0.0
    for nama in urutan:
        info = tugas[nama]
        total += info["durasi"]
        if info["gagal_pertama"]:
            # percobaan 1 gagal (transien) -> retry dengan backoff
            for n in (1,):
                n_retry += 1
                total += (60 * 2 ** (n - 1)) / 60  # t_n detik -> menit
                break  # percobaan ke-2 sukses
    return urutan, n_retry, round(total, 1)


urutan, n_retry, total = jalankan_dag(TUGAS)
print("urutan:", urutan)
print("retry:", n_retry)
print("total:", total, "menit")`,
        checks: [
          { kind: "equal", task: "t3", name: "urutan", value: ["extract", "validate", "transform", "load", "notify"], label: "urutan topologi benar", msg: "Setiap task harus muncul setelah semua dependensinya — cek algoritma Kahn." },
          { kind: "equal", task: "t3", name: "n_retry", value: 1, label: "tepat 1 retry", msg: "Hanya task transform yang gagal_pertama — retry selektif, bukan rerun semua." },
          { kind: "equal", task: "t2", name: "total", value: 25.0, tol: 0.01, label: "total 25,0 menit", msg: "5+2+11+5+1 = 24 menit task + backoff t_1 = 60 dtk = 1 menit, retry sukses di percobaan 2." },
          { kind: "stdout_matches", task: "t3", pattern: "total: 25\\.0 menit", label: "total tercetak", msg: "Pastikan backoff dihitung dalam menit (bagi 60)." },
          { kind: "defined", task: "t1", name: "topo_urut", label: "`topo_urut` terdefinisi", msg: "Lengkapi algoritma Kahn dan deteksi cycle." },
        ],
      },
      reference: "Pola Airflow: DAG = dict dependensi; scheduler = topological sort; retries + backoff; cycle ditolak.",
    },
    {
      id: "chart-timeline",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca timeline: 26 menit yang bercerita",
      prose: [
        "Chart di bawah adalah timeline SATU run DAG harian (contoh) — lima task, total 25 menit termasuk satu retry.",
        "Cara membaca: sumbu X = menit sejak run dimulai (0–25+); tiap baris = satu task; panjang batang = durasi; batang merah = percobaan yang gagal; batang abu-abu tipis = jeda backoff.",
        "Interpretasi: extract (5 mnt) dan validate (2 mnt) hijau mulus. transform gagal di percobaan pertama (merah), lalu jeda backoff 60 detik (abu-abu), lalu retry 11 menit sukses. load dan notify mulus. Tiga pelajaran: (1) retry MENYELAMATKAN run — tanpa retry, run gagal total di menit 7 dan 19 menit kerja berikutnya tidak terjadi; (2) biaya retry di sini hanya 1 menit backoff — jauh lebih murah dari “Selasa yang hilang” (laporan 2 hari telat); (3) perhatikan transform MENDOMINASI timeline (11 dari 24 menit task) — bila ingin mempercepat pipeline, optimasi dimulai dari SINI (critical path), bukan dari notify yang hanya 1 menit. Pelajaran chart: baca timeline untuk menemukan di mana waktu SEBENARNYA habis.",
      ],
      figure: {
        svg: DAG_SVG,
        alt: "Diagram Gantt: extract 0-5, validate 5-7, transform gagal 7-9 lalu retry sukses 9-20, load 20-25, notify 25-26 menit.",
        caption: "Satu run DAG: retry 1 menit menyelamatkan 19 menit sisanya. Optimasi mulai dari task terpanjang (critical path).",
      },
      tasks: [],
      reference: "Retry 3 menit < laporan 2 hari telat. Critical path = task terpanjang; optimasi dimulai dari sana.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "cron vs Airflow vs streaming — lima skenario",
      prose: [
        "Lima skenario keputusan orkestrasi:",
        "Skenario 1 — Satu script Python 5 menit, tiap pagi, gagal = kamu rerun manual sambil ngopi dan tidak ada dependensi. → cron CUKUP. Alasan: Airflow adalah biaya infrastruktur (scheduler, DB, monitoring) — untuk satu task tanpa dependensi, biayanya tidak terbayar.",
        "Skenario 2 — Pipeline 5 langkah berurutan (extract → validate → transform → load → notify), gagal di tengah harus retry selektif. → Airflow. Alasan: inilah kasus kanonis — dependensi + retry + visibilitas; cron tidak punya konsep “langkah 3 dari 5”.",
        "Skenario 3 — Pipeline mati 3 hari, perlu mengisi 3 hari yang terlewat berurutan. → Airflow + backfill (catchup). Alasan: mesin waktu yang disiplin — JANGAN tombol rerun manual (pelajaran Rp380 juta).",
        "Skenario 4 — Data harus mengalir DETIKAN (transaksi kartu kredit untuk deteksi fraud). → BUKAN Airflow; pakai streaming (Kafka/Flink). Alasan: Airflow = batch berjadwal (interval menitan-jaman); untuk latensi detik butuh arsitektur streaming.",
        "Skenario 5 — Satu task butuh 3 jam dan biaya komputasi mahal, tidak boleh gagal di tengah jalan. → Airflow + sensor + SLA + alert. Alasan: untuk task mahal, yang dibutuhkan bukan sekadar retry melainkan PENGAWASAN: sensor menunggu kondisi, SLA memicu alert bila lewat batas, dan tim tahu SEBELUM gagal.",
        "Aturan praktis 10 detik: (1) Satu task tanpa dependensi → cron. (2) Multi-langkah berurutan → Airflow. (3) Retry hanya untuk transien + backoff + idempotent. (4) Isi masa lalu → backfill bertahap, bukan rerun manual. (5) Butuh detikan → streaming, bukan batch.",
      ],
      tasks: [],
      reference: "cron = 1 task; Airflow = multi-langkah + retry + backfill; streaming = detikan. Retry transien saja.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: pipeline rekonsiliasi harian bank",
      prose: [
        "Bank tempatmu bekerja punya pipeline rekonsiliasi harian 4 task: tarik_mutasi (10 mnt, deps: -), tarik_core (15 mnt, deps: -), cocokkan (20 mnt, deps: tarik_mutasi + tarik_core), kirim_laporan (2 mnt, deps: cocokkan). Task cocokkan kadang gagal di percobaan 1 karena data core belum lengkap (transien, ~30% hari), selalu sukses di percobaan 2. Backoff t_0 = 120 detik, MAX_RETRY = 3. SLA laporan: harus terkirim sebelum 06:00; run dimulai 04:30.",
        "Pertanyaan analisis: (1) Gambarkan DAG-nya — task mana yang bisa paralel? (2) Hitung total waktu run di hari BAIK (tanpa gagal) dan hari ada 1 retry di cocokkan (backoff t_1). Apakah SLA 90 menit terpenuhi di kedua hari? (3) Seseorang mengusulkan “tambahkan retry 10x agar tidak pernah gagal” — setuju atau tolak, dan mengapa? (4) Task kirim_laporan mengirim email ke direksi — idempotent atau tidak? Apa risikonya bila retry?",
        "Pembahasan: (1) DAG: tarik_mutasi dan tarik_core paralel (tidak saling menunggu); cocokkan menunggu keduanya; kirim_laporan terakhir. (2) Hari baik: max(10, 15) + 20 + 2 = 37 menit — SLA aman. Hari retry: 37 + t_1 (120 dtk = 2 menit) = 39 menit — tetap aman; inilah gunanya backoff: 2 menit vs laporan telat seharian. (3) TOLAK. Gagal 3x dengan pola sama = bukan transien (data core memang belum lengkap / bug) — retry 10x hanya menunda kegagalan 10x lebih lama sambil memenuhi log; yang benar: perbaiki sumber (tunggu data core via sensor) atau perbaiki kode. (4) TIDAK idempotent — retry mengirim email GANDA ke direksi. Solusi: idempotency key (kirim sekali per tanggal_run; cek “laporan tanggal ini sudah dikirim?” sebelum kirim) atau pisahkan pengiriman dari penandaan terkirim.",
      ],
      tasks: [],
      reference: "Paralel yang tak saling menunggu; retry 2 menit < telat seharian; tolak retry 10x untuk non-transien; email butuh idempotency key.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah — dari DAG hingga backfill. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      quiz: [
        {
          q: "DAG dengan panah A → B dan B → A (siklus) diserahkan ke Airflow. Apa yang terjadi?",
          options: [
            { text: "Berjalan normal — Airflow akan mengulang A dan B bergantian", why: "Salah. Siklus = tidak ada urutan valid; “mengulang bergantian” adalah loop tak berujung, bukan orkestrasi.", correct: false },
            { text: "Ditolak saat validasi — DAG didefinisikan tanpa siklus (acyclic)", why: "Benar. Acyclic adalah syarat definisi DAG; scheduler tidak bisa menentukan siapa duluan. Perbaiki desain (gabung/pisah task).", correct: true },
            { text: "A dan B dijalankan paralel", why: "Salah. Paralel butuh KEDUANYA tidak saling menunggu — panah A→B justru menyatakan B menunggu A.", correct: false },
            { text: "Airflow memilih salah satu secara acak untuk didahulukan", why: "Salah. Scheduler deterministik (topological sort) — tidak ada unsur acak dalam urutan.", correct: false },
          ],
        },
        {
          q: "Task gagal 3x berturut-turut dengan pesan error IDENTIK: “kolom 'tgl_transaksi' tidak ditemukan”. Tindakan yang tepat?",
          options: [
            { text: "Naikkan retries menjadi 10", why: "Salah. Pesan identik 3x = BUKAN transien (bug/skema berubah). Retry 10x = gagal 10x lebih lama.", correct: false },
            { text: "Hentikan retry, perbaiki penyebab: cek skema sumber / kode", why: "Benar (aturan Langkah 4). Retry hanya untuk transien; error identik berulang = perbaiki akar masalahnya.", correct: true },
            { text: "Kecilkan retry_delay agar cepat selesai", why: "Salah. Mempercepat retry tidak mengubah hasil task yang pasti gagal — hanya mempercepat kegagalan.", correct: false },
            { text: "Hapus task tersebut dari DAG", why: "Salah. Menghapus task menyembunyikan masalah dan merusak pipeline — data jadi tidak lengkap diam-diam.", correct: false },
          ],
        },
        {
          q: "Manakah operasi yang IDEMPOTENT (aman di-retry/di-backfill)?",
          options: [
            { text: "INSERT baris baru ke tabel staging setiap run", why: "Salah — inilah bug Rp380 juta: dijalankan 2x = baris ganda.", correct: false },
            { text: "Tulis ulang file laporan_2026-10-19.csv (mode timpa)", why: "Benar. Ditulis 1x atau 5x hasilnya identik — f(f(x)) = f(x). Inilah pola tulis yang aman.", correct: true },
            { text: "Kirim email laporan ke direksi", why: "Salah. Email ganda = insiden; butuh idempotency key sebelum kirim.", correct: false },
            { text: "UPDATE saldo = saldo + 100 (tanpa where tanggal)", why: "Salah. Dijalankan 2x = +200 — klasik non-idempotent.", correct: false },
          ],
        },
        {
          q: "Backoff t_0 = 30 detik. Berapa jeda sebelum percobaan ulang ke-3 (t_3)?",
          options: [
            { text: "30 detik", why: "Salah — itu t_1. Backoff MEMBESAR, bukan tetap.", correct: false },
            { text: "60 detik", why: "Salah — itu t_2 (30 × 2^1).", correct: false },
            { text: "120 detik", why: "Benar. t_n = t_0 × 2^(n-1) → t_3 = 30 × 2^2 = 120 detik. Memberi sistem yang sakit waktu pulih.", correct: true },
            { text: "90 detik", why: "Salah — itu pola linear (30×3), bukan eksponensial. Backoff Airflow bersifat eksponensial.", correct: false },
          ],
        },
        {
          q: "Pipeline mati 3 hari karena server down. Cara mengisi 3 hari yang terlewat dengan benar?",
          options: [
            { text: "Tombol rerun manual 3x", why: "Salah — inilah pola Rp380 juta: manual, tidak berurutan, rawan salah tanggal.", correct: false },
            { text: "Backfill Airflow untuk rentang 3 hari — berurutan, dengan task idempotent", why: "Benar. Mesin waktu yang disiplin — tetapi HANYA aman bila task idempotent (Langkah 5).", correct: true },
            { text: "Abaikan — data 3 hari tidak penting", why: "Salah. Laporan berlubang 3 hari = keputusan berbasis data tak lengkap; rekonsiliasi bank tidak boleh berlubang.", correct: false },
            { text: "Jalankan 3x sekaligus paralel untuk tanggal berbeda", why: "Berisiko — paralel untuk tanggal berbeda bisa berebut resource/lock; backfill berurutan lebih aman untuk pipeline tulis.", correct: false },
          ],
        },
        {
          q: "Kapan cron LEBIH TEPAT daripada Airflow?",
          options: [
            { text: "Pipeline 8 langkah dengan dependensi kompleks", why: "Salah — inilah kasus kanonis Airflow.", correct: false },
            { text: "Satu script 5 menit tanpa dependensi; gagal = rerun manual sambil ngopi", why: "Benar (Skenario 1). Airflow = biaya infrastruktur; untuk 1 task tanpa dependensi biayanya tidak terbayar.", correct: true },
            { text: "Butuh backfill 30 hari ke belakang", why: "Salah — backfill adalah fitur Airflow; cron tidak punya konsepnya.", correct: false },
            { text: "Butuh retry selektif per task dengan alert", why: "Salah — retry selektif + alert = alasan memakai Airflow.", correct: false },
          ],
        },
      ],
      summary: [
        "DAG = task + panah dependensi tanpa siklus; scheduler = konduktor (topological sort).",
        "Retry hanya untuk kegagalan transien, dengan backoff membesar t_n = t_0 × 2^(n-1); error identik 3x = perbaiki akar masalah.",
        "Idempotency (tulis pakai kunci, mode timpa) adalah syarat retry dan backfill yang aman.",
        "Backfill = mesin waktu yang disiplin: bertahap, terverifikasi, dan dikomunikasikan.",
        "Keputusan: 1 task tanpa dependensi → cron; multi-langkah → Airflow; butuh detikan → streaming.",
      ],
      next: { label: "D20 — Docker & Git: Workflow Produksi", href: "/v2/learn/d20-docker-git-workflow" },
    },
  ],
};
