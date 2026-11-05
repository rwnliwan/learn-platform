import type { V2Lesson } from "../lib/types";

// ── Figure: RTO aktual vs target + frekuensi drill ──────────────────────────
const DR_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Diagram batang RTO aktual vs target pada drill, dan tren waktu pemulihan">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="46" y="209">0</text><text x="46" y="169">1 jam</text><text x="46" y="129">2 jam</text>
<text x="46" y="89">3 jam</text><text x="46" y="49">4 jam</text>
</g>
<g>
<rect x="100" y="66" width="52" height="140" fill="var(--chart-text)" opacity="0.5"/>
<text x="126" y="58" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">3,5j</text>
<text x="126" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Drill 1</text>
<rect x="196" y="106" width="52" height="100" fill="var(--chart-text)" opacity="0.5"/>
<text x="222" y="98" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">2,5j</text>
<text x="222" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Drill 2</text>
<rect x="292" y="146" width="52" height="60" fill="var(--c1)" opacity="0.9"/>
<text x="318" y="138" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">1,5j</text>
<text x="318" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Drill 3</text>
<rect x="388" y="166" width="52" height="40" fill="var(--c1)" opacity="0.9"/>
<text x="414" y="158" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">1j</text>
<text x="414" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Drill 4</text>
</g>
<line x1="52" y1="166" x2="528" y2="166" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="524" y="158" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">target RTO 1 jam</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="52" y="30">waktu pemulihan per drill (abu = gagal target, biru = lolos) — ilustrasi</text>
<text x="52" y="244">temuan drill 1: kredensial vault kedaluwarsa · runbook langkah 7 ambigu · DNS failover manual</text>
</g>
</svg>`;

export const dba16: V2Lesson = {
  slug: "dba16-dr-drill",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DR Drill & Runbook: Latihan Bencana Sebelum Bencana",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Backup ada, restore gagal — saat paling dibutuhkan",
      prose: [
        "Sabtu jam 2 pagi, storage array database core banking rusak. DBA shift malam tenang-tenang saja: backup harian ada, replikasi standby ada. Ia mulai prosedur failover — dan dinding pertama muncul: kredensial vault untuk akses backup ternyata kedaluwarsa minggu lalu. Setelah diakali, restore berjalan — lalu dinding kedua: runbook failover langkah ke-7 berbunyi “alihkan traffic ke standby” tanpa menjelaskan CARANYA (penulisnya sudah resign). Dinding ketiga: DNS failover ternyata masih manual dan yang tahu caranya sedang di pesawat. Database kembali online 7 jam kemudian — target RTO-nya 1 jam. Twist-nya: tidak ada yang salah dengan backup-nya. Backup-nya sempurna. Yang gagal adalah semua hal DI SEKITAR backup: kredensial, dokumentasi, dan manusia yang tidak pernah latihan. Bencana yang sebenarnya bukan storage rusak — melainkan keyakinan “kita siap” yang tidak pernah diuji.",
        "Solusinya adalah DR drill: latihan pemulihan bencana yang dijalankan BERKALA — bukan saat bencana. Bentuknya bertingkat: tabletop (diskusi skenario), failover test (pindah ke standby sungguhan), sampai chaos drill (matikan komponen acak). Setiap drill menguji runbook — dokumen langkah-demi-langkah pemulihan — dan setiap temuan (kredensial kedaluwarsa, langkah ambigu) diperbaiki sebelum bencana asli datang.",
        "Di lesson ini kamu belajar merancang drill, menulis runbook yang bisa dijalankan orang lain, dan mengukur kesiapan dengan RTO/RPO aktual — bukan asumsi.",
      ],
      tasks: [],
      note: {
        title: "Kenapa drill adalah satu-satunya bukti kesiapan",
        type: "risk",
        body: "Rencana DR yang belum pernah diuji adalah fiksi — dokumen yang membuat manajemen tenang tanpa dasar. Satu-satunya bukti “kita bisa pulih dalam 1 jam” adalah pernah pulih dalam 1 jam saat latihan. Regulator perbankan (termasuk ekspektasi pengujian restore berkala) memahami ini: yang dinilai bukan dokumennya, melainkan buktinya.",
      },
      reference: "Backup tanpa drill = harapan. Drill = bukti. Runbook = naskah yang sudah dimainkan, bukan sekadar ditulis.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) membedakan tingkatan drill (tabletop, failover test, chaos) dan memilih frekuensinya; (2) menulis runbook yang bisa dijalankan DBA lain tanpa menelepon penulisnya; (3) mengukur RTO/RPO aktual dari drill dan membandingkannya dengan target; (4) mengelola temuan drill sampai tuntas (bukan sekadar dicatat).",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (tingkatan drill; runbook yang hidup) → lab Python (simulator drill + skor kesiapan) → chart tren RTO per drill → peta keputusan → mini-case failover → kuis → rangkuman. Estimasi 55 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari backup, RPO & RTO: RPO (Recovery Point Objective) = seberapa banyak data boleh hilang (mis. maksimal 15 menit transaksi); RTO (Recovery Time Objective) = seberapa lama boleh down (mis. maksimal 1 jam). Backup menentukan RPO yang MUNGKIN; drill membuktikan RTO yang NYATA. Dari replikasi & HA: standby/async-sync menentukan seberapa cepat failover — tetapi failover otomatis yang tidak pernah diuji bisa gagal diam-diam (split-brain, lag replikasi tak terpantau). Drill adalah tempat kegagalan diam-diam itu ditemukan.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: bedakan RTO target vs RTO aktual. Target = janji di dokumen. Aktual = hasil drill terakhir. Selisih keduanya adalah utang kesiapan — dan utang ini menagih dengan bunga saat bencana.",
      ],
      reference: "Bekal: (1) RPO = data boleh hilang; RTO = lama boleh down; (2) replikasi tanpa uji = kegagalan yang menunggu.",
    },
    {
      id: "konsep-tingkatan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tingkatan Drill — Si Simulasi Berlapis",
      prose: [
        "Definisi: DR drill bertingkat berdasar realisme dan risiko. Level 1 — Tabletop: diskusi skenario di ruang rapat (“storage rusak jam 2 pagi, apa yang kamu lakukan?”); murah, tanpa risiko, menemukan lubang logika. Level 2 — Failover test: benar-benar pindahkan traffic ke standby/restore dari backup di environment terisolasi; menguji runbook langkah per langkah. Level 3 — Chaos drill: matikan komponen acak di produksi (dengan pengaman) untuk menguji deteksi dan respons nyata. Level 4 — Full DR test: simulasi kehilangan satu site/datacenter penuh.",
        "Kepribadiannya: seperti latihan militer — tidak ada pasukan yang langsung diterjunkan ke perang tanpa gladi. Tabletop = latihan di atas peta (murah, menemukan kebodohan strategi). Failover test = latihan tembak dengan peluru hampa (prosedur diuji, risiko kecil). Chaos = latihan tempur mendadak (menguji refleks, bukan hafalan). Full DR = perang-perangan antar batalion (mahal, jarang, tetapi satu-satunya yang menguji semuanya). Pasukan yang hanya “membaca manual perang” tanpa gladi adalah pasukan kertas.",
        "Kapan memakai: tabletop tiap kuartal (murah, wajib); failover test tiap semester untuk sistem kritis; chaos drill bila sudah punya observability matang (tanpa monitoring yang baik, chaos = bunuh diri); full DR tahunan untuk core banking/sistem kritis. Aturan: frekuensi drill mengikuti KRITIKALITAS sistem × KERAPUHAN yang ditemukan drill terakhir — temuan banyak = drill lebih sering sampai sembuh.",
      ],
      formula: String.raw`\text{skor kesiapan} = \frac{\text{RTO target}}{\text{RTO aktual drill}} \times (1 - \text{temuan kritis})`,
      formulaNote: "RTO target/RTO aktual = seberapa dekat janji dengan kenyataan (1,0 = tepat janji; 0,3 = janji 1 jam, nyatanya 3+ jam). Faktor (1 − temuan kritis) menghukum drill yang “lolos waktu tetapi menemukan bom” — mis. 2 temuan kritis dari 10 cek = 0,8. Contoh: target 1 jam, aktual 2,5 jam, 1 temuan kritis dari 10 → (1/2,5) × 0,9 = 0,36. Interpretasi: kesiapan 36% — jauh dari siap, walau dokumennya bilang siap.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Kita sudah punya standby otomatis, jadi tidak perlu drill”",
        type: "pitfall",
        body: "Yang benar: otomatisasi yang tidak diuji adalah otomatisasi yang dipercaya buta. Failover otomatis bisa gagal karena: lag replikasi tak terpantau, kredensial expired, skrip failover tidak kompatibel dengan versi baru, atau split-brain. Drill justru PALING penting untuk yang “otomatis” — karena kegagalannya diam dan total.",
      },
      hints: [
        "💡 Intuisi: drill yang “sukses tanpa temuan” adalah drill yang gagal — ia tidak menguji cukup keras. Targetkan tiap drill menemukan minimal 1 temuan berarti; drill tanpa temuan = skenarionya terlalu jinak.",
      ],
      reference: "Tabletop kuartalan → failover semesteran → chaos (bila observability matang) → full DR tahunan.",
    },
    {
      id: "konsep-runbook",
      eyebrow: "Langkah 4 · Konsep",
      title: "Runbook — Si Naskah yang Bisa Dimainkan Orang Lain",
      prose: [
        "Definisi: runbook adalah dokumen langkah-demi-langkah untuk skenario operasional spesifik (failover, restore, rollback) — ditulis agar bisa dijalankan oleh engineer yang BUKAN penulisnya, di jam 2 pagi, dalam keadaan panik. Ciri runbook yang hidup: (1) perintah yang bisa disalin-tempel (bukan “alihkan traffic” melainkan perintah persisnya); (2) ekspektasi tiap langkah (“output yang benar terlihat seperti ini; bila tidak, ke langkah darurat X”); (3) kontak eskalasi + kriteria eskalasi; (4) versi & tanggal uji terakhir.",
        "Kepribadiannya: runbook seperti resep masakan untuk koki pengganti yang tidak pernah ke dapur ini — “tumis bawang 3 menit sampai harum” berguna; “tumis secukupnya” tidak. Runbook yang mati berkata “alihkan traffic ke standby”; runbook yang hidup berkata “jalankan `failover.sh --target standby-2`, tunggu output `PROMOTED`, verifikasi dengan `check_lag.sh` (lag < 5 detik), bila gagal > 10 menit → telepon Nita (0812-xxx) dan lanjut ke lampiran B”. Bedanya: yang satu mengandalkan ingatan penulisnya, yang lain mengandalkan tulisannya.",
        "Kapan memakai: setiap skenario pemulihan dan operasional kritis — failover, restore backup, rollback deploy, rotasi kredensial darurat. Kapan runbook kedaluwarsa: setiap perubahan arsitektur (versi baru, komponen baru) WAJIB memicu review runbook — runbook yang tidak di-review setelah perubahan = fiksi. Aturan: tanggal uji terakhir tidak boleh lebih tua dari drill terakhir.",
      ],
      formula: String.raw`\text{kualitas runbook} = \frac{\text{langkah berhasil tanpa telepon penulis}}{\text{total langkah}}`,
      formulaNote: "Uji praktis: minta engineer lain menjalankan runbook di drill tanpa menghubungi penulisnya. Tiap langkah yang memaksa telepon = langkah yang gagal. Contoh: 14 dari 18 langkah jalan mandiri → kualitas 78%. Interpretasi: di bawah 90%, runbook-mu adalah catatan pribadi, bukan dokumen operasional.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Runbook cukup ditulis sekali, lalu disimpan”",
        type: "pitfall",
        body: "Yang benar: runbook adalah kode yang tidak dieksekusi mesin — ia membusuk secepat arsitektur berubah. Runbook failover yang ditulis sebelum migrasi versi database adalah fiksi yang berbahaya: ia memberi rasa aman palsu. Setiap drill harus menghasilkan revisi runbook, atau drill-nya tidak cukup jujur.",
      },
      hints: [
        "💡 Intuisi: tulis runbook dengan asumsi pembacanya adalah kamu 6 bulan dari sekarang yang sudah lupa segalanya — karena memang begitu. “Kamu masa depan” adalah orang asing yang butuh perintah persis.",
      ],
      reference: "Runbook hidup = perintah salin-tempel + ekspektasi output + eskalasi + tanggal uji. Review tiap perubahan arsitektur.",
    },
    {
      id: "lab-drill",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Simulator drill & skor kesiapan",
      prose: [
        "Waktunya jadi komandan drill-nya. Di bawah ada hasil 4 drill (sintetis): RTO aktual vs target, dan temuan. Tugasmu: tulis fungsi `skor()` (rumus di Langkah 3), hitung skor tiap drill, tentukan status (SIAP bila skor ≥ 0,8), dan daftarkan temuan kritis yang belum ditutup dari drill terakhir.",
        "Coba: setelah lolos, ubah temuan drill 4 menjadi 0 dan lihat statusnya. Lalu tanya: drill 4 “sempurna” — apakah frekuensi drill boleh dikurangi? (Petunjuk: baca lagi intuisi di Langkah 3.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `skor(rto_target, rto_aktual, kritis, total_cek)`: (target/aktual) * (1 - kritis/total_cek)" },
        { id: "t2", text: "Hitung `skor_drill` = dict nama → skor, dibulatkan 2 desimal" },
        { id: "t3", text: "Kumpulkan `siap` = drill dengan skor ≥ 0,8" },
        { id: "t4", text: "Kumpulkan `bom` = temuan kritis drill terakhir yang statusnya 'terbuka'" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "skor: {'drill1': 0.23, 'drill2': 0.36, 'drill3': 0.6, 'drill4': 0.9}\nsiap: ['drill4']\nbom terbuka: ['DNS failover masih manual']",
      code: {
        starter: `# Hasil drill (SINTETIS — meniru tren perbaikan)
drills = [
    {"nama": "drill1", "target": 1.0, "aktual": 3.5, "kritis": 2, "cek": 10,
     "temuan": [("kredensial vault kedaluwarsa", "ditutup"), ("runbook langkah 7 ambigu", "ditutup")]},
    {"nama": "drill2", "target": 1.0, "aktual": 2.5, "kritis": 1, "cek": 10,
     "temuan": [("lag replikasi tak terpantau", "ditutup")]},
    {"nama": "drill3", "target": 1.0, "aktual": 1.5, "kritis": 1, "cek": 10,
     "temuan": [("skrip failover versi lama", "ditutup")]},
    {"nama": "drill4", "target": 1.0, "aktual": 1.0, "kritis": 1, "cek": 10,
     "temuan": [("DNS failover masih manual", "terbuka")]},
]

# TULIS KODEMU DI BAWAH INI
def skor(rto_target, rto_aktual, kritis, total_cek):
    return

skor_drill = {}  # TODO: {d["nama"]: round(skor(...), 2) for d in drills}

siap = []  # TODO: drill dengan skor >= 0.8

bom = []  # TODO: temuan kritis drill terakhir yang masih terbuka

print(f"skor: {skor_drill}")
print(f"siap: {siap}")
print(f"bom terbuka: {bom}")`,
        lockLines: 13,
        solution: `# Hasil drill (SINTETIS — meniru tren perbaikan)
drills = [
    {"nama": "drill1", "target": 1.0, "aktual": 3.5, "kritis": 2, "cek": 10,
     "temuan": [("kredensial vault kedaluwarsa", "ditutup"), ("runbook langkah 7 ambigu", "ditutup")]},
    {"nama": "drill2", "target": 1.0, "aktual": 2.5, "kritis": 1, "cek": 10,
     "temuan": [("lag replikasi tak terpantau", "ditutup")]},
    {"nama": "drill3", "target": 1.0, "aktual": 1.5, "kritis": 1, "cek": 10,
     "temuan": [("skrip failover versi lama", "ditutup")]},
    {"nama": "drill4", "target": 1.0, "aktual": 1.0, "kritis": 1, "cek": 10,
     "temuan": [("DNS failover masih manual", "terbuka")]},
]

# TULIS KODEMU DI BAWAH INI
def skor(rto_target, rto_aktual, kritis, total_cek):
    return (rto_target / rto_aktual) * (1 - kritis / total_cek)

skor_drill = {d["nama"]: round(skor(d["target"], d["aktual"], d["kritis"], d["cek"]), 2) for d in drills}

siap = [nama for nama, s in skor_drill.items() if s >= 0.8]

bom = [t for t, st in drills[-1]["temuan"] if st == "terbuka"]

print(f"skor: {skor_drill}")
print(f"siap: {siap}")
print(f"bom terbuka: {bom}")`,
        checks: [
          { kind: "equal", task: "t2", name: "skor_drill", value: {"drill1": 0.23, "drill2": 0.36, "drill3": 0.6, "drill4": 0.9}, tol: 0, label: "Skor keempat drill tepat", msg: "drill1: (1/3.5)×0.8=0.23; drill4: (1/1)×0.9=0.9." },
          { kind: "equal", task: "t3", name: "siap", value: ["drill4"], tol: 0, label: "`siap` = ['drill4']", msg: "Hanya drill4 yang skornya ≥ 0,8." },
          { kind: "equal", task: "t4", name: "bom", value: ["DNS failover masih manual"], tol: 0, label: "Bom terbuka terdeteksi", msg: "Satu temuan kritis drill4 masih terbuka." },
          { kind: "stdout_matches", task: "t5", pattern: "siap: \\['drill4'\\]", label: "Daftar siap tercetak", msg: "Baris kedua: \"siap: ['drill4']\"." },
        ],
      },
      reference: "Skor kesiapan = janji vs kenyataan × (1 − temuan kritis). Temuan terbuka = bom waktu.",
    },
    {
      id: "chart-rto",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart tren RTO per drill",
      prose: [
        "Chart di bawah memplot waktu pemulihan aktual dari 4 drill berurutan, dengan garis target RTO 1 jam (ilustrasi).",
        "Cara membaca: sumbu Y = jam; tiap batang = RTO aktual satu drill (drill 1 → 4). Batang abu = gagal target; batang biru = lolos target. Garis putus-putus = target RTO 1 jam. Catatan bawah = temuan drill 1.",
        "Interpretasi: trennya membaik — 3,5 → 2,5 → 1,5 → 1,0 jam — karena tiap drill menemukan dan menutup temuan (kredensial, runbook ambigu, lag tak terpantau). Inilah nilai drill yang sesungguhnya: bukan “lulus”, melainkan perbaikan berulang. Tetapi perhatikan drill 4: RTO-nya tepat 1 jam (lolos) NAMUN masih ada 1 temuan kritis terbuka (DNS manual) — skor kesiapannya 0,9, bukan 1,0. Pelajaran chart ini: tren membaik + temuan terbuka = belum selesai. “Lolos RTO” tanpa menutup temuan adalah kemenangan semu.",
      ],
      figure: {
        svg: DR_SVG,
        alt: "Diagram batang: RTO drill 1–4 = 3,5 / 2,5 / 1,5 / 1,0 jam; target 1 jam; drill 4 lolos tetapi 1 temuan terbuka.",
        caption: "Tren RTO aktual per drill vs target 1 jam (ilustrasi). Drill 4 lolos waktu, 1 temuan kritis masih terbuka.",
      },
      tasks: [],
      reference: "Ukur tren, bukan satu titik. Lolos RTO + temuan terbuka = kemenangan semu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Merancang program drill — keputusan apa?",
      prose: [
        "Empat skenario keputusan DR drill:",
        "Skenario 1 — Sistem kritis (core banking) belum pernah drill. → Mulai tabletop bulan ini, failover test semester ini. Alasan: utang kesiapan terbesar ada di yang belum pernah diuji — mulai dari yang murah (tabletop) untuk menemukan lubang logika dulu.",
        "Skenario 2 — Drill menemukan kredensial vault kedaluwarsa. → Perbaiki + tambahkan cek kedaluwarsa kredensial ke monitoring + uji lagi bulan depan. Alasan: temuan tanpa tindak lanjut = drill seremonial; temuan harus punya pemilik dan tenggat.",
        "Skenario 3 — Tim mengusulkan chaos drill di produksi. → Boleh bila: observability matang (alert cepat), blast radius dibatasi (satu AZ/komponen), dan tombol abort jelas. Alasan: chaos tanpa pengaman = membuat bencana sungguhan; chaos dengan pengaman = vaksin.",
        "Skenario 4 — Manajemen bertanya “kapan kita bisa bilang siap?”. → Jawab dengan angka: skor kesiapan ≥ 0,8 dua drill berurutan + nol temuan kritis terbuka. Alasan: “siap” adalah status terukur, bukan perasaan — dan statusnya kedaluwarsa tiap ada perubahan arsitektur.",
        "Aturan praktis 10 detik: rancang drill? → (1) mulai tabletop bila belum pernah; (2) tiap drill wajib menghasilkan temuan + pemilik + tenggat; (3) “siap” = skor ≥ 0,8 dua kali + nol bom terbuka; (4) arsitektur berubah → drill ulang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Drill di environment yang “dimaniskan” — data kecil, traffic nol, semua komponen sehat. Drill seperti ini selalu lulus dan tidak mengajarkan apa pun. Drill harus semirip mungkin dengan kondisi bencana nyata: ukuran data produksi (atau replika), failover sungguhan, dan tim yang tidak diberi bocoran skenario.",
      },
      reference: "Drill yang selalu lulus = drill yang terlalu jinak. Temuan + pemilik + tenggat = drill yang jujur.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Failover 7 jam: bedah kegagalan",
      prose: [
        "Skenario (sintetis, untuk latihan — meniru cerita pembuka): storage array rusak jam 02:00. Target RTO 1 jam, RPO 15 menit. Realita: online kembali jam 09:00 (RTO aktual 7 jam). Tiga dinding: (1) kredensial vault kedaluwarsa — 45 menit untuk reset darurat; (2) runbook langkah 7 ambigu (“alihkan traffic”) — 2 jam trial-and-error + menelepon penulis yang sedang di pesawat; (3) DNS failover manual — 1,5 jam menunggu orang yang tepat; sisanya restore + verifikasi.",
        "Pertanyaan analisis: (1) Berapa skor kesiapannya (asumsi 3 temuan kritis dari 10 cek)? (2) Dinding mana yang “murah” dicegah via drill, dan bagaimana? (3) Apa yang harus berubah sebelum drill berikutnya?",
        "Pembahasan: (1) Skor = (1/7) × (1 − 3/10) = 0,143 × 0,7 ≈ 0,10 — kesiapan 10%: dokumen bilang siap, kenyataan bicara lain. (2) Ketiganya murah dicegah: kredensial → cek kedaluwarsa otomatis di monitoring + rotasi terjadwal (ditemukan oleh tabletop sekalipun: “coba sebutkan kredensial apa saja yang dipakai failover”); runbook ambigu → uji “tanpa telepon penulis” (kualitas runbook < 90% = gagal); DNS manual → otomasi atau minimal runbook langkah persis + drill failover sungguhan. Total biaya pencegahan: beberapa hari kerja. Biaya kegagalan: 6 jam downtime core banking. (3) Sebelum drill berikutnya: tutup ketiga temuan dengan pemilik dan tenggat; revisi runbook; jadwalkan failover test semesteran — dan undang manajemen menyaksikan, agar “butuh anggaran otomasi DNS” menjadi keputusan bisnis, bukan keluhan teknis.",
        "Catatan RPO: data yang hilang hanya 10 menit (dalam target 15 menit) — backup dan replikasinya bekerja. Pelajaran: RPO lolos, RTO jebol — membuktikan backup ≠ pemulihan. Keduanya harus diuji terpisah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "6 jam downtime core banking = 6 jam nasabah tidak bisa transaksi + denda regulator + berita media. Dalam risk register, “DR belum diuji” adalah risiko dengan dampak katastrofik dan biaya mitigasi (drill) yang kecil — rasio terbaik yang bisa diminta seorang risk analyst.",
      },
      reference: "Bedah: skor 0,10 → 3 temuan murah dicegah → tutup + drill ulang. RPO lolos ≠ RTO lolos.",
    },
    {
      id: "pendalaman-restore",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Menguji Restore: Tangga Pengujian & Matematika RPO",
      prose: [
        "Backup yang belum pernah di-restore adalah klaim, bukan aset. Pengujian restore punya tangga dengan empat anak tangga, dan tiap anak tangga menangkap jenis kegagalan yang berbeda. Anak tangga 1 — verifikasi: cek checksum dan integritas file backup (murah, otomatis harian) — menangkap file korup. Anak tangga 2 — restore ke sandbox: pulihkan backup penuh ke instance terisolasi lalu jalankan smoke query — menangkap “backup valid tetapi tidak bisa di-restore” (versi database berbeda, path tablespace berubah, dependensi eksternal hilang). Anak tangga 3 — latihan PITR: pulihkan ke titik waktu spesifik via arsip WAL — menangkap celah arsip (archive_command yang diam-diam gagal berhari-hari). Anak tangga 4 — failover penuh: pindahkan traffic sungguhan. Kebanyakan organisasi berhenti di anak tangga 1, lalu menemukan kegagalan anak tangga 3 saat bencana — yaitu saat paling mahal untuk belajar.",
        "RPO bukan angka di dokumen — ia pertidaksamaan yang harus diukur. Rumusnya ada di bawah: RPO tercapai bila interval backup + lag arsip WAL tidak melebihi target — DENGAN SYARAT PITR sudah teruji (anak tangga 3). Contoh: backup penuh harian jam 02:00 + arsip WAL tiap 5 menit + PITR teruji = kehilangan data terburuk sekitar 5 menit. Tetapi bila PITR belum pernah diuji, arsip WAL tidak boleh dihitung — RPO efektifmu 24 jam, bukan 5 menit. Kegagalan nyata: sebuah organisasi menjanjikan RPO 15 menit; drill menemukan archive_command gagal diam-diam selama 3 hari — RPO aktual 3 hari. Pelajarannya: pantau lag arsip WAL seperti kamu memantau lag replikasi — dengan alert, bukan harapan. Pertidaksamaan yang gagal berarti janjimu tidak bisa ditepati; perpendek interval backup atau perbaiki pengiriman WAL dulu, baru berjanji.",
        "Chaos drill (game day) berbeda dari drill checklist: ia menguji DETEKSI dan RESPONS manusia, bukan sekadar prosedur. Rancang dengan hipotesis: “kami yakin promosi standby selesai di bawah 10 menit dengan kehilangan data di bawah 1 menit”. Batasi blast radius: mulai dari non-produksi, lalu satu availability zone; tulis kriteria abort SEBELUM mulai (“abort bila error rate customer-facing di atas 1%”) dan tunjuk observer yang memegang tombol stop. Kegagalan nyata: chaos mematikan primary, standby promosi dengan sempurna — tetapi aplikasi down 40 menit karena connection string hardcode ke IP primary. Drill-nya “sukses” di level database dan gagal total di level sistem. Pelajaran senior: game day harus mencakup lapisan aplikasi — database yang pulih tetapi tidak bisa dihubungi sama dengan database yang mati.",
        "Separuh runbook yang paling sering hilang: failback — kembali ke kondisi normal setelah failover. Setelah bencana, kamu berjalan di atas standby yang kini menjadi primary: mungkin spesifikasinya lebih kecil, patch-nya tertinggal, atau monitoring-nya belum lengkap. Tanpa rencana failback, organisasi berjalan dalam mode “darurat” berminggu-minggu — dan darurat yang lama menjadi normal yang rapuh. Runbook failover yang lengkap memuat: cara membangun ulang replikasi dengan arah terbalik, switchover terencana kembali ke site utama, verifikasi lag nol sebelum switch, dan kriteria “kapan” (jangan failback di jam sibuk). Metrik drill yang matang bukan cuma RTO: tambah MTTD (waktu deteksi — dari insiden mulai sampai alarm bunyi), kehilangan data TERUKUR (bukan asumsi), persentase langkah runbook tanpa menelepon penulis, dan waktu sampai failback selesai.",
        "Terakhir: jadikan drill mesin penghasil anggaran, bukan sekadar latihan teknis. Tiap temuan drill diterjemahkan ke bahasa bisnis: “DNS failover manual = 1,5 jam downtime = potensi kerugian RpX miliar; otomasi butuh RpY juta” — manajemen menyetujui angka, bukan keluhan. Kadens yang masuk akal: tabletop tiap kuartal, failover test tiap semester untuk sistem kritis, chaos drill hanya bila observability sudah matang (tanpa alert yang cepat, chaos sama dengan membuat bencana sungguhan), full DR tahunan untuk core banking. Dan aturan kedaluwarsa: setiap perubahan arsitektur — versi database baru, topologi replikasi berubah, migrasi cloud — me-reset status “siap” menjadi “belum teruji”. Kesiapan adalah status yang kedaluwarsa, bukan gelar yang permanen.",
        "Laporan drill yang baik dibaca manajemen dalam 5 menit dan menghasilkan keputusan. Strukturnya: (1) skor kesiapan + tren 4 drill terakhir — satu angka, satu grafik; (2) RTO/RPO aktual vs target — lolos atau jebol, tanpa basa-basi; (3) temuan drill ini: tiap temuan punya pemilik, tenggat, dan estimasi biaya perbaikan; (4) bom yang masih terbuka dari drill sebelumnya — dengan umur temuan (temuan 90 hari yang belum ditutup adalah kegagalan manajemen, bukan kegagalan teknis). Lampirkan satu anekdot konkret (“kredensial vault kedaluwarsa — 45 menit hilang”) karena manusia mengingat cerita, bukan tabel. Tutup dengan permintaan keputusan eksplisit: anggaran otomasi DNS, persetujuan jadwal failover test berikutnya, atau penerimaan risiko tertulis bila temuan tidak diperbaiki. Drill tanpa keputusan tindak lanjut adalah teater; laporan tanpa permintaan keputusan adalah arsip.",
      ],
      formula: String.raw`\text{RPO tercapai} \iff \text{interval\_backup} + \text{lag\_arsip} \leq \text{RPO target} \quad \text{(syarat: PITR teruji)}`,
      formulaNote: "interval_backup = jeda antar backup penuh (mis. 24 jam); lag_arsip = keterlambatan pengiriman WAL dalam menit (ukur dari status archive, bukan asumsi). Contoh: target RPO 15 menit; backup harian + WAL tiap 5 menit + PITR pernah diuji → 5 mnt ≤ 15 mnt: tercapai. Bila PITR belum pernah diuji, arsip WAL tidak boleh masuk hitungan — RPO efektif = 24 jam: tidak tercapai. Interpretasi: RPO adalah pertidaksamaan yang dibaca dari monitoring, bukan angka yang ditulis di dokumen.",
      tasks: [],
      note: {
        title: "Intuisi: backup adalah klaim, restore adalah bukti",
        body: "Ukur throughput restore-mu (GB per menit) — angka inilah input RTO yang sebenarnya, bukan ukuran file backup. Backup 2 TB yang me-restore 50 GB per menit butuh 40 menit; bila target RTO-mu 1 jam, kamu sudah memakai dua pertiganya sebelum aplikasi bicara. Heuristik kedua: aturan 3-2-1 — 3 salinan, 2 media berbeda, 1 di lokasi berbeda; ransomware mengenkripsi backup yang segaris dengan primary. Ketiga: jadwalkan uji restore seperti kamu menjadwalkan backup — “nanti kalau sempat” berarti tidak pernah; yang terjadwal yang terjadi. Keempat: celah arsip WAL adalah pembunuh diam-diam — alert untuk kegagalan archive sama pentingnya dengan alert lag replikasi. Kelima: libatkan tim aplikasi di satu game day per tahun; database yang pulih tetapi tidak bisa dihubungi aplikasi adalah kegagalan yang tidak tercatat di metrik DBA. Keenam: simpan satu salinan runbook di luar sistem yang dilindungi runbook itu — runbook failover yang tersimpan di server yang sedang down adalah lelucon yang mahal. Ketujuh: rayakan temuan, bukan keberhasilan semu — drill yang menemukan tiga bom adalah drill yang bagus; drill yang “sempurna” patut dicurigai skenarionya.",
      },
      reference: "Tangga restore: verifikasi → sandbox → PITR → failover. RPO = pertidaksamaan terukur. Failback direncanakan. Drill = mesin anggaran.",
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
        "DR drill bertingkat: tabletop (kuartalan) → failover test (semesteran) → chaos (bila observability matang) → full DR (tahunan).",
        "Backup tanpa drill = harapan; satu-satunya bukti kesiapan adalah pernah pulih saat latihan.",
        "Runbook hidup: perintah salin-tempel + ekspektasi output + eskalasi + tanggal uji; lolos uji “tanpa telepon penulis” ≥ 90%.",
        "Skor kesiapan = (RTO target / RTO aktual) × (1 − temuan kritis); “siap” = ≥ 0,8 dua drill + nol bom terbuka.",
        "Tiap drill wajib menghasilkan temuan + pemilik + tenggat; arsitektur berubah → drill ulang.",
      ],
      quiz: [
        {
          q: "Apa bukti terbaik bahwa organisasi siap menghadapi bencana database?",
          options: [
            { text: "Pernah memulihkan dalam target RTO saat drill, dengan temuan ditutup", why: "Benar: bukti = pernah dilakukan, bukan pernah ditulis. Drill + temuan tertutup = kesiapan terukur.", correct: true },
            { text: "Dokumen rencana DR yang tebal dan disetujui direksi", why: "Salah: dokumen tanpa uji adalah fiksi — cerita pembuka membuktikan dokumennya ada tetapi pemulihan 7 jam." },
            { text: "Backup harian yang selalu sukses", why: "Salah: backup sukses ≠ restore sukses ≠ failover sukses. RPO lolos, RTO jebol — itu mungkin.", },
            { text: "Standby otomatis yang terpasang", why: "Salah: otomatisasi yang tidak diuji bisa gagal diam-diam. Justru yang otomatis paling butuh drill." },
          ],
        },
        {
          q: "Drill “sukses” tanpa satu pun temuan. Interpretasi yang tepat?",
          options: [
            { text: "Skenarionya terlalu jinak — drill yang baik selalu menemukan sesuatu", why: "Benar: sistem kompleks selalu punya lubang; nol temuan berarti drill tidak menguji cukup keras.", correct: true },
            { text: "Sistem sudah sempurna, kurangi frekuensi drill", why: "Salah: “sempurna” dari satu drill jinak adalah kesimpulan berbahaya — kurangi drill = buta lebih lama." },
            { text: "Tim sudah hebat, tidak perlu drill lagi", why: "Salah: kesiapan kedaluwarsa tiap ada perubahan arsitektur/personel. Tidak ada yang “selesai” di DR." },
            { text: "Naikkan target RTO agar lebih menantang", why: "Salah: menaikkan target tanpa memperbaiki skenario = mengukur dengan penggaris yang salah." },
          ],
        },
        {
          q: "Runbook failover berisi “alihkan traffic ke standby”. Masalahnya?",
          options: [
            { text: "Tidak bisa dijalankan orang lain — tidak ada perintah persis, ekspektasi output, dan eskalasi", why: "Benar: ini runbook mati — mengandalkan ingatan penulisnya. Di jam 2 pagi, ia tidak berguna.", correct: true },
            { text: "Terlalu panjang", why: "Salah: masalahnya bukan panjang — melainkan tidak adanya detail yang bisa dieksekusi." },
            { text: "Harusnya dalam bahasa Inggris", why: "Salah: bahasa bukan masalahnya; presisi perintah yang masalah." },
            { text: "Tidak masalah — engineer pasti paham", why: "Salah: “pasti paham” adalah asumsi yang runtuh saat penulisnya resign atau di pesawat." },
          ],
        },
        {
          q: "Skor kesiapan = 0,9 tetapi ada 1 temuan kritis terbuka. Status?",
          options: [
            { text: "Belum siap — temuan kritis terbuka = bom waktu; “siap” butuh nol bom terbuka", why: "Benar: skor tinggi dengan bom terbuka adalah kemenangan semu — seperti drill 4 di lab.", correct: true },
            { text: "Siap — skor di atas 0,8 sudah cukup", why: "Salah: ambang 0,8 adalah syarat perlu, bukan cukup. Bom terbuka membatalkan status siap." },
            { text: "Siap bersyarat — umumkan ke manajemen", why: "Salah: “siap bersyarat” adalah bahasa halus untuk “belum siap”. Umumkan apa adanya: belum siap." },
            { text: "Ulangi drill sampai skor 1,0", why: "Salah: mengulang drill tanpa menutup temuan = mengulang kegagalan. Tutup temuan dulu, baru drill ulang." },
          ],
        },
        {
          q: "Kapan frekuensi drill harus DITAMBAH?",
          options: [
            { text: "Setelah drill menemukan banyak temuan / setelah perubahan arsitektur besar", why: "Benar: temuan banyak = kerapuhan tinggi = butuh verifikasi lebih sering sampai sembuh; arsitektur baru = asumsi lama kedaluwarsa.", correct: true },
            { text: "Setelah drill sukses tanpa temuan", why: "Salah: itu sinyal skenario terlalu jinak — yang ditambah adalah KEKERASAN skenario, bukan frekuensi." },
            { text: "Ketika tim sibuk agar tetap waspada", why: "Salah: drill saat tim kelelahan menghasilkan drill seremonial — waktu yang salah merusak kualitas." },
            { text: "Tidak pernah — jadwal tahunan sudah cukup", why: "Salah: frekuensi tetap tanpa melihat temuan = mengabaikan data. Jadwal mengikuti risiko, bukan kalender buta." },
          ],
        },
        {
          q: "Target RPO 15 menit. Backup penuh harian, arsip WAL tiap 5 menit, tetapi PITR belum pernah diuji. RPO yang boleh dijanjikan ke manajemen?",
          options: [
            { text: "24 jam — arsip WAL yang belum teruji tidak boleh dihitung; yang terbukti hanya backup harian", why: "Benar: janji RPO = yang terbukti, bukan yang teoritis. PITR yang belum diuji berarti WAL dianggap tidak ada.", correct: true },
            { text: "5 menit — arsip WAL tiap 5 menit sudah cukup", why: "Salah: arsip ada tidak sama dengan arsip bisa dipakai. Tanpa uji PITR, itu asumsi — dan asumsi bukan bukti." },
            { text: "15 menit — sesuai target di dokumen", why: "Salah: target bukan realisasi; dokumen tidak memulihkan data." },
            { text: "0 — standby selalu sinkron sehingga tidak ada data hilang", why: "Salah: standby melindungi dari kegagalan site, bukan dari data korup atau kesalahan logis yang ikut terreplikasi; RPO tetap butuh backup + PITR." },
          ],
        },
        {
          q: "Game day: primary dimatikan, standby promosi sempurna dalam 8 menit, tetapi aplikasi down 40 menit karena connection string hardcode ke IP primary. Pelajaran utamanya?",
          options: [
            { text: "Drill harus mencakup lapisan aplikasi — database pulih tetapi tak terjangkau berarti sistem tetap down", why: "Benar: RTO diukur dari sisi pengguna, bukan dari sisi database. Manajemen koneksi aplikasi adalah bagian dari rencana DR.", correct: true },
            { text: "Promosi standby 8 menit terlalu lambat", why: "Salah: 8 menit untuk promosi adalah hasil yang bagus; masalahnya bukan di database." },
            { text: "Game day tidak berguna — kembali ke drill checklist", why: "Salah: justru game day yang menemukan lubang ini; drill checklist tidak akan pernah menguji connection string aplikasi." },
            { text: "Tambah satu standby lagi", why: "Salah: standby ketiga tidak memperbaiki connection string yang hardcode; menambah infrastruktur tanpa memperbaiki desain." },
          ],
        },
      ],
    },
  ],
};
