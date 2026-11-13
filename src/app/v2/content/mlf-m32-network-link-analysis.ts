import type { V2Lesson } from "../lib/types";

export const mlfM32: V2Lesson = {
  slug: "mlf-m32-network-link-analysis",
  track: "Machine Learning Finance",
  module: "Unsupervised — fraud",
  title: "MLF-M3.2 — Network & Link Analysis: Graph Features di Dalam Model",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M3 adalah pendalaman fraud: dari model yang menilai satu akun sendirian, ke model yang melihat hubungan antar akun — siapa berbagi device dengan siapa, siapa berada di component yang sama, dan siapa bagian dari satu ring.",
        "Tujuan lesson ini:",
        "• Menjelaskan graf: node, edge, degree, component, dan community — dengan gambar dan angka.",
        "• Mengenali pola fraud ring dan mule account: shared device/IP, dan uang yang masuk lalu keluar dengan cepat.",
        "• Menghitung tiga graph features — degree, maxshare, component size — dan memasukkannya sebagai INPUT model, bukan sekadar visualisasi.",
        "• Membandingkan logistic regression dasar vs dasar + graph features pada test set YANG SAMA — dan membaca lift-nya dengan jujur.",
        "• Menjalankan dua lab dari nol: adjacency dan degree, lalu connected components dengan BFS — diperluas ke community detection (Louvain dan label propagation) dan modularity.",
        "• Menjelaskan community detection: dua kelompok padat di dalam satu component, modularity sebagai ukuran, dan kenapa community ID tidak stabil antar-run.",
        "• Membaca directed money-flow: arah uang (in/out-flow, rasio, dwell, hop ke tujuan eksternal) dan kenapa edge harus dibatasi cutoff waktu.",
        "Isi lesson: cerita fraud ring → graf → pola ring & mule → graph features → evaluasi → batasan & kejujuran data → 2 lab → community detection → directed money-flow → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Semua angka lesson ini berasal dari data sintetis [lab] — dibangkitkan dengan seed 42, 2.000 akun, 400 device: fraud rate 0,036 (72 akun); ring 60 akun di 6 device, 36 di antaranya fraud (0,60); 395 component, terbesar 19 akun; LR dasar ROC-AUC test 0,6387; LR + graph features 0,8204. Dataset UCI yang dipakai modul lain TIDAK punya kolom device/IP — jadi graf di sini tidak bisa dibangun dari UCI; yang diajarkan adalah metodenya, dan angkanya adalah angka latihan [lab].",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Lima akun, satu device, uang yang berputar",
      prose: [
        "Bayangkan lima akun — sebut saja K1 sampai K5 — yang tidak pernah bertemu, tapi semuanya login dari satu device yang sama. Senin pagi, Rp50 juta masuk ke K1. Siang harinya uang itu pecah ke K2 dan K3. Sore harinya K2 dan K3 meneruskannya ke K4, dan sebelum tengah malam semuanya berkumpul lagi di K5 — lalu hilang ke luar sistem. Tidak satu pun dari lima akun itu yang perilakunya, sendirian, tampak aneh: jumlah transaksinya wajar, nominalnya wajar. Yang aneh adalah hubungannya.",
        "Itulah fraud ring: sekelompok akun yang bekerja sama, masing-masing tampak normal, tapi bersama-sama membentuk pola. Lawannya, mule account, adalah akun yang dipakai memindahkan uang hasil fraud — cirinya dana masuk lalu keluar dengan cepat, dan akun itu berbagi device (atau IP) dengan akun-akun lain yang juga bergerak cepat. Mule sering kali akun orang sungguhan yang «dipinjam» — jadi perilakunya mirip nasabah biasa, kecuali jejak hubungannya.",
        "Nilai: di data sintetis lesson ini [lab], ring yang ditanam terdiri dari 60 akun yang berbagi 6 device — dan 36 dari 60 akun itu fraud (0,60), sementara akun di luar ring hanya 36 dari 1.940 yang fraud (0,0186). Fraud di ring 32,3 kali lebih pekat daripada di luar ring. Itulah kenapa hubungan layak dihitung: sinyalnya tidak ada di satu akun, tapi ada di kelompoknya.",
        "Baik atau buruk: pola ring bagus dipakai sebagai prior — «akun ini berada di kelompok yang berisiko, periksa lebih dulu». Buruk dipakai sebagai vonis — «akun ini di component besar, jadi fraud». Satu device bersama bisa berarti satu keluarga yang berbagi HP, satu kantor, atau satu warnet — bukan selalu satu ring.",
        "Mitigasi: jadikan pola jaringan sebagai fitur model dan sebagai antrean pemeriksaan manusia — bukan sebagai keputusan otomatis. Model yang memakai fitur graf (langkah 4–5) tetap mengeluarkan probabilitas; manusia yang memutuskan tindakannya. Pola kecepatan uang (velocity) — berapa cepat dana masuk lalu keluar — adalah pelengkapnya, dan pengajaran penuhnya di MLF-M3.3.",
      ],
      tasks: [],
    },
    {
      id: "graf",
      eyebrow: "Langkah 3 · Graf: node, edge, degree, component, community",
      title: "Graf: dari daftar akun menjadi peta hubungan",
      prose: [
        "Community adalah kelompok node yang jauh lebih rapat terhubung ke dalam daripada ke luar — ia bisa berada di dalam satu component, dan satu component bisa memuat beberapa community. Community BUKAN subtype component: ia didefinisikan oleh modularitas (kepadatan internal vs eksternal), bukan oleh keterjangkauan lewat edge.",
        "Nilai: di data sintetis lesson ini [lab], graf 2.000 akun itu pecah menjadi 395 component. Component terbesar berisi 19 akun — dan itu salah satu device ring (ukuran device ring: 8, 16, 16, 16, 17, 19). Sebanyak 1.470 akun berada di component berukuran [5, ∞) — lebih dari tujuh dari sepuluh akun — dengan fraud rate 0,0422; sementara 530 akun berada di component berukuran [1, 5), dengan fraud rate 0,0189. Gambar di bawah menunjukkan cara membacanya pada contoh kecil — sebut saja contoh A (5 akun, 2 device, plus ring 4 akun) — yang BERBEDA dari tabel Lab 1 (contoh B: 8 akun, 3 device). Jangan campur angka degree keduanya: di contoh A, A3 ber-degree 4; di contoh B, A3 ber-degree 5.",
        "Gambar mentalnya: device adalah simpul penghubung. Akun yang memakai dua device — seperti A3 di gambar — adalah jembatan: ia menyatukan dua kelompok yang tanpanya akan terpisah. Ring adalah kasus ekstremnya: bila semua anggota berbagi SATU device yang sama — seperti R1–R4 di gambar, yang berbagi device R — tiap anggota terhubung langsung ke semua anggota lain, jadi degree tiap anggota = jumlah anggota − 1. Tapi di data sintetis lesson ini ring 60 akun tersebar di 6 device (ukuran 8, 16, 16, 16, 17, 19), jadi degree anggota = ukuran device-nya − 1, bukan 59: anggota device berukuran 8 ber-degree 7, anggota device berukuran 19 ber-degree 18.",
        "Baik atau buruk: component bagus dipakai untuk menemukan kelompok — ring, keluarga, kantor — dari data yang tidak punya label kelompok. Buruk bila component dibaca sebagai bukti kesamaan perilaku: satu component hanya berkata «akun-akun ini terhubung lewat device», bukan «akun-akun ini berbuat hal yang sama».",
        "Mitigasi: selalu laporkan ukuran component bersama fraud rate-nya, dan bandingkan dengan base rate. Component berukuran [5, ∞) di data sintetis ini [lab] punya fraud rate 0,0422 — di atas base rate 0,036, tapi hanya sedikit. Yang membuat component berguna bukan besarnya saja, melainkan kombinasi ukuran + degree + perilaku transaksinya — dan itulah yang dihitung langkah berikut.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram bipartit: device D1 terhubung ke akun A1, A2, A3; device D2 terhubung ke A3, A4, A5; device ring R terhubung ke R1, R2, R3, R4">
<text x="240" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Device menghubungkan akun — A3 adalah jembatan, R1–R4 adalah ring</text>
<rect x="328" y="28" width="144" height="140" rx="10" fill="none" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="400" y="22" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">RING</text>
<rect x="60" y="36" width="36" height="36" rx="6" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="78" y="58" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">D1</text>
<rect x="222" y="36" width="36" height="36" rx="6" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="240" y="58" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">D2</text>
<rect x="384" y="36" width="36" height="36" rx="6" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="402" y="58" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">R</text>
<line x1="48" y1="125" x2="78" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="108" y1="125" x2="78" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="168" y1="125" x2="78" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="168" y1="125" x2="240" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="228" y1="125" x2="240" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="288" y1="125" x2="240" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="348" y1="125" x2="402" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="384" y1="125" x2="402" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="420" y1="125" x2="402" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="456" y1="125" x2="402" y2="72" stroke="var(--chart-text)" stroke-width="1.5"/>
<circle cx="48" cy="140" r="15" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="48" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A1</text>
<circle cx="108" cy="140" r="15" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="108" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A2</text>
<circle cx="168" cy="140" r="15" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="168" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A3</text>
<circle cx="228" cy="140" r="15" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="228" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A4</text>
<circle cx="288" cy="140" r="15" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="288" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A5</text>
<circle cx="348" cy="140" r="15" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="348" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">R1</text>
<circle cx="384" cy="140" r="15" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="384" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">R2</text>
<circle cx="420" cy="140" r="15" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="420" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">R3</text>
<circle cx="456" cy="140" r="15" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="456" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">R4</text>
<text x="48" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=2</text>
<text x="108" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=2</text>
<text x="168" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=4</text>
<text x="228" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=2</text>
<text x="288" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=2</text>
<text x="348" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=3</text>
<text x="384" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=3</text>
<text x="420" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=3</text>
<text x="456" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d=3</text>
<text x="240" y="194" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">A3 memakai dua device (D1 dan D2) — ia jembatan antara dua kelompok.</text>
<text x="240" y="212" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">R1–R4 berbagi satu device R: tiap anggota ring ber-degree 3.</text>
</svg>`,
        alt: "Contoh A — diagram bipartit: device D1 terhubung ke akun A1, A2, A3; device D2 terhubung ke A3, A4, A5; device ring R terhubung ke R1, R2, R3, R4.",
        caption: "Cara membaca (contoh A — bukan tabel lab; Lab 1 memakai contoh B): kotak = device, lingkaran = akun, garis = akun memakai device itu; d = degree (jumlah akun lain yang berbagi ≥ 1 device). Interpretasi: A3 ber-degree 4 karena memakai dua device; tiap anggota ring ber-degree 3 karena berbagi satu device dengan tiga anggota lain.",
      },
      tasks: [],
    },
    {
      id: "graph-features",
      eyebrow: "Langkah 4 · Graph features sebagai input model",
      title: "Graph features: hubungan menjadi angka yang bisa dimodelkan",
      prose: [
        "Inilah USP modul ini: graf tidak berhenti sebagai gambar. Tiga angka dihitung dari graf untuk tiap akun, lalu dimasukkan sebagai fitur ke logistic regression — berdampingan dengan fitur transaksi biasa. Definisinya eksplisit, dan ketiganya bisa dihitung siapa saja dari tabel akun-device:",
        "• degree = jumlah akun lain yang berbagi ≥ 1 device dengan akun itu. Akun yang memakai device ramai punya degree besar.",
        "• maxshare = ukuran device terbesar yang dipakai akun itu. Akun yang pernah memakai device beranggotakan 19 akun punya maxshare 19 — meski device-nya yang lain kecil.",
        "• component size = ukuran connected component akun itu. Akun di component 19 punya component size 19, apa pun device yang ia pakai.",
        "Nilai: di data sintetis lesson ini [lab], mean degree akun fraud adalah 10,42 — sekitar dua kali mean degree akun legit, 5,12 (median 11,5 vs 5,0). Selisih 5,30 itu adalah sinyalnya: akun fraud, rata-rata, terhubung ke jauh lebih banyak akun lain. Tapi ingat — itu rata-rata. Ada akun legit ber-degree 18 (di device terbesar) dan akun fraud ber-degree kecil. Degree memisahkan kelompok, bukan memvonis individu.",
        "Model yang dibandingkan di langkah berikut memakai lima fitur — dua fitur dasar (txn_count + log amount) dan tiga graph features (degree, maxshare, component size). Jumlahnya harus cocok dengan kode: notebook memakai tepat lima kolom itu, tidak lebih, tidak kurang. StandardScaler diterapkan dulu (fitur dihitung per 1 simpangan baku), lalu LogisticRegression yang sama untuk kedua model.",
        "Baik atau buruk: graph features bagus bila hubungan memang membawa sinyal — shared device, shared IP, shared rekening tujuan — dan bila fitur itu dihitung SEBELUM split, dari relasi yang tersedia saat keputusan dibuat. Buruk bila fitur graf dihitung dari label masa depan — misal component yang dibangun dari transaksi sesudah tanggal prediksi — itu leakage, bukan sinyal.",
        "Mitigasi: bangun graf hanya dari relasi yang diketahui pada cutoff keputusan; hitung fitur graf dari train, terapkan aturannya ke test; dan periksa duplikasi antar fitur sebelum membanggakan jumlahnya — di data sintetis ini ketiga fitur graf ternyata membawa satu sinyal yang sama (langkah 6).",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: makin banyak graph features, makin baik",
        type: "pitfall",
        body: "Yang benar: nilai fitur graf ada pada sinyalnya, bukan jumlahnya. Tiga fitur yang saling menduplikasi tidak memberi model tiga kali informasi — model hanya membagi bobot yang sama ke ketiganya. Periksa korelasi antar fitur sebelum menambah kolom.",
      },
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 5 · Evaluasi: dengan vs tanpa fitur graf",
      title: "Evaluasi: lift +0,1817 — pada test set yang sama",
      prose: [
        "Eksperimennya hanya sah bila aturannya keras: SATU split, SATU test set untuk kedua model. Train 75 persen (1.500 akun, 54 fraud), test 25 persen (500 akun, 18 fraud), stratified, seed 42. Model dasar memakai dua fitur (txn_count + log amount). Model kedua memakai lima fitur (dua dasar + degree, maxshare, component size). Keduanya StandardScaler + LogisticRegression yang sama. Kalau skor naik, itu karena fiturnya — bukan karena test set-nya diganti.",
        "Nilai: ROC-AUC test model dasar 0,6387 [lab] — hanya sedikit di atas acak 0,5. Begitu tiga graph features masuk, ROC-AUC test menjadi 0,8204 [lab]. Selisihnya +0,1817 (0,8204 − 0,6387). Gambar di bawah menunjukkan lompatan itu. Perhatikan koefisiennya (per 1 simpangan baku) [lab]: model dasar — txn_count 0,0791, log amount −0,0579 — keduanya kecil, itulah kenapa model dasar hampir tidak membedakan fraud dari legit. Model +graph — degree 0,2877, maxshare 0,2877, component size 0,2877 (odds ratio ketiganya 1,3334) — sinyal graf yang mengangkat skor.",
        "Baik atau buruk: perbandingan ini bagus karena berpasangan — kedua model dinilai pada 500 akun test yang persis sama, jadi selisih +0,1817 adalah selisih yang bisa dipercaya arahnya. Buruk bila angka absolutnya dibaca sebagai janji produksi: test set hanya berisi 18 akun fraud, jadi ROC-AUC 0,8204 punya ketidakpastian yang lebar — satu-dua akun fraud yang pindah split bisa menggerakkan angka di belakang koma kedua.",
        "Mitigasi: laporkan SELALU pasangan angkanya bersama ukuran test set (500 akun, 18 fraud) — jangan pernah laporkan 0,8204 sendirian. Dan ulangi eksperimen pada split yang berbeda sebelum mengklaim lift yang stabil; lift pada satu split adalah bukti awal, bukan vonis akhir.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar ROC-AUC test: LR dasar 0,6387; LR plus graph features 0,8204; garis acak 0,5">
<text x="240" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ROC-AUC test: dasar vs dasar + graph features</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162" x2="52" y2="162" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="118" x2="52" y2="118" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="74" x2="52" y2="74" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="30" x2="52" y2="30" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="52" y1="118" x2="466" y2="118" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="112" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">acak 0,5</text>
<rect x="130" y="93.6" width="80" height="112.4" fill="var(--c1)"/>
<text x="170" y="89.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6387</text>
<rect x="270" y="61.6" width="80" height="144.4" fill="var(--c2)"/>
<text x="310" y="57.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,8204</text>
<text x="240" y="72" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+0,1817</text>
<text x="170" y="222" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">LR dasar (2 fitur)</text>
<text x="310" y="222" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">LR + graph (5 fitur)</text>
<text x="240" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">test set sama: 500 akun, 18 fraud [lab] · garis putus-putus = acak</text>
</svg>`,
        alt: "Bar ROC-AUC test: LR dasar 0,6387; LR plus graph features 0,8204; garis acak 0,5.",
        caption: "Cara membaca: tinggi bar = ROC-AUC test; garis putus-putus = model acak (0,5). Interpretasi: model dasar hanya sedikit di atas acak (0,6387); tiga graph features mengangkatnya ke 0,8204 — lift +0,1817 pada test set yang sama (500 akun, 18 fraud) [lab].",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: membandingkan ROC-AUC dari test set berbeda",
        type: "pitfall",
        body: "Yang benar: dua ROC-AUC hanya bisa dibandingkan bila dihitung pada test set yang sama. Model A di test Januari vs model B di test Februari bukan satu eksperimen — itu dua eksperimen. Di lesson ini kedua model dinilai pada 500 akun test yang persis sama, split yang sama, seed 42.",
      },
    },
    {
      id: "batasan",
      eyebrow: "Langkah 6 · Batasan & kejujuran data",
      title: "Batasan: data sintetis, sinyal tunggal, dan flag yang bukan vonis",
      prose: [
        "Tiga kejujuran yang wajib dipegang sebelum angka-angka lesson ini dipakai ke mana pun. Pertama, soal data: dataset UCI yang dipakai modul-modul lain TIDAK punya kolom device atau IP — jadi graf di lesson ini TIDAK dibangun dari data nyata. Data di sini sintetis [lab]: dibangkitkan dengan seed 42 — 2.000 akun, 400 device, ring 60 akun di 6 device, peluang fraud ring 0,60 dan luar ring 0,02, txn_count ~ Poisson(28), amount ~ lognormal(10,0; 0,6). Yang transfer ke pekerjaan nyata adalah METODENYA — adjacency dari shared device, BFS, degree/component sebagai fitur. Angkanya tidak transfer: fraud rate 0,036, ukuran component, dan ROC-AUC 0,8204 adalah angka latihan.",
        "Kedua, soal fitur: di data sintetis ini setiap akun memakai tepat satu device — jadi maxshare SAMA DENGAN component size, dan degree SAMA DENGAN component size − 1, untuk setiap akun. Itulah kenapa ketiga koefisien graph features sama persis (0,2877): ketiganya adalah satu sinyal yang sama yang ditulis tiga kali. Di data nyata satu akun bisa memakai banyak device, dan ketiga fitur itu akan berbeda — tapi pelajarannya tetap: periksa duplikasi fitur sebelum membanggakan jumlahnya.",
        "Ketiga, soal flag: component berukuran [5, ∞) menandai 62 dari 72 fraud [lab] — tapi dari 1.470 akun di component itu, 1.408 adalah legit (95,8 persen). Flag component ≥ 5 menaikkan peluang fraud dari 0,036 menjadi 0,0422 — naik, tapi tetap kecil. Membekukan 1.470 akun untuk menangkap 62 fraud berarti menghukum 1.408 nasabah sah. Flag adalah antrean pemeriksaan, bukan keputusan.",
        "Baik atau buruk: kejujuran ini bagus bila membuatmu bertanya «angka ini dihitung dari data apa, pada test set sebesar apa» sebelum mengutipnya. Buruk bila membuatmu membuang metodenya: lift +0,1817 pada test set yang sama adalah bukti bahwa hubungan antar akun membawa sinyal — bukti yang layak diuji ulang di data nyata, bukan diabaikan karena datanya sintetis.",
        "Mitigasi: di pekerjaan nyata, catat provenance setiap angka — sumber data, seed, ukuran test, dan definisi fitur — di samping angkanya. Bila satu dari empat itu tidak bisa dijawab, angka itu belum layak dikutip.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: component besar berarti fraud",
        type: "pitfall",
        body: "Yang benar: component berukuran [5, ∞) punya fraud rate 0,0422 [lab] — artinya dari 100 akun di component besar, sekitar 4 yang fraud dan 96 yang legit. Component besar menaikkan prior, bukan membuktikan apa pun tentang satu akun.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: bangun adjacency, hitung degree",
      prose: [
        "Sekarang giliranmu membangun graf dari nol. Datanya kecil dan sintetis [lab]: 8 akun, 3 device — D1 dipakai A1, A2, A3, A4; D2 dipakai A3, A5, A6; A3 memakai dua device, jadi ia jembatan; D3 dipakai A7, A8, terpisah dari yang lain.",
        "Tugasmu: lengkapi adjacency (akun → daftar akun lain yang berbagi ≥ 1 device), lalu hitung degree tiap akun. Perhatikan A3: ia berbagi D1 dengan A1, A2, A4 (3 tetangga) dan D2 dengan A5, A6 (2 tetangga) — total degree 5, tertinggi di graf kecil ini. A7 dan A8 masing-masing ber-degree 1: mereka hanya berbagi D3 satu sama lain.",
        "Perhatikan juga apa yang TIDAK dihitung di sini: tidak ada sklearn, tidak ada library graf — hanya dict dan loop, persis seperti notebook (dict + BFS). Itulah intinya: graph features adalah aritmetika atas tabel, bukan sihir library.",
        "Hasil lab ini menjadi input Lab 2: component dicari dari adjacency yang sama — jadi pastikan adjacency-mu benar sebelum lanjut.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi adjacency: bila a != b dan b belum ada di adj[a], tambahkan b" },
        { id: "t2", text: "Hitung degrees: degree tiap akun = jumlah tetangganya" },
        { id: "t3", text: "Jalankan dan baca degree tiap akun — A3 seharusnya tertinggi (5)" },
      ],
      expected: "A1: degree=3\nA2: degree=3\nA3: degree=5\nA4: degree=3\nA5: degree=2\nA6: degree=2\nA7: degree=1\nA8: degree=1",
      hints: [
        "Dua akun bertetangga bila muncul bersama di satu device — loop semua device, semua pasangan di dalamnya.",
        "Degree = len(adj[a]) — hitung setelah adjacency lengkap, bukan di tengah loop.",
      ],
      code: {
        starter: `# Data kecil: 8 akun, 3 device (sintetis, untuk latihan tangan)
devices = {
    "D1": ["A1", "A2", "A3", "A4"],
    "D2": ["A3", "A5", "A6"],
    "D3": ["A7", "A8"],
}
accounts = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]

# Bangun adjacency: akun -> daftar akun lain yang berbagi >=1 device
adj = {a: [] for a in accounts}
for members in devices.values():
    for a in members:
        for b in members:
            pass  # TODO: bila a != b dan b belum ada di adj[a], tambahkan b

# Degree tiap akun = jumlah tetangga
degrees = [0 for _ in accounts]  # TODO: degree = len(adj[a])

for a, d in zip(accounts, degrees):
    print(f"{a}: degree={d}")`,
        lockLines: 7,
        solution: `# Data kecil: 8 akun, 3 device (sintetis, untuk latihan tangan)
devices = {
    "D1": ["A1", "A2", "A3", "A4"],
    "D2": ["A3", "A5", "A6"],
    "D3": ["A7", "A8"],
}
accounts = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]

# Bangun adjacency: akun -> daftar akun lain yang berbagi >=1 device
adj = {a: [] for a in accounts}
for members in devices.values():
    for a in members:
        for b in members:
            if a != b and b not in adj[a]:
                adj[a].append(b)

# Degree tiap akun = jumlah tetangga
degrees = [len(adj[a]) for a in accounts]

for a, d in zip(accounts, degrees):
    print(f"{a}: degree={d}")`,
        checks: [
          { kind: "equal", task: "t2", name: "degrees", value: [3, 3, 5, 3, 2, 2, 1, 1], label: "`degrees` seharusnya [3, 3, 5, 3, 2, 2, 1, 1]", msg: "A3 ber-degree 5 — ia memakai dua device (D1 dan D2); A7 dan A8 ber-degree 1." },
          { kind: "stdout_matches", task: "t3", pattern: "A3: degree=5", label: "Output menampilkan A3: degree=5", msg: "A3 berbagi D1 dengan A1, A2, A4 dan D2 dengan A5, A6 — total 5 tetangga." },
          { kind: "stdout_matches", task: "t3", pattern: "A7: degree=1", label: "Output menampilkan A7: degree=1", msg: "A7 hanya berbagi D3 dengan A8 — component kecil yang terpisah." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: connected components dengan BFS + community detection",
      prose: [
        "Lab kedua mencari component dengan BFS — antrean sederhana: mulai dari satu akun, kunjungi semua tetangganya, lalu tetangga dari tetangga, sampai tidak ada lagi yang bisa dikunjungi. Itulah satu component. Ulangi dari akun yang belum dikunjungi sampai semua akun mendapat component.",
        "Datanya sama seperti Lab 1 — 8 akun, 3 device — supaya hasilnya bisa dibandingkan langsung. Graf kecil ini punya DUA component: {A1, A2, A3, A4, A5, A6} berukuran 6, dan {A7, A8} berukuran 2. A3-lah yang menyatukan enam akun pertama: tanpa A3 sebagai jembatan, D1 dan D2 akan menjadi dua component terpisah berukuran 4 dan 3.",
        "Hasilnya [lab]: component terbesar berisi 6 akun. Bandingkan dengan notebook: component terbesar di data sintetis 2.000 akun berisi 19 akun [lab] — dan 1.470 akun berada di component berukuran [5, ∞). Skalanya berbeda, caranya sama: BFS yang sama, definisi yang sama.",
        "Pelajaran lab ini: component bukan ditebak dari gambar — ia dihitung. Dan bila satu akun jembatan (seperti A3) dihapus, component besar bisa pecah menjadi dua — itulah kenapa akun jembatan layak diperiksa: ia menghubungkan kelompok yang tanpanya tidak terhubung.",
        "Bagian 2 — community detection pada contoh 11 akun dari langkah 9 [ilustrasi]: A1–A6 saling terhubung semua (klik, 15 edge), B1–B5 saling terhubung semua (klik, 10 edge), plus 2 jembatan (A6–B1, A2–B2) — total 27 edge, 1 component. Hitung modularity partisi A/B dan partisi 1 community; jalankan label propagation dua urutan (A1→B5 dan B5→A1) dan bandingkan jumlah community-nya; lalu jalankan Louvain fase-1 sederhana dan baca community-nya. Semua dengan stdlib saja — itertools untuk membangun klik, dict dan loop untuk sisanya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi BFS: kunjungi tetangga yang belum dikunjungi, masukkan ke queue" },
        { id: "t2", text: "Hitung sizes (ukuran tiap component) dan largest (terbesar)" },
        { id: "t3", text: "Jalankan dan baca component-nya — seharusnya 2 component, terbesar 6 akun" },
        { id: "t4", text: "Hitung modularity partisi A/B (q_ab) dan partisi 1 community (q_one)" },
        { id: "t5", text: "Jalankan label propagation dua urutan dan hitung jumlah community-nya (n_fwd, n_rev)" },
        { id: "t6", text: "Jalankan Louvain fase-1 dan hitung modularity hasilnya (q_louv)" },
      ],
      expected: "component 1: size=6 members=['A1', 'A2', 'A3', 'A4', 'A5', 'A6']\ncomponent 2: size=2 members=['A7', 'A8']\ncomponent terbesar: 6 akun\nQ(A/B) = 0.4088\nQ(1 community) = 0.0000\nlabel propagation A1->B5: 1 community\nlabel propagation B5->A1: 2 community\nLouvain (2 pass): [['A1', 'A2', 'A3', 'A4', 'A5', 'A6'], ['B1', 'B2', 'B3', 'B4', 'B5']]\nQ Louvain = 0.4088",
      hints: [
        "BFS: pop dari depan queue (pop(0)), tambah tetangga yang belum ada di visited.",
        "Component baru dimulai dari akun pertama yang belum dikunjungi — loop semua akun.",
      ],
      code: {
        starter: `# Data kecil: 8 akun, 3 device (sama seperti Lab 1)
devices = {
    "D1": ["A1", "A2", "A3", "A4"],
    "D2": ["A3", "A5", "A6"],
    "D3": ["A7", "A8"],
}
accounts = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]

# Adjacency (seperti Lab 1): akun -> akun lain yang berbagi >=1 device
adj = {a: [] for a in accounts}
for members in devices.values():
    for a in members:
        for b in members:
            if a != b and b not in adj[a]:
                adj[a].append(b)
for a in adj:
    adj[a] = sorted(adj[a])

# BFS: kunjungi tiap component yang belum dikunjungi
visited = set()
components = []
for start in accounts:
    if start in visited:
        continue
    queue = [start]
    visited.add(start)
    comp = []
    while queue:
        u = queue.pop(0)
        comp.append(u)
        for v in adj[u]:
            pass  # TODO: bila v belum dikunjungi, tandai dan masukkan ke queue
    components.append(sorted(comp))

sizes = [0 for _ in components]  # TODO: ukuran tiap component = len(c)
largest = 0  # TODO: ukuran component terbesar

for i, c in enumerate(components, start=1):
    print(f"component {i}: size={len(c)} members={c}")
print(f"component terbesar: {largest} akun")

# --- Bagian 2: community detection pada graf contoh 11 akun ---
# Community A: A1..A6 saling terhubung semua (klik, 15 edge)
# Community B: B1..B5 saling terhubung semua (klik, 10 edge)
# Jembatan: A6-B1 dan A2-B2. Total 27 edge, 1 component.
import itertools
accounts2 = ["A1", "A2", "A3", "A4", "A5", "A6", "B1", "B2", "B3", "B4", "B5"]
adj2 = {a: [] for a in accounts2}
for u, v in itertools.combinations(["A1", "A2", "A3", "A4", "A5", "A6"], 2):
    adj2[u].append(v); adj2[v].append(u)
for u, v in itertools.combinations(["B1", "B2", "B3", "B4", "B5"], 2):
    adj2[u].append(v); adj2[v].append(u)
for u, v in [("A6", "B1"), ("A2", "B2")]:
    adj2[u].append(v); adj2[v].append(u)

def modularity(adj, part):
    m = sum(len(v) for v in adj.values()) / 2
    q = 0.0
    comms = {}
    for node, c in part.items():
        comms.setdefault(c, []).append(node)
    for members in comms.values():
        s = set(members)
        lc = sum(1 for u in members for v in adj[u] if v in s) / 2
        dc = sum(len(adj[u]) for u in members)
        q += lc / m - (dc / (2 * m)) ** 2
    return q

true_part = {a: ("A" if a.startswith("A") else "B") for a in accounts2}
one_part = {a: "ALL" for a in accounts2}
q_ab = 0.0  # TODO: modularity partisi A/B
q_one = 0.0  # TODO: modularity bila 1 community
print(f"Q(A/B) = {q_ab:.4f}")
print(f"Q(1 community) = {q_one:.4f}")

def label_propagation(adj, order, max_iter=20):
    labels = {a: a for a in order}
    for _ in range(max_iter):
        changed = False
        for a in order:
            counts = {}
            for b in adj[a]:
                counts[labels[b]] = counts.get(labels[b], 0) + 1
            best = max(counts.values())
            cands = sorted([lab for lab, n in counts.items() if n == best])
            if len(cands) == 1:
                new = cands[0]
            elif labels[a] in cands:
                new = labels[a]
            else:
                new = cands[0]
            if new != labels[a]:
                labels[a] = new
                changed = True
        if not changed:
            break
    return labels

lp_fwd = label_propagation(adj2, accounts2)
lp_rev = label_propagation(adj2, list(reversed(accounts2)))
n_fwd = 0  # TODO: jumlah community hasil LP urutan A1..B5
n_rev = 0  # TODO: jumlah community hasil LP urutan B5..A1
print(f"label propagation A1->B5: {n_fwd} community")
print(f"label propagation B5->A1: {n_rev} community")

# Louvain fase-1 sederhana: pindahkan tiap akun ke community tetangga
# yang paling menaikkan modularity, ulangi sampai tidak ada yang pindah.
def louvain_phase1(adj, order):
    comm = {a: a for a in order}
    improved = True
    n_pass = 0
    while improved and n_pass < 10:
        improved = False
        n_pass += 1
        for a in order:
            cur = comm[a]
            cands = sorted({comm[b] for b in adj[a]} | {cur})
            best_c, best_gain = cur, 0.0
            for c in cands:
                if c == cur:
                    continue
                trial = dict(comm)
                trial[a] = c
                gain = modularity(adj, trial) - modularity(adj, comm)
                if gain > best_gain + 1e-12:
                    best_gain, best_c = gain, c
            if best_c != cur:
                comm[a] = best_c
                improved = True
    return comm, n_pass

louv_comm, n_pass = louvain_phase1(adj2, accounts2)
q_louv = 0.0  # TODO: modularity hasil Louvain
groups = {}
for a, c in louv_comm.items():
    groups.setdefault(c, []).append(a)
print(f"Louvain ({n_pass} pass): {sorted([sorted(v) for v in groups.values()])}")
print(f"Q Louvain = {q_louv:.4f}")`,
        lockLines: 17,
        solution: `# Data kecil: 8 akun, 3 device (sama seperti Lab 1)
devices = {
    "D1": ["A1", "A2", "A3", "A4"],
    "D2": ["A3", "A5", "A6"],
    "D3": ["A7", "A8"],
}
accounts = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]

# Adjacency (seperti Lab 1): akun -> akun lain yang berbagi >=1 device
adj = {a: [] for a in accounts}
for members in devices.values():
    for a in members:
        for b in members:
            if a != b and b not in adj[a]:
                adj[a].append(b)
for a in adj:
    adj[a] = sorted(adj[a])

# BFS: kunjungi tiap component yang belum dikunjungi
visited = set()
components = []
for start in accounts:
    if start in visited:
        continue
    queue = [start]
    visited.add(start)
    comp = []
    while queue:
        u = queue.pop(0)
        comp.append(u)
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                queue.append(v)
    components.append(sorted(comp))

sizes = [len(c) for c in components]
largest = max(sizes)

for i, c in enumerate(components, start=1):
    print(f"component {i}: size={len(c)} members={c}")
print(f"component terbesar: {largest} akun")

# --- Bagian 2: community detection pada graf contoh 11 akun ---
# Community A: A1..A6 saling terhubung semua (klik, 15 edge)
# Community B: B1..B5 saling terhubung semua (klik, 10 edge)
# Jembatan: A6-B1 dan A2-B2. Total 27 edge, 1 component.
import itertools
accounts2 = ["A1", "A2", "A3", "A4", "A5", "A6", "B1", "B2", "B3", "B4", "B5"]
adj2 = {a: [] for a in accounts2}
for u, v in itertools.combinations(["A1", "A2", "A3", "A4", "A5", "A6"], 2):
    adj2[u].append(v); adj2[v].append(u)
for u, v in itertools.combinations(["B1", "B2", "B3", "B4", "B5"], 2):
    adj2[u].append(v); adj2[v].append(u)
for u, v in [("A6", "B1"), ("A2", "B2")]:
    adj2[u].append(v); adj2[v].append(u)

def modularity(adj, part):
    m = sum(len(v) for v in adj.values()) / 2
    q = 0.0
    comms = {}
    for node, c in part.items():
        comms.setdefault(c, []).append(node)
    for members in comms.values():
        s = set(members)
        lc = sum(1 for u in members for v in adj[u] if v in s) / 2
        dc = sum(len(adj[u]) for u in members)
        q += lc / m - (dc / (2 * m)) ** 2
    return q

true_part = {a: ("A" if a.startswith("A") else "B") for a in accounts2}
one_part = {a: "ALL" for a in accounts2}
q_ab = modularity(adj2, true_part)
q_one = modularity(adj2, one_part)
print(f"Q(A/B) = {q_ab:.4f}")
print(f"Q(1 community) = {q_one:.4f}")

def label_propagation(adj, order, max_iter=20):
    labels = {a: a for a in order}
    for _ in range(max_iter):
        changed = False
        for a in order:
            counts = {}
            for b in adj[a]:
                counts[labels[b]] = counts.get(labels[b], 0) + 1
            best = max(counts.values())
            cands = sorted([lab for lab, n in counts.items() if n == best])
            if len(cands) == 1:
                new = cands[0]
            elif labels[a] in cands:
                new = labels[a]
            else:
                new = cands[0]
            if new != labels[a]:
                labels[a] = new
                changed = True
        if not changed:
            break
    return labels

lp_fwd = label_propagation(adj2, accounts2)
lp_rev = label_propagation(adj2, list(reversed(accounts2)))
n_fwd = len(set(lp_fwd.values()))
n_rev = len(set(lp_rev.values()))
print(f"label propagation A1->B5: {n_fwd} community")
print(f"label propagation B5->A1: {n_rev} community")

# Louvain fase-1 sederhana: pindahkan tiap akun ke community tetangga
# yang paling menaikkan modularity, ulangi sampai tidak ada yang pindah.
def louvain_phase1(adj, order):
    comm = {a: a for a in order}
    improved = True
    n_pass = 0
    while improved and n_pass < 10:
        improved = False
        n_pass += 1
        for a in order:
            cur = comm[a]
            cands = sorted({comm[b] for b in adj[a]} | {cur})
            best_c, best_gain = cur, 0.0
            for c in cands:
                if c == cur:
                    continue
                trial = dict(comm)
                trial[a] = c
                gain = modularity(adj, trial) - modularity(adj, comm)
                if gain > best_gain + 1e-12:
                    best_gain, best_c = gain, c
            if best_c != cur:
                comm[a] = best_c
                improved = True
    return comm, n_pass

louv_comm, n_pass = louvain_phase1(adj2, accounts2)
q_louv = modularity(adj2, louv_comm)
groups = {}
for a, c in louv_comm.items():
    groups.setdefault(c, []).append(a)
print(f"Louvain ({n_pass} pass): {sorted([sorted(v) for v in groups.values()])}")
print(f"Q Louvain = {q_louv:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "sizes", value: [6, 2], label: "`sizes` seharusnya [6, 2]", msg: "Component pertama berisi 6 akun (A1–A6), kedua 2 akun (A7–A8)." },
          { kind: "equal", task: "t3", name: "largest", value: 6, label: "`largest` seharusnya 6", msg: "Component terbesar berisi 6 akun." },
          { kind: "stdout_matches", task: "t3", pattern: "component terbesar: 6 akun", label: "Output menampilkan component terbesar: 6 akun", msg: "Format: component terbesar: {largest} akun." },
          { kind: "equal", task: "t4", name: "q_ab", value: 0.4088, tol: 0.0001, label: "`q_ab` seharusnya 0,4088", msg: "Modularity partisi A/B = 0,4088 — jauh di atas 0 (satu community)." },
          { kind: "equal", task: "t4", name: "q_one", value: 0.0, tol: 1e-9, label: "`q_one` seharusnya 0,0000", msg: "Satu community berarti tidak ada partisi — modularity-nya 0." },
          { kind: "equal", task: "t5", name: "n_fwd", value: 1, label: "`n_fwd` seharusnya 1", msg: "Urutan A1→B5: label A menyebar lewat jembatan — seluruh graf runtuh jadi 1 community." },
          { kind: "equal", task: "t5", name: "n_rev", value: 2, label: "`n_rev` seharusnya 2", msg: "Urutan B5→A1: A/B persis — urutan mengubah hasil label propagation." },
          { kind: "equal", task: "t6", name: "q_louv", value: 0.4088, tol: 0.0001, label: "`q_louv` seharusnya 0,4088", msg: "Louvain menemukan A/B persis (2 pass) — Q 0,4088, sama dengan partisi sejati." },
          { kind: "stdout_matches", task: "t6", pattern: "Q Louvain = 0.4088", label: "Output menampilkan Q Louvain = 0.4088", msg: "Format: Q Louvain = {q_louv:.4f}." },
        ],
      },
    },
    {
      id: "community",
      eyebrow: "Langkah 9 · Community detection",
      title: "Community detection: dua kelompok padat di dalam satu component",
      prose: [
        "Langkah 3 sudah mendefinisikan community — kelompok node yang jauh lebih rapat terhubung ke dalam daripada ke luar — dan membedakannya dari component. Langkah ini menghitungnya pada contoh kecil yang bisa diikuti dengan tangan: 11 akun, 27 edge, SATU component — tapi DUA community. Community A: A1–A6, semua saling terhubung (klik, 15 edge). Community B: B1–B5, semua saling terhubung (klik, 10 edge). Dua jembatan menghubungkan keduanya: A6–B1 dan A2–B2. Fraud: A1, A2, A3 (3 dari 6 di A = 0,50; 0 dari 5 di B = 0,00; component keseluruhan 3 dari 11 = 0,2727). Semua angka di langkah ini berasal dari graf yang didefinisikan eksplisit di sini [ilustrasi] — tanpa RNG — supaya siapa pun bisa menghitung ulang dengan tangan.",
        "Nilai: modularity partisi A/B adalah 0,4088 [ilustrasi] — jauh di atas 0, yang berarti partisi ini jauh lebih baik daripada menganggap semua 11 akun satu community (modularity 0,0000). Modularity mengukur: berapa banyak edge yang jatuh DI DALAM community, dibanding yang diharapkan bila edge dipasang acak dengan degree yang sama. Q di atas 0,30 biasanya dibaca sebagai struktur community yang nyata (heuristik, bukan hukum). Per community: A — size 6, internal 15 edge, external 2, internal density 1,0000 (semua pasangan di dalamnya bertetangga), fraud rate 0,50. B — size 5, internal 10, external 2, density 1,0000, fraud rate 0,00. Component keseluruhan menyembunyikan perbedaan ini: fraud rate 0,2727 adalah rata-rata dari 0,50 dan 0,00 — dan rata-rata itu tidak menggambarkan siapa pun.",
        "Metode yang diajarkan: Louvain sederhana fase-1 — mulai tiap akun di community-nya sendiri, lalu pindahkan tiap akun ke community tetangga yang paling menaikkan modularity, ulangi sampai tidak ada perpindahan yang menaikkan. Pada contoh ini Louvain menemukan A/B persis dalam 2 pass, Q 0,4088 [ilustrasi]. Louvain dipilih karena ia mengoptimalkan modularity secara langsung — tidak seperti label propagation di bawah, yang tidak punya fungsi tujuan.",
        "Label propagation dipakai di sini sebagai demo INSTABILITAS, bukan sebagai metode utama: tiap akun mengambil label yang paling banyak dipakai tetangganya, diulang sampai stabil. Urutan A1→B5: seluruh graf RUNTUH menjadi 1 community (Q 0,0) — label A menyebar lewat jembatan sebelum B sempat bertahan. Urutan B5→A1: A/B persis (Q 0,4088). Tie-breaking acak, 10 run: A1–A6 stabil 10/10 di A; B1–B5 flip sebagai satu blok — 3 dari 10 run gabung A, 7 dari 10 tetap B [ilustrasi]. Pelajarannya: community ID dari label propagation tidak stabil antar-run — dua run bisa memberi community yang berbeda untuk akun yang sama.",
        "Praktik: community menjadi fitur — community_size dan internal_density per akun. Di data sintetis M3.2 (generator notebook, seed 42, split sama): dasar 0,6387; +component 0,8205; +degree 0,8204; +community (7 fitur) 0,8210 [lab] — naik 0,0006 dari +degree. Dan inilah kejujuran yang wajib dicatat: community SAMA DENGAN component untuk 100 persen akun (395 community = 395 component), dan internal_density rata-rata 0,9935 — karena tiap akun di data ini memakai tepat 1 device, satu component tidak pernah memuat dua community padat. Community tidak menambah apa-apa di sini. Community baru bernilai bila satu component memuat beberapa community padat — seperti contoh A/B di atas, atau satu keluarga besar yang berbagi satu device ramai tapi terbagi menjadi dua kelompok transaksi yang berbeda.",
        "Baik atau buruk: community bagus bila ia memecah component besar menjadi kelompok yang perilakunya berbeda — fraud rate 0,50 vs 0,00 di contoh ini adalah sinyal yang component (0,2727) sembunyikan. Buruk bila community ID dipakai mentah-mentah sebagai fitur kategorikal: ID-nya tidak stabil antar-run (lihat label propagation di atas) dan tidak bermakna di luar run itu — yang stabil adalah UKURAN dan DENSITAS community-nya, bukan nomornya.",
        "Mitigasi: jalankan deteksi community beberapa kali (seed/urutan berbeda) dan pakai hanya community yang stabil; laporkan selalu modularity-nya (di sini 0,4088) bersama fraud rate per community; dan jangan pernah memakai community ID sebagai fitur — pakai community_size dan internal_density, yang didefinisikan dari struktur, bukan dari nomor run.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Dua community dalam satu component: A1 sampai A6 membentuk klik dengan 3 fraud, B1 sampai B5 membentuk klik tanpa fraud, 2 jembatan A6-B1 dan A2-B2">
<text x="240" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Satu component, dua community — A fraud 0,50, B fraud 0,00</text>
<line x1="80" y1="60" x2="130" y2="45" stroke="var(--c1)" stroke-width="1"/>
<line x1="80" y1="60" x2="180" y2="60" stroke="var(--c1)" stroke-width="1"/>
<line x1="80" y1="60" x2="180" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="80" y1="60" x2="130" y2="165" stroke="var(--c1)" stroke-width="1"/>
<line x1="80" y1="60" x2="80" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="130" y1="45" x2="180" y2="60" stroke="var(--c1)" stroke-width="1"/>
<line x1="130" y1="45" x2="180" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="130" y1="45" x2="130" y2="165" stroke="var(--c1)" stroke-width="1"/>
<line x1="130" y1="45" x2="80" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="180" y1="60" x2="180" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="180" y1="60" x2="130" y2="165" stroke="var(--c1)" stroke-width="1"/>
<line x1="180" y1="60" x2="80" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="180" y1="150" x2="130" y2="165" stroke="var(--c1)" stroke-width="1"/>
<line x1="180" y1="150" x2="80" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="130" y1="165" x2="80" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="300" y1="60" x2="350" y2="45" stroke="var(--c1)" stroke-width="1"/>
<line x1="300" y1="60" x2="400" y2="60" stroke="var(--c1)" stroke-width="1"/>
<line x1="300" y1="60" x2="400" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="300" y1="60" x2="300" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="350" y1="45" x2="400" y2="60" stroke="var(--c1)" stroke-width="1"/>
<line x1="350" y1="45" x2="400" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="350" y1="45" x2="300" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="400" y1="60" x2="400" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="400" y1="60" x2="300" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="400" y1="150" x2="300" y2="150" stroke="var(--c1)" stroke-width="1"/>
<line x1="80" y1="150" x2="300" y2="60" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="130" y1="45" x2="350" y2="45" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5 4"/>
<circle cx="80" cy="60" r="14" fill="var(--c4)" stroke="var(--c4)" stroke-width="2"/>
<text x="80" y="64" text-anchor="middle" font-size="11" fill="#fff" font-family="var(--font-ui)" font-weight="600">A1</text>
<circle cx="130" cy="45" r="14" fill="var(--c4)" stroke="var(--c4)" stroke-width="2"/>
<text x="130" y="49" text-anchor="middle" font-size="11" fill="#fff" font-family="var(--font-ui)" font-weight="600">A2</text>
<circle cx="180" cy="60" r="14" fill="var(--c4)" stroke="var(--c4)" stroke-width="2"/>
<text x="180" y="64" text-anchor="middle" font-size="11" fill="#fff" font-family="var(--font-ui)" font-weight="600">A3</text>
<circle cx="180" cy="150" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="180" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A4</text>
<circle cx="130" cy="165" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="130" y="169" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A5</text>
<circle cx="80" cy="150" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="80" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A6</text>
<circle cx="300" cy="60" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="300" y="64" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">B1</text>
<circle cx="350" cy="45" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="350" y="49" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">B2</text>
<circle cx="400" cy="60" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="400" y="64" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">B3</text>
<circle cx="400" cy="150" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="400" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">B4</text>
<circle cx="300" cy="150" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="300" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">B5</text>
<text x="130" y="196" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Community A · 6 akun · fraud 0,50</text>
<text x="350" y="196" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Community B · 5 akun · fraud 0,00</text>
<text x="240" y="216" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Garis putus-putus = 2 jembatan (A6–B1, A2–B2) — tanpa keduanya, graf pecah jadi 2 component.</text>
<text x="240" y="232" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Lingkaran terisi = fraud (A1, A2, A3). Modularity partisi A/B = 0,4088.</text>
</svg>`,
        alt: "Dua community dalam satu component: A1 sampai A6 membentuk klik dengan 3 fraud, B1 sampai B5 membentuk klik tanpa fraud, 2 jembatan A6-B1 dan A2-B2.",
        caption: "Cara membaca: tiap garis = satu edge (berbagi device); dua klik padat dihubungkan hanya 2 jembatan. Interpretasi: component yang sama (11 akun, fraud 0,2727) berisi dua community dengan fraud rate 0,50 vs 0,00 — community memecah rata-rata yang menyesatkan.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: community ID adalah fitur",
        type: "pitfall",
        body: "Yang benar: nomor community tidak punya arti — ia hanya label run itu. Dua run label propagation bisa memberi nomor berbeda untuk akun yang sama (B1–B5 flip 3 dari 10 run). Yang boleh dipakai sebagai fitur adalah community_size dan internal_density — ukuran dan kepadatan yang didefinisikan dari struktur, bukan dari nomor.",
      },
    },
    {
      id: "money-flow",
      eyebrow: "Langkah 10 · Directed money-flow",
      title: "Directed money-flow: mengikuti arah uang, bukan hanya hubungannya",
      prose: [
        "Cerita pembuka lesson ini (K1–K5) sudah menunjukkan arah uang — tapi sejauh ini graf lesson ini tidak berarah: edge hanya berkata «berbagi device». Langkah ini menambahkan arah: dari siapa, ke siapa, berapa, kapan. Dataset kecil [ilustrasi]: lima akun K1–K5 membentuk rantai — EXT→K1 Rp50jt 08:00; K1→K2 Rp20jt 09:15; K1→K3 Rp30jt 10:00; K2→K4 Rp18jt 13:00; K3→K4 Rp25jt 14:30; K4→K5 Rp40jt 17:00; K5→EXT Rp38jt 23:00 — dan tiga akun normal K6–K8 yang saling bertransaksi kecil: K6→K7 Rp5jt 09:00; K7→K6 Rp2jt 15:00; K6→K8 Rp3jt 11:00; K8→K6 Rp1jt 16:00; K7→K8 Rp4jt 12:00.",
        "Nilai [ilustrasi] — semua transaksi: K1 masuk 50jt/keluar 50jt, rasio 1,00, dwell median 98 mnt, hop ke EXT 4. K2 20/18, rasio 0,90, dwell 225 mnt, hop 3. K3 30/25, rasio 0,83, dwell 270 mnt, hop 3. K4 masuk 43jt (fan-in 2)/keluar 40jt, rasio 0,93, dwell 150 mnt, hop 2. K5 40/38, rasio 0,95, dwell 360 mnt, hop 1. Bandingkan akun normal: K6 masuk 3jt/keluar 8jt, rasio 2,67 — ia mengeluarkan LEBIH dari yang masuk (belanja uang sendiri; dwell tidak terdefinisi karena outflow mendahului inflow); K7 5/6, rasio 1,20; K8 7/1, rasio 0,14 — uang mengendap (dwell 240 mnt) tanpa keluar. Definisi: dwell = median waktu antara dana masuk dan dana keluar berikutnya dari akun itu; hop ke EXT = jumlah edge terpendek ke tujuan eksternal; fan-in/fan-out = jumlah counterpart masuk/keluar.",
        "Sekarang potong di 18:00 — keputusan triase sore hari hanya boleh memakai transaksi sampai 18:00. Yang berubah: K5 keluar 0jt (transaksi 23:00 belum terjadi), rasio 0,00, hop None — ia terlihat seperti SINK (uang masuk dan berhenti), bukan mule. K1–K4 hop-nya semua None: seluruh rantai exit tidak terlihat dari cutoff. Bila model memakai transaksi 23:00 untuk menilai K5 pada 18:00, itu leakage — model «tahu» masa depan. Aturannya: edge dibatasi cutoff waktu keputusan; fitur dihitung hanya dari transaksi ≤ cutoff.",
        "Kandidat mule dari angka ini: K1–K5 (rasio keluar/masuk 0,83–1,00, dwell 98–360 mnt, fan-in/fan-out kecil tapi rantai panjang) vs K6–K8 (rasio 0,14–2,67, tidak ada hop ke EXT). Tapi satu rantai saja belum cukup: di data nyata, mule dibedakan dari pedagang normal oleh kombinasi — rasio mendekati 1 (uang diteruskan, bukan dibelanjakan), dwell pendek (uang tidak mengendap), dan hop pendek ke tujuan eksternal.",
        "Bandingkan dengan fitur shared-device (langkah 4): K1–K5 TIDAK berbagi device — fitur graf lesson ini tidak akan melihat mereka sama sekali. Money-flow melihat apa yang device tidak lihat: arah uang. Sebaliknya, money-flow buta terhadap ring yang tidak bertransaksi satu sama lain. Keduanya pelengkap, bukan pengganti — dan di capstone M3.5 keduanya dipakai bersama.",
        "Baik atau buruk: money-flow bagus bila transaksi punya arah dan waktu yang tepercaya — ia menangkap pola yang tidak terlihat dari satu akun sendirian. Buruk bila cutoff diabaikan (leakage), atau bila rasio dibaca tanpa dwell: rasio 1,00 dengan dwell 30 hari adalah pedagang yang menahan stok, bukan mule; rasio 1,00 dengan dwell 98 menit adalah uang yang diteruskan.",
        "Mitigasi: tetapkan cutoff SEBELUM menghitung fitur apa pun, dan laporkan dwell bersama rasio — selalu berpasangan. Bila satu akun punya rasio 1,00 tapi dwell-nya berminggu-minggu, ia bukan mule; bila rasionya 0,00 karena cutoff, jangan dibaca sebagai «uang mengendap» — baca sebagai «belum terlihat keluar».",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Rantai money-flow: EXT ke K1 Rp50jt, pecah ke K2 dan K3, berkumpul di K4 lalu K5, keluar ke EXT Rp38jt pukul 23:00 setelah cutoff 18:00; akun normal K6 K7 K8 bertransaksi kecil saling berbalasan">
<defs>
<marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--chart-text)"/></marker>
<marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--c2)"/></marker>
</defs>
<text x="240" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Rantai K1–K5: uang masuk, pecah, berkumpul, keluar — setelah cutoff</text>
<text x="30" y="94" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EXT</text>
<circle cx="95" cy="90" r="16" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="95" y="94" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">K1</text>
<circle cx="185" cy="55" r="16" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="185" y="59" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">K2</text>
<circle cx="185" cy="125" r="16" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="185" y="129" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">K3</text>
<circle cx="275" cy="90" r="16" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="275" y="94" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">K4</text>
<circle cx="365" cy="90" r="16" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="365" y="94" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">K5</text>
<text x="450" y="94" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EXT</text>
<line x1="46" y1="90" x2="79" y2="90" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#arr)"/>
<text x="62" y="78" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">50jt · 08:00</text>
<line x1="111" y1="82" x2="169" y2="63" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#arr)"/>
<text x="140" y="52" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">20jt · 09:15</text>
<line x1="111" y1="98" x2="169" y2="117" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#arr)"/>
<text x="140" y="138" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">30jt · 10:00</text>
<line x1="201" y1="63" x2="259" y2="82" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#arr)"/>
<text x="230" y="52" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">18jt · 13:00</text>
<line x1="201" y1="117" x2="259" y2="98" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#arr)"/>
<text x="230" y="138" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">25jt · 14:30</text>
<line x1="291" y1="90" x2="349" y2="90" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#arr)"/>
<text x="320" y="78" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">40jt · 17:00</text>
<line x1="381" y1="90" x2="434" y2="90" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrR)"/>
<text x="407" y="78" text-anchor="middle" font-size="10" fill="var(--c2)" font-family="var(--font-ui)">38jt · 23:00</text>
<text x="240" y="162" text-anchor="middle" font-size="11" fill="var(--c2)" font-family="var(--font-ui)" font-weight="600">K5→EXT 23:00 terjadi SETELAH cutoff 18:00 — dari cutoff, K5 terlihat seperti sink, bukan mule</text>
<circle cx="95" cy="200" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="95" y="204" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">K6</text>
<circle cx="185" cy="200" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="185" y="204" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">K7</text>
<circle cx="275" cy="200" r="14" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="275" y="204" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">K8</text>
<line x1="109" y1="194" x2="171" y2="194" stroke="var(--chart-text)" stroke-width="1" marker-end="url(#arr)"/>
<line x1="171" y1="206" x2="109" y2="206" stroke="var(--chart-text)" stroke-width="1" marker-end="url(#arr)"/>
<line x1="109" y1="200" x2="261" y2="200" stroke="var(--chart-text)" stroke-width="1" marker-end="url(#arr)"/>
<text x="140" y="182" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5jt ↔ 2jt</text>
<text x="185" y="226" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Normal K6–K8: berbalasan kecil, rasio 0,14–2,67, tanpa hop ke EXT.</text>
</svg>`,
        alt: "Rantai money-flow: EXT ke K1 Rp50jt, pecah ke K2 dan K3, berkumpul di K4 lalu K5, keluar ke EXT Rp38jt pukul 23:00 setelah cutoff 18:00; akun normal K6 K7 K8 bertransaksi kecil saling berbalasan.",
        caption: "Cara membaca: panah = arah uang, label = nominal dan jam. Interpretasi: rantai K1–K5 meneruskan hampir semua yang masuk (rasio 0,83–1,00) dengan dwell 98–360 mnt — tapi dari cutoff 18:00, exit-nya belum terlihat: K5 tampak seperti sink. Normal K6–K8 berbalasan kecil tanpa arah keluar.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: rasio keluar/masuk 1,00 berarti mule",
        type: "pitfall",
        body: "Yang benar: rasio saja tidak cukup — pedagang yang menahan stok sebulan lalu menjual semuanya juga berasio 1,00. Mule dibedakan oleh rasio DAN dwell pendek DAN hop pendek ke tujuan eksternal. Dan bila rasio 0,00 muncul karena cutoff, itu bukan «uang mengendap» — itu «belum terlihat keluar».",
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 11 · Peta keputusan",
      title: "Peta keputusan: kapan graf membantu, kapan tidak",
      prose: [
        "Akun tampak normal sendirian tapi berbagi device dengan banyak akun lain? Hitung degree, maxshare, dan component size-nya — lalu masukkan sebagai fitur model, bukan sebagai vonis. Di data sintetis ini [lab], itulah yang mengangkat ROC-AUC dari 0,6387 ke 0,8204.",
        "Component besar + degree tinggi + uang masuk-keluar cepat? Naikkan prior-nya dan dahulukan pemeriksaannya — itu kombinasi ring dan mule, bukan satu sinyal saja. Component besar sendirian hanya menaikkan peluang dari 0,036 ke 0,0422 [lab] — terlalu lemah untuk berdiri sendiri.",
        "Butuh menjelaskan kenapa satu akun di-flag? Tunjukkan grafnya: «akun ini berbagi device dengan 14 akun lain di component 19» adalah penjelasan yang bisa dibaca manusia — jauh lebih baik daripada «skor model 0,83».",
        "Tidak ada data device/IP yang tepercaya? Jangan memaksakan graph features dari proxy yang lemah (misal nama yang mirip, atau alamat yang sama persis tanpa verifikasi) — graf dari relasi yang salah lebih berbahaya daripada tidak ada graf. Di UCI, ketiadaan device/IP berarti graph features tidak bisa dibangun — dan mengakuinya adalah jawaban yang benar.",
        "Flag sudah keluar? Kirim ke pemeriksaan manusia — jangan blokir otomatis. Dari 1.470 akun di component [5, ∞) [lab], 1.408 adalah legit; blokir otomatis menghukum mereka semua. Antrean pemeriksaan yang diurutkan skor model + fitur graf adalah penggunaan yang jujur.",
        "Mau sinyal yang lebih tajam? Gabungkan graf dengan velocity — kecepatan uang masuk lalu keluar — di MLF-M3.3. Graf menjawab «dengan siapa», velocity menjawab «seberapa cepat»: keduanya bersama jauh lebih kuat daripada masing-masing sendiri.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 12 · Mini-case",
      title: "Mini-case: 100 slot pemeriksaan — ke mana perginya?",
      prose: [
        "Tim fraud punya kapasitas memeriksa 100 akun per minggu. Dua opsi antrean — hitung dengan angka sintetis lesson ini [lab], dan lihat seberapa besar bedanya.",
        "Opsi A — 100 akun acak dari 2.000 akun. Fraud rate keseluruhan 0,036, jadi dari 100 akun yang diperiksa, harapan fraud yang ditemukan adalah 100 × 0,036 = 3,6 akun. Sisanya, 96,4 akun, adalah legit yang diperiksa sia-sia.",
        "Opsi B — 100 akun dari component berukuran [5, ∞). Fraud rate di kelompok itu 0,0422, jadi harapan fraud yang ditemukan adalah 100 × 0,0422 = 4,22 akun. Lebih baik dari opsi A — tapi hanya lebih baik 0,62 akun per 100 pemeriksaan. Flag component saja hampir tidak menghemat antrean.",
        "Opsi C — 100 akun dengan skor model +graph tertinggi. Model +graph punya ROC-AUC test 0,8204 [lab] — ranking-nya jauh lebih baik daripada sekadar «component besar». Tidak ada angka pasti berapa fraud yang ditemukan opsi C tanpa menghitung ranking-nya (itu tugas notebook) — tapi arahnya jelas: gabungan degree + component + transaksi mengalahkan satu flag kasar.",
        "Dan satu hitungan yang wajib diingat: dari 72 akun fraud [lab], flag component [5, ∞) menangkap 62 — dan 10 fraud lolos dari flag itu (72 − 62 = 10). Flag yang hanya mengandalkan ukuran component buta terhadap 10 fraud itu. Itulah kenapa graph features masuk ke MODEL — model menimbang degree, component, dan transaksi bersama — bukan ke satu aturan «component ≥ 5 → periksa».",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 13 · Guided task di Colab",
      title: "Guided task di Colab: bangun graf 2.000 akun, ukur lift-nya",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 8 akun. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m32-guided-task.ipynb.",
        "Di notebook itu kamu membangkitkan data sintetis yang sama persis (seed 42, 2.000 akun, 400 device, ring 60 akun di 6 device), membangun adjacency dengan dict dan component dengan BFS (tanpa library graf), menghitung degree, maxshare, dan component size, lalu melatih logistic regression dasar (ROC-AUC test 0,6387) vs dasar + graph features (0,8204, lift +0,1817) pada split dan test set yang sama — lengkap dengan checks yang menegaskan tiap angka kanonis lesson ini.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/1A1pQaybbkO5nqqUhLm7lFFm-waWs1bYx",
        "Jalur file notebook: colab/mlf-m32-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 14 · Checkpoint",
      title: "Checkpoint: hubungan adalah fitur",
      prose: [
        "Rangkuman: graf mengubah tabel akun-device menjadi peta — node, edge, degree, component. Fraud ring menumpuk di kelompok yang berbagi device (36 dari 60 akun ring fraud [lab], vs 0,0186 di luar ring). Tiga graph features — degree, maxshare, component size — masuk sebagai input model dan mengangkat ROC-AUC test dari 0,6387 ke 0,8204 pada test set yang sama [lab]. Tapi datanya sintetis, fiturnya membawa satu sinyal yang sama, dan flag component bukan vonis: 95,8 persen akun di component besar adalah legit.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Apa definisi degree sebuah akun?",
          options: [
            { text: "Jumlah device yang dipakai akun itu", why: "Itu jumlah device, bukan degree — akun yang memakai satu device ramai bisa ber-degree besar." },
            { text: "Jumlah akun lain yang berbagi ≥ 1 device dengan akun itu", why: "Benar: degree menghitung tetangga — akun lain yang berbagi minimal satu device.", correct: true },
            { text: "Ukuran component akun itu", why: "Itu component size — degree sama dengan component size − 1 hanya bila akun itu memakai satu device." },
            { text: "Jumlah transaksi akun itu", why: "Itu txn_count — fitur dasar transaksi, bukan fitur graf." },
          ],
        },
        {
          q: "Dari 1.470 akun di component size [5, ∞) [lab], 62 adalah fraud. Apa arti angka ini untuk satu akun yang ter-flag?",
          options: [
            { text: "Akun itu hampir pasti fraud", why: "Salah: 62 dari 1.470 berarti peluangnya 0,0422 — hanya sekitar 4 dari 100 akun yang ter-flag yang fraud." },
            { text: "Peluangnya fraud 0,0422 — sedikit di atas base rate 0,036 — jadi flag adalah prior, bukan vonis", why: "Benar: 62 / 1.470 = 0,0422, dan 1.408 dari 1.470 akun itu legit (95,8 persen). Flag menaikkan prior, bukan membuktikan apa pun.", correct: true },
            { text: "Akun itu pasti legit karena 95,8 persen akun di component itu legit", why: "Salah arah: 0,0422 tetap di atas base rate 0,036 — risikonya naik, bukan nol." },
            { text: "Angka itu tidak ada artinya tanpa tahu degree akunnya", why: "Salah: 0,0422 vs 0,036 adalah informasi — kecil, tapi nyata. Degree mempertajamnya, bukan meniadakannya." },
          ],
        },
        {
          q: "Berapa lift ROC-AUC dari penambahan graph features — dan pada test set apa?",
          options: [
            { text: "+0,1817, pada test set yang sama (500 akun, 18 fraud)", why: "Benar: 0,8204 − 0,6387 = 0,1817, kedua model dinilai pada 500 akun test yang persis sama.", correct: true },
            { text: "+0,1817, tapi pada test set yang berbeda untuk tiap model", why: "Salah: test set-nya SAMA — split yang sama, seed 42. Test set berbeda membuat perbandingan tidak sah." },
            { text: "+0,0817, pada test set yang sama", why: "Salah hitung: 0,8204 − 0,6387 = 0,1817, bukan 0,0817." },
            { text: "Tidak bisa dihitung karena kedua model memakai fitur yang berbeda", why: "Salah: ROC-AUC keduanya dihitung pada label test yang sama — jumlah fitur boleh berbeda, test set-nya yang harus sama." },
          ],
        },
        {
          q: "Apa itu maxshare?",
          options: [
            { text: "Ukuran device terbesar yang dipakai akun itu", why: "Benar: maxshare = ukuran device terbesar di antara device-device yang dipakai akun itu.", correct: true },
            { text: "Jumlah device yang dipakai akun itu", why: "Itu jumlah device — maxshare mengukur seberapa BESAR device-nya, bukan berapa banyak." },
            { text: "Ukuran component terbesar di seluruh graf", why: "Itu ukuran component maksimum global (19 di data ini) — maxshare adalah milik satu akun, bukan seluruh graf." },
            { text: "Jumlah maksimum transaksi dalam satu hari", why: "Itu velocity/transaksi — bukan fitur graf." },
          ],
        },
        {
          q: "Mengapa data sintetis [lab] tetap berguna untuk belajar network analysis, padahal angkanya bukan angka nyata?",
          options: [
            { text: "Karena angkanya sama dengan angka produksi", why: "Salah: angkanya sintetis — fraud rate 0,036 dan ROC-AUC 0,8204 adalah angka latihan, bukan angka produksi." },
            { text: "Karena metodenya yang transfer — adjacency, BFS, degree, component — sementara angkanya hanya latihan", why: "Benar: cara membangun graf dan menghitung fitur tidak bergantung pada apakah datanya nyata; yang tidak transfer adalah angka-angkanya.", correct: true },
            { text: "Karena dataset UCI punya kolom device dan IP", why: "Salah: UCI TIDAK punya device/IP — justru itulah kenapa lesson ini memakai data sintetis." },
            { text: "Karena model yang dilatih di data sintetis bisa langsung dipakai di produksi", why: "Salah: model sintetis tidak boleh dipakai di produksi — ia hanya membuktikan metodenya bekerja." },
          ],
        },
        {
          q: "Mean degree fraud 10,42 vs legit 5,12 [lab]. Kesimpulan yang tepat?",
          options: [
            { text: "Setiap akun fraud ber-degree di atas 10", why: "Salah: 10,42 adalah RATA-RATA — ada akun fraud ber-degree kecil dan akun legit ber-degree 18." },
            { text: "Rata-rata, akun fraud terhubung ke sekitar dua kali lebih banyak akun — sinyal kelompok, bukan bukti per akun", why: "Benar: 10,42 / 5,12 ≈ 2,0 — rata-rata kelompok berbeda jauh, tapi rata-rata tidak memvonis individu.", correct: true },
            { text: "Degree yang tinggi menyebabkan fraud", why: "Salah: korelasi bukan sebab — degree menandai kelompok ring, bukan menyebabkan seseorang menjadi fraud." },
            { text: "Akun legit tidak pernah ber-degree tinggi", why: "Salah: akun legit bisa ber-degree 18 bila menumpang di device ramai." },
          ],
        },
        {
          q: "Ketiga koefisien graph features sama persis (0,2877). Mengapa?",
          options: [
            { text: "Karena ketiganya fungsi yang sama dari ukuran component di data ini — satu device per akun", why: "Benar: di data ini maxshare = component size dan degree = component size − 1 untuk setiap akun, jadi setelah standardisasi ketiganya adalah fitur yang sama.", correct: true },
            { text: "Karena modelnya gagal dan memberi bobot asal-asalan", why: "Salah: modelnya bekerja (ROC-AUC 0,8204) — kesamaan koefisien adalah cerminan data, bukan kegagalan model." },
            { text: "Karena ketiganya kebetulan berkorelasi kuat", why: "Salah: bukan kebetulan — hubungannya eksak (maxshare = component size), bukan sekadar korelasi." },
            { text: "Karena StandardScaler menyamakan semua koefisien", why: "Salah: StandardScaler hanya menyeragamkan skala — koefisien txn_count (0,0545) dan log amount (−0,0134) tetap berbeda." },
          ],
        },
        {
          q: "Apa ciri mule account?",
          options: [
            { text: "Uang masuk lalu keluar dengan cepat, dan akun itu berbagi device dengan banyak akun lain", why: "Benar: mule dipakai memindahkan uang — dana tidak mengendap — dan jejak device-nya menghubungkannya ke akun-akun lain dalam jaringan.", correct: true },
            { text: "Akun dengan saldo terbesar di bank", why: "Salah: saldo besar bukan ciri mule — mule justru mengosongkan akunnya dengan cepat." },
            { text: "Akun yang tidak pernah bertransaksi", why: "Salah: akun yang tidak bertransaksi tidak memindahkan apa pun — mule justru sangat aktif." },
            { text: "Akun dengan satu device sendiri dan transaksi yang lambat", why: "Salah: itu ciri akun biasa — mule ditandai kecepatan dan keterhubungan, bukan kesendirian." },
          ],
        },
        {
          q: "Pada contoh 11 akun, modularity partisi A/B adalah 0,4088 dan partisi 1 community adalah 0,0000. Louvain menemukan A/B persis; label propagation urutan A1→B5 runtuh jadi 1 community. Apa pelajaran utamanya?",
          options: [
            { text: "Label propagation selalu lebih baik karena lebih sederhana", why: "Salah: label propagation di sini justru runtuh (Q 0,0) pada satu urutan — ia tidak mengoptimalkan modularity apa pun." },
            { text: "Community ID tidak stabil antar-run — pakai community_size dan internal_density sebagai fitur, bukan nomor community-nya", why: "Benar: urutan mengubah hasil LP (1 vs 2 community), dan B1–B5 flip 3 dari 10 run acak; yang stabil adalah ukuran dan densitas, bukan nomornya.", correct: true },
            { text: "Modularity 0,4088 berarti partisi A/B salah — Q harus di atas 0,70", why: "Salah: Q di atas 0,30 sudah dibaca sebagai struktur community yang nyata (heuristik); 0,4088 jauh di atas 0 (satu community)." },
            { text: "Community sama dengan component — 11 akun berarti 1 community", why: "Salah: 11 akun ini SATU component tapi DUA community (fraud 0,50 vs 0,00) — community didefinisikan modularity, bukan keterjangkauan." },
          ],
        },
        {
          q: "K5 menerima Rp40jt dan mengirim Rp38jt pukul 23:00 — setelah cutoff 18:00. Dari cutoff 18:00, K5 tampak seperti apa, dan apa kesalahannya bila transaksi 23:00 dipakai untuk menilai K5 pada 18:00?",
          options: [
            { text: "K5 tampak seperti mule; memakai transaksi 23:00 adalah leakage", why: "Salah arah: dari cutoff, K5 tampak seperti SINK (uang masuk, belum terlihat keluar) — bukan mule; dan memakai transaksi 23:00 memang leakage, tapi kesimpulan pertamanya salah." },
            { text: "K5 tampak seperti sink (uang masuk dan berhenti); memakai transaksi 23:00 adalah leakage — model «tahu» masa depan", why: "Benar: dari cutoff, K5 keluar 0jt, rasio 0,00, hop None — terlihat seperti sink. Transaksi 23:00 belum terjadi pada 18:00; memakainya berarti model melihat masa depan.", correct: true },
            { text: "K5 tampak seperti akun normal; tidak ada masalah memakai transaksi 23:00", why: "Salah: rasio 0,00 K5 bukan perilaku normal — itu artefak cutoff; dan memakai data sesudah cutoff adalah leakage." },
            { text: "K5 tampak seperti sink, tapi itu bukti K5 bukan bagian rantai", why: "Salah: K5 menerima Rp40jt dari K4 pukul 17:00 — ia bagian rantai; yang belum terlihat dari cutoff hanyalah exit-nya." },
          ],
        },
      ],
      summary: [
        "Graf: node = akun, edge = berbagi ≥ 1 device; degree, maxshare, dan component size adalah tiga fitur yang dihitung dari graf.",
        "Ring sintetis [lab]: 60 akun di 6 device, 36 fraud (0,60) vs 0,0186 di luar ring; component terbesar 19 akun; 1.470 akun di component [5, ∞).",
        "Mean degree fraud 10,42 vs legit 5,12 [lab] — sinyal kelompok, bukan vonis individu.",
        "LR dasar ROC-AUC test 0,6387 vs LR + graph features 0,8204 — lift +0,1817 pada test set yang sama (500 akun, 18 fraud) [lab].",
        "Ketiga koefisien graf sama persis (0,2877, OR 1,3334) — satu sinyal yang ditulis tiga kali, karena satu device per akun.",
        "Data sintetis: metodenya transfer, angkanya tidak. Flag component [5, ∞) hanya menaikkan prior 0,036 → 0,0422 — 95,8 persen akun yang ter-flag adalah legit.",
        "Lab: adjacency → degree (A3 tertinggi, 5); BFS → 2 component (6 dan 2 akun), terbesar 6; community: Q(A/B) 0,4088, LP 1 vs 2 community menurut urutan, Louvain menemukan A/B persis (Q 0,4088).",
        "Community [ilustrasi]: 11 akun, 27 edge, 1 component berisi 2 community — A fraud 0,50 vs B 0,00; +community hanya menaikkan ROC-AUC 0,8204 → 0,8210 di data M3.2 karena community = component untuk 100 persen akun.",
        "Directed money-flow [ilustrasi]: rantai K1–K5 rasio keluar/masuk 0,83–1,00 dengan dwell 98–360 mnt; dari cutoff 18:00, K5 tampak seperti sink (rasio 0,00) — memakai transaksi 23:00 untuk menilai 18:00 adalah leakage.",
      ],
      next: { label: "Lanjut: MLF-M3.3 — Velocity & Benford's Law", href: "/v2/learn/mlf-m33-velocity-benford" },
    },
  ],
};
