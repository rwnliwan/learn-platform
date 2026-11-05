import type { V2Lesson } from "../lib/types";

// ── Figure: kunjungan DBD per faskes, Oktober 2026 (sintetis) ─────────────
const DBD_SVG = `<svg viewBox="0 0 520 240" role="img" aria-label="Diagram batang kunjungan DBD per faskes: Puskesmas A 5, B 2, C 2">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="120" y1="30" x2="120" y2="190"/>
<line x1="120" y1="190" x2="500" y2="190"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="110" y="60" text-anchor="end">6</text>
<text x="110" y="110" text-anchor="end">4</text>
<text x="110" y="160" text-anchor="end">2</text>
<text x="110" y="195" text-anchor="end">0</text>
</g>
<g>
<rect x="160" y="52" width="80" height="138" rx="4" fill="var(--c2)"/>
<text x="200" y="44" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">5</text>
<text x="200" y="208" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Puskesmas A</text>
<rect x="290" y="114" width="80" height="76" rx="4" fill="var(--c1)"/>
<text x="330" y="106" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">2</text>
<text x="330" y="208" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Puskesmas B</text>
<rect x="420" y="114" width="80" height="76" rx="4" fill="var(--c1)"/>
<text x="460" y="106" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">2</text>
<text x="460" y="208" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Puskesmas C</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="228">data sintetis</text>
</g>
<text x="160" y="22" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Kunjungan DBD, Oktober 2026</text>
</svg>`;

export const hd27: V2Lesson = {
  slug: "hd27-sql-kesehatan",
  track: "Health Data Science",
  module: "Tooling & Tata Kelola Data",
  title: "SQL untuk Data Kesehatan: Bertanya Langsung ke Datanya",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga hari menyalin Excel — atau tiga detik menjalankan query",
      prose: [
        "Jumat pagi, 07.40. Bu Ratna, analis data di Dinas Kesehatan kabupaten, menerima pesan dari Kepala Dinas: “Butuh angka kunjungan DBD per puskesmas bulan ini, untuk rapat jam 10.” Di laptopnya ada 14 file Excel — satu per puskesmas — masing-masing dengan format kolom yang sedikit berbeda. Ia mulai menyalin, menempel, dan menjumlah manual. Jam 09.55, angka selesai: total 9 kunjungan DBD. Ia mengirimkannya dengan napas lega — dan dengan rasa tidak enak, karena ia tahu ia tidak sempat memeriksa ulang.",
        "Twist-nya: di kabupaten tetangga, analis yang datanya sudah masuk database relasional menjawab pertanyaan yang sama — plus rincian per puskesmas, plus daftar pasien yang kunjungannya berulang — dalam waktu kurang dari satu menit, dengan satu query yang bisa dijalankan ulang kapan pun dan hasilnya selalu sama. Bu Ratna bukan kalah pintar; ia kalah alat. Setiap kali data kesehatan berbentuk tabel yang saling terhubung (pasien, kunjungan, diagnosis), ada satu bahasa untuk bertanya langsung ke datanya tanpa perantara salin-tempel: SQL. Bahasa ini adalah syarat eksplisit di 7 dari 9 lowongan analis data kesehatan yang diriset Oktober 2026 — dan di track ini, ia belum pernah diajarkan sampai lesson ini.",
        "Lesson ini mengajarkan SQL lewat data yang kamu kenal: pasien, kunjungan, dan diagnosis. Tidak perlu install apa pun — lab-nya berjalan di browser memakai database SQLite sungguhan di dalam Python.",
      ],
      tasks: [],
      note: {
        title: "Kenapa SQL adalah skill #1 analis data kesehatan",
        type: "risk",
        body: "Data operasional kesehatan (kunjungan, klaim, surveilans) hidup di database relasional. Analis yang tidak bisa SQL bergantung pada orang lain — atau pada salin-tempel manual — setiap kali butuh angka, dan setiap perantara manual adalah peluang salah. SQL mengubah analis dari “penyalin data” menjadi “penanya data”: pertanyaan yang sama bisa dijawab ulang, diaudit, dan dipertahankan di depan pengambil keputusan.",
      },
      reference: "SQL = bertanya langsung ke database relasional. Analis kesehatan yang bisa SQL tidak bergantung pada salin-tempel.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menulis query SELECT–FROM–WHERE untuk memfilter baris data kunjungan; (2) menggabungkan tabel pasien dan kunjungan dengan JOIN memakai kunci relasi; (3) meringkas data dengan GROUP BY dan HAVING (agregasi per faskes, filter hasil agregasi); (4) menjelaskan dua jebakan klasik — join yang menggandakan baris dan COUNT yang menghitung hal yang salah.",
        "Rutenya: cerita → tujuan + bekal → tiga konsep (SELECT, JOIN, agregasi) → lab SQLite (query data kunjungan sintetis) → chart kunjungan DBD per faskes dengan panduan baca → peta keputusan → mini-case jawaban untuk Kepala Dinas → kuis → rangkuman. Estimasi 60 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, data relasional: data disimpan dalam tabel-tabel; tiap tabel punya baris (record) dan kolom (field). Tabel pasien dan tabel kunjungan terhubung lewat kunci: kolom pasien_id di tabel kunjungan menunjuk ke kolom id di tabel pasien. Kedua, agregasi: meringkas banyak baris menjadi sedikit angka (jumlah, rata-rata) — persis seperti rekap bulanan puskesmas, hanya saja dikerjakan mesin. Ketiga, tidak ada prasyarat pemrograman selain Python dasar yang sudah dipakai di lab-lab lesson sebelumnya.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: SQL dibaca seperti kalimat tanya dalam Bahasa Indonesia — “PILIH nama DARI tabel pasien DIMANA faskes-nya A” hampir persis terjemahan SELECT nama FROM pasien WHERE faskes = 'Puskesmas A'. Kalau kamu bisa merumuskan pertanyaannya dengan presisi, kamu sudah setengah jalan menulis query-nya.",
      ],
      reference: "Bekal: (1) tabel terhubung lewat kunci; (2) agregasi = rekap oleh mesin; (3) cukup Python dasar.",
    },
    {
      id: "konsep-select",
      eyebrow: "Langkah 3 · Konsep",
      title: "SELECT — memilih kolom, menyaring baris",
      prose: [
        "Definisi: SELECT adalah perintah untuk mengambil data dari tabel. Bentuk dasarnya: SELECT kolom FROM tabel WHERE syarat. WHERE menyaring baris (hanya yang memenuhi syarat yang keluar), ORDER BY mengurutkan hasil, LIMIT membatasi jumlah baris — berguna saat menjelajah tabel jutaan baris agar tidak membanjiri layar.",
        "Kepribadiannya: SELECT adalah pramusaji yang sangat literal. Ia hanya mengambil persis yang diminta — tidak menafsirkan, tidak menambahkan. “Tampilkan pasien Puskesmas A” ia terjemahkan menjadi WHERE faskes = 'Puskesmas A'; kalau datanya tertulis 'PUSKESMAS A' dengan huruf kapital semua, ia tidak mengenalinya kecuali kamu yang menanganinya. Keliteralan ini adalah kekuatan (hasilnya deterministik, bisa diaudit) sekaligus sumber kejengkelan pertama setiap pemula SQL.",
        "Kapan memakai: setiap kali pertanyaanmu bisa dijawab dari SATU tabel. Contoh: “Siapa saja pasien berusia di atas 50 tahun?” (SELECT nama, usia FROM pasien WHERE usia > 50), “Tampilkan 10 kunjungan terbaru” (ORDER BY tanggal DESC LIMIT 10). Begitu pertanyaanmu menyebut dua tabel sekaligus (“nama pasien DAN diagnosisnya”), kamu butuh konsep berikutnya: JOIN.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “SQL itu bahasa programmer — analis kesehatan cukup Excel”",
        type: "pitfall",
        body: "Yang benar: justru analis kesehatan yang paling diuntungkan SQL. Data kunjungan, klaim, dan surveilans hidup di database — Excel hanya salinannya yang menua. Lowongan analis data kesehatan 2026 mensyaratkan SQL eksplisit (7 dari 9), bukan sebagai “nilai tambah” melainkan syarat lolos seleksi. Excel tetap berguna untuk eksplorasi cepat; tetapi angka yang dilaporkan ke pimpinan harus bisa direproduksi — dan reproduksibilitas adalah wilayah SQL.",
      },
      hints: [
        "💡 Intuisi: biasakan menulis WHERE dulu sebelum SELECT — tentukan dulu “baris mana yang saya mau”, baru “kolom apa yang saya tampilkan”. Urutan berpikir ini mencegah kesalahan paling umum: query yang benar secara sintaks tetapi menjawab pertanyaan yang salah.",
      ],
      reference: "SELECT kolom FROM tabel WHERE syarat — saring baris dulu, pilih kolom kemudian.",
    },
    {
      id: "konsep-join",
      eyebrow: "Langkah 4 · Konsep",
      title: "JOIN — menyambung tabel lewat kunci",
      prose: [
        "Definisi: JOIN menggabungkan baris dari dua tabel berdasarkan kolom kunci yang cocok. Pola kanonis: SELECT p.nama, k.diagnosis FROM kunjungan k JOIN pasien p ON k.pasien_id = p.id. Klausa ON adalah jembatan: baris kunjungan dengan pasien_id = 5 disambungkan ke baris pasien dengan id = 5. Tanpa ON yang benar, database tidak tahu baris mana milik siapa.",
        "Kepribadiannya: JOIN adalah resepsionis yang mencocokkan gelang pasien. Ia tidak peduli isi tabelnya — ia hanya mencocokkan kunci. Kalau kuncinya kotor (pasien_id menunjuk ke id yang tidak ada, atau satu pasien tercatat dua kali), hasil sambungannya ikut kotor, dan ia tidak akan protes. Inilah kenapa analis senior selalu mengecek jumlah baris SEBELUM dan SESUDAH join: baris yang hilang atau berlipat ganda adalah sinyal masalah kualitas data, bukan sekadar angka.",
        "Kapan memakai: setiap pertanyaan yang butuh kolom dari dua tabel atau lebih — “nama pasien per diagnosis” (butuh nama dari tabel pasien + diagnosis dari tabel kunjungan), “kunjungan DBD per faskes” (butuh faskes dari tabel pasien + diagnosis dari tabel kunjungan). Aturan praktisnya: satu tabel = SELECT saja; dua tabel atau lebih = JOIN.",
      ],
      formula: String.raw`C = \frac{D_2}{P} \times 100\%`,
      formulaNote: "Contoh agregasi yang akan kamu hitung dengan SQL di dunia nyata: C = cakupan imunisasi (%). D_2 = jumlah anak yang menerima dosis lengkap. P = populasi sasaran (mis. bayi 0–11 tahun di wilayah itu). Contoh: D_2 = 850, P = 1.000 → C = 85%. Di SQL, D_2 dan P masing-masing adalah hasil COUNT dari query — rumusnya sederhana, tantangannya adalah mendapatkan pembilang dan penyebut yang benar dari join yang tepat.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “JOIN semua tabel = data makin lengkap”",
        type: "pitfall",
        body: "Yang benar: join yang salah justru MELIPATGANDAKAN baris. Contoh klasik: tabel kunjungan di-join ke tabel diagnosis_detail yang satu kunjungannya punya 3 baris detail — tiba-tiba “jumlah kunjungan” menjadi 3 kali lipat. Ini disebut fan trap. Obatnya: selalu cek COUNT(*) sebelum dan sesudah join, dan pahami kardinalitas relasinya (satu-ke-banyak atau banyak-ke-banyak) SEBELUM menulis ON.",
      },
      hints: [
        "💡 Intuisi: baca JOIN dari kanan ke kiri — “untuk SETIAP baris kunjungan, carikan SATU baris pasien yang id-nya cocok”. Kalau ternyata satu baris kunjungan cocok dengan BANYAK baris di tabel seberang, berhentilah: itu sinyal relasi banyak-ke-banyak yang butuh perlakuan khusus, bukan join mentah.",
      ],
      reference: "JOIN = sambungkan lewat kunci (ON). Cek jumlah baris sebelum–sesudah join; waspadai fan trap.",
    },
    {
      id: "konsep-agregasi",
      eyebrow: "Langkah 5 · Konsep",
      title: "GROUP BY & HAVING — rekap bulanan versi mesin",
      prose: [
        "Definisi: GROUP BY mengelompokkan baris yang memiliki nilai sama, lalu fungsi agregasi (COUNT, SUM, AVG, MIN, MAX) meringkas tiap kelompok menjadi satu angka. Pola kanonis rekap: SELECT faskes, COUNT(*) FROM kunjungan k JOIN pasien p ON k.pasien_id = p.id WHERE diagnosis = 'DBD' GROUP BY faskes. HAVING adalah WHERE-nya hasil agregasi: HAVING COUNT(*) >= 5 menyaring hanya faskes dengan 5+ kunjungan — ditulis SETELAH GROUP BY karena ia menyaring kelompok, bukan baris mentah.",
        "Kepribadiannya: GROUP BY adalah kepala seksi rekap yang tidak pernah lelah. Rekap bulanan yang dikerjakan Bu Ratna tiga hari — kelompokkan per puskesmas, hitung, saring yang di atas ambang — ia kerjakan dalam sekejap, dan hasilnya identik setiap kali dijalankan. Syaratnya satu: kamu harus eksplisit tentang “kelompokkan BERDASARKAN APA” — mesin tidak bisa menebak level agregasimu.",
        "Kapan memakai: setiap pertanyaan “berapa per …” — per faskes, per bulan, per kelompok usia, per diagnosis. Kombinasi WHERE (saring baris dulu) → GROUP BY (kelompokkan) → HAVING (saring kelompok) menjawab 80% kebutuhan rekap operasional Dinkes dan RS.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “COUNT(*) = jumlah pasien”",
        type: "pitfall",
        body: "Yang benar: COUNT(*) menghitung BARIS, bukan pasien. Satu pasien dengan 3 kunjungan dihitung 3 kali. Untuk jumlah pasien unik, pakai COUNT(DISTINCT pasien_id). Kesalahan ini adalah sumber klasik angka “penderita” yang membengkak di laporan — dan ironisnya sering lolos karena angkanya terlihat meyakinkan. Selalu tanyakan: yang saya hitung ini baris, kunjungan, atau orang?",
      },
      hints: [
        "💡 Intuisi: urutan eksekusi logis SQL adalah FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY — bukan urutan penulisannya. Memahami ini menjelaskan kenapa kolom alias dari SELECT tidak bisa dipakai di WHERE, dan kenapa HAVING hanya mengenal hasil agregasi.",
      ],
      reference: "WHERE saring baris → GROUP BY kelompokkan → HAVING saring kelompok. COUNT(*) = baris; COUNT(DISTINCT id) = orang unik.",
    },
    {
      id: "lab-sqlite",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Query data kunjungan dengan SQLite sungguhan",
      prose: [
        "Waktunya bertanya langsung ke data. Di bawah ada database SQLite SUNGGUHAN (berjalan di browser via Python): tabel pasien (8 orang) dan kunjungan (14 kunjungan, Oktober 2026) — sintetis, polanya meniru data operasional faskes. Tugasmu: jawab tiga pertanyaan Kepala Dinas dengan query — total kunjungan, kunjungan DBD per faskes, dan pasien dengan kunjungan berulang (≥2).",
        "Coba: setelah lolos, ubah query t2 menjadi diagnosis = 'Hipertensi' — faskes mana yang muncul? Lalu tambahkan HAVING COUNT(*) >= 3 pada query pasien berulang: siapa yang tersisa? Eksperimen kecil ini melatih intuisi WHERE vs HAVING.",
      ],
      tasks: [
        { id: "t1", text: "Isi `n_kunjungan` dengan query COUNT atas tabel kunjungan" },
        { id: "t2", text: "Isi `dbd_A`, `dbd_B`, `dbd_C` = jumlah kunjungan DBD per faskes (JOIN + WHERE diagnosis + GROUP BY)" },
        { id: "t3", text: "Isi `pasien_berulang` = list nama pasien dengan ≥2 kunjungan (GROUP BY pasien + HAVING)" },
        { id: "t4", text: "Jalankan dan pastikan ketiga baris ringkasan tercetak" },
      ],
      expected: "total_kunjungan=14\ndbd_A=5 dbd_B=2 dbd_C=2\npasien_berulang=6",
      code: {
        starter: `import sqlite3

# ── Data SINTETIS (pola meniru data operasional faskes; angka dibuat untuk latihan) ──
con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.executescript("""
CREATE TABLE pasien(id INTEGER PRIMARY KEY, nama TEXT, usia INTEGER, faskes TEXT);
CREATE TABLE kunjungan(id INTEGER PRIMARY KEY, pasien_id INTEGER, tanggal TEXT, diagnosis TEXT);
INSERT INTO pasien VALUES
(1,'Sari',34,'Puskesmas A'),(2,'Budi',52,'Puskesmas A'),(3,'Ani',28,'Puskesmas B'),
(4,'Dedi',61,'Puskesmas B'),(5,'Rina',45,'Puskesmas A'),(6,'Tono',39,'Puskesmas C'),
(7,'Maya',55,'Puskesmas C'),(8,'Joko',47,'Puskesmas B');
INSERT INTO kunjungan VALUES
(1,1,'2026-10-02','DBD'),(2,1,'2026-10-15','DBD'),(3,2,'2026-10-03','Hipertensi'),
(4,3,'2026-10-04','DBD'),(5,4,'2026-10-05','Diabetes'),(6,4,'2026-10-19','Diabetes'),
(7,5,'2026-10-06','DBD'),(8,5,'2026-10-12','DBD'),(9,6,'2026-10-07','ISPA'),
(10,7,'2026-10-08','DBD'),(11,7,'2026-10-21','DBD'),(12,8,'2026-10-09','Hipertensi'),
(13,2,'2026-10-22','DBD'),(14,8,'2026-10-25','DBD');
""")

# TULIS KODEMU
n_kunjungan =
dbd_A =
dbd_B =
dbd_C =
pasien_berulang =

print(f"total_kunjungan={n_kunjungan}")
print(f"dbd_A={dbd_A} dbd_B={dbd_B} dbd_C={dbd_C}")
print(f"pasien_berulang={len(pasien_berulang)}")`,
        lockLines: 21,
        solution: `import sqlite3

# ── Data SINTETIS (pola meniru data operasional faskes; angka dibuat untuk latihan) ──
con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.executescript("""
CREATE TABLE pasien(id INTEGER PRIMARY KEY, nama TEXT, usia INTEGER, faskes TEXT);
CREATE TABLE kunjungan(id INTEGER PRIMARY KEY, pasien_id INTEGER, tanggal TEXT, diagnosis TEXT);
INSERT INTO pasien VALUES
(1,'Sari',34,'Puskesmas A'),(2,'Budi',52,'Puskesmas A'),(3,'Ani',28,'Puskesmas B'),
(4,'Dedi',61,'Puskesmas B'),(5,'Rina',45,'Puskesmas A'),(6,'Tono',39,'Puskesmas C'),
(7,'Maya',55,'Puskesmas C'),(8,'Joko',47,'Puskesmas B');
INSERT INTO kunjungan VALUES
(1,1,'2026-10-02','DBD'),(2,1,'2026-10-15','DBD'),(3,2,'2026-10-03','Hipertensi'),
(4,3,'2026-10-04','DBD'),(5,4,'2026-10-05','Diabetes'),(6,4,'2026-10-19','Diabetes'),
(7,5,'2026-10-06','DBD'),(8,5,'2026-10-12','DBD'),(9,6,'2026-10-07','ISPA'),
(10,7,'2026-10-08','DBD'),(11,7,'2026-10-21','DBD'),(12,8,'2026-10-09','Hipertensi'),
(13,2,'2026-10-22','DBD'),(14,8,'2026-10-25','DBD');
""")

# TULIS KODEMU
n_kunjungan = cur.execute("SELECT COUNT(*) FROM kunjungan").fetchone()[0]

_rows = cur.execute("""
SELECT p.faskes, COUNT(*)
FROM kunjungan k JOIN pasien p ON k.pasien_id = p.id
WHERE k.diagnosis = 'DBD'
GROUP BY p.faskes
""").fetchall()
_dbd = dict(_rows)
dbd_A, dbd_B, dbd_C = _dbd["Puskesmas A"], _dbd["Puskesmas B"], _dbd["Puskesmas C"]

pasien_berulang = [r[0] for r in cur.execute("""
SELECT p.nama
FROM kunjungan k JOIN pasien p ON k.pasien_id = p.id
GROUP BY p.id
HAVING COUNT(*) >= 2
""").fetchall()]

print(f"total_kunjungan={n_kunjungan}")
print(f"dbd_A={dbd_A} dbd_B={dbd_B} dbd_C={dbd_C}")
print(f"pasien_berulang={len(pasien_berulang)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_kunjungan", value: 14, label: "`n_kunjungan` = 14", msg: "SELECT COUNT(*) FROM kunjungan — 14 baris kunjungan." },
          { kind: "equal", task: "t2", name: "dbd_A", value: 5, label: "`dbd_A` = 5", msg: "Kunjungan DBD Puskesmas A: Sari 2 + Budi 1 + Rina 2 = 5." },
          { kind: "equal", task: "t2", name: "dbd_B", value: 2, label: "`dbd_B` = 2", msg: "Kunjungan DBD Puskesmas B: Ani 1 + Joko 1 = 2." },
          { kind: "equal", task: "t2", name: "dbd_C", value: 2, label: "`dbd_C` = 2", msg: "Kunjungan DBD Puskesmas C: Maya 2 = 2." },
          { kind: "contains", task: "t3", name: "pasien_berulang", label: "`pasien_berulang` terisi", msg: "GROUP BY p.id HAVING COUNT(*) >= 2 — 6 nama." },
          { kind: "stdout_matches", task: "t4", pattern: "total_kunjungan=14", label: "Total tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "dbd_A=5 dbd_B=2 dbd_C=2", label: "Rincian DBD tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "pasien_berulang=6", label: "Kunjungan berulang tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: query yang baik = pertanyaan yang presisi",
        body: "Tiga kebiasaan analis SQL senior. Pertama, tulis komentar pertanyaan di atas query — “kunjungan DBD per faskes, Oktober 2026” — supaya tiga bulan kemudian kamu (atau penggantimu) tahu query ini menjawab apa. Kedua, jalankan query agregasi dua kali: sekali tanpa GROUP BY untuk melihat total mentah, sekali dengan GROUP BY — jumlah kelompok harus sama dengan total mentah; kalau tidak, ada yang salah di join. Ketiga, untuk angka yang dilaporkan ke pimpinan, simpan query-nya sebagai file berversi (bukan ditempel di chat) — angka yang bisa dijalankan ulang adalah angka yang bisa dipertahankan.",
      },
      reference: "Pola rekap Dinkes: JOIN (sambung) → WHERE (saring diagnosis) → GROUP BY (kelompokkan faskes) → HAVING (saring kelompok).",
    },
    {
      id: "chart-dbd",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca hasil query seperti Kepala Dinas",
      prose: [
        "Query t2-mu menghasilkan tiga angka: Puskesmas A = 5, B = 2, C = 2 kunjungan DBD. Diagram batang di bawah memvisualkan persis hasil itu — inilah jembatan antara query dan keputusan: Kepala Dinas tidak membaca tabel, ia membaca gambar.",
        "Cara membaca: sumbu X = tiga puskesmas; tinggi batang = jumlah kunjungan dengan diagnosis DBD selama Oktober 2026; angka di atas batang = nilai persisnya.",
        "Interpretasi: beban DBD terkonsentrasi di Puskesmas A (5 dari 9 kunjungan, 56%). Ini BUKAN vonis “A paling bermasalah” — A mungkin sekadar wilayah paling padat atau paling rajin mencatat. Tindak lanjut yang benar: cek denominator (populasi per wilayah) dan kualitas pencatatan, lalu putuskan fogging atau penyelidikan epidemiologi. Chart menjawab “di mana”, bukan “kenapa”.",
      ],
      tasks: [],
      figure: { svg: DBD_SVG, alt: "Diagram batang kunjungan DBD per faskes: A 5, B 2, C 2", caption: "Hasil query t2 divisualkan — kunjungan DBD per faskes, Oktober 2026 (data sintetis)." },
      hints: [
        "💡 Intuisi: chart yang baik untuk pimpinan selalu menjawab satu pertanyaan dalam 5 detik. Kalau butuh lebih dari 5 detik untuk paham, chart-nya yang salah — bukan pembacanya.",
      ],
      reference: "Visualisasi = terjemahan query untuk pengambil keputusan. Selalu sertakan denominator sebelum menarik kesimpulan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Query apa untuk pertanyaan apa",
      prose: [
        "Skenario 1 — “Tampilkan data mentah untuk diperiksa”: kondisi = kamu butuh melihat baris aslinya (audit, cek anomali). Pakai SELECT + WHERE + ORDER BY + LIMIT. Contoh: 20 kunjungan DBD terbaru untuk verifikasi manual. Alasan: agregasi menyembunyikan anomali baris.",
        "Skenario 2 — “Gabungkan info dari dua tabel”: kondisi = kolom yang dibutuhkan tersebar di dua tabel. Pakai JOIN dengan ON yang eksplisit, lalu cek COUNT sebelum–sesudah. Contoh: nama pasien + diagnosis. Alasan: tanpa join kamu menebak-nebak pemilik baris.",
        "Skenario 3 — “Rekap per kelompok”: kondisi = pertanyaan “berapa per …”. Pakai GROUP BY + fungsi agregasi. Contoh: kunjungan per faskes per bulan. Alasan: ini 80% pekerjaan rekap operasional.",
        "Skenario 4 — “Saring hasil rekap”: kondisi = ambang batas pada angka agregat (“faskes dengan DBD ≥ 5”). Pakai HAVING setelah GROUP BY — bukan WHERE. Contoh: daftar pasien kunjungan berulang. Alasan: WHERE tidak mengenal hasil agregasi.",
        "Skenario 5 — “Cohort sederhana”: kondisi = kelompokkan pasien berdasarkan kejadian pertama, lalu ikuti perkembangannya. Pakai subquery/CTE: tentukan tanggal kejadian pertama per pasien (MIN(tanggal) + GROUP BY pasien_id), lalu join kembali. Contoh: pasien yang didiagnosis DBD di minggu pertama Oktober — berapa yang kembali berobat dalam 14 hari? Alasan: banyak pertanyaan epidemiologi adalah pertanyaan cohort yang disamarkan.",
        "Aturan praktis 10 detik: satu tabel → SELECT; dua tabel → JOIN (cek baris!); “berapa per …” → GROUP BY; ambang pada hasil → HAVING; pertanyaan “yang pertama kali … lalu …” → cohort via subquery.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menulis query kompleks sekaligus lalu bingung saat hasilnya aneh. Praktik yang benar: bangun query berlapis — jalankan SELECT mentah dulu, tambah WHERE, cek jumlah baris, tambah JOIN, cek lagi, baru GROUP BY. Setiap lapisan yang diverifikasi adalah satu sumber bug yang disingkirkan.",
      },
      reference: "SELECT → JOIN → GROUP BY → HAVING. Bangun berlapis, verifikasi tiap lapisan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Jawaban untuk rapat jam 10",
      prose: [
        "Situasinya: kamu adalah Bu Ratna. Datanya kini sudah di database (tabel seperti di lab). Kepala Dinas meminta, untuk rapat jam 10: (1) total kunjungan Oktober, (2) kunjungan DBD per puskesmas, (3) daftar pasien yang kunjungannya ≥2 kali bulan ini — karena mereka kandidat penyelidikan kontak. Waktu tersisa 20 menit.",
        "Pertanyaan analisis: (a) query apa yang kamu jalankan untuk tiap permintaan — dan dalam urutan apa? (b) Pemeriksaan kualitas apa yang kamu lakukan sebelum mengirim angka, mengingat hanya ada 20 menit? (c) Satu kalimat disclaimer apa yang kamu sertakan di laporan agar angka tidak disalahartikan?",
        "Pembahasan: (a) Urutan: t1 dulu (total = sanity check), lalu t2 (DBD per faskes), lalu t3 (pasien berulang) — dari yang paling sederhana ke yang paling kompleks, supaya kalau waktu habis, angka terpenting sudah ada. (b) Pemeriksaan 20 menit: bandingkan total kunjungan dengan bulan lalu (lonjakan/turunan ekstrem = sinyal salah input); pastikan tidak ada pasien_id yatim (kunjungan tanpa pasien); cek duplikat kunjungan (id, tanggal, pasien_id sama persis). (c) Disclaimer: “Angka kunjungan, bukan angka penderita — satu pasien dapat tercatat beberapa kali; dan cakupan hanya dari faskes yang sudah melaporkan.” Tiga kalimat ini membedakan analis dari penyalin: analis tahu apa yang TIDAK bisa disimpulkan dari datanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di industri asuransi kesehatan dan farmakovigilans, query yang sama menentukan reserve klaim dan sinyal keamanan obat. Kesalahan join yang menggandakan baris di laporan Dinkes menjadi kesalahan estimasi kerugian di aktuaria — dengan konsekuensi finansial langsung. Disiplin verifikasi berlapis yang kamu latih di sini adalah fondasi risk analytics.",
      },
      reference: "Laporkan: angka + pemeriksaan kualitas + disclaimer tentang apa yang tidak bisa disimpulkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "SELECT kolom FROM tabel WHERE syarat — saring baris dulu, pilih kolom kemudian; ORDER BY + LIMIT untuk menjelajah tabel besar.",
        "JOIN menyambung tabel lewat kunci (ON); selalu cek jumlah baris sebelum–sesudah join untuk menangkap fan trap.",
        "GROUP BY mengelompokkan + agregasi (COUNT/SUM/AVG); HAVING menyaring HASIL agregasi — WHERE tidak bisa.",
        "COUNT(*) menghitung baris; COUNT(DISTINCT id) menghitung entitas unik — bedakan kunjungan vs penderita.",
        "Bangun query berlapis dan verifikasi tiap lapisan; simpan query laporan sebagai file berversi agar bisa direproduksi.",
      ],
      quiz: [
        {
          q: "Tabel kunjungan punya 14 baris; satu pasien tercatat 3 kali. COUNT(*) vs COUNT(DISTINCT pasien_id) menghasilkan?",
          options: [
            { text: "COUNT(*) = 14 (baris), COUNT(DISTINCT pasien_id) = 8 (orang unik) — keduanya benar untuk pertanyaan berbeda", why: "Benar: COUNT(*) menghitung baris kunjungan; DISTINCT menghitung orang unik. Pilih sesuai pertanyaan: “berapa kunjungan” vs “berapa penderita”.", correct: true },
            { text: "Keduanya 14 — DISTINCT tidak berpengaruh", why: "Salah: DISTINCT menghilangkan duplikat pasien_id, sehingga hasilnya 8, bukan 14." },
            { text: "Keduanya 8 — COUNT(*) otomatis unik", why: "Salah: COUNT(*) tidak pernah menghilangkan duplikat; ia menghitung semua baris." },
            { text: "COUNT(*) salah — harus selalu DISTINCT", why: "Salah: tidak ada yang “selalu benar”; untuk “total kunjungan” COUNT(*) justru yang tepat." },
          ],
        },
        {
          q: "Setelah JOIN kunjungan ke tabel detail diagnosis (satu kunjungan bisa punya 3 baris detail), “jumlah kunjungan” menjadi 3x lipat. Apa yang terjadi dan apa obatnya?",
          options: [
            { text: "Fan trap — join satu-ke-banyak melipatgandakan baris; obatnya agregasi SEBELUM join atau hitung COUNT(DISTINCT id_kunjungan)", why: "Benar: baris detail melipatgandakan baris induk. Agregasi di level yang benar sebelum join, atau DISTINCT pada kunci induk.", correct: true },
            { text: "Datanya rusak — hapus tabel detail", why: "Salah: datanya valid; yang salah adalah level agregasi query. Menghapus tabel menghilangkan informasi." },
            { text: "Pakai WHERE untuk membuang kelebihan baris", why: "Salah: WHERE menyaring baris berdasarkan syarat, tidak memperbaiki pelipatgandaan struktural." },
            { text: "Itu normal — laporkan saja angka 3x lipat", why: "Salah: melaporkan angka yang diketahui salah adalah pelanggaran integritas analis." },
          ],
        },
        {
          q: "“Tampilkan puskesmas dengan kunjungan DBD minimal 5” — klausa yang benar?",
          options: [
            { text: "GROUP BY faskes HAVING COUNT(*) >= 5", why: "Benar: ambang batas pada HASIL agregasi → HAVING, setelah GROUP BY.", correct: true },
            { text: "WHERE COUNT(*) >= 5", why: "Salah: WHERE dievaluasi sebelum agregasi dan tidak mengenal COUNT(*) — query error." },
            { text: "WHERE faskes >= 5", why: "Salah: membandingkan nama faskes (teks) dengan angka — tidak masuk akal dan tidak menjawab pertanyaan." },
            { text: "ORDER BY COUNT(*) DESC LIMIT 5", why: "Salah: ini mengambil 5 TERATAS, bukan yang “minimal 5” — beda pertanyaan." },
          ],
        },
        {
          q: "Kenapa analis senior mengecek COUNT(*) sebelum dan sesudah JOIN?",
          options: [
            { text: "Untuk menangkap baris yang hilang (kunci yatim) atau berlipat ganda (fan trap) — sinyal masalah kualitas data/join", why: "Benar: perubahan jumlah baris yang tak terduga adalah detektor dini join salah atau kunci kotor.", correct: true },
            { text: "Untuk mempercepat query", why: "Salah: COUNT tambahan justru menambah kerja; tujuannya verifikasi, bukan kecepatan." },
            { text: "Itu ritual — tidak ada gunanya", why: "Salah: ini praktik verifikasi standar; mengabaikannya adalah sumber klasik angka salah di laporan." },
            { text: "Agar hasil join selalu lebih sedikit", why: "Salah: join yang benar bisa menambah, mengurangi, atau mempertahankan jumlah baris tergantung relasinya." },
          ],
        },
        {
          q: "Untuk “nama pasien beserta diagnosis kunjungannya”, tabel dan klausa yang dibutuhkan?",
          options: [
            { text: "JOIN pasien dan kunjungan ON kunjungan.pasien_id = pasien.id — nama dari tabel pasien, diagnosis dari tabel kunjungan", why: "Benar: dua tabel → JOIN; ON memakai kunci relasi yang benar.", correct: true },
            { text: "SELECT dari tabel kunjungan saja — nama pasti ada di sana", why: "Salah: tabel kunjungan hanya menyimpan pasien_id (kunci), bukan nama — menebak kolom berujung error." },
            { text: "JOIN ON pasien.nama = kunjungan.diagnosis", why: "Salah: mencocokkan nama orang dengan nama penyakit — kunci yang salah menghasilkan sampah." },
            { text: "UNION kedua tabel", why: "Salah: UNION menumpuk baris (butuh struktur kolom sama), bukan menyambung kolom antar tabel." },
          ],
        },
        {
          q: "Kepala Dinas minta angka “penderita DBD bulan ini”. Data yang ada: tabel kunjungan (bisa ada kunjungan berulang). Jawaban analis yang benar?",
          options: [
            { text: "Hitung COUNT(DISTINCT pasien_id) untuk kunjungan DBD — dan sertakan disclaimer bahwa ini proksi dari data faskes pelapor saja", why: "Benar: penderita = orang unik, bukan kunjungan; plus disclaimer cakupan karena tidak semua kasus tercatat di faskes.", correct: true },
            { text: "COUNT(*) kunjungan DBD — lebih besar, lebih meyakinkan", why: "Salah: membesar-besarkan angka demi kesan adalah manipulasi; kunjungan ≠ penderita." },
            { text: "Tolak — data tidak bisa menjawab itu", why: "Salah: data BISA menjawab dengan proksi yang tepat + disclaimer; menolak total adalah kemalasan analitis." },
            { text: "Ambil angka bulan lalu saja — pasti mirip", why: "Salah: mengarang data. Tidak pernah bisa dibenarkan." },
          ],
        },
      ],
      next: { label: "Lanjut: Dashboard Kesehatan", href: "/v2/learn/hd28-dashboard-kesehatan" },
    },
  ],
};
