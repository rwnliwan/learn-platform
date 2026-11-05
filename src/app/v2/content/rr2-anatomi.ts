import type { V2Lesson } from "../lib/types";

// Anatomi laporan: enam lapis dengan porsi usaha vs porsi baca.
const FIG_ANATOMI = `<svg viewBox=\"0 0 480 320\" role=\"img\" aria-label=\"Enam lapis struktur laporan risiko dari headline sampai lampiran.\">
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<g><rect x=\"60\" y=\"16\" width=\"360\" height=\"40\" fill=\"var(--c1)\" opacity=\"0.9\"/><text x=\"240\" y=\"34\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">1 · Headline eksekutif</text><text x=\"240\" y=\"50\" font-size=\"11\" fill=\"#fff\">3 angka + 1 kalimat keputusan</text></g>
<g><rect x=\"60\" y=\"64\" width=\"360\" height=\"40\" fill=\"var(--c2)\" opacity=\"0.9\"/><text x=\"240\" y=\"82\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">2 · Konteks</text><text x=\"240\" y=\"98\" font-size=\"11\" fill=\"#fff\">kenapa angka ini muncul sekarang</text></g>
<g><rect x=\"60\" y=\"112\" width=\"360\" height=\"40\" fill=\"var(--c3)\" opacity=\"0.9\"/><text x=\"240\" y=\"130\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">3 · Temuan</text><text x=\"240\" y=\"146\" font-size=\"11\" fill=\"#fff\">apa yang berubah &amp; seberapa penting</text></g>
<g><rect x=\"60\" y=\"160\" width=\"360\" height=\"40\" fill=\"var(--c4)\" opacity=\"0.9\"/><text x=\"240\" y=\"178\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">4 · Data pendukung</text><text x=\"240\" y=\"194\" font-size=\"11\" fill=\"#fff\">tabel &amp; chart secukupnya</text></g>
<g><rect x=\"60\" y=\"208\" width=\"360\" height=\"40\" fill=\"var(--c5)\" opacity=\"0.9\"/><text x=\"240\" y=\"226\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">5 · Rekomendasi</text><text x=\"240\" y=\"242\" font-size=\"11\" fill=\"#fff\">kalimat perintah + pemilik + tenggat</text></g>
<g><rect x=\"60\" y=\"256\" width=\"360\" height=\"40\" fill=\"var(--c6)\" opacity=\"0.9\"/><text x=\"240\" y=\"274\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">6 · Lampiran</text><text x=\"240\" y=\"290\" font-size=\"11\" fill=\"#fff\">metodologi, definisi, data mentah</text></g>
</g>
<line x1=\"440\" y1=\"16\" x2=\"440\" y2=\"120\" stroke=\"var(--chart-text)\" stroke-width=\"2\"/>
<text x=\"446\" y=\"70\" font-size=\"11\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" transform=\"rotate(90 446 70)\" text-anchor=\"middle\">dibaca direksi</text>
</svg>`;

export const rr2: V2Lesson = {
  slug: "rr2-anatomi",
  track: "Risk Reporting",
  module: "Fondasi Pelaporan",
  title: "RR2 — Anatomi Laporan Risiko yang Baik",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "40 halaman yang dilewati, 1 halaman yang dibaca",
      prose: [
        "Dua analis diminta melaporkan kenaikan NPL segmen SME. Analis A menulis 40 halaman: metodologi lengkap, 18 tabel, 12 grafik, riwayat regulasi. Analis B menulis 1 halaman: tiga angka, dua paragraf, satu rekomendasi. Komite risiko membaca keduanya — atau tepatnya, membaca halaman 1 milik B, lalu memakai 40 halaman milik A sebagai \u201Cbukti pendukung\u201D saat regulator bertanya.",
        "Twist-nya: Analis A merasa karyanya \u201Clebih serius\u201D dan tersinggung. Padahal keputusannya — menurunkan limit SME Rp50 miliar — lahir dari 1 halaman milik B. Pelajaran pahit tapi penting: nilai laporan tidak diukur dari tebalnya, melainkan dari keputusan yang ia hasilkan. 40 halaman yang tidak dibaca = 0 keputusan. 1 halaman yang dibaca = 1 keputusan.",
        "Lesson ini membedah anatomi laporan yang bekerja: enam lapis dari headline sampai lampiran, masing-masing dengan satu pekerjaan. Setelah lesson ini kamu bisa: (1) menyusun enam lapis laporan; (2) menilai status tiap metrik terhadap batasnya; (3) menulis rekomendasi sebagai kalimat perintah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan 40 halaman tanpa rekomendasi tegas = komite menunda keputusan = risiko berjalan tanpa rem. Kelambanan keputusan adalah risiko itu sendiri; laporan yang baik mempercepat keputusan, bukan menundanya.",
      },
      reference: "Tebal ≠ serius. Keputusan = ukuran nilai laporan.",
    },
    {
      id: "struktur",
      eyebrow: "Langkah 2 · Struktur",
      title: "Enam lapis, enam pekerjaan",
      prose: [
        "Lapis 1 — Headline eksekutif: tiga angka + satu kalimat \u201Cjadi apa?\u201D. Ini satu-satunya bagian yang pasti dibaca direksi. Lapis 2 — Konteks: kenapa angka ini muncul sekarang (musim, kebijakan baru, kejadian pasar). Tanpa konteks, angka = trivia. Lapis 3 — Temuan: apa yang berubah, seberapa besar, apakah ini pola atau noise.",
        "Lapis 4 — Data pendukung: tabel dan chart secukupnya, masing-masing dengan satu pesan. Lapis 5 — Rekomendasi: kalimat perintah (\u201Cturunkan limit SME Rp50 miliar sebelum 30 November\u201D), bukan saran mengambang. Lapis 6 — Lampiran: metodologi, definisi, data mentah — untuk CRO dan regulator yang ingin memverifikasi.",
        "Cara membaca figur: enam balok berurutan = urutan baca; garis di kanan menandai dua lapis teratas sebagai wilayah direksi. Interpretasi: 80% usahamu seharusnya terkonsentrasi di dua lapis teratas, karena di sanalah keputusan lahir. Lampiran penting untuk audit, tetapi tidak ada keputusan yang lahir dari lampiran.",
      ],
      figure: {
        svg: FIG_ANATOMI,
        alt: "Enam lapis struktur laporan risiko dari headline sampai lampiran.",
        caption: "Enam lapis laporan. Dua teratas dibaca direksi; sisanya dibaca komite, CRO, dan regulator.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CExecutive summary = ringkasan semua halaman.\u201D Bukan. Executive summary = jawaban atas tiga pertanyaan: apa yang terjadi, kenapa penting, apa yang harus dilakukan. Ringkasan 40 halaman tetap 40 halaman dalam versi pendek — tidak ada yang membacanya juga.",
      },
      hints: [
        "Intuisi: tulis lapis 1 dan 5 DULU (headline + rekomendasi), baru lengkapi sisanya. Jika rekomendasi belum jelas, analisismu belum selesai.",
        "Satu chart = satu pesan. Chart yang butuh tiga kalimat penjelasan = dua chart yang digabung paksa.",
      ],
      reference: "Urutan tulis: headline → rekomendasi → sisanya. Urutan baca: atas ke bawah.",
    },
    {
      id: "lab-status",
      eyebrow: "Langkah 3 · Lab",
      title: "Mesin penilai status: aman atau waspada?",
      prose: [
        "Headline yang baik tidak sekadar menyebut angka — ia menilai angka terhadap batas. NPL 3,4% itu netral sampai kamu tahu batas internalnya 3,0%: tiba-tiba ia menjadi \u201CWASPADA\u201D. Lab ini membangun penilai otomatis: tiap metrik dibandingkan dengan batasnya, menghasilkan status AMAN atau WASPADA.",
        "Rumus di bawah mengukur jarak ke batas (gap). Tanda gap memberi tahu arah: untuk metrik \u201Csemakin kecil semakin baik\u201D (NPL), gap positif = waspada. Untuk \u201Csemakin besar semakin baik\u201D (LCR, coverage), gap negatif = waspada.",
      ],
      formula: String.raw`\text{Gap} = \text{Aktual} - \text{Batas}`,
      formulaNote: "Aktual = nilai metrik bulan ini, Batas = ambang internal. Contoh NPL: 3,4 − 3,0 = +0,4 pp → melewati batas → WASPADA. Contoh LCR: 135 − 100 = +35 pp → di atas batas minimum → AMAN.",
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `status` dan loop pencetak" },
        { id: "t2", text: "Jalankan: pastikan 4 baris status tercetak" },
      ],
      expected: "NPL 3.4 vs batas 3.0 -> WASPADA (gap +0.4)\nCoverage 72 vs batas 80 -> WASPADA (gap -8.0)\nLCR 135 vs batas 100 -> AMAN (gap +35.0)\nTop-20 45 vs batas 40 -> WASPADA (gap +5.0)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CAngka tanpa pembanding = informasi.\u201D Bukan — itu dekorasi. \u201CNPL 3,4%\u201D tidak memberi tahu apa-apa; \u201CNPL 3,4%, di atas batas 3,0%\u201D memberi tahu keputusan. Setiap angka di headline wajib ditemani batas atau periode pembandingnya.",
      },
      hints: [
        "arah '<=' artinya semakin kecil semakin baik: aman jika aktual <= batas.",
        "gap = aktual - batas; tampilkan dengan {gap:+.1f} agar tandanya selalu muncul.",
      ],
      code: {
        starter: `# (nama, aktual, batas, arah): '<=' = semakin kecil semakin baik\nmetrik = [("NPL", 3.4, 3.0, "<="), ("Coverage", 72, 80, ">="),\n          ("LCR", 135, 100, ">="), ("Top-20", 45, 40, "<=")]\n\n# TULIS KODEMU: lengkapi fungsi status\ndef status(aktual, batas, arah):\n    return\n\nfor nama, aktual, batas, arah in metrik:\n    st = \n    gap = \n    print(f"{nama} {aktual} vs batas {batas} -> {st} (gap {gap:+.1f})")`,
        lockLines: 3,
        solution: `# (nama, aktual, batas, arah): '<=' = semakin kecil semakin baik\nmetrik = [("NPL", 3.4, 3.0, "<="), ("Coverage", 72, 80, ">="),\n          ("LCR", 135, 100, ">="), ("Top-20", 45, 40, "<=")]\n\n# TULIS KODEMU: lengkapi fungsi status\ndef status(aktual, batas, arah):\n    ok = (aktual <= batas) if arah == "<=" else (aktual >= batas)\n    return "AMAN" if ok else "WASPADA"\n\nfor nama, aktual, batas, arah in metrik:\n    st = status(aktual, batas, arah)\n    gap = aktual - batas\n    print(f"{nama} {aktual} vs batas {batas} -> {st} (gap {gap:+.1f})")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "NPL 3\\.4 vs batas 3\\.0 -> WASPADA", label: "NPL = WASPADA", msg: "3.4 > batas 3.0 dengan arah '<=' → WASPADA." },
          { kind: "stdout_matches", task: "t2", pattern: "Coverage 72 vs batas 80 -> WASPADA", label: "Coverage = WASPADA", msg: "72 < batas 80 dengan arah '>=' → WASPADA." },
          { kind: "stdout_matches", task: "t2", pattern: "LCR 135 vs batas 100 -> AMAN", label: "LCR = AMAN", msg: "135 >= batas 100 → AMAN." },
          { kind: "stdout_matches", task: "t2", pattern: "Top-20 45 vs batas 40 -> WASPADA", label: "Top-20 = WASPADA", msg: "45 > batas 40 → WASPADA." },
        ],
      },
      reference: "Setiap angka headline = nilai + batas + status. Fungsi kecil ini bisa dipakai tiap bulan.",
    },
    {
      id: "rekomendasi",
      eyebrow: "Langkah 4 · Rekomendasi",
      title: "Rekomendasi adalah kalimat perintah",
      prose: [
        "Bandingkan: (a) \u201CKonsentrasi top-20 perlu mendapat perhatian.\u201D vs (b) \u201CBekukan penambahan eksposur ke 20 debitur terbesar sampai rasio turun di bawah 40%, pemilik: Kepala Divisi Korporasi, tenggat 30 November.\u201D Kalimat (a) menghasilkan rapat. Kalimat (b) menghasilkan tindakan. Rekomendasi yang baik punya tiga komponen: tindakan spesifik, pemilik bernama, tenggat tanggal.",
        "Uji kejujuran: jika rekomendasimu bisa ditempel ke laporan mana pun tanpa terlihat salah (\u201Cperlu perhatian\u201D, \u201Ctingkatkan kewaspadaan\u201D), ia bukan rekomendasi — ia basa-basi. Rekomendasi sejati selalu spesifik pada situasi bulan ini dan berisiko salah. Itulah gunanya analis: berpendapat, bukan merangkum.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CAnalis tidak boleh berpendapat, cukup sajikan data.\u201D Salah kaprah yang mahal. Direksi membayar analis untuk pendapat yang bisa dipertanggungjawabkan, bukan untuk menjadi mesin fotokopi tabel. Data tanpa rekomendasi = menyerahkan keputusan pada orang yang paling sedikit memahami datanya.",
      },
      hints: [
        "Intuisi: baca rekomendasimu lalu tanya \u201Csiapa mengerjakan apa sebelum kapan?\u201D — jika tidak terjawab, tulis ulang.",
        "Satu laporan = 1–3 rekomendasi. Tujuh rekomendasi = tidak ada prioritas = tidak ada yang dikerjakan.",
      ],
      reference: "Rekomendasi = tindakan + pemilik + tenggat. Maksimal 3 per laporan.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Satu sumber",
      title: "Tiga lapis, satu dict: tanpa copy-paste",
      prose: [
        "Analis B (1 halaman) dan Analis A (40 halaman) di cerita pembuka sebenarnya sama-sama benar — tetapi di bank nyata, keduanya sering bekerja dari file Excel yang berbeda. Akibatnya: NPL di halaman 1 tertulis 3,4%, di lampiran 3,5%. Satu sumber, tiga file = tiga versi kebenaran. Praktik profesional: satu struktur data, tiga fungsi penyajian.",
        "Pola kodenya sederhana: simpan semua metrik dalam satu dict `data`, lalu tulis fungsi `ringkas(data, level)`. Level 'direksi' menghasilkan 1 baris; 'komite' 5 baris; 'cros' mengembalikan dict penuh. Tidak ada angka yang diketik ulang — setiap lapis membaca dari dict yang sama. Ketika data direvisi, semua lapis ikut berubah bersama, dan tidak ada yang tertinggal.",
        "Setiap artefak wajib mencantumkan cap versi: tanggal tarik data + hash singkat. Contoh: 'NPL 3,4% (data per 31 Okt, v2026-10-31-a3f9)'. Jika direksi bertanya 'angka ini dari data kapan?', jawabannya tercetak di laporan — bukan diingat-ingat analisnya. Cap versi juga menyelamatkanmu saat dua rapat membahas 'laporan Oktober' yang ternyata dari tarikan data berbeda.",
        "Lab di bawah membangun pemeriksa konsistensi: bandingkan dict headline dengan dict detail, laporkan metrik mana yang nilainya beda. Di data contoh, Coverage tercatat 72,0 di headline tetapi 72,5 di detail — selisih 0,5 pp yang cukup untuk mengubah status AMAN menjadi WASPADA. Pemeriksa seperti ini dijalankan otomatis sebelum kirim, sebagai gerbang terakhir RR8.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `cek` yang mengembalikan list metrik yang beda" },
        { id: "t2", text: "Jalankan dan pastikan temuannya tercetak" },
      ],
      expected: "Metrik tidak konsisten: ['Coverage']",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Lampiran = tempat membuang analisis yang belum selesai.” Lampiran yang tidak dibaca siapa pun tetap harus konsisten — regulator membaca lampiran justru untuk mencari inkonsistensi. Satu angka beda = seluruh laporan dipertanyakan.",
      },
      hints: [
        "Bandingkan tiap kunci: a[k] != b.get(k).",
        "List comprehension mengembalikan daftar kunci yang beda.",
      ],
      code: {
        starter: "# Angka dari SATU sumber (Rp %, JANGAN UBAH).\nheadline = {\"NPL\": 3.4, \"Coverage\": 72.0, \"LCR\": 135.0}\ndetail = {\"NPL\": 3.4, \"Coverage\": 72.5, \"LCR\": 135.0}\n\n# TULIS KODEMU: temukan metrik yang beda nilai\ndef cek(a, b):\n    return\n\nbeda = cek(headline, detail)\nprint(f\"Metrik tidak konsisten: {beda}\")",
        lockLines: 3,
        solution: "# Angka dari SATU sumber (Rp %, JANGAN UBAH).\nheadline = {\"NPL\": 3.4, \"Coverage\": 72.0, \"LCR\": 135.0}\ndetail = {\"NPL\": 3.4, \"Coverage\": 72.5, \"LCR\": 135.0}\n\n# TULIS KODEMU: temukan metrik yang beda nilai\ndef cek(a, b):\n    return [k for k in a if a[k] != b.get(k)]\n\nbeda = cek(headline, detail)\nprint(f\"Metrik tidak konsisten: {beda}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`beda` = ['Coverage']", msg: "Hanya Coverage yang beda (72,0 vs 72,5).", name: "beda", value: ["Coverage"] },
          { kind: "stdout_matches", task: "t2", label: "Temuan tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Metrik tidak konsisten: \\['Coverage'\\]" }
        ],
      },
      reference: "Satu dict, tiga lapis. Beda satu angka antar lapis = krisis kepercayaan.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Cap versi",
      title: "Stempel setiap angka",
      prose: [
        "Lab pertama menegakkan satu sumber lewat satu dict. Lab ini menambahkan cap versi otomatis: tanggal tarik data + hash MD5 singkat dari isi dict. Hash berubah setiap ada angka yang berubah — sehingga dua laporan dengan cap berbeda pasti dari data berbeda, dan dua laporan dengan cap sama pasti konsisten.",
        "Contoh: NPL 3,4% dicap 'data per 2026-10-31, v2026-10-31-xxxx'. Ketika direksi bertanya 'angka ini dari tarikan kapan?', jawabannya tercetak di samping angka. Praktik ini murah (4 baris kode) tetapi mengakhiri seluruh kelas perdebatan 'laporan Oktober yang mana'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung hash MD5 4 karakter dari isi dict" },
        { id: "t2", text: "Jalankan dan pastikan cap tercetak" },
      ],
      expected: "NPL 3.4% (data per 2026-10-31, v2026-10-31-b028)",
      note: {
        title: "Cap ≠ kebenaran.",
        type: "pitfall",
        body: "“Sudah ada cap versi, berarti angkanya benar.” Cap versi menjamin konsistensi antar lapis, bukan kebenaran terhadap realitas. Angka yang salah tetapi konsisten tetap salah — ia hanya salah secara seragam.",
      },
      hints: [
        "hashlib.md5(str(sorted(angka.items())).encode()).hexdigest()[:4].",
        "f-string menggabungkan tanggal, versi, dan hash.",
      ],
      code: {
        starter: "import hashlib\n# Data + tanggal tarik. JANGAN UBAH.\nangka = {\"NPL\": 3.4, \"Coverage\": 72.0}\ntanggal = \"2026-10-31\"\n\n# TULIS KODEMU: hash 4 karakter dari isi dict\nsidik = \nprint(f\"NPL {angka['NPL']}% (data per {tanggal}, v{tanggal}-{sidik})\")",
        lockLines: 4,
        solution: "import hashlib\n# Data + tanggal tarik. JANGAN UBAH.\nangka = {\"NPL\": 3.4, \"Coverage\": 72.0}\ntanggal = \"2026-10-31\"\n\n# TULIS KODEMU: hash 4 karakter dari isi dict\nsidik = hashlib.md5(str(sorted(angka.items())).encode()).hexdigest()[:4]\nprint(f\"NPL {angka['NPL']}% (data per {tanggal}, v{tanggal}-{sidik})\")",
        checks: [
          { kind: "equal", task: "t1", label: "`sidik` 4 karakter", msg: "Hash MD5 dipotong 4 karakter pertama.", name: "sidik", value: "b028" },
          { kind: "stdout_matches", task: "t2", label: "Cap tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "v2026-10-31-" }
        ],
      },
      reference: "Cap = tanggal tarik + hash isi. Beda cap = beda data; cap sama = konsisten.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Seberapa panjang laporanmu?",
      prose: [
        "Satu: update rutin tanpa kejadian luar biasa → 1 halaman eksekutif saja; jangan mengarang temuan agar terlihat sibuk. Dua: ada temuan material (batas terlampaui) → 5–10 halaman: temuan + konteks + rekomendasi. Tiga: keputusan besar (limit, kebijakan) → 10–20 halaman + lampiran metodologi, karena akan diaudit. Empat: diminta regulator → ikuti format baku mereka, bukan format favoritmu.",
        "Aturan praktis 10 detik: panjang laporan ∝ besar keputusan × kontroversi temuan. Keputusan kecil + temuan rutin = pendek. Keputusan besar atau temuan yang akan diperdebatkan = panjang + lampiran bukti. Menulis 20 halaman untuk update rutin = melatih pembaca melewatkan laporanmu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Tulis lapis 1 (headline) dan lapis 5 (rekomendasi) DULU sebelum menyentuh lapis lain — keduanya dibaca dari dict yang sama, jadi tidak ada risiko angka beda. Lapis 2–4 adalah elaborasi, bukan dokumen terpisah.",
      },
      reference: "Panjang ∝ keputusan × kontroversi. Rutin = pendek; besar/debat = panjang + bukti.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Dari 40 halaman ke 1 halaman",
      prose: [
        "Analis A menulis: \u201CSegmen SME mencatat NPL 4,1% pada Oktober, meningkat 0,6 pp dari September (3,5%) dan berada di atas rata-rata 12 bulan sebesar 3,4%. Kenaikan terutama didorong sub-segmen perdagangan (5,2%) dan jasa (4,4%), sementara manufaktur relatif stabil di 3,1%. Coverage ratio segmen tercatat 68%, menurun dari 74% pada kuartal sebelumnya...\u201D (berlanjut 3 paragraf).",
        "Tugas: kompres menjadi headline 3 baris + 1 rekomendasi. Pembahasan: Baris 1 — \u201CNPL SME 4,1% (+0,6 pp), tertinggi 12 bulan.\u201D Baris 2 — \u201CPemicu: perdagangan 5,2% dan jasa 4,4%; coverage turun ke 68%.\u201D Baris 3 — \u201CRekomendasi: bekukan limit baru sub-segmen perdagangan sampai NPL < 4%, pemilik Kadiv SME, tenggat 15 Desember.\u201D Perhatikan yang dibuang: rata-rata 12 bulan (tidak actionable), manufaktur stabil (bukan temuan), dan semua kata sifat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap kalimat yang tidak membantu keputusan = pajak perhatian direksi. Pajak ini menumpuk: setelah tiga laporan bertele-tele, direksi berhenti membaca laporanmu — dan risiko berikutnya lolos tanpa terpantau.",
      },
      reference: "Kompres: angka + pemicu + rekomendasi. Buang yang tidak actionable.",
    },
    {
      id: "katalog-dasar",
      eyebrow: "Langkah 7 · Katalog",
      title: "Mengenali lanskap laporanmu",
      prose: [
        "Di satu bank menengah, tim risiko iseng menghitung: berapa laporan yang kami hasilkan tiap bulan? Hasilnya 47. Yang tercatat di katalog resmi: 19. Dua puluh delapan sisanya hidup di folder bersama, rantai email, dan — yang paling rapuh — ingatan orang. Ketika ditanya siapa yang punya daftar lengkapnya, tidak ada yang bisa menjawab. Inilah lanskap laporan yang sebenarnya di banyak organisasi: sebagian resmi, sebagian lagi beroperasi dalam bayang-bayang.",
        "Tiga golongan beredar. Pertama, laporan resmi regulator: template baku, tenggat jelas, semua orang tahu. Kedua, laporan komite internal: headline yang dibaca direksi. Ketiga, adhoc berulang: bermula dari permintaan \u201Ccoba tolong tarik angka X cepat\u201D yang lalu diminta lagi bulan depan, lalu bulan depannya lagi — tanpa pernah didaftarkan. Ciri adhoc yang diam-diam menjadi permanen: nama file berakhiran v3_FINAL_revisi2, dikirim ke orang yang sama tiap bulan, dan tidak ada yang bisa menjelaskan definisinya dengan tepat.",
        "💡 Intuisi: katalog = kartu stok gudang. Gudang tanpa kartu stok bukan berarti barangnya hilang — masalahnya, tidak ada yang tahu barang apa yang ada. Laporan tanpa katalog sama: bukan tidak berguna, tetapi tidak ada yang bisa memastikan ia masih benar, masih dibutuhkan, atau masih dibaca.",
        "Tiga pertanyaan audit berlaku untuk tiap laporan: siapa yang meminta — dan apakah orang itu masih di bank? Keputusan apa yang diambil darinya? Dan yang paling jujur: apa yang terjadi bila laporan ini berhenti terbit besok? Laporan yang tidak bisa menjawab pertanyaan ketiga adalah kandidat pensiun; laporan yang tidak bisa menjawab pertanyaan pertama adalah yatim piatu yang butuh pemilik baru.",
        "Bedakan katalog dari folder bersama. Folder menjawab \u201Cdi mana filenya\u201D. Katalog menjawab \u201Claporan apa, untuk siapa, seberapa sering, masih hidupkah\u201D. Bukan katalog kalau tidak mencantumkan empat hal: pemilik, frekuensi, pembaca, dan tanggal review terakhir. Folder bersama tanpa katalog = arsip tanpa indeks; sesuatu yang tidak bisa ditemukan sama saja dengan tidak ada.",
      ],
      tasks: [
        { id: "t1", text: "Petakan 5 laporan di unitmu: golongan, pemilik, frekuensi" },
        { id: "t2", text: "Jalankan tiga pertanyaan audit pada satu laporan adhoc berulang" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CAdhoc = sekali, jadi tidak perlu dicatat.\u201D Adhoc yang diminta dua kali bukan lagi adhoc — itu laporan berkala yang tidak terdaftar. Biaya ketidaktercatatannya nyata: definisi bergeser diam-diam tiap pengiriman, dan saat pembuatnya pindah, laporan itu mati atau — lebih buruk — diteruskan orang lain dengan definisi yang salah.",
      },
      reference: "Katalog = pemilik + frekuensi + pembaca + review terakhir. Folder ≠ katalog.",
    },
    {
      id: "siklus-hidup-laporan",
      eyebrow: "Langkah 8 · Siklus hidup",
      title: "Siklus hidup laporan: lahir, tumbuh, pensiun",
      prose: [
        "Setiap laporan punya siklus hidup. Lahir: usulan disertai justifikasi — keputusan apa yang akan diambil dari laporan ini? Laporan tanpa keputusan target tidak layak lahir; ia hanya menambah pajak perhatian. Masa percobaan tiga sampai enam bulan: apakah ia dibaca? Dipakai dalam keputusan nyata? Jika tidak, ia gugur sebelum resmi.",
        "Lalu resmi berkala — dan di sinilah kebanyakan siklus berhenti diperhatikan. Review tahunan wajib: apakah laporan masih relevan? Apakah definisinya masih benar? Dan pensiun: dihentikan dengan arsip, bukan dihapus. Catat tanggal pensiun dan alasannya — \u201Ctidak ada pembaca aktif per 2026-03\u201D — agar tiga tahun kemudian tidak ada yang menghidupkannya lagi dari folder bersama tanpa konteks.",
        "💡 Intuisi: laporan = produk, pembaca = pelanggan. Tidak ada produk yang dipertahankan selamanya tanpa review berkala; laporan pun produk. Pertanyaannya sama seperti produk: masih ada yang memakai? Masih menyelesaikan masalah? Kalau tidak, produk dipensiunkan — laporan juga.",
        "Laporan mati diam-diam saat pemiliknya pindah dan tidak ada wakil yang paham definisinya. Angka berhenti diperbarui, tetapi tidak ada yang berani mematikannya karena \u201Csiapa tahu masih dibaca\u201D. Aturan sederhana: setiap laporan wajib punya pemilik DAN wakil yang memahami definisinya. Laporan tanpa pemilik bukan laporan — itu artefak.",
        "Metrik kesehatan katalog dilaporkan seperti metrik risiko lainnya: jumlah laporan aktif (targetnya turun tiap tahun, bukan naik), persentase tanpa pemilik, persentase tidak direview lebih dari 12 bulan, dan persentase tanpa pembaca aktif — kandidat pensiun. Catatan penting: laporan yang sudah diklasifikasi PENSIUN tidak dihitung lagi dalam \u201Ctak direview\u201D — ia masuk jalur pensiun, bukan antrean review. Lab di bawah menghitung metrik ini dari data katalog. Katalog yang sakit menghasilkan keputusan yang sakit: definisi ganda, duplikasi usaha, dan pembaca yang berhenti mempercayai laporan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `klasifikasi` dan hitung metrik kesehatan katalog" },
        { id: "t2", text: "Jalankan: pastikan 6 baris klasifikasi + 1 baris metrik tercetak" },
      ],
      expected: "NPL SME Bulanan: SEHAT\nLCR Harian: PERLU REVIEW\nStress Test Adhoc: PENSIUN\nLaporan Devisa Triwulan: SEHAT\nProfil Konsentrasi KI: PERLU REVIEW\nFlash NPL Mingguan: SEHAT\nSEHAT=3 REVIEW=2 PENSIUN=1 | TANPA_PEMILIK=2 TAK_DIREVIEW_12BLN=2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CKan sudah jalan, kenapa dipensiunkan?\u201D Laporan yang tidak pernah direview menumpuk sebagai beban produksi dan risiko definisi usang. Biayanya bukan hanya jam kerja: 47 laporan dengan 20 yang mati diam-diam melatih pembaca berhenti memeriksa mana yang hidup — dan laporan yang sebenarnya penting ikut diabaikan.",
      },
      hints: [
        "Bandingkan usia review (dalam hari) dengan BATAS_HARI 365; cek pembaca == 0 dulu.",
        "date(y, m, d) bisa dibangun dari potongan string 'YYYY-MM-DD' seperti tgl[0:4].",
      ],
      code: {
        starter: `# Katalog laporan bank fiksi. JANGAN UBAH.
from datetime import date
laporan = [
    {"nama": "NPL SME Bulanan", "pemilik": "Rudi", "review": "2026-06-15", "pembaca": 12},
    {"nama": "LCR Harian", "pemilik": "Sari", "review": "2024-11-02", "pembaca": 8},
    {"nama": "Stress Test Adhoc", "pemilik": None, "review": "2023-05-20", "pembaca": 0},
    {"nama": "Laporan Devisa Triwulan", "pemilik": "Rudi", "review": "2025-12-10", "pembaca": 3},
    {"nama": "Profil Konsentrasi KI", "pemilik": None, "review": "2025-09-01", "pembaca": 6},
    {"nama": "Flash NPL Mingguan", "pemilik": "Dewi", "review": "2026-09-28", "pembaca": 15},
]
HARI_INI = date(2026, 10, 31)
BATAS_HARI = 365

# TULIS KODEMU: klasifikasi tiap laporan + metrik kesehatan katalog
def usia_hari(tgl):
    return

def klasifikasi(lap):
    return

hasil =
sehat =
perlu_review =
pensiun =
tanpa_pemilik =
tidak_direview_12bln =
for nama, kelas in hasil.items():
    print(f"{nama}: {kelas}")
print(f"SEHAT={sehat} REVIEW={perlu_review} PENSIUN={pensiun} | TANPA_PEMILIK={tanpa_pemilik} TAK_DIREVIEW_12BLN={tidak_direview_12bln}")`,
        lockLines: 12,
        solution: `# Katalog laporan bank fiksi. JANGAN UBAH.
from datetime import date
laporan = [
    {"nama": "NPL SME Bulanan", "pemilik": "Rudi", "review": "2026-06-15", "pembaca": 12},
    {"nama": "LCR Harian", "pemilik": "Sari", "review": "2024-11-02", "pembaca": 8},
    {"nama": "Stress Test Adhoc", "pemilik": None, "review": "2023-05-20", "pembaca": 0},
    {"nama": "Laporan Devisa Triwulan", "pemilik": "Rudi", "review": "2025-12-10", "pembaca": 3},
    {"nama": "Profil Konsentrasi KI", "pemilik": None, "review": "2025-09-01", "pembaca": 6},
    {"nama": "Flash NPL Mingguan", "pemilik": "Dewi", "review": "2026-09-28", "pembaca": 15},
]
HARI_INI = date(2026, 10, 31)
BATAS_HARI = 365

# TULIS KODEMU: klasifikasi tiap laporan + metrik kesehatan katalog
def usia_hari(tgl):
    y, m, d = int(tgl[0:4]), int(tgl[5:7]), int(tgl[8:10])
    return (HARI_INI - date(y, m, d)).days

def klasifikasi(lap):
    if lap["pembaca"] == 0:
        return "PENSIUN"
    if usia_hari(lap["review"]) > BATAS_HARI:
        return "PERLU REVIEW"
    return "SEHAT"

hasil = {lap["nama"]: klasifikasi(lap) for lap in laporan}
sehat = sum(1 for v in hasil.values() if v == "SEHAT")
perlu_review = sum(1 for v in hasil.values() if v == "PERLU REVIEW")
pensiun = sum(1 for v in hasil.values() if v == "PENSIUN")
tanpa_pemilik = sum(1 for lap in laporan if lap["pemilik"] is None)
tidak_direview_12bln = sum(1 for lap in laporan if lap["pembaca"] > 0 and usia_hari(lap["review"]) > BATAS_HARI)
for nama, kelas in hasil.items():
    print(f"{nama}: {kelas}")
print(f"SEHAT={sehat} REVIEW={perlu_review} PENSIUN={pensiun} | TANPA_PEMILIK={tanpa_pemilik} TAK_DIREVIEW_12BLN={tidak_direview_12bln}")`,
        checks: [
          { kind: "defined", task: "t1", name: "klasifikasi", label: "fungsi klasifikasi ada", msg: "Definisikan fungsi klasifikasi(lap)." },
          { kind: "equal", task: "t1", name: "sehat", value: 3, label: "sehat = 3", msg: "NPL SME, Devisa Triwulan, Flash NPL → SEHAT." },
          { kind: "equal", task: "t1", name: "perlu_review", value: 2, label: "perlu_review = 2", msg: "LCR Harian dan Profil Konsentrasi KI direview lebih dari 12 bulan lalu." },
          { kind: "equal", task: "t1", name: "pensiun", value: 1, label: "pensiun = 1", msg: "Stress Test Adhoc tidak punya pembaca aktif." },
          { kind: "equal", task: "t1", name: "tanpa_pemilik", value: 2, label: "tanpa_pemilik = 2", msg: "Stress Test Adhoc dan Profil Konsentrasi KI tanpa pemilik." },
          { kind: "equal", task: "t1", name: "tidak_direview_12bln", value: 2, label: "tidak_direview_12bln = 2", msg: "Dihitung atas laporan yang masih aktif: LCR Harian dan Profil Konsentrasi KI." },
          { kind: "stdout_matches", task: "t2", pattern: "Stress Test Adhoc: PENSIUN", label: "Adhoc = PENSIUN tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "SEHAT=3 REVIEW=2 PENSIUN=1", label: "Baris metrik tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Pemilik + wakil. Review tahunan. Pensiun = arsip dengan alasan, bukan hapus.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Perhatikan why setiap opsi — pola pikirnya lebih penting dari hafalan strukturnya.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Satu angka yang beda antara halaman 1 dan lampiran menghancurkan kepercayaan ke seluruh laporan. Pemeriksa konsistensi 5 baris di lab ini layak menjadi gerbang otomatis sebelum setiap pengiriman.",
      },

      summary: [
        "Enam lapis: headline → konteks → temuan → data → rekomendasi → lampiran.",
        "Tulis headline + rekomendasi dulu; 80% usaha di dua lapis teratas.",
        "Setiap angka headline ditemani batas/pembanding + status.",
        "Rekomendasi = tindakan spesifik + pemilik + tenggat, maksimal 3.",
        "Panjang laporan ∝ besar keputusan × kontroversi temuan.",
      ],
      next: { label: "RR3 — Metrik Kunci & Definisi Konsisten", href: "/learn/rr3-metrik" },
      quiz: [
        {
          q: "Apa pekerjaan utama lapis headline eksekutif?",
          options: [
            { text: "Meringkas semua halaman", why: "Itu jebakan pitfall — ringkasan 40 halaman tetap tidak dibaca." },
            { text: "Menjawab: apa terjadi, kenapa penting, apa yang dilakukan", why: "Tepat. Tiga angka + satu kalimat keputusan = bahan rapat 5 menit.", correct: true },
            { text: "Menampilkan metodologi", why: "Metodologi milik lampiran, untuk CRO dan regulator." },
          ],
        },
        {
          q: "Mana rekomendasi yang benar?",
          options: [
            { text: "\u201CKonsentrasi perlu mendapat perhatian\u201D", why: "Basa-basi — bisa ditempel ke laporan mana pun." },
            { text: "\u201CBekukan eksposur top-20 sampai <40%, pemilik Kadiv Korporasi, tenggat 30 Nov\u201D", why: "Tindakan spesifik + pemilik + tenggat — ketiganya ada.", correct: true },
            { text: "\u201CTingkatkan kewaspadaan terhadap konsentrasi\u201D", why: "Sama mengambangnya dengan opsi pertama." },
          ],
        },
        {
          q: "NPL 3,4% dengan batas 3,0% dan arah \u201Csemakin kecil semakin baik\u201D. Status?",
          options: [
            { text: "AMAN", why: "3,4 > 3,0 — melewati batas untuk arah ini." },
            { text: "WASPADA", why: "Benar. Gap +0,4 pp di atas batas.", correct: true },
          ],
        },
        {
          q: "Update rutin tanpa temuan material paling tepat sepanjang?",
          options: [
            { text: "1 halaman eksekutif", why: "Benar. Jangan mengarang temuan agar terlihat sibuk.", correct: true },
            { text: "20 halaman + lampiran", why: "Itu untuk keputusan besar atau temuan kontroversial." },
            { text: "40 halaman lengkap", why: "Melatih pembaca melewatkan laporanmu." },
          ],
        },
        {
          q: "Mengapa analis harus berpendapat (rekomendasi), bukan sekadar menyajikan data?",
          options: [
            { text: "Agar laporan terlihat tebal", why: "Ketebalan bukan nilai — keputusan adalah nilainya." },
            { text: "Karena direksi membayar pendapat yang bisa dipertanggungjawabkan", why: "Tepat. Data tanpa rekomendasi = keputusan oleh yang paling sedikit paham data.", correct: true },
            { text: "Karena regulator mewajibkan opini analis", why: "Regulator mewajibkan angka dan definisi, bukan opini analis." },
          ],
        },
      ],
    },
  ],
};
