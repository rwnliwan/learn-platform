#!/usr/bin/env python3
"""Fill gap Luna M8 — M8.5 (G11 + G12 + G14 + cross-ref G3).

G11 (must): langkah baru "Langkah 5a" setelah sign-off — template exception
request (10 kolom); exception tanpa expiry otomatis invalid; hard constraint
tidak bisa di-exception-kan.
G12 (should): langkah baru "Langkah 6a" setelah change-control — decision
protocol (kuorum [kebijakan organisasi], recusal, delegated authority,
tie-breaker/eskalasi, approval timestamp, digital evidence, SLA KUNING/MERAH
[kebijakan organisasi]) + mini-case [ilustrasi].
G14 (nice): capstone wajib "Langkah 10a" setelah mini-case — satu perubahan
(threshold 0,10 -> 0,15) menghasilkan 9 artefak + rubric konsistensi.
Bukan lesson baru.
G3 (cross-ref): revalidasi memeriksa issue register lama [M8.1] lebih dulu
(G3 diisi penuh di M8.1 — langkah 10a + lab 3 — bukan di sini).
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


M85 = "src/app/v2/content/mlf-m85-governance-approval-workflow.ts"
M85_MD = "content/mlf-m85-governance-approval-workflow.md"

G11_STEP = """    {
      id: "exception-management",
      eyebrow: "Langkah 5a · Setelah sign-off",
      title: "Exception: jalan darurat yang tercatat — dengan tanggal kedaluwarsa",
      prose: [
        "Tidak semua penyimpangan dari alur adalah pelanggaran — kadang alur memang tidak bisa diikuti, dan yang dibutuhkan adalah JALAN DARURAT YANG TERCATAT: exception (pengecualian) atau override. Exception adalah izin TERTULIS untuk melewati satu gerbang atau satu aturan, untuk satu model, untuk waktu yang TERBATAS — dengan syarat yang ditulis di muka. Template exception request punya sepuluh kolom: reason (mengapa gerbang ini tidak bisa dilewati sekarang), affected model/version (model dan versi yang terkena — bukan «semua model»), gate bypassed (gerbang atau aturan mana yang dilewati — ditulis namanya, bukan «prosedur»), risk assessment (apa risikonya bila gerbang ini dilewati — dengan angka bila ada), compensating controls (kontrol pengganti selama exception berlaku — siapa yang memeriksa apa, seberapa sering), start/end time (kapan mulai, kapan berakhir — tanggal, bukan «sampai selesai»), approver (siapa yang menyetujui — komite, bukan owner sendiri), monitoring cadence (seberapa sering exception ini diperiksa selama berlaku), exit criteria (kondisi apa yang mengakhiri exception — gerbang dilewati, atau exception dicabut), ratification (komite meninjau dan mengesahkan atau mencabut exception itu pada pertemuan berikutnya).",
        "Tiga aturan yang membuat exception menjadi pengaman, bukan lubang. SATU — exception tanpa expiry OTOMATIS INVALID: exception yang tidak punya end time bukan exception — ia perubahan permanen yang menyamar. Bila end time lewat tanpa perpanjangan tertulis dari komite, exception itu MATI dengan sendirinya: model kembali ke aturan normal, dan bila itu berarti rollback, maka rollback (M8.4). DUA — hard constraint TIDAK BISA di-exception-kan: fairness AIR di bawah 0,80 [kebijakan M7.5] dan ECE di atas 0,02 [kebijakan lesson ini] adalah garis yang tidak boleh dilewati — berapa pun alasannya (langkah 6a, M8.4). Yang bisa di-exception-kan adalah gate PROSEDURAL — menunda revalidasi kalender 2 minggu karena validator belum tersedia, atau deploy dengan satu dokumen yang menyusul dalam 5 hari — bukan ambang keamanan. TIGA — exception yang diperpanjang DUA KALI menjadi change request: bila satu exception butuh diperpanjang kedua kalinya, itu bukan lagi «darurat sementara» — ia perubahan permanen yang harus lewat change control enam gerbang (langkah 6). Aturan ini mencegah exception menjadi cara untuk menghindari gerbang secara permanen, satu perpanjangan demi satu perpanjangan.",
        "Contoh [ilustrasi] — exception yang SAH. Revalidasi kalender flagship jatuh tempo minggu ini, tapi validator independen belum tersedia (cuti) selama 2 minggu. Exception: menunda revalidasi 14 hari. Gate bypassed: pemicu kalender (langkah 7). Risk assessment: model tetap dimonitor harian; PSI terakhir 0,0017, jauh di bawah 0,25 — risiko penundaan 2 minggu rendah. Compensating controls: risk manager memeriksa PSI + approval rate HARIAN selama 14 hari (bukan mingguan), dan alert fairness tetap menyala. Start/end: 13–27 November 2026 [ilustrasi]. Approver: komite. Monitoring cadence: harian. Exit criteria: laporan revalidasi diserahkan 27 November, atau exception dicabut dan revalidasi dipercepat. Ratification: komite meninjau pada pertemuan 20 November. Yang membuat exception ini sah bukan isinya yang «masuk akal» — melainkan kesepuluh kolomnya terisi, expiry-nya tertulis, dan kontrol penggantinya konkret. Contoh yang TIDAK sah: «deploy dulu, dokumen menyusul» tanpa tanggal, tanpa approver, tanpa kontrol pengganti — itu bukan exception, itu melewati gerbang tanpa izin.",
        "Nilai: exception bagus karena ia memberi jalan keluar yang JUJUR saat alur buntu: daripada melewati gerbang diam-diam (mini-case langkah 10), tim meminta izin tertulis dengan expiry dan kontrol pengganti — dan komite bisa menolak. Buruk bila exception menjadi kebiasaan: komite yang menyetujui exception tiap minggu sedang tidak mengelola pengecualian — ia sedang mengelola aturan yang tidak pernah ditegakkan. Dan buruk bila exception dicatat di chat atau email: exception yang tidak ada di audit trail (langkah 8) adalah exception yang tidak pernah ada saat audit datang.",
        "Mitigasi: simpan SEMUA exception di SATU register yang sama dengan issue register [M8.1] — dan di tiap pertemuan komite, baca daftar exception yang masih berlaku LEBIH DULU sebelum agenda lain: exception yang sudah lewat expiry tanpa perpanjangan adalah exception yang sudah mati — dan model yang masih berjalan atasnya adalah model yang berjalan tanpa izin.",
      ],
      tasks: [],
    },
    {
      id: "change-control","""

G12_STEP = """    {
      id: "decision-protocol",
      eyebrow: "Langkah 6a · Setelah change control",
      title: "Decision protocol: keputusan komite yang sah — kuorum, recusal, dan jejak digital",
      prose: [
        "Change control (langkah 6) memberitahu gerbang apa yang dilewati — tapi tidak memberitahu BAGAIMANA komite memutuskan. DECISION PROTOCOL adalah aturan tentang keputusan komite itu sendiri. Tujuh unsur: (1) quorum minimum [kebijakan organisasi] — jumlah anggota minimum agar keputusan SAH; tanpa kuorum, keputusan tidak ada, berapa pun yang hadir setuju. (2) recusal — anggota yang punya conflict of interest (mis. ia yang membangun model itu, atau bonusnya bergantung pada deploy-nya) WAJIB mengundurkan diri dari pembahasan dan pemungutan suara atas model itu — dan recusal-nya dicatat. (3) delegated authority — apa yang bisa diputuskan ketua sendirian (mis. perpanjangan exception 3 hari [kebijakan organisasi]) dan apa yang wajib komite penuh (persetujuan deploy, pencabutan approval) — ditulis, bukan ditebak. (4) tie-breaker/eskalasi — bila suara seri, keputusan TIDAK diambil di ruangan itu: ia dieskalasikan ke tingkat yang lebih tinggi [kebijakan organisasi] — ketua tidak memaksakan suaranya sendiri. (5) approval timestamp — tanggal dan jam keputusan, tercatat bersama versinya. (6) digital evidence — bukti keputusan adalah rekaman yang ditandatangani secara digital (lembar sign-off + notulen), bukan pesan chat atau «katanya sudah disetujui». (7) SLA keputusan [kebijakan organisasi] — berapa lama komite harus memutuskan atas temuan KUNING dan MERAH: temuan MERAH diputuskan lebih cepat dari KUNING, dan keduanya punya batas waktu tertulis — komite yang menunda tanpa batas sedang membiarkan risiko berjalan.",
        "Mini-case [ilustrasi] — keputusan yang TIDAK SAH. Komite model risk beranggotakan 5 orang. Agenda: menyetujui deploy v2.1 flagship. Yang hadir: 2 anggota + ketua. Kuorum minimum [kebijakan organisasi] tidak tercapai — keputusan yang diambil ruangan itu TIDAK SAH, walau ketiga yang hadir semuanya setuju. Tambah lagi: salah satu dari 2 anggota itu adalah model owner v2.1 — ia punya conflict of interest dan seharusnya recusal, sehingga yang sah membahas tinggal 1 anggota + ketua. Dan suara akhirnya 2–2 (dua anggota yang tidak hadir mengirim suara tertulis — suara tertulis dari anggota yang tidak hadir dalam pembahasan TIDAK DIHITUNG [kebijakan organisasi]) — seri, jadi keputusannya dieskalasikan, bukan dipaksakan ketua. Tiga kesalahan dalam satu ruangan: tanpa kuorum, tanpa recusal, dan seri yang dipaksakan. Pelajarannya: keputusan yang prosedurnya salah adalah keputusan yang tidak ada — berapa pun isinya benar. Dan «semua yang hadir setuju» bukan bukti apa-apa bila yang hadir tidak cukup untuk memutuskan.",
        "Nilai: protokol bagus karena ia memisahkan ISI keputusan dari SAHNYA keputusan: komite bisa menyetujui model yang benar dengan cara yang salah — dan cara yang salah itu membatalkan persetujuannya. Tanpa protokol, «komite sudah menyetujui» adalah klaim yang tidak bisa diperiksa: siapa yang hadir, siapa yang recusal, berapa suaranya, kapan diputuskan — tidak ada yang tercatat. Buruk bila protokol hanya ada di atas kertas dan tidak pernah ditegakkan: kuorum yang «biasanya dilonggarkan» bukan kuorum — ia kebiasaan yang menunggu audit.",
        "Baik atau buruk: protokol bagus bila ditegakkan pada keputusan yang TIDAK POPULER — menolak deploy yang sudah dijadwalkan karena kuorum tidak tercapai adalah bukti protokolnya hidup. Buruk bila protokol hanya ditegakkan saat mudah: komite yang melonggarkan kuorum «karena mendesak» sedang memberi tahu semua orang bahwa kuorum adalah saran, bukan aturan. Dan buruk bila digital evidence-nya adalah tangkapan layar chat: bukti yang bisa diedit sesudahnya bukan bukti.",
        "Mitigasi: sebelum tiap pertemuan, periksa tiga hal: kuorum tercapai? ada yang harus recusal? siapa yang mencatat + menandatangani digital? Bila satu saja tidak, pertemuan itu bukan rapat komite — ia diskusi. Dan simpan protokol ini BERSAMA audit trail (langkah 8): keputusan tanpa jejak digital adalah keputusan yang tidak pernah diambil.",
      ],
      tasks: [],
    },
    {
      id: "revalidation-triggers","""

G14_STEP = """    {
      id: "capstone",
      eyebrow: "Langkah 10a · Capstone wajib — akhir M8.5",
      title: "Capstone: satu perubahan, sembilan artefak — buktikan kamu bisa menjalankan governance-nya",
      prose: [
        "Capstone ini adalah ujian akhir Modul M8 — BUKAN lesson baru, melainkan tugas yang memakai SEMUA yang kamu pelajari di M8.1–M8.5. Kamu menerima SATU perubahan: threshold flagship diubah dari 0,10 menjadi 0,15 [M6.4]. Tugasmu: hasilkan SEMBILAN artefak — (1) validation report (M8.1): traffic-light verdict atas perubahan ini (apakah 0,15 masih layak — dengan CI bootstrap [turunan M8.1] dan desain validasi yang ditulis); (2) tiering score (M8.2): apakah tier flagship berubah karena perubahan ini (hitung skor 0,50×M + 0,30×C + 0,20×B — dan periksa shared dependency + vendor bila ada); (3) model card (M8.3): kartu 17 kolom (10 G10 + 7 penggunaan) untuk versi threshold baru — termasuk prohibited_use dan out_of_scope_trigger yang diperbarui; (4) shadow/canary decision (M8.4): apakah 0,15 naik langsung, lewat shadow, atau lewat canary — dengan ramp dan gate-nya; (5) gate sheet (M8.4): tujuh gate naik, masing-masing dengan angka dan status lolos/gagal; (6) rollback runbook (M8.4): 10 bagian, total di bawah 30 menit [kebijakan lesson ini]; (7) RACI/sign-off (M8.5): siapa R/A/C/I tiap tahap, dan empat tanda tangan atas bagiannya; (8) audit trail (M8.5): sepuluh kolom G10 untuk versi baru — kelengkapan 1,0; (9) keputusan final: NAIK / TIDAK NAIK / NAIK DENGAN SYARAT — dengan alasan satu paragraf yang merujuk ke artefak 1–8.",
        "Angka yang harus kamu pakai — semuanya sudah ada di lesson ini, jangan dihitung ulang dari nol dan jangan dikarang: approval 28,5% ke 49,88% (+21,38 poin persen, +1.283 nasabah), bad rate 6,67% ke 8,99% (+2,32 poin persen, +155 default disetujui), cost NT$33.046.500 ke NT$35.770.000 (+NT$2.723.500), profit +NT$8.214.000 ke +NT$5.490.500 (−NT$2.723.500); AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air]; pada 0,20 profit sudah −NT$216.500. Keputusan yang diharapkan BUKAN «pasti naik» atau «pasti tidak naik» — mini-case lesson ini berkata 0,15 «mungkin saja disetujui» (AIR membaik, profit masih positif). Yang dinilai adalah APAKAH KEPUTUSANMU KONSISTEN dengan artefakmu: bila gate sheet-mu berkata G1 gagal tapi keputusan final-mu «NAIK», capstone-mu gagal — bukan karena vonisnya salah, melainkan karena artefakmu bertentangan satu sama lain.",
        "RUBRIC — sepuluh pemeriksaan, semuanya harus lolos (bukan skor rata-rata): (1) version ID konsisten — model_id, model_version, feature_schema_version, calibration_version, threshold_policy_version, deployment_id SAMA di kesembilan artefak (G13, M8.3); satu mismatch = GAGAL. (2) angka konsisten — approval, bad rate, cost, profit, AIR di semua artefak SAMA dengan angka di atas; satu angka yang berbeda tanpa penjelasan = GAGAL. (3) status gate konsisten — gate sheet, validation report, dan keputusan final berkata hal yang sama tentang tiap gate; gate yang «lolos» di satu artefak dan «gagal» di artefak lain = GAGAL. (4) owner tertulis — tiap artefak punya satu nama owner (bukan «tim»); artefak tanpa owner = GAGAL. (5) due date tertulis — tiap syarat dan temuan punya tanggal (issue register [M8.1]); syarat tanpa tanggal = GAGAL. (6) kondisi revalidation tertulis — pemicu revalidasi untuk versi baru ditulis di model card (langkah 7); tidak ada = GAGAL. (7) prohibited_use terisi — kartu tanpa penggunaan-terlarang = GAGAL (hard rule, M8.3). (8) rollback runbook < 30 menit — total di atas 30 menit [kebijakan lesson ini] = GAGAL. (9) RACI lengkap — tiap tahap punya tepat satu A; A kosong atau ganda = GAGAL. (10) keputusan final beralasan — satu paragraf yang merujuk ke artefak 1–8 dengan nomor; keputusan tanpa rujukan = GAGAL. Rubric ini adalah cermin dari governance itu sendiri: bukan «apakah kamu pintar», melainkan «apakah artefakmu bisa diaudit».",
        "Nilai: capstone bagus karena ia menguji hal yang tidak bisa diuji kuis: konsistensi LINTAS artefak. Kuis menguji apakah kamu tahu satu konsep; capstone menguji apakah sembilan dokumenmu bercerita tentang model yang SAMA. Di dunia nyata, itulah yang diperiksa auditor — bukan apakah kamu hafal definisi, melainkan apakah kartu, laporan, dan jejakmu cocok satu sama lain.",
        "Mitigasi: kerjakan capstone dengan checklist rubric di sampingmu — periksa satu item demi satu item SEBELUM menyerahkan. Dan bila kamu menemukan artefakmu bertentangan (gate sheet berkata lolos, validation report berkata gagal), jangan «memperbaiki» salah satunya diam-diam: tulis KENAPA mereka berbeda, dan mana yang benar menurut angka. Kontradiksi yang dijelaskan adalah temuan; kontradiksi yang disembunyikan adalah kegagalan audit.",
      ],
      tasks: [],
    },
    {
      id: "lab1","""

M85_PAIRS = [
    ("  estMinutes: 85,",
     "  estMinutes: 105,", 1),
    # Peta lesson.
    ("Peta lesson: cerita model tanpa sign-off → struktur governance (komite, pemilik, validator, audit) → RACI: siapa Responsible, Accountable, Consulted, Informed → alur approval utuh dari proposal sampai monitoring → arti tanda tangan → change control enam gerbang G10 [M7.4] dengan contoh perubahan threshold 0,10 ke 0,15 → pemicu revalidasi → audit trail sepuluh kolom G10 → jebakan stempel karet → mini-case perubahan threshold → 2 lab → checkpoint.",
     "Peta lesson: cerita model tanpa sign-off → struktur governance (komite, pemilik, validator, audit) → RACI: siapa Responsible, Accountable, Consulted, Informed → alur approval utuh dari proposal sampai monitoring → arti tanda tangan → exception: jalan darurat yang tercatat → change control enam gerbang G10 [M7.4] dengan contoh perubahan threshold 0,10 ke 0,15 → decision protocol: kuorum, recusal, jejak digital → pemicu revalidasi → audit trail sepuluh kolom G10 → jebakan stempel karet → mini-case perubahan threshold → capstone: satu perubahan, sembilan artefak → 2 lab → checkpoint.", 1),
    # G11: sisip langkah 5a sebelum change-control.
    ('    {\n      id: "change-control",', G11_STEP, 1),
    # G12: sisip langkah 6a sebelum revalidation-triggers.
    ('    {\n      id: "revalidation-triggers",', G12_STEP, 1),
    # G14: sisip capstone sebelum lab1.
    ('    {\n      id: "lab1",', G14_STEP, 1),
    # G3 cross-ref: revalidasi memeriksa issue register lama lebih dulu.
    ("Mitigasi: tuliskan keempat pemicu ini di model card [M8.3] — di samping tanggal approval — sehingga siapa pun yang membaca model card tahu persis kapan model ini harus diperiksa ulang, tanpa perlu bertanya kepada owner.",
     "Mitigasi: tuliskan keempat pemicu ini di model card [M8.3] — di samping tanggal approval — sehingga siapa pun yang membaca model card tahu persis kapan model ini harus diperiksa ulang, tanpa perlu bertanya kepada owner. Dan di revalidasi, baris pertama yang diperiksa adalah issue register lama [M8.1]: temuan yang masih terbuka dari validasi sebelumnya adalah temuan pertama di laporan baru — dan temuan yang melewati due_date tanpa perpanjangan tertulis dari komite adalah pemicu revalidasi (langkah 10a, M8.1).", 1),
    # Checkpoint prose: tambah G11/G12/G14 + G3 (jangkar gabungan mini-case + lab).
    ("Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air], profit masih positif) — governance bukan tentang menolak semua perubahan, melainkan memutuskan dengan mata terbuka. Lab: perubahan 0,10 ke 0,15 menggerakkan 1.283 keputusan dan NT$2.723.500 serta butuh keenam gerbang; log v2.1 [ilustrasi] kehilangan 4 kolom G10 (completeness 0,6) — audit GAGAL, tidak boleh naik produksi.",
     "Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air], profit masih positif) — governance bukan tentang menolak semua perubahan, melainkan memutuskan dengan mata terbuka. Lab: perubahan 0,10 ke 0,15 menggerakkan 1.283 keputusan dan NT$2.723.500 serta butuh keenam gerbang; log v2.1 [ilustrasi] kehilangan 4 kolom G10 (completeness 0,6) — audit GAGAL, tidak boleh naik produksi. Exception (G11): template 10 kolom — exception tanpa expiry otomatis invalid; hard constraint (AIR < 0,80, ECE > 0,02) tidak bisa di-exception-kan; exception yang diperpanjang 2× menjadi change request (6 gerbang). Decision protocol (G12): kuorum minimum [kebijakan organisasi], recusal bila conflict of interest, delegated authority, tie-breaker/eskalasi, approval timestamp, digital evidence, SLA KUNING/MERAH [kebijakan organisasi] — keputusan tanpa kuorum INVALID walau semua yang hadir setuju. Capstone (G14): satu perubahan (threshold 0,10 → 0,15) → validation report, tiering score, model card, shadow/canary decision, gate sheet, rollback runbook, RACI/sign-off, audit trail, keputusan final — rubric 10 pemeriksaan (konsistensi version ID, angka, status gate, owner, due date, kondisi revalidation) semuanya harus lolos. Revalidasi memeriksa issue register lama [M8.1] lebih dulu: temuan yang masih terbuka adalah temuan pertama di laporan baru.", 1),
    # Kuis G11 + G12: sisip sebelum penutup array kuis.
    ("""        },
      ],
      summary: [
        "Governance empat peran: komite model risk (memutuskan boleh/tidak), model owner (accountable saat live), validator independen [M8.1] (memeriksa tanpa membangun), audit internal (memeriksa prosesnya).",""",
     """        },
        {
          q: "Exception disetujui untuk menunda revalidasi kalender 14 hari — tapi tidak ada end time yang tertulis. Apa status exception itu?",
          options: [
            { text: "Sah — 14 hari sudah disebut di alasan, jadi expiry-nya jelas", why: "Salah: «disebut di alasan» bukan end time tertulis. Kolom start/end time harus terisi tanggal — tanpa itu, exception tidak punya expiry, dan exception tanpa expiry otomatis invalid." },
            { text: "Otomatis invalid — exception tanpa expiry bukan exception, melainkan perubahan permanen yang menyamar; model kembali ke aturan normal", why: "Benar: end time adalah kolom yang membuat exception menjadi sementara. Tanpa tanggal berakhir, tidak ada yang tahu kapan exception itu mati — dan yang tidak bisa mati adalah perubahan permanen.", correct: true },
            { text: "Sah selama 14 hari — komite bisa mengingatnya tanpa menulis", why: "Salah: ingatan komite bukan bukti — dan exception yang hanya ada di ingatan tidak ada di audit trail. Bila tidak tertulis, ia tidak pernah ada saat audit datang." },
            { text: "Sah tanpa batas — exception yang disetujui komite berlaku sampai dicabut", why: "Salah: «berlaku sampai dicabut» adalah definisi perubahan permanen. Exception yang tidak mati sendiri adalah lubang di governance — ia membiarkan model berjalan di luar aturan tanpa batas waktu." },
          ],
        },
        {
          q: "Komite 5 orang membahas deploy v2.1. Yang hadir: 2 anggota + ketua. Kuorum minimum [kebijakan organisasi] tidak tercapai — tapi ketiganya setuju. Apa status keputusan itu?",
          options: [
            { text: "Sah — semua yang hadir setuju, jadi keputusan diambil secara bulat", why: "Salah: «semua yang hadir setuju» bukan bukti apa-apa bila yang hadir tidak cukup untuk memutuskan. Tanpa kuorum, keputusan tidak ada — berapa pun yang hadir setuju." },
            { text: "Sah bila ketuanya menandatangani — tanda tangan ketua menggantikan kuorum", why: "Salah: ketua tidak bisa menggantikan kuorum dengan tanda tangannya. Kuorum adalah syarat sahnya keputusan, bukan formalitas yang bisa dilonggarkan «karena mendesak»." },
            { text: "Tidak sah — tanpa kuorum keputusan tidak ada; bila salah satu yang hadir adalah model owner, ia seharusnya recusal, dan bila suara seri, keputusan dieskalasikan, bukan dipaksakan", why: "Benar: tiga kesalahan dalam satu ruangan — tanpa kuorum, tanpa recusal, dan seri yang dipaksakan. Keputusan yang prosedurnya salah adalah keputusan yang tidak ada, berapa pun isinya benar.", correct: true },
            { text: "Sah — kuorum hanya berlaku untuk persetujuan deploy, bukan untuk pembahasan", why: "Salah: kuorum berlaku untuk KEPUTUSAN — dan pembahasan yang diakhiri keputusan tanpa kuorum adalah diskusi, bukan rapat komite. Keputusan tanpa kuorum tidak bisa «disahkan belakangan»." },
          ],
        },
      ],
      summary: [
        "Governance empat peran: komite model risk (memutuskan boleh/tidak), model owner (accountable saat live), validator independen [M8.1] (memeriksa tanpa membangun), audit internal (memeriksa prosesnya).",""", 1),
    # Summary: tambah 3 bullet setelah bullet audit trail.
    ('        "Audit trail G10 [M7.4]: sepuluh kolom wajib — kelengkapan 1,0, ditulis saat keputusan diambil; log v2.1 [ilustrasi] dengan 4 kolom hilang (completeness 0,6) berarti audit GAGAL.",',
     '''        "Audit trail G10 [M7.4]: sepuluh kolom wajib — kelengkapan 1,0, ditulis saat keputusan diambil; log v2.1 [ilustrasi] dengan 4 kolom hilang (completeness 0,6) berarti audit GAGAL.",
        "Exception: template 10 kolom (reason, model/version, gate bypassed, risk assessment, compensating controls, start/end time, approver, monitoring cadence, exit criteria, ratification) — exception tanpa expiry otomatis invalid; hard constraint (AIR < 0,80, ECE > 0,02) tidak bisa di-exception-kan; diperpanjang 2× menjadi change request.",
        "Decision protocol: kuorum minimum [kebijakan organisasi], recusal bila conflict of interest, delegated authority, tie-breaker/eskalasi, approval timestamp, digital evidence, SLA KUNING/MERAH [kebijakan organisasi] — keputusan tanpa kuorum INVALID walau semua yang hadir setuju.",
        "Capstone (akhir M8.5): satu perubahan (threshold 0,10 → 0,15) → validation report, tiering score, model card 17 kolom, shadow/canary decision, gate sheet, rollback runbook, RACI/sign-off, audit trail, keputusan final — rubric 10 pemeriksaan (konsistensi version ID, angka, status gate, owner, due date, kondisi revalidation) semuanya harus lolos.",''', 1),
]

M85_MD_PAIRS = [
    # Seksi 5a setelah "## 5. Apa Arti Tanda Tangan".
    ("""---

## 6. Change Control G10 [M7.4]: Enam Gerbang — Bahkan untuk Perubahan Threshold""",
     """---

## 5a. Exception: Jalan Darurat yang Tercatat — dengan Tanggal Kedaluwarsa

Exception adalah izin TERTULIS untuk melewati satu gerbang atau satu aturan, untuk satu model, untuk waktu yang TERBATAS. **Template 10 kolom:** reason, affected model/version, gate bypassed, risk assessment, compensating controls, start/end time, approver, monitoring cadence, exit criteria, ratification.

**Tiga aturan:** (1) exception tanpa expiry OTOMATIS INVALID — bila end time lewat tanpa perpanjangan tertulis, exception itu MATI dengan sendirinya. (2) Hard constraint TIDAK BISA di-exception-kan — fairness AIR < 0,80 [kebijakan M7.5] dan ECE > 0,02 [kebijakan lesson ini] adalah garis yang tidak boleh dilewati; yang bisa di-exception-kan adalah gate PROSEDURAL (mis. menunda revalidasi kalender 2 minggu). (3) Exception yang diperpanjang DUA KALI menjadi change request — lewat enam gerbang.

**Contoh [ilustrasi] yang sah:** menunda revalidasi kalender 14 hari karena validator belum tersedia — dengan risk assessment (PSI terakhir 0,0017), compensating controls (risk manager memeriksa PSI + approval rate HARIAN), start/end 13–27 November 2026, approver komite, exit criteria (laporan revalidasi diserahkan 27 November), ratification 20 November. **Contoh yang tidak sah:** «deploy dulu, dokumen menyusul» tanpa tanggal, tanpa approver, tanpa kontrol pengganti — itu melewati gerbang tanpa izin.

---

## 6. Change Control G10 [M7.4]: Enam Gerbang — Bahkan untuk Perubahan Threshold""", 1),
    # Seksi 6a setelah "## 6. Change Control".
    ("""---

## 7. Kapan Validasi Ulang Wajib: Data Baru, Penggunaan Baru, Temuan Monitoring, Kalender""",
     """---

## 6a. Decision Protocol: Keputusan Komite yang Sah — Kuorum, Recusal, dan Jejak Digital

Tujuh unsur: (1) **quorum minimum** [kebijakan organisasi] — tanpa kuorum, keputusan tidak ada. (2) **recusal** — anggota dengan conflict of interest WAJIB mengundurkan diri dari pembahasan dan suara atas model itu. (3) **delegated authority** — apa yang bisa diputuskan ketua sendirian vs apa yang wajib komite penuh. (4) **tie-breaker/eskalasi** — suara seri dieskalasikan ke tingkat lebih tinggi [kebijakan organisasi], bukan dipaksakan ketua. (5) **approval timestamp** — tanggal dan jam keputusan. (6) **digital evidence** — rekaman yang ditandatangani secara digital, bukan pesan chat. (7) **SLA keputusan** [kebijakan organisasi] — temuan MERAH diputuskan lebih cepat dari KUNING, keduanya punya batas waktu tertulis.

**Mini-case [ilustrasi]:** komite 5 orang, yang hadir 2 anggota + ketua — kuorum tidak tercapai, keputusan TIDAK SAH walau ketiganya setuju. Salah satu dari 2 anggota itu adalah model owner v2.1 — seharusnya recusal. Suara 2–2 (termasuk suara tertulis dari anggota yang tidak hadir — tidak dihitung [kebijakan organisasi]) adalah seri → dieskalasikan. Keputusan yang prosedurnya salah adalah keputusan yang tidak ada.

---

## 7. Kapan Validasi Ulang Wajib: Data Baru, Penggunaan Baru, Temuan Monitoring, Kalender""", 1),
    # G3 cross-ref di seksi 7 (Mitigasi).
    ("**Mitigasi:** tuliskan keempat pemicu ini di model card [M8.3] — di samping tanggal approval — sehingga siapa pun yang membaca model card tahu persis kapan model ini harus diperiksa ulang, tanpa perlu bertanya kepada owner.",
     "**Mitigasi:** tuliskan keempat pemicu ini di model card [M8.3] — di samping tanggal approval — sehingga siapa pun yang membaca model card tahu persis kapan model ini harus diperiksa ulang, tanpa perlu bertanya kepada owner. Dan di revalidasi, baris pertama yang diperiksa adalah issue register lama [M8.1]: temuan yang masih terbuka dari validasi sebelumnya adalah temuan pertama di laporan baru — dan temuan yang melewati due_date tanpa perpanjangan tertulis dari komite adalah pemicu revalidasi.", 1),
    # Capstone 10a setelah "## 10. Mini-case".
    ("""---
## Lab 1: Nilai Perubahan Threshold 0,10 ke 0,15 — dan Putuskan Gerbangnya""",
     """---

## 10a. Capstone Wajib: Satu Perubahan, Sembilan Artefak — Buktikan Kamu Bisa Menjalankan Governance-nya

Capstone akhir Modul M8 — BUKAN lesson baru. Kamu menerima SATU perubahan: threshold flagship 0,10 → 0,15 [M6.4]. Hasilkan SEMBILAN artefak: (1) validation report (M8.1) — traffic-light verdict atas perubahan ini; (2) tiering score (M8.2); (3) model card 17 kolom (M8.3); (4) shadow/canary decision (M8.4); (5) gate sheet tujuh gate (M8.4); (6) rollback runbook 10 bagian < 30 menit [kebijakan lesson ini] (M8.4); (7) RACI/sign-off (M8.5); (8) audit trail sepuluh kolom G10, kelengkapan 1,0 (M8.5); (9) keputusan final — NAIK / TIDAK NAIK / NAIK DENGAN SYARAT — dengan alasan satu paragraf yang merujuk ke artefak 1–8.

Angka yang dipakai (jangan dikarang): approval 28,5% → 49,88% (+1.283 nasabah), bad rate 6,67% → 8,99% (+155 default disetujui), cost +NT$2.723.500, profit −NT$2.723.500; AIR SEX 0,8694 → 0,8906 [m71_air_sex_by_threshold.0.15.air]; pada 0,20 profit sudah −NT$216.500.

**Rubric — sepuluh pemeriksaan, semuanya harus lolos:** (1) version ID konsisten di kesembilan artefak (G13, M8.3); (2) angka konsisten di semua artefak; (3) status gate konsisten (gate sheet = validation report = keputusan final); (4) owner tertulis di tiap artefak; (5) due date tertulis untuk tiap syarat/temuan; (6) kondisi revalidation tertulis di model card; (7) prohibited_use terisi (hard rule, M8.3); (8) rollback runbook < 30 menit; (9) RACI lengkap — tepat satu A per tahap; (10) keputusan final beralasan dengan rujukan ke artefak 1–8. Satu item gagal = capstone gagal — bukan karena vonisnya salah, melainkan karena artefakmu bertentangan satu sama lain.

---

## Lab 1: Nilai Perubahan Threshold 0,10 ke 0,15 — dan Putuskan Gerbangnya""", 1),
    # Rangkuman .md: tambah 3 bullet setelah bullet audit trail.
    ('- Audit trail G10 [M7.4]: sepuluh kolom wajib — kelengkapan 1,0, ditulis saat keputusan diambil; log v2.1 [ilustrasi] dengan 4 kolom hilang (completeness 0,6) berarti audit GAGAL.',
     '''- Audit trail G10 [M7.4]: sepuluh kolom wajib — kelengkapan 1,0, ditulis saat keputusan diambil; log v2.1 [ilustrasi] dengan 4 kolom hilang (completeness 0,6) berarti audit GAGAL.
- Exception: template 10 kolom — exception tanpa expiry otomatis invalid; hard constraint (AIR < 0,80, ECE > 0,02) tidak bisa di-exception-kan; diperpanjang 2× menjadi change request.
- Decision protocol: kuorum minimum [kebijakan organisasi], recusal bila conflict of interest, delegated authority, tie-breaker/eskalasi, approval timestamp, digital evidence, SLA KUNING/MERAH [kebijakan organisasi] — keputusan tanpa kuorum INVALID.
- Capstone (akhir M8.5): satu perubahan (threshold 0,10 → 0,15) → 9 artefak (validation report, tiering score, model card 17 kolom, shadow/canary decision, gate sheet, rollback runbook, RACI/sign-off, audit trail, keputusan final) — rubric 10 pemeriksaan, semuanya harus lolos.''', 1),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    ok = True
    ok = apply(M85, M85_PAIRS, args.dry) and ok
    ok = apply(M85_MD, M85_MD_PAIRS, args.dry) and ok
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
