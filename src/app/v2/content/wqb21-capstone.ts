import type { V2Lesson } from "../lib/types";

const FIG_ALUR = `<svg viewBox="0 0 480 336" role="img" aria-label="Flowchart empat saringan keputusan.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Alur 4 saringan: 12 kandidat → jadwal</text>
<rect x="170" y="40" width="140" height="30" fill="var(--c1)" opacity="0.9"/>
<text x="240" y="60" font-size="12" fill="var(--chart-text)" text-anchor="middle">12 kandidat</text>
<polygon points="240,78 300,108 240,138 180,108" fill="var(--c2)" opacity="0.9"/>
<text x="240" y="112" font-size="11" fill="var(--chart-text)" text-anchor="middle">Saringan 1: triage</text>
<text x="320" y="112" font-size="11" fill="var(--chart-text)">→ 3 BUANG</text>
<polygon points="240,146 300,176 240,206 180,176" fill="var(--c2)" opacity="0.9"/>
<text x="240" y="180" font-size="11" fill="var(--chart-text)" text-anchor="middle">Saringan 2: turnover</text>
<text x="320" y="180" font-size="11" fill="var(--chart-text)">→ 4 TAHAN</text>
<polygon points="240,214 300,244 240,274 180,244" fill="var(--c2)" opacity="0.9"/>
<text x="240" y="248" font-size="11" fill="var(--chart-text)" text-anchor="middle">Saringan 3: klaster</text>
<text x="320" y="248" font-size="11" fill="var(--chart-text)">→ 5 layak</text>
<rect x="170" y="282" width="140" height="32" fill="var(--c4)" opacity="0.9"/>
<text x="240" y="303" font-size="11" fill="var(--chart-text)" text-anchor="middle">Saringan 4: jadwal 2/hari</text>
</g>
</svg>`;

export const wqb21: V2Lesson = {
  slug: "wqb21-capstone",
  track: "WorldQuant Brain",
  module: "Strategi Riset Alpha",
  title: "WQB21 — Capstone Tengah (Review Wave): Membaca Satu Paket Wave & Memutuskan",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Meja review terakhir",
      prose: [
        "Pukul 21.00, sebuah tim riset menutup wave 100 kandidat. Di layar: 100 baris angka — Sharpe, fitness, turnover, decay, family, status check. Manajer berkata: 'Besok pagi saya mau daftarnya: mana yang disubmit, mana yang ditahan, mana yang dibuang — dan untuk tiap baris, satu kalimat alasan.' Ruangan hening. Seratus baris, seratus keputusan, satu malam.",
        "Analis termuda mengangkat tangan: 'Kita tidak memutuskan 100 hal. Kita menjalankan 4 saringan.' Triage: buang yang gagal gerbang. Penalti: tandai yang turnover-nya boros. Klaster: kelompokkan yang sekeluarga. Ekonomi: tanyakan untuk tiap yang lolos — submit sekarang untuk apa? Pukul 23.00 daftarnya selesai: 9 submit, 21 tahan, 70 buang — tiap baris satu kalimat.",
        "Twist-nya: keputusan tersulit malam itu BUKAN yang dibuang — melainkan satu kandidat Sharpe 2,6 yang 'ditahan'. Semua orang ingin mensubmitnya. Saringannya berkata: turnover 58%, klaster-nya sudah punya 2 anggota disubmit. Menahannya terasa seperti membuang uang. Tiga minggu kemudian klaster itu gagal self-corr — dan 'uang yang dibuang' itu ternyata biaya yang tidak jadi dikeluarkan.",
        "Capstone ini = malam itu, versi latihan. Kamu mendapat paket 12 kandidat. Terapkan 4 saringan. Hasilkan daftar submit/tahan/buang. Setelah lesson ini kamu bisa: (1) menjalankan triage berlapis pada paket hasil; (2) menerapkan penalti turnover & logika klaster; (3) menyusun rencana '2 Excellent per hari'; (4) menulis satu kalimat alasan per keputusan; (5) menjelaskan kapan menahan yang bagus adalah keputusan benar.",
        "Penanda jujur: ini CAPSTONE TENGAH (review wave) — bukan penutup track. Ia hanya memakai materi WQB11–19; materi submit dan produksi (margin, OS/decay, tipe submit ATOM/pyramid/power pool, portofolio, SuperAlpha) baru datang di WQB22–29 dan diuji di capstone akhir WQB30. Menyelesaikan lesson ini berarti menyelesaikan separuh jalan, bukan garis finis.",
      ],
      tasks: [],
      note: {
        title: "Empat saringan",
        body: "Saringan 1 — Triage: BUANG (S<1,25 atau F<1) · TAHAN (S<1,4 atau F<1,1) · ANTRIAN (S≥1,25 & F≥1). Saringan 2 — Penalti: TO>40% prioritas turun; TO>70% gagal. Saringan 3 — Klaster: sekeluarga = satu taruhan. Saringan 4 — Ekonomi: submit untuk apa, kapan, dari klaster mana.",
      },
      reference: "100 baris = 4 saringan, bukan 100 keputusan.",
    },
    {
      id: "paket",
      eyebrow: "Langkah 2 · Data",
      title: "Paket 12 kandidat",
      prose: [
        "Pelajari tabel ini baik-baik — semua keputusan capstone merujuk ke sini. (S = Sharpe, F = fitness, TO = turnover, d = decay; check: OK/gagal.)",
        "K1: S 2,9 · F 1,3 · TO 66% · d2 · orth · check OK. K2: S 2,4 · F 2,1 · TO 25% · d2 · slowrev · check OK. K3: S 1,9 · F 1,6 · TO 30% · d4 · correst · check OK. K4: S 1,3 · F 1,05 · TO 20% · d4 · vol · check OK. K5: S 2,2 · F 0,9 · TO 74% · d2 · orth · check OK. K6: S 1,1 · F 0,8 · TO 15% · d4 · liq · check OK. K7: S 2,5 · F 1,9 · TO 28% · d8 · orth · check OK. K8: S 1,8 · F 1,45 · TO 35% · d4 · gap · check GAGAL sub-universe. K9: S 2,0 · F 1,7 · TO 22% · d2 · slowrev · check OK. K10: S 1,6 · F 1,2 · TO 45% · d4 · fund · check OK. K11: S 2,7 · F 2,05 · TO 24% · d8 · correst · check OK. K12: S 1,4 · F 1,0 · TO 55% · d4 · range · check OK.",
        "Catatan klaster: K2 & K9 sefamily (slowrev); K1, K5, K7 sefamily (orth); K3 & K11 sefamily (correst). Sisanya klaster sendiri. Aturan main: target 2 Excellent/hari; maksimal 1 submit per klaster per hari; status konsultan BELUM tiba (submit = tanpa komisi — tetapi latihan ini mensimulasikan hari-H operasional).",
        "Tugas bacamu sebelum lanjut: tandai sendiri tiap kandidat (submit/tahan/buang + satu kalimat). Bandingkan dengan pembahasan di langkah 5 — di sanalah nilaimu.",
      ],
      tasks: [],
      note: {
        title: "Cara membaca paket",
        type: "pitfall",
        body: "Jangan mulai dari Sharpe tertinggi (K1: 2,9). Mulai dari saringan 1 (gerbang), lalu 2 (turnover), lalu 3 (klaster), lalu 4 (ekonomi). Urutan saringan = urutan berpikir; melompat ke 'yang angkanya bagus' = cara tercepat salah.",
      },
      hints: [
        "Excellent = F > 2,0: hanya K2 (2,1) dan K11 (2,05).",
        "TO > 70%: K5. Check gagal: K8.",
      ],
      reference: "Saring berurutan: gerbang → turnover → klaster → ekonomi.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Mesin keputusan: tulis 4 saringannya",
      prose: [
        "Implementasikan fungsi `keputusan(k)` yang menerima tuple (nama, S, F, TO, family, check_ok) dan mengembalikan 'SUBMIT', 'TAHAN', atau 'BUANG' mengikuti 4 saringan: (1) check gagal → BUANG; S<1,25 atau F<1 → BUANG; (2) TO>70 → BUANG; (3) S≥1,25 & F≥1 & TO≤40 → kandidat SUBMIT; TO 40–70 → TAHAN (penalti); S<1,4 atau F<1,1 → TAHAN; (4) klaster & ekonomi ditangani manual di langkah 5. Satu penegasan: 'BUANG' dari mesin artinya singkirkan dari antrean submit hari ini, bukan hapus ide di baliknya — kandidat seperti itu hanya boleh kembali lewat diet turnover yang terbukti menurunkan angkanya, bukan dengan melonggarkan ambang 70%.",
        "Jalankan pada 12 kandidat paket dan bandingkan dengan penilaian manualmu. Beda = bahan diskusi terbaik.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `keputusan(k)` dengan 4 saringan" },
        { id: "t2", text: "Jalankan pada 12 kandidat, cetak hasilnya" },
      ],
      expected: "K1: TAHAN\nK2: SUBMIT\nK3: SUBMIT\nK4: TAHAN\nK5: BUANG\nK6: BUANG\nK7: SUBMIT\nK8: BUANG\nK9: SUBMIT\nK10: TAHAN\nK11: SUBMIT\nK12: TAHAN",
      note: {
        title: "Intuisi",
        body: "Mesin ini tidak menggantikan penilaianmu — ia menstandarkannya. Perbedaan mesin vs manual biasanya di klaster & ekonomi (saringan 3–4), dan di situlah keahlian manusia tinggal.",
      },
      hints: [
        "Urutan if: check_ok False → BUANG; TO > 70 → BUANG; S<1,25 or F<1 → BUANG.",
        "Lalu: TO > 40 → TAHAN; S<1,4 or F<1,1 → TAHAN; else SUBMIT.",
      ],
      code: {
        starter: "# (nama, Sharpe, fitness, TO_%, family, check_ok). JANGAN UBAH.\npaket = [\n    (\"K1\", 2.9, 1.3, 66, \"orth\", True), (\"K2\", 2.4, 2.1, 25, \"slowrev\", True),\n    (\"K3\", 1.9, 1.6, 30, \"correst\", True), (\"K4\", 1.3, 1.05, 20, \"vol\", True),\n    (\"K5\", 2.2, 0.9, 74, \"orth\", True), (\"K6\", 1.1, 0.8, 15, \"liq\", True),\n    (\"K7\", 2.5, 1.9, 28, \"orth\", True), (\"K8\", 1.8, 1.45, 35, \"gap\", False),\n    (\"K9\", 2.0, 1.7, 22, \"slowrev\", True), (\"K10\", 1.6, 1.2, 45, \"fund\", True),\n    (\"K11\", 2.7, 2.05, 24, \"correst\", True), (\"K12\", 1.4, 1.0, 55, \"range\", True),\n]\n\n# TULIS KODEMU\ndef keputusan(k):\n    nama, S, F, TO, fam, ok = k\n    return  # 'SUBMIT' / 'TAHAN' / 'BUANG'\n\nfor k in paket:\n    print(f\"{k[0]}: {keputusan(k)}\")\n",
        lockLines: 9,
        solution: "# (nama, Sharpe, fitness, TO_%, family, check_ok). JANGAN UBAH.\npaket = [\n    (\"K1\", 2.9, 1.3, 66, \"orth\", True), (\"K2\", 2.4, 2.1, 25, \"slowrev\", True),\n    (\"K3\", 1.9, 1.6, 30, \"correst\", True), (\"K4\", 1.3, 1.05, 20, \"vol\", True),\n    (\"K5\", 2.2, 0.9, 74, \"orth\", True), (\"K6\", 1.1, 0.8, 15, \"liq\", True),\n    (\"K7\", 2.5, 1.9, 28, \"orth\", True), (\"K8\", 1.8, 1.45, 35, \"gap\", False),\n    (\"K9\", 2.0, 1.7, 22, \"slowrev\", True), (\"K10\", 1.6, 1.2, 45, \"fund\", True),\n    (\"K11\", 2.7, 2.05, 24, \"correst\", True), (\"K12\", 1.4, 1.0, 55, \"range\", True),\n]\n\n# TULIS KODEMU\ndef keputusan(k):\n    nama, S, F, TO, fam, ok = k\n    if not ok:\n        return \"BUANG\"\n    if TO > 70:\n        return \"BUANG\"\n    if S < 1.25 or F < 1.0:\n        return \"BUANG\"\n    if TO > 40:\n        return \"TAHAN\"\n    if S < 1.4 or F < 1.1:\n        return \"TAHAN\"\n    return \"SUBMIT\"\n\nfor k in paket:\n    print(f\"{k[0]}: {keputusan(k)}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "K5 BUANG (TO 74%)", msg: "TO 74 > 70 → BUANG walau S 2,2.", pattern: "K5: BUANG" },
          { kind: "stdout_matches", task: "t2", label: "K8 BUANG (check gagal)", msg: "Check sub-universe gagal → BUANG.", pattern: "K8: BUANG" },
          { kind: "stdout_matches", task: "t2", label: "K2 SUBMIT (Excellent)", msg: "S 2,4 F 2,1 TO 25 → SUBMIT.", pattern: "K2: SUBMIT" },
          { kind: "stdout_matches", task: "t2", label: "K1 TAHAN (penalti TO)", msg: "S 2,9 tetapi TO 66 > 40 → TAHAN.", pattern: "K1: TAHAN" },
          { kind: "stdout_matches", task: "t2", label: "K11 SUBMIT", msg: "S 2,7 F 2,05 TO 24 → SUBMIT.", pattern: "K11: SUBMIT" }
        ],
      },
      reference: "Mesin menstandarkan; manusia memutuskan klaster & ekonomi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Dari mesin ke meja: saringan 3 & 4",
      prose: [
        "Mesin memberi: SUBMIT = K2, K3, K7, K9, K11 (5 kandidat); TAHAN = K1, K4, K10, K12; BUANG = K5, K6, K8. Sekarang saringan 3 (klaster): K2 & K9 sefamily slowrev — pilih SATU untuk hari ini (K2: Excellent 2,1 > K9: 1,7). K1, K5, K7 sefamily orth — K5 sudah buang; K1 TAHAN (penalti TO), K7 SUBMIT. K3 & K11 sefamily correst — keduanya SUBMIT mesin, tetapi aturan 'maks 1 per klaster per hari' → pilih K11 (Excellent 2,05) hari ini, K3 antre besok.",
        "Saringan 4 (ekonomi & target): target 2 Excellent/hari → hari ini: K2 (slowrev, F 2,1) + K11 (correst, F 2,05) — dua klaster berbeda, keduanya Excellent. K7 (F 1,9, Good) = cadangan besok. K3 (F 1,6) = antrean. K1 (S 2,9, TO 66%) = TAHAN dengan rencana diet turnover — submitnya menunggu versi dietnya, bukan angkanya.",
        "Cara membaca figur: alur keputusan dari atas (paket 12) ke bawah (jadwal harian) — tiap belah ketupat adalah saringan dengan kriteria tertulis. Interpretasi: hanya 5 dari 12 yang mencapai kotak 'jadwal'; 7 lainnya gugur di saringan 1–3 dengan alasan tercatat. Inilah yang membedakan review sistematis dari 'feeling'.",
        "Aturan praktis 10 detik: mesin → klaster (1/klaster/hari) → 2 Excellent beda klaster → sisanya antre. Keputusan tanpa klaster = keputusan setengah.",
      ],
      figure: {
        svg: FIG_ALUR,
        alt: "Flowchart 4 saringan: 12 kandidat menjadi jadwal submit harian.",
        caption: "12 → saringan 1–3 → 5 layak → saringan 4 → jadwal 2 Excellent/hari.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Perhatikan K1: Sharpe TERTINGGI paket (2,9) tetapi tidak disubmit hari ini — bukan karena jelek, melainkan karena (a) turnover 66% butuh diet, (b) slot orth hari ini dipakai K7 yang lebih seimbang. Disiplin > nafsu angka.",
      },
      reference: "2 Excellent beda klaster hari ini; sisanya antre dengan alasan.",
    },
    {
      id: "pembahasan",
      eyebrow: "Langkah 5 · Pembahasan",
      title: "Kunci jawaban: 12 keputusan",
      prose: [
        "K1 TAHAN — 'Sharpe 2,9 memesona tetapi TO 66% butuh diet; slot orth dipakai K7.' K2 SUBMIT — 'Excellent 2,1, TO 25%, klaster slowrev hari ini.' K3 TAHAN/ANTRE — 'Lolos mesin, tetapi slot correst dipakai K11 (Excellent); antre besok.' K4 TAHAN — 'S 1,3/F 1,05 mepet ambang; pantau, jangan submit.' K5 BUANG — 'TO 74% gagal gerbang; selamatkan strukturnya bila mau.' K6 BUANG — 'Gagal gerbang kualitas (S 1,1, F 0,8).' K7 SUBMIT (cadangan) — 'F 1,9 Good, TO 28%; submit bila butuh pengisi hari ini, atau tahan untuk besok.' K8 BUANG — 'Gagal sub-universe: sinyal tidak robust.' K9 TAHAN — 'Bagus (F 1,7) tetapi slot slowrev dipakai K2; antre.' K10 TAHAN — 'TO 45% penalti; butuh diet.' K11 SUBMIT — 'Excellent 2,05, TO 24%, klaster correst hari ini.' K12 TAHAN — 'F 1,0 pas ambang + TO 55%; terlalu rapuh untuk submit.'",
        "Bandingkan dengan jawabanmu. Setiap perbedaan = diskusi: apakah alasanmu sekuat alasan kunci? Dalam review nyata tidak ada 'kunci jawaban' — yang ada hanya alasan yang bisa dipertahankan di depan tim.",
        "What-if untuk mengasah: (1) Bagaimana bila K11 ternyata gagal self-corr manual? Maka slot correst hari-1 kosong — naikkan K3 ke hari-1? Tidak: K3 hanya Good 1,6; aturan '2 Excellent/hari' memaksa mencari Excellent pengganti (K7? bukan Excellent) — jawabannya: hari-1 hanya submit K2, dan wave berikutnya diprioritaskan mencari Excellent correst. Target harian boleh meleset sehari; yang tidak boleh = menurunkan standar demi mengisi slot. (2) Bagaimana bila K5 (TO 74%) 'diperbaiki' menjadi TO 65% lewat diet? Maka ia lolos gerbang 70% → TAHAN (bukan BUANG), masuk antrean diet orth bersama K1 — tetapi slot orth tetap terbatas; diet bukan tiket submit otomatis. (3) Bagaimana bila muncul K13: S 3,5, F 2,8, TO 15%, family BARU (vol-of-vol), check OK? Maka ia Excellent klaster baru — langsung hari-1 menggantikan? Tidak menggantikan K2/K11 (keduanya Excellent juga) — ia menjadi hari-2 bersama K7, menggeser K9 ke hari-3. Prinsip: klaster baru = prioritas diversifikasi, bukan pengganti yang sudah terjadwal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Format 'keputusan + satu kalimat alasan' adalah inti risk reporting juga: komite tidak membaca 100 baris — ia membaca keputusan dan alasannya. Latihan ini melatih otot yang sama.",
      },
      reference: "Tidak ada kunci mutlak — hanya alasan yang bisa dipertahankan.",
    },
    {
      id: "lab-jadwal",
      eyebrow: "Langkah 6 · Lab",
      title: "Susun jadwal submit 3 hari",
      prose: [
        "Lima kandidat lolos mesin: K2 (slowrev, F 2,1), K3 (correst, F 1,6), K7 (orth, F 1,9), K9 (slowrev, F 1,7), K11 (correst, F 2,05). Aturan jadwal: maksimal 2 per hari, maksimal 1 per klaster per hari, Excellent (> 2,0) didahulukan. Tugasmu: tulis penjadwal greedy (urutkan: Excellent dulu, lalu fitness tertinggi) dan cetak jadwal 3 hari.",
        "Eksperimen setelah selesai: ubah aturan menjadi 'maksimal 3 per hari' — bagaimana jadwalnya? Kapan aturan longgar justru berbahaya? (Petunjuk: pikirkan self-correlation antar hari.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis loop penjadwalan greedy" },
        { id: "t2", text: "Cetak jadwal 3 hari" },
      ],
      expected: "Hari 1: K2 (slowrev, Excellent), K11 (correst, Excellent)\nHari 2: K7 (orth, Good), K9 (slowrev, Good)\nHari 3: K3 (correst, Good)",
      note: {
        title: "Intuisi",
        body: "Penjadwalan greedy ini = 'waterfall' operasional konsultan: yang terbaik dan paling aman dulu, sisanya mengalir ke hari berikut. Sederhana, transparan, bisa diaudit — tiga sifat yang disukai komite mana pun.",
      },
      hints: [
        "Urutkan: key = (-(F > 2.0), -F).",
        "Tiap hari: ambil yang klasternya belum dipakai hari itu, maks 2.",
      ],
      code: {
        starter: "# (nama, family, fitness). JANGAN UBAH.\nkandidat = [(\"K2\", \"slowrev\", 2.1), (\"K3\", \"correst\", 1.6), (\"K7\", \"orth\", 1.9),\n            (\"K9\", \"slowrev\", 1.7), (\"K11\", \"correst\", 2.05)]\n\n# TULIS KODEMU\ndef kat(f):\n    return \"Excellent\" if f > 2.0 else \"Good\"\n\nsisa = sorted(kandidat, key=lambda k: (-(k[2] > 2.0), -k[2]))\nhari = 1\nwhile sisa:\n    pass  # pilih maks 2, klaster berbeda; cetak; hari += 1\n",
        lockLines: 3,
        solution: "# (nama, family, fitness). JANGAN UBAH.\nkandidat = [(\"K2\", \"slowrev\", 2.1), (\"K3\", \"correst\", 1.6), (\"K7\", \"orth\", 1.9),\n            (\"K9\", \"slowrev\", 1.7), (\"K11\", \"correst\", 2.05)]\n\n# TULIS KODEMU\ndef kat(f):\n    return \"Excellent\" if f > 2.0 else \"Good\"\n\nsisa = sorted(kandidat, key=lambda k: (-(k[2] > 2.0), -k[2]))\nhari = 1\nwhile sisa:\n    pilih, dipakai = [], set()\n    for k in list(sisa):\n        if len(pilih) < 2 and k[1] not in dipakai:\n            pilih.append(k)\n            dipakai.add(k[1])\n            sisa.remove(k)\n    print(f\"Hari {hari}: \" + \", \".join(f\"{n} ({f}, {kat(fi)})\" for n, f, fi in pilih))\n    hari += 1\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Hari 1 = 2 Excellent", msg: "K2 + K11, klaster berbeda.", pattern: "Hari 1: K2 \\(slowrev, Excellent\\), K11 \\(correst, Excellent\\)" },
          { kind: "stdout_matches", task: "t2", label: "Hari 3 = K3", msg: "Sisa terakhir.", pattern: "Hari 3: K3 \\(correst, Good\\)" }
        ],
      },
      reference: "Yang terbaik dulu, klaster berbeda, sisanya mengalir.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Latihan mandiri: paket 6 kandidat",
      prose: [
        "Sekarang giliranmu tanpa kunci jawaban di depan mata. Paket mini 6 kandidat — terapkan 4 saringan dan tulis keputusan + satu kalimat alasan untuk tiap kandidat SEBELUM membaca pembahasan.",
        "M1: S 2,2 · F 2,3 · TO 18% · d4 · vol · check OK. M2: S 1,0 · F 1,2 · TO 25% · d4 · liq · check OK. M3: S 2,8 · F 1,4 · TO 72% · d2 · orth · check OK. M4: S 1,7 · F 1,8 · TO 30% · d8 · fund · check OK. M5: S 2,0 · F 2,1 · TO 26% · d2 · vol · check OK (sefamily dengan M1). M6: S 1,5 · F 1,1 · TO 42% · d4 · gap · check OK.",
        "Pembahasan: M1 SUBMIT — Excellent 2,3, TO 18%, klaster vol hari ini. M2 BUANG — S 1,0 < 1,25 gagal gerbang (F 1,2 tidak menyelamatkan). M3 TAHAN — S 2,8 memesona tetapi TO 72% > 70% gagal gerbang; selamatkan strukturnya (diet), jangan submit. M4 SUBMIT — F 1,8 Good, TO 30% sehat, klaster fund sendiri. M5 TAHAN — Excellent 2,1 tetapi sefamily dengan M1 yang sudah submit hari ini; antre besok (aturan 1/klaster/hari). M6 TAHAN — F 1,1 mepet + TO 42% penalti; terlalu rapuh. Jadwal 2 hari: hari-1 = M1 + M4 (Excellent + Good, klaster beda); hari-2 = M5 (Excellent, klaster vol — kini slotnya bebas).",
        "Klarifikasi M3: 'BUANG' dari mesin (langkah 3) dan 'TAHAN' di pembahasan ini adalah verdict yang sama dari dua sudut pandang — TO di atas 70% berarti TIDAK BOLEH DISUBMIT apa adanya; 'TAHAN' berarti simpan kandidatnya, turunkan turnover lewat diet, lalu uji ulang; kalau dietnya gagal, ia tetap tidak layak submit — TAHAN bukan tiket menuju submit.",
        "Perhatikan M5: Excellent yang TIDAK disubmit hari-1 — bukan karena jelek, melainkan karena disiplin klaster. Inilah keputusan tersulit yang benar: menahan yang bagus demi aturan yang melindungimu dari self-correlation.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Latihan mandiri seperti ini = 'fire drill' reviewer. Di meja nyata tidak ada yang memegang kunci jawaban — yang ada hanya saringan yang sudah dilatih hingga menjadi refleks. Refleks itulah yang membedakan reviewer 1 tahun dari reviewer 1 bulan.",
      },
      reference: "M5: Excellent yang ditahan = disiplin klaster.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi strategi",
      prose: [
        "Lima pertanyaan refleksi — tidak ada jawaban tunggal yang benar, tetapi ada alasan yang kuat dan lemah.",
      ],
      tasks: [],
      summary: [
        "Empat saringan: triage → penalti turnover → klaster → ekonomi.",
        "Target harian: 2 Excellent dari 2 klaster berbeda.",
        "Sharpe tertinggi ≠ prioritas submit (K1: 2,9 ditahan).",
        "Menahan yang bagus bisa benar (diet turnover, slot klaster, komisi).",
        "Tulis satu kalimat alasan per keputusan — itu yang dibaca komite.",
      ],
      quiz: [
        {
          q: "K1 (S 2,9, TO 66%) tidak disubmit hari ini. Alasan terkuat?",
          options: [
            { text: "TO 66% butuh diet + slot klaster orth dipakai K7 yang lebih seimbang", why: "Tepat — dua alasan saringan 2 dan 3.", correct: true },
            { text: "Sharpe 2,9 terlalu tinggi sehingga mencurigakan", why: "Sharpe tinggi bukan alasan menahan — turnover & klaster yang jadi alasan." },
            { text: "K1 harus dibuang karena turnover-nya", why: "Terlalu keras: TO 66% < 70% (lolos gerbang) → TAHAN + diet, bukan BUANG." }
          ],
        },
        {
          q: "Dua Excellent hari ini yang tepat?",
          options: [
            { text: "K2 (slowrev, F 2,1) + K11 (correst, F 2,05) — beda klaster", why: "Benar — target 2 Excellent dari 2 klaster berbeda.", correct: true },
            { text: "K2 + K9 — keduanya bagus", why: "Satu klaster (slowrev) — melanggar aturan 1/klaster/hari." },
            { text: "K11 + K7 — keduanya orth/correst kuat", why: "K7 bukan Excellent (F 1,9) — targetnya Excellent." }
          ],
        },
        {
          q: "K8 (S 1,8, F 1,45) dibuang karena?",
          options: [
            { text: "Gagal sub-universe — sinyal tidak robust lintas segmen", why: "Benar.", correct: true },
            { text: "Sharpe di bawah 1,25", why: "S 1,8 lolos gerbang; yang gagal = check." },
            { text: "Turnover 35% terlalu tinggi", why: "35% < 40% — sehat." }
          ],
        },
        {
          q: "Kapan 'menahan kandidat bagus' adalah keputusan benar?",
          options: [
            { text: "Butuh diet turnover / slot klaster terpakai / menunggu komisi konsultan", why: "Tepat — tiga alasan sah.", correct: true },
            { text: "Tidak pernah — yang bagus harus segera disubmit", why: "Nafsu angka; disiplin klaster & ekonomi berkata lain." },
            { text: "Hanya bila Sharpe di bawah 1,5", why: "K1 (2,9) ditahan — bukan soal Sharpe rendah." }
          ],
        },
        {
          q: "Pelajaran terbesar capstone ini?",
          options: [
            { text: "Keputusan = saringan berurutan + satu kalimat alasan yang bisa dipertahankan", why: "Benar — itu otot reviewer.", correct: true },
            { text: "Selalu submit Sharpe tertinggi", why: "K1 membantahnya." },
            { text: "Semakin banyak submit semakin baik", why: "Kualitas klaster & Excellent yang dihitung." }
          ],
        }
      ],
      reference: "Saring berurutan, putuskan per klaster, tulis alasannya.",
    },
  ],
};
