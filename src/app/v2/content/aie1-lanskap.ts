import type { V2Lesson } from "../lib/types";

// Batang pass rate v1 vs v2 (50% vs 90%). Theme-aware via var(--chart-*).
const FIG_PASS = `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram batang: pass rate v1 50 persen, v2 90 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="200" x2="460" y2="200"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="110" x2="460" y2="110"/><line x1="44" y1="65" x2="460" y2="65"/><line x1="44" y1="20" x2="460" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="204">0%</text><text x="38" y="159">25%</text><text x="38" y="114">50%</text><text x="38" y="69">75%</text><text x="38" y="24">100%</text></g>
<rect x="120" y="110" width="100" height="90" fill="var(--text-muted)" opacity="0.65"/>
<rect x="300" y="38" width="100" height="162" fill="var(--c1)"/>
<g fill="var(--text)" font-size="13" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="170" y="100">50%</text><text x="350" y="28">90%</text></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="170" y="222">v1 · prompt polos</text><text x="350" y="222">v2 · prompt terstruktur</text></g>
</svg>`;

export const aie1: V2Lesson = {
  slug: "aie1-lanskap",
  track: "AI Engineering",
  module: "Fondasi",
  title: "AIE1 — AI Engineering sebagai Disiplin",
  estMinutes: 75,
  steps: [
    {
      id: "cerita-dua-tim",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua tim, satu chatbot, hasil yang berbalik",
      prose: [
        "Maret 2026. NusaBank meluncurkan chatbot customer service. Tim A mengejar model terbaru: tiap ada rilis baru mereka ganti model — tanpa catatan, tanpa pengujian. Demo ke direksi selalu memukau. Tiga bulan kemudian: CSAT chatbot 62 persen, tagihan API Rp68 juta per bulan, dan tidak ada yang tahu versi mana yang merusak apa.",
        "Tim B memakai model yang lebih kecil dan lebih murah. Bedanya: setiap prompt disimpan dengan nomor versi, setiap perubahan diuji pada 10 pertanyaan baku, dan setiap rilis dicatat skornya. Hasilnya: CSAT 89 persen, tagihan Rp19 juta per bulan. Twist-nya: model Tim A lebih canggih di atas kertas — tetapi Tim B menang, karena mereka memperlakukan AI sebagai sistem yang direkayasa, bukan sulap yang dicoba-coba.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan beda AI Engineering, ML klasik, dan riset AI; (2) mengukur kualitas prompt dengan golden set dan pass rate; (3) menghitung ekonomi token sebuah aplikasi LLM; (4) memilih pendekatan yang tepat (API, self-host, ML klasik, atau riset) untuk sebuah kasus.",
        "🗺️ Isi lesson: Langkah 1 · Cerita dua tim — Langkah 2 · Tiga disiplin — Langkah 3 · Lab: eval prompt berversi — Langkah 4 · Lab: ekonomi token — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "AI Engineering = membangun produk di atas model fondasi, dengan eval, versioning, observability, dan kendali biaya.",
    },
    {
      id: "tiga-disiplin",
      eyebrow: "Langkah 2 · Tiga disiplin",
      title: "Engineering, ML klasik, riset: tiga pekerjaan berbeda",
      prose: [
        "ML klasik: kamu melatih modelmu sendiri dari data berlabel — rekayasa fitur, training loop, hyperparameter tuning. Riset AI: kamu mendorong batas kemampuan model — arsitektur baru, paper, benchmark SOTA. Keduanya berpusat pada MODEL.",
        "AI Engineering: kamu membangun PRODUK di atas model fondasi yang sudah ada. Senjatanya bukan training loop, melainkan prompt yang berversi, retrieval atas dokumenmu, evaluasi yang jujur, observability, dan pengendalian biaya. Modelnya boleh berganti tiap kuartal; yang stabil adalah sistem di sekitarnya.",
        "Analoginya: ML klasik seperti merakit mesin dari onderdil. Riset seperti menemukan prinsip mesin baru. AI Engineering seperti menjadi insinyur kendaraan: memilih mesin yang sudah ada, merancang sasis, rem, dan dashboard — lalu mengujinya di jalan raya bersama penumpang sungguhan.",
        "Biaya salah disiplin — contoh nyata. Tim menganggap chatbot CS sebagai “proyek ML”: 3 bulan melatih model custom (Rp200 juta compute) untuk akurasi 91 persen. Tim lain memakai API + prompt engineering: 2 pekan, Rp5 juta, akurasi 89 persen — lalu RAG 1 pekan → 93 persen. Yang “ML” kalah 2 poin dengan biaya 40x! Salah mengklasifikasikan pekerjaan = salah menganggarkan 40x. Tiga pertanyaan di awal (data unik? butuh training? butuh riset?) menghemat Rp195 juta.",
        "Hiring — tiga disiplin, tiga profil. Prompt engineer: empati + eksperimen. ML engineer: matematika + sistem. Researcher: publikasi + kesabaran. Salah rekrut (researcher untuk prompt engineering) = mahal dan frustrasi. Pahami disiplin = pahami orangnya.",
      ],
      formula: String.raw`\text{pass\_rate} = \frac{n_{\text{benar}}}{n}`,
      formulaNote: "n_benar = jumlah kasus golden set yang dijawab benar; n = total kasus golden set. Pass rate 0,9 artinya 9 dari 10 kasus lolos — metrik utama AI engineer sebelum dan sesudah setiap perubahan.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'AI Engineering = pandai memakai ChatGPT.' Salah. Memakai chatbot adalah konsumsi; AI Engineering adalah produksi: versioning, evaluasi, monitoring, kendali biaya. Analis yang menulis prompt bagus di playground belum tentu bisa mengoperasikannya untuk 120 ribu request per bulan tanpa jebol tagihan.",
      },
      reference: "Tanya dulu: apakah saya melatih model, meneliti model, atau membangun produk di atas model? Jawabannya menentukan skill yang dipakai.",
    },
    {
      id: "lab-eval-prompt",
      eyebrow: "Langkah 3 · Lab eval",
      title: "Lab: mengukur prompt seperti mengukur kode",
      prose: [
        "Engineer tidak menebak — ia mengukur. Golden set adalah 10 pertanyaan klasifikasi intent dengan jawaban benar yang disepakati. Fungsi `evaluate` menjalankan tiap versi prompt pada golden set dan menghitung pass rate. Mock di bawah meniru perilaku dua versi prompt: v1 polos tanpa instruksi, v2 terstruktur dengan daftar label eksplisit.",
        "Coba ubah: hapus satu kata kunci dari `table` v2, lalu jalankan ulang. Perhatikan pass rate v2 turun — itulah cara engineer menemukan titik lemah prompt, bukan dengan firasat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rate_v1` dan `rate_v2` dengan fungsi `evaluate`" },
        { id: "t2", text: "Cetak kedua pass rate dengan `print`" },
      ],
      expected: "v1=50%  v2=90%",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Prompt v2 lebih panjang, jadi pasti lebih baik.' Salah. Yang menaikkan skor adalah instruksi yang bisa diuji — daftar label eksplisit. Prompt panjang tanpa struktur justru menambah noise. Selalu ukur sebelum menyimpulkan.",
      },
      hints: [
        "evaluate butuh dua argumen: fungsi mock dan nama versi.",
        "rate_v1 = evaluate(mock_llm_v1, \"v1\")",
        "Format cetak persen: f\"v1={rate_v1:.0%}  v2={rate_v2:.0%}\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nGOLDEN = [\n    ("berapa saldo saya?", "saldo"),\n    ("kartu saya hilang", "blokir_kartu"),\n    ("bunga deposito 12 bulan?", "info_bunga"),\n    ("cara bayar tagihan listrik", "bayar_tagihan"),\n    ("saya mau komplain CS lambat", "komplain"),\n    ("limit kartu kredit saya?", "info_limit"),\n    ("transfer ke BCA berapa biayanya?", "info_biaya"),\n    ("buka rekening baru", "buka_rekening"),\n    ("lupa PIN ATM", "reset_pin"),\n    ("promo cashback bulan ini?", "info_promo"),\n]\n\ndef mock_llm_v1(prompt):\n    # v1: prompt polos tanpa instruksi klasifikasi\n    q = prompt.lower()\n    if "saldo" in q: return "saldo"\n    if "hilang" in q: return "blokir_kartu"\n    if "bunga" in q: return "info_bunga"\n    if "bayar" in q: return "bayar_tagihan"\n    if "komplain" in q or "lambat" in q: return "komplain"\n    return "tidak_tahu"\n\ndef mock_llm_v2(prompt):\n    # v2: prompt terstruktur — mock meniru model yang diinstruksi baik\n    q = prompt.lower()\n    table = {\n        "saldo": "saldo", "hilang": "blokir_kartu", "bunga": "info_bunga",\n        "bayar": "bayar_tagihan", "komplain": "komplain", "lambat": "komplain",\n        "limit": "info_limit", "biaya": "info_biaya", "buka": "buka_rekening",\n        "pin": "reset_pin",\n    }\n    for kw, label in table.items():\n        if kw in q: return label\n    return "tidak_tahu"\n\ndef evaluate(mock, version):\n    benar = sum(1 for q, gold in GOLDEN if mock(f"[{version}] {q}") == gold)\n    return benar / len(GOLDEN)\n\n# TULIS KODEMU: hitung pass rate v1 dan v2\nrate_v1 = \nrate_v2 = \n\nprint(f"v1={rate_v1:.0%}  v2={rate_v2:.0%}")`,
        lockLines: 42,
        solution: `# DATA SEED — jangan ubah\nGOLDEN = [\n    ("berapa saldo saya?", "saldo"),\n    ("kartu saya hilang", "blokir_kartu"),\n    ("bunga deposito 12 bulan?", "info_bunga"),\n    ("cara bayar tagihan listrik", "bayar_tagihan"),\n    ("saya mau komplain CS lambat", "komplain"),\n    ("limit kartu kredit saya?", "info_limit"),\n    ("transfer ke BCA berapa biayanya?", "info_biaya"),\n    ("buka rekening baru", "buka_rekening"),\n    ("lupa PIN ATM", "reset_pin"),\n    ("promo cashback bulan ini?", "info_promo"),\n]\n\ndef mock_llm_v1(prompt):\n    # v1: prompt polos tanpa instruksi klasifikasi\n    q = prompt.lower()\n    if "saldo" in q: return "saldo"\n    if "hilang" in q: return "blokir_kartu"\n    if "bunga" in q: return "info_bunga"\n    if "bayar" in q: return "bayar_tagihan"\n    if "komplain" in q or "lambat" in q: return "komplain"\n    return "tidak_tahu"\n\ndef mock_llm_v2(prompt):\n    # v2: prompt terstruktur — mock meniru model yang diinstruksi baik\n    q = prompt.lower()\n    table = {\n        "saldo": "saldo", "hilang": "blokir_kartu", "bunga": "info_bunga",\n        "bayar": "bayar_tagihan", "komplain": "komplain", "lambat": "komplain",\n        "limit": "info_limit", "biaya": "info_biaya", "buka": "buka_rekening",\n        "pin": "reset_pin",\n    }\n    for kw, label in table.items():\n        if kw in q: return label\n    return "tidak_tahu"\n\ndef evaluate(mock, version):\n    benar = sum(1 for q, gold in GOLDEN if mock(f"[{version}] {q}") == gold)\n    return benar / len(GOLDEN)\n\n# TULIS KODEMU: hitung pass rate v1 dan v2\nrate_v1 = evaluate(mock_llm_v1, "v1")\nrate_v2 = evaluate(mock_llm_v2, "v2")\n\nprint(f"v1={rate_v1:.0%}  v2={rate_v2:.0%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "rate_v1", label: "`rate_v1` terdefinisi", msg: "Buat variabel rate_v1 di bagian editable." },
          { kind: "equal", task: "t1", name: "rate_v1", value: 0.5, tol: 1e-9, label: "`rate_v1` seharusnya 0.5", msg: "v1 benar 5 dari 10. Pakai evaluate(mock_llm_v1, \"v1\")." },
          { kind: "equal", task: "t1", name: "rate_v2", value: 0.9, tol: 1e-9, label: "`rate_v2` seharusnya 0.9", msg: "v2 benar 9 dari 10 (satu kasus promo luput). Pakai evaluate(mock_llm_v2, \"v2\")." },
          { kind: "stdout_matches", task: "t2", pattern: "v1=50%\\s+v2=90%", label: "`print` menampilkan kedua rate", msg: "Format: v1=50%  v2=90%." },
        ],
      },
      reference: "Golden set kecil yang dirawat mengalahkan seribu percobaan acak. Setiap perubahan prompt wajib diuji ulang.",
    },
    {
      id: "lab-ekonomi-token",
      eyebrow: "Langkah 4 · Lab biaya",
      title: "Lab: ekonomi token — model besar vs model kecil",
      prose: [
        "Setiap request LLM ditagih per token: token input (prompt yang kamu kirim) dan token output (jawaban model) punya harga berbeda. Model besar bisa 10x lebih mahal dari model kecil. Engineer menghitung dulu, baru memilih.",
        "Skenario: 120.000 request per bulan, tiap request 800 token input dan 400 token output. Model besar: $5/$15 per 1 juta token. Model kecil: $0,5/$1,5. Hitung tagihan bulanannya — lalu jawab: kapan model besar tetap layak?",
      ],
      formula: String.raw`C = N \times \left( \frac{t_{in}}{10^6}\,p_{in} + \frac{t_{out}}{10^6}\,p_{out} \right)`,
      formulaNote: "C = biaya per bulan; N = jumlah request; t_in, t_out = token input/output per request; p_in, p_out = harga per 1 juta token. Token output biasanya 2–3x lebih mahal dari input — prompt panjang yang meminta jawaban panjang membayar dua kali.",
      figure: {
        svg: FIG_PASS,
        alt: "Diagram batang: pass rate v1 50 persen, v2 90 persen.",
        caption: "Cara membaca: tinggi batang = pass rate di golden set (10 pertanyaan klasifikasi intent), sumbu Y 0–100 persen. Interpretasi: prompt terstruktur (v2) menggandakan pass rate 50 persen menjadi 90 persen tanpa ganti model — di tugas ini, engineering mengalahkan ukuran model. Padukan dengan lab biaya: model kecil + prompt bagus sering menang di dua sisi, kualitas dan harga.",
      },
      tasks: [
        { id: "t1", text: "Hitung `cost_besar`, `cost_kecil`, dan `hemat` (selisihnya)" },
        { id: "t2", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "besar=$1,200  kecil=$120  hemat=$1,080",
      note: {
        title: "💡 Intuisi",
        body: "Biaya LLM hampir selalu didominasi token input, karena prompt (instruksi + contoh + konteks dokumen) jauh lebih panjang dari jawaban. Memangkas prompt 50 persen sering lebih berdampak daripada ganti model.",
      },
      hints: [
        "Fungsi biaya(model) sudah tersedia dan memakai kamus MODEL.",
        "hemat = cost_besar - cost_kecil",
        "Format dolar ribuan: f\"besar=${cost_besar:,.0f} ...\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# Harga per 1 juta token (USD)\nMODEL = {\n    "besar": {"in": 5.00, "out": 15.00},\n    "kecil": {"in": 0.50, "out": 1.50},\n}\nCALLS = 120_000          # request per bulan\nTOK_IN, TOK_OUT = 800, 400\n\ndef biaya(model):\n    p = MODEL[model]\n    return CALLS * (TOK_IN/1e6*p["in"] + TOK_OUT/1e6*p["out"])\n\n# TULIS KODEMU\ncost_besar = \ncost_kecil = \nhemat = \n\nprint(f"besar=\${cost_besar:,.0f}  kecil=\${cost_kecil:,.0f}  hemat=\${hemat:,.0f}")`,
        lockLines: 13,
        solution: `# DATA SEED — jangan ubah\n# Harga per 1 juta token (USD)\nMODEL = {\n    "besar": {"in": 5.00, "out": 15.00},\n    "kecil": {"in": 0.50, "out": 1.50},\n}\nCALLS = 120_000          # request per bulan\nTOK_IN, TOK_OUT = 800, 400\n\ndef biaya(model):\n    p = MODEL[model]\n    return CALLS * (TOK_IN/1e6*p["in"] + TOK_OUT/1e6*p["out"])\n\n# TULIS KODEMU\ncost_besar = biaya("besar")\ncost_kecil = biaya("kecil")\nhemat = cost_besar - cost_kecil\n\nprint(f"besar=\${cost_besar:,.0f}  kecil=\${cost_kecil:,.0f}  hemat=\${hemat:,.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cost_besar", value: 1200, tol: 1e-9, label: "`cost_besar` seharusnya 1200", msg: "120.000 x (800/1e6 x 5 + 400/1e6 x 15) = 1200. Pakai fungsi biaya(\"besar\")." },
          { kind: "equal", task: "t1", name: "cost_kecil", value: 120, tol: 1e-9, label: "`cost_kecil` seharusnya 120", msg: "120.000 x (800/1e6 x 0,5 + 400/1e6 x 1,5) = 120." },
          { kind: "equal", task: "t1", name: "hemat", value: 1080, tol: 1e-9, label: "`hemat` seharusnya 1080", msg: "Selisih keduanya = 1080." },
          { kind: "stdout_matches", task: "t2", pattern: "besar=\\$1,200\\s+kecil=\\$120\\s+hemat=\\$1,080", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Hitung biaya per bulan SEBELUM memilih model. Token output 2–3x lebih mahal dari input.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: API, self-host, ML klasik, atau riset?",
      prose: [
        "Satu, butuh kemampuan bahasa umum dan time-to-market cepat — pakai API model fondasi + prompt engineering + eval. Jangan membangun yang bisa disewa. Dua, data tidak boleh keluar dari perusahaan (data nasabah, regulasi) — self-host model open-weight di infrastruktur sendiri; bayar dengan GPU, bukan dengan risiko hukum.",
        "Tiga, tugas sempit dan berulang dengan data berlabel melimpah (skor kredit, deteksi fraud) — model kecil/fine-tune atau ML klasik sering lebih murah dan lebih terkontrol. Empat, butuh kemampuan yang belum ada di model mana pun — itu wilayah riset, bukan engineering; kolaborasi dengan tim riset atau tunggu model berikutnya.",
        "Aturan praktis 10 detik: mulai dari API + eval. Turun ke self-host bila regulasi atau biaya memaksa. Naik ke riset hanya bila model yang ada terbukti tidak mampu — bukan karena penasaran.",
        "Matriks keputusan 2x2 — versi saku. Data unik BANYAK + butuh training? → ML klasik/DL. Butuh bahasa + pengetahuan umum? → API LLM + RAG. Butuh perilaku baru + data cukup? → Fine-tune. Tidak yakin? → prototipe API 2 hari DULU (termurah untuk belajar). 2 hari prototipe menjawab “bisa tidak?” seharga Rp500 ribu; 2 bulan proyek menjawabnya seharga Rp50 juta. Pertanyaan yang sama, harga 100x beda.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Keputusan arsitektur AI adalah keputusan ekonomi, bukan agama teknologi. Hitung total cost of ownership: biaya API + biaya error + biaya engineer + risiko. Yang termurah di invoice belum tentu termurah di laporan laba rugi.",
      },
      reference: "API dulu; self-host bila regulasi/biaya memaksa; ML klasik untuk tugas sempit; riset hanya bila model existing terbukti tidak mampu.",
    },
    {
      id: "minicase-bank",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: model murah yang ternyata mahal",
      prose: [
        "NusaBank memproses 120.000 klasifikasi keluhan per bulan. Opsi Besar: $1.200 per bulan (Rp19,2 juta, kurs Rp16.000), error 5 persen. Opsi Kecil: $120 per bulan (Rp1,92 juta), error 10 persen. Tiap klasifikasi salah butuh review manual Rp15.000.",
        "Hitung totalnya. Opsi Besar: Rp19,2 juta + (5 persen x 120.000 x Rp15.000 = Rp90 juta) = Rp109,2 juta. Opsi Kecil: Rp1,92 juta + (10 persen x 120.000 x Rp15.000 = Rp180 juta) = Rp181,9 juta. Twist: opsi yang '10x lebih murah' ternyata Rp72,7 juta per bulan LEBIH MAHAL — karena biaya error mendominasi biaya API.",
        "Keputusan engineer: pilih Opsi Besar sambil menginvestasikan selisihnya untuk menurunkan error — golden set lebih besar, prompt lebih baik, dan routing: kasus mudah ke model kecil, kasus sulit ke model besar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam konteks risiko operasional bank, error klasifikasi keluhan bukan sekadar biaya review — keluhan fraud yang salah rute bisa telat ditangani berhari-hari. Total cost of ownership harus memasukkan dampak risiko, bukan hanya rupiah review manual.",
      },
      reference: "Total cost = biaya API + (error rate x volume x biaya per error). Jangan optimasi invoice sambil mengabaikan error.",
    },
    {
      id: "cara-llm-bekerja",
      eyebrow: "Langkah 7 · Fondasi LLM",
      title: "Cara LLM bekerja: token & prediksi kata berikutnya",
      prose: [
        "Ketik 'halo' — model tidak membaca kata. Ia membaca token: potongan teks kecil hasil tokenisasi. Aturan kasarnya untuk bahasa Inggris: 1 token ≈ 4 karakter. Bahasa Indonesia lebih boros: kata bersuku banyak seperti 'ketidakberdayaan' pecah menjadi beberapa token, dan angka atau campuran bahasa membuat tokenisasi makin panjang. Konsekuensi praktisnya: prompt Indonesia dengan informasi yang sama tidak jarang menelan 30–50 persen lebih banyak token — dan karena API menagih per token, pilihan bahasamu ikut menentukan tagihan.",
        "Setelah teks menjadi token, model melakukan satu hal berulang-ulang: menebak token berikutnya. Dari seluruh konteks yang ia lihat, ia menghitung distribusi probabilitas atas puluhan ribu kemungkinan token, lalu mengambil salah satunya — tidak selalu yang paling mungkin, melainkan sampel yang dikendalikan parameter. Temperature rendah (mis. 0,2) membuat output deterministik dan kaku; temperature tinggi (mis. 1,2) membuat output bervariasi dan berani.",
        "Top-p (nucleus sampling) bekerja berdampingan: model hanya mengambil dari kumpulan token terkecil yang probabilitas kumulatifnya mencapai p. Dengan top-p 0,9, ekor panjang pilihan mustahil dipangkas — acaknya tetap ada, tetapi acak yang terkendali. Inilah makna 'kreativitas' LLM yang sebenarnya: bukan inspirasi, melainkan seberapa lebar ia berani menyimpang dari tebakan paling aman.",
        "Context window adalah batas memori kerja model: mis. 128 ribu token berarti ia 'melihat' 128 ribu token terakhir saja. Instruksi system dari 200 ribu token lalu atau dokumen yang diunggah di awal sesi panjang tidak ada bagi model. Implikasi engineering-nya: dokumen panjang harus dipotong dan diringkas bertahap (chunking + summarization), bukan dilempar sekaligus ke dalam satu request.",
        "Lalu kenapa LLM bisa fasih tapi salah fakta dengan penuh percaya diri? Karena fungsi objektifnya bukan kebenaran — melainkan kemiripan pola. Model memaksimalkan probabilitas urutan token seperti yang ada di data pelatihannya. Kalimat yang salah tetapi 'terdengar benar' (polanya umum di data) mendapat probabilitas tinggi. Halusinasi bukan bug langka; ia adalah mode default model saat konteks tidak cukup mengikat jawaban.",
        "💡 Intuisi: anggap LLM sebagai penebak kata super yang tidak pernah tidur, bukan pustakawan. Ia tidak 'tahu' — ia mengarang yang paling mungkin. Pekerjaanmu sebagai engineer adalah mengikatnya: beri konteks yang cukup (retrieval), minta format yang bisa diverifikasi (structured output), dan ukur jawabannya dengan golden set — persis seperti yang kamu lakukan di lab evaluasi Langkah 3.",
      ],
      formula: String.raw`\text{token} \approx \frac{\text{karakter}}{4}`,
      formulaNote: "Aturan kasar untuk bahasa Inggris: bagi jumlah karakter dengan 4 untuk memperkirakan token. Untuk bahasa Indonesia pembaginya lebih kecil (2–3) karena kata bersuku banyak pecah jadi beberapa token — ini perkiraan kasar untuk budgeting, bukan aturan pasti tokenizer mana pun.",
      tasks: [
        { id: "t1", text: "Perkirakan token untuk prompt Indonesia 800 karakter dengan aturan ±4 karakter/token, lalu dengan pembagi 2,5" },
        { id: "t2", text: "Jelaskan dengan kalimatmu sendiri: kenapa temperature tinggi BUKAN ide bagus untuk tugas klasifikasi intent seperti di lab Langkah 3" },
      ],
      note: {
        title: "🚨 Mitos: LLM memahami pertanyaan seperti manusia, jadi ia 'tahu' jawabannya",
        type: "pitfall",
        body: "Yang benar: ia tidak punya model kebenaran — hanya distribusi probabilitas atas token. Pertanyaan yang polanya tidak ada di data tetap dijawab dengan penuh percaya diri. Jangan pernah memperlakukan output LLM sebagai fakta; perlakukan sebagai draf yang wajib diverifikasi.",
      },
      reference: "Token = unit tagihan sekaligus unit memori; prediksi token berikutnya = satu-satunya kemampuan; context window = batasnya; halusinasi = sifat dasarnya, bukan kecelakaan.",
    },
    {
      id: "memakai-api-llm",
      eyebrow: "Langkah 8 · Fondasi LLM",
      title: "Memakai API LLM: anatomi request & ekonomi token",
      prose: [
        "Request API LLM tersusun dari messages: array giliran bicara. Peran system berisi instruksi perilaku ('Kamu asisten CS bank, jawab ringkas'), user berisi pertanyaan, dan assistant berisi jawaban model pada giliran sebelumnya. Selain itu kamu mengirim model (nama versi, mis. 'model-x-mini') dan parameter: temperature, max_tokens (batas panjang jawaban), dan top_p.",
        "Respons mengembalikan teks jawaban plus usage: prompt_tokens dan completion_tokens yang dipakai request itu. Dua angka ini adalah meteran tagihanmu — dan meteran yang wajib kamu log di setiap request untuk observability biaya. Streaming (token mengalir kata per kata) vs blocking (menunggu jawaban penuh): streaming memberi UX lebih cepat dan deteksi error dini, dengan harga kompleksitas client yang lebih tinggi.",
        "Biayanya mengikuti rumus yang sudah kamu pakai di lab Langkah 4, dengan harga ilustrasi mis. $0,50/$1,50 per 1 juta token untuk model kecil — harga nyata berubah-ubah, jadi selalu cek halaman pricing provider sebelum menganggarkan. Kuncinya: API itu stateless. Model tidak mengingat percakapan; setiap request baru HARUS mengirim ulang seluruh riwayat. Percakapan 10 giliran berarti giliran ke-10 membayar token dari 9 giliran sebelumnya — biaya tumbuh jauh lebih cepat dari kelihatannya bila riwayat tak pernah dipangkas.",
        "Error yang akan kamu temui di produksi: 429 (rate limit — terlalu banyak request), context_length_exceeded (riwayat + dokumen melebihi jendela), dan timeout (model lambat atau respons terlalu panjang). Pola penanganannya: retry dengan exponential backoff (tunggu 1 dtk, 2 dtk, 4 dtk, ...) plus jitter agar tidak menyerbu bersamaan, batasi jumlah percobaan, dan untuk 429 hormati header Retry-After bila ada. Jangan me-retry buta error 400 — permintaanmu yang salah tidak akan sembuh dengan menunggu.",
        "💡 Intuisi: bayangkan setiap request API adalah karyawan baru yang amnesia total — ia hanya tahu apa yang tertulis di messages yang kamu kirim. System prompt adalah SOP yang harus ditulis ulang tiap pagi; riwayat adalah notulen rapat yang harus dibawa ulang. Strategi hematnya: ringkas riwayat lama menjadi 1–2 kalimat ('ringkasan sejauh ini: ...') begitu melewati ambang, mis. 4.000 token.",
      ],
      tasks: [
        { id: "t1", text: "Hitung token prompt & completion tiap giliran dengan fungsi `hitung_token`" },
        { id: "t2", text: "Hitung total biaya 2 giliran dan tunjukkan berapa besar porsi giliran kedua akibat pengiriman ulang riwayat" },
      ],
      expected: "giliran1 in=15 out=8 | giliran2 in=32 out=10 | biaya=$0.000050",
      note: {
        title: "🚨 Mitos: menyimpan riwayat percakapan di client itu gratis",
        type: "pitfall",
        body: "Yang benar: riwayat memang gratis disimpan, tetapi mahal dikirim — setiap giliran baru membayar ulang seluruh riwayat sebagai token input. Chatbot dengan 5.000 sesi aktif yang masing-masing 20 giliran bisa membakar token input ratusan kali lipat dari yang terlihat di dashboard. Mitigasi: ringkas riwayat, batasi giliran yang dikirim, atau pindah ke model dengan prompt caching bila provider mendukung.",
      },
      hints: [
        "hitung_token sudah tersedia: token ≈ karakter // 4.",
        "Giliran 2 stateless: jumlahkan token SYSTEM + USER_1 + RESP_1 + USER_2.",
        "biaya = ((t1_in + t2_in) / 1e6) * HARGA_IN + ((t1_out + t2_out) / 1e6) * HARGA_OUT",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah
# Harga ILUSTRASI per 1 juta token (bukan harga nyata provider mana pun)
HARGA_IN, HARGA_OUT = 0.50, 1.50

SYSTEM = "Kamu asisten CS bank. Jawab ringkas."
USER_1 = "Berapa saldo tabungan saya?"
RESP_1 = "Saldo tabungan Anda Rp4.250.000."
USER_2 = "Kalau kemarin saya tarik Rp500 ribu?"
RESP_2 = "Setelah penarikan, saldo Anda Rp3.750.000."

def hitung_token(teks):
    return max(1, len(teks) // 4)

# Giliran 1: kirim system + pesan user pertama
t1_in = 
t1_out = hitung_token(RESP_1)

# Giliran 2: stateless — kirim ulang SEMUA riwayat + pesan baru
t2_in = 
t2_out = hitung_token(RESP_2)

biaya = 

print(f"giliran1 in={t1_in} out={t1_out}")
print(f"giliran2 in={t2_in} out={t2_out}")
print(f"biaya=\${biaya:.6f}")`,
        lockLines: 19,
        solution: `# DATA SEED — jangan ubah
# Harga ILUSTRASI per 1 juta token (bukan harga nyata provider mana pun)
HARGA_IN, HARGA_OUT = 0.50, 1.50

SYSTEM = "Kamu asisten CS bank. Jawab ringkas."
USER_1 = "Berapa saldo tabungan saya?"
RESP_1 = "Saldo tabungan Anda Rp4.250.000."
USER_2 = "Kalau kemarin saya tarik Rp500 ribu?"
RESP_2 = "Setelah penarikan, saldo Anda Rp3.750.000."

def hitung_token(teks):
    return max(1, len(teks) // 4)

# Giliran 1: kirim system + pesan user pertama
t1_in = hitung_token(SYSTEM) + hitung_token(USER_1)
t1_out = hitung_token(RESP_1)

# Giliran 2: stateless — kirim ulang SEMUA riwayat + pesan baru
t2_in = hitung_token(SYSTEM) + hitung_token(USER_1) + hitung_token(RESP_1) + hitung_token(USER_2)
t2_out = hitung_token(RESP_2)

biaya = ((t1_in + t2_in) / 1e6) * HARGA_IN + ((t1_out + t2_out) / 1e6) * HARGA_OUT

print(f"giliran1 in={t1_in} out={t1_out}")
print(f"giliran2 in={t2_in} out={t2_out}")
print(f"biaya=\${biaya:.6f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "t1_in", value: 15, tol: 0, label: "`t1_in` seharusnya 15", msg: "Giliran 1: token SYSTEM + token USER_1. Pakai hitung_token." },
          { kind: "equal", task: "t1", name: "t1_out", value: 8, tol: 0, label: "`t1_out` seharusnya 8", msg: "hitung_token(RESP_1)." },
          { kind: "equal", task: "t1", name: "t2_in", value: 32, tol: 0, label: "`t2_in` seharusnya 32", msg: "Giliran 2 stateless: SYSTEM + USER_1 + RESP_1 + USER_2." },
          { kind: "equal", task: "t2", name: "biaya", value: 0.0000505, tol: 1e-12, label: "biaya seharusnya 0.0000505", msg: "((15+32)/1e6)*0.50 + ((8+10)/1e6)*1.50 = 0.0000505." },
          { kind: "stdout_matches", task: "t2", pattern: "giliran1 in=15 out=8", label: "`print` giliran 1 benar", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "biaya=\\$0\\.000050", label: "`print` biaya benar (dibulatkan 6 desimal)", msg: "Format: biaya=$0.000050." },
        ],
      },
      reference: "Request = messages + model + parameter; respons membawa usage; API stateless sehingga riwayat dikirim ulang dan biaya tumbuh dengan panjang percakapan; 429/konteks/timeout ditangani dengan backoff.",
    },    {
      id: "lisensi-model",
      eyebrow: "Langkah 9 · Lisensi model",
      title: "Open vs closed: yang kamu sewa vs yang kamu miliki",
      prose: [
        "Model terbuka vs tertutup bukan soal harga — soal HAK. Tiga pertanyaan yang menentukan pilihanmu: bolehkah model diunduh dan dijalankan di server sendiri, bolehkah diubah dan disebar ulang, dan siapa yang menanggung risiko bila model salah menjawab.",
        "Lisensi bobot terbuka yang paling umum: Apache-2.0 dan MIT — permisif: boleh dipakai, diubah, dan dijual, dengan syarat atribusi. Lisensi komunitas seperti Llama Community License mengizinkan banyak pemakaian tetapi punya batas: layanan dengan pengguna sangat besar wajib meminta izin, dan ada larangan memakai output model untuk melatih model pesaing. Jangan hafal slogan — baca klausulnya sebelum produkmu bergantung padanya.",
        "API tertutup tidak memberi lisensi model sama sekali. Yang ada adalah syarat layanan dan SLA: kamu menyewa jawaban, bukan memiliki model. Vendor boleh mengganti versi model di bawahmu, mengubah perilaku jawaban, dan menaikkan harga tanpa pemberitahuan. Keuntungannya kualitas tertinggi tanpa operasi; harganya adalah kontrol yang hilang.",
        "Aturan pilih empat sel. Data sensitif dan butuh kontrol penuh — self-host bobot terbuka. Butuh kualitas tertinggi dan data boleh keluar — API tertutup. Butuh audit dan reproduksibilitas — bobot terbuka berlisensi permisif dengan versi yang dipin. Produk yang dilatih ulang dari output model lain — cek dulu larangan lisensi, karena beberapa lisensi melarangnya secara eksplisit.",
        "Dan satu hal yang sering tertukar: open weights bukan open source. Bobot yang bisa diunduh belum tentu disertai kode latih dan data latih yang terbuka. Sebelum mengklaim sesuatu open source, periksa ketiganya: bobot, kode, data. Bila hanya bobot yang terbuka, sebut saja begitu — bobot terbuka.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: “gratis diunduh berarti bebas dipakai apa saja”",
        type: "pitfall",
        body: "Yang benar: unduhan gratis bukan lisensi bebas. Llama Community License, misalnya, membatasi pemakaian komersial skala sangat besar dan melarang pemakaian output untuk melatih pesaing. Pelanggaran lisensi adalah risiko hukum, bukan sekadar etiket — baca klausulnya sebelum launch.",
      },
      reference: "Tiga pertanyaan: boleh diunduh, boleh diubah, siapa menanggung risiko. Open weights belum tentu open source.",
    },

    {
      id: "design-review",
      eyebrow: "Langkah 10 · Design review",
      title: "Design review: arsitektur asisten untuk tim risiko",
      prose: [
        "Design review adalah langkah eksplisit di track ini: kamu mengkritik sebuah RANCANGAN sebelum ia dibangun, bukan mengulas kode yang sudah jadi. Skenarionya: direksi meminta asisten tanya-jawab atas SOP bank plus ringkasan risiko mingguan, memakai API tertutup, data nasabah mentah, tanpa eval, tanpa abstention — dan diminta live dalam 2 minggu.",
        "Kritik pertama: data nasabah mentah ke API tertutup melanggar prinsip akses minimum — siapa yang melihat datanya, berapa lama disimpan, dan apa kata syarat layanan vendor soal pemakaian data untuk training? Kritik kedua: tanpa eval suite, tidak ada yang tahu kapan asisten memburuk — dua minggu setelah live, jawabannya bisa bergeser diam-diam mengikuti pergantian versi model.",
        "Kritik ketiga: tanpa abstention, pertanyaan di luar dokumen dijawab dengan percaya diri — di domain risiko, satu jawaban karangan yang lolos ke komite lebih mahal dari seribu jawaban tidak tahu. Perbaikannya: masking sebelum kirim, pin versi model, golden set + red team sebelum launch, dan ambang abstention yang tertulis.",
        "Yang dinilai di design review bukan benar atau salah mutlak — melainkan apakah asumsimu tertulis dan bisa diuji. Rancangan yang baik menyebutkan risikonya sendiri: “kami memakai API tertutup, risikonya pergantian versi — mitigasinya pin versi + eval tiap rilis.” Rancangan yang buruk tidak menyebut risiko sama sekali.",
      ],
      tasks: [
        { id: "t1", text: "Tulis 3 kelemahan rancangan di atas (satu soal data/privasi, satu soal evaluasi, satu soal keandalan jawaban) beserta perbaikan konkret tiap kelemahan" },
        { id: "t2", text: "Tulis 1 risiko yang TIDAK bisa dimitigasi sepenuhnya dan keputusanmu: terima, tunda, atau tolak rancangan itu" },
      ],
      note: {
        title: "💡 Intuisi: design review mencari asumsi, bukan kesalahan ketik",
        body: "Kode yang salah ketik ketahuan di test. Asumsi yang salah (“vendor tidak akan mengganti model”, “data nasabah aman di API”) ketahuan di insiden — berbulan-bulan kemudian, dengan biaya. Design review adalah satu-satunya momen murah untuk menangkap asumsi.",
      },
      reference: "Design review = kritik rancangan sebelum dibangun: data, eval, abstention, risiko yang tertulis.",
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
        "AI Engineering = membangun produk di atas model fondasi (prompt, retrieval, eval, observability, biaya); ML klasik melatih model sendiri; riset mendorong batas kemampuan model.",
        "Golden set + pass rate adalah kompas setiap perubahan prompt atau model.",
        "Ekonomi token: hitung C = N x (t_in/1e6 x p_in + t_out/1e6 x p_out) sebelum memilih model; token output 2–3x lebih mahal.",
        "Keputusan arsitektur (API vs self-host vs ML klasik vs riset) adalah keputusan ekonomi dan regulasi.",
        "Total cost of ownership memasukkan biaya error — model murah dengan error tinggi bisa lebih mahal.",
      ],
      next: { label: "AIE2 — Prompt Engineering Sistematis", href: "/v2/learn/aie2-prompt" },
      quiz: [
        {
          q: "Apa pembeda utama AI Engineering dibanding ML klasik?",
          options: [
            { text: "AI Engineering melatih model dari nol dengan data sendiri", why: "Itu justru definisi ML klasik — training loop dan data berlabel milik sendiri.", correct: false },
            { text: "AI Engineering membangun produk di atas model fondasi yang sudah ada, dengan eval, versioning, dan observability", why: "Tepat: fokusnya sistem di sekitar model (prompt, retrieval, eval, biaya), bukan melatih model.", correct: true },
            { text: "AI Engineering tidak membutuhkan evaluasi karena modelnya sudah pintar", why: "Kebalikannya: eval justru senjata utama AI engineer, seperti di lab v1 vs v2.", correct: false },
            { text: "AI Engineering hanya soal menulis prompt yang bagus di playground", why: "Prompt bagus saja tidak cukup; tanpa versioning, eval, dan kendali biaya itu baru konsumsi, bukan engineering.", correct: false },
          ],
        },
        {
          q: "Tim mengganti model ke versi terbaru setiap rilis tanpa evaluasi. Risiko terbesarnya?",
          options: [
            { text: "Tagihan API pasti naik", why: "Belum tentu — model baru kadang lebih murah. Ini bukan risiko utamanya.", correct: false },
            { text: "Regresi diam-diam: tidak ada yang tahu apakah versi baru lebih baik atau lebih buruk", why: "Tepat: tanpa golden set dan pass rate, setiap pergantian adalah judi.", correct: true },
            { text: "Model baru selalu lebih buruk", why: "Tidak selalu; masalahnya bukan arahnya, melainkan ketidaktahuanmu tentang arahnya.", correct: false },
            { text: "Prompt lama tidak bisa dipakai lagi", why: "Prompt biasanya tetap bisa dipakai; masalahnya adalah kamu tidak mengukur dampaknya.", correct: false },
          ],
        },
        {
          q: "Praktik prompt versioning paling mirip dengan praktik apa di software engineering?",
          options: [
            { text: "Version control kode (git): setiap perubahan tercatat dan bisa diuji ulang", why: "Tepat: prompt adalah kode — berversi, bisa di-review, bisa di-rollback.", correct: true },
            { text: "Backup database harian", why: "Backup melindungi data, bukan mengelola evolusi artefak yang diuji.", correct: false },
            { text: "Restart server berkala", why: "Restart adalah operasional rutin, tidak ada hubungannya dengan artefak berversi.", correct: false },
            { text: "Menulis dokumentasi di akhir proyek", why: "Versioning justru dilakukan terus-menerus selama proyek, bukan di akhir.", correct: false },
          ],
        },
        {
          q: "Kapan melatih atau self-host model sendiri lebih tepat daripada memakai API?",
          options: [
            { text: "Ketika ingin hasil demo yang memukau secepat mungkin", why: "Untuk kecepatan demo, API justru menang telak.", correct: false },
            { text: "Ketika data tidak boleh keluar dari perusahaan karena regulasi", why: "Tepat: privasi dan kepatuhan adalah alasan paling sah untuk self-host.", correct: true },
            { text: "Ketika tim belum punya golden set", why: "Tanpa golden set, self-host justru lebih berisiko karena tidak ada yang mengukur kualitas.", correct: false },
            { text: "Ketika tugasnya sederhana dan umum", why: "Tugas sederhana dan umum adalah kasus terbaik untuk API, bukan self-host.", correct: false },
          ],
        },
        {
          q: "Biaya API turun 90 persen tapi error rate naik 2x lipat. Respons seorang AI engineer?",
          options: [
            { text: "Langsung pindah ke yang murah — hemat 90 persen", why: "Itu keputusan invoice, bukan keputusan engineering: biaya error belum dihitung.", correct: false },
            { text: "Hitung total cost termasuk biaya penanganan setiap error, baru putuskan", why: "Tepat: seperti mini-case bank, error yang mahal bisa membalikkan seluruh perhitungan.", correct: true },
            { text: "Tetap di yang mahal — yang murah pasti berkualitas rendah", why: "Belum tentu; kadang model murah + prompt bagus menang di dua sisi. Ukur, jangan berprasangka.", correct: false },
            { text: "Naikkan threshold agar error tidak terlihat di dashboard", why: "Menyembunyikan error adalah manipulasi metrik, bukan engineering.", correct: false },
          ],
        },
        {
          q: "Startup kesehatan memakai API tertutup untuk data rekam medis pasien. Risiko kontrak/lisensi TERBESAR?",
          options: [
            { text: "Harga API naik", why: "Itu risiko nyata tetapi bukan yang terbesar — harga bisa dinegosiasi atau dipindah.", },
            { text: "Data pasien keluar ke vendor dan model bisa berganti versi tanpa pemberitahuan", why: "Benar: data sensitif keluar dari kendali dan perilaku model bisa berubah diam-diam — dua risiko yang tidak bisa diuji dari dalam.", correct: true },
            { text: "Model tertutup lebih lambat", why: "Kecepatan bukan soal lisensi; model tertutup justru sering paling cepat.", },
            { text: "Tidak bisa memakai Bahasa Indonesia", why: "Model tertutup besar justru kuat berbahasa Indonesia.", },
          ],
        },
        {
          q: "Apa beda “open weights” dan “open source” untuk sebuah model?",
          options: [
            { text: "Tidak ada bedanya", why: "Ada: bobot terbuka belum tentu kode latih dan data latih terbuka.", },
            { text: "Open weights = bobot bisa diunduh; open source = bobot + kode + data terbuka dan bisa diaudit", why: "Benar: klaim open source menuntut ketiganya. Bila hanya bobot yang terbuka, sebut saja bobot terbuka.", correct: true },
            { text: "Open source berarti gratis, open weights berarti berbayar", why: "Harga bukan pembedanya — lisensi dan keterbukaan artefaknya.", },
            { text: "Open weights hanya untuk riset, open source untuk komersial", why: "Batas riset vs komersial diatur klausul lisensi, bukan labelnya.", },
          ],
        },
      ],
    },
  ],
};
