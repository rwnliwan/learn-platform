#!/usr/bin/env python3
"""Ronde FIX review DeepSeek M8 (Learn v2 MLF) — MIRROR .md — 13 Nov 2026.

Pasangan TS ada di fix_m8_review.py; skrip ini menerapkan padanan prose
ke mirror content/mlf-m8*.md (sumber chapters.ts legacy).
Setiap pasangan (old, new, expect) WAJIB cocok tepat expect kali —
bila tidak, file itu TIDAK ditulis dan kegagalan dilaporkan.

Cara pakai:
    python3 qa-learn/fix_m8_review_md.py --dry
    python3 qa-learn/fix_m8_review_md.py
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


MD81 = "content/mlf-m81-model-validation-framework.md"
MD81_PAIRS = [
    # S7 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook].",
     "31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook].", 1),
    # N6: SR 11-7 / OCC 2011-12.
    ("Framework validasi itu punya nama dan aturan main yang ditulis regulator: SR 11-7, guidance Federal Reserve tentang model risk management (2011).",
     "Framework validasi itu punya nama dan aturan main yang ditulis regulator: SR 11-7 (Federal Reserve) / OCC 2011-12, guidance tentang model risk management (2011).", 1),
    ("SR 11-7 adalah guidance Federal Reserve (2011) tentang model risk management",
     "SR 11-7 (Federal Reserve) / OCC 2011-12 adalah guidance (2011) tentang model risk management", 1),
    ("- SR 11-7 (Federal Reserve, 2011): model risk = potensi kerugian dari keputusan berbasis output model yang salah atau disalahgunakan; tiga pilar — (1) development, implementation, and use; (2) validation; (3) governance.",
     "- SR 11-7 (Federal Reserve) / OCC 2011-12 (2011): model risk = potensi konsekuensi merugikan (finansial maupun non-finansial) dari keputusan berbasis output model yang salah atau disalahgunakan; tiga elemen — (1) development, implementation, and use; (2) validation; (3) governance.", 1),
    # N3: definisi "kerugian" -> "konsekuensi merugikan".
    ("model risk adalah potensi KERUGIAN akibat keputusan yang didasarkan pada output model yang SALAH atau DISALAHGUNAKAN. Dua sumber kerugian yang berbeda: model yang salah (asumsinya keliru, datanya cacat, kalibrasinya rusak) dan model yang disalahgunakan (modelnya benar, tapi dipakai di luar batasnya",
     "model risk adalah potensi KONSEKUENSI MERUGIKAN (finansial maupun non-finansial) akibat keputusan yang didasarkan pada output model yang SALAH atau DISALAHGUNAKAN. Dua sumber konsekuensi merugikan yang berbeda: model yang salah (asumsinya keliru, datanya cacat, kalibrasinya rusak) dan model yang disalahgunakan (modelnya benar, tapi dipakai di luar batasnya", 1),
    # N9: "pilar" -> "elemen".
    ("**Tiga pilar SR 11-7:**",
     "**Tiga elemen SR 11-7:**", 1),
    ("tiga pilar ini bagus karena ia memisahkan tiga pertanyaan yang sering dicampur: «apakah modelnya dibangun dengan benar?» (pilar 1), «apakah modelnya TERBUKTI benar?» (pilar 2), dan «siapa yang bertanggung jawab bila ternyata salah?» (pilar 3).",
     "tiga elemen ini bagus karena ia memisahkan tiga pertanyaan yang sering dicampur: «apakah modelnya dibangun dengan benar?» (elemen 1), «apakah modelnya TERBUKTI benar?» (elemen 2), dan «siapa yang bertanggung jawab bila ternyata salah?» (elemen 3).", 1),
    ("Buruk bila dibaca sebagai CHECKLIST: «kami sudah menjalankan tiga pilar» tidak berarti apa-apa bila validasinya hanya memeriksa ROC-AUC atau bila validatornya adalah tim yang sama dengan pembangunnya.",
     "Buruk bila dibaca sebagai CHECKLIST: «kami sudah menjalankan tiga elemen» tidak berarti apa-apa bila validasinya hanya memeriksa ROC-AUC atau bila validatornya adalah tim yang sama dengan pembangunnya.", 1),
    ("untuk setiap model, tulis tiga baris sebelum validasi dimulai — siapa pemilik model (pilar 1), siapa validator independennya (pilar 2), dan siapa pengambil keputusan akhirnya (pilar 3).",
     "untuk setiap model, tulis tiga baris sebelum validasi dimulai — siapa pemilik model (elemen 1), siapa validator independennya (elemen 2), dan siapa pengambil keputusan akhirnya (elemen 3).", 1),
    ("Conceptual soundness adalah pilar pertama validasi:",
     "Conceptual soundness adalah elemen pertama validasi:", 1),
    # N5: "memang tidak linear" -> "konsisten dengan hubungan yang tidak linear".
    ("Itu sebabnya GBM mentah (ROC-AUC 0,7823) mengalahkan LR (0,7426): hubungan di data ini memang tidak linear.",
     "Itu sebabnya GBM mentah (ROC-AUC 0,7823) mengalahkan LR (0,7426): konsisten dengan hubungan yang tidak linear — belum diuji dengan spline atau interaksi, jadi ini bukti yang mendukung, bukan pembuktian.", 1),
    # N8: lini 3 melapor ke komite audit.
    ("ketiganya melapor ke dewan/komite risiko — bukan satu sama lain. Lini kedua TIDAK melapor ke lini pertama:",
     "lini 1–2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit — bukan satu sama lain. Lini kedua TIDAK melapor ke lini pertama:", 1),
    ("— ketiganya melapor ke dewan/komite risiko; lini 2 tidak pernah melapor ke lini 1.",
     "— lini 1–2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit; lini 2 tidak pernah melapor ke lini 1.", 1),
    # S4: pembanding galat selisih (bukan "2x sd antar-fold"); N1: selisih 8, bukan 9.
    ("ROC-AUC berayun 0,0139 antar-half — bandingkan dengan simpangan baku antar-fold nested CV 0,0068 [M6.2]: ayunan antar-half (n=3.000 per belahan) kira-kira dua kali sd antar-fold — wajar, karena tiap half lebih kecil dan ROC-AUC pada sampel yang lebih kecil memang lebih berisik.",
     "ROC-AUC berayun 0,0139 antar-half — bandingkan dengan GALAT SAMPLING SELISIH dua estimasi, bukan dengan sd antar-fold nested CV 0,0068 [M6.2]: sd ROC-AUC per half (n=3.000) ≈ 0,008–0,009, jadi sd selisihnya ≈ 0,011–0,013, dan 0,0139 ≈ 1,1–1,3 sd selisih — wajar, karena tiap half lebih kecil dan ROC-AUC pada sampel yang lebih kecil memang lebih berisik. (Aritmetika 0,0139/0,0068 ≈ 2,04 memang benar, tetapi pembandingnya salah: selisih dua estimasi tidak dibandingkan dengan sd satu skor.)", 1),
    ("dan ayunan 1,06 poin persen pada 860 nasabah adalah selisih sekitar 9 nasabah default.",
     "dan ayunan 1,06 poin persen pada 860 nasabah adalah selisih 8 nasabah default (A: 0,0614 × 863 = 53; B: 0,0720 × 847 = 61).", 1),
    # S2: jendela observasi label 1 bulan [M7.5] di syarat monitoring.
    ("(2) ROC-AUC, PR-AUC, approval rate, dan bad rate per periode vs baseline test (0,7816 / 0,5558 / 28,5% / 6,67%) — dengan perhatian KHUSUS pada bad rate, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; (3) ECE per periode, ambang 0,02 — karena threshold 0,10 bergantung pada kalibrasi;",
     "(2) ROC-AUC, PR-AUC, approval rate, dan bad rate per periode vs baseline test (0,7816 / 0,5558 / 28,5% / 6,67%) — dengan perhatian KHUSUS pada bad rate, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; metrik berlabel ini hanya untuk cohort MATANG — label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan lewat [M7.5], jadi per periode di sini berarti per periode setelah label matang; PSI skor tanpa label bisa dibaca harian. (3) ECE per periode, ambang 0,02 — karena threshold 0,10 bergantung pada kalibrasi;", 1),
    # M1: band ECE — cakupan overall + per half; per grup gate n>=200; |Δapproval| KUNING/MERAH.
    ("**HIJAU — lolos tanpa catatan — bila SEMUA ini terpenuhi:** ROC-AUC test (GBM terkalibrasi) ≥ 0,75; ECE < 0,02; |selisih ROC-AUC antar-half| ≤ 0,02; |selisih bad rate antar-half| ≤ 1,0 poin persen; |selisih approval antar-half| ≤ 1,0 poin persen; dan conceptual soundness lolos. **KUNING — lolos dengan catatan — bila SATU kondisi HIJAU dilanggar RINGAN:** ECE 0,02–0,05; |selisih ROC-AUC| 0,02–0,05; |selisih bad rate| 1,0–3,0 poin persen; atau ROC-AUC 0,70–0,75. Syarat KUNING: catatan tertulis + pemantauan diperketat pada metrik yang melanggar + revalidasi 3 bulan. **MERAH — tolak — bila SATU PUN kondisi ini terjadi:** ECE ≥ 0,05; |selisih ROC-AUC| > 0,05; |selisih bad rate| > 3,0 poin persen; ROC-AUC < 0,70; atau conceptual soundness GAGAL (asumsi/data/metode terbukti salah).",
     "**HIJAU — lolos tanpa catatan — bila SEMUA ini terpenuhi:** ROC-AUC test (GBM terkalibrasi) ≥ 0,75; ECE < 0,02; |selisih ROC-AUC antar-half| ≤ 0,02; |selisih bad rate antar-half| ≤ 1,0 poin persen; |selisih approval antar-half| ≤ 1,0 poin persen; dan conceptual soundness lolos. Band ECE ini berlaku untuk ECE OVERALL dan ECE PER HALF — bukan per grup. Per grup berlaku GATE UKURAN SAMPEL: grup dengan n ≥ 200 masuk band; grup dengan n < 200 tidak masuk band — ia TEMUAN-INVESTIGASI (ditulis + diselidiki, bukan pemicu band). **KUNING — lolos dengan catatan — bila SATU kondisi HIJAU dilanggar RINGAN:** ECE 0,02–0,05; |selisih ROC-AUC| 0,02–0,05; |selisih bad rate| 1,0–3,0 poin persen; |selisih approval| 1,0–3,0 poin persen; atau ROC-AUC 0,70–0,75. Syarat KUNING: catatan tertulis + pemantauan diperketat pada metrik yang melanggar + revalidasi 3 bulan. **MERAH — tolak — bila SATU PUN kondisi ini terjadi:** ECE ≥ 0,05; |selisih ROC-AUC| > 0,05; |selisih bad rate| > 3,0 poin persen; |selisih approval| > 3,0 poin persen; ROC-AUC < 0,70; atau conceptual soundness GAGAL (asumsi/data/metode terbukti salah).", 1),
    # M1: mini-case — pemicu KUNING bukan "satu-satunya bad rate".
    ("Conceptual soundness: lolos. **VERDICT: KUNING — lolos dengan catatan.** Satu-satunya pemicu adalah bad rate; catatan yang menyertainya: pantau bad rate yang disetujui per periode dengan perhatian khusus, dan revalidasi 3 bulan.",
     "Conceptual soundness: lolos. **VERDICT: KUNING — lolos dengan catatan.** Pemicu KUNING: |Δbad rate| 1,06 poin persen (0,06 di atas ambang) DAN ECE per grup yang masuk band (n ≥ 200): Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), AGE 50–59 0,0312 (n=473). ECE AGE 60+ 0,1208 (n=76) dan EDUCATION Lainnya 0,0455 (n=82) TIDAK masuk band — keduanya di bawah gate 200, jadi TEMUAN-INVESTIGASI, bukan pemicu. Catatan yang menyertainya: pantau bad rate yang disetujui per periode dengan perhatian khusus, selidiki ketiga grup KUNING itu dan kedua temuan-investigasi, dan revalidasi 3 bulan.", 1),
    ("Band traffic-light [kebijakan lesson ini]: HIJAU bila semua kondisi terpenuhi; KUNING bila satu kondisi dilanggar ringan; MERAH bila ECE ≥ 0,05, |ΔROC| > 0,05, |Δbad rate| > 3,0 poin persen, ROC-AUC < 0,70, atau conceptual soundness gagal.",
     "Band traffic-light [kebijakan lesson ini]: HIJAU bila semua kondisi terpenuhi; KUNING bila satu kondisi dilanggar ringan; MERAH bila ECE ≥ 0,05, |ΔROC| > 0,05, |Δbad rate| > 3,0 poin persen, |Δapproval| > 3,0 poin persen, ROC-AUC < 0,70, atau conceptual soundness gagal. Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200 (grup n < 200 = TEMUAN-INVESTIGASI).", 1),
    # M1: jebakan — "ambang 0,02 yang sama berlaku per grup" SALAH; n tiap grup.
    ("ECE PER GRUP: SEX laki-laki 0,0127, perempuan 0,0139 — masih baik. EDUCATION: Lainnya 0,0455, Pascasarjana 0,0210, SMA 0,0362, Universitas 0,0100 — sudah di atas 0,02 pada tiga dari empat grup. AGE: 30–39 tahun 0,0156; 40–49 tahun 0,0166; 50–59 tahun 0,0312; 60+ tahun 0,1208 — LEBIH DARI ENAM KALI ambang lolos 0,02.",
     "ECE PER GRUP [M7.1]: SEX laki-laki 0,0127 (n=2.402), perempuan 0,0139 (n=3.598) — masih baik. EDUCATION: Lainnya 0,0455 (n=82), Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), Universitas 0,0100 (n=2.774) — sudah di atas 0,02 pada tiga dari empat grup. AGE: 30–39 tahun 0,0156 (n=2.198); 40–49 tahun 0,0166 (n=1.341); 50–59 tahun 0,0312 (n=473); 60+ tahun 0,1208 (n=76) — LEBIH DARI ENAM KALI ambang lolos 0,02. Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200 — jadi yang masuk band KUNING: Pascasarjana 0,0210, SMA 0,0362, AGE 50–59 0,0312; yang TEMUAN-INVESTIGASI (n < 200): EDUCATION Lainnya 0,0455, AGE 60+ 0,1208.", 1),
    ("Pertama: 0,1208 adalah TEMUAN yang wajib ditulis — ECE per grup adalah bagian dari outcomes analysis, dan ambang 0,02 yang sama berlaku per grup. Kedua: n=76 adalah SAMPEL KECIL — ECE dari 76 nasabah berayun lebar, dan 0,1208 bisa jadi sebagian noise.",
     "Pertama: 0,1208 adalah TEMUAN yang wajib ditulis — ECE per grup adalah bagian dari outcomes analysis. Kedua: n=76 adalah SAMPEL KECIL — di bawah gate 200, jadi temuan ini TIDAK MASUK BAND dan tidak bisa memicu MERAH: ECE dari 76 nasabah berayun lebar, dan 0,1208 bisa jadi sebagian noise.", 1),
    ("Yang ia tulis: «ECE AGE 60+ 0,1208 (n=76) — di atas ambang 0,02; temuan ini MEMBUTUHKAN penyelidikan lanjutan: kumpulkan sampel lebih besar untuk grup ini, periksa bin kalibrasinya, dan bila ECE bertahan di atas 0,02 pada n yang lebih besar, syaratkan mitigasi sebelum deploy».",
     "Yang ia tulis: «ECE AGE 60+ 0,1208 (n=76, di bawah gate 200 — TEMUAN-INVESTIGASI, bukan pemicu band) — temuan ini MEMBUTUHKAN penyelidikan lanjutan: kumpulkan sampel lebih besar untuk grup ini, periksa bin kalibrasinya, dan bila ECE bertahan di atas 0,02 pada n ≥ 200, syaratkan mitigasi sebelum deploy».", 1),
    # M1: mini-case catatan + (c) — gate n>=200.
    ("Catatan yang menyertai verdict itu: (1) pantau bad rate yang disetujui per periode dengan perhatian khusus, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; (2) selidiki ECE AGE 60+ 0,1208 (n=76) — kumpulkan sampel lebih besar untuk grup ini sebelum revalidasi, dan laporkan hasilnya; (3) revalidasi terjadwal 3 bulan setelah deploy, dipercepat bila bad rate melewati ambangnya dua periode berturut-turut.",
     "Catatan yang menyertai verdict itu: (1) pantau bad rate yang disetujui per periode dengan perhatian khusus, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; (2) selidiki ECE per grup yang masuk band KUNING (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312) dan TEMUAN-INVESTIGASI ECE AGE 60+ 0,1208 (n=76, di bawah gate 200) — kumpulkan sampel lebih besar untuk grup ini sebelum revalidasi, dan laporkan hasilnya; (3) revalidasi terjadwal 3 bulan setelah deploy, dipercepat bila bad rate melewati ambangnya dua periode berturut-turut.", 1),
    ("(c) MENAHAN verdict karena ECE AGE 60+ 0,1208 — temuan itu butuh penyelidikan, bukan penahanan: n=76 terlalu kecil untuk vonis.",
     "(c) MENAHAN verdict karena ECE AGE 60+ 0,1208 — temuan itu butuh penyelidikan, bukan penahanan: n=76 di bawah gate 200 — TEMUAN-INVESTIGASI, bukan pemicu band — terlalu kecil untuk vonis.", 1),
    # M1: Lab 1 + Lab 2 — "SATU-SATUNYA pemicu" / "SATU sumber saja".
    ("|Selisih bad rate| 1,06 poin persen melewati ambang HIJAU 1,0 poin persen [kebijakan lesson ini] — SATU-SATUNYA pemicu KUNING pada model ini.",
     "|Selisih bad rate| 1,06 poin persen melewati ambang HIJAU 1,0 poin persen [kebijakan lesson ini] — pemicu KUNING pertama pada model ini; pemicu KUNING lainnya adalah ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312).", 1),
    ("Hasil [lab]: ece_max=0.0114; ece_spread=0.0010; ece_lolos_A=True; ece_lolos_B=True; ece_lolos_overall=True; band=KUNING. SEMUA ECE lolos (maksimum 0,0114, jauh di bawah 0,02) — kalibrasi BUKAN masalah model ini. Band KUNING datang dari SATU sumber saja: |Δbad rate| 1,06 poin persen.",
     "Hasil [lab]: ece_max=0.0114; ece_spread=0.0010; ece_lolos_A=True; ece_lolos_B=True; ece_lolos_overall=True; band=KUNING. SEMUA ECE (overall + per half) lolos (maksimum 0,0114, jauh di bawah 0,02) — kalibrasi BUKAN masalah model ini. Band KUNING datang dari |Δbad rate| 1,06 poin persen DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312). Lab ini hanya mengevaluasi 4 dari 5 kondisi band — ECE per grup tidak dihitung di sini; ia dihitung di langkah 9 (jebakan).", 1),
    # M1: rangkuman traffic-light + jebakan.
    ("- Traffic-light [kebijakan lesson ini]: HIJAU (ROC ≥ 0,75; ECE < 0,02; |ΔROC| ≤ 0,02; |Δbad rate| ≤ 1,0 pp; |Δapproval| ≤ 1,0 pp); KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Verdict model ini: KUNING — satu-satunya pemicu |Δbad rate| 1,06 pp.",
     "- Traffic-light [kebijakan lesson ini]: HIJAU (ROC ≥ 0,75; ECE < 0,02; |ΔROC| ≤ 0,02; |Δbad rate| ≤ 1,0 pp; |Δapproval| ≤ 1,0 pp); KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; |Δapproval| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; |Δapproval| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200 (n < 200 = TEMUAN-INVESTIGASI). Verdict model ini: KUNING — pemicu |Δbad rate| 1,06 pp DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312).", 1),
    ("- Jebakan akurasi-saja: ECE overall 0,0087 menyembunyikan ECE AGE 60+ 0,1208 (n=76) [M7.1] — temuan itu butuh penyelidikan lanjutan, bukan vonis dan bukan pengabaian; laporkan ECE selalu bersama n-nya.",
     "- Jebakan akurasi-saja: ECE overall 0,0087 menyembunyikan ECE AGE 60+ 0,1208 (n=76, di bawah gate 200 — TEMUAN-INVESTIGASI, bukan pemicu band) [M7.1] — temuan itu butuh penyelidikan lanjutan, bukan vonis dan bukan pengabaian; laporkan ECE selalu bersama n-nya.", 1),
    # Intro: n=76 pada ECE AGE 60+.
    ("gap train-test 0,0646, ECE per grup 0,1208 pada AGE 60+ [M7.1], dan bad rate yang berayun 1,06 poin persen antar-half adalah tiga hal yang tidak terlihat dari satu angka 0,7823",
     "gap train-test 0,0646, ECE per grup 0,1208 pada AGE 60+ (n=76 — temuan-investigasi, di bawah gate 200) [M7.1], dan bad rate yang berayun 1,06 poin persen antar-half adalah tiga hal yang tidak terlihat dari satu angka 0,7823", 1),
]


MD82 = "content/mlf-m82-model-risk-rating-inventory.md"
MD82_PAIRS = [
    # S7 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05.",
     "31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05.", 1),
    # N6: PSI/bad rate — beda label (PSI tanpa label bisa harian).
    ("monitoring harian/mingguan (PSI skor, approval, bad rate [M7.5]);",
     "monitoring harian/mingguan — PSI skor dan approval rate tanpa label (bisa harian), bad rate dan ECE setelah label matang (jendela 1 bulan [M7.5]);", 1),
    # S2: "shadow" dua makna -> "shadow-mode" (tercatat) vs "model tak terdaftar".
    ("Inventory adalah daftar LENGKAP semua model yang dipakai organisasi — hidup, bayangan (shadow), maupun pensiun.",
     "Inventory adalah daftar LENGKAP semua model yang dipakai organisasi — hidup, bayangan (shadow-mode: model yang berjalan berdampingan dengan model live tanpa mengambil keputusan — keputusannya dicatat, tidak dijalankan), maupun pensiun.", 1),
    ("Tanpa inventory, yang terjadi adalah SHADOW MODEL: model yang dipakai seseorang tanpa ada yang tahu",
     "Tanpa inventory, yang terjadi adalah MODEL TAK TERDAFTAR: model yang dipakai seseorang tanpa ada yang tahu", 1),
    ("tanpa inventory, shadow model lolos tanpa pengawasan.",
     "tanpa inventory, model tak terdaftar lolos tanpa pengawasan.", 1),
    ("tiering TANPA inventory — memberi tier pada model yang diketahui sambil membiarkan shadow model tanpa tier sama sekali.",
     "tiering TANPA inventory — memberi tier pada model yang diketahui sambil membiarkan model tak terdaftar tanpa tier sama sekali.", 1),
    # M1: aturan jumlah level.
    ("Sembilan sel dipetakan ke tiga tier [kebijakan lesson ini]: Tier 1 di sudut kanan-atas; Tier 3 di sudut kiri-bawah; Tier 2 di antaranya.",
     "Sembilan sel dipetakan ke tiga tier [kebijakan lesson ini] dari JUMLAH LEVEL kedua sumbu (rendah=0, sedang=1, tinggi=2): Tier 1 bila jumlah level ≥ 3; Tier 2 bila jumlah level = 2; Tier 3 bila jumlah level ≤ 1. Jadi Tier 1 di sudut kanan-atas (tiga sel: exposure tinggi × kompleksitas sedang/tinggi, dan kompleksitas tinggi × exposure sedang); Tier 3 di sudut kiri-bawah (tiga sel: keduanya rendah, atau satu rendah + satu sedang); Tier 2 di antaranya (tiga sel diagonal, jumlah level = 2).", 1),
    ("Exposure rendah + kompleksitas TINGGI (deep learning untuk laporan internal) juga butuh pengawasan lebih dari Tier 3 — karena tidak ada yang bisa menjelaskan kenapa model itu memutuskan begitu, sehingga kesalahannya sulit dideteksi.",
     "Exposure rendah + kompleksitas TINGGI (deep learning untuk laporan internal) juga butuh pengawasan lebih dari Tier 3 — karena tidak ada yang bisa menjelaskan kenapa model itu memutuskan begitu, sehingga kesalahannya sulit dideteksi. (Matriks menempatkannya di Tier 2 — jumlah level 0 + 2 = 2 — tetapi skor yang mengikat berkata Tier 3: M=0, C=4, B=0 → 1,20; lihat mitigasi di bawah.)", 1),
    # S6: hierarki — matriks saringan kasar, skor yang mengikat.
    ("pakai matriks sebagai LANGKAH PERTAMA (di sel mana model ini jatuh?), lalu hitung SKOR (langkah 7) sebagai langkah kedua yang menuliskan alasannya dengan angka.",
     "pakai matriks sebagai LANGKAH PERTAMA (di sel mana model ini jatuh?), lalu hitung SKOR (langkah 7) sebagai langkah kedua yang menuliskan alasannya dengan angka. Bila matriks dan skor tidak sepakat, SKOR YANG MENGIKAT: matriks adalah saringan kasar, skor adalah perhitungan yang mengikat. Contoh: deep learning untuk laporan internal — matriks berkata Tier 2 (jumlah level 2), skor berkata Tier 3 (1,20) — tier-nya Tier 3.", 1),
    # S4: "MENAHAN NT$66.685.925" = EL bruto counterfactual, bukan nilai bersih.
    ("EL approved hanya 15,24% dari jumlah itu — artinya model, dengan threshold 0,10 [M6.4], MENAHAN NT$66.685.925 expected loss (EL atas yang ditolak) dari buku.",
     "EL approved hanya 15,24% dari jumlah itu — artinya model, dengan threshold 0,10 [M6.4], MENAHAN NT$66.685.925 expected loss (EL atas yang ditolak) dari buku. Angka itu adalah EL BRUTO yang dihindari secara counterfactual — BUKAN nilai bersih model: nilai bersihnya vs threshold 0,50 adalah NT$27.208.456, dan margin nasabah baik yang ditolak belum dikurangkan dari angka ini.", 1),
    # N1: basis 2,51% = realised loss; N3/S5: basis margin + total cost.
    ("realised loss approved NT$11.695.500 — EL NT$11.989.453 hanya NT$293.953 (2,51%) di atas realised. Margin approved NT$19.909.500 dikurangi realised loss NT$11.695.500 menghasilkan laba bersih approved NT$8.214.000 [M6.4]; total cost pada threshold 0,10 adalah NT$33.046.500 [M6.4].",
     "realised loss approved NT$11.695.500 — EL NT$11.989.453 hanya NT$293.953 di atas realised (2,51% dari realised loss; bila dihitung dari EL, 2,45%). Margin approved NT$19.909.500 (5% dari exposure nasabah non-default: 0,05 × NT$398.190.000; realised loss NT$11.695.500 = 0,45 × NT$25.990.000) dikurangi realised loss menghasilkan laba bersih approved NT$8.214.000 [M6.4]; total cost pada threshold 0,10 adalah NT$33.046.500 [M6.4] — total cost ini adalah biaya portofolio (bukan pengurang margin di atas); laba bersih = margin − realised loss, bukan margin − total cost.", 1),
    # S3: ECE 0,0087 [M7.5] -> [M6.4].
    ("probabilitas 0,10 sungguh berarti peluang default 10% (ECE test 0,0087 [M7.5]).",
     "probabilitas 0,10 sungguh berarti peluang default 10% (ECE test 0,0087 [M6.4]).", 1),
    # N4: band M setengah terbuka.
    ("M = MATERIALITY, dari approved LIMIT_BAL: di bawah NT$50 juta → 0; NT$50–150 juta → 1; NT$150–300 juta → 2; NT$300–600 juta → 3; di atas NT$600 juta → 4.",
     "M = MATERIALITY, dari approved LIMIT_BAL: di bawah NT$50 juta → 0; NT$50 juta ≤ limit < NT$150 juta → 1; NT$150 juta ≤ limit < NT$300 juta → 2; NT$300 juta ≤ limit < NT$600 juta → 3; limit ≥ NT$600 juta → 4.", 1),
    # S1: catatan sensitivitas skala buku -> skor 3,40, tetap Tier 1 (B=3 TETAP).
    ("Skor = 0,50×3 + 0,30×2 + 0,20×3 = 1,50 + 0,60 + 0,60 = 2,70 → Tier 1. Materiality mendapat bobot TERBESAR (0,50)",
     "Skor = 0,50×3 + 0,30×2 + 0,20×3 = 1,50 + 0,60 + 0,60 = 2,70 → Tier 1. Catatan sensitivitas [ilustrasi]: M dan B dihitung dari skala sampel (approved limit NT$424,18 juta; 6.000 aplikasi per periode) — bila keduanya dihitung dari buku penuh (total limit test NT$2.120.900.000; laju keputusan diskalakan), M=4 dan B=4 → skor 3,40 — tetap Tier 1; tier flagship tidak bergantung pada pilihan skala ini. Materiality mendapat bobot TERBESAR (0,50)", 1),
    # S3+N6: PSI 0,25 & ECE 0,02 -> [kebijakan lesson ini] + PSI M7.5 hanya 0,0161.
    ("(4) DRIFT BESAR yang bertahan — PSI skor di atas 0,25 [M7.5] atau kalibrasi yang rusak (ECE di atas 0,02 [M7.5]);",
     "(4) DRIFT BESAR yang bertahan — PSI skor di atas 0,25 [kebijakan lesson ini] atau kalibrasi yang rusak (ECE di atas 0,02 [kebijakan lesson ini]); sebagai perbandingan, PSI skor chunk 1 vs chunk 5 di M7.5 hanya 0,0161 — jauh di bawah ambang ini. PSI tanpa label bisa dibaca harian; ECE dan bad rate butuh label matang (jendela 1 bulan [M7.5]);", 1),
    # N5: "5 hari kerja" -> [kebijakan lesson ini].
    ("setiap perubahan penggunaan model WAJIB dilaporkan ke penjaga inventory dalam 5 hari kerja;",
     "setiap perubahan penggunaan model WAJIB dilaporkan ke penjaga inventory dalam 5 hari kerja [kebijakan lesson ini];", 1),
    # N2: "Rp" -> NT$.
    ("Regresi logistik sederhana yang memutuskan limit Rp miliaran adalah Tier 1",
     "Regresi logistik sederhana yang memutuskan limit NT$ miliaran adalah Tier 1", 1),
    # M1: rangkuman matriks.
    ("- Matriks exposure × kompleksitas: Tier 1 di sudut kanan-atas, Tier 3 di kiri-bawah, Tier 2 di antaranya — flagship (M=3, C=2) di sel Tier 1; exposure tinggi + kompleksitas rendah tetap Tier 2.",
     "- Matriks exposure × kompleksitas: Tier 1 bila jumlah level (kompleksitas + exposure) ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2 — flagship (M=3, C=2) di sel Tier 1; exposure tinggi + kompleksitas rendah tetap Tier 2.", 1),
]

MD83 = "content/mlf-m83-model-card-documentation.md"
MD83_PAIRS = [
    # S7/N3 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05.",
     "31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05.", 1),
    ("(1) Model version: GBM terkalibrasi Platt/sigmoid, seed 42, 31 fitur flagship v1.",
     "(1) Model version: GBM terkalibrasi Platt/sigmoid, seed 42, 31 fitur flagship v1 [notebook].", 1),
    ("(2) Feature schema version: 31 fitur (23 mentah + 8 turunan) — bila satu fitur berubah definisinya, versinya naik.",
     "(2) Feature schema version: 31 fitur (23 mentah + 8 turunan) [notebook] — bila satu fitur berubah definisinya, versinya naik.", 1),
    ("(3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3.",
     "(3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3 [notebook].", 2),
    # S1: ECE 0,0087 [M7.5] -> [M6.4].
    ("ECE 0,0087 [M7.5], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4], plus seed sensitivity dan fairness;",
     "ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4], plus seed sensitivity dan fairness;", 1),
    ("Brier 0,1345, ECE 0,0087 [M7.5]; LR mentah",
     "Brier 0,1345, ECE 0,0087 [M6.4]; LR mentah", 1),
    ("Mini-case flagship: metrik lengkap (terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M7.5], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4]) dengan kolom non-hitung dilabeli [ilustrasi].",
     "Mini-case flagship: metrik lengkap (terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4]) dengan kolom non-hitung dilabeli [ilustrasi].", 1),
    # N2: caption figure — kolom 6-10.
    ("Kolom 1–5 menjawab «APA modelnya»; kolom 6–10 menjawab «SIAPA, KAPAN, dan BAGAIMANA mengembalikannya».",
     "Kolom 1–5 menjawab «APA modelnya»; kolom 6 & 9 menjawab «BAGAIMANA mereproduksi dan mengembalikannya» (kode/hash, rollback); kolom 7–8 menjawab «SIAPA & KAPAN» (tanggal persetujuan, pemilik); kolom 10 menjawab «MENGAPA» (alasan perubahan).", 1),
    # N8: toleransi 0,001 diasumsikan seed 42 terkunci.
    ("Lesson ini memakai toleransi 0,001 untuk ROC-AUC: replikasi flagship GBM mentah harus menghasilkan 0,7823 ± 0,001, dan GBM terkalibrasi 0,7816 ± 0,001.",
     "Lesson ini memakai toleransi 0,001 untuk ROC-AUC: replikasi flagship GBM mentah harus menghasilkan 0,7823 ± 0,001, dan GBM terkalibrasi 0,7816 ± 0,001. Toleransi ini diasumsikan seed 42 terkunci — bila seed-nya berbeda, ayunan antar-seed (sd 0,0028, langkah 4) sudah bisa melampaui toleransi ini, jadi replikasi WAJIB memakai seed 42.", 1),
    # N7: pita 0,0069 = rentang 5 seed yang diuji, bukan batas populasi.
    ("«0,7823» — angka seed 42 — adalah SATU pengukuran di dalam pita selebar 0,0069, bukan nilai sejati model.",
     "«0,7823» — angka seed 42 — adalah SATU pengukuran di dalam pita selebar 0,0069 (rentang lima seed yang diuji, 42–46 — bukan batas populasi seed yang mungkin), bukan nilai sejati model.", 1),
    # S3: ambang alert 0,02 -> [kebijakan M7.5].
    ("Bandingkan dengan ambang alert monitoring [M7.5] 0,02: spread seed 0,0069 hanya sekitar sepertiganya — ayunan karena seed saja TIDAK PERNAH menyalakan alert.",
     "Bandingkan dengan ambang alert monitoring [kebijakan M7.5] 0,02: spread seed 0,0069 hanya sekitar sepertiganya — ayunan karena seed saja TIDAK PERNAH menyalakan alert.", 1),
    ("Bila spread lintas 5 seed melewati 0,02, angka seed tunggal TIDAK BOLEH dilaporkan sendirian.",
     "Bila spread lintas 5 seed melewati 0,02 [kebijakan M7.5], angka seed tunggal TIDAK BOLEH dilaporkan sendirian.", 1),
    # M1: 0,0710 = rentang (maks-min) antar-chunk, BUKAN drop vs full-test.
    ("Dan bandingkan dengan ayunan antar-periode [M7.5] (ROC-AUC chunk waktu semu berayun 0,0710): seed noise adalah sumber noise yang PALING KECIL di antara yang lesson ini ukur.",
     "Dan bandingkan dengan ayunan antar-periode [M7.5] (ROC-AUC chunk waktu semu berayun 0,0710 — rentang (maks−min) antar-chunk [m75_pseudo_time_roc_spread], BUKAN drop vs full-test (drop itu 0,0388: 0,7816 − 0,7428); 0,0710/0,0069 ≈ 10,3× spread seed): seed noise adalah sumber noise yang PALING KECIL di antara yang lesson ini ukur.", 1),
    # S2 noise: PSI AGE 0,0029 -> kunci kanonik.
    ("PSI tertinggi AGE 0,0029 membuktikan split seed 42 sehat.",
     "PSI tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi] membuktikan split seed 42 sehat.", 1),
    ("dan terukur (PSI train-vs-test tertinggi AGE 0,0029 [M7.5]).",
     "dan terukur (PSI train-vs-test tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi]).", 1),
    # S4 noise: AIR EDUCATION 0,3572 -> kunci kanonik + definisi min/max + four-fifths.
    ("AIR SEX (GBM terkalibrasi) 0,8694 (approval laki-laki 26,14% vs perempuan 30,07%) berada di atas ambang 0,80, tapi AIR EDUCATION serendah 0,3572 (SMA vs Lainnya)",
     "AIR SEX (GBM terkalibrasi) 0,8694 (approval laki-laki 26,14% vs perempuan 30,07%) berada di atas ambang 0,80 (aturan four-fifths — ambang standar, bukan konstanta alam), tapi AIR EDUCATION serendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] — rasio approval terendah (SMA) terhadap tertinggi (Lainnya) —", 1),
    ("angka buruknya (AIR EDUCATION 0,3572) ditulis di sampingnya.",
     "angka buruknya (AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]) ditulis di sampingnya.", 1),
    ("AIR EDUCATION 0,3572 — tidak adil merata antar grup pendidikan [M7.1];",
     "AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] — tidak adil merata antar grup pendidikan [M7.1];", 1),
    ("AIR EDUCATION terendah 0,3572 (SMA) [M7.1].",
     "AIR EDUCATION terendah 0,3572 (SMA) [m71_by_group.EDUCATION.summary.air_min_over_max].", 1),
    ("AIR EDUCATION terendah 0,3572 [M7.1];",
     "AIR EDUCATION terendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max];", 1),
    # S5: owner vs validator vs legal/risk — pisah peran; gerbang (2) independen.
    ("(2) offline validation — paket lengkap diukur pada validation yang belum dipakai memilih; (3) legal/risk approval — penasihat hukum dan risk manager menandatangani template-nya, bukan slide-nya;",
     "(2) offline validation — paket lengkap diukur oleh validator independen (fungsi model risk/compliance, tidak melapor ke owner) pada validation yang belum dipakai memilih; (3) legal/risk approval — penasihat hukum dan fungsi legal/risk (lini kedua, independen dari owner) menandatangani template-nya, bukan slide-nya — tanda tangan ini adalah sign-off atas hasil validasi independen, bukan persetujuan diri sendiri;", 1),
    # N1: gerbang rollback (6) = verifikasi kriteria yang ditulis di gerbang (1).
    ("(6) rollback criteria — ditulis SEBELUM produksi (cabut v2 bila AIR SEX jatuh di bawah 0,80 selama 2 periode berturut-turut, atau ECE di atas 0,02 bertahan, atau review hukum menolak — dan kembalikan v1).",
     "(6) rollback criteria — DITETAPKAN sebelum gerbang (5) (ditulis di gerbang (1), bersama proposal) dan DIVERIFIKASI di sini: cabut v2 bila AIR SEX jatuh di bawah 0,80 (aturan four-fifths) selama 2 periode berturut-turut, atau ECE di atas 0,02 [kebijakan M7.5] bertahan, atau review hukum menolak — dan kembalikan v1.", 1),
    # Mini-case: owner + rollback (N6).
    ("(8) Owner: [ilustrasi] — Risk Manager.",
     "(8) Owner: [ilustrasi] — Model Owner (peran bisnis/model development — owner tidak menandatangani persetujuannya sendiri; legal/risk approval di gerbang (3) datang dari fungsi independen).", 1),
    ("(9) Rollback version: tidak ada — v1 adalah versi produksi pertama; rencana rollback: nonaktifkan skor model, kembali ke keputusan manual [ilustrasi].",
     "(9) Rollback version: tidak ada versi model sebelumnya — v1 adalah versi produksi pertama; rollback plan: nonaktifkan skor model, kembali ke keputusan manual [ilustrasi].", 1),
]


MD84 = "content/mlf-m84-deployment-shadow-canary-champion.md"
MD84_PAIRS = [
    # S7/N5 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; champion GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05;",
     "31 fitur [notebook]; champion GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05;", 1),
    # S7+S3: aturan TAHAN bila PSI 0,10-0,25 tanpa bad rate buruk; ambang canary vs gate naik.
    ("**Aturan per ramp [kebijakan lesson ini] — ditulis DULU, sebelum melihat angka:** LANJUT bila bad rate challenger ≤ 8% DAN PSI skor ≤ 0,10; TAHAN bila bad rate 8–10% DAN PSI skor ≤ 0,10 (zona abu-abu: kumpulkan data lagi di ramp yang sama, jangan naik); STOP bila bad rate > 10% ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut. Ambang 8% dipilih dari baseline champion: bad rate champion 6,67% [notebook] ditambah toleransi 1,33 poin persen.",
     "**Aturan per ramp [kebijakan lesson ini] — ditulis DULU, sebelum melihat angka:** LANJUT bila bad rate challenger ≤ 8% DAN PSI skor ≤ 0,10; TAHAN bila bad rate 8–10% DAN PSI skor ≤ 0,10 (zona abu-abu: kumpulkan data lagi di ramp yang sama, jangan naik) — dan TAHAN juga bila PSI skor 0,10–0,25 tanpa bad rate buruk (PSI naik tanpa bukti kerugian: jangan naik, kumpulkan data lagi; bila TAHAN itu berulang, STOP); STOP bila bad rate > 10% ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut. Ambang 8% dipilih dari baseline champion: bad rate champion 6,67% [notebook] ditambah toleransi 1,33 poin persen. Ambang 8% (toleransi 1,33 pp) adalah ambang CANARY — lebih longgar dari ambang gate naik G2 (7,67%, toleransi 1,00 pp): canary hanya mengizinkan ramp berikutnya, gate naik memutuskan penggantian penuh — keputusan yang lebih besar memakai ambang yang lebih ketat.", 1),
    # S2: basis traffic canary 1 periode = 12.000 aplikasi masuk.
    ("**Nilai [simulasi] — canary atas challenger LR dengan parameter eksplisit (bukan observasi live):** ramp 1% (n = 120, disetujui 26, default 2, PSI skor 0,02)",
     "**Nilai [simulasi] — canary atas challenger LR dengan parameter eksplisit (bukan observasi live).** Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk — jadi 1% = 120, 5% = 600; ramp 5% diperpanjang mengakumulasi 5 periode pada 5% sampai terkumpul 3.000 nasabah (25% dari basis 12.000), bukan «5% dari test 6.000». Ramp 1% (n = 120, disetujui 26, default 2, PSI skor 0,02)", 1),
    # S6: approve-all 82.155.456 = realised loss seluruh test (bukan EL 78.675.378).
    ("cost NT$33.046.500 vs threshold 0,50 yang cost-nya NT$60.254.956, approve-all NT$82.155.456, reject-all NT$41.260.500.",
     "cost NT$33.046.500 vs threshold 0,50 yang cost-nya NT$60.254.956, approve-all NT$82.155.456 (realised loss seluruh test [m8_approve_all_realised_loss] — BUKAN expected loss NT$78.675.378 di M8.2), reject-all NT$41.260.500.", 1),
    # M3: 1.166 LR terkalibrasi + ekonomi (profit/bad rate) vs champion.
    ("Bukti bahwa artefaknya hanya sebagian: bila LR dikalibrasi Platt [M6.4], ambang 0,10-nya menyetujui 1.166 nasabah — tetap jauh dari 1.710 champion. Jadi kalibrasi bukan penjelasan utama kekalahan ini; ranking LR memang lebih lemah (ROC-AUC 0,7426 vs 0,7816).",
     "Bukti bahwa artefaknya hanya sebagian: bila LR dikalibrasi Platt [M6.4], ambang 0,10-nya menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] — tetap jauh dari 1.710 champion; dan ekonominya tetap kalah jauh: LR terkalibrasi profit +NT$1.886.500 (bad rate 9,09%) vs champion +NT$8.214.000 (bad rate 6,67%) — kalibrasi hanya menambah NT$63.500 di atas LR mentah (+NT$1.823.000), masih NT$6.327.500 di bawah champion. Jadi kalibrasi bukan penjelasan utama kekalahan ini; ranking LR memang lebih lemah (ROC-AUC 0,7426 vs 0,7816).", 1),
    ("bukti [M6.4] menunjukkan kalibrasi saja tidak menutup kesenjangan (1.166 vs 1.710 disetujui), tapi perbandingan yang benar menuntutnya;",
     "bukti [m8_lr_calibrated_thr010] menunjukkan kalibrasi saja tidak menutup kesenjangan (1.166 vs 1.710 disetujui; profit +NT$1.886.500 vs +NT$8.214.000), tapi perbandingan yang benar menuntutnya;", 1),
    ("bukti artefaknya hanya sebagian: LR terkalibrasi Platt [M6.4] menyetujui 1.166 nasabah, tetap jauh dari 1.710 champion.",
     "bukti artefaknya hanya sebagian: LR terkalibrasi Platt [M6.4] menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] (profit +NT$1.886.500 vs +NT$8.214.000), tetap jauh dari 1.710 champion.", 1),
    # N2: "14 kali" -> "hampir 14 kali (13,84x)" (2 situs: lab + rangkuman? cek dry-run).
    ("χ² 209,473 adalah 14 kali nilai kritis 15,1367 — bukan «sedikit signifikan», melainkan berbeda jauh melampaui keraguan.",
     "χ² 209,473 adalah hampir 14 kali (13,84×) nilai kritis 15,1367 — bukan «sedikit signifikan», melainkan berbeda jauh melampaui keraguan.", 1),
    # N3: G4 "GAGAL ISI" — kriteria shadow-mode eksplisit.
    ("G4 DISAGREEMENT — laporkan disagreement rate; bila di atas 25%, investigasi sel shadow sebelum naik (di sini 19,42% — di bawah ambang, tapi selnya buruk, jadi gate ini lolos angka dan gagal isi).",
     "G4 DISAGREEMENT — laporkan disagreement rate; bila di atas 25%, investigasi sel shadow sebelum naik. Kriteria isi sel shadow (langkah 3): gate GAGAL ISI bila bad rate sel challenger-only approvals melebihi bad rate champion, atau bila mayoritas sel challenger-only rejections adalah nasabah baik. Di sini 19,42% — di bawah ambang, tapi selnya buruk (335 approvals bad rate 18,21% > 6,67%; 830 rejections 92,29% baik), jadi gate ini lolos angka dan gagal isi.", 1),
    # N4: ECE WASPADA vs KRITIS disamakan.
    ("G5 MONITORING — tidak ada alert KRITIS M7.5 [M7.5] pada ramp mana pun (PSI skor > 0,25, bad rate > 10%, ECE > 0,02 dua periode).",
     "G5 MONITORING — tidak ada alert KRITIS M7.5 [M7.5] pada ramp mana pun (PSI skor > 0,25; bad rate > 10% dua periode; ROC-AUC turun > 0,02 dua periode; PR-AUC turun > 0,03 dua periode). ECE di atas 0,02 adalah WASPADA, bukan pemicu KRITIS (langkah 7).", 1),
    # S4: AIR [M7.5] -> [M7.1].
    ("G6 FAIRNESS — AIR per grup tidak di bawah 0,80 [M7.5].",
     "G6 FAIRNESS — AIR per grup tidak di bawah 0,80 [M7.1].", 1),
    # M1: mini-case — G7 di jawaban.
    ("**Ketiga, GATE:** G1 gagal, G2 gagal (9,14% > 7,67%), G3 gagal (LR mentah, belum dikalibrasi), G4 gagal isi — 0 dari 7 gate lolos, 2 belum diuji.",
     "**Ketiga, GATE:** G1 gagal, G2 gagal (9,14% > 7,67%), G3 gagal (LR mentah, belum dikalibrasi), G4 gagal isi, G7 gagal (tidak ada dua periode lolos) — 0 dari 7 gate lolos, 2 belum diuji.", 1),
    # M2+N4: monitoring gates — baseline PER MODEL + gap + ECE WASPADA.
    ("Di tiap ramp canary, dashboard yang sama dibaca (PSI skor, ROC-AUC/PR-AUC, approval rate, bad rate, skor rata-rata, ECE) dengan ambang yang sama: PSI skor di atas 0,1 = WASPADA, di atas 0,25 = KRITIS; ROC-AUC turun lebih dari 0,02 dari baseline 0,7816 = WASPADA, 2 periode = KRITIS; PR-AUC turun lebih dari 0,03 = WASPADA, 2 periode = KRITIS; bad rate di atas 10% = WASPADA, 2 periode = KRITIS; ECE di atas 0,02 = WASPADA; approval bergerak lebih dari 5 poin persen dari baseline 28,5% = PANTAU.",
     "Di tiap ramp canary, dashboard yang sama dibaca (PSI skor, ROC-AUC/PR-AUC, approval rate, bad rate, skor rata-rata, ECE) dengan ambang yang sama — tetapi baseline PER MODEL: champion [M6.4/M7.4] ROC-AUC 0,7816, PR-AUC 0,5558, approval 28,5%, bad rate 6,67%; challenger (LR mentah) ROC-AUC 0,7426, PR-AUC 0,5049, approval 20,25%, bad rate 9,14%. Setiap metrik dibaca terhadap baseline modelnya sendiri — dan SELISIH champion−challenger (gap ROC-AUC 0,0390, gap bad rate 2,47 pp, gap approval 8,25 pp, gap profit NT$6.391.000) adalah metrik tersendiri: gap yang melebar di live berarti challenger makin tertinggal, walau masing-masing masih di dalam ambangnya. Ambangnya: PSI skor di atas 0,1 = WASPADA, di atas 0,25 = KRITIS; ROC-AUC turun lebih dari 0,02 dari baseline modelnya (champion 0,7816; challenger 0,7426) = WASPADA, 2 periode = KRITIS; PR-AUC turun lebih dari 0,03 = WASPADA, 2 periode = KRITIS; bad rate di atas 10% = WASPADA, 2 periode = KRITIS; ECE di atas 0,02 = WASPADA (tetap WASPADA walau bertahan dua periode — ia tidak naik menjadi KRITIS; yang naik menjadi KRITIS setelah dua periode adalah ROC-AUC, PR-AUC, dan bad rate); approval bergerak lebih dari 5 poin persen dari baseline 28,5% = PANTAU.", 1),
    ("(2) ROC-AUC/PR-AUC vs baseline 0,7816/0,5558 (cohort matang saja); (3) approval + bad rate vs 28,5%/6,67% (bad rate cohort matang saja); (4) skor rata-rata + ECE vs 0,2217/0,0087;",
     "(2) ROC-AUC/PR-AUC vs baseline PER MODEL — champion 0,7816/0,5558, challenger 0,7426/0,5049 (cohort matang saja); (3) approval + bad rate vs baseline PER MODEL — champion 28,5%/6,67%, challenger 20,25%/9,14% (bad rate cohort matang saja); (4) skor rata-rata (mean calibrated proba [notebook]) + ECE vs 0,2217/0,0087;", 1),
    # N7: 0,1058/0,0965 ADA di kanonik m74 -> sitir [M7.4].
    ("bila deployment memakai threshold per grup (misal 0,1058/0,0965), rollback mengembalikan threshold TUNGGAL 0,10, bukan threshold per grup yang terakhir;",
     "bila deployment memakai threshold per grup (0,1058/0,0965 [M7.4]), rollback mengembalikan threshold TUNGGAL 0,10, bukan threshold per grup yang terakhir;", 1),
    # N6: "di bawah 30 menit" -> [kebijakan lesson ini].
    ("ukur waktunya (target: di bawah 30 menit dari keputusan ke traffic kembali)",
     "ukur waktunya (target [kebijakan lesson ini]: di bawah 30 menit dari keputusan ke traffic kembali)", 1),
    # S5 noise: ECE 0,1003 simulasi S2 -> kunci kanonik.
    ("(ECE 0,0087 di test bisa menjadi 0,1003 seperti simulasi S2 M7.5 [M7.5]).",
     "(ECE 0,0087 di test bisa menjadi 0,1003 seperti simulasi S2 M7.5 [m75_drift_simulations.S2_pay_plus1.ece_10bin]).", 1),
    # S7: Lab 2 — aturan TAHAN + basis traffic.
    ("Aturan per ramp [kebijakan lesson ini]: LANJUT bila bad rate ≤ 0,08 DAN PSI skor ≤ 0,10; TAHAN bila bad rate ≤ 0,10 DAN PSI skor ≤ 0,10 (zona abu-abu); STOP bila bad rate > 0,10 ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut; ROLLBACK bila keputusan akhirnya STOP. Data per ramp [simulasi]: R1 1% (n = 120, disetujui 26, default 2, PSI 0,02); R2 5% (n = 600, disetujui 123, default 11, PSI 0,05); R2-ext 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI 0,06).",
     "Aturan per ramp [kebijakan lesson ini]: LANJUT bila bad rate ≤ 0,08 DAN PSI skor ≤ 0,10; TAHAN bila bad rate ≤ 0,10 DAN PSI skor ≤ 0,10 (zona abu-abu), dan TAHAN juga bila PSI skor 0,10–0,25 tanpa bad rate buruk; STOP bila bad rate > 0,10 ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut; ROLLBACK bila keputusan akhirnya STOP. Data per ramp [simulasi] — basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk (1% = 120; 5% = 600); R2-ext = 5 periode @ 600 = 3.000. R1 1% (n = 120, disetujui 26, default 2, PSI 0,02); R2 5% (n = 600, disetujui 123, default 11, PSI 0,05); R2-ext 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI 0,06).", 1),
    # Rangkuman monitoring gates: per model + ECE WASPADA.
    ("- Monitoring gates meminjam M7.5 [M7.5]: PSI > 0,1 waspada / > 0,25 kritis, ROC-AUC turun > 0,02, PR-AUC turun > 0,03, bad rate > 10%, ECE > 0,02 — dibaca per ramp per model; metrik tanpa label segera, metrik berlabel hanya cohort matang.",
     "- Monitoring gates meminjam M7.5 [M7.5]: PSI > 0,1 waspada / > 0,25 kritis, ROC-AUC turun > 0,02, PR-AUC turun > 0,03, bad rate > 10%, ECE > 0,02 (WASPADA, bukan KRITIS) — dibaca per ramp per model terhadap baseline modelnya sendiri (champion 0,7816/0,5558/28,5%/6,67%; challenger 0,7426/0,5049/20,25%/9,14%) plus gap champion−challenger sebagai metrik tersendiri; metrik tanpa label segera, metrik berlabel hanya cohort matang.", 1),
]

MD85 = "content/mlf-m85-governance-approval-workflow.md"
MD85_PAIRS = [
    # N1 noise: label [notebook] pada "31 fitur" dan "cv=3".
    ("31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05.",
     "31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05.", 1),
    # S4: tugas validator — conceptual soundness + outcomes analysis + monitoring + three lines.
    ("**Validator independen:** memeriksa model tanpa ikut membangunnya [M8.1] — mengulang perhitungan pada data yang belum dipakai memilih, menulis opini (termasuk kelemahannya), dan berkata TIDAK bila buktinya tidak cukup.",
     "**Validator independen:** memeriksa model tanpa ikut membangunnya [M8.1] — menilai conceptual soundness desain, mengulang perhitungan pada data yang belum dipakai memilih (outcomes analysis), dan memakai hasil monitoring [M7.5] sebagai input — lalu menulis opini (termasuk kelemahannya), dan berkata TIDAK bila buktinya tidak cukup. Pemetaannya ke three lines [M8.1]: owner = lini 1, validator/komite = lini 2, audit = lini 3 (melapor ke dewan/komite audit, bukan ke owner).", 1),
    # N4: tier komite — rujuk angka materiality M8.2.
    ("**Komite model risk:** memutuskan model BOLEH atau TIDAK dipakai di produksi, menetapkan tier risiko, dan mencabut persetujuan bila revalidasi gagal.",
     "**Komite model risk:** memutuskan model BOLEH atau TIDAK dipakai di produksi, menetapkan tier risiko [M8.2] (total limit test NT$1.007.777.680; approved NT$424.180.000, share 0,4209; EL approved NT$11.989.453; EL seluruh test NT$78.675.378), dan mencabut persetujuan bila revalidasi gagal.", 1),
    # N6/N7/S3: baris RACI proposal + validasi + sign-off.
    ("Proposal perubahan: R = model owner, A = model owner, C = validator dan risk manager, I = komite dan tim bisnis.",
     "Proposal perubahan: R = model owner, A = model owner, C = validator (hanya kelayakan data/metodologi, bukan isi keputusan) dan risk manager, I = komite dan tim bisnis.", 1),
    ("Validasi independen [M8.1]: R = validator, A = komite, C = model owner, I = audit internal.",
     "Validasi independen [M8.1]: R = validator, A = validator (atas isi opini — komite menerima atau menolak opini itu di baris sign-off), C = model owner, I = audit internal.", 1),
    ("Sign-off: R = masing-masing penandatangan atas bagiannya, A = komite, C = legal dan risk manager, I = tim bisnis.",
     "Sign-off: R = validator (opini), model owner (pemakaian bisnis), legal/risk (kepatuhan); A = komite; C = —; I = tim bisnis, audit.", 1),
    # M3: PSI 0,5811 = simulasi drift S2 (semua kemunculan di .md).
    ("Analis monitoring yang melihat PSI 0,5811 [M7.5] tetap harus berteriak walau hurufnya hanya R di baris monitoring.",
     "Analis monitoring yang melihat PSI simulasi drift S2 0,5811 [m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test] tetap harus berteriak walau hurufnya hanya R di baris monitoring.", 1),
    ("(3) **Temuan monitoring [M7.5]** — PSI skor di atas 0,25 (seperti simulasi S2, 0,5811), ROC-AUC turun lebih dari 0,02 atau PR-AUC turun lebih dari 0,03 dalam 2 periode berturut-turut, ECE di atas 0,02 yang bertahan, atau alert fairness — AIR grup mana pun di bawah 0,80 selama 2 periode berturut-turut.",
     "(3) **Temuan monitoring [M7.5]** — PSI skor di atas 0,25 [kebijakan lesson ini] (seperti simulasi drift S2, PSI 0,5811 [m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test]), ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] atau PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode berturut-turut, ECE di atas 0,02 [kebijakan lesson ini] yang bertahan, atau alert fairness — AIR grup mana pun di bawah 0,80 [kebijakan lesson ini] selama 2 periode berturut-turut.", 1),
    ("PSI 0,5811 tidak perlu diperdebatkan; ia sudah masuk daftar pemicu sejak hari pertama.",
     "PSI simulasi drift S2 0,5811 tidak perlu diperdebatkan; ia sudah masuk daftar pemicu sejak hari pertama.", 1),
    ("jadwal tahunan tidak menolong bila PSI sudah 0,5811 di bulan ketiga.",
     "jadwal tahunan tidak menolong bila PSI sudah 0,5811 (simulasi drift S2) di bulan ketiga.", 1),
    # S6 noise: AIR SEX 0,15 = 0,8906 -> kunci kanonik.
    ("AIR SEX pada 0,15 justru 0,8906, sedikit lebih baik dari 0,8694 pada 0,10 [M7.1]",
     "AIR SEX pada 0,15 justru 0,8906 [m71_air_sex_by_threshold.0.15.air], sedikit lebih baik dari 0,8694 pada 0,10 [M7.1]", 1),
    ("termasuk AIR SEX (0,8694 ke 0,8906 [M7.1] — fairness sedikit MEMBAIK)",
     "termasuk AIR SEX (0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air] — fairness sedikit MEMBAIK)", 1),
    ("- Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [M7.1], profit masih positif) — governance memutuskan dengan mata terbuka, bukan menolak semua perubahan.",
     "- Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air], profit masih positif) — governance memutuskan dengan mata terbuka, bukan menolak semua perubahan.", 1),
    # S2: kadensi monitoring — pisah tanpa-label (harian) vs berlabel (per periode).
    ("**Tahap 5, Monitoring [M7.5]:** PSI skor, ROC-AUC/PR-AUC per periode, dan alert fairness terpisah — dibaca tiap pagi oleh analis, mingguan oleh risk manager.",
     "**Tahap 5, Monitoring [M7.5]:** DUA kolom yang dibaca dengan kadensi berbeda. Harian (tanpa label, tersedia segera): PSI skor, distribusi skor, approval rate, dan AIR — dibaca tiap pagi oleh analis. Per periode SETELAH label matang (jendela observasi 1 bulan [M7.5]): ROC-AUC/PR-AUC, bad rate yang disetujui, dan ECE — dibaca mingguan oleh risk manager, karena metrik berlabel selalu tertinggal dari PSI: temuan berbasis label datang berminggu-minggu setelah PSI sudah berteriak.", 1),
    # M1+M2+S5: gerbang 6 = VERIFIKASI kriteria rollback (ditulis di gerbang 1).
    ("(6) **Rollback criteria** — ditulis SEBELUM produksi: kapan versi baru dicabut, dan ke versi apa kembali.",
     "(6) **Rollback criteria** — VERIFIKASI kriteria rollback yang ditulis di gerbang (1), sebelum produksi: kapan versi baru dicabut, dan ke versi apa kembali.", 1),
    ("**Gambar:** change control enam gerbang G10 — 1 Proposal, 2 Offline validation, 3 Legal/risk approval, 4 Shadow/canary, 5 Production, 6 Rollback criteria — dengan strip pemicu revalidasi di bawah dan catatan rollback v2 = threshold tunggal 0,10.",
     "**Gambar:** change control enam gerbang G10 — 1 Proposal, 2 Offline validation, 3 Legal/risk approval, 4 Shadow/canary, 5 Production, 6 Rollback gate (verifikasi kriteria yang ditulis di gerbang 1) — dengan strip pemicu revalidasi di bawah dan catatan rollback v2 = threshold tunggal 0,10.", 1),
    ("Enam gerbang [M7.4]: (1) **Proposal** — tuliskan perubahan ini DULU, sebelum satu baris kode berubah;",
     "Enam gerbang [M7.4] — pemetaan ke lima tahap (Langkah 4): gerbang 1 = tahap 1 (proposal); gerbang 2 = tahap 2 (validasi); gerbang 3 = legal/risk approval + sign-off komite (Langkah 5); gerbang 4–5 = tahap deploy (Langkah 4); gerbang 6 = verifikasi kriteria rollback yang ditulis di gerbang 1. Enam gerbang [M7.4]: (1) **Proposal** — tuliskan perubahan ini DULU, sebelum satu baris kode berubah;", 1),
    # N3: 19,42% dari dua model, bukan dari perubahan threshold.
    ("shadow menangkap perbedaan keputusan per nasabah (19,42% [M8]);",
     "shadow menangkap perbedaan keputusan per nasabah (19,42% [M8] — angka ini dari dua model yang berbeda, bukan dari perubahan threshold; untuk perubahan threshold, tabel keputusan yang berubah dihitung ulang di gerbang 4);", 1),
    # N2: argumen "0,10 berarti beda" via selisih ROC-AUC -> Brier + approval.
    ("dan keduanya berarti hal yang berbeda (GBM mentah ROC-AUC 0,7823 vs terkalibrasi 0,7816 [M6.4]).",
     "dan keduanya berarti hal yang berbeda (pemetaan probabilitas berbeda: Brier mentah 0,1342 vs terkalibrasi 0,1345; LR mentah pada 0,10 menyetujui 20,25% vs champion 28,5% [M8]).", 1),
    # M2: mini-case gerbang 6 + ambang kebijakan.
    ("**Gerbang 6 — Rollback criteria,** ditulis SEBELUM produksi: cabut 0,15 dan kembali ke 0,10 bila bad rate yang disetujui melewati ambang yang ditulis (misalnya di atas 10% selama 2 periode [M7.5]) atau AIR SEX jatuh di bawah 0,80.",
     "**Gerbang 6 — Rollback criteria,** VERIFIKASI kriteria yang ditulis di gerbang 1 sebelum produksi: cabut 0,15 dan kembali ke 0,10 bila bad rate yang disetujui melewati ambang yang ditulis (misalnya di atas 10% selama 2 periode [kebijakan lesson ini]) atau AIR SEX jatuh di bawah 0,80 [kebijakan lesson ini].", 1),
    # Rangkuman: gerbang 6 + ambang kebijakan.
    ("- Change control G10 [M7.4]: enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → production → rollback criteria, ditulis sebelum produksi); rollback v2 = threshold tunggal 0,10.",
     "- Change control G10 [M7.4]: enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → production → rollback criteria, verifikasi kriteria yang ditulis di gerbang 1 sebelum produksi); rollback v2 = threshold tunggal 0,10.", 1),
    ("- Revalidasi wajib bila: data baru, penggunaan baru, temuan monitoring [M7.5] (PSI skor di atas 0,25, ROC-AUC turun lebih dari 0,02 / PR-AUC turun lebih dari 0,03 dalam 2 periode, ECE di atas 0,02 bertahan, AIR di bawah 0,80 selama 2 periode), atau kalender (paling lambat 12 bulan sejak approval terakhir).",
     "- Revalidasi wajib bila: data baru, penggunaan baru, temuan monitoring [M7.5] (PSI skor di atas 0,25 [kebijakan lesson ini], ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] / PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode, ECE di atas 0,02 [kebijakan lesson ini] bertahan, AIR di bawah 0,80 [kebijakan lesson ini] selama 2 periode), atau kalender (paling lambat 12 bulan sejak approval terakhir).", 1),
]


def main():
    ap = argparse.ArgumentParser(description="Fix review DeepSeek M8 (mirror .md saja; TS di fix_m8_review.py).")
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    dry = args.dry
    total = 0
    total += apply(MD81, MD81_PAIRS, dry)
    total += apply(MD82, MD82_PAIRS, dry)
    total += apply(MD83, MD83_PAIRS, dry)
    total += apply(MD84, MD84_PAIRS, dry)
    total += apply(MD85, MD85_PAIRS, dry)
    print(f"\nTOTAL pasangan terapkan: {total}" + (" (DRY-RUN, tidak ada file diubah)" if dry else ""))


if __name__ == "__main__":
    main()
