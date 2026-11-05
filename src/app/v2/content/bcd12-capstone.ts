import type { V2Lesson } from "../lib/types";

// Papan investigasi capstone: S -> A,B -> C,D -> MIX,E dengan hop.
const BOARD_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Papan investigasi: S ke A dan B, A ke C, B ke D, C ke mixer, D ke E. Mixer ditemukan di hop 3.">
<g font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">
<text x="120" y="20">hop 1</text><text x="240" y="20">hop 2</text><text x="360" y="20">hop 3 → MIXER</text></g>
<g stroke="var(--chart-grid)" stroke-width="1.5" stroke-dasharray="5 4"><line x1="170" y1="30" x2="170" y2="230"/><line x1="300" y1="30" x2="300" y2="230"/></g>
<g stroke="var(--chart-text)" stroke-width="2"><line x1="70" y1="120" x2="150" y2="70"/><line x1="70" y1="120" x2="150" y2="170"/>
<line x1="190" y1="70" x2="270" y2="70"/><line x1="190" y1="170" x2="270" y2="170"/>
<line x1="310" y1="70" x2="390" y2="70"/><line x1="310" y1="170" x2="390" y2="170"/></g>
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600" text-anchor="middle">
<circle cx="50" cy="120" r="20" fill="var(--c4)" opacity="0.35" stroke="var(--c4)" stroke-width="2"/><text x="50" y="125">S</text>
<circle cx="170" cy="70" r="18" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/><text x="170" y="75">A</text>
<circle cx="170" cy="170" r="18" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/><text x="170" y="175">B</text>
<circle cx="290" cy="70" r="18" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/><text x="290" y="75">C</text>
<circle cx="290" cy="170" r="18" fill="none" stroke="var(--chart-text)" stroke-width="2"/><text x="290" y="175">D</text>
<circle cx="410" cy="70" r="20" fill="var(--c4)" opacity="0.5" stroke="var(--c4)" stroke-width="2.5"/><text x="410" y="75">MIX</text>
<circle cx="410" cy="170" r="18" fill="none" stroke="var(--chart-text)" stroke-width="2"/><text x="410" y="175">E</text></g>
<g font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">
<text x="110" y="88">50</text><text x="110" y="152">30</text><text x="230" y="60">48</text><text x="230" y="160">28</text>
<text x="350" y="60">45</text><text x="350" y="160">20</text><text x="50" y="152">80 ETH keluar</text></g>
<text x="240" y="244" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">45 ETH (56%) mencapai mixer di hop 3 → skor MEDIUM 36,6</text>
</svg>`;

const BCD12_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Confidence klaim laporan: klaim 1-3 dan 5 di atas 90 persen (tinggi), klaim 4 hanya 35 persen (rendah)."><text x="142" y="76.5" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Klaim 1-3,5</text><rect x="150" y="63.5" width="298.3" height="18" rx="3" fill="var(--c1)"/><text x="454.3" y="76.5" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">TINGGI (&gt;90%)</text><text x="142" y="161.5" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Klaim 4</text><rect x="150" y="148.5" width="109.9" height="18" rx="3" fill="var(--c4)"/><text x="265.9" y="161.5" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">RENDAH (35%)</text></svg>`;

export const bcd12: V2Lesson = {
  slug: "bcd12-capstone",
  track: "Blockchain Data Scientist",
  module: "Investigasi & Risiko",
  title: "BCD12 — Capstone: Investigasi Aliran Dana",
  estMinutes: 60,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Cerita",
      title: "Briefing: dompet S, 80 ETH, 5 hari",
      prose: [
        "Senin pagi. Compliance meneruskan laporan: nasabah baru (KYC 5 hari lalu) mengoperasikan dompet S. Dalam 48 jam, S mengirim 80 ETH ke 2 dompet. Analis pendahulu mencatat 'pola tidak biasa' tetapi tidak sempat menuntaskan. Kamu ditugaskan: investigasi penuh, kesimpulan tertulis, rekomendasi tindakan — hari ini juga.",
        "Twist-nya (yang akan kamu temukan sendiri di lab): pada 2 hop pertama, semuanya terlihat BERSIH — A, B, C, D hanyalah dompet biasa tanpa label. Mixer baru muncul di HOP 3. Analis yang berhenti di 2 hop (anggaran standar) akan menulis 'bersih' — dan salah. Pelajaran capstone: metodologi menentukan temuan.",
        "Misi: (1) eksplorasi — volume & counterparty S; (2) trace 3 hop — temukan ke mana uang bermuara; (3) skor risiko — hitung dengan fitur bcd11; (4) kesimpulan — tulis rekomendasi tindakan. Semua dengan data sintetis yang meniru struktur chain asli. Peta: briefing → eksplorasi → trace (lab) → skor → peta keputusan → kesimpulan → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) melakukan investigasi aliran dana end-to-end: eksplorasi → trace 3 hop → interpretasi skor; (2) menghitung taint dan membaca kapan ia mengencer di bawah ambang; (3) menulis laporan investigasi dengan confidence level yang jujur; (4) menangani kasus kedua secara mandiri sebagai latihan kelulusan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Investigasi = kumpulkan semua data dulu, simpulkan belakangan.\" Investigasi yang baik bekerja HIPOTESIS-DRIVEN: ajukan hipotesis ('S mencuci via mixer'), tentukan BUKTI apa yang menguatkan/menggugurkannya (jejak ke mixer ≤ 3 hop), lalu cari bukti itu. Mengumpulkan tanpa hipotesis = tenggelam dalam 10.000 edge. Tulis hipotesismu SEBELUM menjalankan BFS.",
      },
      reference: "Hipotesis dulu, bukti kemudian. Metodologi (batas hop) menentukan temuan.",
    },
    {
      id: "eksplorasi",
      eyebrow: "Langkah 2 · Eksplorasi",
      title: "Mengenal S dalam 5 menit",
      prose: [
        "Edge list kasus (from, to, amount ETH, blok): S→A 50, S→B 30, A→C 48, B→D 28, C→MIX 45, D→E 20. Umur dompet S: 5 hari (baru). Label yang diketahui: MIX = mixer yang dipantau.",
        "Eksplorasi 5 menit menjawab: (1) berapa total keluar dari S? (2) ke berapa counterparty langsung? (3) apakah polanya kipas (one→many)? Di sini: 80 ETH ke 2 counterparty — kipas kecil yang wajar untuk 'distribusi operasional' MAUPUN 'pemecahan awal'. Belum bisa disimpulkan — lanjutkan ke trace.",
        "Catatan metodologi (tulis di laporanmu nanti): sumber = edge list sintetis kasus; jendela = 6 edge; batas hop = 3 (dijustifikasi: anggaran investigasi + menghindari small-world noise).",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: eksplorasi = 'mengendus', bukan 'memvonis'",
        body: "Tujuan 5 menit pertama BUKAN kesimpulan — melainkan memutuskan APA yang layak dikejar. Tiga angka (total, counterparty, pola) cukup untuk memilih: 'lanjut trace' vs 'tutup sebagai normal'. Analis yang langsung melompat ke BFS 10 hop tanpa eksplorasi = memburu dengan mata tertutup. Analis yang berlama-lama di eksplorasi = tidak pernah berburu. 5 menit, tiga angka, satu keputusan: lanjut atau tutup.",
      },
      reference: "5 menit: total, counterparty, pola → keputusan lanjut/tutup.",
    },
    {
      id: "lab-trace",
      eyebrow: "Langkah 3 · Lab",
      title: "Trace 3 hop: menemukan mixer",
      prose: [
        "Hipotesis: 'S mencuci dana via mixer'. Bukti yang dicari: jejak ke MIX dalam ≤ 3 hop. Jalankan BFS dari S (maks 3 hop), catat di hop berapa MIX pertama kali muncul, hitung total outflow S, lalu hitung skor risiko fitur: mixer_prox (hop1=1.0, hop2=0.75, hop3=0.5, tidak ketemu=0; bobot 25) + new_addr (1.0 jika umur < 30 hari; bobot 10) + highrisk_share (fraksi outflow yang mencapai MIX; bobot 25).",
        "Tugasmu: (1) `outflow`, `n_cp` (counterparty langsung S); (2) `reach_n` (node terjangkau 3 hop), `hop_mixer`; (3) `score` (1 desimal) + `verdict` (HIGH/MEDIUM/LOW, ambang 60/30).",
      ],
      formula: String.raw`S = 25 \cdot prox_{mixer} + 10 \cdot baru + 25 \cdot \frac{ETH_{ke\ MIX}}{ETH_{keluar}}`,
      formulaNote: "prox_mixer: kedekatan hop ke mixer (1.0/0.75/0.5); baru: 1 jika umur < 30 hari; fraksi = porsi outflow S yang bermuara ke MIX. Ambang: ≥60 HIGH, ≥30 MEDIUM.",
      figure: {
        svg: BOARD_SVG,
        alt: "Papan investigasi: S ke A dan B, A ke C, B ke D, C ke mixer, D ke E. Mixer ditemukan di hop 3.",
        caption: "Papan kasus: 45 ETH (56% outflow) mencapai mixer di hop 3 — tak terlihat di 2 hop. Skor: 36,6 MEDIUM. Cara membaca: node = address, panah = aliran, label hop = jarak dari S; node merah = mixer. Interpretasi: 56% dana HILANG dari pantauan di hop 3 (masuk mixer) — investigasi 2-hop tidak akan pernah menemukannya. Dan 44% sisanya = titik intervensi. Jangan kejar yang hilang; pantau yang tertinggal.",
      },
      tasks: [
        { id: "t1", text: "Hitung `outflow` S dan `n_cp` (counterparty langsung)" },
        { id: "t2", text: "BFS 3 hop → `reach_n`, `hop_mixer` (hop pertama MIX muncul)" },
        { id: "t3", text: "Hitung `score` + `verdict`" },
        { id: "t4", text: "Cetak ringkasan investigasi" },
      ],
      expected: "outflow=80 ETH  cp=2  reach=7  hop_mixer=3  score=36.6 MEDIUM",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"MIX di hop 3 = tidak relevan, terlalu jauh.\" Justru ini inti capstone: pelaku SENGAJA menaruh 2 dompet penyangga (A→C) agar terlihat jauh. Kedekatan hop adalah fungsi UPAYA pelaku menyembunyikan, bukan fungsi ketidakbersalahan. Skor memberi bobot menurun (0.5, bukan 0) — tepat untuk menangkap 'jauh tapi terhubung'.",
      },
      hints: [
        "BFS seperti bcd10; simpan juga hop saat node ditemukan (dict node → hop).",
        "highrisk_share = 45 / 80 (ETH yang mencapai MIX dibagi outflow S).",
        "score = 25*0.5 + 10*1.0 + 25*(45/80); verdict via ambang 60/30.",
      ],
      code: {
        starter: `from collections import defaultdict\nedges = [("S","A",50,10),("S","B",30,11),("A","C",48,12),("B","D",28,13),("C","MIX",45,14),("D","E",20,15)]\nage_days = 5  # umur dompet S\nadj = defaultdict(list)\nfor f, t, a, b in edges:\n    adj[f].append(t)\n\n# BFS 3 hop (disiapkan) — pelajari polanya\nvisited = {"S": 0}\nfrontier = ["S"]\nfor _ in range(3):\n    nxt = []\n    for n in frontier:\n        for t in adj[n]:\n            if t not in visited:\n                visited[t] = visited[n] + 1\n                nxt.append(t)\n    frontier = nxt\n\n# TULIS KODEMU: metrik investigasi dari hasil BFS\noutflow = \nn_cp = \nreach_n = \nhop_mixer = \nprox = {1: 1.0, 2: 0.75, 3: 0.5}.get(hop_mixer, 0)\nscore = \nverdict = \n\nprint(f"outflow={outflow} ETH  cp={n_cp}  reach={reach_n}  hop_mixer={hop_mixer}  score={score} {verdict}")`,
        lockLines: 7,
        solution: `from collections import defaultdict\nedges = [("S","A",50,10),("S","B",30,11),("A","C",48,12),("B","D",28,13),("C","MIX",45,14),("D","E",20,15)]\nage_days = 5  # umur dompet S\nadj = defaultdict(list)\nfor f, t, a, b in edges:\n    adj[f].append(t)\n\n# BFS 3 hop + metrik investigasi\nvisited = {"S": 0}\nfrontier = ["S"]\nfor _ in range(3):\n    nxt = []\n    for n in frontier:\n        for t in adj[n]:\n            if t not in visited:\n                visited[t] = visited[n] + 1\n                nxt.append(t)\n    frontier = nxt\n\noutflow = sum(a for f, t, a, b in edges if f == "S")\nn_cp = len([t for f, t, a, b in edges if f == "S"])\nreach_n = len(visited)\nhop_mixer = visited.get("MIX")\nprox = {1: 1.0, 2: 0.75, 3: 0.5}.get(hop_mixer, 0)\nscore = round(25*prox + 10*(1.0 if age_days < 30 else 0.0) + 25*(45/outflow), 1)\nverdict = "HIGH" if score >= 60 else ("MEDIUM" if score >= 30 else "LOW")\n\nprint(f"outflow={outflow} ETH  cp={n_cp}  reach={reach_n}  hop_mixer={hop_mixer}  score={score} {verdict}")`,
        checks: [
          { kind: "equal", task: "t1", name: "outflow", value: 80, tol: 0, label: "`outflow` = 80", msg: "50 + 30 keluar dari S." },
          { kind: "equal", task: "t1", name: "n_cp", value: 2, tol: 0, label: "`n_cp` = 2", msg: "Counterparty langsung: A dan B." },
          { kind: "equal", task: "t2", name: "reach_n", value: 7, tol: 0, label: "`reach_n` = 7", msg: "S,A,B,C,D,MIX,E dalam 3 hop." },
          { kind: "equal", task: "t2", name: "hop_mixer", value: 3, tol: 0, label: "`hop_mixer` = 3", msg: "S→A→C→MIX. Tak terlihat di 2 hop!" },
          { kind: "equal", task: "t3", name: "score", value: 36.6, tol: 0.05, label: "`score` = 36.6", msg: "25×0.5 + 10×1 + 25×(45/80) = 36.5625." },
          { kind: "equal", task: "t3", name: "verdict", value: "MEDIUM", tol: 0, label: "`verdict` = MEDIUM", msg: "36.6 ≥ 30 dan < 60." },
          { kind: "stdout_matches", task: "t4", pattern: "hop_mixer=3\\s+score=36\\.6 MEDIUM", label: "Ringkasan tercetak", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Hipotesis → BFS berbatas → hop mixer → skor + kontributor → verdict.",
    },
    {
      id: "skor-konteks",
      eyebrow: "Langkah 4 · Interpretasi skor",
      title: "36,6 MEDIUM: apa artinya, apa tidak",
      prose: [
        "Skor 36,6 MEDIUM dengan kontributor: kedekatan mixer hop-3 (12,5 poin), dompet baru (10), 56% outflow ke mixer (14,1). Artinya: prioritas investigasi MENENGAH-TINGGI — bukan darurat blokir, bukan pula 'bersih'.",
        "Yang skor TIDAK katakan: apakah S pelaku atau korban (bisa jadi S ditipu mengirim ke 'investasi' yang bermuara ke mixer); apakah 45 ETH itu hasil kejahatan (belum ada label sumber); dan apa motifnya. Skor = ALOKASI PERHATIAN, bukan kesimpulan.",
        "Langkah verifikasi yang benar untuk MEDIUM: (a) minta sumber dana ke nasabah (jalur verifikasi bcd11); (b) pantau MIX: apakah 45 ETH di-withdraw ke mana (heuristik berpasangan bcd7); (c) cek label A/B/C/D — apakah ada yang dikenal; (d) dokumentasikan semuanya untuk potensi STR.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: MEDIUM adalah zona paling sulit — dan paling penting",
        body: "LOW mudah (proses), HIGH mudah (tahan + eskalasi). MEDIUM menuntut PENILAIAN: di sinilah analis dibayar. Godaan terbesar di zona MEDIUM adalah dua ekstrem — 'naikkan jadi HIGH biar aman' (malas berpikir) atau 'tutup sebagai LOW biar cepat' (malas bekerja). Disiplin: ikuti playbook MEDIUM (verifikasi + pantau + catat), jangan menggeser zona karena perasaan.",
      },
      reference: "MEDIUM = verifikasi + pantau + catat. Jangan geser zona karena perasaan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Playbook investigasi end-to-end",
      prose: [
        "Skenario 1 — Temuan seperti kasus S (MEDIUM, mixer hop-3): tahan penarikan besar 24 jam + minta sumber dana + pantau withdraw MIX. Keputusan final setelah verifikasi.",
        "Skenario 2 — Jika verifikasi gagal (nasabah bungkam/dokumen palsu): naikkan ke HIGH → eskalasi MLRO → pertimbangkan STR dengan lampiran graf + metodologi.",
        "Skenario 3 — Jika verifikasi lolos (sumber sah, mis. pembayaran bisnis yang kebetulan via mixer): turunkan ke LOW dengan catatan + monitoring 30 hari. Jangan hukum privasi yang sah.",
        "Skenario 4 — Jika MIX terkonfirmasi sebagai mixer yang DISANKSI: zona sanksi (bcd7) — tahan + lapor, apapun skornya. Sanksi mengalahkan skor.",
        "Aturan praktis 10 detik: hipotesis → bukti (trace+skor) → verifikasi manusia → keputusan ber-SLA → catatan lengkap. Lima langkah ini = seluruh track dalam satu kasus.",
      ],
      tasks: [],
      reference: "Hipotesis → bukti → verifikasi → keputusan ber-SLA → catatan. Sanksi mengalahkan skor.",
    },
    {
      id: "kesimpulan",
      eyebrow: "Langkah 6 · Kesimpulan",
      title: "Menulis laporan investigasi",
      prose: [
        "Laporan yang baik = satu halaman yang bisa dibaca manajer + lampiran yang bisa diaudit investigator. Struktur: (1) ringkasan eksekutif — temuan + rekomendasi dalam 3 kalimat; (2) metodologi — sumber data, batas hop + alasannya; (3) temuan — angka (outflow, hop mixer, skor + kontributor); (4) rekomendasi — tindakan + SLA; (5) lampiran — graf + edge list.",
        "Contoh ringkasan eksekutif kasus S: 'Dompet S (nasabah 5 hari) mengirim 80 ETH; 45 ETH (56%) mencapai mixer yang dipantau pada hop ke-3 — tidak terdeteksi pada trace 2 hop. Skor risiko 36,6 (MEDIUM): kontributor utama kedekatan mixer dan dompet baru. Rekomendasi: tahan penarikan > 10 ETH selama 24 jam, minta sumber dana tertulis, pantau withdraw dari mixer. Keputusan final maksimal H+1.'",
        "Yang membuat laporan ini kuat: angka spesifik (bukan 'diduga mencurigakan'), metodologi eksplisit (batas hop 3 + alasan), kontributor skor (bukan cuma angka), dan rekomendasi ber-SLA (bukan 'perlu ditindaklanjuti'). Inilah standar yang membedakan analis dari komentator.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan investigasi yang baik adalah DOKUMEN HUKUM potensial: ia bisa diminta regulator, auditor, atau pengadilan. Tulis setiap laporan seolah akan dibaca hakim: fakta terpisah dari opini ('45 ETH mencapai mixer' = fakta; 'diduga pencucian' = opini), metodologi eksplisit, dan timestamp. Analis yang menulis untuk manajer saja menulis setengah pekerjaan.",
      },
      reference: "Laporan = ringkasan 3 kalimat + metodologi + temuan angka + rekomendasi ber-SLA + lampiran.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Confidence level: kejujuran yang bisa dihitung",
      prose: [
        "Laporan investigasi yang baik tidak berkata `S mengirim ke mixer` — ia berkata `S → ... → M (mixer) dengan confidence TINGGI (3 hop, pola konsisten, 80 ETH utuh)` dan `M → X dengan confidence RENDAH (heuristik timing saja)`— dua klaim, dua confidence. Definisikan skala: TINGGI (> 90%) = bukti on-chain langsung (transfer tercatat, taint > 50%); SEDANG (50–90%) = heuristik ganda yang konsisten (timing + nominal + clustering); RENDAH (< 50%) = satu heuristik saja. Setiap kalimat laporan BERLABEL.",
        "Contoh laporan kasus S (80 ETH): (1) `S menerima 80 ETH dari 0xabc (phishing yang dilaporkan) [TINGGI — transfer tercatat]`; (2) `80 ETH bergerak S→A→B dalam 2 jam [TINGGI — taint 80%→32%]`; (3) `B→M adalah deposit mixer [TINGGI — M label mixer publik]`; (4) `M→X (12 ETH, 6 jam kemudian) kemungkinan pencucian [RENDAH — hanya timing, nominal beda]`; (5) `Total 45 ETH (56%) mencapai mixer di hop 3 [TINGGI]`. Lima klaim, lima label. Pembaca (penyidik, pengacara, direksi) tahu persis mana yang bisa dibawa ke pengadilan (1–3, 5) dan mana yang butuh kerja lanjut (4).",
        "Kenapa ini penting? Karena laporan tanpa confidence = SEMUA klaim terlihat sama kuatnya. Pengacara lawan akan menyerang klaim TERLEMAH (4) — dan jika laporan tidak melabelinya sebagai RENDAH, seluruh laporan terlihat tidak kredibel (`analisnya saja tidak tahu mana yang lemah`). Sebaliknya, laporan yang JUJUR tentang kelemahannya justru KUAT: `kami tahu batas bukti kami` = profesionalisme yang diakui pengadilan.",
        "Kasus freelancer 0xw1 (bcd11) sebagai pelajaran: laporan asli (imajiner) berkata `0xw1 TERHUBUNG dengan mixer (skor 72,5)` — tanpa label. Keputusan: bekukan. Dengan label: `0xw1 menerima 2 ETH dari mixer [TINGGI] — TAPI sebagai pembayaran freelance [SEDANG, dari invoice] — kemungkinan korban, bukan pelaku [SEDANG]`. Keputusan: EDD, bukan bekukan. SATU laporan yang sama, DUA keputusan berbeda — bedanya hanya confidence + konteks. Label menyelamatkan orang innocent.",
        "Format laporan 1 halaman (untuk latihan kasus kedua di bawah): (1) RINGKASAN — 3 kalimat: apa, berapa, ke mana. (2) ALIRAN — hop per hop dengan taint + confidence. (3) TEMUAN KUNCI — mixer? exchange? pola? (4) BATAS — apa yang TIDAK bisa dibuktikan. (5) REKOMENDASI — kejar / pantau / tutup, dengan alasan. Bagian (4) adalah yang paling penting dan paling sering hilang — tulis dengan bangga, bukan malu.",
        "Latihan: tulis laporan 1 halaman untuk kasus S di atas (sebelum melihat kasus kedua). Minta teman menilai: apakah ia bisa membedakan klaim TINGGI vs RENDAH? Jika tidak — label-mu kurang jelas. Laporan investigasi dinilai bukan dari `menariknya`, melainkan dari `bisakah orang lain membuat keputusan yang benar darinya`.",
      ],
      formula: String.raw`\text{keputusan} = f(\text{skor}, \text{confidence}, \text{konteks})`,
      formulaNote: "Skor saja tidak cukup (freelancer 72,5!). Keputusan = skor × confidence × konteks. Skor HIGH + confidence RENDAH + konteks korban = EDD, bukan bekukan. Tulis ketiganya di laporan.",
      figure: {
        svg: BCD12_DEEP_SVG,
        alt: "Diagram batang confidence: klaim 1-3,5 tinggi (>90%), klaim 4 rendah (35%).",
        caption: "Cara membaca: tiap batang = confidence satu klaim laporan. Interpretasi: klaim 4 (M→X) hanya 35% — ia butuh kerja lanjut, BUKAN dibawa ke pengadilan. Laporan yang melabeli kelemahannya = laporan yang kuat; yang menyembunyikan = bom waktu.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: labeli kelemahanmu — itu kekuatan",
        body: "Pengacara lawan AKAN menemukan klaim terlemahmu. Jika kamu sudah melabelinya RENDAH + menjelaskan butuh kerja lanjut, serangan itu mental. Jika kamu menyajikannya sebagai fakta, seluruh laporanmu runtuh. Kejujuran tentang batas bukti = profesionalisme.",
      },
      reference: "Format 1 halaman: ringkasan, aliran, temuan, BATAS, rekomendasi. Bagian batas paling penting.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Kasus Kedua",
      title: "Latihan kelulusan: 12 ETH yang berhenti di mixer",
      prose: [
        "Kasus kedua — kerjakan mandiri, lalu cocokkan dengan pembahasan. Dompet Q menerima 12 ETH dari 0xdef (dilaporkan sebagai hasil phishing) pada hari Senin 10:00. Dalam 6 jam, 12 ETH bergerak: Q → R (12 ETH, 11:30) → S (7 ETH, 13:00; 5 ETH tetap di R) → T (7 ETH, 15:45). T adalah mixer yang sudah dilabeli publik. Pertanyaan: (1) Hitung taint tiap hop (asumsi tidak ada dana bersih campuran). (2) Berapa % dana mencapai mixer, di hop berapa? (3) Tulis 3 klaim berlabel confidence. (4) Rekomendasi: kejar, pantau, atau tutup?",
        "Pembahasan: (1) Taint: Q = 100% (12/12 kotor). R = 100% (12 dari Q, tanpa campuran). S = 100% (7 dari R). T = mixer → taint teknis 0% keluar, tapi flag hop_mixer. (2) 7 ETH (58%) mencapai mixer di hop 3 (Q→R→S→T = 3 hop). 5 ETH (42%) TERTINGGAL di R — ini TEMUAN KUNCI: pelaku tidak mencuci semua! (3) Klaim: `Q menerima 12 ETH phishing [TINGGI]`; `7 ETH mencapai mixer T di hop 3 [TINGGI]`; `5 ETH di R adalah dana pelaku yang belum dicuci [SEDANG — bisa jadi sengaja disisakan atau lupa]`; (4) Rekomendasi: PANTAU R (5 ETH masih di sana = peluang penyitaan/pelacakan lanjut!) + tandai T via heuristik mixer.",
        "Perhatikan perbedaan dengan kasus S (80 ETH): kasus ini LEBIH KECIL tapi punya `sisa` (5 ETH di R) — justru lebih actionable! Kasus besar yang 100% masuk mixer = jalan buntu (tunggu heuristik). Kasus kecil dengan sisa = pintu masuk. Pelajaran kelulusan: nilai investigasi BUKAN dari besarnya dana, melainkan dari ADA TIDAKNYA titik intervensi. 5 ETH yang bisa dipantau > 80 ETH yang hilang di mixer.",
        "Cek pemahamanmu: jika 5 ETH di R kemudian bergerak R → U (exchange KYC!) — apa artinya? Taint U = 100% × (5/5) = 100% (jika U hanya terima itu). Confidence TINGGI + exchange punya KYC = PELUANG IDENTIFIKASI. Inilah `rantai sekuat mata terlemah` versi penyerang: satu kesalahan (kirim ke exchange KYC) = seluruh rantai teridentifikasi. Investigasi yang sabar menunggu kesalahan seperti ini — bukan yang terburu-buru menyimpulkan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: cari yang tertinggal, bukan yang hilang",
        body: "80 ETH yang masuk mixer = jalan buntu (untuk sekarang). 5 ETH yang tertinggal di R = peluang. Investigator pemula mengejar yang besar dan hilang; yang profesional memantau yang kecil dan tertinggal. Titik intervensi > ukuran kasus.",
      },
      reference: "Laporan 1 halaman untuk kasus Q sebagai latihan. Nilai: bisakah orang lain memutuskan dari laporanmu?",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan — capstone menuntut standar lebih tinggi. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Investigasi = hipotesis-driven: hipotesis → bukti → verifikasi → keputusan.",
        "Metodologi (batas hop) menentukan temuan — mixer di hop 3 tak terlihat di 2 hop.",
        "Skor = alokasi perhatian + kontributor; MEDIUM menuntut penilaian, bukan kemalasan.",
        "Playbook: verifikasi ber-SLA; sanksi mengalahkan skor.",
        "Laporan: fakta vs opini terpisah, metodologi eksplisit, rekomendasi ber-SLA.",
        "Seluruh track dalam satu kasus: cluster → DeFi → tokenomics → fraud → MEV → SQL → graph → risk.",
      ],
      next: { label: "BCD13 — Cross-Chain & Bridge Tracing", href: "/learn/bcd13-cross-chain" },
      quiz: [
        {
          q: "Mengapa analis pendahulu (trace 2 hop) menulis 'bersih' sementara kamu menemukan mixer?",
          options: [
            { text: "Karena datanya berbeda", why: "Data sama — yang beda metodologinya." },
            { text: "Karena batas hop menentukan temuan: MIX di hop 3 tak terjangkau 2 hop — metodologi harus didokumentasikan & dijustifikasi", why: "Pelajaran capstone: temuan adalah fungsi metode.", correct: true },
            { text: "Karena analis pendahulu tidak becus", why: "Ia mengikuti anggaran standar — masalahnya anggaran, bukan orangnya." },
            { text: "Karena mixer baru muncul belakangan", why: "Edge C→MIX sudah ada di data sejak awal." },
          ],
        },
        {
          q: "Skor S = 36,6 MEDIUM. Rekomendasi yang tepat?",
          options: [
            { text: "Blokir permanen — ada mixer", why: "MEDIUM ≠ HIGH; blokir permanen tanpa verifikasi = menghukum mungkin-korban." },
            { text: "Tahan penarikan besar 24 jam + minta sumber dana + pantau MIX; keputusan final H+1", why: "Playbook MEDIUM: verifikasi ber-SLA, bukan vonis.", correct: true },
            { text: "Proses normal — skor di bawah 60", why: "Mengabaikan 56% outflow ke mixer = lalai." },
            { text: "Naikkan manual jadi HIGH biar aman", why: "Menggeser zona karena perasaan = melanggar disiplin playbook." },
          ],
        },
        {
          q: "Kontributor skor S: mixer hop-3 (12,5) + dompet baru (10) + 56% ke mixer (14,1). Mengapa kontributor wajib dilaporkan?",
          options: [
            { text: "Agar laporan terlihat panjang", why: "Bukan soal panjang." },
            { text: "Karena angka 36,6 saja menyembunyikan cerita — kontributor menentukan urgensi & jalur verifikasi", why: "Skor sama dengan kontributor beda = kasus beda (bcd11).", correct: true },
            { text: "Karena regulator meminta 3 angka", why: "Regulator meminta pemahaman, bukan jumlah angka." },
            { text: "Tidak wajib — angka cukup", why: "Angka tanpa 'mengapa' = keputusan tanpa dasar." },
          ],
        },
        {
          q: "Jika MIX terkonfirmasi sebagai mixer yang DISANKSI, apa yang berubah?",
          options: [
            { text: "Tidak ada — skor tetap 36,6", why: "Sanksi adalah rezim hukum terpisah yang mengalahkan skor." },
            { text: "Masuk zona sanksi: tahan + lapor apapun skornya — sanksi mengalahkan skor", why: "Pelanggaran sanksi = denda miliaran dolar; ini bukan diskresi analis.", correct: true },
            { text: "Skor otomatis jadi 100", why: "Tidak ada rumus seperti itu — yang berubah adalah PLAYBOOK, bukan angka." },
            { text: "Tutup kasus — sudah jelas", why: "'Sudah jelas' tanpa prosedur = blunder compliance." },
          ],
        },
        {
          q: "Kalimat laporan: 'S diduga mencuci uang.' Masalahnya?",
          options: [
            { text: "Tidak ada — itu kesimpulan wajar", why: "Itu opini yang ditulis sebagai fakta." },
            { text: "Mencampur fakta dan opini: fakta = '45 ETH mencapai mixer di hop 3'; opini = 'diduga pencucian' — harus terpisah", why: "Laporan yang bisa diaudit memisahkan keduanya.", correct: true },
            { text: "Terlalu pendek", why: "Panjang bukan masalahnya." },
            { text: "Seharusnya lebih tegas", why: "Ketegasan tanpa pemisahan fakta/opini = fitnah terdokumentasi." },
          ],
        },
        {
          q: "Sepanjang track ini, benang merah metodologinya adalah…",
          options: [
            { text: "Semakin banyak data semakin baik", why: "Tanpa hipotesis, data = kebisingan." },
            { text: "Hipotesis → bukti terukur → verifikasi konteks/manusia → keputusan tercatat", why: "Dari clustering (hipotesis kepemilikan) hingga capstone — polanya sama.", correct: true },
            { text: "Otomatisasi penuh tanpa manusia", why: "Setiap lesson menekankan verifikasi manusia (flag≠vonis)." },
            { text: "Skor tertinggi = prioritas tertinggi", why: "Kontributor, konteks, dan sanksi bisa mengalahkan angka." },
          ],
        },
      ],
    },
  ],
};
