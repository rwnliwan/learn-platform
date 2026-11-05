import type { V2Lesson } from "../lib/types";

export const mle8: V2Lesson = {
  slug: "mle8-versioning",
  track: "Machine Learning Engineer",
  module: "Serving & Operasi",
  title: "MLE8 — Versioning: Data, Model, Code",
  estMinutes: 50,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Git memversionkan kode. Tetapi model ML lahir dari TIGA hal: kode + data + config. Memversionkan satu tanpa dua lainnya = tidak bisa kembali ke masa lalu.",
        "Tujuan lesson ini:",
        "• Menjelaskan kenapa git saja tidak cukup untuk ML.",
        "• Memversionkan dataset dengan content hash.",
        "• Merancang model registry: staging, champion, archived.",
        "• Mencatat lineage lengkap: model ini dari data, kode, dan config apa.",
        "• Memutuskan strategi versioning untuk 4 skenario tim.",
        "Isi lesson: cerita model champion yang hilang → 3 kaki versioning + lab hash → registry & lineage + lab → time travel → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model champion yang tidak bisa ditemukan",
      prose: [
        "Direktur risiko meminta model champion scoring — yang AUC-nya 0,87 bulan lalu — untuk dipresentasikan ke regulator. Tim data mencari di shared drive: `model_final.pkl`, `model_final_v2.pkl`, `model_final_FINAL.pkl`, `model_final_FINAL_beneran.pkl`. Empat file, tidak ada yang tahu mana yang dipakai bulan lalu.",
        "Twist yang lebih menyakitkan: kalaupun filenya ketemu, tidak ada yang tahu data training-nya yang mana — warehouse sudah di-update 3x sejak itu — dan kode trainingnya ada di notebook yang tidak pernah di-commit.",
        "Model tanpa lineage = artefak tanpa identitas. Kamu tidak bisa menjawab pertanyaan paling dasar audit: 'model ini dilatih dengan data apa, kode apa, parameter apa?'",
        "Pelajaran: versioning ML = versioning TIGA artefak (code, data, model) + hubungannya (lineage). Hilang satu = hilang semua.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'cukup commit kode ke git, data kan ada di warehouse'",
        type: "pitfall",
        body: "Yang benar: warehouse berubah setiap hari. 'Data ada di warehouse' tanpa versi = tidak bisa kembali ke data 3 bulan lalu. Data butuh identitas (hash/snapshot) sama seperti kode butuh commit hash.",
      },
    },
    {
      id: "tiga-kaki",
      eyebrow: "Langkah 3 · Tiga kaki versioning",
      title: "Code, data, model: ketiganya berversion",
      prose: [
        "Kaki 1 — Code: git seperti biasa (commit hash = identitas). Notebook harus di-export/di-commit; 'notebook di laptop' = tidak berversion.",
        "Kaki 2 — Data: content hash (SHA-256 dari isi dataset) atau snapshot berversion (DVC, lakeFS, Delta Lake time travel). Prinsip: data_v1 ≠ data_v2 terdeteksi otomatis dari hash yang berbeda. Lab berikut membuktikannya: tambah 1 baris → hash berubah.",
        "Kaki 3 — Model: setiap artefak model berversion (v1, v2, ...) dan TIDAK PERNAH di-overwrite. `model.pkl` yang ditimpa = sejarah yang dihapus.",
        "Perekatnya — Lineage: catatan (model_v4 ← data_id fc084cce + code commit a3f9c1 + config_id 9d21bb). Dengan ini, pertanyaan audit terjawab dalam detik, bukan minggu.",
        "Cara membaca: hash 8 karakter cukup sebagai ID manusiawi; yang penting UNIK dan DETERMINISTIK — data sama → hash sama, selalu.",
        "Kaki yang paling sering HILANG: data. Tim memversionkan kode (git ✓) dan config (file ✓), tetapi dataset = “query ke warehouse” yang isinya berubah tiap hari. Model v7 “dilatih dengan data_id berbeda” (minicase) = gejala klasik. Solusi: snapshot dataset per training (hash + simpan query + timestamp + jumlah baris). Biaya: storage (Rp50 ribu/bulan untuk 100GB). Manfaat: reproducibility + audit. Data tanpa version = fondasi pasir.",
      ],
      formula: String.raw`\text{lineage}(m) = (\text{code\_ver},\; \text{data\_id},\; \text{config\_id})`,
      formulaNote: "lineage(m) = (code_ver, data_id, config_id): tiga kaki identitas model m. code_ver = git commit hash; data_id = hash snapshot dataset; config_id = sidik jari hyperparameter. Tanpa ketiganya, pertanyaan “model yang mana yang melayani 14 Maret?” TIDAK TERJAWAB — dan setiap investigasi insiden menjadi arkeologi.",
      tasks: [
        { id: "t1", text: "Tulis fungsi `dataset_id(rows)`: SHA-256 dari JSON canonical, 8 karakter" },
        { id: "t2", text: "Hitung `id1`, `id2` dan `berubah` = apakah hash berbeda" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: hash adalah sidik jari data",
        body: "Kamu tidak perlu menyimpan 10 salinan dataset 50GB — cukup simpan hash + cara merekonstruksi (query + timestamp snapshot). Hash yang berbeda = data berbeda, tanpa perlu membandingkan isi.",
      },
      hints: [
        "canonical = json.dumps(rows, sort_keys=True).",
        "hashlib.sha256(canonical.encode()).hexdigest()[:8].",
        "berubah = id1 != id2.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
import hashlib, json
train_v1 = [{"usia": 30, "gaji": 8}, {"usia": 45, "gaji": 12}]
train_v2 = [{"usia": 30, "gaji": 8}, {"usia": 45, "gaji": 12}, {"usia": 28, "gaji": 7}]

# TULIS KODEMU
def dataset_id(rows):
    
id1 = 
id2 = 
berubah = 

print(f"data_v1={id1}  data_v2={id2}  berubah={berubah}")`,
        lockLines: 4,
        solution: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
import hashlib, json
train_v1 = [{"usia": 30, "gaji": 8}, {"usia": 45, "gaji": 12}]
train_v2 = [{"usia": 30, "gaji": 8}, {"usia": 45, "gaji": 12}, {"usia": 28, "gaji": 7}]

# TULIS KODEMU
def dataset_id(rows):
    canonical = json.dumps(rows, sort_keys=True)
    return hashlib.sha256(canonical.encode()).hexdigest()[:8]
id1 = dataset_id(train_v1)
id2 = dataset_id(train_v2)
berubah = id1 != id2

print(f"data_v1={id1}  data_v2={id2}  berubah={berubah}")`,
        checks: [
          {
            "kind": "defined",
            "task": "t1",
            "label": "`dataset_id` terdefinisi",
            "name": "dataset_id",
            "msg": "Definisikan fungsi dataset_id(rows).",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`berubah` = True",
            "name": "berubah",
            "value": true,
            "tol": 1e-09,
            "msg": "Satu baris tambahan mengubah hash — v1 ≠ v2 terdeteksi.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan hasil",
            "pattern": "berubah=True",
            "msg": "Format: data_v1=...  data_v2=...  berubah=True.",
          },
        ],
      },
      reference: "json.dumps(sort_keys=True) → canonical. SHA-256 → sidik jari unik.",
    },
    {
      id: "registry",
      eyebrow: "Langkah 4 · Model registry",
      title: "Dari file acak ke registry: staging → champion",
      prose: [
        "Model registry adalah 'app store' internal untuk model: setiap versi tercatat dengan metrik, lineage, status, dan siapa yang mempromosikannya. Status standar: staging (diuji) → champion/production (melayani) → archived (pensiun, tetapi tetap ada).",
        "Aturan promosi HARUS eksplisit dan otomatis: 'challenger naik jika AUC ≥ champion + 0,02 DAN PSI_max ≤ 0,25 DAN lolos semua invariant'. Tanpa aturan tertulis, promosi = opini orang yang paling vokal.",
        "Lab: challenger v4 (AUC 0,86) vs champion v3 (AUC 0,83). Kenaikan 0,03 memenuhi syarat — TETAPI psi_max 0,31 melanggar batas 0,25. Verdict: TETAP di staging. Model yang 'lebih akurat' tetapi berdiri di atas data yang bergeser = risiko.",
        "Champion yang digantikan tidak dihapus — di-archive. Rollback = mengembalikan status, bukan mencari file di recycle bin.",
        "Status lifecycle — lebih dari sekadar label. staging: lolos CI, menunggu evaluasi. champion: melayani produksi. challenger: diuji via shadow/canary. deprecated: tidak dipakai, tetapi TIDAK DIHAPUS (audit!). archived: dihapus dari serving, artefak disimpan dingin. Aturan transisi TERTULIS: siapa boleh mempromosikan staging→champion? (dua orang + quality gate hijau). Tanpa aturan: “langsung promosi” (minicase v7!) = insiden yang terjadwal.",
        "Metadata yang WAJIB — checklist. (1) Tiga kaki (code_ver, data_id, config_id). (2) Metrik evaluasi + tanggal. (3) Status lifecycle + riwayat transisi. (4) Siapa mempromosikan + alasan. (5) Batasan diketahui (“tidak untuk segmen X”). Lima item = registry yang berguna. Yang sering hilang: (5) — model dipakai di luar batasnya karena batasnya tidak tertulis. Tulis batasnya; ia akan dibaca saat insiden.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `naik` = selisih AUC challenger − champion" },
        { id: "t2", text: "Terapkan aturan promosi → `promote` (True/False) dan `alasan`" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'model dengan metrik tertinggi otomatis jadi champion'",
        type: "pitfall",
        body: "Yang benar: metrik offline hanyalah SATU syarat. Drift data, hasil invariant, latency, dan risiko bisnis ikut menentukan. Promosi buta metrik = mengundang insiden.",
      },
      hints: [
        "naik = challenger['auc'] - champion['auc'].",
        "promote = naik >= 0.02 and challenger['psi_max'] <= 0.25.",
        "alasan menjelaskan syarat mana yang gagal.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
champion = {"version": "v3", "auc": 0.83, "psi_max": 0.08}
challenger = {"version": "v4", "auc": 0.86, "psi_max": 0.31}

# TULIS KODEMU: aturan promosi
naik = 
promote = 
alasan = 

print(f"auc_naik={naik:.2f}  promote={promote}  alasan={alasan}")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
champion = {"version": "v3", "auc": 0.83, "psi_max": 0.08}
challenger = {"version": "v4", "auc": 0.86, "psi_max": 0.31}

# TULIS KODEMU: aturan promosi
naik = challenger["auc"] - champion["auc"]
promote = naik >= 0.02 and challenger["psi_max"] <= 0.25
alasan = "psi_max 0.31 > 0.25" if not promote else "semua syarat lolos"

print(f"auc_naik={naik:.2f}  promote={promote}  alasan={alasan}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`naik` = 0.03",
            "name": "naik",
            "value": 0.030000000000000027,
            "tol": 1e-09,
            "msg": "0.86 − 0.83 = 0.03 ≥ 0.02 (syarat metrik lolos).",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`promote` = False",
            "name": "promote",
            "value": false,
            "tol": 1e-09,
            "msg": "psi_max 0.31 > 0.25 → ditolak meski AUC naik.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan verdict",
            "pattern": "promote=False",
            "msg": "Format: auc_naik=...  promote=...  alasan=....",
          },
        ],
      },
      reference: "Aturan promosi = quality gate. Tulis sebagai kode, bukan kesepakatan lisan.",
    },
    {
      id: "timetravel",
      eyebrow: "Langkah 5 · Time travel",
      title: "Kemampuan kembali ke masa lalu",
      prose: [
        "Ujian akhir versioning: 'bisakah kamu merekonstruksi PERSIS model yang melayani pada 14 Maret lalu?' Dengan tiga kaki + lineage, jawabannya ya: checkout code commit, restore data snapshot by ID, load config, retrain (atau load artefak berversion).",
        "Kegunaan praktis: debugging insiden ('model 14 Maret vs hari ini — apa yang berubah?'), audit regulator, dan perbandingan challenger yang adil (latih challenger di data yang SAMA dengan champion).",
        "Biaya: storage snapshot data. Strategi hemat: simpan hash + query rekonstruksi untuk data besar; snapshot penuh hanya untuk dataset kritis/audit.",
        "Tim yang tidak bisa time travel = tim yang debugging dengan tebakan. Setiap 'kayaknya sih datanya yang ini' adalah versi mahal dari tidak tahu.",
        "Cara membaca: tiap batang = skenario kesiapan versioning; panjang batang = waktu dari “model bermasalah terdeteksi” sampai “model sehat melayani lagi”; angka di kanan = durasinya.",
        "Interpretasi: 3 hari vs 15 menit = 288× lebih cepat. Tiga hari = forensik manual (cari file, tebak config, tebak data). 15 menit = checkout commit + restore snapshot + redeploy dari registry. Selisihnya bukan “tool mahal” — ia adalah DISIPLIN (tiga kaki + lineage) yang biayanya Rp600 ribu setup. Rp600 ribu membeli 3 hari.",
        "Latihan time travel — lakukan SEKARANG, bukan saat insiden. Pilih model produksi hari ini → rekonstruksi PERSIS (checkout code, restore data, rebuild env) → bandingkan output dengan produksi. Jika SAMA: versioning-mu SEHAT. Jika BEDA/tidak bisa: temukan kakinya yang hilang — SEBELUM auditor yang menemukan. Latihan 2 jam per kuartal = fire drill. Yang tidak pernah latihan = yang panik saat kebakaran.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Waktu recovery insiden model">
<text x="240" y="20" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Waktu recovery insiden model</text>
<text x="142" y="64" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Tanpa versioning</text>
<rect x="150" y="52" width="300" height="22" fill="var(--c1)" rx="4"/>
<text x="458" y="68" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3 hari</text>
<text x="142" y="108" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Versioning parsial</text>
<rect x="150" y="96" width="150" height="22" fill="var(--c1)" rx="4"/>
<text x="308" y="112" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">8 jam</text>
<text x="142" y="152" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Tiga kaki + registry</text>
<rect x="150" y="140" width="40" height="22" fill="var(--c1)" rx="4"/>
<text x="198" y="156" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">15 menit</text>
</svg>`,
        alt: "Diagram batang: recovery 3 hari tanpa versioning vs 15 menit dengan tiga kaki + registry.",
        caption: "Versioning mengubah recovery dari forensik berhari-hari menjadi checkout 15 menit.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: versioning dibayar di depan, dipakai saat krisis",
        body: "Manfaat versioning tidak terasa saat semua lancar — ia terasa saat insiden jam 2 pagi dan kamu butuh jawaban dalam 10 menit, bukan 10 hari.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Strategi versioning per skala tim",
      prose: [
        "Skenario 1 — Solo/2 orang, 1 model → git + hash dataset manual + folder model berversion (v1, v2, ...). Alasan: disiplin > tooling; yang penting tidak overwrite dan tercatat.",
        "Skenario 2 — Tim 5–10 orang, beberapa model → DVC/lakeFS untuk data + MLflow registry untuk model. Alasan: kolaborasi butuh single source of truth yang tidak bergantung pada ingatan.",
        "Skenario 3 — Enterprise teregulasi → semua di atas + immutable audit log (siapa mempromosikan apa, kapan) + retensi artefak sesuai regulasi. Alasan: 'tunjukkan buktinya' adalah pertanyaan rutin, bukan insiden.",
        "Skenario 4 — Riset eksploratif cepat → minimal: config + seed + hash data di tiap run (murah, otomatis). Alasan: eksperimen yang tidak tercatat = eksperimen yang tidak terjadi.",
        "Aturan praktis 10 detik: tanyakan 'jika saya cuti 3 bulan, bisakah orang lain me-reproduce model ini?' Jika jawabannya ragu-ragu, versioning-mu kurang.",
        "Skenario 3 — tim 8 orang, 6 model, TANPA registry → bangun registry MINIMAL dulu (bukan full MLOps). Minimal = tabel: model_id, tiga kaki, metrik, status, siapa mempromosikan, kapan. Bisa di spreadsheet! Yang penting: TIDAK ADA promosi tanpa baris di tabel. Tooling (MLflow) kemudian — disiplin dulu. Banyak tim gagal karena “menunggu tool sempurna” sementara model dipromosi via chat. Tabel hari ini > platform sempurna tahun depan.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "E-commerce: challenger menang, champion tetap",
      prose: [
        "Challenger v7 mengalahkan champion v6: AUC 0,88 vs 0,84 (+0,04). Tim ingin langsung promosi. Registry check menemukan: v7 dilatih dengan data_id berbeda (ada 2 minggu data tambahan pasca kampanye besar), sedangkan v6 memakai data_id lama.",
        "Pertanyaan: (a) Apakah perbandingan ini adil? (b) Apa yang harus dilakukan sebelum promosi? (c) Keputusan promosi yang benar?",
        "Pembahasan: (a) Tidak adil — seperti membandingkan pelari dengan lintasan berbeda. Kenaikan AUC bisa berasal dari data baru, bukan model lebih baik. (b) Latih ulang v6 (arsitektur lama) di data_id yang SAMA dengan v7 — bandingkan apel dengan apel. (c) Jika setelah itu v7 tetap menang + lolos drift gate + invariant → promosi. Jika tidak → v7 tetap staging. Inilah kenapa lineage bukan birokrasi: ia membuat perbandingan JUJUR menjadi mungkin.",
        "Bedah v7 vs v6 — angka lengkap. v7: AUC 0,88 (+0,04), data_id BERBEDA (+2 minggu data). v6: AUC 0,84, data_id SAMA dengan evaluasi. Pertanyaan registry: “apakah +0,04 dari MODEL atau dari DATA?” Tidak bisa dijawab — karena eksperimen tidak terkontrol (dua variabel berubah sekaligus). Keputusan benar: LATIH ULANG v7 dengan data_id SAMA seperti v6, bandingkan apel-vs-apel. Biaya: 1 training ulang (Rp2 juta). Nilai: keputusan promosi yang VALID. “Langsung promosi” menghemat Rp2 juta dan mempertaruhkan portofolio Rp800 miliar.",
        "Aturan promosi — checklist 5 item. (1) Lineage lengkap (tiga kaki tercatat). (2) Apel-vs-apel (data_id sama dengan champion). (3) Quality gate hijau (metrik + invariant + fairness). (4) Shadow/canary minimal 1 pekan. (5) Dua penyetuju + rollback plan tertulis. v7 lolos (1) dan (3), GAGAL (2) dan (4). Keputusan: TAHAN. Checklist ini ditempel di wiki — bukan untuk birokrasi, melainkan agar “euforia +0,04” tidak mengalahkan disiplin. Euforia = musuh promosi yang aman.",
      ],
      tasks: [
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi versioning: tiga kaki + registry + time travel = mesin waktu. Satu prinsip: “setiap artefak yang mempengaruhi keputusan HARUS bisa direkonstruksi”. Model, dataset, config — ketiganya. Yang tidak bisa direkonstruksi = tidak bisa diaudit = tidak bisa dipercaya. Versioning = bukan birokrasi, melainkan KEMAMPUAN UNTUK MENJAWAB “kenapa” — saat regulator, direksi, atau postmortem bertanya.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Empat file model_final*.pkl, tidak jelas mana yang produksi. Akar masalah?",
          options: [
            {
              text: "Kurang storage",
              why: "Masalahnya identitas, bukan kapasitas.",
            },
            {
              text: "Tidak ada model registry + versioning",
              why: "Tepat: tanpa registry, 'mana yang produksi' = tebak-tebakan.",
              correct: true,
            },
            {
              text: "Nama file kurang kreatif",
              why: "Penamaan bukan solusi sistemik.",
            },
            {
              text: "Python versi lama",
              why: "Tidak berhubungan.",
            },
          ],
        },
        {
          q: "Dataset ditambah 1 baris, hash SHA-256 berubah. Artinya?",
          options: [
            {
              text: "Hash rusak",
              why: "Justru itu sifat hash yang benar: sensitif terhadap perubahan apa pun.",
            },
            {
              text: "Perubahan data terdeteksi otomatis — v1 ≠ v2",
              why: "Tepat: inilah fungsi content hash sebagai sidik jari.",
              correct: true,
            },
            {
              text: "Data corrupt",
              why: "Perubahan belum tentu corrupt; hash hanya bilang 'berbeda'.",
            },
            {
              text: "Harus ganti algoritma hash",
              why: "SHA-256 bekerja persis seperti yang diharapkan.",
            },
          ],
        },
        {
          q: "Challenger AUC +0,03 tetapi psi_max 0,31 (> 0,25). Keputusan?",
          options: [
            {
              text: "Promosikan, AUC naik",
              why: "Mengabaikan drift gate = promosi buta metrik.",
            },
            {
              text: "Tahan di staging, investigasi drift dulu",
              why: "Tepat: aturan promosi eksplisit menolak — data bergeser signifikan.",
              correct: true,
            },
            {
              text: "Hapus challenger",
              why: "Challenger berharga sebagai kandidat; yang ditolak adalah promosinya, bukan eksistensinya.",
            },
            {
              text: "Turunkan ambang PSI",
              why: "Mengubah ambang agar lolos = menonaktifkan pengaman.",
            },
          ],
        },
        {
          q: "Komponen lineage lengkap sebuah model adalah…",
          options: [
            {
              text: "Nama file model",
              why: "Nama file bukan identitas yang dapat diverifikasi.",
            },
            {
              text: "(code_ver, data_id, config_id)",
              why: "Tepat: ketiganya memungkinkan rekonstruksi penuh.",
              correct: true,
            },
            {
              text: "Tanggal training",
              why: "Tanggal tidak cukup untuk merekonstruksi.",
            },
            {
              text: "Nama data scientist",
              why: "Orang bisa lupa/pindah; artefak harus mandiri.",
            },
          ],
        },
        {
          q: "Challenger dilatih di data 2 minggu lebih baru dari champion. Perbandingan AUC-nya…",
          options: [
            {
              text: "Adil, yang penting AUC lebih tinggi",
              why: "Data berbeda = lintasan berbeda; kenaikan bisa dari data, bukan model.",
            },
            {
              text: "Tidak adil — latih ulang pembanding di data_id yang sama dulu",
              why: "Tepat: apel vs apel membutuhkan data yang identik.",
              correct: true,
            },
            {
              text: "Adil jika selisihnya besar",
              why: "Besar-kecil tidak memperbaiki ketidakadilan perbandingan.",
            },
            {
              text: "Tidak penting, langsung promosikan",
              why: "Promosi buta = mengundang insiden.",
            },
          ],
        },
      ],
      summary: [
        "Git saja tidak cukup: model = code + data + config, ketiganya berversion.",
        "Data versioning via content hash / snapshot — 'ada di warehouse' bukan versi.",
        "Model tidak pernah di-overwrite; registry: staging → champion → archived.",
        "Aturan promosi eksplisit: metrik + drift + invariant, bukan opini.",
        "Lineage = (code_ver, data_id, config_id): jawaban audit dalam detik.",
        "Ujian akhir: bisakah time travel ke model 3 bulan lalu?",
      ],
      next: { label: "MLE9 — CI/CD untuk ML", href: "/v2/learn/mle9-cicd" },
    },
  ],
};
