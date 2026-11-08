import type { V2Lesson } from "../lib/types";

// Trace timeline: 12 langkah; alert laju-R di langkah 5 (R=2/5), loop dikonfirmasi langkah 7 (kemunculan ke-3).
const TRACE_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Timeline 12 langkah: state (search, laporan Q3 final) berulang di langkah 4, 5, 7, 10 — R = 4/12 = 0,33.">
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<rect x="30" y="139" width="28" height="11" fill="var(--c1)" opacity="0.5"/><text x="44" y="165" fill="var(--chart-text)">1</text>
<rect x="66" y="125" width="28" height="25" fill="var(--c1)" opacity="0.5"/><text x="80" y="165" fill="var(--chart-text)">2</text>
<rect x="102" y="80" width="28" height="70" fill="var(--c1)" opacity="0.5"/><text x="116" y="165" fill="var(--chart-text)">3</text>
<rect x="138" y="125" width="28" height="25" fill="var(--c5)" opacity="0.65" stroke="var(--c5)" stroke-width="1.5"/><text x="152" y="165" fill="var(--text)" font-weight="600">4</text>
<rect x="174" y="123" width="28" height="27" fill="var(--c5)" opacity="0.65" stroke="var(--c5)" stroke-width="1.5"/><text x="188" y="165" fill="var(--text)" font-weight="600">5</text>
<rect x="210" y="77" width="28" height="73" fill="var(--c1)" opacity="0.5"/><text x="224" y="165" fill="var(--chart-text)">6</text>
<rect x="246" y="122" width="28" height="28" fill="var(--c5)" opacity="0.65" stroke="var(--c5)" stroke-width="1.5"/><text x="260" y="165" fill="var(--text)" font-weight="600">7</text>
<rect x="282" y="77" width="28" height="73" fill="var(--c1)" opacity="0.5"/><text x="296" y="165" fill="var(--chart-text)">8</text>
<rect x="318" y="60" width="28" height="90" fill="var(--c1)" opacity="0.5"/><text x="332" y="165" fill="var(--chart-text)">9</text>
<rect x="354" y="120" width="28" height="30" fill="var(--c5)" opacity="0.65" stroke="var(--c5)" stroke-width="1.5"/><text x="368" y="165" fill="var(--text)" font-weight="600">10</text>
<rect x="390" y="77" width="28" height="73" fill="var(--c1)" opacity="0.5"/><text x="404" y="165" fill="var(--chart-text)">11</text>
<rect x="426" y="99" width="28" height="51" fill="var(--c1)" opacity="0.5"/><text x="440" y="165" fill="var(--chart-text)">12</text>
<rect x="30" y="185" width="424" height="2" fill="var(--chart-grid)"/>
</g>
<rect x="146" y="40" width="282" height="18" rx="9" fill="var(--c5)" opacity="0.25"/>
<text x="287" y="53" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">state berulang di langkah 4, 5, 7, 10: query identik, hasil nihil</text>
<g font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="30" y="30">Tinggi batang = token per langkah (langkah 9 tertinggi: 3.200 token)</text>
<text x="30" y="210">Langkah 4, 5, 7, 10: query identik diulang tanpa hasil — agen tidak belajar dari kegagalan</text>
<text x="30" y="228">R = 4/12 = 0,33 &gt; τ = 0,25 → ALERT loop</text>
</g>
</svg>`;

export const aai11: V2Lesson = {
  slug: "aai11-debugging",
  track: "Agentic AI Engineer",
  module: "Operasi & Evaluasi",
  title: "AAI11 — Debugging Agen: Tracing & Observability",
  estMinutes: 75,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "47 langkah mencari file yang tidak ada",
      prose: [
        "Senin pagi tagihan LLM Dina membengkak 8×. Satu tugas \u201Ccari laporan Q3\u201D menelan 47 langkah dan 190.000 token. Log mentah hanya menunjukkan: search… baca… search… baca… berulang-ulang.",
        "Dina membuka TRACE terstruktur — tiap langkah tercatat sebagai span: aksi, argumen, observasi, token, durasi. Polanya langsung terlihat: langkah 5–8 mengulang SIKLUS IDENTIK — search \u201Claporan Q3 final\u201D → buka hasil → \u201Ctidak ditemukan\u201D → search lagi dengan query SAMA PERSIS. Agen tidak belajar dari kegagalan; ia terjebak loop.",
        "Twist-nya: akar masalahnya bukan di langkah 47, melainkan di langkah 5 — observasi \u201Ctidak ditemukan\u201D tidak pernah diterjemahkan menjadi \u201Cubah strategi\u201D. Log biasa menyembunyikan ini dalam banjir teks; trace terstruktur MENUNJUKKANNYA sebagai pola visual. Debugging agen bukan membaca log — melainkan membaca POLA.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan span/event dalam trace; (2) mendeteksi loop dari state berulang; (3) menghitung atribusi biaya per langkah; (4) mengimplementasikan detektor loop + peta biaya dari trace mock.",
        "Daftar isi: 1) Cerita 47 langkah · 2) Anatomi trace & pola gagal · 3) Lab: detektor loop + atribusi biaya · 4) Peta keputusan debugging · 5) Mini-case: harga loop tak terdeteksi · 6) Checkpoint.",
        "Uraian 47 langkah: 5 langkah berguna (search awal, 2 baca dokumen, 1 hitung, 1 tulis draf) + 42 langkah loop (search “laporan Q3 final” → buka hasil yang sama → tidak ketemu → ulangi). Tanpa trace terstruktur, Dina butuh 2 JAM membaca log mentah untuk melihat polanya. Dengan trace (span per langkah + R otomatis): 5 MENIT. Observability bukan “nice to have” — ia adalah MIKROSKOP: tanpa ia, kamu buta; dengan ia, pola 42 langkah terlihat dalam sekali pandang. Rp28.500 untuk satu tugas gagal = harga kebutaan.",
        "Skala bencana: tagihan 8× untuk SATU tugas. Jika 100 tugas/hari × 30 hari × Rp28.500 = Rp85,5 juta/bulan — untuk bug yang sama! Satu loop yang tidak terdeteksi × volume produksi = bencana finansial. Inilah mengapa deteksi loop OTOMATIS (bukan manual 2 jam kemudian) adalah fitur produksi, bukan alat debug: setiap jam keterlambatan deteksi = Rp3,5 juta terbuang (100 tugas × Rp28.500 / 8 jam). Otomatisasi deteksi = memindahkan biaya dari “tak terbatas” menjadi “terbatas”.",
        "Yang TIDAK ada di log mentah: (1) TOKEN per langkah — tanpa ini, “mahal” tidak bisa dilokalisasi; (2) STATE (aksi+argumen) terstruktur — tanpa ini, “pengulangan” tidak bisa dihitung; (3) DURASI per span — tanpa ini, “lamban” tidak bisa dibedakan dari “macet”. Tiga kolom ini = perbedaan antara “log” dan “trace”. Aturan: jika tidak ada di trace, tidak bisa di-debug — catat SEBELUM insiden, bukan saat panik. Instrumentasi adalah investasi yang dibayar di muka, diklaim saat krisis.",
      ],
      note: {
        title: "💡 Intuisi: debug polanya, bukan lognya",
        body: "Log 47 langkah dibaca baris per baris = 2 jam; tiga pola (loop/degradasi/penyimpangan) = 5 menit. Insinyur senior tidak membaca lebih cepat — ia mencari lebih cerdas: pola dulu, detail kemudian. Pola adalah kompresi dari pengalaman: 47 baris → 1 kata (“loop”). Belajarlah polanya sebelum insiden — saat insiden, tidak ada waktu belajar.",
      },
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Trace: rekam medis agen",
      prose: [
        "TRACE = urutan SPAN. Tiap span mencatat: nama aksi, argumen, observasi (hasil), token masuk/keluar, durasi, dan error jika ada. EVENT = penanda penting di dalam span (retry, approval, fallback). Aturannya: jika tidak ada di trace, tidak terjadi — untuk debugging.",
        "Tiga pola kegagalan yang terlihat di trace. LOOP: state (aksi+argumen) berulang ≥3× tanpa kemajuan — agen \u201Chamster\u201D. DEGRADASI: tiap langkah makin lama/token makin besar — context membengkak (AAI4). PENYIMPANGAN: satu langkah menghabiskan 80% biaya — kandidat optimasi atau bug.",
        "Atribusi biaya: tiap span bawa harga (token × tarif). Total biaya tugas = Σ biaya span. Tanpa ini, kamu tidak tahu langkah mana yang membakar uang.",
        "Deteksi loop sederhana: hitung R — frekuensi state paling sering dibagi total langkah (state = pasangan aksi+argumen). Jika melebihi threshold τ (mis. 0,25), angkat alert. Bukan bukti mutlak (retry valid juga berulang), tetapi sinyal murah yang menangkap sebagian besar kasus loop sederhana — persentase pastinya tergantung sistemmu, ukur dari tracemmu sendiri, jangan pakai angka persen sebagai janji. Catatan: R baru dievaluasi setelah sebuah state muncul ≥2× — sebelum ada pengulangan, R = 1/1 bukan sinyal loop melainkan artefak penyebut kecil.",
        "REPLAY: trace yang tersimpan memungkinkan menjalankan ulang skenario dengan perbaikan — debug tanpa membayar 47 langkah lagi.",
        "Worked R — lengkap dengan timeline. Trace 12 span; state (search, “laporan Q3 final”) muncul di langkah 4, 5, 7, 10. R per langkah: langkah 4: 1/4 = 0,25 (belum alert — tepat di ambang; dan state baru muncul pertama kali, jadi menurut aturan ≥2× R belum dievaluasi); langkah 5: 2/5 = 0,4 > 0,25 → ALERT. Divergensi pertama = langkah 4 (pengulangan pertama yang tidak menghasilkan kemajuan). Jika alert otomatis menyala di langkah 5 (bukan ditemukan manual 2 jam kemudian di langkah 47): hemat 42 langkah × Rp607 ≈ Rp25.500 per insiden. Definisi R di lesson ini satu untuk semua bagian — frekuensi state paling sering / total langkah — dipakai di formula, contoh kerja, lab, mini-case, dan SVG. Satu fungsi 20 baris = Rp25.500 per insiden × N insiden. Matematika observability selalu menang.",
        "Tiga pola — bedah lengkap dengan contoh angka. LOOP: R > 0,25 — state berulang ≥3× tanpa kemajuan. Contoh: search→baca→search→baca dengan query IDENTIK. Obat: hentikan + ubah strategi (query diganti, bukan diulang). DEGRADASI: token per langkah NAIK — 2.000 → 4.000 → 8.000 (context membengkak, AAI4). Obat: ringkas/batasi riwayat. PENYIMPANGAN: aksi di luar whitelist — agen tiba-tiba memanggil tool yang tidak ada di rencana. Obat: policy check (AAI9) + alert. Tiga pola, tiga obat — salah diagnosis = salah obat = insiden berlanjut.",
        "Threshold 3× — mengapa bukan 2× atau 5×? Retry SAH biasanya 1–2× (AAI3): tool gagal → coba lagi → berhasil. Threshold 2× akan menandai retry sah sebagai loop (FALSE POSITIVE — alert palsu yang membuat tim mengabaikan alert). Threshold 5×: loop terdeteksi 2 langkah lebih lambat = Rp1.200 lebih mahal per insiden, dan loop pendek (3–4×) lolos. 3× = “retry wajar + 1” — titik manis antara sensitivitas dan presisi. Bukan angka magis; ia = batas perilaku NORMAL + 1. Kalibrasi ulang per sistem: jika retry sah-mu 3×, threshold = 4×.",
        "Biaya per pola — tiga tagihan berbeda. LOOP: token terbuang LINEAR (42 langkah × Rp607 = Rp25.500) — mahal tetapi terbatas. DEGRADASI: token per langkah NAIK EKSPONENSIAL — langkah 1–10 murah, langkah 30–40 masing-masing Rp5.000+; total bisa 3× loop biasa. PENYIMPANGAN: biaya TAK TERBATAS (aksi salah = transfer salah = Rp jutaan). Prioritas alert: PENYIMPANGAN > DEGRADASI > LOOP — urutkan berdasarkan EKSPEKTASI KERUGIAN, bukan frekuensi. Yang jarang tetapi fatal > yang sering tetapi murah.",
        "Span termahal — bukan yang terbanyak. Dari 47 span: 42 loop × Rp607 = Rp25.500; tetapi 1 span “baca dokumen 50 halaman” = 15.000 token = Rp2.250 SEKALIGUS. Peta biaya (cost breakdown per span) sering menunjukkan: 80% biaya dari 20% span — biasanya 1–2 span rakus (baca dokumen raksasa, embedding ulang). Optimasi: batasi ukuran observasi per span (AAI4), bukan kurangi jumlah langkah. “Banyak langkah” belum tentu “mahal”; “satu span rakus” pasti mahal. Ukur per span, bukan per tugas.",
        "False positive vs false negative — trade-off detektor. FP (alert palsu): agen sehat dihentikan — biaya = 1 tugas tertunda + analis cek 10 menit (Rp14.167). FN (loop lolos): Rp25.500 terbuang. Penyebutnya beda: FP rate dihitung dari tugas SEHAT, FN rate dari tugas LOOP — jangan dicampur tanpa menyebut populasi. Pada 100 tugas sehat + 100 tugas loop: jika FP 5% (5 dari 100 sehat) dan FN 1% (1 dari 100 loop), ekspektasi biaya = 5 × 14.167 + 1 × 25.500 = Rp96.335 per 200 tugas. Jika threshold dinaikkan (FP 1%, FN 5%): 1 × 14.167 + 5 × 25.500 = Rp141.667 per 200 tugas yang sama — LEBIH BURUK! Threshold optimal = yang MEMINIMALKAN total biaya, bukan yang “tidak pernah salah”. Detektor sempurna tidak ada; detektor EKONOMIS ada.",
        "Sampling trace — untuk volume besar. 10.000 tugas/hari × trace penuh (47 span × 1KB) = 470MB/hari — mahal disimpan. Solusi: (1) simpan RINGKASAN semua (R, biaya, langkah — 100 byte/tugas = 1MB/hari); (2) trace PENUH hanya untuk: 1% sampel acak + 100% yang alert + 100% yang gagal. 99% penghematan storage, dengan kemampuan forensik penuh untuk tugas yang disimpan lengkap (1% sampel acak + semua yang alert + semua yang gagal) — tugas yang hanya tersimpan sebagai ringkasan tidak bisa di-forensik penuh. Observability = bukan “catat semua”, melainkan “catat yang tepat dengan biaya tepat”.",
        "Replay — nilai trace yang tersimpan. Insiden kemarin bisa DI-REPLAY hari ini: jalankan ulang trajectory dengan perbaikan (query diganti), lihat apakah loop hilang — tanpa menunggu insiden 47 langkah berikutnya di produksi. Replay memakai trace tersimpan — biaya komputasi replay tetap ada, tetapi jauh lebih kecil daripada satu insiden penuh di produksi. Replay = time travel untuk debugging. Syarat: trace menyimpan INPUT tiap span (bukan hanya output) + versi kode + versi model. Tanpa ketiganya, replay = fiksi. Investasi: 20% storage tambahan. Nilai: debug iteratif 10× lebih cepat. “Bisa di-replay” = syarat trace yang matang.",
      ],
      formula: String.raw`R = \frac{\text{frekuensi state paling sering}}{\text{total langkah}} \quad ; \quad \text{alert jika } R > \tau`,
      formulaNote: "R = frekuensi kemunculan state paling sering / total langkah; state = pasangan (aksi, argumen). Alert jika R > τ (mis. 0,25), dievaluasi setelah sebuah state muncul ≥2× (sebelum pengulangan pertama, R = 1/1 adalah artefak penyebut kecil, bukan sinyal). R = 0,5 berarti state paling sering muncul di separuh langkah — pola loop klasik. Threshold 3× (“retry wajar 1–2× + 1”) menyeimbangkan deteksi vs false positive: retry sah tidak memicu, loop beneran tertangkap.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Ctambah max_steps lalu selesai\u201D",
        type: "pitfall",
        body: "Yang benar: max_steps menghentikan PENDARAHAN, bukan menyembuhkan penyakit. Agen yang loop 47 langkah lalu berhenti di 50 tetap gagal + boros. max_steps = perban; deteksi pola + perbaikan strategi = obat. Keduanya dibutuhkan, jangan tertukar.",
      },
      hints: [
        "Intuisi: debug dari AKHIR ke AWAL — temukan langkah pertama yang menyimpang dari rencana, bukan langkah terakhir yang meledak.",
        "Intuisi: jika 3 insiden berturut-turut punya pola trace sama, itu bukan 3 bug — itu 1 bug sistemik. Klasifikasikan pola, bukan insiden.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: detektor loop dan peta biaya dari trace",
      prose: [
        "Kamu diberi `TRACE` — 12 span mock dari insiden Dina. Tiap span: {n, aksi, argumen, token, sukses}. Tugasmu: (1) implementasikan `deteksi_loop(trace)` — kembalikan (apakah_loop, langkah_awal_loop): state = (aksi, argumen); jika ada state yang muncul ≥3×, itu loop; langkah_awal = indeks kemunculan pertama dari state berulang; (2) implementasikan `peta_biaya(trace, tarif)` — total token × tarif per 1000 token, plus span termahal (n, aksi, biaya).",
        "Tarif: Rp150 per 1.000 token. Jejaknya: state (search, \u201Claporan Q3 final\u201D) muncul di langkah 4, 5, 7, 10 (4×) — state paling sering, jadi R = 4/12 = 0,33. Alert laju-R menyala di langkah 5 (R = 2/5 = 0,40 > 0,25); detektor hitung ≥3× di lab mengonfirmasi loop di langkah 7 (kemunculan ke-3); `awal` yang dikembalikan lab adalah kemunculan pertama state itu, yaitu langkah 4. Dua sinyal, satu state yang sama.",
        "Coba eksplorasi: ubah threshold menjadi ≥2×. False positive apa yang muncul? (Petunjuk: retry valid dari AAI3 juga berulang 2× — itulah kenapa threshold 3×.)",
        "Eksperimen: tambah 3 span UNIK ke TRACE (aksi berbeda, tidak berulang), hitung ulang R. R turun dari 0,33 ke 0,27 — MASIH di atas 0,25 (alert tetap menyala, benar — loop-nya masih ada). Sekarang hapus 2 kemunculan loop (total tinggal 10 langkah, state paling sering tinggal 2×): R = 2/10 = 0,20 < 0,25 — alert MATI. Detektor tidak buta: ia merespons perubahan data dengan benar. Uji kedua arah (tambah noise, kurangi sinyal) = validasi detektor. Detektor yang tidak diuji = asumsi yang mahal.",
        "Tarif Rp150/1.000 token — hitung biaya PER SPAN, bukan total. Span termahal di TRACE: cari token maksimum × tarif. Seringkali: bukan span loop (kecil, berulang), melainkan SATU span “baca” yang rakus. Pelajaran: optimasi dimulai dari span termahal — bukan dari pola yang paling terlihat. Loop itu BERISIK (47 langkah!); span rakus itu DIAM (1 langkah, Rp2.250). Yang diam sering lebih mahal dari yang berisik. Peta biaya > intuisi.",
        "Uji ambang: ubah τ dari 0,25 ke 0,15 lalu 0,4, catat kapan alert menyala untuk TRACE yang sama. τ=0,15: alert di langkah 5 (R = 2/5 = 0,40 > 0,15) — SAMA cepatnya dengan τ=0,25 pada TRACE ini, karena aturan ≥2× melarang alert di langkah 4 (state baru muncul pertama kali; R = 1/4 = 0,25 adalah artefak penyebut kecil, bukan sinyal). τ=0,15 hanya lebih cepat pada trace lain — mis. pengulangan ke-2× di langkah 9 (R = 2/9 ≈ 0,22 > 0,15 tetapi < 0,25). Harganya: retry sah 2× (R=0,17) ikut tertandai = FP. τ=0,4: alert di langkah 7 (R = 3/7 ≈ 0,43 > 0,4) — 2 langkah lebih lambat dari τ=0,25 (langkah 5) = 2 × Rp607 ≈ Rp1.200 lebih mahal. Catatan: R = 0,4 tepat di langkah 10 TIDAK menyalakan alert, karena syaratnya R > τ (0,4 > 0,4 adalah FALSE) — alert τ=0,4 sudah menyala lebih dulu di langkah 7. Tiga angka ini = kurva trade-off threshold. Pilih τ dengan DATA (distribusi R tugas sehat vs loop), bukan dengan “kayaknya 0,25 bagus”.",
        "Dari deteksi ke AKSI — loop tertutup. Detektor yang hanya ALERT (tanpa aksi) = setengah solusi: analis tetap butuh 10 menit untuk merespons. Lengkapnya: alert → auto-stop (hentikan loop) → auto-diagnose (tampilkan divergensi pertama) → suggest (tampilkan 3 strategi alternatif) → manusia pilih. 4 langkah otomatis, 1 keputusan manusia. Waktu respons: 10 menit → 1 menit. Observability yang matang = bukan “melihat”, melainkan “melihat + menghentikan + menyarankan”.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `deteksi_loop` dengan state = (aksi, argumen), threshold 3×" },
        { id: "t2", text: "Implementasikan `peta_biaya`, cetak hasil sesuai format" },
      ],
      expected: "loop=True\nawal=4\ntotal_rp=3075\ntermahal=9:analisis",
      note: {
        title: "Miskonsepsi: \u201Cerror terakhir = akar masalah\u201D",
        type: "pitfall",
        body: "Yang benar: error terakhir (langkah 47: max_steps tercapai) adalah GEJALA. Akarnya di langkah 5 — observasi gagal pertama yang tidak mengubah strategi. Aturan debug: cari DIVERGENSI PERTAMA dari perilaku sehat, bukan ledakan terakhir.",
      },
      hints: [
        "deteksi_loop: hitung kemunculan tiap state dengan dict; cari yang count >= 3; awal = indeks pertama + 1 (1-based).",
        "peta_biaya: total = sum(token) * tarif / 1000; termahal = max(trace, key=token).",
        "Kembalikan awal sebagai nomor langkah 1-based agar cocok dengan ekspektasi.",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nTRACE = [\n    {"n": 1, "aksi": "rencana", "argumen": "cari laporan Q3", "token": 400, "sukses": True},\n    {"n": 2, "aksi": "search", "argumen": "laporan Q3", "token": 900, "sukses": True},\n    {"n": 3, "aksi": "baca", "argumen": "hasil-1.pdf", "token": 2500, "sukses": False},\n    {"n": 4, "aksi": "search", "argumen": "laporan Q3 final", "token": 900, "sukses": True},\n    {"n": 5, "aksi": "search", "argumen": "laporan Q3 final", "token": 950, "sukses": True},\n    {"n": 6, "aksi": "baca", "argumen": "hasil-2.pdf", "token": 2600, "sukses": False},\n    {"n": 7, "aksi": "search", "argumen": "laporan Q3 final", "token": 1000, "sukses": True},\n    {"n": 8, "aksi": "baca", "argumen": "hasil-2.pdf", "token": 2600, "sukses": False},\n    {"n": 9, "aksi": "analisis", "argumen": "rangkum parsial", "token": 3200, "sukses": True},\n    {"n": 10, "aksi": "search", "argumen": "laporan Q3 final", "token": 1050, "sukses": True},\n    {"n": 11, "aksi": "baca", "argumen": "hasil-2.pdf", "token": 2600, "sukses": False},\n    {"n": 12, "aksi": "tulis", "argumen": "draf", "token": 1800, "sukses": True},\n]\nTARIF = 150  # Rp per 1000 token\n\n# ===== TULIS KODEMU =====\ndef deteksi_loop(trace, ambang=3):\n    ...\n\ndef peta_biaya(trace, tarif):\n    ...\n\nloop, awal = deteksi_loop(TRACE)\ninfo = peta_biaya(TRACE, TARIF)\nprint(f"loop={loop}")\nprint(f"awal={awal}")\nprint(f"total_rp={info['total_rp']:.0f}")\nprint(f"termahal={info['termahal_n']}:{info['termahal_aksi']}")`,
        lockLines: 15,
        solution: `# ===== MOCK — jangan diubah =====\nTRACE = [\n    {"n": 1, "aksi": "rencana", "argumen": "cari laporan Q3", "token": 400, "sukses": True},\n    {"n": 2, "aksi": "search", "argumen": "laporan Q3", "token": 900, "sukses": True},\n    {"n": 3, "aksi": "baca", "argumen": "hasil-1.pdf", "token": 2500, "sukses": False},\n    {"n": 4, "aksi": "search", "argumen": "laporan Q3 final", "token": 900, "sukses": True},\n    {"n": 5, "aksi": "search", "argumen": "laporan Q3 final", "token": 950, "sukses": True},\n    {"n": 6, "aksi": "baca", "argumen": "hasil-2.pdf", "token": 2600, "sukses": False},\n    {"n": 7, "aksi": "search", "argumen": "laporan Q3 final", "token": 1000, "sukses": True},\n    {"n": 8, "aksi": "baca", "argumen": "hasil-2.pdf", "token": 2600, "sukses": False},\n    {"n": 9, "aksi": "analisis", "argumen": "rangkum parsial", "token": 3200, "sukses": True},\n    {"n": 10, "aksi": "search", "argumen": "laporan Q3 final", "token": 1050, "sukses": True},\n    {"n": 11, "aksi": "baca", "argumen": "hasil-2.pdf", "token": 2600, "sukses": False},\n    {"n": 12, "aksi": "tulis", "argumen": "draf", "token": 1800, "sukses": True},\n]\nTARIF = 150  # Rp per 1000 token\n\n# ===== TULIS KODEMU =====\ndef deteksi_loop(trace, ambang=3):\n    hitung = {}\n    for span in trace:\n        state = (span["aksi"], span["argumen"])\n        hitung[state] = hitung.get(state, 0) + 1\n    for state, c in hitung.items():\n        if c >= ambang:\n            awal = next(s["n"] for s in trace if (s["aksi"], s["argumen"]) == state)\n            return True, awal\n    return False, None\n\ndef peta_biaya(trace, tarif):\n    total_token = sum(s["token"] for s in trace)\n    termahal = max(trace, key=lambda s: s["token"])\n    return {"total_rp": total_token * tarif / 1000,\n            "termahal_n": termahal["n"], "termahal_aksi": termahal["aksi"]}\n\nloop, awal = deteksi_loop(TRACE)\ninfo = peta_biaya(TRACE, TARIF)\nprint(f"loop={loop}")\nprint(f"awal={awal}")\nprint(f"total_rp={info['total_rp']:.0f}")\nprint(f"termahal={info['termahal_n']}:{info['termahal_aksi']}")`,
        checks: [
          { kind: "defined", task: "t1", name: "deteksi_loop", label: "`deteksi_loop` terdefinisi", msg: "Definisikan fungsi deteksi_loop(trace, ambang=3)." },
          { kind: "defined", task: "t2", name: "peta_biaya", label: "`peta_biaya` terdefinisi", msg: "Definisikan fungsi peta_biaya(trace, tarif)." },
          { kind: "equal", task: "t1", name: "awal", value: 4, tol: 1e-9, label: "`awal` = 4", msg: "State (search, laporan Q3 final) pertama muncul di langkah 4, lalu berulang 5, 7, 10." },
          { kind: "stdout_matches", task: "t2", pattern: "loop=True\\nawal=4\\ntotal_rp=3075\\ntermahal=9:analisis", label: "output empat baris sesuai format", msg: "Total token 20500 × 150/1000 = 3075. Span termahal = analisis 3200 token." },
        ],
      },
      reference: "dict counting, next() dengan generator, max() dengan key.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: saat agen bertingkah aneh",
      prose: [
        "Skenario 1 — biaya meledak tiba-tiba → PETA BIAYA dulu: span mana termahal? Seringkali satu langkah rakus, bukan semua langkah.",
        "Skenario 2 — tugas tak selesai, langkah banyak → DETEKSI LOOP: hitung R. Jika > τ, cari divergensi pertama — observasi gagal yang diabaikan.",
        "Skenario 3 — gagal kadang-kadang (flaky) → BANDINGKAN TRACE sukses vs gagal: di langkah mana keduanya berpisah? Itulah titik rapuh (biasanya tool timeout).",
        "Skenario 4 — semua metrik hijau tetapi pengguna komplain → STEP-LEVEL REVIEW: baca 5 trace acak manual. Metrik agregat menyembunyikan pola baru.",
        "Cara membaca: 12 batang = 12 langkah; tinggi = token per langkah; batang merah (langkah 4, 5, 7, 10) = state berulang; label di bawah = nomor langkah.",
        "Interpretasi: loop terlihat sebagai BATANG MERAH yang tersebar — query identik diulang di langkah 4, 5, 7, 10 tanpa hasil. Tanpa visualisasi ini, 12 baris log terlihat seperti \u201Cagen sedang bekerja keras\u201D. Dengan visualisasi: \u201Cagen hamster\u201D. R = 4/12 = 0,33 > 0,25 → alert tepat.",
        "Aturan praktis 10 detik: (1) Biaya aneh → peta biaya. (2) Tak selesai → deteksi loop. (3) Flaky → bandingkan trace. (4) Selalu: debug divergensi pertama, bukan ledakan terakhir.",
        "Skenario: error SPORADIS (1 dari 100 run gagal) → SAMPLING trace 10% + alert agregat. Tidak perlu trace penuh 100 run (mahal); cukup: jika 10 sampel ada 1 gagal → investigasi. Statistik: P(menangkap ≥1 gagal) = 1 − 0,99¹⁰ = 9,6% — kecil! Naikkan ke 50%: P = 1 − 0,99⁵⁰ = 39,5%. Untuk error 1%, butuh ~300 sampel untuk 95% keyakinan menangkap. Pelajaran: error jarang butuh sampel BESAR atau waktu LAMA. Jangan investigasi error sporadis dengan 10 sampel — kamu tidak akan menemukannya.",
        "Skenario: SEMUA run lambat (bukan loop, bukan gagal) → bukan masalah agen, melainkan INFRASTRUKTUR. Cek: latency model naik? rate limit? degradasi sistemik = pola yang SAMA di semua trace (bukan satu). Obat: bukan debug agen, melainkan cek status provider + fallback model (AAI10). Pola menentukan obat: satu trace aneh = agen; semua trace aneh = infrastruktur. Salah level = debug berhari-hari untuk masalah yang solusinya “ganti endpoint”.",
        "Skenario: biaya NAIK BERTAHAP selama 2 pekan (bukan tiba-tiba) → DRIFT, bukan insiden. Penyebab tipikal: prompt membengkak (tambah contoh tiap pekan), KB membesar (retrieval lebih banyak), model diganti (tarif naik). Obat: tren biaya mingguan + dekomposisi (komponen apa yang naik?). Insiden = patah tiba-tiba (loop); drift = lereng landai (akumulasi). Keduanya butuh observability — tetapi obatnya beda: insiden → hentikan; drift → diet.",
        "Skenario: tidak ada anomali tetapi direksi bertanya “apakah agen bekerja dengan baik?” → DASHBOARD RUTIN, bukan forensik. Metrik mingguan: success rate + CI, biaya median/p95, R rata-rata, % alert. Satu halaman, 4 angka, tren 8 pekan. “Baik” = definisi operasional, bukan perasaan. Tanpa dashboard, pertanyaan direksi dijawab dengan anekdot; dengan dashboard, dijawab dengan data. Observability = bukan hanya untuk insiden, tetapi untuk KEPERCAYAAN.",
      ],
      note: {
        title: "💡 Intuisi: metrik mengalahkan firasat",
        body: "R=0,33 tidak berdebat — ia di atas 0,25, titik. Tanpa metrik: “kayaknya loop deh” vs “kayaknya normal” = debat kusir saat tagihan membengkak. Definisikan angka SEBELUM insiden (threshold, tarif, SLA), bukan saat panik. Metrik yang disepakati saat tenang = keputusan yang cepat saat krisis.",
      },
      figure: {
        svg: TRACE_SVG,
        alt: "Timeline 12 langkah: state (search, laporan Q3 final) berulang di langkah 4, 5, 7, 10 — R = 4/12 = 0,33.",
        caption: "Loop terlihat sebagai blok berulang — bukan sebagai \u201Ckerja keras\u201D.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: harga loop yang tak terdeteksi",
      prose: [
        "Insiden Dina: 47 langkah, 190.000 token, tarif Rp150/1.000 → Rp28.500 untuk SATU tugas gagal. Loop terdeteksi (secara manual, 2 jam kemudian) mulai langkah 5 — artinya 42 langkah × Rp607 ≈ Rp25.500 adalah pemborosan murni (satu basis biaya untuk seluruh mini-case: Rp28.500 / 47 langkah ≈ Rp607 per langkah).",
        "Dengan detektor R > 0,25 otomatis: alert menyala di langkah 5 (R = 2/5 = 0,40 > 0,25) — bukan langkah 8 (di langkah 8, R = 3/8 = 0,375; angka 4/8 salah karena sampai langkah 8 state paling sering baru muncul 3×). Agen dihentikan, strategi diubah (query diganti, bukan diulang). Biaya sampai langkah 5: 5 × Rp607 ≈ Rp3.035. Hemat ≈ Rp25.500 per insiden (42 langkah × Rp607) — dan 2 jam investigasi manual.",
        "Frekuensi: tanpa detektor, tim Dina mencatat 12 insiden loop/bulan. Dengan detektor: 12 × Rp25.500 = Rp306.000/bulan + 24 jam analis kembali. Biaya membangun detektor: 1 hari kerja insinyur (sekali).",
        "Tetapi ada false positive: retry valid (AAI3) juga menaikkan R. Dengan τ = 0,25, 3% tugas sehat ikut ter-alert. Tiap false alert butuh 10 menit cek (Rp14.167). Dari 500 tugas/bulan (12 di antaranya loop, jadi ≈488 sehat): 3% × 488 ≈ 15 tugas × Rp14.167 ≈ Rp212.500/bulan — masih di bawah penghematan, tetapi bukan nol.",
        "Pembahasan: pelajaran angkanya — observability adalah investasi dengan ROI terukur: (penghematan insiden − biaya false positive) / biaya bangun. Dan τ adalah tuasnya: naikkan jika false positive mahal, turunkan jika loop mahal. Tidak ada τ universal.",
        "Skala 100 insiden/bulan: tanpa detektor: 100 × Rp28.529 = Rp2.852.900 ≈ Rp2,85 juta/bulan terbuang (total per insiden 47 langkah × Rp607 = Rp28.529 — BUKAN Rp25.500; Rp25.500 adalah HEMAT per insiden, yaitu 42 langkah yang dihindari × Rp607; lesson lama memakai angka hemat sebagai total, sehingga menghitung ganda). Dengan detektor (alert di langkah 5, biaya Rp3.035): 100 × Rp3.035 = Rp303.500 ≈ Rp304 ribu + biaya dev 4 jam (Rp600 ribu sekali). Hemat bulan 1: Rp2,85jt − Rp304rb − Rp600rb ≈ Rp1,95 juta; bulan 2+: Rp2,85jt − Rp304rb ≈ Rp2,55 juta/bulan. Satu fungsi 20 baris ≈ Rp30 juta/tahun. Presentasikan angka ini — bukan “kode yang elegan” — saat meminta waktu untuk observability.",
        "Deteksi lebih DINI — τ=0,15 vs 0,25. KOREKSI atas lesson lama: dengan τ=0,15, alert TETAP menyala di langkah 5 pada trace ini — bukan langkah 4: di langkah 4 state baru muncul PERTAMA kali, dan aturan lesson ini (R baru dievaluasi setelah sebuah state muncul ≥2×) melarang alert di langkah 4 (R = 1/4 = 0,25 di langkah 4 adalah artefak penyebut kecil). Di langkah 5, R = 2/5 = 0,40 > 0,15 → alert — SAMA dengan τ=0,25. Hemat tambahan di trace ini: Rp0 — klaim lama “biaya 4 × Rp607 = Rp2.428, hemat tambahan Rp607/insiden × 100 = Rp60.700/bulan” SALAH karena melanggar aturan ≥2× lesson sendiri. τ=0,15 hanya lebih cepat pada trace lain — mis. pengulangan ke-2× di langkah 9 (R = 2/9 ≈ 0,22 > 0,15 tetapi < 0,25) akan ter-alert lebih dini. Caranya: threshold adaptif — untuk query yang DIKETAHUI rawan loop (histori), τ=0,15 (lebih sensitif). Trade-off: FP naik sedikit. Untuk query rawan, FP murah (cek 10 menit) vs FN mahal (Rp25.500). Threshold = fungsi dari RIWAYAT query, bukan konstanta. Detektor yang belajar > detektor yang statis.",
        "Biaya KETERLAMBATAN manual: Dina menemukan loop 2 JAM kemudian. Dalam 2 jam: 25 tugas × Rp28.529 = Rp713.225 ≈ Rp713 ribu terbuang — 25× lipat dari satu insiden! (Angka lama 25 × Rp25.500 = Rp637.500 memakai angka hemat sebagai total — double-count yang sama seperti di atas.) Detektor otomatis (respons 1 menit): 25 tugas × Rp3.035 = Rp75.875 ≈ Rp76 ribu. Selisih ≈ Rp637 ribu per 2 jam keterlambatan. Pelajaran: yang mahal bukan loop-nya — melainkan WAKTU BUTA (blind time) antara insiden dan deteksi. Investasi #1 observability = meminimalkan blind time, bukan mempercantik dashboard.",
        "False positive yang mahal: alert palsu menghentikan agen SEHAT yang sedang mengerjakan tugas kritis (laporan direksi, deadline 5 menit). Biaya: tugas gagal + denda keterlambatan Rp5 juta. Satu FP seperti ini menghapus hemat 200 deteksi benar! Solusi: untuk tugas KRITIS, alert = “tandai + lanjutkan dengan pengawasan” (bukan auto-stop). Auto-stop untuk tugas rutin; supervised-continue untuk tugas kritis. Aksi detektor = fungsi dari TARUHAN tugas (AAI1 lagi — semuanya kembali ke taruhan).",
        "ROI observability total — tahun 1. Investasi: instrumentasi 1 pekan (Rp6 juta) + detektor 4 jam (Rp600 ribu) + dashboard 2 hari (Rp3 juta) = Rp9,6 juta. Penghematan: Rp2,55 juta/bulan × 12 ≈ Rp30,6 juta + 1 insiden kritis dicegah (Rp45 juta × 30% probabilitas = Rp13,5 juta ekspektasi). Total nilai Rp44,1 juta. ROI ~4,6×. Dan ini belum menghitung “kepercayaan direksi” yang tidak bisa di-rupiah-kan tetapi menentukan anggaran tahun depan. Observability = investasi terbaik kedua setelah validasi input (AAI3).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Prinsip atribusi biaya per langkah = activity-based costing untuk AI. Tanpa itu, tagihan LLM adalah \u201Cbiaya overhead misterius\u201D yang tidak bisa dioptimasi — sama seperti portofolio tanpa atribusi return.",
      },
    },
    {
      id: "routing-model",
      eyebrow: "Langkah 6 · Routing",
      title: "Routing model: tidak semua tugas butuh model raksasa",
      prose: [
        "Tagihan Dina membengkak 8× — sebagian besar karena SETIAP langkah, dari klasifikasi niat yang sepele sampai penalaran multi-langkah, dikirim ke model terbesar dan termahal. Ibarat memanggil koki bintang lima untuk merebus mi instan. Routing model adalah disiplin kebalikannya: cocokkan TINGKAT model dengan TINGKAT kesulitan tugas.",
        "Tugas agen berjenjang kesulitannya. Tangga bawah: klasifikasi niat, ekstraksi field dari teks terstruktur, peringkasan pendek — model kecil (cepat, murah) menyelesaikannya dengan akurasi yang sama dengan model besar — untuk tugas mudah yang sudah diukur; kesetaraan ini bukan hukum umum, melainkan hasil pengukuran per tugas (bandingkan di evalmu sendiri sebelum mengandalkannya). Tangga tengah: penalaran satu-dua langkah dengan konteks panjang. Tangga atas: perencanaan multi-langkah, penulisan kode, penilaian ambiguitas — di sinilah model besar layak dibayar.",
        "Router adalah fungsi yang memilih tingkat per langkah atau per tugas. Bentuknya bermacam-macam: heuristik sederhana (pola tugas yang sudah dikenal → kecil; kata kunci seperti \"rencanakan\" atau \"analisis mendalam\" → besar), skor kepercayaan diri dari model kecil itu sendiri, atau model router kecil yang terlatih khusus. Ia bukan AI canggih — ia penjaga gerbang yang murah, dan justru karena murah ia menghemat yang mahal.",
        "Dua kegagalan khas. Semua ke model terbesar: tagihan 5–20× lebih mahal tanpa peningkatan kualitas yang terukur — boros, tetapi tidak terlihat karena tugasnya \"berhasil\". Semua ke model terkecil: kualitas RUNTUH DIAM-DIAM — jawaban salah yang terdengar meyakinkan, kegagalan yang baru ketahuan saat pelanggan komplain. Yang pertama boros, yang kedua berbahaya.",
        "Pola yang bertahan di produksi: mulai dari kecil, ESKALASI ke besar saat sinyal gagal muncul — skor percaya diri rendah, hasil tidak lolos validasi, atau tugas yang sejak awal bertanda \"sulit\". Biaya usaha kecil yang gagal memang sudah terlanjur dibayar, tetapi ia jauh lebih murah daripada selalu membayar besar. Kunci yang sering dilewatkan: ambang eskalasi harus TERTULIS, bukan \"feeling\" — dan ia diukur, bukan ditebak. Itu isi langkah berikutnya.",
      ],
      tasks: [
        { id: "t1", text: "Petakan 3 tugas agen versimu sendiri ke tangga kesulitan (rendah/sedang/tinggi) dan tentukan tingkat model awal tiap tugas" },
        { id: "t2", text: "Tulis 2 sinyal eskalasi yang bisa diobservasi (bukan feeling) untuk tugas \"sedang\" versimu" },
      ],
      note: {
        title: "Miskonsepsi: \"model terbesar selalu paling akurat\"",
        type: "pitfall",
        body: "Yang benar: untuk tugas mudah, akurasi model besar JENUH — ia tidak lebih akurat, hanya lebih mahal dan lebih lambat. Yang naik hanya tagihan. Pilih tingkat model berdasarkan kesulitan tugas, bukan berdasarkan gengsi.",
      },
      reference: "Cocokkan tingkat model dengan tingkat kesulitan; mulai kecil, eskalasi tertulis.",
    },
    {
      id: "routing-model-biaya",
      eyebrow: "Langkah 7 · Biaya & latensi",
      title: "Menghitung untung routing: biaya & latensi",
      prose: [
        "Routing tanpa angka adalah opini. Model biayanya sederhana: biaya per tugas = jumlah token yang jatuh di tiap tingkatan × harga per token tingkatan itu. Tiga angka ini — token per tugas, porsi yang jatuh ke tiap tingkat, harga per tingkat — menentukan apakah routermu menghemat 38% atau hanya menambah kerumitan.",
        "Contoh angka konkret dari lab di bawah: 6 tugas = 13.500 token. Semua dikirim ke tingkat besar (Rp1.500 per 1.000 token) → Rp20.250. Dengan routing bertingkat (rendah/sedang ke kecil dulu, tinggi langsung besar, satu tugas sedang gagal lalu eskalasi): 8.500 token kecil @Rp150 = Rp1.275 plus 7.500 token besar = Rp11.250 → total Rp12.525. Hemat 38%. Perhatikan: usaha kecil yang gagal (t3, Rp375) tetap dibayar — ia \"hangus\", tetapi jauh lebih murah daripada Rp3.750 jika t3 langsung selalu ke besar.",
        "Latensi adalah biaya kedua yang tidak masuk tagihan: langkah agen berantai MENGALIKAN latensi. Lima langkah × 2 detik = 10 detik menunggu; lima langkah × 20 detik = 100 detik — pengguna pergi di detik ke-30. Eskalasi menambah biaya ganda: latensi kecil yang gagal + latensi besar yang menyelamatkan. Aturan praktis: untuk tugas interaktif, latensi p95 per tugas adalah metrik PRODUK, bukan metrik infra.",
        "Ukur routermu dengan dua angka per tingkatan: TINGKAT ESKALASI (berapa persen tugas naik kelas) dan TINGKAT GAGAL per tingkatan (berapa persen yang tetap gagal setelah eskalasi). Eskalasi tinggi + gagal rendah = router terlalu pengecut — naikkan ambang, kamu membayar besar untuk tugas yang sebenarnya bisa. Eskalasi rendah + gagal tinggi = router terlalu berani — turunkan ambang, kualitasmu bocor. Tanpa dua angka ini, \"tuning router\" adalah menebak.",
        "Jebakan harga berubah: harga model bergerak beberapa kali setahun. Rute yang optimal di Januari bisa jadi boros di Juli — karena selisih harga antar tingkat menyempit, atau model kecil generasi baru mengalahkan model besar generasi lama. Tinjau tabel harga dan metrik router tiap kuartal. Router yang tidak ditinjau = strategi harga yang kedaluwarsa.",
        "Coba eksplorasi di lab: ubah ESKALASI jadi {\"t3\", \"t6\"} — hemat turun ke berapa? Lalu coba tanpa eskalasi sama sekali (t3 dianggap berhasil di kecil) — berapa \"hemat\"-nya, dan apa yang kamu korbankan? Angka kedua adalah contoh hemat palsu: tagihan turun, kualitas tidak diukur.",
      ],
      formula: String.raw`C = \sum_{tier} N_{tier} \times p_{tier} \quad ; \quad T = \sum_{langkah} t_{langkah}`,
      formulaNote: "C = biaya per tugas (Rp); N_tier = jumlah token yang jatuh di tingkatan itu; p_tier = harga per token tingkatan itu. T = latensi total per tugas; t_langkah = latensi satu langkah. Rumus C artinya: satu-satunya tuas router adalah memindahkan token dari tingkat mahal ke tingkat murah. Rumus T artinya: latensi berantai menjumlah — eskalasi menambah satu putaran penuh (kecil gagal + besar menyelamatkan).",
      tasks: [
        { id: "t1", text: "Implementasikan perhitungan biaya: semua-besar vs routing bertingkat dengan eskalasi" },
        { id: "t2", text: "Hitung `hemat_persen` dan cetak tiga baris sesuai format expected" },
      ],
      expected: "besar_semua=Rp20250\nrouting=Rp12525\nhemat=38.15%",
      note: {
        title: "Miskonsepsi: \"routing selalu menghemat\"",
        type: "pitfall",
        body: "Yang benar: routing menghemat hanya jika (a) sebagian besar tugas memang mudah, dan (b) biaya eskalasi (usaha kecil yang gagal + latensi ganda) lebih kecil dari selisih harga antar tingkat. Jika 90% tugasmu sulit, router hanya menambah kompleksitas tanpa penghematan. Hitung dulu, pasang kemudian.",
      },
      hints: [
        "biaya(tokens, tier) = tokens * HARGA[tier] / 1000.0 — tulis helper ini dulu.",
        "Routing: \"tinggi\" langsung besar; lainnya kecil dulu; tambah biaya besar bila id tugas ada di ESKALASI.",
        "hemat_persen = (besar_semua - routing) / besar_semua * 100 — bulatkan 2 desimal saat cetak.",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====
TUGAS = [
    {"id": "t1", "kesulitan": "rendah", "token": 1200},
    {"id": "t2", "kesulitan": "rendah", "token": 800},
    {"id": "t3", "kesulitan": "sedang", "token": 2500},
    {"id": "t4", "kesulitan": "tinggi", "token": 5000},
    {"id": "t5", "kesulitan": "rendah", "token": 1000},
    {"id": "t6", "kesulitan": "sedang", "token": 3000},
]
# Harga Rp per 1.000 token; ESKALASI = tugas yang gagal di model kecil
HARGA = {"kecil": 150.0, "besar": 1500.0}
ESKALASI = {"t3"}

# ===== TULIS KODEMU DI BAWAH =====
def biaya(tokens, tier):
    ...

biaya_besar_semua = ...
biaya_routing = ...
hemat_persen = ...

print(f"besar_semua=Rp{biaya_besar_semua:.0f}")
print(f"routing=Rp{biaya_routing:.0f}")
print(f"hemat={hemat_persen:.2f}%")`,
        lockLines: 12,
        solution: `# ===== DATA — jangan diubah =====
TUGAS = [
    {"id": "t1", "kesulitan": "rendah", "token": 1200},
    {"id": "t2", "kesulitan": "rendah", "token": 800},
    {"id": "t3", "kesulitan": "sedang", "token": 2500},
    {"id": "t4", "kesulitan": "tinggi", "token": 5000},
    {"id": "t5", "kesulitan": "rendah", "token": 1000},
    {"id": "t6", "kesulitan": "sedang", "token": 3000},
]
# Harga Rp per 1.000 token; ESKALASI = tugas yang gagal di model kecil
HARGA = {"kecil": 150.0, "besar": 1500.0}
ESKALASI = {"t3"}

# ===== TULIS KODEMU DI BAWAH =====
def biaya(tokens, tier):
    return tokens * HARGA[tier] / 1000.0

biaya_besar_semua = biaya(sum(t["token"] for t in TUGAS), "besar")

biaya_routing = 0.0
for t in TUGAS:
    if t["kesulitan"] == "tinggi":
        biaya_routing += biaya(t["token"], "besar")
    else:
        biaya_routing += biaya(t["token"], "kecil")
        if t["id"] in ESKALASI:
            biaya_routing += biaya(t["token"], "besar")

hemat_persen = (biaya_besar_semua - biaya_routing) / biaya_besar_semua * 100.0

print(f"besar_semua=Rp{biaya_besar_semua:.0f}")
print(f"routing=Rp{biaya_routing:.0f}")
print(f"hemat={hemat_persen:.2f}%")`,
        checks: [
          { kind: "defined", task: "t1", name: "biaya_routing", label: "`biaya_routing` terdefinisi", msg: "Hitung total biaya routing bertingkat dalam variabel biaya_routing." },
          { kind: "equal", task: "t1", name: "biaya_besar_semua", value: 20250.0, tol: 0.01, label: "`biaya_besar_semua` = 20250", msg: "13.500 token × Rp1.500/1.000 = Rp20.250." },
          { kind: "equal", task: "t1", name: "biaya_routing", value: 12525.0, tol: 0.01, label: "`biaya_routing` = 12525", msg: "8.500 token kecil (Rp1.275) + 7.500 token besar (Rp11.250)." },
          { kind: "equal", task: "t2", name: "hemat_persen", value: 38.1481, tol: 0.05, label: "`hemat_persen` ≈ 38,15", msg: "(20250 − 12525) / 20250 × 100." },
          { kind: "stdout_matches", task: "t2", pattern: "besar_semua=Rp20250\\nrouting=Rp12525\\nhemat=38\\.15%", label: "tiga baris output sesuai format", msg: "Samakan format print dengan expected (2 desimal untuk persen)." },
        ],
      },
      reference: "Biaya = Σ token_tier × harga_tier. Ukur eskalasi & gagal per tingkat; tinjau tiap kuartal.",
    },    {
      id: "batching",
      eyebrow: "Langkah 8 · Batching",
      title: "Batching: delapan panggilan sekaligus, bukan delapan antrean",
      prose: [
        "Batching berarti mengumpulkan beberapa request lalu memprosesnya sekali jalan — dan ia bekerja di dua tempat. Di sisi serving, dynamic batching menggabungkan request LLM yang datang bersamaan (diajarkan mendalam di MLE27 dan LLMOps13). Di sisi agen, batching berarti menggabungkan beberapa panggilan tool yang independen menjadi satu batch, alih-alih menunggu satu demi satu.",
        "Angka ilustratif: 8 panggilan tool read-only yang independen, masing-masing 200 ms. Serial: 8 kali 200 ms = 1.600 ms. Satu batch: 260 ms — sekitar 6,15 kali lebih cepat. Penghematannya bukan sulap: latensi jaringan dan antrean yang tadinya dibayar 8 kali kini dibayar sekali.",
        "Dua syarat yang tidak boleh dilanggar. Pertama, independen: tidak ada panggilan yang bergantung pada hasil panggilan lain di batch yang sama — bila bergantung, itu bukan batch melainkan rantai, dan harus serial. Kedua, read-only: jangan batch tool tulis — urutan dan idempotency tool tulis (AAI3) rusak bila dieksekusi bersamaan. Pengecualian sempit: tool tulis yang idempotent DAN urutan eksekusinya tidak memengaruhi hasil akhir — dan tetap uji, karena dua “tambah 100” yang bersamaan bisa menggandakan efek.",
        "Dan satu batas yang sering dilupakan: timeout batch. Jangan menunggu selamanya demi batch yang penuh — tetapkan batas tunggu (contoh: 50 ms) dan kirim apa pun yang terkumpul. Batch yang menunggu 5 detik demi menghemat 200 ms adalah optimasi yang merugikan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membatch tool tulis yang tidak idempotent. Dua panggilan “tambah 100” yang dieksekusi bersamaan bisa menambah 200 — atau 100 dua kali dengan hasil yang sama tetapi efek yang berbeda. Batch hanya untuk yang independen dan read-only.",
      },
      reference: "Batching = independen + read-only + timeout. 8 x 200 ms serial = 1.600 ms; satu batch 260 ms.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang membaca pola, bukan log.",
        "Refleksi: debugging agen = membaca POLA, bukan log. Tiga pola (loop, degradasi, penyimpangan) + tiga metrik (R, token/langkah, whitelist) = sebagian besar diagnosis dalam 5 menit — persentase pastinya tergantung sistem, ukur di tracemmu sendiri. Sisanya = forensik manual. Insinyur junior membaca 47 baris log; insinyur senior menghitung 3 angka. Perbedaannya bukan pengalaman — ia adalah INSTRUMEN: senior punya detektor, junior punya mata lelah. Bangun detektormu sebelum insiden — bukan saat.",
        "Satu kalimat untuk dibawa pulang: “Jika tidak ada di trace, tidak bisa di-debug — dan jika tidak ada ALERT OTOMATIS, tidak akan ketahuan tepat waktu.” Dua investasi: instrumentasi (catat yang tepat) + deteksi (alert yang ekonomis). Keduanya murah, keduanya dibayar di muka, keduanya diklaim saat krisis. Tim yang berinvestasi tidur nyenyak; tim yang tidak — begadang saat tagihan 8× datang.",
      ],
      tasks: [],
      summary: [
        "Trace = urutan span (aksi, argumen, observasi, token, durasi). Jika tak ada di trace, tak terjadi.",
        "R = frekuensi state paling sering / total langkah; alert jika > τ (dievaluasi setelah ada pengulangan ≥2×). Threshold 3× menghindari false positive retry.",
        "Atribusi biaya per span: total = Σ; optimasi mulai dari span termahal.",
        "Debug divergensi PERTAMA, bukan ledakan terakhir.",
        "max_steps = perban; deteksi pola = obat. Replay trace untuk verifikasi perbaikan.",
      ],
      next: { label: "AAI12 — Capstone: SQL Analyst Agent + Server MCP", href: "/v2/learn/aai12-capstone" },
      quiz: [
        {
          q: "State (search, \u201Claporan Q3 final\u201D) muncul di langkah 4, 5, 7, 10 dari 12 langkah. R dan keputusan?",
          options: [
            { text: "R = 0,33 > 0,25 → alert loop", why: "4/12 = 0,33 melebihi threshold. Tepat — pola di lab.", correct: true },
            { text: "R = 0,25 → aman", why: "4/12 = 0,333, bukan 0,25.", },
            { text: "Tidak bisa dihitung tanpa token", why: "R memakai hitungan state, bukan token.", },
            { text: "Itu normal, abaikan", why: "4× pengulangan query identik tanpa hasil = loop klasik.", },
          ],
        },
        {
          q: "Agen gagal di langkah 47 (max_steps). Langkah pertama yang harus diselidiki?",
          options: [
            { text: "Langkah 47", why: "Itu GEJALA (batas tercapai), bukan penyebab: max_steps adalah pengaman yang bekerja — ia menghentikan pendarahan, bukan menyembuhkan luka. Penyebabnya ada di langkah-langkah SEBELUM batas: cari divergensi pertama (observasi gagal yang diabaikan). Obati penyebab, bukan pengaman.", },
            { text: "Langkah 5 — observasi gagal pertama yang tidak mengubah strategi", why: "Tepat. Divergensi pertama = akar; ledakan terakhir = gejala.", correct: true },
            { text: "Langkah 1", why: "Terlalu jauh: awal mutlak (langkah 1) hampir tidak pernah salah — ia hanya “langkah pertama”. Yang dicari = DIVERGENSI PERTAMA: langkah di mana observasi gagal diabaikan dan agen mulai mengulang. Dari 47 langkah, biasanya hanya 1–3 kandidat. Fokus ke sana — biasanya menghemat sebagian besar waktu forensik.", },
            { text: "Langkah acak", why: "Debugging butuh metode, bukan acak: acak = 2 jam membaca log dengan harapan beruntung; metode = 5 menit (hitung R, cek token/langkah, cocokkan pola). Selisihnya bukan bakat — ia adalah PROSEDUR yang ditulis sebelum insiden. Tulis prosedurnya sekarang, saat tenang.", },
          ],
        },
        {
          q: "Kenapa threshold deteksi loop 3×, bukan 2×?",
          options: [
            { text: "Karena 3 angka keberuntungan", why: "Bukan — opsi ini tidak menjawab pertanyaan. Kembali ke tiga pola: LOOP (R tinggi), DEGRADASI (token naik), PENYIMPANGAN (aksi aneh). Identifikasi polanya dulu dari angka (R? token/langkah?), baru pilih obatnya. Salah pola = salah obat.", },
            { text: "Karena retry valid (1–2×) juga menghasilkan pengulangan — 3× memisahkan retry dari loop", why: "Tepat. Threshold menyeimbangkan deteksi vs false positive.", correct: true },
            { text: "Karena lebih cepat dihitung", why: "Kecepatan hitung tidak relevan.", },
            { text: "Karena max_steps kelipatan 3", why: "Tidak berhubungan dengan diagnosis: opsi ini membahas hal lain. Fokus — untuk setiap gejala, tanyakan: R-nya berapa? token per langkah naik? aksinya di whitelist? Tiga pertanyaan ini menyaring sebagian besar distraksi.", },
          ],
        },
        {
          q: "Tagihan membengkak tetapi semua tugas sukses. Langkah debug pertama?",
          options: [
            { text: "Naikkan max_steps", why: "Tugas sudah sukses — max_steps bukan masalahnya.", },
            { text: "Peta biaya: cari span termahal", why: "Tepat. Sukses yang boros = pola DEGRADASI/PENYIMPANGAN.", correct: true },
            { text: "Ganti model lebih besar", why: "Akan memperparah biaya: opsi ini menambah langkah/token tanpa mengatasi akar (loop tetap berputar, hanya lebih mahal). Aturan: jangan tambah resource ke pola yang rusak — hentikan polanya dulu, baru optimasi. Uang tidak memperbaiki arsitektur yang salah.", },
            { text: "Hapus trace agar hemat storage", why: "Menghancurkan alat diagnosis: tanpa trace tersimpan, insiden berikutnya tidak bisa di-replay, pola tidak bisa dibandingkan, dan kamu kembali buta. Jangan pernah mengorbankan observability demi penghematan sesaat — ia adalah mata yang akan kamu butuhkan besok.", },
          ],
        },
        {
          q: "Apa nilai REPLAY dari trace tersimpan?",
          options: [
            { text: "Tidak ada", why: "Ada — dan besar: nilai replay = debug iteratif tanpa membayar ulang 47 langkah + kemampuan membandingkan “sebelum vs sesudah perbaikan” secara adil. Untuk insiden berulang, replay menghemat berjam-jam. “Besar” di sini = 10× lebih cepat debug untuk 20% storage tambahan.", },
            { text: "Menjalankan ulang skenario dengan perbaikan tanpa membayar 47 langkah lagi", why: "Tepat. Debug iteratif murah = trace bisa di-replay.", correct: true },
            { text: "Menggantikan evaluasi", why: "Komplemen, bukan pengganti: keduanya dibutuhkan dan tidak saling menggantikan. Satu melihat pola (agregat), satu melihat sebab (forensik). Tim yang hanya punya satu = dokter dengan setengah peralatan. Pasang keduanya — biayanya kecil, lubangnya besar jika hilang.", },
            { text: "Mempercepat agen", why: "Replay untuk debug, bukan untuk produksi.", },
          ],
        },
        {
          q: "8 panggilan tool independen masing-masing 200 ms. Dijadikan satu batch 260 ms. Kesimpulan dan syaratnya?",
          options: [
            { text: "6,15 kali lebih cepat; syaratnya panggilan independen dan read-only", why: "Benar: 1.600 dibagi 260 = 6,15. Bila bergantung atau menulis, batching merusak kebenaran.", correct: true },
            { text: "8 kali lebih cepat; boleh untuk tool tulis juga", why: "Salah hitung (1.600/260 = 6,15, bukan 8) dan salah syarat — tool tulis tidak boleh di-batch.", },
            { text: "Tidak ada penghematan — batching hanya untuk LLM serving", why: "Salah: penghematan 1.340 ms itu nyata, dan batching berlaku juga di sisi agen.", },
            { text: "Lebih lambat karena harus menunggu batch penuh", why: "Timeout batch membatasi tunggu — batch dikirim apa pun yang terkumpul saat batas tercapai.", },
          ],
        },
      ],
    },
  ],
};
