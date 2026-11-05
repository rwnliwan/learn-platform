import type { V2Lesson } from "../lib/types";

export const mle24: V2Lesson = {
  slug: "mle24-software-engineering-ml",
  track: "Machine Learning Engineer",
  module: "Fondasi Produksi",
  title: "MLE24 — Software Engineering untuk ML",
  estMinutes: 65,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Software biasa gagal dengan berisik: crash, error, stack trace. Sistem ML gagal dengan diam-diam: kode berjalan sempurna, tetapi data bergeser, seed berubah, atau dependensi naik versi — dan angkanya meleset tanpa peringatan.",
        "Tujuan lesson ini:",
        "• Menyusun struktur proyek ML yang memisahkan eksperimen, data, dan produksi.",
        "• Me-refactor notebook menjadi modul yang bisa diuji, diimpor, dan dijadwalkan.",
        "• Menulis test bertingkat untuk ML: unit, data, dan perilaku model.",
        "• Memakai checklist code review khusus ML: leakage, seed, magic number, metrik yang salah.",
        "• Mengunci reproduksibilitas lewat pin versi, lockfile, dan file konfigurasi.",
        "Isi lesson: cerita notebook sakti yang cuti → struktur proyek → lab refactor + mini test-runner → testing bertingkat → code review ML → dependensi & konfigurasi → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Notebook sakti yang cuti dua minggu",
      prose: [
        "Di sebuah bank digital, hanya satu orang yang bisa menjalankan pipeline retraining model churn: Rina. Notebook-nya — churn_final_FINAL_v3.ipynb — adalah 'notebook sakti'. Semua orang tahu: jangan disentuh, jangan ditanya, tunggu Rina.",
        "Lalu Rina cuti dua minggu. Data baru masuk, model harus di-retrain minggu ini juga. Tim menjalankan notebook itu top-to-bottom. Cell 14 meledak: NameError: df_fix is not defined. Ternyata df_fix dibuat di sebuah cell yang dijalankan manual tiga bulan lalu — lalu cell-nya dihapus. Variabel hantu: hidup di memory, mati di file.",
        "Setelah diperbaiki manual, pipeline selesai. Hasilnya: AUC 0,81. Laporan Rina bulan lalu: 0,86. Kode 'sama', angka beda. Investigasi menemukan dua hantu lagi: cell berisi random.shuffle tanpa seed, dan data dibaca dari path /Users/rina/data — laptop Rina, bukan server.",
        "Twist-nya: tidak ada bug logika di notebook itu. Semua cell 'benar'. Yang rusak adalah asumsi tak tertulis: urutan eksekusi yang hanya Rina yang tahu, state memory yang tidak tersimpan, dan environment yang hanya ada di satu laptop. Notebook sakti = single point of failure berwujud manusia.",
        "Pelajaran lesson ini: software engineering untuk ML bukan soal 'kode rapi'. Ini soal memindahkan pengetahuan dari kepala dan laptop seseorang menjadi artefak yang bisa dibaca mesin: modul, test, config, lockfile.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: notebook yang jalan top-to-bottom = kode yang benar",
        type: "pitfall",
        body: "Yang benar: 'jalan di laptop saya' tidak sama dengan 'bisa direproduksi'. State tersembunyi — variabel dari cell yang sudah dihapus, urutan eksekusi manual, file di path lokal — membuat notebook lolos di satu mesin dan gagal di semua mesin lain. Reproduksibilitas diuji dengan: hapus kernel, clone fresh, jalankan dari nol di mesin lain.",
      },
    },
    {
      id: "struktur-proyek",
      eyebrow: "Langkah 3 · Struktur proyek",
      title: "Tiga dunia yang harus dipisahkan",
      prose: [
        "Proyek ML yang sehat memisahkan tiga dunia: data (mentah, tidak boleh diubah kode), eksperimen (notebook eksplorasi, boleh berantakan), dan produksi (modul, test, config — yang dijalankan scheduler). Masalah Rina: ketiganya hidup dalam satu notebook.",
        "Struktur yang bekerja untuk tim kecil:",
        "ml-project/ — pyproject.toml (dependensi terkunci), configs/ (satu file config per eksperimen), src/ml_project/ (data_loader.py, features.py, train.py, evaluate.py — fungsi murni, bisa diimpor), tests/ (test berjalan di CI), notebooks/ (eksplorasi saja — dilarang diimpor pipeline), data/ (dibaca, tidak pernah ditulis kode ke sini).",
        "Aturan batasnya tegas: pipeline produksi TIDAK BOLEH mengimpor dari notebooks/. Notebook boleh mengimpor dari src/ (untuk cek cepat), tidak sebaliknya. Begitu sebuah cell notebook dipakai dua kali, ia naik kelas menjadi fungsi di src/. Begitu fungsi dipakai scheduler, ia wajib punya test.",
        "Kenapa src layout (kode di dalam folder src/)? Karena memaksa instalasi eksplisit (pip install -e .) dan mencegah impor 'kebetulan' dari working directory — sumber klasik 'di laptop saya jalan'.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: modul = notebook yang bisa diimpor, diuji, dan dijadwalkan",
        body: "Tiga sifat itu adalah definisi operasional 'siap produksi' untuk kode ML. Kalau kode tidak bisa diimpor tanpa efek samping, tidak bisa diuji otomatis, dan tidak bisa dijalankan scheduler — ia masih eksperimen, sehebat apa pun akurasinya.",
      },
      reference: "Batas suci: pipeline tidak mengimpor dari notebooks/ — pernah.",
    },
    {
      id: "lab-refactor",
      eyebrow: "Langkah 4 · Lab refactor",
      title: "Dari fungsi campur aduk ke fungsi murni + test",
      prose: [
        "Di blok terkunci ada proses_dan_latih: parsing, cleaning, split, training, dan evaluasi — semua dalam satu fungsi, persis gaya 'notebook sakti'. Ia bekerja, tetapi tidak bisa diuji per bagian, tidak bisa dipakai ulang, dan split-nya tidak deterministik.",
        "Tugasmu: pecah menjadi fungsi murni — bersihkan (buang baris rusak), bagi_data (split deterministik dengan seed), latih (hitung ambang batas dari data latih), prediksi, evaluasi. Lalu tulis 5 test dan satu mini test-runner yang menjalankannya dan melaporkan lolos/gagal.",
        "Lima test yang wajib ada: (1) cleaning membuang tepat 2 baris rusak; (2) split deterministik — seed sama → hasil sama; (3) model tidak konstan — memprediksi kedua kelas di data uji; (4) akurasi selalu dalam [0, 1]; (5) tidak ada leakage — tidak ada baris data uji yang juga muncul di data latih.",
        "Perhatikan test nomor 5: ia menguji properti statistik pipeline, bukan logika kode. Inilah bedanya testing ML dari testing software biasa — yang diuji bukan cuma 'apakah kode jalan', tetapi 'apakah pipeline-nya jujur'.",
      ],
      tasks: [
        { id: "t1", text: "Pecah `proses_dan_latih` menjadi fungsi murni: `bersihkan`, `bagi_data`, `latih`, `prediksi`, `evaluasi`" },
        { id: "t2", text: "Tulis 5 fungsi `test_*` sesuai daftar di atas" },
        { id: "t3", text: "Tulis mini test-runner: jalankan semua test, hitung `lolos` dan `gagal`" },
        { id: "t4", text: "Cetak ringkasan dengan format persis: `Hasil: {lolos}/{n} test lolos, gagal={gagal}`" },
      ],
      expected: "Hasil: 5/5 test lolos, gagal=0",
      hints: [
        "bagi_data deterministik tanpa random: rotasi list sejauh seed % len(data), lalu indeks genap → latih, ganjil → uji.",
        "latih: ambang = (rata-rata f1 kelas 1 + rata-rata f1 kelas 0) / 2 — sama seperti versi campur aduk.",
        "Test runner: for t in [test_a, ...]: try: t(); lolos += 1 except AssertionError: gagal += 1.",
        "Leakage: set(data_latih) & set(data_uji) harus kosong — tuple bisa masuk set.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
data_mentah = [
    (2.1, 0.4, 0), (3.5, 0.6, 0), (5.2, 0.8, 1), (6.0, 0.9, 1),
    (2.8, 0.5, 0), (5.8, 0.7, 1), (3.1, 0.55, 0), (6.4, 1.0, 1),
    (None, 0.6, 0),   # baris rusak
    (4.9, None, 1),   # baris rusak
    (3.3, 0.62, 0), (5.5, 0.85, 1),
]

def proses_dan_latih(baris):
    """Kode 'notebook sakti': parsing + cleaning + split + train + eval campur aduk."""
    bersih = [b for b in baris if b[0] is not None and b[1] is not None]
    latih = [b for i, b in enumerate(bersih) if i % 2 == 0]
    uji = [b for i, b in enumerate(bersih) if i % 2 == 1]
    satu = [b[0] for b in latih if b[2] == 1]
    nol = [b[0] for b in latih if b[2] == 0]
    ambang = (sum(satu)/len(satu) + sum(nol)/len(nol)) / 2
    benar = sum(1 for b in uji if (1 if b[0] >= ambang else 0) == b[2])
    return benar / len(uji)
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: fungsi murni hasil refactor
def bersihkan(baris):
    ...

def bagi_data(data, seed=7):
    ...

def latih(data_latih):
    ...

def prediksi(ambang, f1):
    ...

def evaluasi(ambang, data_uji):
    ...

# TULIS KODEMU: 5 test + mini test-runner
`,
        lockLines: 20,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
data_mentah = [
    (2.1, 0.4, 0), (3.5, 0.6, 0), (5.2, 0.8, 1), (6.0, 0.9, 1),
    (2.8, 0.5, 0), (5.8, 0.7, 1), (3.1, 0.55, 0), (6.4, 1.0, 1),
    (None, 0.6, 0),   # baris rusak
    (4.9, None, 1),   # baris rusak
    (3.3, 0.62, 0), (5.5, 0.85, 1),
]

def proses_dan_latih(baris):
    """Kode 'notebook sakti': parsing + cleaning + split + train + eval campur aduk."""
    bersih = [b for b in baris if b[0] is not None and b[1] is not None]
    latih = [b for i, b in enumerate(bersih) if i % 2 == 0]
    uji = [b for i, b in enumerate(bersih) if i % 2 == 1]
    satu = [b[0] for b in latih if b[2] == 1]
    nol = [b[0] for b in latih if b[2] == 0]
    ambang = (sum(satu)/len(satu) + sum(nol)/len(nol)) / 2
    benar = sum(1 for b in uji if (1 if b[0] >= ambang else 0) == b[2])
    return benar / len(uji)
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: fungsi murni hasil refactor
def bersihkan(baris):
    return [b for b in baris if b[0] is not None and b[1] is not None]

def bagi_data(data, seed=7):
    k = seed % len(data)
    urutan = data[k:] + data[:k]
    latih_d = [b for i, b in enumerate(urutan) if i % 2 == 0]
    uji_d = [b for i, b in enumerate(urutan) if i % 2 == 1]
    return latih_d, uji_d

def latih(data_latih):
    satu = [b[0] for b in data_latih if b[2] == 1]
    nol = [b[0] for b in data_latih if b[2] == 0]
    return (sum(satu) / len(satu) + sum(nol) / len(nol)) / 2

def prediksi(ambang, f1):
    return 1 if f1 >= ambang else 0

def evaluasi(ambang, data_uji):
    benar = sum(1 for b in data_uji if prediksi(ambang, b[0]) == b[2])
    return benar / len(data_uji)

# TULIS KODEMU: 5 test + mini test-runner
def test_bersihkan_membuang_baris_rusak():
    hasil = bersihkan(data_mentah)
    assert len(hasil) == 10, f"harusnya 10, dapat {len(hasil)}"
    assert all(b[0] is not None and b[1] is not None for b in hasil)

def test_bagi_data_deterministik():
    bersih = bersihkan(data_mentah)
    l1, u1 = bagi_data(bersih, seed=7)
    l2, u2 = bagi_data(bersih, seed=7)
    assert l1 == l2 and u1 == u2, "split tidak deterministik!"

def test_model_tidak_konstan():
    latih_d, uji_d = bagi_data(bersihkan(data_mentah), seed=7)
    ambang = latih(latih_d)
    kelas = {prediksi(ambang, b[0]) for b in uji_d}
    assert kelas == {0, 1}, "model hanya memprediksi satu kelas!"

def test_akurasi_dalam_range():
    latih_d, uji_d = bagi_data(bersihkan(data_mentah), seed=7)
    ak = evaluasi(latih(latih_d), uji_d)
    assert 0.0 <= ak <= 1.0, f"akurasi {ak} di luar [0, 1]!"

def test_tidak_ada_leakage():
    latih_d, uji_d = bagi_data(bersihkan(data_mentah), seed=7)
    assert not (set(latih_d) & set(uji_d)), "ada data uji bocor ke data latih!"

TES = [test_bersihkan_membuang_baris_rusak, test_bagi_data_deterministik,
       test_model_tidak_konstan, test_akurasi_dalam_range, test_tidak_ada_leakage]
lolos, gagal = 0, 0
for t in TES:
    try:
        t()
        lolos += 1
        print(f"PASS {t.__name__}")
    except AssertionError as e:
        gagal += 1
        print(f"FAIL {t.__name__}: {e}")
print(f"Hasil: {lolos}/{len(TES)} test lolos, gagal={gagal}")`,
        checks: [
          {
            "kind": "defined",
            "task": "t1",
            "label": "Fungsi `bersihkan` terdefinisi",
            "name": "bersihkan",
            "msg": "Pecah cleaning menjadi fungsi murni bernama bersihkan.",
          },
          {
            "kind": "defined",
            "task": "t1",
            "label": "Fungsi `latih` terdefinisi",
            "name": "latih",
            "msg": "Pecah training menjadi fungsi murni bernama latih.",
          },
          {
            "kind": "defined",
            "task": "t1",
            "label": "Fungsi `evaluasi` terdefinisi",
            "name": "evaluasi",
            "msg": "Pecah evaluasi menjadi fungsi murni bernama evaluasi.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "5 test lolos",
            "name": "lolos",
            "value": 5,
            "tol": 1e-09,
            "msg": "Kelima test harus lolos: cleaning, determinisme, non-konstan, range, leakage.",
          },
          {
            "kind": "equal",
            "task": "t3",
            "label": "0 test gagal",
            "name": "gagal",
            "value": 0,
            "tol": 1e-09,
            "msg": "Test runner harus melaporkan gagal = 0.",
          },
          {
            "kind": "stdout_matches",
            "task": "t4",
            "label": "Ringkasan tercetak",
            "pattern": "Hasil: 5/5 test lolos",
            "msg": "Cetak ringkasan dengan format yang diminta.",
          },
        ],
      },
      reference: "Refactor = pecah fungsi campur aduk jadi fungsi murni, lalu kunci dengan test.",
    },
    {
      id: "testing-bertingkat",
      eyebrow: "Langkah 5 · Testing ML",
      title: "Yang diuji bukan cuma kode",
      prose: [
        "Di software biasa, test menjawab 'apakah kode melakukan yang diperintah?'. Di ML, ada dua pertanyaan tambahan: 'apakah datanya waras?' dan 'apakah perilaku modelnya masuk akal?'. Tiga lapis test, tiga jenis kegagalan yang berbeda.",
        "Lapis 1 — unit test transformasi: fungsi features.py diuji dengan input-output yang diketahui. Contoh: fungsi yang menghitung rasio harus mengembalikan 0,5 untuk input (1, 2), dan menangani pembagi nol dengan cara yang disepakati — bukan crash, bukan inf diam-diam.",
        "Lapis 2 — data test: skema (kolom dan tipe sesuai kontrak), range (nilai dalam batas wajar), dan ekspektasi distribusi. Data test berjalan di setiap batch — training maupun serving — karena data adalah 'kode' yang berubah setiap hari.",
        "Lapis 3 — model test: invariant perilaku. 'Skor tidak turun saat penghasilan naik.' 'Prediksi untuk input identik harus identik.' Metamorphic: 'geser input sedikit → output berubah sedikit.' Test ini tidak butuh label — hanya butuh akal sehat domain, dan ia menangkap bug yang lolos dari metrik agregat.",
        "Prinsip yang membedakan semuanya: test yang tidak pernah GAGAL = test yang tidak menguji apa-apa. Setiap test baru wajib dibuktikan bisa merah — rusak sengaja inputnya sekali, lihat test-nya berteriak, baru percaya.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: seed hanya soal reproducibility, bukan kebenaran",
        type: "pitfall",
        body: "Yang benar: tanpa seed yang dikunci, tiga hal rusak sekaligus. (1) Eksperimen tidak bisa dibandingkan — 'AUC naik 2%' bisa jadi murni noise urutan data. (2) Bug tidak bisa direproduksi — error yang muncul sekali lalu hilang adalah hantu. (3) Test menjadi flaky — test yang kadang hijau kadang merah akan diabaikan tim, lalu seluruh suite kehilangan kepercayaan.",
      },
    },
    {
      id: "code-review",
      eyebrow: "Langkah 6 · Code review",
      title: "Checklist yang dicari reviewer ML",
      prose: [
        "Code review untuk ML punya daftar periksa yang tidak ada di review software biasa. Reviewer yang baik tidak bertanya 'apakah kode ini elegan?' melainkan 'apakah angka ini bisa dipercaya?'.",
        "Checklist wajib: (1) Leakage — apakah ada informasi masa depan yang merembes? Pola klasik: scaling dengan fit di seluruh data SEBELUM split, atau fitur yang dihitung dari target. (2) Seed — apakah semua sumber randomness dikunci dan tercatat? (3) Magic number — apakah 0.73, 42, atau 'drop kolom ke-7' punya nama dan alasan di config? (4) Metrik yang salah — akurasi di data imbalance 95:5, atau metrik training yang dilaporkan sebagai metrik validasi. (5) Data contract — apakah asumsi tentang data ditulis sebagai test, bukan sebagai komentar?",
        "Aturan main review: tidak ada 'LGTM' untuk kode yang mengubah angka tanpa test yang ikut berubah. Dan reviewer terbaik untuk kode ML adalah orang yang tidak menulisnya — mata segar menangkap leakage yang penulisnya sudah buta.",
        "Satu teknik ampuh: minta penulis menjelaskan 'kenapa angka ini segini?' untuk setiap konstanta di diff. Konstanta yang tidak bisa dijelaskan = eksperimen yang tidak tercatat = calon bug.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: leakage paling sering masuk lewat preprocessing, bukan lewat model",
        body: "Model tidak 'curang' sendiri — manusianya yang membocorkan. Fit scaler di seluruh data sebelum split, imputasi memakai rata-rata termasuk data uji, atau fitur 'jumlah transaksi bulan ini' untuk memprediksi churn bulan ini. Reviewer ML selalu membaca pipeline dari hulu: data dulu, model belakangan.",
      },
    },
    {
      id: "dependensi-config",
      eyebrow: "Langkah 7 · Reproduksibilitas",
      title: "Kunci environment, kunci eksperimen",
      prose: [
        "'Di mesin saya jalan' adalah kalimat paling mahal di ML. Penyebab nomor satu: dependensi yang bergeser diam-diam. Minor version bump pada library bisa mengubah default perilaku sebuah fungsi — dan eksperimen yang tidak terkunci versinya bukanlah sains, melainkan anekdot.",
        "Tiga kunci, dari murah ke mahal: (1) Pin versi di pyproject.toml/requirements — tulis batas bawah DAN atas (pandas>=2.0,<2.3), bukan 'pandas' polos. (2) Lockfile (pip freeze / poetry.lock) — snapshot persis setiap package yang terinstal, termasuk dependensi transitif. (3) Environment terkunci — container image dengan hash, untuk pipeline produksi.",
        "Kunci keempat adalah konfigurasi: semua angka yang memengaruhi hasil — learning rate, threshold, seed, path data, versi fitur — tinggal di SATU file config (YAML/TOML), bukan tersebar sebagai magic number di kode. Config + data + lockfile yang sama harus menghasilkan angka yang sama, di mesin siapa pun.",
        "Aturan praktis: argumen CLI boleh untuk eksplorasi cepat, tetapi hasil yang dilaporkan ke siapa pun harus berasal dari config file yang di-commit. 'Coba lr 0.01' di chat tanpa config = eksperimen yang tidak pernah terjadi.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: pin versi dependensi = overkill untuk eksperimen",
        type: "pitfall",
        body: "Yang benar: eksperimen tanpa lockfile = hasil yang tidak bisa direproduksi = bukan bukti. Biaya menulis lockfile: satu perintah. Biaya debugging 'kok di saya beda' tiga bulan kemudian: berhari-hari, dan sering berakhir dengan 'ya sudah, pakai angka yang lama saja' — keputusan bisnis di atas angka yang tidak bisa dipertanggungjawabkan.",
      },
      reference: "Config adalah kontrak eksperimen: config + data + lockfile sama → angka sama.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan seberapa ketat",
      prose: [
        "Tidak semua kode butuh full software engineering. Kuncinya: tingkatkan keketatan mengikuti umur dan risiko kode. Empat skenario:",
        "Skenario 1 — Eksperimen sekali pakai, hasil untuk slide → notebook boleh. Syarat minimum: seed ditulis di cell pertama, versi library dicatat. Alasan: biaya SE melebihi nilai kode sekali pakai.",
        "Skenario 2 — Eksperimen diulang atau dijadwalkan → naik kelas jadi modul + config file + data test. Alasan: 'dijalankan ulang' = definisi kode yang butuh reproduksibilitas.",
        "Skenario 3 — Kode dipakai tim, di-review orang lain → tambah typing, linting, code review checklist ML, unit test transformasi. Alasan: kode dibaca lebih sering daripada ditulis; leakage butuh mata kedua.",
        "Skenario 4 — Produksi, uang atau reputasi dipertaruhkan → semuanya, plus lockfile, environment terkunci, CI yang menjalankan test + quality gate metrik, dan rilis bertahap. Alasan: di sini bug = kerugian nyata.",
        "Pola umum dari insiden pipeline ML (angka ilustrasi dari pola yang sering ditemui, bukan hasil survei): akar masalah paling sering BUKAN logika kode, melainkan data, konfigurasi, dan environment — tiga hal yang justru paling jarang diuji tim yang baru mulai.",
        "Cara membaca: sumbu horizontal = perkiraan proporsi akar masalah insiden pipeline ML (angka ilustrasi); panjang batang = besarnya proporsi; label di kanan batang = kategorinya.",
        "Interpretasi: data/drift mendominasi (34%) — validasi data adalah investasi termurah. Konfigurasi + environment total 40% — dua hal yang diselesaikan lockfile dan config file. 'Kode' murni hanya 16%: tim yang hanya menulis unit test sedang menjaga pintu yang paling jarang dibobol.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Proporsi ilustrasi akar masalah insiden pipeline ML">
<text x="240" y="20" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Akar masalah insiden pipeline ML (ilustrasi)</text>
<text x="150" y="62" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Data / drift</text>
<rect x="158" y="50" width="204" height="22" fill="var(--c1)" rx="4"/>
<text x="370" y="66" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">34%</text>
<text x="150" y="100" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Konfigurasi</text>
<rect x="158" y="88" width="132" height="22" fill="var(--c1)" rx="4"/>
<text x="298" y="104" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">22%</text>
<text x="150" y="138" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Environment</text>
<rect x="158" y="126" width="108" height="22" fill="var(--c1)" rx="4"/>
<text x="274" y="142" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">18%</text>
<text x="150" y="176" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Kode</text>
<rect x="158" y="164" width="96" height="22" fill="var(--c1)" rx="4"/>
<text x="262" y="180" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">16%</text>
<text x="150" y="214" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Tak terlacak</text>
<rect x="158" y="202" width="60" height="22" fill="var(--c1)" rx="4"/>
<text x="226" y="218" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">10%</text>
</svg>`,
        alt: "Diagram batang: akar masalah insiden pipeline ML didominasi data/drift 34%, lalu konfigurasi 22%, environment 18%, kode 16%, tak terlacak 10% (angka ilustrasi).",
        caption: "Akar masalah insiden pipeline ML: data, konfigurasi, dan environment mendominasi — ketiganya di luar jangkauan unit test biasa (angka ilustrasi pola umum).",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: aturan praktis 10 detik",
        body: "Tanya dua hal: berapa orang yang menyentuh kode ini, dan berapa lama ia hidup? Satu orang, satu hari → notebook cukup. Lebih dari satu orang ATAU lebih dari satu minggu → modul + config + test. Uang atau reputasi dipertaruhkan → full software engineering. Naikkan keketatan saat kode naik kelas — bukan sebelumnya, tidak sesudahnya.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "AUC 0,83 hari Senin, 0,79 hari Rabu — 'kode sama'",
      prose: [
        "Pipeline retraining mingguan sebuah bank berjalan Senin pagi: AUC 0,83. Dijadwalkan ulang Rabu karena data koreksi: AUC 0,79. Tim bersikeras 'kode sama persis' — dan memang, git diff kosong. Tidak ada commit antara Senin dan Rabu.",
        "Investigasi menemukan tiga hantu: (1) shuffle data tanpa seed — urutan training berbeda setiap run, dan model ini sensitif urutan batch awal; (2) data dibaca dari folder tanpa sort — urutan file tergantung filesystem OS, berbeda antara run Senin (server A) dan Rabu (server B); (3) library naik minor version otomatis saat image di-rebuild Selasa malam, mengubah default satu parameter preprocessing.",
        "Pertanyaan: (a) Mengapa 'git diff kosong' tidak membuktikan apa-apa? (b) Sebutkan 3 perbaikan struktural — bukan 'tambah seed' saja. (c) Test apa yang akan menangkap hantu nomor 3 SEBELUM merugikan?",
        "Pembahasan: (a) Git hanya melacak kode — tidak melacak seed (tidak ada), urutan baca file (OS-dependent), dan versi dependensi (tidak di-pin). Reproduksibilitas = kode + data + config + environment; git hanya mengunci satu dari empat. (b) Kunci seed dan catat di config; sort eksplisit setiap pembacaan multi-file; pin versi dependensi + lockfile, rebuild image hanya dari lockfile. (c) Data test distribusi + quality gate metrik di CI: evaluasi otomatis tiap retraining, tolak rilis jika AUC turun > ambang — hantu nomor 3 tertangkap sebagai 'metrik anjlok', bukan sebagai misteri.",
        "Pelajaran: 'kode sama' adalah klaim tentang SATU dari empat pilar reproduksibilitas. Tiga pilar lainnya — data, config, environment — diam-diam berubah setiap minggu.",
      ],
      tasks: [
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah.",
        "Refleksi: software engineering untuk ML = memindahkan pengetahuan dari kepala dan laptop menjadi artefak: modul, test, config, lockfile. Yang diuji bukan cuma kode, tetapi juga data dan perilaku statistik model. Dan satu prinsip penutup: kode yang tidak bisa dijalankan orang lain dari nol bukanlah aset tim — ia adalah utang yang menunggu jatuh tempo.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Notebook Rina jalan sempurna di laptopnya, gagal total di laptop tim. Akar masalahnya?",
          options: [
            {
              text: "Ada bug logika di salah satu cell",
              why: "Tidak ada — semua cell 'benar'. Masalahnya bukan logika, melainkan pengetahuan implisit.",
            },
            {
              text: "Pengetahuan implisit: urutan eksekusi, state memory, dan environment tidak terekam sebagai artefak",
              why: "Tepat: variabel hantu dari cell yang dihapus, shuffle tanpa seed, path lokal — semuanya hidup di luar file.",
              correct: true,
            },
            {
              text: "Tim kurang pintar memakai notebook",
              why: "Menyalahkan pengguna menutupi masalah sistemik: artefaknya memang tidak portable.",
            },
            {
              text: "Notebook memang tidak cocok untuk ML",
              why: "Terlalu ekstrem — notebook cocok untuk eksplorasi; yang salah adalah memakainya sebagai artefak produksi.",
            },
          ],
        },
        {
          q: "Kapan sebuah cell notebook 'lulus' dan harus naik kelas menjadi fungsi di modul?",
          options: [
            {
              text: "Saat cell-nya lebih dari 50 baris",
              why: "Panjang bukan kriterianya — cell pendek yang dipakai berulang pun harus naik kelas.",
            },
            {
              text: "Saat dipakai ulang, dijadwalkan, atau perlu diuji",
              why: "Tepat: tiga pemicu ini menuntut sifat modul — bisa diimpor, diuji, dijalankan scheduler.",
              correct: true,
            },
            {
              text: "Saat notebook-nya sudah final",
              why: "'Final' bukan status yang bisa diandalkan — notebook selalu bisa berubah; yang penting adalah pemakaiannya.",
            },
            {
              text: "Tidak pernah — notebook cukup diberi komentar",
              why: "Komentar tidak bisa dijalankan scheduler atau diuji otomatis.",
            },
          ],
        },
        {
          q: "Reviewer menemukan scaling di-fit ke SELURUH data sebelum train/test split. Ini adalah…",
          options: [
            {
              text: "Optimasi yang wajar agar skala konsisten",
              why: "Konsistensi skala bukan alasan — statistik data uji sudah merembes ke training.",
            },
            {
              text: "Data leakage: informasi data uji bocor ke proses training",
              why: "Tepat: mean/std dari data uji ikut menentukan transformasi data latih — evaluasi jadi terlalu optimistis.",
              correct: true,
            },
            {
              text: "Hanya masalah gaya penulisan kode",
              why: "Bukan gaya — ini mengubah validitas seluruh hasil evaluasi.",
            },
            {
              text: "Boleh saja selama metriknya bagus",
              why: "Metrik yang 'bagus' karena leakage adalah angka palsu — justru itu bahayanya.",
            },
          ],
        },
        {
          q: "Eksperimen A AUC 0,85 vs eksperimen B AUC 0,83, tetapi seed berbeda dan urutan data berbeda. Kesimpulan yang jujur?",
          options: [
            {
              text: "A lebih baik — 0,85 > 0,83",
              why: "Selisih 0,02 tidak bisa dibedakan dari noise urutan data tanpa kontrol seed.",
            },
            {
              text: "Tidak bisa dibandingkan — ulangi dengan seed dan data yang identik",
              why: "Tepat: tanpa kontrol variabel, ini apel vs jeruk. Klaim improvement butuh perbandingan yang adil.",
              correct: true,
            },
            {
              text: "Rata-ratakan saja menjadi 0,84",
              why: "Merata-ratakan dua eksperimen tak terkontrol tidak menghasilkan angka yang bermakna.",
            },
            {
              text: "Pilih B karena lebih konservatif",
              why: "Konservatif bukan metode evaluasi — yang dibutuhkan adalah perbandingan terkontrol.",
            },
          ],
        },
        {
          q: "Di kode training ada konstanta 0.73 tanpa nama dan tanpa komentar. Masalah terbesarnya?",
          options: [
            {
              text: "Membuat kode berjalan lebih lambat",
              why: "Konstanta tidak memengaruhi kecepatan eksekusi.",
            },
            {
              text: "Tidak bisa di-tune, diaudit, atau dijelaskan — ia eksperimen yang tidak tercatat",
              why: "Tepat: magic number memutus rantai 'kenapa angka ini segini', padahal itulah yang ditanya saat hasil dipertanyakan.",
              correct: true,
            },
            {
              text: "Melanggar aturan penamaan variabel",
              why: "Bukan soal estetika penamaan — soal ketertelusuran keputusan.",
            },
            {
              text: "Harus diganti 0.75 agar lebih bulat",
              why: "Mengganti tanpa alasan = menambah satu lagi keputusan tak tercatat.",
            },
          ],
        },
        {
          q: "Manfaat utama pin versi + lockfile dibanding sekadar requirements.txt longgar?",
          options: [
            {
              text: "Instalasi lebih cepat",
              why: "Bukan kecepatan — lockfile justru bisa sedikit lebih lambat karena verifikasi hash.",
            },
            {
              text: "Menjamin environment yang identik di mesin dan waktu berbeda — reproduksibilitas",
              why: "Tepat: lockfile mengunci seluruh pohon dependensi termasuk transitif, sehingga 'di mesin saya jalan' menjadi 'di semua mesin jalan sama'.",
              correct: true,
            },
            {
              text: "Mengurangi ukuran file proyek",
              why: "Tidak berhubungan dengan ukuran — ini soal determinisme versi.",
            },
            {
              text: "Otomatis memperbaiki bug library",
              why: "Sebaliknya: pin versi justru MENAHAN update sampai diuji sengaja — update otomatis diam-diam adalah musuhnya.",
            },
          ],
        },
      ],
      summary: [
        "Notebook sakti = single point of failure: pisahkan data, eksperimen, dan produksi.",
        "Refactor: fungsi campur aduk → fungsi murni, lalu kunci dengan test (termasuk test kejujuran pipeline seperti anti-leakage).",
        "Test ML tiga lapis: unit transformasi, data test, invariant perilaku model.",
        "Code review ML mencari: leakage, seed tak terkunci, magic number, metrik yang salah.",
        "Reproduksibilitas = kode + data + config + environment; kunci dengan pin versi, lockfile, dan satu file config.",
        "Keketatan SE mengikuti umur dan risiko kode: notebook → modul → package → produksi terkunci.",
      ],
      next: { label: "MLE25 — Unsupervised & Semi-Supervised Learning", href: "/v2/learn/mle25-unsupervised" },
    },
  ],
};
