import type { V2Lesson } from "../lib/types";

// ── Figure: hasil 5 expectation ──────────────────────────────────────────
const GX_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram batang hasil lima expectation">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="150" y1="20" x2="150" y2="190"/><line x1="150" y1="190" x2="530" y2="190"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)">
<text x="144" y="52" text-anchor="end">id_unik</text>
<text x="144" y="82" text-anchor="end">tenor_tidak_null</text>
<text x="144" y="112" text-anchor="end">tenor_6_60</text>
<text x="144" y="142" text-anchor="end">kode_cabang_format</text>
<text x="144" y="172" text-anchor="end">nominal_positif</text>
</g>
<g font-family="var(--font-ui)">
<rect x="150" y="40" width="36" height="18" fill="var(--c3)" opacity="0.9"/>
<text x="192" y="54" font-size="11" fill="var(--text)">GAGAL</text>
<rect x="150" y="70" width="36" height="18" fill="var(--c3)" opacity="0.9"/>
<text x="192" y="84" font-size="11" fill="var(--text)">GAGAL</text>
<rect x="150" y="100" width="36" height="18" fill="var(--c3)" opacity="0.9"/>
<text x="192" y="114" font-size="11" fill="var(--text)">GAGAL</text>
<rect x="150" y="130" width="170" height="18" fill="var(--c2)" opacity="0.9"/>
<text x="326" y="144" font-size="11" fill="var(--text)">LOLOS</text>
<rect x="150" y="160" width="36" height="18" fill="var(--c3)" opacity="0.9"/>
<text x="192" y="174" font-size="11" fill="var(--text)">GAGAL</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="150" y="212">hasil validasi 5 expectation atas data pengajuan (ilustrasi; 1/5 lolos = 20% KRITIS)</text>
</g>
</svg>`;

export const dm25: V2Lesson = {
  slug: "dm25-great-expectations",
  track: "Data Management",
  module: "Tata Kelola",
  title: "Great Expectations & Automated Data Quality",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard NPL 2,1% yang tidak pernah salah — dan tidak pernah benar",
      prose: [
        "Sebuah bank memantau NPL lewat dashboard harian. Selama empat bulan angkanya stabil di 2,1% — manajemen senang, regulator tidak bertanya. Lalu audit internal menemukan: pipeline ETL punya filter “buang baris dengan tenor NULL” yang ditulis tiga tahun lalu sebagai “pembersih sementara”. Setiap bulan, 300–500 pengajuan dengan data rusak dibuang diam-diam — bukan diperbaiki, bukan dilaporkan. NPL-nya “benar” secara matematis dari data yang tersisa; ia salah karena data yang hilang tidak pernah dihitung. Twist-nya: tidak ada yang berbohong. Filter itu ditulis dengan niat baik, dashboard-nya menghitung dengan tepat, dan semua orang percaya pada angka yang rapi. Data quality yang buruk tidak berteriak — ia diam-diam menghapus baris.",
        "Inilah alasan validasi data otomatis ada: manusia tidak bisa memeriksa jutaan baris tiap hari, dan “pembersih sementara” selalu menjadi permanen. Great Expectations (GX) adalah framework open-source yang mengubah asumsi tentang data menjadi expectation yang bisa dieksekusi: “kolom id harus unik”, “tenor harus 6–60”, “nominal harus positif” — lalu menjalankannya tiap batch data masuk dan berteriak bila ada yang gagal.",
        "Di lesson ini kamu belajar anatomi expectation, empat pola validasi fundamental, dan cara SQL profiling menjadi fondasinya — lalu menulis validator ala-GX sendiri di lab: lima expectation atas data pengajuan yang kotor.",
      ],
      tasks: [],
      note: {
        title: "Catatan jujur tentang lab",
        type: "risk",
        body: "Library Great Expectations tidak tersedia di lingkungan lab browser (Pyodide). Lab ini mengimplementasikan logika yang sama — expectation sebagai fungsi, suite sebagai koleksi, checkpoint sebagai eksekusi terjadwal — dalam Python murni. Polanya 1:1 dengan GX; yang hilang hanya sintaks library-nya.",
      },
      reference: "Data kotor tidak berteriak — ia diam-diam menghapus baris. Validasi otomatis adalah alarmnya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan estimasi waktu",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan tiga komponen GX (expectation, suite, checkpoint/data docs) dan alurnya; (2) merancang expectation untuk empat pola validasi (completeness, uniqueness, validity, consistency); (3) menjelaskan peran SQL profiling sebagai fondasi sebelum menulis expectation; (4) menghitung skor kualitas batch dan menentukan tindakannya (lolos/waspada/blokir).",
        "Rutenya: cerita → tiga konsep inti (anatomi expectation; empat pola validasi + SQL profiling; checkpoint & alerting) → lab Python (validator ala-GX: 5 expectation atas data kotor) → chart hasil validasi → peta keputusan → mini-case pipeline kredit → kuis → rangkuman. Estimasi 65 menit; lab-nya ±15 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: expectation adalah unit test untuk data. Sama seperti kode tanpa test akan rusak diam-diam, data tanpa expectation akan kotor diam-diam.",
      ],
      reference: "Tujuan: paham anatomi GX, bisa merancang expectation, paham SQL profiling, bisa menilai skor kualitas batch.",
    },
    {
      id: "konsep-expectation",
      eyebrow: "Langkah 3 · Konsep",
      title: "Expectation — Si Satpam yang Punya Daftar Periksa",
      prose: [
        "Definisi: expectation adalah pernyataan yang dapat dieksekusi tentang bagaimana data seharusnya terlihat — contoh: expect_column_values_to_be_unique(\"id\"), expect_column_values_to_be_between(\"tenor\", 6, 60), expect_column_values_to_match_regex(\"kode_cabang\", \"^[A-Z]{3}-\\d{2}$\"). Kumpulan expectation untuk satu dataset disebut suite; checkpoint adalah eksekusi suite terjadwal (tiap batch masuk); data docs adalah laporan HTML hasil validasi yang bisa dibaca manusia.",
        "Kepribadiannya: expectation seperti satpam mal dengan daftar periksa — setiap pengunjung (baris data) diperiksa: bawa kartu identitas? (not null), umurnya masuk akal? (range), pakaiannya sesuai aturan? (format). Satpam tidak memutuskan nasib mal; ia hanya meniup peluit bila ada yang melanggar — keputusan (tolak batch, karantina, lanjut dengan peringatan) ada di tanganmu. Suite adalah buku SOP satpamnya; checkpoint adalah jadwal jaganya; data docs adalah laporan hariannya ke manajemen.",
        "Kapan memakai: setiap pipeline yang angkanya dipakai keputusan — ETL kredit, feed laporan regulator, data training model. Aturan praktis: tulis expectation SEBELUM pipeline production, bukan sesudah insiden. Kapan TIDAK: eksplorasi ad-hoc sekali pakai — expectation adalah kontrak, dan kontrak butuh sesuatu yang stabil untuk dikontrakkan.",
      ],
      formula: String.raw`S = \frac{n_{\text{lolos}}}{n_{\text{aturan}}}`,
      formulaNote: "S = skor kualitas satu batch, 0 sampai 1. n_lolos = jumlah expectation yang lolos; n_aturan = total expectation di suite. Contoh: 4 dari 5 lolos → S = 0,8. Interpretasi: S ≥ 0,9 batch SEHAT (lanjut); 0,7–0,9 WASPADA (lanjut dengan catatan + investigasi); < 0,7 KRITIS (tahan batch, jangan biarkan angka kotor mengalir ke dashboard). Ambang ini contoh operasional — sesuaikan dengan risiko bisnismu.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Data sudah dibersihkan di ETL, jadi tidak perlu divalidasi”",
        type: "pitfall",
        body: "Yang benar: pembersihan tanpa validasi = filter “buang baris NULL” yang menjadi permanen — persis seperti cerita pembuka. Pembersihan mengubah data; validasi mengawasi perubahan itu. Tanpa validasi, kamu tidak tahu apakah yang dibuang 0,1% atau 15% — dan dashboard tetap terlihat rapi.",
      },
      hints: [
        "💡 Intuisi: expectation terbaik ditulis dari insiden masa lalu. Setiap bug data yang pernah menyakitimu (“tenor 72 bulan lolos ke scoring!”) adalah satu expectation yang belum ditulis.",
      ],
      reference: "Expectation = unit test untuk data. Tulis dari insiden masa lalu.",
    },
    {
      id: "konsep-pola",
      eyebrow: "Langkah 4 · Konsep",
      title: "Empat Pola Validasi — dan SQL Profiling sebagai Fondasinya",
      prose: [
        "Definisi: empat pola validasi fundamental yang mencakup mayoritas masalah kualitas data. (1) Completeness — tidak ada yang hilang: kolom kunci not null, jumlah baris sesuai ekspektasi. (2) Uniqueness — tidak ada duplikat: primary key unik. (3) Validity — nilai masuk akal: range, format regex, daftar nilai yang diizinkan. (4) Consistency — antar kolom/tabel selaras: tanggal_jatuh_tempo > tanggal_akad; total di mart = sum di staging.",
        "Kepribadiannya: completeness seperti absensi kelas — siapa yang tidak hadir hari ini? Uniqueness seperti sidik jari — tidak boleh ada dua orang dengan sidik jari sama. Validity seperti SIM — formatnya benar dan masih berlaku? Consistency seperti silang pendapat dua saksi — cerita tabel A dan tabel B harus cocok.",
        "Sebelum menulis expectation, lakukan SQL profiling — fondasinya. Profiling = statistik deskriptif tiap kolom via query: COUNT, COUNT(DISTINCT), MIN/MAX, pola NULL per kolom. Contoh query fondasi: SELECT COUNT(*) AS n, COUNT(DISTINCT id) AS unik, SUM(CASE WHEN tenor IS NULL THEN 1 ELSE 0 END) AS null_tenor FROM pengajuan. Hasil profiling memberitahumu expectation apa yang realistis: bila 30% tenor NULL di data historis, expectation “tenor not null” akan gagal selamanya — perbaiki sumbernya dulu, atau tulis expectation sebagai “% null < 5%” yang bertahap. Aturan emas: profiling dulu, expectation kemudian. Expectation tanpa profiling = kontrak yang ditulis tanpa melihat barangnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Expectation harus 100% lolos atau pipeline gagal”",
        type: "pitfall",
        body: "Yang benar: tidak semua expectation adalah blocker. Bedakan critical (id unik, nominal positif — gagal = tahan batch) vs warning (kode_cabang format — gagal = catat + investigasi, batch lanjut). Suite tanpa level keparahan akan menjadi alarm yang selalu berbunyi — dan alarm yang selalu berbunyi akan dimatikan manusia.",
      },
      hints: [
        "💡 Intuisi: mulai dari 5–10 expectation critical, bukan 100. Suite yang kecil dan dipercaya mengalahkan suite besar yang diabaikan.",
      ],
      reference: "Profiling dulu, expectation kemudian. Bedakan critical vs warning.",
    },
    {
      id: "konsep-ops",
      eyebrow: "Langkah 5 · Konsep",
      title: "Checkpoint & Alerting — Si Jadwal Jaga dan Si Papan Pengumuman",
      prose: [
        "Definisi: checkpoint adalah eksekusi suite yang terjadwal — tiap batch data masuk (atau tiap jam/hari), suite berjalan otomatis dan menghasilkan data docs: laporan HTML berisi expectation mana yang lolos/gagal beserta sampel baris yang gagal. Alerting meneruskan hasilnya ke manusia: critical → pager/telepon (bangunkan orang), warning → digest harian (Slack/email).",
        "Kepribadiannya: checkpoint seperti jadwal jaga satpam — ia memastikan ada yang berjaga tiap batch, bukan hanya saat diingat. Data docs seperti papan pengumuman di pos satpam — semua orang bisa membaca apa yang terjadi semalam. Alerting seperti protokol kebakaran: alarm kecil (warning) dicatat di log, alarm besar (critical) membunyikan sirene. Tanpa protokol ini, validasi hanyalah script yang tidak pernah dijalankan.",
        "Kapan memakai: setiap pipeline production yang angkanya dipakai keputusan — pasang checkpoint sebelum go-live, bukan sesudah insiden pertama. Atur juga tren kualitas: plot skor S dari waktu ke waktu — penurunan bertahap (0,95 → 0,90 → 0,85) adalah early warning degradasi sumber data yang tidak terlihat dari satu batch. Kapan TIDAK: pipeline eksperimental yang skemanya berubah tiap hari — expectation akan gagal terus dan alarmnya dimatikan manusia.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi: data docs adalah artefak audit gratis. Saat regulator atau auditor bertanya “bagaimana kamu tahu data ini benar?”, jawaban “ini laporan validasi 90 hari terakhir” mengalahkan seribu slide.",
      ],
      reference: "Jadwalkan checkpoint, publikasikan data docs, rute-kan alert berdasar keparahan.",
    },
    {
      id: "lab-validator",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Validator ala-GX atas data pengajuan",
      prose: [
        "Waktunya jadi satpam datanya. Di bawah ada 6 baris pengajuan kredit sintetis — beberapa kotor. Tugasmu: (1) implementasikan lima fungsi expectation (id unik, tenor tidak null, tenor 6–60, format kode cabang, nominal positif); (2) evaluasi semuanya menjadi dict hasil; (3) hitung skor = lolos/total dan tentukan status (≥0,9 SEHAT; ≥0,7 WASPADA; selainnya KRITIS); (4) cetak laporannya.",
        "Coba: setelah lolos, ubah tenor baris A02 dari 72 menjadi 48 dan nominal A03 menjadi positif — perhatikan skor naik dan status berubah. Lalu tanya: expectation mana yang seharusnya critical (tahan batch) vs warning? Tulis alasanmu di komentar.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi lima fungsi expectation: cek_unik, cek_tidak_null, cek_rentang, cek_format, cek_positif" },
        { id: "t2", text: "Evaluasi kelimanya ke dict `hasil` (nama → True/False)" },
        { id: "t3", text: "Hitung `skor`, `lolos`, dan `status`" },
        { id: "t4", text: "Jalankan dan pastikan laporan tercetak" },
      ],
      expected: "Expectation lolos: 1/5 (20.0%) — status: KRITIS\nGagal: id_unik, tenor_tidak_null, tenor_6_60, nominal_positif",
      code: {
        starter: `import re

# Data pengajuan (SINTETIS — 6 baris, beberapa kotor)
data = [
    {"id": "A01", "tenor": 12, "kode_cabang": "JKT-01", "nominal": 5000000},
    {"id": "A02", "tenor": 72, "kode_cabang": "JKT-01", "nominal": 8000000},
    {"id": "A03", "tenor": 24, "kode_cabang": "BDG-01", "nominal": -500000},
    {"id": "A04", "tenor": 36, "kode_cabang": "SBY-02", "nominal": 9000000},
    {"id": "A01", "tenor": 12, "kode_cabang": "JKT-01", "nominal": 5000000},
    {"id": "A05", "tenor": None, "kode_cabang": "JKT-02", "nominal": 7000000},
]
POLA_KODE = re.compile(r"^[A-Z]{3}-\\d{2}$")

# TULIS KODEMU DI BAWAH INI
def cek_unik(rows):
    return

def cek_tidak_null(rows):
    return

def cek_rentang(rows):
    return

def cek_format(rows):
    return

def cek_positif(rows):
    return

hasil = {}  # TODO: {"id_unik": ..., "tenor_tidak_null": ..., "tenor_6_60": ..., "kode_cabang_format": ..., "nominal_positif": ...}

lolos = 0  # TODO: jumlah True di hasil
skor = 0.0  # TODO: lolos / total
status = ""  # TODO: >=0.9 SEHAT, >=0.7 WASPADA, else KRITIS

print(f"Expectation lolos: {lolos}/{len(hasil)} ({skor*100:.1f}%) — status: {status}")
gagal = [k for k, v in hasil.items() if not v]
print(f"Gagal: {', '.join(gagal)}")`,
        lockLines: 13,
        solution: `import re

# Data pengajuan (SINTETIS — 6 baris, beberapa kotor)
data = [
    {"id": "A01", "tenor": 12, "kode_cabang": "JKT-01", "nominal": 5000000},
    {"id": "A02", "tenor": 72, "kode_cabang": "JKT-01", "nominal": 8000000},
    {"id": "A03", "tenor": 24, "kode_cabang": "BDG-01", "nominal": -500000},
    {"id": "A04", "tenor": 36, "kode_cabang": "SBY-02", "nominal": 9000000},
    {"id": "A01", "tenor": 12, "kode_cabang": "JKT-01", "nominal": 5000000},
    {"id": "A05", "tenor": None, "kode_cabang": "JKT-02", "nominal": 7000000},
]
POLA_KODE = re.compile(r"^[A-Z]{3}-\\d{2}$")

# TULIS KODEMU DI BAWAH INI
def cek_unik(rows):
    ids = [r["id"] for r in rows]
    return len(ids) == len(set(ids))

def cek_tidak_null(rows):
    return all(r["tenor"] is not None for r in rows)

def cek_rentang(rows):
    return all(r["tenor"] is None or 6 <= r["tenor"] <= 60 for r in rows)

def cek_format(rows):
    return all(POLA_KODE.match(r["kode_cabang"]) for r in rows)

def cek_positif(rows):
    return all(r["nominal"] > 0 for r in rows)

hasil = {
    "id_unik": cek_unik(data),
    "tenor_tidak_null": cek_tidak_null(data),
    "tenor_6_60": cek_rentang(data),
    "kode_cabang_format": cek_format(data),
    "nominal_positif": cek_positif(data),
}

lolos = sum(1 for v in hasil.values() if v)
skor = lolos / len(hasil)
status = "SEHAT" if skor >= 0.9 else ("WASPADA" if skor >= 0.7 else "KRITIS")

print(f"Expectation lolos: {lolos}/{len(hasil)} ({skor*100:.1f}%) — status: {status}")
gagal = [k for k, v in hasil.items() if not v]
print(f"Gagal: {', '.join(gagal)}")`,
        checks: [
          { kind: "equal", task: "t3", name: "skor", value: 0.2, tol: 0.001, label: "`skor` harus 0,2", msg: "Hanya kode_cabang_format yang lolos: 1/5." },
          { kind: "equal", task: "t3", name: "lolos", value: 1, tol: 0, label: "`lolos` harus 1", msg: "Satu expectation lolos dari lima." },
          { kind: "equal", task: "t2", name: "hasil", value: {"id_unik": false, "tenor_tidak_null": false, "tenor_6_60": false, "kode_cabang_format": true, "nominal_positif": false}, tol: 0, label: "dict `hasil` tepat", msg: "Periksa tiap expectation satu per satu." },
          { kind: "stdout_matches", task: "t4", pattern: "status: KRITIS", label: "Status KRITIS tercetak", msg: "Skor 0,2 < 0,7 → KRITIS." },
          { kind: "stdout_matches", task: "t4", pattern: "Gagal: id_unik, tenor_tidak_null, tenor_6_60, nominal_positif", label: "Daftar gagal tercetak", msg: "Empat expectation gagal tercantum berurutan." },
        ],
      },
      note: {
        title: "Kenapa cek_rentang membolehkan None?",
        body: "Keputusan desain yang disengaja: satu baris, satu masalah. Baris A05 sudah gagal di cek_tidak_null — menghukumnya dua kali di cek_rentang hanya menambah noise. Prinsip suite yang baik: tiap baris kotor gagal tepat di SATU expectation yang paling menjelaskan masalahnya. Ini juga cara GX berpikir: expectation saling melengkapi, bukan saling menuduh.",
      },
      reference: "Satu baris kotor = satu expectation yang gagal. Skor batch menentukan tindakan.",
    },
    {
      id: "chart-hasil",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca hasil validasi",
      prose: [
        "Chart di bawah memvisualisasikan hasil lima expectation dari lab — tampilan yang mirip dengan data docs GX versi sederhana.",
        "Cara membaca: tiap baris = satu expectation; batang hijau = LOLOS, batang merah pendek = GAGAL. Panjang batang tidak penting — yang penting warnanya.",
        "Interpretasi: 1 dari 5 lolos (20%) = KRITIS — batch ini tidak boleh mengalir ke dashboard atau model. Perhatikan polanya: yang gagal adalah uniqueness, completeness, dan validity — tiga fondasi sekaligus. Ini bukan “sedikit kotor”, ini sinyal masalah di sistem sumber (duplikat id = bug aplikasi; tenor NULL = form tidak wajib; nominal negatif = tidak ada validasi input). Expectation tidak memperbaiki data — ia menunjukkan ke mana harus pergi memperbaikinya.",
      ],
      figure: {
        svg: GX_SVG,
        alt: "Lima baris expectation: empat GAGAL (merah), satu LOLOS (hijau).",
        caption: "Hasil 5 expectation: 1/5 lolos (20%) — KRITIS, batch ditahan.",
      },
      tasks: [],
      reference: "Expectation menunjukkan ke mana harus pergi memperbaiki — bukan memperbaikinya sendiri.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Batch gagal validasi — apa tindakanmu?",
      prose: [
        "Lima skenario keputusan validasi:",
        "Skenario 1 — Skor 0,95, satu warning gagal (format kode cabang di 2 baris). → Batch LANJUT, catat warning, investigasi async. Alasan: critical semua lolos; warning bukan blocker — menahan batch karena 2 baris format adalah bunuh diri operasional.",
        "Skenario 2 — Skor 0,6, id_unik gagal (duplikat 3%). → Batch DITAHAN, karantina baris duplikat, eskalasi ke tim sumber. Alasan: duplikat primary key meracuni semua join downstream — angka ganda di dashboard lebih buruk daripada dashboard telat.",
        "Skenario 3 — Expectation baru ditulis, langsung gagal 100% di data historis. → Jangan salahkan data — salahkan expectation-nya: profiling dulu, sesuaikan ambang (mis. “null < 5%” bukan “not null”). Alasan: expectation yang tidak pernah lolos = alarm yang akan dimatikan manusia.",
        "Skenario 4 — Tim ingin 200 expectation sekaligus “biar aman”. → Tolak: mulai dari 5–10 critical. Alasan: suite besar yang separuhnya warning = noise; kepercayaan pada validasi dibangun dari suite kecil yang selalu benar.",
        "Skenario 5 — Data training model ML: validity gagal di 8% baris. → Karantina baris gagal, latih tanpa mereka, CATAT eksklusinya di model card. Alasan: model yang dilatih di data kotor tanpa catatan = bom waktu yang tidak bisa diaudit.",
        "Aturan praktis 10 detik: batch gagal? → (1) critical atau warning? (2) critical gagal = tahan + karantina + eskalasi; (3) hanya warning = lanjut + catat + investigasi; (4) expectation-nya sendiri yang salah = perbaiki expectation, bukan data.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghapus baris kotor diam-diam agar skor “hijau”. Itu mengulangi dosa cerita pembuka: dashboard rapi, kebenaran hilang. Baris kotor dikarantina dan dilaporkan — tidak pernah dihapus tanpa jejak.",
      },
      reference: "Critical gagal = tahan. Warning gagal = catat. Jangan pernah hapus diam-diam.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Pipeline SLIK: 2% baris hilang tiap malam",
      prose: [
        "Skenario (sintetis, untuk latihan): bank mengirim data debitur ke SLIK tiap malam via pipeline ETL. Tiga bulan berjalan lancar. Lalu tim risk menemukan: 2% baris hilang tiap batch — filter “buang baris dengan kode_cabang tidak dikenal” membuang cabang baru yang belum terdaftar di tabel referensi. Tidak ada yang sadar karena dashboard “jumlah baris terkirim” tidak dibandingkan dengan “jumlah baris sumber”.",
        "Pertanyaan analisis: (1) Expectation apa yang akan menangkap ini di hari pertama? (2) Critical atau warning? (3) Bagaimana desain tabel referensi agar cabang baru tidak terbuang?",
        "Pembahasan: (1) Dua expectation: completeness — “jumlah baris terkirim = jumlah baris sumber” (pola count check), dan validity — “kode_cabang harus ada di tabel referensi ATAU masuk daftar karantina” (bukan dibuang). (2) Count check = critical (tahan batch bila selisih > 0,1%); referensi = warning yang dieskalasi harian — cabang baru adalah fakta bisnis, bukan kesalahan data. (3) Tabel referensi butuh proses “cabang baru”: baris tak dikenal masuk karantina + notifikasi ke tim master data, bukan ke tempat sampah. Prinsipnya: data yang tidak dikenal adalah informasi, bukan sampah.",
        "Catatan implementasi: count check adalah expectation termurah dan paling kuat — satu angka (baris masuk vs baris keluar) menangkap seluruh kategori “data hilang diam-diam”. Tulis ini pertama, sebelum expectation yang canggih.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk pelaporan regulator, “data hilang diam-diam” bukan sekadar bug — ia bisa dibaca sebagai manipulasi laporan. Expectation count check adalah bukti audit bahwa yang dikirim = yang dimiliki. Tanpa itu, kamu tidak bisa membuktikan apa-apa saat ditanya.",
      },
      reference: "Count check dulu: baris masuk vs baris keluar. Termurah, terkuat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Expectation = pernyataan tereksekusi tentang data; suite = koleksinya; checkpoint = eksekusi terjadwal; data docs = laporannya.",
        "Empat pola: completeness (tidak hilang), uniqueness (tidak ganda), validity (masuk akal), consistency (selaras).",
        "SQL profiling dulu sebelum menulis expectation — kontrak ditulis setelah melihat barangnya.",
        "Skor batch: ≥0,9 SEHAT; 0,7–0,9 WASPADA; <0,7 KRITIS. Critical gagal = tahan; warning = catat.",
        "Jangan hapus baris kotor diam-diam — karantina dan laporkan.",
      ],
      next: { label: "DM26 — Sertifikasi CDMP/DCAM & Regulasi Data 2026", href: "/learn/dm26-sertifikasi-regulasi-2026" },
      quiz: [
        {
          q: "Pipeline membuang baris dengan tenor NULL secara diam-diam. Expectation yang paling tepat menangkapnya?",
          options: [
            { text: "Completeness: bandingkan jumlah baris masuk vs keluar + expectation not-null di kolom tenor", why: "Benar: count check menangkap “data hilang”; not-null menandai masalahnya. Kombinasi keduanya menutup lubang cerita pembuka.", correct: true },
            { text: "Uniqueness pada kolom id", why: "Salah: duplikat bukan masalah di sini — masalahnya baris yang hilang, bukan baris yang ganda." },
            { text: "Validity range tenor 6–60", why: "Salah: NULL tidak melanggar range — ia lolos dari pemeriksaan range. Butuh completeness, bukan validity." },
            { text: "Consistency antar tabel", why: "Salah: masalahnya terjadi dalam satu tabel sebelum join apa pun; consistency tidak melihat baris yang sudah dibuang." },
          ],
        },
        {
          q: "Expectation baru langsung gagal 100% di data historis. Tindakan yang benar?",
          options: [
            { text: "Profiling dulu, lalu sesuaikan expectation (mis. ambang bertahap) — jangan salahkan data", why: "Benar: expectation yang tidak pernah lolos = kontrak yang ditulis tanpa melihat barangnya. Perbaiki kontraknya.", correct: true },
            { text: "Tahan semua batch sampai data 100% bersih", why: "Salah: menahan bisnis karena standar yang tidak realistis = validasi yang akan dimatikan manusia minggu depan." },
            { text: "Hapus expectation-nya agar hijau", why: "Salah: menghapus alarm karena berbunyi = mengulangi dosa “buang diam-diam”. Alarm yang benar disetel ulang, bukan dicabut." },
            { text: "Turunkan semua expectation jadi warning", why: "Salah: masalahnya bukan level keparahan, melainkan expectation yang tidak mencerminkan realitas data." },
          ],
        },
        {
          q: "Skor batch 0,95; satu-satunya yang gagal adalah warning format kode cabang (2 baris). Keputusan?",
          options: [
            { text: "Batch lanjut, warning dicatat, investigasi async", why: "Benar: critical semua lolos; menahan batch karena 2 baris format = biaya operasional tanpa manfaat.", correct: true },
            { text: "Tahan batch sampai 100% lolos", why: "Salah: perfeksionisme operasional — 2 baris warning tidak meracuni keputusan, tetapi batch yang telat meracuni bisnis." },
            { text: "Hapus 2 baris itu diam-diam", why: "Salah: tidak pernah hapus diam-diam — karantina dan laporkan, selalu." },
            { text: "Ubah warning jadi critical agar tegas", why: "Salah: menaikkan level tidak mengubah fakta bahwa 2 baris format bukan ancaman kritis." },
          ],
        },
        {
          q: "Mengapa cek_rentang di lab membolehkan nilai None?",
          options: [
            { text: "Satu baris kotor = satu expectation yang gagal — None sudah ditangkap cek_tidak_null", why: "Benar: menghukum dua kali menambah noise; expectation saling melengkapi, bukan saling menuduh.", correct: true },
            { text: "Karena None dianggap dalam range 6–60", why: "Salah: None bukan angka dan tidak “dalam range”; ia dikecualikan dengan sengaja, bukan karena lolos." },
            { text: "Karena Python tidak bisa membandingkan None", why: "Salah: justru karena bisa error itulah perlu diputuskan secara eksplisit — keputusan desain, bukan keterbatasan bahasa." },
            { text: "Agar skor tidak terlalu rendah", why: "Salah: memanipulasi desain demi skor bagus = mengkhianati tujuan validasi." },
          ],
        },
        {
          q: "Apa peran SQL profiling SEBELUM menulis expectation?",
          options: [
            { text: "Memberi gambaran realitas data (distribusi NULL, duplikat, range aktual) agar expectation realistis", why: "Benar: kontrak ditulis setelah melihat barangnya — profiling = melihat barangnya.", correct: true },
            { text: "Menggantikan expectation — profiling cukup", why: "Salah: profiling adalah potret sesaat; expectation adalah penjaga yang berjaga tiap batch." },
            { text: "Mempercepat query ETL", why: "Salah: profiling tidak mengubah pipeline; ia menginformasikan desain validasi." },
            { text: "Tidak perlu — expectation bisa ditebak dari nama kolom", why: "Salah: menebak dari nama kolom = menulis kontrak buta; inilah sumber expectation yang gagal 100%." },
          ],
        },
      ],
    },
  ],
};
