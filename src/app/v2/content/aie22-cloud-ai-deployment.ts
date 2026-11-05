import type { V2Lesson } from "../lib/types";

// Biaya bulanan 3 provider ilustrasi vs p99: termurah (GunaAI $1,40) melanggar SLA 3000 ms.
const FIG_COST_P99 = `<svg viewBox="0 0 520 300" role="img" aria-label="Biaya vs p99 tiga provider; garis SLA 3000 ms.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="56" y1="250" x2="500" y2="250"/><line x1="56" y1="195" x2="500" y2="195"/><line x1="56" y1="140" x2="500" y2="140"/><line x1="56" y1="85" x2="500" y2="85"/><line x1="56" y1="30" x2="500" y2="30"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="50" y="254">0</text><text x="50" y="199">1,5</text><text x="50" y="144">3</text><text x="50" y="89">4,5</text><text x="50" y="34">6</text></g>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="110" y="190" width="60" height="60" fill="var(--c4)" fill-opacity="0.85"/><text x="140" y="266" fill="var(--chart-text)">GunaAI</text><text x="140" y="182" fill="var(--text)">$1,40</text>
<rect x="230" y="136" width="60" height="114" fill="var(--c1)" fill-opacity="0.85"/><text x="260" y="266" fill="var(--chart-text)">NusaCloud</text><text x="260" y="128" fill="var(--text)">$2,40</text>
<rect x="350" y="28" width="60" height="222" fill="var(--c1)" fill-opacity="0.5"/><text x="380" y="266" fill="var(--chart-text)">CakraML</text><text x="380" y="20" fill="var(--text)">$4,80</text>
</g>
<text x="110" y="120" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">p99 4.500 ms ✗</text>
<text x="230" y="112" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">p99 1.800 ms ✓</text>
<text x="350" y="250" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="translate(350,250)">p99 900 ms ✓</text>
<text x="56" y="14" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">USD per bulan (ilustrasi)</text>
<text x="470" y="292" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">SLA p99 ≤ 3.000 ms</text>
</svg>`;

export const aie22: V2Lesson = {
  slug: "aie22-cloud-ai-deployment",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE22 — Cloud AI Deployment: Bedrock, Vertex AI, Azure AI",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan model managed (Bedrock, Vertex AI, Azure AI) dari self-host dan tahu kapan masing-masing menang; (2) membaca kuota/rate limit dan memodelkannya sebagai token bucket; (3) mengelola kunci API dan IAM dengan aman; (4) menghitung total biaya deployment dari tiga provider ilustrasi dan memilih yang memenuhi SLA; (5) merancang pola gateway: satu pintu, fallback, dan cache.",
        "🗺️ Isi lesson: Langkah 1 · Peta — Langkah 2 · Cerita provider termurah — Langkah 3 · Managed vs self-host — Langkah 4 · Endpoint & kuota — Langkah 5 · Kunci API — Langkah 6 · Lab kalkulator — Langkah 7 · Pola gateway — Langkah 8 · Biaya tersembunyi — Langkah 9 · Peta keputusan — Langkah 10 · Mini-case — Checkpoint.",
        "Semua angka harga di lesson ini ILUSTRASI orde besaran untuk latihan berhitung, bukan harga pasar. Di pekerjaan nyata, ganti dengan price list provider-mu — metodenya yang dibawa pulang.",
      ],
      tasks: [],
      reference: "Pilih provider dari SLA dulu, harga kedua. Yang termurah per token bisa menjadi yang termahal per pelanggan yang kabur.",
    },
    {
      id: "cerita-provider-termurah",
      eyebrow: "Langkah 2 · Cerita",
      title: "Provider termurah yang paling mahal",
      prose: [
        "Startup transkripsi 'Svara' memilih provider AI termurah per token (ilustrasi): USD 0,35 per 1 juta token input. Spreadsheet-nya indah — tagihan bulanan diproyeksi paling rendah di antara tiga kandidat. Launch week tiba: jam 7–9 malam, ribuan user mengunggah voice note bersamaan. p99 latensi menyentuh 4,5 detik, lalu 429 (rate limit) bertebaran. User menatap spinner, menutup aplikasi, dan sebagian tidak kembali.",
        "Tim menghitung ulang dengan jujur: churn 8% dari kohort launch week × LTV Rp120 ribu = Rp96 juta pendapatan hilang — untuk menghemat selisih USD 1 per bulan dibanding provider kedua termurah. Twist-nya: spreadsheet hanya menghitung biaya TOKEN, bukan biaya PELANGGAN YANG KABUR. Provider 'termurah' memenangkan sel spreadsheet dan mengalahkan bisnisnya.",
        "Pelajarannya bukan 'jangan pilih yang murah' — melainkan 'pilih dari SLA dulu, harga kedua'. Latensi p99, rate limit, dan keandalan adalah spesifikasi; harga adalah tie-breaker di antara yang memenuhi spesifikasi. Lesson ini memberimu kalkulatornya: biaya tiga provider + simulasi token bucket + pola gateway agar 429 tidak menjadi cerita horor.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Memilih provider AI seperti memilih kurir logistik: yang termurah per kilo tetapi sering terlambat akan membunuh toko onlinemu lewat review bintang satu. SLA (p99, uptime, rate limit) adalah kontrak; harga adalah diskon. Jangan menukar kontrak dengan diskon.",
      },
      reference: "Spesifikasi dulu (p99, rate limit, keandalan), harga sebagai penentu di antara yang lolos.",
    },
    {
      id: "managed-vs-selfhost",
      eyebrow: "Langkah 3 · Managed vs self-host",
      title: "Menyewa supir vs menyetir sendiri",
      prose: [
        "Bekal ringkas dari AIE19 (2–3 kalimat): self-host = sewa GPU 24/7, menang pada volume besar yang stabil di atas titik impas; API bayar-per-token menang pada volume kecil/bergejolak; keputusan dihitung dari (USD/jam × 730) ÷ (USD per 1 juta token / 1 juta). Lesson ini membahas sisi API-nya: provider managed.",
        "Provider managed (AWS Bedrock, Google Vertex AI, Azure AI) adalah 'menyewa supir': mereka menjalankan modelnya, kamu memanggil API. Yang kamu beli: nol operasi GPU, scaling otomatis, integrasi IAM/keamanan cloud, dan SLA resmi. Yang kamu bayar: harga per token lebih mahal dari self-host pada volume besar, ketergantungan vendor, dan kendali terbatas (tidak bisa utak-atik sampler atau menghapus filter).",
        "Kapan managed menang telak: time-to-market (launch minggu ini, bukan kuartal depan), tim tanpa engineer infra ML, beban bergejolak tajam, dan kebutuhan kepatuhan (data residency region, sertifikasi, audit log bawaan). Kapan self-host menang: volume stabil raksasa, butuh kustomisasi mendalam (fine-tune sendiri, constrained decoding), atau data yang tidak boleh keluar dari infrastruktur sendiri.",
        "Posisi tengah yang populer: gateway sendiri di depan provider managed (langkah 7) — kamu dapat kemudahan managed + kendali routing, cache, dan fallback di tanganmu. Ini pola default yang sehat untuk kebanyakan tim: mulai managed, tambah gateway, pindah ke self-host hanya bila matematika mendukung.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Managed = tidak perlu engineer.' Managed menghilangkan operasi GPU, bukan menghilangkan engineering: kamu tetap butuh prompt engineering, eval (AIE21), guard rail biaya (AIE20), retry/fallback, dan keamanan kunci. Yang dibeli adalah bebas dari CUDA OOM jam 2 pagi — sisanya tetap pekerjaanmu.",
      },
      reference: "Managed = nol operasi GPU + SLA resmi, dengan harga per token lebih mahal dan kendali terbatas. Pola sehat: managed + gateway sendiri.",
    },
    {
      id: "endpoint-kuota",
      eyebrow: "Langkah 4 · Endpoint & kuota",
      title: "Endpoint, kuota, dan token bucket",
      prose: [
        "Setiap provider managed memberimu tiga hal: endpoint (URL API), kuota (batas pemakaian: request per menit, token per menit/hari), dan tier (makin tinggi tier, makin longgar kuota). Kuota dilanggar → HTTP 429 (terlalu banyak request) → request-mu ditolak. 429 bukan error provider — ia kontrak yang kamu langgar.",
        "Model mental kuota adalah token bucket: ember berkapasitas K token, terisi ulang R token per detik; setiap request mengambil token sesuai biayanya; ember kosong = request ditolak (atau antre). Bucket membuat burst pendek tetap bisa lewat (ember penuh menampung lonjakan) sambil membatasi rata-rata jangka panjang (refill). Inilah yang disimulasikan lab: kapasitas 10, refill 2/detik, tiap request 3 token.",
        "Tiga strategi menghadapi 429 yang sehat: (1) backoff eksponensial + jitter pada retry — jangan retry serentak (thundering herd); (2) antrean dengan prioritas — request interaktif didahulukan dari batch; (3) degradasi sopan — saat kuota habis, jawab dari cache atau mode ringkas, bukan error mentah ke user. Yang tidak sehat: retry tanpa batas secepat mungkin — itu cara tercepat mengubah 429 sementara menjadi pemblokiran permanen.",
        "💡 Intuisi: kuota seperti batas kartu kredit — ia ada untuk melindungimu dari tagihan gila sekaligus melindungi provider dari diserbu. Engineer yang baik membaca limit SEBELUM launch, bukan setelah 429 pertama.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Selalu minta 'berapa kuota tier kami, dan berapa biaya naik tier' SEBELUM arsitektur final. Banyak desain yang indah runtuh karena mengasumsikan kuota tak terbatas — dan kuota termurah hampir selalu lebih kecil dari yang kamu kira.",
      },
      reference: "429 = kontrak yang dilanggar, bukan error. Token bucket = model mental kuota. Retry pakai backoff + jitter, bukan membabi buta.",
    },
    {
      id: "iam-kunci",
      eyebrow: "Langkah 5 · Kunci API",
      title: "Kunci API bukan untuk di-hardcode",
      prose: [
        "Kunci API adalah password ke dompetmu: siapa pun yang memegangnya bisa membakar token atas tagihanmu. Aturan satu: JANGAN PERNAH hardcode di kode, di repo git, di notebook yang dibagikan, atau di aplikasi mobile (bisa di-extract). Riwayat git tidak pernah lupa — kunci yang pernah ter-commit harus dianggap bocor dan dirotasi, tidak peduli sudah dihapus dari commit terbaru.",
        "Praktik yang benar: kunci hidup di secret manager (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) atau environment variable di server; aplikasi mengambil saat runtime. Rotasi berkala (mis. 90 hari) + rotasi darurat sekali klik. Dan prinsip least privilege: kunci produksi hanya boleh memanggil model yang dibutuhkan, bukan semua layanan dengan semua izin.",
        "IAM melengkapi: siapa (service account per layanan, bukan satu kunci dewa untuk semua), boleh apa (role minimal), dari mana (batasi IP/VPC bila bisa). Jejak audit (siapa memanggil apa, kapan) adalah buktinya saat insiden. Di mobile/web client, JANGAN panggil provider langsung — panggil gateway/backend-mu sendiri yang memegang kunci (langkah 7); kunci di tangan client = kunci di tangan publik.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Repo-nya private, jadi aman hardcode kunci.' Private hari ini ≠ private selamanya: karyawan resign, repo di-fork, akses salah konfigurasi, laptop hilang. Satu kebocoran = tagihan puluhan juta dari bot yang menemukan kunci dalam hitungan menit (scanner GitHub bekerja otomatis). Anggap setiap kunci di repo sebagai sudah bocor.",
      },
      reference: "Kunci di secret manager/env, rotasi berkala, least privilege, client tidak pernah memegang kunci langsung.",
    },
    {
      id: "lab-kalkulator",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: kalkulator 3 provider + token bucket",
      prose: [
        "Lab dua babak dengan angka ilustrasi. Babak satu: hitung `biaya` bulanan tiga provider dari 2 juta token input + 500 ribu token output, lalu tentukan `pilihan` — provider termurah yang memenuhi SLA p99 ≤ 3.000 ms. Babak dua: simulasikan token bucket (kapasitas 10, refill 2/detik, tiap request 3 token) atas 6 kedatangan → `diterima` dan `ditolak`.",
        "Perhatikan jebakannya: provider termurah (GunaAI, $1,40) memiliki p99 4.500 ms — di atas SLA. Memilihnya = mengulang cerita Svara. Keputusan yang benar: NusaCloud ($2,40, p99 1.800 ms). Harga adalah tie-breaker di antara yang lolos SLA, bukan penentu utama.",
        "Coba ubah setelah berhasil: naikkan SLA menjadi p99 ≤ 1.000 ms dan lihat pilihannya berubah menjadi CakraML — lalu tanyakan ke diri sendiri: apakah perbaikan 900 ms layak membayar $2,40 ekstra per bulan pada skala ini? Di skala 1.000x, jawabannya bisa berbeda — dan itulah gunanya kalkulator.",
      ],
      figure: {
        svg: FIG_COST_P99,
        alt: "Diagram batang biaya tiga provider; GunaAI termurah tetapi p99-nya melanggar SLA.",
        caption: "Cara membaca: tinggi batang = biaya bulanan USD (ilustrasi) untuk 2 jt token input + 0,5 jt output; label di atas batang = p99. Interpretasi: GunaAI termurah ($1,40) tetapi p99 4.500 ms melanggar SLA 3.000 ms — ia gugur. Pemenang yang benar: NusaCloud ($2,40, p99 1.800 ms). Termurah yang lolos SLA, bukan termurah absolut.",
      },
      tasks: [
        { id: "t1", text: "Hitung `biaya` tiap provider dan tentukan `pilihan` yang memenuhi SLA" },
        { id: "t2", text: "Simulasikan token bucket → `diterima` dan `ditolak`, lalu cetak semuanya" },
      ],
      expected: "biaya: NusaCloud=$2.40 GunaAI=$1.40 CakraML=$4.80 | pilihan=NusaCloud\nbucket: diterima=4 ditolak=2",
      hints: [
        "biaya = IN/1e6 * p_in + OUT/1e6 * p_out; IN=2_000_000, OUT=500_000",
        "pilihan = termurah di antara yang p99 <= 3000",
        "bucket: tiap kedatangan (t, butuh): isi ulang = min(KAPASITAS, bucket + (t - t_lalu) * REFILL)",
        "Jika bucket >= butuh: kurangi dan diterima+=1; jika tidak: ditolak+=1",
      ],
      code: {
        starter: `# SEED — jangan ubah (angka HARGA = ilustrasi)
# (nama, USD/1jt input, USD/1jt output, p99 ms)
PROVIDERS = [
    ("NusaCloud", 0.60, 2.40, 1800),
    ("GunaAI", 0.35, 1.40, 4500),
    ("CakraML", 1.20, 4.80, 900),
]
IN_TOK = 2_000_000     # token input per bulan
OUT_TOK = 500_000      # token output per bulan
SLA_P99 = 3000         # ms

# SEED — jangan ubah: token bucket
KAPASITAS = 10         # token
REFILL = 2             # token per detik
ANTRIAN = [(0, 3), (0, 3), (0, 3), (1, 3), (1, 3), (2, 3)]  # (detik, butuh token)
DOLAR = "$"  # konstanta: cetak dolar tanpa interpolasi TS

# TULIS KODEMU
biaya =
pilihan =
diterima =
ditolak =

print(f"biaya: NusaCloud={DOLAR}{biaya['NusaCloud']:.2f} GunaAI={DOLAR}{biaya['GunaAI']:.2f} CakraML={DOLAR}{biaya['CakraML']:.2f} | pilihan={pilihan}")
print(f"bucket: diterima={diterima} ditolak={ditolak}")`,
        lockLines: 15,
        solution: `# SEED — jangan ubah (angka HARGA = ilustrasi)
# (nama, USD/1jt input, USD/1jt output, p99 ms)
PROVIDERS = [
    ("NusaCloud", 0.60, 2.40, 1800),
    ("GunaAI", 0.35, 1.40, 4500),
    ("CakraML", 1.20, 4.80, 900),
]
IN_TOK = 2_000_000     # token input per bulan
OUT_TOK = 500_000      # token output per bulan
SLA_P99 = 3000         # ms

# SEED — jangan ubah: token bucket
KAPASITAS = 10         # token
REFILL = 2             # token per detik
ANTRIAN = [(0, 3), (0, 3), (0, 3), (1, 3), (1, 3), (2, 3)]  # (detik, butuh token)
DOLAR = "$"  # konstanta: cetak dolar tanpa interpolasi TS

# TULIS KODEMU
biaya = {nama: IN_TOK / 1e6 * pin + OUT_TOK / 1e6 * pout for nama, pin, pout, _ in PROVIDERS}
layak = [(nama, biaya[nama]) for nama, _, _, p99 in PROVIDERS if p99 <= SLA_P99]
pilihan = min(layak, key=lambda x: x[1])[0]
bucket = KAPASITAS
diterima = 0
ditolak = 0
t_lalu = 0
for t, butuh in ANTRIAN:
    bucket = min(KAPASITAS, bucket + (t - t_lalu) * REFILL)
    t_lalu = t
    if bucket >= butuh:
        bucket -= butuh
        diterima += 1
    else:
        ditolak += 1

print(f"biaya: NusaCloud={DOLAR}{biaya['NusaCloud']:.2f} GunaAI={DOLAR}{biaya['GunaAI']:.2f} CakraML={DOLAR}{biaya['CakraML']:.2f} | pilihan={pilihan}")
print(f"bucket: diterima={diterima} ditolak={ditolak}")`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya", value: {"NusaCloud": 2.4, "GunaAI": 1.4, "CakraML": 4.8}, label: "Biaya 3 provider benar", msg: "NusaCloud $2,40; GunaAI $1,40; CakraML $4,80." },
          { kind: "equal", task: "t1", name: "pilihan", value: "NusaCloud", label: "`pilihan` = NusaCloud", msg: "GunaAI gugur karena p99 4500 > SLA 3000; termurah yang lolos = NusaCloud." },
          { kind: "equal", task: "t2", name: "diterima", value: 4, label: "`diterima` = 4", msg: "Jejak bucket: 10→7→4→1, refill ke 3→0, lalu dua ditolak." },
          { kind: "equal", task: "t2", name: "ditolak", value: 2, label: "`ditolak` = 2", msg: "Request ke-5 (t=1) dan ke-6 (t=2) kekurangan token." },
          { kind: "stdout_matches", task: "t1", pattern: "pilihan=NusaCloud", label: "Cetak pilihan", msg: "Format: ... | pilihan=NusaCloud" },
          { kind: "stdout_matches", task: "t2", pattern: "diterima=4 ditolak=2", label: "Cetak hasil bucket", msg: "Format: bucket: diterima=4 ditolak=2" },
        ],
      },
      reference: "Hitung biaya SEMUA kandidat, saring dengan SLA, baru pilih termurah. Token bucket = model mental kuota.",
    },
    {
      id: "pola-gateway",
      eyebrow: "Langkah 7 · Gateway",
      title: "Satu pintu untuk banyak provider",
      prose: [
        "Gateway adalah backend-mu sendiri yang berdiri di depan provider: client memanggil gateway, gateway yang memanggil Bedrock/Vertex/Azure. Satu pintu ini memberimu empat kekuatan. Satu: kunci API aman — client tidak pernah melihat kunci provider. Dua: routing cerdas — request murah ke provider murah, request penting ke provider andal. Tiga: fallback — provider A 429/outage → otomatis coba provider B. Empat: cache — jawaban untuk pertanyaan yang sudah pernah ditanyakan tidak perlu memanggil model lagi.",
        "Cache adalah penghemat terbesar yang paling diremehkan: pada banyak workload, 30–50% pertanyaan adalah pengulangan (FAQ, sapaan, pertanyaan populer). Cache semantik (cocokkan makna, bukan teks persis) menangkap variasinya: 'berapa biaya admin?' dan 'biaya admin berapa ya?' adalah satu jawaban. Setiap hit = nol token, nol latensi model, nol biaya.",
        "Fallback butuh desain, bukan harapan: tentukan urutan (primer → sekunder), definisi pemicu (429, timeout > X, 5xx), dan perilaku saat SEMUA gagal (antrean + pesan jujur 'coba lagi', bukan spinner abadi). Uji fallback dengan chaos sederhana: matikan primer di staging, pastikan sekunder mengambil alih tanpa intervensi manusia.",
        "💡 Intuisi: gateway mengubah 'bergantung pada satu provider' menjadi 'berlangganan kemampuan'. Provider boleh berganti, harga boleh naik, API boleh berubah — aplikasimu tidak ikut goyang karena yang ia kenal hanya satu pintu: milikmu sendiri.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Tool seperti LiteLLM pada dasarnya adalah gateway siap pakai: satu format OpenAI-compatible untuk puluhan provider, dengan fallback dan routing bawaan. Memakai tool siap pakai untuk pola standar (gateway, fallback) dan menulis sendiri hanya untuk logika bisnis yang unik adalah pembagian kerja yang sehat.",
      },
      reference: "Gateway = kunci aman + routing + fallback + cache. Provider boleh berganti; aplikasimu tidak goyang.",
    },
    {
      id: "biaya-tersembunyi",
      eyebrow: "Langkah 8 · Biaya tersembunyi",
      title: "Egress, retry, dan cache miss",
      prose: [
        "Tagihan AI tidak hanya 'token × harga'. Empat biaya tersembunyi yang sering luput. Satu: egress — data keluar cloud bisa ditagih per GB; arsitektur yang memindahkan embedding bolak-balik antar-region membayar pajak bodoh. Dua: retry — setiap retry adalah token yang dibayar dua kali; sistem dengan 10% retry membayar 10% lebih mahal diam-diam. Tiga: cache miss — cache yang hit rate-nya rendah hanyalah kompleksitas tanpa penghematan; ukur hit rate, bukan asumsi. Empat: idle & over-provisioning di sisi self-host (AIE19) atau tier kuota yang kebesaran.",
        "Rumus totalnya jujur: biaya = token efektif × harga, di mana token efektif = token bisnis ÷ (1 − fraksi_terbuang). Fraksi terbuang = retry + duplikasi + prompt yang boros. Menurunkan fraksi terbuang 20% sama nilainya dengan diskon harga 20% — tetapi tidak perlu negosiasi dengan siapa pun.",
        "Tiga tuas penghematan yang paling manjur: (1) cache semantik untuk pengulangan; (2) prompt yang ramping — system prompt 2.000 token yang dikirim di SETIAP request adalah pajak abadi (pangkas yang tidak perlu, atau cache prefix bila provider mendukung); (3) model yang tepat per tugas — klasifikasi sederhana tidak butuh model raksasa (routing cerdas di gateway).",
      ],
      formula: String.raw`B = \frac{T_{in}}{10^6} \cdot p_{in} + \frac{T_{out}}{10^6} \cdot p_{out} \quad\text{;}\quad T_{efektif} = \frac{T_{bisnis}}{1 - f_{buang}}`,
      formulaNote: "B = biaya bulanan (USD). T_in/T_out = token input/output per bulan. p_in/p_out = harga per 1 juta token (ilustrasi). T_efektif = token yang benar-benar dibayar. T_bisnis = token yang benar-benar dibutuhkan. f_buang = fraksi terbuang (retry + duplikasi + prompt boros), 0–1. Contoh: T_bisnis = 2,5 jt token, f_buang = 0,2 → T_efektif = 3,125 jt token — seperlima tagihan adalah sampah yang bisa dihemat tanpa negosiasi.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Tagihan membengkak berarti perlu provider lebih murah.' Seringkali yang membengkak adalah PEMAKAIAN, bukan harga: retry 15%, system prompt 2.000 token di tiap request, tidak ada cache. Pindah provider tanpa memperbaiki pemakaian = memindahkan kebocoran ke ember yang lebih murah. Audit dulu: dari mana token-token itu berasal?",
      },
      reference: "Biaya = token efektif × harga. Kecilkan f_buang (retry, duplikasi, prompt boros) sebelum menegosiasi harga.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: managed, gateway, self-host",
      prose: [
        "Satu, butuh launch cepat tanpa tim infra → provider managed langsung (Bedrock/Vertex/Azure AI). Jangan bangun infrastruktur untuk produk yang belum terbukti.",
        "Dua, traffic produksi dengan pola berulang → managed + gateway sendiri (cache + fallback + routing). Ini default yang sehat untuk kebanyakan tim.",
        "Tiga, volume stabil raksasa + butuh kustomisasi mendalam → self-host (AIE19), dengan API managed sebagai fallback. Keputusan dari titik impas, bukan dari gengsi.",
        "Empat, data teregulasi/region-terikat → provider dengan region & sertifikasi yang sesuai, atau self-host di infrastruktur sendiri. Kepatuhan bukan fitur yang bisa ditawar.",
        "Lima, multi-region atau multi-provider untuk ketahanan → gateway dengan routing geografis + fallback berlapis. Aturan praktis 10 detik: tanya 'apa SLA-nya?' → pilih yang lolos → 'berapa biayanya?' → termurah di antara yang lolos → 'apa yang terjadi saat ia down?' → rancang fallback SEKARANG.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Arsitektur deployment yang baik seperti asuransi: membosankan saat semua lancar, tak ternilai saat badai. Fallback yang tidak pernah diuji = tidak ada fallback — jadwalkan chaos drill tiap kuartal.",
      },
      reference: "SLA dulu, harga kedua, fallback dirancang sejak hari pertama.",
    },
    {
      id: "minicase-sakuku",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: 10 juta token di jam sibuk",
      prose: [
        "Fintech 'SakuKu': chatbot CS memakai 10 juta token/hari pada jam sibuk (19.00–21.00) dan 1 juta token/hari di luar itu. Rasio input:output = 4:1. Analisis log: 40% pertanyaan adalah pengulangan (saldo, jadwal, promo). SLA: p99 ≤ 2.500 ms. Kandidat: NusaCloud (ilustrasi $0,60/$2,40 per 1 jt, p99 1.800 ms) dan CakraML ($1,20/$4,80 per 1 jt, p99 900 ms).",
        "Pertanyaan analisis: (1) Hitung biaya bulanan TANPA cache untuk kedua provider (asumsi 30 hari, pola di atas). (2) Dengan cache semantik 40% hit rate, berapa penghematannya per bulan untuk pilihan termurah yang lolos SLA? (3) Rancang fallback: apa pemicunya, siapa sekundernya, apa yang terjadi bila keduanya down?",
        "Pembahasan: (1) Per hari: sibuk 10 jt + sepi 1 jt = 11 jt token; input 8,8 jt, output 2,2 jt. Per bulan (×30): input 264 jt, output 66 jt. NusaCloud: 264×0,60 + 66×2,40 = 158,4 + 158,4 = $316,80. CakraML: 264×1,20 + 66×4,80 = 316,8 + 316,8 = $633,60. Keduanya lolos SLA (1.800 dan 900 ≤ 2.500) → termurah yang lolos = NusaCloud $316,80. (2) Cache 40% → token efektif 60% → $316,80 × 0,6 = $190,08; hemat $126,72/bulan (40%) — lebih besar dari selisih antar-provider. (3) Pemicu: 429/timeout/5xx beruntun dari primer (NusaCloud) → sekunder CakraML; bila keduanya down: antrean + pesan jujur + mode cache-only untuk pertanyaan populer. Pelajaran mini-case: cache mengalahkan negosiasi harga.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ketergantungan satu provider tanpa fallback adalah risiko konsentrasi — versi infrastruktur dari 'semua telur satu keranjang'. Outage 2 jam di jam sibuk = ribuan pelanggan terdampak + SLA bisnis jebol. Fallback berlapis adalah diversifikasi risiko; biayanya kecil dibanding sekali insiden.",
      },
      reference: "Hitung dengan pola nyata (bukan rata-rata), cache dulu sebelum negosiasi, fallback dirancang bukan diharapkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Managed (Bedrock/Vertex/Azure AI) = nol operasi GPU + SLA resmi; menang saat butuh cepat, tanpa tim infra, atau beban bergejolak.",
        "Kuota dimodelkan sebagai token bucket; 429 = kontrak yang dilanggar; retry pakai backoff + jitter.",
        "Kunci API di secret manager/env, rotasi berkala, least privilege; client tidak pernah memegang kunci langsung.",
        "Pilih provider: saring dengan SLA dulu, termurah di antara yang lolos; GunaAI gugur di contoh lab karena p99-nya.",
        "Gateway = kunci aman + routing + fallback + cache; cache semantik 30–50% adalah penghemat terbesar.",
        "Biaya total = token efektif × harga; kecilkan fraksi terbuang (retry, duplikasi, prompt boros) sebelum pindah provider.",
      ],
      quiz: [
        {
          q: "GunaAI $1,40/bulan tetapi p99 4.500 ms; SLA p99 ≤ 3.000 ms. Keputusan yang benar?",
          options: [
            { text: "Pilih NusaCloud ($2,40, p99 1.800 ms) — termurah di antara yang lolos SLA", why: "Tepat: harga adalah tie-breaker di antara yang memenuhi spesifikasi; GunaAI gugur.", correct: true },
            { text: "Tetap GunaAI karena termurah", why: "Mengulang cerita Svara: hemat $1/bulan, kehilangan pelanggan.", correct: false },
            { text: "Pilih CakraML karena p99 tercepat", why: "p99 tercepat tidak diperlukan bila SLA sudah terpenuhi — $4,80 adalah kemewahan yang tak perlu.", correct: false },
            { text: "Tunda keputusan sampai ada diskon", why: "SLA tidak menunggu diskon; kebutuhan launch jalan terus.", correct: false },
          ],
        },
        {
          q: "Token bucket (kapasitas 10, refill 2/detik) pada lab menolak 2 request. Artinya…",
          options: [
            { text: "Burst sesaat ditampung ember, tetapi laju rata-rata dibatasi refill — 2 request melebihi keduanya", why: "Tepat: itulah gunanya bucket — burst boleh, rata-rata dijaga.", correct: true },
            { text: "Bucket-nya rusak", why: "Penolakan adalah perilaku yang dirancang, bukan kerusakan.", correct: false },
            { text: "Kapasitas harus selalu diperbesar", why: "Memperbesar kapasitas menaikkan burst yang diizinkan — belum tentu diinginkan.", correct: false },
            { text: "Refill harus dinolkan", why: "Refill nol = tidak ada request yang pernah lolos setelah ember habis.", correct: false },
          ],
        },
        {
          q: "Kunci API di-hardcode di repo private. Risiko terbesarnya?",
          options: [
            { text: "Bocor via riwayat git/fork/akses — kunci di repo = dianggap sudah bocor, wajib rotasi", why: "Tepat: scanner otomatis menemukan kunci dalam hitungan menit; riwayat tidak pernah lupa.", correct: true },
            { text: "Kode menjadi sulit dibaca", why: "Masalah keterbacaan tidak sebanding dengan risiko finansial.", correct: false },
            { text: "Repo menjadi terlalu besar", why: "Satu baris kunci tidak memengaruhi ukuran repo secara berarti.", correct: false },
            { text: "Tidak ada risiko selama repo private", why: "Private hari ini ≠ private selamanya — asumsi yang berbahaya.", correct: false },
          ],
        },
        {
          q: "Kapan provider managed adalah pilihan yang tepat?",
          options: [
            { text: "Butuh launch cepat, tanpa tim infra ML, atau beban bergejolak tajam", why: "Tepat: nol operasi GPU + scaling otomatis + SLA resmi.", correct: true },
            { text: "Volume stabil 10 miliar token/bulan dan butuh fine-tune sendiri", why: "Itu habitat self-host: volume raksasa + kustomisasi mendalam.", correct: false },
            { text: "Data tidak boleh keluar dari data center sendiri", why: "Itu alasan self-host, kecuali provider memenuhi syarat residency yang bisa diaudit.", correct: false },
            { text: "Selalu, managed selalu menang", why: "Tidak ada yang selalu menang — ada titik impasnya (AIE19).", correct: false },
          ],
        },
        {
          q: "Cache semantik 40% hit rate pada workload $316,80/bulan menghemat…",
          options: [
            { text: "≈ $126,72/bulan (40%) — lebih besar dari selisih antar-provider", why: "Tepat: 316,80 × 0,4 = 126,72. Cache mengalahkan negosiasi harga.", correct: true },
            { text: "Tidak ada, cache hanya mempercepat", why: "Setiap hit = nol token = nol biaya — kecepatan DAN penghematan.", correct: false },
            { text: "$316,80 penuh", why: "Hit rate 40% berarti 60% tetap memanggil model.", correct: false },
            { text: "Hanya latensi, bukan biaya", why: "Kebalikannya: cache memangkas keduanya.", correct: false },
          ],
        },
        {
          q: "Fallback provider yang baik dirancang dengan…",
          options: [
            { text: "Urutan primer→sekunder, pemicu jelas (429/timeout/5xx), dan perilaku saat semua gagal", why: "Tepat: fallback adalah desain — bukan harapan.", correct: true },
            { text: "Menunggu outage lalu memilih manual", why: "Outage jam sibuk tidak menunggu manusia memilih.", correct: false },
            { text: "Satu provider saja agar sederhana", why: "Sederhana tetapi rapuh — risiko konsentrasi.", correct: false },
            { text: "Retry tanpa batas ke provider yang sama", why: "Retry ke provider yang down = memperparah + memperlambat pemulihan.", correct: false },
          ],
        },
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
