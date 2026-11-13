#!/usr/bin/env python3
"""Fill gap Luna M8 — M8.2 (G4 + G5).

G4 (should): langkah baru "Langkah 2a" setelah inventory — kolom shared
dependency / downstream models / aggregate exposure / concentration flag +
figure dependency graph + 1 kuis. Angka portofolio tambahan = [ilustrasi].
G5 (should): langkah singkat setelah re-tiering — vendor-model intake
checklist + mini-case (vendor mengubah model tanpa pemberitahuan).
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


M82 = "src/app/v2/content/mlf-m82-model-risk-rating-inventory.ts"
M82_MD = "content/mlf-m82-model-risk-rating-inventory.md"

G4_STEP = """    {
      id: "shared-dependency",
      eyebrow: "Langkah 2a · Setelah inventory",
      title: "Risiko agregat: satu komponen bersama bisa menjatuhkan tiga model sekaligus",
      prose: [
        "Inventory (langkah 2) mencatat model satu per satu — tapi risiko tidak selalu tinggal di dalam satu model. RISIKO AGREGAT adalah risiko yang muncul dari HUBUNGAN antar-model: satu komponen yang dipakai bersama (shared dependency), satu model yang memakai output model lain (downstream), dan exposure yang dijumlahkan (aggregate exposure). Tiga kolom baru di inventory untuk menangkapnya: shared_dependency (komponen apa yang dipakai bersama, dan siapa pemiliknya), downstream_models (model apa saja yang memakai output model ini), aggregate_exposure (jumlah exposure semua model yang bergantung pada komponen itu), dan concentration_flag (bendera bila konsentrasi melewati batas).",
        "Nilai: tiga komponen bersama di sistem kita — semuanya sudah ada di lesson sebelumnya, dan semuanya belum pernah dilihat sebagai risiko agregat. SATU: feature pipeline [M6.2] — delapan fitur turunan flagship dibangun di satu pipeline, dan pipeline yang sama dipakai model churn [ilustrasi] dan model fraud [ilustrasi]. DUA: kalibrasi Platt [M6.4] — satu fungsi kalibrasi yang sama mengubah skor mentah flagship menjadi probabilitas terkalibrasi yang dipakai threshold, EL, dan EL rate. TIGA: snapshot UCI 30.000 — satu dataset yang sama melatih flagship, mengukur fairness [M7], dan memvalidasi [M8.1]. Aggregate exposure-nya: bila feature pipeline rusak diam-diam, yang dipertaruhkan BUKAN hanya flagship (approved limit NT$424.180.000, EL NT$11.989.453) — tapi juga seluruh alert triase fraud [ilustrasi] dan keputusan promo churn [ilustrasi] — tiga model gagal bersamaan dari SATU penyebab. Angka agregat di luar flagship adalah [ilustrasi]: lesson ini tidak punya angka exposure fraud/churn dari data — yang diajarkan adalah CARA menjumlahkannya, bukan jumlahnya.",
        "Kapan pengawasan dinaikkan: concentration_flag ditegakkan bila SATU dari tiga kondisi terpenuhi — (a) dua atau lebih model Tier 1 bergantung pada satu komponen yang sama (flagship + fraud pada pipeline yang sama); (b) aggregate exposure melewati band materiality tertinggi (mis. melewati NT$600 juta [kebijakan lesson ini] bila dijumlahkan); (c) single point of failure TANPA fallback — komponen itu tidak punya pengganti yang siap jalan (fallback adalah G7 di M8.4). Bila flag ditegakkan, yang berubah bukan tier modelnya — yang berubah adalah pengawasan KOMPONEN-nya: komponen bersama itu diperlakukan sebagai komponen Tier 1-kritis — tier-nya setidaknya setinggi dependen tertingginya — dengan review yang sama dalamnya (validasi independen, monitoring, dan uji kegagalan). Dan munculnya shared dependency baru adalah pemicu re-tiering event-driven (langkah 8): bila flagship mulai memakai output model lain, atau dua model mulai berbagi pipeline, inventory diperbarui dan tier ditinjau ulang.",
        "Baik atau buruk: inventory yang bagus mencatat dependensi — «model ini memakai apa, dan siapa yang memakai model ini» — sehingga satu baris yang rusak bisa dilacak ke semua model yang terkena. Buruk bila inventory hanya daftar nama: pipeline rusak, tiga model memberi keputusan salah, dan tidak ada yang tahu ketiganya berbagi penyebab yang sama — masing-masing diselidiki sebagai insiden terpisah. Buruk juga bila aggregate exposure tidak pernah dijumlahkan: tiap model terlihat «di bawah band» sendirian, padahal bersama-sama mereka sudah melewatinya — seperti tiga pinjaman kecil ke satu debitur yang sama.",
        "Mitigasi: di inventory, untuk tiap model isi DUA kolom tambahan — «bergantung pada» (komponen + pemiliknya) dan «dipakai oleh» (model downstream). Sekali per tahun, gambar ulang dependency graph-nya (gambar langkah ini) dan tanyakan: «komponen mana yang bila mati menjatuhkan paling banyak model Tier 1?» — komponen itu adalah konsentrasi terbesarmu, dan ia butuh fallback (M8.4) sebelum ia butuh penyelidikan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Dependency graph: feature pipeline dipakai bersama oleh churn, flagship GBM, dan fraud; flagship memutuskan limit 424 juta rupiah NT, fraud memutuskan alert triase, churn memutuskan promo">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Dependency graph — satu pipeline, tiga model</text>
<rect x="30" y="28" width="420" height="30" rx="6" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 3"/>
<text x="240" y="47" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Feature pipeline — SHARED [M6.2]</text>
<line x1="90" y1="58" x2="90" y2="84" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="240" y1="58" x2="240" y2="84" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="390" y1="58" x2="390" y2="84" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="30" y="84" width="120" height="34" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="90" y="98" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Churn (Tier 3)</text>
<text x="90" y="111" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[ilustrasi]</text>
<rect x="180" y="84" width="120" height="34" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="98" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Flagship GBM (Tier 1)</text>
<text x="240" y="111" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">skor + kalibrasi Platt</text>
<rect x="330" y="84" width="120" height="34" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="390" y="98" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Fraud (Tier 1)</text>
<text x="390" y="111" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[ilustrasi]</text>
<line x1="90" y1="118" x2="90" y2="146" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="240" y1="118" x2="240" y2="146" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="390" y1="118" x2="390" y2="146" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="30" y="146" width="120" height="34" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="90" y="160" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Promo</text>
<text x="90" y="173" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">dampak kecil</text>
<rect x="180" y="146" width="120" height="34" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="240" y="160" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Keputusan limit</text>
<text x="240" y="173" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">NT$424.180.000</text>
<rect x="330" y="146" width="120" height="34" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="390" y="160" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Alert triase</text>
<text x="390" y="173" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[ilustrasi]</text>
<text x="240" y="200" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Satu bug di pipeline = 3 model gagal bersamaan</text>
<text x="240" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Aggregate exposure: flagship NT$424.180.000 + alert fraud [ilustrasi] + promo [ilustrasi]</text>
<text x="240" y="232" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Concentration flag: ≥2 Tier 1 berbagi satu komponen, atau aggregate melewati band, atau tanpa fallback</text>
</svg>`,
        alt: "Dependency graph: feature pipeline dipakai bersama oleh churn, flagship GBM, dan fraud; flagship memutuskan limit 424 juta NT, fraud memutuskan alert triase, churn memutuskan promo; satu bug di pipeline menjatuhkan ketiganya.",
        caption: "Cara membaca: feature pipeline [M6.2] adalah shared dependency — satu komponen yang memberi makan tiga model. Bila ia rusak diam-diam, flagship (keputusan limit NT$424.180.000), fraud (alert triase [ilustrasi]), dan churn (promo [ilustrasi]) gagal bersamaan dari satu penyebab. Karena dua dependennya Tier 1, pipeline itu sendiri diperlakukan sebagai komponen Tier 1-kritis — dan aggregate exposure-nya dicatat di inventory sebagai konsentrasi, bukan hanya risiko per model.",
      },
      tasks: [],
    },
    {
      id: "tiering","""

G5_STEP = """    {
      id: "vendor-models",
      eyebrow: "Langkah 8a · Setelah re-tiering",
      title: "Model vendor: yang membeli tetap pemilik — dan perubahan vendor adalah re-tiering",
      prose: [
        "Tidak semua model dibangun di dalam bank. MODEL VENDOR adalah model yang dibeli atau disewa — skor kredit dari biro, model anti-fraud dari penyedia, API scoring dari pihak ketiga — dan godaan terbesarnya adalah menganggap «sudah divalidasi vendor, jadi kita tidak perlu memvalidasi». Yang benar adalah sebaliknya: model vendor TETAP butuh owner internal (satu nama orang di dalam organisasi — vendor tidak bisa menjadi owner), TETAP masuk inventory, dan TETAP punya tier — tier-nya mengikuti keputusan yang ia beri makan: skor vendor yang dipakai sebagai fitur flagship adalah Tier 1, karena flagship Tier 1. Membeli model tidak membeli tanggung jawabnya.",
        "Intake checklist — sepuluh hal yang harus ada SEBELUM model vendor dipakai untuk satu keputusan pun. (1) Owner internal: satu nama orang yang bertanggung jawab — bukan «tim vendor». (2) Model/version identifier: nama + versi vendor yang DIPIN (bukan «model terbaru» — «terbaru» berubah tanpa kabar). (3) Input-output contract: schema input, definisi tiap fitur, satuan, dan arti tiap output — ditulis, bukan ditebak dari dokumentasi pemasaran. (4) Validation evidence: bukti validasi vendor DITAMBAH validasi internal atas data kita — bukti vendor saja tidak cukup, karena vendor memvalidasi pada populasi vendor, bukan populasi kita. (5) SLA: uptime, latency, dan waktu respons insiden — dengan angka, bukan janji. (6) Incident notification: vendor WAJIB memberitahu perubahan model, bug, atau insiden dalam jangka waktu yang ditulis [kebijakan organisasi]. (7) Audit rights: hak audit + akses log keputusan vendor — tanpa itu, validator tidak bisa menguji apa pun. (8) Data residency: di mana data nasabah kita diproses dan disimpan — dan apakah itu diizinkan regulasi yang berlaku. (9) Fallback/exit plan: apa yang terjadi bila vendor mati, menaikkan harga, atau mengubah model — model pengganti apa yang siap jalan, dan berapa lama transisinya (fallback adalah G7 di M8.4). (10) Re-tiering: perubahan versi vendor adalah pemicu re-tiering event-driven — model yang tadinya Tier 2 bisa naik Tier 1 bila vendor mengubah perilakunya, dan tier itu ditinjau ulang pada tiap perubahan versi.",
        "Mini-case — vendor yang mengubah model tanpa pemberitahuan [ilustrasi]. Bank memakai «CreditScore-as-a-Service» dari vendor sebagai fitur ke-32 flagship: skor 0–100 yang masuk ke GBM bersama 31 fitur lain. Intake-nya lengkap di atas kertas — kecuali dua hal: versi tidak dipin («kami selalu memakai versi terbaru») dan incident notification tidak ada di kontrak. Enam bulan kemudian vendor mengganti definisi skornya (dari «peluang default 12 bulan» menjadi «peluang default 6 bulan») tanpa pemberitahuan. Yang terjadi: distribusi fitur ke-32 bergeser diam-diam; skor flagship bergeser; threshold 0,10 yang tadinya optimal kini menolak terlalu banyak nasabah bagus — dan tidak ada alert yang berbunyi, karena monitoring [M7.5] memantau skor AKHIR, bukan distribusi tiap fitur input. Yang menangkapnya akhirnya adalah validation halves di revalidasi — enam bulan kemudian, setelah ribuan keputusan yang salah. Dua item checklist yang seharusnya menangkapnya lebih dulu: (2) model/version identifier yang dipin — perubahan versi akan tertolak di pintu masuk, bukan ditemukan di revalidasi; dan (6) incident notification — vendor yang wajib memberitahu perubahan tidak bisa mengubah definisi diam-diam. Pelajarannya: untuk model vendor, yang paling berbahaya bukan modelnya — melainkan PERUBAHAN modelnya yang tidak kamu ketahui. Dan perubahan yang tidak kamu ketahui adalah perubahan yang tidak bisa kamu validasi.",
        "Nilai: intake checklist bagus karena ia memindahkan risiko vendor dari «kepercayaan» ke «kontrak»: tiap item adalah sesuatu yang bisa diperiksa sebelum keputusan pertama diambil. Buruk bila checklist diisi sesudah model dipakai — «kami sudah pakai enam bulan, mari lengkapi dokumennya» — karena pada titik itu vendor sudah memegang keputusanmu dan kamu tidak punya daya tawar untuk meminta audit rights atau fallback.",
        "Mitigasi: jangan pernah memakai output vendor tanpa version identifier yang dipin dan tanpa incident notification tertulis. Dan di model card (M8.3), cantumkan model vendor sebagai dependensi beserta versinya — agar G13 (lifecycle linkage) bisa mendeteksi mismatch antara versi yang divalidasi dan versi yang berjalan.",
      ],
      tasks: [],
    },
    {
      id: "jebakan","""

M82_PAIRS = [
    ("  estMinutes: 70,",
     "  estMinutes: 80,", 1),
    # Peta lesson.
    ("Peta lesson: cerita dua model → inventory: daftar semua model → tiering: Tier 1/2/3 dan konsekuensinya → risiko inheren vs residual → materiality dengan angka flagship → matriks exposure × kompleksitas → skor tiering [kebijakan lesson ini] → kapan rating berubah (re-tiering) → jebakan tiering → mini-case tiga model [ilustrasi] → 2 lab → checkpoint.",
     "Peta lesson: cerita dua model → inventory: daftar semua model → risiko agregat: shared dependency, downstream, aggregate exposure → tiering: Tier 1/2/3 dan konsekuensinya → risiko inheren vs residual → materiality dengan angka flagship → matriks exposure × kompleksitas → skor tiering [kebijakan lesson ini] → kapan rating berubah (re-tiering) → model vendor: intake checklist + perubahan vendor = re-tiering → jebakan tiering → mini-case tiga model [ilustrasi] → 2 lab → checkpoint.", 1),
    # G4: sisip langkah 2a sebelum tiering.
    ('    {\n      id: "tiering",', G4_STEP, 1),
    # G5: sisip langkah 8a sebelum jebakan.
    ('    {\n      id: "jebakan",', G5_STEP, 1),
    # Checkpoint prose: tambah agregat + vendor (jangkar kalimat re-tiering — unik ke prose).
    ("Re-tiering: terjadwal tahunan + event-driven (penggunaan baru, exposure melewati band, temuan validasi, drift besar PSI skor di atas 0,25 [kebijakan M7.5], insiden, regulasi) — dan tier turun hanya bila skor tieringnya turun, yaitu bila materiality/kompleksitas/breadth-nya sendiri turun. Jebakan: tiering dari nama/kompleksitas model bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas.",
     "Re-tiering: terjadwal tahunan + event-driven (penggunaan baru, exposure melewati band, temuan validasi, drift besar PSI skor di atas 0,25 [kebijakan M7.5], insiden, regulasi) — dan tier turun hanya bila skor tieringnya turun, yaitu bila materiality/kompleksitas/breadth-nya sendiri turun. Jebakan: tiering dari nama/kompleksitas model bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas. Risiko agregat: feature pipeline [M6.2], kalibrasi Platt [M6.4], dan snapshot UCI dipakai bersama — satu bug di pipeline menjatuhkan flagship (NT$424.180.000) + fraud + churn sekaligus; concentration_flag ditegakkan bila ≥2 Tier 1 berbagi satu komponen, aggregate exposure melewati band, atau single point of failure tanpa fallback — komponen bersama diperlakukan sebagai Tier 1-kritis. Model vendor: tetap butuh owner internal + inventory + tier (mengikuti keputusan yang ia beri makan); intake 10 item — owner, version identifier yang dipin, input-output contract, bukti validasi vendor + internal, SLA, incident notification, audit rights, data residency, fallback/exit plan, re-tiering tiap perubahan versi; perubahan vendor tanpa pemberitahuan adalah risiko yang tidak bisa divalidasi.", 1),
    # Kuis G4: sisip sebelum penutup array kuis (jangkar soal churn + summary pertama).
    ("""        },
      ],
      summary: [
        "Inventory adalah daftar lengkap semua model (nama, pemilik, versi, tujuan, data, tier, tanggal validasi terakhir, tanggal review berikutnya, status) — tanpa inventory, model tak terdaftar lolos tanpa pengawasan.",""",
     """        },
        {
          q: "Feature pipeline dipakai bersama oleh flagship (Tier 1), fraud (Tier 1), dan churn (Tier 3). Pipeline itu rusak diam-diam selama seminggu. Apa implikasi governance-nya?",
          options: [
            { text: "Tidak ada implikasi — pipeline bukan model, jadi tidak masuk inventory dan tidak perlu diawasi", why: "Salah: shared dependency MASUK inventory sebagai kolom — «bergantung pada» dan «dipakai oleh». Pipeline yang bukan model pun bisa menjadi single point of failure bagi tiga model sekaligus." },
            { text: "Turunkan tier flagship menjadi Tier 2 — pipeline-nya sudah diperbaiki, jadi risikonya sudah mengecil", why: "Salah: perbaikan bukan pemicu turun tier (langkah 8) — tier ditetapkan dari risiko inheren, dan kontrol menurunkan risiko residual, bukan tier. Yang naik adalah pengawasan komponennya, bukan turun tier modelnya." },
            { text: "Ini shared failure mode: tiga model gagal bersamaan dari satu penyebab; pipeline diperlakukan sebagai komponen Tier 1-kritis (setinggi dependen tertingginya), dan aggregate exposure-nya dicatat sebagai konsentrasi — bukan hanya risiko per model", why: "Benar: dua dependennya Tier 1, jadi komponen bersama itu sendiri Tier 1-kritis — dengan review yang sama dalamnya. Aggregate exposure-nya (flagship NT$424.180.000 + alert fraud [ilustrasi] + promo [ilustrasi]) dicatat di inventory, dan munculnya shared dependency baru adalah pemicu re-tiering.", correct: true },
            { text: "Cukup catat sebagai insiden churn — dampaknya kecil karena churn hanya Tier 3", why: "Salah: insidennya BUKAN insiden churn — pipeline yang sama memberi makan flagship dan fraud, keduanya Tier 1. Menilai insiden dari model yang paling kecil dampaknya adalah cara yang sama sekali salah membaca risiko agregat." },
          ],
        },
      ],
      summary: [
        "Inventory adalah daftar lengkap semua model (nama, pemilik, versi, tujuan, data, tier, tanggal validasi terakhir, tanggal review berikutnya, status) — tanpa inventory, model tak terdaftar lolos tanpa pengawasan.",""", 1),
    # Summary: tambah bullet agregat + vendor.
    ('        "Jebakan: tiering dari nama/kompleksitas bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas.",',
     '''        "Jebakan: tiering dari nama/kompleksitas bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas.",
        "Risiko agregat: shared dependency (feature pipeline [M6.2], kalibrasi Platt [M6.4], snapshot UCI) + downstream models + aggregate exposure + concentration_flag — satu bug di pipeline menjatuhkan flagship (NT$424.180.000) + fraud + churn sekaligus; concentration_flag ditegakkan bila ≥2 Tier 1 berbagi satu komponen, aggregate melewati band, atau single point of failure tanpa fallback; komponen bersama = Tier 1-kritis.",
        "Model vendor: tetap butuh owner internal + inventory + tier (mengikuti keputusan yang ia beri makan); intake 10 item (owner, version identifier yang dipin, input-output contract, bukti validasi vendor + internal, SLA, incident notification, audit rights, data residency, fallback/exit plan, re-tiering tiap perubahan versi); perubahan vendor tanpa pemberitahuan = risiko yang tidak bisa divalidasi.",''', 1),
]

M82_MD_PAIRS = [
    # Seksi 2a setelah "## 2. Inventory".
    ("""---

## 3. Tier 1, 2, 3: Rating Risiko dan Konsekuensinya""",
     """---

## 2a. Risiko Agregat: Satu Komponen Bersama Bisa Menjatuhkan Tiga Model Sekaligus

Inventory mencatat model satu per satu — tapi risiko tidak selalu tinggal di dalam satu model. Tiga kolom baru: **shared_dependency** (komponen apa yang dipakai bersama, siapa pemiliknya), **downstream_models** (model apa yang memakai output model ini), **aggregate_exposure** (jumlah exposure semua model yang bergantung pada komponen itu), dan **concentration_flag**.

Tiga komponen bersama di sistem kita: **feature pipeline [M6.2]** (delapan fitur turunan flagship + churn + fraud), **kalibrasi Platt [M6.4]** (satu fungsi kalibrasi untuk threshold, EL, dan EL rate), **snapshot UCI 30.000** (melatih flagship, mengukur fairness [M7], memvalidasi [M8.1]). Bila feature pipeline rusak diam-diam, yang dipertaruhkan bukan hanya flagship (approved limit NT$424.180.000, EL NT$11.989.453) — tapi juga seluruh alert triase fraud [ilustrasi] dan keputusan promo churn [ilustrasi]. Angka agregat di luar flagship adalah [ilustrasi]: yang diajarkan adalah CARA menjumlahkannya, bukan jumlahnya.

**Concentration_flag ditegakkan bila:** (a) ≥2 model Tier 1 bergantung pada satu komponen yang sama; (b) aggregate exposure melewati band materiality tertinggi; (c) single point of failure TANPA fallback (G7, M8.4). Bila flag ditegakkan, komponen bersama itu diperlakukan sebagai komponen Tier 1-kritis — tier-nya setidaknya setinggi dependen tertingginya. Munculnya shared dependency baru adalah pemicu re-tiering event-driven.

---

## 3. Tier 1, 2, 3: Rating Risiko dan Konsekuensinya""", 1),
    # Seksi 8a setelah "## 8. Re-Tiering".
    ("""---

## 9. Jebakan Tiering: Menilai Nama Model, Bukan Dampak Keputusannya""",
     """---

## 8a. Model Vendor: yang Membeli Tetap Pemilik — dan Perubahan Vendor adalah Re-Tiering

Model vendor TETAP butuh owner internal (satu nama orang — vendor tidak bisa menjadi owner), TETAP masuk inventory, dan TETAP punya tier — mengikuti keputusan yang ia beri makan: skor vendor yang dipakai sebagai fitur flagship adalah Tier 1.

**Intake checklist (10 item, sebelum satu keputusan pun):** (1) owner internal; (2) model/version identifier yang DIPIN (bukan «model terbaru»); (3) input-output contract (schema, definisi fitur, satuan, arti output); (4) validation evidence — bukti vendor DITAMBAH validasi internal atas data kita; (5) SLA (uptime, latency, waktu respons insiden); (6) incident notification — vendor WAJIB memberitahu perubahan/bug dalam jangka waktu tertulis [kebijakan organisasi]; (7) audit rights + akses log; (8) data residency; (9) fallback/exit plan; (10) re-tiering tiap perubahan versi vendor.

**Mini-case [ilustrasi]:** bank memakai «CreditScore-as-a-Service» sebagai fitur ke-32 flagship. Intake lengkap — kecuali versi tidak dipin dan incident notification tidak ada di kontrak. Enam bulan kemudian vendor mengganti definisi skor (dari «peluang default 12 bulan» menjadi «peluang default 6 bulan») tanpa pemberitahuan: distribusi fitur ke-32 bergeser diam-diam, threshold 0,10 menolak terlalu banyak nasabah bagus, dan tidak ada alert yang berbunyi (monitoring [M7.5] memantau skor akhir, bukan tiap fitur input). Yang menangkapnya adalah validation halves di revalidasi — enam bulan kemudian. Yang paling berbahaya dari model vendor bukan modelnya — melainkan PERUBAHAN modelnya yang tidak kamu ketahui.

---

## 9. Jebakan Tiering: Menilai Nama Model, Bukan Dampak Keputusannya""", 1),
    # Rangkuman .md: tambah bullet.
    ('- Jebakan: tiering dari nama/kompleksitas bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas.',
     '''- Jebakan: tiering dari nama/kompleksitas bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas.
- Risiko agregat: shared dependency + downstream + aggregate exposure + concentration_flag — satu bug di pipeline menjatuhkan flagship + fraud + churn; komponen bersama = Tier 1-kritis.
- Model vendor: owner internal + inventory + tier tetap wajib; intake 10 item; perubahan versi vendor = pemicu re-tiering; perubahan tanpa pemberitahuan = risiko yang tidak bisa divalidasi.''', 1),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    ok = True
    ok = apply(M82, M82_PAIRS, args.dry) and ok
    ok = apply(M82_MD, M82_MD_PAIRS, args.dry) and ok
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
