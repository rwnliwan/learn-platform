#!/usr/bin/env python3
"""Fill gap Luna M8 — M8.1 (G1 + G2 + G3).

G1 (must): langkah baru "Langkah 5a" kuantifikasi ketidakpastian (bootstrap CI
[turunan] dari m8_bootstrap_ci) + figure interval + 1 kuis.
G2 (must): langkah baru "Langkah 4a" desain validasi (anti-leakage, split
temporal/grup, reuse test) + rujukan M6.2.
G3 (should): langkah baru "Langkah 10a" issue register + Lab 3.
Plus: peta lesson, estMinutes 70 -> 90, checkpoint + summary, mirror .md.

Pola: seperti fix_m8_review.py — setiap pasangan (old, new, expect) WAJIB
cocok tepat expect kali, bila tidak file TIDAK ditulis.
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
M81_MD = "content/mlf-m81-model-validation-framework.md"

G2_STEP = """    {
      id: "validation-design",
      eyebrow: "Langkah 4a · Sebelum outcomes analysis",
      title: "Desain validasi: cegah leakage, pilih split yang jujur, jangan pakai ulang test",
      prose: [
        "Outcomes analysis (langkah 5) menguji ulang hasil pada belahan data — tapi hasil uji itu hanya sejujur DESAIN validasinya. Desain validasi adalah keputusan yang diambil SEBELUM satu metrik pun dihitung: fitur apa yang boleh dipakai, data dibagi bagaimana, dan berapa kali test boleh dipakai ulang. Tiga keputusan desain, masing-masing dengan satu pertanyaan yang wajib dijawab tertulis.",
        "Satu — KETERSEDIAAN FITUR (feature availability): «fitur ini tersedia KAPAN?» Setiap fitur harus sudah ada pada saat keputusan diambil. Delapan fitur turunan flagship (PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION, PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND [notebook]) semuanya dihitung dari riwayat pembayaran dan tagihan BULAN LALU — tersedia saat pengajuan diputuskan, jadi lolos cek ini. Yang GAGAL cek ini adalah fitur yang baru ada SETELAH keputusan: misalnya memakai «pembayaran bulan depan» untuk memutuskan bulan ini, atau memakai label default itu sendiri sebagai fitur. Fitur seperti itu membuat ROC-AUC terlihat bagus — dan membuat model tidak berguna di live, karena fitur itu tidak ada saat keputusan harus diambil. Ceklisnya: untuk tiap fitur, tulis TANGGAL ketersediaannya; bila tanggal itu setelah tanggal keputusan, fitur itu bocor (leakage) dan harus dibuang — berapa pun ROC-AUC yang ia sumbangkan. Anti-leakage di level pipeline (membangun fitur HANYA dari data train, di dalam Pipeline) sudah diajarkan di M6.2 — di sini yang baru adalah cek KETERSEDIAAN WAKTU-nya: pipeline yang benar pun bisa bocor bila fiturnya sendiri datang dari masa depan.",
        "Dua — PEMBAGIAN DATA (split): belahan acak (random split) menjawab «apakah model bekerja pada nasabah yang mirip dengan yang dilatih?» — dan hanya itu. Ia TIDAK menjawab dua pertanyaan yang lebih keras: «apakah model bekerja pada populasi MASA DEPAN?» (temporal split: latih pada periode lama, uji pada periode baru) dan «apakah model bekerja pada populasi yang BERBEDA?» (group/entity split: latih pada satu grup, uji pada grup lain — mis. latih tanpa AGE 60+, uji pada AGE 60+). Dataset UCI ini SATU snapshot tanpa tanggal (langkah 4) — split temporal TIDAK MUNGKIN dilakukan di sini, dan itu batasan yang harus ditulis, bukan disembunyikan: semua klaim validasi lesson ini adalah klaim tentang snapshot ini, dan kompensasinya adalah monitoring (langkah 6) + revalidasi. Split berdasarkan WAKTU untuk deret waktu sudah diajarkan di M6.2 (walk-forward pada BBCA) — pakai pola yang sama bila datamu punya tanggal: jangan pernah menguji masa depan dengan masa lalu yang diacak. Dan validation halves (langkah 5) adalah split ACAK — ia mengukur noise, bukan generalisasi ke populasi baru; jangan klaim halves membuktikan model tahan terhadap pergeseran populasi.",
        "Tiga — PAKAI ULANG TEST (test reuse): test 6.000 kita sudah dipakai BERKALI-KALI: memilih threshold (M6.4), membandingkan model (M6.5), memvalidasi (langkah 5), dan nanti memilih challenger (M8.4). Setiap kali test dipakai untuk MEMILIH — threshold, model, challenger — sebagian kejujurannya terkikis: yang dipilih adalah yang kebetulan bagus di test itu. Aturannya: test final dipakai SATU KALI untuk vonis akhir; sesudah itu ia REFERENSI, bukan test yang segar. Bila challenger baru datang sesudah vonis ini, ia TIDAK BOLEH dipilih berdasarkan test 6.000 yang sama tanpa catatan — bandingkan ia pada validation split yang segar, atau pada nested CV [M6.2], dan laporkan bahwa test 6.000 sudah dipakai memilih sebelumnya. Validator yang menemukan test dipakai memilih tiga kali tanpa catatan menulisnya sebagai TEMUAN — bukan sebagai hal yang biasa.",
        "Nilai: desain validasi bagus karena ia membuat batas bukti menjadi EKSPLISIT sebelum angka dibaca: «bukti ini berlaku untuk populasi snapshot, fitur yang tersedia saat keputusan, dan satu kali pemakaian test». Tanpa desain yang ditulis, outcomes analysis bisa menghasilkan angka yang benar untuk pertanyaan yang salah — dan tidak ada yang tahu pertanyaan mana yang dijawab.",
        "Baik atau buruk: desain yang bagus ditulis SEBELUM validasi berjalan — seperti ambang traffic-light yang ditulis sebelum melihat verdict (langkah 8). Buruk bila desain ditulis sesudah melihat hasil: split yang dipilih karena angkanya bagus adalah split yang dipilih karena kebetulan. Buruk juga bila satu jenis split dipakai untuk semua pertanyaan: random split untuk pertanyaan temporal adalah jawaban yang salah dengan angka yang benar.",
        "Mitigasi: di halaman pertama laporan validasi, tulis tiga baris desain — (1) cek ketersediaan fitur: semua fitur tersedia saat keputusan? (2) split apa yang dipakai, dan pertanyaan apa yang TIDAK bisa dijawab split itu? (3) berapa kali test ini sudah dipakai memilih, dan apa konsekuensinya? Bila satu baris tidak bisa dijawab, validasi belum siap dinilai.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: leakage tidak terlihat di ROC-AUC",
        type: "pitfall",
        body: "Yang benar: fitur bocor justru membuat ROC-AUC NAIK — leakage adalah cara termurah untuk mendapat skor test yang bagus. Satu-satunya yang menangkapnya adalah cek ketersediaan waktu: «kapan fitur ini ada?». Bila jawabannya «setelah keputusan», buang fitur itu — berapa pun ROC-AUC yang ia sumbangkan. Model yang ranking-nya bagus karena leakage adalah model yang tidak bisa dipakai, bukan model yang hebat.",
      },
    },
    {
      id: "outcomes-analysis","""

G1_STEP = """    {
      id: "uncertainty-ci",
      eyebrow: "Langkah 5a · Setelah outcomes analysis",
      title: "Kuantifikasi ketidakpastian: tiap angka punya pita — dan pita itu bisa membalik verdict",
      prose: [
        "Langkah 5 memberimu angka: bad rate 6,67%, selisih antar-half +1,06 poin persen, ECE 0,0087. Tapi setiap angka itu adalah SATU pengukuran dari satu sampel — dan validator yang baik tidak pernah membaca angka tanpa menanyakan «seberapa lebar pitanya?». Alatnya: BOOTSTRAP — ambil test 6.000, acak-ulang barisnya dengan pengembalian (resampling) 2.000 kali, hitung metrik di tiap ulangan, dan baca persentil 2,5%–97,5% sebagai interval kepercayaan (CI) 95%. Modelnya TETAP (GBM terkalibrasi yang sama, tidak dilatih ulang) — yang diukur adalah ketidakpastian SAMPLING test, bukan ketidakpastian latih. Bedanya dengan CI naif M6.2: di M6.2 interval dihitung dari SE (sd antar-fold / √5) untuk skor nested CV — rumus yang hanya berlaku bila kamu punya simpangan baku antar-fold; di sini bad rate, ECE, dan profit tidak punya rumus SE yang sederhana, jadi intervalnya dibangun dengan bootstrap. Idenya sama — «angka ± pita» — konstruksinya berbeda. Semua interval di langkah ini [turunan] dari m8_bootstrap_ci: bootstrap B=2.000, seed 42, atas test yang sama.",
        "Nilai [turunan] — model keputusan GBM terkalibrasi, threshold 0,10, test 6.000. Bad rate yang disetujui 6,67% — CI95 [5,47%; 7,85%]: pita selebar 2,38 poin persen. Approval rate 28,5% — CI95 [27,33%; 29,65%]: pita selebar 2,32 poin persen. ECE overall 0,0087 — CI95 [0,0077; 0,0214]: perhatikan, batas ATAS-nya 0,0214 MELEWATI ambang lolos 0,02 — kalibrasi overall kemungkinan besar baik, tapi bukti tidak cukup kuat untuk mengklaimnya dengan pasti pada 95%. Profit terealisasi +NT$8.214.000 — CI95 [NT$5.575.975; NT$10.802.787]: pita selebar NT$5.226.812 — laba «8,2 juta» itu sebenarnya «antara 5,6 dan 10,8 juta». Selisih antar-half: bad rate +1,06 poin persen — CI95 [−1,26; +3,35] poin persen; ROC-AUC −0,0139 — CI95 [−0,0428; +0,0132]; ECE −0,0010 — CI95 [−0,0142; +0,0118].",
        "Bacalah CI selisih bad rate itu seperti validator — karena di sanalah pelajarannya. Titiknya +1,06 poin persen, yang memicu KUNING (langkah 8). Tapi CI-nya [−1,26; +3,35] MELEWATI NOL — sekitar 19,7% ulangan bootstrap memberi selisih ≤ 0 — artinya pada 95% keyakinan, selisih itu TIDAK TERBUKTI berbeda dari nol. CI yang sama juga MELEWATI ambang HIJAU 1,0 poin persen dan MENDEKATI ambang MERAH 3,0 poin persen: satu interval yang mencakup «tidak ada selisih», «KUNING», dan «hampir MERAH» sekaligus. Itulah yang dimaksud «verdict yang tidak konklusif»: angka titiknya berkata KUNING, pitanya berkata «bisa jadi apa saja». Aturan lesson ini — dan ini aturan yang ditulis dulu, bukan dinegosiasikan sesudah melihat CI: verdict traffic-light tetap mengikuti ESTIMASI TITIK (1,06 > 1,0 → KUNING, langkah 8) — CI tidak mengubah band dan tidak membatalkan verdict. Yang diubah CI adalah TINDAK LANJUTNYA: verdict KUNING yang CI-nya melintasi ambang DITANDAI «tidak konklusif — investigate» — validator menulis CI itu di laporan, memprioritaskan pengumpulan sampel lebih besar untuk bad rate, dan revalidasi tidak boleh ditunda. Sebaliknya, HIJAU yang CI-nya melintasi ambang KUNING adalah «HIJAU dengan peringatan» — deploy boleh jalan, tapi metrik itu masuk daftar pantau pertama. Dan MERAH yang CI-nya melintasi nol tetap MERAH — ketidakpastian tidak menyelamatkan model yang titiknya sudah melewati ambang tolak; ia hanya menjelaskan seberapa yakin kamu pada vonis itu.",
        "Dua CI per grup yang menunjukkan kenapa gate ukuran sampel (langkah 8) ada. ECE AGE 60+ 0,1208 (n=76) — CI95 [0,0839; 0,2225]: SELURUH interval di atas ambang MERAH 0,05 — mis-kalibrasi grup ini kemungkinan besar NYATA, bukan sekadar noise titik. Tetapi statusnya TETAP temuan-investigasi, bukan pemicu band: ECE dari 76 baris dalam 10 bin bisa terdistorsi komposisi bin (beberapa bin hanya berisi 1–2 nasabah), dan aturan lesson (gate n ≥ 200) adalah kebijakan yang ditulis dulu — CI memperkuat URGENSI penyelidikan (kumpulkan sampel lebih besar untuk grup ini SEBELUM revalidasi, jadikan prioritas pertama di daftar KUNING), ia tidak mengubah status temuan. Bandingkan dengan ECE Pascasarjana 0,0210 (n=2.130) — CI95 [0,0159; 0,0387]: intervalnya MELEWATI 0,02 — status KUNING grup itu pun tidak konklusif: ia bisa jadi HIJAU (0,0159) atau KUNING (0,0387) — dan validator yang jujur menulis keduanya, bukan hanya titiknya.",
        "Baik atau buruk: CI bagus karena ia mengubah «1,06 poin persen» dari vonis menjadi PERTANYAAN — «1,06 dengan pita berapa?» — dan pertanyaan itu punya jawaban yang bisa diaudit. Buruk bila CI dibaca sebagai «jadi angkanya tidak bisa dipercaya»: CI yang lebar bukan bukti angkanya salah — ia bukti SAMPELNYA kecil untuk pertanyaan itu. Dan buruk bila CI dipakai untuk menggeser ambang («CI-nya mencakup 0, jadi kita anggap HIJAU»): ambang ditulis dulu dari pertimbangan bisnis (langkah 8); CI memberitahu seberapa yakin kamu pada verdict itu, bukan verdict apa yang kamu inginkan.",
        "Mitigasi: setiap metrik yang masuk verdict tuliskan BERSAMA CI95-nya: «bad rate 6,67% [5,47%; 7,85%]», «selisih antar-half +1,06 pp [−1,26; +3,35]». Bila CI melintasi ambang, tulis satu baris tambahan di laporan: «tidak konklusif — investigate» beserta tindak lanjutnya (sampel lebih besar / pantau / revalidasi dipercepat). Verdict tanpa CI adalah verdict yang berpura-pura pasti.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Interval kepercayaan 95 persen bootstrap: bad rate test 6,67 persen dengan CI 5,47 sampai 7,85 persen; selisih bad rate antar-half plus 1,06 poin persen dengan CI minus 1,26 sampai plus 3,35 poin persen, melintasi nol dan ambang HIJAU 1,0">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">CI95 bootstrap (B=2.000) — titik vs pita [turunan]</text>
<text x="125.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Bad rate test (GBM terkalibrasi)</text>
<line x1="30" y1="40" x2="30" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="30" y1="206" x2="220" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="24" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">9%</text>
<text x="24" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6,5%</text>
<text x="24" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4%</text>
<line x1="86" y1="90" x2="86" y2="150" stroke="var(--c1)" stroke-width="3"/>
<line x1="176" y1="90" x2="176" y2="150" stroke="var(--c1)" stroke-width="3"/>
<line x1="86" y1="120" x2="176" y2="120" stroke="var(--c1)" stroke-width="3"/>
<circle cx="131" cy="120" r="5" fill="var(--c2)"/>
<text x="131" y="104" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">6,67%</text>
<text x="86" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5,47%</text>
<text x="176" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">7,85%</text>
<text x="125" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">CI95 selebar 2,38 pp</text>
<text x="355.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Selisih bad rate B−A (pp)</text>
<line x1="260" y1="40" x2="260" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="260" y1="206" x2="450" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="254" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+4</text>
<text x="254" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="254" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−2</text>
<line x1="323" y1="40" x2="323" y2="206" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="355" y1="40" x2="355" y2="206" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="418" y1="40" x2="418" y2="206" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="323" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="355" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">1,0 HIJAU</text>
<text x="418" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">3,0 MERAH</text>
<line x1="283" y1="90" x2="283" y2="150" stroke="var(--c1)" stroke-width="3"/>
<line x1="429" y1="90" x2="429" y2="150" stroke="var(--c1)" stroke-width="3"/>
<line x1="283" y1="120" x2="429" y2="120" stroke="var(--c1)" stroke-width="3"/>
<circle cx="357" cy="120" r="5" fill="var(--c2)"/>
<text x="357" y="104" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+1,06</text>
<text x="283" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−1,26</text>
<text x="429" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+3,35</text>
<text x="355" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">CI melintasi 0 dan 1,0 — tidak konklusif</text>
</svg>`,
        alt: "Interval kepercayaan 95 persen bootstrap: bad rate test 6,67 persen dengan CI 5,47 sampai 7,85 persen; selisih bad rate antar-half plus 1,06 poin persen dengan CI minus 1,26 sampai plus 3,35 poin persen, melintasi nol dan ambang HIJAU 1,0.",
        caption: "Cara membaca: panel kiri = bad rate test 6,67% dengan CI95 [5,47%; 7,85%] — pita selebar 2,38 poin persen. Panel kanan = selisih bad rate antar-half +1,06 pp dengan CI95 [−1,26; +3,35] — intervalnya melintasi nol (garis putus-putus), ambang HIJAU 1,0, dan mendekati ambang MERAH 3,0: satu interval yang mencakup «tidak ada selisih», «KUNING», dan «hampir MERAH» sekaligus. Verdict titiknya tetap KUNING — tapi ditandai «tidak konklusif — investigate». Angka [turunan] dari m8_bootstrap_ci (bootstrap B=2.000, seed 42).",
      },
      tasks: [],
    },
    {
      id: "ongoing-monitoring","""

G3_STEP = """    {
      id: "issue-register",
      eyebrow: "Langkah 10a · Setelah mini-case",
      title: "Issue register: temuan validasi menjadi tindakan — dengan pemilik dan tanggal",
      prose: [
        "Verdict KUNING di mini-case datang dengan tiga syarat — tapi syarat yang tidak punya pemilik, tanggal, dan bukti penutupan bukanlah syarat: ia catatan yang menunggu dilupakan. ISSUE REGISTER adalah daftar yang mengubah temuan validasi menjadi tindakan yang bisa diaudit: satu baris per temuan, sepuluh kolom — finding_id, severity, evidence (angka + sumber), root_cause, action, owner, due_date, acceptance_test, status, closure_approver. Tanpa satu kolom pun dari sepuluh ini, baris itu belum bisa dikerjakan: tanpa owner tidak ada yang bertanggung jawab; tanpa due_date tidak ada yang terlambat; tanpa acceptance_test tidak ada yang tahu kapan ia selesai; tanpa closure_approver yang menutup adalah orang yang sama dengan yang mengerjakan.",
        "Tiga temuan KUNING lesson ini, ditulis sebagai register. F-01 — severity MEDIUM: selisih bad rate antar-half +1,06 poin persen [m8_canonical.json], CI95 [−1,26; +3,35] [turunan] — tidak konklusif (langkah 5a). Root cause: belum diketahui — bisa noise sampling, bisa pergeseran kecil distribusi skor di sekitar threshold 0,10. Action: pantau bad rate yang disetujui per periode + kumpulkan sampel lebih besar untuk bad rate (langkah 5a). Acceptance test: selisih antar-half periode berikutnya di dalam 1,0 poin persen ATAU CI-nya tidak lagi melintasi nol. F-02 — severity MEDIUM: ECE per grup yang masuk band KUNING — Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), AGE 50–59 0,0312 (n=473) [M7.1]. Action: selidiki bin kalibrasi ketiga grup + periksa apakah threshold per grup (M7.4) relevan. Acceptance test: ECE ketiga grup di bawah 0,02 pada revalidasi. F-03 — severity INVESTIGATE: ECE AGE 60+ 0,1208 (n=76) [M7.1], CI95 [0,0839; 0,2225] [turunan] — seluruh interval di atas 0,05, tapi n di bawah gate 200. Action: kumpulkan sampel lebih besar untuk grup ini SEBELUM revalidasi + periksa bin kalibrasinya. Acceptance test: ECE grup ini dihitung ulang pada n ≥ 200 — berapa pun hasilnya, ia baru bisa dinilai. Pemilik dan tanggal tiap temuan [ilustrasi] — diisi komite saat verdict ditandatangani (M8.5), bukan oleh validator sendirian.",
        "Aturan penutupan (closure) — dan ini yang membedakan register dari daftar keinginan: temuan dinyatakan CLOSED hanya bila acceptance_test LULUS dan closure_approver (bukan owner yang mengerjakan) menandatangani. «Action sudah dilakukan» bukan penutupan — action yang dilakukan tanpa acceptance test yang lulus adalah pekerjaan yang belum terbukti. Dan satu aturan yang mengikat verdict: persetujuan KUNING tetap berlaku selama temuannya TERBUKA selama due_date belum lewat; temuan yang MELEWATI due_date tanpa perpanjangan tertulis dari komite adalah pemicu revalidasi (M8.5, langkah 7) — approval-nya dibekukan sampai temuan itu ditutup atau diperpanjang. Itulah yang membuat KUNING berbeda dari «lolos dengan catatan yang dilupakan»: catatannya punya tanggal, dan tanggal itu punya konsekuensi.",
        "Nilai: issue register bagus karena ia adalah JEMBATAN antara verdict dan revalidasi — validator di revalidasi 3 bulan tidak perlu menebak apa yang dijanjikan: ia membuka register, memeriksa tiga baris, dan bertanya «yang ini sudah ditutup? buktinya mana?». Tanpa register, revalidasi memulai dari nol — dan temuan lama yang tidak ditindaklanjuti tidak pernah ketahuan.",
        "Baik atau buruk: register bagus bila sepuluh kolomnya terisi SEMUA — baris dengan kolom kosong adalah baris yang belum bisa dikerjakan. Buruk bila severity ditulis dari perasaan («kayaknya medium») — severity ditulis dari ANGKA: berapa jauh dari ambang, dan berapa besar uang yang dipertaruhkan. Buruk juga bila closure_approver adalah owner sendiri — itu seperti siswa yang menilai ujiannya sendiri.",
        "Mitigasi: jadikan register ini LAMPIRAN WAJIB laporan validasi — verdict KUNING tanpa register adalah verdict yang belum selesai ditulis. Dan di revalidasi, baris pertama yang diperiksa adalah register lama: temuan yang masih terbuka dari validasi sebelumnya adalah temuan pertama di laporan baru.",
      ],
      tasks: [],
    },
    {
      id: "lab1","""

LAB3_STEP = """    {
      id: "lab3",
      eyebrow: "Langkah 12a · Lab 3",
      title: "Lab: issue register — temuan KUNING menjadi baris yang bisa ditutup",
      prose: [
        "Lab ketiga membangun issue register untuk tiga temuan KUNING lesson ini (langkah 10a) dan menerapkan aturan penutupannya dengan mesin. Tiga temuan — F-01 selisih bad rate antar-half +1,06 poin persen (CI95 [−1,26; +3,35] [turunan]); F-02 ECE tiga grup yang masuk band KUNING (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312 [M7.1]); F-03 ECE AGE 60+ 0,1208 (n=76, CI95 [0,0839; 0,2225] [turunan]) — masing-masing dengan sepuluh kolom: finding_id, severity, evidence, root_cause, action, owner, due_date, acceptance_test, status, closure_approver. Tanggal memakai «hari ini» [ilustrasi] 2026-11-13: F-01 jatuh tempo 30 hari lagi (2026-12-13), F-02 jatuh tempo 60 hari lagi (2027-01-12), F-03 jatuh tempo 90 hari lagi (2027-02-11) — semuanya di masa depan, jadi tidak ada yang overdue pada tanggal ini.",
        "Hasil yang diharapkan [lab]: fields_per_finding=10; missing_fields=[]; n_open=3; n_overdue=0; approval_valid=True. Lalu skenario kedua — pindahkan due_date F-01 ke 2026-11-01 (sudah lewat) TANPA perpanjangan tertulis: n_overdue menjadi 1 dan approval_valid menjadi False — persetujuan KUNING dibekukan sampai temuan itu ditutup atau diperpanjang komite. Itulah aturan yang diajarkan langkah 10a: due_date punya konsekuensi, dan konsekuensinya bisa dihitung.",
        "Setelah lab jalan, tanyakan pada dirimu: temuan mana yang paling berbahaya bila due_date-nya dilewati tanpa kabar? F-03 — karena ECE-nya paling besar (0,1208) dan CI-nya seluruhnya di atas 0,05: temuan yang buktinya paling kuat adalah temuan yang paling berbahaya bila dilupakan. Register tidak menilai «temuan mana yang paling menakutkan» — ia menilai «temuan mana yang paling lama terbuka».",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fields_per_finding dan missing_fields: tiap temuan harus punya 10 kolom" },
        { id: "t2", text: "Lengkapi n_open dan n_overdue dari status dan due_date vs TODAY [ilustrasi]" },
        { id: "t3", text: "Lengkapi approval_valid, lalu skenario overdue: pindahkan due_date F-01 ke masa lalu dan hitung ulang" },
      ],
      expected: "fields_per_finding=10\\nmissing=[]\\nall_required=True\\nn_open=3\\nn_overdue=0\\napproval_valid=True\\nn_overdue_scenario=1\\napproval_valid_scenario=False",
      hints: [
        "Sepuluh kolom register (langkah 10a): finding_id, severity, evidence, root_cause, action, owner, due_date, acceptance_test, status, closure_approver — hitung len() tiap dict temuan.",
        "n_open = temuan dengan status 'open' (ketiganya open); n_overdue = temuan open yang due_date-nya < TODAY (2026-11-13) — ketiganya jatuh tempo sesudah hari ini, jadi 0.",
        "approval_valid = n_overdue == 0 (dan semua temuan punya owner + due_date + acceptance_test). Skenario: ubah due_date F-01 menjadi '2026-11-01' — n_overdue_scenario = 1, approval_valid_scenario = False.",
      ],
      code: {
        starter: `# Lab 3 — issue register: tiga temuan KUNING lesson ini (langkah 10a)
# Tanggal "hari ini" [ilustrasi] 2026-11-13 — due_date ditulis sebagai string ISO
# Aturan penutupan: temuan CLOSED hanya bila acceptance_test lulus DAN
# closure_approver menandatangani; approval KUNING berlaku selama tidak ada
# temuan yang overdue tanpa perpanjangan tertulis dari komite.
TODAY = "2026-11-13"
COLUMNS = ["finding_id", "severity", "evidence", "root_cause", "action",
           "owner", "due_date", "acceptance_test", "status", "closure_approver"]

findings = [
    {"finding_id": "F-01", "severity": "MEDIUM",
     "evidence": "selisih bad rate antar-half +1,06 pp, CI95 [-1,26; +3,35] [turunan]",
     "root_cause": "belum diketahui — noise sampling atau pergeseran distribusi skor di sekitar 0,10",
     "action": "pantau bad rate per periode + kumpulkan sampel lebih besar",
     "owner": "[ilustrasi] Risk Analyst", "due_date": "2026-12-13",
     "acceptance_test": "selisih antar-half periode berikut <= 1,0 pp ATAU CI tidak lagi melintasi 0",
     "status": "open", "closure_approver": "[ilustrasi] Validator Independen"},
    {"finding_id": "F-02", "severity": "MEDIUM",
     "evidence": "ECE Pascasarjana 0,0210; SMA 0,0362; AGE 50-59 0,0312 [M7.1]",
     "root_cause": "kalibrasi per grup di atas 0,02 pada tiga grup n >= 200",
     "action": "selidiki bin kalibrasi ketiga grup + periksa relevansi threshold per grup [M7.4]",
     "owner": "[ilustrasi] Model Owner", "due_date": "2027-01-12",
     "acceptance_test": "ECE ketiga grup < 0,02 pada revalidasi",
     "status": "open", "closure_approver": "[ilustrasi] Validator Independen"},
    {"finding_id": "F-03", "severity": "INVESTIGATE",
     "evidence": "ECE AGE 60+ 0,1208 (n=76), CI95 [0,0839; 0,2225] [turunan]",
     "root_cause": "kalibrasi grup kecil rusak — penyebab belum diketahui",
     "action": "kumpulkan sampel lebih besar untuk AGE 60+ SEBELUM revalidasi + periksa bin kalibrasi",
     "owner": "[ilustrasi] Validator Independen", "due_date": "2027-02-11",
     "acceptance_test": "ECE grup ini dihitung ulang pada n >= 200",
     "status": "open", "closure_approver": "[ilustrasi] Ketua Komite Risiko"},
]

fields_per_finding = 0  # TODO: len() tiap dict temuan — harus 10
missing_fields = []  # TODO: kolom COLUMNS yang hilang dari satu temuan pun (daftar kosong bila lengkap)
all_required = False  # TODO: True bila missing_fields kosong
n_open = 0  # TODO: temuan dengan status "open"
n_overdue = 0  # TODO: temuan open yang due_date-nya < TODAY (bandingkan string ISO — urutan leksikal = urutan tanggal)
approval_valid = False  # TODO: True bila n_overdue == 0 DAN semua temuan punya owner + due_date + acceptance_test
# Skenario: F-01 lewat due_date tanpa perpanjangan tertulis
scenario = [dict(f) for f in findings]
scenario[0]["due_date"] = "2026-11-01"
n_overdue_scenario = 0  # TODO: temuan open yang due_date-nya < TODAY pada skenario
approval_valid_scenario = True  # TODO: False bila n_overdue_scenario > 0
print(f"fields_per_finding={fields_per_finding}")
print(f"missing={missing_fields}")
print(f"all_required={all_required}")
print(f"n_open={n_open}")
print(f"n_overdue={n_overdue}")
print(f"approval_valid={approval_valid}")
print(f"n_overdue_scenario={n_overdue_scenario}")
print(f"approval_valid_scenario={approval_valid_scenario}")`,
        lockLines: 36,
        solution: `# Lab 3 — issue register: tiga temuan KUNING lesson ini (langkah 10a)
# Tanggal "hari ini" [ilustrasi] 2026-11-13 — due_date ditulis sebagai string ISO
# Aturan penutupan: temuan CLOSED hanya bila acceptance_test lulus DAN
# closure_approver menandatangani; approval KUNING berlaku selama tidak ada
# temuan yang overdue tanpa perpanjangan tertulis dari komite.
TODAY = "2026-11-13"
COLUMNS = ["finding_id", "severity", "evidence", "root_cause", "action",
           "owner", "due_date", "acceptance_test", "status", "closure_approver"]

findings = [
    {"finding_id": "F-01", "severity": "MEDIUM",
     "evidence": "selisih bad rate antar-half +1,06 pp, CI95 [-1,26; +3,35] [turunan]",
     "root_cause": "belum diketahui — noise sampling atau pergeseran distribusi skor di sekitar 0,10",
     "action": "pantau bad rate per periode + kumpulkan sampel lebih besar",
     "owner": "[ilustrasi] Risk Analyst", "due_date": "2026-12-13",
     "acceptance_test": "selisih antar-half periode berikut <= 1,0 pp ATAU CI tidak lagi melintasi 0",
     "status": "open", "closure_approver": "[ilustrasi] Validator Independen"},
    {"finding_id": "F-02", "severity": "MEDIUM",
     "evidence": "ECE Pascasarjana 0,0210; SMA 0,0362; AGE 50-59 0,0312 [M7.1]",
     "root_cause": "kalibrasi per grup di atas 0,02 pada tiga grup n >= 200",
     "action": "selidiki bin kalibrasi ketiga grup + periksa relevansi threshold per grup [M7.4]",
     "owner": "[ilustrasi] Model Owner", "due_date": "2027-01-12",
     "acceptance_test": "ECE ketiga grup < 0,02 pada revalidasi",
     "status": "open", "closure_approver": "[ilustrasi] Validator Independen"},
    {"finding_id": "F-03", "severity": "INVESTIGATE",
     "evidence": "ECE AGE 60+ 0,1208 (n=76), CI95 [0,0839; 0,2225] [turunan]",
     "root_cause": "kalibrasi grup kecil rusak — penyebab belum diketahui",
     "action": "kumpulkan sampel lebih besar untuk AGE 60+ SEBELUM revalidasi + periksa bin kalibrasi",
     "owner": "[ilustrasi] Validator Independen", "due_date": "2027-02-11",
     "acceptance_test": "ECE grup ini dihitung ulang pada n >= 200",
     "status": "open", "closure_approver": "[ilustrasi] Ketua Komite Risiko"},
]

fields_per_finding = min(len(f) for f in findings)
missing_fields = [c for c in COLUMNS if any(c not in f or not str(f[c]).strip() for f in findings)]
all_required = len(missing_fields) == 0
n_open = sum(1 for f in findings if f["status"] == "open")
n_overdue = sum(1 for f in findings if f["status"] == "open" and f["due_date"] < TODAY)
approval_valid = (n_overdue == 0 and all(
    f["owner"] and f["due_date"] and f["acceptance_test"] for f in findings))
# Skenario: F-01 lewat due_date tanpa perpanjangan tertulis
scenario = [dict(f) for f in findings]
scenario[0]["due_date"] = "2026-11-01"
n_overdue_scenario = sum(1 for f in scenario if f["status"] == "open" and f["due_date"] < TODAY)
approval_valid_scenario = n_overdue_scenario == 0
print(f"fields_per_finding={fields_per_finding}")
print(f"missing={missing_fields}")
print(f"all_required={all_required}")
print(f"n_open={n_open}")
print(f"n_overdue={n_overdue}")
print(f"approval_valid={approval_valid}")
print(f"n_overdue_scenario={n_overdue_scenario}")
print(f"approval_valid_scenario={approval_valid_scenario}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fields_per_finding", value: 10, tol: 0.5, label: "`fields_per_finding` seharusnya 10", msg: "Setiap temuan punya tepat 10 kolom register — satu kolom hilang berarti baris itu belum bisa dikerjakan." },
          { kind: "stdout_matches", task: "t1", pattern: "missing=\\\\[\\\\]", label: "Output menampilkan missing=[]", msg: "Semua 10 kolom ada dan tidak kosong di ketiga temuan — register lengkap." },
          { kind: "stdout_matches", task: "t1", pattern: "all_required=True", label: "Output menampilkan all_required=True", msg: "Register lolos validasi kelengkapan — seperti kartu G10, kelengkapan diperiksa mesin, bukan mata." },
          { kind: "equal", task: "t2", name: "n_open", value: 3, tol: 0.5, label: "`n_open` seharusnya 3", msg: "Ketiga temuan KUNING masih open — verdict KUNING berarti deploy dengan tiga temuan yang masih hidup." },
          { kind: "equal", task: "t2", name: "n_overdue", value: 0, tol: 0.5, label: "`n_overdue` seharusnya 0", msg: "Tidak ada temuan yang lewat due_date pada 2026-11-13 — ketiganya jatuh tempo 30/60/90 hari lagi." },
          { kind: "stdout_matches", task: "t2", pattern: "approval_valid=True", label: "Output menampilkan approval_valid=True", msg: "Persetujuan KUNING berlaku: tidak ada temuan overdue dan semua temuan punya owner, due_date, dan acceptance_test." },
          { kind: "equal", task: "t3", name: "n_overdue_scenario", value: 1, tol: 0.5, label: "`n_overdue_scenario` seharusnya 1", msg: "Skenario: F-01 jatuh tempo 2026-11-01 (sudah lewat) tanpa perpanjangan — satu temuan overdue." },
          { kind: "stdout_matches", task: "t3", pattern: "approval_valid_scenario=False", label: "Output menampilkan approval_valid_scenario=False", msg: "Satu temuan overdue tanpa perpanjangan tertulis = approval KUNING dibekukan sampai temuan itu ditutup atau diperpanjang komite — due_date punya konsekuensi." },
        ],
      },
    },
    {
      id: "checkpoint","""

M81_PAIRS = [
    ("  estMinutes: 70,",
     "  estMinutes: 90,", 1),
    # Peta lesson.
    ("Peta lesson: cerita validator dan gap 0,0646 → SR 11-7 dan tiga pilarnya → three lines of defense → conceptual soundness: asumsi, data, metode → outcomes analysis: backtesting + validation halves → ongoing monitoring (rujuk M7.5) → independensi validator → traffic-light verdict → jebakan «cek akurasi saja» → mini-case: putuskan → 2 lab → checkpoint.",
     "Peta lesson: cerita validator dan gap 0,0646 → SR 11-7 dan tiga pilarnya → three lines of defense → conceptual soundness: asumsi, data, metode → desain validasi (anti-leakage, split, reuse test) → outcomes analysis: backtesting + validation halves → kuantifikasi ketidakpastian (bootstrap CI) → ongoing monitoring (rujuk M7.5) → independensi validator → traffic-light verdict → jebakan «cek akurasi saja» → mini-case: putuskan → issue register: temuan menjadi tindakan → 3 lab → checkpoint.", 1),
    # G2: sisip langkah 4a sebelum outcomes-analysis.
    ('    {\n      id: "outcomes-analysis",', G2_STEP, 1),
    # G1: sisip langkah 5a sebelum ongoing-monitoring.
    ('    {\n      id: "ongoing-monitoring",', G1_STEP, 1),
    # G3: sisip langkah 10a sebelum lab1.
    ('    {\n      id: "lab1",', G3_STEP, 1),
    # Lab3: sisip sebelum checkpoint.
    ('    {\n      id: "checkpoint",', LAB3_STEP, 1),
    # Checkpoint prose: tambah CI + desain + register (jangkar "Jebakan:" unik ke prose).
    ("Jebakan: validator yang hanya cek akurasi — ECE overall 0,0087 menyembunyikan ECE AGE 60+ 0,1208 (n=76, di bawah gate 200 — tidak masuk band) [M7.1]; temuan itu butuh penyelidikan, bukan vonis dan bukan pengabaian. Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING.",
     "Jebakan: validator yang hanya cek akurasi — ECE overall 0,0087 menyembunyikan ECE AGE 60+ 0,1208 (n=76, di bawah gate 200 — tidak masuk band) [M7.1]; temuan itu butuh penyelidikan, bukan vonis dan bukan pengabaian. Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING. Kuantifikasi ketidakpastian [turunan]: bad rate 6,67% CI95 [5,47%; 7,85%]; ECE 0,0087 CI95 [0,0077; 0,0214] (melintasi 0,02); profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]; selisih bad rate antar-half +1,06 pp CI95 [−1,26; +3,35] — melintasi nol, jadi verdict KUNING ditandai «tidak konklusif — investigate»; ECE AGE 60+ 0,1208 CI95 [0,0839; 0,2225] — seluruh interval di atas 0,05, tetap temuan-investigasi (n < 200) dengan prioritas penyelidikan tertinggi. Desain validasi: cek ketersediaan fitur (semua fitur flagship tersedia saat keputusan), split acak mengukur noise bukan generalisasi ke populasi baru (temporal split tidak mungkin — snapshot tanpa tanggal), test 6.000 sudah dipakai memilih berkali-kali — vonis akhir adalah satu pemakaian terakhirnya sebagai test segar. Issue register: tiga temuan KUNING (F-01 bad rate, F-02 ECE tiga grup, F-03 AGE 60+) masing-masing 10 kolom; approval berlaku selama tidak ada temuan overdue tanpa perpanjangan komite; lab 3 membuktikan aturannya (n_open 3, n_overdue 0, approval_valid True — dan skenario overdue membekukannya).", 1),
    # Kuis G1: sisip sebelum penutup array kuis.
    ("""      ],
      summary: [
        "SR 11-7 (Federal Reserve) / OCC 2011-12 (2011): model risk = potensi konsekuensi merugikan (finansial maupun non-finansial) dari keputusan berbasis output model yang salah atau disalahgunakan; tiga pilar — (1) development, implementation, and use; (2) validation; (3) governance.",""",
     """        {
          q: "Bootstrap CI95 selisih bad rate antar-half adalah [+1,06 pp titik; CI −1,26; +3,35] [turunan] — intervalnya melintasi nol, ambang HIJAU 1,0, dan mendekati ambang MERAH 3,0. Apa yang harus dilakukan validator?",
          options: [
            { text: "Mengubah verdict menjadi HIJAU — CI mencakup 0, jadi selisihnya «tidak ada»", why: "Salah: CI yang melintasi nol berarti selisih TIDAK TERBUKTI berbeda dari nol — bukan berarti selisihnya nol. Aturan lesson: verdict mengikuti estimasi titik (1,06 > 1,0 → KUNING); CI tidak mengubah band." },
            { text: "Mengubah verdict menjadi MERAH — CI mendekati 3,0, jadi model hampir pasti gagal", why: "Salah: «mendekati» bukan «melewati» — titiknya 1,06 dan batas atas CI 3,35 belum tentu melewati ambang MERAH. CI yang lebar adalah bukti ketidakpastian, bukan bukti kegagalan." },
            { text: "Verdict tetap KUNING (titik 1,06 > ambang 1,0), TAPI ditandai «tidak konklusif — investigate»: tulis CI di laporan, prioritaskan sampel lebih besar untuk bad rate, dan revalidasi tidak boleh ditunda", why: "Benar: ambang ditulis dulu dan verdict mengikuti titik — CI tidak mengubah band. Yang diubah CI adalah tindak lanjutnya: verdict yang CI-nya melintasi ambang ditandai tidak konklusif, dengan penyelidikan sebagai syaratnya.", correct: true },
            { text: "Membuang selisih antar-half dari laporan — angka yang CI-nya melintasi nol tidak layak dilaporkan", why: "Salah: justru angka dengan CI lebar yang PALING layak dilaporkan bersama CI-nya — «+1,06 pp [−1,26; +3,35]» memberi tahu pembaca seberapa yakin kamu. Menyembunyikan ketidakpastian adalah berbohong dengan diam." },
          ],
        },
      ],
      summary: [
        "SR 11-7 (Federal Reserve) / OCC 2011-12 (2011): model risk = potensi konsekuensi merugikan (finansial maupun non-finansial) dari keputusan berbasis output model yang salah atau disalahgunakan; tiga pilar — (1) development, implementation, and use; (2) validation; (3) governance.",""", 1),
    # Summary: tambah bullet CI + desain + register.
    ('        "Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING.",',
     '''        "Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING.",
        "Kuantifikasi ketidakpastian [turunan]: bad rate 6,67% CI95 [5,47%; 7,85%]; approval 28,5% CI95 [27,33%; 29,65%]; ECE 0,0087 CI95 [0,0077; 0,0214]; profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]; selisih bad rate antar-half +1,06 pp CI95 [−1,26; +3,35] — melintasi nol dan ambang, jadi KUNING ditandai «tidak konklusif — investigate»; ECE AGE 60+ 0,1208 CI95 [0,0839; 0,2225] (seluruh interval di atas 0,05) tetap temuan-investigasi; ECE Pascasarjana 0,0210 CI95 [0,0159; 0,0387] melintasi 0,02.",
        "Desain validasi: cek ketersediaan fitur (fitur flagship tersedia saat keputusan — leakage adalah fitur yang baru ada sesudah keputusan); split acak mengukur noise, bukan generalisasi ke populasi baru; temporal split tidak mungkin di snapshot tanpa tanggal; test 6.000 sudah dipakai memilih berkali-kali — vonis akhir adalah pemakaian terakhirnya sebagai test segar.",
        "Issue register: temuan menjadi tindakan — 10 kolom (finding_id, severity, evidence, root_cause, action, owner, due_date, acceptance_test, status, closure_approver); temuan CLOSED hanya bila acceptance_test lulus DAN closure_approver menandatangani; approval KUNING berlaku selama tidak ada temuan overdue tanpa perpanjangan komite.",''', 1),
]

M81_MD_PAIRS = [
    # Peta di .md tidak ada baris peta terpisah; tambah seksi 4a setelah "## 4. Conceptual Soundness".
    ("""---

## 5. Outcomes Analysis: Uji Ulang Hasilnya — Validation Halves A vs B""",
     """---

## 4a. Desain Validasi: Cegah Leakage, Pilih Split yang Jujur, Jangan Pakai Ulang Test

Tiga keputusan desain sebelum satu metrik pun dihitung. **Satu — ketersediaan fitur:** «fitur ini tersedia KAPAN?» Delapan fitur turunan flagship semuanya dihitung dari riwayat bulan lalu — tersedia saat pengajuan diputuskan, jadi lolos. Yang gagal adalah fitur yang baru ada SETELAH keputusan (mis. «pembayaran bulan depan» untuk memutuskan bulan ini) — leakage yang membuat ROC-AUC terlihat bagus dan model tidak berguna di live. Anti-leakage di level pipeline sudah diajarkan di M6.2; yang baru di sini adalah cek KETERSEDIAAN WAKTU-nya. **Dua — pembagian data:** split acak menjawab «apakah model bekerja pada nasabah yang mirip dengan yang dilatih?» — dan hanya itu. Temporal split (latih periode lama, uji periode baru) dan group split (latih satu grup, uji grup lain) adalah pertanyaan yang lebih keras — dan keduanya TIDAK MUNGKIN di snapshot UCI tanpa tanggal. Batasan itu ditulis, bukan disembunyikan: klaim validasi lesson ini adalah klaim tentang snapshot ini; kompensasinya monitoring + revalidasi. Split waktu untuk deret waktu sudah diajarkan di M6.2 (walk-forward BBCA). **Tiga — pakai ulang test:** test 6.000 sudah dipakai memilih threshold (M6.4), membandingkan model (M6.5), memvalidasi (lesson ini), dan nanti memilih challenger (M8.4). Aturannya: test final dipakai SATU KALI untuk vonis akhir; sesudah itu ia referensi, bukan test segar. Challenger baru dibandingkan pada validation split yang segar atau nested CV [M6.2].

**Jebakan:** leakage tidak terlihat di ROC-AUC — fitur bocor justru membuat ROC-AUC NAIK. Satu-satunya yang menangkapnya adalah cek ketersediaan waktu.

---

## 5. Outcomes Analysis: Uji Ulang Hasilnya — Validation Halves A vs B""", 1),
    # Seksi 5a setelah "## 5. Outcomes Analysis" — jangkar: rumus ECE + "ECE test 0,0087".
    ("""ECE test 0,0087; half A 0,0114; half B 0,0104 — ketiganya di bawah 0,02, jadi kalibrasi lolos di semua belahan. Band 0,02/0,05 adalah [kebijakan lesson ini], bukan konstanta alam.""",
     """ECE test 0,0087; half A 0,0114; half B 0,0104 — ketiganya di bawah 0,02, jadi kalibrasi lolos di semua belahan. Band 0,02/0,05 adalah [kebijakan lesson ini], bukan konstanta alam.

---

## 5a. Kuantifikasi Ketidakpastian: Tiap Angka Punya Pita — dan Pita Itu Bisa Membalik Verdict

Setiap angka lesson ini adalah SATU pengukuran dari satu sampel. Bootstrap (B=2.000, seed 42, model tetap, resampling baris test) memberi interval kepercayaan 95% [turunan]: bad rate 6,67% CI95 [5,47%; 7,85%]; approval 28,5% CI95 [27,33%; 29,65%]; ECE 0,0087 CI95 [0,0077; 0,0214] — batas atasnya MELEWATI ambang lolos 0,02; profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]. Selisih antar-half: bad rate +1,06 pp CI95 [−1,26; +3,35] — melintasi nol (sekitar 19,7% ulangan memberi selisih ≤ 0), ambang HIJAU 1,0, dan mendekati MERAH 3,0; ROC-AUC −0,0139 CI95 [−0,0428; +0,0132]; ECE −0,0010 CI95 [−0,0142; +0,0118].

**Aturan lesson ini:** verdict traffic-light tetap mengikuti ESTIMASI TITIK (1,06 > 1,0 → KUNING) — CI tidak mengubah band dan tidak membatalkan verdict. Yang diubah CI adalah TINDAK LANJUTNYA: verdict yang CI-nya melintasi ambang ditandai «tidak konklusif — investigate» — tulis CI di laporan, prioritaskan sampel lebih besar, revalidasi tidak boleh ditunda. HIJAU yang CI-nya melintasi ambang KUNING adalah «HIJAU dengan peringatan». MERAH yang CI-nya melintasi nol tetap MERAH. ECE AGE 60+ 0,1208 CI95 [0,0839; 0,2225] — seluruh interval di atas 0,05, mis-kalibrasi kemungkinan besar nyata — tapi statusnya TETAP temuan-investigasi (n=76 < gate 200): CI memperkuat urgensi penyelidikan, bukan mengubah status. ECE Pascasarjana 0,0210 CI95 [0,0159; 0,0387] melintasi 0,02 — status KUNING-nya pun tidak konklusif. Bedanya dengan CI naif M6.2: di sana interval dari SE antar-fold; di sini dari bootstrap — karena bad rate/ECE/profit tidak punya rumus SE sederhana.""", 1),
    # Seksi 10a setelah "## 10. Mini-Case" — jangkar: akhir mini-case + "## Lab 1".
    ("""**Mitigasi:** setiap kali kamu menjadi validator, tulis verdictmu dalam SATU KALIMAT: «[HIJAU/KUNING/MERAH] karena [kondisi yang terpenuhi/dilanggar + angkanya], dengan syarat [syarat + pemilik + tanggal]». Bila kalimatmu tidak bisa ditulis, verdictmu belum siap.

---

## Lab 1: Selisih Validation Halves — Hitung, Jangan Tebak""",
     """**Mitigasi:** setiap kali kamu menjadi validator, tulis verdictmu dalam SATU KALIMAT: «[HIJAU/KUNING/MERAH] karena [kondisi yang terpenuhi/dilanggar + angkanya], dengan syarat [syarat + pemilik + tanggal]». Bila kalimatmu tidak bisa ditulis, verdictmu belum siap.

---

## 10a. Issue Register: Temuan Validasi Menjadi Tindakan — dengan Pemilik dan Tanggal

Verdict KUNING datang dengan tiga syarat — tapi syarat tanpa pemilik, tanggal, dan bukti penutupan adalah catatan yang menunggu dilupakan. Issue register: satu baris per temuan, sepuluh kolom — finding_id, severity, evidence, root_cause, action, owner, due_date, acceptance_test, status, closure_approver. Tiga temuan lesson ini: **F-01** (MEDIUM) selisih bad rate +1,06 pp, CI95 [−1,26; +3,35] — tidak konklusif; acceptance test: selisih periode berikut ≤ 1,0 pp ATAU CI tidak lagi melintasi 0. **F-02** (MEDIUM) ECE tiga grup yang masuk band KUNING (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312); acceptance test: ECE ketiganya < 0,02 pada revalidasi. **F-03** (INVESTIGATE) ECE AGE 60+ 0,1208 (n=76), CI95 [0,0839; 0,2225]; acceptance test: ECE dihitung ulang pada n ≥ 200. Pemilik dan tanggal [ilustrasi] — diisi komite saat verdict ditandatangani (M8.5).

**Aturan penutupan:** temuan CLOSED hanya bila acceptance_test LULUS dan closure_approver (bukan owner yang mengerjakan) menandatangani. Persetujuan KUNING tetap berlaku selama temuannya terbuka dan due_date belum lewat; temuan yang MELEWATI due_date tanpa perpanjangan tertulis dari komite adalah pemicu revalidasi (M8.5) — approval-nya dibekukan sampai temuan itu ditutup atau diperpanjang.

---

## Lab 1: Selisih Validation Halves — Hitung, Jangan Tebak""", 1),
    # Lab 3 di .md setelah Lab 2.
    ("""Hasil [lab]: ece_max=0.0114; ece_spread=0.0010; ece_lolos_A=True; ece_lolos_B=True; ece_lolos_overall=True; band=KUNING. SEMUA ECE (overall + per half) lolos (maksimum 0,0114, jauh di bawah 0,02) — kalibrasi BUKAN masalah model ini. Band KUNING datang dari |Δbad rate| 1,06 poin persen DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312). Lab ini hanya mengevaluasi 4 dari 5 kondisi band — ECE per grup tidak dihitung di sini; ia dihitung di langkah 9 (jebakan). Itulah gunanya memisahkan verdict per metrik: kamu tahu persis APA yang membuat model KUNING, dan syarat apa yang harus ditulis untuknya — pantau bad rate, bukan kalibrasi.""",
     """Hasil [lab]: ece_max=0.0114; ece_spread=0.0010; ece_lolos_A=True; ece_lolos_B=True; ece_lolos_overall=True; band=KUNING. SEMUA ECE (overall + per half) lolos (maksimum 0,0114, jauh di bawah 0,02) — kalibrasi BUKAN masalah model ini. Band KUNING datang dari |Δbad rate| 1,06 poin persen DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312). Lab ini hanya mengevaluasi 4 dari 5 kondisi band — ECE per grup tidak dihitung di sini; ia dihitung di langkah 9 (jebakan). Itulah gunanya memisahkan verdict per metrik: kamu tahu persis APA yang membuat model KUNING, dan syarat apa yang harus ditulis untuknya — pantau bad rate, bukan kalibrasi.

## Lab 3: Issue Register — Temuan KUNING Menjadi Baris yang Bisa Ditutup

Tiga temuan (F-01 bad rate, F-02 ECE tiga grup, F-03 AGE 60+) masing-masing 10 kolom; «hari ini» [ilustrasi] 2026-11-13; due_date 30/60/90 hari lagi — semuanya di masa depan.

Hasil [lab]: fields_per_finding=10; missing=[]; all_required=True; n_open=3; n_overdue=0; approval_valid=True. Skenario: pindahkan due_date F-01 ke 2026-11-01 (sudah lewat) tanpa perpanjangan — n_overdue_scenario=1, approval_valid_scenario=False: persetujuan KUNING dibekukan sampai temuan itu ditutup atau diperpanjang komite.""", 1),
    # Rangkuman .md: tambah bullet.
    ('- Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING.',
     '''- Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING.
- Kuantifikasi ketidakpastian [turunan]: bad rate 6,67% CI95 [5,47%; 7,85%]; ECE 0,0087 CI95 [0,0077; 0,0214]; profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]; selisih bad rate antar-half +1,06 pp CI95 [−1,26; +3,35] — KUNING ditandai «tidak konklusif — investigate»; ECE AGE 60+ 0,1208 CI95 [0,0839; 0,2225] tetap temuan-investigasi.
- Desain validasi: cek ketersediaan fitur; split acak mengukur noise, bukan generalisasi ke populasi baru; temporal split tidak mungkin di snapshot tanpa tanggal; test 6.000 sudah dipakai memilih berkali-kali.
- Issue register: 10 kolom per temuan; CLOSED hanya bila acceptance_test lulus DAN closure_approver menandatangani; approval KUNING berlaku selama tidak ada temuan overdue tanpa perpanjangan komite.''', 1),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    ok = True
    ok = apply(M81, M81_PAIRS, args.dry) and ok
    ok = apply(M81_MD, M81_MD_PAIRS, args.dry) and ok
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
