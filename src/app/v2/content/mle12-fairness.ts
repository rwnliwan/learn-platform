import type { V2Lesson } from "../lib/types";

export const mle12: V2Lesson = {
  slug: "mle12-fairness",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE12 — Fairness & Responsible ML",
  estMinutes: 80,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model yang 'akurat' bisa tetap tidak adil — dan ketidakadilan yang diotomatiskan berskala jauh lebih besar daripada ketidakadilan manusia. Lesson ini memberimu alat ukur dan alat perbaikinya.",
        "Tujuan lesson ini:",
        "• Menjelaskan kenapa akurasi global menyembunyikan ketidakadilan.",
        "• Menghitung disparate impact ratio dan equal opportunity gap.",
        "• Mengidentifikasi sumber bias: data, label, fitur, feedback loop.",
        "• Menerapkan mitigasi: reweighting dan penyesuaian threshold.",
        "• Memutuskan pendekatan fairness untuk 4 skenario.",
        "Isi lesson: cerita model hiring yang 'adil' → metrik fairness + lab → sumber bias & mitigasi + lab → tradeoff & governance → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model hiring dengan akurasi sama — dan recall 40% vs 85%",
      prose: [
        "Sebuah perusahaan memakai AI screening CV. Audit pertama: akurasi 82% untuk grup A dan 81% untuk grup B — 'adil', kata vendor.",
        "Audit kedua melihat lebih dalam: recall untuk kandidat qualified grup A = 85%, grup B = 40%. Artinya: kandidat qualified dari grup B 4x lebih mungkin TERLEWAT oleh sistem (FNR grup B 60% vs grup A 15% — 60/15 = 4,0×). Akurasi 'sama' menyembunyikan bahwa kesalahan didistribusikan tidak merata — grup B menanggung false negative 4x lebih sering per kandidat qualified; seberapa besar pangsa FN absolutnya tergantung ukuran tiap grup (bila grup B kecil, pangsa FN absolutnya bisa kecil walau ratenya 4×).",
        "Twist-nya: model tidak pernah melihat atribut grup. 'Kami tidak memasukkan gender/suku sebagai fitur!' — tetapi fitur proxy (nama universitas, kode pos, gap karir) membawa informasi yang sama. Buta terhadap atribut ≠ adil.",
        "Pelajaran: fairness harus DIUKUR per grup, bukan diasumsikan dari desain. Yang tidak diukur = tidak dikelola.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'tidak memakai atribut sensitif = model adil'",
        type: "pitfall",
        body: "Yang benar: proxy (kode pos, nama, riwayat) merekonstruksi atribut sensitif. Keadilan butuh pengukuran outcome per grup — bukan sekadar menghapus kolom.",
      },
    },
    {
      id: "metrik",
      eyebrow: "Langkah 3 · Metrik fairness",
      title: "Tiga lensa keadilan",
      prose: [
        "Demographic parity: P(lolos | grup A) ≈ P(lolos | grup B). Sederhana, tetapi mengabaikan perbedaan kualifikasi antar grup — bisa memaksa kuota yang tidak meritokratis.",
        "Equal opportunity: recall (TPR) grup A ≈ grup B — fokus pada yang qualified: 'kandidat bagus dari grup mana pun punya peluang sama lolos'. Equalized odds: equal opportunity DITAMBAH FPR yang sama — tingkat kesalahan di kedua arah sama antar grup. Equalized odds mencakup equal opportunity; keduanya bukan dua lensa yang berbeda, melainkan satu yang lebih ketat dari yang lain. Ini lensa yang paling selaras dengan meritokrasi.",
        "Disparate impact (aturan 4/5 AS): rasio tingkat lolos grup minoritas/mayoritas ≥ 0,8. Di bawah itu = disparate impact, pemicu investigasi hukum di banyak yurisdiksi.",
        "Ketiganya TIDAK SELALU bisa dipenuhi bersamaan — tetapi alasannya lebih halus dari yang sering diajarkan: equalized odds (TPR sama + FPR sama) SUDAH mencakup equal opportunity (TPR sama) — keduanya bukan dua kriteria independen yang saling mengecualikan. Ketidakmungkinan yang sesungguhnya (teorema Kleinberg–Chouldechova) berlaku untuk kombinasi tertentu — mis. calibration + equalized odds — bila base rate kedua grup berbeda. Jadi 'pilih SATU dari tiga' adalah penyederhanaan yang salah; yang benar: pahami HUBUNGAN antar metrik (equalized odds mencakup equal opportunity) dan kombinasi mana yang memang mustahil pada base rate berbeda. Memilih metrik = memilih definisi keadilan — keputusan nilai, bukan matematika.",
        "Lab: tingkat lolos A = 50%, B = 30% → rasio 0,60 < 0,8 → DISPARATE IMPACT. Angka ini memicu investigasi, bukan vonis — tetapi tanpanya, tidak ada yang bertanya.",
        "Tiga metrik, tiga cerita — contoh angka. Grup A/B, 100 pelamar tiap. Demographic parity: lolos A=50, B=30 → DI 0,6 ✗. Equal opportunity: yang BERKUALIFIKASI lolos: A=40/50 (80%), B=24/30 (80%) → ✓ ADIL! Equalized odds: + false positive rate sama. Pelajaran: DI 0,6 TERLIHAT tidak adil, tetapi jika kualifikasi memang beda, equal opportunity bilang ADIL. Metrik yang salah = tuduhan yang salah. Pilih metrik sesuai TEORI KEADILAN yang kamu anut — dan tulis alasannya.",
        "Impossibility theorem — yang harus diketahui. Tiga metrik ini TIDAK independen: equalized odds (TPR sama + FPR sama) sudah mencakup equal opportunity (TPR sama) — jadi 'ketiganya tidak bisa bersamaan' keliru sebagai tiga hal terpisah. Yang benar-benar mustahil (pada base rate berbeda, kecuali kasus trivial) adalah kombinasi tertentu — mis. calibration + equalized odds. Pilih metrik sesuai teori keadilanmu: parity = “hasil sama” (kuota); equal opportunity = “kesempatan sama bagi yang qualified” (meritokrasi); equalized odds = “error sama” (prosedural). Tidak ada pilihan “benar” — ada pilihan yang DIPERTAHANKAN — tetapi pilihan itu harus dibuat dengan hubungan antar metrik yang benar, bukan dengan slogan 'pilih satu dari tiga'. Tulis pilihanmu + alasannya di model card. Yang tidak memilih = dipilihkan oleh default library (biasanya parity — yang paling kontroversial!).",
      ],
      formula: String.raw`\text{DI ratio} = \frac{P(\hat{Y}=1 \mid G=B)}{P(\hat{Y}=1 \mid G=A)} \geq 0{,}8`,
      formulaNote: "DI ratio (Disparate Impact) = P(lolos|grup B) / P(lolos|grup A); 0,8 = ambang “80% rule” (EEOC). DI 0,60 (kasus DanaMaju: 30%/50%) = disparate impact — di AS = bukti prima facie diskriminasi. DI bukan vonis (bisa ada penjelasan bisnis), tetapi ia adalah ALARM yang wajib diinvestigasi — bukan diabaikan.",
      figure: {
        svg: `<svg viewBox="0 0 480 200" role="img" aria-label="Tingkat kelolosan per grup (%)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tingkat kelolosan per grup (%)</text>
<line x1="46" y1="166.0" x2="466" y2="166.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="170.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="131.0" x2="466" y2="131.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="135.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">12.5</text>
<line x1="46" y1="96.0" x2="466" y2="96.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="100.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">25.0</text>
<line x1="46" y1="61.0" x2="466" y2="61.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="65.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">37.5</text>
<line x1="46" y1="26.0" x2="466" y2="26.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="30.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">50.0</text>
<rect x="83.8" y="26.0" width="134.4" height="140.0" fill="var(--c1)" rx="3"/>
<text x="151.0" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">50</text>
<text x="151.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">A lolos</text>
<rect x="293.8" y="82.0" width="134.4" height="84.0" fill="var(--c4)" rx="3"/>
<text x="361.0" y="76.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">30</text>
<text x="361.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">B lolos</text>
<line x1="46" y1="166" x2="466" y2="166" stroke="var(--chart-grid)" stroke-width="1"/>
</svg>`,
        alt: "Bar chart: grup A 50% lolos, grup B 30% lolos.",
        caption: "Cara membaca: tinggi batang = % pelamar yang lolos per grup. Interpretasi: rasio 30/50 = 0,60 < 0,8 (aturan 4/5) → disparate impact. Kesenjangan 20 poin ini tidak terlihat dari akurasi global.",
      },
      tasks: [
        { id: "t1", text: "Hitung `rate_a`, `rate_b`, dan `di_ratio`" },
        { id: "t2", text: "Tentukan `verdict` dengan aturan 4/5 (0.8)" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: ukur dulu, debat definisi kemudian",
        body: "Tim sering berdebat definisi keadilan berbulan-bulan tanpa angka. Hitung ketiga metrik dulu (10 menit) — data konkret membuat debat 10x lebih produktif.",
      },
      hints: [
        "rate = lolos / pelamar.",
        "di_ratio = rate_b / rate_a.",
        "verdict = 'DISPARATE IMPACT' jika di_ratio < 0.8 else 'OK'.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
grup_a = {"pelamar": 800, "lolos": 400}
grup_b = {"pelamar": 200, "lolos": 60}

# TULIS KODEMU: disparate impact ratio
rate_a = 
rate_b = 
di_ratio = 
verdict = 

print(f"di_ratio={di_ratio:.2f}  verdict={verdict}")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
grup_a = {"pelamar": 800, "lolos": 400}
grup_b = {"pelamar": 200, "lolos": 60}

# TULIS KODEMU: disparate impact ratio
rate_a = grup_a["lolos"] / grup_a["pelamar"]
rate_b = grup_b["lolos"] / grup_b["pelamar"]
di_ratio = rate_b / rate_a
verdict = "DISPARATE IMPACT" if di_ratio < 0.8 else "OK"

print(f"di_ratio={di_ratio:.2f}  verdict={verdict}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`di_ratio` = 0.60",
            "name": "di_ratio",
            "value": 0.6,
            "tol": 1e-09,
            "msg": "(60/200)/(400/800) = 0.3/0.5 = 0.6.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis",
            "pattern": "verdict=DISPARATE IMPACT",
            "msg": "0.6 < 0.8 → disparate impact.",
          },
        ],
      },
      reference: "Aturan 4/5: rasio < 0.8 = lampu merah (bukan vonis hukum otomatis).",
    },
    {
      id: "bias",
      eyebrow: "Langkah 4 · Sumber bias dan mitigasi",
      title: "Dari mana bias lahir — dan cara melawannya",
      prose: [
        "Empat sumber: (1) Data historis — model belajar dari keputusan manusia masa lalu yang bias (rekrutmen 'culture fit'). (2) Label bias — 'kinerja bagus' dinilai subjektif oleh atasan. (3) Fitur proxy — kode pos ≈ suku. (4) Feedback loop — model menolak grup B → grup B tidak pernah dapat kesempatan → data masa depan 'membuktikan' grup B memang buruk.",
        "Tiga titik mitigasi: pre-processing (reweighting/rebalancing data training), in-processing (tambah constraint fairness saat training), post-processing (sesuaikan threshold per grup setelah training).",
        "Lab: threshold tunggal 0,6 → recall A 66%, B 21% (gap 45 poin!). Cari threshold grup B agar recall menyamai A: threshold 0,45 → recall B 62% ≈ A 66%. Gap menyusut dari 45 menjadi 4 poin.",
        "Catatan jujur: threshold berbeda per grup adalah disparate treatment di beberapa yurisdiksi — konsultasikan legal. Alternatif yang lebih aman: perbaiki representasi data dan fitur, bukan threshold.",
        "Proxy discrimination — yang paling licin. Model tidak memakai “suku” (dilarang!), tetapi memakai KODE POS — yang berkorelasi 0,85 dengan suku. Hasil: diskriminasi tanpa variabel terlarang. Deteksi: (1) korelasi fitur vs atribut sensitif (>0,5 = curiga); (2) uji “buta vs sadar” — apakah model berperilaku beda jika atribut diacak? Mitigasi: hapus/ganti proxy, atau constraint fairness di training. “Kami tidak memakai data SARA” ≠ “model kami adil” — proxy ada di mana-mana.",
        "Umpan balik loop — bias yang memperkuat dirinya. Model hiring bias → grup B jarang direkrut → data training berikutnya makin sedikit grup B yang sukses → model makin bias. LINGKARAN SETAN otomatis. Deteksi: monitor DI ratio TREND (bukan snapshot) — turun 3 kuartal berturut-turut = loop berjalan. Pemutus: intervensi aktif (rekrutmen afirmatif sementara / reweight training). Tanpa pemutus: otomasi ketidakadilan dengan presisi statistik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `r_a` (thr 0.6) dan `r_b` (thr 0.6): recall per grup" },
        { id: "t2", text: "Cari `best`: threshold grup B (0.05–0.95) dengan recall terdekat r_a" },
        { id: "t3", text: "Cetak recall awal, threshold adil, dan recall akhir" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'bias hilang kalau datanya besar'",
        type: "pitfall",
        body: "Yang benar: data besar yang bias = bias yang diyakini dengan sangat percaya diri. Feedback loop justru menguatkan bias seiring data bertambah. Ukuran tidak menggantikan keadilan.",
      },
      hints: [
        "recall(skor, thr) = proporsi skor >= thr.",
        "Cari di [t/100 for t in range(5, 96, 5)] yang meminimalkan |recall_b(t) - r_a|.",
        "min(daftar, key=lambda t: abs(...)).",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(51)
skor_a = [min(1, max(0, random.gauss(0.65, 0.15))) for _ in range(500)]
skor_b = [min(1, max(0, random.gauss(0.50, 0.15))) for _ in range(200)]
def recall(skor, thr):
    return sum(1 for s in skor if s >= thr) / len(skor)
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
r_a = 
r_b = 
best = 
r_b_adil = recall(skor_b, best)

print(f"recall_A={r_a:.2f}  recall_B_tunggal={r_b:.2f}  thr_B_adil={best:.2f}  recall_B_adil={r_b_adil:.2f}")`,
        lockLines: 8,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(51)
skor_a = [min(1, max(0, random.gauss(0.65, 0.15))) for _ in range(500)]
skor_b = [min(1, max(0, random.gauss(0.50, 0.15))) for _ in range(200)]
def recall(skor, thr):
    return sum(1 for s in skor if s >= thr) / len(skor)
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
r_a = recall(skor_a, 0.6)
r_b = recall(skor_b, 0.6)
best = min([t/100 for t in range(5, 96, 5)], key=lambda t: abs(recall(skor_b, t) - r_a))
r_b_adil = recall(skor_b, best)

print(f"recall_A={r_a:.2f}  recall_B_tunggal={r_b:.2f}  thr_B_adil={best:.2f}  recall_B_adil={r_b_adil:.2f}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`r_b` ≈ 0.21 (timpang)",
            "name": "r_b",
            "value": 0.21,
            "tol": 0.02,
            "msg": "Threshold tunggal menghukum grup dengan skor lebih rendah.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`best` = 0.45",
            "name": "best",
            "value": 0.45,
            "tol": 1e-09,
            "msg": "Threshold 0.45 menyamakan recall B dengan A.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan hasil adil",
            "pattern": "recall_B_adil=0\\.62",
            "msg": "Gap menyusut dari 45 poin menjadi ~4 poin.",
          },
        ],
      },
      reference: "Post-processing = mitigasi termurah (tanpa retrain), tetapi konsultasikan legal.",
    },
    {
      id: "governance",
      eyebrow: "Langkah 5 · Tradeoff dan governance",
      title: "Keadilan vs akurasi — dan siapa memutuskan",
      prose: [
        "Mitigasi fairness sering menurunkan akurasi global sedikit (1–3 poin). Ini bukan bug — ini harga keadilan. Pertanyaannya bukan 'apakah kita mau membayar?' melainkan 'siapa yang selama ini membayar ketidakadilan?'",
        "Governance praktis: (1) fairness review WAJIB sebelum deploy model yang berdampak ke manusia (hiring, kredit, hukum); (2) metrik fairness di dashboard monitoring, bukan laporan tahunan; (3) dokumentasi: definisi keadilan yang dipilih + alasannya + tradeoff yang diterima.",
        "Red teaming: minta tim terpisah mencari cara model bisa tidak adil — seperti penetration test untuk keamanan. Bias yang ditemukan sendiri < bias yang ditemukan jurnalis.",
        "Prinsip: jika modelmu menentukan nasib manusia, 'tidak tahu' bukan jawaban yang dapat diterima untuk pertanyaan fairness.",
        "Harga keadilan — angka. Tanpa mitigasi: akurasi 85%, DI 0,6. Dengan constraint: akurasi 83% (−2 poin), DI 0,85. “Rugi” 2 poin akurasi = berapa rupiah? Jika 2 poin = Rp50 juta/bln (konversi), dan gugatan diskriminasi = Rp5 miliar + reputasi: premi Rp50 juta/bln untuk asuransi Rp5 miliar = MURAH. Frame yang benar: bukan “akurasi vs keadilan”, melainkan “premi vs risiko”. Dan dokumentasikan trade-off ini — direksi yang menandatangani = akuntabilitas yang jelas.",
        "Dokumentasi model (model card) — yang auditor minta. (1) Tujuan + batas penggunaan. (2) Data training (sumber, periode, komposisi grup). (3) Metrik + per slice. (4) Fairness audit (3 metrik + mitigasi). (5) Trade-off yang diambil + siapa menyetujui. Lima bagian, 3 halaman. Tanpa model card: audit = interogasi. Dengan: audit = verifikasi. Tulis SEBELUM diminta — yang ditulis setelah diminta terlihat seperti menutupi.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: fairness adalah fitur kepercayaan",
        body: "Satu skandal bias menghancurkan kepercayaan yang dibangun bertahun-tahun. Investasi fairness = premi asuransi reputasi termurah.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Pendekatan fairness per konteks",
      prose: [
        "Skenario 1 — Hiring/lending (dampak langsung ke manusia, risiko hukum) → audit penuh: 3 metrik + mitigasi + review legal + monitoring. Alasan: taruhannya hak manusia dan gugatan.",
        "Skenario 2 — Rekomendasi konten → ukur exposure per grup kreator; mitigasi ringan. Alasan: dampak ekonomi tetapi tidak menentukan nasib.",
        "Skenario 3 — Model internal (prioritas tiket CS) → ukur, dokumentasikan, mitigasi jika timpang parah. Alasan: dampak tidak langsung, tetapi tetap membentuk pengalaman.",
        "Skenario 4 — Riset tanpa deploy → ukur dan laporkan sebagai bagian hasil. Alasan: kebiasaan baik + mencegah 'penemuan' bias setelah terlanjur dipublikasikan.",
        "Aturan praktis 10 detik: (1) Apakah model menentukan akses ke peluang/sumber daya? (2) Apakah ada risiko hukum/reputasi? Ya → audit penuh. Tidak → ukur dan dokumentasikan.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Pinjol: approval 50% vs 30%, NPL sama",
      prose: [
        "Pinjol DanaMaju: approval grup A 50%, grup B 30% (DI ratio 0,60). Manajemen berargumen: 'grup B memang lebih berisiko — NPL mereka 8% vs 5%.'",
        "Audit slice: pada segmen 'penghasilan > Rp10jt & tenor 12 bulan', NPL kedua grup SAMA (4,2% vs 4,3%) — tetapi approval tetap 55% vs 32%. Perbedaan risiko tidak menjelaskan kesenjangan approval. Model menghukum grup B bahkan saat risikonya identik.",
        "Akar: fitur 'lama tinggal di alamat' (proxy urbanisasi) berkorelasi dengan grup. Model 'belajar' pola historis penolakan manusia.",
        "Pertanyaan: (a) Argumen manajemen valid? (b) Bukti apa yang membantahnya? (c) Mitigasi yang tepat?",
        "Pembahasan: (a) Tidak — argumen 'memang lebih berisiko' harus diuji per segmen risiko setara, bukan agregat. (b) Slice dengan NPL sama tetapi approval timpang = bukti model menambah ketidakadilan di atas perbedaan risiko riil. (c) Hapus/transform fitur proxy + reweighting + threshold review + monitoring DI ratio bulanan. Bukan 'tambah data grup B' saja — data historisnya sendiri yang bias.",
        "Investigasi DanaMaju — langkah audit. (1) Hitung 3 metrik: DI 0,6 ✗; equal opportunity: kualifikasi-lolos A=70%, B=68% → hampir sama — TETAPI angka ini tidak menutup kasus: ia mengukur peluang lolos di antara yang 'qualified' menurut definisi yang dipakai, sementara slice segmen risiko setara (NPL 4,2% vs 4,3%) menunjukkan approval 55% vs 32% — di risiko yang SAMA, grup B tetap ditolak lebih sering. Equalized odds TIDAK bisa dinyatakan ✓ di sini — tidak ada data FPR yang disajikan; tanpa FPR, klaim itu tidak berdasar. (2) Kesimpulan: KEDUA hal bisa benar sekaligus — pipa aplikan memang bias (grup B yang apply lebih berisiko secara agregat, NPL 8% vs 5%) DAN model menambah ketidakadilan di atasnya (di risiko setara, approval tetap timpang). Bukan 'model lulus' atau 'model bersalah' — melainkan dua sumber ketidakadilan yang berbeda dan butuh mitigasi berbeda. (3) Rekomendasi: hapus/transform fitur proxy + reweighting + threshold review (untuk bias model) DAN perbaiki akses (literasi finansial grup B) untuk bias pipa. Audit yang baik = memisahkan sumber bias, bukan memilih satu vonis. Metrik tanpa investigasi = vonis tanpa sidang.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "OJK dan regulator global semakin mensyaratkan model kredit bebas diskriminasi. Fairness bukan CSR — ia adalah compliance risk yang nyata dengan denda nyata.",
      },
    },
    {
      id: "model-card",
      eyebrow: "Langkah 8 · Dokumentasi",
      title: "Model card: paspor model yang jujur",
      prose: [
        "Audit fairness selesai, metrik dihitung, mitigasi diterapkan — lalu tim lain bertanya: 'model ini sebenarnya apa?' Tanpa jawaban yang terdokumentasi, setiap orang menebak. Model card adalah paspor model: satu dokumen yang menyatakan identitas, tujuan, kemampuan, dan batasan model — ditulis agar auditor, tim produk, dan regulator tidak perlu menginterogasi pembuatnya.",
        "Struktur baku — lima bagian: (1) Detail model — nama, versi, arsitektur, tanggal training, pemilik. (2) Tujuan penggunaan & out-of-scope — untuk apa model dibuat, dan untuk apa ia DILARANG dipakai. (3) Data training — sumber, periode, komposisi per grup. (4) Metrik — keseluruhan DAN per slice/grup. (5) Keterbatasan, risiko, dan tradeoff yang diambil + siapa menyetujuinya.",
        "Contoh terisi — kartu DanaMaju v2.3 (pinjol, training Jan–Jun 2026): metrik keseluruhan — AUC 0,78, akurasi 82%. Metrik per grup — recall grup A 85%, grup B 40%; approval A 50%, B 30%; DI ratio 0,60. Out-of-scope: 'tidak dipakai untuk segmen tanpa riwayat kredit tanpa review manual'. Keterbatasan: 'fitur lama-tinggal berkorelasi dengan grup (proxy), dimonitor bulanan'. Tradeoff: threshold tunggal 0,6 dipertahankan; mitigasi threshold per grup ditunda menunggu review legal — disetujui Kepala Risiko, 2026-07-01.",
        "💡 Intuisi: model card yang baik = yang berani menulis kabar buruknya. Jika semua angka di kartu terlihat bagus, itu bukan kartu — itu brosur. Auditor membaca 'hanya metrik keseluruhan' sebagai sinyal: penulisnya tidak mengukur per grup, atau mengukur dan menyembunyikannya. Kartu yang menulis 'DI 0,60, mitigasi: monitoring bulanan' justru membangun kepercayaan — ketidakpastian yang diakui bisa dikelola, yang disembunyikan tidak.",
        "Kenapa metrik keseluruhan menipu? Karena ia adalah rata-rata tertimbang dari metrik per grup — grup besar menenggelamkan grup kecil:",
      ],
      formula: String.raw`\bar{m} = \sum_{g} w_g \cdot m_g`,
      formulaNote: "\\bar{m} = metrik keseluruhan yang dilaporkan; w_g = bobot grup g — dan untuk RECALL, bobot yang benar adalah pangsa POSITIF AKTUAL (qualified) tiap grup, bukan pangsa populasi: recall keseluruhan = Σ (positif grup g / total positif) × recall_g. Bila proporsi qualified berbeda antar grup, memakai pangsa populasi memberi angka yang salah — contoh 0,8 × 85% + 0,2 × 40% = 76% di sini memakai 0,8/0,2 sebagai pangsa populasi untuk ilustrasi, bukan sebagai rumus yang benar. Terlihat 'lumayan' padahal grup B hancur. Inilah kenapa bagian (4) kartu mewajibkan angka per grup: rata-rata selalu bisa menyembunyikan yang kecil.",
      tasks: [
        { id: "t1", text: "Hitung `appr_a` dan `appr_b`: approval rate per grup" },
        { id: "t2", text: "Hitung `di_ratio` = appr_b / appr_a" },
        { id: "t3", text: "Hitung `rec_a` dan `rec_b`: recall per grup (proporsi aktual=1 yang lolos)" },
        { id: "t4", text: "Cetak ringkasan dua baris untuk kartu model" },
      ],
      expected: "Kartu terisi: approval A=0.67, B=0.17, DI=0.25 (< 0,8 ✗); recall A=1.00, B=0.25. Kabar buruknya tertulis — inilah gunanya kartu: yang terukur bisa dimitigasi.",
      note: {
        title: "🚨 Mitos: 'model card = dokumen marketing berisi metrik terbaik'",
        type: "pitfall",
        body: "Yang benar: kartu yang hanya berisi angka terbaik adalah brosur. Regulator dan auditor membaca KELENGKAPAN sebagai sinyal kejujuran: metrik per grup, keterbatasan, out-of-scope, dan tradeoff yang ditandatangani. Yang disembunyikan dari kartu biasanya yang pertama ditanya saat audit.",
      },
      hints: [
        "approval = proporsi skor >= THR per grup.",
        "recall grup = di antara aktual=1, proporsi skor >= THR.",
        "Cetak dengan f\"{x:.2f}\".",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
data = [
    {"grup": "A", "aktual": 1, "skor": 0.82},
    {"grup": "A", "aktual": 1, "skor": 0.75},
    {"grup": "A", "aktual": 1, "skor": 0.91},
    {"grup": "A", "aktual": 0, "skor": 0.30},
    {"grup": "A", "aktual": 1, "skor": 0.66},
    {"grup": "A", "aktual": 0, "skor": 0.45},
    {"grup": "B", "aktual": 1, "skor": 0.55},
    {"grup": "B", "aktual": 1, "skor": 0.48},
    {"grup": "B", "aktual": 0, "skor": 0.20},
    {"grup": "B", "aktual": 1, "skor": 0.62},
    {"grup": "B", "aktual": 0, "skor": 0.35},
    {"grup": "B", "aktual": 1, "skor": 0.58},
]
THR = 0.6
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: isi kartu model DanaMaju v2.3
appr_a = 
appr_b = 
di_ratio = 
rec_a = 
rec_b = 

print(f"approval_A={appr_a:.2f} approval_B={appr_b:.2f} di_ratio={di_ratio:.2f}")
print(f"recall_A={rec_a:.2f} recall_B={rec_b:.2f}")`,
        lockLines: 16,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
data = [
    {"grup": "A", "aktual": 1, "skor": 0.82},
    {"grup": "A", "aktual": 1, "skor": 0.75},
    {"grup": "A", "aktual": 1, "skor": 0.91},
    {"grup": "A", "aktual": 0, "skor": 0.30},
    {"grup": "A", "aktual": 1, "skor": 0.66},
    {"grup": "A", "aktual": 0, "skor": 0.45},
    {"grup": "B", "aktual": 1, "skor": 0.55},
    {"grup": "B", "aktual": 1, "skor": 0.48},
    {"grup": "B", "aktual": 0, "skor": 0.20},
    {"grup": "B", "aktual": 1, "skor": 0.62},
    {"grup": "B", "aktual": 0, "skor": 0.35},
    {"grup": "B", "aktual": 1, "skor": 0.58},
]
THR = 0.6
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: isi kartu model DanaMaju v2.3
def approval(g):
    grp = [d for d in data if d["grup"] == g]
    return sum(1 for d in grp if d["skor"] >= THR) / len(grp)

def recall(g):
    pos = [d for d in data if d["grup"] == g and d["aktual"] == 1]
    return sum(1 for d in pos if d["skor"] >= THR) / len(pos)

appr_a = approval("A")
appr_b = approval("B")
di_ratio = appr_b / appr_a
rec_a = recall("A")
rec_b = recall("B")

print(f"approval_A={appr_a:.2f} approval_B={appr_b:.2f} di_ratio={di_ratio:.2f}")
print(f"recall_A={rec_a:.2f} recall_B={rec_b:.2f}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`appr_a` = 4/6",
            "name": "appr_a",
            "value": 0.6666666666666666,
            "tol": 1e-09,
            "msg": "Grup A: 4 dari 6 skor >= 0,6.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`di_ratio` = 0,25",
            "name": "di_ratio",
            "value": 0.25,
            "tol": 1e-09,
            "msg": "(1/6)/(4/6) = 0,25 — jauh di bawah 0,8.",
          },
          {
            "kind": "equal",
            "task": "t3",
            "label": "`rec_b` = 0,25",
            "name": "rec_b",
            "value": 0.25,
            "tol": 1e-09,
            "msg": "Grup B: hanya 1 dari 4 yang aktual=1 yang lolos.",
          },
          {
            "kind": "stdout_matches",
            "task": "t4",
            "label": "Baris approval memvonis DI",
            "pattern": "di_ratio=0\\.25",
            "msg": "DI 0,25 < 0,8 — kartu mencatat disparate impact, bukan menyembunyikannya.",
          },
          {
            "kind": "stdout_matches",
            "task": "t4",
            "label": "Baris recall per grup tercetak",
            "pattern": "recall_A=1\\.00.*recall_B=0\\.25",
            "msg": "Recall per grup tertulis eksplisit di kartu.",
          },
        ],
      },
      reference: "Tulis kartu SEBELUM diminta; versikan per rilis agar tren metrik per grup terlacak.",
    },
    {
      id: "privasi-ml",
      eyebrow: "Langkah 9 · Privasi",
      title: "Privasi dalam ML: data yang masuk diam-diam",
      prose: [
        "Model yang adil pun bisa melanggar privasi. PII (data pribadi) masuk ke pipeline tanpa disadari: nama dan alamat jelas, tetapi juga nomor HP yang di-hash — hash BUKAN anonimisasi. Nomor HP punya format yang bisa ditebak, jadi hash-nya bisa dibalik dengan kamus (rainbow table). Prinsip: data yang bisa mengidentifikasi seseorang, langsung atau tidak, tetap PII — walau sudah 'tidak terbaca manusia'.",
        "Risikonya tidak berhenti di data training. Membership inference: penyerang bertanya ke model 'apakah orang X ada di data training?' — model yang overfit menjawab dengan kepercayaan diri berbeda untuk data yang pernah dilihatnya. Model inversion: dari output model, penyerang merekonstruksi fitur input yang sensitif (kasus klasik: wajah dari model pengenalan wajah). Model 'yang hanya berisi bobot' tetap bisa membocorkan.",
        "Mitigasi bertingkat — dari yang termurah: (1) Minimasi data: jangan kumpulkan yang tidak dipakai model — fitur yang tidak ada tidak bisa bocor. (2) Agregasi: pakai statistik kelompok, bukan baris individu. (3) k-anonymity: pastikan setiap kombinasi atribut quasi-identifier (usia+gender+kode pos) muncul minimal k kali — sehingga tidak ada baris yang UNIK dalam dataset. Tetapi 'tidak unik' ≠ 'tidak teridentifikasi': k-anonymity tidak mencegah serangan homogeneity (semua k baris punya nilai sensitif yang sama) atau background knowledge, dan ia BUKAN differential privacy — dua konsep yang berbeda, jangan disamakan sebagai satu 'bukti matematis'. (4) Differential privacy: tambah noise terkalibrasi sehingga output nyaris sama dengan/tanpa satu individu — dikontrol budget epsilon (makin kecil = makin privat). Catatan jujur: DP yang benar butuh implementasi matang (library khusus); klaim 'kami pakai DP' tanpa menyebut epsilon = klaim kosong.",
        "💡 Intuisi: privasi bukan fitur yang ditempel di akhir — ia adalah keputusan arsitektur data. Begitu PII masuk ke 50 tabel turunan dan 3 snapshot training, 'menghapusnya' menjadi operasi forensik. Urutan yang benar: putuskan dulu data apa yang TIDAK boleh ada (minimasi) → lindungi yang tersisa (agregasi/k-anonymity/DP) → catat semuanya di model card bagian data.",
        "Konteks Indonesia: UU Perlindungan Data Pribadi memberi subjek data hak atas datanya dan mewajibkan dasar pemrosesan yang sah serta keamanan data — tanpa mengutip pasal spesifik di sini, prinsip operasionalnya: punya dasar untuk tiap kolom data yang dipakai training, batasi retensi (hapus saat tak diperlukan), dan siapkan mekanisme memenuhi permintaan subjek data (akses, koreksi, hapus, tarik persetujuan). Model yang sudah training dengan data yang persetujuannya ditarik = masalah yang mahal.",
        "Checklist privasi sebelum training: (1) Inventaris kolom — mana PII/quasi-identifier? (2) Dasar pemrosesan tiap kolom tercatat? (3) Ada kolom yang bisa dibuang tanpa menurunkan kualitas? (4) Agregasi/k-anonymity diterapkan di mana? (5) Siapa yang bisa akses data training mentah? (6) Retensi: kapan dihapus? (7) Mekanisme memenuhi permintaan tarik data? Tujuh 'ya' = siap training.",
      ],
      tasks: [
        { id: "t1", text: "Audit satu tabel fitur: tandai kolom PII dan quasi-identifier" },
        { id: "t2", text: "Tulis keputusan minimasi: satu kolom yang dibuang + alasannya" },
        { id: "t3", text: "Tentukan retensi data training dan mekanisme tarik data" },
      ],
      note: {
        title: "🚨 Mitos: 'data sudah di-hash/di-anonimkan, aman dipakai bebas'",
        type: "pitfall",
        body: "Yang benar: hash deterministik dari nomor HP/NIK bisa dibalik dengan kamus karena formatnya bisa ditebak. Anonimisasi yang benar butuh jaminan yang terukur — k-anonymity (tiap kombinasi quasi-identifier muncul ≥k kali) ATAU differential privacy (noise terkalibrasi dengan budget epsilon) — dua jaminan yang BERBEDA dan tidak saling menggantikan: k-anonymity tidak memberi jaminan DP, dan DP tidak menjamin k-anonymity. Jangan menyebut keduanya sebagai satu 'bukti matematis'. Data yang 'anonim' tetapi bisa di-reidentifikasi = tetap data pribadi.",
      },
      reference: "Privasi = keputusan arsitektur: minimasi → lindungi → catat di model card.",
    },
        {
          id: "gap-r7-reweighting",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P6-G1)",
          title: "Reweighting: prosedur mitigasi yang bisa dijalankan",
          prose: [
            "Lesson ini menyatakan tujuan 'menerapkan mitigasi: reweighting' — tetapi tidak pernah menunjukkan prosedurnya: bobot berapa, untuk siapa, dan bagaimana tahu ia bekerja. Lab ini menjalankannya (metode Kamiran–Calders). Data: grup A 800 pelamar (560 lolos, 70%), grup B 200 pelamar (80 lolos, 40%) — DI awal = 40/70 = 0,57, di bawah ambang 0,8. Bobot tiap sel grup × outcome: w = P(grup) × P(outcome) / P(grup, outcome) — bobot yang membuat distribusi training seolah grup dan outcome independen.",
            "Hasilnya: w(A, lolos) = 0,91; w(A, gagal) = 1,20; w(B, lolos) = 1,60; w(B, gagal) = 0,60. Artinya: tiap pelamar B yang lolos dihitung 1,6× (kelompok yang kurang terwakili dinaikkan), tiap pelamar B yang gagal dihitung 0,6×. Setelah pembobotan, approval rate tertimbang A dan B sama-sama 64,0% → DI baru = 1,00. Tiga catatan kejujuran. Satu: reweighting memperbaiki DISTRIBUSI training, bukan label yang bias — bila label historisnya sendiri salah (B yang layak ditolak karena label salah), bobot tidak memperbaikinya. Dua: awasi bobot yang meledak — sel dengan sedikit contoh bisa meminta bobot 10×+; batasi (cap) bobot dan periksa variansnya. Tiga: validasi di data held-out — mitigasi yang menaikkan DI sambil meruntuhkan akurasi adalah mitigasi yang gagal.",
          ],
          formula: String.raw`w(a, y) = \frac{P(A=a)\,P(Y=y)}{P(A=a, Y=y)} \qquad \text{DI} = \frac{\text{rate}_B}{\text{rate}_A}`,
          formulaNote: "A 800 (560 lolos), B 200 (80 lolos): bobot 0,91 / 1,20 / 1,60 / 0,60; rate tertimbang 64,0% / 64,0%; DI 0,57 → 1,00.",
          tasks: [
            { id: "t1", text: "Hitung 4 bobot: `w_a_plus`, `w_a_min`, `w_b_plus`, `w_b_min`" },
            { id: "t2", text: "Hitung approval rate tertimbang `rate_a`, `rate_b`, dan `di_baru`" },
          ],
          expected: "w_a_plus=0.91 w_a_min=1.2 w_b_plus=1.6 w_b_min=0.6 rate_a=64.0 rate_b=64.0 di_baru=1.0",
          hints: [
            "P(A) = 0,8; P(B) = 0,2; P(lolos) = 0,64; P(gagal) = 0,36; P(A, lolos) = 560/1000 = 0,56.",
            "Rate tertimbang = (jumlah lolos × bobot) / (jumlah lolos × bobot + jumlah gagal × bobot).",
          ],
          code: {
            starter: `# Pelamar: A 800 orang (560 lolos), B 200 orang (80 lolos)\n# Target: bobot Kamiran-Calders w = P(A=a)P(Y=y) / P(A=a, Y=y)\na_total, a_lolos = 800, 560\nb_total, b_lolos = 200, 80\n\n# TULIS KODEMU: 4 bobot + approval rate tertimbang per grup + DI baru\nw_a_plus =\nw_a_min =\nw_b_plus =\nw_b_min =\nrate_a =\nrate_b =\ndi_baru =\n\nprint(f"w_a_plus={w_a_plus} w_a_min={w_a_min} w_b_plus={w_b_plus} w_b_min={w_b_min} rate_a={rate_a} rate_b={rate_b} di_baru={di_baru}")`,
            lockLines: 6,
            solution: `# Pelamar: A 800 orang (560 lolos), B 200 orang (80 lolos)\n# Target: bobot Kamiran-Calders w = P(A=a)P(Y=y) / P(A=a, Y=y)\na_total, a_lolos = 800, 560\nb_total, b_lolos = 200, 80\n\n# TULIS KODEMU: 4 bobot + approval rate tertimbang per grup + DI baru\np_a, p_b = a_total / 1000, b_total / 1000\np_plus = (a_lolos + b_lolos) / 1000\np_min = 1 - p_plus\nw_a_plus = round(p_a * p_plus / (a_lolos / 1000), 2)\nw_a_min = round(p_a * p_min / ((a_total - a_lolos) / 1000), 2)\nw_b_plus = round(p_b * p_plus / (b_lolos / 1000), 2)\nw_b_min = round(p_b * p_min / ((b_total - b_lolos) / 1000), 2)\nwa_plus = p_a * p_plus / (a_lolos / 1000)\nwa_min = p_a * p_min / ((a_total - a_lolos) / 1000)\nwb_plus = p_b * p_plus / (b_lolos / 1000)\nwb_min = p_b * p_min / ((b_total - b_lolos) / 1000)\nrate_a = round(a_lolos * wa_plus / (a_lolos * wa_plus + (a_total - a_lolos) * wa_min) * 100, 1)\nrate_b = round(b_lolos * wb_plus / (b_lolos * wb_plus + (b_total - b_lolos) * wb_min) * 100, 1)\ndi_baru = round(rate_b / rate_a, 2)\n\nprint(f"w_a_plus={w_a_plus} w_a_min={w_a_min} w_b_plus={w_b_plus} w_b_min={w_b_min} rate_a={rate_a} rate_b={rate_b} di_baru={di_baru}")`,
            checks: [
              { kind: "equal", task: "t1", name: "w_a_plus", value: 0.91, tol: 0.02, label: "`w_a_plus` = 0,91", msg: "0,8×0,64/0,56 = 0,91." },
              { kind: "equal", task: "t1", name: "w_a_min", value: 1.2, tol: 0.02, label: "`w_a_min` = 1,20", msg: "0,8×0,36/0,24 = 1,20." },
              { kind: "equal", task: "t1", name: "w_b_plus", value: 1.6, tol: 0.02, label: "`w_b_plus` = 1,60", msg: "0,2×0,64/0,08 = 1,60 — pelamar B yang lolos dinaikkan." },
              { kind: "equal", task: "t1", name: "w_b_min", value: 0.6, tol: 0.02, label: "`w_b_min` = 0,60", msg: "0,2×0,36/0,12 = 0,60." },
              { kind: "equal", task: "t2", name: "rate_a", value: 64.0, tol: 0.1, label: "`rate_a` = 64,0%", msg: "512/(512+288) = 64%." },
              { kind: "equal", task: "t2", name: "rate_b", value: 64.0, tol: 0.1, label: "`rate_b` = 64,0%", msg: "128/(128+72) = 64%." },
              { kind: "equal", task: "t2", name: "di_baru", value: 1.0, tol: 0.01, label: "`di_baru` = 1,00", msg: "64/64 = 1,00 — dari DI awal 0,57." },
              { kind: "stdout_matches", task: "t2", pattern: "w_a_plus=0\\.91\\s+w_a_min=1\\.2\\s+w_b_plus=1\\.6\\s+w_b_min=0\\.6\\s+rate_a=64\\.0\\s+rate_b=64\\.0\\s+di_baru=1\\.0", label: "`print` menampilkan ketujuhnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Setelah reweighting, approval A dan B sama-sama 64%. Berapa DI barunya — dan apa yang TIDAK diperbaiki reweighting?",
              options: [
                { text: "DI 1,0 — tetapi label historis yang bias tidak diperbaiki bobot", why: "Tepat: reweighting menyamakan distribusi training (DI 0,57 → 1,00); bila labelnya sendiri salah, bobot tidak memperbaikinya.", correct: true },
                { text: "DI 0,57 — reweighting tidak mengubah apa pun", why: "Salah: rate tertimbang keduanya 64% — DI barunya 1,00." },
                { text: "DI 1,0 — dan semua bias hilang, termasuk label yang salah", why: "Salah: bobot hanya mengubah seberapa sering tiap contoh dihitung — label yang salah tetap salah." },
                { text: "DI 0,8 — tepat di ambang", why: "Salah: 64/64 = 1,00, bukan 0,8." },
              ],
            },
          ],
          reference: "Reweighting Kamiran-Calders: w = P(grup)×P(outcome)/P(grup, outcome); DI 0,57 → 1,00 di sini; perbaiki distribusi, bukan label; cap bobot; validasi held-out.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi fairness: ukur (3 metrik) → investigasi (proxy? loop? pipa?) → mitigasi (proporsional) → dokumentasi (model card) → monitor (tren DI). Lima langkah, bukan satu. Dan satu prinsip: “model yang adil = bukan yang buta warna, melainkan yang DIUKUR keadilannya”. Buta (“kami tidak pakai data SARA”) = mengabaikan proxy. Keadilan = diukur, bukan diasumsikan.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Akurasi 82% vs 81% antar grup, tetapi recall 85% vs 40%. Kesimpulan?",
          options: [
            {
              text: "Model adil, akurasi sama",
              why: "Akurasi menyembunyikan distribusi kesalahan yang timpang.",
            },
            {
              text: "Tidak adil — grup B menanggung false negative 4x lebih sering (per kandidat qualified)",
              why: "Tepat: kandidat qualified grup B 4x lebih mungkin terlewat (FNR 60% vs 15%).",
              correct: true,
            },
            {
              text: "Butuh lebih banyak data",
              why: "Masalahnya distribusi kesalahan, bukan volume data.",
            },
            {
              text: "Akurasi harus 100%",
              why: "Tidak realistis dan tidak menyelesaikan ketimpangan.",
            },
          ],
        },
        {
          q: "DI ratio 0,60. Artinya?",
          options: [
            {
              text: "Lolos aturan 4/5",
              why: "0,60 < 0,8 — tidak lolos.",
            },
            {
              text: "Disparate impact — investigasi wajib",
              why: "Tepat: di bawah 0,8 = lampu merah.",
              correct: true,
            },
            {
              text: "Tidak ada masalah",
              why: "Kesenjangan 20 poin antar grup adalah masalah.",
            },
            {
              text: "Model harus dihapus",
              why: "Investigasi dan mitigasi dulu; penghapusan adalah opsi terakhir.",
            },
          ],
        },
        {
          q: "'Kami tidak memakai atribut sensitif sebagai fitur.' Apakah cukup?",
          options: [
            {
              text: "Ya, itu menjamin keadilan",
              why: "Proxy merekonstruksi atribut sensitif — buta kolom ≠ adil.",
            },
            {
              text: "Tidak — proxy bisa membawa info yang sama; ukur outcome per grup",
              why: "Tepat: keadilan dibuktikan dengan pengukuran, bukan niat.",
              correct: true,
            },
            {
              text: "Ya jika akurasinya tinggi",
              why: "Akurasi tinggi tidak menjamin keadilan per grup.",
            },
            {
              text: "Tidak perlu dipikirkan",
              why: "Mengabaikan = risiko hukum dan reputasi.",
            },
          ],
        },
        {
          q: "Threshold tunggal 0,6 → recall A 66%, B 21%. Mitigasi post-processing?",
          options: [
            {
              text: "Naikkan threshold global",
              why: "Menaikkan threshold menurunkan recall kedua grup — gap tetap.",
            },
            {
              text: "Sesuaikan threshold per grup (dengan review legal)",
              why: "Tepat: thr B 0,45 → recall 62% ≈ A. Catatan: konsultasikan legal.",
              correct: true,
            },
            {
              text: "Hapus grup B dari data",
              why: "Menghapus masalah dari laporan, bukan menyelesaikannya.",
            },
            {
              text: "Acak threshold",
              why: "Tidak sistematis dan tidak bisa dipertanggungjawabkan.",
            },
          ],
        },
        {
          q: "Kapan fairness review WAJIB?",
          options: [
            {
              text: "Semua model tanpa kecuali dengan audit penuh",
              why: "Tingkat audit mengikuti dampak; model internal ringan tidak butuh review legal.",
            },
            {
              text: "Model yang menentukan akses ke peluang/sumber daya (hiring, kredit)",
              why: "Tepat: taruhannya hak manusia dan risiko hukum.",
              correct: true,
            },
            {
              text: "Tidak pernah, terlalu mahal",
              why: "Biaya skandal bias jauh lebih mahal dari audit.",
            },
            {
              text: "Hanya jika ada komplain",
              why: "Reaktif = menunggu kerusakan terjadi.",
            },
          ],
        },
      ],
      summary: [
        "Akurasi global menyembunyikan ketidakadilan — ukur per grup.",
        "Tiga lensa: demographic parity, equal opportunity, disparate impact (4/5).",
        "Ketiganya tak bisa dipenuhi bersamaan — pilih definisi secara sadar.",
        "Sumber bias: data historis, label, proxy, feedback loop.",
        "Mitigasi: pre/in/post-processing; threshold per grup butuh review legal.",
        "Fairness review wajib untuk model yang menentukan nasib manusia.",
      ],
      next: { label: "MLE13 — LLM dalam Sistem ML", href: "/v2/learn/mle13-llm-ml" },
    },
  ],
};
