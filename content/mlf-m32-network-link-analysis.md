# MLF-M3.2: Network & Link Analysis — Graph Features di Dalam Model

## Masalah: Lima Akun, Satu Device, Uang yang Berputar

Lima akun — K1 sampai K5 — tidak pernah bertemu, tapi semuanya login dari satu device yang sama. Rp50 juta masuk ke K1 Senin pagi, pecah ke K2 dan K3 siang harinya, berkumpul lagi di K5 sebelum tengah malam, lalu hilang. Tidak satu pun dari lima akun itu yang perilakunya, sendirian, tampak aneh. Yang aneh adalah hubungannya. Itulah fraud ring — dan mule account adalah akun yang dipakai memindahkan uang hasil fraud: dana masuk lalu keluar dengan cepat, dan akun itu berbagi device (atau IP) dengan akun-akun lain yang juga bergerak cepat.

---

## 1. Graf: Node, Edge, Degree, Component, Community

Graf mengubah tabel akun-device menjadi peta. Node adalah akun. Edge adalah hubungan: dua akun terhubung bila berbagi minimal satu device. Degree adalah jumlah akun lain yang terhubung dengan satu akun. Connected component adalah kelompok akun yang saling terjangkau lewat edge. Community adalah kelompok node yang jauh lebih rapat terhubung ke dalam daripada ke luar — ia bisa berada di dalam satu component, dan satu component bisa memuat beberapa community (bukan subtype component: didefinisikan modularitas, bukan keterjangkauan).

**Nilai [lab]:** data sintetis (seed 42, 2.000 akun, 400 device) pecah menjadi 395 component; terbesar 19 akun (ukuran device ring: 8, 16, 16, 16, 17, 19). Sebanyak 1.470 akun di component berukuran [5, ∞) dengan fraud rate 0,0422; 530 akun di component [1, 5) dengan fraud rate 0,0189.

**Gambar (contoh A — bukan tabel lab; Lab 1 memakai contoh B):** diagram bipartit — device D1 terhubung ke A1, A2, A3; D2 ke A3, A4, A5; device ring R ke R1–R4. A3 ber-degree 4 (jembatan dua device); tiap anggota ring ber-degree 3. Di contoh B (Lab 1), A3 ber-degree 5 — jangan campur angka keduanya.

**Baik/buruk:** component bagus untuk menemukan kelompok dari data tanpa label kelompok. Buruk bila dibaca sebagai bukti kesamaan perilaku — satu component hanya berkata akun-akun itu terhubung lewat device.

**Mitigasi:** laporkan ukuran component bersama fraud rate-nya, dan bandingkan dengan base rate (0,036).

---

## 2. Pola Fraud Ring & Mule Account

Ring: sekelompok akun yang bekerja sama, masing-masing tampak normal, bersama-sama membentuk pola. Mule: akun yang dipakai memindahkan uang — dana masuk lalu keluar dengan cepat, berbagi device/IP dengan akun lain yang juga bergerak cepat. Mule sering kali akun orang sungguhan yang «dipinjam».

**Nilai [lab]:** ring 60 akun di 6 device, 36 di antaranya fraud (0,60); di luar ring hanya 36 dari 1.940 yang fraud (0,0186) — fraud di ring 32,3 kali lebih pekat.

**Baik/buruk:** pola ring bagus sebagai prior («periksa lebih dulu»). Buruk sebagai vonis — satu device bersama bisa berarti satu keluarga, satu kantor, atau satu warnet.

**Mitigasi:** jadikan pola jaringan sebagai fitur model dan antrean pemeriksaan manusia — bukan keputusan otomatis. Pelengkapnya: velocity (MLF-M3.3).

---

## 3. Graph Features sebagai Input Model (USP)

Tiga angka dihitung dari graf untuk tiap akun, lalu masuk sebagai fitur logistic regression — berdampingan dengan fitur transaksi biasa:

- **degree** = jumlah akun lain yang berbagi ≥ 1 device dengan akun itu.
- **maxshare** = ukuran device terbesar yang dipakai akun itu.
- **component size** = ukuran connected component akun itu.

**Nilai [lab]:** mean degree fraud 10,42 vs legit 5,12 (median 11,5 vs 5,0; selisih 5,30). Model memakai lima fitur — dua dasar (txn_count + log amount) dan tiga graph features — dengan StandardScaler + LogisticRegression yang sama untuk kedua model.

**Baik/buruk:** bagus bila hubungan memang membawa sinyal dan fitur dihitung dari relasi yang tersedia saat keputusan dibuat. Buruk bila fitur graf dihitung dari label masa depan (leakage).

**Mitigasi:** bangun graf hanya dari relasi yang diketahui pada cutoff; periksa duplikasi antar fitur sebelum membanggakan jumlahnya.

---

## 4. Evaluasi: ROC-AUC dengan vs tanpa Fitur Graf

Aturan keras: SATU split, SATU test set. Train 75% (1.500 akun, 54 fraud), test 25% (500 akun, 18 fraud), stratified, seed 42.

**Nilai [lab]:** ROC-AUC test LR dasar (2 fitur) 0,6387 — hanya sedikit di atas acak 0,5. LR + graph features (5 fitur) 0,8204. Lift +0,1817 (0,8204 − 0,6387). Koefisien (per 1 simpangan baku): dasar — txn_count 0,0791, log amount −0,0579 (keduanya kecil); +graph — degree 0,2877, maxshare 0,2877, component size 0,2877 (OR ketiganya 1,3334).

**Gambar:** bar ROC-AUC — dasar 0,6387 vs +graph 0,8204, garis acak 0,5, test set sama (500 akun, 18 fraud).

**Baik/buruk:** perbandingan ini bagus karena berpasangan (test set sama). Buruk bila angka absolutnya dibaca sebagai janji produksi — test set hanya berisi 18 fraud, jadi 0,8204 punya ketidakpastian lebar.

**Mitigasi:** laporkan selalu pasangan angka bersama ukuran test set; ulangi pada split berbeda sebelum mengklaim lift yang stabil.

---

## 5. Batasan & Kejujuran Data

**Pertama, data:** dataset UCI TIDAK punya kolom device/IP — graf di lesson ini TIDAK dibangun dari data nyata. Data sintetis [lab]: seed 42, 2.000 akun, 400 device, ring 60 akun di 6 device, peluang fraud ring 0,60 dan luar ring 0,02, txn_count ~ Poisson(28), amount ~ lognormal(10,0; 0,6). Yang transfer adalah METODENYA (adjacency, BFS, degree/component sebagai fitur). Angkanya tidak transfer.

**Kedua, fitur:** setiap akun memakai tepat satu device — jadi maxshare SAMA DENGAN component size, dan degree SAMA DENGAN component size − 1, untuk setiap akun. Itulah kenapa ketiga koefisien graf sama persis (0,2877): satu sinyal yang ditulis tiga kali.

**Ketiga, flag:** component [5, ∞) menandai 62 dari 72 fraud — tapi dari 1.470 akun di component itu, 1.408 adalah legit (95,8%). Flag menaikkan peluang fraud dari 0,036 menjadi 0,0422 — naik, tapi tetap kecil. Flag adalah antrean pemeriksaan, bukan keputusan.

---

## 6. Community Detection

Satu component bisa memuat beberapa community. Contoh kecil [ilustrasi] (tanpa RNG): 11 akun, 27 edge, 1 component — tapi 2 community. Community A: A1–A6 saling terhubung semua (klik, 15 edge). Community B: B1–B5 saling terhubung semua (klik, 10 edge). Dua jembatan: A6–B1 dan A2–B2. Fraud: A1, A2, A3 (A fraud 0,50; B fraud 0,00; component keseluruhan 0,2727).

**Nilai [ilustrasi]:** modularity partisi A/B = 0,4088 (Q di atas 0,30 = struktur community nyata, heuristik); partisi 1 community = 0,0000. Per community: A — size 6, internal 15, external 2, density 1,0000, fraud 0,50. B — size 5, internal 10, external 2, density 1,0000, fraud 0,00. Louvain fase-1 menemukan A/B persis dalam 2 pass (Q 0,4088). Label propagation: urutan A1→B5 runtuh jadi 1 community (Q 0,0); urutan B5→A1 menemukan A/B persis (Q 0,4088); tie acak 10 run — A1–A6 stabil 10/10, B1–B5 flip sebagai blok (3/10 gabung A, 7/10 tetap B).

**Praktik:** community menjadi fitur (community_size + internal_density). Di data sintetis M3.2: dasar 0,6387; +component 0,8205; +degree 0,8204; +community (7 fitur) 0,8210 [lab] — naik 0,0006. Kejujuran: community = component untuk 100 persen akun (395 community = 395 component), internal_density rata-rata 0,9935 — karena tiap akun memakai tepat 1 device, satu component tidak pernah memuat dua community padat. Community baru bernilai bila satu component memuat beberapa community padat.

**Baik/buruk:** community bagus bila memecah component besar menjadi kelompok yang perilakunya berbeda (0,50 vs 0,00 — sinyal yang component sembunyikan). Buruk bila community ID dipakai mentah sebagai fitur kategorikal — ID tidak stabil antar-run.

**Mitigasi:** jalankan deteksi beberapa kali, pakai hanya community yang stabil; laporkan modularity bersama fraud rate per community; pakai community_size dan internal_density, bukan nomor community.

---

## 7. Directed Money-Flow

Graf sejauh ini tidak berarah — edge hanya berkata «berbagi device». Money-flow menambahkan arah: dari siapa, ke siapa, berapa, kapan. Dataset kecil [ilustrasi]: rantai K1–K5 (EXT→K1 Rp50jt 08:00; K1→K2 Rp20jt 09:15; K1→K3 Rp30jt 10:00; K2→K4 Rp18jt 13:00; K3→K4 Rp25jt 14:30; K4→K5 Rp40jt 17:00; K5→EXT Rp38jt 23:00) dan normal K6–K8 (K6→K7 Rp5jt 09:00; K7→K6 Rp2jt 15:00; K6→K8 Rp3jt 11:00; K8→K6 Rp1jt 16:00; K7→K8 Rp4jt 12:00).

**Nilai [ilustrasi]:** K1 masuk 50jt/keluar 50jt, rasio 1,00, dwell median 98 mnt, hop ke EXT 4. K2 20/18, rasio 0,90, dwell 225 mnt, hop 3. K3 30/25, rasio 0,83, dwell 270 mnt, hop 3. K4 masuk 43jt (fan-in 2)/keluar 40jt, rasio 0,93, dwell 150 mnt, hop 2. K5 40/38, rasio 0,95, dwell 360 mnt, hop 1. Normal: K6 3/8, rasio 2,67 (mengeluarkan lebih dari yang masuk — belanja uang sendiri); K7 5/6, rasio 1,20; K8 7/1, rasio 0,14 (uang mengendap). Dwell = median waktu antara dana masuk dan keluar berikutnya; hop ke EXT = edge terpendek ke tujuan eksternal.

**Cutoff 18:00 (cegah leakage):** K5 keluar 0jt, rasio 0,00, hop None — tampak seperti SINK, bukan mule. K1–K4 hop semua None: seluruh rantai exit tidak terlihat dari cutoff. Memakai transaksi 23:00 untuk menilai K5 pada 18:00 adalah leakage — model «tahu» masa depan. Aturan: edge dibatasi cutoff waktu keputusan; fitur hanya dari transaksi ≤ cutoff.

**Baik/buruk:** money-flow bagus bila transaksi punya arah dan waktu tepercaya — menangkap pola yang device tidak lihat (K1–K5 tidak berbagi device). Buruk bila cutoff diabaikan, atau rasio dibaca tanpa dwell: rasio 1,00 dengan dwell 30 hari adalah pedagang, bukan mule.

**Mitigasi:** tetapkan cutoff SEBELUM menghitung fitur; laporkan dwell bersama rasio — selalu berpasangan.

---

## Lab 1: Adjacency & Degree

8 akun, 3 device (sintetis [lab]): D1 = A1, A2, A3, A4; D2 = A3, A5, A6; D3 = A7, A8. A3 jembatan (degree 5); A7 dan A8 degree 1. Degrees: [3, 3, 5, 3, 2, 2, 1, 1].

## Lab 2: Connected Components dengan BFS + Community Detection

Graf yang sama: 2 component — {A1, A2, A3, A4, A5, A6} berukuran 6 dan {A7, A8} berukuran 2. Component terbesar: 6 akun. Tanpa A3 sebagai jembatan, D1 dan D2 akan menjadi dua component terpisah (4 dan 3).

Bagian 2 — community pada contoh 11 akun [ilustrasi]: Q(A/B) = 0,4088; Q(1 community) = 0,0000; label propagation A1→B5 = 1 community, B5→A1 = 2 community; Louvain (2 pass) menemukan A/B persis, Q = 0,4088.

## Mini-case: 100 Slot Pemeriksaan

Tim fraud memeriksa 100 akun/minggu. Opsi A (100 akun acak): harapan fraud 100 × 0,036 = 3,6 akun. Opsi B (100 akun dari component [5, ∞)): harapan 100 × 0,0422 = 4,22 akun — hanya lebih baik 0,62 akun. Opsi C (100 akun skor model +graph tertinggi, ROC-AUC 0,8204 [lab]): ranking-nya jauh lebih baik — gabungan degree + component + transaksi mengalahkan satu flag kasar. Dan: flag component [5, ∞) menangkap 62 dari 72 fraud — 10 fraud lolos (72 − 62 = 10).

## Guided Task di Colab

Notebook: colab/mlf-m32-guided-task.ipynb — data sintetis yang sama persis (seed 42), adjacency dengan dict + BFS (tanpa library graf), degree/maxshare/component size, LR dasar 0,6387 vs +graph 0,8204 (lift +0,1817, test set sama), lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/1A1pQaybbkO5nqqUhLm7lFFm-waWs1bYx

## Rangkuman

- Graf: node = akun, edge = berbagi ≥ 1 device; degree, maxshare, component size adalah tiga fitur dari graf.
- Ring sintetis [lab]: 60 akun di 6 device, 36 fraud (0,60) vs 0,0186 di luar ring; component terbesar 19 akun; 1.470 akun di component [5, ∞) dengan fraud rate 0,0422 vs 0,0189 di [1, 5).
- Mean degree fraud 10,42 vs legit 5,12 [lab] — sinyal kelompok, bukan vonis individu.
- LR dasar ROC-AUC test 0,6387 vs LR + graph features 0,8204 — lift +0,1817 pada test set yang sama (500 akun, 18 fraud) [lab].
- Ketiga koefisien graf sama persis (0,2877, OR 1,3334) — satu sinyal yang ditulis tiga kali, karena satu device per akun.
- Data sintetis: metodenya transfer, angkanya tidak. Flag component [5, ∞) hanya menaikkan prior 0,036 → 0,0422 — 95,8 persen akun yang ter-flag adalah legit.
- Lab: adjacency → degree (A3 tertinggi, 5); BFS → 2 component (6 dan 2 akun), terbesar 6; community: Q(A/B) 0,4088, LP 1 vs 2 community menurut urutan, Louvain menemukan A/B persis (Q 0,4088).
- Community [ilustrasi]: 11 akun, 27 edge, 1 component berisi 2 community — A fraud 0,50 vs B 0,00; +community hanya menaikkan ROC-AUC 0,8204 → 0,8210 di data M3.2 karena community = component untuk 100 persen akun.
- Directed money-flow [ilustrasi]: rantai K1–K5 rasio keluar/masuk 0,83–1,00 dengan dwell 98–360 mnt; dari cutoff 18:00, K5 tampak seperti sink (rasio 0,00) — memakai transaksi 23:00 untuk menilai 18:00 adalah leakage.
