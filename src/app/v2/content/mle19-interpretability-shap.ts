import type { V2Lesson } from "../lib/types";

// Permutation importance: f0=0.276, f1=0.104, f2=0.0, f3=-0.002.
const FIG_IMP = `<svg viewBox="0 0 480 250" role="img" aria-label="Permutation importance empat fitur.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="120" y1="205" x2="460" y2="205"/><line x1="120" y1="155" x2="460" y2="155"/><line x1="120" y1="105" x2="460" y2="105"/><line x1="120" y1="55" x2="460" y2="55"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="114" y="209">0</text><text x="114" y="159">0,1</text><text x="114" y="109">0,2</text><text x="114" y="59">0,3</text></g>
<g font-size="12" font-family="var(--font-ui)">
<rect x="180" y="45" width="220" height="28" fill="var(--c1)"/><text x="170" y="64" fill="var(--chart-text)" text-anchor="end">f0 (penting)</text><text x="405" y="64" fill="var(--text)">0,276</text>
<rect x="180" y="90" width="83" height="28" fill="var(--c2)"/><text x="170" y="109" fill="var(--chart-text)" text-anchor="end">f1 (sedang)</text><text x="268" y="109" fill="var(--text)">0,104</text>
<rect x="180" y="135" width="4" height="28" fill="var(--c4)"/><text x="170" y="154" fill="var(--chart-text)" text-anchor="end">f2 (noise)</text><text x="189" y="154" fill="var(--text)">0,000</text>
<rect x="180" y="180" width="4" height="28" fill="var(--c4)" opacity="0.5"/><text x="170" y="199" fill="var(--chart-text)" text-anchor="end">f3 (noise)</text><text x="189" y="199" fill="var(--text)">-0,002</text>
</g>
<text x="290" y="238" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">acak fitur → turun akurasi = pentingnya fitur itu</text>
</svg>`;

export const mle19: V2Lesson = {
  slug: "mle19-interpretability-shap",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE19 — Interpretability: SHAP & Kapan Model Harus Dijelaskan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-tolak",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kredit ditolak, alasannya 'komputer bilang begitu'",
      prose: [
        "Nasabah bank ditolak kreditnya. Ia bertanya 'mengapa?' — CS menjawab 'sistem yang memutuskan'. Nasabah mengadu ke OJK. OJK bertanya ke bank: 'faktor apa yang paling menentukan?' Bank tidak bisa menjawab — modelnya XGBoost 500 tree tanpa interpretasi. Denda + kewajiban: setiap penolakan HARUS bisa dijelaskan.",
        "Tim menambahkan SHAP: tiap keputusan diurai menjadi kontribusi per fitur ('telat bayar 3x: −0,25; gaji: +0,10; ...'). Nasabah mendapat surat: 'ditolak terutama karena riwayat telat bayar'. OJK puas. Bonus tak terduga: SHAP menemukan fitur 'kode pos' berkontribusi besar = proksi diskriminasi wilayah! Fitur dibuang, model lebih adil.",
        "Twist-nya: interpretability bukan 'fitur tambahan' — untuk risk/finance ia adalah SYARAT REGULASI dan alat debug keadilan. Preferred di JD, krusial untuk konteks Septian (risk/finance). Lesson ini = SHAP, permutation importance, dan kapan 'cukup' dijelaskan.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan ide SHAP (nilai Shapley) dengan analogi; (2) menghitung permutation importance; (3) membaca force plot / summary plot; (4) membedakan interpretasi global vs lokal; (5) memutuskan kapan model harus bisa dijelaskan.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Tiga lensa interpretasi — Langkah 3 · Lab: permutation importance — Langkah 4 · SHAP mendalam — Langkah 5 · TreeSHAP vs KernelSHAP — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "'Komputer bilang begitu' bukan jawaban — untuk regulator maupun nasabah.",
    },
    {
      id: "konsep-lensa",
      eyebrow: "Langkah 2 · Tiga lensa",
      title: "Global, lokal, dan contoh: tiga cara bertanya",
      prose: [
        "Lensa 1 — GLOBAL: 'fitur apa yang penting SECARA UMUM?' Permutation importance: acak satu fitur, ukur penurunan akurasi. Turun 0,276 = sangat penting (f0 di lab); turun 0,000 = noise (f2). Kelebihan: sederhana, model-agnostic. Kelemahan: tidak menjelaskan KEPUTUSAN INDIVIDU ('mengapa SAYA ditolak?').",
        "Lensa 2 — LOKAL: 'mengapa keputusan INI?' SHAP mengurai satu prediksi menjadi kontribusi per fitur yang JUMLAHNYA = prediksi. Contoh: base 0,50 + telat(−0,25) + gaji(+0,10) + usia(+0,02) = 0,37 → tolak. Setiap nasabah dapat 'kuitansi keputusan'. Inilah yang diminta OJK.",
        "Lensa 3 — CONTOH: 'siapa yang mirip?' Counterfactual — 'gajimu Rp8 juta; jika Rp10 juta (ceteris paribus), kamu DITERIMA.' Memberi JALAN KELUAR, bukan sekadar vonis. Untuk nasabah: lebih berguna dari 100 angka SHAP.",
        "Ide SHAP dalam 1 paragraf: nilai Shapley dari teori permainan — 'kontribusi adil' tiap pemain (fitur) = rata-rata kontribusi marginalnya di SEMUA koalisi. Adil = memenuhi 3 aksioma (efisiensi, simetri, dummy). SHAP = Shapley yang dihitung efisien untuk model ML. Mahal dihitung eksak (2^fitur!), tetapi TreeSHAP eksak untuk tree dalam waktu polinomial.",
        "Kepribadian ketiganya: global = rapor kelas (siapa pintar rata-rata); lokal = rapor individu (mengapa kamu tidak naik kelas); counterfactual = les privat (apa yang harus diperbaiki). Sekolah yang baik memberi ketiganya.",
        "Integrated Gradients — untuk deep learning. SHAP mahal untuk neural net; IG: integral gradien dari baseline (nol) ke input — memenuhi aksioma mirip Shapley, 50x lebih cepat. Untuk DLE: IG > SHAP. Pilih alat dari ARSITEKTUR.",
        "Attention bukan penjelasan. Bobot attention tinggi ≠ 'model memperhatikan karena penting' (studi 2019: attention bisa diacak tanpa mengubah prediksi!). Jangan presentasikan attention heatmap sebagai 'bukti'. Gunakan IG/SHAP untuk klaim pentingnya fitur.",
        "LIME — alternatif lokal. Gangguan di sekitar individu + model linear lokal = penjelasan 'di sekitar sini'. Lebih cepat dari SHAP untuk 1 prediksi, tetapi tidak konsisten (beda gangguan = beda penjelasan!). Untuk eksplorasi cepat: LIME. Untuk regulator: SHAP (aksioma = konsistensi). Pilih dari kebutuhan bukti.",
        "Anchors — aturan if-then. 'JIKA telat>2 DAN gaji<5jt MAKA tolak (presisi 95%)'. Manusia membaca aturan lebih mudah dari 40 angka SHAP. Untuk surat nasabah: anchors + 3 SHAP teratas = penjelasan lengkap yang manusiawi. Kombinasi > satu alat.",
      ],
      formula: String.raw`\phi_i = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!\,(|N|-|S|-1)!}{|N|!}\,[v(S \cup \{i\}) - v(S)]`,
      formulaNote: "φ_i = nilai Shapley fitur i; N = semua fitur; S = koalisi tanpa i; v(S) = prediksi model dengan fitur S. Intuisi: rata-rata 'berapa prediksi berubah saat i bergabung', di semua urutan kedatangan. Contoh: telat bayar rata-rata menurunkan 0,25 → φ = −0,25.",
      figure: {
        svg: FIG_IMP,
        alt: "Permutation importance: f0 dominan, f2/f3 noise.",
        caption: "Permutation importance 4 fitur.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'SHAP menunjukkan hubungan sebab-akibat.' Salah — SHAP menunjukkan KONTRIBUSI terhadap prediksi model, bukan kausalitas dunia nyata. 'Kode pos penting' ≠ 'tinggal di sana menyebabkan gagal bayar' — bisa jadi proksi kemiskinan struktural. Jangan ubah kebijakan dunia dari angka SHAP tanpa analisis kausal terpisah.",
      },
      reference: "Global = siapa penting; lokal = mengapa ini; counterfactual = bagaimana berubah.",
    },
    {
      id: "lab-imp",
      eyebrow: "Langkah 3 · Lab importance",
      title: "Lab: mengacak fitur, mengukur pentingnya",
      prose: [
        "Data 500×4: f0 penting (bobot 2,0), f1 sedang (1,0), f2/f3 noise. Latih logistic regression (gradient descent 2.000 iterasi), lalu permutation importance: acak tiap fitur, ukur penurunan akurasi. Harapan: f0 >> f1 >> f2≈f3≈0.",
        "Perhatikan f3 = −0,002 (NEGATIF!): mengacaknya JUSTRU sedikit membantu — noise murni. Coba ubah: seed berbeda — ranking stabil? (Seharusnya ya untuk f0/f1.) Coba: korelasikan f2 dengan f0 (f2 = f0 + noise) — lihat importance 'bocor' ke f2! Pelajaran: importance terdistorsi oleh korelasi.",
        "Cara membaca: importance = base_acc − acc_setelah_acak. Interpretasi: 0,276 = 'tanpa f0, akurasi anjlok 27,6 poin' — fitur ini TULANG PUNGGUNG model.",
      ],
      tasks: [
        { id: "t1", text: "Latih logistic regression (GD) dan hitung `base_acc`" },
        { id: "t2", text: "Hitung permutation importance tiap fitur, tentukan `ranking`, `print` hasilnya" },
      ],
      expected: "base_acc=0.878 importance: f0=0.276 f1=0.104 f2=0.0 f3=-0.002",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "Permutation importance = 'uji cabut kabel'. Cabut kabel f0 → mesin mati total (penting!). Cabut f2 → tidak terasa (noise). Sederhana, jujur, dan bekerja untuk MODEL APAPUN — itulah mengapa ini lensa pertama yang dipakai profesional.",
      },
      hints: [
        "GD: p = sigmoid(X@w+b); w -= lr * X.T@(p-y)/n (2000 iterasi, lr=0.5)",
        "acc: (sigmoid(X@w+b) > 0.5) == y",
        "untuk tiap fitur j: salin X, acak kolom j (rng.permutation), importance = base - acc(acak)",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(11)
n = 500
X = rng.normal(size=(n, 4))
y = (2.0*X[:, 0] + 1.0*X[:, 1] + rng.normal(scale=1.0, size=n) > 0).astype(int)

# TULIS KODEMU
w = np.zeros(4); b = 0.0
# TODO t1: gradient descent 2000 iterasi, lr=0.5
# TODO t1: base = akurasi di X asli
# TODO t2: untuk tiap fitur: acak kolomnya, importance = base - acc

# UJI (jangan ubah)
def acc(Xm):
    return float((((1/(1+np.exp(-(Xm @ w + b)))) > 0.5).astype(int) == y).mean())
base = acc(X)
imp = {}
for j in range(4):
    Xs = X.copy(); Xs[:, j] = rng.permutation(Xs[:, j])
    imp[f"f{j}"] = round(base - acc(Xs), 4)
print("base_acc =", round(base, 4))
print("importance =", imp)
print("ranking =", sorted(imp, key=imp.get, reverse=True))`,
        lockLines: 7,
        solution: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(11)
n = 500
X = rng.normal(size=(n, 4))
y = (2.0*X[:, 0] + 1.0*X[:, 1] + rng.normal(scale=1.0, size=n) > 0).astype(int)

# TULIS KODEMU
w = np.zeros(4); b = 0.0
for _ in range(2000):
    z = X @ w + b
    p = 1 / (1 + np.exp(-z))
    g = (p - y) / n
    w -= 0.5 * (X.T @ g); b -= 0.5 * g.sum()

# UJI (jangan ubah)
def acc(Xm):
    return float((((1/(1+np.exp(-(Xm @ w + b)))) > 0.5).astype(int) == y).mean())
base = acc(X)
imp = {}
for j in range(4):
    Xs = X.copy(); Xs[:, j] = rng.permutation(Xs[:, j])
    imp[f"f{j}"] = round(base - acc(Xs), 4)
print("base_acc =", round(base, 4))
print("importance =", imp)
print("ranking =", sorted(imp, key=imp.get, reverse=True))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "base_acc\\s*=\\s*0\\.878", label: "base_acc = 0.878", msg: "GD konvergen." },
          { kind: "stdout_matches", task: "t2", pattern: "'f0': 0\\.276.*'f1': 0\\.104", label: "f0=0.276, f1=0.104", msg: "Sesuai bobot data (2,0 vs 1,0)." },
          { kind: "stdout_matches", task: "t2", pattern: "ranking\\s*=\\s*\\['f0', 'f1', 'f2', 'f3'\\]", label: "Ranking benar", msg: "Penting → noise." },
        ],
      },
      reference: "Uji cabut kabel: turun banyak = penting; tidak turun = noise.",
    },
    {
      id: "konsep-shap-praktek",
      eyebrow: "Langkah 4 · SHAP praktek",
      title: "Membaca SHAP seperti profesional",
      prose: [
        "Summary plot (global): tiap titik = 1 nasabah × 1 fitur; sumbu X = SHAP value; warna = nilai fitur (merah tinggi). Pola 'telat bayar': titik merah (banyak telat) di kiri (negatif) = 'semakin sering telat, semakin menurunkan skor'. Dibaca dalam 10 detik: fitur teratas + arah pengaruhnya.",
        "Force plot (lokal): garis bilangan dari base value (0,50) didorong kanan (positif, merah) dan kiri (negatif, biru) oleh tiap fitur → prediksi final 0,37. Untuk surat nasabah: 'keputusan 0,37 karena telat bayar −0,25 (terbesar), dibantu gaji +0,10'. Satu gambar = 1 paragraf penjelasan.",
        "Dependence plot: SHAP vs nilai fitur — melihat NON-LINEARITAS. 'Gaji': naik tajam 0→8 juta, datar setelahnya (diminishing return!). Insight bisnis: menaikkan gaji 5→8 juta membantu; 15→20 juta tidak. Model 'tahu' sesuatu yang berguna — SHAP mengeluarkannya.",
        "Batasan jujur: (1) lambat untuk model besar (sampling untuk 1 juta baris); (2) korelasi mengacaukan atribusi (f0/f2 berkorelasi = berbagi kredit); (3) BUKAN kausalitas. Gunakan untuk debug + komunikasi, bukan untuk klaim ilmiah.",
        "Waterfall plot — kuitansi visual. Batang merah (positif) dan biru (negatif) bertumpuk dari base ke prediksi — untuk 1 nasabah, 1 gambar, semua jelas. Lampirkan di surat penolakan kredit: transparansi yang bisa dicetak.",
        "Stabilitas SHAP — waspada. Fitur berkorelasi → nilai SHAP 'melompat' antar run (sampling KernelSHAP acak!). Untuk laporan regulator: TreeSHAP eksak (deterministik) atau seed tetap. Angka yang berubah tiap run = tidak bisa dipertahankan di sidang.",
        "SHAP untuk teks — token, bukan kata. 'Tidak puas' → token 'tidak' (+0,3), 'puas' (−0,5): net −0,2. Tokenisasi memecah makna — jelaskan ke stakeholder dengan kata utuh, bukan token. Presentasi ≠ komputasi.",
        "Partial dependence plot — efek marginal. 'Bagaimana skor berubah jika gaji naik, yang lain tetap?' PDP = rata-rata prediksi di tiap nilai gaji. Beda dari SHAP dependence (individual); PDP = populasi. Untuk kebijakan ('haruskah ambang gaji diubah?'): PDP. Untuk individu: SHAP. Dua pertanyaan, dua plot.",
        "Interaksi fitur — SHAP interaction values. 'Telat bayar' × 'gaji kecil' = kombinasi mematikan (bukan jumlah keduanya!). Interaction value mengurai: efek utama + efek interaksi. Menemukan 'pasangan berbahaya' yang tak terlihat di importance tunggal. Untuk risk: interaksi = di mana krisis bersembunyi.",
      ],
      formula: String.raw`f(x) = \phi_0 + \sum_{i=1}^{M} \phi_i \qquad \phi_0 = \mathbb{E}[f(x)]`,
      formulaNote: "f(x) = prediksi untuk individu x; φ_0 = prediksi rata-rata (base value); φ_i = kontribusi fitur i. Jumlah = prediksi — 'kuitansi' yang balance. Contoh: 0,50 + (−0,25+0,10+0,02) = 0,37.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "SHAP untuk AUDIT INTERNAL dulu, regulator kemudian. 80% nilainya = menemukan fitur bermasalah (kode pos!) SEBELUM orang luar menemukannya. Malu di depan cermin > malu di depan OJK.",
      },
      reference: "Summary (global), force (lokal), dependence (non-linear). Bukan kausalitas.",
    },
    {
      id: "treeshap-kernelshap-jebakan",
      eyebrow: "Langkah 5 · TreeSHAP vs KernelSHAP",
      title: "Aksioma Shapley, dua mesin, dan empat jebakan",
      prose: [
        "Mengapa SHAP menang di ruang regulasi sementara LIME tertinggal? Jawabannya bukan akurasi — melainkan TEOREMA. Nilai Shapley adalah SATU-SATUNYA metode atribusi yang memenuhi empat aksioma sekaligus: efisiensi (jumlah atribusi = prediksi — 'kuitansi yang balance' di langkah sebelumnya), simetri (fitur yang berkontribusi identik mendapat kredit sama), dummy (yang tak berkontribusi dapat nol), aditivitas (atribusi permainan gabungan = jumlah atribusi). Keunikan ini terbukti matematis (Shapley, 1953) — bukan klaim marketing.",
        "Implikasinya praktis: saat regulator bertanya 'mengapa metode ini adil?', jawabanmu bukan 'karena populer' melainkan 'karena ini satu-satunya pembagian kredit yang memenuhi empat aksioma kewajaran'. Aksioma = kontrak kewajaran yang bisa diaudit. Metode atribusi lain memilih subset aksioma secara diam-diam — SHAP memenuhinya semua secara terbuka.",
        "Dua mesin menghitung nilai yang sama — dengan harga berbeda. TreeSHAP: eksak untuk model tree, kompleksitas O(T·L·D²) — 500 tree dalam milidetik; inilah yang dipakai di produksi. KernelSHAP: agnostik-model — memasang regresi linear berbobot di atas koalisi fitur yang disampel; kompleksitas eksak O(2^M) sehingga selalu sampling → ada VARIANSI (dua run bisa beda untuk kasus borderline). Rumus kompleksitas di bawah — hafalkan orde-nya, bukan angkanya.",
        "TreeSHAP punya dua mode yang jarang dibedakan — dan bedanya PENTING. Observational: ekspektasi bersyarat memakai data training (menghormati korelasi — kredit dibagi ke fitur berkorelasi). Interventional: memutus korelasi ala operator-do (fitur dinilai seolah diubah sendiri). Default library shap BERUBAH antar versi — ketahui mana yang kamu jalankan, karena untuk fitur berkorelasi hasilnya bisa beda jauh.",
        "Jebakan 1 — korelasi. Dua fitur berkorelasi 0,95 (misal 'gaji' dan 'pajak penghasilan'): SHAP observational membagi kredit ~50/50 meski satu di antaranya 'penggerak sejati'. Atribusi individual menjadi TIDAK TERIDENTIFIKASI — seperti lab langkah sebelumnya di mana importance 'bocor' ke f2. Respons senior: cek matriks korelasi SEBELUM interpretasi; untuk |r| di atas 0,8 laporkan sebagai GRUP, bukan individu.",
        "Jebakan 2 — pilihan baseline. φ0 = E[f(x)] dihitung di atas background dataset. Ganti background (semua nasabah vs hanya yang ditolak) → SEMUA atribusi berubah, bahkan bisa ganti tanda! 'Telat bayar −0,25' artinya '−0,25 RELATIF TERHADAP rata-rata populasi background'. Selalu nyatakan baseline: 'relatif terhadap rata-rata 10.000 nasabah'. Tanpa baseline, angka SHAP = kalimat tanpa subjek.",
        "Jebakan 3 — kausalitas yang disalahartikan. SHAP menjelaskan MODEL, bukan DUNIA. 'Kode pos −0,18' artinya MODEL memakai kode pos — bukan kode pos MENYEBABKAN gagal bayar. Mini-case bank: SHAP menemukan DOSA model (diskriminasi wilayah), bukan fakta dunia. Membaca SHAP sebagai sebab-akibat = vonis yang salah arah — kamu menghukum fitur, bukan memperbaiki model.",
        "Jebakan 4 — komputasi. Shapley eksak eksponensial terhadap M (fitur). KernelSHAP sampling = variansi: untuk fitur borderline, run 1 bilang peringkat 3, run 2 bilang peringkat 5. Jangan SHAP 1 juta baris naif — sampel 1.000 yang representatif, agregasi (beeswarm), laporkan stabilitas lintas seed. Dan ingat skenario langkah peta keputusan: model linear → koefisien CUKUP; SHAP untuk regresi logistik = berlebihan.",
        "Aturan keputusan 10 detik: (1) tree → TreeSHAP (cek mode: observational vs interventional, catat di laporan); (2) model apapun + M kecil → KernelSHAP dengan seed tetap + cek konvergensi (naikkan sampel sampai ranking stabil); (3) regulasi → dokumentasikan aksioma + baseline + background dataset (inilah yang ditanya auditor); (4) |r| di atas 0,8 → grup, bukan individu.",
        "Dependence plot — membaca INTERAKSI dari SHAP. Sumbu X = nilai fitur, Y = nilai SHAP-nya, warna = fitur kedua. Contoh: titik-titik 'telat bayar' membentuk dua garis — merah (gaji tinggi) landai, biru (gaji rendah) curam. Artinya: efek telat bayar BERGANTUNG pada gaji (interaksi!). Summary plot memberi tahu 'apa yang penting'; dependence plot memberi tahu 'kapan dan untuk siapa' — inilah yang membuat stakeholder berkata 'ah, masuk akal'.",
        "SHAP untuk teks dan gambar: PartitionSHAP. M = 500 token → 2^500 mustahil; solusinya koalisi HIERARKIS: hitung dulu per kalimat, lalu 'zoom' ke frasa/token di kalimat yang penting. Kompleksitas turun dari eksponensial ke hierarkis. Untuk gambar: koalisi per superpixel, bukan per piksel. Prinsipnya sama — tetapi baseline 'token kosong' harus dipilih hati-hati (mask token vs kata netral memberi hasil beda).",
        "SHAP vs counterfactual — dua pertanyaan berbeda. SHAP menjawab 'mengapa DITOLAK' (atribusi masa lalu). Counterfactual menjawab 'apa yang harus DIUBAH agar diterima' ('lunasi 2 tunggakan → skor naik 0,15'). Untuk surat nasabah, keduanya dibutuhkan: regulasi modern menuntut hak penjelasan DAN hak recours (jalan keluar). SHAP tanpa counterfactual = vonis tanpa banding.",
      ],
      formula: String.raw`\mathcal{O}(\text{TreeSHAP}) = T\cdot L\cdot D^2 \qquad \mathcal{O}(\text{KernelSHAP}) = 2^M \to \text{sampling}`,
      formulaNote: "T = jumlah tree, L = daun per tree, D = kedalaman; M = jumlah fitur. TreeSHAP polinomial → 500 tree dalam milidetik (eksak). KernelSHAP eksponensial → wajib sampling (mis. 1000 koalisi) → ada variansi antar run. Contoh: M=20 → 2^20 ≈ 1 juta koalisi (mustahil eksak); M=6 → 64 (bisa eksak).",
      tasks: [],
      note: {
        title: "⚠️ Jebakan",
        type: "pitfall",
        body: "SHAP menjelaskan MODEL, bukan dunia. 'Kode pos −0,18' = model MEMAKAI kode pos sebagai sinyal, bukan kode pos menyebabkan gagal bayar. Membacanya sebagai kausalitas = menghukum fitur padahal yang harus diperbaiki adalah model (atau datanya).",
      },
      reference: "Empat aksioma = keunikan Shapley. TreeSHAP eksak-cepat (perhatikan modenya), KernelSHAP lambat-bervariansi. Empat jebakan: korelasi, baseline, kausalitas, komputasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: seberapa dalam menjelaskan?",
      prose: [
        "Skenario 1 — regulasi (kredit, asuransi) → SHAP lokal per keputusan + surat nasabah. WAJIB hukum.",
        "Skenario 2 — debug model → summary + dependence plot. Cari fitur aneh (kode pos!).",
        "Skenario 3 — stakeholder non-teknis → 3 fitur teratas dalam bahasa awam. Bukan 40 angka.",
        "Skenario 4 — eksplorasi cepat → permutation importance (5 menit). Cukup untuk 80% kebutuhan.",
        "Skenario 5 — model linear → koefisien CUKUP. Jangan SHAP-kan regresi logistik (berlebihan!).",
        "Aturan praktis 10 detik: (1) wajib hukum? SHAP lokal. (2) debug? summary. (3) cepat? permutation. (4) linear? koefisien.",
        "Skenario 6 — model digugat → dokumentasi SHAP + counterfactual + audit trail. 'Kami bisa menjelaskan tiap keputusan' = pembelaan terkuat.",
        "Skenario 7 — trade-off akurasi vs interpretability → ukur KEDUANYA: 'kehilangan 0,005 AUC untuk penjelasan penuh'. Keputusan eksplisit > default buta. Tulis trade-off-nya — itulah engineering yang dewasa.",
      ],
      tasks: [],
    },
    {
      id: "minicase-kodepos",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: fitur kode pos dan Rp2 miliar",
      prose: [
        "SHAP summary bank: 'kode_pos' peringkat 3 (importance 0,18) — di atas 'gaji'! Investigasi: kode pos = proksi wilayah miskin → model mendiskriminasi wilayah. Risiko: gugatan diskriminasi Rp2 miliar + reputasi. Tindakan: buang fitur, retrain — AUC turun 0,86→0,855 (−0,005 = Rp100 juta/tahun nilai).",
        "Kalkulasi: −Rp100 juta/tahun (akurasi) vs −Rp2 miliar (gugatan) + keadilan. Keputusan: buang — BUKAN karena akurasi, melainkan karena RISIKO. Tanpa SHAP: diskriminasi tak terlihat sampai digugat. Biaya SHAP: 2 hari analisis. ROI: tak terhingga (mencegah bencana).",
        "Pembahasan: 0,005 AUC terlihat 'kecil' — tetapi ini harga keadilan. Organisasi dewasa membayarnya. Yang tidak dewasa: mengorbankan keadilan untuk 0,005, lalu membayar 20.000x lipat di pengadilan.",
        "Cara membaca: SHAP bukan hanya 'penjelasan' — ia mikroskop keadilan. Fitur proksi (kode pos, nama, bahasa) = yang dicari duluan.",
        "Interpretasi: interpretability = kompas moral yang terukur. Tanpa: buta. Dengan: bisa memilih dengan sadar.",
        "Fairness audit rutin — kuartalan. SHAP per grup demografis: apakah 'kode pos' penting HANYA untuk wilayah tertentu? Disparate impact ratio <0,8 = investigasi. Audit terjadwal > audit saat digugat.",
        "Dokumentasi keputusan fitur — 'mengapa dibuang'. 1 paragraf: temuan SHAP, risiko hukum, keputusan, tanggal, penyetuju. 2 tahun kemudian saat ditanya 'mengapa AUC turun 0,005': jawab dengan dokumen, bukan ingatan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Tiga lensa: global (siapa penting), lokal (mengapa ini), counterfactual (bagaimana berubah).",
        "SHAP = nilai Shapley: kontribusi adil tiap fitur, jumlah = prediksi (kuitansi).",
        "Permutation importance: acak fitur → turun akurasi = pentingnya; uji cabut kabel.",
        "Baca summary (arah), force (kuitansi individu), dependence (non-linear).",
        "SHAP ≠ kausalitas; cari fitur proksi diskriminasi; linear cukup koefisien.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "f(x) = 0,50 + (−0,25) + 0,10 + 0,02 = 0,37. Apa arti −0,25?",
          options: [
            { text: "Kontribusi fitur 'telat bayar' menurunkan prediksi 0,25", why: "Tepat: SHAP = kuitansi per fitur yang berjumlah prediksi.", correct: true },
            { text: "Korelasi −0,25", why: "Bukan korelasi — ini kontribusi marginal adil.", correct: false },
            { text: "Probabilitas 25%", why: "Bukan probabilitas — ini delta dari base value.", correct: false },
            { text: "Error model", why: "Bukan error — ini dekomposisi prediksi.", correct: false },
          ],
        },
        {
          q: "SHAP menunjukkan 'kode pos' penting. Kesimpulan yang benar?",
          options: [
            { text: "Selidiki — mungkin proksi diskriminasi wilayah", why: "Tepat: SHAP = mikroskop, bukan vonis; investigasi dulu.", correct: true },
            { text: "Kode pos menyebabkan gagal bayar", why: "SHAP ≠ kausalitas — jangan lompat ke sebab-akibat.", correct: false },
            { text: "Buang semua fitur lokasi", why: "Prematur — selidiki dulu, putuskan dengan data.", correct: false },
            { text: "Abaikan — model tahu yang terbaik", why: "Buta = risiko gugatan Rp2 miliar.", correct: false },
          ],
        },
        {
          q: "Nasabah bertanya 'apa yang harus saya perbaiki?' Lensa terbaik?",
          options: [
            { text: "Counterfactual — 'jika gaji Rp10 juta, diterima'", why: "Tepat: memberi jalan keluar, bukan sekadar vonis.", correct: true },
            { text: "Summary plot global", why: "Itu untuk populasi, bukan individu.", correct: false },
            { text: "Permutation importance", why: "Itu global juga — tidak menjawab 'saya'.", correct: false },
            { text: "Tidak perlu dijelaskan", why: "Regulasi + etika menuntut penjelasan.", correct: false },
          ],
        },
        {
          q: "Model regresi logistik untuk audit. Perlu SHAP?",
          options: [
            { text: "Tidak — koefisien sudah interpretable langsung", why: "Tepat: jangan SHAP-kan yang sudah jelas.", correct: true },
            { text: "Ya, selalu SHAP", why: "Berlebihan untuk model linear — koefisiennya sudah langsung interpretable.", correct: false },
            { text: "Ya, agar terlihat canggih", why: "Kosmetik ≠ kebutuhan — SHAP untuk linear = pamer, bukan keperluan.", correct: false },
            { text: "Tidak perlu dijelaskan sama sekali", why: "Tetap perlu dijelaskan — via koefisien.", correct: false },
          ],
        },
        {
          q: "Dua fitur berkorelasi kuat. Efek ke interpretasi?",
          options: [
            { text: "Kredit terbagi — importance/SHAP terdistorsi", why: "Tepat: seperti lab f2 yang 'bocor' importance.", correct: true },
            { text: "Tidak ada efek", why: "Ada — atribusi menjadi ambigu.", correct: false },
            { text: "Model menjadi lebih baik", why: "Korelasi ≠ perbaikan; bisa redundansi.", correct: false },
            { text: "SHAP menjadi kausal", why: "SHAP tidak pernah kausal — ia atribusi prediksi, bukan sebab-akibat dunia nyata.", correct: false },
          ],
        },
        {
          q: "Dua fitur berkorelasi 0,95; SHAP membagi kredit ~50/50. Respons senior?",
          options: [
            { text: "Laporkan sebagai grup berkorelasi — atribusi individual tak teridentifikasi; cek korelasi dulu", why: "Tepat: |r| di atas 0,8 → individu tidak terpisah; seperti importance 'bocor' di lab.", correct: true },
            { text: "Pilih salah satu secara acak untuk dilaporkan", why: "Acak = tidak reproducible; grup adalah jawaban jujur.", correct: false },
            { text: "Buang salah satu fitur lalu SHAP ulang", why: "Mengubah model mengubah pertanyaan — interpretasikan model yang ada.", correct: false },
            { text: "Itu berarti keduanya sama penting secara kausal", why: "SHAP bukan kausal — ini jebakan 3; 50/50 = artefak korelasi.", correct: false },
          ],
        },
        {
          q: "Mengapa pilihan background dataset mengubah nilai SHAP?",
          options: [
            { text: "Karena φ0 = E[f(x)] dihitung di atasnya — baseline beda, acuan 'kontribusi relatif' ikut beda", why: "Tepat: −0,25 'relatif terhadap siapa' ditentukan background; ganti populasi = ganti arti angka.", correct: true },
            { text: "Karena background mempercepat komputasi", why: "Background justru menambah komputasi; efeknya ke MAKNA, bukan kecepatan.", correct: false },
            { text: "Tidak mengubah — SHAP independen dari background", why: "Keliru: KernelSHAP memakai background untuk ekspektasi; TreeSHAP observational memakai data training.", correct: false },
            { text: "Hanya mengubah tanda, bukan besaran", why: "Bisa mengubah keduanya — seluruh dekomposisi bergeser.", correct: false },
          ],
        },
      ],
    },
  ],
};
