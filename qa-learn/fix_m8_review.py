#!/usr/bin/env python3
"""Ronde FIX review DeepSeek M8 (Learn v2 MLF) — 13 Nov 2026.

Menerapkan 68 temuan BENAR (TS + mirror .md ditangani skrip terpisah
fix_m8_review_md.py) + sitasi 9 NOISE. Notebook TIDAK diubah di sini
(kecuali patch M7.5 di fix_m8_notebook.py).

Cara pakai:
    python3 qa-learn/fix_m8_review.py --dry   # cek hitungan tanpa menulis
    python3 qa-learn/fix_m8_review.py         # terapkan
Setiap pasangan (old, new, expect) WAJIB cocok tepat expect kali —
bila tidak, file itu TIDAK ditulis dan kegagalan dilaporkan.
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


M81 = "src/app/v2/content/mlf-m81-model-validation-framework.ts"
M81_PAIRS = [
    # S7/N3 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook].",
     "31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook].", 1),
    # N6: SR 11-7 diterbitkan bersama OCC 2011-12 (cerita).
    ("SR 11-7, guidance Federal Reserve tentang model risk management (2011).",
     "SR 11-7 (Federal Reserve) / OCC 2011-12, guidance tentang model risk management (2011).", 1),
    # N6: SR 11-7 langkah 2.
    ("SR 11-7 adalah guidance Federal Reserve (2011) tentang model risk management",
     "SR 11-7 adalah guidance Federal Reserve (2011) tentang model risk management, diterbitkan bersama OCC 2011-12", 1),
    # N3: definisi model risk — "kerugian" -> konsekuensi merugikan.
    ("Definisi kuncinya: model risk adalah potensi KERUGIAN akibat keputusan yang didasarkan pada output model yang SALAH atau DISALAHGUNAKAN. Perhatikan dua kata terakhir: «salah» dan «disalahgunakan» adalah dua sumber kerugian yang berbeda.",
     "Definisi kuncinya: model risk adalah potensi konsekuensi merugikan (finansial maupun non-finansial) akibat keputusan yang didasarkan pada output model yang SALAH atau DISALAHGUNAKAN. Perhatikan dua kata terakhir: «salah» dan «disalahgunakan» adalah dua sumber konsekuensi merugikan yang berbeda.", 1),
    # N9: "pilar pertama/kedua validasi" -> "elemen" + urutan pedagogis.
    ("Conceptual soundness adalah pilar pertama validasi:",
     "Conceptual soundness adalah elemen pertama validasi:", 1),
    ("Outcomes analysis adalah pilar kedua validasi:",
     "Outcomes analysis adalah elemen kedua validasi (urutan di lesson ini adalah urutan pedagogis — SR 11-7 sendiri mengurutkan ketiga elemen validasi sebagai conceptual soundness, ongoing monitoring, outcomes analysis):", 1),
    # N5: "memang tidak linear" -> "konsisten dengan ... tidak linear".
    ("Itu sebabnya GBM mentah (ROC-AUC 0,7823) mengalahkan LR (0,7426): hubungan di data ini memang tidak linear.",
     "Itu sebabnya GBM mentah (ROC-AUC 0,7823) mengalahkan LR (0,7426): hasil ini konsisten dengan hubungan yang tidak linear di data ini — bentuk pastinya (spline, interaksi, ambang) belum diuji di sini, jadi klaimnya adalah «konsisten dengan», bukan «terbukti».", 1),
    # N4: "tidak memakai satu split pun" -> "tidak bergantung pada satu split test".
    ("estimasi yang tidak memakai satu split pun",
     "estimasi yang tidak bergantung pada satu split test", 1),
    # S4: pembanding selisih dua estimasi yang benar (sd selisih, bukan sd satu skor).
    ("Bacalah selisih itu seperti validator. ROC-AUC berayun 0,0139 antar-half — bandingkan dengan simpangan baku antar-fold nested CV 0,0068 [M6.2]: ayunan antar-half (n=3.000 per belahan) kira-kira dua kali sd antar-fold — wajar, karena tiap half lebih kecil dari tiap fold validasi silang, dan ROC-AUC dihitung pada sampel yang lebih kecil memang lebih berisik.",
     "Bacalah selisih itu seperti validator. ROC-AUC berayun 0,0139 antar-half — bandingkan dengan galat sampling SELISIH dua estimasi, bukan dengan sd satu skor: tiap half n=3.000, sd satu skor ROC-AUC ≈ 0,008–0,009 [ilustrasi], jadi sd selisihnya ≈ 0,011–0,013 — 0,0139 hanya sekitar 1,1–1,3 sd selisih, wajar untuk dua sampel yang masing-masing berisik. (Perbandingan dengan sd antar-fold 0,0068 [M6.2] memberi «≈2× sd» — 0,0139/0,0068 ≈ 2,04, benar secara aritmetika tetapi membandingkan hal yang salah: selisih dua estimasi harus dibandingkan dengan galat selisih, bukan dengan sd satu skor.)", 1),
    # N1: selisih default 53 vs 61 = 8, bukan 9.
    ("ayunan 1,06 poin persen pada 860 nasabah adalah selisih sekitar 9 nasabah default.",
     "ayunan 1,06 poin persen pada 860 nasabah adalah selisih 8 nasabah default (A: 0,0614 × 863 ≈ 53; B: 0,0720 × 847 ≈ 61).", 1),
    # S2: jendela observasi label 1 bulan [M7.5] pada syarat monitoring.
    ("(2) ROC-AUC, PR-AUC, approval rate, dan bad rate per periode vs baseline test (0,7816 / 0,5558 / 28,5% / 6,67%) — dengan perhatian KHUSUS pada bad rate, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; (3) ECE per periode, ambang 0,02 — karena threshold 0,10 bergantung pada kalibrasi;",
     "(2) ROC-AUC, PR-AUC, approval rate, dan bad rate per periode vs baseline test (0,7816 / 0,5558 / 28,5% / 6,67%) — dengan perhatian KHUSUS pada bad rate, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; bad rate, ROC-AUC, PR-AUC, dan ECE memakai label «default bulan depan», jadi jendela observasinya 1 bulan [M7.5] — metrik berlabel baru bisa dibaca setelah jendela itu lewat, sementara label belum matang PSI skor dan approval rate adalah alarm yang dibaca duluan; (3) ECE per periode (setelah label matang, jendela 1 bulan), ambang 0,02 — karena threshold 0,10 bergantung pada kalibrasi;", 1),
    # N8: lini 3 melapor ke komite audit (prose).
    ("ketiganya melapor ke dewan/komite risiko — bukan satu sama lain.",
     "lini pertama dan kedua melapor ke dewan/komite risiko; lini ketiga (audit internal) melapor ke komite audit — bukan satu sama lain.", 1),
    # N7: override MERAH hanya lewat exception tertulis + approver tercatat.
    ("Buruk bila lini kedua hanya «memberi masukan» tanpa hak veto, atau bila lini ketiga tidak pernah memeriksa validasi itu sendiri: struktur yang ada di slide tapi tidak di keputusan adalah dekorasi.",
     "Buruk bila lini kedua hanya «memberi masukan» tanpa hak veto, atau bila lini ketiga tidak pernah memeriksa validasi itu sendiri: struktur yang ada di slide tapi tidak di keputusan adalah dekorasi. Dan bila verdict MERAH hendak di-override, jalurnya hanya satu: exception tertulis yang disetujui komite, dengan approver dan alasan yang tercatat — komite-lah pengambil keputusan akhirnya, bukan lini kedua dan bukan pemilik model.", 1),
    # N8: figure three-lines — aria-label + kotak komite audit + alt + caption.
    ('aria-label="Three lines of defense: lini pertama pemilik model dan bisnis, lini kedua validasi independen, lini ketiga audit internal; ketiganya melapor ke dewan atau komite risiko"',
     'aria-label="Three lines of defense: lini pertama pemilik model dan bisnis, lini kedua validasi independen, lini ketiga audit internal; lini 1-2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit"', 1),
    ('<text x="400" y="140" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Pengambil keputusan</text>',
     '<text x="400" y="140" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Pengambil keputusan</text>\n<rect x="340" y="176" width="120" height="40" fill="var(--c3)" opacity="0.2" stroke="var(--c3)" stroke-width="1.5"/>\n<text x="400" y="192" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Komite audit</text>\n<text x="400" y="208" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Lini 3 melapor ke sini</text>', 1),
    ('alt: "Three lines of defense: lini pertama pemilik model dan bisnis, lini kedua validasi independen, lini ketiga audit internal; ketiganya melapor ke dewan atau komite risiko."',
     'alt: "Three lines of defense: lini pertama pemilik model dan bisnis, lini kedua validasi independen, lini ketiga audit internal; lini 1-2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit."', 1),
    ('caption: "Cara membaca: tiga baris = tiga peran yang berbeda. Lini 1 membangun dan memakai; lini 2 menguji dan memberi verdict; lini 3 mengaudit keduanya. Semua melapor ke dewan/komite risiko — lini 2 tidak pernah melapor ke lini 1, karena validator tidak boleh dinilai oleh orang yang ia periksa."',
     'caption: "Cara membaca: tiga baris = tiga peran yang berbeda. Lini 1 membangun dan memakai; lini 2 menguji dan memberi verdict; lini 3 mengaudit keduanya. Lini 1-2 melapor ke dewan/komite risiko; lini 3 (audit internal) melapor ke komite audit — lini 2 tidak pernah melapor ke lini 1, karena validator tidak boleh dinilai oleh orang yang ia periksa."', 1),
    # M1: formulaNote ECE — cakupan band (overall + per half; per grup gate n>=200).
    ("Band 0,02/0,05 adalah [kebijakan lesson ini], bukan konstanta alam.",
     "Band 0,02/0,05 adalah [kebijakan lesson ini], bukan konstanta alam. Band ini berlaku untuk ECE overall dan ECE per half; untuk ECE per grup berlaku gate ukuran sampel (langkah 8): grup dengan n ≥ 200 masuk band, grup dengan n < 200 adalah TEMUAN-INVESTIGASI, bukan pemicu band.", 1),
    # M1+S1: cakupan band di prose traffic-light + band |Δapproval| KUNING/MERAH.
    ("Ambang tiap band di bawah ini; perhatikan bahwa setiap kondisi dirumuskan sebagai angka, bukan perasaan.",
     "Ambang tiap band di bawah ini; perhatikan bahwa setiap kondisi dirumuskan sebagai angka, bukan perasaan. Band ECE berlaku untuk ECE overall dan ECE per half (n=3.000–6.000); untuk ECE per grup berlaku gate ukuran sampel: grup dengan n ≥ 200 masuk band, grup dengan n < 200 adalah TEMUAN-INVESTIGASI — ia wajib ditulis dan diselidiki, tetapi tidak memicu band.", 1),
    ("KUNING — lolos dengan catatan — bila SATU kondisi HIJAU dilanggar RINGAN: ECE 0,02–0,05; |selisih ROC-AUC| 0,02–0,05; |selisih bad rate| 1,0–3,0 poin persen; atau ROC-AUC 0,70–0,75.",
     "KUNING — lolos dengan catatan — bila SATU kondisi HIJAU dilanggar RINGAN: ECE 0,02–0,05; |selisih ROC-AUC| 0,02–0,05; |selisih bad rate| 1,0–3,0 poin persen; |selisih approval| 1,0–3,0 poin persen; atau ROC-AUC 0,70–0,75.", 1),
    ("MERAH — tolak — bila SATU PUN kondisi ini terjadi: ECE ≥ 0,05; |selisih ROC-AUC| > 0,05; |selisih bad rate| > 3,0 poin persen; ROC-AUC < 0,70; atau conceptual soundness GAGAL (asumsi/data/metode terbukti salah).",
     "MERAH — tolak — bila SATU PUN kondisi ini terjadi: ECE ≥ 0,05; |selisih ROC-AUC| > 0,05; |selisih bad rate| > 3,0 poin persen; |selisih approval| > 3,0 poin persen; ROC-AUC < 0,70; atau conceptual soundness GAGAL (asumsi/data/metode terbukti salah).", 1),
    # M1: "Terapkan pada model kita" — ECE per grup yang masuk band + pemicu KUNING.
    ("ECE test 0,0087, half A 0,0114, half B 0,0104 — semuanya di bawah 0,02 ✓ HIJAU.",
     "ECE test 0,0087, half A 0,0114, half B 0,0104 — semuanya di bawah 0,02 ✓ HIJAU. ECE per grup [M7.1] yang masuk band (n ≥ 200): Pascasarjana 0,0210, SMA 0,0362, AGE 50–59 0,0312 — ketiganya di rentang KUNING 0,02–0,05; SEX 0,0127/0,0139, Universitas 0,0100, dan grup AGE lainnya di bawah 0,02 ✓ HIJAU. Grup n < 200 (EDUCATION Lainnya 0,0455, n=82; AGE 60+ 0,1208, n=76) adalah TEMUAN-INVESTIGASI, bukan pemicu band.", 1),
    ("VERDICT: KUNING — lolos dengan catatan. Satu-satunya pemicu adalah bad rate; catatan yang menyertainya: pantau bad rate yang disetujui per periode dengan perhatian khusus (langkah 6), dan revalidasi 3 bulan.",
     "VERDICT: KUNING — lolos dengan catatan. Pemicunya: |Δbad rate| 1,06 poin persen DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312); catatan yang menyertainya: pantau bad rate yang disetujui per periode dengan perhatian khusus (langkah 6), selidiki ECE ketiga grup itu bersama temuan-investigasi AGE 60+ (langkah 9), dan revalidasi 3 bulan.", 1),
    # M1: jebakan ECE per grup — n tiap grup + gate n>=200.
    ("EDUCATION: Lainnya 0,0455, Pascasarjana 0,0210, SMA 0,0362, Universitas 0,0100 — sudah di atas 0,02 pada tiga dari empat grup. AGE: 30–39 tahun 0,0156; 40–49 tahun 0,0166; 50–59 tahun 0,0312; 60+ tahun 0,1208 — LEBIH DARI ENAM KALI ambang lolos 0,02.",
     "EDUCATION: Lainnya 0,0455 (n=82), Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), Universitas 0,0100 (n=2.774) — sudah di atas 0,02 pada tiga dari empat grup; dua di antaranya (Pascasarjana, SMA) masuk band karena n ≥ 200, Lainnya tidak. AGE: di bawah 30 tahun 0,0148 (n=1.912); 30–39 tahun 0,0156 (n=2.198); 40–49 tahun 0,0166 (n=1.341); 50–59 tahun 0,0312 (n=473) — masuk band, KUNING; 60+ tahun 0,1208 (n=76) — LEBIH DARI ENAM KALI ambang lolos 0,02, tetapi n < 200 sehingga TEMUAN-INVESTIGASI, bukan pemicu band.", 1),
    ("Pertama: 0,1208 adalah TEMUAN yang wajib ditulis — ECE per grup adalah bagian dari outcomes analysis, dan ambang 0,02 yang sama berlaku per grup (langkah 8).",
     "Pertama: 0,1208 adalah TEMUAN yang wajib ditulis — ECE per grup adalah bagian dari outcomes analysis, dan band 0,02/0,05 berlaku per grup HANYA bila n ≥ 200 (gate ukuran sampel, langkah 8): grup dengan n < 200 adalah TEMUAN-INVESTIGASI, bukan pemicu band. AGE 60+ (n=76) jatuh di sisi itu — begitu juga EDUCATION Lainnya 0,0455 (n=82). Sebaliknya, tiga grup dengan n ≥ 200 yang ECE-nya di rentang KUNING — Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), AGE 50–59 0,0312 (n=473) — MEMASUKI band dan ikut memicu KUNING.", 1),
    ("AGE 60+ ECE 0,1208 [M7.1] dengan n=76 adalah buktinya.",
     "AGE 60+ ECE 0,1208 [M7.1] dengan n=76 (di bawah gate 200, langkah 8) adalah buktinya.", 1),
    # M1: mini-case — cakupan band + pemicu KUNING + catatan + (c).
    ("Band traffic-light [kebijakan lesson ini]: HIJAU bila semua kondisi terpenuhi; KUNING bila satu kondisi dilanggar ringan; MERAH bila ECE ≥ 0,05, |ΔROC| > 0,05, |Δbad rate| > 3,0 poin persen, ROC-AUC < 0,70, atau conceptual soundness gagal.",
     "Band traffic-light [kebijakan lesson ini]: HIJAU bila semua kondisi terpenuhi; KUNING bila satu kondisi dilanggar ringan; MERAH bila ECE ≥ 0,05, |ΔROC| > 0,05, |Δbad rate| > 3,0 poin persen, |Δapproval| > 3,0 poin persen, ROC-AUC < 0,70, atau conceptual soundness gagal. Band ECE berlaku untuk ECE overall dan per half; ECE per grup masuk band hanya bila n ≥ 200 (grup n < 200 = TEMUAN-INVESTIGASI, bukan pemicu band).", 1),
    ("Pertanyaan kedua: kondisi HIJAU mana yang dilanggar? Empat dari lima lolos; satu dilanggar: |Δbad rate| 1,06 poin persen melewati ambang HIJAU 1,0 — masuk rentang KUNING 1,0–3,0. Jawabannya: KUNING — LOLOS DENGAN CATATAN.",
     "Pertanyaan kedua: kondisi HIJAU mana yang dilanggar? Dari lima kondisi numerik, empat lolos; satu dilanggar: |Δbad rate| 1,06 poin persen melewati ambang HIJAU 1,0 — masuk rentang KUNING 1,0–3,0. Ditambah ECE per grup yang masuk band (n ≥ 200): Pascasarjana 0,0210, SMA 0,0362, AGE 50–59 0,0312 — ketiganya di rentang KUNING 0,02–0,05. ECE AGE 60+ 0,1208 (n=76) dan EDUCATION Lainnya 0,0455 (n=82) TIDAK masuk band — n < 200, keduanya TEMUAN-INVESTIGASI. Jawabannya: KUNING — LOLOS DENGAN CATATAN.", 1),
    ("(2) selidiki ECE AGE 60+ 0,1208 (n=76) — kumpulkan sampel lebih besar untuk grup ini sebelum revalidasi, dan laporkan hasilnya [langkah 9];",
     "(2) selidiki ECE per grup yang masuk band KUNING (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312) DAN temuan-investigasi AGE 60+ 0,1208 (n=76) — kumpulkan sampel lebih besar untuk grup ini sebelum revalidasi, dan laporkan hasilnya [langkah 9];", 1),
    ("(c) MENAHAN verdict karena ECE AGE 60+ 0,1208 — temuan itu butuh penyelidikan, bukan penahanan: n=76 terlalu kecil untuk vonis, dan menahan deploy atas bukti yang belum cukup sama salahnya dengan mendepoy tanpa syarat atas bukti yang sama.",
     "(c) MENAHAN verdict karena ECE AGE 60+ 0,1208 — temuan itu butuh penyelidikan, bukan penahanan: n=76 di bawah gate 200, jadi ia tidak masuk band dan terlalu kecil untuk vonis, dan menahan deploy atas bukti yang belum cukup sama salahnya dengan mendepoy tanpa syarat atas bukti yang sama.", 1),
    # M1+S1: lab 2 — cakupan band + lab hanya 4 dari 5 kondisi.
    ("Band traffic-light memakai hasil lab 1: |ΔROC| 0,0139, |Δbad rate| 1,06 poin persen, ROC-AUC test (GBM terkalibrasi) 0,7816.",
     "Band traffic-light memakai hasil lab 1: |ΔROC| 0,0139, |Δbad rate| 1,06 poin persen, ROC-AUC test (GBM terkalibrasi) 0,7816. Band ECE berlaku untuk ECE overall dan per half; ECE per grup masuk band hanya bila n ≥ 200 (langkah 8) — lab ini tidak menghitung ECE per grup. Lab ini juga hanya mengevaluasi empat dari lima kondisi traffic-light (|ΔROC|, |Δbad rate|, ROC-AUC test, ECE); kondisi kelima, |Δapproval| (0,54 poin persen, di bawah 1,0 — HIJAU), sudah dihitung di lab 1 dan tidak diulang di sini.", 1),
    ("Band KUNING datang dari SATU sumber saja: |Δbad rate| 1,06 poin persen. Itulah gunanya memisahkan verdict per metrik: kamu tahu persis APA yang membuat model KUNING, dan syarat apa yang harus ditulis untuknya — pantau bad rate, bukan kalibrasi.",
     "Band KUNING datang dari |Δbad rate| 1,06 poin persen — untuk angka-angka yang dihitung lab ini. Ingat: verdict KUNING model ini punya pemicu kedua di luar lab ini — ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312; semuanya n ≥ 200) — dan satu temuan-investigasi (ECE AGE 60+ 0,1208, n=76) yang tidak masuk band. Itulah gunanya memisahkan verdict per metrik: kamu tahu persis APA yang membuat model KUNING, dan syarat apa yang harus ditulis untuknya — pantau bad rate DAN kalibrasi ketiga grup itu, bukan hanya bad rate.", 1),
    ("MERAH bila ECE ≥ 0,05 ATAU |ΔROC| > 0,05 ATAU |Δbad rate| > 3,0 ATAU ROC test < 0,70 — tidak satu pun terpenuhi. KUNING bila |Δbad rate| > 1,0 — 1,06 > 1,0, jadi band = KUNING.",
     "MERAH bila ECE (overall/per half, atau per grup n ≥ 200) ≥ 0,05 ATAU |ΔROC| > 0,05 ATAU |Δbad rate| > 3,0 ATAU |Δapproval| > 3,0 ATAU ROC test < 0,70 — tidak satu pun terpenuhi. KUNING bila |Δbad rate| > 1,0 — 1,06 > 1,0, jadi band = KUNING.", 1),
    # N10: sitasi ECE overall [M6.4], halves [m8_canonical.json].
    ("# ECE kanonis [m8_canonical.json, M7.1]: half A 0,0114; half B 0,0104; overall 0,0087",
     "# ECE kanonis: half A 0,0114; half B 0,0104 [m8_canonical.json]; overall 0,0087 [M6.4]", 2),
    # Checkpoint rangkuman: N3 + N6 + N8 + band |Δapproval| + pemicu KUNING.
    ("mendefinisikan model risk sebagai potensi kerugian dari keputusan berbasis output model yang salah atau disalahgunakan",
     "mendefinisikan model risk sebagai potensi konsekuensi merugikan (finansial maupun non-finansial) dari keputusan berbasis output model yang salah atau disalahgunakan", 1),
    ("SR 11-7 (Federal Reserve, 2011) mendefinisikan",
     "SR 11-7 (Federal Reserve) / OCC 2011-12 (2011) mendefinisikan", 1),
    ("ketiganya melapor ke dewan/komite risiko; lini 2 tidak pernah melapor ke lini 1.",
     "lini 1–2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit; lini 2 tidak pernah melapor ke lini 1.", 2),
    ("KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Verdict model ini: KUNING — satu-satunya pemicu |Δbad rate| 1,06 pp (0,06 pp di atas ambang), dengan syarat pantau bad rate + selidiki ECE AGE 60+ + revalidasi 3 bulan.",
     "KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; |Δapproval| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; |Δapproval| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200. Verdict model ini: KUNING — pemicu |Δbad rate| 1,06 pp (0,06 pp di atas ambang) DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312), dengan syarat pantau bad rate + selidiki ECE ketiga grup itu dan temuan-investigasi AGE 60+ + revalidasi 3 bulan.", 1),
    ("ECE AGE 60+ 0,1208 (n=76) [M7.1]; temuan itu butuh penyelidikan, bukan vonis dan bukan pengabaian.",
     "ECE AGE 60+ 0,1208 (n=76, di bawah gate 200 — tidak masuk band) [M7.1]; temuan itu butuh penyelidikan, bukan vonis dan bukan pengabaian.", 1),
    # Summary list: N3 + N6.
    ("SR 11-7 (Federal Reserve, 2011): model risk = potensi kerugian dari keputusan berbasis output model yang salah atau disalahgunakan; tiga pilar — (1) development, implementation, and use; (2) validation; (3) governance.",
     "SR 11-7 (Federal Reserve) / OCC 2011-12 (2011): model risk = potensi konsekuensi merugikan (finansial maupun non-finansial) dari keputusan berbasis output model yang salah atau disalahgunakan; tiga pilar — (1) development, implementation, and use; (2) validation; (3) governance.", 1),
    # Kuis Q6 (traffic-light): opsi benar + why.
    ("KUNING — lolos dengan catatan, satu-satunya pemicu |Δbad rate| 1,06 pp (0,06 pp di atas ambang 1,0), dengan syarat pantau bad rate + revalidasi 3 bulan",
     "KUNING — lolos dengan catatan; pemicunya |Δbad rate| 1,06 pp (0,06 pp di atas ambang 1,0) DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312), dengan syarat pantau bad rate + selidiki ECE ketiga grup itu + revalidasi 3 bulan", 1),
    ("Benar: empat dari lima kondisi HIJAU terpenuhi; satu dilanggar ringan dan masuk rentang KUNING 1,0–3,0 pp. Verdict KUNING = deploy dengan syarat yang tertulis dan diaudit.",
     "Benar: |Δbad rate| 1,06 pp melewati ambang HIJAU 1,0 dan masuk rentang KUNING 1,0–3,0 pp; tiga grup dengan n ≥ 200 juga punya ECE di rentang KUNING 0,02–0,05. Verdict KUNING = deploy dengan syarat yang tertulis dan diaudit.", 1),
    # Kuis Q8 (jebakan ECE): why benar + why distraktor tolak.
    ("Benar: 0,1208 adalah temuan yang WAJIB ditulis (di atas ambang 0,02), tapi n=76 berarti ia butuh penyelidikan lanjutan, bukan vonis dan bukan pengabaian. Validator menulis apa yang harus terjadi berikutnya.",
     "Benar: 0,1208 adalah TEMUAN-INVESTIGASI yang WAJIB ditulis (di atas ambang 0,02, tetapi n=76 di bawah gate 200 — jadi ia tidak masuk band dan tidak memicu MERAH), tapi ia butuh penyelidikan lanjutan, bukan vonis dan bukan pengabaian. Validator menulis apa yang harus terjadi berikutnya.", 1),
    ("Salah: n=76 terlalu kecil untuk vonis — ECE dari 76 nasabah berayun lebar dan bisa jadi sebagian noise. Menolak atas bukti yang belum cukup sama salahnya dengan meloloskan tanpa syarat.",
     "Salah: n=76 di bawah gate 200 (langkah 8) — ECE ini tidak masuk band, jadi ia tidak bisa memicu MERAH; ia adalah TEMUAN-INVESTIGASI. Menolak atas bukti yang belum cukup sama salahnya dengan meloloskan tanpa syarat.", 1),
    # Kuis mini-case: opsi benar + why + distraktor tunda.
    ("Lolos dengan catatan (KUNING): pantau bad rate per periode, selidiki ECE AGE 60+, revalidasi 3 bulan — dengan pemilik dan tanggal tertulis",
     "Lolos dengan catatan (KUNING): pantau bad rate per periode, selidiki ECE per grup yang masuk band (Pascasarjana, SMA, AGE 50–59) dan temuan-investigasi AGE 60+, revalidasi 3 bulan — dengan pemilik dan tanggal tertulis", 1),
    ("Benar: tidak ada kondisi MERAH (jadi bukan tolak), satu kondisi HIJAU dilanggar ringan (jadi bukan HIJAU). KUNING = deploy dengan tiga syarat yang tertulis, dipatuhi, dan diaudit di revalidasi.",
     "Benar: tidak ada kondisi MERAH (ECE AGE 60+ 0,1208 tidak masuk band karena n=76 < 200), kondisi HIJAU dilanggar ringan oleh |Δbad rate| 1,06 pp dan ECE tiga grup n ≥ 200. KUNING = deploy dengan syarat yang tertulis, dipatuhi, dan diaudit di revalidasi.", 1),
    ("Salah: menahan deploy atas bukti yang belum cukup (n=76) sama salahnya dengan mendepoy tanpa syarat. Temuan itu menjadi SYARAT KUNING (diselidiki sebelum revalidasi), bukan alasan penahanan.",
     "Salah: menahan deploy atas bukti yang belum cukup (n=76, di bawah gate 200) sama salahnya dengan mendepoy tanpa syarat. Temuan itu menjadi SYARAT KUNING (diselidiki sebelum revalidasi), bukan alasan penahanan.", 1),
]


M82 = "src/app/v2/content/mlf-m82-model-risk-rating-inventory.ts"
M82_PAIRS = [
    # S7 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05.",
     "31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05.", 1),
    # N6: PSI/ECE/bad rate — beda label (PSI tanpa label bisa harian).
    ("monitoring harian/mingguan (PSI skor, approval, bad rate [M7.5])",
     "monitoring harian/mingguan — PSI skor dan approval rate tanpa label (bisa harian), bad rate dan ECE setelah label matang (jendela 1 bulan [M7.5])", 1),
    # S2: "shadow" dua makna -> "shadow-mode" (tercatat) vs "model tak terdaftar".
    ("Inventory adalah daftar LENGKAP semua model yang dipakai organisasi — hidup, bayangan (shadow), maupun pensiun.",
     "Inventory adalah daftar LENGKAP semua model yang dipakai organisasi — hidup, bayangan (shadow-mode: model yang berjalan berdampingan dengan model live tanpa mengambil keputusan — keputusannya dicatat, tidak dijalankan), maupun pensiun.", 1),
    ("Tanpa inventory, yang terjadi adalah SHADOW MODEL: model yang dipakai seseorang tanpa ada yang tahu.",
     "Tanpa inventory, yang terjadi adalah MODEL TAK TERDAFTAR: model yang dipakai seseorang tanpa ada yang tahu.", 1),
    ("tanpa inventory, shadow model lolos tanpa pengawasan",
     "tanpa inventory, model tak terdaftar lolos tanpa pengawasan", 2),
    ("tanpa itu, shadow model lolos tanpa pengawasan",
     "tanpa itu, model tak terdaftar lolos tanpa pengawasan", 1),
    ("tiering TANPA inventory — memberi tier pada model yang diketahui sambil membiarkan shadow model tanpa tier sama sekali.",
     "tiering TANPA inventory — memberi tier pada model yang diketahui sambil membiarkan model tak terdaftar tanpa tier sama sekali.", 1),
    # M1: aturan jumlah level (C+M >= 3 -> Tier 1; = 2 -> Tier 2; <= 1 -> Tier 3).
    ("Sembilan sel matriks dipetakan ke tiga tier [kebijakan lesson ini]: Tier 1 di sudut kanan-atas (exposure tinggi dan/atau kompleksitas tinggi); Tier 3 di sudut kiri-bawah (keduanya rendah); Tier 2 di antaranya.",
     "Sembilan sel matriks dipetakan ke tiga tier [kebijakan lesson ini] dari JUMLAH LEVEL kedua sumbu (rendah=0, sedang=1, tinggi=2): Tier 1 bila jumlah level ≥ 3; Tier 2 bila jumlah level = 2; Tier 3 bila jumlah level ≤ 1. Jadi Tier 1 di sudut kanan-atas (tiga sel: exposure tinggi × kompleksitas sedang/tinggi, dan kompleksitas tinggi × exposure sedang); Tier 3 di sudut kiri-bawah (tiga sel: keduanya rendah, atau satu rendah + satu sedang); Tier 2 di antaranya (tiga sel diagonal, jumlah level = 2).", 1),
    ("Exposure rendah + kompleksitas TINGGI (misal: deep learning untuk laporan internal) juga butuh pengawasan lebih dari Tier 3 — bukan karena uangnya, melainkan karena tidak ada yang bisa menjelaskan kenapa model itu memutuskan begitu, sehingga kesalahannya sulit dideteksi.",
     "Exposure rendah + kompleksitas TINGGI (misal: deep learning untuk laporan internal) juga butuh pengawasan lebih dari Tier 3 — bukan karena uangnya, melainkan karena tidak ada yang bisa menjelaskan kenapa model itu memutuskan begitu, sehingga kesalahannya sulit dideteksi. (Matriks menempatkannya di Tier 2 — jumlah level 0 + 2 = 2 — tetapi skor yang mengikat berkata Tier 3: M=0, C=4, B=0 → 1,20; lihat mitigasi di bawah.)", 1),
    # S6: hierarki eksplisit — matriks saringan kasar, skor yang mengikat.
    ("Bila matriks dan skor tidak sepakat — misal matriks berkata Tier 2 tapi skor berkata Tier 1 — selidiki: biasanya ada sumbu ketiga yang luput, yaitu BREADTH (berapa banyak keputusan — langkah 7).",
     "Bila matriks dan skor tidak sepakat, SKOR YANG MENGIKAT: matriks adalah saringan kasar, skor adalah perhitungan yang mengikat. Contoh: deep learning untuk laporan internal — matriks berkata Tier 2 (jumlah level 2), skor berkata Tier 3 (1,20) — tier-nya Tier 3. Bila matriks berkata Tier 2 tapi skor berkata Tier 1, selidiki: biasanya ada sumbu ketiga yang luput, yaitu BREADTH (berapa banyak keputusan — langkah 7) — tetapi selisih itu dicatat sebagai perbedaan metode, bukan dipakai menaikkan tier secara diam-diam.", 1),
    # M1: figure aria-label + alt.
    ('aria-label="Matriks 3 kali 3 exposure vs kompleksitas: Tier 1 di exposure tinggi atau kompleksitas tinggi; Tier 3 di keduanya rendah; Tier 2 di antaranya. Flagship di sel exposure tinggi, kompleksitas sedang: Tier 1."',
     'aria-label="Matriks 3 kali 3 exposure vs kompleksitas: Tier 1 bila jumlah level kompleksitas + exposure ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2. Flagship di sel exposure tinggi, kompleksitas sedang: Tier 1."', 1),
    ('alt: "Matriks 3 kali 3 exposure vs kompleksitas: Tier 1 di exposure tinggi atau kompleksitas tinggi; Tier 3 di keduanya rendah; Tier 2 di antaranya. Flagship di sel exposure tinggi, kompleksitas sedang: Tier 1."',
     'alt: "Matriks 3 kali 3 exposure vs kompleksitas: Tier 1 bila jumlah level kompleksitas + exposure ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2. Flagship di sel exposure tinggi, kompleksitas sedang: Tier 1."', 1),
    # S4: "nilai model dalam uang" -> EL bruto counterfactual, bukan nilai bersih.
    ("Itulah nilai model dalam uang — dan itulah juga yang dipertaruhkan bila model salah: bila model mulai menyetujui nasabah yang seharusnya ditolak, EL approved naik dari NT$11.989.453 menuju NT$78.675.378.",
     "Itulah EL bruto yang dihindari model secara counterfactual — BUKAN nilai bersih model: nilai bersihnya vs threshold 0,50 adalah NT$27.208.456, dan margin nasabah baik yang ditolak belum dikurangkan dari angka ini. Dan itulah juga yang dipertaruhkan bila model salah: bila model mulai menyetujui nasabah yang seharusnya ditolak, EL approved naik dari NT$11.989.453 menuju NT$78.675.378.", 1),
    # N1: basis 2,51% = realised loss (bukan EL); N3: basis margin; S5: total cost.
    ("Dan bandingkan EL dengan yang TERJADI (realised): realised loss approved NT$11.695.500 — EL NT$11.989.453 hanya NT$293.953 (2,51%) di atas realised.",
     "Dan bandingkan EL dengan yang TERJADI (realised): realised loss approved NT$11.695.500 — EL NT$11.989.453 hanya NT$293.953 di atas realised (2,51% dari realised loss; bila dihitung dari EL, 2,45%).", 1),
    ("Margin approved NT$19.909.500 dikurangi realised loss NT$11.695.500 menghasilkan laba bersih approved NT$8.214.000 [M6.4]; total cost pada threshold 0,10 adalah NT$33.046.500 [M6.4].",
     "Margin approved NT$19.909.500 (5% dari exposure nasabah non-default: 0,05 × NT$398.190.000; realised loss NT$11.695.500 = 0,45 × NT$25.990.000) dikurangi realised loss menghasilkan laba bersih approved NT$8.214.000 [M6.4]; total cost pada threshold 0,10 adalah NT$33.046.500 [M6.4] — total cost ini adalah biaya portofolio (bukan pengurang margin di atas); laba bersih = margin − realised loss, bukan margin − total cost.", 1),
    # S3: ECE 0,0087 [M7.5] -> [M6.4].
    ("probabilitas 0,10 sungguh berarti peluang default 10% (ECE test 0,0087 [M7.5]).",
     "probabilitas 0,10 sungguh berarti peluang default 10% (ECE test 0,0087 [M6.4]).", 1),
    # N4: band M setengah terbuka (150/300/600 tidak tumpang tindih).
    ("M = MATERIALITY, dari approved LIMIT_BAL: di bawah NT$50 juta → 0; NT$50–150 juta → 1; NT$150–300 juta → 2; NT$300–600 juta → 3; di atas NT$600 juta → 4.",
     "M = MATERIALITY, dari approved LIMIT_BAL: di bawah NT$50 juta → 0; NT$50 juta ≤ limit < NT$150 juta → 1; NT$150 juta ≤ limit < NT$300 juta → 2; NT$300 juta ≤ limit < NT$600 juta → 3; limit ≥ NT$600 juta → 4.", 1),
    # S1: catatan sensitivitas skala buku -> skor 3,40, tetap Tier 1 (B=3 TETAP).
    ("Skor = 0,50×3 + 0,30×2 + 0,20×3 = 1,50 + 0,60 + 0,60 = 2,70 → Tier 1. Perhatikan bobotnya:",
     "Skor = 0,50×3 + 0,30×2 + 0,20×3 = 1,50 + 0,60 + 0,60 = 2,70 → Tier 1. Catatan sensitivitas [ilustrasi]: M dan B dihitung dari skala sampel (approved limit NT$424,18 juta; 6.000 aplikasi per periode) — bila keduanya dihitung dari buku penuh (total limit test NT$2.120.900.000; laju keputusan diskalakan), M=4 dan B=4 → skor 3,40 — tetap Tier 1; tier flagship tidak bergantung pada pilihan skala ini. Perhatikan bobotnya:", 1),
    # S3+N6: PSI 0,25 & ECE 0,02 -> [kebijakan lesson ini] + PSI M7.5 hanya 0,0161.
    ("(4) DRIFT BESAR yang bertahan — PSI skor di atas 0,25 [M7.5] atau kalibrasi yang rusak (ECE di atas 0,02 [M7.5]) menandakan model berperilaku di luar yang divalidasi;",
     "(4) DRIFT BESAR yang bertahan — PSI skor di atas 0,25 [kebijakan lesson ini] atau kalibrasi yang rusak (ECE di atas 0,02 [kebijakan lesson ini]) menandakan model berperilaku di luar yang divalidasi; sebagai perbandingan, PSI skor chunk 1 vs chunk 5 di M7.5 hanya 0,0161 — jauh di bawah ambang ini. PSI tanpa label bisa dibaca harian; ECE dan bad rate butuh label matang (jendela 1 bulan [M7.5]);", 1),
    # N5: "5 hari kerja" -> [kebijakan lesson ini].
    ("setiap perubahan penggunaan model WAJIB dilaporkan ke penjaga inventory dalam 5 hari kerja;",
     "setiap perubahan penggunaan model WAJIB dilaporkan ke penjaga inventory dalam 5 hari kerja [kebijakan lesson ini];", 1),
    # N2: "Rp" -> NT$.
    ("Regresi logistik sederhana yang memutuskan limit Rp miliaran adalah Tier 1",
     "Regresi logistik sederhana yang memutuskan limit NT$ miliaran adalah Tier 1", 1),
    # N1: lab1 — basis 2,51% dari realised loss.
    ("Setelah lab jalan, bandingkan EL approved NT$11.989.453 dengan realised loss approved NT$11.695.500 [notebook]: EL hanya NT$293.953 (2,51%) di atas realised — EL dari probabilitas terkalibrasi memprediksi kerugian yang terjadi dengan cukup akurat di test ini.",
     "Setelah lab jalan, bandingkan EL approved NT$11.989.453 dengan realised loss approved NT$11.695.500 [notebook]: EL hanya NT$293.953 di atas realised (2,51% dari realised loss) — EL dari probabilitas terkalibrasi memprediksi kerugian yang terjadi dengan cukup akurat di test ini.", 1),
    # M1: kuis Q5 — why benar + why distraktor.
    ("Benar: sel kanan-bawah matriks adalah Tier 2. Exposure tinggi berarti dampak besar; kompleksitas rendah hanya berarti modelnya mudah dipahami — bukan berarti keputusannya tidak berdampak.",
     "Benar: sel kanan-bawah (exposure tinggi=2, kompleksitas rendah=0) jumlah levelnya 2 → Tier 2. Exposure tinggi berarti dampak besar; kompleksitas rendah hanya berarti modelnya mudah dipahami — bukan berarti keputusannya tidak berdampak.", 1),
    ("Salah: exposure tinggi + kompleksitas rendah adalah Tier 2, bukan Tier 1 — Tier 1 di matriks ini ditempati sel yang exposure-nya tinggi DAN kompleksitasnya sedang/tinggi, atau kompleksitas tinggi dengan exposure sedang. Skor langkah 7 yang memutuskan akhirnya.",
     "Salah: exposure tinggi + kompleksitas rendah jumlah levelnya 2 → Tier 2, bukan Tier 1 — Tier 1 butuh jumlah level ≥ 3 (exposure tinggi DAN kompleksitas sedang/tinggi, atau kompleksitas tinggi dengan exposure sedang). Matriks adalah saringan kasar; skor langkah 7 yang mengikat.", 1),
    # Checkpoint rangkuman: N1 + M1.
    ("realised loss approved NT$11.695.500 (EL hanya NT$293.953 / 2,51% di atas realised);",
     "realised loss approved NT$11.695.500 (EL hanya NT$293.953 di atas realised — 2,51% dari realised loss);", 1),
    ("Matriks exposure × kompleksitas: Tier 1 di sudut kanan-atas, Tier 3 di kiri-bawah, Tier 2 di antaranya — flagship (M=3, C=2) duduk di sel Tier 1.",
     "Matriks exposure × kompleksitas: Tier 1 bila jumlah level (kompleksitas + exposure) ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2 — flagship (M=3, C=2) duduk di sel Tier 1; exposure tinggi + kompleksitas rendah tetap Tier 2.", 1),
    # Summary list: M1.
    ("Matriks exposure × kompleksitas: Tier 1 di sudut kanan-atas, Tier 3 di kiri-bawah, Tier 2 di antaranya — flagship (M=3, C=2) di sel Tier 1; exposure tinggi + kompleksitas rendah tetap Tier 2.",
     "Matriks exposure × kompleksitas: Tier 1 bila jumlah level (kompleksitas + exposure) ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2 — flagship (M=3, C=2) di sel Tier 1; exposure tinggi + kompleksitas rendah tetap Tier 2.", 1),
]

M83 = "src/app/v2/content/mlf-m83-model-card-documentation.ts"
M83_PAIRS = [
    # S7/N3 noise: label [notebook] pada "31 fitur" dan "cv=3" (template G10).
    ("seed 42, 31 fitur flagship v1.",
     "seed 42, 31 fitur flagship v1 [notebook].", 1),
    ("31 fitur (23 mentah + 8 turunan) — bila satu fitur berubah definisinya, versinya naik.",
     "31 fitur (23 mentah + 8 turunan) [notebook] — bila satu fitur berubah definisinya, versinya naik.", 1),
    ("metode kalibrasi dan parameternya — Platt/sigmoid, CalibratedClassifierCV cv=3.",
     "metode kalibrasi dan parameternya — Platt/sigmoid, CalibratedClassifierCV cv=3 [notebook].", 1),
    # S1: ECE 0,0087 [M7.5] -> [M6.4] (model-card-isi prose + mini-case METRIK).
    ("PR-AUC 0,5597 dan 0,5558, ECE 0,0087 [M7.5], Brier 0,1345",
     "PR-AUC 0,5597 dan 0,5558, ECE 0,0087 [M6.4], Brier 0,1345", 1),
    ("Brier 0,1345, ECE 0,0087 [M7.5]; LR mentah",
     "Brier 0,1345, ECE 0,0087 [M6.4]; LR mentah", 1),
    # N2: caption figure — kolom 6-10 bukan "SIAPA, KAPAN, BAGAIMANA" sekaligus.
    ("kolom 6–10 menjawab «SIAPA, KAPAN, dan BAGAIMANA mengembalikannya» (kode, tanggal persetujuan, pemilik, rollback, alasan).",
     "kolom 6 & 9 menjawab «BAGAIMANA mereproduksi dan mengembalikannya» (kode/hash, rollback); kolom 7–8 menjawab «SIAPA & KAPAN» (tanggal persetujuan, pemilik); kolom 10 menjawab «MENGAPA» (alasan perubahan).", 1),
    # N8: toleransi 0,001 diasumsikan seed 42 terkunci (prose + formulaNote).
    ("Lesson ini memakai toleransi 0,001 untuk ROC-AUC: replikasi flagship GBM mentah harus menghasilkan 0,7823 ± 0,001, dan GBM terkalibrasi 0,7816 ± 0,001.",
     "Lesson ini memakai toleransi 0,001 untuk ROC-AUC: replikasi flagship GBM mentah harus menghasilkan 0,7823 ± 0,001, dan GBM terkalibrasi 0,7816 ± 0,001. Toleransi ini diasumsikan seed 42 terkunci — bila seed-nya berbeda, ayunan antar-seed (sd 0,0028, langkah 4) sudah bisa melampaui toleransi ini, jadi replikasi WAJIB memakai seed 42.", 1),
    ("Toleransi 0,001 adalah keputusan kebijakan lesson ini — ditulis dulu, bukan dinegosiasikan sesudah melihat hasil.",
     "Toleransi 0,001 adalah keputusan kebijakan lesson ini — ditulis dulu, bukan dinegosiasikan sesudah melihat hasil — dan diasumsikan seed 42 terkunci.", 1),
    # N7: "pita selebar 0,0069" = rentang 5 seed yang diuji, bukan batas populasi.
    ("Spread 0,0069 berarti: bila kamu melatih ulang model yang sama dengan seed yang berbeda, ROC-AUC-nya bergerak dalam pita selebar 0,0069.",
     "Spread 0,0069 berarti: bila kamu melatih ulang model yang sama dengan 5 seed yang diuji (42–46), ROC-AUC-nya bergerak dalam pita selebar 0,0069 — pita ini adalah rentang lima seed yang diuji, bukan batas populasi seed yang mungkin.", 1),
    # S3: ambang alert 0,02 -> [kebijakan M7.5] (4 situs prose/kaption + Q3).
    ("Ambang alert monitoring [M7.5] untuk penurunan ROC-AUC adalah 0,02",
     "Ambang alert monitoring [kebijakan M7.5] untuk penurunan ROC-AUC adalah 0,02", 1),
    ("ambang alert monitoring 0,02 [M7.5]",
     "ambang alert monitoring 0,02 [kebijakan M7.5]", 3),
    ("bila spread lintas 5 seed melewati 0,02 — ambang alert yang sama dengan monitoring",
     "bila spread lintas 5 seed melewati 0,02 — ambang alert [kebijakan M7.5] yang sama dengan monitoring", 1),
    ("Salah hitung: 0,0069 LEBIH KECIL dari 0,02 — sekitar sepertiganya. Noise seed tidak pernah menyalakan alert monitoring.",
     "Salah hitung: 0,0069 LEBIH KECIL dari 0,02 [kebijakan M7.5] — sekitar sepertiganya. Noise seed tidak pernah menyalakan alert monitoring.", 1),
    # M1: 0,0710 = rentang (maks-min) antar-chunk, BUKAN drop vs full-test.
    ("Dan bandingkan dengan ayunan antar-periode [M7.5]: ROC-AUC chunk waktu semu berayun 0,0710 — sepuluh kali lipat spread seed.",
     "Dan bandingkan dengan ayunan antar-periode [M7.5]: ROC-AUC chunk waktu semu berayun 0,0710 — rentang (maks−min) antar-chunk [m75_pseudo_time_roc_spread], BUKAN drop vs full-test (drop itu 0,0388: 0,7816 − 0,7428); 0,0710/0,0069 ≈ 10,3× spread seed — sepuluh kali lipat.", 1),
    # S2 noise: PSI AGE 0,0029 -> kunci kanonik.
    ("PSI tertinggi AGE 0,0029 membuktikan split seed 42 sehat",
     "PSI tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi] membuktikan split seed 42 sehat", 1),
    # S4 noise: AIR EDUCATION 0,3572 -> kunci kanonik + definisi min/max + four-fifths.
    ("AIR SEX (GBM terkalibrasi) 0,8694 (approval laki-laki 26,14% vs perempuan 30,07%) berada di atas ambang 0,80, tapi AIR EDUCATION serendah 0,3572 (SMA vs Lainnya)",
     "AIR SEX (GBM terkalibrasi) 0,8694 (approval laki-laki 26,14% vs perempuan 30,07%) berada di atas ambang 0,80 (aturan four-fifths — ambang standar, bukan konstanta alam), tapi AIR EDUCATION serendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] — rasio approval terendah (SMA) terhadap tertinggi (Lainnya) —", 1),
    ("(AIR EDUCATION 0,3572) ditulis di sampingnya",
     "(AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]) ditulis di sampingnya", 1),
    ("AIR EDUCATION 0,3572 — tidak adil merata antar grup pendidikan [M7.1];",
     "AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] — tidak adil merata antar grup pendidikan (SMA vs Lainnya; ambang 0,80 aturan four-fifths) [M7.1];", 1),
    ("Limitations: satu snapshot tanpa deret waktu [M7.5]; AIR EDUCATION terendah 0,3572 [M7.1];",
     "Limitations: satu snapshot tanpa deret waktu [M7.5]; AIR EDUCATION terendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max];", 2),
    ("tetap punya AIR EDUCATION 0,3572 [M7.1]",
     "tetap punya AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]", 1),
    ("dan AIR EDUCATION serendah 0,3572 [M7.1], jadi model tidak adil merata antar grup pendidikan",
     "dan AIR EDUCATION serendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max], jadi model tidak adil merata antar grup pendidikan", 1),
    ("dan AIR EDUCATION 0,3572 [M7.1]. Batasan yang baik ditulis dengan angka, grup yang disebut, dan konsekuensinya.",
     "dan AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]. Batasan yang baik ditulis dengan angka, grup yang disebut, dan konsekuensinya.", 1),
    ("Salah: 0,3572 JAUH di bawah ambang 0,80 — itu bukti model TIDAK adil merata antar grup pendidikan (SMA vs Lainnya).",
     "Salah: 0,3572 JAUH di bawah ambang 0,80 (aturan four-fifths) — itu bukti model TIDAK adil merata antar grup pendidikan (SMA vs Lainnya).", 1),
    ("AIR EDUCATION terendah 0,3572 (SMA) [M7.1].",
     "AIR EDUCATION terendah 0,3572 (SMA) [m71_by_group.EDUCATION.summary.air_min_over_max].", 1),
    # N4 noise: SHAP PAY_MAX 0,4946 -> kunci kanonik.
    ("(mean |SHAP| PAY_MAX 0,4946 [M7.3] — atribusi terbesar, bukan bukti kausal dan bukan korelasi)",
     "(mean |SHAP| PAY_MAX 0,4946 [m73_shap_gbm.global_mean_abs_shap_top12[0]] — atribusi terbesar, bukan bukti kausal dan bukan korelasi)", 1),
    # S5: owner vs validator vs legal/risk — pisah peran; gerbang (2) independen.
    ("(2) offline validation — paket lengkap diukur pada validation yang belum dipakai memilih; (3) legal/risk approval — penasihat hukum dan risk manager menandatangani template-nya, bukan slide-nya;",
     "(2) offline validation — paket lengkap diukur oleh validator independen (fungsi model risk/compliance, tidak melapor ke owner) pada validation yang belum dipakai memilih; (3) legal/risk approval — penasihat hukum dan fungsi legal/risk (lini kedua, independen dari owner) menandatangani template-nya, bukan slide-nya — tanda tangan ini adalah sign-off atas hasil validasi independen, bukan persetujuan diri sendiri;", 1),
    # N1: gerbang rollback (6) = verifikasi kriteria yang ditulis di gerbang (1).
    ("(6) rollback criteria — ditulis SEBELUM produksi (cabut v2 bila AIR SEX jatuh di bawah 0,80 selama 2 periode berturut-turut, atau ECE di atas 0,02 bertahan, atau review hukum menolak — dan kembalikan v1).",
     "(6) rollback criteria — DITETAPKAN sebelum gerbang (5) (ditulis di gerbang (1), bersama proposal) dan DIVERIFIKASI di sini: cabut v2 bila AIR SEX jatuh di bawah 0,80 (aturan four-fifths) selama 2 periode berturut-turut, atau ECE di atas 0,02 [kebijakan M7.5] bertahan, atau review hukum menolak — dan kembalikan v1.", 1),
    # Mini-case: [notebook] + owner + rollback (N6).
    ("(1) Model version: gbm-calibrated-v1 — HistGradientBoostingClassifier random_state=42, 31 fitur flagship v1.",
     "(1) Model version: gbm-calibrated-v1 — HistGradientBoostingClassifier random_state=42, 31 fitur flagship v1 [notebook].", 1),
    ("(2) Feature schema version: flagship-v1 — 31 fitur (23 mentah + 8 turunan: PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION, PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND).",
     "(2) Feature schema version: flagship-v1 — 31 fitur (23 mentah + 8 turunan [notebook]: PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION, PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND).", 1),
    ("(3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3.",
     "(3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3 [notebook].", 1),
    ("(8) Owner: [ilustrasi] — Risk Manager.",
     "(8) Owner: [ilustrasi] — Model Owner (peran bisnis/model development — owner tidak menandatangani persetujuannya sendiri; legal/risk approval di gerbang (3) datang dari fungsi independen).", 1),
    ("(9) Rollback version: tidak ada — v1 adalah versi produksi pertama; rencana rollback: nonaktifkan skor model, kembali ke keputusan manual [ilustrasi].",
     "(9) Rollback version: tidak ada versi model sebelumnya — v1 adalah versi produksi pertama; rollback plan: nonaktifkan skor model, kembali ke keputusan manual [ilustrasi].", 1),
    # Lab 2: [notebook] + rollback (N6) + owner (S5).
    ("calibration Platt/sigmoid cv=3;",
     "calibration Platt/sigmoid cv=3 [notebook];", 1),
    ("feature schema flagship-v1 (31 fitur);",
     "feature schema flagship-v1 (31 fitur [notebook]);", 1),
    ("rollback version [ilustrasi] (v1 versi produksi pertama);",
     "rollback version: tidak ada versi model sebelumnya — v1 versi produksi pertama (rollback plan: kembali ke keputusan manual [ilustrasi]);", 1),
    ('"owner": "[ilustrasi] Risk Manager",',
     '"owner": "[ilustrasi] Model Owner (bisnis)",', 2),
    ('"rollback_version": "[ilustrasi] tidak ada — v1 versi produksi pertama; rencana: kembali ke keputusan manual",',
     '"rollback_version": "tidak ada versi model sebelumnya — v1 versi produksi pertama; rollback plan: kembali ke keputusan manual [ilustrasi]",', 2),
    # Checkpoint rangkuman: ECE [M6.4] + PSI AGE kunci kanonik.
    ("terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M7.5], Brier 0,1345",
     "terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M6.4], Brier 0,1345", 2),
    ("dan terukur (PSI train-vs-test tertinggi AGE 0,0029 [M7.5]).",
     "dan terukur (PSI train-vs-test tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi]).", 2),
]


M84 = "src/app/v2/content/mlf-m84-deployment-shadow-canary-champion.ts"
M84_PAIRS = [
    # S7/N5 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; champion GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05;",
     "31 fitur [notebook]; champion GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05;", 1),
    # S7+S3: aturan TAHAN bila PSI 0,10-0,25 tanpa bad rate buruk; ambang canary vs gate naik.
    ("TAHAN bila bad rate 8–10% DAN PSI skor ≤ 0,10 (zona abu-abu: kumpulkan data lagi di ramp yang sama, jangan naik); STOP bila bad rate > 10% ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut. Ambang 8% dipilih dari baseline champion: bad rate champion 6,67% [notebook] ditambah toleransi 1,33 poin persen — challenger boleh sedikit lebih buruk, tidak boleh jauh lebih buruk.",
     "TAHAN bila bad rate 8–10% DAN PSI skor ≤ 0,10 (zona abu-abu: kumpulkan data lagi di ramp yang sama, jangan naik) — dan TAHAN juga bila PSI skor 0,10–0,25 tanpa bad rate buruk (PSI naik tanpa bukti kerugian: jangan naik, kumpulkan data lagi; bila TAHAN itu berulang, STOP); STOP bila bad rate > 10% ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut. Ambang 8% dipilih dari baseline champion: bad rate champion 6,67% [notebook] ditambah toleransi 1,33 poin persen — challenger boleh sedikit lebih buruk, tidak boleh jauh lebih buruk. Ambang 8% (toleransi 1,33 pp) adalah ambang CANARY — lebih longgar dari ambang gate naik G2 (7,67%, toleransi 1,00 pp): canary hanya mengizinkan ramp berikutnya, gate naik memutuskan penggantian penuh — keputusan yang lebih besar memakai ambang yang lebih ketat.", 1),
    # S2: basis traffic canary 1 periode = 12.000 aplikasi masuk.
    ("Nilai [simulasi] — canary atas challenger LR dengan parameter eksplisit (bukan observasi live): ramp 1% (n = 120, disetujui 26, default 2, PSI skor 0,02)",
     "Nilai [simulasi] — canary atas challenger LR dengan parameter eksplisit (bukan observasi live). Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk — jadi 1% = 120, 5% = 600; ramp 5% diperpanjang mengakumulasi 5 periode pada 5% sampai terkumpul 3.000 nasabah (25% dari basis 12.000), bukan «5% dari test 6.000». Ramp 1% (n = 120, disetujui 26, default 2, PSI skor 0,02)", 1),
    # S7: figure + caption — baris TAHAN eksplisit.
    ("Gate tiap ramp [kebijakan lesson ini]: LANJUT bila bad ≤ 8% &amp; PSI ≤ 0,10; STOP bila bad &gt; 10% / PSI &gt; 0,25 / dua TAHAN.",
     "Gate tiap ramp [kebijakan lesson ini]: LANJUT bila bad ≤ 8% &amp; PSI ≤ 0,10; TAHAN bila bad 8–10% &amp; PSI ≤ 0,10, atau PSI 0,10–0,25 tanpa bad rate buruk; STOP bila bad &gt; 10% / PSI &gt; 0,25 / dua TAHAN.", 1),
    ("Gate tiap ramp [kebijakan lesson ini]: LANJUT bila bad rate ≤ 8% dan PSI skor ≤ 0,10; STOP bila bad rate > 10%, PSI skor > 0,25, atau dua TAHAN berturut-turut.",
     "Gate tiap ramp [kebijakan lesson ini]: LANJUT bila bad rate ≤ 8% dan PSI skor ≤ 0,10; TAHAN bila bad rate 8–10% dan PSI skor ≤ 0,10, atau PSI skor 0,10–0,25 tanpa bad rate buruk; STOP bila bad rate > 10%, PSI skor > 0,25, atau dua TAHAN berturut-turut.", 1),
    # S6: approve-all 82.155.456 = realised loss seluruh test (bukan EL 78.675.378).
    ("approve-all NT$82.155.456, reject-all NT$41.260.500",
     "approve-all NT$82.155.456 (realised loss seluruh test [m8_approve_all_realised_loss] — BUKAN expected loss NT$78.675.378 di M8.2), reject-all NT$41.260.500", 1),
    # M3: 1.166 LR terkalibrasi + ekonomi (profit/bad rate) vs champion.
    ("Bukti bahwa artefaknya hanya sebagian: bila LR dikalibrasi Platt [M6.4], ambang 0,10-nya menyetujui 1.166 nasabah — tetap jauh dari 1.710 champion. Jadi kalibrasi bukan penjelasan utama kekalahan ini; ranking LR memang lebih lemah (ROC-AUC 0,7426 vs 0,7816).",
     "Bukti bahwa artefaknya hanya sebagian: bila LR dikalibrasi Platt [M6.4], ambang 0,10-nya menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] — tetap jauh dari 1.710 champion; dan ekonominya tetap kalah jauh: LR terkalibrasi profit +NT$1.886.500 (bad rate 9,09%) vs champion +NT$8.214.000 (bad rate 6,67%) — kalibrasi hanya menambah NT$63.500 di atas LR mentah (+NT$1.823.000), masih NT$6.327.500 di bawah champion. Jadi kalibrasi bukan penjelasan utama kekalahan ini; ranking LR memang lebih lemah (ROC-AUC 0,7426 vs 0,7816).", 1),
    ("bukti artefaknya hanya sebagian: LR terkalibrasi Platt [M6.4] menyetujui 1.166 nasabah, tetap jauh dari 1.710 champion.",
     "bukti artefaknya hanya sebagian: LR terkalibrasi Platt [M6.4] menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] (profit +NT$1.886.500 vs +NT$8.214.000), tetap jauh dari 1.710 champion.", 2),
    # N1: sumbu figure 206 -> 200 (batang berakhir y=200).
    ('<line x1="20" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>',
     '<line x1="20" y1="200" x2="466" y2="200" stroke="var(--chart-text)" stroke-width="1"/>', 1),
    # N3: G4 "GAGAL ISI" — kriteria shadow-mode eksplisit (definisi + vonis).
    ("G4 DISAGREEMENT — laporkan disagreement rate; bila di atas 25%, investigasi sel shadow sebelum naik (di sini 19,42% — di bawah ambang, tapi selnya buruk, jadi gate ini lolos angka dan gagal isi).",
     "G4 DISAGREEMENT — laporkan disagreement rate; bila di atas 25%, investigasi sel shadow sebelum naik. Kriteria isi sel shadow (langkah 5): gate GAGAL ISI bila bad rate sel challenger-only approvals melebihi bad rate champion, atau bila mayoritas sel challenger-only rejections adalah nasabah baik. Di sini 19,42% — di bawah ambang, tapi selnya buruk (335 approvals bad rate 18,21% > 6,67%; 830 rejections 92,29% baik), jadi gate ini lolos angka dan gagal isi.", 1),
    ("G4 GAGAL ISI (disagreement 19,42% di bawah 25%, tapi sel shadow-nya buruk di kedua arah: 335 approvals bad rate 18,21%, 830 rejections good rate 92,29%).",
     "G4 GAGAL ISI (disagreement 19,42% di bawah 25%, tapi sel shadow-nya buruk di kedua arah menurut kriteria langkah 5: sel approvals challenger-only bad rate 18,21% > bad rate champion 6,67%, dan sel rejections challenger-only 92,29% nasabah baik — mayoritas yang ditolak justru nasabah baik).", 1),
    # N4: ECE WASPADA vs KRITIS disamakan (ECE > 0,02 = WASPADA, bukan KRITIS).
    ("G5 MONITORING — tidak ada alert KRITIS M7.5 [M7.5] pada ramp mana pun (PSI skor > 0,25, bad rate > 10%, ECE > 0,02 dua periode).",
     "G5 MONITORING — tidak ada alert KRITIS M7.5 [M7.5] pada ramp mana pun (PSI skor > 0,25; bad rate > 10% dua periode; ROC-AUC turun > 0,02 dua periode; PR-AUC turun > 0,03 dua periode). ECE di atas 0,02 adalah WASPADA, bukan pemicu KRITIS (langkah 8).", 1),
    # S4: AIR [M7.5] -> [M7.1] (G6 + note champion).
    ("G6 FAIRNESS — AIR per grup tidak di bawah 0,80 [M7.5].",
     "G6 FAIRNESS — AIR per grup tidak di bawah 0,80 [M7.1].", 1),
    ("Champion tetap punya bad rate 6,67%, cost NT$33.046.500, dan AIR SEX 0,869 [M7.5].",
     "Champion tetap punya bad rate 6,67%, cost NT$33.046.500, dan AIR SEX 0,869 [M7.1].", 1),
    # M1: "gagal 4 gate" -> "gagal 5 gate (G1, G2, G3, G4, G7)".
    ("Challenger ini gagal 4 gate, 2 belum diuji, 0 lolos.",
     "Challenger ini gagal 5 gate (G1, G2, G3, G4, G7), 2 belum diuji, 0 lolos.", 1),
    # M2+N4+S1: monitoring-gates — baseline PER MODEL + gap + ECE WASPADA.
    ("Di tiap ramp canary, dashboard yang sama dibaca (PSI skor, ROC-AUC/PR-AUC, approval rate, bad rate, skor rata-rata, ECE) dengan ambang yang sama: PSI skor di atas 0,1 = WASPADA, di atas 0,25 = KRITIS; ROC-AUC turun lebih dari 0,02 dari baseline 0,7816 = WASPADA, 2 periode = KRITIS; PR-AUC turun lebih dari 0,03 = WASPADA, 2 periode = KRITIS; bad rate di atas 10% = WASPADA, 2 periode = KRITIS; ECE di atas 0,02 = WASPADA; approval bergerak lebih dari 5 poin persen dari baseline 28,5% = PANTAU (beri tahu bisnis).",
     "Di tiap ramp canary, dashboard yang sama dibaca (PSI skor, ROC-AUC/PR-AUC, approval rate, bad rate, skor rata-rata, ECE) dengan ambang yang sama — tetapi baseline PER MODEL: champion [M6.4/M7.4] ROC-AUC 0,7816, PR-AUC 0,5558, approval 28,5%, bad rate 6,67%; challenger (LR mentah) ROC-AUC 0,7426, PR-AUC 0,5049, approval 20,25%, bad rate 9,14%. Setiap metrik dibaca terhadap baseline modelnya sendiri — dan SELISIH champion−challenger (gap ROC-AUC 0,0390, gap bad rate 2,47 pp, gap approval 8,25 pp, gap profit NT$6.391.000) adalah metrik tersendiri: gap yang melebar di live berarti challenger makin tertinggal, walau masing-masing masih di dalam ambangnya. Ambangnya: PSI skor di atas 0,1 = WASPADA, di atas 0,25 = KRITIS; ROC-AUC turun lebih dari 0,02 dari baseline modelnya (champion 0,7816; challenger 0,7426) = WASPADA, 2 periode = KRITIS; PR-AUC turun lebih dari 0,03 = WASPADA, 2 periode = KRITIS; bad rate di atas 10% = WASPADA, 2 periode = KRITIS; ECE di atas 0,02 = WASPADA (tetap WASPADA walau bertahan dua periode — ia tidak naik menjadi KRITIS; yang naik menjadi KRITIS setelah dua periode adalah ROC-AUC, PR-AUC, dan bad rate); approval bergerak lebih dari 5 poin persen dari baseline 28,5% = PANTAU (beri tahu bisnis).", 1),
    ("(2) ROC-AUC/PR-AUC vs baseline 0,7816/0,5558 (cohort matang saja); (3) approval + bad rate vs 28,5%/6,67% (bad rate cohort matang saja); (4) skor rata-rata + ECE vs 0,2217/0,0087;",
     "(2) ROC-AUC/PR-AUC vs baseline PER MODEL — champion 0,7816/0,5558, challenger 0,7426/0,5049 (cohort matang saja); (3) approval + bad rate vs baseline PER MODEL — champion 28,5%/6,67%, challenger 20,25%/9,14% (bad rate cohort matang saja); (4) skor rata-rata (mean calibrated proba [notebook]) + ECE vs 0,2217/0,0087;", 1),
    # N7: 0,1058/0,0965 ADA di kanonik m74 -> sitir [M7.4] (bukan [ilustrasi]).
    ("bila deployment memakai threshold per grup (misal 0,1058/0,0965), rollback mengembalikan threshold TUNGGAL 0,10, bukan threshold per grup yang terakhir;",
     "bila deployment memakai threshold per grup (0,1058/0,0965 [M7.4]), rollback mengembalikan threshold TUNGGAL 0,10, bukan threshold per grup yang terakhir;", 1),
    # N6: "di bawah 30 menit" -> [kebijakan lesson ini].
    ("ukur waktunya (target: di bawah 30 menit dari keputusan ke traffic kembali)",
     "ukur waktunya (target [kebijakan lesson ini]: di bawah 30 menit dari keputusan ke traffic kembali)", 1),
    # S5 noise: ECE 0,1003 simulasi S2 -> kunci kanonik.
    ("(ECE 0,0087 di test bisa menjadi 0,1003 seperti simulasi S2 M7.5 [M7.5]).",
     "(ECE 0,0087 di test bisa menjadi 0,1003 seperti simulasi S2 M7.5 [m75_drift_simulations.S2_pay_plus1.ece_10bin]).", 1),
    # M1: mini-case — G7 di jawaban + mitigasi.
    ("Ketiga, GATE: G1 gagal, G2 gagal (9,14% > 7,67%), G3 gagal (LR mentah, belum dikalibrasi), G4 gagal isi — 0 dari 7 gate lolos, 2 belum diuji.",
     "Ketiga, GATE: G1 gagal, G2 gagal (9,14% > 7,67%), G3 gagal (LR mentah, belum dikalibrasi), G4 gagal isi, G7 gagal (tidak ada dua periode lolos) — 0 dari 7 gate lolos, 2 belum diuji.", 1),
    ("bukti [M6.4] menunjukkan kalibrasi saja tidak menutup kesenjangan (1.166 vs 1.710 disetujui), tapi perbandingan yang benar menuntutnya;",
     "bukti [m8_lr_calibrated_thr010] menunjukkan kalibrasi saja tidak menutup kesenjangan (1.166 vs 1.710 disetujui; profit +NT$1.886.500 vs +NT$8.214.000), tapi perbandingan yang benar menuntutnya;", 1),
    ("gate yang gagal (G1, G2, G3, G4), dan syarat untuk mencoba lagi (kalibrasi + bukti baru).",
     "gate yang gagal (G1, G2, G3, G4, G7), dan syarat untuk mencoba lagi (kalibrasi + bukti baru).", 1),
    # N2: "14 kali" -> "hampir 14 kali (13,84×)" (lab1 prose + check msg + kuis).
    ("Bacalah χ² itu: 209,473 adalah 14 kali nilai kritis 15,1367 — bukan «sedikit signifikan», melainkan berbeda jauh melampaui keraguan.",
     "Bacalah χ² itu: 209,473 adalah hampir 14 kali nilai kritis 15,1367 (13,84×) — bukan «sedikit signifikan», melainkan berbeda jauh melampaui keraguan.", 1),
    ("McNemar dengan koreksi kontinuitas: (494)² / 1.165 = 209,473 — 14 kali nilai kritis 15,1367 pada p = 0,0001.",
     "McNemar dengan koreksi kontinuitas: (494)² / 1.165 = 209,473 — hampir 14 kali (13,84×) nilai kritis 15,1367 pada p = 0,0001.", 1),
    ("χ² besar berarti bukti perbedaan SANGAT kuat — 209,473 adalah 14 kali nilai kritis 15,1367.",
     "χ² besar berarti bukti perbedaan SANGAT kuat — 209,473 adalah hampir 14 kali (13,84×) nilai kritis 15,1367.", 1),
    # S2+S7: lab 2 — aturan TAHAN + basis traffic di prose dan komentar kode.
    ("TAHAN bila bad rate ≤ 0,10 DAN PSI skor ≤ 0,10 (zona abu-abu — kumpulkan data lagi di ramp yang sama); STOP bila bad rate > 0,10 ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut; ROLLBACK bila keputusan akhirnya STOP (traffic kembali 100% ke champion). Data per ramp [simulasi] — parameter eksplisit, bukan observasi live: R1 1% (n = 120, disetujui 26, default 2, PSI 0,02); R2 5% (n = 600, disetujui 123, default 11, PSI 0,05); R2-ext 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI 0,06).",
     "TAHAN bila bad rate ≤ 0,10 DAN PSI skor ≤ 0,10 (zona abu-abu — kumpulkan data lagi di ramp yang sama), dan TAHAN juga bila PSI skor 0,10–0,25 tanpa bad rate buruk; STOP bila bad rate > 0,10 ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut; ROLLBACK bila keputusan akhirnya STOP (traffic kembali 100% ke champion). Data per ramp [simulasi] — parameter eksplisit, bukan observasi live. Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk (1% = 120; 5% = 600); R2-ext mengakumulasi 5 periode pada 5% sampai terkumpul 3.000 nasabah. R1 1% (n = 120, disetujui 26, default 2, PSI 0,02); R2 5% (n = 600, disetujui 123, default 11, PSI 0,05); R2-ext 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI 0,06).", 1),
    ("#   TAHAN bila bad rate <= 0,10 DAN PSI skor <= 0,10 (zona abu-abu: kumpulkan data lagi)",
     "#   TAHAN bila bad rate <= 0,10 DAN PSI skor <= 0,10 (zona abu-abu: kumpulkan data lagi)\n#   TAHAN juga bila PSI skor 0,10-0,25 tanpa bad rate buruk (PSI naik tanpa bukti kerugian: jangan naik)", 2),
    ("# Data per ramp [simulasi] — parameter eksplisit, bukan observasi live:",
     "# Data per ramp [simulasi] — parameter eksplisit, bukan observasi live:\n# Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk (1% = 120; 5% = 600); R2-ext = 5 periode @ 600 = 3.000", 2),
    # Checkpoint rangkuman: monitoring gates per model + ECE WASPADA.
    ("Monitoring gates meminjam M7.5 [M7.5] — PSI > 0,1 waspada / > 0,25 kritis, ROC-AUC turun > 0,02, PR-AUC turun > 0,03, bad rate > 10%, ECE > 0,02 — dibaca per ramp per model, metrik tanpa label segera, metrik berlabel hanya cohort matang.",
     "Monitoring gates meminjam M7.5 [M7.5] — PSI > 0,1 waspada / > 0,25 kritis, ROC-AUC turun > 0,02, PR-AUC turun > 0,03, bad rate > 10%, ECE > 0,02 (WASPADA, bukan KRITIS) — dibaca per ramp per model terhadap baseline modelnya sendiri (champion 0,7816/0,5558/28,5%/6,67%; challenger 0,7426/0,5049/20,25%/9,14%) plus gap champion−challenger sebagai metrik tersendiri; metrik tanpa label segera, metrik berlabel hanya cohort matang.", 1),
]

M85 = "src/app/v2/content/mlf-m85-governance-approval-workflow.ts"
M85_PAIRS = [
    # N1 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook].",
     "31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook].", 1),
    # S4: tugas validator — conceptual soundness + outcomes analysis + monitoring + three lines.
    ("Tugasnya: mengulang perhitungan pada data yang belum dipakai memilih, menulis opini validasi — termasuk kelemahannya — dan berkata TIDAK bila buktinya tidak cukup.",
     "Tugasnya: menilai conceptual soundness desain, mengulang perhitungan pada data yang belum dipakai memilih (outcomes analysis), dan memakai hasil monitoring [M7.5] sebagai input — lalu menulis opini validasi — termasuk kelemahannya — dan berkata TIDAK bila buktinya tidak cukup. Pemetaannya ke three lines [M8.1]: owner = lini 1, validator/komite = lini 2, audit = lini 3 (melapor ke dewan/komite audit, bukan ke owner).", 1),
    # N4: tier komite — rujuk angka materiality M8.2.
    ("Tugasnya: menyetujui atau menolak proposal, menetapkan tier risiko model, dan mencabut persetujuan bila revalidasi gagal.",
     "Tugasnya: menyetujui atau menolak proposal, menetapkan tier risiko model [M8.2] (total limit test NT$1.007.777.680; approved NT$424.180.000, share 0,4209; EL approved NT$11.989.453; EL seluruh test NT$78.675.378), dan mencabut persetujuan bila revalidasi gagal.", 1),
    # N6/N7/S3: baris RACI proposal + validasi + sign-off.
    ("Proposal perubahan: R = model owner (menulis proposal + angka dampak), A = model owner, C = validator dan risk manager, I = komite dan tim bisnis.",
     "Proposal perubahan: R = model owner (menulis proposal + angka dampak), A = model owner, C = validator (hanya kelayakan data/metodologi, bukan isi keputusan) dan risk manager, I = komite dan tim bisnis.", 1),
    ("Validasi independen [M8.1]: R = validator, A = komite (yang menerima atau menolak opini validasi), C = model owner (menjelaskan desain, bukan menilai hasilnya), I = audit internal.",
     "Validasi independen [M8.1]: R = validator, A = validator (atas isi opini — komite menerima atau menolak opini itu di baris sign-off), C = model owner (menjelaskan desain, bukan menilai hasilnya), I = audit internal.", 1),
    ("Sign-off: R = masing-masing penandatangan atas bagiannya, A = komite (keputusan akhir pakai/tidak), C = legal dan risk manager, I = tim bisnis.",
     "Sign-off: R = validator (opini), model owner (pemakaian bisnis), legal/risk (kepatuhan); A = komite; C = —; I = tim bisnis, audit.", 1),
    # M3: PSI 0,5811 = simulasi drift S2 (semua kemunculan).
    ("Analis monitoring yang melihat PSI 0,5811 [M7.5] tetap harus berteriak walau hurufnya hanya R di baris monitoring — bukan A.",
     "Analis monitoring yang melihat PSI simulasi drift S2 0,5811 [m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test] tetap harus berteriak walau hurufnya hanya R di baris monitoring — bukan A.", 1),
    ("(3) TEMUAN MONITORING [M7.5]: PSI skor di atas 0,25 (geser besar — seperti simulasi S2, 0,5811), ROC-AUC turun lebih dari 0,02 atau PR-AUC turun lebih dari 0,03 dalam 2 periode berturut-turut, ECE di atas 0,02 yang bertahan, atau alert fairness yang menyala — AIR grup mana pun di bawah 0,80 selama 2 periode berturut-turut.",
     "(3) TEMUAN MONITORING [M7.5]: PSI skor di atas 0,25 [kebijakan lesson ini] (geser besar — seperti simulasi drift S2, PSI 0,5811 [m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test]), ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] atau PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode berturut-turut, ECE di atas 0,02 [kebijakan lesson ini] yang bertahan, atau alert fairness yang menyala — AIR grup mana pun di bawah 0,80 [kebijakan lesson ini] selama 2 periode berturut-turut.", 1),
    ("PSI 0,5811 tidak perlu diperdebatkan; ia sudah masuk daftar pemicu sejak hari pertama.",
     "PSI simulasi drift S2 0,5811 tidak perlu diperdebatkan; ia sudah masuk daftar pemicu sejak hari pertama.", 1),
    ("jadwal tahunan tidak menolong bila PSI sudah 0,5811 di bulan ketiga.",
     "jadwal tahunan tidak menolong bila PSI sudah 0,5811 (simulasi drift S2) di bulan ketiga.", 1),
    # S6 noise: chunk 2/3 -> kunci kanonik.
    ("Chunk 2 [waktu semu] — ROC-AUC 0,7428, bad rate 10,74% — lalu chunk 3 membaik ke 0,8138;",
     "Chunk 2 [waktu semu] — ROC-AUC 0,7428, bad rate 10,74% [m75_pseudo_time_chunks_test] — lalu chunk 3 membaik ke 0,8138;", 1),
    # S6 noise: AIR SEX 0,15 = 0,8906 -> kunci kanonik (2 situs).
    ("AIR SEX pada 0,15 justru 0,8906, sedikit lebih baik dari 0,8694 pada 0,10 [M7.1]",
     "AIR SEX pada 0,15 justru 0,8906 [m71_air_sex_by_threshold.0.15.air], sedikit lebih baik dari 0,8694 pada 0,10 [M7.1]", 1),
    ("AIR SEX (0,8694 ke 0,8906 [M7.1] — fairness sedikit MEMBAIK, jadi bukan alasan menolak)",
     "AIR SEX (0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air] — fairness sedikit MEMBAIK, jadi bukan alasan menolak)", 1),
    # S2: kadensi monitoring — pisah tanpa-label (harian) vs berlabel (per periode).
    ("Tahap 5, MONITORING [M7.5]: PSI skor, ROC-AUC/PR-AUC per periode, dan alert fairness terpisah — dibaca tiap pagi oleh analis, mingguan oleh risk manager.",
     "Tahap 5, MONITORING [M7.5]: DUA kolom yang dibaca dengan kadensi berbeda. Harian (tanpa label, tersedia segera): PSI skor, distribusi skor, approval rate, dan AIR — dibaca tiap pagi oleh analis. Per periode SETELAH label matang (jendela observasi 1 bulan [M7.5]): ROC-AUC/PR-AUC, bad rate yang disetujui, dan ECE — dibaca mingguan oleh risk manager, karena metrik berlabel selalu tertinggal dari PSI: temuan berbasis label datang berminggu-minggu setelah PSI sudah berteriak.", 1),
    # M1+M2+S5: gerbang 6 = VERIFIKASI kriteria rollback (ditulis di gerbang 1).
    ("(6) ROLLBACK CRITERIA — ditulis SEBELUM produksi: kapan versi baru dicabut, dan ke versi apa kembali.",
     "(6) ROLLBACK CRITERIA — VERIFIKASI kriteria rollback yang ditulis di gerbang (1), sebelum produksi: kapan versi baru dicabut, dan ke versi apa kembali.", 1),
    ("Enam gerbang ini berlaku untuk perubahan model, fitur, kalibrasi, data, kode, DAN threshold — karena semuanya mengubah keputusan.",
     "Enam gerbang ini berlaku untuk perubahan model, fitur, kalibrasi, data, kode, DAN threshold — karena semuanya mengubah keputusan. Pemetaan ke lima tahap (Langkah 4): gerbang 1 = tahap 1 (proposal); gerbang 2 = tahap 2 (validasi); gerbang 3 = legal/risk approval + sign-off komite (Langkah 5); gerbang 4–5 = tahap deploy (Langkah 4); gerbang 6 = verifikasi kriteria rollback yang ditulis di gerbang 1.", 1),
    ('<line x1="394" y1="88" x2="394" y2="112" stroke="var(--text)" stroke-width="2"/>\n<polygon points="390,112 398,112 394,120" fill="var(--text)"/>',
     '<polyline points="394,88 394,100 82,100 82,112" fill="none" stroke="var(--text)" stroke-width="2"/>\n<polygon points="78,112 86,112 82,120" fill="var(--text)"/>', 1),
    (">6 Rollback criteria</text>",
     ">6 Rollback gate</text>", 1),
    (">ditulis SEBELUM live</text>",
     ">verifikasi — ditulis di gerbang 1</text>", 1),
    ('aria-label="Change control enam gerbang: 1 Proposal, 2 Offline validation, 3 Legal risk approval, 4 Shadow canary, 5 Production, 6 Rollback criteria; pemicu revalidasi kembali ke gerbang 1; rollback versi 2 adalah threshold tunggal 0,10"',
     'aria-label="Change control enam gerbang: 1 Proposal, 2 Offline validation, 3 Legal risk approval, 4 Shadow canary, 5 Production, 6 Rollback gate (verifikasi kriteria yang ditulis di gerbang 1); pemicu revalidasi kembali ke gerbang 1; rollback versi 2 adalah threshold tunggal 0,10"', 1),
    ('alt: "Change control enam gerbang: 1 Proposal, 2 Offline validation, 3 Legal risk approval, 4 Shadow canary, 5 Production, 6 Rollback criteria; pemicu revalidasi kembali ke gerbang 1; rollback v2 adalah threshold tunggal 0,10."',
     'alt: "Change control enam gerbang: 1 Proposal, 2 Offline validation, 3 Legal risk approval, 4 Shadow canary, 5 Production, 6 Rollback gate (verifikasi kriteria yang ditulis di gerbang 1); pemicu revalidasi kembali ke gerbang 1; rollback v2 adalah threshold tunggal 0,10."', 1),
    ("Gerbang 6 berwarna berbeda karena ia ditulis SEBELUM produksi, bukan sesudah masalah datang.",
     "Gerbang 6 berwarna berbeda karena ia MEMVERIFIKASI kriteria rollback yang ditulis di gerbang 1, sebelum produksi — bukan sesudah masalah datang.", 1),
    # N3: 19,42% dari dua model, bukan dari perubahan threshold.
    ("shadow menangkap perbedaan keputusan per nasabah (pada model kita, 19,42% keputusan berubah antara champion dan challenger [M8]);",
     "shadow menangkap perbedaan keputusan per nasabah (pada model kita, 19,42% keputusan berubah antara champion dan challenger [M8] — angka ini dari dua model yang berbeda, bukan dari perubahan threshold; untuk perubahan threshold, tabel keputusan yang berubah dihitung ulang di gerbang 4);", 1),
    # N2: argumen "0,10 berarti beda" via selisih ROC-AUC -> Brier + approval.
    ("dan keduanya berarti hal yang berbeda (GBM mentah ROC-AUC 0,7823 vs terkalibrasi 0,7816 [M6.4] adalah dua model yang berbeda).",
     "dan keduanya berarti hal yang berbeda (pemetaan probabilitas berbeda: Brier mentah 0,1342 vs terkalibrasi 0,1345; LR mentah pada 0,10 menyetujui 20,25% vs champion 28,5% [M8]).", 1),
    # S1: mini-case gerbang 6 + ambang kebijakan.
    ("GERBANG 6 — ROLLBACK CRITERIA, ditulis SEBELUM produksi: cabut 0,15 dan kembali ke 0,10 bila bad rate yang disetujui melewati ambang yang ditulis (misalnya di atas 10% selama 2 periode [M7.5]) atau AIR SEX jatuh di bawah 0,80.",
     "GERBANG 6 — ROLLBACK CRITERIA, VERIFIKASI kriteria yang ditulis di gerbang 1 sebelum produksi: cabut 0,15 dan kembali ke 0,10 bila bad rate yang disetujui melewati ambang yang ditulis (misalnya di atas 10% selama 2 periode [kebijakan lesson ini]) atau AIR SEX jatuh di bawah 0,80 [kebijakan lesson ini].", 1),
    # N5: "tanpa drift" -> "tanpa TREN penurunan sistematis" + kunci kanonik.
    ("rentang ROC-AUC antar-chunk 0,0710 tanpa drift [M7.5]",
     "fluktuasi antar-chunk 0,0710 tanpa TREN penurunan sistematis [m75_pseudo_time_roc_spread]", 1),
    # Checkpoint rangkuman: gerbang 6 + ambang kebijakan + AIR 0,8906.
    ("enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → production → rollback criteria, ditulis sebelum produksi);",
     "enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → production → rollback criteria, verifikasi kriteria yang ditulis di gerbang 1 sebelum produksi);", 2),
    ("temuan monitoring [M7.5] (PSI skor di atas 0,25, ROC-AUC turun lebih dari 0,02 / PR-AUC turun lebih dari 0,03 dalam 2 periode, ECE di atas 0,02 bertahan, AIR di bawah 0,80 selama 2 periode),",
     "temuan monitoring [M7.5] (PSI skor di atas 0,25 [kebijakan lesson ini], ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] / PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode, ECE di atas 0,02 [kebijakan lesson ini] bertahan, AIR di bawah 0,80 [kebijakan lesson ini] selama 2 periode),", 2),
    ("Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [M7.1], profit masih positif)",
     "Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air], profit masih positif)", 2),
]


def main():
    ap = argparse.ArgumentParser(description="Fix review DeepSeek M8 (TS saja; mirror .md skrip terpisah).")
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    dry = args.dry
    total = 0
    total += apply(M81, M81_PAIRS, dry)
    total += apply(M82, M82_PAIRS, dry)
    total += apply(M83, M83_PAIRS, dry)
    total += apply(M84, M84_PAIRS, dry)
    total += apply(M85, M85_PAIRS, dry)
    print(f"\nTOTAL pasangan terapkan: {total}" + (" (DRY-RUN, tidak ada file diubah)" if dry else ""))


if __name__ == "__main__":
    main()
