import type { V2Lesson } from "../lib/types";

// Heatmap Grad-CAM: sorotan terpanas jatuh di watermark (pojok), bukan di paru-paru.
const FIG_HEAT = `<svg viewBox="0 0 480 310" role="img" aria-label="Grad-CAM menyorot watermark di pojok gambar, bukan area paru-paru.">
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<text x="100" y="24" fill="var(--text)">input: rontgen dada</text>
<rect x="30" y="34" width="140" height="140" rx="8" fill="var(--chart-grid)" opacity="0.35"/>
<ellipse cx="75" cy="110" rx="26" ry="48" fill="var(--chart-text)" opacity="0.25"/>
<ellipse cx="125" cy="110" rx="26" ry="48" fill="var(--chart-text)" opacity="0.25"/>
<rect x="140" y="42" width="22" height="12" fill="var(--text)" opacity="0.9"/>
<text x="151" y="52" font-size="8" fill="var(--chart-grid)">RS</text>
<text x="300" y="24" fill="var(--text)">heatmap Grad-CAM</text>
<rect x="230" y="34" width="140" height="140" rx="8" fill="var(--chart-grid)" opacity="0.35"/>
<ellipse cx="275" cy="110" rx="26" ry="48" fill="var(--chart-text)" opacity="0.25"/>
<ellipse cx="325" cy="110" rx="26" ry="48" fill="var(--chart-text)" opacity="0.25"/>
<circle cx="300" cy="110" r="30" fill="var(--c1)" opacity="0.18"/>
<circle cx="300" cy="110" r="18" fill="var(--c1)" opacity="0.30"/>
<circle cx="351" cy="48" r="26" fill="var(--c4)" opacity="0.35"/>
<circle cx="351" cy="48" r="16" fill="var(--c4)" opacity="0.55"/>
<circle cx="351" cy="48" r="7" fill="var(--c4)" opacity="0.9"/>
<text x="100" y="196" fill="var(--text-muted)" font-size="11">watermark &#171;RS&#187; di pojok</text>
<text x="300" y="196" fill="var(--text-muted)" font-size="11">sorotan terpanas = watermark</text>
<line x1="170" y1="104" x2="228" y2="104" stroke="var(--text-muted)" stroke-width="2"/>
<polygon points="228,104 220,99 220,109" fill="var(--text-muted)"/>
</g>
<g font-size="11" font-family="var(--font-ui)">
<text x="30" y="226" fill="var(--text)">cara membaca:</text>
<text x="30" y="244" fill="var(--text-muted)">warna panas = piksel yang paling menaikkan skor kelas &#171;pneumonia&#187;;</text>
<text x="30" y="262" fill="var(--text-muted)">dingin = tidak berpengaruh. Heatmap di-upsample ke ukuran input.</text>
<text x="30" y="288" fill="var(--text)">interpretasi:</text>
<text x="30" y="306" fill="var(--text-muted)">model &#171;benar&#187; karena watermark berkorelasi dengan kelas &#8212; shortcut, bukan diagnosis.</text>
</g>
</svg>`;

export const dle17: V2Lesson = {
  slug: "dle17-gradcam",
  track: "Deep Learning Engineer",
  module: "Interpretabilitas & Debugging",
  title: "DLE17 — Interpretabilitas DL: Grad-CAM & Saliency",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-rs",
      eyebrow: "Langkah 1 · Cerita",
      title: "Akurasi 94% — dan heatmap yang membongkar semuanya",
      prose: [
        "RS 'SehatRaya' menguji model AI pendeteksi pneumonia dari rontgen dada: akurasi 94% di data uji internal, mengalahkan rata-rata radiolog junior. Direksi hampir menandatangani kontrak deployment Rp8 miliar. Sebagai formalitas terakhir, seorang dokter meminta satu hal sederhana: 'Tunjukkan saya BAGIAN MANA dari gambar yang membuat model yakin ini pneumonia.'",
        "Tim ML menjalankan Grad-CAM — teknik yang mewarnai area gambar paling berpengaruh pada keputusan. Hasilnya membuat ruangan hening: sorotan terpanas tidak jatuh di paru-paru. Ia jatuh di POJOK gambar — tepat di watermark kecil bertuliskan nama rumah sakit. Investigasi lanjutan mengungkap polanya: foto dari mesin rontgen portabel (yang dipakai untuk pasien paling sakit, paling sering pneumonia) selalu membawa watermark itu. Model tidak belajar mengenali pneumonia; ia belajar mengenali watermark.",
        "Twist-nya: tanpa heatmap, model ini akan lolos semua metrik — 94% akurasi, kurva ROC cantik, validasi silang hijau. Ia akan dipasang, dipercaya, dan GAGAL total di rumah sakit lain yang watermark-nya berbeda. Satu gambar heatmap menyelamatkan Rp8 miliar dan — lebih penting — pasien yang akan salah diagnosis.",
        "Inilah interpretabilitas vision: bukan hiasan presentasi, melainkan alat audit. Lesson ini fokus pada metode spesifik deep learning untuk vision — saliency maps, guided backpropagation, dan Grad-CAM (Selvaraju et al., ICCV 2017) — plus pertanyaan yang jarang ditanyakan: kapan heatmap justru MENIPU. (Metode klasik model-agnostic seperti SHAP/LIME dibahas di lesson mle19; di sini kita membedah keluarga gradien yang dirancang untuk CNN.)",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung saliency map dari gradien skor kelas terhadap piksel; (2) menjelaskan perbedaan guided backprop vs backprop biasa; (3) menurunkan bobot alpha Grad-CAM dan membangun heatmap dari peta fitur; (4) memilih antara saliency, Grad-CAM, dan Guided Grad-CAM sesuai kebutuhan; (5) mengenali kapan heatmap menipu: shortcut learning, bias konfirmasi, dan kegagalan uji kewarasan.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Saliency & guided backprop — Langkah 3 · Lab Grad-CAM — Langkah 4 · Grad-CAM detail & Guided Grad-CAM — Langkah 5 · Lab audit shortcut — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Heatmap = alat audit, bukan sertifikat kebenaran. Akurasi tinggi bisa dibangun di atas shortcut.",
    },
    {
      id: "konsep-saliency",
      eyebrow: "Langkah 2 · Saliency & guided backprop",
      title: "Saliency: tanya gradien, piksel mana yang penting",
      prose: [
        "Prasyarat ringkas (F2) — kamu tidak perlu membuka lesson lain: (1) CNN mengekstrak fitur bertingkat — layer awal menangkap tepi, layer akhir menangkap konsep ('paru-paru berkabut') — dan layer konvolusi TERAKHIR masih menyimpan peta spasial (tahu 'di mana'). (2) Backpropagation menghitung gradien skor terhadap apa pun, termasuk piksel input — gradien besar berarti 'ubah piksel ini sedikit, keputusan berubah banyak'. Itu saja fondasinya.",
        "Saliency map (Simonyan et al., 2014) adalah ide paling jujur di keluarga ini: untuk kelas c, hitung M = |∂y^c/∂x| — gradien skor kelas terhadap tiap piksel, diambil nilai absolutnya. Piksel dengan gradien besar adalah piksel yang paling memengaruhi keputusan. Tidak ada parameter baru, tidak ada training tambahan: satu forward, satu backward, selesai. Hasilnya tajam di level piksel tetapi noisy — seperti foto yang diambil saat gempa.",
        "Guided backpropagation (Springenberg et al., 2014) menjinakkan noise itu dengan satu perubahan kecil saat backward melewati ReLU: hanya gradien POSITIF yang diteruskan, gradien negatif di-nol-kan. Intuisinya: kita hanya peduli fitur yang MENDUKUNG kelas ('ada pola ini → makin yakin pneumonia'), bukan fitur yang menentangnya. Hasilnya jauh lebih bersih dan enak dilihat — pola tepi dan tekstur yang dikenali neuron tampak jelas.",
        "Tetapi 'enak dilihat' adalah pedang bermata dua. Uji kewarasan Adebayo et al. (2018) menunjukkan fakta pahit: bila bobot model diacak total (model menjadi sampah yang tidak tahu apa-apa), guided backprop dan Guided Grad-CAM masih menghasilkan gambar yang mirip edge detector! Metode yang tidak berubah saat modelnya dihancurkan tidak sedang menjelaskan MODEL — ia menjelaskan DATA. Inilah pembeda kritis antara heatmap yang faithful (setia pada model) dan yang sekadar plausible (terlihat meyakinkan).",
        "Kepribadian keluarga gradien: wartawan yang mewawancarai gradien. Saliency = wartawan mentah yang mencatat semua teriakan (noisy tapi jujur). Guided backprop = wartawan yang hanya mencatat pujian (bersih tapi bisa menyanjung). Grad-CAM — langkah berikutnya — = editor yang meminta ringkasan per bab (kasar tapi terstruktur).",
      ],
      formula: String.raw`M_{ij} = \left\lvert \frac{\partial y^c}{\partial x_{ij}} \right\rvert`,
      formulaNote: "M_ij = saliency di piksel (i,j); y^c = skor kelas c (sebelum softmax); x_ij = nilai piksel. Contoh angka: bila menaikkan kecerahan piksel sudut sebesar 0,01 menaikkan skor 'pneumonia' sebesar 0,05, maka M = 5,0 di piksel itu — sorotan panas. Nilai absolut dipakai karena kita peduli BESAR pengaruh, bukan arahnya.",
      figure: {
        svg: FIG_HEAT,
        alt: "Heatmap Grad-CAM: sorotan terpanas jatuh pada watermark di pojok gambar, bukan pada area paru-paru.",
        caption: "Heatmap yang jujur bisa mengungkap model yang tidak jujur.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "'Heatmap yang tajam dan indah = penjelasan yang benar.' Salah — uji Adebayo membuktikan guided backprop tetap terlihat bagus walau bobot model diacak total. Keindahan visual mengukur kualitas gambar, bukan kesetiaan pada model. Selalu tanyakan: apakah heatmap ini BERUBAH bila modelnya saya rusak? Bila tidak, ia dekorasi, bukan diagnosis.",
      },
      reference: "Saliency = |gradien|; guided backprop = nol-kan gradien negatif di ReLU; waspada uji kewarasan (Adebayo 2018).",
    },
    {
      id: "lab-gradcam",
      eyebrow: "Langkah 3 · Lab Grad-CAM",
      title: "Lab: bangun heatmap Grad-CAM dari nol (stdlib saja)",
      prose: [
        "SIMULASI SKALA — stdlib saja; seed 11 membuat 3 peta fitur 4×4 (mewakili layer conv terakhir) beserta 'gradien' skor kelas terhadap tiap peta. Tugasmu: implementasikan `gradcam(A, G)` persis rumus paper — bobot alpha_k = rata-rata global gradien tiap channel, heatmap = ReLU dari kombinasi linear berbobot, lalu normalisasi min-max ke 0..1 untuk visualisasi.",
        "Eksplorasi wajib: (1) hapus ReLU (pakai kombinasi mentah) — wilayah negatif ikut muncul; mengapa paper membuangnya? (kita hanya peduli pengaruh POSITIF terhadap kelas); (2) ganti alpha dengan bobot seragam (1/K) — heatmap berubah total; bobot gradien memang jantung metode ini; (3) perhatikan: channel dengan alpha negatif 'dihukum' ReLU — ia menentang kelas, jadi tidak disorot.",
        "Cara membaca: 'heatmap Grad-CAM (4x4)' — angka 1,00 = titik terpanas (paling menaikkan skor kelas), 0,00 = titik terdingin. Interpretasi: pola panas mengelompok di satu wilayah = model fokus spasial; panas menyebar acak = model tidak punya lokalisasi (atau gradienmu noise — bedakan keduanya dengan uji kewarasan di langkah 5).",
      ],
      tasks: [
        { id: "t1", text: "Tulis `gradcam(A, G)` → (alpha, heatmap): GAP gradien, ReLU kombinasi, normalisasi" },
        { id: "t2", text: "`print` bobot alpha tiap channel dan grid heatmap 4×4" },
      ],
      expected: "alpha: +0.132 +0.118 +0.156; heatmap 4×4 ternormalisasi (titik terpanas 1.00 di baris 0 kolom 1)",
      note: {
        title: "💡 Intuisi",
        body: "Alpha_k = 'nilai rapor' tiap channel: seberapa besar channel ini mendorong keputusan, dirata-rata ke seluruh ruang. Heatmap = rapor dikalikan peta — channel bernilai tinggi yang aktif di suatu wilayah membuat wilayah itu panas. Grad-CAM pada dasarnya bertanya: 'kombinasi fitur apa, di mana, yang membuatmu yakin?'",
      },
      hints: [
        "alpha[k] = sum(G[k]) / (H*W) — global average pooling atas gradien",
        "L[r][c] = max(0, sum(alpha[k]*A[k][r][c] for k))",
        "normalisasi: (v - min) / (max - min) ke 0..1",
      ],
      code: {
        starter: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — peta fitur 3x4x4 + gradien mainan)
import random
random.seed(11)
K, H, W = 3, 4, 4
A = [[[random.uniform(0,1) for _ in range(W)] for _ in range(H)] for _ in range(K)]
G = [[[random.gauss(0,0.3) for _ in range(W)] for _ in range(H)] for _ in range(K)]

# TULIS KODEMU
def gradcam(A, G):
    # TODO t1: return (alpha, heatmap_ternormalisasi)
    return [0.0]*len(A), [[0.0]*W for _ in range(H)]

# UJI (jangan ubah)
alpha, L = gradcam(A, G)
print("alpha (bobot tiap channel):", " ".join(f"{a:+.3f}" for a in alpha))
print("heatmap Grad-CAM (4x4, ternormalisasi 0..1):")
for row in L:
    print(" ".join(f"{v:.2f}" for v in row))`,
        lockLines: 6,
        solution: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — peta fitur 3x4x4 + gradien mainan)
import random
random.seed(11)
K, H, W = 3, 4, 4
A = [[[random.uniform(0,1) for _ in range(W)] for _ in range(H)] for _ in range(K)]
G = [[[random.gauss(0,0.3) for _ in range(W)] for _ in range(H)] for _ in range(K)]

# TULIS KODEMU
def gradcam(A, G):
    K = len(A); H = len(A[0]); W = len(A[0][0])
    alpha = [sum(sum(row) for row in G[k])/(H*W) for k in range(K)]
    L = [[max(0.0, sum(alpha[k]*A[k][r][c] for k in range(K))) for c in range(W)] for r in range(H)]
    flat = [v for row in L for v in row]
    lo, hi = min(flat), max(flat)
    Ln = [[(v-lo)/(hi-lo) if hi > lo else 0.0 for v in row] for row in L]
    return alpha, Ln

# UJI (jangan ubah)
alpha, L = gradcam(A, G)
print("alpha (bobot tiap channel):", " ".join(f"{a:+.3f}" for a in alpha))
print("heatmap Grad-CAM (4x4, ternormalisasi 0..1):")
for row in L:
    print(" ".join(f"{v:.2f}" for v in row))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "alpha \\(bobot tiap channel\\): \\+0\\.132 \\+0\\.118 \\+0\\.156", label: "Alpha = +0.132 +0.118 +0.156", msg: "Alpha = rata-rata global (GAP) gradien tiap channel." },
          { kind: "stdout_matches", task: "t2", pattern: "0\\.84 1\\.00 0\\.91 0\\.51", label: "Baris heatmap pertama benar", msg: "Heatmap = ReLU(kombinasi berbobot), dinormalisasi min-max." },
          { kind: "stdout_matches", task: "t2", pattern: "0\\.41 0\\.47 0\\.00 0\\.19", label: "Titik terdingin 0.00", msg: "ReLU membuang pengaruh negatif; normalisasi memetakan min ke 0." },
        ],
      },
      reference: "α = GAP(∂y/∂A); L = ReLU(Σ α·A); upsample ke ukuran input untuk overlay.",
    },
    {
      id: "konsep-gradcam-detail",
      eyebrow: "Langkah 4 · Grad-CAM detail",
      title: "Mengapa layer terakhir, mengapa ReLU, dan Guided Grad-CAM",
      prose: [
        "Mengapa Grad-CAM memakai layer konvolusi TERAKHIR? Karena trade-off terbaik antara semantik dan ruang: layer awal tahu 'di mana' tetapi tidak tahu 'apa' (tepi di mana-mana); layer fully-connected tahu 'apa' tetapi kehilangan 'di mana' (vektor tanpa peta). Layer conv terakhir adalah satu-satunya tempat yang menyimpan keduanya — peta fitur 7×7 dari ResNet masih bisa di-upsample dan di-overlay ke gambar asli dengan makna yang utuh.",
        "Mengapa bobotnya = rata-rata global gradien (GAP)? Gradien ∂y^c/∂A^k_ij mengukur 'seberapa penting aktivasi ini'. Merata-ratakannya ke seluruh ruang (i, j) memberi satu angka per channel: pentingnya channel k SECARA KESELURUHAN untuk kelas c. Ini aproksimasi linear — 'andaikan skor adalah kombinasi linear dari channel' — yang kasar tetapi bekerja sorprendentemente baik dalam praktik (paper asli memvalidasi di ImageNet localization).",
        "Mengapa ReLU di akhir? Karena kita hanya tertarik pada fitur yang MENDUKUNG kelas c. Kombinasi linear bisa negatif di wilayah yang 'menentang' keputusan — menampilkannya sebagai 'sorotan dingin' justru mengaburkan pesan. ReLU memotongnya: heatmap Grad-CAM menjawab 'di mana bukti YANG MENDUKUNG', bukan 'di mana bukti yang menentang'. Untuk bukti menentang, hitung Grad-CAM kelas lain dan bandingkan — teknik 'contrastive explanation' yang ampuh untuk debugging.",
        "Guided Grad-CAM = Grad-CAM (kasar, class-discriminative) × guided backprop (tajam, detail piksel), dikalikan per-elemen setelah upsampling. Hasilnya heatmap setajam saliency tetapi tetap spesifik-kelas: kamu bisa melihat TEKSTUR paru-paru yang bermasalah, bukan sekadar 'area kanan bawah'. Harganya: ia mewarisi kerentanan guided backprop terhadap uji kewarasan — pakai untuk presentasi dan inspeksi visual, bukan sebagai bukti formal.",
        "Kapan heatmap menipu — tiga pola yang wajib dihafal: (1) Shortcut learning (cerita pembuka): heatmap jujur menunjukkan model curang — ini heatmap sebagai PAHLAWAN. (2) Bias konfirmasi: heatmap menunjuk paru-paru dan dokter mengangguk puas — padahal model bisa saja memakai artefak lain di area yang sama; heatmap menunjukkan KORELASI spasial, bukan KAUSALITAS. (3) Kegagalan uji kewarasan: heatmap tidak berubah saat bobot diacak — ia menjelaskan data, bukan model. Tiga pola ini adalah alasan lesson ini ada: tekniknya mudah, pembacaannya yang sulit.",
      ],
      formula: String.raw`\alpha_k^c = \frac{1}{Z}\sum_{i}\sum_{j}\frac{\partial y^c}{\partial A_{ij}^k} \qquad L^c = \mathrm{ReLU}\!\left(\sum_k \alpha_k^c A^k\right)`,
      formulaNote: "α_k^c = bobot channel k untuk kelas c (rata-rata gradien atas Z = H×W piksel); A^k = peta fitur channel k di layer conv terakhir; L^c = heatmap kasar (H×W) yang lalu di-upsample. Contoh angka (lab): α = +0,132/+0,118/+0,156 — channel 2 paling berpengaruh; titik (0,1) terpanas karena kombinasi berbobotnya tertinggi setelah ReLU.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "'Heatmap menunjukkan SEBAB keputusan model.' Tidak — heatmap menunjukkan LOKASI fitur yang berkorelasi dengan keputusan. Sebab-akibat butuh intervensi: hapus/tutupi wilayah panas, lihat apakah prediksi berubah (inilah prinsip occlusion test). Heatmap tanpa uji intervensi adalah hipotesis, bukan vonis.",
      },
      reference: "Layer conv terakhir = semantik + ruang; GAP gradien = bobot channel; ReLU = hanya pendukung; Guided Grad-CAM = upsample × guided backprop.",
    },
    {
      id: "lab-shortcut",
      eyebrow: "Langkah 5 · Lab audit shortcut",
      title: "Lab: audit model yang 'benar untuk alasan yang salah'",
      prose: [
        "SIMULASI SKALA — stdlib saja; replika mini dari cerita pembuka. Dua channel 5×5: channel 0 = watermark di pojok kanan atas, channel 1 = lesi sungguhan di tengah. 'Model' punya bobot w = [2,5, 0,4] — SANGAT mengandalkan watermark (shortcut). Tugasmu: (1) bangun heatmap = ReLU(w0·A0 + w1·A1) dan temukan sorotan terpanas; (2) hitung skor dengan dan tanpa watermark, ambang 0,5.",
        "Eksplorasi wajib: (1) ubah w menjadi [0,4, 2,5] (model sehat yang fokus ke lesi) — ke mana pindah sorotan terpanas? ke tengah; (2) uji intervensi: nol-kan LESI (bukan watermark) pada model shortcut — skor tetap POSITIF, membuktikan lesi tidak dipakai sama sekali; (3) renungkan: akurasi model shortcut di data training bisa 100% — metrik buta terhadap 'alasan'.",
        "Cara membaca: 'sorotan terpanas: baris=1 kolom=3' = pojok kanan atas, lokasi watermark — BUKAN tengah (1..3) tempat lesi. Interpretasi: 'skor TANPA watermark: 0,170 → negatif' = diagnosis BERBALIK hanya karena watermark dihapus; paru-paru yang sama, watermark berbeda, vonis berbeda. Inilah definisi operasional shortcut learning — dan alasan heatmap adalah alat audit, bukan hiasan.",
      ],
      tasks: [
        { id: "t1", text: "Bangun heatmap ReLU(w·A) dan `print` lokasi sorotan terpanas (baris, kolom)" },
        { id: "t2", text: "`print` skor + label POSITIF/negatif dengan dan tanpa watermark (ambang 0,5)" },
      ],
      expected: "Sorotan terpanas di (1, 3) = watermark; skor 0,780 POSITIF → 0,170 negatif setelah watermark dihapus",
      note: {
        title: "💡 Intuisi",
        body: "Audit shortcut = 'tes buta watermark': bila diagnosismu berubah saat logo rumah sakit dihapus, kamu tidak mendiagnosis pasien — kamu membaca logo. Heatmap hanyalah cara cepat menemukan KANDIDAT shortcut; vonisnya selalu lewat uji intervensi seperti lab ini.",
      },
      hints: [
        "heatmap[r][c] = max(0, w[0]*A0[r][c] + w[1]*A1[r][c])",
        "sorotan = max atas semua (nilai, r, c)",
        "skor = w[0]*mean(A0) + w[1]*mean(A1); label = 'POSITIF' bila > 0.5",
      ],
      code: {
        starter: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — replika mini kasus watermark)
import random
random.seed(33)
H = W = 5
A0 = [[1.0 if (r < 2 and c >= 3) else 0.1 for c in range(W)] for r in range(H)]  # watermark
A1 = [[1.0 if (1 <= r <= 3 and 1 <= c <= 3) else 0.1 for c in range(W)] for r in range(H)]  # lesi
w = [2.5, 0.4]   # model shortcut: sangat mengandalkan watermark

def mean(M):
    return sum(sum(r) for r in M)/(H*W)

# TULIS KODEMU
# TODO t1: heatmap + lokasi sorotan terpanas
# TODO t2: skor dengan & tanpa watermark, label ambang 0.5

# UJI (jangan ubah)
print("audit: model benar untuk alasan yang SALAH (shortcut watermark)")`,
        lockLines: 10,
        solution: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — replika mini kasus watermark)
import random
random.seed(33)
H = W = 5
A0 = [[1.0 if (r < 2 and c >= 3) else 0.1 for c in range(W)] for r in range(H)]  # watermark
A1 = [[1.0 if (1 <= r <= 3 and 1 <= c <= 3) else 0.1 for c in range(W)] for r in range(H)]  # lesi
w = [2.5, 0.4]   # model shortcut: sangat mengandalkan watermark

def mean(M):
    return sum(sum(r) for r in M)/(H*W)

# TULIS KODEMU
L = [[max(0.0, w[0]*A0[r][c] + w[1]*A1[r][c]) for c in range(W)] for r in range(H)]
spot = max(((L[r][c], r, c) for r in range(H) for c in range(W)))
print(f"sorotan terpanas: baris={spot[1]} kolom={spot[2]} (nilai {spot[0]:.2f})")
s_full = w[0]*mean(A0) + w[1]*mean(A1)
A0x = [[0.0]*W for _ in range(H)]
s_nowm = w[0]*mean(A0x) + w[1]*mean(A1)
print(f"skor 'pneumonia' DENGAN watermark   : {s_full:.3f} -> {'POSITIF' if s_full > 0.5 else 'negatif'}")
print(f"skor 'pneumonia' TANPA watermark    : {s_nowm:.3f} -> {'POSITIF' if s_nowm > 0.5 else 'negatif'}")

# UJI (jangan ubah)
print("audit: model benar untuk alasan yang SALAH (shortcut watermark)")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "sorotan terpanas: baris=1 kolom=3", label: "Sorotan di (1, 3) = watermark", msg: "Argmax atas heatmap ReLU(w·A) jatuh di pojok watermark." },
          { kind: "stdout_matches", task: "t2", pattern: "DENGAN watermark\\s*: 0\\.780 -> POSITIF", label: "Dengan watermark: 0,780 POSITIF", msg: "Skor = w·mean tiap channel; ambang 0,5." },
          { kind: "stdout_matches", task: "t2", pattern: "TANPA watermark\\s*: 0\\.170 -> negatif", label: "Tanpa watermark: 0,170 negatif", msg: "Uji intervensi: hapus kandidat shortcut, vonis berbalik = shortcut terbukti." },
        ],
      },
      reference: "Heatmap = kandidat; uji intervensi (hapus wilayah panas) = vonis shortcut.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: metode interpretabilitas untuk tiap kebutuhan",
      prose: [
        "Skenario 1 — debugging cepat saat training ('kenapa loss stuck?') → saliency map vanilla. Satu backward, tanpa parameter — cukup untuk melihat apakah model melihat objek atau background. Noisy tidak masalah untuk debugging internal.",
        "Skenario 2 — presentasi ke dokter/regulator ('tunjukkan buktinya') → Grad-CAM. Kasar tetapi class-discriminative dan stabil; overlay-nya mudah dibaca non-teknisi. Tambahkan Guided Grad-CAM bila mereka meminta detail tekstur.",
        "Skenario 3 — audit shortcut sebelum deployment (kasus SehatRaya) → Grad-CAM + uji intervensi. Heatmap menemukan kandidat (lab 5); occlusion/masking membuktikan kausalitas. Jangan deploy model vision kritis tanpa pasangan ini.",
        "Skenario 4 — butuh atribusi fitur tabular/teks atau jaminan teori (Shapley values) → SHAP/LIME (mle19). Metode gradien di lesson ini spesifik untuk CNN/vision; untuk model-agnostic atau data tabular, keluarga klasik lebih tepat.",
        "Skenario 5 — heatmap terlihat 'terlalu bagus' → uji kewarasan Adebayo: acak bobot model, hitung ulang heatmap. Bila tidak berubah signifikan, metode itu menjelaskan data — ganti metode atau turunkan klaimmu.",
        "Aturan praktis 10 detik: (1) debug → saliency; (2) cerita ke manusia → Grad-CAM; (3) audit → Grad-CAM + intervensi; (4) bukan vision → SHAP/LIME; (5) curiga → uji kewarasan. Dan selalu: heatmap = hipotesis, intervensi = vonis.",
      ],
      tasks: [],
    },
    {
      id: "minicase-zech",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: dari 94% ke deployment yang aman",
      prose: [
        "Kembali ke RS SehatRaya. Setelah heatmap membongkar watermark, tim melakukan audit penuh: (1) Grad-CAM atas 500 sampel — 78% sorotan terpanas jatuh di pojok/watermark, bukan paru-paru; (2) uji intervensi: menutupi watermark menurunkan akurasi 94% → 81% — bukti kausal shortcut; (3) uji silang rumah sakit: model diuji di RS lain (watermark berbeda) — akurasi anjlok ke 63%, di bawah radiolog junior.",
        "Perbaikannya bukan 'buang heatmap', melainkan 'perbaiki data dan training': watermark di-crop dari semua gambar, augmentasi (rotasi, kontras) ditambah agar model tidak menemukan shortcut baru, dan arsitektur diganti dengan input beresolusi lebih tinggi di area paru-paru. Hasil akhir: akurasi 87% — LEBIH RENDAH dari 94% semula, tetapi stabil lintas rumah sakit (85–88%) dan heatmap kini konsisten menunjuk area paru-paru.",
        "Pembahasan: metrik 94% adalah kebohongan yang jujur — benar di data uji, salah di dunia. Pelajaran industrinya: untuk model vision kritis, 'akurasi + heatmap audit + uji intervensi + uji lintas-situs' adalah SATU paket deployment, bukan empat pekerjaan opsional. Tim yang melewatkan paket ini tidak menghemat waktu — mereka menunda kegagalan ke lokasi yang paling mahal: produksi.",
        "Cara membaca: '94% → 81% saat watermark ditutup' = 13 poin akurasi adalah 'pajak shortcut' — kontribusi watermark pada metrik. Interpretasi: '87% stabil lintas RS' LEBIH BAIK dari '94% di satu RS' — generalisasi mengalahkan angka puncak. Inilah cara membaca metrik seperti auditor, bukan seperti marketer.",
        "Angka kunci yang dibawa pulang: saliency = |∂y/∂x|; Grad-CAM = ReLU(Σ α·A) dengan α = GAP gradien; Guided Grad-CAM = Grad-CAM × guided backprop; heatmap = hipotesis, intervensi = vonis; uji kewarasan sebelum percaya.",
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
        "Saliency map = |∂y^c/∂x|: gradien skor kelas terhadap piksel; jujur, tajam, noisy.",
        "Guided backprop = nol-kan gradien negatif di ReLU: bersih dan indah, tetapi gagal uji kewarasan (tetap bagus saat bobot diacak).",
        "Grad-CAM: α_k^c = rata-rata global gradien per channel; heatmap = ReLU(Σ α·A) di layer conv terakhir, lalu upsample.",
        "Guided Grad-CAM = Grad-CAM × guided backprop: tajam + spesifik-kelas; untuk inspeksi, bukan bukti formal.",
        "Heatmap menunjukkan korelasi spasial, BUKAN kausalitas — vonis shortcut butuh uji intervensi (tutup/hapus wilayah panas).",
        "Peta: debug → saliency; cerita ke manusia → Grad-CAM; audit deployment → Grad-CAM + intervensi + uji lintas-situs; curiga → uji kewarasan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Apa yang dihitung saliency map M = |∂y^c/∂x|?",
          options: [
            { text: "Seberapa besar tiap piksel memengaruhi skor kelas c", why: "Tepat: gradien = sensitivitas keputusan terhadap piksel itu.", correct: true },
            { text: "Probabilitas tiap piksel termasuk kelas c", why: "Salah — ini bukan distribusi probabilitas, melainkan sensitivitas gradien.", correct: false },
            { text: "Bobot attention tiap layer", why: "Salah — tidak ada mekanisme attention di sini; ini gradien mentah.", correct: false },
            { text: "Rekonstruksi gambar input dari fitur", why: "Salah — itu deconvnet/generative; saliency hanya peta sensitivitas.", correct: false },
          ],
        },
        {
          q: "Apa temuan uji kewarasan Adebayo et al. (2018) tentang guided backprop?",
          options: [
            { text: "Heatmap tetap terlihat bagus walau bobot model diacak total", why: "Tepat: ia gagal uji — menjelaskan data (edge detector), bukan model.", correct: true },
            { text: "Guided backprop selalu lebih faithful dari Grad-CAM", why: "Terbalik — Grad-CAM lolos uji kewarasan lebih baik.", correct: false },
            { text: "Metode ini tidak bisa dijalankan di CNN modern", why: "Salah — ia jalan normal; masalahnya pada kesetiaan, bukan kompatibilitas.", correct: false },
            { text: "Heatmap menjadi kosong saat bobot diacak", why: "Salah — justru masalahnya ia TIDAK menjadi kosong.", correct: false },
          ],
        },
        {
          q: "Mengapa Grad-CAM memakai layer konvolusi TERAKHIR?",
          options: [
            { text: "Satu-satunya layer dengan semantik tinggi + peta spasial utuh", why: "Tepat: layer awal tak punya semantik, FC tak punya ruang.", correct: true },
            { text: "Karena gradien hanya bisa dihitung di layer terakhir", why: "Salah — gradien bisa dihitung terhadap layer mana pun.", correct: false },
            { text: "Karena layer terakhir punya resolusi tertinggi", why: "Terbalik — layer terakhir resolusinya TERKECIL (mis. 7×7).", correct: false },
            { text: "Agar komputasi paling cepat", why: "Salah — kecepatan bukan alasan; ini soal trade-off semantik-ruang.", correct: false },
          ],
        },
        {
          q: "Heatmap menunjuk watermark. Langkah apa yang MEMBUKTIKAN shortcut (bukan sekadar hipotesis)?",
          options: [
            { text: "Uji intervensi: tutupi watermark, lihat apakah prediksi berubah", why: "Tepat: kausalitas butuh intervensi — heatmap saja hanya korelasi.", correct: true },
            { text: "Menjalankan Grad-CAM sekali lagi untuk konfirmasi", why: "Salah — mengulang metode yang sama tidak menambah bukti kausal.", correct: false },
            { text: "Memakai guided backprop yang lebih tajam", why: "Salah — ketajaman tidak mengubah status hipotesis vs vonis.", correct: false },
            { text: "Menaikkan resolusi heatmap", why: "Salah — resolusi tidak menjawab pertanyaan kausalitas.", correct: false },
          ],
        },
        {
          q: "Kapan memilih SHAP/LIME (mle19) dibanding Grad-CAM?",
          options: [
            { text: "Data tabular/teks atau butuh atribusi model-agnostic berjaminan teori", why: "Tepat: Grad-CAM spesifik CNN/vision; SHAP/LIME untuk kasus umum.", correct: true },
            { text: "Selalu — Grad-CAM sudah usang", why: "Salah — Grad-CAM tetap standar audit vision (ICCV 2017, teruji luas).", correct: false },
            { text: "Saat butuh heatmap tercepat", why: "Salah — saliency/Grad-CAM satu backward; SHAP justru mahal.", correct: false },
            { text: "Saat modelnya adalah CNN untuk gambar", why: "Terbalik — itu justru kasus terbaik Grad-CAM.", correct: false },
          ],
        },
      ],
    },
  ],
};
