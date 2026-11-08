import type { V2Lesson } from "../lib/types";

// Deret total kredit 12 bulan dengan break di bulan ke-9.
const FIG_BREAK = `<svg viewBox=\"0 0 480 260\" role=\"img\" aria-label=\"Deret total kredit 12 bulan dengan lompatan tajam di bulan ke-9 yang ditandai sebagai break.\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\">
<line x1=\"40\" y1=\"220\" x2=\"460\" y2=\"220\"/><line x1=\"40\" y1=\"160\" x2=\"460\" y2=\"160\"/>
<line x1=\"40\" y1=\"100\" x2=\"460\" y2=\"100\"/><line x1=\"40\" y1=\"40\" x2=\"460\" y2=\"40\"/>
</g>
<g fill=\"var(--chart-text)\" font-size=\"10\" font-family=\"var(--font-ui)\" text-anchor=\"end\">
<text x=\"34\" y=\"223\">900</text><text x=\"34\" y=\"163\">1050</text><text x=\"34\" y=\"103\">1200</text><text x=\"34\" y=\"43\">1350</text>
</g>
<polyline points=\"50,196 86,193 122,190 158,187 194,184 230,181 266,178 302,175 338,71 374,66 410,61 446,56\" fill=\"none\" stroke=\"var(--c1)\" stroke-width=\"2.5\"/>
<g fill=\"var(--c1)\"><circle cx=\"50\" cy=\"196\" r=\"4\"/><circle cx=\"86\" cy=\"193\" r=\"4\"/><circle cx=\"122\" cy=\"190\" r=\"4\"/><circle cx=\"158\" cy=\"187\" r=\"4\"/><circle cx=\"194\" cy=\"184\" r=\"4\"/><circle cx=\"230\" cy=\"181\" r=\"4\"/><circle cx=\"266\" cy=\"178\" r=\"4\"/><circle cx=\"302\" cy=\"175\" r=\"4\"/></g>
<g fill=\"var(--c4)\"><circle cx=\"338\" cy=\"71\" r=\"5\"/><circle cx=\"374\" cy=\"66\" r=\"5\"/><circle cx=\"410\" cy=\"61\" r=\"5\"/><circle cx=\"446\" cy=\"56\" r=\"5\"/></g>
<line x1=\"320\" y1=\"30\" x2=\"320\" y2=\"220\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/>
<text x=\"326\" y=\"46\" font-size=\"12\" fill=\"var(--c4)\" font-family=\"var(--font-ui)\" font-weight=\"600\">BREAK: +16,3%</text>
<text x=\"326\" y=\"62\" font-size=\"11\" fill=\"var(--text-muted)\" font-family=\"var(--font-ui)\">bulan 9 · selidiki dulu</text>
<g fill=\"var(--chart-text)\" font-size=\"10\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<text x=\"50\" y=\"238\">1</text><text x=\"158\" y=\"238\">4</text><text x=\"266\" y=\"238\">7</text><text x=\"374\" y=\"238\">10</text><text x=\"446\" y=\"238\">12</text>
</g>
<text x=\"240\" y=\"254\" font-size=\"11\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">Bulan · Total kredit (Rp miliar)</text>
</svg>`;

export const rr4: V2Lesson = {
  slug: "rr4-data-quality",
  track: "Risk Reporting",
  module: "Fondasi Pelaporan",
  title: "RR4 — QA Data Laporan",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp15 miliar yang tidak ada",
      prose: [
        "Laporan bulanan ke regulator sudah terkirim. Dua minggu kemudian telepon dari OJK: \u201Ctotal kredit di laporan Bapak Rp15 miliar lebih besar dari laporan SLIK.\u201D Investigasi internal menemukan penyebabnya dalam 20 menit: satu cabang mengunggah file yang sama dua kali, dan tidak ada yang memeriksa apakah jumlah cabang di file = jumlah cabang yang melapor.",
        "Twist-nya: angka itu lolos tiga lapis review manusia. Semua reviewer melihat trennya \u201Cwajar\u201D — naik sedikit dari bulan lalu. Tidak ada yang menjumlahkan ulang. Pelajaran: mata manusia hebat membaca pola, tetapi buruk menjumlahkan. QA data laporan bukan soal ketelitian membaca — soal punya mesin pemeriksa yang tidak lelah: rekonsiliasi otomatis, deteksi break, dan checklist yang dijalankan setiap kali, tanpa kecuali.",
        "Setelah lesson ini kamu bisa: (1) melakukan rekonsiliasi total vs penjumlahan segmen; (2) mendeteksi break pada deret bulanan; (3) menjalankan checklist 7 item sebelum laporan dikirim.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kesalahan Rp15 miliar yang terkirim ke regulator = surat teguran + reputasi. Biaya memperbaikinya setelah terkirim 100x lipat dibanding menangkapnya sebelum terkirim. QA adalah asuransi termurah di risk reporting.",
      },
      reference: "Mata manusia untuk pola; mesin untuk penjumlahan. Jangan tukar perannya.",
    },
    {
      id: "tiga-pilar",
      eyebrow: "Langkah 2 · Tiga pilar QA",
      title: "Rekonsiliasi, break, lineage",
      prose: [
        "Pilar 1 — Rekonsiliasi: setiap angka total harus sama dengan penjumlahan bagian-bagiannya. Total kredit = korporasi + SME + ritel + mikro. Jika selisihnya bukan nol, ada yang double-count atau hilang. Ini menangkap kasus Rp15 miliar dalam hitungan detik.",
        "Pilar 2 — Deteksi break: perubahan bulan-ke-bulan yang melompat di luar kewajaran. Total kredit tumbuh 0,5% per bulan selama 8 bulan, lalu +16,3% dalam sebulan? Itu bukan pertumbuhan — itu akuisisi, perubahan definisi, atau kesalahan. Tandai, selidiki, jelaskan di footnote sebelum ada yang bertanya.",
        "Pilar 3 — Lineage: setiap angka bisa ditelusur balik ke sumbernya. \u201CAngka ini dari tabel apa, query apa, tanggal tarik kapan?\u201D Tanpa lineage, angka yang dipertanyakan = angka yang tidak bisa dipertahankan. Dengan lineage, jawabannya 5 menit.",
      ],
      formula: String.raw`z = \frac{x - \mu}{\sigma} \qquad \text{MoM} = \frac{x_t - x_{t-1}}{x_{t-1}}`,
      formulaNote: "z = skor standar: x = nilai bulan ini, μ = rata-rata historis, σ = simpangan baku historis. |z| > 3 = anomali serius. MoM = perubahan relatif bulan-ke-bulan. Contoh: total kredit 1.015 → 1.180 = +16,3% MoM — jauh di atas pola 0,5%, wajib diselidiki.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CData dari core banking pasti benar.\u201D Sistem sumber bisa benar sementara data yang sampai ke laporanmu salah: file double-upload, query salah tanggal, kolom tertukar. QA memeriksa rantai dari sumber sampai laporan — bukan kepercayaan pada sistem.",
      },
      hints: [
        "Intuisi: setiap angka di laporan punya \u201Csaudara\u201D — total punya segmen, bulan ini punya bulan lalu, laporanmu punya SLIK. Jika saudara-saudaranya tidak cocok, angkanya tersangka.",
        "Break belum tentu salah — akuisisi bank memang melompatkan total. Tugas QA bukan menghapus break, melainkan memastikan setiap break punya penjelasan tertulis.",
      ],
      reference: "Rekonsiliasi = jumlahkan ulang. Break = selidiki lompatan. Lineage = lacak sumber.",
    },
    {
      id: "lab-qa",
      eyebrow: "Langkah 3 · Lab",
      title: "Mesin QA: rekonsiliasi + deteksi break",
      prose: [
        "Bangun pemeriksa otomatis dua pilar. Pertama, rekonsiliasi: jumlahkan tiga segmen bulan terakhir, bandingkan dengan total yang dilaporkan. Kedua, deteksi break: hitung MoM tiap bulan, tandai yang |MoM| > 10% — ambang sederhana yang menangkap kasus Rp15 miliar maupun akuisisi.",
        "Perhatikan outputnya: rekonsiliasi lolos (True) tetapi break terdeteksi di bulan 9. Inilah kenyataan QA: satu pilar lolos tidak berarti data bersih. Break bulan 9 ternyata akuisisi portofolio — benar secara bisnis, tetapi wajib dijelaskan di footnote laporan, bukan dibiarkan sebagai misteri.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `rekonsiliasi_ok` dan loop deteksi break" },
        { id: "t2", text: "Jalankan dan baca hasilnya" },
      ],
      expected: "Rekonsiliasi total vs segmen: True\nBreak terdeteksi: bulan 9 (+16.3%)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CCek visual sudah cukup — trennya wajar.\u201D Tiga reviewer kasus Rp15 miliar juga merasa trennya wajar. Mata manusia menormalisasi anomali kecil; mesin tidak. Rekonsiliasi harus berupa kode yang dieksekusi, bukan tatapan yang dilewatkan.",
      },
      hints: [
        "rekonsiliasi_ok = (sum(segmen) == total_terakhir).",
        "mom = kredit[i]/kredit[i-1] - 1; tandai jika abs(mom) > 0.10.",
        "Nomor bulan = i+1 karena list dimulai dari indeks 0.",
      ],
      code: {
        starter: `# Total kredit 12 bulan (Rp miliar). JANGAN UBAH baris ini.\nkredit = [980,985,990,995,1000,1005,1010,1015,1180,1190,1200,1210]\nsegmen = [500, 400, 310]  # korporasi, SME, ritel — bulan terakhir\n\n# TULIS KODEMU: rekonsiliasi\nrekonsiliasi_ok =\nprint(f"Rekonsiliasi total vs segmen: {rekonsiliasi_ok}")\n\n# TULIS KODEMU: deteksi break (|MoM| > 10%)\nfor i in range(1, len(kredit)):\n    mom =\n    if :\n        print(f"Break terdeteksi: bulan {i+1} ({mom:+.1%})")`,
        lockLines: 3,
        solution: `# Total kredit 12 bulan (Rp miliar). JANGAN UBAH baris ini.\nkredit = [980,985,990,995,1000,1005,1010,1015,1180,1190,1200,1210]\nsegmen = [500, 400, 310]  # korporasi, SME, ritel — bulan terakhir\n\n# TULIS KODEMU: rekonsiliasi\nrekonsiliasi_ok = sum(segmen) == kredit[-1]\nprint(f"Rekonsiliasi total vs segmen: {rekonsiliasi_ok}")\n\n# TULIS KODEMU: deteksi break (|MoM| > 10%)\nfor i in range(1, len(kredit)):\n    mom = kredit[i] / kredit[i-1] - 1\n    if abs(mom) > 0.10:\n        print(f"Break terdeteksi: bulan {i+1} ({mom:+.1%})")`,
        checks: [
          { kind: "equal", task: "t1", name: "rekonsiliasi_ok", value: true, label: "Rekonsiliasi = True", msg: "500+400+310 = 1210 = total bulan 12." },
          { kind: "stdout_matches", task: "t2", pattern: "Break terdeteksi: bulan 9 \\(\\+16\\.3%\\)", label: "Break bulan 9 terdeteksi", msg: "1180/1015 − 1 = +16,3% > 10%." },
        ],
      },
      reference: "sum(segmen) == total; tandai |MoM| > 10%. Break = selidiki, bukan hapus.",
    },
    {
      id: "checklist",
      eyebrow: "Langkah 4 · Checklist",
      title: "Tujuh cek sebelum tombol kirim",
      prose: [
        "Checklist pre-send yang dipakai tim risk reporting profesional: (1) Rekonsiliasi total vs segmen = nol selisih. (2) Tidak ada break tanpa penjelasan tertulis. (3) Angka kunci vs bulan lalu: setiap perubahan > ambang punya narasi. (4) Konsistensi antar laporan: angka yang sama di laporan internal dan regulasi. (5) Definisi & footnote: kamus metrik versi berapa? (6) Tanggal data: apakah ini data per tanggal yang benar, bukan data kemarin? (7) Reviewer kedua: minimal satu pasang mata selain penulis.",
        "Cara membaca figur: garis biru = tren normal 8 bulan pertama; titik merah = 4 bulan setelah break; garis putus-putus = momen yang wajib dijelaskan. Interpretasi: break yang dijelaskan = informasi (akuisisi); break yang tidak dijelaskan = bom waktu. Keduanya terlihat sama di chart — bedanya ada di footnote.",
      ],
      figure: {
        svg: FIG_BREAK,
        alt: "Deret total kredit 12 bulan dengan lompatan tajam di bulan ke-9 yang ditandai sebagai break.",
        caption: "Break di bulan 9 (+16,3%): benar secara bisnis (akuisisi), tetapi wajib berpenjelasan di laporan.",
      },
      tasks: [],
      hints: [
        "Intuisi: checklist bukan soal tidak percaya pada diri sendiri — soal mengakui bahwa otak lelah di jam ke-6 lembur. Mesin + checklist = kewaspadaan yang tidak mengenal lelah.",
        "Cek nomor 6 (tanggal data) paling sering gagal: laporan \u201Cper 31 Oktober\u201D yang sebenarnya memakai data 29 Oktober karena job ETL telat.",
      ],
      reference: "7 cek: rekonsiliasi, break, narasi perubahan, konsistensi, definisi, tanggal data, reviewer kedua.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Lineage",
      title: "Register lineage: menjawab 'dari mana?' dalam 1 menit",
      prose: [
        "Pilar 3 (lineage) sering disalahpahami sebagai dokumentasi — padahal ia mesin penjawab. Saat CRO bertanya 'NPL 3,4% ini dari query apa?', jawaban profesional bukan membuka laptop 20 menit, melainkan membuka register: satu baris per angka headline. Lima kolom cukup: angka → tabel sumber, nama query/file, tanggal tarik, pemilik.",
        "Contoh register Bank Artha Dana: NPL → fact_kredit, q_npl_v3.sql, 2026-10-31, Dewi. Coverage → fact_ckpn, q_cov_v2.sql, 2026-10-31, Dewi. LCR → fact_likuiditas, q_lcr_v1.sql, 2026-10-31, Andi. Dengan register ini, pertanyaan 'dari mana?' terjawab dalam 1 menit — standar 'pertahankan angkamu' di RR14.",
        "Musuh register adalah angka yatim (orphan): angka di headline yang tidak ada di register. Setiap angka yatim = angka yang tidak bisa dipertahankan saat ditanya. Aturan keras: tidak ada angka yatim yang boleh naik ke halaman 1. Lab di bawah memindai headline terhadap register dan menahan laporan jika ada yang yatim — persis seperti gerbang Validate di pipeline RR8.",
        "Register ditulis SAAT menarik data, bukan belakangan. Praktiknya: template satu baris di chat tim setiap kali query dijalankan — 'q_npl_v3.sql | fact_kredit | 31 Okt | Dewi'. Butuh 10 detik, menghemat 20 menit per pertanyaan. Lineage yang ditulis belakangan = arkeologi; yang ditulis saat kejadian = administrasi.",
      ],
      tasks: [
        { id: "t1", text: "Temukan angka headline yang tidak ada di `register`" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Angka yatim: ['Top-20'] -> TAHAN, lengkapi register dulu",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Lineage = dokumentasi yang ditulis kalau sempat.” Kalau ditulis belakangan, ia arkeologi — merekonstruksi dari memori yang sudah lapuk. Lineage yang benar ditulis saat query dijalankan: 10 detik per baris, menghemat 20 menit per pertanyaan.",
      },
      hints: [
        "yatim = [m for m in headline if m not in register].",
        "Ekspresi kondisional di print memilih verdict TAHAN/KIRIM.",
      ],
      code: {
        starter: "# Register lineage tim (JANGAN UBAH).\nregister = {\"NPL\": (\"fact_kredit\", \"q_npl_v3.sql\", \"2026-10-31\", \"Dewi\"),\n            \"Coverage\": (\"fact_ckpn\", \"q_cov_v2.sql\", \"2026-10-31\", \"Dewi\"),\n            \"LCR\": (\"fact_likuiditas\", \"q_lcr_v1.sql\", \"2026-10-31\", \"Andi\")}\nheadline = [\"NPL\", \"Coverage\", \"LCR\", \"Top-20\"]\n\n# TULIS KODEMU: temukan angka yatim\nyatim =\n\nprint(f\"Angka yatim: {yatim} -> TAHAN, lengkapi register dulu\" if yatim else \"Semua tertelusur -> KIRIM\")",
        lockLines: 5,
        solution: "# Register lineage tim (JANGAN UBAH).\nregister = {\"NPL\": (\"fact_kredit\", \"q_npl_v3.sql\", \"2026-10-31\", \"Dewi\"),\n            \"Coverage\": (\"fact_ckpn\", \"q_cov_v2.sql\", \"2026-10-31\", \"Dewi\"),\n            \"LCR\": (\"fact_likuiditas\", \"q_lcr_v1.sql\", \"2026-10-31\", \"Andi\")}\nheadline = [\"NPL\", \"Coverage\", \"LCR\", \"Top-20\"]\n\n# TULIS KODEMU: temukan angka yatim\nyatim = [m for m in headline if m not in register]\n\nprint(f\"Angka yatim: {yatim} -> TAHAN, lengkapi register dulu\" if yatim else \"Semua tertelusur -> KIRIM\")",
        checks: [
          { kind: "equal", task: "t1", label: "`yatim` = ['Top-20']", msg: "Hanya Top-20 yang tidak ada di register.", name: "yatim", value: ["Top-20"] },
          { kind: "stdout_matches", task: "t2", label: "Verdict tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Angka yatim: \\['Top-20'\\] -> TAHAN" }
        ],
      },
      reference: "Lima kolom per angka: tabel, query, tanggal tarik, pemilik. Tanpa angka yatim di halaman 1.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Kebasian data",
      title: "Angka punya tanggal kedaluwarsa",
      prose: [
        "Lab pertama membangun register lineage. Lab ini menambahkan pemeriksaan kebasian: tiap metrik punya tanggal terakhir diperbarui, dan umur di atas 7 hari berstatus BASI. NPL berumur 1 hari = segar; Top-20 berumur 46 hari = basi dan wajib cek lineage sebelum dipakai.",
        "Aturan 7 hari bukan universal — untuk metrik harian seperti LCR, basi = > 1 hari; untuk data survei triwulanan, basi = > 100 hari. Prinsipnya: definisikan umur maksimum per metrik di register, lalu biarkan kode yang menilai, bukan firasat analis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung umur tiap metrik dalam hari" },
        { id: "t2", text: "Jalankan dan pastikan status tercetak" },
      ],
      expected: "NPL: 1 hari -> SEGAR\nLCR: 6 hari -> SEGAR\nTop-20: 46 hari -> BASI -> cek lineage",
      note: {
        title: "Segar ≠ benar.",
        type: "pitfall",
        body: "“Datanya kemarin, pasti akurat.” Kebasian hanya soal umur, bukan mutu — data kemarin yang salah input tetap salah. Staleness check menangkap 'terlalu tua', bukan 'salah'. Keduanya perlu diperiksa terpisah.",
      },
      hints: [
        "umur = (hari_ini - tgl).days.",
        "Status: SEGAR bila umur <= 7, selain itu BASI.",
      ],
      code: {
        starter: "from datetime import date\n# Tanggal terakhir update per metrik. JANGAN UBAH.\nhari_ini = date(2026, 10, 31)\nmetrik = {\"NPL\": date(2026,10,30), \"LCR\": date(2026,10,25), \"Top-20\": date(2026,9,15)}\n\n# TULIS KODEMU: umur + status\nfor nama, tgl in metrik.items():\n    umur = \n    status = \"SEGAR\" if umur <= 7 else \"BASI -> cek lineage\"\n    print(f\"{nama}: {umur} hari -> {status}\")",
        lockLines: 4,
        solution: "from datetime import date\n# Tanggal terakhir update per metrik. JANGAN UBAH.\nhari_ini = date(2026, 10, 31)\nmetrik = {\"NPL\": date(2026,10,30), \"LCR\": date(2026,10,25), \"Top-20\": date(2026,9,15)}\n\n# TULIS KODEMU: umur + status\nfor nama, tgl in metrik.items():\n    umur = (hari_ini - tgl).days\n    status = \"SEGAR\" if umur <= 7 else \"BASI -> cek lineage\"\n    print(f\"{nama}: {umur} hari -> {status}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "NPL segar", msg: "NPL berumur 1 hari.", pattern: "NPL: 1 hari -\> SEGAR" },
          { kind: "stdout_matches", task: "t2", label: "Top-20 basi", msg: "Top-20 berumur 46 hari.", pattern: "Top-20: 46 hari -\> BASI -\> cek lineage" }
        ],
      },
      reference: "Tiap metrik punya umur maksimum. Kode yang menilai kebasian, bukan firasat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Menemukan masalah: perbaiki, jelaskan, atau eskalasi?",
      prose: [
        "Satu: selisih rekonsiliasi kecil dan jelas penyebabnya (pembulatan) → catat di footnote, kirim. Dua: break besar dengan penjelasan bisnis valid (akuisisi) → jelaskan di narasi + footnote, kirim. Tiga: angka tidak bisa direkonsiliasi dan pemilik data tidak bisa dihubungi → TAHAN laporan, eskalasi ke atasan; laporan terlambat lebih murah dari laporan salah. Empat: menemukan kesalahan setelah terkirim → koreksi resmi segera + catat di log insiden; menutupi = pelanggaran.",
        "Aturan praktis 10 detik: bisa dijelaskan tertulis → kirim dengan penjelasan. Tidak bisa dijelaskan → tahan dan eskalasi. Sudah terkirim ternyata salah → koreksi resmi, jangan diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Saat angka tidak bisa direkonsiliasi dan pemilik data tidak bisa dihubungi, register-lah yang memberi tahu siapa yang harus ditelepon — kolom 'pemilik' ada justru untuk momen ini. Tanpa register, eskalasi = menebak-nebak.",
      },
      reference: "Jelaskan → kirim. Tidak jelas → tahan. Terlanjur salah → koreksi resmi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "LCR yang berubah tanpa alasan",
      prose: [
        "Laporan likuiditas: LCR 135% bulan lalu, 118% bulan ini — turun 17 pp. Tidak ada penarikan besar, tidak ada perubahan portofolio HQLA yang signifikan. Analis junior menulis narasi \u201Clikuiditas menurun.\u201D Kamu menjalankan pilar QA: rekonsiliasi komponen HQLA vs daftar aset = cocok. Break detection = ya, ini break. Lineage: query HQLA bulan ini memakai daftar aset versi baru dari tim kepatuhan — obligasi korporasi rating A+ dikeluarkan dari HQLA.",
        "Pertanyaan: apa yang kamu tulis di laporan? Pembahasan: bukan \u201Clikuiditas menurun\u201D — melainkan \u201CLCR turun 17 pp ke 118% karena perubahan daftar HQLA (obligasi korporasi A+ dikeluarkan per ketentuan baru); likuiditas aktual tidak berubah.\u201D Tanpa QA, komite akan membahas \u201Cmasalah likuiditas\u201D yang tidak ada. Dengan QA, satu kalimat footnote menghemat satu jam rapat yang salah arah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Narasi yang salah (\u201Clikuiditas menurun\u201D) bisa memicu keputusan salah: menahan ekspansi, menaikkan biaya dana. Biaya QA yang dilewatkan bukan cuma malu — tapi keputusan bisnis yang salah arah.",
      },
      reference: "Break + lineage = penyebab. Tulis penyebabnya, bukan gejalanya.",
    },
    {
      id: "sql-laporan-agregasi",
      eyebrow: "Langkah 7 · SQL agregasi",
      title: "SQL agregasi untuk laporan risiko",
      prose: [
        "Hampir semua angka di laporan risiko lahir dari pola query yang sama: agregasi per dimensi dengan filter tanggal potong. `SELECT segmen, SUM(baki_debet) FROM fact_kredit WHERE tanggal_data = '2026-10-31' GROUP BY segmen`. Tiga komponen yang wajib benar: dimensi GROUP BY-nya (segmen? produk? cabang?), filter tanggalnya (data per tanggal berapa — bukan tanggal kemarin?), dan fungsi agregasinya (SUM untuk total, COUNT untuk jumlah, AVG untuk rata-rata).",
        "`CASE WHEN` adalah alat bucketing di dalam query: memetakan hari keterlambatan menjadi Kol 1–5 langsung di SQL, bukan di Excel. `SUM(CASE WHEN hari_tunggakan BETWEEN 91 AND 120 THEN baki_debet ELSE 0 END)` = total Kol 3. Keuntungannya: definisi bucket tertulis di satu tempat (query), bukan tersebar di dua belas spreadsheet dengan rumus yang sedikit berbeda.",
        "Jebakan paling mahal: double counting dari join satu-ke-banyak. Debitur di-join ke tabel fasilitas (satu debitur, tiga fasilitas), lalu kamu `SUM(plafon)` — hasilnya tiga kali lipat untuk debitur itu. Aturannya: agregasikan dulu di level yang benar (pre-aggregate per debitur), baru join — atau pakai `COUNT(DISTINCT id_debitur)`. Setiap SUM yang ditulis setelah join ke tabel berelasi satu-ke-banyak patut dicurigai.",
        "💡 Intuisi: query adalah pertanyaan, database adalah penjawab yang terlalu patuh. Ia tidak akan bertanya balik 'maksud Anda plafon per debitur atau per fasilitas?' — ia menjawab persis yang kamu tulis, termasuk yang tidak kamu maksud. Menulis query laporan = merumuskan pertanyaan dengan presisi kontrak, bukan percakapan.",
        "Jebakan kedua: baris duplikat di tabel staging — persis kasus Rp15 miliar di awal lesson ini: satu file diunggah dua kali, SUM ikut dobel. Dedup sebelum agregasi (kunci unik per baris sumber), lalu tutup dengan angka kontrol: total hasil agregasi HARUS sama dengan total sumber. Selisih bukan nol = laporan tidak boleh keluar. Ini pilar rekonsiliasi (Langkah 2) yang dieksekusi di level query.",
      ],
      tasks: [
        { id: "t1", text: "Tulis CASE WHEN yang memetakan hari keterlambatan ke Kol 1–5 (batas: 1–90, 91–120, 121–180, >180)" },
        { id: "t2", text: "Sebutkan 2 cara menghindari double counting dari join satu-ke-banyak" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Angka dari database pasti benar.” Database tidak berbohong — ia hanya menjawab pertanyaan yang diajukan, termasuk pertanyaan yang salah. Double counting, filter tanggal yang keliru, dan baris duplikat semuanya menghasilkan angka yang salah dengan penuh percaya diri. QA query = membaca ulang pertanyaan yang kamu ajukan.",
      },
      reference: "GROUP BY + filter tanggal potong + CASE WHEN; curigai setiap SUM setelah join satu-ke-banyak; dedup dulu; tutup dengan angka kontrol.",
    },
    {
      id: "sql-laporan-window",
      eyebrow: "Langkah 8 · Window function",
      title: "Window function untuk tren & peringkat",
      prose: [
        "Agregasi menjawab 'berapa sekarang', tetapi laporan risiko juga harus menjawab 'ke mana arahnya' dan 'siapa paling buruk'. Untuk itu ada window function: `LAG(npl) OVER (PARTITION BY cabang ORDER BY bulan)` mengambil nilai bulan lalu dari baris yang sama — tanpa join ke diri sendiri. `AVG(npl) OVER (PARTITION BY cabang ORDER BY bulan ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` = rata-rata bergerak 3 bulan.",
        "Tiga pola yang menutupi 90% kebutuhan pelaporan: (1) LAG/LEAD untuk perubahan periode-ke-periode — deteksi break (Langkah 2) dalam satu query; (2) rata-rata bergerak untuk menghaluskan fluktuasi bulanan agar tren terlihat; (3) RANK/DENSE_RANK untuk peringkat — `RANK() OVER (PARTITION BY bulan ORDER BY npl DESC)` memberi tahu cabang mana yang NPL-nya tertinggi bulan ini.",
        "Cara menjalankannya secara mental di atas tabel kecil: ambil Jakarta B3 (NPL 2,0%). LAG-nya = B2 = 2,2%, jadi perubahannya −0,2 pp. Rata-rata bergerak 3 bulan di B5 = (2,0 + 2,4 + 2,6)/3 = 2,33%. Kalau kamu bisa menghitungnya di atas kertas untuk enam baris, kamu bisa membaca query window function sepanjang apa pun.",
        "💡 Intuisi: `GROUP BY` meremas banyak baris menjadi satu — informasinya hilang. Window function justru sebaliknya: ia 'melihat ke kiri dan ke kanan' (baris sebelum/sesudah) sambil membiarkan setiap baris tetap ada, lalu menambahkan kolom baru. Agregasi = meringkas; window = memperkaya.",
        "Dua jebakan: pertama, `ORDER BY` di dalam `OVER` adalah wajib — tanpa urutan yang jelas, 'bulan lalu' menurut LAG bisa jadi bulan yang acak. Kedua, jendela yang salah memberi tren yang salah: rata-rata bergerak 3 bulan vs 12 bulan bisa bercerita berlawanan. Dan RANK melompat nomor (1, 2, 2, 4) sedangkan DENSE_RANK rapat (1, 2, 2, 3) — pilih yang definisinya disepakati tim.",
        "Lab di bawah mensimulasikan logika window function dengan Python murni — karena lab ini berjalan di Python, bukan di database SQL. Pola logikanya identik: LAG = `x[i-1]`, AVG OVER = rata-rata irisan baris, dan hasilnya dicetak sebagai tabel persis seperti output query. Kuasai polanya di sini, terjemahkan ke SQL di pekerjaan nyata.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `mom` (perubahan MoM ala LAG) dan `ma3` (rata-rata bergerak 3 bulan ala AVG OVER)" },
        { id: "t2", text: "Jalankan dan baca tabel hasilnya" },
      ],
      expected: "Bulan | NPL% | dMoM(pp) | MA-3\nB3 | 2.0 | -0.2 | 2.10\nB4 | 2.4 | +0.4 | 2.20\nB5 | 2.6 | +0.2 | 2.33\nB6 | 2.5 | -0.1 | 2.50",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“LAG selalu memberi bulan lalu yang benar.” LAG memberi baris sebelumnya menurut ORDER BY yang kamu tulis — salah urutan, salah tetangga. Dan jendela yang salah (3 vs 12 bulan) menghasilkan tren yang salah. Window function yang tidak kamu pahami = angka yang tidak bisa kamu pertahankan.",
      },
      hints: [
        "mom = [None] + [round(x[i] - x[i-1], 1) for i in range(1, len(x))] — None untuk bulan pertama (tidak ada bulan lalu).",
        "ma3 = [None, None] + [sum(x[i-2:i+1])/3 for i in range(2, len(x))] — None untuk dua bulan pertama.",
        "Format {mom[i]:+.1f} menampilkan tanda + untuk kenaikan.",
      ],
      code: {
        starter: `# Data NPL bulanan per cabang (%). JANGAN UBAH baris ini.
npl = {"Jakarta": [2.1, 2.2, 2.0, 2.4, 2.6, 2.5],
       "Bandung": [3.0, 3.1, 3.4, 3.2, 3.0, 3.3],
       "Surabaya": [1.8, 1.9, 1.7, 1.6, 1.8, 1.7]}
cabang = "Jakarta"
x = npl[cabang]

# TULIS KODEMU: perubahan MoM ala LAG (selisih pp vs bulan lalu)
mom =

# TULIS KODEMU: rata-rata bergerak 3 bulan ala AVG OVER (ROWS 2 PRECEDING)
ma3 =

print("Bulan | NPL% | dMoM(pp) | MA-3")
for i in range(2, 6):
    print(f"B{i+1} | {x[i]:.1f} | {mom[i]:+.1f} | {ma3[i]:.2f}")`,
        lockLines: 6,
        solution: `# Data NPL bulanan per cabang (%). JANGAN UBAH baris ini.
npl = {"Jakarta": [2.1, 2.2, 2.0, 2.4, 2.6, 2.5],
       "Bandung": [3.0, 3.1, 3.4, 3.2, 3.0, 3.3],
       "Surabaya": [1.8, 1.9, 1.7, 1.6, 1.8, 1.7]}
cabang = "Jakarta"
x = npl[cabang]

# TULIS KODEMU: perubahan MoM ala LAG (selisih pp vs bulan lalu)
mom = [None] + [round(x[i] - x[i-1], 1) for i in range(1, len(x))]

# TULIS KODEMU: rata-rata bergerak 3 bulan ala AVG OVER (ROWS 2 PRECEDING)
ma3 = [None, None] + [sum(x[i-2:i+1])/3 for i in range(2, len(x))]

print("Bulan | NPL% | dMoM(pp) | MA-3")
for i in range(2, 6):
    print(f"B{i+1} | {x[i]:.1f} | {mom[i]:+.1f} | {ma3[i]:.2f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "mom", label: "`mom` terdefinisi", msg: "Isi list perubahan MoM ala LAG." },
          { kind: "equal", task: "t1", name: "mom", value: [null, 0.1, -0.2, 0.4, 0.2, -0.1], label: "`mom` benar", msg: "Bulan pertama None; sisanya selisih pp dibulatkan 1 desimal: [None, 0.1, -0.2, 0.4, 0.2, -0.1]." },
          { kind: "defined", task: "t1", name: "ma3", label: "`ma3` terdefinisi", msg: "Isi list rata-rata bergerak 3 bulan ala AVG OVER." },
          { kind: "stdout_matches", task: "t2", pattern: "B5 \\| 2.6 \\| \\+0.2 \\| 2.33", label: "Baris B5 tercetak benar", msg: "B5: NPL 2.6, MoM +0.2 pp, MA-3 2.33." },
        ],
      },
      reference: "LAG = x[i-1] (ORDER BY wajib); AVG OVER jendela baris; RANK vs DENSE_RANK; simulasikan di tabel kecil dulu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Ingat: QA = kebiasaan, bukan bakat.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "QA bukan bakat, melainkan kebiasaan yang bisa dikodekan: rekonsiliasi + deteksi break + register lineage = tiga gerbang yang menangkap kasus Rp15 miliar sebelum OJK yang menemukannya.",
      },

      summary: [
        "Tiga pilar QA: rekonsiliasi, deteksi break, lineage.",
        "Rekonsiliasi = total harus sama dengan jumlah segmen; berupa kode, bukan tatapan.",
        "Break = selidiki dan jelaskan tertulis, bukan hapus.",
        "Checklist 7 item sebelum kirim; tanggal data paling sering gagal.",
        "Tidak bisa dijelaskan → tahan & eskalasi; terlanjur salah → koreksi resmi.",
      ],
      next: { label: "RR5 — Visualisasi untuk Komite", href: "/v2/learn/rr5-visualisasi" },
      quiz: [
        {
          q: "Mengapa kasus Rp15 miliar lolos tiga lapis review manusia?",
          options: [
            { text: "Reviewer tidak kompeten", why: "Tidak — trennya memang terlihat wajar. Masalahnya metode, bukan orang." },
            { text: "Mata manusia buruk menjumlahkan; tidak ada rekonsiliasi otomatis", why: "Tepat. Double-upload hanya tertangkap oleh penjumlahan ulang mesin.", correct: true },
            { text: "Datanya terlalu sedikit", why: "Data cukup — pemeriksaannya yang tidak ada." },
          ],
        },
        {
          q: "Total tumbuh 0,5%/bulan lalu +16,3% dalam sebulan. Tindakan QA yang benar?",
          options: [
            { text: "Hapus bulan itu agar tren mulus", why: "Menghapus data = memalsukan laporan." },
            { text: "Tandai sebagai break, selidiki, tulis penjelasannya di laporan", why: "Benar. Break bisa valid (akuisisi) — yang wajib adalah penjelasannya.", correct: true },
            { text: "Abaikan karena totalnya cocok dengan segmen", why: "Rekonsiliasi lolos tidak membatalkan keanehan tren." },
          ],
        },
        {
          q: "Apa itu lineage dalam QA laporan?",
          options: [
            { text: "Silsilah keluarga pemilik data", why: "Bukan — ini istilah teknis, bukan silsilah." },
            { text: "Kemampuan menelusur tiap angka ke sumber, query, dan tanggal tariknya", why: "Tepat. Tanpa lineage, angka yang dipertanyakan tidak bisa dipertahankan.", correct: true },
            { text: "Garis tren pada chart", why: "Itu trendline — berbeda dengan lineage." },
          ],
        },
        {
          q: "Angka tidak bisa direkonsiliasi dan pemilik data tidak bisa dihubungi. Apa yang dilakukan?",
          options: [
            { text: "Kirim saja, nanti dikoreksi", why: "Laporan salah yang terkirim = teguran regulator + koreksi resmi yang memalukan." },
            { text: "Tahan laporan dan eskalasi ke atasan", why: "Benar. Terlambat lebih murah daripada salah.", correct: true },
            { text: "Tebak angka yang paling masuk akal", why: "Menebak angka laporan = memalsukan laporan." },
          ],
        },
        {
          q: "LCR turun 17 pp karena daftar HQLA berubah (bukan likuiditas aktual). Narasi yang jujur?",
          options: [
            { text: "\u201CLikuiditas menurun\u201D", why: "Menyesatkan — likuiditas aktual tidak berubah, definisinya yang berubah." },
            { text: "\u201CLCR turun 17 pp ke 118% karena perubahan daftar HQLA; likuiditas aktual tidak berubah\u201D", why: "Benar. Tulis penyebabnya, bukan gejalanya.", correct: true },
          ],
        },
      ],
    },
  ],
};
