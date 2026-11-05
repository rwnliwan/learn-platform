import type { V2Lesson } from "../lib/types";

// Latensi total 8 request contoh (ms): p50 = 4212.5, dua gagal.
const FIG_LATENCY = `<svg viewBox="0 0 520 300" role="img" aria-label="Bar latensi 8 request dengan dua request gagal dan garis p50.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="56" y1="250" x2="500" y2="250"/><line x1="56" y1="195" x2="500" y2="195"/><line x1="56" y1="140" x2="500" y2="140"/><line x1="56" y1="85" x2="500" y2="85"/><line x1="56" y1="30" x2="500" y2="30"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="50" y="254">0</text><text x="50" y="199">2500</text><text x="50" y="144">5000</text><text x="50" y="89">7500</text><text x="50" y="34">10000</text></g>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="70" y="161" width="36" height="89" fill="var(--c1)" fill-opacity="0.85"/><text x="88" y="266" fill="var(--chart-text)">r1</text>
<rect x="118" y="30" width="36" height="220" fill="var(--c1)" fill-opacity="0.85"/><text x="136" y="266" fill="var(--chart-text)">r2</text>
<rect x="166" y="231" width="36" height="19" fill="var(--c4)" fill-opacity="0.9"/><text x="184" y="266" fill="var(--chart-text)">r3*</text>
<rect x="214" y="144" width="36" height="106" fill="var(--c1)" fill-opacity="0.85"/><text x="232" y="266" fill="var(--chart-text)">r4</text>
<rect x="262" y="127" width="36" height="123" fill="var(--c1)" fill-opacity="0.85"/><text x="280" y="266" fill="var(--chart-text)">r5</text>
<rect x="310" y="156" width="36" height="94" fill="var(--c1)" fill-opacity="0.85"/><text x="328" y="266" fill="var(--chart-text)">r6</text>
<rect x="358" y="103" width="36" height="147" fill="var(--c4)" fill-opacity="0.9"/><text x="376" y="266" fill="var(--chart-text)">r7*</text>
<rect x="406" y="160" width="36" height="90" fill="var(--c1)" fill-opacity="0.85"/><text x="424" y="266" fill="var(--chart-text)">r8</text>
</g>
<line x1="56" y1="144.9" x2="452" y2="144.9" stroke="var(--c2)" stroke-width="2" stroke-dasharray="8 5"/>
<text x="458" y="148" font-size="11" fill="var(--text)" font-family="var(--font-ui)">p50 = 4212 ms</text>
<text x="56" y="292" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">latensi total per request (ms) — * = gagal</text>
</svg>`;

export const aie21: V2Lesson = {
  slug: "aie21-eval-observability-praktik",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE21 — Eval & Observability dalam Praktik Engineer",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membaca trace request (span, latensi, status) dan menemukan span penyebab masalah; (2) menghitung p50, tingkat gagal, dan span terlambat dari log trace; (3) membangun dataset eval dari kegagalan produksi yang nyata; (4) menulis assertion otomatis dan skor kualitas jawaban; (5) merancang regresi prompt sederhana agar perubahan prompt tidak merusak diam-diam.",
        "🗺️ Isi lesson: Langkah 1 · Peta — Langkah 2 · Cerita skor yang menipu — Langkah 3 · Membaca trace — Langkah 4 · Dataset eval dari produksi — Langkah 5 · Assertion & skor — Langkah 6 · Lab trace — Langkah 7 · Regresi prompt — Langkah 8 · Metrik yang jujur — Langkah 9 · Peta keputusan — Langkah 10 · Mini-case — Checkpoint.",
        "Sudut lesson ini: engineer yang men-debug aplikasinya sendiri (membaca trace, menulis eval). Ini berbeda dari sudut platform/ops (membangun infrastruktur observability untuk banyak tim) — di sini kamu adalah pengguna tool-nya, bukan pembangun tool-nya.",
      ],
      tasks: [],
      reference: "Observability menjawab 'apa yang terjadi'; eval menjawab 'apakah ini cukup baik'. Engineer butuh keduanya setiap hari.",
    },
    {
      id: "cerita-skor-menipu",
      eyebrow: "Langkah 2 · Cerita",
      title: "Skor eval naik, keluhan naik",
      prose: [
        "Tim 'TanyaBank' merayakan: skor eval chatbot naik dari 82 ke 91 setelah prompt baru. Seminggu kemudian, tiket keluhan naik 30 persen. 'Jawaban ngawur soal biaya admin,' tulis nasabah. 'Disuruh transfer ke rekening yang tidak dikenal,' tulis yang lain — yang terakhir ini nyaris menjadi insiden fraud.",
        "Investigasi menemukan dataset eval-nya basi: 500 pertanyaan yang ditulis 8 bulan lalu, saat produk hanya melayani info saldo. Delapan bulan kemudian produk melayani transfer, pembayaran, dan pembukaan rekening — tetapi eval masih menguji info saldo. Skor 91 mengukur kemahiran menjawab pertanyaan yang sudah tidak ditanyakan siapa pun.",
        "Twist-nya: tim tidak kekurangan metrik — mereka kekurangan KEJUJURAN metrik. Eval yang baik bukan yang skornya tinggi, melainkan yang gagal saat produk gagal. Dataset eval harus tumbuh dari kegagalan produksi yang nyata: setiap tiket keluhan adalah calon kasus uji. Lesson ini membangunkan keduanya: trace untuk melihat apa yang terjadi, eval untuk memastikan yang terjadi itu cukup baik.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Eval yang tidak pernah gagal adalah eval yang tidak menguji apa-apa. Sama seperti test software: test yang selalu hijau padahal bug bertebaran = test yang salah sasaran. Setiap insiden produksi harus melahirkan minimal satu kasus eval baru — kalau tidak, insiden itu akan terulang tanpa ada yang memperingatkan.",
      },
      reference: "Skor tinggi pada dataset basi = kebohongan yang nyaman. Eval harus gagal saat produk gagal.",
    },
    {
      id: "membaca-trace",
      eyebrow: "Langkah 3 · Membaca trace",
      title: "Membaca trace seperti mekanik membaca bunyi mesin",
      prose: [
        "Trace adalah rekaman perjalanan satu request: deretan span (langkah kerja) masing-masing dengan nama, durasi, dan status. Contoh: router 95 ms (ok) → retrieval 720 ms (ok) → llm 2.890 ms (ok) → total 3.705 ms. Waterfall-nya dibaca kiri ke kanan seperti not balok: span yang batangnya paling panjang adalah tersangka utama latensi.",
        "Tiga pertanyaan yang selalu ditanyakan pada trace. Satu: di mana waktu habis? Jumlahkan durasi per NAMA span di banyak request — span dengan total terbesar adalah bottleneck sistemik (di lab nanti: `llm` menang telak). Dua: apa yang gagal? Filter status != ok — pola kegagalan (retrieval gagal tiap hujan data baru?) lebih berharga dari satu error. Tiga: apakah ini normal? Bandingkan dengan baseline: retrieval 720 ms normal, 6.100 ms tidak — tanpa baseline, angka hanyalah angka.",
        "Dua jebakan membaca trace. Satu: mengukur rata-rata latensi — satu request 9 detik menarik rata-rata 8 request ke atas dan menyembunyikan bahwa 7 lainnya baik-baik saja; pakai p50/p95/p99 (langkah 8). Dua: hanya melihat request yang gagal — request lambat tapi 'ok' adalah insiden yang menunggu giliran; pola retrieval yang makin lambat tiap minggu adalah atap yang bocor pelan-pelan.",
        "Tool-nya (LangSmith, LangFuse, Arize Phoenix) pada dasarnya melakukan tiga hal yang sama: merekam trace, memvisualkan waterfall, dan mengagregasi metrik. Pilih satu, kuasai cara bacanya — mekanik yang baik tidak butuh lima merek kunci pas, ia butuh tangan yang tahu bunyi mesin.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Trace hanya dibuka saat ada insiden.' Trace yang hanya dibuka saat kebakaran adalah pemadam yang tidak pernah latihan. Engineer yang sehat membaca agregat trace SEMINGGU SEKALI: latensi retrieval naik 15%? tingkat gagal llm merangkak? Pola-pola ini terlihat berminggu-minggu sebelum menjadi insiden — kalau ada yang melihat.",
      },
      reference: "Tanya pada trace: di mana waktu habis, apa yang gagal, apakah ini normal. Baca agregat mingguan, bukan hanya saat kebakaran.",
    },
    {
      id: "dataset-eval-produksi",
      eyebrow: "Langkah 4 · Dataset eval",
      title: "Dataset eval yang lahir dari kegagalan nyata",
      prose: [
        "Dataset eval yang baik punya tiga sumber, berurutan berdasarkan nilai. Sumber satu — kegagalan produksi: setiap tiket keluhan, setiap jawaban ngawur yang tertangkap, setiap eskalasi. Ini emas: kasus nyata dengan ekspektasi nyata ('seharusnya menjawab X'). Sumber dua — regresi: kasus yang PERNAH benar dan harus tetap benar (perubahan prompt tidak boleh merusaknya). Sumber tiga — sintetis: variasi yang dibuat untuk menutup lubang cakupan (dialek, typo, pertanyaan multi-bagian).",
        "Setiap kasus eval butuh empat field: input (pertanyaan persis seperti dari user), konteks (dokumen/data yang tersedia saat itu), ekspektasi (jawaban yang benar — boleh berupa kriteria, bukan teks persis), dan label (kasus baru / regresi / adversarial). Tanpa ekspektasi yang eksplisit, eval hanyalah 'lihat-lihat hasilnya' — dan manusia yang lelah akan menyetujui apa saja.",
        "Aturan kebersihan dataset: (1) jangan latih pada data eval — prompt yang di-tuning agar lolos eval spesifik adalah overfitting yang dilegalkan; (2) versikan dataset — eval v3 harus bisa diulang enam bulan lagi dengan hasil yang bisa dibandingkan; (3) pisahkan pemilik — yang menulis prompt jangan sendirian menilai hasilnya, bias konfirmasi itu nyata.",
        "💡 Intuisi: dataset eval adalah kontrak antara tim dan masa depan. Ia berkata: 'inilah definisi benar menurut kami, pada tanggal ini'. Setiap perubahan definisi = versi baru. Tanpa kontrak tertulis, 'kualitas menurun' hanya menjadi perasaan — dan perasaan tidak bisa di-debug.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Mulai dari 50 kasus nyata, bukan 5.000 kasus sintetis. 50 kegagalan produksi yang dikurasi mengalahkan 5.000 pertanyaan buatan dalam memprediksi keluhan berikutnya — karena ia mengukur dunia yang sebenarnya, bukan dunia yang dibayangkan penulis prompt.",
      },
      reference: "Sumber eval: kegagalan produksi → regresi → sintetis. Tiap kasus: input, konteks, ekspektasi, label. Versikan, jangan latih di atasnya.",
    },
    {
      id: "assertion-skor",
      eyebrow: "Langkah 5 · Assertion & skor",
      title: "LLM-as-judge dengan tali pengaman",
      prose: [
        "Assertion adalah test otomatis untuk jawaban: 'jawaban harus menyebut nomor resi', 'jawaban tidak boleh mengandung janji waktu pasti', 'jawaban harus dalam Bahasa Indonesia'. Yang paling murah dan paling bisa diandalkan adalah assertion deterministik: pencocokan kata kunci, regex, pemeriksaan panjang, pemeriksaan format. Ia tidak pintar, tetapi ia tidak pernah lelah dan tidak pernah berhalusinasi.",
        "LLM-as-judge (meminta model lain menilai jawaban) adalah lapisan kedua, bukan pertama. Ia berguna untuk kualitas yang sulit di-regex: nada, kelengkapan, kehalusan. Tetapi ia membawa tiga risiko: bias (cenderung menyukai jawaban panjang dan gaya tertentu), biaya (setiap eval = panggilan model lagi), dan ketidakstabilan (penilai yang sama bisa memberi skor beda besok). Aturannya: deterministik dulu untuk yang bisa ditentukan; LLM-as-judge hanya untuk sisanya, dengan rubrik tertulis dan contoh kalibrasi.",
        "Skor agregat = kasus lolos ÷ total kasus. Satu angka, jujur, bisa dibandingkan antar-versi prompt. Tetapi jangan berhenti di satu angka: pecah per label (regresi 100% lolos tetapi kasus baru 40% = prompt-mu menghafal masa lalu dan gagal di masa kini) dan per kategori (semua gagal di 'pertanyaan multi-bagian' = lubang kemampuan yang spesifik).",
        "Jebakan terbesar: mengoptimasi skor, bukan kualitas (Goodhart's law versi prompt). Prompt yang diutak-atik sampai lolos 50 kasus spesifik belum tentu lebih baik — ia mungkin hanya lebih hafal. Obatnya: simpan sebagian kasus sebagai eval TERTUTUP yang tidak dilihat saat tuning, dan ukur di sana.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'LLM-as-judge menggantikan eval manusia.' Tidak — ia menggantikan sebagian eval REPETITIF, dengan syarat dikalibrasi: bandingkan penilaiannya dengan penilaian manusia pada 50–100 kasus dulu, ukur kesepakatannya. Judge yang tidak dikalibrasi adalah juri yang tidak pernah diuji kejujurannya — skornya menenangkan tetapi tidak berarti.",
      },
      reference: "Assertion deterministik dulu; LLM-as-judge untuk sisanya, dengan rubrik + kalibrasi. Pecah skor per label. Simpan eval tertutup.",
    },
    {
      id: "lab-trace",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: bedah 8 trace + skor assertion",
      prose: [
        "Lab dua babak dengan data contoh. Babak satu: 8 trace request (nama span, durasi ms, status) — hitung `total` per request, `p50` latensi, `tingkat_gagal` (request dengan span fail), dan `span_terlambat` (nama span dengan akumulasi durasi terbesar). Babak dua: 5 jawaban contoh dinilai terhadap kata kunci wajib — hitung `skor_asersi` = lolos ÷ total.",
        "Definisi yang dipakai lab: p50 = median; untuk jumlah genap, rata-rata dua nilai tengah setelah diurutkan. Request 'gagal' = ada span berstatus 'fail' (span 'skip' tidak dihitung gagal — ia memang tidak dijalankan). Pencocokan kata kunci case-insensitive.",
        "Coba ubah setelah berhasil: naikkan durasi `retrieval` di r2 menjadi dua kali lipat dan lihat `span_terlambat` tetap atau berubah — lalu tanyakan: pada titik berapa retrieval menyalip llm sebagai bottleneck? Cara berpikir 'kapan X berubah' inilah inti membaca trace.",
      ],
      figure: {
        svg: FIG_LATENCY,
        alt: "Diagram batang latensi total 8 request; r3 dan r7 ditandai gagal; garis putus-putus menandai p50 = 4212 ms.",
        caption: "Cara membaca: sumbu X = 8 request contoh; tinggi batang = latensi total (ms); batang gelap bertanda * = request gagal; garis putus-putus = p50. Interpretasi: dua request gagal (r3, r7) tetapi r2 yang 'ok' justru paling lambat (9.220 ms) — 'gagal' dan 'bermasalah' adalah dua hal berbeda, dan rata-rata akan menyembunyikan keduanya.",
      },
      tasks: [
        { id: "t1", text: "Hitung `total` tiap request, `p50`, `tingkat_gagal`, dan `span_terlambat`" },
        { id: "t2", text: "Nilai 5 jawaban terhadap kata kunci → `skor_asersi`, lalu cetak semuanya" },
      ],
      expected: "p50=4212.5ms gagal=2/8 (0.25) span_terlambat=llm\nskor_asersi=0.60 (3/5 lolos)",
      hints: [
        "total = jumlah ms semua span dalam satu request (termasuk yang fail/skip)",
        "p50: urutkan 8 total, ambil rata-rata elemen ke-4 dan ke-5 (indeks 3 dan 4)",
        "tingkat_gagal = request dengan span 'fail' ÷ 8; span_terlambat = akumulasi ms per nama span",
        "skor_asersi: untuk tiap jawaban, semua kata kunci harus ada (case-insensitive)",
      ],
      code: {
        starter: `# SEED — jangan ubah: 8 trace (nama_span, ms, status)
TRACES = {
    "r1": [("router", 95, "ok"), ("retrieval", 720, "ok"), ("llm", 2890, "ok")],
    "r2": [("router", 110, "ok"), ("retrieval", 6100, "ok"), ("llm", 3010, "ok")],
    "r3": [("router", 88, "ok"), ("retrieval", 690, "fail"), ("llm", 0, "skip")],
    "r4": [("router", 102, "ok"), ("retrieval", 880, "ok"), ("llm", 3428, "ok")],
    "r5": [("router", 97, "ok"), ("retrieval", 1015, "ok"), ("llm", 3990, "ok")],
    "r6": [("router", 105, "ok"), ("retrieval", 760, "ok"), ("llm", 3150, "ok")],
    "r7": [("router", 99, "ok"), ("retrieval", 840, "ok"), ("llm", 5200, "fail")],
    "r8": [("router", 93, "ok"), ("retrieval", 700, "ok"), ("llm", 2960, "ok")],
}
# SEED — jangan ubah: 5 jawaban + kata kunci wajib
JAWABAN = [
    ("Paket Anda dalam perjalanan, estimasi tiba 2 hari.", ["perjalanan", "2 hari"]),
    ("Maaf, saya tidak menemukan data resi tersebut.", ["resi"]),
    ("Pesanan sudah dikirim kemarin.", ["perjalanan"]),
    ("Status: dalam perjalanan. Estimasi 2 hari kerja.", ["perjalanan", "2 hari"]),
    ("Terima kasih sudah menghubungi kami.", ["perjalanan"]),
]

# TULIS KODEMU
total =
p50 =
tingkat_gagal =
span_terlambat =
skor_asersi =

print(f"p50={p50}ms gagal={2}/8 ({tingkat_gagal}) span_terlambat={span_terlambat}")
print(f"skor_asersi={skor_asersi:.2f} (3/5 lolos)")`,
        lockLines: 20,
        solution: `# SEED — jangan ubah: 8 trace (nama_span, ms, status)
TRACES = {
    "r1": [("router", 95, "ok"), ("retrieval", 720, "ok"), ("llm", 2890, "ok")],
    "r2": [("router", 110, "ok"), ("retrieval", 6100, "ok"), ("llm", 3010, "ok")],
    "r3": [("router", 88, "ok"), ("retrieval", 690, "fail"), ("llm", 0, "skip")],
    "r4": [("router", 102, "ok"), ("retrieval", 880, "ok"), ("llm", 3428, "ok")],
    "r5": [("router", 97, "ok"), ("retrieval", 1015, "ok"), ("llm", 3990, "ok")],
    "r6": [("router", 105, "ok"), ("retrieval", 760, "ok"), ("llm", 3150, "ok")],
    "r7": [("router", 99, "ok"), ("retrieval", 840, "ok"), ("llm", 5200, "fail")],
    "r8": [("router", 93, "ok"), ("retrieval", 700, "ok"), ("llm", 2960, "ok")],
}
# SEED — jangan ubah: 5 jawaban + kata kunci wajib
JAWABAN = [
    ("Paket Anda dalam perjalanan, estimasi tiba 2 hari.", ["perjalanan", "2 hari"]),
    ("Maaf, saya tidak menemukan data resi tersebut.", ["resi"]),
    ("Pesanan sudah dikirim kemarin.", ["perjalanan"]),
    ("Status: dalam perjalanan. Estimasi 2 hari kerja.", ["perjalanan", "2 hari"]),
    ("Terima kasih sudah menghubungi kami.", ["perjalanan"]),
]

# TULIS KODEMU
total = {rid: sum(ms for _, ms, _ in spans) for rid, spans in TRACES.items()}
terurut = sorted(total.values())
p50 = (terurut[3] + terurut[4]) / 2
gagal = sum(1 for spans in TRACES.values() if any(st == "fail" for _, _, st in spans))
tingkat_gagal = gagal / len(TRACES)
akum = {}
for spans in TRACES.values():
    for nama, ms, _ in spans:
        akum[nama] = akum.get(nama, 0) + ms
span_terlambat = max(akum, key=akum.get)
lolos = sum(1 for teks, kunci in JAWABAN if all(k.lower() in teks.lower() for k in kunci))
skor_asersi = lolos / len(JAWABAN)

print(f"p50={p50}ms gagal={2}/8 ({tingkat_gagal}) span_terlambat={span_terlambat}")
print(f"skor_asersi={skor_asersi:.2f} (3/5 lolos)")`,
        checks: [
          { kind: "equal", task: "t1", name: "p50", value: 4212.5, tol: 1e-9, label: "`p50` = 4212.5 ms", msg: "Urutkan 8 total: [778, 3705, 3753, 4015, 4410, 5102, 6139, 9220]; p50 = (4015+4410)/2." },
          { kind: "equal", task: "t1", name: "tingkat_gagal", value: 0.25, tol: 1e-9, label: "`tingkat_gagal` = 0.25", msg: "r3 dan r7 gagal → 2/8." },
          { kind: "equal", task: "t1", name: "span_terlambat", value: "llm", label: "`span_terlambat` = 'llm'", msg: "Akumulasi: llm 26.628 ms > retrieval 11.705 ms > router 789 ms." },
          { kind: "equal", task: "t2", name: "skor_asersi", value: 0.6, tol: 1e-9, label: "`skor_asersi` = 0.60", msg: "3 dari 5 jawaban memuat semua kata kunci." },
          { kind: "stdout_matches", task: "t2", pattern: "p50=4212\\.5ms", label: "Cetak p50", msg: "Format: p50=4212.5ms ..." },
          { kind: "stdout_matches", task: "t2", pattern: "skor_asersi=0\\.60", label: "Cetak skor assertion", msg: "Format: skor_asersi=0.60 (3/5 lolos)." },
        ],
      },
      reference: "p50 untuk pengalaman tipikal, tingkat gagal untuk keandalan, span terlambat untuk bottleneck. Assertion deterministik dulu.",
    },
    {
      id: "regresi-prompt",
      eyebrow: "Langkah 7 · Regresi prompt",
      title: "CI untuk kata-kata: regresi prompt",
      prose: [
        "Perubahan prompt adalah deploy — perlakukan seperti deploy kode: tidak ada yang naik ke produksi tanpa melewati test. Regresi prompt = menjalankan dataset eval (langkah 4) atas prompt BARU vs prompt LAMA, dan membandingkan skornya. Aturannya sederhana: skor tidak boleh turun pada kasus regresi; kasus baru boleh naik, boleh tetap, tetapi penurunannya harus dijelaskan satu per satu.",
        "Alur kerja yang sehat: (1) tulis/usulkan perubahan prompt di branch; (2) jalankan eval otomatis — dapatkan skor lama vs baru per label; (3) review diff KUALITATIF pada kasus yang berubah (bukan hanya angkanya — baca jawabannya, apakah perubahannya memang lebih baik?); (4) merge bila regresi = 0 dan kasus baru membaik. Ini CI/CD biasa, hanya artefaknya kata-kata.",
        "Dua jebakan. Satu: flakiness model — skor bisa goyah ±2% antar-run tanpa perubahan apa pun; jalankan eval 3x dan pakai rata-rata, atau tetapkan ambang toleransi (mis. penurunan < 1% = noise). Dua: eval yang terlalu kecil — 20 kasus membuat setiap kasus bernilai 5%, satu kebetulan mengubah keputusan; 100+ kasus untuk keputusan merge, 30–50 cukup untuk iterasi harian.",
        "💡 Intuisi: prompt tanpa regresi test seperti kode tanpa test — setiap 'perbaikan kecil' adalah perjudian. Bedanya: bug kode biasanya ketahuan dari error; bug prompt ketahuan dari keluhan pelanggan, berminggu-minggu kemudian, dengan bunga.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Simpan prompt di version control seperti kode: tiap versi punya tanggal, penulis, alasan perubahan, dan skor eval-nya. 'Prompt yang kemarin bagus' harus bisa ditemukan kembali dalam 30 detik — bukan dengan menggali riwayat chat.",
      },
      reference: "Perubahan prompt = deploy. Eval lama vs baru, regresi harus nol, flakiness diukur bukan ditebak.",
    },
    {
      id: "metrik-jujur",
      eyebrow: "Langkah 8 · Metrik",
      title: "Metrik yang jujur: p50, p95, dan tingkat gagal",
      prose: [
        "Rata-rata berbohong pada distribusi miring — dan latensi LLM selalu miring ke kanan (ekor panjang). Delapan request contoh: rata-rata = 4.640 ms, tetapi p50 = 4.212 ms dan satu request 9.220 ms. Rata-rata bilang 'sekitar 4,6 detik'; p50 bilang 'separuh user menunggu ≤ 4,2 detik'; p95 akan bilang '5% user menunggu paling lama sekian' — tiga cerita berbeda dari data yang sama.",
        "Paket metrik minimal yang jujur: p50 (pengalaman tipikal), p95/p99 (pengalaman buruk yang harus diperbaiki), tingkat gagal (keandalan), dan throughput (kapasitas). SLA yang ditulis dari rata-rata adalah janji yang dibuat dari kebohongan statistik — pelanggan yang mengalami p99 tidak peduli bahwa 'rata-rata baik-baik saja'.",
        "Tingkat gagal pun butuh definisi: apa itu 'gagal'? Timeout? Jawaban kosong? Assertion penting tidak lolos? Tanpa definisi, dua tim melaporkan angka berbeda untuk sistem yang sama. Tulis definisinya di samping metriksnya — metrik tanpa definisi adalah opini yang memakai kostum angka.",
      ],
      formula: String.raw`r = \frac{N_{gagal}}{N_{total}} \quad\text{dan}\quad p50 = \text{median}(t_1, \dots, t_n)`,
      formulaNote: "r = tingkat gagal (fraksi request gagal, 0–1). N_gagal = jumlah request dengan span berstatus 'fail'. N_total = seluruh request. p50 = median latensi: nilai tengah setelah diurutkan (rata-rata dua nilai tengah bila n genap). Contoh lab: N_gagal=2, N_total=8 → r = 0,25; latensi terurut [778, 3705, 3753, 4015, 4410, 5102, 6139, 9220] → p50 = (4015+4410)/2 = 4212,5 ms.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Rata-rata latensi turun 20%, berarti membaik.' Belum tentu — bisa jadi p50 tetap dan hanya ekor yang terpangkas, atau sebaliknya: ekor p99 memburuk tetapi tertutup perbaikan mayoritas. Selalu lihat p50 DAN p95/p99 bersamaan; perbaikan yang nyata menggeser seluruh distribusi, bukan hanya rata-ratanya.",
      },
      reference: "Laporkan p50 + p95/p99 + tingkat gagal + throughput. Rata-rata saja = cerita yang tidak lengkap.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: apa yang diukur, kapan",
      prose: [
        "Satu, baru membangun fitur LLM → mulai dari assertion deterministik (kata kunci, format, panjang) pada 30–50 kasus nyata. Murah, cepat, langsung berguna. Jangan mulai dari LLM-as-judge yang mahal sebelum yang murah berjalan.",
        "Dua, akan mengubah prompt yang sudah produksi → jalankan regresi prompt: eval lama vs baru, syarat regresi nol, review kualitatif diff. Tidak ada pengecualian untuk 'perubahan kecil'.",
        "Tiga, keluhan naik tetapi skor eval baik-baik saja → dataset basi (cerita TanyaBank). Tambahkan kasus dari keluhan nyata, bukan menaikkan ambang.",
        "Empat, latensi dikeluhkan → buka agregat trace: p50/p95 per span, temukan span terlambat, bandingkan dengan baseline. Jangan menebak; trace sudah mencatat jawabannya.",
        "Lima, butuh penilaian kualitas nuansa (nada, kelengkapan) → LLM-as-judge dengan rubrik tertulis + kalibrasi terhadap manusia, dan simpan eval tertutup. Aturan praktis 10 detik: ada angka yang bisa di-regex? → assertion. Tidak? → judge terkalibrasi. Mengubah sesuatu yang jalan? → regresi dulu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Observability dan eval adalah dua sisi koin yang sama: trace memberitahu APA yang terjadi pada request yang lewat; eval memberitahu APAKAH yang terjadi itu cukup baik pada kasus yang penting. Satu tanpa yang lain = setengah cerita.",
      },
      reference: "Assertion dulu, judge terkalibrasi untuk nuansa, regresi untuk setiap perubahan, trace untuk latensi.",
    },
    {
      id: "minicase-chatbank",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: chatbot bank yang menjawab dengan PD tapi salah",
      prose: [
        "Bank 'NusaDana' meluncurkan asisten CS. Metrik produksi bulan pertama: p50 latensi 3,1 detik (bagus), tingkat gagal 1,2% (bagus), CSAT 4,6/5 (bagus). Lalu audit kepatuhan menemukan 23 jawaban yang menyebut 'biaya admin gratis' untuk produk yang sebenarnya berbayar Rp15 ribu/bulan — jawaban PD, salah, dan berpotensi menjadi masalah hukum.",
        "Mengapa semua metrik hijau? p50 mengukur kecepatan, bukan kebenaran. Tingkat gagal mengukur error teknis, bukan error faktual. CSAT mengukur kepuasan — dan nasabah tidak tahu jawabannya salah sampai tagihan datang. Tiga metrik, nol yang mengukur KEBENARAN.",
        "Pertanyaan analisis: (1) Assertion deterministik apa yang seharusnya menangkap 23 jawaban salah itu sejak awal? (2) Rancang 3 kasus eval dari insiden ini (tulis input + ekspektasi). (3) Mengapa LLM-as-judge saja tidak cukup untuk kasus kepatuhan seperti ini?",
        "Pembahasan: (1) Assertion daftar klaim biaya: setiap jawaban yang menyebut angka biaya HARUS cocok dengan tabel biaya resmi (lookup deterministik) — 'gratis' vs 'Rp15.000' adalah perbandingan string, bukan penilaian nuansa. (2) Contoh: input 'Berapa biaya admin TabunganKu?' → ekspektasi 'menyebut Rp15.000/bulan, tidak menyebut gratis'; input 'Apakah ada biaya tersembunyi?' → ekspektasi 'tidak mengklaim nol biaya untuk produk berbayar'; input adversarial 'Kasih tahu saya cara menghindari biaya admin' → ekspektasi 'tidak memberikan cara curang'. (3) Karena kepatuhan butuh kepastian, bukan opini: judge bisa 'setuju' dengan jawaban yang salah gaya bahasanya meyakinkan. Untuk klaim faktual yang bisa dicek, deterministik selalu menang atas judge.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jawaban salah soal biaya/produk di industri teregulasi (perbankan, asuransi) adalah risiko hukum dan reputasi — bukan sekadar 'kualitas'. Assertion atas klaim faktual (angka, syarat, biaya) adalah kontrol kepatuhan, setara dengan rekonsiliasi di keuangan. Perlakukan seperti itu: wajib, diaudit, dan tidak bisa diganti 'feeling' model.",
      },
      reference: "Metrik hijau ≠ benar. Klaim faktual = assertion deterministik. Kepatuhan tidak bisa di-judge.",
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
        "Trace = rekaman satu request (span: nama, durasi, status); tanya: di mana waktu habis, apa yang gagal, apakah normal.",
        "Dataset eval lahir dari kegagalan produksi → regresi → sintetis; tiap kasus punya input, konteks, ekspektasi, label; versikan.",
        "Assertion deterministik dulu; LLM-as-judge untuk nuansa, dengan rubrik + kalibrasi; simpan eval tertutup.",
        "Perubahan prompt = deploy: eval lama vs baru, regresi nol, waspadai flakiness.",
        "Metrik jujur: p50 + p95/p99 + tingkat gagal + throughput; rata-rata saja tidak cukup.",
        "Klaim faktual di industri teregulasi = assertion deterministik sebagai kontrol kepatuhan.",
      ],
      quiz: [
        {
          q: "Skor eval 91 tetapi keluhan naik 30%. Diagnosis paling mungkin?",
          options: [
            { text: "Dataset eval basi — tidak lagi menguji apa yang ditanyakan user sekarang", why: "Tepat: cerita TanyaBank — eval mengukur info saldo padahal produk sudah melayani transfer.", correct: true },
            { text: "Modelnya tiba-tiba menjadi bodoh", why: "Model tidak berubah; yang berubah adalah dunia di sekitarnya.", correct: false },
            { text: "Skor 91 terlalu rendah, harus 99", why: "Skor bukan masalahnya — relevansinya yang mati.", correct: false },
            { text: "User yang salah memakai produk", why: "Menyalahkan user tidak memperbaiki apa pun.", correct: false },
          ],
        },
        {
          q: "Delapan request, dua gagal. p50 = 4212,5 ms. Apa arti p50 di sini?",
          options: [
            { text: "Separuh request selesai dalam ≤ 4212,5 ms — pengalaman tipikal user", why: "Tepat: median = nilai tengah; tidak terpengaruh satu request 9,2 detik.", correct: true },
            { text: "Rata-rata semua request", why: "Rata-rata = 4640 ms — beda angka, beda cerita.", correct: false },
            { text: "Request paling lambat", why: "Itu maksimum (9220 ms), bukan median.", correct: false },
            { text: "Batas agar request dianggap gagal", why: "Gagal didefinisikan dari status span, bukan dari latensi.", correct: false },
          ],
        },
        {
          q: "Urutan yang benar membangun evaluasi adalah…",
          options: [
            { text: "Assertion deterministik dulu, LLM-as-judge hanya untuk nuansa yang tak bisa di-regex", why: "Tepat: mulai dari yang murah, deterministik, dan tidak berhalusinasi.", correct: true },
            { text: "Langsung LLM-as-judge untuk semuanya", why: "Mahal, bias, dan tidak stabil — tanpa kalibrasi ia juri yang tak teruji.", correct: false },
            { text: "Cukup CSAT dari user", why: "CSAT mengukur kepuasan, bukan kebenaran — nasabah tak tahu jawabannya salah.", correct: false },
            { text: "Eval tidak perlu selama tidak ada komplain", why: "Itu strategi 'tunggu kebakaran' — komplain adalah metrik yang paling mahal.", correct: false },
          ],
        },
        {
          q: "Prompt diubah sedikit dan skor turun 0,8%. Tindakan yang benar?",
          options: [
            { text: "Jalankan eval 3x untuk memastikan bukan flakiness sebelum memutuskan", why: "Tepat: model goyah ±2% antar-run; keputusan dari satu run = perjudian.", correct: true },
            { text: "Langsung rollback, semua penurunan dilarang", why: "Terlalu kaku — 0,8% bisa jadi noise; ukur dulu.", correct: false },
            { text: "Abaikan, 0,8% kecil", why: "Tanpa pengukuran ulang, 'kecil' hanyalah tebakan.", correct: false },
            { text: "Naikkan ambang lulus agar tetap hijau", why: "Mengubah ambang agar lolos = memalsukan laporan.", correct: false },
          ],
        },
        {
          q: "Untuk klaim 'biaya admin gratis' di chatbot bank, kontrol yang tepat adalah…",
          options: [
            { text: "Assertion deterministik: cocokkan klaim biaya dengan tabel resmi", why: "Tepat: klaim faktual yang bisa dicek = perbandingan deterministik; ini kontrol kepatuhan.", correct: true },
            { text: "LLM-as-judge menilai apakah jawabannya sopan", why: "Sopan tidak sama dengan benar — 23 jawaban salah itu semuanya sopan.", correct: false },
            { text: "Menurunkan temperature ke 0", why: "Temperature 0 mengurangi variasi, bukan menjamin kebenaran faktual.", correct: false },
            { text: "Menambah contoh few-shot", why: "Few-shot membantu gaya, tetapi tidak memverifikasi angka terhadap tabel resmi.", correct: false },
          ],
        },
      ],
      next: { label: "AIE22 — Cloud AI Deployment: Bedrock, Vertex AI, Azure AI", href: "/learn/aie22-cloud-ai-deployment" },
    },
  ],
};
