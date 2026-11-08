import type { V2Lesson } from "../lib/types";

// ── Figure: distribusi status code log API seminggu ───────────────────────
const STATUS_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Diagram batang distribusi status code HTTP selama seminggu: 200 sebanyak 12450, 422 sebanyak 312, 404 sebanyak 88, 500 sebanyak 7">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="64" y1="228" x2="536" y2="228"/>
<line x1="64" y1="182" x2="536" y2="182"/><line x1="64" y1="136" x2="536" y2="136"/>
<line x1="64" y1="90" x2="536" y2="90"/><line x1="64" y1="44" x2="536" y2="44"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="58" y="231">0</text><text x="58" y="185">3rb</text><text x="58" y="139">6rb</text>
<text x="58" y="93">9rb</text><text x="58" y="47">12rb</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="100" y="46" width="70" height="182" fill="var(--c1)" opacity="0.9"/>
<text x="135" y="38" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">12.450</text>
<text x="135" y="244" text-anchor="middle" fill="var(--text)">200</text>
<text x="135" y="258" text-anchor="middle" fill="var(--text-muted)">OK</text>
<rect x="220" y="223" width="70" height="5" fill="var(--c2)" opacity="0.9"/>
<text x="255" y="215" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">312</text>
<text x="255" y="244" text-anchor="middle" fill="var(--text)">422</text>
<text x="255" y="258" text-anchor="middle" fill="var(--text-muted)">validasi</text>
<rect x="340" y="226" width="70" height="2" fill="var(--c3)" opacity="0.9"/>
<text x="375" y="215" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">88</text>
<text x="375" y="244" text-anchor="middle" fill="var(--text)">404</text>
<text x="375" y="258" text-anchor="middle" fill="var(--text-muted)">salah alamat</text>
<rect x="460" y="227" width="70" height="1" fill="var(--c4)" opacity="0.9"/>
<text x="495" y="215" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">7</text>
<text x="495" y="244" text-anchor="middle" fill="var(--text)">500</text>
<text x="495" y="258" text-anchor="middle" fill="var(--text-muted)">server error</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="64" y="28">12.857 request seminggu ke API NPL internal (contoh log)</text>
</g>
</svg>`;

const LAB_SETUP = `# Mini-framework ala FastAPI (pola 1:1: decorator route + validasi + status code)
# FastAPI ASLI butuh server (uvicorn) — di sini kita simulasikan LOGIKANYA:
# routing, validasi input, dan status code yang jujur.

ROUTES = {}  # (method, path) -> fungsi handler

DATA_NPL = {"mikro": (48, 1000), "ritel": (96, 4000), "korporat": (30, 1500)}
SEGMEN_VALID = {"mikro", "ritel", "korporat"}
TENOR_VALID = {6, 12, 24, 36}


def route(method, path):
    def deco(fn):
        ROUTES[(method, path)] = fn
        return fn
    return deco


def minta(method, path, params):
    """Simulasi satu HTTP request. Kembalikan (status, body)."""
    handler = ROUTES.get((method, path))
    if handler is None:
        return 404, {"error": "endpoint tidak dikenal"}
    try:
        return handler(params)
    except ValueError as e:
        return 422, {"error": str(e)}
    except Exception:
        return 500, {"error": "kesalahan server"}
`;

export const d18: V2Lesson = {
  slug: "d18-fastapi-rest-api",
  track: "Python",
  module: "Rekayasa",
  title: "D18 — FastAPI & REST API: Python yang Melayani Request",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "NPL 0% — angka paling berbahaya minggu itu",
      prose: [
        "Rina, analis kredit sebuah bank daerah, punya ritual Senin pagi: menjalankan notebook, mengekspor angka NPL per segmen ke Excel, lalu mengirimnya ke grup WhatsApp direksi. Suatu hari direksi meminta “tombol refresh” di dashboard internal — tidak mau lagi menunggu Rina. Tim IT membangunkan endpoint GET /api/npl?segmen=mikro: dashboard memanggilnya, Python menghitung dari database, angka tampil otomatis. Rina lega; ritual Senin pagi tamat.",
        "Suatu Senin, database menjalani maintenance — query gagal total. Dashboard tetap menampilkan angka, rapi dan meyakinkan: NPL 0,0% untuk semua segmen. Direksi membaca “portofolio sehat sempurna” dan menunda rapat pencadangan. Seminggu kemudian angka riil muncul: 4,8%. Selisihnya bukan sekadar malu — keputusan pencadangan tertunda seminggu.",
        "Twist-nya: endpoint itu tidak pernah error. Saat query gagal, kode menangkap exception dan mengembalikan HTTP 200 dengan body {\"npl_rate\": 0.0} — “biar dashboard tidak menampilkan halaman error”. Sang programmer berniat baik: ia mengira error yang terlihat itu buruk. Padahal yang terjadi justru sebaliknya: status 200 adalah KONTRAK yang berbunyi “request sukses, data ini benar”. Berbohong dengan status 200 jauh lebih berbahaya daripada jujur dengan 500 — karena tidak ada yang curiga pada angka yang rapi. Lesson ini tentang membangun API yang jujur: REST, status code, dan FastAPI.",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran tentang lab lesson ini",
        type: "risk",
        body: "FastAPI ASLI berjalan sebagai server (perintah: uvicorn main:app --reload) dan butuh jaringan — tidak tersedia di lab browser. Lab memakai mini-framework Python murni dengan POLA 1:1 FastAPI: decorator @route seperti @app.get, validasi yang melempar ValueError seperti Pydantic melempar 422, dan fungsi minta() seperti HTTP request. Salin kode lab ke file main.py di laptop, ganti @route dengan @app.get/@app.post dari fastapi, dan ia menjadi API sungguhan.",
      },
      reference: "Status 200 yang berbohong lebih berbahaya dari 500 yang jujur. API = kontrak; status code = bahasanya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita NPL 0%. (2) Peta ini. (3) Konsep: REST — Si Pelayan Restoran yang Sopan. (4) Konsep: status code — Si Lampu Lalu Lintas. (5) Konsep: FastAPI — Si Resepsionis Super Cepat (+ hukum Little untuk kapasitas). (6) Lab: bangun mini-API NPL yang jujur. (7) Chart: membaca 12.857 baris log status code. (8) Peta keputusan: kapan REST, kapan tidak. (9) Mini-case: API limit kredit mikro. (10) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) merancang endpoint REST dengan penamaan resource yang benar; (2) memilih status code yang jujur untuk tiap kegagalan (400/404/422/500); (3) menulis endpoint FastAPI dengan validasi Pydantic dan dependency; (4) memperkirakan kebutuhan worker dengan hukum Little sebelum go-live.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: def nama(arg): mendefinisikan fungsi; dict {\"kunci\": nilai} untuk data; try/except ValueError untuk menangkap kesalahan validasi; decorator adalah fungsi yang membungkus fungsi lain (pola @route di lab). Tidak perlu pengalaman web development.",
        "Rutenya: cerita → peta → tiga konsep inti → lab → chart log → peta keputusan → mini-case → kuis. Estimasi 65 menit; lab ±15 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap API sebagai RESTORAN. Klien (dashboard) adalah tamu yang memesan dari menu (endpoint). Dapur (Python + database) memasak. Status code adalah pelayan yang melaporkan: “pesanan siap” (200), “maaf, menu itu tidak ada” (404), “dapur kebakaran” (500). Pelayan yang melaporkan “pesanan siap” sambil menyajikan piring kosong — itulah bug cerita pembuka.",
      ],
      reference: "Tujuan: desain REST + status code jujur + FastAPI + hukum Little. Pola lab 1:1 dengan FastAPI asli.",
    },
    {
      id: "konsep-rest",
      eyebrow: "Langkah 3 · Konsep",
      title: "REST — Si Pelayan Restoran yang Sopan",
      prose: [
        "Definisi: REST (Representational State Transfer) adalah gaya arsitektur API berbasis sumber daya (resource): setiap “benda” punya alamat URL, dan kata kerja HTTP menentukan aksinya. GET /npl?segmen=mikro = “ambilkan angka NPL segmen mikro”. POST /pengajuan = “buatkan pengajuan baru”. Aturan penamaan: resource itu KATA BENDA (nouns) — /nasabah/123, /npl — bukan kata kerja. Kata kerjanya sudah diwakili method: GET (ambil), POST (buat), PUT (ganti utuh), DELETE (hapus). Contoh benar: GET /nasabah/123. Contoh salah: GET /ambilNasabah?id=123 — itu seperti berteriak “AMBILKAN!” ke pelayan yang sudah tahu tugasnya mengambil.",
        "Kepribadiannya: REST adalah pelayan restoran yang sopan dan literal. Ia melakukan PERSIS yang diminta — tidak menebak, tidak menambahkan. Kamu memesan “nasi goreng” (GET /npl), ia tidak akan membawakan “nasi goreng spesial plus analisis tren” — kalau mau yang spesial, pesan dari menu yang benar (endpoint yang benar). Sifat literal inilah yang membuat API bisa diandalkan: dashboard tahu persis apa yang akan diterima. Dan sifat inilah yang dilanggar kode cerita pembuka: pelayan yang menyajikan piring kosong sambil berkata “pesanan siap”.",
        "Kapan memakai: ketika DUA program perlu bicara tanpa manusia di tengah — dashboard ke Python, aplikasi mobile ke server, satu microservice ke microservice lain. Tiga sifat request yang sehat: (1) stateless — setiap request membawa semua info yang dibutuhkan (tidak ada “ingat saya dari tadi”); (2) idempoten untuk GET/PUT/DELETE — diulang 3x hasilnya sama (penting saat jaringan goyah); (3) respons terstruktur — JSON dengan bentuk yang konsisten, bukan kadang dict kadang string.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “REST = API yang pakai JSON”",
        type: "pitfall",
        body: "Yang benar: REST adalah GAYA ARSITEKTUR (resource + method + stateless), JSON hanyalah FORMAT data yang umum dipakai. API yang mengembalikan JSON tapi endpoint-nya GET /doHitungNpl?x=1 (kata kerja di URL, semua via GET) bukan REST — itu RPC berkedok JSON. Pewawancara backend membedakan keduanya; pakai istilah dengan tepat.",
      },
      hints: [
        "💡 Intuisi resource: kalau URL-mu mengandung kata kerja (get, hitung, proses, kirim), berhentilah — pindahkan kata kerja itu ke HTTP method, sisakan kata benda di URL. GET /laporan/npl?segmen=mikro, bukan GET /hitungLaporanNpl.",
      ],
      reference: "REST = resource (kata benda di URL) + method (kata kerja HTTP) + stateless. Pelayan yang literal: melakukan persis yang dipesan.",
    },
    {
      id: "konsep-status",
      eyebrow: "Langkah 4 · Konsep",
      title: "Status Code — Si Lampu Lalu Lintas",
      prose: [
        "Definisi: status code adalah angka 3 digit di setiap respons HTTP yang menyatakan HASIL request — kontrak antara server dan klien. Keluarga 2xx (hijau): sukses — 200 OK (“ini datanya”), 201 Created (“sudah dibuat”, untuk POST). Keluarga 4xx (kuning): salahmu, wahai klien — 400 Bad Request (format kacau), 404 Not Found (alamat tidak ada), 422 Unprocessable Entity (format benar tapi isi tidak valid — mis. plafon = -5). Keluarga 5xx (merah): salahku, wahai server — 500 Internal Server Error (kodeku crash), 503 Service Unavailable (DB maintenance — persis kasus cerita pembuka).",
        "Kepribadiannya: status code adalah lampu lalu lintas di perempatan. Hijau = jalan (pakai datanya). Kuning = hati-hati, periksa kendaraanmu (perbaiki request-mu). Merah = berhenti, ada kecelakaan di depan (jangan pakai datanya, tunggu kabar). Kode cerita pembuka mematikan lampu merah dan menyalakan hijau permanen — lalu lintas (keputusan direksi) melaju ke perempatan yang sebenarnya macet total. Lampu yang selalu hijau bukan lampu yang baik; ia lampu yang RUSAK.",
        "Kapan memakai: setiap cabang kegagalan di handler-mu harus memetakan ke SATU status yang jujur. Aturan praktis: validasi gagal → 422 (jangan 200 dengan pesan error di body — klien otomatis tidak akan cek body bila status 200); resource tidak ada → 404; exception tak terduga → 500 (dan LOG stack trace-nya, jangan ditelan); dependensi mati (DB maintenance) → 503 dengan header Retry-After. FastAPI melakukan sebagian otomatis: Pydantic gagal → 422; exception tak tertangkap → 500.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Yang penting body-nya benar, status code formalitas”",
        type: "pitfall",
        body: "Yang benar: kebanyakan klien OTOMATIS hanya memeriksa status code — library HTTP melempar exception untuk 4xx/5xx dan menganggap 200 = aman. Body hanya dibaca bila status 2xx. Mengembalikan 200 + {\"error\": \"...\"} berarti error-mu TIDAK TERLIHAT oleh semua klien standar. Inilah tepatnya bug cerita pembuka: dashboard tidak pernah membaca body error karena statusnya 200.",
      },
      hints: [
        "💡 Intuisi 422 vs 400: 400 = “suratmu sobek, tidak bisa dibaca” (JSON tidak valid). 422 = “suratmu rapi, tapi isinya ngawur” (JSON valid, plafon = -5). Keduanya salah klien, tetapi 422 memberi tahu PERSIS di mana letak ngawurnya — jauh lebih membantu debugging.",
      ],
      reference: "2xx = sukses, 4xx = salah klien (422 untuk isi tak valid), 5xx = salah server. Jangan pernah berbohong dengan 200.",
    },
    {
      id: "konsep-fastapi",
      eyebrow: "Langkah 5 · Konsep",
      title: "FastAPI — Si Resepsionis Super Cepat",
      prose: [
        "Definisi: FastAPI adalah framework Python untuk membangun API: kamu menulis fungsi Python biasa, menempelkan decorator @app.get(\"/npl\"), dan ia menjadi endpoint HTTP. Tiga senjatanya: (1) Decorator routing — @app.get, @app.post memetakan URL+method ke fungsi; parameter fungsi otomatis dibaca dari path/query/body. (2) Pydantic validation — “penjaga pintu”: kamu deklarasikan class Pengajuan(BaseModel) dengan plafon: float = Field(gt=0); data masuk yang melanggar DITOLAK OTOMATIS dengan 422 + rincian field yang salah — tanpa satu pun if manual. (3) Dependency injection — Depends(get_db): “kunci yang dipinjamkan ke setiap tamu lalu dikembalikan” — koneksi DB dibuka sebelum handler, ditutup sesudahnya, otomatis, untuk setiap request.",
        "Kepribadiannya: FastAPI adalah resepsionis hotel super cepat. Tamu (request) datang → resepsionis memeriksa KTP di pintu (Pydantic: tipe dan aturan) → yang KTP-nya palsu ditolak di lobi dengan surat penolakan rinci (422) tanpa mengganggu tamu lain → yang lolos diberi kunci kamar (dependency: koneksi DB) → diantar ke kamarnya (handler) → kunci dikembalikan saat check-out. Resepsionis tidak pernah membiarkan tamu tanpa KTP masuk ke kamar — dan tidak pernah membiarkan kunci hilang.",
        "Kapan memakai: FastAPI bersinar untuk API data/ML internal: dashboard direksi, scoring service, webhook. Ia kurang cocok untuk: halaman web penuh (pakai framework frontend), atau request yang butuh >30 detik (pakai background task — resepsionis tidak boleh menahan antrean). Sebelum go-live, perkirakan kapasitas dengan hukum Little di bawah — jangan sampai resepsionis kewalahan saat rapat direksi.",
      ],
      formula: String.raw`L = \lambda \times W`,
      formulaNote: "Hukum Little untuk kapasitas API. L = jumlah request yang sedang diproses BERSAMAAN di server; λ (lambda) = laju kedatangan request per detik; W = waktu respons rata-rata satu request dalam detik. Interpretasi: L adalah jumlah “tamu yang sedang dilayani” — inilah jumlah worker yang kamu butuhkan. Contoh angka: dashboard direksi memanggil 50 request/menit (λ = 0,83/detik), tiap request 0,4 detik (W) → L = 0,33 → 1 worker cukup. Saat rapat direksi: 600 request/menit (λ = 10/detik), W tetap 0,4 → L = 4 → butuh minimal 4 worker, kalau tidak antrean menumpuk dan request timeout. Hitung DULU, deploy KEMUDIAN.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Validasi = menulis banyak if di awal fungsi”",
        type: "pitfall",
        body: "Yang benar: di FastAPI, validasi DIDEKLARASIKAN sekali di model Pydantic (plafon: float = Field(gt=0, le=10_000_000_000)), bukan ditulis sebagai if berulang di setiap endpoint. Keuntungannya tiga: (1) konsisten di semua endpoint; (2) error 422 otomatis berisi NAMA field yang salah; (3) dokumentasi API (/docs) tergenerate otomatis dari model yang sama — satu sumber kebenaran, bukan tiga tempat yang bisa basi.",
      },
      hints: [
        "💡 Intuisi dependency: Depends(get_db) seperti meminjam kunci kamar — resepsionis (FastAPI) yang mengurus ambil-kembali. Handler-mu hanya menerima db yang sudah siap. Pola yang sama dipakai untuk autentikasi: Depends(cek_token) menolak tamu tanpa KTP SEBELUM mencapai handler.",
      ],
      reference: "FastAPI = decorator routing + Pydantic (penjaga pintu, 422 otomatis) + Depends (kunci dipinjamkan). Kapasitas: L = λ × W, hitung sebelum go-live.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun mini-API NPL yang jujur",
      prose: [
        "Waktunya praktik dengan pola 1:1 FastAPI. ROUTES, DATA_NPL, dan fungsi minta() sudah disediakan (di FastAPI asli, perannya digantikan @app.get/@app.post dan server uvicorn). Tugasmu: (1) tulis handler npl untuk GET /npl — validasi segmen, hitung npl_rate = macet/total dari DATA_NPL, kembalikan 200; (2) tulis handler pengajuan untuk POST /pengajuan — validasi plafon > 0 dan tenor di {6,12,24,36} dengan ValueError bila dilanggar (inilah peran Pydantic); (3) jalankan 4 skenario request dan pastikan status code-nya JUJUR: 200, 422, 404, 422.",
        "Perhatikan: validasi yang gagal melempar ValueError — dan minta() mengubahnya menjadi 422 OTOMATIS, persis seperti Pydantic di FastAPI. Kamu tidak menulis satu pun if untuk status code; kejujuran datang dari ARSITEKTUR, bukan dari ingatan.",
        "Coba: setelah semua lolos, tambahkan skenario kelima — GET /npl tanpa parameter segmen sama sekali. Status apa yang jujur? (Jawaban: 422 — parameter wajib yang hilang adalah “isi tak valid”, bukan “server error”.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis handler `npl(params)` untuk `GET /npl`: segmen harus di `SEGMEN_VALID` (ValueError bila tidak), kembalikan `(200, {\"segmen\": ..., \"npl_rate\": round(macet/total, 4)})`" },
        { id: "t2", text: "Tulis handler `pengajuan(params)` untuk `POST /pengajuan`: `plafon > 0` dan `tenor` di `TENOR_VALID` (ValueError bila dilanggar), kembalikan `(201, {\"status\": \"diterima\"})`" },
        { id: "t3", text: "Jalankan 4 skenario dan pastikan statusnya 200, 422, 404, 422 — tidak ada 200 yang berbohong" },
      ],
      expected: "GET /npl?segmen=mikro -> 200\nGET /npl?segmen=alien -> 422\nGET /rute-salah -> 404\nPOST /pengajuan plafon=-5 -> 422",
      code: {
        starter:
          LAB_SETUP +
          `
@route("GET", "/npl")
def npl(params):
    segmen = params.get("segmen")
    if segmen not in SEGMEN_VALID:
        raise ValueError("segmen harus salah satu dari mikro/ritel/korporat")
    macet, total = DATA_NPL[segmen]
    return 200, {"segmen": segmen, "npl_rate": round(macet / total, 4)}


@route("POST", "/pengajuan")
def pengajuan(params):
    if ...:
        raise ValueError("plafon harus > 0")
    if ...:
        raise ValueError("tenor harus 6/12/24/36")
    return 201, {"status": "diterima"}


s1 = minta("GET", "/npl", {"segmen": "mikro"})
s2 = minta("GET", "/npl", {"segmen": "alien"})
s3 = minta("GET", "/rute-salah", {})
s4 = minta("POST", "/pengajuan", {"plafon": -5, "tenor": 12})

print("GET /npl?segmen=mikro ->", s1[0])
print("GET /npl?segmen=alien ->", s2[0])
print("GET /rute-salah ->", s3[0])
print("POST /pengajuan plafon=-5 ->", s4[0])
kode = [s1[0], s2[0], s3[0], s4[0]]`,
        lockLines: 34,
        solution:
          LAB_SETUP +
          `
@route("GET", "/npl")
def npl(params):
    segmen = params.get("segmen")
    if segmen not in SEGMEN_VALID:
        raise ValueError("segmen harus salah satu dari mikro/ritel/korporat")
    macet, total = DATA_NPL[segmen]
    return 200, {"segmen": segmen, "npl_rate": round(macet / total, 4)}


@route("POST", "/pengajuan")
def pengajuan(params):
    if not params.get("plafon", 0) > 0:
        raise ValueError("plafon harus > 0")
    if params.get("tenor") not in TENOR_VALID:
        raise ValueError("tenor harus 6/12/24/36")
    return 201, {"status": "diterima"}


s1 = minta("GET", "/npl", {"segmen": "mikro"})
s2 = minta("GET", "/npl", {"segmen": "alien"})
s3 = minta("GET", "/rute-salah", {})
s4 = minta("POST", "/pengajuan", {"plafon": -5, "tenor": 12})

print("GET /npl?segmen=mikro ->", s1[0])
print("GET /npl?segmen=alien ->", s2[0])
print("GET /rute-salah ->", s3[0])
print("POST /pengajuan plafon=-5 ->", s4[0])
kode = [s1[0], s2[0], s3[0], s4[0]]`,
        checks: [
          { kind: "defined", task: "t1", name: "npl", label: "handler `npl` terdefinisi", msg: "Daftarkan dengan @route(\"GET\", \"/npl\")." },
          { kind: "defined", task: "t2", name: "pengajuan", label: "handler `pengajuan` terdefinisi", msg: "Daftarkan dengan @route(\"POST\", \"/pengajuan\")." },
          { kind: "equal", task: "t3", name: "kode", value: [200, 422, 404, 422], label: "4 status code jujur", msg: "Urutan yang benar: 200 (sukses), 422 (segmen tak valid), 404 (endpoint tak ada), 422 (plafon tak valid)." },
          { kind: "stdout_matches", task: "t3", pattern: "GET /npl\\?segmen=mikro -> 200", label: "Skenario 200 tercetak", msg: "Pastikan handler npl menghitung npl_rate dari DATA_NPL." },
          { kind: "stdout_matches", task: "t3", pattern: "-> 404", label: "Skenario 404 tercetak", msg: "Endpoint tak dikenal harus 404 — bukan 200 dengan pesan error." },
        ],
      },
      reference: "Pola FastAPI: @route = @app.get/@app.post; ValueError = Pydantic 422; minta() = HTTP request. Kejujuran dari arsitektur.",
    },
    {
      id: "chart-status",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca 12.857 baris log: apa kata status code?",
      prose: [
        "Chart di bawah adalah rekapitulasi satu minggu log API NPL internal (contoh) — 12.857 request, 4 status code.",
        "Cara membaca: sumbu Y = jumlah request (0–12 ribu); tiap batang = satu status code; label di bawah batang = arti singkatnya.",
        "Interpretasi: batang 200 yang dominan (12.450) itu SEHAT — API memang kebanyakan sukses. Yang menarik justru tiga batang kecil: 422 sebanyak 312 (2,4%) berarti klien SALAH MEMAKAI API secara sistematis — bukan salah ketik sesekali; kemungkinan besar dokumentasi parameter ambigu atau dashboard mengirim format lama — perbaiki dokumentasi/contoh request, bukan server. 404 sebanyak 88 = ada yang menebak-nebak URL — normal bila kecil, investigasi bila naik. 500 hanya 7 — kecil, tetapi SETIAP 500 adalah bug di pihak kita (cerita pembuka!) — 7 pun wajib diinvestigasi satu per satu karena tiap satunya berpotensi “NPL 0%”. Pelajaran chart: baca Ekornya, bukan puncaknya — informasi operasional bersembunyi di status non-200.",
      ],
      figure: {
        svg: STATUS_SVG,
        alt: "Diagram batang: 200 sebanyak 12.450, 422 sebanyak 312, 404 sebanyak 88, 500 sebanyak 7.",
        caption: "Distribusi status code seminggu (contoh). Baca ekornya: 422 = dokumentasi ambigu, 500 sekecil apa pun = bug kita.",
      },
      tasks: [],
      reference: "200 dominan = sehat. 422 sistematis = perbaiki dokumentasi. 500 sekecil apa pun = investigasi satu per satu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan REST, kapan tidak — lima skenario",
      prose: [
        "Lima skenario keputusan API untuk analis yang naik kelas ke backend:",
        "Skenario 1 — Dashboard direksi perlu angka NPL terbaru setiap dibuka, dipakai 5 orang tiap pagi. → Bangun REST API (GET /npl). Alasan: ditarik on-demand oleh program, bukan manusia — inilah kasus REST yang kanonis.",
        "Skenario 2 — Laporan OJK dikirim SEBULAN sekali sebagai file. → JANGAN bangun API; kirim file/CSV. Alasan: API adalah biaya perawatan (server, monitoring, versioning) — untuk frekuensi bulanan, file lebih murah dan lebih mudah diaudit.",
        "Skenario 3 — Input dari user eksternal (form pengajuan kredit online). → FastAPI + Pydantic WAJIB. Alasan: input liar harus divalidasi di pintu (422 otomatis); tanpa itu, data kotor masuk ke database dan menjadi bug 3 bulan kemudian.",
        "Skenario 4 — Butuh data REALTIME (harga bergerak tiap detik ke dashboard trading). → BUKAN REST polos; pakai WebSocket/streaming. Alasan: REST = request-response (tanya-jawab); untuk aliran kontinu, polling REST tiap detik boros dan telat.",
        "Skenario 5 — Satu request butuh komputasi 5 menit (skoring 1 juta nasabah). → JANGAN tahan request; kembalikan 202 Accepted + id pekerjaan, proses di background, klien polling status. Alasan: resepsionis (Langkah 5) tidak boleh menahan antrean — request HTTP yang menggantung 5 menit akan timeout dan di-retry klien, menggandakan pekerjaan.",
        "Aturan praktis 10 detik: (1) Yang bicara program-ke-program dan sering → REST. (2) Input dari luar → validasi di pintu (Pydantic). (3) Setiap kegagalan → status jujur, jangan 200 berbohong. (4) Lambat >30 detik → 202 + background. (5) Hitung worker dengan L = λ × W SEBELUM go-live.",
      ],
      tasks: [],
      reference: "REST untuk program-ke-program yang sering; file untuk bulanan; validasi di pintu; lambat → 202 + background.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: API limit kredit mikro — rancang 3 endpoint",
      prose: [
        "Kamu diminta merancang API internal “limit kredit mikro” untuk 40 analis cabang. Kebutuhan: (A) analis mengambil limit berjalan seorang debitur (baca, sering); (B) analis mengusulkan kenaikan limit (tulis, butuh validasi: kenaikan ≤ 20% dari limit berjalan dan tenor 6/12/24); (C) manajer menyetujui/menolak usulan (tulis, hanya manajer). Data: limit berjalan debitur D-8821 = Rp50.000.000.",
        "Pertanyaan analisis: (1) Tulis method + URL untuk A, B, C mengikuti konvensi REST — mana yang GET, mana yang POST/PUT? (2) Usulan kenaikan ke Rp65.000.000 untuk D-8821: lolos validasi atau 422? Hitung. (3) Request persetujuan dari analis biasa (bukan manajer): status code jujur apa — 404, 422, 403, atau 500? (4) Dengan hukum Little: 40 analis, tiap orang 3 request/menit saat jam sibuk, W = 0,3 detik — berapa worker minimal?",
        "Pembahasan: (1) A: GET /debitur/D-8821/limit (baca → GET, kata benda). B: POST /debitur/D-8821/usulan-limit (buat usulan baru → POST). C: PUT /usulan/USL-104/status (ubah status usulan → PUT; bukan POST karena idempoten — disetujui 2x hasilnya sama). (2) 65jt/50jt = 1,30 → kenaikan 30% > 20% → 422, dengan pesan “maksimal 20%”. (3) 403 Forbidden — BUKAN 404 (resource-nya ada) dan BUKAN 422 (datanya valid; yang salah adalah HAKNYA). Bedakan: 401 = belum login (tidak dikenal), 403 = sudah dikenal tapi tidak boleh. (4) λ = 40 × 3/60 = 2 req/detik; L = 2 × 0,3 = 0,6 → 1 worker cukup, sediakan 2 untuk cadangan.",
      ],
      tasks: [],
      reference: "GET untuk baca, POST untuk buat, PUT untuk ubah idempoten. 403 = tidak boleh (beda dengan 401/404/422).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah — dari status code hingga hukum Little. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Endpoint mengembalikan 200 dengan body {\"npl_rate\": 0.0} padahal query database-nya gagal. Apa masalah utamanya?",
          options: [
            { text: "Tidak ada — 200 berarti request sampai ke server dengan selamat", why: "Salah. 200 adalah KONTRAK “sukses, data ini benar” — klien otomatis memakainya. Inilah bug cerita pembuka (NPL 0%).", correct: false },
            { text: "Status berbohong: seharusnya 500/503 karena kegagalan di pihak server", why: "Benar. Query gagal = salah server → 500 (atau 503 saat maintenance). Status jujur membuat dashboard menampilkan error, bukan angka palsu.", correct: true },
            { text: "Seharusnya 404 karena datanya tidak ditemukan", why: "Salah. 404 = alamat/resource tidak ada. Datanya ADA (NPL segmen itu ada), yang gagal adalah PENGAMBILANNYA — itu 5xx.", correct: false },
            { text: "Seharusnya 422 karena 0.0 bukan angka valid", why: "Salah. 422 = input KLIEN tidak valid. Di sini input klien baik-baik saja; yang rusak adalah sisi server.", correct: false },
          ],
        },
        {
          q: "Mana desain endpoint REST yang benar untuk mengambil data nasabah?",
          options: [
            { text: "GET /ambilDataNasabah?id=123", why: "Salah. “ambil” adalah kata kerja — kata kerja sudah diwakili GET. Ini RPC berkedok URL.", correct: false },
            { text: "GET /nasabah/123", why: "Benar. Resource = kata benda (/nasabah/123), aksi = method (GET). Sopan dan literal seperti pelayan REST.", correct: true },
            { text: "POST /nasabah/123", why: "Salah. POST = membuat resource baru; untuk MENGAMBIL data pakai GET (yang juga idempoten dan bisa di-cache).", correct: false },
            { text: "GET /nasabah?id=123&aksi=ambil", why: "Salah. Parameter “aksi” mengulang peran method — redundan dan rawan salah tafsir.", correct: false },
          ],
        },
        {
          q: "Pydantic menolak body {\"plafon\": \"besar sekali\"} untuk field plafon: float. Status code yang dikembalikan FastAPI?",
          options: [
            { text: "200 dengan pesan error di body", why: "Salah — inilah pola “200 berbohong” yang dilarang Langkah 4.", correct: false },
            { text: "400 Bad Request", why: "Kurang tepat. 400 = format request kacau (JSON rusak). Di sini JSON-nya valid, hanya ISINYA tak valid.", correct: false },
            { text: "422 Unprocessable Entity", why: "Benar. Format benar, isi tak valid = 422 — lengkap dengan rincian field yang salah, otomatis dari Pydantic.", correct: true },
            { text: "500 Internal Server Error", why: "Salah. Input klien yang salah bukan kesalahan server — 5xx berarti “salahku”, padahal ini “salahmu”.", correct: false },
          ],
        },
        {
          q: "Hukum Little: API menerima λ = 2 request/detik, waktu respons rata-rata W = 0,5 detik. Berapa request bersamaan (L) — dan artinya?",
          options: [
            { text: "L = 4 — butuh 4 worker", why: "Salah hitung: 2 × 0,5 = 1, bukan 4.", correct: false },
            { text: "L = 1 — rata-rata hanya 1 request diproses bersamaan; 1 worker cukup (sediakan cadangan)", why: "Benar. L = λ × W = 2 × 0,5 = 1. Artinya satu worker rata-rata hanya melayani 1 tamu — kapasitas aman.", correct: true },
            { text: "L = 2,5 — butuh 3 worker", why: "Salah hitung dan salah tafsir satuan.", correct: false },
            { text: "Tidak bisa dihitung tanpa tahu jumlah user", why: "Salah. Hukum Little hanya butuh λ dan W — jumlah user tidak masuk rumus.", correct: false },
          ],
        },
        {
          q: "Operasi mana yang IDEMPOTEN — aman diulang 3x saat jaringan goyah?",
          options: [
            { text: "POST /pengajuan (buat pengajuan baru)", why: "Salah. POST umumnya TIDAK idempoten — diulang 3x bisa tercipta 3 pengajuan ganda.", correct: false },
            { text: "GET /npl?segmen=mikro", why: "Benar. GET hanya membaca — diulang 10x pun hasilnya sama. Inilah mengapa retry aman untuk GET.", correct: true },
            { text: "POST /transfer (kirim uang)", why: "Salah dan berbahaya — transfer ganda adalah mimpi buruk; butuh idempotency key khusus.", correct: false },
            { text: "Semua method HTTP idempoten bila servernya bagus", why: "Salah. Idempotency adalah SIFAT method (GET/PUT/DELETE ya, POST umumnya tidak) — bukan soal kualitas server.", correct: false },
          ],
        },
        {
          q: "Laporan OJK dikirim sebulan sekali sebagai file. Tim mengusulkan membangun REST API untuknya. Keputusan yang tepat?",
          options: [
            { text: "Setuju — API selalu lebih modern daripada file", why: "Salah. “Modern” bukan argumen arsitektur; API = biaya perawatan permanen.", correct: false },
            { text: "Tolak — untuk frekuensi bulanan, file/CSV lebih murah, lebih mudah diaudit, tanpa server yang dirawat", why: "Benar (Skenario 2 peta keputusan). REST untuk program-ke-program yang SERING; bulanan → file.", correct: true },
            { text: "Setuju — supaya terlihat canggih di depan regulator", why: "Salah. Regulator menilai ketepatan dan keterulangan, bukan kecanggihan stack.", correct: false },
            { text: "Tolak — REST API tidak bisa mengirim file", why: "Salah secara teknis (bisa, via response file) — tetapi bukan alasan arsitekturnya.", correct: false },
          ],
        },
      ],
      summary: [
        "REST = resource kata benda di URL + kata kerja di HTTP method + stateless; pelayan yang literal.",
        "Status code adalah kontrak: 2xx sukses, 4xx salah klien (422 = isi tak valid), 5xx salah server — jangan pernah berbohong dengan 200.",
        "FastAPI = @app.get/@app.post + Pydantic penjaga pintu (422 otomatis) + Depends kunci pinjaman; dokumentasi /docs gratis.",
        "Kapasitas sebelum go-live: L = λ × W (hukum Little); hitung worker dari laju dan waktu respons.",
        "Keputusan: REST untuk program-ke-program yang sering; file untuk bulanan; >30 detik → 202 + background; validasi selalu di pintu.",
      ],
      next: { label: "D19 — Apache Airflow: Orkestrasi Pipeline", href: "/v2/learn/d19-apache-airflow" },
    },
  ],
};
