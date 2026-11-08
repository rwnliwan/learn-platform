import type { V2Lesson } from "../lib/types";

const BCD13_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Aliran 100 ETH: deposit 100, mint 99, setelah DEX 97, masuk mixer (jejak terputus)."><text x="142" y="55.25" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Deposit (ETH)</text><rect x="150" y="42.25" width="314.0" height="18" rx="3" fill="var(--c1)"/><text x="470.0" y="55.25" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">100 ETH</text><text x="142" y="97.75" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Mint (BSC)</text><rect x="150" y="84.75" width="310.9" height="18" rx="3" fill="var(--c1)"/><text x="466.9" y="97.75" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">99 ETH</text><text x="142" y="140.25" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Tukar (DEX)</text><rect x="150" y="127.25" width="304.6" height="18" rx="3" fill="var(--c2)"/><text x="460.6" y="140.25" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">97 ETH</text><text x="142" y="182.75" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Mixer</text><rect x="150" y="169.75" width="0.0" height="18" rx="3" fill="var(--c4)"/><text x="156.0" y="182.75" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">jejak putus</text></svg>`;

export const bcd13: V2Lesson = {
  slug: "bcd13-cross-chain",
  track: "Blockchain Data Scientist",
  module: "Investigasi & Risiko",
  title: "BCD13 — Cross-Chain & Bridge Tracing",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "100 ETH yang melompat tiga chain",
      prose: [
        "Senin 09:00. Dompet S (kasus BCD12!) menerima 100 ETH hasil phishing. Senin 11:00, 100 ETH masuk ke bridge Stargate (Ethereum). Senin 11:12, 99 ETH (potong fee) MUNCUL di BSC sebagai token bungkus — di address yang BERBEDA. Senin 14:00, 97 ETH ditukar ke BNB via DEX. Senin 18:00, 97 BNB masuk mixer di BSC. Selasa pagi, analis membuka dashboard: `S mengirim ke bridge... lalu apa?` Jejaknya terputus di batas chain — karena tool-nya hanya bisa membaca SATU chain.",
        "Twist-nya: setiap lompatan MENINGGALKAN sidik jari — deposit event di Ethereum, mint event di BSC, swap di DEX. Tiga sidik jari, tiga chain, SATU aliran. Analis yang hanya bisa bcd10 (single-chain) melihat 4 potong puzzle terpisah. Analis cross-chain melihat 1 gambar utuh. Dan penjahat TAHU ini: mereka hop chain BUKAN untuk kecepatan, melainkan untuk memutus analis single-chain. Setiap hop = satu analis yang menyerah.",
        "Lesson ini: anatomi bridge (lock/mint, burn/release), cara menghubungkan deposit→mint (3 kunci: nominal, waktu, address), dan kapan jejak benar-benar putus (mixer) vs hanya tersamar (bridge biasa). Setelah ini, hop chain bukan lagi tembok — melainkan speed bump.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan dua model bridge (lock/mint vs liquidity pool) dan sidik jari masing-masing; (2) menghubungkan deposit di chain A dengan mint di chain B memakai 3 kunci; (3) menghitung skor kecocokan dan menentukan ambang investigasi; (4) mengenali kapan jejak putus total (mixer) vs tersamar (bridge); (5) merancang pelacakan multi-hop lintas 3+ chain.",
        "Daftar isi: 1) Cerita 100 ETH · 2) Anatomi bridge: dua model · 3) Tiga kunci penghubung · 4) Lab: match deposit-mint · 5) Kapan jejak putus · 6) Peta keputusan: bridge apa → teknik apa · 7) Mini-case: 3 hop, 2 bridge, 1 mixer · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Dana yang pindah chain = hilang`",
        type: "pitfall",
        body: "Pindah chain = pindah LEDGER, bukan pindah ke dimensi lain. Setiap lompatan mencatat DUA event (keluar di A, masuk di B) yang bisa dihubungkan via nominal + waktu + address. Yang benar-benar menghilangkan jejak = mixer (kriptografi), bukan bridge (akuntansi). Jangan menyerah di perbatasan chain.",
      },
      reference: "Hop chain = speed bump untuk analis cross-chain, tembok untuk yang single-chain.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Anatomi bridge: dua model, dua sidik jari",
      prose: [
        "MODEL 1 — LOCK/MINT (Stargate, Wormhole): kamu KUNCI 100 ETH di kontrak Ethereum → bridge MENCETAK (mint) 99 token bungkus di BSC. Sidik jari: `Deposit` event di chain A (jumlah, address, timestamp) + `Mint` event di chain B (jumlah − fee, address TUJUAN — bisa beda!). Total supply TERKUNCI di A = total bungkus di B (auditable!). Kelemahan: kontrak lock = honeypot raksasa ($2 miliar di-hack 2022, Wormhole!).",
        "MODEL 2 — LIQUIDITY POOL (Across, cBridge): TIDAK ada mint. Kamu deposit 100 ETH di A → `relayer` mengirim 99 ETH ASLI dari pool-nya di B (dalam hitungan detik!). Sidik jari: `Deposit` di A + `Transfer biasa` di B (BUKAN mint! dari address relayer, bukan kontrak bridge!). Lebih cepat (detik vs menit), tapi sidik jarinya LEBIH SAMAR — transfer dari relayer terlihat seperti transfer biasa! Cara bedakan: relayer punya POLA (banyak transfer kecil ke banyak address, fee konsisten).",
        "Contoh sidik jari konkret (kasus cerita): Ethereum, `Deposit(address 0xS, 100 ETH, t=11:00)` di kontrak Stargate. BSC, `Mint(address 0xQ, 99 USDC.e, t=11:12)` dari kontrak Stargate-BSC. Hubungan: nominal 100 → 99 (fee 1%!), waktu +12 menit (finality!), address 0xS → 0xQ (BEDA — pelaku ganti address tiap hop!). Tiga kunci inilah yang menghubungkan keduanya (langkah 3).",
        "Fee sebagai sidik jari: tiap bridge punya fee KHAS. Stargate 0,1–1%; Across 0,05–0,5%; cBridge 0,02–0,3%. Dari 100 → 99 (1%) = signature Stargate-ish. Dari 100 → 99,95 (0,05%) = Across-ish. Fee = `aksen bicara` bridge. Analis yang hafal fee 5 bridge populer bisa menebak bridge dari selisih nominal SAJA — bahkan sebelum melihat event-nya!",
        "Waktu sebagai sidik jari: lock/mint butuh FINALITY chain A (Ethereum: ~12 menit) + relay (~2 menit) = 10–15 menit. Liquidity pool: detik–2 menit (tidak tunggu finality penuh!). Dari 11:00 → 11:12 (12 menit) = lock/mint. Dari 11:00 → 11:01 (1 menit) = liquidity pool. Waktu = model bridge. Kombinasikan fee + waktu = identifikasi bridge dengan confidence TINGGI tanpa melihat kontraknya.",
        "Jebakan: `bridge aggregator` (LI.FI, Socket) memilihkan bridge TERBAIK per transaksi — pelaku yang sama bisa pakai Stargate hari ini, Across besok! Jangan asumsikan `pelaku ini selalu pakai bridge X`. Setiap hop = identifikasi ulang dari sidik jari (fee + waktu + event). Agregator membuat pola pelaku TIDAK KONSISTEN — yang konsisten hanya matematikanya (nominal, waktu).",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: fee + waktu = aksen bicara bridge",
        body: "Setiap bridge punya `aksen`: fee khas (0,05% vs 1%) dan waktu khas (1 menit vs 12 menit). Dari selisih nominal + selisih waktu, kamu bisa menebak bridge-nya bahkan sebelum membaca event. Hafalkan aksen 5 bridge populer — ia adalah kamus pertamamu.",
      },
      reference: "Lock/mint: Deposit + Mint, 10–15 mnt. Liquidity: Deposit + transfer relayer, detik–2 mnt.",
    },
    {
      id: "tiga-kunci",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga kunci: nominal, waktu, address",
      prose: [
        "Kunci 1 — NOMINAL: mint = deposit × (1 − fee). Toleransi: ±0,5% (slippage + fee varian). Contoh: deposit 100 ETH → cari mint 99–99,5 di chain B. Dari 10.000 mint/hari di BSC, filter nominal menyisakan ~50 kandidat. Kunci terkuat untuk ELIMINASI, bukan konfirmasi (banyak yang nominalnya mirip!).",
        "Kunci 2 — WAKTU: 0 < t_mint − t_deposit ≤ window. Window by model: lock/mint = 5–30 menit; liquidity = 10 detik–5 menit. Contoh: deposit 11:00 → cari mint 11:00–11:30. Dari 50 kandidat nominal, filter waktu menyisakan ~5. Jendela terlalu lebar = banyak false positive; terlalu sempit = miss (bridge delay!). Kalibrasi dari data historis bridge itu (median + 3×std).",
        "Kunci 3 — ADDRESS: kasus MUDAH: address sama (0xS di A = 0xS di B — EVM address format sama!). Kasus SULIT (cerita ini!): address BEDA (0xS → 0xQ). Solusi: peta heuristik — (a) deposit contract mencatat `target address` di event (baca field-nya!); (b) funding: 0xQ didanai gas oleh 0xS sebelumnya (taint!); (c) pola perilaku (selalu ganti tiap hop = signature pelaku). Tanpa satu pun: confidence RENDAH (2 kunci saja).",
        "Skor kecocokan: score = 0,5×nominal_match + 0,3×waktu_match + 0,2×address_match (bobot by kekuatan bukti). Contoh: nominal pas (1,0) + waktu 12 menit dalam window (1,0) + address beda tapi ada funding link (0,5) = 0,5+0,3+0,1 = 0,9 = TINGGI. Ambang: > 0,8 investigasi lanjut; 0,5–0,8 catat; < 0,5 abaikan. (Lab lesson ini: implementasi 3 kunci!)",
        "Contoh jebakan nyata: deposit 100 ETH (0xS, 11:00) → DUA mint 99 (0xQ 11:12, 0xZ 11:15). Mana yang benar? Kunci 3 memutuskan: 0xQ didanai 0xS (taint link!) → 0xQ. 0xZ = kebetulan (user lain pakai bridge sama!). Tanpa kunci 3: 50/50 = tebak-tebakan. Dengan kunci 3: 0,9 vs 0,6 = jelas. Inilah mengapa analis yang `hanya` memakai nominal + waktu kadang salah — dan mengapa lab ini memasukkan pengecoh!",
        "Multi-hop (3+ chain): ulangi per hop, confidence BERKALI (bukan rata-rata!): hop1 0,9 × hop2 0,85 × hop3 0,9 = 0,69. Tiga hop `tinggi` = 0,69 (SEDANG!). Pelajaran: tiap hop MENGURANGI kepastian — dokumentasikan confidence PER HOP, bukan hanya final. Laporan `dana mencapai mixer (confidence 69%)` JUJUR; `dana mencapai mixer` (tanpa angka) = overclaim.",
      ],
      formula: String.raw`\text{score} = 0{,}5 \cdot N + 0{,}3 \cdot W + 0{,}2 \cdot A \quad ; \quad C_{total} = \prod_i c_i`,
      formulaNote: "N/W/A = kecocokan nominal/waktu/address (0–1); C_total = confidence multi-hop = HASIL KALI per hop (bukan rata-rata!). > 0,8 investigasi; 0,5–0,8 catat; < 0,5 abaikan. Tiap hop mengurangi kepastian — kalikan, jangan ratakan.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Nominal sama = pasti orang yang sama`",
        type: "pitfall",
        body: "100 ETH deposit → 99 mint bisa jadi DUA ORANG berbeda yang kebetulan pakai bridge sama dalam 15 menit (lab: pengecoh 0xZ!). Nominal = filter eliminasi, BUKAN konfirmasi. Konfirmasi butuh 3 kunci, dan kunci 3 (address/funding) yang paling menentukan. Satu kunci = tebakan; tiga kunci = investigasi.",
      },
      reference: "Skor 3 kunci per hop; confidence total = perkalian. Dokumentasikan per hop.",
    },
    {
      id: "lab-bridge",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: match deposit → mint",
      prose: [
        "Data: 5 deposit (Ethereum) + 5 mint (BSC, termasuk 1 pengecoh!). Peta user + fee 0,1% + window 120 detik. Tugasmu: implementasikan 3 kunci (nominal ± fee, window waktu, peta user) dan pasangkan.",
        "Cara membaca: pairs = pasangan (deposit, mint); match_rate = berapa/5; unmatched = yang tidak ketemu. Interpretasi: d5 UNMATCHED — deposit 10.000 USDC dari 0xA4 tidak punya mint yang cocok (pengecoh m4 nominalnya pas tapi user-nya salah: 0xB9 bukan 0xB4!). Unmatched BUKAN gagal — ia TEMUAN: dana ini pergi ke tempat lain (bridge lain? belum di-mint? atau...?).",
        "Coba eksplorasi: perlebar window ke 600 detik — apakah d5 ketemu? (Tidak: user tetap tidak cocok.) Inilah pelajaran kunci 3: nominal + waktu saja TIDAK CUKUP jika address tidak mendukung.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `match_pairs` — 3 kunci: nominal, window, user_map" },
        { id: "t2", text: "Hitung match_rate dan daftar unmatched" },
        { id: "t3", text: "Jalankan; jelaskan mengapa d5 unmatched" },
      ],
      expected: "pairs 4 pasang · match_rate 4/5 · unmatched: ['d5']",
      note: {
        title: "💡 Intuisi: unmatched = temuan, bukan error",
        body: "d5 tidak ketemu BUKAN bug di kodemu — ia adalah HASIL: 10.000 USDC ini tidak melewati bridge ini (atau belum). Dalam investigasi nyata, `unmatched` = daftar untuk diselidiki lebih dalam (bridge lain? DEX? masih di wallet?). Jangan paksa match yang tidak ada.",
      },
      hints: [
        "Untuk tiap deposit: cari mint dengan token sama, |mamt - amt*(1-FEE)| < 0.01.",
        "Syarat waktu: 0 < mt - t <= WINDOW. Syarat user: user_map[ua] == mub.",
        "Tandai mint yang sudah dipakai (used_m) agar tidak dipakai dua kali.",
      ],
      code: {
        starter: `deposits = [\n    (\"d1\", \"0xA1\", \"USDC\", 10000.0, 100),\n    (\"d2\", \"0xA2\", \"USDC\", 5000.0, 150),\n    (\"d3\", \"0xA3\", \"WETH\", 2.5, 200),\n    (\"d4\", \"0xA1\", \"USDC\", 3000.0, 300),\n    (\"d5\", \"0xA4\", \"USDC\", 10000.0, 400),\n]\nmints = [\n    (\"m1\", \"0xB1\", \"USDC\", 9990.0, 160),\n    (\"m2\", \"0xB2\", \"USDC\", 4995.0, 210),\n    (\"m3\", \"0xB3\", \"WETH\", 2.4975, 260),\n    (\"m4\", \"0xB9\", \"USDC\", 9990.0, 460),\n    (\"m5\", \"0xB1\", \"USDC\", 2997.0, 370),\n]\nuser_map = {\"0xA1\": \"0xB1\", \"0xA2\": \"0xB2\", \"0xA3\": \"0xB3\", \"0xA4\": \"0xB4\"}\nFEE = 0.001\nWINDOW = 120\n\n# TULIS KODEMU\ndef match_pairs():\n    \n\npairs = match_pairs()\nprint(\"pairs:\", pairs)\nprint(f\"match_rate={len(pairs)}/{len(deposits)}\")\nunmatched = [d[0] for d in deposits if d[0] not in [p[0] for p in pairs]]\nprint(\"unmatched:\", unmatched)`,
        lockLines: 20,
        solution: `deposits = [\n    (\"d1\", \"0xA1\", \"USDC\", 10000.0, 100),\n    (\"d2\", \"0xA2\", \"USDC\", 5000.0, 150),\n    (\"d3\", \"0xA3\", \"WETH\", 2.5, 200),\n    (\"d4\", \"0xA1\", \"USDC\", 3000.0, 300),\n    (\"d5\", \"0xA4\", \"USDC\", 10000.0, 400),\n]\nmints = [\n    (\"m1\", \"0xB1\", \"USDC\", 9990.0, 160),\n    (\"m2\", \"0xB2\", \"USDC\", 4995.0, 210),\n    (\"m3\", \"0xB3\", \"WETH\", 2.4975, 260),\n    (\"m4\", \"0xB9\", \"USDC\", 9990.0, 460),\n    (\"m5\", \"0xB1\", \"USDC\", 2997.0, 370),\n]\nuser_map = {\"0xA1\": \"0xB1\", \"0xA2\": \"0xB2\", \"0xA3\": \"0xB3\", \"0xA4\": \"0xB4\"}\nFEE = 0.001\nWINDOW = 120\n\n# TULIS KODEMU\ndef match_pairs():\n    pairs = []\n    used_m = set()\n    for did, ua, tok, amt, t in deposits:\n        ub = user_map.get(ua)\n        best = None\n        for mid, mub, mtok, mamt, mt in mints:\n            if mid in used_m or mtok != tok:\n                continue\n            if ub is not None and mub != ub:\n                continue\n            if abs(mamt - amt * (1 - FEE)) > 0.01:\n                continue\n            if not (0 < mt - t <= WINDOW):\n                continue\n            best = mid\n            break\n        if best:\n            used_m.add(best)\n            pairs.append((did, best))\n    return pairs\n\npairs = match_pairs()\nprint(\"pairs:\", pairs)\nprint(f\"match_rate={len(pairs)}/{len(deposits)}\")\nunmatched = [d[0] for d in deposits if d[0] not in [p[0] for p in pairs]]\nprint(\"unmatched:\", unmatched)`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "match_rate 4/5", msg: "Harus 4 dari 5 deposit ter-match.", pattern: "match_rate=4/5" },
          { kind: "stdout_matches", task: "t3", label: "d1->m1", msg: "d1 harus match dengan m1.", pattern: "\\('d1', 'm1'\\)" },
          { kind: "stdout_matches", task: "t3", label: "d5 unmatched", msg: "d5 tidak punya pasangan (pengecoh m4 user-nya salah).", pattern: "unmatched: \\['d5'\\]" },
        ],
      },
      reference: "3 kunci berurutan: nominal (eliminasi) → waktu (filter) → address (konfirmasi).",
    },
    {
      id: "jejak-putus",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Kapan jejak benar-benar putus",
      prose: [
        "Aliran cerita: 100 ETH (Ethereum) → 99 (BSC) → 97 BNB (DEX) → mixer. Di titik mana jejak PUTUS? Bukan di bridge (3 kunci menghubungkan!), bukan di DEX (swap event tercatat!). Putusnya di MIXER: 97 BNB masuk pool bersama 10.000 BNB orang lain; yang keluar tidak bisa dihubungkan secara kriptografis. Inilah perbedaan TERSAMAR (bridge: bisa dibuka dengan 3 kunci) vs TERPUTUS (mixer: butuh heuristik lemah).",
        "Setelah mixer, yang tersisa hanya HEURISTIK (confidence RENDAH): timing (keluar 2 jam setelah masuk?), nominal (97 BNB keluar ≈ 97 masuk − fee?), dan pola (address baru didanai dari mixer?). Masing-masing 30–40% akurat; gabungan ~60%. Bandingkan dengan 3 kunci bridge (90%+). Inilah mengapa pelaku SELALU akhiri dengan mixer: ia satu-satunya yang benar-benar memutus (bukan menyamarkan).",
        "Angka penyusutan jejak: hop 1 (bridge): confidence 90%. Hop 2 (DEX swap): 85% (0,9×0,85 = 77%). Hop 3 (mixer): 60% → total 46%. Tiga hop = kurang dari setengah kepastian! Dan ini BELUM termasuk `chain hopping` ganda (ETH→BSC→Polygon→...): tiap chain baru = tool baru + format baru + waktu sinkronisasi. Biaya investigasi NAIK eksponensial dengan hop; itulah strategi pelaku: bukan menghilangkan jejak, melainkan membuat biaya mengikutinya > nilai dananya.",
        "Kapan MENYERAH (jujur)? Aturan: jika confidence total < 30% DAN nilai < biaya investigasi lanjut (mis. < $10.000 sisa), dokumentasikan sejauh yang terbukti + TUTUP dengan label `cold`. Menyerah BUKAN kegagalan — ia alokasi sumber daya. Yang gagal: menghabiskan 3 minggu untuk $5.000 dengan confidence 20%. Yang profesional: 3 hari untuk peta 46%, lalu putuskan by angka.",
        "Tapi JANGAN menyerah terlalu cepat: `sisa` (bcd12!) sering ada. Dari 100 ETH: 97 masuk mixer, TAPI 1 ETH tertinggal sebagai `dust` di address perantara (biaya gas tidak dihitung pelaku!). 1 ETH = $3.000 = cukup untuk melacak address itu SELAMANYA (setiap gerakannya terpantau!). Pelaku sempurna tidak ada; yang ada hanya pelaku yang cerobohnya belum ketahuan. Pantau sisa sekecil apa pun.",
      ],
      formula: String.raw`C_{total} = \prod_i c_i \quad ; \quad \text{lanjut} \iff C_{total} \ge 30\% \lor \text{nilai} > \text{biaya}`,
      formulaNote: "C_total = confidence perkalian per hop; lanjutkan jika confidence ≥30% ATAU nilai dana > biaya investigasi. Di bawah keduanya: dokumentasikan + tutup sebagai cold. Menyerah by angka, bukan frustrasi.",
      figure: {
        svg: BCD13_SVG,
        alt: "Diagram aliran 100 ETH: deposit 100, mint 99, DEX 97, mixer (jejak terputus).",
        caption: "Cara membaca: tiap batang = jumlah di tiap tahap (ETH); panah antar tahap = bridge/DEX/mixer; batang terakhir = 0 (jejak terputus). Interpretasi: bridge dan DEX hanya MENYAMARKAN (3 kunci bisa membuka); mixer MEMUTUS (hanya heuristik 60%). 97% dana mencapai mixer — tapi 1 ETH `dust` tertinggal = titik pantau permanen.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: tersamar ≠ terputus",
        body: "Bridge = tersamar (bisa dibuka dengan 3 kunci, confidence 90%). Mixer = terputus (hanya heuristik, 60%). DEX = tercatat penuh (swap event!). Jangan samakan ketiganya. Dan jangan kejar yang terputus dengan biaya lebih besar dari nilainya — pantau `sisa`-nya saja.",
      },
      reference: "Confidence perkalian per hop. Menyerah by angka (< 30% + nilai < biaya).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Bridge apa → teknik apa",
      prose: [
        "**Skenario 1 — Lock/mint (Stargate, Wormhole), address sama.** → Termudah: 3 kunci langsung (nominal + waktu + address sama). Confidence 90%+. Waktu: 1 jam.",
        "**Skenario 2 — Lock/mint, address beda.** → Butuh kunci 3 via funding/taint/event field. Confidence 70–85%. Waktu: 1 hari. (Kasus cerita!)",
        "**Skenario 3 — Liquidity pool (Across), transfer relayer.** → Identifikasi relayer dulu (pola transfer), baru hubungkan. Confidence 60–75%. Waktu: 2 hari. Sidik jari samar!",
        "**Skenario 4 — Bridge aggregator (LI.FI), tiap hop beda bridge.** → Identifikasi ulang per hop (fee + waktu). Confidence perkalian (0,9×0,7×0,8 = 50%). Waktu: 1 minggu. Pertimbangkan tutup jika nilai kecil.",
        "**Skenario 5 — Berakhir di mixer.** → Heuristik saja (timing, nominal). Confidence < 60%. Dokumentasikan + pantau sisa. Jangan habiskan 3 minggu.",
        "Aturan praktis 10 detik: `lihat fee + waktu → tebak model bridge → pilih teknik → hitung confidence → putuskan lanjut/tutup by angka`. Jangan mulai dari `coba-coba query`.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: identifikasi dulu, kejar kemudian",
        body: "Kesalahan pemula: langsung `kejar` tanpa tahu bridge apa (teknik salah = waktu terbuang). Profesional: 30 menit identifikasi (fee + waktu + event) → teknik yang tepat → confidence terukur. Urutan yang benar menghemat 80% waktu investigasi.",
      },
      reference: "Fee + waktu = identifikasi. Teknik mengikuti model bridge.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "3 hop, 2 bridge, 1 mixer: Rp45 miliar",
      prose: [
        "Kasus: 15.000 BNB (~Rp45 miliar) hasil exploit. Hop 1: BNB Chain → Ethereum via Stargate (lock/mint), 15.000 → 14.850 (fee 1%), 12 menit, address SAMA. Hop 2: Ethereum → Polygon via Across (liquidity), 14.850 → 14.820 (0,2%), 2 menit, address BEDA. Hop 3: Polygon → mixer (Tornado).",
        "**Pertanyaan:** (1) Hitung confidence per hop dan total. (2) Teknik apa per hop? (3) Lanjut atau tutup? (biaya investigasi Rp200 juta). (4) Apa `sisa` yang bisa dipantau?",
        "**Pembahasan:** (1) Hop 1: 3 kunci penuh, address sama → 0,92. Hop 2: liquidity + address beda, butuh identifikasi relayer → 0,70. Hop 3: mixer, heuristik → 0,55. Total: 0,92×0,70×0,55 = 0,354 = 35,4%. (2) Hop 1: match langsung. Hop 2: pola relayer + funding link. Hop 3: timing/nominal heuristik. (3) LANJUT: 35,4% > 30% DAN Rp45 miliar >> Rp200 juta. (4) Sisa: dust di address perantara hop 1–2 (gas!) + relayer Across yang mungkin teridentifikasi (entitas!) — dua titik pantau permanen.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rp45 miliar dengan confidence 35% = kasus yang DILANJUTKAN (nilai >> biaya). Tapi laporan harus JUJUR: `35%` tertulis besar, bukan disembunyikan. Keputusan bisnis (lanjut) dan kejujuran analitis (35%) bisa — dan harus — berjalan bersama.",
      },
      reference: "35,4% > 30% + Rp45M >> Rp200jt = LANJUT. Dokumentasikan confidence-nya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Deposit 100 ETH (11:00) → mint 99 (11:12). Model bridge dan alasannya?",
          options: [
            { text: "Lock/mint — 12 menit ≈ finality + relay; fee 1% khas", why: "Tepat. Waktu 10–15 menit = signature lock/mint (tunggu finality). Liquidity pool hanya detik–2 menit. Fee 1% konsisten.", correct: true },
            { text: "Liquidity pool — karena cepat", why: "12 menit TIDAK cepat untuk liquidity pool (detik–2 menit). Ini justru signature lock/mint." },
            { text: "Tidak bisa ditentukan dari waktu", why: "Bisa: tiap model punya `aksen waktu` yang berbeda jauh (12 mnt vs 1 mnt). Waktu = sidik jari model." },
            { text: "Bridge aggregator — pasti", why: "Aggregator = yang MEMILIHKAN bridge; model yang dipakai tetap salah satu dari dua. Waktu 12 menit menunjuk lock/mint." },
          ],
        },
        {
          q: "Dua mint 99 cocok (nominal + waktu) untuk satu deposit. Pembeda TEPAT?",
          options: [
            { text: "Pilih yang waktunya lebih dekat", why: "Selisih 3 menit (11:12 vs 11:15) tidak signifikan vs window 30 menit. Waktu tidak membedakan di sini." },
            { text: "Kunci 3: funding/taint link — mana yang didanai deposan", why: "Tepat. 0xQ didanai 0xS (taint!) vs 0xZ tidak terkait. Nominal + waktu = filter; address/funding = konfirmasi.", correct: true },
            { text: "Pilih acak — 50/50", why: "`Acak` = menyerah padahal ada kunci 3. 50/50 hanya jika SEMUA kunci gagal." },
            { text: "Keduanya benar — deposit ganda", why: "Deposit hanya 1x (100 ETH). Dua mint = satu benar + satu kebetulan (user lain). Keduanya benar = double-counting." },
          ],
        },
        {
          q: "Jejak: bridge (90%) → DEX (85%) → mixer (60%). Confidence total dan artinya?",
          options: [
            { text: "88% (rata-rata) — cukup untuk pengadilan", why: "Rata-rata SALAH untuk confidence berantai. 0,9×0,85×0,6 = 46% — jauh dari cukup untuk pengadilan." },
            { text: "46% (perkalian) — investigasi lanjut boleh, pengadilan belum", why: "Tepat. Perkalian, bukan rata-rata. 46% = cukup untuk pantau/selidiki, belum untuk vonis. Jujur tentang angka ini.", correct: true },
            { text: "100% — semua hop terhubung", why: "`Terhubung` ≠ `pasti`. Tiap hubung punya ketidakpastian yang BERKALI. Klaim 100% = overclaim." },
            { text: "0% — mixer menghapus semuanya", why: "Mixer menurunkan ke 60% (heuristik), bukan 0%. 46% total masih > ambang 30% untuk dilanjutkan." },
          ],
        },
        {
          q: "d5 (deposit 10.000 USDC) tidak match dengan mint manapun. Tindakan TEPAT?",
          options: [
            { text: "Paksa match dengan mint terdekat (m4)", why: "m4 user-nya 0xB9 ≠ 0xB4 (peta). Memaksa = false positive. Kunci 3 menolak — dengarkan!" },
            { text: "Catat sebagai unmatched — selidiki: bridge lain? belum mint? masih di wallet?", why: "Tepat. Unmatched = TEMUAN, bukan error. Daftar investigasi: cek bridge lain, cek status deposit (mungkin pending), pantau wallet 0xA4.", correct: true },
            { text: "Hapus d5 dari data — outlier", why: "Menghapus data yang tidak cocok = cherry-picking. d5 adalah 10.000 USDC nyata yang perlu dijelaskan." },
            { text: "Lebarkan window sampai ketemu", why: "Window 120 → 600 detik tetap tidak ketemu (user tidak cocok). Melebarkan window tanpa kunci 3 = menambah false positive, bukan jawaban." },
          ],
        },
        {
          q: "Fee 0,05% dan waktu 1 menit. Bridge apa?",
          options: [
            { text: "Lock/mint seperti Stargate", why: "Fee 1% + 12 menit = Stargate-ish. 0,05% + 1 menit BUKAN itu." },
            { text: "Liquidity pool seperti Across", why: "Tepat. Fee kecil (0,05–0,5%) + waktu detik–2 menit = signature liquidity pool (tidak tunggu finality).", correct: true },
            { text: "Mixer", why: "Mixer tidak punya `fee bridge` + waktu 1 menit; ia memutus jejak, bukan memindahkan." },
            { text: "DEX biasa", why: "DEX menukar token (bukan pindah chain) dan fee-nya 0,3%. Ini pola bridge." },
          ],
        },
        {
          q: "Setelah mixer, sisa yang paling berharga untuk dipantau?",
          options: [
            { text: "Tidak ada — sudah putus total", why: "Putus = heuristik 60%, bukan 0%. Dan selalu ada SISA (dust, relayer, funding). `Tidak ada` = menyerah terlalu cepat." },
            { text: "Dust/serpihan di address perantara + relayer teridentifikasi", why: "Tepat. 1 ETH dust = pantau selamanya. Relayer = entitas yang bisa diidentifikasi. Pelaku sempurna tidak ada; cerobohnya yang belum ketahuan.", correct: true },
            { text: "Harga token mixer", why: "Harga tidak membantu investigasi aliran dana. Ini metrik pasar, bukan forensik." },
            { text: "Jumlah total user mixer", why: "Statistik umum tidak menunjuk ke pelaku spesifik. Terlalu agregat untuk investigasi." },
          ],
        },
      ],
      summary: [
        "Dua model bridge: lock/mint (Deposit+Mint, 10–15 mnt) vs liquidity pool (transfer relayer, detik–2 mnt).",
        "Tiga kunci: nominal (eliminasi) + waktu (filter) + address (konfirmasi). Skor = 0,5N+0,3W+0,2A.",
        "Fee + waktu = aksen bridge (identifikasi tanpa lihat kontrak).",
        "Confidence multi-hop = PERKALIAN; tersamar (bridge) ≠ terputus (mixer).",
        "Lanjut jika C ≥30% atau nilai > biaya; unmatched = temuan, bukan error.",
        "Selalu cari `sisa` (dust, relayer) — titik pantau permanen.",
      ],
      next: { label: "BCD14 — Indexing Skala Besar", href: "/v2/learn/bcd14-indexing-skala-besar" },
    },
  ],
};
