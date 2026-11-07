import type { V2Lesson } from "../lib/types";

// Parameter latih: full fine-tune d^2 vs LoRA 2*d*r untuk d=4096.
const FIG_LORA = `<svg viewBox="0 0 480 260" role="img" aria-label="Perbandingan parameter latih: full fine-tune 16,8 juta vs LoRA r=8 hanya 65 ribu.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="120" y1="30" x2="120" y2="210"/><line x1="120" y1="210" x2="460" y2="210"/></g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text)">
<text x="8" y="62">Full FT</text><text x="8" y="112">LoRA r=32</text><text x="8" y="162">LoRA r=16</text><text x="8" y="212">LoRA r=8</text>
</g>
<rect x="120" y="46" width="330" height="22" fill="var(--c1)" fill-opacity="0.85" rx="4"/>
<rect x="120" y="96" width="5.2" height="22" fill="var(--c2)" fill-opacity="0.85" rx="4"/>
<rect x="120" y="146" width="2.6" height="22" fill="var(--c3)" fill-opacity="0.85" rx="4"/>
<rect x="120" y="196" width="1.3" height="22" fill="var(--c4)" fill-opacity="0.9" rx="4"/>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)">
<text x="456" y="62" text-anchor="end">16,8 jt</text>
<text x="180" y="112">262 rb</text>
<text x="180" y="162">131 rb</text>
<text x="180" y="212">65,5 rb</text>
</g>
<text x="290" y="244" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">parameter yang dilatih (satu matriks 4096×4096)</text>
</svg>`;

// Memori bobot 7B: fp32 28 GB, fp16 14 GB, 4-bit 3,5 GB (+ adapter LoRA ~0,0001 GB).
const FIG_MEM = `<svg viewBox="0 0 480 250" role="img" aria-label="Memori bobot model 7B: fp32 28 GB, fp16 14 GB, 4-bit 3,5 GB, adapter LoRA nyaris nol.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="200" x2="460" y2="200"/></g>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle" fill="var(--text)">
<rect x="80" y="24" width="60" height="176" fill="var(--c1)" fill-opacity="0.85" rx="4"/>
<text x="110" y="216">fp32</text><text x="110" y="16" fill="var(--chart-text)" font-size="11">28 GB</text>
<rect x="190" y="112" width="60" height="88" fill="var(--c2)" fill-opacity="0.85" rx="4"/>
<text x="220" y="216">fp16</text><text x="220" y="104" fill="var(--chart-text)" font-size="11">14 GB</text>
<rect x="300" y="178" width="60" height="22" fill="var(--c3)" fill-opacity="0.85" rx="4"/>
<text x="330" y="216">4-bit</text><text x="330" y="170" fill="var(--chart-text)" font-size="11">3,5 GB</text>
<rect x="410" y="197" width="60" height="3" fill="var(--c4)" rx="2"/>
<text x="440" y="216">LoRA</text><text x="440" y="190" fill="var(--chart-text)" font-size="11">0,0001 GB</text>
</g>
<text x="260" y="240" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">garis GPU 24 GB ada di bawah puncak fp32 — full fine-tune butuh 84 GB total</text>
<line x1="60" y1="150" x2="460" y2="150" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="452" y="144" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" text-anchor="end">GPU 24 GB</text>
</svg>`;

export const mle26: V2Lesson = {
  slug: "mle26-fine-tuning-llm",
  track: "Machine Learning Engineer",
  module: "Adaptasi Model",
  title: "MLE26 — Fine-Tuning LLM: LoRA, QLoRA, dan DPO",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "OOM di detik ke-11: yang meledak bukan modelnya",
      prose: [
        "Februari 2026. Tim ML sebuah bank meluncurkan proyek asisten kredit: fine-tune model 7B dengan data SOP internal 40.000 dokumen. Hitungannya tampak aman: bobot model 7B dalam fp16 = 14 GB, GPU A100 mereka 40 GB. “Masih sisa 26 GB,” kata lead-nya. Training dimulai. Detik ke-11: CUDA out of memory.",
        "Bingung, mereka menyewa GPU yang lebih besar. Training jalan — sampai tagihan cloud bulan pertama tiba: Rp310 juta, 80% di antaranya untuk optimizer, bukan model. Twist-nya: yang memakan memori bukan BOBOT model (14 GB), melainkan pelatihan itu sendiri — gradien 14 GB + state optimizer Adam (m dan v dalam fp32) 56 GB. Total 84 GB untuk “melatih” 14 GB bobot. Mereka tidak membayar model yang besar; mereka membayar cara melatih yang boros.",
        "Minggu berikutnya tim kedua mengerjakan tugas yang sama dengan LoRA: bobot 7B DIBEKUKAN (tidak dilatih sama sekali), yang dilatih hanya dua matriks kecil per layer — total 0,39% parameter. Training muat di satu GPU 24 GB, selesai dalam 6 jam, skor evaluasi beda 0,4 poin dari full fine-tune. Pelajaran lesson ini: fine-tuning LLM modern bukan soal “punya GPU besar”, melainkan soal “berapa sedikit yang perlu diubah”.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung parameter latih LoRA vs full fine-tune dari d dan r; (2) menghitung kebutuhan memori bobot + optimizer untuk memutuskan full FT vs QLoRA; (3) menjelaskan perbedaan DPO dan RLHF; (4) memilih strategi fine-tuning dari budget GPU dan ukuran data; (5) mengenali catastrophic forgetting dan cara mencegahnya.",
        "Keputusan kapan fine-tune (vs RAG) diajarkan sebagai modul bersama di AIE5 — Fine-Tuning (track AI Engineering); lesson ini mendalami praktiknya di pipeline ML: data, training, dan evaluasi model hasil fine-tune.",
        "🗺️ Peta lesson: Langkah 1 · Cerita — Langkah 2 · Full FT vs PEFT — Langkah 3 · QLoRA — Langkah 4 · DPO vs RLHF — Langkah 5 · Lab aritmetika fine-tuning — Langkah 6 · Forgetting & evaluasi — Langkah 7 · Peta keputusan — Langkah 8 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Yang mahal dari fine-tuning bukan modelnya — melainkan optimizer dan gradiennya. LoRA melatih 0,39% parameter dengan hasil nyaris sama.",
    },
    {
      id: "peft",
      eyebrow: "Langkah 2 · Full FT vs PEFT",
      title: "Si Tukang Ukir Ulang vs Si Penempel Stiker",
      prose: [
        "Full fine-tuning (full FT) adalah “si tukang ukir ulang”: setiap bobot model boleh berubah. Untuk satu matriks d×d, yang dilatih = d² parameter. Dengan d = 4096, satu matriks saja = 16,8 juta parameter; model 7B punya ratusan matriks semacam itu. Hasilnya maksimal — tetapi butuh memori raksasa dan data besar, kalau tidak: overfit.",
        "LoRA (Low-Rank Adaptation) adalah “si penempel stiker”: bobot asli W DIBEKUKAN, dan yang dipelajari hanyalah koreksi kecil ΔW = B·A, dengan B berukuran d×r dan A berukuran r×d. Parameter latih = 2·d·r. Dengan r = 8 dan d = 4096: 65.536 parameter — 0,39% dari 16,8 juta. Saat inferensi, B·A bisa digabung kembali ke W (tidak ada latensi tambahan).",
        "Kenapa rank kecil cukup? Karena adaptasi ke domain baru biasanya “berdimensi rendah” — model tidak perlu mengubah seluruh pemahamannya tentang bahasa, hanya perlu menggeser sedikit perilakunya (gaya jawaban, format, pengetahuan domain). Empirinya: r = 8–64 sudah menandingi full FT untuk kebanyakan tugas instruksi. r terlalu kecil (1–2) = underfit pada tugas kompleks; r terlalu besar mendekati d = kamu membayar mahal untuk sesuatu yang setara full FT.",
        "Cara membaca: sumbu X = jumlah parameter yang dilatih untuk satu matriks 4096×4096; batang full FT 16,8 juta vs LoRA r=8 hanya 65,5 ribu. Interpretasi: menurunkan r dari 32 ke 8 memangkas parameter 4× dengan penurunan kualitas yang biasanya kecil — r adalah tuas termurah yang kamu punya.",
        "Target modules: LoRA biasanya dipasang pada proyeksi attention (q_proj, v_proj — kadang k_proj, o_proj). Praktik 2024–2026: memasang di SEMUA matriks linear (termasuk MLP) dengan r kecil sering mengalahkan r besar hanya di attention — sebar tipis, bukan tebal di satu tempat.",
      ],
      formula: String.raw`P_{\text{LoRA}} = 2\,d\,r \qquad \text{rasio} = \frac{2\,d\,r}{d^2} = \frac{2r}{d}`,
      formulaNote: "P_LoRA = jumlah parameter yang dilatih per matriks; d = dimensi matriks (mis. 4096); r = rank LoRA (mis. 8). Contoh: d=4096, r=8 → 2×4096×8 = 65.536 vs d² = 16.777.216 → rasio 0,39%. Rumus rasio menunjukkan r/d menentukan segalanya: r naik 2×, parameter naik 2×.",
      figure: {
        svg: FIG_LORA,
        alt: "Perbandingan parameter latih: full fine-tune 16,8 juta vs LoRA r=8 hanya 65 ribu.",
        caption: "Parameter latih per matriks 4096×4096: LoRA r=8 memakai 0,39% dari full fine-tune.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“LoRA selalu lebih buruk dari full fine-tune — namanya juga jalan pintas.” Tidak selalu. Pada data tugas < 100 ribu contoh, full FT sering OVERFIT (terlalu banyak parameter bebas untuk sedikit data) sementara LoRA justru menang karena kapasitasnya terbatas. Full FT unggul jelas hanya bila data sangat besar DAN distribusinya jauh dari pretraining (mis. bahasa baru). Pilih dari data, bukan dari gengsi.",
      },
      reference: "LoRA = bekukan W, latih ΔW = B·A (2dr parameter). r = 8–64 cukup untuk kebanyakan tugas instruksi.",
    },
    {
      id: "qlora",
      eyebrow: "Langkah 3 · QLoRA",
      title: "QLoRA: model 7B di GPU 24 GB",
      prose: [
        "LoRA memangkas parameter LATIH, tetapi bobot beku 7B tetap 14 GB dalam fp16. QLoRA menyerang dari sisi lain: KUANTISASI bobot beku ke 4-bit (NF4 — NormalFloat4, dirancang untuk distribusi bobot yang mirip normal). 7B × 0,5 byte = 3,5 GB. Adapter LoRA-nya sendiri tetap dihitung dalam bf16 (presisi latih), hanya 0,0001 GB. Total di bawah 4 GB untuk model 7B — muat di GPU 24 GB dengan ruang lega untuk optimizer adapter dan batch.",
        "Tiga trik yang membuat QLoRA bekerja: (1) NF4 — kuantisasi 4-bit yang sadar distribusi (bukan pembulatan naif); (2) double quantization — konstanta kuantisasi sendiri dikuantisasi (menghemat ~0,4 bit per parameter); (3) paged optimizers — state optimizer yang memuncak sesaat dipindah ke CPU (teknik dari NVIDIA unified memory), mencegah OOM spike. Hasilnya: kualitas setara LoRA fp16 pada kebanyakan benchmark.",
        "Rumus memori yang wajib dihafal: M = P × b, dengan P = jumlah parameter, b = byte per parameter (fp32 = 4, fp16/bf16 = 2, int8 = 1, 4-bit = 0,5). Contoh: 7B fp32 = 28 GB; fp16 = 14 GB; 4-bit = 3,5 GB. Untuk full FT tambah: gradien (P × b_grad) + Adam (2 × P × 4 byte untuk m dan v) → 7B fp16 full FT ≈ 14 + 14 + 56 = 84 GB.",
        "Cara membaca: tinggi batang = memori bobot 7B per presisi; garis putus-putus = batas GPU 24 GB. Interpretasi: fp32 (28 GB) bahkan tidak muat untuk INFERENSI di 24 GB; fp16 muat inferensi tetapi full FT butuh 84 GB (3,5× GPU); 4-bit + adapter LoRA muat nyaman untuk training.",
        "Kapan QLoRA TIDAK cocok: tugas yang butuh presisi numerik ekstrem pada bobot (jarang), atau saat kamu memang punya kluster GPU besar dan data masif — di situ full FT/deepspeed lebih lugas. QLoRA adalah jawaban untuk “satu GPU, satu engineer, satu akhir pekan”.",
      ],
      formula: String.raw`M = P \times b \qquad M_{\text{full-FT}} \approx P\,b + P\,b_{\text{grad}} + 2P \times 4`,
      formulaNote: "M = memori bobot; P = jumlah parameter (7B = 7×10⁹); b = byte per parameter (fp32=4, fp16=2, 4-bit=0,5). Suku kedua = gradien; suku ketiga = state Adam m dan v (fp32, masing-masing 4 byte). Contoh 7B fp16: 14 + 14 + 56 = 84 GB — inilah yang meledakkan GPU 40 GB di cerita.",
      figure: {
        svg: FIG_MEM,
        alt: "Memori bobot model 7B: fp32 28 GB, fp16 14 GB, 4-bit 3,5 GB, adapter LoRA nyaris nol.",
        caption: "Memori bobot 7B per presisi. Full fine-tune fp16 butuh ±84 GB total — QLoRA memangkasnya ke ±4 GB.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Kuantisasi 4-bit bekerja karena bobot LLM terdistribusi mirip normal — NF4 menempatkan level kuantisasinya padat di tengah (tempat sebagian besar bobot berada) dan jarang di ekor. Kuantisasi naif yang “adil” ke semua rentang justru membuang presisi di tempat yang paling dibutuhkan. Pelajaran umum: kompreslah sesuai distribusi datanya, bukan secara merata.",
      },
      reference: "QLoRA = bobot 4-bit (NF4) + adapter LoRA bf16 + paged optimizer. 7B muat di 24 GB.",
    },
    {
      id: "dpo",
      eyebrow: "Langkah 4 · DPO vs RLHF",
      title: "Si Kritikus vs Si Pelatih Anjing",
      prose: [
        "Setelah supervised fine-tuning, model bisa menjawab — tetapi belum tentu menjawab seperti yang manusia sukai (sopan, jujur, mengikuti instruksi). RLHF adalah “si pelatih anjing”: latih reward model dari preferensi manusia, lalu optimasi policy dengan PPO (reinforcement learning) agar reward-nya naik. Kuat, tetapi rumit: tiga model (policy, reward, reference), PPO yang rewel di-tuning, dan biaya komputasi besar.",
        "DPO (Direct Preference Optimization) adalah “si kritikus”: ia melewatkan reward model dan PPO sepenuhnya. DPO memakai hubungan matematis antara reward optimal dan policy optimal — sehingga preferensi manusia (pasangan jawaban menang vs kalah) bisa langsung menjadi loss function yang stabil, mirip klasifikasi biasa. Satu model, satu loss, tanpa loop RL.",
        "Rumus DPO: untuk tiap pasangan (jawaban menang y_w, jawaban kalah y_l) terhadap prompt x, naikkan log-probabilitas relatif jawaban menang DIBANDING model referensi (model sebelum DPO, dibekukan). β mengontrol seberapa jauh boleh menyimpang dari referensi: β besar = konservatif (tetap dekat dengan model awal), β kecil = agresif mengikuti preferensi.",
        "Kapan pilih apa: DPO untuk kebanyakan kasus alignment modern — lebih stabil, lebih murah, dan empirinya menandingi PPO untuk preferensi berpasangan. RLHF/PPO masih relevan bila reward-nya kompleks dan tidak bisa dinyatakan sebagai pasangan preferensi (mis. reward dari eksekusi kode atau permainan multi-langkah).",
      ],
      formula: String.raw`\mathcal{L}_{\text{DPO}} = -\mathbb{E}\left[\log \sigma\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]`,
      formulaNote: "L_DPO = loss yang diminimalkan; y_w = jawaban yang dimenangkan manusia; y_l = jawaban yang kalah; π_θ = model yang dilatih; π_ref = model referensi (beku, sebelum DPO); β = kekuatan penalti penyimpangan; σ = sigmoid. Intuisi: buat model lebih yakin pada y_w dan kurang yakin pada y_l, RELATIF terhadap titik awalnya.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“DPO membuat model selalu memilih jawaban yang manusia sukai.” DPO hanya sebaik DATA PREFERENSINYA. Preferensi yang bias (mis. anotator selalu memilih jawaban lebih panjang) akan dilatih menjadi kebiasaan model: jawaban bertele-tele yang “terasa” bagus. Audit dulu pasangan preferensimu — DPO memperkuat apa pun yang ada di datanya, termasuk kebiasaan buruk anotator.",
      },
      reference: "DPO = optimasi preferensi langsung tanpa reward model/PPO; β mengontrol jarak dari model referensi.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: aritmetika fine-tuning (numpy)",
      prose: [
        "Hitung sendiri angka-angka keputusan fine-tuning: (1) parameter latih LoRA untuk d=4096 pada r = 8/16/32 dan rasionya terhadap full fine-tune; (2) memori bobot 7B pada tiga presisi + adapter LoRA; (3) total memori full FT fp16 (bobot + gradien + Adam) dan vonis muat/tidaknya di GPU 24 GB vs QLoRA.",
        "Cara membaca: rasio = fraksi parameter yang benar-benar dilatih — 0,39% berarti 99,61% bobot tidak tersentuh; memori = syarat minimum SEBELUM aktivasi dan batch. Interpretasi: bila total full FT (84 GB) > GPU (24 GB), pilihannya bukan “GPU lebih besar” dulu melainkan QLoRA — kecuali data dan kasusmu memang menuntut full FT.",
        "Coba: ubah d menjadi 8192 (kelas model 70B) — berapa GB bobot 4-bit-nya? (Jawaban: 70×10⁹ × 0,5 byte = 35 GB — QLoRA 70B butuh 2× GPU 24 GB atau 1× 48 GB.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung parameter latih LoRA untuk r = 8, 16, 32 (d = 4096) dan simpan rasio r=8 dalam `rasio8` (dalam persen, mis. 0.39)" },
        { id: "t2", text: "Hitung memori bobot 7B (fp32/fp16/4-bit) dalam GB; simpan memori 4-bit dalam `mem4`. Hitung total full-FT fp16 (bobot + gradien fp16 + Adam fp32) dalam `total_full` dan cetak vonis MUAT/TIDAK MUAT untuk GPU 24 GB" },
      ],
      expected: "rasio r=8: 0.3906% | r=16: 0.7812% | r=32: 1.5625%\nmemori 7B — fp32: 28.0 GB | fp16: 14.0 GB | 4-bit: 3.5 GB\nadapter LoRA r=8 (fp16): 0.1311 MB\nfull-FT fp16: TIDAK MUAT di 24 GB (butuh ~84.0 GB)\nqlora 4-bit: MUAT di 24 GB (butuh ~3.5 GB + adapter)",
      code: {
        starter: `import numpy as np

# KONFIGURASI — jangan ubah
d = 4096          # dimensi matriks bobot
P = 7e9           # parameter model (7B)
GPU_GB = 24.0     # budget GPU

# TUGAS 1: parameter latih LoRA vs full fine-tune
def lora_params(d, r):
    # TODO t1: kembalikan 2*d*r
    return 0

full = d * d
rasio8 = 0.0  # TODO t1: lora_params(d, 8) / full * 100

# TUGAS 2: memori bobot & total full-FT
def mem_gb(params, byte_per_param):
    # TODO t2: params * byte_per_param / 1e9
    return 0.0

mem4 = 0.0        # TODO t2: memori 7B pada 4-bit (0.5 byte/param)
total_full = 0.0  # TODO t2: bobot fp16 + gradien fp16 + Adam (2 state fp32)

# CETAK (jangan ubah)
for r in (8, 16, 32):
    print(f"rasio r={r}: {lora_params(d, r) / full * 100:.4f}%", end=" | " if r < 32 else "\\n")
print(f"memori 7B \\u2014 fp32: {mem_gb(P, 4):.1f} GB | fp16: {mem_gb(P, 2):.1f} GB | 4-bit: {mem_gb(P, 0.5):.1f} GB")
print(f"adapter LoRA r=8 (fp16): {lora_params(d, 8) * 2 / 1e6:.4f} MB")
print(f"full-FT fp16: {'MUAT' if total_full <= GPU_GB else 'TIDAK MUAT'} di {GPU_GB:.0f} GB (butuh ~{total_full:.1f} GB)")
print(f"qlora 4-bit: {'MUAT' if mem_gb(P, 0.5) <= GPU_GB else 'TIDAK MUAT'} di {GPU_GB:.0f} GB (butuh ~{mem_gb(P, 0.5):.1f} GB + adapter)")`,
        lockLines: 7,
        solution: `import numpy as np

# KONFIGURASI — jangan ubah
d = 4096          # dimensi matriks bobot
P = 7e9           # parameter model (7B)
GPU_GB = 24.0     # budget GPU

# TUGAS 1: parameter latih LoRA vs full fine-tune
def lora_params(d, r):
    return 2 * d * r

full = d * d
rasio8 = lora_params(d, 8) / full * 100

# TUGAS 2: memori bobot & total full-FT
def mem_gb(params, byte_per_param):
    return params * byte_per_param / 1e9

mem4 = mem_gb(P, 0.5)
total_full = mem_gb(P, 2) + mem_gb(P, 2) + 2 * mem_gb(P, 4)

# CETAK (jangan ubah)
for r in (8, 16, 32):
    print(f"rasio r={r}: {lora_params(d, r) / full * 100:.4f}%", end=" | " if r < 32 else "\\n")
print(f"memori 7B \\u2014 fp32: {mem_gb(P, 4):.1f} GB | fp16: {mem_gb(P, 2):.1f} GB | 4-bit: {mem_gb(P, 0.5):.1f} GB")
print(f"adapter LoRA r=8 (fp16): {lora_params(d, 8) * 2 / 1e6:.4f} MB")
print(f"full-FT fp16: {'MUAT' if total_full <= GPU_GB else 'TIDAK MUAT'} di {GPU_GB:.0f} GB (butuh ~{total_full:.1f} GB)")
print(f"qlora 4-bit: {'MUAT' if mem_gb(P, 0.5) <= GPU_GB else 'TIDAK MUAT'} di {GPU_GB:.0f} GB (butuh ~{mem_gb(P, 0.5):.1f} GB + adapter)")`,
        checks: [
          { kind: "defined", task: "t1", name: "rasio8", label: "rasio8 terdefinisi", msg: "Hitung rasio parameter LoRA r=8 terhadap full fine-tune dalam persen." },
          { kind: "equal", task: "t1", name: "rasio8", value: 0.3906, tol: 0.0001, label: "rasio r=8 = 0,3906%", msg: "2×4096×8 / 4096² × 100 = 0,390625%." },
          { kind: "defined", task: "t2", name: "mem4", label: "mem4 terdefinisi", msg: "Hitung memori bobot 7B pada 4-bit dalam GB." },
          { kind: "equal", task: "t2", name: "mem4", value: 3.5, tol: 0.01, label: "memori 4-bit = 3,5 GB", msg: "7×10⁹ × 0,5 byte = 3,5 GB." },
          { kind: "equal", task: "t2", name: "total_full", value: 84.0, tol: 0.5, label: "total full-FT = 84 GB", msg: "14 (bobot) + 14 (gradien) + 56 (Adam m+v) = 84 GB." },
          { kind: "stdout_matches", task: "t2", pattern: "qlora 4-bit: MUAT", label: "Vonis QLoRA = MUAT", msg: "3,5 GB + adapter muat nyaman di 24 GB." },
        ],
      },
      note: {
        title: "💡 Intuisi",
        body: "Perhatikan asimetrinya: full FT membayar 84 GB untuk mengubah 14 GB bobot, sedangkan QLoRA membayar ~3,5 GB untuk mengubah 0,0001 GB adapter. “Efisiensi” di sini bukan soal hemat listrik — melainkan soal APA yang boleh berubah. LoRA adalah jawaban atas pertanyaan: seberapa sedikit perubahan yang masih mengubah perilaku?",
      },
      reference: "Hitung dulu sebelum sewa GPU: M = P×b, tambah gradien + Adam untuk full FT.",
    },
    {
      id: "forgetting",
      eyebrow: "Langkah 6 · Forgetting & evaluasi",
      title: "Catastrophic forgetting: murid yang lupa pelajaran lama",
      prose: [
        "Fine-tune model pada 40.000 dokumen SOP bank — skor task SOP naik dari 0,41 ke 0,89. Tetapi skor pengetahuan umum (MMLU) turun dari 0,68 ke 0,52: model “lupa” hal yang dulu ia kuasai. Itulah catastrophic forgetting — bobot yang dioptimasi agresif untuk distribusi baru menimpa representasi lama. LoRA lebih tahan terhadapnya (hanya 0,39% bobot berubah), tetapi tidak kebal: r besar + learning rate tinggi + epoch banyak tetap bisa melupakan.",
        "Tiga pengaman standar: (1) replay — campurkan 5–10% data umum/pretraining ke dalam data fine-tune (murah, sangat efektif); (2) learning rate kecil + epoch sedikit (1–3 epoch untuk instruksi); (3) evaluasi ganda — ukur skor TUGAS BARU dan skor KEMAMPUAN LAMA setiap checkpoint, hentikan saat yang lama mulai turun (early stopping dua arah).",
        "Evaluasi fine-tuning yang jujur butuh tiga angka, bukan satu: (a) task metric (apakah tugas barunya membaik?); (b) general metric (apakah kemampuan lama bertahan?); (c) human/LLM-judge pada sampel (apakah keluarannya benar-benar dipakai manusia?). Model dengan (a) 0,89 tetapi (b) 0,52 adalah model yang “lulus ujian tetapi lupa cara hidup”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Loss training turun terus = fine-tune berhasil.” Loss turun hanya berarti model makin cocok dengan DATA TRAINING — termasuk menghafalnya. Tanpa evaluasi (b) kemampuan lama dan (c) penilaian manusia, kamu tidak tahu apakah yang turun adalah loss atau justru kualitas model. Selalu simpan set evaluasi terkunci yang TIDAK PERNAH dipakai training.",
      },
      reference: "Lawan forgetting dengan replay + LR kecil + evaluasi dua arah (tugas baru DAN kemampuan lama).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: strategi fine-tuning apa untuk kasusmu?",
      prose: [
        "Skenario 1 — 1 GPU 24 GB, 20 ribu contoh instruksi, tugas customer service → QLoRA r=16 + DPO ringan. Murah, cepat, cukup.",
        "Skenario 2 — 8× A100, 2 juta contoh, bahasa daerah yang minim di pretraining → full FT (atau LoRA r=64 di semua linear bila ingin hemat) + replay data umum.",
        "Skenario 3 — model harus sopan & mengikuti kebijakan, data preferensi 10 ribu pasangan → SFT singkat + DPO (β sedang). Jangan PPO kecuali reward-nya tak bisa dipasangkan.",
        "Skenario 4 — 500 contoh saja, tugas klasifikasi sempit → LoRA r=8, 1–2 epoch, LR kecil. Full FT di sini = overfit yang mahal.",
        "Skenario 5 — setelah fine-tune, skor umum anjlok → tambahkan replay 10%, turunkan LR, early stopping dua arah. Bila masih anjlok: r terlalu besar.",
        "Aturan praktis 10 detik: (1) hitung memori dulu (M = P×b + optimizer) — jangan sewa GPU buta; (2) mulai dari QLoRA r=16 — naikkan hanya bila underfit terbukti; (3) alignment = DPO dulu, PPO bila perlu; (4) ukur tiga angka: tugas baru, kemampuan lama, penilaian manusia.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: Rp310 juta vs Rp18 juta",
      prose: [
        "Bank di cerita: full FT 7B di 8× A100 sewaan — tagihan Rp310 juta/bulan, 80% untuk optimizer. Alternatif QLoRA: 1× GPU 24 GB (Rp18 juta/bulan), training 6 jam, adapter 130 KB yang bisa di-versioning seperti kode. Selisih 17× — untuk beda skor evaluasi 0,4 poin.",
        "Kapan Rp310 juta itu wajar? Bila (a) data 2 juta+ dokumen dan distribusinya jauh dari pretraining, (b) model adalah aset inti perusahaan yang dipakai 24/7 oleh jutaan user, (c) tim punya MLOps untuk mengelola training terdistribusi. Bila tidak ketiganya: QLoRA dulu, buktikan underfit, baru naik kelas.",
        "Pembahasan: keputusan ini BUKAN soal “teknik terbaik” melainkan soal “teknik termurah yang cukup”. Pola senior: mulai dari yang murah (QLoRA r=16), ukur tiga angka evaluasi, naikkan hanya bila ada bukti underfit. Uang yang dihemat bisa dipakai untuk hal yang lebih menentukan kualitas: data yang lebih bersih dan evaluasi yang lebih jujur.",
      ],
      tasks: [],
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
        "Full FT melatih d² parameter + butuh gradien & Adam (±84 GB untuk 7B fp16); LoRA melatih 2dr (0,39% pada r=8).",
        "QLoRA = bobot 4-bit NF4 + adapter bf16 + paged optimizer → 7B muat di 24 GB.",
        "DPO mengoptimasi preferensi langsung tanpa reward model/PPO; β mengontrol jarak dari referensi.",
        "Catastrophic forgetting: lawan dengan replay + LR kecil + evaluasi dua arah.",
        "Aturan mulai: QLoRA r=16 dulu, naikkan bila terbukti underfit; ukur tiga angka evaluasi.",
      ],
      next: { label: "MLE27 — LLM Serving at Scale", href: "/learn/mle27-llm-serving" },
      quiz: [
        {
          q: "Matriks 4096×4096, LoRA r=8. Berapa parameter yang dilatih dan rasionya?",
          options: [
            { text: "65.536 parameter ≈ 0,39% dari 16,8 juta", why: "Tepat: 2×4096×8 = 65.536; dibagi 4096² = 0,3906%.", correct: true },
            { text: "16,8 juta — sama seperti full fine-tune", why: "Itu full FT; LoRA hanya melatih B dan A.", correct: false },
            { text: "8 parameter — hanya rank-nya", why: "r adalah rank, bukan jumlah parameter; parameternya 2dr.", correct: false },
            { text: "131.072 parameter ≈ 0,78%", why: "Itu r=16, bukan r=8.", correct: false },
          ],
        },
        {
          q: "Full fine-tune 7B dalam fp16 butuh ±84 GB. Komponen terbesarnya adalah…",
          options: [
            { text: "State optimizer Adam (m dan v, fp32) = 56 GB", why: "Tepat: 2 × 7×10⁹ × 4 byte = 56 GB — inilah yang meledakkan GPU di cerita.", correct: true },
            { text: "Bobot model fp16 = 14 GB", why: "Bobot hanya 14 GB; yang meledak adalah biaya pelatihannya.", correct: false },
            { text: "Data training 40.000 dokumen", why: "Data disimpan di disk/RAM host, bukan memori GPU training.", correct: false },
            { text: "Adapter LoRA", why: "Adapter hanya ~0,0001 GB — justru solusi hematnya.", correct: false },
          ],
        },
        {
          q: "Setelah fine-tune, skor tugas baru 0,89 tetapi MMLU turun 0,68 → 0,52. Diagnosis dan obat pertama?",
          options: [
            { text: "Catastrophic forgetting — campurkan 5–10% data umum (replay) dan turunkan learning rate", why: "Tepat: gejala klasik lupa kemampuan lama; replay adalah obat termurah.", correct: true },
            { text: "Underfit — naikkan rank dan tambah epoch", why: "Terbalik: masalahnya bukan tugas baru (0,89 bagus), melainkan kemampuan lama yang hilang.", correct: false },
            { text: "Data kotor — bersihkan data fine-tune", why: "Data kotor merusak tugas baru; di sini tugas baru justru bagus.", correct: false },
            { text: "Model terlalu kecil — pakai 70B", why: "Ukuran bukan akar masalah; forgetting terjadi di semua ukuran.", correct: false },
          ],
        },
        {
          q: "Kapan DPO lebih tepat daripada RLHF/PPO?",
          options: [
            { text: "Preferensi tersedia sebagai pasangan menang-kalah dan ingin training yang stabil dan murah", why: "Tepat: DPO dirancang persis untuk kasus ini — satu loss tanpa loop RL.", correct: true },
            { text: "Reward hanya bisa didapat dari eksekusi kode multi-langkah", why: "Itu kasus untuk RL/PPO — reward tak bisa dinyatakan sebagai pasangan preferensi.", correct: false },
            { text: "Tidak ada data preferensi sama sekali", why: "Tanpa preferensi, DPO maupun RLHF tidak bisa jalan; butuh SFT dulu.", correct: false },
            { text: "Selalu — DPO menggantikan RLHF di semua kasus", why: "Tidak: reward kompleks non-pasangan masih butuh RL.", correct: false },
          ],
        },
        {
          q: "GPU 24 GB, 500 contoh klasifikasi sempit. Pilihan paling waras?",
          options: [
            { text: "LoRA r=8, 1–2 epoch, learning rate kecil", why: "Tepat: data sedikit → kapasitas kecil + training singkat mencegah overfit.", correct: true },
            { text: "Full fine-tune 10 epoch", why: "16,8 juta parameter per matriks untuk 500 contoh = overfit yang mahal.", correct: false },
            { text: "QLoRA r=256", why: "r=256 mendekati full FT per matriks — boros untuk tugas sempit.", correct: false },
            { text: "Tidak usah fine-tune, pakai prompting saja bila cukup", why: "Masuk akal sebagai opsi awal, tetapi soal meminta pilihan fine-tuning yang waras.", correct: false },
          ],
        },
        {
          q: "β pada DPO diperkecil drastis. Efeknya?",
          options: [
            { text: "Model boleh menyimpang jauh dari referensi — agresif mengikuti preferensi, risiko over-optimasi", why: "Tepat: β kecil = penalti penyimpangan kecil.", correct: true },
            { text: "Training menjadi lebih stabil", why: "Terbalik: β kecil = kurang jangkar ke referensi = lebih liar.", correct: false },
            { text: "Model kembali ke perilaku pretraining", why: "Itu efek β BESAR, bukan kecil.", correct: false },
            { text: "Tidak ada efek — β hanya untuk logging", why: "β mengontrol trade-off inti DPO.", correct: false },
          ],
        },
      ],
    },
  ],
};
