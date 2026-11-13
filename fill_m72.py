#!/usr/bin/env python3
"""Fill gap Luna M7 — M7.2: G2 (intersectional audit) + G3 (bootstrap CI) +
G8 (enrich measurement-bias + Lab 4) + Lab 3 (G2, group_key) + 1 quiz (G3).
Insert G2 after 'aggregation-bias' (step 9), G3 after 'noise-vs-sinyal'
(step 12); labs 3-4 before checkpoint; checkpoint 17.
'langkah N' refs: ONLY 'langkah 10'->'langkah 11' (noise-vs-sinyal);
'langkah 1/3/4/5' inside workflow-audit are its own sub-list — DO NOT touch.
Peta; estMinutes 70->90; +1 quiz; summary bullets. TS + .md mirror.
Numbers: qa-learn/m7_gap_fill_numbers.json (G2/G3/G8, verified vs canonical).
"""
import re
from pathlib import Path

TS = Path("src/app/v2/content/mlf-m72-bias-audit-sources.ts")
MD = Path("content/mlf-m72-bias-audit-sources.md")

G2_BLOCK = '''    {
      id: "intersectional-audit",
      eyebrow: "Langkah 9 · Audit irisan",
      title: "Audit irisan: ketika dua atribut bertemu, ketimpangan bisa jauh lebih parah",
      prose: [
        "Stratifikasi (langkah 8) memotong data SATU atribut pada satu waktu: SEX saja, EDUCATION saja, AGE saja. Audit irisan memotong DUA atribut sekaligus: SEX × EDUCATION, SEX × AGE. Bedanya bukan teknik — bedanya adalah APA YANG BISA DISEMBUNYIKAN. Satu atribut bisa tampak «lumayan» sementara irisannya parah: AIR SEX global 0,8693 dan AIR EDUCATION SMA 0,3572 (terhadap Lainnya) masing-masing sudah flag — tapi tidak satu pun dari keduanya memberitahumu bahwa laki-laki SMA approval-nya hanya 16,30%. Stratifikasi menjawab «grup mana yang timpang?»; audit irisan menjawab «KOMBINASI mana yang paling timpang?» — dan jawabannya sering kali bukan kombinasi yang kamu tebak dari marginalnya.",
        "Nilai [notebook] — audit irisan SEX × EDUCATION, test 6.000, GBM terkalibrasi, threshold 0,10; AIR = approval sel dibagi approval tertinggi dalam tabel yang sama (Perempuan × Lainnya 0,6140). Laki-laki × Pascasarjana: approval 0,3400, AIR 0,5537 (n = 900, base rate 0,2067, FPR 0,5938, TPR 0,9140, Wilson [0,3098; 0,3716]). Laki-laki × Universitas: 0,2270, AIR 0,3697 (n = 1.066, FPR 0,7255, TPR 0,9195, [0,2029; 0,2531]). Laki-laki × SMA: 0,1630, AIR 0,2655 (n = 411, base rate 0,2701, FPR 0,7933, TPR 0,9550, PPV 0,3081, [0,1305; 0,2018]) — sel TERPARAH di tabel ini, dan n-nya cukup besar untuk divonis. Laki-laki × Lainnya: 0,5200, AIR 0,8469 — tapi n = 25, JANGAN VONIS. Perempuan × Pascasarjana: 0,3626, AIR 0,5906 (n = 1.230). Perempuan × Universitas: 0,2670, AIR 0,4349 (n = 1.708). Perempuan × SMA: 0,2405, AIR 0,3917 (n = 603). Perempuan × Lainnya: 0,6140, AIR 1,0000 — tapi n = 57, terlalu kecil untuk vonis: TPR-nya 0,0 dan PPV-nya 0,0 karena hanya ada 2 defaulter dan keduanya di-approve — artefak sel kecil, bukan vonis.",
        "Nilai [notebook] — audit irisan SEX × AGE; AIR = approval sel dibagi approval tertinggi dalam tabel yang sama (Perempuan × 30–39 0,3447). Laki-laki × <30: 0,2138, AIR 0,6202 (n = 669). Laki-laki × 30–39: 0,3120, AIR 0,9051 (n = 907) — satu-satunya sel laki-laki yang mendekati adil. Laki-laki × 40–49: 0,2652, AIR 0,7694 (n = 558). Laki-laki × 50–59: 0,2026, AIR 0,5878 (n = 232, [0,1559; 0,2590]). Laki-laki × 60+: 0,1944, AIR 0,5640 — n = 36, terlalu kecil untuk vonis (Wilson [0,0975; 0,3503] selebar 0,2528). Perempuan × <30: 0,2944, AIR 0,8541 (n = 1.243). Perempuan × 30–39: 0,3447, AIR 1,0000 (n = 1.291). Perempuan × 40–49: 0,2733, AIR 0,7929 (n = 783). Perempuan × 50–59: 0,2033, AIR 0,5898 (n = 241). Perempuan × 60+: 0,2000, AIR 0,5802 (n = 40, flag). Pesan yang sama di kedua tabel: AIR global SEX 0,8693 MENYEMBUNYIKAN irisan yang jauh lebih parah — sel terendah SEX × EDUCATION 0,2655 (selisih −0,6038 dari global) dan sel terendah SEX × AGE 0,5640 (selisih −0,3053).",
        "Baik atau buruk: audit irisan bagus karena ia menemukan ketimpangan yang tidak terlihat dari marginal mana pun — laki-laki SMA bukan «laki-laki yang timpang» maupun «SMA yang timpang», melainkan kombinasi keduanya yang menumpuk. Buruk bila dibaca sebagai «semakin banyak irisan semakin baik»: tiap irisan membelah n menjadi potongan yang makin kecil — 18 sel di dua tabel ini, 4 di antaranya n < 100 — dan sel kecil menghasilkan angka ekstrem yang tidak bisa dipercaya (Perempuan × Lainnya TPR 0,0 adalah contohnya). Aturan yang sama seperti langkah 4: sel dengan n < 100 dilabeli «terlalu kecil untuk vonis» — dilaporkan, tidak divonis. Dan buruk bila irisan dibaca sebagai «bukti diskriminasi terhadap kombinasi itu»: irisan menunjukkan DI MANA ketimpangan tinggal, bukan MENGAPA ia ada — penyebabnya tetap butuh penyelidikan sumber (langkah 2).",
        "Mitigasi: tambahkan audit irisan ke workflow-mu (langkah 10) sebagai langkah 3b — SETELAH tabel audit lengkap, SEBELUM penyelidikan sumber. Dua dimensi dulu (SEX × EDUCATION, SEX × AGE); tiga dimensi hanya bila n-nya memungkinkan. Dan satu peringatan yang wajib ditulis di samping tabel irisan: multiple comparisons. Delapan belas sel diuji pada ambang 5% berarti ~1 flag palsu diharapkan muncul secara kebetulan — jadi satu sel yang flag sendirian, tanpa pola di sel tetangganya, adalah kandidat noise sebelum jadi vonis. Aturan praktisnya: flag yang berdiri sendiri diselidiki; flag yang membentuk POLA (semua sel laki-laki SMA/50+/60+ di bawah 0,65) ditindaklanjuti. Koreksi formalnya (Bonferroni: 0,05/18 ≈ 0,0028) ada sebagai konsep — yang dipakai di lesson ini adalah aturan n minimum + pola, bukan p-value yang dikoreksi.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="AIR per sel irisan SEX kali EDUCATION: laki-laki SMA 0,2655 paling rendah, perempuan Lainnya 1,0000 tertinggi dengan n kecil">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">AIR per sel irisan SEX × EDUCATION (global SEX: 0,8693)</text>
<line x1="20" y1="72" x2="470" y2="72" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="66" text-anchor="end" font-size="9" fill="var(--text)" font-family="var(--font-ui)">ambang 0,80</text>
<rect x="30" y="111" width="40" height="89" fill="var(--c1)" opacity="0.7"/>
<rect x="84" y="141" width="40" height="59" fill="var(--c1)" opacity="0.7"/>
<rect x="138" y="157" width="40" height="43" fill="var(--c1)" opacity="0.7"/>
<rect x="192" y="64" width="40" height="136" fill="var(--c1)" opacity="0.7"/>
<rect x="246" y="105" width="40" height="95" fill="var(--c4)" opacity="0.7"/>
<rect x="300" y="130" width="40" height="70" fill="var(--c4)" opacity="0.7"/>
<rect x="354" y="137" width="40" height="63" fill="var(--c4)" opacity="0.7"/>
<rect x="408" y="40" width="40" height="160" fill="var(--c4)" opacity="0.7"/>
<line x1="20" y1="200" x2="460" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="50" y="100" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,554</text>
<text x="104" y="130" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,370</text>
<text x="158" y="146" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,266</text>
<text x="212" y="53" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,847*</text>
<text x="266" y="94" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,591</text>
<text x="320" y="119" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,435</text>
<text x="374" y="126" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,392</text>
<text x="428" y="29" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">1,000*</text>
<text x="50" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">L·Pasca</text>
<text x="104" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">L·Univ</text>
<text x="158" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">L·SMA</text>
<text x="212" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">L·Lainnya</text>
<text x="266" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">P·Pasca</text>
<text x="320" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">P·Univ</text>
<text x="374" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">P·SMA</text>
<text x="428" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">P·Lainnya</text>
<text x="240" y="240" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">* n kecil — jangan vonis (L·Lainnya n = 25; P·Lainnya n = 57). L·SMA 0,2655 (n = 411) adalah vonis yang sah.</text>
</svg>`,
        alt: "AIR per sel irisan SEX kali EDUCATION: laki-laki SMA 0,2655 paling rendah, perempuan Lainnya 1,0000 tertinggi dengan n kecil.",
        caption: "Cara membaca: AIR = approval sel dibagi approval tertinggi dalam tabel yang sama (Perempuan × Lainnya 0,6140). Garis putus-putus = ambang 0,80. Tujuh dari delapan sel di bawah ambang — dan sel terendah (Laki-laki × SMA 0,2655, n = 411) jauh di bawah AIR global SEX 0,8693. Dua sel bertanda * punya n kecil (25 dan 57) — dilaporkan, tidak divonis.",
      },
      tasks: [],
    },
'''

G3_BLOCK = '''    {
      id: "ketidakpastian-bootstrap",
      eyebrow: "Langkah 12 · Ketidakpastian bootstrap",
      title: "Ketidakpastian bootstrap: «tidak signifikan» bukan berarti «tidak ada gap»",
      prose: [
        "Selisih SEX +3,93 poin persen adalah sinyal (uji-z, p = 0,001, langkah 11) — tapi «sinyal» tidak berkata SEBERAPA BESAR gap itu sebenarnya. Bootstrap menjawab pertanyaan itu: ulangi pengukuran 1.000 kali pada sampel ulang (resample) dari test 6.000 yang sama, dan lihat seberapa lebar sebaran hasilmu. Interval kepercayaan (CI) 95% yang dihasilkan bukan «jawaban yang benar» — ia adalah RENTANG nilai yang masih cocok dengan datamu. Gap yang CI-nya mencakup 0 BUKAN gap yang «tidak ada» — ia gap yang datamu tidak bisa bedakan dari 0. Dan gap yang CI-nya tidak mencakup 0 adalah gap yang datamu katakan «bukan nol» — dengan kepercayaan 95%.",
        "Nilai [notebook] — bootstrap 1.000 ulangan, seed 42, resample seluruh test 6.000; semua gap F−M (perempuan dikurangi laki-laki). Selisih approval: +3,93 poin persen, CI 95% [1,78; 6,22] — TIDAK mencakup 0: gap approval itu nyata. AIR SEX: 0,8693, CI [0,7978; 0,9391] — TIDAK mencakup 1: AIR di bawah 1 itu nyata (dan seluruh CI-nya di bawah 1, tapi batas atasnya 0,9391 masih di atas ambang 0,80 — jadi «nyata» tidak sama dengan «di bawah ambang»). Gap TPR: −0,0191, CI [−0,0498; 0,0110] — MENCakup 0: tidak bisa divonis. Gap FPR: −0,0383, CI [−0,0653; −0,0123] — TIDAK mencakup 0: gap FPR itu nyata. Gap ECE: +0,0012, CI [−0,0155; 0,0118] — mencakup 0 (dan rata-rata bootstrap-nya −0,0015, berlawanan tanda dengan titiknya — keduanya dekat 0, jadi tidak disimpulkan apa-apa). Gap Brier: −0,0143, CI [−0,0257; −0,0036] — TIDAK mencakup 0: gap Brier itu nyata. Gap PPV: −0,0168, CI [−0,0446; 0,0101] — mencakup 0: tidak bisa divonis. Empat dari tujuh gap nyata; tiga tidak bisa divonis — dan ketiganya tetap DILAPORKAN dengan CI-nya, bukan dihapus.",
        "Baik atau buruk: bootstrap CI bagus karena ia mengubah «sinyal vs noise» dari vonis biner menjadi RENTANG — kamu bisa melihat sendiri seberapa goyah tiap gap: CI approval selebar 4,44 poin persen, CI AIR selebar 0,1414. Buruk bila dibaca sebagai «CI mencakup 0 berarti tidak ada gap»: CI TPR [−0,0498; 0,0110] mencakup 0 DAN mencakup −0,0498 — gap TPR yang sebenarnya bisa sebesar −4,98 poin persen. «Tidak signifikan» berarti «data ini tidak cukup untuk membedakan», bukan «gapnya nol». Dan buruk bila CI dilaporkan tanpa n dan tanpa metode: CI dari n = 82 (Lainnya) selebar 0,2085, dari n = 2.000 selebar 0,0431 — lebar CI adalah informasi, bukan hiasan. Sebagai pembanding lebar: interval Wilson approval SEX — laki-laki [0,2443; 0,2794] lebar 0,0351; perempuan [0,2860; 0,3159] lebar 0,0299.",
        "Mitigasi: laporkan SETIAP gap dengan CI-nya — titik + interval, bukan titik saja. Dan bila kamu mengaudit BANYAK gap sekaligus (delapan belas sel irisan di langkah 9, tujuh metrik di langkah ini), ingat multiple comparisons: tiap CI 95% punya peluang 5% meleset sendirian — dari 18 sel, ~1 flag palsu diharapkan muncul secara kebetulan. Aturan praktisnya sama seperti di langkah 9: flag yang berdiri sendiri diselidiki; flag yang membentuk POLA ditindaklanjuti. Dan satu kalimat yang wajib kamu hafal: «tidak signifikan ≠ tidak ada gap» — yang tidak signifikan adalah BUKTI-MU, bukan gap-nya.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Forest plot: selisih approval, TPR, FPR, PPV, ECE, Brier antara perempuan dan laki-laki dengan interval kepercayaan bootstrap 95 persen">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Gap F−M (poin persen) dengan CI 95% bootstrap — 0 = tidak ada gap</text>
<line x1="250" y1="30" x2="250" y2="205" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="250" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0</text>
<text x="87" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−6</text>
<text x="169" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−3</text>
<text x="331" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">+3</text>
<text x="413" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">+6</text>
<text x="55" y="54" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Approval</text>
<line x1="298" y1="50" x2="419" y2="50" stroke="#1565c0" stroke-width="2"/>
<circle cx="357" cy="50" r="4" fill="#1565c0"/>
<text x="292" y="54" text-anchor="end" font-size="9" fill="var(--text)" font-family="var(--font-ui)">+3,93 [1,78; 6,22]</text>
<text x="55" y="84" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">TPR</text>
<line x1="115" y1="80" x2="280" y2="80" stroke="#9e9e9e" stroke-width="2"/>
<circle cx="198" cy="80" r="4" fill="#9e9e9e"/>
<text x="286" y="84" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−1,91 [−4,98; 1,10]</text>
<text x="55" y="114" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">FPR</text>
<line x1="73" y1="110" x2="217" y2="110" stroke="#1565c0" stroke-width="2"/>
<circle cx="146" cy="110" r="4" fill="#1565c0"/>
<text x="223" y="114" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−3,83 [−6,53; −1,23]</text>
<text x="55" y="144" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">PPV</text>
<line x1="129" y1="140" x2="277" y2="140" stroke="#9e9e9e" stroke-width="2"/>
<circle cx="204" cy="140" r="4" fill="#9e9e9e"/>
<text x="283" y="144" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−1,68 [−4,46; 1,01]</text>
<text x="55" y="174" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">ECE</text>
<line x1="208" y1="170" x2="282" y2="170" stroke="#9e9e9e" stroke-width="2"/>
<circle cx="253" cy="170" r="4" fill="#9e9e9e"/>
<text x="288" y="174" font-size="9" fill="var(--text)" font-family="var(--font-ui)">+0,12 [−1,55; 1,18]</text>
<text x="55" y="204" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Brier</text>
<line x1="180" y1="200" x2="240" y2="200" stroke="#1565c0" stroke-width="2"/>
<circle cx="211" cy="200" r="4" fill="#1565c0"/>
<text x="246" y="204" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−1,43 [−2,57; −0,36]</text>
<text x="240" y="244" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Biru = CI tidak mencakup 0 (gap nyata). Abu-abu = CI mencakup 0 (tidak bisa divonis — bukan «tidak ada gap»).</text>
</svg>`,
        alt: "Forest plot: selisih approval, TPR, FPR, PPV, ECE, Brier antara perempuan dan laki-laki dengan interval kepercayaan bootstrap 95 persen.",
        caption: "Cara membaca: titik = gap F−M (poin persen), garis = CI 95% bootstrap (1.000 ulangan, seed 42). Biru = CI tidak mencakup 0 (approval, FPR, Brier — gap nyata). Abu-abu = CI mencakup 0 (TPR, PPV, ECE — tidak bisa divonis, bukan «tidak ada gap»). AIR SEX tidak digambar di sini (satuannya rasio, bukan poin persen): 0,8693, CI [0,7978; 0,9391] — tidak mencakup 1.",
      },
      tasks: [],
    },
'''

G8_P1 = '''        "Nilai [notebook] — checklist kualitas data per grup, dihitung dari data penuh 30.000 baris. (1) Nilai hilang: 0 di mana-mana — 0 NaN di semua 19 fitur utama (LIMIT_BAL, PAY_0..6, BILL_AMT1..6, PAY_AMT1..6), overall maupun per SEX/EDUCATION — dataset ini lengkap, tidak ada imputasi yang dibutuhkan. (2) Kategori invalid: EDUCATION kode 0/5/6 (di luar 1–4) = 345 baris (1,15%; kode mentah 0 = 14, 4 = 123, 5 = 280, 6 = 51) — dan 73,72% dari grup «Lainnya» EDUCATION adalah kode-kode ini, jadi grup Lainnya mencampur kode yang berbeda maknanya; MARRIAGE kode 0 = 54 baris (0,18%), terkonsentrasi di SMA (44 dari 54; 0,89% dari SMA). (3) Pelanggaran range: BILL_AMT negatif (salah satu dari 6) = 1.930 baris (6,43%; laki-laki 7,04% vs perempuan 6,03%; tertinggi Pascasarjana 8,50%) — plausibel sebagai kredit/kelebihan bayar, bukan error; PAY_AMT negatif = 0; LIMIT_BAL ≤ 0 = 0; AGE di luar 21–79 = 0. (4) Duplikat: 0 baris penuh termasuk ID; 35 baris (0,12%) duplikat di luar ID — baris kembar dari nasabah berbeda pada 24 kolom, kecil tapi patut dicurigai sebagai duplikasi pencatatan.",'''
G8_P2 = '''        "Baik atau buruk: checklist ini bagus karena ia membedakan «data kotor» dari «data yang tampak kotor»: BILL_AMT negatif 6,43% tampak seperti error tapi plausibel — membersihkannya tanpa memahami artinya justru MERUSAK data. Buruk bila dibaca sebagai «0 missing berarti data bersih»: 345 baris kode invalid EDUCATION tidak muncul sebagai missing — ia muncul sebagai grup «Lainnya» yang tampak sah, dan audit yang tidak memeriksa kode mentahnya akan mengira Lainnya adalah satu grup yang homogen. Mitigasi: sebelum audit apa pun, jalankan checklist ini per grup — missingness, kategori invalid, pelanggaran range, duplikat, validitas timestamp — dan laporkan hasilnya di samping tabel audit. Fitur yang perlu investigasi di data ini: EDUCATION (kode invalid mencampur grup Lainnya) dan MARRIAGE (kode 0 terkonsentrasi di SMA).",'''

G8_FIGURE = '''      figure: {
        svg: `<svg viewBox="0 0 520 220" role="img" aria-label="Heatmap kualitas data per grup: nilai hilang nol di mana-mana, kode invalid EDUCATION 73,72 persen di grup Lainnya, BILL_AMT negatif 5 sampai 8 persen">
<text x="260.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kualitas data per grup (%, data penuh 30.000 baris)</text>
<text x="175" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Laki</text>
<text x="227" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Perempuan</text>
<text x="279" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Pasca</text>
<text x="331" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Univ</text>
<text x="383" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">SMA</text>
<text x="435" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Lainnya</text>
<text x="144" y="64" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Nilai hilang (19 fitur)</text>
<rect x="150" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="202" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="254" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="306" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="358" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="410" y="48" width="50" height="24" fill="#e8f5e9"/>
<text x="175" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="227" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="279" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="331" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="383" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="435" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="144" y="94" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Kode invalid EDUCATION</text>
<rect x="150" y="78" width="50" height="24" fill="#ffe082"/><rect x="202" y="78" width="50" height="24" fill="#ffe082"/><rect x="254" y="78" width="50" height="24" fill="#e8f5e9"/><rect x="306" y="78" width="50" height="24" fill="#e8f5e9"/><rect x="358" y="78" width="50" height="24" fill="#e8f5e9"/><rect x="410" y="78" width="50" height="24" fill="#c62828"/>
<text x="175" y="94" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">1,08%</text>
<text x="227" y="94" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">1,20%</text>
<text x="279" y="94" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="331" y="94" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="383" y="94" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="435" y="94" text-anchor="middle" font-size="9" fill="#ffffff" font-family="var(--font-ui)">73,72%</text>
<text x="144" y="124" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Kode invalid MARRIAGE (0)</text>
<rect x="150" y="108" width="50" height="24" fill="#fff9c4"/><rect x="202" y="108" width="50" height="24" fill="#fff9c4"/><rect x="254" y="108" width="50" height="24" fill="#fff9c4"/><rect x="306" y="108" width="50" height="24" fill="#fff9c4"/><rect x="358" y="108" width="50" height="24" fill="#fff9c4"/><rect x="410" y="108" width="50" height="24" fill="#e8f5e9"/>
<text x="175" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,12%</text>
<text x="227" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,22%</text>
<text x="279" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,04%</text>
<text x="331" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,04%</text>
<text x="383" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,89%</text>
<text x="435" y="124" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="144" y="154" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">BILL_AMT negatif</text>
<rect x="150" y="138" width="50" height="24" fill="#ffcc80"/><rect x="202" y="138" width="50" height="24" fill="#ffcc80"/><rect x="254" y="138" width="50" height="24" fill="#ffcc80"/><rect x="306" y="138" width="50" height="24" fill="#ffcc80"/><rect x="358" y="138" width="50" height="24" fill="#ffcc80"/><rect x="410" y="138" width="50" height="24" fill="#ffcc80"/>
<text x="175" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">7,04%</text>
<text x="227" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">6,03%</text>
<text x="279" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">8,50%</text>
<text x="331" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">5,18%</text>
<text x="383" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">5,47%</text>
<text x="435" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">7,27%</text>
<text x="260" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Hijau 0% · kuning pucat &lt;1% · kuning 1–2% · oranye 5–9% · merah &gt;70%.</text>
<text x="260" y="204" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Duplikat di luar ID: 35 baris (0,12%) — tidak per grup, lihat prose. PAY_AMT negatif, LIMIT_BAL ≤ 0, AGE di luar 21–79: semuanya 0.</text>
</svg>`,
        alt: "Heatmap kualitas data per grup: nilai hilang nol di mana-mana, kode invalid EDUCATION 73,72 persen di grup Lainnya, BILL_AMT negatif 5 sampai 8 persen.",
        caption: "Cara membaca: tiap sel = persentase baris dalam grup itu yang terkena pemeriksaan tersebut. Nilai hilang 0% di mana-mana — dataset lengkap. Yang merah: 73,72% grup «Lainnya» EDUCATION adalah kode invalid 0/5/6 — grup itu mencampur kode yang berbeda maknanya. BILL_AMT negatif 5–9% di semua grup adalah kredit/kelebihan bayar yang plausibel, bukan error.",
      },
'''

LAB3_BLOCK = '''    {
      id: "lab3",
      eyebrow: "Langkah 15 · Lab 3",
      title: "Lab: audit irisan — group_key dan gap yang disembunyikan angka global",
      prose: [
        "Lab ketiga menghitung audit irisan dari angka kanonis [notebook]. Approval rate SEX × EDUCATION, test 6.000, GBM terkalibrasi, threshold 0,10 — tertinggi Perempuan × Lainnya 0,6140 (n = 57, flag n < 100). Laki-laki × SMA: approval 0,1630 (n = 411). AIR global SEX: 0,8693. Tugasmu: hitung AIR Laki-laki × SMA dari dua approval rate itu, hitung seberapa besar gap yang disembunyikan angka global, dan hitung berapa sel kecil (n < 100) di antara sel-sel yang tercantum di N (termasuk Laki-laki × Lainnya n = 25; Perempuan × Lainnya n = 57; Laki-laki × 60+ n = 36; Perempuan × 60+ n = 40).",
        "Hasil yang diharapkan [lab]: air_laki_sma=0.2655; gap_tersembunyi=0.6038; small_cells=4. Bacalah ketiganya berdampingan: AIR global 0,8693 tampak «hampir adil» — tapi irisan terendahnya 0,2655, selisih 0,6038. Itulah yang disembunyikan angka global: bukan ketimpangan yang hilang, melainkan ketimpangan yang dirata-rata. Dan keempat sel kecil itu dilaporkan — tidak divonis.",
        "Setelah lab jalan, bandingkan dengan langkah 9: flag yang berdiri sendiri diselidiki; flag yang membentuk POLA (semua sel laki-laki SMA/50+/60+ di bawah 0,65) ditindaklanjuti.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi air_laki_sma: approval Laki-laki x SMA dibagi approval tertinggi (Perempuan x Lainnya)" },
        { id: "t2", text: "Lengkapi gap_tersembunyi: AIR global SEX dikurangi air_laki_sma" },
        { id: "t3", text: "Lengkapi small_cells: jumlah sel di N yang n-nya di bawah 100" },
      ],
      expected: "air_laki_sma=0.2655\\ngap_tersembunyi=0.6038\\nsmall_cells=4",
      hints: [
        "AIR sel = approval sel / approval tertinggi dalam tabel yang sama: 0,1630 / 0,6140 = 0,2655.",
        "Gap yang disembunyikan = 0,8693 − 0,2655 = 0,6038 — selisih AIR global dengan irisan terendah.",
        "Keempat sel: n = 25, 57, 36, 40 — semuanya di bawah 100, jadi small_cells = 4.",
      ],
      code: {
        starter: `# Lab 3 — audit irisan (intersectional audit) [notebook]
# Approval rate kanonis, test 6.000, GBM terkalibrasi, threshold 0,10
# SEX x EDUCATION: tertinggi Perempuan x Lainnya 0,6140 (n=57, flag n<100); SEX x AGE: sel kecil L x 60+ (n=36), P x 60+ (n=40)
APPR = {
    "L x SMA": 0.1630, "L x Lainnya": 0.5200,
    "P x Lainnya": 0.6140, "P x SMA": 0.2405,
}
N = {"L x SMA": 411, "L x Lainnya": 25, "P x Lainnya": 57, "P x SMA": 603, "L x 60+": 36, "P x 60+": 40}
AIR_GLOBAL_SEX = 0.8693

air_laki_sma = 0.0  # TODO: APPR["L x SMA"] / APPR["P x Lainnya"]
gap_tersembunyi = 0.0  # TODO: AIR_GLOBAL_SEX - air_laki_sma
small_cells = 0  # TODO: jumlah sel di N yang n-nya di bawah 100
print(f"air_laki_sma={air_laki_sma:.4f}")
print(f"gap_tersembunyi={gap_tersembunyi:.4f}")
print(f"small_cells={small_cells}")`,
        lockLines: 10,
        solution: `# Lab 3 — audit irisan (intersectional audit) [notebook]
# Approval rate kanonis, test 6.000, GBM terkalibrasi, threshold 0,10
# SEX x EDUCATION: tertinggi Perempuan x Lainnya 0,6140 (n=57, flag n<100); SEX x AGE: sel kecil L x 60+ (n=36), P x 60+ (n=40)
APPR = {
    "L x SMA": 0.1630, "L x Lainnya": 0.5200,
    "P x Lainnya": 0.6140, "P x SMA": 0.2405,
}
N = {"L x SMA": 411, "L x Lainnya": 25, "P x Lainnya": 57, "P x SMA": 603, "L x 60+": 36, "P x 60+": 40}
AIR_GLOBAL_SEX = 0.8693

air_laki_sma = APPR["L x SMA"] / APPR["P x Lainnya"]
gap_tersembunyi = AIR_GLOBAL_SEX - air_laki_sma
small_cells = sum(1 for n in N.values() if n < 100)
print(f"air_laki_sma={air_laki_sma:.4f}")
print(f"gap_tersembunyi={gap_tersembunyi:.4f}")
print(f"small_cells={small_cells}")`,
        checks: [
          { kind: "equal", task: "t1", name: "air_laki_sma", value: 0.2655, tol: 0.0005, label: "`air_laki_sma` seharusnya 0.2655", msg: "AIR Laki-laki × SMA: 0,1630 / 0,6140 = 0,2655 — irisan terparah di tabel SEX × EDUCATION (n = 411, bisa divonis)." },
          { kind: "equal", task: "t2", name: "gap_tersembunyi", value: 0.6038, tol: 0.0005, label: "`gap_tersembunyi` seharusnya 0.6038", msg: "AIR global SEX 0,8693 menyembunyikan irisan 0,2655 — selisih 0,6038. Angka global merata-ratakan ketimpangan, bukan menghilangkannya." },
          { kind: "equal", task: "t3", name: "small_cells", value: 4, tol: 0, label: "`small_cells` seharusnya 4", msg: "Keempat sel (n = 25, 57, 36, 40) di bawah 100 — dilaporkan, tidak divonis." },
        ],
      },
    },
'''

LAB4_BLOCK = '''    {
      id: "lab4",
      eyebrow: "Langkah 16 · Lab 4",
      title: "Lab (ringkas): checklist kualitas data — tandai fitur yang perlu investigasi",
      prose: [
        "Lab keempat menerapkan checklist kualitas data (langkah 3) pada angka kanonis [notebook, data penuh 30.000 baris]. Kode invalid EDUCATION (0/5/6): 345 baris. BILL_AMT negatif (salah satu dari 6): 1.930 baris. Tugasmu: hitung kedua persentasenya, dan tandai fitur yang perlu investigasi — EDUCATION, karena kode invalid-nya mencampur grup «Lainnya» (73,72% dari grup itu).",
        "Hasil yang diharapkan [lab]: invalid_edu_pct=1.15; bill_neg_pct=6.43; investigasi=EDUCATION. Bacalah ketiganya berdampingan: 1,15% tampak kecil — tapi ia terkonsentrasi di SATU grup (Lainnya), sehingga 73,72% grup itu adalah kode yang berbeda makna. Dan 6,43% BILL_AMT negatif tampak seperti error — tapi ia plausibel sebagai kredit/kelebihan bayar. Checklist yang baik membedakan keduanya: yang satu perlu investigasi, yang satu perlu dipahami.",
        "Setelah lab jalan, bandingkan dengan langkah 3: sebelum audit apa pun, jalankan checklist ini per grup — dan laporkan hasilnya di samping tabel audit.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi invalid_edu_pct: 345 dari 30.000 baris, dalam persen" },
        { id: "t2", text: "Lengkapi bill_neg_pct: 1.930 dari 30.000 baris, dalam persen" },
        { id: "t3", text: "Lengkapi investigasi: fitur yang kode invalid-nya mencampur grup Lainnya" },
      ],
      expected: "invalid_edu_pct=1.15\\nbill_neg_pct=6.43\\ninvestigasi=EDUCATION",
      hints: [
        "345 / 30.000 × 100 = 1,15%.",
        "1.930 / 30.000 × 100 = 6,43% — BILL_AMT negatif plausibel (kredit/kelebihan bayar), bukan error.",
        "EDUCATION: kode 0/5/6 (345 baris) semuanya masuk grup «Lainnya» — 73,72% dari grup itu.",
      ],
      code: {
        starter: `# Lab 4 — checklist kualitas data per grup [notebook, data penuh 30.000 baris]
# Kode invalid EDUCATION (0/5/6): 345 baris; BILL_AMT negatif (salah satu dari 6): 1.930 baris
N_TOTAL = 30000
N_EDU_INVALID = 345
N_BILL_NEG = 1930

invalid_edu_pct = 0.0  # TODO: N_EDU_INVALID / N_TOTAL * 100
bill_neg_pct = 0.0  # TODO: N_BILL_NEG / N_TOTAL * 100
investigasi = ""  # TODO: "EDUCATION" — kode invalid mencampur grup Lainnya (73,72% grup itu)
print(f"invalid_edu_pct={invalid_edu_pct:.2f}")
print(f"bill_neg_pct={bill_neg_pct:.2f}")
print(f"investigasi={investigasi}")`,
        lockLines: 6,
        solution: `# Lab 4 — checklist kualitas data per grup [notebook, data penuh 30.000 baris]
# Kode invalid EDUCATION (0/5/6): 345 baris; BILL_AMT negatif (salah satu dari 6): 1.930 baris
N_TOTAL = 30000
N_EDU_INVALID = 345
N_BILL_NEG = 1930

invalid_edu_pct = N_EDU_INVALID / N_TOTAL * 100
bill_neg_pct = N_BILL_NEG / N_TOTAL * 100
investigasi = "EDUCATION"
print(f"invalid_edu_pct={invalid_edu_pct:.2f}")
print(f"bill_neg_pct={bill_neg_pct:.2f}")
print(f"investigasi={investigasi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "invalid_edu_pct", value: 1.15, tol: 0.01, label: "`invalid_edu_pct` seharusnya 1.15", msg: "Kode invalid EDUCATION: 345 / 30.000 = 1,15% — kecil secara keseluruhan, tapi 73,72% dari grup Lainnya." },
          { kind: "equal", task: "t2", name: "bill_neg_pct", value: 6.43, tol: 0.01, label: "`bill_neg_pct` seharusnya 6.43", msg: "BILL_AMT negatif: 1.930 / 30.000 = 6,43% — plausibel sebagai kredit/kelebihan bayar, bukan error." },
          { kind: "stdout_matches", task: "t3", pattern: "investigasi=EDUCATION", label: "Output menampilkan investigasi=EDUCATION", msg: "EDUCATION perlu investigasi: kode invalid-nya mencampur grup Lainnya." },
        ],
      },
    },
'''

G3_QUIZ = '''        {
          q: "Bootstrap CI 95% untuk gap TPR (F−M) adalah [−0,0498; 0,0110] — mencakup 0. Apakah itu berarti «tidak ada gap TPR»?",
          options: [
            { text: "Tidak — «tidak signifikan ≠ tidak ada gap»: CI mencakup 0 berarti data ini tidak bisa membedakan 0 dari −0,0498; gap sebenarnya bisa sebesar −4,98 poin persen; yang benar adalah melaporkan CI-nya, bukan memvonis «tidak ada»", why: "Benar: CI yang mencakup 0 berkata «nilai 0 masih cocok dengan datamu» — dan nilai −0,0498 JUGA masih cocok. Yang tidak signifikan adalah BUKTI-MU, bukan gap-nya. Vonis yang benar: «gap TPR −0,0191, CI 95% [−0,0498; 0,0110] — tidak bisa divonis dari data ini». Bandingkan dengan gap FPR [−0,0653; −0,0123] yang tidak mencakup 0 — itu yang boleh disebut nyata.", correct: true },
            { text: "Ya — CI yang mencakup 0 berarti gapnya nol, dan TPR laki-laki dan perempuan sama", why: "Salah: CI mencakup 0 bukan berarti titiknya 0 — titiknya −0,0191, dan seluruh rentang [−0,0498; 0,0110] masih mungkin. «Mencakup 0» dan «sama dengan 0» adalah dua klaim yang berbeda." },
            { text: "Ya — karena p > 0,05, hipotesis nol diterima dan gap dinyatakan tidak ada", why: "Salah dua kali: pertama, p > 0,05 berarti «gagal menolak», bukan «menerima» hipotesis nol; kedua, «tidak ada gap» adalah klaim tentang dunia yang butuh bukti — dan CI yang lebar justru menunjukkan bukti yang tidak cukup, bukan bukti ketiadaan." },
            { text: "Tidak — karena CI-nya salah hitung: bootstrap 1.000 ulangan terlalu sedikit untuk gap sekecil ini", why: "Salah alasan: 1.000 ulangan sudah cukup untuk CI persentil pada n = 6.000 — lebar CI [−0,0498; 0,0110] mencerminkan ukuran sampel dan variabilitas gapnya, bukan kesalahan hitung. Masalahnya bukan hitungannya, melainkan pembacaannya." },
          ],
        },
'''

def renumber_eyebrows(text):
    """Renumber all `eyebrow: "Langkah N ..."` sequentially in file order."""
    n = [0]

    def repl(m):
        n[0] += 1
        return f'eyebrow: "Langkah {n[0]}{m.group(1)}"'

    return re.sub(r'eyebrow: "Langkah \d+([^"]*)"', repl, text), n[0]


def main():
    ts = TS.read_text(encoding="utf-8")

    # 1) ONLY shift: 'langkah 10' (noise-vs-sinyal) -> 'langkah 11'.
    #    'langkah 1/3/4/5' inside workflow-audit are its own sub-list — untouched.
    #    'M6.4, langkah 4' cross-lesson — untouched.
    assert ts.count("langkah 10") >= 1
    ts = re.sub(r"langkah 10\b", "langkah 11", ts)

    # 2) G8 enrichment of measurement-bias: append 2 prose paragraphs.
    anchor_g8 = 'bukan sebagai kebenaran netral.",\n      ],'
    assert ts.count(anchor_g8) == 1, f"anchor G8 prose: {ts.count(anchor_g8)}"
    ts = ts.replace(anchor_g8,
                    'bukan sebagai kebenaran netral.",\n' + G8_P1 + "\n" + G8_P2 + "\n      ],", 1)
    # Insert heatmap figure after formulaNote (post-replacement: 'langkah 11').
    anchor_fig = 'tapi keduanya n kecil, langkah 11).",\n      tasks: [],'
    assert ts.count(anchor_fig) == 1, f"anchor G8 figure: {ts.count(anchor_fig)}"
    ts = ts.replace(anchor_fig,
                    'tapi keduanya n kecil, langkah 11).",\n' + G8_FIGURE + '      tasks: [],', 1)

    # 3) Insert G2 before workflow-audit; G3 AFTER noise-vs-sinyal (before lab1).
    anchor_wf = '    {\n      id: "workflow-audit",'
    assert anchor_wf in ts, "anchor workflow-audit hilang"
    ts = ts.replace(anchor_wf, G2_BLOCK + anchor_wf, 1)
    anchor_lab1 = '    {\n      id: "lab1",'
    assert anchor_lab1 in ts, "anchor lab1 hilang"
    ts = ts.replace(anchor_lab1, G3_BLOCK + anchor_lab1, 1)

    # 4) Insert Lab 3 + Lab 4 before checkpoint.
    anchor_cp = '    {\n      id: "checkpoint",'
    assert anchor_cp in ts, "anchor checkpoint hilang"
    ts = ts.replace(anchor_cp, LAB3_BLOCK + LAB4_BLOCK + anchor_cp, 1)

    # 5) Renumber eyebrows sequentially.
    ts, n_steps = renumber_eyebrows(ts)
    assert n_steps == 17, f"steps M7.2 harus 17, dapat {n_steps}"

    # 6) Peta lesson.
    old_peta = ("measurement bias (fitur dan label yang diukur berbeda) → tabel audit "
                "lengkap empat atribut")
    new_peta = ("measurement bias (fitur dan label yang diukur berbeda + checklist "
                "kualitas data per grup) → tabel audit lengkap empat atribut")
    assert old_peta in ts
    ts = ts.replace(old_peta, new_peta, 1)
    old_peta2 = ("→ aggregation bias (satu angka global menyembunyikan ketimpangan) → "
                 "workflow audit end-to-end → kapan selisih adalah noise dan kapan "
                 "sinyal → 2 lab → checkpoint.")
    new_peta2 = ("→ aggregation bias (satu angka global menyembunyikan ketimpangan) → "
                 "audit irisan: ketika dua atribut bertemu (SEX×EDUCATION, SEX×AGE) → "
                 "workflow audit end-to-end → kapan selisih adalah noise dan kapan "
                 "sinyal → ketidakpastian bootstrap: CI untuk gap fairness → 4 lab → "
                 "checkpoint.")
    assert old_peta2 in ts
    ts = ts.replace(old_peta2, new_peta2, 1)

    # 7) estMinutes 70 -> 90.
    ts = ts.replace("estMinutes: 70,", "estMinutes: 90,", 1)

    # 8) G3 quiz before summary.
    anchor_q = "      ],\n      summary: ["
    assert anchor_q in ts
    ts = ts.replace(anchor_q, G3_QUIZ + anchor_q, 1)

    # 9) Summary bullets: insert 3 before Lab bullet.
    anchor_lab = '        "Lab: AIR Pascasarjana 0,6032; AIR EDUCATION 0,3572;'
    assert anchor_lab in ts
    new_bullets = (
        '        "Audit irisan [notebook]: AIR global SEX 0,8693 menyembunyikan '
        'Laki-laki × SMA 0,2655 (n = 411, selisih −0,6038) dan Laki-laki × 60+ 0,5640 '
        '(n = 36, flag); sel dengan n < 100 dilaporkan, tidak divonis; 18 sel diuji '
        '→ ~1 flag palsu diharapkan secara kebetulan (multiple comparisons).",\n'
        '        "Ketidakpastian bootstrap [notebook, 1.000 ulangan, seed 42]: selisih '
        'approval +3,93 pp CI [1,78; 6,22] (nyata); AIR 0,8693 CI [0,7978; 0,9391] '
        '(nyata); gap TPR [−0,0498; 0,0110] dan PPV [−0,0446; 0,0101] mencakup 0 '
        '(tidak bisa divonis — bukan «tidak ada gap»); gap FPR dan Brier nyata.",\n'
        '        "Kualitas data [notebook, 30.000 baris]: nilai hilang 0 di mana-mana; '
        'EDUCATION kode invalid 0/5/6 = 345 baris (1,15%) dan 73,72% grup Lainnya; '
        'MARRIAGE kode 0 = 54 baris (0,18%, terkonsentrasi di SMA); BILL_AMT negatif '
        '= 1.930 baris (6,43%, plausibel); duplikat di luar ID = 35 baris (0,12%).",\n'
    )
    ts = ts.replace(anchor_lab, new_bullets + anchor_lab, 1)

    # 10) Append to checkpoint Rangkuman prose (unique tail).
    anchor_rangk = "atribusi n-nya yang dikoreksi di lesson ini mengikuti M7.1.\","
    assert ts.count(anchor_rangk) == 1
    ts = ts.replace(
        anchor_rangk,
        "atribusi n-nya yang dikoreksi di lesson ini mengikuti M7.1. Audit irisan "
        "[notebook]: Laki-laki × SMA AIR 0,2655 — angka global 0,8693 menyembunyikan "
        "irisan terparah. Bootstrap [notebook]: «tidak signifikan ≠ tidak ada gap» "
        "(TPR CI mencakup 0). Kualitas data [notebook]: 0 missing; EDUCATION invalid "
        "345 baris mencampur grup Lainnya.\",", 1)

    TS.write_text(ts, encoding="utf-8")
    print(f"M7.2 TS: 13 -> {n_steps} steps, est 90, +1 quiz, +Lab 3/4, +3 summary, G8 enriched")

    # ---- .md mirror ----
    md = MD.read_text(encoding="utf-8")
    # G8: append 2 paragraphs to section 2 (before '## 3. Tabel Audit Lengkap').
    anchor_md3 = "## 3. Tabel Audit Lengkap"
    assert anchor_md3 in md
    g8_md = """**Checklist kualitas data per grup [notebook, data penuh 30.000 baris]:** (1) Nilai hilang: 0 di mana-mana — 0 NaN di semua 19 fitur utama, overall maupun per SEX/EDUCATION. (2) Kategori invalid: EDUCATION kode 0/5/6 = 345 baris (1,15%) — dan 73,72% dari grup «Lainnya» EDUCATION adalah kode-kode ini; MARRIAGE kode 0 = 54 baris (0,18%), terkonsentrasi di SMA (44 dari 54). (3) Pelanggaran range: BILL_AMT negatif = 1.930 baris (6,43%) — plausibel sebagai kredit/kelebihan bayar, bukan error; PAY_AMT negatif = 0; LIMIT_BAL ≤ 0 = 0; AGE di luar 21–79 = 0. (4) Duplikat: 0 baris penuh termasuk ID; 35 baris (0,12%) duplikat di luar ID.

**Baik/buruk:** checklist ini bagus karena ia membedakan «data kotor» dari «data yang tampak kotor»: BILL_AMT negatif tampak seperti error tapi plausibel. Buruk bila dibaca sebagai «0 missing berarti data bersih»: 345 baris kode invalid tidak muncul sebagai missing — ia muncul sebagai grup «Lainnya» yang tampak sah. **Mitigasi:** jalankan checklist ini per grup sebelum audit apa pun. Fitur yang perlu investigasi: EDUCATION dan MARRIAGE.

---

"""
    md = md.replace(anchor_md3, g8_md + anchor_md3, 1)
    # G2 section before Workflow Audit.
    anchor_md_wf = "## 8. Workflow Audit End-to-End"
    assert anchor_md_wf in md
    g2_md = """## 9. Audit Irisan: Ketika Dua Atribut Bertemu, Ketimpangan Bisa Jauh Lebih Parah

Stratifikasi memotong data SATU atribut pada satu waktu. Audit irisan memotong DUA atribut sekaligus: SEX × EDUCATION, SEX × AGE. AIR SEX global 0,8693 dan AIR EDUCATION SMA 0,3572 masing-masing sudah flag — tapi tidak satu pun memberitahumu bahwa laki-laki SMA approval-nya hanya 16,30%.

**SEX × EDUCATION [notebook, test 6.000]:** Laki-laki × Pascasarjana AIR 0,5537 (n = 900); × Universitas 0,3697 (n = 1.066); × SMA 0,2655 (n = 411, base rate 0,2701, FPR 0,7933, Wilson [0,1305; 0,2018]) — sel TERPARAH, n cukup besar untuk divonis; × Lainnya 0,8469 (n = 25, JANGAN VONIS). Perempuan × Pascasarjana 0,5906 (n = 1.230); × Universitas 0,4349 (n = 1.708); × SMA 0,3917 (n = 603); × Lainnya 1,0000 (n = 57, terlalu kecil untuk vonis — TPR 0,0 karena hanya 2 defaulter).

**SEX × AGE [notebook]:** Laki-laki × 30–39 AIR 0,9051 (n = 907) — satu-satunya sel laki-laki yang mendekati adil; × 60+ 0,5640 (n = 36, flag); Perempuan × 30–39 1,0000 (n = 1.291). AIR global SEX 0,8693 MENYEMBUNYIKAN irisan yang jauh lebih parah — selisih −0,6038 (EDUCATION) dan −0,3053 (AGE).

**Baik/buruk:** audit irisan bagus karena menemukan ketimpangan yang tidak terlihat dari marginal mana pun. Buruk bila dibaca sebagai «semakin banyak irisan semakin baik»: tiap irisan membelah n menjadi potongan yang makin kecil — 18 sel, 4 di antaranya n < 100. **Mitigasi:** tambahkan audit irisan ke workflow sebagai langkah 3b. Peringatan multiple comparisons: 18 sel pada ambang 5% berarti ~1 flag palsu diharapkan secara kebetulan — flag yang berdiri sendiri diselidiki; flag yang membentuk POLA ditindaklanjuti.

---

"""
    md = md.replace(anchor_md_wf, g2_md + anchor_md_wf, 1)
    # G3 section before Noise vs Sinyal.
    anchor_md_noise = "## 9. Noise vs Sinyal"
    assert anchor_md_noise in md
    g3_md = """## 11. Ketidakpastian Bootstrap: «Tidak Signifikan» Bukan Berarti «Tidak Ada Gap»

Bootstrap: ulangi pengukuran 1.000 kali pada sampel ulang dari test 6.000 yang sama, dan lihat seberapa lebar sebaran hasilmu. CI 95% bukan «jawaban yang benar» — ia RENTANG nilai yang masih cocok dengan datamu.

**Nilai [notebook, 1.000 ulangan, seed 42; semua gap F−M]:** selisih approval +3,93 pp, CI [1,78; 6,22] (nyata); AIR SEX 0,8693, CI [0,7978; 0,9391] (nyata — tidak mencakup 1); gap TPR −0,0191, CI [−0,0498; 0,0110] (mencakup 0 — tidak bisa divonis); gap FPR −0,0383, CI [−0,0653; −0,0123] (nyata); gap ECE +0,0012, CI [−0,0155; 0,0118] (mencakup 0); gap Brier −0,0143, CI [−0,0257; −0,0036] (nyata); gap PPV −0,0168, CI [−0,0446; 0,0101] (mencakup 0). Empat dari tujuh gap nyata; tiga tidak bisa divonis — dan ketiganya tetap DILAPORKAN dengan CI-nya.

**Baik/buruk:** bootstrap CI bagus karena mengubah «sinyal vs noise» dari vonis biner menjadi RENTANG. Buruk bila dibaca sebagai «CI mencakup 0 berarti tidak ada gap»: CI TPR mencakup 0 DAN mencakup −0,0498. **Mitigasi:** laporkan SETIAP gap dengan CI-nya — titik + interval, bukan titik saja. Satu kalimat yang wajib dihafal: «tidak signifikan ≠ tidak ada gap».

---

"""
    md = md.replace(anchor_md_noise, g3_md + anchor_md_noise, 1)
    # Lab 3 + Lab 4 before Rangkuman.
    anchor_md_rangk = "## 12. Rangkuman"
    assert anchor_md_rangk in md
    labs_md = """## 13. Lab 3: Audit Irisan — group_key dan Gap yang Disembunyikan Angka Global

Approval rate SEX × EDUCATION [notebook]: tertinggi Perempuan × Lainnya 0,6140 (n = 57). Laki-laki × SMA: 0,1630 (n = 411). AIR global SEX: 0,8693. Hitung AIR Laki-laki × SMA (0,1630 / 0,6140 = 0,2655), gap yang disembunyikan angka global (0,8693 − 0,2655 = 0,6038), dan sel kecil (n < 100) di antara Laki-laki × Lainnya (25), Perempuan × Lainnya (57), Laki-laki × 60+ (36), Perempuan × 60+ (40) — semuanya, 4 sel.

---

## 14. Lab 4 (ringkas): Checklist Kualitas Data — Tandai Fitur yang Perlu Investigasi

Kode invalid EDUCATION (0/5/6): 345 dari 30.000 baris = 1,15%. BILL_AMT negatif: 1.930 dari 30.000 = 6,43%. Fitur yang perlu investigasi: EDUCATION — kode invalid-nya mencampur grup «Lainnya» (73,72% dari grup itu).

---

"""
    md = md.replace(anchor_md_rangk, labs_md + anchor_md_rangk, 1)
    # Renumber "## N." headings sequentially.
    nums = [0]

    def renum_md(m):
        nums[0] += 1
        return f"## {nums[0]}. {m.group(2)}"

    md = re.sub(r"^## (\d+)\. (.*)$", renum_md, md, flags=re.M)
    # Rangkuman bullets.
    anchor_rangk_md = "- Lab: AIR Pascasarjana 0,6032; AIR EDUCATION 0,3572;"
    assert anchor_rangk_md in md
    md = md.replace(
        anchor_rangk_md,
        "- Audit irisan [notebook]: AIR global SEX 0,8693 menyembunyikan Laki-laki × SMA 0,2655 (selisih −0,6038); sel n < 100 dilaporkan, tidak divonis; 18 sel → ~1 flag palsu diharapkan (multiple comparisons).\n"
        "- Ketidakpastian bootstrap [notebook, 1.000 ulangan]: approval +3,93 pp CI [1,78; 6,22] (nyata); AIR 0,8693 CI [0,7978; 0,9391] (nyata); TPR/PPV/ECE mencakup 0 — «tidak signifikan ≠ tidak ada gap».\n"
        "- Kualitas data [notebook, 30.000 baris]: nilai hilang 0; EDUCATION invalid 345 baris (1,15%), 73,72% grup Lainnya; MARRIAGE kode 0 54 baris (0,18%, di SMA); BILL_AMT negatif 1.930 (6,43%, plausibel); duplikat di luar ID 35 (0,12%).\n"
        + anchor_rangk_md, 1)
    MD.write_text(md, encoding="utf-8")
    print(f"M7.2 MD: sections renumbered to {nums[0]}")


if __name__ == "__main__":
    main()
