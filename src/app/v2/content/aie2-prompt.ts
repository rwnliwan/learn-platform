import type { V2Lesson } from "../lib/types";

// Dua pasang batang: kepatuhan format v1/v2 dan akurasi ekstraksi zero-shot/few-shot.
const FIG_PROMPT = `<svg viewBox="0 0 480 250" role="img" aria-label="Kepatuhan format v1 60 persen vs v2 100 persen; akurasi ekstraksi zero-shot 75 persen vs few-shot 100 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="200" x2="460" y2="200"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="110" x2="460" y2="110"/><line x1="44" y1="65" x2="460" y2="65"/><line x1="44" y1="20" x2="460" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="204">0%</text><text x="38" y="159">25%</text><text x="38" y="114">50%</text><text x="38" y="69">75%</text><text x="38" y="24">100%</text></g>
<rect x="70" y="92" width="60" height="108" fill="var(--text-muted)" opacity="0.65"/>
<rect x="150" y="20" width="60" height="180" fill="var(--c1)"/>
<rect x="290" y="65" width="60" height="135" fill="var(--text-muted)" opacity="0.65"/>
<rect x="370" y="20" width="60" height="180" fill="var(--c4)"/>
<g fill="var(--text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="100" y="84">60%</text><text x="180" y="12">100%</text><text x="320" y="57">75%</text><text x="400" y="12">100%</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="100" y="218">v1 polos</text><text x="180" y="218">v2 terstruktur</text><text x="320" y="218">zero-shot</text><text x="400" y="218">few-shot</text><text x="140" y="238">kepatuhan format</text><text x="360" y="238">akurasi ekstraksi</text></g>
</svg>`;

export const aie2: V2Lesson = {
  slug: "aie2-prompt",
  track: "AI Engineering",
  module: "Fondasi",
  title: "AIE2 — Prompt Engineering Sistematis",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-whisperer",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sang 'prompt whisperer' dan rahasianya yang membosankan",
      prose: [
        "Di tim data NusaBank ada Dimas, dijuluki 'prompt whisperer'. Prompt buatannya jarang gagal; prompt orang lain sering ngawur. Semua mengira ia punya bakat merangkai kata-kata ajaib.",
        "Suatu hari Rina mengintip folder kerjanya. Isinya bukan kalimat ajaib: template dengan variabel `nama`, `tanggal`, `dokumen`; tiap template punya nomor versi; tiap versi punya skor di 40 contoh uji; dan tiap prompt menyertakan 3 contoh jawaban yang benar. Error ekstraksi tim turun dari 34 persen menjadi 6 persen — bukan karena Dimas pandai berkata-kata, melainkan karena ia memperlakukan prompt sebagai artefak yang direkayasa: bervariabel, berversi, dan terukur.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menyusun prompt dari empat komponen (instruksi, konteks, contoh, format); (2) memakai variabel templating dan versioning; (3) memutuskan kapan zero-shot, few-shot, atau chain-of-thought; (4) mengukur kepatuhan format output.",
        "🗺️ Isi lesson: Langkah 1 · Cerita whisperer — Langkah 2 · Anatomi prompt — Langkah 3 · Lab: template berversi — Langkah 4 · Lab: few-shot — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Langkah 7 · Embedding — Checkpoint.",
      ],
      tasks: [],
      reference: "Prompt engineering sistematis = struktur + variabel + versi + contoh + pengukuran. Bukan trial-and-error.",
    },
    {
      id: "anatomi-prompt",
      eyebrow: "Langkah 2 · Anatomi prompt",
      title: "Empat komponen prompt yang bisa diuji",
      prose: [
        "Prompt profesional punya empat komponen. Instruksi: peran dan tugas ('Kamu asisten analis. Klasifikasikan ke satu label.'). Konteks: informasi yang dibutuhkan ('Daftar label: ...'). Contoh (few-shot): 2–5 pasang input-output yang benar. Format output: skema yang bisa divalidasi mesin ('Jawab HANYA dengan label, tanpa kalimat lain.').",
        "Dua praktik membuatnya sistematis. Variabel templating: tulis `TEMPLATE.format(q=pertanyaan)` agar struktur prompt terpisah dari data — data kotor tidak merusak struktur. Versioning: simpan tiap versi dengan skornya; versi baru wajib mengalahkan versi lama di golden set sebelum dipakai.",
        "Kepribadian tiap komponen: instruksi adalah mandor — tegas dan spesifik. Konteks adalah bahan baku — lengkap tapi tidak berlebih. Contoh adalah pelatih — menunjukkan, bukan sekadar menyuruh. Format adalah kontrak — bisa dicek mesin, bukan janji manis.",
        "Prompt versioning — perlakukan seperti kode. Setiap perubahan prompt = commit (v1.2 → v1.3) + evaluasi di golden set SEBELUM deploy. Tanpa versioning: “kok kemarin bagus sekarang jelek?” tidak terjawab. Dengan: git diff menunjukkan tepat 1 baris berubah (contoh ditambah) → rollback 1 menit. Prompt yang tidak di-version = kode yang tidak di-git: berani, tetapi ceroboh. Mulai hari ini: prompts/ di repo, bukan di chat.",
        "Instruksi negatif sering backfire — angka. “Jangan sebut harga” → model menyebut harga 23 persen LEBIH SERING (efek ironis: menyebut larangan mengaktifkan konsepnya). Solusi: instruksi POSITIF (“Fokus pada fitur, bukan harga”) → pelanggaran turun ke 4 persen. Aturan: tulis yang DIINGINKAN, bukan yang DILARANG. Setiap “jangan” di prompt = calon backfire; audit prompt-mu sekarang.",
        "System vs user prompt — pembagian kerja. System: peran + aturan main + format (JARANG berubah, di-version ketat). User: data + pertanyaan (berubah tiap request). Kesalahan umum: menaruh aturan bisnis di user prompt (bisa di-override oleh... user!). Aturan: yang KRITIS (kepatuhan, format) = system; yang DINAMIS (data) = user. System prompt = konstitusi; user prompt = surat harian. Jangan tulis konstitusi di surat harian.",
        "Delimiters — detail yang menyelamatkan. Bungkus data user dengan ### atau XML tags (<data>...</data>): model 30 persen lebih jarang “tertukar” antara instruksi dan data. Tanpa delimiter: “Abaikan harga di atas” (di DATA) dibaca sebagai INSTRUKSI. Dengan: jelas mana perintah, mana data. 2 baris formatting = -30 persen prompt injection sukses. Murah, efektif, sering dilupakan.",
      ],
      formula: String.raw`\text{kepatuhan} = \frac{n_{\text{valid}}}{n}`,
      formulaNote: "n_valid = jumlah output yang persis mengikuti format kontrak (mis. satu label dari daftar); n = total output. Kepatuhan 1,0 artinya parser tidak pernah meledak — syarat mutlak sebelum output masuk ke sistem.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Prompt engineering = trial-and-error sampai dapat yang bagus.' Salah. Trial-and-error tanpa versi dan tanpa skor menghasilkan prompt yang rapuh: bagus hari ini, rusak saat model diperbarui. Yang sistematis: ubah satu komponen, ukur di golden set, catat versinya.",
      },
      reference: "Instruksi + konteks + contoh + format. Variabel untuk data, versi untuk evolusi, skor untuk keputusan.",
    },
    {
      id: "lab-template",
      eyebrow: "Langkah 3 · Lab template",
      title: "Lab: template bervariabel mengalahkan prompt polos",
      prose: [
        "Mock di bawah mensimulasikan dua dunia: `TEMPLATE_V1` polos ('Jawab pertanyaan berikut') membuat model menjawab bebas — kadang kalimat, kadang label. `TEMPLATE_V2` terstruktur memaksa satu label dari daftar. Fungsi `patuh` mengecek apakah output masuk daftar label yang sah.",
        "Coba ubah: hapus baris 'Jawab HANYA dengan satu label' dari `TEMPLATE_V2`, jalankan ulang, dan lihat kepatuhan v2 anjlok. Satu kalimat kontrak bisa bernilai 40 poin persentase.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `patuh_v1` dan `patuh_v2` (rata-rata fungsi `patuh` di `BANK`)" },
        { id: "t2", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "v1=60%  v2=100%",
      note: {
        title: "💡 Intuisi",
        body: "Model bahasa adalah peniru pola ulung. Prompt terstruktur bukan 'membujuk' model — ia memberi pola yang paling mudah ditiru: daftar label eksplisit. Kamu tidak perlu kalimat puitis; kamu perlu pola yang tidak ambigu.",
      },
      hints: [
        "Rata-rata = jumlah yang patuh dibagi len(BANK).",
        "Gunakan generator: sum(1 for b in BANK if patuh(b, TEMPLATE_V1))/len(BANK)",
        "Format persen: f\"v1={patuh_v1:.0%}  v2={patuh_v2:.0%}\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nTEMPLATE_V1 = "Jawab pertanyaan berikut: {q}"\nTEMPLATE_V2 = (\n    "Kamu asisten analis. Jawab HANYA dengan satu label dari daftar: "\n    "[saldo, blokir_kartu, info_bunga, bayar_tagihan, komplain].\\n"\n    "Pertanyaan: {q}\\nLabel:")\n\nBANK = [\n    "berapa saldo saya?", "kartu saya hilang", "bunga deposito?",\n    "bayar tagihan listrik", "komplain CS lambat",\n]\n\ndef mock_llm(prompt):\n    # mock deterministik: v1 rawan format bebas, v2 patuh label\n    if prompt.startswith("Kamu asisten"):\n        q = prompt.lower()\n        KW = {"saldo": "saldo", "hilang": "blokir_kartu", "bunga": "info_bunga",\n              "bayar": "bayar_tagihan", "komplain": "komplain", "lambat": "komplain"}\n        for kw, label in KW.items():\n            if kw in q: return label\n        return "tidak_tahu"\n    q = prompt.lower()\n    if "saldo" in q: return "Saldo Anda adalah Rp1.234.567"\n    if "hilang" in q: return "blokir_kartu"\n    if "bunga" in q: return "Suku bunga deposito 4,5%."\n    if "bayar" in q: return "bayar_tagihan"\n    return "komplain"\n\nLABELS = {"saldo", "blokir_kartu", "info_bunga", "bayar_tagihan", "komplain"}\n\ndef patuh(prompt, template):\n    return mock_llm(template.format(q=prompt)) in LABELS\n\n# TULIS KODEMU: hitung tingkat kepatuhan format v1 dan v2\npatuh_v1 = \npatuh_v2 = \n\nprint(f"v1={patuh_v1:.0%}  v2={patuh_v2:.0%}")`,
        lockLines: 34,
        solution: `# DATA SEED — jangan ubah\nTEMPLATE_V1 = "Jawab pertanyaan berikut: {q}"\nTEMPLATE_V2 = (\n    "Kamu asisten analis. Jawab HANYA dengan satu label dari daftar: "\n    "[saldo, blokir_kartu, info_bunga, bayar_tagihan, komplain].\\n"\n    "Pertanyaan: {q}\\nLabel:")\n\nBANK = [\n    "berapa saldo saya?", "kartu saya hilang", "bunga deposito?",\n    "bayar tagihan listrik", "komplain CS lambat",\n]\n\ndef mock_llm(prompt):\n    # mock deterministik: v1 rawan format bebas, v2 patuh label\n    if prompt.startswith("Kamu asisten"):\n        q = prompt.lower()\n        KW = {"saldo": "saldo", "hilang": "blokir_kartu", "bunga": "info_bunga",\n              "bayar": "bayar_tagihan", "komplain": "komplain", "lambat": "komplain"}\n        for kw, label in KW.items():\n            if kw in q: return label\n        return "tidak_tahu"\n    q = prompt.lower()\n    if "saldo" in q: return "Saldo Anda adalah Rp1.234.567"\n    if "hilang" in q: return "blokir_kartu"\n    if "bunga" in q: return "Suku bunga deposito 4,5%."\n    if "bayar" in q: return "bayar_tagihan"\n    return "komplain"\n\nLABELS = {"saldo", "blokir_kartu", "info_bunga", "bayar_tagihan", "komplain"}\n\ndef patuh(prompt, template):\n    return mock_llm(template.format(q=prompt)) in LABELS\n\n# TULIS KODEMU: hitung tingkat kepatuhan format v1 dan v2\npatuh_v1 = sum(1 for b in BANK if patuh(b, TEMPLATE_V1))/len(BANK)\npatuh_v2 = sum(1 for b in BANK if patuh(b, TEMPLATE_V2))/len(BANK)\n\nprint(f"v1={patuh_v1:.0%}  v2={patuh_v2:.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "patuh_v1", value: 0.6, tol: 1e-9, label: "`patuh_v1` seharusnya 0.6", msg: "v1 patuh 3 dari 5 (dua jawaban bebas: kalimat saldo dan kalimat bunga)." },
          { kind: "equal", task: "t1", name: "patuh_v2", value: 1.0, tol: 1e-9, label: "`patuh_v2` seharusnya 1.0", msg: "v2 patuh 5 dari 5 berkat kontrak label eksplisit." },
          { kind: "stdout_matches", task: "t2", pattern: "v1=60%\\s+v2=100%", label: "`print` menampilkan keduanya", msg: "Format: v1=60%  v2=100%." },
        ],
      },
      reference: "Satu kalimat kontrak format ('Jawab HANYA dengan...') bisa bernilai puluhan poin kepatuhan.",
    },
    {
      id: "lab-fewshot",
      eyebrow: "Langkah 4 · Lab few-shot",
      title: "Lab: contoh mengalahkan instruksi panjang",
      prose: [
        "Zero-shot: hanya instruksi, tanpa contoh. Few-shot: 2 contoh input-output sebelum pertanyaan asli. Mock `mock_zero_shot` meniru model yang tanpa contoh kadang mengembalikan kalimat ('tidak ditemukan') alih-alih angka; `mock_few_shot` meniru model yang melihat pola dari contoh dan selalu mengekstrak angka dengan regex mental yang sama.",
        "Perhatikan: contoh di sini bukan sekadar 'bantuan' — ia adalah spesifikasi format yang bisa dieksekusi. Dua contoh baik mengalahkan dua paragraf instruksi.",
      ],
      figure: {
        svg: FIG_PROMPT,
        alt: "Kepatuhan format v1 60 persen vs v2 100 persen; akurasi ekstraksi zero-shot 75 persen vs few-shot 100 persen.",
        caption: "Cara membaca: dua pasang batang. Kiri = kepatuhan format (apakah output berupa label sah); kanan = akurasi ekstraksi angka dari invoice; sumbu Y 0–100 persen. Interpretasi: struktur (v2) memperbaiki kepatuhan 60 menjadi 100 persen; contoh (few-shot) memperbaiki akurasi 75 menjadi 100 persen. Keduanya murah — tidak ada ganti model di sini, hanya rekayasa prompt.",
      },
      tasks: [
        { id: "t1", text: "Hitung `zs` (akurasi zero-shot) dan `fs` (akurasi few-shot)" },
        { id: "t2", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "zero-shot=75%  few-shot=100%",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Makin banyak contoh makin baik.' Salah. Setelah 3–5 contoh berkualitas, tambahan contoh memberi hasil yang makin kecil sambil menambah biaya token setiap request. Contoh yang beragam (beda format invoice) mengalahkan contoh yang banyak tapi mirip.",
      },
      hints: [
        "Bandingkan tiap mock dengan label emas di DOKUMEN.",
        "zs = sum(1 for t, g in DOKUMEN if mock_zero_shot(t) == g)/len(DOKUMEN)",
        "Pola yang sama untuk fs dengan mock_few_shot.",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nDOKUMEN = [\n    ("Inv-001 total Rp1.500.000 jatuh tempo 12 Jan", "1.500.000"),\n    ("Inv-002 total Rp250.000 jatuh tempo 3 Feb", "250.000"),\n    ("Tagihan Rp75.000 untuk layanan cloud", "75.000"),\n    ("Inv-003 total Rp12.000.000 jatuh tempo 28 Mar", "12.000.000"),\n]\n\ndef mock_zero_shot(teks):\n    # tanpa contoh: kadang mengembalikan kalimat, bukan angka\n    if teks.startswith("Inv"): return teks.split("total Rp")[1].split(" ")[0]\n    return "tidak ditemukan"\n\ndef mock_few_shot(teks):\n    # dengan 2 contoh: selalu angka\n    import re\n    m = re.search(r"Rp([\\d.]+)", teks)\n    return m.group(1) if m else "tidak ditemukan"\n\n# TULIS KODEMU: hitung akurasi zero-shot vs few-shot\nzs = \nfs = \n\nprint(f"zero-shot={zs:.0%}  few-shot={fs:.0%}")`,
        lockLines: 20,
        solution: `# DATA SEED — jangan ubah\nDOKUMEN = [\n    ("Inv-001 total Rp1.500.000 jatuh tempo 12 Jan", "1.500.000"),\n    ("Inv-002 total Rp250.000 jatuh tempo 3 Feb", "250.000"),\n    ("Tagihan Rp75.000 untuk layanan cloud", "75.000"),\n    ("Inv-003 total Rp12.000.000 jatuh tempo 28 Mar", "12.000.000"),\n]\n\ndef mock_zero_shot(teks):\n    # tanpa contoh: kadang mengembalikan kalimat, bukan angka\n    if teks.startswith("Inv"): return teks.split("total Rp")[1].split(" ")[0]\n    return "tidak ditemukan"\n\ndef mock_few_shot(teks):\n    # dengan 2 contoh: selalu angka\n    import re\n    m = re.search(r"Rp([\\d.]+)", teks)\n    return m.group(1) if m else "tidak ditemukan"\n\n# TULIS KODEMU: hitung akurasi zero-shot vs few-shot\nzs = sum(1 for t, g in DOKUMEN if mock_zero_shot(t) == g)/len(DOKUMEN)\nfs = sum(1 for t, g in DOKUMEN if mock_few_shot(t) == g)/len(DOKUMEN)\n\nprint(f"zero-shot={zs:.0%}  few-shot={fs:.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "zs", value: 0.75, tol: 1e-9, label: "`zs` seharusnya 0.75", msg: "Zero-shot gagal di dokumen non-invoice ('tidak ditemukan'). 3 dari 4 benar." },
          { kind: "equal", task: "t1", name: "fs", value: 1.0, tol: 1e-9, label: "`fs` seharusnya 1.0", msg: "Few-shot benar 4 dari 4 — pola dari contoh menutup kasus non-invoice." },
          { kind: "stdout_matches", task: "t2", pattern: "zero-shot=75%\\s+few-shot=100%", label: "`print` menampilkan keduanya", msg: "Format: zero-shot=75%  few-shot=100%." },
        ],
      },
      reference: "Contoh = spesifikasi format yang bisa dieksekusi. 2–5 contoh beragam mengalahkan instruksi panjang.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: zero-shot, few-shot, CoT, atau fine-tune?",
      prose: [
        "Satu, tugas umum dan sederhana (klasifikasi sentimen, ringkasan) — zero-shot dengan instruksi jelas sudah cukup; jangan bayar contoh yang tidak perlu. Dua, format atau gaya spesifik (ekstraksi invoice, tone brand) — few-shot 2–5 contoh; contoh adalah spesifikasi termurah.",
        "Tiga, penalaran multi-langkah (analisis laporan keuangan, diagnosa) — chain-of-thought: minta model menulis langkah sebelum jawaban, lalu verifikasi langkahnya. Empat, perilaku harus konsisten di ribuan edge case dan prompt sudah mentok — baru pertimbangkan fine-tune; ia mahal dan lambat, jadi jadikan pilihan terakhir, bukan pertama.",
        "Aturan praktis 10 detik: mulai zero-shot; tambah contoh bila format meleset; tambah langkah bila penalaran meleset; fine-tune hanya bila keduanya mentok dan volumenya besar.",
        "Matematika biaya CoT — hitung sebelum pakai. CoT menambah ~3x token output (penalaran sebelum jawaban). 10.000 invoice/hari × 500 token × Rp150/juta token = Rp750 ribu/hari tanpa CoT; dengan CoT = Rp2,25 juta/hari. Jika akurasi naik 2 persen (98→99,9?) dan tiap error = Rp50 ribu: hemat error = 200 × Rp50 ribu = Rp10 juta/hari — CoT WORTH IT. Jika error murah (Rp500): hemat Rp100 ribu < biaya Rp1,5 juta — JANGAN CoT. Selalu: (nilai error × Δakurasi) vs (Δtoken × harga).",
        "Kapan few-shot MENYESATKAN — waspada. Contoh yang bias (5 contoh “approve”, 1 “reject”) → model meniru distribusi contoh, bukan aturan (approve rate naik 40 persen!). Contoh kedaluwarsa (format invoice 2023, kini 2026) → model mengikuti format lama. Aturan: contoh HARUS seimbang + terkini + mewakili edge case. 3 contoh bagus > 10 contoh bias. Kualitas contoh = kualitas few-shot; tidak ada jalan pintas.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Eskalasi prompt itu seperti eskalasi obat: mulai dari dosis terkecil yang mempan. Tiap tingkat menambah biaya (token) dan kompleksitas. Engineer yang langsung lompat ke fine-tune seperti dokter yang langsung operasi untuk flu.",
      },
      reference: "zero-shot → few-shot → chain-of-thought → fine-tune. Naik tingkat hanya bila tingkat bawah terbukti mentok di golden set.",
    },
    {
      id: "minicase-invoice",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 10.000 invoice dan contoh yang 'mahal'",
      prose: [
        "NusaBank memproses 10.000 invoice vendor per bulan. Prompt zero-shot: akurasi 75 persen, 2.500 invoice salah ekstrak, tiap perbaikan manual Rp20.000 → biaya error Rp50 juta per bulan. Prompt few-shot (2 contoh, +400 token per request): akurasi 100 persen di sampel, biaya contoh tambahan 4 juta token x $0,5 per juta = $2 ≈ Rp32 ribu per bulan.",
        "Twist: few-shot 'lebih mahal per request' — tetapi totalnya Rp32 ribu vs Rp50 juta. Engineer yang hanya melihat harga per request akan memilih yang salah. Selalu hitung per bulan, per error, per total.",
        "Catatan jujur: 100 persen di sampel bukan jaminan 100 persen di produksi. Tetapkan monitoring: sampel 100 invoice per minggu dinilai manual; bila akurasi turun di bawah 97 persen, tambah contoh dari kasus gagal.",
        "Contoh “mahal” yang dihitung. 10.000 invoice/hari, tiap invoice butuh 3 contoh few-shot (300 token/contoh). Biaya contoh: 10.000 × 900 token × Rp150/jt = Rp1,35 juta/hari HANYA untuk contoh! Alternatif: fine-tune kecil (Rp20 juta sekali) → zero-shot 95 persen akurasi vs few-shot 97 persen. Break-even: Rp20 juta / (Rp1,35 juta − Rp0,45 juta)/hari = 22 hari. Setelah 22 hari, fine-tune LEBIH MURAH. “Contoh mahal” = biaya berulang yang terlihat murah per request.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Invoice yang salah ekstrak bukan sekadar biaya admin — salah bayar ke vendor adalah risiko operasional dan temuan audit. Few-shot di sini bukan optimasi kenyamanan, melainkan kontrol risiko yang murah.",
      },
      reference: "Bandingkan total bulanan (biaya token + biaya error), bukan harga per request.",
    },
    {
      id: "embedding-fondasi",
      eyebrow: "Langkah 7 · Embedding",
      title: "Embedding: saat prompt saja tidak cukup",
      prose: [
        "Dimas mentok. NusaBank menyimpan 5.000 dokumen kebijakan kredit; setiap pertanyaan nasabah butuh jawaban dari dokumen yang tepat. Menempelkan semua dokumen ke prompt mustahil: 5.000 × 500 token = 2,5 juta token — sekali tanya biayanya Rp375 ribu dan jendela konteks model meledak. Prompt terbaik pun tidak bisa menjawab dari dokumen yang tidak sempat ia baca.",
        "Embedding adalah fungsi yang mengubah teks menjadi daftar angka berdimensi tetap — sebuah vektor. Aturannya satu kalimat: teks yang maknanya mirip menghasilkan vektor yang berdekatan. \"Kucing\" bisa menjadi [0,90, 0,10], \"anjing\" [0,85, 0,15] — tetangga dekat; \"mobil\" [0,05, 0,90] — jauh. Vektor di lab ini mainan 4-dimensi yang meniru sifat itu; embedding produksi memakai ratusan dimensi yang dipelajari model khusus.",
        "Kedekatan dua vektor diukur dengan cosine similarity — kosinus sudut di antara keduanya:",
        "💡 Intuisi: embedding adalah peta makna. Setiap dokumen adalah kota, jarak antar kota adalah kemiripan makna, dan pertanyaanmu adalah titik di peta — pencarian semantik berarti menemukan kota-kota terdekat dari titikmu. Kamu tidak perlu membaca peta seluruh negeri untuk menjawab \"di mana kota terdekat\"; cukup ukur jarak dari titikmu.",
        "Embedding punya tiga pekerjaan tetap. Satu, pencarian semantik: cari berdasarkan makna, bukan kata kunci — query \"hewan peliharaan berbulu\" menemukan kalimat tentang kucing meski katanya berbeda. Dua, clustering: kelompokkan ribuan dokumen tanpa label apa pun. Tiga, klasifikasi ringan: bandingkan teks baru dengan contoh berlabel terdekatnya.",
        "Pola ekonomisnya: dari 5.000 dokumen, hitung kedekatannya ke query (murah, tanpa LLM), ambil 5 terdekat, lalu prompt HANYA dengan 5 dokumen itu — sekitar 2.500 token atau Rp375 per pertanyaan, seribu kali lebih murah daripada menelan semuanya. Ambil yang relevan dulu, baru minta model menjawab.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `cosine(a, b)`; hitung `skor` (dict id → similarity terhadap QUERY) dan simpan id teratas di `teratas`" },
        { id: "t2", text: "Cetak peringkat 4 kalimat dari yang paling mirip dengan `print`" },
      ],
      expected: "1. d1 (0.9997) — kucing; 4. d3 (0.1942) — mobil paling tidak terkait",
      note: {
        title: "🚨 Miskonsepsi: vektor dekat = jawaban benar",
        type: "pitfall",
        body: "Embedding hanya mengukur kemiripan makna, bukan kebenaran faktual. Kalimat \"Kucing bisa terbang ke bulan\" akan sangat dekat dengan query tentang kucing — dan tetap salah. Retrieval menemukan kandidat; verifikasi (sitasi, cek silang) yang menentukan kebenaran. Jangan pernah menyajikan hasil retrieval mentah sebagai jawaban final.",
      },
      hints: [
        "cosine(a, b) = dot / (|a| × |b|); |a| = sum(x*x for x in a) ** 0.5",
        "skor = {doc_id: cosine(QUERY, vec) for doc_id, vec in EMBED.items()}",
        "peringkat = sorted(skor, key=skor.get, reverse=True); teratas = peringkat[0]",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nKALIMAT = {\n    "d1": "Kucing tidur di atas sofa.",\n    "d2": "Anjing bermain di taman.",\n    "d3": "Mobil melaju di jalan tol.",\n    "d4": "Anak kucing bermain bola.",\n}\nEMBED = {\n    "d1": [0.90, 0.10, 0.05, 0.02],\n    "d2": [0.85, 0.15, 0.10, 0.03],\n    "d3": [0.05, 0.90, 0.08, 0.02],\n    "d4": [0.70, 0.30, 0.06, 0.04],\n}\nQUERY = [0.88, 0.12, 0.05, 0.02]  # vektor mainan untuk "hewan peliharaan berbulu"\n\n# TULIS KODEMU: implementasikan cosine(a, b), hitung skor tiap kalimat, urutkan, cetak peringkat\ndef cosine(a, b):\n\nskor = \nteratas = \nperingkat = \n\nfor i, doc_id in enumerate(peringkat, start=1):\n    print(f"{i}. {doc_id}: {skor[doc_id]:.4f} — {KALIMAT[doc_id]}")`,
        lockLines: 16,
        solution: `# DATA SEED — jangan ubah\nKALIMAT = {\n    "d1": "Kucing tidur di atas sofa.",\n    "d2": "Anjing bermain di taman.",\n    "d3": "Mobil melaju di jalan tol.",\n    "d4": "Anak kucing bermain bola.",\n}\nEMBED = {\n    "d1": [0.90, 0.10, 0.05, 0.02],\n    "d2": [0.85, 0.15, 0.10, 0.03],\n    "d3": [0.05, 0.90, 0.08, 0.02],\n    "d4": [0.70, 0.30, 0.06, 0.04],\n}\nQUERY = [0.88, 0.12, 0.05, 0.02]  # vektor mainan untuk "hewan peliharaan berbulu"\n\n# TULIS KODEMU: implementasikan cosine(a, b), hitung skor tiap kalimat, urutkan, cetak peringkat\ndef cosine(a, b):\n    dot = sum(x * y for x, y in zip(a, b))\n    na = sum(x * x for x in a) ** 0.5\n    nb = sum(x * x for x in b) ** 0.5\n    return dot / (na * nb)\n\nskor = {doc_id: cosine(QUERY, vec) for doc_id, vec in EMBED.items()}\nteratas = sorted(skor, key=skor.get, reverse=True)[0]\nperingkat = sorted(skor, key=skor.get, reverse=True)\n\nfor i, doc_id in enumerate(peringkat, start=1):\n    print(f"{i}. {doc_id}: {skor[doc_id]:.4f} — {KALIMAT[doc_id]}")`,
        checks: [
          { kind: "defined", task: "t1", name: "cosine", label: "fungsi `cosine` terdefinisi", msg: "Definisikan def cosine(a, b) yang mengembalikan dot/(|a|×|b|)." },
          { kind: "equal", task: "t1", name: "teratas", value: "d1", label: "kalimat paling mirip = d1", msg: "Query tentang hewan berbulu paling dekat dengan kalimat kucing (d1, cos ≈ 0,9997)." },
          { kind: "stdout_matches", task: "t2", pattern: "1\\. d1: 0\\.9997", label: "peringkat 1 = d1", msg: "Baris pertama harus '1. d1: 0.9997'." },
          { kind: "stdout_matches", task: "t2", pattern: "4\\. d3: 0\\.1942", label: "peringkat 4 = d3", msg: "Baris terakhir harus '4. d3: 0.1942' — kalimat mobil paling tidak terkait." },
        ],
      },
      reference: "Embedding = peta makna: cari tetangga terdekat dulu, baru prompt dengan yang relevan — bukan semua dokumen.",
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
        "Prompt profesional = instruksi + konteks + contoh + format output; variabel memisahkan struktur dari data; versi + skor memandu evolusi.",
        "Kepatuhan format = n_valid / n; kontrak format eksplisit ('Jawab HANYA dengan...') menaikkan kepatuhan drastis.",
        "Few-shot (2–5 contoh beragam) mengalahkan instruksi panjang untuk format spesifik; contoh adalah spesifikasi yang bisa dieksekusi.",
        "Eskalasi: zero-shot → few-shot → chain-of-thought → fine-tune; naik tingkat hanya bila terbukti mentok.",
        "Bandingkan total biaya bulanan (token + error), bukan harga per request.",
      ],
      next: { label: "AIE3 — RAG: Chunking, Embedding, Retrieval", href: "/v2/learn/aie3-rag" },
      quiz: [
        {
          q: "Prompt yang lengkap dan bisa diuji terdiri dari…",
          options: [
            { text: "Instruksi, konteks, contoh, dan format output", why: "Tepat: empat komponen ini masing-masing bisa diubah dan diukur dampaknya.", correct: true },
            { text: "Sapaan ramah, emoji, dan kalimat persuasif", why: "Itu kosmetik; tidak ada yang bisa diuji dari keramahan.", correct: false },
            { text: "Satu kalimat perintah yang sependek mungkin", why: "Singkat belum tentu jelas; tanpa konteks dan format, output tidak terkontrol.", correct: false },
            { text: "Copy-paste dokumentasi produk yang panjang", why: "Konteks mentah tanpa instruksi dan format membuat model menebak-nebak.", correct: false },
          ],
        },
        {
          q: "Mengapa few-shot menaikkan akurasi ekstraksi di lab?",
          options: [
            { text: "Contoh membuat prompt lebih panjang sehingga model lebih serius", why: "Panjang bukan penyebabnya; prompt panjang tanpa pola tidak membantu.", correct: false },
            { text: "Contoh memberi pola input-output konkret yang tinggal ditiru model", why: "Tepat: model adalah peniru pola; contoh adalah spesifikasi format yang bisa dieksekusi.", correct: true },
            { text: "Contoh melatih ulang bobot model", why: "Prompt tidak mengubah bobot model sama sekali — itu wilayah fine-tuning.", correct: false },
            { text: "Contoh membuat model memakai lebih banyak token sehingga lebih teliti", why: "Token lebih banyak justru menambah biaya; ketelitian datang dari pola, bukan jumlah token.", correct: false },
          ],
        },
        {
          q: "Kapan versioning prompt paling berharga?",
          options: [
            { text: "Saat versi baru ternyata lebih buruk — bisa rollback ke versi lama yang terukur", why: "Tepat: versi + skor membuat kegagalan bisa dipulihkan dalam menit, bukan ditebak ulang.", correct: true },
            { text: "Saat demo ke direksi agar terlihat profesional", why: "Versioning untuk keandalan operasional, bukan kosmetik presentasi.", correct: false },
            { text: "Saat prompt sudah sempurna dan tidak akan diubah", why: "Justru saat tidak ada perubahan, versioning tidak memberi nilai.", correct: false },
            { text: "Saat hanya ada satu orang yang menulis prompt", why: "Manfaat versioning justru membesar saat banyak orang dan banyak perubahan.", correct: false },
          ],
        },
        {
          q: "Kapan zero-shot sudah cukup (tanpa contoh)?",
          options: [
            { text: "Tugas umum yang sudah dipahami model, mis. ringkasan berita", why: "Tepat: jangan bayar token contoh untuk kemampuan yang sudah ada.", correct: true },
            { text: "Ekstraksi field dengan format sangat spesifik perusahaan", why: "Ini kasus klasik few-shot: format spesifik butuh contoh.", correct: false },
            { text: "Output harus berupa JSON dengan skema ketat", why: "Skema ketat butuh contoh + validasi; zero-shot terlalu berisiko.", correct: false },
            { text: "Penalaran multi-langkah atas laporan keuangan", why: "Ini wilayah chain-of-thought, bukan zero-shot polos.", correct: false },
          ],
        },
        {
          q: "Apa fungsi utama variabel templating seperti {q}?",
          options: [
            { text: "Membuat prompt terlihat seperti kode agar keren", why: "Bukan soal gaya; ini soal pemisahan yang fungsional.", correct: false },
            { text: "Memisahkan struktur prompt dari data sehingga data kotor tidak merusak struktur", why: "Tepat: struktur tetap, data mengalir lewat variabel — fondasi keamanan dan perawatan.", correct: true },
            { text: "Mempercepat respons model", why: "Templating tidak mengubah kecepatan model.", correct: false },
            { text: "Mengurangi jumlah token prompt", why: "Templating tidak mengurangi token; ia mengatur dari mana token berasal.", correct: false },
          ],
        },
      ],
    },
  ],
};
