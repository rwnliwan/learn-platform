import type { V2Lesson } from "../lib/types";

// Diagram dual-encoder: dua encoder terpisah bertemu di satu ruang vektor bersama.
const FIG_DUAL = `<svg viewBox="0 0 480 290" role="img" aria-label="Arsitektur dual-encoder CLIP: encoder gambar dan encoder teks memetakan ke ruang vektor bersama.">
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<rect x="20" y="30" width="110" height="46" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="75" y="50" fill="var(--text)">gambar</text><text x="75" y="67" fill="var(--text-muted)" font-size="10">anjing di pantai</text>
<rect x="20" y="100" width="110" height="46" rx="8" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="75" y="120" fill="var(--text)">caption teks</text><text x="75" y="137" fill="var(--text-muted)" font-size="10">&quot;a dog on the beach&quot;</text>
<rect x="160" y="30" width="130" height="46" rx="8" fill="var(--c1)" opacity="0.25"/><text x="225" y="50" fill="var(--text)">image encoder</text><text x="225" y="67" fill="var(--text-muted)" font-size="10">ViT / ResNet</text>
<rect x="160" y="100" width="130" height="46" rx="8" fill="var(--c2)" opacity="0.25"/><text x="225" y="120" fill="var(--text)">text encoder</text><text x="225" y="137" fill="var(--text-muted)" font-size="10">Transformer</text>
<line x1="130" y1="53" x2="160" y2="53" stroke="var(--text-muted)" stroke-width="2"/><line x1="130" y1="123" x2="160" y2="123" stroke="var(--text-muted)" stroke-width="2"/>
<g><rect x="320" y="30" width="60" height="46" rx="4" fill="var(--c1)"/><text x="350" y="57" fill="var(--text)" font-size="11">v</text></g>
<g><rect x="320" y="100" width="60" height="46" rx="4" fill="var(--c2)"/><text x="350" y="127" fill="var(--text)" font-size="11">t</text></g>
<line x1="290" y1="53" x2="320" y2="53" stroke="var(--text-muted)" stroke-width="2"/><line x1="290" y1="123" x2="320" y2="123" stroke="var(--text-muted)" stroke-width="2"/>
<rect x="405" y="40" width="55" height="96" rx="8" fill="none" stroke="var(--text)" stroke-width="2" stroke-dasharray="6 4"/><text x="432" y="80" fill="var(--text)" font-size="11">ruang</text><text x="432" y="96" fill="var(--text)" font-size="11">bersama</text><text x="432" y="112" fill="var(--text-muted)" font-size="10">512-dim</text>
<line x1="380" y1="53" x2="405" y2="60" stroke="var(--text-muted)" stroke-width="1.5"/><line x1="380" y1="123" x2="405" y2="116" stroke="var(--text-muted)" stroke-width="1.5"/>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<line x1="350" y1="80" x2="350" y2="96" stroke="var(--c4)" stroke-width="2"/><polygon points="350,102 345,94 355,94" fill="var(--c4)"/><polygon points="350,74 345,82 355,82" fill="var(--c4)"/>
<text x="350" y="200" fill="var(--text)">cos(v, t) &#8776; 1 &#8594; pasangan cocok</text>
<text x="350" y="220" fill="var(--text-muted)">tidak ada kepala klasifikasi: hanya dua encoder + dot product</text>
<text x="350" y="245" fill="var(--text-muted)">400 juta pasangan gambar&#8211;teks dari internet melatih keduanya</text>
<text x="350" y="270" fill="var(--text-muted)">Radford et al., arXiv 2103.00020 (2021)</text>
</g>
</svg>`;

// Matriks kemiripan 4x4: diagonal = pasangan benar harus paling terang.
const FIG_MATRIX = `<svg viewBox="0 0 480 270" role="img" aria-label="Matriks kemiripan 4x4: diagonal pasangan benar paling mirip.">
<g font-size="11" font-family="var(--font-ui)">
<text x="60" y="30" fill="var(--text-muted)" text-anchor="middle">teks &#8594;</text>
<text x="20" y="120" fill="var(--text-muted)" text-anchor="middle" transform="rotate(-90 20 120)">gambar &#8594;</text>
<g text-anchor="middle">
<rect x="60" y="45" width="52" height="40" fill="var(--c1)"/><text x="86" y="70" fill="var(--text)">0.92</text>
<rect x="112" y="45" width="52" height="40" fill="var(--chart-grid)"/><text x="138" y="70" fill="var(--text-muted)">0.11</text>
<rect x="164" y="45" width="52" height="40" fill="var(--chart-grid)"/><text x="190" y="70" fill="var(--text-muted)">0.23</text>
<rect x="216" y="45" width="52" height="40" fill="var(--chart-grid)"/><text x="242" y="70" fill="var(--text-muted)">0.05</text>
<rect x="60" y="85" width="52" height="40" fill="var(--chart-grid)"/><text x="86" y="110" fill="var(--text-muted)">0.18</text>
<rect x="112" y="85" width="52" height="40" fill="var(--c1)"/><text x="138" y="110" fill="var(--text)">0.88</text>
<rect x="164" y="85" width="52" height="40" fill="var(--chart-grid)"/><text x="190" y="110" fill="var(--text-muted)">0.31</text>
<rect x="216" y="85" width="52" height="40" fill="var(--chart-grid)"/><text x="242" y="110" fill="var(--text-muted)">0.09</text>
<rect x="60" y="125" width="52" height="40" fill="var(--chart-grid)"/><text x="86" y="150" fill="var(--text-muted)">0.07</text>
<rect x="112" y="125" width="52" height="40" fill="var(--chart-grid)"/><text x="138" y="150" fill="var(--text-muted)">0.26</text>
<rect x="164" y="125" width="52" height="40" fill="var(--c1)"/><text x="190" y="150" fill="var(--text)">0.95</text>
<rect x="216" y="125" width="52" height="40" fill="var(--chart-grid)"/><text x="242" y="150" fill="var(--text-muted)">0.14</text>
<rect x="60" y="165" width="52" height="40" fill="var(--chart-grid)"/><text x="86" y="190" fill="var(--text-muted)">0.21</text>
<rect x="112" y="165" width="52" height="40" fill="var(--chart-grid)"/><text x="138" y="190" fill="var(--text-muted)">0.12</text>
<rect x="164" y="165" width="52" height="40" fill="var(--chart-grid)"/><text x="190" y="190" fill="var(--text-muted)">0.19</text>
<rect x="216" y="165" width="52" height="40" fill="var(--c1)"/><text x="242" y="190" fill="var(--text)">0.90</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<text x="300" y="70" fill="var(--text)">cara membaca:</text>
<text x="300" y="90" fill="var(--text-muted)">baris = 1 gambar, kolom = 1 caption;</text>
<text x="300" y="108" fill="var(--text-muted)">angka = cosine similarity v&#183;t.</text>
<text x="300" y="140" fill="var(--text)">interpretasi:</text>
<text x="300" y="160" fill="var(--text-muted)">diagonal terang = tiap gambar paling</text>
<text x="300" y="178" fill="var(--text-muted)">mirip captionnya sendiri &#8594; loss kecil.</text>
<text x="300" y="196" fill="var(--text-muted)">diagonal redup = pasangan salah</text>
<text x="300" y="214" fill="var(--text-muted)">menang &#8594; model tertukar.</text>
</g>
</g>
<text x="240" y="250" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">satu batch = satu matriks N&#215;N; targetnya selalu diagonal</text>
</svg>`;

export const dle16: V2Lesson = {
  slug: "dle16-multimodal-clip",
  track: "Deep Learning Engineer",
  module: "Representasi & Multimodal",
  title: "DLE16 — Multimodal: CLIP & Vision-Language",
  estMinutes: 56,
  steps: [
    {
      id: "cerita-modekita",
      eyebrow: "Langkah 1 · Cerita",
      title: "2 juta foto produk, 40 ribu kategori — tanpa satu label pun",
      prose: [
        "Startup fashion 'ModeKita' punya 2 juta foto produk dan katalog yang tumbuh 300 kategori baru per bulan: 'kemeja batik lengan pendek', 'tas anyaman Lombok', 'sneaker knit pastel'. Tim ML membangun classifier supervised — dan setiap bulan mengulang ritual yang sama: kumpulkan 500 foto berlabel per kategori baru, retrain, deploy. Biaya labeling Rp1,2 miliar per tahun, dan kategori yang belum dilabeli mustahil dikenali. Modelnya buta terhadap semua yang belum pernah ia lihat berlabel.",
        "Lalu seorang engineer mencoba sesuatu yang terdengar mustahil: ia TIDAK melatih classifier sama sekali. Ia mengambil model bernama CLIP — yang tidak pernah dilatih mengklasifikasi pakaian — lalu mengetik 40 ribu kalimat: 'a photo of a batik shirt', 'a photo of a woven bag', dan seterusnya. Untuk tiap foto, model memilih kalimat yang paling cocok. Akurasi kategori baru: 71%. Tanpa satu pun foto berlabel. Tanpa retrain. Ritual bulanan itu mati dalam semalam.",
        "Twist-nya: CLIP tidak 'belajar klasifikasi' — ia belajar bahwa gambar anjing dan caption 'a dog on the beach' adalah pasangan, dari 400 juta pasangan gambar-teks yang dikumpulkan dari internet. Klasifikasi hanyalah efek samping: ubah label menjadi kalimat, dan pencocokan gambar-teks otomatis menjadi zero-shot classifier. Inilah supervised learning tanpa label — supervision-nya adalah bahasa itu sendiri.",
        "🧭 Pembeda sudut (penting!): lesson ini membahas CLIP sebagai MODEL — cara ia dilatih (contrastive pretraining), arsitektur dual-encoder-nya, dan mekanisme zero-shot classification. Itu sudut yang berbeda dari lesson aie17 (tim lain) yang membahas visual RETRIEVAL sebagai sistem: memakai model jadi untuk mencari dokumen multimodal (ColPali, late interaction). Di sini kamu membedah mesinnya; di sana kamu memakai mesinnya untuk mencari.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan arsitektur dual-encoder CLIP dan mengapa ia tidak punya kepala klasifikasi; (2) menulis dan menghitung contrastive loss (InfoNCE) dengan temperature; (3) mengubah klasifikasi menjadi pencocokan teks untuk zero-shot; (4) melakukan prompt engineering visual ('a photo of a ...') dan tahu kapan ia membantu; (5) menyebutkan keterbatasan komposisionalitas CLIP dan kapan memilih retrieval ala aie17, linear probe, atau fine-tune penuh.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Dual-encoder & contrastive loss — Langkah 3 · Lab InfoNCE — Langkah 4 · Zero-shot & prompt engineering — Langkah 5 · Lab zero-shot — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "CLIP = dua encoder + dot product. Klasifikasi = efek samping pencocokan gambar-teks.",
    },
    {
      id: "konsep-dual",
      eyebrow: "Langkah 2 · Dual-encoder & contrastive",
      title: "Dua encoder, satu ruang, tanpa kepala klasifikasi",
      prose: [
        "Prasyarat ringkas (F2) — kamu tidak perlu membuka lesson lain: (1) CNN/Vision Transformer mengubah gambar menjadi vektor fitur; Transformer mengubah teks menjadi vektor fitur — keduanya 'mesin pemadat makna'. (2) Contrastive learning (seperti SimCLR): tarik vektor pasangan yang cocok agar dekat, tolak yang tidak cocok agar jauh — tanpa label kelas, hanya informasi 'pasangan'. Itu saja fondasinya; sisanya lesson ini.",
        "Arsitektur CLIP brutal dalam kesederhanaannya: image encoder (ResNet atau Vision Transformer) memetakan gambar ke vektor v; text encoder (Transformer) memetakan caption ke vektor t; keduanya berdimensi sama (512) dan di-normalisasi L2. Tidak ada layer klasifikasi, tidak ada daftar kelas. Satu-satunya operasi yang menghubungkan gambar dan teks adalah cosine similarity: cos(v, t) = v·t. Model yang 'tahu 40 ribu kategori' sebenarnya hanya tahu cara menaruh gambar dan kalimat di ruang yang sama.",
        "Cara melatihnya: ambil batch N pasangan (gambar_i, teks_i) — di paper aslinya N = 32.768. Bangun matriks kemiripan N×N: sel (i, j) = cos(v_i, t_j) / τ, dengan τ (temperature) bilangan kecil yang dipelajari (≈ 0,07). Targetnya: tiap baris, kolom diagonal (pasangan benar) harus menang atas N−1 pasangan salah. Ini klasifikasi N-kelas di mana 'kelas' berubah tiap batch — labelnya gratis, datang dari struktur data itu sendiri.",
        "Loss-nya simetris: InfoNCE dihitung dua arah — gambar→teks (tiap gambar cari captionnya) dan teks→gambar (tiap caption cari gambarnya), lalu dirata-rata. Mengapa dua arah? Karena pencocokan satu arah bisa 'curang': semua gambar menunjuk caption yang sama dan tetap dapat skor bagus di satu arah. Simetri memaksa korespondensi satu-satu.",
        "Kepribadian CLIP: mak comblang 400 juta pasangan. Ia tidak menghafal 'ini kucing'; ia menghafal bahwa gambar berbulu ini 'berjodoh' dengan kalimat yang menyebut kucing. Temperature τ adalah 'standar kecocokan'-nya: τ kecil membuat distribusi softmax tajam — model dipaksa sangat yakin pada pasangan benar dan sangat menolak yang salah, mempercepat pemisahan tetapi rawan instabilitas bila terlalu kecil.",
      ],
      formula: String.raw`L_i = -\log \frac{\exp(s_{ii}/\tau)}{\sum_{j=1}^{N}\exp(s_{ij}/\tau)} \qquad s_{ij}=\frac{v_i \cdot t_j}{\lVert v_i\rVert\,\lVert t_j\rVert}`,
      formulaNote: "L_i = loss baris i; s_ij = cosine similarity gambar i vs teks j (vektor sudah L2-normalized, jadi dot product = cosinus); τ = temperature (≈0,07); N = ukuran batch. Contoh angka: N=8, s_ii=0,9, tujuh s_ij lain ≈0,2 → pembilang exp(0,9/0,07)≈3,8×10^5, penyebut didominasi pembilang → loss ≈ 0,16 (kecil = pasangan benar menang telak). Bila semua s sama (model acak), loss = ln(N) = 2,08 — inilah baseline 'tidak belajar apa-apa' yang dipakai lab.",
      figure: {
        svg: FIG_DUAL,
        alt: "Dua encoder terpisah (gambar dan teks) memetakan ke satu ruang vektor 512-dimensi; kecocokan diukur dengan cosine similarity.",
        caption: "Tidak ada kepala klasifikasi — hanya dua encoder dan dot product.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "'CLIP dilatih mengklasifikasi 40 ribu kategori.' Salah total — CLIP tidak pernah melihat label kelas selama pretraining. Ia hanya belajar mencocokkan gambar dengan caption-nya. Kemampuan klasifikasi muncul belakangan, saat KITA mengubah label menjadi kalimat ('a photo of a ...') dan memintanya memilih kalimat paling cocok. Labelnya adalah penemuan kita, bukan pelatihannya.",
      },
      reference: "Dual-encoder + InfoNCE simetris, N=32.768, τ≈0,07, 400M pasangan (Radford et al., 2021).",
    },
    {
      id: "lab-infonce",
      eyebrow: "Langkah 3 · Lab InfoNCE",
      title: "Lab: contrastive loss dari nol (stdlib saja)",
      prose: [
        "SIMULASI SKALA — murni aritmetika Python (stdlib saja), BUKAN training CLIP 400M pasangan yang butuh ratusan GPU. Seed acak 7 membuat 8 'gambar' dan 8 'caption' sebagai vektor 16-dimensi, dinormalisasi L2. Caption ke-i = gambar ke-i + noise kecil (pasangan benar mirip), caption lain = acak. Tugasmu: implementasikan `info_nce()` yang menghitung loss simetris-satu-arah (gambar→teks) dan akurasi top-1 retrieval.",
        "Eksplorasi wajib: (1) naikkan noise 0,35 → 1,5 — pada titik apa loss mendekati ln(8)=2,08 (model 'buta')?; (2) ubah TAU 0,07 → 1,0 — mengapa loss MEMBESAR padahal data sama? (softmax tumpul: pasangan benar tidak lagi menang telak); (3) turunkan TAU ke 0,01 — loss mengecil, tetapi pikirkan: gradien exp(s/0,01) meledak untuk selisih kecil — inilah instabilitas temperature terlalu rendah.",
        "Cara membaca: 'InfoNCE loss: 0,164' berarti pasangan benar menang telak — bandingkan dengan baseline acak 2,079. Interpretasi: 'top-1 retrieval: 88%' = 7 dari 8 gambar menemukan captionnya sendiri; 1 yang gagal adalah pasangan dengan noise paling sial. Loss contrastive dan akurasi retrieval adalah dua wajah angka yang sama.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `info_nce()` → (loss, akurasi): softmax atas skor/TAU per baris" },
        { id: "t2", text: "`print` loss vs baseline ln(8) dan akurasi top-1 retrieval" },
      ],
      expected: "InfoNCE loss: 0.164 (acak murni = ln(8) = 2.079); top-1 retrieval: 88%",
      note: {
        title: "💡 Intuisi",
        body: "InfoNCE = 'ujian pilihan ganda' tiap baris: 1 jawaban benar, N−1 pengecoh. Loss kecil berarti model selalu menunjuk jawaban benar dengan yakin. Temperature adalah 'ketegasan pengawas': τ kecil = pengawas galak yang menghukum keraguan sedikit pun.",
      },
      hints: [
        "skor baris i: [sim(img[i], txt[j])/TAU for j in range(N)]",
        "logsumexp stabil: m = max(scores); m + log(sum(exp(s-m)))",
        "loss baris = -(scores[i] - logsum); akurasi: argmax(scores[j]) == i",
      ],
      code: {
        starter: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — bukan training CLIP asli)
import math, random
random.seed(7)
N = 8; D = 16; TAU = 0.07

def norm(v):
    n = math.sqrt(sum(x*x for x in v))
    return [x/n for x in v]

img = [norm([random.gauss(0,1) for _ in range(D)]) for _ in range(N)]
txt = [norm([img[i][d] + random.gauss(0,0.35) for d in range(D)]) for i in range(N)]

def sim(a, b):
    return sum(x*y for x, y in zip(a, b))

# TULIS KODEMU
def info_nce():
    # TODO t1: return (loss_rata2, akurasi_top1)
    return 0.0, 0.0

# UJI (jangan ubah)
l, a = info_nce()
print(f"InfoNCE loss: {l:.3f}  (acak murni = ln({N}) = {math.log(N):.3f})")
print(f"top-1 retrieval: {a*100:.0f}%")`,
        lockLines: 17,
        solution: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — bukan training CLIP asli)
import math, random
random.seed(7)
N = 8; D = 16; TAU = 0.07

def norm(v):
    n = math.sqrt(sum(x*x for x in v))
    return [x/n for x in v]

img = [norm([random.gauss(0,1) for _ in range(D)]) for _ in range(N)]
txt = [norm([img[i][d] + random.gauss(0,0.35) for d in range(D)]) for i in range(N)]

def sim(a, b):
    return sum(x*y for x, y in zip(a, b))

# TULIS KODEMU
def info_nce():
    loss = 0.0; correct = 0
    for i in range(N):
        scores = [sim(img[i], txt[j])/TAU for j in range(N)]
        m = max(scores)
        logsum = m + math.log(sum(math.exp(s-m) for s in scores))
        loss += -(scores[i] - logsum)
        if max(range(N), key=lambda j: scores[j]) == i:
            correct += 1
    return loss/N, correct/N

# UJI (jangan ubah)
l, a = info_nce()
print(f"InfoNCE loss: {l:.3f}  (acak murni = ln({N}) = {math.log(N):.3f})")
print(f"top-1 retrieval: {a*100:.0f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "InfoNCE loss: 0\\.164", label: "Loss = 0.164", msg: "Softmax atas skor/TAU per baris, ambil -log probabilitas diagonal." },
          { kind: "stdout_matches", task: "t2", pattern: "top-1 retrieval: 88%", label: "Top-1 = 88%", msg: "Akurasi = fraksi baris dengan argmax tepat di diagonal." },
          { kind: "stdout_matches", task: "t2", pattern: "ln\\(8\\) = 2\\.079", label: "Baseline acak 2.079", msg: "Model acak selalu dapat loss ln(N)." },
        ],
      },
      reference: "InfoNCE = cross-entropy atas matriks N×N dengan target diagonal; τ mengontrol ketajaman.",
    },
    {
      id: "konsep-zeroshot",
      eyebrow: "Langkah 4 · Zero-shot & prompt",
      title: "Zero-shot: klasifikasi tanpa melihat satu label pun",
      prose: [
        "Trik zero-shot CLIP hanya tiga baris logika: (1) ubah tiap label kelas menjadi kalimat bahasa alami — 'dog' menjadi 'a photo of a dog'; (2) encode semua kalimat menjadi vektor teks t_c; (3) untuk gambar baru, hitung softmax atas cos(v, t_c)/τ dan pilih kelas dengan probabilitas tertinggi. Tidak ada training, tidak ada gradien, tidak ada contoh. Model yang sama kemarin mencocokkan caption hari ini mengklasifikasi — hanya prompt-nya yang berubah.",
        "Prompt engineering visual itu nyata dan terukur: paper CLIP memakai template 'a photo of a {label}' dan melakukan ensemble atas 80 prompt ('a photo of a big {label}', 'a photo of a small {label}', ...) — rata-rata vektor teksnya — untuk hasil terbaik di ImageNet. Mengapa membantu? Karena caption internet jarang berbunyi 'dog' saja; mereka berbunyi 'a photo of my dog at the beach'. Template membuat distribusi prompt menyerupai distribusi caption saat training. Prompt engineering di sini bukan mistik — ia adalah domain adaptation murah.",
        "Temperature muncul lagi dengan peran baru: τ mengontrol ketajaman distribusi probabilitas kelas. τ = 1,0 memberi distribusi datar (model 'ragu-ragu', lihat lab: dog hanya 41,9%); τ = 0,07 menajamkan menjadi 95,4%. CLIP memakai τ yang dipelajari saat pretraining (≈0,07) — nilai yang sama yang memisahkan pasangan benar/salah kini memisahkan kelas.",
        "Batas kerasnya — komposisionalitas: CLIP berperilaku seperti bag-of-words yang canggih. Benchmark Winoground menunjukkan ia gagal membedakan 'a red cube on a blue sphere' vs 'a blue cube on a red sphere' — kata-katanya benar semua, relasinya tertukar, model tidak peduli. Ia juga lemah pada detail halus (menghitung objek, teks kecil di gambar) dan mewarisi bias caption internet. Jangan memakainya untuk tugas yang butuh pemahaman relasi spasial presisi — di sanalah model generatif vision-language atau retrieval terstruktur (aie17) lebih tepat.",
      ],
      formula: String.raw`P(y=c \mid x) = \frac{\exp(\cos(v, t_c)/\tau)}{\sum_{k}\exp(\cos(v, t_k)/\tau)}`,
      formulaNote: "P(y=c|x) = probabilitas kelas c untuk gambar x; v = vektor gambar; t_c = vektor teks prompt kelas c ('a photo of a {label}'); τ = temperature. Contoh angka (lab 2): cos dog=0,62 vs cat=0,31 — dengan τ=1,0 softmax memberi dog 41,9% (ragu); dengan τ=0,07 memberi 95,4% (yakin). Rumus yang sama dengan InfoNCE, hanya 'batch'-nya kini daftar kelas.",
      figure: {
        svg: FIG_MATRIX,
        alt: "Matriks kemiripan gambar-teks 4x4: diagonal pasangan benar harus paling terang.",
        caption: "Target training (diagonal terang) dan target zero-shot (kelas benar menang) adalah soal yang sama.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "'CLIP memahami kalimat seperti manusia.' Tidak — ia memahami DISTRIBUSI kata yang muncul bersama gambar. 'Red cube on blue sphere' vs 'blue cube on red sphere' mengandung kata identik dan sering lolos sebagai 'mirip' bagi CLIP. Ia pencocok pola statistik yang luar biasa, bukan pemaham komposisi. Uji komposisionalitas (Winoground) sebelum mempercayainya untuk relasi objek.",
      },
      reference: "Zero-shot = softmax atas prompt teks; 80-prompt ensemble; τ≈0,07; batas: komposisionalitas (Winoground).",
    },
    {
      id: "lab-zeroshot",
      eyebrow: "Langkah 5 · Lab zero-shot",
      title: "Lab: zero-shot classifier + efek temperature & prompt",
      prose: [
        "SIMULASI SKALA — stdlib saja, vektor 32-dimensi menggantikan encoder asli. Seed 21 membuat satu 'foto' (dekat ke anjing), tiga embedding kelas (cat/dog/airplane), dan dua varian prompt untuk 'dog': label polos vs template 'a photo of a dog' (disimulasikan sebagai embedding yang lebih dekat ke gambar — persis efek template di dunia nyata). Tugasmu: implementasikan `softmax(scores, tau)` lalu cetak probabilitas kelas.",
        "Eksplorasi wajib: (1) bandingkan τ=1,0 vs τ=0,07 — berapa poin persentase keyakinan yang 'dibeli' temperature?; (2) ganti noise template 0,35 → 0,9 (template buruk, sama jauhnya dengan label polos) — keunggulan prompt engineering lenyap, yang tersisa hanya temperature; (3) renungkan: tidak satu pun gradien dihitung di lab ini — 'training' zero-shot memang nol.",
        "Cara membaca: 'tau=1.0 -> dog=41.9%' berarti model BENAR tetapi RAGU — argmax tepat, margin tipis. Interpretasi: 'tau=0.07 -> dog=95.4%' BUKAN berarti model lebih pintar — informasinya sama (urutan kelas identik), hanya kalibrasi keyakinannya berubah. Jangan tertukar antara 'lebih yakin' dan 'lebih benar'.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `softmax(scores, tau)`: bagi skor dengan tau, stabilkan, normalisasi" },
        { id: "t2", text: "`print` probabilitas 3 kelas untuk τ=1,0 dan τ=0,07 + perbandingan 2 prompt" },
      ],
      expected: "τ=1,0: dog 41,9% (ragu); τ=0,07: dog 95,4% (yakin); template 'a photo of a dog' 96,0% vs label polos 31,4%",
      note: {
        title: "💡 Intuisi",
        body: "Zero-shot = 'tebak dari deskripsi'. Kamu tidak pernah melihat foto hewan ini, tetapi diberi tiga deskripsi kalimat — kamu pilih deskripsi yang paling cocok. CLIP melakukan hal yang sama dalam 512 dimensi. Prompt engineering = menulis deskripsi yang lebih baik, bukan melatih ulang otakmu.",
      },
      hints: [
        "s = [x/tau for x in scores]; m = max(s)",
        "e = [math.exp(x-m) for x in s]; return [x/sum(e) for x in e]",
        "cos(a,b) = dot product (vektor sudah dinormalisasi)",
      ],
      code: {
        starter: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — vektor 32-d menggantikan encoder asli)
import math, random
random.seed(21)
D = 32

def norm(v):
    n = math.sqrt(sum(x*x for x in v))
    return [x/n for x in v]

def cos(a, b):
    return sum(x*y for x, y in zip(a, b))

def noisy(base, sigma):
    return norm([base[d] + random.gauss(0, sigma) for d in range(D)])

img = norm([random.gauss(0,1) for _ in range(D)])
t_dog   = noisy(img, 0.45)
t_cat   = norm([random.gauss(0,1) for _ in range(D)])
t_plane = norm([random.gauss(0,1) for _ in range(D)])
classes = ["cat", "dog", "airplane"]
embs = [t_cat, t_dog, t_plane]
sims = [cos(img, e) for e in embs]

t_plain = noisy(img, 0.90)   # 'dog' polos
t_templ = noisy(img, 0.35)   # 'a photo of a dog'

# TULIS KODEMU
def softmax(scores, tau):
    # TODO t1
    return [0.0]*len(scores)

# UJI (jangan ubah)
for tau in (1.0, 0.07):
    p = softmax(sims, tau)
    print(f"tau={tau:<4} -> " + "  ".join(f"{c}={x*100:5.1f}%" for c, x in zip(classes, p)))
p2 = softmax([cos(img, t_cat), cos(img, t_plain), cos(img, t_plane)], 0.07)
p3 = softmax([cos(img, t_cat), cos(img, t_templ), cos(img, t_plane)], 0.07)
print(f"label polos  'dog'             -> P(dog)={p2[1]*100:.1f}%")
print(f"template 'a photo of a dog'    -> P(dog)={p3[1]*100:.1f}%")`,
        lockLines: 25,
        solution: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — vektor 32-d menggantikan encoder asli)
import math, random
random.seed(21)
D = 32

def norm(v):
    n = math.sqrt(sum(x*x for x in v))
    return [x/n for x in v]

def cos(a, b):
    return sum(x*y for x, y in zip(a, b))

def noisy(base, sigma):
    return norm([base[d] + random.gauss(0, sigma) for d in range(D)])

img = norm([random.gauss(0,1) for _ in range(D)])
t_dog   = noisy(img, 0.45)
t_cat   = norm([random.gauss(0,1) for _ in range(D)])
t_plane = norm([random.gauss(0,1) for _ in range(D)])
classes = ["cat", "dog", "airplane"]
embs = [t_cat, t_dog, t_plane]
sims = [cos(img, e) for e in embs]

t_plain = noisy(img, 0.90)   # 'dog' polos
t_templ = noisy(img, 0.35)   # 'a photo of a dog'

# TULIS KODEMU
def softmax(scores, tau):
    s = [x/tau for x in scores]
    m = max(s)
    e = [math.exp(x-m) for x in s]
    z = sum(e)
    return [x/z for x in e]

# UJI (jangan ubah)
for tau in (1.0, 0.07):
    p = softmax(sims, tau)
    print(f"tau={tau:<4} -> " + "  ".join(f"{c}={x*100:5.1f}%" for c, x in zip(classes, p)))
p2 = softmax([cos(img, t_cat), cos(img, t_plain), cos(img, t_plane)], 0.07)
p3 = softmax([cos(img, t_cat), cos(img, t_templ), cos(img, t_plane)], 0.07)
print(f"label polos  'dog'             -> P(dog)={p2[1]*100:.1f}%")
print(f"template 'a photo of a dog'    -> P(dog)={p3[1]*100:.1f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "tau=0\\.07 -> .*dog=\\s*95\\.4%", label: "τ=0,07 → dog 95,4%", msg: "Bagi skor dengan tau SEBELUM softmax; stabilkan dengan max." },
          { kind: "stdout_matches", task: "t2", pattern: "tau=1\\.0\\s+-> .*dog=\\s*41\\.9%", label: "τ=1,0 → dog 41,9%", msg: "Temperature 1 memberi distribusi datar — benar tapi ragu." },
          { kind: "stdout_matches", task: "t2", pattern: "P\\(dog\\)=96\\.0%", label: "Template → 96,0%", msg: "Prompt deskriptif mendekatkan embedding teks ke gambar." },
        ],
      },
      reference: "Softmax atas cos/τ; temperature = kalibrasi keyakinan; template ≈ domain adaptation murah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: CLIP, linear probe, fine-tune, atau retrieval?",
      prose: [
        "Skenario 1 — kategori baru tiap minggu, nol contoh label (kasus ModeKita) → CLIP zero-shot + prompt engineering. Tanpa training, tanpa labeling; 70%+ akurasi 'gratis'. Batas: komposisionalitas dan detail halus.",
        "Skenario 2 — ada sedikit label (50–1000 per kelas), butuh akurasi maksimal → linear probe: bekukan encoder CLIP, latih satu layer linear di atasnya. Murah (menit di 1 GPU), sering mengalahkan fine-tune penuh pada data sedikit karena tidak merusak representasi pretraining.",
        "Skenario 3 — domain jauh dari internet (citra medis, satelit SAR) → fine-tune penuh atau latih contrastive sendiri. Ruang bersama CLIP dibentuk caption internet; untuk domain eksotis, 'jodoh' versinya tidak relevan — bangun ruang sendiri.",
        "Skenario 4 — butuh mencari DOKUMEN/gambar dari query bebas, bukan mengklasifikasi → retrieval ala aie17 (ColPali, late interaction). CLIP memberi skor satu vektor per gambar (kasar, cepat); late interaction membandingkan patch-token secara detail (akurat, mahal). Klasifikasi vs pencarian = dua pekerjaan berbeda.",
        "Skenario 5 — butuh relasi spasial presisi ('kotak merah DI ATAS bola biru') → JANGAN CLIP. Bag-of-words-nya gagal di Winoground; pakai model vision-language generatif atau pipeline deteksi + reasoning eksplisit.",
        "Aturan praktis 10 detik: (1) nol label? zero-shot CLIP + 'a photo of a ...'; (2) sedikit label? linear probe dulu; (3) domain aneh? fine-tune; (4) mencari bukan mengklasifikasi? retrieval terstruktur; (5) relasi presisi? bukan CLIP.",
      ],
      tasks: [],
    },
    {
      id: "minicase-moderasi",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: moderasi marketplace tanpa tim labeling",
      prose: [
        "ModeKita fase dua: 50 ribu foto diunggah penjual per hari; 0,3% melanggar (produk palsu, konten dewasa). Merekrut tim labeling untuk 150 kategori pelanggaran = Rp400 juta/tahun. Solusi: CLIP zero-shot dengan prompt deskriptif — 'a photo of a counterfeit luxury bag', 'a photo of an adult content product' — plus prompt negatif 'a photo of a normal product listing'. Tanpa training, pelanggaran terdeteksi 68% (recall) di minggu pertama.",
        "Lalu kegagalan komposisionalitas muncul: prompt 'a photo of a box containing shoes' ikut menangkap 'a photo of shoes next to a box' — relasi 'di dalam' vs 'di sebelah' tidak dibedakan model. Tim menambahkan aturan pasca-proses: skor CLIP hanya sebagai filter tahap satu (top 5% mencurigakan), 200 foto/hari teratas diverifikasi manusia. Recall sistem gabungan naik ke 91%, biaya labeling nol — karena manusia hanya memverifikasi, bukan melabeli dari nol.",
        "Pembahasan: inilah pola deployment CLIP yang sehat — ia filter kasar yang murah, bukan hakim akhir. Angka kuncinya: zero-shot memberi 68% recall gratis; manusia di loop menutup celah komposisionalitas. Tim yang memakai CLIP sebagai 'AI yang paham gambar' akan kecewa; tim yang memakainya sebagai 'pencocok deskripsi super-cepat' akan hemat Rp400 juta.",
        "Cara membaca: 68% recall tahap satu = 32% pelanggaran lolos filter — angka ini BUKAN kegagalan bila tahap dua (manusia) hanya butuh memeriksa 5% volume. Interpretasi: metrik CLIP harus dibaca sebagai 'penghemat kerja manusia', bukan 'pengganti manusia'.",
        "Angka kunci yang dibawa pulang: InfoNCE = cross-entropy atas diagonal matriks N×N; τ≈0,07 menajamkan keyakinan; template prompt ≈ domain adaptation gratis; batas komposisionalitas = Winoground.",
      ],
      tasks: [],
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
        "CLIP = dual-encoder (gambar + teks) ke satu ruang vektor; kecocokan = cosine similarity, tanpa kepala klasifikasi.",
        "Pretraining contrastive: 400M pasangan gambar-teks, InfoNCE simetris atas matriks N×N (N=32.768), target = diagonal, τ≈0,07.",
        "Zero-shot = klasifikasi sebagai pencocokan teks: softmax atas cos(v, t_c)/τ untuk prompt 'a photo of a {label}'.",
        "Prompt engineering visual (template + ensemble) ≈ domain adaptation murah; temperature mengontrol kalibrasi keyakinan, bukan kepintaran.",
        "Batas keras: komposisionalitas bag-of-words (Winoground) — untuk relasi presisi atau retrieval dokumen, pilih pendekatan lain (aie17, model generatif).",
        "Peta: nol label → zero-shot; sedikit label → linear probe; domain eksotis → fine-tune; mencari dokumen → retrieval terstruktur.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Mengapa CLIP bisa mengklasifikasi 40 ribu kategori tanpa pernah dilatih klasifikasi?",
          options: [
            { text: "Label diubah menjadi kalimat; klasifikasi = memilih kalimat paling mirip gambar", why: "Tepat: zero-shot adalah pencocokan gambar-teks, bukan klasifikasi terlatih.", correct: true },
            { text: "CLIP punya 40 ribu kepala klasifikasi tersembunyi", why: "Salah — CLIP tidak punya kepala klasifikasi sama sekali, hanya dua encoder.", correct: false },
            { text: "400M pasangan gambar-teks semuanya berlabel kategori", why: "Salah — itu caption bebas dari internet, bukan label kelas.", correct: false },
            { text: "Temperature τ otomatis membuat kategori baru", why: "τ hanya menajamkan distribusi, tidak menciptakan pengetahuan kategori.", correct: false },
          ],
        },
        {
          q: "Dalam InfoNCE, apa peran temperature τ yang kecil (≈0,07)?",
          options: [
            { text: "Menajamkan softmax sehingga pasangan benar menang telak atas pengecoh", why: "Tepat: τ kecil memperkuat perbedaan skor, mempercepat pemisahan.", correct: true },
            { text: "Mengurangi ukuran batch yang dibutuhkan", why: "Salah — N=32.768 tetap; τ tidak mengubah kebutuhan batch.", correct: false },
            { text: "Membuat training lebih stabil", why: "Terbalik — τ terlalu kecil justru membuat gradien exp(s/τ) meledak.", correct: false },
            { text: "Menggantikan kebutuhan loss simetris", why: "Salah — simetri (dua arah) soal mencegah kecurangan, bukan ketajaman.", correct: false },
          ],
        },
        {
          q: "Mengapa loss InfoNCE dihitung simetris (gambar→teks DAN teks→gambar)?",
          options: [
            { text: "Mencegah kecurangan: semua gambar menunjuk satu caption yang sama", why: "Tepat: satu arah bisa curang; simetri memaksa korespondensi satu-satu.", correct: true },
            { text: "Agar batch bisa dua kali lebih besar", why: "Salah — ukuran batch tidak berubah, hanya loss dihitung dua arah.", correct: false },
            { text: "Karena encoder gambar dan teks berbagi bobot", why: "Salah — dual-encoder justru TIDAK berbagi bobot.", correct: false },
            { text: "Untuk menggandakan kecepatan training", why: "Salah — dua arah = komputasi tambahan, bukan penghematan.", correct: false },
          ],
        },
        {
          q: "Kapan kamu TIDAK boleh memakai CLIP?",
          options: [
            { text: "Tugas butuh relasi spasial presisi ('kotak merah di atas bola biru')", why: "Tepat: CLIP bag-of-words — gagal di Winoground untuk komposisionalitas.", correct: true },
            { text: "Kategori baru muncul tiap minggu tanpa label", why: "Itu kasus TERBAIK CLIP — zero-shot tanpa retrain.", correct: false },
            { text: "Hanya ada 200 contoh label per kelas", why: "Linear probe di atas CLIP justru ideal untuk data sedikit.", correct: false },
            { text: "Butuh filter kasar murah sebelum verifikasi manusia", why: "Itu pola deployment sehat CLIP — filter tahap satu.", correct: false },
          ],
        },
        {
          q: "Apa beda sudut lesson ini dengan lesson aie17 (tim lain)?",
          options: [
            { text: "Di sini CLIP sebagai MODEL (pretraining, arsitektur, zero-shot); aie17 memakai model jadi untuk RETRIEVAL dokumen", why: "Tepat: bedah mesin vs memakai mesin untuk mencari.", correct: true },
            { text: "Tidak ada beda — keduanya tentang ColPali", why: "Salah — ColPali/late interaction adalah materi aie17, bukan lesson ini.", correct: false },
            { text: "Lesson ini tentang retrieval, aie17 tentang training", why: "Terbalik persis.", correct: false },
            { text: "Keduanya membahas prompt engineering visual", why: "Prompt engineering visual adalah materi lesson ini; aie17 fokus arsitektur retrieval.", correct: false },
          ],
        },
      ],
    },
  ],
};
