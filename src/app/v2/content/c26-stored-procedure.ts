import type { V2Lesson } from "../lib/types";

// ── Figure: roundtrip app-loop vs procedure ────────────────────────────────
const RT_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang roundtrip: loop aplikasi 50000 kali vs procedure 1 kali">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="166" x2="500" y2="166"/><line x1="60" y1="116" x2="500" y2="116"/>
<line x1="60" y1="66" x2="500" y2="66"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="169">12.500</text>
<text x="54" y="119">25.000</text><text x="54" y="69">37.500</text>
<text x="54" y="49">50.000×</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="130" y="30" width="80" height="186" fill="var(--c4)" opacity="0.9"/>
<text x="170" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">50.000</text>
<text x="170" y="232" text-anchor="middle" fill="var(--text)">loop di aplikasi</text>
<text x="170" y="246" text-anchor="middle" fill="var(--text-muted)">3 jam</text>
<rect x="330" y="214" width="80" height="2" fill="var(--c1)" opacity="0.9"/>
<text x="370" y="206" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">1</text>
<text x="370" y="232" text-anchor="middle" fill="var(--text)">stored procedure</text>
<text x="370" y="246" text-anchor="middle" fill="var(--text-muted)">40 detik</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">perjalanan bolak-balik app ↔ database untuk 50.000 baris (ilustrasi)</text>
</g>
</svg>`;

export const c26: V2Lesson = {
  slug: "c26-stored-procedure",
  track: "SQL",
  module: "Lanjutan",
  title: "Stored Procedure, Function & Trigger",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Database-nya tidak lambat — aplikasinya yang cerewet",
      prose: [
        "Dewi, analis data sebuah bank perkreditan, mewarisi job rekonsiliasi malam hari: Python membaca 50.000 baris mutasi, lalu untuk SETIAP baris menjalankan satu UPDATE ke database. Job itu jalan 3 jam tiap malam — dan semakin malam semakin lambat saat data tumbuh. Tim infrastruktur disalahkan (“database-nya lambat!”), lalu diusulkan naikkan spesifikasi server 4× lipat. Sebelum anggaran cair, seorang senior iseng menulis ulang logika itu sebagai satu stored procedure: 40 detik. Bukan 40 menit — 40 DETIK. Server yang sama, data yang sama, logika yang sama.",
        "Twist-nya: database tidak pernah lambat. Yang lambat adalah 50.000 perjalanan bolak-balik antara aplikasi dan database — tiap perjalanan hanya 200 milidetik, tetapi dikali 50.000 = 2,8 jam murni menunggu jaringan. Seperti menelepon restoran 50.000 kali untuk memesan satu menu tiap telepon, padahal bisa mengirim satu daftar belanja. Lesson ini tentang kapan logika pindah “masuk” ke database — dan kapan ia harus tetap di luar.",
        "Tiga hal yang akan kamu kuasai: (1) beda procedure, function, dan trigger — tiga penghuni database yang sering tertukar; (2) membuat UDF + trigger audit sungguhan (di sqlite, pola 1:1 dengan database produksi); (3) aturan kapan logika boleh tinggal di database — dan kapan ia menjadi “kuburan logika” yang tak ter-debug.",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran tentang lab lesson ini",
        type: "risk",
        body: "Stored procedure ASLI ditulis dalam dialek tiap database (PL/pgSQL di Postgres, T-SQL di SQL Server) — tidak bisa dieksekusi di lab browser. Lab memakai sqlite3 dengan pola 1:1: fungsi Python yang didaftarkan via create_function adalah ANALOG UDF (logika yang hidup di dalam database dan dipanggil dari SQL); trigger AFTER UPDATE di sqlite adalah trigger SUNGGUHAN dengan sintaks standar yang sama persis di Postgres/MySQL. Di laptop: psql + CREATE FUNCTION ... LANGUAGE plpgsql mengikuti pola yang sama.",
      },
      reference: "3 jam → 40 detik: bukan database yang lambat, tapi 50.000 roundtrip.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita Dewi dan 50.000 telepon. (2) Peta ini. (3) Konsep: procedure vs function — Si Koki Dapur vs Si Kalkulator. (4) Konsep: trigger — Si CCTV yang tidak pernah tidur. (5) Konsep: kuburan logika — kapan TIDAK menaruh logika di database + peta dialek. (6) Lab 1: daftarkan UDF bunga(). (7) Lab 2: trigger audit saldo. (8) Chart: 50.000 vs 1 roundtrip. (9) Peta keputusan: di dalam atau di luar database. (10) Mini-case: rekonsiliasi 3 jam → 40 detik. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan beda procedure, function, trigger dengan contoh yang tepat; (2) membuat function dan trigger di sqlite/Postgres; (3) menghitung penghematan roundtrip sebuah procedure; (4) memutuskan kapan logika boleh tinggal di database vs harus di aplikasi.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: SQL dasar (CREATE TABLE, INSERT, UPDATE, SELECT); Python dasar (def fungsi); konsep parameterized query (lesson D22). Tidak perlu akses database produksi.",
        "Rutenya: cerita → peta → tiga konsep inti → dua lab → chart roundtrip → peta keputusan → mini-case → kuis. Estimasi 65 menit; dua lab ±18 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap database sebagai restoran. Query biasa = kamu menelepon untuk bertanya “menu hari ini apa?” (satu perjalanan). Aplikasi yang loop 50.000 UPDATE = menelepon 50.000 kali untuk memesan satu piring tiap telepon. Stored procedure = mengirim SATU daftar belanja 50.000 piring — dapur (database) yang mengerjakannya di dalam, tanpa bolak-balik.",
      ],
      reference: "Tujuan: procedure vs function vs trigger + UDF & trigger audit + kapan di dalam/di luar DB.",
    },
    {
      id: "konsep-proc-func",
      eyebrow: "Langkah 3 · Konsep",
      title: "Procedure vs Function — Si Koki Dapur vs Si Kalkulator",
      prose: [
        "Definisi: stored procedure adalah PROGRAM yang tersimpan di database — bisa berisi banyak statement (loop, kondisi, transaksi), dipanggil dengan CALL/EXEC, dan tidak harus mengembalikan nilai. Function (UDF) adalah FUNGSI murni — menerima input, mengembalikan SATU nilai, dan bisa dipanggil DI DALAM query SQL (SELECT bunga(saldo, 10) FROM ...). Beda kuncinya: procedure = aksi (lakukan sesuatu), function = hitungan (kembalikan sesuatu).",
        "Kepribadiannya: procedure adalah koki di dapur restoran — kamu memberinya daftar belanja (parameter), ia memasak seluruh hidangan di dalam dapur (transaksi, loop, banyak statement), lalu menyajikan hasilnya; kamu tidak perlu bolak-balik ke dapur. Function adalah kalkulator di kasir — kamu memberinya angka, ia mengembalikan angka, dan kamu bisa memakainya di tengah-tengah perhitungan lain (di dalam SELECT, WHERE, ORDER BY). Dewi yang cerdas: logika “rekonsiliasi 50.000 baris” = pekerjaan koki (procedure); “hitung bunga per baris” = pekerjaan kalkulator (function yang dipanggil di dalam SELECT).",
        "Kapan memakai: procedure untuk pekerjaan BATCH yang menyentuh banyak baris sekaligus (rekonsiliasi malam hari, tutup buku, migrasi data) — menghemat roundtrip. Function untuk logika HITUNG yang dipakai berulang di banyak query (rumus bunga, kategorisasi, parsing) — satu definisi, dipakai di mana-mana. Tiga aturan: (1) procedure/function harus DETERMINISTIK terdokumentasi (input sama → hasil sama) kecuali memang disengaja; (2) beri nama berawalan jelas (usp_ / fn_) agar terlihat di antara tabel; (3) simpan DEFINISINYA di version control (file .sql di Git) — database bukan tempat penyimpanan satu-satunya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Function bisa menggantikan procedure”",
        type: "pitfall",
        body: "Yang benar: function TIDAK boleh (di sebagian besar database) melakukan aksi — tidak bisa COMMIT transaksi, tidak bisa DDL, dan di banyak dialek tidak bisa memodifikasi data. Memaksa logika batch ke dalam function = error atau perilaku aneh. Aturan praktis: butuh aksi/efek samping → procedure; butuh nilai di dalam query → function.",
      },
      hints: [
        "💡 Intuisi pemanggilan: procedure dipanggil BERDIRI SENDIRI (CALL hitung_rekonsiliasi('2026-06-01')); function dipanggil DI DALAM kalimat (SELECT nama, bunga(saldo, 10) FROM nasabah). Kalau “kalimat”-nya tidak butuh nilai kembaliannya, itu pekerjaan procedure.",
      ],
      reference: "Procedure = aksi (CALL), function = hitungan di dalam query. Definisi disimpan di Git, bukan hanya di DB.",
    },
    {
      id: "konsep-trigger",
      eyebrow: "Langkah 4 · Konsep",
      title: "Trigger — Si CCTV yang Tidak Pernah Tidur",
      prose: [
        "Definisi: trigger adalah procedure MINI yang berjalan OTOMATIS saat peristiwa terjadi di tabel — BEFORE/AFTER INSERT, UPDATE, atau DELETE. Ia tidak dipanggil manual; database yang memicunya. Kegunaan klasik: audit trail — setiap perubahan saldo otomatis dicatat (nilai lama, nilai baru, kapan, oleh siapa) ke tabel audit tanpa aplikasi perlu ingat.",
        "Kepribadiannya: trigger adalah CCTV di brankas — tidak pernah tidur, tidak pernah lupa mencatat siapa membuka brankas dan kapan, dan tidak bisa “lupa dinyalakan” oleh aplikasi yang buru-buru. Di dalam trigger tersedia dua “rekaman”: OLD (baris sebelum berubah) dan NEW (baris sesudah berubah). Lab 2 memasang CCTV sungguhan: setiap UPDATE saldo otomatis menulis (lama, baru, waktu) ke tabel audit — aplikasi bahkan tidak tahu ia diawasi.",
        "Kapan memakai: (1) audit trail yang WAJIB lengkap (regulasi, forensik) — trigger tidak bisa di-bypass oleh aplikasi yang lupa; (2) validasi kompleks yang harus berlaku untuk SEMUA penulis (banyak aplikasi menulis ke tabel yang sama); (3) sinkronisasi derivatif sederhana. Tiga aturan CCTV: (1) trigger harus CEPAT dan sederhana — trigger lambat memperlambat SEMUA tulis ke tabel itu; (2) JANGAN trigger memicu trigger lain berantai (rekursi) tanpa pengaman; (3) dokumentasikan — trigger yang tak terdokumentasi adalah “hantu” yang membingungkan debugger 6 bulan kemudian.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Trigger menggantikan validasi aplikasi”",
        type: "pitfall",
        body: "Yang benar: trigger adalah LAPISAN TERAKHIR, bukan satu-satunya. Validasi tetap di aplikasi (pesan error yang ramah, UX yang baik); trigger menjaga INVARIAN yang tidak boleh jebol siapa pun penulisnya. Mengandalkan trigger semata = error database yang samar bagi user; tidak punya trigger untuk data kritis = audit yang bolong saat satu aplikasi lupa mencatat.",
      },
      hints: [
        "💡 Intuisi OLD/NEW: dalam trigger UPDATE, OLD.jumlah = saldo SEBELUM diubah, NEW.jumlah = saldo SESUDAH diubah. Tabel audit menyimpan keduanya — selisihnya adalah “cerita” transaksi itu. Tanpa trigger, cerita ini hanya ada di memori aplikasi yang sudah lupa.",
      ],
      reference: "Trigger = CCTV otomatis (OLD/NEW). Untuk audit wajib & invarian lintas aplikasi. Harus cepat & terdokumentasi.",
    },
    {
      id: "konsep-kuburan",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kuburan Logika — dan peta dialek",
      prose: [
        "Definisi: “kuburan logika” adalah database yang menampung ratusan procedure/trigger tak terdokumentasi, saling memanggil, ditulis 5 orang selama 8 tahun — tempat logika bisnis “dikubur” sehingga tidak ada yang berani menyentuh. Gejalanya: mengubah satu kolom merusak 3 laporan yang tidak dikenal; tidak ada yang tahu procedure X masih dipakai atau tidak; deploy = “jalankan script SQL ini, semoga berhasil”.",
        "Kepribadiannya: database yang sehat adalah restoran dengan dapur terlihat (open kitchen) — kamu tahu siapa memasak apa. Kuburan logika adalah dapur dengan 8 pintu rahasia — makanan keluar, tetapi tidak ada yang tahu dari pintu mana, dan suatu hari pintu-pintu itu mulai bertengkar. Dewi yang bijak: ia memindahkan SATU job batch yang terukur ke procedure (dengan file .sql di Git + komentar), bukan seluruh aplikasi.",
        "Kapan memakai (aturan “di dalam atau di luar”): TARUH DI DATABASE bila (1) batch multi-baris yang hemat roundtrip (rumus di bawah); (2) invarian yang harus berlaku untuk semua penulis; (3) audit yang wajib lengkap. TARUH DI APLIKASI bila (1) logika butuh library/ekosistem (ML, HTTP, parsing kompleks); (2) butuh unit test & CI yang matang; (3) tim lebih nyaman debug di aplikasi. Peta dialek (konseptual — sintaks detail per database): Postgres = PL/pgSQL (CREATE FUNCTION ... LANGUAGE plpgsql); SQL Server = T-SQL (CREATE PROCEDURE ...); MySQL = mirip PL/pgSQL dengan DELIMITER; Oracle = PL/SQL; sqlite = subset (trigger + UDF via create_function, tanpa procedure). Pola pikirnya sama; yang beda hanya aksen bicaranya.",
      ],
      tasks: [],
      formula: String.raw`R = n \times t_{rt}`,
      formulaNote: "R = total waktu roundtrip yang dihemat; n = jumlah operasi baris-per-baris; t_rt = waktu satu perjalanan app↔DB. Contoh Dewi: n = 50.000, t_rt = 0,2 detik → R = 10.000 detik ≈ 2,8 jam — persis selisih 3 jam vs 40 detik. Rumus ini juga cara tercepat meyakinkan manajer: tunjukkan n × t_rt, bukan “database lambat”.",
      note: {
        title: "🚨 Mitos: “Semua logika harus di database agar cepat”",
        type: "pitfall",
        body: "Yang benar: kecepatan hanya SATU sumbu — sumbu lainnya: keterbacaan, testability, dan siapa yang bisa debug jam 2 pagi. Procedure untuk 50.000 UPDATE = menang telak. Procedure untuk “kirim email bila saldo minus” = kalah (butuh SMTP, retry, template — ekosistem aplikasi). Aturan: dekat-data untuk yang hemat roundtrip; dekat-ekosistem untuk yang butuh library.",
      },
      hints: [
        "💡 Intuisi version control: database adalah RUNTIME, bukan REPOSITORY. Setiap CREATE PROCEDURE yang dijalankan manual tanpa file .sql di Git = bom waktu — saat server diganti, tidak ada yang tahu harus me-restore apa. Kebiasaan profesional: file .sql berversi → review → baru deploy ke database.",
      ],
      reference: "Kuburan logika = ratusan procedure tak terdokumentasi. Aturan: hemat-roundtrip/audit → DB; butuh library/test → aplikasi.",
    },
    {
      id: "lab-udf",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Daftarkan UDF bunga() ke sqlite",
      prose: [
        "Waktunya praktik. Kamu akan menjadi “DBA sehari”: (1) tulis fungsi Python hitung_bunga(saldo, persen) yang mengembalikan saldo + bunga; (2) daftarkan ke sqlite via con.create_function(\"bunga\", 2, hitung_bunga) — sejak itu fungsi Python-mu bisa dipanggil DARI DALAM SQL; (3) uji dengan query SELECT bunga(1000000, 10) dan simpan hasilnya ke bunga_1jt. Inilah analog UDF produksi: logika yang hidup di dalam database.",
        "Di Postgres asli, ini setara CREATE FUNCTION bunga(numeric, numeric) RETURNS numeric LANGUAGE plpgsql — beda sintaks, pola pikir sama: daftarkan sekali, pakai di semua query.",
        "Coba: setelah lolos, buat UDF kategori(nominal) yang mengembalikan 'kecil'/'sedang'/'besar' — lalu pakai di SELECT ... GROUP BY kategori(nominal). Itulah “kalkulator di kasir” yang dipakai di tengah kalimat SQL.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `hitung_bunga(saldo, persen)` → saldo + saldo*persen/100" },
        { id: "t2", text: "Daftarkan via `con.create_function(\"bunga\", 2, hitung_bunga)`" },
        { id: "t3", text: "Jalankan `SELECT bunga(1000000, 10)`; simpan ke `bunga_1jt`" },
      ],
      expected: "bunga(1000000, 10) = 1100000.0",
      code: {
        starter: "import sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\n\n# TULIS KODEMU: t1 fungsi Python hitung_bunga(saldo, persen)\ndef hitung_bunga(saldo, persen):\n\n# t2: daftarkan sebagai UDF bernama \"bunga\" (2 argumen)\n\n# t3: panggil dari SQL, simpan hasilnya\nbunga_1jt =\n\nprint(f\"bunga(1000000, 10) = {bunga_1jt}\")\n",
        lockLines: 3,
        solution: "import sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\n\n# TULIS KODEMU: t1 fungsi Python hitung_bunga(saldo, persen)\ndef hitung_bunga(saldo, persen):\n    return saldo + saldo * persen / 100\n\n# t2: daftarkan sebagai UDF bernama \"bunga\" (2 argumen)\ncon.create_function(\"bunga\", 2, hitung_bunga)\n\n# t3: panggil dari SQL, simpan hasilnya\nbunga_1jt = cur.execute(\"SELECT bunga(1000000, 10)\").fetchone()[0]\n\nprint(f\"bunga(1000000, 10) = {bunga_1jt}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "hitung_bunga terdefinisi", msg: "Fungsi Python-nya dulu, sebelum didaftarkan.", name: "hitung_bunga" },
          { kind: "equal", task: "t3", label: "bunga_1jt = 1100000.0", msg: "1000000 + 10% — kalkulator di kasir bekerja.", name: "bunga_1jt", value: 1100000.0, tol: 0.01 },
          { kind: "stdout_matches", task: "t3", label: "hasil tercetak", msg: "Satu angka: hasil UDF dari dalam SQL.", pattern: "1100000" },
        ],
      },
      reference: "create_function = mendaftarkan Python sebagai UDF. Pola sama di Postgres (CREATE FUNCTION).",
    },
    {
      id: "lab-trigger",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Pasang CCTV: trigger audit saldo",
      prose: [
        "Lab kedua memasang CCTV sungguhan. Tabel saldo (2 nasabah) dan tabel audit_saldo kosong sudah tersedia. Tugasmu: (1) buat trigger trg_audit_saldo — AFTER UPDATE ON saldo, setiap UPDATE menyisipkan (id_rek, lama, baru, waktu) ke audit_saldo memakai OLD.jumlah dan NEW.jumlah; (2) jalankan dua UPDATE (tambah 500.000 ke tiap nasabah); (3) baca isi audit_saldo ke audit_rows (list of [lama, baru]) dan pastikan trigger_ada = True (cek sqlite_master). Aplikasi “tidak tahu” ia diawasi — persis sifat trigger produksi.",
        "Di Postgres/MySQL, sintaks CREATE TRIGGER-nya identik secara konsep (BEFORE/AFTER, OLD/NEW) — yang kamu tulis di sini portabel.",
        "Coba: setelah lolos, jalankan UPDATE ketiga lalu baca audit lagi — CCTV tidak pernah tidur. Lalu pikirkan: apa yang terjadi bila trigger ini lambat (mis. mengirim email tiap UPDATE)?",
      ],
      tasks: [
        { id: "t1", text: "Buat trigger `trg_audit_saldo` (AFTER UPDATE): INSERT OLD.jumlah, NEW.jumlah ke audit" },
        { id: "t2", text: "UPDATE kedua nasabah (+500.000 tiap jumlah)" },
        { id: "t3", text: "Baca `audit_rows` (list [lama, baru]) dan cek `trigger_ada` di sqlite_master" },
      ],
      expected: "audit: [[5000000, 5500000], [3000000, 3500000]] | trigger terdaftar: True",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE saldo(id INTEGER PRIMARY KEY, nama TEXT, jumlah INTEGER)\")\ncur.execute(\"CREATE TABLE audit_saldo(id INTEGER PRIMARY KEY AUTOINCREMENT, id_rek INTEGER, lama INTEGER, baru INTEGER, waktu TEXT DEFAULT (datetime('now')))\")\ncur.executemany(\"INSERT INTO saldo VALUES (?,?,?)\", [(1,\"Ayu\",5000000),(2,\"Bimo\",3000000)])\n\n# TULIS KODEMU: t1 trigger AFTER UPDATE yang mencatat OLD.jumlah & NEW.jumlah\n\n# t2: dua UPDATE (+500.000)\n\n# t3: baca audit + cek trigger terdaftar\naudit_rows =\ntrigger_ada =\n\nprint(f\"audit: {audit_rows} | trigger terdaftar: {trigger_ada}\")\n",
        lockLines: 7,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE saldo(id INTEGER PRIMARY KEY, nama TEXT, jumlah INTEGER)\")\ncur.execute(\"CREATE TABLE audit_saldo(id INTEGER PRIMARY KEY AUTOINCREMENT, id_rek INTEGER, lama INTEGER, baru INTEGER, waktu TEXT DEFAULT (datetime('now')))\")\ncur.executemany(\"INSERT INTO saldo VALUES (?,?,?)\", [(1,\"Ayu\",5000000),(2,\"Bimo\",3000000)])\n\n# TULIS KODEMU: t1 trigger AFTER UPDATE yang mencatat OLD.jumlah & NEW.jumlah\ncur.execute(\"CREATE TRIGGER trg_audit_saldo AFTER UPDATE ON saldo BEGIN INSERT INTO audit_saldo(id_rek, lama, baru) VALUES (OLD.id, OLD.jumlah, NEW.jumlah); END\")\n\n# t2: dua UPDATE (+500.000)\ncur.execute(\"UPDATE saldo SET jumlah = jumlah + 500000 WHERE id = 1\")\ncur.execute(\"UPDATE saldo SET jumlah = jumlah + 500000 WHERE id = 2\")\n\n# t3: baca audit + cek trigger terdaftar\naudit_rows = [list(r) for r in cur.execute(\"SELECT lama, baru FROM audit_saldo ORDER BY id\").fetchall()]\ntrigger_ada = cur.execute(\"SELECT COUNT(*) FROM sqlite_master WHERE type='trigger' AND name='trg_audit_saldo'\").fetchone()[0] == 1\n\nprint(f\"audit: {audit_rows} | trigger terdaftar: {trigger_ada}\")\n",
        checks: [
          { kind: "equal", task: "t3", label: "audit mencatat 2 perubahan", msg: "CCTV merekam (5jt→5,5jt) dan (3jt→3,5jt).", name: "audit_rows", value: [[5000000, 5500000], [3000000, 3500000]] },
          { kind: "equal", task: "t3", label: "trigger_ada = True", msg: "Trigger terdaftar di sqlite_master.", name: "trigger_ada", value: true },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Isi audit + status trigger.", pattern: "trigger terdaftar: True" },
        ],
      },
      reference: "Trigger = CCTV otomatis (OLD/NEW). Audit lengkap tanpa aplikasi perlu ingat.",
    },
    {
      id: "chart-rt",
      eyebrow: "Langkah 8 · Chart",
      title: "50.000 vs 1: harga bolak-balik",
      prose: [
        "Chart di bawah memvisualkan rumus Langkah 5 untuk kasus Dewi: 50.000 perjalanan app↔DB (loop aplikasi, 3 jam) vs 1 pemanggilan procedure (40 detik).",
        "Cara membaca: sumbu Y = jumlah perjalanan bolak-balik; tiap batang = satu arsitektur; label bawah = waktu wall-clock-nya.",
        "Interpretasi: batang kiri menjulang 50.000× lipat dari batang kanan — untuk LOGIKA YANG SAMA. Inilah visualisasi “database tidak pernah lambat”: yang lambat adalah arsitektur yang cerewet. Pelajaran chart: sebelum menyalahkan database (dan membeli server baru), hitung n × t_rt — seringkali jawabannya ada di rumus satu baris, bukan di kartu kredit.",
      ],
      figure: {
        svg: RT_SVG,
        alt: "Diagram batang: loop aplikasi 50.000 perjalanan (3 jam) vs procedure 1 perjalanan (40 detik).",
        caption: "50.000 vs 1 perjalanan untuk logika yang sama. Hitung n × t_rt sebelum membeli server.",
      },
      tasks: [],
      reference: "50.000× perjalanan = 3 jam vs 40 detik. Salahkan arsitektur dulu, bukan database.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: di dalam atau di luar database",
      prose: [
        "Skenario 1 — Job batch malam: 50.000 UPDATE per baris, 3 jam. → Pindahkan ke stored procedure. Alasan: R = n × t_rt — hemat 2,8 jam; satu-satunya sumbu yang relevan adalah roundtrip.",
        "Skenario 2 — Rumus bunga dipakai di 30 query berbeda. → Function (UDF). Alasan: satu definisi, dipakai di dalam SELECT di mana-mana; ubah rumus sekali, berlaku di 30 tempat.",
        "Skenario 3 — Regulator mewajibkan audit trail perubahan saldo yang tidak boleh bolong. → Trigger AFTER UPDATE ke tabel audit. Alasan: tidak bisa di-bypass aplikasi yang lupa; CCTV tidak pernah tidur.",
        "Skenario 4 — Notifikasi email + hitung skor ML saat saldo berubah. → Tetap di aplikasi (event/listener). Alasan: butuh SMTP, retry, library ML — ekosistem aplikasi; trigger yang mengirim email = CCTV yang ikut masak.",
        "Skenario 5 — 200 procedure warisan tanpa dokumentasi, takut disentuh. → Jangan tambah lagi sebelum: inventarisasi (mana yang masih dipakai?), pindahkan definisi ke Git, tulis ulang yang kritis. Alasan: kuburan logika disembuhkan dengan penerangan, bukan dengan penghuni baru.",
        "Aturan praktis 10 detik: hemat roundtrip / invarian lintas penulis / audit wajib = di database. Butuh library / test matang / tim debug di app = di aplikasi. Tak terdokumentasi = jangan tambah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menaruh SEMUA logika di database “agar cepat” lalu 3 tahun kemudian tidak ada yang berani deploy — kecepatan sesaat ditukar dengan kelumpuhan permanen. Atau sebaliknya: menolak procedure mentah-mentah (“kuburan logika!”) lalu membiarkan loop 50.000 roundtrip jalan tiap malam. Keduanya adalah fundamentalisme; profesionalisme = aturan di atas, diterapkan per kasus.",
      },
      reference: "Di DB: hemat roundtrip, invarian, audit wajib. Di app: butuh library/test. Terdokumentasi atau jangan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Rekonsiliasi 3 jam → 40 detik: rencana Dewi",
      prose: [
        "Skenario (sintetis, angka konkret): job rekonsiliasi Dewi — baca 50.000 mutasi, untuk tiap baris: cek ke tabel nasabah (1 SELECT) + tulis hasil (1 UPDATE) = 100.000 roundtrip × 0,1 detik = 2,8 jam + overhead = ~3 jam. Server database idle 70% selama itu (menunggu jaringan, bukan komputasi). Anggaran: server baru 4× lipat = Rp120 juta/tahun.",
        "Pertanyaan analisis: (1) Hitung R = n × t_rt untuk kasus ini. (2) Rancang procedure-nya dalam 3 langkah besar. (3) Apa yang TETAP tinggal di aplikasi dan kenapa?",
        "Pembahasan: (1) R = 100.000 × 0,1 = 10.000 detik ≈ 2,8 jam — 93% waktu job adalah menunggu jaringan. (2) Procedure: (a) satu SELECT ... JOIN mengambil 50.000 baris sekaligus ke tabel sementara; (b) UPDATE ... FROM (set-based, satu statement); (c) INSERT hasil ke tabel rekonsiliasi — total 3 roundtrip. (3) Tetap di aplikasi: pengiriman laporan email hasil rekonsiliasi (butuh SMTP/template) + alerting bila selisih > ambang (butuh integrasi monitoring). Keduanya butuh ekosistem, bukan kedekatan data.",
        "Kaitan ke karier: “menurunkan runtime 3 jam → 40 detik tanpa belanja hardware” menghemat Rp120 juta/tahun — cerita yang membuat manajer mengingat namamu saat promosi dibahas.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Job 3 jam yang selesai jam 4 pagi adalah risiko operasional: bila gagal di menit ke-170, tidak ada waktu untuk rerun sebelum bisnis buka — dan setengah data sudah ter-update (inkonsisten). Procedure 40 detik + transaksi (COMMIT/ROLLBACK atomik) mengubah risiko ini menjadi nyaris nol: gagal = tidak ada yang berubah.",
      },
      reference: "R = 2,8 jam (93% job). 3 roundtrip via set-based. Email & alerting tetap di aplikasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Procedure = aksi multi-statement (CALL); function = hitungan satu nilai di dalam query; trigger = otomatis saat INSERT/UPDATE/DELETE.",
        "UDF didaftarkan sekali, dipakai di semua query; trigger memakai OLD/NEW untuk audit yang tak terbypass.",
        "Hemat roundtrip: R = n × t_rt — 50.000 × 0,2 dtk ≈ 2,8 jam.",
        "Di database: hemat roundtrip, invarian lintas penulis, audit wajib. Di aplikasi: butuh library, test matang.",
        "Kuburan logika dicegah dengan: dokumentasi + definisi di Git + aturan “di dalam/di luar” per kasus.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Job 50.000 baris × (1 SELECT + 1 UPDATE) @ 0,1 dtk/roundtrip jalan 3 jam. Diagnosis Dewi yang benar?",
          options: [
            { text: "Arsitektur cerewet: R = 100.000 × 0,1 ≈ 2,8 jam menunggu jaringan — pindahkan ke procedure", why: "Benar: angka cerita — database idle 70%; yang lambat perjalanan, bukan mesin.", correct: true },
            { text: "Database kurang kuat — naikkan spesifikasi 4× lipat", why: "Salah: server idle 70% — membeli tenaga untuk yang menunggu = Rp120 juta/tahun sia-sia." },
            { text: "Python terlalu lambat — tulis ulang job dalam bahasa compiled", why: "Salah: bahasa bukan bottleneck; 2,8 dari 3 jam adalah t_rt jaringan, bukan eksekusi." },
            { text: "Kurangi data menjadi 10.000 baris agar cepat", why: "Salah: membuang data = mengubah hasil bisnis; mengorbankan kebenaran demi kecepatan." },
          ],
        },
        {
          q: "Butuh rumus bunga dipakai di 30 query berbeda. Pilihan tepat?",
          options: [
            { text: "Function (UDF): satu definisi, dipanggil di dalam SELECT di mana-mana", why: "Benar: “kalkulator di kasir” — ubah sekali, berlaku di 30 tempat.", correct: true },
            { text: "Stored procedure yang dipanggil 30×", why: "Salah: procedure tidak mengembalikan nilai ke dalam SELECT — salah alat untuk pekerjaan hitungan." },
            { text: "Trigger AFTER SELECT", why: "Salah: tidak ada trigger untuk SELECT di sebagian besar database — dan trigger bukan untuk hitungan." },
            { text: "Copy-paste rumus ke 30 query", why: "Salah: 30 definisi = 30 tempat untuk salah saat rumus berubah; inilah yang ingin dihindari." },
          ],
        },
        {
          q: "Regulator mewajibkan audit trail saldo yang tidak boleh bolong. Mekanisme terbaik?",
          options: [
            { text: "Trigger AFTER UPDATE (OLD/NEW) ke tabel audit — tak bisa di-bypass aplikasi", why: "Benar: CCTV tidak pernah tidur; aplikasi yang lupa mencatat tidak bisa membolongi audit.", correct: true },
            { text: "Catat di aplikasi setiap kali update — lebih fleksibel", why: "Salah: justru “fleksibel” = bisa lupa; satu aplikasi lalai = audit bolong = temuan regulator." },
            { text: "Stored procedure untuk semua update", why: "Salah: hanya membantu bila SEMUA penulis memakai procedure itu — penulis langsung (ad-hoc) tetap lolos." },
            { text: "Backup harian database", why: "Salah: backup = snapshot, bukan trail — tidak mencatat siapa mengubah apa dan kapan." },
          ],
        },
        {
          q: "Dalam trigger UPDATE, OLD.jumlah vs NEW.jumlah artinya?",
          options: [
            { text: "OLD = nilai sebelum diubah, NEW = nilai sesudah diubah", why: "Benar: persis lab 2 — selisihnya adalah “cerita” transaksi.", correct: true },
            { text: "OLD = baris yang dihapus, NEW = baris yang disisipkan", why: "Salah: itu untuk DELETE/INSERT; dalam UPDATE keduanya merujuk baris yang sama, sebelum vs sesudah." },
            { text: "OLD = tabel lama, NEW = tabel baru", why: "Salah: OLD/NEW adalah baris (row-level), bukan tabel." },
            { text: "Keduanya selalu sama — hanya alias", why: "Salah: bila sama, trigger tidak ada gunanya; bedanya adalah inti audit." },
          ],
        },
        {
          q: "Logika “kirim email bila saldo minus” paling tepat ditaruh di?",
          options: [
            { text: "Aplikasi (event/listener) — butuh SMTP, retry, template; ekosistem aplikasi", why: "Benar: skenario 4 peta — trigger yang mengirim email = CCTV yang ikut masak.", correct: true },
            { text: "Trigger AFTER UPDATE — otomatis dan langsung", why: "Salah: trigger harus cepat; email lambat/gagal akan memperlambat SEMUA tulis ke tabel saldo." },
            { text: "Stored procedure yang dipanggil tiap update", why: "Salah: masih di database — masalah ekosistem (SMTP/retry) tetap ada." },
            { text: "Function yang dipanggil di SELECT", why: "Salah: function untuk hitungan, bukan efek samping seperti mengirim email." },
          ],
        },
        {
          q: "Warisan 200 procedure tak terdokumentasi. Langkah pertama profesional?",
          options: [
            { text: "Inventarisasi + pindahkan definisi ke Git sebelum menambah yang baru", why: "Benar: skenario 5 peta — kuburan disembuhkan dengan penerangan, bukan penghuni baru.", correct: true },
            { text: "Tulis ulang semuanya sekaligus minggu ini", why: "Salah: rewrite besar tanpa peta = risiko merusak yang tak terlihat; inkremental dengan inventarisasi dulu." },
            { text: "Biarkan saja, jangan sentuh yang berjalan", why: "Salah: “berjalan” tanpa dipahami = bom waktu; inventarisasi tidak merusak apa pun." },
            { text: "Hapus yang namanya aneh — pasti tidak dipakai", why: "Salah: menebak dari nama = cara tercepat merusak laporan yang ternyata bergantung padanya." },
          ],
        },
      ],
    },
  ],
};
