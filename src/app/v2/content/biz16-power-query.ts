import type { V2Lesson } from "../lib/types";

const PQDROP_SVG = `<svg viewBox="0 0 520 274" role="img" aria-label="Baris hilang per langkah Power Query: merge produk menghilangkan 34,2 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="16" x2="500" y2="16"/><line x1="150" y1="56" x2="500" y2="56"/><line x1="150" y1="96" x2="500" y2="96"/><line x1="150" y1="136" x2="500" y2="136"/><line x1="150" y1="176" x2="500" y2="176"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="140" y="35" text-anchor="end">Source</text><rect x="150" y="20" width="2.0" height="18" fill="var(--c1)"/><text x="158" y="35">0%</text>
<text x="140" y="75" text-anchor="end">Hapus null</text><rect x="150" y="60" width="15.4" height="18" fill="var(--c1)"/><text x="171" y="75">1.5%</text>
<text x="140" y="115" text-anchor="end">Filter tgl</text><rect x="150" y="100" width="13.3" height="18" fill="var(--c1)"/><text x="169" y="115">1.3%</text>
<text x="140" y="155" text-anchor="end">Merge produk</text><rect x="150" y="140" width="350.0" height="18" fill="var(--error)"/><text x="506" y="155">34.2%</text>
<text x="140" y="195" text-anchor="end">Dedup</text><rect x="150" y="180" width="3.1" height="18" fill="var(--c1)"/><text x="159" y="195">0.3%</text>
</g>
<text x="150" y="268" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0</text><text x="500" y="268" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">% baris hilang</text>
</svg>`;
export const biz16: V2Lesson = {
  slug: "biz16-power-query",
  track: "Business Intelligence",
  module: "Power BI Mendalam",
  title: "BI16 — Power Query: Dapur Data",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Enam jam yang menjadi satu klik",
      prose: [
        "Setiap awal bulan, Dinda (analis PT MajuLogistik) menghabiskan 6 jam: unduh 3 file Excel cabang, hapus baris kosong manual, betulkan tanggal typo, gabung dengan tabel produk via VLOOKUP, lalu pivot. Enam jam yang sama, setiap bulan, dengan kesalahan yang berbeda-beda.",
        "Suatu hari ia merekam langkah-langkahnya di Power Query. Bulan berikutnya: satu klik Refresh — 6 jam menjadi 40 detik. Kedengarannya seperti sihir, sampai ia membuka 'Advanced Editor' dan melihat bahasa M: setiap kliknya tercatat sebagai kode yang bisa dibaca, diedit, dan diaudit.",
        "Twist-nya: 'sihir' itu justru jebakan. Tiga bulan kemudian file cabang berubah format (kolom 'omzet' menjadi 'Omzet'), refresh GAGAL total — dan Dinda tidak tahu cara membaca M untuk memperbaikinya. Otomasi yang tidak dipahami = bom waktu yang rapi.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan Power Query sebagai 'resep' langkah yang terekam (Applied Steps); (2) membaca dan mengedit dasar bahasa M; (3) memilih Merge vs Append dengan benar; (4) mendeteksi langkah yang 'bocor' (menghilangkan data diam-diam); (5) merancang query yang tahan terhadap perubahan format sumber.",
      ],
      tasks: [],
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa:",
        "(1) Menjelaskan konsep Applied Steps: tiap klik = satu langkah M yang terekam dan bisa di-replay;",
        "(2) Membaca kode M dasar (let/in, Table.SelectRows, Table.TransformColumnTypes) dan mengeditnya;",
        "(3) Membedakan Merge (join horizontal) vs Append (tumpuk vertikal) dan memilih dengan benar;",
        "(4) Mengaudit langkah mana yang menghilangkan baris — dan memutuskan apakah itu disengaja;",
        "(5) Menerapkan tipe data eksplisit di awal agar error tidak meledak di DAX belakangan.",
      ],
      tasks: [],
    },
    {
      id: "resep",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Applied Steps: resep yang bisa di-replay",
      prose: [
        "Power Query bekerja seperti resep masakan yang ditulis otomatis: setiap tindakanmu (hapus kolom, filter baris, gabung tabel) ditambahkan sebagai satu 'langkah' di panel Applied Steps. Refresh = menjalankan ulang resep dari atas ke bawah terhadap data TERBARU.",
        "Contoh langkah-demi-langkah (dari lab 1): Source (6 baris) → 'Hapus null omzet' (5 baris) → 'Filter tanggal valid' (4 baris) → 'Tipe data + isi null kasir' (4 baris bersih) → agregat per cabang. Tiap langkah = fungsi M: Table.SelectRows, Table.TransformColumnTypes, Table.Group.",
        "Bahasa M-nya terbaca seperti ini: let Source = ..., #\"Hapus null\" = Table.SelectRows(Source, each [omzet] <> null) in #\"Hapus null\". Pola let/in = 'definisikan langkah-langkah, lalu hasilkan yang terakhir'. each = 'untuk tiap baris'.",
        "💡 Intuisi kunci: nama langkahmu adalah dokumentasi. 'Filtered Rows1', 'Filtered Rows2' = resep yang tidak bisa dibaca. Ganti nama tiap langkah ('Hapus null omzet', 'Filter tanggal valid') — 10 detik yang menyelamatkan 10 jam debugging.",
        "Kapan memakai: SEMUA pembersihan/transformasi sebelum data masuk model = Power Query, bukan DAX. Aturannya: kalau langkahnya 'mengubah data', ia milik M; kalau 'menghitung dari data', ia milik DAX (BI15).",
      ],
      formula: String.raw`\text{Bersih} = S_n(\ldots S_2(S_1(\text{Source})))`,
      formulaNote:
        "Data bersih = komposisi fungsi langkah: terapkan S_1 ke Source, lalu S_2 ke hasilnya, dst. Urutan MENENTUKAN hasil (filter dulu baru merge ≠ merge dulu baru filter) — inilah kenapa panel Applied Steps bisa di-reorder dan kenapa urutannya harus disengaja.",
      note: {
        title: "🚨 Miskonsepsi: Power Query = wizard klik-klik untuk orang non-teknis",
        body: "Wizard-nya memang bisa diklik — tetapi yang dihasilkan adalah KODE (M) yang dieksekusi berurutan. Mengabaikan kode di balik klik = tidak bisa debug saat format sumber berubah, tidak bisa review, tidak bisa versioning. Profesional Power Query MEMBACA M-nya; klik hanyalah cara cepat menulis draf.",
      },
      tasks: [],
    },
    {
      id: "merge-append",
      eyebrow: "Langkah 4 · Merge vs Append",
      title: "Merge: menempel ke samping. Append: menumpuk ke bawah.",
      prose: [
        "Dua operasi yang paling sering tertukar. Append = menumpuk baris: file JKT + file BDG + file SBY (kolom SAMA, baris bertambah). Merge = menempel kolom: tabel penjualan + tabel produk via kode_produk (baris SAMA, kolom bertambah) — alias JOIN.",
        "Contoh: 3 file cabang (masing-masing 2.000 baris, kolom sama) → APPEND menjadi 6.000 baris. Tabel penjualan (6.000 baris) + tabel produk (500 baris, via kode_produk) → MERGE menjadi 6.000 baris + kolom nama_produk.",
        "Jebakan merge: jenis join-nya! Left Outer (default) mempertahankan semua baris kiri; Inner membuang yang tidak cocok. Di lab 2, 'Merge produk' menghilangkan 34,1% baris — klasik Inner join (atau kode produk tidak cocok) yang tidak disadari. Selalu cek jumlah baris SEBELUM vs SESUDAH merge.",
        "💡 Intuisi kunci: setelah MERGE, selalu bandingkan jumlah baris. Berkurang? Kamu baru saja membuang data — pastikan itu disengaja (inner join yang diinginkan), bukan kecelakaan (key tidak cocok).",
        "Kapan memakai: kolom sama + baris baru → Append. Butuh kolom dari tabel lain via key → Merge. Butuh keduanya (tumpuk lalu perkaya)? Append DULU, baru Merge — urutan yang salah = merge 3x.",
      ],
      note: {
        title: "🚨 Miskonsepsi: tipe data bisa 'nanti saja'",
        body: "Kolom 'omzet' sebagai TEXT (bukan NUMBER) = SUM tidak bisa dipakai di DAX, sorting alfabetis ('950000' > '1200000' sebagai teks!), dan error muncul JAUH dari sumbernya. Aturan: tetapkan tipe di langkah AWAL Power Query (Table.TransformColumnTypes). Error tipe yang ditangkap di M = 1 menit; yang lolos ke DAX = 1 jam.",
      },
      tasks: [],
    },
    {
      id: "langkah-bocor",
      eyebrow: "Langkah 5 · Visual",
      title: "Langkah mana yang memakan 34% datamu?",
      prose: [
        "Cara membaca: batang horizontal = % baris yang HILANG di tiap langkah (dari 10.000 baris awal). Empat langkah pertama nyaris nol; batang merah 'Merge produk' = 34,1% — anomali yang berteriak.",
        "Interpretasi: merge yang menghilangkan sepertiga data hampir pasti SALAH — key tidak cocok (format kode beda) atau join type keliru (inner vs left). Tanpa audit per-langkah seperti ini, 3.420 baris hilang DIAM-DIAM dan tidak ada yang sadar sampai laporan direksi dipertanyakan.",
        "💡 Intuisi kunci: 'baris hilang' adalah metrik kesehatan Power Query. Catat jumlah baris per langkah (Power Query menampilkannya di panel); langkah dengan susut > 5% wajib bisa menjelaskan dirinya.",
      ],
      figure: {
        svg: PQDROP_SVG,
        alt: "Susut baris per langkah Power Query: merge produk menghilangkan 34,2%.",
        caption:
          "% baris hilang per Applied Step — merge produk adalah anomali yang harus diinvestigasi.",
      },
      tasks: [],
    },
    {
      id: "lab-resep",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: tulis ulang resep Power Query",
      prose: [
        "Kamu diberi data mentah 3 cabang (6 baris, kotor seperti aslinya). Tugasmu: tirukan Applied Steps Power Query dalam Python — filter null, filter tanggal rusak, perbaiki tipe, isi null kasir — lalu agregat per cabang.",
        "Perhatikan: tiap 'langkah' adalah list baru (seperti tiap Applied Step menghasilkan tabel baru). Urutan menentukan hasil.",
        "Coba juga: apa yang terjadi jika langkah 'isi null kasir' dikerjakan SEBELUM 'hapus null omzet'? (Tidak ada bedanya di sini — tetapi untuk langkah yang dependen, urutan = segalanya.)",
      ],
      tasks: [
        { id: "t1", text: "Bangun `langkah1`: hapus baris dengan omzet null" },
        { id: "t2", text: "Bangun `langkah2`: hapus baris dengan tanggal tidak valid" },
        { id: "t3", text: "Bangun `bersih` (omzet→int, kasir null→'TIDAK_DIISI') dan `total_per_cabang`" },
      ],
      expected: "total_per_cabang={'BDG': 950000, 'JKT': 1200000, 'SBY': 2150000}",
      note: {
        title: "Sering salah",
        body: "Memfilter tanggal dengan string comparison ('2026-13-40' < '2026-12-31' = True!). Tanggal rusak harus divalidasi sebagai TANGGAL (split + cek bulan/hari), bukan dibandingkan sebagai teks.",
      },
      hints: [
        "langkah1 = [r for r in RAW if r['omzet'] is not None].",
        "Validasi tanggal: split('-'), cek 1<=bulan<=12 dan 1<=hari<=31.",
        "bersih: int(r['omzet']); kasir: r['kasir'] or 'TIDAK_DIISI'.",
      ],
      code: {
        starter: `# Data kotor dari 3 file cabang (tiruan hasil Power Query "Source"):\nRAW = [\n    {"cabang": "JKT", "tgl": "2026-01-05", "omzet": "1200000", "kasir": "Ayu"},\n    {"cabang": "JKT", "tgl": "2026-01-06", "omzet": None, "kasir": "Ayu"},\n    {"cabang": "BDG", "tgl": "2026-01-05", "omzet": "950000", "kasir": "Bima"},\n    {"cabang": "BDG", "tgl": "2026-13-40", "omzet": "800000", "kasir": "Bima"},  # tanggal rusak\n    {"cabang": "SBY", "tgl": "2026-01-05", "omzet": "1100000", "kasir": None},\n    {"cabang": "SBY", "tgl": "2026-01-06", "omzet": "1050000", "kasir": "Citra"},\n]\n# TULIS KODEMU: langkah1, langkah2, bersih, total_per_cabang\nlangkah1 = []\nlangkah2 = []\nbersih = []\ntotal_per_cabang = {}\n\nprint(f"langkah1={len(langkah1)}  langkah2={len(langkah2)}  bersih={len(bersih)}")\nprint(f"total_per_cabang={total_per_cabang}")\n`,
        lockLines: 9,
        solution: `# Data kotor dari 3 file cabang (tiruan hasil Power Query "Source"):\nRAW = [\n    {"cabang": "JKT", "tgl": "2026-01-05", "omzet": "1200000", "kasir": "Ayu"},\n    {"cabang": "JKT", "tgl": "2026-01-06", "omzet": None, "kasir": "Ayu"},\n    {"cabang": "BDG", "tgl": "2026-01-05", "omzet": "950000", "kasir": "Bima"},\n    {"cabang": "BDG", "tgl": "2026-13-40", "omzet": "800000", "kasir": "Bima"},  # tanggal rusak\n    {"cabang": "SBY", "tgl": "2026-01-05", "omzet": "1100000", "kasir": None},\n    {"cabang": "SBY", "tgl": "2026-01-06", "omzet": "1050000", "kasir": "Citra"},\n]\n\n# TULIS KODEMU: langkah1, langkah2, bersih, total_per_cabang\n# Tirukan Applied Steps Power Query: Source -> bersihkan -> tipedata -> agregat\nlangkah1 = [r for r in RAW if r["omzet"] is not None]          # hapus omzet null\ndef tgl_ok(r):\n    try:\n        y, m, d = r["tgl"].split("-"); return 1 <= int(m) <= 12 and 1 <= int(d) <= 31\n    except Exception:\n        return False\nlangkah2 = [r for r in langkah1 if tgl_ok(r)]                   # hapus tanggal rusak\nbersih = [{"cabang": r["cabang"], "omzet": int(r["omzet"]),\n           "kasir": r["kasir"] or "TIDAK_DIISI"} for r in langkah2]  # tipe + isi null\nfrom collections import defaultdict\ntot = defaultdict(int)\nfor r in bersih:\n    tot[r["cabang"]] += r["omzet"]\ntotal_per_cabang = dict(sorted(tot.items()))\n\nprint(f"langkah1={len(langkah1)}  langkah2={len(langkah2)}  bersih={len(bersih)}")\nprint(f"total_per_cabang={total_per_cabang}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "langkah1=5", label: "`langkah1` = 5 baris", msg: "6 − 1 null." },
          { kind: "stdout_matches", task: "t2", pattern: "langkah2=4", label: "`langkah2` = 4 baris", msg: "5 − 1 tanggal rusak." },
          { kind: "stdout_matches", task: "t3", pattern: "total_per_cabang=\\{'BDG': 950000, 'JKT': 1200000, 'SBY': 2150000\\}", label: "total per cabang benar", msg: "BDG 950rb, JKT 1,2jt, SBY 2,15jt." },
        ],
      },
      reference: "Applied Steps: tiap transformasi = fungsi yang menghasilkan tabel baru.",
    },
    {
      id: "lab-audit-langkah",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: audit langkah yang bocor",
      prose: [
        "Refresh berhasil — tetapi apakah ada data yang hilang diam-diam? Tugasmu: dari catatan (masuk, keluar) tiap Applied Step, hitung % susut, temukan langkah paling bocor, dan nilai dengan ambang 50%.",
        "Hasil: 'Merge produk' susut 34,1% — di bawah ambang 50% (aman=True), TETAPI tetap anomali yang wajib diinvestigasi. Ambang adalah alarm kebakaran; 34% adalah bau asap — keduanya butuh respons.",
        "Coba juga: turunkan ambang ke 5%. Langkah apa saja yang 'tidak aman'? Inilah kenapa ambang adalah KEBIJAKAN: tidak ada angka sakral, yang penting disepakati dan konsisten.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `susut`: dict langkah → % baris hilang (2 desimal)" },
        { id: "t2", text: "Tentukan `langkah_bocor`: susut terbesar" },
        { id: "t3", text: "Tentukan `aman`: True jika semua susut < 50%" },
      ],
      expected: "langkah_bocor=Merge produk  aman=True",
      note: {
        title: "Sering salah",
        body: "Menghitung susut dari TOTAL AWAL (10000) untuk semua langkah. Susut tiap langkah dihitung dari MASUK langkah itu — (9720-6400)/9720, bukan /10000.",
      },
      hints: [
        "susut[nama] = (masuk-keluar)/masuk*100, bulatkan 2 desimal.",
        "max(susut, key=susut.get).",
        "aman = all(v < 50 for v in susut.values()).",
      ],
      code: {
        starter: `# Applied Steps tercatat (nama, baris_masuk, baris_keluar)\nSTEPS = [\n    ("Source", 10000, 10000),\n    ("Hapus null omzet", 10000, 9850),\n    ("Filter tanggal valid", 9850, 9720),\n    ("Merge produk", 9720, 6400),\n    ("Hapus duplikat", 6400, 6380),\n]\n# TULIS KODEMU: susut, langkah_bocor, aman\nsusut = {}\nlangkah_bocor = ''\naman = True\n\nprint(f"susut={susut}")\nprint(f"langkah_bocor={langkah_bocor}  aman={aman}")\n`,
        lockLines: 8,
        solution: `# Applied Steps tercatat (nama, baris_masuk, baris_keluar)\nSTEPS = [\n    ("Source", 10000, 10000),\n    ("Hapus null omzet", 10000, 9850),\n    ("Filter tanggal valid", 9850, 9720),\n    ("Merge produk", 9720, 6400),\n    ("Hapus duplikat", 6400, 6380),\n]\n\n# TULIS KODEMU: susut, langkah_bocor, aman\nsusut = {nama: round((masuk - keluar) / masuk * 100, 2)\n         for nama, masuk, keluar in STEPS}\nlangkah_bocor = max(susut, key=susut.get)\naman = all(v < 50 for v in susut.values())\n\nprint(f"susut={susut}")\nprint(f"langkah_bocor={langkah_bocor}  aman={aman}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "'Merge produk': 34\\.16", label: "susut merge = 34,1%", msg: "(9720-6400)/9720 = 34,16%." },
          { kind: "equal", task: "t2", name: "langkah_bocor", value: "Merge produk", label: "`langkah_bocor` benar", msg: "Susut terbesar." },
          { kind: "stdout_matches", task: "t3", pattern: "aman=True", label: "`aman` = True (ambang 50%)", msg: "34,1 < 50 — tetapi TETAP investigasi!" },
        ],
      },
      reference: "Audit susut per langkah: (masuk − keluar) / masuk.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 8 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Power Query yang baik dibaca seperti resep — bukan seperti sulap. Ganti nama tiap langkah dengan kata kerja bisnis ('Hapus null omzet'), tambahkan deskripsi pada langkah yang tidak obvious. Dirimu 6 bulan dari sekarang adalah pembaca resep itu.",
        "💡 'Refresh gagal' hampir selalu berarti 'sumber berubah'. Pertahanan termurah: langkah pertama = validasi skema (cek kolom yang diharapkan ada). Gagal cepat dengan pesan jelas > gagal di langkah ke-17 dengan error misterius.",
        "💡 Jangan lakukan di Power Query apa yang seharusnya di sumber. Membersihkan typo 'JKT' vs 'Jkt' tiap refresh = mengobati gejala. Perbaiki di sistem sumber (dropdown, validasi input) — Power Query untuk transformasi, bukan untuk menambal proses bisnis yang rusak.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: awasi jumlah baris seperti kasir mengawasi laci",
        body: "Di Power Query, angka yang paling penting bukanlah hasil akhirnya — melainkan jumlah baris di SETIAP langkah. Praktisi ETL yang berpengalaman membaca Applied Steps seperti kasir membaca laci: baris masuk vs baris keluar harus bisa dijelaskan. Heuristiknya konkret: setiap langkah yang mengubah jumlah baris lebih dari 1% WAJIB punya komentar alasan — \"filter null: -340 baris (3,2%), terverifikasi kolom opsional\" — bukan sekadar \"Filtered Rows\". Langkah tanpa alasan yang memakan sepertiga datamu bukan pembersihan; itu tersangka. Jebakan paling sunyi adalah merge dengan tipe key yang tidak cocok: kolom teks \"00123\" di-join ke angka 123 — tidak error, tidak warning, hanya baris yang diam-diam hilang lewat inner join. Atau Remove Duplicates pada kolom yang ternyata bukan unique key. Aturan praktisnya ada tiga. Pertama, ganti nama setiap langkah dengan kata kerja bisnis (\"Hapus baris tanpa ID pelanggan\") agar audit bisa dibaca manusia. Kedua, setelah merge atau filter besar, tambahkan langkah checkpoint yang mencatat jumlah baris — jadikan kebiasaan, bukan pengecualian. Ketiga, curigai setiap penurunan tajam: klik langkah sebelum dan sesudahnya, bandingkan, dan jangan lanjut sebelum penurunannya masuk akal. Refresh yang \"sukses\" tetapi menghapus ribuan baris tanpa ada yang sadar adalah kegagalan yang menyamar sebagai keberhasilan. Di dunia ETL, baris yang hilang diam-diam lebih berbahaya daripada error yang berteriak.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: M, DAX, atau sumber?",
      prose: [
        "Skenario 1 — Membersihkan/menggabungkan data sebelum analisis (null, tipe, join). → POWER QUERY (M). Alasan: transformasi = resep yang di-replay tiap refresh.",
        "Skenario 2 — Agregat yang responsif terhadap slicer (total, YTD). → DAX MEASURE (BI15). Alasan: butuh filter context dinamis — M (statis saat refresh) tidak bisa.",
        "Skenario 3 — Nilai per baris untuk filter/kategori. → DAX CALCULATED COLUMN. Alasan: row context — tetapi pertimbangkan dulu apakah bisa di M (lebih murah untuk model).",
        "Skenario 4 — Sumber berubah format tiap bulan. → M + langkah validasi skema di awal. Alasan: gagal cepat + pesan jelas; jangan biarkan error meledak di langkah ke-17.",
        "Skenario 5 — Data > 10 juta baris, transformasi berat. → Lakukan di SUMBER/warehouse (SQL/dbt), bukan di Power Query. Alasan: M single-threaded di mesinmu; 10 juta baris = refresh berjam-jam. Power Query untuk < 1 juta baris; di atas itu, dorong ke hulu.",
        "Aturan praktis 10 detik: tanya 'apakah ini mengubah DATA atau menghitung DARI data?' Mengubah → M. Menghitung → DAX. 'Apakah sumbernya bisa berubah format?' Ya → validasi skema di langkah pertama.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: refresh 40 detik yang menghapus 3.420 baris",
      prose: [
        "PT MajuLogistik, Februari 2026. Dinda me-refresh query penjualan — 40 detik, sukses, tidak ada error. Laporan terkirim. Dua minggu kemudian finance bertanya: 'kenapa revenue kita Rp342 juta lebih rendah dari pembukuan?'",
        "Investigasi: langkah 'Merge produk' memakai Inner join — 3.420 baris (34,2%) dengan kode produk berformat baru ('PRD-2026-001' vs 'PRD001') tidak cocok dan TERBUANG DIAM-DIAM. Tidak ada error karena inner join yang membuang = perilaku normal. Kerugian: 2 minggu keputusan berbasis data yang kehilangan Rp342 juta.",
        "Angka konkretnya: 9.720 baris masuk merge → 6.400 keluar = 3.420 hilang = Rp342 juta (rata-rata Rp100 ribu/baris). Perbaikan: ganti ke Left Outer + langkah 'Cek kode tak cocok' yang melempar baris-baris itu ke tabel quarantine untuk ditindaklanjuti — bukan dibuang.",
        "Pembahasan: (a) audit susut per langkah (lab 2) menangkap ini dalam 1 menit — jika dijalankan; (b) merge SELALU diikuti cek jumlah baris; (c) key yang tidak cocok = masalah kualitas sumber (format kode berubah) yang harus diperbaiki di hulu, bukan ditutupi di query.",
        "💡 Intuisi kunci: di Power Query, yang paling berbahaya bukan error — melainkan sukses yang diam-diam membuang data. Error berteriak; inner join yang salah tersenyum.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Pertanyaan tentang lesson ini. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "Power Query = resep Applied Steps yang di-replay tiap refresh; tiap klik = kode M.",
        "Append menumpuk baris (kolom sama); Merge menempel kolom via key (waspadai join type!).",
        "Audit susut baris per langkah: anomali > 5% wajib menjelaskan dirinya.",
        "Tipe data ditetapkan di awal M; error tipe yang lolos ke DAX berlipat ganda biayanya.",
        "Transformasi (M) vs kalkulasi (DAX): 'mengubah data → M, menghitung dari data → DAX'.",
      ],
      next: { label: "BI17 — RLS + Administrasi Power BI Service", href: "/v2/learn/biz17-rls-service" },
      quiz: [
        {
          q: "Query-mu: Source (10.000) → filter (9.850) → merge (6.400). Tidak ada error. Tindakan pertama?",
          options: [
            { text: "Lanjut — tidak ada error berarti aman", why: "Tidak ada error ≠ aman: 3.450 baris (34,5%) hilang diam-diam. Di Power Query, sukses yang membuang data lebih berbahaya daripada error yang berteriak." },
            { text: "Investigasi merge: cek join type + key yang tidak cocok", why: "Tepat: susut 34,5% pada merge = anomali. Kemungkinan: inner join yang seharusnya left outer, atau format key beda. Audit susut per langkah (lab 2) adalah prosedurnya.", correct: true },
            { text: "Hapus langkah merge", why: "Menghapus = kehilangan kolom yang dibutuhkan. Masalahnya bukan merge-nya, melainkan perilakunya." },
            { text: "Tambah baris manual 3.450", why: "Memalsukan data untuk menutupi kebocoran = fraud pelaporan. Jangan pernah." },
          ],
        },
        {
          q: "File sumber berubah: kolom 'omzet' menjadi 'Omzet'. Refresh gagal di langkah ke-3. Perbaikan paling tahan lama?",
          options: [
            { text: "Edit manual tiap bulan", why: "Manual tiap bulan = 12 peluang lupa per tahun. Otomasi yang butuh sentuhan manual bukan otomasi." },
            { text: "Tambah langkah normalisasi nama kolom di AWAL (lowercase semua)", why: "Tepat: langkah 'Normalisasi kolom' di awal membuat query tahan terhadap perubahan kapitalisasi. Pertahanan umum: validasi skema eksplisit di langkah pertama + normalisasi.", correct: true },
            { text: "Minta cabang jangan ubah format", why: "Permintaan yang baik, tetapi query tetap rapuh jika mereka lupa. Desain harus tahan terhadap manusia." },
            { text: "Kembali ke cara manual 6 jam", why: "Menyerah pada otomasi karena satu kegagalan = membuang 6 jam/bulan selamanya. Perbaiki, jangan mundur." },
          ],
        },
        {
          q: "Butuh menggabungkan 12 file bulanan (kolom identik) + menambah kolom nama produk dari tabel master. Urutan yang benar?",
          options: [
            { text: "Merge dulu tiap file, baru append", why: "12 merge = 12 peluang salah + lambat. Urutan terbalik." },
            { text: "Append 12 file dulu, baru merge sekali ke master", why: "Tepat: Append (tumpuk vertikal, kolom sama) DULU menjadi 1 tabel, baru Merge SEKALI ke tabel produk. Prinsip: minimalkan operasi mahal; urutan = append dulu, merge kemudian.", correct: true },
            { text: "Copy-paste manual di Excel", why: "Itulah 6 jam yang ingin kita hapus. Jangan kembali." },
            { text: "Minta IT buatkan API", why: "API tidak menyelesaikan kebutuhan transformasi; ia hanya memindah sumber masalah." },
          ],
        },
        {
          q: "Kolom tanggal bertipe TEXT di Power Query. Dampaknya jika dibiarkan sampai ke DAX?",
          options: [
            { text: "Tidak ada — DAX otomatis konversi", why: "DAX TIDAK otomatis konversi dengan benar: sorting alfabetis ('2026-13-40' lolos!), time intelligence gagal diam-diam. Error meledak jauh dari sumbernya." },
            { text: "Sorting salah, time intelligence rusak, error sulit dilacak — tetapkan tipe di M sejak awal", why: "Tepat: tipe data adalah kontrak. TEXT untuk tanggal = kontrak yang bohong. Table.TransformColumnTypes di langkah awal = 1 menit; debug di DAX = 1 jam.", correct: true },
            { text: "Hanya masalah tampilan", why: "Bukan kosmetik: '950000' > '1200000' sebagai teks (perbandingan string!). Agregat dan urutan ikut salah." },
            { text: "Power BI menolak load", why: "Power BI tidak menolak — ia load dengan senang hati dan salah dengan tenang. Itulah bahayanya." },
          ],
        },
        {
          q: "Mana yang PALING tepat dikerjakan di Power Query (bukan DAX)?",
          options: [
            { text: "Total penjualan responsif slicer", why: "Itu measure DAX (filter context dinamis). M statis saat refresh." },
            { text: "Membersihkan null, memperbaiki tipe, menggabungkan tabel sumber", why: "Tepat: transformasi data = M. Aturan 10 detik: 'mengubah DATA → M; menghitung DARI data → DAX'.", correct: true },
            { text: "YTD penjualan", why: "Time intelligence = DAX + tabel Date. M tidak punya filter context." },
            { text: "Rata-rata per kategori yang berubah saat filter", why: "Responsif terhadap filter = measure DAX." },
          ],
        },
      ],
    },
  ],
};
