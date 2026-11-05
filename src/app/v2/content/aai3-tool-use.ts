import type { V2Lesson } from "../lib/types";

// Diagram alur tool call dengan cabang error -> retry -> fallback.
const FLOW_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Alur: planner memilih tool, validasi argumen, eksekusi, sukses atau gagal lalu retry maksimal 3 kali lalu fallback.">
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<rect x="180" y="6" width="120" height="32" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="1.5"/><text x="240" y="27" fill="var(--text)" font-weight="600">Planner pilih tool</text>
<rect x="180" y="58" width="120" height="32" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="1.5"/><text x="240" y="79" fill="var(--text)" font-weight="600">Validasi argumen</text>
<rect x="180" y="110" width="120" height="32" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="1.5"/><text x="240" y="131" fill="var(--text)" font-weight="600">Eksekusi tool</text>
<rect x="60" y="170" width="120" height="32" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="1.5"/><text x="120" y="191" fill="var(--text)" font-weight="600">Sukses → lanjut</text>
<rect x="300" y="170" width="120" height="32" rx="8" fill="var(--c5)" opacity="0.35" stroke="var(--c5)" stroke-width="1.5"/><text x="360" y="191" fill="var(--text)" font-weight="600">Gagal → retry?</text>
<rect x="300" y="216" width="120" height="28" rx="8" fill="var(--chart-grid)" opacity="0.5" stroke="var(--chart-text)" stroke-width="1.2"/><text x="360" y="234" fill="var(--text)">Habis → fallback</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" fill="none" marker-end="url(#ah3)">
<defs><marker id="ah3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<line x1="240" y1="38" x2="240" y2="56"/>
<line x1="240" y1="90" x2="240" y2="108"/>
<line x1="200" y1="142" x2="140" y2="168"/>
<line x1="280" y1="142" x2="340" y2="168"/>
<path d="M420 186 C 430 150, 330 120, 305 122"/>
<line x1="360" y1="202" x2="360" y2="214"/>
</g>
<text x="436" y="150" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">maks 3×</text>
<text x="120" y="160" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">argumen tidak valid</text>
<text x="120" y="148" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">↓ tolak duluan</text>
</svg>`;

export const aai3: V2Lesson = {
  slug: "aai3-tool-use",
  track: "Agentic AI Engineer",
  module: "Fondasi Agen",
  title: "AAI3 — Tool Use & Function Calling",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp47.500 yang dihitung menjadi Rp4.750.000",
      prose: [
        "Dina memberi agen barunya tugas sederhana: \u201Chitung total 12 invoice di folder ini.\u201D Agen membaca file, lalu menjawab percaya diri: \u201CTotal Rp4.750.000.\u201D Dina membayar. Pekan berikutnya vendor menagih Rp47.500 — selisih 100×.",
        "Investigasi: agen MENCOBA memakai kalkulator, tetapi argumennya salah format (\u201C47.500\u201D dibaca sebagai string dengan titik). Tool mengembalikan error. Bukannya memperbaiki, agen \u201Cmenebak\u201D hasilnya dari pola angka yang ia lihat — dan tebakannya meleset dua orde magnitude.",
        "Twist-nya: LLM itu penutur bahasa yang fasih tetapi juru hitung yang buruk. Ia tidak \u201Cberhitung\u201D — ia memprediksi digit berikutnya. Memberi kalkulator ke agen tanpa kontrak argumen yang ketat sama saja memberi kalkulator rusak: angkanya terlihat meyakinkan, salahnya sistematis.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan kapan agen harus memanggil tool vs menjawab langsung; (2) merancang skema argumen dan validasinya; (3) mengimplementasikan retry terbatas + fallback untuk tool yang gagal; (4) menghitung ekspektasi biaya dengan peluang gagal.",
        "Daftar isi: 1) Cerita invoice · 2) Kontrak tool: skema + validasi · 3) Lab: agen kalkulator tahan gagal · 4) Peta keputusan tool-vs-langsung · 5) Mini-case: biaya retry · 6) Checkpoint.",
        "Skala kerusakannya: selisih Rp4.750.000 − Rp47.500 = Rp4.702.500 — 99× lipat dari tagihan yang benar. Satu error format string (“47.500” dibaca sebagai teks, bukan angka) yang tidak divalidasi berbiaya 23.500× lipat dari biaya satu panggilan tool (Rp200). Inilah asimetri fundamental tool use: biaya validasi = satu baris kode; biaya kegagalan = ratusan ribu hingga jutaan rupiah PER KEJADIAN. Tidak ada investasi lain di engineering agen dengan rasio sebesar ini.",
        "Twist yang lebih dalam: mengapa agen “menebak” alih-alih mengaku gagal? Karena desain kontraknya tidak menyediakan jalur “aku tidak tahu”. Tool mengembalikan error; agen tidak punya aksi “lapor dan berhenti” — pilihannya hanya “coba lagi” atau “karangan”. Kontrak tool yang baik memperlakukan KEGAGALAN sebagai first-class citizen: format error yang bisa ditindaklanjuti, kode error yang bisa diklasifikasikan, dan — yang terpenting — izin eksplisit untuk menyerah dengan jujur.",
        "Dina mengaudit 3 bulan invoice setelah insiden — dan menemukan DUA pola error lain yang selama ini “diperbaiki manual diam-diam”: koma desimal Eropa (“47,50” dibaca 4750) dan kode mata uang menempel (“Rp47.500”). Satu insiden = satu perbaikan; audit = perbaikan SISTEMIK. Ia menulis `bersihkan` versi 2 yang menangani ketiganya + 40 test case. Sejak itu, nol insiden format dalam 8 bulan. Moral: insiden adalah data; yang tidak diaudit akan terulang dengan kostum berbeda.",
        "Checklist audit tool — yang Dina jalankan tiap kuartal untuk 23 tools timnya. (1) Apakah kontraknya masih akurat? (skema berubah tanpa versi = temuan). (2) Berapa p_gagal 90 hari terakhir? (>0,1 = temuan). (3) Apakah pesan error-nya masih bisa ditindaklanjuti? (coba satu error, baca pesannya). (4) Apakah ada tool yang 90 hari tak dipanggil? (cabut — tiap tool memakan B_tools). (5) Apakah ada aksi berdampak tanpa idempotency key? (temuan KRITIS). Audit 2 jam per kuartal; temuan rata-rata 3–5; insiden tool turun 70% dalam setahun. Tool yang tidak diaudit = tool yang menunggu giliran meledak.",
      ],
      note: {
        title: "💡 Intuisi: validasi adalah asuransi termurah",
        body: "Satu baris `isinstance(nominal, (int, float))` mencegah Rp4,7 juta salah bayar. Tidak ada investasi lain di engineering agen dengan rasio biaya-manfaat sebesar validasi input: premi hampir nol, klaim jutaan rupiah. Tim yang “tidak sempat” menulis validasi selalu punya waktu untuk menulis postmortem.",
      },

      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tool = kontrak, bukan sekadar fungsi",
      prose: [
        "Definisi: tool adalah fungsi yang bisa dipanggil agen, dibungkus KONTRAK — nama, deskripsi kapan dipakai, skema argumen (tipe, wajib/opsional, batasan), dan format hasil. Function calling adalah mekanisme model memilih tool + mengisi argumen sesuai skema.",
        "Tiga aturan kontrak. Pertama, VALIDASI SEBELUM EKSEKUSI: tolak argumen tak valid duluan (string \u201C47.500\u201D untuk parameter number) — jangan biarkan tool meledak di tengah. Kedua, IDEMPOTENSI untuk aksi berdampak: kirim_transfer yang dipanggil dua kali karena retry tidak boleh mengirim dua kali — pakai idempotency key. Ketiga, ERROR YANG BISA DIBACA AGEN: kembalikan pesan seperti \u201Cargumen amount harus number tanpa pemisah ribuan\u201D, bukan stack trace.",
        "Kapan memanggil tool vs menjawab langsung? Aturan: (1) butuh FAKTA DUNIA NYATA (kurs hari ini, isi database) → tool; (2) butuh KOMPUTASI PRESISI (aritmetika, tanggal, agregasi) → tool; (3) butuh AKSI BERDAMPAK (kirim, hapus, ubah) → tool + guardrail; (4) murni penalaran/penulisan dari konteks yang ada → jawab langsung, jangan bayar latency tool.",
        "Kegagalan tool bukan \u201Cjika\u201D melainkan \u201Ckapan\u201D: timeout, argumen tak valid, rate limit, data kosong. Rumus di bawah menghitung ekspektasi biaya saat tiap percobaan punya peluang gagal p dan tiap percobaan berharga c.",
        "Contoh angka retry terbatas, lengkap. c=Rp200, p=0,25, maks 3×. Ekspektasi biaya = 200×(1 + 0,25 + 0,0625) + P(gagal total)×Rp5.000. P(gagal total)=0,25³=0,015625. Jadi E = 200×1,3125 + 78,125 = 262,5 + 78,125 = Rp340,63 per invoice. Bandingkan tanpa retry: E = 200 + 0,25×5.000 = Rp1.450. Retry 3× memangkas ekspektasi biaya 76% — TETAPI perhatikan: 78.125 dari 340 (23%) adalah kontribusi kegagalan total. Retry menekan biaya operasional, bukan menghilangkan risiko ekor.",
        "Empat pola validasi sebelum eksekusi, dengan contoh. (1) TIPE: tolak string untuk parameter number — `isinstance(nominal, (int, float))`. (2) RENTANG: nominal invoice 0 < x < 10 miliar — tolak Rp−5.000 dan Rp999 triliun. (3) FORMAT LOKAL: “47.500” (Indonesia) vs “47,500” (Inggris) — normalisasi eksplisit, jangan tebak. (4) IDEMPOTENCY KEY: untuk aksi berdampak, wajibkan kunci unik per operasi. Validasi adalah asuransi termurah di seluruh engineering: satu baris mencegah jutaan rupiah salah bayar.",
        "Contoh angka idempotensi: tool “transfer” tanpa idempotency key. Timeout di percobaan 1 (uang SUDAH terkirim, respons hilang), retry mengirim lagi → double charge Rp4.750.000 × 2. Dengan idempotency key “inv-2026-1042”: percobaan 2 dikenali sebagai duplikat → server mengembalikan hasil percobaan 1 tanpa eksekusi ulang. Untuk aksi berdampak (kirim, bayar, hapus, ubah), idempotensi bukan optimasi — ia adalah KEBENARAN: tanpanya, “coba lagi” berarti “lakukan dua kali”.",
        "Klasifikasi error menentukan obat. TRANSIENT (timeout, 429 rate-limit, 503): retry dengan backoff — dunia sedang sibuk, bukan rusak. PERMANEN (400 bad request, 401 auth, 404): JANGAN retry — mengulang kesalahan yang sama 3× hanya membakar uang dengan rajin. AMBIGU (500, koneksi putus di tengah tulis): retry SEKALI dengan idempotency key, lalu alert manusia. Aturan 10 detik: “apakah percobaan kedua punya alasan untuk berhasil padahal yang pertama gagal?” Jika tidak — jangan retry.",
        "Bedakan timeout dari hasil lambat — keduanya “lama”, obatnya berlawanan. Tool LAMBAT tetapi benar (laporan 25 detik): jangan retry — tunggu dengan timeout adaptif (naikkan batas untuk tool yang historisnya lambat). Tool TIMEOUT (tidak respons): retry sekali, lalu circuit breaker. Retry pada tool lambat = dua eksekusi paralel yang keduanya akhirnya sukses = double charge untuk ketidaksabaran. Ukur p95 latency tiap tool; timeout = p99 + margin, bukan angka tebakan.",
        "Kontrak berubah: tool v1 → v2 (parameter baru, format baru). Setiap perubahan skema = SEMUA agen pemakai harus diuji ulang (AAI8) — karena agen yang “tahu” v1 akan memanggil v2 dengan asumsi basi. Aturan versioning: (1) jangan ubah skema tanpa versi baru; (2) dukung v1 selama 2 siklus rilis; (3) daftarkan skema di registry terpusat (bukan tersebar di prompt). Tool tanpa versioning = bom waktu yang meledak saat kamu paling sibuk.",
        "Contoh kontrak tool yang lengkap — `transfer_bank` versi benar. Nama: transfer_bank. Deskripsi: “Memindahkan dana antar rekening. BERDAMPAK — butuh idempotency key.” Parameter: {rekening_tujuan: string (format: 10–16 digit), nominal: number (0 < x ≤ 10 miliar, TANPA pemisah ribuan), idempotency_key: string (wajib, unik per operasi), keterangan: string (opsional)}. Validasi: tolak sebelum eksekusi jika format salah; kembalikan error terstruktur {kode: “FORMAT_NOMINAL”, pesan: “nominal harus number, contoh: 47500”, bisa_retry: false}. Hasil: {status, id_transaksi, saldo_akhir}. Perhatikan: kontrak ini menjawab SEMUA pertanyaan agen sebelum ia bertanya — format, batas, apa yang terjadi jika salah, dan apakah boleh coba lagi. Kontrak yang baik = dokumentasi yang bisa dieksekusi.",
        "Biaya validasi vs biaya insiden — akuntansi lengkap untuk satu tool `transfer_bank`. Validasi: 20 baris kode + 40 test = 4 jam insinyur = Rp600 ribu SEKALI. Tanpa validasi: ekspektasi 1 insiden format per 5.000 transaksi × Rp4,7 juta = Rp940 per transaksi; pada 10.000 transaksi/hari = Rp9,4 juta/hari. Payback validasi: 600.000 / 9.400.000 = 0,064 hari = 1,5 JAM. Tidak ada investasi lain di tim ini yang kembali dalam 90 menit. Jika ada yang bertanya “kapan sempat nulis validasi?”, jawabannya: “kapan sempat TIDAK menulisnya?”",
        "Tiga level kontrak — pilih sesuai taruhan. LEVEL 1 (baca: search, hitung): validasi tipe + format. LEVEL 2 (tulis reversibel: draf, file): + audit log + idempotency key. LEVEL 3 (berdampak: kirim, bayar, hapus): + approval gate (AAI9) + dry-run mode. Kesalahan umum: menerapkan level 1 untuk tool level 3 (“kan cuma panggil API”) — padahal API-nya mentransfer uang. Klasifikasikan SEMUA tools ke tiga level ini di hari pertama; tinjau tiap ada tool baru. 30 menit klasifikasi vs satu insiden Rp4,7 juta.",
      ],
      formula: String.raw`\mathbb{E}[\text{biaya}] = c + p \cdot c + p^2 \cdot c + \cdots = \frac{c}{1 - p}`,
      formulaNote: "E[biaya] = ekspektasi biaya per invoice; c = biaya satu panggilan tool; p = peluang gagal transient per panggilan. Deret geometri c + pc + p²c + … = c/(1−p) berlaku untuk retry TAK TERBATAS. Dengan batas retry n, tambahkan suku P(gagal total) × biaya penanganan manual — suku inilah yang sering dilupakan dan mendominasi saat p besar.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Ctool call gagal = bug yang harus nol\u201D",
        type: "pitfall",
        body: "Yang benar: kegagalan tool adalah KONDISI OPERASI NORMAL. Target realistis bukan nol gagal, melainkan gagal-yang-tertangani: retry terbatas untuk transient (timeout), perbaikan argumen untuk validasi, fallback untuk permanen. Agen yang crash pada tool error pertama adalah agen yang belum selesai dibangun.",
      },
      hints: [
        "Intuisi: baca skema tool dari sudut pandang LLM yang mengantuk jam 3 pagi — kalau deskripsi argumen bisa disalahpahami, ia AKAN disalahpahami.",
        "Intuisi: retry tanpa batas + tool berbayar = tagihan tak terbatas. Batas retry adalah kontrol biaya, bukan sekadar kerapian kode.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: agen kalkulator yang tahan terhadap tool gagal",
      prose: [
        "Kamu membangun `hitung_total` — agen mini yang menjumlahkan daftar nominal memakai `tool_tambah`, sebuah tool mock yang SENGAJA rewel: ia menolak string berformat Indonesia (\u201C47.500\u201D) dan kadang melempar timeout tiruan.",
        "Tugasmu: (1) tulis `bersihkan(nominal)` yang mengubah string seperti \u201C47.500\u201D menjadi number 47500 (hapus titik pemisah ribuan, ganti koma desimal dengan titik); (2) tulis `tambah_aman(a, b)` yang memvalidasi argumen numerik, memanggil tool, dan me-retry maksimal 3× hanya untuk error transient (\u201Ctimeout\u201D) — untuk error validasi, perbaiki argumennya, jangan retry buta.",
        "Coba eksplorasi: naikkan `GAGAL_RATE` menjadi 0,9. Pada titik berapa agen menyerah? Itulah bedanya retry terbatas vs loop abadi dari AAI2.",
        "Eksperimen: naikkan peluang timeout di mock dan cari titik impas — pada p berapa retry 3× (E = 200×(1+p+p²) + p³×5.000) menjadi LEBIH MAHAL daripada langsung eskalasi manual (Rp5.000)? Hitung: p=0,5 → 200×1,75+625 = Rp975 < Rp5.000. p=0,8 → 200×2,44+2.560 = Rp3.048 < Rp5.000. p=0,9 → 200×2,71+3.645 = Rp4.187 < Rp5.000. p=0,95 → Rp4.665. Retry tetap menang sampai p≈0,97 — TETAPI latency-nya: 3× timeout 30 detik = 90 detik per invoice. Untuk SLA 10 detik, retry 3× = melanggar SLA dengan sukses. Biaya bukan satu-satunya mata uang; waktu juga.",
        "Pelajaran lokal dari fungsi `bersihkan`: parsing format Indonesia (titik = ribuan, koma = desimal) adalah sumber bug #1 di tool finansial Indonesia — kebalikan dari konvensi Inggris. Tool yang dipakai di Jakarta HARUS paham format Jakarta; mengandalkan “model pasti paham” adalah cara mahal untuk belajar. Tulis test khusus: “47.500” → 47500, “47,5” → 47.5, “1.234.567,89” → 1234567.89. Tiga baris test, nol insiden format selamanya.",
        "Uji chaos: ubah mock `tool_tambah` agar gagal 50% (bukan kadang-kadang). Agen yang baik MENURUNKAN dirinya dengan anggun: retry terbatas, lalu lapor “12 invoice, 6 terhitung, 6 gagal — butuh intervensi” — bukan meledak, bukan mengarang. Graceful degradation adalah fitur, bukan kegagalan: dalam produksi, tool AKAN gagal; pertanyaannya hanya apakah agenmu menghadapinya seperti profesional atau seperti chatbot yang panik.",
        "Spesifikasi `bersihkan` v2 — setelah audit Dina. Input yang HARUS ditangani: “47.500” → 47500 (titik ribuan ID), “47,50” → 47.5 (koma desimal ID), “47,500” → 47500 (koma ribuan EN — ambigu dengan desimal ID! putuskan: konteks ID menang), “Rp47.500” → 47500 (prefix mata uang), “47.500,75” → 47500.75 (kombinasi), “ 47.500 ” → 47500 (spasi). Output: number, atau raise ValueError dengan pesan yang bisa ditindaklanjuti. 40 test case untuk satu fungsi 10 baris — rasio yang TEPAT untuk fungsi yang berdiri di antara agen dan uang.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `bersihkan` dan `tambah_aman` dengan validasi + retry maksimal 3×" },
        { id: "t2", text: "Jumlahkan `invoices` memakai `hitung_total` dan cetak hasilnya" },
      ],
      expected: "total=142500\nretry_terjadi=2",
      note: {
        title: "Miskonsepsi: \u201Cretry untuk semua error\u201D",
        type: "pitfall",
        body: "Yang benar: retry hanya untuk TRANSIENT (timeout, 429, koneksi putus). Error validasi (\u201Cargumen bukan number\u201D) akan gagal selamanya jika di-retry — yang dibutuhkan adalah PERBAIKAN argumen. Klasifikasikan error dulu, baru pilih strategi. Retry buta pada error permanen = bakar biaya + waktu.",
      },
      hints: [
        "bersihkan: hapus \".\" dulu, lalu ganti \",\" dengan \".\", lalu float(). Urutan penting!",
        "Di tambah_aman: cek isinstance(a, (int, float)) dulu; jika string, bersihkan dulu.",
        "Untuk timeout: ulangi maksimal 3×; jika masih gagal, kembalikan penjumlahan manual sebagai fallback.",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nimport random\nrandom.seed(7)\nGAGAL_RATE = 0.3\n\ndef tool_tambah(a, b):\n    if isinstance(a, str) or isinstance(b, str):\n        raise ValueError("argumen harus number tanpa pemisah ribuan")\n    if random.random() < GAGAL_RATE:\n        raise TimeoutError("timeout")\n    return a + b\n\ninvoices = ["47.500", "32.000", "63.000"]  # format Indonesia\nretry_terjadi = 0\n\n# ===== TULIS KODEMU =====\ndef bersihkan(nominal):\n    ...\n\ndef tambah_aman(a, b):\n    global retry_terjadi\n    ...\n\ndef hitung_total(daftar):\n    total = 0\n    for nominal in daftar:\n        total = tambah_aman(total, bersihkan(nominal))\n    return total\n\nprint(f"total={hitung_total(invoices):.0f}")\nprint(f"retry_terjadi={retry_terjadi}")`,
        lockLines: 14,
        solution: `# ===== MOCK — jangan diubah =====\nimport random\nrandom.seed(7)\nGAGAL_RATE = 0.3\n\ndef tool_tambah(a, b):\n    if isinstance(a, str) or isinstance(b, str):\n        raise ValueError("argumen harus number tanpa pemisah ribuan")\n    if random.random() < GAGAL_RATE:\n        raise TimeoutError("timeout")\n    return a + b\n\ninvoices = ["47.500", "32.000", "63.000"]  # format Indonesia\nretry_terjadi = 0\n\n# ===== TULIS KODEMU =====\ndef bersihkan(nominal):\n    if isinstance(nominal, (int, float)):\n        return nominal\n    return float(nominal.replace(".", "").replace(",", "."))\n\ndef tambah_aman(a, b):\n    global retry_terjadi\n    if isinstance(a, str):\n        a = bersihkan(a)\n    if isinstance(b, str):\n        b = bersihkan(b)\n    for percobaan in range(3):\n        try:\n            return tool_tambah(a, b)\n        except TimeoutError:\n            retry_terjadi += 1\n            if percobaan == 2:\n                return a + b\n        except ValueError:\n            return a + b\n    return a + b\n\ndef hitung_total(daftar):\n    total = 0\n    for nominal in daftar:\n        total = tambah_aman(total, bersihkan(nominal))\n    return total\n\nprint(f"total={hitung_total(invoices):.0f}")\nprint(f"retry_terjadi={retry_terjadi}")`,
        checks: [
          { kind: "defined", task: "t1", name: "bersihkan", label: "`bersihkan` terdefinisi", msg: "Definisikan fungsi bersihkan(nominal) di area editable." },
          { kind: "defined", task: "t1", name: "tambah_aman", label: "`tambah_aman` terdefinisi", msg: "Definisikan fungsi tambah_aman(a, b) di area editable." },
          { kind: "equal", task: "t2", name: "retry_terjadi", value: 2, tol: 1e-9, label: "`retry_terjadi` = 2", msg: "Dengan seed 7 dan GAGAL_RATE 0.3, tepat dua timeout terjadi. Cek logika retry." },
          { kind: "stdout_matches", task: "t2", pattern: "total=142500\\nretry_terjadi=2", label: "output dua baris sesuai format", msg: "47500 + 32000 + 63000 = 142500. Samakan format print." },
        ],
      },
      reference: "str.replace, float(), try/except TimeoutError vs ValueError, global.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: tool atau jawab langsung?",
      prose: [
        "Skenario 1 — \u201Ckurs USD/IDR hari ini berapa?\u201D → TOOL (search). Fakta dunia nyata yang berubah; jawaban dari memori = basi.",
        "Skenario 2 — \u201Cjumlahkan 47.500 + 32.000 + 63.000\u201D → TOOL (kalkulator). LLM menebak digit; kalkulator menghitung. Selalu.",
        "Skenario 3 — \u201CJelaskan kenapa angka ini penting untuk laporan\u201D → JAWAB LANGSUNG. Murni penalaran dari konteks; tool hanya menambah latency.",
        "Skenario 4 — \u201CKirim ringkasan ini ke direksi\u201D → TOOL + GUARDRAIL (materi AAI9). Aksi berdampak tidak boleh sekali jalan tanpa persetujuan.",
        "Skenario 5 — tool mengembalikan data kosong → FALLBACK TERSTRUKTUR: laporkan \u201Cdata tidak ditemukan\u201D + saran langkah berikut. Jangan pernah mengarang pengganti.",
        "Cara membaca: kotak teratas = keputusan planner; kotak kedua = gerbang validasi (menolak argumen buruk SEBELUM eksekusi); dua cabang = sukses vs gagal; cabang gagal melingkar retry maksimal 3× lalu jatuh ke fallback.",
        "Interpretasi: perhatikan gerbang validasi diletakkan SEBELUM eksekusi — inilah pelajaran Rp47.500 vs Rp4.750.000. Dan retry hanya melingkar di cabang \u201Cgagal transient\u201D; error validasi tidak di-retry melainkan diperbaiki.",
        "Aturan praktis 10 detik: (1) Fakta/komputasi/aksi → tool. (2) Penalaran murni → langsung. (3) Validasi dulu, eksekusi kemudian. (4) Retry hanya untuk transient, maks 3×. (5) Selalu siapkan fallback yang jujur.",
        "Skenario tambahan — “apakah 47.500 lebih besar dari 50.000?”: JAWAB LANGSUNG, tanpa tool. Ini perbandingan, bukan komputasi presisi — LLM boleh menebak ARAH (“lebih kecil”), tidak boleh menebak DIGIT (“47.500”). Prinsipnya: tool untuk presisi, model untuk arah. Agen yang memanggil kalkulator untuk 2+2 bukan teliti — ia boros dan lambat.",
        "Kapan MEMBUAT tool baru vs memakai yang ada? Buat jika: (1) tidak ada tool yang tepat (biaya salah pakai > biaya bangun); (2) dipakai >50× per hari (amortisasi cepat); (3) butuh validasi/idempotensi khusus. Jangan buat jika: hanya dipakai sesekali (pakai tool generik + prompt), atau tool existing “hampir cocok” (bungkus dengan adapter validasi — 10 baris vs 200 baris). Setiap tool baru = kontrak baru yang harus dirawat; tool adalah liabilitas, bukan aset.",
        "Skenario tool MAHAL (Rp10.000 per panggilan, misal API verifikasi identitas): validasi DUA lapis sebelum panggil + cache hasil per input (jangan bayar dua kali untuk pertanyaan sama). Hitung: tanpa cache, 1.000 panggilan/hari × 20% duplikat = Rp2 juta/hari terbuang. Cache 1 jam = Rp2 juta kembali. Untuk tool mahal, “panggil ulang” adalah kata kerja yang dilarang — setiap pemanggilan harus bisa menjawab: “mengapa hasil kemarin tidak cukup?”",
        "Decision tree teks — tempel di wiki tim. “Butuh fakta dunia nyata yang berubah?” YA → tool search. TIDAK → “Butuh presisi digit?” YA → tool kalkulator. TIDAK → “Output dibaca mesin?” YA → validasi skema ketat (tanpa tool pun, output harus lolos validasi). TIDAK → “Ada keputusan berisiko?” YA → human gate (AAI9). TIDAK → jawab langsung. Lima cabang, nol ambiguitas. Pohon ini terlihat sepele — tetapi tim yang tidak menuliskannya akan mendebatkan “pakai tool atau tidak?” SETIAP PEKAN untuk kasus yang sama.",
      ],
      note: {
        title: "💡 Intuisi: tool yang baik menolak dengan sopan",
        body: "Pesan error adalah UI untuk agen. “Invalid argument” tidak membantu siapa pun; “nominal harus number tanpa pemisah ribuan, contoh: 47500” membuat agen memperbaiki dirinya sendiri di percobaan berikut. Investasi dengan ROI tertinggi di tool engineering bukan fitur baru — melainkan pesan error yang bisa ditindaklanjuti. Tulis error message untuk pembaca mesin yang sedang panik.",
      },

      figure: {
        svg: FLOW_SVG,
        alt: "Alur: planner memilih tool, validasi argumen, eksekusi, sukses atau gagal lalu retry maksimal 3 kali lalu fallback.",
        caption: "Kontrak tool call yang sehat: validasi dulu, retry terbatas, fallback jujur.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: berapa biaya retry yang wajar?",
      prose: [
        "Agen verifikasi invoice Dina memanggil tool OCR seharga Rp200 per panggilan. Tool ini gagal transient (timeout) dengan peluang p = 0,25. Tanpa retry, 25% invoice gagal diproses dan butuh penanganan manual Rp5.000 per invoice.",
        "Ekspektasi biaya per invoice DENGAN retry tak terbatas: E = c/(1−p) = 200/0,75 = Rp266,67. Dengan retry MAKS 3×: E = 200 × (1 + 0,25 + 0,0625) + P(gagal total) × 5.000. P(gagal total) = 0,25³ = 0,015625. Jadi E = 200 × 1,3125 + 0,015625 × 5.000 = 262,5 + 78,1 = Rp340,6.",
        "Bandingkan tanpa retry sama sekali: 200 + 0,25 × 5.000 = Rp1.450. Retry 3× memangkas biaya dari Rp1.450 menjadi Rp340,6 — hemat 76%. Tetapi retry TAK TERBATAS (Rp266,67) hanya sedikit lebih murah dari 3×, dengan risiko ekor: pada p yang melonjak (misal tool down, p → 0,9), biaya meledak ke Rp2.000 per invoice TANPA batas.",
        "Pembahasan: inilah kenapa batas retry adalah kontrol risiko, bukan sekadar kerapian. Angka 3× bukan sihir — ia titik impas antara \u201Ccukup untuk transient\u201D dan \u201Cberhenti sebelum bencana\u201D. Untuk tool GRATIS/murah boleh longgar; untuk tool BERBAYAR atau BERDAMPAK, 2–3× adalah standar industri.",
        "Sensitivitas terhadap p: p=0,1 → E = 200/0,9 = Rp222; p=0,5 → Rp400; p=0,9 → Rp2.000. Perhatikan pola: di bawah p≈0,7, retry adalah obat mujarab; di atas p≈0,7, E meledak dan obatnya BUKAN tambah retry melainkan PERBAIKI TOOL-nya (atau ganti vendor). Banyak tim terjebak menaikkan max_retry dari 3 ke 10 padahal p=0,85 — itu seperti menambal ban yang robek dengan lakban: tiap lapis terlihat membantu, tetapi bannya tetap robek.",
        "Biaya tersembunyi retry adalah LATENCY. Timeout 30 detik × 3 retry = 90 detik per invoice. Untuk 12 invoice berurutan dengan 25% gagal: ekspektasi waktu = 12 × (0,75×2 dtk + 0,25×62 dtk) ≈ 12 × 17 = 204 detik — vs 24 detik tanpa gangguan. Jika SLA pemrosesan 60 detik, retry “sukses” tetap = SLA dilanggar. Desain yang benar: retry PARALEL-async atau circuit breaker (setelah 5 gagal beruntun, berhenti mencoba selama 1 menit — AAI9).",
        "Skala 10.000 invoice per hari: dengan retry 3×, E total = 10.000 × Rp340,63 = Rp3,41 juta/hari. Tanpa retry: 10.000 × Rp1.450 = Rp14,5 juta/hari. Selisih Rp11,1 juta/hari = Rp333 juta/bulan = gaji 4 insinyur senior. Satu fungsi retry 15 baris bernilai 4 orang. Inilah cara menjual engineering ke direksi: bukan “kode yang rapi”, melainkan “Rp333 juta per bulan”.",
        "Jadikan p angka NEGOSIASI, bukan takdir. Kontrak SLA dengan vendor tool: “p_timeout ≤ 0,1, atau penalti”. Jika p=0,25 seperti minicase, E=Rp340; jika vendor memperbaiki ke p=0,1, E=Rp244 — hemat 28% tanpa mengubah satu baris kodemu. Insinyur junior mengoptimasi retry; insinyur senior menelepon vendor. Kualitas tool adalah variabel bisnis sebelum menjadi variabel teknik.",
        "Tabel p vs ekspektasi biaya (c=Rp200, manual=Rp5.000, retry maks 3×). p=0,05: E=Rp211 — retry hampir gratis. p=0,1: E=Rp244. p=0,25: E=Rp341. p=0,5: E=Rp1.050 (suku gagal total Rp625 mulai dominan). p=0,8: E=Rp3.048. p=0,95: E=Rp4.665 — mendekati manual langsung. Pola: E naik PELAN sampai p≈0,5, lalu MELEDAK. Titik belok inilah yang harus diketahui: di bawah 0,5, optimasi retry; di atas 0,5, perbaiki atau ganti tool. Cetak tabel ini dan tempel di samping monitor — ia menjawab “tambah retry atau perbaiki tool?” dalam 5 detik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rumus E = c/(1−p) adalah deret geometri — sama dengan yang dipakai untuk expected loss retry pada sistem pembayaran. Bedanya: di agentic AI, \u201Cp\u201D bisa berubah tiba-tiba saat provider tool gangguan. Stress-test dengan p = 0,9 sebelum deploy, bukan setelah tagihan datang.",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada klasifikasi error — itu pembeda insinyur agen junior dan senior.",
      ],
      tasks: [],
      summary: [
        "Tool = kontrak: nama, deskripsi, skema argumen, format hasil, dan error yang bisa dibaca agen.",
        "Fakta dunia nyata / komputasi presisi / aksi berdampak → tool. Penalaran murni → jawab langsung.",
        "Validasi SEBELUM eksekusi; idempotency key untuk aksi berdampak.",
        "Retry hanya untuk error transient (maks 2–3×); error validasi diperbaiki, bukan di-retry.",
        "E[biaya] = c/(1−p): turunkan p dengan validasi, batasi ekor dengan retry terbatas.",
      ],
      next: { label: "AAI4 — Memory: Ingatan Jangka Pendek & Panjang", href: "/learn/aai4-memory" },
      quiz: [
        {
          q: "Tool OCR menolak argumen \u201C47.500\u201D dengan error validasi. Respons TEPAT agen?",
          options: [
            { text: "Retry 3× dengan argumen yang sama", why: "Error validasi bersifat permanen — retry tidak akan mengubah hasil, hanya membakar biaya.", },
            { text: "Perbaiki format argumen (47500) lalu panggil ulang", why: "Tepat. Klasifikasikan dulu: validasi → perbaiki; transient → retry.", correct: true },
            { text: "Tebak hasilnya dari pola angka", why: "Itulah yang menyebabkan selisih 100× di cerita Dina.", },
            { text: "Abaikan dan lanjut ke invoice berikut", why: "Melewatkan data diam-diam = laporan tidak lengkap tanpa jejak.", },
          ],
        },
        {
          q: "c = Rp200, p = 0,25, retry tak terbatas. E[biaya] per invoice?",
          options: [
            { text: "Rp200", why: "Itu biaya tanpa kegagalan — tidak realistis.", },
            { text: "Rp266,67", why: "200/(1−0,25) = 266,67. Deret geometri dari peluang gagal berulang.", correct: true },
            { text: "Rp450", why: "Tidak ada dasar perhitungannya.", },
            { text: "Rp1.450", why: "Itu biaya TANPA retry (termasuk penalti manual Rp5.000 × 0,25).", },
          ],
        },
        {
          q: "Kenapa aksi \u201Ckirim_transfer\u201D butuh idempotency key?",
          options: [
            { text: "Agar lebih cepat", why: "Idempotency tidak memengaruhi kecepatan.", },
            { text: "Agar retry yang terduplikasi tidak mengeksekusi dua kali", why: "Tepat. Retry + aksi berdampak tanpa idempotency = transfer ganda.", correct: true },
            { text: "Agar argumen tervalidasi", why: "Validasi adalah lapisan terpisah.", },
            { text: "Agar log lebih rapi", why: "Bukan soal kerapian log.", },
          ],
        },
        {
          q: "Kapan agen sebaiknya TIDAK memanggil tool?",
          options: [
            { text: "Saat butuh kurs hari ini", why: "Itu fakta dunia nyata — wajib tool.", },
            { text: "Saat menjelaskan implikasi angka yang sudah ada di konteks", why: "Tepat. Penalaran murni dari konteks tidak butuh tool; memanggilnya hanya menambah latency dan biaya.", correct: true },
            { text: "Saat menjumlahkan 12 invoice", why: "Aritmetika presisi — wajib kalkulator, bukan tebakan digit.", },
            { text: "Saat datanya bisa basi", why: "Data yang bisa basi justru alasan UTAMA memanggil tool.", },
          ],
        },
        {
          q: "Tool search melempar TimeoutError dua kali berturut-turut lalu sukses di percobaan ketiga. Dengan kebijakan retry maks 3×, apa yang terjadi?",
          options: [
            { text: "Agen crash di percobaan pertama", why: "Itu perilaku agen tanpa penanganan error — yang sedang kita perbaiki.", },
            { text: "Agen sukses di percobaan ketiga dan melanjutkan", why: "Tepat. Inilah skenario yang dirancang untuk ditangani retry terbatas.", correct: true },
            { text: "Agen retry selamanya", why: "Batas 3× mencegah loop abadi.", },
            { text: "Agen mengarang jawaban", why: "Fallback jujur (\u201Cdata tidak ditemukan\u201D) — bukan karangan — hanya jika retry habis.", },
          ],
        },
      ],
    },
  ],
};
