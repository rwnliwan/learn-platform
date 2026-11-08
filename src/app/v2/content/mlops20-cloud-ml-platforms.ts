import type { V2Lesson } from "../lib/types";

// Skor terbobot dari lab: SageMaker 3.8, Vertex AI 3.5, Azure ML 3.6 (skala 1-5).
const SKOR_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Skor terbobot tiga platform cloud ML">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<line x1="40" y1="200" x2="520" y2="200" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="104" y="48" width="72" height="152" rx="4" fill="var(--c1)" fill-opacity="0.85"/><text x="140" y="40" fill="var(--text)">3,8</text>
<rect x="244" y="60" width="72" height="140" rx="4" fill="var(--c2)" fill-opacity="0.7"/><text x="280" y="52" fill="var(--text)">3,5</text>
<rect x="384" y="56" width="72" height="144" rx="4" fill="var(--c3)" fill-opacity="0.7"/><text x="420" y="48" fill="var(--text)">3,6</text>
<text x="140" y="220" fill="var(--text)">SageMaker</text><text x="280" y="220" fill="var(--text)">Vertex AI</text><text x="420" y="220" fill="var(--text)">Azure ML</text>
</g>
<text x="280" y="20" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Skor terbobot (bobot: tim 0,3 · biaya 0,3 · fitur 0,2 · lock-in 0,2)</text>
</svg>`;

export const mlops20: V2Lesson = {
  slug: "mlops20-cloud-ml-platforms",
  track: "MLOps",
  module: "Serving & Skala",
  title: "MLOps20 — Managed Cloud ML: SageMaker, Vertex AI, Azure ML",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Parkir mobil yang dipakai 2 jam sehari",
      prose: [
        "Mei 2026. ArusDana, fintech dengan 6 data scientist, memilih platform ML. CTO memutuskan cepat: `Kita kan sudah di AWS — pakai SageMaker saja, semua orang juga begitu.` Tiga bulan kemudian tagihan datang: endpoint real-time berjalan 24/7 seharga $648/bulan — untuk model fraud yang hanya dipanggil saat jam operasional, 2 jam per hari. Utilisasi GPU: 8%.",
        "Ironisnya, workload mereka 80% training batch mingguan + 20% serving ringan. SageMaker Training + endpoint serverless (atau bahkan EC2 + Docker sederhana) akan memangkas tagihan ke ~$90/bulan. Keputusan `semua orang juga begitu` menghabiskan $558/bulan = Rp9 jutaan — untuk parkir mobil yang dipakai 2 jam sehari.",
        "Twist-nya: masalahnya bukan SageMaker-nya. SageMaker adalah platform yang bagus — untuk workload yang cocok. Masalahnya adalah KEPUTUSANNYA: tanpa matriks kriteria, tanpa hitungan biaya per pola pakai, tanpa mempertimbangkan lock-in. Lesson ini memberimu ketiganya: peta tiga platform, cara memutuskan build-vs-buy, dan aritmetika biaya yang jujur.",
      ],
      tasks: [],
      reference: "Platform yang bagus untuk workload yang salah = tagihan yang benar untuk keputusan yang salah.",
    },
    {
      id: "peta-platform",
      eyebrow: "Langkah 2 · Konsep",
      title: "Peta tiga toko: Si Tiga Raksasa",
      prose: [
        "Tiga platform managed ML punya anatomi yang sama — hanya beda nama tokonya. Empat komponen yang selalu ada: (1) TRAINING — job terkelola (SageMaker Training / Vertex Training / Azure ML jobs): kirim kode + data, terima model, tanpa urus cluster; (2) REGISTRY — model versioning + lineage (Model Registry / Model Garden / Azure Model Registry); (3) ENDPOINT — serving real-time (SageMaker Endpoints / Vertex Endpoints / Azure Managed Online Endpoints); (4) PIPELINES — orkestrasi (SageMaker Pipelines / Vertex Pipelines / Azure ML Pipelines).",
        "Perbedaan yang benar-benar penting bukan fitur — ketiganya cukup lengkap — melainkan: (a) EKOSISTEM TIM-MU — tim sudah di AWS + Terraform? SageMaker menyatu mulus. Tim Google-native (BigQuery, GKE)? Vertex. Korporat Microsoft (Active Directory, Power BI)? Azure ML; (b) MODEL HARGA — per detik training vs per jam endpoint vs serverless; (c) KEDALAMAN ML KHUSUS — Vertex kuat di AutoML/GenAI (terhubung ke model Google), SageMaker kuat di pilihan instance, Azure kuat di integrasi enterprise.",
        "💡 Intuisi: memilih platform ML seperti memilih bank — fitur intinya mirip semua (tabungan, transfer, kartu). Yang membedakan: kamu sudah punya rekening di mana, biaya adminnya berapa, dan seberapa sakit pindahnya nanti.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `platform terbaik = yang fiturnya paling banyak`",
        type: "pitfall",
        body: "Fitur terbanyak tidak memenangkan apa-apa bila timmu tidak memakainya. ArusDana membayar fitur real-time inference canggih untuk model yang dipanggil 2 jam sehari. Kriteria yang benar: kecocokan workload (batch vs real-time), kesiapan tim (skill + tooling existing), dan total biaya per POLA PAKAI-mu — bukan daftar fitur brosur.",
      },
      reference: "Bandingkan: ekosistem tim + harga per pola pakai + kedalaman ML khusus. Bukan jumlah fitur.",
    },
    {
      id: "build-vs-buy",
      eyebrow: "Langkah 3 · Konsep",
      title: "Build vs buy: Si Tukang vs Si Penyewa",
      prose: [
        "Si Tukang (build sendiri: KServe + Kubeflow + MLflow di cluster-mu) memberi kontrol penuh dan biaya infra murni — tapi kamu membayar dengan GAJI: butuh 2–4 platform engineer yang paham Kubernetes, dan 3–6 bulan sebelum stabil. Si Penyewa (managed) memberi kecepatan (endpoint jalan hari ini) — tapi kamu membayar MARJIN: 30–100% lebih mahal per jam komputasi dibanding bare metal, plus API yang mengikatmu.",
        "Aturan keputusannya kuantitatif, bukan ideologis. Hitung: (biaya managed per bulan − biaya self-hosted per bulan) vs (gaji engineer platform × bulan yang dihemat). Bila selisihnya positif dan timmu <10 orang, sewa dulu — waktu ke pasar mengalahkan kebanggaan teknis. Bila tagihan managed > Rp500 jt/bulan dan stabil, bangun tim platform mulai terbayar.",
        "Jalan tengah yang populer 2026: managed untuk TRAINING (sporadis, butuh GPU besar sesekali) + self-hosted/KServe untuk SERVING (kontinu, pola trafik diketahui). Training = sewa mobil saat butuh; serving = beli mobil saat dipakai tiap hari.",
        "💡 Intuisi: `build` bukan keputusan teknis — ia keputusan FINANSIAL. Yang dihitung bukan `mana yang lebih keren`, melainkan `kapan sewa lebih mahal dari gaji tukang`. Lab Langkah 7 memberimu kalkulatornya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `build sendiri selalu lebih murah`",
        type: "pitfall",
        body: "Lebih murah di TAGIHAN CLOUD, belum tentu lebih murah TOTAL. Cluster self-hosted butuh engineer yang on-call, upgrade Kubernetes tiap kuartal, dan debugging jam 2 pagi saat node mati. Banyak tim menghitung `hemat $2.000/bulan` sambil lupa `gaji 2 engineer × Rp40 jt`. Hitung total cost of ownership — atau sewalah dulu sampai tagihannya cukup besar untuk membenarkan tukang.",
      },
      reference: "Sewa bila: tim kecil + butuh cepat. Bangun bila: tagihan managed > ~Rp500 jt/bln dan stabil.",
    },
    {
      id: "biaya-lockin",
      eyebrow: "Langkah 4 · Konsep",
      title: "Biaya & lock-in: Si Kontrak Jangka Panjang",
      prose: [
        "Dua biaya yang sering dilupakan. Pertama, BIAYA TRANSFER DATA (egress): melatih di satu cloud, serving di cloud lain, atau data di on-prem — tiap GB yang keluar kena tarif. Arsitektur multi-cloud yang `fleksibel` bisa berarti tagihan egress yang tidak fleksibel sama sekali. Kedua, BIAYA IDLE: endpoint 24/7 untuk trafik 2 jam/hari (cerita ArusDana), GPU training yang lupa di-terminate, feature store yang di-query tiap menit oleh dashboard yang dibuka tiap minggu.",
        "Lock-in datang dalam tiga lapis. Lapis 1 — API: kode yang memanggil SDK khusus vendor (boto3 SageMaker vs google-cloud-aiplatform). Lapis 2 — FORMAT: pipeline/model registry yang hanya jalan di ekosistem itu. Lapis 3 — DATA: data training + feature store yang mahal dipindahkan. Obatnya: abstraksi tipis (bungkus SDK dalam interface internal), format terbuka (ONNX, MLflow model format), dan keputusan sadar — lock-in bukan dosa, yang dosa = lock-in yang TIDAK DIHITUNG.",
        "Rumus biaya yang dipakai lab: T = p × h, dengan T = total biaya per bulan, p = harga per jam, h = jam pemakaian. Sederhana — tapi 90% kesalahan biaya datang dari h yang salah (asumsi 24/7 untuk pemakaian 2 jam/hari).",
      ],
      formula: String.raw`T = p \times h \quad\text{dan}\quad S = \sum_i w_i \cdot s_i`,
      formulaNote: "T = total biaya per bulan ($); p = harga per jam ($/jam); h = jam pemakaian per bulan — inilah yang paling sering salah diasumsikan (24/7 vs pemakaian riil). S = skor terbobot keputusan (tanpa satuan); w_i = bobot kriteria ke-i (total = 1); s_i = skor platform pada kriteria itu (1–5). Contoh lab: T_247 = 0,90 × 720 = $648; T_seperlunya = 1,50 × 60 = $90. S_SageMaker = 0,3×5 + 0,3×3 + 0,2×5 + 0,2×2 = 3,8.",
      tasks: [],
      note: {
        title: "🚨 Mitos: `multi-cloud = bebas lock-in`",
        type: "pitfall",
        body: "Multi-cloud tanpa disiplin = lock-in DI MANA-MANA + tagihan egress di tengahnya. Bebas lock-in yang nyata datang dari abstraksi (interface internal, format terbuka), bukan dari menyebar ke banyak vendor. Dan setiap abstraksi ada harganya: kode tambahan yang harus dirawat. Pilih SATU cloud primer dengan sadar, abstraksikan yang murah, terima lock-in yang sudah dihitung.",
      },
      reference: "T = p × h (h = jam pemakaian RIIL). Lock-in 3 lapis: API, format, data — abstraksikan yang murah.",
    },
    {
      id: "migrasi",
      eyebrow: "Langkah 5 · Konsep",
      title: "Pola migrasi: Si Jembatan, bukan Si Terjun Bebas",
      prose: [
        "Pindah platform bukan peristiwa — ia PROYEK. Si Jembatan membangunnya dalam tiga fase. Fase 1 — SHADOW: workload baru jalan di platform baru, yang lama tetap jalan; bandingkan biaya + kualitas 1 bulan. Fase 2 — STRANGLER: pindahkan satu workload tiap sprint, mulai dari yang paling tidak kritis; setiap pindahan = satu rollback plan. Fase 3 — DECOMMISSION: matikan yang lama HANYA setelah 2 siklus billing penuh tanpa insiden.",
        "Dua aturan yang menyelamatkan karier. Aturan DATA DULU: pindahkan data + pipeline datanya sebelum model — model tanpa data yang benar = patung. Aturan PARALEL SINGKAT: jangan jalankan dua platform paralel lebih dari 3 bulan — biaya ganda + kebingungan tim memakan semua penghematan migrasi.",
        "Kapan TIDAK migrasi: tagihan < Rp100 jt/bulan dan tim bahagia. Migrasi adalah proyek 3–6 bulan dengan risiko nyata; `tapi kan di sana lebih murah $200` bukan business case — itu hobi.",
        "💡 Intuisi: migrasi platform seperti pindah rumah saat masih tinggal di rumah lama — sewa ganda sementara itu wajar, tapi jangan sewa ganda SELAMANYA. Strangler memastikan kamu pindah per kamar, bukan melompat dari atap.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `migrasi = lift-and-shift kode`",
        type: "pitfall",
        body: "Kode training mungkin 80% sama, tapi IAM, networking (VPC), secret management, monitoring, dan CI/CD semuanya beda. Lift-and-shift yang mengabaikan `tulangan` ini menghasilkan sistem yang `jalan` tapi tidak terpantau, tidak aman, dan tidak bisa di-debug. Anggaran migrasi yang realistis: 40% kode, 60% tulangan.",
      },
      reference: "Shadow → strangler per workload → decommission setelah 2 siklus billing. Data dulu, paralel <3 bulan.",
    },
    {
      id: "lab-keputusan",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: matriks keputusan + aritmetika parkir",
      prose: [
        "SIMULASI — kamu adalah arsitek ArusDana. Data: bobot kriteria [tim AWS siap 0,3 · biaya endpoint 0,3 · fitur MLOps 0,2 · lock-in rendah 0,2] dan skor 1–5 tiap platform. Tugasmu: hitung skor terbobot tiap platform dan tentukan pemenang, lalu hitung biaya endpoint 24/7 vs bayar-seperlunya (2 jam/hari).",
        "Cara membaca output: baris pertama menampilkan skor terbobot dan pemenang; baris kedua membandingkan dua pola bayar dan penghematannya. Interpretasi: SageMaker menang 3,8 (tim sudah AWS + fitur) TETAPI pola 24/7 boros $558/bulan — keputusan platform dan pola bayar adalah DUA keputusan berbeda.",
        "Coba eksplorasi: ubah bobot biaya jadi 0,5 (ambil dari bobot tim) — apakah pemenang berubah? (Petunjuk: Vertex/Azure lebih murah endpoint.) Ubah `jam_pakai` jadi 720 (pelayanan 24 jam betulan) — kapan 24/7 menjadi pilihan yang benar? Itulah `kapan asumsi h mengubah segalanya` — simpan untuk Peta Keputusan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor terbobot tiap platform: jumlah(bobot × skor); tentukan `pemenang` (skor tertinggi)" },
        { id: "t2", text: "Hitung `biaya_247` (harga_jam × jam_247) dan `biaya_seperlunya` (harga_serverless × jam_pakai)" },
        { id: "t3", text: "Hitung `hemat` (biaya_247 − biaya_seperlunya), lalu cocokkan output" },
      ],
      expected: "skor: SageMaker=3.8 Vertex=3.5 Azure=3.6 -> SageMaker\n24/7=$648.00/bln vs seperlunya=$90.00/bln hemat=$558.00",
      hints: [
        "total = sum(b*x for b, x in zip(bobot, skor_platform)).",
        "pemenang = max(hasil, key=hasil.get) — kunci dengan nilai terbesar.",
        "Format desimal: :.1f untuk skor, :.2f untuk dolar.",
      ],
      code: {
        starter: `# DATA KEPUTUSAN (jangan ubah)
bobot = [0.3, 0.3, 0.2, 0.2]  # [tim AWS siap, biaya endpoint, fitur MLOps, lock-in rendah]
skor = {
    "SageMaker": [5, 3, 5, 2],
    "Vertex AI": [3, 4, 4, 3],
    "Azure ML": [4, 4, 3, 3],
}
harga_jam = 0.90        # $ per jam endpoint managed
jam_247 = 720           # jam per bulan bila 24/7
harga_serverless = 1.50 # $ per jam bila bayar per pakai
jam_pakai = 60          # 2 jam/hari x 30 hari

# TULIS KODEMU
def total(s):
    return ...

hasil = ...
pemenang = ...

s_sage = ...
s_vertex = ...
s_azure = ...
biaya_247 = ...
biaya_seperlunya = ...
hemat = ...

# CETAK (jangan ubah formatnya)
print(f"skor: SageMaker={s_sage:.1f} Vertex={s_vertex:.1f} Azure={s_azure:.1f} -> {pemenang}")
print(f"24/7=\${biaya_247:.2f}/bln vs seperlunya=\${biaya_seperlunya:.2f}/bln hemat=\${hemat:.2f}")`,
        lockLines: 12,
        solution: `# DATA KEPUTUSAN (jangan ubah)
bobot = [0.3, 0.3, 0.2, 0.2]  # [tim AWS siap, biaya endpoint, fitur MLOps, lock-in rendah]
skor = {
    "SageMaker": [5, 3, 5, 2],
    "Vertex AI": [3, 4, 4, 3],
    "Azure ML": [4, 4, 3, 3],
}
harga_jam = 0.90        # $ per jam endpoint managed
jam_247 = 720           # jam per bulan bila 24/7
harga_serverless = 1.50 # $ per jam bila bayar per pakai
jam_pakai = 60          # 2 jam/hari x 30 hari

# TULIS KODEMU
def total(s):
    return sum(b * x for b, x in zip(bobot, s))

hasil = {k: total(v) for k, v in skor.items()}
pemenang = max(hasil, key=hasil.get)

s_sage = hasil["SageMaker"]
s_vertex = hasil["Vertex AI"]
s_azure = hasil["Azure ML"]
biaya_247 = harga_jam * jam_247
biaya_seperlunya = harga_serverless * jam_pakai
hemat = biaya_247 - biaya_seperlunya

# CETAK (jangan ubah formatnya)
print(f"skor: SageMaker={s_sage:.1f} Vertex={s_vertex:.1f} Azure={s_azure:.1f} -> {pemenang}")
print(f"24/7=\${biaya_247:.2f}/bln vs seperlunya=\${biaya_seperlunya:.2f}/bln hemat=\${hemat:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", label: "skor SageMaker", name: "s_sage", value: 3.8, tol: 0.01, msg: "0,3×5 + 0,3×3 + 0,2×5 + 0,2×2 = 3,8." },
          { kind: "equal", task: "t1", label: "skor Vertex AI", name: "s_vertex", value: 3.5, tol: 0.01, msg: "0,3×3 + 0,3×4 + 0,2×4 + 0,2×3 = 3,5." },
          { kind: "equal", task: "t1", label: "skor Azure ML", name: "s_azure", value: 3.6, tol: 0.01, msg: "0,3×4 + 0,3×4 + 0,2×3 + 0,2×3 = 3,6." },
          { kind: "equal", task: "t2", label: "biaya 24/7", name: "biaya_247", value: 648.0, tol: 0.01, msg: "0,90 × 720 = $648." },
          { kind: "equal", task: "t3", label: "penghematan", name: "hemat", value: 558.0, tol: 0.01, msg: "648 − 90 = $558/bulan." },
          { kind: "stdout_matches", task: "t1", label: "pemenang di stdout", msg: "Cetak -> SageMaker.", pattern: "-> SageMaker" },
          { kind: "stdout_matches", task: "t3", label: "hemat di stdout", msg: "Cetak hemat=$558.00.", pattern: "hemat=\\$558\\.00" },
        ],
      },
      figure: {
        svg: SKOR_SVG,
        alt: "Skor terbobot tiga platform cloud ML: SageMaker 3,8, Vertex AI 3,5, Azure ML 3,6.",
        caption: "Skor terbobot tiga platform. SageMaker menang tipis karena bobot `tim AWS siap` — ubah bobotnya di lab dan lihat pemenangnya bergeser.",
      },
      reference: "S = Σ w·s: SageMaker 3,8 menang. T = p×h: 24/7 = $648 vs seperlunya $90 — hemat $558/bln.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Tiga jebakan memilih platform",
      prose: [
        "JEBAKAN 1 — MEMILIH KARENA HYPE DAN VENDOR LUNCH. `Semua orang pakai X` bukan kriteria — itu peer pressure dengan slide deck. ArusDana memilih SageMaker karena `semua orang juga begitu`, bukan karena matriks. Obatnya: matriks berbobot dengan bobot JUJUR (langkah 6) diisi SEBELUM demo vendor, bukan sesudah. Bila pemenangnya berubah saat kamu jujur soal bobot, keputusan awalmulah yang salah.",
        "JEBAKAN 2 — MENGABAIKAN EGRESS DAN DATA RESIDENCY. Data 50 TB di on-prem + training di cloud = tagihan transfer yang bisa melebihi biaya trainingnya. Dan untuk bank/asuransi Indonesia: data nasabah tidak boleh keluar region — platform tanpa region Indonesia = diskusi selesai sebelum dimulai. Selalu tanyakan DUA hal sebelum tanda tangan: berapa egress per bulan, dan di region mana dataku berhenti.",
        "JEBAKAN 3 — KONTRAK PANJANG TANPA EXIT CLAUSE. Diskon 30% untuk komitmen 3 tahun terdengar cerdas — sampai workload berubah (mini-case BankNusa: denda implisit $240.000). Aturannya: jangan mengunci LEBIH LAMA dari horizon prediksimu yang jujur. Bila kamu tidak tahu workload 3 tahun ke depan (hampir selalu), kontrak 1 tahun + opsi perpanjang > kontrak 3 tahun dengan diskon.",
        "Ketiga jebakan punya akar yang sama: memutuskan dengan PERASAAN (hype, takut ketinggalan, tergiur diskon) bukan dengan ANGKA (matriks, T = p × h, skenario). Platform adalah keputusan finansial terbesar kedua setelah hiring — perlakukan seperti itu.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `keputusan platform = keputusan teknis`",
        type: "pitfall",
        body: "Tim yang memutuskan platform di ruang arsitektur tanpa finance di meja mengulangi ArusDana: teknisnya benar, ekonominya salah. Keputusan platform = 30% teknis + 70% ekonomi (biaya, lock-in, risiko). Undang finance ke rapat pemilihan platform — mereka menanyakan `berapa bila workload turun setengah?` yang tidak terpikir oleh engineer.",
      },
      reference: "Hype → matriks jujur. Egress + residency → tanyakan dulu. Kontrak panjang → jangan kunci melebihi horizon prediksimu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: sewa, beli, atau campur?",
      prose: [
        "SKENARIO 1 — Startup 6 DS, workload batch mingguan + serving 2 jam/hari (ArusDana). KEPUTUSAN: SEWA + POLA BAYAR CERDAS. Managed training + endpoint serverless/bayar-per-pakai. Alasannya: tagihan kecil, tim fokus ke model — bukan ke cluster. Hemat $558/bulan dari lab = gaji setengah engineer.",
        "SKENARIO 2 — Scale-up 30 DS, model dipakai 24/7 oleh jutaan user, tagihan managed > Rp500 jt/bulan. KEPUTUSAN: BANGUN tim platform (KServe di cluster sendiri). Alasannya: pada skala ini marjin managed > gaji 2–3 platform engineer. Mulai dari serving dulu (pola trafik diketahui), training menyusul.",
        "SKENARIO 3 — Korporat Microsoft (AD, Power BI, Azure credits). KEPUTUSAN: AZURE ML walau skor mentah kalah. Alasannya: bobot `ekosistem` di dunia nyata bukan 0,3 — ia 0,5: SSO, compliance, dan credits yang sudah dibayar. Matriks lab harus diisi dengan bobot JUJUR, bukan bobot netral.",
        "SKENARIO 4 — Riset/eksperimen berat, butuh GPU eksotis (H100) yang langka di managed. KEPUTUSAN: CAMPUR — training di bare-metal/spot + registry managed. Alasannya: managed sering kehabisan GPU langka atau mahal 3x; spot/bare-metal untuk training + managed untuk serving = yang terbaik dari dua dunia.",
        "ATURAN PRAKTIS 10 DETIK: (1) Tulis 4 kriteria + bobot JUJUR (termasuk ekosistem). (2) Hitung T = p × h dengan h = pemakaian RIIL, bukan 24/7. (3) Tagihan < Rp100 jt/bln → jangan migrasi demi $200. (4) Putuskan platform dan pola bayar sebagai DUA keputusan terpisah.",
      ],
      tasks: [
      ],
      reference: "Sewa bila kecil/cepat; bangun bila >Rp500 jt/bln; campur untuk GPU eksotis. Bobot matriks harus jujur.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: BankNusa dan kontrak 3 tahun",
      prose: [
        "BankNusa (BUMN, 40 data scientist) ditawari kontrak 3 tahun platform managed dengan diskon 30%: $20.000/bulan (dari $28.500). Data: (a) workload 70% batch nightly + 30% serving jam kerja; (b) tim infra ada 5 orang yang paham Kubernetes; (c) regulasi: data nasabah TIDAK boleh keluar dari region Indonesia; (d) proyeksi: workload naik 2x dalam 18 bulan; (e) biaya self-hosted estimasi: $9.000/bulan infra + sudah ada tim.",
        "Pertanyaan 1 — Keputusan: dengan kerangka lesson ini, apakah kontrak 3 tahun layak diambil? (Petunjuk: hitung dulu T riil, lalu uji terhadap 3 lapis lock-in.) Pertanyaan 2 — Hitungan: berapa total 3 tahun untuk kontrak ($20.000/bln) vs self-hosted ($9.000/bln)? Berapa `denda implisit` bila workload ternyata turun 50% di tahun ke-2? Pertanyaan 3 — Negosiasi: sebagai arsitek, apa 3 klausul yang kamu minta sebelum tanda tangan?",
        "Pembahasan — P1: TIDAK layak apa adanya. T riil self-hosted $9.000 vs kontrak $20.000 = selisih $11.000/bulan × 36 = $396.000 untuk `kemudahan`. Workload batch-dominan (a) = pola yang PALING cocok untuk self-hosted/spot. Regulasi (c) = cek region dulu — bila platform tidak punya region Indonesia, diskusi selesai. P2: kontrak = $720.000/3thn; self-hosted = $324.000/3thn; selisih $396.000. Bila workload turun 50% tahun ke-2: kontrak tetap $20.000/bulan (denda implisit = membayar kapasitas tak terpakai ≈ $10.000 × 24 = $240.000), self-hosted bisa scale down. P3 (contoh jawaban baik): (1) Klausul keluar tahunan tanpa penalti bila SLA < 99,5%. (2) Jaminan region Indonesia + audit data residency. (3) Harga scale-down: bayar per pemakaian riil, bukan komitmen tetap — atau kontrak 1 tahun dulu sebagai shadow.",
      ],
      tasks: [
        { id: "t1", text: "Tulis keputusan kontrak 3 tahun BankNusa (layak/tidak + 2 alasan dari kerangka lesson)" },
        { id: "t2", text: "Hitung total 3 tahun kontrak vs self-hosted + denda implisit bila workload turun 50%" },
        { id: "t3", text: "Susun 3 klausul negosiasi sebelum tanda tangan" },
      ],
      expected: "P1: TIDAK layak — selisih $396rb/3thn untuk kemudahan; workload batch cocok self-hosted; cek region regulasi. P2: $720rb vs $324rb; denda implisit ~$240rb. P3: keluar tahunan + region Indonesia + harga scale-down.",
      note: {
        title: "🚨 Mitos: `diskon 30% = pasti murah`",
        type: "pitfall",
        body: "Diskon dihitung dari harga KATALOG — bukan dari kebutuhanmu. $20.000/bulan yang didiskon tetap 2,2x lebih mahal dari $9.000/bulan yang kamu butuhkan. Penjual mendiskon apa yang MEREKA mau jual; kamu membeli apa yang KAMU butuhkan. Selalu bandingkan harga SETELAH diskon dengan alternatifmu — bukan dengan harga sebelum diskon.",
      },
      reference: "Bandingkan harga diskon vs alternatif riil. Kontrak panjang = denda implisit bila workload menyusut.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Dari lab Langkah 6: mengapa SageMaker menang DAN mengapa kemenangannya tidak lengkap?",
          options: [
            { text: "Menang karena fiturnya paling banyak; tidak lengkap karena harganya mahal", why: "Bukan jumlah fitur yang memenangkannya — melainkan bobot `tim AWS siap` (0,3 × 5). Dan `tidak lengkap` bukan soal harga katalog, melainkan pola bayar." },
            { text: "Menang 3,8 karena bobot ekosistem tim; tidak lengkap karena keputusan pola bayar terpisah — 24/7 boros $558/bulan", why: "Tepat. Dua keputusan berbeda: platform apa (matriks S) dan bagaimana membayarnya (T = p × h). Memenangkan yang pertama tidak membenarkan kesalahan yang kedua.", correct: true },
            { text: "Menang karena paling murah; tidak lengkap karena lock-in", why: "SageMaker justru skor biaya 3 — bukan yang termurah. Lock-in memang isu, tapi bukan yang membuat kemenangan `tidak lengkap` di lab." },
            { text: "Tidak ada yang menang — skornya terlalu dekat", why: "3,8 vs 3,5 memang dekat, dan dengan bobot jujur bisa bergeser — tapi lab menetapkan pemenang 3,8. Poinnya bukan `tidak ada pemenang`, melainkan sensitivitas terhadap bobot." },
          ],
        },
        {
          q: "Kapan `build sendiri` menjadi keputusan finansial yang benar?",
          options: [
            { text: "Selalu — bare metal selalu lebih murah dari managed", why: "Tagihan cloud-nya lebih murah, tapi total cost (gaji engineer, on-call, upgrade) sering lebih mahal. Itu mitos yang dibantah Langkah 3." },
            { text: "Saat tagihan managed stabil > ~Rp500 jt/bulan — marjin managed melebihi gaji tim platform", why: "Tepat. Aturan Si Tukang: bandingkan (managed − self-hosted) vs (gaji engineer × waktu). Di atas ambang itu, tukang terbayar.", correct: true },
            { text: "Saat tim hanya 2 data scientist", why: "Terbalik: tim 2 orang tidak punya kapasitas membangun + merawat platform. Itu kasus SEWA terkuat." },
            { text: "Saat workload 100% eksperimen riset", why: "Riset butuh fleksibilitas maksimal dan pola tak menentu — managed/spot lebih cocok daripada platform kaku yang dibangun sendiri." },
          ],
        },
        {
          q: "Apa yang dimaksud `denda implisit` pada kontrak 3 tahun BankNusa?",
          options: [
            { text: "Denda keterlambatan pembayaran di kontrak", why: "Itu denda eksplisit kontraktual. `Implisit` berarti tidak tertulis — tapi tetap dibayar." },
            { text: "Membayar kapasitas tak terpakai saat workload menyusut — ±$240.000 bila turun 50% di tahun ke-2", why: "Tepat. Komitmen tetap + workload menyusut = membayar udara. Inilah yang membuat kontrak panjang berisiko di bisnis yang fluktuatif.", correct: true },
            { text: "Biaya migrasi keluar di akhir kontrak", why: "Itu biaya exit (lapis lock-in), bukan denda implisit. Denda implisit soal membayar yang tidak dipakai SELAMA kontrak." },
            { text: "Potongan diskon yang hangus bila berhenti awal", why: "Itu penalti eksplisit early termination. Berbeda dengan membayar kapasitas menganggur tiap bulan." },
          ],
        },
        {
          q: "T = p × h. Kesalahan paling umum dalam memakai rumus ini?",
          options: [
            { text: "Salah harga p — harga cloud sulit diketahui", why: "Harga katalog justru transparan. Yang sulit = h yang jujur." },
            { text: "Salah mengasumsikan h = 24/7 untuk pemakaian 2 jam/hari (ArusDana: $648 vs $90)", why: "Tepat. 90% kesalahan biaya = h yang salah, bukan p. Selalu ukur pemakaian riil sebelum mengalikan.", correct: true },
            { text: "Lupa mengonversi dolar ke rupiah", why: "Itu kesalahan aritmetika kecil, bukan kesalahan struktural. Masalahnya selalu di h." },
            { text: "Rumusnya salah — seharusnya T = p + h", why: "Rumusnya benar: biaya = tarif × durasi. Yang salah adalah inputnya." },
          ],
        },
        {
          q: "Startup 6 DS seperti ArusDana bertanya padamu. Rekomendasi yang TEPAT?",
          options: [
            { text: "Bangun platform sendiri dengan KServe agar tidak lock-in", why: "6 DS tidak punya kapasitas membangun + merawat. Itu resep burnout, bukan kemerdekaan." },
            { text: "Sewa managed + pola bayar cerdas (serverless/bayar-per-pakai untuk serving 2 jam/hari)", why: "Tepat. Skenario 1 peta keputusan: tagihan kecil, tim fokus ke model. Hemat $558/bulan = setengah gaji engineer.", correct: true },
            { text: "Pakai multi-cloud agar bebas lock-in", why: "Itu mitos Langkah 4: multi-cloud tanpa disiplin = lock-in di mana-mana + egress. Untuk tim 6 orang, ini bunuh diri operasional." },
            { text: "Tunda semua keputusan sampai tim mencapai 30 DS", why: "Menunda = tetap membayar $648/bulan sambil menunggu. Keputusan sewa + pola bayar cerdas bisa diambil minggu ini." },
          ],
        },
      ],
      summary: [
        "Peta platform: training + registry + endpoint + pipelines di ketiganya; pembeda = ekosistem tim, harga per pola pakai, kedalaman ML khusus.",
        "Build vs buy = keputusan finansial: sewa bila kecil/cepat; bangun bila tagihan managed stabil > ~Rp500 jt/bulan.",
        "T = p × h — kesalahan umum = h diasumsikan 24/7; lock-in 3 lapis (API, format, data) diabstraksikan yang murah.",
        "Migrasi: shadow → strangler per workload → decommission setelah 2 siklus billing; data dulu, paralel <3 bulan.",
        "S = Σ w·s; lab: SageMaker 3,8 menang; 24/7 = $648 vs seperlunya $90 — hemat $558/bulan.",
      ],
      next: { label: "MLOps21 — KServe & Optimasi Inferensi", href: "/v2/learn/mlops21-kserve-inference-optimization" },
    },
  ],
};
