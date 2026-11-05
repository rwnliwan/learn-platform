import type { V2Lesson } from "../lib/types";

export const d2: V2Lesson = {
  slug: "d2-struktur-data",
  track: "Python",
  module: "Dasar Python",
  title: "D2 Struktur Data, Comprehension & Menangani Error",
  estMinutes: 40,
  steps: [
    {
      id: "empat-struktur",
      eyebrow: "Langkah 1 · list, dict, tuple, set",
      title: "Cerita pembuka: 10.000 baris tanpa pandas?",
      prose: [
        "Sebelum pandas, analis memakai list of dicts: tiap baris adalah dict, tabel adalah list. Pola ini masih hidup untuk data kecil, respons API berformat JSON, dan sebagai cara berpikir tentang data terstruktur.",
        "Empat wadah, empat kegunaan: `list` untuk urutan yang bisa diubah, `dict` untuk pasangan kunci-nilai (satu baris data!), `tuple` untuk urutan tetap, `set` untuk keunikan. Pola tabel manual: `data = [{'nama': 'Andi', 'dpd': 0}, {...}]`, diakses dengan `data[0]['nama']` — ini mental model DataFrame.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata` dpd dari list of dicts `data`" },
        { id: "t2", text: "Kumpulkan `nama` yang dpd-nya di atas 30 ke list `bermasalah`" },
      ],
      expected: "rata=30.0  bermasalah=['Citra', 'Eko']",
      note: {
        title: "Sering salah",
        body: "Mengira dict tidak berurutan. Sejak Python 3.7, dict menjaga urutan insert. Mitos lama dari Python 2 — tapi jangan andalkan untuk sorting, urutkan eksplisit jika butuh.",
      },
      hints: [
        "Rata-rata: jumlahkan d['dpd'] untuk tiap d, bagi len(data).",
        "Comprehension dengan filter: [d['nama'] for d in data if d['dpd'] > 30].",
        "rata = sum(d['dpd'] for d in data) / len(data)",
      ],
      code: {
        starter: `data = [\n    {"nama": "Andi", "dpd": 0},\n    {"nama": "Budi", "dpd": 15},\n    {"nama": "Citra", "dpd": 45},\n    {"nama": "Dewi", "dpd": 0},\n    {"nama": "Eko", "dpd": 90},\n]\n\n# TULIS KODEMU\nrata = \nbermasalah = \n\nprint(f"rata={rata}  bermasalah={bermasalah}")`,
        lockLines: 7,
        solution: `data = [\n    {"nama": "Andi", "dpd": 0},\n    {"nama": "Budi", "dpd": 15},\n    {"nama": "Citra", "dpd": 45},\n    {"nama": "Dewi", "dpd": 0},\n    {"nama": "Eko", "dpd": 90},\n]\n\n# TULIS KODEMU\nrata = sum(d["dpd"] for d in data) / len(data)\nbermasalah = [d["nama"] for d in data if d["dpd"] > 30]\n\nprint(f"rata={rata}  bermasalah={bermasalah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rata", value: 30.0, tol: 1e-9, label: "`rata` seharusnya 30.0", msg: "(0+15+45+0+90)/5 = 30." },
          { kind: "equal", task: "t2", name: "bermasalah", value: ["Citra", "Eko"], label: "`bermasalah` = ['Citra', 'Eko']", msg: "Hanya Citra (45) dan Eko (90) yang di atas 30." },
          { kind: "stdout_matches", task: "t2", pattern: "rata=30\\.0", label: "`print` menampilkan rata-rata", msg: "Format: rata=...  bermasalah=... ." },
        ],
      },
      reference: "data[0]['nama'] untuk akses. sum(...) / len(...) untuk rata-rata.",
    },
    {
      id: "comprehension",
      eyebrow: "Langkah 2 · Comprehension",
      title: "Transformasi satu baris",
      prose: [
        "Comprehension adalah cara pythonic mengubah list: `[x**2 for x in range(5)]` menggantikan loop 3 baris. Tambahkan filter: `[x for x in range(10) if x % 2 == 0]`. Ada juga dict comprehension: `{d: 'lancar' if d == 0 else 'telat' for d in [0, 15, 45]}`.",
        "Aturannya: untuk tiap x hitung y, tulis comprehension, bukan loop. Tapi jangan bersarang 3 level — keterbacaan mengalahkan kepintaran.",
      ],
      tasks: [
        { id: "t1", text: "Buat `kuadrat_genap` = kuadrat dari x genap di range(10)" },
        { id: "t2", text: "Buat `peta` = dict {nama: bucket} dari `data` (dpd 0 -> lancar, else telat)" },
      ],
      expected: "kuadrat_genap=[0, 4, 16, 36, 64]",
      note: {
        title: "Sering salah",
        body: "Menulis comprehension bersarang yang tidak terbaca, atau memakai comprehension untuk efek samping (mis. print di dalam). Comprehension untuk membangun nilai baru — bukan pengganti loop untuk aksi.",
      },
      hints: [
        "Pola: [ekspresi for x in data if kondisi].",
        "x genap: x % 2 == 0; kuadrat: x**2.",
        "kuadrat_genap = [x**2 for x in range(10) if x % 2 == 0]",
      ],
      code: {
        starter: `data = [{"nama": "Andi", "dpd": 0}, {"nama": "Budi", "dpd": 45}]\n\n# TULIS KODEMU\nkuadrat_genap = \npeta = \n\nprint(f"kuadrat_genap={kuadrat_genap}")\nprint(f"peta={peta}")`,
        lockLines: 1,
        solution: `data = [{"nama": "Andi", "dpd": 0}, {"nama": "Budi", "dpd": 45}]\n\n# TULIS KODEMU\nkuadrat_genap = [x**2 for x in range(10) if x % 2 == 0]\npeta = {d["nama"]: ("lancar" if d["dpd"] == 0 else "telat") for d in data}\n\nprint(f"kuadrat_genap={kuadrat_genap}")\nprint(f"peta={peta}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kuadrat_genap", value: [0, 4, 16, 36, 64], label: "`kuadrat_genap` benar", msg: "x genap 0,2,4,6,8 dikuadratkan." },
          { kind: "equal", task: "t2", name: "peta", value: {"Andi": "lancar", "Budi": "telat"}, label: "`peta` benar", msg: "Andi dpd 0 -> lancar; Budi dpd 45 -> telat." },
        ],
      },
      reference: "[ekspresi for x in data if kondisi]. Dict: {k: v for ...}.",
    },
    {
      id: "dict-get",
      eyebrow: "Langkah 3 · dict sebagai lookup",
      title: "Ganti rantai if dengan dict",
      prose: [
        "Sepuluh kode kota berarti sepuluh `elif` — atau satu dict. `kota = {'JKT': 'Jakarta', 'SBY': 'Surabaya'}` lalu `kota.get(kode, 'Tidak dikenal')` adalah lookup yang tidak meledak: kunci hilang mengembalikan default, bukan KeyError.",
        "Mapping = dict, pilihan = if. Dict juga lebih cepat: O(1) lawan O(n) untuk rantai elif.",
      ],
      tasks: [
        { id: "t1", text: "Ambil nama kota untuk kode 'SBY' memakai `.get`" },
        { id: "t2", text: "Ambil nama kota untuk kode 'MKS' (tidak ada) dengan default 'Tidak dikenal'" },
      ],
      expected: "SBY=Surabaya  MKS=Tidak dikenal",
      note: {
        title: "Sering salah",
        body: "Memakai `kota[kode]` langsung lalu kaget dengan KeyError saat kode tak dikenal. Untuk data nyata yang selalu punya nilai tak terduga, `.get(kunci, default)` adalah kebiasaan yang benar.",
      },
      hints: [
        "Sintaks: kota.get(kode, default).",
        "Untuk MKS, default-nya 'Tidak dikenal'.",
        "nama1 = kota.get('SBY', 'Tidak dikenal')",
      ],
      code: {
        starter: `kota = {'JKT': 'Jakarta', 'SBY': 'Surabaya', 'BDG': 'Bandung'}\n\n# TULIS KODEMU\nnama1 = \nnama2 = \n\nprint(f"SBY={nama1}  MKS={nama2}")`,
        lockLines: 1,
        solution: `kota = {'JKT': 'Jakarta', 'SBY': 'Surabaya', 'BDG': 'Bandung'}\n\n# TULIS KODEMU\nnama1 = kota.get('SBY', 'Tidak dikenal')\nnama2 = kota.get('MKS', 'Tidak dikenal')\n\nprint(f"SBY={nama1}  MKS={nama2}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nama1", value: "Surabaya", label: "`nama1` = Surabaya", msg: "Kode SBY ada di dict." },
          { kind: "equal", task: "t2", name: "nama2", value: "Tidak dikenal", label: "`nama2` = default", msg: "Kode MKS tidak ada -> default, bukan KeyError." },
          { kind: "stdout_matches", task: "t2", pattern: "SBY=Surabaya\\s+MKS=Tidak dikenal", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "dict.get(kunci, default) — lookup yang tidak meledak.",
    },
    {
      id: "try-except",
      eyebrow: "Langkah 4 · Error handling",
      title: "Program tahan data kotor",
      prose: [
        "Data gaji nyata: '8,500,000', 'tidak tahu', None, '12000000', string kosong. `try/except` membungkus parsing: coba konversi, gagal jadi None — bukan crash.",
        "Aturannya: sebutkan jenis errornya (`except (ValueError, AttributeError)`), jangan `except:` kosong yang menangkap bug juga. Dan bedakan peran: parsing toleran (try/except jadi None), validasi bisnis ketat (if jadi raise).",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `parse_gaji(s)` yang mengembalikan float atau None" },
        { id: "t2", text: "Hitung `n_valid` dan `rata_valid` dari list `kotor`" },
      ],
      expected: "n_valid=2  rata_valid=10250000",
      note: {
        title: "Sering salah",
        body: "Memakai `except:` polos tanpa jenis error. Ia menyembunyikan bug asli seperti typo nama variabel. Selalu sebutkan jenisnya: `except (ValueError, AttributeError)`.",
      },
      hints: [
        "Di dalam try: return float(str(s).replace(',', '')).",
        "except (ValueError, AttributeError): return None.",
        "n_valid = sum(1 for x in bersih if x is not None)",
      ],
      code: {
        starter: `def parse_gaji(s):\n    # TULIS KODEMU: coba parse, gagal -> None\n    \n\nkotor = ["8,500,000", "tidak tahu", None, "12000000", ""]\nbersih = [parse_gaji(x) for x in kotor]\nvalid = [x for x in bersih if x is not None]\nn_valid = len(valid)\nrata_valid = sum(valid) / n_valid\n\nprint(f"n_valid={n_valid}  rata_valid={rata_valid:.0f}")`,
        lockLines: 0,
        solution: `def parse_gaji(s):\n    # TULIS KODEMU: coba parse, gagal -> None\n    try:\n        return float(str(s).replace(",", ""))\n    except (ValueError, AttributeError):\n        return None\n\nkotor = ["8,500,000", "tidak tahu", None, "12000000", ""]\nbersih = [parse_gaji(x) for x in kotor]\nvalid = [x for x in bersih if x is not None]\nn_valid = len(valid)\nrata_valid = sum(valid) / n_valid\n\nprint(f"n_valid={n_valid}  rata_valid={rata_valid:.0f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "parse_gaji", label: "`parse_gaji` terdefinisi", msg: "Definisikan fungsi parse_gaji." },
          { kind: "equal", task: "t2", name: "n_valid", value: 2, tol: 1e-9, label: "`n_valid` = 2", msg: "Hanya '8,500,000' dan '12000000' yang valid." },
          { kind: "equal", task: "t2", name: "rata_valid", value: 10250000.0, tol: 1e-9, label: "`rata_valid` = 10250000", msg: "(8500000 + 12000000) / 2." },
          { kind: "stdout_matches", task: "t2", pattern: "n_valid=2\\s+rata_valid=10250000", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "try: ... except (JenisError,): ... — EAFP: coba dulu, tangani gagalnya.",
    },
    {
      id: "file-io",
      eyebrow: "Langkah 5 · File & JSON",
      title: "CSV dan JSON: pintu data",
      prose: [
        "Respons API datang sebagai string JSON — `json.loads` mengubahnya jadi dict Python. File CSV dibaca baris per baris dengan `csv.DictReader`, selalu di dalam `with open(...)` agar file tertutup otomatis.",
        "Di runtime ini file ditulis ke memori virtual; di kerja nyata, file ada di lokal atau server. Nanti pandas membuat semua ini satu baris: `pd.read_csv(...)`.",
      ],
      tasks: [
        { id: "t1", text: "Parse `respon` (string JSON) jadi dict `data`" },
        { id: "t2", text: "Ambil list `ids` dari `data['data']` dalam 1 baris" },
      ],
      expected: "nama=Budi  ids=[1, 2]",
      note: {
        title: "Sering salah",
        body: "Lupa `with open(...)` dan membiarkan file handle terbuka, atau mengira `json.loads` bisa membaca file langsung (itu `json.load`, tanpa s — untuk file object).",
      },
      hints: [
        "import json, lalu json.loads(respon).",
        "ids = [r['id'] for r in data['data']].",
        "data = json.loads(respon)",
      ],
      code: {
        starter: `import json\n\nrespon = '{"nama": "Budi", "dpd": 15, "data": [{"id": 1}, {"id": 2}]}'\n\n# TULIS KODEMU\ndata = \nids = \n\nprint(f"nama={data['nama']}  ids={ids}")`,
        lockLines: 3,
        solution: `import json\n\nrespon = '{"nama": "Budi", "dpd": 15, "data": [{"id": 1}, {"id": 2}]}'\n\n# TULIS KODEMU\ndata = json.loads(respon)\nids = [r["id"] for r in data["data"]]\n\nprint(f"nama={data['nama']}  ids={ids}")`,
        checks: [
          { kind: "defined", task: "t1", name: "data", label: "`data` terdefinisi", msg: "Parse string JSON dengan json.loads." },
          { kind: "equal", task: "t2", name: "ids", value: [1, 2], label: "`ids` = [1, 2]", msg: "Ambil 'id' dari tiap elemen data['data']." },
          { kind: "stdout_matches", task: "t2", pattern: "nama=Budi\\s+ids=\\[1, 2\\]", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "json.loads(str) untuk string; with open(...) as f untuk file.",
    },
    {
      id: "minicase-pembersih",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Pembersih data gaji: kembalikan status",
      prose: [
        "File CSV 1.000 baris, kolom gaji berantakan: '8,500,000', '8.5jt', 'tidak tahu', kosong, '-5000'. Fungsi cleaning yang baik tidak hanya mengembalikan nilai — ia mengembalikan (nilai, status): 'ok', 'kotor', atau 'invalid'.",
        "Status memungkinkan laporan kualitas: 5% kotor, 1% invalid. Cleaning tanpa metrik tidak terukur. Pola ini dipakai lagi di D5 untuk audit cleaning penuh.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di risiko kredit, data gaji yang dibersihkan diam-diam tanpa status menyembunyikan kualitas input model. Fungsi yang mengembalikan (nilai, status) memberi audit trail: berapa persen data yang diimputasi atau ditolak — angka yang direksi berhak tahu.",
      },
      reference: "Fungsi cleaning ideal: return (nilai, status) — bukan nilai saja.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi",
      title: "Intuisi: struktur data adalah keputusan desain pertama, bukan detail",
      prose: [
        "Struktur data yang salah membuat kode benar menjadi lambat; struktur data yang benar membuat kode sederhana menjadi cepat.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: struktur data adalah keputusan desain pertama, bukan detail",
        body: "Analis senior memilih struktur data SEBELUM menulis loop — karena struktur menentukan kompleksitas, bukan sebaliknya. Heuristik intinya: bila kamu mencari sesuatu berulang kali, itu dict, bukan list. Memetakan 1 juta kode transaksi dengan pemindaian list adalah O(n) per pencarian — sejuta pencarian berarti triliunan operasi; dengan dict sebagai lookup, tiap pencarian O(1) dan totalnya linear. Pola emas analis: dict untuk mapping (kode → nama, id → limit), dict.get(kunci, default) agar kode tidak mati saat kunci tak dikenal, set untuk keanggotaan dan dedup (x in himpunan jauh lebih cepat dari x in list_besar), tuple untuk record yang tidak boleh berubah, list comprehension untuk transformasi satu-baris yang masih terbaca. Heuristik kedua: JSON dari API pada dasarnya dict/list bersarang — jadi penguasaan dict adalah penguasaan 90% integrasi API. Heuristik ketiga: bila dict-mu bersarang lebih dari 2 level, itu sinyal struktur datamu butuh dipikirkan ulang — atau sudah waktunya jadi DataFrame. Dan waspada mutasi: dict/list diteruskan ke fungsi by reference — fungsi yang mengubah argumennya diam-diam adalah sumber bug \"kok datanya berubah sendiri\" yang paling sulit dilacak.",
      },
      reference: "Cari berulang = dict (O(1)); mapping pakai .get(); JSON = dict bersarang; waspada mutasi by reference.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "dict sejak Python 3.7...",
          options: [
            { text: "Acak seperti dulu", why: "Itu perilaku Python 2. Sejak 3.7 dict menjaga urutan insert." },
            { text: "Menjaga urutan insert", why: "Mitos 'dict acak' sudah usang sejak Python 3.7.", correct: true },
            { text: "Tersortir otomatis", why: "Tidak — urutan insert, bukan urutan sort." },
            { text: "Tidak bisa diubah", why: "Itu tuple. Dict bisa diubah." },
          ],
        },
        {
          q: "[x**2 for x in range(5) if x % 2 == 0] menghasilkan...",
          options: [
            { text: "[0, 1, 4, 9, 16]", why: "Itu tanpa filter. Filter x % 2 == 0 membuang yang ganjil." },
            { text: "[0, 4, 16]", why: "x genap: 0, 2, 4 — dikuadratkan jadi 0, 4, 16.", correct: true },
            { text: "[0, 2, 4]", why: "Itu sebelum dikuadratkan." },
            { text: "Error", why: "Sintaksnya valid." },
          ],
        },
        {
          q: "except: kosong tanpa jenis error...",
          options: [
            { text: "Praktik yang baik", why: "Tidak — ia menangkap bug juga, termasuk typo variabel." },
            { text: "Buruk — sebutkan jenis errornya", why: "except polos menyembunyikan bug asli. Tangkap spesifik.", correct: true },
            { text: "Lebih cepat", why: "Kecepatan bukan alasannya; kebenaran yang jadi soal." },
            { text: "Wajib di tiap fungsi", why: "Tidak wajib; pakai saat menangani data kotor." },
          ],
        },
        {
          q: "json.loads dipakai untuk...",
          options: [
            { text: "Menulis file", why: "Itu json.dump." },
            { text: "Parse string JSON (respons API) jadi dict", why: "API mengembalikan string JSON — loads mengubahnya jadi struktur Python.", correct: true },
            { text: "Menghitung statistik", why: "Tidak ada hubungannya." },
            { text: "Membuat chart", why: "Tidak ada hubungannya." },
          ],
        },
      ],
      summary: [
        "list/dict/tuple/set: pilih sesuai kebutuhan; list of dicts = mental model tabel.",
        "Comprehension: transformasi 1 baris — [ekspresi for x in data if kondisi].",
        "dict.get(kunci, default): lookup yang tidak meledak.",
        "try/except untuk parsing toleran (jadi None); if/raise untuk validasi ketat.",
        "Fungsi cleaning mengembalikan (nilai, status) untuk laporan kualitas.",
      ],
      next: { label: "D3 — NumPy", href: "/learn/d3-numpy" },
    },
  ],
};
