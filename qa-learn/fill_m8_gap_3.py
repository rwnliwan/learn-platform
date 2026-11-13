#!/usr/bin/env python3
"""Fill gap Luna M8 — M8.3 (G6 + G13).

G6 (must): perluasan template model card — 10 kolom G10 + 7 kolom penggunaan
(intended_users, decision_context, affected_population, approved_use,
prohibited_use, human_review_required, out_of_scope_trigger) = 17 kolom wajib;
lab2 GAGAL bila prohibited_use kosong (hard rule prohibited_use_ok) + 1 kuis.
G13 (should): langkah baru "Langkah 8a" lifecycle linkage (model_id,
model_version, feature_schema_version, calibration_version,
threshold_policy_version, deployment_id) + figure rantai + Lab 3 end-to-end
(mismatch = governance failure) + 1 kuis.
"""
import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent


def apply(path, pairs, dry):
    p = REPO / path
    text = p.read_text()
    ok = True
    for old, new, expect in pairs:
        n = text.count(old)
        if n != expect:
            print(f"  FAIL {path}: expect {expect}x found {n}x :: {old[:100]!r}")
            ok = False
            continue
        text = text.replace(old, new)
    if not ok:
        return False
    if not dry:
        p.write_text(text)
    print(f"  OK {path}: {len(pairs)} replacements applied")
    return True


M83 = "src/app/v2/content/mlf-m83-model-card-documentation.ts"
M83_MD = "content/mlf-m83-model-card-documentation.md"

G6_PROSE = """,
        "Sepuluh kolom G10 menjawab «APA modelnya, BAGAIMANA mereproduksi dan mengembalikannya, SIAPA & KAPAN, MENGAPA» — tapi tidak menjawab pertanyaan kelima auditor: «model ini BOLEH dipakai untuk apa — dan untuk apa TIDAK?» Tujuh kolom penggunaan melengkapi template itu, sehingga kartu yang lengkap punya 17 kolom wajib. (11) intended_users: siapa yang memakai model ini — analis kredit + komite risiko [ilustrasi] — BUKAN nasabah langsung, dan bukan tim pemasaran. (12) decision_context: keputusan apa yang diambil — persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]. (13) affected_population: siapa yang terkena keputusan itu — nasabah pengaju kartu kredit baru, populasi UCI Taiwan 2005 — BUKAN nasabah eksisting yang meminta kenaikan limit. (14) approved_use: penggunaan yang disetujui — menyetujui/menolak pengajuan kartu kredit baru pada threshold v1 0,10. (15) prohibited_use: penggunaan yang DILARANG — menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain. (16) human_review_required: kapan manusia wajib turun tangan — ya, untuk banding nasabah yang ditolak dan kasus skor di dekat threshold [kebijakan lesson ini]. (17) out_of_scope_trigger: pemicu yang membuat kartu ini TIDAK BERLAKU — populasi bergeser dari UCI, atau model dipakai untuk produk lain — yang terjadi: revalidasi + kartu baru, bukan «tetap dipakai sambil menunggu».",
        "Nilai: tujuh kolom ini bagus karena mereka mengubah «model yang benar» menjadi «model yang dipakai dengan benar»: model yang sama bisa benar untuk pengajuan baru dan salah untuk kenaikan limit — bukan karena angkanya berubah, melainkan karena keputusannya berubah. Kartu tanpa prohibited_use adalah kartu yang mengizinkan segalanya — dan «mengizinkan segalanya» bukan kelalaian kecil: ia adalah izin tertulis untuk memakai model di luar yang divalidasi. Karena itu lab 2 lesson ini punya ATURAN KERAS: kartu dengan prohibited_use kosong GAGAL validasi, walau 16 kolom lain lengkap — kelengkapan tanpa batas penggunaan adalah kartu yang belum selesai ditulis.",
        "Baik atau buruk: kolom penggunaan bagus bila ditulis dengan NAMA yang spesifik — «nasabah pengaju kartu kredit baru» — bukan «pengguna». Buruk bila ditulis sebagai formalitas («prohibited_use: tidak ada») — klaim «tidak ada yang dilarang» untuk model kredit adalah kartu yang tidak dipikirkan: selalu ada penggunaan yang dilarang, minimal «memakai di luar populasi yang divalidasi». Dan buruk bila human_review_required dijawab «tidak» tanpa syarat — keputusan yang sepenuhnya otomatis atas nasabah yang ditolak adalah keputusan yang tidak punya jalan banding.",
        "Mitigasi: sebelum deploy, baca kolom (15) dengan suara keras di depan komite: «model ini DILARANG dipakai untuk …». Bila daftar itu kosong, kartu belum siap. Dan di M8.4, gerbang deploy memeriksa kolom ini — model yang kartunya tidak menulis larangan tidak lolos gerbang."
"""

G13_STEP = """    {
      id: "lifecycle-linkage",
      eyebrow: "Langkah 8a · Setelah audit trail",
      title: "Lifecycle linkage: satu ID yang sama di semua artefak — mismatch adalah governance failure",
      prose: [
        "Model card (lesson ini), validation report (M8.1), tiering record (M8.2), deployment record (M8.4), monitoring config (M7.5), revalidation report (M8.5) — enam artefak, satu lifecycle. LIFECYCLE LINKAGE adalah aturan yang mengikat keenamnya: enam field ID yang SAMA harus muncul di semua artefak — (1) model_id: identitas model di seluruh lifecycle («credit-scorecard-flagship»); (2) model_version: versi model («gbm-calibrated-v1»); (3) feature_schema_version: versi skema fitur («flagship-v1»); (4) calibration_version: versi kalibrasi («platt-cv3»); (5) threshold_policy_version: versi kebijakan threshold («threshold-v1»); (6) deployment_id: identitas deployment («deploy-2026-11-13»). Bila satu artefak menulis ID yang berbeda, itu bukan «data error kecil» — itu GOVERNANCE FAILURE: artefak-artefak itu tidak lagi menceritakan model yang sama.",
        "Contoh yang diajarkan lab 3: monitoring config membaca model_version «gbm-calibrated-v2» sementara model card, validation report, tiering record, dan deployment record semuanya «gbm-calibrated-v1». Apa yang terjadi? Yang dimonitor BUKAN model yang divalidasi — keputusan sedang diambil oleh versi yang tidak punya kartu, tidak punya validasi independen, dan tidak punya persetujuan komite. Vonisnya: deployment DIBEKUKAN sampai ID-nya dicocokkan — bukan «monitoring salah ketik» (mismatch tidak boleh diasumsikan salah ketik: yang berjalan bisa jadi benar-benar v2 yang naik tanpa kartu), bukan «perbarui kartu menjadi v2 supaya cocok» (mengubah kartu agar cocok dengan yang berjalan adalah memalsukan jejak audit), dan bukan «v2 pasti lebih baru dan lebih baik» («lebih baru» bukan «tervalidasi»). Yang benar adalah menghentikan deployment yang tidak cocok dan menyelidiki: versi mana yang benar-benar berjalan, siapa yang menaikkannya, dan atas persetujuan apa.",
        "Nilai: linkage bagus karena ia membuat satu pertanyaan audit menjadi pertanyaan yang bisa dijawab mesin: «apakah model yang berjalan adalah model yang divalidasi?» — jawabannya adalah perbandingan enam string, bukan penyelidikan berminggu-minggu. Tanpa linkage, pertanyaan itu tidak bisa dijawab sama sekali: tiap artefak menceritakan versinya sendiri, dan tidak ada yang tahu versi mana yang live. Dan linkage adalah yang membuat rollback (G10 di M8.4) bisa dilakukan: deployment_id menunjuk ke bundle konfigurasi yang tepat — tanpa itu, «kembalikan ke versi sebelumnya» tidak tahu harus mengembalikan apa.",
        "Baik atau buruk: linkage bagus bila ID-nya ditulis OTOMATIS oleh pipeline deploy — manusia tidak mengetik «gbm-calibrated-v1» enam kali di enam tempat (satu ketikan yang salah menciptakan mismatch palsu). Buruk bila ID ditulis manual di tiap artefak: mismatch yang ditemukan adalah mismatch ketikan, dan mismatch yang sebenarnya (v2 yang naik diam-diam) tidak pernah ketahuan karena semua orang sibuk memperbaiki ketikan. Buruk juga bila linkage hanya diperiksa saat audit tahunan — ia harus diperiksa di SETIAP deployment dan di SETIAP revalidasi (lab 3), karena mismatch yang ditemukan setahun kemudian berarti setahun keputusan yang diambil model yang tidak divalidasi.",
        "Mitigasi: jadikan pengecekan linkage GERBANG deploy (M8.4) dan GERBANG revalidasi (M8.5): tidak ada deployment bila satu ID pun tidak cocok dengan kartu. Dan simpan keenam ID itu di SATU tempat kebenaran (deployment record) — artefak lain MEMBACA dari sana, bukan menulis versinya sendiri.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Rantai lifecycle: model card, validation report, tiering record, deployment record, monitoring, revalidation — model_id dan model_version identik di keenam artefak">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Lifecycle chain — satu ID yang sama di semua artefak</text>
<rect x="20" y="36" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="85" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Model card</text>
<text x="85" y="66" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.3</text>
<rect x="175" y="36" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Validation report</text>
<text x="240" y="66" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.1</text>
<rect x="330" y="36" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="395" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tiering record</text>
<text x="395" y="66" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.2</text>
<line x1="150" y1="56" x2="175" y2="56" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="305" y1="56" x2="330" y2="56" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="395" y1="76" x2="395" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="330" y="130" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="395" y="146" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Deployment record</text>
<text x="395" y="160" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.4</text>
<rect x="175" y="130" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="146" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Monitoring</text>
<text x="240" y="160" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M7.5</text>
<rect x="20" y="130" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="85" y="146" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Revalidation</text>
<text x="85" y="160" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.5</text>
<line x1="330" y1="150" x2="305" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="175" y1="150" x2="150" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="240" y="196" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Aturan: model_id + model_version IDENTIK di keenam artefak</text>
<text x="240" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">model_id, model_version, feature_schema_version, calibration_version,</text>
<text x="240" y="226" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">threshold_policy_version, deployment_id — mismatch = governance failure</text>
</svg>`,
        alt: "Rantai lifecycle: model card, validation report, tiering record, deployment record, monitoring, revalidation — model_id dan model_version identik di keenam artefak; mismatch adalah governance failure.",
        caption: "Cara membaca: enam artefak satu lifecycle — kartu (M8.3) → laporan validasi (M8.1) → catatan tiering (M8.2) → catatan deployment (M8.4) → monitoring (M7.5) → revalidasi (M8.5). Keenam field ID (model_id, model_version, feature_schema_version, calibration_version, threshold_policy_version, deployment_id) harus IDENTIK di semua artefak. Bila satu artefak menulis versi yang berbeda, model yang berjalan bukan model yang divalidasi — itu governance failure, bukan data error.",
      },
      tasks: [],
    },
    {
      id: "jebakan","""

LAB3_STEP = """    {
      id: "lab3",
      eyebrow: "Langkah 13 · Lab 3",
      title: "Lab: lifecycle linkage — deteksi mismatch sebagai governance failure",
      prose: [
        "Lab ketiga memeriksa lifecycle linkage end-to-end (langkah 8a): enam artefak, enam field ID. Lima artefak menulis model_version «gbm-calibrated-v1» — kartu, validation report, tiering record, deployment record, revalidation report. Satu artefak — monitoring_config — menulis «gbm-calibrated-v2» [ilustrasi]. Tugasmu: hitung berapa pasangan (artefak, field) yang cocok dengan kartu, daftarkan mismatch-nya, dan putuskan apakah ini governance failure. Lalu skenario perbaikan: betulkan monitoring_config ke v1 dan hitung ulang — mismatch harus menjadi 0.",
        "Hasil yang diharapkan [lab]: n_artifacts=6; n_fields_checked=6; n_consistent=35; mismatches=['monitoring_config.model_version: gbm-calibrated-v1 vs gbm-calibrated-v2']; governance_failure=True; n_mismatches_fixed=0; governance_failure_fixed=False. Dari 36 pasangan (6 artefak × 6 field), 35 cocok dan 1 tidak — dan SATU mismatch itu sudah cukup: governance_failure=True. Itulah sifat linkage: ia bukan skor (35/36 = 97% bukan «hampir lolos») — ia gerbang biner. Satu ID yang tidak cocok berarti satu artefak menceritakan model yang berbeda, dan deployment dibekukan sampai ID-nya dicocokkan.",
        "Setelah lab jalan, tanyakan pada dirimu: siapa yang seharusnya menangkap mismatch ini SEBELUM lab — pipeline deploy (M8.4) yang menulis ID otomatis, atau revalidasi (M8.5) yang memeriksa linkage tiap kali? Jawabannya: keduanya — deploy menolak deployment yang ID-nya tidak cocok dengan kartu, dan revalidasi memeriksa linkage sebagai gerbang pertama. Lab ini adalah latihan untuk keduanya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi n_artifacts, n_fields_checked, n_consistent, dan mismatches dari perbandingan tiap artefak dengan kartu" },
        { id: "t2", text: "Lengkapi governance_failure: True bila mismatches tidak kosong" },
        { id: "t3", text: "Lengkapi n_mismatches_fixed dan governance_failure_fixed setelah monitoring_config dibetulkan ke v1" },
      ],
      expected: "n_artifacts=6\\nn_fields_checked=6\\nn_consistent=35\\nmismatches=['monitoring_config.model_version: gbm-calibrated-v1 vs gbm-calibrated-v2']\\ngovernance_failure=True\\nn_mismatches_fixed=0\\ngovernance_failure_fixed=False",
      hints: [
        "n_consistent = pasangan (artefak, field) yang nilainya SAMA dengan kartu — hitung dengan sum() atas semua artefak × FIELDS, membandingkan a.get(f) == card.get(f). Kartu itu sendiri menyumbang 6.",
        "mismatches = daftar string 'artefak.field: nilai-kartu vs nilai-artefak' untuk tiap pasangan yang beda — hanya ada satu: monitoring_config.model_version.",
        "governance_failure = len(mismatches) > 0 — bukan skor, melainkan gerbang biner: satu mismatch saja sudah cukup. Skenario perbaikan: fixed sudah dibetulkan ke v1, hitung mismatch yang tersisa dengan cara yang sama.",
      ],
      code: {
        starter: `# Lab 3 — lifecycle linkage: satu ID yang sama di semua artefak (langkah 8a)
# Enam artefak, enam field ID. Satu mismatch [ilustrasi] disisipkan di
# monitoring_config: model_version "gbm-calibrated-v2" padahal kartu v1.
FIELDS = ["model_id", "model_version", "feature_schema_version",
          "calibration_version", "threshold_policy_version", "deployment_id"]

artifacts = {
    "model_card": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "validation_report": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "tiering_record": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "deployment_record": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "monitoring_config": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v2", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "revalidation_report": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
}

card = artifacts["model_card"]
n_artifacts = 0  # TODO: len(artifacts)
n_fields_checked = 0  # TODO: len(FIELDS)
n_consistent = 0  # TODO: pasangan (artefak, field) yang nilainya SAMA dengan kartu
mismatches = []  # TODO: "artefak.field: nilai-kartu vs nilai-artefak" untuk tiap yang beda
governance_failure = False  # TODO: True bila mismatches tidak kosong
# Skenario: perbaiki monitoring_config ke v1, hitung ulang
fixed = {k: dict(v) for k, v in artifacts.items()}
fixed["monitoring_config"]["model_version"] = "gbm-calibrated-v1"
n_mismatches_fixed = 0  # TODO: mismatch tersisa setelah perbaikan
governance_failure_fixed = True  # TODO: False bila n_mismatches_fixed == 0
print(f"n_artifacts={n_artifacts}")
print(f"n_fields_checked={n_fields_checked}")
print(f"n_consistent={n_consistent}")
print(f"mismatches={mismatches}")
print(f"governance_failure={governance_failure}")
print(f"n_mismatches_fixed={n_mismatches_fixed}")
print(f"governance_failure_fixed={governance_failure_fixed}")`,
        lockLines: 15,
        solution: `# Lab 3 — lifecycle linkage: satu ID yang sama di semua artefak (langkah 8a)
# Enam artefak, enam field ID. Satu mismatch [ilustrasi] disisipkan di
# monitoring_config: model_version "gbm-calibrated-v2" padahal kartu v1.
FIELDS = ["model_id", "model_version", "feature_schema_version",
          "calibration_version", "threshold_policy_version", "deployment_id"]

artifacts = {
    "model_card": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "validation_report": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "tiering_record": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "deployment_record": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "monitoring_config": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v2", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "revalidation_report": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
}

card = artifacts["model_card"]
n_artifacts = len(artifacts)
n_fields_checked = len(FIELDS)
n_consistent = sum(1 for a in artifacts.values() for f in FIELDS if a.get(f) == card.get(f))
mismatches = [f"{name}.{f}: {card.get(f)} vs {a.get(f)}" for name, a in artifacts.items() for f in FIELDS if a.get(f) != card.get(f)]
governance_failure = len(mismatches) > 0
# Skenario: perbaiki monitoring_config ke v1, hitung ulang
fixed = {k: dict(v) for k, v in artifacts.items()}
fixed["monitoring_config"]["model_version"] = "gbm-calibrated-v1"
n_mismatches_fixed = sum(1 for a in fixed.values() for f in FIELDS if a.get(f) != card.get(f))
governance_failure_fixed = n_mismatches_fixed > 0
print(f"n_artifacts={n_artifacts}")
print(f"n_fields_checked={n_fields_checked}")
print(f"n_consistent={n_consistent}")
print(f"mismatches={mismatches}")
print(f"governance_failure={governance_failure}")
print(f"n_mismatches_fixed={n_mismatches_fixed}")
print(f"governance_failure_fixed={governance_failure_fixed}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_artifacts", value: 6, tol: 0.5, label: "`n_artifacts` seharusnya 6", msg: "Enam artefak satu lifecycle: kartu, validation report, tiering record, deployment record, monitoring, revalidation." },
          { kind: "equal", task: "t1", name: "n_consistent", value: 35, tol: 0.5, label: "`n_consistent` seharusnya 35", msg: "Dari 36 pasangan (6 artefak × 6 field), 35 cocok dengan kartu — hanya satu yang tidak: monitoring_config.model_version." },
          { kind: "stdout_matches", task: "t1", pattern: "monitoring_config.model_version: gbm-calibrated-v1 vs gbm-calibrated-v2", label: "Output menampilkan mismatch monitoring_config.model_version", msg: "Satu-satunya mismatch: monitoring membaca v2 sementara kartu, validasi, tiering, deployment, dan revalidasi semuanya v1." },
          { kind: "stdout_matches", task: "t2", pattern: "governance_failure=True", label: "Output menampilkan governance_failure=True", msg: "Satu mismatch saja sudah cukup — linkage adalah gerbang biner, bukan skor: 35/36 bukan «hampir lolos». Model yang dimonitor bukan model yang divalidasi." },
          { kind: "equal", task: "t3", name: "n_mismatches_fixed", value: 0, tol: 0.5, label: "`n_mismatches_fixed` seharusnya 0", msg: "Setelah monitoring_config dibetulkan ke v1, tidak ada mismatch tersisa — keenam artefak kembali menceritakan model yang sama." },
          { kind: "stdout_matches", task: "t3", pattern: "governance_failure_fixed=False", label: "Output menampilkan governance_failure_fixed=False", msg: "Perbaikan yang benar adalah mencocokkan artefak dengan kartu — bukan mengubah kartu agar cocok dengan yang berjalan." },
        ],
      },
    },
    {
      id: "checkpoint","""

M83_PAIRS = [
    ("  estMinutes: 75,",
     "  estMinutes: 90,", 1),
    # Peta lesson.
    ("Peta lesson: cerita auditor → isi model card (10 kolom template G10 [M7.4]) → reproducibility: definisi dan cara mengujinya → seed sensitivity: angka kanonis lintas seed 42–46 → data snapshot dan skema fitur → versioning dan rollback → limitations: apa yang TIDAK bisa model lakukan → audit trail: jejak keputusan → jebakan dokumentasi sesudah deploy → mini-case: model card flagship yang terisi → 2 lab → checkpoint.",
     "Peta lesson: cerita auditor → isi model card (10 kolom template G10 [M7.4] + 7 kolom penggunaan) → reproducibility: definisi dan cara mengujinya → seed sensitivity: angka kanonis lintas seed 42–46 → data snapshot dan skema fitur → versioning dan rollback → limitations: apa yang TIDAK bisa model lakukan → audit trail: jejak keputusan → lifecycle linkage: ID konsisten lintas artefak → jebakan dokumentasi sesudah deploy → mini-case: model card flagship yang terisi → 3 lab → checkpoint.", 1),
    # G6: tambah 4 paragraf kolom penggunaan setelah paragraf LIMA isi (jangkar "(kolom 8).").
    ("siapa yang bertanggung jawab bila kartu ini ditanya (kolom 8).\"",
     "siapa yang bertanggung jawab bila kartu ini ditanya (kolom 8).\"" + G6_PROSE, 1),
    # G13: sisip langkah 8a sebelum jebakan.
    ('    {\n      id: "jebakan",', G13_STEP, 1),
    # Mini-case prose: validasi lab 2 kini 17 kolom.
    ("lalu jalankan validasi lab 2: 10 kolom ada, tidak ada yang kosong, metrik cocok dengan notebook.",
     "lalu jalankan validasi lab 2: 17 kolom ada (10 G10 + 7 penggunaan), tidak ada yang kosong, metrik cocok dengan notebook.", 1),
    # Lab2 title.
    ('      title: "Lab: bangun model-card JSON flagship + validasi 10 kolom wajib",',
     '      title: "Lab: bangun model-card JSON flagship + validasi 17 kolom wajib (10 G10 + 7 penggunaan)",', 1),
    # Lab2 prose para 1: tambah 7 kolom penggunaan.
    ("change reason versi produksi pertama. Metriknya: ROC-AUC mentah 0,7823, terkalibrasi 0,7816, PR-AUC terkalibrasi 0,5558, approval 0,285, bad rate 0,0667, profit +NT$8.214.000 [M6.4].",
     "change reason versi produksi pertama. Tujuh kolom penggunaan: intended_users (analis kredit + komite risiko [ilustrasi] — bukan nasabah langsung); decision_context (persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]); affected_population (nasabah pengaju kartu kredit baru, populasi UCI Taiwan 2005 — bukan nasabah eksisting); approved_use (menyetujui/menolak pengajuan baru pada threshold v1 0,10); prohibited_use (DILARANG: menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain); human_review_required (ya — banding nasabah yang ditolak + kasus skor di dekat threshold [kebijakan lesson ini]); out_of_scope_trigger (populasi bergeser dari UCI / model dipakai untuk produk lain → kartu ini tidak berlaku; revalidasi + kartu baru). Metriknya: ROC-AUC mentah 0,7823, terkalibrasi 0,7816, PR-AUC terkalibrasi 0,5558, approval 0,285, bad rate 0,0667, profit +NT$8.214.000 [M6.4].", 1),
    # Lab2 prose para 1 intro: 10 -> 17 kolom.
    ("Lab kedua membangun model card flagship sebagai JSON — dari angka kanonis, bukan dari ingatan — lalu memvalidasi kelengkapan 10 kolom wajib G10 [M7.4] dengan mesin.",
     "Lab kedua membangun model card flagship sebagai JSON — dari angka kanonis, bukan dari ingatan — lalu memvalidasi kelengkapan 17 kolom wajib (10 G10 [M7.4] + 7 penggunaan) dengan mesin.", 1),
    # Lab2 prose para 2 (expected).
    ("Hasil yang diharapkan [lab]: n_fields=10; missing=[]; all_required=True; roc_auc_raw=0.7823; roc_auc_cal=0.7816; pr_auc_cal=0.5558; approval_rate=0.2850; bad_rate_approved=0.0667; profit_nt=8214000. Validasi bekerja dengan cara: `missing` = kolom REQUIRED yang tidak ada di kartu ATAU nilainya kosong — kartu lolos hanya bila `missing` kosong.",
     "Hasil yang diharapkan [lab]: n_fields=17; missing=[]; all_required=True; prohibited_use_ok=True; roc_auc_raw=0.7823; roc_auc_cal=0.7816; pr_auc_cal=0.5558; approval_rate=0.2850; bad_rate_approved=0.0667; profit_nt=8214000. Validasi bekerja dengan cara: `missing` = kolom REQUIRED yang tidak ada di kartu ATAU nilainya kosong — kartu lolos hanya bila `missing` kosong. Aturan keras: `prohibited_use_ok` harus True — kartu dengan penggunaan-terlarang kosong GAGAL walau 16 kolom lain lengkap: kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya.", 1),
    # Lab2 prose para 3 (coba sendiri).
    ("Setelah lab jalan, coba sendiri: hapus satu kolom dari kartu (misalnya data_snapshot) dan jalankan ulang — `missing` akan berisi ['data_snapshot'] dan `all_required` menjadi False. Itulah yang dibuktikan notebook guided task di langkah 5: sembilan dari sepuluh kolom bukan «hampir lengkap».",
     "Setelah lab jalan, coba sendiri: hapus satu kolom dari kartu (misalnya data_snapshot) dan jalankan ulang — `missing` akan berisi ['data_snapshot'] dan `all_required` menjadi False. Coba juga: kosongkan prohibited_use — `missing` berisi ['prohibited_use'] DAN `prohibited_use_ok` menjadi False: kartu GAGAL walau 16 kolom lain lengkap. Itulah yang dibuktikan notebook guided task di langkah 5: sembilan dari sepuluh kolom bukan «hampir lengkap».", 1),
    # Lab2 tasks t1 + tambah t4.
    ('        { id: "t1", text: "Periksa validasi: n_fields harus 10 dan missing harus kosong (all_required=True)" },',
     '        { id: "t1", text: "Periksa validasi: n_fields harus 17 dan missing harus kosong (all_required=True)" },\n        { id: "t4", text: "Periksa hard rule: prohibited_use_ok harus True — kartu dengan penggunaan-terlarang kosong GAGAL walau 16 kolom lain lengkap" },', 1),
    # Lab2 expected string.
    ('      expected: "n_fields=10\\nmissing=[]\\nall_required=True\\nroc_auc_raw=0.7823\\nroc_auc_cal=0.7816\\npr_auc_cal=0.5558\\napproval_rate=0.2850\\nbad_rate_approved=0.0667\\nprofit_nt=8214000",',
     '      expected: "n_fields=17\\nmissing=[]\\nall_required=True\\nprohibited_use_ok=True\\nroc_auc_raw=0.7823\\nroc_auc_cal=0.7816\\npr_auc_cal=0.5558\\napproval_rate=0.2850\\nbad_rate_approved=0.0667\\nprofit_nt=8214000",', 1),
    # Lab2 hint 1 + tambah hint 4.
    ('        "Kartu sudah lengkap di starter — tugas validasi (t1) adalah MEMBACA hasilnya: n_fields=10, missing=[], all_required=True.",',
     '        "Kartu sudah lengkap di starter — tugas validasi (t1) adalah MEMBACA hasilnya: n_fields=17, missing=[], all_required=True.",\n        "Hard rule G6: prohibited_use TIDAK BOLEH kosong — kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya. Coba kosongkan nilainya dan jalankan ulang: missing berisi [\'prohibited_use\'] dan prohibited_use_ok=False.",', 1),
    # Lab2 code REQUIRED (starter + solution, expect 2).
    ("""REQUIRED = ["model_version", "feature_schema_version", "calibration_version",
            "threshold_policy_version", "data_snapshot", "code_notebook_hash",
            "approval_date", "owner", "rollback_version", "change_reason"]""",
     """REQUIRED = ["model_version", "feature_schema_version", "calibration_version",
            "threshold_policy_version", "data_snapshot", "code_notebook_hash",
            "approval_date", "owner", "rollback_version", "change_reason",
            "intended_users", "decision_context", "affected_population",
            "approved_use", "prohibited_use", "human_review_required", "out_of_scope_trigger"]""", 2),
    # Lab2 code card dict: tambah 7 field setelah change_reason (starter + solution, expect 2).
    ('    "change_reason": "versi produksi pertama model flagship [M6.4]",',
     '''    "change_reason": "versi produksi pertama model flagship [M6.4]",
    "intended_users": "Analis kredit + komite risiko [ilustrasi] — bukan nasabah langsung",
    "decision_context": "Persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]",
    "affected_population": "Nasabah pengaju kartu kredit baru (populasi UCI Taiwan 2005) — bukan nasabah eksisting",
    "approved_use": "Menyetujui/menolak pengajuan kartu kredit baru pada threshold v1 0,10",
    "prohibited_use": "DILARANG: menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain",
    "human_review_required": "Ya — banding nasabah yang ditolak + kasus skor di dekat threshold [kebijakan lesson ini]",
    "out_of_scope_trigger": "Populasi bergeser dari UCI / model dipakai untuk produk lain — kartu ini tidak berlaku; revalidasi + kartu baru",''', 2),
    # Lab2 code validasi tail (starter + solution, expect 2).
    ("""missing = [c for c in REQUIRED if c not in card or not str(card[c]).strip()]
all_required = len(missing) == 0
n_fields = len(card)""",
     """missing = [c for c in REQUIRED if c not in card or not str(card[c]).strip()]
prohibited_use_ok = bool(str(card.get("prohibited_use", "")).strip())
all_required = len(missing) == 0 and prohibited_use_ok
n_fields = len(card)""", 2),
    # Lab2 code print block (starter + solution, expect 2).
    ("""print(f"n_fields={n_fields}")
print(f"missing={missing}")
print(f"all_required={all_required}")""",
     """print(f"n_fields={n_fields}")
print(f"missing={missing}")
print(f"all_required={all_required}")
print(f"prohibited_use_ok={prohibited_use_ok}")""", 2),
    # Lab2 lockLines 22 -> 31.
    ("        lockLines: 22,",
     "        lockLines: 31,", 1),
    # Lab2 checks: n_fields 10 -> 17 + tambah check prohibited_use_ok (t4).
    ('          { kind: "equal", task: "t1", name: "n_fields", value: 10, tol: 0.5, label: "`n_fields` seharusnya 10", msg: "Kartu G10 punya tepat 10 kolom wajib — tidak kurang, tidak lebih." },',
     '          { kind: "equal", task: "t1", name: "n_fields", value: 17, tol: 0.5, label: "`n_fields` seharusnya 17", msg: "Kartu punya tepat 17 kolom wajib — 10 G10 + 7 penggunaan — tidak kurang, tidak lebih." },\n          { kind: "stdout_matches", task: "t4", pattern: "prohibited_use_ok=True", label: "Output menampilkan prohibited_use_ok=True", msg: "Hard rule G6: prohibited_use tidak kosong — kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya." },', 1),
    # Lab3: sisip sebelum checkpoint.
    ('    {\n      id: "checkpoint",', LAB3_STEP, 1),
    # Checkpoint prose: mini-case + lab (jangkar gabungan — unik ke prose).
    ("Mini-case flagship: metrik lengkap (terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4]) dengan kolom non-hitung dilabeli [ilustrasi]. Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 10 kolom, missing kosong, all_required=True.",
     "Mini-case flagship: metrik lengkap (terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4]) dengan kolom non-hitung dilabeli [ilustrasi]. Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 17 kolom (10 G10 + 7 penggunaan), missing kosong, all_required=True, prohibited_use_ok=True. Lifecycle linkage: enam artefak (kartu, validation report, tiering record, deployment record, monitoring, revalidation) memakai model_id + model_version yang SAMA — lab 3 mendeteksi satu mismatch [ilustrasi] di monitoring_config (v2 vs v1) sebagai governance failure: model yang dimonitor bukan model yang divalidasi.", 1),
    # Kuis G6 + G13: sisip sebelum penutup array kuis.
    ("""        },
      ],
      summary: [
        "Model card adalah catatan bukti — bukan brosur: ia memuat angka baik (ROC-AUC mentah 0,7823) DAN angka yang tidak baik (AIR SEX GBM terkalibrasi 0,8694 [M7.1], gap train-test 0,0646).",""",
     """        },
        {
          q: "Model card flagship tidak menulis prohibited_use — kolomnya kosong. Apa konsekuensinya menurut lesson ini?",
          options: [
            { text: "Tidak apa-apa — prohibited_use hanya dokumentasi tambahan, bukan kolom wajib", why: "Salah: prohibited_use adalah kolom (15) dari 17 kolom wajib — satu dari tujuh kolom penggunaan. Kartu tanpa kolom penggunaan bukan kartu yang lengkap." },
            { text: "Cukup isi approved_use — dari yang diizinkan, yang dilarang sudah jelas dengan sendirinya", why: "Salah: yang tidak ditulis sebagai dilarang akan dianggap diizinkan — itulah sebabnya larangan harus ditulis eksplisit. «Disetujui untuk pengajuan baru» tidak dengan sendirinya melarang «dipakai untuk kenaikan limit»." },
            { text: "Lab GAGAL: kartu dengan penggunaan-terlarang kosong tidak lolos validasi — kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya; model itu tidak boleh deploy sampai kolomnya diisi", why: "Benar: aturan keras lab 2 — prohibited_use_ok harus True. Kelengkapan tanpa batas penggunaan adalah kartu yang belum selesai ditulis.", correct: true },
            { text: "Isi dengan «tidak ada yang dilarang» supaya lolos validasi", why: "Salah: itu berbohong — dan validasi mesin tidak menangkap kebohongan, hanya ketidaklengkapan. Klaim «tidak ada yang dilarang» untuk model kredit adalah kartu yang tidak dipikirkan: selalu ada penggunaan yang dilarang, minimal «memakai di luar populasi yang divalidasi»." },
          ],
        },
        {
          q: "Monitoring config membaca model_version «gbm-calibrated-v2» sementara model card, validation report, tiering record, dan deployment record semuanya «gbm-calibrated-v1». Apa vonisnya?",
          options: [
            { text: "Data error kecil — monitoring hanya salah ketik, modelnya tetap v1", why: "Salah: mismatch ID tidak boleh diasumsikan salah ketik — yang berjalan bisa jadi benar-benar v2 yang naik tanpa kartu, tanpa validasi, dan tanpa persetujuan. Asumsi «salah ketik» adalah cara tercepat melewatkan governance failure." },
            { text: "Bukan masalah — v2 pasti lebih baru dan lebih baik dari v1", why: "Salah: «lebih baru» bukan «tervalidasi». v2 yang tidak punya kartu dan validasi adalah model yang tidak dikenal — berapa pun angkanya, ia tidak boleh memutuskan." },
            { text: "Cukup perbarui kartu menjadi v2 supaya cocok dengan yang berjalan", why: "Salah: mengubah kartu agar cocok dengan yang berjalan adalah memalsukan jejak audit — kartu ditulis dari validasi, bukan dari yang kebetulan berjalan. Yang benar adalah menghentikan deployment yang tidak cocok dan menyelidiki." },
            { text: "Governance failure: model yang dimonitor bukan model yang divalidasi — keputusan sedang diambil oleh versi yang tidak punya kartu, validasi, dan persetujuan; deployment dibekukan sampai ID-nya dicocokkan", why: "Benar: linkage adalah gerbang biner — satu ID yang tidak cocok berarti satu artefak menceritakan model yang berbeda. Vonisnya: bekukan deployment, selidiki versi mana yang benar-benar berjalan, siapa yang menaikkannya, dan atas persetujuan apa.", correct: true },
          ],
        },
      ],
      summary: [
        "Model card adalah catatan bukti — bukan brosur: ia memuat angka baik (ROC-AUC mentah 0,7823) DAN angka yang tidak baik (AIR SEX GBM terkalibrasi 0,8694 [M7.1], gap train-test 0,0646).",""", 1),
    # Summary: tambah bullet penggunaan + linkage; update bullet lab.
    ('        "Sepuluh kolom wajib G10 [M7.4]: model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan — satu kolom hilang berarti paket tidak bisa diverifikasi.",',
     '''        "Sepuluh kolom wajib G10 [M7.4]: model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan — satu kolom hilang berarti paket tidak bisa diverifikasi.",
        "Tujuh kolom penggunaan melengkapi G10 (total 17 kolom wajib): intended_users, decision_context, affected_population, approved_use, prohibited_use, human_review_required, out_of_scope_trigger — kartu tanpa prohibited_use GAGAL validasi (hard rule lab 2): kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya.",
        "Lifecycle linkage: model_id, model_version, feature_schema_version, calibration_version, threshold_policy_version, deployment_id IDENTIK di keenam artefak (kartu, validation report, tiering record, deployment record, monitoring, revalidation) — mismatch = governance failure, bukan data error; deployment dibekukan sampai ID dicocokkan.",''', 1),
    ('        "Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 10 kolom, missing kosong, all_required=True.",',
     '        "Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 17 kolom (10 G10 + 7 penggunaan), missing kosong, all_required=True, prohibited_use_ok=True; lab 3: 35/36 pasangan ID cocok, 1 mismatch (monitoring_config v2 vs v1) = governance failure.",', 1),
]

M83_MD_PAIRS = [
    # Seksi 2: tambah paragraf 7 kolom penggunaan setelah paragraf LIMA isi.
    ("PEMILIK — siapa yang bertanggung jawab bila kartu ini ditanya.\n\n**Gambar:** Anatomi model card — 10 kolom wajib G10 [M7.4].",
     """PEMILIK — siapa yang bertanggung jawab bila kartu ini ditanya.

**Tujuh kolom penggunaan (G6)** melengkapi sepuluh kolom G10 — total 17 kolom wajib. (11) **intended_users:** analis kredit + komite risiko [ilustrasi] — bukan nasabah langsung. (12) **decision_context:** persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]. (13) **affected_population:** nasabah pengaju kartu kredit baru, populasi UCI Taiwan 2005 — bukan nasabah eksisting. (14) **approved_use:** menyetujui/menolak pengajuan baru pada threshold v1 0,10. (15) **prohibited_use:** DILARANG — menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain. (16) **human_review_required:** ya — banding nasabah yang ditolak + kasus skor di dekat threshold [kebijakan lesson ini]. (17) **out_of_scope_trigger:** populasi bergeser dari UCI / model dipakai untuk produk lain → kartu ini tidak berlaku; revalidasi + kartu baru. **Aturan keras lab 2:** kartu dengan prohibited_use kosong GAGAL walau 16 kolom lain lengkap — kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya.

**Gambar:** Anatomi model card — 10 kolom wajib G10 [M7.4].""", 1),
    # Seksi 8a setelah "## 8. Audit Trail".
    ("""---

## 9. Jebakan: Dokumentasi Ditulis SETELAH Deploy — Saat Ingatan Sudah Pudar""",
     """---

## 8a. Lifecycle Linkage: Satu ID yang Sama di Semua Artefak — Mismatch adalah Governance Failure

Enam artefak, satu lifecycle: model card (M8.3), validation report (M8.1), tiering record (M8.2), deployment record (M8.4), monitoring config (M7.5), revalidation report (M8.5). Enam field ID yang SAMA harus muncul di semua artefak: **model_id** («credit-scorecard-flagship»), **model_version** («gbm-calibrated-v1»), **feature_schema_version** («flagship-v1»), **calibration_version** («platt-cv3»), **threshold_policy_version** («threshold-v1»), **deployment_id** («deploy-2026-11-13»).

**Contoh lab 3:** monitoring config membaca model_version «gbm-calibrated-v2» sementara kelima artefak lain «gbm-calibrated-v1». Vonisnya: GOVERNANCE FAILURE — model yang dimonitor bukan model yang divalidasi; deployment DIBEKUKAN sampai ID-nya dicocokkan. Bukan «salah ketik» (yang berjalan bisa jadi benar-benar v2 yang naik tanpa kartu), bukan «perbarui kartu menjadi v2 supaya cocok» (memalsukan jejak audit), bukan «v2 pasti lebih baik» («lebih baru» bukan «tervalidasi»). Linkage adalah gerbang biner: 35/36 pasangan cocok bukan «hampir lolos» — satu ID yang tidak cocok sudah cukup. Pengecekan linkage adalah gerbang deploy (M8.4) dan gerbang revalidasi (M8.5); ID ditulis otomatis oleh pipeline deploy dan dibaca dari satu tempat kebenaran (deployment record), bukan diketik manual enam kali.

---

## 9. Jebakan: Dokumentasi Ditulis SETELAH Deploy — Saat Ingatan Sudah Pudar""", 1),
    # Lab 2 .md: judul + isi + hasil.
    ("## Lab 2: Bangun Model-Card JSON Flagship + Validasi 10 Kolom Wajib",
     "## Lab 2: Bangun Model-Card JSON Flagship + Validasi 17 Kolom Wajib (10 G10 + 7 Penggunaan)", 1),
    ("Kartu JSON flagship dari angka kanonis + validasi kelengkapan 10 kolom wajib G10 [M7.4] dengan mesin. `missing` = kolom REQUIRED yang tidak ada di kartu ATAU nilainya kosong — kartu lolos hanya bila `missing` kosong.",
     "Kartu JSON flagship dari angka kanonis + validasi kelengkapan 17 kolom wajib (10 G10 [M7.4] + 7 penggunaan) dengan mesin. `missing` = kolom REQUIRED yang tidak ada di kartu ATAU nilainya kosong — kartu lolos hanya bila `missing` kosong. Aturan keras: `prohibited_use_ok` harus True — kartu dengan penggunaan-terlarang kosong GAGAL walau 16 kolom lain lengkap.", 1),
    ("Hasil [lab]: n_fields=10; missing=[]; all_required=True; roc_auc_raw=0.7823; roc_auc_cal=0.7816; pr_auc_cal=0.5558; approval_rate=0.2850; bad_rate_approved=0.0667; profit_nt=8214000.",
     "Hasil [lab]: n_fields=17; missing=[]; all_required=True; prohibited_use_ok=True; roc_auc_raw=0.7823; roc_auc_cal=0.7816; pr_auc_cal=0.5558; approval_rate=0.2850; bad_rate_approved=0.0667; profit_nt=8214000.", 1),
    # Lab 3 .md setelah Lab 2 (jangkar "## Guided task di Colab").
    ("""---

## Guided task di Colab

Notebook: colab/mlf-m83-guided-task.ipynb""",
     """---

## Lab 3: Lifecycle Linkage — Deteksi Mismatch sebagai Governance Failure

Enam artefak, enam field ID. Lima artefak menulis model_version «gbm-calibrated-v1»; monitoring_config menulis «gbm-calibrated-v2» [ilustrasi].

Hasil [lab]: n_artifacts=6; n_fields_checked=6; n_consistent=35; mismatches=['monitoring_config.model_version: gbm-calibrated-v1 vs gbm-calibrated-v2']; governance_failure=True; n_mismatches_fixed=0; governance_failure_fixed=False. Dari 36 pasangan, 35 cocok dan 1 tidak — dan satu mismatch itu sudah cukup: linkage adalah gerbang biner, bukan skor. Skenario perbaikan (betulkan monitoring_config ke v1) mengembalikan mismatch ke 0.

---

## Guided task di Colab

Notebook: colab/mlf-m83-guided-task.ipynb""", 1),
    # Rangkuman .md: tambah bullet setelah G10; update bullet lab.
    ('- Sepuluh kolom wajib G10 [M7.4]: model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan — satu kolom hilang berarti paket tidak bisa diverifikasi.',
     '''- Sepuluh kolom wajib G10 [M7.4]: model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan — satu kolom hilang berarti paket tidak bisa diverifikasi.
- Tujuh kolom penggunaan melengkapi G10 (total 17 kolom wajib): intended_users, decision_context, affected_population, approved_use, prohibited_use, human_review_required, out_of_scope_trigger — kartu tanpa prohibited_use GAGAL validasi (hard rule lab 2).
- Lifecycle linkage: model_id, model_version, feature_schema_version, calibration_version, threshold_policy_version, deployment_id IDENTIK di keenam artefak — mismatch = governance failure; deployment dibekukan sampai ID dicocokkan.''', 1),
    ('- Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 10 kolom, missing kosong, all_required=True.',
     '- Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 17 kolom (10 G10 + 7 penggunaan), missing kosong, all_required=True, prohibited_use_ok=True; lab 3: 35/36 pasangan ID cocok, 1 mismatch (monitoring_config v2 vs v1) = governance failure.', 1),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    ok = True
    ok = apply(M83, M83_PAIRS, args.dry) and ok
    ok = apply(M83_MD, M83_MD_PAIRS, args.dry) and ok
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
