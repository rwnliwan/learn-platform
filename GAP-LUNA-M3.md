# Gap Luna — Modul M3 "Unsupervised / fraud" (Learn v2)

**Tanggal:** 12 November 2026, ~17:45 WITA
**Analis gap:** Luna (`gpt-6-luna`) via Kelontong AI — 1 panggilan, streaming, tanpa fallback.
**Scope:** 5 lesson TS M3 (teks penuh, sudah diperbaiki pasca-review DeepSeek) + SPEC §M3.
**Laporan mentah model:** `/tmp/gap_m3_luna_raw.txt`
**Hasil: 8 gap (4 must-add, 3 should-add, 1 nice-to-have). Tidak ada satu pun dari 11 temuan DeepSeek M3 yang muncul lagi.**

## Verifikasi induk (semua gap dicek ke TS penuh + grep)

**8/8 BENAR** (status HILANG/TIPIS terkonfirmasi). Satu koreksi atas laporan Luna: kalimat pendukung G1 ("M3.1 mengatakan jika label pemeriksaan mulai tersedia, pembelajar dapat 'mempertimbangkan pindah ke supervised'") **tidak ditemukan di lesson** — M3.1 hanya membedakan supervised vs unsupervised (:17). Jadi gap G1 lebih bersih dari yang ditulis Luna: tidak ada panduan transisi sama sekali.

### Must-add

**G1 — Semi-supervised learning HILANG.** Grep `semi-supervised|semi supervised|pseudo-label|pseudo label|label propagation|self-training|self training` di 5 TS M3 = **0 kemunculan**. Spec M3 menyebut "semi-supervised" eksplisit. Sistem fraud nyata: banyak data tanpa label, sedikit label review manusia (mahal, terlambat, negatif belum tentu bersih). Tanpa ini tidak ada jembatan dari screening unsupervised ke model yang memakai hasil review manusia. **Yang ditambahkan:** sublesson/praktik — 10.000 transaksi tanpa label + 200 hasil review (150 train / 50 validasi / 9.800 unlabeled); bandingkan supervised baseline 150 label vs pseudo-labeling (threshold ≥0,95/≤0,05) vs label propagation pada graf akun-device vs retrain; risiko pseudo-label salah memperkuat bias + validasi harus pakai label independen. Contoh angka Luna: 200 label awal (30 fraud), baseline menangkap 18/30; setelah pseudo-labeling 2.000 kasus confidence tinggi, recall naik tapi FP berubah — angka ini CONTOH, wajib dihitung ulang/diilustrasikan jujur bila dipakai (bukan angka notebook).

**G2 — Community detection TIPIS (definisi saja, tanpa metode/praktik).** `community` di M3.2 hanya di daftar langkah (:17), eyebrow (:42), dan definisi yang diperbaiki pasca-F9 (:45: "didefinisikan oleh modularitas"). Grep `louvain|leiden|modularity|modularitas` = **1** (kata "modularitas" di definisi itu sendiri). Lab hanya adjacency + degree + connected components via BFS (:21, :195–198). Spec M3 menyebut graph features "degree, shared device/IP, community" — component ≠ community (satu component bisa memuat beberapa ring/keluarga/kantor). **Yang ditambahkan:** contoh kecil 2 community dalam 1 component (A: 6 akun padat, B: 5 akun padat, 1–2 bridge); satu metode yang bisa dijelaskan (Louvain/Leiden atau label propagation; modularity sebagai ukuran kualitas); praktik: community ID, size, internal/external degree, internal/external edge ratio, fraud rate per community; masukkan `community_size` + `internal_density` sebagai fitur model; bandingkan component-only vs +degree vs +community; peringatan community ID tidak stabil antar-run, jangan diperlakukan sebagai kategori permanen tanpa alignment antarperiode.

**G4 — Rolling velocity TIPIS (konsep ada, implementasi transaksi berjendela tidak dilatih).** Lesson sudah mengajarkan konsep jendela dengan baik (:52 "1 jam atau 24 jam untuk transaksi kartu (real-time)"; :378 "bukan V bulanan UCI"; :394/:396 nasabah D 40 transaksi/24 jam) dan jujur bahwa "UCI tidak punya stempel waktu transaksi" (1 kemunculan). Tapi lab hanya menghitung V bulanan dari 3 nasabah × 6 bulan pembayaran (:215). Tidak ada `groupby` timestamp, rolling window, atau alert berbasis waktu. Spec: "velocity analysis (lonjakan frekuensi transaksi)". **Yang ditambahkan:** data transaksi sintetis (account_id, device_id, timestamp, merchant_id, amount, label fraud hanya untuk evaluasi); latihan rolling 1 jam/24 jam (count, unique merchant, unique tujuan, total amount, device per account 7 hari, rasio vs baseline pribadi); ambang contoh (≥10 transaksi/1 jam, ≥5 merchant unik/1 jam, total 24 jam > NT$100.000 — [ilustrasi], kalibrasi vs kapasitas review); kenapa ambang harus dikalibrasi.

**G5 — Capstone integrasi end-to-end HILANG.** Tidak ada latihan yang menggabungkan seluruh sinyal M3 ke satu pipeline (satu cutoff waktu, satu model, satu keputusan triase). M3.5:326 menyebut GBM "23 fitur" tanpa pemetaan apakah 23 fitur itu mencakup graph/velocity/Benford/peer z-score/drift/anomaly/cluster — dan notebook M3.5 mengonfirmasi 23 fitur itu adalah fitur kredit kanonis (bukan sinyal M3). Risiko: pembelajar menghitung fitur dari periode berbeda, memakai fitur leakage, tidak tahu apakah tiap sinyal menambah lift, tidak bisa memberi reason codes. **Yang ditambahkan:** capstone M3 — dataset sintetis transaksi/akun/device dengan cutoff waktu; bangun semua fitur (anomaly score, cluster profile, degree/component/community, velocity 1j/24j, Benford deviation per segmen, UTIL/PAY_RATIO/BILL_TREND, peer z-score, profile drift); semua fitur hanya dari informasi sebelum cutoff; bandingkan model bertahap (baseline transaksi → +behavioral → +graph → +velocity → +anomaly/profile → full); evaluasi PR-AUC, precision@100, recall@100, FPR per grup, EV antrean, stabilitas antarperiode; tiap alert minimal 3 reason codes.

### Should-add

**G3 — Directed money-flow graph TIPIS.** Cerita pembuka ada dan terverifikasi verbatim (:32: "Lima akun — sebut saja K1 sampai K5... Rp50 juta masuk ke K1... pecah ke K2 dan K3..."). Tapi grep `fan-in|fan-out|in-degree|out-degree|directed|berarah|aliran dana` = **0**. Praktik graf hanya tabel akun-device (8 akun, 3 device). Mule bisa memakai device berbeda; pola uang masuk-keluar cepat sering lebih informatif dari jumlah koneksi. **Yang ditambahkan:** dataset transaksi kecil (from/to/amount/timestamp, contoh K1→K2 50 jt dst.); bangun directed weighted graph; hitung in/out-degree, in/out-flow, counterpart, fan-in/fan-out, rasio dana keluar/masuk, median waktu mengendap, hop ke tujuan eksternal; identifikasi kandidat mule; bandingkan fitur money-flow vs shared-device; batasi edge pada cutoff waktu (cegah leakage).

**G6 — Pemetaan outcome fraud vs default TIPIS.** Grep `confirmed fraud|chargeback|dispute|unresolved` = **0**. Lesson jujur bahwa "Label UCI adalah default bulan berikutnya … BUKAN fraud" (M3.1) dan "73,60% yang di-flag TERNYATA lancar" (M3.4), tapi M3.5 memakai default sebagai TP + "biaya default terlewat" dalam ekonomi triase tanpa pemetaan outcome fraud. Pembelajar bisa menganggap precision default = precision fraud. **Yang ditambahkan:** tabel label operasional (confirmed fraud = positive; legitimate after review = negative; unresolved = jangan langsung negatif; default tanpa bukti fraud = outcome credit risk, bukan fraud; chargeback = proxy dengan caveat); contoh dua label — precision default bisa 0,60 sementara precision confirmed fraud hanya 0,12; EV fraud dan EV default memakai biaya berbeda.

**G7 — Kurva keputusan threshold TIPIS.** Hanya ada formula EV(k) (:74) + titik precision@100/500/1000 + EV marginal. Tidak ada evaluasi seluruh ranking atau pencarian threshold/kapasitas sistematis. **Yang ditambahkan:** lab — urutkan 6.000 skor; hitung cumulative TP, precision@k, recall@k, EV(k), EV marginal(k), workload per k; plot EV(k) tandai kapasitas 500/1.000 + titik EV marginal ≤ biaya review; uji sensitivitas biaya review (NT$200 / 1.000 / 5.000); pembelajar memilih kebijakan + menjelaskan konsekuensi bisnisnya.

### Nice-to-have

**G8 — Benford eligibility + multiple testing TIPIS.** Grep `multiple testing|benjamini|fdr|orde magnitudo|minimum n` = **0**. Lesson sudah menjelaskan harga/limit/angka bulat tidak wajib mengikuti Benford, tapi belum ada prosedur formal kelayakan dataset sebelum chi-square. **Yang ditambahkan:** checklist kelayakan (rentang log10, proporsi angka bulat, pisahkan angka yang dibatasi aturan, minimum n, koreksi multiple testing mis. Benjamini–Hochberg, laporkan effect size + CI + jumlah segmen); contoh: 100 merchant, 12 dengan p<0,05, setelah FDR hanya 2 signifikan, effect size hanya 1 cukup besar untuk audit.

## Rekap

| No. | Gap | Prioritas | Status |
|---:|---|---|---|
| G1 | Semi-supervised learning | must-add | HILANG |
| G2 | Community detection (metode + praktik) | must-add | TIPIS |
| G3 | Directed money-flow graph | should-add | TIPIS |
| G4 | Rolling velocity (implementasi transaksi) | must-add | TIPIS |
| G5 | Capstone integrasi end-to-end | must-add | HILANG |
| G6 | Pemetaan outcome fraud vs default | should-add | TIPIS |
| G7 | Kurva keputusan threshold (EV(k) penuh) | should-add | TIPIS |
| G8 | Benford eligibility + multiple testing | nice-to-have | TIPIS |

**Kesimpulan Luna (disetujui induk):** M3 kuat pada konsep individual, angka kanonis, caveat, dan lab dasar. Gap paling kritis: semi-supervised, rolling velocity, dan capstone integrasi. Tanpa ketiganya pembelajar paham komponen M3 tapi belum dilatih membangun sistem triase fraud end-to-end dari sinyal tanpa label menuju keputusan bisnis.
