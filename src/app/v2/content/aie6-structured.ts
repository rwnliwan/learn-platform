import type { V2Lesson } from "../lib/types";

// Batang validitas: 40% tanpa retry vs 80% dengan retry.
const FIG_VALID = `<svg viewBox="0 0 480 240" role="img" aria-label="Validitas 40 persen tanpa retry vs 80 persen dengan retry.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="200" x2="460" y2="200"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="110" x2="460" y2="110"/><line x1="44" y1="65" x2="460" y2="65"/><line x1="44" y1="20" x2="460" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="204">0%</text><text x="38" y="159">25%</text><text x="38" y="114">50%</text><text x="38" y="69">75%</text><text x="38" y="24">100%</text></g>
<rect x="120" y="128" width="100" height="72" fill="var(--c4)"/>
<rect x="300" y="56" width="100" height="144" fill="var(--c1)"/>
<g fill="var(--text)" font-size="13" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="170" y="118">40%</text><text x="350" y="46">80%</text></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="170" y="222">tanpa retry</text><text x="350" y="222">schema + retry</text></g>
<text x="240" y="14" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">2 dari 5 valid → 4 dari 5 valid</text>
</svg>`;

export const aie6: V2Lesson = {
  slug: "aie6-structured",
  track: "AI Engineering",
  module: "RAG & Retrieval",
  title: "AIE6 — Structured Output dan Function Calling",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-jam-dua-pagi",
      eyebrow: "Langkah 1 · Cerita",
      title: "Koma yang hilang jam 2 pagi",
      prose: [
        "Pipeline invoice NusaBank berjalan mulus tiga minggu. Lalu jam 2 pagi, pager berbunyi: parser meledak. Penyebabnya satu output model: JSON yang 'hampir benar' — koma hilang setelah satu field. Seribu invoice antre, tim lembur sampai subuh.",
        "Twist-nya: model itu 99 persen valid. Terdengar hebat — sampai kamu hitung: 10.000 request per hari x 1 persen = 100 ledakan per hari. Di skala produksi, 99 persen adalah nilai yang gagal. Solusinya tiga lapis: skema yang divalidasi mesin, retry otomatis dengan pesan kesalahan, dan eskalasi manusia bila tetap gagal. Validitas naik ke praktis 100 persen — bukan karena modelnya berubah, melainkan karena sistemnya tidak lagi percaya buta.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menulis JSON schema dan memvalidasi output; (2) membangun retry loop dengan batas; (3) menghitung peluang gagal setelah k retry; (4) memutuskan kapan memakai function calling; (5) merancang eskalasi saat retry mentok.",
        "🗺️ Isi lesson: Langkah 1 · Cerita koma hilang — Langkah 2 · Schema dan validasi — Langkah 3 · Lab: validasi + retry — Langkah 4 · Function calling — Langkah 5 · Lab: router tool — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Output untuk mesin = kontrak (schema) + validasi + retry + eskalasi. Jangan percaya output buta.",
    },
    {
      id: "konsep-schema",
      eyebrow: "Langkah 2 · Schema dan validasi",
      title: "Schema: kontrak yang bisa dicek mesin",
      prose: [
        "JSON schema mendefinisikan field wajib, tipe tiap field, dan formatnya — sebelum satu baris kode konsumen berjalan. Validasi adalah penjaga gerbang: output yang lolos schema baru boleh masuk database; yang gagal dikembalikan ke model dengan pesan kesalahan spesifik ('field total harus angka, bukan string') agar upaya kedua lebih baik.",
        "Retry loop yang benar: coba → validasi → bila gagal, kirim ulang prompt + output gagal + pesan error → ulangi maksimal 3x → bila masih gagal, eskalasi ke manusia. Tanpa batas, retry adalah loop tak berhingga yang membakar uang. Tanpa pesan error, retry hanya mengulang kesalahan yang sama.",
        "Kepribadian schema: ia seperti satpam gedung yang memeriksa ID — tidak peduli seberapa meyakinkan wajahmu (teksnya), tanpa ID yang valid (tipe benar) kamu tidak masuk.",
        "Strict vs lax — trade-off terukur. Schema strict (semua field required, enum ketat): validasi gagal 8 persen (model “kreatif” ditolak) tetapi downstream TIDAK PERNAH crash. Schema lax (optional banyak): gagal 1 persen tetapi 3 persen data cacat lolos → crash jam 2 pagi. Pilih: strict untuk pembayaran/kesehatan (benar > lancar); lax untuk analytics (lancar > sempurna). Ketegasan schema = cerminan biaya kegagalan downstream.",
        "Constrained decoding — jaminan struktural. Daripada minta JSON lalu validasi (gagal 8 persen), paksa model HANYA menghasilkan token yang valid sesuai schema (grammar-constrained): gagal 0 persen, selamanya. Biaya: latensi +10 persen, setup 1 hari. Untuk pembayaran: WAJIB. Analogi: validasi = memeriksa SIM setelah mengemudi; constrained = mobil yang tidak bisa ngebut. Cegah > periksa, untuk yang kritis.",
        "Schema evolution — versi API untuk AI. Tambah field baru: v2 schema, dukung v1 selama 3 bulan (model lama masih memakainya!). Hapus field: JANGAN (tambah deprecated dulu). Tanpa versioning: 1 perubahan schema = 5 pipeline downstream rusak jam 2 pagi. Schema = kontrak; kontrak berubah = negosiasi, bukan pengumuman. Perlakukan seperti API publik.",
      ],
      formula: String.raw`P_{\text{gagal}} = (1-p)^k`,
      formulaNote: "P_gagal = peluang SEMUA upaya gagal; p = peluang satu upaya menghasilkan output valid; k = jumlah upaya. Contoh: p=0,4, k=3 → P_gagal = 0,6³ = 21,6 persen, validitas naik dari 40 ke 78,4 persen. Tiap retry melipatgandakan keandalan — dengan harga token tambahan.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Model terbaru sudah bisa JSON, jadi validasi tidak perlu.' Salah. 'Bisa' bukan 'selalu': 99 persen valid masih berarti ratusan error per hari di skala produksi. Validasi bukan ketidakpercayaan pada model — ia adalah sabuk pengaman yang dipakai bahkan oleh pengemudi terbaik.",
      },
      reference: "Schema dulu, validasi selalu, retry maks 3x dengan pesan error, lalu eskalasi.",
    },
    {
      id: "lab-validasi",
      eyebrow: "Langkah 3 · Lab validasi",
      title: "Lab: dari 2/5 menjadi 4/5",
      prose: [
        "Lima output mock model: satu sempurna, satu total bertipe string, satu kehilangan field, satu koma menggantung (JSON tidak valid), satu sempurna lagi. Fungsi `valid` memeriksa tiap output terhadap `SCHEMA_WAJIB`; `mock_retry` mensimulasikan perbaikan pada dua kasus yang bisa diperbaiki.",
        "Coba ubah: buat `mock_retry` juga memperbaiki kasus field hilang (tambahkan jatuh_tempo default), jalankan ulang, dan lihat validitas menjadi 5/5. Retry yang cerdas tahu cara memperbaiki, bukan sekadar mengulang.",
      ],
      figure: {
        svg: FIG_VALID,
        alt: "Validitas 40 persen tanpa retry vs 80 persen dengan retry.",
        caption: "Cara membaca: tinggi batang = proporsi output yang lolos schema dari 5 sampel; sumbu Y 0–100 persen. Interpretasi: validasi saja hanya menyaring (2/5 lolos); validasi + retry memperbaiki (4/5 lolos) karena dua kesalahan — tipe string dan koma menggantung — bisa diperbaiki otomatis. Satu kasus (field hilang) butuh eskalasi manusia: sistem yang jujur tahu kapan menyerah.",
      },
      tasks: [
        { id: "t1", text: "Hitung `v1` (valid awal) dan `v2` (valid setelah `mock_retry`)" },
        { id: "t2", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "valid_awal=2/5  valid_retry=4/5",
      note: {
        title: "💡 Intuisi",
        body: "Pesan error yang spesifik adalah bahan bakar retry yang baik. 'JSON tidak valid' membuat model menebak; 'field total harus angka, bukan string' memberinya peta. Retry tanpa diagnosis hanya mengulang kegagalan dengan lebih mahal.",
      },
      hints: [
        "v1 = sum(1 for s in MOCK_OUTPUTS if valid(s))",
        "v2 memakai mock_retry: sum(1 for s in MOCK_OUTPUTS if valid(mock_retry(s)))",
        "Format: f\"valid_awal={v1}/5  valid_retry={v2}/5\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nimport json\n\nSCHEMA_WAJIB = {"id": str, "total": (int, float), "jatuh_tempo": str}\n\nMOCK_OUTPUTS = [\n    '{"id": "Inv-001", "total": 1500000, "jatuh_tempo": "2026-01-12"}',\n    '{"id": "Inv-002", "total": "250000", "jatuh_tempo": "2026-02-03"}',\n    '{"id": "Inv-003", "total": 12000000}',\n    '{"id": "Inv-004", "total": 75000, "jatuh_tempo": "2026-03-28",}',\n    '{"id": "Inv-005", "total": 90000, "jatuh_tempo": "2026-04-01"}',\n]\n\ndef valid(s):\n    try:\n        d = json.loads(s)\n    except Exception:\n        return False\n    return all(k in d and isinstance(d[k], t) for k, t in SCHEMA_WAJIB.items())\n\ndef mock_retry(s):\n    # simulasi retry: sebagian output rusak bisa diperbaiki\n    if '"total": "250000"' in s:\n        return s.replace('"total": "250000"', '"total": 250000')\n    if s.endswith(",}"):\n        return s[:-2] + "}"\n    return s\n\n# TULIS KODEMU: validitas awal vs setelah retry\nv1 = \nv2 = \n\nprint(f"valid_awal={v1}/5  valid_retry={v2}/5")`,
        lockLines: 29,
        solution: `# DATA SEED — jangan ubah\nimport json\n\nSCHEMA_WAJIB = {"id": str, "total": (int, float), "jatuh_tempo": str}\n\nMOCK_OUTPUTS = [\n    '{"id": "Inv-001", "total": 1500000, "jatuh_tempo": "2026-01-12"}',\n    '{"id": "Inv-002", "total": "250000", "jatuh_tempo": "2026-02-03"}',\n    '{"id": "Inv-003", "total": 12000000}',\n    '{"id": "Inv-004", "total": 75000, "jatuh_tempo": "2026-03-28",}',\n    '{"id": "Inv-005", "total": 90000, "jatuh_tempo": "2026-04-01"}',\n]\n\ndef valid(s):\n    try:\n        d = json.loads(s)\n    except Exception:\n        return False\n    return all(k in d and isinstance(d[k], t) for k, t in SCHEMA_WAJIB.items())\n\ndef mock_retry(s):\n    # simulasi retry: sebagian output rusak bisa diperbaiki\n    if '"total": "250000"' in s:\n        return s.replace('"total": "250000"', '"total": 250000')\n    if s.endswith(",}"):\n        return s[:-2] + "}"\n    return s\n\n# TULIS KODEMU: validitas awal vs setelah retry\nv1 = sum(1 for s in MOCK_OUTPUTS if valid(s))\nv2 = sum(1 for s in MOCK_OUTPUTS if valid(mock_retry(s)))\n\nprint(f"valid_awal={v1}/5  valid_retry={v2}/5")`,
        checks: [
          { kind: "equal", task: "t1", name: "v1", value: 2, tol: 1e-9, label: "`v1` seharusnya 2", msg: "Hanya Inv-001 dan Inv-005 yang lolos schema." },
          { kind: "equal", task: "t1", name: "v2", value: 4, tol: 1e-9, label: "`v2` seharusnya 4", msg: "Retry memperbaiki Inv-002 (tipe) dan Inv-004 (koma). Inv-003 (field hilang) tetap gagal." },
          { kind: "stdout_matches", task: "t2", pattern: "valid_awal=2/5\\s+valid_retry=4/5", label: "`print` menampilkan keduanya", msg: "Format: valid_awal=2/5  valid_retry=4/5." },
        ],
      },
      reference: "Validasi menyaring; retry memperbaiki; eskalasi menangani sisanya. Tiga lapis, bukan satu.",
    },
    {
      id: "konsep-function-calling",
      eyebrow: "Langkah 4 · Function calling",
      title: "Function calling: model memesan, sistem mengeksekusi",
      prose: [
        "Kadang model tidak cukup menjawab — ia harus BERTINDAK: cek saldo, blokir kartu, jadwalkan transfer. Function calling memberi model daftar tool (nama, deskripsi, parameter) dan memintanya mengembalikan PANGGILAN terstruktur, bukan teks bebas. Sistemmu yang mengeksekusi — model tidak pernah menyentuh database langsung.",
        "Anatomi: definisi tool (schema JSON per fungsi), router (memilih tool dari intent), eksekutor (menjalankan dengan validasi parameter), dan audit log (siapa memanggil apa). Aturan emas: model mengusulkan, sistem memutuskan — validasi parameter dan otorisasi tetap di tangan kodemu.",
        "Kepribadian function calling: model adalah resepsionis yang mencatat pesanan dengan rapi; dapur (sistemmu) yang memasak dan bertanggung jawab atas makanannya.",
        "Akurasi router — angka yang menentukan. Router kata kunci: 82 persen benar (gagal pada parafrase: “saldo” vs “sisa duit”). Router LLM kecil: 96 persen, biaya Rp50 ribu/hari. 14 persen salah route × 10.000 request = 1.400 salah tool/hari × Rp5 ribu biaya = Rp7 juta/hari! Router LLM “mahal” Rp50 ribu menghemat Rp7 juta. Jangan hemat di router — ia polisi lalu lintas seluruh sistem.",
        "Parallel function calling — kapan. “Bandingkan saldo 3 rekening” = 3 call independen → paralel (1,2 detik vs 3,6 detik sekuensial). “Cek saldo lalu transfer” = dependen → SEQUENTIAL (jangan paralel! transfer butuh hasil cek). Aturan: independen → paralel; dependen → sekuensial. Model modern mendukung keduanya; arsitekturnya yang menentukan. Salah paralel = race condition dengan uang asli.",
        "Idempotency key untuk tool — jangan ganda. 'Transfer Rp1 juta' dipanggil 2x (retry!) = Rp2 juta terkirim? Kunci idempotency: 'transfer-abc123' diproses SEKALI. Untuk tool tulis: WAJIB. Tanpa: retry = mesin pengganda uang.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Function calling berarti model mengeksekusi kode.' Salah dan berbahaya. Model hanya menghasilkan STRUKTUR panggilan; eksekusi, validasi, dan otorisasi 100 persen di kodemu. Memberi model akses eksekusi langsung adalah pintu keamanan yang terbuka lebar.",
      },
      reference: "Model mengusulkan (struktur), sistem mengeksekusi (dengan validasi + otorisasi + audit).",
    },
    {
      id: "lab-router",
      eyebrow: "Langkah 5 · Lab router",
      title: "Lab: router tool dari kata kunci",
      prose: [
        "Router sederhana: tiap tool punya daftar kata kunci; query yang mengandung kata kunci dirutekan ke tool itu, sisanya dijawab langsung. Di produksi, router bisa berupa model klasifikasi — tetapi prinsipnya sama: intent → tool → parameter tervalidasi.",
        "Coba ubah: tambah query 'sisa uang saya berapa?' dan lihat ia dirutekan ke cek_saldo. Lalu coba 'halo' — ia jatuh ke jawab_langsung. Router yang baik tahu kapan TIDAK memakai tool.",
      ],
      tasks: [
        { id: "t1", text: "Buat `hasil`: rute tiap query di QUERIES" },
        { id: "t2", text: "Hitung `n_tool`: yang memakai tool (bukan jawab_langsung)" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "rute=['cek_saldo', 'blokir_kartu', 'jadwalkan_transfer', 'jawab_langsung']  pakai_tool=3/4",
      note: {
        title: "💡 Intuisi",
        body: "Jawaban 'jawab_langsung' sama pentingnya dengan tool yang tepat. Router yang memaksakan tool pada obrolan biasa ('halo', 'terima kasih') akan memicu aksi yang tidak diminta — sumber bug paling memalukan di asisten AI.",
      },
      hints: [
        "hasil = [route(q) for q in QUERIES]",
        "n_tool = sum(1 for h in hasil if h != \"jawab_langsung\")",
        "print(f\"rute={hasil}  pakai_tool={n_tool}/4\") — list tercetak apa adanya.",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nTOOLS = {\n    "cek_saldo": ["saldo", "sisa uang"],\n    "blokir_kartu": ["hilang", "blokir", "dicuri"],\n    "jadwalkan_transfer": ["transfer", "kirim uang"],\n}\n\nQUERIES = [\n    "berapa saldo saya?",\n    "kartu saya hilang dicuri",\n    "tolong transfer 500 ribu ke budi",\n    "info bunga deposito",\n]\n\ndef route(q):\n    ql = q.lower()\n    for tool, kws in TOOLS.items():\n        if any(k in ql for k in kws): return tool\n    return "jawab_langsung"\n\n# TULIS KODEMU: rute tiap query\nhasil = \nn_tool = \n\nprint(f"rute={hasil}  pakai_tool={n_tool}/4")`,
        lockLines: 21,
        solution: `# DATA SEED — jangan ubah\nTOOLS = {\n    "cek_saldo": ["saldo", "sisa uang"],\n    "blokir_kartu": ["hilang", "blokir", "dicuri"],\n    "jadwalkan_transfer": ["transfer", "kirim uang"],\n}\n\nQUERIES = [\n    "berapa saldo saya?",\n    "kartu saya hilang dicuri",\n    "tolong transfer 500 ribu ke budi",\n    "info bunga deposito",\n]\n\ndef route(q):\n    ql = q.lower()\n    for tool, kws in TOOLS.items():\n        if any(k in ql for k in kws): return tool\n    return "jawab_langsung"\n\n# TULIS KODEMU: rute tiap query\nhasil = [route(q) for q in QUERIES]\nn_tool = sum(1 for h in hasil if h != "jawab_langsung")\n\nprint(f"rute={hasil}  pakai_tool={n_tool}/4")`,
        checks: [
          { kind: "defined", task: "t1", name: "hasil", label: "`hasil` terdefinisi", msg: "hasil = [route(q) for q in QUERIES]." },
          { kind: "equal", task: "t2", name: "n_tool", value: 3, tol: 1e-9, label: "`n_tool` seharusnya 3", msg: "Tiga query memakai tool; 'info bunga deposito' dijawab langsung." },
          { kind: "stdout_matches", task: "t3", pattern: "rute=\\['cek_saldo', 'blokir_kartu', 'jadwalkan_transfer', 'jawab_langsung'\\]\\s+pakai_tool=3/4", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Router yang baik tahu kapan memakai tool DAN kapan tidak.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: kapan struktur seketat apa",
      prose: [
        "Satu, konsumen output adalah kode (API, database, pipeline) — schema ketat + validasi + retry; tidak ada kompromi. Dua, model perlu memicu aksi dunia nyata (transfer, blokir) — function calling dengan validasi parameter dan otorisasi di sistemmu; model tidak pernah eksekusi langsung.",
        "Tiga, output untuk dibaca manusia (ringkasan, chat) — teks bebas cukup; schema opsional dan jangan sampai membuat jawaban kaku. Empat, retry sudah 3x dan masih gagal — berhenti, eskalasi ke manusia; loop ke-4 hampir tidak pernah menyelamatkan, hanya membakar token.",
        "Aturan praktis 10 detik: untuk mesin → kontrak; untuk aksi → tool; untuk manusia → bebas; untuk kegagalan berulang → manusia.",
        "Tangga ketegasan — empat tingkat. (1) Teks bebas: chatbot santai. (2) JSON longgar: internal tools. (3) Schema strict + validasi: pembayaran, data kesehatan. (4) Function calling + konfirmasi manusia: transfer dana, hapus data. Naik tangga = naik biaya (token + latensi + dev) tetapi turun risiko 10x per tingkat. Pilih tingkat = pilih premi asuransi. Untuk uang: minimal tingkat 3; untuk nyawa/data: tingkat 4.",
        "Skenario 6 — tool eksternal tak terpercaya → sandbox + timeout + validasi output. Jangan percaya output tool buta-buta; validasi schema SEBELUM dipakai. Tool = tamu, bukan keluarga.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Struktur adalah pajak yang kamu bayar untuk keandalan. Bayar pajak penuh untuk mesin (ia tidak bisa 'memahami maksudmu'), bayar sebagian untuk aksi (parameter harus tepat), dan bebaskan manusia (kekakuan membunuh pengalaman).",
      },
      reference: "Mesin → schema. Aksi → function calling. Manusia → teks bebas. Gagal 3x → eskalasi.",
    },
    {
      id: "minicase-retry",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: retry yang 'boros' dengan ROI 80x",
      prose: [
        "Pipeline 10.000 invoice per bulan. Tanpa validasi: 60 persen output bermasalah (seperti lab: 3 dari 5) → 6.000 invoice x Rp20.000 perbaikan manual = Rp120 juta per bulan. Dengan schema + retry: invalid turun ke 20 persen → 2.000 x Rp20.000 = Rp40 juta. Hemat Rp80 juta.",
        "Biaya retry: 6.000 upaya ulang x Rp160 per request ≈ Rp960 ribu. ROI: Rp80 juta / Rp960 ribu ≈ 80x. Twist: engineer yang menolak retry karena 'memboroskan token' menghemat Rp960 ribu sambil membuang Rp80 juta — seperti menolak membeli gembok Rp50 ribu untuk gudang berisi Rp4 miliar.",
        "Sisa 20 persen yang tetap gagal setelah 3x retry masuk antrean manusia — dan setiap kasusnya dicatat untuk memperbaiki prompt minggu depan. Kegagalan adalah data, bukan sampah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Invoice invalid yang lolos ke pembayaran adalah risiko operasional murni: salah bayar, denda keterlambatan, temuan audit. Schema + validasi di sini setara dengan rekonsiliasi di dunia keuangan — kontrol yang tidak bisa ditawar.",
      },
      reference: "Hitung ROI retry: (error dicegah x biaya per error) / (biaya retry). Biasanya puluhan kali lipat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Output untuk mesin butuh kontrak: JSON schema + validasi + retry (maks 3x) + eskalasi.",
        "P_gagal = (1-p)^k: tiap retry melipatgandakan keandalan dengan harga token.",
        "Retry yang baik membawa pesan error spesifik, bukan sekadar mengulang.",
        "Function calling: model mengusulkan struktur, sistem mengeksekusi dengan validasi dan otorisasi.",
        "99 persen valid = 100 error per hari di skala 10.000 request — ukur dalam angka absolut.",
      ],
      next: { label: "AIE7 — Caching, Batching, Optimasi Biaya", href: "/v2/learn/aie7-caching" },
      quiz: [
        {
          q: "Mengapa 99 persen validitas JSON tidak cukup di produksi?",
          options: [
            { text: "Karena 1 persen dari 10.000 request per hari = 100 error per hari", why: "Tepat: persentase menenangkan, angka absolut menakutkan. 100 ledakan parser per hari.", correct: true },
            { text: "Karena 99 persen berarti modelnya buruk", why: "99 persen sebenarnya bagus; masalahnya skala, bukan kualitas model.", correct: false },
            { text: "Karena JSON tidak cocok untuk produksi", why: "JSON sangat cocok; yang kurang adalah lapisan validasinya.", correct: false },
            { text: "Karena validitas tidak bisa diukur", why: "Sangat bisa diukur — seperti di lab dengan schema.", correct: false },
          ],
        },
        {
          q: "Apa fungsi JSON schema dalam pipeline LLM?",
          options: [
            { text: "Kontrak yang bisa divalidasi mesin sebelum output dipakai", why: "Tepat: schema adalah satpam — field dan tipe diperiksa sebelum masuk database.", correct: true },
            { text: "Membuat model menjawab lebih cepat", why: "Schema tidak memengaruhi kecepatan model.", correct: false },
            { text: "Mengenkripsi output model", why: "Schema bukan enkripsi.", correct: false },
            { text: "Menggantikan kebutuhan akan retry", why: "Kebalikannya: schema justru memberi tahu KAPAN retry dibutuhkan.", correct: false },
          ],
        },
        {
          q: "Retry loop yang benar?",
          options: [
            { text: "Ulangi tanpa batas sampai valid", why: "Tanpa batas = loop tak berhingga yang membakar uang.", correct: false },
            { text: "Validasi → bila gagal kirim ulang dengan pesan error spesifik → maks 3x → eskalasi", why: "Tepat: diagnosis spesifik + batas + jalan keluar manusia.", correct: true },
            { text: "Ulangi dengan prompt yang persis sama 3x", why: "Tanpa pesan error, model mengulang kesalahan yang sama.", correct: false },
            { text: "Jangan retry — langsung eskalasi selalu", why: "Terlalu mahal: 80 persen kasus bisa diperbaiki otomatis seperti di lab.", correct: false },
          ],
        },
        {
          q: "Kapan memakai function calling?",
          options: [
            { text: "Ketika model perlu memicu aksi dunia nyata via tool", why: "Tepat: cek saldo, blokir kartu, jadwalkan transfer — aksi terstruktur via tool.", correct: true },
            { text: "Ketika ingin jawaban chat yang ramah", why: "Chat ramah tidak butuh tool.", correct: false },
            { text: "Ketika ingin model mengeksekusi kode langsung", why: "Berbahaya dan salah: model hanya mengusulkan struktur, sistem yang eksekusi.", correct: false },
            { text: "Ketika tidak ada API yang tersedia", why: "Tanpa API/tool, function calling tidak ada gunanya.", correct: false },
          ],
        },
        {
          q: "Output tetap invalid setelah 3x retry. Tindakan yang benar?",
          options: [
            { text: "Retry terus sampai berhasil", why: "Kasus ini terbukti tidak bisa diperbaiki otomatis; retry lanjutan hanya membakar token.", correct: false },
            { text: "Eskalasi ke manusia dan catat kasusnya untuk perbaikan prompt", why: "Tepat: manusia menangani, catatannya menjadi data perbaikan minggu depan.", correct: true },
            { text: "Paksa masukkan ke database apa adanya", why: "Itu mengundang ledakan di hilir — persis insiden jam 2 pagi.", correct: false },
            { text: "Diamkan dan anggap tidak terjadi", why: "Error yang didiamkan menjadi bom waktu.", correct: false },
          ],
        },
      ],
    },
  ],
};
