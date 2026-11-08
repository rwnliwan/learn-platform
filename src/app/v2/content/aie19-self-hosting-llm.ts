import type { V2Lesson } from "../lib/types";

// Titik impas: API (USD 1 / 1 jt token, ilustrasi) vs self-host 1 GPU (USD 3/jam, ilustrasi) = 2,19 miliar token/bulan.
const FIG_BREAKEVEN = `<svg viewBox="0 0 520 280" role="img" aria-label="Biaya bulanan API naik dengan volume, self-host tetap, titik impas 2,19 miliar token per bulan.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="56" y1="240" x2="500" y2="240"/><line x1="56" y1="185" x2="500" y2="185"/><line x1="56" y1="130" x2="500" y2="130"/><line x1="56" y1="75" x2="500" y2="75"/><line x1="56" y1="20" x2="500" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="50" y="244">0</text><text x="50" y="189">1.500</text><text x="50" y="134">3.000</text><text x="50" y="79">4.500</text><text x="50" y="24">6.000</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="56" y="258">0</text><text x="204" y="258">2 M</text><text x="352" y="258">4 M</text><text x="500" y="258">6 M</text></g>
<text x="278" y="274" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">token per bulan (miliar)</text>
<line x1="56" y1="240" x2="500" y2="20" stroke="var(--c1)" stroke-width="3"/>
<line x1="56" y1="159.7" x2="500" y2="159.7" stroke="var(--c4)" stroke-width="3" stroke-dasharray="8 5"/>
<circle cx="218.1" cy="159.7" r="6" fill="var(--c2)" stroke="var(--text)" stroke-width="2"/>
<g fill="var(--text)" font-size="12" font-family="var(--font-ui)"><text x="66" y="205" font-weight="600">API: naik dengan volume</text><text x="300" y="150" font-weight="600">Self-host: tetap USD 2.190/bln</text><text x="228" y="142" font-size="11">impas ≈ 2,2 M token/bln</text></g>
<text x="56" y="14" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">USD per bulan</text>
</svg>`;

export const aie19: V2Lesson = {
  slug: "aie19-self-hosting-llm",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE19 — Self-Hosting LLM: vLLM, Ollama & Ekonomi GPU",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memutuskan self-host vs API dari lima kriteria (volume, latensi, privasi, kustomisasi, total cost); (2) menghitung kebutuhan VRAM dari parameter, presisi, dan KV cache; (3) menjelaskan continuous batching dan PagedAttention dengan analogi yang benar; (4) menghitung titik impas biaya self-host vs API; (5) merancang operasi GPU yang sadar cold-start dan fallback.",
        "🗺️ Isi lesson: Langkah 1 · Peta — Langkah 2 · Cerita GPU yang 6x lebih mahal — Langkah 3 · Self-host vs API — Langkah 4 · Mesin penyaji (vLLM, Ollama) — Langkah 5 · Sizing VRAM + rumus — Langkah 6 · Throughput vs latensi — Langkah 7 · Lab kalkulator — Langkah 8 · Operasi GPU — Langkah 9 · Peta keputusan — Langkah 10 · Mini-case — Checkpoint.",
        "Semua angka harga di lesson ini adalah ILUSTRASI orde besaran untuk latihan berhitung, bukan harga pasar. Di pekerjaan nyata, ganti dengan angka kontrak cloud-mu sendiri — metodenya yang dibawa pulang, bukan angkanya.",
      ],
      tasks: [],
      reference: "Self-host = sewa tetap 24/7. API = bayar per token. Keputusan yang benar dimulai dari titik impas, bukan dari rasa 'punya GPU sendiri lebih keren'.",
    },
    {
      id: "cerita-gpu-mahal",
      eyebrow: "Langkah 2 · Cerita",
      title: "GPU yang 'lebih murah' — 6 kali lebih mahal",
      prose: [
        "Startup SaaS 'ArsipKu' memproses 360 juta token per bulan untuk fitur ringkasan dokumen. Tagihan API (angka ilustrasi USD 1 per 1 juta token): USD 360 per bulan. CTO-nya gelisah: 'Masa selamanya bayar per token? Sewa 1 GPU, jalan 24 jam, pasti lebih murah.' GPU disewa, model 13B dipasang, tim merayakan kemerdekaan dari vendor.",
        "Tiga bulan kemudian finance mengetuk pintu. Sewa 1 GPU × 24 jam × 30 hari (ilustrasi USD 3 per jam): USD 2.190 per bulan. Dan GPU itu sibuk hanya 4 persen waktu — request datang jam kerja saja, malam hari ia menghangatkan ruangan dengan listrik yang tetap dibayar. Tagihan 'lebih murah' itu: 6 kali lipat dari API. Twist-nya: yang mahal bukan GPU-nya, melainkan jam-jam kosong yang ikut dibayar.",
        "Cerita ini bukan alasan untuk tidak pernah self-host — melainkan alasan untuk berhitung SEBELUM sewa. Self-host menang besar pada volume tinggi yang stabil; ia kalah telak pada volume kecil yang bergejolak. Lesson ini memberimu kalkulatornya: VRAM, throughput, dan titik impas.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Biaya efektif self-host per token = tagihan bulanan tetap ÷ token yang benar-benar dilayani. Utilisasi 4 persen berarti kamu membayar 25 kali lipat per token dibanding utilisasi 100 persen. API membalik logikanya: utilisasi 0 persen = tagihan 0.",
      },
      reference: "Murah per jam ≠ murah per bulan. Utilisasi adalah pengali tersembunyi semua hitungan self-host.",
    },
    {
      id: "kapan-self-host",
      eyebrow: "Langkah 3 · Self-host vs API",
      title: "Kapan menyewa GPU, kapan membayar per token",
      prose: [
        "Kriteria satu — volume dan pola beban. Volume besar dan STABIL (chatbot 24/7, pipeline batch malam yang penuh) adalah habitat alami self-host: biaya tetap terbagi ke banyak token. Volume kecil, musiman, atau tak menentu adalah habitat API: kamu hanya membayar yang dipakai. Utilisasi di bawah 30 persen hampir selalu membuat self-host kalah.",
        "Kriteria dua — latensi dan kontrol. Butuh latensi yang bisa dijamin (SLA ketat), colocated dengan datamu, atau bebas dari rate limit vendor? Self-host memberimu kendali penuh atas antrean, batching, dan prioritas. API memberimu kemudahan dengan mengorbankan kendali.",
        "Kriteria tiga — privasi dan data residency. Data kesehatan, perbankan, atau data yang diatur UU PDP: mengirimnya ke API vendor berarti due diligence vendor, DPA, dan risiko kebocoran di pihak ketiga. Self-host di infrastruktur sendiri memotong rantai itu — dengan catatan kamu sendiri yang bertanggung jawab atas keamanannya.",
        "Kriteria empat — kustomisasi. Fine-tune dengan data sendiri, logit bias, constrained decoding (grammar/JSON schema di level sampler), atau menghapus filter keamanan vendor untuk use case sah (mis. red-teaming internal): semua ini hanya mungkin bila kamu memegang modelnya. API hanya memberimu kenop yang disediakan vendor.",
        "Kriteria lima — total cost of ownership, bukan harga sewa. Self-host = sewa GPU + listrik + engineer yang bisa debug CUDA OOM jam 2 pagi + waktu muat ulang model + GPU cadangan. API = token × harga + sedikit integrasi. Banyak tim lupa menjumlahkan tiga suku terakhir — dan itulah yang membuat 'lebih murah' menjadi 6x lebih mahal.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Self-host pasti lebih murah kalau volumenya besar.' Belum tentu — 'besar' harus diukur terhadap TITIK IMPAS, bukan perasaan. 360 juta token/bulan terdengar besar, tetapi di bawah titik impas 2,19 miliar token/bulan (dengan angka ilustrasi lesson ini). Besar yang tidak dihitung = mahal yang tidak disadari.",
      },
      reference: "Lima kriteria: volume & pola, latensi & kontrol, privasi, kustomisasi, TCO. Utilisasi < 30% → API hampir selalu menang.",
    },
    {
      id: "mesin-penyaji",
      eyebrow: "Langkah 4 · Mesin penyaji",
      title: "vLLM, Ollama, dan cara model dilayani",
      prose: [
        "vLLM adalah server inferensi open-source yang menjadi standar de facto self-hosting. Senjata utamanya: continuous batching — request baru disisipkan ke batch yang SEDANG berjalan, tanpa menunggu batch lama selesai. Server naive menunggu seluruh batch selesai dulu (request cepat ikut menunggu yang lambat); vLLM mengisi setiap celah kosong. Hasilnya: throughput bisa 2–4x lipat pada hardware yang sama.",
        "Senjata kedua: PagedAttention. KV cache (memori 'ingatan' percakapan yang sedang berjalan) biasanya dialokasikan sebagai blok besar yang boros dan terfragmentasi. PagedAttention memecahnya jadi blok-blok kecil seperti paging pada sistem operasi: blok dialokasikan sesuai kebutuhan, tidak ada ruang menganggur. Analoginya: kos-kosan yang menyewakan kamar utuh untuk satu orang (boros) vs apartemen yang menyewakan per blok dan bisa diisi siapa saja (padat). Efeknya: batch lebih besar muat di VRAM yang sama.",
        "Ollama adalah jalan pintas untuk lokal dan pengembangan: satu perintah `ollama run llama3.1:8b`, model terkuantisasi otomatis, API sederhana. Ia hebat untuk prototyping, demo offline, dan eksperimen di laptop. Ia BUKAN server produksi: tidak punya continuous batching serius, observability terbatas, dan satu proses melayani seadanya.",
        "TGI (Text Generation Inference dari Hugging Face) sekilas: alternatif vLLM dengan fitur serupa (continuous batching, kuantisasi), integrasi erat dengan ekosistem Hugging Face. Polanya sama — pilih satu, kuasai, jangan koleksi. Di lesson ini vLLM menjadi contoh rujukan karena dokumentasi dan adopsinya paling luas.",
        "Kepribadian ketiganya: vLLM adalah manajer gudang yang obsesif mengisi setiap celah; PagedAttention adalah arsitek apartemen blok; Ollama adalah kios kaki lima — cepat, murah, akrab, tetapi jangan minta ia melayani resepsi pernikahan 500 tamu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Ollama jalan mulus di laptop, jadi tinggal pindah ke server untuk produksi.' Salah besar. Laptopmu melayani SATU user sabar; produksi melayani ratusan konkuren yang tidak sabar. Tanpa continuous batching, throughput runtuh dan latensi meledak. Prototipe di Ollama, produksi di vLLM (atau sejenisnya) — itu dua pekerjaan berbeda.",
      },
      reference: "vLLM = continuous batching + PagedAttention untuk produksi. Ollama = prototyping lokal. TGI = alternatif sekelas vLLM.",
    },
    {
      id: "sizing-vram",
      eyebrow: "Langkah 5 · Sizing VRAM",
      title: "Berapa GB yang sebenarnya kamu butuhkan",
      prose: [
        "VRAM yang dibutuhkan model = tiga kantong: bobot model + KV cache + overhead. Bobot = jumlah parameter × byte per parameter. FP16 memakai 2 byte, INT8 memakai 1 byte, INT4 memakai 0,5 byte — kuantisasi memangkas kantong bobot hingga 4x. KV cache = 'ingatan' token yang sedang diproses: 2 × jumlah layer × dimensi hidden × byte × panjang konteks. Overhead = konteks CUDA + aktivasi, sekitar 2–4 GB, sering dilupakan lalu menyebabkan OOM di menit terakhir.",
        "Contoh dihitung — model 7B, 32 layer, dimensi 4096, konteks 8192, FP16. Bobot: 7×10⁹ × 2 byte = 14 GB. KV cache: 2 × 32 × 4096 × 2 × 8192 byte ≈ 4,3 GB. Overhead: 3 GB. Total ≈ 21,3 GB → muat nyaman di GPU 24 GB. Ganti ke INT4: bobot 3,5 GB → total ≈ 10,8 GB → GPU 16 GB pun cukup.",
        "Skala naik — 13B FP16 (40 layer, dimensi 5120, konteks 8192): bobot 26 GB + KV 6,7 GB + overhead 3 GB ≈ 35,7 GB → butuh GPU 80 GB atau dua GPU 24 GB dengan tensor parallelism. Versi INT4-nya: 6,5 + 6,7 + 3 ≈ 16,2 GB → satu GPU 24 GB cukup. 70B FP16 (80 layer, dimensi 8192): bobot 140 GB + KV 21,5 GB + 3 GB ≈ 164 GB → minimal dua GPU 80 GB; versi INT4 ≈ 59,5 GB → satu GPU 80 GB dengan headroom tipis. Semua angka ini ilustrasi orde besaran untuk arsitektur mirip Llama — hitung ulang untuk arsitekturmu.",
        "Dua jebakan sizing. Satu: konteks panjang menggelembungkan KV cache secara linear — konteks 128k bisa membuat KV cache LEBIH BESAR dari bobotnya. Dua: batch serving menambah KV cache per request konkuren — hitungan untuk 1 request bukan hitungan untuk 32 request konkuren. Sizing yang jujur memakai konteks maksimum × batch maksimum, bukan kasus terbaik.",
      ],
      formula: String.raw`M_{VRAM} \approx \frac{P \cdot b}{10^9} + \frac{2 \cdot L \cdot d \cdot b_{kv} \cdot C}{10^9} + M_{overhead}`,
      formulaNote: "M_VRAM = total VRAM dalam GB (desimal). P = jumlah parameter, mis. 7×10⁹. b = byte per parameter: FP16 = 2, INT8 = 1, INT4 = 0,5. L = jumlah layer transformer. d = dimensi hidden per layer. b_kv = byte per elemen KV cache (biasanya sama dengan presisi bobot). C = panjang konteks maksimum dalam token. M_overhead = konteks CUDA + aktivasi, ≈ 2–4 GB. Contoh: P=7×10⁹, b=2, L=32, d=4096, b_kv=2, C=8192 → 14 + 4,3 + 3 ≈ 21,3 GB.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Model 7B cuma 14 GB, jadi GPU 16 GB cukup.' Itu baru kantong PERTAMA. KV cache 8k konteks menambah 4,3 GB dan overhead 3 GB → 21,3 GB total. Sizing dari bobot saja adalah resep OOM (out of memory) di deployment pertama. Hitung tiga kantong, atau biarkan CUDA yang menghitung untukmu — dengan cara yang menyakitkan.",
      },
      reference: "VRAM = bobot + KV cache + overhead. Kuantisasi memangkas bobot, tetapi KV cache tumbuh linear dengan konteks × batch.",
    },
    {
      id: "throughput-latensi",
      eyebrow: "Langkah 6 · Throughput vs latensi",
      title: "Tokens per detik vs detik per token",
      prose: [
        "Dua metrik yang sering tertukar. Throughput = total token per detik yang dihasilkan GPU (ukuran efisiensi hardware). Latensi per request = waktu yang dialami SATU user (ukuran pengalaman). Batching menaikkan throughput tetapi menaikkan latensi per request — 32 request berbagi GPU menghasilkan lebih banyak token per detik, tetapi tiap user menunggu giliran. Tidak ada makan siang gratis; ada pilihan sadar.",
        "Dua sub-metrik latensi untuk LLM: TTFT (time to first token) — jeda dari request sampai token pertama muncul; dan TPOT (time per output token) — kecepatan token mengalir setelahnya. Untuk chatbot, TTFT kecil terasa jauh lebih cepat walau total waktu sama — user melihat progres, bukan spinner. Streaming pada dasarnya adalah trik memangkas TTFT yang dirasakan.",
        "Continuous batching (vLLM) adalah jembatan keduanya: ia menjaga throughput tinggi TANPA memaksa request baru menunggu batch selesai — TTFT tetap rendah sementara GPU tetap sibuk. Inilah kenapa vLLM terasa 'lebih cepat' padahal GPU-nya sama: ia menghilangkan waktu tunggu antrean, bukan mempercepat aritmetika.",
        "Aturan praktis: interaktif (chat) → optimasi TTFT + streaming; batch offline (ringkasan 10 ribu dokumen) → optimasi throughput murni, batch sebesar muat VRAM. Mengukur yang salah = mengoptimasi yang salah.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Throughput menjawab 'berapa banyak kerja selesai per jam' (pertanyaan finance). Latensi menjawab 'berapa lama SAYA menunggu' (pertanyaan user). Server yang throughput-nya bagus tetapi TTFT-nya 8 detik akan dinilai 'lemot' oleh setiap user yang mencobanya — dan penilaian user adalah metrik yang membayar tagihan.",
      },
      reference: "Batching: throughput naik, latensi per request naik. Chat → TTFT kecil + streaming. Batch offline → throughput maksimal.",
    },
    {
      id: "lab-vram-impas",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: kalkulator VRAM dan titik impas",
      prose: [
        "Lab dua babak. Babak satu: hitung tiga kantong VRAM untuk model 7B FP16 dengan konteks 8192 — `vram_bobot`, `vram_kv`, `vram_total` — lalu tentukan `muat_24gb`. Babak dua: dengan harga ilustrasi (sewa GPU USD 3/jam, API USD 1 per 1 juta token), hitung `host_bulan` dan `impas_token`, lalu bandingkan pemenang di tiga volume.",
        "Coba ubah setelah berhasil: ganti BYTE menjadi 0.5 (INT4) dan lihat `vram_total` turun drastis — tetapi `vram_kv` tetap, karena KV cache dihitung dari KVBYTE. Lalu naikkan KONTEKS ke 32768 dan amati kantong KV membengkak. Inilah cara engineer 'merasakan' rumus sebelum mempercayainya.",
        "Angka harga di lab ini ILUSTRASI. Di pekerjaan nyata, ganti GPU_JAM dan API_1JT dengan angka kontrakmu — struktur labnya tetap sama, dan itulah yang membuatnya reusable.",
      ],
      figure: {
        svg: FIG_BREAKEVEN,
        alt: "Grafik biaya bulanan: garis API naik linear dengan volume, garis self-host datar di USD 2.190, berpotongan di 2,19 miliar token per bulan.",
        caption: "Cara membaca: sumbu X = token per bulan (miliar); sumbu Y = USD per bulan; garis naik = biaya API (USD 1 per 1 juta token, ilustrasi); garis datar putus-putus = self-host 1 GPU 24/7 (USD 3/jam × 730 jam, ilustrasi); titik temu = titik impas. Interpretasi: di bawah ≈2,2 miliar token/bulan API lebih murah; di atasnya self-host menang — dengan catatan volume STABIL (GPU idle tetap dibayar penuh).",
      },
      tasks: [
        { id: "t1", text: "Hitung `vram_bobot`, `vram_kv`, `vram_total` (GB), dan `muat_24gb` (True/False)" },
        { id: "t2", text: "Hitung `host_bulan` (USD) dan `impas_token` (token/bulan)" },
        { id: "t3", text: "Cetak semua hasil + pemenang (`menang`) di tiap volume" },
      ],
      expected: "total=21.3GB muat_24gb=True host_bulan=USD2190 impas=2.19 miliar token/bulan; menang: API, API, HOST",
      note: {
        title: "💡 Intuisi",
        body: "Rumus titik impas: (USD/jam × 730) ÷ (USD per 1 juta token ÷ 1.000.000) = token/bulan. Ia linear dan jujur: naikkan harga GPU 2x → impas naik 2x. Setiap negosiasi kontrak cloud bisa langsung diterjemahkan ke 'berapa token/bulan keputusan berubah'.",
      },
      hints: [
        "vram_bobot = P * BYTE / 1e9; vram_kv = 2 * NLAYER * DMODEL * KVBYTE * KONTEKS / 1e9",
        "vram_total = ketiganya dijumlah; muat_24gb = vram_total <= 24",
        "host_bulan = GPU_JAM * JAM; impas_token = host_bulan / (API_1JT / 1_000_000)",
      ],
      code: {
        starter: `# SEED — jangan ubah (angka HARGA = ilustrasi orde besaran)
P = 7_000_000_000       # parameter model: 7B
BYTE = 2.0              # FP16 = 2 byte per parameter
NLAYER = 32             # jumlah layer transformer
DMODEL = 4096           # dimensi hidden per layer
KVBYTE = 2.0            # KV cache disimpan FP16
KONTEKS = 8192          # panjang konteks maksimum (token)
OVERHEAD = 3.0          # GB untuk konteks CUDA + aktivasi
GPU_JAM = 3.0           # USD/jam sewa 1 GPU — ILUSTRASI
JAM = 730               # jam dalam sebulan
API_1JT = 1.0           # USD per 1 juta token API — ILUSTRASI
VOLUME = [50_000_000, 500_000_000, 5_000_000_000]  # token per bulan

# TULIS KODEMU: VRAM + titik impas
vram_bobot =
vram_kv =
vram_total =
muat_24gb =
host_bulan =
impas_token =

print(f"bobot={vram_bobot:.1f}GB kv={vram_kv:.1f}GB total={vram_total:.1f}GB")
print(f"muat_24gb={muat_24gb}")
print(f"host_bulan=USD{host_bulan:.0f}")
print(f"impas={impas_token/1e9:.2f} miliar token/bulan")
for v in VOLUME:
    api = v / 1_000_000 * API_1JT
    menang = "HOST" if host_bulan < api else "API"
    print(f"volume={v/1e9:.1f} miliar api=USD{api:.0f} menang={menang}")`,
        lockLines: 15,
        solution: `# SEED — jangan ubah (angka HARGA = ilustrasi orde besaran)
P = 7_000_000_000       # parameter model: 7B
BYTE = 2.0              # FP16 = 2 byte per parameter
NLAYER = 32             # jumlah layer transformer
DMODEL = 4096           # dimensi hidden per layer
KVBYTE = 2.0            # KV cache disimpan FP16
KONTEKS = 8192          # panjang konteks maksimum (token)
OVERHEAD = 3.0          # GB untuk konteks CUDA + aktivasi
GPU_JAM = 3.0           # USD/jam sewa 1 GPU — ILUSTRASI
JAM = 730               # jam dalam sebulan
API_1JT = 1.0           # USD per 1 juta token API — ILUSTRASI
VOLUME = [50_000_000, 500_000_000, 5_000_000_000]  # token per bulan

# TULIS KODEMU: VRAM + titik impas
vram_bobot = P * BYTE / 1e9
vram_kv = 2 * NLAYER * DMODEL * KVBYTE * KONTEKS / 1e9
vram_total = vram_bobot + vram_kv + OVERHEAD
muat_24gb = vram_total <= 24
host_bulan = GPU_JAM * JAM
impas_token = host_bulan / (API_1JT / 1_000_000)

print(f"bobot={vram_bobot:.1f}GB kv={vram_kv:.1f}GB total={vram_total:.1f}GB")
print(f"muat_24gb={muat_24gb}")
print(f"host_bulan=USD{host_bulan:.0f}")
print(f"impas={impas_token/1e9:.2f} miliar token/bulan")
for v in VOLUME:
    api = v / 1_000_000 * API_1JT
    menang = "HOST" if host_bulan < api else "API"
    print(f"volume={v/1e9:.1f} miliar api=USD{api:.0f} menang={menang}")`,
        checks: [
          { kind: "equal", task: "t1", name: "vram_bobot", value: 14.0, tol: 1e-9, label: "`vram_bobot` = 14.0 GB", msg: "7 miliar × 2 byte = 14 GB." },
          { kind: "equal", task: "t1", name: "vram_kv", value: 4.294967296, tol: 1e-6, label: "`vram_kv` ≈ 4.295 GB", msg: "2 × 32 × 4096 × 2 × 8192 byte ≈ 4,295 GB." },
          { kind: "equal", task: "t1", name: "vram_total", value: 21.294967296, tol: 1e-6, label: "`vram_total` ≈ 21.295 GB", msg: "14 + 4,295 + 3 = 21,295 GB." },
          { kind: "equal", task: "t1", name: "muat_24gb", value: true, label: "`muat_24gb` = True", msg: "21,3 GB ≤ 24 GB → muat." },
          { kind: "equal", task: "t2", name: "host_bulan", value: 2190.0, tol: 1e-9, label: "`host_bulan` = USD 2.190", msg: "3 × 730 = 2.190." },
          { kind: "equal", task: "t2", name: "impas_token", value: 2190000000.0, tol: 1.0, label: "`impas_token` = 2,19 miliar", msg: "2.190 ÷ (1/1.000.000) = 2,19 miliar token/bulan." },
          { kind: "stdout_matches", task: "t3", pattern: "impas=2\\.19 miliar token/bulan", label: "Cetak titik impas", msg: "Format: impas=2.19 miliar token/bulan." },
          { kind: "stdout_matches", task: "t3", pattern: "menang=HOST", label: "Volume 5 miliar dimenangi HOST", msg: "Pada 5 miliar token/bulan, API = USD 5.000 > host USD 2.190." },
        ],
      },
      reference: "Titik impas = (USD/jam × 730) ÷ (USD per 1 juta token / 1 juta). Tiga kantong VRAM selalu dihitung bersama.",
    },
    {
      id: "operasi-gpu",
      eyebrow: "Langkah 8 · Operasi",
      title: "GPU tidak autoscale seperti CPU",
      prose: [
        "Operasi dasar tetap sama: health check (`/health` menjawab 200 bila model siap menerima request), metrik (antrean, TTFT, tokens/detik, OOM count), dan log yang bisa ditelusuri. Yang berbeda adalah skala waktu kegagalan: GPU yang kehabisan VRAM tidak 'lambat' — ia mati dengan CUDA OOM. Monitoring VRAM adalah monitoring detak jantung.",
        "Autoscaling GPU itu mahal dan lambat. Menambah satu replica berarti: provisioning instance (menit) + menarik image + memuat puluhan GB bobot ke VRAM (menit) + warmup. Total 5–15 menit dari keputusan scale sampai melayani — lonjakan trafik 10 menit sudah selesai sebelum bantuan datang. CPU autoscale dalam puluhan detik; GPU autoscale dalam belasan menit. Merancang seolah keduanya sama adalah undangan untuk insiden.",
        "Strategi yang bekerja: overprovision secukupnya untuk puncak yang bisa diprediksi (jam kerja), antrean + backpressure untuk lonjakan tak terduga, dan FALLBACK KE API saat overload — request berlebih dialihkan ke API vendor dengan degradasi yang sopan, bukan ditolak mentah. Hibrida (self-host sebagai basis + API sebagai katup pelepas) mengalahkan kemurnian arsitektur.",
        "Dan jebakan pamungkas: GPU idle 24/7. Berbeda dengan API yang tagihannya nol saat nol request, GPU yang menganggur tetap menagih penuh. Setiap malam sepi, setiap akhir pekan, setiap libur panjang = uang yang dibayar untuk menghangatkan data center. Sebelum self-host, jawab jujur: berapa persen jam dalam sebulan GPU ini benar-benar bekerja?",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Nanti autoscale saja kalau ramai.' GPU tidak bisa 'nanti' — cold start 5–15 menit berarti autoscale bereaksi terhadap masa lalu, bukan masa kini. Lonjakan 10 menit = 10 menit penderitaan user, lalu replica baru datang saat pesta sudah bubar. Rancang fallback API + antrean DARI HARI PERTAMA; anggap autoscale GPU sebagai bonus, bukan rencana.",
      },
      reference: "Cold start GPU = menit, bukan detik. Overprovision untuk pola yang bisa diprediksi; fallback API untuk lonjakan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: API, self-host, atau hibrida",
      prose: [
        "Satu, volume kecil atau tak menentu (di bawah titik impas, mis. < 2 miliar token/bulan) → API. Kamu membayar tepat yang dipakai; nol request = nol tagihan. Startup tahap awal hampir selalu di sini.",
        "Dua, volume besar dan stabil 24/7 (di atas titik impas, utilisasi > 50 persen) → self-host dengan GPU dedicated. Setiap token di atas impas adalah penghematan. Chatbot enterprise dan pipeline batch malam yang penuh tinggal di sini.",
        "Tiga, data sensitif atau terikat regulasi (kesehatan, perbankan, data di bawah UU PDP) → self-host, atau API hanya bila vendor memenuhi syarat data residency + DPA yang bisa diaudit. Biaya kepatuhan yang gagal jauh lebih mahal dari selisih GPU vs API.",
        "Empat, butuh kontrol mendalam (fine-tune sendiri, constrained decoding, logit bias, tanpa filter vendor untuk red-teaming sah) → self-host. API hanya menyewakan kenop yang disediakan; self-host memberimu kunci ruang mesin.",
        "Lima, beban bergejolak tajam (event, musim ujian, kampanye) → API sebagai basis + self-host opsional untuk beban dasar (hibrida). Menambah GPU untuk puncak 2 bulan = membayar 10 bulan idle. Aturan praktis 10 detik: hitung titik impas dulu — (USD/jam × 730) ÷ (USD per 1 juta token / 1 juta). Di bawahnya → API. Di atasnya + stabil + ada alasan non-biaya → self-host. Berfluktuasi → hibrida.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Keputusan ini bukan sekali-seumur-hidup. Pola yang benar: mulai dari API (nol capex, validasi produk dulu), ukur volume riil 2–3 bulan, hitung impas dengan angka kontrakmu, BARU pindah ke self-host bila matematika mendukung. Migrasi API → self-host jauh lebih mudah daripada menyesali GPU yang terlanjur disewa setahun.",
      },
      reference: "Di bawah impas → API. Di atas impas + stabil → self-host. Berfluktuasi → hibrida. Mulai dari API, pindah bila matematika mendukung.",
    },
    {
      id: "minicase-belajarkita",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: BelajarKita dan musim ujian",
      prose: [
        "Edutech 'BelajarKita': 40 ribu user aktif memakai tutor AI. Rata-rata 25 request per user per bulan, 1.200 token per request → 1,2 miliar token/bulan. Dengan angka ilustrasi lesson ini (titik impas 2,19 miliar token/bulan), 1,2 miliar < impas → API menang. Tagihan API ≈ USD 1.200/bulan vs self-host USD 2.190/bulan.",
        "Lalu datang musim ujian nasional: 2 bulan dalam setahun, traffic naik 4x menjadi 4,8 miliar token/bulan — JAUH di atas impas. CTO tergoda menyewa GPU 'untuk musim ujian'. Hitung tahunan: (10 × 1,2 + 2 × 4,8) ÷ 12 = 1,8 miliar token/bulan rata-rata — masih di bawah impas. Menyewa GPU setahun untuk 2 bulan puncak = membayar 10 bulan idle. Keputusan: tetap API.",
        "Pertanyaan analisis: (1) Pada volume berapa per bulan keputusan berubah menjadi self-host, dan berapa GPU yang dibutuhkan bila 1 GPU melayani ~150 juta token/bulan pada latensi yang ditargetkan? (2) Mengapa lonjakan 4x selama 2 bulan tidak mengubah keputusan tahunan? (3) Rancang strategi menghadapi musim ujian TANPA menyewa GPU: apa yang disiapkan 1 bulan sebelumnya?",
        "Pembahasan: (1) Di atas 2,19 miliar token/bulan yang STABIL. 4,8 miliar ÷ 150 juta ≈ 32 GPU → USD 70 ribu/bulan untuk 2 bulan — jauh lebih mahal dari API USD 4.800/bulan di bulan puncak. (2) Karena biaya GPU bersifat tetap tahunan sementara lonjakan bersifat sementara; rata-rata tahunan yang menentukan, bukan puncak. (3) Kontrak API dengan burst limit dinegosiasi sebelumnya + cache jawaban untuk soal yang berulang + antrean prioritas saat overload + degradasi sopan (mode ringkas). Musim ujian dihadapi dengan persiapan kontrak, bukan dengan hardware.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan infrastruktur yang salah adalah risiko finansial berjangka: kontrak GPU tahunan tidak bisa di-unsubscribe saat ternyata volume tidak sampai. Perlakukan seperti keputusan kredit — hitung skenario dasar, optimis, dan pesimis SEBELUM tanda tangan, bukan sesudah.",
      },
      reference: "Rata-rata tahunan menentukan, bukan puncak. Puncak sementara → kontrak API + cache + antrean, bukan GPU.",
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
        "Self-host vs API diputuskan lima kriteria: volume & pola beban, latensi & kontrol, privasi/data residency, kustomisasi, dan total cost of ownership.",
        "vLLM menang lewat continuous batching + PagedAttention; Ollama untuk prototyping lokal, bukan produksi.",
        "VRAM = bobot (P × byte) + KV cache (2 × layer × dimensi × byte × konteks) + overhead 2–4 GB.",
        "Titik impas = (USD/jam × 730) ÷ (USD per 1 juta token / 1 juta); di bawahnya API menang.",
        "Autoscaling GPU butuh menit (cold start); rancang fallback API + antrean dari hari pertama.",
        "Utilisasi rendah adalah pembunuh ekonomi self-host: GPU idle 24/7 tetap ditagih penuh.",
      ],
      next: { label: "AIE20 — LangChain & LangGraph Hands-On", href: "/v2/learn/aie20-langchain-langgraph" },
      quiz: [
        {
          q: "Model 70B FP16: komponen VRAM terbesar adalah…",
          options: [
            { text: "Bobot model (~140 GB)", why: "Tepat: 70 miliar × 2 byte = 140 GB, jauh di atas KV cache (~21,5 GB) dan overhead (~3 GB).", correct: true },
            { text: "KV cache", why: "KV cache besar pada konteks panjang, tetapi untuk 70B bobot tetap dominan.", correct: false },
            { text: "Overhead CUDA", why: "Overhead hanya 2–4 GB — kecil dibanding dua kantong lainnya.", correct: false },
            { text: "Ketiganya sama besar", why: "Tidak: 140 vs 21,5 vs 3 — bobot mendominasi.", correct: false },
          ],
        },
        {
          q: "Kapan self-host mengalahkan API dari sisi biaya?",
          options: [
            { text: "Volume stabil di atas titik impas", why: "Tepat: biaya tetap terbagi ke banyak token; di atas impas tiap token = penghematan.", correct: true },
            { text: "Volume kecil agar 'punya GPU sendiri'", why: "Volume kecil = utilisasi rendah = biaya per token membengkak.", correct: false },
            { text: "Selalu, karena sewa GPU lebih murah dari API", why: "Tidak selalu — cerita ArsipKu: 6x lebih mahal karena idle.", correct: false },
            { text: "Saat traffic tidak menentu", why: "Traffic tak menentu = idle berbayar = habitat API.", correct: false },
          ],
        },
        {
          q: "Apa inti continuous batching pada vLLM?",
          options: [
            { text: "Request baru disisipkan ke batch yang sedang berjalan tanpa menunggu batch selesai", why: "Tepat: tidak ada waktu tunggu antrean batch; GPU terus terisi.", correct: true },
            { text: "Model dilatih ulang secara kontinu", why: "Itu continual learning — tidak ada hubungannya dengan serving.", correct: false },
            { text: "Batch dibuat sebesar mungkin tanpa batas", why: "Batch tetap dibatasi VRAM; yang kontinu adalah penyisipannya.", correct: false },
            { text: "Request diproses satu per satu berurutan", why: "Itu kebalikannya: naive serving tanpa batching.", correct: false },
          ],
        },
        {
          q: "Ide dasar PagedAttention adalah…",
          options: [
            { text: "KV cache dialokasikan per blok kecil seperti paging memori OS, mengurangi fragmentasi", why: "Tepat: blok kecil terisi padat; batch lebih besar muat di VRAM yang sama.", correct: true },
            { text: "Attention dihitung per halaman dokumen", why: "'Paged' di sini soal manajemen memori, bukan pagination dokumen.", correct: false },
            { text: "Model dibagi ke beberapa GPU", why: "Itu tensor parallelism — teknik berbeda.", correct: false },
            { text: "KV cache dihapus setiap request", why: "KV cache justru dipertahankan selama generasi; yang dioptimasi alokasinya.", correct: false },
          ],
        },
        {
          q: "Lonjakan traffic 10 menit terjadi. Mengapa autoscaling GPU bukan penyelamat?",
          options: [
            { text: "Cold start 5–15 menit: replica datang setelah lonjakan selesai", why: "Tepat: provisioning + muat puluhan GB bobot ke VRAM memakan menit.", correct: true },
            { text: "GPU tidak bisa di-scale sama sekali", why: "Bisa, tetapi lambat — masalahnya waktu, bukan kemustahilan.", correct: false },
            { text: "Autoscaling GPU gratis sehingga semua orang memakainya", why: "Kebalikannya: mahal dan lambat.", correct: false },
            { text: "Lonjakan 10 menit tidak mungkin terjadi", why: "Sangat mungkin: event, viral, musim ujian.", correct: false },
          ],
        },
        {
          q: "Kuantisasi INT4 untuk self-host berarti…",
          options: [
            { text: "Bobot menyusut ~4x dari FP16, tetapi kualitas wajib dievaluasi dulu", why: "Tepat: 2 byte → 0,5 byte; penurunan kualitas bervariasi per model dan tugas.", correct: true },
            { text: "Model menjadi 4x lebih akurat", why: "Kuantisasi tidak menambah akurasi; ia kompresi dengan potensi degradasi.", correct: false },
            { text: "KV cache ikut menyusut otomatis", why: "KV cache dihitung dari KVBYTE sendiri — tidak otomatis ikut kecuali dikuantisasi juga.", correct: false },
            { text: "Tidak ada tradeoff sama sekali", why: "Selalu ada tradeoff kualitas vs ukuran; ukur sebelum percaya.", correct: false },
          ],
        },
      ],
    },
  ],
};
